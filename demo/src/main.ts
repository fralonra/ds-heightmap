import * as dat from 'dat.gui'
import { ds } from '../../lib'

interface Config {
  width: number
  height: number
  depth: number
  rough: number
}

function main() {
  const config: Config = {
    width: window.innerWidth,
    height: window.innerHeight,
    depth: 2000,
    rough: 1,
  }

  const canvas = document.createElement('canvas')
  document.body.prepend(canvas)
  handleResize()
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    throw 'Canvas context is null'
  }

  window.addEventListener('resize', () => {
    handleResize()
    generate()
  })

  const gui = new dat.GUI()
  gui.add(config, 'depth', 1000, 3000, 1).onChange((v) => {
    generate()
  })
  gui.add(config, 'rough', 0, 10).onChange((v) => {
    generate()
  })

  generate()

  function generate() {
    const { max, min, data } = ds(config)

    const width = data.length
    if (width <= 0) {
      throw 'Invalid data'
    }
    const height = data[0].length

    const range = max - min
    const colorData: number[] = []
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
      height
    )

    ctx?.putImageData(imageData, 0, 0)
  }

  function handleResize() {
    config.width = window.innerWidth
    config.height = window.innerHeight
    canvas.width = config.width
    canvas.height = config.height
    canvas.style.width = `${canvas.width}px`
    canvas.style.height = `${canvas.height}px`
  }
}

main()
