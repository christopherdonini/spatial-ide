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

describe("the bound on text from a file (Amendment 54 item 5 (j), T-12)", () => {
  // RECORDED MUTATION for T-12's bound: in `shownText` (project/shownText.ts) the cut takes 1,024 units whatever the last one is. Expected failure: a
  // surrogate pair is split.
  it("replaces hidden characters, then cuts past 1,024 units on a code-point boundary with the kernel's mark", async () => {
    const { holdsHiddenText, shownText } = await import("./shownText");
    expect(shownText("a\u202Eb\u0007c\u0085d\u061Ce\u200Ef\u2066g\u2028h\u2029i\u007Fj\u0000")).toBe("a\uFFFDb\uFFFDc\uFFFDd\uFFFDe\uFFFDf\uFFFDg\uFFFDh\uFFFDi\uFFFDj\uFFFD");
    expect(shownText("plain é 字 \u{1F600}"), "nothing else changes").toBe("plain é 字 \u{1F600}");
    const path = `C:/${"p".repeat(1997)}`;
    expect(shownText(path)).toBe(`${path.slice(0, 1024)} [cut]`);
    expect(shownText(path).length, "at most 1,030 units").toBe(1030);
    expect(shownText("x".repeat(1024)), "at the bound, no cut").toBe("x".repeat(1024));
    expect(shownText(`${"x".repeat(1023)}\u{1F600}y`), "the pair is not split").toBe(`${"x".repeat(1023)} [cut]`);
    expect(shownText(`\u202E${"x".repeat(1100)}`).startsWith("\uFFFD"), "replaced before the cut").toBe(true);
    expect([holdsHiddenText("a\u202Eb"), holdsHiddenText("a\u0007"), holdsHiddenText("a\u2066"), holdsHiddenText("zone = 'a'")]).toEqual([true, true, true, false]);
  });
});
