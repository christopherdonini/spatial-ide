*Custodian's filing note (2026-11-01): lead-data's read-only draft of the five-line form for `pre-admission-change-detail-braces`, the filler queue's entry 3 (S3), read at main 7591cdad (dispatched 2026-11-01T03:53:49Z by the main transcript, its prompt equal to its brief by script). Its form is committed in the same commit at its governance path, with the custodian's settlement. The run 03:53:50Z to 04:01:06Z by its transcript (Read 33, Grep 35, Glob 1; no write tool; no call outside the repository). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 048913d92d6b450fa736e1a13734bb91d24289a80f35f04c676b87978d53e3e8.*

---

Draft: pre-admission-change-detail-braces five-line form, lead-data

Read only, at main 7591cdad (the working tree on main). I have no shell, so this report has no sha256. Every cite below is `path:line @ 7591cdad` unless it says otherwise. Text in code quotes is byte-copied from the file cited. Everything else is in my own words.

## The draft

Form path: `governance/forms/kernel/PRE-ADMISSION-CHANGE-DETAIL-BRACES-PREREGISTRATION.md`, committed on main by the custodian before any code.

```
Authority: PLAN node `pre-admission-change-detail-braces` (governance/PLAN.yaml:4192-4208 @ 7591cdad), filler queue entry 3, graded S3, placed at the node's scope (i), the braces removed and the words staying placeholders (state/FILLER-QUEUE.md:9 @ 7591cdad; state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:11 @ 7591cdad; the strings-and-red-lines clause, state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:17 @ 7591cdad), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 7591cdad); the finding is PR #173's gate-1 reviewer N-3 (state/consults/gates/2026-10-04-watch-grandparent-spawn-signal-gate1-reviewer.md:24 @ 7591cdad), widened to four sites by Fable's 2026-10-04 advice, item 2 (state/directives/2026-10-04-fable-advice-nodes-trailers-latency.md:16-20 @ 7591cdad); the declared shape is the source-watcher form's §7 Placeholders row (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:402 @ 7591cdad); reuse index: a miss, no prior art recorded for "placeholder detail string braces" (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief).
Scope: 6 files: kernel/src/skp.rs; kernel/src/lib.rs; kernel/tests/source_watch_ordering.rs; kernel/tests/typed_terminal_codes.rs; frontends/shell/src/testUtils/terminalShapes.ts (test-only, OPEN-2); kernel/README.md (owner's index: this form added to the preregistration list, and the Last-verified bullet, OPEN-7); declared line budget 120 by §21c's counting rule (governance/AUTONOMY.md:357 @ 7591cdad), about 85 estimated (note N4); this form is exempt; no new dependency, no new `pub` item, no new `EngineError` variant, no new refusal code, and nothing under protocol/, engine/ or KNOWN-LIMITATIONS.md.
Change: the four detail literals that open with `{` before the `[P6 placeholder]` tag and close with `}` (kernel/src/skp.rs:1027 @ 7591cdad, the pre-admission `Change` refusal; kernel/src/skp.rs:1519-1520 @ 7591cdad, `viewport_query`'s attribute-step coverage-lost refusal; kernel/src/skp.rs:1638-1639 @ 7591cdad, `require_live`'s coverage-lost refusal; kernel/src/lib.rs:545-546 @ 7591cdad, `create_from_ticket`'s `EndedByCoverageLoss` terminal) each lose those two brace characters and nothing else, so each detail starts with `[P6 placeholder]` as the §7 row declares and its words stay the placeholders they are; the operator message for these four refusals keeps its code, its field set and its trigger, and the parenthesised detail no longer carries a brace at either end; the test-only shell constant that copies one of them (frontends/shell/src/testUtils/terminalShapes.ts:56-61 @ 7591cdad) loses the same two characters.
Tests+mutation: T1, changed: kernel/tests/source_watch_ordering.rs::a_signal_between_arming_and_admission_refuses_the_open (K6) gains an equality between `refused.fields.get("detail")` and the brace-free pre-admission literal; M1: the two braces restored at kernel/src/skp.rs:1027; predicted failure: K6 at that equality, left `Some("{[P6 placeholder] a notification arrived for this source before admission}")`, right the same string without its braces. T2, new: kernel/src/skp.rs::ticket_drop_under_lock_regression::a_coverage_loss_between_mint_and_attribution_refuses_with_its_own_code_and_placeholder_detail (open, then resolve and mint through the in-crate steps, end the generation with `SessionEndReason::CoverageLost`, then attribute; it asserts code `engine.source_coverage_lost` and the brace-free `detail`); M2: the braces restored at kernel/src/skp.rs:1519-1520; predicted failure: T2 at its detail equality. T3, changed: kernel/tests/typed_terminal_codes.rs::a_coverage_lost_pre_check_refusal_carries_its_typed_code_and_exact_text, whose expected text (kernel/tests/typed_terminal_codes.rs:365-369 @ 7591cdad) loses the two braces; M3: the braces restored at kernel/src/skp.rs:1638-1639; predicted failure: T3's assert_eq on the whole message. T4, changed: kernel/src/skp.rs::ticket_drop_under_lock_regression::a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code (R3) gains an equality between the redeem step's refusal and the whole brace-free terminal detail; M4: the braces restored at kernel/src/lib.rs:545-546; predicted failure: R3 at that equality. Each mutation restores one site's braces only, and fails its own test and none of the other three. Each is observed by applying it, running the named test, recording the failure by name with the commit in a `RECORDED MUTATION:` doc line, and reverting. No shell test changes outcome, because no shell test reads the braces.
Out-of-scope: ADR: none (no status line, no amendment); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP or data-plane message type, field, code or literal under protocol/ changes; the free-text values of `fields.detail` and `message` on four existing refusals each lose two characters, and SKP-V0 declares no value for them, protocol/skp/SKP-V0.md:885-887 @ 7591cdad; OPEN-3); guarantee: touched by §21a's letter only, as a property currently under test (the exact text T3 pins), and only brought into line with the §7 row; no ADR-018 cancellation behaviour, ceiling, docs/08 claim, undo class or refusal order changes; §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch; no new string, no new dependency, no new exposure surface.
```

## Notes (lead-data's)

**N1. The literals at this main (settles item 2)**
- **Still four braced.** These are every `{[P6 placeholder]` literal in product code. A search of the whole tree, excluding target directories, finds no others:
  - kernel/src/skp.rs:1027 @ 7591cdad. This is the `Change` arm of `engine_error_of_pre_admission_signal` (kernel/src/skp.rs:1024-1032 @ 7591cdad). It is reached from the `Watching` refusal (kernel/src/skp.rs:1231 @ 7591cdad) and from the `ChecksOnly` refusal (kernel/src/skp.rs:1287 @ 7591cdad).
  - kernel/src/skp.rs:1519-1520 @ 7591cdad. This is the `CoverageLost` arm of `viewport_query_attribute`'s refusal (kernel/src/skp.rs:1513-1523 @ 7591cdad).
  - kernel/src/skp.rs:1638-1639 @ 7591cdad. This is the `CoverageLost` arm of `require_live` (kernel/src/skp.rs:1631-1642 @ 7591cdad). `require_live` is called from `viewport_query_mint` (kernel/src/skp.rs:1448 @ 7591cdad) and from `session_history` (kernel/src/session_history.rs:157 @ 7591cdad).
  - kernel/src/lib.rs:545-546 @ 7591cdad. This is the `EndedByCoverageLoss` arm (kernel/src/lib.rs:543-549 @ 7591cdad).
- **Two unbraced P6 strings, unchanged by this piece:** kernel/src/skp.rs:1238-1240 @ 7591cdad (the conservative coverage-lost fallback) and kernel/src/skp.rs:1344 @ 7591cdad (`describe`'s checks-only reason).
- **Line drift from the node's cites.** The node checked its line numbers at f3426ba8 (1024, 1445, 1521, lib.rs 528; unbraced 1233 and 1329). I cannot read f3426ba8, so I matched the sites by content and function, not by line. For the code, the tree at this main is authoritative.
- **No change beyond the braces looks needed.** The words stay placeholders, and no red-line OPEN item is raised. Two features of the text could look like they need wording changes, but they belong to the P6 sitting (the node's scope (ii)) and are not proposed here:
  - the doubled tag in the coverage-lost messages: the engine's `Display` starts `[P6 placeholder]` (engine/src/error.rs:427 @ 7591cdad), and the detail inside it will too;
  - the sibling arms' mixed convention (N5).

**N2. What a user sees (settles item 3)**
- **Where the text goes.** Every detail is wrapped by the engine's `Display` in `(…)`: SourceChanged at engine/src/error.rs:380-385 @ 7591cdad, SourceCoverageLost at engine/src/error.rs:425-430 @ 7591cdad. `error_of` carries that `Display` as `message`, and the raw detail as `fields.detail` (kernel/src/skp.rs:2069-2071 @ 7591cdad, kernel/src/skp.rs:2118 @ 7591cdad, kernel/src/skp.rs:2211 @ 7591cdad). `terminal_detail_of` prefixes the code for the lib.rs terminal (kernel/src/skp.rs:2062-2064 @ 7591cdad).
- **Before and after.** This is my composition from those lines, not captured output. The SourceChanged message now reads "...changed while it was open ({[P6 placeholder] a notification arrived for this source before admission}). This check..." and after the change reads "...changed while it was open ([P6 placeholder] a notification arrived for this source before admission). This check...". The three coverage-lost messages change the same way inside "lost coverage (…)".
- **How the shell handles it.** The shell matches these refusals by code only (frontends/shell/src/streaming/liveTicketSet.ts:80-85 @ 7591cdad). It splits a terminal at the first ": " and shows the rest (frontends/shell/src/streaming/formatTerminalRefusal.ts:33-45 @ 7591cdad). Nothing in frontends/shell/src parses a brace in a detail: I searched every .ts/.tsx file there for brace parsing, and the only hits were source-text regexes in unrelated tests.
- **Is it new user-visible behaviour under §21c?** §21c's bounds include "no new user-visible behaviour" (governance/AUTONOMY.md:350-351 @ 7591cdad). My reading is that it is not new: the same four refusals, codes, triggers and placeholder words, each two characters shorter. This is OPEN-1.
- **What that means under §36.** If the change is within the bound, the five-line form stands, with the reviewer and the architect gating from dispatch, and §25 (e) set aside (governance/AUTONOMY.md:692 @ 7591cdad). If the human reads it as new, the piece is over §21c, which a filler cannot be, and it leaves the filler slot.
- **Product reach is Windows only.** Only the Windows watcher delivers signals. The non-Windows arm returns `ChecksOnly` with no sink call (state/consults/gates/2026-10-04-watch-grandparent-spawn-signal-gate1-reviewer.md:88 @ 7591cdad, reading `watch.rs:90-99` at 38bb2d63). The watcher form owes "Windows only" (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:405 @ 7591cdad).

**N3. Tests that pin these literals, and how each changes (settles item 4)**
- **Exact pins of a braced P6 literal.** There are two. I found them by searching the whole tree for `{[P6 placeholder]` and for each literal's closing words:
  - kernel/tests/typed_terminal_codes.rs:363-370 @ 7591cdad (T3). Its expected text loses the two braces on lines 366-367.
  - frontends/shell/src/testUtils/terminalShapes.ts:56-61 @ 7591cdad. This is a test-only constant. Its doc says it is written against T3's bytes, and T3's doc says the same (kernel/tests/typed_terminal_codes.rs:306-308 @ 7591cdad). It loses the two braces on lines 58-59 and stays byte-equal to T3's new expected string; the reviewer checks that by byte comparison. Its consumer, frontends/shell/src/streaming/liveTicketSet.test.ts:163-168 @ 7591cdad, splits off the code and checks the code only, so its outcome does not change. No mutation is owed, because the shell file holds no new test.
- **Tests that reach a literal without pinning its text, by my reading:**
  - K6 and GS1 assert the code only (kernel/tests/source_watch_ordering.rs:351 @ 7591cdad, kernel/tests/source_watch_ordering.rs:397 @ 7591cdad).
  - K15 asserts the code only (kernel/src/skp.rs:4368-4372 @ 7591cdad).
  - R3 asserts a prefix only (kernel/src/skp.rs:4899-4903 @ 7591cdad).
  - No test reaches kernel/src/skp.rs:1519 at all. The in-crate steps CR3 uses (kernel/src/skp.rs:4697-4710 @ 7591cdad) reach it; that is T2's route.
- **Why T1 extends K6 and not GS1.** K6 drives the real `open_dataset` `Watching` refusal with an injected `Change`, and `fields.get("detail")` is already used in that file (kernel/tests/source_watch_ordering.rs:611 @ 7591cdad). GS1's shared helper also serves GS2, whose detail is the cause, so extending it costs a parameter.
- **T4 is a whole-string equality.** The lib.rs detail is the same text as the require_live one, so R3's terminal equals T3's expected string. I chose equality over a substring check so that either brace restored fails it.
- **Test-first prediction.** At the base, T2 fails on its detail equality, and T1, T3 and T4 as changed fail on theirs. Each passes after its site's change. The workspace `--list` gains exactly T2.
- **A comment left as it is (OPEN-4).** K15's recorded-mutation comment quotes the braced message as it was observed (kernel/src/skp.rs:4335-4340 @ 7591cdad). It is a record of an earlier run, not a pin, so this piece does not change it.

**N4. Size against §21c (settles item 1)**
- **The bound.** At most 150 changed lines over at most 8 files, tests counted (governance/AUTONOMY.md:350-351 @ 7591cdad, governance/AUTONOMY.md:357 @ 7591cdad).
- **My estimate, insertions plus deletions:**
  - product literals: skp.rs 10, lib.rs 4;
  - T2: about 40;
  - T4's added equality and its mutation line: about 10;
  - T1's added assertion and its mutation lines: about 6;
  - T3's text and its mutation line: about 6;
  - terminalShapes.ts: 4;
  - kernel/README.md: 4 (one list line, one Last-verified line).
- **Totals.** About 84 lines over 6 files. The declared budget of 120 leaves room for a rustfmt reflow. Line 1027 stays split from its `.to_string()` by my count: 107 columns if joined, against a limit of 100.
- **Smaller variants.** Without kernel/README.md it is 5 files and about 80 lines. Without terminalShapes.ts (OPEN-2 (B)) the piece also drops the require_live site.

**N5. Out of scope, noted for the custodian**
- **Three braced literals with no P6 tag stay braced:**
  - kernel/src/skp.rs:1515 @ 7591cdad;
  - kernel/src/skp.rs:1633-1634 @ 7591cdad;
  - kernel/src/lib.rs:533-534 @ 7591cdad, which its own comment calls byte-identical to the pre-check sentence (kernel/src/lib.rs:524-525 @ 7591cdad).
- **One e2e test pins one of them:** frontends/shell/e2e/s5dVerdict.test.mjs:26 @ 7591cdad.
- **Where the braces come from.** They follow the engine's own convention, a brace-wrapped component list or sentence (engine/src/descriptor.rs:316 @ 7591cdad, engine/src/descriptor.rs:335 @ 7591cdad). SKP-V0 documents that convention for the component list (protocol/skp/SKP-V0.md:723-726 @ 7591cdad).
- **The effect.** After this piece, each session-ended arm pair has one braced and one unbraced sibling. The human's placement covers the four tagged literals only (OPEN-5).

**N5a. Platform item (settles item 5; docs/PREREGISTRATION-TEMPLATE.md:177 @ 7591cdad)**
- **No Platform section is owed.** R3's section applies to a piece that adds or materially changes an OS-dependent feature. This piece changes string literals, with no cfg.
- **Windows:** the product reaches all four sites (N2). T1 to T4 run on the windows-latest `cargo test --workspace` entry (state/consults/gates/2026-10-04-watch-grandparent-spawn-signal-gate1-reviewer.md:92 @ 7591cdad, as that report read CI then).
- **Linux:** the product does not reach these refusals, because no watcher signal is delivered. The tests use the injected watch or the in-crate steps and run on the ubuntu-24.04 entry.
- **macOS:** the same as Linux in the product. I read no macOS job on main; port-2's macOS L1 is in flight. Nothing is deferred and no KNOWN-LIMITATIONS item is owed, since nothing here is OS-specific.

**N6. Rule (00), path by path (settles item 6; the rule is governance/AUTONOMY.md:609 @ 7591cdad). Checked against the lists in the brief:**
- **kernel/src/skp.rs:** not in any listed branch's kernel paths.
- **kernel/src/lib.rs:** CONFLICT. `cut/b2-piece-1c-save-and-reopen` edits it. This is entry 3's standing skip reason (state/FILLER-QUEUE.md:9 @ 7591cdad), and it still holds at this main, so the entry stays skipped at dispatch (OPEN-6).
- **kernel/tests/source_watch_ordering.rs:** not listed.
- **kernel/tests/typed_terminal_codes.rs:** not listed.
- **kernel/README.md:** not in the kernel paths of b2-1c or port-2.
- **frontends/shell/src/testUtils/terminalShapes.ts:** I cannot settle this one. The brief gives only kernel paths for b2-1c (6 other files), port-2 (11 other), #273 (6), #272 (2) and #271 (2).
- **Protocol, lockfiles and wire fixtures.** The piece touches nothing under protocol/, no Cargo.lock and no package-lock.json. In my reading terminalShapes.ts is not a "wire fixture" in (00)'s sense: those are the protocol/skp/tests/data files, which hold none of these strings. That reading is the custodian's to confirm.

**N7. Sequence for the worker**
1. Change T1, T3 and T4, and add T2. Each is seen failing at the base.
2. Remove the eight braces.
3. Copy T3's expected string into terminalShapes.ts.
4. Apply M1 to M4 one at a time.
5. Update the owner's index line.
6. Run fmt and the kernel suite, plus the shell's vitest run for liveTicketSet, viewportStreamManager and tableSource, which import the constants file.

## OPEN items, each with options and my recommendation

- **OPEN-1. Is the brace-free message "new user-visible behaviour" under §21c?** Recommendation: (A). Not a red line.
  - (A) Not new. The refusals, codes, fields, triggers and placeholder words are the same, and two stray characters go. The human placed exactly this change in the filler slot. The five-line form stands under §36.
  - (B) New. The piece is over §21c, leaves the filler slot, and takes the full form.
- **OPEN-2. frontends/shell/src/testUtils/terminalShapes.ts in Scope.** Recommendation: (A). Not a red line. The custodian should still confirm against §36's text.
  - (A) Include it. §36's text (governance/AUTONOMY.md:692 @ 7591cdad) names no frontends/shell exclusion. The weekend slot's "touch no file under frontends/shell" (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:8 @ 7591cdad) belonged to the weekend exception, which §36 replaced. Leaving the constant stale would make the shell's tests encode a shape the kernel no longer sends, which the architect's seam rule fails by name.
  - (B) Exclude it, and drop the require_live site (kernel/src/skp.rs:1638-1639) from this piece. That leaves three of the four the human placed.
  - (C) Exclude it and leave it stale. Not viable, for the seam rule above.
- **OPEN-3. The wire reading in Out-of-scope.** Recommendation: (A). Gating is the same either way under §36.
  - (A) No wire touch. No type, field, code or literal under protocol/ changes, and SKP-V0 declares no value for these details. This follows the precedent of #255's form, which changed a terminal detail under "wire: none".
  - (B) Name wire as touched by §21a's letter. The free-text values of `fields.detail` and `message` change. §25 (e) stays set aside, so the five-line form with both gates still stands.
- **OPEN-4. K15's recorded-mutation comment (kernel/src/skp.rs:4335-4340 @ 7591cdad) quoting the braced message.** Recommendation: (A).
  - (A) Leave it. It records an observed failure from an earlier run, and editing it would make it claim an observation that never happened.
  - (B) Remove its braces, for consistency.
- **OPEN-5. The three braced literals with no P6 tag (N5).** Recommendation: (A). This is not a red line, but placement is the human's.
  - (A) Out of scope, as the human placed it (four literals). The custodian may propose a node.
  - (B) Widen the piece to include them. That is outside the placement, touches s5dVerdict.test.mjs, and needs the human.
- **OPEN-6. The kernel/src/lib.rs overlap with `cut/b2-piece-1c-save-and-reopen`.** Recommendation: (A).
  - (A) Keep entry 3 skipped at dispatch until b2-1c merges, then dispatch on this form unchanged.
  - (B) Split the piece: the three skp.rs sites now, the lib.rs site later. That makes two pieces, contrary to the placement of the four.
- **OPEN-7. kernel/README.md in Scope.** Recommendation: (A).
  - (A) Include it: this form added to the index's preregistration list and the Last-verified bullet, as 7a's form did. Nothing else in the index changes, because no pointer's target changes.
  - (B) Omit it, saving one file and about 4 lines.

No item is marked as a red line.

## What I could not settle

- Whether terminalShapes.ts or kernel/README.md is among the non-kernel paths of `cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, #273, #272 or #271. The custodian checks by `git diff --name-only origin/main...<branch>`.
- The mapping of the node's f3426ba8 line numbers to this main's lines. I matched by content; I cannot read that commit.
- That T2's route (open, mint, `end_generation(CoverageLost)`, attribute) reaches kernel/src/skp.rs:1519 as I read it. This comes from reading only, never a run. The worker's test-first run settles it.
- Whether any macOS CI job exists on main at dispatch.

Report path: C:/dev/spatial-ide/state/consults/2026-11-01-pre-admission-change-detail-braces-five-line-form-lead-data-draft.md (to be filed by the custodian; I wrote no file). No sha256: I have no shell.
