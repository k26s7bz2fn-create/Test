# GuildGame Browser Playtest V4.2A – Visual & Flow Fix

Stand: 6. Oktober 2026. Dieser Qualität-, Balance- und Abschluss-Pass baut auf dem **fertigen V4.2 Living Adventure** auf. Kein neuer Sprint, kein V4.3, keine Unity-Arbeit und kein neuer Combat-Kern.

## Lieferung und tatsächlicher Prüfstand

Implementiert sind ein neuer eigener Richtungsatlas für die vier Heldenklassen, neu proportionierte gemalte Abenteuerkulissen, weichere gemeinsame Figurenbewegung, lebendige Umgebungs-Layer, eine frühe Schwierigkeitsleiter und ein direkter Quest-/Dungeonabschluss. Der vorhandene Painted-Hall-Hintergrund bleibt erhalten. Alle Laufzeitdateien sind statisch und lokal.

**781 erfolgreiche automatisierte Checks in 28 Suiten, 0 fehlgeschlagene Testkommandos; zusätzlich 16 erfolgreiche JS-Syntaxprüfungen.** Der vollständige Testlauf wird auch aus dem sauber entpackten Release-ZIP ausgeführt. Danach werden alle finalen ZIP-Einträge und Manifesthashes gegen die Quelldateien abgeglichen. Quellcode und Assets bleiben nach dem ZIP-Test unverändert.

**Keine gerenderte Browser-/Safari-/iPhone-Abnahme, kein Touch- oder FPS-Profiling.** Die vorhandene Playwright-Bibliothek konnte weder Chromium noch WebKit starten, weil die Browser-Binaries fehlen. Daher wird weder 60 FPS noch eine visuell bestätigte iPhone-Ergonomie behauptet. Die Grafikassets wurden angesehen; das tatsächliche Browserlayout und die wahrgenommene Bewegungsqualität sind noch auf dem Zielgerät zu prüfen. DOM-Stubs sind keine Browserabnahme. Auch kein GitHub-Pages-Deployment, Unity-, Xcode- oder WebMCP-Host-Test wurde ausgeführt.

## Baseline und Dateiumfang

Basis: `GuildGame_BrowserPlaytest_V4_2_LivingAdventure.zip`

SHA-256: `8e9ef1c3536b0003ab2e2390b00d75285310d5a4766c16288d7d927650d204fa`

Das Basis-ZIP wurde in ein separates V4.2A-Verzeichnis entpackt und bleibt unverändert. Das frühere V4.2-Verzeichnis wurde nicht bearbeitet. Das neue ZIP enthält `index.html` direkt in seiner Wurzel und sämtliche lokalen Assets, Tests und Dokumente. Bestehende ältere Berichte im ZIP sind historische Dokumentation; der aktuelle Einstieg ist `V4_2A_START_HERE.md`.

Geänderte Dateien:

- `adventure-hall.js`
- `character-presentation.js`
- `expedition-presentation.js`
- `game.js`
- `index.html`
- `save.js`
- `tests/assets-v41b.test.py`
- `tests/assets-v42.test.py`
- `tests/run-all.py`

Neue Implementierungs-/Test-/Assetdateien:

- `adventure-flow.js`
- `assets/V42A_ASSETS.json`
- `assets/adventure-landscapes-v42a.webp`
- `assets/adventurers-directional.webp`
- `early-balance.js`
- `tests/assets-v42a.test.py`
- `tests/balance-flow-v42a.test.cjs`
- `tests/fixtures/v42-protected-sha256.json`
- `tests/fixtures/v42-save-v3.json`
- `tests/presentation-v42a.test.cjs`
- `tests/ui-v42a.test.cjs`
- `visual-quality.css`

Hinzu kommen `tests/fixtures/V42A_PROVENANCE.md` und die vier V4.2A-Begleitdateien dieses Releases. Die vollständige Liste mit SHA-256, Größen, hinzugefügt/geändert/unverändert steht in `V4_2A_BASELINE_COMPARISON.json`. Manifest und umschließendes ZIP sind von ihrer eigenen Hashliste ausgenommen, um zirkuläre Hashes zu vermeiden.

**Bytegleich geschützt:** `rules.js`, `progression.js`, `recruitment.js`, `dynamic-quests.js`, `combat.js`, `skills.js`, `hall.js`, `hall-view.js`, `dungeon.js` sowie alle 14 V4.2-Grafiken. Insgesamt 23 geschützte Dateien werden gegen direkt aus dem V4.2-ZIP gelesene Hashes geprüft. Die bisherigen CSS-Dateien bleiben ebenfalls bytegleich; der Qualitätspass ergänzt `visual-quality.css`.

## Gemeinsame Character Presentation

Es bleibt **ein** `GuildCharacterPresentation.Scene`-Renderer für Halle, Reise, Training und Dungeon. Die bestehende `CombatTimeline` übernimmt weiterhin echte Combat-Events und Snapshots. Es gibt keinen parallel aufgebauten Animationskern. Die vollständige V4.2A-Komposition aktiviert die Erweiterungen; historische Modulsuiten behalten ihre bisherigen Kompositionen und werden zusätzlich zur neuen vollständigen App geprüft.

Character-ID, Klasse, Ausrüstung und autoritativer Zustand sind weiter die Quellen der Darstellung. Die bisherige ID-basierte Variante bleibt stabil. Neue Grafik: vier Klassen in drei Blickrichtungen – rechte Dreiviertelansicht, rechtes Profil und hintere Dreiviertelansicht. Linke Blickrichtungen entstehen durch Spiegelung. Die Figuren schauen damit nicht mehr grundsätzlich frontal in die Kamera.

Der neue Richtungsatlas ist eine eigenständig erzeugte Überarbeitung der vorhandenen GuildGame-Figuren: blauer Krieger, grüne Schurkin, violetter Magier und elfenbeinfarbene Priesterin. Es wurden keine WoW-/Blizzard-Assets, Logos, UI-Elemente oder nachgebauten Figuren importiert. Die ursprünglichen Atlanten bleiben unberührt im Paket.

Die drei Ansichten werden im selben Figurenknoten über Opacity überblendet. Die vom Generator leicht unterschiedlich belegten Zeilen erhalten CSS-Fenster und Insets, damit Füße nicht am Zellrand abgeschnitten werden und die Körpergrößen zwischen Blickrichtungen vergleichbar bleiben. Ausrüstung bleibt als separate Waffen-, Oberkörper- und Bein-Layer erhalten und wird für jede Richtung aus denselben realen Definitionen aufgebaut.

**Grenze:** Das ist weiterhin ein stilisierter 2D-Puppenaufbau aus einem Richtungsatlas und geclippten Körperteilen. Keine vollständige 3D-Darstellung, keine echte Skelettanimation, keine individuell modellierte Rüstung pro Item und keine vielen handgezeichneten Walk-Frames. Bei Profil-/Rückenansichten bleiben Equipmentformen und Körperteilbewegung vereinfacht. Die neuen Ansichten und Übergänge verbessern die vorhandene gemeinsame Darstellung, ersetzen sie aber nicht durch eine 3D-Engine.

## Flüssigere Bewegung und Ausrichtung

Der Scene-Knoten hält nun einen fortlaufenden lokalen Bewegungszustand: visuelle Position, Schrittphase, Ganggewicht, Blickrichtung, Drehphase und Darstellungszeit. Zielpositionen werden mit zeitabhängiger exponentieller Glättung angenähert: `blend = 1 - exp(-dt / 0.075)`. Der State der Figur, der Quest oder des Combats wird dabei nicht geändert. Statische Zielannäherung wurde für 30 und 60 Updates pro Sekunde auf identische Endposition geprüft; das ist eine Modellprüfung und keine gemessene Bildrate.

Schrittphase, abwechselndes Anheben der Füße, Armschwung und Körperbewegung laufen weiter, auch wenn zwischen Idle und Walk gewechselt wird. Der Gang wird weich ein-/ausgeblendet, statt bei jedem Zustandswechsel neu zu starten. Blickrichtungswechsel besitzen eine kurze **Turn**-Phase von 0,26 Sekunden mit leichter Verengung der Silhouette und weicher Richtungsübernahme.

Idle, Walk, Turn, Interact, Attack, Cast, Heal, Hit, Down und Return sind vorhanden. Die vorhandene Melee-Abfolge bleibt: Annähern, Windup, echter Trefferkontakt, Recovery/Rückweg. Auf dem Rückweg drehen sich Nahkämpfer jetzt in die Rückbewegungsrichtung. Zauber und Heilung richten sich nach dem echten Ziel. Hallenwege in die Tiefe verwenden die Rückenansicht; Objektinteraktion kann die Figur zum Objekt drehen. Sich unterhaltende Hallenfiguren richten sich zueinander aus. Reisegruppen laufen im Profil, Such-/Sammelaktionen zeigen eher die hintere Ansicht und Rückreisende schauen in Wegrichtung.

Combat-HP, Mana, Fähigkeiten, Crit, Status, Stabilisierung, Tod, Collapse, Sieg/Niederlage/Wipe, Tickfolge und RNG wurden **nicht** geändert. Die Kontaktanimation zeigt weiterhin echte Beträge und den danach gültigen Snapshot. Bei spätem Einstieg wird der aktuelle Zustand übernommen, ohne historische Treffer erneut auszuspielen. Hohe Geschwindigkeit und Zeitlücken dürfen visuelle Zwischenphasen verkürzen; sie erzeugen keine zusätzlichen Combat-Ereignisse.

## Proportionen, Bodenkontakt und lebendige Kulissen

Die sechs neuen Umgebungen sind als breite Landschaften mit einheitlicher flacher Perspektive und einer freien Bodenfläche angelegt: Straße, Wald, Hügelland, Lager, Höhleneingang und Mine. Der 1536×1024-Atlas besitzt sechs breite Zellen; die Abenteuerbühne orientiert sich am Verhältnis 2,25:1. Das reduziert das bisherige Strecken weniger passend proportionierter Bilder.

Figurenhöhe wird aus der gemessenen Bühnenhöhe abgeleitet: 36 Prozent, begrenzt auf 82–175 Pixel vor Tiefenskalierung. Die Grafik selbst enthält transparente Randflächen. Näher am Vordergrund stehende Figuren werden größer. Combat-Fußpunkte beginnen weiter unten auf der begehbaren Ebene, statt im oberen Bildteil zu stehen. Alle Figuren behalten Bodenschatten; neue elliptische Kontaktschatten, eine abgestimmte Farbsättigung und Vordergrundüberlagerungen verbinden sie optisch mit der Umgebung. Namen und Balken liegen kompakt unter dem Standpunkt.

Die Bühne besitzt getrennte Hintergrund-, Boden-, Licht-, Nebel-, Figuren-, Partikel- und Vordergrund-Layer. Sehr langsame Kamera-/Parallaxbewegung, weiche Lichtänderung, leichter Nebel und **acht** begrenzte Staub-/Blattpunkte beleben die Szene. Mine/Höhleneingang haben kühle Kristall- und warme Laternenakzente; das Lager einen dezenten warmen Feuerschein. Die vorhandene Hallenfeuer-/Portalbewegung bleibt erhalten.

Es gibt keine Videos und keine hektische Vollbild-Effektfolge. Bewegung nutzt überwiegend `transform`, `translate3d`, Opacity, Scale und eine einzige vorhandene `requestAnimationFrame`-Schleife. Die neuen Keyframes animieren nicht Left/Top/Width/Height. Figuren-DOM und Atlasmarkup bleiben gecacht; 300 Qualitätsframes wurden ohne neue Figuren-/Artknoten geprüft. Die bestehenden Grenzen von 24 sichtbaren Effekten, 24 Zahlen, 36 Animationseinträgen und 8 Combatpaketen bleiben bestehen.

`prefers-reduced-motion` deaktiviert starke Übergänge, Dauerbewegung, Parallax und Partikel; Schrittbewegung wird auch im JavaScript-Pfad unterdrückt. Explizite visuelle Questpause friert jetzt ebenfalls die JavaScript-Schrittphase ein. Die Questzeit läuft dabei unverändert weiter. Dungeonpause bleibt wie V4.2 eine autoritative, gespeicherte Combatpause.

Die 16 Raster-/Vektorgrafiken zusammen belegen 3,307,802 Bytes, also 3.155 MiB. Keine externe Bild- oder CDN-Abhängigkeit, kein npm, kein Buildserver. Die mobile Gestaltung berücksichtigt Landscape, kompaktere Namen/Balken und mindestens 48-Pixel-Abschlussbuttons. Ob die gewählten Größen, Schattierungen und Überlagerungen auf einem echten iPhone überzeugen, bleibt Teil der offenen visuellen Abnahme.

## Frühspiel-Balance: Versionierter Vertrag für neue Angebote

Ursache des Frühspielproblems: Eine typische Gruppe aus Krieger, Priester und Schurke startet mit **264 Stärke**. Das erste V4.2-Mittelangebot empfahl nur **247**. Die Gruppe war damit bereits über der Empfehlung.

Die neue Datei `early-balance.js` ergänzt den Vertrag **`browser.quests.v4.2a`**. Der vorhandene Benchmark – bis zu sechs stärkste lebende, genesene Kadercharaktere bzw. Gildenminimum – bleibt erhalten. Die Tiermultiplikatoren bleiben zentral `[0.70, 0.95, 1.25, 1.65]`. Neue Mindeststärken sind:

| Stufe | V4.2-Mindeststärke | V4.2A-Mindeststärke |
|---|---:|---:|
| Leicht | 180 | 180 |
| Mittel | 240 | **470** |
| Schwer | 320 | **760** |
| Elite | 420 | **1150** |

`Empfehlung = max(Mindeststärke der Stufe, round(Benchmark × Tiermultiplikator))`.

Die zehn möglichen kostenlosen Dreier-Starterkombinationen können Leicht sinnvoll angehen. Alle liegen anfangs bei Mittel unter einem Stärkeverhältnis von 0,65 und erhalten die vorhandene deutliche Risiko-Warnung. Der Start bleibt nach ausdrücklicher Bestätigung erlaubt. Keine neue harte Level-Sperre und kein geänderter Quest-RNG.

| Typische Startergruppe ohne neue Items | Gruppenstärke | Verhältnis zu Mittel 470 | Erwartung laut vorhandener Risikoskala |
|---|---:|---:|---|
| Alle Level 1 | 264 | 0,562 | Extremes Risiko |
| Alle Level 2 | 339 | 0,721 | Hohes Risiko |
| Alle Level 3 | 414 | 0,881 | Knapp unter „Angemessen“ |
| Alle Level 4 | 489 | 1,040 | Angemessen |

Die Tabelle wurde auch gegen jeweils neu erzeugte Boards geprüft. Alle zehn Starterkombinationen erreichen auf Level 4 mindestens „Angemessen“ für Mittel. Reale bessere Uncommon-Ausrüstung macht Mittel bereits auf Level 3 deutlich erreichbarer. Schwer und Elite bleiben bei dieser frühen Gruppe klar spätere Schritte. Das sind Stärke-/Risikowerte, keine behaupteten Erfolgsquoten oder Siegegarantien. Ein deutlich größerer bzw. stärkerer Gesamtkader kann über den erhaltenen dynamischen Benchmark höhere neue Empfehlungen erzeugen.

**Alte gespeicherte Quests werden nicht geändert**, auch alte verfügbare Angebote nicht. Ihr `dynamic.rulesVersion` entscheidet weiter über den passenden Validierungsvertrag. Erst „Neue Angebote“ bzw. eine neue Gilde erhält V4.2A-Werte. Laufende Quests, Pending, Ergebnisse, Beute und Paid-Marker bleiben bei Refresh und Migration unverändert.

## Rewards nach dem Balancepass

Gold, Gruppen-/Charakter-XP, Gilden-XP und Loot bleiben vorhanden. Die höhere frühe Mindestempfehlung wird **nicht unmittelbar in eine riesige Rewardsteigerung umgerechnet**. Die vorhandene V4.1B-Rewardkurve, Typ-/Distanzvariation, Drop-/Raritychancen und 600-XP-Grenze liefern die Ausgangswerte.

Damit ein früher Mittelauftrag nicht durch Typvariation weniger Gold/XP als Leicht bietet, erzwingt die neue zentrale Konfiguration pro höherer Stufe mindestens **+6 Gold, +12 Gruppen-XP und +5 Gilden-XP** gegenüber der niedrigeren Stufe desselben Boards. XP bleiben bei 600 gedeckelt; im hohen Bereich kann dadurch ein Plateau entstehen. Für 200 frühe Generationen wurden positive, strikt steigende Rewards und Mittel-XP unter 110 Gruppen-XP geprüft. Das sind Gruppen-XP, kein so hoher Betrag für jedes Mitglied.

Neue Werte bleiben deterministisch und werden beim Generieren eingefroren. Typ, Distanz und Variationsziehungen verwenden weiter die vorhandene deterministische Generierung. Der neue Versionsvertrag kennzeichnet die geänderten Empfehlungs-/Rewardgrenzen. Questdauer, XP-Kurve, Rekrutierungspreise, Items, Rollen und Combatwerte bleiben unverändert. Savevalidierung kennt sowohl den alten als auch den neuen exakt reproduzierbaren Questvertrag.

## Direkter Questabschluss

`adventure-flow.js` kapselt einen Abschluss über die vorhandenen autoritativen Operationen. **`finish-quest`** prüft den bestehenden Paid-Marker, führt bei Pending das bestehende Resolve aus, danach das bestehende Reward und Auto-Equip und setzt den UI-Rückkehrstatus. Das Eingabestate wird bei einem Fehler nicht teilweise verändert. Es gibt keinen neuen Rewardpfad neben den alten Buchungen.

**Begleiten:** Wenn die Quest fällig ist, öffnet sich das Ergebnis direkt über der Abenteueransicht. Es zeigt Erfolg/Rückzug/Fehlschlag, Überlebende, Verletzte, Tote, XP, Gold, Gilden-XP und konkrete Itemdrops. Solange noch Pending vorliegt, wird eine **deterministische, schreibfreie Vorschau** mit derselben vorhandenen `R.simulate`-Funktion, denselben Teilnehmern, Leiter und Quest-ID berechnet. Die Vorschau ändert keine Charaktere, keinen RNG-State, keinen Loot und keinen Kontostand. Der Test vergleicht sie exakt mit dem anschließend tatsächlich gespeicherten Resultat.

Ein Klick auf **„Quest abschließen“** übernimmt Resolve und Reward zusammen, löst die bestehenden Bindungen, speichert den fertigen Zustand und führt direkt in die Halle. Ein überlebender Leiter kehrt über den vorhandenen Hallenweg zurück; Tote erscheinen nicht lebend. Die alte zusätzliche Navigation Halle → Questliste → Auswertung → Belohnung entfällt. Bei einem bereits ausgewerteten, unbezahlten Altresultat wird nur die fehlende Buchung durchgeführt.

**Manager:** Eine hervorgehobene Abschlussmeldung steht unmittelbar **vor** der Halle und wird nicht mehr durch deren volle Bildhöhe und versteckten Overflow verdeckt. **„Ergebnis ansehen & abschließen“** bucht in einem Klick und zeigt anschließend den bezahlten Ergebnisbeleg. Dafür muss weder Questmenü noch Questkarte geöffnet werden. Die Questliste führt bei fälligen Quests ebenfalls zu diesem direkten Abschluss. Ein bereits bezahltes Ergebnis ist als übernommen gekennzeichnet und erzeugt keine weitere Buchung.

Die Reiseansicht zeigt nach Reload die Stärke der tatsächlich zugewiesenen Gruppe, statt bei leerer aktueller Gruppenauswahl fälschlich Stärke 0 anzuzeigen. Die Moduswahl „Abenteuer begleiten / Manager-Modus“ bleibt erhalten; eine Hochrisikowarnung erscheint weiterhin vor dieser Wahl.

## Dungeonabschluss und Zwischenentscheidungen

Die Dungeon-Orchestrierung `dungeon.js` bleibt bytegleich. Das gilt für vier Räume, Boss, HP-/Mana-Verhalten, gesicherte Beute, Rückzug, technische Abbrüche, IDs/Seeds, Tod und Rewards. Der neue Abschluss **`finish-dungeon`** verwendet den vorhandenen idempotenten `dungeon-claim` und danach Auto-Equip.

Bei einem endgültigen Ende in der beobachteten Expedition erscheint direkt das Ergebnisfenster mit **„Dungeon abschließen“**. Dies gilt für Bossabschluss, endgültige Niederlage und freiwilligen Rückzug nach einer Begegnung. Aus dem Manager-Modus ist derselbe Abschluss über die Hallenmeldung erreichbar; der bezahlte Beleg wird dort angezeigt.

**Decision bleibt eine echte Entscheidung.** Nach einem gewonnenen Zwischenraum wird kein Abschlussdialog erzwungen, kein Reward automatisch gebucht und kein weiterer Raum automatisch gestartet. „Weiter“ und „Dungeon verlassen“ bleiben separate bewusste Aktionen. Ein Abschlussversuch in Decision wird abgewiesen. Der vollständige Bosslauf mit neuer UI und direktem Claim wurde geprüft.

## Save, Reload, Migration und Idempotenz

Der vorhandene Store bleibt bestehen. Schlüssel sind weiterhin `guildgame.browser.save.primary` und `guildgame.browser.save.backup`. Primary/Backup, JSON-Import/-Export, Stale-Tab-Schutz, Offlinezeit und das **2-MiB-Limit** wurden nicht durch eine zweite Speicherlösung ersetzt.

V4.2A schreibt **`guildgame.browser.save.v4`** und ergänzt `adventureUI` mit `mode`, `watch` und `result`. Die Referenzen enthalten nur Typ und echte Quest-/Dungeon-ID; keine nachgebildeten Kämpfe oder Rewards. Sichtbare Effekte, Schrittphasen und Kamerapositionen bleiben abgeleitet. Die rein kosmetische Reisegeschwindigkeit bleibt wie zuvor nicht dauerhaft gespeichert; die echte Dungeonpause bleibt Teil des Combat-Saves.

Migration erfolgt V1 → V2 → V3 → V4 über die erhaltenen Validierungen. Bei V3 → V4 kommt nur der Standard-Ansichtsstatus hinzu; alle früheren Gameplayfelder bleiben exakt erhalten. Ein echtes, mit Original-V4.2-Modulen erzeugtes V3-Fixture prüft dies. Die vollständige V1-Kette bis zum direkten Abschluss eines alten Pending-Auftrags wurde ebenfalls geprüft. V4.2A ist kein Saveformat für einen Rückimport in V4.2; dafür vorher den alten Stand exportieren.

Reload im begleiteten Abenteuer stellt diese Ansicht wieder her. Ein gespeichertes offenes Ergebnisfenster erscheint erneut. Ein Pending-Ergebnis bleibt dabei Pending und unbezahlt; erst der Abschluss bucht es. Der gespeicherte Manager-Modus öffnet die Halle. Ein bereits bezahlter Beleg bleibt bezahlt. Importierte gültige Ansichtsreferenzen werden ebenso wieder aufgenommen; ungültige Referenzen werden abgelehnt.

Doppeltippen, erneutes Öffnen, Ansichtswechsel, Reload, Import/Export, alter Paid-State und bezahltes Backup wurden gegen zusätzliche Buchungen geprüft. Der vorhandene Paid-Marker bleibt maßgeblich. Ein manuell wiederhergestellter älterer unbezahlter Save stellt den **gesamten früheren Bestand** wieder her; es gibt kein externes globales Anti-Rollback-Ledger. Er wird nicht mit neueren Rewards addiert.

Nach einem erfolgreichen Abschluss wird genau ein fertiger State gespeichert – keine zwischengespeicherte halbe Resolve-/Reward-Transaktion. Falls localStorage gesperrt/voll ist oder ein anderer Tab neuer geschrieben hat, bleibt der vorherige Primary geschützt und der Fehler sichtbar. Wie zuvor kann die neue Buchung dann nur im Arbeitsspeicher liegen. Ein Ergebnisbeleg behauptet bei diesem Fehler nicht, bereits gespeichert zu sein. Offline läuft weiterhin höchstens der aktuelle Dungeon-Encounter bis zur nächsten Entscheidung; normale Quests werden fällig, aber nicht automatisch bezahlt.

## Prüfungen und behobene Integrationsfehler

| Suitenbereich | Erfolgreiche Checks |
|---|---:|
| Erhaltene V2–V4.1B-Suiten einschließlich aktueller Assetreferenzen | 512 |
| Erhaltene V4.2-Suiten einschließlich aktueller Assetreferenzen | 151 |
| Neue Balance-/Abschluss-/Save-Prüfungen | 25 |
| Neue visuelle Modell-/DOM-Prüfungen | 12 |
| Neue vollständige V4.2A-UI-Prüfungen | 21 |
| Neue Asset-/Source-Verträge | 60 |
| **Summe** | **781** |
| Zusätzliche JavaScript-Syntaxprüfungen | 16 |

Keine bestehende Suite wurde gelöscht oder fachlich abgeschwächt. In `assets-v41b.test.py` und `assets-v42.test.py` wurde ausschließlich die erwartete Cachekennung auf `v=4.2a` angehoben. Die bestehenden Assetlisten durchlaufen zusätzliche Dateien und ergeben deshalb zusätzliche Checks. `run-all.py` ergänzt vier neue Suiten. Die alten DOM-Suiten sind historische Kompositionstests, die neuen UI-Tests laden die vollständige V4.2A-Komposition.

Abgedeckt sind alle zehn Starterkombinationen, Level-1–4-Verhältnisse, neue Boards, besseres reales Equipment, Schwer/Elite, deterministische Rewards, neue Obergrenzen und unveränderte Altquests. Visuell prüfen Modelle die Richtungsansichten, Standhöhe/Schatten, Glättung ohne Teleportieren, stetige Schrittphase, Turn/Return, Rückweg-Blickrichtung, Tiefenskalierung, Reduced Motion, wiederverwendete DOM-Nodes und bytegleiche Combatstates unter Rendering.

Die neue UI-Prüfung umfasst direkten Watch-Abschluss, einteiligen Managerabschluss, Doppelclick, Pending-/Paid-Reload, laufenden View-Resume, Modusgleichheit, alten Ergebniszustand, Dungeonentscheidung, Rückzug, gesamten Bosslauf, speichern trotz UI-Wechsel, validierten Import und sichtbaren Speicherfehler. Die ursprünglichen Save-, Backup-, Combat-Golden-Vector-, Rekrutierungs-, Selling-, Progressions-, Itemvergleichs- und Hallentests laufen weiter.

Gefundene und behobene Integrationspunkte: Hinter der Halle unsichtbare Abschlussmeldungen; Stärke 0 bei wieder geöffneter zugewiesener Quest; fehlendes direktes Ergebnis nach manuellem Dungeonrückzug; weiterlaufende JS-Schritte bei visueller Pause; während des Rückwegs zum Gegner schauende Nahkämpfer; eine kleinere Rewardzahl auf früheren Mittelangeboten durch Typvariation; missverständlicher „gespeichert“-Text bei echtem Speicherfehler. Die endgültigen Läufe sind fehlerfrei.

## Assetherkunft und offene Grenzen

Neue Bilder wurden mit dem eingebauten **ImageGen-Werkzeug** erzeugt, angesehen und mit erhaltenem Alpha nach WebP (Qualität 88) konvertiert. Kein CLI-/API-Schlüsselpfad. Vollständige Prompts, Quelldateinamen, Abmessungen und CSS-Zeilenfenster stehen in `assets/V42A_ASSETS.json`.

Projektdateien:

- `assets/adventurers-directional.webp` – 1024×1536, transparenter Vier-Klassen-/Drei-Richtungen-Atlas.
- `assets/adventure-landscapes-v42a.webp` – 1536×1024, sechs breite eigene Fantasy-Umgebungen.

Briefings: vorhandene GuildGame-Identitäten als eigenständige Dreiviertel-/Profil-/Rückenfiguren mit leeren Händen erhalten; dazu sechs farbenfrohe gemalte Landschaften mit gemeinsamer Perspektive, freier Bodenfläche, warmem Licht und atmosphärischer Tiefe. Kein Fremd-IP-Material. Die originalen PNGs verbleiben im Arbeitsbereich; das Release referenziert ausschließlich die beiden lokalen WebPs.

Bekannte Grenzen: stilisierte 2D-Layer statt Skelettanimation; vereinfachte Ausrüstung; keine individuelle Filmsequenz pro Quest; gewöhnliche Quests bleiben die vorhandene abstrakte Simulation. Dungeon-Combatwerte skalieren weiterhin nicht mit Character-Level/Itemstärke. Der bereits laufende autoritative Kampf kann bei spätem Einstieg oder nach der Hallen-Abreise weiter fortgeschritten sein; alte Treffer werden nicht als neuer Kampf abgespielt. Effekte werden bei schneller Wiedergabe verdichtet. Lokale Savegröße und Speicherverfügbarkeit bleiben Grenzen. Es gibt keine neue Cloud-, Account-, Multiplayer-, Crafting-, Rang-E- oder Bossphasen-Funktion.

Die strukturelle Abnahme ist abgeschlossen. Die wahrgenommene Grafik-/Bewegungsqualität, iPhone-Safari-Layout, Touchbedienung und reale Bildrate bleiben offen. Diese Lieferung endet bei V4.2A.
