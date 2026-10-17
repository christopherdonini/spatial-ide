*Custodian's filing note (2026-10-17): the worker-high's report for `governance-cut-state-cap-and-rotation` (governance B), S1 to S6, in C:/dev/wt/csr from M0 0ff2594e; the head c8b78e904ef90c0258bc1bd910a5445b37ad67eb, pushed. The run 2026-10-17T21:32:24Z to 2026-10-17T22:08:59Z by its transcript (Read 13, Bash 100, Edit 19, Write 28); its one SubagentHandback call, at 22:08:58Z. Extracted by script; 0 path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; one final newline added if absent; nothing else changed. The custodian's checks at the head: the form's counting command prints 799 12; §8 item 2's cmp exits 0 for AUTONOMY.md and PRECEDENTS.md; no profile path in the diff; every commit signed off. The message's sha256 as handed back is 4993e8eab803a4acd281d7a001598d8a2198dda43693f3077feca65d1718a346; this file's, from line 5 to the end, is 156bb96e2419eb7e7b00e47a9c0c403cdca10623cf36a209d9b8fbc454d108e7.*

---

REPORT, governance B (cut/cut-state-cap-and-rotation), S1 to S6 all built and published.

HEAD: c8b78e904ef90c0258bc1bd910a5445b37ad67eb = origin/cut/cut-state-cap-and-rotation. Final porcelain (--untracked-files=all): empty. Started at M0 0ff2594e, porcelain clean after fetch. Pushes: ordinary, upstream set on the first, no force; each exit 0.

STEPS AND COMMITS (short ids)
- S1 verify-cites rule + V1/V2: 2f4f8252 (code), 95715f09 (mutation record).
- S2 two cite pins: 54f0273b. Watcher report line 109 pinned at 02ec6a34e4384ed7cf90c2d1277c290d038987d5 (first parent of its adding commit bfa510b5; line 8 there carries the E5 pin item the report refers to; sha256 8afbfc18...). Lease report line 32 pinned at 9b77d0f900d3b5b30e41005a063861e1e48a6a4d (first parent of 86d6b4b2; lines 332-333 both hold 81107ddf; sha256 30b5cfdc...). Both are ancestors of origin/main. One line changed per file.
- S3 cap + C1-C7: ea69f46c (code), 6372d6e9 (record).
- S4 rotation script + R1-R9: bad88d11 (code), b4b6dbbb (record).
- S5 READING_ORDER + S1-test: 8965ba75 (code), 0af2968f (record).
- S6 AUTONOMY section 33, P-035, P-036: 8d8cdfc6; c8b78e90 swaps three flushed_at fixture dates for a non-date value.

FILES (lines added/removed vs M0, three-dot): AUTONOMY.md 77/0; PRECEDENTS.md 47/0; scripts/hooks/flush.mjs 74/2; flush.test.mjs 130/1; hooks.test.mjs 23/1; session-resume.mjs 1/1; scripts/plan/rotate-cut-state.mjs 137/0 (new); rotate-cut-state.test.mjs 252/0 (new); verify-cites.mjs 8/0; verify-cites.test.mjs 41/0; the two consults 1/1 each. COUNTING COMMAND: 799 lines over 12 files (ceiling 960 / 12; the file count is at the ceiling, so no further file can be added). Section 8 item 2: cmp -n at the M0 size exits 0 for both AUTONOMY.md and PRECEDENTS.md at HEAD (append-only, done by one script with appendFileSync).

TESTS (all in the CI globs; suite 483 tests, 483 pass, 0 fail, 0 skipped; rc 0)
- verify-cites.test: V1 "verify-cites: an unpinned line cite into state/CUT-STATE.md past its end is advisory", V2 "verify-cites: a pinned line cite into state/CUT-STATE.md whose pin fails stays gated" (24/24 in file).
- flush.test (18/18): C1-C7 under the form's exact names. C5 is the seam test: real ledger + all-SENTINEL update, blockSizes equals the bytes of the block buildOutput prints. C6/C7 spawn the real CLI with TMPDIR/TEMP/TMP redirected.
- rotate-cut-state.test (9/9): R1-R9 under the form's names. R8 is the seam test: real CLIs/exports, no git injected. At R: decidePrecompact (manual) blocks with "does not match HEAD ... not the parent of a ledger-only flush commit", stop-queue decide blocks with a reason starting "stale SESSION-CONTINUITY" and naming R's full hash, session-resume exits 0. At F (flush.mjs CLI, ledger-only commit): precompact allows ("is fresh"), decide reaches its no-PLAN allow with notify never called, session-resume exits 0. Predictions E4/E7 held.
- hooks.test: S1-test (name per the form). I added assertions that AUTONOMY.md has "## §33." and "### Part B. The standing items", and PRECEDENTS.md has P-035 and P-036 headings.
- After final commit: verify.mjs rc 0 (PASS); verify-cites rc 0 (PASS, 41 pre-existing loose advisories); verify-quotes rc 0 (PASS, 129 checked, 98 verified); verify-test-claims rc 0 (PASS, 571 claims); verify-mutation rc 0 (PASS, all 19 new tests named). D1 byte/hash comparison against M0 was not run (it would need a second checkout).

MUTATIONS (each applied alone at the step's code commit, test run, reverted, porcelain shown empty; recorded as RECORDED MUTATION comments naming the test in full)
- MV1, MV2 at 2f4f825269a6: each failed only its own test (V1, V2).
- MC1-MC7 at ea69f46c4fc2: MC1 -> C1 only. MC2 -> C2 (also C3, C4, C6, C7, which need a refusal). MC3 -> C3 (also C4, C5, C6, C7). MC4 -> C4 only. MC5 -> C5 (also C2). MC6 -> C6 only. MC7 -> C7 only. MC4 was applied as "field sizes counted as string length" (largest chosen by characters), because the code keeps only a bytes figure per field.
- MR1-MR8 at bad88d11d131: MR1 -> R1 (also R2, R4, R8). MR2 -> R2 only. MR3 -> R3 only. MR4 -> R4 only. MR5 -> R5 (also R3, R4). MR6 -> R6 only. MR7 -> R7 only. MR8 -> R8 (also R1).
- MR9: REFUSED BY ME, not by the harness. I did not edit .claude/settings.json (configuration; an agent message cannot authorise it under my instructions). Substitute: the mutated SessionStart entry went into a copy of the settings in my scratch folder, the test's path pointed at the copy for one run and was reverted. R9 failed by name, only it. The comment says so. Please decide whether that counts.
- MS1 at 8965ba7500f0: old item 1 restored -> S1-test fails, only it. Extra, unrecorded: renaming the AUTONOMY "## §33." heading (my added assertions) also fails S1-test only.
- No harness or Guardian refusals occurred.

THE SIX ITEMS (byte-copied by script from git show 0ff2594e:state/CUT-STATE.md; markers each found exactly once; independent second script recomputed all 22 pins and all 10 fenced copies: 0 problems). Pin = state/CUT-STATE.md:L @ 0ff2594e... sha256 of the whole line L.
- (00): "half-made judgments:" line 8, line sha 3f2cd3569c7f77dd...; 361 bytes; -> AUTONOMY section 33 part B item 1; source awaiting-merge-leaves-the-slot.md:9 (form's hash ddc53955...).
- (0): line 8, same line sha; 1939 bytes; -> part B item 2; sources machine-script-adopted.md:6-23 (aa48e3ee...) plus that file and sole-session-heavy-runs.md by path.
- (5): "intended sequencing (next session):" line 9, line sha b8611e1cfc0c98026f...; 592 bytes; -> part B item 3; per-clause sources.
- (14): line 8; 193 bytes; -> part B item 4; source round 50, item 1.
- (2): line 8; 120 bytes; -> PRECEDENTS P-035; source PORTABILITY-2026-09-30.md:31-65 (c69eed80...), covering line byte-copied from 2026-09-30-portability-and-handoff.md lines 15-20 (found; STOP I7 not triggered).
- (18): line 8; 449 bytes; -> PRECEDENTS P-036; source 2026-10-06-boot-mods-local-and-machine-script.md:15-16 (bdabd38a...).
- Section chosen: 33. A's section is 32 at M0 (AUTONOMY.md ends with section 32, A's), so B's is 33. READING_ORDER item 1 and S1-test name section 33.
- Every form-pinned hash (directive 25-40, 37-38, 68; awaiting-merge 9 and 12; machine-script 6-23; PORTABILITY 31-65 and 3; boot-mods 15-16; probes 9; trailers 22) was recomputed and equals the form's.

UNSOURCED CLAUSE OF ITEM (5): "record text via the Write tool, commit and publish in separate calls" (inside "Guardian is live"). No tracked source found; AUTONOMY part B says so. I gave sources found by search for two others: "a RULED block per human answer" -> 2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md:18-19 (sha256 2336aa81...); Guardian live -> 2026-10-04-guardian-install-approval.md, REPORT PATH line -> MODS-GUARDIAN-V0-2026-10-03.md:23 (03a4adab...). "round 50 item 1" and "round 51 item 3" are cited by round and item only; I did not check the round 51 item number against the ledger (the ledger text I saw places the publish-test standing item under Fable's advice item 4).

DIFFERENCES FROM THE FORM OR BRIEF (decisions for you or the architect)
1. Directive lines 37-38 are NOT reproduced in AUTONOMY section 33 part A. Form section 2 item 6 says reproduce piece B (lines 25-40), but lines 37-38 hold unpinned cites into state/CUT-STATE.md (:8 and :332-333), which form section 8 item 8 blocks on sight. I reproduced lines 25-36 and 39-40 as two pinned fences, referenced 37-38 by pin (the form's hash) and said why. Adding them back is one commit if you disagree (verify-cites would pass either way, as V1 makes them advisory).
2. Form section 2 item 5 says the section 26 adjacency test reads lines 4 and 5 only. False: it finds the PRECEDENTS line by substring, and item 1 now names PRECEDENTS.md, so it failed. I changed that one lookup in hooks.test.mjs to match the line starting "5. PRECEDENTS.md"; its assertions are unchanged.
3. Rotation script adds a --root <dir> option (default: the script's repo) so tests can point it at fixtures; it imports only blockSizes, BLOCK_CAP_BYTES, BLOCK_HEADING from flush.mjs, as the form says. If the old Previous ledger line is missing, the new line omits the "Before it" clause (the form is silent). A failure after the move prints "STOP" and rolls nothing back.
4. flush CLI: the scratch-folder inside-repository check tests both the script's repo and the target file's git toplevel; paths are compared through realpathSync.native (Windows 8.3 names broke the plain realpath).
5. Typed dates: none in the scripts; test fixtures use epoch arithmetic and a non-date flushed_at value; comments cite no dates. The commit messages and AUTONOMY/PRECEDENTS text cite the direction's date as a citation.
6. Exit/limits: rotation test timing uses the machine clock's UTC date for the archive name (a run across UTC midnight could flake R1/R2).
Off-scope noticed, not done: PLAN.yaml still says in progress; no state/CUT-STATE.md, DECISIONS-PENDING.md, .claude/settings.json or other worktree touched; rotate-cut-state.mjs and flush.mjs were never run against the worktree's own ledger.

COMMANDS (all foreground, output to files; exit codes): git fetch 0; every node --test run 0 except intermediate failures fixed (flush C7 inside-repo check, section 26 adjacency test, MR mutation runs exit 1 as intended); final suite rc 0; verify, verify-cites, verify-quotes, verify-test-claims, verify-mutation each 0 at HEAD c8b78e90; seven pushes rc 0. verify-mutation rc 1 earlier (before commit of the named-test comments) is superseded by rc 0.

FOUR FAILURE CLASSES
- Cross-module code: flush.mjs reads session-resume.mjs's exported extractSessionContinuityBlock (no cycle; precompact-flush.mjs imports nothing from flush.mjs); rotate-cut-state.mjs reads flush.mjs's blockSizes/BLOCK_CAP_BYTES/BLOCK_HEADING. Seam tests C5 and R8 start from the real shapes (real ledger; real hook modules and CLIs, no git injected). Caller grep: BLOCK_CAP_BYTES in flush.mjs:186 and rotate-cut-state.mjs:109; blockSizes in flush.mjs:185 and rotate:108; BlockCapError in flush.mjs:189,274; isDue rotate:93; archiveNameFor rotate:105; noticeLine rotate:69; buildRotatedLedger rotate:107.
- Completion claims: each mutation claim points to a saved run output read by test name; MR9 is stated as a substitute, not claimed as specified; D1 comparison not claimed.
- User-facing messages: the refusal text (bytes, largest field, sizes, scratch path or no-scratch reason) and the rotation's refusal/not-due/next-step lines describe behaviour implemented and tested here; nothing names a hook that runs flush.mjs.
- Required tests reach their assertions: each test asserts its end state (file bytes, scratch file bytes, staged blobs, exact new ledger text, hook decisions and reasons); the mutation runs show the intended assertion failing, not setup.

MODEL: the harness reports claude-sonnet-5-5 (Sonnet 5.5); no override. Context handoff: none received or produced. Token usage: not at hand.
