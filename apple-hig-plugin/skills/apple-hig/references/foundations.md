# Foundations — Typography, Color, Materials, Icons, Tokens

## 1. Typography

Map every text element to a **semantic role**, never to a pt value:

`largeTitle` · `title` · `title2` · `title3` · `headline` · `body` · `callout` · `subheadline` ·
`footnote` · `caption`

| Role | Use for |
|---|---|
| `largeTitle` | Screen title or a deliberate hero |
| `title` / `title2` / `title3` | Section headings, descending |
| `headline` | Important label, card title |
| `body` | Main content |
| `callout` | Supporting information that needs emphasis |
| `subheadline` | Metadata |
| `footnote` / `caption` | Annotations, short secondary information |

### Rules

- `MUST` support Dynamic Type in native apps.
- `MUST` allow wrapping for any content supplied by a user, a backend, or a translator.
- `MUST NOT` attach a fixed line height that clips at larger text sizes.
- `MUST NOT` use a placeholder as a field's only label.
- `MUST NOT` convey state through font weight or color alone.
- `SHOULD` use the system font in native apps unless the brand has a clear reason not to.
- `MUST` test Vietnamese and English, plus a deliberately long string, at body / headline / button sizes.

### Acceptance criteria

Nothing clips at supported accessibility text sizes · reading order matches visual order · heading
hierarchy is consistent · no important text baked into a bitmap · numbers, units, and dates follow the
locale.

## 2. Color and appearance

### Semantic mapping

| Token | SwiftUI |
|---|---|
| `color.background.primary` | `Color(.systemBackground)` |
| `color.background.secondary` | `Color(.secondarySystemBackground)` |
| `color.background.tertiary` | `Color(.tertiarySystemBackground)` |
| `color.text.primary` | `Color(.label)` |
| `color.text.secondary` | `Color(.secondaryLabel)` |
| `color.text.tertiary` | `Color(.tertiaryLabel)` |
| `color.separator` | `Color(.separator)` |
| `color.fill.primary` | `Color(.systemFill)` |
| `color.action.accent` | `Color.accentColor` |
| `color.status.error` | `Color(.systemRed)` |
| `color.status.warning` | `Color(.systemOrange)` |
| `color.status.success` | `Color(.systemGreen)` |

### Rules

- `MUST` use semantic colors in native apps; supply Light/Dark adaptive assets for custom colors.
- `MUST` verify Light Mode, Dark Mode, Increase Contrast, and Reduce Transparency.
- `MUST` reach adequate contrast. For custom content the working target is at least **4.5:1** for
  normal text — `Project decision`, aligned with WCAG AA, not an Apple-published number.
- `MUST NOT` hardcode `#FFFFFF` as a system background or `#000000` as a primary label in a native app.
- `MUST NOT` use low opacity for important text.
- `MUST NOT` rely on color alone to signal success, warning, or error.
- `SHOULD` let system materials handle blur and glass in native apps.

### Materials and Liquid Glass

- `SHOULD` reach for the newer system APIs and components before hand-building a material.
- `MUST` keep the hierarchy between content and controls legible.
- `MUST` ensure controls do not blend into whatever image or video sits behind them.
- `MUST` check Reduce Transparency and Increase Contrast.
- `MUST NOT` apply glass decoratively to every surface.
- `MUST NOT` use transparency as the only cue separating layers.

### Acceptance criteria

Legible in Light and Dark · brand color does not destroy disabled or selected states · errors carry an
icon or text, not only red · selected state has more than one cue where it matters.

## 3. Icons and symbols

- `SHOULD` use SF Symbols in native Apple apps.
- `MUST` respect a symbol's established meaning.
- `MUST` keep weight and scale compatible with adjacent text.
- `MUST` give every icon-only control an accessible label.
- `MUST NOT` reshape a symbol enough to change its meaning or breach asset restrictions.
- `MUST NOT` substitute an icon for text when the icon is not self-evident.
- `SHOULD` use filled and outlined variants consistently to express selection.

### Acceptance criteria

Renders correctly across weights and text sizes · VoiceOver announces the action, not an asset name ·
no two different icons for the same action in one product.

---

# Design Tokens

> This is a **project starter set**, not an Apple-published table. In native apps, system semantic
> values take precedence over every number below. Every value in this section is a `Project decision`
> unless it names a system API.

## 4. Token principles

- `MUST` name tokens by role, not by appearance.
- `MUST` separate semantic tokens from primitive tokens.
- `MUST` support Light and Dark.
- `MUST` support Increase Contrast if using a custom palette.
- `MUST NOT` hardcode a raw value in a component when a token exists.
- `SHOULD` provide tokens for focus, selected, disabled, error, and warning.
- `SHOULD` keep the spacing and radius sets small enough to stay consistent.

## 5. Spacing

```yaml
spacing: { none: 0, xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, 2xl: 32, 3xl: 40, 4xl: 48 }
```

| Token | Use for |
|---|---|
| `xs` | Icon-to-label gap |
| `sm` | Inside a control |
| `md` | Between related elements |
| `lg` | Card or section padding |
| `xl` | Between groups |
| `2xl`+ | Section separation, empty states |

`SHOULD` keep `8 / 16 / 24 / 32` as the primary rhythm. `MAY` deviate where a system component dictates
its own metrics. `MUST NOT` force a system control to match a token if that breaks its native metrics.
`MUST` note every exception.

## 6. Radius

```yaml
radius: { none: 0, small: 6, medium: 10, large: 14, xlarge: 20, capsule: 999 }
```

Native system components `SHOULD` keep their default radius. `MUST NOT` apply capsule to every button.
`MUST` keep radius proportional to component size.

## 7. Border and separator

```yaml
border: { hairline: 0.5, regular: 1, strong: 2 }
```

`SHOULD` use the semantic separator. `MUST` avoid a heavy border around every card. `SHOULD` reach for
grouping, spacing, or material before adding a border.

## 8. Elevation and materials

```yaml
elevation:
  flat: none
  floating: "Popover, floating control, or panel that must separate from the background"
  modal:    "Prefer system-managed presentation"
```

Native apps `SHOULD` use the system background hierarchy and framework materials, with a light shadow
only where layering genuinely needs it. `MUST NOT` build a web-style multi-level shadow system when
system materials already suffice.

## 9. Control sizing

```yaml
control:
  minimum_interaction_target: "44x44 pt for touch interfaces"
  compact_height: 32
  regular_height: 44
  large_height:   50
```

System control metrics take precedence over these numbers. A visual glyph `MAY` be smaller than its
interaction target, but the hit area `MUST` remain adequate, and adjacent controls `MUST NOT` have
overlapping hit areas.

## 10. Motion

```yaml
motion: { instant: 0ms, fast: 120ms, standard: 200ms, emphasized: 320ms }
```

`Project decision`, not Apple timing. Native apps `SHOULD` prefer system animations. Under Reduce
Motion, a large transition `MUST` become a fade or a plain state change.

## 11. Custom component token contract

Every custom component declares:

```yaml
component:
  background: semantic_color_token
  foreground: semantic_color_token
  typography:  semantic_type_token
  spacing:     spacing_token
  radius:      radius_token
  state:
    disabled_opacity: project_token
    focus_indicator:  semantic_token
    error_indicator:  semantic_token
```

## 12. Token review checklist

- [ ] Token names describe role, not appearance
- [ ] Light and Dark values exist
- [ ] Contrast checked
- [ ] No raw values hardcoded in components
- [ ] Figma ↔ code mapping exists
- [ ] Usage documented
- [ ] No gratuitous override of system component metrics
