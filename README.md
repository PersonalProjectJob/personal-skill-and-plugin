# Figma Agentic Skills for AI Agent (Connected to figma-console-mcp)

A collection of advanced UI/UX automation skills for AI coding assistants (like Antigravity or Claude) that interface with Figma through the **figma-console MCP server**. 

These skills enable the AI agent to act as a senior UI/UX designer and design system engineer to automate Figma asset creation, component-driven assembly, and graphic asset cleaning.

---

## 🚀 Core Skills Included

### 1. 🎨 Create Design System (`create-design-system`)
Automates the extraction and creation of a Figma Design System based on the codebase's tokens or a design reference document (such as `DESIGN.md`).
- **Token Extraction**: Automatically parses colors, typography styles, spacing, and radius tokens from codebase source files (e.g. Tailwind configuration, CSS variables) or specification documents.
- **Figma Alignment**: Dynamically creates Variable Collections (Colors, Spacing, Radius) and Styles in Figma.
- **Component Building**: Automates the construction of foundational component sets with variants aligned with the token naming structure.
- **Strict Token Adherence**: Ensures every color, padding, gap, and size maps directly to a defined token.

### 2. ⚡ Generate Figma Kit (`generate-figma-kit`)
Assembles and synchronizes pixel-perfect, highly responsive user interfaces directly in Figma.
- **Component-Driven Assembly**: Instantiates buttons, input fields, modals, and other complex widgets from the project's local component library instead of drawing raw shapes.
- **Token Synchronization**: Binds all properties (fills, strokes, text styles, padding, and border radius) to existing Figma variables and styles to prevent hardcoding.
- **Strict Auto Layout**: Configures correct parent Auto Layout rules, alignments, gap variables, and constraints (`Fill Container` / `Hug Contents`).
- **Robust Sizing & Wrapping**: Resolves layout clipping and configures text layer wrapping dynamically.

### 3. 🖼️ Remove Background Graphic (`remove-background-graphic`)
Streamlines the creation and editing of graphical assets and illustrations inside Figma.
- **Illustrative Graphics Generation**: Assists in designing and positioning mockups and icons.
- **Background Removal**: Integrates steps to clean up graphics, ensuring transparency and clean layer boundaries.

### 4. 🧪 Feature-Focused Tester (`feature-focused-tester`)
Plans, writes, and executes automated tests specifically targeted at modified features.
- **Change Detection**: Analyzes git diffs to detect what source files changed and suggests relevant test files.
- **Token Compliance Audit**: Runs static checks in JS/React code to flag inline hex colors or non-theme Tailwind classes.
- **Targeted Testing**: Runs Vitest unit tests only on changed/related files, and launches Playwright + CloakBrowser for hermetic end-to-end user-flow verification.

### 5. 🛡️ Frontend Code Standards (`frontend-code-standards`)
Enforces strict coding standards, security controls, and design-to-dev synchronization.
- **Atomic Design Alignment**: Standardizes components into Atoms, Molecules, Organisms, Templates, and Pages for seamless sync between Figma design files and Dev files.
- **DRY & Component Reusability**: Mandates that any UI element used on 2 or more pages must be extracted to a shared directory (`src/components/ui/` or `src/components/common/`) to avoid inline duplicate styling.
- **Client-Side Security**: Checks for XSS vulnerabilities (enforcing sanitization before `dangerouslySetInnerHTML`), hardcoded secrets (requiring `import.meta.env.VITE_*`), and console logs audits.
- **Architectural Constraints**: Restricts component files to under 500 lines of code, limits prop drilling to 3 layers, and separates server state (TanStack Query) from client UI state (Zustand).

---

## 🛠️ How to Use

### Prerequisites
1. Ensure the **figma-console MCP server** is running and configured in your MCP configuration.
2. The AI assistant must have access to the `figma-console` tools (`figma_create_child`, `figma_get_variables`, `figma_set_fills`, etc.).

### Installation for Gemini/Claude Agents
Copy the desired plugin folder(s) directly into your agent's config or project plugins directory:

```bash
# Copy into the user global config plugins directory:
C:\Users\<YourUsername>\.gemini\config\plugins\

# Or copy into your project-specific agents directory:
<your-project-root>\.agents\skills\
```

Each directory contains a `plugin.json` which lists the available commands/skills, and a `skills/SKILL.md` instruction sheet that the agent reads before performing tasks.

