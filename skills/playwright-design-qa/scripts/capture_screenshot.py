"""Capture a full-page or element screenshot of a running frontend using Playwright."""

import argparse
import sys

from playwright.sync_api import sync_playwright


def capture(url: str, output: str, selector: str | None = None, width: int = 1440, height: int = 900):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(url, wait_until="networkidle")

        if selector:
            element = page.query_selector(selector)
            if not element:
                print(f"ERROR: Selector '{selector}' not found on page.", file=sys.stderr)
                browser.close()
                sys.exit(1)
            element.screenshot(path=output)
        else:
            page.screenshot(path=output, full_page=True)

        browser.close()
        print(f"Screenshot saved to {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Capture a screenshot of a running frontend page.")
    parser.add_argument("url", help="URL to capture (e.g. http://localhost:5173)")
    parser.add_argument("-o", "--output", default="screenshot.png", help="Output file path")
    parser.add_argument("-s", "--selector", default=None, help="CSS selector to capture a specific element")
    parser.add_argument("--width", type=int, default=1440, help="Viewport width")
    parser.add_argument("--height", type=int, default=900, help="Viewport height")
    args = parser.parse_args()
    capture(args.url, args.output, args.selector, args.width, args.height)
