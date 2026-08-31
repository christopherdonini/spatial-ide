// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, describe, expect, it } from "vitest";

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

  it("defaults to baseline", () => {
    expect(getResidencyArm()).toBe("baseline");
    expect(DEFAULT_RESIDENCY_ARM).toBe("baseline");
  });

  it("can be set to candidate while no dataset is open", () => {
    const result = setResidencyArm("candidate");
    expect(result).toEqual({ ok: true });
    expect(getResidencyArm()).toBe("candidate");
  });

  it("can be set back to baseline", () => {
    setResidencyArm("candidate");
    const result = setResidencyArm("baseline");
    expect(result).toEqual({ ok: true });
    expect(getResidencyArm()).toBe("baseline");
  });

  it("is refused with a typed error while a dataset is open", () => {
    notifyResidencyArmDatasetOpened();
    const result = setResidencyArm("candidate");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("dataset-open");
      expect(typeof result.message).toBe("string");
    }
    expect(getResidencyArm()).toBe("baseline"); // unchanged
  });

  it("setting to the CURRENT value while a dataset is open is not refused (a no-op success)", () => {
    notifyResidencyArmDatasetOpened();
    const result = setResidencyArm("baseline"); // already baseline
    expect(result).toEqual({ ok: true });
  });

  it("is settable again once the dataset closes", () => {
    notifyResidencyArmDatasetOpened();
    expect(setResidencyArm("candidate").ok).toBe(false);
    notifyResidencyArmDatasetClosed();
    expect(setResidencyArm("candidate")).toEqual({ ok: true });
  });

  it("never throws -- always a typed return value", () => {
    notifyResidencyArmDatasetOpened();
    expect(() => setResidencyArm("candidate")).not.toThrow();
  });
});
