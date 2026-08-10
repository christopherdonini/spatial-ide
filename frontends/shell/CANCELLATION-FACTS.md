# Cancellation facts and acceptance record — `frontends/shell` cut 1

What this cut's own tests actually showed about cancellation, in the ADR-018 vocabulary — not a
redefinition of `kernel/CANCELLATION-AND-TRACING.md`'s frozen semantics, an application of them to
supersede-on-pan — plus the acceptance-list validation record for `docs/07`'s Prototype-completion
arc, cut 1.

Authority: ADR-018 (Accepted — cancellation instants), `kernel/CANCELLATION-AND-TRACING.md` (the
frozen three-instant vocabulary this cut exercises). **ADR-019 is Proposed, not Accepted — it binds
nothing and is cited below only as the description of the mechanism this cut actually implements
and tested, never as settled design or a review-blocking authority** (the same qualification
`docs/07` requires for ADR-011).

## 1. Supersede-on-pan's cancellation reaches the producer directly — confirmed in-situ

`ViewportStreamManager.supersedeCurrent()` (TypeScript) calls the SKP `cancel` command on the
previous stream's handle before issuing the next `viewport_query`. On the kernel side that is
`SkpHost::cancel` → `StreamRegistry::cancel` → the ticket's own `Arc<dyn SourceCancel>` →
`EngineCancel::cancel` → `CancelToken::cancel()` → DuckDB's `InterruptHandle` — the **same**
`CancelToken` a data-plane `TAG_CANCEL` frame would reach, per ADR-019's Consequences section
("the two mechanisms … now converge on the same token instead of being two independent,
unreconciled paths"). There is no second, independent cancellation path for the SKP route to
diverge from.

`kernel/tests/skp_admission.rs::cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock`
proves this is not merely wired but *observed*: it mints a ticket against a real 200,000-feature
fixture, starves it to scarce credit so the producer is genuinely mid-flight, calls `SkpHost::cancel`,
and reads back `trace::CANCELLATION_REQUESTED` and `trace::PRODUCER_CANCELLED` — the producer's own
clock, not the test's inference from a closed socket. The wire-level consequence is asserted too: an
SKP-cancelled ticket stream ends in `TERM_PRODUCER_FAILED`, not `TERM_CANCELLED`, because the cancel
reached the engine directly rather than through a data-plane control frame — a distinguishing,
checkable fact about *which* of the two converging paths fired on a given run.

On the TypeScript side, "zero batches from a superseded stream render" is the composition of two
separately-asserted facts, not one: `viewportStreamManager.test.ts` asserts a batch arriving late
from an already-superseded stream is never forwarded to `onBatch`; `residentSet.test.ts` asserts
`clearStream` actually removes that stream's batches from what `buildLayers` reads. `App.tsx` wires
`ViewportStreamManager`'s `onSuperseded` callback directly to `WorkingCanvas.clearStream`, so the two
tested facts compose into the acceptance claim rather than merely sitting beside it.

## 2. An empirical finding: `cancel_requested` and `cancel_observed` can invert by nanoseconds

While hardening the test in §1, it flaked. Recorded instances in this environment: the first time
this test was run (before any retry logic existed), `cancel_observed` at 12,842,000 ns was stamped
before `cancel_requested` at 12,842,500 ns — 500 ns earlier. After adding the retry logic described
below, a batch of 8 consecutive runs reproduced it once more, an identical 500 ns inversion
(`requested 12837000 ns, observed 12836500 ns`) that the retry then resampled successfully. Two
inversions observed across roughly 14 runs total in this environment — not a precise rate, but
enough to call it real and recurring rather than a one-off.

**Root cause, read from the source, not guessed:** `CancelToken::cancel_inner`
(`engine/src/cancel.rs`) does

```rust
let already = self.inner.cancelled.swap(true, Ordering::SeqCst); // publishes the flag
if stamp && !already {
    crate::trace::mark(crate::trace::CANCELLATION_REQUESTED, 0, 0); // stamps afterward
}
```

The atomic swap is what makes `cancelled == true` visible to the producer thread; the trace stamp
for `cancel_requested` happens *after* that publish, not before or atomically with it. A producer
thread polling `cancel.is_cancelled()` can observe the new flag and record its own
`PRODUCER_CANCELLED` stamp inside the window between the swap and the requester's own
`Instant::now()` read — occasionally winning the race to the clock.

**This is a fact about the instrument, not about cancellation reach.** On every one of the runs that
hit it, the interrupt still fired and the producer still stopped advancing — cancellation worked.
Only the *recorded relative order* of two trace stamps was wrong, on a nanosecond scale far below
any budget `docs/08` states (100 ms).

**Deliberately not fixed here.** A correct fix needs the stamp captured before the flag is published
and, since a duplicate cancel must still stamp at most once, that likely means gating the stamp on a
timestamp-capture separate from the flag itself — a change to `engine/src/cancel.rs` and plausibly
`engine/src/trace.rs`'s `mark`/`push` API, both of which are core, cancellation-instant-defining
infrastructure that deserves its own dedicated review regardless of what else is in flight.
`engine/src/trace.rs` is additionally in the direct path of the currently active query-window-
attribution measurement effort (`kernel/RESULTS.md`'s recent sections; see the git history around
`sql_built`/`producer_started`/`execute_called`) — `engine/src/cancel.rs` itself is not touched by
that effort's recent commits, but changing the trace API it would need to share the fix with is the
same risk either way. This cut does not own either file and should not risk a change to both mid-
flight. `kernel/tests/skp_admission.rs`'s own test now retries (up to 5 attempts) specifically on
this one known, understood race — documented at the retry site — rather than asserting something
weaker or silently tolerating the wrong order. Every other assertion in that test still fails outright
on a first attempt; only this one known inversion is resampled.

**Follow-up, not scoped to this cut:** fixing `CancelToken::cancel_inner`'s stamp ordering belongs to
whoever next has a reason to touch `engine/src/cancel.rs` or `engine/src/trace.rs`'s `mark`/`push`
API — not to this cut, which needs neither file to change for anything it builds.

## 3. Known limitations carried out of the reviewer pass, named rather than silently dropped

None of these block this cut's acceptance list; all are either inherent to the platform, contingent
on a measurement campaign this cut does not run, or a scope boundary NEXT-CUT.md itself drew.

| Item | What it is | Why it stays open |
|---|---|---|
| Cancel-open UI coverage | No UI affordance cancels an in-flight `open_dataset` — `AdmissionPanel` mints a `cancelKey` on every pick but never calls SKP `cancel` with it. The mechanism exists at the SKP layer (`OpenRegistry::begin`/`cancel`, `SkpError::cancel_key_in_use`), but only the key's own string format is actually tested (`protocol/skp/src/v0/handles.rs`'s `cancel_keys_accept_the_declared_alphabet_and_length`) — "cancel actually stops an in-flight open" has no test anywhere | A local-file open is fast enough that this cut's brief did not ask for a cancel button; building one is new UI scope, not a fix |
| `malformed_hex_f64` / `bbox_not_finite` unreachable from the shell | Tauri's own `serde` argument deserialization rejects a malformed request before it reaches `SkpHost`, so these two `SkpError` constructors have no live call site from this binding, and no fixture or test exercises them either — `protocol/skp/tests/data/` carries exactly one error fixture, for `engine.crs_undeclared` | Inherent to Tauri's IPC argument decoding, not a gap in `protocol/skp`; the two constructors stay defined (`protocol/skp/src/v0/error.rs`) for any future non-Tauri SKP transport that could actually reach them |
| `buildLayers` rebuilds every resident batch's rings from scratch on every batch arrival | O(total resident vertices) work per arrival, not O(batches) and not incremental — `render()` runs on every `pushBatch` and re-derives every vertex of every resident batch through `frame.toLocal` | No measurement exists yet showing this costs anything at `docs/08`'s scale; changing it without a measurement would be optimizing a number nobody has taken |
| `.canvas-container` used a hardcoded `top: 12rem` absolute offset | A sufficiently tall admission or refusal panel (both plausible: `DescribeSummary`'s 7-field list, or a refusal's message + fields + cut-2 note) could exceed 12rem and be painted over by the canvas layered on top | **Fixed this cut**, not carried forward: `.app-main` is now a column flex container and `.canvas-container` is a `flex: 1; min-height: 0` sibling that takes remaining space instead of overlaying a fixed offset |
| `tauri.conf.json`'s `security.csp` stays `null` | `withGlobalTauri` was narrowed to `false` this cut (confirmed unused — every call goes through `@tauri-apps/api/core`), but a correct CSP needs `connect-src` covering the data-plane's *ephemeral* WebSocket port (`ws://127.0.0.1:<port>`, chosen per session) and Tauri's own required `ipc:`/`http://ipc.localhost` allowance, verified against a live run | Setting one blind risks silently breaking IPC or the data-plane socket with no automated check able to catch it (CSP is WebView-enforced at runtime, invisible to `tsc`/`vitest`) — needs a live pass, tracked as follow-up rather than guessed at |

## 4. Acceptance-list validation record

`NEXT-CUT.md` (the cut brief this record validates against) was never committed to this repository
at any point — it lived only as an untracked working-tree file, so its removal is not itself a
diff git can show. Per its own status line ("transient; deleted by the final docs commit"), it is
deleted from the working tree as part of this same change; its full verbatim text is preserved in
the Appendix below rather than being lost when the file goes.

**Automated (bullets 3–7 of the Appendix's Acceptance list — "assert/test, not claim"), validated
by the `tester` agent against a fresh run of both suites (`cargo test --workspace`; `npm run
verify` in `frontends/shell`); bullets 1–2 are the operator-verified items further down:**

- **Bullet 3 — pan issues supersede, producer-observed, zero stale renders** — §1 above; PASS.
- **Bullet 4 — hover resolves through stable id lookup; no `info.coordinate` reaches the UI** —
  `canvas/pick.test.ts` (ordinal→id lookup) and `canvas/noCoordinateLeak.test.ts` (a static scan
  across dot, bracket, and destructuring access, not only the dot-notation case reviewed earlier);
  PASS.
- **Bullet 5 — global handlers + watchdog catch an injected async error** —
  `diagnostics/errorHandlers.test.ts` (an injected `unhandledrejection` banners and logs) and
  `diagnostics/watchdog.test.ts` (a stalled phase is named); PASS.
- **Bullet 6 — SKP v0 design note with named-deferral list; ADR-001 amendment appended** —
  `protocol/skp/SKP-V0.md` §4 lists 13 explicit deferrals plus "no conformance suite"; the amendment
  to `docs/adr/ADR-001-frontend-stack.md` is a pure append (28 added lines, 0 removed) naming
  React + TypeScript. Doc-only, no test expected; PASS by direct read.
- **Bullet 7 — lockfile diffs: npm as reviewed and confirmed; cargo empty.** **Not a clean PASS as
  literally written — recorded as a named deviation, not glossed over.** The brief's own elaboration
  (line 17: "Cargo dependencies: none new (lockfile diff empty on the Rust side)") reads as an
  unqualified claim about the Rust side as a whole. What's actually true: the root workspace's
  `Cargo.lock` — the one `kernel`, `engine`, `renderer` and the pre-existing `protocol/data-plane`
  share — gains only one new internal package (`spatial-skp`) whose own dependencies (`getrandom`,
  `hex`, `serde`, `serde_json`) already existed in that lockfile; no new third-party crate entered
  the pre-existing workspace. But `frontends/shell/src-tauri/Cargo.lock` is a **new, separate**
  6,064-line lockfile carrying a large new third-party Rust dependency tree — `tauri` itself,
  `tauri-plugin-dialog`, `webview2-com`, and everything under them — because building a Tauri
  desktop shell at all requires them. That is a substantial new Rust dependency footprint by any
  literal reading of "cargo empty," even though it is architecturally isolated (its own crate,
  excluded from the root workspace, its own lockfile) rather than folded into the product's existing
  dependency graph. **Nobody has explicitly confirmed that isolation satisfies the brief's intent**
  the way the npm install had its own explicit human confirmation step — this record surfaces the
  gap rather than assuming the answer. `frontends/shell/package-lock.json` (+4,653 lines) *is*
  covered by that npm confirmation and is not in question.

**Operator-verified (bullets 1–2 — a live click-through), evidence class stated explicitly because
it differs from the above:** `MANUAL-WALKTHROUGH.md` in this directory is the scripted procedure —
exact numbered steps, expected outcome per step, and the three fixture files it uses (a 100k happy
path, a no-CRS refusal, a missing-identity refusal — generated by
`kernel/tests/manual_walkthrough_fixtures.rs`, run on demand, not committed as binary files). Running
it and recording pass/fail per step in that document's own result log is what closes these two items;
neither is claimed satisfied by this commit alone.

**Desktop UI automation (`tauri-driver`/WebDriver) is deferred, not attempted, for these two items —
see `MANUAL-WALKTHROUGH.md`'s own header for the full reasoning.** In short: the file picker is a
native OS dialog outside the WebView2 DOM that no WebDriver setup can click into regardless, and
standing up the DOM-reachable half (canvas/admission/pan/zoom/hover) is a new dependency and download
unscoped in `NEXT-CUT.md` — worth building once shell E2E regressions are a real, recurring risk, not
before the shell has a first cut to regress.

## Appendix — `NEXT-CUT.md`, verbatim, as last present on disk

Never committed to this repository as its own file; preserved here in full because it is deleted
from the working tree, as part of this same change, per its own status line.

> # Cut brief — the shell, cut 1 of 3: the walking skeleton speaks SKP
>
> **Status:** implementation brief — transient; deleted by the final docs commit.
> **Arc:** cut 1 of the Prototype-completion arc (skeleton → workflow → publish exposure). This cut
> ends with a real application a person can open, point at a GeoParquet, and pan around in — nothing
> more, and honestly nothing less.
> **Decisions already made by the human (record, do not reopen):** the frontend framework is
> **React + TypeScript** — closing the question ADR-001 deliberately left open; the session appends a
> dated amendment to ADR-001 recording it as the human's 2026-08-09 decision. The working canvas is
> **deck.gl on the ADR-003 projected working canvas, from day one**. The existing Canvas2D renderer
> remains **exclusively the projected publishing canvas**: its schemas and semantic contracts may be
> reused, its renderer implementation is not promoted — the two canvases share a coordinate
> discipline and nothing else, per the ADR-003 amendment's own words.
> **⚠ Bandwidth, read first:** this is the first cut that genuinely downloads — React, deck.gl and
> their trees are new npm dependencies (likely 100 MB+). **The npm install step must be a single,
> separately-runnable step at the start, confirmed with the human before it runs.** Everything after
> it is local. Cargo dependencies: none new (lockfile diff empty on the Rust side).
>
> ## What this cut builds
>
> `frontends/shell/` — a Tauri + React + TypeScript application:
>
> 1. **Open a dataset** through the real admission flow. A file picker, then `Dataset::open`'s
>    verdict rendered as the product truth: success shows schema, bounds, feature count; **every
>    typed refusal (`CrsUndeclared`, `CrsAssertionConflict`, `AxisOrder*`, identity refusals) is
>    displayed with its full reason** — the refusal UX *is* the feature; remediation flows
>    (caller-asserted CRS, identity mapping selection) are cut-2 work, named as such in the UI copy.
> 2. **The working canvas**: deck.gl `OrthographicView` in the dataset's source CRS, productizing the
>    spike's validated disciplines as code, not lore — offset-relative rendering with the
>    **offset-dynamic origin policy** (f64 subtraction CPU-side before f32 upload, ADR-010 rule 3);
>    picking via **GPU ordinal → stable id → host-side f64 lookup** (rule 2), with `info.coordinate`
>    treated as renderer-internal and never crossing (rule 1); the **24-bit picking ceiling declared**
>    where the layer is constructed (rule 6); **global `error`/`unhandledrejection` handlers and a
>    watchdog wired at app start** (rule 7 — mandatory in a long-lived session, and this is the first
>    one).
> 3. **Viewport-driven streaming with supersede-on-pan**: pan/zoom issues a new viewport query and
>    **cancels the superseded stream** — producer-visible, `requested → observed` per ADR-018's
>    vocabulary. This is the product's real concurrency shape, and its instrument records are the
>    **in-situ evidence ADR-012 has waited for** (Candidate A runs as the experimental default per
>    ADR-012's preregistered inconclusive branch — state that in the design note; nothing here
>    accepts ADR-012).
> 4. **SKP v0, architect-first.** The minimal semantic command set the skeleton needs — `open_dataset`
>    · `describe` · `viewport_query` (returns a stream handle; data flows on the data plane) ·
>    `cancel` · `close_dataset` — defined against docs/10's checklist **with a mandatory named-deferral
>    list** for everything not satisfied (capability discovery, version negotiation beyond a version
>    field, idempotency, subscriptions, schema evolution). Control plane over Tauri invoke with
>    **bit-critical scalars hex-encoded** (ADR-004 amendment 1); data plane over the existing
>    WebSocket adapter, token via subprotocol, loopback-only — no security posture change. The
>    existing H-gate assertions become the **seed of docs/10's conformance suite**, stated as such.
>    Errors cross the boundary as the typed errors they already are — the error taxonomy is the
>    existing one, surfaced, not a new invention.
>
> ## Constraints, all binding
>
> - **Instrument surface is never an SKP field** (ADR-004 Amendment 4) — the wire-bytes invariant
>   test must remain green with the shell's traffic; supersede/cancel instrumentation is
>   producer-side artifacts and shell-side logs, joined off the wire.
> - **The publish operation is not exposed.** Cut 3 is the exposure surface and its ADR-017 gate
>   review; until then the shell contains no publish affordance — not a disabled button, *nothing*.
> - **No measurement campaign.** Correctness cut. The one number recorded as a fact: supersede-on-pan
>   cancellation `requested → observed` from the shell's real usage, reported with ADR-018 labels,
>   no budget verdict claimed from ad-hoc usage.
> - Style: none in cut 1 — a fixed default renders everything one way; the style panel is cut 2.
> - Window title and app identity: "Spatial IDE" per the docs/14 trademark stub (working title).
> - CI: the architect places shell coverage (extend the viewer workflow or a third product workflow);
>   typecheck + build + tests on the shell package, with the standing not-a-gate note until its first
>   green run.
>
> ## Workflow
>
> Architect first — it settles: SKP v0's command/response shapes and the named-deferral list; the
> shell↔kernel process topology (which process owns the engine, how the WS endpoint hands off);
> the deck.gl layer construction against rules 1/2/3/6/7 with the origin policy named; the CI
> placement; and **the ADR-001 amendment text** (React + TypeScript, human's decision, dated).
> Then: npm-install step (human-confirmed, once) → implement → deterministic tests where they apply
> (admission rendering from typed errors, supersede-cancel correctness, wire-bytes green, id-lookup
> hover) → reviewer over code → tester validates the acceptance list → reviewer over the write-up →
> `git status --porcelain` clean except known untracked → PR, all triggered workflows green.
>
> ## Acceptance
>
> - The app opens the 100k fixture end-to-end: picker → admission → canvas → pan/zoom/hover.
> - A refusing file (no CRS; missing identity) shows its typed refusal verbatim-faithful.
> - Pan issues supersede: the old stream's cancellation is producer-observed; zero batches from a
>   superseded stream render after its supersession (assert, don't eyeball).
> - Hover resolves through stable id lookup; no coordinate from `info.coordinate` ever reaches the UI.
> - Global handlers + watchdog demonstrably catch an injected async error (test, not claim).
> - SKP v0 design note committed with the named-deferral list; ADR-001 amendment appended.
> - Lockfile diffs: npm as reviewed and confirmed; cargo empty.
>
> Recommended commit separation:
>
> 1. `docs: SKP v0 — the skeleton's command set and its named deferrals; ADR-001 amendment (React)`
> 2. `feat: shell scaffold — Tauri + React, global handlers, watchdog, CI coverage`
> 3. `feat: open/describe through SKP — the admission flow as product truth`
> 4. `feat: the working canvas — deck.gl projected view, offset-dynamic, id-lookup hover`
> 5. `feat: viewport streaming with supersede-on-pan cancellation`
> 6. `docs: design note, in-situ cancellation facts, cleanup`
