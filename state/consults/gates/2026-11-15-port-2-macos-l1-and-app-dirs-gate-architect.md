Reviewed: PR #324 at cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5 (the custodian's filing note, 2026-11-15: the architect, PLAN node port-2-macos-l1-and-app-dirs, under its form (`governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`), one of its two gates from dispatch; dispatched at 2026-11-15T09:09:46Z by the custodian's transcript, in the background, its prompt naming the brief by file, with its bytes and hash, the brief in the custodian's scratch folder (4587 bytes, sha256 248ebb69d3472e5734d8cd3b2065921551e133e191ce27eb3c259224d05d47b4); the run 2026-11-15T09:09:50Z to 2026-11-15T09:23:56Z by its transcript, 79 calls (Read 31, Glob 7, Grep 40, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; received at 2026-11-15T09:23:56Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 14988 bytes, sha256 968f681a711ea9c3fac19cd21f07c5f7a6123c83acf03e6650eec1964ab8c33b, with this note added in its first line; its own call count gives Grep 39, where its transcript has 40; its findings are words only, and its D10 goes to the advisor after the reviewer's clause check), gate architect — cut/port-2-macos-l1-and-app-dirs @ cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5
Verdict: PASS WITH NOTES

WORDS-ONLY: every finding below is a sentence or a record line, and each comes with its replacement words. Under the 2026-10-05 direction, section 2, none of them blocks. Each Documentation finding must be fixed before the merge, with no re-gate. D10 waits for the advisor's ruling.

## Correctness
None. I read each consumer of the seam at C. `data_dir` (`kernel/src/permission/audit/log.rs:375-376`) still has the signature `pub(crate) fn data_dir() -> Option<PathBuf>`. It has three product consumers:
- `resolve_log_path` (log.rs:358-365);
- `session_history::default_root` (`kernel/src/session_history.rs:248-249`);
- `project::store::projects_root` (`kernel/src/project/store.rs:56-57`). This one is new since §0: it came in with main at 72cc7f0f (1c step 1).

When `data_dir` returns `None`, each consumer refuses by name:
- the audit log: log.rs:358-364;
- the session store: shell `commands.rs:144-147`;
- the project store: shell `commands.rs:166-169`.

The shell builds both stores over these functions at `frontends/shell/src-tauri/src/lib.rs:453-461`. With an absolute `LOCALAPPDATA`, the Windows paths are byte-identical. E-K proves `data_dir` end to end through the shipped `publish-bundle --audit-show`.

## Evidence
None blocking. Two conditions before the merge (flags 4 and 6):
- **(E-a)** The words below change `.rs` comments, so the head marked ready will not be C. §4's E1, and E2, must be read at that final head. Comment edits under `kernel/**` and `engine/**` trigger product-ci-rust.
- **(E-b)** §7 must be recounted at the final head and recorded as class 8, by reference. §7 itself stays unedited.

## Documentation (must fix before the merge; none of these sentences is the human's wording unless I say so)

**D1 (flag 1).** `kernel/tests/case_policy_volume.rs`, K1's RECORDED MUTATION comment ends with the byte-copied span "Not observed on macOS: that observation is E3's, and E3 has not run." That is untrue at C: E3 ran (Amendment 7 item 4).
- Replace from "Observed on Windows at" to the end of the comment with:
  `Observed on Windows at 6c21888e. Observed on macOS by E3, at the probe commit 6c86c2c508cc31da5a4e237fd0a6a72a760c01c3 (one commit applying M6 alone): the same final equality fails, its left side a path in the runner's temporary folder and not under `<user-home>`.`
- Clause check: the probe, its single M6 commit, the macOS red at the final equality and the left side are all from Amendment 7 item 4 (run 43689426988, job 132736713381). I did not read the job log; the reviewer confirms the run against it. The commit is named by id with no hash.

**D2.** In the `engine/src/app_dirs.rs` module doc, "the rule is four variables" is untrue: the code reads three names, `LOCALAPPDATA`, `HOME` and `XDG_DATA_HOME` (app_dirs.rs:82-85 and 96).
- Words: `No `dirs` or `directories` crate: that would be a new dependency, and the rule is three variables.`
- Clause check: those three names are the only arguments `absolute_value` is called with.

**D3.** In the doc above `user_data_dir` (app_dirs.rs:101-105), the "Product callers" sentence leaves out the project machine store (`projects_root`).
- Replace that sentence with:
  `Product callers: the kernel's `permission::audit::log::data_dir`, through which the audit log, the session store (`session_history::default_root`) and the project machine store (`project::store::projects_root`) reach it; the shell builds its session recorder and its `Projects` over the last two.`
- Clause check: log.rs:375-376; session_history.rs:248-249; store.rs:56-57; shell lib.rs:453-461.

**D4.** `data_dir`'s doc (log.rs:368-374) has two problems:
- "`None` when the platform's variable is unset, empty or relative" is untrue on Linux. There a relative `XDG_DATA_HOME` with an absolute `HOME` gives `Some` (app_dirs.rs:84-85).
- Only the session store is named; the project store also reaches the directory through this function.

Replace the doc's last two sentences with:
  `None` when none of the variables the platform's rule reads is a non-empty absolute path, so a log never lands relative to the working directory. The session store (`session_history::default_root`) and the project machine store (`project::store::projects_root`) reach the same directory through this function.

Clause check:
- `data_dir_for` (app_dirs.rs:80-88) returns `None` only when `absolute_value` (70-77) fails for every variable its arm reads, and the `Other` arm reads none.
- The override is checked for absoluteness (log.rs:344-355).
- The two callers: as in D3.

**D5 (flag 7).** In `kernel/PERMISSION-BOUNDARY.md`, the Location row is byte-equal to W4, which is my own drafting and not the human's wording. Its last sentence, "A variable that is unset or not absolute resolves nothing, and the publish refuses before anything exists", can be read as saying that an unset `XDG_DATA_HOME` makes the publish refuse. On Linux that is the ordinary case, and the code falls back to `HOME`. My reading, not a quote: the preceding "else" clause states the fallback, so I do not grade this as a false claim of a limit.
- Words for that sentence:
  `A variable counts only when it is a non-empty absolute path; when none of the platform's variables counts and `SPATIAL_IDE_AUDIT_LOG` is not set, the publish refuses before anything exists`
- Clause check:
  - app_dirs.rs:70-88;
  - the override is checked first (log.rs:344-356), then the refusal (358-364);
  - `open_for` resolves first, at log.rs:124-125, before anything is created.
- Record: the PR body lists these words, and one appended line in the closing amendment says that §8 item 8 reads W4 as the gate's words.

**D6.** In app_dirs.rs, M3's comment says the left side is "an `Ok` holding the temporary directory". By the code (`abs("p2-local")` = `temp_dir().join(..)`), it holds a path below that directory.
- Words: `left an `Ok` holding the `p2-local` path below the temporary directory`.

**D7.** The module doc of `kernel/tests/app_data_dir_resolution.rs` says "No user-profile path is read or written." That is untrue on Windows, where `temp_dir()` lies under the profile and the scratch directories are written there.
- Words: `No real per-user data directory is resolved: each case sets every variable the table reads to a path in the scratch directory or to a relative or empty value, or removes it.`
- Clause check: `cases()` sets `LOCALAPPDATA`, `HOME` and `XDG_DATA_HOME` in every arm, and `audit_show` removes the override.

**D8.** Item 1's source comment in `KNOWN-LIMITATIONS.md` does not carry W1's "Not covered" case, which §10 names for that comment.
- Append before ` -->`:
  `; not covered: the macOS line holds of main only while later runs of that entry stay green, and if the first push to main after the merge is red, the next PR withdraws it (that form's E4)`
- Clause check: §4 E4. The addition has no run id and no path:line (W2).

**D9 (record).** Amendment 6 item 2 pins `KNOWN-LIMITATIONS.md:400` by hash at 83d2ecef8dba33017e47310d7fab8e2be5ee5123, a commit on this unmerged branch. Round 15 (e) and §8 item 14 forbid that. Correction, appended, three sentences:
  `Amendment 6 item 2 pins this branch's item 43 line by hash at 83d2ecef8dba33017e47310d7fab8e2be5ee5123, a branch commit, which round 15 (e) forbids. The reference is `KNOWN-LIMITATIONS.md:400` at that commit, named by id with no hash, a historical pin; the tree at the gated head is authoritative. Proof: `git merge-base --is-ancestor 83d2ecef origin/main` exits 1.`
- I have no shell, so the reviewer runs the ancestry check.

**D10 (flag 2; goes to the advisor).** Item 43 at C, read whole:
- The data-folder clause equals W3 byte for byte, and it sits on main's line.
- The rest of the line equals the span in item 3 of ADV-2026-11-14-17.
- Both comments are unchanged from main.
- Every clause holds at C:
  - data folder: `default_root` = data dir + `spatial-ide/sessions`, and the data dir follows app_dirs.rs:80-88;
  - one file per open's holder (session_history.rs:308-316);
  - a 32 MiB ceiling (`MAX_SESSION_HISTORY_BYTES`, :48);
  - a normal close removes the files (`end_session` :403-412, called at shell lib.rs:592).

Two gaps in the comments:
- The approval comment does not say whose words the changed data-folder clause is.
- No source comment carries W3's Not covered case (Amendment 5 item 4).

Draft for the advisor. In the comment above item 43, after "as the comment below says", insert:
  `; since port-2-macos-l1-and-app-dirs its data-folder clause, the folders it names on Windows, macOS and Linux, is the architect's wording for that piece's form (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md, section 10, W3), which the human approved on 2026-10-23 (state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md, item 4), and so is the human's wording`

and after "on the normal exit event", append:
  `; the data folder is the per-user data directory that engine/src/app_dirs.rs decides (data_dir_for), which kernel/src/permission/audit/log.rs returns (data_dir) and kernel/src/session_history.rs joins with spatial-ide/sessions (default_root). Not covered, outside ordinary use and named under AUTONOMY §31 (c): on Windows a LOCALAPPDATA, on macOS a HOME, and on Linux a HOME while XDG_DATA_HOME is not an absolute path either, that is unset, empty or not an absolute path; then no data folder resolves, nothing is kept, and the shell's record_step refuses each step by name`

Clause check:
- the approval is item 4 of that directive ("W3: yes to the architect's words for item 43", byte-copied);
- app_dirs.rs:70-88; log.rs:375-376; session_history.rs:248-249;
- the recorder is `None` (shell lib.rs:453-454), and the refusal is commands.rs:144-147.
- The words contain no quotation (§8 item 9).

Conflict for the advisor: ADV-2026-11-13-20 item 5 (f) has port-2 change "nothing else in the item". The request in Amendment 8 item 2 is the advisor's request, not a ruling. Editing the comment therefore needs the advisor's ruling.

**D11 (record).** The closing amendment should name, by reference, the third consumer of `data_dir`: `projects_root`, reached at 72cc7f0f. Pin it at a main commit, with its hash computed by script. The seam I re-read, recorded under I10/I11.

## Observation
- O1. `frontends/shell/e2e/publish.mjs:193-196` copies the old off-Windows rule. On macOS it would look in the wrong place. The file is outside §7's list, and the e2e runs on Windows only. Route a node.
- O2. The header of `scripts/plan/cfg-boundary.mjs` (lines 19-20, unchanged) says "as the preregistration carries it". That is now two forms. Optional words: `as PORT-1-LINUX-L1-PREREGISTRATION.md carried it and PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md section 2 item 5 changed it`.
- O3. The reason strings use the old paths (`engine/LOD-PREREGISTRATION.md`, the bare PORT-2 file name). They resolve through `governance/MOVED.tsv` rows 21 and 47.
- O4. The form's Authority pin (`dtolnay/rust-toolchain@stable` at 2ffbf957) is historical. The tree at C is authoritative: the SHA-pinned action with toolchain 1.100.0, shared by all three entries. The human's word "the same toolchain the Linux L1 job installs" holds.
- O5. The workflow sentence "Every run of any entry prints the tests it ignores" is true only of runs that build (line 254's condition). The Linux sentence before it had the same wording.
- O6. Item 62 (not this piece's) defines `<data dir>` for Windows only, so it stays true.
- O7. Flag 5: the probe branch is kept because the Guardian refused the deletion (G1). This departs from §4's E3 text. It is recorded as class 1 in Amendment 7 item 7, and it is not §8 item 12, since the probe is not the gated head. The deletion is the human's.

## Checks
1. §9:
   - Gating: full. Both §21a reasons hold, no other head is engaged, and the audit-log location is not posture.
   - Item 6's word: one entry, the shared toolchain step, no install (workflow at C, lines 205-230).
   - Round 33, items 6 and 7 (the RULED 2026-10-02 block): PORT-1 is green, and the Apple Silicon profile matches W1.
   - R1 to R6, the allowlist included, as per §2 item 5: hold.
   - Seams and the caller rule: `user_data_dir` is the only `pub` item and has a product caller; nothing that acts lands without one. The record gaps are D3, D4 and D11.
   - docs/02 (OPEN-A): passes. `docs/02_Architecture.md:26` excludes render, orchestration and `protocol/`, and a per-user data directory is none of these. It is now used by three kernel stores.
   - Rule (00): disjoint. This is the 1 MiB read form's own row (`governance/forms/scripts/VERIFY-QUOTES-AND-DOCSONLY-READ-FILES-OVER-ONE-MEBIBYTE-PREREGISTRATION.md:55`).
   - Round 7: W6 states engine facts only, and `build_tiers` has no product caller.
   - Round 25 item 2: the class 8 overrun is recorded and §7 is not edited; there is no scope addition; no record calls a `verify-mutation` run an observation (the build report says the tool was not used); no five-line form.
2. §8:
   - items 1 to 13 hold;
   - 14: the Amendment 6 hash (D9).
3. W1 to W6 at C:
   - W1, W2, W4 and W5 are byte-equal to §10;
   - W3 is on main's line, as Amendment 6 requires;
   - W6 is `TIER_ROOT_REASON_*` (app_dirs.rs:62-67) plus the kept sentence (`lod.rs` `tier_directory`).
   - Wording found by the clause check: D5 and D8.
4. Item 43: D10.
5. The other sentences:
   - findings D1, D2, D3, D4, D6 and D7;
   - the comments for M1, M2, M4, M5 and M7, and the docs of `lod.rs`, `lod_tier_root.rs` and `case_policy_volume.rs`: hold.
6. §1's May-not-claim list: no text at C claims anything it rules out.
7. Scope:
   - 16 files, exactly §7's list;
   - 941 changed lines against 850, recorded as class 8;
   - the probe: O7;
   - E1 at C: E-a.
8. The packet's flags:
   - 1: D1.
   - 2: D10.
   - 3: touches no claim. §4 and P1 claim only that each test fails under its own mutation, never that no other test does. P7 holds: on Linux `publish_cli` passed under M6.
   - 4: E-b.
   - 5: O7.
   - 6: E-a.
   - 7: D4 and D5. The Location row equals W4, the module doc equals W5, and W5 holds against the code.

No ADR is drafted: no decision is missing.

Calls: Read 31, Grep 39, Glob 7, SubagentHandback 1. Model: Opus 5.5 (claude-opus-5-5).

Files read at C, under C:/dev/wt/p2:
- `engine/src/app_dirs.rs`, `engine/src/lod.rs`
- `kernel/src/permission/audit/log.rs`, `kernel/src/project/store.rs`, `kernel/src/session_history.rs`
- `frontends/shell/src-tauri/src/lib.rs`, `frontends/shell/src-tauri/src/commands.rs`
- `KNOWN-LIMITATIONS.md`, `.github/workflows/product-ci-rust.yml`, `scripts/plan/cfg-boundary.mjs`

The diff and the packet are at `<S>/p2-324-diff.patch` and `<S>/packet-324.md`.