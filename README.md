# Visitor Management System

Full-stack VMS for receptionists, employees, and administrators. Built for any organisation, ready to deploy on AWS or Microsoft Azure.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router + Axios + FullCalendar + Recharts + Socket.IO client + Framer Motion + lucide-react
- **Backend**: Node.js + Express + Prisma + PostgreSQL + JWT + bcrypt + Nodemailer + Socket.IO
- **Deploy**: Docker + Nginx (frontend), Node (backend), Postgres

## Repository layout

```
Visitor-Management-System/
├── backend/      # Express + Prisma API
├── frontend/     # React + Vite SPA
├── docs/         # Deployment & architecture docs
├── docker-compose.yml
└── README.md
```

## Quick start (local, VS Code)

### 1. Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)
- An SMTP account (Microsoft 365 or Gmail with app password)

### 2. Backend
```bash
cd backend
cp .env.example .env        # edit DATABASE_URL, JWT_SECRET, SMTP_*
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev                 # http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:5173
```

### 4. Demo accounts (password: `password123`)
- `admin@vms.local` — Administrator dashboard
- `reception@vms.local` — Receptionist dashboard
- `john@vms.local` — Employee dashboard

## One-command Docker

```bash
cp backend/.env.example backend/.env
docker compose up --build
```
- Frontend → http://localhost:8080
- Backend  → http://localhost:4000
- Postgres → localhost:5432

## Features

- Login with JWT auth, role-aware routing (Admin / Receptionist / Employee)
- Visitor registration with disability accommodation
- Resource booking with real-time conflict detection (Boardroom, Projector, HDMI, Smart TV, Whiteboard, Meeting Room)
- Email-based approval flow (Approve / Reject / Hold from email link)
- Real-time notifications via Socket.IO
- FullCalendar visit schedule
- Admin analytics (Recharts) — employees, visitors, utilization, monthly status
- Check-in / check-out flow

## Deployment

See `docs/DEPLOYMENT.md` for AWS (ECS / EC2 / RDS) and Azure (App Service / Container Apps / Azure Database for PostgreSQL) deployment guides.

## API

See `docs/API.md`.
