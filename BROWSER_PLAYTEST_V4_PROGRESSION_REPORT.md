# Browser-Playtest V4 — Progression Pass

Abgeschlossen: 5. Oktober 2026. Direkte Basis: das fertige `GuildGame_Sprint11_BrowserPlaytest_V3_LivingHall.zip`.

## Umfang und tatsächlicher Prüfstand

Implementiert sind Management-Stärke, Itemvergleich mit manueller Ausrüstung, Verkauf, vier wirksame Questschwierigkeiten sowie getrennte Gilden-XP mit fünf Gilden-Leveln und echten Kapazitätsfreischaltungen. Die Living Hall, vorhandene Recruitment-Transaktionen, Partyverwaltung, Rewards, Equipment- und Potion-Grundregeln werden weiterverwendet.

**276 automatisierte Prüfungen/Checks bestanden; null Fehler im abschließenden Gesamtlauf. Sieben JavaScript-Dateien bestehen zusätzlich die Syntaxprüfung.** Modelltests, DOM-Stubs und begrenzte statische Prüfungen sind getrennt ausgewiesen. Es wurde kein echter Browser-/Safari-/iPhone-Test ausgeführt. Es wird weder eine visuelle Abnahme noch eine gemessene mobile Bildrate behauptet.

Combat und Unity wurden nicht neu implementiert. `combat.js`, `skills.js`, `hall.js`, `hall-view.js` und `living-hall.css` sind bytegleich zur V3. Keine weitere Entwicklungsphase wurde begonnen.

## Architektur

`progression.js` enthält die zentralen V4-Playtest-Konstanten, Stärke-, Vergleichs-, Loot- und Gildenberechnungen. Es ergänzt den vorhandenen `GuildRules`-Dienst, ohne eine zweite Mitglieder-, Gruppen- oder Itemverwaltung einzuführen.

Die vorhandene `change`-Transaktion arbeitet weiterhin auf einer Kopie. V4 prüft den Ausgangszustand vor einer Änderung und den vollständigen Endzustand vor Rückgabe. Ein Fehler veröffentlicht keinen Teilzustand. Manuelles Equip und Verkauf verwenden vorhandene ItemInstance-IDs. Gilden-XP werden im gleichen Reward-Schritt wie XP/Gold/Loot gebucht. Das vorhandene `paid`-Merkmal verhindert doppelte Buchungen. Auto-Equip bleibt der getrennte bestehende Nachverarbeitungsschritt; ein Reward-Retry löst ihn nicht erneut aus.

Die Web-Einstiegsdatei lädt V4 verbindlich nach `rules.js` und vor `game.js`. Für unveränderte historische Tests lässt sich der vorhandene Basisdienst weiterhin ohne V4 laden. Seine alten 12-Mitglieder-/3-Einsatz-Defaults gelten ausschließlich für diesen expliziten Legacy-Modus. Im ausgelieferten V4-Spiel erfolgen alle Kapazitätsprüfungen über die Gildenlimits. Das wird auch mit 20 Mitgliedern und vier parallelen Einsätzen getestet.

## Charakteranzeige und Stärke

Die UI zeigt `Rang F · Lvl. 4` statt `F4`. Ein vorhandenes zukünftiges `rank`-Feld kann angezeigt werden; ohne dieses Feld gilt F. Es wird keine E–S-Progression implementiert.

Die bisherigen Charakter-XP-Schwellen bleiben unverändert:

| Level im Rang F | Kumulative Charakter-XP |
|---|---:|
| 1 | 0 |
| 2 | 30 |
| 3 | 70 |
| 4 | 120 |
| 5 | 180 |
| 6 | 250 |
| 7 | 330 |
| 8 | 420 |
| 9 | 520 |
| 10 | 630 |

Pro Charakter-Levelaufstieg weiterhin genau drei automatisch verteilte Skillpunkte; F10/630 XP bleiben das bestehende Maximum. Die Klassen-/Skillverteilung wurde nicht verändert.

Die neue **Management-Stärke** berechnet sich zentral und ganzzahlig:

```text
Klassenbasis = HP + 4 × Attack + 6 × Defense
Item-Rolleneignung = Summe der vorhandenen Eignungswerte,
                    deren Rollenbit zur Klasse gehört
Stärke = Klassenbasis
       + 25 × (Level − 1)
       + 10 × Summe der Item-Rolleneignungen aller drei Slots
```

| Klasse | HP | Attack | Defense | Stärke ohne Ausrüstung auf Level 1 |
|---|---:|---:|---:|---:|
| Krieger | 60 | 8 | 3 | 110 |
| Schurke | 40 | 10 | 1 | 86 |
| Magier | 36 | 9 | 1 | 78 |
| Priester | 42 | 5 | 1 | 68 |

Diese Daten werden aus den vorhandenen Klassenprofilen gelesen, nicht in Combat zurückgeschrieben. Mana, Crit, Skills und Potions geben keine zusätzliche Management-Stärke. Es gibt keine zufällig erzeugte Power.

Gruppenstärke ist die Summe der Stärken lebender, zum betrachteten Zeitpunkt genesener Gruppenmitglieder. Tote und noch Verletzte tragen null bei. Bestehende Questbindungen blockieren den Start weiterhin unabhängig von der angezeigten Stärke.

## Itemvergleich und Ausrüstung

Die Gildentruhe zeigt freien Loot, Vergleich/Ausrüstung und Verkauf. Der Objekt-Hotspot in der V3-Halle öffnet dieselbe Truhe.

Der Vergleich zeigt vor dem Equip:

- Zielmitglied und Klasse;
- aktuelles und ausgewähltes Item desselben Slots;
- Rarity und Klassenkompatibilität;
- Stärke vorher/nachher;
- summierte relevante Rolleneignung;
- Tank, Damage, Healing und Support/Control einzeln;
- Verkaufswert;
- positive, negative und neutrale Änderungen mit Farbe **und** `+ ↑`, `− ↓` beziehungsweise `±0 →`.

Manuelle Ausrüstung tauscht Lageritem und Slotitem atomar aus. Das ersetzte Item kehrt ins gemeinsame Lager zurück. Tote oder questgebundene Mitglieder können nicht ausgerüstet werden; verletzte, nicht gebundene Mitglieder dürfen weiterhin Equipment erhalten. Manuelle Wahl darf bewusst schwächer sein; die Vorschau macht das sichtbar.

Die bestehende Auto-Equip-Vergleichsreihenfolge bleibt unverändert: Klassen-/Slotkompatibilität, höhere Rolleneignung, bei gleicher Eignung höhere Rarity, bei vollständigem Gleichstand aktuelles Item behalten. DefinitionId/InstanceId ordnen nur gleichwertige Lagerkandidaten. Nach Reward und vor Queststart wird der vorhandene Auto-Equip-Pfad verwendet. Feedback nennt Änderungen, Eignung, Rarity und die Stärkeänderung durch die Ausrüstung.

## Itemkatalog und Verkaufswerte

Die sechs bestehenden Common-Ausrüstungsdefinitionen bleiben erhalten. Jede erhält genau eine Uncommon- und Rare-Variante. Klassenbeschränkung und Slot bleiben gleich. Damit bestehen 18 Ausrüstungsdefinitionen plus der vorhandene Heiltrankvertrag.

| Variante | Suffix der stabilen DefinitionId | Eignungsänderung gegenüber Common |
|---|---|---|
| Common | `.common` | unverändert |
| Uncommon | `.uncommon` | +1 auf jeden bereits positiven Eignungswert |
| Rare | `.rare` | +3 auf jeden bereits positiven Eignungswert |

Nullwerte bleiben null. Beispiel: Kriegerwaffe `[2,2,0,0]` → `[3,3,0,0]` → `[5,5,0,0]`. Rüstung `[1,1,1,1]` → `[2,2,2,2]` → `[4,4,4,4]`. Neue DefinitionIds entstehen aus dem bestehenden Common-ID-Stamm durch den oben gezeigten Suffixwechsel. Es werden **keine** neuen Attack-/Defense-/Combatstats an Items ergänzt.

Verkaufswerte sind zentral konfiguriert:

| Freies Item | Common | Uncommon | Rare |
|---|---:|---:|---:|
| Weapon | 12 Gold | 24 Gold | 48 Gold |
| UpperBody | 10 Gold | 20 Gold | 40 Gold |
| Legs | 8 Gold | 16 Gold | 32 Gold |
| HealingPotion | 3 Gold pro freiem Trank | — | — |

Formel für Ausrüstung: Slotbasis × Rarity-Multiplikator `[1,2,4]`.

Rare-Items oder Items ab 40 Gold erfordern eine Bestätigung. Ausgerüstete Items besitzen keinen Lagerverkaufspfad: Erst ablegen oder ersetzen. Verkauf entfernt exakt die gewählte freie Instance und addiert Gold im selben Commit. Ein zweiter Aufruf mit derselben Instance scheitert ohne zusätzliche Buchung.

Heiltränke werden einzeln aus dem freien gemeinsamen Bestand verkauft. Die Aktion enthält den erwarteten Bestandswert; ein veralteter Doppeltipp wird abgewiesen. Bereits für Einsätze zugewiesene Tränke gehören nicht zum verkaufbaren freien Bestand. Potion-Verwendung im Combat bleibt ausgeschlossen.

## Queststufen und feste Progressionsziele

Jedes neue Angebot enthält vier Aufträge: je Leicht, Mittel, Schwer und Elite. Diese Werte passen sich **nicht** an die aktuelle Gruppe oder das Gilden-Level an. Die vier vorhandenen Questtypen und ihre Distanzen bleiben erhalten. Elite ist bewusst ein ständig sichtbares überstarkes Ziel statt eines zusätzlichen zufälligen Angebotsmechanismus.

| Schwierigkeit | Empfohlene Stärke | Dauer | Gold bei Erfolg | Gruppen-XP vor Aufteilung | Gilden-XP bei Erfolg | Dropchance je Familie |
|---|---:|---:|---:|---:|---:|---:|
| Leicht | 200 | 60 s | 40 | 60 | 20 | 35 % |
| Mittel | 450 | 75 s | 65 | 100 | 40 | 40 % |
| Schwer | 800 | 90 s | 100 | 160 | 70 | 45 % |
| Elite | 1200 | 120 s | 150 | 240 | 110 | 50 % |

Es gibt sechs Equipmentfamilien und eine Potionfamilie. Jede Familie erhält bei erfolgreicher, nicht vollständig ausgelöschter Quest einen eigenen deterministischen Dropwurf. Erfolgreicher Equipmentdrop ergibt ein Item, Potiondrop zwei Heiltränke. Eine Equipmentfamilie rollt anschließend ihre Rarity:

| Stufe | Common | Uncommon | Rare |
|---|---:|---:|---:|
| Leicht | 100 % | 0 % | 0 % |
| Mittel | 70 % | 28 % | 2 % |
| Schwer | 40 % | 50 % | 10 % |
| Elite | 20 % | 55 % | 25 % |

Damit werden nicht alle Rarityvarianten unabhängig gedroppt. Epic, Legendary und Unique sind nicht enthalten.

**Neue Angebote** ersetzt ausschließlich noch nicht gestartete Angebote. Aktive, auswertungsbereite und abgeschlossene Quests bleiben erhalten. Dadurch kann der Spieler leichte Aufträge wiederholen, ohne zuvor eine derzeit zu schwere Elitequest starten zu müssen. Angebote gewähren selbst keine Belohnung.

## Risikoanzeige und Startwarnung

```text
Anzeigeverhältnis = aktuelle Gruppenstärke / empfohlene Queststärke
```

| Verhältnis | Anzeige |
|---|---|
| ab 1,50 | Deutlich stärker |
| ab 1,20 bis unter 1,50 | Niedriges Risiko |
| ab 0,90 bis unter 1,20 | Angemessen |
| ab 0,65 bis unter 0,90 | Hohes Risiko |
| unter 0,65 | Extremes Risiko |

Die Karte zeigt Empfehlung, ausgewählte Gruppenstärke, Differenz, Schwierigkeit, Distanz, Dauer, Gold, Charakter-/Gruppen-XP, Gilden-XP und Lootwahrscheinlichkeiten. Die Anzeige ist eine Managementprognose, keine zugesagte Erfolgsquote.

Bei einem Verhältnis unter 0,90 erscheint eine Startwarnung mit Abbrechen/Schließen und **Trotzdem starten**. Die Startvorschau berücksichtigt das ohnehin vorgesehene Auto-Equip in einer Zustandskopie. So wird nicht aufgrund einer veralteten Ausrüstung unnötig gewarnt. Die Vorschau verändert weder Lager noch Potions noch Queststatus.

Eine bestätigte unterlegene Gruppe darf starten. Mitgliedergültigkeit, Genesung, Gruppenbindung und Einsatzlimit bleiben echte Startbedingungen. Bei belegten Einsatzplätzen lautet der Fehler ausdrücklich „Alle verfügbaren Einsatzplätze sind belegt.“

## Tatsächliche Wirkung auf die Questsimulation

Für V4-Quests wird der bisherige abstrakte Stärke-/Schwierigkeits-Eingang erweitert:

```text
Abdeckungsfaktor = 1
                  + 0,08 bei Tank-Rolle
                  + 0,08 bei Healing-Rolle
                  + 0,04 bei Damage-Rolle
Simulationsstärke = Summe Management-Stärke × Abdeckungsfaktor
Schwierigkeit = empfohlene Stärke der Quest
Verhältnis = Simulationsstärke / Schwierigkeit × [0,95 … 1,05]
```

Der kleine Zufallsfaktor verwendet den vorhandenen deterministischen Questzufall. Rollenbonus, Leiter, Persönlichkeit, Rückzug, Verletzung, Kampfunfähigkeit, Stabilisierung und Tod werden danach durch die vorhandenen Formeln verarbeitet. Sie werden nicht durch den Combat Core ersetzt.

Zur Nachvollziehbarkeit die weiterverwendeten Regeln, mit `r = Verhältnis`, `h = clamp((1−r)/0,5,0,1)`, Leiterwert `l` und mittlerer Persönlichkeit `b`:

```text
Rückzugswahrscheinlichkeit = clamp(h × (0,45 + 0,4l − 0,03b), 0, 0,9)
Objektiverfolg nach ausbleibendem Rückzug = clamp(0,1 + 0,8r, 0,05, 0,98)
Kampfunfähigkeit = clamp(0,45 × (1−r), 0, 0,45) × (Rückzug ? 0,35 : 1)
Verletzung = clamp(0,1 + 0,3 × (1−r), 0, 0,4) × (Rückzug ? 0,6 : 1)
Stabilisierung durch verfügbaren Heiler = vorhandene 65-%-Prüfung
Tod ohne erfolgreiche Stabilisierung = clamp(0,15 + 0,5h + (Zusammenbruch ? 0,2 : 0), 0, 0,9)
Erholung = ceil(clamp(60 + 180h + (kampfunfähig ? 60 : 0), 60, 300)) Sekunden
```

Die vorhandenen Heiler-/Zielzuordnungen und Todes-/Wipe-Definitionen bleiben bestehen. Tote erhalten aus dem ursprünglichen Questresultat null Charakter-XP. Ein späterer Tod löscht bereits im Resultat festgeschriebene positive XP nicht; die Reward-Anwendung überschreibt keinen Lebensstatus.

Charakter-XP werden weiter mit den bestehenden Faktoren verteilt: Wipe 0; Erfolg 1; Rückzug 0,35; sonst 0,2. Ganzzahlig abgerundet wird die so skalierte Gruppen-XP durch die Teilnehmerzahl geteilt. Gold, Loot und Gilden-XP gibt es nur bei Erfolg ohne Wipe. Der höhere Schwierigkeitsgrad verändert die konfigurierten Ausgangsbelohnungen, nicht die bestehende Charakter-Levelkurve.

**Sprint-10-Combat bleibt unverändert:** Tick, Schaden, Crit, Mana, Fähigkeiten, Status, Stabilisierung, Todeswürfe, RNG und CombatResult verwenden weiterhin ausschließlich den vorhandenen Core. Management-Stärke ist kein Combatstat. Die vier vollständigen Combat-Golden-Vektoren werden zusätzlich bei geladenem V4-Modul erfolgreich geprüft.

## Gilden-XP und Freischaltungen

Gilden-XP liegen separat in `state.guild.xp`. Der Resolve schreibt den berechneten Anspruch ins autoritative Questresultat; die einmalige Reward-Anwendung übernimmt ihn zusammen mit Charakter-XP, Gold und Loot. Ein wiederholter Reward-Aufruf gibt denselben Zustand zurück und vergibt nichts erneut.

| Gilden-Level | Kumulative Gilden-XP | Mitgliederlimit | Bestehende Gruppen | Gleichzeitige Einsätze |
|---|---:|---:|---:|---:|
| 1 | 0 | 6 | 1 | 1 |
| 2 | 80 | 8 | 2 | 2 |
| 3 | 240 | 12 | 3 | 3 |
| 4 | 520 | 16 | 4 | 3 |
| 5 | 1000 | 20 | 5 | 4 |

Diese fünf Limitzeilen übernehmen die vorgeschlagene Playtest-Progression. Die XP-Schwellen sind neue zentrale V4-Balancewerte. Gilden-XP werden bei 1000 begrenzt; darüber hinaus besteht in diesem Pass kein weiteres Gilden-Level. Überschüsse werden nicht für spätere Level vorgemerkt.

Level und Limits werden aus XP abgeleitet, nicht als mehrfach ausführbare Freischaltevents gespeichert. Ein Sprung über mehrere Schwellen ergibt unmittelbar die richtigen Limits; das Feedback nennt nur die tatsächlich entstandenen Unterschiede. Bestehende Gruppen und laufende Quests werden dabei nicht ersetzt oder verändert.

Active und CompletedPendingResolution zählen beide gegen das aktuelle Einsatzlimit. Die bestehenden Mitglieder-/Leitersperren bleiben bis erfolgreichem Resolve erhalten. Zusätzliche Gruppenslots sind sichtbar gesperrt, bis das zugehörige Gilden-Level erreicht ist. Recruitment prüft das aktuelle Mitgliederlimit; bei voller Gilde zeigt die UI aktuelle Belegung und nächste Kapazitätsstufe.

Im Kopfbereich erscheinen Gilden-Level/XP, Gold, Mitglieder, Gruppen und Einsätze. Antippen des Gilden-Level-Bereichs öffnet XP-Fortschritt, nächste Freischaltung und alle fünf Limitzeilen. Gruppen- und Questansichten zeigen zusätzlich das nächste Ziel. Mehr rekrutierte Mitglieder erscheinen durch die vorhandene Living Hall; 20 Bewohner werden im DOM-Stub geprüft. Es gibt keine neue Hallen-Ausbauarchitektur.

## Baseline und Dateien

Verglichen mit den 40 Dateien des fertigen V3-Pakets: **36 bytegleich, vier geändert, keine gelöscht**. Hashwerte stehen in `V4_BASELINE_COMPARISON.json`.

| Geänderte bestehende Datei | Grund |
|---|---|
| `rules.js` | Dynamische Gildenlimits für V4; V4-Stärke/Schwierigkeit und familienbasierter Loot als Eingänge der bestehenden Questformeln; Gilden-XP im Resultat |
| `game.js` | Stärke-/Levelanzeige, Itemvergleich/Verkauf, Questwarnungen, neue Questkarten, Gildenfortschritt und Feedback |
| `index.html` | V4-Kennzeichnung; Progressionsmodul und zusätzliche CSS-Datei laden |
| `tests/run-all.py` | Neue Prüfmodule zusätzlich ausführen; bestehende Tests bleiben enthalten |

Neue Laufzeitdateien: `progression.js`, `progression.css`.

Neue Tests: `tests/progression-v4.test.cjs`, `tests/ui-v4.test.cjs`, `tests/loop-v4.test.cjs`, `tests/assets-v4.test.py`.

Neue Dokumentation/Nachweise: `V4_START_HERE.md`, `BROWSER_PLAYTEST_V4_PROGRESSION_REPORT.md`, `BROWSER_PLAYTEST_V4_TEST_OUTPUT.txt`, `V4_BASELINE_COMPARISON.json`.

Alle V3-Bildassets sind unverändert im Paket enthalten. Keine neuen Bilddownloads, CDN-Dienste oder Serverabhängigkeiten. Historische V1–V3-Berichte und Testausgaben bleiben als historische Unterlagen erhalten; maßgeblich für diesen Pass sind die V4-Dateien.

## Ausgeführte Tests

Gesamtlauf: `python3 tests/run-all.py`. Vollständige Ausgabe im ZIP: `BROWSER_PLAYTEST_V4_TEST_OUTPUT.txt`. Alle Teilbefehle im abschließenden Lauf: Exitcode 0.

| Suite | Bestanden | Bedeutung |
|---|---:|---|
| Bestehendes Browser-Spielmodell | 30 | Legacy-Regeln und Combat-Golden-Vektoren |
| Recruitment V2 | 21 | Historische Aufnahme-/Fehlerfälle |
| Basis-UI-Stubs | 20 | Vorhandene Handler |
| V2-UI-Stubs | 10 | Recruitment-/Combat-Präsentation |
| V2 statisch | 14 | Begrenzte Quell-/Assetchecks |
| V3 Hallenmodell | 33 | Bewohner, Wege, Lebensstatus, Ankunft/Abreise/Rückkehr |
| V3 UI-Stubs | 11 | Hallenanbindung |
| V3 Asset-/Quellchecks | 34 | Enthält die zusätzlichen referenzierten V4-Dateien |
| V4 Progression | 60 | Power, Vergleich, Verkauf, Grenzen, Questwirkung, GuildXP und sieben Combat-Regressionen bei aktivem V4 |
| V4 UI-Stubs | 14 | Rang/Level, Warnung/Bestätigung, Vergleich, Verkauf, nächste Freischaltung, 20 Bewohner |
| V4 Loop-/Atomaritätsfälle | 8 | Zusammenhängender Loop bis Gilden-Level 5, laufende Quest beim Level-up, Potionverkauf, Fehlerzustände |
| V4 Asset-/Quellchecks | 21 | Relative Pfade, Ladereihenfolge, kein Backend/Save, dynamische Limits |
| **Gesamt** | **276** | **Keine realen Browser-End-to-End-Tests** |

Zusätzlich `node --check` für sieben JS-Dateien erfolgreich. Die bestehenden Tests wurden weder gelöscht noch abgeschwächt. Historische Suiten laufen bewusst ohne geladenes V4-Modul als Kompatibilitätsregression; die drei V4-Modell-/UI-Suiten testen ausdrücklich den neuen Laufzeitmodus. Die .NET-/Unity-Testergebnisse früherer Sprints werden nicht als neue Browsernachweise ausgegeben.

Der End-to-End-Modelltest absolviert vier leichte, vier mittlere, vier schwere und fünf Elitequests mit kontrollierten erfolgreichen Zufallswerten. Er erreicht Gilden-Level 5 ohne künstliche XP-/Goldgutschrift, rüstet Loot aus, verkauft freien Loot, rekrutiert einen weiteren Gefährten und erstellt eine weitere Gruppe. Das prüft die Transaktionskette, **nicht** die durchschnittliche Erfolgswahrscheinlichkeit oder reale Spielzeit.

### Gefundene und behobene Fehler

- Beim ersten Syntaxlauf fehlte eine schließende Klammer in der neuen Equipment-Feedbackfunktion. Korrigiert; alle folgenden Syntaxläufe erfolgreich.
- Ein neuer Fehlerfalltest zeigte, dass ein Verkauf bei einem bereits beschädigten Bestand mit doppelter Instance-ID beide Einträge entfernen konnte. V4 prüft nun den gesamten Eingangsbestand vor jeder Transaktion. Der unveränderte Test besteht; kein doppeltes Gold und kein stillschweigendes Reparieren des beschädigten Bestands.
- Die neuen Angebote wurden so integriert, dass nicht gestartete schwere Angebote das Wiederholen leichter Aufträge nicht verhindern. Aktive und historische Quests bleiben unberührt.

## Bekannte Grenzen und externe Abnahme

- Kein gerenderter Browserlauf, keine reale Safari-/iPhone-/Touch-Abnahme, keine gemessene Bildrate. UI-Tests verwenden DOM-Stubs. Die mobile Darstellung ist vorbereitet, nicht auf einem Gerät bestätigt.
- Keine neue Unity-Ausführung, kein Unity-WebGL-Build, keine Xcode-/iPhone-App-Abnahme. Das vorhandene Unity-Projekt wurde nicht verändert.
- Kein persistenter Save. Ein Reload beginnt von vorn; es ist keine Migration gespeicherter V3-Gilden erforderlich oder implementiert.
- Quest-/Power-/Verkaufs-/Gildenwerte sind zentrale **Browser-Playtest-Balance**, keine stillschweigende neue Unity-Spezifikation. Eine spätere Unity-Übernahme benötigt eine explizite Design-/Implementierungsentscheidung.
- Risikobänder nutzen die rohe Gruppenstärke; tatsächliche Simulation berücksichtigt zusätzlich bestehende Rollenboni, Leitung, Persönlichkeit und Zufall. „Niedriges Risiko“ garantiert weder Erfolg noch Unversehrtheit.
- Elite ist immer in der Vierergruppe von Angeboten vorhanden. Kein zusätzliches Zufallsangebotssystem.
- Gilden-Level 5 und Charakter-Level 10 sind die Grenzen dieses Passes. Kein neues Rang-, Endgame- oder Gebäudesystem.
- Itemnamen/-bilder sind einfache Playtestvarianten der vorhandenen Familien. Ausgerüstete Items ändern die gemalte Klassensilhouette nicht.
- Die V3-Halle hat keine echte Kollisionssimulation. Bei 20 Bewohnern können Figuren/Labels überlagern; der Roster bleibt über die feste Navigation erreichbar.
- Keine reale durchschnittliche Balance-/Frustmessung. Insbesondere die frühen mittleren/schweren Aufträge sind absichtlich gefährlich; die Warnung und wiederholbare leichte Angebote sind Teil dieses Playtests.

## Auslieferung

`GuildGame_BrowserPlaytest_V4_Progression.zip` enthält eine vollständige statische Website mit Einstieg direkt im ZIP-Root. Den gesamten Inhalt einschließlich `assets/` übernehmen. GitHub Pages weiterhin **main / (root)**, kein Buildsystem oder Backend nötig. Es wurde in diesem Durchlauf nicht veröffentlicht und keine Spiel-URL erfunden.

Der aktuelle Browser-Playtest besitzt den geforderten Progressionsloop. Keine weitere Entwicklungsphase, kein Sprint 12, keine neuen Combatregeln und keine ausgeschlossenen Folgesysteme wurden begonnen.
