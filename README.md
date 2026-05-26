# Figma Agentic Skills for Gemini Antigravity (Connected to figma-console-mcp)

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
