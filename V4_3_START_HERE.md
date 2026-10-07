# V4.3 – Start Here

Basis: **V4.2A Visual & Flow Fix**, als separates V4.3-Paket erweitert.

## Spielen / GitHub Pages

1. `GuildGame_BrowserPlaytest_V4_3_CharacterIdentity.zip` vollständig entpacken.
2. Den **Inhalt** in die Wurzel des vorhandenen Repositorys auf `main` übernehmen. `index.html`, `.nojekyll`, die JavaScript-/CSS-Dateien und `assets/` müssen zusammen im Root liegen. Keinen zusätzlichen ZIP-Ordner darüberlegen.
3. GitHub Pages bleibt auf **Deploy from a branch → main → /(root)** eingestellt. Kein npm, Buildserver oder Backend nötig.
4. Nach dem GitHub-Pages-Lauf die bestehende Spiel-URL neu laden. Der Kopf zeigt **CHARACTER IDENTITY · V4.3**. Alle HTML-Script-/Stylesheet-Referenzen verwenden `?v=4.3`.
5. Auf dem iPhone 16 Pro Safari im Querformat öffnen. Die bereits vorhandene Domain/Projekt-URL weiterverwenden, damit derselbe lokale Save zugänglich bleibt. V4.3 löscht ihn nicht.

Es wurde hier kein Live-Deployment ausgeführt. Die Einstellung `main / (root)` bleibt die vorgesehene Bereitstellung. Für lokale Tests kann ein einfacher statischer HTTP-Server im entpackten Ordner verwendet werden; im fertigen Spiel gibt es keine Serverabhängigkeit.

## Was sich sichtbar geändert hat

- In der Halle wohnen **Gruppenleiter**. Ohne echte Leader-ID bleibt sie leer; der dekorative Gildenmeister ist entfernt.
- Mitgliederverwaltung, freie Gruppenauswahl und Recruitment bleiben vollständig. Neue Portraits auch in Gruppen- und Equipmentansichten.
- Feste Haar-/Kopf-, Farb-, Zubehör- und Körpervarianten pro ID.
- Ausgerüstete Waffen, Oberkörperteile und Beinteile/Robensäume sind eigene sichtbare Layer. Common, Uncommon und Rare unterscheiden sich in Form und Detail.
- Manuelles Equip und Auto-Equip zeigen Wechsel an. Über **„Wechsel ansehen“** sind alte/neue Items, Stärke, Grund und Vorher/Nachher-Figuren nachlesbar.
- Derselbe Charakter bleibt in Halle, Reise, Dungeon, Probekampf und Panels wiedererkennbar.

## Kurzer visueller Abnahmelauf auf dem Zielgerät

1. Bestehenden Save laden oder drei Mitglieder rekrutieren. Unter **Gruppen** eine Gruppe bilden und ausdrücklich einen Leader setzen. Nur der echte Leader erscheint in der Halle. Leader leeren/wechseln und Mitgliederlisten vergleichen.
2. In **Lager** ein vorhandenes kompatibles Item vergleichen. „Aktuell“ und „Vorschau“ kontrollieren. Ausstatten: Figur, Itemname, Rarity und Stärke müssen zusammen wechseln. Mit Weapon, UpperBody und Legs wiederholen, soweit Items vorhanden sind.
3. „Auto-Equip prüfen“ sowie einen Quest-/Dungeonstart testen. Wenn die unveränderte Logik etwas wechselt, muss „Wechsel ansehen“ erscheinen. Ohne verfügbares besseres Item wird kein Wechsel erfunden.
4. Gruppe begleiten und in den Manager-Modus wechseln. Während des Einsatzes kein normaler Hallen-Leader; Reise/Kampf zeigen dieselbe ID und Ausrüstung. Nach Abschluss kehren lebende Leader zurück; Verletzte ruhen, Tote erscheinen nicht lebendig.
5. Abschluss übernehmen und tatsächliche Loot-/Auto-Equip-Meldungen prüfen. In Mitglieder- und Equipmentansicht vergleichen.
6. Speichern, neu laden und über **Werkzeuge → Export/Import** denselben Save zurückladen: ID und Optik bleiben gleich. Das rein flüchtige Wechselprotokoll wird nach Reload nicht wiederhergestellt.
7. Ein freies Item verkaufen: getragene Ausrüstung bleibt erhalten. Ausgerüstete Items werden nicht als frei verkaufbare Lageritems angeboten.
8. In Safari auf Lesbarkeit, Schultern/Beine/Waffengriff, Hallenpositionen und Scrollbarkeit achten; anschließend „Bewegung reduzieren“ prüfen.

Keine zusätzlichen Testitems oder Cheats wurden ins Spiel eingebaut. Unterschiedliche Instanzen derselben Itemdefinition sehen gleich aus. Die Grundkleidung des Klassenatlas bleibt auch ohne Ausrüstung sichtbar.

## Save und Regeln

**Save-Schema v4 unverändert.** Keine neue Migration. V4.1B-Saves verwenden weiterhin den bestehenden Migrationspfad. Keine Änderungen an Combat, Quests, Dungeon, Rewards, Recruitment, Levelkurve, Selling oder Auto-Equip-Auswahl.

## Tests und Lieferumfang

**930 automatisierte Checks / 32 Suiten / 17 JS-Syntaxchecks bestanden.** Vollständiger Lauf mit `python3 tests/run-all.py` (Python 3 + Node.js nur für Tests). Zusätzlich sauber entpacktes ZIP geprüft.

**Keine echte Safari-/iPhone-/Browserabnahme und keine Unity-Abnahme.** Die Playwright-Browserdateien sind in der Arbeitsumgebung nicht vorhanden; Ergebnisse sind Modell-, DOM-Stub-, SVG-/Asset- und Syntaxprüfungen. Keine gemessenen FPS.

- `BROWSER_PLAYTEST_V4_3_REPORT.md`: Änderungen, Regeln der Darstellung, Tests und Grenzen.
- `V4_3_BASELINE_COMPARISON.json`: Dateivergleich und SHA-256 zu V4.2A.
- `BROWSER_PLAYTEST_V4_3_TEST_OUTPUT.txt`: vollständige Prüfprotokolle.

Ältere Berichte im ZIP dokumentieren frühere Stände. Für dieses Paket gelten diese Startanleitung und der V4.3-Bericht.
