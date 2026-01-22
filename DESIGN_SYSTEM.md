# Circlo - Design System Documentation

## 🎨 Color Palette

### Primary Colors

- **Primary**: `#5B64E3` - Indigo blue (Main brand color)
- **Primary Dark**: `#4751C4` - Darker shade for hover states
- **Accent**: `#FF7B7B` - Coral/Peach for highlights
- **Accent Light**: `#FFA59E` - Lighter coral for soft touches

### Neutral Colors

- **Background**: `#F8F9FA` - Off-white for app background
- **Surface**: `#FFFFFF` - White for cards and containers
- **Text**: `#2D3436` - Dark gray for primary text
- **Text Light**: `#636E72` - Medium gray for secondary text
- **Border**: `#DFE6E9` - Light gray for borders and dividers

### Semantic Colors

- **Success**: `#00B894` - Green for success states
- **Warning**: `#FDCB6E` - Yellow for warnings
- **Error**: `#D63031` - Red for errors
- **Disabled**: `#B2BEC3` - Gray for disabled states

### Gradient

- **Primary Gradient**: `['#5B64E3', '#8B5FE3', '#B94FE8']`
  - Used in: Splash screen, Landing page, Special highlights

## 📝 Typography

### Font Family

**Poppins** - Modern, geometric sans-serif font

Font Weights Used:

- **Regular** (400) - Body text
- **Medium** (500) - Subheadings, emphasis
- **SemiBold** (600) - Buttons, important text
- **Bold** (700) - Headings, titles

### Font Sizes

- **Display**: 32px - 36px (App name, major headers)
- **H1**: 28px (Screen titles)
- **H2**: 24px (Section headers)
- **H3**: 18px - 20px (Card titles)
- **Body**: 16px (Regular text)
- **Small**: 14px (Captions, labels)
- **Tiny**: 12px (Meta information)

### Line Heights

- Headings: 1.2x font size
- Body: 1.5x font size
- Tight spacing: 1x font size (for buttons)

## 🧩 Component Specifications

### Buttons

#### Primary Button

- Background: Primary color
- Text: White, 16px, SemiBold
- Padding: 16px vertical, 24px horizontal
- Border Radius: 12px
- States: Default, Hover, Pressed, Disabled

#### Secondary Button

- Background: Accent color
- Text: White, 16px, SemiBold
- Padding: 16px vertical, 24px horizontal
- Border Radius: 12px

#### Outline Button

- Background: Transparent
- Border: 1px Primary color
- Text: Primary color, 16px, SemiBold
- Padding: 16px vertical, 24px horizontal
- Border Radius: 12px

#### Text Button

- Background: Transparent
- Text: Primary color, 14px, Medium
- No border, minimal padding

### Cards

#### Activity Card

- Background: Surface (white)
- Border Radius: 16px
- Padding: 16px
- Shadow: Subtle (0px 2px 4px rgba(0,0,0,0.1))
- Margin Bottom: 16px

Components:

- Avatar (40x40, circular)
- Title (18px, SemiBold)
- Description (14px, Regular, 2 lines max)
- Badge (Activity type with color)
- Footer stats (Members, Distance)

#### User Card

- Background: Surface
- Border Radius: 12px
- Padding: 16px
- Avatar: 50x50, circular
- Info layout: Horizontal flex

### Input Fields

- Background: Surface
- Border: 1px Border color
- Border Radius: 12px
- Padding: 16px
- Font Size: 16px
- Focus State: Border changes to Primary color

### Filter Chips

- Background: Surface (unselected) / Activity color (selected)
- Border: 1px Border color
- Border Radius: 20px (pill shape)
- Padding: 8px vertical, 16px horizontal
- Font Size: 14px, Medium
- Gap: 8px between chips

### Badges

- Border Radius: 12px - 20px (depending on size)
- Padding: 4px - 8px vertical, 12px - 16px horizontal
- Font Size: 12px - 14px, Medium or SemiBold
- Background: Activity-specific colors

## 🎭 Activity Type Colors

Each activity has a unique color for visual distinction:

1. **Shopping**: `#FF6B6B` (Red-pink)
2. **Dining**: `#4ECDC4` (Turquoise)
3. **Sports**: `#95E1D3` (Mint)
4. **Walking**: `#F38181` (Coral)
5. **Movies**: `#AA96DA` (Purple)
6. **Café**: `#FCBAD3` (Light pink)
7. **Fitness**: `#A8D8EA` (Sky blue)
8. **Other**: `#95A5A6` (Gray)

## 📐 Spacing System

Based on 8px grid:

- **4px**: Tiny gap (0.5x)
- **8px**: Small gap (1x)
- **12px**: Medium-small gap (1.5x)
- **16px**: Standard gap (2x)
- **24px**: Large gap (3x)
- **32px**: Extra large gap (4x)
- **40px**: Huge gap (5x)
- **60px**: Header top padding (includes status bar)

## 🖼️ Screen Layouts

### Common Header Pattern

- Height: Variable (60px - 100px)
- Background: Surface (white)
- Padding Top: 60px (includes status bar)
- Padding Horizontal: 24px
- Padding Bottom: 16px - 24px

### Content Padding

- Horizontal: 16px - 24px
- Vertical: 16px - 24px
- Card Spacing: 16px

### Bottom Tab Bar

- Height: 60px
- Background: Surface
- Padding Bottom: 8px
- Padding Top: 8px
- Icon Size: 24px
- Active Color: Primary
- Inactive Color: Text Light

## 🎬 Animations

### Transitions

- **Duration**: 200ms - 300ms
- **Easing**: Ease-in-out
- **Use Cases**: Screen transitions, modal appearances

### Skeleton Loading

- Opacity pulse: 0.3 to 0.7
- Duration: 1000ms loop
- Background: Border color

### Fade In

- Initial Opacity: 0
- Final Opacity: 1
- Duration: 1000ms

### Scale Spring

- Initial Scale: 0.8
- Final Scale: 1
- Spring tension: 10
- Spring friction: 2

## 📱 Screen-Specific Designs

### Splash Screen

- Full screen gradient background
- Centered logo (100x100)
- App name (36px, Bold)
- Tagline (16px, Regular)
- Fade + Scale animation

### Landing/Onboarding

- Full screen with gradient
- Swipeable slides (3 slides)
- Image placeholder at top
- Title + Description
- Dot pagination
- CTA button at bottom
- Skip button (top right)

### Login/Signup

- Minimal header
- Form centered vertically
- Large input fields
- Social login buttons
- Link to alternate screen

### Home Screen

- Map view (collapsible)
- Filter chips (horizontal scroll)
- Activity feed/list toggle
- Floating action button (Create +)

### Activity Details

- Large header with badge
- Owner profile section
- Details card with stats
- Description section
- Members list (if joined)
- CTA buttons at bottom

### Group Chat

- Message bubbles
  - Own: Primary color, right-aligned
  - Others: Surface, left-aligned
  - Border radius: 20px with tail
- Input at bottom
- Sticky header

### Profile

- Large centered avatar (100px - 120px)
- Stats row (Activities, Rating)
- Interests chips
- Settings menu items

## 🎯 Design Principles

### 1. Clarity

- Clear visual hierarchy
- High contrast text
- Obvious interactive elements

### 2. Consistency

- Reusable components
- Consistent spacing
- Uniform border radius

### 3. Friendliness

- Rounded corners everywhere
- Warm, inviting colors
- Friendly illustrations

### 4. Trust

- Professional typography
- Approval-based system highlights
- Clear privacy indicators

### 5. Efficiency

- Quick access to key features
- Minimal steps to create/join
- Smart defaults

## 📋 Component Checklist

### Implemented ✅

- [x] ActivityCard
- [x] MessageBubble
- [x] FilterChip
- [x] Button (multiple variants)
- [x] UserCard
- [x] EmptyState
- [x] ErrorState
- [x] SkeletonLoader
- [x] ActivityCardSkeleton

### To Add 🔄

- [ ] Modal
- [ ] Toast/Snackbar
- [ ] ImageUploader
- [ ] DateTimePicker (custom styled)
- [ ] SearchBar
- [ ] ActivityFilters (advanced)
- [ ] Rating Stars
- [ ] Badge with count
- [ ] Avatar with status indicator
- [ ] Map markers (custom)

## 🎨 Assets Needed

### Icons

Using Material Icons from react-native-vector-icons

Common icons:

- `map` - Home
- `event` - Activities
- `person` - Profile
- `add` - Create
- `chat` - Messages
- `star` - Rating
- `location-on` - Location
- `error-outline` - Errors
- `refresh` - Retry

### Images

Place in `/assets/`:

- `icon.png` (1024x1024) - App icon
- `splash.png` (2048x2732) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `onboarding-1.png`, `onboarding-2.png`, `onboarding-3.png` - Onboarding illustrations
- `empty-activities.png` - Empty state illustration
- `error.png` - Error state illustration

### Fonts

Place in `/assets/fonts/`:

- `Poppins-Regular.ttf`
- `Poppins-Medium.ttf`
- `Poppins-SemiBold.ttf`
- `Poppins-Bold.ttf`

## 🌙 Dark Mode (Future)

Planned dark mode colors:

- Background: `#121212`
- Surface: `#1E1E1E`
- Text: `#FFFFFF`
- Text Light: `#B0B0B0`
- Primary: `#7B85FF` (lighter)
- Border: `#2C2C2C`

## 📱 Responsive Considerations

### Small Phones (<375px width)

- Reduce horizontal padding to 16px
- Smaller font sizes for headings
- Compact card layouts

### Large Phones/Tablets (>768px width)

- Max width constraints on content
- Multi-column layouts where appropriate
- Larger touch targets

## ♿ Accessibility

- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 for normal text
- Font scaling support
- Screen reader labels
- Keyboard navigation support

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Design System maintained by**: Circlo Team
