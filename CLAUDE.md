# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native (Expo) app for **Movie Ticket Booking** (Đặt Vé Xem Phim).  
Backend: **Firebase** (Authentication, Cloud Firestore, Push Notifications)  
Architecture: **Service-based** (Services handle Firebase interactions, Screens handle UI)

## Commands

### Mobile (Expo)
```bash
cd mobile
npm start                               # Start Expo dev server
npm run android                         # Android emulator
npm run ios                             # iOS simulator
npm test                                # Run Jest tests
npm test -- --testPathPattern="Foo"     # Run single test file
npm run lint                            # ESLint
npx tsc --noEmit                        # TypeScript check
```

## Architecture

### Folder Structure
```
mobile/src/
├── config/          # Firebase configuration
├── models/          # TypeScript types (Movie, Theater, Showtime, Ticket)
├── services/        # Firebase service layer
│   ├── auth-service.ts          # Login, Register, Logout
│   ├── movie-service.ts         # Movies, Theaters, Showtimes CRUD + seeding
│   ├── ticket-service.ts        # Ticket booking & retrieval
│   └── notification-service.ts  # Push notification scheduling
├── screens/         # UI Screens
│   ├── auth/        # Login, Register
│   ├── movies/      # Movie list, Movie detail
│   ├── booking/     # Book ticket
│   ├── tickets/     # My tickets
│   └── profile/     # User profile
├── components/      # Reusable components (MovieCard)
└── navigation/      # RootNavigator with auth-gated navigation
```

### Firebase Collections
- **users**: User profiles (uid, email, displayName)
- **movies**: Movie catalog (title, genre, duration, rating, poster)
- **theaters**: Theater info (name, location, totalSeats)
- **showtimes**: Show schedules (movieId, theaterId, dateTime, price, availableSeats)
- **tickets**: Booked tickets (userId, movieId, showtimeId, seatCount, totalPrice)

### Key Features
- Firebase Email/Password authentication with auth state listener
- Auto-seeding of movies, theaters, and showtimes on first load
- Ticket booking with seat selection and price calculation
- Push notification reminders 30 minutes before showtime
- Bottom tab navigation: Movies | My Tickets | Profile
- Dark theme UI (colors: #1a1a2e, #16213e, #0f3460, #e94560)
