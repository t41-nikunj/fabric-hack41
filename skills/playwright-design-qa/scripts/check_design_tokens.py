"""Validate computed CSS properties of UI elements against a design specification JSON."""

import argparse
import json
import sys

from playwright.sync_api import sync_playwright

# Map design spec keys to CSS property names
TOKEN_MAP = {
    "height": "height",
    "width": "width",
    "borderRadius": "border-radius",
    "backgroundColor": "background-color",
    "color": "color",
    "fontSize": "font-size",
    "fontWeight": "font-weight",
    "padding": "padding",
    "margin": "margin",
    "gap": "gap",
}


def normalize_value(css_prop: str, value: str) -> str:
    """Normalize CSS values for comparison."""
    value = value.strip().lower()
    # Convert px values to int for numeric comparison
    if value.endswith("px"):
        try:
            return str(int(float(value.replace("px", ""))))
        except ValueError:
            pass
    # Normalize rgb to hex
    if value.startswith("rgb("):
        parts = value.replace("rgb(", "").replace(")", "").split(",")
        try:
            return "#{:02x}{:02x}{:02x}".format(*[int(p.strip()) for p in parts])
        except (ValueError, IndexError):
            pass
    return value


def normalize_expected(value) -> str:
    """Normalize expected values from the design spec."""
    if isinstance(value, (int, float)):
        return str(int(value))
    return str(value).strip().lower()


def check_tokens(url: str, spec_path: str, width: int = 1440, height: int = 900):
    with open(spec_path) as f:
        spec = json.load(f)

    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(url, wait_until="networkidle")

        for element_name, tokens in spec.get("elements", {}).items():
            selector = tokens.get("selector")
            if not selector:
                # Try common selectors
                selector = f'[data-testid="{element_name}"]'

            el = page.query_selector(selector)
            if not el:
                results.append({"element": element_name, "selector": selector, "status": "NOT_FOUND"})
                continue

            for token_key, expected_value in tokens.items():
                if token_key == "selector" or token_key == "text":
                    continue
                css_prop = TOKEN_MAP.get(token_key)
                if not css_prop:
                    continue

                actual = el.evaluate(
                    f"el => getComputedStyle(el).getPropertyValue('{css_prop}')"
                )
                actual_norm = normalize_value(css_prop, actual)
                expected_norm = normalize_expected(expected_value)

                results.append({
                    "element": element_name,
                    "token": token_key,
                    "expected": expected_norm,
                    "actual": actual_norm,
                    "match": actual_norm == expected_norm,
                })

            # Check text content if specified
            if "text" in tokens:
                actual_text = el.inner_text().strip()
                results.append({
                    "element": element_name,
                    "token": "text",
                    "expected": tokens["text"],
                    "actual": actual_text,
                    "match": actual_text == tokens["text"],
                })

        browser.close()

    # Print report
    passed = sum(1 for r in results if r.get("match", False))
    failed = [r for r in results if not r.get("match", True)]
    not_found = [r for r in results if r.get("status") == "NOT_FOUND"]
    total = len(results)

    print(f"\n{'='*60}")
    print(f"Design Token Report: {spec.get('page', 'Unknown Page')}")
    print(f"{'='*60}")
    print(f"Passed: {passed}/{total}")

    if not_found:
        print(f"\n--- Elements Not Found ({len(not_found)}) ---")
        for r in not_found:
            print(f"  ✗ {r['element']} (selector: {r['selector']})")

    if failed:
        print(f"\n--- Mismatches ({len(failed)}) ---")
        for r in failed:
            print(f"  ✗ {r['element']}.{r['token']}: expected={r['expected']}, actual={r['actual']}")

    if not failed and not not_found:
        print("\n✓ All design tokens match!")

    return len(failed) + len(not_found)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check design tokens against a running UI.")
    parser.add_argument("url", help="URL of the running frontend")
    parser.add_argument("spec", help="Path to design spec JSON")
    parser.add_argument("--width", type=int, default=1440, help="Viewport width")
    parser.add_argument("--height", type=int, default=900, help="Viewport height")
    args = parser.parse_args()
    failures = check_tokens(args.url, args.spec, args.width, args.height)
    sys.exit(1 if failures > 0 else 0)