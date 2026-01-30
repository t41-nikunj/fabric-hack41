---
name: design-qa
description: This skill should be used when the user wants to compare their frontend UI against a Figma design, check if the implementation matches the design, review visual fidelity, or validate design tokens. Trigger phrases include "check my design", "compare with figma", "does this match the design", "design review", "visual QA", "design qa", or sharing a Figma URL.
---

# Design QA

## Purpose

Act as a **Design QA Engineer** — compare a live frontend implementation against a Figma prototype and produce a report on visual fidelity and design token accuracy. This skill focuses exclusively on design comparison. It does not modify code, fix bugs, or run tests.

## When to Use

- The user wants to verify their UI matches a Figma design.
- The user shares a Figma URL and asks to compare or review.
- The user asks "does my frontend match the design" or similar.
- The pre-pr skill delegates design QA to this skill during its workflow.

## Gathering Inputs

Before starting, collect the following. If the user has not provided them, **ask**. Use sensible defaults where noted.

1. **Figma file URL or node ID** — Required. Ask: _"What is the Figma file URL or node ID for the design?"_
2. **Frontend URL** — Default: `http://localhost:5173`. Ask only if the user hasn't mentioned it: _"Where is the frontend running? (default: http://localhost:5173)"_
3. **Page or component name** — Ask: _"Which page or component should I compare?"_ If the user says "full page" or "everything", compare the root route.
4. **Viewport dimensions** — Default: `1440x900`. Only ask if the user mentions a specific device or viewport.

If the user provides a Figma URL directly in their message, extract the file key and node ID from it and proceed without asking for them again.

## Workflow

Execute the following steps in order.

### Step 1: Fetch Design from Figma

Use the Figma MCP tools to retrieve the reference design:

1. Determine the URL format:
   - `/design/` URLs: Use `get_screenshot` and `get_design_context` with the extracted fileKey and nodeId.
   - `/make/` URLs: Use `get_design_context` to get resource links, then read the component source files via `ReadMcpResourceTool` to understand the intended layout, styling, and structure.
2. If a screenshot can be exported, save it to `design-references/<page-name>.png`.
3. Extract design tokens (colors, fonts, spacing, dimensions) from the Figma data and build a design spec JSON. Save to `design-specs/<page-name>.json` following the format below.

If Figma MCP tools are unavailable or fail, ask the user to provide the reference screenshot and spec manually.

#### Design Spec Format

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

Supported token keys: `height`, `width`, `borderRadius`, `backgroundColor`, `color`, `fontSize`, `fontWeight`, `padding`, `margin`, `gap`, `text`.

### Step 2: Capture Implementation Screenshot

Use Playwright (via MCP or the bundled script) to capture the live frontend:

```bash
python scripts/capture_screenshot.py <frontend-url> -o <output-path> [--width 1440] [--height 900] [-s <css-selector>]
```

Alternatively, use the Playwright MCP `browser_navigate` + `browser_take_screenshot` tools directly.

Match the viewport size to the Figma frame dimensions.

### Step 3: Generate Visual Diff

If both a Figma reference screenshot and implementation screenshot are available, compare them:

```bash
python scripts/visual_diff.py <reference.png> <implementation.png> -o <diff-output.png> [--threshold 30]
```

This produces a side-by-side image with three panels: **Reference**, **Implementation**, and **Diff Highlight**. It prints pixel mismatch percentage and exits with code 1 if mismatch exceeds 5%.

If a reference screenshot is not available (e.g. Make files), perform a **structural comparison** instead — compare the Figma source code (components, classes, layout) against the implementation source code and list differences.

### Step 4: Check Design Tokens

If a design spec JSON was generated, validate computed CSS properties:

```bash
python scripts/check_design_tokens.py <frontend-url> <spec.json> [--width 1440] [--height 900]
```

If no spec JSON is available, manually compare key design tokens (colors, typography, spacing, layout) by reading the Figma source and inspecting the live page via Playwright snapshot.

### Step 5: Compile Report

Compile a markdown report:

```markdown
# Design QA Report: <Page Name>

## Summary
- **Visual match**: <mismatch percentage or structural assessment>
- **Token checks**: <passed>/<total> passed
- **Status**: PASS / NEEDS FIXES

## Visual Diff
![Diff](<path-to-diff-image>)
(or structural comparison table if no screenshot diff)

## Token Mismatches
| Element | Token | Expected | Actual |
|---------|-------|----------|--------|
| ...     | ...   | ...      | ...    |

## Missing Elements
- <element name> (selector or description)

## Recommendations
- <actionable fix suggestions, ordered by impact>
```

### Pass Criteria

- Visual pixel mismatch below **5%** (or structural match is close).
- All design token checks pass.
- No elements from the spec are missing.

Prioritize recommendations by impact: layout/spacing > colors > typography > minor pixel differences.

**Important**: This skill generates a report only. It does NOT modify any code.
