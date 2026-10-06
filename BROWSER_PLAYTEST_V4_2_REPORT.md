# GuildGame Browser Playtest V4.2 – Living Adventure

Stand: 6. Oktober 2026. Basis ist das fertige V4.1B-ZIP, SHA-256 `da941407f138b70a652d08897f7d4f719ba4dbfde62ed4e32af1811c08c9f9f2`. Es wurde in ein separates V4.2-Verzeichnis entpackt. Das Basis-ZIP und Unity-Projekte wurden nicht verändert. V4.2 ist ein statischer Browser-Playtest; keine Veröffentlichung wurde ausgeführt.

## Ergebnis und Abnahmestand

V4.2 verbindet eine gemeinsame Charakterdarstellung mit echten Gruppenleitern in der Halle, begleiteten normalen Quests und der dauerhaften Dungeonexpedition **Die Goblinmine**. Quest- und Dungeonansichten lassen sich jederzeit verlassen und später wieder öffnen. Das bestehende Training bleibt isoliert.

**647 automatisierte Prüfungen erfolgreich, 0 fehlgeschlagene Testkommandos; zusätzlich 14 erfolgreiche JavaScript-Syntaxprüfungen.** Die 24 Testsuiten bestehen aus den erhaltenen Regressionen und vier neuen V4.2-Suiten. Die alten Suiten prüfen bewusst ihre historischen Modulkompositionen. Zusätzlich prüft `ui-v42.test.cjs` die vollständige V4.2-Ladereihenfolge einschließlich neuem Save-Vertrag und allen Darstellungsschichten. DOM-Stubs sind keine gerenderte Browserabnahme.

Die installierte Playwright-Bibliothek wurde auf Chromium und WebKit geprüft. Beide Starts scheitern an fehlenden Browser-Binaries. Deshalb wurden **kein echter Browser, Safari, iPhone, Touch, Download-Dialog, WebMCP-Host, GitHub Pages oder Unity** abgenommen. Es gibt keine FPS-, GPU-, Layout- oder 60-FPS-Messung. Die mobile Gestaltung ist implementiert und statisch geprüft, aber visuell auf einem echten iPhone noch nicht bestätigt.

## Architektur und Verantwortlichkeiten

| Datei | Aufgabe |
|---|---|
| `character-presentation.js` | Gemeinsame `Scene`, stabile Identität, Equipment-Layer, Bewegungsfunktion und ereignisgesteuerte `CombatTimeline` |
| `adventure-hall.js` | Liest reale Gruppenleiter; benutzt das vorhandene Hallen-Wegenetz; Eingang, Portal, Rückkehr und Ruhe |
| `expedition-presentation.js` | Quest-Reisephasen sowie Liveansicht von vorhandenem Dungeon-/Trainingscombat |
| `dungeon.js` | Autoritative Run-IDs, Bindungen, Encounter, Entscheidungen, Rewards und Combat-Snapshots |
| `save.js` | Erweiterung des vorhandenen Save-Vertrags und der Migration um V3/Dungeon |
| `game.js` | Moduswahl, Portal, Dungeonvorbereitung, Ansichten, Benachrichtigungen und bestehende Speicheraktionen |
| `adventure.css` | Gemeinsame 2D-Figuren, Posen, Ausrüstung, Umgebungen, responsive Darstellung und Reduced Motion |

Die Darstellung liest Snapshots. Sie ruft weder `R.change` noch Combat-Schritte, Save-Operationen oder Gameplay-RNG auf. Klickaktionen werden von der bestehenden UI-Komposition an die autoritativen Regeln übergeben. Animationen produzieren weder Schaden noch Heilung, Tod, Loot oder Progression.

Der Dungeon benutzt **unverändert `combat.js`**. Es gibt keinen zweiten Combat-Kern und keine zusätzlichen Todeswürfe. Normale Quests benutzen weiterhin ihre vorhandene abstrakte Questsimulation; ihre Jagdszene ist eine ausdrücklich so benannte Darstellung und kein neu berechneter Echtzeitkampf.

## Figuren, Bewegung, Equipment und Halle

Alle spielbaren Szenen verwenden `GuildCharacterPresentation.Scene`: dieselbe Character-ID, Klasse und Ausrüstung ergeben dieselbe Figur. Die Identität wird deterministisch aus der ID abgeleitet: geringe Farbabweichung, Breitenvariation, Animationsphase und ein kleines Schmuckdetail. Sie wird nicht bei Szenenwechsel oder Reload neu ausgewürfelt. Dies sind Varianten von vier Klassen-Grundfiguren, keine individuell generierten Gesichter.

Die Figuren bestehen aus einer gemalten, waffenlosen Klassen-Atlasgrafik, sechs geclippten Körperteilen und separaten Waffen-, Oberkörper- und Bein-Layern. Sichtbar umgesetzt sind Schwert, Dolch, Stab und Keule; Rarity beeinflusst Tönung/Leuchten. Oberkörper und Beine tragen vereinfachte Rarity-Bänder. Die tatsächlich ausgerüsteten Definitionen stehen an den jeweiligen Layern. Nicht umgesetzt sind vollständige individuelle Rüstungsmodelle, 3D, echte Skelettanimation oder eine physikalische Waffenhand. Diese Vereinfachung gilt in allen Szenen gleich.

Bewegung nutzt `translate3d`, Beschleunigung, abbremsende Annäherung an Wegpunkte und Blickrichtungswechsel. Die Wegfunktion verändert nur lokale Darstellungspositionen. Gehen kombiniert Bein-/Armschwung, Körperbewegung und Schatten. Zusätzliche Zustände sind Idle, Prepare, Windup, Attack, Recovery, Cast, Heal, Hit, Interact, Sit, Down, EnterPortal und ExitPortal. Der gesamte Renderpfad hat eine gemeinsame `requestAnimationFrame`-Schleife; Combat läuft unabhängig davon.

In der Halle erscheinen nur reale, lebende Leiter gültiger, freigeschalteter Gruppen. Ohne Leiter bleibt die entsprechende Hallenfigur aus; der Gruppenstart bleibt trotzdem möglich. Mitgliederzahl wird nicht durch künstliche Leiter oder zufällige Besucher aufgefüllt. Gruppenleiter stammen aus `party.leader` und müssen zur Gruppe gehören. Tote fehlen, Verletzte ruhen bzw. gehen langsamer zum Ruheplatz.

Normale Questleiter bereiten sich vor, laufen zum Halleneingang und verschwinden erst am Ausgang. Dungeonleiter laufen zum Portal, leuchten kurz auf und treten ein. Bei Rückkehr kommen lebende Leiter vom richtigen Eingang bzw. Portal; das Portal reagiert auf Ein-/Austritt. Manageransicht und Begleiten benutzen denselben Hallenstatus. Beim begleiteten Start mit sichtbarem Leiter öffnet sich die Abenteueransicht nach dessen Abreise. Es wird kein Ersatzleiter erfunden, falls keiner gewählt ist.

## Normale Quests und Reiseansicht

Nach bestehender Risiko-Warnung und deren Bestätigung folgt die Wahl **Abenteuer begleiten / Manager-Modus**. Beide starten denselben vorhandenen Questdatensatz, mit denselben IDs, Teilnehmern, Anfangs-/Endzeiten, eingefrorenen Dynamic-Feldern, Rewardformeln und Seeds. Manager-Modus lässt den Spieler in der Halle. Die Halle listet aktuelle Expeditionen und bietet den Wiedereinstieg.

Reisephasen werden ausschließlich aus Status und `(clock - start) / duration` abgeleitet. Abreise umfasst die ersten 6 Prozent der Questzeit. Das Zielgebiet beginnt bei Nah nach 24 Prozent, Mittel nach 39 Prozent und Weit nach 56 Prozent. Unterwegs sind eine, zwei bzw. drei Umgebungsabschnitte sichtbar: Straße, Wald und Hügel. Das ist eine visuelle Aufteilung innerhalb der unveränderten Questdauer, keine Verlängerung oder neue Gameplay-Phase.

| Questtyp | Zielinszenierung |
|---|---|
| Sammeln | Wald, Sammelbewegung und Fundmarker |
| Lieferung | Straße, Übergabe am Zielmarker |
| Jagd | Lager, sichtbarer Gegnerkontakt und vorbereitende/angreifende Posen |
| Rettung | Hügel, Suchbewegung und Zielmarker |

Eine gemalte Umgebung, mehrere Gruppenfiguren, Gangbewegung, Staffelung, Vordergrund und leichte Parallaxe ersetzen eine reine Countdownansicht. Die Jagddarstellung zeigt vor der Auswertung weder erfundene HP noch Schaden, Heilung oder einen behaupteten Sieg. Das tatsächliche Questresultat bestimmt Ergebnis, Verletzung und Tod. Erst die vorhandene Resolve-Aktion erzeugt das Resultat; die vorhandene Reward-Aktion bucht es einmalig.

Nach Resolve läuft bei geöffneter Reise eine kurze Ergebnisphase und anschließend die Rückreise lebender Mitglieder. Tote sind in der Rückreise nicht enthalten. Die kurze kosmetische Rückkehrzeit wird nicht gespeichert; ein später wieder geöffnetes, bereits ausgewertetes Abenteuer zeigt den zurückgekehrten Zustand. Die eigentliche Reisezeit und der Questfortschritt werden aus dem gespeicherten Questdatensatz rekonstruiert.

**0/1/2/4 in der normalen Reise steuert nur die Animation.** Selbst mit angehaltener Reiseanimation erreicht eine fällige Quest ihren vorhandenen Pending-Zustand. „Zur Gilde“ und erneutes „Abenteuer ansehen“ ändern keine Gameplaydaten. Zielankunft und auswertungsbereiter Abschluss werden gemeldet.

## Portal und Goblinmine

Das Portal bietet das bisherige, folgenlose Training und den Dungeon. **Freischaltung: Gilden-Level 2.** Beim Erreichen über einen Reward erscheint die Portal-Freischaltung zusammen mit der Gilden-Levelmeldung; `portalAnnounced` verhindert eine neue Erstmeldung. Migrierte Saves ab Level 2 erhalten ein bereits freigeschaltetes Portal ohne nachträgliche Level-Up-Inszenierung.

Die Vorbereitung zeigt reale Gruppe, Leiter, Rollen, Stärke und Einsatzfähigkeit. Empfehlung: vier gesunde Mitglieder mit Tank, Heilung und Schaden; Management-Stärke 650. Diese Zahl ist eine Orientierung, kein Startzwang und keine Siegegarantie. Im unveränderten Combat-Kern zählen Klassenprofile und Gruppengröße. Level und Equipment erhöhen dort weiterhin keine Angriffswerte; Equipment ist Teil des bestehenden Combat-Fingerprints und bleibt sichtbar. Die UI nennt diese Grenze ausdrücklich.

| Raum | Gegner aus vorhandenem Combatkatalog | Gold | Gruppen-XP | Gilden-XP | Dropchance | Common/Uncommon/Rare |
|---|---|---:|---:|---:|---:|---|
| Die Torwache | Nahkampf + Fernkampf | 35 | 65 | 22 | 20 % | 75/23/2 % |
| Die Förderstrecke | 2 Nahkampf + Fernkampf | 45 | 80 | 28 | 25 % | 65/30/5 % |
| Der Erzbrecher | 2 Brutes + Fernkampf | 60 | 105 | 40 | 30 % | 45/45/10 % |
| Grubenkönig Grak | Boss + Brute + Fernkampf + Nahkampf | 90 | 160 | 65 | 45 % | 25/50/25 % |

Der Boss benutzt `enemy.goblin.boss`, eine größere Figur und einen eigenen HP-Balken. Es gibt keine neuen Bossphasen oder erfundenen Kampfregeln. Raum drei bildet die Elitebegegnung mit vorhandenen Brute-Profilen.

Nach einem Sieg in Raum 1–3 wartet der Run im Status **Decision**. „Weiter“ startet genau einen neuen Raum; „Dungeon verlassen“ sichert den Rückzug. Ein erwarteter Raumindex schützt gegen doppelte bzw. veraltete Weiter-Klicks. Es gibt keine automatische Weiterentscheidung – auch offline nicht. Rückzug während laufendem Kampf ist nicht vorgesehen und in der UI nicht angeboten.

**HP lebender Teilnehmer werden in den nächsten Raum übernommen. Mana startet entsprechend dem bestehenden Combat-Konstruktor neu.** Stabilisierte Mitglieder bleiben für den restlichen Run außer Gefecht; kein Wiederbeleben. Lebensfolgen werden am Encounterende aus dem Combat-Snapshot in den Kader projiziert. Die Liveansicht zeigt schon während des Kampfes den wirklichen Combatzustand. Kader-/Equipmenttransaktionen bleiben während des Runs gesperrt. Erholung verwendet die vorhandenen 120 Sekunden für kampfunfähig gewordene Überlebende; bei späteren Raumabschlüssen bleibt mindestens diese Rückkehr-Erholungszeit bestehen.

Quests in Active/Pending und Dungeons in Combat/Decision teilen dieselben vorhandenen Einsatzlimits. Die Bindung gilt gleichzeitig für Gruppe, Leiter, Teilnehmer, Transfer, Auflösen, manuelles Equipment und Training. Auto-Equip überspringt Gebundene; freie Mitglieder, Rekrutierung und das Questbrett bleiben nutzbar. Unbezahlte abgeschlossene Dungeonrewards verhindern eine erneute Dungeonbelegung derselben Teilnehmer und das Entfernen ihrer toten Rewardempfänger.

## Determinismus, Livecombat und Moduswechsel

Dungeon-IDs sind monoton `browser.dungeon.00000001` usw. Die Regelversion lautet `dungeon.goblinmine.v1`. Der Encounterseed entsteht aus den ersten 64 Bits von `R.hash(version, runID, roomIndex, 'combat')`. Ein gespeicherter Snapshot enthält ursprüngliche Inputs, Seed, vollständigen Combatstate, Tick, Pending-Millisekunden und Geschwindigkeit.

Die Orchestrierung rehydriert genau diesen Snapshot; Anschauen konstruiert keinen neuen Run und setzt keinen RNG zurück. Der UI-Timer verarbeitet verstrichene Spielzeit unabhängig von der offenen Seite. 1×/2×/4× verändern die Rate, mit der dieselbe Tickfolge abgespielt wird. Pause 0 bleibt gespeichert und gilt auch nach Rückkehr in die Halle. Beim Fortsetzen wird die pausierte Zeit nicht nachgeholt.

Der Combatadapter übernimmt echte Events mit Actor, Target, Tick, Art, Betrag und Crit sowie das danach gültige Snapshot. Nahkämpfer nähern sich, holen aus, treffen und kehren zurück; Zauber-/Heilklassen wirken aus ihrer Reihe, Projektil und Trefferzahl beziehen sich auf das echte Event. Die dargestellten HP wechseln an der Kontaktphase des Pakets. Die Kontaktzeit beträgt `0.66 / speed * 0.55` Sekunden; der Gameplaystate wartet darauf nicht. Verletzung, Status, Mana und Tod stammen aus dem Core. Bei spätem Einstieg wird sofort der aktuelle Snapshot gezeigt und kein historischer Treffer erneut abgespielt.

Bei 4× oder größeren Timerlücken werden Events zusammengefasst. Es wird keine vollständige Animation jedes übersprungenen Ticks garantiert. Die letzte Core-Wahrheit bleibt maßgeblich; begrenzte Effektwarteschlangen dürfen visuelle Details verwerfen, niemals Gameplayereignisse erzeugen. Bildschirmwechsel, DOM-Neumounts und Raumwechsel sind getrennt behandelt, damit ein normales Neuzeichnen keine noch ausstehende Kontaktanimation verliert und der nächste Raum keine alten Effekte übernimmt.

## Beute, Lebensfolgen und Einmaligkeit

Jeder tatsächlich gewonnene Raum ergänzt `secured`; eine Niederlage oder ein technischer Abbruch ergänzt keinen Siegbonus für diesen Raum. Beim Rückzug bleiben bereits gesicherte Raumrewards erhalten. Nach einem Boss-Sieg kommen **100 Gold, 150 Gruppen-XP, 60 Gilden-XP und ein garantiertes Rare-Equipment** aus dem vorhandenen Katalog hinzu. Vollständiger Sieg: **330 Gold, 560 Gruppen-XP, 215 Gilden-XP**, reguläre Raumdrops und das Rare-Bonusitem.

Raumdrops benutzen `GuildProgression.loot` mit den zentralen Chancen. Die Ziehungen sind nach Regelversion/Run/Raum/`loot`/Domäne getrennt; der Rare-Bonus wird aus einem eigenen `boss-loot`-Hash ausgewählt. Keine neuen Itemdefinitionen, keine Auswertung beim Rendern.

Nach Ende werden Rewards einmal über `dungeon-claim` gebucht und `paid` gesetzt. Gold, Lootinstanzen, Tränke und Gilden-XP benutzen die vorhandenen Bestände/Zähler. Charakter-XP sind `floor(Gruppen-XP / ursprüngliche Teilnehmerzahl)` je noch lebendem Teilnehmer, begrenzt auf die vorhandenen 630 XP; Tote erhalten keine XP. Gilden-XP bleiben auf 1000 begrenzt. Level und Skillpunktberechnung bleiben bestehend. Die UI führt danach das vorhandene Auto-Equip aus.

Ein erneuter Claim liefert denselben State unverändert zurück. Reload vor Claim bewahrt den Anspruch; Reload nach Claim bewahrt die Buchung. Tote entstehen ausschließlich durch den Combatkern. Ihr ausgerüstetes Equipment und ihr zugeteilter Trank werden genau einmal in den vorhandenen Bestand zurückgegeben. Kein Wiederbeleben beim Ansichtswechsel, keine zweite Death-Roll.

## Save-Vertrag und Migration

V4.2 schreibt **`guildgame.browser.save.v3`**. Die Storage-Schlüssel bleiben bytegenau `guildgame.browser.save.primary` und `guildgame.browser.save.backup`. Der vorhandene Store mit Primary/Backup, validiertem Import, Export, Offlinezeit, Quota-/Speicherfehlern und Schutz vor einem neueren anderen Tab bleibt in derselben Datei.

V2 → V3 prüft zuerst den vorhandenen V4.1B-Vertrag und fügt ausschließlich das leere `expeditions`-Objekt plus neue Versionskennung hinzu. Alte Quests, Frozen-Dynamic-Felder, Inventar, IDs, Kader, XP, Gruppen und Zähler bleiben identisch. V1 geht weiterhin über die erhaltene V1→V2-Migration und anschließend V3. Das echte V4.1B-Fixture wurde mit den Originalmodulen erzeugt; die neue Migration erzeugt es nicht selbst.

Runstatus: Combat, Decision, Completed, Retreated, Defeat, Wipe oder TechnicalAbort. Gespeichert werden Gruppenzuordnung, ursprüngliche Teilnehmer/Leiter, Start/letzte Zeit, Raum, laufender Combat, abgeschlossene Encounter, gesicherte Rewards, Endrewards und `paid`. Routenpositionen, Effekte und kurzlebige Darstellungswarteschlangen werden bewusst abgeleitet.

Import validiert Struktur, IDs, Grenzen, Bindungen, Eingaben, Folgeraum-HP/Equipment, Seed, Rewards und vollständige Combatstates. Für die tiefe Prüfung wird die identische Tickfolge ab den ursprünglichen Inputs nachgerechnet und mit dem gespeicherten State verglichen; **das ersetzt oder verändert keinen Live-Snapshot**. Ein Cache mit maximal 64 exakt serialisierten, bereits geprüften Snapshots begrenzt wiederholte Validierungskosten. Veränderte HP, Tick, Klasse, Seed oder gesicherte Rewards werden abgelehnt.

Offline wird nur ein aktuell laufender, nicht pausierter Encounter bis zu seinem Ende weitergeführt. Danach wartet der Dungeon an der nächsten Entscheidung bzw. beim Endergebnis. Keine automatische Raumwahl und kein Auto-Claim. Pausierter Kampf und offene Zwischenentscheidung bleiben stehen. Normale Quests benutzen ihr vorhandenes Offline-/Pending-Verhalten.

Die vorhandene Import-/Savegrenze von **2 MiB** bleibt bestehen. Dungeonhistorie ist zusätzlich auf 500 Runs begrenzt; je nach Historie kann die Bytegrenze deutlich früher erreicht werden. Es gibt keine Historienkompression oder Archivierungsfunktion. Ein voller/gesperrter lokaler Speicher wird gemeldet; das vorherige gültige Primary bleibt geschützt. Wie bisher können Änderungen bei Speicherfehlern zunächst nur im Arbeitsspeicher vorhanden sein. Ein Export ist kein erfolgreicher Autosave.

## Performance, mobile Gestaltung und Reduced Motion

Alle Assets sind lokal. Keine Laufzeit-CDNs, kein Backend, keine externe Framework-Abhängigkeit. Die 14 Grafiken belegen insgesamt **2.062 MiB**. Die zwei neuen WebPs belegen zusammen ungefähr 1 MiB. Die übrigen Assets bleiben unverändert.

Figurennodes sind nach Character-ID gecacht. Körpergrafik wird nur bei neuer Identität oder Equipment-Signatur neu erzeugt. Frames aktualisieren Transform, Opacity und angezeigte Werte; es gibt kein `innerHTML`-Neubauen der gesamten Szene pro Frame. Layergrößen werden beim Mount bzw. per ResizeObserver ermittelt. Keine absichtlichen Left/Top-Daueranimationen. Die aktuelle Scene entfernt verlassene Figuren und abgelaufene Effekte.

Grenzen: maximal 24 Effekt-DOM-Nodes, 24 Zahlen, 36 Animationseinträge und 8 noch nicht angezeigte Combatpakete; höchstens sechs Kämpfer je Seite, reale freigeschaltete Gruppenleiter in der Halle. Hallenbewegung begrenzt große visuelle Deltas auf 0,1 Sekunden. Dungeonzeit ist davon unabhängig. Autosave erfolgt bei Transaktionen/Entscheidungen und während laufender Dungeons etwa alle fünf Sekunden, zusätzlich bei den vorhandenen Seiten-/Sichtbarkeitsereignissen.

CSS berücksichtigt Landscape bis 550 Pixel Höhe, kompaktere Figuren und Seitenleiste, mindestens 48-Pixel-Abenteuerbedienelemente sowie die vorhandenen Safe-Area-/Viewport-Regeln. Zielgerät bleibt iPhone 16 Pro im Querformat. Reduced Motion deaktiviert Daueranimationen, Parallaxe und Übergänge; Melee bleibt räumlich ruhig und Projektile entfallen. Autoritative Tickfolge und Resultate bleiben gleich. Eine gemessene Bildrate oder echte Touch-Ergonomie wird nicht behauptet.

## Dateien und Baseline

Geändert: `game.js`, `index.html`, `save.js`, `tests/run-all.py`, `tests/assets-v41b.test.py`. Am letzten Test wurde ausschließlich die ausdrücklich verlangte Cacheversion von `v=4.1b` auf `v=4.2` umgestellt. Seine Prüfungen wurden nicht entfernt. Die dynamischen Assetlisten laufen jetzt außerdem über die neuen Referenzen.

Neu: die vier neuen JavaScriptmodule, `adventure.css`, die beiden WebP-Assets, vier V4.2-Testsuiten, `tests/fixtures/v41b-save-v2.json`, `tests/fixtures/v41b-protected-sha256.json`, `tests/fixtures/V42_PROVENANCE.md` und die vier V4.2-Begleitdateien. Die vier neuen JavaScriptmodule sind Character Presentation, Adventure Hall, Expedition Presentation und Dungeon. Der Hashvergleich enthält die abschließende Dateiliste.

Bytegleich geschützt sind `rules.js`, `progression.js`, `recruitment.js`, `dynamic-quests.js`, `combat.js`, `skills.js`, `hall.js`, `hall-view.js` und alle zwölf ursprünglichen Assets. Die vorhandenen CSS-Dateien bleiben ebenfalls bytegleich; neue Regeln stehen separat. Das alte Hallenmodell bleibt für Regressionen vorhanden, während die vollständige App den neuen Leader-Adapter nutzt. Unity-Dateien liegen außerhalb dieses Pakets und wurden nicht bearbeitet.

`V4_2_BASELINE_COMPARISON.json` enthält SHA-256, Größe und Status jeder Baseline-/Release-Datei sowie explizit geschützte Dateien. Das Manifest selbst und das umschließende ZIP sind von ihrer eigenen Inhaltsliste ausgenommen, um zirkuläre Hashes zu vermeiden. `index.html` liegt direkt in der ZIP-Wurzel. Alle externen HTML-Script-/Stylesheetreferenzen verwenden `?v=4.2` und relative Pfade. Kein Deployment wurde vorgenommen.

## Testumfang und behobene Integrationsfehler

| Gruppe | Erfolgreiche Prüfungen |
|---|---:|
| Erhaltene V2–V4.1B-Suiten, einschließlich zusätzlicher Assetreferenzen | 501 |
| Dungeon, Sperren, Determinismus, Save und Migration | 46 |
| Character Presentation, Halle, Bewegung, Rückkehr und DOM-Caches | 24 |
| Vollständige V4.2-UI-Komposition | 20 |
| Neue Asset-/Source-/Baseline-Verträge | 56 |
| **Summe** | **647** |
| Zusätzliche JS-Syntaxprüfungen | 14 |

Die ursprüngliche Baseline hatte 484 Checks; zusätzliche Script-/Stylesheetreferenzen ergeben in bestehenden Assetprüfungen 17 weitere Checks. Vier neue Suiten ergänzen 146. Es wurde keine alte Suite gelöscht oder fachlich abgeschwächt.

Geprüft sind insbesondere 1×/2×/4×-Resultatgleichheit, Pausieren/Resume ohne Zeitnachholung, Framepartitionen, Managerbetrieb ohne Renderer, wiederholter Ansichtswechsel, Offline-Stopp, alle vier Räume und Boss, HP-Übernahme, keine doppelte Raumentscheidung, Rückzug, vollständige Auszahlung und Claim nach Reload. Save-Roundtrips betreffen Reise, Pending, vor/nach normalem Reward, Combat, Entscheidungen, Boss und Dungeonclaim. Assertions vergleichen vollständige States und damit IDs, Equipment, Gold, XP, Lebensfolgen und Bindungen. Ein tatsächliches ausgerüstetes Item wird durch einen Core-Todesfall auf exakt einmaligen Bestandserhalt geprüft.

Darstellungstests prüfen echte Leader, keine Fake-Leader, verletzte/tote Leiter, Eingang/Portal, identische IDs/Equipment-Layer, Read-only-Szenen, Kontaktzeit/HP, Melee-Abfolge, Late Entry ohne Replay, begrenzte Warteschlangen und stabile DOM-Nodes. Die integrierten UI-Tests prüfen auch Importablehnung, Stale-Tab-Schutz, Portal-Unlockmeldung und einen vollständigen Mine-Durchlauf mit Reloads und einmaligem Claim.

Während der Integration behoben: Verlust einer noch ausstehenden Kontaktanimation beim Neuzeichnen; Übernahme alter Effekte in einen neuen Raum; tote Questmitglieder in der Rückreise; durch normale Level-Up-Meldung verdeckte Portal-Freischaltung; fehlender Boss-Hinweis und sichtbarer Portal-Austritt. Zwei zunächst fehlerhafte Testannahmen wurden korrigiert: ein Zeitpunkt lag schon nach Encounterende, und eine CSS-Prüfung erfasste auch statische Regeln außerhalb der Keyframes. Der endgültige Lauf ist fehlerfrei.

## Assetherkunft und Grenzen

Neue Rasterbilder wurden mit dem verfügbaren ImageGen-Werkzeug erzeugt und lokal als WebP abgeleitet. Briefing des Umgebungsatlas: sechs getrennte, zusammenpassende gemalte Fantasy-Szenen – Straße, Wald, Hügel, Lager, Höhleneingang und Mineninneres – in einem 2×3-Atlas, ohne UI/Text. Briefing des Figuren-Edits: vorhandenen Vier-Klassen-Atlas als Referenz beibehalten und sichtbare Waffen entfernen, damit reale Equipment-Layer ergänzt werden können; transparenter Hintergrund. Die ursprünglichen Bilder bleiben bytegleich erhalten.

Die Präsentation ist ein 2D-Puppen-/Atlasaufbau mit vereinfachter Ausrüstung. Normale Quests bleiben abstrakte Quests; nur Training und Dungeon zeigen autoritativen Livecombat. Dungeon-Kampfwerte skalieren weiterhin nicht mit Character-Level/Itemstärke. Managerstatus ist textuell mit Wiedereinstieg; es gibt keine zweite parallel animierte Welt. Keine dauerhaft gespeicherten Kamerapositionen oder Frame-Replays. Die maximale Savegröße und lokale Browser-Speicherbedingungen bleiben echte Grenzen.

Die finale Paketprüfung entpackt das ZIP, führt dieselben Suiten erneut aus und vergleicht anschließend alle finalen ZIP-Einträge mit den Quelldateien. Das vollständige Protokoll dokumentiert den ausgeführten Umfang und die nicht ausführbaren Browserstarts. Eine manuelle Geräte-/Deploymentabnahme steht weiterhin aus. V4.2 endet mit dieser Lieferung; keine Folgephase gestartet.
