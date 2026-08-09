import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles.css";

/**
 * Loaded only via `main.tsx`'s dynamic `import()`, after the global error handlers and watchdog
 * are already installed (ADR-010 rule 7). Nothing here may be imported statically from `main.tsx`.
 */
export function mount(): void {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("no #root element to mount into");
  }
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
