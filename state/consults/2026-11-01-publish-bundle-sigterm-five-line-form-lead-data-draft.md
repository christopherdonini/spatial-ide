*Custodian's filing note (2026-11-01): lead-data's read-only draft of the five-line form for `publish-bundle-sigterm`, the filler queue's entry 7d (S3), read at main 7591cdad (dispatched 2026-11-01T03:53:17Z by the main transcript, its prompt equal to its brief by script). Its form is committed in the same commit at its governance path, with the custodian's settlement. The run 03:53:50Z to 04:02:15Z by its transcript (Read 35, Grep 19, Glob 1; no write tool; no call outside the repository). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 2f9df64bf64454665d23eed72083b35d52b664dc0d4ecca1d995d9022114fd45.*

---

Draft: publish-bundle-sigterm five-line form, lead-data

Read only, at main 7591cdad (the working tree's tracked files at that commit; the only untracked entries are outside every path read). A cite `path:line @ 7591cdad` points at that commit. A root file is cited by its bare name (`Cargo.toml`, `Cargo.lock`), meaning the repository root's. Words in quotation marks are byte-copied from the cited line. Everything else is my own wording. I have no shell, so this report carries no sha256.

Form path: `governance/forms/kernel/PUBLISH-BUNDLE-SIGTERM-PREREGISTRATION.md`

```
Authority: PLAN node `publish-bundle-sigterm` (governance/PLAN.yaml:3842-3858 @ 7591cdad), filler queue entry 7d (state/FILLER-QUEUE.md:22 @ 7591cdad), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 7591cdad); the observation is wave-3 W3-A unproven observation 3 (state/cloud/wave3/W3-A.md:168 @ 7591cdad) with its custodian triage (state/cloud/wave3/W3-A.md:198 @ 7591cdad), routed out of port-1 by its drafting consult (state/consults/2026-10-02-port-1-linux-l1-architect-draft.md:73 @ 7591cdad, state/consults/2026-10-02-port-1-linux-l1-architect-draft.md:383 @ 7591cdad); governed by ADR-018 (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-50 @ 7591cdad); reuse index: a miss, no prior art recorded for "sigterm signal handler unix" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief).
Scope: kernel/src/bin/publish-bundle.rs (the signal installer, its two call-site comment lines and the closure's statement order); kernel/tests/publish_cli.rs (T1 and its stderr-wait helper); scripts/plan/cfg-boundary.mjs (one allowlist entry); scripts/plan/cfg-boundary.test.mjs (the shipped-tree test's pinned counts only); kernel/README.md (owner's index: this form in the preregistration list, T1 under the Binaries row, the Last-verified bullet); 5 files; declared line budget 150 by §21c's counting rule (estimate 115: product 38, test 65, allowlist 1, the check's test 6, README 5).
Change: on unix, `publish-bundle` registers SIGTERM beside SIGINT, both synchronously before the installer returns (so before the dataset is opened), and either signal runs the one existing cancel closure, which now sets the token before it prints its existing line; a SIGTERM during a publish therefore ends it exactly as Ctrl-C does — the existing "[publish] cancelling — the staging directory will be removed" line, the staging directory removed, an audit outcome of `cancelled`, the existing `PublishError::Cancelled` message, exit code 1 — where today it kills the process by signal with no outcome record and no staging cleanup; if the runtime or either registration fails, no handler is installed and the existing "no Ctrl-C handler" line is printed; Windows keeps today's `tokio::signal::ctrl_c()` wait unchanged.
Tests+mutation: T1 `kernel/tests/publish_cli.rs::sigterm_and_sigint_each_cancel_a_publish_with_the_same_outcome_and_exit_code_on_unix` (unix; ignored elsewhere with a reason naming the process-signals boundary): for SIGINT and then SIGTERM, it spawns the binary without `--approve` (stdin, stderr piped), waits for the prompt's "approval required" line, sends the signal with the system `kill -INT`/`kill -TERM <pid>`, waits for the handler's existing line, then writes the destination's name and closes stdin; each round asserts exit code `Some(1)`, the stderr line beginning "cancelled: no bundle exists under the destination name", no destination, no `*staging*` entry in the workspace, and the audit log's last record `phase` `outcome` with `outcome` `cancelled`; both rounds give equal (code, outcome). M1: the `signal(SignalKind::terminate())` registration and its `select!` arm are deleted (SIGINT only). Predicted failure: in T1's SIGTERM round, stderr ends without the handler's line (the child is ended by signal 15, its code `None`), and the wait helper panics naming SIGTERM, on the Linux L1 job; the SIGINT round still passes. Changed, not new: `scripts/plan/cfg-boundary.test.mjs::the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site`, its counts re-pinned to +2 sites and +1 file with a `kernel/src/bin/publish-bundle.rs: 2` entry, read against main as it stands once port-2 has merged; its recorded M1 stands. Proven on the Linux L1 job (.github/workflows/product-ci-rust.yml:196-197 @ 7591cdad, .github/workflows/product-ci-rust.yml:233-234 @ 7591cdad); T1 appears in Windows' printed ignored list (.github/workflows/product-ci-rust.yml:238-240 @ 7591cdad).
Out-of-scope: ADR: none (ADR-018 is applied, not amended; no status line). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs; nothing is served, kernel/src/bin/publish-bundle.rs:86-87 @ 7591cdad). Wire: none (a command-line process; no SKP, data-plane or MCP surface). Guarantee: TOUCHED. A cancellation route under ADR-018, which §21a names (governance/AUTONOMY.md:325-327 @ 7591cdad), now reaches the publish from SIGTERM on unix; ADR-018's instants and budget are unchanged and no figure is published. A property under test, the cfg-boundary allowlist and its pinned site counts (scripts/plan/cfg-boundary.mjs:27-33 @ 7591cdad, scripts/plan/cfg-boundary.test.mjs:73 @ 7591cdad, scripts/plan/cfg-boundary.test.mjs:75 @ 7591cdad, scripts/plan/cfg-boundary.test.mjs:82-89 @ 7591cdad), gains one boundary file, an architect-reviewed addition (governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md:153 @ 7591cdad). §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch. No new dependency, no new feature of an existing dependency, no `unsafe`, no new string, no new `pub` item.
```

## Notes

**N1. Size against §21c, settled first**
- The bounds are 150 changed lines with tests counted, 8 files, no new exposure surface, no new dependency and no new user-visible behaviour (governance/AUTONOMY.md:350-351 @ 7591cdad). The counting rule and the exempt form are at governance/AUTONOMY.md:357 @ 7591cdad.
- My estimate:
  - publish-bundle.rs, 38 lines:
    - the unix installer arm, about 24: build the runtime; inside `rt.enter()`, register `signal(SignalKind::interrupt())` and `signal(SignalKind::terminate())`; spawn the thread; `block_on` a `tokio::select!` over the two `recv()`s; call `on_signal`;
    - the Windows arm, today's body kept under `#[cfg(not(unix))]`, about 2 for the attribute and the fn line;
    - doc and comment updates at :515-516 and :685-690, about 8;
    - the closure's two statements swapped, 4 counted.
  - publish_cli.rs, 65 lines: T1 with a two-signal loop, and a reader-thread helper that waits for a stderr line under a bounded `recv_timeout`.
  - cfg-boundary.mjs, 1 line. cfg-boundary.test.mjs, 6 lines (2 changed, 1 added). README, 5 lines.
  - Total: about 115 lines over 5 files. A declared budget of 150 is the §21c ceiling itself. The margin is real but not wide, and an overrun here also breaks §36's "fits a five-line form under §21c's size".
- The other three bounds:
  - Dependency: none (N3).
  - Exposure surface: none in product. Nothing new listens, and the product spawns no process. T1 spawns the system `kill` binary, in test code only.
  - User-visible behaviour: OPEN-3.

**N2. What the binary does today**
- The handler is installed at kernel/src/bin/publish-bundle.rs:514-523 @ 7591cdad, after argument parsing and before `Dataset::open` and the pin (kernel/src/bin/publish-bundle.rs:527-529 @ 7591cdad).
- The closure prints and then cancels (kernel/src/bin/publish-bundle.rs:519-522 @ 7591cdad).
- `ctrlc_handler` is at kernel/src/bin/publish-bundle.rs:685-711 @ 7591cdad:
  - It runs a current-thread runtime on its own thread.
  - It awaits `tokio::signal::ctrl_c()` (kernel/src/bin/publish-bundle.rs:705-709 @ 7591cdad). On unix that is SIGINT only, and it is registered on first poll on that thread, so the registration is asynchronous to the main thread.
  - Only a failed runtime build is reported, with the existing line at kernel/src/bin/publish-bundle.rs:698-703 @ 7591cdad. A failed registration is silent today (`is_ok()` false, nothing printed).
- What the token cancels:
  - the pin (`pin_content(&cancel)`, before the boundary);
  - the gated operation (kernel/src/bin/publish-bundle.rs:669 @ 7591cdad).
- Inside the boundary, every return after the intent writes an outcome (kernel/src/permission/boundary.rs:366-368 @ 7591cdad), and `Cancelled` is `Outcome::Cancelled` (kernel/src/permission/boundary.rs:283 @ 7591cdad, written as `cancelled` at kernel/src/permission/audit/record.rs:70 @ 7591cdad).
- On error, the staging directory is removed or reported (kernel/src/publish/mod.rs:640-656 @ 7591cdad).
- Exit codes are at kernel/src/bin/publish-bundle.rs:179-185 @ 7591cdad: success 0, any `Err` printed as "[publish] {e}" and `ExitCode::FAILURE`.
- The only tests in the file are `audit_show_tests` (kernel/src/bin/publish-bundle.rs:713-825 @ 7591cdad). No test anywhere sends the binary a signal.
- The observation cites publish-bundle.rs:642–656 at its audit baseline, and port-1 cites :674-694 at d310206. At 7591cdad those spans are :514-523 and :685-711.

**N3. No new dependency and no new feature (both red lines): not needed**
- The root's tokio line already enables `signal` and `macros` (Cargo.toml:47 @ 7591cdad). The kernel inherits it with `tokio = { workspace = true }` (kernel/Cargo.toml:26 @ 7591cdad).
- The lock's tokio entry lists `signal-hook-registry` (Cargo.lock:2068-2081 @ 7591cdad, the dependency at :2077; the package at Cargo.lock:1814-1821 @ 7591cdad). That is the unix half of tokio's signal support.
- Today's `ctrl_c()` goes through that unix driver on Linux. KNOWN-LIMITATIONS.md:27-29 @ 7591cdad says the workspace compiles and passes on the L1 job, so the unix signal support already compiles and links there. This is my reading of tokio from memory: `tokio::signal::unix::signal`/`SignalKind::terminate` sit behind the same `signal` feature. The first L1 build proves it.
- T1 sends signals through the OS's `kill` executable, so no crate is added for a test either. The executable is present on ubuntu-24.04 and macOS images, and CI installs nothing new.

**N4. Why the piece needs an OS-naming cfg, and what that costs**
- `tokio::signal::unix` exists only on unix, so the arm needs `#[cfg(unix)]`, and the Windows arm needs `#[cfg(not(unix))]`. That makes two sites.
- kernel/src/bin/publish-bundle.rs is not on the allowlist (scripts/plan/cfg-boundary.mjs:27-33 @ 7591cdad). The check would exit 1 on it, and R2 calls such a site accidental coupling "unless the architect adds the file as a boundary" (state/directives/PORTABILITY-2026-09-30.md:47 @ 7591cdad).
- So the piece adds one allowlist entry, `kernel/src/bin/publish-bundle.rs` → "process signals" (my label), and re-pins the shipped-tree test.
- No existing boundary fits, and a cfg that dodges the token set would be an R4 finding. See OPEN-1.

**N5. Determinism of T1 (my design)**
- *Registered before the prompt.* The unix arm registers both signals synchronously before the installer returns. The installer is called before `Dataset::open`, and the prompt is written in one `write_all` inside `boundary::execute` (kernel/src/permission/approval.rs:163-167 @ 7591cdad; the "approval required" line at kernel/src/permission/approval.rs:103 @ 7591cdad). So when the test sees that line, the handlers are already in place.
- *Token set before the answer.* The closure now runs `cancel.cancel()` first and then prints its existing line (OPEN-4). So when the test sees that line, the token is already set.
- *The answer.* The test then writes the name. The boundary reads one line (kernel/src/permission/approval.rs:171-176 @ 7591cdad), re-checks the grant, creates staging, and meets its first `watch.check()` (kernel/src/publish/mod.rs:722-723 @ 7591cdad). That check returns `Cancelled`.
- *No timing assertion.* Each wait is a reader thread with a bounded `recv_timeout` (120 s, my figure). That bound guards against a hang, not latency: on expiry the test kills the child and panics naming the wait.
- *Gating.* The test is `#[cfg_attr(not(unix), ignore = "<reason naming the process-signals boundary>")]` in a `tests/` file, which the check excludes. The body uses only portable std calls (`status.code()`, `Command`), so it compiles on Windows and is listed there as ignored (R6, state/directives/PORTABILITY-2026-09-30.md:65 @ 7591cdad).
- *Harness.* T1 reuses the existing piped-stdin harness shape (kernel/tests/publish_cli.rs:611-639 @ 7591cdad) and its contained audit log (kernel/tests/publish_cli.rs:161-194 @ 7591cdad).

**N6. What a user sees (my reading)**
- *Before, on unix:* SIGTERM ends the process by signal. Nothing is printed, a `.<destination name>.staging-<hex>` directory can remain, and the audit holds an intent with no outcome, which `--audit-show` prints as "no outcome (interrupted?)" (the wording KNOWN-LIMITATIONS.md:348 @ 7591cdad gives for the app's case).
- *After, on unix:*
  - The existing handler line is printed.
  - The existing `Cancelled` message follows (kernel/src/publish/error.rs:439-443 @ 7591cdad; code `publish.cancelled` at kernel/src/publish/error.rs:286 @ 7591cdad).
  - The exit code is 1, and staging is removed.
  - The audit outcome is `cancelled`. `--audit-show` renders it with the existing sentence (kernel/src/permission/audit/reader.rs:321-324 @ 7591cdad), which names "a Ctrl-C" and not SIGTERM (OPEN-7).
  - A SIGTERM during the pin, before the boundary, exits 1 with the engine's cancelled message and no audit lines, as Ctrl-C does.
  - The process now outlives SIGTERM until unwinding ends. That interval is `cancel_quiescent`, which ADR-018 leaves unbudgeted because it crosses class-(b) sections (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-65 @ 7591cdad). No figure is claimed.
- No new string. No product ships off Windows (KNOWN-LIMITATIONS.md:14-17 @ 7591cdad), Linux is L1 for the workspace only and macOS has no level (KNOWN-LIMITATIONS.md:27-30 @ 7591cdad), and this binary is a developer/test tool (kernel/src/bin/publish-bundle.rs:86-87 @ 7591cdad).
- KNOWN-LIMITATIONS 30, which lists "a SIGTERM", concerns the app's drain (KNOWN-LIMITATIONS.md:336-349 @ 7591cdad), not this binary, and is unchanged.
- The §21c question is OPEN-3.

**N7. Disclosed and unchanged**
- *Signals after the first.* A second SIGINT or SIGTERM during unwinding is swallowed, because tokio never unregisters a handler (my recollection of tokio's documentation). So only SIGKILL ends a publish stuck in a class-(b) section. On unix the same is true of Ctrl-C today.
- *Other ways to end the process.* SIGHUP, SIGQUIT and SIGKILL keep their default actions. So do Windows' console close, logoff and shutdown, which W3-A names as the analogue.
- *Untested path.* The registration-failure path has no test, since it cannot be reached without fault injection. It is declared here.
- *Comments outside Scope that become inexact.* Two comments still say the CLI's tokio thread is for Ctrl-C alone: kernel/PERMISSION-BOUNDARY.md:127 @ 7591cdad, which port-2 edits, and kernel/src/permission/approval.rs:53 @ 7591cdad. They are not edited here (see What I could not settle).
- *Records left as they are.* kernel/RESULTS.md:1532 @ 7591cdad is a Windows results record, and kernel/src/main.rs:188 @ 7591cdad (`slice-host`'s own `ctrl_c`) is out of scope.

**N8. Test design: declared unchanged and invalidators**
- *Declared unchanged:* every existing test in kernel/tests/publish_cli.rs, `audit_show_tests`, and every cfg-boundary test except the re-pinned one.
- *Invalidators:*
  - Any existing test changes outcome on either job.
  - Windows' `--list --ignored` gains anything beyond T1.
  - T1's SIGINT round fails at the base. That would mean the harness, not the change, is wrong. Stop.
  - The first L1 build fails on `tokio::signal::unix`. That would contradict N3, so the piece stops and the matter goes to the custodian, never to a feature or dependency edit.

**N9. The Platform item** (R3: state/directives/PORTABILITY-2026-09-30.md:49-54 @ 7591cdad; template docs/PREREGISTRATION-TEMPLATE.md:177 @ 7591cdad)
- **Owning boundary:** a new one, process signals, at kernel/src/bin/publish-bundle.rs. The architect adds it at the piece's gate under R2 (state/directives/PORTABILITY-2026-09-30.md:47 @ 7591cdad). It is not in the plan's §2 table (state/directives/PORTABILITY-2026-09-30.md:37-45 @ 7591cdad), and this form records the addition.
- **Windows:** supported and unchanged. Ctrl-C cancels as today, and the arm's body stays today's. The one shared change is the closure's statement order (OPEN-4); the outcome, exit code and strings are unchanged. T1 is ignored with the boundary reason. Console close, logoff and shutdown still end the process uncleaned, as today; this piece does not reduce them.
- **Linux:** supported. SIGTERM and SIGINT each cancel, with one outcome and exit code 1. T1 runs on the ubuntu-24.04 L1 job.
- **macOS:** same code path (`cfg(unix)`). Port-2 must merge before this piece runs (N10), so if port-2 brings a macOS L1 entry, T1 runs there. If it does not, macOS is code-path-only, and the deferral is recorded in this form (OPEN-6).
- No KNOWN-LIMITATIONS item is owed: nothing is reduced.

**N10. Rule (00): the piece's paths against the in-flight list**
- **kernel/src/bin/publish-bundle.rs:** not among the kernel paths of `cut/b2-piece-1c-save-and-reopen` or `cut/port-2-macos-l1-and-app-dirs`. #273, #272, #271 and `cut/b1-shell-half-pr-c` list nothing under kernel/. Clear on the list given. 7d's earlier skip reason, #241 (state/FILLER-QUEUE.md:22 @ 7591cdad), has merged, as 7c's form records.
- **kernel/tests/publish_cli.rs:** not among any listed kernel path. Clear on the list given.
- **kernel/README.md:** not among any listed kernel path. Clear on the list given.
- **scripts/plan/cfg-boundary.mjs and scripts/plan/cfg-boundary.test.mjs:** not determinable from the list, which gives only kernel/ paths. But 7c's settlement records, by git at main ce5db2f1, that `cut/port-2-macos-l1-and-app-dirs` edits both (governance/forms/kernel/PUBLISH-UNIX-QUOTA-PERM-ERRORS-PREREGISTRATION.md:169 @ 7591cdad), and the queue still skips 7c for it (state/FILLER-QUEUE.md:21 @ 7591cdad). If that still holds, 7d collides by rule (00), and this is the blocking question. An entry skipped at dispatch keeps its place (state/FILLER-QUEUE.md:3 @ 7591cdad).
- **Ordering with 7c:** 7c also re-pins the shipped-tree counts. Fillers run one at a time, so whichever runs second re-reads the counts at its own dispatch.
- **The form itself,** governance/forms/kernel/PUBLISH-BUNDLE-SIGTERM-PREREGISTRATION.md: new, on main, by the custodian.
- I cannot see the docs and governance lanes' paths.

**N11. Record notes**
- The PLAN summary still begins "WAITS ON PIECE F" (governance/PLAN.yaml:3857 @ 7591cdad). Forms for 7a and 7c already sit at their governance paths, so that wait looks discharged in fact. The node is the custodian's to update.
- ADR-018 §4 asks each cancellable operation to classify its path (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:80-88 @ 7591cdad). This piece adds a trigger, not a path section. `cancel_requested` is the closure's `cancel()` returning on the signal thread (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:43-47 @ 7591cdad). No figure is published (:49-50).

## OPEN items, each with options and my recommendation

None is a red line except option (B) of OPEN-5 and option (B) of OPEN-7.

- **OPEN-1: where the OS-conditional code lives.** Recommendation: (A).
  - (A) Allowlist `kernel/src/bin/publish-bundle.rs` as "process signals", with two sites. This is the smallest change. The binary is the only signal consumer, and the architect reviews the entry at gate 1 under §36.
  - (B) A new library module (for example `kernel/src/signal.rs`), allowlisted on its own. This is narrower in what it allowlists, but it adds a file, a module and probably a `pub` item, and the shell does not need it today.
  - (C) A cfg that names no OS token, so that it passes the check. Rejected: an R4 finding, and dishonest about the check.
- **OPEN-2: rule (00) with port-2.** Recommendation: (A).
  - (A) Skip 7d at dispatch while port-2 edits the cfg-boundary files, keeping its place. Once port-2 merges, the counts in the Tests+mutation line are re-read at that main by an amendment before any code, as 7c's settlement does.
  - (B) Run now without the allowlist entry. Not viable: the check fails CI.
  - (C) Ask port-2 to carry the entry. That would be a scope change to a ruled piece.
- **OPEN-3: is a unix publish that now stops cleanly on SIGTERM "new user-visible behaviour" under §21c?** Recommendation: (A), the shape of 7a's ruled OPEN-2 (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:100-101 @ 7591cdad). I flag it as a closer call than 7a or 7c, because the process's response to a signal visibly changes (killed by signal, then exit 1 with cleanup).
  - (A) Not new. The outcome, strings, code and audit record are Ctrl-C's existing ones, reached by a new trigger on a platform where nothing ships. The filler stands with both gates from dispatch under §36.
  - (B) New. The piece leaves the filler slot for the full form and full gating.
- **OPEN-4: the closure's order.** Recommendation: (A).
  - (A) `cancel.cancel()` before the existing line. The line then happens after the token is set, and T1 is deterministic by construction. On Windows, the outcome, exit code and strings are unchanged. The cost: a fast unwind could, in principle, end the process before the line prints.
  - (B) Keep the order. T1 then has a theoretical window: the signal thread would have to stall between the print and the store while the main thread ran through grant check and staging creation. Its failure mode is a test failure (the publish succeeds), never a false pass.
- **OPEN-5: registration failure.** Recommendation: (A).
  - (A) All or nothing. If the runtime or either registration fails, no handler is installed, and the existing "no Ctrl-C handler" line is printed with the OS detail. There is no new string, and a failure that is silent today becomes visible on unix.
  - (B) Keep SIGINT and print a new placeholder line for SIGTERM. **A red line:** a new P6 string (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 7591cdad).
  - (C) Keep SIGINT and say nothing. A silent weakening, an R1 finding (state/directives/PORTABILITY-2026-09-30.md:33 @ 7591cdad).
- **OPEN-6: macOS.** Recommendation: (A).
  - (A) `cfg(unix)`, so macOS takes the same arm. T1 runs there if a macOS L1 entry exists at dispatch; otherwise macOS is code-path-only, with the deferral recorded here.
  - (B) `target_os = "linux"` only, with macOS left as today. That adds a third site and an explicit reduction, for no gain.
- **OPEN-7: the audit reader's `cancelled` sentence names "a Ctrl-C" and not SIGTERM.** Recommendation: (A).
  - (A) Leave it unchanged for the P6 sitting. It stays true of every Windows case.
  - (B) Reword it. **A red line:** a P6 string change, and also a file outside Scope.
- **OPEN-8: the owner's-index edit.** Recommendation: (A).
  - (A) This form at its governance path in the preregistration list (kernel/README.md:387 @ 7591cdad), T1 added under the Binaries row (kernel/README.md:376 @ 7591cdad), and the Last-verified note (kernel/README.md:360 @ 7591cdad).
  - (B) The form and the Last-verified note only, leaving the row's pins as they are.

## Questions for the custodian (not decided here)

- **Guarantee scope:** this form names ADR-018's cancellation and the cfg-boundary property as touched. I read neither as an altered guarantee: ADR-018's text, instants and budget are unchanged, and a boundary is added by the architect under R2. Please confirm that neither is a red line, as the human ruled for 7a.
- **Rule (00):** does `cut/port-2-macos-l1-and-app-dirs` still edit `scripts/plan/cfg-boundary.mjs` or `scripts/plan/cfg-boundary.test.mjs` at 7591cdad, and does any lane or PR touch the five Scope files?

## What I could not settle

- Whether port-2 still edits the cfg-boundary files, and port-2's site counts after it merges (N10, OPEN-2).
- Whether port-2 brings a macOS L1 entry (N9, OPEN-6).
- Four recollections of tokio, all unverified here:
  - `signal(...)` registers synchronously inside a runtime context;
  - a handler is never unregistered;
  - `ctrl_c()` on unix is SIGINT, registered on first poll;
  - `Runtime` can be moved to the handler thread after `enter()`.
  The first L1 build and T1 prove what the piece relies on.
- That std's `read_line` retries on EINTR. My recollection; T1 exercises it.
- The two out-of-Scope comments that become inexact (kernel/PERMISSION-BOUNDARY.md:127 and kernel/src/permission/approval.rs:53, both @ 7591cdad). I leave them to a docs-lane piece; the first is a port-2 path.
- Whether a Windows console-close analogue should be proposed as its own node. The custodian may propose it.
- No sha256: I have no shell.

---
Result: the draft five-line form for 7d, 5 files and a declared 150 lines (estimate 115). No new dependency or feature: tokio's `signal` feature is already enabled at the root and compiled on the L1 job. Guarantee: touched.
Blocking question: rule (00). The piece must add `kernel/src/bin/publish-bundle.rs` to the cfg-boundary allowlist and re-pin its test, and port-2 edits both files (per 7c's settlement), so 7d is skipped at dispatch until port-2 merges (OPEN-2).
Blocking question: please confirm the guarantee readings (ADR-018 route, cfg-boundary property) are not red lines.
Report path: C:/dev/spatial-ide/state/consults/2026-11-01-publish-bundle-sigterm-five-line-form-lead-data-draft.md
sha256: none (no shell).
