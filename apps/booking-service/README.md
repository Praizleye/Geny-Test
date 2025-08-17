# Booking Service

NestJS REST API and WebSocket gateway for managing bookings. Uses Drizzle ORM (PostgreSQL) and BullMQ (Redis) for delayed reminders, plus Redis pub/sub for real-time events.

## Architecture

```mermaid
flowchart TD
    Client[Client_App] -->|REST API| Service[Booking Service]
    Client -->|WebSocket| WS[Socket.IO Gateway]

    Service -->|SQL Queries| Postgres[(PostgreSQL DB)]
    Service -->|Enqueue Jobs| Redis[(Redis)]

    Worker[Booking Worker] -->|Consume Jobs| Redis
    Worker -->|Publish booking.reminder| Redis
    Redis -->|booking.created & booking.reminder| WS
```

## Environment
- PORT (default: 3000)
- DATABASE_URL (default: postgres://postgres:postgres@localhost:5432/bookings)
- REDIS_URL (default: redis://localhost:6379)
- JWT_SECRET (default: dev_secret)

Create an .env or export variables in your shell.

## Install
pnpm install

## Run (dev)
- pnpm -C apps/booking-service dev

## Build / Start (prod)
- pnpm -C apps/booking-service build
- pnpm -C apps/booking-service start

## Database
- Generate migrations: pnpm generate
- Apply migrations: pnpm migrate
- TS migrator: pnpm migrate:run

## API
- POST /bookings (roles: provider, admin)
- GET /bookings/:id (roles: provider, admin)
- GET /bookings/upcoming/list (roles: provider, admin)
- GET /bookings/past/list (roles: provider, admin)

Example (create):

curl -X POST http://localhost:3000/bookings \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Checkup",
    "startTime": "2025-01-01T10:00:00.000Z",
    "endTime": "2025-01-01T10:30:00.000Z"
  }'

Notes:
- Providers can only create for themselves; admins may set providerId.
- On create, the service publishes booking.created to Redis and enqueues a reminder ~10 minutes before startTime.

## Realtime
- Socket.IO endpoint: http://localhost:${PORT}
- Events broadcast: booking.created, booking.reminder

Client example (browser):

<script>
  const s = io('http://localhost:3000');
  s.on('booking.created', console.log);
  s.on('booking.reminder', console.log);
</script>
