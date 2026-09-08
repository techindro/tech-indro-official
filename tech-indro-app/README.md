# <div align="center">📱 TECH INDRO MOBILE APP</div>

### <div align="center">The Next-Gen EdTech Mobile Experience — Powered by React Native & Expo</div>

<div align="center">

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.76%2B-61dafb?style=for-the-badge&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-4f46e5?style=for-the-badge&logo=android)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Introduction

The **Tech Indro Mobile App** brings the comprehensive **Tech Indro learning ecosystem** directly to your pocket. Engineered for high performance, smooth 60 FPS transitions, and offline-friendly study sessions, the app enables students and developers across India to master **Artificial Intelligence, Robotics, Ethical Hacking, and Full-Stack Development** anytime, anywhere.

---

## 🌟 Key Highlights & Mobile UX

- 🎯 **Interactive Course Journey**: Browse flagship programs, track chapter progress, and enroll in live batches.
- 🤖 **24/7 AI Shikshak (Pocket Doubts)**: Instant voice & text doubt resolution powered by conversational AI.
- 🏆 **TSOC Project Hub**: Review real-world open-source repositories (*GhostPose 3D Sensing*, *Khicho-Chatbots*) with architecture diagrams and source links.
- 💻 **IndroLabs Mobile Code Runner**: Execute code snippets on-the-go without needing a PC.
- 📝 **Live Mock Quizzes**: Timed assessments, instant ranks, scorecards, and solution explanations.
- 🌓 **Adaptive Dark / Light Mode**: Beautiful custom palettes tailored for late-night study sessions without eye strain.
- 🔔 **Instant Notification Center**: Timely alerts for newly released modules, batch updates, and community hackathons.

---

## 🗂️ App Architecture & Routes

```
tech-indro-app/
├── src/
│   ├── app/                     # File-based routing (Expo Router)
│   │   ├── _layout.tsx          # Root navigation, theme & auth providers
│   │   ├── index.tsx            # Homepage with responsive nav & hero sections
│   │   ├── programs.tsx         # Course catalogs & batch enrollments
│   │   ├── tsoc.tsx             # Tech Season of Code project hub
│   │   ├── indrolabs.tsx        # IndroLabs in-app code runner
│   │   ├── quiz.tsx             # Interactive test series & quiz engine
│   │   ├── login.tsx            # Authentication (JWT / Email / Google)
│   │   ├── dashboard.tsx        # Personalized student learning dashboard
│   │   └── support.tsx          # 24/7 student support desk
│   │
│   ├── components/              # Reusable UI widgets
│   │   ├── ThemeToggleBtn.tsx   # Fluid theme switcher
│   │   ├── NotificationBell.tsx # Push/pull notification center
│   │   ├── AIChatBot.tsx        # AI doubt assistant widget
│   │   └── ProgramCard.tsx      # Modern course card
│   │
│   ├── constants/               # Global design tokens (Colors, Typography, Themes)
│   ├── hooks/                   # Custom React hooks (`useAuth`, `useTheme`)
│   └── services/                # API client with automatic token refreshing
│
├── assets/                      # Icons, splash screens, and brand imagery
├── app.json                     # Expo configuration & app metadata
└── package.json                 # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) app installed on your physical Android / iOS phone (optional)

### 1. Installation
```bash
# Clone repository and change to app folder
git clone https://github.com/techindro/tech-indro-website.git
cd tech-indro-website/tech-indro-app

# Install all npm dependencies
npm install
```

### 2. Run the Development Server
```bash
npx expo start
```

- Scan the QR code with **Expo Go** (Android) or **Camera app** (iOS).
- Press **`a`** to open in Android Studio Emulator.
- Press **`i`** to open in Xcode iOS Simulator.
- Press **`w`** to open the Expo Web preview.

---

## 📦 Building for Production (EAS Build)

To generate production `.apk` / `.aab` for the Google Play Store or `.ipa` for the Apple App Store:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build Android standalone APK/AAB
eas build -p android --profile production

# Build iOS standalone IPA
eas build -p ios --profile production
```

---

## 🎨 Design System & Theming

The app leverages a unified design system that mirrors the Tech Indro web experience:
- **Primary Color**: `#4f46e5` (Deep Indigo)
- **Secondary Color**: `#06b6d4` (Cyber Cyan)
- **Accent Color**: `#f59e0b` (Amber Gold)
- **Dark Mode Background**: `#0b0f19` (Deep Obsidian)
- **Light Mode Background**: `#f8fafc` (Clean Slate)

---

## 📄 License & Community

- **Founder & Architect**: Shubham Patel
- **Ecosystem**: [Tech Indro Live Web Platform](https://tech-indro-website.vercel.app)
- **License**: MIT License © 2026 Tech Indro
