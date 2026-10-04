# Die Gilde – Browser-Playtest V2

Eigenständiges HTML/CSS/JavaScript-Spiel für Safari im iPhone-Querformat und Desktop. Kein Unity-Build. Keine externen Assets, Server-API oder CDN-Abhängigkeiten.

## Bestehenden GitHub-Pages-Link aktualisieren

1. Dieses ZIP entpacken.
2. Den **Inhalt** ins bestehende Repository auf `main` hochladen und vorhandene Dateien ersetzen. `index.html` bleibt im Hauptverzeichnis; den Ordner `assets/` vollständig mitnehmen.
3. **Settings → Pages:** bisherige Veröffentlichung **Deploy from a branch → main → /(root)** beibehalten. `.nojekyll` liegt im Paket. Kein neuer Workflow nötig.
4. Commit speichern und den GitHub-Pages-Lauf abwarten. Danach den bisherigen Spiel-Link neu laden, auf dem iPhone in Safari im Querformat.

Falls im Repository noch der frühere alternative `deploy-pages.yml`-Workflow aktiv ist, diesen deaktivieren/entfernen, wenn ihr jetzt ausschließlich aus `main / (root)` veröffentlicht. Das V2-Paket enthält absichtlich keinen konkurrierenden Workflow. Es wurde hier nichts zu GitHub hochgeladen und kein Live-Link überprüft.

## Spielen

- Fünf Starter ansehen, genau drei kostenlos auswählen.
- Gruppe erstellen, optional Leiter setzen und Quest starten.
- Nach 60 Sekunden auswerten und XP/Gold/Loot übernehmen. Über Werkzeuge lässt sich die Testuhr um 60 Sekunden vorspulen.
- Danach normal rekrutieren: **50 Gold pro F1-Mitglied**, **25 Gold für fünf neue Kandidaten**. Der erste normale Pool ist kostenlos. Maximal zwölf Mitglieder.
- Roster, Gruppen, Lager und Übungsportal sind direkt in der Halle und unten in der Navigation erreichbar.
- Verstorbene im Roster erst nach deutlicher Bestätigung entfernen. Offene Questbelohnungen vorher abholen. Keine Wiederbelebung.
- Der Probekampf hat keine dauerhaften Folgen für deine Gilde. Pause/1×/2×/4× bleiben verfügbar.

**Kein Save: Neuladen oder Schließen setzt den Spielstand zurück.** Die Veröffentlichung bleibt eine Browser-Probe; Unity bleibt das Hauptprojekt. Details, Tests und Grenzen stehen in `BROWSER_PLAYTEST_V2_REPORT.md`.

## Lokale Prüfungen

Nur für Entwickler, zum Spielen nicht erforderlich:

```sh
node tests/rules.test.cjs
node tests/recruitment-v2.test.cjs
node tests/ui-smoke.test.cjs
node tests/ui-v2.test.cjs
python3 tests/static-v2.test.py
```

Die UI-Tests verwenden einen DOM-Stub, keinen echten Browser. Die beiliegenden Ausgaben dokumentieren tatsächlich ausgeführte Prüfungen, keine Safari- oder Unity-Abnahme.
