# Canvas-Geometrie der Live-Vorschau

Referenz für die Koordinaten, Pfade und Render-Reihenfolge der aktuellen
Platzhalter-Vorschau in `src/components/Preview/CanvasPreview.jsx`. Ziel:
beim späteren Austausch der SVG-Platzhalter gegen echte PNG-Fotos ist
sofort klar, welches Asset an welcher Stelle und in welcher Reihenfolge
landet.

## Koordinatensystem

- Root-SVG `viewBox="0 0 360 760"` (360 breit, 760 hoch)
- Ursprung oben links, Y-Achse nach unten
- Vertikale Mittelachse des Bogens liegt bei **x = 180**
- Alle Pfad-Koordinaten sind absolut im viewBox — keine Einheiten, reine
  SVG-User-Units

## Render-Reihenfolge (hinten → vorne)

Die Reihenfolge entsteht in `useLayerCompositor.js` und wird von
`CanvasPreview.jsx` linear abgearbeitet. Layer weiter unten in dieser
Liste überdecken Layer weiter oben.

1. **Riser** (alle Produkte)
2. **Limb upper** (nur Takedown)
3. **Limb lower** (nur Takedown)
4. **Wedge upper** (nur Takedown)
5. **Wedge lower** (nur Takedown)
6. **Tip upper** (nur Takedown)
7. **Tip lower** (nur Takedown)
8. **Stripes** (alle Produkte, immer ganz vorn)

Für das Produkt `ilf_mittelteil` entfallen Schritte 2–7; gerendert werden
nur Riser und Stripes.

## Layer-Koordinaten

Die folgenden Bounding-Boxes sind im viewBox und beziehen sich auf die
gerenderte Form nach Anwendung von `transform`.

| Layer        | Transform                          | Bounding Box (x, y, w, h) |
| ------------ | ---------------------------------- | ------------------------- |
| Riser        | `translate(140 180)`               | 160, 180, 40, 400         |
| Limb upper   | –                                  | 150, 40, 40, 130          |
| Limb lower   | –                                  | 150, 590, 40, 130         |
| Wedge upper  | `translate(150 160)`               | 150, 164, 44, 18          |
| Wedge lower  | `translate(150 620) scale(1 -1)`   | 150, 598, 44, 18          |
| Tip upper    | `translate(150 20)`                | 156, 24, 32, 34           |
| Tip lower    | `translate(150 720)`               | 156, 724, 32, 34          |
| Stripes      | –                                  | 160, 360, 40, bis 28      |

Stripes: Bis zu drei Bänder übereinander, je 40×6 px, Abstand 10 px.
Bei `stripe_count = 5` werden laut `products.json`-Kommentar dennoch nur
drei Bänder gerendert (repräsentative Darstellung).

## Pfad-Definitionen (aktuelle Platzhalter)

Die Pfade stehen inline in `CanvasPreview.jsx`, nicht in den SVG-Dateien
unter `public/assets/components/`. Die Asset-Dateien sind derzeit nur
Referenz-Vorlagen für die echten Fotos — der Compositor liest sie nicht.

- **Riser** (zwei übereinander liegende Pfade mit identischer Geometrie —
  erster liefert solide Holz-Grundfarbe, zweiter das SVG-Pattern):
  ```
  M30 0 H50 V60 Q60 80 60 120 Q60 160 40 200 Q60 240 60 280
  Q60 320 50 340 V400 H30 V340 Q20 320 20 280 Q20 240 40 200
  Q20 160 20 120 Q20 80 30 60 Z
  ```
- **Limb upper**: `M150 170 Q165 100 170 40 Q175 100 190 170 Z`
- **Limb lower**: `M150 590 Q165 660 170 720 Q175 660 190 590 Z`
- **Wedge** (gilt für beide, lower ist vertikal gespiegelt via `scale(1 -1)`):
  `M0 22 L44 22 L34 4 L10 4 Z`
- **Tip** (oben und unten identisch): `M6 20 Q22 4 38 20 Q36 30 30 34 Q22 38 14 34 Q8 30 6 20 Z`

## Handedness-Mirroring

Bei `handedness === 'LH'` wird am Root-SVG `transform: scaleX(-1)`
gesetzt. Das spiegelt die Komposition an der vertikalen Mittelachse
(x = 180). Keine weiteren Anpassungen pro Layer nötig.

## Holzmuster (Riser)

Der Riser bekommt zwei Füllungen übereinander:

1. Solide Grundfarbe pro Holzart (Fallback, falls das externe Pattern
   nicht lädt — relevant für `html2canvas` beim PDF-Export):
   - `oak` → `#C8A877`
   - `walnut` → `#5C4033`
   - `maple` → `#E8D4A8`
2. SVG-`<pattern>` mit dem Pattern-Bild aus
   `public/assets/wood-patterns/<id>.svg` (128×128 Tile).

## Farbregionen

Jeder Layer bekommt seine Farbe aus dem State (`selections.<option>`).
Zuordnung:

| Layer       | State-Feld          |
| ----------- | ------------------- |
| Riser       | `wood` (Pattern + Grundfarbe) |
| Limb        | `limb_color`        |
| Wedge       | `wedge_color`       |
| Tip         | `tip_color`         |
| Stripes     | `stripe_colors[i]`  |

Die Option `screw_color` ist derzeit **nicht** in der Vorschau
sichtbar (offene Rückfrage an den Kunden, siehe PROCESSED_FEEDBACK.md
Eintrag 6 vom 2026-04-17).

## Austausch gegen echte Fotos

Wenn die transparenten PNGs des Kunden eintreffen:

1. PNGs in `public/assets/components/` ablegen.
2. `CanvasPreview.jsx` umstellen: statt der inline JSX-Pfade die PNGs
   auf einem `<canvas>` zeichnen, per Raster-Tinting einfärben und an
   den oben dokumentierten Bounding-Box-Positionen platzieren.
3. `useLayerCompositor.js` bleibt unverändert — die Layer-Specs sind
   formatunabhängig.
4. Mirroring weiterhin über einen CSS- oder Canvas-Transform auf dem
   Container-Element (nicht pro Layer).
