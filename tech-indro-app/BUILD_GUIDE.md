# 📱 Tech Indro — Android APK Build Guide

Follow these steps to generate an installable `.apk` file for Android phones or run on real devices.

---

## Method 1: Instant Mobile Testing with Expo Go (No Build Required) 📲

This is the fastest way to run and test the complete app on your phone:

1. Install **Expo Go** from Google Play Store on your Android phone.
2. Ensure your phone and PC are connected to the same Wi-Fi network.
3. In terminal, start the development server:
   ```bash
   cd tech-indro-website/tech-indro-app
   npx expo start
   ```
4. Open the Expo Go app and scan the QR code displayed in the terminal.
5. The complete app will load immediately on your device!

---

## Method 2: Generate Direct Installable APK via EAS Cloud Build (Recommended) 🚀

This generates a standalone `.apk` file that can be downloaded and installed on any Android phone (without needing Expo Go or Android Studio on your PC):

1. Install EAS CLI globally or run with `npx`:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your free Expo account:
   ```bash
   eas login
   ```
   *(If you don't have an account, create one for free at [expo.dev/signup](https://expo.dev/signup))*

3. Configure project ID:
   ```bash
   eas project:init
   ```

4. Trigger the APK build:
   ```bash
   eas build -p android --profile preview
   ```

5. Once the build finishes on Expo's high-speed cloud servers (usually ~5-8 minutes), you will receive a **Download Link and QR Code** to download `tech-indro.apk` directly to your phone.

---

## Method 3: Local Android Build (Requires Android Studio & SDK) 💻

If you have Android Studio installed with the Android SDK:

```bash
cd tech-indro-website/tech-indro-app
npx expo run:android
```

This will prebuild the native Android project into `/android` and launch it on your connected USB device or Android emulator.
