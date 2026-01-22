# Circlo API Testing Guide

## Base URL

```
http://localhost:8082/api/v1
```

## Important Notes

- **JWT Secret:** The application uses a Base64-encoded secret key for JWT tokens
- **Server Port:** Application runs on port 8082 (not 8080)
- **Database:** MySQL on localhost:3306 (database: circlo_db, user: springstudent)
- **Kafka:** Currently disabled for MVP testing (to enable: uncomment code and start Docker)

## Authentication Flow

### 1. Register New User (Signup)

**POST** `/auth/signup`

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "bio": "Love outdoor activities and meeting new people"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "john.doe@example.com",
  "name": "John Doe"
}
```

**cURL:**

```bash
curl -X POST http://localhost:8082/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "bio": "Love outdoor activities and meeting new people"
  }'
```

### 2. Login

**POST** `/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "john.doe@example.com",
  "name": "John Doe"
}
```

### 3. Refresh Token

**POST** `/auth/refresh`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Management

### 4. Get Current User Profile

**GET** `/users/me`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "name": "John Doe",
  "bio": "Love outdoor activities and meeting new people",
  "profileImageUrl": null,
  "interests": ["SPORTS", "DINING", "WALKING"],
  "isOnline": true,
  "lastSeen": "2026-01-06T01:30:00"
}
```

### 5. Update Profile

**PUT** `/users/profile`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "name": "John Smith",
  "bio": "Adventure seeker and coffee enthusiast",
  "interests": ["SPORTS", "CAFE", "EVENTS"]
}
```

**Response:**

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "name": "John Smith",
  "bio": "Adventure seeker and coffee enthusiast",
  "interests": ["SPORTS", "CAFE", "EVENTS"]
}
```

---

## Activity Management

### 6. Create Activity

**POST** `/activities`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "title": "Morning Coffee Meetup",
  "description": "Let's grab coffee and chat at Starbucks downtown",
  "type": "CAFE",
  "maxMembers": 4,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "scheduledDate": "2026-01-07T10:00:00"
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Morning Coffee Meetup",
  "description": "Let's grab coffee and chat at Starbucks downtown",
  "type": "CAFE",
  "ownerName": "John Doe",
  "currentMembers": 1,
  "maxMembers": 4,
  "latitude": 37.7749,
  "longitude": -81.4194,
  "scheduledDate": "2026-01-07T10:00:00",
  "status": "OPEN",
  "createdAt": "2026-01-06T01:30:00"
}
```

### 7. Get Nearby Activities

**GET** `/activities/nearby?latitude=37.7749&longitude=-81.4194&radiusKm=5`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Morning Coffee Meetup",
    "description": "Let's grab coffee and chat at Starbucks downtown",
    "type": "CAFE",
    "ownerName": "John Doe",
    "currentMembers": 1,
    "maxMembers": 4,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "scheduledDate": "2026-01-07T10:00:00",
    "status": "OPEN",
    "distance": 0.5
  },
  {
    "id": 2,
    "title": "Basketball Game",
    "description": "Pick-up basketball at the park",
    "type": "SPORTS",
    "ownerName": "Jane Smith",
    "currentMembers": 3,
    "maxMembers": 10,
    "latitude": 37.775,
    "longitude": -122.42,
    "scheduledDate": "2026-01-07T16:00:00",
    "status": "OPEN",
    "distance": 1.2
  }
]
```

### 8. Get Nearby Activities by Type

**GET** `/activities/nearby/type?latitude=37.7749&longitude=-122.4194&radiusKm=5&type=SPORTS`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### 9. Get Activity by ID

**GET** `/activities/1`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### 10. Get My Activities

**GET** `/activities/my`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### 11. Update Activity

**PUT** `/activities/1`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "title": "Updated Coffee Meetup",
  "description": "Changed location to Central Perk",
  "type": "CAFE",
  "maxMembers": 5,
  "scheduledDate": "2026-01-07T11:00:00"
}
```

### 12. Delete Activity

**DELETE** `/activities/1`

**Headers:**

```
Authorization: Bearer {accessToken}
```

---

## Join Request Management

### 13. Create Join Request

**POST** `/join-requests`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "activityId": 1,
  "message": "I'd love to join! I'm new to the area and looking to make friends."
}
```

**Response:**

```json
{
  "id": 1,
  "activityId": 1,
  "activityTitle": "Morning Coffee Meetup",
  "userId": 2,
  "userName": "Jane Smith",
  "message": "I'd love to join! I'm new to the area and looking to make friends.",
  "status": "PENDING",
  "createdAt": "2026-01-06T01:35:00"
}
```

### 14. Get Pending Requests for My Activities

**GET** `/join-requests/my-activities/pending`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
[
  {
    "id": 1,
    "activityId": 1,
    "activityTitle": "Morning Coffee Meetup",
    "userId": 2,
    "userName": "Jane Smith",
    "message": "I'd love to join! I'm new to the area and looking to make friends.",
    "status": "PENDING",
    "createdAt": "2026-01-06T01:35:00"
  }
]
```

### 15. Get My Join Requests

**GET** `/join-requests/my-requests`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### 16. Approve Join Request

**PUT** `/join-requests/1/approve`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "reviewMessage": "Welcome! Looking forward to meeting you!"
}
```

**Response:**

```json
{
  "id": 1,
  "activityId": 1,
  "status": "ACCEPTED",
  "reviewMessage": "Welcome! Looking forward to meeting you!",
  "reviewedAt": "2026-01-06T01:40:00"
}
```

### 17. Reject Join Request

**PUT** `/join-requests/1/reject`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "reviewMessage": "Sorry, this activity is already full."
}
```

---

## Chat Management

### 18. Get Activity Chat Group

**GET** `/chat/activity/1/group`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "id": 1,
  "name": "Morning Coffee Meetup - Chat",
  "activityId": 1,
  "isActive": true,
  "createdAt": "2026-01-06T01:40:00"
}
```

### 19. Get Chat Messages

**GET** `/chat/group/1/messages`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
[
  {
    "id": 1,
    "content": "Hey everyone! Excited for tomorrow!",
    "type": "TEXT",
    "senderName": "Jane Smith",
    "createdAt": "2026-01-06T02:00:00"
  },
  {
    "id": 2,
    "content": "Me too! See you all at 10 AM",
    "type": "TEXT",
    "senderName": "John Doe",
    "createdAt": "2026-01-06T02:05:00"
  }
]
```

### 20. Send Message via WebSocket

**WebSocket Connection:**

```
ws://localhost:8082/ws
```

**Subscribe to topic:**

```
/topic/chat/1
```

**Send message:**

```json
{
  "groupId": 1,
  "content": "Hello everyone!",
  "type": "TEXT"
}
```

**Destination:**

```
/app/chat.send
```

---

## Notifications

### 21. Get My Notifications

**GET** `/notifications`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
[
  {
    "id": 1,
    "type": "JOIN_REQUESTED",
    "title": "New Join Request",
    "message": "Jane Smith wants to join your activity 'Morning Coffee Meetup'",
    "referenceId": 1,
    "isRead": false,
    "createdAt": "2026-01-06T01:35:00"
  },
  {
    "id": 2,
    "type": "JOIN_ACCEPTED",
    "title": "Request Accepted",
    "message": "Your request to join 'Basketball Game' was accepted",
    "referenceId": 2,
    "isRead": false,
    "createdAt": "2026-01-06T01:30:00"
  }
]
```

### 22. Mark Notification as Read

**PUT** `/notifications/1/read`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### 23. Mark All Notifications as Read

**PUT** `/notifications/read-all`

**Headers:**

```
Authorization: Bearer {accessToken}
```

---

## Testing Scenarios

### Scenario 1: Complete User Journey

1. **Register** two users (User A and User B)
2. **User A creates** an activity
3. **User B searches** for nearby activities
4. **User B sends** a join request
5. **User A receives** notification
6. **User A approves** the request
7. **User B receives** acceptance notification
8. **Both users** can now chat in the activity group

### Scenario 2: Activity Management

1. **Create** multiple activities with different types
2. **Search** by location and type
3. **Update** an activity
4. **Fill** an activity (status changes to FULL)
5. **Close** an activity manually
6. **Delete** an activity

### Scenario 3: Chat Testing (WebSocket)

1. **Connect** to WebSocket endpoint
2. **Join** activity chat group
3. **Send** messages
4. **Receive** real-time messages from other users
5. **Disconnect** gracefully

---

## Activity Types

- `SHOPPING` - Shopping trips
- `DINING` - Dining out
- `SPORTS` - Sports activities
- `WALKING` - Walking/hiking
- `CAFE` - Coffee meetups
- `EVENTS` - Events/concerts
- `STUDY` - Study groups
- `OTHER` - Other activities

## Activity Statuses

- `OPEN` - Accepting members
- `FULL` - Maximum members reached
- `CLOSED` - Manually closed
- `CANCELLED` - Cancelled by owner

## Join Request Statuses

- `PENDING` - Awaiting approval
- `ACCEPTED` - Approved by owner
- `REJECTED` - Declined by owner

## Notification Types

- `ACTIVITY_CREATED` - New activity nearby
- `ACTIVITY_CLOSED` - Activity closed
- `JOIN_REQUESTED` - New join request
- `JOIN_ACCEPTED` - Request accepted
- `JOIN_REJECTED` - Request rejected
- `CHAT_MESSAGE` - New chat message
- `SYSTEM` - System notification

---

## Notes

1. **All authenticated endpoints** require `Authorization: Bearer {accessToken}` header
2. **Access tokens** expire after 15 minutes
3. **Refresh tokens** expire after 7 days
4. **Coordinates** use decimal degrees (latitude, longitude)
5. **Dates** use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss`
6. **Server Port**: Application runs on **8082** (not 8080)
7. **Kafka**: Currently **disabled** for MVP testing (async notifications won't work)
8. **Redis**: Optional, not required for basic functionality
9. **Database**: MySQL must be running on localhost:3306

---

## Quick Test Commands (cURL)

### Register (Signup)

```bash
curl -X POST http://localhost:8082/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "bio": "Test bio"
  }'
```

### Login

```bash
curl -X POST http://localhost:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Create Activity

```bash
curl -X POST http://localhost:8082/api/v1/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Activity",
    "description": "Testing",
    "type": "CAFE",
    "maxMembers": 5,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "scheduledDate": "2026-01-07T10:00:00"
  }'
```

### Get Nearby Activities

```bash
curl -X GET "http://localhost:8082/api/v1/activities/nearby?latitude=37.7749&longitude=-122.4194&radiusKm=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
