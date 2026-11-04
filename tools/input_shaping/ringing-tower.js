/**
 * Marlin Firmware - Ringing Tower generator
 * https://marlinfw.org/tools/input_shaping/ringing-tower.html
 *
 * Builds a ringing tower (a thin-walled tower whose walls carry features that excite the
 * printer's resonances) and turns it into G-code that steps the input shaper frequency with
 * height. No slicer or STL is needed. The same model drives the 3D preview.
 *
 * Copyright (c) 2026 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * API (plain JavaScript, no dependencies; works in a browser or in Node):
 *
 *   RingingTower.defaults()              Fresh options object with every option and its default value.
 *   RingingTower.build(options)          Geometry only: { options, center, layers, steps, warnings, bounds }.
 *   RingingTower.toGcode(model)          G-code text for a model from build().
 *   RingingTower.generate(options)       { model, gcode, table, warnings } in one call.
 *   RingingTower.PATTERNS                Pattern ids and labels, for building a <select>.
 *   RingingTower.SHAPERS                 FT Motion shaper ids, labels and M493 C codes.
 *   RingingTower.validate(options)       Array of warning strings (also returned by build()).
 *
 * Coordinates are bed coordinates in millimeters. A layer is { index, z, hz, paths }. A path is
 * { kind: 'base' | 'wall' | 'diag', pts: [[x, y], ...] } and is printed in order, one extrusion
 * move per segment.
 *
 * Which axis does a feature test? A feature on a wall displaces the nozzle perpendicular to that wall,
 * so it accelerates the axis along the wall's normal: walls parallel to Y (left, right) test X; walls
 * parallel to X (front, back) test Y. Ringing then shows on the wall after the feature.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RingingTower = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // -- Choices ------------------------------------------------------------------------------

  var PATTERNS = [
    { id: 'step',     label: 'Step (one rib)' },
    { id: 'sine',     label: 'Sine' },
    { id: 'halfsine', label: 'Half sine (bumps)' },
    { id: 'triangle', label: 'Triangle' },
    { id: 'square',   label: 'Square' },
    { id: 'sawtooth', label: 'Sawtooth' },
    { id: 'none',     label: 'None (corners only)' }
  ];

  // C codes are those of M493 (see ft_types.h)
  var SHAPERS = [
    { id: 'zv',    label: 'ZV',        c: 1 },
    { id: 'zvd',   label: 'ZVD',       c: 2 },
    { id: 'zvdd',  label: 'ZVDD',      c: 3 },
    { id: 'zvddd', label: 'ZVDDD',     c: 4 },
    { id: 'ei',    label: 'EI',        c: 5 },
    { id: '2hei',  label: '2-Hump EI', c: 6 },
    { id: '3hei',  label: '3-Hump EI', c: 7 },
    { id: 'mzv',   label: 'MZV',       c: 8 }
  ];

  // 5x7 bitmaps for the indented axis letters. 'X' is lit.
  var FONT = {
    X: ['X...X', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', 'X...X'],
    Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
    A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
    B: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.']
  };

  function defaults() {
    return {
      // Printer
      printer: 'printer name',
      bedX: 220, bedY: 220,
      originCenter: false,        // true if (0,0) is the center of the bed (Delta, some CoreXY)
      // Placement
      offsetX: 0, offsetY: 0,     // tower center relative to the bed center
      rotation: 0,                // degrees; 45 isolates the A and B motors on CoreXY
      // Tower
      sizeX: 40, sizeY: 40,       // outside size of the walls, wall centerline
      height: 60,
      baseLayers: 3, baseMargin: 2,
      // What to test
      testX: true, testY: true,   // which axes get features
      diagonals: false,           // add the two diagonal walls (A and B motion)
      pattern: 'step',
      amplitude: 1.5,             // mm, size of the feature
      wavelength: 10,             // mm, for the periodic patterns
      ribWidth: 4,                // mm, width of the step
      resolution: 1,              // mm, longest segment of a curved pattern
      // Axis letters indented into the walls
      letters: true, letterCell: 1, letterDepth: 0.5, letterZ: 2, letterPos: 6,
      // Shaper
      shaperCommand: 'm493',      // 'm493' | 'm593' | 'none'
      shaper: 'zv',
      zeta: 0.1,
      startHz: 25, stepHz: 5, stepZ: 5, baseZ: 1, maxHz: 0,   // maxHz 0 = no limit
      // Printing
      filamentDiameter: 1.75, extrusionMult: 1,
      lineWidth: 0.4, layerHeight: 0.2,
      nozzleTemp: 205, bedTemp: 60,
      fanPercent: 100, fanFromLayer: 2,
      printSpeed: 100, firstLayerSpeed: 20, travelSpeed: 150,   // mm/s
      accel: 3000,                // M204 P and T; 0 = leave alone
      jerk: -1, junction: -1,     // M205 X Y / M205 J; -1 = leave alone
      retract: 1, retractSpeed: 30, zSpeed: 10,
      zOffset: 0,
      leveling: 'none',           // 'none' | 'g29' | 'm420'
      startGcode: 'G28',
      endGcode: 'M84'
    };
  }

  function merge(opts) {
    var o = defaults();
    if (opts) for (var k in opts) if (Object.prototype.hasOwnProperty.call(opts, k) && opts[k] !== undefined) o[k] = opts[k];
    return o;
  }

  // -- Small helpers ----------------------------------------------------------------------------

  var RAD = Math.PI / 180;
  function num(n, p) { var s = n.toFixed(p === undefined ? 3 : p); return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); }
  function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function pathLength(pts) { var d = 0; for (var i = 1; i < pts.length; i++) d += dist(pts[i - 1], pts[i]); return d; }

  // Snap the wavelength to a whole number of periods per wall so every pattern ends flat at the corners
  function effWavelength(o, len) {
    var wl = Math.max(o.wavelength, 0.1);
    return len / Math.max(1, Math.round(len / wl));
  }

  /**
   * Offset (mm, along the wall's outward normal) of a pattern at distance s along a wall of length len.
   * Zero at both ends so the corners stay sharp. Returns the value only; callers sample it.
   */
  function patternOffset(o, s, len) {
    var A = o.amplitude, wl = effWavelength(o, len), t;
    switch (o.pattern) {
      case 'step': {
        var half = o.ribWidth / 2, c = len / 2;
        return (s >= c - half && s <= c + half) ? A : 0;
      }
      case 'sine':     return A * Math.sin(2 * Math.PI * s / wl);
      case 'halfsine': return A * Math.abs(Math.sin(Math.PI * s / wl));
      case 'triangle': t = s / wl - Math.floor(s / wl + 1e-9); return A * (t < 0.25 ? 4 * t : t < 0.75 ? 2 - 4 * t : 4 * t - 4);
      case 'square':   return Math.sin(2 * Math.PI * s / wl) > 1e-9 ? A : 0;
      case 'sawtooth': t = s / wl - Math.floor(s / wl + 1e-9); return A * t;
      default:         return 0;
    }
  }

  // Breakpoints of a pattern along a wall, so that its edges get vertices
  function patternBreaks(o, len) {
    var b = [], wl = effWavelength(o, len), i;
    if (o.pattern === 'step') {
      b.push(len / 2 - o.ribWidth / 2, len / 2 + o.ribWidth / 2);
    }
    else if (o.pattern === 'square') {
      for (i = 0; i * wl / 2 <= len; i++) b.push(i * wl / 2);
    }
    else if (o.pattern === 'triangle') {
      for (i = 0; i * wl / 4 <= len; i++) b.push(i * wl / 4);
    }
    else if (o.pattern === 'sawtooth') {
      for (i = 0; i * wl <= len + 1e-9; i++) b.push(i * wl);
    }
    else if (o.pattern === 'halfsine') {
      for (i = 0; i * wl <= len; i++) b.push(i * wl);
    }
    return b;
  }

  /** Letter indentation intervals [[s0, s1], ...] along a wall at height z, or [] */
  function letterIntervals(o, ch, z, baseTop) {
    var rows = FONT[ch]; if (!rows) return [];
    var z0 = baseTop + o.letterZ, cell = o.letterCell, zr = z - z0;
    if (zr < 0 || zr >= rows.length * cell) return [];
    var row = rows[rows.length - 1 - Math.floor(zr / cell)], out = [], start = -1, i;
    for (i = 0; i <= row.length; i++) {
      var lit = i < row.length && row.charAt(i) === 'X';
      if (lit && start < 0) start = i;
      if (!lit && start >= 0) { out.push([o.letterPos + start * cell, o.letterPos + i * cell]); start = -1; }
    }
    return out;
  }

  /**
   * Points of one wall in wall-local coordinates: (s along the wall, d outward offset).
   * Combines the pattern and the letters (letters indent inward, so they subtract).
   * Every break point gets the value just before and just after it, so a jump in the
   * pattern or at the edge of a letter becomes a straight edge across the wall.
   */
  function wallProfile(o, len, z, baseTop, letter) {
    var EPS = 1e-6, breaks = [0, len], i, j;
    var pb = patternBreaks(o, len);
    for (i = 0; i < pb.length; i++) if (pb[i] > 0 && pb[i] < len) breaks.push(pb[i]);
    var ints = letter ? letterIntervals(o, letter, z, baseTop) : [];
    for (i = 0; i < ints.length; i++) breaks.push(ints[i][0], ints[i][1]);
    var curved = o.pattern === 'sine' || o.pattern === 'halfsine' || o.pattern === 'triangle';
    if (curved) for (var q = o.resolution; q < len; q += o.resolution) breaks.push(q);
    breaks.sort(function (x, y) { return x - y; });
    var uniq = [];
    breaks.forEach(function (v) { if (v >= 0 && v <= len && (!uniq.length || v - uniq[uniq.length - 1] > 1e-7)) uniq.push(v); });

    function f(s) {
      var d = o.pattern === 'none' ? 0 : patternOffset(o, s, len);
      for (var k = 0; k < ints.length; k++) if (s > ints[k][0] && s < ints[k][1]) { d -= o.letterDepth; break; }
      return d;
    }

    var pts = [];
    for (i = 0; i < uniq.length; i++) {
      var v = uniq[i];
      var left = v <= 0 ? null : f(v - EPS), right = v >= len ? null : f(v + EPS);
      if (left === null) pts.push([v, right]);
      else if (right === null) pts.push([v, left]);
      else if (Math.abs(left - right) > 1e-9) pts.push([v, left], [v, right]);
      else pts.push([v, f(v)]);
    }
    // The ends sit on the corners
    pts[0][1] = 0; pts[pts.length - 1][1] = 0;

    // Remove duplicate and collinear points
    var out = [];
    pts.forEach(function (pt) {
      var n = out.length;
      if (n && Math.abs(out[n - 1][0] - pt[0]) < 1e-9 && Math.abs(out[n - 1][1] - pt[1]) < 1e-9) return;
      if (n > 1) {
        var A = out[n - 2], B = out[n - 1];
        var cross = (B[0] - A[0]) * (pt[1] - A[1]) - (B[1] - A[1]) * (pt[0] - A[0]);
        if (Math.abs(cross) < 1e-9 && (B[0] - A[0]) * (pt[0] - B[0]) + (B[1] - A[1]) * (pt[1] - B[1]) > 0) out.pop();
      }
      out.push(pt);
    });
    return out;
  }

  // -- Shaper frequency steps -------------------------------------------------------------------

  function stepInfo(o) {
    var steps = [], n = Math.max(1, Math.ceil((o.height - o.baseZ) / o.stepZ));
    for (var k = 0; k < n; k++) {
      var hz = o.startHz + o.stepHz * k;
      if (o.maxHz > 0) hz = o.stepHz >= 0 ? Math.min(hz, o.maxHz) : Math.max(hz, o.maxHz);
      steps.push({ index: k, z0: o.baseZ + k * o.stepZ, z1: Math.min(o.height, o.baseZ + (k + 1) * o.stepZ), hz: hz });
    }
    return steps;
  }

  function hzAt(o, steps, zBottom) {
    if (zBottom < o.baseZ - 1e-9) return o.startHz;
    var k = Math.min(steps.length - 1, Math.floor((zBottom - o.baseZ) / o.stepZ + 1e-9));
    return steps[k].hz;
  }

  // -- Validation -------------------------------------------------------------------------------

  function validate(opts) {
    var o = merge(opts), w = [];
    if (!(o.sizeX > 0 && o.sizeY > 0)) w.push('Tower sizes must be positive.');
    if (!(o.height > 0)) w.push('Height must be positive.');
    if (!(o.layerHeight > 0 && o.lineWidth > 0)) w.push('Layer height and line width must be positive.');
    if (!(o.stepZ > 0)) w.push('Step height must be positive.');
    if (!o.testX && !o.testY && !o.diagonals) w.push('Nothing to test: enable X, Y or diagonals.');
    if (o.pattern !== 'none' && o.amplitude * 2 > Math.min(o.sizeX, o.sizeY)) w.push('Feature amplitude is large for the tower size.');
    if (o.pattern === 'step' && o.ribWidth > Math.min(o.sizeX, o.sizeY) - 4) w.push('The rib is almost as wide as the wall.');
    if (o.letters && o.letterPos + 5 * o.letterCell > Math.min(o.sizeX, o.sizeY)) w.push('The letters do not fit on the walls.');
    if (o.shaperCommand !== 'none' && o.startHz <= 0) w.push('Start frequency must be positive.');
    if (o.shaperCommand === 'm593' && o.shaper !== 'zv') w.push('M593 is the ZV shaper; the shaper type is ignored.');
    return w;
  }

  // -- Geometry ---------------------------------------------------------------------------------

  /** Place local (x,y) into bed coordinates: rotate about the tower center then translate. */
  function placer(o) {
    var cx = (o.originCenter ? 0 : o.bedX / 2) + o.offsetX, cy = (o.originCenter ? 0 : o.bedY / 2) + o.offsetY;
    var c = Math.cos(o.rotation * RAD), s = Math.sin(o.rotation * RAD);
    return { center: { x: cx, y: cy }, at: function (x, y) { return [cx + x * c - y * s, cy + x * s + y * c]; } };
  }

  function zigzagBase(o, hx, hy, place) {
    // Solid layer: lines along X across the footprint (expanded by baseMargin), alternating direction
    var x0 = -hx - o.baseMargin, x1 = hx + o.baseMargin, y0 = -hy - o.baseMargin, y1 = hy + o.baseMargin;
    var pts = [], dir = 1, y;
    for (y = y0 + o.lineWidth / 2; y <= y1 - o.lineWidth / 2 + 1e-9; y += o.lineWidth) {
      if (dir > 0) { pts.push(place.at(x0, y), place.at(x1, y)); } else { pts.push(place.at(x1, y), place.at(x0, y)); }
      dir = -dir;
    }
    return pts;
  }

  function build(opts) {
    var o = merge(opts), warnings = validate(o);
    var place = placer(o), hx = o.sizeX / 2, hy = o.sizeY / 2, h = o.layerHeight;
    var steps = stepInfo(o);
    var nLayers = Math.max(1, Math.round(o.height / h)), baseTop = o.baseLayers * h;
    var layers = [], k;

    // Walls in counter-clockwise order. The letters read left to right from outside.
    // 'axis' is the axis a feature on that wall tests: the one along the wall's normal.
    var walls = [
      { from: [-hx, -hy], dir: [1, 0],  nrm: [0, -1], len: o.sizeX, axis: 'Y' },
      { from: [ hx, -hy], dir: [0, 1],  nrm: [1, 0],  len: o.sizeY, axis: 'X' },
      { from: [ hx,  hy], dir: [-1, 0], nrm: [0, 1],  len: o.sizeX, axis: 'Y' },
      { from: [-hx,  hy], dir: [0, -1], nrm: [-1, 0], len: o.sizeY, axis: 'X' }
    ];

    var bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    function grow(p) { if (p[0] < bounds.minX) bounds.minX = p[0]; if (p[0] > bounds.maxX) bounds.maxX = p[0]; if (p[1] < bounds.minY) bounds.minY = p[1]; if (p[1] > bounds.maxY) bounds.maxY = p[1]; }

    for (k = 0; k < nLayers + o.baseLayers; k++) {
      var isBase = k < o.baseLayers, z = (k + 1) * h, paths = [];
      if (isBase) {
        var zz = zigzagBase(o, hx, hy, place);
        paths.push({ kind: 'base', pts: zz });
        zz.forEach(grow);
        layers.push({ index: k, z: z, hz: o.startHz, paths: paths });
        continue;
      }
      var zBottom = z - h - baseTop;   // height above the base, bottom of this layer
      // Wall loop
      var loop = [], wi, pi;
      for (wi = 0; wi < 4; wi++) {
        var W = walls[wi];
        var active = (W.axis === 'X' ? o.testX : o.testY);
        var letter = (o.letters && active) ? W.axis : null;
        var prof = wallProfile(active ? o : Object.assign({}, o, { pattern: 'none' }), W.len, z - h / 2, baseTop, letter);
        for (pi = 0; pi < prof.length; pi++) {
          var s = prof[pi][0], d = prof[pi][1];
          var px = W.from[0] + W.dir[0] * s + W.nrm[0] * d, py = W.from[1] + W.dir[1] * s + W.nrm[1] * d;
          if (wi > 0 && pi === 0 && loop.length && Math.abs(loop[loop.length - 1][0] - px) < 1e-9 && Math.abs(loop[loop.length - 1][1] - py) < 1e-9) continue;
          loop.push([px, py]);
        }
      }
      while (loop.length > 1 && Math.abs(loop[loop.length - 1][0] - loop[0][0]) < 1e-9 && Math.abs(loop[loop.length - 1][1] - loop[0][1]) < 1e-9) loop.pop();
      loop.push(loop[0].slice());          // close the loop
      var wallPts = loop.map(function (p) { return place.at(p[0], p[1]); });
      wallPts.forEach(grow);
      paths.push({ kind: 'wall', pts: wallPts });

      if (o.diagonals) {
        var dl = [[[-hx, -hy], [hx, hy]], [[hx, -hy], [-hx, hy]]];
        dl.forEach(function (seg, di) {
          var L = Math.hypot(seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]);
          var ux = (seg[1][0] - seg[0][0]) / L, uy = (seg[1][1] - seg[0][1]) / L, nx = -uy, ny = ux;
          var prof2 = wallProfile(o, L, z - h / 2, baseTop, null), pts2 = prof2.map(function (p) {
            return place.at(seg[0][0] + ux * p[0] + nx * p[1], seg[0][1] + uy * p[0] + ny * p[1]);
          });
          pts2.forEach(grow);
          paths.push({ kind: 'diag', pts: pts2 });
        });
      }
      layers.push({ index: k, z: z, hz: hzAt(o, steps, zBottom), paths: paths });
    }

    // Warnings that depend on the geometry
    var bx0 = o.originCenter ? -o.bedX / 2 : 0, bx1 = o.originCenter ? o.bedX / 2 : o.bedX;
    var by0 = o.originCenter ? -o.bedY / 2 : 0, by1 = o.originCenter ? o.bedY / 2 : o.bedY;
    if (bounds.minX < bx0 || bounds.maxX > bx1 || bounds.minY < by0 || bounds.maxY > by1) warnings.push('The tower does not fit on the bed.');

    return { options: o, center: place.center, layers: layers, steps: steps, baseTop: baseTop, warnings: warnings, bounds: bounds };
  }

  // -- G-code -----------------------------------------------------------------------------------

  function shaperLines(o, hz) {
    if (o.shaperCommand === 'none') return [];
    var axX = o.testX, axY = o.testY, out = [];
    if (o.shaperCommand === 'm593') {
      var both = (axX && axY) || o.diagonals || (!axX && !axY);
      if (both) { out.push('M593 X F' + num(hz, 2) + ' D' + num(o.zeta, 3), 'M593 Y F' + num(hz, 2) + ' D' + num(o.zeta, 3)); }
      else out.push('M593 ' + (axX ? 'X' : 'Y') + ' F' + num(hz, 2) + ' D' + num(o.zeta, 3));
      return out;
    }
    var c = SHAPERS.filter(function (s) { return s.id === o.shaper; })[0] || SHAPERS[0];
    var flag = (axX && !axY && !o.diagonals) ? ' X' : (axY && !axX && !o.diagonals) ? ' Y' : '';
    return ['M493 S1' + flag + ' C' + c.c + ' A' + num(hz, 2) + ' I' + num(o.zeta, 3)];
  }

  function toGcode(model) {
    var o = model.options, g = [], area = o.lineWidth * o.layerHeight;
    var fil = Math.PI * Math.pow(o.filamentDiameter / 2, 2), ePerMM = area * o.extrusionMult / fil;
    var mm = function (v) { return num(v * 60, 0); };   // mm/s -> mm/min
    var cur = null, lastHz = null;

    function move(p, f, e) { g.push('G1 X' + num(p[0], 3) + ' Y' + num(p[1], 3) + (e !== undefined ? ' E' + num(e, 5) : '') + (f ? ' F' + f : '')); cur = p; }

    g.push('; -------------------------------------------',
           '; Ringing Tower for Marlin - https://marlinfw.org/tools/input_shaping/ringing-tower.html',
           '; Printer: ' + o.printer,
           '; Created: ' + new Date().toString(),
           ';',
           '; Tower: ' + num(o.sizeX) + ' x ' + num(o.sizeY) + ' x ' + num(o.height) + ' mm at (' + num(model.center.x) + ', ' + num(model.center.y) + '), rotated ' + num(o.rotation) + ' deg',
           '; Pattern: ' + o.pattern + ', amplitude ' + num(o.amplitude) + ' mm, testing' + (o.testX ? ' X' : '') + (o.testY ? ' Y' : '') + (o.diagonals ? ' diagonals' : ''),
           '; Print speed ' + num(o.printSpeed) + ' mm/s, acceleration ' + num(o.accel) + ' mm/s2',
           ';');
    if (o.shaperCommand !== 'none') {
      g.push('; Frequency steps (' + (o.shaperCommand === 'm593' ? 'M593 ZV' : 'M493 ' + o.shaper.toUpperCase()) + ', zeta ' + num(o.zeta) + '):');
      model.steps.forEach(function (s) { g.push(';   Z ' + num(s.z0) + ' - ' + num(s.z1) + ' mm : ' + num(s.hz, 2) + ' Hz'); });
      g.push(';');
    }
    g.push('; -------------------------------------------',
           'G21 ; Millimeter units', 'G90 ; Absolute positioning', 'M83 ; Relative extrusion');
    if (o.nozzleTemp) g.push('M104 S' + o.nozzleTemp);
    if (o.bedTemp) g.push('M140 S' + o.bedTemp);
    if (o.bedTemp) g.push('M190 S' + o.bedTemp);
    if (o.nozzleTemp) g.push('M109 S' + o.nozzleTemp);
    if (o.startGcode.trim()) g.push(o.startGcode.trim());
    if (o.leveling === 'g29') g.push('G29 ; Bed leveling');
    else if (o.leveling === 'm420') g.push('M420 S1 ; Enable bed leveling');
    g.push('M205 S0 T0 ; Minimum feedrates');
    if (o.accel > 0) g.push('M204 P' + o.accel + ' T' + o.accel + ' ; Print and travel acceleration');
    if (o.jerk >= 0) g.push('M205 X' + o.jerk + ' Y' + o.jerk + ' ; Jerk');
    if (o.junction >= 0) g.push('M205 J' + o.junction + ' ; Junction deviation');
    if (o.zOffset) g.push('M290 Z' + num(o.zOffset) + ' ; Babystep Z offset');
    g.push('G92 E0');

    // Wipe in at the start of the first path
    var retracted = false;
    function retract() { if (o.retract > 0 && !retracted) { g.push('G1 E' + num(-o.retract, 3) + ' F' + mm(o.retractSpeed)); retracted = true; } }
    function unretract() { if (o.retract > 0 && retracted) { g.push('G1 E' + num(o.retract, 3) + ' F' + mm(o.retractSpeed)); retracted = false; } }

    model.layers.forEach(function (layer, li) {
      g.push('', '; Layer ' + (li + 1) + ' of ' + model.layers.length + ', Z ' + num(layer.z));
      if (li === 0) g.push('G1 Z' + num(layer.z + 0.0) + ' F' + mm(o.zSpeed));
      else g.push('G1 Z' + num(layer.z) + ' F' + mm(o.zSpeed));
      if (li === o.fanFromLayer - 1 || (li === 0 && o.fanFromLayer <= 1)) g.push('M106 S' + Math.round(o.fanPercent * 255 / 100));
      // Shaper step: when the layer is a tower layer and the frequency changed
      if (layer.paths.some(function (p) { return p.kind !== 'base'; }) && layer.hz !== lastHz) {
        g.push('; Z ' + num(layer.z - o.layerHeight - model.baseTop) + ' mm above the base: ' + num(layer.hz, 2) + ' Hz');
        shaperLines(o, layer.hz).forEach(function (l) { g.push(l); });
        lastHz = layer.hz;
      }
      var speed = li === 0 ? o.firstLayerSpeed : o.printSpeed;
      layer.paths.forEach(function (path) {
        var start = path.pts[0];
        if (!cur || dist(cur, start) > 2) retract();
        move(start, mm(o.travelSpeed));
        unretract();
        var first = true;
        for (var i = 1; i < path.pts.length; i++) {
          var L = dist(path.pts[i - 1], path.pts[i]);
          if (L < 1e-6) continue;
          move(path.pts[i], first ? mm(speed) : undefined, L * ePerMM);
          first = false;
        }
      });
    });
    retract();
    g.push('', '; End', 'G1 Z' + num(model.layers[model.layers.length - 1].z + 10) + ' F' + mm(o.zSpeed), 'M106 S0', 'M104 S0', 'M140 S0');
    if (o.shaperCommand === 'm493') g.push('M493 S0 ; Standard motion');
    if (o.shaperCommand === 'm593') g.push('M593 F0 ; Input shaping off');
    if (o.endGcode.trim()) g.push(o.endGcode.trim());
    return g.join('\n') + '\n';
  }

  function table(model) {
    var o = model.options;
    return model.steps.map(function (s) { return num(s.z0) + ' - ' + num(s.z1) + ' mm: ' + num(s.hz, 2) + ' Hz'; }).join('\n');
  }

  function generate(opts) {
    var model = build(opts);
    return { model: model, gcode: toGcode(model), table: table(model), warnings: model.warnings };
  }

  return { defaults: defaults, build: build, toGcode: toGcode, generate: generate, validate: validate, PATTERNS: PATTERNS, SHAPERS: SHAPERS, FONT: FONT };
}));
