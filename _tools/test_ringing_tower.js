// Tests for tools/input_shaping/ringing-tower.js. Run: node _tools/test_ringing_tower.js
const assert = require('assert');
const path = require('path');
const RT = require(path.resolve(process.argv[2] || path.join(__dirname, '../tools/input_shaping/ringing-tower.js')));
let n = 0;
function t(name, fn) { fn(); n++; console.log('ok  ' + name); }

// Replay G-code: returns moves with z, hz (last shaper frequency), extrusion
function replay(gcode) {
  const mv = []; let x = 0, y = 0, z = 0, hz = null, E = 0, rel = false, retr = 0;
  const cmds = [];
  for (const raw of gcode.split('\n')) {
    const l = raw.split(';')[0].trim(); if (!l) continue;
    const w = {}; for (const m of l.matchAll(/([A-Z])\s*(-?\d*\.?\d+)/g)) w[m[1]] = parseFloat(m[2]);
    const c = l.split(/\s+/)[0];
    if (c === 'M493') { cmds.push(l); if (w.A !== undefined) hz = w.A; }
    else if (c === 'M593') { cmds.push(l); if (w.F !== undefined) hz = w.F; }
    else if (c === 'G1') {
      const nx = w.X !== undefined ? w.X : x, ny = w.Y !== undefined ? w.Y : y;
      if (w.Z !== undefined) z = w.Z;
      if (w.X !== undefined || w.Y !== undefined) {
        mv.push({ x0: x, y0: y, x: nx, y: ny, z, hz, e: w.E !== undefined ? w.E : 0 });
      } else if (w.E !== undefined) retr += w.E;
      x = nx; y = ny;
    }
  }
  return { mv, cmds, retr };
}

const base = { bedX: 220, bedY: 220 };

t('defaults build with no warnings', () => {
  const m = RT.build(base); assert.deepStrictEqual(m.warnings, []);
  assert.strictEqual(m.layers.length, 300 + 3);
});

t('G-code is well formed and stays on the bed', () => {
  const { gcode } = RT.generate(base);
  assert(!/NaN|undefined|Infinity/.test(gcode));
  const r = replay(gcode);
  r.mv.forEach(m => { assert(m.x >= 0 && m.x <= 220 && m.y >= 0 && m.y <= 220, 'off bed ' + m.x + ',' + m.y); });
  assert(Math.abs(r.retr + 1) < 1e-6, 'retracts must balance except the final one, got ' + r.retr);
});

t('tower is centered on the bed and follows the offset', () => {
  let m = RT.build(base); assert.strictEqual(m.center.x, 110); assert.strictEqual(m.center.y, 110);
  assert(Math.abs((m.bounds.minX + m.bounds.maxX) / 2 - 110) < 1.0 + 0.25);   // ribs push one side out
  m = RT.build(Object.assign({}, base, { offsetX: 30, offsetY: -20 })); assert.strictEqual(m.center.x, 140); assert.strictEqual(m.center.y, 90);
  m = RT.build(Object.assign({}, base, { originCenter: true, offsetX: 5 })); assert.strictEqual(m.center.x, 5); assert.strictEqual(m.center.y, 0);
  assert.deepStrictEqual(m.warnings, []);
});

t('a tower outside the bed is flagged', () => {
  const m = RT.build(Object.assign({}, base, { offsetX: 100 }));
  assert(m.warnings.some(w => /fit on the bed/.test(w)));
});

t('rotation by 45 degrees spreads the bounding box', () => {
  const m = RT.build(Object.assign({}, base, { rotation: 45, pattern: 'none', letters: false, baseMargin: 0 }));
  const w = m.bounds.maxX - m.bounds.minX;
  assert(Math.abs(w - 40 * Math.SQRT2) < 0.5, 'width ' + w);
});

t('frequency steps land on the right layers', () => {
  const o = Object.assign({}, base, { startHz: 25, stepHz: 5, stepZ: 5, baseZ: 1, height: 30 });
  const model = RT.build(o);
  const { gcode } = RT.generate(o);
  const r = replay(gcode);
  const bt = model.baseTop;
  // Every wall move: hz must equal the step for the height of the layer bottom above the base
  r.mv.filter(m => m.e > 0 && m.z > bt + 1e-6).forEach(m => {
    const zb = m.z - 0.2 - bt;
    const k = zb < 1 - 1e-9 ? 0 : Math.floor((zb - 1) / 5 + 1e-9);
    assert.strictEqual(m.hz, 25 + 5 * k, 'z=' + m.z + ' zb=' + zb + ' hz=' + m.hz);
  });
  assert.deepStrictEqual(model.steps.map(s => s.hz), [25, 30, 35, 40, 45, 50]);
  assert(model.steps[model.steps.length - 1].z1 === 30);
});

t('maxHz caps the sweep', () => {
  const m = RT.build(Object.assign({}, base, { startHz: 25, stepHz: 10, maxHz: 50, height: 60 }));
  assert(Math.max.apply(null, m.steps.map(s => s.hz)) === 50);
});

t('extrusion matches the line volume', () => {
  const o = Object.assign({}, base, { lineWidth: 0.4, layerHeight: 0.2, filamentDiameter: 1.75, extrusionMult: 1 });
  const r = replay(RT.generate(o).gcode);
  const k = 0.4 * 0.2 / (Math.PI * 0.875 * 0.875);
  r.mv.filter(m => m.e > 0).forEach(m => {
    const L = Math.hypot(m.x - m.x0, m.y - m.y0);
    assert(Math.abs(m.e - L * k) < 1e-4, 'E ' + m.e + ' for ' + L + ' mm');
  });
});

t('every pattern ends flat at the corners and the loop closes', () => {
  RT.PATTERNS.forEach(p => {
    const m = RT.build(Object.assign({}, base, { pattern: p.id, letters: false, height: 10 }));
    const L = m.layers[m.layers.length - 1], w = L.paths.filter(q => q.kind === 'wall')[0].pts;
    assert.deepStrictEqual(w[0].map(v => +v.toFixed(6)), w[w.length - 1].map(v => +v.toFixed(6)), p.id + ' loop');
    const corners = [[90, 90], [130, 90], [130, 130], [90, 130]];
    corners.forEach(c => assert(w.some(q => Math.hypot(q[0] - c[0], q[1] - c[1]) < 1e-6), p.id + ' corner ' + c));
  });
});

t('step rib is centered, with the requested width and amplitude', () => {
  const m = RT.build(Object.assign({}, base, { pattern: 'step', ribWidth: 4, amplitude: 2, letters: false, testY: false, testX: true, height: 4 }));
  const w = m.layers[m.layers.length - 1].paths[0].pts;
  // The right wall (x = 130) carries the rib toward +x
  const rib = w.filter(q => Math.abs(q[0] - 132) < 1e-6);
  assert(rib.length === 2, 'rib points ' + rib.length);
  assert(Math.abs(Math.abs(rib[0][1] - rib[1][1]) - 4) < 1e-6);
});

t('step rib has vertical edges (no slanted ramps) and the loop has no duplicate points', () => {
  const m = RT.build(Object.assign({}, base, { pattern: 'step', letters: false, height: 4, ribWidth: 4, amplitude: 2 }));
  const w = m.layers[m.layers.length - 1].paths[0].pts;
  for (let i = 1; i < w.length; i++) assert(Math.hypot(w[i][0] - w[i-1][0], w[i][1] - w[i-1][1]) > 1e-6, 'duplicate point ' + i);
  // 4 corners + 2 ribs x 4 points per rib per axis side (2 sides each for X and Y) -> every segment is axis-aligned
  for (let i = 1; i < w.length; i++) assert(Math.abs(w[i][0] - w[i-1][0]) < 1e-6 || Math.abs(w[i][1] - w[i-1][1]) < 1e-6, 'slanted segment at ' + i + ': ' + w[i-1] + ' -> ' + w[i]);
});

t('axis selection: Y only leaves the left and right walls plain', () => {
  const m = RT.build(Object.assign({}, base, { pattern: 'step', testX: false, testY: true, letters: false, height: 4 }));
  const w = m.layers[m.layers.length - 1].paths[0].pts;
  assert(!w.some(q => q[0] > 130 + 1e-6 || q[0] < 90 - 1e-6), 'X walls should be straight');
  assert(w.some(q => q[1] < 90 - 1e-6 || q[1] > 130 + 1e-6), 'Y walls should have ribs');
});

t('letters indent the wall at the right heights', () => {
  const o = Object.assign({}, base, { pattern: 'none', letters: true, letterCell: 1, letterDepth: 0.5, letterZ: 2, letterPos: 6, height: 20, layerHeight: 0.2, baseLayers: 2 });
  const m = RT.build(o), bt = m.baseTop;
  let indented = 0, plain = 0;
  m.layers.filter(L => L.paths[0].kind === 'wall').forEach(L => {
    const w = L.paths[0].pts, inward = w.some(q => Math.abs(q[0] - 129.5) < 1e-6);   // right wall indent (depth 0.5)
    const zRel = L.z - 0.1 - (bt + 2);
    if (zRel >= 0 && zRel < 7) { assert(inward, 'letter layer z=' + L.z); indented++; } else { assert(!inward, 'plain layer z=' + L.z); plain++; }
  });
  assert(indented === 35 && plain > 0, 'indented layers ' + indented);
});

t('diagonals add two 45-degree walls per layer', () => {
  const m = RT.build(Object.assign({}, base, { diagonals: true, pattern: 'none', height: 4 }));
  const L = m.layers[m.layers.length - 1], d = L.paths.filter(p => p.kind === 'diag');
  assert(d.length === 2);
  d.forEach(p => { const a = p.pts[0], b = p.pts[p.pts.length - 1]; assert(Math.abs(Math.abs(b[0] - a[0]) - Math.abs(b[1] - a[1])) < 1e-6); });
});

t('M493 flags follow the selected axes', () => {
  const g = (o) => RT.generate(Object.assign({}, base, o, { height: 6, letters: false }))
    .gcode.split('\n').filter(l => l.startsWith('M493 S1'));
  assert(g({ testX: true, testY: false })[0].startsWith('M493 S1 X C1 A25 I0.1'));
  assert(g({ testX: false, testY: true })[0].startsWith('M493 S1 Y C1'));
  assert(g({ testX: true, testY: true })[0].startsWith('M493 S1 C1 A25'));
  assert(g({ shaper: 'mzv' })[0].includes(' C8 '));
});

t('M593 output uses F and D', () => {
  const l = RT.generate(Object.assign({}, base, { shaperCommand: 'm593', height: 6 })).gcode.split('\n').filter(x => x.startsWith('M593'));
  assert(l.length >= 2 && /^M593 X F25 D0.1$/.test(l[0]) && /^M593 Y F25 D0.1$/.test(l[1]), l.slice(0, 2).join('|'));
});

t('shaperCommand none emits no shaper commands', () => {
  const g = RT.generate(Object.assign({}, base, { shaperCommand: 'none', height: 6 })).gcode;
  assert(!/^M(493|593)/m.test(g));
});

t('validation catches bad input', () => {
  assert(RT.validate({ sizeX: 0 }).length > 0);
  assert(RT.validate({ testX: false, testY: false, diagonals: false }).some(w => /Nothing to test/.test(w)));
  assert(RT.validate({ stepZ: 0 }).length > 0);
});

t('move count stays reasonable for the defaults', () => {
  const { gcode } = RT.generate(base);
  const lines = gcode.split('\n').length;
  console.log('    default tower: ' + lines + ' lines, ' + (gcode.length / 1024).toFixed(0) + ' KB');
  assert(lines < 120000);
});

console.log('\n' + n + ' tests passed');
