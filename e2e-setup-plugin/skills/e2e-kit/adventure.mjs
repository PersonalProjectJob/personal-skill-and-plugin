/**
 * adventure.mjs — Adventure Mode cho /evidence.
 *
 * Hai Pass + Cổng Người Quyết (P6, AC mục I):
 * - Pass 1: Khảo sát tĩnh (Recon) + Direct Navigation rẻ (0 ảnh chụp), đo avgNavMs.
 * - Báo giá số thật theo từng nhánh (AC i2).
 * - Cổng người quyết / CI budget (AC i3, i4, i7).
 * - Pass 2: Chụp 4 viewports cho các nhánh được duyệt (AC i4, i5).
 * - Nhật ký cộng dồn qua nhiều lượt chạy (AC i6).
 * - Phân loại máy chỗ cụt (Dead Ends Types 1, 2, 3) (BC4, AC e1, i3).
 * - Xuất OBSERVED-ARCHITECTURE.md và RISKS.md tất định (AC c8).
 *
 * Ràng buộc:
 * - Zero npm dependencies (chỉ dùng Node built-ins + Playwright từ resolve.mjs).
 * - Không sửa các file cũ trong kit (flow.mjs, bundle.mjs, v.v.).
 * - Không chứa định danh tổ chức nội bộ hay máy cá nhân (AC h2).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { join, resolve as resolvePath, dirname, basename } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { resolveEnvironment, loadChromium } from './resolve.mjs'
import { waitForReadiness } from './readiness.mjs'
import { runRecon, normalizeRouteTemplate, routeNavigationReason } from './recon.mjs'
import { loadRules, evaluateRules, rulesForViewport, RULE_VIEWPORTS, NOT_APPLICABLE, evaluateCrossRouteInconsistencies } from './rule-engine.mjs'
import { captureViolation, cropBudget, cropSummary } from './violation-crops.mjs'
import { buildMermaidSitemap, buildTextTree } from './sitemap-diagram.mjs'

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

const workspace = resolvePath(args.workspace || process.cwd())
const dot = join(workspace, '.e2e')
const envJsonPath = join(dot, 'env.json')

// AC g3: Thiếu .e2e/env.json -> dừng ngay
if (!existsSync(envJsonPath)) {
  console.error('LỖI: Thiếu .e2e/env.json. Hãy chạy /e2e-setup <workspace> trước.')
  process.exit(1)
}

let envJson
try {
  envJson = JSON.parse(readFileSync(envJsonPath, 'utf8'))
} catch (err) {
  console.error(`LỖI: Không đọc được .e2e/env.json: ${err.message}`)
  process.exit(1)
}

const target = args.target || envJson.target?.url
if (!target) {
  console.error('LỖI: Thiếu --target <url>')
  process.exit(1)
}

const targetUrl = target.startsWith('http') ? target : `https://${target}`
const outDir = resolvePath(args.out || join(workspace, 'out', 'adventure'))
mkdirSync(outDir, { recursive: true })
const screenBaseDir = join(outDir, 'screenshots')

const maxBudget = Number(args['budget-routes'] || args['max-routes'] || 30)
// --max-crops 0 giữ mọi dòng vi phạm nhưng tắt sinh crop; mặc định 100 ảnh/lượt.
const crops = cropBudget(args['max-crops'] === undefined ? 100 : Number(args['max-crops']))
const timeout = Number(args.timeout || 15000)
const passOnly = args.pass ? Number(args.pass) : null
const isCiYes = Boolean(args.yes || args['approve-all'])
const approvedBranchArg = args['approve-branch'] ? String(args['approve-branch']).trim() : null

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  'tablet-landscape': { width: 1024, height: 768, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'tablet-portrait': { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  mobile: { width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
}

// ---------------------------------------------------------------- Nạp rule từ file (issue #1475)
// Thứ tự ưu tiên: --rules <dir> › <workspace>/.e2e/rules › <kit>/rules.
// Thả thêm file .json hợp lệ vào thư mục rule là có hiệu lực, không sửa file này.
const ruleDirCandidates = [
  args.rules && args.rules !== true ? resolvePath(String(args.rules)) : null,
  join(dot, 'rules'),
  fileURLToPath(new URL('./rules/', import.meta.url))
].filter(Boolean)
const { dir: ruleDir, rules: activeRules, errors: ruleErrors } = loadRules(ruleDirCandidates)

for (const err of ruleErrors) {
  console.warn(`[RULES] BỎ QUA ${err.file}: field \`${err.field}\` — ${err.message}`)
}
if (!activeRules.length) {
  console.warn(`[RULES] Không nạp được rule nào (đã tìm: ${ruleDirCandidates.join(', ')}). Khối "Đo được" sẽ rỗng.`)
} else {
  console.log(`[RULES] Đã nạp ${activeRules.length} rule từ ${ruleDir}: ${activeRules.map((rule) => rule.id).join(', ')}`)
}

function getBranchPrefix(route) {
  if (!route || route === '/') return '/'
  const parts = route.split('/').filter(Boolean)
  return '/' + (parts[0] || '')
}

function routeToSlug(route) {
  if (!route || route === '/') return 'root'
  return route.replace(/^\//, '').replace(/[/:]/g, '-')
}

// ---------------------------------------------------------------- AC i6: Đọc log cũ để cộng dồn
const logJsonlPath = join(outDir, 'adventure-log.jsonl')
const accumulatedLogs = new Map() // route -> logEntry
const auditLogs = new Map() // route -> các dòng phần tử đạt / vi phạm (không thay route entry)
if (existsSync(logJsonlPath)) {
  try {
    const lines = readFileSync(logJsonlPath, 'utf8').split('\n')
    for (const line of lines) {
      if (!line.trim()) continue
      const entry = JSON.parse(line)
      if (!entry.route) continue
      if (entry.type === 'violation' || entry.type === 'element') {
        if (!auditLogs.has(entry.route)) auditLogs.set(entry.route, [])
        auditLogs.get(entry.route).push(entry)
      } else accumulatedLogs.set(entry.route, entry)
    }
    console.log(`[ADVENTURE] AC i6: Đã nạp ${accumulatedLogs.size} routes từ log cũ (cộng dồn)`)
  } catch (err) {
    console.warn(`[ADVENTURE] Cảnh báo đọc log cũ: ${err.message}`)
  }
}

// ---------------------------------------------------------------- Khởi động trình duyệt
const env = resolveEnvironment({ workspace, host: args.host, target: targetUrl })
const chromium = await loadChromium(env.runner)
const browser = await chromium.launch({
  executablePath: env.browser.executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
})

const observedApis = new Map()
const deadEnds = []

// Chỉ tính telemetry của lượt chạy này; log/survey cũ không chứng minh đã thu thập.
const routeObservations = new Map()
const secretKey = /password|passwd|token|secret|apikey|api[-_]?key|authorization/i
const maxObservedMessage = 400
const maxObservedDetails = 50

function maskObservedUrl(value) {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) return '[REDACTED URL]'
    url.username = ''
    url.password = ''
    url.hash = ''
    for (const key of new Set(url.searchParams.keys())) {
      if (secretKey.test(key)) url.searchParams.set(key, '[REDACTED]')
      else url.searchParams.set(key, maskObservedText(url.searchParams.getAll(key).join(', ')))
    }
    return url.href
  } catch {
    return '[REDACTED URL]'
  }
}

function maskObservedFields(value) {
  if (Array.isArray(value)) return value.map(maskObservedFields)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key, secretKey.test(key) ? '[REDACTED]' : maskObservedFields(item)
    ]))
  }
  return typeof value === 'string' ? maskObservedText(value) : value
}

function maskObservedBody(value) {
  try {
    return JSON.stringify(maskObservedFields(JSON.parse(value)))
  } catch {
    // Không xuất body/header không parse được (kể cả JSON bị cắt dở).
    return '[REDACTED BODY]'
  }
}

function maskObservedText(value) {
  const text = String(value || '')
  if (/^\s*[\[{]/.test(text)) return maskObservedBody(text)
  let decoded = text
  try {
    for (let i = 0; i < 3; i++) decoded = decodeURIComponent(decoded)
  } catch {
    return '[REDACTED TEXT]'
  }
  // Free-form console/exception text has no reliable field boundaries: fail closed.
  if (secretKey.test(decoded) || /[{}]|\b(?:body|headers?)\s*[:=]/i.test(decoded)) return '[REDACTED TEXT]'
  return text.replace(/https?:\/\/[^\s<>"']+/g, maskObservedUrl)
}

function observePage(page, route, visitName) {
  if (!routeObservations.has(route)) {
    routeObservations.set(route, { visits: [], counts: { console: 0, pageerror: 0, requestfailed: 0, response: 0 }, events: [], omitted: 0 })
  }
  const observation = routeObservations.get(route)
  const visit = { name: visitName, collected: false }
  observation.visits.push(visit)
  function record(type, readMessage) {
    observation.counts[type]++
    let message
    try {
      // Mask trước khi giữ trong log, rồi mới cắt độ dài.
      message = readMessage().replace(/\s+/g, ' ').slice(0, maxObservedMessage)
    } catch {
      message = '[REDACTED: collection failed]'
      visit.collected = false
    }
    const existing = observation.events.find(event => event.type === type && event.message === message && event.visit === visitName)
    if (existing) existing.count++
    else if (observation.events.length < maxObservedDetails) {
      observation.events.push({ rule: ['console', 'pageerror'].includes(type) ? 'CONSOLE-ERROR' : 'REQUEST-FAILED', type, visit: visitName, message, count: 1 })
    } else observation.omitted++
  }
  const onConsole = message => {
    if (message.type() === 'error') record('console', () => maskObservedText(message.text()))
  }
  const onPageError = error => record('pageerror', () => maskObservedText(error.message))
  const onRequestFailed = request => record('requestfailed', () => `${maskObservedUrl(request.url())} — ${maskObservedText(request.failure()?.errorText)}`)
  const onResponse = response => {
    if (response.status() >= 400) record('response', () => `HTTP ${response.status()} ${maskObservedUrl(response.url())}`)
  }
  function stop() {
    page.off('console', onConsole)
    page.off('pageerror', onPageError)
    page.off('requestfailed', onRequestFailed)
    page.off('response', onResponse)
  }
  try {
    page.on('console', onConsole)
    page.on('pageerror', onPageError)
    page.on('requestfailed', onRequestFailed)
    page.on('response', onResponse)
    visit.collected = true
  } catch {
    stop()
  }
  return stop
}

// ================================================================
// PASS 1: Khảo sát tĩnh (Recon) + BFS Direct Navigation (RẺ, 0 ẢNH)
// ================================================================
let reconResult = null
const pass1Routes = new Map()
let navTimes = []
const discoveredRoutes = new Map()
const surveyPath = join(outDir, 'survey.json')
let surveyLoaded = false

// Pass 2 tiếp nhận dữ liệu gốc của Pass 1, không suy ngược số đo từ log render.
if (passOnly === 2 && existsSync(surveyPath)) {
  try {
    const survey = JSON.parse(readFileSync(surveyPath, 'utf8'))
    if (survey.targetUrl === targetUrl && Array.isArray(survey.navTimes) &&
        survey.navTimes.every(ms => Number.isFinite(ms) && ms >= 0) &&
        Array.isArray(survey.routes) && Array.isArray(survey.discovered) && survey.recon?.discovered) {
      reconResult = survey.recon
      navTimes = survey.navTimes
      for (const entry of survey.routes) pass1Routes.set(entry.route, entry)
      for (const entry of survey.discovered) discoveredRoutes.set(entry.path, entry)
      surveyLoaded = true
    }
  } catch (err) {
    console.warn(`[PASS 1] Không đọc được survey: ${err.message}`)
  }
}

if (!surveyLoaded) {
  console.log(`\n========================================================================`)
  console.log(`PASS 1: KHẢO SÁT & BÁO GIÁ (AC i1, i2) — ${targetUrl}`)
  console.log(`========================================================================`)

  reconResult = await runRecon({ targetUrl, timeout })
  console.log(`[PASS 1] Recon phát hiện: ${reconResult.discovered.length} templates, ${reconResult.navigable.length} seeds (hash: ${reconResult.hash})`)

  for (const entry of reconResult.discovered) discoveredRoutes.set(entry.path, entry)

  for (const api of reconResult.openApiEndpoints) {
    observedApis.set(`ANY:${api.path}`, { path: api.path, discovered: 'spec' })
  }

  const p1Context = await browser.newContext({
    viewport: VIEWPORTS.desktop,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  })

  const routeQueue = []
  const enqueuedSet = new Set()
  function enqueue(r, from = 'root') {
    const norm = normalizeRouteTemplate(r)
    if (!norm) return
    if (!discoveredRoutes.has(norm)) {
      discoveredRoutes.set(norm, { path: norm, source: from === 'root' ? 'seed' : 'link', reason: routeNavigationReason(norm) })
    }
    if (discoveredRoutes.get(norm).reason || enqueuedSet.has(norm)) return
    enqueuedSet.add(norm)
    routeQueue.push({ route: norm, from })
  }

  enqueue('/')
  for (const s of reconResult.navigable) enqueue(s.path, 'recon')

  let p1Count = 0
  const p1Limit = Math.min(
    routeQueue.length,
    Number(args['max-routes'] || args['budget-routes'] || maxBudget || 30)
  )

  while (routeQueue.length > 0 && p1Count < p1Limit) {
    const item = routeQueue.shift()
    const { route, from } = item
    if (pass1Routes.has(route)) continue
    p1Count++
    console.log(`[PASS 1] [${p1Count}/${p1Limit}] Khảo sát: ${route}`)

    const page = await p1Context.newPage()
    const stopObserving = observePage(page, route, 'Pass 1')
    let fullTargetUrl
    try {
      fullTargetUrl = new URL(route, targetUrl).href
    } catch {
      fullTargetUrl = `${targetUrl}${route}`
    }

    page.on('request', (req) => {
      const type = req.resourceType()
      if (type === 'xhr' || type === 'fetch') {
        try {
          const u = new URL(req.url())
          const key = `${req.method()}:${u.origin}${u.pathname}`
          if (!observedApis.has(key)) {
            observedApis.set(key, { url: `${u.origin}${u.pathname}`, method: req.method(), host: u.host, discovered: 'network listener' })
          }
        } catch {}
      }
    })

    const tStart = Date.now()
    let navOk = false
    let status = 0
    let finalUrl = fullTargetUrl

    try {
      const res = await page.goto(fullTargetUrl, { waitUntil: 'load', timeout })
      status = res ? res.status() : 0
      finalUrl = page.url()
      navOk = status < 400
      try {
        await waitForReadiness(page, { timeout: 3000, settleMs: 150 })
      } catch {}
    } catch (err) {
      deadEnds.push({ route, type: 'unreachable', reason: `goto failed: ${maskObservedText(err.message).slice(0, maxObservedMessage)}` })
      stopObserving()
      await page.close()
      continue
    }

    const elapsed = Date.now() - tStart
    navTimes.push(elapsed)

    const finalPath = new URL(finalUrl).pathname
    if (finalPath === '/login' && route !== '/login') {
      deadEnds.push({ route, type: 'auth-gated', reason: `redirected to ${finalPath}`, targetUrl: finalUrl })
      stopObserving()
      await page.close()
      continue
    }

    if (status >= 400) {
      deadEnds.push({ route, type: 'unreachable', reason: `HTTP ${status}` })
      stopObserving()
      await page.close()
      continue
    }

    const audit = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const heading = document.querySelector('[role="heading"]')
      const pageTitle = h1?.innerText?.trim() || heading?.innerText?.trim() || document.title?.trim() || ''

      const links = []
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href')
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          links.push(href)
        }
      })

      const buttons = []
      document.querySelectorAll('button, [role="button"]').forEach((btn) => {
        const text = btn.innerText?.trim() || btn.getAttribute('aria-label') || ''
        if (btn.offsetParent !== null && text) buttons.push(text.slice(0, 50))
      })

      const forms = []
      document.querySelectorAll('form').forEach((f, idx) => {
        const inputs = []
        f.querySelectorAll('input, select, textarea').forEach((inp) => {
          const type = inp.getAttribute('type') || inp.tagName.toLowerCase()
          if (type !== 'hidden') {
            inputs.push({ name: inp.getAttribute('name') || inp.getAttribute('id') || '', type })
          }
        })
        forms.push({ id: f.getAttribute('id') || `form-${idx}`, inputsCount: inputs.length, inputs })
      })

      const storageKeys = { localStorage: [], sessionStorage: [] }
      try {
        for (let i = 0; i < localStorage.length; i++) storageKeys.localStorage.push(localStorage.key(i))
      } catch {}
      try {
        for (let i = 0; i < sessionStorage.length; i++) storageKeys.sessionStorage.push(sessionStorage.key(i))
      } catch {}

      const nav = performance.getEntriesByType('navigation')?.[0]
      const timing = nav ? {
        dcl: Math.round(nav.domContentLoadedEventEnd || 0),
        load: Math.round(nav.loadEventEnd || 0)
      } : null

      return { pageTitle, links, buttons, forms, storageKeys, timing }
    })

    for (const href of audit.links) {
      try {
        const resolved = new URL(href, fullTargetUrl)
        if (resolved.origin === new URL(targetUrl).origin) {
          enqueue(resolved.pathname, route)
        }
      } catch {}
    }

    if (audit.buttons.length > 0) {
      deadEnds.push({ route, type: 'interactive-not-followed', count: audit.buttons.length, sample: audit.buttons.slice(0, 3) })
    }

    pass1Routes.set(route, {
      route,
      title: audit.pageTitle || route,
      from,
      status,
      finalUrl,
      forms: audit.forms,
      storageKeys: audit.storageKeys,
      branch: getBranchPrefix(route),
      elapsedMs: elapsed
    })

    const observation = routeObservations.get(route)
    if (observation && audit.timing) {
      observation.events.push({
        rule: 'SLOW-ROUTE',
        type: 'timing',
        visit: 'Pass 1',
        message: `DCL: ${audit.timing.dcl}ms, Load: ${audit.timing.load > 0 ? `${audit.timing.load}ms` : '0 (chưa fire)'}`,
        count: 1
      })
    }

    stopObserving()
    await page.close()
  }

  await p1Context.close()
  writeFileSync(surveyPath, JSON.stringify({
    targetUrl,
    recon: reconResult,
    discovered: Array.from(discoveredRoutes.values()),
    routes: Array.from(pass1Routes.values()),
    navTimes
  }, null, 2), 'utf8')
}

// Lịch sử có thể chứa lượt goto template nguyên văn; giữ quan sát đó, không đưa lại vào queue.
for (const [route, entry] of accumulatedLogs) {
  const path = normalizeRouteTemplate(route)
  if (!discoveredRoutes.has(path)) {
    discoveredRoutes.set(path, { path, source: entry.from?.startsWith('recon') ? 'bundle' : 'link', reason: routeNavigationReason(path) })
  }
}
for (const entry of discoveredRoutes.values()) {
  if (entry.reason) deadEnds.push({ route: entry.path, type: entry.reason, reason: entry.reason })
}

// Gộp toàn bộ pass1Routes vào accumulatedLogs để hiển thị đầy đủ trong bảng route map
for (const [r, p1Entry] of pass1Routes.entries()) {
  if (!accumulatedLogs.has(r)) {
    accumulatedLogs.set(r, p1Entry)
  } else {
    const existing = accumulatedLogs.get(r)
    accumulatedLogs.set(r, { ...existing, ...p1Entry })
  }
}

// ---------------------------------------------------------------- Báo giá số thật theo từng nhánh (AC i2)
const avgNavMs = navTimes.length ? Math.round(navTimes.reduce((a, b) => a + b, 0) / navTimes.length) : 1500
const branches = new Map() // branchPrefix -> routes[]
for (const [r, entry] of pass1Routes.entries()) {
  const b = entry.branch
  if (!branches.has(b)) branches.set(b, [])
  branches.get(b).push(entry)
}

const quotation = {
  targetUrl,
  avgNavMs,
  avgNavMsSource: navTimes.length ? 'measured' : 'fallback',
  navSampleCount: navTimes.length,
  branches: []
}

console.log(`\n========================================================================`)
console.log(`BÁO GIÁ KHẢO SÁT THEO NHÁNH (P6, AC i2)`)
console.log(`Pass 1 (${quotation.avgNavMsSource}): ${avgNavMs} ms/route · 4 viewports/route`)
console.log(`------------------------------------------------------------------------`)
console.log(`Nhánh                    Số route    Số ảnh (×4)    Ước tính thời gian`)
console.log(`------------------------------------------------------------------------`)

let totalPhotos = 0
let totalSeconds = 0

for (const [b, list] of branches.entries()) {
  const photos = list.length * 4
  // Ước tính: thời gian load 4 viewport + buffer settle 300ms
  const estSec = Math.max(1, Math.round((list.length * (avgNavMs * 4 + 1200)) / 1000))
  totalPhotos += photos
  totalSeconds += estSec
  quotation.branches.push({ branch: b, routeCount: list.length, photoCount: photos, estSeconds: estSec })
  const bLabel = (b.padEnd(24) + String(list.length).padEnd(12) + String(photos).padEnd(15) + `~${estSec}s`)
  console.log(bLabel)
}
console.log(`------------------------------------------------------------------------`)
console.log(`TỔNG CỘNG                ${String(pass1Routes.size).padEnd(12)}${String(totalPhotos).padEnd(15)}~${totalSeconds}s (${(totalSeconds / 60).toFixed(1)} phút)`)
console.log(`========================================================================\n`)

writeFileSync(join(outDir, 'manifest-quote.json'), JSON.stringify(quotation, null, 2), 'utf8')

// ================================================================
// CỔNG NGƯỜI QUYẾT (P6 Gate / AC i3, i4, i7)
// ================================================================
let approvedBranches = new Set()

if (isCiYes) {
  console.log(`[GATE] Tự động duyệt toàn bộ nhánh trong ngân sách (--yes / CI mode) (AC i7)`)
  for (const b of branches.keys()) approvedBranches.add(b)
} else if (approvedBranchArg) {
  console.log(`[GATE] Duyệt nhánh theo yêu cầu CLI: ${approvedBranchArg} (AC i4)`)
  approvedBranches.add(approvedBranchArg)
} else if (passOnly === 1) {
  console.log(`[GATE] Đã dừng ở Pass 1 theo cờ --pass 1. Mọi nhánh chuyển vào danh sách chờ duyệt (AC i3)`)
} else {
  // Mặc định: duyệt nhánh root và nhánh được chỉ định đầu tiên để đảm bảo an toàn P6
  console.log(`[GATE] Chưa có chỉ định duyệt qua CLI. Để an toàn, chỉ duyệt nhánh root '/'`)
  approvedBranches.add('/')
}

// Ghi nhận các nhánh chưa duyệt vào §8 với lý do user-deferred (AC i3)
for (const b of branches.keys()) {
  if (!approvedBranches.has(b)) {
    const deferredList = branches.get(b)
    deadEnds.push({
      branch: b,
      type: 'user-deferred',
      count: deferredList.length,
      reason: `Chưa được phê duyệt ở cổng người quyết (P6/AC i3)`
    })
  }
}

// ================================================================
// PASS 2: Chụp 4 Viewports & Chấm Rule (CHỈ CHO NHÁNH ĐÃ DUYỆT)
// ================================================================
const pass2RoutesToRun = []
for (const [r, entry] of pass1Routes.entries()) {
  if (approvedBranches.has(entry.branch)) {
    // AC i6: Kiểm tra nếu log cũ đã có ảnh chụp đủ 4 viewport thì bỏ qua
    const existing = accumulatedLogs.get(r)
    if (existing && existing.screenshots && Object.keys(existing.screenshots).length === 4) {
      console.log(`[PASS 2] AC i6: Route ${r} đã có ảnh chụp trước đó, giữ nguyên không chụp lại`)
    } else {
      pass2RoutesToRun.push(entry)
    }
  }
}

const allUndetermined = []
const allComponentSamples = []

if (passOnly !== 1 && pass2RoutesToRun.length > 0) {
  console.log(`\n[PASS 2] Bắt đầu chụp 4 viewports và chấm rule cho ${pass2RoutesToRun.length} routes...`)
  mkdirSync(screenBaseDir, { recursive: true })

  for (let idx = 0; idx < pass2RoutesToRun.length; idx++) {
    const entry = pass2RoutesToRun[idx]
    const { route } = entry
    const slug = routeToSlug(route)
    const routeScreenDir = join(screenBaseDir, slug)
    mkdirSync(routeScreenDir, { recursive: true })

    console.log(`[PASS 2] [${idx + 1}/${pass2RoutesToRun.length}] Chụp 4 viewports cho: ${route}`)
    const screenshots = {}
    const auditRows = []
    // vpRisks[ruleId][viewport] = số vi phạm | NOT_APPLICABLE (rule không áp viewport này) | null (chấm lỗi)
    const vpRisks = {}
    for (const rule of activeRules) {
      vpRisks[rule.id] = {}
      for (const vpName of Object.keys(VIEWPORTS)) {
        vpRisks[rule.id][vpName] = rulesForViewport([rule], vpName).length ? null : NOT_APPLICABLE
      }
    }

    for (const [vpName, vpConfig] of Object.entries(VIEWPORTS)) {
      const vpContext = await browser.newContext({
        viewport: { width: vpConfig.width, height: vpConfig.height },
        deviceScaleFactor: vpConfig.deviceScaleFactor,
        isMobile: vpConfig.isMobile,
        hasTouch: vpConfig.hasTouch
      })
      const page = await vpContext.newPage()
      const stopObserving = observePage(page, route, `Pass 2/${vpName}`)
      let fullUrl
      try {
        fullUrl = new URL(route, targetUrl).href
      } catch {
        fullUrl = `${targetUrl}${route}`
      }

      try {
        await page.goto(fullUrl, { waitUntil: 'load', timeout })
        try {
          await waitForReadiness(page, { timeout: 3000, settleMs: 150 })
        } catch {}

        const shotFileName = `${vpName}.png`
        const shotPath = join(routeScreenDir, shotFileName)
        await page.screenshot({ path: shotPath, fullPage: true })
        screenshots[vpName] = `screenshots/${slug}/${shotFileName}`

        // Chấm rule cho viewport này — định nghĩa đến from file .json, page.evaluate chỉ đọc
        const vpAudit = await evaluateRules(page, activeRules, vpName, { details: true })
        for (const rule of rulesForViewport(activeRules, vpName)) {
          const value = vpAudit.counts[rule.id]
          vpRisks[rule.id][vpName] = typeof value === 'number' ? value : null
        }
        for (const element of vpAudit.elements.filter(element => !element.ruleIds.length)) {
          auditRows.push({ type: 'element', route, viewport: vpName, locator: element.locator, status: 'pass' })
        }
        const indices = new Map()
        for (const violation of vpAudit.violations) {
          const index = (indices.get(violation.ruleId) || 0) + 1
          indices.set(violation.ruleId, index)
          const row = await captureViolation(page, violation, {
            workspace, host: args.host, outDir, slug, viewport: vpName, index, budget: crops
          })
          auditRows.push({ type: 'violation', route, viewport: vpName, ...row })
        }

        if (Array.isArray(vpAudit.undetermined)) {
          for (const u of vpAudit.undetermined) allUndetermined.push({ route, viewport: vpName, ...u })
        }
        if (Array.isArray(vpAudit.components)) {
          for (const c of vpAudit.components) allComponentSamples.push({ route, viewport: vpName, ...c })
        }
      } catch (err) {
        console.warn(`[PASS 2] Lỗi chụp ${route} trên ${vpName}: ${maskObservedText(err.message).slice(0, maxObservedMessage)}`)
      }

      stopObserving()
      await page.close()
      await vpContext.close()
    }

    entry.screenshots = screenshots
    entry.vpRisks = vpRisks
    auditLogs.set(route, auditRows)
    accumulatedLogs.set(route, entry)
  }

  if (activeRules.some(r => r.id === 'COMPONENT-INCONSISTENT')) {
    const compViolations = evaluateCrossRouteInconsistencies(allComponentSamples, 3, 4)
    for (const v of compViolations) {
      const routeAudit = auditLogs.get(v.route) || []
      routeAudit.push(v)
      auditLogs.set(v.route, routeAudit)
      const entry = accumulatedLogs.get(v.route)
      if (entry && entry.vpRisks && entry.vpRisks['COMPONENT-INCONSISTENT']) {
        const curr = entry.vpRisks['COMPONENT-INCONSISTENT'][v.viewport]
        entry.vpRisks['COMPONENT-INCONSISTENT'][v.viewport] = (typeof curr === 'number' ? curr : 0) + 1
      }
    }
  }
}

await browser.close()

// ---------------------------------------------------------------- AC i6: Cập nhật nhật ký adventure-log.jsonl
writeFileSync(logJsonlPath, '', 'utf8')
for (const entry of accumulatedLogs.values()) {
  entry.observations = routeObservations.get(entry.route) || null
  appendFileSync(logJsonlPath, JSON.stringify(entry) + '\n', 'utf8')
  for (const row of auditLogs.get(entry.route) || []) appendFileSync(logJsonlPath, JSON.stringify(row) + '\n', 'utf8')
}
console.log(`[CROPS] ${cropSummary(crops)}`)
console.log(`[ADVENTURE] AC i6: Đã cập nhật tổng cộng ${accumulatedLogs.size} entries vào ${logJsonlPath}`)

// ================================================================
// KẾT XUẤT TÀI LIỆU (Render Markdown)
// ================================================================
const archMdPath = join(outDir, 'OBSERVED-ARCHITECTURE.md')
const risksMdPath = join(outDir, 'RISKS.md')

const knownTotal = discoveredRoutes.size
const nonNavigable = Array.from(discoveredRoutes.values()).filter(entry => entry.reason)
const navigableCount = knownTotal - nonNavigable.length
const paramCount = nonNavigable.filter(entry => entry.reason === 'param-unresolved').length
const wildcardCount = nonNavigable.filter(entry => entry.reason === 'wildcard').length
const robotsCount = nonNavigable.filter(entry => entry.reason === 'robots-disallow').length
const surveyedCount = Math.max(pass1Routes.size || 0, accumulatedLogs.size)
// AC i6: Quét kiểm tra ảnh chụp hiện có trên đĩa cho từng route
for (const [r, entry] of accumulatedLogs.entries()) {
  if (!entry.screenshots) entry.screenshots = {}
  const slug = routeToSlug(r)
  const routeScreenDir = join(screenBaseDir, slug)
  if (existsSync(routeScreenDir)) {
    for (const vp of ['desktop', 'tablet-portrait', 'tablet-landscape', 'mobile']) {
      if (!entry.screenshots[vp] && existsSync(join(routeScreenDir, `${vp}.png`))) {
        entry.screenshots[vp] = `screenshots/${slug}/${vp}.png`
      }
    }
  }
}

let capturedCount = 0
for (const entry of accumulatedLogs.values()) {
  if (entry.screenshots && Object.keys(entry.screenshots).length > 0) capturedCount++
}

let pass1Notice = ''
if (capturedCount === 0 && surveyedCount > 0) {
  pass1Notice = `\n> ℹ️ **Lưu ý quan trọng về Pass 1:** Báo cáo hiện tại là kết quả của **Pass 1 (Khảo sát Tĩnh & Báo giá)** với 0 ảnh chụp nhằm tối ưu tài nguyên và chi phí theo thiết kế. Bảng Bản đồ Route dưới đây thể hiện trạng thái phản hồi HTTP, cấu trúc form và quan sát API.\n> Để kích hoạt **Pass 2** tự động chụp ảnh viewports và chấm rule visual, hãy chạy:\n> \`\`\`bash\n> node .e2e/adventure.mjs --approve-all\n> \`\`\`\n`
}

let archMd = `# Kiến trúc Quan sát được (Observed Architecture)

Target: \`${targetUrl}\`
Thời gian khảo sát: ${new Date().toISOString()}

---

## 1. Độ phủ Khảo sát (Coverage - AC i5)
- **Đã chụp viewports (Pass 2):** ${capturedCount}
- **Đã khảo sát (Pass 1):** ${surveyedCount}
- **Tổng số route đã biết tới (Recon ∪ Links):** ${knownTotal} (${navigableCount} điều hướng trực tiếp được, ${paramCount} chứa tham số động, ${wildcardCount} wildcard, ${robotsCount} bị robots chặn)
${pass1Notice}
Chỉ đưa vào hàng đợi route không còn tham số :param, không có wildcard * và không bị robots chặn; quan sát cũ khi truy cập nguyên văn template vẫn được giữ.

---

## 2. Bản đồ Route (Route Map)
> 💡 **Báo cáo Tương tác (Interactive Dashboard):** Mở trực tiếp [report.html](report.html) trong trình duyệt để xem dạng lưới responsive, lọc route và click phóng to ảnh (Lightbox Zoom).

| Tên màn hình | URL nguyên văn | Tới từ | Desktop | Tablet Ngang (1024×768) | Tablet Dọc (768×1024) | Mobile (375×812) |
|---|---|---|---|---|---|---|
`

function renderViewportCell(shotPath, status) {
  if (!shotPath) return `HTTP ${status} (Pass 1)`
  return `<a href="${shotPath}" title="Bấm để mở ảnh gốc"><img src="${shotPath}" alt="screenshot" style="height: 85px; width: 120px; object-fit: cover; object-position: top; border-radius: 4px; border: 1px solid #444;" /></a>`
}

for (const [r, entry] of accumulatedLogs.entries()) {
  const ss = entry.screenshots || {}
  const dCell = renderViewportCell(ss.desktop, entry.status)
  const tlCell = renderViewportCell(ss['tablet-landscape'], entry.status)
  const tpCell = renderViewportCell(ss['tablet-portrait'], entry.status)
  const mCell = renderViewportCell(ss.mobile, entry.status)

  archMd += `| **${entry.title || r}** | \`${r}\` | \`${entry.from}\` | ${dCell} | ${tlCell} | ${tpCell} | ${mCell} |\n`
}

const routesForSitemap = []
for (const [r, entry] of accumulatedLogs.entries()) {
  routesForSitemap.push({
    route: r,
    title: entry.title || r,
    subText: entry.from ? `Tới từ ${entry.from}` : ''
  })
}

let targetHost = 'Target'
try { targetHost = new URL(targetUrl).hostname } catch (_) {}

const mermaidBlock = buildMermaidSitemap(routesForSitemap, { domain: targetHost, direction: 'LR' })
const textTreeBlock = buildTextTree(routesForSitemap, targetUrl)

archMd += `
---

## 3. Sơ đồ Cây Điều hướng & Sitemap (Navigation Tree & Sitemap)

> 💡 **Sơ đồ Trực quan:** Biểu đồ Mermaid hiển thị phân cấp cấu trúc website, phân loại rõ ràng theo từng phân hệ nghiệp vụ, trang nội dung, biểu mẫu tương tác (Forms), media và quy chuẩn pháp lý.

${mermaidBlock}

<details>
<summary><b>📋 Bấm để mở danh sách dạng Cây Văn bản (Text Tree Fallback)</b></summary>

${textTreeBlock}

</details>
`

archMd += `
---

## 4. API Surface Quan sát được (Observed APIs)
Tổng số API endpoint phát hiện được: ${observedApis.size}
| Phương thức | Host / URL | Phát hiện qua |
|---|---|---|
`

const sortedApis = Array.from(observedApis.values()).sort((a, b) => {
  const keyA = `${a.method || 'GET'}:${a.url || a.path}`
  const keyB = `${b.method || 'GET'}:${b.url || b.path}`
  return keyA.localeCompare(keyB)
})

for (const api of sortedApis.slice(0, 30)) {
  if (api.url) {
    archMd += `| \`${api.method || 'GET'}\` | \`${api.url}\` | ${api.discovered || 'network listener'} |\n`
  } else if (api.path) {
    archMd += `| \`ANY\` | \`${api.path}\` | OpenAPI spec |\n`
  }
}

archMd += `
---

## 5. Cổng Xác thực & Vai (Auth Gates)
`

const authGated = deadEnds.filter((d) => d.type === 'auth-gated')
if (authGated.length === 0) {
  archMd += `Không phát hiện redirect xác thực bắt buộc trên các route đã duyệt.\n`
} else {
  archMd += `Phát hiện ${authGated.length} route yêu cầu xác thực (bị redirect về login):\n`
  for (const ag of authGated) {
    archMd += `- \`${ag.route}\` → ${ag.reason}\n`
  }
}

archMd += `
---

## 6. Form & Input
`

let hasForms = false
for (const [r, entry] of accumulatedLogs.entries()) {
  if (entry.forms && entry.forms.length > 0) {
    hasForms = true
    archMd += `### Route \`${r}\`\n`
    for (const f of entry.forms) {
      archMd += `- **Form ID:** \`${f.id}\` (${f.inputsCount} fields)\n`
      if (f.inputs) {
        for (const inp of f.inputs) {
          archMd += `  - Input: \`${inp.name || 'unnamed'}\` (type: \`${inp.type}\`)\n`
        }
      }
    }
  }
}
if (!hasForms) {
  archMd += `Không có form nhập liệu nào trên các route đã duyệt.\n`
}

archMd += `
---

## 7. Client Storage Keys (Masked Values)
> Các giá trị đã được mask (\`***\`) để đảm bảo không rò rỉ session/token (Reviewer Concern §7).

`

for (const [r, entry] of accumulatedLogs.entries()) {
  const localKeys = entry.storageKeys?.localStorage || []
  const sessionKeys = entry.storageKeys?.sessionStorage || []
  if (localKeys.length > 0 || sessionKeys.length > 0) {
    archMd += `### Route \`${r}\`\n`
    if (localKeys.length > 0) {
      archMd += `- **localStorage keys:** ${localKeys.map((k) => `\`${k.key || k}\`: ***`).join(', ')}\n`
    }
    if (sessionKeys.length > 0) {
      archMd += `- **sessionStorage keys:** ${sessionKeys.map((k) => `\`${k.key || k}\`: ***`).join(', ')}\n`
    }
  }
}

archMd += `
---

## 8. Chỗ Chưa Tới Được (Dead Ends & Unreached)
Phân biệt route thiếu tham số/wildcard, lỗi truy cập và hoãn người quyết (AC i3):
`

for (const de of deadEnds) {
  if (de.type === 'interactive-not-followed') {
    archMd += `- **[Loại 1 - Phím bấm chưa click]** Route \`${de.route}\`: ${de.count} nút tương tác bị bỏ qua theo kỷ luật read-only (P3).\n`
  } else if (de.type === 'auth-gated') {
    archMd += `- **[Loại 2 - Cổng xác thực]** Route \`${de.route}\`: ${de.reason}\n`
  } else if (de.type === 'user-deferred') {
    archMd += `- **[Hoãn người quyết (user-deferred)]** Nhánh \`${de.branch}\` (${de.count} routes): ${de.reason}\n`
  } else if (['param-unresolved', 'wildcard', 'robots-disallow'].includes(de.type)) {
    const historical = accumulatedLogs.has(de.route) ? ' Đã có quan sát cũ khi truy cập nguyên văn template; chưa chứng minh URL có tham số hợp lệ.' : ''
    archMd += `- **[${de.type}]** Route \`${de.route}\`: Không đưa vào hàng đợi.${historical}\n`
  } else if (de.type === 'unreachable') {
    archMd += `- **[Chưa tới được]** Route \`${de.route}\`: ${de.reason}\n`
  }
}

archMd += `
---

## 9. Giới hạn của Tài liệu (Document Limitations - Premise P4)
1. Tài liệu này được sinh tự động từ quan sát **phía ngoài trình duyệt (Black-box Browser Reconnaissance)**.
2. Không suy diễn kiến trúc mã nguồn backend, mô hình cơ sở dữ liệu hay logic nghiệp vụ ẩn phía sau API.
3. Chế độ khảo sát mặc định là **read-only 100%**, không click bất kỳ nút hành động nào có thể làm biến đổi dữ liệu.
`

writeFileSync(archMdPath, archMd, 'utf8')
console.log(`[ADVENTURE] Đã ghi nhận ${archMdPath}`)

// ---------------------------------------------------------------- Render RISKS.md
let risksMd = `# Báo cáo Rủi ro & Vi phạm (Risks Report)

Target: \`${targetUrl}\`
Thời gian: ${new Date().toISOString()}

## Khối "Đo được" (Deterministic - DOM & Geometry)
> Tuân thủ tiêu chí cổng AC c8: kết quả kiểm tra lặp lại 100% giữa các lượt chạy.

Rule đang áp dụng (${activeRules.length}, nạp từ file .json): ${activeRules.length ? activeRules.map((rule) => `\`${rule.id}\``).join(', ') : '(không có)'}
${ruleErrors.length ? `Bỏ qua ${ruleErrors.length} rule sai schema: ${ruleErrors.map((err) => `\`${err.file}\` (field \`${err.field}\`)`).join(', ')}\n` : ''}
Ký hiệu: ❌ vi phạm · ✅ không vi phạm · — rule không áp dụng cho viewport này · ⚠️ không chấm được.

${cropSummary(crops)}

| Route | Rule ID | Mô tả vi phạm | Desktop | Tablet-P | Tablet-L | Mobile |
|---|---|---|---|---|---|---|
`

function renderRuleCellHtml(value, violations = [], route = '', viewport = '', fullScreenshot = null) {
  if (value === NOT_APPLICABLE || value === undefined) {
    return `<div class="cell-status cell-na" title="Rule không áp dụng cho viewport này">—</div>`
  }
  if (value === null) {
    return `<div class="cell-status cell-unknown" title="Không thể kết luận">⚠️</div>`
  }
  if (value <= 0) {
    return `<div class="cell-status cell-pass" title="Đạt chuẩn, không phát hiện vi phạm">✅</div>`
  }

  const imageViolations = violations.filter(row => !!row.image)
  const nonImageViolations = violations.filter(row => !row.image)

  // Group and count non-image reasons
  const reasonCounts = new Map()
  for (const row of nonImageViolations) {
    let reason = (row.reason || 'không có ảnh').trim()
    reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1)
  }

  let html = `<div class="cell-fail-container">`
  html += `<div class="cell-fail-badge"><span class="badge-fail-icon">❌</span> <span class="badge-fail-count">${value}</span> <span class="badge-fail-unit">vi phạm</span></div>`

  if (imageViolations.length > 0) {
    html += `<div class="crop-grid">`
    for (const row of imageViolations) {
      const boxJson = row.boundingBox ? JSON.stringify(row.boundingBox) : ''
      const fullSrc = fullScreenshot || ''
      const title = `${escapeHtml(row.ruleId)} — ${escapeHtml(row.viewport || viewport)} (${escapeHtml(route)})`
      html += `<a href="${escapeHtml(row.image)}" class="crop-thumb-link" data-crop-src="${escapeHtml(row.image)}" data-full-src="${escapeHtml(fullSrc)}" data-box='${escapeHtml(boxJson)}' data-title="${title}" onclick="openViolationModal(this); return false;" title="Click phóng to xem vi phạm &amp; vị trí trên trang"><img src="${escapeHtml(row.image)}" alt="${escapeHtml(row.ruleId)}" class="crop-thumb" loading="lazy" /></a>`
    }
    html += `</div>`
  }

  if (nonImageViolations.length > 0) {
    const totalReasons = nonImageViolations.length
    const typeCount = reasonCounts.size
    html += `<details class="reasons-dropdown">`
    html += `<summary class="reasons-toggle"><span class="toggle-text">📋 ${totalReasons} lý do (${typeCount} loại)</span><span class="toggle-arrow">▾</span></summary>`
    html += `<div class="reasons-list">`
    for (const [reason, count] of reasonCounts.entries()) {
      html += `<div class="reason-item" title="${escapeHtml(reason)}"><span class="reason-label">${escapeHtml(reason)}</span><span class="reason-count">×${count}</span></div>`
    }
    html += `</div>`
    html += `</details>`
  }

  html += `</div>`
  return html
}

function renderRuleCellMd(value, violations = []) {
  if (value === NOT_APPLICABLE || value === undefined) return '—'
  if (value === null) return '⚠️'
  if (value <= 0) return '✅'
  
  const imageViolations = violations.filter(row => !!row.image)
  const nonImageViolations = violations.filter(row => !row.image)
  
  const reasonCounts = new Map()
  for (const row of nonImageViolations) {
    const reason = (row.reason || 'no-image').trim()
    reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1)
  }

  let text = `❌ ${value}`
  const parts = []
  if (imageViolations.length > 0) {
    parts.push(`[${imageViolations.length} ảnh crop]`)
  }
  if (reasonCounts.size > 0) {
    const reasonsStr = Array.from(reasonCounts.entries())
      .map(([r, count]) => `${r}${count > 1 ? ` ×${count}` : ''}`)
      .join(', ')
    parts.push(`(${reasonsStr})`)
  }
  if (parts.length > 0) {
    text += ` ${parts.join(' ')}`
  }
  return text
}

let detViolations = 0
const measuredRows = []
for (const [r, entry] of accumulatedLogs.entries()) {
  const measured = entry.vpRisks || {}
  for (const rule of activeRules) {
    const perViewport = measured[rule.id]
    if (!perViewport) continue
    const hasAnyViolation = RULE_VIEWPORTS.some((vp) => typeof perViewport[vp] === 'number' && perViewport[vp] > 0)
    if (!hasAnyViolation) continue
    detViolations++
    const cells = RULE_VIEWPORTS.map((vp) => renderRuleCellHtml(
      perViewport[vp],
      (auditLogs.get(r) || []).filter(row => row.type === 'violation' && row.ruleId === rule.id && row.viewport === vp),
      r,
      vp,
      entry.screenshots?.[vp] || null
    ))
    const cellsMd = RULE_VIEWPORTS.map((vp) => renderRuleCellMd(
      perViewport[vp],
      (auditLogs.get(r) || []).filter(row => row.type === 'violation' && row.ruleId === rule.id && row.viewport === vp)
    ))
    const hasImages = RULE_VIEWPORTS.some(vp => 
      (auditLogs.get(r) || []).some(row => row.type === 'violation' && row.ruleId === rule.id && row.viewport === vp && !!row.image)
    )
    measuredRows.push({ route: r, ruleId: rule.id, description: rule.description, cells, hasImages })
    risksMd += `| \`${r}\` | \`${rule.id}\` | ${rule.description} | ${cellsMd.join(' | ')} |\n`
  }
}

if (detViolations === 0) {
  risksMd += `| (tất cả) | (không có) | Không phát hiện vi phạm DOM nào trong ${activeRules.length} rule | ✅ | ✅ | ✅ | ✅ |\n`
}

if (allUndetermined.length > 0) {
  risksMd += `\n### Danh sách Undetermined — Không thể kết luận độ tương phản tĩnh (${allUndetermined.length})\n` +
    `> Định nghĩa AC #2 (#1476): Text trên background-image, gradient, layer opacity < 1, mix-blend-mode hoặc backdrop-filter tuyệt đối không ra số tương phản giả.\n\n` +
    `| Route | Viewport | Locator | Lý do undetermined |\n|---|---|---|---|\n` +
    allUndetermined.map((u) => `| \`${u.route}\` | \`${u.viewport}\` | \`${u.locator}\` | ${u.reason} |`).join('\n') + '\n'
}

const observedRows = []
const observedTotals = { console: 0, pageerror: 0, requestfailed: 0, response: 0 }
let instrumentedCount = 0
for (const route of Array.from(discoveredRoutes.keys()).sort()) {
  const observation = routeObservations.get(route)
  const safeRoute = maskObservedUrl(new URL(route, targetUrl).href).replace(new URL(targetUrl).origin, '')
  if (!observation) {
    observedRows.push([safeRoute, '—', 'chưa thu thập', 'Chưa thu thập trên route này trong lượt chạy hiện tại (không được truy cập).'])
    continue
  }
  const complete = observation.visits.every(visit => visit.collected)
  if (complete) instrumentedCount++
  else observedRows.push([safeRoute, '—', 'chưa thu thập đầy đủ', 'Có lượt truy cập không thu thập được; không kết luận route sạch lỗi.'])
  const eventCount = Object.values(observation.counts).reduce((sum, count) => sum + count, 0)
  for (const type of Object.keys(observedTotals)) observedTotals[type] += observation.counts[type]
  if (complete && eventCount === 0) {
    observedRows.push([safeRoute, '—', 'không có', `Đã thu thập (${observation.visits.length} lượt truy cập), không ghi nhận sự kiện trong thời gian quan sát.`])
  } else if (eventCount > 0) {
    observedRows.push([safeRoute, '—', `${eventCount} sự kiện`, `console: ${observation.counts.console}; pageerror: ${observation.counts.pageerror}; requestfailed: ${observation.counts.requestfailed}; HTTP >= 400: ${observation.counts.response}.`])
  }
  for (const event of observation.events) {
    observedRows.push([safeRoute, event.rule, event.type, `${event.visit} ×${event.count}: ${event.message}`])
  }
  if (observation.omitted) {
    observedRows.push([safeRoute, '—', 'giới hạn chi tiết', `${observation.omitted} sự kiện đã tính trong tổng nhưng lược bỏ chi tiết (tối đa ${maxObservedDetails} mẫu/route).`])
  }
}
const observedSummary = `Đã thu thập trên ${instrumentedCount}/${knownTotal} route trong lượt chạy hiện tại (đầy đủ listener ở mọi lượt truy cập). Console error: ${observedTotals.console}; pageerror: ${observedTotals.pageerror}; requestfailed: ${observedTotals.requestfailed}; HTTP >= 400: ${observedTotals.response}.`
const observedNote = 'Phụ thuộc vào biến động runtime/mạng, được tách biệt khỏi cổng c8 theo BC2. Chỉ quan sát trong thời gian truy cập; không thu thập body/header mạng. Thông điệp được mask và giới hạn 400 ký tự, tối đa 50 mẫu/route; tổng đếm vẫn giữ mọi sự kiện.'
function observedMarkdownCell(value) {
  return escapeHtml(value).replace(/\|/g, '&#124;').replace(/`/g, '&#96;').replace(/[\r\n]+/g, ' ')
}
risksMd += `
## Khối "Quan sát được" (Observed - Telemetry & Network)
${observedSummary}
> ${observedNote}

| Route | Rule ID | Loại sự kiện | Chi tiết quan sát |
|---|---|---|---|
${observedRows.map(row => `| ${row.map(observedMarkdownCell).join(' | ')} |`).join('\n')}
`

writeFileSync(risksMdPath, risksMd, 'utf8')
console.log(`[ADVENTURE] Đã ghi nhận ${risksMdPath}`)

// ---------------------------------------------------------------- Render report.html (Interactive Lightbox Viewer)
function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function renderHtmlReport({ targetUrl, timestamp, knownTotal, surveyedCount, capturedCount, accumulatedLogs, observedSummary, observedNote, observedRows }) {
  const routesData = []
  for (const [r, entry] of accumulatedLogs.entries()) {
    routesData.push({
      route: r,
      title: entry.title || r,
      from: entry.from,
      status: entry.status,
      screenshots: entry.screenshots || null,
      vpRisks: entry.vpRisks || null
    })
  }

  const jsonPayload = JSON.stringify(routesData).replace(/</g, '\\u003c')

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Báo cáo Khảo sát Giao diện (Adventure Recon Report) — ${escapeHtml(targetUrl)}</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #151d2f;
      --card-inner: #0d1322;
      --border: #243049;
      --text: #f1f5f9;
      --text-dim: #94a3b8;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.15);
      --success: #34d399;
      --warning: #fbbf24;
      --danger: #f87171;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
    }
    .container { max-width: 1680px; margin: 0 auto; }
    header {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #fff; }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 14px;
      color: var(--text-dim);
      align-items: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid var(--border);
    }
    .badge-success { background: rgba(52, 211, 153, 0.15); color: #34d399; border-color: rgba(52, 211, 153, 0.3); }
    .badge-info { background: var(--accent-glow); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3); }
    .badge-warning { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); }
    
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 12px;
      background: rgba(11, 15, 25, 0.92);
      backdrop-filter: blur(10px);
      padding: 12px 18px;
      border-radius: 10px;
      border: 1px solid var(--border);
      z-index: 100;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }
    .search-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 14px;
      width: 320px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-box:focus { border-color: var(--accent); }
    .btn-group { display: flex; gap: 6px; }
    .btn {
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text-dim);
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .btn:hover { background: #1e293b; color: #fff; }
    .btn.active { background: var(--accent); color: #0b0f19; font-weight: 600; border-color: var(--accent); }

    .route-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      margin-bottom: 24px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .route-header {
      padding: 14px 20px;
      background: rgba(21, 29, 47, 0.95);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .route-title { font-size: 16px; font-weight: 600; color: #fff; }
    .route-url { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; color: var(--accent); margin-top: 3px; }
    
    .grid-viewports {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding: 18px 20px;
    }
    @media (max-width: 1200px) {
      .grid-viewports { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .grid-viewports { grid-template-columns: 1fr; }
    }

    .vp-box {
      background: var(--card-inner);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .vp-header {
      padding: 8px 12px;
      background: #192237;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }
    .vp-content {
      position: relative;
      height: 320px;
      overflow-y: auto;
      background: #060911;
      cursor: zoom-in;
    }
    .vp-content::-webkit-scrollbar { width: 6px; }
    .vp-content::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    .vp-img {
      width: 100%;
      height: auto;
      display: block;
    }
    .vp-zoom-hint {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(11, 15, 25, 0.88);
      border: 1px solid var(--border);
      color: var(--accent);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .unapproved-notice {
      padding: 20px;
      text-align: center;
      color: var(--text-dim);
      font-size: 13px;
    }
    .unapproved-notice code {
      background: var(--card-inner);
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--accent);
      font-size: 12px;
      border: 1px solid var(--border);
    }

    /* ================================================================
       Khối Bảng Đo được (DOM & Geometry) & Quan sát được
       ================================================================ */
    .audit-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }
    .audit-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .audit-card-header h2 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
    .audit-card-desc {
      font-size: 13px;
      color: var(--text-dim);
      margin-top: 4px;
      line-height: 1.5;
    }
    .audit-card-legend {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      background: var(--card-inner);
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 12px;
      color: var(--text-dim);
      align-items: center;
    }
    .audit-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card-inner);
    }
    .measured-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #0d1322;
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      gap: 12px;
      flex-wrap: wrap;
    }
    .measured-search-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .measured-filter-input {
      background: #151d2f;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      width: 280px;
      outline: none;
      transition: border-color 0.2s;
    }
    .measured-filter-input:focus { border-color: var(--accent); }
    .measured-row-counter {
      font-size: 12px;
      color: var(--accent);
      font-weight: 600;
      background: rgba(56, 189, 248, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }
    .measured-quick-filters {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .measured-pill-btn {
      background: #192237;
      border: 1px solid var(--border);
      color: var(--text-dim);
      padding: 5px 12px;
      border-radius: 14px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .measured-pill-btn:hover { background: #243049; color: #fff; }
    .measured-pill-btn.active {
      background: var(--accent);
      color: #0b0f19;
      font-weight: 700;
      border-color: var(--accent);
    }
    .measured-rule-select {
      background: #151d2f;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      outline: none;
      cursor: pointer;
    }
    .measured-action-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: var(--text-dim);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .measured-action-btn:hover { background: #334155; color: #fff; }

    .measured-table-wrap {
      max-height: 780px;
      overflow-y: auto;
      border-radius: 0 0 8px 8px;
    }
    .measured-table-wrap::-webkit-scrollbar { width: 8px; height: 8px; }
    .measured-table-wrap::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    
    .measured-table, .observed-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 12.5px;
      text-align: left;
    }
    .measured-table th, .observed-table th {
      position: sticky;
      top: 0;
      z-index: 10;
      background: #162035;
      color: #cbd5e1;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 14px;
      border-bottom: 2px solid var(--border);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      white-space: nowrap;
    }
    .measured-table td, .observed-table td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(36, 48, 73, 0.6);
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: break-word;
      background: #0c1220;
    }
    .measured-table tbody tr:nth-child(even) td, .observed-table tbody tr:nth-child(even) td {
      background: #0f172a;
    }
    .measured-table tbody tr:hover td, .observed-table tbody tr:hover td {
      background: rgba(56, 189, 248, 0.045);
    }
    .col-route code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      color: var(--accent);
      background: rgba(56, 189, 248, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.2);
      display: inline-block;
      max-width: 100%;
      word-break: break-all;
    }
    .rule-badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 600;
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.06);
      padding: 3px 7px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: inline-block;
    }
    .col-desc {
      color: var(--text-dim);
      font-size: 12.5px;
      line-height: 1.45;
    }

    /* Cell status icons */
    .cell-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      min-height: 26px;
    }
    .cell-pass { color: var(--success); }
    .cell-na { color: #64748b; font-size: 16px; font-weight: normal; }
    .cell-unknown { color: var(--warning); }

    /* Cell violation container */
    .cell-fail-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cell-fail-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      width: fit-content;
    }
    .badge-fail-icon { font-size: 10.5px; }
    .badge-fail-count { font-weight: 700; color: #ef4444; }
    .badge-fail-unit { font-size: 10.5px; color: #f87171; }

    /* Crop Grid */
    .crop-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      max-height: 85px;
      overflow-y: auto;
      padding: 2px 0;
    }
    .crop-grid::-webkit-scrollbar { width: 4px; }
    .crop-grid::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    .crop-thumb-link {
      display: inline-block;
      border: 1px solid rgba(248, 113, 113, 0.4);
      border-radius: 4px;
      overflow: hidden;
      background: #060911;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      transition: all 0.15s ease-in-out;
      cursor: zoom-in;
      flex-shrink: 0;
    }
    .crop-thumb-link:hover {
      transform: translateY(-2px) scale(1.06);
      border-color: #f87171;
      box-shadow: 0 3px 10px rgba(248, 113, 113, 0.4);
      z-index: 5;
    }
    .crop-thumb {
      display: block;
      height: 34px !important;
      width: auto !important;
      max-width: 80px !important;
      object-fit: contain;
      background: #060911;
    }

    /* Reasons Collapsible */
    .reasons-dropdown {
      margin-top: 2px;
      border: 1px solid rgba(51, 65, 85, 0.5);
      border-radius: 5px;
      background: rgba(15, 23, 42, 0.9);
      overflow: hidden;
    }
    .reasons-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 6px;
      font-size: 10.5px;
      color: var(--text-dim);
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      background: rgba(30, 41, 59, 0.4);
      list-style: none;
    }
    .reasons-toggle::-webkit-details-marker { display: none; }
    .reasons-toggle:hover { color: #fff; background: rgba(51, 65, 85, 0.6); }
    .toggle-arrow { font-size: 10px; transition: transform 0.2s; }
    .reasons-dropdown[open] .toggle-arrow { transform: rotate(180deg); }
    .reasons-list {
      padding: 4px 6px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      max-height: 95px;
      overflow-y: auto;
      font-size: 10.5px;
      background: #090d16;
    }
    .reasons-list::-webkit-scrollbar { width: 4px; }
    .reasons-list::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    .reason-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      padding: 2px 4px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 3px;
      color: #94a3b8;
    }
    .reason-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 120px;
    }
    .reason-count {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      font-weight: 700;
      padding: 0 4px;
      border-radius: 3px;
      font-size: 9.5px;
      flex-shrink: 0;
    }

    /* Lightbox Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 15, 0.92);
      backdrop-filter: blur(8px);
      z-index: 99999;
      display: none;
      flex-direction: column;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: #0f172a;
      border-bottom: 1px solid var(--border);
    }
    .modal-title { font-size: 15px; font-weight: 600; color: #fff; }
    .modal-coord-badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 4px;
      padding: 2px 8px;
    }
    .modal-actions { display: flex; gap: 10px; align-items: center; }
    .modal-tab-group {
      display: inline-flex;
      background: #1e293b;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 2px;
      gap: 2px;
    }
    .modal-tab-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .modal-tab-btn:hover { color: #fff; }
    .modal-tab-btn.active {
      background: var(--accent);
      color: #0b0f19;
      font-weight: 600;
    }
    .modal-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: #fff;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
    }
    .modal-btn:hover { background: #334155; }
    .modal-close {
      background: #ef4444;
      border: none;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .modal-close:hover { background: #dc2626; }
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      position: relative;
    }
    .modal-img {
      max-width: 100%;
      height: auto;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
      border-radius: 4px;
    }
    .modal-spotlight {
      position: absolute;
      box-sizing: border-box;
      border: 3px solid #ef4444;
      background: rgba(239, 68, 68, 0.22);
      border-radius: 6px;
      pointer-events: none;
      z-index: 50;
      animation: pulse-spotlight 1.8s infinite cubic-bezier(0.4, 0, 0.6, 1);
    }
    @keyframes pulse-spotlight {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.7);
        border-color: #ef4444;
      }
      50% {
        box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.7), 0 0 50px rgba(239, 68, 68, 1);
        border-color: #f87171;
      }
    }
    .spotlight-tag {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      white-space: nowrap;
      background: #dc2626;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .spotlight-tag::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 14px;
      border: 5px solid transparent;
      border-top-color: #dc2626;
    }
    .modal-minimap {
      position: fixed;
      right: 16px;
      top: 72px;
      bottom: 24px;
      width: 14px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid var(--border);
      border-radius: 7px;
      z-index: 60;
      overflow: hidden;
    }
    .minimap-track {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .minimap-marker {
      position: absolute;
      left: 0;
      right: 0;
      height: 6px;
      background: #ef4444;
      border-radius: 3px;
      box-shadow: 0 0 8px #ef4444;
      transition: top 0.2s ease;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Báo cáo Khảo sát Giao diện (Adventure Reconnaissance Report)</h1>
      <div class="meta-bar">
        <span>Target: <strong style="color: #fff;">${escapeHtml(targetUrl)}</strong></span>
        <span>•</span>
        <span>Thời gian: ${escapeHtml(timestamp)}</span>
        <span>•</span>
        <span class="badge badge-success">Đã chụp viewports: ${capturedCount}</span>
        <span class="badge badge-info">Đã khảo sát Pass 1: ${surveyedCount}</span>
        <span class="badge">Tổng routes: ${knownTotal}</span>
      </div>
    </header>

    ${capturedCount === 0 ? `
    <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; color: #e2e8f0;">
      <div style="font-weight: 700; color: var(--accent); margin-bottom: 6px; font-size: 15px;">
        ℹ️ Báo cáo Hoàn thành Giai đoạn 1 (Pass 1 — Khảo sát Tĩnh &amp; Báo giá)
      </div>
      <div style="font-size: 13px; line-height: 1.6; color: var(--text-dim);">
        Đã khảo sát <strong>${surveyedCount}</strong> routes trên hệ thống (0 ảnh chụp ở Pass 1 theo thiết kế tiết kiệm chi phí).
        Để kích hoạt Pass 2 chụp ảnh viewports và chấm Rule tự động, vui lòng chạy:
        <br>
        <code style="background: #111827; padding: 4px 10px; border-radius: 4px; color: #38bdf8; display: inline-block; margin-top: 6px; border: 1px solid #1f2937;">
          node .e2e/adventure.mjs --approve-all
        </code>
        hoặc phê duyệt theo từng nhánh cụ thể:
        <code style="background: #111827; padding: 4px 10px; border-radius: 4px; color: #38bdf8; display: inline-block; margin-top: 6px; border: 1px solid #1f2937;">
          node .e2e/adventure.mjs --approve-branch &lt;tên-nhánh&gt;
        </code>
      </div>
    </div>` : ''}

    <section class="audit-card" aria-labelledby="measured-heading">
      <div class="audit-card-header">
        <div>
          <h2 id="measured-heading">Khối "Đo được" (DOM &amp; Geometry)</h2>
          <p class="audit-card-desc">${escapeHtml(cropSummary(crops))}</p>
        </div>
        <div class="audit-card-legend">
          <span><strong style="color: var(--danger);">❌</strong> Vi phạm</span>
          <span><strong style="color: var(--success);">✅</strong> Đạt chuẩn</span>
          <span><strong style="color: var(--text-dim);">—</strong> Không áp dụng</span>
          <span><strong style="color: var(--warning);">⚠️</strong> Không chấm được</span>
        </div>
      </div>

      <!-- Interactive Toolbar for Measured Table -->
      <div class="measured-toolbar">
        <div class="measured-search-wrap">
          <input type="text" id="measured-filter-input" class="measured-filter-input" placeholder="🔍 Lọc theo Route hoặc Rule ID..." oninput="applyMeasuredFilter()" />
          <span id="measured-row-counter" class="measured-row-counter">${measuredRows.length} / ${measuredRows.length} mục</span>
        </div>
        <div class="measured-quick-filters">
          <button class="measured-pill-btn active" data-filter="all" onclick="setMeasuredPillFilter('all', this)">Tất cả (${measuredRows.length})</button>
          <button class="measured-pill-btn" data-filter="crops" onclick="setMeasuredPillFilter('crops', this)">🖼️ Có ảnh crop (${measuredRows.filter(r => r.hasImages).length})</button>
          <select id="measured-rule-select" class="measured-rule-select" onchange="applyMeasuredFilter()">
            <option value="">-- Lọc theo Rule ID --</option>
            ${Array.from(new Set(measuredRows.map(r => r.ruleId))).sort().map(rid => `<option value="${escapeHtml(rid)}">${escapeHtml(rid)}</option>`).join('\n')}
          </select>
          <button class="measured-action-btn" onclick="toggleAllMeasuredReasons(true)" title="Mở bung tất cả danh sách lý do">Mở hết lý do ▾</button>
          <button class="measured-action-btn" onclick="toggleAllMeasuredReasons(false)" title="Thu gọn lại tất cả">Thu gọn ▴</button>
        </div>
      </div>

      <div class="audit-table-wrap measured-table-wrap">
        <table class="measured-table" id="measured-table-dom">
          <thead>
            <tr>
              <th style="width: 14%;">Route</th>
              <th style="width: 15%;">Rule ID</th>
              <th style="width: 23%;">Mô tả vi phạm</th>
              <th style="width: 12%;">Desktop</th>
              <th style="width: 12%;">Tablet-P</th>
              <th style="width: 12%;">Tablet-L</th>
              <th style="width: 12%;">Mobile</th>
            </tr>
          </thead>
          <tbody>${measuredRows.map(row => `<tr class="measured-row" data-route="${escapeHtml(row.route.toLowerCase())}" data-rule="${escapeHtml(row.ruleId)}" data-has-images="${row.hasImages}">
            <td class="col-route"><code>${escapeHtml(row.route)}</code></td>
            <td class="col-rule"><span class="rule-badge">${escapeHtml(row.ruleId)}</span></td>
            <td class="col-desc">${escapeHtml(row.description)}</td>
            ${row.cells.map(cell => `<td>${cell}</td>`).join('')}
          </tr>`).join('\n')}</tbody>
        </table>
      </div>
    </section>

    <section class="audit-card" aria-labelledby="observed-heading">
      <div class="audit-card-header">
        <div>
          <h2 id="observed-heading">Khối "Quan sát được" (Observed - Telemetry &amp; Network)</h2>
          <p class="audit-card-desc">${escapeHtml(observedSummary)}</p>
          <p style="color: var(--text-dim); font-size: 12px; margin-top: 4px;">${escapeHtml(observedNote)}</p>
        </div>
      </div>
      <div class="audit-table-wrap">
        <table class="observed-table">
          <thead>
            <tr>
              <th style="width: 22%;">Route</th>
              <th style="width: 18%;">Rule ID</th>
              <th style="width: 18%;">Loại sự kiện</th>
              <th style="width: 42%;">Chi tiết quan sát</th>
            </tr>
          </thead>
          <tbody>${observedRows.map(row => `<tr>
            <td class="col-route"><code>${escapeHtml(row[0])}</code></td>
            <td class="col-rule"><span class="rule-badge">${escapeHtml(row[1])}</span></td>
            <td>${escapeHtml(row[2])}</td>
            <td style="color: var(--text-dim);">${escapeHtml(row[3])}</td>
          </tr>`).join('\n')}</tbody>
        </table>
      </div>
    </section>

    <div class="toolbar">
      <input type="text" class="search-box" id="searchBox" placeholder="Tìm kiếm route hoặc tiêu đề..." oninput="onSearch(this.value)" />
      <div class="btn-group">
        <button class="btn active" id="btn-filter-all" onclick="setFilter('all')">Tất cả (${routesData.length})</button>
        <button class="btn" id="btn-filter-captured" onclick="setFilter('captured')">Có ảnh (${capturedCount})</button>
        <button class="btn" id="btn-filter-pass1" onclick="setFilter('pass1')">Pass 1 (${routesData.length - capturedCount})</button>
      </div>
      <div class="btn-group">
        <button class="btn active" id="btn-vp-all" onclick="setViewMode('all')">4 Cột (Grid)</button>
        <button class="btn" id="btn-vp-desktop" onclick="setViewMode('desktop')">Desktop</button>
        <button class="btn" id="btn-vp-mobile" onclick="setViewMode('mobile')">Mobile</button>
      </div>
    </div>

    <div id="routeContainer">
      <!-- Generated by JS -->
    </div>
  </div>

  <div class="modal-backdrop" id="modalBackdrop" onclick="closeModal(event)">
    <div class="modal-header" onclick="event.stopPropagation()">
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div class="modal-title" id="modalTitle">Screenshot Preview</div>
        <div class="modal-coord-badge" id="modalCoordBadge" style="display: none;"></div>
      </div>
      <div class="modal-actions">
        <div class="modal-tab-group" id="modalTabGroup" style="display: none;">
          <button class="modal-tab-btn active" id="modalTabCrop" onclick="setModalTab('crop')">🔍 Crop Cận Cảnh</button>
          <button class="modal-tab-btn" id="modalTabFull" onclick="setModalTab('full')">🗺️ Vị Trí Toàn Trang</button>
        </div>
        <a href="#" target="_blank" class="modal-btn" id="modalRawLink">Mở file gốc ↗</a>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
    </div>
    <div class="modal-body" id="modalBody" onclick="event.stopPropagation()">
      <div id="modalCropWrap" style="display: flex; justify-content: center; align-items: flex-start; width: 100%;">
        <img src="" alt="Zoomed screenshot" class="modal-img" id="modalImg" />
      </div>
      <div id="modalFullWrap" style="display: none; position: relative; max-width: 1440px; margin: 0 auto; width: 100%;">
        <img src="" alt="Full page view" id="modalFullImg" style="display: block; width: 100%; height: auto;" />
        <div id="modalSpotlight" class="modal-spotlight" style="display: none;">
          <div class="spotlight-tag" id="spotlightTag">📍 Vị trí vi phạm</div>
        </div>
      </div>
      <div id="modalMinimap" class="modal-minimap" style="display: none;">
        <div class="minimap-track">
          <div class="minimap-marker" id="minimapMarker"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const targetUrl = ${JSON.stringify(targetUrl)};
    const routes = ${jsonPayload};
    let currentFilter = 'all';
    let currentSearch = '';
    let currentViewMode = 'all';
    let currentModalTab = 'crop';
    let currentViolation = null;

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderRoutes() {
      const container = document.getElementById('routeContainer');
      const filtered = routes.filter(r => {
        const shotCount = r.screenshots ? Object.keys(r.screenshots).length : 0;
        if (currentFilter === 'captured' && shotCount === 0) return false;
        if (currentFilter === 'pass1' && shotCount > 0) return false;
        if (currentSearch) {
          const q = currentSearch.toLowerCase();
          return r.route.toLowerCase().includes(q) || (r.title && r.title.toLowerCase().includes(q));
        }
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 48px; color: var(--text-dim);">Không tìm thấy route nào phù hợp với bộ lọc.</div>';
        return;
      }

      const vpMeta = {
        desktop: { label: 'Desktop', size: '1440 × 900' },
        'tablet-landscape': { label: 'Tablet Ngang', size: '1024 × 768' },
        'tablet-portrait': { label: 'Tablet Dọc', size: '768 × 1024' },
        mobile: { label: 'Mobile', size: '375 × 812' }
      };

      let html = '';
      for (const r of filtered) {
        const shotKeys = r.screenshots ? Object.keys(r.screenshots) : [];
        const hasSS = shotKeys.length > 0;
        html += '<div class="route-card" data-route="' + escapeHtml(r.route) + '">' +
          '<div class="route-header">' +
            '<div>' +
              '<div class="route-title">' + escapeHtml(r.title) + '</div>' +
              '<div class="route-url">' + escapeHtml(r.route) + '</div>' +
            '</div>' +
            '<div style="display: flex; gap: 8px; align-items: center;">' +
              '<span class="badge">' + escapeHtml(r.from) + '</span>' +
              '<span class="badge ' + (r.status === 200 ? 'badge-success' : 'badge-warning') + '">HTTP ' + r.status + '</span>' +
              '<span class="badge ' + (hasSS ? 'badge-info' : '') + '">' + (hasSS ? (shotKeys.length === 4 ? 'Đã chụp 4 viewports' : 'Đã chụp ' + shotKeys.length + ' viewport(s)') : 'Pass 1 (0 ảnh)') + '</span>' +
            '</div>' +
          '</div>';

        if (hasSS) {
          const vpsToShow = currentViewMode === 'all' 
            ? ['desktop', 'tablet-landscape', 'tablet-portrait', 'mobile'].filter(k => shotKeys.includes(k))
            : shotKeys.filter(k => k === currentViewMode || (currentViewMode === 'desktop' && k === 'desktop') || (currentViewMode === 'mobile' && k === 'mobile'));

          if (vpsToShow.length > 0) {
            html += '<div class="grid-viewports" style="grid-template-columns: repeat(' + Math.min(vpsToShow.length, 4) + ', 1fr);">';
            for (const vpKey of vpsToShow) {
              const meta = vpMeta[vpKey] || { label: vpKey, size: '' };
              const shotPath = r.screenshots[vpKey];
              const titleAttr = escapeHtml(r.route + ' — ' + meta.label);
              html += '<div class="vp-box">' +
                '<div class="vp-header">' +
                  '<span>' + meta.label + (meta.size ? ' (' + meta.size + ')' : '') + '</span>' +
                  '<span style="cursor: pointer; color: var(--accent);" data-zoom-src="' + shotPath + '" data-zoom-title="' + titleAttr + '">🔍 Phóng to</span>' +
                '</div>' +
                '<div class="vp-content" data-zoom-src="' + shotPath + '" data-zoom-title="' + titleAttr + '">' +
                  '<img src="' + shotPath + '" alt="' + meta.label + '" class="vp-img" loading="lazy" />' +
                  '<div class="vp-zoom-hint"><span>🔍 Click để zoom</span></div>' +
                '</div>' +
              '</div>';
            }
            html += '</div>';
          } else {
            html += '<div class="unapproved-notice" style="padding: 16px; font-size: 13px; color: var(--text-dim);">' +
              'Không có ảnh cho viewport ' + escapeHtml(currentViewMode) + ' trên route này.' +
            '</div>';
          }
        } else {
          html += '<div class="unapproved-notice">' +
            'Chưa chụp ảnh (Pass 1 - Khảo sát tĩnh).<br>' +
            'Để chụp route này, chạy lệnh: <code>node .e2e/adventure.mjs --target ' + escapeHtml(targetUrl) + ' --approve-branch "' + escapeHtml(r.route) + '"</code>' +
          '</div>';
        }

        html += '</div>';
      }

      container.innerHTML = html;
    }

    function onSearch(val) {
      currentSearch = val;
      renderRoutes();
    }

    function setFilter(filter) {
      currentFilter = filter;
      document.querySelectorAll('.btn-group button[id^="btn-filter-"]').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-filter-' + filter).classList.add('active');
      renderRoutes();
    }

    function setViewMode(mode) {
      currentViewMode = mode;
      document.querySelectorAll('.btn-group button[id^="btn-vp-"]').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-vp-' + mode).classList.add('active');
      renderRoutes();
    }

    function openModal(imgSrc, title) {
      currentViolation = null;
      document.getElementById('modalTabGroup').style.display = 'none';
      document.getElementById('modalCoordBadge').style.display = 'none';
      document.getElementById('modalMinimap').style.display = 'none';
      document.getElementById('modalFullWrap').style.display = 'none';
      document.getElementById('modalCropWrap').style.display = 'flex';

      const modal = document.getElementById('modalBackdrop');
      const modalImg = document.getElementById('modalImg');
      const modalTitle = document.getElementById('modalTitle');
      const rawLink = document.getElementById('modalRawLink');
      modalImg.src = imgSrc;
      modalTitle.innerText = title;
      rawLink.href = imgSrc;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function openViolationModal(el) {
      const cropSrc = el.getAttribute('data-crop-src');
      const fullSrc = el.getAttribute('data-full-src');
      const title = el.getAttribute('data-title') || 'Chi tiết vi phạm';
      let box = null;
      try {
        const rawBox = el.getAttribute('data-box');
        if (rawBox) box = JSON.parse(rawBox);
      } catch {}

      currentViolation = { cropSrc, fullSrc, box, title };
      const modal = document.getElementById('modalBackdrop');
      const modalTitle = document.getElementById('modalTitle');
      const coordBadge = document.getElementById('modalCoordBadge');
      const tabGroup = document.getElementById('modalTabGroup');
      modalTitle.innerText = title;

      if (box && typeof box.y === 'number') {
        coordBadge.innerText = '📍 Y: ' + Math.round(box.y) + 'px · X: ' + Math.round(box.x) + 'px (' + Math.round(box.width) + '×' + Math.round(box.height) + 'px)';
        coordBadge.style.display = 'inline-block';
      } else {
        coordBadge.style.display = 'none';
      }

      if (fullSrc) {
        tabGroup.style.display = 'inline-flex';
      } else {
        tabGroup.style.display = 'none';
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setModalTab('crop');
    }

    function setModalTab(tab) {
      currentModalTab = tab;
      const btnCrop = document.getElementById('modalTabCrop');
      const btnFull = document.getElementById('modalTabFull');
      const cropWrap = document.getElementById('modalCropWrap');
      const fullWrap = document.getElementById('modalFullWrap');
      const minimap = document.getElementById('modalMinimap');
      const modalImg = document.getElementById('modalImg');
      const modalFullImg = document.getElementById('modalFullImg');
      const rawLink = document.getElementById('modalRawLink');
      const modalBody = document.getElementById('modalBody');

      if (tab === 'crop' || !currentViolation || !currentViolation.fullSrc) {
        btnCrop.classList.add('active');
        btnFull.classList.remove('active');
        cropWrap.style.display = 'flex';
        fullWrap.style.display = 'none';
        minimap.style.display = 'none';
        const src = currentViolation ? currentViolation.cropSrc : modalImg.src;
        modalImg.src = src;
        rawLink.href = src;
        modalBody.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        btnCrop.classList.remove('active');
        btnFull.classList.add('active');
        cropWrap.style.display = 'none';
        fullWrap.style.display = 'block';
        rawLink.href = currentViolation.fullSrc;

        modalFullImg.src = currentViolation.fullSrc;
        if (modalFullImg.complete && modalFullImg.naturalWidth > 0) {
          applySpotlightAndScroll();
        } else {
          modalFullImg.onload = () => {
            applySpotlightAndScroll();
          };
        }
      }
    }

    function applySpotlightAndScroll() {
      if (!currentViolation || !currentViolation.box) return;
      const box = currentViolation.box;
      const modalFullImg = document.getElementById('modalFullImg');
      const spotlight = document.getElementById('modalSpotlight');
      const tag = document.getElementById('spotlightTag');
      const minimap = document.getElementById('modalMinimap');
      const marker = document.getElementById('minimapMarker');
      const modalBody = document.getElementById('modalBody');

      const naturalW = modalFullImg.naturalWidth || 1;
      const renderedW = modalFullImg.clientWidth || naturalW;
      const scale = renderedW / naturalW;

      const left = box.x * scale;
      const top = box.y * scale;
      const w = Math.max(16, box.width * scale);
      const h = Math.max(16, box.height * scale);

      spotlight.style.left = left + 'px';
      spotlight.style.top = top + 'px';
      spotlight.style.width = w + 'px';
      spotlight.style.height = h + 'px';
      spotlight.style.display = 'block';
      tag.innerText = '📍 Vị trí vi phạm (Y: ' + Math.round(box.y) + 'px)';

      // Minimap indicator
      const naturalH = modalFullImg.naturalHeight || 1;
      const percent = Math.min(100, Math.max(0, Math.round((box.y / naturalH) * 100)));
      minimap.style.display = 'block';
      marker.style.top = percent + '%';
      marker.title = 'Vị trí vi phạm: ' + percent + '% chiều dài trang';

      // Auto scroll to target element
      const targetScrollTop = top - (modalBody.clientHeight / 2) + (h / 2);
      modalBody.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
    }

    function closeModal() {
      const modal = document.getElementById('modalBackdrop');
      modal.style.display = 'none';
      document.getElementById('modalImg').src = '';
      document.getElementById('modalFullImg').src = '';
      document.getElementById('modalSpotlight').style.display = 'none';
      document.getElementById('modalMinimap').style.display = 'none';
      document.body.style.overflow = 'auto';
      currentViolation = null;
    }

    window.addEventListener('resize', () => {
      if (currentModalTab === 'full' && currentViolation && currentViolation.box) {
        applySpotlightAndScroll();
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-zoom-src]');
      if (trigger) {
        const src = trigger.getAttribute('data-zoom-src');
        const title = trigger.getAttribute('data-zoom-title') || 'Screenshot Preview';
        openModal(src, title);
      }
    });

    // Filter logic for measured table
    let currentMeasuredPill = 'all';
    function setMeasuredPillFilter(type, btn) {
      currentMeasuredPill = type;
      document.querySelectorAll('.measured-pill-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      applyMeasuredFilter();
    }

    function applyMeasuredFilter() {
      const query = (document.getElementById('measured-filter-input')?.value || '').toLowerCase().trim();
      const selectedRule = document.getElementById('measured-rule-select')?.value || '';
      const rows = document.querySelectorAll('.measured-row');
      let visible = 0;

      rows.forEach(row => {
        const route = row.getAttribute('data-route') || '';
        const rule = row.getAttribute('data-rule') || '';
        const hasImages = row.getAttribute('data-has-images') === 'true';

        let matchPill = true;
        if (currentMeasuredPill === 'crops' && !hasImages) matchPill = false;

        let matchRule = true;
        if (selectedRule && rule !== selectedRule) matchRule = false;

        let matchText = true;
        if (query) {
          matchText = route.includes(query) || rule.toLowerCase().includes(query) || row.innerText.toLowerCase().includes(query);
        }

        const show = matchPill && matchRule && matchText;
        row.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      const counter = document.getElementById('measured-row-counter');
      if (counter) counter.innerText = visible + ' / ' + rows.length + ' mục';
    }

    function toggleAllMeasuredReasons(expand) {
      document.querySelectorAll('.measured-table-wrap .reasons-dropdown').forEach(d => {
        d.open = expand;
      });
    }

    renderRoutes();
  </script>
</body>
</html>`
}

const reportHtmlPath = join(outDir, 'report.html')
writeFileSync(reportHtmlPath, renderHtmlReport({
  targetUrl,
  timestamp: new Date().toISOString(),
  knownTotal,
  surveyedCount,
  capturedCount,
  accumulatedLogs,
  observedSummary,
  observedNote,
  observedRows
}), 'utf8')
console.log(`[ADVENTURE] Đã ghi nhận ${reportHtmlPath}`)

console.log('[ADVENTURE] HOÀN TẤT PASS 2 & CỔNG NGƯỜI QUYẾT XUẤT SẮC.')
