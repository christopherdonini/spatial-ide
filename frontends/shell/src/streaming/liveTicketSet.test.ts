// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { SkpCallError } from "../skp/client";
import type { SkpError } from "../skp/types";
import { REAL_SOURCE_CHANGED_TERMINAL_DETAIL } from "../testUtils/terminalShapes";
import {
  isSourceChangedRefusal,
  isSourceChangedTerminal,
  LiveTicketSet,
  refusalDetailOf,
} from "./liveTicketSet";

/**
 * The client half of Brief A boundary 4, unit-tested on its own terms.
 *
 * **This is not G-A3.** That gate asserts a *delivered* late batch is dropped and never rendered,
 * end to end with a delayed batch, and it is P5's. What is asserted here is the mirror's own rule:
 * admit at mint, drop what is not live, clear everything on invalidation.
 */
describe("the live-ticket mirror of the dataset-session generation", () => {
  // Mutation: make `isLive` return true for an unknown handle. Expected failure: "admits a minted
  // ticket and drops one it has never seen (fails closed)" fails -- the mirror would stop failing
  // closed, which is the property the whole type exists for.
  it("admits a minted ticket and drops one it has never seen (fails closed)", () => {
    const live = new LiveTicketSet();
    live.admit("sh_a");
    expect(live.isLive("sh_a")).toBe(true);
    // An unknown handle is not admitted on the grounds that nobody said otherwise.
    expect(live.isLive("sh_never_minted")).toBe(false);
  });

  // Mutation: have `invalidate` delete only the most recently admitted handle. Expected failure:
  // "drops every ticket on invalidation, including ones minted before the change was seen" fails
  // -- a generation is per dataset-session, not per ticket.
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

  // Mutation: make `retire` call `invalidate`. Expected failure: "retires one finished ticket
  // without touching the others" fails -- one stream completing would drop every sibling tile.
  it("retires one finished ticket without touching the others", () => {
    const live = new LiveTicketSet();
    live.admit("sh_a");
    live.admit("sh_b");
    live.retire("sh_a");
    expect(live.isLive("sh_a")).toBe(false);
    expect(live.isLive("sh_b")).toBe(true);
  });

  // Mutation: change `isSourceChangedTerminal` to search the detail for the words "source" and
  // "changed". Expected failure: "recognises the session-ending terminal by its typed code and
  // not by its wording" fails on its prose case.
  it("recognises the session-ending terminal by its typed code and not by its wording", () => {
    expect(
      isSourceChangedTerminal({
        kind: "ProducerFailed",
        // The literal, not a shared constant: the code is spelled independently here and in
        // `kernel/src/skp.rs`'s `error_of` table, so the two agreeing is evidence rather than
        // tautology. `kernel/tests/typed_terminal_codes.rs` pins the producing end.
        detail: "engine.source_changed: refused: the source file changed while it was open ({size})",
      })
    ).toBe(true);
    // An ordinary cancel is not a source change -- the whole point of §13 C rule (ii).
    expect(isSourceChangedTerminal({ kind: "Cancelled", detail: "cancelled" })).toBe(false);
    // And prose that merely mentions a change is not the code.
    expect(
      isSourceChangedTerminal({ kind: "ProducerFailed", detail: "engine.query: the source changed" })
    ).toBe(false);
  });

  // Mutation: add a `dataset_session_generation` field to `LiveTicketSet`. Expected failure:
  // "carries no generation value anywhere -- the client is never told one" fails, which is the
  // client-side half of block-on-sight A2.
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

/**
 * **P3b §2b: the pre-check's half of the same fact, and the shape both routes share.**
 *
 * The inputs are the two real producer shapes, never transcriptions: the kernel's pinned terminal
 * bytes (`REAL_SOURCE_CHANGED_TERMINAL_DETAIL`, exact-equality-asserted in
 * `kernel/tests/typed_terminal_codes.rs`) and the SKP wire fixture the Rust host round-trips
 * (`protocol/skp/tests/data/v0-error-source_changed.json`,
 * `protocol/skp/tests/fixtures.rs::the_new_typed_refusal_fixtures_round_trip_with_their_detail_fields`).
 */
describe("the pre-check refusal, and the one shape both routes carry", () => {
  function realSourceChangedError(): SkpError {
    const file = path.resolve(
      __dirname,
      "../../../../protocol/skp/tests/data/v0-error-source_changed.json"
    );
    return JSON.parse(fs.readFileSync(file, "utf-8")) as SkpError;
  }

  // RECORDED MUTATION for "matches the real thrown refusal on its code, never on its prose": change
  // `isSourceChangedRefusal` to test `err.message.includes("source file changed")`. Expected
  // failure: that test fails on the neighbouring-code assertion -- a refusal whose prose happens to
  // quote the sentence would match, and the code-carrying one whose wording changes at P6 would
  // stop matching.
  // OBSERVED: FAILED -- `AssertionError: expected true to be false`.
  it("matches the real thrown refusal on its code, never on its prose", () => {
    expect(isSourceChangedRefusal(new SkpCallError(realSourceChangedError()))).toBe(true);

    // A neighbouring engine refusal, and a non-SKP throw, are both false.
    expect(
      isSourceChangedRefusal(
        new SkpCallError({
          code: "engine.connections_exhausted",
          message: "refused: the source file changed while it was open (quoted in prose)",
          fields: {},
        })
      )
    ).toBe(false);
    expect(isSourceChangedRefusal(new Error("network died"))).toBe(false);
    expect(isSourceChangedRefusal(null)).toBe(false);
  });

  // RECORDED MUTATION for "the pre-check refusal and the post-check terminal are the same string":
  // change `refusalDetailOf` to `${err.skpError.code} - ${err.skpError.message}`. Expected failure:
  // that test fails on the byte-equality assertion -- and with it the claim that an owner has ONE
  // shape to parse rather than two.
  // OBSERVED: FAILED -- `AssertionError: expected 'engine.source_changed - refused: the …' to be
  // 'engine.source_changed: refused: the s…'`.
  it("the pre-check refusal and the post-check terminal are the same string", () => {
    const thrown = new SkpCallError(realSourceChangedError());
    expect(refusalDetailOf(thrown)).toBe(REAL_SOURCE_CHANGED_TERMINAL_DETAIL);
    // Which means the terminal matcher recognises it too: one predicate, both routes.
    expect(isSourceChangedTerminal({ kind: "ProducerFailed", detail: refusalDetailOf(thrown) })).toBe(
      true
    );
  });
});
