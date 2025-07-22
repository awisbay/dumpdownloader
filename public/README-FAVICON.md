# Favicon Files for Browser Tab Icons

## Current Setup
- `favicon.svg` - Modern SVG favicon (scalable, works on most browsers)
- Updated `index.html` with proper favicon links

## To Add Your Custom Icon:

### Option 1: Replace the SVG
Replace `/public/favicon.svg` with your own SVG icon.

### Option 2: Add PNG/ICO versions
For better compatibility, you can add:

1. **favicon.ico** (16x16, 32x32, 48x48) - Classic format
2. **favicon-16x16.png** - Small size
3. **favicon-32x32.png** - Standard size
4. **apple-touch-icon.png** (180x180) - For iOS devices

### HTML Setup (already done):
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/favicon.svg" />
```

## Quick Icon Creation:
1. Use any design tool (Figma, Photoshop, or online favicon generators)
2. Create a 32x32px or 64x64px icon
3. Save as SVG for best quality
4. Replace `/public/favicon.svg`

## Online Favicon Generators:
- https://favicon.io/
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

The favicon will appear in browser tabs, bookmarks, and when users save your site to their home screen.
