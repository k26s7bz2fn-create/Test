# GuildGame Browser Playtest V4.2B – Epic Class Visuals

Stand: 7. Oktober 2026. Dieses Paket setzt ausschließlich den Auftrag **V4.2B Epic Class Visuals** um. Verbindliche technische Basis: **V4.2A Visual & Flow Fix**, separat aus dem funktionierenden ZIP entpackt und vor Änderungen bytegenau geprüft. Die verworfene V4.3-Darstellung wurde nicht als Laufzeitbasis übernommen. Der Gildenmeister am Schreibtisch bleibt erhalten.

Baseline: `GuildGame_BrowserPlaytest_V4_2A_VisualAndFlowFix.zip`  
SHA-256: `c5816ced3af59307b0175503bef13d346d24494e1fa97d0d3ef6fc519c29df34`

## Ergebnis

Vier neu erzeugte, zusammengehörige Klassenatlanten ersetzen die bisherigen segmentierten Heldenbilder im gemeinsamen Renderer. Das nachgereichte, abgestimmte Kriegerbild `image(1).png` war direkt verfügbar und wurde visuell geprüft sowie als Bildreferenz für alle vier Generierungen verwendet. Schurke, Magier und Priester verwendeten zusätzlich den neu erzeugten Kriegeratlas als Stilreferenz.

Die neuen Figuren zeigen plastische Metallkanten, dicke Stofflagen, Leder, erwachsene Proportionen und eine klare Klassen-Grundausstattung. Die Stilvorgabe orientiert sich am ungefähr 6¾ Köpfe hohen Referenzdesign. Das ist ein gestalterisches Ziel, keine vermessene Anatomiegarantie. Die drei Ansichten jeder Klasse wurden gemeinsam erzeugt, anschließend proportional exportiert und in kleiner Spielgröße visuell angesehen.

**937 automatisierte Checks in 32 Suiten bestanden, zusätzlich 17 JavaScript-Syntaxprüfungen. 0 fehlgeschlagene Testkommandos.** Alle 28 bisherigen Suiten bleiben enthalten. Ein zweiter vollständiger Lauf wurde im sauber entpackten Auslieferungs-ZIP mit demselben Ergebnis ausgeführt; die tatsächlichen Ergebnisse stehen im Testoutput.

**Keine echte Browser-, Safari-/iPhone-, FPS- oder Unity-Abnahme.** Die vorhandene Playwright-Installation konnte Chromium und WebKit wegen fehlender ausführbarer Browserdateien nicht starten. Es wurden Modell-/DOM-Stub-Tests, statische Asset-/Pfadprüfungen und eine direkte Sichtprüfung der exportierten Bilder ausgeführt. Die Kontaktansicht der Atlanten ist kein Browser-Screenshot. GitHub Pages wurde nicht live deployed.

## Neue Klassenassets und Stilangleichung

| Klasse | Neue Datei | Lesbare Grundausstattung | Erscheinung |
|---|---|---|---|
| Krieger | `assets/epic/warrior.webp` | Langes Schwert, schwere Platte | Stahl, warme Bronzekanten, roter Stoff; kräftiger Frontkämpfer |
| Schurke | `assets/epic/rogue.webp` | Zwei Dolche, Leder, Stiefel | Dunkles Petrol/Anthrazit; schlankere, bewegliche Silhouette |
| Magier | `assets/epic/mage.webp` | Arkaner Stab, Robe, kleiner Fokusglanz | Indigo/Violett; klare Caster-Silhouette |
| Priester | `assets/epic/priest.webp` | Zeremonieller Streitkolben, helle Gewänder, Heillicht | Elfenbein/Gold; ruhige Support-Silhouette |

Der Priester nutzt einen zum vorhandenen Klassenkatalog passenden Streitkolben. Es wurde keine neue Waffenfamilie, Klasse oder Itemdefinition angelegt.

Alle vier Atlanten haben echten Alphakanal und **1200 × 640 Pixel**. Jeder enthält drei Zellen mit **400 × 640 Pixeln**: Dreiviertelansicht, Seitenansicht, hintere Dreiviertelansicht. Die Winkel sind gemalte/generierte Annäherungen; keine exakt gerenderte 3D-Drehung. Einheitlicher Fußpunkt: **(200, 612)**. Alle Figuren und Waffen wurden innerhalb der Zellränder exportiert. Die Bilder wurden ausschließlich für den technischen Export zugeschnitten, gleichmäßig skaliert und als WebP kodiert; keine nachträglich gemalten Polygonrüstungen.

Neue Bilddaten zusammen: **679,250 Bytes**. Sämtliche neuen und historischen Bilder im ZIP zusammen: **3,987,052 Bytes**, unter 4 MiB. Die vier neuen Bilder benötigen unkomprimiert etwa 11,7 MiB RGBA-Speicher; tatsächlicher GPU-/Browserverbrauch wurde nicht gemessen.

`assets/epic/EPIC_ASSETS.json` dokumentiert Referenzhash, genaue Generierungs-Prompts, Quell-/Exporthashes, Zuschnitte, Zellmaße und Erweiterungsvertrag. Neue Originalgenerierungen, keine übernommenen WoW-/Blizzard-Assets, keine externen Bilddienste zur Laufzeit.

## Integration und Proportionen

`epic-class-visuals.js` ist ein ausschließlich lesender Darstellungsadapter. `character-presentation.js` verwendet ihn für die vier Heldenklassen; Gegner bleiben beim bestehenden Renderer. Derselbe Adapter wird über die vorhandene Scene in Halle, Questbegleitung, Dungeon und Trainingskampf verwendet. Mitglieder-, Recruitment-, Gruppen-, freie Mitglieder-, Dungeonvorbereitungs- und Equipmentansichten erhalten dieselben Klassenbilder.

Das Seitenverhältnis 400:640 bleibt sowohl in Szenen als auch in Portraits erhalten. Die bisherige ID-abhängige Streckung der Heldenkörper wird nicht auf die neuen Bilder angewendet. Die Figurenhöhe wird aus der Bühnenhöhe abgeleitet: 42 %, begrenzt auf 98–202 CSS-Pixel vor den bestehenden perspektivischen Skalierungen. Dadurch werden die Figuren gegenüber der bisherigen 36-%-Ableitung etwas größer. Hallentiefe, Wege, Verdeckung, Untergrenzen für Touchflächen und sonstige Navigation bleiben aus V4.2A erhalten. Die tatsächliche Wirkung mit Hallenhintergrund auf dem iPhone muss noch geprüft werden.

Die bestehende deterministische leichte Farbverschiebung und Idle-Phase aus der Character-ID bleiben erhalten. Reload und Import würfeln diese nicht neu. **Es gibt zunächst eine gestaltete Person pro Klasse**, keine neuen individuellen Gesichter, Geschlechter-, Frisuren- oder Körpermodelle. Das Paket ist der Klassenvisual-Pass, kein vollständiges Character-Customization-System.

## Ausrüstung: vorbereitet, noch keine austauschbaren Bildteile

Waffen, Brust-/Oberkörperkleidung und Bein-/Robenpartien sind sichtbar und klassentypisch ausgearbeitet. In diesem Paket gehören sie jedoch zum **zusammenhängenden Grundbild**. Ein Equip-Wechsel verändert weiterhin korrekt die autoritative Ausrüstung, Vergleiche und Stärke, aber **noch nicht die Waffe, Brust oder Beine des neuen Bildes**. Auch Common/Uncommon/Rare erzeugt hier noch keine neue Bildvariante. Der Equipmentbereich erklärt sichtbar: „Die Figur zeigt die Klassen-Grundausstattung. Ausgerüstete Gegenstände und Werte stehen unten.“

Vorbereitet ist eine Variantenauflösung mit dem Schlüssel `Class|WeaponDef|UpperBodyDef|LegsDef`. Sie liest ausschließlich bestehende Itemdefinitionen am Charakter. Eine spätere passende Komplettvariante kann einen kohärenten dreiseitigen Atlas gleicher Maße und gleicher Fußpunkte bereitstellen. Die Variantenregistrierung ist bewusst leer; fehlende Kombinationen verwenden das ausdrücklich bezeichnete Grundoutfit. Keine erfundenen ausgerüsteten Items oder Seltenheiten.

Der Erweiterungsvertrag beschreibt außerdem Ansatzpunkte für Füße, Hüfte, Brust und Kopf. Das sind Ausgangspunkte für spätere Artproduktion, kein fertiges Skelett. Es wurden **keine separaten transparenten Weapon-/UpperBody-/Legs-Layer**, keine ausrüstungsabhängigen Rare-Bilder und keine neuen Equip-Entscheidungen implementiert. Die frühere flache Overlay-Geometrie wird auf den neuen Helden nicht gezeichnet. Bestehende Vergleichs-/Auto-Equip-Logik und deren bisherige Rückmeldungen bleiben erhalten; kein zusätzliches V4.3-Wechselprotokoll.

## Bewegung: umgesetzt und offen

Umgesetzt:

- Ganze, zusammenhängende Figuren mit drei Blickrichtungen und bestehendem Richtungswechsel.
- Sehr kleine, fußverankerte Idle-Gewichts-/Atembewegung: maximal 0,4 % Höhenvariation und 0,12° Neigung. Keine sichtbaren auseinandergezogenen Bildgliedmaßen.
- Vorhandene geglättete Wegbewegung, dezente Bewegung beim Gehen, leichte Ganzkörperneigung bei Windup/Attack sowie Cast-/Heal-Glanz und bestehende Down-Zustände.
- Verletzte Hallenfiguren werden gedämpft und ruhend geneigt gezeigt; noch keine eigens gerenderte Sitzpose.
- Stille Portraits in Verwaltungslisten. Keine zusätzliche Animationsschleife. `prefers-reduced-motion` deaktiviert die neue Idle-Animation und Übergänge.

Noch offen: echte Gehzyklen mit Fußkontakt, separate Stoff-/Mantel-/Hand-/Waffenbewegungen, anatomisch eigenständige Angriffs- und Sitzposen, Skelettanimation. Bei Bewegung wird weiterhin ein Ganzkörperbild entlang des bestehenden Wegs bewegt. Das ist ausdrücklich keine fertige Laufanimation und kann bei genauer Betrachtung gleitend wirken. Das Paket priorisiert die vom Nutzer geforderte starke Grundoptik und schafft dafür eine konsistente Assetstruktur.

## Halle und Management

Die V4.2A-Leader-Hallenlogik bleibt **bytegleich**: reale gültige Leader freigeschalteter Gruppen, Abmarsch/Abwesenheit bei Einsätzen, Rückkehr sowie bestehende Tod-/Verletzungszustände. Maximal fünf Leader gemäß vorhandenen Gildenlimits. Kein neuer Hallenbewohner wird aus den neuen Klassenbildern erfunden. Die bereits vorhandene dekorative Darstellung des eigenen Gildenmeisters am Schreibtisch bleibt bewusst bestehen.

Alle Mitglieder bleiben im Roster, Recruitment, in freien Gruppenauswahlen, Equipment und Save vorhanden. Gruppen- und Equipmentansichten zeigen zusätzlich die neuen Portraits. Die neuen Portraits tragen bei Tod oder Verletzung weiterhin sichtbare Zustandskennzeichnungen.

## Unveränderte kritische Systeme

| Bereich | Änderung |
|---|---|
| Save-Schema | **Keine**; weiterhin `guildgame.browser.save.v4` |
| Persistente Felder/Migration | Keine neuen Felder und keine neue Migration; vorhandener V4.1B-Migrationspfad erhalten |
| Combat Core / Golden Vectors | **Unverändert** |
| Quest-/Dynamic-Quest-/Dungeon-Regeln und Outcomes | **Unverändert** |
| Recruitment, Preise, Gold, XP, Guild-XP, Guild Level | **Unverändert** |
| Equipment, Loot, Selling, Suitability, Auto-Equip-Auswahl | **Unverändert** |
| Navigation, Hallenwege, Begleiten-/Manager-Flow | **Unverändert** |
| Neue Infrastruktur | Keine; statisches HTML/CSS/JavaScript und lokale WebP-Dateien |

**36 kritische Dateien sind per SHA-256 geschützt**: `rules.js`, `progression.js`, `recruitment.js`, `dynamic-quests.js`, `early-balance.js`, `combat.js`, `dungeon.js`, `adventure-flow.js`, `save.js`, `skills.js`, `hall.js`, `hall-view.js`, `adventure-hall.js`, `expedition-presentation.js`, alle fünf bisherigen CSS-Dateien und sämtliche 17 bisherigen Asset-/Assetmetadateien. Die `CombatTimeline`-Implementierung bleibt ebenfalls textgleich. `game.js` ändert nur Darstellungsmarkup und Versionsanzeige; seine Transaktionshandler bleiben erhalten.

## Geänderte und neue Dateien

Geändert gegenüber dem V4.2A-ZIP:

- `character-presentation.js`
- `game.js`
- `index.html`
- `tests/assets-v41b.test.py`
- `tests/assets-v42.test.py`
- `tests/assets-v42a.test.py`
- `tests/run-all.py`

Neu:

- `BROWSER_PLAYTEST_V4_2B_REPORT.md`
- `BROWSER_PLAYTEST_V4_2B_TEST_OUTPUT.txt`
- `V4_2B_BASELINE_COMPARISON.json`
- `V4_2B_START_HERE.md`
- `assets/epic/EPIC_ASSETS.json`
- `assets/epic/mage.webp`
- `assets/epic/priest.webp`
- `assets/epic/rogue.webp`
- `assets/epic/warrior.webp`
- `epic-class-visuals.css`
- `epic-class-visuals.js`
- `tests/assets-v42b.test.py`
- `tests/baseline-v42b.test.cjs`
- `tests/fixtures/V42B_PROVENANCE.md`
- `tests/fixtures/v42b-baseline-scenarios.json`
- `tests/fixtures/v42b-protected-sha256.json`
- `tests/ui-v42b.test.cjs`
- `tests/v42b-scenarios.cjs`
- `tests/v42b-test-support.cjs`
- `tests/visuals-v42b.test.cjs`

`index.html` lädt die neuen Styles nach den bisherigen Styles und den Adapter vor dem gemeinsamen Renderer. Alle dort referenzierten Scripts und Styles verwenden `?v=4.2b`. Die neuen Bildpfade liegen unter dem neuen relativen Verzeichnis `assets/epic/`.

In `tests/assets-v41b.test.py`, `tests/assets-v42.test.py` und `tests/assets-v42a.test.py` wurde ausschließlich der erwartete Cachetoken auf `v=4.2b` aktualisiert. Kein vorhandener Testfall wurde entfernt oder abgeschwächt. `tests/run-all.py` ergänzt vier neue Suiten; die bisherigen Assetpfad-Schleifen prüfen automatisch auch die zwei neuen Runtime-Dateien. Historische Berichte/Anleitungen bleiben als Dokumentation im ZIP; maßgeblich sind diese V4.2B-Dateien.

Alle Dateien, Größen, Änderungsstatus und SHA-256 stehen in `V4_2B_BASELINE_COMPARISON.json`. Das Vergleichsmanifest und das umschließende ZIP sind von rekursiver Selbsthashbildung ausgenommen.

## Tatsächlich ausgeführte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Unveränderte V4.2A-Basis | 781 Checks / 28 Suiten / 16 JS-Syntaxprüfungen bestanden |
| 28 erhaltene Suiten im neuen Paket | 791 Checks bestanden; Mehrzahl durch zusätzlich geprüfte neue Ressourcenpfade |
| `visuals-v42b.test.cjs` | 15 Checks: vier Klassen, drei Ansichten, Grundwaffen, stabile Identität, Verhältnis/Fußpunkt, echte Loadout-Metadaten, Scene-Cache, read-only, Zustände, Gegner-Fallback, reduzierte Bewegung |
| `ui-v42b.test.cjs` | 14 Checks mit tatsächlicher Index-Ladereihenfolge: Hallenmeister/Leader, vollständige Listen, Portraits, alle drei Equip-Slots, Quest/Manager-Wechsel, Dungeon, Probekampf, Save/Reload, Import/Export, Verkaufsschutz, Tod/Verletzung |
| `baseline-v42b.test.cjs` | 21 exakte vollständige App-Snapshots und Save-Schreibzahlen stimmen mit direkt ausgeführtem V4.2A überein |
| `assets-v42b.test.py` | 96 Checks: 36 geschützte Dateien, relative Pfade/Cache, Alpha-WebP-Header, Maße/Hashes, alle drei Exportzellen, Größenbudget, Referenznachweis, CSS-/Source-Verträge |
| JavaScript-Syntax | Alle 17 Laufzeitdateien bestanden |
| Bild-Sichtprüfung | Alle vier Klassen und zwölf exportierten Ansichten sowie Verkleinerungen auf 140-Pixel-Zellhöhe angesehen |
| Browserstart | Chromium und WebKit versucht; beide wegen fehlender Executables blockiert |

Die Baselinevergleiche umfassen Equip, Verkauf, Rückgabe, Leaderwechsel, dynamische Angebote, Queststart/-abschluss, doppelte Abholung, Save, Recruitment, vier Dungeonräume einschließlich Boss und Abschluss. Die Hashes enthalten den vollständigen Snapshot einschließlich State, Uhrzeit, Seite und Combat, nicht nur ausgewählte Stats. Der DOM-Stub prüft keine Pixel, CSS-Layouts oder echten Touch-Ereignisse.

Die bestehenden Save/Load-/Backup-/Import-/Export-, Recruitment-, Guild-Level-, Selling-, Itemvergleichs-, Dynamic-Quest-, Questflow-, Dungeon-/Travel-, Combat-Golden-Vector-, Hallen-/Animationsmodell- und statischen Pages-Cachetests wurden weiter ausgeführt. Ein statischer Cachetoken-Test ist keine Live-Abnahme des GitHub-Pages-Caches.

Testkommando: `python3 tests/run-all.py`. Python 3 und Node.js werden nur für Entwicklerprüfungen benötigt; das Spiel braucht weder npm noch einen Buildprozess.

## Bekannte Grenzen und spätere Unity-Version

Noch abzunehmen: echte Safari-/iPhone-16-Pro-Darstellung im Querformat, Größe relativ zum Hallenhintergrund, Überschneidungen an Tischen/Portalen, Scroll-/Touchverhalten, Blickwinkelübergänge und Bildrate. Die Bildgenerierung kann zwischen Ansichten kleinere Detailabweichungen enthalten. Klassenportraits und Silhouetten wurden angesehen, es wird aber keine vollständige 3D- oder Anatomieabnahme behauptet. Die historischen Goblinbilder und Umgebungen wurden nicht im selben Art-Pass neu erstellt.

Die Klassen besitzen feste Gesichter und Grundausstattung. Individuelle Gesichtsvarianten, ausrüstungsabhängige Körperbilder und vollständige Bewegungszyklen bleiben offen. Keine neuen Gameplaywerte, keine neuen Systeme, kein Rang E.

Eine spätere Unity-Version benötigt eigene Modelle oder Sprite-Pose-Sets, Material-/Equipment-Zuordnungen, Animator-/Skelettdaten, Schatten/Beleuchtung und eine echte Geräteabnahme. Dieses Paket liefert ausschließlich statische Browsertechnik mit vorgerendert wirkenden 2D-Bildern. Kein Unity-, Xcode- oder nativer Build wurde erstellt.

**Stopp nach diesem V4.2B-Paket. Keine Folgephase begonnen.**
