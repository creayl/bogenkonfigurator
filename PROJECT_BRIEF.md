# Bogenkonfigurator V1 — Initial Setup Task

## Goal
Bootstrap a web-based archery bow configurator. This is the V1 — no backend, no database, fully client-side. Ship a working skeleton with placeholder assets that can be replaced with real photos later.

## Tech Stack (decided — do not deviate)
- **Vite + React 18** (JavaScript, not TypeScript — keep it simple)
- **Tailwind CSS** for all styling
- **React Context + useReducer** for state (no Redux)
- **HTML Canvas API** for the live preview (layer compositing + color tinting)
- **jsPDF + html2canvas** for PDF export
- **`mailto:` link** for email inquiry (no server)
- **Base64-encoded URL params** for shareable configurations
- **Static deploy target**: Vercel/Netlify

Do NOT add: Redux, TypeScript, a backend, a database, a 3D library, authentication, or any state library beyond Context.

## Repository Structure
```
/
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   └── assets/
│       ├── components/         # Bauteil-Platzhalter (SVG)
│       │   ├── riser-base.svg
│       │   ├── limb.svg
│       │   ├── tip.svg
│       │   └── wedge.svg
│       ├── wood-patterns/      # Holz-Muster (SVG-Patterns als Platzhalter)
│       │   ├── oak.svg
│       │   ├── walnut.svg
│       │   └── maple.svg
│       └── stripes/            # Streifen-Varianten (2/3/5)
│           ├── stripes-2.svg
│           ├── stripes-3.svg
│           └── stripes-5.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── config/
    │   └── products.json       # Alle Optionen, Werte, Regeln
    ├── state/
    │   ├── ConfiguratorContext.jsx
    │   └── reducer.js
    ├── components/
    │   ├── ProductSelector.jsx
    │   ├── Preview/
    │   │   ├── CanvasPreview.jsx
    │   │   └── useLayerCompositor.js
    │   ├── OptionsPanel/
    │   │   ├── OptionsPanel.jsx
    │   │   ├── WoodPicker.jsx
    │   │   ├── ColorPicker.jsx
    │   │   ├── StripeCountPicker.jsx
    │   │   ├── HandednessPicker.jsx
    │   │   ├── LengthPicker.jsx
    │   │   ├── DrawWeightPicker.jsx
    │   │   ├── TillerPicker.jsx
    │   │   └── AccessoriesPicker.jsx
    │   ├── ProgressBar.jsx
    │   ├── MobileStepFlow.jsx
    │   └── Actions/
    │       ├── PdfExport.jsx
    │       ├── EmailInquiry.jsx
    │       └── ShareLink.jsx
    ├── lib/
    │   ├── urlState.js         # Base64 encode/decode der Config
    │   ├── pdfGenerator.js
    │   ├── emailBuilder.js
    │   └── ralColors.js        # RAL-Nummer → Hex Mapping
    └── hooks/
        ├── useMediaQuery.js
        └── useConfigValidation.js
```

## JSON Config Schema

Create `src/config/products.json` with this structure. Use placeholder values where marked TODO — the client will provide complete lists later.

```json
{
  "products": {
    "ilf_mittelteil": {
      "id": "ilf_mittelteil",
      "label_de": "ILF Mittelteil",
      "label_en": "ILF Riser",
      "options": {
        "length": {
          "type": "select",
          "label_de": "Länge",
          "unit": "inch",
          "values": [19, 21, 23, 25, 27],
          "default": 23
        },
        "handedness": {
          "type": "radio",
          "label_de": "Ausführung",
          "values": [
            { "id": "RH", "label_de": "Rechtshand" },
            { "id": "LH", "label_de": "Linkshand" }
          ],
          "default": "RH"
        },
        "wood": {
          "type": "select",
          "label_de": "Holzart",
          "values": "TODO_WOOD_LIST",
          "placeholder_values": [
            { "id": "oak", "label_de": "Eiche", "pattern": "/assets/wood-patterns/oak.svg" },
            { "id": "walnut", "label_de": "Nussbaum", "pattern": "/assets/wood-patterns/walnut.svg" },
            { "id": "maple", "label_de": "Ahorn", "pattern": "/assets/wood-patterns/maple.svg" }
          ],
          "default": "oak"
        },
        "stripe_count": {
          "type": "select",
          "label_de": "Anzahl Streifen",
          "values": [2, 3, 5],
          "default": 3,
          "note_de": "Bei 5 Streifen zeigt die Vorschau eine repräsentative Darstellung mit 3 Streifen."
        },
        "stripe_colors": {
          "type": "color_per_stripe",
          "label_de": "Farbe Streifen",
          "palette": "ral_palette",
          "default_same_color": "RAL_9005"
        },
        "screw_color": {
          "type": "color",
          "label_de": "Farbe Schrauben",
          "palette": "ral_palette",
          "default": "RAL_9005"
        }
      }
    },
    "takedown_bogen": {
      "id": "takedown_bogen",
      "label_de": "Takedown Bogen (Kompletter Bogen)",
      "options": {
        "length": {
          "type": "select",
          "label_de": "Länge",
          "unit": "inch",
          "values": [60, 62, 64, 66, 68, 70],
          "default": 66
        },
        "draw_weight": {
          "type": "select",
          "label_de": "Stärke",
          "unit": "lbs",
          "values_range": { "min": 20, "max": 70, "step": 1 },
          "default": 35
        },
        "handedness": {
          "type": "radio",
          "label_de": "Ausführung",
          "values": [
            { "id": "RH", "label_de": "Rechtshand" },
            { "id": "LH", "label_de": "Linkshand" }
          ],
          "default": "RH"
        },
        "wood": {
          "type": "select",
          "label_de": "Holzart",
          "values": "TODO_WOOD_LIST",
          "placeholder_values": [
            { "id": "oak", "label_de": "Eiche", "pattern": "/assets/wood-patterns/oak.svg" },
            { "id": "walnut", "label_de": "Nussbaum", "pattern": "/assets/wood-patterns/walnut.svg" },
            { "id": "maple", "label_de": "Ahorn", "pattern": "/assets/wood-patterns/maple.svg" }
          ],
          "default": "oak"
        },
        "stripe_count": {
          "type": "select",
          "label_de": "Anzahl Streifen",
          "values": [2, 3, 5],
          "default": 3
        },
        "stripe_colors": {
          "type": "color_per_stripe",
          "label_de": "Farbe Streifen",
          "palette": "ral_palette",
          "default_same_color": "RAL_9005"
        },
        "limb_color": {
          "type": "color",
          "label_de": "Farbe Wurfarme",
          "palette": "ral_palette",
          "default": "RAL_9005"
        },
        "wedge_color": {
          "type": "color",
          "label_de": "Farbe Keile",
          "palette": "ral_palette",
          "default": "RAL_9005"
        },
        "tip_color": {
          "type": "color",
          "label_de": "Farbe Tips",
          "palette": "ral_palette",
          "default": "RAL_9005"
        },
        "screw_color": {
          "type": "color",
          "label_de": "Farbe Schrauben",
          "palette": "ral_palette",
          "default": "RAL_9005"
        },
        "tiller": {
          "type": "radio",
          "label_de": "Tiller",
          "values": [
            { "id": "3_under", "label_de": "3-Unter" },
            { "id": "mediterran", "label_de": "Mediterran" }
          ],
          "default": "mediterran"
        },
        "accessories": {
          "type": "multi_select",
          "label_de": "Zubehör",
          "values": [
            { "id": "string", "label_de": "Sehne" },
            { "id": "quiver", "label_de": "Bogenköcher" },
            { "id": "knife", "label_de": "Messer mit Resten aus Bogen" }
          ],
          "default": []
        },
        "notes": {
          "type": "textarea",
          "label_de": "Bemerkungen / Sonderwünsche",
          "max_length": 1000
        }
      }
    }
  },
  "palettes": {
    "ral_palette": "TODO_COMPLETE_RAL_LIST",
    "ral_palette_placeholder": [
      { "id": "RAL_9005", "name_de": "Tiefschwarz", "hex": "#0A0A0A" },
      { "id": "RAL_9010", "name_de": "Reinweiß", "hex": "#FFFFFF" },
      { "id": "RAL_3020", "name_de": "Verkehrsrot", "hex": "#CC0605" },
      { "id": "RAL_5010", "name_de": "Enzianblau", "hex": "#0E294B" },
      { "id": "RAL_6005", "name_de": "Moosgrün", "hex": "#114232" },
      { "id": "RAL_8017", "name_de": "Schokoladenbraun", "hex": "#45322E" },
      { "id": "RAL_1023", "name_de": "Verkehrsgelb", "hex": "#FAD201" },
      { "id": "RAL_7016", "name_de": "Anthrazitgrau", "hex": "#293133" }
    ]
  },
  "rules": {
    "dependencies": [],
    "note": "Laut Kundenantwort Frage 10: Aktuell keine Abhängigkeiten zwischen Optionen."
  },
  "ui_flow": {
    "order": ["wood", "stripe_count", "stripe_colors", "limb_color", "wedge_color", "tip_color", "screw_color", "handedness", "length", "draw_weight", "tiller", "accessories", "notes"],
    "note": "Visuelle Optionen zuerst, dann Spezifikationen. Bestätigt vom Kunden Frage 11."
  },
  "email": {
    "recipient_configurable": true,
    "note": "Laut Kundenantwort Frage 17: Eingabefeld für E-Mail-Empfänger."
  }
}
```

## Placeholder Asset Guidelines

**Important**: All placeholder assets should be obvious dummies. Use clean SVG geometry, not realistic imagery. This makes it visually clear to everyone (including the client during review) what's a placeholder and what's real.

### Component shapes (public/assets/components/)

Create these as simple SVG silhouettes at a consistent scale. They must visually stack on a shared canvas to form a complete bow:

- `riser-base.svg`: Vertical grip-shaped silhouette (approx 400px tall, 80px wide), roughly hourglass form. Fill with `#D4A574` (wood-tone placeholder). Include a `data-color-region="wood"` class on the main path so the renderer can apply wood patterns. Include separate paths for `data-color-region="stripe-1"`, `stripe-2`, `stripe-3` — thin horizontal bands near the grip.
- `limb.svg`: Long curved limb silhouette (approx 300px × 60px). Two copies used (upper + lower), rotated/mirrored in code. Single path with `data-color-region="limb"`.
- `tip.svg`: Small tip piece (approx 40px × 40px). Single path with `data-color-region="tip"`.
- `wedge.svg`: Small wedge where limb meets riser (approx 30px × 30px). Single path with `data-color-region="wedge"`.

All SVGs: `viewBox` set, `fill="currentColor"` on color-region paths so CSS/JS can override.

### Wood patterns (public/assets/wood-patterns/)

Three distinct SVG patterns as placeholders:
- `oak.svg`: Light tan (#C8A877) background with subtle darker wavy lines
- `walnut.svg`: Dark brown (#5C4033) background with lighter streaks
- `maple.svg`: Pale cream (#E8D4A8) background with very fine lines

Each pattern should be tileable (128×128 viewBox works well). These get used as `<pattern>` fills on the riser.

### Stripe variants (public/assets/stripes/)

Decorative stripe patterns that overlay on the riser grip area. One SVG per count (2, 3, 5). Each stripe is a separate `<rect>` with `data-stripe-index="0"`, `"1"`, etc. so per-stripe colors work.

## Core Architecture

### State shape
```js
{
  productId: 'ilf_mittelteil' | 'takedown_bogen' | null,
  selections: {
    // keys match option keys in the product config
    wood: 'oak',
    handedness: 'RH',
    stripe_count: 3,
    stripe_colors: ['RAL_9005', 'RAL_9005', 'RAL_9005'],
    // ...
  },
  ui: {
    currentStep: 0,       // for mobile flow
    isMobile: false,
    emailRecipient: ''
  }
}
```

### Reducer actions
- `SET_PRODUCT`
- `SET_SELECTION` (key, value)
- `SET_STRIPE_COLOR` (index, ralId)
- `RESET`
- `LOAD_FROM_URL` (decoded state object)
- `SET_EMAIL_RECIPIENT`

### URL state
On every selection change, encode the full state to base64 and push to URL (`?c=...`). On app load, check for `?c=` and decode. Use `history.replaceState` so back button isn't spammed.

### Canvas preview (the critical piece)

`useLayerCompositor.js` hook:
1. Load all relevant SVGs as in-memory DOM nodes
2. For each color region, apply the selected color (via fill on path)
3. For the riser wood region, apply the wood pattern as an SVG `<pattern>` fill
4. Composite layers: riser (back) → limbs → wedges → tips → stripes (front)
5. If `handedness === 'LH'`, apply `transform: scaleX(-1)` on the container
6. Rasterize to a canvas for PDF export and sharing

Use SVG manipulation (not bitmap canvas filters) for the placeholders — cleaner, scales well, and when real PNGs arrive you swap the SVG-manipulation code for canvas tinting on raster images.

**Note**: Real PNG photos will replace SVGs later. Structure the compositor so `renderLayer(layerSpec)` is the same call regardless of source format; just switch the implementation inside.

## Responsive Layout

- **Desktop (≥ 1024px)**: Two-column layout. Left = canvas preview (sticky). Right = scrollable options panel with all options visible.
- **Mobile (< 1024px)**: Single-column step-by-step flow. Preview at top (smaller, still live), options below. Next/Back buttons navigate steps. Progress bar shows completion.

Use Tailwind's `lg:` breakpoint. Avoid external UI libraries — plain Tailwind classes only.

## Actions (bottom of panel / header)

1. **"PDF herunterladen"**: Rasterize the current preview + collect selections → jsPDF generates a document with preview image at top, selections listed below, notes at the bottom. No price field.
2. **"Als E-Mail-Anfrage senden"**: Opens mailto link. Recipient is taken from an input field (from config: `email.recipient_configurable: true`). Body = formatted list of selections + shareable link + notes.
3. **"Link kopieren"**: Copies current URL (with encoded state) to clipboard.

## README.md content

Include in README:
- What this is (one paragraph)
- Quick start (`npm install`, `npm run dev`)
- Build and deploy (`npm run build`, deploy `dist/` to Vercel/Netlify)
- Where to edit options: `src/config/products.json`
- How to swap placeholder assets for real ones (directory structure, required format, viewBox/size requirements)
- TODO list of items marked `TODO_*` in the config that need real data from the client

## First Task Deliverable

1. Full project scaffold with all files created
2. `npm run dev` starts and shows:
   - Product selector (two cards: ILF Mittelteil / Takedown Bogen)
   - After selection: the full configurator with placeholder SVG preview
   - All option pickers working and updating state
   - URL updates with encoded state on every change
3. PDF export button that produces a usable (if not beautiful) PDF
4. Mailto link that opens with a sensible body
5. Responsive: works on mobile and desktop
6. Committed to `main` branch with a sensible initial commit message

Don't spend time on polish — the goal is a working skeleton. Visual refinement comes once real photos arrive.

## Things explicitly NOT in scope for this first task
- Price logic (removed per client feedback)
- Admin panel
- Backend of any kind
- 3D rendering
- Real photography (SVG placeholders only for now)
- i18n beyond German UI labels
- Accessibility deep-dive (basic semantic HTML only)
- Unit tests (skip for V1 skeleton; add later)

## When photos arrive

The client will provide:
- Transparent PNGs of: riser (per wood type), limb, tip, wedge
- Stripe reference photos for 2 and 3 stripes
- Wood sample images (color + grain)

Replacement path: drop PNGs into `public/assets/components/` replacing the SVGs, update `products.json` `placeholder_values` → `values` with real wood list, swap SVG-based compositor implementation for canvas-based tinting. Everything else stays the same.
