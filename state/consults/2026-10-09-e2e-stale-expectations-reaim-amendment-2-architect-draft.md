*Custodian's filing note (2026-10-09): the architect's draft of Amendment 2 of `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md` (rounds 70 and 71), on the custodian's brief at main d151c2e0. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is e397139828dcf36919821947b5fe9d038e19b143c34d99da97b1e1f9fc065c3a. Run window from the transcript: 19:25:50Z to 19:39:28Z. Not yet appended. Its pins are still HASH-TBD, and its section 2 lists items that are the human's.*

---

Reviewed: main @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5; branch @ cf2434e6f25033335d69ee4b667caefd109832f1

I read the branch files in the worktree `C:/dev/wt/reaim`. I took its HEAD to be cf2434e6 from your brief and from worker report 1, line 224. I have no Bash, so I did not check it myself. Every `HASH-TBD` still needs computing.

## 1. The amendment

````markdown
### Amendment 2 — rounds 70 and 71 (class 5); GROUP′ re-aimed and every existing fixture's bytes shown by hash (scope addition, class 9)

*Written after outcomes were seen: worker report 1 [A2.R12–A2.R21] and the custodian's solo runs [A2.R3–A2.R11]. It invalidates §2.3's GROUP′ assertion, P2 and I3. It touches §2.4 (route `pre`), §4, §5, §8 and §9, and adds to §7 without editing it. Items 5, 6 and 10 are a scope addition (class 9) under round 70 and round 71, declared before any code of it. Item 9 is class 2. No line above is edited.*

Branch lines are cited in words at cf2434e6 (the branch commit cf2434e6f25033335d69ee4b667caefd109832f1), with no hash (round 15 (e); round 25, item 2 (d)). The base is b8ad22ff50f11538f46bf308e5680faeb69912e1 [A2.R30]. H is the branch head at the time of a run.

**A2.R references.** Main @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5. Each hash is over whole committed lines, LF bytes. One span per pin.

| id | reference |
|---|---|
| A2.R1 | `state/directives/2026-10-09-round-71-and-round-70-paste.md:6 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R2 | `state/directives/2026-10-09-round-71-and-round-70-paste.md:8 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R3 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/README.md:3-6 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R4 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-2-hold-output.txt:6 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R5 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-2-hold-output.txt:20 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R6 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-2-hold-output.txt:28 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R7 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/w2-source-changed.log.txt:8 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R8 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-3-hold-output.txt:7 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R9 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-3-hold-output.txt:17 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R10 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-3-hold-output.txt:27 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R11 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/w3-console-run3.log.txt:12 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R12 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:31 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R13 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:55 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R14 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:46 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R15 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:81 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R16 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:159-162 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R17 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:179 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R18 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:109 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R19 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:190-194 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R20 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:156-157 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R21 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:195-200 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R22 | `frontends/shell/src/console/consoleViewModel.ts:160-169 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R23 | `frontends/shell/src/console/consoleViewModel.ts:171-189 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R24 | `frontends/shell/src/console/ConsolePanel.tsx:103-132 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R25 | `frontends/shell/src/console/ConsolePanel.tsx:183-198 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R26 | `tools/corpus/README.md:34-44 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R27 | `engine/ADMISSION-RESULTS.md:8 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R28 | `engine/examples/make-fixture.rs:31-71 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R29 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:33 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |
| A2.R30 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:7 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:HASH-TBD` |

1. **The rulings and I3.**
   - Round 71 [A2.R1] and the text round 70's fourth answer named [A2.R2]. Their ledger block is cited by its heading, RULED 2026-10-09 — round 71 and round 70's paste, and never by line.
   - [A2.R2] answers Amendment 1 item 5's open question.
   - **I3 fired in a solo run:** window 3, console run 3 [A2.R10, A2.R11]. Runs 1 and 2 exited 0 [A2.R8, A2.R9]; their logs were overwritten [A2.R3].
   - Round 71 resolves I3: GROUP′ is re-aimed by the grouping rule (item 2). Option 2 is void.

2. **GROUP′, as `console.mjs` must assert it.** This supersedes §2.3's GROUP′ steps 4, 6 and 7, and P2.
   - **Definitions.** All read from the DOM. The suite still imports nothing under `src/console/`.
     - A row's *key*:
       - class A: `a:` plus its `.console-entry-header` text;
       - class B and class C: the class letter, `:`, and the whole `.console-entry-prose` text;
       - unclassified: `u:` plus its text.
       - These keys map one-to-one onto the grouping key [A2.R22]: class-B prose ends with the command, and each class-C action renders its own statement [A2.R25].
     - An *item*: a direct child of `.console-entries` that is a single `.console-entry`, or a `.console-group` with its header text, its `aria-expanded` and its shown rows. A group's key is its rows' key.
     - The *window*: the rows in DOM order from the first residential untiled row to the last (§2.3 step 2's definition), together with every item that holds those rows or lies between them.
     - One constant, `GROUP_CALLS = 3`, sets both the number of calls and the expected residential count.
   - **Steps 1–3** are unchanged: the settle, a baseline with 0 residential untiled rows and the label total, and `GROUP_CALLS` calls, each `applied`.
   - **Step 4, the poll.** The bound and interval are unchanged (§7). Each read expands every group, then reads the items.
     - Done when the window holds exactly `GROUP_CALLS` residential untiled rows and no collapsed group lies inside it.
     - On expiry it fails as `GROUP': presence`. The message gives the count found, the item that holds each found row, and the keys from the first found row to the last (H1's discriminator, kept).
   - **Step 5, capacity**, unchanged and checked first on the passing read: R > `MAX_CONSOLE_ENTRIES` fails as `GROUP': capacity`.
     - R ≤ 256 means no entry recorded since the baseline has been evicted [R54], so every run inside the window is shown whole.
   - **Step 6.** Then, in this order, each failing by name:
     - (a) `GROUP': group`: a group in the window has N < 2, or its header is not `×N` for the N rows it shows, or its rows do not share one key.
     - (b) `GROUP': split run`: two adjacent items in the window have one key. The same check applies to the window's first item and the item just before it, when that item is a single or an expanded group. This is the grouping promise that a run of consecutive identical entries forms one item [A2.R23, A2.R24]. A session-log line between residential rows therefore breaks their run and passes.
     - (c) **The not-exercised condition** [A2.R1, its second sentence]: no group in the window shows two or more rows inside the window.
       - Its failure name is the one that sentence gives. It goes into `console.mjs` as a byte copy by script from [A2.R1], prefixed `GROUP': `, and is never typed.
       - The step never passes on single entries only.
     - (d) `GROUP': parse`: a class-A row in the window whose request text does not parse on its own (I8, as before).
   - **Step 7, the report on a pass.**
     - The window's items in DOM order, each as its key and its count of rows inside the window.
     - The number of groups that satisfy (c).
     - The number of distinct texts among the residential rows.
     - R.
   - **Bounds.** Unchanged (§7): the poll 5000/100 ms, the pre-settle 1500/15000 ms, the outer 45 s.
   - **P2′.** In every passing run, the residential texts are byte-identical. They are reported; a different count is a class-2 result. N is not predicted.
   - **I3′.** Any GROUP′ failure in a solo run stops the piece and goes to the human. A failure named `group` or `split run` is an I1 candidate.

3. **GROUP′'s observed mutations.** Each follows §4's wording [R107]: one at a time, observed at a named commit, reverted, worktree shown clean.

   | # | Mutation | Kind | Predicted failure, by name |
   |---|---|---|---|
   | M9 (stands, new text) | the third call's predicate becomes `zone = 'commercial'` | TL | `GROUP': presence`, found 2 |
   | M9c (stands) | the mirrored capacity is set to 2 | TL | `GROUP': capacity` |
   | M9n (new) | `GROUP_CALLS` 3 → 1 | TL | step 6 (c)'s ruled name: one row is inside the window, so no group shows two |
   | M9g (new) | step 6 (a) expects `×(N+1)` | TL | `GROUP': group` |
   | M9s (new) | the item read returns every group's rows as singles | TL | `GROUP': split run`; (a) passes vacuously |

   - M9n is deterministic by construction.
   - M9g and M9s fail whenever the unmutated step would pass (c).

4. **Round 70: REFUSAL′'s terms are met.**
   - M8 was observed in this piece's worktree only, as one edit and one run: thirteen mutation runs for thirteen mutations [A2.R15].
   - The permission system accepted the edit. It was restored and the worktree shown clean [A2.R16], and it was never committed [A2.R17].
   - Amendment 1 item 3 stands, and nothing further is owed.

5. **Where `engine/src/fixture.rs` branches on the identity mode** (OPEN-1 (A); round 70). All lines are at cf2434e6.

   | # | Symbol | Lines of `engine/src/fixture.rs` at cf2434e6 | What `StringIdsBesideParcelKey` does there |
   |---|---|---|---|
   | B1 | `schema`, the `id_field` match | 625-632 | takes the `StringIds` arm (627-629): the first field is `id`, `Utf8`, non-null |
   | B2 | `schema`, `if identity == StringIdsBesideParcelKey` | 634-636 | adds the field `parcel_key`, `UInt64`, non-null, second, ahead of `bbox` (637-643) and the attributes |
   | B3 | `generate`, the per-row `match spec.identity` | 1094-1106 | its own arm (1101-1104) appends `key-{id}` to `string_ids` and `id` to `ids` |
   | B4 | `generate`, the first-column match | 1167-1173 | takes the `StringIds` arm (1169-1171): the first column is `string_ids` |
   | B5 | `generate`, `if spec.identity == StringIdsBesideParcelKey` | 1174-1176 | pushes `ids` as the second column |

   - **No branch:**
     - the declaration (546-548);
     - the doc-only correction to `ForeignKeyColumn` (533-534);
     - the pass-throughs: the field (465), the default `NativeUnique` (563) and the `schema` call (937).
   - The variant never reaches the wildcard arms (631, 1105, 1172).
   - The `write_hostile_*` writers (1582, 1604, 1688) do not read the mode.
   - The reviewer checks this list against `git diff b8ad22ff...H -- engine/src/fixture.rs`.

6. **Every existing fixture byte-identical by hash** (round 70; class 9).
   - **What counts as existing.**
     - **T1:** every file that `kernel/tests/manual_walkthrough_fixtures.rs` writes, all its generators included (the 4,000,000-feature one too).
     - **T2:** every file that the default test suites write through `fixture.rs`: the workspace, and `frontends/shell/src-tauri` after its CI's frontend build.
     - **T3:** the P4 corpus and its `MANIFEST.json`. No file in it is written by `fixture.rs` [A2.R26].
     - **T4:** every other file under `C:/dev/spatial-ide/target/fixtures/` that `fixture.rs` wrote, through `make-fixture` or an ignored test. The worker lists each one, with its producing command and size, before any run.
   - **Commits.** b8ad22ff against H. A comparison counts only if `git diff --quiet cf2434e6 H -- engine/src/fixture.rs kernel/tests/manual_walkthrough_fixtures.rs` exits 0.
   - **Where.**
     - The base runs in a fresh detached worktree, `C:/dev/wt/reaim-base`, at b8ad22ff; H runs in `C:/dev/wt/reaim`.
     - Each has its own `CARGO_TARGET_DIR`.
     - Every heavy command runs inside `hold shared -Project SpatialIDE` [R95].
     - Each worktree's `target/fixtures/manual-walkthrough/*.parquet` is removed first, non-recursively.
     - Nothing is written into the main checkout's `target/fixtures`.
     - Afterwards: `git worktree remove` on the base worktree, and `git status --porcelain` empty in both.
   - **Commands.**
     - **T1:** at each commit, `cargo test -p spatial-kernel --test manual_walkthrough_fixtures --locked -- --ignored --nocapture`, then `sha256sum` over the directory's `*.parquet`.
     - **T2 and T4:**
       - A temporary patch, one scratch file, is applied with `git apply` identically at both commits and is never committed.
       - It hooks the success arm of `write_geoparquet_cancellable` and the end of each `write_hostile_*`.
       - When `SPATIAL_FIXTURE_HASH_LOG` names a directory, each hook appends one line there: the test binary's stem without its `-<hash>`, the thread name (or `unnamed`), and the written file's sha256.
       - The suites then run with that variable set. T4's files under 1 GiB are written the same way.
       - `git apply -R` reverts the patch, and the worktree is shown clean.
     - **T3:**
       - `sha256sum` of every file under `target/fixtures/compat-corpus/`, compared with its `MANIFEST.json` and `mutations/DERIVATIONS.json`.
       - `MANIFEST.json`'s own sha256, compared with [A2.R27].
       - Done before the first run of this item and after the last.
       - `admission_p4_corpus` is not run, because it rewrites a tracked file.
   - **Pass.**
     - **T1:** under the rename map (`missing-identity-refused.parquet` → `no-id-column.parquet`, `bothneeded-refused.parquet` → `no-crs-no-id-refused.parquet`), every base file has an H file with an equal sha256. H writes exactly that set plus `string-id-refused.parquet` and `no-crs-string-id-refused.parquet`.
     - **T2 and T4:** the key sets are equal, and for each key the multiset of sha256s is equal at both commits.
     - **T3:** every hash matches its manifest entry, at both times.
     - Anything else fails as `fixture byte-identity: <tier>: <file or key>` and stops the piece (I6′).
   - **M13** (under the same allowance as the patch).
     - At H, `DuplicateIds`'s written value goes from 7 to 8 (line 1097 of `engine/src/fixture.rs` at cf2434e6).
     - T1 re-runs `generate_the_dupkey_refusing_fixture` alone.
     - Predicted failure: `fixture byte-identity: T1: dupkey-refused.parquet`.
     - Reverted, and the worktree shown clean.
   - **The worker's evidence** [A2.R14] does not suffice for T1. It shows that no file on disk was rewritten; it does not show what the branch's writer produces.
     - It suffices only for F-A and F-C. The branch wrote both, equal to their predecessors [A2.R13].

7. **The solo-run rule for P1.**
   - **Console runs.** After item 2 lands at H, the custodian runs `console.mjs` alone **five** times, set in advance.
     - Each run starts a fresh app, in an exclusive hold, with nothing else of the session running.
     - Each run's log is kept under its own name and filed with its hold output.
   - **Pass:** 5 of 5 exit 0, with every step PASS (GROUP′ and REGRESS′ included) and the worktree clean after each.
   - **Any failure** is recorded with its log, and the piece goes to the human. No run is repeated or added to replace it.
   - The record states how many of the five windows held more than one item. If none did, the split path is unobserved solo and nothing is claimed for it.
   - **Window 2's passes** [A2.R4–A2.R7] stand for the other three suites only if `git diff --name-only cf2434e6 H` lists only these files:
     - `frontends/shell/e2e/console.mjs`;
     - this form;
     - `frontends/shell/e2e/README.md`;
     - `frontends/shell/MANUAL-WALKTHROUGH.md`.
     - Otherwise each of the three runs alone once more at H, and must pass.

8. **The budget.**
   - `console.mjs` stands at 208 of 220 [A2.R12], and item 2 will exceed 220.
   - **This addition's ceiling:** `console.mjs`'s §7 count (§7's command) at the PR head is at most 290.
   - Every other §7 figure holds:
     - the code total stays within 860;
     - `README.md` stays within 40;
     - files stay at 9 or fewer. Nothing tracked is added: the patch, M13, the hash lists and the logs are never committed to the piece.
   - §7 is not edited. A final count above 220 gets a class-8 row, `budget overrun, §7 not edited`: 220, the final figure, and this item as the reason. A count above 290 is recorded the same way.

9. **c7d41dac (class 2), accepted.**
   - **What did not hold.** At c98263a1 the ladder was unchanged, as §2.4 declares for route `pre`, and P5's first clause failed: the pan and zoom rungs both stayed 17→17 [A2.R18].
     - That run was shared. It is recorded only as the reason for the change, and never as a failure (§9, §8 item 11).
   - **The change.** Route `pre`'s pan takes `dragsToCrossDataset` (lines 506-512 and 910 of `frontends/shell/e2e/source-changed.mjs` at cf2434e6). That is the bound the post route already uses under the human's Decision A (lines 955-967 of the same file at cf2434e6).
     - It is test-side and within §7: 142 of 170 [A2.R29].
   - **At cf2434e6:**
     - P5 held solo [A2.R6, A2.R7];
     - M11 and M12 failed by name [A2.R20];
     - the worker disclosed the difference [A2.R19].
   - P5 is not edited.
   - Worker differences 2 and 3 [A2.R21] are accepted as written. Neither changes a prediction.

10. **Class-9 declarations (§5, §8, §9).**
    - **Declared unchanged:**
      - every §1 product path;
      - `lib.mjs`;
      - every console step except GROUP′;
      - the regression, admission and source-changed files after cf2434e6;
      - `fixture.rs` and `manual_walkthrough_fixtures.rs` after cf2434e6.
    - **I6′:** any difference in T1–T4.
    - **I7:** the human withholds the patch and M13 allowance and rules no reduced claim. T2 and T4 then stop.
    - **§8 additions:**
      - 14. The patch or M13 committed, pushed, left in place, or applied outside this piece's worktrees.
      - 15. A solo GROUP′ run repeated or added to replace a failure.
      - 16. Step 6 (c) removed or weakened, or its name typed instead of byte-copied.
      - 17. Anything written under `target/fixtures/compat-corpus`, or `admission_p4_corpus` run.
    - **§9:** the architect resolves T1–T4's lists and item 5. The reviewer recomputes the hashes and checks the patch's revert.

11. **Superseded index.**
    - §2.3 GROUP′, steps 4, 6 and 7 → item 2
    - P2 → item 2 (P2′)
    - I3 → items 1 and 2 (I3′)
    - §4's M9 failure text → item 3; M9n, M9g, M9s and M13 are added (items 3 and 6)
    - P1's run count → item 7
    - I6 → item 10 (I6′)
    - §2.4's unchanged ladder for route `pre` → item 9
    - Amendment 1 item 5's open question → item 1
    - §2.6 (A)'s unchanged-bytes sentence → proven by item 6, not edited

    Nothing above is edited.
````

## 2. Still the human's

1. **Allowance for a temporary engine edit.** The hash-log patch and M13 edit `engine/src/fixture.rs`, which is a §1 product path. They need the human's word on M8's terms.
   - **If refused:** item 6 cannot cover every test-written fixture by hash.
   - **The reduced alternative:** an uncommitted test-side probe that writes each existing identity mode across the spec axes at both commits, with the claim cut to that grid (round 15 (b)). Whether to accept that cut is the human's decision.
2. **Fixtures of 1 GiB or more (T4).** The 5 GB parcels at least would need two regenerations under an exclusive hold, or an exemption. The fact that `make-fixture`'s CLI cannot set the identity mode [A2.R28] is an argument from reading the code, not a hash.
3. **Class fit.** Class 9 names a *standing* rule, but rounds 70 and 71 are rulings for this piece. I recorded them as class 9 because your brief says so. c7d41dac is recorded as class 2. Per the template, a class that does not fit goes to the human.
4. **Five solo runs** is my proposal. The human may set a different number before the runs.
5. **My reading of "the step must see a run".** I read it as a group with two or more rows inside the step's own window (step 6 (c)), not any group anywhere in the console.
6. **No GROUP′ code before this amendment is committed.** Round 25 makes code landed before the amendment a failure by name.

## 3. Files read

- `C:/dev/wt/reaim/frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`
- `C:/dev/wt/reaim/frontends/shell/e2e/console.mjs` (lines 1-80, 180-299, 615-704)
- `C:/dev/wt/reaim/frontends/shell/e2e/source-changed.mjs` (lines 505-512, 906-914, 955-970)
- `C:/dev/wt/reaim/frontends/shell/src/console/consoleViewModel.ts`, `ConsolePanel.tsx`, `surfaceRegistry.ts` (lines 160-299)
- `C:/dev/wt/reaim/engine/src/fixture.rs` (lines 455-654, 890-1189, plus greps)
- `C:/dev/wt/reaim/engine/Cargo.toml`, `C:/dev/wt/reaim/Cargo.toml`, `C:/dev/wt/reaim/frontends/shell/src-tauri/Cargo.toml` (greps)
- `C:/dev/wt/reaim/kernel/tests/manual_walkthrough_fixtures.rs` (lines 1-40, 529-564, 700-750, plus grep)
- `C:/dev/wt/reaim/engine/tests/admission_p4_corpus.rs` (lines 1-80)
- `C:/dev/wt/reaim/engine/examples/make-fixture.rs`
- `C:/dev/wt/reaim/tools/corpus/README.md`
- `C:/dev/spatial-ide/state/directives/2026-10-09-round-71-and-round-70-paste.md`
- `C:/dev/spatial-ide/state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md`
- `C:/dev/spatial-ide/state/drafts/e2e-stale-expectations-reaim-solo-runs/` (`README.md`, both hold outputs, `w3-console-run3.log.txt`, `reaim-solo.sh.txt`, a grep of `w2-source-changed.log.txt`)
- `C:/dev/spatial-ide/DECISIONS-PENDING.md` (lines 30-44)
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md` (lines 95-178)
- `C:/dev/spatial-ide/engine/ADMISSION-RESULTS.md` (lines 1-10)
- `C:/dev/spatial-ide/frontends/shell/src/console/consoleViewModel.ts` (lines 158-189) and `ConsolePanel.tsx` (lines 103-132), to check that main matches the branch
