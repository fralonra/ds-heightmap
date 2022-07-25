interface DSConfig {
  width: number
  height: number
  depth?: number
  rough?: number
  randomizer?: (base: number, range: number) => number
}

interface OutputMap {
  data: number[][]
  max: number
  min: number
}

const DEFAULT_CONFIG = {
  width: 129,
  height: 129,
  depth: 2000,
  rough: 1,
}

// A simple implement of beta distribution: https://stackoverflow.com/a/13569020
function beta(alpha, beta) {
  const SG_MAGICCONST = 1 + Math.log(4.5)

  const alpha_gamma = gamma(alpha, 1)
  return alpha_gamma / (alpha_gamma + gamma(beta, 1))

  function gamma(alpha, beta) {
    if (alpha > 1) {
      const ainv = Math.sqrt(2.0 * alpha - 1.0)
      const bbb = alpha - Math.log(4.0)
      const ccc = alpha + ainv

      while (true) {
        const u1 = Math.random()
        if (!(1e-7 < u1 && u1 < 0.9999999)) {
          continue
        }
        const u2 = 1.0 - Math.random()
        const v = Math.log(u1 / (1.0 - u1)) / ainv
        const x = alpha * Math.exp(v)
        const z = u1 * u1 * u2
        const r = bbb + ccc * v - x
        if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z)) {
          return x * beta
        }
      }
    } else if (alpha == 1.0) {
      let u = Math.random()
      while (u <= 1e-7) {
        u = Math.random()
      }
      return -Math.log(u) * beta
    } else {
      let x = 0
      while (true) {
        const u3 = Math.random()
        const b = (Math.E + alpha) / Math.E
        const p = b * u3
        if (p <= 1.0) {
          x = Math.pow(p, 1.0 / alpha)
        } else {
          x = -Math.log((b - p) / alpha)
        }
        const u4 = Math.random()
        if (p > 1.0) {
          if (u4 <= Math.pow(x, alpha - 1.0)) {
            break
          }
        } else if (u4 <= Math.exp(-x)) {
          break
        }
      }
      return x * beta
    }
  }
}

function ds(config: DSConfig = DEFAULT_CONFIG): OutputMap {
  const conf = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  const { rough, randomizer } = conf
  const width = conf.width < 2 ? DEFAULT_CONFIG.width : conf.width
  const height = conf.height < 2 ? DEFAULT_CONFIG.height : conf.height

  let max = Number.MIN_SAFE_INTEGER
  let min = Number.MAX_SAFE_INTEGER

  const depth =
    conf.depth === undefined || conf.depth <= 0
      ? DEFAULT_CONFIG.depth
      : conf.depth

  const maxSide = Math.max(width, height)
  let side = 0
  if (Math.log2(maxSide - 1) % 1 === 0) {
    side = maxSide
  } else {
    const n = Math.log2(maxSide)
    side = Math.pow(2, Math.floor(n + (n % 1 === 0 ? 0 : 1))) + 1
  }

  const data: number[][] = []
  for (let i = 0; i < side; ++i) {
    data.push(Array(side).fill(0))
  }

  const p = side - 1
  data[0][0] = beta(3, 3) * depth
  data[0][p] = beta(3, 3) * depth
  data[p][0] = beta(3, 3) * depth
  data[p][p] = beta(3, 3) * depth

  shape(side, side)

  const output = { data, max, min }

  if (data.length !== width) {
    data.splice(width)
  }
  if (data[0].length !== height) {
    for (const col of data) {
      col.splice(height)
    }
  }

  return output

  function diamond(x: number, y: number, halfW: number, halfH: number): void {
    if (data[x] === undefined || data[x][y] === undefined) return

    const corners: number[] = []
    if (x - halfW > 0) {
      corners.push(data[x - halfW][y])
    }
    if (y - halfH > 0) {
      corners.push(data[x][y - halfH])
    }
    if (x + halfW < side) {
      corners.push(data[x + halfW][y])
    }
    if (y + halfH < side) {
      corners.push(data[x][y + halfH])
    }
    const n = randomize(
      corners.reduce((p, c) => p + c, 0) / corners.length,
      halfW + halfH
    )
    if (x < width && y < height) {
      if (n < min) min = n
      if (n > max) max = n
    }
    data[x][y] = n
  }

  function isCorner(x: number, y: number): boolean {
    return (
      (x === 0 && y === 0) ||
      (x === 0 && y === p) ||
      (x === p && y === 0) ||
      (x === p && y === p)
    )
  }

  function randomize(base: number, range: number): number {
    if (typeof randomizer === 'function') return randomizer(base, range)
    return base + (Math.random() - base / depth) * range * rough
  }

  function shape(sizeW: number, sizeH: number): void {
    if (sizeW <= 2 || sizeH <= 2) return

    const halfW = Math.floor(sizeW / 2)
    const halfH = Math.floor(sizeH / 2)
    let x = 0
    let y = 0
    for (y = halfH; y < side; y += sizeH - 1) {
      for (x = halfW; x < side; x += sizeW - 1) {
        if (isCorner(x, y)) continue
        square(x, y, halfW, halfH)
      }
    }
    for (y = 0; y < side; y += halfH) {
      for (x = (y / halfH) % 2 === 0 ? halfW : 0; x < side; x += sizeW - 1) {
        if (isCorner(x, y)) continue
        diamond(x, y, halfW, halfH)
      }
    }
    shape(Math.ceil(sizeW / 2), Math.ceil(sizeH / 2))
  }

  function square(x: number, y: number, halfW: number, halfH: number): void {
    if (data[x] === undefined || data[x][y] === undefined) return

    const n = randomize(
      (data[x - halfW][y - halfH] +
        data[x + halfW][y - halfH] +
        data[x + halfW][y + halfH] +
        data[x - halfW][y + halfH]) /
        4,
      halfW + halfH
    )
    if (x < width && y < height) {
      if (n < min) min = n
      if (n > max) max = n
    }
    data[x][y] = n
  }
}

export { ds }
export type { DSConfig, OutputMap }
