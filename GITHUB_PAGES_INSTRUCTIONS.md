# In wenigen Schritten zum iPhone-Playtest

1. ZIP **entpacken**. Auf GitHub ein neues **öffentliches Repository** mit Branch **main** erstellen (z. B. mit einer README initialisieren). Der veröffentlichte Playtest ist öffentlich erreichbar.
2. **Add file → Upload files:** den gesamten entpackten Inhalt ins Repository-Hauptverzeichnis hochladen und mit **Commit changes** auf `main` speichern. **Nicht das ZIP oder einen umschließenden Ordner hochladen.** `index.html` muss direkt oben liegen. Wichtig: `.github/workflows/deploy-pages.yml` und `.nojekyll` mitnehmen; Punktdateien können ausgeblendet sein.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions** wählen. Keine Branch-Veröffentlichung auswählen.
4. **Actions → Deploy Browser Playtest to GitHub Pages → Run workflow → Branch: main → Run workflow.** Spätere Änderungen auf `main` starten die Veröffentlichung automatisch.
5. Auf den grünen erfolgreichen Lauf warten. Den HTTPS-Link unter **Settings → Pages → Visit site** oder beim Environment **github-pages** im Workflow öffnen. Auf dem iPhone in **Safari im Querformat** spielen.

**Workflow fehlt?** Über **Add file → Create new file** den Namen `.github/workflows/deploy-pages.yml` eingeben, den Inhalt der gleichnamigen Paketdatei einfügen und auf `main` speichern. Falls `.nojekyll` beim Upload fehlt, ebenfalls als Datei anlegen; ihr Inhalt ist ohne Bedeutung.

**Erster Test:** drei Kandidaten rekrutieren → Gruppe erstellen → Quest starten → auswerten → Rewards übernehmen. Werkzeuge können die Questuhr um 60 Sekunden vorspulen. **Kein Save: Neuladen setzt die Gilde zurück.**

Vorbereitet und lokal auf relative Pfade geprüft; **noch nicht auf GitHub veröffentlicht oder in GitHub Actions ausgeführt**. Es gibt daher noch keinen bestätigten Spiel-Link. Kein Unity-Build, keine Gameplay-Änderung, Sprint 12 nicht begonnen.

Workflow nach offizieller GitHub-Dokumentation vorbereitet:
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
