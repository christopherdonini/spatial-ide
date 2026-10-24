*Custodian's filing note (2026-10-24): the full form's Amendment 1 for `covering-case-collision-binds-other-column`, drafted read only by lead-data at main e5e6e03a from the P0's report and outputs. The run 09:48:41Z to 09:54:56Z by its transcript (Read 10, Grep 5; no Write, Edit or Bash). Its Amendment 1 block is appended to the form in the commit that files it, its slots filled and its cites pinned by script, with one item added by the custodian (its could-not-settle item 3, K2's added column, read under OPEN-3). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is b35d462540486c964e6dc1044ec46acb33243c9caa30574baa1996ff77e4c30b.*

---

Drafted: covering-case-collision-binds-other-column, the full form's Amendment 1, at main e5e6e03a

````text
## Amendment 1 — the P0: S-yes, K2, G-yes, W1 at s4 and at g6, no STOP (class 1); written after the P0's result was seen

*Written after the P0's result was seen, before any code. References only: the P0 worker's report `state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-p0-worker-report.md` (sha256 from line 5 [custodian: …]); its outputs `state/drafts/covering-case-collision-full-form-p0/p0-output.txt` (sha256 [custodian: …]) and `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt` (sha256 [custodian: …]). Every line cite is at main e5e6e03a. Text in quotation marks is byte-copied; everything else, including the Displays in item 5, is lead-data's wording.*

1. **The run.** On unmodified main at 4f6a9b0f, the commit that adds this form (`state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-p0-worker-report.md:5 @ e5e6e03a`). It was one scratch test, with the rows in §3's table order (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:268-308 @ e5e6e03a`), run in one shared hold (`state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-p0-worker-report.md:116-119 @ e5e6e03a`). Its last line: "test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.72s" (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:245 @ e5e6e03a`). Afterwards the scratch file was deleted and the porcelain was empty (`state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-p0-worker-report.md:111-112 @ e5e6e03a`).
   - **One instrument differs from §3's words.** For geometry rows, the x range is the min and max of every Float64 leaf at or above 2,000,000 in the first streamed batch, not the first feature's range alone (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:213-235 @ e5e6e03a`).
   - Each column's x values lie within 10 m of its offset, and the offsets are 10,000 m apart (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:42-52 @ e5e6e03a`). So the minimum alone names A, B or C. That is my reading. No prediction is keyed to the first feature alone.

2. **Each row against its prediction.** No row and no prediction is edited.
   - **s1** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:6-27 @ e5e6e03a`): as predicted.
     - The root is `arrow_schema`, with `num_children` 4.
     - The top-level names are `id`, `geometry`, `BBOX` and `bbox`, and each struct has four children.
     - DESCRIBE has 4 names. The covering is kept, and the stream returns 0 rows.
   - **s2** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:28-45 @ e5e6e03a`): as predicted.
     - The children `xmin` and `XMIN` are unrenamed.
     - `bbox` has `num_children` 5, and DESCRIBE's struct has 5 fields.
   - **s3** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:46-64 @ e5e6e03a`): as predicted.
     - The resident children are `xmin`, `XMIN_1` and `XMIN_1_1`. They are read from DESCRIBE's struct type and the Arrow export, which agree, because the resident-names line prints only the top level (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:186 @ e5e6e03a`).
     - The covering is kept, and the stream returns 0 rows.
   - **s4** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:65-86 @ e5e6e03a`): not predicted (H-D). Recorded:
     - the writer wrote the file;
     - parquet_schema lists `bbox` twice, each with 4 children;
     - DESCRIBE names them `bbox` and `bbox_1`;
     - the open is Ok, the covering is kept, and the stream returns 10 rows.
   - **g1** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:87-113 @ e5e6e03a`): as predicted. The resident names are `bbox`, `BBOX_1` and `BBOX_1_1`. The covering is kept, and the stream returns 0 rows.
   - **g4** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:114-135 @ e5e6e03a`): as predicted. The resident names are `bbox` and `BBOX_1`. The covering is kept, and the stream returns 0 rows.
   - **g2** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:136-150 @ e5e6e03a`): as predicted. It opens, with resident names `geom`, `GEOM_1` and `GEOM_1_1`, and it streams B (min=2610000).
   - **g3** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:151-160 @ e5e6e03a`): as predicted.
     - Inside `Err(...)`, the Display is byte for byte the predicted text.
     - DESCRIBE reads `GEOMETRY` as `GEOMETRY_1`.
   - **g5** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:161-174 @ e5e6e03a`): as predicted. It opens, with resident names `geometry` and `GEOMETRY_1`, and it streams B.
   - **g6** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:175-188 @ e5e6e03a`): not predicted (H-D). Recorded:
     - the writer wrote the file;
     - parquet_schema lists `geometry` twice;
     - DESCRIBE names them `geometry` and `geometry_1`;
     - the open is Ok, and no covering is declared (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:283 @ e5e6e03a`);
     - it streams the first column, A (min=2600000).
   - **g7** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:189-198 @ e5e6e03a`): as predicted, with D4's text for `Geometry` under `source: `.
     - The open was refused, so no resident-names line was printed.
     - The predicted resident names `geometry` and `GEOMETRY_1` are shown by DESCRIBE, whose bound names the resident schema carries (§0, D2). That is a class-1 reading of the prediction's second half, not a reading of a resident schema.
   - **g8** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:199-208 @ e5e6e03a`): as predicted.
     - The parquet_schema name at the geometry position prints as `"geo\0m"`. It is printed with Debug escaping, the same way as the scratch's literal (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:286-293 @ e5e6e03a`).
     - The writer declares exactly that name as `geo.primary_column` (`engine/src/fixture.rs:1602-1603 @ e5e6e03a`).
     - The open is refused as `GeoMetadata`. Its Display contains `\u0000` and does not say "does not contain", which is what N-8 asserts (`engine/tests/b1_projection_hostile_names.rs:710-717 @ e5e6e03a`).
     - Byte equality is shown only by the equal Debug prints, not by a byte comparison in code (`state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-p0-worker-report.md:74 @ e5e6e03a`).
   - **k1** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:209-225 @ e5e6e03a`): not predicted. Recorded:
     - the root has `num_children` 3;
     - DESCRIBE adds `year` (`BIGINT`) last, and `id`, `geometry` and `bbox` keep their positions;
     - the open is Ok, the covering is kept, and the stream returns 10 rows.
   - **k0** (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:226-242 @ e5e6e03a`): as predicted. The root has `num_children` 3, and DESCRIBE has 3 names.

3. **The consequences, by §3.** Each is checked by lead-data against the output.
   - **S-yes.**
     - s1, s2, s3, g1 and k0 give unrenamed file names at both levels (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:8-20 @ e5e6e03a`, `:30-38`, `:48-57`, `:89-106`, `:228-235`; all at e5e6e03a).
     - Their root counts, 4, 3, 3, 5 and 3, equal DESCRIBE's counts. Each struct's `num_children` equals the field count of its DESCRIBE struct.
     - In all 14 rows, each root's `num_children` equals DESCRIBE's count, except k1, whose extra DESCRIBE name is the trailing `year`. Each struct's count equals its DESCRIBE struct's count. That check over the 14 rows is mine.
     - §2 stands. Neither S-no nor S-tree applies.
   - **K2** (k1, item 2). §2.2's root rule is the leading-N rule, and CC-6 is written (§4). Only one file under one `k=v` folder was measured (`state/consults/2026-10-24-covering-case-collision-binds-other-column-full-form-p0-worker-report.md:90 @ e5e6e03a`). K1 and K3 do not apply.
   - **G-yes** (g1 and s3, item 2). Clause (b) stands, CC-3 and CC-4 are written, and their Displays are in item 5. G-names and G-no do not apply.
   - **g4** is kept with 0 rows, so CC-5 stands.
   - **g2 and g3.** g2 streams B and g3 is as predicted, so G-1 and G-2 stand.
   - **g5** opens and streams B. G-4 stands, and §1 item 4's changed outcome is the one recorded.
   - **g7** is as predicted. G-7 stands, and its at-main refusal is the one §5 records.
   - **g8** is as predicted. N-8 stands unchanged under §2.3's lookup on the file's names.
   - **s4 (CC-8): W1.**
     - The writer wrote the file, and parquet_schema lists both byte-equal names.
     - The open is Ok. On my reading, that means it passed `check_geometry_column`, which runs on every open (§0, D1 step 3).
     - CC-8 stands.
   - **g6 (G-6): W1,** on the same reading. G-6 stands.
   - W2, W3 and W-tree do not apply to either row. No STOP.

4. **The at-main halves of §5's changed-outcome list.**
   - **CC-8's file (s4).** Opened. Covering kept. The first `bbox` was read: the true struct is written first (`state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:277 @ e5e6e03a`), and the stream over the true extent returned 10 rows (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:83-86 @ e5e6e03a`).
   - **G-6's file (g6).** Opened. No covering is declared. The first `geometry`, A, was read (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:184-188 @ e5e6e03a`).
   - Both join §5's "Opened at main, refused after" under its W1 condition.
   - **The other rows backing §5, all as §5 lists them** (item 2's ranges):
     - opened at main: CC-1's file (s1, opened, kept, 0 rows), CC-3's (g1), CC-4's (s3), G-2's (g2, B read) and G-4's (g5, B read);
     - refused at main as `engine.source` with D4's text: G-1's file (g3) and G-7's (g7);
     - CC-5's file (g4) opens at main with the covering kept and 0 rows;
     - CC-6's file (k1) opens at main with the covering kept and 10 rows.
   - CC-2's, CC-7's, CC-9's, G-3's and G-5's files are not P0 rows. Their at-main halves stay as §5 and §0 D8 read them.

5. **The whole Displays the tests assert** (§4: "finalised in the P0 amendment"). Each is composed by lead-data from the §2.6 text with the label shown, with the `geo metadata: ` prefix §2.6 names, and from the recorded names. Each holds for a test file written with the P0 row's names in the P0 row's order. The line after each label is the whole Display.

   ```text
   [CC-3, text (b)]
   geo metadata: the covering names `BBOX_1.xmin`, which the file's schema holds as `BBOX_1`, but that column is read under the name `BBOX_1_1`, so the declared name does not read it
   [CC-4, text (b)]
   geo metadata: the covering names `bbox.XMIN_1`, which the file's schema holds as `bbox.XMIN_1`, but that column is read under the name `bbox.XMIN_1_1`, so the declared name does not read it
   [CC-1, text (a)]
   geo metadata: the covering names `bbox.xmin`, which matches more than one name in the file's schema when ASCII letter case is ignored: `BBOX`, `bbox`
   [CC-2, text (a)]
   geo metadata: the covering names `bbox.xmin`, which matches more than one name in the file's schema when ASCII letter case is ignored: `bbox.xmin`, `bbox.XMIN`
   [CC-7, text (a)]
   geo metadata: the covering names `bbox.ymin`, which matches more than one name in the file's schema when ASCII letter case is ignored: `BBOX`, `bbox`
   [CC-8, text (a)]
   geo metadata: the covering names `bbox.xmin`, which matches more than one name in the file's schema when ASCII letter case is ignored: `bbox`, `bbox`
   [G-1, text (a-p)]
   geo metadata: `geo.primary_column` names `GEOMETRY`, which matches more than one name in the file's schema when ASCII letter case is ignored: `geometry`, `GEOMETRY`
   [G-2, text (g)]
   geo metadata: `geo.primary_column` names `GEOM_1`, which the file contains, but that column is read under the name `GEOM_1_1`, so the declared name does not read it
   [G-5, text (a-p)]
   geo metadata: `geo.primary_column` names `geometry`, which matches more than one name in the file's schema when ASCII letter case is ignored: `geometry`, `GEOMETRY`
   [G-6, text (a-p)]
   geo metadata: `geo.primary_column` names `geometry`, which matches more than one name in the file's schema when ASCII letter case is ignored: `geometry`, `geometry`
   [G-7, text (a-p)]
   geo metadata: `geo.primary_column` names `Geometry`, which matches more than one name in the file's schema when ASCII letter case is ignored: `geometry`, `GEOMETRY`
   ```

   **Sources.** The output prints no declared covering path, so those are cited from the scratch.
   - **CC-3.**
     - Declared path `BBOX_1.xmin`: `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:278 @ e5e6e03a`.
     - The file's `BBOX_1` is the root's fifth child: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:102 @ e5e6e03a`.
     - The resident name at that position is `BBOX_1_1`: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:111 @ e5e6e03a`.
   - **CC-4.**
     - Declared path `bbox.XMIN_1`: `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:276 @ e5e6e03a`.
     - The file's `XMIN_1` is `bbox`'s third child: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:51-54 @ e5e6e03a`.
     - The resident child at that position is `XMIN_1_1`: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:59 @ e5e6e03a`.
   - **CC-1.** Declared path: `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:274 @ e5e6e03a`. Matches: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:11 @ e5e6e03a` and `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:16 @ e5e6e03a`.
   - **CC-2.** Declared xmin path, as s2's: `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:275 @ e5e6e03a`. Matches: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:33-35 @ e5e6e03a`. CC-2's absent `bbox.zmax` is §4's, not a P0 row's. It comes after xmin in path order, so it does not change the text.
   - **CC-7.** Matches are s1's names (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:11 @ e5e6e03a`, `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:16 @ e5e6e03a`). The declared paths are §4's, not a P0 row's.
   - **CC-8.** Declared path: `state/drafts/covering-case-collision-full-form-p0/p0-scratch.rs.txt:277 @ e5e6e03a`. Matches: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:70 @ e5e6e03a` and `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:75 @ e5e6e03a`.
   - **G-1.** Declared: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:152 @ e5e6e03a`. Matches: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:155-156 @ e5e6e03a`.
   - **G-2.** Declared: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:137 @ e5e6e03a`. The file's `GEOM_1` is the root's fourth child: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:142 @ e5e6e03a`. The resident name there is `GEOM_1_1`: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:147 @ e5e6e03a`.
   - **G-5.** Not a P0 row. The match order is §4's. The same two names in that order are recorded for g3 (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:155-156 @ e5e6e03a`), where the twin is Binary, not Utf8.
   - **G-6.** Declared: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:176 @ e5e6e03a`. Matches: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:179-180 @ e5e6e03a`.
   - **G-7.** Declared: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:190 @ e5e6e03a`. Matches: `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:193-194 @ e5e6e03a`.
   - **G-3 and G-4** assert D4's text under `source: `, which §2.6 does not leave to the recorded names.
     - G-3's Display is the one at `state/drafts/covering-case-collision-full-form-p0/p0-output.txt:160 @ e5e6e03a`, inside its `Err(...)`.
     - G-4's is the same text with `GEOMETRY_1` as the name.
   - No row reaches (i-root), (i-struct) or (i-tree).

6. **What the result changes elsewhere,** as class-1 readings. No prediction, ruling or test outcome changes.
   - **§0.**
     - H-S holds.
     - H-K resolves as K2.
     - H-G is reproduced by g1, s3, g2 and g5.
     - H-D is answered by s4 and g6: byte-equal names are written, parquet_schema lists both, DESCRIBE reads the later one with `_1` added, and the open reaches the geometry check.
   - **§1.** No claim changes.
     - Item 1's "Two byte-equal names count as two" has a constructible file (s4), and so does item 4's byte-equal clause (g6).
     - Item 4's `GEOMETRY_1` sentence has its file (g5).
   - **§2.2.** Under K2, the root rule reads:
     - the file's n root children line up with the first n resident fields;
     - fewer than n resident fields is refused with (i-root), whose draft text stands;
     - any trailing resident fields are names the file does not hold.
     - The struct rule is unchanged.
   - **§2.6.** Item 5's Displays are the texts §4's tests assert. No template word changes.
   - **§4.**
     - Every test in the table is written, including CC-3, CC-4, CC-6, CC-8 and G-6.
     - The outcomes expected under MC8 ("gives `Ok`, kept") and MG7 ("gives `Ok`, streaming A") agree with s4's and g6's at-main outcomes (item 4).
     - The outcome expected under MKV, `InternalInconsistency`, agrees with k1's counts, 3 against 4.
     - Each mutation is still observed at the final code commit.
   - **§5.** Item 4 records it. The invalidators and the falsification list are unchanged.
   - **§7.** Nothing changes. Its ceilings and budget stand, and §7 is never edited.
   - **§11.**
     - The notes' assumption, "S-yes, G-yes, and K1 or K2", holds.
     - s3 shows the second rename inside a column, `XMIN_1_1`. g5 shows the `GEOMETRY_1` case. g6 makes "two columns both named `geometry`" a file that can be written.
     - Item 53's and item 9's words do not go back to the architect through this amendment.
     - In item 53's comment, "which the form's P0 is to show no ordinary file reaches" holds for every P0 row under item 3's count check.
   - **§3.** No row, prediction or consequence is edited.

7. **Next.** Code, by a worker-high on the branch `cut/covering-case-collision-binds-other-column`, which is at main e5e6e03a.
   - This amendment's commit meets §8 item 13.
   - The `engine/README.md` owner's-index commit follows #241's merge, as §10 records (OPEN-C).

Nothing above is edited.
````

**What I could not settle**

1. **Where the amendment goes.** The form's "## Amendments (opens empty; append-only)" heading comes before two later sections, the five-line form's closing amendment and the OPEN items. Whether Amendment 1 goes under that heading or at the end of the file is your call. My cites into the form are by section, so neither choice moves them.
2. **Two facts I could not check without a shell:**
   - that 4f6a9b0f is the commit that adds the form (I have the report's line 5 and the commit subject only);
   - that the branch head is at e5e6e03a (that is the brief's statement).
3. **A question, not blocking: a changed outcome that K2 brings and §5 does not list.** A column the folder adds (`year`) is not among the file's names.
   - After the change, a covering path naming such a column is dropped as absent, and a `geo.primary_column` naming it is refused as `engine.source`, by §1 items 3 and 4 as written.
   - At main, both are judged against the resident names, which include `year` (`state/drafts/covering-case-collision-full-form-p0/p0-output.txt:223 @ e5e6e03a`).
   - No row measured this and no test reaches it. Whether §5 lists it, or a test is wanted, is for you or the architect.
4. **K2 rests on one file with one `k=v` key.** Several keys, or a key spelled like one of the file's own columns, were not measured.
5. **§7's 660 ceiling.** Its derivation gives only the +150 for the OPEN-E tests, so §7 does not say whether 660 also counts CC-6, which is now written. If it overruns, that is class 8 as §7 says. I am not deciding it.
6. **g8's byte equality** rests only on equal Debug prints.
7. **G-5's Display order** follows §4's file, not a P0 row. CC-2's and CC-7's declared paths are §4's. The worker's writer has to reproduce each P0 row's names and order for item 5's Displays to hold.
8. **A machine-rules matter for you, not the form.** The worker's report lists one deviation from the call shape: an `export` placed before the hold. I did not record it in the amendment.

Result: Amendment 1 drafted (no STOP: S-yes, K2, G-yes, W1 at s4 and g6). It changes no prediction or ruling, and code by a worker-high comes next.
Blocking questions: none.
Report path: C:/dev/spatial-ide/state/consults/2026-10-24-covering-case-collision-binds-other-column-amendment-1-lead-data-draft.md. I did not write this file, as the brief said.
sha256: none; I wrote no file and have no shell.
