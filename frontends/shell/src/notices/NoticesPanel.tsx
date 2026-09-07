// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useState } from "react";

// RELEASE-0.1 Amendment 3, item 2 ("Notice channel", Q2 shape): fed by a BUILD-TIME FILE, never a
// Tauri command. `src/generated/NOTICE.txt` is written by `scripts/generateNotice.mjs` (a
// `pretypecheck`/`prebuild` step, `package.json`) from `renderer/bundle-viewer/notice.mjs`'s
// `notice()` -- the ONE source -- and the SAME bytes are what `tauri.conf.json`'s
// `bundle.resources` ships as `NOTICE.txt` beside the installed executable. Importing it with
// `?raw` (Vite's built-in raw-text asset import, declared by `vite/client`'s own ambient types,
// already referenced in `vite-env.d.ts`) means this view adds NO new binding-local command --
// ADR-027 decision 4 taxes every one of those ("declare its class or fail the build"); a
// build-time string needs no class, because nothing was invoked.
import noticeText from "../generated/NOTICE.txt?raw";

/**
 * A modest, collapsed-by-default panel showing the shipped notice text -- the same "Notices"
 * surface RELEASE-0.1's Part M walkthrough step reads its strings from verbatim. Mounted
 * unconditionally in `App.tsx` (no dataset required to read it), following `ConsolePanel`'s own
 * collapsed-disclosure pattern (`console/ConsolePanel.tsx`) rather than inventing a new one.
 */
export default function NoticesPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="notices-panel">
      <button
        type="button"
        className="notices-disclosure"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "▾" : "▸"} Notices
      </button>
      {expanded && (
        <div className="notices-body">
          <pre className="notices-text">{noticeText}</pre>
        </div>
      )}
    </div>
  );
}
