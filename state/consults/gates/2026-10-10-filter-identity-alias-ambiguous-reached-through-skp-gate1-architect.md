# PR #202 gate 1 — architect
Reviewed: cut/filter-identity-alias-ambiguous-reached-through-skp @ d3c9f00daa5ec7bdb47e4b187ed8c66ddb17306c

**Verdict: pass with notes.** I found nothing under Correctness or Evidence. There are three Documentation findings (D-1 to D-3). Each must be fixed in this PR before the merge, with no re-gate. There is one condition before the merge (C-1).

Cites into the branch are read at the reviewed commit. I have no shell, so I recomputed no hash. The reviewer recomputes the hashes, the §7 numstat and the full diff.

## Checks, per the form's §9 (Architect)

**The two corrected texts, against 0.1 and §1: pass.**
- protocol/skp/SKP-V0.md:485-492 and engine/src/predicate.rs:1111-1116 match the form's declared text (form §2.2 and §2.3) exactly. `<T-1>` is set to the test's name and `<date>` to 2026-10-10.
- Every clause resolves against the code:
  - `admit_identity`: engine/src/dataset.rs:1707.
  - `IdSource::Mapped`: engine/src/dataset.rs:1718.
  - `Dataset::open_cancellable` is reached through `Catalog::open_cancellable`: kernel/src/lib.rs:202-216.
  - The host passes the identity: kernel/src/skp.rs:1119 and :1174-1176.
  - The "whatever that column's type" clause: the rule tests the name only (engine/src/predicate.rs:1120-1125), and it runs first for each referenced name (engine/src/predicate.rs:1166-1174).
  - `skp/0.2` is the wire's own label on `IdentityDeclaration` (protocol/skp/src/v0/commands.rs:52).
- The "stopped being true" sentence is §1's permitted record fact (0.6), and the texts state no reachability date. Neither text claims a shell run, an e2e step or any other code.

**ADR-016 §3: pass.** The texts describe an explicit, declared, per-dataset mapping. Nothing is inferred.

**ADR-021 decision 5: pass.** The rule refuses a name that decision 5's namespace would admit (a Utf8 `id`), and the Related line ties that refusal to ADR-016 §3's Mapped identity. Neither text restates the namespace.

**ADR-021 decision 8: pass.** The code is one of the eleven, and the heading count at protocol/skp/SKP-V0.md:465 is unchanged.

**The seam (form §2.6; the 2026-09-16 cross-module seam rule): pass.**
- T-1 (kernel/tests/skp_admission_remediation.rs:257-347) builds `spatial_skp::v0::IdentityDeclaration`. That is the real struct (protocol/skp/src/v0/commands.rs:55-59).
- It calls `SkpHost::open_dataset` (kernel/src/skp.rs:1099) and `SkpHost::viewport_query` (kernel/src/skp.rs:1372) with the wire's `OpenDatasetRequest`, `ViewportQueryRequest` and `Filter::new`. These are the methods the shell's commands call (frontends/shell/src-tauri/src/commands.rs:57-65 and :87-95).
- It uses no `Catalog::open_cancellable` and no `skip_uniqueness_check`. The host mints the declaration with uniqueness always verified (kernel/src/skp.rs:1656-1668).
- No `pub` item, callback or option is added.
- The only difference from the shell's call is the shell's `spawn_blocking` wrapper. That is not an interface difference.
- M-1's observed failure (the predicate admitted: worker report 1, the M-1 bullet) proves the form's claim that step (iii)'s refusal can only come from the rule.

**The form's §2.4 sibling rows: pass on substance, with D-1 on wording.**
- I re-ran the phrase search over engine/, kernel/, protocol/ and frontends/shell/src and src-tauri/src.
- The hits outside the table are not in the defect class: test-reachability notes, a defensive UI branch at frontends/shell/src/publish/PublishPanel.tsx:347-348, and a banner at frontends/shell/src/residency/residencyStatus.ts:20.
- The LodRefused row's conclusion holds: no product caller of `build_tiers`.

**The form's §8, item by item:**
1. Pass. The form is at base 34d14658. The flush piece merged as 7b3d8040 (Amendment 1, item 5) before the worker's first commit, caf131fd.
2. Pass. predicate.rs changes only inside the doc comment: 6 lines added and 6 deleted, replacing the 6-line note. Nothing changes under kernel/src, protocol/skp/src or frontends.
3. Pass. The Display arm (engine/src/predicate.rs:338-343) is unchanged. No literal, fixture, SKP-V0 §8 entry or user-visible string changes.
4. Pass. T-1 uses main's `IdentityMode::StringIds` and `AttributeMode::FilterWitness`, and fixture.rs is not in the diff, by the worker's account. The reviewer confirms the diff.
5. Pass (see the seam above).
6. Pass. Only §7.5's paragraph changes (8 added, 4 deleted), and the heading count is unchanged. The worker's mis-encoded `§` difference is resolved: the committed lines 486 and 490 decode as `§`, and the numstat shows no stray line.
7. Pass (see the two corrected texts above).
8. Pass. The code comments use a `path::name` form, with no line and no intra-doc link.
9. Pass. No pub item, dependency, OS cfg, ignore, sleep, retry or timeout is added.
10. The round-25 items, which pass with the checks below.

**Round-25 checks: pass.**
- No §7 overrun: 121 of 150 across the three files, 97 of 110, 12 of 20, and 12 of 20. §7 is not edited.
- No scope addition.
- No record calls a `verify-mutation` run an observation. The worker report and the PR body both say the tool was not used.
- Test-text spans on the unmerged branch are named with their commit, not hash-pinned at a branch commit. The worker report's `:334` and `:312` sit in the paragraph that names caf131fd. Lead-data's `:274` is "at d5863945".
- This is a full form, so the five-line-form check does not apply.

**Amendment 1, item 2 (the PR body's quotation of the message): pass.**
- I built the string from the Display arm (engine/src/predicate.rs:338-343), with each line-continuation `\` folding into one space, and with `column` = `id` and `source_column` = `u64` (F-1).
- The result is byte-identical to the PR body, line 8, em dash included.
- The kernel carries it as `e.to_string()`, unedited (kernel/src/skp.rs:2215-2216 and :2248-2258).
- The PR body names d5863945, the commit of the printed run. The head differs from it only in the two READMEs.

**The worker's differences from the form: pass.** The placeholder commit ids (caf131fd, then 2f42e0ab) are disclosed. Both mutations were observed at caf131fd, before the doc-only commits.

**The owner's index, against the form's §9 bullet: pass.**
- kernel/README.md:350, :359 and :376 and engine/README.md:499, :504 and :521 carry the six replacements in lead-data's update, three per file.
- The de-rooted cite is disclosed in the update's filing note.

**The PR body against the report: pass, except D-2 and D-3.**

## Findings

**D-1 (Documentation): the form's §2.4, row 3, reason column.**
- The row says there is no `build_tiers` call in kernel/src. kernel/src/skp.rs:2671 calls `spatial_engine::lod::build_tiers` inside the unit-test module, which starts at :2374 (lead-data's update, section 3).
- The conclusion (no product caller, so the row holds) is unaffected.
- Fix: append one correction to §10, at most three sentences per round 12 (d). It says "no non-test call", cites the test site, and keeps the row's verdict.

**D-2 (Documentation): the PR body, line 52.**
- P-1 says "at H", but the PR body's Head is d3c9f00d (line 19). T-1's runs were at d5863945 (worker report 1, the suites paragraph).
- Fix: name d5863945, and note that the only change from it to the head is the README index lines.

**D-3 (Documentation): the PR body, line 13.**
- The sentence: "By reading the code at the tag, it holds for v0.1.0 too."
- The claim is supported, as a reading, by the proposed node's summary (PLAN.yaml:4546, pinned at b391e436). The form's §1 bars this piece from claiming a reachability commit beyond 0.6, so the sentence must read as the node's claim.
- Fix:
  - attribute it to `filter-identity-alias-ambiguous-guidance-line-and-note`;
  - say what holds: a v0.1.0 user meets the same refusal, with the same message and no guidance;
  - keep "by reading, not by a run of the packaged build".

**C-1 (condition before the merge, not a finding).**
- P-3's CI half ("in CI on both platforms") is not yet evidence. The PR body says only "CI runs the workspace".
- The merge waits for green CI at d3c9f00d, on both platforms.

**Observation (no finding).** The worker judged "no new warning" from `cargo doc` by reading, with no baseline build. It disclosed this. The added doc text has no brackets and no angle brackets, so it cannot add a rustdoc link or HTML warning. That reading suffices for §9's criterion.

No ADR is missing, so there is no skeleton. ADR-006 operation classes, docs/08 and the control/data-plane split are not touched by this diff.
