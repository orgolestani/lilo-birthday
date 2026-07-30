# Lilo's Birthday Site

A single-page countdown + surprise-reveal site for Aug 11, 2026.

## Before the day
- Edit the placeholder details in [`script.js`](script.js) (search for `[ADD ADDRESS HERE]`) — fill in real addresses / notes for each station. Times are read from the visitor's own device clock, so double check they're correct for wherever she'll actually be that day.
- The photo montage lives in `index.html` under `<section class="gallery">` — each photo is `images/photo-XX.jpg` with a `data-caption="..."` attribute. Swap the `[add a memory about this one]` placeholders for real captions if you want (optional — looks fine without).
- To add/remove photos: drop a JPG into `images/`, then add or remove a `<figure class="polaroid" data-caption="...">` line to match. Any image works, but keep them under ~1.5MB / 1400px wide for fast loading (originals were converted with `sips -s format jpeg -Z 1400 file.HEIC --out images/photo-XX.jpg`).

## Deploying to GitHub Pages
1. Create a new GitHub repo and push this folder to it.
2. In the repo, go to **Settings → Pages**, set source to the `main` branch (root), save.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Local preview
Just open `index.html` in a browser, or run a tiny local server from this folder:

```bash
python3 -m http.server 8765
```

then visit `http://localhost:8765`.
