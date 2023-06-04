//! Using [diamond-square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) to generate heightmaps which stored in a 2D-array.
//!
//! ## Usage
//!
//! ```rust
//! use ds_heightmap::Runner;
//!
//! fn main() {
//!     let mut runner = Runner::new();
//!     let output = runner.ds();
//!
//!     println!("data: {:?}", output.data);
//!     println!("max: {}", output.max);
//!     println!("min: {}", output.min);
//! }
//! ```

#[cfg(target_arch = "wasm32")]
use js_sys::{Array, Object, Reflect};
use rand::Rng;
use rand_distr::{Beta, Distribution};
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::{wasm_bindgen, JsValue};

#[cfg(target_arch = "wasm32")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// The output of the algorithm.
pub struct Output {
    /// The height data of every pixels.
    pub data: Vec<Vec<f32>>,
    /// The maximum height.
    pub max: f32,
    /// The minimum height.
    pub min: f32,
}

/// A runner to run the algorithm.
#[cfg(not(target_arch = "wasm32"))]
pub struct Runner {
    data: Vec<Vec<f32>>,
    max: f32,
    min: f32,
    width: usize,
    height: usize,
    depth: f32,
    rough: f32,
    side: usize,
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub struct Runner {
    data: Vec<Vec<f32>>,
    max: f32,
    min: f32,
    width: usize,
    height: usize,
    depth: f32,
    rough: f32,
    side: usize,
}

static DEFAULT_WIDTH: usize = 129;
static DEFAULT_HEIGHT: usize = 129;
static DEFAULT_DEPTH: f32 = 2000.0;
static DEFAULT_ROUGH: f32 = 1.0;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
impl Runner {
    #[wasm_bindgen(constructor)]
    pub fn wasm_new(width: usize, height: usize, depth: Option<f32>, rough: Option<f32>) -> Self {
        let mut runner = Self::new();
        runner.set_width(width);
        runner.set_height(height);
        if depth.is_some() {
            runner.set_depth(depth.unwrap());
        }
        if rough.is_some() {
            runner.set_rough(rough.unwrap());
        }
        runner
    }

    #[wasm_bindgen(js_name = ds)]
    pub fn wasm_ds(&mut self) -> Result<Object, JsValue> {
        let output = self.ds();

        let data = Array::from(&JsValue::from(
            output
                .data
                .into_iter()
                .map(|x| {
                    x.into_iter()
                        .map(|v| JsValue::from_f64(v as f64))
                        .collect::<Array>()
                })
                .collect::<Array>(),
        ));

        let obj = Object::new();
        Reflect::set(&obj, &"data".into(), &data.into())?;
        Reflect::set(&obj, &"max".into(), &output.max.into())?;
        Reflect::set(&obj, &"min".into(), &output.min.into())?;
        Ok(obj)
    }
}

impl Runner {
    /// Constuct a new Runner.
    pub fn new() -> Self {
        let mut runner = Self {
            data: Vec::new(),
            max: f32::MIN,
            min: f32::MAX,
            width: 0,
            height: 0,
            depth: DEFAULT_DEPTH,
            rough: DEFAULT_ROUGH,
            side: 0,
        };
        runner.set_width(DEFAULT_WIDTH);
        runner.set_height(DEFAULT_HEIGHT);
        runner
    }

    /// Run the Diamond-square algorithm with a default rng.
    pub fn ds(&mut self) -> Output {
        self.ds_with_rng(&mut rand::thread_rng())
    }

    /// Run the Diamond-square algorithm with given rng.
    pub fn ds_with_rng(&mut self, rng: &mut impl Rng) -> Output {
        let beta = Beta::new(3.0, 3.0).unwrap();
        let p = self.side - 1;
        self.data[0][0] = beta.sample(rng) * self.depth;
        self.data[0][p] = beta.sample(rng) * self.depth;
        self.data[p][0] = beta.sample(rng) * self.depth;
        self.data[p][p] = beta.sample(rng) * self.depth;

        self.shape(self.side as f32, self.side as f32, rng);

        if self.data.len() != self.width {
            self.data.truncate(self.width);
        }
        if self.data[0].len() != self.height {
            for i in 0..self.width {
                self.data[i].truncate(self.height);
            }
        }

        Output {
            data: self.data.clone(),
            max: self.max,
            min: self.min,
        }
    }

    /// Set the depth.
    /// The value of each pixel will be within 0~depth.
    /// Default: 2000.0.
    pub fn set_depth(&mut self, depth: f32) {
        if depth >= 0.0 && depth != self.depth {
            self.depth = depth;
        }
    }

    /// Set the height of the map.
    /// Must be larger than 1.
    /// Default: 129.
    pub fn set_height(&mut self, height: usize) {
        if height >= 2 && height != self.height {
            self.height = height;
            if self.height > self.width {
                self.set_side(self.height);
            }
        }
    }

    /// Set the roughness.
    /// Default: 1.0.
    pub fn set_rough(&mut self, rough: f32) {
        if rough != self.rough {
            self.rough = rough;
        }
    }

    /// Set the width of the map.
    /// Must be larger than 1.
    /// Default: 129.
    pub fn set_width(&mut self, width: usize) {
        if width >= 2 && width != self.width {
            self.width = width;
            if self.width > self.height {
                self.set_side(self.width);
            }
        }
    }

    fn diamond(&mut self, x: f32, y: f32, half_w: f32, half_h: f32, rng: &mut impl Rng) {
        let mut corners = vec![];
        if x - half_w > 0.0 {
            corners.push(self.data[(x - half_w) as usize][y as usize]);
        }
        if y - half_h > 0.0 {
            corners.push(self.data[x as usize][(y - half_h) as usize]);
        }
        if x + half_w < self.side as f32 {
            corners.push(self.data[(x + half_w) as usize][y as usize]);
        }
        if y + half_h < self.side as f32 {
            corners.push(self.data[x as usize][(y + half_h) as usize]);
        }

        let mut base = 0.0;
        for v in &corners {
            base += v;
        }
        let n = self.randomize(base / corners.len() as f32, half_w + half_h, rng);

        if (x as usize) < self.width && (y as usize) < self.height {
            if n < self.min {
                self.min = n;
            }
            if n > self.max {
                self.max = n;
            }
        }

        self.data[(x as usize)][(y as usize)] = n;
    }

    fn is_corner(&self, x: f32, y: f32) -> bool {
        let p = (self.side - 1) as f32;
        (x == 0.0 && y == 0.0) || (x == 0.0 && y == p) || (x == p && y == 0.0) || (x == p && y == p)
    }

    fn randomize(&mut self, base: f32, range: f32, rng: &mut impl Rng) -> f32 {
        let r: f32 = rng.gen();

        base + (r - base / self.depth) * range * self.rough
    }

    fn set_side(&mut self, max_side: usize) {
        let side = if ((max_side - 1) as f32).log2() % 1.0 == 0.0 {
            max_side
        } else {
            let n = (max_side as f32).log2();
            (2 as usize).pow((n + if n % 1.0 == 0.0 { 0.0 } else { 1.0 }).floor() as u32) + 1
        };
        self.side = side;
        self.data = vec![vec![0.0; side]; side];
    }

    fn shape(&mut self, size_w: f32, size_h: f32, rng: &mut impl Rng) {
        if size_w <= 2.0 || size_h <= 2.0 {
            return;
        }

        let half_w = (size_w / 2.0).floor();
        let half_h = (size_h / 2.0).floor();
        let side = self.side as f32;
        let mut y = half_h;
        while y < side {
            let mut x = half_w;
            while x < side {
                if self.is_corner(x, y) {
                    continue;
                }
                self.square(x, y, half_w, half_h, rng);
                x += size_w - 1.0;
            }
            y += size_h - 1.0;
        }

        y = 0.0;
        while y < side {
            let mut x = if (y / half_h) % 2.0 == 0.0 {
                half_w
            } else {
                0.0
            };
            while x < side {
                if self.is_corner(x, y) {
                    continue;
                }
                self.diamond(x, y, half_w, half_h, rng);
                x += size_w - 1.0;
            }
            y += half_h;
        }

        self.shape((size_w / 2.0).ceil(), (size_h / 2.0).ceil(), rng);
    }

    fn square(&mut self, x: f32, y: f32, half_w: f32, half_h: f32, rng: &mut impl Rng) {
        let base = (self.data[(x - half_w) as usize][(y - half_h) as usize]
            + self.data[(x + half_w) as usize][(y - half_h) as usize]
            + self.data[(x + half_w) as usize][(y + half_h) as usize]
            + self.data[(x - half_w) as usize][(y + half_h) as usize])
            / 4.0;
        let n = self.randomize(base, half_w + half_h, rng);

        if (x as usize) < self.width && (y as usize) < self.height {
            if n < self.min {
                self.min = n;
            }
            if n > self.max {
                self.max = n;
            }
        }

        self.data[(x as usize)][(y as usize)] = n;
    }
}
