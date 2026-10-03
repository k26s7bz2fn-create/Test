# GitHub-Pages-Vorbereitung – Prüfstand

- Einstieg index.html direkt im Repository-Hauptverzeichnis.
- 5 lokale HTML-Abhängigkeiten vorhanden und relativ; Auflösung auch unter einem Repository-Unterpfad geprüft.
- Keine localhost-, lokalen Dateipfad- oder Server-API-Abhängigkeiten in den Websitequellen gefunden. Eingebettetes SVG/Favicon benötigt keinen Download.
- Workflow-YAML geparst; Push auf main und manueller Start definiert.
- Statische Vorbereitungsbefehle des Workflows lokal tatsächlich ausgeführt: Exitcode 0; sechs Website-Dateien plus .nojekyll im Deployment-Verzeichnis.
- Alle 11 Dateien des ursprünglichen Browser-ZIPs bytegleich übernommen. Keine Gameplay-Änderung.
- Neu: .github/workflows/deploy-pages.yml, .nojekyll, GITHUB_PAGES_INSTRUCTIONS.md, dieses Prüfprotokoll.
- Nur Website-Dateien werden veröffentlicht; Tests und Dokumentation verbleiben im Repository.
- GitHub-Actions-/Pages-Deployment nicht ausgeführt. Kein bestätigter Spiel-Link. Safari/iPhone in diesem Durchlauf nicht getestet.
- Historische Testausgabe im Originalpaket unverändert; in diesem Durchlauf keine erneute Gameplay-Testausführung.
- Sprint 12 nicht begonnen.

Quelle für offizielle Actions-Versionen und Pages-Konfiguration (abgerufen 2026-10-03):
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
