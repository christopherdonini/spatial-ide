# root: DuckDB compiles again on GitHub's current Windows image, in the three workflows with a Windows job — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline, after the human's message approving ADV-2026-11-20-25 is on main (ADV-2026-11-21-13 item 1). The plan node ci-windows-duckdb-compiles-on-the-current-image, placed in slot 1 by the advisor's ruling ADV-2026-11-21-13 under the human's delegation of 2026-11-13, filed at `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-13-the-humans-four-approvals-placed-the-ci-piece-in-slot-1-the-stop-alarm-resumes-item-68-meets-the-limitation-s8-joins-p6.md`. Its class is the five-line form and the reviewer alone, with the standard worker (that ruling, item 3 (a)). What CI installs is the human's: the approval of ADV-2026-11-20-25, filed at `state/directives/2026-11-21-the-humans-message-four-drafts-approved-s8s-words-to-the-advisor-the-ci-change-v0-2-without-the-console-and-mint-window-nodes-the-stop-alarms-check-d.md` ("the approval"), whose text below its rule is the human's words by that approval. It is not added to what v0.2 waits for. Drafted by the custodian.

```
Authority: PLAN node ci-windows-duckdb-compiles-on-the-current-image; the approval, items 1 to 5; ADV-2026-11-21-13 item 3 (a) to (g); ADV-2026-11-20-24, which stands until this piece merges (state/directives/2026-11-20-advisor-ruling-adv-2026-11-20-24-the-red-shell-run-at-37fc83bc-says-nothing-of-the-test-executable-22-item-10-replaced-what-stands-until-the-ci-piece.md); reuse index: three misses, no prior art recorded for clang-cl llvm version pin, duckdb windows ci build or github actions windows image label (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form).
Scope: 3 files, .github/workflows/product-ci-shell.yml, .github/workflows/product-ci-rust.yml and .github/workflows/tauri-build.yml, in their Windows jobs alone; declared line budget <= 60 changed lines in the merged diff by §21c's counting, this form excluded. Block on sight (ADV-2026-11-21-13 item 3 (b)): any other workflow, release-artifacts.yml among them; .cargo/config.toml; the Rust toolchain; a dependency; a lockfile; an action's version; a cache key in the merged state; anything under .claude/. If the fix cannot be made inside this list, the piece stops and goes to the advisor.
Change: one of the approval's two routes, not both, as step 1's report names it and the advisor reads it: either each Windows job installs LLVM 22 or newer at one pinned version before its first build step, from the LLVM project's own release or from the runner's package manager at an exact version, a direct download checked against a sha256 written in the workflow; or each Windows job runs on one pinned image label, as GitHub documents it, on which DuckDB compiles with the image's own Clang. The observable change: a Windows job that compiles libduckdb-sys, rather than restoring it from the Rust cache, no longer stops at STL1000. One comment line above each changed step names the approval; a header sentence the route makes untrue is corrected in the same file and named in the PR body; nothing else in the jobs changes.
Tests+mutation: no test is added, changed or removed, so no mutation is owed. Step 1, the probes, on a branch of their own, cut/ci-windows-duckdb-probe, never merged, with a draft pull request only if one is needed to start the workflows; its report goes to the advisor before the fix is committed and names what ADV-2026-11-21-13 item 3 (c) lists, the time a Windows job takes without the cache among it. Step 2, on the piece's branch, cut/ci-windows-duckdb-compiles, as step 1 confirms it (item 3 (d)): the fix commit; then one commit that turns the Rust cache step off in the Windows jobs, whose runs are the evidence, one for each of the three workflows' Windows jobs, each log showing libduckdb-sys compiled and the job passed; then one commit that puts the cache step back exactly, so that the head differs from main by the fix alone. No cache of the repository is deleted; no reset, amend or rebase; another way goes to the advisor before it is used. The PR body names what the approval's item 3 asks and links the evidence runs (item 3 (e)).
Out-of-scope: ADR: none. Security: what CI installs, under the approval alone. Wire: none, nothing under protocol/. Guarantee: none. No product code, no string the app shows, no Guardian, mod or settings file; the Ubuntu and macOS entries of product-ci-rust.yml's matrix keep every step, their cache included; no job's timeout, trigger, path filter or concurrency changes in the merged state, and a cache-off run that would need one changed goes to the advisor first.
```

### §A. The rulings (by reference)

The approval's items 1 to 4 are what may change, and its item 5 places the class and the merge check with the advisor. ADV-2026-11-21-13 item 3 (f) is what the reviewer reads: the diff against the approval's items 1 to 4, the pin and its source, and the evidence runs' logs for the line that shows DuckDB being compiled. By its item 3 (g), ADV-2026-11-20-24 stands until this piece merges: a Windows job red at STL1000 is not green, and a Guardian refusal of a workflow edit is not worked around but goes to the advisor.

### §B. What is not proven

That the chosen route holds on the next image GitHub publishes. A pinned version or label holds what this piece's runs show, on the day they ran.

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-21 — the probes: both routes work; the report to the advisor before the fix

*Written by the custodian after the probes, before any fix. References only; nothing below is a quotation.*

1. **The probes** (ADV-2026-11-21-13 item 3 (c)), on cut/ci-windows-duckdb-probe, never merged. Probe 1 at a8f79cab ran the three Windows jobs on the image label windows-2022. Probe 2 at 157c2878 ran them on windows-latest with LLVM 23.1.6 installed from the LLVM project's release, its sha256 checked in the step against the value written there. In each, the Rust cache step was skipped, DuckDB was compiled, and all three Windows jobs passed with no STL1000 line (the worker's report, state/consults/2026-11-21-ci-windows-duckdb-compiles-on-the-current-image-probe-worker-report.md).

2. **Read by the custodian.** At each probe commit, three runs, all completed with success; the six Windows jobs passed, each on the label the report gives, their cache steps skipped; the installer's size and digest equal to the release's asset listing.

3. **What the report gives for item 3 (c).** LLVM 23.1.6, the release's Windows installer, checked by the sha256 of the release's asset digest, since the release notes give none; windows-2022 with Visual Studio 2022 17.14.37906.3 and Clang 20.1.8; the events that start each workflow; each Windows job's time without the cache, about 3 to 6 minutes longer on the LLVM route. Not shown: the MSVC toolset folders of windows-2022, which the probe's listing stopped short of.

4. **Next.** The report goes to the advisor before the fix. The fix takes one route, not both, by the human's approval of ADV-2026-11-20-25; which one is the advisor's to say.

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-21 — the fix, the evidence and its undoing; the stop at R; the key rename drafted for the human

*Written by the custodian after the worker's stop. References only; nothing below is a quotation.*

1. **The commits** (ADV-2026-11-21-18 items 2 and 3), on cut/ci-windows-duckdb-compiles, with no pull request: 132a0a7e, the fix, 12 lines added and 6 removed in the three workflows; 96a7c36c, the Rust cache off in the Windows jobs and a step printing Clang and the MSVC toolsets; 0ce16549, that commit undone by a revert. The fix's tree equals the head's. The worker's report: state/consults/2026-11-21-ci-windows-duckdb-compiles-fix-worker-report.md.

2. **At the evidence commit** (item 4), the three Windows jobs passed on the label windows-2022, image version 20261116.370.1, each with its cache step skipped, libduckdb-sys compiled and no line holding STL1000: the shell job, the tauri build and the Rust workspace's Windows entry. Clang 20.1.8; the MSVC toolsets 14.29.30133 and 14.44.35207. Ubuntu and macOS passed.

3. **At the head, the stop.** The Rust workspace passed: its key follows the label, so no cache was found and it built afresh. The shell job and the tauri build failed in the link with a cache restored under each kept key, built on the other image: unresolved standard-library symbols from the restored libduckdb_sys library, LNK2019 and LNK1120. Nothing was re-run, deleted or changed after it.

4. **The advisor's ruling ADV-2026-11-21-22**, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-22-the-ci-stop-waits-for-the-humans-key-rename.md: the reading stands; renaming the two keys lies outside the human's approval of ADV-2026-11-20-25 and is drafted for them as ADV-2026-11-21-21 (state/consults/2026-11-21-advisor-draft-adv-2026-11-21-21-the-two-cache-keys-name-the-image-not-the-humans-words.md); until their line is filed nothing changes on the branch, and no cache is deleted; slot 1 goes to the sitting script meanwhile.

5. **Next.** On the human's approval: an amendment before the key commit, the commit, the two cold builds as evidence, the checklist of ADV-2026-11-21-20 item 3, and the reviewer (ADV-2026-11-21-22 item 4). Without it, the piece goes back to the advisor.

Read the last amendment first.

Nothing above is edited.

### Amendment 3 — 2026-11-21 — the human's approval of ADV-2026-11-21-21; the key commit next

*Written by the custodian before the key commit. References only; nothing below is a quotation.*

1. **The approval.** The human approved ADV-2026-11-21-21 in the custodian's session at 2026-11-21T15:32:03Z, filed at state/directives/2026-11-21-the-humans-message-adv-2026-11-21-21-approved-and-the-alarm-test-line.md, the draft's text below their message. The advisor's ruling ADV-2026-11-21-23, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-23-the-humans-second-line-is-the-alarm-line.md, item 4: the order of ADV-2026-11-21-22 item 4 stands and starts with this amendment.

2. **The commit, to come, one after 0ce16549.** In product-ci-shell.yml and tauri-build.yml alone: the shell job's written Rust cache key becomes windows-2022-shell and the tauri build's becomes windows-2022-shell-tauri-build; beside each, the comment line saying the key keeps its old name is replaced by one comment line naming the approval. Nothing else changes; no cache is deleted; no reset, amend or rebase (ADV-2026-11-21-13 item 3).

3. **The evidence.** The runs at that commit: in each of the two jobs the log shows the cache not found, libduckdb-sys compiled and the job passed. The pull request's body links them.

4. **Then** the checklist of ADV-2026-11-21-20 item 3 in a build amendment, and the reviewer alone (ADV-2026-11-21-13 item 3 (a)).

Read the last amendment first.

Nothing above is edited.
