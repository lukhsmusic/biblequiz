# Bibelquiz

Bibelvers wird angezeigt, du rätst wo er steht. Schlachter 2000.

## Projektstruktur

```
index.html              Hauptseite (Single Page App)
css/style.css           Styling (mobile-first)
js/
  app.js                UI-Logik, Screen-Wechsel, Ergebnis-Berechnung
  bible.js              Bibeldaten laden und abfragen
  random.js             Datums-basierter Zufallsgenerator für Tagesliste
data/
  bible.json            Bibeldaten als JSON (generiert aus CSV)
tools/
  convert.py            Konvertiert schlachter.csv → data/bible.json
```

## Lokal starten

```bash
python3 -m http.server 8080
```

Dann im Browser öffnen: http://localhost:8080

Auf dem Handy im gleichen WLAN: `http://<deine-lokale-ip>:8080`

## Spielmodi

- **Zufällig** — komplett zufälliger Vers bei jedem Klick
- **Tagesliste** — 100 Verse pro Tag, gleich für alle Spieler (Fortschritt wird im Browser gespeichert)

## Bibeldaten neu generieren

Falls sich die CSV ändert:

```bash
python3 tools/convert.py
```

Erwartet `schlachter.csv` im Projektordner, schreibt nach `data/bible.json`.
