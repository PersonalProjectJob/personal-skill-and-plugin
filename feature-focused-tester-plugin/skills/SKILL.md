---
name: feature-focused-tester
description: Plan, write, and execute automation tests targeted specifically at a newly added or modified feature. Validates code changes using static analysis (no hardcoded styles, correct design tokens) and runs targeted unit & E2E tests.
---

# Feature-Focused Automation Tester Skill

This skill allows the Agent to automatically design, write, and run tests focused specifically on a new feature or change, rather than running the entire test suite. It also validates that code changes adhere strictly to the project's design tokens and do not contain hardcoded styling.

## Why this skill exists

To ensure fast feedback loops and high reliability when adding new features:
1. **Developer Efficiency**: Only changed modules and their dependent components are tested, bypassing unrelated flows.
2. **Design Integrity**: Validates that developers used the project's official design system tokens rather than browser defaults, Tailwind overrides, or hardcoded hex colors.
3. **Automated E2E Stability**: Verifies user interactions with mock APIs for hermetic stability using E2E browsers.

---

## Detailed Workflow

### 1. Scope Detection (Identify Changed Files)
When instructed to run test verification on a new feature or PR, first run the change detection scripts or git commands to identify what files have changed relative to the main/production branch:
- Run change detection commands (e.g., `git diff` or project-specific scripts).
- Identify the modified source files (e.g., `src/**/*.jsx`, `src/**/*.js`) and find relevant test files.

### 2. Design System & Static Verification (Design Token Check)
To maintain visual excellence, ensure no developer hardcoded color values (like Hex codes or arbitrary layout sizes) or used generic color palettes.
- Run the project's static analysis or token check scripts (if available).
- If any violations are found (e.g. inline style `color: '#ff40aa'` instead of standard token classes), report these violations immediately and fix them before running functional tests.

### 3. Generate Test Plan (`test_plan.md` Artifact)
Create or update a `test_plan.md` artifact outlining:
- **Scope**: The changed files and components.
- **Happy Path**: The primary success scenarios to cover.
- **Edge Cases & Error States**: Validations (e.g., input boundary, inactive state, network failures).
- **Test Strategy**: Which tests will be implemented as Unit Tests (jsdom/component testing) and which as E2E Tests.

### 4. Write/Update Tests
- **Unit Tests**: Save under the project's unit test directories (e.g., `tests/unit/` or component folders) using standard testing frameworks (Vitest, Jest) and Testing Library. Ensure proper usage of mock context providers (e.g. language/translation contexts).
- **E2E Tests**: Save under the E2E directory (e.g., `tests/e2e/`) using E2E browsers (Playwright, Cypress, CloakBrowser). Ensure network boundaries are mocked or handled hermetically, and use localized strings (using translation files) or flexible, text-agnostic locators.

### 5. Execute Tests (Targeted Run)
- **Unit Tests (Targeted)**: Run unit tests on only the related files to minimize execution time:
  - Run the test suite targeting only the changed paths.
- **E2E Tests (Targeted)**: Start the local dev server and run the E2E configuration specifically for the newly created or modified E2E test file.

### 6. Report & Walkthrough
Create a `walkthrough.md` artifact summarizing:
- All executed test suites and results.
- Screenshots of the browser run if visual checks are done (saved under the artifacts directory).
- Code diffs of the test implementation.
