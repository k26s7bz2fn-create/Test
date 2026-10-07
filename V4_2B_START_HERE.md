# V4.2B – Start Here

**Epic Class Visuals**, auf der geprüften V4.2A-Basis. Der Gildenmeister am Schreibtisch bleibt erhalten.

## Statisch starten / GitHub Pages

1. `GuildGame_BrowserPlaytest_V4_2B_EpicClassVisuals.zip` vollständig entpacken.
2. Den **Inhalt** in die Wurzel des vorhandenen Repositorys auf `main` übernehmen. `index.html`, `.nojekyll`, die JS-/CSS-Dateien sowie der komplette Ordner `assets/` müssen zusammen im Root liegen. Das ZIP enthält keinen zusätzlichen äußeren Projektordner.
3. GitHub Pages bleibt bei **Deploy from a branch → main → /(root)**. Kein Buildserver, Backend, npm oder CDN nötig.
4. Nach dem Pages-Lauf die Spiel-URL neu laden. Die Versionsanzeige lautet **EPIC CLASS VISUALS · V4.2B**. Scripts und Styles referenzieren `?v=4.2b`; die neuen Klassenbilder liegen unter `assets/epic/`.
5. Für bestehende lokale Saves dieselbe Domain/Projekt-URL verwenden. Vor dem eigenen Deployment kann der bestehende Save über die vorhandene Exportfunktion gesichert werden. V4.2B ändert weder Save-Schlüssel noch Schema.

Hier wurde kein Live-Deployment ausgeführt. Ein lokaler statischer HTTP-Server kann zum eigenen Testen verwendet werden; für den Betrieb auf GitHub Pages ist kein eigener Server erforderlich.

## Was neu ist

- Vier zusammengehörige epische Klassenbilder: Krieger, Schurke, Magier, Priester.
- Je drei Ansichten mit transparentem Hintergrund, erwachsenen Proportionen und deutlicher Grundausstattung.
- Gemeinsame Darstellung in Halle, Mitgliedern, Recruitment, Gruppen, Equipment, Questbegleitung, Dungeon und Probekampf.
- Einheitliches Seitenverhältnis, fußverankerte kleine Idle-Bewegung und stille Verwaltungs-Portraits.
- Gildenmeister und Leader-/Navigationslogik aus V4.2A bleiben erhalten.

**Ausrüstung ist sichtbar als Klassen-Grundoutfit.** Ausgerüstete Items und Werte funktionieren unverändert; individuelle Weapon-/UpperBody-/Legs-Bilder sind erst strukturell vorbereitet. Ein Itemwechsel tauscht in diesem Paket noch keine Bildteile aus. Vollständige Geh- und Kampfanimationszyklen sind ebenfalls noch nicht enthalten.

## Kurze eigene Sichtprüfung

1. Mitglieder oder Recruitment öffnen: alle vier Klassenbilder kontrollieren. Falls eine Klasse nicht im aktuellen Pool ist, einen bereits vorhandenen passenden Charakter verwenden; es wurden keine Testmitglieder oder Cheats hinzugefügt.
2. Eine Gruppe mit einem echten Leader verwenden. In der Halle dessen Silhouette und den Gildenmeister am Schreibtisch prüfen.
3. Gruppenverwaltung, freie Mitglieder und Truhe öffnen: Figuren sollen zusammenpassen; keine Mitglieder fehlen. In der Truhe erklärt der Hinweis das Grundoutfit.
4. Ein verfügbares kompatibles Item vergleichen und ausrüsten. Itemname, tatsächliche Zuordnung und Stärke müssen wechseln. Das neue Klassen-Grundbild bleibt derzeit gleich.
5. Quest oder Dungeon begleiten, zur Halle zurückkehren und erneut beobachten. Klassenbild und Farbvariante bleiben konsistent; der Leader steht während des Einsatzes nicht normal in der Halle.
6. Optional einen Probekampf starten, anschließend Save/Reload und vorhandenen Export/Import testen. IDs, Items und Regeln bleiben erhalten.
7. Auf dem iPhone 16 Pro mit Safari im Querformat Größe, Lesbarkeit, Verdeckung, Scrollbarkeit und Touchflächen prüfen. Anschließend „Bewegung reduzieren“ kontrollieren.

Diese Schritte sind eine noch offene manuelle Zielgeräteabnahme, kein hier behauptetes Testergebnis.

## Prüfergebnis und Dateien

**937 automatisierte Checks / 32 Suiten / 17 JS-Syntaxprüfungen bestanden.** Vollständige Prüfung mit `python3 tests/run-all.py` (Python 3 + Node.js, nur für Entwicklung). Der Lauf wurde auch aus dem sauber entpackten Paket wiederholt.

**Keine echte Browser-/Safari-/iPhone-, FPS- oder Unity-Abnahme.** Chromium und WebKit fehlen in der Ausführungsumgebung. Kein Live-Pages-Deployment.

- `BROWSER_PLAYTEST_V4_2B_REPORT.md`: tatsächlicher Umfang, neue Assets, Änderungen, Tests und Grenzen.
- `V4_2B_BASELINE_COMPARISON.json`: Dateivergleich mit SHA-256 zur V4.2A-Basis.
- `BROWSER_PLAYTEST_V4_2B_TEST_OUTPUT.txt`: ausgeführte Prüfkommandos und vollständige Ausgaben.
- `assets/epic/EPIC_ASSETS.json`: Maße, Referenz-/Bildhashes, genaue Prompts und Vertrag für spätere Varianten.

Ältere Berichte im ZIP sind historische Dokumentation. Für dieses Paket gelten die V4.2B-Startanleitung und der V4.2B-Bericht. Save-Schema v4 und bestehende V4.1B-Migration bleiben unverändert. Keine neue Phase Bestandteil dieses Pakets.
