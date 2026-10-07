# GuildGame – Admin / Dev Test Panel

Stand: 7. Oktober 2026. Basis ist **V4.2B Epic Class Visuals**, das zuletzt verfügbare funktionierende Paket. Das ZIP wurde separat entpackt und bytegenau geprüft. Es liegt kein V4.2C-Walk-Cycle-Fix in dieser Arbeitsgrundlage vor.

Baseline: `GuildGame_BrowserPlaytest_V4_2B_EpicClassVisuals.zip`  
SHA-256: `b88aecde42abd1cbfea5765a39f5a9f8b69187f22eeaab2378d42c3f6701b2a5`

## Ergebnis und Abnahme

Ein sichtbarer **Admin / DEV / TEST**-Button neben **Werkzeuge** öffnet das eigene Panel **ADMIN / PLAYTEST-WERKZEUGE**. Es ist für den öffentlichen Entwicklungs-Playtest sichtbar; `?admin=1` ist nicht nötig. Es handelt sich nicht um Authentifizierung oder ein finales Spielerfeature.

Das Panel zeigt den Hinweis: „Nur für Entwicklung und schnelles Testen. Änderungen beeinflussen den aktuellen lokalen Spielstand.“ Neun Tabs gliedern die Aktionen. Nur der ausgewählte Bereich wird angezeigt. Buttons sind mindestens 44–48 CSS-Pixel hoch; Querformat-Regeln, horizontal scrollbare Tabs und ein eigener vertikaler Inhaltsbereich sind vorhanden. Native Dialog-Schließung und Abbruch verwerfen offene Bestätigungen.

**1121 automatisierte Checks in 36 Suiten bestanden; zusätzlich 19 JavaScript-Syntaxprüfungen. 0 fehlgeschlagene Testkommandos.** Die 32 bisherigen Suiten sind erhalten. Alle 44 geschützten Regel-, Save-, Präsentations- und Assetdateien sind unverändert gegenüber V4.2B. 21 komplette normale Spielabläufe stimmen einschließlich Save-Schreibzahl exakt mit der ausgeführten V4.2B-Basis überein.

**Keine echte Browser-/Safari-/iPhone-Abnahme. Keine FPS-Messung und kein Unity-Build.** Chromium und WebKit wurden über die vorhandene Playwright-Installation zu starten versucht; beide ausführbaren Browserdateien fehlen. DOM-Stubs prüfen keine Bildschirmdarstellung oder echten Touch. Ein Live-Deployment auf GitHub Pages wurde nicht durchgeführt. Die statischen Pfade und Cachetoken wurden geprüft.

## Funktionen

| Bereich | Umgesetzte Aktionen und Verhalten |
|---|---|
| Ressourcen | +100/+500/+1000 Gold, Gold auf 0; +50/+250 Gilden-XP, XP bis zum nächsten Level, direkt Level 1–5 |
| Mitglieder | Alle Lebenden +1 Level, Auswahl +1, Auswahl auf F10; Verletzungen heilen; Lebende einsatzfähig machen; Tote im Register und Archiv anzeigen; ausgewähltes totes Registermitglied DEV-only wiederherstellen |
| Recruitment | Neuer Pool ohne Goldkosten; neuer F8-Pool; F1-/F5-/F8-Testkandidat in frischem Pool; Mitgliederlimit; bestätigter Starter-Neustart |
| Items | Common-/Uncommon-/Rare-Testloot, passendes Rare-Set für die Auswahl, +5 Heiltränke, Inventar mit freien/getragenen Items, bestätigtes Leeren des freien Storage |
| Quests | Neues Board; leichtes oder starkes dynamisches DEV-Board; Spieluhr +60s; alle aktiven Quests auswertungsbereit; Auswahl sofort regulär abschließen; Ergebnis/Vorschau und paid-Status anzeigen |
| Dungeon | Über Gilden-XP freischalten; Status; Start mit ausgewählter Gruppe; Abschnitt vorsimulieren; bis Entscheidung simulieren, sofern der Kampf gewonnen wird; regulär bis Ende simulieren und abrechnen; bestätigtes Löschen der Dungeonhistorie |
| Combat / Animation | Isolierten Probekampf starten; 1×/2×/4×; Animations- und Walk-Test mit vorhandenen Figuren; Pose wählen; Reduced-Motion-Testmodus |
| Save | Speichern, Export, Import, Status; Primary oder Backup bestätigt löschen; Primary TEST-ONLY beschädigen; Backup-Fallback in isolierter Kopie prüfen; Autosave ausdrücklich fortsetzen; neue Gilde nach Bestätigung |
| Debug Info | Gold, Gilden-XP/-level, Mitglieder/Gruppen/Einsätze und Limits, aktive/pending/paid Quests, aktive Dungeons, gespeicherte SaveVersion, Primary-/Backupzustand, Autosavestatus, Build, Browserkennung, Spieluhr; optional Rohdaten |

### Ressourcen und Mitglieder

Gildenlevel werden über die vorhandenen XP-Schwellen **0 / 80 / 240 / 520 / 1000** gesetzt. Im autoritativen Laufzeitzustand bleibt `guild` ausschließlich `{xp}`. Der bereits vorhandene abgeleitete `guild.level`-Wert im Saveformat bleibt reine validierte Exportmetadaten. Es wird keine zweite Progressionswahrheit eingeführt.

XP bleiben bei maximal 1000; Charaktere bei Rang F und Level 10. Charakter-Levelaktionen setzen die vorhandenen XP-Schwellen, keine neuen Stats oder Kurven. Ein niedrigeres Gildenlevel wird abgelehnt, wenn Mitglieder, Gruppen, Einsatzanzahl oder gespeicherte Pool-/Questverträge damit ungültig würden. Bestehende historische Verträge werden dafür nicht umgeschrieben.

Heilen/„einsatzfähig“ setzt Verletzungszeiten lebender Mitglieder zurück. Laufende Einsatzbindungen sowie HP/Mana eines aktiven Dungeon-Combats bleiben bestehen. Tote müssen separat DEV-only wiederhergestellt werden. Dies ist erst nach Einsatzabschluss und Abholung offener Belohnungen möglich. Ausrüstung wird nicht rekonstruiert oder dupliziert. Archivierte, endgültig entfernte Mitglieder werden angezeigt, aber nicht neu erfunden. Leveländerungen können bewusst spätere Management-Questresultate beeinflussen; die Formel selbst bleibt unverändert.

### Recruitment und Loot

Der normale Pool bleibt auf fünf Kandidaten begrenzt. Jede Testkandidaten-Aktion ersetzt deshalb den bisherigen Pool durch einen neuen gültigen Pool mit frischer Sequenz und vorhandenen ID-Konventionen. **F5** hebt nötigenfalls auf Gildenlevel 4 an, **F8** auf Level 5. Die zusätzlichen Freischaltungen werden am Panel erklärt. F1 verwendet einen gültigen F1-Pool, auch bei höherem aktuellen Gildenlevel. Hohe Pools setzen alle fünf Kandidaten auf F8. Späteres normales Auffrischen verwendet wieder die normalen Levelbereiche und Kosten. Die normale Anwerbung kostet weiterhin den bestehenden Preis.

Testloot verwendet ausschließlich vorhandene Definitionen und neue eindeutige `browser.item.…`-Instanzen. Ein Rarity-Paket enthält vier Klassenwaffen, ein UpperBody- und ein Legs-Item. Ein ausgewähltes Rare-Set enthält die passende Klassenwaffe sowie UpperBody und Legs. Es landet im Storage; Equip/Auto-Equip bleibt der normale separate Weg. Bestehende Suitability-, Verkaufsschutz- und Auto-Equip-Regeln sind unverändert.

**Die V4.2B-Klassenbilder zeigen weiterhin ihre Grundausstattung.** Das Panel erzeugt Testitems, aber implementiert keine individuellen sichtbaren Ausrüstungsbilder oder Rarity-Layer.

### Quests und Dungeon

Neue Boards laufen über den vorhandenen Angebotsweg. Für ein leichtes DEV-Board wird nur die gespeicherte Generierungsbasis auf den kleinsten gültigen Wert des aktuellen Gildenlevels gesetzt. Die vier vorhandenen Schwierigkeitsstufen bleiben bestehen. Ein starkes Board verwendet mindestens 2000 Benchmark-Stärke bzw. das 1,8-Fache der normalen Basis, begrenzt auf den vorhandenen Höchstwert. Die bestehenden versionierten Formeln erzeugen daraus die Angebote; der unveränderte Save-Validator prüft die Ergebnisse. Aktive/pending/resolved/paid Questverträge werden nicht umgeschrieben.

Vorspulen verändert die gemeinsame Spieluhr statt ungültige Start-/Endzeiten einzutragen. Daher laufen **andere Quests, Erholung und Dungeons mit**. „Auswertungsbereit“ zahlt nichts aus. Sofortabschluss startet ein verfügbares Angebot bei Bedarf mit der ausgewählten freien Gruppe und benutzt `finish-quest` einschließlich der bisherigen Ergebnis-, Reward- und Auto-Equip-Wege. Ein bereits bezahltes Ergebnis wird nicht erneut gebucht.

Dungeon-Abkürzungen führen den vorhandenen Combat Core beschleunigt bis zum regulären Ergebnis aus. Ein pausierter ausgewählter Raum wird dafür fortgesetzt. **Kein garantierter Sieg, kein gefälschtes Resultat und keine künstlich gesetzte Decision.** Bei Sieg vor dem Boss entsteht der normale Entscheidungspunkt; bei Niederlage/Tod/TechnicalAbort bleibt dieses Ergebnis erhalten. „Dungeon abschließen“ führt bis zum tatsächlichen Ende und zahlt über `finish-dungeon` höchstens einmal pro Lauf aus. Die tiefen Combat-Replay-Prüfungen bleiben aktiv.

Ein bestätigtes Löschen entfernt die gesamte Dungeonhistorie einschließlich aktiver Läufe und unbeanspruchter Dungeon-Rewards, löst deren Bindungen und löscht zugehörige Ansichtsreferenzen. Bereits gebuchtes Gold/XP und bereits eingetretene Lebensfolgen bleiben erhalten. Der Dungeon-Sequenzzähler startet dabei entsprechend dem bestehenden leeren Schema neu; neue Testläufe können dieselben IDs/Seeds verwenden. Das ist ein ausdrücklich bestätigter DEV-Historienreset, keine erneute Auszahlung eines erhaltenen paid-Laufs. Quests bleiben bestehen.

### Animationstest

Die Testbühne verwendet den vorhandenen gemeinsamen Figurenrenderer und echte vorhandene Charakter-/Kandidaten-IDs. Auswählbar sind Idle, Walk, Attack, Cast, Heal und Down. Der Test zeichnet nur eine Figur und nutzt die bestehende Frame-Schleife. Verwaltungsdaten, Combat und Save werden dadurch nicht verändert.

**Kein neuer Walk-Cycle wurde produziert.** Der Walk-Test zeigt die vorhandene Ganzkörper-/Dreiansichtenbewegung aus V4.2B und benennt diese Grenze im Panel. Reduced Motion lässt sich für die aktuelle Sitzung zusätzlich aktivieren; die Systemeinstellung bleibt wirksam. Dieser Schalter wird nicht im Save gespeichert. Kein neues Animations- oder Gameplay-System begonnen.

## Bestätigungen und gefährliche Aktionen

| Aktion | Bestätigung / Schutz |
|---|---|
| Freies Storage leeren | Löscht nur freie Ausrüstung und unzugewiesene Tränke; angelegte Items bleiben erhalten |
| Totes Mitglied wiederherstellen | DEV-only-Hinweis, keine gebundenen Mitglieder oder offenen Rewards, keine Itemverdoppelung |
| Dungeonstate löschen | Warnt vor Historien-/Rewardverlust, Freigabe und Neustart der Test-IDs |
| Primary löschen | Autosave pausiert danach; Backup bleibt unangetastet |
| Backup löschen | Autosave pausiert danach; Primary bleibt erhalten |
| Save beschädigen | Gültige aktuelle Kopie wird zuerst als Backup vorbereitet; nur Primary absichtlich ungültig |
| Neue Gilde | Löscht bisherigen Zustand und beide Savekopien und schreibt eine gültige leere Gilde |
| Starterrekrutierung zurücksetzen | **Vollständiger Neustart**, ausdrücklich so bestätigt; das unveränderte Saveformat erlaubt eine offene Starterrunde nur ohne bestehende Mitglieder/Poolhistorie |

Bestätigungen gelten nur einmal für genau die vorbereitete Aktion/Auswahl. Abbruch, Schließen oder Tabwechsel verwerfen sie. Relevante zwischenzeitliche Zustandsänderungen machen die Bestätigung ungültig. Reguläre Tick-/Zeitfortschritte eines laufenden Combats sind von diesem Vergleich ausgenommen, damit eine Bestätigung nicht alle 250 ms verfällt; Mitglieder, Inventar, Statusübergänge und Rewards bleiben geschützt. Ein selbst übergebenes `confirmed=true` am normalen UI-Button umgeht diese Bestätigung nicht.

## Transaktionen und Save-Verhalten

Der Adminpfad lautet: **Arbeitskopie erzeugen → bestehende Regeln ausführen/DEV-Werte setzen → vollständigen Save einschließlich Dungeon-Replay validieren → speichern → laufenden Zustand und UI übernehmen**. Schlägt eine Vorbereitung, Validierung oder Speicherung fehl, wird der vorbereitete Zustand nicht in die laufende Gilde übernommen. Eine sichtbare Fehlermeldung erklärt den Grund. Regeln und Formeln werden nicht überschrieben.

Admin-Speicherzugriffe werden zunächst im Arbeitsspeicher vorbereitet. Primary und Backup werden vor dem Schreiben mit dem bekannten Stand verglichen; Änderungen aus einem anderen Tab blockieren die Aktion. Bei einem Schreibfehler wird versucht, die zuvor vorhandenen Savewerte wiederherzustellen. Die Tests prüfen einen Fehler nach Änderung des Backups sowie den Erhalt beider alten Werte. Sollte auch die Rücknahme durch gesperrten Browser-Speicher scheitern, bleibt der Laufzeitzustand unverändert, weitere Schreibzugriffe werden gesperrt und die Meldung verlangt Export/Reload. **localStorage bietet keine native Transaktion über zwei Schlüssel**; eine unbedingte Rücknahmegarantie bei gleichzeitig ausfallendem Speicher wird nicht behauptet. Außer dem ausdrücklich bestätigten Korruptionstest werden nur vollständig validierte Saves geschrieben.

Normale Aktionen verwenden weiterhin den vorhandenen Store. Erfolgreiche zustandsändernde Adminaktionen speichern und aktualisieren die UI. Lesetests, Animation, Export und bereits bezahlte No-op-Abschlüsse schreiben keinen unnötigen Save. Save-Löschung/-Beschädigung ist eine bewusste Ausnahme: Danach wird Autosave für diese Sitzung pausiert, damit der Test nicht sofort durch einen automatischen Schreibzugriff aufgehoben wird. Der aktuelle Spielstand kann weiter exportiert werden. „Fortsetzen & aktuellen Stand speichern“ schreibt die gegenwärtige Arbeitskopie ausdrücklich zurück. Import oder weitere speichernde Adminaktionen bei pausiertem Speicher erfordern zuvor dieses Fortsetzen; Reload lädt normal Primary/Backup und beendet die Sitzungspause.

Der nicht destruktive **Backup-Fallback-Test** arbeitet mit einer isolierten Kopie und beschädigtem Test-Primary. Er verändert weder echte Savekopien noch den laufenden Zustand. Der separate bestätigte Korruptionsknopf erlaubt zusätzlich den realen Reload-Test des bestehenden Backup-Loaders.

**Save-Schema unverändert: `guildgame.browser.save.v4`.** Keine neuen persistenten Adminfelder, keine neue Migration. Vorhandene V4.1B-Migrationen, Import-/Exportstruktur, Item-/Charakter-IDs und Save-Schlüssel bleiben erhalten. `save.js` ist bytegleich.

## Dateien

Geändert gegenüber V4.2B:

- `game.js`
- `index.html`
- `tests/assets-v41b.test.py`
- `tests/assets-v42.test.py`
- `tests/assets-v42a.test.py`
- `tests/assets-v42b.test.py`
- `tests/run-all.py`

Neu:

- `ADMIN_TOOLS_BASELINE_COMPARISON.json`
- `ADMIN_TOOLS_REPORT.md`
- `ADMIN_TOOLS_START_HERE.md`
- `ADMIN_TOOLS_TEST_OUTPUT.txt`
- `admin-tools.css`
- `admin-tools.js`
- `admin-ui.js`
- `tests/admin-model.test.cjs`
- `tests/admin-test-support.cjs`
- `tests/admin-ui.test.cjs`
- `tests/assets-admin.test.py`
- `tests/baseline-admin.test.cjs`
- `tests/fixtures/ADMIN_PROVENANCE.md`
- `tests/fixtures/admin-baseline-scenarios.json`
- `tests/fixtures/admin-protected-sha256.json`

`admin-tools.js` enthält die isolierten DEV-Transaktionen, Save-Absicherung und den Inspector. `admin-ui.js` enthält Tabs, Auswahl, Bestätigung und Testbühne. `admin-tools.css` gestaltet das Panel. `game.js` verbindet den Adminadapter mit dem laufenden Zustand und extrahiert lediglich den vorhandenen Probekampfstart zur Wiederverwendung; der Combat Core bleibt unverändert. `index.html` ergänzt Button, eigenen Dialog und lokale Script-/Stylepfade.

In den vier vorhandenen Asset-/Cachetests wurde ausschließlich der erwartete Release-Token von `v=4.2b` auf **`v=admin1`** fortgeschrieben. Keine alten Testfälle oder Assertions wurden entfernt oder abgeschwächt. Der Runner ergänzt vier neue Suiten. Sämtliche historischen Dokumente bleiben im ZIP; aktuelle Einstiegspunkte sind die `ADMIN_TOOLS_…`-Dateien.

44 Dateien sind per SHA-256 geschützt: alle Regel-, Progressions-, Recruitment-, Quest-, Dungeon-, Save-, Hallen- und Charakter-/Expeditionsmodule außer dem UI-Einstieg `game.js`, die sechs bisherigen CSS-Dateien und alle 22 bisherigen Asset-/Metadateien. Keine neuen Bilder, Modelle oder fremden Assets wurden eingeführt. Die genaue Liste und sämtliche Dateihashes stehen im Baselinevergleich.

## Tests

| Prüfung | Ergebnis |
|---|---|
| Unveränderte V4.2B-Basis | Bereits geprüft: 937 Checks / 32 Suiten / 17 JS-Syntaxprüfungen; Basisbytes erneut verglichen |
| 32 erhaltene Suiten im Adminpaket | 955 Checks bestanden; zusätzliche Checks stammen aus automatisch mitgeprüften neuen Ressourcenpfaden |
| Admin-Modell/Speicher | 34 Checks: Ressourcen/XP, Grenzen, Heilung/Restore, Pool-/Kaufregeln, alle Loot-Slots/Rarities, Boards, Zeit, Idempotenz, Dungeon-Replays, bestätigte Resets, Quota/Rollback, Tabkonflikt, Savepause/Fallback |
| Admin-UI, tatsächliche Index-Komposition | 20 Checks: Öffnen/Schließen, Tabs, Speicherfeedback, normale Loops, Gegenstände, Confirm-Abbruch/-Replay/-Staleness, fehlgeschlagene Speicherung, Export/Import, Savekorruption/Reload, Starter-Neustart, Dungeon, Testbühne, Inspector |
| V4.2B-Baselinevergleich | 21 exakte vollständige App-Snapshots und Save-Schreibzahlen identisch ohne Adminnutzung |
| Neue statische Checks | 91 Checks: 44 geschützte Dateien, lokale Pfade/Cache, Struktur, Bestätigungs- und Speicherverträge, Touch-/Querformat-Regeln, keine zusätzlichen Assets/Netzabhängigkeiten |
| JavaScript-Syntax | 19 Laufzeitdateien bestanden |

Die erhaltenen Suiten umfassen Save/Load/Backup/Import/Export, V4.1B Dynamic Quests, Recruitment, Guild Level, Selling, Item Comparison, Quest-/Dungeon-/Travel-Flows, Combat Golden Vectors, Hallen-/Animationsmodelle und statische Asset-/GitHub-Pages-Cachepfade. Der vollständige Lauf wurde zusätzlich im sauber entpackten Auslieferungs-ZIP mit 1121 bestandenen Checks und 19 bestandenen Syntaxprüfungen wiederholt. Die vollständigen Ergebnisse stehen im Testoutput.

Testaufruf: `python3 tests/run-all.py` mit Python 3 und Node.js. Beide werden nur zum Prüfen benötigt, nicht zum Spielen. Der DOM-Stub simuliert Daten-/Eventabläufe und Speicherung, keine echte Browser- oder Gerätebedienung.

## Grenzen und Bereitstellung

Das Paket läuft statisch mit relativen Pfaden auf **GitHub Pages, `main / (root)`**. Kein Backend, Buildserver, npm-Zwang oder CDN. Alle Script-/Styleverweise tragen `?v=admin1`. Es wurde kein Live-Deployment ausgeführt.

Offen bleibt die echte Safari-/iPhone-16-Pro-Landscape-Abnahme: Panelhöhe bei sichtbarer Browserleiste, Tabscrollen, Dialogfokus, Dateidialoge, Touch und Testbühne. Keine gemessene Bildrate. Die dargestellten Klassen und ihr vorhandenes Grundoutfit wurden nicht verändert. Keine neue Laufanimation, kein Unity-Build und keine neue reguläre Gameplayregel.

Der Adminbutton ist für jeden Nutzer dieses öffentlichen Entwicklungsbuilds sichtbar und wirkt auf dessen lokalen Spielstand. Es gibt keine Serverkonten oder Autorisierungsschicht. Keine wirtschaftlichen, Combat-, Quest-, Cloudsave- oder Multiplayer-Systeme ergänzt. **Nach diesem Paket stoppen; keine Folgephase begonnen.**
