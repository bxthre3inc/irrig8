# Zo Space Android App

**Package:** `com.bxthre3.zospace`  
**Version:** 1.0.0  
**Target:** brodiblanco.zo.space

A native Android wrapper for your Zo Space public website.

## Build Instructions

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- Android SDK 34
- JDK 17

### Build Release APK
```bash
cd /path/to/zo-space-android
./gradlew :app:assembleRelease
```

APK output: `app/build/outputs/apk/release/app-release.apk`

### Build Debug APK
```bash
./gradlew :app:assembleDebug
```

## Features
- Full-screen WebView of brodiblanco.zo.space
- Pull-to-refresh
- Back button navigation support
- Material 3 dark theme

## App Details
| Property | Value |
|----------|-------|
| Application ID | com.bxthre3.zospace |
| Min SDK | 28 (Android 9) |
| Target SDK | 34 (Android 14) |
| Compile SDK | 34 |
