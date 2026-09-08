// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useSyncExternalStore } from "react";

import { OriginMismatchPayload, subscribeOriginMismatch } from "./diagnostics/originSelfCheck";

let snapshot: OriginMismatchPayload | null = null;

function subscribe(onStoreChange: () => void): () => void {
  return subscribeOriginMismatch((payload) => {
    snapshot = payload;
    onStoreChange();
  });
}

function getSnapshot(): OriginMismatchPayload | null {
  return snapshot;
}

/**
 * ADR-020 Amendment 1 (rewritten 2026-09-08): a typed, NON-dismissable state naming the post-load
 * origin self-check's mismatch. Deliberately no Dismiss button (contrast `ErrorBanner`, whose
 * banner IS dismissable): once the host's own check has found the webview's actual origin does
 * not match what was pinned at startup, the data plane refuses every stream this session opens for
 * the rest of the process's life (the pinned value is never reselected -- `originSelfCheck.ts`'s
 * own module doc), so there is nothing a dismiss could restore the user to.
 *
 * **Not a `console/surfaceRegistry.ts` row.** That registry classifies operator-INITIATED actions
 * (ADR-027 decision 2's three display classes are about what an operator's click reaches, not
 * about what the host pushes); this state has no click, no toggle, and no affordance at all to
 * classify -- it appears purely because the host emitted an event, the same way `ErrorBanner`'s
 * own automatic appearance on an `error`/`unhandledrejection` event is not itself a registry row
 * either (only ITS Dismiss button, `canvas.dismissErrorBanner`, is a class-C row -- this
 * component has no equivalent button to record).
 */
export default function OriginMismatchState() {
  const mismatch = useSyncExternalStore(subscribe, getSnapshot);
  if (!mismatch) return null;
  return (
    <div role="alert" className="origin-mismatch-state">
      <strong>Spatial IDE cannot verify its own origin</strong>
      <p>
        The data plane will refuse this session: the origin pinned at startup (<code>{mismatch.pinned}</code>)
        does not match the webview&apos;s actual origin (<code>{mismatch.actual}</code>).
      </p>
    </div>
  );
}
