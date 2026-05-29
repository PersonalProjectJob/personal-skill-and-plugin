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
- **Strict Test isolation**: Do NOT mix unrelated test flows in a single file if possible. Create a dedicated test file for the specific feature under test (e.g., `tests/e2e/setupWizard.test.js` or `tests/e2e/settingsView.test.js`) rather than putting everything into a default dashboard test file.

### 5. Execute Tests (Targeted Run)
- **Strict Targeted Run Rule**: The Agent must ONLY run the tests (Unit and E2E) that directly cover the modified or new code files.
  * **Do NOT Run Default Unrelated Tests**: For example, if the modifications are on the **Merchant Dashboard, Setup Wizard, or Settings**, the Agent must NOT execute E2E tests for the **Customer Tipping Flow** (like tips, reviews, ratings) unless the tipping flow itself was modified. Running unrelated default tests is a quality failure.
  * **Unit Tests (Targeted)**: Run vitest on only the related/changed files:
    `npx vitest run --related <comma-separated-changed-files>`
  * **E2E Tests (Targeted)**: Start the local dev server and execute E2E tests specifically targeting either the specific test file or using the `-t` (test name pattern) flag:
    * *Targeted by file*:
      `npx start-server-and-test dev http://localhost:3000 "npx vitest run --config vitest.e2e.config.js tests/e2e/setupWizard.test.js"`
    * *Targeted by test name pattern (`-t`)*:
      `npx start-server-and-test dev http://localhost:3000 "npx vitest run --config vitest.e2e.config.js -t 'SSO Login'"`

### 6. Report & Walkthrough
Create a `walkthrough.md` artifact summarizing:
- All executed test suites and results.
- Screenshots of the browser run if visual checks are done (saved under the artifacts directory).
- Code diffs of the test implementation.

### 7. Telegram Notifications (QA/QC & PM Notification Workflow)
To keep the team informed of testing status, automated builds, and subagent progress, the QA/QC (Tester) and PM roles must trigger Telegram notifications:
- **Notification Triggers**:
  * **Test Run Start**: Send a message when an automated test run, E2E test, or CI check is initiated.
  * **Test Run Completion**: Send a summary of test results (Passed/Failed counts) once execution completes.
  * **Critical Test Failures / Blockers**: Send immediate alerts with error snippets if tests fail, builds break, or a subagent encounters a blocker.
- **API Execution**:
  * The bot token and chat ID must be retrieved from the `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment variables or `.env` files.
  * Notifications must be sent via a REST POST call to the Telegram API:
    * *Endpoint*: `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage`
    * *Payload*: JSON with `chat_id`, `text` (formatted with Markdown/HTML), and `parse_mode`.
  * If the variables are missing, the agent outputs a warning but continues running tests.


