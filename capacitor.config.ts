import type { CapacitorConfig } from "@capacitor/cli";

/**
 * WAVES — Capacitor configuration for production Android builds.
 *
 * Signed APK / AAB:
 *   1. bun run build
 *   2. npx cap add android        (first time only)
 *   3. npx cap sync android
 *   4. npx cap open android
 *      → Android Studio → Build → Generate Signed Bundle / APK
 *      → choose AAB for Play Store, APK for direct install
 *
 * Background audio + media-session integration is handled in-app by the
 * WebAudio engine; Android keeps the page alive while audio is playing.
 */
const config: CapacitorConfig = {
  appId: "app.waves.instrument",
  appName: "WAVES",
  webDir: "dist/client",
  backgroundColor: "#0B0D12",
  android: {
    backgroundColor: "#0B0D12",
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#0B0D12",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0B0D12",
      overlaysWebView: true,
    },
  },
};

export default config;
