# StudyGlobe

**A full-stack study abroad preparation platform.** Explore universities across 190+ countries, compare programs, find scholarships, and get AI-powered guidance — all in one place.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Custom CSS Design System |
| Backend | Node.js, Express (serverless on Vercel) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) |
| AI Chat | OpenAI GPT-4 via RAG helper |
| Hosting | Vercel (frontend + serverless API in one deploy) |

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key

### Step 1 — Clone and install

```bash
git clone https://github.com/your-username/studyglobe.git
cd studyglobe

# Install root dependencies (used by the Vercel serverless function)
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies (for local dev server)
cd backend && npm install && cd ..
```

### Step 2 — Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `backend/database/setup.sql`
3. Copy your **Project URL** and **service_role** key from Settings → API

### Step 3 — Environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
FRONTEND_URL=http://localhost:3000
```

Also create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4 — Run

**Option A: Run both together**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 — Backend
cd backend && npm run dev     # http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm start      # http://localhost:3000
```

---

## Deploying to Vercel

This project is configured as a **full-stack monorepo** — the frontend and backend deploy together in a single Vercel project.

### How it works

```
studyglobe/
├── frontend/          ← React app, built to frontend/build/
├── backend/           ← Express controllers, routes, utils
├── api/
│   └── index.js       ← Vercel Serverless Function (wraps Express)
└── vercel.json        ← Tells Vercel: build frontend, route /api/* to serverless
```

`vercel.json` does two things:
1. Builds the React frontend and serves it as a static site
2. Routes all `/api/*` requests to `api/index.js` as a serverless function

### Deploy steps

1. Push this repo to GitHub

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo

3. Vercel will auto-detect the config from `vercel.json`. No framework preset needed — leave it as **Other**.

4. Add **Environment Variables** in the Vercel dashboard:

   | Variable | Value |
   |----------|-------|
   | `SUPABASE_URL` | `https://your-project.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | `your-service-role-key` |
   | `OPENAI_API_KEY` | `sk-...` |
   | `FRONTEND_URL` | `https://your-app.vercel.app` |
   | `REACT_APP_API_URL` | `https://your-app.vercel.app/api` |

5. Click **Deploy**. That's it.

> **Note:** Every `git push` to `main` triggers an automatic redeploy.

---

## Project Structure

```
studyglobe/
├── api/
│   └── index.js              # Vercel serverless entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── styles/
│       │   └── globals.css   # Full design system (CSS variables, tokens)
│       ├── components/
│       │   ├── Navbar.jsx    # Responsive navbar with theme toggle
│       │   ├── ChatBot.jsx   # Floating AI advisor
│       │   ├── ProtectedRoute.js
│       │   └── AdminRoute.jsx
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── Auth.jsx      # Login, Register, ForgotPassword, ResetPassword
│       │   ├── Dashboard.jsx
│       │   ├── Countries.jsx
│       │   ├── Universities.jsx
│       │   ├── UniversityDetails.jsx
│       │   ├── Programs.jsx
│       │   ├── Profile.jsx
│       │   └── Admin.jsx     # AdminDashboard, AdminUsers, AdminAnalytics
│       ├── services/
│       │   └── api.js        # Axios client with JWT interceptor
│       └── App.jsx           # Router, theme provider, layout
│
├── backend/
│   ├── config/supabase.js
│   ├── controllers/          # Business logic
│   ├── middleware/auth.js    # JWT verification via Supabase
│   ├── routes/               # Express route definitions
│   ├── utils/ragHelper.js    # OpenAI + vector context for chat
│   └── database/setup.sql   # Full schema + RLS policies
│
├── .env.example
├── .gitignore
├── package.json              # Root deps for Vercel serverless
├── vercel.json               # Vercel build + routing config
└── README.md
```

---

## Design System

The UI uses a custom CSS design system defined entirely in `frontend/src/styles/globals.css`.

**Color palette:**
- Primary: Deep Forest Green `#1A3D2B`
- Accent: Burnt Sienna `#C4622D`
- Gold: `#B8963E`
- Background: Warm Ivory `#FAFAF7`

**Typography:**
- Display / headings: `Playfair Display` (editorial, authoritative)
- Body: `DM Sans` (clean, highly legible)

**Light + Dark mode** — toggled via `data-theme="dark"` on `<html>`, persisted in `localStorage`.

---

## Functional Requirements

| FR | Feature | Status |
|----|---------|--------|
| FR-01 | Secure Enrollment & Authentication | ✅ |
| FR-02 | User Profile Management | ✅ |
| FR-03 | Country Catalog | ✅ |
| FR-04 | Country-wise Universities | ✅ |
| FR-05 | University Details | ✅ |
| FR-06 | Academic Program Exploration | ✅ |
| FR-07 | Intake Schedule | ✅ |
| FR-08 | Language Requirement Inspection | ✅ |
| FR-09 | Scholarship Eligibility | ✅ |
| FR-10 | Admin Data Management | ✅ |
| FR-11 | Preference-Based Filtering | ✅ |
| FR-12 | Public Marketing Landing Page | ✅ |
| FR-13 | Dark / Light Mode | ✅ |
| FR-14 | AI Chat Advisor | ✅ |

---

## Making Someone an Admin

In Supabase SQL Editor:
```sql
UPDATE user_profiles
SET is_admin = TRUE
WHERE email = 'your@email.com';
```
