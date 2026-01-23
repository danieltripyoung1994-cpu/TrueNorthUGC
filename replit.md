# TrueNorthUGC

## Overview

TrueNorthUGC is a Canadian UGC (User-Generated Content) creator marketplace platform that connects content creators with brands. The platform allows creators to build profiles showcasing their work, while brands can discover and connect with creators for collaboration opportunities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and UI animations
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Pattern**: RESTful API with typed routes defined in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation
- **Build**: esbuild for production bundling with selective dependency bundling

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema integration
- **Schema Location**: `shared/schema.ts` for shared types, `shared/models/auth.ts` for auth tables
- **Migrations**: Drizzle Kit with `db:push` command

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`
- **Implementation**: Passport.js with custom OIDC strategy in `server/replit_integrations/auth/`

### Key Data Models
- **Users**: Core user accounts (managed by Replit Auth)
- **Creators**: Content creator profiles with portfolio, social links, and niches
- **Brands**: Brand profiles with industry information and preferences

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (shadcn/ui)
    hooks/        # Custom React hooks
    pages/        # Route pages
    lib/          # Utilities and query client
server/           # Express backend
  replit_integrations/  # Replit Auth integration
shared/           # Shared types and schemas
  routes.ts       # API route definitions with Zod validation
  schema.ts       # Drizzle database schema
```

## External Dependencies

### Database
- PostgreSQL (connection via `DATABASE_URL` environment variable)

### Authentication
- Replit Auth OIDC provider (`ISSUER_URL`, `REPL_ID`, `SESSION_SECRET` environment variables)

### Frontend Libraries
- Radix UI primitives (dialogs, dropdowns, forms, etc.)
- Lucide React icons
- class-variance-authority for component variants
- tailwind-merge for class merging

### Build & Development
- Vite for frontend development and building
- esbuild for backend production bundling
- Replit-specific Vite plugins for development experience