# root: CI installs one exact Rust version, 1.100.0, with the toolchain action pinned to its commit b725eda5, in the seven install steps under .github/workflows/ — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node ci-rust-toolchain-pin (S3), filler entry 16, placed by the advisor's ruling ADV-2026-11-13-10, item 1 (`state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-10-ci-rust-toolchain-pin-filler-16-after-pan-anchor-ahead-of-port-2-12e-q3-q4-open-8.md`), and put ahead of pan-anchor's harness fix by the advisor's ruling ADV-2026-11-13-17, item 6 (`state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-17-ci-rust-toolchain-pin-open-1-to-4-a-ahead-of-pan-anchor-release-artifacts-ran-once.md`), both under the human's delegation of 2026-11-13 and neither the human's words. The read note, the form path, the five lines, the notes, the OPEN items, what is not settled and the packet gaps are the architect's draft (`state/consults/2026-11-13-ci-rust-toolchain-pin-five-line-form-architect-draft.md`, read only at main 8f6d8639; its 43 pins filled by script at its filing), carried byte for byte with these changes, all the custodian's: this title and lead line added; the draft's filing note, its draft line and its Reviewed line dropped at the top, and its model line (claude-opus-5-5) at the end; in OPEN-1 (B), the sentence on release-artifacts' run history replaced by the fact that it has run once (ADV-2026-11-13-17, item 2 (c)); in N3, one sentence added before its last, that from the pin's merge on a tagged build takes the pinned toolchain through tauri-build.yml (item 2 (e)); the custodian's settlement added. By the read note, no text in it is a quotation unless it is marked byte-copied, and identifiers in backticks are names. Form path: `governance/forms/root/CI-RUST-TOOLCHAIN-PIN-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

Read note: nothing below is a quotation unless it is marked byte-copied. Identifiers in backticks are names. The YAML in N1 is proposed text, not quoted text. Statements about the toolchain action name its commit, b725eda5, by round 15 (c). Its file is cited as `action.yml:<line> @ b725eda5`, read in the custodian's copy of the action's `action.yml` at b725eda5 (7481 bytes, sha256 0b52547c145ae18d8631c9ab711e4d917e9e489cea800368f338c25a56e0aee2). That copy is evidence, not Authority. Statements about rustup name no commit and are marked as my reading.

## The form path

`governance/forms/root/CI-RUST-TOOLCHAIN-PIN-PREREGISTRATION.md`. By the forms index (governance/README.md:23 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978), `.github` is not one of the named folders, so a form about it goes under `root/`. The rustfmt workflow's form, governance/forms/root/WORKSPACE-RUSTFMT-PREREGISTRATION.md, is the precedent.

## The five lines

```
Authority: PLAN node `ci-rust-toolchain-pin` (governance/PLAN.yaml:7280-7296 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:d064fa662a3744b33f0bbd1c2d4db8dd8ef9af1bb4d00ae4b41229e7fb1d857d), filler entry 16, graded S3, placed by the advisor's ruling ADV-2026-11-13-10, item 1 (state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-10-ci-rust-toolchain-pin-filler-16-after-pan-anchor-ahead-of-port-2-12e-q3-q4-open-8.md:15 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:4f40acb67ab1ecd5976c59b47d1b274227ff73f3fc9a0279684315fd01828925), under the human's delegation of 2026-11-13; that ruling is not the human's words. What CI installs: the human's approval of ADV-2026-11-13-05 (state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:8 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:2a268ee2d4ea05e1157afb03f950df717e50f6e1980e6172791b3f50d053c8fb), its items 1 to 5 (state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:36-44 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:ca0ac7b19f2187c40c4845c908e82bd14cd4653e2bb95eb7f2c244a47c892f8c), the human's words by that approval. The version and the action's commit follow ADV-2026-11-13-10, item 4 (a) and (b) (state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-10-ci-rust-toolchain-pin-filler-16-after-pan-anchor-ahead-of-port-2-12e-q3-q4-open-8.md:27-28 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:8a7357238fff29b4ac9e85d42735d338923b45111c6ad663cfe768b079cb91ad). As the custodian read CI's job logs for this form's brief, Product CI — Rust workspace run 43473141005 on main at 6edbfa71d5b7f7f796589c3812c1abcc08957fc5 was green; its jobs 132049980781 (ubuntu-24.04) and 132049980979 (windows-latest) log the same rustc line, rustc 1.100.0, and each records the toolchain action at commit b725eda525362e7cf34af9a7243cac1e3f01a7ec. The piece goes ahead of port-2 by ADV-2026-11-13-10, item 2 (state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-10-ci-rust-toolchain-pin-filler-16-after-pan-anchor-ahead-of-port-2-12e-q3-q4-open-8.md:17-21 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:fe7478b603cb71528fbfd3fff2a57590fbc362b29e3c8d353c221d2dd0c8319d). Route: AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84). Reuse index: two misses (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form's brief). The search words, byte-copied from the brief's reuse output: "pin rust toolchain ci exact version" and "github action pinned by commit sha toolchain".
Scope: 7 files, one install step in each and nothing else (ADV-2026-11-13-10, item 5 (a)): .github/workflows/product-ci-rust.yml:205 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641; .github/workflows/product-ci-shell.yml:181 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641; .github/workflows/product-ci-viewer.yml:102 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641; .github/workflows/rust-fmt.yml:68-70 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:2a093d11a01a89fbf129e1ba2f353a383ca382b7b31d4d7d50158d990cf8ca04, whose `components: rustfmt` input stays; .github/workflows/tauri-build.yml:46 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641; .github/workflows/adr-003-spike-ci-linux.yml:71 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641; .github/workflows/adr-003-spike-ci-macos.yml:53 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641. Declared line budget 27 (20 insertions, 7 deletions) by §21c's counting rule (governance/AUTONOMY.md:357 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form is exempt. No other line of any workflow file changes: no header comment, trigger, path filter, matrix, cache key, `--locked`, timeout, concurrency or other action. release-artifacts.yml is not edited. There is no rust-toolchain or rust-toolchain.toml file, and no Cargo.toml, Cargo.lock or settings file is touched.
Change: in each of the seven steps, the action reference `dtolnay/rust-toolchain@stable` becomes `dtolnay/rust-toolchain@b725eda525362e7cf34af9a7243cac1e3f01a7ec`, and the step gains the input `toolchain: "1.100.0"` (N1). The observable change is in each job's toolchain step: it installs a toolchain named 1.100.0 and sets it as the default, where it used to follow the `stable` channel. The step's last sub-step is then named `rustc +1.100.0 --version --verbose`, where it was `rustc +stable --version --verbose`, and the action's code no longer follows the `stable` ref. The rustc line each job logs is predicted to stay the one main's run 43473141005 logs, so the pin changes no compiler (N3 proves this).
Tests+mutation: no test is added, changed or removed, so no mutation is owed. The evidence is the PR's own runs (N3). Every job of the seven workflows must be green and log the rustc line N3 names, recorded by run id, job id and head commit with that line. The gates' text checks (N4) check the diff and are not tests, and nothing in this piece is an observation of a mutation.
Out-of-scope: ADR: none (no status line, no amendment). Security: touched, namely what CI installs, under the human's directive state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md (its ADV-2026-11-13-05). The version and the action's commit are the ones main's run 43473141005 already used, and no other action is pinned or changed. Wire: none (nothing under protocol/). Guarantee: none. No workflow header is edited, and no header sentence names the toolchain's channel. No new dependency and no new action.
```

## Notes

**N1. The step's exact shape (brief item 2).** Six of the steps become:

```yaml
      - uses: dtolnay/rust-toolchain@b725eda525362e7cf34af9a7243cac1e3f01a7ec
        with:
          toolchain: "1.100.0"
```

rust-fmt.yml's step becomes:

```yaml
      - uses: dtolnay/rust-toolchain@b725eda525362e7cf34af9a7243cac1e3f01a7ec
        with:
          toolchain: "1.100.0"
          components: rustfmt
```

- **Indentation:** six spaces before the dash, as at every Scope line. The diff is 1 line out and 3 in for six files, and 1 out and 2 in for rust-fmt.yml: 27 in all.
- **The version is quoted.** A quoted YAML scalar is a string by construction. An unquoted `1.100.0` also resolves to a string under the YAML core schema, because it matches neither the int nor the float pattern (my reading of YAML, not checked against GitHub's parser). Quoting removes the reliance on that and matches the house style (`node-version: "24"`, product-ci-shell.yml:177 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:90575a09a6a12d0926c52ebdf5c1fb6af2ad15d78b55fae475f9c8c8f3485a41).
- **The version has three parts, never `1.100`** (N2).
- **`stable` does not appear in the line.** The commit is written alone; OPEN-2 gives the other option.

**N2. What the action at b725eda5 does with the input (ADV-2026-11-13-10, item 4 (b)).**
- **Default:** the `toolchain` input is optional and defaults to `stable` (action.yml:9-12 @ b725eda5).
- **Two-part input:** the parse step rewrites an input of the shape `1.<n>`, two parts only (anchored, action.yml:49 @ b725eda5), by date arithmetic (action.yml:50 @ b725eda5). At 2026-11-13 the release count it computes is 100. By my evaluation of that line, `1.1`, `1.10` and `1.100` all map to `1.100`. That is a minor-only pin, whose point releases still float.
- **Three-part input:** `1.100.0` matches none of the empty-input, `stable … ago` or `stable minus …` branches (action.yml:37-48 @ b725eda5), nor the two-part one. It takes the final branch, which writes the input to the step output unchanged (action.yml:51-54 @ b725eda5).
- **Install:** that name goes to `rustup toolchain install` with `--profile minimal` (action.yml:93 @ b725eda5) and to `rustup default`, which carries `continue-on-error: true` (action.yml:112-117 @ b725eda5). The last sub-step logs `rustc +<name> --version --verbose` (action.yml:169-170 @ b725eda5).
- **What the steps must give:** the three-part `1.100.0`. The action takes an exact version as its input, so item 4 (c)'s third stop does not fire.

**N3. Evidence (ADV-2026-11-13-10, item 5 (c)).** None of the seven workflows needs a path filter changed. Each is started on this PR's pull_request event, as follows:

| Workflow | What starts it on this PR | Jobs |
|---|---|---|
| product-ci-rust | its own file in its pull_request paths (.github/workflows/product-ci-rust.yml:178 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:6d7830cf15942cc4fdccecc23b38aa5ca41032351077306d3d572ab567a43e63) | the Windows and ubuntu-24.04 entries (.github/workflows/product-ci-rust.yml:194-197 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27) |
| product-ci-shell | its own file and tauri-build.yml in its pull_request paths (.github/workflows/product-ci-shell.yml:157-160 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:b20349300942b5da5d34b277e8c0b8748a558c675e3e1858995a2e1da2407dd5) | `shell`, and `tauri-build` |
| tauri-build | no trigger of its own: `workflow_call` only (.github/workflows/tauri-build.yml:15-16 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:378564106f2478b0d81ed1c8102c63c81af6843e0dc518d86bc2ea4fdeefdb94). It is started by product-ci-shell's `tauri-build` job (.github/workflows/product-ci-shell.yml:248-250 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:5c7f71fe8eef1e5827a18207fc16e78e1614b7b906d34927df6074d0e801d96f) | its `build` job |
| product-ci-viewer | its own file in its pull_request paths (.github/workflows/product-ci-viewer.yml:74 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:18a39f5435906531d2c104fbcf014810cbc492bfb789bb00efbbd65741d2e9fe) | `viewer` |
| rust-fmt | its own file in its pull_request paths (.github/workflows/rust-fmt.yml:47 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:c766ba9d5f94cde1391bc42f40d58e8663059a4b0b561da519109aa3065411b0) | `fmt` |
| adr-003-spike-ci-linux | its own file in its pull_request paths (.github/workflows/adr-003-spike-ci-linux.yml:41 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:985e4c8606a589edfd2c10aeedd2c7414c7489f14f4bc72cef6b81e8385553e7) | `validate` (ubuntu-latest) |
| adr-003-spike-ci-macos | its own file in its pull_request paths (.github/workflows/adr-003-spike-ci-macos.yml:41 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:b3eae43eda4a39c3d904aad2aadab9e83c3f01d5bdb85e20eda02a344eddf578) | `validate` (macos-latest) |

That is eight jobs. Each must:
1. conclude success;
2. log, as the first output line of its toolchain sub-step `rustc +1.100.0 --version --verbose`, `rustc 1.100.0 (0ef1bc386 2026-11-09)`. This line is byte-copied by the custodian from both jobs of run 43473141005 (the brief) and is compared byte for byte, the commit hash and date included;
3. record the toolchain action at commit b725eda525362e7cf34af9a7243cac1e3f01a7ec in its action-download line;
4. show its `rustup default 1.100.0` sub-step succeeded. That sub-step continues on error (action.yml:117 @ b725eda5), and the rustc line in point 2 names the toolchain explicitly (action.yml:170 @ b725eda5). So the rustc line alone proves the install, not that cargo then uses it. This point is needed for that.

rust-fmt's `cargo fmt --version` line (.github/workflows/rust-fmt.yml:72-73 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:cd1646ddfef1985e5e9046f17afa593f61dc86233e6e5ba1abd98d6f1c9e5b98) reads the default toolchain, so it is an independent check there. It is recorded, and if it names a commit other than 0ef1bc386, that is a stop (my reading of rustfmt's version line; unverified).

The push filters list the same files (.github/workflows/product-ci-rust.yml:150 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:6d7830cf15942cc4fdccecc23b38aa5ca41032351077306d3d572ab567a43e63, .github/workflows/product-ci-shell.yml:134-137 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:b20349300942b5da5d34b277e8c0b8748a558c675e3e1858995a2e1da2407dd5, .github/workflows/product-ci-viewer.yml:65 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:18a39f5435906531d2c104fbcf014810cbc492bfb789bb00efbbd65741d2e9fe, .github/workflows/rust-fmt.yml:38 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:c766ba9d5f94cde1391bc42f40d58e8663059a4b0b561da519109aa3065411b0, .github/workflows/adr-003-spike-ci-linux.yml:37 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:985e4c8606a589edfd2c10aeedd2c7414c7489f14f4bc72cef6b81e8385553e7, .github/workflows/adr-003-spike-ci-macos.yml:37 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:b3eae43eda4a39c3d904aad2aadab9e83c3f01d5bdb85e20eda02a344eddf578). So a push of the branch also starts runs at the head. They are recorded but are not the evidence of record.

**Not started by this PR:** release-artifacts.yml, which runs on `v*` tags and on dispatch (.github/workflows/release-artifacts.yml:37-41 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:85cd82b8392a23f68556abf3456bf399342755b8d373bb25adbc531d9c11d2e0). It is not one of the seven and has no install step of its own. Its `resolve` job installs nothing (.github/workflows/release-artifacts.yml:64-65 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:cb27498b238ee84da0569bcd4085930c87bf8d2d837239ea0a4d1dcb06528eef), and its build is tauri-build.yml (.github/workflows/release-artifacts.yml:95-102 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:26927c166388433e941a7db885cf938efff08d4d4adccf71f4f22e3e3967a356), which this PR runs through shell. From the pin's merge on, a tagged build takes the pinned toolchain through tauri-build.yml. Raised as OPEN-1.

**Locally:** nothing in this piece can be run on this machine as CI runs it. Only the text checks of N4 run locally. No workflow linter is added, since that would be a new tool. That GitHub parses the seven files is shown only by the PR's runs starting with their jobs.

**N4. What the gates check (ADV-2026-11-13-10, item 5 (d)).** Over `origin/main...HEAD` (three-dot):
1. The diff names the seven Scope files and nothing else: 20 insertions and 7 deletions, six files at 3 and 1, and rust-fmt.yml at 2 and 1.
2. Every deleted line is that file's `dtolnay/rust-toolchain@stable` line. Every added line is N1's shape at that step.
3. At the head, `.github/workflows/` holds exactly seven lines containing `dtolnay/rust-toolchain@`, each ending `@b725eda525362e7cf34af9a7243cac1e3f01a7ec`. It holds exactly seven `toolchain: "1.100.0"` lines, each the first input under the `with:` directly below one of those lines. No line contains `rust-toolchain@stable`.
4. rust-fmt.yml's `components: rustfmt` is unchanged.
5. The eight jobs of N3 meet points 1 to 4 of N3.

At 8f6d8639 the tree holds exactly seven `@stable` lines and no other `stable` or toolchain reference that names the channel; I checked this by a search of `.github/workflows/`.

**N5. The stops (ADV-2026-11-13-10, item 4 (c)).**
- **S1, before the PR opens.** The custodian lists, by GitHub's API, every run on main created after run 43473141005 of product-ci-rust, product-ci-shell, product-ci-viewer, rust-fmt and the two spike workflows, and any release-artifacts run in that window. From each completed job it reads the toolchain sub-step's rustc line.
  - If any line differs from `rustc 1.100.0 (0ef1bc386 2026-11-09)`, the piece stops: no PR opens, and the matter goes to the advisor. What is pinned instead is the human's (item 4 (c)).
  - Record: the PR body at opening lists, for each run, the workflow, run id, head commit, job ids and rustc line, or "no main run in the window" for a workflow. The closing amendment cites the same run ids, as references only (the record cap).
- **Item 4 (c)'s other two stops.** The two entries of run 43473141005 agree (the brief), and the action takes an exact version (N2). Neither fires.
- **S2, on the PR's runs.** Any job red, a rustc line other than N3's, a `rustup default` sub-step that failed, or another action commit: the PR stays in draft and the piece goes to the advisor (OPEN-4).
- **S3 (OPEN-3).** S1's read repeated at the advisor's merge check.
- **Dispatch base.** Scope's line numbers are pins at 8f6d8639. If the dispatch base moves them, the tree at the base is authoritative and the gates name that base.

**N6. Port-2 (ADV-2026-11-13-10, item 2 (d)).**
- **What this form records:** the version `1.100.0`, the expected line `rustc 1.100.0 (0ef1bc386 2026-11-09)` and the action's commit, in N3 and the Change line. Its closing amendment adds the pin's merge commit on main.
- **What port-2's record does when it takes main in** (at or after that merge commit): it names the line its macOS entry logs, by run id, job id and head. It resolves that line byte for byte against this form's N3, by a pin `governance/forms/root/CI-RUST-TOOLCHAIN-PIN-PREREGISTRATION.md:<line> @ <a main commit> sha256:<hex>` at a commit on main (round 15 (e)). If they are equal, item 2 (d) is met; if not, port-2 stops.
- **Port-2's own form:** it counts the toolchain action among what stays unchanged for the Windows and Linux entries (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:79 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:64729d62fbfc3312b21a53a4d644b65b102e958f9b6d19ae1b2f76dd89d1cf3c). After it takes main in, its diff against main still leaves the step alone. Its record should name the base it is read at, but that is port-2's matter and this form does not record it.
- **Textual conflict:** port-2 conflicts with the pin only if its hunk touches the lines next to :205. ADV-2026-11-13-10, item 2 (a) says it does not.

**N7. The gate and the budget.**
- **Gates:** the reviewer and the architect from dispatch (ADV-2026-11-13-10, item 5; AUTONOMY.md §36, governance/AUTONOMY.md:692 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84, which also sets §25 (e) aside).
- **Why two gates:** the Out-of-scope line names Security as touched, which under §21b alone would close the single-gate route. The route here is §36 with both gates, as ruled.
- **Budget:** the PLAN's 60 minutes (governance/PLAN.yaml:7291 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:9269a017dd1abf63dbe1f02f7fdc96be80b9d19e3258dccef5a0189a31e4a514). It rests on three parts:
  - the worker's 27-line edit with N4's text checks, about 15 minutes;
  - the custodian's S1 read and the eight PR jobs' logs, about 30 minutes;
  - the record, about 15 minutes.
- **Outside that budget:**
  - CI wall time. The longest recorded job is tauri-build's first green at 27m19s (.github/workflows/product-ci-shell.yml:102-104 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:4a833276ac8e4227db1ffd740d8bbe309b6ee6c5166ee5bd7c87a9a9bd45a4d5). The Rust workspace takes 5 to 7 minutes cached and 41 minutes cold (.github/workflows/product-ci-rust.yml:102-104 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:a051c541fbae4e79bfb94ad6d171b49f12e49b603b3e4e4832a2f8e473eeba47). Whether the cache stays warm under the new toolchain name is not settled.
  - The two gates.

**N8. Noted, not proposed.**
- **Clippy for 12e.** By action.yml:93 @ b725eda5, the pinned toolchain is installed with the minimal profile. By my reading of rustup, that profile carries no clippy, and `1.100.0` is a toolchain separate from the image's `stable`. So ADV-2026-11-13-05, item 6's second clause (request the clippy component) is likely to apply to 12e. rust-fmt already requests rustfmt.
- **The timing of 1.100.0.** By action.yml:50 @ b725eda5's arithmetic, 1.100 is the release of 2026-11-12. A point release in the window before the PR opens would trigger S1.

## OPEN items

- **OPEN-1. release-artifacts.yml is not started by this PR.** Recommendation: (A). Neither option is a reserved matter by my reading of item 4 (c) as ADV-2026-11-13-05 names it (state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:32 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:a11881418f6ba3130114550baa46fb28bcc1ab0cc17847dd80d7f7352774654f). (B) may touch the release red line. The advisor rules this before any code (item 5 (c)).
  - (A) Recorded as covered. It has no install step of its own, and its build is tauri-build.yml, run on this PR at the same head through shell's `tauri-build` job.
  - (B) A `workflow_dispatch` of release-artifacts on the branch. It has run once: run 34833992340, a `workflow_dispatch` on main at 23873935 on 2026-09-14, which succeeded. Its header slot (.github/workflows/release-artifacts.yml:34-35 @ 8f6d863901734f86c5fc00d2bf9d313fa40fe4bd sha256:fa27d32cb02c98f1d9cb8ddf1c1dd420c2e06cb208649ca751a566f5b51524e8) would then go stale, and item 5 (b) forbids editing a header.
- **OPEN-2. Does the line show `stable` as well as the commit?** Recommendation: (A). Not reserved. The line count is the same either way.
  - (A) The commit alone; this form records where the commit was taken from.
  - (B) A trailing `# stable` comment. That names a moving ref beside a fixed commit, so once `stable` moves on, the comment reads as current (round 14's historical-pin rule).
- **OPEN-3. Extend S1's read to the advisor's merge check.** Recommendation: (A), because a merge after main has moved would change main's compiler, against ADV-2026-11-13-05, item 2. The check itself is not reserved; what is pinned on a mismatch is reserved (item 4 (c)).
  - (A) Yes: a main run logging another version between the PR opening and the merge stops the merge.
  - (B) No, as item 4 (c) has it.
- **OPEN-4. A PR job red for a cause other than the install step,** for example a spike workflow meeting 1.100.0 for the first time. Recommendation: (A). The stop is not reserved; a fix that changes what CI installs would be.
  - (A) The piece stops in draft and goes to the advisor, and a follow-up node takes the cause. Nothing is widened, since ADV-2026-11-13-05, item 3 fixes the scope.
  - (B) Widen this piece. Ruled out by that item.

## What is not settled

- Whether `rustup default 1.100.0` succeeds on every image. Only the PR's runs show it (N3, point 4).
- Whether rust-cache@v2's key changes with the toolchain's name (N7).
- Whether the two spike workflows and the viewer are green on 1.100.0 (OPEN-4).

## Packet gaps

- Each of the other six workflows' last main run: its conclusion and rustc line.
- Whether the action's `stable` is a branch or a tag.
- rustup's version on each image, and its log text when the default is set.
- Whether rust-cache@v2 keys on the toolchain's name.
- The grant's item 4 text. I relied on ADV-2026-11-13-05's own statement of item 4 (c).
- Branches and PRs in flight that touch the other six workflow files (rule (00)).
- Which of the seven workflows' checks are required for merge.
- Where port-2's profile-step hunk sits relative to product-ci-rust.yml:205.

## The custodian's settlement (class 1, before any code)

- **OPEN-1 (A), OPEN-2 (A), OPEN-3 (A) and OPEN-4 (A)**, each the draft's recommendation, by the advisor's ruling ADV-2026-11-13-17, items 2 to 5 (`state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-17-ci-rust-toolchain-pin-open-1-to-4-a-ahead-of-pan-anchor-release-artifacts-ran-once.md`), under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`), item 2: the advisor's rulings, not the human's words. As the custodian reads them (a paraphrase; the ruling is the record):
  - **OPEN-1 (A).** release-artifacts.yml is recorded as not run by this piece and as covered through tauri-build.yml, which runs at the PR's head through product-ci-shell's `tauri-build` job on the same runner label. No dispatch of release-artifacts is made for this piece; the evidence is the PR's own runs (items 2 (a) and (b)). Its header's dry-run slot (its lines 34 and 35) is not this piece's (item 2 (d)); whether the slot owes a record of that workflow's one run is the custodian's to look at, outside this form.
  - **OPEN-2 (A).** Each step's line names the action's commit alone, with no comment; the `toolchain` input below it says what is installed (item 3).
  - **OPEN-3 (A).** S1's read is made before the PR opens and repeated when the custodian sends the merge-check request. That request lists, for each workflow S1 names, every main run in the window with its run id, head commit, job ids and rustc line, or says that the workflow had no main run in the window; the advisor reads the same again at the check (items 4 (a) and (b)). A main run between run 43473141005 and the merge that logs another rustc line makes the verdict HOLD, and what is pinned instead is the human's (item 4 (c)). A workflow with no main run in the window is not a stop (item 4 (d)).
  - **OPEN-4 (A).** A red job of the PR stops the piece in draft, and it goes to the advisor with the run, the job, the failing step and the cause (item 5). A cause other than the install step gets a follow-up node from the advisor, and this piece is not widened; the pin does not merge while a Rust job of its PR is red (item 5 (a)). A cause in the install step holds the same stop, and what CI installs instead is the human's (item 5 (b)). The case is live: the two spike workflows last ran on main on 2026-09-09, and product-ci-viewer on 2026-11-04 (item 5 (c)).
- **The two changes to the draft's text**, by the same ruling: OPEN-1 (B)'s sentence on release-artifacts' run history is replaced by the fact (item 2 (c)), which GitHub's run list, read by the custodian at this commit (2026-11-13T19:51:01Z), shows as that workflow's only run; N3 gains the sentence item 2 (e) asks for, before its last.
- **The order.** Pan-anchor's harness fix (`pan-anchor-setcam-waits-for-its-own-reset`) has not been dispatched at this commit, so this piece takes the filler slot first, and pan-anchor's fix follows it under the filler rule (ADV-2026-11-13-17, item 6 (a) and (c)). That changes ADV-2026-11-13-10, item 1, in that one respect.
- **The facts of ADV-2026-11-13-10, item 4.** The advisor read them from the run's logs (ADV-2026-11-13-17, item 1): run 43473141005's two jobs, and the shell and fmt runs on main at the same commit, each log `rustc 1.100.0 (0ef1bc386 2026-11-09)` and record the action at b725eda525362e7cf34af9a7243cac1e3f01a7ec; none of item 4 (c)'s stops had fired at 19:25Z.
- **The read commit and main.** At main 66fdc2fd, `git diff --name-only 8f6d8639 66fdc2fd` over .github/, docs/, governance/AUTONOMY.md, governance/README.md and governance/forms/ lists none. The custodian's script re-computed the carried body's 43 pins at 8f6d8639: all equal. governance/PLAN.yaml has changed by the custodian's records since; its pins keep the read commit's lines.
- **Rule (00)** at main 66fdc2fd, by `git diff --name-only origin/main...<branch>` for each of the 31 branches on origin ahead of main, against the seven Scope files and protocol/. Two touch one of the seven, both .github/workflows/product-ci-rust.yml: port-2's `cut/port-2-macos-l1-and-app-dirs`, which ADV-2026-11-13-10, item 2's exception covers, and `probe/port-2-macos-no-fail-fast`, the E0b probe branch of port-2's form (`governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`), never merged, with no PR. Three touch protocol/ (`cloud/wave1-A1`, `cloud/wave1-A5`, `cut/b1-close-nul-names`); none is a piece in flight, and this piece touches nothing there. The one open PR, #314, changes nothing under .github/. It is checked again at dispatch.
- **The route:** filler entry 16, the slot's one in flight from its dispatch, the slot idle at this commit; a five-line form within §21c's size (a declared budget of 27 lines over 7 files); the reviewer and the architect from dispatch (AUTONOMY.md §36; ADV-2026-11-13-10, item 5). The worker runs no build; its only checks are N4's text checks.
- **The PLAN node:** its gate names this form.

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-13 — the closing (written after this piece's PR runs were seen; it invalidates nothing)

*References only, under the record cap. Nothing below is a quotation.*

1. **The gates (N7).** Both from dispatch at 4541c8208a70f38280355f97e7e5893ee0f7c862, both PASS with no finding: the architect (`state/consults/gates/2026-11-13-ci-rust-toolchain-pin-gate-architect.md`, gate-log row 742) and the reviewer (`state/consults/gates/2026-11-13-ci-rust-toolchain-pin-gate-reviewer.md`, gate-log row 743).
2. **The evidence (Tests+mutation, N3).** The eight jobs of N3's table, in the pull_request runs at the head 4541c8208a70f38280355f97e7e5893ee0f7c862, each concluded success, logged N3's rustc line, downloaded the action at its commit and showed the rustup default sub-step's outcome success, read by the custodian at 20:44:37Z and by the reviewer from the logs, 8 of 8. Run/job: 43500536046/132144826427 (Product CI — bundle viewer); 43500536155/132144825940 (ADR-003 spike CI (macOS)); 43500536158/132144825494 (ADR-003 spike CI (Linux)); 43500536227/132144827152 (Product CI — shell); 43500536227/132144827576 (Product CI — shell); 43500536277/132144826666 (Product CI — Rust workspace); 43500536277/132144827148 (Product CI — Rust workspace); 43500536296/132144827085 (Rust fmt).
3. **rustfmt (N3).** rust-fmt's job 132144827085 logs rustfmt with the commit prefix 0ef1bc3860, ten characters whose first nine are N3's; the same commit, as both gates read it, so N3's stop does not fire.
4. **S1 (N5), before the PR opened.** Read at 20:18:54Z: no main run in the window for any of the seven workflows, as the PR body lists them, so no run id is cited.
5. **S3 (OPEN-3 (A)), repeated for the merge-check request.** Read at 2026-11-13T21:01:05Z: two main runs in the window, both at 204c1762 (#314's merge), product-ci-shell 43505810170 and rust-fmt 43505809481, whose three jobs (132163054681, 132163055265, 132163052114) each log N3's rustc line; no main run for the other five. The advisor reads it again at the check.
6. **OPEN-1 (A) as built.** release-artifacts.yml is not in the diff and was not dispatched (both gates).
7. **The worker.** Its report is `state/consults/2026-11-13-ci-rust-toolchain-pin-worker-report.md`; the departure it states (the form read in part) left the diff within every part of the form, by both gates.
8. **N6.** The pin's merge commit does not exist at this amendment; the node's done commit appends it as Amendment 2.
