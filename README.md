# ds-heightmap

[![Build Status](https://travis-ci.org/fralonra/ds-heightmap.svg?branch=master)](https://travis-ci.org/fralonra/ds-heightmap)
[![npm version](https://img.shields.io/npm/v/ds-heightmap.svg)](https://www.npmjs.com/package/ds-heightmap)

Using [diamond-square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) to generate heightmaps which stored in a 2D-array.

## Install

```bash
npm install --save ds-heightmap
```

## Usage

```javascript
const ds = require('ds-heightmap');
ds.init(12, {
  corner: [1, 1, 5, 5], // determine the heights of four corners
  offset: -0.5,         // effect the overall height of the map
  range: 9,             // all the height values in the map will be within -range to range
  rough: 0.8            // effect the terrain variability (roughness)
});                     // pass factors
ds.run();               // generate a new heightmap base on the factors above
const data = ds.out();  // return a 2D-array of numbers

// Or call ds.gen() to do ds.run() and ds.out() together.
```

Or in another way:

```javascript
const ds = require('ds-heightmap').ds;

const data = ds(12, {
  corner: [1, 1, 5, 5],
  offset: -0.5,
  range: 9,
  rough: 0.8
});        
```

Once you get the map data, you can render it into an image using an external image processing library.
Here is an example with [jimp](https://github.com/oliver-moran/jimp):

```javascript
const Jimp = require('jimp');

new Jimp(size, size, (err, image) => {
  if (err) throw err;

  data.forEach((d, x) => {
    d.forEach((v, y) => {
      image.setPixelColor(convertValueToColor(v), x, y);
    });
  });
  image.write('map.png', (err) => {
    if (err) throw err;
  });
});
```

## API

### init (power, option = {})
Init the library. Where `power` effects the size of the map (If `power` equals `n`, a map of 2<sup>n</sup> * 2<sup>n</sup> will be produced). For `option`, see [below](#options).

### run ()
Manually call this function to do the diamond-square algorithm.

### out ()
Return the map data.

### ds (power, option = {})
Run `init`, `run`, `out` all together.

### gen ()
Run `run`, `out` all together.

### options
| Option | Description | Type | Default |
| --- | --- | --- | --- |
| corner | Determine the heights of four corners. They are initial values in diamond-square algorithm. Can be an array of four numbers or only one number which means all corners have the same height. | Array, Number | [1, 1, 1, 1] |
| offset | Designed to effect the overall height of the map. Ranged from `-0.9` to `0.9`. | Number | -0.2 |
| range | All the height values in the map will be within `-range` to `range`. The min value is `1`. | Number | 7 |
| rough | Designed to effect the terrain variability (roughness). Ranged from `0.1` to `0.9`. | Number | 0.8 |

## Demo

You can visit the online [demo](https://fralonra.github.io/zatlas/) to try it out.
