# PR #190 gate 1 — architect
Reviewed: cut/b2-piece-1a-step-record-and-dataset-reference @ a3f9f34f58d285cbcb20853f10f93df5591b514d

**Verdict: fail.** Two Correctness findings block the merge, and each needs only a small fix. One is red-line text, which the 2026-10-05 product-first direction, section 2, says is never documentation-only. There are also three Documentation findings, each to be fixed in this PR before the merge.

Sources read: the branch in `C:/dev/wt/1a` at a3f9f34f, and main's records in `C:/dev/spatial-ide`. I had no shell, so the reviewer must recompute every hash and the §7 count.

## Correctness (blocking)

**C-1 — The OPEN-7 text in ADR-036 does not say what the human ruled. Class: Correctness (red-line text). Severity: high.**
- Location: the `project-relative` bullet, line 70 of `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` at a3f9f34f. It comes from the form's Amendment 2, item 4.
- Source: the ruling at `state/directives/2026-10-08-round-70-rulings.md:28-31`.

(a) **A rule in the ruling was dropped.**
- Paraphrase of the ruling: a project file carries a project-relative locator when the data is inside the project folder, and always carries machine-recorded as well.
- The ADR keeps only a restriction: the locator is "written only where" the data is inside. It never says the locator is required when the data is inside, and it never says machine-recorded is always carried. A 1c writer that never writes project-relative would conform to the ADR.
- Nothing carries this rule elsewhere. The OPEN-7 item that the form's Amendment 2, item 5 routes to 1c's PLAN node covers only the re-link check (`PLAN.yaml:4431` on main).

(b) **The ADR claims more than its rule delivers.**
- The ADR says "It never points outside the project folder", then gives a lexical refusal list as if that list were the whole guarantee.
- The list does not deliver the guarantee when the path is resolved:
  - a symlink or junction inside the folder can still point outside it, on every OS;
  - on Windows 10, DOS device names such as `data/NUL` or `nul.parquet` resolve to devices;
  - on Windows, a segment with trailing dots or spaces may normalise into another segment.
- The list also refuses spellings that stay inside the folder: `./x`, `a//b`, and `a:b` on POSIX. Those are canonical-form choices added in drafting, not part of the human's ruling.

Fix (appended class-5 amendment, with ADR-036 copied again):
- §5 states the carrying rule as ruled.
- §5 separates two things: the reader's lexical canonical form, which is the existing list; and containment, where 1c's resolver must refuse a resolved target outside the canonicalised project folder.
- 1c's PLAN node gains both items.

**C-2 — The reader refuses entries that ADR-036 says are valid. Class: Correctness (a guarantee claim the code does not support). Severity: medium.**
- ADR-036 §2 defines a named state as `{"state": <word>, "basis": <text>}`. The OPEN-1 (A) ruling adopted it as drafted.
- `expect_state` accepts only the one fixed basis text for each state (lines 434-444 of `kernel/src/dataset_ref.rs` at a3f9f34f).
- The reader is stricter than the ADR in two more places:
  - `modified_ns` must be in minimal decimal form (lines 549-551);
  - `footer_sha256` must be lowercase hex (line 562).
- The bundle, the single ResourceRef model (§8 item 4), keeps `basis` as free text (`kernel/src/bundle/mod.rs`, `NamedState`).
- Result: a writer that follows ADR-036 alone is refused, so the Consequences claim "fully specified here" (docs/14) does not hold.
- Fix, one of two:
  1. preferred: the parser accepts any bounded, non-blank basis text, and the module doc says what the writer re-states;
  2. ADR-036 §2 and §5 state the fixed texts, lowercase hex and minimal decimal as the canonical forms.
- Either way, the class 8 overrun is recorded again if lines grow.

## Documentation (must be fixed in this PR before the merge; no re-gate)

**D-1 — Test-text rows name no span and no commit (round 25, item 2 (d)).**
- Location: Amendment 4, item 6, and Amendment 3, item 8 (both "Class 3, test text").
- Fix: name each span in words, for example "lines a-b of `kernel/tests/dataset_ref.rs` at 1e637d55, superseded at 1251fc3c". The PR body names those rows, and a PLAN node blocked on the piece carries the hash pin after the merge.

**D-2 — Hash references carry no explicit revision (round 15 (e); round 14).**
- Location: Amendments 1 to 4.
- They pin lines and hashes "at the commit that adds it", with no explicit `@ <rev>`. Each is also a line cite into a file that the citing commit creates.
- Fix: the closing record pins each one at its commit on main. From main's reflog, to be confirmed with `git log --diff-filter=A`:
  - 45e7a0b0: the round-69 rulings;
  - ab0469f4: the round-70 rulings;
  - 5576a426: worker report 1;
  - 1ca0af4c: worker report 2.

**D-3 — Amendment 4 counts at the build head but describes the gated head.**
- Its heading says "at the gated head", but its count is at 479ae81d.
- Its sentence about the merge was committed before the merge existed. Amendment 4's commit (1ca0af4c, reflog 1791438807) came 17 seconds before a3f9f34f (worktree reflog 1791438824). The sentence is true in fact: #189 touches neither `kernel/` nor `engine/`, per its form's line 64.
- Fix: closing record item 7 gives §7's count at a3f9f34f, measured from the merge base (three-dot).

## Checked and holding

- **§8, item by item:**
  - 1: no I/O, lease or `Path` in the module; the one exception from Amendment 2, item 4 is held by a string-only grammar.
  - 2: G1.
  - 3: `RefCheck` states facts only, and nowhere calls the file "unchanged".
  - 4: six members, in the bundle's order (K1). The new values are ADR-036 §5's own.
  - 5: there is one comparison, `differing_components`.
  - 6: the lock diff is one line; I compared the `spatial-kernel` block on the branch with main's.
  - 7: every `pub` item is on §2.4's list.
  - 8, 9: no step type, no frontend file.
  - 10: Status is Proposed. My visual check matches §2.3 as amended by Amendments 1 and 2; the reviewer verifies the hash.
  - 11: `mint` uses the CSPRNG and landed after ab0469f4. The worker read ab0469f4 before 2bd318b4 and 1e637d55 (report 1).
  - 12, 13: no performance numbers; no new `cfg`.
  - 14: the class 8 record is first-line compliant, §7 is unedited and the reason is given; the mutations are recorded as applied by hand, never as `verify-mutation`; the piece is on the full form.
  - 15: no quote marked verbatim.
  - 16: index lines are within §2.8, and both indexes stay under 60 lines.
  - 17: #189 has merged.
- **ADR-005:** a linked file is at most Reference-only, in the ADR and the module header.
- **ADR-006:** the ADR's §7 class mapping; `reversibility` appears only on external side effects; a restore never re-runs or undoes an export.
- **ADR-016 §6 and its Amendment 1:** no generation; no feature id written.
- **docs/11:** the six members.
- **Seams:**
  - E-1 to K-1 is written against the same piece's `SourceObservation`, and K3 tests it through a real open.
  - K-1 to `OpenDatasetRequest`: `Admission` holds the wire's own `CrsAssertion` and `IdentityDeclaration` (`protocol/skp/src/v0/commands.rs` on the branch). K2 passes them unconverted through `SkpHost::open_dataset`.
- **Round 8's exemption against §2.6:** OPEN-6 (A) confirms it (round 69, item 3), and the PLAN node names 1b and 1c.
- **Round 7:**
  - every "done" or "held" claim in Amendments 3 and 4 points to a section of a filed report;
  - no operator text; the error details state the kernel's own format facts.
- **The ruled ADR text:**
  - the OPEN-2 and OPEN-3 bullets match `state/directives/2026-10-08-round-70-rulings.md:8-20` and add nothing;
  - the OPEN block on the project file's name matches `state/directives/2026-10-08-round-69-rulings.md:16-17`;
  - OPEN-1 (a) and (b) match lines 11-15 of that file.

## Notes (no fix owed in this PR)

- N-1: Amendment 2 records R7 under class 5, which only narrows, although R7 adds work. Class 9 covers standing rules, not a ruling on a piece's own item. Its substance (shape, test, mutation, declared before the code) is met. This is a ledger finding at most, under the record cap.
- N-2: The reader refuses a version-1 Snapshot-column entry as Malformed or UnknownState, not as a later version. Decide at acceptance whether the Snapshot column becomes version 2.
- N-3: The reader's ceilings (8 locators, 4,096 bytes) are not in the ADR. For docs/14, the ADR should state them or delegate them at acceptance.
- N-4: For 1c, a re-linked copy almost always differs on `mtime`, so the changed-file notice should expect it.
- N-5: I did not read the PR body. Confirm that it shows the lock diff and names base B, the OPEN rulings, both consumers, the merge commit and D-1's rows.
- N-6: §7's command at H = a3f9f34f, as a two-point diff from c01f2e09, also counts the main changes merged into the branch. Count at 479ae81d or from the merge base.
