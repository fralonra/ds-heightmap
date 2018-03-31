const average = require('./utils').average;
const fillArray = require('./utils').fillArray;
const makeValInRange = require('./utils').makeValInRange;
const rgbToHex = require('./utils').rgbToHex;
const posInArray = require('./utils').posInArray;

const POWER_MIN = 2,
      POWER_MAX = 12,
      PRECISION_MAX = 5;

const _data = [];
const _corners = [];
let _power,
    _corner,
    _offset,
    _range,
    _rough,
    _seed,
    _max,
    _initialAverage;

const ds = {
  init (power, corner, opt = {}) {
    initVar(power, corner, opt);
    initData();
  },

  run () {
    diamondSquare(_max - 1);
  },

  out (precision) {
    const p = Number.isInteger(precision) ? precision : Number.parseInt(precision);
    return _data.map(d => d.map(v => Number(v.toFixed(p))));
  }
};

function initVar(p, i, opt) {
  const n = Number.isInteger(p) ? p : Number.parseInt(p);
  _power = n < 0 ? POWER_MIN :
    n > POWER_MAX ?
    POWER_MAX :
    n;
  _max = Math.pow(2, _power) + 1;

  _corner = fillArray(4, i);
  _corners.push([0, 0], [0, _max - 1], [_max - 1, _max - 1], [_max - 1, 0]);
  _initialAverage = average(_corner);

  _offset = typeof opt.offset === 'number' ? makeValInRange(opt.offset, -1, 1) : -0.2;
  _range = typeof opt.range === 'number' ? makeValInRange(opt.range, 1, 10) : 2;
  _rough = typeof opt.rough === 'number' ? makeValInRange(opt.rough, 0, 1) : 0.2;
  _seed = opt.seed || new Date();
}

function initData() {
  for (let i = 0; i < _max; ++i) {
    _data.push(Array(_max).fill(0));
  }
  _corners.forEach((c, i) => {
    set(...c, _corner[i]);
  });
}

function get(x, y) {
  if (x < 0 || x > _max - 1 || y < 0 || y > _max - 1) return _initialAverage;
  return _data[x][y];
}

function set(x, y, val) {
  _data[x][y] = val;
}

function diamondSquare(size) {
  const half = size / 2;
  let x, y;
  if (half < 1) return _data;

  for (y = half; y < _max; y += size) {
    for (x = half; x < _max; x += size) {
      if (notCorner(x, y)) {
        square(x, y, half);
      }
    }
  }
  for (y = 0; y < _max; y += half) {
    for (x = (y + half) % size; x < _max; x += size) {
      if (notCorner(x, y)) {
        diamond(x, y, half);
      }
    }
  }
  diamondSquare(size / 2);
}

function square(x, y, half) {
  const a = average([
    get(x - half, y - half),
    get(x + half, y - half),
    get(x + half, y + half),
    get(x - half, y + half)
  ]);
  set(x, y, getValue(a, half));
}

function diamond(x, y, half) {
  const a = average([
    get(x, y - half),
    get(x + half, y),
    get(x, y + half),
    get(x - half, y)
  ]);

  set(x, y, getValue(a, half));
}

function getValue(average, size) {
  return average + Number(genOffset(size).toFixed(PRECISION_MAX))
}

function genOffset(size) {
  const roughFactor = size / _max / (1 - _rough);
  return ((Math.random() + _offset) * _range * roughFactor);
}

function notCorner(x, y) {
  return (x !== 0 && x !== _max - 1 && y !== 0 && y !== _max - 1) ||
  !posInArray(x, y, _corners);
}

module.export = ds;
