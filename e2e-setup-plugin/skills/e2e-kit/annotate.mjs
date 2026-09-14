#!/usr/bin/env node
/**
 * annotate.mjs — vẽ vòng tròn đỏ quanh bounding boxes lên một bản copy của
 * ảnh chẩn đoán. Ảnh gốc không bao giờ bị ghi đè.
 *
 * Usage:
 *   node annotate.mjs --image <path.png> --regions '[{"x":10,"y":20,"width":100,"height":40}]'
 *     [--workspace <path>]
 */
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, resolve as resolvePath } from 'node:path'
import { resolveEnvironment, loadChromium } from './resolve.mjs'

function emit(payload, code) {
  console.log(JSON.stringify(payload, null, 2))
  process.exit(code)
}

const argv = process.argv.slice(2)
const args = {}
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue
  const key = argv[i].slice(2)
  const next = argv[i + 1]
  if (next === undefined || next.startsWith('--')) args[key] = true
  else {
    args[key] = next
    i++
  }
}

if (!args.image) emit({ ok: false, error: 'thiếu --image <path.png>' }, 1)
const imagePath = resolvePath(String(args.image))
if (!existsSync(imagePath)) emit({ ok: false, error: `không tìm thấy ảnh: ${imagePath}` }, 1)

let regions = []
try {
  regions = args.regions ? JSON.parse(String(args.regions)) : []
} catch (err) {
  emit({ ok: false, error: `--regions không phải JSON hợp lệ: ${err.message}` }, 1)
}
if (!Array.isArray(regions) || !regions.length) {
  emit(
    {
      ok: true,
      skipped: 'no-bounding-box',
      reason: 'không có region nào để khoanh (locator FAIL không resolve được phần tử, hoặc FAIL là network-level không có locator)',
      image: imagePath,
    },
    0,
  )
}

const invalidRegion = regions.find(
  (region) =>
    !region ||
    !['x', 'y', 'width', 'height'].every((key) => Number.isFinite(region[key])) ||
    region.width <= 0 ||
    region.height <= 0,
)
if (invalidRegion) emit({ ok: false, error: 'region phải có x/y hữu hạn và width/height dương' }, 1)

const workspace = resolvePath(args.workspace || process.cwd())
const env = resolveEnvironment({ workspace, host: args.host })
if (!env.capable) emit({ ok: false, error: 'không có browser để vẽ annotation', ladder: env.ladder }, 1)

const chromium = await loadChromium(env.runner)
const browser = await chromium.launch({
  executablePath: env.browser.executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

let outPath
try {
  const page = await browser.newPage()
  const imageBuffer = readFileSync(imagePath)
  const dataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`

  await page.setContent('<canvas id="c"></canvas>', { waitUntil: 'load' })
  await page.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = () => reject(new Error('không load được ảnh vào canvas'))
    })
    const canvas = document.getElementById('c')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d').drawImage(img, 0, 0)
  }, dataUrl)

  await page.evaluate((regionsIn) => {
    const ctx = document.getElementById('c').getContext('2d')
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ff0000'
    for (const region of regionsIn) {
      const cx = region.x + region.width / 2
      const cy = region.y + region.height / 2
      const radiusX = region.width / 2 + 12
      const radiusY = region.height / 2 + 12
      ctx.beginPath()
      ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  }, regions)

  const canvas = await page.$('#c')
  outPath = join(dirname(imagePath), `${basename(imagePath, '.png')}-annotated.png`)
  await canvas.screenshot({ path: outPath })
  await page.close()
} finally {
  await browser.close()
}

emit({ ok: true, image: imagePath, annotated: outPath, regions }, 0)
