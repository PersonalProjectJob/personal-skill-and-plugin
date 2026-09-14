#!/usr/bin/env node
/**
 * sitemap-diagram.mjs — Sinh sơ đồ Sitemap bằng Mermaid từ OBSERVED-ARCHITECTURE.md hoặc route logs
 * 
 * Tác vụ:
 * 1. Đọc và bóc tách danh sách route từ OBSERVED-ARCHITECTURE.md (bảng Markdown), adventure-log.jsonl hoặc JSON
 * 2. Phân loại theo cấu trúc URL hierarchy và cụm nghiệp vụ (Subgraphs/Clusters)
 * 3. Sinh sơ đồ Mermaid (flowchart TD / graph TD) chuẩn cú pháp, an toàn ký tự đặc biệt, có styling class
 * 4. Tự động cập nhật trực tiếp vào file Markdown (--update) kèm fallback text tree
 *
 * Sử dụng:
 *   node sitemap-diagram.mjs [--input OBSERVED-ARCHITECTURE.md] [--output SITEMAP.md] [--update] [--target https://example.com]
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

// Phân tích tham số dòng lệnh
const args = process.argv.slice(2).reduce((acc, cur, idx, arr) => {
  if (cur.startsWith('--')) {
    const key = cur.slice(2)
    const next = arr[idx + 1]
    acc[key] = next && !next.startsWith('--') ? next : true
  }
  return acc
}, {})

const inputPath = args.input || args.i || findDefaultInput()
const outputPath = args.output || args.o
const shouldUpdate = Boolean(args.update)
const targetUrl = args.target || 'https://target-domain/'

function findDefaultInput() {
  const candidates = [
    'OBSERVED-ARCHITECTURE.md',
    '.e2e/out/adventure/OBSERVED-ARCHITECTURE.md',
    'out/adventure/OBSERVED-ARCHITECTURE.md',
    '.e2e/out/adventure/adventure-log.jsonl',
    'out/adventure/adventure-log.jsonl'
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return 'OBSERVED-ARCHITECTURE.md'
}

/**
 * Trích xuất danh sách route từ file markdown hoặc jsonl
 */
export function extractRoutes(content, filePath = '') {
  const routes = []

  // 1. Nếu là JSONL
  if (filePath.endsWith('.jsonl') || content.trim().startsWith('{')) {
    const lines = content.split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        if (obj.route) {
          routes.push({
            route: obj.route,
            title: obj.title || obj.route,
            status: obj.status || 200,
            from: obj.from || '/'
          })
        }
      } catch (_) {}
    }
    if (routes.length > 0) return routes
  }

  // 2. Parse Markdown Table trong OBSERVED-ARCHITECTURE.md
  // Hỗ trợ cả 2 dạng:
  // Dạng A: | STT | Phân hệ / Màn hình | Route | Desktop | ...
  // Dạng B: | Tên màn hình | URL nguyên văn | Tới từ | Desktop | ...
  const lines = content.split('\n')
  let inTable = false
  let colRouteIdx = -1
  let colTitleIdx = -1

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('|')) {
      if (inTable && !trimmed.startsWith('|')) {
        // Hết bảng
        inTable = false
      }
      continue
    }

    const cells = trimmed.split('|').map(c => c.trim()).slice(1, -1)
    if (cells.length < 2) continue

    // Nhận diện Header
    const lowerCells = cells.map(c => c.toLowerCase())
    if (lowerCells.some(c => c.includes('route') || c.includes('url nguyên văn'))) {
      inTable = true
      colRouteIdx = lowerCells.findIndex(c => c.includes('route') || c.includes('url'))
      colTitleIdx = lowerCells.findIndex(c => c.includes('phân hệ') || c.includes('tên màn hình') || c.includes('title'))
      continue
    }

    // Bỏ qua dòng phân cách |---|---|...
    if (cells[0].startsWith('---') || cells[0].startsWith(':---')) continue

    if (inTable && colRouteIdx !== -1) {
      let rawRoute = cells[colRouteIdx] || ''
      // Bóc markdown code block `/path/` -> /path/
      rawRoute = rawRoute.replace(/`/g, '').trim()

      if (!rawRoute.startsWith('/')) continue

      let rawTitle = colTitleIdx !== -1 ? cells[colTitleIdx] : ''
      // Làm sạch tiêu đề (bỏ thẻ html, bold tag, subtext)
      let cleanTitle = rawTitle
        .replace(/<small[\s\S]*?<\/small>/gi, '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\*\*/g, '')
        .trim()

      // Trích xuất subtext nếu có
      let subText = ''
      const smallMatch = rawTitle.match(/<small[^>]*>([\s\S]*?)<\/small>/i)
      if (smallMatch) {
        subText = smallMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim()
      }

      routes.push({
        route: rawRoute,
        title: cleanTitle || rawRoute,
        subText,
        rawTitle
      })
    }
  }

  // 3. Fallback: Parse danh sách Tree text dạng ├── [STT] Name (/route/) hoặc ├── /route/ (Name)
  if (routes.length === 0) {
    for (const line of lines) {
      const treeMatch = line.match(/[├└]──\s*(?:\[\d+\]\s*)?([^(]+)\s*\(([^)]+)\)/)
      if (treeMatch) {
        const part1 = treeMatch[1].trim()
        const part2 = treeMatch[2].trim()
        let route = part2.startsWith('/') ? part2 : (part1.startsWith('/') ? part1 : '')
        let title = part2.startsWith('/') ? part1 : part2
        if (route) {
          routes.push({ route, title })
        }
      }
    }
  }

  return routes
}

/**
 * Phân nhóm các route theo cụm nghiệp vụ hoặc URL path prefix
 */
export function categorizeRoutes(routes) {
  const categories = {
    core: { name: 'Trung tâm & AI', icon: '🌐', routes: [] },
    design: { name: 'Không gian & Thiết kế', icon: '🏗️', routes: [] },
    ecosystem: { name: 'Mạng lưới & Chuỗi cung ứng', icon: '🤝', routes: [] },
    procurement: { name: 'Hoạch định & Đấu thầu', icon: '📊', routes: [] },
    media: { name: 'Truyền thông & Tri thức', icon: '🎙️', routes: [] },
    governance: { name: 'Doanh nghiệp & Pháp lý', icon: '📜', routes: [] },
    other: { name: 'Phân hệ khác', icon: '🔗', routes: [] }
  }

  for (const item of routes) {
    const r = item.route.toLowerCase()
    const t = item.title.toLowerCase()

    if (r === '/' || r === '') {
      categories.core.routes.push(item)
    } else if (r.includes('ai-safety') || r.includes('ai') || t.includes('ai')) {
      categories.core.routes.push(item)
    } else if (r.includes('du-an') || r.includes('phong') || r.includes('studio') || t.includes('dự án') || t.includes('phòng') || t.includes('studio')) {
      categories.design.routes.push(item)
    } else if (r.includes('supplier') || r.includes('brand') || r.includes('nha-thau') || r.includes('creator') || t.includes('nhà thầu') || t.includes('cung cấp') || t.includes('thương hiệu')) {
      categories.ecosystem.routes.push(item)
    } else if (r.includes('planning') || r.includes('chon-thau') || r.includes('moi-thau') || r.includes('thau') || t.includes('thầu') || t.includes('hoạch định')) {
      categories.procurement.routes.push(item)
    } else if (r.includes('tin-tuc') || r.includes('podcast') || r.includes('blog') || t.includes('tin tức') || t.includes('podcast')) {
      categories.media.routes.push(item)
    } else if (r.includes('gioi-thieu') || r.includes('dieu-khoan') || r.includes('bao-mat') || r.includes('privacy') || r.includes('terms') || r.includes('partner-policy') || r.includes('chinh-sach')) {
      categories.governance.routes.push(item)
    } else {
      categories.other.routes.push(item)
    }
  }

  return categories
}

/**
 * Chuẩn hóa Node ID an toàn cho Mermaid
 */
function sanitizeNodeId(str) {
  return 'n_' + str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toLowerCase()
}

/**
 * Thoát ký tự nhạy cảm trong nhãn Mermaid
 */
function escapeMermaidLabel(text) {
  if (!text) return ''
  return text
    .replace(/"/g, "'")
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/[{}<>]/g, '')
    .trim()
}

/**
 * Xác định class styling cho node
 */
function getNodeClass(route, title) {
  const r = route.toLowerCase()
  const t = title.toLowerCase()

  if (r === '/' || r === '') return 'root'
  if (r.includes('form') || r.includes('moi-thau') || t.includes('form') || t.includes('mời thầu')) return 'form'
  if (r.includes('dieu-khoan') || r.includes('bao-mat') || r.includes('terms') || r.includes('privacy') || r.includes('policy')) return 'policy'
  if (r.includes('tin-tuc') || r.includes('podcast')) return 'media'
  if (r.includes('ai-safety') || r.includes('ai')) return 'ai'
  return 'page'
}

/**
 * Sinh mã Mermaid Diagram Sitemap hoàn chỉnh
 */
export function buildMermaidSitemap(routes, options = {}) {
  const domain = options.domain || 'Trang chủ Hệ thống'
  const dir = options.direction || 'LR'
  const rootItem = routes.find(r => r.route === '/' || r.route === '') || { route: '/', title: domain }
  const categories = categorizeRoutes(routes.filter(r => r.route !== '/' && r.route !== ''))

  let mmd = `\`\`\`mermaid
flowchart ${dir}
  %% --- Định nghĩa Bảng màu & Kiểu dáng Node chuẩn UI/UX trực quan ---
  classDef root fill:#312e81,stroke:#6366f1,stroke-width:3px,color:#ffffff;
  classDef group fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#38bdf8;
  classDef page fill:#1e293b,stroke:#475569,stroke-width:1.5px,color:#f8fafc;
  classDef form fill:#78350f,stroke:#f59e0b,stroke-width:1.5px,color:#fef3c7;
  classDef policy fill:#1e293b,stroke:#94a3b8,stroke-width:1px,color:#cbd5e1;
  classDef media fill:#064e3b,stroke:#10b981,stroke-width:1.5px,color:#ecfdf5;
  classDef ai fill:#3b0764,stroke:#a855f7,stroke-width:1.5px,color:#faf5ff;

  %% Root Domain
  ROOT["🌐 <b>${escapeMermaidLabel(rootItem.title)}</b><br/><code>${rootItem.route}</code>"]:::root
`

  // Duyệt qua các phân nhóm
  const categoryKeys = Object.keys(categories).filter(k => categories[k].routes.length > 0)

  for (const catKey of categoryKeys) {
    const cat = categories[catKey]
    const catId = `CAT_${catKey.toUpperCase()}`
    
    mmd += `\n  subgraph ${catId}["${cat.icon} ${cat.name}"]\n`
    if (dir === 'LR') {
      mmd += `    direction TB\n`
    }

    for (const item of cat.routes) {
      const nodeId = sanitizeNodeId(item.route)
      const nodeClass = getNodeClass(item.route, item.title)
      const label = escapeMermaidLabel(item.title)
      const sub = item.subText ? `<br/><small>${escapeMermaidLabel(item.subText.slice(0, 42))}...</small>` : ''
      
      mmd += `    ${nodeId}["<b>${label}</b>${sub}<br/><code>${item.route}</code>"]:::${nodeClass}\n`
    }

    mmd += `  end\n`
    mmd += `  ROOT --> ${catId}\n`
  }


  // Kết nối phân cấp phụ (Parent-Child Routes) nếu có
  const pathRoutes = routes.filter(r => r.route.split('/').filter(Boolean).length > 1)
  if (pathRoutes.length > 0) {
    mmd += `\n  %% Quan hệ phân cấp chi tiết (Parent -> Sub-page)\n`
    for (const sub of pathRoutes) {
      const parts = sub.route.split('/').filter(Boolean)
      const parentPath = '/' + parts.slice(0, -1).join('/') + '/'
      const parentItem = routes.find(r => r.route === parentPath || r.route === parentPath.slice(0, -1))
      if (parentItem) {
        const pId = sanitizeNodeId(parentItem.route)
        const cId = sanitizeNodeId(sub.route)
        mmd += `  ${pId} -.-> ${cId}\n`
      }
    }
  }

  mmd += `\`\`\`\n`
  return mmd
}

/**
 * Sinh fallback Text Tree
 */
export function buildTextTree(routes, target = 'Target') {
  let txt = `\`\`\`text\n${target}\n`
  routes.forEach((r, idx) => {
    const isLast = idx === routes.length - 1
    const prefix = isLast ? '└── ' : '├── '
    txt += `${prefix}[${idx + 1}] ${r.title} (${r.route})\n`
  })
  txt += `\`\`\`\n`
  return txt
}

/**
 * Xử lý chính
 */
function main() {
  if (!existsSync(inputPath)) {
    console.error(`❌ Không tìm thấy file đầu vào: ${inputPath}`)
    process.exit(1)
  }

  const rawContent = readFileSync(inputPath, 'utf8')
  const routes = extractRoutes(rawContent, inputPath)

  if (routes.length === 0) {
    console.error(`⚠️ Không tìm thấy route nào trong ${inputPath}`)
    process.exit(1)
  }

  console.log(`🔍 Đã bóc tách thành công ${routes.length} routes từ ${inputPath}`)

  const mermaidDiagram = buildMermaidSitemap(routes, { domain: 'dezon.vn' })
  const textTree = buildTextTree(routes, targetUrl)

  const sitemapSection = `## Sơ đồ Cây Điều hướng & Phân hệ Sitemap (Interactive Mermaid Sitemap)

> 💡 **Sơ đồ Trực quan:** Biểu đồ Mermaid hiển thị cấu trúc phân cấp toàn bộ các phân hệ nghiệp vụ, phân loại rõ ràng giữa Trang nội dung, Cụm tương tác (Forms), Media và Quy chuẩn pháp lý.

${mermaidDiagram}

<details>
<summary><b>📋 Bấm để mở danh sách dạng Cây Văn bản (Text Tree Fallback)</b></summary>

${textTree}

</details>
`

  if (shouldUpdate) {
    // Cập nhật trực tiếp vào file markdown
    let updatedContent = rawContent

    // Tìm vị trí Section Cây điều hướng cũ
    const treeRegex = /##\s*(?:[0-9]+\.)?\s*(?:Cây [Đđ]iều hướng|Bản đồ Phân hệ|Navigation Tree|Sơ đồ Cây)[^\n]*\n([\s\S]*?)(?=\n##\s|\n---\s*\n##|$)/i

    if (treeRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(treeRegex, sitemapSection + '\n')
      console.log(`✅ Đã cập nhật mục Sitemap Mermaid vào ${inputPath}`)
    } else {
      // Nối vào cuối tài liệu
      updatedContent += `\n---\n\n${sitemapSection}\n`
      console.log(`✅ Đã thêm mới mục Sitemap Mermaid vào cuối file ${inputPath}`)
    }

    writeFileSync(inputPath, updatedContent, 'utf8')
  }

  if (outputPath) {
    const fullOut = resolve(outputPath)
    writeFileSync(fullOut, sitemapSection, 'utf8')
    console.log(`✅ Đã xuất kết quả ra file: ${fullOut}`)
  }

  if (!shouldUpdate && !outputPath) {
    console.log('\n--- KẾT QUẢ MERMAID SITEMAP ---\n')
    console.log(sitemapSection)
  }
}

if (process.argv[1] && process.argv[1].endsWith('sitemap-diagram.mjs')) {
  main()
}
