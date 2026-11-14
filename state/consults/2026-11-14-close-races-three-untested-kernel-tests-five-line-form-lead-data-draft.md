*Custodian's filing note (2026-11-14): lead-data's read-only five-line form draft for `close-races-three-untested-kernel-tests`, the filler queue's entry 14, read at main 9a77c0a9, from its hand-back (22451 bytes, sha256 9fd1d07390e5cebfa32672141f04b330302073788d41d069befafb2803284b5c), below the rule. Each `sha256:<H>` pin that follows a cite is filled by script with the sha256 of the cited whole lines, each with its LF, at 9a77c0a9c639de34b910d41c7db02f4dec7a016d (56 pins; 4 of them bare line numbers, each bound to the nearest earlier path:line cite in the same paragraph, as the quote checker binds them); the one left is the draft's own sentence about them; nothing else is changed. Its brief by file (7056 bytes, sha256 9a4ad06bb7af191483c8957e8ddf4e137afbaef0b0358a8000a4b351e8360bec), carrying the reuse index's two misses byte for byte; the run 2026-11-14T15:53:33Z to 2026-11-14T16:02:38Z by its transcript, 46 calls (Read 23, Grep 20, Glob 2, SubagentHandback 1), no write, no errored call, model claude-opus-5-5. Its OPEN items are not red lines. A draft and not Authority; the form it became is `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md`.*

---

Draft: close-races-three-untested-kernel-tests five-line form, lead-data, at 9a77c0a9

Report path: state/consults/2026-11-14-close-races-three-untested-kernel-tests-five-line-form-lead-data-draft.md. I have no shell, so I give no sha256 for this report. The custodian computes it at filing. Blocking questions: none. Each OPEN item below is not a red line and takes my recommendation under the ruling held to 2026-11-16.

Wording convention: every cite is `path:line @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:<H>`, and the custodian fills each `<H>` by script. The only quoted text is code text copied byte for byte, and each such quote is marked. Every other sentence is my own wording.

Form path, from the forms index (governance/README.md:23 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978): `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md`.

```
Authority: PLAN node `close-races-three-untested-kernel-tests` (governance/PLAN.yaml:7076-7092 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:f3647c5cfeef4b6c6c8903efa2071f76a0f3ab5b465e681c4d9eab1026f41b51), filler queue entry 14, graded S3 (state/FILLER-QUEUE.md:37 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:182a7fbdb49928522bac7d6abc990abe8e88387b57d3c4f777606e474434ea60), placed by the human as one kernel test node for the three untested places named by #308's gates (state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:41 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:e3124cc1d109839f5d21f9938a6dd7bad491b2c3d54a775c23b7385ca6014f08), started by the advisor's ruling ADV-2026-11-14-17, item 13 (state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-17-318-words-item-43-three-sentences-item-63-withdrawn-adr-036-amendment-2-clause-checked-at-c3-entry-14-starts.md:87-89 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:7e2b2d8599250b1757bba287452c3792e5171eed2002f95601b2103a1662e655), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84); the findings are the architect's Check 5 and C1 (state/consults/gates/2026-11-12-adr-035-close-races-note-gate-architect.md:99-103 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:bf835bc58ed3a4a50da834069449284ce22b0e5784cf616a227ac15ce0a56c44; :9-18 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:c0203f5de6d86736d2ab8218f448784c8bfc3624c7f141c6de4fca9afbeb29c9) and the reviewer's confirmations (state/consults/gates/2026-11-12-adr-035-close-races-note-gate-reviewer.md:16 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:09fdc910da6311ea920524add00e562f5f02769acd953c871262b34d4b8f675f; :100 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:e6c1e86a32131d2ad67681ab54cac8ae9d727746d22d154c149a3dbb9570f277; :103 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:f371a1512369de4109a4b61f7988d9029d24ef6ffb96d893bfdc407d95b6cbb3); the statements tested are ADR-035's Note 2026-11-11, items 1 and 2 (docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:164-165 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:3222bc1d26618a2d715be1a6dbf69d8982d4eab9b492a275d3b79d667a5c3618); the method is close-races' §4 (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:203-211 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:ccee757771b947b49f2797af255c074604e5884b9f845c729e630c4bc3f6b260); reuse index: two misses, no prior art recorded for "kernel test close race cancel failed attribution" or for "ended then closed race dataset session test" (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form's brief).
Scope: 2 files: kernel/src/skp.rs, inside `mod ticket_drop_under_lock_regression` only (kernel/src/skp.rs:3454-3455 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:ac5b774e4bfb494889b81d195d6c445a863c232fcb37e859a3b5bee5a48afbbd), three new tests placed after T2 and before R2; kernel/README.md (owner's index: this form added to the preregistration list, and the Last-verified bullet, OPEN-3); declared line budget 150 by §21c's counting rule (governance/AUTONOMY.md:357 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec), about 125 estimated (N4); this form is exempt; no product line of kernel/src changes, no new `pub` item, no new helper outside the test module, no tracked fixture, and nothing under protocol/, engine/, docs/ or KNOWN-LIMITATIONS.md.
Change: the kernel crate's lib tests gain exactly three in-crate tests, U1 to U3. Each drives one of the three places on the test's own thread by step order, with no sleep, spawned thread or timeout. No product behaviour changes, and `cargo test --workspace -- --list` gains exactly these three names.
Tests+mutation: U1, new: kernel/src/skp.rs::ticket_drop_under_lock_regression::a_ticket_minted_after_the_close_is_cancelled_by_its_failed_attribution (open; close completes; a ticket minted for the closed name through the real `StreamRegistry::mint`, standing in for the mint step's last line, kernel/src/skp.rs:1508 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:0619574b66328ac78897c3363548af1eac2bcc395328fe8d5beee5bd7ae61420; then `viewport_query_attribute`; asserts code `skp.unknown_dataset` and the ticket `CancelledBeforeRedeem` through `assert_cancelled_before_redeem`); M1: delete the attribute step's cancel, kernel/src/skp.rs:1526 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:f3d25531df2e1a96d364e6bf01d5dba5bace62866ea7ca955900dc0dcc6c92f6; predicted: U1 FAILS at the cancelled-state assertion (the ticket stays `Pending`), and U2 fails at its own cancelled-state assertion (a recorded extra). U2, new: kernel/src/skp.rs::ticket_drop_under_lock_regression::an_observed_change_between_mint_and_attribution_refuses_with_the_arms_own_detail (open; resolve and mint through the in-crate steps; `invalidator.end_generation(name, SessionEndReason::ObservedChange)`, asserted to return 0 because the ticket is not yet attributed; then attribute; asserts code `engine.source_changed`, `fields.detail` equal to the arm's `ObservedChange` literal (kernel/src/skp.rs:1539 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:e5930e3f461a3902e3c65e8134cbfc61ae8ab4e054a92d7d4d316a34280a517c; OPEN-2), and the ticket `CancelledBeforeRedeem`); M2: the arm's `ObservedChange` branch given the `CoverageLost` branch's body (kernel/src/skp.rs:1537-1547 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:9ede125aa17bb633433b370cc0eb391cb4dbeab495685fee9f994818ee4e429d); predicted: U2 FAILS at its code assertion, left `engine.source_coverage_lost`, and T2 passes. U3, new: kernel/src/skp.rs::ticket_drop_under_lock_regression::an_ended_then_closed_query_checking_after_the_close_refuses_as_unknown_dataset (open; `invalidator.end_generation(name, ObservedChange)`; precondition `live_generation` is `Err(NotLive::Ended(ObservedChange))`; `viewport_query_resolve` succeeds; close completes; the resolved query continues through `viewport_query_mint` and `viewport_query_attribute`; asserts code `skp.unknown_dataset`, an empty ticket map, one event from the end and none after it); M3: delete `forget_dataset`'s `st.invalidated.remove(dataset)` (kernel/src/skp.rs:830 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:e6e6e8506d13ec517ad487c21c8ac26f3a81fa4f657bcf080b4b0a011e4a7324); predicted: U3 FAILS at its code assertion, left `engine.source_changed`; kernel/tests/session_generation.rs::forget_dataset_removes_the_generation_the_invalidation_and_every_attribution also fails if run (a recorded extra). No existing test is changed. All three pass at the base by design, so no test-first failure is predicted. Each mutation is observed by applying it, running the module's tests, recording the failure by name with the commit in a `REGISTERED MUTATION:` doc line, and reverting. A `verify-mutation` run is never called an observation.
Out-of-scope: ADR: none (ADR-035's Note 2026-11-11 items 1 and 2 are checked by the tests, never edited; no status line, no amendment); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP or data-plane message, field, code or literal changes; nothing under protocol/); guarantee: none touched (no product line changes, so no stated guarantee, ADR-018 cancellation behaviour, refusal code, refusal order or ceiling changes; the piece adds tests for three behaviours the code and the note already state, and no existing test's assertion changes; N5); §25 (e) is set aside for a filler by §36 in any case; no new string a user sees, no new dependency, no new exposure surface.
```

*The notes, OPEN items and unsettled points below are mine, as lead-data.*

## Notes

**N1. The three places at 9a77c0a9, checked against the gate reports**
- **(1) The cancel at a failed attribution. The custodian's reading holds at 9a77c0a9, and I add a second path.**
  - The close cancels every ticket minted before its step 2 (kernel/src/skp.rs:1621-1623 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:f2bbc24ca6ee10a69c82b80ef717c57657ec84e503a8d7972b3131faea2b4ceb). CR3's cancelled-state assertion (kernel/src/skp.rs:4740-4753 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:bb91b44c489510c3481676cd2292a014700fd01879b920fb16b0240fe3b196b8) is therefore met before the attribute step runs.
  - So :1526 is the only cancel of a ticket minted after step 2 whose attribution then fails (kernel/src/skp.rs:1522-1526 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:7530bd777e480e18de7f7e2fc8c8c09b4510a9ab2eb81eb3b5f8517ff2473178; `attribute_ticket`, kernel/src/skp.rs:622-635 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:ef508659d750f4c953741cfdd6a01d2564ee00ac1d31f4d91ecf669b6f1aef87).
  - Second path: :1526 is also the only cancel when a generation ends between the mint and the attribution. `invalidate` reports only tickets that are already attributed (kernel/src/skp.rs:795-800 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:29d48ed9c323496fe35a3f2325061eadee42138181cb4d00a3f5f91fabe82e6e), and `end_generation` cancels only those (kernel/src/skp.rs:920-924 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:a2728a9f0154c4e429be6d2d68f3ac5440650857b53b2dbb836e39038b2fcc49).
  - T2 (kernel/src/skp.rs:4760-4812 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:0f4b4195debbd7ddab91b53d438de156f10eefa832cc7483429fc4e1e5962cf6) drives that second path but asserts no ticket state. U1 covers the close path, and U2 covers the end path.
- **(2) The end's-reason branch. Part of the custodian's reading is out of date at 9a77c0a9.**
  - The gates read at 7693001e and found direct calls only in CR1 and CR3.
  - Since then the braces piece added T2 (its form's Tests+mutation line, governance/forms/kernel/PRE-ADMISSION-CHANGE-DETAIL-BRACES-PREREGISTRATION.md:9 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:3b561ee61f5d26437d7fe11f5e9d6d0958bfb48ebfc4c127e047ee8866cca888). T2 drives the `CoverageLost` branch and asserts both its code and its detail.
  - At 9a77c0a9 `viewport_query_attribute(` has four test callers: :4674, :4737, :4797 and the product call :1415.
  - What is still untested is the `ObservedChange` branch (kernel/src/skp.rs:1538-1541 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:f6171b3729fe7b9db83ab010c7808672b1c8c688336f3f18f117d84ffe58c8a3). U2 covers it.
- **(3) The ended-then-closed race. The custodian's reading holds.**
  - The close's step 3 removes the end's mark (kernel/src/skp.rs:827-837 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:27947a50e3dfb78975b6e7ae714d3668e2fa7fa26ca1ffc128bff3ba7fbaa049; the call is kernel/src/skp.rs:1633 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:a9920f17a434f08b13b22f3cd7ccd4a568b01884b9621b7ad12f24c0410ea3bf).
  - A query that resolved before step 4 (kernel/src/skp.rs:1432-1435 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:fb03fc52c3219de0e4b3b461db9cfa05f66e7decef519974cfd1ec4bba8b0630) and runs its live check afterwards gets `NotOpen` (kernel/src/skp.rs:602-615 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:c54160e7526a6e5ab4015de4fb56f4d8c4e07438529b3edb1a2657048c1aa0c0). That is refused as `skp.unknown_dataset` (kernel/src/skp.rs:1666-1673 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:b4085468553ff1111a5cd926f47947bd20f0e6de241f9dfacf5cf2c9ba16d106).
  - This is what Note item 1's last sentence says (ADR-035 :164 above).
  - The only test of it is at the registry level (kernel/tests/session_generation.rs:196 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:1c87853304b3da574c9c670fc92c9b6ea56ad0cafa926ba8f30eaca3f89d9fe6).
  - U3 drives it at the host level.

**N2. How each test drives its path, and why no product change is needed**
- **Placement.** All three tests are in-crate, in `mod ticket_drop_under_lock_regression`, the close-races precedent (§4 (iv) above). That module can call `viewport_query_resolve`, `viewport_query_mint` and `viewport_query_attribute` and read `host.invalidator` and `host.tickets`, all of which are private, as CR1, CR3 and T2 already do.
- **Existing helpers they reuse:**
  - `fixture` (kernel/src/skp.rs:3468-3470 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:b7eda202b73ceb6b8ede095c4257aceb630dd440d8e96ee0f61110dcb1265d10);
  - `open_through`, `unrestricted_query` and `close` (kernel/src/skp.rs:4466-4500 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:63bc71d9f4e3c3f045bbb1ddc0adef1444c275c7aa26a96c9ecc3f6421b87483);
  - `RunOnDrop(None)` as an empty `BatchSource`, and `NoopCancel` (kernel/src/skp.rs:4436-4464 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:66373d2d288bea9001a1acdbb6657177aae9ba46a91eddb9eae5b3761a41cf7f);
  - `assert_cancelled_before_redeem` (kernel/src/skp.rs:4887-4902 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:a1c9d7eff1ec7c57cb4480a934d5efe69b9b54fc6f9853684294794b4d34befe). Its failure message mentions the redeem step. U1 and U2 accept that wording to stay within the line budget.
  - `no_watch_arm` and `discard_session_end_events` (kernel/src/skp.rs:2393-2395 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:7e597390c9b9f0e356d73e18abecfada395944b569f862adc127465a3f5e87e3; kernel/src/skp.rs:2437-2439 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:2e3cf2c59c8cf810b380eff906fdf0573908fec782751f6ad39878380dd8a388).
- **U1's stand-in mint.**
  - The mint step runs `require_live` first (kernel/src/skp.rs:1472 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:8a3283c12d21190899182ea9cb8d0a1318ef878ed1df250f3a6a72eb269eb7d5). After `begin_close`, that check refuses. So the mint step cannot mint after step 2 when it is called as a whole.
  - In the product, this path is a query that passes its live check before `begin_close` and reaches `tickets.mint` (:1508) after step 2.
  - U1 calls the real `StreamRegistry::mint` (kernel/src/skp.rs:234-241 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:f58a311697f0c9d6c12cee3dd0e469239d30cfa3235930ecdabeb6d6d694e130), the call that line makes, after the close has returned. As in CR2, it makes no claim that product code mints at that moment. The no-live arm of `attribute_ticket` refuses the ticket.
  - The drop-point variant (OPEN-1 (B)) would reach the closing arm instead.
- **No seam and no change in kernel/src/ product code** is needed for any of the three tests.

**N3. Gate and budget**
- **Gate.** §36's filler gates: the reviewer and the architect, both from dispatch. §36's text (governance/AUTONOMY.md:692 above) sets both for a filler. §21b's single reviewer is for a non-filler piece. This is my recommendation. The gate route is decided by the custodian and the gates, not by me.
- **Budget.** 60 minutes, the node's (governance/PLAN.yaml:7087 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:9269a017dd1abf63dbe1f02f7fdc96be80b9d19e3258dccef5a0189a31e4a514). This is the custodian's estimate at placement, not a measurement.
- **What the 60 minutes must cover:** writing three tests in one file, one base run, three mutation runs and one kernel-crate run.
- **Risk.** A cold build of the kernel crate, which compiles the bundled DuckDB, could use up most of the budget alone. I have no measured build time to cite.
- An overrun is recorded as an amendment and never edits the form's lines.

**N4. Size estimate against §21c** (governance/AUTONOMY.md:350-351 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333). Counted as insertions plus deletions, tests included:
- U1: about 35 lines.
- U2: about 41 lines.
- U3: about 45 lines.
- The recorded-mutation lines are included in each figure, and each test has its doc comment and the blank line that separates it.
- kernel/README.md: 4 lines (two changed lines).
- Total: about 125 lines over 2 files. The declared 150 leaves about 25 lines for rustfmt reflow.
- OPEN-4 (B) would take the total over 150.

**N5. The §21a reading, and how I read race tests**
- **How the tests run.** U1 to U3 are race tests in the close-races sense: each runs one interleaving, in step order, on the test's own thread. None of them uses a thread, a sleep, `recv_timeout` or a timing window. This is the discipline of close-races §4 and its block-on-sight item 1.
- **Guarantee.** I read them as touching no guarantee:
  - they change no product line;
  - every property they assert is already stated, in ADR-035's Note 2026-11-11 items 1 and 2 and in close-races §1 (ii);
  - they change no existing test.
- **Rule (e).** Rule (e) (governance/AUTONOMY.md:482 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669) therefore does not apply, and the five-line form stands. §36 also sets §25 (e) aside for a filler.
- **Stop condition.** The note's items are the human's wording, which is red-line text. If any of U1 to U3 fails at the base, the code does not do what the note says. That is a stop: the worker reports it, and the finding goes to the human with its code span. The test is not changed to match the code.
- **Worker stops** (my list for the gates):
  - any sleep, spawned thread or timeout in U1 to U3;
  - any changed line outside `mod ticket_drop_under_lock_regression` in kernel/src/skp.rs;
  - any existing assertion edited.

**N6. Heavy runs**
- Each run below happens inside a shared hold only, yielding to slots 1 and 2 under §36 and the advisor's item 13 (b). Each run's exit code is checked.
- Filter `M` means `skp::ticket_drop_under_lock_regression`.
1. Base, after adding the tests: `cargo test -p spatial-kernel --lib --locked skp::ticket_drop_under_lock_regression`. Expected: exit 0, with U1 to U3 passing.
2. M1 applied: the same command. Expected: exit 101, with exactly U1 and U2 failing at their cancelled-state assertions. Then revert.
3. M2 applied: the same command. Expected: exit 101, with exactly U2 failing at its code assertion and T2 passing. Then revert.
4. M3 applied: the same command. Expected: exit 101, with exactly U3 failing at its code assertion. Then revert. Optional: `cargo test -p spatial-kernel --locked --test session_generation`, expected exit 101 (the recorded extra).
5. After all reverts: `cargo test -p spatial-kernel --locked` (the whole kernel crate). Expected: exit 0. CI runs `cargo test --workspace --locked` (.github/workflows/product-ci-rust.yml:236 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a).
- Light runs, which need no hold:
  - `cargo fmt --all -- --check`, expected exit 0 (.github/workflows/rust-fmt.yml:77 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:76f8328e835322c4ed345550b392e7b3b8b764ced87ccaafa771de74a7318cfd);
  - `git diff -U0 origin/main...HEAD -- kernel/src/skp.rs`, where every hunk must start after the module's opening line;
  - `node scripts/plan/verify-test-claims.mjs`, `node scripts/plan/verify-cites.mjs` and `node scripts/plan/verify.mjs`, each expected to exit 0.

**N7. Rule (00) against the brief's lists**
- **kernel/src/skp.rs:** none of the listed pieces has it. #318 lists kernel/src/project/mod.rs, kernel/src/session_history.rs, three kernel/tests files and protocol/. Port-2 lists kernel/PERMISSION-BOUNDARY.md, kernel/src/permission/audit/log.rs and two kernel/tests files. PR B has no kernel/ path.
- **kernel/README.md:** none of the brief's lists names it. Whether #318 or port-2 edits the owner's index can only be settled by git at dispatch (OPEN-3).
- **protocol/:** this piece touches nothing under it.

**N8. Platform.** No OS-dependent feature is involved, so no Platform section is owed. U1 to U3 use no watcher, and they run on both CI entries, windows-latest and ubuntu-24.04.

## Impact read for engine/ and kernel/ (pointers)
- **Interfaces:** the SKP v0 host and the close-ordering row of the owner's index (kernel/README.md:363 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:369f2fc0592ae0eb8766411e4e6f358faf4dd118f0aa00bbf7aa5e2ad3ced443; :369 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:3e9bf4858b27fc7cfad0eccdc455b0617bc4e3e8f692d2cf9078b5715d5bfbe1). Both are read only.
- **ADRs:** ADR-035 (its Note 2026-11-11). It is not edited.
- **Preregistrations:** the GENERATION-CLOSE-RACES form (§4 method) and the ADR-035-CLOSE-RACES-NOTE form's rows 2.10 to 2.13 (governance/forms/root/ADR-035-CLOSE-RACES-NOTE-PREREGISTRATION.md:109-112 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:082cefa939878f875fc89f68bf43e20bf7a3478d23ca75cfd1027ae70609a044). These are the facts the tests close.
- **KNOWN-LIMITATIONS:** none. **engine/:** none.

## OPEN items (none is a red line)
- **OPEN-1. How U1 reaches a ticket minted after step 2.** Recommendation: (A).
  - (A) Mint through the real `StreamRegistry::mint` after the close returns, then attribute (N2). This is the smallest option, and it reaches the no-live arm.
  - (B) The same mint and attribution inside the close's drop point (`RunOnDrop`, as in CR2). This reaches the closing arm of `attribute_ticket` and costs about 15 more lines.
  - (C) Only the end path (U2's cancelled-state assertion), with no close case. This misses the interleaving the gates named.
  - (D) A test-only seam inside `viewport_query_mint` between `require_live` and `tickets.mint`. This changes kernel/src/ product code and is outside this node.
- **OPEN-2. U2's detail assertion.** Recommendation: (A).
  - (A) Exact equality with the arm's `ObservedChange` literal, braces included. The text, byte-copied from kernel/src/skp.rs:1539, is `{this dataset's session ended while this query was being prepared}`. Exact equality is what separates the arm's answer from `require_live`'s, whose `ObservedChange` detail is a different sentence (kernel/src/skp.rs:1677-1678 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:37fb86bd45b39cea14a4d24df7675f5cc67b65f6c7856a9c00b118597cece2d2). The two share a code, so the code alone cannot tell them apart. This also matches T2.
  - (B) A substring check on the words without the braces.
  - Note: the braces piece left this braced literal, which has no placeholder tag, out of scope (governance/forms/kernel/PRE-ADMISSION-CHANGE-DETAIL-BRACES-PREREGISTRATION.md:137 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:26f0a621a30e71be343b147ad460f5988e44395ab7c0e528c0bf88ca90d24bc3). A later rewording would change U2 in the same piece.
- **OPEN-3. kernel/README.md in Scope.** Recommendation: (A).
  - (A) Include it: this form in the preregistration list (kernel/README.md:390 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:9046048d8827d3e17a0fdb5c535fadeef3196776e754601d99f4355b732ae828) and the Last-verified bullet (kernel/README.md:361 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:e2508163bff4e7685376167756afa78ee1538f64f26977702d72280108963436). This holds if git at dispatch shows that no piece in flight or awaiting a click touches the file. Otherwise take (B).
  - (B) Omit it. The index line then follows when the conflicting piece has merged.
  - (C) Also pin U3 on the close-ordering row. This adds about 2 lines.
- **OPEN-4. The during-close half of Note item 1 at host level.** The half in question: the end's reason is returned when the check runs before `forget_dataset`. Recommendation: (A).
  - (A) Not in this piece. It is not one of the three places the gates named. R2 holds it at the registry level (kernel/src/skp.rs:4814-4851 @ 9a77c0a9c639de34b910d41c7db02f4dec7a016d sha256:1b00d4f5b1c78c8ff61714a0ed91164e999707afd8683c932934cdb8377b7396), and `require_live` is a function of `live_generation` alone.
  - (B) A fourth test: at the drop point, a whole `viewport_query` runs inside the close of an ended generation and answers `engine.source_changed` with `require_live`'s detail. This adds about 45 lines and takes the piece over §21c. Widening the placement is the human's call.

## What I could not settle
- That U1 to U3 compile and pass at the base. This rests on reading alone; the worker's base run settles it.
- Whether any other test in the module fails under M1, M2 or M3 besides those predicted. By reading, none does. The runs settle it.
- When T2 merged relative to 7693001e. I inferred its order from the architect's caller list at 7693001e and the commit T2's recorded mutation names (74fd4f1d). I did not run git.

## The packet's gaps
- The full path lists of #318 and port-2 beyond kernel/ and protocol/. The brief does not say whether either touches kernel/README.md.
- The current form of the shared-hold command for the heavy-runs paragraph. The brief says "shared hold" only.
- A measured build time for the kernel crate on this machine, to test the 60-minute budget against.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
