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
- **Theme**: Dark mode default with creator-style aesthetics (TikTok/Instagram-inspired)
  - Primary accent colors: Pink (#ff0080), Purple (#7928ca), Cyan (#00d4ff)
  - Glass morphism effects with backdrop blur
  - Gradient text and button styling
  - Neon glow hover effects
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
- **Creators**: Content creator profiles with portfolio, social links (TikTok, Instagram, YouTube, Twitter, Facebook, Canva), niches, location, languages, and experience level
- **Brands**: Brand profiles with industry information, social links (Instagram, Twitter, LinkedIn, Facebook, Canva), niches, and location
- **Messages**: Creator-brand messaging system with inbox/sent tabs
- **Notifications**: Real-time notification system for messages and interactions

### Payment Model (February 2026)
- **Three-Tier Brand Pricing Structure**:
  - **Starter ($199)**: Basic campaign placement, limited analytics (impressions, clicks, engagement), select creator pool access, email support
  - **Growth ($300)**: Priority campaign placement, enhanced analytics with demographics, expanded creator pool, detailed performance insights, basic support
  - **Premium ($500)**: Featured campaign placement, premium analytics with ROI forecasting, full creator network access, dedicated account manager, co-branded campaigns, early feature access
- **Platform Fee**: 20% platform fee on all creator payments (80% goes to creators, 20% to platform)
- **Flat-Rate Milestone Bonus Program**: In addition to campaign earnings, creators earn cash bonuses when reaching campaign milestones:
  - Rising Star (3-9 campaigns): $100 bonus
  - Creator Pro (10-19 campaigns): $200 bonus
  - Top Performer (20-34 campaigns): $350 bonus
  - Elite Creator (35+ campaigns): $500 bonus
  - Total possible bonuses: $1,150
- **Earnings Dashboard**: New "Earnings" tab in Dashboard showing:
  - Creators: Total earnings, current tier, tier progress with next milestone bonus, transaction history
  - Brands: Total spent, platform fees paid, creators paid, payment history
- **Transaction Tracking**: All payments recorded in `transactions` table with paypalOrderId, amount, platformFee, creatorPayout, and status
- **Hooks**: `useTransactions` hook fetches user transaction data from `/api/transactions`

### Key Features (January 2026)
- **Messaging System**: Full inbox/sent messaging between creators and brands with compose modal
- **Notifications**: Bell icon with unread count badge, dropdown menu with mark as read functionality
- **Enhanced Directory**: Search, filter by niche, location (Canadian provinces), and experience level
- **Profile Customization**: Complete profile editing with profile picture, bio, social links, portfolio videos, and more
- **Code Splitting**: React.lazy for optimized page loading
- **Campaigns System**: Highly customizable campaign creation with tabbed form interface (Basics, Requirements, Advanced). Brands can configure: campaign type (Product Review, Testimonial, Unboxing, Tutorial, Lifestyle, Brand Awareness, Challenge, Giveaway), target platforms (TikTok, Instagram, YouTube, Twitter, Facebook), compensation type (Fixed Payment, Product Gifting, Commission, Hybrid, Negotiable), content style (Professional, Casual, Authentic, Cinematic, Comedic), usage rights duration (30 days to perpetual), exclusivity level, number of creators needed, required hashtags/mentions, experience level preference, product provided status, and brief document URL. Creators can discover active campaigns at /campaigns with full details displayed.
- **PayPal Payments**: Secure PayPal integration with 20% platform fee (80% to creator, 20% to platform). Server-side transaction recording with verified amounts. All payments go to platform's PayPal account. The platform owner manually pays creators their 80% share.
- **Testimonials Section**: Landing page features success stories from creators and brands
- **Featured Campaigns**: Landing page displays active campaigns with empty state handling
- **Reviews System**: Creators and brands can leave reviews and ratings after collaborations
- **Gmail Integration**: Platform email communications via TrueNorthUGCcanada@gmail.com
- **Contact Page**: Contact form at /contact with phone (1-226-220-1522) and email (TrueNorthUGCcanada@gmail.com). Form submissions are emailed to platform owner.

### Performance Optimizations (February 2026)
- **Web Vitals Monitoring**: client/src/lib/performance.ts tracks CLS, LCP, TTFB, INP, and FCP metrics with analytics beacon reporting to /api/analytics/vitals
- **Optimized Font Loading**: Async font loading via media="print" onload pattern with preconnect/dns-prefetch for Google Fonts (Inter and Plus Jakarta Sans)
- **Image Optimization**: All images have explicit width/height to prevent CLS, loading="eager" for above-fold, loading="lazy" for below-fold. OptimizedImage component at client/src/components/ui/optimized-image.tsx provides lazy loading with intersection observer and blur placeholders
- **Code Splitting**: React.lazy for all page components with Suspense fallback
- **Skeleton Loaders**: Contextual loading states showing headers/filters while content loads (client/src/components/ui/skeleton-loaders.tsx)
- **React Query Caching**: Global 5-minute staleTime, 20-minute gcTime. Campaigns use 1-minute staleTime for freshness.
- **QUERY_KEYS Constants**: Centralized query keys in client/src/lib/queryClient.ts for consistent cache invalidation
- **Animation Optimization**: Reduced transitions (0.4s), prefers-reduced-motion support, conditional glow effects
- **Route Prefetching**: Nav links prefetch data on hover for instant navigation
- **Async Script Loading**: Vite module scripts are async by default, non-blocking rendering
- **Responsive Utilities**: Added touch-target (48px min), safe-area-inset, mobile-only/desktop-only, and content-visibility-auto classes

### A/B Testing & User Feedback (February 2026)
- **A/B Testing Framework**: client/src/lib/ab-testing.ts provides experiment management with localStorage persistence
  - defineExperiment(): Create experiments with variants and weights
  - getVariant(): Get assigned variant for user (consistent across sessions)
  - trackEvent(): Track conversion events per experiment
  - Analytics beacon to /api/analytics/experiment
- **Feedback Widget**: client/src/components/FeedbackWidget.tsx - floating feedback button in bottom-right corner
  - Positive/negative rating with optional text feedback
  - Submits to /api/feedback endpoint
  - Success confirmation with auto-close

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