# ds-heightmap

[![Build Status](https://travis-ci.org/fralonra/ds-heightmap.svg?branch=master)](https://travis-ci.org/fralonra/ds-heightmap)
[![npm version](https://img.shields.io/npm/v/ds-heightmap.svg)](https://www.npmjs.com/package/ds-heightmap)

Using [diamond-square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) to generate heightmaps which stored in a 2D-array.

## Install

```bash
npm install ds-heightmap
```

## Usage

```javascript
const ds = require('ds-heightmap');
ds.init(12, {
  corner: [1, 1, 5, 5],
  offset: -0.5,
  range: 9,
  rough: 0.8,
  smooth: 2
});
ds.run();
const data = ds.out();
```

### API
