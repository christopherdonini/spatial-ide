> **Status: consult — the architect's ADR-029 / operation-lifecycle consult of 2026-09-13, for the human's sight.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Architect consult — ADR-029 and the operation lifecycle: the decision draft for the human's sight

*Consult of 2026-09-13 on the custodian's brief under the human's directive ("ADR-029 + operation lifecycle: architect consult, then the decision draft for my sight (quantity, carrier, refusal shape; non-authorising operation id beside the handle, never derived from it; no data-plane change)"). Filed verbatim from the architect agent's report (HTML entities restored). **Nothing here binds.** ADR-029 stays Proposed ("decision deliberately undrafted") until the human's word; the three routed questions for the human are DECISIONS-PENDING entry 92.*

---

## Verdict

**Pass with notes** — the requested shape (control-plane carrier, non-authorising id, no data-plane change) is constitutionally sound; nothing in it violates 01, 02/10, ADR-004 Amd 4, ADR-006 or ADR-018. Two premises in the brief are wrong against the code and the draft below corrects them rather than smoothing them over (SKP-V0 §2's own "corrections recorded, not smoothed" discipline). Read-only; nothing written to `docs/adr/`.

**Correction C1 — "rows emitted" is identically zero across the window this debt names.** `StreamStats.rows_generated` (`engine/src/stream.rs:573`) counts *post-filter* rows, and the producer loop consumes DuckDB result chunks (`chunk.num_rows()`, `engine/src/stream.rs:1583`); a late-matching predicate yields no chunk at all until it matches. Rows emitted is an honest quantity, but it cannot discharge §4.5.

**Correction C2 — "row groups consumed" does not exist as a producer counter.** DuckDB owns the scan; the tree's only row-group knowledge is *plan-time* (`admitted_row_groups()` / `ranges_for`, `engine/src/stream.rs:1250-1274`) and is `None` when no index was built (`:1253`). It is a **denominator when present, never a numerator**. So the decision is gated on a feasibility check (gate G1 below) — ADR-029 must not be drafted as if the number already exists (principle 8; docs/08 "no numbers, no claim").

---

## Decision draft — for the human's sight (ADR-029 remains Proposed; this binds nothing)

**1. The quantity.**
- (a) It is a **monotone count of source-side work consumed, in whole declared units** — *row groups consumed* where a row-group plan supplies the unit, else *rows emitted* — because a count of completed units is checkable against the file itself, whereas a rate is not bounded on this path (ADR-018 item 4: a cadence bounds the quantity it actually bounds and becomes a time bound only if the rate is bounded; `docs/adr/ADR-018-…:80-88`).
- (b) It **never decreases and never resets within one operation**, because a reading that moves backwards is a staleness hazard of the class ADR-010 rule 5 forbids serving silently (`docs/adr/ADR-010-…:68`).
- (c) The **total is carried only when the footer/plan declares one, absent otherwise, never estimated**, because `describe.row_count` already ships `{ basis, value }` rather than a bare integer (`protocol/skp/SKP-V0.md:71`, correction C2 at `:126-129`) and the residency status already degrades its wording rather than guess a total (`frontends/shell/src/residency/residencyStatus.ts:62-70`) — one denominator discipline, not two.
- (d) **No ETA, no rate, no elapsed-since-first-row, and no percentage without a declared denominator** is produced or derived from the pair on either side of the wire, because ADR-018 forbids presenting a unit cadence as a time bound; the publish path already carries `bytes_done`/`bytes_total` under exactly this rule (`frontends/shell/src-tauri/src/publish.rs:752-758`).

**2. The carrier.**
- (a) It is a **control-plane read, polled by the client — a sixth SKP command, not a server→client push**, because SKP declares *no* control-plane push in any form (§4 item 7, `SKP-V0.md:216`) and *no* control-plane backpressure (§4 item 6, `:214-215`): a producer-driven progress stream into an uncredited channel is a principle-7 hazard, not its cure, and docs/10 already assigns progress to the control plane (`docs/10_SKP_Protocol.md:16`).
- (b) **No data-plane change**: `TAG_PROGRESS` keeps its post-batch meaning and payload (`protocol/data-plane/src/adapter_ws.rs:249-252`), so ADR-004 Amendment 4 and the JSON-free hot path stand untouched.
- (c) **Cadence is a declared client-side constant — one round trip per interval, never per batch, never per row** — a class-(a) cadence declared in the units it bounds (ADR-018 item 4), declared not discovered (ADR-010 rule 6, `ADR-010-…:70-72`).
- (d) **A poll performs no engine work**: it reads an atomic the producer already stores at the chunk seam; no filesystem read, no query, no lease — the same reason the source-descriptor post-check is kept off the batch loop (`engine/ADMISSION-PREREGISTRATION.md:248`).

**3. The refusal shape** *(deviates from the brief; see routed question Q1)*.
- (a) **Unknown and finished are typed *states*, not errors**: `{ state: "scanning" | "finished" | "unknown" }`, mirroring `cancel`'s own `{ requested | unknown | already_terminal }` (`SKP-V0.md:97`), because a poll racing a terminal is an ordinary outcome and teaching clients to treat it as a failure manufactures exactly the noise the filter panel had to suppress.
- (b) **Genuine refusals stay typed in the `skp.*`/`engine.*` families with no wildcard arm** (`SKP-V0.md:273-275`): `skp.version_unsupported`, `skp.malformed_operation_id`, and `engine.source_changed` for a dataset in an invalidated generation (`ADMISSION-PREREGISTRATION.md:248,250`) — never a `String` catch-all, never flattened to "failed".
- (c) **A source that cannot report returns the quantity *named absent*, never zero** (`units: "none"`, both counts omitted), because a zero reads as "no progress made" and that is a false claim (principle 8).

**4. The non-authorising operation id.**
- (a) It is **kernel-minted beside the stream handle at ticket mint** (`kernel/src/skp.rs:137-162`), held in the ticket state, and returned beside `stream` in the `viewport_query` response (`kernel/src/skp.rs:405`).
- (b) It is **an independent OS-CSPRNG draw, never derived from the handle** — not a hash, prefix, truncation or lockstep counter — because possession of the handle is what authorises data to flow and cancel (`SKP-V0.md:141-142`; `kernel/src/skp.rs:203-225`), so any derivation puts that authority one computation away from a string built for display.
- (c) It **authorises nothing**: `cancel` continues to parse only `StreamHandle` or `CancelKey` (`kernel/src/skp.rs:413`), and an operation id offered to it returns `unknown`. The publish path deliberately does the opposite (`RunningPublishes` keyed by `attempt_id`, `publish.rs:888-897`); that is a binding-local class-3 surface and is **not** the precedent to copy.
- (d) **It is not trace context** (ADR-004 Amendment 4): it correlates progress lines to one operation inside one session, carries no span/counter/timing state, is session-scoped and non-persistable like every other handle (`SKP-V0.md:150-152`), is never joined to producer-side spans on the wire, and `kernel/tests/wire_bytes_invariant.rs` gains its own case for this operation class (Amendment 4: "proven for one operation class, not for 'all'").
- (e) **Why it exists at all**: the handle already reaches human-visible text (`frontends/shell/src/diagnostics/renderTrace.ts:33-35`) and ADR-027 class A displays the exact serialized SKP request, copyable (`ADR-027-…:30`) — a progress surface keyed on the handle would put a bearer token in copyable console text.

**5. What the shell does with it.** Liveness as today **plus the counted quantity in words — no bar, no percentage, no ETA**; the sentence this decision changes is ADR-029's Consequences line "a zero-batch filtered scan continues to show indeterminate liveness only, never a percentage or a count", and it changes **only** for the count. `scanLivenessText`'s `"Filtering — scanning, no matching rows yet"` (`frontends/shell/src/App.tsx:485-491`) gains counted units when a reading exists; when none exists the string is unchanged. Final wording is the human's own string sight, the entry-35/36 precedent.

**6. The version consequence.** A new command plus edits to §4 items 1, 5, 7 and 13 is a wire change and takes **its own literal — `skp/0.5`, not folded into 0.3 or 0.4** — because §13 E closes 0.3 at Brief A's merge and gives 0.4 to Brief B (`engine/ADMISSION-PREREGISTRATION.md:252`), and folding a larger surface into an unmerged literal would re-run the four-condition within-version assembly that §4 item 13 only narrowly permits (`SKP-V0.md:243-252`). Plain `==`, `deny_unknown_fields` both directions, **every fixture on both the Rust and TypeScript sides in the same commit**, an appended §8 entry listing the version's full field set; §4 items 1/5/7/13 updated **in place**, never rewritten, and item 5's debt entry closed by name.

**7. What this does not decide.** MCP exposure (control-plane eligibility is not exposure; ADR-004's adapter rule is untouched, and MCP never becomes a bulk path); publish progress (already shipped binding-local, `publish.rs:740` — unchanged); undo (a scan is ADR-006 class 1, pure — nothing here becomes a workspace mutation or a side effect, and the operation id is never an undo handle); the `open_dataset` progress shortfall (`SKP-V0.md:47-48`) stays a named absence.

---

### Block-on-sight for the implementer
1. Any percentage, bar, ETA, rate or duration derived from the counts, in Rust, TS, a status string or a walkthrough row (ADR-018).
2. Any change to a data-plane frame, tag or payload — the diff under `protocol/data-plane/` must be empty (ADR-004 Amd 4; the human's "no data-plane change").
3. An operation id that is any function of the stream handle, or a `cancel`/redeem path that accepts one.
4. A server→client push, event or subscription added to the control plane without amending §4 item 7 in the same commit.
5. A `String` error, a wildcard `match` arm, or an invented "failed" code on the new command.
6. A wire literal bumped without both-side fixtures in the same commit, or a persisted/logged operation id.

### Acceptance gates
- **G1 (feasibility, first and blocking).** Verify against the vendored `duckdb` crate that a monotone scan-progress reading exists on the `read_parquet` path *before* any wire work; if it does not, the quantity question returns to the human — the §13 F conditional-escalation precedent (`ADMISSION-PREREGISTRATION.md:254`).
- **G2.** A test showing a zero-batch filtered scan produces a strictly increasing reading and a working cancel throughout (the ADR-021 condition, still binding).
- **G3.** `wire_bytes_invariant.rs` extended to the progress operation class, green with tracing on and off.
- **G4.** Poll-storm test: N polls against a running stream perform zero engine queries and zero filesystem reads.
- **G5.** Typed-refusal exhaustiveness test (no wildcard arm) and an unknown/terminal race test.
- **G6.** Operator walkthrough part: the counted words shown, no bar, no ETA, cancel still works.

### Open questions routed
- **Q1 → human.** States-vs-codes for unknown/finished (draft point 3a departs from the directive's "typed codes for all three"); the `cancel` precedent argues for states, the directive for codes.
- **Q2 → human.** The literal: own `skp/0.5` (recommended) vs folding into 0.4.
- **Q3 → human.** The liveness string wording (the 24(b) string-sight route).
- **Q4 → architect, at P0.** Whether the unit is row groups or rows when both are available — decide once, declare it in the response, never mix within one operation.

**Files read for this consult:** `docs/adr/ADR-029-scan-progress-carrier-quantity.md`, `ADR-004-skp-control-data-plane-mcp-adapter.md`, `ADR-018-what-cancellation-acknowledged-means.md`, `ADR-006-lineage-undo-side-effects.md`, `ADR-010-render-frames-origins-boundaries.md`, `ADR-027-action-console-and-display-truth.md`, `docs/01_Principles.md`, `docs/10_SKP_Protocol.md`, `docs/08_Testing.md`, `protocol/skp/SKP-V0.md`, `protocol/data-plane/src/adapter_ws.rs`, `kernel/src/skp.rs`, `engine/src/stream.rs`, `engine/ADMISSION-PREREGISTRATION.md`, `frontends/shell/src/residency/residencyStatus.ts`, `frontends/shell/src/diagnostics/renderTrace.ts`, `frontends/shell/src/streaming/viewportStreamManager.ts`, `frontends/shell/src/App.tsx`, `frontends/shell/src-tauri/src/publish.rs`.
