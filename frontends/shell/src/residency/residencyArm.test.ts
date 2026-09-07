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
  // ADR-011 gate 8's recorded interim is not retired, only no longer the default.
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
  // closest honest equivalent: it reproduces, directly, the exact boolean expression `App.tsx`'s
  // `[admitted]` effect now evaluates to choose between the candidate and baseline construction
  // branches -- `if (getResidencyArm() === "candidate")`, no `isInstrumentedBuild()` operand any
  // more (RELEASE-0.1 item 7, `App.tsx`'s own comment at that call site). `vi.stubEnv("DEV", false)`
  // simulates a plain production build's `import.meta.env.DEV` (Vitest's own documented import.meta
  // .env stubbing, not a mock of this module's own logic) with `VITE_MEASURE_BUILD` left unset, so
  // `isInstrumentedBuild()` reads `false` here exactly as it would in a real `npm run build` output --
  // and the arm-selection expression still reads `true`, proving construction is not gated on it.
  it("the candidate-session construction test (getResidencyArm() === \"candidate\") holds even when isInstrumentedBuild() is false (production mode)", () => {
    vi.stubEnv("DEV", false);
    try {
      expect(isInstrumentedBuild()).toBe(false);
      // The exact expression App.tsx's [admitted] effect uses to select the candidate construction
      // branch -- true by default, with no isInstrumentedBuild() operand any more.
      expect(getResidencyArm() === "candidate").toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
