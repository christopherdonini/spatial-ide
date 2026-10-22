# MANUAL-WALKTHROUGH.md row F7: the hero round-trip points at Part G, with the CLI refusal line. Preregistration (full form)

File: `frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md`

**Authority.**
- **The node:** PLAN node `walkthrough-row-f7-cli-refusal`, `PLAN.yaml:4514-4530` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:5a09825ccd86e2db88ded3c57310c14b7f91035bf4c30ebcbb35fe74cf505640. Title at `PLAN.yaml:4515` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1ec802c4ddc67b734abcbdf8fe15f369e5a4d917949aa93c50d0e0eb1d337185, budget at `PLAN.yaml:4525` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1f6c68434d3bc13704cac29ca5440190294b565c66a9728ef1f5b052d9289734, summary at `PLAN.yaml:4529` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ef9c8704987e961eaa53b3133ce1f45252403b97458f4121b4032e8e2c1027aa.
- **The human's placement:** the F7 line of `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:9` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:114442faecc2e5fd801b925b4f49d41f52dc14de39d97e7cb6bf24b3aa60085e. It is referenced, not reproduced.
- **The source finding:** E1 of the architect's additions to the redaction form's Amendment 3, `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-amendment-3-cli-doc.md:86` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:00ebb7637e649b3b21086000de2b6995e7b1b67bf85802646da3a9f67567a147. Its section A checks W12 clause by clause (`state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-amendment-3-cli-doc.md:30-49` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:e3d10d70410da1c09eb71df3a4c4f43e2bacc108259ea163c6f0d4896e35e9e1).
- **The source form:** `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`, read at 4b26d279:
  - Amendment 3 item 6, the §1 bullet on the CLI (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:650` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:92b6d324332d9ebe44263d05edadfc88e1c27f958b36f130d79ec347735cd66d);
  - W12 (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:804-819` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:04f434e200b29cfbeceb0666f0c4a6f347b009d3cf3fd10b4364dbc435bb904e);
  - §8 item 19 (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:762` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:b61c94f18a50cf91f82d286d19882574d471babc9a4c202bfea9913dad7b7d79);
  - its operator line, which leaves walkthrough rows out of that piece (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:352` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ce9900aa40dbb4e96729e8c7cda7fcf514fe67558701e37aa4b258da846aff42);
  - Amendment 7 item 6, which puts row F7's placement before #241's merge (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:869` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:fcd393878059d28a155b5fb53ac2ff29322b208f8819dc5d64f59853c987e6a2).
- **The code that makes the old F7 untrue:** PR #241, branch `cut/bundle-redaction-scan` at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d (call it A). Named by item, no line (see the note above):
  - the W12 paragraph of `kernel/src/bin/publish-bundle.rs`'s module doc;
  - that file's single `ViewerAssets::from_dir` call and its `main`, which prints the error's `Display` after `[publish] ` and exits with failure;
  - the redaction gate in `kernel/src/publish/mod.rs`'s `run_inner` (`redaction::first_undeclared_findings` with `skip` set to `req.viewer.is_built_asset`, then `PublishError::RedactionFinding { file, .. }`);
  - `walk` and `first_undeclared_findings` in `kernel/src/bundle/redaction.rs`;
  - `ViewerAssets::is_built_asset` in `kernel/src/publish/viewer_assets.rs`;
  - `PublishError::RedactionFinding`'s `Display` in `kernel/src/publish/error.rs`;
  - `BoundaryError::Publish`'s pass-through `Display` in `kernel/src/permission/boundary.rs`;
  - `renderer/bundle-viewer/redaction-reviewed.json`.
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording blocks follow the 2026-10-11 direction, item 2, and `AUTONOMY.md` §31.

**Drafted by** the architect, on the custodian's brief, at main 4b26d279 (C), with the branch read at A. **These words are the architect's, not the human's.** No row this form touches is in the human's wording.

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating: full form and full gating** (`AUTONOMY.md` §21a, §25(e): `AUTONOMY.md:315-332` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3, `AUTONOMY.md:482` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
- By size the piece is under §21c (`AUTONOMY.md:347-357` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31): 2 lines, and at most 14 if every OPEN item is answered yes, in 1 non-generated file besides this form and PLAN.yaml.
- But the new row restates properties that are under test, which is §21a category 4 (`AUTONOMY.md:327` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:d80649bedfea2f8ac48948d94ca0d4b3f629fb1a5e3c407b5d01bae98e390a95):
  - the refusal at `viewer/NOTICE.txt` when no build record is given: the redaction form's T6 second half and U1 fifth case, on #241;
  - Part G's publish and serve through the shell: `e2e/publish.mjs`'s `APPROVED'` on main, and the redaction form's T8 on #241.
- A five-line `Out-of-scope` line would therefore have to name category 4. By §25(e), no five-line form is committed. The precedent is `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:23-27` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:bef3006f1c8f1c974d5c97d571a090dae9af54584ec7f5d3bdd97b189d7ef630.

**Reuse index (the standing step).** The output of `node tools/reuse.mjs <words>`, run in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, as the custodian's brief carried it, byte for byte. Both queries miss. The miss is noted and does not block.

```text
$ node tools/reuse.mjs walkthrough row cli refusal
No prior art recorded for "walkthrough row cli refusal". Research it before planning an implementation.
$ node tools/reuse.mjs manual walkthrough publish
No prior art recorded for "manual walkthrough publish". Research it before planning an implementation.
```

## §0. Disclosure

- **Inputs:**
  - the node and the human's F7 line;
  - E1 and section A of the additions;
  - the redaction form's Amendment 3 (items 3, 4, 6, 8 and 11, and W12) and Amendment 7;
  - the branch code named under Authority, at A;
  - the walkthrough's Parts F, G, H, M and R at C;
  - `MACOS-BRINGUP.md` §3 and §4 at C;
  - the forms and drafts named in §2.5.
- **The base.** B is the merge-base on main when the branch is cut. The worker re-reads every main cite at B.
  - A moved line is recorded as a class 3 row before code, and B's tree is authoritative for it.
  - A changed fact is an invalidator (§5).
- **Two trees.** The row's claim is about #241's code, which is not on main at C or at B. The gates read the new row against #241's head at the time of the gate, and name that commit. §4 item 4 re-reads the facts at #241's final head.
- **Pins are historical.** Every `path:line @ 4b26d279` here is a read at C. The custodian pins each one by script as `path:line @ <full id> sha256:<hex>`, contiguous on one line, at a commit on main. Branch facts carry no line and no hash. They are named with A's full id, and no span is pinned by hash at a branch commit.
- **Found beyond the node, marked (A):**
  - **(A1)** Part F's row F8 and the Part's intro still describe the hand-carried CLI round-trip (`frontends/shell/MANUAL-WALKTHROUGH.md:275` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:deab1178a25b52ccf0cddc40f37b758eb10a2f6dd8e093d9ecc77878479249b5, `frontends/shell/MANUAL-WALKTHROUGH.md:259` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3502944d9d6b27a75113d7007203e2e09c9b799d85206ca191b44bd1a71966a7). This is OPEN-1. F8's last sentence has been untrue since the publish cut: Part G's **Export interactive map…** exists.
  - **(A2)** Part G's row G7 calls its serve command Part F's F7 command, and contrasts itself with running `publish-bundle.exe` by hand (`frontends/shell/MANUAL-WALKTHROUGH.md:330` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ec2e1a4983a504f450e820d17306f61736447b6d8aeab55720e1baf395d0280e). This is OPEN-2.
  - **(A3)** `MACOS-BRINGUP.md:127-133` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:41b16afe88714343327ac34e533e79959fd426aa81e9883e63fd078d16527aaf translates F7's CLI step, and its caveat row `MACOS-BRINGUP.md:142` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3c1f285a5ebc906b08c02c535877fdcda63136b00bbac4422e5d3dbe7cf0b95f names Part F/G's Windows paths. The work is paused. This is OPEN-3.
  - **(A4)** After #241 the shell's dev-tree publish needs `renderer/bundle-viewer/viewer-asset-hashes.json`. Only `npm run build` in `renderer/bundle-viewer` writes it, at #241 or later. `npm run tauri dev` does not build the viewer: `frontends/shell/package.json`'s `dev` script is `vite`. A dev tree whose viewer was built before #241 is refused at Part G's publish with W8, whose remedy names that command. Part F's deviation paragraph covers only a missing `dist` (`frontends/shell/MANUAL-WALKTHROUGH.md:277-280` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:17abddbe416d41e0e0170ce9a719f09553e2c625ca70fdf355544879b396b1e4). This is OPEN-4. The CLI refusal does not cause it, but the new F7 sends the operator into it.
- No measurement and no fixture of this piece's own. The one run (§4 item 5) is an observation of a refusal, not a measurement.

## §1. What this preregistration may and may not claim

- **May claim:** at #241's merge and after, the new F7 row states what the dev tree's `publish-bundle` and Part G's rows do. Each clause is checked in §2.1.
- **May not claim:**
  - that the new row is true on main before #241 merges (§2.3 bounds that window);
  - the refusal's class, byte offset or match count. The row names the file only. With an ordinary login name, `NOTICE.txt` can also hold a `username` match earlier than the credential match, so the first class is not fixed;
  - that the shell's skip, the packaged app's record or R2 is proven here (those are #241's R1, R2 and T8);
  - any change to code, a test, an assertion or a string the app shows;
  - any edit to Part G, H, M or R, to `MACOS-BRINGUP.md` or to a KNOWN-LIMITATIONS item, unless an OPEN item is answered yes;
  - any performance figure.
- **ADRs cited, none amended:** 006 (publish is class 3), 017 §13 (the redaction scan).

## §2. The change

### 2.0 Rules

- **(a)** New text cites by item name (file, module doc, row). It never cites by a bare `path:line`.
- **(b)** No quotation marks in new text. In particular, the CLI's refusal message, a P6 placeholder, is not quoted. Existing quoted spans in any row touched stay byte-identical.
- **(c)** Each row stays one physical line. Only the span named in its row changes.
- **(d)** No backticked snake_case token with a test prefix is written in this form or in a row. #241's tests exist only on its branch, so they are named by the redaction form's labels (T6, U1, T8), never by function name. That way `verify-test-claims` sees no claim on main.
- **(e)** A walkthrough Part is a separate path under rule (00).

### 2.1 The row

**W-F7: Part F, row F7, the whole row** (`frontends/shell/MANUAL-WALKTHROUGH.md:274` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a8fcaaef76e76459ddbf2b17ab700aa21bdf53e373fd6237c819b71649829fcb).

- **As it stands:** the operator saves the style document by hand. They then run `publish-bundle.exe` with `--viewer` set to the reference viewer's own build, predict a summary "with no error", serve the bundle and compare it with the shell's canvas.
- **Why it will be untrue:** from #241's merge, that publish is refused at the redaction gate (W12; the additions' E1). The prediction of success becomes false, and the serve step then has no bundle to serve.
- **New row (the architect's words, not the human's), one line:**

  > | F7 | **The hero round-trip, through the shell.** Part G makes it: G1 sets a style as F2/F4 do, G2 to G5 publish it through **Export interactive map…** and its approval dialog, and G7 serves the bundle and compares it with that style. Run it there; this row has no command of its own. The command line cannot make this round-trip with the reference viewer's own build: a `publish-bundle.exe` publish with `--viewer` set to `renderer\bundle-viewer\dist` is refused by the redaction gate. That build's `NOTICE.txt` holds a credential match and a path match in its licence texts, and the command line takes no viewer build record, so the gate does not skip that file. The refusal names `viewer/NOTICE.txt`, unless a top-level bundle file (`build-info.json`, `manifest.json`, `style.json`) holds a match first; the module doc of `kernel/src/bin/publish-bundle.rs` says the same. | No outcome of its own: G7's expected outcome is this round-trip's, the same judgment — the polygons' fill colour, fill opacity and outline in the separately loaded bundle viewer visibly match the style set on the shell's canvas. |

- **Clause check:**
  - **"G1 sets a style as F2/F4 do":** G1 sets a distinctive style by Part F's F2/F4 (`frontends/shell/MANUAL-WALKTHROUGH.md:324` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1a441c0b2d28e0c5fa4a1a6eae8d0e7425ada86123201c6ac6c389645548e832).
  - **"G2 to G5 publish it through Export interactive map… and its approval dialog":**
    - G2 clicks the button and gets the save dialog (`frontends/shell/MANUAL-WALKTHROUGH.md:325` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f7cf995b3955deaabe2f73b4d085439870e260fd2bf9ee4cdf7654b02bb144b3).
    - G3 is the approval dialog.
    - G4 is a deliberate refusal.
    - G5 publishes, with **"Exported."** (`frontends/shell/MANUAL-WALKTHROUGH.md:328` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:887155890af671968305fea65fe24cadc5fa5d31be34df8bbed32f32f72efb95).
    - The sequence ends in a publish. True on main now, and after #241 through the skip, which is #241's R1 to prove.
  - **"G7 serves the bundle and compares it with that style":** G7 runs `serve-bundle.mjs` on G5's bundle and asks whether the style set in G1 visibly matches (`frontends/shell/MANUAL-WALKTHROUGH.md:330` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ec2e1a4983a504f450e820d17306f61736447b6d8aeab55720e1baf395d0280e).
  - **"this row has no command of its own":** true by construction.
  - **"a `publish-bundle.exe` publish with `--viewer` set to `renderer\bundle-viewer\dist` is refused by the redaction gate"** (at A):
    - `run_inner` calls `first_undeclared_findings` over the staged bundle before `staging.finalize`, and returns `PublishError::RedactionFinding` on a finding that is not operator-declared.
    - The CLI goes through `boundary::execute`.
    - `BoundaryError::Publish` displays the inner error unchanged.
    - `main` prints it after `[publish] ` and exits with `ExitCode::FAILURE`.
    - The redaction form's T6 second half proves the refusal through `boundary::execute`.
  - **"`NOTICE.txt` holds a credential match and a path match in its licence texts":**
    - These are the two reviewed `NOTICE.txt` rows (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:627-632` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:89c922b80cab6682c8472d7ccf49520f0a189aa41ae2a0880edb920ff06776fd; `renderer/bundle-viewer/redaction-reviewed.json` at A).
    - Item 4 keeps the licence texts unedited, with `NOTICE.txt`'s sha256 equal at B′ and H (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:641` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:37236bae95cfc3680250d9fe0995dcc7ab6415aba607f597ad1e1924e1d5095d).
    - O1 found both after the strip, as #241's node summary records.
    - `ATTRIBUTABLE_CLASSES` in `redaction.rs` at A excludes `credential` and `local-filesystem-path`, so neither is ever re-classed as declared.
    - "Holds" does not say "only" (§1).
  - **"the command line takes no viewer build record, so the gate does not skip that file":**
    - At A, `publish-bundle.rs`'s one viewer construction is `ViewerAssets::from_dir`, and `with_build_record` does not appear in the file.
    - With no record, `is_built_asset` is false.
    - The redaction form's U1 fifth case proves it.
    - That form's §8 item 19 blocks a record in the CLI (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:762` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:b61c94f18a50cf91f82d286d19882574d471babc9a4c202bfea9913dad7b7d79).
  - **"The refusal names `viewer/NOTICE.txt`, unless a top-level bundle file … holds a match first"** (`walk` at A):
    - It reads the root's files in sorted order and pushes its directories.
    - It pops the last-pushed directory first, so `viewer/` comes before `data/`.
    - In `viewer/`, `NOTICE.txt` sorts before the lowercase names.
    - With `first_only` it returns the first file that holds a finding that is not declared.
    - `RedactionFinding`'s `Display` names `{file}`.
    - A failure to remove staging (`StagingNotRemoved`) carries the inner error's text, so the file is still named.
  - **"the module doc of `kernel/src/bin/publish-bundle.rs` says the same":** the W12 paragraph at A, byte-equal to the form's W12 block (§4 item 4).
  - **Expected outcome cell:** G7's expected outcome (`frontends/shell/MANUAL-WALKTHROUGH.md:330` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ec2e1a4983a504f450e820d17306f61736447b6d8aeab55720e1baf395d0280e).
  - **Named, not blocking:** a login name or host name that appears in `manifest.json`, `style.json` or `build-info.json` outside a declared string is the "unless" case, and the row states it. A Ctrl+C during the publish is not ordinary use of the row, because the row runs no command.
  - **Who can reach the CLI:** the installer ships no CLI (`KNOWN-LIMITATIONS.md:135-137`, as the additions cite it). The walkthrough's dev checkout reaches it, so the row is judged as dev tooling that an operator does run.

### 2.2 In place

The row is edited in place. No Part is renumbered. No record under `state/` is edited. The Part F result log (`frontends/shell/MANUAL-WALKTHROUGH.md:1046` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:475cf3f20f19691c1427444e804e0519ad20a970158dd83d4e88b792a5199b68 onward) is history and is not touched.

### 2.3 The order with #241

- **The row is true only from #241's merge.** Before it, main's `publish-bundle` succeeds with the reference viewer (main's `kernel/src/publish/mod.rs` has no redaction gate at C).
- **Rule (the human's order: this piece lands before #241's merge):**
  1. The branch, the row, both gates and §4's items may run at any time. The gates read the row against #241's head and name that commit.
  2. This PR stays in draft until #241 has passed its gates and R2, and the human is at the click.
  3. **At that sitting, this PR is clicked first.** #241's final main merge, if it takes one, follows, and then #241's click. No other PR merges between the two clicks, and the custodian commits nothing to main between them (the freeze for final-merge PRs). This piece's done commit is held in scratch until after #241's click.
  4. **The window:** from this PR's click to #241's click, main's row states a refusal that main's CLI does not yet make. No Part F sitting runs in that window, because the human is the one at the machine. The PR body states the window.
- **If #241 does not merge at that sitting** (R2 fails, a gate reopens, or #241 is withdrawn): the custodian reports it to the human that day and opens a docs-only revert of this PR's merge, held for the human's click. This node returns to in-progress, and it lands again before #241's next merge. The human may instead choose to keep the row until #241 merges. Either way, the record says which.
- **If #241 changes before its merge:** §4 item 4 is re-run at #241's final head before this PR's click. A failed fact is an invalidator (§5). This PR is not clicked, the row is redrafted by amendment, and the gates re-check only the changed clause.

### 2.4 Not changed, recorded

- **Part F's deviation paragraph** (`frontends/shell/MANUAL-WALKTHROUGH.md:277-280` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:17abddbe416d41e0e0170ce9a719f09553e2c625ca70fdf355544879b396b1e4) is unchanged, unless OPEN-4 is answered yes. Its `cargo build` sentence must stay: Part R's prerequisite builds `publish-bundle.exe` "as Part F says" for R1(iv)'s `--audit-show` (`frontends/shell/MANUAL-WALKTHROUGH.md:1543` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4e46b9d5b2b5314a840f9d940597d5e826a70591c5df636a0f67cba7ee2e5a07), which the refusal does not touch.
- **The `e2e/style.mjs` coverage row for F7** (`frontends/shell/MANUAL-WALKTHROUGH.md:302` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:2a978827c2a97649509195d495aa018506b15683df356c850cfed141d56d641f) stays true: no e2e suite touches `publish-bundle`, the serve step or a pixel comparison.
- **Part H's H7 and Part M's M11** (`frontends/shell/MANUAL-WALKTHROUGH.md:452` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0a02c1eb829dd97569760230d4a409dd9564293fa19c7dff32ffc5d8e846b61d, `frontends/shell/MANUAL-WALKTHROUGH.md:883` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:9ef9a941bb75ae8d7499b8e7314d0731eeaa3ee65f44271734c7e764d5b098b7) call the serve command "Part F/G's". The G half stays true. Not edited (OPEN-2 notes them).
- **Parts H, M and R publish through the shell.** H9 and M9 run only `--audit-show`. The refusal makes none of them untrue.

### 2.5 Overlap (rule (00), `AUTONOMY.md:609` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0); walkthrough Parts count as separate paths

- **This piece's paths:**
  - P1: `frontends/shell/MANUAL-WALKTHROUGH.md` Part F (row F7; also F8, the intro and the deviation paragraph under OPEN-1 or OPEN-4 yes);
  - P2: the same file's Part G (row G7, under OPEN-2 yes only);
  - P3: this form;
  - P4: PLAN.yaml, with the generated `CUSTODIAN-QUEUE.*` and `site/`.
  - Nothing is under `protocol/`, `scripts/plan/` or `kernel/`, and no lockfile changes.
- **PR #241** (`bundle-redaction-scan-not-in-product-publish`, awaiting R2 and the click). Its paths are the 24 files of its Amendment 3 item 10 plus its form (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:5146d7174db5596663049c25f29edc95625d4c0ee2355561c87c617fc76cdc2f). It edits no walkthrough row (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:352` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ce9900aa40dbb4e96729e8c7cda7fcf514fe67558701e37aa4b258da846aff42). Disjoint. The only contact is the order in §2.3.
- **verify-quotes-round-item-cites** (governance, in progress). Its paths are `scripts/plan/**` and `.github/workflows/governance-ci.yml` (`scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md:284-292` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:27f41a2e38284171b33e012385f7288baa61e20904e3e61a3d78e7213ab6d354). Disjoint.
  - **Contact:** its S2 scans in-progress forms, so every round + item cite here must resolve. This form carries none: rulings are cited by directive file and line, and §25 by section.
  - If it merges mid-piece, §5 E2 names each tool's commit.
- **stale-assertion-messages-and-product-comments** (the docs lane, in progress). Its paths are four code and test files, its form and PLAN.yaml (`frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:214-221` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:54480ccbf5171a42eee95c250bb2c7ea05b9fdfbf045f44b9cf0682ed06a70a9). None is P1 or P2. Disjoint. P4's generated files are the custodian's.
- **Piece 1c's committed form.** Each step adds one walkthrough Part of its own (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:457` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:c8ba026acc49b1722052203a247d284dc65c09149b65c2d51facf36a79a7e297, `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:573` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a81cd7a6d9e04bcdfa34778a4ce6271fef9ebb32e7eed3f45033e17086238f0e). It edits neither Part F nor Part G. Disjoint. It touches `protocol/`, and this piece does not.
- **Milestone 4's draft** (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md`). It adds a new Part, and updates existing rows only where a location word changes, "none expected" (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:357` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:e6084dff0cb858396fc294f5149e48d01a899585e4397f657f39b5a88a10d2ce). It edits neither G nor N (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:388` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4ad3881c3b963d1f3135e6d534b055815ee7c7df3f2ac8373ec8807fe679d71a). Disjoint. If its final form moves a Part F or G location word, P1 or P2 is shared, and the later piece waits.
- **Rule (00) is re-checked at dispatch** against both slots, the docs lane, the governance lane and every PR awaiting merge.

### 2.6 Portability

No OS-dependent feature is added or changed. R3 does not apply. `MACOS-BRINGUP.md` is OPEN-3.

## §3. Fixtures

None of this piece's own. §4 item 5 reuses Part E's `filter-zoned.parquet`, read only.

## §4. Tests and evidence

- **No test is added, renamed or changed, so no mutation is owed.** No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Evidence, each by script with its exit code checked, and each search pattern self-tested positive at B:**
  1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` has exactly one hunk, which removes one line and adds one line, both starting `| F7 |`. Under OPEN items answered yes, it also has their hunks, each inside the span §11 names.
  2. **Text checks at H:**
     - `publish-bundle.exe --data` has zero matches in the file (one at B);
     - `viewer/NOTICE.txt` has exactly one match, in the F7 line (zero at B);
     - the F7 line names `kernel/src/bin/publish-bundle.rs`;
     - the `cargo build -p spatial-kernel --bin` sentence of Part F's deviation paragraph is byte-identical at B and H.
  3. Every line of the file other than F7's (and OPEN lines answered yes) is byte-identical between B and H.
  4. **At #241's head at gate time, and again at #241's final head before this PR's click:**
     - the W12 paragraph of `kernel/src/bin/publish-bundle.rs`'s module doc, with each `//! ` prefix removed, equals the redaction form's W12 block byte for byte;
     - `ViewerAssets::` appears in that file's code only as `from_dir`, and `with_build_record` has zero matches there;
     - `run_inner`'s gate still passes `is_built_asset` as `skip`;
     - `renderer/bundle-viewer/redaction-reviewed.json` still holds the two `NOTICE.txt` rows;
     - `git diff <B′>..<head> -- renderer/bundle-viewer/LICENSES` is empty.
     Each check is recorded with #241's commit id.
  5. **R-F7, one run by a tester at #241's head**, in #241's worktree after R1's viewer build (`npm run build` there writes `dist/` and the record):
     - **Command:** the old F7 command, with `--viewer` set to that worktree's `renderer\bundle-viewer\dist`. `--style` is a scratch file holding a style document of F5's shape with F6's default values. `--out` is a new scratch directory, with `--approve` set to its final component. `SPATIAL_IDE_AUDIT_LOG` points at a scratch file, so the operator's audit log is not touched.
     - **Build:** build `publish-bundle` there first if its binary is older than the head.
     - **Predicted:**
       - exit code 1;
       - stderr's last line begins `[publish] ` and names `` `viewer/NOTICE.txt` ``;
       - the `--out` directory is absent, with no `.<name>.staging-*` sibling;
       - the scratch audit log's last line is an outcome line carrying `"outcome":"refused"` and `"error_kind":"RedactionFinding"`.
     - No class or offset is predicted (§1).
     - Heavy, so the brief carries THE MACHINE paragraph as written (`state/directives/2026-10-06-machine-script-adopted.md:12-22` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1).
     - Recorded in this piece's PR body with #241's commit id.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:**
  - E1: §4 items 1 to 5 hold.
  - E2: `node scripts/plan/verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify.mjs` exit 0 at H and in the done commit, each named with the tool's commit.
  - E3: `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.
  - E4: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exits 0.
  - E5: PR CI is green.
- **Declared unchanged:**
  - every file but P1 to P4;
  - every row but F7, and the OPEN rows answered yes;
  - Parts H, M and R;
  - the deviation paragraph's `cargo build` sentence;
  - all code, tests and app strings;
  - `MACOS-BRINGUP.md`;
  - every record under `state/`.
- **Invalidators (stop and report):**
  - any §4 item 4 check fails at #241's head;
  - R-F7 is not as predicted;
  - #241 is withdrawn;
  - a new clause would need a code, test or string change;
  - a main cite's fact changed at B, as opposed to a moved line.
- **Falsified if** a clause of the new row is shown untrue at #241's merge commit in the dev tree.

## §6. Instruments

Assertions (§4 items 1 to 4, E1 to E5) and one observed refusal (§4 item 5). No measurement. The row itself is read at the next sitting with Parts F and G.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md`, insertions plus deletions. B and H are named in the PR body.
- **Ceilings:** 2 lines for F7 (1+1).
  - OPEN-1 yes: +4 (F8 1+1, the intro line 1+1).
  - OPEN-2 yes: +2 (G7 1+1).
  - OPEN-4 yes: +6 (the deviation paragraph, rewrapped, 3+3).
  - At most 14 in all.
- **Files:** `git diff --name-only B...H` lists at most this form, `frontends/shell/MANUAL-WALKTHROUGH.md`, PLAN.yaml and the generated `CUSTODIAN-QUEUE.*` and `site/` files. That is at most 3 non-generated files.
- **Budget:** 45 minutes, which includes R-F7. The node carries 30 (`PLAN.yaml:4525` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1f6c68434d3bc13704cac29ca5440190294b565c66a9728ef1f5b052d9289734), and the custodian sets 45 in the commit that marks it in progress. Past twice the budget, the node stops.
- **No constant is added.** An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A changed line other than F7's, or a span changed outside §2.1, unless an OPEN item answered yes covers it.
2. Any code, test, assertion or app-string change, or anything under `kernel/`, `renderer/`, `scripts/plan/` or `protocol/`.
3. A quotation in new text, the CLI's P6 message included, or a byte changed in an existing quoted span.
4. A new clause that claims more than its cite shows: the refusal's class, offset or count; the row true before #241's merge; the shell's skip, the record or R2 called proven here.
5. A new bare `path:line` in a row; a pin split across lines; a branch span pinned by hash at a branch commit, or named without its commit id.
6. An OPEN item applied before the human's answer.
7. This PR clicked before #241 is ready for its click; anything merged or committed to main between this PR's click and #241's; this node's done commit on main before #241's click (§2.3).
8. A §7 overrun not recorded as class 8, or §7 edited.
9. A scope addition not recorded as class 9 before its code.
10. A record that calls a `verify-mutation` run an observation of a mutation.
11. A record under `state/` edited.

## §9. Gates

- **Architect and reviewer, full gating.**
  - The architect checks each clause of §2.1 against #241's head and Part G at B, then §2.3's order, then §8 item by item.
  - The reviewer checks the diff, §4 items 1 to 5 by script and by the tester's record, and E1 to E5.
  - Each gate names the main commit and #241's commit it read.
- **Verdicts are proportional** (product-first, section 2). A clause's truth, including the refusal (a claimed limit), is Correctness. §4 and E1 to E5 are Evidence. Documentation findings are fixed before the merge, with no re-gate.
- **Wording (§31):** no row here is the human's wording. A gate's replacement words are applied with no re-gate and listed in the PR body.
- **Briefs:** the tester's R-F7 brief carries THE MACHINE paragraph as written. The worker's edit is one line, with no build.
- **Operator:** none for the piece. No KNOWN-LIMITATIONS item is added or edited.
- **The PR body asks for a merge commit** and states §2.3's window.

## §10. Amendments

Opens empty, append-only, classes 1 to 9. A yes to an OPEN item is class 9, recorded before its code, and a no is class 5.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | Part F's F8 and the intro's hand-carried CLI clause, made stale by the pointer (A1) | (b) yes, class 9 | no |
| OPEN-2 | Part G's G7, its two references to F7's command (A2) | (b) yes, class 9 | no |
| OPEN-3 | `MACOS-BRINGUP.md`'s translation of F7 (A3), paused | (a) no edit; noted for the resume | no |
| OPEN-4 | The viewer build record as a prerequisite of Part G's publish after #241 (A4) | (b) yes, class 9, in Part F's deviation paragraph | no |

---

## OPEN items, with options and my recommendation

None of these blocks dispatch: F7 alone matches the human's placement. A yes must reach the custodian before the gates, so that one gate round covers everything. If it comes after the gates, the added rows get a scoped check, and every yes must land before this PR's click.

**OPEN-1. Part F's F8 and intro** (`frontends/shell/MANUAL-WALKTHROUGH.md:275` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:deab1178a25b52ccf0cddc40f37b758eb10a2f6dd8e093d9ecc77878479249b5, `frontends/shell/MANUAL-WALKTHROUGH.md:259` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3502944d9d6b27a75113d7007203e2e09c9b799d85206ca191b44bd1a71966a7).
- **What is stale:**
  - F8 closes a browser tab and terminal "from F7", which the new F7 does not open.
  - F8's last sentence says the shell has no publish button and that the hand round-trip is the only path. That has been untrue since Part G.
  - The intro's line 259 says the style is carried by hand through the publish CLI.
- **Options:**
  - (a) a follow-up docs-lane node;
  - (b) class 9 into this piece (P1, same Part, +4 lines);
  - (c) leave it.
- **Words under (b)** (the architect's):
  - F8 becomes `| F8 | Return to the shell. | Nothing about the shell changed: the style panel still shows whatever F6's reset, or an edit after it, left it at. Publishing is Part G's **Export interactive map…** (F7). |`
    - Clause check: nothing in F7 runs. The panel state is F6's (`frontends/shell/MANUAL-WALKTHROUGH.md:273` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:fc1b56b2c955c4208beadec805224d3e1777831eeba363655e5efba51b145282). The button is G1's.
  - Line 259 becomes `carried to a bundle through Part G's rows (F7), and checked against a completely separate consumer` (98 columns).
    - Clause check: G1 to G5 publish and G7 checks. The rest of the sentence, and the quoted binding note on line 256-257, stay byte-identical.
- **Recommended: (b).** Otherwise F8 contradicts F7 in the same Part from the merge, and a gate would report it as a documentation finding to fix before the merge, which §8 item 1 would then forbid.

**OPEN-2. Part G's G7** (`frontends/shell/MANUAL-WALKTHROUGH.md:330` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ec2e1a4983a504f450e820d17306f61736447b6d8aeab55720e1baf395d0280e).
- **What is stale:** the parenthetical calls G7's command Part F's F7 command, and the expected outcome contrasts G7 with running `publish-bundle.exe` by hand. After this piece, F7 has no command and points at G7.
- **Options:** (a) follow-up node; (b) class 9 into this piece (P2, Part G; rule (00) finds no in-progress piece or awaiting PR touching Part G); (c) leave it.
- **Words under (b):**
  - The parenthetical becomes `(on a fresh port, so it does not collide with any other serve-bundle.mjs session still running)`.
  - The contrast clause becomes `the look-and-feel comparison Part F's F7 points to, reached by clicking **Export interactive map…** in the shell`.
  - Clause check: G7's command is complete in its own row, and F7 points at G7. The worker byte-copies the old spans from B for the masked diff.
- H7 and M11's "Part F/G's own command" stay true in their G half. I recommend no edit there: they are Parts H and M, two more paths.
- **Recommended: (b).**

**OPEN-3. `MACOS-BRINGUP.md`** (`MACOS-BRINGUP.md:127-133` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:41b16afe88714343327ac34e533e79959fd426aa81e9883e63fd078d16527aaf, `MACOS-BRINGUP.md:142` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3c1f285a5ebc906b08c02c535877fdcda63136b00bbac4422e5d3dbe7cf0b95f).
- **What is stale:** the paragraph translates an F7 CLI step that will no longer exist. On a Mac the same CLI publish is refused, because the needles and the walk do not depend on the platform. Its "the binary's behavior are unaffected" stays true as a platform statement.
- **Options:**
  - (a) no edit while the macOS work is paused, with the custodian noting it on the paused macOS node's summary for the resume;
  - (b) a docs-lane node now.
- **Recommended: (a).** The document is paused, and an edit now would be read by no one before the resume.

**OPEN-4. The viewer build record before Part G's publish** (A4).
- **What happens:** at the first sitting after #241, a dev tree whose `renderer/bundle-viewer` was built earlier has `dist/` but no `viewer-asset-hashes.json`. Part G's publish is then refused with W8 (`bundled_viewer` in `frontends/shell/src-tauri/src/publish.rs` at A, whose dev remedy names `npm run build` in `renderer/bundle-viewer`). Ordinary use reaches it, and the app's own message names the remedy.
- **Options:**
  - (a) none, relying on W8's remedy;
  - (b) class 9: the deviation paragraph's last clause (`frontends/shell/MANUAL-WALKTHROUGH.md:279-280` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:c7237b79b844ad69d9c42c5216a0131863639bdaea96ad143a76ba83ef52aa1c) becomes `if renderer/bundle-viewer/dist, or the viewer-asset-hashes.json beside it, does not exist, run npm run build from renderer/bundle-viewer first (the shell's publish refuses without that record)`, rewrapped, with the `cargo build` sentence unchanged;
  - (c) a Part G prerequisite line in a follow-up node.
- Clause check for (b), at A:
  - `scan-dist.mjs` writes the record beside `dist/` only after a passing scan;
  - `bundled_viewer` reads the record in the viewer directory's parent and returns W8 when it is missing;
  - the redaction form's T8 second half proves it.
- This sentence is true only from #241's merge, so it shares F7's order (§2.3).
- **Recommended: (b).** The new F7 sends the operator into Part G, so the prerequisite belongs with it.

## Amendment 1 — the row built; §4 item 4's licence path corrected (class 3); R-F7 as predicted (class 1); written after the results were seen

*Written by the custodian. References only: `state/consults/2026-10-22-walkthrough-row-f7-cli-refusal-worker-report.md`; `state/consults/2026-10-22-walkthrough-row-f7-cli-refusal-r-f7-tester-report.md`.*

1. **The row** is 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222 on `cut/walkthrough-row-f7-cli-refusal`, from B fd47e6cf101b7105a9257ced914351ff06032e90: §4 items 1 to 3 hold, and §7 counts 1 line removed and 1 added in the one file.
2. **§4 item 4's last check (class 3):** `renderer/bundle-viewer/LICENSES` does not exist; the licence texts are in the repository root's `LICENSES/`, as the redaction form's own clause names them. The check reads `git diff <B′>..<head> -- LICENSES renderer/bundle-viewer/notice.mjs renderer/bundle-viewer/portedNotices.mjs`; from B′ c7d02156d042c25f14d84c841ac89268ea5cec78 to 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d it is empty. Item 4's other checks hold at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d.
3. **R-F7 as predicted** at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d: exit code 1; stderr's last line begins `[publish] ` and names `viewer/NOTICE.txt`; no `--out` directory and no staging sibling; the audit log's last line an outcome line, refused, `RedactionFinding`.
4. **Next:** the PR, in draft until the sitting (§2.3), and both gates. OPEN-1 to OPEN-4 stay the human's.

Nothing above is edited.

## Amendment 2 — gate 1: both PASS WITH NOTES (class 1); written after the reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-22-walkthrough-row-f7-cli-refusal-gate1-architect.md` (gate-log 591); `state/consults/gates/2026-10-22-walkthrough-row-f7-cli-refusal-gate1-reviewer.md` (gate-log 592).*

1. **Both PASS WITH NOTES** at 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222, main 53e30138, #241 at 2fc01f59. No Correctness or Evidence finding.
2. **D1** (the architect's words, not the human's) is applied in the PR body: the two bullets on #241 not merging at the sitting, and on #241 changing before its merge.
3. **Next:** the PR stays in draft until the sitting (§2.3); there it is clicked first, then #241. This node's done commit is held until after #241's click. OPEN-1 to OPEN-4 stay the human's.

Nothing above is edited.

## Amendment 3 — the human's answers: OPEN-1 (b), OPEN-2 (b) and OPEN-4 (b) (class 9), OPEN-3 (a) (class 5); written after the gates' reports were seen and before the added rows' code

*Written by the custodian on the human's message. References only: `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md`, item 2; the OPEN items above, each option (b)'s words and clause check.*

1. **OPEN-1 (b), OPEN-2 (b) and OPEN-4 (b) join the piece (class 9):** the architect's words under each are applied byte for byte. In Part F (P1): row F8, and the span of the intro's line that OPEN-1 names; the deviation paragraph's last clause, rewrapped, its `cargo build` sentence unchanged. In Part G (P2): G7's parenthetical and its contrast clause. §7's ceilings for each yes bind, at most 14 lines in all, and §8 item 1's exception covers these rows.
2. **OPEN-3 (a):** `MACOS-BRINGUP.md` is not edited. The custodian's note is on `port-4-l2-smoke`'s summary, for the resume.
3. **Rule (00) for P1 and P2,** re-checked at this commit: no piece in progress and no PR awaiting merge edits Part F or Part G. Milestone 4's PR A adds only its own Part, after Part AB; #241, #242 and #243 edit no walkthrough line; piece 1c's branch has not edited the file.
4. **The scoped check:** the answers came after the gates, so both gates re-check only the added rows, at the head that carries them, against each option's clause check (the OPEN items' first paragraph). OPEN-4's clause is true only from #241's merge, so it shares F7's order (§2.3).
5. **Next:** the words by a worker on `cut/walkthrough-row-f7-cli-refusal` at 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222; the scoped check; the PR stays in draft until the sitting (§2.3), where it is clicked first. This node's done commit stays held until after #241's click.

Nothing above is edited.

## Amendment 4 — the three yes answers built (class 1); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-10-22-walkthrough-row-f7-cli-refusal-open-words-worker-report.md`.*

1. **The rows** are abc900f2b4706669bc4abbc35024b28a451a5e86 on `cut/walkthrough-row-f7-cli-refusal`, on 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222: OPEN-1 (b)'s F8 and intro line, OPEN-2 (b)'s two G7 spans and OPEN-4 (b)'s clause, each in the form's words, byte for byte. §4 items 1 to 3 hold at that head. §7 counts 13 lines in the one file (7 added, 6 removed), within 14: OPEN-4's old clause was two lines, so it counts 3 + 2.
2. **Disclosed:** OPEN-4's words carry no code spans where the old clause had three (`renderer/bundle-viewer/dist`, `npm run build`, `renderer/bundle-viewer`), as the form gives them. The scoped check reads it.
3. **Next:** both gates' scoped check of the added rows at abc900f2 (Amendment 3, item 4); the PR body names the head, the count and the words. The PR stays in draft until the sitting (§2.3).

Nothing above is edited.
