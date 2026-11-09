# shell: the resource_dir comments in publish.rs and commands.rs that say a `tauri dev` run supplies no resource directory, made to state what the code keys on at main — comments only, five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's checks has been seen says so in its first line. PLAN node shell-resource-dir-dev-comments, slot 2, placed by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 11). The five lines, the notes, the OPEN items, the reuse index, what is not settled and the files read are the architect's draft (`state/consults/2026-11-09-shell-resource-dir-dev-comments-form-architect-draft.md`, read only at main f703b720; extracted sha256 bf0918881961a6cb7e1ae25dc279298264ee6d2d6ae5e40de00925947edd4443), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ f703b720f9470dd8c6d114f5de488050ca63b4d9` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (30 pins; 1 by a file name that resolves to one tracked path at that commit; 2 by a file name that resolves to more than one, kept as written; bare line numbers kept as written, the draft's one `:9 @ <commit>` (the 2026-11-09 message's line 9) among them); this title and lead line added; the draft's opening lines (its draft line and its read note) dropped; the custodian's settlement added. Form path: `governance/forms/frontends/SHELL-RESOURCE-DIR-DEV-COMMENTS-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The five lines (mine)

```
Authority: PLAN node `shell-resource-dir-dev-comments` (governance/PLAN.yaml:5793-5809 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:80ba44a5dfe868059b9c02a2e77393e0385a1992872375701249edf1344c5be6), generation 1, budget 30 minutes, depends_on bundle-redaction-scan-not-in-product-publish (done); placed by the human in slot 2 as a five-line form (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:11 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:a8d065a9ea15b39fbb4257a92e8c53ae96ecac134576c17d07b2b27879a2cb72); routed by Amendment 9, item 3, of governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md, which routes item 4 (a) to (d) and (f) of state/consults/2026-10-23-walkthrough-row-f7-cli-refusal-gate2-words-reconciled-architect.md (a reading, not Authority; its replacement words are an architect's drafts, not the human's); the human's rulings on gate rounds, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a); OPEN items that are not red lines are taken under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md), held until 2026-11-16 by item 1 of the 2026-11-09 message (that file's :9 @ f703b720f9470dd8c6d114f5de488050ca63b4d9); gating per OPEN-C; the reuse index found no prior art on either search (tauri resource dir dev; stale code comments platform), a miss noted here.
Scope: 2 files, comment lines only: frontends/shell/src-tauri/src/publish.rs (`bundled_viewer`'s doc comment, from "— a plain `tauri dev`" at :1400 to "exactly as before." at :1402; `resolve_viewer_dir`'s suppression comment, :1508-1509; its remedy comment, from "`resource_dir`" at :1523 to :1526; the comment in `no_resource_directory_at_all_tries_only_the_dev_tree_path`, :1562-1563; the parenthetical in `no_resource_directory_at_all_and_no_dev_tree_path_gets_the_developer_remedy`, :1598-1599); frontends/shell/src-tauri/src/commands.rs (the parenthetical at :320, in the comment at :317-321 above the first `bundled_viewer` call); line numbers at f703b720f9470dd8c6d114f5de488050ca63b4d9; declared line budget 60, insertions plus deletions by §21c's counting, this form exempt; no other file or line; no code token, test name, assertion or string literal.
Change: the comments no longer say that a `tauri dev` run supplies no resource directory, that `resource_dir` being `Some` is the packaged-build signal, or that `None` means a `tauri dev` run; instead they state what the code keys on at the head: the candidate order, the refusal's dev-tree-value suppression and its remedy follow only whether the caller passes a resource directory, and `commands.rs` passes `None` only when `app.path().resource_dir()` returns an error.
Tests+mutation: none added or changed, so no mutation; a verify-mutation run is not an observation. Comment-only is shown at the head against base B (note 3) by: a Rust token-stream comparison of both files, with line, block and doc comments set aside and strings, chars and lifetimes kept as tokens, equal; every changed diff line a comment line; `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` exit 0; in the worker's worktree, `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --lib resolver_tests::no_resource_directory_at_all` (2 passed) and the crate's full `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`, each exit 0, inside `hold shared -Project SpatialIDE`. No e2e run (note 4). Each changed comment is checked clause by clause against the code at the head (Part 1, item 1).
Out-of-scope: ADR: none (no file under docs/); security: none (no exposure surface, dependency, hook, label or capability; the dev-tree path value's suppression keeps every token); wire: none (nothing under protocol/); guarantee: none (no property changes: every token of both files is unchanged, and the comments state the condition the code already keys on, which resolver_tests exercises); no string the app shows.
```

---

## Notes (mine)

**0. What a `tauri dev` run supplies on Windows, as the code and tests at main show it.**
- **The code does not decide it.** `commands.rs` passes `app.path().resource_dir().ok().as_deref()` at two sites:
  - frontends/shell/src-tauri/src/commands.rs:323 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:2e3a52e82deb5f5af7ffa1c7ab7fe8903a0f84657d485e15791a7ea4f4d688f0, in `binding_publish_prepare` (:284-285, no cfg);
  - frontends/shell/src-tauri/src/commands.rs:556 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:2e3a52e82deb5f5af7ffa1c7ab7fe8903a0f84657d485e15791a7ea4f4d688f0, in `binding_publish_prepare_e2e_destination`, which is `#[cfg(debug_assertions)]` (:535).
- **Nothing in `bundled_viewer` or `resolve_viewer_dir` depends on the build** (frontends/shell/src-tauri/src/publish.rs:1416-1536 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:297b8ce34042f9273073ba90bcc658832ff5443a1fb933ebf5f453f66b2c8628). They have no `cfg` and no runtime environment read. The dev-tree path is the compile-time `env!("CARGO_MANIFEST_DIR")` (:1476).
- **The tests inject `Some` or `None` directly** (:1539-1645, :3448, :3463). No test shows what tauri returns.
- **What tauri supplies is not in the repository's code.** It is recorded in three places:
  - the 2026-10-23 consult's item 4 (state/consults/2026-10-23-walkthrough-row-f7-cli-refusal-gate2-words-reconciled-architect.md:85-89 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:d746d45755bb7784fcfac777a26be6864439386c66555ce0ed70894041f8db5c), the architect's reading of tauri-utils 2.9.3 in the cargo registry, outside this repository;
  - Amendment 9 item 1 (governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:886 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:670bdfe1cc86ed1d25df87d0458e2b281fd03487e891c892e1d680abb99c5c30);
  - #241's (e) doc comment (frontends/shell/src-tauri/src/publish.rs:1434-1436 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:5658ddcd8861f57bae2a2b502e589b7ee3f5cc20bc3d581018140e42ccb53dae).
- Cargo.lock pins tauri-utils 2.9.3 (frontends/shell/src-tauri/Cargo.lock:4720-4721 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:cbb4b33f27ef246e227b9606ba621cc6aa946781e64e629b2d99d00ca1fee944).
- The brief names `resource_dir_from` "in publish.rs". It is not there: the only hit in the repository is the consult, which places it in tauri-utils.
- **macOS and Linux:** the repository records them only as unvalidated (consult :101 and :126; Amendment 9 item 1). My words below make no claim about any platform (OPEN-A).
- An untracked local listing exists: `frontends/shell/src-tauri/target/debug/bundle-viewer/` holds three files and no record. It is an untracked build output, not cited and not Authority.

**1. Each stale comment at main (settle 1).** I copied each block from the Read tool's output, not by script. The custodian copies or pins them by script before filing. The consult's spans were pinned at db3e8ec3. At main every span except (e) stands unchanged in content: publish.rs's lines have moved by +32 or +33, and commands.rs's have not moved.

**(e) is done, not in Scope.** `read_build_record`'s doc now carries (e)'s words (frontends/shell/src-tauri/src/publish.rs:1434-1436 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:5658ddcd8861f57bae2a2b502e589b7ee3f5cc20bc3d581018140e42ccb53dae). They were applied by #241 at 147ef82c (Amendment 10 item 1, BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:898 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:988adf453a7e351a65877b2c7b2d693d32766fdef70e0db87e670e7a68b4666e). They stay as landed.

**1a. `bundled_viewer`'s doc comment (consult (a)).** frontends/shell/src-tauri/src/publish.rs:1400-1402 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:2883d3b6790bf3349e877c87e13db7353863c294f5bfe05c8ce166280f374c14:
```
/// carries beside its executable, so a `tauri build` artifact can serve it — a plain `tauri dev`
/// run still resolves nothing under a resource directory (there isn't one), and falls through to
/// the dev-tree path exactly as before. Both paths are named in the refusal when neither holds.
```
- **Why it is untrue:** "resolves nothing under a resource directory (there isn't one)" is a claim about what tauri supplies, which this code does not decide (note 0). Amendment 9 item 1 records that on Windows a `tauri dev` run resolves the build-time copy.
- **My words** replace :1400-1402 (3 lines out, 4 in):
```
/// carries beside its executable, so a `tauri build` artifact can serve it. The order keys only
/// on what the caller passes, not on how the app was built: `bundle-viewer/` under the resource
/// directory the caller passes is tried first, and the dev-tree path when that is not a directory
/// or no resource directory is passed. Both paths are named in the refusal when neither holds.
```
- **Clause check:**
  - (i) "keys only on what the caller passes": the inputs are `resource_dir` and `exists` (publish.rs:1483-1486); `bundled_viewer` passes `|p| p.is_dir()` (:1419); the candidates come from `resource_dir` and the compile-time dev path (:1487-1491).
  - (ii) "not on how the app was built": there is no `cfg` in :1416-1536. The worker confirms this by grep at B.
  - (iii) "`bundle-viewer/` under the resource directory … is tried first": :1488-1489 push it first, and :1493-1497 return the first candidate that exists.
  - (iv) "the dev-tree path when that is not a directory or no resource directory is passed": :1491 always pushes it second; `exists` is `is_dir` (:1419); with `None` it is the only candidate (:1488).
  - (v) The last sentence is kept as it stands. See OPEN-B (ii).
- The retained text before "—" (:1396-1400) is unchanged.

**1b. `resolve_viewer_dir`'s suppression comment (consult (b)).** frontends/shell/src-tauri/src/publish.rs:1508-1509 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:2b7b2f70d261d498f867f9807a3e7d840e46f007d40cc059d5c4ed4aba790d72:
```
    // `resource_dir` being `Some` is exactly the packaged-build signal — a plain `tauri dev` run
    // never supplies one (`commands.rs`'s own call sites).
```
- **Why it is untrue:** `commands.rs` passes `Some` whenever `resource_dir()` returns `Ok`, in any build (note 0). "never supplies one" is tauri's behaviour, which the code does not decide, and on Windows it is false (Amendment 9 item 1).
- **My words** (2 out, 2 in):
```
    // The suppression keys on `resource_dir` being `Some`, which `commands.rs` passes whenever
    // `app.path().resource_dir()` returns `Ok` (its `.ok()`), however the app was built.
```
- **Clause check:**
  - (i) "keys on … `Some`": :1513 `resource_dir.is_some()`.
  - (ii) "passes whenever … returns `Ok` (its `.ok()`)": commands.rs:323 and :556.
  - (iii) "however the app was built": :323 sits in an uncfg'd command (:284-285). :556 exists only in debug builds (:535) and behaves the same there.
- :1499-1507 stay unchanged, including :1502's "fine for a `tauri dev` refusal read on that same machine". That clause is evaluative: it does not say that a dev run takes that branch.

**1c. The remedy comment (consult (c)).** frontends/shell/src-tauri/src/publish.rs:1521-1526 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:8152bf5ca65af3bd2913b4581a3b677dded0c9dcb18ed98afe4a2d4519bf9354:
```
    // **The remedy is packaged-context when a resource dir was supplied, developer-context only
    // when it was not (release-cut fix batch, reviewer nit).** `run \`npm run build\`` tells an
    // end user to run a build step nothing about their installed app can act on; `resource_dir`
    // being `Some` is the same packaged-build signal the dev-tree-value suppression above already
    // keys on. When `resource_dir` is `None` this is a `tauri dev` run from a checkout, where the
    // developer remedy is exactly the right one.
```
- **Why it is untrue:** "the same packaged-build signal", and "`None` … is a `tauri dev` run from a checkout" (note 0).
- **My words** replace :1523-1526 (4 out, 3 in); :1521-1522 are kept:
```
    // end user to run a build step nothing about their installed app can act on. The choice
    // keys on `resource_dir` alone, the same `Some` the suppression above keys on; `commands.rs`
    // passes `None` only when its `app.path().resource_dir()` call returned an error.
```
- **Clause check:**
  - (i) "keys on `resource_dir` alone": :1527.
  - (ii) "the same `Some` the suppression above keys on": :1513.
  - (iii) "passes `None` only when … returned an error": commands.rs:323 and :556, `.ok()`.

**1d. `commands.rs` (consult (d)).** frontends/shell/src-tauri/src/commands.rs:319-321 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:24c7a6d993bb7140c88b2cfe8db8b30c77d1dd02ca00cb2c6a2b1af6c1c021ca:
```
    // itself never crosses into `publish.rs`. `.ok()` rather than `?`: a `resource_dir()` failure
    // (e.g. under `tauri dev`, where nothing is packaged) is not this command's own error — it
    // just means `bundled_viewer` falls through to the dev-tree path, same as `None` would.
```
- **Why it is untrue:** the parenthetical gives a `tauri dev` run as an example of `resource_dir()` failing, and the code does not show that (note 0).
- **My words** replace :320-321 (2 out, 2 in); :319 is kept:
```
    // is not this command's own error — it just means `bundled_viewer` gets `None` and tries the
    // dev-tree path only.
```
- **Clause check:**
  - (i) "not this command's own error": `.ok()`, not `?` (:323).
  - (ii) "gets `None`": `.ok().as_deref()` (:323).
  - (iii) "tries the dev-tree path only": publish.rs:1488-1491.
- The second call's comment (commands.rs:554 @ f703b720f9470dd8c6d114f5de488050ca63b4d9) states only the order. It is true and stays.

**1e. The resolver tests (consult (f)).** The first is frontends/shell/src-tauri/src/publish.rs:1562-1563 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:b96001bffb84c304b16f85e834db90b533176140d2e84e0080a730920a830e00:
```
        // `tauri dev`: `app.path().resource_dir()` has nothing packaged-resource-shaped to
        // resolve, and the caller passes `None` rather than a directory that was never packaged.
```
- **My words** (2 out, 2 in):
```
        // `None`, as `commands.rs` passes when `app.path().resource_dir()` returns an error: the
        // dev-tree path is the only candidate.
```
- **Clause check:** commands.rs:323; publish.rs:1488-1491; the test's assertion at :1566.

The mirror is frontends/shell/src-tauri/src/publish.rs:1598-1600 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:f0805ca655b4758fdbc6b098adffbfa2933002ca391cc60aa308047898eb7cb2:
```
        // The mirror of the test above: `resource_dir` is `None` (a `tauri dev` run from a
        // checkout where the dev-tree path itself does not hold either) — the remedy stays
        // developer-context, since there is no installed app to tell an end user to reinstall.
```
- **My words, the parenthetical only** (the Scope as ruled; 3 out, 4 in):
```
        // The mirror of the test above: `resource_dir` is `None` (as `commands.rs` passes when
        // `app.path().resource_dir()` returns an error, and the dev-tree path does not hold the
        // viewer either) — the remedy stays developer-context, since there is no installed app to
        // tell an end user to reinstall.
```
- **Clause check:**
  - (i) commands.rs:323.
  - (ii) "the dev-tree path does not hold the viewer either": `|_| false` (:1601).
  - (iii) The kept tail is not mine (OPEN-B (i)).
- Every test name and assertion in both tests is unchanged.

**Cites in my words:** none carries a line. Each names a symbol (`commands.rs`, `.ok()`, `app.path().resource_dir()`), so there is nothing to pin, and `verify-cites` (which, as read at f703b720f9470dd8c6d114f5de488050ca63b4d9, scans comments in `*.rs`, scripts/plan/verify-cites.mjs:44) gains no reference. My words contain no code fence, no intra-doc link and no line opening with a list marker, so no doctest or Markdown list is introduced. Wrap is by hand at 100 columns or fewer; the worker re-wraps greedily at 100.

**2. The route (settle 2).**
- **Size:** 2 files. My words come to about 32 changed lines: 7 + 4 + 7 + 4 + 4 + 7, or about 34 with OPEN-B (a). These are counts of my words, not of a diff. Declared 60.
- **§21c** (governance/AUTONOMY.md:347-357 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31): all four bounds hold. There is no exposure surface, no dependency and no user-visible behaviour.
- **§21a** (governance/AUTONOMY.md:315-332 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3): none of the four categories is touched. On "any property currently under test": the resolver order, the suppression and the remedy keep every token. The comments state the condition those already key on.
- **§21b** (governance/AUTONOMY.md:334-345 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:09cdfc393a829fab7d4ceeaac847a7927225bb3580d694d5821abeb6d6730655): the single reviewer route is open.
- **§25 (e)** (governance/AUTONOMY.md:482 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669): it does not bite, because the Out-of-scope line asserts none of the four.
- **§36** (governance/AUTONOMY.md:687-696 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:55e91962a3ccb7ffd9a2f8d14709f233628e38da33909874f939732ed9c2ea60): it does not apply. This node is slot 2 by the human's placement, not on the filler queue.
- **The template's platform section** (docs/PREREGISTRATION-TEMPLATE.md:177 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0): it does not apply. No OS-dependent feature is added or changed.
- **Smallest true reading:** a five-line form, 2 files, about 32 lines, one reviewer. Scope is not trimmed.

**3. What shows nothing else changed (settle 3).** B is main at dispatch, and H is the head.
- **Where to work:** the worker works in a worktree under C:/dev/wt/, as #241's was (consult :7). The shell crate is excluded from the root workspace (Cargo.toml:19-29 @ f703b720f9470dd8c6d114f5de488050ca63b4d9).
- **The target folder:** the worktree uses its own `CARGO_TARGET_DIR`.

**Preconditions,** in the CI order (.github/workflows/product-ci-shell.yml:193-217 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:f1b290025cafb1cd1c7972d24203df90b934c5eb868786d7cae182bd9e7db756), each inside `hold shared -Project SpatialIDE`:
- `npm ci` and `npm run build` in renderer/bundle-viewer;
- `npm ci` and `npm run build` in frontends/shell.

The crate's build script copies the mapped resources: the viewer's `dist/*`, its record, and `../src/generated/NOTICE.txt` (frontends/shell/src-tauri/tauri.conf.json:40-44 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:84368d71b0f16add29ae8fe13fa51eec07e966f393735365aa111863acfcf248). `frontendDist` is `../dist` (:10). None of these steps uses port 5180 or `validate`.

**The checks:**
1. `git diff --name-only B...H` lists exactly the 2 files. Exit 0.
2. `git diff --numstat B...H`: insertions plus deletions are at most 60. Exit 0.
3. **Token equality.** A scratch Node script with a minimal Rust lexer, run over each file at B and at H, compares the non-comment token sequences.
   - Treated as comments: `//` to end of line, which covers `///` and `//!`; and nested `/* … */`, which covers `/** */`.
   - Treated as tokens:
     - string literals, with escapes;
     - raw strings `r#"…"#`;
     - byte strings;
     - char literals `'x'` and `'\…'`;
     - lifetimes (a `'` not closed as a char literal, e.g. `'static`);
     - everything else, whitespace-split.
   - A `//` inside a string is a token, not a comment.
   - Expected: both files equal, exit 0.
   - Negative self-tests first, each exit 1:
     - one identifier changed in a scratch copy;
     - one character changed inside a string literal holding `//` or ` — `, such as the remedy at :1528;
     - one `assert!` argument changed.
   - B against B: exit 0, with a token count above zero.
   - Equality also proves that no test name, `#[test]`, assertion or string changed.
4. **Comment lines.** Over `git diff -U0 B...H -- <2 files>`, every `+` or `-` content line must lie wholly inside a comment of its own side's file, by step 3's lexer (`+` against H, `-` against B). Exit 0. It is self-tested negative on a code line and on a `//` inside a string, each exit 1.
5. **Formatting:** `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never`, exit 0. This is .github/workflows/rust-fmt.yml:80 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:0c587174b3b0f6d948c6bd3b9f9b388e474438d60fe051ac8ea3ac3892370972. The brief's `cargo fmt --all -- --check` at the root checks the root workspace only (rust-fmt.yml:76), which excludes this crate. It may be run too, exit 0, but it does not read these files.
6. **Tests,** inside `hold shared -Project SpatialIDE`:
   - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --lib resolver_tests::no_resource_directory_at_all`: exit 0, 2 passed (the two named tests).
   - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: exit 0, the crate's full suite at H (Part 1, item 4).
7. **Records:** `node scripts/plan/verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`, `verify.mjs --offline`, and `node --test` over the scripts suites. Each exits 0, named with its commit.
8. **Bytes:** the added lines hold 0 CR bytes.

**The gate re-checks** steps 1 to 6 with its own scripts and its own negative self-tests, plus step 8. It checks each changed clause against H, and confirms that CI (Product CI — shell, Rust fmt) is green at H before the merge.

**4. No e2e run is needed.**
- Step 3 proves that the program at H is the program at B.
- No sentence claims a run's result.
- No string the app shows changes.

**5. What must not change (settle 4).**
- **publish.rs:** every line except the spans in Scope. That includes:
  - :1393-1399 and :1404-1415 (the rest of `bundled_viewer`'s doc);
  - (e) at :1434-1436;
  - `dev_tree_viewer_dir`'s doc (:1472-1474);
  - :1499-1507;
  - :1521-1522;
  - every string, including "(not applicable to a packaged installation)" (:1514) and both remedies (:1459-1462, :1528-1531);
  - every test and its name.
- **commands.rs:** every line except :320-321, including :317-319 up to "failure" and :554.
- **Elsewhere:**
  - tauri.conf.json and every other file;
  - frontends/shell/MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md (no matching sentence, by grep at f703b720f9470dd8c6d114f5de488050ca63b4d9);
  - the PLAN rows, which are the custodian's, on main;
  - every line the in-flight pieces claim.
- **Invalidators** (each stops the piece and goes to the custodian):
  - I-1: a finding no longer holds at B.
  - I-2: a fix needs a non-comment change.
  - I-3: an in-flight piece gains either path.
  - I-4: the crate fails to build or test at B for a cause outside these lines.
- **Block-on-sight:**
  1. A path outside the 2 files.
  2. A changed token.
  3. A clause untrue at H.
  4. A sentence stating what tauri supplies on any platform (OPEN-A (A)).
  5. An OPEN-B line edited without the human's word.
  6. A code fence or intra-doc link added.
  7. Any CI entry red.

**6. Rule (00)** (governance/AUTONOMY.md:609 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0), against the brief's lists:

| In flight | Overlap with the 2 files / protocol/ |
|---|---|
| `cut/port-2-macos-l1-and-app-dirs` | none |
| `cut/b2-piece-1c-save-and-reopen` | none |
| `cut/b1-shell-half-pr-c` | none |
| `cut/clippy-deny-warnings-workspace-12c` (kernel/tests/, 7 files) | none |

None touches protocol/, wire fixtures, Cargo.lock or package-lock.json. It is checked again at dispatch.

**7. Constitution check: no violation.**
- No principle of 01 is reached.
- ADR-006, docs/08 and docs/10 are not reached.
- The seam rule: the commands.rs → publish.rs seam the comments describe was read on both sides (commands.rs:323 and :556; publish.rs:1416-1536). No `pub` item, callback or option is added.
- Red-line text in Scope: none. The comments are worker-written (the release-cut fix batch) and are not the human's wording.

**8. Outside Scope, for the custodian, not added.** On a run where `resource_dir` is `Some` and the viewer is absent, the refusal shows "(not applicable to a packaged installation)" and the reinstall remedy whatever the build. That is a string the app shows (P6). Amendment 9 item 1 already records that the dev-remedy branches are not reached in ordinary Windows use and that no behaviour changes.

---

## OPEN items

**OPEN-A. Whether the new words state what tauri supplies.** Not a red line.
- **(A)** My words above. They state only what this code keys on and make no claim about any platform. Nothing outside the repository needs reading. (e)'s Windows sentence at publish.rs:1434-1436 stays as #241 landed it, and nothing in my words contradicts it.
- **(B)** The consult's item 4 words (a) to (d) and (f) (its :103-112). They add tauri-build's copy into the cargo output directory and "on Windows `resource_dir()` is the executable's directory". Those clauses are true by the consult's reading, but they rest on tauri-build 2.6.3 and tauri-utils 2.9.3 source outside the repository. The worker and the reviewer would each read it in the cargo registry at the versions Cargo.lock pins, and name them.
- **Recommend (A).** The brief binds the words to what the code at main shows. (A) also avoids a dependency claim that a tauri upgrade could falsify silently.

**OPEN-B. Two sibling clauses in comments the node names, outside the consult's spans. A red line by my reading** (a scope change to a ruled item, governance/AI_DEVELOPMENT.md:451-454 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821).
- **The clauses:**
  - (i) The mirror test's tail, "since there is no installed app to tell an end user to reinstall" (publish.rs:1600). With `None` coming from a failed `resource_dir()`, the code does not show that no installed app exists.
  - (ii) `bundled_viewer`'s "Both paths are named in the refusal when neither holds." (:1402). With `None` the refusal names the dev-tree path only: :1488-1491, and the test at :1601-1603 asserts that the packaged label is absent.
- **Options:**
  - **(a)** The human widens the node to them, at about +2 lines, still inside §21c. My words, then:
    - for (ii), the last sentence becomes `/// or no resource directory is passed. Every candidate tried is named in the refusal when none` / `/// holds.` (check: :1510-1520 map every candidate);
    - for (i), the mirror becomes `// The mirror of the test above: \`resource_dir\` is \`None\` (as \`commands.rs\` passes when` / `// \`app.path().resource_dir()\` returns an error) and the dev-tree path does not hold the` / `// viewer either — the remedy is the developer one, the \`else\` arm.` (check: :1530-1531; the test's asserts at :1603, :1605 and :1608).
  - **(b)** Excluded: listed here as known and outside the ruled Scope, and left unchanged.
- **Recommend:** a one-line question to the human today (Monday, a laptop day). The node is the first in slot 2 either way. Under Part 1, item 4, a disclosed unfixed sibling can send the piece back. Without an answer at dispatch, (b).

**OPEN-C. Gates.** Not a red line.
- **(A)** A single reviewer under §21b.
- **(B)** The reviewer and the architect from dispatch, because (b)'s paragraph explains a path-disclosure suppression.
- **Recommend (A).** No §21a category is touched. The suppression is none of ADR-020, ADR-009 or ADR-021's subjects, and its tokens are unchanged. The precedent is the stale-harness form's OPEN-1 (A).

**OPEN-D. Whose words land (Part 1, item 1).** Not a red line.
- **(A)** The form binds what each sentence must cover: note 1's clause lists for 1a to 1e. My words are a draft the worker may adopt after re-deriving at B. The gate checks whatever lands, clause by clause.
- **(B)** The form binds only what each sentence must cover.
- **Recommend (A).** The code is main's and is not rebuilt. The precedent is the stale-harness form's OPEN-4 (A).

---

## The reuse index (from the brief, byte for byte; the misses are noted in Authority)

```text
$ node tools/reuse.mjs tauri resource dir dev   (exit 1)
No prior art recorded for "tauri resource dir dev". Research it before planning an implementation.
$ node tools/reuse.mjs stale code comments platform   (exit 1)
No prior art recorded for "stale code comments platform". Research it before planning an implementation.
```

**Form path:** governance/forms/frontends/SHELL-RESOURCE-DIR-DEV-COMMENTS-PREREGISTRATION.md. The forms folder goes by the module the files sit in (governance/README.md:19 @ f703b720f9470dd8c6d114f5de488050ca63b4d9 sha256:016bc203ae0da1a764f6f0d1908c9e9ddb8b04d595d2f6497fd7625e67bdbd2c), and the template places it nowhere else.

---

## What I could not settle

- **sha256 and wrap.** No sha256 values, and no scripted wrap. The column counts are by hand.
- **Line counts.** About 32 to 34 is a count of my words, not of a diff.
- **tauri's own behaviour.** I did not read tauri-build or tauri-utils, which are outside the repository. Under OPEN-A (A) nothing depends on them; under (B) the worker and the reviewer read them.
- **Whether the Rust lexer covers every literal form in the two files.** The negative self-tests and the B-against-B run are its check.
- **OPEN-B** waits for the human.

## Files read (all at main f703b720f9470dd8c6d114f5de488050ca63b4d9, under C:/dev/spatial-ide)

- The brief.
- governance/PLAN.yaml (5774-5809).
- The 2026-11-09 directive (whole).
- state/consults/2026-10-23-walkthrough-row-f7-cli-refusal-gate2-words-reconciled-architect.md (whole).
- governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md (882-911).
- The 2026-11-05 Part 1 directive (whole).
- The 2026-10-31 directive (whole).
- frontends/shell/src-tauri/src/publish.rs (1390-1654, 3410-3494; greps).
- frontends/shell/src-tauri/src/commands.rs (260-334, 505-564; grep).
- frontends/shell/src-tauri/tauri.conf.json (whole).
- frontends/shell/src-tauri/Cargo.lock (grep).
- Cargo.toml (grep).
- .github/workflows/product-ci-shell.yml (186-235; grep).
- .github/workflows/rust-fmt.yml (72-81; grep).
- governance/RELEASE-0.1.md (386-397, 508-525).
- governance/forms/frontends/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md (grep).
- frontends/shell/src/config/tauriConfig.test.ts (grep).
- governance/forms/frontends/SHELL-COMMENTS-DRIFT-SWEEP-AREA-A-PREREGISTRATION.md (whole).
- governance/forms/frontends/STALE-HARNESS-COMMENTS-FIND-PRIME-AND-LATE-RESULT-PREREGISTRATION.md (whole).
- state/consults/gates/2026-11-08-stale-harness-comments-find-prime-and-late-result-gate1-reviewer.md (whole).
- docs/PREREGISTRATION-TEMPLATE.md (1-178).
- governance/AUTONOMY.md (306-377, 476-483, 605-610, 687-697).
- governance/AI_DEVELOPMENT.md (445-460).
- governance/README.md (grep).
- scripts/plan/verify-cites.mjs (grep).
- KNOWN-LIMITATIONS.md, MANUAL-WALKTHROUGH.md and e2e/README.md (grep).
- .git/HEAD and .git/refs/heads/main.
- A Glob of frontends/shell/src-tauri/target/ (untracked; not cited).

## The custodian's settlement (class 1, before any code)

- **OPEN-A (A), OPEN-C (A) and OPEN-D (A)**, each the draft's recommendation and none a red line, taken on 2026-11-09 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 9), for the human's review: the new words state only what the code keys on and nothing of what tauri supplies on any platform; a single reviewer under §21b; the form binds what each sentence must cover (note 1's clause lists), and the architect's words are a draft the worker may adopt after re-deriving at B.
- **OPEN-B**, a red line by the draft's reading (a scope change to a ruled item), is not taken. It was put to the human on 2026-11-09, a laptop day, in the custodian's closing message after the draft's hand-back. Until the human's typed word the ruled Scope stands, which is (b): the two clauses at publish.rs :1402 and :1600 stay unchanged, known and outside Scope, and block-on-sight 5 holds. If the human widens the node to (a), an amendment carries the human's words and the two spans: before the worker's dispatch, into its brief; after it, as a second commit on the piece's branch under a fresh brief, before the gate.
- **The Scope's spans, read:** the Scope line names commands.rs's parenthetical at :320 and the mirror test's parenthetical at :1598-1599; note 1's words replace commands.rs :320-321 and publish.rs :1598-1600, re-wrapping the sentence each parenthetical sits in. Both lie inside the 2026-10-23 consult's spans for (d) and (f) (commands.rs :319-321, and publish.rs :1523-1525 at db3e8ec3, which the custodian's script finds by content at :1598-1600 at f703b720). The Scope is read as the lines note 1 replaces, inside those spans; this reads the draft and widens nothing.
- **The copied text** is checked by the custodian's script at f703b720, and two of the draft's side claims are corrected, changing no span or word (the filing note of `state/consults/2026-11-09-shell-resource-dir-dev-comments-form-architect-draft.md`).
- **The custodian's brief errors**, both corrected by the draft: the brief placed `resource_dir_from` in publish.rs (it is tauri-utils', note 0), and it named `cargo fmt --all -- --check`, which reads only the root workspace, from which this crate is excluded (note 3, check 5).
- **The route:** slot 2, by the human's placement; a five-line form under §21c's size; the single reviewer (OPEN-C (A)). The preconditions' npm builds, every cargo call and `verify-quotes` run inside a shared hold. No e2e run (note 4); port 5180 and `validate` are not used.
- **The read commit and main:** `git diff --name-only f703b720 ea92b0fb` over the two Scope files lists none. Over the 15 files the pins name it lists 1: `governance/PLAN.yaml`, by the custodian's records only. The pins keep the read commit's lines. B is main at dispatch.
- **Rule (00)** at main ea92b0fb, `git diff --name-only origin/main...<branch>` against the two Scope files and protocol/: port-2 (`cut/port-2-macos-l1-and-app-dirs`): none; 1c (`cut/b2-piece-1c-save-and-reopen`): none; B1 shell half C (`cut/b1-shell-half-pr-c`): none; clippy 12c (`cut/clippy-deny-warnings-workspace-12c`): not yet pushed; its Scope is seven files under kernel/tests/. It is checked again at dispatch.

## Amendments (opens empty; append-only)
