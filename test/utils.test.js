const utils = require('../utils');

describe('utils.average', () => {
  const averageValues = [1, 2, 3, 4, 5];
  test(`average(${averageValues.join(',')}) to be 3`, () => {
    expect(utils.average(averageValues)).toBe(3);
  });
});

describe('utils.fillArray', () => {
  test('fillArray(4, [1, 2, 3, 4]) to be [1, 2, 3, 4]', () => {
    expect(utils.fillArray(4, [1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  test('fillArray(6, [1, 2, 3, 4]) to be [1, 2, 3, 4, 4, 4]', () => {
    expect(utils.fillArray(6, [1, 2, 3, 4])).toEqual([1, 2, 3, 4, 4, 4]);
  });

  test('fillArray(3, [1, 2, 3, 4]) to be [1, 2, 3]', () => {
    expect(utils.fillArray(3, [1, 2, 3, 4])).toEqual([1, 2, 3]);
  });

  test('fillArray(4, 1) to be [1, 1, 1, 1]', () => {
    expect(utils.fillArray(4, 1)).toEqual([1, 1, 1, 1]);
  });

  test('fillArray(4, [1, 2]) to be [1, 2, 2, 2]', () => {
    expect(utils.fillArray(4, [1, 2])).toEqual([1, 2, 2, 2]);
  });

  test('fillArray(4, [1, 2, 3, 4, 5, 6]) to be [1, 2, 3, 4]', () => {
    expect(utils.fillArray(4, [1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4]);
  });

  test('fillArray(4, \'string\') to be [1, 1, 1, 1]', () => {
    expect(utils.fillArray(4, 'string')).toEqual([1, 1, 1, 1]);
  });

  test('fillArray(4, null) to be [1, 1, 1, 1]', () => {
    expect(utils.fillArray(4, null)).toEqual([1, 1, 1, 1]);
  });

  test('fillArray(4, {}) to be [1, 1, 1, 1]', () => {
    expect(utils.fillArray(4, {})).toEqual([1, 1, 1, 1]);
  });
});

describe('utils.makeValInRange', () => {
  test('makeValInRange(1, 0, 2) to be 1', () => {
    expect(utils.makeValInRange(1, 0, 2)).toBe(1);
  });

  test('makeValInRange(-1, 0, 2) to be 0', () => {
    expect(utils.makeValInRange(-1, 0, 2)).toBe(0);
  });

  test('makeValInRange(3, 0, 2) to be 2', () => {
    expect(utils.makeValInRange(3, 0, 2)).toBe(2);
  });

  test('makeValInRange(1, 2, 0) to be 1', () => {
    expect(utils.makeValInRange(1, 2, 0)).toBe(1);
  });

  test('makeValInRange(3, 2, 0) to be 2', () => {
    expect(utils.makeValInRange(3, 2, 0)).toBe(2);
  });
});

describe('utils.rgbToHex', () => {
  test('rgbToHex(0, 0, 0) to be #000000', () => {
    expect(utils.rgbToHex(0, 0, 0)).toBe('#000000');
  });

  test('rgbToHex(255, 0, 0) to be #ff0000', () => {
    expect(utils.rgbToHex(255, 0, 0)).toBe('#ff0000');
  });

  test('rgbToHex(255, 255, 0) to be #ffff00', () => {
    expect(utils.rgbToHex(255, 255, 0)).toBe('#ffff00');
  });

  test('rgbToHex(255, 255, 255) to be #ffffff', () => {
    expect(utils.rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  test('rgbToHex(32, 178, 170) to be #20b2aa', () => {
    expect(utils.rgbToHex(32, 178, 170)).toBe('#20b2aa');
  });
});

describe('utils.posInArray', () => {
  test('posInArray(0, 0, [[0, 0]]) returns true', () => {
    expect(utils.posInArray(0, 0, [[0, 0]])).toBeTruthy();
  });

  test('posInArray(0, 0, [[0, 1], [1, 1]]) to be false', () => {
    expect(utils.posInArray(0, 0, [[0, 1], [1, 1]])).toBeFalsy();
  });
});
