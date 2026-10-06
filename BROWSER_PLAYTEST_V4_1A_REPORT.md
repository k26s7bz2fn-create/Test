# Browser-Playtest V4.1A — Persistent Progression

Stand: 5. Oktober 2026. Verbindliche direkte Basis: `GuildGame_BrowserPlaytest_V4_Progression.zip`.

## Ergebnis und Prüfgrenze

Implementiert: versionierter localStorage-Save mit Primary/Backup, automatisches Laden, Autosave nach Transaktionen, JSON-Import/Export, bestätigtes Löschen/Neustarten, Offline-Questfortschritt, deutlichere Level-/XP-/Gruppeninformationen und höherstufige normale Rekruten als Gold-Sink.

**Abschließender vollständiger Lauf: 367 Prüfungen/Checks bestanden, null fehlgeschlagen. Zusätzlich neun JavaScript-Dateien erfolgreich mit `node --check` geprüft.** Die Prüfungen sind Modelltests, DOM-Stubs und begrenzte Quell-/Assetprüfungen. Kein echter Safari-/iPhone-/Browser-Download-Test, kein Unity-Test und kein WebGL-Build wurde durchgeführt.

Die Anforderungen sind im Quellstand umgesetzt und automatisiert wie unten beschrieben geprüft. Die reale Browserabnahme — insbesondere echtes localStorage in Safari, Dateiauswahl/Download und Reload auf dem Zielgerät — bleibt offen und wird nicht als bestanden dargestellt.

## Änderungen an der V4-Basis

Vollständiger Dateivergleich: **50 Baseline-Dateien, 44 bytegleich, sechs geändert, keine gelöscht**. Der separate `V4_1A_BASELINE_COMPARISON.json` enthält die SHA-256-Werte jeder Baseline-Datei und ist ebenfalls im ZIP enthalten.

| Geänderte Datei | Technischer Grund |
|---|---|
| `rules.js` | Zwei kleine Recruitment-Erweiterungspunkte: höherstufigen Pool erzeugen und den tatsächlichen Kandidatenpreis in der bestehenden atomaren Kauftransaktion verwenden |
| `game.js` | Laden/Autosave, Import/Export/Reset, Save-Status, Preis-/Level-/XP-/Gruppenanzeigen |
| `index.html` | Zusätzliche Skripte in fester Reihenfolge, lokaler Dateieingang, Save-Statuszeile, Versionskennzeichnung |
| `progression.css` | Statuszeile als eigene Layoutzeile; kompakte Progressions- und Gruppeninformationen einschließlich Landscape-Regel |
| `tests/assets-v4.test.py` | Die nun ausdrücklich überholte V4-Anforderung „kein persistenter Save“ wurde durch „nur der angeforderte versionierte lokale Save, kein alternativer Speicherbackend“ ersetzt |
| `tests/run-all.py` | Bestehende Suiten plus vier neue V4.1A-Suiten ausführen |

Neue Laufzeitdateien: `save.js`, `recruitment.js`.

Neue Tests: `tests/save-v41.test.cjs`, `tests/recruitment-v41.test.cjs`, `tests/ui-v41.test.cjs`, `tests/assets-v41.test.py`.

Neue Dokumentation/Nachweise: dieser Bericht, `V4_1A_START_HERE.md`, `V4_1A_BASELINE_COMPARISON.json`, `BROWSER_PLAYTEST_V4_1A_TEST_OUTPUT.txt`.

**Bytegleich unverändert:** `combat.js`, `progression.js`, `skills.js`, `hall.js`, `hall-view.js`, `living-hall.css`, `styles.css` und sämtliche Bildassets einschließlich `hall-painted.webp`, `guild-master-painted.webp`, `adventurers-painted.webp`. Es gibt keine neue Questskalierung, keine Änderung der V4-Stärke-/Difficulty-/Rewardformeln und keine Änderung am Combat Core. Das bestehende Unity-Projekt wurde nicht bearbeitet.

## Save-Vertrag

Version: `guildgame.browser.save.v1`. Erwartete Regelversion: `browser.progression.v4`.

`createSaveData()` baut einen ausdrücklich definierten Datenvertrag aus ausgewählten Feldern. Es wird nicht blind der gesamte Runtime-State serialisiert. `validateSaveData()` prüft ihn vollständig; `restore()` rekonstruiert den bestehenden Runtime-State. Combat-Session, DOM, Animationen, Auswahlzustände, visuelle Hallenwege und Funktionen werden nicht gespeichert.

| Abschnitt | Persistierte Daten |
|---|---|
| Metadaten | SaveVersion, RulesVersion, UTC-Speicherzeit `savedAt`, virtuelle Spieluhr `clock` |
| Gilde | Gilden-XP und daraus abgeleitetes Level; Konsistenzprüfung beim Laden |
| Recruitment | Starterabschluss, Starterkandidaten, aktueller normaler Pool, Poolsequenz, Gilden-Level bei Poolerzeugung |
| Mitglieder | ID, Name, Klasse, Rang F, Level, XP, Tod, Recovery-Zeitpunkt, vorhandene Leadership-/Boldness-Werte, drei Equipment-Slots, zugewiesener Trank |
| Archiv | Vorhandene Minimaldaten entfernter Verstorbener für historische Questresultate |
| Gruppen | Stabile ID, Name, Mitglieds-IDs, Leader-ID |
| Quests | Angebote, Typ/Distanz/Stufe, bestehende Werte, Status, Party-/Teilnehmerbindung, Start/Ende, strukturierter Resolve-Result, Paid-Marker |
| Inventar | Gold, freie Item-Instances, DefinitionId, InstanceId, Rarity, freie Potions, Itemcounter |
| Counter | Gruppen- und Questcounter; Pool- und Itemcounter in ihren Abschnitten |

Skillpunkte und automatische Skillverteilung bleiben wie in V4 aus Klasse und konsistentem Level/XP ableitbar. Es wird keine zweite Skill- oder Progressionswahrheit angelegt. Ebenso ergeben sich Questbindungen/Gruppensperren aus dem gespeicherten Quest-Lifecycle. Itemrarity wird gespeichert und gegen den bestehenden Definitionenkatalog geprüft, nicht frei als neue Itemeigenschaft übernommen.

### Validierung

Geprüft werden unter anderem:

- exakte Objektstruktur und unterstützte Versionen;
- Typen, endliche Zahlen, sichere Ganzzahlen und Größenbegrenzungen;
- Klassen, Rang F, F-Level 1–10 und korrekte XP-/Levelzuordnung;
- Gilden-XP-/Levelkonsistenz und aktuelle Mitglieder-/Gruppen-/Einsatzlimits;
- eindeutige IDs, gültige Referenzen, historische Empfänger und passende monotone Counter;
- gültige Starterkandidaten, Pool-IDs und zur Erzeugungsstufe passende Kandidatenlevel;
- globale Gruppeneindeutigkeit, 1–6 Mitglieder, Leader innerhalb der Gruppe;
- Itemdefinition, Rarity, Slot-/Klassenkompatibilität und eindeutiger Itemstandort;
- laufende Questbindung an tatsächlich bestehende Gruppen/Teilnehmer;
- keine doppelte aktive Bindung, keine bezahlte laufende Quest;
- gültige Zeitpunkte und unveränderte V4-Questwerte;
- Resultteilnehmer, Todes-/Verletzungs-/Wipe-Konsistenz, XP, Gold, Gilden-XP und Lootvertrag;
- keine offenen Rewards für bereits aus dem Roster entfernte Empfänger.

Dateilimit: 2 MiB. Historische Listen sind auf jeweils maximal 10.000 Einträge begrenzt; Mitglieder/Parteien auf die V4-Maxima 20/5. Counter müssen sichere Ganzzahlen bis 1.000.000.000 sein. Diese technischen Grenzen verhindern übergroße oder offensichtlich beschädigte Importe; bei Überschreitung wird nicht stillschweigend gekürzt.

`migrateSave()` ist der zentrale Versionspunkt. Aktuell wird nur v1 unterstützt. Unbekannte Versionen werden mit verständlicher Meldung abgelehnt; es gibt keine erfundene Migration aus früheren Versionen. V4 besaß keinen persistenten Save.

## localStorage und Backup

Schlüssel:

```text
Primary: guildgame.browser.save.primary
Backup:  guildgame.browser.save.backup
```

Beide liegen ausschließlich im Browser-Origin der statischen Website. Keine Serverkommunikation, Accounts oder Cloudspeicherung.

Vor erfolgreichem Überschreiben wird ein vorhandener **vollständig validierter** Primary als Backup geschrieben. Ein beschädigter Primary darf ein gültiges Backup nicht überschreiben. Danach wird der neue validierte Primary geschrieben.

Ladereihenfolge:

1. Gültigen Primary laden.
2. Sonst gültiges Backup laden und sichtbar informieren.
3. Sind beide nicht vorhanden: normale neue Gilde ohne überschreibende Initialspeicherung.
4. Sind vorhandene Saves beide unbrauchbar: Rohdaten erhalten, Fehlermeldung anzeigen, Autosave auf diese Daten blockieren. Erst ein validierter Import oder ausdrücklich bestätigter Neustart darf sie ersetzen.

Ein Backup-Load schreibt nicht sofort den defekten Primary um. Bei einer späteren erfolgreichen Aktion darf der wiederhergestellte gültige Stand Primary werden; das gültige Backup bleibt dabei geschützt.

Speicherverweigerung/Quota-Fehler werden sichtbar im Save-Status gemeldet. Der aktuelle In-Memory-Spielstand bleibt spielbar/exportierbar; eine nicht erfolgte Speicherung wird nicht als Erfolg angezeigt. Das Backup ist ein vorheriger gültiger Commit, kein unbegrenztes Versionsarchiv.

Zusätzlicher Schutz: Der Dienst merkt sich die zuletzt gelesenen Primary-Bytes. Wurden sie zwischenzeitlich durch einen anderen Tab geändert, verweigert er das Überschreiben und fordert Reload oder Export. localStorage bietet keinen atomaren Compare-and-Swap über Tabs; ein exakt gleichzeitiger Schreibwettlauf kann damit nicht vollständig ausgeschlossen werden. Ein einzelner Spieltab ist empfohlen.

## Autosave

Die UI speichert nach jeder tatsächlich erfolgreichen veröffentlichten `change`-Transaktion. Damit sind Starteraufnahme, Kauf/Refresh, Gruppenänderungen, Start, Resolve, Reward, Auto-/Manual-Equip, Rückgabe, Verkauf, Gold-/XP-/Inventaränderungen und Entfernen Verstorbener abgedeckt.

Reward-Commit und Auto-Equip bleiben zwei getrennte vorhandene Schritte. Der erfolgreiche Reward wird **vor** der Nachverarbeitung gespeichert; die erfolgreiche Equipment-Nachverarbeitung speichert danach ihren eigenen Stand. Ein Nachverarbeitungsfehler macht den gebuchten Reward nicht rückgängig und ein Retry vergibt nichts erneut.

Außerdem wird beim tatsächlichen Übergang einer aktiven Quest nach CompletedPendingResolution, bei der bestehenden +60-Sekunden-Playtestaktion sowie beim Verbergen/Verlassen der Seite gespeichert, soweit kein bekannter Speicherfehler vorliegt. Der Speicher wird nicht im Animationstakt beschrieben.

Fehlgeschlagene Spieltransaktionen erreichen den Autosave-Aufruf nicht. Eine abgebrochene Startwarnung oder Verkaufbestätigung speichert keinen Zwischenzustand. Der manuelle Werkzeugpunkt „Spiel speichern“ steht zusätzlich bereit.

## Zeit, Offline-Fortschritt und Recovery

Die vorhandene virtuelle Millisekundenuhr und die vorhandenen Quest-Start-/Endzeiten bleiben erhalten. Ein Save ergänzt die reale UTC-Speicherzeit.

Beim Laden:

```text
neue Spieluhr = gespeicherte Spieluhr
             + max(0, aktuelle UTC-Zeit − gespeicherte UTC-Zeit)
```

Anschließend wird die bestehende reine Fälligkeitsprüfung ausgeführt. Eine offline abgelaufene Active-Quest wird CompletedPendingResolution. Sie wird **nicht** simuliert, bezahlt oder entsperrt. Gruppe, Mitglieder, Leader und Aktivplatz bleiben gebunden, bis der bestehende Resolve erfolgreich ausgeführt wird.

Recovery-Timestamps werden unverändert wiederhergestellt. Genesung richtet sich nach der fortgeschriebenen Spieluhr. Das bestehenden +60s-Werkzeug bleibt kompatibel: seine virtuelle Vorverlegung wird mitgespeichert.

Ein rückwärts gestellter Gerätezeitpunkt erzeugt keine negative Offline-Zeit. Es gibt keine vertrauenswürdige Serverzeit und keinen Anti-Cheat-Schutz gegen absichtlich verstellte Geräteuhren. Innerhalb der bestehenden Grenzen führen gleiche gespeicherte Daten und derselbe Ladezeitpunkt zum gleichen rekonstruierbaren Zustand.

## Import, Export und Neustart

Unter Werkzeuge stehen „Spiel speichern“, „Spielstand exportieren“, „Spielstand importieren …“ und „Neue Gilde …“ bereit.

Export erstellt kontrolliertes, validiertes JSON und einen lokalen Download namens `GuildGame_Save_YYYY-MM-DD.json` (Datum in UTC). Der Export benötigt keinen erfolgreichen localStorage-Schreibzugriff.

Import verwendet einen lokalen JSON-Dateieingang. Erst nach Größen-, Parse-, Versions-, Struktur-, Referenz- und Invariantenprüfung wird die Offline-Zeit rekonstruiert. Der importierte Stand wird erfolgreich in den lokalen Speicher geschrieben, **bevor** er den aktuellen UI-/Runtime-State ersetzt. Bei Parse-, Validierungs- oder Speicherfehler bleiben aktueller Runtime-State und bisheriger Primary unverändert. Ein gültiger alter Primary wird beim Import wie üblich zum Backup.

„Neue Gilde“ erfordert den sichtbaren Bestätigungsweg. Danach werden Backup und Primary gelöscht, ein echter Initialstate erzeugt, gespeichert und die Starterrekrutierung geöffnet. Scheitert die Löschung, wird kein neuer Stand darübergeschrieben. Die beiden localStorage-Schlüssel bilden technisch keine gemeinsame Datenbanktransaktion; bei einem Fehler mitten in einer Löschung kann bereits ein Schlüssel entfernt worden sein. Der Fehler wird ausdrücklich gemeldet.

## Progressive Recruitment

Starter unverändert: fünf F-Level-1-Kandidaten, genau drei kostenlos. Erste normale Poolerzeugung kostenlos; Refresh weiterhin 25 Gold, Poolgröße fünf. Bestehende Transaktions- und Kapazitätsregeln bleiben erhalten.

| Gilden-Level bei Poolerzeugung | Erlaubte F-Level | Gewichte aufsteigend nach Level |
|---|---|---|
| 1 | 1 | 1 |
| 2 | 1–2 | 2, 1 |
| 3 | 1–4 | 8, 4, 2, 1 |
| 4 | 2–6 | 16, 8, 4, 2, 1 |
| 5 | 3–8 | 32, 16, 8, 4, 2, 1 |

Zentrale Formel: `Gewicht(Level) = 2^(MaxLevel − Level)`. Das Gewicht wird durch die Summe der Gewichte des Bereichs geteilt. Höhere Level sind jeweils halb so häufig wie die unmittelbar niedrigere Stufe. Der Höchstlevel auf Gilden-Level 5 hat somit Gewicht 1 von 63.

Die Levelziehung verwendet eine eigene deterministische Hashdomäne `recruitment.level.v1`, Poolsequenz, Gilden-Level und Kandidatenindex. Keine Systemzeit, kein Combat-RNG. Gleiche Poolgeneration ergibt dieselben Kandidatenlevel. Bestehende Namen, Klassen, Rollen und IDs kommen weiterhin aus der vorhandenen Rekrutierung.

Ein bestehender Pool bleibt bei Gildenaufstieg unverändert. Erst die nächste normale Poolsuche verwendet den neuen Bereich. `poolGuildLevel` wird mitgespeichert, damit ein alter, weiterhin gültiger Pool nach einem Aufstieg korrekt validiert werden kann.

| Rekrut im Rang F | Preis |
|---|---:|
| Level 1 | 50 Gold |
| Level 2 | 90 Gold |
| Level 3 | 150 Gold |
| Level 4 | 230 Gold |
| Level 5 | 330 Gold |
| Level 6 | 460 Gold |
| Level 7 | 620 Gold |
| Level 8 | 800 Gold |

Die vorgeschlagenen Werte sind als zentrale Playtest-Preistabelle in `recruitment.js` übernommen. Levelbereiche und Gewichtsabfall stehen ebenfalls dort. Keine Rekruten über Level 8, kein E-Rang.

Ein Rekrut startet mit der vorhandenen kumulativen XP-Schwelle seines Levels, also ohne Fortschritt innerhalb dieses Levels. Skillpunkte und Skills leiten sich dadurch aus der bestehenden V4-Klassenlogik ab. Stärke verwendet unverändert V4 (`Klassenbasis + 25 × Levelabstand + bestehende Equipment-Eignung`). Es gibt keine Levelskalierung im Combat.

Der tatsächliche Kandidatenpreis wird vor dem Kauf auf der Karte und in der Kauftransaktion aus derselben zentralen Funktion ermittelt. Erst nach erfolgreicher Kapazitäts-/Gold-/ID-Prüfung werden Gold, Roster und Pool gemeinsam veröffentlicht und gespeichert. Wiederholte Käufe desselben entfernten Kandidaten werden abgewiesen.

## UI und Hallenbaseline

Mitglieder zeigen Name, Klasse, getrennt Rang/Level, Stärke, Lebens-/Recovery-Zustand und lokalen XP-Fortschritt bis zum nächsten Level. Beispiel: bei 85 kumulativen XP auf Level 3 zeigt die UI `XP 15 / 50 · noch 35 bis Lvl. 4`. Level 10 zeigt die bestehende Maximalgrenze ausdrücklich.

Freie und bereits zugeordnete Gruppenmitglieder zeigen Rang/Level, Stärke, Rollen und Status. Zusammengestellte Gruppen zeigen Gesamtstärke, Durchschnittslevel und Tank-/Heilungs-/Schadens-/Supportabdeckung. Durchschnittslevel bezieht sich auf die ganze Gruppe; einsatzrelevante Rollenabdeckung auf lebende, genesene Mitglieder. Die eigentlichen Partyregeln ändern sich nicht.

Kandidaten zeigen tatsächliches Level, vorhandene Rollen, Stärke und individuellen Preis. Die neue Save-Statuszeile bleibt sichtbar; ihr zusätzlicher Platz ist im Desktop-/Landscape-Grid berücksichtigt.

Die Painted Living Hall bleibt unverändert. Es werden keine neuen 3D-Assets oder Visual-Identity-Platzhalter eingeführt. Bestehende stabile Adventurer-IDs, Klasse, Leader-Zuordnung und Equipment-Slots bleiben für eine spätere individuelle Darstellung verfügbar. Die langfristige Idee, primär Gruppenleiter physisch darzustellen, wird hier noch nicht umgesetzt.

## Automatisierte Prüfungen

Abschließend ausgeführt: `python3 tests/run-all.py`. Vollständige Ausgabe: `BROWSER_PLAYTEST_V4_1A_TEST_OUTPUT.txt`. Alle Teilbefehle Exitcode 0.

| Suite | Bestandene Prüfungen/Checks |
|---|---:|
| Basis-Spielmodell | 30 |
| Recruitment V2 | 21 |
| Basis-UI-Stubs | 20 |
| V2-UI-Stubs | 10 |
| V2 statisch | 14 |
| V3 Hallenmodell | 33 |
| V3 UI-Stubs | 11 |
| V3 Asset-/Quellchecks | 36 |
| V4 Progression/Combat-Regressionen | 60 |
| V4 UI-Stubs | 14 |
| V4 Loop-/Atomaritätsfälle | 8 |
| V4 Asset-/Quellchecks | 23 |
| Neuer Save-Vertrag/-Dienst | 46 |
| Neue progressive Rekrutierung | 15 |
| Neue Save-/Progressions-UI-Stubs | 13 |
| Neue V4.1A Quell-/Assetchecks | 13 |
| **Gesamt** | **367** |

Zusätzlich neun erfolgreiche Syntaxprüfungen. Dateireferenz-Checks wachsen durch die beiden neuen Skripte. Historische Suiten testen weiterhin ihren expliziten Basis-/V4-Modus; die neuen Suiten laden V4.1A inklusive Recruitment und Save. Keine Suite wurde gelöscht.

Die 46 Savefälle prüfen unter anderem Rundreise aller relevanten Zustände, Gold, XP, Equipment, Inventar, Pool, Gruppen/Leader, laufende/pending/resolved/paid Quests, Offlinezeit, Recovery, Archivdaten, Counter, defekte Saves, Backup, Import, Größen-/Quota-/Speicherfehler, konkurrierende Tabs und bestätigte Löschung.

Die Recruitment-Suite prüft jeden Gildenbereich über 200 Pools, die exakten Gewichte und Preise, Reproduzierbarkeit, Skill-/Powerkonsistenz, Kapazität, unzureichendes Gold, Einmaligkeit und unveränderte alte Pools.

Die UI-Suite führt alle Laufzeitskripte mit einem simulierten DOM und Speicher aus. Sie prüft Autosave nach Starter und Kauf, fehlgeschlagene Transaktionen ohne Save, Reload, sichtbare Informationen, JSON-Exportdaten, Importvalidierung, bestätigten Neustart und Reward-Retry nach Reload. Das ist **kein** echter Safari-Dateidownload oder Gerätetest.

### Während der Prüfung geklärt

- Der bisherige statische V4-Test „kein Save“ scheiterte erwartungsgemäß an der ausdrücklich angeforderten localStorage-Erweiterung. Er wurde fachlich nachvollziehbar auf den neuen lokalen Save-Vertrag umgestellt; die Änderung ist oben als Bestandsänderung aufgeführt.
- Zwei neue Import-UI-Tests prüften vor Abschluss der asynchronen Dateilesung. Die Tests warten jetzt auf deren tatsächliche Event-Loop-Verarbeitung, ohne die geprüften Zustands-/Fehlerbehauptungen abzuschwächen.
- Der neue Reset-UI-Test verwendete zunächst einen Initialstate-Stub, der auch bei Reset immer eine bereits rekrutierte Gilde lieferte. Der Test beginnt jetzt mit dem echten Initialstate und rekrutiert über die UI. Die Produktions-Neustartlogik wurde nicht zum Erfüllen dieses fehlerhaften Stubs verändert.

## Bekannte Grenzen und Abnahme

- Reale Safari-/iPhone-Lauffähigkeit, Touchlayout, Dateiimport/-export und localStorage-Verhalten wurden hier nicht praktisch auf einem Gerät geprüft. Diese externe Abnahme ist noch erforderlich.
- Browser können lokale Daten löschen; Privatmodus und Quotas unterscheiden sich. Ein JSON-Export ist die portable Sicherung. Backup ist ebenfalls nur lokal und kein Schutz gegen das Löschen aller Websitedaten.
- Schlüssel sind pro Website-Origin gültig. Mehrere Kopien dieses Spiels unter derselben Origin teilen dieselben Schlüssel; keine Mehrmandanten-/Profilverwaltung.
- Kein Cloudsave, keine Accounts, keine Serverzeit. Lokale JSON-Dateien sind nicht kryptografisch signiert. Validierung schützt Struktur/Konsistenz, nicht vor absichtlicher Save-Manipulation innerhalb gültiger Werte.
- Historische Questdaten werden nicht automatisch gekürzt. Bei Erreichen der Größenlimits wird ein Speicherfehler gemeldet statt Daten unbemerkt zu verwerfen.
- Probekampf und Hallen-Animationspositionen sind transient. Sie werden nicht restauriert; der autoritative Gildenbestand schon.
- Das Backupsystem umfasst zwei einzelne Browser-Schreiboperationen. Es wird keine datenbankartige atomare Mehrschlüssel-Transaktion behauptet.
- Bestehende V4-Balance, Management-Stärke und Questschwierigkeit bleiben unverändert; höherstufige Rekruten beeinflussen sie ausschließlich über ihr reguläres Level.
- Keine Unity-/C#-/Xcode-Prüfungen in diesem Durchlauf. Keine Änderung des Combat Core.

## Deployment und nächste externe Prüfung

Das ZIP enthält die vollständige statische Website im Root. Gesamten Inhalt im bisherigen GitHub-Pages-Repository ersetzen/ergänzen, Assets vollständig mitnehmen. Pages bleibt **main / (root)**. Kein npm, Buildserver, CDN oder Backend notwendig. In diesem Durchlauf wurde nicht veröffentlicht und keine neue URL erzeugt.

Erster externer Test: drei Starter rekrutieren, Export sichern, Seite reloaden; danach Gruppe und Equipment über Reload prüfen; laufende Quest schließen/erneut öffnen, Pending-Sperren prüfen, Resolve und Reward ausführen und nach erneutem Reload Reward-Retry versuchen. Anschließend Import/Backupverhalten und höhere Rekruten nach Gildenaufstieg prüfen. Die Kurzfassung steht in `V4_1A_START_HERE.md`.

V4.1A ist als Quellstand samt automatisierten Nachweisen ausgeliefert. Die reale Browserabnahme bleibt offen. V4.1B, dynamische Quests, Unity-Integration und weitere Entwicklungsphasen wurden nicht begonnen.
