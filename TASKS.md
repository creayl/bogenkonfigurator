# Bogenkonfigurator — Backlog & Log

Fallback-Backlog, wenn das Feedback-Doc keine offenen Punkte hat. Offene
Punkte als `- [ ] …` anhängen, abgearbeitete als `- [x] …` markieren,
nicht umsetzbare mit `- [!] …` inkl. kurzer Begründung.

## Offene Aufgaben

- [x] Canvas-Geometrie dokumentieren (Koordinaten, Render-Reihenfolge) —
      niedrige Priorität, sobald echte Assets kommen ohnehin Umbau.
      Erledigt: `docs/canvas-geometry.md` (2026-04-21).

## Log

### 2026-04-21

- Gelesen: 6 Feedback-Einträge im Doc, alle bereits in
  `PROCESSED_FEEDBACK.md` vermerkt → keine neuen Hashes.
- Fallback auf TASKS.md: einzigen offenen Backlog-Punkt
  "Canvas-Geometrie dokumentieren" abgearbeitet.
- Umgesetzt:
  - `docs/canvas-geometry.md` — ViewBox, Layer-Reihenfolge,
    Koordinaten aller Layer, Spiegelung, Farb-Pipeline,
    PDF-Rasterungs-Hinweise.
- Nächster sinnvoller Schritt: warten, bis die drei offenen
  `[Frage an Kunden]`-Einträge vom 2026-04-17 (Fortschrittsanzeige,
  5 Streifen, Schrauben) im Doc beantwortet werden.

### 2026-04-17

- Gelesen: 6 Feedback-Einträge (alle von Nikolai im Abschnitt „Neues
  Feedback"), 0 Antworten auf Rückfragen (Abschnitt war leer).
- Umgesetzt:
  - PR #3 — Deutsche Holzart-Namen in PDF/E-Mail
    (`feedback/2026-04-17-deutsche-holzart-namen`)
  - PR #4 — Mittelteil-Silhouette im PDF-Export
    (`feedback/2026-04-17-riser-pdf-silhouette`)
  - PR #5 — Farbwahl für Wurfarme/Keile/Tips im Canvas sichtbar
    (`feedback/2026-04-17-bauteil-farben-sichtbar`)
- Nach Rückfragen verschoben (geplant, manuelle Doc-Pflege nötig —
  siehe NEEDS_HUMAN.md):
  - `[Nikolai] [Frage an Kunden] Fortschrittsanzeige zeigt immer 100%…`
  - `[Nikolai] [Frage an Kunden] 5 Streifen in Vorschau als 3 angezeigt…`
  - `[Nikolai] [Frage an Kunden] Schrauben-Farbe ohne sichtbare Schrauben…`
- Abgelehnt: –
- Nächster sinnvoller Schritt: Nikolai zieht Doc-Updates nach (PR-Links
  unter die drei umgesetzten Einträge, Fragen in „Rückfragen"-Abschnitt
  verschieben). Sobald der Kunde die drei offenen Fragen beantwortet,
  kann der nächste Lauf die Folgeänderungen umsetzen.
