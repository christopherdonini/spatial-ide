Reviewed: PR #318 at dc0bd9374e8b268bd09718f01994a960b92acd4f (the custodian's filing note, 2026-11-14: the gate, the reviewer, at C3, the re-gate of ADV-2026-11-14-17 item 10 (b) and this gate's attempt 2 in the gate log, under the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; its brief given whole as its prompt, equal byte for byte (11966 bytes, sha256 e3f127a2ef36177f5aaaf7fd53506530465e1e68c4a5a2559505813c20a1e348), naming the packet files <S>/rep-soc3-words.md (6843 bytes, sha256 ac23d81d2e92884ce28df73b690456d6638e47f363f06d68c00951d246f8f1e9), <S>/so-318-c3-diff.patch (34065 bytes, sha256 213cb0f5a57fe16310bc141b5c1401900c6d7b8db703cf43da827fbb709fa35e), <S>/chk-318-c3.mjs (8953 bytes, sha256 045dc77cc0358203cde84e7f00efcda289f8e67f5a292b3d2ffa9d298134ed73), <S>/chk-318-c3.out (9878 bytes, sha256 ecc921b0bc70ae9d2656c72eaf5c0244a6854867660d990ea6936c84516215ef); the run 17:27:13Z to 17:53:40Z by its transcript, 54 calls (Bash 32, Read 19, Grep 2, SubagentHandback 1), none errored, no file written by a Write or Edit call, model claude-opus-5-5; by script, every run it claims (cargo fmt, node --test, verify-cites, verify-test-claims, verify.mjs --offline, verify-quotes, gh pr checks, gh run view, the custodian's check script, the hand check of one pin, the fence check) has a Bash call behind it whose result is not an error, and the one Bash call the audit flags for the word push is a git grep for records.push; below, the hand-back byte for byte (with one final newline, 20776 bytes, sha256 2e603c142085a834420c0df61736553414e4cdbfa24e95b839ed795dd252c676). Nothing is changed. One cite in it is off: ADR-036's Amendment 2 topic 4 is the file's last line, 293, at dc0bd937, where its C1 heading says 295 (ADV-2026-11-14-20 item 12). Its C1 and D1 went to the advisor, and ADV-2026-11-14-20 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-20-318-reviewer-c1-and-d1-stand-amendment-2-three-spans-new-fence-d1-in-c4-the-reviewers-c4-check-a-new-attempt.md`) holds both; this gate's check of C4 is its next attempt, with a verdict and a gate-log row of its own (item 9).)

Reviewed: PR #318 at dc0bd9374e8b268bd09718f01994a960b92acd4f, gate reviewer at C3 (cut/second-open-history-before-1c-step-3 @ dc0bd9374e8b268bd09718f01994a960b92acd4f)
Verdict: FAIL

The verdict is FAIL because of one finding, C1, and it is a wording finding only. It is in the advisor's ruled text of ADR-036 Amendment 2, topic 4. An ADR amendment is red-line text, so it is reported under Correctness (the proportional-gates paragraph). A WORDS-ONLY pass cannot cover it (directive 2026-11-05, Part 1 item 2), and §31 (f) keeps it out of the wording-block route. By ruling ADV-2026-11-14-17 item 6 (d), it goes to the advisor before the merge check. Nothing in the code changes. Everything else is closed:
- The code's Correctness and Evidence are closed: C3 changes no Rust file, and K1 changes `///` lines only.
- Every byte check against items 3 and 7 holds.
- All ten pins hold (item 9).
- The light runs and all 18 CI rows pass at H3.
- If the advisor rules new words for topic 4, the closure is a check by both gates of those words only.

## Findings

### Correctness (blocking; for the advisor under ADV-2026-11-14-17 item 6 (d); red-line text, so I do not apply words under §31)

**C1. ADR-036 Amendment 2, topic 4: the second sentence drops OPEN-N4 (a)'s scope (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:295` at H3).**
- The text, byte-copied: "Under OPEN-N4 (a), step 2's reopen of a saved project binds the new open to the project at the reopen, before any step on it, and continues the project's record."
- What OPEN-N4 (a) actually covers, at the 1c form's Amendment 28 item 1 (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1874` at H3), byte-copied: "OPEN-N4: (a), a same-run reopen of a project whose record this run holds is bound at the reopen and continues that record." The options draft gives the same condition: `state/consults/2026-11-12-second-open-history-before-1c-step-3-options-architect-draft.md:200-201`, "A same-run reopen (step 2) of a project whose record this run holds".
- The defect: the amendment leaves out "same-run" and "whose record this run holds". On its words, it would bind step 2 to continue "the project's record" when the project is reopened in a later run. That conflicts with the current rule that a record another run left is never touched:
  - `kernel/src/session_history.rs:401-402`, `end_session`'s doc;
  - `create_dir`'s refusal, `:449-451`;
  - `create`'s doc, `:417-418`.
- **A second clause I read as untrue on its words**, in the same topic. Byte-copied: "At this piece no command reaches a save into a project whose record the run already holds". In ordinary use (open, change, save, change, save again), the second save goes into project P, whose record the run already holds: `mod.rs:244-247` finds the project, then `:316` and `:357-366` run.
  - The colon's own list ("a later save goes to the open's own project") shows the intended meaning: a save that binds an open to a project already holding a record.
  - The phrase echoes the human's item 5 (c), so I rank this clause below the first.
- **My words, for the advisor** (not the human's wording and not ruled):
  - Sentence 2: "Under OPEN-N4 (a), step 2's reopen, in the same run, of a saved project whose record this run holds binds the new open to the project at the reopen, before any step on it, and continues that record."
  - Sentence 4: "At this piece no command reaches a save that binds an open to a project whose record the run already holds: a first save mints a new project identity, a first save refuses a folder that already holds `project.spatial`, and a later save goes to the open's own project, found by the open's catalog name (`Projects::save`)."
- **Clause check of my words:**
  - Sentence 2:
    - "same run … whose record this run holds … continues that record": 1c form `:1874`; options draft `:200-201`.
    - "before any step on it": the form's §2.4, "Carried to step 2's form" item 1 (form `:169`).
  - Sentence 4:
    - "a save that binds an open": binding happens only in `adopt_project`. It does nothing when the open is already bound (`:345-347`) and binds at `:363`. Its one caller is `mod.rs:361` (in `Projects::history`), which runs from `Projects::save` at `:316`. My grep of every `*.rs` at H3 finds no other caller and no other write of `bound`.
    - "a project whose record the run already holds": a record held by `Project(P)` comes about only by a move while an open is bound to P (`:358`), or by `create` from `record_step` with the open's holder (`:302`, `:313`). The holder is `Project` only when the open is bound (`:145`).
    - The move-failure path stays consistent: `copy_under` removes its folder (`:533`), the holder is unchanged, and the next save binds into a project with no held record.
    - "a first save mints": `mod.rs:251`.
    - "refuses a folder": `mod.rs:266-268`.
    - "a later save goes to the open's own project": `mod.rs:244-247`.

### Evidence
None.
- C3 changes `KNOWN-LIMITATIONS.md` and the ADR only (script part G).
- K1 changes 7 `///` lines (part F, and my diff of K1's Rust hunks).
- None of those lines sits in a code fence, so no doc test ran (check 7).
- CI ran the workspace suite at H3 on Windows and on Ubuntu, and it passed (check 9).

### Documentation (must fix before the merge; record words under §31 (d), so the worker applies them with no re-gate and the PR body lists them; not the human's wording)

**D1. Item 43's second comment (`KNOWN-LIMITATIONS.md:438` at H3) leaves out a third case outside ordinary use.** If a removal fails after a record move, the old folder stays, and a normal close does not remove it. That is against the approved item's "A normal close removes it."
- The code: `session_history.rs:359-361` discards each removal's error (`let _ =`). `:353` has already replaced `rec.dir` with the new folder. `end_session` removes only each record's `dir` (`:404-410`). Nothing else holds the old path, which is local `moved` at `:353`.
- Reaching it needs an I/O failure on a file whose handle was just dropped (`:357`). That is the same class as the failed move that the comment already names, so it does not block. §31 (c) has it recorded in the source comment.
- My words: in the comment's last sentence, replace "; and a crash between the move and the removal of the old folder, after which both folders stay." with "; a crash between the move and the removal of the old folder, after which both folders stay; and a removal of the old folder's files that fails after the move, after which the old folder stays, and a normal close does not remove it."
- Clause check:
  - "after the move": `copy_under` succeeded (`:352`), and the record's `dir` and holder are the project's (`:353`, `:358`).
  - "fails": the errors are discarded at `:359-361`.
  - "old folder stays": `remove_dir` at `:361` does not remove a folder that is not empty.
  - "a normal close does not remove it": `:404-410` iterates `state.records` and removes `dir` only.

### Observations
- **O1. Amendment 2, topic 1, "that record is made at the holder's first step" (`:287`).** For a record that came to a project by a move, the file is made at a save (`copy_under`, `:515-527`), and its lines begin at the open's first step. Topic 2 states the move, so the amendment holds as a whole. Not a finding.
- **O2. The W6 bullet's last clause** (`protocol/skp/SKP-V0.md`, the §8 note), byte-copied: "it now binds and marks only the second open's own record". It states the mark without its condition, but the condition ("when the second open's recorded steps reach the saved workspace") is given earlier in the same bullet. Not a finding.
- **O3. Where the custodian's script is weaker than its header says.** Each gap is closed by my own checks, as noted.
  - **(A)** It reads `<S>/soc3-words.json`, which is not in the packet's list. That file is 7815 bytes, sha256 57817f961e54e02ccef866fc38b5f7febf1dd0a89f40ebb16f1bba677e906b74, pinned in the script and matching. Each value is shown to occur once in its source, but not that it is the whole ruled span. My fence check, run by `node -e` with its output in `<S>/g318c3r-fence.txt`, closes this. The ruling has three text fences, and:
    - ADR(H3) is exactly ADR(B2), then an LF, then fence 3 (true);
    - main's item 43 line ends with fence 1, once;
    - H3's line ends with fence 2, with an equal prefix;
    - main's item 43 line equals the merge base's.
  - **(D)** "No item 63 line" tests only the heading pattern, and the two-hunk count does not assert what the hunks contain. The printed hunk header `-507,4 +506,0` and the diff show exactly the heading, the body, the comment and one blank line removed.
  - **(E)** Its regex matches only `session_history.rs` pins at C1. My `git grep` at H3 finds 10 references to C1 in the tree, all on `KNOWN-LIMITATIONS.md:438`, so nothing is missed.
  - **(F)** The w8 check joins every line of `mod.rs`, not only its doc lines, and no part asserts that the replaced phrases are gone. The K1 diff shows they are.
  - **(H)** The script's header lists only parts A to G. H does not assert item 4 (d)'s "keeps the two cases it has", item 4 (c)'s "the draft's reason after the colon stays", or item 4 (e). The printed comment diff shows all three, and I checked (e) by hand (check 6). The variable `q4d` is unused.
- **O4. My two bounded wait loops** (1 s and 2 s per turn, hard caps of 280 and 85 turns) were moved to the background by the harness after 180 s. Both ended by themselves, and neither was repeated.
- **O5. verify-quotes printed two advisory lines** for `governance/forms/engine/LOD-PREREGISTRATION.md:541` and `:545`. That file is not in this diff, and the tool passes.
- **O6.** Item 64's comment ("the number is the next after item 63") stays true as history. Ruling item 5 (b) says item 64 is not edited.

## Checks

**1. Start.**
- The fetch exited 0.
- HEAD is dc0bd937…, the branch is `cut/second-open-history-before-1c-step-3`, and the porcelain is empty.
- `ls-remote` gives dc0bd937….
- `log B2..H3` shows exactly two commits: dc0bd937 (C3), then 8fb839e9 (K1).
- `df`: C: 51G free (90%), D: 350G free (25%).
- All exit codes were 0.
- origin/main is a9c884ba…, and the merge base is 695e1303….

**2. The diff.**
- `--numstat B2 H3` exited 0. It shows 5 files:
  - KNOWN-LIMITATIONS.md 3/7;
  - ADR-036 12/0;
  - mod.rs 3/2;
  - session_history.rs 1/1;
  - SKP-V0.md 4/4.
- K1's files are mod.rs, session_history.rs and SKP-V0.md. C3's files are KNOWN-LIMITATIONS.md and the ADR.
- The diff I made is 34065 bytes, sha256 213cb0f5…, the same as the packet's. I read it whole.
- The packet's files match their stated sizes and hashes: the report 6843 B, ac23d81d…; the script 8953 B, 045dc77c…; its output 9878 B, ecc921b0….

**3. The script.**
- I read it whole. It is 8953 bytes, sha256 045dc77cc0358203cde84e7f00efcda289f8e67f5a292b3d2ffa9d298134ed73.
- `node <S>/chk-318-c3.mjs > <S>/g318c3r-chk.out`: exit 0, ALL OK, with 50 OK lines and no FAIL line. My output is byte-identical to the packet's (`cmp` exit 0).
- What each part checks:
  - A, B, C, F (apart from the w8 joining) and G check what their headers say.
  - E checks what its header says, and it is strong: it recomputes each hash at C1 and compares the bytes at H3.
  - D and H are weaker than their words (O3).

**4. Item 9, one pin by hand: `session_history.rs:343-365`.**
- `git show C1:kernel/src/session_history.rs`, then `sed -n 343,365p`: 23 lines, 1172 bytes, ending in an LF. `file` shows LF line endings (no CRLF).
- Its sha256 is 2ddcedcfabe09c8d8fd2a547cf638d0d64b3f5b5d032fc7d623439d0c9230645, equal to the pin.
- The same range at H3 has the same hash, and `cmp` exited 0.

**5. Amendment 2 against H3.**
- **Bytes:** it is equal to the ruling's item 7 fence (check 3, part C, and my fence check).
- **Preamble:**
  - The mapping OPEN-N1: O-2, OPEN-N2: (i), OPEN-N3: I-b, OPEN-N4: (a) matches the 1c form's Amendment 28 item 1 (`:1874`) and the human's item 5 (a) (directive `:25`).
  - The source "§2.6" matches the form's §2.6.
  - The words are attributed to the advisor.
- **Topic 1:**
  - `Holder` is at `:125`, and the record carries it (`:156`).
  - `Open::holder` is at `:143-148`.
  - The name lives in memory only: the header (`:607-621`) and `locations.json` (`:467-475`) carry no name, and the folder is `unsaved-`+`hex32` (`:446`).
  - `record_step` looks up and makes records at `:300-316`.
  - "Before this piece": at the merge base, `session_history.rs:245` and `:425` matched on `r.path == ds.path() && same_claims(…)`.
  - Holds, with O1.
- **Topic 2:**
  - The bind does nothing if the open is already bound (`:345-347`), and binds at `:363`.
  - The move is at `:349-362`.
  - With no record, the first step goes to `create` with a `Project` holder: the folder is `project.hex()` (`:445`; `mod.rs:69-71`, 32 hex characters) and the header's `project` is the project's URI (`:442`, `:609`).
  - A failed move returns through `?` at `:352` before `:363`. A later save reaches `adopt_project` again (`mod.rs:247`, `:316`, `:361`).
  - Holds.
- **Topic 3:**
  - `State::open` mints at first mention (`:170-183`). It is called from `record_step` (`:301`), `dataset_uri` (`:276`) and `adopt_project`. The save calls `dataset_uri` first (`mod.rs:253`).
  - The header and `data.dataset` are built from `reference` (`:304`, `:320`, `:442`).
  - The project file's entry uses `uri` at `mod.rs:277`, and that `uri` is kept for later saves (`:247`, `:312`).
  - Holds.
- **Topic 4:**
  - "one caller … which `Projects::save` calls" holds (grep below).
  - The three reasons hold: `mod.rs:251`, `:266-268`, `:244-247`.
  - Sentences 2 and 4 are C1.
- **Symbols, by `git grep` at H3:**
  - `Holder`: `session_history.rs:125`;
  - `Open::holder`: `:141`/`:143`;
  - `State::open`: `:168`/`:170`;
  - `StepRecorder::record_step`: `:284`;
  - `StepRecorder::adopt_project`: `:343`;
  - `StepRecorder::create`: `:432`;
  - `StepRecorder::dataset_uri`: `:274`;
  - `Projects::save`: `mod.rs:236`;
  - `Projects::history`: `mod.rs:357`;
  - `unsaved-`: `:446`;
  - `project.spatial`: `mod.rs:54`;
  - the two named files and the form exist at H3 (`ls-tree`);
  - `<record>` is ADR-036's own term (`:207`, `:272`).
- **Caller grep:** `adopt_project` appears only at `mod.rs:361` and at its definition. `.bound =` is written only at `:363`.

**6. Item 4, the two comments under item 43.**
- **(a)** The approval comment carries the ruled phrase once (script H). Its clauses hold: the ruled span replaced the end of the human's line, and everything after the ceiling clause's own sentence is the three new sentences (fence check).
- **(b)** The second comment has no DRAFT, and it opens with the attribution, up to the form reference (script H).
- **(c)** The ruled sentence is there once. The reason after the colon is unchanged (printed diff). The reason holds: before, one record per path plus claims (merge base `:245`); now, the ceiling for each record (`:77-90`, `:105-106`).
- **(d)** The two old cases are kept, and the two new ones are added after "Outside ordinary use, named under AUTONOMY §31 (c):". Both hold:
  - the failed move: `:352` returns before `:363`, and the record keeps `Holder::Open` and its `dir`;
  - the crash: after `:352`, before `:359-361`.
  - D1 adds a third case of the same class.
- **(e)** The worker chose the records half. The claim now reads "so no line bounds how many records a run has". It holds:
  - in `:300-316`, `records.len()` is used only as the index at `:314`;
  - `git grep` at H3 over `kernel/src` and `frontends/shell/src-tauri/src` finds no other `records.len()` or `opens.len()`, and no constant bounding records or opens. The one other hit, `publish.rs:3705`, is a different `records`.
- **Each pin's parenthetical**, checked at C1, which equals H3 byte for byte:
  - `:48`: 33_554_432;
  - `:77-90`: the ceilings;
  - `:94-119`: the per-file refusal at `:105`;
  - `:151-160`: a record with its holder;
  - `:122-128`: the holder;
  - `:141-149`: an open's holder;
  - `:300-316`: as in (e);
  - `:438-451`: the folders;
  - `:343-365`: the move, and no record when there was no step;
  - `:403-412`: the normal close (D1 adds the gap).
- **Item 43's ruled sentences:** I read them against the same lines and agree with the architect's B2 clause check.

**7. Commit 1's words.**
- **W9** (`session_history.rs:186`), "What the steps recorded in one record reach": `Reached` is a field of `Record` (`:159`), updated per record at `:330`. Holds.
- **W8** (`mod.rs:232-235`):
  - "its steps never go to the first open's record": holders differ. Names are minted per open (`skp.rs:1120`), and P is freshly minted (`mod.rs:251`).
  - "its own first save binds it to a project of its own": `:361` to `:363`. The failed move is covered by the bullet's next sentence.
  - Holds.
- **W5** (SKP §11.3, last sentence): a record per open from its first step (`:308-315`), the bind (`:363`), and the mark in `Project(P)`'s record (`:380-381`). Holds.
- **W6** (the §8 note: heading, bold line, "The change." bullet):
  - per open: `:141-149`, `:308-315`;
  - "before … shared": merge base `:245`;
  - "written when … / withheld while no step": `:381-389`, `mod.rs:368-372`;
  - "Where the first open was not saved … moved": merge base behaviour, from the form's §2.1 items 7 and 8.
  - Holds, with O2.
- **Code fences:** K1's 7 changed Rust lines are all `///` lines (`git diff -U0`). The save doc block (`mod.rs:221-235`) and `Reached`'s doc (`session_history.rs:186-187`) have 0 fence lines and 0 lines that are not doc lines. So no `cargo test` was run.

**8. Light runs, from `C:/dev/wt/so`.**
- `cargo fmt --all -- --check`: exit 0, empty output.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: exit 0. Tests 598, pass 598, fail 0, cancelled 0, skipped 0, todo 0.
- `node scripts/plan/verify-cites.mjs`: exit 0. "every rooted (in-tree) path:line reference across 2987 file(s) resolves. (194 loose reference(s) advised above.)"
- `node scripts/plan/verify-test-claims.mjs`: exit 0. "all 803 claimed test(s) across 263 file(s) exist or are planned, superseded or withdrawn (25 planned, 16 superseded, 17 withdrawn, advisory)."
- `node scripts/plan/verify.mjs --offline`: exit 0, "verify:plan PASS".
- `node scripts/plan/verify-quotes.mjs`, in a shared hold: exit 0. "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 927 ruling cites resolved, 0 ruling-cite errors."

**9. CI.**
- `gh pr checks 318`, read at Sat Nov 14 17:41:18 UTC 2026: exit 0, 18 rows, all pass.
- `gh run view`: every one of the 12 runs has head dc0bd9374e8b268bd09718f01994a960b92acd4f and conclusion success.

| Workflow | push run | pull_request run |
|---|---|---|
| Product CI — Rust workspace | 43618360932 | 43618366245 |
| Rust fmt | 43618360917 | 43618366167 |
| Governance CI — plan, queue, site | 43618360838 | 43618366188 |
| Ported notices | 43618360986 | 43618366150 |
| Product CI — shell | 43618360975 | 43618366172 |
| DCO sign-off | — | 43618366157 |
| Exposure scan | — | 43618366160 |

**10. End (17:51:43Z).**
- HEAD is dc0bd9374e8b268bd09718f01994a960b92acd4f.
- The porcelain is empty, and `git diff --stat` is empty.
- `df`: C: 50G free (90%), D: 350G free (26%).

## Status readings and hold lines
- **Status 1** (`<S>/g318c3r-status-1.txt`): no `project=SpatialIDE` line. quiet=False, average=64.4%, peaks-over-25=60.
- **The hold:**
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:8416 also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:8416 affinity=FF (cores 0-7)`
- There was no MACHINE_WAITING or MACHINE_ERROR line, and no hold was refused.

## Background shells
- be1hue093, the verify-quotes hold: completed, exit 0.
- b4c94b343 and bib3aocgd, my wait loops: both completed by themselves.
- None is left running, and none was killed. The hold's shell, PID 8416, no longer exists (Get-Process found nothing).

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.

## Files (all in `<S>`)
- g318c3r-start.txt, -numstat.txt, -diff.patch, -stat.txt, -form-main.md
- g318c3r-chk.out, -fence.txt, -c1pins.txt
- g318c3r-sh-c1.rs, -sh-h3.rs, -pin-c1.txt, -pin-h3.txt
- g318c3r-grep1.txt, -callers.txt, -symbols.txt, -adr.txt, -base.txt, -counts.txt, -1c.md, -item5.txt, -samerun.txt, -k1rs.txt
- g318c3r-fmt.txt, -nodetest.txt, -vcites.txt, -vtc.txt, -verify.txt, -vquotes.txt
- g318c3r-status-1.txt, -ci.txt, -runs.txt, -end.txt, -ps.txt
