# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native (Expo) app for Room Rental Management (Quản Lý Nhà Trọ).  
Architecture: **MVC (Model - View - Controller)**  
Data storage: **In-memory Array** (no database)

## Commands

### Mobile (Expo)
```bash
cd mobile
npm start                               # Start Expo dev server
npm run android                         # Android emulator
npm run ios                             # iOS simulator
npm test                                # Run Jest tests
npm run lint                            # ESLint
```

## Architecture (MVC)

### Folder Structure
```
mobile/src/
├── models/          # Model - Dữ liệu (RoomModel.ts)
├── views/           # View - Giao diện
│   ├── screens/     # Màn hình (RoomListScreen, AddEditRoomScreen)
│   └── components/  # Components (RoomCard, StatisticsBar)
├── controllers/     # Controller - Logic nghiệp vụ (RoomController.ts)
├── utils/           # Tiện ích (Validator.ts)
├── navigation/      # Điều hướng (RootNavigator.tsx)
└── types/           # TypeScript types (Room, RoomStatus)
```

### MVC Flow
1. **Model** (`RoomModel.ts`): Quản lý ArrayList phòng, CRUD operations
2. **View** (`views/`): Hiển thị UI, nhận input từ user
3. **Controller** (`RoomController.ts`): Nhận yêu cầu từ View → validate → gọi Model → trả kết quả

### Key Patterns
- Data stored in `ArrayList<Room>` (resets on app restart — per assignment requirement)
- FlatList used as RecyclerView equivalent
- Room status color-coded: 🟢 Green = Available, 🔴 Red = Occupied
- Singleton pattern for Model and Controller instances
