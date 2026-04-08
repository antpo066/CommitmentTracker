# Commitment Tracker

A web app for tracking public promises, predictions, commitments, and claims made by public figures or organizations. Statements are extracted from public content, stored on a timeline, and reviewed by admins who classify them as kept, delayed, contradicted, partially fulfilled, or unresolved.

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### Local Setup

```bash
# 1. Clone the repo
git clone <repo-url> && cd CommitmentTracker

# 2. Create PostgreSQL database
sudo -u postgres psql -c "CREATE USER committracker WITH PASSWORD 'committracker_dev' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE commitment_tracker OWNER committracker;"

# 3. Configure environment
cp server/.env.example server/.env
# Edit server/.env if needed

# 4. Install dependencies, run migrations, seed data
npm run setup

# 5. Start development servers
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Admin login: `admin@commitmenttracker.dev` / `admin123`

## Architecture

**Monorepo** with two packages:

- `server/` — Express + TypeScript + Prisma (REST API)
- `client/` — React + TypeScript + Vite + Tailwind CSS (SPA)

The Vite dev server proxies `/api` requests to the Express backend.

## File Structure

```
CommitmentTracker/
├── package.json              # Root scripts (dev, setup, db commands)
├── README.md
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env / .env.example
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Seed data
│   │   └── migrations/       # Auto-generated migrations
│   └── src/
│       ├── index.ts          # Express app entry point
│       ├── middleware/
│       │   └── auth.ts       # JWT authentication middleware
│       └── routes/
│           ├── auth.ts       # POST /api/auth/login, /register
│           ├── persons.ts    # CRUD /api/persons
│           ├── statements.ts # CRUD /api/statements
│           ├── review.ts     # Admin /api/admin/review
│           └── notes.ts      # Admin /api/admin/notes
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx           # Route definitions
│       ├── index.css         # Tailwind imports
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── utils/
│       │   └── api.ts        # Fetch wrapper with auth
│       ├── components/
│       │   ├── Layout.tsx     # Header + footer
│       │   ├── StatementCard.tsx
│       │   └── StatusBadge.tsx
│       └── pages/
│           ├── HomePage.tsx       # Public timeline with filters
│           ├── PersonPage.tsx     # Public profile page
│           ├── StatementPage.tsx  # Statement detail + notes
│           ├── LoginPage.tsx      # Admin login
│           ├── AdminDashboard.tsx # Admin overview
│           ├── ReviewQueue.tsx    # Approve/reject statements
│           ├── AddStatement.tsx   # Submit new statement
│           └── AddPerson.tsx      # Create tracked person
```

## Database Schema

### Tables

**User** — Admin accounts
| Column | Type | Notes |
|--------|------|-------|
| id | cuid | PK |
| email | string | unique |
| password | string | bcrypt hashed |
| name | string | |
| role | enum | ADMIN, EDITOR |

**Person** — Tracked individuals/organizations
| Column | Type | Notes |
|--------|------|-------|
| id | cuid | PK |
| name | string | |
| slug | string | unique, URL-friendly |
| title | string? | Role/position |
| description | string? | Neutral bio |

**Statement** — Core entity
| Column | Type | Notes |
|--------|------|-------|
| id | cuid | PK |
| personId | FK → Person | |
| exactQuote | string | Verbatim text |
| source | string | Source name |
| sourceUrl | string? | Link to original |
| sourceType | enum | PASTED_TEXT, ARTICLE_URL, YOUTUBE_TRANSCRIPT, TWEET, SPEECH, INTERVIEW, OTHER |
| dateMade | datetime | When statement was made |
| statementType | enum | PROMISE, PREDICTION, COMMITMENT, CLAIM |
| impliedDeadline | datetime? | When it should be fulfilled |
| measurableOutcome | string? | How to verify |
| confidenceScore | int (1-5) | Manual assessment |
| status | enum | UNRESOLVED, KEPT, DELAYED, CONTRADICTED, PARTIALLY_FULFILLED |
| evidenceNote | string? | Admin notes on evidence |
| approved | boolean | Must be approved to show publicly |
| reviewedById | FK → User? | Who reviewed it |
| reviewedAt | datetime? | When reviewed |

**Note** — Context/dispute notes on statements
| Column | Type | Notes |
|--------|------|-------|
| id | cuid | PK |
| statementId | FK → Statement | |
| authorId | FK → User | |
| content | string | |
| noteType | enum | CONTEXT, DISPUTE, EVIDENCE, CORRECTION |

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/persons` | List tracked persons |
| GET | `/api/persons/:slug` | Person profile + approved statements |
| GET | `/api/statements` | List approved statements (filterable) |
| GET | `/api/statements/:id` | Statement detail with notes |

**Query parameters for GET /api/statements:**
- `personId` — filter by person
- `status` — UNRESOLVED, KEPT, DELAYED, CONTRADICTED, PARTIALLY_FULFILLED
- `statementType` — PROMISE, PREDICTION, COMMITMENT, CLAIM
- `from` / `to` — date range
- `page` / `limit` — pagination

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login → JWT token |
| POST | `/api/auth/register` | Register admin user |

### Admin (requires Bearer token)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/persons` | Create person |
| PUT | `/api/persons/:id` | Update person |
| POST | `/api/statements` | Create statement (goes to review queue) |
| PUT | `/api/statements/:id` | Update statement |
| DELETE | `/api/statements/:id` | Delete statement |
| GET | `/api/admin/review` | Get review queue |
| GET | `/api/admin/review/all` | All statements (admin view) |
| POST | `/api/admin/review/:id/approve` | Approve statement |
| POST | `/api/admin/review/:id/reject` | Reject (delete) statement |
| PATCH | `/api/admin/review/:id/status` | Update statement status |
| POST | `/api/admin/notes` | Add note to statement |
| DELETE | `/api/admin/notes/:id` | Delete note |

## Seed Data

The seed script creates:
- **1 admin user** — `admin@commitmenttracker.dev` / `admin123`
- **3 tracked persons** — Jane Mayor, Acme Corp, Senator Smith
- **8 statements** — 6 approved (various statuses), 2 in review queue
- **2 notes** — context and dispute examples

## Design Decisions

- **Manual approval required** — All extracted statements go through a review queue before appearing publicly. This prevents automated errors from being published.
- **Neutral wording** — The UI uses terms like "documented," "unresolved," and "tracked" rather than charged language. Status labels are factual.
- **No automated scoring** — Confidence scores and status classifications are set manually by admins. AI can assist with extraction, but humans decide.
- **Source attribution** — Every statement links back to its source for verifiability.

## Deployment

### Build for production

```bash
# Build the client
cd client && npm run build

# The server can serve the built client from client/dist
# Or deploy them separately
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (change in production!) |
| `PORT` | Server port (default: 3001) |

### Deploy options

- **Simple**: Single server — Express serves the API and the built React app
- **Split**: Deploy API to any Node.js host, deploy client/dist to Vercel/Netlify/Cloudflare Pages
- **Docker**: Add Dockerfile for containerized deployment (not included in MVP)

## 7-Day MVP Build Plan

### Day 1: Foundation
- [x] Initialize monorepo structure
- [x] Set up Express + TypeScript backend
- [x] Design and create Prisma schema
- [x] Set up PostgreSQL, run initial migration
- [x] Create seed data

### Day 2: Core API
- [x] Auth routes (login/register + JWT)
- [x] Person CRUD endpoints
- [x] Statement CRUD with filtering and pagination
- [x] Review queue endpoints (approve/reject)
- [x] Notes endpoints

### Day 3: Frontend Foundation
- [x] Set up React + Vite + Tailwind
- [x] Create Layout, routing, auth context
- [x] Build reusable components (StatusBadge, StatementCard)
- [x] API client utility with auth headers

### Day 4: Public Pages
- [x] Home page with timeline view and filters
- [x] Person profile page with statement list
- [x] Statement detail page with notes
- [x] Pagination

### Day 5: Admin Pages
- [x] Login page
- [x] Admin dashboard with stats
- [x] Review queue (approve/reject)
- [x] Add Statement form
- [x] Add Person form

### Day 6: Polish & Testing
- [ ] Add status update UI on statement detail (admin)
- [ ] Add edit functionality for existing statements
- [ ] End-to-end manual testing
- [ ] Fix responsive layout issues
- [ ] Add loading/error states everywhere

### Day 7: Deploy & Document
- [ ] Production build and test
- [ ] Write deployment guide
- [ ] Add Docker support (optional)
- [ ] Final review of neutral wording
- [ ] Security audit (CORS, rate limiting, input validation)
