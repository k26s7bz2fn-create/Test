# AdminTools – Start Here

Basis: **V4.2B Epic Class Visuals**. Neuer sichtbarer Button **Admin / DEV / TEST** neben **Werkzeuge**. Kein URL-Parameter erforderlich.

## GitHub Pages

1. `GuildGame_BrowserPlaytest_AdminTools.zip` vollständig entpacken.
2. Den Inhalt direkt in das Repository-Root auf `main` übernehmen. `index.html`, `.nojekyll`, alle JS-/CSS-Dateien, insbesondere `admin-tools.js`, `admin-ui.js`, `admin-tools.css`, und der vollständige Ordner `assets/` gehören zusammen in die Wurzel.
3. Pages bleibt **Deploy from a branch → main → /(root)**. Kein npm, Buildserver, Backend oder CDN erforderlich.
4. Nach der Bereitstellung die bisherige Spiel-URL neu laden. Der Build zeigt **V4.2B · ADMIN TOOLS 1 · DEVELOPMENT**. Scripts und Styles verwenden `?v=admin1`.
5. Dieselbe Domain/Projekt-URL bewahrt den Zugriff auf den vorhandenen lokalen Save. Das Paket ändert weder Save-Schlüssel noch Save-Schema.

Hier wurde kein Live-Deployment ausgeführt. Ältere Anleitungen im ZIP sind historische Dokumentation; diese Anleitung gilt für den Adminbuild.

## Schnell testen

1. **Admin → Save → Spielstand exportieren**, wenn du vor Änderungen eine Kopie behalten möchtest.
2. Bei einer neuen Gilde zuerst die drei Starter über die normale Rekrutierung wählen.
3. **Ressourcen:** Gold hinzufügen und gewünschtes Gildenlevel setzen. Level 2 schaltet das vorhandene Dungeonportal frei.
4. **Recruitment:** F1-, F5- oder F8-Testkandidat erzeugt jeweils einen neuen gültigen 5er-Pool. F5 hebt die Gilde nötigenfalls auf Level 4, F8 auf Level 5. Anwerben kostet weiterhin den normalen Preis.
5. **Mitglieder:** Verletzungen heilen und Level setzen. Laufende Einsatzbindungen bleiben bestehen. Wiederherstellung toter Registermitglieder ist ein bestätigter DEV-Test und erfordert vorher den Abschluss offener Einsätze/Rewards.
6. **Items:** Common/Uncommon/Rare-Paket oder Rare-Set für ein Mitglied erzeugen, dann über das normale Lager ausrüsten. V4.2B zeigt weiterhin die Klassen-Grundausstattung; keine neue sichtbare Itemvariante.
7. **Quests:** Board erzeugen, Quest und Gruppe wählen, sofort regulär abschließen. Paid-Status ist sichtbar; bezahlte Quests zahlen nicht nochmals. Vorspulen bewegt die gemeinsame Uhr, also auch Erholung und Dungeons.
8. **Dungeon:** Gruppe wählen, starten und Raum/gesamten Lauf vorsimulieren. Der unveränderte Combat entscheidet über Sieg oder Niederlage. Kein garantierter Sieg.
9. **Combat / Animation:** Probekampf oder Testbühne öffnen. Der Walk-Test zeigt die vorhandene V4.2B-Bewegung; ein V4.2C-Fix ist nicht enthalten. Reduced Motion ist ein zusätzlicher, nicht gespeicherter Sitzungsschalter.
10. **Debug Info:** Zustandsübersicht aktualisieren; Rohdaten erscheinen nur auf ausdrücklichen Klick.

## Bestätigungen und Save-Tests

Storage leeren, Mitglieder DEV-only wiederherstellen, Dungeonhistorie löschen, Primary/Backup löschen, Save beschädigen und Neustart benötigen einen zweiten eindeutigen Bestätigungsklick. Abbrechen/Schließen/Tabwechsel verwirft die Bestätigung. Relevante Zustandsänderungen machen sie ungültig; normale laufende Combat-Ticks blockieren die Bestätigung nicht.

**Starterrekrutierung zurücksetzen bedeutet einen vollständig neuen Spielstand.** Die bestehende Save-Struktur erlaubt eine offene Starterrunde nur in einer leeren Gilde. Die Bestätigung warnt vor Verlust von Mitgliedern, Gruppen, Quests, Gold, XP, Inventar und beiden alten Savekopien.

**Save-Löschung oder -Beschädigung pausiert Autosave.** Der Testzustand bleibt bis zum Reload oder **Fortsetzen & aktuellen Stand speichern** erhalten. Weitere speichernde Adminaktionen und Import benötigen zuvor dieses Fortsetzen. Export bleibt möglich. Während der Pause werden laufende Änderungen nicht automatisch gesichert.

**Backup-Fallback testen (Kopie)** prüft gefahrlos eine isolierte Kopie. **Save beschädigen · TEST-ONLY** legt den aktuellen gültigen Zustand als echtes Backup an und beschädigt nach Bestätigung den Primary. Ein Reload verwendet dann den vorhandenen Backup-Ladeweg. Bei einem Speicher-/Tabkonflikt die Fehlermeldung beachten; fehlgeschlagene Adminänderungen werden nicht in die laufende Gilde übernommen.

Absenken des Gildenlevels kann aufgrund vorhandener Mitglieder-/Gruppenlimits oder gespeicherter Quest-/Poolverträge abgelehnt werden. Diese werden nicht stillschweigend entfernt oder umgeschrieben. Dungeonhistorie löschen verwirft auch offene Dungeon-Rewards; bereits gebuchte Ressourcen bleiben bestehen und Dungeon-Test-IDs beginnen neu.

## Prüfstand

**1121 automatisierte Checks in 36 Suiten und 19 JS-Syntaxprüfungen bestanden.** Der Lauf wurde auch im sauber entpackten Paket mit demselben Ergebnis wiederholt. Selbst ausführen: `python3 tests/run-all.py` (Python 3 + Node.js nur für Entwicklerprüfungen).

**Keine echte Browser-/Safari-/iPhone-/FPS-/Unity-Abnahme.** Die Browserdateien für Chromium/WebKit fehlen in der Umgebung. Das Panel ist für iPhone Landscape gestaltet; die tatsächliche Zielgerätebedienung bleibt manuell zu prüfen.

- `ADMIN_TOOLS_REPORT.md`: Funktionen, Folgen, Dateien, Save-Verhalten, Tests und Grenzen.
- `ADMIN_TOOLS_BASELINE_COMPARISON.json`: genaue Änderungen und SHA-256 gegen V4.2B.
- `ADMIN_TOOLS_TEST_OUTPUT.txt`: vollständige tatsächlich ausgeführte Testläufe.

Nur Entwicklungswerkzeuge. Keine neuen regulären Spielregeln und keine Folgephase enthalten.
