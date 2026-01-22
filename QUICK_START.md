# 🚀 Quick Start Guide - Circlo Frontend

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Download Fonts

1. Go to [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
2. Download the font family
3. Extract and copy these files to `frontend/assets/fonts/`:
   - `Poppins-Regular.ttf`
   - `Poppins-Medium.ttf`
   - `Poppins-SemiBold.ttf`
   - `Poppins-Bold.ttf`

### Step 3: Run the App

```bash
npm start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

## 📱 Testing Without Backend

The frontend is fully functional with UI and navigation. Backend API calls will fail gracefully with error messages, but you can explore:

✅ All screen designs and layouts  
✅ Navigation flow  
✅ UI components and interactions  
✅ Form validations  
✅ Empty states and error screens  
✅ Skeleton loaders

## 🎨 Design Preview Checklist

### Screens to Explore:

- [x] **Splash Screen** - Animated gradient with logo
- [x] **Landing/Onboarding** - 3 slides with features
- [x] **Login Screen** - Clean auth form
- [x] **Signup Screen** - Registration flow
- [x] **Profile Setup** - Bio & interests selection
- [x] **Home Screen** - Map view + Activity list
- [x] **Create Activity** - Activity creation form
- [x] **Activity Details** - Full activity info
- [x] **Join Requests** - Request management
- [x] **Group Chat** - Real-time chat UI
- [x] **My Activities** - Created & Joined tabs
- [x] **Profile Screen** - User profile view
- [x] **User Profile** - View other user profiles

### Components to Test:

- [x] Activity Cards
- [x] Filter Chips
- [x] Buttons (all variants)
- [x] Empty States
- [x] Error States
- [x] Skeleton Loaders
- [x] User Cards
- [x] Message Bubbles

## 🎯 Key Files to Review

### Design System

📄 `/DESIGN_SYSTEM.md` - Complete design specifications

### Configuration

📄 `/frontend/src/config/constants.js` - Colors, activity types, API config

### Components

📂 `/frontend/src/components/` - Reusable UI components

### Screens

📂 `/frontend/src/screens/` - All app screens

### Navigation

📄 `/frontend/src/navigation/AppNavigator.js` - Screen flow

## 🎨 Customization Quick Tips

### Change Primary Color

Edit `/frontend/src/config/constants.js`:

```javascript
export const COLORS = {
  primary: "#YOUR_COLOR", // Change this
  // ...
};
```

### Add New Activity Type

Edit `/frontend/src/config/constants.js`:

```javascript
export const ACTIVITY_TYPES = [
  // ... existing types
  {
    id: "newtype",
    label: "New Type",
    icon: "icon-name",
    color: "#HEX_COLOR",
  },
];
```

### Modify Screen Layouts

Each screen is independent in `/frontend/src/screens/`

## 📋 Project Structure Overview

```
Circlo/
├── README.md                 # Main project documentation
├── DESIGN_SYSTEM.md          # Complete design specs
├── QUICK_START.md           # This file
│
├── frontend/                 # React Native app
│   ├── assets/              # Images, fonts
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── config/          # App configuration
│   │   ├── context/         # React Context
│   │   ├── navigation/      # Navigation setup
│   │   ├── screens/         # All screens
│   │   └── services/        # API & WebSocket
│   ├── App.js              # Root component
│   ├── package.json        # Dependencies
│   └── README.md           # Frontend docs
│
└── backend/                 # Spring Boot (pending)
    └── ...
```

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
npm start --reset-cache
```

### Expo Go App Not Connecting

- Ensure phone and computer are on same WiFi
- Check firewall settings
- Try USB debugging instead

### Fonts Not Loading

- Verify font files are in `/assets/fonts/`
- Check exact filenames match in `App.js`
- Clear cache: `npm start --clear`

### Map Not Showing

- Location permission may be denied
- Check Google Maps API key (if using)
- Ensure simulator has location enabled

## 📸 Screenshots Checklist

For documentation/portfolio, capture:

- [ ] Splash screen with gradient
- [ ] Landing page (all 3 slides)
- [ ] Login screen
- [ ] Home screen - Map view
- [ ] Home screen - List view
- [ ] Activity creation flow
- [ ] Activity details screen
- [ ] Join requests screen
- [ ] Group chat interface
- [ ] Profile screen
- [ ] Filter chips in action
- [ ] Empty states
- [ ] Loading states

## 🎓 Learning Resources

### React Native

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

### Navigation

- [React Navigation](https://reactnavigation.org/)

### Design

- [Material Design](https://material.io/design)
- [Human Interface Guidelines](https://developer.apple.com/design/)

## 🚀 Next Steps

After exploring the frontend:

1. **Review the Design System** - Understand the complete design language
2. **Check All Screens** - Navigate through every screen
3. **Test Components** - Try different states and interactions
4. **Read the Code** - Understand the structure and patterns
5. **Backend Integration** - Ready to connect when backend is built

## 💡 Pro Tips

- Use Expo Go for quickest testing
- Toggle between Map and List view in Home
- Try creating activities with different types
- Navigate through the complete user flow
- Check empty and error states by viewing My Activities
- Inspect the code while viewing screens

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review `DESIGN_SYSTEM.md` for design questions
- Explore `frontend/README.md` for technical details

---

**Ready to explore? Run `npm start` and have fun! 🎉**
