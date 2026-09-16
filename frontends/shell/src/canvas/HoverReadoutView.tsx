// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import {
  isPickBelowResolution,
  isPickConfirming,
  isPickSessionEnded,
  type HoverReadout,
  type PickResult,
} from "./pick";

/**
 * **The marker's text -- FINAL wording** (`HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` M3).
 * DECISIONS-PENDING entry 88 / 75 (3), RULED 2026-09-14 (question set B, B1): the human's own
 * example line is `id 6430 · confirming…`, and the ruling's last sentence holds the wording open --
 * *"Wording sighted live at the sitting; the state itself is ruled now."* **Sighted and accepted at the
 * 2026-09-15 sitting, Row 6 (a)** -- the human, verbatim: *"Row 6 is now perfect"*, the wording judged
 * in their own words (entry 91 (b) discharged; MANUAL-WALKTHROUGH.md, the 2026-09-14/15 sitting). The
 * example line is therefore the FINAL wording. Re-wording it remains a one-line change here, with no
 * behaviour, type or test structure depending on the characters themselves.
 *
 * It is the MARKER only -- the leading separator included, the id excluded. The id is rendered by
 * the same code that renders a confirmed one, and the two are never concatenated into one string
 * (M2): the marker is its own element, so it can be styled muted, read structurally by a test, and
 * can never be mistaken for part of the identity.
 */
export const HOVER_CONFIRMING_MARKER_TEXT = " · confirming…";

/** The id line exactly as this canvas has always rendered it -- `id <stable id>`, then the
 * authoritative f64 anchor when the pick carried one (`pick.ts`'s `PickResult.anchor`). Shared by
 * the confirmed and the labelled states so the id the operator sees under a marker is character-for
 * -character the id they saw before the camera moved (B1: *"the standing id stays visible"*). */
function idLine(pick: PickResult): string {
  return `id ${pick.id.toString()}${pick.anchor ? ` @ (${pick.anchor[0].toFixed(3)}, ${pick.anchor[1].toFixed(3)})` : ""}`;
}

/**
 * The hover readout, all four of its states, in one place -- extracted verbatim from `App.tsx`'s
 * own two inline branches (same slot, same classes, same text) so that the LABELLED state's render
 * is a single return that emits the id and its marker **together** and nothing can render one
 * without the other (`HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` M2, invariants 1 and 3;
 * ADR-010 rule 5, `:68` -- staleness signalled, never silently served).
 *
 * The type does the structural half of the work: `PickConfirming` carries its id in `standing` and
 * has no `id` of its own, so the confirmed branch below cannot accept it and the compiler, not a
 * convention, is what keeps a stale id out of the bare-id line. This component does the rest: the
 * marker element is emitted in the same `return` as the id it labels.
 *
 * Viewport-residency cut P6a, decision 24(c) (carried over from `App.tsx`): `hover` is a
 * `HoverReadout`, not merely `PickResult | null` -- a below-pick-resolution refusal is its own
 * distinct branch, a typed hover-readout state (never null-silence), rendered in the SAME
 * `.hover-readout` slot an ordinary pick uses.
 */
export function HoverReadoutView({ readout }: { readout: HoverReadout }): JSX.Element | null {
  if (readout === null) return null;

  // **Placed FIRST, before every other branch** (P3b §2a(iv)) -- the same structural discipline
  // this file already states above for the labelled state, applied to the stronger fact. A standing
  // id must never be rendered after the session ended, and the way to make that true structurally
  // is that no later branch can be reached once this one matches. `latchedHoverReadout` (`pick.ts`)
  // already guarantees no other variant arrives while latched; this ordering means the guarantee is
  // not the only thing holding.
  //
  // **The wording is the human's at P6** (§9: the two strings P3b adds join the P6 sight list). No
  // test asserts it verbatim; `HoverReadoutView.test.tsx` asserts the structural property -- that
  // the refusal renders and no id does.
  if (isPickSessionEnded(readout)) {
    return (
      <div className="hover-readout hover-readout-session-ended">
        The source file changed while it was open, so what was on the canvas was cleared and
        features here can no longer be identified — reopen the dataset to continue.
      </div>
    );
  }

  if (isPickBelowResolution(readout)) {
    return (
      <div className="hover-readout hover-readout-below-resolution">
        Features here are below pick resolution — zoom in to inspect them.
      </div>
    );
  }

  if (isPickConfirming(readout)) {
    return (
      <div className="hover-readout hover-readout-confirming">
        {idLine(readout.standing)}
        <span className="hover-readout-confirming-marker">{HOVER_CONFIRMING_MARKER_TEXT}</span>
      </div>
    );
  }

  return <div className="hover-readout">{idLine(readout)}</div>;
}
