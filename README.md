# ds-heightmap

[![Build Status](https://travis-ci.org/fralonra/ds-heightmap.svg?branch=master)](https://travis-ci.org/fralonra/ds-heightmap)
[![npm version](https://img.shields.io/npm/v/ds-heightmap.svg)](https://www.npmjs.com/package/ds-heightmap)

Using [diamond-square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) to generate heightmaps which stored in a 2D-array. It's still under development.

## Install

```bash
npm install ds-heightmap
```

## Usage

```javascript
const ds = require('ds-heightmap');
ds.init(12, {
  corner: [1, 1, 5, 5], // determine the heights of four corners
  offset: -0.5, // effect the overall height of the map
  range: 9, // all the height values in the map will be within -range to range
  rough: 0.8 // effect the terrain variability (roughness)
}); // pass factors
ds.run(); // generate a new heightmap base on the factors above
const data = ds.out(); // return a 2D-array of numbers
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

## Demo

You can visit the online [demo](https://fralonra.github.io/zatlas/) to try it out.
