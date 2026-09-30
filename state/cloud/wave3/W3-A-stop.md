# Wave 3, W3-A (one batch: W3-A+W3-B+W3-C): the session's first report, a stop

**Source:** session_017msPRjkMFYd5Zn4FxukM4r, the first assistant turn, which ends with the WAVE3 REPORT that stops on the lens file missing at the baseline (Deviation 1, `state/cloud/wave3.md`). Its own page timestamp was not read; it precedes the human's reply, timestamped 2026-09-30T07:32:36Z. Fable on Deviation 1 (`state/directives/2026-09-30-fable-wave3-deviation-1.md`) reads it as a stop, not a result. The result is `state/cloud/wave3/W3-A.md`. Copied at 2026-09-30T07:36:06Z (the saved copy's write time) with the message's own Copy action in claude.ai/code, and saved with LF line endings: 55 lines, sha256 4aacbcd3c314d266f461c83629f376f7bab88ff783e7ef742a4ab8f8e2ffed99. Everything between the two rules below is the session's text, verbatim. The WAVE3 REPORT proper begins at `# WAVE3 REPORT`, and the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally at triage, after the batch ends, per `state/cloud/wave1-prompts.md` §3, carried into wave 3 by `state/cloud/wave3-prompts.md` §1. The saved text scans clean under the profile-path scanner's `--message` mode.

---

The lens file isn't at the baseline commit: it was filed one commit later. I'm confirming that and gathering a raw, unclassified list of hits before I stop and report.

Now a raw hit inventory at baseline (lens-independent evidence only).

# WAVE3 REPORT
## Worker fields
Item: A (portability audit)          Lens/purpose: accidental Windows coupling and false platform guarantees, read against `state/directives/PORTABILITY-2026-09-30.md` §1, §2 and §8. **Stopped before the audit because that lens file is not in the baseline.**
Baseline SHA: a02354677d6c03aaed4b2dbdf4d14b09621d5766 (confirmed by `git -C /tmp/wave3-baseline rev-parse HEAD`)
Branch: none   Commits: none
Environment: Linux container (kernel 6.18.44). Nothing was built, so I did not collect rustc, cargo, node or npm versions. Network used: one `git fetch` from origin; no package registries.
Commands run:
- `git worktree add /tmp/wave3-baseline a02354677d6c03aaed4b2dbdf4d14b09621d5766`: exit 0
- `git -C /tmp/wave3-baseline rev-parse HEAD`: exit 0, output a02354677d6c03aaed4b2dbdf4d14b09621d5766
- `ls state/directives` in the worktree: exit 0. The PORTABILITY file is not listed.
- `git merge-base --is-ancestor a023546 cf86d60`: exit 0, so cf86d60 comes after the baseline
- `git diff --stat a023546 cf86d60`: exit 0. It changes only CUSTODIAN-QUEUE.*, PLAN.yaml, site/ and state/, and no product code.
- a read-only `grep -rn` inventory of the product directories: exit 0
- I did not run the DCO hook proof, because nothing was going to be committed.

Findings: 0 (the audit was not performed; this is not a clean result)

### Classified hits
**Not classified.** The class (1) boundary table and the class (2) §8 deferrals are both in the missing lens, so classifying would mean either reasoning from a later commit or making up the boundary. Below is the raw baseline inventory, for use once the lens is available at the baseline:
- OS-conditional Rust:
  - engine/src/lod.rs:902, 931
  - engine/src/watch.rs:86, 90, 102
  - kernel/src/publish/error.rs:396, 398, 401, 403
  - kernel/src/permission/boundary.rs:530
  - kernel/src/permission/audit/normalize.rs:178, 182, 284
  - kernel/src/permission/audit/log.rs:367, 371, 389
  - protocol/transport-bakeoff/src/memory.rs:18, 47, 75
  - frontends/shell/src-tauri/src/origin.rs:172
- Windows environment variables in shared logic:
  - engine/src/lod.rs:1143 reads `LOCALAPPDATA` with no `cfg`. On macOS and Linux it gives a typed refusal (see the comment at lod.rs:147 and lod.rs:200).
  - kernel/src/permission/audit/log.rs:369–375 is the second app-directory resolver (`LOCALAPPDATA` on Windows, `XDG_DATA_HOME` or `HOME` otherwise).
  - kernel/src/permission/audit/normalize.rs:111–116 lists the redaction roots: USERPROFILE, HOME, LOCALAPPDATA, APPDATA, TEMP, TMP.
- Frontend and e2e scripts:
  - Hard-coded `C:\dev\...` fixture paths in frontends/shell/e2e: console.mjs:53, publish.mjs:53, debug-session.mjs:20, regression.mjs:58–68, source-watch-idle.mjs:86, pan-anchor.mjs:47, style.mjs:78, admission-remediation.mjs:50–56, filter-panel.mjs:38–39, source-changed.mjs:211, residency-harness.mjs:109, refusal-contract-baseline.mjs:67–70, filter.mjs:27.
  - Log-directory lookups keyed only on `LOCALAPPDATA`: regression.mjs:1837, source-watch-idle.mjs:133, source-changed.mjs:286, residency-harness.mjs:107.
  - frontends/canvas-probe/scripts/run-probe.mjs:184 reads `navigator.userAgent`.
  - My grep found no `metaKey`, `ctrlKey` or `navigator.platform` in product TypeScript.
- §1c's two known gaps are consistent with this inventory: the two app-directory resolvers are lod.rs:1143 and audit/log.rs:367–375, and the OS-keyed case policy is probably audit/normalize.rs:178/182. I have not confirmed or corrected them against §1c, because I have not read it.

### Unproven observations (not findings; at most five, one line each)
- engine/src/lod.rs:1143 probably means LOD tiers always refuse on macOS and Linux. This may already be deferred in the lens's §8; I have not verified it.
- The e2e harness log lookups (regression.mjs:1837 and others) return null off Windows, so any check that depends on the session log is skipped rather than failed.

### Stops (if any): the lens file is missing at the baseline
`state/directives/PORTABILITY-2026-09-30.md` does not exist at a02354677d6c03aaed4b2dbdf4d14b09621d5766. It was added in cf86d604ba7e1b696bc9a0f4b89b0cac04a3f48e, the next commit after the baseline, 13 minutes later, together with the port-1 to port-4 PLAN nodes that the false-positive check also depends on.

The task tells me to read that file's §1, §2 and §8 first, and also forbids reasoning from later commits. I can't do both, so I stopped instead of choosing one. cf86d60 changes no product code, so the custodian could either:
- re-pin the baseline to cf86d60 (identical product code, lens present), or
- explicitly authorise reading the lens from cf86d60 while auditing a023546.

Either way, the wave can re-run unchanged. The worktree is still at /tmp/wave3-baseline, and nothing was committed or pushed.

---

## Custodian fields (filled locally, never by the worker)

Session ID: session_017msPRjkMFYd5Zn4FxukM4r   Model: Opus 5.5, Medium (as launched)   Launched/ended: 2026-09-30T07:22Z / this stop precedes the human's reply of 07:32:36Z, and the session continued to its result.
Spend: not individually attributable. The batch's single delta is recorded in `state/cloud/wave3.md` (Fable on Deviation 1: one delta for the batch).

**Disposition: a stop, not a result** (Fable on Deviation 1, `state/directives/2026-09-30-fable-wave3-deviation-1.md`). It carries no finding to triage. Its stop was correct, and its raw inventory is superseded by the classified hits of the session's result, `state/cloud/wave3/W3-A.md`.
