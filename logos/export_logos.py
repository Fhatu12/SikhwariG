import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


def find_components(mask, w: int, h: int):
    visited = bytearray(w * h)
    components = []

    for y0 in range(h):
        row0 = y0 * w
        for x0 in range(w):
            idx0 = row0 + x0
            if not mask[idx0] or visited[idx0]:
                continue

            stack = [(x0, y0)]
            visited[idx0] = 1
            size = 0
            min_y = max_y = y0
            min_x = max_x = x0
            sum_y = 0
            sum_x = 0

            while stack:
                x, y = stack.pop()
                size += 1
                sum_y += y
                sum_x += x
                if y < min_y:
                    min_y = y
                if y > max_y:
                    max_y = y
                if x < min_x:
                    min_x = x
                if x > max_x:
                    max_x = x

                y_start = max(0, y - 1)
                y_end = min(h - 1, y + 1)
                x_start = max(0, x - 1)
                x_end = min(w - 1, x + 1)
                for ny in range(y_start, y_end + 1):
                    row = ny * w
                    for nx in range(x_start, x_end + 1):
                        if nx == x and ny == y:
                            continue
                        idx = row + nx
                        if mask[idx] and not visited[idx]:
                            visited[idx] = 1
                            stack.append((nx, ny))

            components.append(
                {
                    "size": size,
                    "bbox": (min_x, min_y, max_x, max_y),  # inclusive
                    "center_x": sum_x / size,
                    "center_y": sum_y / size,
                }
            )

    return components


def estimate_bg_alpha_thresh(max_bytes, w: int, h: int, base_thresh: int) -> int:
    border = max(4, min(w, h) // 128)
    samples = []

    for y in range(border):
        row = y * w
        samples.extend(max_bytes[row : row + w])
    for y in range(h - border, h):
        row = y * w
        samples.extend(max_bytes[row : row + w])
    for y in range(border, h - border):
        row = y * w
        samples.extend(max_bytes[row : row + border])
        samples.extend(max_bytes[row + w - border : row + w])

    samples.sort()
    p95 = samples[int(len(samples) * 0.95)]
    return max(base_thresh, min(250, p95 + 5))


def to_transparent_rgba(img_rgb: Image.Image, bg_alpha_thresh: int) -> Image.Image:
    r, g, b = img_rgb.split()
    max_channel = ImageChops.lighter(ImageChops.lighter(r, g), b)
    alpha = max_channel.point(lambda v: 0 if v <= bg_alpha_thresh else 255, mode="L")
    rgba = img_rgb.copy().convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def padded_crop_bounds(bbox, img_w: int, img_h: int, pad_ratio: float):
    min_x, min_y, max_x, max_y = bbox
    w = max_x - min_x + 1
    h = max_y - min_y + 1
    pad = int(round(max(w, h) * pad_ratio))
    left = max(0, min_x - pad)
    top = max(0, min_y - pad)
    right = min(img_w, max_x + 1 + pad)
    bottom = min(img_h, max_y + 1 + pad)
    return left, top, right, bottom, pad


def extract_components(
    max_bytes, w: int, h: int, fg_thresh: int, min_pixels: int, erode_steps: int = 0
):
    if erode_steps > 0:
        binary_bytes = bytes(255 if v > fg_thresh else 0 for v in max_bytes)
        mask_img = Image.frombytes("L", (w, h), binary_bytes)
        for _ in range(erode_steps):
            mask_img = mask_img.filter(ImageFilter.MinFilter(3))
        fg_mask = bytearray(1 if v else 0 for v in mask_img.tobytes())
    else:
        fg_mask = bytearray(1 if v > fg_thresh else 0 for v in max_bytes)
    return [c for c in find_components(fg_mask, w, h) if c["size"] >= min_pixels]


def merge_two_components(c1, c2):
    min_x = min(c1["bbox"][0], c2["bbox"][0])
    min_y = min(c1["bbox"][1], c2["bbox"][1])
    max_x = max(c1["bbox"][2], c2["bbox"][2])
    max_y = max(c1["bbox"][3], c2["bbox"][3])
    size = c1["size"] + c2["size"]
    center_x = (c1["center_x"] * c1["size"] + c2["center_x"] * c2["size"]) / size
    center_y = (c1["center_y"] * c1["size"] + c2["center_y"] * c2["size"]) / size
    return {"size": size, "bbox": (min_x, min_y, max_x, max_y), "center_x": center_x, "center_y": center_y}


def bbox_gap(c1, c2):
    a = c1["bbox"]
    b = c2["bbox"]
    if a[2] < b[0]:
        gap_x = b[0] - a[2] - 1
    elif b[2] < a[0]:
        gap_x = a[0] - b[2] - 1
    else:
        gap_x = 0

    if a[3] < b[1]:
        gap_y = b[1] - a[3] - 1
    elif b[3] < a[1]:
        gap_y = a[1] - b[3] - 1
    else:
        gap_y = 0
    return gap_x * gap_x + gap_y * gap_y


def merge_components_to_count(components, target_count: int):
    comps = [dict(c) for c in components]
    while len(comps) > target_count:
        best_i = 0
        best_j = 1
        best_dist = bbox_gap(comps[0], comps[1])
        for i in range(len(comps)):
            for j in range(i + 1, len(comps)):
                d = bbox_gap(comps[i], comps[j])
                if d < best_dist:
                    best_i = i
                    best_j = j
                    best_dist = d
        merged = merge_two_components(comps[best_i], comps[best_j])
        next_comps = []
        for idx, comp in enumerate(comps):
            if idx not in (best_i, best_j):
                next_comps.append(comp)
        next_comps.append(merged)
        comps = next_comps
    return comps


def percentile(values, p: float):
    if not values:
        return 0
    values = sorted(values)
    idx = int(round((len(values) - 1) * p))
    return values[idx]


def local_bg_threshold(crop_rgb: Image.Image, base_thresh: int, used_fg_thresh: int) -> int:
    r, g, b = crop_rgb.split()
    max_channel = ImageChops.lighter(ImageChops.lighter(r, g), b)
    px = max_channel.load()
    w, h = crop_rgb.size
    border = max(2, min(w, h) // 12)
    samples = []
    for y in range(border):
        for x in range(w):
            samples.append(px[x, y])
    for y in range(h - border, h):
        for x in range(w):
            samples.append(px[x, y])
    for y in range(border, h - border):
        for x in range(border):
            samples.append(px[x, y])
        for x in range(w - border, w):
            samples.append(px[x, y])

    p85 = percentile(samples, 0.85)
    return max(base_thresh, min(used_fg_thresh - 5, p85 + 4))


def crop_transparent(img_rgb: Image.Image, box, base_bg_thresh: int, used_fg_thresh: int):
    crop_rgb = img_rgb.crop(box).convert("RGB")
    bg_thresh = local_bg_threshold(crop_rgb, base_bg_thresh, used_fg_thresh)
    rgba = to_transparent_rgba(crop_rgb, bg_thresh)
    return rgba, bg_thresh


def main():
    parser = argparse.ArgumentParser(description="Export Sikhwari logos into transparent PNGs.")
    parser.add_argument("input_path", nargs="?", default="sikhwari-logos.png")
    parser.add_argument("output_dir", nargs="?", default="output")
    parser.add_argument("--fg-thresh", type=int, default=18)
    parser.add_argument("--bg-alpha-thresh", type=int, default=12)
    parser.add_argument("--min-pixels", type=int, default=None)
    parser.add_argument("--pad-ratio", type=float, default=0.12)
    args = parser.parse_args()

    input_path = Path(args.input_path)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(input_path).convert("RGB")
    img_w, img_h = img.size
    r, g, b = img.split()
    max_channel = ImageChops.lighter(ImageChops.lighter(r, g), b)
    max_bytes = max_channel.tobytes()
    area = img_h * img_w
    min_pixels = args.min_pixels if args.min_pixels is not None else max(1, int(area * 0.0025))

    used_fg_thresh = args.fg_thresh
    used_erode_steps = 0
    threshold_trials = sorted(
        {
            args.fg_thresh,
            args.fg_thresh + 6,
            args.fg_thresh + 12,
            args.fg_thresh + 18,
            args.fg_thresh + 24,
            args.fg_thresh + 30,
            60,
            80,
            100,
            120,
            140,
            160,
            180,
            200,
            220,
            230,
            240,
        }
    )
    threshold_trials = [t for t in threshold_trials if 0 <= t < 255]

    hist = [0] * 256
    for v in max_bytes:
        hist[v] += 1
    above = [0] * 256
    running = 0
    for t in range(255, -1, -1):
        running += hist[t]
        above[t] = running

    best = None
    for erode_steps in [0, 1, 2]:
        for trial in threshold_trials:
            fg_ratio = above[trial + 1] / area if trial < 255 else 0.0
            if fg_ratio > 0.35:
                continue

            trial_components = extract_components(
                max_bytes, img_w, img_h, trial, min_pixels, erode_steps=erode_steps
            )
            if len(trial_components) < 5:
                continue

            sizes = sorted((c["size"] for c in trial_components), reverse=True)
            ratio = sizes[0] / max(1, sizes[4])
            score = ratio + (len(trial_components) - 5) * 0.25 + erode_steps * 0.05

            if best is None or score < best["score"]:
                best = {
                    "score": score,
                    "components": trial_components,
                    "fg_thresh": trial,
                    "erode_steps": erode_steps,
                }
            if score <= 2.0 and len(trial_components) <= 6:
                break
        if best is not None and best["score"] <= 2.0:
            break

    components = []
    if best is not None:
        components = best["components"]
        used_fg_thresh = best["fg_thresh"]
        used_erode_steps = best["erode_steps"]

    if not components:
        raise RuntimeError(
            "No valid 5-component split found. Try adjusting --fg-thresh, "
            "--bg-alpha-thresh, or --min-pixels."
        )

    components.sort(key=lambda c: c["size"], reverse=True)
    if len(components) > 5:
        components = merge_components_to_count(components, 5)
    if len(components) < 5:
        raise RuntimeError(
            f"Detected only {len(components)} components after filtering; expected 5. "
            "Try adjusting --fg-thresh and/or --min-pixels."
        )

    parent = min(components, key=lambda c: c["center_y"])
    children = [c for c in components if c is not parent]
    children.sort(key=lambda c: c["center_x"])
    ordered = [parent] + children

    base_bg_alpha_thresh = estimate_bg_alpha_thresh(
        max_bytes, img_w, img_h, args.bg_alpha_thresh
    )
    names = [
        "SG_parent.png",
        "SG_child_1.png",
        "SG_child_2.png",
        "SG_child_3.png",
        "SG_child_4.png",
    ]

    saved = []
    pad_values = []
    bg_thresholds = []
    for comp, name in zip(ordered, names):
        left, top, right, bottom, pad = padded_crop_bounds(
            comp["bbox"], img_w=img_w, img_h=img_h, pad_ratio=args.pad_ratio
        )
        pad_values.append(pad)
        crop, local_thresh = crop_transparent(
            img, (left, top, right, bottom), base_bg_alpha_thresh, used_fg_thresh
        )
        bg_thresholds.append(local_thresh)
        out_path = output_dir / name
        crop.save(out_path)
        saved.append(out_path.resolve())

    print(f"fg_thresh={used_fg_thresh}")
    print(f"erode_steps={used_erode_steps}")
    print(f"bg_alpha_thresh_base={base_bg_alpha_thresh}")
    print(f"bg_alpha_thresh_per_logo={bg_thresholds}")
    print(f"min_pixels={min_pixels}")
    print(f"pad_ratio={args.pad_ratio}")
    print(f"pad_pixels_used={pad_values}")
    print("Saved files:")
    for p in saved:
        print(str(p))


if __name__ == "__main__":
    main()
