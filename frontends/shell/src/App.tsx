import ErrorBanner from "./ErrorBanner";

/**
 * Cut 1's whole shell: an admission flow and a working canvas, both landing in later commits of
 * this same cut (`docs/07` Prototype-completion arc). No style panel, no publish affordance --
 * neither exists anywhere in this tree, not even as a disabled control (NEXT-CUT.md's own
 * constraint).
 */
export default function App() {
  return (
    <div className="app">
      <ErrorBanner />
      <header className="app-header">Spatial IDE</header>
      <main className="app-main" />
    </div>
  );
}
