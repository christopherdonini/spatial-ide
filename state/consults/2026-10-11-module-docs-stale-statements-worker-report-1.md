*Custodian's filing note (2026-10-11): module-docs-stale-statements (docs lane, piece d) worker report 1, the worker-high run 13:03:58Z to 14:07:53Z by its transcript, on cut/module-docs-stale-statements, B 31f77bf5c7500f5379c8f7261ad5106d898d81ee, head 117d8d5c2b102f6dea1c2fe5eb01832a44148604, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added, one profile path redacted (its scratch folder, in the closing status paragraph), and its 80 path:line cites de-rooted by script (each written as line N of the path; the line numbers are the report's, at B or at the head as it says). The sha256 of the report as handed back is cf8c31dd4bde4b9ce2a94ba564fbef53ff5ed5996747b98941e5b3d881954ef1. Its first paragraph (the exposure sentence removed) is for the gates to rule on.*

---

REPORT: module-docs-stale-statements, worker-high. Branch cut/module-docs-stale-statements, head H = 117d8d5c2b102f6dea1c2fe5eb01832a44148604, pushed with a plain `git push` (fast-forward from B). No PR opened. Model: Sonnet 5.5 (claude-sonnet-5-5); no override; no context handoff in or out.

**One decision for the custodian (a deviation).** The form's Says list for row DX has this bullet: "SKP, MCP, plugin, notebook and AI exposure each still need their own review." The kernel README's C8 bullet does not carry it. It comes from ADR-017's exposure review completion. §5's invalidator and §8 item 7 bar exposure text that C8 does not carry, so I committed it first and then removed it in commit 4 from the three sites that had it:
- the kernel module doc (`kernel/src/lib.rs`);
- the permission module doc (`kernel/src/permission/mod.rs`);
- the appended note in `kernel/PERMISSION-BOUNDARY.md`.

Their text now matches C8 exactly. To restore the sentence, revert 117d8d5c, one commit. I did not stop outright, because the form's own Says list asks for it.

**Step 0.**
- I parsed 145 `path:line[-line] @ rev sha256:` pins in the form and recomputed each at B, which is `git rev-parse HEAD` = 31f77bf5c7500f5379c8f7261ad5106d898d81ee. HEAD was B and `git status --porcelain` was empty before I started.
- 144 are identical. The one difference is lines 3805-3821 of PLAN.yaml, as expected.
- Before any edit I ran E2 (both packages) and E4 at B, with no edits in the tree.

**Commits.**
1. 8305d4ed: "docs: module-docs-stale-statements rows D3 and D4 first …". It touches kernel/README.md, engine/README.md and engine/src/lib.rs only.
2. 5f307304: "docs: … engine rows (D1 … D8, DE5 test rename)". The conditional rows of §2.5 are applied, the predicate.rs sites included.
3. d060e7ff: "docs: … kernel rows (DK, DX, D9 section 9, D10, D8 bundle status)".
4. 117d8d5c: "docs: … keeps the exposure text to the kernel README bullet's position".

Every commit uses `-s` and carries the Co-Authored-By trailer plus the Claude-Session line.

**Rows.** Each rests on pins at B (path:line @ 426ec39f…, shared by B for these files). Line numbers below are at H.

- **D3.** line 335 of kernel/README.md. The H2 row names the two tests. The first asserts a cancelled terminal, receipt not before send, at most one batch after observed, and a 5 s bound. The second asserts zero batches, a cancelled terminal, the same ordering and the same 5 s bound. The interval is a printed report, not ADR-018's pair, and no docs/08 budget is asserted. The name is kept by round 52, item 3. I split the Says per test because only the first test asserts "at most one batch". Pins: lines 417-434 of end_to_end.rs, :421-426, :463-476, :477-482, :380-383, :385; docs/08:8.
- **D4.** lines 93-101 of engine/README.md and lines 56-61 of engine/src/lib.rs. The stream path writes nothing. The tier builder writes a derived tier cache: a directory per content hash under LOD_TIER_ROOT, per-tier GeoParquet files, and tiers.json. The trigger has come due. What is owed is the named open item on PLAN node `lod-tier-selection`. The text says it is not discharged and assigns no ResourceRef, grade or ADR-006 class. Pins: lines 9-14 of lod.rs, :151, :992-1011, :1152, :1235-1237, :1397-1399; lines 2185-2189 of skp.rs; line 850 of PLAN.yaml; area-d check :130.
- **D1.**
  - Places: lines 27-31 of engine/README.md and :35-36 (paragraph 1); :40-43 (paragraph 2, the A row at README:33-36); :461-477 and :482-491 (the Admission and axis sections); lines 16-19 of engine/src/lib.rs (module doc).
  - What it says: an absent crs key under pinned 1.0.0/1.1.0 opens as OGC:CRS84 with crs:format-default. A declared non-x-first CRS under a pinned version opens with the WKB order. Refused: null (including non-object values), an absent key under an unpinned version, a contradicted format default (a caller assertion still opens it), an assertion over a declaring file, and a caller-asserted or unpinned non-x-first CRS. Nothing is normalized. ADR-015 Amendment 1 items 1-4 and 7 are cited.
  - Pins: lines 16-23 of geoparquet.rs, :37, :444-450; lines 286-288 of crs.rs; lines 398-426 of dataset.rs, :1332-1351; the ADR-015 :3 and :155 pins.
- **D2.** lines 473-477 of engine/README.md (Identity bullet). Identity is (dataset-session generation, file_row_number), generation-namespaced, never persisted, with no stability claim (ADR-016 Amendment 1 item 1). A declared mapping to a missing column still refuses, and a directory source is refused by name. The three claims the form lists as removed are gone. Pins: lines 1730-1756 of dataset.rs, :1744-1750, :319-327; lines 42-55 of identity.rs; ADR-016 :3 and :180.
- **D5.** lines 387-392 of engine/README.md. It enumerates the match arms (Utf8, LargeUtf8, Utf8View, Boolean, Int8-64, UInt8-64, Float64, Float32). A dictionary is admitted when its value type is, and emitted as that type. Only publish preflight refuses Float32 and dictionaries (ADR-017 §4 bundle format). Pins: lines 78-101 of attributes.rs, :45-48; lines 414-447 of publish/mod.rs.
- **D6.**
  - line 3 of engine/README.md and :7-10 (scope line).
  - line 20 of engine/README.md (Emits row).
  - lines 6-11 of engine/src/lib.rs (the module-doc scope line, the A row).
  - Content: five encodings fixed at open (ADR-034). The projection is declared on both the publish and live projected streams. ADR-023 stays Proposed. The ADR-023 :3 line is not in the form's pin list; I read it at B.
  - Pins: lines 17-28 of lib.rs; lines 991-999 of stream.rs; ADR-034 :3.
- **D7.** lines 85-88 of engine/README.md and lines 20-23 of engine/src/lib.rs. The index is built and tested, not in the product planner, and the gate is closed for this slice's shape only. It points to the two README index sections by anchor. Pins: lines 4-5 of index.rs; lines 176-179 of engine/README.md and :104-108 at B.
- **D8.**
  - Sites rewritten: line 5 of identity.rs, :43, :66, :119-121; lines 14-16 of crs.rs; lines 75-76 of geoparquet.rs, :152, :236-237, :588-591, :745, :806; line 1017 of dataset.rs, :1731; line 146 of envelope.rs, :179-180; line 5 of kernel/src/bundle/mod.rs; lines 89-92 of engine/README.md (the provenance bullet).
  - Where a comment cited a "block-on-sight N" of a deleted draft (433413a confirmed on main):
    - N=8 of ADR-013's draft (the identifier-string ban) moved to ADR-013 Amendment 1 item 2.
    - N=5 of ADR-016's draft moved to ADR-016 Amendment 1 item 1.
    - N=2 of ADR-013's draft (the verbatim-wording rule, lines 50-53 of crs.rs) and N=5 of ADR-015's draft (the only-site rule, lines 588-591 of geoparquet.rs) are not carried by the accepted text. Those comments now name the draft file at 433413a as history.
  - Provenance clause: the lod.rs subset check does not hold. lod.rs only calls geo's simplify_vw_preserve and never shows output vertices are a subset of input vertices. So the clause "nothing here creates derived coordinates" is dropped. The text says the tiers are derived and non-authoritative, and asserts no ADR-013 applicability.
  - ADR-013 pins: Acceptance appendix items 1 and 3, :248-251 and :257-258.
- **D9.** lines 255-268 of kernel/CANCELLATION-AND-TRACING.md. An appended §9 dated 2026-10-11 covers §6 items 1 and 2 only: ADR-017 Corrigendum 4, and ADR-018 Accepted. Pins: ADR-017 :1044-1048; ADR-018 :3; docs/08:8.
- **D10.** lines 46-58 of kernel/src/publish/mod.rs. The steps are listed in the order run_inner and preflight run them: preflight with no staging (the row-filter, degrees and encoding refusals, name, licenses, projection restriction, style, ceilings, then the pin read); then destination check and staging; then verify the pin; then stream; then style, viewer and manifest; then the heuristic re-check, the sidecar and the rename. Pins: lines 573-598 of publish/mod.rs, :605-611, :628-634, :696; lines 9-19 of boundary.rs. The per-step pins for the PR body: preflight_pinless_parts :449-545 (the row-filter gate first, ceilings last); preflight :578-598 (the pin read); publish_prepared :628-634; run_inner `verify_by_rehash` :713; `stream_for_publish` :728; style :829; viewer :837; manifest :887-900; `verify_by_heuristic` :911; sidecar :925; rename `staging.finalize` :931. These are B line numbers, re-read from the code.
- **DX.** lines 44-47 of kernel/src/lib.rs and :38-39 (the A row, the audit log writes), :52-54 (names opened at startup or at runtime through open_dataset); lines 21-25 of permission/mod.rs; lines 27-28 of permission/boundary.rs (rotation ceiling, MAX_AUDIT_LOG_BYTES and MAX_AUDIT_LOG_GENERATIONS); lines 242-243 of kernel/README.md (commands.rs as the definition site, publish.rs as the route; the other bullet words are unchanged); lines 492-501 of PERMISSION-BOUNDARY.md (appended note). Each states the C8 position only. Pins: line 265 of commands.rs, :402; line 831 of publish.rs; ADR-017 :1134-1142; lines 1174-1176 of skp.rs; README :16-19, :237-241; lines 133-149 of audit/log.rs.
- **DE5.** lines 871-873 of geoparquet.rs. The test is renamed `an_absent_crs_key_is_not_a_declaration`, with a two-line comment pairing it with its sibling. The assertion is unchanged. Pin: lines 867-872 of geoparquet.rs.
- **DK.**
  - Kernel module doc scope and only-place: lines 7-13 of lib.rs, following README :3-6 and :8-12. The only-place claim is now that kernel is the only crate that turns an engine stream into a data-plane source.
  - The Stream tickets and Close ordering index lines: README:357 and :362. The test pointer moved from Close ordering to Stream tickets.
  - The TicketState sentence, README:179-182. It gains the not-covered qualifier and is not called tested. Pin: lines 170-176 of skp.rs.
  - The two owner's-index lines of §2.4 were not written.
- **§2.5 conditional rows.** All are applied under Amendment 1 item 3:
  - lines 6-8 of lib.rs and :42-46 (the latter as the provenance bullet, engine lines 49-52 of lib.rs);
  - lines 7-10 of crs.rs (lines 6-7 of crs.rs), :45-46 and :50-53;
  - lines 248-249 of geoparquet.rs;
  - README:33-36;
  - kernel line 36 of lib.rs;
  - lines 128-129 of predicate.rs and :287-288, with ADR-033 shown as Accepted.
- **Out of scope, honoured.** `lines 417-420 of kernel/src/skp.rs` and `lines 251-254 of engine/src/identity.rs` are not edited.

**Evidence.** H = 117d8d5c2b102f6dea1c2fe5eb01832a44148604. Tooling for E6 is the B tree's scripts, unchanged. All heavy runs went through `hold shared`, with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 and CARGO_TARGET_DIR=D:/wt-targets/mdocs. The cargo runs at H were repeated after commit 4, so the numbers below are at the final head.
- **E1, PASS (rc 0).** A script over `git diff -U0 B H -- '*.rs'` found 180 changed `//` lines, and exactly one removed and one added non-comment line: the `fn` line, `fn an_absent_crs_key_is_not_silently_ogc_crs84() {` → `fn an_absent_crs_key_is_not_a_declaration() {`.
- **E2, PASS.** `cargo test -p spatial-engine -- --list` at B and H differs in exactly one line (84): the old name → the new name. Both lists are 551 lines. `cargo test -p spatial-kernel -- --list` is identical, 473 lines. Both rc 0.
- **E3, PASS (rc 0 each).** Each ran one test and passed it:
  - `cargo test -p spatial-engine --lib -- an_absent_crs_key_is_not_a_declaration`
  - `cargo test -p spatial-engine --test slice -- h6_the_engine_module_names_no_transport`
  - `cargo test -p spatial-kernel --test permission_boundary -- the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`
- **E4, PASS (rc 0).** `cargo doc --no-deps -p spatial-engine -p spatial-kernel`: 29 warning lines at B and 29 at H, with identical sorted warning text (18 for engine, 9 for kernel, plus two summary lines). Nothing new.
- **E5, PASS.** `cargo fmt --all -- --check` rc 0.
- **E6, PASS, all at H.**
  - `verify-cites.mjs` rc 0 (91 loose references advised, none in my files).
  - `verify-quotes.mjs` rc 0 (121 checked, 0 errors). `--show-cites` over the 16 changed files also rc 0.
  - `verify-test-claims.mjs` rc 0 (543 tests).
  - `verify.mjs` rc 0.
  - `queue.mjs --check` rc 0 (current), `site.mjs --check` rc 0 (current).
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` rc 0 (457 pass, 0 fail).
- **E7, PASS.**
  - CANCELLATION-AND-TRACING.md: lines 1-254 of B are byte-identical at H (the prefix cmp equals; the sha256 over lines 1-254 matches). H has 268 lines (+14 insertions, 0 deletions).
  - PERMISSION-BOUNDARY.md: lines 1-491 of B are byte-identical at H. H has 503 lines (+12, 0 deletions; the appended note was later trimmed to +10).
- **E8, PASS, with a caveat on line numbers.** Lines 499, 510 and 519 of B are byte-identical at H, but they now sit at lines 527, 538 and 547. My README edits all lie above them and add a net 28 lines. The whole region from B:499 to the end is byte-identical to H:527 to the end. Because the three lines moved, a check by line number will not find them where B had them. A check by exact bytes will.
- **E9 is the PR's CI**, for you to read.

**Budget** (`git diff --numstat B...H`, insertions + deletions, against §7 with the OPEN-2 additions):

| File | ins/del | total | ceiling |
|---|---|---|---|
| engine/README.md | 62/34 | 96 | 142 |
| engine/src/lib.rs | 27/16 | 43 | 54 |
| engine/src/geoparquet.rs | 17/13 | 30 | 36 |
| engine/src/crs.rs | 13/6 | 19 | 24 |
| engine/src/identity.rs | 6/6 | 12 | 14 |
| engine/src/predicate.rs | 4/4 | 8 | 10 |
| engine/src/envelope.rs | 3/3 | 6 | 8 |
| engine/src/dataset.rs | 3/3 | 6 | 6 |
| kernel/README.md | 9/5 | 14 | 24 |
| kernel/src/lib.rs | 16/11 | 27 | 42 |
| kernel/src/permission/mod.rs | 5/4 | 9 | 14 |
| kernel/src/permission/boundary.rs | 2/2 | 4 | 8 |
| kernel/src/publish/mod.rs | 8/6 | 14 | 30 |
| kernel/src/bundle/mod.rs | 1/1 | 2 | 4 |
| kernel/CANCELLATION-AND-TRACING.md | 14/0 | 14 | 16 |
| kernel/PERMISSION-BOUNDARY.md | 10/0 | 10 | 12 |

Total 314 lines (ceiling 450) in 16 files (ceiling 18). No ceiling is exceeded, and dataset.rs is at exactly 6.

**Live cites** (re-grepped at B, files outside state/, excluding the form itself).
- 119 bare path:line cites without an `@ rev` pin point into the edited files. 52 of them now cite lines whose bytes differ at H: line shifts caused by my edits, or edited cited lines. Most are records: preregistrations, DECISIONS-PENDING, ADR-013 and ADR-032.
- The ones in live code or current docs:
  - line 12 of frontends/shell/src-tauri/src/pool_poll.rs → line 181 of kernel/src/lib.rs. This is the known one, already missing at B, left out of scope.
  - line 1585 of frontends/shell/src-tauri/src/publish.rs → lines 972-975 of kernel/src/publish/mod.rs.
  - line 20 of kernel/tests/no_generation_in_persisted_artifacts.rs → line 1355 of publish/mod.rs.
  - line 1779 of kernel/src/publish/mod.rs → :1694 (a self-cite in a test comment).
  - line 101 of frontends/shell/e2e/regression.mjs → line 1017 of engine/src/dataset.rs. The cited line itself is now edited; the cite looked off already.
  - line 41 of KNOWN-LIMITATIONS.md (an HTML comment) → lines 218-240 of crs.rs.
  - line 562 of RELEASE-0.1.md, :883, :916, :926, :953 and :1181 → crs.rs, geoparquet.rs and publish/mod.rs lines.
  - line 944 of frontends/shell/MANUAL-WALKTHROUGH.md, :945, :947 and :948 → crs.rs, geoparquet.rs and publish/mod.rs.
- Shift sizes caused by my edits: later lines of crs.rs +7, publish/mod.rs +2, geoparquet.rs +4 (after about line 588), kernel/src/lib.rs +6 and engine/src/lib.rs +11. dataset.rs, identity.rs and envelope.rs are net 0.
- I did not check whether each live cite resolved correctly at B. A spot check of the four code cites into publish/mod.rs, dataset.rs and lib.rs showed them already pointing at unrelated text at B.
- `verify-cites` passes at H. It only checks that the cited lines exist.
- The old test name `an_absent_crs_key_is_not_silently_ogc_crs84` still appears in line 3820 of PLAN.yaml, CUSTODIAN-QUEUE.json, site/data/plan.json, the form, and records under state/. None is a code cite, and I edited none.

**Deviations and notes, stated plainly.**
1. The exposure sentence is removed, as set out at the top.
2. Three existing quoted spans are gone, each deleted with the stale sentence it sat in: "explicitly at acceptance, not inherited" in engine/README.md, "stable feature identity" in engine/README.md, and "should be made explicitly at acceptance, not inherited" in engine/src/lib.rs. No retained quoted span changed a byte. I added no quotation marks.
3. Two lines outside the form's pin list were edited because they dangled once their neighbours changed, both inside the same comments as pinned sites and within ceilings: line 241 of geoparquet.rs ("that amendment's block-on-sight 8" → item 2) and line 1032 of dataset.rs ("That draft's block-on-sight 8" → ADR-013 Amendment 1, item 2).
4. I left line 50 of identity.rs untouched. Its "block-on-sight A2" cites Brief A's A2, not a proposed amendment's item, and the line is not in a pinned row. Judge whether it should move.
5. "The stream path writes nothing" is in the form's Says but has no stream.rs pin. I grepped engine/src: stream.rs and dataset.rs have no non-test file-writing call; the only writers are lod.rs, the test-fixture helper fixture.rs, and test helpers. The README and module-doc wording is "the stream path".
6. Unpinned details I verified at B rather than from the form's pin list: ADR-023's Status line is Proposed, and ADR-017's Status line is Accepted. The 119-live-cite regrep is my own broader grep than the form's single-cite check.
7. I used plain backticks, not intra-doc links, for `permission::audit`, so that no new rustdoc warning appears.
8. Four commits instead of three. Commit 4 is the fix in the first paragraph.
9. The tester-style numbers above are at-head runs on the shared machine. I saw no timing-sensitive failure, and no 96-99 exit from the machine script.

**Pre-gate self-check (the four classes).**
1. No cross-module code was written. Rows cite commands.rs and publish.rs as read at B.
2. Every completion claim above points at a command and its rc.
3. No user-facing string changed (E1 shows only `//` lines and one `fn` line).
4. The renamed test and the other two E3 tests each reached and passed their assertions (1 passed each).

**Status.** Final `git status --porcelain`: empty. Local HEAD and origin/cut/module-docs-stale-statements are both 117d8d5c2b102f6dea1c2fe5eb01832a44148604. I touched no state/ file, PLAN.yaml or the form. Scratch material (spec files, outputs, scripts) is under <the custodian's scratchpad>\mdocs. The cargo target is D:/wt-targets/mdocs.
