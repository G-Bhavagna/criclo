# Circlo Frontend - React Native

A hyperlocal collaboration platform built with React Native and Expo.

## Features

- User authentication (Login/Signup)
- Profile setup with interests
- Map-based activity discovery
- Create and join activities
- Real-time group chat with WebSocket
- Join request approval system
- Activity management

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Context API
- **Maps**: React Native Maps
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **UI Components**: Custom components with Poppins font

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ActivityCard.js
│   │   └── MessageBubble.js
│   ├── config/              # Configuration files
│   │   └── constants.js
│   ├── context/             # React Context providers
│   │   ├── AuthContext.js
│   │   └── LocationContext.js
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/             # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── home/           # Home screen
│   │   ├── activity/       # Activity-related screens
│   │   ├── chat/           # Chat screens
│   │   └── profile/        # Profile screens
│   └── services/           # API and WebSocket services
│       ├── api.js
│       └── websocket.js
├── assets/                 # Images, fonts, etc.
├── App.js                 # Root component
├── app.json              # Expo configuration
└── package.json          # Dependencies

```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Download Poppins font family and place in `assets/fonts/`:

   - Poppins-Regular.ttf
   - Poppins-Medium.ttf
   - Poppins-SemiBold.ttf
   - Poppins-Bold.ttf

   You can download Poppins from Google Fonts: https://fonts.google.com/specimen/Poppins

4. Update API configuration in `src/config/constants.js`:

```javascript
export const API_BASE_URL = "http://YOUR_BACKEND_IP:8080/api";
export const WS_BASE_URL = "ws://YOUR_BACKEND_IP:8080/ws";
```

### Running the App

Start Expo development server:

```bash
npm start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Key Features Implementation

### Authentication

- JWT-based authentication
- Secure token storage with AsyncStorage
- Auto-login on app restart

### Location Services

- Real-time location tracking
- Geospatial queries for nearby activities
- Map visualization with custom markers

### Real-time Chat

- WebSocket connection for instant messaging
- Group chat rooms
- Message history
- Typing indicators support

### Activity Management

- Create activities with filters
- Browse nearby activities (2km radius)
- Join request approval workflow
- Activity status tracking

## API Integration

The app communicates with the Spring Boot backend through:

- REST API endpoints for CRUD operations
- WebSocket for real-time chat
- JWT authentication headers

## Configuration

### Environment Variables

Create a `.env` file (optional):

```
API_BASE_URL=http://localhost:8080/api
WS_BASE_URL=ws://localhost:8080/ws
```

### Colors

Customize app colors in `src/config/constants.js`:

```javascript
export const COLORS = {
  primary: "#5B64E3",
  accent: "#FF7B7B",
  // ... more colors
};
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:

```bash
npm start --reset-cache
```

2. **iOS build errors**:

```bash
cd ios && pod install && cd ..
```

3. **Android build errors**:

```bash
cd android && ./gradlew clean && cd ..
```

4. **WebSocket connection issues**:
   - Ensure backend is running
   - Check IP address in constants.js
   - On Android, use your machine's IP, not localhost

## Next Steps

1. Add image upload functionality
2. Implement push notifications
3. Add activity ratings and reviews
4. Implement payment splitting
5. Add social sharing features

## License

MIT
