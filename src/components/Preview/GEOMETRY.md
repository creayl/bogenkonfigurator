# Canvas-Geometrie der Bogen-Vorschau

Diese Notiz dokumentiert die Platzhalter-Geometrie, die `CanvasPreview.jsx`
rendert. Gedacht als schneller Lookup, bevor die echten PNG-Assets eintreffen
(vgl. `PROJECT_BRIEF.md`, Abschnitt "When photos arrive"): sobald der
Compositor auf gerasterte Bilder umgestellt wird, kann diese Datei weg — die
Layer-Specs aus `useLayerCompositor.js` sind bereits renderer-agnostisch.

## Koordinatensystem

- Einheit: SVG-User-Units, 1 Unit = 1 CSS-Pixel im unskalierten Zustand.
- viewBox: `0 0 360 760` — Hochformat, Bogen steht vertikal.
- Ursprung: linke obere Ecke. Y wächst nach unten.
- Linkshand (`handedness === 'LH'`): `transform: scaleX(-1)` auf dem
  Root-`<svg>` — spiegelt die gesamte Szene. Einzelne Layer kennen die
  Händigkeit nicht.

## Vertikale Zonen (y von oben nach unten)

| y-Bereich | Layer              | Absolute Koord. (grob)      |
| --------- | ------------------ | --------------------------- |
|  24 –  54 | Tip oben           | translate(150 20), d ~34×30 |
|  40 – 170 | Limb oben          | Pfad direkt in viewBox      |
| 162 – 182 | Wedge oben         | translate(150 160)          |
| 180 – 580 | Riser (Mittelteil) | translate(140 180), d 400h  |
| 360 – 386 | Stripes            | überlagern den Riser-Griff  |
| 598 – 616 | Wedge unten        | translate(150 620) + flipY  |
| 590 – 720 | Limb unten         | Pfad direkt in viewBox      |
| 724 – 754 | Tip unten          | translate(150 720)          |

Alle Bauteile liegen x-zentriert um ~170 (leichte Asymmetrie der
Platzhalter-Pfade ist beabsichtigt – signalisiert sofort "Dummy", nicht
fertiges Foto).

## Render-Reihenfolge (hinten nach vorne)

Siehe `useLayerCompositor.js` – Reihenfolge laut `PROJECT_BRIEF.md`:

1. **Riser** (Mittelteil inkl. Holz-Pattern, Fallback-Grundfarbe)
2. **Limbs** — oben, unten
3. **Wedges** — oben, unten
4. **Tips** — oben, unten
5. **Stripes** (ganz vorne, überlagern den Riser-Griff)

Der Riser wird mit zwei deckungsgleichen Pfaden gezeichnet: erst solide
Holz-Grundfarbe (`wood-base`), dann das externe Pattern als
`fill="url(#wood-pattern)"`. Grund: `html2canvas` (PDF-Export) löst externe
Bild-Referenzen innerhalb eines SVG-`<pattern>` nicht zuverlässig auf — die
Grundfarbe garantiert eine sichtbare Silhouette, auch wenn das Pattern fehlt.

## Händigkeits-Spiegelung

Nur eine Transformation, nur eine Stelle: `scaleX(-1)` auf dem `<svg>`.
Layer selber sind agnostisch. Wer ein neues Layer hinzufügt, muss keine
LH/RH-Variante bauen.

## Streifen-Besonderheit

Bei `stripe_count === 5` rendert der Preview trotzdem nur **3 Streifen**
(`bandCount = Math.min(count, 3)`). Das ist bewusst so (vgl. Kunden-Feedback,
`products.json`: `"Bei 5 Streifen zeigt die Vorschau eine repräsentative
Darstellung mit 3 Streifen."`). Ob ein Hinweistext dazu eingeblendet werden
soll, ist aktuell eine offene Frage an den Kunden (siehe
`PROCESSED_FEEDBACK.md`, Eintrag 5).

## Wenn echte Assets kommen

- `RiserLayer` / `LimbLayer` / `WedgeLayer` / `TipLayer` durch `<image>`-Tags
  (oder einen Canvas-Tint-Helper) ersetzen. Geometrie-Daten hier sind dann
  obsolet.
- `useLayerCompositor.js` bleibt unverändert: Layer-Specs sind bereits
  renderer-unabhängig.
- Diese Datei dann löschen — die Foto-Assets dokumentieren sich selbst.
