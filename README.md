# 🌍 Circlo - Hyperlocal Collaboration Platform

## 📋 Project Overview

**Circlo** is a mobile application that connects people for everyday activities like shopping, dining, sports, and casual meetups. Unlike traditional social networking apps, Circlo focuses on real-world, hyperlocal collaboration within a 2km radius.

### 🎯 Core Value Proposition

"Never do everyday things alone again. Connect with people nearby for activities you enjoy."

---

## 🚀 Features

### MVP Features (Implemented in Frontend)

#### 1. **Authentication & User Management**

- Email/password authentication
- Social login placeholders (Google, Facebook)
- Profile setup with bio and interests
- Profile image upload
- Interest selection from 8 categories

#### 2. **Activity Discovery**

- **Map View**: Visualize nearby activities on an interactive map
- **List View**: Scrollable feed of nearby activities
- **Activity Filters**: Filter by activity type (shopping, dining, sports, etc.)
- **Real-time Location**: 2km radius search based on user location
- **Activity Cards**: Rich preview with owner info, time, members, distance

#### 3. **Activity Creation**

- Simple creation flow
- Activity type selection
- Date & time picker
- Description (200 characters max)
- Max members limit (2-20)
- Auto-location capture

#### 4. **Join Request System**

- Users send join requests to activity owners
- Owner can view pending requests with user profiles
- Accept/reject functionality
- View request sender's profile and bio
- Request status tracking (pending, accepted, rejected)

#### 5. **Group Chat**

- Real-time messaging using WebSockets
- Group chat for accepted members
- Message history
- Own vs. others message distinction
- Timestamp display
- Auto-scroll to latest message

#### 6. **User Profiles**

- View other users' profiles
- Display bio, interests, stats
- Activity count and rating display
- Report user functionality

#### 7. **My Activities**

- **Created Tab**: Activities you've organized
- **Joined Tab**: Activities you're participating in
- Quick navigation to activity details

#### 8. **Onboarding**

- Beautiful splash screen with gradient
- 3-slide landing page
- Feature highlights
- Smooth animations

---

## 🎨 Design System

### Color Palette

- **Primary**: `#5B64E3` (Indigo Blue)
- **Accent**: `#FF7B7B` (Coral)
- **Background**: `#F8F9FA` (Off-white)
- **Text**: `#2D3436` (Dark Gray)

### Typography

- **Font Family**: Poppins
- **Sizes**: 12px - 36px
- **Weights**: Regular, Medium, SemiBold, Bold

### Activity Type Colors

Each activity type has a unique color for easy identification:

- Shopping: Red-pink
- Dining: Turquoise
- Sports: Mint
- Walking: Coral
- Movies: Purple
- Café: Light pink
- Fitness: Sky blue
- Other: Gray

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete specifications.

---

## 🏗️ Technical Architecture

### Frontend: React Native + Expo

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ActivityCard.js
│   │   ├── MessageBubble.js
│   │   ├── FilterChip.js
│   │   ├── Button.js
│   │   ├── UserCard.js
│   │   ├── EmptyState.js
│   │   ├── ErrorState.js
│   │   └── SkeletonLoader.js
│   ├── config/
│   │   └── constants.js    # App configuration
│   ├── context/
│   │   ├── AuthContext.js  # Authentication state
│   │   └── LocationContext.js # Location services
│   ├── screens/
│   │   ├── onboarding/     # Splash, Landing
│   │   ├── auth/           # Login, Signup
│   │   ├── home/           # Map & Activity Feed
│   │   ├── activity/       # Create, Details, Requests
│   │   ├── chat/           # Group Chat
│   │   └── profile/        # User Profiles
│   ├── services/
│   │   ├── api.js          # REST API client
│   │   └── websocket.js    # WebSocket service
│   └── navigation/
│       └── AppNavigator.js # Navigation setup
```

### Backend: Spring Boot (Architecture Defined)

```
backend/
├── src/main/java/com/circlo/
│   ├── config/              # Security, WebSocket, CORS
│   ├── controller/          # REST endpoints
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # JPA entities
│   ├── repository/          # Data access layer
│   ├── service/             # Business logic
│   ├── security/            # JWT, Auth filters
│   └── websocket/           # WebSocket handlers
```

### Database Schema

#### Core Tables

- **USERS**: User accounts and profiles
- **USER_LOCATIONS**: Real-time user locations
- **ACTIVITY_REQUESTS**: Activity posts
- **JOIN_REQUESTS**: Join request tracking
- **GROUPS**: Chat groups for activities
- **MESSAGES**: Chat messages
- **USER_RATINGS** (Future): User feedback system

### Technology Stack

#### Frontend

- React Native 0.73
- Expo SDK 50
- React Navigation 6
- Socket.IO Client
- React Native Maps
- Axios
- AsyncStorage
- Date-fns

#### Backend (Planned)

- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL + PostGIS
- WebSocket (STOMP)
- Hibernate Spatial

#### Infrastructure

- PostgreSQL database
- Redis (for caching and presence)
- File storage for images
- WebSocket server

---

## 📱 Screen Flow

### Unauthenticated Flow

```
Splash → Landing → Login/Signup → Profile Setup → Home
```

### Authenticated Flow

```
Home (Map/List)
├── Create Activity → Activity Created → Manage Requests
├── View Activity → Request to Join → Pending/Accepted
├── My Activities → Activity Details → Group Chat
└── Profile → Edit Settings
```

### Activity Lifecycle

```
1. User creates activity
2. Other users discover via map/list
3. Users send join requests
4. Owner reviews profiles
5. Owner accepts/rejects requests
6. Group chat activates for accepted members
7. Members coordinate in chat
8. Activity happens
```

---

## 🔒 Security Features

### Authentication

- JWT-based auth tokens
- Secure password hashing
- Refresh token mechanism
- Session management

### Authorization

- Role-based access control
- Owner-only activity modifications
- Member-only chat access
- Request validation

### Privacy

- No phone number sharing
- Approximate location (not exact)
- Profile visibility controls
- Report user functionality
- Chat auto-expiry after event

### Data Protection

- HTTPS only communication
- Encrypted WebSocket connections
- Secure file uploads
- Input validation
- SQL injection prevention

---

## 🎯 User Personas

### 1. **The Social Shopper - Emma, 28**

"I hate grocery shopping alone. It's more fun with company!"

- Uses Circlo to find shopping buddies
- Enjoys casual conversations
- Values safety and trust

### 2. **The Fitness Enthusiast - Jake, 32**

"Finding workout partners is hard. Circlo makes it easy."

- Creates morning run activities
- Connects with like-minded people
- Appreciates approval system

### 3. **The Foodie - Maya, 25**

"I love trying new restaurants but my friends are always busy."

- Discovers dining activities
- Explores new cuisines
- Values authentic connections

### 4. **The New in Town - Alex, 30**

"I just moved here and don't know anyone."

- Uses Circlo to make local friends
- Joins various activity types
- Appreciates nearby radius

---

## 📊 Key Metrics (Planned)

### User Engagement

- Daily Active Users (DAU)
- Activities created per day
- Join request conversion rate
- Chat messages sent
- Average session duration

### Growth

- New user signups
- Retention rate (D1, D7, D30)
- Viral coefficient
- Geographic spread

### Quality

- User rating average
- Report rate
- Activity completion rate
- Response time to join requests

---

## 🚧 Future Enhancements

### Phase 2

- [ ] In-app notifications (push)
- [ ] Activity ratings and reviews
- [ ] User reputation system
- [ ] Block/report improvements
- [ ] Activity categories expansion

### Phase 3

- [ ] AI-powered activity suggestions
- [ ] Smart matching algorithm
- [ ] Recurring activities
- [ ] Activity templates
- [ ] Payment splitting integration

### Phase 4

- [ ] Public events and meetups
- [ ] Brand partnerships
- [ ] Sponsored activities
- [ ] Premium features
- [ ] Advanced analytics

### Nice to Have

- [ ] Voice messages in chat
- [ ] Photo sharing in activities
- [ ] Activity check-ins
- [ ] Gamification (badges, streaks)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Accessibility improvements

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+
- Expo CLI
- Java 17 (for backend)
- PostgreSQL 14+
- Redis (optional)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup (When implemented)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Database Setup

```sql
CREATE DATABASE circlo_db;
CREATE EXTENSION postgis;
```

---

## 📄 Documentation Files

1. **README.md** - Project overview (this file)
2. **frontend/README.md** - Frontend setup and structure
3. **DESIGN_SYSTEM.md** - Complete design specifications
4. **API_DOCUMENTATION.md** (Future) - API endpoints
5. **DATABASE_SCHEMA.md** (Future) - Database design

---

## 🤝 Contributing

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Create feature branches

### Pull Request Process

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📝 License

MIT License - see LICENSE file

---

## 👥 Team & Contact

**Project**: Circlo  
**Version**: 1.0.0  
**Status**: Frontend Complete, Backend Pending  
**Last Updated**: January 2026

---

## 🎉 Acknowledgments

- Design inspiration from modern social and collaboration apps
- React Native community for excellent libraries
- Expo team for amazing developer experience
- Material Icons for comprehensive icon set

---

**Built with ❤️ for connecting people in meaningful, everyday moments.**
