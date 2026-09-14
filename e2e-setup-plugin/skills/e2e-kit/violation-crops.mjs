/** Crops cho phần tử vi phạm; annotate.mjs là nơi duy nhất vẽ vòng đỏ. */
import { mkdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const runFile = promisify(execFile)
const annotator = fileURLToPath(new URL('./annotate.mjs', import.meta.url))

export function cropBudget(limit = 100) {
  if (!Number.isSafeInteger(limit) || limit < 0) throw new Error('--max-crops phải là số nguyên không âm')
  return { limit, written: 0, omitted: 0, unavailable: 0 }
}

export function cropSummary(budget) {
  return `Crops (lượt này): ${budget.written}/${budget.limit} ảnh; ${budget.unavailable} vi phạm không có ảnh do không lấy được bằng chứng.` +
    (budget.omitted ? ` Đã chạm trần --max-crops: ${budget.omitted} vi phạm không sinh ảnh; mọi dòng vi phạm vẫn được ghi đầy đủ.` : ' Không bỏ ảnh do trần --max-crops.')
}

/** Không throw khi locator biến mất; luôn trả lại dòng vi phạm với ảnh hoặc lý do. */
export async function captureViolation(page, violation, { workspace, host, outDir, slug, viewport, index, budget }) {
  const row = { ...violation, image: null }
  let rawPath
  let annotatedPath
  try {
    if (!row.locator) throw new Error(row.reason || 'no-locator')
    const locator = page.locator(row.locator)
    if (await locator.count() !== 1) throw new Error('locator-not-resolved')
    if (!await locator.boundingBox({ timeout: 1000 })) throw new Error('no-bounding-box')
    const box = row.boundingBox
    if (!box || !['x', 'y', 'width', 'height'].every(key => Number.isFinite(box[key])) || box.width <= 0 || box.height <= 0) {
      throw new Error('no-bounding-box')
    }
    if (budget.written >= budget.limit) {
      budget.omitted++
      return { ...row, reason: 'crop-limit' }
    }
    const size = await page.evaluate(() => ({
      width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0, window.innerWidth),
      height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0, window.innerHeight)
    }))
    const padX = 48
    const padY = 80
    const x = Math.max(0, Math.floor(box.x - padX))
    const y = Math.max(0, Math.floor(box.y - padY))
    const clip = {
      x, y,
      width: Math.min(size.width, Math.ceil(box.x + box.width + padX)) - x,
      height: Math.min(size.height, Math.ceil(box.y + box.height + padY)) - y
    }
    if (clip.width <= 0 || clip.height <= 0) throw new Error('bounding-box-outside-page')
    const image = `screenshots/${slug}/violations/${row.ruleId}--${viewport}--${index}.png`
    const imagePath = join(outDir, image)
    mkdirSync(dirname(imagePath), { recursive: true })
    rawPath = imagePath.replace(/\.png$/, '-raw.png')
    annotatedPath = rawPath.replace(/\.png$/, '-annotated.png')
    // CSS scale giữ tọa độ khớp ảnh kể cả khi deviceScaleFactor: 2.
    await page.screenshot({ path: rawPath, fullPage: true, clip, scale: 'css' })
    const regions = [{ x: box.x - x, y: box.y - y, width: box.width, height: box.height }]
    const argv = [annotator, '--image', rawPath, '--regions', JSON.stringify(regions), '--workspace', workspace]
    if (host) argv.push('--host', String(host))
    const { stdout } = await runFile(process.execPath, argv, { windowsHide: true, timeout: 30000 })
    const result = JSON.parse(stdout)
    if (!result.ok || !result.annotated) throw new Error('annotation-failed')
    renameSync(annotatedPath, imagePath)
    budget.written++
    return { ...row, image, clip, reason: null }
  } catch (err) {
    budget.unavailable++
    return { ...row, reason: ['locator-not-resolved', 'no-bounding-box', 'bounding-box-outside-page', 'document-rule-no-element', 'no-locator'].includes(err.message) ? err.message : 'crop-capture-failed' }
  } finally {
    if (rawPath) rmSync(rawPath, { force: true })
    if (annotatedPath) rmSync(annotatedPath, { force: true })
  }
}
