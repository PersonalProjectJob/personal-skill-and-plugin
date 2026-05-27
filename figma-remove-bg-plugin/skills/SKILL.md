---
name: remove-background-graphic
description: Automatically or manually remove the background of graphical assets and images created in Figma to ensure transparency and clean integration.
---
# Figma Graphic Background Removal Specialist

This skill is invoked specifically when the design contains generated or imported graphics (images, illustrations, mockups) that require background removal to achieve transparency.

---

## 1. Scope of Application
Apply this skill when:
- A new image or graphic has been generated (e.g. via `generate_image`) and imported into the Figma canvas.
- The user requests background removal for specific graphic elements.
- Graphic assets (avatars, product illustrations, badges) contain solid white or dark backgrounds that disrupt design consistency.

---

## 2. Automated Background Removal Workflow

To use the automated workflow, the agent must check for a `config.json` file in the plugin directory (e.g., `C:\Users\AD\.gemini\config\plugins\figma-remove-bg-plugin\config.json`) to retrieve the `remove_bg_api_key`. If the key is found, the agent must replace `YOUR_REMOVE_BG_API_KEY` in the JS template below with the actual key before executing `figma_execute`.

You can programmatically export the target node, send it to a background removal service, and apply the transparent result back to the node using `figma_execute`.

### JS Script Template for `figma_execute`:
```javascript
async function removeBackgroundOfSelectedNode() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    return { error: "No node selected. Please select the image node first." };
  }
  const node = selection[0];
  if (!('fills' in node)) {
    return { error: "Selected node does not support fills." };
  }
  
  // Find the image fill
  const imageFill = node.fills.find(f => f.type === 'IMAGE');
  if (!imageFill) {
    return { error: "Selected node does not contain an image fill." };
  }
  
  try {
    // 1. Export current image as PNG bytes
    const bytes = await node.exportAsync({ format: 'PNG' });
    
    // 2. Call the background removal API (e.g., remove.bg)
    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'image/png' });
    formData.append('image_file', blob);
    formData.append('size', 'auto');
    
    // Attempt to use a configured API key or environment variable
    const apiKey = 'YOUR_REMOVE_BG_API_KEY'; 
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey
      },
      body: formData
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API returned status ${response.status}: ${errText}`);
    }
    
    const resultBlob = await response.blob();
    const resultBuffer = await resultBlob.arrayBuffer();
    
    // 3. Create new Figma image and replace the fill
    const newImage = figma.createImage(new Uint8Array(resultBuffer));
    
    // Copy fills, replace the image fill, and reassign
    const newFills = node.fills.map(fill => {
      if (fill.type === 'IMAGE') {
        return {
          type: 'IMAGE',
          imageHash: newImage.hash,
          scaleMode: 'FILL'
        };
      }
      return fill;
    });
    node.fills = newFills;
    
    return { success: true, message: "Background successfully removed." };
  } catch (error) {
    return { error: error.message };
  }
}
return removeBackgroundOfSelectedNode();
```

---

## 3. Manual Fallback Workflow (User-Assisted)

Since Figma plugins cannot run other third-party plugins programmatically due to security constraints, if the API call fails or there is no active API key:

1. **Select Node**: Call `figma_get_selection` to ensure the correct graphic node is selected. If not, ask the user to select the node.
2. **Guide the User/Developer**: Output instructions for them to run the background removal plugin manually inside the Figma editor:
   - *"Please select the graphic layer on the canvas."*
   - *"Press `Ctrl + /` (Windows) or `Cmd + /` (Mac) to open the Quick Actions menu."*
   - *"Type `Remove BG` or `Remove background` and run the plugin."*
3. **Verify and Continue**: Once the user confirms the background is removed, call `figma_take_screenshot` to verify transparency and continue placing the asset into the UI layout.
