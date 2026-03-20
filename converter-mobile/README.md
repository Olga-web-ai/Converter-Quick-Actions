# Converter Prototype

Static HTML prototype built from exported Figma frames for the `Converter` file.

## Run locally

From the project root:

```bash
cd prototype
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

## Real HTML buy page

The image-based prototype is still available at:

```text
http://localhost:4173/
```

The first real DOM implementation of the buy screen is available at:

```text
http://localhost:4173/buy.html
```

## Presentation controls

- Tap visible UI elements inside the phone to move between screens.
- In the fiat focus state, the numeric keyboard is interactive.
- Amounts below `15.00 EUR` switch to the error state.
- In the asset sheet, network filters are interactive and asset rows are selectable.
- `←` / `→` cycles through the exported states.
- `R` resets to the main `With points` screen.
- Add `?debug=1` to the URL to reveal hotspot areas.

## Included screens

- `with-points`
- `fiat-focus`
- `error`
- `asset-focus`
- `select-asset`
- `filtered`
- `select-currency`
- `activate-points`
- `terms`
- `sell`

## Publish to GitHub Pages

This is a static site with no build step.

Typical options:

1. Put the contents of `prototype/` at repository root, or in `docs/`.
2. Push to GitHub.
3. Enable GitHub Pages in repository settings.
4. Set the publishing source to the branch/folder you chose.
