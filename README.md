# Ham Sandwich — Ham Radio Flow Assistant

**Live site:** [https://a13xb0.github.io/Ham-Sandwich/](https://a13xb0.github.io/Ham-Sandwich/)

This project was **vibe coded**—a small, informal tool to help **ease stuttering**, **stay on track**, and **sound a bit more confident** on the air, especially for **new hams** who are still learning what to say on nets and QSOs. It is not a course or an authority on regulations; it is a friendly script helper you run in the browser.

Static web app for **teleprompter-style** on-air phrasing, nets, and QSOs (UK-oriented reference). Open **`index.html`** locally in a browser, or use the live link above.

## GitHub Pages

1. Repo **Settings → Pages → Build and deployment**: source **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**.
2. After the first deploy, the app is at **`https://<user>.github.io/<repo>/`** (no filename needed). This repo’s public URL is [https://a13xb0.github.io/Ham-Sandwich/](https://a13xb0.github.io/Ham-Sandwich/). Keep `index.html`, `css/`, `js/`, and `images/` at the repository root.

If you publish from a **`/docs`** folder instead, move this project’s files into `docs/` so `docs/index.html` exists; paths in the HTML are already relative and will work.

## Notes

- **Examples are fictional** (e.g. `M0AAA`, `GB3EXA`). Verify repeaters, tones, talkgroups, and regulations before transmitting.
- Weather and grid lookup use **Open-Meteo** APIs (requires network).
- Settings and optional reflection text are stored in **localStorage** in your browser only (no server).
