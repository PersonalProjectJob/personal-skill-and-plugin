/**
 * rule-engine.mjs — Máy chấm rule ăn data cho Adventure Mode (issue #1475).
 *
 * Rule KHÔNG hardcode trong adventure.mjs nữa: mỗi rule là một file `.json`
 * trong thư mục rule (`<workspace>/.e2e/rules/`, fallback về `rules/` cạnh kit).
 * Thả thêm file `.json` hợp lệ vào thư mục đó là có hiệu lực ngay, không sửa
 * một dòng nào trong adventure.mjs.
 *
 * Ràng buộc:
 * - Zero npm dependencies (chỉ Node built-ins + Playwright do resolve.mjs cấp).
 * - `page.evaluate` CHỈ ĐỌC: không focus, không set style, không sửa DOM/CSS.
 *   NO-FOCUS-RING vì vậy đọc `document.styleSheets` thay vì focus thật.
 * - Kết quả tất định: số đếm + vị trí phần tử, không lấy mẫu text động (AC c8).
 * - File rule sai schema ⇒ báo tên file + field sai, bỏ qua đúng rule đó,
 *   lượt chạy vẫn tiếp tục.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export const RULE_VIEWPORTS = ['desktop', 'tablet-portrait', 'tablet-landscape', 'mobile']

// Ô "không áp dụng cho viewport này" (ví dụ TOUCH-TARGET-44 trên desktop).
export const NOT_APPLICABLE = 'n/a'

const SCOPES = new Set(['element', 'document'])
const OPS_WITH_VALUE = new Set(['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'matches', 'notMatches', 'in', 'notIn', 'contains', 'notContains'])
const OPS_WITHOUT_VALUE = new Set(['truthy', 'falsy', 'empty', 'notEmpty'])
const OPS_ARRAY_VALUE = new Set(['in', 'notIn'])
const OPS_REGEX_VALUE = new Set(['matches', 'notMatches'])

// Từ vựng fact — engine cấp sẵn, rule chỉ việc ghép lại bằng data.
const ELEMENT_FACTS = new Set([
  'tag', 'visible', 'text', 'accessibleName', 'hasDirectText',
  'scrollWidth', 'clientWidth', 'scrollHeight', 'clientHeight',
  'overflowAmountX', 'overflowAmountY',
  'labelFor', 'focusRingDeclared', 'focusRingSuppressed',
  'inViewport'
])
const ELEMENT_FACT_PREFIXES = ['style:', 'styleNum:', 'attr:', 'hasAttr:', 'closest:', 'rect:', 'contrast:', 'overlap:', 'component:']
const RECT_FIELDS = new Set(['width', 'height', 'top', 'left', 'right', 'bottom'])
const DOCUMENT_FACTS = new Set([
  'doc:maxScrollWidth', 'doc:clientWidth', 'doc:overflowX',
  'doc:maxScrollHeight', 'doc:clientHeight',
  'win:innerWidth', 'win:innerHeight'
])

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function knownFact(name, scope) {
  if (typeof name !== 'string' || !name) return false
  if (scope === 'document') return DOCUMENT_FACTS.has(name)
  if (ELEMENT_FACTS.has(name)) return true
  if (DOCUMENT_FACTS.has(name)) return true // rule element vẫn được so với số đo trang
  for (const prefix of ELEMENT_FACT_PREFIXES) {
    if (!name.startsWith(prefix)) continue
    const arg = name.slice(prefix.length)
    if (!arg) return false
    if (prefix === 'rect:') return RECT_FIELDS.has(arg)
    return true
  }
  return false
}

/** Kiểm tra cây điều kiện; trả về chuỗi mô tả field sai, hoặc null nếu hợp lệ. */
function validateMatch(node, scope, path) {
  if (!isPlainObject(node)) return { field: path, message: 'phải là object điều kiện' }
  const combinators = ['all', 'any'].filter((key) => key in node)
  if ('not' in node) combinators.push('not')
  const isLeaf = 'fact' in node || 'op' in node
  if (combinators.length > 1) return { field: path, message: `chỉ được dùng một trong all/any/not, đang có: ${combinators.join(', ')}` }
  if (combinators.length === 1 && isLeaf) return { field: path, message: 'không được trộn combinator (all/any/not) với leaf (fact/op)' }

  if (combinators.length === 1) {
    const key = combinators[0]
    if (key === 'not') return validateMatch(node.not, scope, `${path}.not`)
    if (!Array.isArray(node[key]) || node[key].length === 0) return { field: `${path}.${key}`, message: 'phải là mảng điều kiện không rỗng' }
    for (let i = 0; i < node[key].length; i++) {
      const err = validateMatch(node[key][i], scope, `${path}.${key}[${i}]`)
      if (err) return err
    }
    return null
  }

  if (typeof node.fact !== 'string' || !node.fact) return { field: `${path}.fact`, message: 'thiếu tên fact' }
  if (!knownFact(node.fact, scope)) return { field: `${path}.fact`, message: `fact không tồn tại trong scope "${scope}": "${node.fact}"` }
  if (typeof node.op !== 'string' || !node.op) return { field: `${path}.op`, message: 'thiếu toán tử' }
  if (!OPS_WITH_VALUE.has(node.op) && !OPS_WITHOUT_VALUE.has(node.op)) {
    return { field: `${path}.op`, message: `toán tử không hợp lệ: "${node.op}"` }
  }
  if (OPS_WITH_VALUE.has(node.op)) {
    if (!('value' in node)) return { field: `${path}.value`, message: `toán tử "${node.op}" cần có value` }
    if (OPS_ARRAY_VALUE.has(node.op) && !Array.isArray(node.value)) return { field: `${path}.value`, message: `toán tử "${node.op}" cần value là mảng` }
    if (OPS_REGEX_VALUE.has(node.op)) {
      if (typeof node.value !== 'string') return { field: `${path}.value`, message: `toán tử "${node.op}" cần value là chuỗi regex` }
      try {
        new RegExp(node.value)
      } catch (err) {
        return { field: `${path}.value`, message: `regex không hợp lệ: ${err.message}` }
      }
    }
  }
  return null
}

/** Chuẩn hoá + kiểm tra một rule thô. Trả về { rule } hoặc { error }. */
export function validateRule(raw, prefix = '') {
  const p = (field) => `${prefix}${field}`
  if (!isPlainObject(raw)) return { error: { field: prefix || '(root)', message: 'rule phải là object JSON' } }
  if (typeof raw.id !== 'string' || !/^[A-Z0-9][A-Z0-9-]*$/.test(raw.id)) {
    return { error: { field: p('id'), message: 'id phải là chuỗi HOA/số/gạch nối, ví dụ "TOUCH-TARGET-44"' } }
  }
  if (typeof raw.description !== 'string' || !raw.description.trim()) {
    return { error: { field: p('description'), message: 'thiếu mô tả vi phạm (hiển thị trong RISKS.md)' } }
  }
  const scope = raw.scope === undefined ? 'element' : raw.scope
  if (!SCOPES.has(scope)) return { error: { field: p('scope'), message: `scope phải là "element" hoặc "document", đang là: ${JSON.stringify(raw.scope)}` } }
  if (scope === 'element' && (typeof raw.selector !== 'string' || !raw.selector.trim())) {
    return { error: { field: p('selector'), message: 'rule scope "element" bắt buộc có selector' } }
  }
  let viewports = null
  if (raw.viewports !== undefined) {
    if (!Array.isArray(raw.viewports) || raw.viewports.length === 0) {
      return { error: { field: p('viewports'), message: 'viewports phải là mảng không rỗng' } }
    }
    const bad = raw.viewports.filter((v) => !RULE_VIEWPORTS.includes(v))
    if (bad.length) return { error: { field: p('viewports'), message: `viewport không tồn tại: ${bad.join(', ')} (hợp lệ: ${RULE_VIEWPORTS.join(', ')})` } }
    viewports = raw.viewports.slice()
  }
  if (raw.enabled !== undefined && typeof raw.enabled !== 'boolean') {
    return { error: { field: p('enabled'), message: 'enabled phải là true/false' } }
  }
  if (!('match' in raw)) return { error: { field: p('match'), message: 'thiếu khối match' } }
  const matchErr = validateMatch(raw.match, scope, p('match'))
  if (matchErr) return { error: matchErr }

  return {
    rule: {
      id: raw.id,
      description: raw.description.trim(),
      scope,
      selector: scope === 'element' ? raw.selector.trim() : null,
      viewports,
      enabled: raw.enabled !== false,
      match: raw.match
    }
  }
}

/**
 * Nạp toàn bộ `.json` trong thư mục rule đầu tiên tồn tại trong `candidates`.
 * Trả về { dir, rules, errors } — errors không làm chết lượt chạy.
 */
export function loadRules(candidates) {
  const dirs = (Array.isArray(candidates) ? candidates : [candidates]).filter(Boolean)
  let dir = null
  for (const candidate of dirs) {
    try {
      if (existsSync(candidate) && statSync(candidate).isDirectory()) {
        dir = candidate
        break
      }
    } catch {}
  }
  if (!dir) return { dir: null, rules: [], errors: [] }

  const rules = []
  const errors = []
  const seen = new Map()
  const files = readdirSync(dir).filter((name) => name.toLowerCase().endsWith('.json')).sort()

  for (const file of files) {
    let parsed
    try {
      parsed = JSON.parse(readFileSync(join(dir, file), 'utf8').replace(/^\uFEFF/, ''))
    } catch (err) {
      errors.push({ file, field: '(JSON)', message: `không parse được: ${err.message}` })
      continue
    }
    const entries = Array.isArray(parsed) ? parsed : [parsed]
    for (let i = 0; i < entries.length; i++) {
      const prefix = Array.isArray(parsed) ? `[${i}].` : ''
      const { rule, error } = validateRule(entries[i], prefix)
      if (error) {
        errors.push({ file, field: error.field, message: error.message })
        continue
      }
      if (seen.has(rule.id)) {
        errors.push({ file, field: `${prefix}id`, message: `trùng id với ${seen.get(rule.id)}` })
        continue
      }
      seen.set(rule.id, file)
      rule.file = file
      rules.push(rule)
    }
  }

  rules.sort((a, b) => a.id.localeCompare(b.id))
  return { dir, rules, errors }
}

export function rulesForViewport(rules, viewportName) {
  return rules.filter((rule) => rule.enabled && (!rule.viewports || rule.viewports.includes(viewportName)))
}

// ================================================================
// Hàm chạy TRONG TRANG — chỉ đọc, không mutate DOM/CSS/state.
// Phải tự chứa (Playwright serialize sang browser context).
// ================================================================
function auditInPage(payload) {
  const rules = payload.rules
  const doc = document
  const win = window
  const results = {}
  const elements = new Map()
  const violations = []
  const undeterminedMap = new Map()
  function locate(el) {
    const parts = []
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      const tag = node.localName
      let index = 1
      for (let sibling = node.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        if (sibling.localName === tag) index++
      }
      parts.unshift(`${tag}:nth-of-type(${index})`)
    }
    return parts.join(' > ')
  }

  // ---- chỉ mục :focus đọc từ stylesheet (thay cho việc focus thật)
  let focusIndex = null
  function outlineVerdict(style) {
    const raw = [
      style.getPropertyValue('outline'),
      style.getPropertyValue('outline-style'),
      style.getPropertyValue('outline-width')
    ].filter(Boolean).join(' ').trim().toLowerCase()
    if (!raw) return { suppressed: false, visible: false }
    if (/\bnone\b/.test(raw) || /(^|\s)0(px|em|rem|%)?(\s|$)/.test(raw)) return { suppressed: true, visible: false }
    return { suppressed: false, visible: true }
  }
  function ringVerdict(style) {
    const shadow = (style.getPropertyValue('box-shadow') || '').trim().toLowerCase()
    const outline = outlineVerdict(style)
    const hasShadow = Boolean(shadow) && shadow !== 'none'
    return { visible: outline.visible || hasShadow, suppressed: outline.suppressed && !hasShadow }
  }
  function baseSelectors(selectorText, wantFocus) {
    const out = []
    for (const part of String(selectorText).split(',')) {
      const trimmed = part.trim()
      if (!trimmed) continue
      const hasFocus = trimmed.indexOf(':focus') !== -1
      if (hasFocus !== wantFocus) continue
      let base = trimmed.replace(/::?focus-visible|::?focus-within|::?focus/g, '').trim()
      if (!base) base = '*'
      // Selector lồng (CSS nesting) dùng `&`: không giải được ngoài ngữ cảnh cha ⇒ bỏ qua.
      if (base.indexOf('&') !== -1) continue
      out.push(base)
    }
    return out
  }
  function buildFocusIndex() {
    const focusRing = []
    const focusSuppress = []
    const baseSuppress = []
    function walk(list) {
      let items
      try {
        items = Array.from(list || [])
      } catch {
        return
      }
      for (const rule of items) {
        // Chromium mới cho CSSStyleRule cả `.cssRules` (CSS nesting) — phải chấm
        // chính rule này TRƯỚC rồi mới đệ quy, không được `continue`.
        if (rule.selectorText && rule.style) {
          const verdict = ringVerdict(rule.style)
          if (verdict.visible || verdict.suppressed) {
            for (const base of baseSelectors(rule.selectorText, true)) {
              if (verdict.visible) focusRing.push(base)
              else focusSuppress.push(base)
            }
            if (verdict.suppressed) {
              for (const base of baseSelectors(rule.selectorText, false)) baseSuppress.push(base)
            }
          }
        }
        if (rule.cssRules) walk(rule.cssRules)
      }
    }
    let sheets
    try {
      sheets = Array.from(doc.styleSheets)
    } catch {
      sheets = []
    }
    for (const sheet of sheets) {
      let cssRules = null
      try {
        cssRules = sheet.cssRules
      } catch {
        continue // stylesheet cross-origin: bỏ qua, không thể đọc
      }
      walk(cssRules)
    }
    return { focusRing, focusSuppress, baseSuppress }
  }
  function matchesAny(el, selectors) {
    for (const selector of selectors) {
      try {
        if (el.matches(selector)) return true
      } catch {}
    }
    return false
  }
  function getFocusIndex() {
    if (!focusIndex) focusIndex = buildFocusIndex()
    return focusIndex
  }

  // ---- kiểm tra độ tương phản WCAG (CONTRAST-BELOW-AA, issue #1476)
  function parseColor(str) {
    if (!str) return null
    const m = str.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/i)
    if (!m) return null
    const r = parseFloat(m[1])
    const g = parseFloat(m[2])
    const b = parseFloat(m[3])
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1
    return { r, g, b, a }
  }

  function relativeLuminance(r, g, b) {
    const srgb = [r, g, b].map((v) => {
      const s = v / 255
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
  }

  function contrastRatio(l1, l2) {
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  function isLargeText(style) {
    const fontSize = parseFloat(style.fontSize) || 16
    const weight = style.fontWeight
    const isBold = weight === 'bold' || weight === 'bolder' || parseInt(weight, 10) >= 700
    return fontSize >= 24 || (fontSize >= 19 && isBold)
  }

  function computeContrast(ctx) {
    if (ctx._contrast) return ctx._contrast
    const el = ctx.el
    const style = ctx.style()
    const textColor = parseColor(style.color)
    if (!textColor || textColor.a === 0) {
      ctx._contrast = { verdict: 'none', ratio: null, reason: 'no-text-color' }
      return ctx._contrast
    }

    // Text color có alpha < 1, hoặc element có opacity < 1, mix-blend-mode, backdrop-filter
    if (textColor.a < 1 || parseFloat(style.opacity) < 1 ||
        (style.mixBlendMode && style.mixBlendMode !== 'normal') ||
        (style.backdropFilter && style.backdropFilter !== 'none')) {
      ctx._contrast = { verdict: 'undetermined', ratio: null, reason: 'element-transparency-or-filter' }
      return ctx._contrast
    }

    if (style.backgroundImage && style.backgroundImage !== 'none') {
      ctx._contrast = { verdict: 'undetermined', ratio: null, reason: 'element-background-image' }
      return ctx._contrast
    }

    let solidBg = null
    let undeterminedReason = null
    const selfBg = parseColor(style.backgroundColor)
    if (selfBg && selfBg.a === 1) {
      solidBg = selfBg
    } else if (selfBg && selfBg.a > 0) {
      undeterminedReason = 'element-semi-transparent-bg'
    } else {
      let curr = el.parentElement
      while (curr && curr.nodeType === 1) {
        const currStyle = win.getComputedStyle(curr)
        if (parseFloat(currStyle.opacity) < 1 ||
            (currStyle.mixBlendMode && currStyle.mixBlendMode !== 'normal') ||
            (currStyle.backdropFilter && currStyle.backdropFilter !== 'none') ||
            (currStyle.backgroundImage && currStyle.backgroundImage !== 'none')) {
          undeterminedReason = 'ancestor-layer-effect'
          break
        }
        const bg = parseColor(currStyle.backgroundColor)
        if (bg && bg.a === 1) {
          solidBg = bg
          break
        } else if (bg && bg.a > 0) {
          undeterminedReason = 'ancestor-semi-transparent-bg'
          break
        }
        curr = curr.parentElement
      }
    }

    if (undeterminedReason) {
      ctx._contrast = { verdict: 'undetermined', ratio: null, reason: undeterminedReason }
      return ctx._contrast
    }
    if (!solidBg) {
      ctx._contrast = { verdict: 'undetermined', ratio: null, reason: 'no-solid-background-found' }
      return ctx._contrast
    }

    const lText = relativeLuminance(textColor.r, textColor.g, textColor.b)
    const lBg = relativeLuminance(solidBg.r, solidBg.g, solidBg.b)
    const ratio = contrastRatio(lText, lBg)
    const isLarge = isLargeText(style)
    const threshold = isLarge ? 3.0 : 4.5
    const verdict = ratio < threshold ? 'fail' : 'pass'
    ctx._contrast = { verdict, ratio, isLarge, threshold }
    return ctx._contrast
  }

  // ---- chỉ mục overlap giữa các phần tử trong viewport (ELEMENT-OVERLAP, issue #1476)
  let overlapMap = null
  function buildOverlapIndex() {
    const map = new Map()
    const all = Array.from(doc.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, p, span, h1, h2, h3, h4, h5, h6, label, [role="button"], [role="link"], [role="tab"]'))
    const candidates = []
    const vpW = win.innerWidth
    const vpH = win.innerHeight

    for (const el of all) {
      const style = win.getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0) continue
      if (style.position === 'sticky' || style.position === 'fixed') continue
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) continue
      if (rect.bottom <= 0 || rect.top >= vpH || rect.right <= 0 || rect.left >= vpW) continue

      const isInteractive = el.matches('a[href], button, input, select, textarea, [role="button"], [role="link"], [role="tab"]')
      let hasText = false
      if (!isInteractive) {
        for (const node of el.childNodes) {
          if (node.nodeType === 3 && String(node.nodeValue || '').trim()) {
            hasText = true
            break
          }
        }
      }
      if (!isInteractive && !hasText) continue

      candidates.push({ el, rect, area: rect.width * rect.height })
    }

    for (let i = 0; i < candidates.length; i++) {
      const a = candidates[i]
      for (let j = i + 1; j < candidates.length; j++) {
        const b = candidates[j]
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue

        const ix = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left))
        const iy = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top))
        const interArea = ix * iy
        if (interArea <= 0) continue

        const minArea = Math.min(a.area, b.area)
        if (minArea <= 0) continue

        const ratio = interArea / minArea
        if (ratio > 0.25) {
          map.set(a.el, Math.max(map.get(a.el) || 0, ratio))
          map.set(b.el, Math.max(map.get(b.el) || 0, ratio))
        }
      }
    }
    return map
  }

  function getOverlapRatio(el) {
    if (!overlapMap) overlapMap = buildOverlapIndex()
    return overlapMap.get(el) || 0
  }

  // ---- trích xuất component profile (COMPONENT-INCONSISTENT, issue #1476)
  function getComponentProfile(el) {
    const style = win.getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') return null
    const role = el.getAttribute('role') || el.tagName.toLowerCase()
    const rawName = ((el.innerText || '').trim() || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('value') || '').trim()
    if (!rawName) return null
    const accNameShape = rawName.replace(/\d+/g, '#').replace(/\s+/g, ' ')
    const landmarkEl = el.closest('header, nav, main, aside, footer')
    const landmark = landmarkEl ? landmarkEl.tagName.toLowerCase() : 'none'
    const signature = `${role}::${accNameShape}::${landmark}`
    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) return null
    return {
      signature,
      height: Math.round(r.height),
      paddingTop: Math.round(parseFloat(style.paddingTop) || 0),
      paddingRight: Math.round(parseFloat(style.paddingRight) || 0),
      paddingBottom: Math.round(parseFloat(style.paddingBottom) || 0),
      paddingLeft: Math.round(parseFloat(style.paddingLeft) || 0),
      fontSize: Math.round(parseFloat(style.fontSize) || 0)
    }
  }

  // ---- fact scope document
  function docFact(name) {
    const body = doc.body
    switch (name) {
      case 'doc:maxScrollWidth':
        return Math.max(doc.documentElement.scrollWidth, body ? body.scrollWidth : 0)
      case 'doc:clientWidth':
        return doc.documentElement.clientWidth
      case 'doc:maxScrollHeight':
        return Math.max(doc.documentElement.scrollHeight, body ? body.scrollHeight : 0)
      case 'doc:clientHeight':
        return doc.documentElement.clientHeight
      case 'doc:overflowX':
        return Math.max(doc.documentElement.scrollWidth, body ? body.scrollWidth : 0) - win.innerWidth
      case 'win:innerWidth':
        return win.innerWidth
      case 'win:innerHeight':
        return win.innerHeight
      default:
        return null
    }
  }

  // ---- fact scope element
  function elementFact(ctx, name) {
    if (name in ctx.cache) return ctx.cache[name]
    const el = ctx.el
    let value = null
    if (name.indexOf(':') !== -1 && (name.startsWith('doc:') || name.startsWith('win:'))) {
      value = docFact(name)
    } else if (name.startsWith('style:')) {
      value = ctx.style().getPropertyValue(name.slice(6)).trim()
    } else if (name.startsWith('styleNum:')) {
      value = parseFloat(ctx.style().getPropertyValue(name.slice(9)))
      if (!Number.isFinite(value)) value = null
    } else if (name.startsWith('attr:')) {
      value = el.getAttribute(name.slice(5))
    } else if (name.startsWith('hasAttr:')) {
      value = el.hasAttribute(name.slice(8))
    } else if (name.startsWith('closest:')) {
      try {
        value = el.closest(name.slice(8)) !== null
      } catch {
        value = false
      }
    } else if (name.startsWith('rect:')) {
      const rect = ctx.rect()
      value = rect[name.slice(5)]
    } else if (name.startsWith('contrast:')) {
      const sub = name.slice(9)
      const res = computeContrast(ctx)
      value = sub === 'verdict' ? res.verdict : sub === 'ratio' ? res.ratio : sub === 'isLarge' ? res.isLarge : null
    } else if (name.startsWith('overlap:')) {
      const sub = name.slice(8)
      if (sub === 'ratio') value = getOverlapRatio(ctx.el)
      else if (sub === 'violates') value = getOverlapRatio(ctx.el) > 0.25
    } else {
      switch (name) {
        case 'tag':
          value = el.tagName.toLowerCase()
          break
        case 'visible': {
          const style = ctx.style()
          const rect = ctx.rect()
          value = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
          break
        }
        case 'inViewport': {
          const rect = ctx.rect()
          value = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < win.innerHeight && rect.right > 0 && rect.left < win.innerWidth
          break
        }
        case 'text':
          value = (el.innerText || el.textContent || '').trim()
          break
        case 'accessibleName':
          value = ((el.innerText || '').trim() || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('alt') || '').trim()
          break
        case 'hasDirectText': {
          let found = false
          for (const node of Array.from(el.childNodes)) {
            if (node.nodeType === 3 && String(node.nodeValue || '').trim()) {
              found = true
              break
            }
          }
          value = found
          break
        }
        case 'scrollWidth':
          value = el.scrollWidth
          break
        case 'clientWidth':
          value = el.clientWidth
          break
        case 'scrollHeight':
          value = el.scrollHeight
          break
        case 'clientHeight':
          value = el.clientHeight
          break
        case 'overflowAmountX':
          value = el.scrollWidth - el.clientWidth
          break
        case 'overflowAmountY':
          value = el.scrollHeight - el.clientHeight
          break
        case 'labelFor': {
          const id = el.getAttribute('id')
          let has = false
          if (id) {
            try {
              has = doc.querySelector(`label[for="${CSS.escape(id)}"]`) !== null
            } catch {
              has = false
            }
          }
          value = has
          break
        }
        case 'focusRingDeclared':
          value = matchesAny(el, getFocusIndex().focusRing)
          break
        case 'focusRingSuppressed': {
          const index = getFocusIndex()
          value = matchesAny(el, index.focusSuppress) || matchesAny(el, index.baseSuppress)
          break
        }
        default:
          value = null
      }
    }
    ctx.cache[name] = value
    return value
  }

  // ---- toán tử
  function compare(actual, cond) {
    const op = cond.op
    const value = cond.value
    switch (op) {
      case 'truthy':
        return Boolean(actual)
      case 'falsy':
        return !actual
      case 'empty':
        return actual === null || actual === undefined || String(actual).trim() === ''
      case 'notEmpty':
        return !(actual === null || actual === undefined || String(actual).trim() === '')
      case 'eq':
        return typeof value === 'number' ? Number(actual) === value : String(actual === null || actual === undefined ? '' : actual) === String(value)
      case 'ne':
        return typeof value === 'number' ? Number(actual) !== value : String(actual === null || actual === undefined ? '' : actual) !== String(value)
      case 'lt':
        return Number.isFinite(Number(actual)) && Number(actual) < Number(value)
      case 'lte':
        return Number.isFinite(Number(actual)) && Number(actual) <= Number(value)
      case 'gt':
        return Number.isFinite(Number(actual)) && Number(actual) > Number(value)
      case 'gte':
        return Number.isFinite(Number(actual)) && Number(actual) >= Number(value)
      case 'in':
        return value.map(String).indexOf(String(actual)) !== -1
      case 'notIn':
        return value.map(String).indexOf(String(actual)) === -1
      case 'contains':
        return String(actual === null || actual === undefined ? '' : actual).indexOf(String(value)) !== -1
      case 'notContains':
        return String(actual === null || actual === undefined ? '' : actual).indexOf(String(value)) === -1
      case 'matches':
      case 'notMatches': {
        let hit = false
        try {
          hit = new RegExp(value).test(String(actual === null || actual === undefined ? '' : actual))
        } catch {
          hit = false
        }
        return op === 'matches' ? hit : !hit
      }
      default:
        return false
    }
  }

  function evaluate(node, ctx) {
    if (node.all) return node.all.every((child) => evaluate(child, ctx))
    if (node.any) return node.any.some((child) => evaluate(child, ctx))
    if (node.not) return !evaluate(node.not, ctx)
    const actual = ctx === null ? docFact(node.fact) : elementFact(ctx, node.fact)
    return compare(actual, node)
  }

  for (const rule of rules) {
    try {
      if (rule.scope === 'document') {
        results[rule.id] = evaluate(rule.match, null) ? 1 : 0
        if (payload.details && results[rule.id]) {
          violations.push({ ruleId: rule.id, locator: null, boundingBox: null, reason: 'document-rule-no-element' })
        }
        continue
      }
      let nodes
      try {
        nodes = Array.from(doc.querySelectorAll(rule.selector))
      } catch {
        results[rule.id] = null // selector sai cú pháp: báo "?" thay vì chết lượt chạy
        continue
      }
      let count = 0
      for (const el of nodes) {
        const ctx = {
          el,
          cache: {},
          _style: null,
          _rect: null,
          style() {
            if (!this._style) this._style = win.getComputedStyle(this.el)
            return this._style
          },
          rect() {
            if (!this._rect) this._rect = this.el.getBoundingClientRect()
            return this._rect
          }
        }
        const failed = evaluate(rule.match, ctx)
        if (failed) count++
        if (payload.details) {
          if (!elements.has(el)) elements.set(el, { locator: locate(el), ruleIds: [] })
          if (failed) {
            const element = elements.get(el)
            element.ruleIds.push(rule.id)
            const rect = ctx.rect()
            violations.push({
              ruleId: rule.id,
              locator: element.locator,
              boundingBox: { x: rect.left + win.scrollX, y: rect.top + win.scrollY, width: rect.width, height: rect.height }
            })
          }
          if (rule.id === 'CONTRAST-BELOW-AA' && ctx._contrast && ctx._contrast.verdict === 'undetermined') {
            const loc = locate(el)
            if (!undeterminedMap.has(loc)) {
              undeterminedMap.set(loc, {
                ruleId: rule.id,
                locator: loc,
                reason: ctx._contrast.reason || 'undetermined'
              })
            }
          }
        }
      }
      results[rule.id] = count
    } catch {
      results[rule.id] = null
    }
  }

  const components = []
  if (payload.details) {
    const compNodes = Array.from(doc.querySelectorAll('button, a[href], input:not([type="hidden"]), select, [role="button"], [role="link"], [role="tab"]'))
    for (const el of compNodes) {
      const prof = getComponentProfile(el)
      if (prof) {
        const r = el.getBoundingClientRect()
        components.push({
          locator: locate(el),
          ...prof,
          boundingBox: { x: r.left + win.scrollX, y: r.top + win.scrollY, width: r.width, height: r.height }
        })
      }
    }
  }

  return payload.details ? {
    counts: results,
    elements: Array.from(elements.values()),
    violations,
    undetermined: Array.from(undeterminedMap.values()),
    components
  } : results
}

/**
 * Chấm toàn bộ rule áp dụng cho một viewport trên trang đang mở.
 * Mặc định trả { [ruleId]: number | null } — null = không chấm được rule đó.
 * details: true trả { counts, elements, violations, undetermined, components }; boundingBox theo CSS px của document.
 */
export async function evaluateRules(page, rules, viewportName, { details = false } = {}) {
  const applicable = rulesForViewport(rules, viewportName).map((rule) => ({
    id: rule.id,
    scope: rule.scope,
    selector: rule.selector,
    match: rule.match
  }))
  if (!applicable.length) return details ? { counts: {}, elements: [], violations: [], undetermined: [], components: [] } : {}
  return page.evaluate(auditInPage, { rules: applicable, details })
}

/**
 * Đánh giá tính không nhất quán của component giữa các route (COMPONENT-INCONSISTENT, issue #1476).
 * So sánh height, padding, font-size ở cùng một viewport. Báo khi lệch > thresholdPx (mặc định 4px) trên >= minRoutes (mặc định 3).
 */
export function evaluateCrossRouteInconsistencies(allComponentSamples, minRoutes = 3, thresholdPx = 4) {
  const violations = []
  const byVpAndSig = new Map()
  for (const sample of allComponentSamples) {
    const key = `${sample.viewport}:::${sample.signature}`
    if (!byVpAndSig.has(key)) byVpAndSig.set(key, [])
    byVpAndSig.get(key).push(sample)
  }

  for (const [, samples] of byVpAndSig) {
    const distinctRoutes = new Set(samples.map((s) => s.route))
    if (distinctRoutes.size < minRoutes) continue

    const metrics = ['height', 'fontSize', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
    let inconsistentMetric = null
    for (const m of metrics) {
      const vals = samples.map((s) => s[m])
      const min = Math.min(...vals)
      const max = Math.max(...vals)
      if (max - min > thresholdPx) {
        inconsistentMetric = m
        break
      }
    }

    if (inconsistentMetric) {
      const sortedVals = samples.map((s) => s[inconsistentMetric]).sort((a, b) => a - b)
      const median = sortedVals[Math.floor(sortedVals.length / 2)]
      for (const sample of samples) {
        if (Math.abs(sample[inconsistentMetric] - median) > thresholdPx) {
          violations.push({
            type: 'violation',
            route: sample.route,
            viewport: sample.viewport,
            ruleId: 'COMPONENT-INCONSISTENT',
            locator: sample.locator,
            boundingBox: sample.boundingBox,
            reason: `Lệch ${inconsistentMetric} (${sample[inconsistentMetric]}px vs median ${median}px trên ${distinctRoutes.size} route)`
          })
        }
      }
    }
  }
  return violations
}
