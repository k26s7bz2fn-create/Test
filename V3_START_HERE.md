# Browser-Playtest V3 · Living Hall

1. ZIP entpacken. **Den gesamten Inhalt** in das bisherige GitHub-Repository hochladen: `index.html` liegt direkt im Repository-Root, `assets/` bleibt ein Unterordner. Auch `hall.js`, `hall-view.js` und `living-hall.css` hochladen.
2. GitHub → Settings → Pages → Deploy from a branch → **main / (root)**. Keine Build-Pipeline erforderlich.
3. Nach Abschluss des GitHub-Pages-Deployments den bereits bestehenden Spiel-Link in Safari öffnen. Bei alten Grafiken die Seite neu laden. Es wurde hier keine Veröffentlichung vorgenommen und kein neuer Link erzeugt.
4. iPhone ins Querformat drehen. Über Rekrutierung drei Starter wählen. Danach sieht man die tatsächlichen Mitglieder in der Halle; Einrichtungen und die untere Navigation öffnen die Verwaltungsansichten.
5. Gruppe erstellen, Quest starten, kurze Abreise ansehen. Am Questbrett nach Ablauf auswerten und anschließend die Belohnung übernehmen. Überlebende kehren nach der Auswertung zurück. Unter Werkzeuge kann die bestehende Playtest-Uhr um 60 Sekunden vorgerückt werden.

**Kein Save:** Neuladen beginnt eine neue Gilde. Eigenständiger Browser-Prototyp, kein Unity-/WebGL-Build.

Details und Prüfgrenzen: `BROWSER_PLAYTEST_V3_LIVING_HALL_REPORT.md`. Die mitgelieferten V1-/V2-Berichte und Ausgaben sind historische Dokumente.

Entwicklerprüfung optional: `python3 tests/run-all.py` mit installiertem Python 3 und Node.js. Der Spielbetrieb benötigt beides nicht.
