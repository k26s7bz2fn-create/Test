# BROWSER PLAYTEST V3 — LIVING HALL

Stand: 4. Oktober 2026. Grundlage: `GuildGame_Sprint11_BrowserPlaytest_V2.zip`.

## Ergebnis und Abnahmegrenze

V3 ist als vollständige statische Browser-Website paketiert. Dieser Durchlauf erweitert ausschließlich Darstellung, Hallenbewegung und Ereignisvisualisierung. Die bestehenden Gameplaymodule bleiben bytegleich. Kein Unity-Projekt wurde ersetzt; Sprint 12 wurde nicht begonnen.

**171 automatisierte Modell-, DOM-Stub- und begrenzte Quell-/Assetprüfungen bestanden; sechs JavaScript-Dateien bestehen `node --check`.** Das ist keine visuelle Browser- oder iPhone-Abnahme. Der Versuch, die lokale Website mit dem Browserdienst zu öffnen, scheiterte an einem Timeout; eine gerenderte V3-Gesamtansicht konnte dadurch nicht geprüft werden. Safari, Touchverhalten auf einem echten iPhone, Bildrate und endgültige Überlagerungen bleiben extern zu prüfen. Die neu erzeugten Einzelgrafiken wurden visuell gesichtet, ihre Einbindung wurde durch Pfad-, Container- und Integrationstests geprüft.

## Visuelle Änderungen

Die Hallenhauptansicht verwendet ein neues gemaltes Fantasy-Environment statt einer überarbeiteten flachen SVG-Halle. Grobe Holzbalken, Stein, warmes Kaminlicht, Banner, Bücher, Pergamente, Metall, Sitzplätze, Kartentisch, Truhe und ein kühles magisches Portal bilden Vorder-, Mittel- und Hintergrund. Die Komposition zeigt den Gildenmeister am vorderen Schreibtisch und öffnet den Blick in die Halle.

Drei ausgeschnittene Überlagerungen derselben Hintergrundgrafik verdecken Bewohner hinter Kartentisch, Truhe und Schreibtisch. Größe und Zeichenreihenfolge der Bewohner hängen von ihrer Bodentiefe ab. Es ist eine 2,5D-Komposition aus Bild- und DOM-Ebenen, keine freie 3D-Kamera.

Sechs transparente, objektgebundene Touchflächen führen zu Rekrutierung, Questbrett, Gruppentisch, Gildentruhe, Übungsportal und Gildenregister. Kleine sichtbare Labels ersetzen die großen Hallenbuttons. Die bestehende feste Navigation bleibt als gut erreichbare Alternative erhalten. Bewohner sind antippbar und öffnen die Mitgliederübersicht mit ihrem Profil.

## Charakterdarstellung und Animation

Ein neues transparentes Klassenatlas enthält vier eigene Abenteurerdesigns: schwer gepanzerter Krieger, ledergekleideter Schurke mit Dolchen, arkaner Magier und Priester mit heilender Klassenidentität. Rekrutierungs- und Rosterporträts verwenden diese Grafik ebenfalls. Die bisherige Combat-Visualisierung mit ihren SVG-Figuren bleibt erhalten.

Hallenbewohner bestehen aus sechs grafischen Teilen: Kopf, Rumpf, zwei Arme und zwei Beine. CSS-Animationen bewegen Kopf und Arme, lassen den Körper atmen und verlagern sein Gewicht. Beim Laufen wechseln Beine und Arme phasenversetzt; der Körper hebt und senkt sich, und die Figur richtet sich nach ihrer horizontalen Bewegungsrichtung aus. Namen bleiben lesbar, ohne mitgespiegelt zu werden.

Der Gildenmeister ist eine eigene rückseitige Figur mit Kopf, Kleidung, Armen und Schreibfeder. Drei ausgeschnittene Ebenen bewegen Atmung, Kopf und Schreibhand. Er bleibt stationär am Schreibtisch.

Die Posen sind stilisierte bewegte Bildausschnitte, keine vollständigen Skelettanimationen. Gleiche Klassen verwenden denselben Grundkörper; kleine Animationsphasen unterscheiden Bewohner. Gesicht, Kleidung und tatsächliche Equipment-Instanzen sind nicht individuell visualisiert.

## Bewohner, Wege und Aktivitäten

`hall.js` liest Mitglieder- und Questzustände aus dem vorhandenen Browser-Spielstand. Es führt keine zweite Mitgliederverwaltung und keine neue fachliche Lebensstatusverwaltung ein. Namen und IDs gehören zu den tatsächlichen Rekruten. Nicht rekrutierte Kandidaten werden nicht als Hallenbewohner erfunden.

Der Präsentationsgraph verbindet Eingang, Rekrutierungsbereich, Kamin, Sitzplatz, Questbrett, Kartentisch, Truhe, Portal und Schreibtisch über zusätzliche Durchgangspunkte. Eine Breitensuche findet Wege auf diesem kleinen festen Graphen. Das System benötigt weder Physik noch eine Engine oder Navigationsbibliothek.

Normale Folge: Idle → Walk → Activity → Idle. Am Kamin werden Hände gewärmt, am Brett und Tisch wird gelesen, an Truhe und Portal wird Ausrüstung geprüft. Am Sitzplatz erscheint eine komprimierte Ruhepose. Stehen zwei nicht verletzte Mitglieder im Activity-Zustand am selben Ort, werden Gesprächsbeschriftung und Gesten dargestellt. Dies gewährt keinerlei Bonus und ist keine Dialog-KI.

Bis zu zwölf tatsächliche Gildenmitglieder werden unterstützt. Sie verteilen sich über Stationen und kleine seitliche Versätze. Das ist keine vollständige Kollisionsvermeidung; bei vielen Mitgliedern können sich Figuren und Namensschilder überlagern.

## Lebensstatus

- Lebende, verfügbare Mitglieder nehmen am Activity-System teil.
- Verletzte gehen langsamer zum Ruheplatz und ruhen dort. Ihr Genesungszeitpunkt wird beim ohnehin bestehenden 250-ms-UI-Update erneut gelesen; nach Ablauf werden normale Aktivitäten wieder möglich.
- Tote und aus dem Roster entfernte Mitglieder verschwinden sofort aus der Bewohnerdarstellung.
- Active und CompletedPendingResolution bleiben fachlich gesperrt. Solche Mitglieder erscheinen nur während ihrer kurzen Abreisesequenz und danach nicht als normale Bewohner.
- Bereits laufende oder auswertungsbereite Quests erzeugen beim ersten Einlesen keine falschen Hallenbewohner.

Keine Animation schreibt Gold, XP, HP, Verletzung, Tod, Equipment, Potions, Queststatus oder Gruppenzugehörigkeit.

## Recruitment Arrival

Die vorhandene V2-Transaktion wird zuerst ausgeführt. Nach erfolgreicher Aufnahme wechselt die Ansicht zur Halle; der neue echte Bewohner erscheint am Eingang, läuft zum Rekrutierungsbereich und tritt in das Activity-System ein. Bei Fehlern entsteht kein neuer Bewohner.

Unverändert: fünf Starterkandidaten, genau drei kostenlos; danach erster normaler Pool kostenlos, F1-Aufnahme 50 Gold, Refresh 25 Gold, Gildenkapazität zwölf. Der bestehende Schutz vor mehrfachen schnellen Aufnahmen bleibt erhalten.

## Quest Departure

Der vorhandene Queststart bleibt autoritativ. Die betroffenen Bewohner sammeln sich kurz, laufen über den vorderen Sammelpunkt Richtung Ausgang und werden aus der Halle entfernt. Eine begrenzte Präsentationsdauer von höchstens etwa 3,4 sichtbaren Simulationssekunden verhindert lange Zwangssequenzen; ungünstige Ausgangspositionen können deshalb vor dem vollständigen Wegende ausgeblendet werden.

Während dieser kurzen Phase zeigt die Questkarte eine Abreisebeschreibung statt des normalen Fortschrittsbalkens. Danach erscheint der bestehende Fortschritt.

**Bewusste Trennung:** StartTimestamp und Questzeit beginnen weiterhin beim bestehenden atomaren Start. Die Animation verschiebt weder Start noch Abschluss und fügt keine zusätzliche Wartezeit zur Spielregel hinzu. Sie verschiebt nur die normale Fortschrittsdarstellung. Bei reduzierter Bewegung entfällt die Laufsequenz.

## Quest Return

Das Erreichen von CompletionTimestamp allein lässt niemanden zurückkehren: CompletedPendingResolution hält weiterhin sämtliche Sperren und den Aktivplatz. Erst nach erfolgreichem Resolve werden die endgültigen Lebensfolgen gelesen. Überlebende betreten die Halle durch den Eingang; verletzte Überlebende gehen zum Ruheplatz; Tote laufen niemals lebendig zurück.

Belohnungen werden weiterhin separat am Questbrett übernommen. Die Rückkehranimation wendet keine Rewards an und verändert weder deren Menge noch Idempotenz.

## Umgebung und Performance

Kaminflammen, warmer Lichtschein und kleine Kerzenflammen variieren dezent. Portalringe bewegen sich und pulsieren. Über Bannerflächen wandern leichte Licht-/Neigungs-Overlays; das ist keine echte Stoffsimulation. Figuren am Kamin beziehungsweise Portal erhalten warme beziehungsweise kühle Lichtkonturen.

- Drei neue lokale WebP-Assets, zusammen 1.084.912 Byte (rund 1,03 MiB).
- Keine CDN-, Framework-, Backend- oder Buildsystem-Abhängigkeit.
- Maximal zwölf zustandsabhängige Bewohner.
- Bewegung über CSS `translate3d`; DOM-Zeichnung auf höchstens ungefähr 30 Aktualisierungen pro Sekunde begrenzt.
- Größenmessung über ResizeObserver statt wiederholter Layoutmessung pro Figur.
- Pro Bild begrenzte visuelle Zeitfortschreibung; bei verborgenem Dokument keine Hallenfortschreibung.
- Dekorative CSS-Animationen und normale Wege werden bei `prefers-reduced-motion` deaktiviert beziehungsweise unmittelbar übersprungen. Gameplay und Navigation bleiben verfügbar.
- Vorhandene Landscape-, Dynamic-Viewport- und Safe-Area-Regeln bleiben bestehen; Objektflächen besitzen mindestens 44 CSS-Pixel Grundabmessung.

Diese Maßnahmen wurden auf Quell-/Modellebene geprüft. Eine reale FPS-, Akku-, Safari- oder Touchmessung wurde nicht durchgeführt.

## Assets und Herkunft

Neue Bildassets wurden für diesen Auftrag mit Bildgenerierung erstellt, anschließend visuell gesichtet und als WebP für die Website kodiert. Keine WoW-/Blizzard-Dateien oder fremden Spielassets wurden übernommen. Die Bilder sind keine historischen Unity-Assets.

| Relativer Pfad | Inhalt | Abmessung | Bytes |
|---|---|---:|---:|
| `assets/hall-painted.webp` | Gemalte räumliche Hallenkomposition | 1536 × 1024 | 374400 |
| `assets/adventurers-painted.webp` | Transparenter Vierklassen-Atlas | 1536 × 1024 | 393958 |
| `assets/guild-master-painted.webp` | Rückseitiger schreibender Gildenmeister | 1310 × 1200 | 316554 |

Gestaltungsbrief der Bildgenerierung: warme, eigenständige stilisierte MMORPG-Fantasy; sichtbare Stein-/Holz-/Stoff-/Metallmaterialien; weite Halle mit freiem Boden für bewegliche Bewohner und vorderem Schreibtisch; vier klar unterscheidbare vollständige Klassenkörper auf transparentem Grund; separat ein rückseitiger Gildenmeister mit Schreibhand. Dies ist eine Beschreibung des eingesetzten Gestaltungsbriefs, keine nachträglich behauptete wortgetreue Promptabschrift.

Beibehaltene V2-Assets: `assets/guild-hall.svg`, `warrior.svg`, `rogue.svg`, `mage.svg`, `priest.svg`, `goblin-melee.svg`, `goblin-ranged.svg`, `goblin-brute.svg`, `goblin-boss.svg`. Alle liegen weiterhin unter `assets/`; Klassen-/Gegner-SVGs bleiben für den Combat erhalten. Die alte Hallen-SVG ist nicht mehr Hintergrund der Hallenhauptansicht, bleibt aber als vorhandenes Fallback-/Portrait-Hinweis-Asset erhalten.

## Dateien und Baseline

Von 26 Dateien des V2-Pakets sind **24 bytegleich**, zwei wurden geändert, keine gelöscht:

| Bestehende Datei | Änderung und Grund |
|---|---|
| `index.html` | V3-Titel; zusätzliche Präsentations-CSS und Hallenmodule in korrekter Ladereihenfolge |
| `game.js` | Hallenmarkup, neue Porträts, lesende Zustandsanbindung, Navigation nach Aufnahme/Start/Resolve und visuelle Aktualisierung |

Neue Produktions-/Assetdateien: `hall.js`, `hall-view.js`, `living-hall.css` sowie die drei oben genannten WebP-Dateien.

Neue Prüf-/Dokumentationsdateien: `tests/hall-v3.test.cjs`, `tests/ui-v3.test.cjs`, `tests/assets-v3.test.py`, `tests/run-all.py`, `V3_BASELINE_COMPARISON.json`, `BROWSER_PLAYTEST_V3_TEST_OUTPUT.txt`, `V3_START_HERE.md` und dieser Bericht.

`rules.js`, `combat.js`, `skills.js`, sämtliche bisherigen Tests und die bisherigen RNG-Vektoren sind unverändert. Ein erneuter vollständiger Vergleich des vorhandenen Unity-Ordners mit `GuildGame_Sprint11_Implementation.zip` ergab **332 von 332 Dateien bytegleich**. Der JSON-Baselinebericht enthält pro V2-Datei den alten und neuen SHA-256-Wert.

## Tatsächlich ausgeführte Prüfungen

Abschließender vollständiger Aufruf: `python3 tests/run-all.py`. Vollständige Ausgabe im Paket: `BROWSER_PLAYTEST_V3_TEST_OUTPUT.txt`. Alle darin enthaltenen Befehle endeten mit Exitcode 0.

| Prüfung | Ergebnis dieses Durchlaufs | Aussagegrenze |
|---|---:|---|
| `rules.test.cjs` | 30 bestanden | JS-Spielmodell, Quest-/Rewardloop, Combat-Golden-Vektoren |
| `recruitment-v2.test.cjs` | 21 bestanden | V2-Aufnahme, Kosten, Kapazität, Fehleratomarität |
| `ui-smoke.test.cjs` | 20 Checks bestanden | Bestehende DOM-Stubs, kein Browserlayout |
| `ui-v2.test.cjs` | 10 bestanden | V2-Handler und Combat-Präsentationsanbindung mit Stubs |
| `static-v2.test.py` | 14 bestanden | Begrenzte bestehende Quell-/Assetprüfungen |
| `hall-v3.test.cjs` | 33 bestanden | Neue Wege, Bewohner, Ankunft/Abreise/Rückkehr, Genesung, Determinismus, keine Gameplaymutation |
| `ui-v3.test.cjs` | 11 bestanden | Alle sechs JS-Dateien zusammen mit DOM-Stubs; Hallenrenderer, 50-Gold-Aufnahme, Profilnavigation, Queststart |
| `assets-v3.test.py` | 32 bestanden | Relative Pfade inklusive Repository-Unterpfad, WebP-Container, Ladereihenfolge, begrenzte CSS-/Quellprüfungen |
| `node --check` | 6 Dateien bestanden | JS-Syntax, kein Laufzeit-/Renderingnachweis |

Zusammen: **171 Prüfungen/Checks bestanden, null Fehler im abschließenden Lauf**, plus sechs Syntaxprüfungen. Modelltests und begrenzte statische Checks werden nicht als 171 reale Browser-End-to-End-Tests ausgegeben.

Ein erster Lauf des neu geschriebenen Assettests beanstandete fälschlich das vorhandene eingebettete SVG-Favicon als fehlende Datei. Der Test wurde korrigiert: lokale Dateien werden weiterhin auf Existenz und relative Pfade geprüft; eingebettete `data:image/`-Assets benötigen keine separate Datei. Keine Produktionsregel wurde dafür verändert. Der vollständige Lauf wurde danach erneut ausgeführt.

Bei der Quellprüfung wurden außerdem zwei Präsentationsfehler vor Abschluss behoben: der Genesungszustand wird nun auch ohne Navigation regelmäßig synchronisiert; linke/rechte Laufglieder verwenden echte phasenversetzte Animation statt einer bei symmetrischen Keyframes wirkungslosen Rückwärtswiedergabe.

## Noch nicht ausgeführte Abnahmen und bekannte Einschränkungen

- Integrierte grafische Browser-Sichtprüfung: **offen**, Öffnungsversuch im Browserdienst endete mit Timeout. Es liegt kein erfolgreicher V3-Screenshot-Smoke-Test vor.
- iPhone 16 Pro, Safari, echte Touchgesten, Safe-Area-Darstellung und Leistung: **nicht ausgeführt**.
- Raum-, Licht-, Figuren- und Occlusiongrafiken sind gemalte Ebenen. Die Bühne passt das Bild an die verfügbare Fläche an; extreme Seitenverhältnisse können Proportionen strecken.
- Bildausschnitt-Rigs können sichtbare Nähte oder einfache Gelenkübergänge zeigen. Sitz-/Gesprächs-/Arbeitsaktionen sind stilisierte Posen und Gesten, keine vollwertigen animierten Interaktionen mit Gegenständen.
- Wege sind festgelegt, ohne vollständige Kollisionsprüfung. Bei zwölf Mitgliedern sind Überlagerungen möglich; die feste Roster-Navigation bleibt erreichbar.
- Die neue Bildsprache ist eine deutliche Änderung der Assets, aber ihre integrierte visuelle Qualität wird ausdrücklich nicht als extern abgenommen bezeichnet.
- Kein Save: Neuladen setzt den Browser-Spielstand zurück. Kein neuer Cloudsave oder Account.
- Kein Deployment durchgeführt; keine veröffentlichte URL erzeugt. Das Paket ist für den bestehenden GitHub-Pages-Link vorbereitet.
- Unity, Xcode und iPhone-Unity-Abnahme: nicht in diesem Durchlauf ausgeführt. Frühere Testergebnisse werden dadurch weder ersetzt noch erweitert.

## GitHub Pages und kurzer externer Spieltest

ZIP vollständig entpacken und **seinen Inhalt** in den Root des bestehenden Repositories übernehmen. `index.html`, die sechs JavaScript-Dateien, beide CSS-Dateien und der vollständige `assets/`-Ordner müssen gemeinsam vorhanden sein. GitHub Pages: **Deploy from a branch → main → /(root)**. Kein zusätzlicher übergeordneter ZIP-Ordner ist erforderlich. Es ist keine Build-Pipeline nötig.

Auf dem iPhone im Querformat Starter rekrutieren, Bewohner und Profile ansehen, eine Gruppe bilden und eine Quest starten. Abreise, Questbrett, Resolve, Überlebenden-Rückkehr, Verletztenruhe und separate Reward-Abholung prüfen. Danach Rekrutierung für 50 Gold, Lager und bestehenden Probekampf testen. Die bestehende Playtest-Uhr kann über Werkzeuge um 60 Sekunden vorgerückt werden.

V3 ist eine visuelle und funktionale Browserreferenz für das spätere Unity-Spiel. Keine neue Entwicklungsphase wurde begonnen; Unity und Combat-Regeln bleiben unverändert.
