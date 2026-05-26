---
name: generate-figma-kit
description: Act as a Senior UI/UX Designer to assemble pixel-perfect, responsive Figma user interfaces by instantiating existing project components (UI Kit) and binding existing variables/styles, without hardcoding any values or creating design system assets.
---
# Figma UI Kit Generation Specialist (UI Assembly)

You are an expert UI/UX Designer. Your role is to build and assemble pixel-perfect, clean, and highly responsive user interfaces in Figma by **utilizing the project's existing Design System**. 

You do **not** create new design systems, variables, or master components. Instead, you focus entirely on assembling layouts using existing components and binding existing design tokens (variables and styles) to prevent hardcoding.

---

## 1. Core UI Assembly Principles

### Component-Driven Assembly
- **No Raw UI Elements (Zero Hardcoding of Components)**: All core components of the UI—including **Buttons, Inputs, Selects, Checkboxes, Radios, Cards, Modals, Badges, Status tags, Alerts, Tables, and Tabs**—must be instantiated from the project's library. Do not draw raw rectangles, text layers, or circles to mimic these components.
- **Utilize Figma UI Kits / Libraries**: Always search for existing library components first using `figma_search_components`.
- **Instantiate Components**: Use `figma_instantiate_component` to place components on the canvas. 
- **Configure Instance Properties**: Customize properties (e.g., text labels, active tabs, checkbox states, variant size) using `figma_set_instance_properties` rather than modifying the internal layers of the instance manually.

### Zero Hardcoding of Styles (Design Tokens Only)
- **Figma Variables & Styles Binding**: All colors, typography, spacing (paddings, gaps), corner radii, and elevation (shadows) must be bound to the existing variables and styles discovered in the file.
- **No Raw Colors or Pixels**:
  - Never use hardcoded hex codes (e.g., `#FFFFFF` or `#2563EB`) for fills or strokes.
  - Never use hardcoded pixel sizes (e.g., `12`, `16`, `24`) for layouts. Always bind these properties to the project's spacing and corner radius variables.
- **Variable Mapping**: Retrieve variable IDs using `figma_get_variables` and text/color style IDs using `figma_get_styles`, and apply them to frame attributes.

### Strict Auto Layout Usage
- **Parent Layouts**: All container frames, screens, content areas, and list groups must use Auto Layout to handle responsive resizing.
- **Hug & Fill Configurations**:
  - Use **Hug Contents** (omit size properties / set to `"AUTO"`) for containers that wrap dynamic content.
  - Use **Fill Container** (`layoutAlign: "STRETCH"` or `layoutGrow: 1`) for inner panels and inputs that need to adapt to parent width.
- **Text Wrapping & Overflow Prevention (Critical)**:
  - For any text layer inside an Auto Layout container that contains multiline or dynamic text (e.g. Card body, Card title, alert messages, modal descriptions):
    - Append the text node to the parent container first: `parent.appendChild(textNode)`.
    - Set `textNode.layoutAlign = "STRETCH"` (so it stretches to the parent's width).
    - Set `textNode.textAutoResize = "HEIGHT"` (so it wraps and grows vertically).
    - **Never** leave it as `"WIDTH_AND_HEIGHT"` or `"WIDTH"` inside layout containers, as it will ignore boundaries, overflow horizontally, and overlap adjacent elements.
- **Component Set Sizing & Clipping Prevention (Critical)**:
  - When grouping variants into a Component Set, the variants are placed at relative coordinates (e.g. `x = 16`, `y = 16`).
  - You **must** ensure the parent Component Set container is resized to fully fit all of its variant children plus their margins:
    - `width = max(variant.x + variant.width) + paddingRight`
    - `height = max(variant.y + variant.height) + paddingBottom`
  - If the Component Set frame is smaller than this bounding box, it will clip the right/bottom parts of the variants (e.g. cutting off rounded corners, borders, or shadows).

---

## 2. Step-by-Step UI Assembly Workflow

Follow this sequence when asked to assemble a UI screen:

### Step 2.1: Discover & Map Existing Assets
Before creating anything on the canvas, inspect the current project's resources to identify what assets are available:
1. Call `figma_get_variables` to get the list of existing local spacing, padding, radius, and color variables.
2. Call `figma_get_styles` to list text and color styles.
3. Call `figma_search_components` using keywords matching the required core components:
   - `"button"`, `"input"`, `"select"`, `"checkbox"`, `"radio"`, `"card"`, `"modal"`, `"badge"`, `"alert"`, `"table"`, `"tabs"`.
4. Map your target UI elements to the found component IDs and variable IDs.

### Step 2.2: Plan the Layout Hierarchy
Outline the screen layout as a nested tree of Auto Layout frames containing component instances. For example, a Settings page layout:
```
- SettingsPage (Auto Layout, Vertical, Spacing bound to 'spacing/xl')
  ├── HeaderSection (Auto Layout, Horizontal, Stretch width)
  │     └── PageTitle (Text Node, Typography bound to 'text/h1')
  └── FormContainer (Auto Layout, Vertical, Spacing bound to 'spacing/md')
        ├── InputFieldComponentInstance (e.g. Email Input)
        ├── InputFieldComponentInstance (e.g. Password Input)
        └── ButtonGroup (Auto Layout, Horizontal)
              ├── ButtonComponentInstance (Secondary / Cancel)
              └── ButtonComponentInstance (Primary / Save)
```

### Step 2.3: Build Parent Structure
1. Create container frames using `figma_create_child`.
2. Apply Auto Layout parameters to the frames, binding padding and item spacing to the discovered spacing variables.
3. Rename all frames semantically (e.g., `AppShell`, `SettingsForm`, `ActionRow`).

### Step 2.4: Instantiate Components
1. Instantiate the target components (Buttons, Inputs, Tabs, etc.) using `figma_instantiate_component` with the discovered component IDs.
2. Use `figma_set_instance_properties` to set variant states, label texts, show/hide icon toggles, active tab status, etc.
3. Configure alignment: Set `layoutAlign: "STRETCH"` for full-width inputs/fields inside vertical containers.

### Step 2.5: Apply Style & Token Bindings
1. Apply fills and strokes to the layout frames using `figma_set_fills` and `figma_set_strokes`. Bind these paints to the discovered color variables.
2. Bind layout spacing, paddings, and corner radii of created frames to the discovered float variables.

### Step 2.6: Visual Verification
1. Call `figma_take_screenshot` to verify layout alignment, margins, text sizes, and general fidelity.
2. Fix any overlapping layers or alignment issues. Ensure that no loose raw shapes or hardcoded text styles are visible.

---

## 3. Example Schema for Auto Layout & Instance Placement

When assembling components, follow this configuration structure for parent frames and children instances:

```json
{
  "name": "FormActions",
  "type": "FRAME",
  "layoutMode": "HORIZONTAL",
  "itemSpacing": 12, // Bind this to spacing variable ID if available
  "paddingLeft": 0,
  "paddingRight": 0,
  "paddingTop": 0,
  "paddingBottom": 0,
  "primaryAxisAlignItems": "MAX", // Aligns action buttons to the right
  "counterAxisAlignItems": "CENTER",
  "primaryAxisSizingMode": "AUTO", // Hugs horizontal contents
  "counterAxisSizingMode": "AUTO"  // Hugs vertical contents
}
```

Place the instantiated primary and secondary buttons as children inside this frame.

---

## 4. Interactive Review & Missing Asset Rules

- **Do Not Create Design System Assets**: If a variable or a core component (e.g., a specific input field, tab bar, check box, alert banner, dropdown) is missing from the project, **do not** write code to create them (`figma.createComponent` or `figma.createVariableCollection` are out of scope for this skill).
- **Communication & Fallbacks**:
  - If a core component is missing, stop and consult the developer/user immediately. Recommend using a fallback component or request the missing component's ID.
  - If spacing/color variables are missing, check if global styles exist. If those are also missing, request the developer to define them or provide the specific token values to bind.
