# V4.1A Persistent Progression — Start

1. ZIP entpacken. **Den gesamten Inhalt** in den Root des bisherigen GitHub-Pages-Repositories übernehmen, einschließlich `assets/`, `recruitment.js` und `save.js`. `index.html` liegt direkt im Root.
2. Pages bleibt **main / (root)**. Kein npm, Buildserver oder Backend. Nach dem Deployment die bisherige HTTPS-Adresse öffnen; iPhone ins Querformat drehen.
3. Drei Starter kostenlos rekrutieren. Der Statusstreifen zeigt **Lokal gespeichert**. Über **Werkzeuge → Spielstand exportieren** zusätzlich eine JSON-Sicherung herunterladen.
4. Seite neu laden: Mitglieder, Gold, Gruppen, Equipment, Kandidaten und Quests sollen erhalten bleiben. Offline abgelaufene Quests warten auf Auswertung; sie werden nicht automatisch ausgewertet oder bezahlt.
5. In Mitglieder- und Gruppenansicht Level, XP, Stärke und Rollen prüfen. Nach Gildenaufstieg über **Neue Kandidaten suchen** einen neuen Pool erzeugen: höhere Level werden möglich und kosten mehr. Ein bestehender Pool wird nicht kostenlos neu gewürfelt.

**Save-Werkzeuge:** Spiel speichern · Spielstand exportieren · Spielstand importieren · Neue Gilde.

**Wichtig:** Import ersetzt erst nach vollständiger Prüfung die aktuelle Gilde. „Neue Gilde“ verlangt Bestätigung und löscht Primary und Backup. Bei beschädigten Saves wird zuerst ein gültiges Backup verwendet; bei zwei ungültigen Saves wird nichts stillschweigend überschrieben.

Lokale Saves sind an Browser und Website-Origin gebunden. Safari-Privatmodus, gelöschte Websitedaten, Speicherknappheit oder ein Gerätewechsel können lokale Daten verlieren lassen. Deshalb JSON-Exporte sichern. Kein Cloudsave.

Dieses Paket ist ein Browser-Prototyp, kein Unity-Build. Eine echte Safari-/iPhone-Abnahme wurde hier nicht ausgeführt. Beim ersten externen Test zuerst rekrutieren → speichern/exportieren → reloaden; danach einen laufenden Auftrag über einen Reload prüfen.

Entwickler: `python3 tests/run-all.py` mit Python 3 und Node.js. Vollständiger Bericht: `BROWSER_PLAYTEST_V4_1A_REPORT.md`.
