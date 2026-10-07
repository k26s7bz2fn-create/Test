# GuildGame Browser Playtest V4.3 – Character Identity

Stand: 7. Oktober 2026. **Basis ist das fertige, funktionierende V4.2A-Paket** `GuildGame_BrowserPlaytest_V4_2A_VisualAndFlowFix.zip`. Es wurde separat nach V4.3 entpackt. Das Basis-ZIP und sein Quellverzeichnis bleiben unverändert.

Baseline SHA-256: `c5816ced3af59307b0175503bef13d346d24494e1fa97d0d3ef6fc519c29df34`

## Ergebnis und Prüfstand

V4.3 ergänzt stabile Charaktervarianten, deutlich sichtbare Waffen-, Oberkörper- und Bein-Layer sowie gemeinsame Figuren in der Gruppen- und Equipmentverwaltung. Die Halle zeigt echte Gruppenleiter mit Namen, Gruppe, Klasse und Zustand. Equip-Wechsel sind mit Vorher/Nachher-Abbildungen, alten/neuen Items, Rolleneignung und Stärke nachlesbar. Die bestehende Reise-, Dungeon- und Kampfpräsentation nutzt dieselben Layer.

**930 automatisierte Checks in 32 Suiten bestanden, 0 fehlgeschlagene Testkommandos. Zusätzlich 17 JS-Syntaxprüfungen bestanden.** Alle 28 bisherigen Suiten bleiben enthalten. Vier neue Suiten prüfen Identität/Equipment/Halle, tatsächliche vollständige Script-Komposition, V4.2A-Spielzustände sowie statische Verträge/Assets/Cachepfade. Der vollständige Lauf wird im frisch entpackten ZIP wiederholt; der finale Byteabgleich stellt sicher, dass dieselben Laufzeit- und Testdateien ausgeliefert werden.

**Keine echte Browser-, Safari- oder iPhone-Abnahme. Keine FPS-/Touch-Messung.** Chromium und WebKit wurden über das vorhandene Playwright erneut gestartet; beide Versuche scheiterten an fehlenden Browser-Binaries. DOM-Stubs und SVG-Kompositionsbilder ersetzen keine Browserabnahme. Die lokale statische Layer-Komposition und vorhandenen Atlasbilder wurden visuell angesehen; sie sind keine Browser-Screenshots. GitHub Pages wurde nicht live deployed/geprüft. Kein Unity-/Xcode-Build und keine Unity-Abnahme.

## Explizite Änderungsgrenzen

| Bereich | V4.3 |
|---|---|
| Save-Schema | **Unverändert**, `guildgame.browser.save.v4`; keine neuen persistenten Felder |
| Save/Backup/Import/Export | `save.js` bytegleich zu V4.2A; gleiche Schlüssel und Migrationen |
| Combat Core | **Unverändert**, `combat.js` bytegleich; Golden Vectors weiter ausgeführt |
| Quest-/Dungeon-Regeln | **Unverändert**; einschließlich dynamischer Angebote, V4.2A-Balance, Rewards und Outcomes |
| XP, Guild Level, Recruitmentpreise, Selling | Unverändert |
| Auto-Equip-Entscheidung | Unverändert; nur tatsächliche Vorher/Nachher-Wechsel angezeigt |
| Neue Assets | Neue selbst formulierte **Inline-SVG-Geometrie** für Identität und Equipment; keine neuen Bilddateien, keine externen Assets |
| Vorhandene Bilder | Alle 16 Raster-/SVG-Bilder unverändert; 3,307,802 Bytes insgesamt |
| Zusätzliche Infrastruktur | Keine; statisches HTML/CSS/JS ohne Backend, CDN oder npm |

## Geänderte und neue Dateien

Geänderte Dateien gegenüber dem Basis-ZIP:

- `adventure-hall.js`
- `character-presentation.js`
- `game.js`
- `index.html`
- `tests/assets-v41b.test.py`
- `tests/assets-v42.test.py`
- `tests/assets-v42a.test.py`
- `tests/run-all.py`

Neue Dateien:

- `BROWSER_PLAYTEST_V4_3_REPORT.md`
- `BROWSER_PLAYTEST_V4_3_TEST_OUTPUT.txt`
- `V4_3_BASELINE_COMPARISON.json`
- `V4_3_START_HERE.md`
- `character-identity.css`
- `character-layers.js`
- `tests/assets-v43.test.py`
- `tests/baseline-v43.test.cjs`
- `tests/fixtures/V43_PROVENANCE.md`
- `tests/fixtures/v43-baseline-scenarios.json`
- `tests/fixtures/v43-protected-sha256.json`
- `tests/identity-v43.test.cjs`
- `tests/ui-v43.test.cjs`
- `tests/v43-scenarios.cjs`
- `tests/v43-test-support.cjs`

`character-layers.js` enthält ausschließlich Ableitung, SVG-Markup und Lesedifferenzen. `character-identity.css` ergänzt deren Darstellung und die Equipment-Ansichten. `character-presentation.js` delegiert Identität/Layer an das neue Modul; seine bestehenden `Scene`- und `CombatTimeline`-Implementierungen bleiben **ab `const smooth` bytegleich**. `adventure-hall.js` ergänzt getrennte Ausgangspositionen und lesbare Leader-Zustände. `game.js` verbindet dieselben Figuren mit den Panels, ergänzt Rückmeldungen und entfernt die dekorative Gildenmeisterfigur ohne Character-ID. `index.html` lädt das neue Modul vor dem gemeinsamen Renderer und verwendet durchgehend `?v=4.3`.

In den drei bestehenden Cache-Tests wurde ausschließlich der erwartete Release-Token von `v=4.2a` auf `v=4.3` fortgeschrieben. Keine bisherigen Testfälle oder Assertions wurden gelöscht oder abgeschwächt. Automatische Assetpfad-Schleifen erfassen zusätzlich die beiden neuen Ressourcen. `tests/run-all.py` ergänzt vier Suiten und erfasst das zusätzliche JavaScript bei der Syntaxprüfung.

**35 Dateien sind per SHA-256 gegen V4.2A geschützt**, darunter:

- `rules.js`, `progression.js`, `recruitment.js`, `dynamic-quests.js`, `early-balance.js`;
- `combat.js`, `dungeon.js`, `adventure-flow.js`, `save.js`, `skills.js`;
- `hall.js`, `hall-view.js`, `expedition-presentation.js`;
- alle fünf bisherigen CSS-Dateien und sämtliche Dateien unter `assets/`.

Alle Dateien, Status, Größen und SHA-256 stehen in `V4_3_BASELINE_COMPARISON.json`. Das Manifest und das umschließende ZIP werden nicht rekursiv in sich selbst gehasht. Ältere Berichte und Anleitungen im ZIP bleiben als historische Dokumentation erhalten; der aktuelle Einstieg ist `V4_3_START_HERE.md`.

## Visual Identity

Die vorhandene Character-ID wird mit einem festen FNV-1a-Hash und getrennten Schlüsseln (`hair`, `hair-color`, `cloth`, `tone`, `accessory`, `build`, `phase`) ausgewertet. Keine Zufallsquelle, kein Datum, kein Speichern einer neuen Variante.

- Vier Haar-/Kopfumrisse und vier Haarfarben: dunkel, kupfer, blond, grau.
- Drei kleine Zubehörvarianten: Band, Stoffdetail oder Schließe.
- Drei Helligkeitsvarianten des bestehenden Kopfbereichs.
- Vier Stoff-/Rüstungstöne innerhalb jeder Klassenpalette.
- Leicht variierende Körperbreite und feste Idle-Phase.

Gleiche ID und Klasse ergeben in V4.3 dieselbe Grundoptik. Name, Leben, Level, Rank und Equipment verändern diese Grundidentität nicht. Levelmarkierungen sind davon getrennt. Reload und validierter Save-Import erzeugen dieselben Formen erneut. V4.3 verfeinert die bisherige V4.2A-Optik einmalig; ein alter Save muss dafür nicht umgeschrieben werden. Varianten können bei verschiedenen IDs gleich ausfallen; es wird keine weltweit einzigartige Erscheinung garantiert.

## Klassen und Equipment-Layer

Der vorhandene eigene Richtungsatlas bleibt die Basis. Seine sechs Körperteil-Segmente und drei Blickrichtungen bleiben bestehen. Darüber liegen getrennte SVG-Bereiche, ohne neue Itemdefinitionen:

| Bereich | Quelle | Sichtbare Wirkung |
|---|---|---|
| Base | Character-ID + Klasse | Klassenkörper, Kopf-/Haarvariante, Stoffton, Zubehör und Breite |
| Weapon | `character.gear.Weapon.def` | Schwert, Dolch, Stab oder Streitkolben mit veränderter Klinge, Kopf, Griff und Akzent |
| UpperBody | `character.gear.UpperBody.def` | Brust-/Schulterplatten, Lederweste oder Roben-/Stolenpartien |
| Legs | `character.gear.Legs.def` | Beinschutz/Stiefel oder untere Robe und Saum |

Krieger erhalten breitere Proportionen und Platten, Schurken schmalere Proportionen und Lederflächen, Magier dunklere Roben und arkane Formen, Priester helle Stoffe und unterstützende Symbolik. **Priester zeigen den tatsächlich vorhandenen Streitkolben** des Katalogs; es wird kein Stab erfunden. Freie Slots erzeugen keine ausgerüsteten Layer. Die Kleidung/Rüstung des Basisatlas bleibt als Grundoutfit bestehen, auch ohne Item.

Der vorhandene Katalog hat je eine Waffenfamilie pro Klasse sowie universelle UpperBody-/Legs-Familien, jeweils in Common/Uncommon/Rare. V4.3 nutzt genau diese Definitionen. Zwei verschiedene Instanzen derselben Definition sehen gleich aus. Klassenabhängige Oberkörper-/Beinformen sind eine Darstellung desselben gültigen Items, keine neuen Klasseneinschränkungen.

Common nutzt schlichte Formen und gedeckte Metall-/Stoffflächen. Uncommon ergänzt Nähte, Kanten und dezente grünliche Beschläge. Rare hat andere Klingen-/Waffenköpfe, klarere Kanten, Knieschutz bzw. Robensymbol und kleine Kristall-/Metallakzente. SVG-Flächen sind teilweise transparent, damit Details des bestehenden Atlas erkennbar bleiben. Es gibt keine neue Rarity-Wirkung auf Werte.

Level 1–3 hat keinen Zusatzpunkt; 4–6 einen, 7–9 zwei und 10 drei kleine Rangakzente. Das ist eine reine Ableitung des bestehenden Levels. Rang bleibt F; keine neue Kurve, kein Rang E.

## Konsistenz zwischen Ansichten

Halle, Reise, Dungeon und Probekampf verwenden weiterhin `GuildCharacterPresentation.Scene`. Mitglieder, Recruitment, Gruppenmitglieder, freie Mitglieder, Dungeonvorbereitung, Lager und Vergleich rufen dessen `markup(character)` auf. Alle lesen die autoritative Zuordnung am echten Charakter. Für die ausdrücklich beschriftete Vergleichsvorschau wird eine lokale Kopie mit genau einem vorgeschlagenen Slot verwendet; diese Vorschau rüstet nichts aus.

Equipment/Levelakzente sind Teil der Art-Signatur. Bei Änderung ersetzt die bestehende Scene nur das Artwork im vorhandenen Figurenknoten. Unveränderte Animationen bauen die SVGs nicht in jedem Frame neu auf. Manager/Begleiten verwenden dieselbe ID, dieselbe Ausrüstung und denselben Renderer. Ein Wechsel würfelt keine Figur neu.

## Leader-Regel und Hallendarstellung

Berücksichtigt werden nur Gruppen innerhalb der bestehenden freigeschalteten Gruppenanzahl. Die Gruppe muss Mitglieder haben; ihre Leader-ID muss enthalten sein und zu einem wirklichen Mitglied gehören. Dieselbe ID wird nur einmal dargestellt. Tote Leader werden nicht als lebende Hallenbewohner gezeichnet. Gruppe ohne Leader, leere/ungültige Gruppe und fehlender Charakter erzeugen keine Ersatzfigur.

Neu sichtbare Leader starten verteilt an Gruppentisch, Questbrett, Truhe, Kamin oder Schreibtisch. Danach nutzen sie die vorhandenen rein visuellen Wege/Aktivitäten einschließlich Portal und Sitzplatz. Der Name ist sichtbar; das zweite Label nennt Gruppe, Klasse und Aktivität oder Zustand. Verletzte bekommen einen Ruhe-/Sitz-Zustand. Im laufenden Betrieb kann die kurze Abmarschbewegung noch sichtbar sein, eindeutig als **Im Aufbruch**, ohne normale Hallenaktivität. Nach dem Abmarsch sind gebundene Leader weg; nach Reload eines laufenden Einsatzes erscheint kein neuer Hallenbewohner. Quest- und Dungeonstatus bleiben als bestehende Einsatzkarten sichtbar. Rückkehr und Tod richten sich nach dem vorhandenen autoritativen Ergebnis.

Die statische, animierte Gildenmeisterfigur am Schreibtisch wurde aus dem Hallenmarkup entfernt, weil sie keine echte Character-ID besitzt. Ihr historisches Asset bleibt ungenutzt im Paket. Der Hallenhintergrund enthält keine Personen. Nicht-Leader werden ausschließlich aus der zentralen Hallenpräsentation ausgefiltert. Vollständiger Roster, Recruitment, freie Auswahl, Gruppenbildung, Equipment, Quests, Dungeon und Save bleiben erhalten.

## Equip- und Auto-Equip-Feedback

Vorher/Nachher werden nach der bestehenden Transaktion gelesen. Berichtet werden Slot, ersetztes Item, neues Item, Rarity, Stärke vor/nach dem jeweiligen Slot und Rolleneignung. Gründe: höherer Eignungswert, höhere Rarity bei gleichem Eignungswert, leerer Slot, manuelle Auswahl oder Rückgabe. Die Auswahl bleibt vollständig in den unveränderten Regeln.

Ein kurzer Hinweis zeigt den ersten Wechsel und die Zahl weiterer Wechsel. Eine sichtbare Meldung **„Wechsel ansehen“** bleibt über Navigation und Manager/Begleiten hinweg bestehen. Das Detailfenster zeigt alle Wechsel des letzten Vorgangs, Vorher/Nachher-Figuren und eine Gesamtstärkeänderung pro Charakter. Es kann als gelesen markiert werden. Neue Meldungen ersetzen das vorherige Protokoll; Reload/Import/Neustart löschen diese rein flüchtige Präsentationshistorie.

Abgedeckt sind manuelles Equip/Rückgabe, „Auto-Equip prüfen“, Queststart, Dungeonstart, ältere Reward-/Claim-Pfade und der direkte Quest-/Dungeonabschluss aus V4.2A. Bei gleichzeitigem Levelaufstieg wird der aktuelle Level für beide Equipmentvergleiche verwendet. So wird der Levelbonus nicht als Itemverbesserung ausgegeben; mehrere Slot-Deltas addieren sich korrekt statt denselben Gesamtbonus mehrfach zu melden.

## Save-Kompatibilität

Kein Save-Schema geändert, keine Migration hinzugefügt, kein neues persistentes Identity- oder Feedbackfeld. `save.js` ist bytegleich. V4.1B-Saves durchlaufen weiterhin die vorhandene Migration nach Save v4; IDs, Quests, Rewards, Items und Bestände bleiben erhalten. Identity wird erst beim Zeichnen abgeleitet. Primary-/Backup-Verhalten und Offline-Zeit bleiben unverändert.

## Ausgeführte Tests

| Testbereich | Ergebnis |
|---|---|
| Alle 28 erhaltenen Suiten | Bestanden; Save/Load, Backup, Import/Export, V4.1B Dynamic Quests, V4.2A Flow/Balance, Recruitment, Guild Level, Selling, Vergleich, Questflow, Dungeon/Travel, Combat Golden Vectors, Halle/Animation, lokale Assetpfade/Cache |
| `identity-v43.test.cjs` | 25 Checks: deterministische Variante, echte same-class Unterschiede, Import/Export, alle Slots/Rarities/Klassen, DOM-Art-Update, Hallenfilter, Rückkehr, read-only |
| `ui-v43.test.cjs` | 20 Checks: echte Index-Ladereihenfolge, Managementvollständigkeit, manuelles/automatisches Equip, beide Start-/Abschlussarten, Reload/Import, Verkaufsschutz, Moduswechsel, reduzierte Bewegung |
| `baseline-v43.test.cjs` | 21 vollständige Zustands-/Save-Schreibzahlvergleiche zu tatsächlich ausgeführtem V4.2A |
| `assets-v43.test.py` | 73 Checks: 35 geschützte Dateien, lokale Release-Pfade, SVG/CSS/Source-Verträge; 216 konkrete Katalog-/Richtungs-SVGs erfolgreich geparst |
| Syntax | 17 JavaScript-Dateien bestanden |

Die 21 Baseline-Punkte umfassen Auto-Equip, Verkauf, Rückgabe, Leaderwechsel, dynamische Angebote, Queststart, Beobachten, Pending, direkte und doppelte Abholung, Speichern, Rekrutierung sowie vier Dungeonräume inklusive Boss und Abschluss. Verglichen werden kanonische Hashes des **vollständigen** App-Snapshots einschließlich sämtlicher Gameplayfelder, nicht nur Gold oder eine Teilmenge der Stats. Außerdem muss die Zahl der Save-Schreibvorgänge identisch bleiben. Das belegt die geprüften Abläufe; es ist keine Behauptung einer erschöpfenden Prüfung aller möglichen Spielstände.

Exakte Kommandos und vollständige Ausgaben stehen in `BROWSER_PLAYTEST_V4_3_TEST_OUTPUT.txt`. Testaufruf: `python3 tests/run-all.py` mit Python 3 und Node.js. Diese Werkzeuge sind nur für Entwicklerprüfungen erforderlich, nicht zum Spielen.

## Performance und bekannte Grenzen

Maximal fünf Gruppenleiter nach bestehenden Gildenlimits. Drei Richtungen je Figur; keine zusätzlichen Animationsschleifen. Portraits in Verwaltungslisten sind bewusst still. Die vorhandenen Scene-Knoten, Event-/Partikelgrenzen und Transform-/Opacity-Bewegungen bleiben bestehen. `prefers-reduced-motion` wird weiter beachtet; neue Layer ergänzen keine dauerhaften Partikeleffekte. Keine neuen Rasterdownloads, keine Webfonts oder externen Bilddienste.

SVG-Overlays sind stilisiert und folgen grob den drei Ansichten. Keine exakt angepassten Skins, keine vollständige Skelettanimation, keine neue Gesichtsmodellierung, keine individuell gezeichnete Pose für jedes Item. Der gemalte Klassenkörper bleibt erkennbar; die neuen Kopfvarianten sind Overlays auf diesem Körper. Gelegentliche optische Überlagerungen an Händen, Schultern oder Beinen können besonders bei Bewegung auftreten. Lesbarkeit, Layerausrichtung, Beschneidung und Hallenbelegung müssen auf dem echten iPhone 16 Pro in Safari Landscape noch abgenommen werden. Es wird keine gemessene Bildrate versprochen.

Das Wechselprotokoll ist absichtlich nicht persistent. Nach Reload zeigt die Figur die gespeicherte Ausrüstung, während die vergangene Toast-/Detailmeldung nicht rekonstruiert wird. Bilder vergangener Wechsel sind beschriftete Momentaufnahmen; die Lagerfigur zeigt stets den aktuellen Stand.

## Abgrenzung zur späteren Unity-Version

Dieses ZIP ist ein browserbasierter Präsentations-Playtest. Es enthält HTML/CSS, Inline-SVG und lokale WebP-Atlanten. Eine spätere Unity-Version würde eigene Prefabs, Material-/Mesh-/Sprite-Zuordnungen, Animator-/Skelettdaten und echte Zielgeräteabnahmen benötigen. Diese wurden nicht erstellt oder getestet. Keine echten WoW-/Blizzard-Assets eingeführt, kein Unity-Build, keine neuen Combat-/Quest-/Dungeon-/Wirtschaftssysteme.

V4.3 endet mit diesem Paket. Kein V4.4 und kein weiterer Sprint begonnen.
