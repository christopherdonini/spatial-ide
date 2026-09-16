// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { formatTerminalRefusal } from "./formatTerminalRefusal";
import { REAL_SOURCE_CHANGED_TERMINAL_DETAIL } from "../testUtils/terminalShapes";

describe("formatTerminalRefusal", () => {
  /**
   * Mutation: delete the `/^engine\.[a-z0-9_]+$/` branch. Expected failure: "strips the typed code
   * the kernel prefixes, so no machine code reaches the operator" fails on both assertions -- which
   * is the operator-visible regression this exists to close: `App.tsx`'s streaming banner
   * interpolates the detail whole, so the prefix would be read as part of the sentence.
   */
  it("strips the typed code the kernel prefixes, so no machine code reaches the operator", () => {
    const f = formatTerminalRefusal(REAL_SOURCE_CHANGED_TERMINAL_DETAIL);

    expect(f.code).toBe("engine.source_changed");
    // The end-to-end property: nothing machine-readable is left in what the operator reads.
    expect(f.message).not.toContain("engine.");
    expect(f.message.startsWith("refused: the source file changed while it was open")).toBe(true);
    // And nothing is summarized away -- boundary 4's limitation sentence survives intact.
    expect(f.message.endsWith("only after that query has finished reading")).toBe(true);
    expect(f.fields).toEqual([]);
  });

  /**
   * Mutation: drop the `head` shape test so any `"x: y"` detail is split. Expected failure: "a
   * detail with no typed code is passed through whole" fails on the transport-level string, which
   * routinely carries a colon and never carries a code.
   */
  it("a detail with no typed code is passed through whole", () => {
    // A transport-level terminal, which never passed through `terminal_detail_of`.
    const transport = "websocket closed: 1006 abnormal closure";
    const f = formatTerminalRefusal(transport);
    expect(f.code).toBe("stream-failed");
    expect(f.message).toBe(transport);

    // And the degenerate cases: an empty detail, and one that is only a colon-space.
    expect(formatTerminalRefusal("").message).toBe("");
    expect(formatTerminalRefusal(": x").code).toBe("stream-failed");
  });

  /**
   * Mutation: widen the pattern to `/^engine\./`. Expected failure: "a prefix that is not a
   * snake_case code is not treated as one" fails -- a sentence opening with "engine. Something:"
   * would be mistaken for a typed refusal and silently truncated.
   */
  it("a prefix that is not a snake_case code is not treated as one", () => {
    const prose = "engine. Something went wrong: details follow";
    expect(formatTerminalRefusal(prose).code).toBe("stream-failed");
    expect(formatTerminalRefusal(prose).message).toBe(prose);
  });

  /**
   * Every `engine.*` code gets the same treatment -- the parser is the convention, not a
   * special case for the one code the client acts on.
   *
   * Mutation: hardcode the pattern to `engine.source_changed`. Expected failure: "every engine code
   * is parsed, not just the one a client acts on" fails.
   */
  it("every engine code is parsed, not just the one a client acts on", () => {
    for (const code of ["engine.cancelled", "engine.no_covering_bbox", "engine.query"]) {
      const f = formatTerminalRefusal(`${code}: something the operator should read`);
      expect(f.code).toBe(code);
      expect(f.message).toBe("something the operator should read");
    }
  });
});
