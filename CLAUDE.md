# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native (Expo) + Express + PostgreSQL monorepo for a mobile app with backend API.

## Commands

### Database
```bash
docker-compose up -d                    # Start PostgreSQL
cd backend && npm run db:migrate        # Run migrations
```

### Backend (Express)
```bash
cd backend
npm run dev                             # Dev server with hot reload (tsx watch)
npm run build                           # Compile TypeScript
npm run start                           # Run compiled output
npm test                                # Run Jest tests
npm run lint                            # ESLint
```

### Mobile (Expo)
```bash
cd mobile
npm start                               # Start Expo dev server
npm run android                         # Android emulator
npm run ios                             # iOS simulator
npm test                                # Run Jest tests
npm run lint                            # ESLint
```

## Architecture

### Backend (`/backend`)
MVC pattern with TypeScript ESM modules:
- **Routes** (`src/routes/`) - HTTP endpoints, mounted at `/api`
- **Controllers** (`src/controllers/`) - Request handling, validation
- **Models** (`src/models/`) - Database queries using raw SQL via `pg`
- **Middleware** (`src/middleware/`) - Error handling, Zod validation

Database helper: `src/config/database.ts` exports `query()` and `getClient()`.

API response format: `{ success: boolean, data?: T, error?: string }`

### Mobile (`/mobile`)
Expo SDK 52 with React Navigation v7:
- **Screens** (`src/screens/`) - Screen components
- **Navigation** (`src/navigation/`) - Stack navigator (RootNavigator)
- **Services** (`src/services/api.ts`) - Axios client calling backend `/api/*`
- **Hooks** (`src/hooks/`) - Data fetching hooks wrapping services
- **Types** (`src/types/`) - Shared TypeScript interfaces

Navigation params: `RootStackParamList` in `src/types/index.ts`

API base URL: `EXPO_PUBLIC_API_URL` env var (defaults to `http://localhost:3000/api`)

### Shared Patterns
- Both apps define `User` and `ApiResponse<T>` types independently (backend uses `Date`, mobile uses `string` for `createdAt`)
- Backend uses `.js` extensions in imports for ESM compatibility
- Zustand available for state management (mobile) but not currently used
