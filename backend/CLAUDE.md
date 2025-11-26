# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Modufield Backend is a NestJS-based GraphQL API for a sports facility reservation platform. It serves users with disabilities, providing accessible sports and rehabilitation facility information with location-based services and web crawling capabilities.

## Core Technology Stack
- **Framework**: NestJS with GraphQL (Apollo Server)
- **Database**: PostgreSQL with PostGIS extension for geospatial data
- **ORM**: Prisma with TypeScript
- **Caching**: Redis via cache-manager
- **Web Scraping**: Puppeteer for Naver Map crawling
- **Authentication**: JWT with Passport
- **Package Manager**: pnpm

## Development Commands
```bash
# Development
pnpm install                           # Install dependencies  
pnpm start:dev                        # Start dev server with hot-reload
pnpm build                            # Build for production
pnpm start:prod                       # Run production build

# Testing
pnpm test                             # Run unit tests
pnpm test:watch                       # Run tests in watch mode
pnpm test:e2e                         # Run end-to-end tests
pnpm test:cov                         # Run tests with coverage

# Code Quality
pnpm lint                             # Run ESLint with auto-fix
pnpm format                           # Format code with Prettier

# Database (Prisma)
pnpm prisma migrate dev --name <name> # Create and apply new migration
pnpm prisma migrate deploy            # Apply pending migrations (production)
pnpm prisma generate                  # Generate Prisma client
```

## Architecture Overview

### Module Structure
- **AuthModule**: JWT authentication with social providers
- **UsersModule**: User management with accessibility profiles
- **FacilitiesModule**: Sports and rehabilitation facilities
  - **SportsFacilitiesModule**: Public sports facilities with crawling
  - **RehabFacilitiesModule**: Rehabilitation centers
- **PrismaModule**: Database service wrapper
- **CommonModule**: Shared utilities and types

### Key Services
- **NaverMapCrawlingService** (`src/facilities/sports/services/naver-map-crawling.service.ts`): Puppeteer-based web scraping for facility images and amenities
- **SportsFacilitiesDbService**: Database operations for sports facilities
- **SportsFacilitiesApiService**: External API integration for facility data

### Database Models
- **User**: User profiles with location, accessibility status, and sport preferences
- **SportsFacility**: Public sports facilities with geospatial coordinates and crawled data
- **RehabFacility**: Rehabilitation centers and therapeutic facilities
- **SportType/DisabilityType**: Reference data for categorization

### GraphQL Schema
Auto-generated schema at `schema.gql` using code-first approach with decorators.

## Environment Setup
Create `.env` file with:
- `DATABASE_URL`: PostgreSQL connection string
- `KAKAO_MAP_API_KEY`: For location services
- `MONGO_URI`: MongoDB connection (if used)
- `JWT_SECRET`: Authentication secret
- `ANTHROPIC_API_KEY`: Claude API key for essay generation service

## Docker Development
```bash
docker compose up --build    # Full stack with PostgreSQL, Redis
docker compose down -v       # Clean containers and volumes
```

Container startup order:
1. PostgreSQL with PostGIS extensions
2. API container with automated migrations
3. Redis for caching

## Database Migrations
- **Development**: `pnpm prisma migrate dev --name <description>` - creates migration file and applies to local DB
- **Production**: `pnpm prisma migrate deploy` - applies pending migrations safely
- Never modify existing migration files; always create new ones
- Commit generated `prisma/migrations/` files to Git

## Testing Strategy
- Unit tests for services and resolvers
- E2E tests for GraphQL endpoints
- Mock external APIs and database in tests
- Coverage reports generated in `coverage/` directory

## Web Crawling (Naver Maps)
The system crawls Naver Maps for facility images, street views, and amenities using Puppeteer. Located in `NaverMapCrawlingService`, it:
- Searches facilities by name and coordinates
- Extracts images and amenity lists from search results
- Updates database with crawled data
- Limited to 1000 facilities per run for performance

## Development Notes
- Use absolute imports from `src/` directory
- Follow NestJS module pattern with clear separation of concerns
- GraphQL resolvers should be thin, business logic in services
- Geospatial queries use PostGIS functions for location-based searches
- Caching implemented for frequently accessed facility data