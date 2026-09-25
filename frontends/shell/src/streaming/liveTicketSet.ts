// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **The client half of the dataset-session generation, mirrored by live-ticket set** --
 * `engine/ADMISSION-PREREGISTRATION.md` §13 D, and Brief A settled boundary 4's "every batch is
 * attributed to a generation via its ticket; the client drops any batch whose ticket belongs to an
 * invalidated generation".
 *
 * **Why a set of handles and not a generation number.** The generation value must not cross the
 * wire (boundary 9; block-on-sight A2/A3), so this client cannot be told one. It does not need
 * one: a ticket minted under the live generation is admitted to this set at mint time, and
 * invalidation clears the set. After that, "is this batch's ticket in the set" answers exactly the
 * question "does this batch belong to the live generation" -- without a value, without a new wire
 * field, and without the data plane changing at all.
 *
 * **Both sides fail closed independently.** The kernel is authoritative and refuses new tickets
 * under an invalidated generation on its own; this set is not a substitute for that check and does
 * not depend on it. A batch whose ticket is unknown here is dropped, which is the fail-closed
 * direction: an unrecognised ticket is never admitted on the grounds that nobody said otherwise
 * (`docs/01` principle 8).
 *
 * **It carries no claim about snapshots.** Dropping late batches is detection of a *detected*
 * change, not a guarantee that what stayed on the canvas came from one unchanging file.
 */
import { SkpCallError } from "../skp/client";
import type { Terminal } from "./transport";

/**
 * The typed refusal codes that end a dataset-session generation
 * (minted by `kernel/src/skp.rs`'s `error_of` table for `EngineError::SourceChanged` and
 * `EngineError::SourceCoverageLost`, and put on the terminal by `terminal_detail_of` in that same
 * file).
 *
 * **Matched on the code, not on prose.** `Terminal.detail` is `"<code>: <display>"` --
 * `kernel/src/skp.rs::terminal_detail_of`, applied at `kernel/src/lib.rs`'s
 * `EngineSource::next_into`, which is the single place a typed `EngineError` becomes the `String`
 * the data-plane terminal carries. A client deciding by reading the message's wording would break
 * the moment that wording changes, which it will: those strings are the human's at P6.
 *
 * The prefix is why this works at all. Before it, the detail was the `Display` text alone and this
 * predicate could never fire (P3 gate attempt 1, blocking finding 1).
 */
const SOURCE_CHANGED_CODE = "engine.source_changed";
/** `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b: the advisory watch's own refusal code, on the
 * session-ended family too, but never `engine.source_changed` (block-on-sight 3). */
const SOURCE_COVERAGE_LOST_CODE = "engine.source_coverage_lost";

/**
 * Whether this terminal is the kernel telling the client its session ended -- either because the
 * source was observed to have changed, or because the advisory watch lost coverage of it
 * (`isSourceChangedTerminal`/`isSourceChangedRefusal`, renamed for the second reason; §2d).
 *
 * Anchored to the **start** of the detail, not searched anywhere in it: the code is a prefix by
 * construction, and a substring match would also fire on a different refusal that happened to
 * quote this code in its prose.
 */
export function isSessionEndedTerminal(terminal: Terminal): boolean {
  return (
    terminal.detail.startsWith(`${SOURCE_CHANGED_CODE}: `) ||
    terminal.detail.startsWith(`${SOURCE_COVERAGE_LOST_CODE}: `)
  );
}

/**
 * Whether this thrown SKP error is the **pre-check's** half of the same fact (P3b §2b).
 *
 * G-A2's own wording requires both routes -- *"Asserted at the pre-check and at the post-check paths
 * separately"* (`engine/ADMISSION-PREREGISTRATION.md:221`). The post-check arrives as a data-plane
 * terminal (`isSessionEndedTerminal` above); the pre-check arrives synchronously, as a thrown
 * `SkpCallError`, from `viewport_query`'s own live-generation check (`kernel/src/skp.rs:797-803`)
 * and its mint-race arm (`:840-846`), reaching this client through `skp/client.ts:58-65`.
 *
 * **Matched on `.skpError.code`, never on prose** -- the precedent `RETRYABLE_ENGINE_CODE`/
 * `isRetryableRefusal` already sets (`tileViewportStreamManager.ts:316`/`:324`). The message's wording
 * is the human's at P6 and is not required to contain the code.
 */
export function isSessionEndedRefusal(err: unknown): boolean {
  return (
    err instanceof SkpCallError &&
    (err.skpError.code === SOURCE_CHANGED_CODE || err.skpError.code === SOURCE_COVERAGE_LOST_CODE)
  );
}

/**
 * The pre-check refusal, written in the **same shape the post-check's terminal already carries** --
 * `"<code>: <display>"` -- so an owner has exactly one thing to parse rather than two.
 *
 * This is not a re-spelling of the kernel's format: it is the same one. `terminal_detail_of` is
 * `format!("{}: {e}", error_of(e).code)` (`kernel/src/skp.rs:1136`), and `error_of`'s own
 * `message` is that same `Display` output, so `code + ": " + message` is byte-identical to the
 * terminal's `detail` for any given error. `liveTicketSet.test.ts` asserts that equality against
 * the two pinned real shapes rather than leaving it argued.
 */
export function refusalDetailOf(err: SkpCallError): string {
  return `${err.skpError.code}: ${err.skpError.message}`;
}

export class LiveTicketSet {
  private live = new Set<string>();

  /** Admit a freshly minted ticket. Called where `viewport_query` returns its handle. */
  admit(handle: string): void {
    this.live.add(handle);
  }

  /**
   * Whether this ticket still belongs to the live generation.
   *
   * Fails closed: an unknown handle is not live. A batch arriving for it is dropped rather than
   * rendered on the assumption that it must be fine.
   */
  isLive(handle: string): boolean {
    return this.live.has(handle);
  }

  /** Forget one ticket -- its stream reached a terminal, so no further batch for it is expected. */
  retire(handle: string): void {
    this.live.delete(handle);
  }

  /**
   * **Invalidation**: the source was observed to have changed, so no ticket minted before now
   * belongs to a live generation any more.
   *
   * Clearing the whole set is the point, not a shortcut: the generation is per dataset-session and
   * every ticket in this client was minted under it. A batch for any of them that arrives after
   * this call is dropped by `isLive` -- including one already in flight on the wire, which is the
   * late-batch case boundary 4 names.
   */
  invalidate(): void {
    this.live.clear();
  }

  /**
   * How many tickets are live.
   *
   * **An instrument: its only caller is the test suite.** It is not stripped from the shipped build
   * for the reason the engine's own counters are not (`index_consultations` and its siblings): what
   * `liveTicketSet.test.ts` asserts -- that invalidation really empties the set -- is a property of
   * the code that runs, and a member present only under test would prove it about a build nobody
   * ships. It is never a rendering input and nothing branches on it.
   *
   * **Its caller, named so the caller-grep can verify this exemption instead of trusting the words
   * "test-only"** (the human's ruling of 2026-09-16, round 5 item 4):
   * `liveTicketSet.test.ts`'s "drops every ticket on invalidation, including ones minted before the
   * change was seen".
   */
  get size(): number {
    return this.live.size;
  }
}
