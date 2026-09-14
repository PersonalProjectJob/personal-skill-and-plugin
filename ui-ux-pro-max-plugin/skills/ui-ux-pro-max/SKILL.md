---
name: ui-ux-pro-max
description: >-
  Use when designing, building, reviewing, or fixing web, mobile, or desktop
  interfaces and a concrete visual or architectural direction is needed — picking
  styles, palettes, font pairings, UX guidelines, icons, GSAP presets, charts,
  and stack-specific implementation details. Searchable local database of 84 UI
  styles (79 searchable, 50 active), 192 product palettes & reasoning profiles,
  74 font pairings, 119 UX guidelines, 105 curated icons, 17 GSAP presets, 25
  chart types across 22 stacks. Requires Python on PATH. Trigger
  "ui-ux-pro-max".
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design intelligence for web, mobile, and desktop applications: **84 UI styles** (79 searchable, 50 active), **192 product palettes and reasoning profiles**, **74 font pairings**, **119 UX guidelines**, **105 curated icons**, **17 GSAP presets**, **25 chart types**, and **22 technology stacks**.

## When to Apply

Use this Skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**:
- Designing new pages, layouts, or wireframes
- Creating or refactoring UI components
- Choosing color palettes, typography, spacing, and layout systems
- Reviewing UI for UX, accessibility, and visual consistency
- Implementing navigation, animations, transitions, or responsive behavior
- Improving perceived quality, performance, and usability

Skip it for pure backend logic, database design, non-visual performance work, or DevOps/infrastructure — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Rule Categories by Priority

Follow priority 1→10 to decide which category to focus on first; use `--domain <Domain>` to query full details. The complete rule text for every category lives in `references/quick-reference.md`.

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|---|---|---|---|---|---|
| 1 | **Accessibility** | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | **Touch & Interaction** | CRITICAL | `ux` | Min size 44×44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | **Performance** | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | **Style Selection** | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | **Layout & Responsive** | HIGH | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | **Typography & Color** | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic color tokens | Text < 12px body, Gray-on-gray, Raw hex in components |
| 7 | **Animation** | MEDIUM | `ux`, `gsap` | Context-aware timing, Motion conveys meaning, Spatial continuity | One duration for every transition, Animating width/height, No reduced-motion |
| 8 | **Forms & Feedback** | MEDIUM | `ux` | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors only at top, Overwhelm upfront |
| 9 | **Navigation Patterns** | HIGH | `ux` | Predictable back, Bottom nav ≤5, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | **Charts & Data** | LOW | `chart` | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

---

## Prerequisites

The bundled search engine requires Python 3 (standard library only — no external pip dependencies, no network access). Check availability:

```bash
python3 --version || python --version
```

If Python is not installed, install it based on the OS:
- **macOS:** `brew install python3`
- **Ubuntu/Debian:** `sudo apt update && sudo apt install python3`
- **Windows:** `winget install Python.Python.3.12`

> **Note for Windows:** Use `python` instead of `python3` to execute scripts.

---

## Running the Search Tool

Locate the `search.py` script path in your agent environment (e.g. `skills/ui-ux-pro-max/scripts/search.py` or `.claude/skills/ui-ux-pro-max/scripts/search.py` or `.gemini/skills/ui-ux-pro-max/scripts/search.py`):

```bash
python <path-to-skill>/scripts/search.py "<query>" [options]
```

---

## Query Contract

Choose the smallest search mode that fits the request:
1. **New project/page or system-wide visual direction** → use `--design-system`.
2. **Targeted concern or component bug** → use one explicit `--domain`.
3. **Known implementation stack** → use `--stack`; add a separate domain search only for a distinct design concern.

Build each query around **one dominant intent**, using **2–5 meaningful terms** plus one useful constraint such as product, platform, or interaction. Verify the returned domain/category, top result identity, and fit for the user's product and platform before applying it.

---

## Workflow

### Step 1: Analyze User Requirements

Extract key parameters:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, entertainment, tool, productivity, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, vibrant, etc.
- **Industry**: fintech, healthcare, gaming, education, crypto, wellness, etc.
- **Stack**: detect from project (`package.json`, `composer.json`, `pubspec.yaml`, etc.) or ask user. Never assume a default stack.

### Step 2: Generate Design System (REQUIRED for new pages/projects)

**Always start with `--design-system`** to get comprehensive recommendations backed by `ui-reasoning.csv`:

```bash
python <path-to-skill>/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

**Example:**
```bash
python <path-to-skill>/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### Step 2b: Persist Design System (Master + Overrides Pattern)

To save the design system for hierarchical retrieval across sessions, add `--persist`:

```bash
python <path-to-skill>/scripts/search.py "<query>" --design-system --persist -p "Project Name" --output-dir "<project-root>"
```

This creates:
- `design-system/<project-slug>/MASTER.md` — Global Source of Truth with all design rules
- `design-system/<project-slug>/pages/` — Folder for page-specific overrides

With page-specific override:
```bash
python <path-to-skill>/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard" --output-dir "<project-root>"
```

**Hierarchical retrieval rules:**
1. When building a page, check `design-system/<project-slug>/pages/<page-name>.md` first.
2. If it exists, its rules **override** the Master file.
3. Otherwise, use `design-system/<project-slug>/MASTER.md` exclusively.

### Step 2c: Design Dials (Optional Sliders 1–10)

Tune `--design-system` output using three optional sliders:

```bash
python <path-to-skill>/scripts/search.py "<query>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```

| Dial | Low (1-3) | Mid (4-7) | High (8-10) |
|---|---|---|---|
| `--variance` | Centered / minimal | Balanced / modern | Bold / asymmetric (Brutalism, Bento) |
| `--motion` | Subtle micro-interactions | Standard scroll/stagger motion | Complex choreography (GSAP pin, SplitText) |
| `--density` | Spacious (24–96px spacing) | Standard (16–64px spacing) | Dense/dashboard (8–32px spacing) |

- `--motion` attaches a matching GSAP snippet from `motion.csv`.
- `--density` overrides `--space-*` CSS variable tokens.

### Step 3: Supplement with Detailed Searches (as needed)

```bash
python <path-to-skill>/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| Need | Domain | Example Query |
|---|---|---|
| Product type patterns | `product` | `"entertainment social" --domain product` |
| UI styles & AI prompts | `style` | `"glassmorphism dark" --domain style` |
| Color palettes | `color` | `"entertainment vibrant" --domain color` |
| Font pairings | `typography` | `"playful modern" --domain typography` |
| Google Fonts lookup | `google-fonts` | `"sans serif popular variable" --domain google-fonts` |
| Chart recommendations | `chart` | `"real-time dashboard" --domain chart` |
| UX best practices | `ux` | `"error summary validation" --domain ux` |
| Landing page structure | `landing` | `"hero social-proof" --domain landing` |
| Curated SVG icons | `icons` | `"decorative icon aria hidden" --domain icons` |
| GSAP animation presets | `gsap` | `"scroll reveal stagger" --domain gsap` |
| React/Next.js performance | `react` | `"rerender memo list" --domain react` |
| App/mobile interface guidelines | `web` | `"accessibilityLabel touch safe-areas" --domain web` |

### Step 4: Stack Guidelines

```bash
python <path-to-skill>/scripts/search.py "<keyword>" --stack <stack>
```

**Supported 22 stacks:**
`html-tailwind`, `react`, `nextjs`, `astro`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`, `threejs`, `angular`, `laravel`, `javafx`, `wpf`, `winui`, `avalonia`, `uno`, `uwp`.

---

## Zero-Result Fallback Handling

If a search returns 0 results:
1. Retry once with a narrower query or explicit domain/stack.
2. If still empty, fall back to the priority table and state clearly that general defaults are being used.
3. Never fabricate or present a 0-result search as valid data.

## Output Formats

- `-f ascii` (default): Terminal display format
- `-f markdown`: Formatted markdown documentation
- `--json`: Machine-readable JSON output

## Pre-Delivery Quality Checklist

Before delivering UI/UX code, check:
1. **Visual & Styling**: Consistent tokens used, no raw hex colors, SVGs used instead of emojis for icons.
2. **Interaction & States**: Hover, focus, active, disabled, loading states present for all interactive elements.
3. **Accessibility**: Color contrast ≥ 4.5:1, interactive touch targets ≥ 44×44px, `aria-label` on icon buttons, keyboard navigable.
4. **Responsive Layout**: Mobile-first, no horizontal scrollbar on small screens, test at 360px, 768px, 1024px, 1440px.
5. **Performance**: Images lazy loaded, no layout shifts (CLS < 0.1), list virtualization for large datasets.