# NEEDS_HUMAN

Hier landen Punkte, die die Automatik nicht allein erledigen kann. Nikolai
zieht nach.

## 2026-04-17 — Google Doc Update (Feedback-Doc)

Das Feedback-Doc lässt sich aus dem Lauf-Environment nur **lesen** (über
`export?format=txt`), aber nicht **schreiben** — es gibt keine Google
Docs API-Credentials. Die folgenden Änderungen am Doc müssen manuell
nachgezogen werden. Alles andere (PRs, Branches, Builds) ist sauber.

### In „Neues Feedback" → nach „In Arbeit" verschieben

Jeweils den Original-Absatz verschieben und den PR-Link als neuen Absatz
direkt darunter anfügen.

1. `[Nikolai] In PDF und E-Mail-Export erscheint "oak" statt "Eiche". Die deutschen Holzart-Namen sollen verwendet werden, nicht die internen IDs.`
   → `→ PR #3: https://github.com/creayl/bogenkonfigurator/pull/3`

2. `[Nikolai] Im PDF-Export fehlt die Silhouette des Mittelteils — nur Wurfarme und Tips sind sichtbar, der mittlere Teil des Bogens fehlt komplett.`
   → `→ PR #4: https://github.com/creayl/bogenkonfigurator/pull/4`

3. `[Nikolai] Die Farbwahl für Wurfarme, Keile und Tips hat keine visuelle Auswirkung in der Vorschau. Die Farbe wird korrekt im State gespeichert und in Link/PDF/E-Mail übernommen, aber der Canvas rendert die Bauteile immer schwarz.`
   → `→ PR #5: https://github.com/creayl/bogenkonfigurator/pull/5`

### In „Neues Feedback" → nach „Rückfragen" verschieben

Alle drei sind `[Frage an Kunden]`-Einträge und warten auf eine
Kunden-Antwort. Keine zusätzliche Rückfrage von der Automatik nötig —
die Fragen sind schon so formuliert, dass der Kunde direkt antworten
kann.

4. `[Nikolai] [Frage an Kunden] Die Fortschrittsanzeige zeigt immer 100%, weil alle Optionen Default-Werte haben. Drei Optionen: (a) ganz entfernen, (b) nur auf Mobile behalten, (c) mitzählen welche Optionen aktiv geändert wurden. Was möchtest du?`

5. `[Nikolai] [Frage an Kunden] Wenn 5 Streifen ausgewählt sind, zeigt die Vorschau nur 3. Soll in der Vorschau ein Hinweistext erscheinen wie "repräsentativ 3 Streifen angezeigt, Bestellung wird mit 5 gefertigt"? Oder reicht die Info im PDF/E-Mail?`

6. `[Nikolai] [Frage an Kunden] Die Schrauben-Farbe ist konfigurierbar, aber in der Vorschau sind keine Schrauben sichtbar. Sind die Schrauben an einer Stelle, die in der stilisierten Vorschau nicht dargestellt wird, oder sollten sie sichtbar sein? Falls sichtbar: wo?`

### Hintergrund / Vorschlag

Wenn dieser Schritt jeden Lauf wiederkehrend manuell ist, lohnt es sich,
den Morgen-Runner mit einem Google-Service-Account auszustatten (Docs
API, `documents.batchUpdate`) oder das Feedback in ein einfacheres
Medium zu verschieben (z.B. GitHub Issues, Notion-DB mit API-Token).
