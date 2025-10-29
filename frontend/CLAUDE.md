# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
pnpm format:check

# Storybook
pnpm storybook
pnpm build-storybook

# Preview production build
pnpm preview
```

## Project Architecture

### Tech Stack
- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Styling**: TailwindCSS 4.1.10
- **State Management**: Jotai 2.12.5 with session storage persistence
- **GraphQL**: Apollo Client 3.13.8 with custom error/HTTP links
- **Testing**: Vitest 3.2.4 + Playwright for Storybook tests
- **Component Development**: Storybook 9.0.13

### Core Application Structure

**Sports Facility Booking Platform** - Modufield is a comprehensive platform for:
- Sports facility reservations with location-based search
- Workout partner matching system (mate finder)
- Community lounge with AI essay writing features
- Real-time chat system
- User registration with accessibility preferences

### Key Directories

- `/src/pages/` - Main application pages organized by feature:
  - `reservation/` - Facility booking, search, reviews
  - `register/` - Multi-step user onboarding flow
  - `mate/` - Partner matching wizard (6 steps)
  - `lounge/` - Community posts and AI essay features
  - `chat/` - Real-time messaging

- `/src/components/` - Reusable components with Storybook integration:
  - `common/` - Shared UI components (Button, Input, Calendar, etc.)
  - Feature-specific components (chat/, lounge/, reservation/)

- `/src/layouts/` - Page layouts for different app sections
- `/src/atoms/` - Jotai state management atoms with session storage
- `/src/apollo/` - GraphQL client setup with error handling
- `/src/utils/` - Utility functions for dates, distances, facility constants

### State Management Pattern
Uses Jotai atoms with session storage persistence:
- `userAtom` - User profile and preferences
- `reservationAtom` - Booking state
- `chatAtom` - Chat room state
- `loungeAtom` - Community post state

### Component Development
All components include Storybook stories for development and testing. Components follow the pattern:
```
component-name/
├── index.tsx
├── stories.tsx
└── hooks/ (if needed)
```

### GraphQL Integration
Apollo Client configured with:
- Custom error link for error handling
- HTTP link with proxy to backend (http://34.64.200.137)
- Queries and mutations organized by feature in `/src/graphql/`

### Route Structure
Nested routing using React Router 7.6.2:
- `/` - Home page
- `/reservation/*` - Facility booking flows
- `/register/*` - Multi-step registration
- `/mate/finder/*` - Partner matching steps
- `/lounge/*` - Community features
- `/chat/*` - Messaging interface

### Build Configuration
- Vite with TypeScript and React plugin
- TailwindCSS integration
- Path alias `@/` maps to `src/`
- Proxy setup for GraphQL endpoint
- Storybook with Vitest integration for component testing
