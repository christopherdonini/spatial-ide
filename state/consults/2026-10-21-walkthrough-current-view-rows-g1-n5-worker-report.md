*Custodian's filing note (2026-10-21): the worker's report for the docs lane's first piece, in C:/dev/wt/wcv: the commit b936965497436c210589de0226c105b3fce7a84c on `cut/walkthrough-current-view-rows-g1-n5` (parent B 978f3dde6fb38784027ec5f8d594bcd1d7092611), pushed. Checked by git: the branch ref, the parent, and the diff, 2 insertions and 2 deletions in `frontends/shell/MANUAL-WALKTHROUGH.md` alone. Its calls were matched to its transcript: the edit script, the commit, the push, the evidence script, and the scripts suites inside a shared hold (granted and released, rc 0). That hold call set two variables before the hold, outside the shape the machine paragraph gives; it is recorded, and nothing turns on it. The suites count 509 here against 527 on governance D's branch, whose 18 new tests are not on main. The run 2026-10-21T08:33:45Z to 08:40:27Z by its transcript (Read 1, Bash 12, Write 3); its one SubagentHandback call, at 08:40:26Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 4ac63897887aa2bc16cfb47ced05ad97763ba1dfd0514b10a10b33aa9c9a2d69.*

---

Rows G1 and N5 are rewritten, committed and pushed (push exit 0). Every §4 and E2 check passed.

**B and H.** B = 978f3dde6fb38784027ec5f8d594bcd1d7092611. H = b936965497436c210589de0226c105b3fce7a84c. Branch `cut/walkthrough-current-view-rows-g1-n5`, pushed with `git push -u origin`, exit 0.

**Step 1 (re-read at B).**
- `git diff C..B` is empty for `frontends/shell/src`, `kernel`, `engine`, `frontends/shell/src-tauri` and `MANUAL-WALKTHROUGH.md` (C = 54d07268).
- So there are no class 3 rows and no invalidators.
- I spot-read these at B and they match §2.1 and §2.3:
  - `CURRENT_VIEW_DISABLED_REASON`
  - `currentViewOptionDisabled`
  - `getViewBox() !== null`
  - the `useState("current")` default
  - `is_geographic_degrees_instance`
  - the `preflight_pinless` call in `prepare_with_progress`
  - `ShellApproval::new`
  - `RefusalBlock`
  - the `Display` message
  - the `formatRefusal` case

**Changed spans, byte for byte.**

W-G1 old:
`If the canvas has had no pan/zoom gesture yet this session, **Current view** is disabled and a reason paragraph reads *"No settled view yet — pan or zoom the canvas once before publishing the current view."*; pan or zoom once and it enables.`

W-G1 new (the reason sentence is script-copied from `PublishPanel.tsx` at B):
`With the file's data drawn on the map, **Current view** is enabled and no reason paragraph appears. After an open it is disabled only until the map draws the file's first data, or until a pan or zoom if one comes first. While it is disabled, a reason paragraph below the two options reads, verbatim, *"Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset."* (`CURRENT_VIEW_DISABLED_REASON` in `frontends/shell/src/publish/PublishPanel.tsx`, the human's words; Part Y's Y4 is their sight).`

W-N5 old:
`(Current view starts selected by default but disabled with no settled view yet — `PublishPanel.tsx:326` defaults `scope` to `"current"`, `:579-594` is the disabled Current-view radio and its reason paragraph, `:569-578` is Whole dataset)`

W-N5 new:
`(Current view starts selected by default and, as in G1, is enabled once the map has drawn this file's data; this row chooses Whole dataset instead — `PublishPanel`'s scope starts at Current view, and `PublishControls` renders the two radios, Whole dataset never disabled, both in `frontends/shell/src/publish/PublishPanel.tsx`)`

§2.3 items, old → new (items 2 to 7 are my words, by item name and with no bare `path:line`):
1. `computes the degrees check (`ds.crs().identifier()` and `CoordinateUnitSource::as_str`, `kernel/src/publish/mod.rs:435-443`)` → `answers the degrees check from the dataset's recorded coordinate unit (`Dataset::is_geographic_degrees_instance`), and fills the refusal's two placeholders from `ds.crs().identifier()` and `CoordinateUnitSource::as_str` (both in `preflight_pinless_parts`, `kernel/src/publish/mod.rs`)`
2. `(`frontends/shell/src-tauri/src/publish.rs:404-409`)` → `(`frontends/shell/src-tauri/src/publish.rs`, `prepare_with_progress`'s pin-free preflight)`
3. `(`ShellApproval::new`, `:694`)` → `(`ShellApproval::new`)`
4. `through `RefusalBlock` (`frontends/shell/src/publish/PublishPanel.tsx:652`)` → `through `RefusalBlock` (rendered by `PublishPanel`'s refused state, in `frontends/shell/src/publish/PublishPanel.tsx`)`
5. `(`kernel/src/publish/mod.rs:436-442`, `engine/src/geoparquet.rs:257-258`)` → `(`preflight_pinless_parts` in `kernel/src/publish/mod.rs`, `engine/src/geoparquet.rs:257-258`)`
6. `(`kernel/src/publish/error.rs:323-331`; the em dash` → `(`GeographicCrsNotPublishable`'s `Display` in `kernel/src/publish/error.rs`; the em dash`
7. `no test asserts it verbatim, `formatRefusal.ts:107-114`)` → `no test asserts it verbatim; it is the `publish.geographic_crs_not_publishable` case of `formatRefusal.ts` in `frontends/shell/src/admission`)`

**§4 at H** (script, exit 0, all PASS):
- **Item 1:** exactly 2 hunks, each removing and adding one line, starting `| G1 |` and `| N5 |`.
- **Item 2:** the reason sentence extracted from G1 equals the string at `CURRENT_VIEW_DISABLED_REASON` byte for byte. I self-tested the extraction pattern positive on B's `PublishPanel.tsx`.
- **Item 3:** with the spans masked, G1 and N5 are byte-identical between B and H. Every other line of the file is identical too.
- **Item 4:** "No settled view yet" occurs 1 time at B (the pattern is positive) and 0 times at H.

**E2** (tool commit ab9a4b4f; the last commit touching `scripts/plan`):
- `verify-cites`: exit 0, PASS, with 106 loose references advised.
- `verify-quotes`: exit 0, PASS, 130 checked, 99 verified, 30 baselined.
- `verify-test-claims`: exit 0, PASS, 574 claimed tests across 183 files.
- `verify.mjs --offline`: exit 0, PASS.
- `queue.mjs --check` and `site.mjs --check`: exit 0, both current.
- CI's `node --test` suites (`scripts/plan`, `scripts/hooks`, `scripts/evidence`): exit 0. It ran under the shared hold, which was granted and released. 509 tests, 509 pass, 0 fail, 0 cancelled, 0 skipped.

**§7.** `git diff --numstat B...H` gives `2 2 frontends/shell/MANUAL-WALKTHROUGH.md`, so 4 lines, which is within the ceiling. `git diff --name-only B...H` lists one file, `frontends/shell/MANUAL-WALKTHROUGH.md`.

**Differences from the brief.**
- None in scope.
- The scripts and outputs are in the scratchpad (`wcv-edit.mjs`, `wcv-evidence.mjs`, `wcv-e2-*.out`, `wcv-nodetest.out`) and are not tracked.
- Each E2 tool ran with `timeout 290`, a little under the 300 s floor. All finished well inside it.

**Final state.** `git status --porcelain` in `C:/dev/wt/wcv` is empty. Model: Sonnet 5.5 (`claude-sonnet-5-5`), no override and no context handoff. I took no PR action and requested no gate.
