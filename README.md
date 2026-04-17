# Bogenkonfigurator

Web-basierter Konfigurator für Recurve-Bögen (ILF Mittelteil & Takedown). V1: rein
clientseitig, ohne Backend, mit Live-Vorschau, PDF-Export, mailto-Anfrage und
teilbarem Konfigurations-Link.

## Quick Start

```bash
npm install
npm run dev
```

Dev-Server läuft auf http://localhost:5173.

## Build & Deploy

```bash
npm run build
```

Produziert `dist/` — als statische Site auf Vercel oder Netlify deploybar.
Keine Backend-Komponente, keine Env-Variablen.

## Konfiguration der Optionen

Alle Produkte, Optionen und Werte sind in `src/config/products.json` definiert.
Anpassen, neu starten, fertig — kein Code-Change nötig.

## Platzhalter-Assets ersetzen

Die V1 nutzt bewusst offensichtliche SVG-Platzhalter, damit beim Review klar ist,
was noch ausgetauscht werden muss. Verzeichnisse:

- `public/assets/components/` — Bauteile (riser-base, limb, tip, wedge)
- `public/assets/wood-patterns/` — Holzmuster (oak, walnut, maple)
- `public/assets/stripes/` — Streifen-Varianten (2/3/5)

### Wenn echte Fotos eintreffen

1. Transparente PNGs in `public/assets/components/` ablegen (gleiche Dateinamen
   wie aktuelle SVGs oder Pfade in `products.json` anpassen).
2. `src/components/Preview/CanvasPreview.jsx` umstellen: statt der inline-JSX
   Pfade die PNGs auf einem `<canvas>` zeichnen und per Tinting einfärben.
3. `src/components/Preview/useLayerCompositor.js` bleibt unverändert — die
   Layer-Specs sind formatunabhängig.
4. `placeholder_values` in `products.json` durch reale `values` ersetzen
   (siehe TODOs unten).

## Offene TODOs (echte Daten vom Kunden nötig)

In `src/config/products.json` markiert:

- `TODO_WOOD_LIST` — vollständige Liste der Holzarten (für beide Produkte)
- `TODO_COMPLETE_RAL_LIST` — vollständige RAL-Farbpalette
  (aktuell als `ral_palette_placeholder` mit 8 Farben hinterlegt)

## Tech Stack

- Vite + React 18 (JavaScript)
- Tailwind CSS
- React Context + useReducer (kein Redux)
- HTML Canvas via inline SVG (späterer Wechsel auf Raster-PNGs vorgesehen)
- jsPDF + html2canvas für PDF-Export
- mailto-Link für E-Mail-Anfrage
- Base64-URL-State für teilbare Konfigurationen

## Projektstruktur

```
src/
├── main.jsx, App.jsx, index.css
├── config/products.json          # alle Optionen
├── state/                        # Context + Reducer
├── components/
│   ├── ProductSelector.jsx
│   ├── Preview/                  # CanvasPreview + useLayerCompositor
│   ├── OptionsPanel/             # Picker pro Optionstyp
│   ├── ProgressBar.jsx
│   ├── MobileStepFlow.jsx
│   └── Actions/                  # PDF, E-Mail, Share
├── lib/                          # urlState, pdfGenerator, emailBuilder, ralColors
└── hooks/                        # useMediaQuery, useConfigValidation
```
