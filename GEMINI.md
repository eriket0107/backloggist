# Backloggist Backend

A NestJS-based backend for managing personal backlogs of entertainment items such as games, books, movies, series, and courses.

## Project Overview

- **Framework:** NestJS (Express adapter)
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** JWT-based with cookie storage
- **Documentation:** Swagger UI available at `/api`
- **Validation:** `class-validator` for DTOs and `zod` for general validation
- **Architecture:** Domain-driven module structure with a Repository pattern

## Building and Running

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- PostgreSQL database
- `pnpm` (recommended) or `npm`

### Environment Setup

Copy `.env.example` to `.env` and fill in the required variables:
```bash
cp .env.example .env
```

### Installation

```bash
pnpm install
```

### Database Management

- **Generate Migrations:** `pnpm db-generate`
- **Run Migrations:** `pnpm db-migrate`
- **Seed Database:** `pnpm db-seed`

### Running the Application

- **Development:** `pnpm start:dev`
- **Production Build:** `pnpm build`
- **Start Production:** `pnpm start:prod`

### Testing

- **Unit Tests:** `pnpm test`
- **E2E Tests:** `pnpm test:e2e`
- **Coverage:** `pnpm test:cov`

## Development Conventions

### Repository Pattern

The project uses a Repository pattern to abstract data access. Repositories are injected using tokens (e.g., `'IUsersRepository'`).
- **Drizzle Implementation:** Located in `src/repositories/drizzle-repository/`
- **In-Memory Implementation:** Located in `src/repositories/in-memory/` (used for tests when `NODE_ENV=test`)

### Coding Style

- **Naming:** Follow standard NestJS/TypeScript naming conventions (PascalCase for classes, camelCase for variables/methods).
- **Formatting:** Prettier is used for formatting. Run `pnpm format` to apply.
- **Linting:** ESLint is configured. Run `pnpm lint` to check/fix issues.

### API Documentation

Decorate controllers and DTOs with `@nestjs/swagger` decorators to ensure the `/api` documentation remains up-to-date.

### Validation

Use `ValidationPipe` with `transform: true` and `whitelist: true`. All DTOs should use `class-validator` decorators for input validation.

## Project Structure

- `src/modules/`: Domain-specific modules (auth, users, items, etc.)
- `src/repositories/`: Repository interfaces and implementations
- `db/schema/`: Drizzle schema definitions
- `db/seed/`: Database seed scripts
- `test/`: Unit and E2E tests
- `src/utils/`: Shared utilities (logger, password handler, etc.)
