# ds-heightmap

[![Latest version](https://img.shields.io/crates/v/ds-heightmap.svg)](https://crates.io/crates/ds-heightmap)
[![Documentation](https://docs.rs/ds-heightmap/badge.svg)](https://docs.rs/ds-heightmap)
![MIT](https://img.shields.io/badge/license-MIT-blue.svg)

## Build

### Build for Web

Install [wasm-pack](https://github.com/rustwasm/wasm-pack) and build:

```bash
wasm-pack build --release
```

## Usage

```rust
use ds_heightmap::Runner;

fn main() {
    let mut runner = Runner::new();
    let output = runner.ds();

    println!("data: {:?}", output.data);
    println!("max: {}", output.max);
    println!("min: {}", output.min);
}

```