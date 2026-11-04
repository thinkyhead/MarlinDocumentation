/**
 * Marlin Firmware - Ringing Tower page
 * Copyright (c) 2026 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
 * GNU General Public License v3 or later, see <https://www.gnu.org/licenses/>.
 *
 * ES module. Builds the options form from FIELDS, regenerates the tower on every change, updates the
 * 3D preview, and offers the G-code for download. The markup it creates uses plain classes
 * (rt-group, rt-field, rt-help, ...) so the page can be styled from CSS alone.
 */
import { createView } from './ringing-tower-view.js';

const RT = window.RingingTower;
const SETTINGS_VERSION = '1';
const STORE = 'ringing-tower-settings';

// group, key, label, type, extras. type: num | bool | select | text | area
const FIELDS = [
  ['Printer', [
    ['printer', 'Printer name', 'text'],
    ['bedX', 'Bed size X', 'num', { unit: 'mm', min: 20 }],
    ['bedY', 'Bed size Y', 'num', { unit: 'mm', min: 20 }],
    ['originCenter', 'Origin at bed center', 'bool', { help: 'Delta and some CoreXY printers put (0,0) at the center of the bed.' }],
  ]],
  ['Placement', [
    ['offsetX', 'Offset X', 'num', { unit: 'mm', help: 'The tower starts centered on the bed. Move it with the offsets.' }],
    ['offsetY', 'Offset Y', 'num', { unit: 'mm' }],
    ['rotation', 'Rotation', 'num', { unit: '°', help: 'On a CoreXY printer rotate the tower 45° to isolate the A and B motors.' }],
  ]],
  ['Tower', [
    ['sizeX', 'Size X', 'num', { unit: 'mm', min: 10 }],
    ['sizeY', 'Size Y', 'num', { unit: 'mm', min: 10 }],
    ['height', 'Height', 'num', { unit: 'mm', min: 1 }],
    ['baseLayers', 'Base layers', 'num', { min: 1, step: 1 }],
    ['baseMargin', 'Base margin', 'num', { unit: 'mm' }],
  ]],
  ['What to test', [
    ['testX', 'Test X', 'bool', { help: 'Features on the left and right walls shake the X axis.' }],
    ['testY', 'Test Y', 'bool', { help: 'Features on the front and back walls shake the Y axis.' }],
    ['diagonals', 'Diagonal walls', 'bool', { help: 'Adds two diagonal walls that move X and Y together (A and B on CoreXY).' }],
    ['pattern', 'Pattern', 'select', { options: RT.PATTERNS.map(p => [p.id, p.label]) }],
    ['amplitude', 'Amplitude', 'num', { unit: 'mm', min: 0.1 }],
    ['wavelength', 'Wavelength', 'num', { unit: 'mm', min: 1, help: 'Rounded so a whole number of periods fits on each wall.' }],
    ['ribWidth', 'Rib width', 'num', { unit: 'mm', min: 0.5, help: 'For the step pattern.' }],
    ['letters', 'Axis letters', 'bool', { help: 'Indent an X or Y into the wall that tests that axis.' }],
  ]],
  ['Input shaping', [
    ['shaperCommand', 'Command', 'select', { options: [['m493', 'M493 (Fixed-Time Motion)'], ['m593', 'M593 (ZV Input Shaping)'], ['none', 'None']] }],
    ['shaper', 'Shaper', 'select', { options: RT.SHAPERS.map(s => [s.id, s.label]), help: 'M493 only.' }],
    ['zeta', 'Damping ratio (zeta)', 'num', { step: 0.01, min: 0 }],
    ['startHz', 'Start frequency', 'num', { unit: 'Hz', min: 1 }],
    ['stepHz', 'Step', 'num', { unit: 'Hz' }],
    ['stepZ', 'Step height', 'num', { unit: 'mm', min: 0.2 }],
    ['baseZ', 'First step at', 'num', { unit: 'mm', help: 'Height above the base where the frequency first increases.' }],
    ['maxHz', 'Maximum frequency', 'num', { unit: 'Hz', help: '0 for no limit.' }],
  ]],
  ['Printing', [
    ['filamentDiameter', 'Filament diameter', 'num', { unit: 'mm', step: 0.01 }],
    ['extrusionMult', 'Extrusion multiplier', 'num', { step: 0.01 }],
    ['lineWidth', 'Line width', 'num', { unit: 'mm', step: 0.01 }],
    ['layerHeight', 'Layer height', 'num', { unit: 'mm', step: 0.01 }],
    ['nozzleTemp', 'Nozzle temperature', 'num', { unit: '°C' }],
    ['bedTemp', 'Bed temperature', 'num', { unit: '°C' }],
    ['fanPercent', 'Fan speed', 'num', { unit: '%', min: 0 }],
    ['fanFromLayer', 'Fan from layer', 'num', { min: 1, step: 1 }],
    ['printSpeed', 'Print speed', 'num', { unit: 'mm/s' }],
    ['firstLayerSpeed', 'First layer speed', 'num', { unit: 'mm/s' }],
    ['travelSpeed', 'Travel speed', 'num', { unit: 'mm/s' }],
    ['accel', 'Acceleration', 'num', { unit: 'mm/s²', help: 'Sets M204 P and T. 0 leaves it alone. Ringing shows best at high acceleration.' }],
    ['jerk', 'Jerk', 'num', { unit: 'mm/s', help: '-1 leaves it alone.' }],
    ['junction', 'Junction deviation', 'num', { unit: 'mm', step: 0.001, help: '-1 leaves it alone.' }],
    ['retract', 'Retraction', 'num', { unit: 'mm', step: 0.1 }],
    ['retractSpeed', 'Retraction speed', 'num', { unit: 'mm/s' }],
    ['zOffset', 'Z offset', 'num', { unit: 'mm', step: 0.01, help: 'Applied with M290.' }],
    ['leveling', 'Bed leveling', 'select', { options: [['none', 'None'], ['g29', 'G29'], ['m420', 'M420 S1']] }],
  ]],
  ['G-code', [
    ['startGcode', 'Start G-code', 'area', { help: 'Runs after heating. Home here, and park or prime if you like.' }],
    ['endGcode', 'End G-code', 'area'],
  ]],
];

const $ = (sel, root = document) => root.querySelector(sel);

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs) if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
  kids.forEach(c => e.append(c));
  return e;
}

function buildForm(form, opts) {
  FIELDS.forEach(([group, fields]) => {
    const fs = el('fieldset', { class: 'rt-group' }, el('legend', {}, group));
    fields.forEach(([key, label, type, x = {}]) => {
      const id = 'rt-' + key;
      let input;
      if (type === 'bool') { input = el('input', { type: 'checkbox', id }); input.checked = !!opts[key]; }
      else if (type === 'select') { input = el('select', { id }); x.options.forEach(([v, t]) => { const o = el('option', { value: v }, t); input.append(o); }); input.value = opts[key]; }
      else if (type === 'area') { input = el('textarea', { id, rows: 3 }); input.value = opts[key]; }
      else if (type === 'text') { input = el('input', { type: 'text', id }); input.value = opts[key]; }
      else {
        input = el('input', { type: 'number', id, step: x.step !== undefined ? x.step : 'any' });
        if (x.min !== undefined) input.min = x.min;
        input.value = opts[key];
      }
      input.dataset.key = key; input.dataset.type = type;
      const row = el('div', { class: 'rt-field' }, el('label', { for: id }, label), input);
      if (x.unit) row.append(el('span', { class: 'rt-unit' }, x.unit));
      if (x.help) row.append(el('span', { class: 'rt-help' }, x.help));
      fs.append(row);
    });
    form.append(fs);
  });
}

function readForm(form, base) {
  const o = Object.assign({}, base);
  form.querySelectorAll('[data-key]').forEach(i => {
    const k = i.dataset.key, t = i.dataset.type;
    if (t === 'bool') o[k] = i.checked;
    else if (t === 'num') { const v = parseFloat(i.value); if (!isNaN(v)) o[k] = v; }
    else o[k] = i.value;
  });
  return o;
}

function writeForm(form, o) {
  form.querySelectorAll('[data-key]').forEach(i => {
    const v = o[i.dataset.key]; if (v === undefined) return;
    if (i.dataset.type === 'bool') i.checked = !!v; else i.value = v;
  });
}

function download(name, text) {
  const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })), download: name });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function init() {
  const form = $('#rt-form'), preview = $('#rt-preview'), warn = $('#rt-warnings'), table = $('#rt-table'),
        out = $('#rt-gcode'), info = $('#rt-info'), saveBtn = $('#rt-download'), resetBtn = $('#rt-reset');
  let opts = RT.defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && saved.version === SETTINGS_VERSION) opts = Object.assign(opts, saved.options);
  } catch (e) { /* ignore a bad cookie */ }

  buildForm(form, opts);
  let view = null;
  try { view = createView(preview); } catch (e) { preview.textContent = 'The 3D preview needs WebGL.'; }

  let timer = 0, last = null;
  function regenerate() {
    opts = readForm(form, opts);
    try { localStorage.setItem(STORE, JSON.stringify({ version: SETTINGS_VERSION, options: opts })); } catch (e) { /* storage may be off */ }
    const r = RT.generate(opts); last = r;
    warn.replaceChildren(...r.warnings.map(w => el('li', {}, w)));
    warn.hidden = !r.warnings.length;
    table.textContent = r.table;
    out.value = r.gcode;
    info.textContent = r.model.layers.length + ' layers, ' + r.gcode.split('\n').length + ' lines, ' + (r.gcode.length / 1024).toFixed(0) + ' KB';
    if (view) view.update(r.model);
  }
  const later = () => { clearTimeout(timer); timer = setTimeout(regenerate, 120); };
  form.addEventListener('input', later); form.addEventListener('change', later);

  saveBtn.addEventListener('click', () => {
    if (!last) return;
    const axes = (opts.testX ? 'X' : '') + (opts.testY ? 'Y' : '') + (opts.diagonals ? 'D' : '');
    download('ringing-tower-' + axes + '-' + opts.pattern + '.gcode', last.gcode);
  });
  resetBtn.addEventListener('click', () => { opts = RT.defaults(); writeForm(form, opts); regenerate(); });

  regenerate();
  window.ringingTowerPage = { regenerate, readForm: () => readForm(form, opts), get view() { return view; }, get last() { return last; } };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
