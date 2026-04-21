# Canvas-Geometrie (Preview)

Referenz für die stilisierte SVG-Vorschau in `src/components/Preview/`.
Gilt für den Platzhalter-Stand (SVG-Inline-Komposition). Sobald echte
PNG-Fotos geliefert werden, wird der Compositor umgestellt (siehe
`PROJECT_BRIEF.md` → „When photos arrive"); die hier beschriebenen
Koordinaten entfallen dann.

## Koordinatensystem

- **viewBox:** `0 0 360 760` (Breite × Höhe in SVG-Einheiten)
- **Definiert in:** `CanvasPreview.jsx:23`
- **Darstellung responsiv:** SVG skaliert mit `w-full h-auto`, das
  Verhältnis bleibt 360:760 (≈ 9:19).
- **Y-Achse:** zeigt nach unten (SVG-Standard). `y=0` ist oben,
  `y=760` ist unten.

## Render-Reihenfolge (Z-Order)

Reihenfolge laut `PROJECT_BRIEF.md` („Canvas preview"):
Riser (hinten) → Limbs → Wedges → Tips → Stripes (vorne).
Implementiert in `useLayerCompositor.js:47-56`.

Nur für `takedown_bogen` werden Limbs/Wedges/Tips gepusht. Für
`ilf_mittelteil` werden Riser + Stripes gerendert.

## Layer-Geometrien

Alle Koordinaten beziehen sich auf den viewBox 360 × 760. Transforms
sind angegeben wie im JSX.

### Riser (`RiserLayer`, `CanvasPreview.jsx:78-91`)

- **transform:** `translate(140 180)`
- **Pfad (lokal):** sanduhrförmige Silhouette
  - `d = M30 0 H50 V60 Q60 80 60 120 Q60 160 40 200 Q60 240 60 280 Q60 320 50 340 V400 H30 V340 Q20 320 20 280 Q20 240 40 200 Q20 160 20 120 Q20 80 30 60 Z`
  - Lokale Bounding-Box: ca. `x: 20..60`, `y: 0..400`
- **Global (nach translate):** ca. `x: 160..200`, `y: 180..580`
- **Zwei Pfade auf identischer Geometrie:**
  1. Solide Holz-Grundfarbe (`data-color-region="wood-base"`) — bleibt
     sichtbar, wenn `html2canvas` das externe SVG-Pattern nicht lädt
     (relevant für PDF-Export).
  2. SVG-`<pattern>`-Füllung (`data-color-region="wood"`) mit
     `fill="url(#wood-pattern)"`. Pattern referenziert die PNG/SVG
     unter `public/assets/wood-patterns/{oak,walnut,maple}.svg`.

### Limb (`LimbLayer`, `CanvasPreview.jsx:118-132`)

Zwei Instanzen, pro Position eigener Pfad (kein Mirror in CSS):

- **upper:** `M150 170 Q165 100 170 40 Q175 100 190 170 Z`
  - Global ca. `x: 150..190`, `y: 40..170`
- **lower:** `M150 590 Q165 660 170 720 Q175 660 190 590 Z`
  - Global ca. `x: 150..190`, `y: 590..720`

Die Limbs sitzen direkt über bzw. unter dem Riser-Körper
(Riser endet bei y ≈ 180 und beginnt wieder bei y ≈ 580 am
gegenüberliegenden Ende). Farbe kommt aus `selections.limb_color`.

### Wedge (`WedgeLayer`, `CanvasPreview.jsx:134-151`)

Kleines Trapez am Limb-zu-Riser-Übergang. Pfad (lokal):
`M0 22 L44 22 L34 4 L10 4 Z`

- **upper:** `transform="translate(150 160)"` →
  global ca. `x: 150..194`, `y: 164..182`
- **lower:** `transform="translate(150 620) scale(1 -1)"` →
  vertikal gespiegelt, global ca. `x: 150..194`, `y: 598..616`

Die Wedge wurde bewusst knapp außerhalb des Riser-Zentrums platziert
(Seitwärts-Offset `x=150` vs. Riser-Zentrum `x=160..200`), damit die
Farbe auf einer Fläche landet, die NICHT vom Riser-Pfad überdeckt
wird.

### Tip (`TipLayer`, `CanvasPreview.jsx:153-170`)

Abgerundete Spitze am Limb-Ende. Pfad (lokal):
`M6 20 Q22 4 38 20 Q36 30 30 34 Q22 38 14 34 Q8 30 6 20 Z`

- **upper:** `transform="translate(150 20)"` →
  global ca. `x: 156..188`, `y: 24..54`
- **lower:** `transform="translate(150 720)"` →
  global ca. `x: 156..188`, `y: 724..754`

Beide Tips liegen innerhalb des viewBox (y: 0..760). Zuvor lag der
obere Tip bei `y=-110` und war unsichtbar.

### Stripes (`StripesLayer`, `CanvasPreview.jsx:93-116`)

Horizontale Farbbänder über dem Riser-Grip. Gerendert als einzelne
`<rect>`-Elemente mit `data-stripe-index`.

- **xs / w:** `x=160`, `width=40` (deckt den Riser-Körper)
- **baseY:** `y=360` (erstes Band)
- **gap:** 10 px vertikal zwischen Bändern
- **height:** 6 px pro Band
- **Anzahl sichtbarer Bänder:** `Math.min(count, 3)` — 5 Streifen
  werden als 3 dargestellt (repräsentativ). Info dazu in
  `products.json → ilf_mittelteil.options.stripe_count.note_de`.

Farben stammen aus `selections.stripe_colors[i]` (RAL → Hex via
`ralToHex`).

## Handedness / Mirror

`selections.handedness === 'LH'` setzt `transform: scaleX(-1)` auf
das umschließende `<svg>` (`CanvasPreview.jsx:25`). Keine separaten
Assets für Links-/Rechtshand — einzig eine CSS-Spiegelung.

## Farbfluss

1. **State (`selections.*_color`):** RAL-ID, z. B. `RAL_9005`.
2. **`useLayerCompositor`:** wandelt per `ralToHex` in Hex um und legt
   es als `color`-Property in den Layer-Spec.
3. **`CanvasPreview` → `*Layer`:** setzt `fill={color}` direkt am
   Pfad. Keine CSS-Variablen, keine `currentColor`-Indirektion (bewusst
   — SVG-Rasterung via `html2canvas` verhält sich so robuster).

Ausnahme Wood:
1. `selections.wood` → `placeholder_values[].pattern` (Pfad zur SVG)
2. Pattern-Bild wird in `<defs><pattern id="wood-pattern">` via
   `<image href>` eingebunden.
3. Zusätzlich wird eine solide Grundfarbe aus `WOOD_BASE_COLORS`
   unter das Pattern gelegt (Fallback für html2canvas).

## Verhältnis zu den Platzhalter-SVGs in `public/assets/components/`

Die inlinen JSX-Pfade in `CanvasPreview.jsx` sind **Nachzeichnungen**
der Geometrie aus `public/assets/components/*.svg`. Sie sind nicht
identisch, aber bewusst so angeordnet, dass sie im 360×760 viewBox
eine erkennbare Bogen-Silhouette bilden. Die Public-SVGs werden aktuell
nur noch für die Wood-Patterns als `<image>`-Quelle benutzt
(`public/assets/wood-patterns/*.svg`).

Sobald echte PNG-Fotos geliefert werden, werden sowohl die inlinen
JSX-Pfade als auch die Public-SVG-Platzhalter durch einen Canvas-
basierten Tint-Renderer ersetzt (siehe `PROJECT_BRIEF.md`).

## Kritische Annahmen (bei Umbau beachten)

1. **PDF-Export** (`src/lib/pdfGenerator.js`) rastert das DOM-Element
   via `html2canvas`. Externe Pattern-Bilder werden dabei manchmal
   nicht aufgelöst — deshalb der solide `woodBase`-Fallback-Pfad.
2. **URL-State-Kompatibilität:** `selections`-Keys und RAL-IDs dürfen
   nicht umbenannt werden, sonst brechen geteilte Links
   (`src/lib/urlState.js`).
3. **5 Streifen → 3 Bänder:** Das Verhalten ist dokumentiert in
   `products.json` und dem Hinweistext darunter. Eine Änderung
   hieran braucht Kunden-Rückfrage (siehe offene Frage im
   Feedback-Doc).
