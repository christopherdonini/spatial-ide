import { useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import ErrorBanner from "./ErrorBanner";

/**
 * Cut 1's whole shell: an admission flow and a working canvas, both landing in this same cut
 * (`docs/07` Prototype-completion arc). No style panel, no publish affordance -- neither exists
 * anywhere in this tree, not even as a disabled control (NEXT-CUT.md's own constraint).
 */
export default function App() {
  const [admitted, setAdmitted] = useState<Admitted | null>(null);

  return (
    <div className="app">
      <ErrorBanner />
      <header className="app-header">Spatial IDE</header>
      <main className="app-main">
        <AdmissionPanel onAdmitted={setAdmitted} />
        {/* The working canvas mounts here once a dataset is admitted -- wired in the next commit. */}
        {admitted && <div className="canvas-placeholder" data-dataset={admitted.dataset} />}
      </main>
    </div>
  );
}
