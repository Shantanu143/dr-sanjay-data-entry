# Dr. Sanjay Patient Management - Mobile App (React Native + Expo)

A professional patient management mobile application built with React Native and Expo, featuring the exact same design and functionality as the web version.

## 🎨 Design Features

- **Glassmorphic UI** - Beautiful frosted glass effect cards
- **Gradient Backgrounds** - Purple, pink, blue, green, and teal gradients
- **Smooth Animations** - React Native Reanimated for 60fps animations
- **Responsive Design** - Works on all screen sizes
- **Same Color Scheme** - Exact match with web version

## ✨ Features

### Authentication

- ✅ Login with email/password
- ✅ JWT token management
- ✅ Secure AsyncStorage
- ✅ Auto-logout on 401

### Dashboard

- ✅ Patient statistics cards
- ✅ Quick actions
- ✅ Recent patients list
- ✅ Beautiful gradient header

### Patient Management

- ✅ **Two-Step Workflow**
  - Register New Patient
  - Record Revisit
- ✅ Patient search with real-time filtering
- ✅ Complete patient details
- ✅ Visit history timeline
- ✅ Gap calculation between visits

### Visit History

- ✅ Timeline visualization
- ✅ First visit labeled as "Case Taking"
- ✅ Subsequent visits labeled as "Symptoms"
- ✅ Add/Delete visits
- ✅ Automatic gap indicators

## 📱 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **Expo Linear Gradient** - Gradients
- **Lucide React Native** - Icons
- **React Native Reanimated** - Animations
- **React Native Gesture Handler** - Touch gestures

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. Navigate to the mobile-app directory:

```bash
cd mobile-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` and update the API URL:

- For Android Emulator: `http://10.0.2.2:5000/api`
- For iOS Simulator: `http://localhost:5000/api`
- For Physical Device: `http://YOUR_COMPUTER_IP:5000/api`

4. Update `app.json` with environment variables:

```json
{
  "expo": {
    "extra": {
      "APP_NAME": "Dr. Sanjay Patient Management",
      "API_URL": "http://YOUR_IP:5000/api",
      "API_TIMEOUT": "10000",
      "NODE_ENV": "development",
      "ENABLE_DEBUG": "true",
      "TOKEN_KEY": "@token",
      "USER_KEY": "@user"
    }
  }
}
```

5. Start the development server:

```bash
npx expo start
```

6. Run on your device:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable components
│   │   ├── GlassCard.js    # Glassmorphic card component
│   │   ├── GradientButton.js
│   │   ├── PatientCard.js
│   │   ├── VisitCard.js
│   │   └── SearchBar.js
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── AddPatientScreen.js
│   │   ├── PatientDetailScreen.js
│   │   ├── ManagePatientsScreen.js
│   │   └── SearchPatientsScreen.js
│   ├── navigation/          # Navigation setup
│   │   ├── AppNavigator.js
│   │   └── DrawerNavigator.js
│   ├── context/             # React Context
│   │   └── AuthContext.js
│   ├── lib/                 # Utilities
│   │   └── api.js          # Axios API client
│   ├── constants/           # Constants
│   │   └── index.js        # App constants
│   └── styles/              # Shared styles
│       └── theme.js
├── App.js                   # Root component
├── app.json                 # Expo configuration
├── .env                     # Environment variables
└── package.json             # Dependencies
```

## 🎨 Design System

### Colors (Matching Web)

```javascript
const COLORS = {
  primary: {
    purple: "#9333EA",
    pink: "#EC4899",
    blue: "#3B82F6",
    green: "#10B981",
    teal: "#14B8A6",
  },
  gradient: {
    purplePink: ["#9333EA", "#EC4899"],
    blueCyan: ["#3B82F6", "#06B6D4"],
    greenTeal: ["#10B981", "#14B8A6"],
  },
  slate: {
    50: "#F8FAFC",
    600: "#475569",
    700: "#334155",
  },
};
```

### Glassmorphic Effect

```javascript
const glassStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.4)",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 5,
};
```

## 🔧 Configuration

### Environment Variables

All environment variables use the `EXPO_PUBLIC_` prefix:

- `EXPO_PUBLIC_APP_NAME` - App name
- `EXPO_PUBLIC_API_URL` - Backend API URL
- `EXPO_PUBLIC_API_TIMEOUT` - Request timeout
- `EXPO_PUBLIC_TOKEN_KEY` - AsyncStorage key for token
- `EXPO_PUBLIC_USER_KEY` - AsyncStorage key for user data

### API Configuration

The app connects to the same backend as the web version. Make sure:

1. Backend server is running
2. API URL is correctly configured in `.env`
3. Your device/emulator can reach the backend

**Important**:

- Use your computer's local IP for physical devices
- Use `10.0.2.2` for Android Emulator
- Use `localhost` for iOS Simulator

## 📱 Screens Overview

### 1. Login Screen

- Beautiful gradient background
- Email/password input
- Remember me checkbox
- Error handling
- Loading states

### 2. Dashboard

- Statistics cards (Total Patients, New This Month, etc.)
- Quick action buttons
- Recent patients list
- Gradient header with user info

### 3. Add Patient (Mode Selection)

- Two cards: "Register New Patient" and "Record Revisit"
- Beautiful icons and descriptions
- Smooth navigation

### 4. Register New Patient

- Personal information form
- Medical information (Case Taking, Diagnosis, Protocol)
- Consent checkbox
- Creates first visit automatically

### 5. Record Revisit

- Patient search with real-time filtering
- Patient selection list
- Visit form (Symptoms, Diagnosis, Protocol, Notes)
- Redirects to patient details

### 6. Patient Details

- Patient information card
- Visit statistics
- Visit history timeline
- Gap indicators between visits
- Add visit button
- Delete visit functionality

### 7. Manage Patients

- Searchable patient list
- Patient cards with quick actions
- View details button
- Pagination

### 8. Search Patients

- Advanced search
- Filter by name, phone, age, gender
- Results list

## 🎯 Key Features Implementation

### Glassmorphic Cards

```javascript
import { LinearGradient } from "expo-linear-gradient";

const GlassCard = ({ children, style }) => (
  <View style={[styles.glassCard, style]}>
    <LinearGradient
      colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0.5)"]}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  </View>
);
```

### Gradient Buttons

```javascript
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = ({ colors, onPress, title }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient colors={colors} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
```

### Visit Timeline

```javascript
const VisitTimeline = ({ visits }) => (
  <View>
    {visits.map((visit, index) => (
      <View key={visit._id}>
        {/* Gap Indicator */}
        {index > 0 && (
          <Text style={styles.gap}>
            {calculateGap(visits[index - 1].visitDate, visit.visitDate)} gap
          </Text>
        )}

        {/* Visit Card */}
        <VisitCard visit={visit} isFirst={index === visits.length - 1} />
      </View>
    ))}
  </View>
);
```

## 🔄 API Integration

All API calls use the centralized `api.js` client:

```javascript
import api from "../lib/api";

// GET request
const response = await api.get("/patients");

// POST request
const response = await api.post("/patients", data);

// PUT request
const response = await api.put(`/patients/${id}`, data);

// DELETE request
const response = await api.delete(`/patients/${id}`);
```

## 🚢 Building for Production

### Android

```bash
npx expo build:android
```

### iOS

```bash
npx expo build:ios
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🧪 Testing

### On Physical Device

1. Install Expo Go app
2. Run `npx expo start`
3. Scan QR code with camera (iOS) or Expo Go (Android)

### On Emulator

1. Start Android Emulator or iOS Simulator
2. Run `npx expo start`
3. Press `a` for Android or `i` for iOS

## 📝 Development Notes

### Hot Reload

Expo supports hot reload. Save any file and see changes instantly.

### Debugging

- Shake device to open developer menu
- Enable Remote JS Debugging
- Use React Native Debugger

### Common Issues

1. **Cannot connect to backend**

   - Check API URL in `.env`
   - Ensure backend is running
   - Check firewall settings

2. **Gradients not showing**

   - Make sure `expo-linear-gradient` is installed
   - Check import statements

3. **Navigation errors**
   - Ensure all navigation dependencies are installed
   - Check React Navigation setup

## 🎨 Customization

### Change App Name

Update in `.env`:

```env
EXPO_PUBLIC_APP_NAME=Your App Name
```

### Change Colors

Edit `src/constants/index.js`:

```javascript
export const COLORS = {
  primary: {
    purple: "#YOUR_COLOR",
    // ...
  },
};
```

### Change API URL

Update in `.env`:

```env
EXPO_PUBLIC_API_URL=https://your-api.com/api
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

## 🤝 Contributing

This is a proprietary application for Dr. Sanjay's clinic.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For support, contact the development team.

---

**Note**: This mobile app is designed to work with the same backend API as the web version. Ensure the backend is running and accessible from your mobile device/emulator.
