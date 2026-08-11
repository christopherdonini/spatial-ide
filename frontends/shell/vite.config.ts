import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed dev-server port (tauri.conf.json's devUrl) and needs to know the app is
// running inside its own webview so HMR doesn't fight the host's own reload.
//
// Port 5180, not Tauri's default 1420: 1420 falls inside this machine's Windows excluded-port
// range (1335-1434, confirmed via `netsh interface ipv4 show excludedportrange protocol=tcp`), so
// binding it fails. Same finding the ADR-003 spike hit and worked around (spikes/adr-003-crs-rendering).
export default defineConfig(async () => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5180,
    strictPort: true,
    watch: {
      // Never watch the Rust side; a `cargo build` touching `target/` must not trigger a Vite reload.
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri's bundled webview (WebView2 on Windows) needs a modern target; matches the spike's own
    // choice for the same reason.
    target: "esnext",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
