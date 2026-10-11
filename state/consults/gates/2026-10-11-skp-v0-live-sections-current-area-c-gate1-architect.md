# PR #210 gate 1 — architect
Reviewed: cut/skp-v0-live-sections-current-area-c @ a8b45622084e0aa0f4ffd761a19921b706b38f76

**Verdict: pass. There are no Correctness or Evidence findings. The PR carries four Documentation findings (D-1 to D-4), and each must be fixed in this PR before the merge, with no re-gate. Three of them sit in §8, which is append-only, so after the merge they could only be corrected by a further note.**

All `path:line` cites below point into the worktree C:/dev/wt/skpe at the reviewed commit, unless I name the main checkout.

## Correctness

None. Every rewritten sentence I read matches its pin or the code at H. That includes the red-line exposure text (ruling 1) and S4's narrowed path sentence (ruling 2).

## Evidence

None from me. E1 to E10 are the worker's results, and the reviewer verifies them. What I read agrees with E1: every changed `.rs` and `.ts` line I viewed is a comment. It also agrees with E8: the note sits after the covering note's last line, protocol/skp/SKP-V0.md:1104, and before `## 9.` at :1116. And it agrees with E9: outside §8 the three codes appear only at protocol/skp/SKP-V0.md:345.

One item for the reviewer, which is not a finding. The S12 note says the three codes "were never produced by the host" (protocol/skp/SKP-V0.md:1111). That is a claim about history, and the absence scripts only prove the tree at B. The form's S12 (ii) authorizes the claim. The reviewer should confirm it with `git log -S` over the three constructor call shapes. If any past host call turns up, the sentence must be cut back to "are not produced at B", and that would be Correctness.

## Documentation (all must be fixed before the merge, no re-gate)

- **D-1. The S12 note puts one S11 correction in the wrong section.**
  - protocol/skp/SKP-V0.md:1110 says "a section cite corrected from §6 to §5 here and in §4 item 8", listed under §5.
  - The two corrected cites are at :270, which is §4 item 8, and :486, which is §7.5. Neither is in §5.
  - Fix: "in §4 item 8 and §7.5". §8 is append-only, so this has to be fixed now.
- **D-2. The S12 note cites a source the reader cannot find.**
  - protocol/skp/SKP-V0.md:1111 says "(the directive, item 4)". The phrase is the form's shorthand, and a reader of the spec cannot resolve it.
  - Fix: name the file, `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md`, item 4, by path with no line.
- **D-3. §9.1's new note is in the wrong place.**
  - The 2026-10-11 note (protocol/skp/SKP-V0.md:1129-1130) sits above the 2026-09-29 `skp/0.7` note (:1132-1134), and that note says "`skp` is now compared against `"skp/0.7"`".
  - Read top to bottom, the last literal a reader sees is therefore `skp/0.7`.
  - §2.5 says the new note goes "beneath its existing text". Move it below :1134. §7.1 is correct as placed (:381-382).
- **D-4. §2.6 is not applied.**
  - kernel/README.md's "Governed by" kernel-halves line still lacks this form. That line is at main 1457fbd0:382 per Amendment 2 item 2.
  - lead-data writes the change and the worker applies it, within the cap of 2.
  - The PR body records ruling 2's narrowing by reference to this report, with no prose (record cap).

## Rulings

1. **S3's exposure sentence (protocol/skp/SKP-V0.md:211-215): permitted, and every clause holds. Pass.**
   - **What this form allows.** §8 item 6 sets the bar at ADR-017's 2026-08-17 completion section and the paragraph above it. §5's invalidator is "exposure text that ADR-017 does not carry". S3's Says lists the six surfaces, with "No more surfaces and no fewer".
   - **Why #209's ruling 1 does not transfer.** That form tied exposure text to C8 (its §8 item 7, and DX's header "C8's position and nothing more"). This form ties it to ADR-017 itself, which is the binding and higher authority.
   - **No conflict with C8.** C8 (kernel/README.md:240-245) names the same `binding_publish_*` route and the same "UI surface" discharge. It says less, and it contradicts nothing.
   - **Clause by clause:**
     - "no `publish`": the worker's absence script over `commands.rs`, and C8's :240.
     - The shell's UI reaches publish through binding-local `binding_publish_*` commands, outside SKP: frontends/shell/src-tauri/src/commands.rs:11-12, :265, :402 and :451. The E2E seam at :459-460 is compiled out of release builds.
     - The acceptance condition was discharged for that UI surface only: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1128-1129 ("discharged for this UI surface only") and :1139.
     - The six surfaces: ADR-017 lists SKP, CLI-as-product, MCP, plugin, notebook and AI at :1129-1130.
     - The `publish-bundle` parenthetical: ADR-017 says it "remains developer/test tooling as a CLI" at :1140.
   - **Nothing beyond the bar.** No surface is claimed reviewed, nothing says SKP may gain publish, and nothing is called tested. I found no later ADR-017 entry that changes exposure (grep over the ADR). ADR-017's Status line is Accepted (:3).
2. **S4's "passes it to the engine's open as received" (protocol/skp/SKP-V0.md:29-32): true, and stronger than the form's own Says. Pass.**
   - **The path is not changed on the way to the open.** kernel/src/skp.rs:1175-1177 passes `&req.path` unchanged to `Catalog::open_cancellable` (kernel/src/lib.rs:210-224). That calls `Dataset::open_cancellable` and then `open_inner` (engine/src/dataset.rs:296-333). Nothing on that path canonicalizes.
   - **The watcher canonicalizes only its own copy.** The arm at kernel/src/skp.rs:1173 canonicalizes inside `engine/src/watch.rs:603-612`. A failure there returns `ArmOutcome::ChecksOnly` and refuses nothing. So the refusal order the sentence states holds: the directory or glob refusal at engine/src/dataset.rs:325-327, then `engine.source` at :328-332.
   - **Why the narrowing is right.** The form's Says ("passes the path to the engine without canonicalizing it") would have been loose, because the watcher is an engine call too. The narrowing is what makes the sentence true. It is not a class 9 addition, and no pinned fact changed, so there was no invalidator.
   - **Record.** The PR body records it by reference to the worker report's "Not done as written" and to this ruling (D-4).
   - **Observation, not a finding.** `partitioned_source_detail` strips a `\\?\` prefix before it scans for globs (engine/src/dataset.rs:1651-1658). So "a path carrying a glob metacharacter" has a Windows-prefix exception. Form §2.8 puts the prefix handling out of scope, and the sentence matches its pin (:1637-1641).
3. **The `§6` cite at protocol/skp/SKP-V0.md:410-411 (the report's "line 407"): leaving it is correct.**
   - The cite points at §6, "What this is not" (:353-358), which carries the "no numbers, no claim … specification completeness" point. It is a correct section cite, not one of S11's §5-as-§6 errors, and S11 names only two lines.
   - Its quoted span "no claim without the thing" does not appear byte for byte in §6. It is pre-existing and sits inside a 2026-08-18 correction. §2.0(d) and §8 item 11 forbid changing its bytes, so I route it to the custodian. It is not a finding against this PR.

## Also checked

- **S9.** The current literal `skp/0.11` is stated in one live sentence only, at protocol/skp/SKP-V0.md:234-235. §1's lead (:15), §7.1 (:381-382) and §9.1 (:1129-1130) point there. The other hits are in §8 or are dated notes that name past literals. Pass, apart from D-3's placement.
- **SX2.** kernel/src/skp.rs:419-421 names the draft at 433413a as "deleted at acceptance", the rule's origin, "not ADR-016 Amendment 1's text". This agrees with docs/adr/ADR-016-stable-feature-identity-admission.md:238. Pass.
- **SX3.** protocol/skp/src/v0/commands.rs:199-200 says "which the ADR records as Accepted (2026-09-23)". This agrees with ADR-016:180 and :238. Pass.
- **S12.** The note discloses the nine `HexF64` fixture values (protocol/skp/SKP-V0.md:1112). There are nine by grep: refusals-any-layer.json:129, 150, 171, 192, 213 and 234 name `skp.malformed_hex_f64`, and :275, 296 and 317 name `skp.bbox_not_finite`. Nothing in `*.rs`, `*.ts`, `*.tsx`, `*.mjs` or `*.js` reads `expected_refusal_code`. Pass.
- **Bare `path:line`.** None is new in any changed line of SKP-V0.md or in any changed comment. Pass.
- **ADR status words.** Touched lines name ADR-016 Amendment 1 as Accepted, which is correct. ADR-017 (Accepted, :3) and ADR-004 amendment 1 (ADR-004 Accepted, :3) are cited without status words. No touched line calls ADR-019 or ADR-023 binding. Pass.
- **Principles and ADR-004 amendment 1.** The bit-pattern rule and its spike M4 sentence are kept (protocol/skp/SKP-V0.md:192 and :196-199). Striking the three codes, which the host does not produce, applies docs/01 principle 8. The S5a sentences are supported by codec.rs:71-78 and client.ts:58-65.

## §8, item by item

1. **Pass on reading.** Every changed line I viewed is a comment: error.rs:74, 83 and 92; codec.rs:15-18; handles.rs:4-15; skp.rs:419-421 and 1721-1724; commands.rs:199-200; types.ts:290-293. The reviewer confirms E1.
2. **Pass on reading.** No literal, fixture, assertion, test name or app string changed. E7 is the reviewer's.
3. **Pass.** In error.rs the only changes are `///` lines directly above the three constructors, at :74, :83 and :92. The report's "75, 85 and 95" is wrong; the report is evidence, not a finding.
4. **Pass.** Seven paths changed, all of them §7 paths or paths added by Amendment 1 item 5.
5. **Pass.** No rewritten sentence claims Tauri's error text, an end-to-end test, a host finiteness check, a tested cancel-key `unknown`, a future typed refusal, or a reader of `expected_refusal_code` (rulings 1 and 2; Evidence item for the reviewer).
6. **Pass** (ruling 1).
7. **Pass** (status words above).
8. **Pass on reading.** There is one note, after the covering note, and no existing §8 line or preamble is edited. The reviewer confirms with E8.
9. **Pass.** The note says "no literal is bumped" and adds no version entry.
10. **Pass.** No new bare `path:line`, no split pin, and no pin at a branch commit. The note's base is the full id of B on main.
11. **Pass on reading.** The new text adds no quotation marks; `"unknown"` and the enum values are code literals. The reviewer confirms that the existing spans are unchanged.
12. **Pass on record.** B 1457fbd0 comes after #209 (Amendment 2 item 1). The `protocol/` overlap at dispatch is the custodian's check, and I cannot see it.
13. **Pass.** Amendment 1, which answers OPEN-1 and OPEN-2, was committed before code.
14. **Pass.** The worker's numstat is 104 of 206 lines in 7 of 10 files, every file is within its ceiling, and §7 is not edited. With D-4's 2 lines it is still within.
15. **Pass.** There is no addition outside the rows, and ruling 2 is a narrowing.
16. **Pass.** The cancel rows use the wire's `state` values, and no touched line uses ADR-018 vocabulary.

## Observations for the custodian (out of scope; not findings)

- protocol/skp/src/v0/codec.rs:13 still says "a malformed value is a refusal". This is outside S5e's range (:15-16), and changing it here would be a class 9 addition.
- The worker reports no shell lint step in CI. E5's shell half therefore ran as `tsc --noEmit` and vitest, not a lint.
- I did not read the PR body, because I have no shell.

## Files read

- **Main checkout C:/dev/spatial-ide:**
  - protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md (whole)
  - state/consults/2026-10-11-skp-v0-live-sections-current-area-c-worker-report-1.md
  - state/consults/gates/2026-10-11-module-docs-stale-statements-gate1-architect.md
  - state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md
  - state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:25-34
- **Worktree C:/dev/wt/skpe:**
  - protocol/skp/SKP-V0.md (1-420, 470-569, 1040-1223)
  - protocol/skp/src/v0/codec.rs:1-90
  - protocol/skp/src/v0/error.rs:68-102
  - protocol/skp/src/v0/handles.rs:1-25
  - protocol/skp/src/v0/commands.rs (struct grep, 190-204, 276-353)
  - kernel/src/skp.rs (318-335, 410-425, 950-961, 1120-1229, 1555-1570, 1716-1727)
  - kernel/src/lib.rs:210-232
  - kernel/README.md (grep: 240-245, 288-290)
  - engine/src/dataset.rs (296-339, 1630-1669)
  - engine/src/watch.rs:585-629
  - frontends/shell/src/skp/client.ts:1-75
  - frontends/shell/src/skp/types.ts:283-297
  - frontends/shell/src-tauri/src/commands.rs (1-20, publish grep, 455-484)
  - protocol/skp/tests/conformance/fixtures (grep)
  - docs/adr/ADR-016-stable-feature-identity-admission.md (3, 178-185, 236-239)
  - docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md (exposure grep, 1110-1154)
  - Status lines of ADR-004, 016, 017, 018, 019, 023, 034 and 035
  - a grep for `canonicalize` over engine/src and kernel/src
  - a grep for `expected_refusal_code` over code files
