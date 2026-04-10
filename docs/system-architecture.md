# System Architecture — Movie Ticket App

## Overview
React Native (Expo) mobile app for movie ticket booking with Firebase backend.

## Tech Stack
- **Frontend**: React Native + Expo SDK 52, TypeScript
- **Backend**: Firebase (Auth, Cloud Firestore)
- **Notifications**: expo-notifications + Firebase
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)

## Architecture Pattern
Service-based architecture: screens call services, services interact with Firebase.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Screens    │ ──→ │   Services   │ ──→ │   Firebase   │
│  (UI Layer)  │     │ (Logic Layer)│     │  (Data Layer)│
└──────────────┘     └──────────────┘     └──────────────┘
```

## Firebase Collections

| Collection  | Purpose            | Key Fields                                    |
|-------------|--------------------|-------------------------------------------------|
| users       | User profiles      | uid, email, displayName, createdAt              |
| movies      | Movie catalog      | id, title, genre, duration, rating, poster, description |
| theaters    | Theater info       | id, name, location, totalSeats                  |
| showtimes   | Show schedules     | id, movieId, theaterId, dateTime, price, availableSeats |
| tickets     | Booked tickets     | id, userId, movieId, showtimeId, seatCount, totalPrice |

## Navigation Flow

```
Auth State Listener
├── Not Authenticated
│   ├── LoginScreen
│   └── RegisterScreen
└── Authenticated
    ├── MainTabs (Bottom Tab Navigator)
    │   ├── Movies Tab → MovieListScreen
    │   ├── My Tickets Tab → MyTicketsScreen
    │   └── Profile Tab → ProfileScreen
    ├── MovieDetailScreen (Stack)
    └── BookTicketScreen (Stack)
```

## Key Design Decisions
1. **Auto-seeding**: Movies/theaters/showtimes seeded on first load if Firestore empty
2. **Auth-gated navigation**: Stack navigator conditionally renders auth vs main screens
3. **Push notifications**: Scheduled locally 30 min before showtime using expo-notifications
4. **Dark theme**: Consistent dark color palette (#1a1a2e, #16213e, #0f3460, #e94560)
