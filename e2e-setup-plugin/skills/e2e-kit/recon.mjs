/**
 * recon.mjs — Reconnaissance ban đầu cho Adventure Mode (/evidence).
 *
 * Khảo sát static rẻ trước khi crawler bắt đầu:
 * - Đọc sitemap.xml (AC a1, a2)
 * - Đọc robots.txt để biết route cấm (AC a3)
 * - Tải các JS bundle cùng origin để trích xuất route tĩnh và route template (AC a4, a5, BC3, BC6)
 * - Dò OpenAPI / Swagger nếu mở (AC a6)
 * - Tất định 100%, hash giống nhau qua nhiều lần chạy (AC a7)
 * - Bỏ qua mạng ngoài nếu target là localhost / file:// (AC a8)
 *
 * Ràng buộc:
 * - Zero npm dependencies (chỉ dùng Node.js built-ins).
 * - Không chứa định danh máy cá nhân hay tên tổ chức cụ thể (AC h2).
 */

import { createHash } from 'node:crypto'
import { URL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'

const MIME_EXCLUDES = /^(?:text|image|application|audio|video|font|multipart)\//i
const STATIC_EXT_EXCLUDES = /\.(?:js|jsx|ts|tsx|css|scss|sass|less|png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|eot|otf|json|map|xml|pdf|zip|gz|tar|mp4|webm|mp3|wav)$/i

export function normalizeRouteTemplate(pathStr) {
  if (!pathStr || typeof pathStr !== 'string') return ''
  let p = pathStr.trim()
  if (p === '*') return p
  if (!p.startsWith('/')) p = '/' + p
  // Remove query or hash
  const qIdx = p.indexOf('?')
  if (qIdx !== -1) p = p.slice(0, qIdx)
  const hIdx = p.indexOf('#')
  if (hIdx !== -1) p = p.slice(0, hIdx)

  // BC3: Chuẩn hóa segment số hoặc UUID thành :id
  const segments = p.split('/').map(seg => {
    if (/^\d+$/.test(seg)) return ':id'
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(seg)) return ':id'
    return seg
  })
  let normalized = segments.join('/')
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}

export function isValidRouteCandidate(str) {
  if (!str || typeof str !== 'string') return false
  const trimmed = str.trim()
  if (trimmed.length === 0) return false
  if (trimmed.includes(' ') || trimmed.includes('\n') || trimmed.includes('\t') || trimmed.includes('\\')) return false
  if (trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('{') || trimmed.includes('}')) return false
  if (trimmed.includes('"') || trimmed.includes("'") || trimmed.includes('`')) return false
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return false
  if (MIME_EXCLUDES.test(trimmed)) return false
  if (STATIC_EXT_EXCLUDES.test(trimmed)) return false

  // Must look like a path: either starts with / or has path-like alphanumeric segment
  if (trimmed.startsWith('/')) {
    return /^\/[a-zA-Z0-9_\-./:*?=&]*$/.test(trimmed)
  }
  return /^[a-zA-Z0-9_*][a-zA-Z0-9_\-./:*?=&]*$/.test(trimmed)
}

export function routeNavigationReason(path) {
  if (path.includes('*')) return 'wildcard'
  if (/(?:^|\/):[^/]+/.test(path)) return 'param-unresolved'
  return null
}

export function extractRoutesFromScript(jsContent, chunkName = 'bundle') {
  const routes = new Map() // route -> { path, source: 'bundle', chunk: chunkName }

  if (!jsContent || typeof jsContent !== 'string') return []

  // 1. Resolve potential dictionary objects like `const Qe = { staff: "staff", tips: "tips", ... }`
  const dictMap = new Map()
  const dictObjRegex = /(?:const|var|let)?\s*([a-zA-Z0-9_$]+)\s*=\s*\{([^{}]+)\}/g
  let dMatch
  while ((dMatch = dictObjRegex.exec(jsContent)) !== null) {
    const objName = dMatch[1]
    const body = dMatch[2]
    const propRegex = /([a-zA-Z0-9_$]+)\s*:\s*["']([^"']+)["']/g
    let pMatch
    while ((pMatch = propRegex.exec(body)) !== null) {
      dictMap.set(`${objName}.${pMatch[1]}`, pMatch[2])
    }
  }

  // Also check prefix variables like `xy="/dashboard"`
  const prefixRegex = /(?:const|var|let)?\s*([a-zA-Z0-9_$]+)\s*=\s*["'](\/[a-zA-Z0-9_\-]+)["']/g
  let pfMatch
  while ((pfMatch = prefixRegex.exec(jsContent)) !== null) {
    dictMap.set(pfMatch[1], pfMatch[2])
  }

  // 2. Direct string paths: `path: "..."` or `path: '...'`
  const directPathRegex = /path\s*:\s*["']([^"']+)["']/g
  let match
  while ((match = directPathRegex.exec(jsContent)) !== null) {
    const raw = match[1]
    if (isValidRouteCandidate(raw)) {
      const norm = normalizeRouteTemplate(raw)
      if (norm && !routes.has(norm)) {
        routes.set(norm, { path: norm, raw, source: 'bundle', chunk: chunkName })
      }
    }
  }

  // 3. Object-based paths: `path: Qe.staff` or `path: `${Qe.staff}/:staffId``
  const objPathRegex = /path\s*:\s*([a-zA-Z0-9_$]+)\.([a-zA-Z0-9_$]+)/g
  while ((match = objPathRegex.exec(jsContent)) !== null) {
    const key = `${match[1]}.${match[2]}`
    if (dictMap.has(key)) {
      const val = dictMap.get(key)
      if (isValidRouteCandidate(val)) {
        const norm = normalizeRouteTemplate(val)
        if (norm && !routes.has(norm)) {
          routes.set(norm, { path: norm, raw: val, source: 'bundle', chunk: chunkName })
        }
      }
    }
  }

  // 4. Router createBrowserRouter / Routes definitions
  const routeTagRegex = /<Route[^>]+path=["']([^"']+)["']/g
  while ((match = routeTagRegex.exec(jsContent)) !== null) {
    const raw = match[1]
    if (isValidRouteCandidate(raw)) {
      const norm = normalizeRouteTemplate(raw)
      if (norm && !routes.has(norm)) {
        routes.set(norm, { path: norm, raw, source: 'bundle', chunk: chunkName })
      }
    }
  }

  return Array.from(routes.values())
}

export async function runRecon({ targetUrl, timeout = 10000, fetchFn = globalThis.fetch }) {
  const result = {
    targetUrl,
    isLocal: false,
    seeds: [],
    discovered: [],
    navigable: [],
    nonNavigable: [],
    disallowed: [],
    openApiEndpoints: [],
    errors: [],
    hash: ''
  }

  let urlObj
  try {
    urlObj = new URL(targetUrl)
  } catch (err) {
    result.errors.push(`Invalid target URL: ${targetUrl}`)
    return result
  }

  const origin = urlObj.origin
  const hostname = urlObj.hostname
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || urlObj.protocol === 'file:'
  result.isLocal = isLocal

  const seedMap = new Map()
  function addSeed(path, source, detail = {}) {
    const norm = normalizeRouteTemplate(path)
    if (!norm) return
    if (STATIC_EXT_EXCLUDES.test(norm) || norm.endsWith('.xml')) return
    if (!seedMap.has(norm)) {
      seedMap.set(norm, { path: norm, source, ...detail })
    } else if (seedMap.get(norm).source === 'seed') {
      seedMap.set(norm, { path: norm, source, ...detail })
    }
  }

  // Always seed root
  addSeed('/', 'seed')

  // AC a8: Target file:// hoặc dev local -> bỏ qua sitemap/robots, chỉ thử bundle
  if (!isLocal) {
    // AC a1, a2: Sitemap.xml (hỗ trợ cả sitemap đơn lẫn sitemap_index.xml đa cấp)
    try {
      const sitemapQueue = [`${origin}/sitemap.xml`]
      const visitedSitemaps = new Set()
      const maxSitemaps = 6

      while (sitemapQueue.length > 0 && visitedSitemaps.size < maxSitemaps) {
        const currentSitemapUrl = sitemapQueue.shift()
        if (visitedSitemaps.has(currentSitemapUrl)) continue
        visitedSitemaps.add(currentSitemapUrl)

        try {
          const res = await fetchFn(currentSitemapUrl, { signal: AbortSignal.timeout(timeout) })
          if (res.ok) {
            const xml = await res.text()
            const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/gi
            let locMatch
            while ((locMatch = locRegex.exec(xml)) !== null) {
              try {
                const locUrl = new URL(locMatch[1].trim())
                if (locUrl.origin === origin) {
                  if (locUrl.pathname.endsWith('.xml')) {
                    if (!visitedSitemaps.has(locUrl.href) && sitemapQueue.length < maxSitemaps) {
                      sitemapQueue.push(locUrl.href)
                    }
                  } else {
                    addSeed(locUrl.pathname, 'sitemap')
                  }
                }
              } catch {}
            }
          }
        } catch {}
      }
    } catch (err) {
      result.errors.push(`sitemap.xml check skipped: ${err.message}`)
    }

    // AC a3: Robots.txt
    try {
      const robotsUrl = `${origin}/robots.txt`
      const res = await fetchFn(robotsUrl, { signal: AbortSignal.timeout(timeout) })
      if (res.ok) {
        const text = await res.text()
        const lines = text.split('\n')
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.toLowerCase().startsWith('disallow:')) {
            const disallowPath = trimmed.slice('disallow:'.length).trim()
            if (disallowPath) {
              addSeed(disallowPath, 'robots')
              result.disallowed.push({ path: normalizeRouteTemplate(disallowPath), reason: 'robots-disallow' })
            }
          }
        }
      }
    } catch (err) {
      result.errors.push(`robots.txt check skipped: ${err.message}`)
    }

    // AC a6: OpenAPI
    for (const specPath of ['/openapi.json', '/swagger.json', '/api-docs/openapi.json']) {
      try {
        const specUrl = `${origin}${specPath}`
        const res = await fetchFn(specUrl, { signal: AbortSignal.timeout(timeout) })
        if (res.ok) {
          const contentType = res.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const json = await res.json()
            if (json.paths && typeof json.paths === 'object') {
              for (const apiPath of Object.keys(json.paths)) {
                result.openApiEndpoints.push({ path: apiPath, discovered: 'spec' })
              }
              break
            }
          }
        }
      } catch {}
    }
  }

  // AC a4, a5: Parse JS Bundles from HTML
  try {
    const htmlRes = await fetchFn(targetUrl, { signal: AbortSignal.timeout(timeout) })
    if (htmlRes.ok) {
      const html = await htmlRes.text()
      const scriptUrls = new Set()

      // Find script tags
      const scriptTagRegex = /<script[^>]+src=["']([^"']+)["']/gi
      let sMatch
      while ((sMatch = scriptTagRegex.exec(html)) !== null) {
        scriptUrls.add(sMatch[1])
      }

      // Find modulepreload
      const preloadRegex = /<link[^>]+rel=["']modulepreload["'][^>]+href=["']([^"']+)["']/gi
      while ((sMatch = preloadRegex.exec(html)) !== null) {
        scriptUrls.add(sMatch[1])
      }
      const preloadRegex2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']modulepreload["']/gi
      while ((sMatch = preloadRegex2.exec(html)) !== null) {
        scriptUrls.add(sMatch[1])
      }

      // Download and parse each same-origin script
      for (const scriptHref of scriptUrls) {
        try {
          const fullScriptUrl = new URL(scriptHref, targetUrl)
          if (fullScriptUrl.origin === origin) {
            const jsRes = await fetchFn(fullScriptUrl.href, { signal: AbortSignal.timeout(timeout) })
            if (jsRes.ok) {
              const jsText = await jsRes.text()
              const chunkName = fullScriptUrl.pathname.split('/').pop() || 'bundle.js'
              const bundleRoutes = extractRoutesFromScript(jsText, chunkName)
              for (const br of bundleRoutes) {
                addSeed(br.path, br.source, { chunk: br.chunk })
              }
            }
          }
        } catch {}
      }
    }
  } catch (err) {
    result.errors.push(`HTML bundle inspection failed: ${err.message}`)
  }

  // Giữ toàn bộ template; chỉ seeds/navigable được đưa vào hàng đợi.
  const disallowedPaths = new Set(result.disallowed.map(d => d.path))
  result.discovered = Array.from(seedMap.values())
    .map(s => ({ ...s, reason: routeNavigationReason(s.path) || (disallowedPaths.has(s.path) ? 'robots-disallow' : null) }))
    .sort((a, b) => a.path.localeCompare(b.path))
  result.navigable = result.discovered.filter(s => !s.reason)
  result.nonNavigable = result.discovered.filter(s => s.reason)
  result.seeds = result.navigable

  // AC a7: Hash seed list to prove deterministic output across runs
  const hash = createHash('sha256')
  hash.update(JSON.stringify(result.seeds))
  result.hash = hash.digest('hex').slice(0, 16)

  return result
}
