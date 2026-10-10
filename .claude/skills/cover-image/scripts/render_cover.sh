#!/usr/bin/env bash
# Rasterise an SVG cover source to a PNG with the text burnt in.
#
#   ./render_cover.sh <source.svg> <out.png>
#
# The canvas size comes from the SVG's own width/height, so the window matches
# the artwork and the PNG needs no cropping. Needs network access the first
# time so webfonts referenced by the SVG resolve.

set -euo pipefail

SRC=${1:-}
OUT=${2:-}
if [ -z "$SRC" ] || [ -z "$OUT" ]; then
  echo "usage: render_cover.sh <source.svg> <out.png>" >&2
  exit 2
fi
[ -f "$SRC" ] || { echo "no such file: $SRC" >&2; exit 1; }

find_chrome() {
  local c
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "$(command -v google-chrome || true)" \
    "$(command -v google-chrome-stable || true)" \
    "$(command -v chromium || true)" \
    "$(command -v chromium-browser || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && { printf '%s' "$c"; return 0; }
  done
  return 1
}

CHROME=${CHROME:-$(find_chrome || true)}
if [ -z "$CHROME" ]; then
  echo "Chrome or Chromium not found. Set CHROME=/path/to/chrome and retry." >&2
  exit 1
fi

# Read width/height off the root <svg>; fall back to the 1200x630 OG card size.
dim() {
  sed -n 's/.*<svg[^>]*[^-]'"$1"'="\([0-9.]*\)".*/\1/p' "$SRC" | head -1
}
W=$(dim width); H=$(dim height)
W=${W:-1200}; H=${H:-630}
W=${W%.*}; H=${H%.*}

mkdir -p "$(dirname "$OUT")"
ABS=$(cd "$(dirname "$SRC")" && pwd)/$(basename "$SRC")

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=6000 \
  --window-size="$W,$H" --screenshot="$OUT" "file://$ABS" >/dev/null 2>&1

[ -f "$OUT" ] || { echo "render produced no file; check the SVG parses" >&2; exit 1; }

# A stale or malformed SVG usually shows up as wrong output dimensions.
if command -v sips >/dev/null 2>&1; then
  GOT=$(sips -g pixelWidth -g pixelHeight "$OUT" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}')
  echo "$OUT  $GOT (expected ${W}x${H})"
  [ "$GOT" = "${W}x${H}" ] || { echo "WARNING: unexpected output size" >&2; exit 1; }
else
  echo "$OUT  (expected ${W}x${H})"
fi
