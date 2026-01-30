"""Generate a visual diff between a Figma reference screenshot and an implementation screenshot."""

import argparse
import sys

from PIL import Image, ImageChops, ImageDraw


def visual_diff(reference_path: str, implementation_path: str, output_path: str, threshold: int = 30):
    ref = Image.open(reference_path).convert("RGB")
    impl = Image.open(implementation_path).convert("RGB")

    # Resize implementation to match reference dimensions for comparison
    if ref.size != impl.size:
        print(f"Size mismatch: reference={ref.size}, implementation={impl.size}. Resizing implementation.")
        impl = impl.resize(ref.size, Image.LANCZOS)

    diff = ImageChops.difference(ref, impl)

    # Create highlighted diff overlay
    width, height = ref.size
    side_by_side = Image.new("RGB", (width * 3, height))
    side_by_side.paste(ref, (0, 0))
    side_by_side.paste(impl, (width, 0))

    # Create a highlighted diff panel
    highlight = impl.copy()
    draw = ImageDraw.Draw(highlight)
    diff_pixels = diff.load()
    mismatch_count = 0
    total_pixels = width * height

    for y in range(height):
        for x in range(width):
            r, g, b = diff_pixels[x, y]
            if r + g + b > threshold:
                draw.point((x, y), fill=(255, 0, 0))
                mismatch_count += 1

    side_by_side.paste(highlight, (width * 2, 0))

    # Add labels
    label_draw = ImageDraw.Draw(side_by_side)
    for i, label in enumerate(["Reference (Figma)", "Implementation", "Diff Highlight"]):
        label_draw.rectangle([(i * width, 0), (i * width + 180, 24)], fill="black")
        label_draw.text((i * width + 4, 4), label, fill="white")

    side_by_side.save(output_path)

    mismatch_pct = (mismatch_count / total_pixels) * 100
    print(f"Diff saved to {output_path}")
    print(f"Pixel mismatch: {mismatch_count}/{total_pixels} ({mismatch_pct:.2f}%)")
    return mismatch_pct


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a visual diff between reference and implementation screenshots.")
    parser.add_argument("reference", help="Path to reference (Figma) screenshot")
    parser.add_argument("implementation", help="Path to implementation screenshot")
    parser.add_argument("-o", "--output", default="diff.png", help="Output diff image path")
    parser.add_argument("--threshold", type=int, default=30, help="Pixel diff sensitivity threshold (0-255)")
    args = parser.parse_args()
    pct = visual_diff(args.reference, args.implementation, args.output, args.threshold)
    sys.exit(1 if pct > 5.0 else 0)