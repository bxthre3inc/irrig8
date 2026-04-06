# Zo Space Android - OTA Updates

## Auto-Update Behavior
- Checks `https://brodiblanco.zo.space/api/ota/zospace` on every app launch
- Compares `versionCode` against current installed version
- Prompts user if newer version available
- Downloads APK to Downloads folder via Android DownloadManager
- Auto-triggers install intent after download completes

## Manual Build

```bash
export ANDROID_HOME=/opt/android-sdk
./gradlew :app:assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`

Copy to releases/: `cp app/build/outputs/apk/release/app-release.apk releases/zo-space-1.0.0.apk`

## Updating OTA Endpoint

Edit `https://brodiblanco.zo.space/api/ota/zospace` route to bump versionCode and update downloadUrl.

