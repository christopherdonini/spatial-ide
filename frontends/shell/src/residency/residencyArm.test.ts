// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, describe, expect, it, vi } from "vitest";

import { isInstrumentedBuild } from "../isInstrumentedBuild";
import {
  __resetResidencyArmForTests,
  DEFAULT_RESIDENCY_ARM,
  getResidencyArm,
  notifyResidencyArmDatasetClosed,
  notifyResidencyArmDatasetOpened,
  setResidencyArm,
  shouldConstructCandidateSession,
} from "./residencyArm";

describe("residencyArm", () => {
  afterEach(() => {
    __resetResidencyArmForTests();
  });

  // RELEASE-0.1 item 7 (2026-09-07, DECISIONS-PENDING entry 52 = (a)): re-pinned from "defaults to
  // baseline" -- ADR-028 applied as accepted, the human's ruling.
  it("defaults to candidate", () => {
    expect(getResidencyArm()).toBe("candidate");
    expect(DEFAULT_RESIDENCY_ARM).toBe("candidate");
  });

  it("can be set to baseline while no dataset is open", () => {
    const result = setResidencyArm("baseline");
    expect(result).toEqual({ ok: true });
    expect(getResidencyArm()).toBe("baseline");
  });

  // RELEASE-0.1 item 7: the switch stays dev-gated, but baseline remains selectable through it --
  // the discharged interim (ADR-011 gate 8, met 2026-09-02, discharged by ADR-028) is not retired,
  // only no longer the default.
  it("can be set back to candidate from baseline", () => {
    setResidencyArm("baseline");
    const result = setResidencyArm("candidate");
    expect(result).toEqual({ ok: true });
    expect(getResidencyArm()).toBe("candidate");
  });

  // RELEASE-0.1 item 7: target flipped to "baseline" -- the default is now "candidate", so this
  // must request the ARM THAT DIFFERS from current to actually exercise the refusal path (setting
  // to the current value while open is the separate no-op-success case below).
  it("is refused with a typed error while a dataset is open", () => {
    notifyResidencyArmDatasetOpened();
    const result = setResidencyArm("baseline");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("dataset-open");
      expect(typeof result.message).toBe("string");
    }
    expect(getResidencyArm()).toBe("candidate"); // unchanged
  });

  it("setting to the CURRENT value while a dataset is open is not refused (a no-op success)", () => {
    notifyResidencyArmDatasetOpened();
    const result = setResidencyArm("candidate"); // already candidate (the default)
    expect(result).toEqual({ ok: true });
  });

  it("is settable again once the dataset closes", () => {
    notifyResidencyArmDatasetOpened();
    expect(setResidencyArm("baseline").ok).toBe(false);
    notifyResidencyArmDatasetClosed();
    expect(setResidencyArm("baseline")).toEqual({ ok: true });
  });

  it("never throws -- always a typed return value", () => {
    notifyResidencyArmDatasetOpened();
    expect(() => setResidencyArm("baseline")).not.toThrow();
  });

  // RELEASE-0.1 item 7's own pre-committed test: "a production-mode render (no instrumented build)
  // constructs the candidate session." `App.tsx` cannot be rendered in this suite at all
  // (`App.test.ts`'s own top comment: `WorkingCanvas`'s real `Deck` construction needs a WebGL
  // context jsdom does not provide, and no React DOM harness exists in this package), so this is the
  // closest honest equivalent.
  //
  // SHOULD-FIX S3 (2026-09-07, reviewer gate; corrected 2026-09-08, post-PASS sweep S-e): calls
  // `shouldConstructCandidateSession()` (`residencyArm.ts`) DIRECTLY -- the actual exported function
  // `App.tsx`'s `[admitted]` effect calls at its own construction branch -- rather than re-typing its
  // condition inline. **What THIS test proves, stated honestly:** that
  // `shouldConstructCandidateSession()` itself returns `true` when `isInstrumentedBuild()` is `false`
  // (production mode) -- the PREDICATE's own behavior, not gated on instrumentation. It does NOT
  // prove `App.tsx` still calls this exact function un-gated at its own call site -- no React-render
  // harness exists in this package (above) to observe that directly. **That other half is NOT
  // uncovered, though -- a DIFFERENT, existing check covers it:** `e2e/checkDistClean.mjs`'s own
  // `EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS` pass (SHOULD-FIX S1) asserts the candidate branch's own
  // downstream calls (`pushTileBatch`/`clearTile`/etc.) survive as real call sites in a production
  // build -- a regression that re-gates `App.tsx`'s call site behind `isInstrumentedBuild() &&` makes
  // that whole branch dead code again, stripping those calls from the bundle, which `check:dist-clean`
  // FAILs on. Confirmed live (2026-09-08): mutating `App.tsx`'s call site to
  // `if (isInstrumentedBuild() && shouldConstructCandidateSession())`, building, and running
  // `check:dist-clean` FAILs with all seven of those identifiers at zero surviving call sites --
  // reverted immediately after, not shipped. So: THIS unit test covers the predicate;
  // `check:dist-clean`'s S1 pass covers the call site; together, not either alone, they cover the
  // exact regression this comment used to say nothing covered.
  //
  // `vi.stubEnv("DEV", false)` simulates a plain production build's `import.meta.env.DEV` (Vitest's
  // own documented `import.meta.env` stubbing, not a mock of this module's own logic) with
  // `VITE_MEASURE_BUILD` left unset, so `isInstrumentedBuild()` reads `false` here exactly as it
  // would in a real `npm run build` output.
  it("shouldConstructCandidateSession() holds even when isInstrumentedBuild() is false (production mode)", () => {
    vi.stubEnv("DEV", false);
    try {
      expect(isInstrumentedBuild()).toBe(false);
      expect(shouldConstructCandidateSession()).toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("shouldConstructCandidateSession() reads false once the arm is switched to baseline", () => {
    setResidencyArm("baseline");
    expect(shouldConstructCandidateSession()).toBe(false);
    expect(getResidencyArm()).toBe("baseline");
  });
});
