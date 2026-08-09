import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed dev-server port (tauri.conf.json's devUrl) and needs to know the app is
// running inside its own webview so HMR doesn't fight the host's own reload.
export default defineConfig(async () => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
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
