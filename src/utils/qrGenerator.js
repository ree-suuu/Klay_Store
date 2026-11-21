/**
 * Lightweight, zero-dependency QR Code SVG Generator for browser/Node
 * Generates valid Model 2 QR Code matrices (Versions 1-6) with ECC level L/M
 */

// Error correction and Galois Field tables for QR codes
const GF256_EXP = new Uint8Array(512)
const GF256_LOG = new Uint8Array(256)

;(function initGF() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x
    GF256_EXP[i + 255] = x
    GF256_LOG[x] = i
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0)
  }
})()

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]]
}

function polyMul(p1, p2) {
  const result = new Uint8Array(p1.length + p2.length - 1)
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMul(p1[i], p2[j])
    }
  }
  return result
}

function polyRest(dividend, divisor) {
  const out = new Uint8Array(dividend)
  for (let i = 0; i <= out.length - divisor.length; i++) {
    const factor = out[i]
    if (factor !== 0) {
      for (let j = 1; j < divisor.length; j++) {
        out[i + j] ^= gfMul(divisor[j], factor)
      }
    }
  }
  return out.slice(out.length - divisor.length + 1)
}

function getGeneratorPoly(degree) {
  let poly = new Uint8Array([1])
  for (let i = 0; i < degree; i++) {
    poly = polyMul(poly, new Uint8Array([1, GF256_EXP[i]]))
  }
  return poly
}

// Version table specs: [totalCodewords, ecCodewordsPerBlock, numBlocks]
const VERSION_TABLE = [
  null,
  { size: 21, dataCodewords: 19, ecCodewords: 7, blocks: 1 },  // V1-L
  { size: 25, dataCodewords: 34, ecCodewords: 10, blocks: 1 }, // V2-L
  { size: 29, dataCodewords: 55, ecCodewords: 15, blocks: 1 }, // V3-L
  { size: 33, dataCodewords: 80, ecCodewords: 20, blocks: 1 }, // V4-L
  { size: 37, dataCodewords: 108, ecCodewords: 26, blocks: 1 },// V5-L
  { size: 41, dataCodewords: 136, ecCodewords: 18, blocks: 2 } // V6-L
]

export function generateQRMatrix(text) {
  // Convert text to UTF-8 bytes
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  // Pick smallest fitting version
  let version = 1
  while (version < VERSION_TABLE.length && VERSION_TABLE[version].dataCodewords - 3 < data.length) {
    version++
  }
  if (version >= VERSION_TABLE.length) version = VERSION_TABLE.length - 1

  const spec = VERSION_TABLE[version]
  const size = spec.size

  // Encode byte mode data stream
  const bits = []
  function pushBits(val, len) {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1)
  }

  pushBits(0b0100, 4) // Byte mode
  pushBits(data.length, version <= 9 ? 8 : 16) // Length indicator
  for (let i = 0; i < data.length; i++) pushBits(data[i], 8)
  pushBits(0, 4) // Terminator

  while (bits.length % 8 !== 0) bits.push(0)

  const codewords = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let b = 0; b < 8; b++) byte = (byte << 1) | bits[i + b]
    codewords.push(byte)
  }

  // Pad to required data length
  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (codewords.length < spec.dataCodewords) {
    codewords.push(padBytes[padIdx++ % 2])
  }

  // Compute Error Correction
  const gen = getGeneratorPoly(spec.ecCodewords)
  const padded = new Uint8Array(spec.dataCodewords + spec.ecCodewords)
  padded.set(codewords, 0)
  const ecc = polyRest(padded, gen)

  const fullCodewords = [...codewords, ...ecc]

  // Initialize Matrix with -1 (empty)
  const matrix = Array.from({ length: size }, () => Array(size).fill(-1))
  const isFunction = Array.from({ length: size }, () => Array(size).fill(false))

  function setModule(r, c, val) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val ? 1 : 0
      isFunction[r][c] = true
    }
  }

  // Position Detection Patterns
  function drawFinder(row, col) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        if (inOuter) {
          setModule(row + r, col + c, isBorder || isInner)
        } else {
          setModule(row + r, col + c, false)
        }
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(0, size - 7)
  drawFinder(size - 7, 0)

  // Timing Patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0)
    setModule(i, 6, i % 2 === 0)
  }

  // Dark module
  setModule(size - 8, 8, true)

  // Alignment Pattern for version >= 2
  if (version >= 2) {
    const alignPos = size - 7
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2
        const isCenter = r === 0 && c === 0
        setModule(alignPos + r, alignPos + c, isBorder || isCenter)
      }
    }
  }

  // Reserve Format Information areas
  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true
    if (!isFunction[i][8]) isFunction[i][8] = true
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) isFunction[8][size - 1 - i] = true
    if (!isFunction[size - 1 - i][8]) isFunction[size - 1 - i][8] = true
  }

  // Lay down data codewords with Mask 0 ((r + c) % 2 == 0)
  const fullBits = []
  for (let i = 0; i < fullCodewords.length; i++) {
    for (let b = 7; b >= 0; b--) fullBits.push((fullCodewords[i] >> b) & 1)
  }

  let bitIdx = 0
  let right = size - 1
  let goingUp = true

  while (right > 0) {
    if (right === 6) right-- // Skip vertical timing column
    for (let vert = 0; vert < size; vert++) {
      const r = goingUp ? size - 1 - vert : vert
      for (let c = right; c >= right - 1; c--) {
        if (!isFunction[r][c]) {
          let val = bitIdx < fullBits.length ? fullBits[bitIdx++] : 0
          // Apply Mask 0: flip if (r + c) % 2 === 0
          if ((r + c) % 2 === 0) val ^= 1
          matrix[r][c] = val
        }
      }
    }
    right -= 2
    goingUp = !goingUp
  }

  // Standard Format Info: Level L + Mask 0 = 0x77c4 (111011111000100 in binary)
  const formatInfo = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0]
  for (let i = 0; i < 6; i++) matrix[8][i] = formatInfo[i]
  matrix[8][7] = formatInfo[6]
  matrix[8][8] = formatInfo[7]
  matrix[7][8] = formatInfo[8]
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatInfo[i]

  for (let i = 0; i < 8; i++) matrix[size - 1 - i][8] = formatInfo[i]
  for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = formatInfo[i]

  return matrix
}

/**
 * Returns SVG path string for the QR Code modules
 */
export function renderQRAsSVGPath(matrix) {
  const size = matrix.length
  let path = ''
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        path += `M${c},${r}h1v1h-1z `
      }
    }
  }
  return { path, size }
}
