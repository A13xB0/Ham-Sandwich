# Ham Radio Flow Assistant

Static web app for **teleprompter-style** on-air phrasing, nets, and QSOs (UK-oriented reference). Open `ham_radio_flow_cheat_sheet.html` in a browser (double-click works in Chrome). Keep `css/` and `js/` next to the HTML file.

## GitHub Pages

Push this folder to a repository and enable **GitHub Pages** from the `main` branch (root or `/docs`). Example: `https://<user>.github.io/<repo>/ham_radio_flow_cheat_sheet.html` if the file is at the site root.

## Notes

- **Examples are fictional** (e.g. `M0AAA`, `GB3EXA`). Verify repeaters, tones, talkgroups, and regulations before transmitting.
- Weather and grid lookup use **Open-Meteo** APIs (requires network).
- Settings and optional reflection text are stored in **localStorage** in your browser only (no server).
