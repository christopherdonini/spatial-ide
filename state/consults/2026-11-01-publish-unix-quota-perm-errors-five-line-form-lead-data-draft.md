*Custodian's filing note (2026-11-01): lead-data's read-only draft of the five-line form for `publish-unix-quota-perm-errors`, the filler queue's entry 7c (S3), read at main b1bdb8ac (dispatched 2026-11-01T03:04:02Z by the main transcript, its prompt equal to its brief by script). Its form is committed in the same commit at its governance path, with the custodian's settlement. The run 03:04:03Z to 03:12:09Z by its transcript (Read 22, Grep 20, Glob 7; no write tool); 4 of its Glob calls looked for the Rust standard library's and a package's source in the toolchain and package-registry folders under the user profile and matched nothing. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 5af21e548a60da035bf80652f33b13655ab2f191fe8ee5f221a0f14ad841eec2.*

---

Draft: publish-unix-quota-perm-errors five-line form, lead-data

Read only, at main b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3. I have no shell, so this report carries no sha256. Everything below is my own wording except identifiers in backticks and the reuse-index words, which are copied from the brief. Every cite is `path:line @ b1bdb8ac`.

## The form

Form path: `governance/forms/kernel/PUBLISH-UNIX-QUOTA-PERM-ERRORS-PREREGISTRATION.md`. The custodian commits it on main before any code.

```
Authority: PLAN node `publish-unix-quota-perm-errors` (governance/PLAN.yaml:3825-3841 @ b1bdb8ac), filler queue entry 7c (state/FILLER-QUEUE.md:21 @ b1bdb8ac), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ b1bdb8ac); the observation is wave-3 W3-A unproven observation 1 (state/cloud/wave3/W3-A.md:166 @ b1bdb8ac) with its custodian triage (state/cloud/wave3/W3-A.md:196 @ b1bdb8ac), routed out of port-1 by its drafting consult (state/consults/2026-10-02-port-1-linux-l1-architect-draft.md:72 @ b1bdb8ac, state/consults/2026-10-02-port-1-linux-l1-architect-draft.md:383 @ b1bdb8ac); reuse index: a miss, no prior art recorded for "errno quota permission classification" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief).
Scope: kernel/src/publish/error.rs; scripts/plan/cfg-boundary.test.mjs (its three pinned site counts only); kernel/README.md (owner's index: this form in the preregistration list, the Last-verified bullet); 3 files; declared line budget 100 by §21c's counting rule (estimate 70: product 12, tests 48, the check's test 6, README 4).
Change: `classify_io` gains a third per-platform table, `QUOTA_EXCEEDED`, holding EDQUOT (122 on Linux, 69 on macOS, empty on every other target). A raw EDQUOT now classifies as `PublishError::InsufficientSpace`, the class Windows' disk-full codes 39 and 112 take, where today it falls to `Io`. Windows' tables and its classification are unchanged. EPERM (1 on both) already reaches `DestinationNotWritable`, the class of Windows' ACCESS_DENIED (5), through the existing `PermissionDenied` kind fallback. It gains a test and no table entry.
Tests+mutation: T1 `kernel/src/publish/error.rs::tests::a_quota_overrun_is_insufficient_space_on_linux_and_macos` (Linux and macOS; ignored elsewhere with a reason naming the OS error classification boundary). M1: the `|| QUOTA_EXCEEDED.contains(&c)` clause is removed from the disk-full arm. Predicted failure: T1's panic naming EDQUOT 122 as classified `Io` on the Linux L1 job. T2 `kernel/src/publish/error.rs::tests::eperm_is_destination_not_writable_on_unix` (unix; ignored on Windows with a boundary reason). M2: the `PermissionDenied` kind-fallback arm is deleted. Predicted failure: T2's panic naming EPERM 1 as classified `Io` on the Linux L1 job; the existing `permission_denied_classifies_even_when_the_raw_code_is_unknown_here` fails as well on every job. T3 `kernel/src/publish/error.rs::tests::another_platforms_quota_errno_is_not_a_quota_failure_here` (all platforms). M3: the Linux table becomes `&[122, 69]`. Predicted failure: T3's panic naming 69 as classified `InsufficientSpace` on the Linux L1 job. Changed, not new: `scripts/plan/cfg-boundary.test.mjs::the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site`, its counts re-pinned from 18 to 21 sites and kernel/src/publish/error.rs from 6 to 9; its recorded M1 stands. Proven on the Linux L1 job (.github/workflows/product-ci-rust.yml:196-197 @ b1bdb8ac, .github/workflows/product-ci-rust.yml:233-234 @ b1bdb8ac); T1 and T2 appear in Windows' printed ignored list (.github/workflows/product-ci-rust.yml:238-240 @ b1bdb8ac).
Out-of-scope: ADR: none (no status line or amendment). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs). Wire: none (a publish code crosses the Tauri boundary as `refusal_detail`, kernel/src/publish/error.rs:298-300 @ b1bdb8ac, and no SKP, data-plane or MCP surface is touched). Guarantee: TOUCHED. The OS error classification row, graded supported on all three platforms (state/directives/PORTABILITY-2026-09-30.md:42 @ b1bdb8ac), becomes true for quota overruns on Linux and macOS. A property under test, the cfg-boundary site count (scripts/plan/cfg-boundary.test.mjs:73 @ b1bdb8ac, scripts/plan/cfg-boundary.test.mjs:75 @ b1bdb8ac, scripts/plan/cfg-boundary.test.mjs:88 @ b1bdb8ac), is re-pinned. §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch. No new dependency, no `unsafe`, no new string, no new `pub` item.
```

## Notes

**N1. Size against §21c, settled first**
- The bounds are 150 changed lines with tests counted, 8 files, no new exposure surface, no new dependency and no new user-visible behaviour (governance/AUTONOMY.md:350-351 @ b1bdb8ac). The counting rule and the exempt form are at governance/AUTONOMY.md:357 @ b1bdb8ac.
- My estimate:
  - error.rs product code: 12 lines (3 cfg attributes, 3 consts, a short doc addition, one match line changed).
  - The three tests: 48.
  - cfg-boundary.test.mjs: 6 (3 lines changed).
  - kernel/README.md: 4 (2 lines changed).
  - Total about 70 lines over 3 files. The declared budget of 100 leaves room.
- The other three bounds:
  - Dependency: none (N3).
  - Exposure surface: none. No process is spawned, no file is read and nothing new is listened on.
  - User-visible behaviour: OPEN-3.

**N2. The defect and the classifier**
- The classifier is at kernel/src/publish/error.rs:482-533 @ b1bdb8ac. Its tables:
  - Windows: kernel/src/publish/error.rs:492-495 @ b1bdb8ac.
  - Unix, ENOSPC 28 and EACCES/EROFS 13 and 30: kernel/src/publish/error.rs:497-500 @ b1bdb8ac.
  - Other targets: kernel/src/publish/error.rs:502-505 @ b1bdb8ac.
- The match and its kind fallback are at kernel/src/publish/error.rs:507-532 @ b1bdb8ac (the `PermissionDenied` arm at :518-526).
- The doc on why the tables stay separate per platform is at kernel/src/publish/error.rs:484-487 @ b1bdb8ac. The portability plan keeps this file as the pattern (state/directives/PORTABILITY-2026-09-30.md:28 @ b1bdb8ac).
- The observation cites error.rs:401-404 at its audit baseline. At b1bdb8ac those lines are :497-500.
- The existing tests are at kernel/src/publish/error.rs:535-569 @ b1bdb8ac. All are declared unchanged.

**N3. No new dependency (a red line), and how the piece does without one**
- The kernel's dependencies are at kernel/Cargo.toml:18-34 @ b1bdb8ac. None of them is an errno source.
- `libc` is in the lock (Cargo.lock:1179-1180 @ b1bdb8ac) only as another crate's dependency. Naming it in kernel/Cargo.toml would be a new dependency edge. The getrandom precedent at kernel/Cargo.toml:32-33 @ b1bdb8ac does not make that free.
- The piece uses integer literals, one per platform, as the existing tables already do. Each is checked against std's own errno mapping in T1, so nothing outside std is needed.

**N4. Which class each errno joins (my reading)**
- **EDQUOT** (Linux 122, macOS 69; values from state/cloud/wave3/W3-A.md:166 @ b1bdb8ac) joins `InsufficientSpace`.
  - That variant is documented as the filesystem running out of room, detected at write time (kernel/src/publish/error.rs:37-45 @ b1bdb8ac).
  - A quota overrun is the same condition for this writer. W3-A says Windows reports disk full for a quota overrun. That is unverified here.
  - The Windows table names no quota code. ERROR_DISK_QUOTA_EXCEEDED, which I recall as 1295 and did not verify, is absent from it.
- **EPERM** (1 on Linux and macOS) belongs in `DestinationNotWritable` (kernel/src/publish/error.rs:29-35 @ b1bdb8ac), beside EACCES and EROFS. Windows' ACCESS_DENIED (5) sits there too.
  - I recall, and cannot verify here because the tree has no std source, that std maps a raw EPERM to `ErrorKind::PermissionDenied`.
  - If so, the fallback at :518-526 already classifies it, and the observation's EPERM half is already met. T2 settles this on the L1 job.
  - Contingency, declared now: if T2 fails on the L1 job, my recollection is wrong. Then `1` joins the unix `NOT_WRITABLE` table on its existing line (no new cfg site), recorded as an amendment, and M2 becomes removing it. See OPEN-2.
- **Windows** is unchanged. Its lines :492-495 stay byte-identical, and the third arm gives it an empty `QUOTA_EXCEEDED`.

**N5. Why per-OS raw tables (Route B), and what they cost**
- An EDQUOT that differs between Linux and macOS needs `target_os` cfgs. Three new sites go in error.rs, which is already on the allowlist (scripts/plan/cfg-boundary.mjs:27-33 @ b1bdb8ac, :32).
- No allowlist entry is added. The check's test pins every site, though (scripts/plan/cfg-boundary.test.mjs:65-90 @ b1bdb8ac), so its counts are re-pinned in this piece. That is the third Scope file and the rule (00) question below.
- Test-module cfgs are not counted (scripts/plan/cfg-boundary.mjs:10-15 @ b1bdb8ac, :157-171), so the tests' gating adds no sites.
- The alternatives are in OPEN-1.

**N6. What a user sees (my reading)**
- The existing messages:
  - `InsufficientSpace`: kernel/src/publish/error.rs:320-325 @ b1bdb8ac.
  - `DestinationNotWritable`: kernel/src/publish/error.rs:316-319 @ b1bdb8ac.
  - The codes `publish.insufficient_space` and `publish.destination_not_writable`: kernel/src/publish/error.rs:263-264 @ b1bdb8ac.
  - The audit reader's plain reasons: kernel/src/permission/audit/reader.rs:254-256 @ b1bdb8ac.
- These are now reached by EDQUOT on Linux and macOS in place of the `Io` message and the `publish.io` code (kernel/src/publish/error.rs:265 @ b1bdb8ac, :326-327).
- The audit outcome stays `Failed`, because all three variants are in the failed set (kernel/src/permission/boundary.rs:306-311 @ b1bdb8ac). `error_kind` names the variant (kernel/src/permission/boundary.rs:225-227 @ b1bdb8ac).
- No client matches any of the three codes: a grep of the tree outside target and node_modules finds them only in error.rs.
- No new string. No product ships off Windows (KNOWN-LIMITATIONS.md:14-17 @ b1bdb8ac). Linux is L1 for the Cargo workspace only (KNOWN-LIMITATIONS.md:27 @ b1bdb8ac).
- Whether this is new user-visible behaviour is OPEN-3. The wording question is OPEN-4.

**N7. Callers of the classifier, all unchanged**
- kernel/src/publish/mod.rs:1492-1498 @ b1bdb8ac (staging directory)
- :1508-1514 (bundle directory)
- :1580-1581 (create)
- :1586-1588 and :1594-1595 (write)
- :1610-1611 (flush)
- :1615-1616 (sync)
- :1658-1664 (finalize rename)
- kernel/src/permission/audit/normalize.rs:180 @ b1bdb8ac names it in a doc comment only.

**N8. Test design**
- **T1**
  - The test picks `edquot` as 69 on macOS and 122 otherwise, through `cfg!` in the test body.
  - It first asserts `std::io::Error::from_raw_os_error(edquot).kind() == std::io::ErrorKind::QuotaExceeded`. This is an oracle independent of the product table: a wrong literal fails by name before the classification is checked.
  - It then asserts `classify_io` gives `InsufficientSpace` with `raw_os_error == Some(edquot)`.
  - Assumption: `ErrorKind::QuotaExceeded` is stable on CI's `@stable` toolchain (.github/workflows/product-ci-rust.yml:205 @ b1bdb8ac). I recall it was stabilised in 1.85, unverified here.
- **T2:** a raw 1 gives `DestinationNotWritable` with `raw_os_error == Some(1)`. It is ignored on Windows, where 1 is a different code.
- **T3** keeps the separate-tables principle (kernel/src/publish/error.rs:484-487 @ b1bdb8ac) under test:
  - On Linux, 69 is not `InsufficientSpace`.
  - On macOS, 122 is not.
  - On Windows, neither 69 nor 122 is. This also guards Windows staying unchanged.
  - In every case the raw code stays visible.
- **Declared unchanged:** the three existing error.rs tests, kernel/tests/publish.rs and every cfg-boundary test except the re-pinned one.
- **Invalidators:**
  - Any existing test changing outcome on either job.
  - Windows' `--list --ignored` gaining anything beyond T1 and T2.
  - T1's std oracle failing on the L1 job, which would mean the observation's value is wrong. The piece stops.

**N9. The Platform item (R3: state/directives/PORTABILITY-2026-09-30.md:49-54 @ b1bdb8ac; template docs/PREREGISTRATION-TEMPLATE.md:177 @ b1bdb8ac)**
- **Owning boundary:** OS error classification, kernel/src/publish/error.rs (state/directives/PORTABILITY-2026-09-30.md:42 @ b1bdb8ac). It already exists, so the architect adds nothing.
- **Windows:** supported, unchanged. T3 runs. T1 and T2 are ignored with reasons naming the boundary (R6, state/directives/PORTABILITY-2026-09-30.md:65 @ b1bdb8ac).
- **Linux:** supported. EDQUOT 122 gives `InsufficientSpace`, and EPERM 1 gives `DestinationNotWritable`. T1, T2 and T3 run on the ubuntu-24.04 L1 job.
  - Disclosed: 122 is the generic Linux value. Linux architectures that number EDQUOT differently are not built here (my recollection: MIPS, Alpha, SPARC, PA-RISC). T1's oracle would fail there by name.
  - Android is not `target_os = "linux"`, so it takes the empty arm.
- **macOS:** supported by code (69, and EPERM 1). It is compiled and tested only once a macOS L1 job exists, which is port-2's work and in flight. Until then it is code-path-only, and the deferral is recorded in this form (OPEN-5).
- No KNOWN-LIMITATIONS item is owed: nothing is reduced, and KL 1 is unchanged.

**N10. Rule (00): the piece's paths against the in-flight list**
- **kernel/src/publish/error.rs.** Not among the kernel paths of `cut/b2-piece-1c-save-and-reopen` or `cut/port-2-macos-l1-and-app-dirs`. #273, #272, #271 and `cut/b1-shell-half-pr-c` list nothing under kernel/. Clear on the list given.
- **kernel/README.md.** Not among the listed kernel paths of any branch. Clear on the list given.
- **scripts/plan/cfg-boundary.test.mjs.** Not determinable from the list, which gives only kernel/ paths.
  - 7a's settlement records that at 0f6c62a4, `cut/port-2-macos-l1-and-app-dirs` edited `scripts/plan/cfg-boundary.mjs` and its test (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:102 @ b1bdb8ac).
  - If that still holds, Route B collides by rule (00). This is the first blocking question.
- **The form itself,** governance/forms/kernel/PUBLISH-UNIX-QUOTA-PERM-ERRORS-PREREGISTRATION.md. New, on main, by the custodian.
- I cannot see the docs and governance lanes' paths.
- 7c's earlier skip reason (#241) is recorded at state/FILLER-QUEUE.md:21 @ b1bdb8ac. #241 has merged, per 7a's form at governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:71 @ b1bdb8ac.

**N11. Record notes**
- The PLAN summary calls this a user-visible error class change (governance/PLAN.yaml:3840 @ b1bdb8ac). The node title names EPERM as missing (governance/PLAN.yaml:3826 @ b1bdb8ac). N4 explains why EPERM may already be classified.
- The owner's index lists this module's forms at their old `kernel/...` paths (kernel/README.md:387-389 @ b1bdb8ac). None of those paths exists at main; they resolve through governance/MOVED.tsv (for example governance/MOVED.tsv:104 @ b1bdb8ac). See OPEN-6.

## OPEN items, each with options and my recommendation

None is a red line, except option (B) of OPEN-4.

- **OPEN-1: how EDQUOT is classified.** Recommendation: (B).
  - (B) Per-OS raw tables, as drafted. Windows is unchanged, and the shape follows the explicit-table pattern the portability plan keeps. It adds 3 cfg sites and re-pins the check's test, which raises the rule (00) question.
  - (A) A kind arm, `e.kind() == ErrorKind::QuotaExceeded`, mapped to `InsufficientSpace`. It needs no cfg and edits no test file, and std's mapping is right on every architecture. But on Windows a raw ERROR_DISK_QUOTA_EXCEEDED (by my recollection std maps it to that kind) would move from `Io` to `InsufficientSpace`. That is a user-visible change on the supported platform and against the brief's "Windows unchanged".
  - (C) Restructure the six existing cfg'd consts so the site count stays at 6. This bends product code to fit a pinned count, and it rewrites the Windows lines.
  - If rule (00) collides, I recommend skipping 7c at dispatch: it keeps its place (state/FILLER-QUEUE.md:3 @ b1bdb8ac) and re-pins on port-2's numbers after that merges. I do not recommend falling back to (A).
- **OPEN-2: EPERM.** Recommendation: (A).
  - (A) EPERM is left to std's `PermissionDenied` mapping and pinned by T2, with the N4 contingency.
  - (B) `1` is also listed in the unix `NOT_WRITABLE` table. That follows the observation's letter, but while the kind arm stands, no mutation of that entry can fail a test.
- **OPEN-3: is EDQUOT reaching existing classes "new user-visible behaviour" under §21c?** Recommendation: (A), the same shape as 7a's ruled OPEN-2 (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:100 @ b1bdb8ac).
  - (A) Not new. The variants, messages, codes and audit outcome all already exist, there is no new string, and no product ships off Windows. The filler stands with both gates from dispatch under §36.
  - (B) New. The piece leaves the filler slot for the full form and full gating.
- **OPEN-4: the existing `InsufficientSpace` message says the filesystem is full, which is not literally true for a quota overrun.** Recommendation: (A).
  - (A) Reuse it unchanged. The OS detail it carries names the quota, and the P6 sitting may reword the shared message.
  - (B) A quota-specific sentence. **A red line:** it is a new P6 string under item 4 of the 2026-10-31 direction (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ b1bdb8ac). It is also new user-visible behaviour and adds lines.
- **OPEN-5: macOS.** Recommendation: (A).
  - (A) The arm ships, code-path-only until a macOS L1 job exists, with the deferral in this form. T1's oracle checks the value when that job first runs.
  - (B) No macOS arm. macOS stays `Io` and explicitly reduced until macOS L1.
- **OPEN-6: the owner's-index update.** Recommendation: (A).
  - (A) Add only this form, at its governance path, and the Last-verified note. The old paths resolve through MOVED.tsv, and re-pathing them is a separate index update.
  - (B) Re-path lines 387-389 in the same edit. That adds about 2 changed lines and touches pointers this piece does not change.

## What I could not settle

- Whether any in-flight branch, PR, docs lane or governance lane edits `scripts/plan/cfg-boundary.test.mjs` at b1bdb8ac. Route B depends on this (N10).
- My recollections of std, all unverified here: std maps EPERM to `PermissionDenied` and EDQUOT to `QuotaExceeded`, and `ErrorKind::QuotaExceeded` is stable on CI's toolchain. T1 and T2 prove the first two on the L1 job, and the first push proves the third.
- Whether Windows really reports a quota overrun as 112 or 39 (W3-A's claim). This piece neither depends on it nor tests it.
- Confirmation that "guarantee: touched" here is not a red line, as the human ruled for 7a.
- No sha256: I have no shell.

---
Result: drafted the 7c five-line form, read only at b1bdb8ac: Route B (EDQUOT gets per-OS raw tables, EPERM is pinned through the existing kind fallback), 3 files, budget 100, no new dependency, no new string.
Blocking question: does `cut/port-2-macos-l1-and-app-dirs`, or any other in-flight branch, PR or lane, still edit `scripts/plan/cfg-boundary.test.mjs` at b1bdb8ac? If so, Route B collides under rule (00).
Blocking question: please confirm that "guarantee: touched" (the PORTABILITY R2 row made true, the cfg-boundary count re-pinned) is not a red line, as ruled for 7a.
Report path: C:/dev/spatial-ide/state/consults/2026-11-01-publish-unix-quota-perm-errors-five-line-form-lead-data-draft.md
sha256: none (no shell).
