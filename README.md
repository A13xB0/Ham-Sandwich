# Ham Sandwich — Ham Radio Flow Assistant

Static web app for **teleprompter-style** on-air phrasing, nets, and QSOs (UK-oriented reference). Open **`index.html`** in a browser, or use **GitHub Pages** (below) so it loads at the site root.

## GitHub Pages

1. Repo **Settings → Pages → Build and deployment**: source **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**.
2. After the first deploy, the app is at **`https://<user>.github.io/<repo>/`** (no filename needed). Keep `index.html`, `css/`, `js/`, and `images/` at the repository root.

If you publish from a **`/docs`** folder instead, move this project’s files into `docs/` so `docs/index.html` exists; paths in the HTML are already relative and will work.

## Notes

- **Examples are fictional** (e.g. `M0AAA`, `GB3EXA`). Verify repeaters, tones, talkgroups, and regulations before transmitting.
- Weather and grid lookup use **Open-Meteo** APIs (requires network).
- Settings and optional reflection text are stored in **localStorage** in your browser only (no server).
