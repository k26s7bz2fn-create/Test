# V4.2 – Start Here

1. Den bisherigen V4.1B-Spielstand in **Werkzeuge → Spielstand exportieren** sichern. Bei gleicher Origin benutzt V4.2 die vorhandenen lokalen Schlüssel; andere Domain/Browser benötigen JSON-Import.
2. ZIP entpacken. **Den Inhalt** mit `index.html`, `.nojekyll`, allen JS-/CSS-Dateien und `assets/` in die GitHub-Repository-Wurzel übernehmen. Keine zusätzliche äußere Unterordnerebene anlegen.
3. GitHub Pages mit Branch **main**, Verzeichnis **/(root)** betreiben. Bestehende Pages-URL öffnen und neu laden. Alle Script-/Stylesheetlinks verwenden `?v=4.2`. Dieses Paket wurde noch nicht veröffentlicht.
4. V4.2 öffnen: vorhandene Mitglieder, Gruppen, Gold, XP, Equipment und Questfortschritt prüfen. V1/V2-Saves werden über die erhaltene Migrationskette nach V3 übernommen. Ein Browserwechsel übernimmt keinen localStorage automatisch.
5. Eine freie Gruppe mit echtem Leiter wählen. Eine normale Quest starten, eine mögliche Risikowarnung beachten und **Manager-Modus** wählen. Der Leiter verlässt die Halle. Quest bis Pending laufen lassen, auswerten und Rewards einmal übernehmen.
6. Eine weitere normale Quest mit **Abenteuer begleiten** starten. Reise und Zielszene ansehen, mit **Zur Gilde** zurück und über **Abenteuer ansehen** wieder einsteigen. 0/1/2/4 steuert hier nur die Reiseanimation; die Questzeit läuft weiter.
7. Gilden-Level 2 erreichen oder einen eigenen entsprechenden Save importieren. Hallenportal öffnen → **Dungeon vorbereiten**. Empfehlung: vier gesunde Mitglieder mit Tank und Heilung, Management-Stärke etwa 650. Combatwerte bleiben klassenbasiert; die UI erklärt dies.
8. **Die Goblinmine** im Manager-Modus starten. **Expedition ansehen** öffnen, zwischen Liveansicht und Halle wechseln. Hier steuert 0/1/2/4 die Combatzeit; eine ausdrücklich gewählte Pause bleibt auch in der Halle bestehen.
9. Nach dem ersten Sieg wartet die Gruppe. Zuerst **Dungeon verlassen** und die gesicherte Beute testen. In einem weiteren Run **Weiter** wählen, Elite und Boss ansehen. Keine automatische Weiterentscheidung; HP werden mitgenommen, Mana startet pro Raum neu.
10. Nach Dungeonende Rewards übernehmen, anschließend erneut öffnen/reloaden und prüfen, dass Gold, XP und Loot nicht erneut gebucht werden. Zurückkehrende lebende Leiter erscheinen am Portal; Tote kehren nicht lebend zurück.
11. Mit **Werkzeuge → Spiel speichern / Spielstand exportieren** sichern. Reload während Reise, Encounter, Zwischenentscheidung, Boss sowie vor/nach Reward prüfen. Offline läuft höchstens der aktuelle Dungeon-Encounter bis zur nächsten Entscheidung weiter. Es wird offline nichts automatisch abgeholt.
12. Auf dem iPhone 16 Pro quer testen: Figuren, Touchziele, Seitenleisten, Safe Areas, Portal, Reduced Motion und FPS tatsächlich ansehen. Diese Geräteabnahme wurde hier nicht ausgeführt; DOM-Stubs ersetzen sie nicht.

Lokaler Test: im entpackten Ordner `python3 -m http.server 8000` starten und im Browser `http://localhost:8000` öffnen. Dieser Server ist nur eine lokale Testhilfe; die Website selbst benötigt kein Backend. Tests: `python3 tests/run-all.py` mit Python 3 und Node.js.

**Sicherungen:** Ein Speicherfehler wird sichtbar gemeldet. Vorhandene gültige Saves werden geschützt; bei Quota-/Stale-Tab-Fehlern nicht auf einen erfolgreichen Autosave vertrauen. Das 2-MiB-Limit bleibt erhalten. Keine absichtliche Save-Rückwärtskompatibilität zu V4.1B nach einer V4.2-Dungeonbuchung; für einen Rückwechsel die vorher exportierte V4.1B-Datei verwenden.

Aktueller Einstieg ist diese Datei. Ältere im ZIP enthaltene Berichte dokumentieren historische Versionen. Die Lieferung endet bei V4.2.
