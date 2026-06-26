# API Reference

Base URL: `http://<host>:4000/api`

All routes (except `/auth/login`, `/health`, `/public/*`) require `Authorization: Bearer <jwt>`.

## Auth
| Method | Path | Body | Notes |
|--------|------|------|-------|
| POST | `/auth/login` | `{ email, password }` | Returns `{ token, user }` |
| POST | `/auth/logout` | — | Client-side token discard |
| GET  | `/auth/me` | — | Current user |

## Visitors
| Method | Path | Notes |
|--------|------|-------|
| POST   | `/visitors/create` | RECEPTIONIST, ADMIN |
| GET    | `/visitors/all` | — |
| GET    | `/visitors/:id` | — |
| PUT    | `/visitors/update/:id` | RECEPTIONIST, ADMIN |
| DELETE | `/visitors/delete/:id` | ADMIN |

## Visits
| Method | Path | Notes |
|--------|------|-------|
| POST | `/visits/request` | Create visit + visitor + bookings, send email |
| GET  | `/visits/all` | — |
| GET  | `/visits/pending` | — |
| GET  | `/visits/approved` | — |
| GET  | `/visits/mine` | Current host's visits |
| PUT  | `/visits/approve/:id` | — |
| PUT  | `/visits/reject/:id` | — |
| PUT  | `/visits/hold/:id` | — |
| PUT  | `/visits/check-in/:id` | RECEPTIONIST |
| PUT  | `/visits/check-out/:id` | RECEPTIONIST |

## Resources
| Method | Path | Notes |
|--------|------|-------|
| GET  | `/resources` | List active |
| GET  | `/resources/available?start=ISO&end=ISO` | Availability for window |
| POST | `/resources/reserve` | `{ resourceId, visitId, startTime, endTime }` |

## Calendar
| GET | `/calendar/events?from=&to=` |

## Notifications
| Method | Path |
|--------|------|
| GET  | `/notifications/all` |
| PUT  | `/notifications/:id/read` |
| POST | `/notifications/send` (ADMIN, RECEPTIONIST) |

## Admin
| GET | `/admin/stats` (ADMIN) |
| GET | `/admin/employees` |

## Public (email-link approval)
| GET  | `/public/approval/:token` |
| POST | `/public/approval/:token?decision=approve|reject|hold` |