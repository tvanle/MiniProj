# Code Standards — Movie Ticket App

## File Naming
- **kebab-case** for all TypeScript files: `login-screen.tsx`, `auth-service.ts`
- Group by feature: `screens/auth/`, `screens/movies/`, `services/`

## Project Structure
```
mobile/src/
├── config/          # App configuration (Firebase)
├── models/          # TypeScript interfaces and types
├── services/        # Business logic & Firebase interactions
├── screens/         # Screen components (grouped by feature)
├── components/      # Reusable UI components
└── navigation/      # Navigation configuration
```

## Conventions
- Services handle all Firebase calls — screens never call Firebase directly
- TypeScript strict mode — all props and state typed
- Error handling with try/catch in all async operations
- Vietnamese language for user-facing strings
- React functional components with hooks only

## Color Palette
| Color     | Hex       | Usage                |
|-----------|-----------|----------------------|
| Dark BG   | #1a1a2e   | Screen backgrounds   |
| Card BG   | #16213e   | Cards, inputs        |
| Accent BG | #0f3460   | Headers, buttons     |
| Primary   | #e94560   | CTAs, active states  |
| Text      | #fff      | Primary text         |
| Muted     | #aaa      | Secondary text       |
| Gold      | #ffd700   | Ratings              |

## Dependencies
- `firebase` — Auth + Firestore
- `@react-navigation/*` — Navigation
- `expo-notifications` — Push notifications
- `expo-device` — Device detection for notifications
