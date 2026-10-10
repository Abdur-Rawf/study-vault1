# Study Vault — Setup Guide

Full-stack version with MySQL-backed login for three roles: **Chairman**, **Teacher**, **Student**.

## 1. Install MySQL
If you don't have it yet: https://dev.mysql.com/downloads/installer/ (Windows) or `sudo apt install mysql-server` (Linux) or `brew install mysql` (Mac).

## 2. Create the database
```bash
mysql -u root -p < backend/schema.sql
```
This creates the `study_vault` database and all tables.

## 3. Configure environment variables
```bash
cd backend
cp .env.example .env
```
Open `.env` and fill in your real MySQL password, a random `JWT_SECRET`, and the Chairman account you want seeded (email/password).

## 4. Install backend dependencies
```bash
npm install
```

## 5. Seed the database
This creates your Chairman account and imports all existing courses/resources as pre-approved:
```bash
npm run seed
```

## 6. Start the backend
```bash
npm start
```
You should see: `Study Vault API running on http://localhost:4000`

## 7. Open the frontend
Just open `frontend/index.html` in your browser (double-click it, or use a simple static server like `npx serve frontend`). It talks to `http://localhost:4000` by default — change `API_BASE` at the top of `frontend/script.js` if your backend runs elsewhere.

## 8. Log in
Use the Chairman email/password you set in `.env`. From there:
- **Chairman** → "👤 Manage Teachers" to create teacher accounts, "🗂️ Course Assignments" to assign teachers to courses.
- **Teacher** → logs in with the account the Chairman created, sees "✅ Pending Approvals" for their assigned courses, and can add/edit/delete resources directly on those courses.
- **Student** → signs up via the "Student Sign Up" tab, browses approved resources, and can submit new ones (they land as pending until a teacher approves them).

## How the roles work
| Action | Chairman | Teacher (assigned course) | Student |
|---|---|---|---|
| Create teacher accounts | ✅ | ❌ | ❌ |
| Assign teacher ↔ course | ✅ | ❌ | ❌ |
| Add resource directly (auto-approved) | ✅ any course | ✅ own courses only | ❌ |
| Approve / reject pending resources | ✅ any course | ✅ own courses only | ❌ |
| Submit a resource (goes to pending) | — | — | ✅ |
| View approved resources | ✅ | ✅ | ✅ |

## Notes
- Passwords are hashed with bcrypt; sessions use JWTs valid for 7 days.
- Student registration is public; Teacher and Chairman accounts are never publicly self-registerable, by design.
- `frontend/` has no build step — it's plain HTML/CSS/JS, so you can host it anywhere (GitHub Pages, Netlify, etc.) as long as it can reach your backend's URL.
