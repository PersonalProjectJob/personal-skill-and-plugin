---
name: frontend-code-standards
description: Ensure high-quality FE coding by enforcing strict type/prop checks, security controls, architectural guidelines (component size limits, state separation), and compliance with project design tokens.
---

# Frontend Code Standards & Quality Guard Skill

This skill enforces strict standards for React and JavaScript code in the codebase, covering static analysis, security safeguards, and architectural best practices.

## Why this skill exists

To ensure the Front-End codebase remains clean, secure, scalable, and visually consistent:
1. **Type & Prop Safety**: Ensures components have clear contracts, correct imports, and proper prop validations, reducing runtime errors.
2. **Security & Best Practices**: Eliminates client-side vulnerabilities like XSS, hardcoded secrets, and unvalidated form submissions.
3. **Architectural Cleanliness**: Enforces strict component size limits, separates server state from UI state, and prevents prop drilling.
4. **Design Integrity**: Standardizes layout responsive design, safe zone scaling, and component reusability.

---

## Core Guidelines & Workflow

### 1. Static Validation & Clean Imports (LSP & Module Health)
When editing or creating React components:
- **Prop Validation**: Ensure all React components declare prop types, TypeScript interfaces, or JSDoc comments to document props, ensuring clear interfaces.
- **Import Ordering**: Maintain a clean, consistent import hierarchy:
  1. React core and hooks.
  2. Third-party libraries.
  3. Internal aliases (e.g. `@/config`, `@/lib`, `@/services`, `@/stores`, `@/hooks`, `@/contexts`, `@/models`, `@/components`, `@/utils`).
  4. Relative imports.
  5. Style imports.
- **Direct Imports**: Prefer importing specific exports directly rather than using large barrel files to prevent bundle bloating.
- **Build Verification**: Before completing any change, run the project's build command (e.g. `npm run build`) to verify the code compiles without bundler warnings or errors.

### 2. Security Guard & Best Practices
Always check the front-end code for the following security and logger standards:
- **No Unsafe HTML Rendering (XSS Prevention)**: Never use `dangerouslySetInnerHTML` directly without sanitizing. If rendering HTML is unavoidable, wrap the input using a sanitization function (e.g., DOMPurify or custom sanitizer).
- **No Hardcoded Secrets**: Scan files to ensure API keys, private URLs, or credentials are NOT hardcoded. They must be fetched from environment variables via `import.meta.env.VITE_*` (Vite) or `process.env.*` (Node/Next).
- **Form Input Validation**: Validate all inputs at the boundary using clean patterns (e.g., regex patterns, standard validators, or zod schemas if available) to prevent invalid payloads.
- **Console Log Audit**: Ensure no debug `console.log` statements are left in production paths. Use the project's central logger helper (if available) or clean up logs before committing.

### 3. Architecture & Style Standards
Ensure components align with the project design architecture and reusable patterns:
- **Atomic Design Principles (Design & Dev Sync)**:
  * **Atoms (Nguyên tử)**: The most basic, indivisible UI blocks (e.g., primary buttons, input fields, select boxes, labels, badges). Atoms do not contain other components and are highly reusable.
  * **Molecules (Phân tử)**: Combinations of two or more atoms (e.g., a search bar with an input and a button atom, or a form group combining a label, input, and validation error).
  * **Organisms (Sinh vật)**: Complex components composed of molecules and/or atoms (e.g., a Navigation Sidebar, a Dashboard Header, a specific Data Table, or a Card grid). They form distinct sections of the UI.
  * **Templates (Bản mẫu)**: Page-level skeleton structures or layouts determining where elements are placed.
  * **Pages (Trang)**: Routed components injecting real data and state into templates.
- **Strict Component Reusability & DRY Enforcements**:
  * **Zero Duplication**: Never copy and paste UI styling or structure across multiple pages. If a component (like a custom select, button style, modal dialog, or table row) is used on more than one page, it **must** be extracted into a shared folder (e.g., `/src/components/ui/`, `/src/components/common/`, or `/components/shared/`).
  * **Global Prop Propagation**: Creating a single source of truth for UI components ensures that when design updates occur, adjusting the shared component updates all views instantly.
- **Component Structure & Guidelines**:
  * **File naming**: PascalCase for components and pages, camelCase for hooks/utils/services.
  * **Size limits**: Keep components under **500 lines of code**. If exceeded, extract logical parts into reusable sub-components in the same feature folder.
  * **No Prop Drilling**: Maximum 3 layers of prop passing. Lift state to Context Provider or a state store if it exceeds this.
  * **State Separation**: Use server-state tools (e.g., TanStack Query) for API data, and client-state libraries (e.g., Zustand/Redux) or local state for interactive UI states. Do not duplicate server data in local UI stores.
- **Design Tokens Adherence**:
  * Locate the project's design token definitions (e.g., a `DESIGN.md` file, Tailwind config, CSS variables sheet, or theme JSON).
  * All spacing, typography, colors, and border-radii must follow the project's defined tokens.
  * **No Arbitrary Styling**: Do NOT use hardcoded hex colors or arbitrary values (e.g. `p-[17px]` or `rounded-[9px]`); instead, map them to the project's spacing scale and border-radius scales.
- **Mobile-First & Apple Responsive Standards (Apple HIG & Safe Zone Rules)**:
  * *Mobile-First Styling*: Write base CSS/Tailwind classes for mobile layout first (e.g., full width `w-full`, vertical stacks `flex-col`). Use responsive media queries (e.g. `md:flex-row`, `lg:w-1/2` in Tailwind) to build up complexity for desktop screens. Do NOT write desktop-first styles overridden by `max-width` queries.
  * *Viewport Configuration*: Ensure the HTML viewport meta tag in `index.html` includes `viewport-fit=cover` (e.g. `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`). Without `viewport-fit=cover`, Apple devices will letterbox the content and CSS safe-area environment variables (`env(safe-area-inset-*)`) will resolve to `0`.
  * *Safe Zone Insets (Safe Area)*: Interactive controls, navigation, and vital text must never overlap Apple's device safe areas (notch/sensor housing, Dynamic Island, or the bottom home indicator pill). Use:
    * `env(safe-area-inset-top)` for fixed headers, banners, or status bars.
    * `env(safe-area-inset-bottom)` for bottom navbars, floating action buttons, and fixed footers.
    * `env(safe-area-inset-left)` and `env(safe-area-inset-right)` to handle iPhone landscape layouts, iPad multitasking splits, or side menus.
  * *Background Bleeding vs Content Insets*: Background fills, graphics, and overlay containers must extend (bleed) to the physical edges of the display (filling the safe area). However, the actual text, icons, and buttons must be padded inward using safe area variables (e.g., `pb-[env(safe-area-inset-bottom)]`, `pt-[env(safe-area-inset-top)]`).
  * *Touch Target Targets*: Ensure all buttons, links, toggles, and form controls have a minimum touch target size of **44x44px** (following Apple's Human Interface Guidelines) to guarantee comfortable touch input on mobile.
  * *Input Zoom Prevention*: Form text inputs and selects must have a font size of at least `16px` (or equivalent body text style) to prevent iOS Safari from automatically zooming into the field upon focus, which breaks layout scaling.

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
3. [ ] Reusability & DRY: Did you reuse existing shared UI components instead of creating inline, duplicated elements?
4. [ ] Token Compliance: Do all styles (colors, fonts, spaces, border-radii) follow the project design tokens without arbitrary values?
5. [ ] Class Reuse: Did you reuse pre-defined UI classes instead of duplicating styles?
6. [ ] Responsive & Mobile First: Does the UI follow a Mobile-First layout, include Safe Area Insets, and have a minimum 44x44px touch target on interactive components?
7. [ ] Prop & Data validation: Are React props documented, and is state correctly separated (Query vs Zustand)?
8. [ ] Security Check: Are there any un-sanitized dynamic HTML bindings or exposed secret keys?
9. [ ] Compilation: Does running the build command compile the application cleanly without errors?
10. [ ] Self-Criticism: Did you review the code changes for simplicity, single responsibility, edge cases, and clean imports?

