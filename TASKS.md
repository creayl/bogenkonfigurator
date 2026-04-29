# Bogenkonfigurator — Backlog & Log

Fallback-Backlog, wenn das Feedback-Doc keine offenen Punkte hat. Offene
Punkte als `- [ ] …` anhängen, abgearbeitete als `- [x] …` markieren,
nicht umsetzbare mit `- [!] …` inkl. kurzer Begründung.

## Offene Aufgaben

_Aktuell keine offenen Aufgaben im Backlog. Nächster Lauf zieht aus dem
Feedback-Doc._

## Log

### 2026-04-29

- Feedback-Doc: keine neuen Einträge (alle 6 Hashes bereits in
  `PROCESSED_FEEDBACK.md`). Die 3 Kunden-Rückfragen vom 2026-04-17
  warten weiterhin unbeantwortet im Doc — bis dahin keine
  Folgeumsetzung möglich:
  - `Fortschrittsanzeige zeigt immer 100%` — Optionen a/b/c offen
  - `5 Streifen werden als 3 angezeigt` — Hinweistext ja/nein offen
  - `Schrauben-Farbe ohne sichtbare Schrauben in Vorschau` — wo
    sichtbar / nicht darstellbar?
- Fallback (TASKS.md-Backlog): ebenfalls leer.
- Ergebnis: Leerlauf protokolliert, kein Summary-Issue, kein PR.
- Branch: `claude/magical-ride-0T0Em`

### 2026-04-19

- Feedback-Doc: keine neuen Einträge (alle 6 Hashes bereits in
  `PROCESSED_FEEDBACK.md`, 3 Kunden-Rückfragen warten weiter auf
  Antwort).
- Fallback aus TASKS.md abgearbeitet:
  - `docs/canvas-geometry.md` angelegt — Koordinaten, Render-Reihenfolge,
    Transforms und Farbfluss für den Preview-Compositor dokumentiert.
  - Branch: `claude/magical-ride-z766J`

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
