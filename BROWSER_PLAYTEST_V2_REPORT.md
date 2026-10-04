# BROWSER PLAYTEST V2 – Abschlussbericht

Stand: 3. Oktober 2026. Separate statische Browser-Weiterentwicklung auf Basis des lokal verfügbaren `GuildGame_Sprint11_BrowserPlaytest.zip`. Die veröffentlichte Website wurde nicht abgerufen; ein Live-Abgleich oder Upload zu GitHub hat nicht stattgefunden. Keine Unity-Produktionsänderung, kein Sprint 12.

## Recruitment 2.0

Die kostenlose Starterrunde bleibt unverändert: fünf F1-Kandidaten, genau drei auswählen. Ihr Abschluss erzeugt zusätzlich den ersten normalen F1-Pool mit fünf Kandidaten, ohne Gold abzuziehen.

| Vorgang | Verbindlich umgesetzt |
|---|---|
| Normaler F1-Kandidat | 50 Gold, ein Mitglied, Kandidat aus Pool entfernt |
| Neue Kandidaten suchen | 25 Gold, alten Pool durch fünf neue ersetzen |
| Erster normaler Pool | Kostenlos |
| Gildenkapazität | 12, Verstorbene zählen bis zur bestätigten Entfernung mit |
| Zu wenig Gold / volle Gilde | Verständliche Fehlermeldung; keine Teiländerung |
| Weitere Runden | Wiederholt möglich, solange Gold/Plätze vorhanden sind |

Kosten und Kapazität stehen zentral in `rules.js` unter `recruitmentConfig`. Normale Kandidaten nutzen die vier vorhandenen Klassen, F1-Daten und den vorhandenen Generator. Poolnummern erzeugen reproduzierbare neue IDs; Namen dürfen wie bisher wiederkehren, Identitäten nicht.

Rekrutierung und Goldabbuchung werden gemeinsam auf einer Kopie validiert und veröffentlicht. Derselbe Kandidat kann danach nicht erneut gekauft werden. Refresh-Anfragen tragen die erwartete Poolnummer: ein wiederholter Request kann nicht nochmals abbuchen. Die Oberfläche blockiert außerdem für 500 ms weitere Kauf-/Refresh-Touches, um auch den zweiten Tap auf bereits neu gerenderte Buttons abzufangen. Diese kurze Bedienungssicherung ändert keine Gameplay-Zeit oder Combat-Regel.

## Verstorbene und freie Plätze

Im Roster ist eine ausdrücklich beschriftete Aktion vorhanden: „Aus Gildenregister entfernen …“. Sie öffnet erst einen Bestätigungsdialog mit Namen. Abbrechen verändert nichts; ausschließlich „Endgültig entfernen“ bestätigt den Vorgang.

Technische Integrationsgrenzen:

- Nur verstorbene, nicht questgebundene Mitglieder können entfernt werden.
- Offene, noch nicht gebuchte Questresultate dieses Mitglieds müssen vorher abgeholt werden. Andernfalls würde eine bereits festgeschriebene Reward-Zuordnung ins Leere verweisen. Die UI meldet dies ausdrücklich.
- Die Bestätigung entfernt die aktive Gildenmitgliedschaft, bereinigt bestehende Gruppenzuordnungen und leert gegebenenfalls den Leader-Slot. Eine dadurch leere Gruppe wird aufgelöst.
- Eventuell noch zugeordnete Ausrüstung/Tränke werden zurückgegeben; nichts wird dupliziert.
- Ein kleiner historischer Anzeigedatensatz aus ID, Name, Klasse und Level bleibt erhalten, damit ältere Questresultate lesbar bleiben. Keine zweite aktive Mitgliederverwaltung, keine Gedenktafel und keine Wiederbelebung.

## Eigene Fantasy-Grafik

Die Halle ist jetzt das zentrale Bild: steinerne Wände, Holzbalken, Fenster, Banner, Kamin, Guild-Master-Schreibtisch, Rekrutierungsbereich, Gruppentisch, Anschlagbrett, Truhe und Portal. Alle sechs Verwaltungsziele sind in der Halle antippbar; die feste Navigation bleibt als gleichwertiger schneller Zugang erhalten.

Neun neue, eigenständig gezeichnete lokale SVGs:

- `assets/guild-hall.svg`
- `assets/warrior.svg`, `rogue.svg`, `mage.svg`, `priest.svg`
- `assets/goblin-melee.svg`, `goblin-ranged.svg`, `goblin-brute.svg`, `goblin-boss.svg`

Krieger zeigen Rüstung/Schild/Schwert, Schurken Leder/Dolche, Magier Stab/arkane Akzente und Priester einen heilenden Fokus. Die vier Goblinprofile haben eigene Silhouetten und Waffen. Keine Blizzard-/WoW-Bilder, Figuren, Logos, UI oder sonstigen fremden Assets wurden übernommen. Die Illustration ist bewusst stilisierte 2D-Vektorgrafik, kein 3D-Modell und keine finale Art-Produktion. Kandidaten derselben Klasse teilen zunächst eine Illustration.

Die UI nutzt Holz-/Metallrahmen, Pergament, Siegel, goldene Akzente und Klassenfarben. Roster-Karten zeigen Rang/Level, XP, Skillpunkte, Lebensstatus, Equipment und Gruppenzugehörigkeit. Verstorbene und Verletzte erhalten eigene Darstellung. Lager und die drei Equipment-Slots sind klar unterscheidbar. Der aktuelle Sample-Katalog enthält Common-Ausrüstung; es wurden keine höherwertigen Items hinzugefügt.

## Animationen und Feedback

- Kurze Seiten-/Kartenübergänge, dezentes Charakter-Idle und Lichtillusionen für Kamin/Portal.
- Goldgewinn/-ausgabe mit kurzem Hervorheben und tatsächlichem vorzeichenbehaftetem Betrag.
- Ankunftsmeldungen bei Rekrutierung, Quest-Abreise/-Rückkehr und animierte Fortschrittsbalken.
- Resultat- und Loot-Reveal, XP-Balken sowie Level-up-Meldung mit neuer Stufe und tatsächlich vergebenen Skillpunkten.
- Im Probekampf: Angriffsimpuls, Trefferreaktion, Schadens-/Crit-Zahlen, Heilzahlen/-glühen, HP-/Mana-Veränderungen, DoT-Farbfeedback und Stun-Indikator.
- Eigene Darstellung für kampfunfähig, stabilisiert und tot; Victory/Defeat/Wipe sind erkennbar. TechnicalAbort wird ausdrücklich als technischer Abbruch und nicht als normale Niederlage beschriftet.

Animationen konsumieren ausschließlich die Ereignisse und Zustände aus dem bestehenden `combat.js`. Kein RNG-Draw, Cooldown, Schaden oder Tick wird von einer Animation bestimmt. Animationen blockieren keine Aktion und sind kein Teil des Commits. Bei sehr vielen Ereignissen werden maximal die letzten zwölf einer UI-Aktualisierung animiert; pro Figur bleiben höchstens drei Zahleneffekte gleichzeitig im DOM. Das Kampfprotokoll bleibt separat verfügbar.

## Mobile und Performance

Landscape-Anordnung, Safe-Area-Padding, `viewport-fit=cover` und dynamische Viewporthöhe bleiben enthalten. Hauptbuttons haben mindestens 48 CSS-Pixel Höhe, Hallen-Hotspots auf kleinem Landscape mindestens 44. Keine Hover-only-Aktion, keine Maus-/Tastaturpflicht. Wichtige Listen scrollen vertikal; die Navigation bleibt sichtbar.

Keine Videos, CDN-Bibliotheken, WebGL-Dekoration, externen Fonts oder Netzwerk-API. SVGs sind lokal und klein. Combat-Figuren werden während des Kampfes nicht mehr bei jedem UI-Tick vollständig neu aufgebaut; HP/Mana, Status und Ereignisse werden gezielt aktualisiert. CSS-`prefers-reduced-motion` und eine entsprechende JavaScript-Prüfung unterdrücken Bewegungseffekte. Die tatsächliche FPS, Speicherlast, Textlesbarkeit und Freiheit von Clipping auf dem iPhone wurden nicht gemessen.

## Unveränderte Gameplay-Basis

Bytegleich zur Browser-V1:

- `combat.js`
- `skills.js`
- `tests/rules.test.cjs`
- `tests/combat_v01_rng_vectors.json`

In `rules.js` wurden zusätzlich die vorhandenen Equipment-, Questsimulations- und bisherigen Operationsabschnitte (Party, Queststart, Resolve, Reward, Equipment-Rückgabe) textgleich verglichen. Die Änderungen betreffen den Recruitment-Zustand, dessen neue Operationen und die ausdrücklich gewünschte Entfernung Verstorbener.

Damit wurden keine Questformeln, Reward-/XP-/Skillregeln, Potion-/Equipmentbewertungen oder Combatwerte neu balanciert. Der bestehende Probekampf bleibt ohne Gildenfolgen und ohne Potionverbrauch. Es gibt keine neuen Questtypen, keine stärkere Questbalance und keine neuen Kampfsysteme.

Die 332 Dateien des vorhandenen Sprint-11-Unity-Implementation-Bestands wurden gegen dessen ZIP verglichen: **332/332 bytegleich**.

## Dateien

Geändert gegenüber dem Browser-V1-ZIP:

| Datei | Grund |
|---|---|
| `rules.js` | Recruitment 2.0 und bestätigte Entfernung Verstorbener |
| `game.js` | Fantasy-Ansichten, neue Rekrutierungs-/Entfernungsaktionen, rein visuelle Ereignisreaktionen |
| `styles.css` | Neues Art Design, Touch-/Landscape-Anordnung und Animationen |
| `index.html` | V2-Kennung und zugängliche Effekt-/Meldungsfläche |
| `BROWSER_PLAYTEST_README.md` | Aktuelle Bedienung, Kosten und bestehendes GitHub-Pages-Branch-Deployment |
| `tests/ui-smoke.test.cjs` | Nur zwei Text-Erwartungen für die neuen Hallen-/Rekrutierungstexte angepasst; alle 20 Prüfungen erhalten |

Neu: neun SVGs unter `assets/`, `.nojekyll`, `tests/recruitment-v2.test.cjs`, `tests/ui-v2.test.cjs`, `tests/static-v2.test.py`, `BROWSER_PLAYTEST_V2_REPORT.md` und `BROWSER_PLAYTEST_V2_TEST_OUTPUT.txt`.

Die ursprüngliche `BROWSER_PLAYTEST_TEST_OUTPUT.txt` bleibt als historisches Protokoll erhalten; sie wird nicht als neuer V2-Lauf ausgegeben.

## Tatsächlich ausgeführte Prüfungen

Mit Node.js v24.19.0 und Python 3:

| Prüfung | Ergebnis |
|---|---|
| Bestehende Browser-Modellregression | 30 bestanden, 0 fehlgeschlagen |
| Recruitment-V2-Modelltests | 21 bestanden, 0 fehlgeschlagen |
| Bestehender UI-Smoke-Test, DOM-Stub | 20 Prüfungen bestanden |
| Neue begrenzte UI-/Animationsprüfungen, DOM-Stub/Quellprüfung | 10 bestanden, 0 fehlgeschlagen |
| Relative Pfade, lokale Assets, Konfiguration, UI-Quellgrenzen | 14 bestanden |
| JavaScript-Syntaxprüfung | rules.js, game.js, combat.js, skills.js erfolgreich |

Abgedeckt sind unter anderem kostenlose Starter/erster Pool, Kosten 50/25, Goldmangel, Kapazität, freie Plätze, wiederholte/stale Requests, Questgold als Kaufquelle, bestätigte Entfernung, Rückgabe von Beständen, historische Resultatanzeige, sichtbare Ressourcenaktualisierung, Navigation, Animationsevents, Pause und identischer Combat-Zustand bei aktivem Reduced Motion. Die bestehenden vier Combat-Golden-Vektoren einschließlich Endsignatur sind Bestandteil der 30 unveränderten Modelltests.

Während der Entwicklung hatte ein neuer Test eine falsche Namensannahme („Joren“ statt des tatsächlich generierten Namens). Der Test prüft jetzt die Erhaltung des tatsächlichen Namens. Der alte UI-Test erwartete zuvor die ersetzten Hallen-/Rekrutierungstexte; nur diese beiden Textvergleiche wurden angepasst. Kein Modell-/Combat-Test wurde entfernt oder abgeschwächt.

## Offene Prüfungen und bekannte Grenzen

**Keine echte Browserausführung:** Playwright ist vorhanden, aber die Chromium- und WebKit-Browserdateien fehlen. Der Browserstart konnte nicht erfolgen. Es wurden keine Browser heruntergeladen. DOM-Stubs sind keine Rendering-/Touchprüfung.

Daher offen: Safari/iPhone-Abnahme, tatsächliche Landscape-Geometrie/Safe-Areas, Touch-Fehlbedienung auf Hardware, visuelle Qualität im Browser und Performance. Der statische Check bestätigt vorhandene Regeln/Assets, nicht das gerenderte Ergebnis. Keine Unity-, C#-, NUnit-, Xcode- oder neuen GitHub-Deployment-Ergebnisse werden behauptet.

Bekannte funktionale Grenzen:

- Browserzustand bleibt flüchtig. Neuladen setzt die Gilde zurück.
- Keine Wiederbelebung. Wenn alle Mitglieder sterben und nicht genug Gold für neue vorhanden ist, bleibt „Neue Gilde“ als Test-Neustart.
- Historische Anzeigenamen bleiben nach Entfernung bestehen. Noch offene Belohnungen müssen vor Entfernung gebucht werden.
- Der vorhandene JavaScript-Questport nutzt `Number` statt C# `decimal`; numerische Grenzabweichungen gegenüber Unity bleiben möglich.
- Browserlokale Equipment-/Kandidaten-IDs und In-Memory-Transaktionen sind kein Unity-Save-/RuntimeStore-Austauschformat.
- Fortschritt/Combat sind nicht persistent; der Combat-Test bleibt isoliert.

## GitHub Pages und Übergabe

Die ZIP enthält `index.html` direkt auf Root-Ebene, sämtliche Skripte, CSS, neun lokale Assets, `.nojekyll`, Tests und Dokumentation. Alle Laufzeitpfade sind relativ und funktionieren auch unter einem Repository-Unterpfad. Veröffentlichung weiterhin aus **main / (root)**; kein neuer GitHub-Actions-Workflow und kein neuer Link erforderlich. Der alte Link bleibt nach Ersetzen der Dateien im selben Repository der Einstieg. Ein erfolgreicher externer GitHub-Pages-Lauf und der erste Safari-Test müssen noch erfolgen.

Unity bleibt unverändert. Keine Unity-Abnahme behauptet. Save bleibt offen. Sprint 12 wurde nicht begonnen. Keine weitere Entwicklungsphase wurde gestartet.
