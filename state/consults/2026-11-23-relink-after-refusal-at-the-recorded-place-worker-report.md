*The worker-high's report for node:relink-after-refusal-at-the-recorded-place@worker-1, dispatched at 2026-11-23T13:44:35Z: the re-link piece built on branch `cut/relink-after-refusal`, base 0f02c164e070960c326573560815f2eb0a880684 (Amendment 3 item 2 of its form), head 06a2825a1dd9e55649605487f1065810905dad58, pushed, no PR. Its run: Bash 126, Edit 8, Read 6, Write 4, SubagentHandback 1, by unique call ids, 5 calls errored; model claude-sonnet-5-5, from 2026-11-23T13:44:35Z to 2026-11-23T14:49:51Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 8786 bytes, sha256 bc87457aab8565291a55211a9ec03f8333771d5e4648ba9ab5b897584ad2963b, byte for byte except as listed here, with one final newline added: in its two hold lines the `project=` and `shell=` values are written as `<m>`. R10 is the tester's, dispatched after this report; M-K2's reading goes to the gates.*

---

REPORT: relink-after-refusal-at-the-recorded-place, worker-high (model observed: Sonnet 5.5; escalation as the brief says). No stop fired (I1 to I6 none; no file outside the ten; kernel/src untouched). R10 was NOT run (the tester's).

HEAD and commits (branch cut/relink-after-refusal, pushed in its own call, no PR). Base 0f02c164e070960c326573560815f2eb0a880684.
- HEAD 06a2825a1dd9e55649605487f1065810905dad58
- 1 (P0) 3885d02bc4dbb4e02a15ca208b5a0f41085766eb "test: the re-link after a refused locator, at the base rule (P0)"
- 2 (fix) 32342fd4e9579381121b0925f27d5c1287b1133c "feat: shell: offer the re-link after a refusal at the recorded place"
- 3 (words) d03eaae777b34304daeb1b1d40043cdb4016f72f "docs: the re-link after a refused locator: section 12.3, the line, items 69 and 73, Part AE"
- 4 (not in the brief, see Deviations) 06a2825a1dd9e55649605487f1065810905dad58 "test: S-1's recorded mutations and K-F1's mutation note, so verify-mutation finds them"

P0 (commit 1 tree; the vitest run was on the tree committed as commit 1)
- S-1 (ii) fails by name: `× relinkOffer offers the re-link after a refused locator and nowhere else 12ms` / `AssertionError: (ii): expected null to deeply equal { folder: 'C:/projects/p', …(1) }` / `Tests  1 failed | 35 passed (36)`
- K-F1 passes: `test a_relink_after_a_refused_locator_opens_the_chosen_file_and_the_next_save_records_its_place ... ok` and `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.70s` (run before cargo fmt reflowed two asserts; the full kernel suite re-ran it at HEAD, ok).
Fix (commit 2): ` Test Files  1 passed (1)` / `      Tests  36 passed (36)` (S-1 and the other 35 unchanged).

Mutations, each applied at commit 32342fd4 (commit 2), file copied to D:/wt-data/relink first, restored from the copy, `cmp` equal and `git diff --quiet HEAD -- <file>` clean each time; none committed; git status clean of them.
- M-S1 (owner test removed): `× relinkOffer offers ...` / `AssertionError: (iii) The project was not opened in this window.: expected { folder: 'C:/projects/p', …(1) } to be null`
- M-S2 (inFlight test removed): `AssertionError: (v): expected { folder: 'C:/projects/p', …(1) } to be null`
- M-S3 (options.reopen test removed): `AssertionError: (iv): expected { Object (folder, options) } to be null`
- M-K1 (kernel/src/project/mod.rs: data_at consulted before relink): panicked at kernel\tests\project_relink_inside_folder_skp.rs:194:40: `F-2: re-linked: SkpError { code: "skp.project_target_unresolvable", message: "$.datasets[0].resource.locators[1].at: data/parcels.parquet cannot be resolved", ... }`
- M-K2 as the form words it (judge skipped in Projects::save for every save): does NOT fail at F-4. It fails at the setup check, `:188:5 assertion left == right failed, left: None, right: Some("data/parcels.parquet")`, because the very first save then records no project-relative locator.
- M-K2b (judge skipped only when `!first`, i.e. at a later save): panicked at `:211:5 assertion left == right failed: F-4: the file's `at`` / `left: None` / `right: Some("data/renamed.parquet")`. This is the reading under which the form's "fails at F-4's at" holds. Decision for the custodian/reviewer: the form's M-K2 wording cannot fail at F-4 unconditionally.

Suites (exit codes; heavy ones each in a shared hold)
- frontends/shell `npm run verify`: 0 (126 files, 1599 tests passed). Run on commit 3's tree; commit 4 only adds comments and one assertion message to test files.
- `cargo fmt --all --check`: 0 at HEAD
- `cargo test --locked -p spatial-kernel`: 0 (63 test binaries ok, 0 failed; K-F1 ok)
- `cargo test --locked -p spatial-skp`: 0
- `cargo clippy --locked -p spatial-kernel --tests`: 0; 14 warnings, none in a file I changed (renderer/canonical.rs, renderer/style.rs, engine/app_dirs.rs, kernel/permission/boundary.rs, publish/mod.rs, skp.rs, lib.rs, bin/publish-bundle.rs)
- node scripts/plan/verify.mjs 0 (PASS); verify-cites 0 (PASS); verify-quotes 0 (PASS, 159 checked); verify-test-claims 0 (PASS, 901 claimed)
- node scripts/plan/verify-mutation.mjs --base 0f02c164... --head HEAD: exit 0, PASS, 2 of 2 new tests have a recorded mutation naming them (a check only; it failed before commit 4 on S-1, which is why commit 4 exists; it observes nothing)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 0 (623 pass, 0 fail)

Count: `git diff --numstat 0f02c164...HEAD` = 386 insertions + 23 deletions = 409 lines (ceiling 420), 10 files: KNOWN-LIMITATIONS.md 5/5; frontends/shell/MANUAL-WALKTHROUGH.md 23/0; frontends/shell/e2e/README.md 3/3; frontends/shell/e2e/reopen.mjs 28/3; frontends/shell/src/admission/AdmissionPanel.test.ts 52/0; frontends/shell/src/admission/AdmissionPanel.tsx 28/6; frontends/shell/src/project/reopenNotices.ts 9/3; kernel/tests/project_relink_inside_folder_skp.rs 225/0; protocol/skp/SKP-V0.md 10/1; protocol/skp/src/v0/commands.rs 3/2. No overrun.

Ruled texts copied by node script (D:/wt-data/relink/words.mjs, words2/3.mjs) from the form's fenced lines or quoted drafts, each checked by `grep -c -F -f` on its file (a negative control gave 0):
- S12 (RELINKED_FILE, Amendment 1 item 3) in reopenNotices.ts: 1; with the N-2 source comment as a doc comment on the constant (my words, naming ADV-2026-11-22-44 item 2 and `SaveFailure::LineageNotKept`, item 71)
- REOPEN_LOCATOR_REFUSAL_NOTICE (section 2 item 5, unchanged): 1 in reopenNotices.ts; 1 in MANUAL-WALKTHROUGH.md (Part AE quotes it, checked equal)
- Item 73 title: 1; item 73 paragraph with the changed sentence (D-5, Amendment 2 item 6): 1; both in KNOWN-LIMITATIONS.md
- Item 69's added sentence ("a refusal for a missing file"), at the end of its paragraph: 1
- R8's bullet in SKP-V0.md section 12.3 after the "The open" bullet: 1; the script first checked the form's quote byte-equal to state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md line 134, then applied OPEN-9's "Wherever §12 says"

My drafts (for the architect or advisor), by file:
- SKP-V0.md: section 12.3 `relink` bullet (copied from form section 2 item 2's draft); the section 8 note "a `relink` after a refused locator (2026-11-23; no literal change)" (date from `date -u +%F`), placed after the skp/0.14 entry
- protocol/skp/src/v0/commands.rs: OpenProjectRequest doc lines only (no field, attribute or type change)
- frontends/shell/e2e/README.md: the E-REOPEN entry (R10, the hook sentence, the draft note)
- frontends/shell/MANUAL-WALKTHROUGH.md: Part AE (AE0 to AE2, blank result log)
- KNOWN-LIMITATIONS.md: items 69 and 73 HTML comments (code named by symbol, no lines; item 69's covers a name whose metadata cannot be read, refused as CheckRefused::Unresolvable like a missing name, so the choice is offered after both; item 73's covers a link or a wrong kind at the old place, other codes, no offer)
- Source comments: relinkOffer doc, the render comment, handleRelink comment (AdmissionPanel.tsx), the S12 doc comment and REOPEN_LOCATOR_REFUSAL_NOTICE doc (reopenNotices.ts), K-F1 and S-1 mutation notes and docs, R10's doc line (reopen.mjs)

Deviations and notes
- Commit 4 is extra: verify-mutation reported S-1 with no RECORDED MUTATIONS line; I added it (comment) and fixed K-F1's second mutation note to M-K2b's reading, plus a message on K-F1's first `at` assertion. Observed commits are recorded here only, not in code.
- M-K2 literal result differs from the form's prediction (above).
- R10 (reopen.mjs) is syntax-checked only (`node --check`); data is saved directly in the new folder FOLDER_P3 (not a subfolder), another file is opened first to close the data handle, as R9 does. It checks, in order: project-relative locator, hookOpen gives skp.project_target_unresolvable, refusal code shown and `.admission-reopen-relink` present, hookRelink gives "admitted".
- verify, verify-cites, verify-quotes and verify-test-claims ran outside a hold (verify-quotes took about 15 minutes while the kernel suite held the machine). `verify-quotes --show-cites <changed files>` (worker.md pre-gate) was not run separately; the plain run passed.
- The npm ci installs, S-1 runs and every cargo run were each in a shared hold.
- No pull request opened; nothing under governance/ or state/ touched; the form not touched.

Hold lines (every hold had this shape; no MACHINE_WAITING or MACHINE_ERROR line appeared; `also=` masked):
MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)
Last state: worktree C:/dev/wt/relink clean, branch pushed at 06a2825a. Time at finish about 14:50Z, before the 04:30Z limit.
