# PR #181 gate 1 — architect
Reviewed: cut/compaction-record-and-resume-line @ 59394e498577b7d359d150970cba908421833fcc

**Verdict: pass with notes.** No finding fails the gate. One Correctness note is not material: no input the installed build can send reaches it. Four Documentation and record findings are to be fixed or recorded in this PR before the merge (proportional gates, `state/directives/2026-10-05-product-first-direction.md:15`, section 2).

Branch files were read in `C:/dev/wt/crr` at the reviewed head. The form, its Amendment 1 and the reports were read on main. I ran nothing. Hashes, the numstat and CI are the reviewer's to recompute.

## Check list (form §9, Architect)

- **Gating heads.** All three apply as the form states them:
  - §21a: the auto-blocks-first property is reversed. T3 now sends `manual`, and T2 and T4 assert the reversal.
  - §21c size: 405 lines declared.
  - §21c behaviour: the resume line enters the model's context.

  Full gating was used, with no five-line form, as round 25, item 2 (e) requires. Sound.
- **The direction's items 2 and 4 against §2** (`state/directives/2026-10-05-human-direction-context-flush.md:10`, `:14`):
  - Item 2 is built:
    - a non-manual call is recorded and let through at `scripts/hooks/precompact-flush.mjs:230-241`;
    - the manual path is unchanged. Its decision logic at `:243-265` matches main's `:189-208`; the only additions are the append and the failure note;
    - §7's text now reads 10 minutes at `AUTONOMY.md:182`.
  - Item 4 is custodian process (§2 item 6, OPEN-1) and needs no code. Sound.
- **Discriminator and evidence (§0), and P0 against I1.** Amendment 1 items 1 to 4 match the P0 report, sections 1 to 3:
  - 2.1.288's `.d.ts` declares the PreCompact stdin `trigger` as `'manual' | 'auto'`;
  - 2.1.289's embedded schema, matcher metadata and runner say the same;
  - nothing contradicts §0 items 1 to 3.

  I1 does not fire. E1 stays the live proof. Sound.
- **Seams and the caller rule (§1).** No new export and no new option: both modules' export sets are unchanged, and `RESUME_GIT_TIMEOUT_MS` and `TIP_GUARD` are module-local. The seams:
  - session-resume calls `parseSessionContinuity(text)` with its real signature, at `scripts/hooks/session-resume.mjs:107`.
  - The PreCompact stdin shape in T2 (`hooks.test.mjs:1115`) and the SessionStart stdin in T7 (`:1286`) match the shapes the P0 report section 2 B reads from the runner.
  - Each seam has a real-shape end-to-end test: T2 and T7 go through the shipped CLI, and T6 uses real git.
- **Round 7 on §7's texts as built.** Both new stderr lines are the hook's own facts and are byte-equal to §7 (`precompact-flush.mjs:217`, `:239`). One wording note is D-1.
- **R1 to R6.**
  - There is no OS-conditional code.
  - Git is called through argument arrays with no shell.
  - The tip guard runs before `rev-list`, at `session-resume.mjs:85`.
  - Paths are built with `path.join`, and none goes into a git argument.
  - The new tests use `os.tmpdir()` with `t.after`, and spawn `process.execPath`.
  - No branch name is assumed and no platform is ignored.

  Sound.
- **The `AUTONOMY.md` §7 edits against §2 item 5.**
  - Only lines 182, 183 and 187 change. §8 still sits at line 189 on both sides, so no line was inserted or removed.
  - The `reason:` span is byte-identical by eye with main and with `BLOCK_REASON`.
  - The context-limit clause is dropped and the dry-run sentence names the form by path.

  Sound.
- **The 15-minute window.** `SECOND_CHANCE_WINDOW_MS` is unchanged, and T3 keeps its name and assertions.

## §8, item by item

1. No non-manual path blocks or touches `lastBlockedAt` (`:230-241`). T4's mixed-session check proves both the read and the write side (`hooks.test.mjs:1178-1184`). Pass.
2. The manual path's decision is unchanged. Pass.
3. The append runs in its own try/catch (`:202-219`). `custom_instructions` is not recorded, and T1 asserts it. The cloud path returns before `main`. Pass.
4. Each git call has the timeout and no shell, the tip is guarded, and the line comes after the block (T6 `:1273`). Pass.
5. The AUTONOMY edits are as above. Pass.
6. `.claude/settings.json` is unchanged at `:26-57`. That `tools/mods/` is untouched rests on worker report 1, section "§7 figures", and the reviewer's numstat. Pass on the evidence.
7. No new export or option. Five files per the report. Pass, subject to the reviewer's recount.
8. The new tests have no network, no shell and no ignore. Each has a `RECORDED MUTATION`, and each cleans up with `t.after`. T3 is a pre-existing exception (D-3). Pass.
9. No user-profile path. The P0 report uses `<profile>`. Pass.
10. The new comments, the README text and the §7 edits carry no new quotation. The header at `precompact-flush.mjs:1-25` quotes nothing. Pass.
11. Worker report 1, sections "Mutations" and "Suites", does not treat the `verify-mutation` run as an observation, and names 562b7d84 for M1 to M7. Pass.
12. 405 of 450 lines over 5 of 5 files, per the report. The §7 line is untouched. No scope addition. Pass, subject to the reviewer's recount.
13. Record form: D-2.
14. Nothing force-pushed: the one G1 refusal did not run (deviation 4). Pass.

## Worker report 1: the five deviations

1. **T4's extra cases: sound, and necessary.** Under M4 (`!== 'auto'`), the form's own P4 and P5 give identical results: absent and `other` still take the non-manual branch, and P4's fresh call is allowed on either branch. The stale `auto` case and the mixed-session case are what make M4 observable, and they prove §1 claim 1's "neither reads nor writes". This is a defect in the form's T4 fixture list (mine), not in the build.
2. **M5 as a rethrowing catch: sound.** It is behaviourally equivalent to deleting the try/catch.
3. **README: sound.** Only the dropped context-limit quotation was removed (§2 items 5 and 7). Leaving the existing "Contract, quoted" paragraph is correct under §8 item 10.
4. **The G1 refusal: sound as to §8 item 14,** because the refused call did not run. There is one record mismatch:
   - the filing note at `state/consults/2026-10-05-compaction-record-and-resume-line-worker-report-1.md:1` gives G1's push-pattern refusal text;
   - the worker attributes the refusal to an apostrophe in heredoc text.

   The custodian resolves the refused command against the transcript and states it in the closing record. Documentation.
5. **Existing fresh line on a fresh non-manual call: sound.** §7 declares no separate line for that case, and the existing line states the hook's own fact.

## Findings

- **C-1 (Correctness; not failing).** The record stores `trigger` only when it is a string:

  `scripts/hooks/precompact-flush.mjs:206`: `      trigger: typeof input.trigger === 'string' ? input.trigger : null,`

  Form §7 and `scripts/hooks/README.md:142` say "as received, else `null`", so a non-string `trigger` would be recorded as `null`, not as received. This is not material:
  - the declared stdin type is the two-string enum (Amendment 1 item 2), so no input the build can send reaches it;
  - the failure direction is safe: a non-`auto` record trips I6.

  Fix in this PR: either `README.md:142` says "a string as received, else `null`" and the closing record carries the same reading, or the code records any present value.
- **D-1 (Documentation and record).** The recorded-only stderr line says "automatic compaction" for an absent or unrecognised `trigger` too. The hook does not know that fact (form §1, "May not claim"). The text was built exactly as §7 declares it, so the defect is the form's wording. Record it in the closing record; the code does not change.
- **D-2 (Documentation and record).** Round 14 bars a line cite into a file the same commit edits. Amendment 1's "sha256 from its line 5" does exactly that: it spans the P0 report, which commit 9c2f0464 adds (per its subject line). Fix: a one-sentence correction row pinning `state/consults/2026-10-05-compaction-record-and-resume-line-p0-report.md:5-79 @ 9c2f0464 sha256:27c87d34013022a89ef79b52b28333b4a94ce07cb5ca6cfb454b1935add0b0e6`, with the hash recomputed by the reviewer, and a superseded index. The filing notes' "this file's line 5" self-reference is the custodian's standing convention. I do not raise it here; under the record cap it is a weekly-proposal matter at most.
- **D-3 (Documentation and record).** T3 and the CLI test at `hooks.test.mjs:1035` still leave their `makeGitRepo` temp directories behind, now with a `.jsonl` as well. §8 item 8 and I2 conflict here, and I2 governs T3. No code change; note it in the closing record.
- **D-4 (Documentation and record).** `scripts/hooks/README.md:304-307` still lists the CLI tests for `stop-queue.mjs` and `precompact-flush.mjs` only, though `session-resume.mjs` now has one (T7). Add it.

No ADR is needed. docs/01 and ADR-006 do not apply: this is repository tooling (form §1). There is no claim against docs/08.
