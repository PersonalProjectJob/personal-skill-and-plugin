---
name: frontend-code-standards
description: Ensure high-quality FE coding by enforcing strict type/prop checks, security controls, and architectural guidelines (component size limits, state separation, no hardcoded colors).
---

# Frontend Code Standards & Quality Guard Skill

This skill enforces strict standards for React and JavaScript code in the codebase, covering static analysis, security safeguards, and architectural best practices.

## Why this skill exists

To ensure the Front-End codebase remains clean, secure, scalable, and visually consistent:
1. **Type & Prop Safety**: Ensures components have clear contracts, correct imports, and proper prop validations, reducing runtime errors.
2. **Security & Best Practices**: Eliminates client-side vulnerabilities like XSS, hardcoded secrets, and unvalidated form submissions.
3. **Architectural Cleanliness**: Enforces strict component size limits, separates server state from UI state, and prevents prop drilling.

---

## Core Guidelines & Workflow

### 1. Static Validation & Clean Imports (LSP & Module Health)
When editing or creating React components:
- **Prop Validation**: Ensure all React components declare prop types or JSDoc comments to document props, ensuring clear interfaces.
- **Import Ordering**: Maintain a clean, consistent import hierarchy:
  1. React core and hooks.
  2. Third-party libraries.
  3. Internal aliases (`@/config`, `@/lib`, `@/services`, `@/stores`, `@/hooks`, `@/contexts`, `@/models`, `@/components`, `@/utils`).
  4. Relative imports.
  5. Style imports.
- **Direct Imports**: Prefer importing specific exports directly rather than using large barrel files to prevent bundle bloating.
- **Vite & Build Verification**: Before completing any change, run `npm run build` to verify the code compiles without bundler warnings or errors.

### 2. Security Guard & Best Practices
Always check the front-end code for the following security and logger standards:
- **No Unsafe HTML Rendering (XSS Prevention)**: Never use `dangerouslySetInnerHTML` directly without sanitizing. If rendering HTML is unavoidable, wrap the input using a sanitization function (e.g., DOMPurify or custom sanitizer).
- **No Hardcoded Secrets**: Scan files to ensure API keys, private URLs, or credentials are NOT hardcoded. They must be fetched from environment variables via `import.meta.env.VITE_*`.
- **Form Input Validation**: Validate all inputs at the boundary using clean patterns (e.g., regex patterns, standard validators, or zod schemas if available) to prevent invalid payloads.
- **Console Log Audit**: Ensure no debug `console.log` statements are left in production paths. Use a central logger helper (if available) or clean up logs before committing.

### 3. Architecture & Style Standards
Ensure components align with the project design architecture and reusable patterns:
- **Atomic Design Principles (Design & Dev Sync)**:
  * **Atoms (Nguyên tử)**: The most basic, indivisible UI blocks (e.g., primary buttons, input fields, select boxes, labels, badges). Atoms do not contain other components and are highly reusable.
  * **Molecules (Phân tử)**: Combinations of two or more atoms (e.g., a search bar with an input and a button atom, or a form group combining a label, input, and validation error).
  * **Organisms (Sinh vật)**: Complex components composed of molecules and/or atoms (e.g., a Navigation Sidebar, a Dashboard Header, a specific Data Table, or a Merchant Card). They form distinct sections of the UI.
  * **Templates (Bản mẫu)**: Page-level skeleton structures or layouts determining where elements are placed (e.g., MainLayout with sidebar, header, and content slots).
  * **Pages (Trang)**: Routed components injecting real data and state into templates (e.g., `Dashboard.jsx`, `SettingsView.jsx`).
- **Strict Component Reusability & DRY Enforcements**:
  * **Zero Duplication**: Never copy and paste UI styling or structure across multiple pages. If a component (like a custom select, button style, modal dialog, or table row) is used on more than one page, it **must** be extracted into a shared folder (e.g., `src/components/ui/` or `src/components/common/`).
  * **Global Prop Propagation**: Creating a single source of truth for UI components ensures that when design updates occur (such as changes in [DESIGN.md](file:///c:/Users/AD/Documents/GitHub/vlinknexora/DESIGN.md)), adjusting the shared component updates all views instantly.
- **Component Structure & Guidelines**:
  * **File naming**: PascalCase for components and pages (e.g. `LandingPage.jsx`, `Button.jsx`), camelCase for hooks/utils/services.
  * **Size limits**: Keep components under **500 lines of code**. If exceeded, extract logical parts into reusable sub-components in the same feature folder.
  * **No Prop Drilling**: Maximum 3 layers of prop passing. Lift state to Context Provider or Zustand store if it exceeds this.
  * **State Separation**: Use TanStack Query for server state; Zustand for persistent or complex client/UI state. Do not duplicate server data in Zustand.
- **Design Tokens Adherence (DESIGN.md)**:
  * All spacing, typography, colors, and border-radii must follow [DESIGN.md](file:///c:/Users/AD/Documents/GitHub/vlinknexora/DESIGN.md).
  * **Color Palette**: Strictly use `luxuryBlack` (`#050505`), `luxuryCoal` (`#11100d`), `luxuryGold` (`#d4af37`), `brandCyan` (`#32D7FF`), `inkBlue` (`#0B1C30`), `mutedGrey` (`#565E74`), and their semantic mappings.
  * **Typography Scale**: Use classes prefixed with `text-flox-*` (e.g., `text-flox-body`, `text-flox-heading`). Font families are GeistSans (or Inter) and GeistMono for logs/payment IDs.
  * **No Arbitrary Styling**: Do NOT use hardcoded hex colors or arbitrary Tailwind values. Do not use generic classes like `rounded-md` or `rounded-xl`; instead, use `rounded-flox-inputs` (6px) or `rounded-flox-cards` (12px).
- **Mobile-First & Apple Responsive Standards (HIG Compliant)**:
  * *Mobile-First Styling*: Write base CSS/Tailwind classes for mobile layout first (e.g., full width `w-full`, vertical stacks `flex-col`). Use Tailwind's `min-width` responsive prefixes (e.g. `md:flex-row`, `lg:w-1/2`) to build up complexity for desktop screens. Do NOT write desktop-first styles overridden by `max-width` queries.
  * *Safe Area Insets*: Apply Safe Area spacing variables on layout roots, floating buttons, bottom navbars, and headers (using CSS variables or Tailwind utility classes like `pb-[env(safe-area-inset-bottom)]`, `pt-[env(safe-area-inset-top)]`). This ensures UI items are never covered by notch designs, dynamic islands, or iOS home indicators.
  * *Touch Target Targets*: Ensure all buttons, links, toggles, and form controls have a minimum touch target size of **44x44px** (following Apple's Human Interface Guidelines) to guarantee comfortable touch input on mobile.
  * *Input Zoom Prevention*: Form text inputs and selects must have a font size of at least `16px` (`text-flox-body`) to prevent iOS Safari from automatically zooming into the field upon focus, which breaks layout scaling.
- **Component References & Classes**:
  * Utilize standard classes defined in `src/index.css` matching [DESIGN.md](file:///c:/Users/AD/Documents/GitHub/vlinknexora/DESIGN.md):
    * **Buttons**: `.btn-ghost`, `.btn-outline-ghost`, `.btn-primary-action`, `.btn-gradient-cta` (gold-cyan gradient).
    * **Cards & Containers**: `.card-elevated` (glass effect + shadow), `.card-code-block` (monospace container), `.bordered-list-item`.

### 4. Self-Criticism & Code Review Workflow
The AI Agent must perform an active self-review and self-critique phase before applying changes or declaring completion:
- **Design & Logic Simplification**:
  * *Simplicity (KISS)*: Can this logic be written simpler? Did I introduce unnecessary local states, redundant re-renders, or overly complex helper functions?
  * *Refactoring*: Can code chunks be cleaned up, simplified, or consolidated?
- **DRY & Reuse Critique**:
  * *Code Duplication*: Am I writing custom code for something that already exists in the codebase (e.g., distance calculations, API services, formatting utils, date formats)?
  * *UI Reuse*: Did I search for existing shared UI components (Atoms/Molecules) before writing custom layout blocks?
- **Component Single Responsibility**:
  * *Separation of Concerns*: Does the component do too many things? (e.g., managing state, calling API hooks, handling pagination, and rendering complex UI all in one file).
  * *Sub-component Extraction*: If it does, split it. Move server fetching to custom query hooks, and UI panels to sub-components.
- **Edge Case Analysis**:
  * *UX Robustness*: Did I handle standard loading states, API error overlays, empty list fallbacks, and button disabling during actions?
  * *Input Robustness*: Are inputs validated? Does the UI handle long overflow text cleanly without layout breakage?
- **Code Cleanliness Audit**:
  * *Debug Cleanups*: Ensure no `console.log`, `debugger`, or temporary mockup values are left.
  * *Import Health*: Remove all unused imports, dead variables, and redundant comments.

---

## Verification & Checks Checklist

Before declaring a Front-End task complete, perform these checks:
1. [ ] Component Size: Is the modified component file under 500 lines of code?
2. [ ] Atomic Alignment: Is the component placed in the correct hierarchy (atoms/molecules in shared directories, pages/organisms in app/feature directories)?
3. [ ] Reusability & DRY: Did you reuse existing shared UI components (e.g. `CustomSelect`) instead of creating inline, duplicated elements?
4. [ ] Token Compliance: Do all styles (colors, fonts, spaces, border-radii) follow [DESIGN.md](file:///c:/Users/AD/Documents/GitHub/vlinknexora/DESIGN.md) without arbitrary values?
5. [ ] Class Reuse: Did you reuse pre-defined UI classes like `.btn-primary-action` or `.card-elevated` instead of duplicating styles?
6. [ ] Responsive & Mobile First: Does the UI follow a Mobile-First layout, include Safe Area Insets, and have a minimum 44x44px touch target on interactive components?
7. [ ] Prop & Data validation: Are React props documented, and is state correctly separated (Query vs Zustand)?
8. [ ] Security Check: Are there any un-sanitized dynamic HTML bindings or exposed secret keys?
9. [ ] Compilation: Does running the build command compile the application cleanly without errors?
10. [ ] Self-Criticism: Did you review the code changes for simplicity, single responsibility, edge cases, and clean imports?



