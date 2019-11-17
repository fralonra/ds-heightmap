const average = require('./utils').average;
const fillArray = require('./utils').fillArray;
const makeValInRange = require('./utils').makeValInRange;
const posInArray = require('./utils').posInArray;

const POWER_MIN = 2,
  POWER_MAX = 12,
  VALUE_MIN = 1;

const POWER_DEFAULT = 7,
  CORNER_DEFAULT = [1, 1, 1, 1],
  OFFSET_DEFAULT = -0.2,
  RANGE_DEFAULT = 7,
  ROUGH_DEFAULT = 0.8;

let _data = [];
let _corners = [];
let _power = POWER_DEFAULT,
  _corner = CORNER_DEFAULT,
  _offset = OFFSET_DEFAULT,
  _range = RANGE_DEFAULT,
  _rough = ROUGH_DEFAULT,
  _max = 0,
  _initialAverage = 0;

const ds = {
  init (power, opt = {}) {
    initVar(power, opt);
    initData();
  },

  run () {
    diamondSquare(_max - 1);
  },

  out () {
    return _data;
  },

  gen () {
    ds.run();
    return ds.out();
  },

  ds (power, opt = {}) {
    ds.init(power, opt);
    return ds.gen();
  }
};

function initVar (p, opt) {
  const n = Number.isInteger(p) ? p : Number.parseInt(p);
  _power = n < 0 ? POWER_MIN :
    n > POWER_MAX ?
      POWER_MAX :
      n;
  _max = Math.pow(2, _power) + 1;

  _offset = typeof opt.offset === 'number' ? makeValInRange(opt.offset, -0.9, 0.9) : _offset;
  _range = typeof opt.range === 'number' ? makeValInRange(opt.range, VALUE_MIN, opt.range) : _range;
  _rough = typeof opt.rough === 'number' ? makeValInRange(opt.rough, 0.1, 0.9) : _rough;

  const temp = opt.corner ? fillArray(4, opt.corner) : Array(4).fill(null);
  _corner = temp.map(t => t === null ?
    Math.random() * _range :
    makeValInRange(t, VALUE_MIN, _range)
  );
}

function initData () {
  _data = [];
  _corners = [[0, 0], [_max - 1, 0], [_max - 1, _max - 1], [0, _max - 1]];
  _initialAverage = average(_corner);
  for (let i = 0; i < _max; ++i) {
    _data.push(Array(_max).fill(0));
  }
  _corners.forEach((c, i) => {
    set(...c, _corner[i]);
  });
}

function get (x, y) {
  if (x < 0 || x > _max - 1 || y < 0 || y > _max - 1) return _initialAverage;
  return _data[x][y];
}

function set (x, y, val) {
  _data[x][y] = val;
}

function diamondSquare (size) {
  const half = size / 2;
  if (half < 1) return _data;

  let x, y;
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

function square (x, y, half) {
  const a = average([
    get(x - half, y - half),
    get(x + half, y - half),
    get(x + half, y + half),
    get(x - half, y + half)
  ]);
  set(x, y, getValue(a, half));
}

function diamond (x, y, half) {
  const a = average([
    get(x, y - half),
    get(x + half, y),
    get(x, y + half),
    get(x - half, y)
  ]);

  set(x, y, getValue(a, half));
}

function getValue (average, size) {
  return makeValInRange(Math.round(average + genRandomValue(average, size)), VALUE_MIN, _range);
}

function genRandomValue (average, size) {
  const gap = ((_range - VALUE_MIN) / 2 - (average - VALUE_MIN)) / ((_range - VALUE_MIN) / 2);
  const distance = size / _max;
  const offset = (randomize(_offset, 0.8) * 0.8 + randomize(getSign(gap) * _rough, 0.9) * 0.2) * randomize(distance, 0.5) * 4;
  const rough = (Math.random() - 0.5) * _rough * size * 0.02;
  return average * (offset + rough);
}

function randomize (value, p) {
  return value * (p + (1 - p) * Math.random());
}

function getSign (value) {
  return Math.abs(value) === 0 ? getSign(Math.random() - 0.5) : Math.abs(value) / value;
}

function notCorner (x, y) {
  return (x !== 0 && x !== _max - 1 && y !== 0 && y !== _max - 1) ||
  !posInArray(x, y, _corners);
}

if (process.env.NODE_ENV === 'development') {
  console.log('ds-heightmap: This version is used for development. You can switch to production version when all done.');
}

module.exports = ds;
