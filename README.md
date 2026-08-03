# DailyLog

A simple, standalone tech blog with two parts:

- **Public site** (`/index.html`) — shows your articles, newest first, with a
  glowing **NEW** marker on anything a visitor hasn't seen yet.
- **Admin portal** (`/admin.html`) — password-protected page where you write
  and publish new entries, and delete old ones.

No database server to install. Articles are stored in a plain JSON file
(`data/articles.json`) that the backend reads and writes.

## Folder structure

```
dailylog/
├── server.js              # Express app entry point
├── package.json
├── .env.example            # copy to .env and fill in your own values
├── data/
│   ├── articles.json       # your articles live here (auto-created/updated)
│   └── db.js                # helper functions to read/write articles.json
├── routes/
│   ├── articles.js         # GET/POST/PUT/DELETE /api/articles
│   └── auth.js              # POST /api/login
├── middleware/
│   └── auth.js              # protects admin-only routes
└── public/                  # everything here is served as-is
    ├── index.html           # public blog
    ├── admin.html           # admin login + dashboard
    ├── css/style.css
    └── js/
        ├── main.js           # public feed logic + "seen/unseen" tracking
        └── admin.js          # login + publish/delete logic
```

## 1. Install

You need [Node.js](https://nodejs.org) (v18 or newer) installed.

```bash
cd dailylog
npm install
```

## 2. Set your admin password

```bash
cp .env.example .env
```

Open `.env` and set:

```
ADMIN_PASSWORD=pick-a-real-password
JWT_SECRET=any-long-random-string
PORT=3000
```

`JWT_SECRET` just needs to be long and random — it's used to sign your login
session, not something you need to remember. On Mac/Linux you can generate
one with `openssl rand -hex 32`.

**Never share your `.env` file or commit it to a public GitHub repo.**

## 3. Run it

```bash
npm start
```

Then open:
- Public site: http://localhost:3000
- Admin portal: http://localhost:3000/admin.html

## How the "NEW" tag works

Each visitor's browser remembers (via `localStorage`) the last time they
looked at the site. On each visit, any article published after that
timestamp gets the amber **NEW** dot and badge. Once they've seen the page,
that timestamp updates — so the badge naturally disappears next visit. This
is per-browser, not global, which is normal for this kind of feature.

## Writing an entry

In the admin dashboard, paragraphs are separated by a **blank line** — just
hit Enter twice between paragraphs and it'll format correctly on the public
page. There's no rich-text/markdown support by design, to keep things simple;
say if you'd like that added later and it can be layered in.

## Deploying it publicly

This is a normal Node/Express app, so it runs on almost any host that
supports Node — for example [Render](https://render.com),
[Railway](https://railway.app), or a small VPS. General steps:

1. Push this folder to a GitHub repo (make sure `.env` is in `.gitignore`
   and never pushed).
2. On your host, set the same environment variables from `.env`
   (`ADMIN_PASSWORD`, `JWT_SECRET`, `PORT`) in their dashboard.
3. Set the start command to `npm start`.

One thing to know: `data/articles.json` is a file on disk. Some hosts (like
Render's free tier) reset the filesystem on redeploy, which would wipe your
articles. If you outgrow the JSON file, the `data/db.js` file is the only
place that would need to change to swap in a real database — everything else
talks to it through the same handful of functions, so the rest of the app
won't need to change.

## Extending it later

Ideas that would layer in cleanly if you want them down the road:
- Edit-in-place for existing articles (the backend already supports `PUT`)
- Basic Markdown formatting in the content field
- Cover images per article
- Tag-based filtering on the public page
