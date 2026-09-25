# Wave 1 — reviewed plan and launch prompts

*Fable, 2026-09-25. Replaces CLOUD-WORKER-OPERATING-MODEL.md for this promotion. The custodian copies each prompt in §7 verbatim into its session; nothing here authorises product changes.*

## 1. Review: what to keep, what to amend

The plan is sound and I'd keep almost all of it: the pinned baseline, calibration before parallelism, honest spend accounting, "zero findings is a result", unproven observations kept out of findings, constrained network, the severity decided by the custodian rather than the auditor, and the DCO hook verified rather than assumed.

Nine amendments, each for a concrete reason in the repository:

1. **Reproducers need a home.** "Read-only, no product modifications" and "a reproducing test" contradict each other unless the test has somewhere to live. Rule: reproducers are **test files only**, committed to the session's own branch `cloud/wave1-<item>`, pushed, **never PR'd**. No product source is edited. The custodian decides whether a reproducer becomes a regression test inside a later cut.
2. **The result format mixes who knows what.** A cloud session can't see promotional spend. The schema (§3) separates the fields the worker fills from the ones the custodian fills.
3. **DCO, mechanically.** In a fresh cloud clone the hook isn't armed. Every session that commits runs `git config core.hooksPath .githooks`, proves the hook rejects an unsigned commit, and then commits with the project's command: `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If the proof fails, it stops before committing.
4. **The corpus spike must not commit third-party data.** `*.parquet` is gitignored, and committing external datasets would bring licence and notice obligations (ADR-030's territory) into the repository. It commits **a manifest and a fetch script only**. It fetches from primary sources, never from a mirror we host. Tools needed to *regenerate* writer-pipeline files (GDAL, pyogrio, QGIS) are named and pinned in the manifest and installed only inside the session. **No dependency manifest is added to the repository**; if one seems necessary, that's a stop. Tests never fetch implicitly: a test that needs the corpus skips with a named reason when it's absent. The product never fetches, which keeps ADR-021's no-runtime-fetch property intact in spirit.
5. **"The full workspace" needs defining.** The root workspace is engine, data-plane, skp, renderer and kernel. `frontends/shell/src-tauri` is excluded and has its own workspace; on Linux it needs webkit2gtk system packages. The Linux run covers the root workspace, the shell's TypeScript suite and the bundle viewer. Trying the shell crate is optional, allowed as environment-only setup, and recorded either way.
6. **SKP conformance: which spec.** `SKP-V0.md` is the normative file, including its appended version sections, and the current literal is `skp/0.4`. Fixtures go in a **new directory** (`protocol/skp/tests/conformance/`), never into the existing fixture files, which the watcher and B1 will be editing. ADR-004 Amendment 4 applies: no instrument or trace field is ever proposed.
7. **Network: package registries are needed to build.** "Little or no internet" still has to allow crates.io and npm, or reproducers can't compile. Audits and runs: package registries only. The corpus spike: registries plus the primary-source hosts named in its manifest, nothing else.
8. **Known issues must be checked before a finding is filed.** Each prompt tells the auditor to read `KNOWN-LIMITATIONS.md` and search `DECISIONS-PENDING.md`. A finding that duplicates a declared limit or a queued entry is discarded, not re-reported.
9. **The baseline predates ADR-035's emission code and the watcher.** That's acceptable, even useful: an audit of today's StreamRegistry finds latent issues the new code would inherit. Triage re-validates any finding against main at the time of triage; the baseline governs what the auditor examined, not what the custodian acts on.

**No conflicts with accepted ADRs** once these amendments are in. The areas to watch: ADR-004 Amendment 4 (conformance fixtures), ADR-021's no-runtime-fetch property (the corpus), ADR-030 (third-party data), and ADR-020/ADR-024 (the security audit stays read-only; it probes nothing outside its container).

## 2. Baseline

```
WAVE1_BASELINE=bb98f71f43a2891d317b10a124387df9d5ee0ebf
```

> **Custodian's note, 2026-09-25 (the human's handoff instruction, item (2); recorded in `state/CUT-STATE.md`'s ledger).** This tracked copy re-pins the baseline. The draft's pin, 59406134a447d6187fae4a6a79fb9f390c8efefb, is replaced uniformly by bb98f71f43a2891d317b10a124387df9d5ee0ebf in §2 and in every prompt in §7, and nothing else in this file differs from the draft except this note.
>
> **Why.** Code under `frontends/` changed on main after the draft's pin: PR #114's merge (ADR-035) changed one header string in `frontends/shell/scripts/adrIndex.mjs` and its test in `frontends/shell/src/docs/adrIndex.test.ts`, to name ADR-034 as a reserved number. Nothing changed under `engine/`, `kernel/`, `protocol/` or `renderer/`. bb98f71 is `origin/main` at re-pin time. Product CI (Rust workspace, shell, bundle viewer) was dispatched on bb98f71; its green runs are recorded in the ledger and in `state/cloud/wave1.md`.
>
> §2's sentence about 2026-09-25 00:22 and `aa79322` describes the draft's pin and is retained as written. bb98f71 also includes #114 (ADR-035, docs, Proposed at the pin), and every commit after #114's merge touches `state/` only.

This is `origin/main` at 2026-09-25 00:22 +0200. It includes #108, #112, #116 and #117; the commits after the last code merge are state and docs only. **Condition before launch:** the custodian confirms product CI is green on this SHA (or on `aa79322`, the #117 merge, which has identical code). If it isn't green, it chooses the most recent green SHA and records why.

## 3. Result schema

Each session's final message is a single report in this shape. The custodian stores it verbatim.

```
# WAVE1 REPORT
## Worker fields
Item: <A1..A5 | B | C | D>          Lens/purpose: <one line>
Baseline SHA: <full SHA, confirmed by `git rev-parse HEAD` at start>
Branch: <cloud/wave1-<item> or "none">   Commits: <SHAs or "none">
Environment: <OS, rustc, cargo, node, npm versions; network scope actually used>
Commands run: <exact, with exit codes>
Findings: <count, 0..5>

### Finding <item>-<n>
Claim: <one sentence, falsifiable>
Suggested severity: S1 | S2 | S3 (worker's suggestion only)
Code path: <file:line chain from untrusted entry to the defect, at the baseline SHA>
Reproducer: <test path on the branch + command + observed output> | "code path only"
Guarantee violated: <ADR/section, principle, or documented contract; or "none stated">
Evidence: <what was observed, not inferred>
False-positive check: <why this is not already handled / not a known limit; what was searched>
Confidence: proven | code-path-only

### Unproven observations (not findings; at most five, one line each)
### Stops (if any): <which stop condition, with the file and line that triggered it>

## Custodian fields (filled locally, never by the worker)
Session ID: <id>   Model: <as launched>   Launched/ended: <UTC>
Spend: <exact per-session figure if the platform shows one> | "not individually attributable; batch delta $X"
Disposition per finding: DISCARD | RECORD | CUT CANDIDATE   Final severity: <S1..S3>   Reason: <one line>
Reproduced locally (Windows): yes | no | not attempted
```

## 4. Severity and triage (the custodian decides; the worker only suggests)

- **S1 → cut candidate.** Violates an accepted ADR guarantee or a security property (data-plane authentication or origin admission, filter admission, the permission boundary, the no-runtime-fetch property). Or: a panic, hang or deadlock reachable from untrusted input (a file, an SKP request, a bundle). Or: silent data loss, or a status that claims something untrue (principle 8). Or: an unbounded resource leak under ordinary use. **Required:** a reproducer, or the custodian's own reproduction on Windows.
- **S2 → record.** Real but bounded: a per-session leak with a ceiling, a refusal mapped under the wrong code, a panic reachable only from trusted or internal input, a defect on a path unreachable today. Recorded as a KNOWN-LIMITATIONS row or a PLAN note, at the custodian's discretion.
- **S3 → discard.** Style, speculation, a duplicate of a declared limit or a queued entry, or anything that doesn't reproduce.
- **Tie-breaker:** if it isn't reproducible locally and the code path doesn't convince the custodian, it's S3, whatever the worker suggested.
- Nothing becomes a cut in this wave. S1 candidates go to me in one batch after the wave, with the evidence attached.

## 5. Calibration, then grouping

**Calibration first: A3, panics reachable from untrusted input.** It's bounded and read-mostly like the other audits, so it predicts their cost. It's also the audit most likely to need a compiled reproducer, so it tests the build path and the DCO proof before anything else depends on them.

After calibration, decide based on what the platform shows:

- **If per-session spend is visible:** batch 1 is A1, A2, A4 and A5 in parallel. Batch 2 is C and D in parallel (both build heavily, independently). Batch 3 is B on its own (the network exception, and the licences need attention).
- **If only the shared balance moves:** the same batches, but run batch 1 as two pairs (A1+A2, then A4+A5), and record each pair's balance delta. Never parallelise past the point where a delta can still be tied to a named batch.

## 6. Recording (custodian only)

`state/cloud/wave1.md` holds the ledger. Each report goes verbatim into `state/cloud/wave1/<item>.md` as immutable evidence.

```
WAVE1_BASELINE=<sha>   CI on baseline: green (<run URL>)
| Item | Session ID | Model | Launched (UTC) | Ended | Balance before | Balance after | Spend (exact | batch delta) | Findings | Dispositions |
```

Record balance before and after *each* launch batch, even when per-session figures exist, so the two can be reconciled. Never estimate spend from tokens. If a figure isn't shown, the cell says "not attributable".

## 7. The prompts

Every prompt below repeats the common rules in full, by design; no session relies on shared context. **How to assemble them:** A2–A5 are written as A1 with only the item id, the branch name and the TASK block replaced. The custodian builds each one by copying A1 in full and swapping exactly those three things, so every launched prompt contains all the rules. Wherever a prompt says "[paste §3's schema]", it pastes §3's worker fields verbatim. The custodian records the exact assembled text of each prompt beside its session ID.

### A1 — security boundaries

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit bb98f71f43a2891d317b10a124387df9d5ee0ebf. Run `git checkout
bb98f71f43a2891d317b10a124387df9d5ee0ebf` and confirm with `git rev-parse HEAD` before anything else. Do not
move to a newer head, and do not reason from later commits.
ROLE: you investigate and report. You do not design, decide, merge, or change product code.

TASK — security-boundary audit. Examine only whether the code's security boundaries hold as their
accepted ADRs state:
- protocol/data-plane (token via WebSocket subprotocol, constant-time compare, loopback binding) and origin
  admission (ADR-020, docs/09 "Local listening sockets");
- filter admission (ADR-021: the allowlist, the two-sentinel probe, the static-link/no-runtime-fetch
  property; ADR-021's dated notes);
- the class-3 permission boundary (ADR-024: the requester never mints the grant; the audit record);
- the Tauri command surface in frontends/shell/src-tauri (read the code; you need not build it).
For each potential weakness, trace an exact path from an untrusted input to the defect. Probe nothing
outside your container.

EVIDENCE BAR: at most five findings. Each needs a reproducing test (preferred) or an exact file:line code
path at the baseline. No reproducer and no exact path means no finding. Zero findings is a valid and
useful result; do not invent weaknesses to fill the quota. Put anything plausible but unproven under
"Unproven observations", at most five, one line each. Before filing a finding, read KNOWN-LIMITATIONS.md
and search DECISIONS-PENDING.md: a duplicate of a declared limit or a queued entry is not a finding.

REPRODUCERS: test files only, under existing test directories. Commit them only to branch
cloud/wave1-A1 and push it. Open no PR. Edit no product source file.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, any product
source file.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope.

DCO: before any commit, run `git config core.hooksPath .githooks` and prove the hook rejects an
unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
NETWORK: package registries only (crates.io, npm), and only to build.
PLATFORM: your results are Linux evidence only. Windows CI and the local custodian verify the product.

OUTPUT: your final message is the WAVE1 REPORT in exactly this shape:
[paste §3's schema, worker fields only]
```

### A2 — concurrency and locking

Identical to A1 except for the item id (`A2`, branch `cloud/wave1-A2`) and the TASK block:

```
TASK — concurrency and locking audit. Examine lock acquisition and release, lock ordering, and work done
while a guard is held in: the kernel's StreamRegistry and GenerationRegistry, the ticket map and ticket
redemption, the engine connection pool and its three lease classes (engine/src/pool.rs), cancellation
paths (cancel tokens, InterruptHandle), and generation invalidation. In the shell (TypeScript), examine
callbacks that can arrive after a generation or dataset has ended. PR #116 (merged at the baseline)
fixed a drop-under-registry-lock hang: read it, and look for the same class elsewhere. Do not re-report
it. Deadlocks, lock-order inversions, and re-entrant acquisition are in scope. Performance is not.
```

### A3 — panics reachable from untrusted input (calibration job)

Identical to A1 except for the item id (`A3`, branch `cloud/wave1-A3`) and the TASK block:

```
TASK — audit for panics, aborts and unbounded recursion reachable from untrusted input. Untrusted
inputs are: GeoParquet files (geo metadata JSON, WKB geometry, Arrow schemas), PROJJSON definitions,
SKP requests (deserialisation and field validation), bundle files read by the viewer, and filter
predicates. Look for unwrap/expect, indexing and slicing, integer overflow on sizes taken from input,
recursion without a depth bound, and assertion failures, on any path from those inputs. In the shell and
viewer (TypeScript), look for uncaught exceptions on decode paths. A panic that ends in a typed
refusal is not a finding; one that kills a thread, the kernel or the process is.
```

### A4 — refusal exhaustiveness

Identical to A1 except for the item id (`A4`, branch `cloud/wave1-A4`) and the TASK block:

```
TASK — refusal-exhaustiveness audit. The project rule is that every failure reaches the caller as a
typed, named refusal, with no catch-all (ADR-021 decision 8's no-catch-all rule; the refusal taxonomies
in SKP-V0.md). Check: every EngineError variant maps to a named SKP refusal in kernel/src/skp.rs without
a wildcard arm or a String-flattened catch-all; the TypeScript client (frontends/shell/src/skp/) handles
every refusal code the kernel can emit; the publish refusal path keeps its code end to end
(formatPublishRefusal); refusals keep their code across the data-plane terminal. A code emitted by Rust
that the TypeScript side does not recognise, or a refusal that loses its code on a path, is in scope.
Wording quality is not.
```

### A5 — lifecycle and resource leaks

Identical to A1 except for the item id (`A5`, branch `cloud/wave1-A5`) and the TASK block:

```
TASK — lifecycle and resource-leak audit. Check that every acquired resource is released on every path,
including error, cancellation and generation-end paths: connection leases, stream tickets, tile streams,
file handles (including descriptor re-reads), temporary files in publish and prepare (engine/src/lod.rs
tier directories included), background tasks after a dataset is closed, and in the shell, deck.gl
finalisation and Tauri event listeners (listen/unlisten). A leak with a declared ceiling is S2 at most;
one that grows with ordinary use is in scope for S1.
```

### B — reproducible corpus spike (the network exception; may open one PR)

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: start from exactly commit bb98f71f43a2891d317b10a124387df9d5ee0ebf (`git checkout`, confirm
with `git rev-parse HEAD`). Do not move to a newer head.
ROLE: you build a proposal. You do not design, decide or merge.

TASK — make the compatibility corpus reproducible without committing any third-party data. Read
engine/ADMISSION-PREREGISTRATION.md §3 (the corpus manifest: twelve files, their pipelines and hashes)
and kernel/FIXTURES.md. Produce, under a new directory tools/corpus/:
  (1) MANIFEST.json: for every file, a pinned primary-source URL (no mirrors, no mutable "latest" URLs
      where a pinned one exists), SHA-256, licence, attribution text if the licence requires it, and,
      for files produced by a writer pipeline (GeoPandas, GDAL, DuckDB spatial, QGIS, Overture), the
      source input plus the exact tool and version and the exact command;
  (2) a deterministic fetch-and-verify script using only tools already present in the repository's
      toolchain (Node or Python standard library). It fails closed on any hash mismatch and never
      falls back to another source;
  (3) a README stating which files are small enough for CI and which are optional, and which files
      cannot be reproduced in a Linux cloud environment (for example, QGIS output), with the reason.
Verify end to end in this environment: fetch, regenerate what can be regenerated with the pinned tools
installed only inside this session, and compare every hash. Report each file as reproduced, reproduced
with a different hash (and why), or not reproducible here.
Commit only the manifest, the script and the README. Never commit a data file.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, any product
source file, and no dependency manifest file anywhere in the repository (no requirements.txt,
package.json or Cargo.toml changes). Tool versions live in MANIFEST.json only.

STOP AND REPORT, rather than improvise, if: a new repository dependency seems necessary (report why,
which one, the missing capability, and dependency-free alternatives); a file's licence is unclear or
not open; a design or architectural decision would be needed; the task would have to grow beyond this
scope.

DCO: before any commit, run `git config core.hooksPath .githooks` and prove the hook rejects an
unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
NETWORK: package registries plus exactly the primary-source hosts in your MANIFEST.json, nothing else.
PLATFORM: your results are Linux evidence only.

OUTPUT: branch cloud/wave1-B, at most ONE pull request, titled "Wave 1 B: reproducible corpus
(proposal)". Do not merge it. Your final message is the WAVE1 REPORT (§3 schema, worker fields). In
it, "Findings" are the files that did not reproduce, with reasons.
```

### C — SKP conformance, spec-only (may open one PR)

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: start from exactly commit bb98f71f43a2891d317b10a124387df9d5ee0ebf (`git checkout`, confirm
with `git rev-parse HEAD`). Do not move to a newer head.
ROLE: you check conformance. You do not design, decide, merge or change the protocol.

TASK — write conformance fixtures from the specification alone, then compare the implementation.
PHASE 1 (spec only): read protocol/skp/SKP-V0.md, including its appended version sections, as
normative. The current literal is skp/0.4. DO NOT open any implementation file in phase 1. Write
golden request/response and refusal fixtures under the NEW directory protocol/skp/tests/conformance/,
each fixture citing the spec section it encodes. Where the spec is ambiguous, write no fixture: record
the ambiguity with its section and move on. Do not resolve it.
PHASE 2: run the fixtures against the implementation (a test harness in that same new directory,
using the crate's existing test setup, no new dependency). Report every divergence as: spec section;
fixture; observed behaviour; which side appears wrong, marked "undetermined" unless the spec is
unambiguous. Do not change existing fixture files or any implementation file to make a fixture pass.
Never propose an instrument or trace field (ADR-004 Amendment 4).

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, any product
source file, protocol/skp/SKP-V0.md, and existing files under protocol/skp/tests/.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol change; a design decision would be needed; the task would have to grow beyond this scope.

DCO: before any commit, run `git config core.hooksPath .githooks` and prove the hook rejects an
unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
NETWORK: package registries only, and only to build.
PLATFORM: your results are Linux evidence only.

OUTPUT: branch cloud/wave1-C, at most ONE pull request, titled "Wave 1 C: SKP conformance fixtures
(proposal)". Do not merge it. Your final message is the WAVE1 REPORT (§3 schema, worker fields). In
it, "Findings" are the divergences, and "Unproven observations" include the ambiguities you found.
```

### D — Linux workspace run (no PR)

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: run exactly commit bb98f71f43a2891d317b10a124387df9d5ee0ebf (`git checkout`, confirm with
`git rev-parse HEAD`). Do not move to a newer head.
ROLE: you run and catalogue. You do not fix, design or decide.

TASK — run the project's suites on Linux and catalogue every result.
  (1) The root Cargo workspace (engine, protocol/data-plane, protocol/skp, renderer, kernel):
      `cargo build --workspace` and `cargo test --workspace`, default tests only. List the #[ignore]d
      tests by name without running them. Do not generate the 5 GB fixture.
  (2) The bundle viewer: renderer/bundle-viewer, its own install, build and test scripts.
  (3) The shell's TypeScript suite: frontends/shell, its install, typecheck and test scripts. Do not
      build the Tauri application.
  (4) Optional and environment-only: try `cargo check` for frontends/shell/src-tauri after installing
      the system packages Tauri documents for Linux. Record the result either way.
Categorise every failure as: deterministic product failure | Linux-specific failure | environment or
setup failure | platform assumption in code or tests | flaky or uncertain (rerun twice, record all
outcomes). For each, give the exact test or target, the command, and a short log excerpt. Do not
modify any file to make anything pass.

NEVER WRITE OR MODIFY: anything in the repository. This session makes no commits and opens no PR.

STOP AND REPORT, rather than improvise, if: a step would require editing a file, adding a dependency,
or deciding anything.

NETWORK: package registries and the operating system's package repositories only.
PLATFORM: this is Linux evidence only. It says nothing about Windows or product verification.

OUTPUT: your final message is the WAVE1 REPORT (§3 schema, worker fields; "Findings" = the failure
catalogue, with the categories above), plus the exact toolchain versions and total wall time per
suite.
```

## 8. What stays true after the promotion

The report schema, the S1/S2/S3 triage rule and the pinned-baseline discipline are worth keeping for any worker that lacks the custodian's context. None of it depends on the credit.
