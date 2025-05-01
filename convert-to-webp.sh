#!/bin/bash

# Directory containing PNG images
SOURCE_DIR="./app/assets/images/bakery"

# Output directory for WebP images (will keep the same structure)
OUTPUT_DIR="$SOURCE_DIR"

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
  echo "❌ 'cwebp' not found. Please install it first:"
  echo "   brew install webp   (macOS)"
  exit 1
fi

# Add a check to ensure we have PNG files
PNG_COUNT=$(ls "$SOURCE_DIR"/*.png 2>/dev/null | wc -l)
if [ "$PNG_COUNT" -eq 0 ]; then
  echo "❌ No PNG files found in $SOURCE_DIR"
  echo "Current working directory: $(pwd)"
  echo "Available directories in app/assets:"
  ls -la ./app/assets/
  exit 1
fi

# Convert each PNG to WebP
for file in "$SOURCE_DIR"/*.png; do
  filename=$(basename "$file" .png)
  cwebp "$file" -q 80 -o "$OUTPUT_DIR/$filename.webp"
  echo "✅ $filename.png → $filename.webp"
done

echo "🎉 All PNG images converted to WebP format in: $OUTPUT_DIR"