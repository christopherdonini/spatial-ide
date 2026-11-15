Reviewed: PR #324 at 45a945f80aef8a3193b75a4f41b94f9737f66516 (the custodian's filing note, 2026-11-15: the gate, the reviewer, at N, the second part of its gate (ADV-2026-11-15-12 item 5 (c); `state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-12-open-43c-d-item-43s-first-source-comment-gains-two-passages-on-the-reviewers-sentences-the-other-words-stand.md`), its first part `state/consults/gates/2026-11-15-port-2-macos-l1-and-app-dirs-gate-reviewer.md`, together the gate's attempt 1, gate-log row 762, which stands, with no new row, since item 5 (c) asks for a re-read at the final head and not a new attempt; under the form `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, its section 9 and Amendments 9 and 10, PLAN node port-2-macos-l1-and-app-dirs; its message sent at 2026-11-15T11:27:17Z by the custodian's transcript to the same run, whose resumed prompt at 2026-11-15T11:27:23Z holds it byte for byte (4029 bytes, sha256 40cabae4f1e8aee8028071f9d7d85750c882dfb91a812d013ac3df9fdfcd456c); this part 2026-11-15T11:27:23Z to 2026-11-15T11:32:35Z by its transcript, 26 calls (Bash 22, Read 3, SubagentHandback 1), none errored by the transcript, no file written by the Write or Edit tool; its Bash calls wrote 6 files of a command's own output into the scratch folder, which its report names, and it changed nothing in the worktree, model claude-opus-5-5; received at 2026-11-15T11:32:35Z by the custodian's transcript; below, the hand-back byte for byte (10404 bytes, sha256 6ecb3a7544c90b6a82d4aa3ad11d9756c04ba5ac772df8bd106870dab24a0caf), with this note in its first line. Nothing else is changed.), gate reviewer at N, the second part of its gate
Verdict: PASS WITH NOTES

N is fit to be the PR's final head. No clause in either of the ruling's passages is untrue against the code at N, so nothing goes to the advisor under item 5 (c). The first part's verdict stands. The notes still open are record items for the closing amendment; none blocks.

## The seven checks

**Inputs, by script.**
- The ruling copy is 5995 bytes, sha256 f77b5e050df65d6b888732e9e4836e17a78f5198b86c0869c3f5101d977f4a27.
- The diff `<S>/c324-diff.patch` is 16786 bytes, sha256 8a68e0731e0b3869cd841d9dbb86c3cb4a9cb5fa0c62eb2452dc816028e85c26.
- The worker's report `<S>/rep-c324.md` is 2843 bytes, sha256 4688c9fcda9be4f352800449135a6715d32331844a830e11655aaad347d7dd37.
- All three match the brief (rc 0). All three were read whole.
- I recomputed `git diff cf5e7c4c…45a945f8 | sha256sum` myself: 8a68e073…5c26, the same as the custodian's patch (rc 0).

**1. Start**
- `git rev-parse HEAD` in `C:/dev/wt/p2` gives 45a945f80aef8a3193b75a4f41b94f9737f66516, and `HEAD^` is cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5.
- The branch is `cut/port-2-macos-l1-and-app-dirs` and the porcelain has 0 lines.
- `ls-remote` gives 45a945f80aef8a3193b75a4f41b94f9737f66516 (rc 0).
- `git diff --numstat cf5e7c4c 45a945f8` gives the same six rows as the worker's report, 22 added and 12 removed.

**2. Item 43 whole at N**
- Line 437 with its line feed is 1711 bytes, sha256 974cc0c5a91e63bb69f9407a034d1cf5aeeab58cb491e9074c444e228ffe926c. That equals the ruling's item 5 (b).
- Line 436 has sha256 96df2ec4…4805 at both cf5e7c4c and N, so it is equal. Line 438 has 6c03f021…315e at both, so it is equal.
- I rebuilt line 437 from cf5e7c4c's line 437 and the ruling's two fenced passages (its lines 12 and 21, read from the copy by script):
  - Each anchor, "as the comment below says." and "clears it on the normal exit event.", occurs exactly once in the old line, and the old line ends with " -->".
  - I inserted the first passage after the first anchor, and the second after the second anchor and before " -->", with one space on each side.
  - The result is byte-equal to N's line 437 (`expected==new: true`, length 1711). Each passage occurs once (node rc 0).

**3. The ruling's first passage, clause by clause** (sources read at origin/main 2752555dc1c4348952d2aa16a152e026e54c2e04, after the fetch, rc 0)
- "Since port-2-macos-l1-and-app-dirs, its data-folder clause, the one naming the folder on Windows, macOS and Linux": true.
  - The form's §10 W3 fenced clause names all three platforms.
  - Amendment 6 item 2 records that this branch's line differs from the merge base only in that clause.
  - Line 436 at N is unchanged from cf5e7c4c, where the first part found W3 byte for byte.
- "is the architect's wording, which the human approved on 2026-10-23": true.
  - The directive `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md` is tracked (ls-files rc 0).
  - Its item 4 reads, byte-copied: "W3: yes to the architect's words for item 43."
  - The form's Amendment 1 item 3 carries the same words.
- "(…section 10, W3; …item 4)": both references resolve.
  - W3 sits under the form's "## §10. Amendments", in its "### The drafted words" subsection.
  - Item 4 is the directive's line 11.
- "and it replaces the clause first approved as drafted": true.
  - W3 says it replaces "on Windows under … unless `XDG_DATA_HOME` is set." The full clause at `2ffbf957:KNOWN-LIMITATIONS.md:400` is "on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS and Linux under `~/.local/share/spatial-ide/sessions` unless `XDG_DATA_HOME` is set." (grep rc 0).
  - That clause occurs once in `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md` (the moved path, per MOVED.tsv), inside §2.10's item L (line 406; §2.10 starts at 383).
  - That form's Amendment 1 rulings line (724) ends, byte-copied: "§2.10 L's KNOWN-LIMITATIONS item approved as drafted."

**4. The ruling's second passage, against the code at N**
- "a LOCALAPPDATA (Windows) or HOME (macOS, and Linux when XDG_DATA_HOME is not set to an absolute path) that is unset, empty or not an absolute path; then no data folder resolves": true.
  - `absolute_value` (`engine/src/app_dirs.rs:70-77` at N) returns None for an unset value, an empty value and a non-absolute path.
  - `data_dir_for` (`:80-88`) gives:
    - Windows: LOCALAPPDATA only.
    - macOS: HOME only.
    - OtherUnix: XDG_DATA_HOME, and HOME only if that fails.
  - `CURRENT` (`:45-51`) maps every non-Windows, non-macOS unix to OtherUnix, so Linux is OtherUnix.
- "nothing is kept": true.
  - `default_root` is `data_dir().map(…)` (`kernel/src/session_history.rs:248-250`).
  - The recorder is `default_root().map(…)` (`frontends/shell/src-tauri/src/lib.rs:453-454`), so it is None.
  - `Projects` is `recorder.clone().zip(projects_root())`, so it is None too (`:458-461`).
- "and each step is refused by name": true.
  - `record_step` returns `Err(SkpError::session_history_unwritable("no per-user data directory is available"))` when the recorder state is None (`frontends/shell/src-tauri/src/commands.rs:144-147`).
- "Ordinary use does not reach it, because the system sets both." This is W3's own Not-covered sentence in substance; the form reads "because the OS sets both". It is a statement about the platform, recorded under §31 (c) as the ruling's item 3 (c) says, and it does not block.
- The "Where the code does this" list: all four files exist at N, and each named item is at the lines above.

**5. The rest of the diff.** I read what was applied; I did not re-gate it.
- There are 6 files and 9 changed sentences, and every removed line is the old form of a replaced sentence.
- I matched each change by script (node rc 0) against the words filed at origin/main in `state/consults/gates/2026-11-15-port-2-macos-l1-and-app-dirs-gate-architect.md` and `…-gate-reviewer.md`, reading the joined comment text:
  - item 43's first comment: the ruling's items 2 and 3 (check 2);
  - item 1's comment: the architect's D8 (true);
  - the `app_dirs.rs` module doc: the architect's D2, the same words as my first part's D3 (true);
  - the `user_data_dir` doc: the architect's D3 (true);
  - M3's comment: the architect's D6, once, across the context line and the added lines (true);
  - the `data_dir` doc: the architect's D4 (true);
  - the Location row: the architect's D5 (true);
  - the test module doc: the architect's D7 (true);
  - K1's comment: my D1, the whole quoted sentence (true).
- Nothing else changed, which matches Amendment 9 item 3's choices.

**6. The architect's D9**
- `git -C C:/dev/spatial-ide merge-base --is-ancestor 83d2ecef8dba33017e47310d7fab8e2be5ee5123 origin/main` gives exit code **1**.
- `cat-file -t` gives `commit`, and `--is-ancestor` against 45a945f8 gives rc 0.

**7. CI at N.** Read with `gh run list --commit 45a945f80aef8a3193b75a4f41b94f9737f66516` (rc 0) at 2026-11-15T11:31:36Z:

| Run | Name | Event | Status | Conclusion |
|---|---|---|---|---|
| 43708045371 | Product CI — Rust workspace | pull_request | in_progress | (none yet) |
| 43708045268 | Ported notices | pull_request | completed | success |
| 43708045300 | Exposure scan | pull_request | completed | success |
| 43708045265 | DCO sign-off | pull_request | completed | success |
| 43708045324 | Rust fmt | pull_request | completed | success |
| 43708045316 | Governance CI — plan, queue, site | pull_request | completed | success |
| 43708045350 | Product CI — shell | pull_request | completed | success |
| 43708041608 | Ported notices | push | completed | success |
| 43708041598 | Rust fmt | push | completed | success |
| 43708041548 | Governance CI — plan, queue, site | push | completed | success |
| 43708041585 | Product CI — shell | push | completed | success |
| 43708041575 | Product CI — Rust workspace | push | completed | success |

- E1 at N: `gh run view 43708041575` (rc 0) has head 45a945f8 and conclusion success:
  - 132793314669 "L1 portable correctness · cargo test --workspace (macos-latest)": success.
  - 132793314887 the ubuntu-24.04 job: success.
  - 132793315023 "cargo test --workspace (windows-latest)": success.
- E2 at N: `gh run view 43708041548` (rc 0) has head 45a945f8 and conclusion success:
  - 132793314675 "test · verify:plan · queue/site drift": success.
  - 132793314898 "cfg boundary (PORTABILITY R2)": success.
- This discharges the first part's D6 at N.
- The pull_request run of product-ci-rust, 43708045371, was still going when I read it.

**End.** HEAD is 45a945f80aef8a3193b75a4f41b94f9737f66516, the porcelain has 0 lines, and nothing in the worktree was changed.

## Findings
- **Correctness:** none.
- **Evidence:** none.
- **Documentation (record, must-fix before the merge):**
  - **R1 (the architect's D9; check 6, exit 1).** Amendment 6 item 2 pins `KNOWN-LIMITATIONS.md:400` @ 83d2ecef, a commit not on main; round 15 (e) forbids that. Fix: the closing amendment re-pins that span at a commit on main, or names the pin as historical with which side is authoritative. A merge that keeps the branch's commits (not a squash) would make 83d2ecef an ancestor of main, but the record should not rely on that.
  - **R2 (my first part's D7)** still stands for the closing amendment: P3 and P4 recomputed against main's merge (I11), by reference.
- **Observation:** the worker stopped before its checks 3 to 9 (verify-quotes, verify-test-claims, verify-mutation, verify --offline, forms-layout, cfg-boundary, cargo fmt). By the brief, the custodian runs those at N; this part ran none of them. The "Rust fmt" and Governance CI runs at N are green.

## My calls in this part, by tool
- Read: 3 (the ruling copy, the diff, the worker's report).
- Bash: 22. Four of them wrote a command's own output into `<S>` (files `g324r-kl-old.txt`, `g324r-kl-new.txt`, `g324r-ad-new.txt`, `g324r-k1-new.txt`, `g324r-arch.md` and `g324r-rev.md`).
- Grep and Glob: 0. Edit and Write: 0.
- No build, test, mutation, cargo, commit, push or PR action. The network calls were one fetch, one ls-remote, two `gh run list` and two `gh run view`.
- I started no background shell, so none is left running.
- Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
