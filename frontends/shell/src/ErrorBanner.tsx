// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useSyncExternalStore } from "react";

import { Banner, dismissBanner, subscribeBanner } from "./diagnostics/errorHandlers";

let snapshot: Banner | null = null;

function subscribe(onStoreChange: () => void): () => void {
  return subscribeBanner((banner) => {
    snapshot = banner;
    onStoreChange();
  });
}

function getSnapshot(): Banner | null {
  return snapshot;
}

/**
 * The visible half of ADR-010 rule 7's global-handler contract. Non-dismissable in spirit (an
 * operator should notice it happened) but dismissable in fact -- cut 1 declares no auto-recovery,
 * so leaving a stale banner up forever after the operator has already read it serves nobody.
 */
export default function ErrorBanner() {
  const banner = useSyncExternalStore(subscribe, getSnapshot);
  if (!banner) return null;
  return (
    <div role="alert" className="error-banner">
      <strong>{banner.message}</strong>
      <pre>{banner.detail}</pre>
      <button type="button" onClick={dismissBanner}>
        Dismiss
      </button>
    </div>
  );
}
