# LifeGraph — Sovereign Data Trust Engine

<div align="center">

![LifeGraph Banner](https://img.shields.io/badge/LifeGraph-Sovereign%20Data%20Trust%20Engine-6366f1?style=for-the-badge&logoColor=white)

**Your data. Your graph. Your control.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-6366f1?style=for-the-badge)](https://lifegraph-frontend-5l2i.vercel.app)
[![Backend API](https://img.shields.io/badge/Live%20API-Backend-10b981?style=for-the-badge)](https://lifegraph-backend.vercel.app)
[![GitHub Frontend](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github)](https://github.com/Prasad528260/lifegraph-frontend)
[![GitHub Backend](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github)](https://github.com/Prasad528260/lifegraph-backend)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## The Problem

Every day, institutions — banks, hospitals, universities, employers — request access to your personal data. The current reality is broken:

- You have **no visibility** into what data is being accessed or by whom
- Institutions get **all-or-nothing** access — either everything or nothing
- There is **no trust scoring** — a data-breached institution gets the same access as a compliant one
- Your life data is **scattered** across disconnected silos with no unified view
- You cannot **selectively share** only what's relevant to a specific request

> A hospital asking to verify your insurance shouldn't see your financial income. A bank processing a loan shouldn't access your medical conditions. Yet today, they often do.

---

## The Solution

**LifeGraph** reimagines data sovereignty through three core innovations:

### 1. LifeGraph — Your Data as a Knowledge Graph
Your life data isn't stored as flat records. It's represented as a **living knowledge graph** — nodes and edges that capture who you are and how everything connects. Identity → Education → Finance → Health. Every data point has meaning, context, and relationships.

### 2. Domain Capsules — Organized Data Vaults
Your data is organized into **domain-based capsules** — Identity, Education, Finance, and Health. Each domain is independently manageable. You fill what you want, leave out what you don't.

### 3. Sovereign Data Trust Engine (STE) — Intelligent Access Control
The most critical piece. When an institution requests your data:
- The engine checks their **trust score** (0–100)
- Assigns a **trust tier** (1, 2, or 3)
- Returns only a **filtered subgraph** — the minimum data necessary for that tier
- Logs everything in an **immutable audit trail**

No raw data dumps. No all-or-nothing access. Just precise, trust-based data sharing.

---

## How It Works

```
User fills Capsule Data
         ↓
LifeGraph auto-generates from Capsule
         ↓
Institution requests access (with reason)
         ↓
Trust Engine evaluates institution score
         ↓
Tier assigned → Domains unlocked
         ↓
Filtered Subgraph returned (not raw data)
         ↓
Access logged in audit trail
```

### Trust Tier System

| Trust Score | Tier | Data Access |
|-------------|------|-------------|
| 0 – 40 | Tier 1 | Identity only |
| 41 – 70 | Tier 2 | Identity + Education + Finance |
| 71 – 100 | Tier 3 | All domains (full graph) |
| Flagged ⚠️ | Blocked | Access denied regardless of score |

### Trust Events

Superadmin can trigger events that affect an institution's trust score:

| Event | Score Impact |
|-------|-------------|
| Data Breach | −30 |
| User Complaint | −10 |
| Successful Audit | +10 |
| Compliance Pass | +15 |

Users can also file complaints directly against institutions that accessed their data — automatically reducing that institution's trust score.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  User Dashboard │ Admin Panel │ Superadmin Overview      │
│  LifeGraph Viz  │ Simulator   │ Analytics + Trust Mgmt   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS + httpOnly Cookies
┌────────────────────────▼────────────────────────────────┐
│                    BACKEND (Express)                     │
│                                                          │
│  Auth Layer → Role-based middleware (user/admin/super)   │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Capsule  │ │  Graph   │ │  Trust   │ │  Access   │  │
│  │ Controller│ │Generator │ │  Engine  │ │Controller │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│                                    │                     │
│                         Subgraph Filter                  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    MongoDB Atlas                          │
│  Users │ Capsules │ Graphs │ Institutions │ Logs         │
└─────────────────────────────────────────────────────────┘
```

---

## Features

### For Users
- **LifeGraph Visualization** — Interactive knowledge graph of your life data built with React Flow. Nodes spread radially, color-coded by domain.
- **Domain Capsule** — Fill your Identity, Education (SSC/HSC/Graduation/PG), Finance, and Health data independently.
- **Access Logs** — See exactly which institution accessed your data, what they requested, what was granted, and when.
- **File Complaints** — Directly reduce an institution's trust score if you believe access was misused.

### For Admins (Institution Representatives)
- **Institution Management** — Register and manage institutions you represent.
- **Access Simulator** — Simulate data access requests on behalf of your institution. See exactly what filtered subgraph gets returned based on your trust tier.
- **Audit Trail** — View all access logs for your institutions.

### For Superadmin (System Owner)
- **System Analytics** — Real-time overview of total users, institutions, access requests, and flagged entities.
- **Trust Management** — Trigger trust events (breach, audit, compliance) for any institution.
- **Access Decision Breakdown** — Visual breakdown of granted/partial/denied access decisions.
- **Trust Tier Distribution** — See how institutions are distributed across trust tiers.
- **High Frequency Nodes** — Track which institutions make the most access requests.

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens | Authentication |
| httpOnly Cookies | Secure token storage |
| bcryptjs | Password hashing |
| cookie-parser | Cookie middleware |

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | UI framework and build tool |
| Redux Toolkit | Global state management |
| createAsyncThunk | Async API calls in Redux |
| React Router v6 | Client-side routing |
| @xyflow/react | Knowledge graph visualization |
| Axios | HTTP client with cookie support |
| TailwindCSS | Utility-first styling |

---

## Project Structure

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js       # register, login, logout, me
│   │   ├── capsuleController.js    # capsule CRUD + graph trigger
│   │   ├── graphController.js      # get user graph
│   │   ├── institutionController.js # institution management
│   │   ├── trustController.js      # trust events + complaint
│   │   ├── accessController.js     # CORE: subgraph filtering
│   │   ├── logsController.js       # audit trail
│   │   └── statsController.js      # system analytics
│   ├── models/
│   │   ├── User.js
│   │   ├── Capsule.js
│   │   ├── Graph.js
│   │   ├── Institution.js
│   │   ├── TrustEvent.js
│   │   └── AccessLog.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT verify from cookie
│   │   ├── adminOnly.js            # admin + superadmin guard
│   │   └── superAdminOnly.js       # superadmin only guard
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── capsuleRoutes.js
│   │   ├── graphRoutes.js
│   │   ├── institutionRoutes.js
│   │   ├── trustRoutes.js
│   │   ├── accessRoutes.js
│   │   ├── logsRoutes.js
│   │   └── statsRoutes.js
│   └── utils/
│       ├── graphGenerator.js       # capsule → knowledge graph
│       ├── subgraphFilter.js       # trust tier → filtered graph
│       └── trustEngine.js          # score → tier mapping
└── server.js
```

### Frontend
```
frontend/
└── src/
    ├── app/store.js
    ├── features/
    │   ├── auth/authSlice.js
    │   ├── capsule/capsuleSlice.js
    │   ├── graph/graphSlice.js
    │   ├── institution/institutionSlice.js
    │   ├── trust/trustSlice.js
    │   ├── access/accessSlice.js
    │   ├── logs/logsSlice.js
    │   └── stats/statsSlice.js
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useAdmin.js
    │   └── useGraph.js
    ├── services/api.js             # all API calls centralized
    ├── components/
    │   ├── GraphView.jsx           # React Flow visualization
    │   ├── CapsuleForm.jsx         # tabbed data entry
    │   ├── InstitutionCard.jsx
    │   ├── TrustBadge.jsx
    │   ├── AccessResult.jsx        # subgraph result display
    │   └── LogsTable.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── UserDashboard.jsx
    │   ├── AdminDashboard.jsx
    │   ├── InstitutionsPage.jsx
    │   ├── AccessSimulator.jsx
    │   └── LogsPage.jsx
    └── layouts/MainLayout.jsx
```

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register as user |
| POST | `/auth/register/admin` | Secret key | Register as admin |
| POST | `/auth/register/superadmin` | Secret key | Register as superadmin |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | Protected | Get current user |
| POST | `/auth/logout` | Protected | Logout + clear cookie |

### Capsule & Graph
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/capsule` | User | Get own capsule |
| POST | `/capsule/update` | User | Update capsule + regenerate graph |
| GET | `/graph` | User | Get own knowledge graph |

### Institutions
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/institutions` | Protected | Get institutions (filtered by role) |
| POST | `/institutions/add` | Admin | Register new institution |
| GET | `/institutions/:id` | Protected | Get institution details |

### Trust Engine
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/trust/:id` | Protected | Get trust score + history |
| POST | `/trust/event` | Superadmin | Trigger trust event |
| POST | `/trust/complaint` | User | File complaint against institution |

### Access Control (Core)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/access/request` | Admin | Request user data → returns filtered subgraph |

### Logs & Stats
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/logs` | Admin/Super | Get logs (filtered by role) |
| GET | `/logs/user/:id` | Protected | Get user's access logs |
| GET | `/logs/institution/:id` | Admin | Get institution's logs |
| GET | `/stats` | Superadmin | Get system-wide statistics |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Prasad528260/lifegraph-backend.git
cd lifegraph-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET=your_admin_registration_secret
SUPER_ADMIN_SECRET=your_superadmin_registration_secret
NODE_ENV=development
```

```bash
# Start development server
npm run dev
```

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Prasad528260/lifegraph-frontend.git
cd lifegraph-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

---

## Deployment

Both services are deployed on **Vercel**.

### Backend (Vercel Serverless)
Set the following environment variables in Vercel dashboard:
```
MONGO_URI
JWT_SECRET
ADMIN_SECRET
SUPER_ADMIN_SECRET
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
Set the following environment variable:
```
VITE_API_URL=https://your-backend-url.vercel.app
```

---

## Security Design

- **httpOnly Cookies** — JWT tokens are never accessible to JavaScript. Stored server-side in httpOnly cookies, protecting against XSS attacks.
- **Role-based Access Control** — Three distinct roles with strict middleware enforcement. No privilege escalation possible.
- **Admin Secret Keys** — Admin and superadmin accounts require secret keys known only to the system owner. No self-promotion.
- **Subgraph Filtering** — Institutions never receive raw data. They receive only the minimum filtered subgraph their trust tier permits.
- **Audit Trail** — Every access request is logged immutably — institution, user, requested domains, granted domains, tier at time of request, and timestamp.
- **Flagged Institution Blocking** — Institutions with a data breach event are immediately flagged and all future access requests are denied regardless of score.

---

## Key Design Decisions

**Why graph instead of flat data?**
Real-world data has relationships. A knowledge graph captures not just what data exists but how it connects — making selective sharing and relationship-aware filtering possible.

**Why domain capsules?**
Separating data into domains (Identity, Education, Finance, Health) allows institutions to request only what's relevant to their use case. A hospital needs health data, not income data.

**Why trust tiers instead of binary access?**
Binary access (all or nothing) is the root problem with current data sharing. Tiers create a gradient — institutions earn access depth through trustworthy behavior over time.

**Why httpOnly cookies instead of localStorage?**
Security. httpOnly cookies are inaccessible to JavaScript, eliminating XSS token theft. The server owns the auth token, not the browser.

**Why auto-generate the graph from capsule?**
One action triggers everything. User fills their capsule once — the system automatically builds their entire knowledge graph. Zero manual graph construction required.

---

## Role Credentials (Demo)

To test the live demo, register accounts with the following flow:

1. **User** — Register normally at `/register`
2. **Admin** — Register at `/register`, select "Admin", enter admin secret key
3. **Superadmin** — Register at `/register`, select "Superadmin", enter superadmin secret key

> Contact the repository owner for demo secret keys.

---


---

## Author

**Prasad** — Built from scratch as a portfolio project demonstrating full-stack engineering, system design, and data sovereignty concepts.

- GitHub: [@Prasad528260](https://github.com/Prasad528260)

---



**If this project resonates with you, drop a ⭐ on GitHub.**

*Built with purpose — because your data should work for you, not against you.*
