# ds-heightmap

[![Build Status](https://travis-ci.com/fralonra/ds-heightmap.svg?branch=master)](https://travis-ci.com/fralonra/ds-heightmap)
[![npm version](https://img.shields.io/npm/v/ds-heightmap.svg)](https://www.npmjs.com/package/ds-heightmap)

Using [diamond-square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) to generate heightmaps which stored in a 2D-array.

## Demo

You can visit the online [demo](https://fralonra.github.io/ds-heightmap/) to try it out.

## Install

```bash
npm install --save ds-heightmap
```

## Usage

```javascript
import { ds } from 'ds-heightmap';
const data = ds({
  width: 129,           // the width of the map, must be larger than 1.
  height: 129,          // the height of the map, must be larger than 1.
  depth: 2000,          // the value of each pixel will be within 0~depth, default: 2000.
  rough: 1,             // effect the terrain variability (roughness), default: 1.
});                     // pass factors
console.log(data.data); // you would get a 2D-array of numbers
console.log(data.max);  // the maximum number in all pixels
console.log(data.min);  // the minimum number in all pixels
```

### Render the map

Here is an example of how to render the data on canvas:

```javascript
import { ds } from 'ds-heightmap'

const width = 400
const height = 300
const { data, max, min } = ds({
  width,
  height
})

const range = max - min
const colorData = []
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    const level = (data[j][i] - min) / range
    if (level > 0.8) {
      colorData.push(186, 174, 154, 255)
    } else if (level > 0.6) {
      colorData.push(222, 214, 163, 255)
    } else if (level > 0.4) {
      colorData.push(209, 215, 171, 255)
    } else if (level > 0.2) {
      colorData.push(189, 204, 150, 255)
    } else {
      colorData.push(148, 191, 139, 255)
    }
  }
}

const imageData = new ImageData(
  Uint8ClampedArray.from(colorData),
  width,
  height,
);

const canvas = document.getElementById('canvas')
canvas.width = width
canvas.height = height
const ctx = canvas.getContext('2d')
ctx.putImageData(imageData, 0, 0)
```