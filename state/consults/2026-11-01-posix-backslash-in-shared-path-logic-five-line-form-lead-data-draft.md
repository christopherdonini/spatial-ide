*Custodian's filing note (2026-11-01): lead-data's read-only draft of the five-line form for `posix-backslash-in-shared-path-logic`, the filler queue's entry 7b (S3), read at main d84171b0 (dispatched 2026-11-01T02:24:20Z by the main transcript, its prompt equal to its brief by script). It fixes two of the four sites the node names (normalize.rs step 2 with its root reading, and the viewer-asset walk; 3 files, about 125 lines) and leaves the audit log's `is_inside` (a false refusal only; `kernel/src/permission/audit/log.rs` is port-2's) and the redaction scan's file label (display only). **Held for the human:** its OPEN-5, leaving two sites the node's summary names, may be a scope change to an item the human ruled, which is a red line by the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4), so nothing is committed from this draft until the human answers; the draft's guarantee question (a widening to POSIX, ruled not a red line for 7a) goes with it. OPEN-1 to OPEN-4 and OPEN-6 are not red lines and take the drafting agent's recommendation under that direction when the form is committed. The run 02:24:22Z to 02:34:25Z by its transcript (Read 24, Grep 20, Glob 2; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; the draft's fixture user name `a` under its home-directory paths (7 time(s)) is written `x`, an invented name the profile-path scan lists, its meaning unchanged, so a worker writing these tests uses a listed name too; nothing else is changed. Its sha256 as handed back, from line 5 to the end, is 3054bf124061cdefd41f0911ee0533c7e83d25d6ffdcca82f6547e784f87e22a; as filed, 6773ffe2c5ba4e09647f35e0612ef2ba95999f18e565fa9a1c1b92d65528a269.*

---

Draft: posix-backslash-in-shared-path-logic five-line form, lead-data

*Everything below is my own wording (lead-data's) unless it is marked as byte-copied. I read the main checkout, whose HEAD the session's git status shows as d84171b0. I have no shell, so I could not confirm that HEAD by git, and I give no sha256 for this report or for any span; the custodian expands each `@ d84171b0` cite by script.*

## The form (for `governance/forms/kernel/POSIX-BACKSLASH-IN-SHARED-PATH-LOGIC-PREREGISTRATION.md`)

```
Authority: PLAN node `posix-backslash-in-shared-path-logic` (governance/PLAN.yaml:2732-2748 @ d84171b0), filler queue entry 7b (state/FILLER-QUEUE.md:20 @ d84171b0), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ d84171b0); the finding is wave-3 A-1 (state/cloud/wave3/W3-A.md:107-126 @ d84171b0, state/cloud/wave3/W3-A.md:184 @ d84171b0); reuse index: a miss, no prior art recorded for "backslash path separator posix" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief).
Scope: kernel/src/permission/audit/normalize.rs; kernel/src/publish/viewer_assets.rs; kernel/tests/posix_backslash_in_shared_path_logic.rs (new); 3 files; declared line budget 140 by §21c's counting rule (estimated 125).
Change: the two kept sites turn into `/` only the characters `std::path::is_separator` names: normalize.rs step 2 and its profile-root reading, through one private `to_slashes`, and the viewer-asset walk's relative name; so on POSIX a `\` stays a byte of the file name, two destinations stay two audit strings, and a viewer asset named with `\` meets `validate_relative_path`'s backslash refusal instead of being renamed, while on Windows, where `\` and `/` are both separators, every output stays byte-identical to today's.
Tests+mutation: T1 `kernel/src/permission/audit/normalize.rs::tests::a_posix_backslash_stays_a_name_byte_in_a_profile_root_and_a_destination` (POSIX; ignored on Windows, the reason naming path syntax), mutation M1: step 2 back to `stripped.replace('\\', "/")`, predicted failure: T1's second assertion, left "/home/x/b/out", right "<user-home>/out"; mutation M2: `roots_from` back to `v.replace('\\', "/")`, predicted failure: T1's first assertion, left [("/home/x/b", "<user-home>")], right [("/home/x\\b", "<user-home>")]; T2 `kernel/tests/posix_backslash_in_shared_path_logic.rs::a3_1b_a_viewer_asset_named_with_a_backslash_is_refused_not_renamed` (POSIX; ignored on Windows), mutation M3: the walk's name back to `.replace('\\', "/")`, predicted failure: the test's panic, the file `a\b.js` was admitted and renamed; T3 `kernel/tests/posix_backslash_in_shared_path_logic.rs::a_nested_viewer_asset_is_named_with_forward_slashes_on_every_platform` (all platforms), mutation M4: the walk's mapping removed (the bare `to_string_lossy()`), predicted failure on Windows: `expect("a nested asset is admitted")` panics on ViewerAssetPathRejected "contains a backslash" (on POSIX M4 changes nothing, as declared); changed: `a_user_profile_destination_becomes_a_token` and `a_unc_path_keeps_its_share_form` ignored off Windows (Windows spelling), mutation M5: `to_slashes` maps only `/`, predicted failure on Windows: the first, left "C:\\Users\\someone\\out", right "<user-home>/out"; the `norm` helper feeds its Windows-spelled inputs in this platform's separator, and `a_non_ascii_root_or_destination_normalizes_instead_of_panicking` takes forward-slash inputs; T1 and T2 are proven on the Linux L1 job (.github/workflows/product-ci-rust.yml:196-197 @ d84171b0, .github/workflows/product-ci-rust.yml:233-234 @ d84171b0); T3, M4 and M5 on the Windows job and the worker's machine.
Out-of-scope: ADR: none (no status line or amendment; ADR-017's bundle-path rule in `validate_relative_path` unchanged); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP, data-plane or MCP surface); guarantee: TOUCHED, because the audit destination's identity (kernel/src/permission/audit/normalize.rs:6 @ d84171b0, kernel/src/permission/audit/normalize.rs:178-184 @ d84171b0) and the viewer path's backslash refusal (kernel/src/publish/viewer_assets.rs:218-219 @ d84171b0) become true on POSIX, Windows unchanged, and two tests now under test on Linux become Windows-only; §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch; no new dependency, no `unsafe`, no cfg form in product code, no new string.
```

## Notes

**N1. The defect, at main**
- normalize.rs step 2 runs `stripped.replace('\\', "/")` on every OS (kernel/src/permission/audit/normalize.rs:79-80 @ d84171b0). Its doc gives the reason as one spelling (kernel/src/permission/audit/normalize.rs:45-46 @ d84171b0).
- The profile roots get the same rewrite (kernel/src/permission/audit/normalize.rs:129-131 @ d84171b0).
- The viewer walk builds the relative name with `.replace('\\', "/")` (kernel/src/publish/viewer_assets.rs:128-135 @ d84171b0). `ViewerAssets::new` then calls `validate_relative_path` (kernel/src/publish/viewer_assets.rs:150 @ d84171b0, kernel/src/publish/viewer_assets.rs:67-68 @ d84171b0), whose backslash refusal (kernel/src/publish/viewer_assets.rs:218-219 @ d84171b0) never sees the byte.
- Wave 3's line numbers (normalize.rs:63-72, viewer_assets.rs:120-127 and :189) are baseline a0235467 lines. The lines above are main's.

**N2. The size, against §21c first** (governance/AUTONOMY.md:350-357 @ d84171b0)

| File | What | Estimated lines (insertions + deletions) |
|---|---|---|
| normalize.rs, product | step-2 doc (2 lines become 3), step-2 body (2 become 2), `to_slashes` (+8), `roots_from_environment` delegating to a private `roots_from(lookup)` (+5, 2 lines changed) | 26 |
| normalize.rs, tests | `norm` gains one `replace(..., MAIN_SEPARATOR_STR)` line and a 2-line comment (+3); two `cfg_attr(not(windows), ignore)` (+8); `a_non_ascii...` two inputs (4); T1 (+15) | 30 |
| viewer_assets.rs | the mapping and a 2-line comment (1 line becomes 5) | 6 |
| new test file | header, one `use`, `fresh_dir` (15); T2 adopted (35); T3 (13) | 63 |
| **Total** | 3 files | **about 125** |

- The keep-both-reproducers variant is about 154 lines, over §21c (OPEN-1).
- No dependency is added (std only). No exposure surface is added. User-visible behaviour is OPEN-3.

**N3. The four sites: which the piece fixes and which it leaves**
- **Fixed: normalize.rs step 2** (kernel/src/permission/audit/normalize.rs:79-80 @ d84171b0). This is the finding's first half.
- **Fixed with it: the root reading** (kernel/src/permission/audit/normalize.rs:130 @ d84171b0). The node does not name it, but it has to move with step 2. Otherwise, on POSIX, a `HOME` holding `\` would still be rewritten while the destination no longer is. The root would then stop matching, and `<user-home>` redaction would weaken. That would be a regression this piece caused.
- **Fixed: the viewer walk** (kernel/src/publish/viewer_assets.rs:128-135 @ d84171b0). This is the finding's second half.
- **Left: `is_inside`** (kernel/src/permission/audit/log.rs:390-401 @ d84171b0, its rewrite at kernel/src/permission/audit/log.rs:391-396 @ d84171b0). Two reasons:
  - Rule (00): `cut/port-2-macos-l1-and-app-dirs` edits log.rs.
  - It fails closed. This is my reasoning: the same rewrite is applied to both the log path and the root, and it keeps equality and the `r/` prefix relation. So it can never admit a log that really is inside the destination. It can only refuse a log that is not inside, which matches the node's "a false refusal only" (governance/PLAN.yaml:2747 @ d84171b0).
  - Without log.rs, the piece leaves that false refusal on POSIX as it is today.
- **Left: the redaction walk's label** (kernel/src/bundle/redaction.rs:399-403 @ d84171b0).
  - The label reaches the finding's `file` and the `skip` lookup (kernel/src/bundle/redaction.rs:405 @ d84171b0, kernel/src/bundle/redaction.rs:408 @ d84171b0).
  - The lookup only matches a `viewer/<p>` key whose `<p>` came from `ViewerAssets` (kernel/src/publish/viewer_assets.rs:164-172 @ d84171b0). After this piece that key never holds `\`, so what is left is display only.
  - redaction.rs is also 7a's Scope file (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:7 @ d84171b0). If 7a's PR is awaiting the click when 7b dispatches, including the label would skip 7b by rule (00).
- **Left unchanged: step 1, the `\\?\` strip** (kernel/src/permission/audit/normalize.rs:70-77 @ d84171b0). Its input is a resolved destination whose parent is canonicalized (kernel/src/permission/grant.rs:208-213 @ d84171b0). On POSIX that input starts with `/` and cannot start with `\\?\`. Wave 3 set aside the identical strip in engine/src/dataset.rs on the same ground (state/cloud/wave3/W3-A.md:83 @ d84171b0).
- **Left unchanged: `publish/mod.rs`'s rewrite** of an already-validated path (kernel/src/publish/mod.rs:847 @ d84171b0; set aside by wave 3 at state/cloud/wave3/W3-A.md:85 @ d84171b0). I saw that line by search only and did not read its context.
- The two left sites go to OPEN-5.

**N4. The change, by platform**
- **Why `std::path::is_separator`:** it is std's own platform definition. It is true for `\` and `/` on Windows and for `/` alone on unix. That is my knowledge of std, not a read in this repository; T1, T3 and M5 prove it on each job.
- Using it adds no cfg form in product code. `scripts/plan/cfg-boundary.mjs` sees only cfg forms (scripts/plan/cfg-boundary.mjs:4-7 @ d84171b0, scripts/plan/cfg-boundary.mjs:14-17 @ d84171b0), and its allowlist (scripts/plan/cfg-boundary.mjs:27-33 @ d84171b0) is untouched. That matters because port-2 edits that file (7a's settlement, governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:102 @ d84171b0). The new `cfg_attr`s sit in `mod tests` and in `kernel/tests/`, which the check drops.
- **POSIX:**
  - `normalize_with` keeps `\` as a byte of the name, and `roots_from` reads a root as it is. Steps 3 and 4 are unchanged.
  - The walk's name keeps `\`, so `ViewerAssets::new` refuses it with the existing detail.
- **Windows:** both sites map exactly `{'\\', '/'}` to `/`, which is what `replace('\\', "/")` produced. Every output is byte-identical.
- **Callers, interfaces unchanged:**
  - `normalize_destination` is called at kernel/src/permission/grant.rs:175 @ d84171b0, kernel/src/permission/grant.rs:178 @ d84171b0, kernel/src/permission/grant.rs:338 @ d84171b0, kernel/src/permission/boundary.rs:169 @ d84171b0, kernel/src/permission/boundary.rs:347 @ d84171b0, kernel/src/permission/boundary.rs:363 @ d84171b0, and in log.rs at kernel/src/permission/audit/log.rs:127-128 @ d84171b0, :134, :149, :159, :235 and :415 @ d84171b0.
  - `roots_from_environment` is called at kernel/tests/permission_boundary.rs:737 @ d84171b0.
  - `ViewerAssets::from_dir` is called at kernel/src/bin/publish-bundle.rs:533 @ d84171b0 and frontends/shell/src-tauri/src/publish.rs:1387 @ d84171b0. The shell is not built off Windows (KNOWN-LIMITATIONS.md:14-17 @ d84171b0).
- **No test calls `from_dir` today.** My search for `from_dir(` over `*.rs` found only those two callers and the definition. The CLI test's viewer directory is flat (kernel/tests/publish_cli.rs:97-106 @ d84171b0). T3 is therefore the first proof that Windows names nested assets unchanged.

**N5. Tests and mutations**
- **T1 (new, in normalize.rs's `mod tests`)** has three assertions:
  - `roots_from` with `HOME` = `/home/x\b` gives that root unrewritten.
  - `normalize_with("/home/x\b/out")` gives `<user-home>/out`.
  - `normalize_with("/home/x/b/out")` gives `/home/x/b/out`. This carries A3-1(a)'s property, two destinations as two strings, with no filesystem and no environment.
  - M1 and M2 each fail it at a different assertion (the Tests+mutation line).
- **T2 is A3-1(b), adopted reworded:**
  - The test body is byte for byte as the brief gives it.
  - The ignore reason is reworded to name the boundary, as R6 asks (state/directives/PORTABILITY-2026-09-30.md:65 @ d84171b0).
  - Its doc comment drops `viewer_assets.rs:127` and `:189`. Those are stale at main (now :135 and :218-219), so it names `from_dir` and `validate_relative_path` instead.
  - M3's predicted text is wave 3's observation (state/cloud/wave3/W3-A.md:116 @ d84171b0).
- **A3-1(a) is not adopted as a test.** Adopting it costs about 29 lines and puts the piece at about 154. Its assertion is T1's third assertion (OPEN-1).
- **T3 (new, all platforms)** checks that `index.html` plus `assets/app.js` walk to `["assets/app.js", "index.html"]`.
- **Existing tests:**
  - Changed: `a_user_profile_destination_becomes_a_token` (kernel/src/permission/audit/normalize.rs:217-222 @ d84171b0) and `a_unc_path_keeps_its_share_form` (kernel/src/permission/audit/normalize.rs:261-264 @ d84171b0) carry Windows-only syntax (`\\?\`, UNC), so they are ignored off Windows.
  - `norm` (kernel/src/permission/audit/normalize.rs:213-215 @ d84171b0) keeps feeding `\` on Windows and feeds `/` on POSIX. Four tests run on both platforms with unchanged bodies: `the_longest_matching_root_wins`, `a_root_that_is_a_string_prefix_but_not_a_path_prefix_does_not_match`, `a_username_component_after_the_root_is_also_normalized` and `a_username_inside_a_longer_component_is_deliberately_not_normalized`.
  - `a_non_ascii...` (kernel/src/permission/audit/normalize.rs:285 @ d84171b0, kernel/src/permission/audit/normalize.rs:289 @ d84171b0) takes forward-slash inputs.
- **Declared unchanged and green on both jobs:**
  - kernel/tests/permission_boundary.rs::a_destination_under_a_user_profile_path_is_normalized_in_the_record. Its no-backslash assertion is at kernel/tests/permission_boundary.rs:720-723 @ d84171b0, and Linux temp paths hold none.
  - grant.rs's `debug_prints_a_normalized_destination_and_never_a_raw_path` (kernel/src/permission/grant.rs:821-839 @ d84171b0).
  - Every viewer_assets.rs test, every publish and publish_cli test, and `case_differences_collapse_on_windows`.
  - `cfg-boundary.mjs`'s site count.
- **Ignored lists (R6):**
  - Windows' `--list --ignored` (.github/workflows/product-ci-rust.yml:238-240 @ d84171b0) gains T1 and T2.
  - Linux's gains the two Windows-syntax tests.
  - These are not deferrals: each property is single-platform by construction. This form is their record.
- **Invalidators:** any other test changing outcome on either job, or a new `cfg-boundary` site, stops the piece.

**N6. Platform item** (R3, docs/PREREGISTRATION-TEMPLATE.md:177 @ d84171b0; state/directives/PORTABILITY-2026-09-30.md:49-54 @ d84171b0)
- **Owning boundary:** path syntax, as std defines it (`std::path::is_separator`). No R2 row covers it today (state/directives/PORTABILITY-2026-09-30.md:37-45 @ d84171b0). Whether one is added is OPEN-2.
- **Windows:** supported and unchanged. Proven by M5 on the two Windows-only tests, by T3 and by the unchanged suite.
- **Linux:** supported at L1, which is the new correct behaviour. T1, T2 and T3 run on ubuntu-24.04.
- **macOS:** the same unix code path as Linux, supported by construction and not observed. No macOS job exists. KL 1 is unchanged (KNOWN-LIMITATIONS.md:14-32 @ d84171b0). It is observed when port-2's macOS L1 lands. No implementation is deferred.
- **Strings a user sees:** none added or changed. The existing refusal detail (kernel/src/publish/viewer_assets.rs:219 @ d84171b0) can now be reached on POSIX unchanged. No P6 placeholder is needed. If the sitting wants those words looked at for POSIX, it is a P6 sight item, not new wording.
- **No KNOWN-LIMITATIONS item is owed.**

**N7. Rule (00), path by path** (in-flight paths as the brief gives them)

| My path | Which in-flight piece edits it |
|---|---|
| `kernel/src/permission/audit/normalize.rs` | None: not in b2-1c's kernel list, not in port-2's (which is `kernel/PERMISSION-BOUNDARY.md`, `kernel/src/permission/audit/log.rs`, `kernel/tests/app_data_dir_resolution.rs`, `kernel/tests/case_policy_volume.rs`), and #273, #272, #271 and `cut/b1-shell-half-pr-c` touch nothing under kernel/ |
| `kernel/src/publish/viewer_assets.rs` | None. The 2026-10-26 skip reason, #241, is in the PLAN as merged (7a's N8 at governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:71 @ d84171b0) |
| `kernel/tests/posix_backslash_in_shared_path_logic.rs` (new) | None |
| this form's path | None |

- **log.rs is not needed.** Without it, `is_inside` keeps its POSIX false refusal (N3, OPEN-5).
- **No scripts/plan file is needed** (N4).
- 7a's Scope (redaction.rs, its new test file, kernel/README.md) is disjoint from these three paths. 7b is not blocked if 7a's PR is awaiting the click, and only one filler is in flight at a time (governance/AUTONOMY.md:692 @ d84171b0).

**N8. Owner's index**
- The pointers this piece could touch are unchanged: the publish row (kernel/README.md:372 @ d84171b0) and the permission row (kernel/README.md:373 @ d84171b0).
- Whether the form joins the preregistration list is OPEN-6.
- Out of this piece: that list still names pre-piece-F `kernel/...` paths (kernel/README.md:387 @ d84171b0).

## OPEN items, with options and my recommendation

- **OPEN-1, the tests' shape.** Recommendation: (a).
  - (a) As drafted: A3-1(b) adopted reworded, A3-1(a)'s property carried by T1, and the `roots_from` refactor so that every changed line has a mutation that fails a test. About 125 lines.
  - (b) Both reproducers adopted, plus T1. About 154 lines: over §21c, so the piece leaves the filler slot.
  - (c) Both reproducers, with no refactor and no T1. About 130 lines, but the root-reading change is tested by nothing and M2 survives.
- **OPEN-2, the boundary.** Recommendation: (a), the 7a precedent (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:37 @ d84171b0).
  - (a) The ignore reasons and the Platform item name "path syntax (std::path::is_separator)", and the architect decides at its gate whether R2 gains a row.
  - (b) Use the existing "filesystem case policy" boundary. That would be inaccurate.
- **OPEN-3, is the POSIX viewer refusal, or a POSIX audit string keeping `\`, "new user-visible behaviour" under §21c?** Recommendation: (A), the same reasoning as 7a's OPEN-2, ruled (A) (governance/PLAN.yaml:2765 @ d84171b0).
  - (A) Not new. The refusal and its string exist, and no POSIX product ships (KL 1).
  - (B) New. The piece takes the full form.
- **OPEN-4, how the Linux-only mutations M1 to M3 are observed.** The worker's machine is Windows. Recommendation: (a).
  - (a) One temporary commit per mutation on the draft PR's branch. The ubuntu-24.04 run's failure is recorded by test name, run id and commit, then reverted. Three runs.
  - (b) M1 with M3 in one run, then M2 alone. Two runs; attribution still holds because they fail different tests.
  - (c) A cloud Linux session.
- **OPEN-5, the two left sites (`is_inside`, the redaction label).** Recommendation: (a). **Possible red line:** the node's summary names all four sites (governance/PLAN.yaml:2747 @ d84171b0), and the human lists "scope changes to items I have ruled" as one (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ d84171b0). In my reading the scope is the title, which names only the two outcomes fixed here (governance/PLAN.yaml:2733 @ d84171b0), so this is not a narrowing. The custodian judges. If it is a red line, the piece holds for the human.
  - (a) One proposed follow-up node, S3, after port-2 and 7a merge, placed by the human.
  - (b) Hold 7b until port-2 and 7a merge and fix all four. About 26 more lines, over §21c.
  - (c) Fold `is_inside` into entry 1, `windows-case-fold-non-ascii`, which edits the same function.
- **OPEN-6, kernel/README.md.** Recommendation: (a).
  - (a) Out of Scope. No pointer changes, and the four kernel fillers merged at governance/forms/kernel/ before 7a are not listed either (my search of kernel/README.md for KERNEL-CLOSE-DURING-OPEN-ADMISSION, OPEN-DATASET-REFUSES, SESSION-GENERATION-T1-T3 and FIXTURE-S-REGENERATION: 0 matches).
  - (b) In Scope, as 7a did. That brings 7a's README path into rule (00).
- **Question for the custodian, not decided:** the Out-of-scope line names the guarantee as touched, the platform scope widening to POSIX, with the five-line form kept under §36. Please confirm this is not a red line, as ruled for 7a.

## What I could not settle

- My reads were of the working tree, taken as d84171b0 from the session's git status. I could not verify that by git.
- The line counts are estimates, not measured.
- I cannot read port-2's `kernel/tests/case_policy_volume.rs` or its PERMISSION-BOUNDARY.md edit. If either feeds Windows spellings to `normalize_with` or `is_inside` and runs on Linux, it and this piece may conflict in behaviour once both merge. The custodian should read the branch.
- The non-kernel paths of b2-1c (6) and port-2 (11) are unknown to me. They cannot be under kernel/, so they are disjoint from my three paths.
- The std `is_separator` definition is my knowledge, not a repository read. T1, T3 and M5 prove it on each job.
- The A3-1 reproducers were read from the brief only (origin/cloud/wave3-A @ 8a2ba65f, kernel/tests/wave3_a_portability_audit.rs lines 46-100). They are not on main.

Result: a five-line form drafted for 7b: two sites fixed (plus the root reading that has to move with step 2), two left; 3 files, about 125 of 150 lines; no cfg, no log.rs, no scripts/plan file.
Blocking question: is OPEN-5, leaving `is_inside` and the redaction label, a scope change to a ruled item (a red line)?
Blocking question: please confirm that "guarantee: touched" (the POSIX widening) is not a red line, as ruled for 7a.
Report path: C:/dev/spatial-ide/state/consults/2026-11-01-posix-backslash-in-shared-path-logic-five-line-form-lead-data-draft.md
sha256: none; I have no shell.
