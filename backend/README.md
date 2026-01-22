# Circlo Backend

Hyperlocal Collaboration Platform - Spring Boot Backend with Event-Driven Architecture

## 🎯 Architecture Overview

```
├── Auth & Security      → JWT, Spring Security, BCrypt
├── User Module          → Profile management
├── Activity Module      → Core business logic + Kafka producer
├── Location Module      → PostGIS proximity search
├── Join Request Module  → Activity approval workflow
├── Group & Chat Module  → WebSocket messaging (STOMP)
└── Event Module         → Kafka consumers for async processing
```

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL 15 + PostGIS
- **Cache**: Redis 7
- **Message Broker**: Apache Kafka 7.5
- **Security**: Spring Security + JWT
- **WebSocket**: STOMP over WebSocket
- **Build Tool**: Maven

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.8+
- Docker & Docker Compose (for PostgreSQL, Redis, Kafka)

## 🚀 Quick Start

### 1. Start Infrastructure Services

```bash
cd backend
docker-compose up -d
```

This starts:

- PostgreSQL with PostGIS on port `5432`
- Redis on port `6379`
- Kafka + Zookeeper on port `9092`

### 2. Build the Application

```bash
mvn clean install
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

## 📚 API Documentation

### Authentication Endpoints

#### Register

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "bio": "Love exploring my neighborhood!",
  "interests": ["Shopping", "Dining", "Sports"]
}
```

#### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "bio": "Love exploring my neighborhood!",
    "interests": ["Shopping", "Dining", "Sports"],
    "isOnline": true,
    "role": "USER"
  }
}
```

#### Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout

```bash
POST /api/v1/auth/logout
Authorization: Bearer {accessToken}
```

### User Endpoints

#### Get Current User

```bash
GET /api/v1/users/me
Authorization: Bearer {accessToken}
```

#### Update Profile

```bash
PUT /api/v1/users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "New bio",
  "interests": ["Shopping", "Dining"]
}
```

### Activity Endpoints

#### Create Activity

```bash
POST /api/v1/activities
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Morning Coffee at Starbucks",
  "description": "Join me for a casual coffee!",
  "type": "CAFE",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "scheduledDate": "2026-01-05T09:00:00",
  "maxMembers": 4
}
```

#### Get Nearby Activities

```bash
GET /api/v1/activities/nearby?latitude=40.7128&longitude=-74.0060&type=CAFE
Authorization: Bearer {accessToken}
```

#### Get Activity by ID

```bash
GET /api/v1/activities/{activityId}
Authorization: Bearer {accessToken}
```

#### Get My Activities

```bash
GET /api/v1/activities/my
Authorization: Bearer {accessToken}
```

#### Close Activity

```bash
POST /api/v1/activities/{activityId}/close
Authorization: Bearer {accessToken}
```

## 🎪 Kafka Topics

The application uses the following Kafka topics for event-driven architecture:

- `activity.created` - Published when a new activity is created
- `activity.closed` - Published when an activity is closed
- `join.requested` - Published when someone requests to join
- `join.accepted` - Published when a join request is accepted
- `join.rejected` - Published when a join request is rejected
- `notification.dispatch` - For sending notifications

## 🔐 Security

### JWT Configuration

- **Access Token**: 15 minutes (short-lived)
- **Refresh Token**: 7 days (long-lived)
- **Algorithm**: HS256
- **Secret**: Configurable via environment variable `JWT_SECRET`

### Protected Endpoints

All endpoints except the following require JWT authentication:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /actuator/health`

### Authorization Rules

| Action          | Rule                  |
| --------------- | --------------------- |
| Create activity | Authenticated user    |
| Join request    | Authenticated user    |
| Accept join     | Owner only            |
| Close activity  | Owner only            |
| Chat access     | Accepted members only |

## 📦 Module Structure

```
com.circlo
├── auth/
│   ├── config/        → JwtTokenUtil, SecurityConfig
│   ├── controller/    → AuthController
│   ├── dto/           → SignupRequest, LoginRequest, AuthResponse
│   ├── entity/        → User, RefreshToken, UserRole
│   ├── repository/    → UserRepository, RefreshTokenRepository
│   ├── security/      → JwtAuthenticationFilter, CustomUserDetailsService
│   └── service/       → AuthService
├── user/
│   ├── controller/    → UserController
│   ├── dto/           → UpdateProfileRequest
│   └── service/       → UserService
├── activity/
│   ├── controller/    → ActivityController
│   ├── dto/           → CreateActivityRequest, ActivityDTO
│   ├── entity/        → Activity, ActivityType, ActivityStatus
│   ├── repository/    → ActivityRepository (with PostGIS queries)
│   └── service/       → ActivityService (with Kafka producer)
├── event/
│   ├── config/        → KafkaTopics
│   └── dto/           → ActivityCreatedEvent, ActivityClosedEvent
└── common/
    ├── entity/        → BaseEntity
    └── exception/     → GlobalExceptionHandler, ErrorResponse
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio VARCHAR(500),
    profile_image_url VARCHAR(255),
    location GEOMETRY(Point, 4326),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_location ON users USING GIST(location);
```

### Activities Table

```sql
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    owner_id BIGINT NOT NULL REFERENCES users(id),
    current_members INTEGER NOT NULL DEFAULT 1,
    max_members INTEGER NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    closed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT
);

CREATE INDEX idx_activity_type ON activities(type);
CREATE INDEX idx_activity_status ON activities(status);
CREATE INDEX idx_activity_location ON activities USING GIST(location);
CREATE INDEX idx_activity_date ON activities(scheduled_date);
```

## 🧪 Testing

### Check Health

```bash
curl http://localhost:8080/actuator/health
```

### Test Full Flow

1. **Signup**

```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@circlo.com",
    "password": "test123",
    "bio": "Testing the app",
    "interests": ["Shopping", "Dining"]
  }'
```

2. **Login**

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@circlo.com",
    "password": "test123"
  }'
```

3. **Create Activity** (use token from login)

```bash
curl -X POST http://localhost:8080/api/v1/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Coffee at Starbucks",
    "description": "Morning coffee meetup",
    "type": "CAFE",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "scheduledDate": "2026-01-10T09:00:00",
    "maxMembers": 4
  }'
```

4. **Get Nearby Activities**

```bash
curl -X GET "http://localhost:8080/api/v1/activities/nearby?latitude=40.7128&longitude=-74.0060" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# JWT Secret (must be base64 encoded, minimum 256 bits)
JWT_SECRET=your-very-secure-secret-key-change-this-in-production-minimum-256-bits

# Database
POSTGRES_DB=circlo_db
POSTGRES_USER=circlo_user
POSTGRES_PASSWORD=circlo_pass

# Redis (optional)
REDIS_PASSWORD=

# Server Port
SERVER_PORT=8080
```

### Application Properties

Edit `src/main/resources/application.yml` for:

- JWT expiration times
- Location radius (default: 2km)
- CORS allowed origins
- Logging levels

## 📊 Monitoring

Health check endpoint:

```bash
GET /actuator/health
```

Metrics endpoint:

```bash
GET /actuator/metrics
```

## 🚧 What's Implemented

✅ Auth & Security (JWT, Spring Security, BCrypt)
✅ User Module (Profile management)
✅ Activity Module (CRUD + Kafka events)
✅ Location-based search (PostGIS)
✅ Global exception handling
✅ Docker Compose for infrastructure

## 📝 TODO (Next Steps)

- [ ] Join Request Module (approval workflow)
- [ ] Group & Chat Module (WebSocket STOMP)
- [ ] Kafka Event Consumers (notifications)
- [ ] Redis caching for location
- [ ] File upload for profile images
- [ ] Unit & Integration tests
- [ ] API documentation with Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Pagination for list endpoints

## 🤝 Contributing

This is an MVP for interview and demo purposes. The architecture is designed to be:

- **Scalable**: Can evolve into microservices
- **Interview-ready**: Shows real-world patterns
- **Production-capable**: Security, error handling, logging built-in

## 📄 License

MIT License - Feel free to use for learning and interviews!
