function average(values) {
  return values.reduce((sum, val) => sum + val) / values.length;
}

function fillArray(size, data) {
  return typeof i === 'number' ? Array(size).fill(data) :
    (Array.isArray(data) ?
    (data.length < size ?
    data.concat(Array(size - data.length).fill(data[data.length - 1])) :
    data.length > size ?
    data.slice(0, size) :
    data) :
    [1, 1, 1, 1]);
}

function makeValInRange(val, m1, m2) {
  let min, max;
  if (m1 <= m2) {
    min = m1;
    max = m2;
  } else {
    min = m2;
    max = m1;
  }
  return val > max ?
    max :
    val < min ?
    min :
    val;
}

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function posInArray(x, y, array) {
  return array.some((a, i, arr) => a[0] === x && a[1] === y);
}

const utils = {
  average,
  fillArray,
  makeValInRange,
  rgbToHex,
  posInArray
};

module.exports = utils;
