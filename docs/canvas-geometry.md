# Canvas-Geometrie der Bogen-Vorschau

Referenz für die Inline-SVG-Vorschau in
[`src/components/Preview/CanvasPreview.jsx`](../src/components/Preview/CanvasPreview.jsx).
Kurz und zweckgebunden — Ziel ist, dass Folge-Edits am Layout nicht blind
raten müssen. Sobald echte Foto-Assets (PNG) eintreffen, wird der Compositor
umgebaut (siehe `PROJECT_BRIEF.md` → "When photos arrive") und dieses Dokument
entsprechend überarbeitet.

## ViewBox & Koordinatensystem

- Root-`<svg>`: `viewBox="0 0 360 760"`
- Einheiten: SVG-User-Units (pixel-äquivalent, skaliert per CSS `w-full`)
- Ursprung oben links, Y wächst nach unten
- Horizontale Symmetrie um `x = 170` (Riser-Mittellinie)
- Takedown-Gesamthöhe ca. `y = 20` (oberer Tip) bis `y = 740` (unterer Tip)
- ILF-Mittelteil ohne Limbs/Wedges/Tips — nur Riser + Stripes sichtbar

## Layer-Reihenfolge (Render-Order)

Baut der `useLayerCompositor`-Hook als Array auf, von hinten nach vorne
gerendert (erste Einträge sind unterste SVG-Ebene):

| # | Layer     | Nur bei Takedown | Quelle im Spec       |
|---|-----------|------------------|----------------------|
| 1 | `riser`   | nein             | `{ woodPattern, woodBase }` |
| 2 | `limb`    | ja (upper)       | `{ position: 'upper', color }` |
| 3 | `limb`    | ja (lower)       | `{ position: 'lower', color }` |
| 4 | `wedge`   | ja (upper)       | `{ position: 'upper', color }` |
| 5 | `wedge`   | ja (lower)       | `{ position: 'lower', color }` |
| 6 | `tip`     | ja (upper)       | `{ position: 'upper', color }` |
| 7 | `tip`     | ja (lower)       | `{ position: 'lower', color }` |
| 8 | `stripes` | nein             | `{ count, colors[] }` |

Die Reihenfolge ist wichtig: Limbs sitzen sichtbar **vor** dem Riser (sonst
verschwindet die Wedge in der Riser-Silhouette), Tips sitzen vor den Limbs,
Stripes liegen obenauf.

## Layer-Koordinaten

Alle Werte sind die absoluten Ankerpunkte im Root-`viewBox`, nachdem die
lokalen `transform="translate(...)"`-Offsets angewendet wurden.

### Riser (`RiserLayer`)

- `transform="translate(140 180)"`
- Lokale Pfadhöhe 400, Breite 40 → belegt im Root `x∈[140,200]`, `y∈[180,580]`
- Zwei Pfade auf identischer Geometrie:
  1. `data-color-region="wood-base"` — solide Fallback-Füllung (`woodBase`
     aus `WOOD_BASE_COLORS` in `useLayerCompositor.js`). Bleibt sichtbar,
     wenn html2canvas im PDF-Export das Pattern-Bild nicht auflöst.
  2. `data-color-region="wood"` — SVG-`<pattern>`-Fill mit der
     Holz-Textur-SVG (`/assets/wood-patterns/<id>.svg`).

### Limbs (`LimbLayer`)

Pro Position ein Pfad, ohne umschließendes `translate` (Koordinaten sind
bereits absolut):

- Upper: `M150 170 Q165 100 170 40 Q175 100 190 170 Z` → `x∈[150,190]`, `y∈[40,170]`
- Lower: `M150 590 Q165 660 170 720 Q175 660 190 590 Z` → `x∈[150,190]`, `y∈[590,720]`

Schließt jeweils direkt an Riser-Oberkante (180) bzw. Riser-Unterkante (580) an.

### Wedges (`WedgeLayer`)

Sitzt sichtbar an der Außenkante des Risers, wo der Limb ansetzt.

- Upper: `transform="translate(150 160)"` → `x∈[150,194]`, `y∈[164,182]`
- Lower: `transform="translate(150 620) scale(1 -1)"` → gespiegelt,
  sitzt an der unteren Riser-Kante

Pfad lokal: `M0 22 L44 22 L34 4 L10 4 Z` (Trapez, 44 breit, 18 hoch).

### Tips (`TipLayer`)

Müssen innerhalb des viewBox liegen (historischer Bug: oberer Tip lag bei
`y = -110` und war unsichtbar; daher strikte Ankerwahl).

- Upper: `transform="translate(150 20)"` → `x∈[156,188]`, `y∈[24,54]`
- Lower: `transform="translate(150 720)"` → `x∈[156,188]`, `y∈[724,754]`

Pfad lokal: `M6 20 Q22 4 38 20 Q36 30 30 34 Q22 38 14 34 Q8 30 6 20 Z`.

### Stripes (`StripesLayer`)

- Rechteck-Reihe ab `x = 160`, Breite `40`, Höhe `6`, vertikaler Abstand `10`
- Start-Y: `baseY = 360` (Grip-Region in Riser-Mitte)
- `bandCount = Math.min(selections.stripe_count, 3)` — laut Konfig-Kommentar
  und Kundenfrage werden 5 Streifen repräsentativ als 3 dargestellt.

## Links-/Rechtshand-Spiegelung

`state.selections.handedness === 'LH'` setzt `mirror = true`. Implementiert
als CSS-Transform auf dem äußeren `<svg>`:

```jsx
style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
```

Wichtig: Die Spiegelung findet **nicht** im SVG-Koordinatensystem statt,
sondern auf dem gerenderten Element. Dadurch spiegeln auch die
Wood-Pattern-Kacheln mit und der gesamte Bogen wirkt als Einheit.

## Farb-Pipeline

1. `useLayerCompositor` liest `selections.*_color` (RAL-IDs) aus dem State
2. `ralToHex(ralId)` (aus `src/lib/ralColors.js`) übersetzt in `#rrggbb`
3. Jedes Layer-Spec bekommt das Hex als `color`-Property
4. `CanvasPreview`-Subkomponenten setzen `fill={color}` direkt auf den Pfad
5. `data-color-region`-Attribute (auf den Pfaden) markieren den späteren
   Tinting-Hook für reale PNG-Fotos — aktuell dekorativ

Wood ist Sonderfall: statt `fill="<hex>"` wird ein `<pattern>`-Fill mit
`url(#wood-pattern)` verwendet, das Pattern lädt die Holz-SVG via `<image>`.

## PDF-Rasterung

`pdfGenerator.generatePdf` rastert das an `CanvasPreview` via `ref`
übergebene DOM-Element mit `html2canvas({ scale: 2, useCORS: true })`. Zwei
Implikationen für die Geometrie:

- Alles außerhalb `viewBox 0 0 360 760` fällt im PDF weg (vgl. Tip-Bug oben).
- Externe SVG-Pattern-Referenzen können nicht immer aufgelöst werden —
  darum der doppelte Riser-Pfad mit `woodBase` als sichtbarer Fallback.

## Asset-Quellen

Die SVG-Shapes in der Komponente sind an die Platzhalter-Assets in
`public/assets/components/*.svg` angelehnt, aber **inline nachgebaut** —
nicht per `<image href="...">` referenziert. Beim Austausch gegen echte
Foto-Assets (PNG) verschwindet der Inline-Pfad-Ansatz komplett und wird
durch Canvas-Tinting auf Rasterbildern ersetzt (siehe
`PROJECT_BRIEF.md` → "When photos arrive").
