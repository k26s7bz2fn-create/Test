# V4.2A – Start Here

1. **Vor dem Update den aktuellen Save exportieren:** Werkzeuge → Spielstand exportieren. V4.2A schreibt Save V4; für einen späteren Rückwechsel zu V4.2 brauchst du den vorherigen Export.
2. ZIP entpacken und dessen **Inhalt** mit `index.html`, `.nojekyll`, allen JS-/CSS-Dateien und `assets/` in die Repository-Wurzel übernehmen. GitHub Pages bleibt **main / (root)**. Kein npm, Buildserver oder Backend. Es wurde hier nichts veröffentlicht.
3. Bestehende Pages-URL neu laden. Die Script-/Stylesheetreferenzen verwenden `?v=4.2a`; die neuen Bilder haben neue Dateinamen. Auf derselben Browser-Origin wird der lokale Save übernommen; in einem anderen Browser/auf anderer Domain den JSON-Export importieren.
4. Mitglieder, Gruppen, XP, Gold und Equipment prüfen. **Alte Quests behalten absichtlich ihre alten Werte.** Für die neue Balance „Neue Angebote“ wählen. Neue Mittelquests empfehlen mindestens 470 Stärke, Schwer 760, Elite 1150.
5. Mit einer frischen Dreiergruppe zunächst Leicht spielen. Ohne neue Items wird Mittel bei ungefähr Level 3–4 sinnvoller; bessere Ausrüstung hilft. Die Startergruppe erhält bei Mittel eine deutliche Warnung. Dies ist keine Siegegarantie.
6. Eine Quest **begleiten**: neue Blickrichtungen, Schritte, Bodenkontakt, Perspektive und dezente Umgebungsbewegung ansehen. „Zur Gilde“ und „Abenteuer ansehen“ ändern den Ausgang nicht. 0/1/2/4 steuert bei normalen Reisen nur die Animation.
7. Am Questende öffnet sich das Ergebnis direkt in der Reise. **„Quest abschließen“** übernimmt Auswertung und Belohnung gemeinsam und kehrt in die Halle zurück. Kein erneuter Gang über die Questliste.
8. Eine Quest im **Manager-Modus** beenden lassen. Die hervorgehobene Hallenmeldung **„Ergebnis ansehen & abschließen“** bucht in einem Klick und zeigt den bereits bezahlten Beleg.
9. Ab Gilden-Level 2 die **Goblinmine** testen. Zwischenräume bleiben bei „Weiter / Dungeon verlassen“ stehen. Erst das endgültige Ende bzw. ein bewusster Rückzug führt zum direkten **„Dungeon abschließen“**. Dieselbe Aktion ist aus der Hallenmeldung erreichbar.
10. Reload während Reise und offenem Ergebnis testen: Begleiten/Manager und die Ergebnisreferenz werden wiederhergestellt. Ein offenes Pending-Ergebnis bleibt unbezahlt. Danach abschließen, erneut laden und erneut versuchen: keine doppelte Belohnung.
11. Auf **iPhone 16 Pro / Safari / Landscape** Proportionen, Bewegung, Touchziele, Nebel/Licht und Reduced Motion prüfen. Diese echte Geräte-/FPS-Abnahme wurde hier nicht durchgeführt; es wird keine gemessene 60-FPS-Zahl behauptet.

Lokal: im entpackten Ordner `python3 -m http.server 8000`, dann `http://localhost:8000` öffnen. Das ist nur eine Testhilfe, kein Backend der Website. Automatisierte Tests: `python3 tests/run-all.py` mit Python 3 und Node.js.

Speicherfehler bleiben sichtbar. Bei Quota-/Stale-Tab-Fehlern nicht von einem gelungenen Autosave ausgehen; den Stand exportieren und den Fehler beachten. Das vorhandene 2-MiB-Limit bleibt erhalten. Alte Berichte im ZIP sind historisch; maßgeblich sind die V4.2A-Dateien. Keine Folgephase begonnen.
