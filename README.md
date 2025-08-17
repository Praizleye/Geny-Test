# Geny-Test
link- https://github.com/Praizleye/Geny-Test

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

## Assumptions & decisions
- Authentication uses stateless JWT (HS256) with roles: provider, admin.
- A dev-only /auth/login endpoint issues tokens for local testing. In production this would be replaced by a real user service.
- Role enforcement is via a RolesGuard layered after the JWT guard so req.user is available.
- Postgres and Redis are provided via Docker Compose for local dev. Defaults expose Postgres on 5433 to avoid local conflicts; adjust in .env if needed.
- Drizzle ORM is used with migrations committed under apps/booking-service/migrations. Drizzle Kit is configured with dialect: postgresql.
- BullMQ requires ioredis options (maxRetriesPerRequest: null, enableReadyCheck: false) per v5 guidance.
- Nx monorepo to manage multiple apps (service, worker) with shared tooling.

## Setup instructions
- Prerequisites
  - Node.js 18+
  - pnpm
  - Docker Desktop
- Configure environment
  - Copy or edit .env at repo root. Key vars:
    - PORT=3000
    - DATABASE_URL=postgres://postgres:postgres@localhost:5433/bookings
    - REDIS_URL=redis://localhost:6379
    - JWT_SECRET=dev_secret
- Install dependencies
  - pnpm install
- Start infra (Postgres + Redis)
  - pnpm run infra:up
  - If port 5433 is busy, change POSTGRES_PORT and DATABASE_URL in .env, then re-run infra:up.
- Apply database migrations
  - pnpm run migrate (or pnpm run migrate:run)

## How to run locally & test
- Start services
  - API: nx run booking-service:serve
  - Worker: nx run booking-worker:serve
  - Health checks: GET http://localhost:3000/health and /health/ready
- Get a JWT for testing
  - POST http://localhost:3000/auth/login
  - Body: { "sub": "provider-123", "roles": ["provider"] }
  - Response includes access_token. Use header: Authorization: Bearer <access_token>
- Test protected endpoints
  - Create booking (provider/admin): POST http://localhost:3000/bookings
    - Body: { "title": "Consult", "startTime": "2025-08-17T10:00:00Z", "endTime": "2025-08-17T11:00:00Z" }
  - List upcoming: GET http://localhost:3000/bookings/upcoming/list
  - List past: GET http://localhost:3000/bookings/past/list
  - Get by id: GET http://localhost:3000/bookings/:id
- WebSocket events
  - Channels: booking.created, booking.reminder (Socket.IO). The worker publishes booking.reminder ~10 min before startTime.
- Troubleshooting auth
  - If you get 403, ensure Authorization: Bearer <token> is present, not expired, roles include provider or admin, and JWT_SECRET matches .env.

## What you’d improve with +4 hours
- Replace dev login with a proper auth/user service (signup/login, refresh tokens, password hashing, RBAC management).
- API docs and DX: add OpenAPI/Swagger, request/response schemas, and a Postman collection.
- Testing: add e2e tests (Supertest) and integration tests against a test DB; CI workflow (GitHub Actions) to lint, test, build, and run migrations.
- Containerization: Dockerfiles for service/worker and a compose profile for prod-like runs; health dependency ordering and readiness probes.
- Observability: structured logging, request IDs, metrics dashboards, and tracing.
- Data layer: seed scripts, stricter constraints/indexes, and better date/time handling (time zones, validation).
- Queues: retry/backoff policies, idempotency keys, and alerting on failures.
- Security & config: rate limiting, CORS hardening, secret management (env var validation, Vault/1Password), and CSRF for non-API flows.
