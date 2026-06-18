# On This Day

A small static website that lists notable historical events for any day of the year.

## Features

- Shows **today's** events on load
- Pick any **month / day** to browse events from history
- Each event shows the **year**, a description, a thumbnail (when available), and a **link to Wikipedia**
- No build step, no backend, no API key

## How it works

The page fetches data directly from
[Wikipedia's "On this day" REST API](https://en.wikipedia.org/api/rest_v1/),
which is free, requires no key, and supports CORS — so the browser can call it
directly. Content is licensed under
[CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).

## Run it locally

Because it's just static files, you can open `index.html` directly, or serve it
with any static server:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000

# or Node
npx serve
```

## Files

- `index.html` — markup and page structure
- `style.css` — styling
- `app.js` — fetches and renders events

## Deploy

Drop these files on any static host (GitHub Pages, Netlify, Vercel, etc.).
For GitHub Pages, enable Pages on the repository and point it at this branch.
