// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { isSourceChangedTerminal, LiveTicketSet, SOURCE_CHANGED_CODE } from "./liveTicketSet";

/**
 * The client half of Brief A boundary 4, unit-tested on its own terms.
 *
 * **This is not G-A3.** That gate asserts a *delivered* late batch is dropped and never rendered,
 * end to end with a delayed batch, and it is P5's. What is asserted here is the mirror's own rule:
 * admit at mint, drop what is not live, clear everything on invalidation.
 */
describe("the live-ticket mirror of the dataset-session generation", () => {
  it("admits a minted ticket and drops one it has never seen (fails closed)", () => {
    const live = new LiveTicketSet();
    live.admit("sh_a");
    expect(live.isLive("sh_a")).toBe(true);
    // An unknown handle is not admitted on the grounds that nobody said otherwise.
    expect(live.isLive("sh_never_minted")).toBe(false);
  });

  it("drops every ticket on invalidation, including ones minted before the change was seen", () => {
    const live = new LiveTicketSet();
    live.admit("sh_a");
    live.admit("sh_b");
    expect(live.size).toBe(2);

    live.invalidate();

    // The generation is per dataset-session, so invalidation ends all of them at once -- a batch
    // still in flight on the wire for either handle is refused after this point.
    expect(live.isLive("sh_a")).toBe(false);
    expect(live.isLive("sh_b")).toBe(false);
    expect(live.size).toBe(0);
  });

  it("retires one finished ticket without touching the others", () => {
    const live = new LiveTicketSet();
    live.admit("sh_a");
    live.admit("sh_b");
    live.retire("sh_a");
    expect(live.isLive("sh_a")).toBe(false);
    expect(live.isLive("sh_b")).toBe(true);
  });

  it("recognises the session-ending terminal by its typed code and not by its wording", () => {
    expect(
      isSourceChangedTerminal({
        kind: "ProducerFailed",
        detail: `${SOURCE_CHANGED_CODE}: refused: the source file changed while it was open ({size})`,
      })
    ).toBe(true);
    // An ordinary cancel is not a source change -- the whole point of §13 C rule (ii).
    expect(isSourceChangedTerminal({ kind: "Cancelled", detail: "cancelled" })).toBe(false);
    // And prose that merely mentions a change is not the code.
    expect(
      isSourceChangedTerminal({ kind: "ProducerFailed", detail: "engine.query: the source changed" })
    ).toBe(false);
  });

  it("carries no generation value anywhere -- the client is never told one", () => {
    const live = new LiveTicketSet();
    live.admit("sh_a");
    // The mirror's whole surface is handles and a count. There is no method, field or argument
    // through which a generation value could reach this client (boundary 9, A2).
    const surface = Object.getOwnPropertyNames(Object.getPrototypeOf(live)).join(" ");
    expect(surface).not.toContain("generation");
    expect(JSON.stringify(live)).not.toContain("generation");
  });
});
