const average = require('./utils').average;
const fillArray = require('./utils').fillArray;
const makeValInRange = require('./utils').makeValInRange;
const rgbToHex = require('./utils').rgbToHex;
const posInArray = require('./utils').posInArray;

const POWER_MIN = 2,
      POWER_MAX = 12,
      SMOOTH_MAX = 3;

const _data = [];
const _corners = [];
let _power,
    _corner,
    _offset,
    _range,
    _rough,
    _seed,
    _smooth,
    _max,
    _initialAverage;

const ds = {
  init (power, opt = {}) {

    initVar(power, opt);

    initData();

  },

  run () {
    diamondSquare(_max - 1);
    if (_smooth > 0) this.smooth(_smooth);
  },

  out () {
    return _data;
  },

  smooth (factor) {
    const f = makeValInRange(factor, 0, SMOOTH_MAX);
    _data.forEach((d, x) => {
      d.forEach((v, y) => {
        let svCount = 0;
        let ov = null;
        for (let i = x - 1; i <= x + 1; ++i) {
          for (let j = y - 1; j <= y + 1; ++j) {
            if (i < 0 || i > _max - 1 || j < 0 || j > _max - 1) break;
            if (i === x && j === y) break;
            if (_data[i][j] === v) ++svCount;
            else if (!ov) ov = _data[i][j];
            if (i === x + 1 && j === y + 1) {
              if (svCount < factor) {
                _data[x][y] = ov;
              }
            }
          }
        }
      });
    });
  }
};

function initVar(p, opt) {
  const n = Number.isInteger(p) ? p : Number.parseInt(p);
  _power = n < 0 ? POWER_MIN :
    n > POWER_MAX ?
    POWER_MAX :
    n;
  _max = Math.pow(2, _power) + 1;

  _offset = typeof opt.offset === 'number' ? makeValInRange(opt.offset, -1, 1) : -0.2;
  _range = typeof opt.range === 'number' ? makeValInRange(opt.range, 1, 10) : 7;
  _rough = typeof opt.rough === 'number' ? makeValInRange(opt.rough, 0, 0.9) : 0.8;
  _seed = opt.seed || new Date();
  _smooth = typeof opt.smooth === 'number' ? makeValInRange(opt.smooth, 0, SMOOTH_MAX) : 3;

  const temp = opt.corner ? fillArray(4, opt.corner) : Array(4).fill(null);
  _corner = temp.map(t => t === null ?
    Math.random() * _range :
    t < 0 ?
    0 :
    t > _range ?
    _range :
    t
  );
  _corners.push([0, 0], [_max - 1, 0], [_max - 1, _max - 1], [0, _max - 1]);
  _initialAverage = average(_corner);
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
  return makeValInRange(Math.round(average + genOffset(size)), -_range, _range);
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
