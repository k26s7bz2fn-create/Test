# Browser-Playtest V4.1B – Dynamic Quests

Abgeschlossen am 6. Oktober 2026. Verbindliche Basis: `GuildGame_BrowserPlaytest_V4_1A_PersistentProgression.zip`, in ein separates Verzeichnis entpackt. V4.1A und sämtliche Unity-Verzeichnisse wurden nicht bearbeitet. Keine Veröffentlichung ausgeführt.

## Ergebnis und tatsächlicher Prüfstand

Neue Boards erzeugen dynamische, danach eingefrorene Questanforderungen und Belohnungen. Bestehende V4.1A-Quests bleiben semantisch unverändert. Versionierte lokale Saves, Primary/Backup, Import/Export, Offlinezeit, Rekrutierung, Equipment, Selling, Gildenlimits, Hallendarstellung und Combat bleiben erhalten.

**484 automatisierte Prüfungen/Checks, 0 Fehler; zusätzlich 10 erfolgreiche JavaScript-Syntaxprüfungen.** Der vollständige ausführbare Testlauf liegt in `BROWSER_PLAYTEST_V4_1B_TEST_OUTPUT.txt`. Es gab keinen echten Browser-, Safari-, iPhone-, GitHub-Deployment- oder Unity-Test und keine Messung der Bildrate. Die Oberflächenprüfungen verwenden DOM-Stubs.

## Progressionsbasis und eingefrorener Vertrag

Neue zentrale Konfiguration: `dynamic-quests.js`, Regelversion `browser.quests.v4.1b`.

`BenchmarkPower = max(Gildenminimum, Summe der bis zu 6 stärksten lebenden, zum angegebenen Spielzeitpunkt genesenen Mitglieder)`.

Verwendet wird unverändert `GuildProgression.power`. Questgebundene, genesene Mitglieder zählen als entwickelter Kader weiter mit. Tote und noch verletzte Mitglieder zählen nicht. Bei weniger als sechs Mitgliedern wird nur der vorhandene Kader summiert. Die maximale Partygröße bleibt wie in V4.1A sechs auf allen Gilden-Leveln. Es gibt keine neu erfundene Gruppengrößenfreischaltung.

| Gilden-Level | Benchmarkminimum |
|---|---:|
| 1 | 260 |
| 2 | 400 |
| 3 | 600 |
| 4 | 850 |
| 5 | 1100 |

Der Benchmark hängt nicht von ausgewählter Gruppe, Leiter, Kaderreihenfolge, UI-Zustand oder Combat-RNG ab. Die übergebene virtuelle Zeit bestimmt ausschließlich Genesung, nicht Zufallswerte. Ein neues Spiel erzeugt das erste Board bei leerem Kader mit Minimum 260. Die drei Starter erhöhen dessen Werte nicht rückwirkend.

`questBoard` speichert `benchmarkPower`, `guildLevelAtGeneration`, `generationSequence`, `rulesVersion`. Die Generation ist `ceil(offerSeq/4)`; sie steigt pro Viererboard. Jede neue Quest enthält eine Kopie dieser Daten sowie ihre individuellen eingefrorenen `guildXP`, `drop`, `rarities` und `variation` im Feld `dynamic`. Empfohlene Stärke, Gold, Gruppen-XP, Dauer, Typ und Distanz stehen weiterhin direkt an der Quest.

Die Validierung akzeptiert für diesen Vertrag einen Benchmark bis 10.000; das ist eine Schutzgrenze oberhalb des legal erreichbaren F-Rang-Kaders, kein zusätzlicher Spielwert. Neues Equipment, Level-Ups, Recruitment und Gildenaufstiege verändern bestehende Questinstanzen nicht. Nur `offers` erzeugt neue Werte. Es ersetzt nur `Available`; aktive, pending und historische Quests einschließlich Resultaten, Paid-Markern und Bindungen bleiben erhalten.

## Anforderungen und Schwierigkeit

`Empfohlene Stärke = max(Mindeststärke, round(Benchmark × Difficulty-Multiplikator))`.

| Stufe | Powerfaktor | Mindeststärke | Rewardfaktor | Dauer |
|---|---:|---:|---:|---:|
| Leicht | 0,70 | 180 | 0,85 | 60 s |
| Mittel | 0,95 | 240 | 1,00 | 75 s |
| Schwer | 1,25 | 320 | 1,12 | 90 s |
| Elite | 1,65 | 420 | 1,25 | 120 s |

Jedes Board enthält genau eine Quest pro Stufe. Typ und Distanz werden unabhängig voneinander und von der Schwierigkeit aus getrennten Hash-Domänen gewählt. Jeder der vier Typen kann an jeder Distanz mit jeder Schwierigkeit auftreten. Die 48 Kombinationen werden getestet. Der Questname folgt dem Typ, nicht der Schwierigkeit.

Management-Stärke bleibt unverändert: HP-Basis + 4 × Angriffsbasis + 6 × Verteidigungsbasis + 25 × (Level − 1) + 10 × klassengeeignete Equipment-Suitability. Keine neuen Item- oder Combatstats.

## Deterministische Variation

Die vorhandene Funktion `R.hash` wird mit expliziten Eingaben aufgerufen: Regelversion, GenerationSequence, Index im Viererboard und Domäne `type`, `distance` oder `reward`. Die ersten acht Hexzeichen ergeben `u = uint32 / 2^32`. Rewardvariation: `v = 0,95 + 0,10 × u`.

Damit liegt die Variation bei −5 % bis knapp +5 %. Typ/Distanz- und Rewardwürfe beeinflussen einander nicht. Kein `Math.random`, keine Systemzeit als Seed und kein Combat-RNG. Der bestehende Quest-Simulations-RNG-Vertrag mit Quest-ID und seinen bestehenden Domänen bleibt unangetastet. Erzeugte Werte werden gespeichert.

## Gold, Charakter-/Gruppen-XP und Gilden-XP

Mit empfohlener Stärke `Q`, Rewardfaktor `F`, Distanzfaktor `D`, Typfaktor `T` und Variation `v` gilt:

- Gold: `max(1, round((20 + 0,04 × Q) × F × D × T_gold × v))`.
- Gruppen-XP: `min(600, max(1, round((30 + 0,10 × Q) × F × D × T_xp × v)))`.
- Gilden-XP: `max(1, round((8 + 0,022 × Q) × F × D × T_guild × v))`.

Alle Rewards sind positive sichere Ganzzahlen. Gold und Gilden-XP werden wie zuvor nur bei erfolgreicher, nicht vollständig ausgelöschter Gruppe gewährt. XP-Verteilung bleibt `floor(Gruppen-XP × Ausgangsfaktor / Teilnehmerzahl)`, für Tote null. Ausgangsfaktoren unverändert: Erfolg 1, Rückzug 0,35, sonst 0,20, Wipe 0. Der Cap von 600 verhindert selbst bei einem einzelnen überlebenden Anfänger einen Sprung von XP 0 auf F10 durch genau eine Quest.

| Questtyp | Gold | Gruppen-XP | Gilden-XP | Drop-Änderung |
|---|---:|---:|---:|---:|
| Gathering | 1,00 | 0,90 | 1,00 | +0,03 |
| Delivery | 1,15 | 0,95 | 1,00 | −0,03 |
| Monster Hunt | 1,00 | 1,15 | 1,00 | +0,03 |
| Rescue | 0,95 | 1,10 | 1,20 | 0 |

| Distanz | Gold/XP/Gilden-XP |
|---|---:|
| Nah | 0,95 |
| Mittel | 1,00 |
| Weit | 1,15 |

Die Charakter-XP-Schwellen bleiben `[0,30,70,120,180,250,330,420,520,630]`. Die Gilden-XP-Schwellen bleiben `[0,80,240,520,1000]`; maximale Gilden-XP bleiben 1000. Kein neuer Rang und kein Gilden-Level über 5.

## Loot und Rarity

Bestehende sechs Equipmentfamilien und Heiltränke, insgesamt sieben unabhängige Dropprüfungen. Keine neue Itemarchitektur, Rarity oder Combatwirkung.

`Wachstum = clamp((Q − 240) / 4000, 0, 1)`.

`Dropchance = clamp(Basisdrop + Wachstum × 0,06 + Typdrop + (D − 1) × 0,05, 0, 0,65)`.

| Stufe | Basisdrop | Uncommon | Rare-Basis |
|---|---:|---:|---:|
| Leicht | 30 % | 5 % | 0 % |
| Mittel | 38 % | 28 % | 2 % |
| Schwer | 46 % | 50 % | 10 % |
| Elite | 54 % | 55 % | 25 % |

`Rare = min(0,30, Rare-Basis + Wachstum × 0,04 × Faktor)`; Faktor 0,25 für Leicht, sonst 1. `Common = 1 − Uncommon − Rare`. Der zentrale Rare-Cap ist 30 %, aktuell werden höchstens 29 % erreicht. Distanz garantiert keine Rarity. Die Wahrscheinlichkeiten gelten bedingt auf einen Drop der jeweiligen Equipmentfamilie. Tränke bleiben ohne Rarity, Menge zwei; Equipmentmenge eins.

## Risiko und Simulation

Risikoanzeige unverändert aus Gruppenstärke/empfohlener Stärke: ab 1,50 „Deutlich stärker“, ab 1,20 „Niedriges Risiko“, ab 0,90 „Angemessen“, ab 0,65 „Hohes Risiko“, darunter „Extremes Risiko“. Unter 0,90 bestätigt der Spieler den Start ausdrücklich. Keine harte Power-Sperre.

`rules.js` ist bytegleich zur Basis. Die bestehende Simulation liest bereits `q.recommended`; dynamische Werte gehen dadurch direkt in Ratio, Überlast und die bisherigen Ergebnisfolgen ein. Rollenbonus, Leiter, Persönlichkeit, Rückzug, Verletzung, Kampfunfähigkeit, Stabilisierung, Tod und Wipe wurden nicht geändert. `P.tier(q)` liefert für dynamische Quests die gespeicherten Gilden-XP und Lootparameter; für Legacyquests bleibt der alte V4-Vertrag erhalten.

## Save-Kompatibilität und Migration

V4.1A persistiert Gold/XP/Power/Dauer pro Quest, aber **nicht** deren eigene Gilden-XP, Lootchancen oder Boardmetadaten. Außerdem verlangt seine Validierung exakte feste V4-Balancewerte. Deshalb ist ein erweitertes, explizites Schema nötig: `guildgame.browser.save.v2`, zentral in `save.js`.

Beide Storage-Keys bleiben exakt gleich: `guildgame.browser.save.primary` und `guildgame.browser.save.backup`. Die übergeordnete Management-Regelversion bleibt `browser.progression.v4`; die neue Generation trägt zusätzlich ihren eigenen gepinnten Questvertrag.

`migrateSave()` validiert V1 zuerst vollständig nach dessen bisherigem Vertrag. Erst dann kopiert es die Daten, setzt V2, ergänzt `questBoard: null` und pro alter Quest `dynamic: null`. Keine anderen gespeicherten Werte werden geändert, keine IDs ersetzt, kein Resultat simuliert und kein Reward erzeugt. Alte nicht gespeicherte Loot-/Gilden-XP-Parameter stammen weiterhin aus der byteinhaltlich erhaltenen V4-Tiertabelle. Sie werden nicht auf V4.1B-Werte umgestellt.

Laden migriert zunächst nur im Speicher. Beim nächsten erfolgreichen Save behält der bestehende Writer den gültigen vorherigen Primary als Backup. Beschädigte Daten werden nicht „repariert“. Unbekannte Versionen bleiben abgewiesen; ein gültiges V1-Backup funktioniert weiter. Neue dynamische Verträge werden strikt auf Typen, Gegenwerte, ID/Generation, Boardkonsistenz und eingefrorene Formelergebnisse geprüft. Dieser Vergleich dient der Validierung; gespeicherte Questwerte werden beim Laden nicht überschrieben oder an den aktuellen Kader angepasst. Künftige Balanceänderungen benötigen eine neue Questregelversion und müssen diesen bisherigen Validator erhalten.

Offlinezeit bleibt gespeicherte virtuelle Zeit plus positive reale Differenz. Abgelaufene aktive Quests werden nur `CompletedPendingResolution`. Sie bleiben gebunden und unbezahlt. Autosave, Import/Export, bestätigte Neue Gilde, Speicherfehler und Schutz vor veralteten Tabs laufen über die bestehenden Pfade. Ein Refresh erzeugt keinen gesonderten Schreibweg. Fehlgeschlagenes Autosave meldet wie V4.1A den Fehler sichtbar; der neue Zustand kann dann im Arbeitsspeicher existieren, ohne dauerhaft gespeichert zu sein.

Der geprüfte V1-Fixturesave wurde tatsächlich mit den unveränderten V4.1A-Modulen erzeugt und mit deren Validator bestätigt. Er enthält zwölf bezahlte Resultate, eine pending Quest, eine aktive Quest und zwei Angebote, außerdem Equipment, Lager, Pools und Gruppen. Migration, Offlinefortschritt, alte Resultate und erneut importierbarer Export werden geprüft. Ein V2-Export ist nicht rückwärts in V4.1A lesbar.

## Modellablauf und Ökonomie

Ein vollständiger Transaktionsablauf startet ohne künstliches Startgold oder nachträgliche XP-Gutschriften: drei Starter → Gruppe → leichte Quests → Rewards → Save/Reload → manueller Equipmentvergleich/-wechsel → Lootverkauf → weitere Quests → Charakter- und Gilden-Level-Up → bezahlter Level-2-Rekrut → zweite Gruppe → dynamische mittlere/schwere Quests → Save/Reload → Gilden-Level 5.

Er erreicht Level 5 nach 20 erfolgreichen Quests. Der Benchmark steigt von 264 auf 1984; erste leichte Empfehlung 185, spätere schwere Empfehlung 2480; Questgold wächst von 23 auf 156. Der Endbestand beträgt 1707 Gold nach dokumentiertem Verkauf, Poolsuche und Rekrutierung. Das Szenario erzwingt Erfolg, keine Verletzungen und reichliche Drops über den bestehenden Test-RNG-Eingang. Es prüft den Ablauf und die Buchungen, **nicht** die erwartete Anzahl real gespielter Versuche oder perfekte Balance. Der separate unmanipulierte Simulationslauf über 200 deterministische Boards mit den drei ursprünglichen Startern ergab 194 leichte und 107 Elite-Erfolge; Elite ist riskanter, aber kein garantierter Fehlschlag.

Ein Level-8-Rekrut kostet unverändert 800 Gold. Für 200 mittlere Angebote bei Benchmark 3000: mittleres Questgold 142,435 (117–186); etwa **5,62 erfolgreiche Quests** ohne Lootverkauf. Eine einzelne normale Quest finanziert ihn damit nicht.

Zusätzliche 100-Board-Stichproben, jeweils Mittel:

| Benchmark | Ø Gold | Ø Gruppen-XP | Ø Gilden-XP | Erwarteter Erlös, wenn sämtliche Drops verkauft werden | 800 Gold: nur Questgold / plus alle Drops |
|---|---:|---:|---:|---:|---:|
| 260 | 31,75 | 58,33 | 14,61 | 36,86 | 25,20 / 11,66 |
| 600 | 45,49 | 92,74 | 22,30 | 37,57 | 17,59 / 9,63 |
| 1100 | 65,65 | 143,51 | 33,72 | 38,62 | 12,19 / 7,67 |
| 2000 | 102,03 | 234,70 | 54,16 | 40,56 | 7,84 / 5,61 |
| 3000 | 142,37 | 336,04 | 76,91 | 42,76 | 5,62 / 4,32 |

Die frühe Level-8-Zeile ist nur ein Preisvergleich: Level-8-Kandidaten sind dort nicht freigeschaltet. Lootverkauf ist ein Erwartungswert aus den Drop-/Raritychancen, kein garantierter Erlös; nützliche ausgerüstete Items können nicht direkt verkauft werden. Poolrefresh kostet weiterhin 25 Gold, Rekruten 50/90/150/230/330/460/620/800 je Level. Häufiges Suchen nach seltenen hohen Kandidaten kann die tatsächlichen Gesamtkosten erhöhen.

## Regressionen und Tests

| Suite | Bestandene Prüfungen |
|---|---:|
| Browsermodell | 30 |
| Recruitment V2 | 21 |
| Presentation-Stubs | 20 |
| V2-UI-Stubs | 10 |
| V2 statisch | 14 |
| Hallenmodell V3 | 33 |
| V3-UI-Stubs | 11 |
| V3 Assets/Pfade | 37 |
| V4 Progression einschließlich Combat-Golden-Vektoren | 60 |
| V4-UI-Stubs | 14 |
| V4 Modellloop | 8 |
| V4 Assets/Pfade | 24 |
| V4.1A Save | 46 |
| V4.1A Recruitment | 15 |
| V4.1A-UI-Stubs | 13 |
| V4.1A Quell-/Assetchecks | 13 |
| V4.1B Dynamik/Save/Migration | 58 |
| V4.1B integrierte UI-Stubs | 17 |
| V4.1B Modellloop/Ökonomie | 4 |
| V4.1B Cache/Assets/Bytevergleich | 36 |
| **Gesamt** | **484** |

Zusätzlich 10 Syntaxprüfungen. Alte JS-Suiten bleiben bytegleich und prüfen weiterhin die Legacy-Komposition mit festen V4-Angeboten. Neue dynamische Modell- und UI-Suiten laden zusätzlich `dynamic-quests.js`; sie prüfen die tatsächlich ausgelieferte V4.1B-Komposition. Die 13 V4.1A-UI-Szenarien laufen dabei nochmals mit aktivierter Dynamik plus vier neuen Szenarien. Statische Pfadprüfungen wurden URL-konform um Querystrings erweitert; Existenz, Groß-/Kleinschreibung, relative Unterpfade und Ladereihenfolge bleiben geprüft. Die neue Ressource erhöht zwei bisherige Assetzählungen um je einen Check.

Im neuen UI-Testaufbau schlugen zunächst zwei Fehleranzeigeprüfungen fehl, weil sie `innerHTML` statt des vom Spiel gesetzten `textContent` lasen. Das wurde im Test korrigiert. Zusätzlich wurde ein fehlender Boardvertrag bei vorhandenen dynamischen Quests als ungültiger Save abgesichert. Abschließender Gesamtlauf und Lauf aus frisch entpacktem ZIP: null fehlgeschlagene Befehle.

## Dateien und unveränderte Grenzen

Geändert: `progression.js` (Questvertrag lesen), `save.js` (V2/Migration/Validierung), `game.js` (Dynamikhinweise), `index.html` (Modul, Version, Cache), `BROWSER_PLAYTEST_README.md` (Verweis auf aktuellen Einstieg), `tests/run-all.py` und drei bestehende Asset-/Pfadtests.

Neu: `dynamic-quests.js`, vier V4.1B-Testsuiten, echte V1-Savefixture, Schutzdatei-Hashes und Fixture-Provenienz sowie V4.1B-Bericht, Startanleitung, Baselinevergleich und Testausgabe. Der maschinenlesbare Vergleich führt alle Dateinamen und SHA-256-Hashes auf. Seine eigene Datei ist bewusst nicht in sich selbst gehasht.

Bytegleich zur V4.1A-ZIP-Basis: `rules.js`, `combat.js`, `skills.js`, `recruitment.js`, `hall.js`, `hall-view.js`, `living-hall.css`, sämtliche zwölf Grafikassets sowie alle bestehenden JS-Tests. Insbesondere keine Veränderung am Combat-RNG, Tick, Damage, Crit, Mana, Status oder CombatResult.

## GitHub Pages und Cache

Vollständig statisch, relative Pfade, keine CDN-/Serverpflicht. Deployment bleibt `main / (root)`. Alle eigenen JS- und CSS-Einstiegsressourcen tragen `?v=4.1b`. Die statische Ladereihenfolge setzt Rules → Progression → Recruitment → Dynamic Quests → Save vor die UI. Keine Service Worker und keine neuen Storage-Keys. Ein zukünftiges Deployment muss den Versionssuffix für betroffene Ressourcen erneut erhöhen.

## Bekannte Grenzen

F-Rang endet weiter bei Level 10; die Gilde endet bei Level 5. Ist der bestmögliche Kader erreicht, wachsen Anforderungen nicht unbegrenzt weiter. Gratis Boardrefresh erlaubt die Wahl günstiger Typ-/Distanzkombinationen; die kleine Variation ersetzt keine Refresh-Ökonomie. Verletzungen und dauerhafte Kaderverluste können den nächsten Benchmark senken, die Gildenminimumwerte begrenzen dies. Ein großer Kader macht das neue Board auch für schwächere Zweitgruppen anspruchsvoller. Die Dropprüfung pro Familie kann mehr als ein Item pro Quest geben. Beides sind offengelegte Playtest-Balancegrenzen.

Unbegrenztes Spielen kann weiterhin Gold ansammeln, wenn alle endlichen Recruitmentziele erfüllt sind. Es gibt keine exponentielle Rewardsteigerung durch bloßes Refresh und keine Doppelbuchung; V4.1B führt ausdrücklich keinen zusätzlichen Endgame-Goldsink ein. Der bestehende 2-MiB-Savelimit und die maximale Questhistorie bleiben bestehen.

Keine Cloudsave-, Rang-E-, Crafting-, Schmied-, Hallenausbau- oder Multiplayerentwicklung. Spätere Designregel bleibt: In der finalen Halle primär Gruppenleiter, individuelle Optik und sichtbare Ausrüstung. Dies wurde nicht umgesetzt. Keine neue Phase nach V4.1B begonnen.
