*Custodian's filing note (2026-10-22): milestone 4 PR A's re-sweep at its base B 55618ab5 (the form's section 0.3), read only, by a worker-high. The run 14:08:31Z to 14:18:08Z by its transcript (Read 4, Bash 26, Write 1; its Write calls to its own scratch scripts; no git command that writes); its claims were read against that transcript's calls before filing. No invalidator; the walkthrough letter AC; four class-3 notes for the re-sweep amendment, which waits for the base e2e series. Its section 4: 1c's form withdraws K-1, so its three items take 48 to 50 after #241's 47, and PR A's KL-4 and KL-7 take 51 and 52. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is c7c9b7b81f640270a4d734cbb2b01a17a3530f3797f7e2da7e3831e1732f6d39.*

---

Re-sweep: b1-shell-half PR A at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f, worker-high

Method: read-only. I read B only through `git show` and `git grep` on B or other revs. My scripts and outputs are scratch files named m4a-rs-* in my session scratch folder, none committed. No repository was changed, and `git status --porcelain` in the m4a worktree printed nothing. I ran no build, test or e2e. Main and origin/main both resolve to B. Between 4b26d279 and B there are 6 commits and 20 changed files (`git diff --stat`), all forms, state files, PLAN, CUSTODIAN-QUEUE and site. None is a source file.

VERDICT: no invalidator. I4 does not fire (0 of the §0.2 interfaces differ at B). All 91 distinct pins are Same, or are records not compared. There are no Moved or Changed pins. Four class-3 notes sit under the verdict, none an invalidator. The first two fall under §4's text checks (§2.2 (g) and PA-U2).

STEP 1: PINS (script m4a-rs-pins.mjs, rc=0)
- The form holds 102 `sha256:` occurrences. The script parsed 102 pins, 91 distinct, and every one is @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e.
- The recompute at 4b26d279 equals the form's hash for all 91 (0 mismatches, 0 missing files).
- Control: `sed -n 482p` of AUTONOMY.md at 4b26d279 gave 4f388e9f3fe7a1d6…, the form's pin. Line 481 gave a different hash.
- Result at B: 76 Same, 0 Moved, 0 Changed, 15 records. Every Same pin has the same lines and the same bytes, so its hash at B equals the form's full hash. The table shows the first 12 hex digits.

Table columns: pin | status | lines at B | hash at B (first 12).
- engine/B1-PROJECTION-PREREGISTRATION.md:214-216 | Same | 214-216 | f74bb0fc69be
- engine/B1-PROJECTION-PREREGISTRATION.md:395 | Same | 395 | 31846c81e466
- engine/B1-PROJECTION-PREREGISTRATION.md:384 | Same | 384 | de65752f1484
- engine/B1-PROJECTION-PREREGISTRATION.md:80 | Same | 80 | 5e988b41df77
- docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 | Same | 3 | fef6a76bfcfe
- AUTONOMY.md:315-332 | Same | 315-332 | 211fe30919ba
- AUTONOMY.md:482 | Same | 482 | 4f388e9f3fe7
- AUTONOMY.md:609 | Same | 609 | db1a80acb95c
- protocol/skp/SKP-V0.md:1149-1171 | Same | 1149-1171 | 57e1e7603e71
- protocol/skp/SKP-V0.md:1179-1181 | Same | 1179-1181 | a33e93147d4d
- protocol/skp/SKP-V0.md:1196-1211 | Same | 1196-1211 | ebc8805c6615
- protocol/skp/SKP-V0.md:83 | Same | 83 | b926385c1e43
- protocol/skp/SKP-V0.md:1245-1256 | Same | 1245-1256 | a2bdf3ae7661
- frontends/shell/src/skp/client.ts:108-126 | Same | 108-126 | f8a94fc3de16
- frontends/shell/src/skp/client.ts:122-123 | Same | 122-123 | d2fbf847e1ae
- frontends/shell/src/skp/client.ts:128 | Same | 128 | 2b1dcbef2bf6
- frontends/shell/src/skp/types.ts:290 | Same | 290 | ef1b080e5373
- frontends/shell/src/skp/types.ts:260-263 | Same | 260-263 | 6285c16156ae
- frontends/shell/src/streaming/tileViewportStreamManager.ts:941 | Same | 941 | 246404bcef51
- frontends/shell/src/streaming/tileViewportStreamManager.ts:307-316 | Same | 307-316 | afa4bd11bcda
- frontends/shell/src/streaming/tileViewportStreamManager.ts:307-315 | Same | 307-315 | dd805cece0c9
- frontends/shell/src/streaming/viewportStreamManager.ts:192 | Same | 192 | 959f17687ff5
- frontends/shell/src/residency/candidateArmSession.ts:1274 | Same | 1274 | a64b9f3fa215
- frontends/shell/src/App.tsx:1561 | Same | 1561 | c77be16dd320
- frontends/shell/src/App.tsx:1674 | Same | 1674 | 1031b6daac96
- frontends/shell/src/App.tsx:1151-1168 | Same | 1151-1168 | 6d448eaad067
- frontends/shell/src/canvas/tileGridConstants.ts:40 | Same | 40 | a8efcbcde73e
- engine/src/pool.rs:99 | Same | 99 | 346881842ec7
- engine/src/pool.rs:132 | Same | 132 | c52c432c132c
- kernel/src/skp.rs:83-94 | Same | 83-94 | 922a3dccc592
- engine/README.md:325-336 | Same | 325-336 | f0cd7d4356f8
- frontends/shell/src/canvas/decodeBatch.ts:96-114 | Same | 96-114 | 3a19ebcb554e
- frontends/shell/src/canvas/decodeBatch.ts:123-129 | Same | 123-129 | 808a67711654
- frontends/shell/src/canvas/pick.ts:134 | Same | 134 | d9b7f5515d27
- frontends/shell/src/canvas/clickPick.ts:40-48 | Same | 40-48 | 1a75d23f85ba
- frontends/shell/src/canvas/buildLayers.ts:447 | Same | 447 | 0a58685b0d83
- frontends/shell/src/canvas/buildLayers.ts:470 | Same | 470 | 4a19c0098a5a
- frontends/shell/src/workspace/workspaceState.ts:49-59 | Same | 49-59 | 0b02dcde6f92
- frontends/shell/src/workspace/workspaceState.ts:68-86 | Same | 68-86 | 62574d11dfbc
- frontends/shell/src/workspace/workspaceBoundary.test.ts:10-13 | Same | 10-13 | f4c5efd3b625
- frontends/shell/src/workspace/selection.ts:28 | Same | 28 | 14858a0fa6b9
- frontends/shell/src/workspace/selectionConstants.ts:15 | Same | 15 | 0616e02ab0eb
- frontends/shell/src/workspace/viewTransitions.ts:34-38 | Same | 34-38 | 7f8721714f06
- frontends/shell/src/workspace/viewTransitions.ts:157 | Same | 157 | 64e4293bb5b3
- frontends/shell/src/workspace/viewTransitions.ts:6 | Same | 6 | e573caa687c6
- frontends/shell/src/style/document.ts:56-61 | Same | 56-61 | 6d08b5648c95
- frontends/shell/src/style/document.ts:109-118 | Same | 109-118 | f4017650ff73
- frontends/shell/src/style/document.ts:18-22 | Same | 18-22 | d8b7d7e56fb2
- renderer/style-ts/src/style.ts:83 | Same | 83 | 55a6469c7037
- renderer/style-ts/src/style.ts:91 | Same | 91 | 479f6a9b0a35
- renderer/style-ts/src/style.ts:169 | Same | 169 | 99121855115b
- renderer/style-ts/src/style.ts:174 | Same | 174 | 0540d5eaf3e9
- renderer/style-ts/package.json:8-10 | Same | 8-10 | 0e814b5afd1c
- renderer/src/compiled.rs:225-239 | Same | 225-239 | eefa7767c167
- renderer/tests/style_shell_agreement.rs:37-39 | Same | 37-39 | f6adc4cd6edb
- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:175 | Same | 175 | 323cc8b75aed
- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:177 | Same | 177 | a73580f5dbc5
- frontends/shell/e2e/recording.mjs:224-271 | Same | 224-271 | 3e1ce6086a3c
- frontends/shell/src/publish/client.ts:31-44 | Same | 31-44 | ed08a8f9d56d
- frontends/shell/src-tauri/src/publish.rs:1225-1246 | Same | 1225-1246 | 6b3ed47b0b5a
- frontends/shell/src/publish/PublishPanel.tsx:403-406 | Same | 403-406 | a2000bd694ae
- frontends/shell/src/publish/PublishPanel.tsx:516-520 | Same | 516-520 | b1fc483beabb
- frontends/shell/src/layout/contributions.ts:40-43 | Same | 40-43 | a5e0aad5775a
- frontends/shell/src/layout/contributions.ts:11-13 | Same | 11-13 | 78c5c0d25257
- frontends/shell/src/feature/FeatureTab.tsx:13-26 | Same | 13-26 | 1e5082ce7068
- engine/src/fixture.rs:173-197 | Same | 173-197 | 3b0e1f53b357
- engine/src/fixture.rs:860 | Same | 860 | f22e41488f84
- frontends/shell/MANUAL-WALKTHROUGH.md:1927 | Same | 1927 | 4917a05ad91a
- KNOWN-LIMITATIONS.md:72-77 | Same | 72-77 | 948295e004c1
- KNOWN-LIMITATIONS.md:70 | Same | 70 | db65b22f2d1b
- kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-749 | Same | 721-749 | eab80a9ed879
- frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:214-220 | Same | 214-220 | 35ec00a4502d
- frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:328 | Same | 328 | 08cbea22f4ca
- kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-490 | Same | 441-490 | cc8e38266316
- kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:531-581 | Same | 531-581 | cbafb5efa3e5
- kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:575-577 | Same | 575-577 | fab38342bc3b

Record pins under `state/`, listed and not compared. Their recompute at 4b26d279 equals the form's hash:
- state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20
- state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10
- state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:10
- state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:11
- state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:233-241
- state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49-52
- state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:50-52
- state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49
- state/directives/O-07-WALKTHROUGH-2026-10-05.md:48-51
- state/directives/O-07-WALKTHROUGH-2026-10-05.md:53-55
- state/directives/O-07-WALKTHROUGH-2026-10-05.md:240-247
- state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14
- state/consults/2026-10-22-bundle-redaction-scan-not-in-product-publish-worker-report-2.md:56-83
- state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-7
- state/directives/2026-10-06-machine-script-adopted.md:12-22

STEP 2: §0.2 INTERFACES AT B
Every one is as §0.2 states it. Each span is byte-identical to its pin, and I also read the text, not only the hash.
- Wire request: `{ skp, dataset, bbox, bbox_crs, limit, filter, columns: Option<Vec<String>> }`. Batch is `[id, geometry, ...columns]` in declared order. As stated.
- `Some([])` refuses `skp.projection_empty_list`. The ceiling of 32 is checked before any name is resolved. As stated.
- Refusal taxonomy: 8 codes in the table. As stated.
- `describe` `schema [ { name, arrow_type, nullable, projectable } ]`. As stated.
- Request fixture `protocol/skp/tests/data/v0-viewport_query-request-with-columns.json` exists at B. Its `columns` are `["area","zone"]` and its skp is "skp/0.12". As stated.
- Shell's only builder: `viewportQuery(dataset, bbox, bboxCrs, limit, filter = null)` sends `columns: null` (client.ts:124). It is the only `call("viewport_query", …)` site in the shell source. As stated.
- Product callers of `viewportQuery`: exactly tileViewportStreamManager.ts:941, viewportStreamManager.ts:192 and candidateArmSession.ts:1274. The last is the first look, with `limit`. No other product call site; the other hits are test mocks, comments and e2e. As stated.
- App.tsx:1561 is `startCandidateArmSession({`. App.tsx:1674 is `new ViewportStreamManager({`. As stated.
- `MAX_IN_FLIGHT_TILE_STREAMS = 3`; `MAX_STREAM_CONNECTIONS = 4`; `MAX_ADMISSION_CONNECTIONS = 4`. As stated.
- kernel/src/skp.rs:83-94: a fifth concurrent pending ticket fails at the lease with `engine.connections_exhausted`. As stated.
- engine/README.md:325-336: the cancel-path lease race. As stated.
- The tile manager comment calls the class "composition-unreachable for this shell in ordinary operation". As stated.
- `ResidentBatch` (96-114) has ids, parts, partToRow, partCount and totalVertices, and no attributes member. `decodeBatch` has 5 parameters, with no projection parameter. As stated.
- `resolvePick(batch, gpuOrdinal)` at pick.ts:134. As stated.
- `resolveClickPick(deps, x, y)` already indexes `candidate.batch.partToRow[candidate.gpuOrdinal]` for bounds. As stated.
- `InspectedPick` and `InspectedFeature` have no row member. `ViewState` spans 68-86. As stated.
- The UA6 workspace import rule forbids react, `skp/client`, `streaming/`, `residency/` and `canvas/` by its `isForbidden` function. `attributes/` is not forbidden. As stated.
- `SelectionMembers = ReadonlyMap<bigint, AuthoritativeBbox>`; `SELECTION_MAX_FEATURES = 10_000`. As stated.
- `StyleSetTransition` has 4 variants and `fillColor` takes a string only. `styleTransitions` is at 157. As stated.
- `StyleState` has 4 members. `StyleDocumentV0` has no `match`. The Literal-only bullet is at 18-22. As stated.
- Resolver in style-ts: `legend: LegendEntry[]` (83), `groups: DrawParameters[]` (91), `resolve(key: string | null)` (169), `groupFor(key)` (174). As stated.
- The match-key type rule is in Rust only (`admit_match_type`: Utf8, LargeUtf8, Utf8View). A search of renderer/style-ts/src for utf8, admit and match-key terms finds only `matchColumn` plumbing. As stated.
- The canvas draws one colour: `getFillColor: draw.fillColor` at buildLayers.ts:447 and 470. As stated.
- style-ts package.json scripts are `typecheck` only, so no test runner. As stated.
- `record_step` admits literals only (SKP-V0.md:1245-1256). ADR-036:175 admits the match for `fillColor` only. ADR-036:177 names the match column with its type. As stated.
- Shell step type: types.ts:290 is the first line of the `StyleSetParams` doc comment; the four literal members follow it. As stated.
- e2e history reader recording.mjs:224-271 (`stepRecord`). As stated.
- `publishPrepare(datasetHandle, styleDoc, scope, filterActive)`. The host's `style_attributes` derives the match column via `match_column()`. As stated.
- `handleExportRunning` acquires the consumer and releases it on `report.ended`. As stated.
- PublishPanel reports the prepare run at 403-406. It reports the execute run at 516-520, after `const run = publishExecute(…)` at 516. As stated.
- `ACTIVITY_TABS` is Console and Notices. The eleven headings are at contributions.ts:11-13. FeatureTab is documented as a pure view. As stated.
- `AttributeMode::MultiType` has 7 columns: zone, area, f32, i64, flag, d32, text. `write_geoparquet(path, &FixtureSpec)` is at 860. As stated. This fits §3's "six projected, d32 not".
- Last walkthrough Part is AB (1927). KNOWN-LIMITATIONS item 4 is at 72-77 and item 3's "On `main`" note at 70. As stated.

All 34 files that §2.6 lists as edited by PR A exist at B. All 6 files it lists as new (attributes/projection.ts, values.ts, their tests, App.attributes.test.tsx, e2e/attributes.mjs) are absent at B.

STEP 3: WALKTHROUGH LETTER
- At B the last Part is AB (line 1927). There are 28 `## Part` headings, in file order: A B C D E F G H I J K L M N P Q R S P T U V X W Y Z AA AB. The id P appears twice, and X comes before W.
- On `cut/bundle-redaction-scan` (2fc01f59), `cut/stale-assertion-messages-and-product-comments` (b24e5281) and `cut/verify-quotes-round-item-cites` (b08a1fec) the last Part is also AB. None adds or removes a Part heading.
- `cut/b2-piece-1c-save-and-reopen` is at B, so its last Part is AB.
- `git grep` for "Part AC", "Part AD" and "Part AE" at B returns rc=1 (no match). The control search for "Part AB" in MANUAL-WALKTHROUGH.md found 2 matches.
- The letter O is unused in the file, but PLAN.yaml:1906 at B titles the node briefb-part-o-walkthrough "Part O — the nine-step recipe walkthrough, after B3 only". It is not free.
- 1c's form (B2-1C…:457, 573, 771) names no letter.
- The F7 piece edits Part F only.
- NEXT UNUSED LETTER FOR PR A: AC.

STEP 4: KNOWN-LIMITATIONS NUMBERS
- At B the items are 1 to 46 with no gap. Item 43 is written `**43. …**` at line 400, so a plain `^N\. ` search misses it. The highest is 46, at line 407.
- `cut/bundle-redaction-scan` (2fc01f59) adds item 47 only, and no other item.
- `cut/stale-assertion-messages-and-product-comments`, `cut/verify-quotes-round-item-cites` and `cut/b2-piece-1c-save-and-reopen` change no item. Their diffs against their merge bases touch neither KNOWN-LIMITATIONS.md nor MANUAL-WALKTHROUGH.md.
- The F7 form (line 279) and the docs-lane form (line 338) both say no KNOWN-LIMITATIONS item is added.
- 1c's form at B (lines 513-518) places K-2, K-3 and K-4 "at the next free numbers after the redaction scan's item" and withdraws K-1. It pins no numbers. On the plain reading those are 48, 49 and 50.
- Next free for PR A, clear of #241 and of 1c's three: KL-4 is 51 and KL-7 is 52. If 1c's K-1 keeps a number, the pair is 52 and 53. The custodian's call.

STEP 5: §2.2 (g) buildLayers.ts COMMENT
- The comment as b24e5281 leaves it is at buildLayers.ts lines 25-35 (the doc comment on `ResolvedDrawParams`), and the clause sits in lines 31-35. This span exists only on that unmerged branch commit, so per round 25, item 2 it is named in words with no hash. The changed span in b24e5281 is lines 31-35. At B the same sentence is lines 31-34 and reads differently: "Style v0 is literal-only (ADR-023: `viewport_query` carries no attributes, so …".
- Byte-copied from b24e5281, lines 31-33: "`0..1` opacity). The shell's style documents are literal-only (`style/document.ts`'s" / "`StyleDocumentV0` has no `match` variant; `viewport_query` has carried a declared attribute" / "projection since `skp/0.6`, and the shell requests none), so this is exactly ONE colour for a".
- PR A sends `columns` as `projectionFor(describe)`: the open's projectable columns, up to 32, and `null` only when none are projectable. So "the shell requests none" is false for MultiType and filter-zoned.
- Once #243 merges, PR A's edit removes the clause "; `viewport_query` has carried a declared attribute projection since `skp/0.6`, and the shell requests none". What remains is "(`style/document.ts`'s `StyleDocumentV0` has no `match` variant), so this is exactly ONE colour for a whole style, …".
- That remainder stays true until PR B: it is still one colour. The comment must not say the shell requests no projection or that `viewport_query` carries no attributes.
- Re-wrap lines 31-35 after the removal.

STEP 6: PIECE 1C
- `cut/b2-piece-1c-save-and-reopen` is at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f, equal to B and to its origin branch. `git log B..branch` lists 0 commits.
- 0 commits touch any of the six files: skp/client.ts, skp/types.ts, skp/client.test.ts, App.tsx, console/surfaceRegistry.ts and package.json.
- The branch tip is an ancestor of B, rc=0.
- The 1c worktree has no tracked changes: `git --no-optional-locks status --porcelain --untracked-files=no` printed nothing. Its HEAD is B.

NOTES (class 3, none an invalidator)
1. §4's text check "`Proposed, so it binds nothing` has zero matches" fails its own self-test at the base. The phrase wraps across viewTransitions.ts lines 6 and 7: "(Proposed, so it" then "binds nothing)". A single-line `git grep -F` returns rc=1 at B, so the check needs a multi-line match to be positive at the base. PR A's edit re-wraps two lines.
2. `requests no projection` is positive at B in client.ts:122 and also in a test title, client.test.ts:43: "sends columns: null, never omitted -- this shell requests no projection". §2.2 (g) does not list that test title, but §4 requires zero matches across frontends/shell/src. client.test.ts is a PR A file, and a test-text fix is class 3.
3. In document.ts:18-22, removing the clause from "`viewport_query` can carry" to "`columns: null`) --" leaves ". so categorical/match styling…" with a lowercase "so" after a full stop. The words "not a wire restriction" also lose their antecedent. The worker needs to re-word this within the comment.
4. At b24e5281 the other positives of the three text-check patterns match §2.2 (g)'s list, with one addition: buildLayers.ts:33 ("requests none"), which is §2.2 (g)'s fifth bullet.

All step commands printed rc=0 where I report a code. Searches that return rc=1 for absence are marked as such. Three checks were piped through cut, sed or head, and I report no exit code for them: the git grep of the form's pinned files, the git grep of the milestone-3 and 1c forms, and the git grep of the text-check patterns. For the last, I read the printed hits instead.
