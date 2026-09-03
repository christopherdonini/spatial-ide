// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, describe, expect, it } from "vitest";

import {
  __resetResidencyTileSizeLevelForTests,
  getResidencyTileSizeLevel,
  notifyResidencyTileSizeLevelDatasetClosed,
  notifyResidencyTileSizeLevelDatasetOpened,
  setResidencyTileSizeLevel,
} from "./residencyTileSizeLevel";

describe("residencyTileSizeLevel", () => {
  afterEach(() => {
    __resetResidencyTileSizeLevelForTests();
  });

  it("defaults to unset (null) -- NOT a substitute for DEFAULT_TILE_GRID_LEVEL", () => {
    expect(getResidencyTileSizeLevel()).toBeNull();
  });

  it("can be set to each of the three locked levels while no dataset is open", () => {
    for (const level of ["coarse", "medium", "fine"] as const) {
      const result = setResidencyTileSizeLevel(level);
      expect(result).toEqual({ ok: true });
      expect(getResidencyTileSizeLevel()).toBe(level);
    }
  });

  it("is refused with a typed error while a dataset is open", () => {
    notifyResidencyTileSizeLevelDatasetOpened();
    const result = setResidencyTileSizeLevel("fine");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("dataset-open");
      expect(typeof result.message).toBe("string");
    }
    expect(getResidencyTileSizeLevel()).toBeNull(); // unchanged
  });

  it("setting to the CURRENT value while a dataset is open is not refused (a no-op success)", () => {
    setResidencyTileSizeLevel("coarse");
    notifyResidencyTileSizeLevelDatasetOpened();
    const result = setResidencyTileSizeLevel("coarse"); // already coarse
    expect(result).toEqual({ ok: true });
  });

  it("is settable again once the dataset closes", () => {
    notifyResidencyTileSizeLevelDatasetOpened();
    expect(setResidencyTileSizeLevel("fine").ok).toBe(false);
    notifyResidencyTileSizeLevelDatasetClosed();
    expect(setResidencyTileSizeLevel("fine")).toEqual({ ok: true });
  });

  it("never throws -- always a typed return value", () => {
    notifyResidencyTileSizeLevelDatasetOpened();
    expect(() => setResidencyTileSizeLevel("medium")).not.toThrow();
  });
});
