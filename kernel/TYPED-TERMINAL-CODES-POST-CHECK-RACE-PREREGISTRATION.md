# typed_terminal_codes: the real-redeemed-stream test made unable to lose its post-check race
# (PLAN node typed-terminal-codes-post-check-race)

File: kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md
Authority: the human's placement of 2026-10-07 (state/directives/2026-10-07-typed-terminal-codes-race-placed.md:6 @ 3d740f7b sha256:f73f58d56b4ab68a84ab11d2bae4738e1491769563801b9f7678f868fba6e149; its RULED block in DECISIONS-PENDING.md); item 3 of the 2026-10-07 awaiting-merge direction (state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:9 @ 3d740f7b sha256:ddc539551c1fc8fc4fac62103ccaaecc9c6c130c113a245ff4f5c3dfb2521e91); question round 25, item 1 (a); drafting: question round 43, item 2; Part B: the sibling-search default (AUTONOMY.md:415 @ 3d740f7b sha256:0d424d043540e68739df05a1a368bd7fc1887f209931aa1805f8d3278ef4f5ca, a sub-line span, item 14; the hash is the whole line's).
Drafted by: the architect agent, alone (the lead-data pilot is paused under the product-first direction, section 1); code read at main 3d740f7b.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)).

## §0. Disclosure

0.1 The failure. The test was the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code, on ubuntu-24.04 only. It panicked at its terminal expect because the stream ended clean:
  - state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:1262 @ 3d740f7b sha256:bfbe2c8005907cda63d2a9ae6a1475122b1f17269e0b4cabed8620dcfd869d0e
  - state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:1269-1270 @ 3d740f7b sha256:18c71766715343a8469d375cbc1db1014d3ed2e92fef6cf2c38ee32636c61b70
  - Attempt 2 passed on both platforms (the PLAN node's summary).

0.2 The test as it stands.
  - The whole test: kernel/tests/typed_terminal_codes.rs:79-153 @ 3d740f7b sha256:b0d7ee189b1f6dfcc787c65f2d7b3eb369c4cc5308934471022ea1d2f4566f13
  - Its fixture, 200 features: kernel/tests/typed_terminal_codes.rs:49-64 @ 3d740f7b sha256:65f040135bdb222dc176958fecaa55c8dfc96c6d727e948a47b8207b9a018068
  - The touch, after redeem: kernel/tests/typed_terminal_codes.rs:129-131 @ 3d740f7b sha256:c1c4211d49e7ba5a1b64aca98c46eb99f89c067f1b7149063cf3ae8cf2b9d7ce
  - The drain and the expect: kernel/tests/typed_terminal_codes.rs:133-142 @ 3d740f7b sha256:8c3f79804aa592befae44ff37e10537287978b16c08befb7945d6a54b667bd79
  - Its recorded mutation, expected and never observed: kernel/tests/typed_terminal_codes.rs:86-89 @ 3d740f7b sha256:44fe06c1354350e0403759b4cc08a3d8f3b2e58a90185a948ec5fcfcd2673663
  - The other caller of fixture(): kernel/tests/typed_terminal_codes.rs:278-279 @ 3d740f7b sha256:cb55d51dfe0272a3509a0c3b6f2bc8057b76b659e3bffb8f35d61dc435957c22

0.3 Cause (read from code, not observed). The producer is spawned with the stream, inside viewport_query, and not at redeem.
  - The spawn: kernel/src/skp.rs:1465-1471 @ 3d740f7b sha256:e9c1fc2216056c966e6e70b08bd19c9fa03f628aebda3d4d58b133c7185fe810 and engine/src/stream.rs:1248-1265 @ 3d740f7b sha256:678fed1388cfb6800c31e2cc4523b304065cefc89720baa0b6e174be4649d03d
  - Redeem moves the built source and nothing more: kernel/src/skp.rs:293-309 @ 3d740f7b sha256:14f98f427886e8c025df467fca22a17be63e079117e05820c03ea09ebd9a2867 and kernel/src/lib.rs:446-449 @ 3d740f7b sha256:bc95b79da0b409daf781826d2e5a5cf6d8e12c0a947b76f90609f87dc5ee9beb
  - With one batch, the producer can send it into the free queue, run its post-check (engine/src/stream.rs:1327-1337 @ 3d740f7b sha256:8a6cd95dd078ebe30357f0c79ef4b505eb330c5104d5bc53850dad2392b19aa8) and end clean before the test touches the file.
  - The PLAN summary names redeem as the spawn point. This corrects it.

0.4 Siblings (the sibling-search default).
  - E2: kernel/tests/session_end_event.rs:150-193 @ 3d740f7b sha256:c28d4c68036e276b9545ba8216697deecf26ee22896b437f3c327c9f72ed93e3. It has the same race, with 300 features (kernel/tests/session_end_event.rs:33-46 @ 3d740f7b sha256:f0ed248fdc50a1dc9255003d203656dbe5f6323ea0f9a4c2e54a0961935b5d47). This is Part B.
  - E3: kernel/tests/session_end_event.rs:206-253 @ 3d740f7b sha256:b7493807c4742a1596a4d75c17a9de3c27896b13f42f65f06e26c1fa1605d449. It has the same race, and also one between its cancel and the producer's end. This is Part B.
  - kernel/src/skp.rs:3349-3369 @ 3d740f7b sha256:c5db39c92f3516c70b8288fb1bbebe7294e001ae9b6a217573210b8311205bda has the same race. The file is in the lines cut's §7 list (engine/GEOMETRY-LINES-PREREGISTRATION.md:504 @ 3d740f7b sha256:7a0a16e26d7dc145b185671fbba459a56a1e45bb6f1e465f6ba476c22118688e), so it is out of scope here and routed as a proposed node.
  - E4's sleep (kernel/tests/session_end_event.rs:301-304 @ 3d740f7b sha256:505984128774eb03090d62fd7ca68d981345afa601d7eabf243c04e717441928) is a different shape, on a path the product declares best-effort. It is out of scope.

0.5 Budget. The node declares 45 minutes, and the full form and its gates exceed that. The custodian records the deviation in PLAN. It is not a §7 figure.

## §1. May and may not claim

- May claim: in every run where the test's batch-count assertion holds, the post-check reads the source after the touch, by §2's ordering argument.
- May not claim:
  - that CI's failure was observed to have this cause; M-2 shows consistency, not cause;
  - any timing, duration or performance number;
  - any change to product behaviour;
  - anything about the skp.rs sibling or E4.
- No ADR is cited as amended, and none is amended. No wire, SKP, MCP or data-plane change.

## §2. The change

Part A: kernel/tests/typed_terminal_codes.rs only.
- A1. A helper fixture_with_features(name, features), with fixture()'s spec and the feature count passed in. fixture() keeps its 200 and its exact output, either by delegating or by being left untouched.
- A2. The end-to-end test uses fixture_with_features("terminal-carries-code", 5_000).
- A3. The drain loop counts Ok batches and clears buf per batch.
- A4. Immediately after the loop, and before the terminal expect, it asserts batches > MAX_QUEUED_BATCHES. The constant is imported from spatial_engine (engine/src/lib.rs:146-152 @ 3d740f7b sha256:af666d8c5cff3044f1d3c542e552fe99b323d0e11f6dc91b600ffafe36e31818). The message says the ordering argument needs at least that many batches.
- A5. The comment at the touch, and the test's doc, state the ordering argument below by symbol name. The doc gains M-1's line.
- No sleep, no timeout used to synchronise, and no timing assertion (question round 25, item 1 (a)).

Why the order is guaranteed:
- The queue holds MAX_QUEUED_BATCHES items: engine/src/stream.rs:82 @ 3d740f7b sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f and engine/src/stream.rs:1234 @ 3d740f7b sha256:427fa25970aa4fa8ff805fd089f08a16a2c7064cb1d9174b2ff7459f5851c39a
- Each batch is a blocking send: engine/src/stream.rs:2541-2552 @ 3d740f7b sha256:38bb8aa2144230783eada5dc3acdfc70764f1626fd7f94821018c2fb05a35261
- The consumer's only receive is next_into's recv: engine/src/stream.rs:779-794 @ 3d740f7b sha256:7ae7b06c51312fe223d1ce00c7e4e090ea784c54472e5f31b783bf635a8cbf47
- The post-check runs after produce returns, and the terminal follows it: engine/src/stream.rs:1327-1359 @ 3d740f7b sha256:24f62b0d7f59a0b07c55116b27e962328f26158dc0e051a847b35c9575384bb7
- So with at least MAX_QUEUED_BATCHES + 1 batches, the third send completes only after the test's first next_into, and the test touches the file before that call.

Why 5,000 features give at least 3 batches (arithmetic over the code):
- Batch k is at most target_for(k):
  - the cut before append: engine/src/stream.rs:2004-2027 @ 3d740f7b sha256:215e8ec8013cec74825b74ebf21d918d0dfdf7ed602d583f5417d4da7e6d1ec1
  - the cut at the target: engine/src/stream.rs:2052-2076 @ 3d740f7b sha256:31c42ea912f98dd653fd7bb321148dbae47c3fce5fef48c3dfc95909a74a308b
  - the size-only policy on this path: engine/src/stream.rs:903-920 @ 3d740f7b sha256:4e6e6c6a8a3fa6216f60fcfa7cefddf8384f85f0b008dbac99f320d4603b02ad and engine/src/stream.rs:395-408 @ 3d740f7b sha256:2ab51eb8384f8fc947c103c39065393d75b7a68d6c785a5ffb7215c9c8839c68
  - target_for(0) + target_for(1) = 327,680 bytes: engine/src/stream.rs:449-458 @ 3d740f7b sha256:df7c55b3e6d793e7409d47f3fec795a7012d26daa66edc02b9f9cc0a15f1eee2
- A row is at least 92 bytes:
  - the estimate is 20·v + 12: engine/src/stream.rs:2270-2273 @ 3d740f7b sha256:396c198087c4410676cc3df3795e5213a0e5c18a768c15c8f99a8cf4e79828ff
  - at least 4 vertices per row: engine/src/fixture.rs:1251-1254 @ 3d740f7b sha256:c6c551ee92fdb888fd848c4d714e0c8870c43582f5623c86f48ce974014af33f and engine/src/fixture.rs:1358-1369 @ 3d740f7b sha256:f7ed40c285d193f4750d28b34e02a605a66e716d0064c58d75c4be3731c63522
- 5,000 × 92 = 460,000 > 327,680, in any row order.
- Today's 200 features are at most 200 × 492 = 98,400 bytes: at most 2 batches.

Part B (conditional on OPEN-2): kernel/tests/session_end_event.rs, E2 and E3 only.
- B1. A helper fixture_with_features(name, features) beside fixture(). fixture() and every other test are unchanged.
- B2. E2 uses 5,000 features, counts its batches, and asserts batches > MAX_QUEUED_BATCHES before its terminal expect.
- B3. E3 uses 20,000 features, enough for at least MAX_QUEUED_BATCHES + 2 batches (20,000 × 92 = 1,840,000 > 1,376,256, the first three targets).
  - The producer is blocked on its third send, which is not its last, until E3's first next_into. That call comes after E3's touch and cancel.
  - After that send, every path to produce's Ok return passes a cancel check:
    - the loop top: engine/src/stream.rs:1881-1885 @ 3d740f7b sha256:eed6261ee63fb0cbcda145191a96fd719919af768c20140b1ec9f7501c525439
    - the row: engine/src/stream.rs:1971-1985 @ 3d740f7b sha256:599893251b3798e7e52067262871ede3eda128101b851ec5ade67b26a514ac8e
    - flush: engine/src/stream.rs:2522-2527 @ 3d740f7b sha256:abb22a55352e91839b2a1bfc943b81e66d4ef077316e6a147b89dcf60e41fb51
  - So the terminal is Cancelled, and the post-check, which runs after the touch, still records the change.
  - E3 cannot count its delivered batches usefully. A fixture too small to hold its batches ends with source_changed, or with no terminal at all. Either fails E3's existing assertions by name.

Portability (state/directives/PORTABILITY-2026-09-30.md):
- R1: the argument rests on std's bounded channel and is platform-independent.
- R2 to R4: no OS-dependent feature and no cfg.
- R5: no level is claimed.
- R6: nothing is ignored on any platform.

## §3. Fixtures

- Part A: fixture_with_features("terminal-carries-code", 5_000): avg_vertices 12, NativeUnique, the rest default.
- Part B: E2 at 5,000 and E3 at 20,000, with session_end_event's own spec (avg_vertices 10, hole_every 0).
- All are seeded and generated per run under target/fixtures. They are not the 5 GB fixture and not wire fixtures.

## §4. Tests and mutations

Each mutation is applied, the named test is run alone, its failure is recorded by name with the commit id, and the mutation is reverted. A verify-mutation run is never called a mutation's observation (round 25, item 2 (c)).
- M-0, the existing mutation, re-observed. At kernel/src/lib.rs:684 @ 3d740f7b sha256:2da3ec86e18496746925ea1883cad0571bce32bdaad5868cebe17846c108ebd3, replace skp::terminal_detail_of(&e) with e.to_string(). The end-to-end test fails at its prefix assertion.
- M-1, for A4. 5_000 → 200 at the test's call. It fails at the batch-count assertion, deterministically: at most 2 batches (§2).
- M-2, an observation, not a test of record. Move touch_modification_time(&path) after the drain loop. It fails at the terminal expect, with the message at the CI log's line 1270.
- M-B2, for B2. E2's 5_000 → 300. It fails at E2's batch-count assertion: 300 × 312 = 93,600 bytes, so at most 2 batches.
- M-B3, for B3. Move E3's cancel.cancel() after its drain loop. It fails at E3's assertion that cancellation keeps its own terminal, because the terminal is engine.source_changed.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: `cargo test -p spatial-kernel --test typed_terminal_codes`, 20 runs: 20 of 20 pass.
- P-2: M-0, M-1 and M-2 each fail as §4 states, in each run.
- P-3 (Part B): `--test session_end_event`, 20 runs: 20 of 20 pass. M-B2 and M-B3 fail as §4 states.

Declared unchanged:
- every product line: no diff under engine/, protocol/, frontends/ or kernel/src;
- fixture()'s output for its other callers, in both files;
- every other test, E1, E4 and E4's sleep included;
- touch_modification_time;
- the prefix and prose assertions;
- no new pub item, constant, dependency, cfg or ignore.

Invalidators:
- With 5,000 or 20,000 features, the batch-count assertion fails, or E3 ends with source_changed. §2's arithmetic is then wrong: stop, and record a class-1 amendment.

Falsification:
- Any run with batches > MAX_QUEUED_BATCHES and a clean end, or a missing terminal, falsifies §2's ordering argument.

## §6. Instruments

All assertions are structural: the batch count, the terminal's code, and the event's reason. No figure is measured or printed.

## §7. Declared values and ceilings

- Part A: at most 80 changed lines, all in kernel/tests/typed_terminal_codes.rs.
- Part B: at most 70 changed lines, all in kernel/tests/session_end_event.rs.
- Counted by §21c's rule (insertions plus deletions): git diff --numstat B H -- kernel/tests/typed_terminal_codes.rs kernel/tests/session_end_event.rs, with B = git merge-base origin/main H named in the PR body.
- Non-generated files: at most 4. They are this form, PLAN.yaml, typed_terminal_codes.rs, and session_end_event.rs under Part B.
- Feature counts 5,000 and 20,000: literals at their sites, each bounding a minimum batch count by §2's arithmetic. No new constant.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes.
2. Any edit:
   - under protocol/;
   - to a wire fixture, Cargo.lock or package-lock.json;
   - to any file in the lines cut's §7 list (engine/GEOMETRY-LINES-PREREGISTRATION.md:500-509 @ 3d740f7b sha256:e7c5be62ee1a54823663d98157159e2d998e503ea91df592dfba0d5e935aa116), kernel/README.md included (OPEN-1).
   On such a need, stop, and the human is told.
3. A diff outside §7's files and the generated set.
4. A sleep, a timeout used to synchronise, or a timing assertion in a changed test.
5. A path:line cite in a code comment into engine/src or kernel/src. Those files are the lines cut's, so name the symbol instead.
6. The batch-count assertion placed after the terminal expect.
7. fixture()'s output changed for any other caller; any other test changed.
8. A claim that the flake is "fixed" beyond §1, or that CI's cause was observed.
9. Part B code before OPEN-2 is settled.
10. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- Architect and reviewer (§21a; §25(e)). Verdicts follow AUTONOMY.md §22 as the product-first direction's section 2 replaced it (state/directives/2026-10-05-product-first-direction.md:15 @ 3d740f7b sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751): block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- Architect: §2's ordering argument against the cited sites; §8 item by item; §1.
- Reviewer:
  - the full diff;
  - M-0, M-1, M-2, M-B2 and M-B3, each observed by name with the commit id;
  - P-1 and P-3.
- Suites:
  - `cargo test -p spatial-kernel --test typed_terminal_codes`, and `--test session_end_event` under Part B;
  - the workspace, by CI;
  - node --test scripts suite; verify-plan; verify-cites; verify-quotes; verify-test-claims.
- Heavy runs follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 3d740f7b sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1).
- Operator: none.

## §10. Amendments

(opens empty)
