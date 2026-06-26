# Architecture

## High-level flow

```
Receptionist  ─▶  Frontend (React)
                       │ Axios + JWT
                       ▼
                 Backend (Express)  ──▶  Postgres (Prisma)
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
     Nodemailer    Socket.IO     Approval Token URL
     (SMTP)        (realtime)    (signed in DB)
         │             │
         ▼             ▼
     Host inbox    Employee browser
```

## Database relationships

- **User** has many **Visit** (as host)
- **Visitor** has many **Visit**
- **Visit** belongs to **User** + **Visitor**, has many **ResourceBooking**
- **Resource** has many **ResourceBooking**
- **Notification** belongs to **User**

## Email workflow

1. Receptionist submits visit → backend creates `Visit` with unique `approvalToken`.
2. Backend sends email with three signed links: `…/approve/:token?decision=approve|reject|hold`.
3. Employee clicks → frontend `ApprovalPage` loads → calls `POST /public/approval/:token?decision=…`.
4. Status updated → `Notification` created → Socket.IO push to all connected clients (`visit:updated`).
5. Calendar + dashboards reflect change in real time.

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT with `JWT_SECRET` (rotate per environment)
- Helmet, CORS allow-list
- Role-based middleware (`requireRole`)
- Zod request validation
- Approval tokens are random per-visit (CUID), single-purpose, stored server-side