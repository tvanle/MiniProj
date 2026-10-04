# MiniProj - Room Rental Management

A React Native (Expo) mobile app for managing rental rooms (Quản Lý Nhà Trọ), built as a coursework assignment.

## Features

- Room list rendered with `FlatList` (the RecyclerView equivalent), with room cards and a statistics bar
- Add and edit rooms through a dedicated screen, with input validation (`Validator.ts`)
- Room status shown by color: green for available, red for occupied
- In-memory data storage only: data resets when the app restarts (per the assignment requirement)

## Tech stack

- Expo 52, React Native 0.76, React 18, TypeScript
- React Navigation (native stack)
- Jest with `jest-expo` and Testing Library for tests
- MVC structure: `models/`, `views/` (screens and components), `controllers/`, `utils/`, `navigation/`, `types/` under `mobile/src/`

## Getting started

```bash
cd mobile
npm install
npm start          # Expo dev server
npm run android    # Android emulator
npm run ios        # iOS simulator
npm test           # Jest tests
npm run lint
```

The repo also contains the assignment brief (`01-BaiTap-RecycleView.docx.pdf`).
