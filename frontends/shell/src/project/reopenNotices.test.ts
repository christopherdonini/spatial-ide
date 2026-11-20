// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2 piece 1c, Amendment 54 item 12: the reopen's owner places and their builders. No test here asserts a place's words (item 12); each asserts
 * what the builder puts in the slots it is given.
 */

import { describe, expect, it } from "vitest";

import { changedFileNotice, fileNotFoundNotice, relinkedFileNotice, workspaceTextNotice } from "./reopenNotices";

/** The sentences of a notice, split after each full stop and a space. */
const sentences = (text: string): string[] => text.split(/(?<=\.) /);

describe("the reopen's notices (Amendment 54 T-6)", () => {
  // RECORDED MUTATION for T-6: in `reopenNotices.ts` the observed and the admission components are joined into one list. Expected failure: one sentence holds
  // both a file component and an admission claim.
  it("the changed-file notice names each component", () => {
    const check = { observed: ["size", "footer-hash"], admission: ["crs", "identity"] } as const;
    for (const text of [changedFileNotice(check), relinkedFileNotice(check)]) {
      const withFile = sentences(text).filter((s) => s.includes("size"));
      const withAdmission = sentences(text).filter((s) => s.includes("crs"));
      expect(withFile, "the file's components are named").toHaveLength(1);
      expect(withFile[0], "all of them").toContain("size, footer-hash");
      expect(withAdmission, "the admission's claims are named").toHaveLength(1);
      expect(withAdmission[0]).toContain("crs, identity");
      expect(withAdmission[0], "apart from the file's").not.toContain("size");
      expect(withFile[0]).not.toContain("crs");
    }
    expect(changedFileNotice({ observed: ["mtime"], admission: [] }), "an empty list is not named").not.toContain("admission");
    expect(changedFileNotice({ observed: [], admission: ["identity"] })).not.toContain("mtime");
    expect(relinkedFileNotice(check), "the re-linked notice is not the first one").not.toBe(changedFileNotice(check));
  });

  it("the slots are filled as given: a file name, a member list", () => {
    expect(fileNotFoundNotice("parcels.parquet")).toContain("parcels.parquet");
    expect(fileNotFoundNotice(null), "no location recorded").not.toContain("null");
    expect(fileNotFoundNotice(null)).not.toBe(fileNotFoundNotice("x"));
    expect(workspaceTextNotice(["filter", "style"])).toContain("filter, style");
  });
});
