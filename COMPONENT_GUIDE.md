# 🎨 Component Showcase - Circlo UI Library

## Navigation Components

### App Navigator

**Location**: `/src/navigation/AppNavigator.js`

**Features**:

- Stack navigation for screens
- Bottom tab navigation for main sections
- Conditional rendering based on auth state
- Smooth transitions between screens

**Tabs**:

1. Home (Map icon)
2. My Activities (Event icon)
3. Profile (Person icon)

---

## Card Components

### 1. Activity Card

**Location**: `/src/components/ActivityCard.js`

**Props**:

- `activity` (object) - Activity data
- `onPress` (function) - Card tap handler

**Features**:

- Owner avatar and name
- Activity time display
- Activity type badge with color
- Title and description (2 lines max)
- Members count (current/max)
- Distance indicator

**Visual Elements**:

- White background with shadow
- 16px border radius
- Color-coded badges
- Responsive layout

---

### 2. User Card

**Location**: `/src/components/UserCard.js`

**Props**:

- `user` (object) - User data
- `onPress` (function) - Card tap handler
- `showBio` (boolean) - Show/hide bio
- `rightAction` (component) - Custom right content

**Features**:

- Circular avatar (50x50)
- User name and bio
- Distance from current user
- Chevron for navigation

---

### 3. Message Bubble

**Location**: `/src/components/MessageBubble.js`

**Props**:

- `message` (object) - Message data
- `isOwn` (boolean) - Own message vs others

**Features**:

- Different colors for own/other messages
- Sender name for other messages
- Timestamp display
- Rounded corners with tail effect
- Word wrap for long messages

**Styling**:

- Own messages: Primary color, right-aligned
- Other messages: White, left-aligned
- Timestamp: Small gray text

---

## Input & Selection Components

### 1. Filter Chip

**Location**: `/src/components/FilterChip.js`

**Props**:

- `label` (string) - Chip text
- `icon` (string) - Material icon name
- `selected` (boolean) - Selection state
- `onPress` (function) - Tap handler
- `color` (string) - Custom color when selected

**Features**:

- Pill-shaped design
- Icon + text layout
- Selected/unselected states
- Custom color support

---

### 2. Button Component

**Location**: `/src/components/Button.js`

**Props**:

- `title` (string) - Button text
- `onPress` (function) - Tap handler
- `variant` (string) - 'primary', 'secondary', 'outline', 'text'
- `size` (string) - 'small', 'medium', 'large'
- `icon` (string) - Material icon name
- `iconPosition` (string) - 'left', 'right'
- `disabled` (boolean) - Disabled state
- `loading` (boolean) - Loading state

**Variants**:

**Primary Button**

- Background: Primary blue
- Text: White
- Use: Main actions

**Secondary Button**

- Background: Accent coral
- Text: White
- Use: Alternative actions

**Outline Button**

- Background: Transparent
- Border: Primary color
- Text: Primary color
- Use: Less emphasis actions

**Text Button**

- No background or border
- Text: Primary color
- Use: Tertiary actions

**Sizes**:

- Small: 8px vertical padding
- Medium: 14px vertical padding (default)
- Large: 18px vertical padding

---

## State Components

### 1. Empty State

**Location**: `/src/components/EmptyState.js`

**Props**:

- `icon` (string) - Material icon name
- `title` (string) - Main message
- `message` (string) - Supporting text
- `actionText` (string) - Button text (optional)
- `onActionPress` (function) - Button handler (optional)
- `illustration` (image) - Custom image (optional)

**Use Cases**:

- No activities found
- No join requests
- Empty chat history
- First-time screens

**Layout**:

- Centered content
- Large icon (80px)
- Title (22px, SemiBold)
- Message (16px, Regular)
- Optional CTA button

---

### 2. Error State

**Location**: `/src/components/ErrorState.js`

**Props**:

- `title` (string) - Error title
- `message` (string) - Error description
- `onRetry` (function) - Retry handler (optional)
- `retryText` (string) - Retry button text

**Features**:

- Error icon (red)
- Clear error message
- Retry button with icon
- Centered layout

**Use Cases**:

- Network errors
- API failures
- Load failures

---

### 3. Skeleton Loader

**Location**: `/src/components/SkeletonLoader.js`

**Components**:

**SkeletonLoader**

- Generic skeleton for any content
- Animated opacity pulse
- Customizable size and shape

**Props**:

- `width` - Element width
- `height` - Element height
- `borderRadius` - Corner radius
- `style` - Additional styles

**ActivityCardSkeleton**

- Pre-built skeleton for activity cards
- Matches ActivityCard layout
- Shows while loading

**Animation**:

- Opacity: 0.3 → 0.7 → 0.3
- Duration: 1000ms loop
- Smooth easing

---

## Screen Components

### 1. Splash Screen

**Location**: `/src/screens/onboarding/SplashScreen.js`

**Features**:

- Full-screen gradient background
- Animated logo (fade + scale)
- App name and tagline
- Auto-navigate to Landing (2s)

**Animations**:

- Fade in: 0 → 1 (1000ms)
- Scale spring: 0.8 → 1

---

### 2. Landing Screen

**Location**: `/src/screens/onboarding/LandingScreen.js`

**Features**:

- 3 swipeable slides
- Skip button (top right)
- Dot pagination
- Next/Get Started button
- Gradient background

**Slides**:

1. "Do Everyday Things, Together"
2. "Find Activities Near You"
3. "Safe & Trusted Community"

**Layout**:

- Image placeholder (70% width)
- Title (28px, Bold)
- Description (16px, Regular)
- Pagination dots
- Large CTA button

---

### 3. Login Screen

**Location**: `/src/screens/auth/LoginScreen.js`

**Fields**:

- Email (email keyboard)
- Password (secure entry)

**Features**:

- Forgot password link
- Social login buttons (Google, Facebook)
- Sign up link
- Form validation
- Loading state

**Layout**:

- Vertical scroll
- Large input fields
- Prominent login button
- Social buttons row
- Footer with signup link

---

### 4. Home Screen

**Location**: `/src/screens/home/HomeScreen.js`

**Features**:

- Map view with markers
- List view toggle
- Activity type filters (horizontal scroll)
- Create activity FAB (+ button)
- Pull to refresh
- Empty state when no activities

**Map Markers**:

- Color-coded by activity type
- Circular design
- Activity type initial letter
- Tap to view details

**List View**:

- Activity cards
- Infinite scroll
- Loading skeletons
- Empty state

---

### 5. Create Activity Screen

**Location**: `/src/screens/activity/CreateActivityScreen.js`

**Form Fields**:

1. **Title** - Text input (60 chars max)
2. **Activity Type** - Chip selection grid
3. **Description** - Multiline text (200 chars max)
4. **Date & Time** - Native pickers
5. **Max Members** - Increment/decrement selector (2-20)

**Features**:

- Real-time validation
- Character counters
- Visual type selection
- Easy member adjustment
- Create/Cancel buttons

---

### 6. Activity Details Screen

**Location**: `/src/screens/activity/ActivityDetailsScreen.js`

**Sections**:

1. **Header** - Type badge, title
2. **Owner** - Avatar, name
3. **Details Card** - Date/time, members, distance
4. **Description** - Full activity description
5. **Members List** - If user is accepted member
6. **Actions** - Context-dependent buttons

**User States**:

- **Owner**: View Requests, Open Chat buttons
- **Member**: Open Chat button
- **Pending**: "Request Pending" indicator
- **New User**: "Request to Join" button

---

### 7. Group Chat Screen

**Location**: `/src/screens/chat/GroupChatScreen.js`

**Features**:

- Real-time WebSocket messages
- Message history loading
- Auto-scroll to latest
- Keyboard-aware layout
- Send button (disabled when empty)

**Message Types**:

- Text messages
- System messages (future)
- Location sharing (future)

**Layout**:

- Messages list (scrollable)
- Input container (sticky bottom)
- Text input (multi-line, max 500 chars)
- Send button

---

## Utility Components

### Date & Time Display

Using `date-fns` for formatting:

- `MMM dd, yyyy • h:mm a` - Full format
- `MMM dd` - Date only
- `h:mm a` - Time only
- `1 hour ago` - Relative time (future)

### Icons

Using Material Icons:

- Consistent size (16px, 20px, 24px)
- Color matches context
- Common icons:
  - `map`, `event`, `person`, `add`, `chat`
  - `star`, `location-on`, `chevron-right`
  - `error-outline`, `refresh`, `flag`

---

## Color-Coded Elements

### Activity Type Badges

```javascript
{
  shopping: '#FF6B6B',    // Red-pink
  dining: '#4ECDC4',      // Turquoise
  sports: '#95E1D3',      // Mint
  walking: '#F38181',     // Coral
  movie: '#AA96DA',       // Purple
  cafe: '#FCBAD3',        // Light pink
  fitness: '#A8D8EA',     // Sky blue
  other: '#95A5A6'        // Gray
}
```

### Status Indicators

- **Success**: Green (#00B894)
- **Warning**: Yellow (#FDCB6E)
- **Error**: Red (#D63031)
- **Info**: Primary blue

---

## Responsive Behavior

### Small Screens (<375px)

- Reduced padding (16px → 12px)
- Smaller font sizes
- Compact layouts

### Large Screens (>768px)

- Max-width constraints
- Centered content
- Larger touch targets

---

## Accessibility Features

### Touch Targets

- Minimum: 44x44 points
- Buttons: 48px+ height
- Chip filters: 40px+ height

### Text Contrast

- Primary text: High contrast (4.5:1+)
- Secondary text: Medium contrast
- Disabled text: Low contrast but clear

### Screen Reader Support

- Semantic labels
- Proper heading hierarchy
- Button roles
- Image alt text

---

## Component Combinations

### Common Patterns

**Card with Action**

```
ActivityCard → onPress → ActivityDetails
UserCard → onPress → UserProfile
```

**Form Flow**

```
TextInput + Validation → Button (disabled until valid) → Submit
```

**List Patterns**

```
FlatList + SkeletonLoader (loading)
FlatList + EmptyState (no data)
FlatList + ErrorState (error)
```

**Filter + List**

```
FilterChips (horizontal scroll)
↓
Filtered Results (FlatList)
```

---

## Animation Timings

### Standard Animations

- **Fast**: 200ms - Quick feedback
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Emphasis

### Special Animations

- **Skeleton pulse**: 1000ms loop
- **Fade in**: 1000ms
- **Scale spring**: Custom physics

---

## Best Practices

### Component Usage

✅ **DO**:

- Use semantic component names
- Pass minimal required props
- Handle loading/error states
- Provide default props
- Add prop validation

❌ **DON'T**:

- Inline complex styles
- Pass entire objects when specific values needed
- Ignore accessibility
- Skip empty/error states

### Styling

✅ **DO**:

- Use constants for colors/sizes
- Follow 8px spacing grid
- Apply consistent border radius
- Use shadow sparingly

❌ **DON'T**:

- Hardcode colors
- Use arbitrary spacing
- Mix different corner radii
- Over-shadow everything

---

## Component Checklist

### Implementation Status

**Core Components** ✅

- [x] ActivityCard
- [x] MessageBubble
- [x] UserCard
- [x] FilterChip
- [x] Button
- [x] EmptyState
- [x] ErrorState
- [x] SkeletonLoader

**Future Components** 🔄

- [ ] Modal/Dialog
- [ ] Toast/Snackbar
- [ ] Image Picker
- [ ] Search Bar
- [ ] Dropdown
- [ ] Switch/Toggle
- [ ] Radio Button
- [ ] Checkbox
- [ ] Badge with Count
- [ ] Avatar Group
- [ ] Progress Bar
- [ ] Rating Stars

---

**Component library maintained for consistency and reusability across the Circlo app.**
