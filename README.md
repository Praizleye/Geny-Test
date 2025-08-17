# Geny-Test

A minimal monorepo demonstrating a bookings platform with a NestJS HTTP/WebSocket service, a BullMQ worker, PostgreSQL (via Drizzle ORM), and Redis for pub/sub and job queueing. Managed with Nx workspaces.

## Architecture

```mermaid
flowchart TD
    Client[Client_App] -->|REST API| APIGateway[BookingService HTTP]
    Client -->|WebSocket| WS[BookingService WebSocket Gateway]

    APIGateway -->|Auth + Rate Limit| BookingService
    BookingService -->|SQL Queries| Postgres[(PostgreSQL DB)]
    BookingService -->|Publish Jobs| Redis[(Redis)]
    BookingService -->|gRPC| Internal[Internal Services]

    Worker[Async Workers] -->|Consume Jobs| Redis
    Worker -->|Send Updates| WS
```

- apps/booking-service: NestJS app exposing REST endpoints and a Socket.IO gateway. Persists data to Postgres via Drizzle ORM, publishes events to Redis, and enqueues delayed jobs to BullMQ.
- apps/booking-worker: BullMQ worker that consumes reminder jobs from Redis and publishes real-time updates via Redis pub/sub which the service broadcasts over WebSocket.

## Tech stack
- NestJS, Socket.IO gateway, Guards/Decorators for RBAC
- Drizzle ORM (PostgreSQL)
- BullMQ (Redis)
- Nx workspace, TypeScript

## Prerequisites
- Node.js 18+
- pnpm
- Running PostgreSQL and Redis instances

## Configuration
Environment variables (defaults shown):

- apps/booking-service
  - PORT: 3000
  - DATABASE_URL: postgres://postgres:postgres@localhost:5432/bookings
  - REDIS_URL: redis://localhost:6379
  - JWT_SECRET: dev_secret
- apps/booking-worker
  - REDIS_URL: redis://localhost:6379

Create a .env in each app or export vars in your shell.

## Install

pnpm install

## Database
- Generate migrations: pnpm generate
- Apply migrations (drizzle-kit): pnpm migrate
- Alternatively, run the TypeScript migrator: pnpm migrate:run

## Run (development)
- Booking Service (HTTP + WS): nx run booking-service:serve
- Booking Worker: nx run booking-worker:serve

Or directly:
- pnpm -C apps/booking-service dev
- pnpm -C apps/booking-worker dev

## Build and start (production)
- Build all: pnpm build
- Start service: pnpm -C apps/booking-service start
- Start worker: pnpm -C apps/booking-worker start

## Testing
- Unit tests (service): nx run booking-service:test

## API overview (booking-service)
- POST /bookings (roles: provider, admin) – create booking; enqueues a reminder ~10 minutes before startTime
- GET /bookings/:id (roles: provider, admin) – fetch by id (provider restricted unless admin)
- GET /bookings/upcoming/list (roles: provider, admin)
- GET /bookings/past/list (roles: provider, admin)

Authentication: JWT; roles via Roles decorator and JwtAuthGuard.

## Realtime
- Redis pub/sub channels: booking.created, booking.reminder
- WebSocket events broadcast with the same channel names

## Queues
- Queue: booking-reminders (BullMQ)
  - Jobs scheduled for 10 minutes before startTime

## Notes
- DI tokens for repositories are defined in apps/booking-service/src/bookings/tokens.ts (BOOKINGS_REPO) to avoid circular imports.
- See each app README for details.
