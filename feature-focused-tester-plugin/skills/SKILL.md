---
name: feature-focused-tester
description: Plan, write, and execute automation tests targeted specifically at a newly added or modified feature. Validates code changes using static analysis (no hardcoded styles, correct design tokens) and runs targeted unit & E2E tests using Vitest and CloakBrowser.
---

# Feature-Focused Automation Tester Skill

This skill allows the Agent to automatically design, write, and run tests focused specifically on a new feature or change, rather than running the entire test suite. It also validates that code changes adhere strictly to the project's premium design tokens and do not contain hardcoded styling.

## Why this skill exists

To ensure fast feedback loops and high reliability when adding new features:
1. **Developer Efficiency:** Only changed modules and their dependent components are tested, bypassing unrelated flows.
2. **Design Integrity:** Validates that developers used the official Nexora design system tokens (e.g. `luxuryGold`, `floxMidnightInk`, etc.) rather than browser/tailwind defaults or hardcoded hex colors.
3. **Automated E2E Stability:** Tests are written and executed using CloakBrowser (stealth Chromium) to verify real user interactions with mock network APIs for hermetic stability.

## Detailed Workflow

### 1. Scope Detection (Identify Changed Files)
When instructed to run test verification on a new feature or PR, first run the change detection script to find what files have changed relative to the main branch:
```powershell
node .agents/skills/feature-focused-tester/scripts/detect-changes.cjs
```
This script runs `git diff` and identifies the modified source files (`src/**/*.jsx`, `src/**/*.js`) and suggests relevant test files.

### 2. Design System & Static Verification (Design Token Check)
To maintain the luxury premium aesthetics, ensure no developer hardcoded color values (like Hex codes or arbitrary tailwind `bg-[#...]` classes) or used generic colors (like `bg-blue-500`). Run:
```powershell
node .agents/skills/feature-focused-tester/scripts/verify-tokens.cjs
```
If the script reports violations (e.g. inline style `color: '#ff4fae'` instead of using Tailwind class `text-floxVividRose`), report these design system violations immediately and fix them before running functional tests.

### 3. Generate Test Plan (`test_plan.md` Artifact)
Create or update a `test_plan.md` artifact outlining:
- **Scope:** The changed files and components.
- **Happy Path:** The primary success scenarios to cover.
- **Edge Cases & Error States:** Validations (e.g., input boundary, inactive state, network failures).
- **Test Strategy:** Which tests will be implemented as Unit Tests (jsdom) and which as E2E Tests (CloakBrowser).

### 4. Write/Update Tests
- **Unit Tests:** Save under `tests/unit/` using Vitest + React Testing Library. Ensure proper usage of translation contexts (`LanguageProvider`).
- **E2E Tests:** Save under `tests/e2e/` using CloakBrowser. Ensure network boundaries are mocked or handled hermetically, and use localized strings (using translation files `locales/en.json`, `locales/vi.json`) or flexible locator regexes (`button:has-text("Next"), button:has-text("Tiếp theo")`).

### 5. Execute Tests (Targeted Run)
- **Unit Tests (Targeted):** Run Vitest on only the related files to minimize test time:
  ```powershell
  npx vitest run --related <comma-separated-paths-to-changed-files>
  ```
- **E2E Tests (Targeted):** Start the server and run the E2E config specifically for the new E2E test file:
  ```powershell
  npx start-server-and-test dev http://localhost:3000 "npx vitest run --config vitest.e2e.config.js -t '<New-Feature-Test-Suite-Name>'"
  ```

### 6. Report & Walkthrough
Create a `walkthrough.md` artifact summarizing:
- All executed test suites and results.
- Screenshots of the E2E browser run if visual checks are done (saved under the artifacts directory).
- Code diffs of the test implementation.
