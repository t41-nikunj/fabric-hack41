---
name: playwright-design-qa
description: This skill should be used when validating that a frontend UI implementation matches a Figma prototype. It orchestrates the Figma MCP server to fetch design screenshots and specs, captures the live implementation via Playwright, and generates a visual diff image alongside a text report.
---

# Playwright Design QA

## Purpose

This skill enables acting as a **Design QA Engineer** — verifying that a React + Tailwind UI implementation matches the Figma prototype. It orchestrates the full pipeline: fetching designs from Figma via MCP, capturing the live implementation, comparing them visually, and validating design tokens. The focus is exclusively on **design fidelity**, not business logic or APIs.

## Prerequisites

- The Figma MCP server is configured and accessible.
- The user has a Figma file URL or node ID for the target design.
- Key UI elements have stable selectors (`data-testid`, roles, or CSS selectors).
- Python dependencies are available: `playwright`, `Pillow`.

## Inputs

Before starting, gather the following from the user:

1. **Figma file URL or node ID** — the design to compare against.
2. **Frontend URL** — where the implementation is running. Defaults to `http://localhost:5173` if not specified. Can be any host (e.g. `http://192.168.1.10:3000`, `https://staging.example.com`).
3. **Page or component name** — which page/component to QA.
4. **Viewport dimensions** (optional) — defaults to 1440x900. Should match the Figma frame size.

## Design Spec Format

The design spec JSON follows this structure:

```json
{
  "page": "Login",
  "elements": {
    "primaryButton": {
      "selector": "[data-testid='primary-button']",
      "text": "Sign In",
      "height": 44,
      "borderRadius": 8,
      "backgroundColor": "#1E40AF",
      "fontSize": 16,
      "fontWeight": "700",
      "color": "#FFFFFF"
    }
  }
}
```

Each element must include a `selector` field. Supported token keys: `height`, `width`, `borderRadius`, `backgroundColor`, `color`, `fontSize`, `fontWeight`, `padding`, `margin`, `gap`, `text`.

## Workflow

To perform a design QA review, execute the following steps in order.

### Step 1: Fetch Design from Figma MCP

Use the Figma MCP server to export the reference design. Call the following MCP tools in sequence:

1. **Get file metadata** — call `get_file` with the Figma file URL to retrieve the file structure and identify the target frame/node.
2. **Export screenshot** — call `get_image` on the target node to export a PNG screenshot. Save it to `design-references/<page-name>.png`.
3. **Extract design tokens** — call `get_node_details` on the target node to retrieve style properties (colors, fonts, spacing, dimensions). Use this data to build the design spec JSON and save it to `design-specs/<page-name>.json`, following the format documented above. Map each element's Figma properties to the corresponding token keys and include the appropriate CSS selector for each element.

If the Figma MCP tools are unavailable or fail, ask the user to provide the reference screenshot and design spec manually.

### Step 2: Capture Implementation Screenshot

Run the capture script against the running frontend:

```bash
python scripts/capture_screenshot.py <frontend-url> -o <output-path> [--width 1440] [--height 900] [-s <css-selector>]
```

- Use `--width` and `--height` to match the viewport size of the Figma frame.
- Use `-s` to capture a specific component instead of the full page.
- Replace `<frontend-url>` with the URL provided by the user.

### Step 3: Generate Visual Diff

Compare the Figma reference screenshot against the captured implementation screenshot:

```bash
python scripts/visual_diff.py <reference.png> <implementation.png> -o <diff-output.png> [--threshold 30]
```

This produces a side-by-side image with three panels: **Reference (Figma)**, **Implementation**, and **Diff Highlight** (red pixels mark mismatches). The script prints pixel mismatch percentage. It exits with code 1 if mismatch exceeds 5%.

Adjust `--threshold` (0-255) to control sensitivity — lower values catch subtler differences.

### Step 4: Check Design Tokens

Validate computed CSS properties against the design spec:

```bash
python scripts/check_design_tokens.py <frontend-url> <spec.json> [--width 1440] [--height 900]
```

This opens the page in Playwright, queries each element by its selector, compares computed CSS values to expected tokens, and prints a structured report. It exits with code 1 if any mismatches or missing elements are found.

### Step 5: Compile Report

After running the above scripts, compile a markdown report with the following sections:

```markdown
# Design QA Report: <Page Name>

## Summary
- **Visual match**: <mismatch percentage>%
- **Token checks**: <passed>/<total> passed
- **Status**: PASS / NEEDS FIXES

## Visual Diff
![Diff](<path-to-diff-image>)

## Token Mismatches
| Element | Token | Expected | Actual |
|---------|-------|----------|--------|
| ...     | ...   | ...      | ...    |

## Missing Elements
- <element name> (selector: <selector>)

## Recommendations
- <actionable fix suggestions based on mismatches>
```

### Pass Criteria

- Visual pixel mismatch is below **5%**.
- All design token checks pass.
- No elements from the spec are missing.

If any criteria fail, list specific actionable fixes in the Recommendations section. Focus on the highest-impact mismatches first (layout/spacing > colors > typography > minor pixel differences).