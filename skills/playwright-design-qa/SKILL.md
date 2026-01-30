---
name: design-qa
description: This skill iteratively compares frontend UI against a Figma design and automatically fixes discrepancies until pixel-perfect match is achieved. Use when user says "match figma", "fix design", "design qa", "compare with figma", or shares a Figma URL expecting implementation fixes.
---

# Design QA — Iterative Implementation Skill

## Purpose

Act as a **Design Implementation Engineer** — extract every design detail from Figma, compare against the live frontend, and **iteratively fix the code** until the implementation matches the design completely. This skill modifies code and repeats the check-fix cycle until design fidelity is achieved.

## When to Use

- User wants their UI to match a Figma design exactly.
- User shares a Figma URL and expects the implementation to be fixed.
- User says "match the design", "fix to match figma", "implement this design".
- Design discrepancies need to be resolved programmatically.

## Gathering Inputs

Collect these before starting. Ask if not provided:

| Input | Default | Prompt |
|-------|---------|--------|
| **Figma URL** | — | _"What is the Figma file URL?"_ |
| **Frontend URL** | `http://localhost:5173` | _"Where is the frontend running?"_ |
| **Target component/page** | Full page | _"Which page or component?"_ |
| **Max iterations** | 5 | _"How many fix iterations? (default: 5)"_ |
| **Source files** | Auto-detect | _"Which files contain the component code?"_ |

Extract `fileKey` and `nodeId` from Figma URL automatically if provided.

---

## Workflow: Iterative Design Match Loop

```
┌─────────────────────────────────────────┐
│  START: Fetch Complete Design Spec      │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  LOOP START (max N iterations)          │
│  ┌───────────────────────────────────┐  │
│  │ 1. Capture frontend screenshot    │  │
│  │ 2. Compare visual + tokens        │  │
│  │ 3. If MATCH → EXIT with PASS      │  │
│  │ 4. If MISMATCH → Generate fixes   │  │
│  │ 5. Apply code changes             │  │
│  │ 6. Wait for hot-reload            │  │
│  │ 7. Increment iteration            │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  END: Generate Final Report             │
└─────────────────────────────────────────┘
```

---

## Step 1: Extract Complete Design Specification

Use Figma MCP tools to extract **every detail** from the design.

### 1.1 Get Design Screenshot

```
Tool: get_screenshot
Parameters: { fileKey, nodeId, format: "png", scale: 2 }
Save to: design-references/<page-name>-reference.png
```

### 1.2 Get Full Design Context

```
Tool: get_design_context
Parameters: { fileKey, nodeIds: [nodeId] }
```

### 1.3 Extract Exhaustive Design Tokens

Parse the Figma response and extract **ALL** of the following for **every element**:

#### Layout & Dimensions
- `width`, `height` (exact px values)
- `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- `aspectRatio`

#### Spacing
- `padding` (top, right, bottom, left)
- `margin` (top, right, bottom, left)
- `gap` (for flex/grid containers)

#### Position & Layout Mode
- `position` (absolute, relative, fixed)
- `top`, `right`, `bottom`, `left`
- `display` (flex, grid, block)
- `flexDirection`, `justifyContent`, `alignItems`, `flexWrap`
- `gridTemplateColumns`, `gridTemplateRows`

#### Typography
- `fontFamily` (map to web font)
- `fontSize` (exact px)
- `fontWeight` (100-900)
- `lineHeight` (px or unitless)
- `letterSpacing` (px or em)
- `textAlign` (left, center, right, justify)
- `textTransform` (uppercase, lowercase, capitalize)
- `textDecoration` (underline, line-through)
- `color` (hex with alpha if present)

#### Colors & Fills
- `backgroundColor` (hex, rgba, or gradient)
- `backgroundImage` (gradients, url)
- `opacity`

#### Borders
- `borderWidth` (top, right, bottom, left)
- `borderColor`
- `borderStyle` (solid, dashed, dotted)
- `borderRadius` (all corners individually)

#### Effects & Shadows
- `boxShadow` (x, y, blur, spread, color, inset)
- `filter` (blur, brightness, etc.)
- `backdropFilter`

#### Transforms
- `transform` (translate, rotate, scale)

#### Content
- `text` (exact text content)
- `src` (for images)
- `alt` (image descriptions)

### 1.4 Generate Complete Design Spec JSON

Save to `design-specs/<page-name>-spec.json`:

```json
{
  "page": "LoginPage",
  "viewport": { "width": 1440, "height": 900 },
  "elements": {
    "container": {
      "selector": "[data-testid='login-container']",
      "styles": {
        "width": 400,
        "padding": "48px 32px",
        "backgroundColor": "#FFFFFF",
        "borderRadius": "16px",
        "boxShadow": "0 4px 24px rgba(0,0,0,0.1)",
        "display": "flex",
        "flexDirection": "column",
        "gap": "24px"
      }
    },
    "heading": {
      "selector": "h1",
      "text": "Welcome Back",
      "styles": {
        "fontSize": 32,
        "fontWeight": 700,
        "fontFamily": "Inter",
        "lineHeight": 1.2,
        "color": "#1A1A1A",
        "textAlign": "center"
      }
    },
    "primaryButton": {
      "selector": "[data-testid='submit-btn']",
      "text": "Sign In",
      "styles": {
        "height": 48,
        "width": "100%",
        "backgroundColor": "#2563EB",
        "color": "#FFFFFF",
        "fontSize": 16,
        "fontWeight": 600,
        "borderRadius": "8px",
        "border": "none"
      },
      "states": {
        "hover": {
          "backgroundColor": "#1D4ED8"
        },
        "disabled": {
          "backgroundColor": "#94A3B8",
          "cursor": "not-allowed"
        }
      }
    }
  }
}
```

---

## Step 2: Iterative Comparison and Fix Loop

Execute this loop until design matches OR max iterations reached.

### 2.1 Capture Implementation Screenshot

```bash
# Via browser subagent or Playwright MCP
Navigate to: <frontend-url>
Set viewport: <spec.viewport.width> x <spec.viewport.height>
Wait for: networkidle
Screenshot: design-references/<page-name>-impl-iter-<N>.png
```

### 2.2 Visual Pixel Comparison

```bash
python scripts/visual_diff.py \
  design-references/<page-name>-reference.png \
  design-references/<page-name>-impl-iter-<N>.png \
  -o design-references/<page-name>-diff-iter-<N>.png \
  --threshold 5
```

**Exit conditions:**
- Pixel mismatch ≤ 2% → **PASS**
- Mismatch > 2% → Continue to token check

### 2.3 Token-by-Token Validation

For each element in the spec, use Playwright to get computed styles:

```javascript
// Pseudo-code for token extraction
const element = await page.locator(selector);
const computed = await element.evaluate(el => {
  const styles = window.getComputedStyle(el);
  return {
    width: styles.width,
    height: styles.height,
    padding: styles.padding,
    margin: styles.margin,
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    fontFamily: styles.fontFamily,
    borderRadius: styles.borderRadius,
    boxShadow: styles.boxShadow,
    // ... all other tokens
  };
});
```

Compare each computed value against the spec. Track mismatches:

```json
{
  "element": "primaryButton",
  "token": "backgroundColor",
  "expected": "#2563EB",
  "actual": "#3B82F6",
  "difference": "color mismatch"
}
```

### 2.4 Check for Missing Elements

Verify all elements in spec exist in DOM:
- Selector not found → **Missing Element**
- Text content mismatch → **Content Error**

### 2.5 Decision Point

```
IF pixel_mismatch ≤ 2% AND all_tokens_pass AND no_missing_elements:
    → EXIT LOOP with PASS
ELSE:
    → Continue to Step 3 (Apply Fixes)
```

---

## Step 3: Generate and Apply Code Fixes

### 3.1 Identify Source Files

Locate the component files that need modification:
- Search codebase for component by name
- Find CSS/SCSS files associated with component
- Identify inline styles or CSS-in-JS

### 3.2 Generate Fix Plan

For each mismatch, generate a specific fix:

| Mismatch Type | Fix Strategy |
|---------------|--------------|
| Color wrong | Update CSS variable or direct value |
| Font size wrong | Update fontSize property |
| Spacing wrong | Update padding/margin values |
| Border radius wrong | Update borderRadius |
| Missing element | Add element to JSX/HTML |
| Wrong text | Update text content |
| Layout issue | Update flexbox/grid properties |

### 3.3 Apply Code Changes

Use file editing tools to modify the source:

1. **CSS Files**: Update property values
2. **React Components**: Update inline styles or className
3. **Styled Components**: Modify template literals
4. **Tailwind**: Update class names

Example fix application:
```css
/* Before */
.primary-button {
  background-color: #3B82F6;
  border-radius: 4px;
}

/* After */
.primary-button {
  background-color: #2563EB;
  border-radius: 8px;
}
```

### 3.4 Wait for Hot Reload

```bash
sleep 2  # Wait for Vite/Webpack hot reload
```

### 3.5 Increment Iteration Counter

```
iteration += 1
IF iteration >= max_iterations:
    → EXIT LOOP with PARTIAL status
ELSE:
    → GOTO Step 2.1
```

---

## Step 4: Generate Final Report

Create `design-qa-report-<page-name>.md`:

```markdown
# Design QA Report: <Page Name>

## Status: PASS ✅ | PARTIAL ⚠️ | FAIL ❌

## Summary
- **Iterations completed**: N of max
- **Final pixel mismatch**: X%
- **Token checks**: passed/total
- **Elements verified**: all found | N missing

## Visual Comparison

### Reference (Figma)
![Reference](design-references/<page>-reference.png)

### Final Implementation
![Implementation](design-references/<page>-impl-iter-N.png)

### Diff Overlay
![Diff](design-references/<page>-diff-iter-N.png)

## Fixes Applied

| Iteration | Element | Property | Old Value | New Value | File |
|-----------|---------|----------|-----------|-----------|------|
| 1 | button | backgroundColor | #3B82F6 | #2563EB | Button.css |
| 1 | heading | fontSize | 28px | 32px | Login.css |
| 2 | container | padding | 24px | 48px 32px | Card.css |

## Remaining Issues (if any)

| Element | Issue | Severity | Suggested Fix |
|---------|-------|----------|---------------|
| icon | Missing asset | High | Add icon to public/ |

## Files Modified

- `src/components/Login.jsx`
- `src/styles/Login.css`
- `src/components/Button.css`
```

---

## Pass Criteria

| Criterion | Threshold |
|-----------|-----------|
| Pixel mismatch | ≤ 2% |
| Token accuracy | 100% match |
| Missing elements | 0 |
| Text content | Exact match |

## Iteration Limits

- **Max iterations**: 5 (configurable)
- **Exit early**: If no progress between iterations
- **Fallback**: Generate manual fix instructions if automated fixes fail

---

## Important Notes

1. **Always backup** before modifying files.
2. **Verify hot-reload** is working before iterating.
3. **Handle edge cases**: Fonts not loaded, images missing, responsive breakpoints.
4. **Color conversion**: Figma RGBA → CSS hex/rgba (account for alpha).
5. **Font mapping**: Map Figma font names to installed/web fonts.
6. **This skill MODIFIES CODE** — unlike read-only QA, it applies fixes automatically.
