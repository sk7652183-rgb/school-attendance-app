# Roll Call — Attendance Frontend

A vanilla HTML/CSS/JS frontend for the School Attendance API. No build step, no framework — open it in a browser and it talks directly to your Express backend.

## Setup

1. Make sure the backend is running (see the main project README) — by default at `http://localhost:5000`.
2. If your backend runs somewhere else, update `API_BASE` at the top of `js/app.js`.
3. Serve this folder with any static server, for example:

```bash
npx serve frontend
# or
python3 -m http.server 8080 --directory frontend
```

Then open the printed URL in your browser. (Opening `index.html` directly via `file://` also works since the backend has CORS enabled, but a static server avoids occasional browser file-access quirks.)

## What's inside

- `index.html` — login screen + four tabs: Take attendance, Classes, Students, Reports
- `css/style.css` — chalkboard-register visual theme
- `js/app.js` — all API calls (`fetch`) and UI logic, no dependencies

## How it works

- **Login** — posts to `/api/auth/login`, stores the JWT and user info in `localStorage`.
- **Take attendance** — pick a class and date, tap `P` / `A` / `L` next to each student, then Save. Reloading the same class/date pre-fills existing marks so you can correct them.
- **Classes / Students** — admins see an "add" form; teachers see the list only (matches the backend's role restrictions).
- **Reports** — daily counts, monthly per-student totals, and a CSV export that downloads via a token-authenticated fetch (since a plain link can't carry an `Authorization` header).

## Notes

- Only admins can create classes, students, or new user accounts — the UI hides those forms for teachers, but the backend also enforces this, so nothing relies on the frontend alone for security.
- Attendance marking is idempotent: saving twice for the same class/date/student updates the record instead of duplicating it, matching the backend's upsert behavior.
