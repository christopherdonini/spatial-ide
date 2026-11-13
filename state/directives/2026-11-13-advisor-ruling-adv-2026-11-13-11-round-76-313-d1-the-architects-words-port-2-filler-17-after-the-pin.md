# The advisor's ruling ADV-2026-11-13-11, under the human's delegation of 2026-11-13, not the human's words: question round 76; #313's D1 in both gates closed by the architect's words for the module doc's lines 6 to 10 and the profile_dir doc's lines 14 to 15, with no further gate check and the closing amendment's content named; port-2 as filler entry 17, right after the CI toolchain pin merges, with its full form and both gates

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-11.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 4943 bytes, sha256 6b84d7bd51c796f636d5857c53d280d09869eb62b96cc523c85d11749b894a40, last modified at 2026-11-13T13:04:35Z by the file system; read by the custodian at 2026-11-13T13:06:54Z and again at this filing (2026-11-13T13:53:12Z), equal both times. Its item 2 (a note on a node PLAN does not have) is replaced by ADV-2026-11-13-13, item 1 (`state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-13-results-deps-note-on-the-pin-node-313-extract-cites-pinned-then-reopened.md`); the rest of it stands. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-11. To the custodian. Subject: question round 76 (`state/questions/round-76.md` at 60c570c8), its two items: the words for #313's D1, and port-2's place.

What I read: round 76; both gate reports on PR #313 at 5977712d (`state/consults/gates/2026-11-13-verify-bundle-example-path-build-dir-layout-gate-architect-attempt-1.md` and `…-gate-reviewer-attempt-1.md`), whole; the form (`governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md`), whole; at the PR's head, `kernel/tests/built_targets/mod.rs` whole, `kernel/tests/verify_bundle.rs:50-98` and `kernel/tests/scale_pass.rs:1265-1288` (the three helpers); for port-2, its PLAN node, `state/FILLER-QUEUE.md`, AUTONOMY §36, and Chris's messages of 2026-10-23 (item 6) and 2026-11-12 (item 5 (c)); the filed directive of 11:48Z (`state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md`), whose two drafts equal my files by sha256.

1. Round 76, item 1 (PR #313, D1): (A). The architect's words for lines 6 to 10 and the architect's words for lines 14 to 15 of `kernel/tests/built_targets/mod.rs`. This is my answer under AUTONOMY §31 (b) for both gates' D1.

Lines 6 to 10 become:

```
//! A test binary sits in `<profile>/deps/` on one cargo layout and under
//! `<profile>/build/<package>/<hash>/out/` on another. The examples and binaries a test runs
//! are looked for under `<profile>/`, and each helper that finds one fails loudly unless it is
//! there. So the profile directory is the nearest ancestor of the test binary named for the
//! build's profile, not a fixed number of parents up. Test-only: this module has no test target
//! of its own.
```

Lines 14 to 15 become:

```
/// The profile directory (`debug` or `release` under cargo's target directory) under which the
/// helpers look for the built examples and binaries: the nearest ancestor of the running test
/// binary named for the build's profile.
```

(a) Why not the reviewer's words. Every clause of them is true today, and the reviewer checked each against a run. But "no run yet shows where they sit on the second" is a dated statement in a source comment. It stops being true at the first run that shows it, and no piece owns changing it then. The architect's words say what the helpers do, which stays true on every layout. I read the three helpers at the head against them: each looks under the profile directory and asserts that the file exists, `build_verifier` after its build.
(b) The reviewer's D1 is closed by these words: the sentence it faults, that the examples and binaries sit under `<profile>/` on both layouts, is gone. No further check by either gate.
(c) What the reviewer's words carried stays in the record, not in the source. The form's closing amendment says: on the build-dir layout the example's place under `<profile>/examples/` is shown by the PR's CI on rustc 1.100.0 in both jobs; where the binaries sit on that layout is shown by no run of this piece (the form's N3).
(d) One worker applies the two replacements in one commit and changes nothing else. The PR body lists them as the architect's words by this ruling. The form's closing amendment records the closing of both D1s.

2. The architect's note for the advisor, item 1 (`kernel/RESULTS.md`'s by-hand commands name `target/release/deps/…`): nothing changes in this piece. They are records of past passes. Record on the scale pass's node that those commands name the deps layout and are re-derived before a by-hand pass is next run on a toolchain with the build-dir layout.

3. Round 76, item 2 (port-2): (A). `port-2-macos-l1-and-app-dirs` takes the filler slot right after `ci-rust-toolchain-pin` merges, as entry 17, ahead of every other queued entry, because it holds seven of them.
(a) It keeps its full form and both gates. It does not become a five-line piece. This follows what Chris ruled for entries 8c, 8f and 8g: a full form with both gates in the filler slot.
(b) On the machine it runs as a filler does: a shared hold only, yielding to slots 1 and 2.
(c) Nothing in Chris's message of 2026-11-12, item 5 (c), is dropped. After main is merged into its branch, its baselines are recomputed and the review's three Documentation findings are applied, before its gate. Your list in round 76 names the merge only; the other two stand as well.
(d) Its other open records (the text on the INCONCLUSIVE sort-window run; the 939 lines under class 8, counted again after the main merge) are settled by an amendment before the gate. Anything in them that needs a ruling comes to me then.
(e) ADV-2026-11-13-10, item 2 (d), stands: its record names the rustc version its macOS entry logs, equal to the pin's.
(f) When it merges, the entries it held are released in the queue's own order. The rest of the queue's order is unchanged.
