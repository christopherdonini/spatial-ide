Reviewed: PR #327 at 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a (the custodian's filing note, 2026-11-15: the architect, PLAN node b1-shell-half, milestone 4's PR B, one of its two gates from dispatch, under its form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, Amendment 24); dispatched at 2026-11-15T22:24:07Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (7412 bytes, sha256 4dcf500e2afbe091126d17d561d2e66c0079b905e8827429ef7205f7ad9a4152); the run 2026-11-15T22:24:12Z to 2026-11-15T22:38:10Z by its transcript, 115 calls (Read 64, Grep 47, Glob 3, SubagentHandback 1), 2 errored, model claude-opus-5-5; it writes nothing; its gaps in reading are its own list; the custodian re-read C1, C2 and C3 at the head and each holds; received at 2026-11-15T22:38:10Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 19109 bytes, sha256 34b4028727a4ea871c3442ecca8f3091c63a9745fc1676834d352f874201f3e4, with this note added in its first line), gate 1, architect
Verdict: FAIL
Branch and commit: cut/b1-shell-half-pr-b @ 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a. Main read at 6346c763.

**Gaps in my reads.** I did not read the items below, so no result is claimed for them:
- ADR-023 §11;
- the ruling files under `state/directives/`, except the first lines of the s1-fix-open-a-c message;
- Part 1 of the 2026-11-05 directive;
- item 2 of the 2026-10-11 directive;
- the 2026-11-14 stop report and the 2026-11-15 reports;
- the tests other than PB-U4, PB-U5, PB-U7, PB-U12, PB-E2 and PB-E4, and the PB-R1 mutation comment;
- stepRecorder.ts, viewTransitions.ts beyond its fillMatch lines, types.ts and package.json;
- the e2e README colour entry and `colour.mjs`'s header beyond lines 10–14;
- CI at H.

**Form sections read:** §1; §2.1 to §2.9, including §2.3 again and §2.5; §3's table tail; §4, including the PB rows at lines 516–528 and 2185; §5; §6; §7; §8 (lines 623–648, again); §9. Amendments 23 back to 12 (12 continued included) and Amendment 5, with Amendment 12 item 2's OPEN-C (b) at lines 1805–1806.

## Correctness (blocking)

**C1. §2.5's class C rows `style.colourBy` and `style.oneColour` were never built, and no amendment withdraws them.**
- The form requires them at line 327 of the form at main.
- There is no `recordNamed` call for either in `frontends/shell/src/style/StylePanel.tsx:182-215 at H`. A grep of `frontends/shell` at H finds neither name. `CLASS_C_ROWS` in `frontends/shell/src/console/surfaceRegistry.ts at H` lists `table.scopeSet` and `table.cancel` and neither of these.
- A Colour by that reuses the snapshot and applies nothing leaves no console row at all. That covers the not-applied lines (none, filter, cancelled, abandoned) at StylePanel.tsx:192-195 at H. This breaks docs/01 principle 4 ("Every GUI action has an API equivalent — and shows it"). It also breaks the registry's own rule, at surfaceRegistry.ts:184-186 at H, that an action recording nothing keeps a class C row.
- No PB row tests these rows (form lines 516–528).
- **Fix, either:**
  - (a) Add both rows, each with a P6 statement, to surfaceRegistry.ts. Record them at the action, before the outcome, in `applyColourBy` and `handleOneColour`. Add a test that fails if either row is dropped.
  - (b) An amendment and an advisor ruling withdraw them, and the not-applied path keeps a row of its own.

**C2. Colour by's Cancel can cancel the Table's own request.** This contradicts OPEN-C (b) at form line 1806 and the revised sentence of item 54. The path:
1. `waitForFirstScope` issues `start` (`frontends/shell/src/style/categoryCases.ts:59-62 at H`).
2. The Table is then shown in Filtered. Its effect calls `start` and supersedes the held handle (`frontends/shell/src/table/TableTab.tsx:63-67` and `tableSource.ts:116-122` @ 0d13561d, both unchanged by the PR).
3. Colour by's Cancel then runs `abandon`, which calls `source.cancel()` because `issuedHere` is true (categoryCases.ts:66-69 at H). That cancels whatever handle the source holds, which is now the Table's.

Ordinary use reaches this: a slow load, with the Style tab and Activity both open. The doc comment at categoryCases.ts:23 at H ("ends the stream when this wait issued it, and only then") is untrue in this case.
- **Fix, either:**
  - (a) Cancel only if the source still holds the wait's own run, for example a run id on `TableSnapshot`. That needs `tableSource.ts` and its test, which §2.6 lists only as conditional. A class 9 amendment comes before any code, and a test reproduces the supersede-then-Cancel order and fails without the guard.
  - (b) The advisor accepts the behaviour, and item 54 says so (draft C below).

**C3. The added last sentence of item 65 claims a limit the code does not keep.** This is the advisor's wording, not the human's, so it goes back to the advisor before the merge request (ADV-2026-11-15-20 item 2 (d)).
- The sentence: "A feature in a batch that holds no values of the chosen column draws as Other, whatever its value, until that batch is replaced (item 51)" (`KNOWN-LIMITATIONS.md:513 at H`).
- The style, and with it `fillMatch`, is kept on every later open:
  - `frontends/shell/src/workspace/workspaceState.ts:108-109` and `:151-156 at H`;
  - only StylePanel.tsx:137, 161, 196 and 211 and viewTransitions.ts:89-91 at H write `fillMatch`.
- Open another file while coloured by a column the new file does not project as Utf8, and `readColumn` returns null for every batch (`frontends/shell/src/attributes/values.ts:97-99 at H`). `rowGroups` then puts every row in the Other group. Replacement batches lack the column too, so "until that batch is replaced" is untrue.
- The worker's finding is incomplete. It names only the batches of item 51. On the shipped arm those are cleared by the refill whenever the column changes (App.tsx:2056-2061 at H), and a batch pushed past the limit after the apply keeps the column (`keepMatchColumn`, values.ts:82-88 at H).
- The same sentence in item 51 (KNOWN-LIMITATIONS.md:461 at H) and in AC12 (MANUAL-WALKTHROUGH.md:1995 at H) depends on this one. Drafts A, B and E are below.

## Evidence

None blocking. On flag 6:
- The observations of M-PB-E2 and M-PB-E2c at dfb96279 (`frontends/shell/e2e/colour.mjs:248-250` and `:273-275 at H`) and the cb3-r run took place only inside the 17:09:05Z–17:31:09Z window.
- cb3-r's pass is backed by cb3-u at U3, outside the window.
- The two mutations failed at their own assertions, and the messages give the wrong value. That is a fact about the value, not a timeout, so load cannot have produced it. ADV-2026-11-15-17 rules that the runs stand.
- These observations close when the reviewer re-applies the mutations at H.

## Documentation (must fix before the merge; worker's words; applied with no re-gate)

**D1.** The comment at `frontends/shell/src/App.tsx:2051-2052 at H` cites "section 2.3 (h)". §2.3 (h) is Recording (form line 263). The effect is OPEN-20 (a). Replacement words:
"// Milestone 4 PR B (OPEN-20 (a), the form's Amendment 16): when Colour by changes to a column other than the one the previous render coloured by (after One colour, that is none), while the status bar says attributes were not held, the first look is issued again under the active filter; `withinAttributeCeiling` then keeps that column. No step is recorded: the filter did not change."
Clause check:
- The dependencies are `[colourColumn]` (App.tsx:2062 at H).
- The comparison is with the previous render (2056-2059).
- After One colour, `fillMatch` is null (StylePanel.tsx:211), so `colourColumn` is null (2054).
- The not-held test is at 2059.
- `issueQueryRef(null, null, activeFilter)` is at 2060.
- The column is kept through `withinAttributes` passing the match column (WorkingCanvas.tsx:1080-1084 at H).
- No `stepQueue` call is made in the effect.

**D2.** The PR body (`<S>/pr-m4b-body.md`) does not name the format fix. Add to "What changes": "- The format fix (H, 6f7e744c): rustfmt applied to `renderer/tests/style_agreement.rs` alone, which `cargo fmt --check` failed at 0cf05452." Clause check: packet §1 and flag 8. The reviewer confirms by command that the diff is rustfmt's alone.

**D3.** A clause in item 66's comment (`KNOWN-LIMITATIONS.md:518 at H`) is untrue: "a space at the start or end of a name is shown as part of the single space beside it".
- The line is `Columns published: id, the geometry, and {}.` (publish.rs:327 at main).
- The shipped build gives at most one name, so that name is always last.
- A trailing space therefore sits between the name and the closing full stop, with no other space beside it.
- The rest holds:
  - `.publish-dialog-fields dd` sets only `margin-left` and `overflow-wrap` (`frontends/shell/src/styles.css:949-952 at H`);
  - there is no `.publish-dialog-columns` rule (grep at H);
  - default white-space collapses runs of whitespace;
  - the line is rendered as text (PublishDialog.tsx:264-265 at main).

Replacement words: "a space at the start of a name is shown as part of the single space before it, and a space at the end of a name shows as a space before the line's closing full stop". This is a record comment; its wording is the advisor's to approve with item 66.

## Observations

- **O1.** Colour by stays applied across opens; this is the behaviour behind C3. It is reachable:
  - the walkthrough's AC6 to AC12 run after AC5 leaves `zone` applied;
  - publish then derives an attribute the new file may lack.

  The advisor rules: either clear `fillMatch` on an admission of a different dataset (a code change by class 9 amendment), or record it (drafts A and G).
- **O2.** StylePanel's `column` is set only when it is created (StylePanel.tsx:95 at H). After the candidates change, Apply can be enabled with a column the chooser does not list, and the result is the "none" line. Whether the panel remounts on open was not read.
- **O3.** This gap predates PR B and is outside its diff:
  - The engine emits LargeUtf8 and Utf8View attribute columns unchanged (`engine/src/attributes.rs:81-83, 94 at H`).
  - The shell's decode refuses them (`frontends/shell/src/canvas/decodeBatch.ts:127-130`, `values.ts:34-35 at H`).
  - The chooser offers them (`renderer/style-ts/src/style.ts:45-47 at H`).
  - The doc at values.ts:33 at H ("one the engine emits … utf8") is narrower than the engine.

  It needs a PLAN node, not a fix in this PR.
- **O4.** §8 item 10 ("a table stream issued … while hidden"): Colour by issues the first-scope stream while the Table is hidden. That is by Amendment 12 item 4's design, as cited at categoryCases.ts:28 at H. I did not re-read whether Amendment 12 amends §8 item 10. The advisor should confirm that reading.
- **O5.** Item 54's "has completed" also has to cover phase `"stopped"` (the 64 MiB stop, tableSource.ts:224 at main), which is reused (categoryCases.ts:59 at H). Draft C uses "finished".

## Checks

1. **§8:**
   - 1 and 2: not verified by enumeration (no shell); the packet says nothing under protected paths, and the reviewer confirms.
   - 3: no new SKP field in what I read; types.ts not read.
   - 4: pass (rowGroups follows `rows`, values.ts:100-104; per-datum colour via `partToRow`).
   - 5: pass (text only).
   - 6: pass (`Style.groupFor`/`unmatchedGroup`; `admitsMatchKeyType` imported, StylePanel.tsx:7, 94).
   - 7: pass (document.ts:124-133 and 141-157 at H; the Legend renders `Style.legend`).
   - 8: unchanged.
   - 9: pass for the Legend's empty-text entry (P6).
   - 10: see O4.
   - 11: unchanged.
   - 12: pass (each Colour by or One colour is an `onCommit` `style.set`). "Undo" appears only in older negations (StylePanel.tsx:85, 218).
   - 13: pass. StylePanel's new props (`columns`, `source`, `filter`, `exportHeld`) are passed by App.tsx's StylePanel slot. Legend `{style}` is passed by StylePanel.tsx:326. The reveal entries are handled in StudioLayout.tsx:219-221 and 247-254.
   - 14: pass.
   - 15: pass for the strings read (StylePanel.tsx:52-61, 199, 302-321; Legend; actionRegistry.ts:85-86; App.tsx:826-833; the session-end texts). Not enumerated over the whole diff.
   - 16: pass ("unmeasured", values.ts:79).
   - 17: pass, see check 4.
   - 18: the class 8 records exist (Amendments 15, 18 and 21 item 6). The per-file count at H was not computed (no shell); the closing amendment records it by §7's command.
   - 19: pass. Item 59's comment states that only the numeral differs.
   - 20: none seen.
2. **ADR-023 §11:** not read. **ADR-010:**
   - rule 1 untouched;
   - rule 2 holds (`partToRow`);
   - rule 5: the per-batch WeakMap is derived, and its staleness is signalled by the revision trigger;
   - rule 6: the kept column's bytes have no bound of their own. This is declared in limits.ts:75-99 at H and in item 51, not discovered, so it is not a violation. It is bounded only indirectly, by the resident ceilings.
3. **ADR-006:** pass. Style is class 2: a `style.set` step, never called undoable. Table and projection are class 1; export class 3 is unchanged.
4. **Seams:**
   - PB-U7 drives the real shape. The kernel sends `f.data_type().to_string()` (kernel/src/skp.rs:2035 at main), and the Rust side asserts `ty.to_string() == spelled` (renderer/tests/style_agreement.rs:156-160 at H).
   - PB-U4 reads the shared vector (document.test.ts:184-190 at H).
   - PB-E2 runs through the app. A mutation in the product's PublishPanel `runPrepareWithDestination` failed it, and so did one in publish.rs (colour.mjs:248-275 at H).
   - PB-E4 reads the session history after stop (colour.mjs:320-365 at H).
   - All pass.
5. **§2.2 (g) and round 8:** not re-verified at H in this pass; nothing seen in the read files reopens them.
6. **Session end:** pass. The shell's lines do not say the file changed (HoverReadoutView.tsx:40-48 and FeatureTab.tsx:109-123 at H), which agrees with formatRefusal.ts:72-82. `sessionEndReasonOf` (App.tsx:673-676 at H) is OPEN-3 (a).
7. **§2.3:**
   - (a) pass (document.ts:57-72 at H);
   - (b) pass, the ADR-036 line included (StylePanel.tsx:84-85 at H);
   - (c) to (g) pass;
   - (h): stepRecorder not read; PB-E4's mutation was observed;
   - (i) pass.
   - ADV-2026-11-15-15's correction holds against deck.gl 9.3.9's accessor `equal` and `diffUpdateTriggers`, as read earlier. The PB-U12 and PB-U5 mutations dropped the one-colour trigger and failed (buildLayers.test.ts:739-744 at H).
   - PB-U1–3, U6, U8–U11, R1–R4: not read.
8. **Records:**
   - 54: incomplete (C2, O5; draft C).
   - 56: "a different column" (draft D).
   - 65: fails (C3).
   - 51: as for 65, plus "nothing else limits" (draft B).
   - 66: the item text holds; the comment fails (D3).
   - Item 4's Colour by sentence and item 59: hold. Only the "64"→"65" numeral differs from OPEN-A and OPEN-B, once each.
   - AC3: holds against StylePanel.tsx:52-61, 199 and 312-326 at H.
   - AC4: holds (handleOneColour 210-215; disabled at 320).
   - AC5: holds against PublishDialog.tsx:262-266 at main and publish.rs:327. I did not read the viewer's strings.
   - AC12: draft E.
   - F5: untrue in its location words; draft F.
   - G3: holds in its own steps, because G1's Fill colour edit clears `fillMatch` (StylePanel.tsx:161 at H), so publish.rs:324 applies.
9. **Discharges and quotes:** no verbatim quote in the PR body. The OBSERVED-AT claims name full commits; the reviewer re-applies them. D2.
10. **Comments:**
    - D1 and D3.
    - The module docs I read hold: document.ts:4-41, StylePanel.tsx:64-91, the categoryCases.ts:23 comment (except under C2), and limits.ts:75-99.
    - The recorded-mutation comments I read each name what was observed and the full commit.
    - Not checked against Part 1 (not read).
11. **Flags:**
    - 6: see Evidence.
    - 8: style_agreement.rs:110-170 at H reads as rustfmt output. Not diffed against 0cf05452; the reviewer confirms.
    - 9: not verified by diff; the reviewer confirms.
    - 11: see items 13 and 15 above.

## Drafts for the advisor (none of these is the human's wording)

**A. Item 65, replacing the added last sentence:**
"Colour by stays applied, with its column and categories, when another file is opened. A feature draws as Other, whatever its value, when its batch holds no values of the chosen column: every feature of a file opened while Colour by is applied that has no text column of that name among the columns the map reads (item 58), until you apply Colour by again, click One colour or change the Fill colour; and a feature in a batch held without its attribute values (item 51), until that batch is replaced."
Check:
- the style is kept at open (workspaceState.ts:108-109, 151-156 at H);
- `readColumn` is null when the column is lacking or not Utf8 (values.ts:97-99 at H), so the row is Other (rowGroups, matchGroups.ts at H);
- the three ways out are at StylePanel.tsx:196, 211 and 161 at H;
- not-held is null (values.ts:97 at H).

**B. Item 51:**
- (i) "nothing else limits its size" → "no limit of its own bounds its size" (limits.ts:75-99 at H).
- (ii) "A feature in a batch that holds no values of the column the map is coloured by draws as Other until that batch is replaced." → "A feature in a batch held without the column the map is coloured by draws as Other (item 65)." (as for A)
- (iii) "on a different column" → "on a column the map is not coloured by at that moment" (App.tsx:2056-2059 at H).

**C. Item 54, replacing the two sentences that begin "A request the Table made" and "A request Colour by made":**
"A request is cancelled, whichever of them made it, when an export starts and when the session ends, and, while the Table is shown with that scope, when the Table is hidden (another Activity tab is chosen, or Activity is closed), when another scope is chosen and when the filter changes; a Colour by waiting on a request that is cancelled or ended applies nothing. Colour by's Cancel cancels the request Colour by made, or the Table's, if the Table has asked again since; on a request Colour by only joined it cancels nothing but the wait."
Under C2 fix (a), the second sentence becomes "Colour by's Cancel cancels only a request Colour by made and the source still holds; …". Also, "has completed" → "has finished".
Check:
- an export start cancels the held handle (App.tsx:1172-1175 @ e0a4810d, as pinned in item 56's comment; tableSource.ts:167-177 @ 0d13561d);
- a session end ends it (tableSource.ts:178-190 @ e0a4810d);
- the Table's cleanup (TableTab.tsx:63-67 @ 0d13561d);
- not applied (categoryCases.ts:49-53 at H);
- Cancel (66-69 at H) after a supersede (tableSource.ts:116-122 @ 0d13561d);
- reuse covers `"stopped"` (categoryCases.ts:59 at H).

**D. Item 56:** "after a Colour by on a different column" → "after a Colour by on a column the map is not coloured by at that moment". Check: App.tsx:2056-2059 at H.

**E. AC12:** the step's "on a new column" → "on a column the map is not coloured by". The sentence "A feature in a batch that does not hold the column you chose is drawn as Other until its batch is replaced." → delete. After the refill, every batch keeps the column (WorkingCanvas.tsx:1080-1084 at H), so the sentence predicts nothing observable.

**F. F5:**
- "Read the text block at the bottom of the expanded panel." → "Read the text block at the bottom of the expanded **▾ Style** disclosure, above **Colour by**."
- "nothing about the panel's controls exists that this block does not already say" → "nothing the disclosure's controls or an applied Colour by set is missing from this block".
Check: the block is the disclosure's last element (StylePanel.tsx:297 at H) and Colour by follows it (300-327); the document holds the four values and the match (document.ts:162-172 at H). A column chosen but not applied is panel state (StylePanel.tsx:95), which the wording excludes.

**G. AC5 (from O1):** append to the step: "Then click **One colour**, so that the Parts that follow open files with one colour." Check: Colour by is kept across opens (workspaceState.ts:151-156 at H); One colour clears it (StylePanel.tsx:211 at H).