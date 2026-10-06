# GuildGame V4.1B – Start

1. ZIP entpacken. Den **Inhalt** einschließlich `index.html`, aller JS-/CSS-Dateien, `assets` und `.nojekyll` in das bestehende GitHub-Repository hochladen. Kein zusätzlicher übergeordneter Ordner.
2. GitHub Pages weiterhin auf **Deploy from a branch → main → /(root)** lassen.
3. Nach dem erfolgreichen GitHub-Pages-Deployment den bisherigen HTTPS-Spiel-Link öffnen und neu laden. Kopfzeile: **V4.1B**. Es wurde hier nichts veröffentlicht und kein neuer Spiel-Link erzeugt.
4. „Neue Angebote“ erzeugt das erste dynamische Board für eine vorhandene Gilde. Alte Angebote und laufende Quests behalten bis dahin ihre bisherigen Werte.

## Vorhandener Spielstand

Am gleichen HTTPS-Ursprung bleiben dieselben localStorage-Keys erhalten. Ein gültiger V4.1A-Save wird beim Laden geprüft und im Speicher nach V2 migriert. Erst beim nächsten Speichern wird V2 geschrieben; der vorherige gültige Primary wird Backup. Vor dem Update kann unter **Werkzeuge → Export** eine eigene Sicherung erstellt werden. Andere Browser, private Sitzungen oder andere Domains teilen den lokalen Spielstand nicht.

Ein V4.1B-Export ist für V4.1B gedacht; V4.1A kann das neue V2-Format nicht lesen. Alte V4.1A-Exporte bleiben in V4.1B importierbar. Bei Speicherfehlern die sichtbare Meldung beachten und den aktuellen Zustand exportieren.

## Neue Angebote

Jedes Board bietet Leicht, Mittel, Schwer und Elite. Der Benchmark berücksichtigt die bis zu sechs stärksten lebenden, genesenen Mitglieder und einen Gilden-Level-Mindestwert. Gruppenwahl ändert ihn nicht. Questwerte bleiben danach fest: Level und Ausrüstung verbessern die Chancen auf dieselbe Quest. „Neue Angebote“ verwendet den aktuellen Fortschritt.

Offline abgelaufene Quests warten weiter auf **Auswerten** und anschließend **Belohnung übernehmen**. Reload zahlt nichts automatisch aus.

## Prüfung

`python3 tests/run-all.py` benötigt Python 3 und Node.js, keine zusätzlichen Pakete. 484 Prüfungen/Checks und 10 Syntaxprüfungen bestanden. DOM-Stubs sind kein Browser- oder iPhone-Test. Kein Unity-Build und keine neue Entwicklungsphase.

Die mitgelieferten älteren V2–V4.1A-Berichte sind historische Prüfstände. Maßgeblich sind die Dateien mit `V4_1B` im Namen.
