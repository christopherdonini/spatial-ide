# Entry 40 — the empirical producer pass: preregistration (2026-09-07, written before the instrument exists)

**Status: binding for the run it describes. Append-only; amendments dated; a post-result amendment
must say so in its first line.** Fired by the human's ruling of 2026-09-07 (DECISIONS-PENDING
entry 40, verbatim there): *"dispatch entry 40's empirical producer pass now, independently under
the 24(g) guard — it gates nothing and informs P1's later risk."* The design it executes is this
directory's `README.md` §2 ("The discriminating instrumented pass — designed, not run"); this file
adds only what a run needs that a design does not: the exact instrument, the exact run protocol,
and the pre-committed reading of every possible outcome. It measures nothing against docs/08 — no
row is added, no budget is claimed; every quantity is reported, none is scored.

## 1. The question, unchanged

One tile stream in the 2026-09-06 healthy-disk 5 GB trial never terminated (43 issued / 42
ended, in-flight stuck at 1, console silent 5 s+, 204 s to the watchdog; `frontends/shell/
RESULTS.md`, "Refinement, 2026-09-06"). Is that a **producer-query hang** (README rank 1: the
product path never consults the spatial index; no cancel-pollable chunk boundary inside
`arrow.next()`), or **something downstream of the engine** (ranks 2-4: WS receive path, credit
starvation, terminal-frame loss)? README §1 ranks; this pass discriminates.

## 2. The instrument (the one load-bearing addition, README §2 "what would need a small, real
product-code addition", item 2)

- **A periodic, timestamped poll of the engine pool's lease counts, written to the session log.**
  Every 1,000 ms while a dataset is open in the shell: `active_leases()`, `live_connections()`,
  `idle_connections()` (`engine/src/pool.rs`, the accessors README §2 cites as already existing and
  already polled this way by three kernel tests). Log line class `producer-pool-poll`, one line per
  tick, fields `active=<n> live=<n> idle=<n>`. Dev/measure-build-gated the same way the shell's
  other diagnostic-only lines are (docs/09's dev/debug-gate discipline); never in a plain
  production build.
- **A harness flag to let a stalled step run far past the watchdog** (README §2's "cheapest
  instrument of all"): `--per-step-watchdog-ms <n>` on `e2e/residency-harness.mjs`, honored by the
  settle watchdog for this pass only; the run below sets it to 3,600,000 (one hour). The overall
  watchdog and the rustdesk-guard backstop windows are set at least that long (README §2, run
  preconditions).
- **Optional depth, taken only if cheap:** wiring `StreamConnectionRecord` reporting into
  `frontends/shell/src-tauri` (README §2 item 1). If not taken, the pass says so; the pool poll
  alone is the load-bearing instrument.
- **Nothing else changes in product code.** The instrument is reviewer-gated as its own piece
  before the run; the run uses the reviewed commit and records its hash.

## 3. The run — exactly one cell

- Fixture `target/slice-evidence/scale-pass/parcels-5gb.parquet`, sha256 as recorded in
  `kernel/FIXTURES.md` (verified before the run; mismatch = hard stop, never regenerate).
- Candidate arm, `fine`, the same trace the 2026-09-06 refinement ran (`--smoke`'s trace or the
  attribution trial's, whichever the refinement used — the run's own record names it), with
  `--per-stream-trace` and the new per-step watchdog.
- **Unattended, reported-only, under the 2026-09-04 amendment to 24(g)**: both restore triggers
  armed before the kill and verified live (`arm-rustdesk-guard.ps1` → `{"armed":true,...}`), RustDesk
  stopped and verified absent, `check-display-session.ps1` → `ok:true` before the trial (else the
  cell is invalidated, never kept), heartbeat touched throughout, `disarm-rustdesk-guard.ps1` on
  completion; attest string exactly `"unattended, RustDesk stopped and verified absent,
  display-awake verified"`. The backstop's hard time bound is set past the one-hour step allowance.
- Preconditions: disk healthy (≥ 30 GB free); `CARGO_TARGET_DIR` = the main checkout's warm
  `src-tauri/target`; no other app instance holding the dev-server port; the machine free of the
  human's sitting (this pass never runs concurrently with a felt-verdict session).

## 4. Pre-committed readings (README §2 "what each signature convicts", made binding)

For the stalled tile stream, if one recurs:
- **(A)** lease counts never drop for the whole stall AND the shell process stays non-idle →
  **rank 1 convicted** (producer-query hang). Recommendation that follows: the producer path needs
  a cancel-pollable boundary and the spatial index consulted — P1's risk is REAL and the LOD cut
  must design around it.
- **(B)** lease counts drop back to baseline while the client's in-flight counter still reads 1 and
  no terminal ever arrives → **rank 1 ruled out**; ranks 2-4 remain, **not separable by this pass**
  (README's named ceiling: WebView2's opaque receive path). Recommendation: the terminal-send
  `Result` discard at `adapter_ws.rs:281` becomes a must-fix candidate; a client-side receive
  instrument is the next pass.
- **(C)** the step eventually terminates within the one-hour allowance → strong evidence for rank 1
  as a *slow but live* scan, not a hang; the per-tile service time is reported (never scored).
- **(D)** no stall recurs in this run → the pass is a **null result**, reported as such: one
  non-recurrence does not refute the 2026-09-06 observation; the instrument stays in place for the
  next 5 GB run.
- Any other signature is reported verbatim and NOT interpreted in this file's terms.

## 5. What this pass will not do

No perf claim. No G1/G2 reading (those cells stay their own). No felt judgment. No change to the
producer's behavior. No re-run past the one cell without a dated amendment here first.

## Amendment 1 — run-protocol additions from the instrument's own reviewer gate (2026-09-07, appended before any run; the instrument's gate had FAILED on b3a25b6 and its fix batch was in progress when this was written)

Binding for the run; §4's readings are unchanged except where stated.

1. **Emit pre-flight (must-fix M2 of the gate).** The run passes `--require-pool-poll`. At cell start,
   ≥ 3 s after the dataset opens and BEFORE any trace step, the harness reads the session log —
   whose path it records top-level on the cell as `sessionLogPath`, taken from the app's own stderr
   line `[spatial-ide-shell] session log: <path>` (`frontends/shell/src-tauri/src/lib.rs`), `null`
   with a reason if absent — and requires at least one `producer-pool-poll` line. If none, the cell
   is INVALIDATED with reason `pool-poll instrument emitted nothing` before a single step runs; the
   pass's one cell is never burned silently. The pre-flight's result is recorded on the cell.
2. **Item 3 (`StreamConnectionRecord` wiring) was NOT taken** — the piece's reviewer confirmed the
   reason true: `SkpHost::viewport_query` hardcodes `reports: None` (`kernel/src/skp.rs`, the
   `wrap_for_data_plane` call), so wiring needs a kernel change outside the piece's fence. The pool
   poll alone is the load-bearing instrument, as §2 already said; the README §2 "stronger fact" (a
   record proving the stream reached `Drop`) is therefore unavailable in this run, and a reading
   that would have needed it is reported as not determinable, never inferred.
3. **`--per-step-watchdog-ms` is refused with `--wire-identity`** (that branch's outer watchdog is
   fixed at 600 s and would fire first). The run is a measured camera-trace cell, unaffected.
4. **Tick semantics: `MissedTickBehavior::Delay`.** A starved runtime shows as a GAP in the poll
   timeline, never a same-millisecond catch-up burst. Reading rule added to §4(A): a gap is
   "unobserved", not "counts held" — (A) is convicted only across ticks that actually landed.
5. **Exit lines.** The poll writes `producer-pool-poll stopped reason=<host-missing|catalog-miss|
   closed|panic>` on every exit path, so an ended poll is distinguishable in the log from a normally
   closed dataset; §4's readings consult the `stopped` line's presence and reason.
6. **The override is recorded top-level on the cell** (`perStepWatchdogOverrideMs`), beside the
   other declared measurement-condition flags; a cell carrying it is never scored (the harness
   README's own rule), matching §5.
7. **Cost statement.** The instrument's own comment states its structure — three short lock
   acquisitions per tick on the pool's mutex (the same one the lease path takes), one formatted line,
   one blocking append+flush per tick moved off the async worker — and makes no claim (docs/08).
   The three reads are not an atomic snapshot; §4 reads per field, so this is harmless and noted.

## Amendment 2 — an empty citation in §2 corrected (2026-09-07, appended; a citation correction, no change to the instrument or the run)

§2's parenthetical *"docs/09's dev/debug-gate discipline"* cites nothing: `docs/09_Security_and_
Privacy.md` (59 lines) contains no debug-, dev-, gate- or instrument-related material — verified by
reading it on 2026-09-07 after the instrument's reviewer flagged the same phrase in the code. The
phrase was inherited from `frontends/shell/RESIDENCY-PREREGISTRATION.md` Amendment 16 and copied here
without opening docs/09 — the custodian's own slip, of exactly the class this project scans for. The
real home of the gate discipline is **ADR-020** (Accepted 2026-08-13), whose text reads, verbatim:
*"the E2E harness's dev gate (`import.meta.env.DEV`, Vite) and this one (`cfg!(debug_assertions)`,
Rust) are independent mechanisms, and `tauri build --debug` is precisely where they disagree."*
§2's sentence should be read as: dev/measure-build-gated by those two mechanisms plus the
`measure-build` cargo feature (RESIDENCY-PREREGISTRATION Amendment 16), never in a plain production
build. §2's text is retained unedited above.

## Amendment 2 — attempt 1 invalidated at pre-flight by a harness defect; the pre-flight's path source changes; one re-run authorized (2026-09-07, appended BEFORE the re-run; a pre-result amendment — no trace step ran)

**What happened (verbatim from the runner and harness logs, job tmp `entry40-cell.log` / `entry40-harness.log`).**
05:09:15Z fixture sha OK; 05:09:18Z guard armed (`"armed":true`, backstop task fire 09:39:16+02:00,
watchdog pid 54656); 05:09:22Z RustDesk `Stopped`, 0 processes (verified absent); 05:09:23Z harness
start; mount gate PASSED after 8755 ms; candidate arm and `fine` read back before any open; then:
*"--require-pool-poll PRE-FLIGHT FAILED (pool-poll instrument emitted nothing: session log at
C:\Users\Christopher\AppData\Local\dev.spatialide.shell\logs\session-1786461520.log contains no
"producer-pool-poll" line) -- invalidating the cell before any trace step runs"*; harness rc=1 at
05:11:41Z; 05:11:44Z disarm `"disarmed":true`, RustDesk `Running`. **No trace step ran.**

**The cause is the harness, not the instrument.** `session-1786461520.log` is dated 2026-08-11: the
harness resolved `sessionLogPath` from the last `[spatial-ide-shell] session log:` line in
`frontends/shell/e2e/out/app.log`, and that file was NOT appended by this launch (its mtime is
2026-08-11; on this platform the detached, `shell: true` spawn adopted 2026-08-12 does not deliver
the app's stderr into that raw fd). The instrument's OWN log for this launch,
`session-1788757855.log` (created 05:10:55Z), contains **71 `producer-pool-poll` lines** (first:
`1788757865403 producer-pool-poll active=0 live=1 idle=1`), i.e. the poll emitted from the first
second the dataset was open. Amendment 1 §1's fail-closed rule worked exactly as written — and it
caught a defect in its own path source rather than in the instrument.

**Display verification, disclosed exactly.** The runner's wake-and-check step did not execute (a
defect in the custodian's runner script, diagnosed separately); the display was verified
independently at 05:10:26Z — `{"ok":true,"sessionUnlocked":true,"displayAwake":true,
"monitorTimeoutAc":0}` — 63 s after harness start, during launch, and before the pre-flight's own
3 s window past the open; no trace step ran, so nothing was measured under an unverified display.

**Changes, binding for the re-run.**
1. `sessionLogPath` is resolved from the app's own log directory
   (`%LOCALAPPDATA%\dev.spatialide.shell\logs`, the shell's `app_log_dir()`): the newest
   `session-<epoch>.log` whose epoch is ≥ the harness's own launch instant; the `app.log` parse
   becomes a cross-check only, never the source. If no such file exists 3 s past the open, the cell
   is invalidated with the reason `pool-poll pre-flight could not be evaluated`.
2. The runner verifies the display BEFORE arming and logs the check's JSON, or does not proceed.
3. **The invalidated attempt ran no trace step and is not "the one cell" of §3.** Exactly ONE
   re-run of the single cell is authorized by this amendment, on the harness fix once
   reviewer-gated; a second invalidation of any kind ends the pass with a null result recorded
   (§4 (D)-class), not a third attempt.
Everything else in §2–§5 and Amendment 1 stands.
