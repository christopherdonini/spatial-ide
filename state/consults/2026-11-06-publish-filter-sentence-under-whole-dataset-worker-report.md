*Custodian's filing note (2026-11-06): the worker's stop report for `publish-filter-sentence-under-whole-dataset` (U12, slot 2; the five-line form `governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md`), its branch local at 1af71af05b52a8c74e3d2f544a5a7362fb8fd461, three commits, not pushed. The run 2026-11-05T23:45:45.692Z to 2026-11-06T01:01:03.102Z by its transcript (claude-sonnet-5-5; unique calls Bash 98, Read 20, Monitor 1, Edit 40, Write 3 and the hand-back, 163, equal to the notification's). Extracted by script from the hand-back message in that transcript (9438 bytes, sha256 e7fb624b072768f2acf47ce4b4bcbba6942618afe5b7e1bd7d3e33b792f95d55); two author names written as git records them are replaced here, the one at 48329927 as "the human's account" and the one at 066a3cd7 and 088c5a69 (twice) as "an earlier author name"; nothing else is changed. It stopped under its brief's step 7 rule: the e2e's dev server cannot bind port 5180, which Windows reserves (the excluded range 5120 to 5219); no port was changed and nothing worked around. A report, not Authority.*

---

Stopped: publish-filter-sentence-under-whole-dataset, step 7 stop rule: the e2e cannot bind its dev-server port. `npx tauri dev --config e2e/out/tauri.e2e.conf.json`, run once as a probe inside a shared hold, printed "Error: listen EACCES: permission denied ::1:5180", then "Error The "beforeDevCommand" terminated with a non-zero status code." `netsh int ipv4 show excludedportrange protocol=tcp` lists 5120 to 5219. I changed no port and worked around nothing. Steps 8 (push, CI) and 9 (checks) were NOT done; the branch is local only.

**Start state.** Checkout C:/dev/wt/pfs (branch cut/publish-filter-sentence-under-whole-dataset), HEAD 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1, porcelain empty, .cargo/config.toml sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, form sha256 73138cc1…5a3b. Target D:/wt-targets/pfs.

**Whose words (`git log -L`, step 1).**
- KNOWN-LIMITATIONS item 8 line 105 (the body I rewrote): 48329927 (the human's account, Co-Authored-By Claude Sonnet 5.5, 2026-10-10), cites reworded in 31856d87.
- Item 8's "*Corrected 2026-10-10…*" line: 14f5e989, byte for byte from the human's ruling of 2026-10-10, item 3. These are the human's typed words. I did not touch them.
- G8 row: 13df4cb5 (Claude Sonnet 5.5 co-author), first written in 066a3cd7 (an earlier author name, 2026-08-16).
- FILTERED' coverage row: 066a3cd7 only.
- e2e/README.md passage: 088c5a69, an earlier author name.
- Spans I replaced, all for the human's approval at the click (OPEN-2): item 8 line 105; G8's two cells; the FILTERED' coverage row's "Covers" clause; the README passage.
- Whether to quote the placeholder in item 8 is the human's call. I paraphrased it with "[P6 placeholder]" and did not quote it.

**Step 2, the failing test on the unfixed code** (pfs-t2-unfixed.txt):
`test publish::tests::the_whole_dataset_scope_carries_no_filter_scope_sentence_with_or_without_a_filter ... FAILED`
`assertion `left == right` failed: under Whole dataset the sentence is not carried even with a filter active`
`  left: Some("this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter")`
`test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 70 filtered out`
`prepare` over the 20-row fixture admits a `ViewportBbox` scope, so the note-5 stop did not trigger (the current-view test passes).

**Commits** (each signed off; the `@` appears only in the first trailer line):
1. c0acf683d5e91033b35ffa965a35ca9217cd84aa `feat(shell): publish-filter-sentence-under-whole-dataset, the code and its first test`
2. ec847095ccbebcfc7ebdec78b23a572e00b219de `test(shell): publish-filter-sentence-under-whole-dataset, the other tests and FILTERED'`
3. 1af71af05b52a8c74e3d2f544a5a7362fb8fd461 `docs(shell): publish-filter-sentence-under-whole-dataset, the sentences and the recorded mutations`

**The code at head.**
- Rust condition: `Self::ViewportBbox { .. } if filter_active => Some(FILTER_SCOPE_SENTENCE.to_string()),` followed by `_ => None,`. It sits in a private `fn filter_scope_sentence(&self, filter_active: bool) -> Option<String>` beside `row_scope_sentence`. `prepare_with_query` now takes `filter_scope: Option<String>`, and its two direct test callers pass `None`.
- Panel condition: `{filterActive && scope === "current" && <p className="publish-filter-scope-sentence">{FILTER_SCOPE_SENTENCE}</p>}`.
- Both prefixed copies, checked by script (pfs-bytes.mjs): each starts with `[P6 placeholder] ` and the remainder equals the base's string byte for byte. Joined text: `[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter`.
- No new `pub` item, dependency or exported type; the `PublishPromptData` fields, `binding_publish_prepare` and the approval path are unchanged.

**Commit 3 sentences.** Each is true of the code above. Full text is in the diff of 1af71af0.
- publish.rs: the `FILTER_SCOPE_SENTENCE` doc (placeholder, prefix, shown only under `filter_scope_sentence`'s condition); the `filter_scope` field doc (sentence only for a filter active plus `ViewportBbox`, else `None`; the filter is in no published row under either scope); the new method's doc.
- types.ts: the `filter_scope` field doc and the constant's doc.
- e2e/publish.mjs: the FILTERED' header says `filter_scope` is `null` and that this suite never prepares the current-view case.
- e2e/README.md: the same, in the FILTERED' passage.
- MANUAL-WALKTHROUGH.md: G8 (Current view shows the marked sentence in the panel and the dialog; Whole dataset shows neither, and Row scope reads the whole file); the coverage row (null under whole-file, current-view case not prepared by the suite).
- KNOWN-LIMITATIONS item 8: body rewritten; the human's "Corrected 2026-10-10" line left untouched; "Revised 2026-11-06 (PLAN node publish-filter-sentence-under-whole-dataset)" note added to the source comment, date from `date -u +%F`. The existing pins at 8e093734 and b391e436 are kept and named as authoritative as history.

**M-1 to M-4**, each applied alone on ec847095, its named test run, reverted. Source sha256 after each revert equals commit 2's: publish.rs 56be0544e148f2353316469112c702d2bf99fc100534a0c2c66f3e3de462b6ba, PublishPanel.tsx aec01e38a0d86eb2676b595242a8adfccbbf25aea44bad9681be29b6decc6fac. All four failed as predicted, each recorded in a `RECORDED MUTATION:` line.
- M-1 (`_ if filter_active`), test `the_whole_dataset_scope_carries_no_filter_scope_sentence_with_or_without_a_filter` (pfs-m1.txt):
  `assertion `left == right` failed: under Whole dataset the sentence is not carried even with a filter active`
  `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 71 filtered out`
- M-2 (`Self::WholeFile if filter_active`), test `the_current_view_scope_carries_the_filter_scope_sentence_only_with_a_filter_active` (pfs-m2.txt):
  `assertion `left == right` failed: under Current view an active filter carries the sentence`
  `  left: None`
  `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 71 filtered out`
- M-3 (panel condition `filterActive &&` alone), test "Whole dataset with a filter on shows no filter sentence (U12)" (pfs-m3.txt):
  `AssertionError: expected '<div class="publish-controls"><p clas…' not to contain 'publish-filter-scope-sentence'` at PublishPanel.test.ts:435
  `Tests  1 failed | 44 skipped (45)`
- M-4 (panel condition `scope === "current" &&` alone), test "Current view shows the filter sentence with a filter on and not with it off" (pfs-m4.txt):
  `AssertionError: expected '<div class="publish-controls"><p clas…' not to contain 'publish-filter-scope-sentence'` at PublishPanel.test.ts:444, the filter-off case
  `Tests  1 failed | 44 skipped (45)`

**Other test results.**
- cargo `filter_scope` tests (pfs-t-fixed.txt): `test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 70 filtered out`.
- `npx vitest run src/publish` at head: `Test Files  4 passed (4)`, `Tests  80 passed (80)`. The pin test is unchanged and passes.
- `rustfmt --check --edition 2021 src/publish.rs`: rc=0.
- Not run: the full `cargo test`, `npm run verify`, `cargo fmt --all -- --check`, and the `verify-*` scripts.

**The e2e** (stdout, stderr and app.log under the scratchpad, files `pfs-e2e-*`):
- Attempt 1: the suite's own 900 000 ms deadline passed while the cold `cargo build -p spatial-kernel --example verify-bundle` ran. Stderr: "publish: SPATIAL_E2E_DEADLINE_MS (default 900000) exceeded -- presumed hung, failing loudly". It never reached the app.
- Attempt 2: "attachOrLaunch: http://127.0.0.1:9223/json/version never came up within 300000ms". app.log was 0 bytes.
- The probe above found the cause: port 5180. FILTERED' has never run, so its new assertion is unobserved end to end.

**Size.** `git diff --numstat 2c72923e…..HEAD` over the eight Scope files: 129 insertions and 71 deletions, 200 lines against the declared 150. Reported, not trimmed. The bulk is the helper-based rewrite of the Rust test (84/39 in publish.rs). Under the form's note 1 an overrun is class 6, with the `Scope` line not edited.

**Disclosures.**
- The form's setup does not mention that the shell crate's build needs renderer/bundle-viewer built first (`viewer-asset-hashes.json`, as CI does). The first `cargo test` failed on that. I ran `npm ci --offline` and `npm run build` in renderer/bundle-viewer, which used the npm cache and no network, and `npm run build` in frontends/shell. All outputs are gitignored, and porcelain is clean.
- The first cargo build was still running when I started the second; I did not kill it and it failed on its own.
- No file outside the eight Scope files changed, and nothing under protocol/, kernel/, engine/ or renderer/.

**Hold lines** (my project only): MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF, each followed by MACHINE_RELEASED project=SpatialIDE. Hold what-texts were "pfs: …" for the cold test, the two-test run, M-1, M-2, two e2e runs and the tauri probe. No exit code 96 to 99 occurred.

**Exact state.** HEAD 1af71af05b52a8c74e3d2f544a5a7362fb8fd461, `git status --porcelain` empty, branch not pushed, no CI run exists for it. No background shell or process of mine is running; the waiting loops all finished. Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
