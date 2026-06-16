import type { CapacitorConfig } from "@capacitor/cli";

/**
 * WAVES — Capacitor configuration.
 *
 * To produce an Android APK locally:
 *   1. bun run build
 *   2. npx cap add android      (first time only)
 *   3. npx cap sync android
 *   4. npx cap open android     → Build → Build Bundle(s) / APK(s) → Build APK(s)
 *
 * `webDir` points at the static client bundle Vite emits.
 */
const config: CapacitorConfig = {
  appId: "app.waves.instrument",
  appName: "WAVES",
  webDir: "dist/client",
  backgroundColor: "#0B0D12",
  android: {
    backgroundColor: "#0B0D12",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0B0D12",
      showSpinner: false,
    },
  },
};

export default config;
