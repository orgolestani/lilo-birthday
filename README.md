# Lilo's Birthday Site

A single-page countdown + surprise-reveal site for Aug 11, 2026.

## Before the day
- Edit the placeholder details in [`script.js`](script.js) (search for `[ADD ADDRESS HERE]`) — fill in real addresses / notes for each station. Times are read from the visitor's own device clock, so double check they're correct for wherever she'll actually be that day.
- Photos are scattered around the page rather than in one gallery block, so they read fine on a phone (thin screens can't fit side margins). There are two kinds, both in `index.html`:
  - **Interludes** (`class="polaroid interlude ..."`) — always visible, sit in the normal content flow: one below the countdown, one between station 1 & 2 and one between station 2 & 3 (added by `script.js`, see `STATION_INTERLUDES`), one above the footer.
  - **Margin scatter** (`class="polaroid scatter scatter-h1"` etc.) — bonus photos that only appear once the browser window is wide enough (≥1300px) to fit them beside the content without crowding; hidden entirely on phones/tablets.
- Every photo has a `data-caption="..."` attribute — swap the `[add a memory about this one]` placeholders for real captions if you want (optional, looks fine without). Tapping any photo opens it full-size.
- To add/remove a photo: drop an image into `images/`, then add/remove the matching `<figure class="polaroid ...">` line (or, for a between-station photo, an entry in `STATION_INTERLUDES` in `script.js`). Keep images under ~1.5MB / 1400px wide for fast loading — HEIC photos were converted with `sips -s format jpeg -Z 1400 file.HEIC --out images/photo-XX.jpg`, and the GIF was shrunk with `ffmpeg -i file.GIF -vf "scale=420:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 images/photo-XX.gif`.

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
