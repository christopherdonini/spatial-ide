// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useSyncExternalStore } from "react";

import { OriginSelfCheckPayload, subscribeOriginMismatch } from "./diagnostics/originSelfCheck";

let snapshot: OriginSelfCheckPayload | null = null;

function subscribe(onStoreChange: () => void): () => void {
  return subscribeOriginMismatch((payload) => {
    snapshot = payload;
    onStoreChange();
  });
}

function getSnapshot(): OriginSelfCheckPayload | null {
  return snapshot;
}

/**
 * ADR-020 Amendment 1 (rewritten 2026-09-08): a typed, NON-dismissable state naming the post-load
 * origin self-check's outcome. Deliberately no Dismiss button (contrast `ErrorBanner`, whose
 * banner IS dismissable): once the host's own check has fired, there is nothing a dismiss could
 * restore the user to -- either outcome is a fact about this one page load, not a transient
 * condition (`originSelfCheck.ts`'s own module doc).
 *
 * **Reviewer S5: two truthfully different states, not one.** A `"mismatch"` outcome means the
 * webview's actual origin was read successfully and differs from what was pinned at startup -- the
 * data plane refuses every stream this session opens for the rest of the process's life (the
 * pinned value is never reselected). A `"unverifiable"` outcome means the host could not even READ
 * the webview's actual origin back -- it does NOT mean the pinned origin is wrong: the data plane's
 * admission still runs against the pinned origin exactly as pinned, unaffected by this one check's
 * own inability to confirm it. Rendering both as "will refuse" (the pre-fix shape) overclaimed the
 * unverifiable case.
 *
 * **Not a `console/surfaceRegistry.ts` row.** That registry classifies operator-INITIATED actions
 * (ADR-027 decision 2's three display classes are about what an operator's click reaches, not
 * about what the host pushes); this state has no click, no toggle, and no affordance at all to
 * classify -- it appears purely because the host emitted an event, the same way `ErrorBanner`'s
 * own automatic appearance on an `error`/`unhandledrejection` event is not itself a registry row
 * either (only ITS Dismiss button, `canvas.dismissErrorBanner`, is a class-C row -- this
 * component has no equivalent button to record).
 *
 * **The third branch is defensive, and deliberately claims nothing.** The `kind` discriminant is a
 * string crossing a serde/TypeScript boundary that no compiler checks; `e2e/checkOriginEventName.mjs`
 * pins the two strings mechanically (`npm run check:origin-event`), but a payload whose `kind` is
 * neither `"mismatch"` nor `"unverifiable"` must still not fall through to the mismatch text --
 * which is exactly what an `if/else` pair did before this branch existed: an unrecognised outcome
 * rendered "The data plane will refuse this session", a claim nothing had established. The third
 * branch names the outcome as unrecognised and asserts NEITHER refusal NOR admission; the session
 * log's own `origin-self-check` line is the host's actual verdict.
 */
export default function OriginMismatchState() {
  const outcome = useSyncExternalStore(subscribe, getSnapshot);
  if (!outcome) return null;
  // Captured before any narrowing, so the defensive branch below can name what actually arrived:
  // inside that branch the union is exhausted and `outcome` has been narrowed to `never`.
  const receivedKind = String((outcome as { kind: unknown }).kind);
  if (outcome.kind === "unverifiable") {
    return (
      <div role="alert" className="origin-mismatch-state origin-mismatch-state--unverifiable">
        <strong>Spatial IDE could not verify its own origin</strong>
        <p>
          The origin pinned at startup (<code>{outcome.pinned}</code>) could not be checked against
          the webview&apos;s actual origin (<code>{outcome.error}</code>). The pinned origin stands
          and the data plane still admits only the pinned origin.
        </p>
      </div>
    );
  }
  if (outcome.kind === "mismatch") {
    return (
      <div role="alert" className="origin-mismatch-state">
        <strong>Spatial IDE&apos;s origin does not match what was pinned at startup</strong>
        <p>
          The data plane will refuse this session: the origin pinned at startup (<code>{outcome.pinned}</code>)
          does not match the webview&apos;s actual origin (<code>{outcome.actual}</code>).
        </p>
      </div>
    );
  }
  return (
    <div role="alert" className="origin-mismatch-state origin-mismatch-state--unrecognised">
      <strong>Spatial IDE received an unrecognised origin self-check outcome</strong>
      <p>
        The host reported a self-check outcome of a kind this build does not recognise
        (<code>{receivedKind}</code>). This state claims neither that the data plane will refuse this
        session nor that it will admit it — the session log&apos;s own{" "}
        <code>origin-self-check</code> line carries what the host actually decided.
      </p>
    </div>
  );
}
