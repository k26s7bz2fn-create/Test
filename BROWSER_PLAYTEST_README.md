# GuildGame Sprint 11 – Browser-Playtest

Eigenständige statische HTML/CSS/JavaScript-Website. **Kein Unity- oder WebGL-Build.** Die Unity-Produktionsquellen wurden nicht geändert. Sprint 12 wurde nicht begonnen.

## Sofort starten

1. Das ZIP entpacken und seinen vollständigen Inhalt bei einem statischen HTTPS-Webhost hochladen. Die daraus entstehende URL in Safari öffnen und das iPhone ins Querformat drehen. `index.html` ist der Einstieg.
2. **Rekrutierung:** genau drei der fünf Kandidaten auswählen und rekrutieren.
3. **Gruppen:** die freien Mitglieder markieren, eine Gruppe erstellen und optional einen Leiter setzen.
4. **Quests:** einen Auftrag mit der ausgewählten Gruppe starten. Nach 60 Sekunden **Ergebnis auswerten**, danach **XP, Gold & Beute übernehmen**.
5. **Mitglieder** zeigt XP, Level und automatische Skillränge. **Lager** zeigt Bestand und Ausrüstung. **Probekampf** startet eine sichtbare, folgenlose Kampfprobe mit einer freien, einsatzfähigen Gruppe.

Über **Werkzeuge → +60s Quest / Erholung** lässt sich die bestehende Entwicklungsuhr vorspulen. **Neue Gilde** setzt den Test zurück. Nach dem Start des Probekampfs stehen Pause, 1×, 2× und 4× zur Verfügung. Beim Verlassen der Kampfansicht wird pausiert.

**Kein Save:** Neuladen oder Schließen verwirft den Spielstand. Für einen Test auf dem iPhone eine gehostete URL verwenden; eine ZIP-Vorschau in der Dateien-App ist keine laufende Website. Die Website benötigt keine Accounts, Serverlogik, externen Schriften, CDN-Dateien oder Frameworks. Ein direkter Spiel-Link konnte in diesem Durchlauf nicht veröffentlicht werden: Der Quellupload scheiterte am Netzwerkproxy (`Failed to connect to browser-proxy port 8889`, Exitcode 128). Es wird daher keine veröffentlichte Website behauptet.

## Enthaltene Funktionen

- Antippbare 2D-Gildenhalle, dauerhafte Navigation und Verwaltungsansichten.
- Deterministische Startrekrutierung: fünf F1-Kandidaten, genau drei auswählen; vorhandene Klassen und Rollen.
- Roster mit Lebens-/Verletzungsstatus, F1–F10, XP und automatisch vergebenen Skillrängen.
- Mehrere Gruppen mit 1–6 Mitgliedern, eindeutiger Zugehörigkeit, optionalem Leiter, Verschieben und Auflösen freier Gruppen.
- Vier vorhandene Sample-Questtypen: Sammeln, Lieferung, Monsterjagd, Rettung. Je 60 Sekunden, F-Rang, normale Gefahr und Empfehlung von zwei Mitgliedern.
- Questfortschritt, `CompletedPendingResolution`, Auswertung, strukturierte Verletzungs-/Todesfolgen, Rewards und separat angestoßenes Auto-Equip.
- Gemeinsames unbegrenztes Lager, vorhandene sieben Sample-Itemdefinitionen, Waffen-/Oberkörper-/Beinslots, automatische Trankzuteilung und Rückgabe.
- Sichtbarer isolierter Combat-Test gegen die vier vorhandenen Goblinprofile, mit HP/Mana, Aktionen, Status und Kampfprotokoll.
- Große Touch-Flächen, Landscape-Layout, `viewport-fit=cover`, dynamische Viewporthöhe und CSS-Safe-Areas.

## Übernommene Regeln

Die Portierung wurde anhand des vorliegenden Sprint-11-C#-Quellbestands vorgenommen, insbesondere Recruitment/Adventurers, Party, Quests/Simulation, Progression, Inventory, Equipment, Combat sowie des Playtest-Session-Aufbaus.

- Gruppen-/Mitgliedersperren bleiben während Active und CompletedPendingResolution bestehen. Beide Zustände belegen einen der drei Questplätze.
- Resolve und Reward sind getrennt. Rewards werden einmal gebucht. XP wird aus dem festgeschriebenen Ergebnis übernommen; ein späterer Tod wird dabei nicht überschrieben.
- F1–F10-Schwellen: 0, 30, 70, 120, 180, 250, 330, 420, 520, 630. XP wird bei 630 gedeckelt; pro Level drei automatisch verteilte Punkte. Die vorhandenen 36 Skill-IDs und ihre Reihenfolge sind aus den C#-Quellen übernommen.
- Auto-Equip nutzt Klassen-/Slotkompatibilität, dann Rolleneignung, dann Rarity. Bei vollständigem Gleichstand bleibt das aktuelle Item. Lagerkandidaten werden nach DefinitionId/InstanceId geordnet.
- Der vorhandene Sample-Katalog enthält Common-Trainingsausrüstung und Heiltränke. Es wurden keine neuen Items oder Equipment-Combatwerte ergänzt.
- Vor einer Quest maximal ein verfügbarer Heiltrank pro einsatzfähigem Teilnehmer; Heiler, dann Leiter, dann übrige IDs. Mangel blockiert nicht. Ungenutzte Tränke und Equipment Toter werden beim normalen Quest-Resolve zurückgeführt.
- Combat bleibt isoliert: keine XP, kein Gold, kein Loot, keine Potion-Nutzung, keine dauerhaften Gildenfolgen. Equipment, Level und Progressionsskills bleiben combatneutral.
- Combat verwendet die vorhandenen Profile/Aktionen, 250-ms-Ticks, Cooldowns, Mana, deterministisches SHA-256-RNG, Zielbindung, Status, Incapacitated/Stabilized/Dead, Aftermath und die 480-Tick-Grenze.

## Bewusste Unterschiede und Grenzen

1. **JavaScript-Port statt C#-Ausführung.** Das ist ein Playtest-Adapter mit eigenem In-Memory-Zustand. Er ersetzt weder RuntimeStore noch Unity und importiert/exportiert keine Unity-Spielstände.
2. **Questarithmetik:** JavaScript `Number` statt C# `decimal`. An Rundungsgrenzen können Unterschiede auftreten. Die Combat-Integerberechnungen und vier vollständige Referenzvektoren wurden separat geprüft; dies beweist keine vollständige Gleichheit aller C#-Fälle.
3. **Identitäten:** vorhandene Definition- und Skill-IDs werden verwendet. Neue Equipment-Instanz-IDs sind browserlokal. Questresultate besitzen nicht den vollständigen C#-Serialisierungs-/Fingerprint-Vertrag.
4. **Transaktionen:** Operationen werden synchron auf einer Kopie ausgeführt und nach Validierung veröffentlicht. Das ist keine Portierung der gesamten mehrteiligen RuntimeStore-/Snapshot-Infrastruktur. Reward-Commit und Equipment-Nachbewertung bleiben getrennt.
5. **Zeit:** flüchtige Sitzungsuhr; kein persistierter Offline-Fortschritt. Der Probekampf pausiert bei Seitenwechsel/ausgeblendetem Dokument. Lange Darstellungsunterbrechungen werden nicht vollständig als Kampfzeit nachgeholt.
6. **Darstellung:** SVG-Gildenhalle, Symbole und HP-Balken statt Unity-3D, Kamerafahrten, Animation oder finaler Grafik. Die Ansicht zeigt Combat-Basiswerte als solche und keine neue Wirkung auf die Questsimulation.
7. **Auto-Equip:** mit dem vorhandenen sieben Einträge umfassenden Sample-Katalog getestet. Keine Aussage zur Verarbeitung zukünftiger externer Itemkataloge. Keine neue Ausrüstung oder Rarity-Balance.
8. **Tod:** es gibt keine Wiederbelebung oder Nachrekrutierung als neues System. Sind die drei Startmitglieder nicht mehr verwendbar, über Werkzeuge eine neue Testgilde beginnen.
9. **CombatResult:** die Browseransicht hält die für diese Probe benötigten Result- und Statusdaten. Kein persistierbarer, vollständiger Unity-Folgenvertrag und kein produktiver Combat-Commit.
10. **Keine Save-Integration, kein Multiplayer, keine neuen Gameplay-Systeme.**

## Tatsächlich ausgeführte Prüfungen

Ausgeführt mit Node.js v24.19.0:

| Prüfung | Ergebnis |
|---|---|
| `node tests/rules.test.cjs` | 30 bestanden, 0 fehlgeschlagen |
| `node tests/ui-smoke.test.cjs` | 20 Prüfungen bestanden, minimaler DOM-Stub |
| `node --check` für rules.js, combat.js, skills.js, game.js | alle vier erfolgreich |
| Combat-Golden-Vektoren Seeds 0, 1, 7, UInt64.MaxValue | Fingerprint, Tick-1-Draw und vollständige Endsignatur stimmen jeweils überein |
| Sprint-11-Implementation-Baseline | 332/332 Dateien bytegleich, keine geändert/fehlend |

Der erste Lauf des neuen Testharness hatte vier Fehler, weil der RNG-Vergleich fälschlich Tick 0 verwendete. Die vorhandenen C#-Golden-Tests verwenden Tick 1. Nur der Testaufruf wurde entsprechend korrigiert; der vollständige Modelllauf wurde anschließend erneut ausgeführt. Ein Syntaxfehler in der neuen Browser-Roster-Ansicht wurde vor den abschließenden Prüfungen behoben.

**Nicht ausgeführt:** echte Browser-/Layoutprüfung, Safari auf iPhone, Touch-Abnahme auf realem Gerät, WebMCP in einem unterstützten Browser, Unity, C#-Kompilierung, NUnit, Xcode. Der DOM-Stub prüft Handler/HTML-Erzeugung und ist ausdrücklich kein Browser. Für diese statische Website steht im verwendeten Sites-Preview-Profil kein kompatibler Vorschau-Server zur Verfügung. Historische C#-57/57-Ergebnisse wurden nicht in diesem Durchlauf wiederholt und werden nicht als Browser- oder Unity-Nachweis ausgegeben.

Bekannte Risiken sind vor allem numerische Randfälle der Questportierung sowie noch nicht auf einem realen iPhone geprüfte Darstellung und Bedienung. Keine sonstigen Fehler aus den ausgeführten JavaScript-Prüfungen offen.

## Dateien

- `index.html`, `styles.css`: Einstieg, Touch-/Landscape-Oberfläche und Platzhaltergrafik.
- `game.js`: Oberflächenaktionen und In-Memory-Service-Verknüpfung.
- `rules.js`: Rekrutierung, Gruppen, Questsimulation, Rewards, Progression und Equipment.
- `combat.js`: isolierte JavaScript-Combat-Portierung.
- `skills.js`: bestehender F-Rang-Skillkatalog.
- `tests/`: ausführbare Node-Prüfungen und kopierte Combat-Referenzvektoren; für Hosting nicht erforderlich.
- `BROWSER_PLAYTEST_TEST_OUTPUT.txt`: tatsächlich ausgeführter abschließender Node-Prüflauf.

Für die Tests ist Node nötig; zum Spielen sind weder Node noch ein Buildsystem erforderlich. Die ZIP ist eine vollständig statisch hostbare Website, kein Unity-Projekt. Alle Unity-Dateien und die vorhandenen Implementierungs-, Ready-to-Play- und WebGL-Ready-ZIPs bleiben unverändert.
