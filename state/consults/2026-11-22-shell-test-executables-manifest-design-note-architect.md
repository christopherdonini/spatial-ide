*Filed by the custodian: the architect's design note for the node shell-test-executables-carry-the-common-controls-manifest, the first step that ADV-2026-11-21-15 item 3 (iv) names. It read the repository at 08783d07 and the crate sources, and ran nothing. Read 23, Glob 8, Grep 25, SubagentHandback 1, by unique call ids, 1 call errored (a search that timed out); model claude-opus-5-5, from 2026-11-22T14:35:30Z to 2026-11-22T14:41:30Z by its transcript; 30 calls read the main checkout, while no records commit ran; no compaction. The note below from its hand-back, 9930 bytes, sha256 9e3f848950bf8a7cc4ad38c75be53daca8ec2ef3e6d8643b6c0634d5ff9a9dbf, byte for byte. Nothing in it is ruled by its filing: by item 3 (iv) it goes to the human through the advisor, and nothing is built before their word.*

---

Design note: the shell crate's test executables and the Common Controls v6 manifest @ 08783d073376
Recommendation: route T. After `tauri_build::build()`, `build.rs` emits `cargo:rustc-link-arg-tests` naming the resource file tauri-build has already compiled. The tauri `test` feature goes on the dev-dependency, and one private handler function is drawn out of `run()`. A measurement comes first and nothing merges before it.
To the human: yes. The mock runtime needs a new feature on a dev-dependency line, which ADV-2026-11-20-22 item 4 left open, and a test of the real registration needs a change to `lib.rs` code that is built into the shipped exe.

Read at main 08783d07 (repository) and in `<registry>` (crates.io sources). I ran nothing. I have no shell, so every "measure" below is a step for the piece.

**Where the manifest comes from**
- `build.rs:4-6` calls `tauri_build::build()` and nothing else.
- On a Windows target, tauri-build builds a `tauri_winres::WindowsResource` with the default manifest, the version info and the icon, then calls `res.compile()` (`<registry>/tauri-build-2.6.3/src/lib.rs:604-682`, with `:257-260` for the default manifest).
- tauri-build does not embed through embed-resource directly. It goes through tauri-winres-0.3.6 (Cargo.lock:4758-4766). That crate writes `OUT_DIR/resource.rc` and calls `embed_resource::compile(rc, NONE)` (`<registry>/tauri-winres-0.3.6/src/lib.rs:530-543`).
- `embed_resource::compile` finds that `src/main.rs` exists and emits `cargo:rustc-link-arg-bins=<out_file>` (`<registry>/embed-resource-3.0.11/src/lib.rs:429-443`).
- On MSVC, `out_file` is `OUT_DIR\resource.lib`, an `rc /fo` output (`<registry>/embed-resource-3.0.11/src/windows_msvc.rs:32-36`).
- tauri-build has no option that sends its resource to tests. `WindowsAttributes::new_without_app_manifest` (`lib.rs:267`) and `app_manifest` (`:337`) only change what the bins get.
- Why the executable needs the manifest: tauri's default features include `common-controls-v6`, which turns on `muda/common-controls-v6` (`<registry>/tauri-2.11.5/Cargo.toml:71-75, 84-91`). Under that feature muda calls `TaskDialogIndirect` (`<registry>/muda-0.19.3/src/platform_impl/windows/mod.rs:1348-1391`).
- The shell declares `tauri = { version = "2", features = [] }` (Cargo.toml:58), so tauri's default features stay on.
- `tauri::test` is behind `cfg(any(test, feature = "test"))` (`<registry>/tauri-2.11.5/src/lib.rs:1098-1100`). The feature adds no dependency (`Cargo.toml:123`, `test = []`).
- The test module's `mock_builder` and `get_ipc_response` (`src/test/mod.rs:165, 296`) say nothing of Windows as far as I read. The need for Common Controls v6 comes from the linked imports, not from the mock runtime itself.

**1–3. The routes: what each reaches, what it does to the shipped exe, what it needs**

| Route | Instruction or layout | Targets reached | Shipped exe | Dependencies |
|---|---|---|---|---|
| T: `rustc-link-arg-tests` | `build.rs` prints `cargo:rustc-link-arg-tests={OUT_DIR}\resource.lib` after `tauri_build::build()`, guarded to the MSVC target | Integration tests: by cargo's documentation only, so unverified. The lib's unit-test exe: **unverified**. embed-resource's own doc calls this instruction "select types only. unclear which (and likely to change)" (`lib.rs:485-486`). The bin's unit-test exe: **unverified**. If it is reached, that exe gets the same file twice, and a duplicate-resource link failure is possible (unverified). | The bin's link line should not change, but that is unverified. Prove it as set out below. | Only the tauri `test` feature on the dev-dependency, which every mock-runtime route needs. No new crate. The worker's run with that line had an empty Cargo.lock diff (stop report, line 25). |
| L: plain `rustc-link-arg` | the same file, or a second manifest, through `rustc-link-arg` | Every artifact, by embed-resource's doc (`lib.rs:550-551`, "binaries, cdylibs, examples, tests (`[[test]]`/`#[test]`/doctest)"). Cargo's source is not read, so measure. | **Changes it.** The bin gets the resource a second time, which risks a duplicate MANIFEST at link time. The cdylib (`Cargo.toml:23`) gains a manifest. | The tauri `test` feature. |
| I: integration test under `tests/` | a file under `tests/`, plus route T's line | The same as T for that executable. Without T's line, no manifest, since `-bins` is all tauri-build emits. | As for T. | As for T. Also blocked by the caller rule: `mod commands` is private (lib.rs:18), so the test would need `pub` items whose only callers are tests. Those items act, so the instrument-accessor exemption does not cover them. |
| E: embed-resource's own functions | `compile_for_tests` → `-tests` (`:489-500`); `compile_for_everything` → plain (`:554-565`); `compile_for` → `-bin=NAME` (`:468-483`); `compile_for_cdylib` (`:537-548`) | As T or L respectively | As T or L respectively | **A new direct build-dependency, embed-resource 3.0.11.** It is already in the lock (Cargo.lock:1259-1260), but the shell's entry in Cargo.lock would gain an edge. That is expected and unverified: `git diff Cargo.lock` settles it. |
| B: tests in the bin | a test module in `main.rs` | The bin's test exe already carries MANIFEST (stop report, line 29). | `main.rs` is product code (`:1-7`) | The tauri `test` feature. The bin only sees the lib's `pub` API, which runs into the same caller-rule problem as I. |
| N: as now | no mock runtime, as ADV-2026-11-20-22 item 2 rules | — | Unchanged | None |

**How a piece proves the shipped exe is unchanged (T):**
- Build the release target at the base twice, as a control for a PE timestamp that differs between builds, then once at the head.
- Compare four things:
  - the build-script `output` file under the target's `release/build/spatial-ide-shell-*/`: only the added `-tests` line differs;
  - the bin's `rustc` command line from `cargo build --release -vv`: the same `-C link-arg` set;
  - `llvm-readobj --coff-resources` on the release exe: the same resource list and the same MANIFEST bytes;
  - the exe's sha256, which is proof only if the two base builds match.
- Also list MANIFEST in every executable that `cargo test --no-run` builds: the lib's unit-test exe, the bin's unit-test exe and `sole_caller_scan`. That list settles each "unverified" in T's row.
- One caveat: the handler function drawn out of `run()` (item 4) changes the exe's code. So the hash will differ even if the resources do not, and the resource listing is what proves the manifest unchanged.

**4. What it buys**
- Today's tests leave out four things: the command's registration, its argument names, the IPC and the attach's reply (ADV-2026-11-20-22 item 3). The note on PR 343 is my N1: no test reaches the IPC, and the gate reads the code in its place (`state/consults/gates/2026-11-20-session-log-token-redaction-rests-on-page-code-gate-architect.md`, N1).
- With the mock runtime, the commands in `generate_handler!` (lib.rs:550-573) can be called through `get_ipc_response`. That covers `binding_log_session_event` (with `append_redacted` reached through the IPC), `binding_data_plane_attach` (its reply) and the pick and publish bindings.
- **What it needs to be a real-shape test:**
  - `run()` builds the handler list inline, on `tauri::Builder::default()` with `generate_context!()` (lib.rs:186-187, 574).
  - A test that writes out its own `generate_handler!` list encodes an imagined registration, which is a gate failure by name under the seam rule.
  - So the piece draws out a private `fn` that is generic over `R: Runtime` and returns the handler. `run()` is its product caller. That it compiles under `MockRuntime` is unverified and is the piece's step 0.
- **What it does not buy:** the request body in such a test is still typed by hand from `log.ts`. Only an e2e case through the app reaches the page's real `invoke`, and that needs no build change.

**5. Recommendation**
- **Route T.** It adds no crate and reuses the manifest bytes the shipped exe already carries. Its coupling to `resource.lib` (tauri-winres `:532` + embed-resource `windows_msvc.rs:32`) fails loudly if a version bump renames the file: the link cannot open it.
- **Declared stop:** if the bin's unit-test exe fails to link with a duplicate resource, the piece stops. The fix, `test = false` on the bin, is a Cargo.toml target change and needs a ruling.
- **Class under ADV-2026-11-16-06: the full form and both gates.**
  - It changes the build of the crate that ships and code compiled into the exe.
  - Its first consumer is the redaction seam, which is security under item 2 (a).
  - Item 2 (b) says "In doubt, the piece is full."
- **Scope:**
  - `frontends/shell/src-tauri/build.rs`;
  - `frontends/shell/src-tauri/Cargo.toml` (the tauri `test` dev-feature);
  - `frontends/shell/src-tauri/src/lib.rs` (the handler function);
  - `frontends/shell/src-tauri/src/commands.rs` (its test module: one IPC case per binding the form names);
  - `Cargo.lock` only if the measurement shows it changes, and it is expected not to.
- **To the human: yes, by ADV-2026-11-21-15 item 3 (iv).** It needs a dependency-line change (the tauri `test` feature) and changes the code of the shipped exe (the drawn-out function). Nothing is built before their word.
- **Alternative the human may prefer:** N plus one e2e case for `binding_log_session_event` through the real page. That changes no build or dependency and reaches the page's real `invoke`.

**Documentation findings (must fix before filing; they block nothing)**
- D1. The stop report says tauri-build embeds "through embed-resource-3.0.11". The path is tauri-build → tauri-winres-0.3.6 → embed-resource, as set out under "Where the manifest comes from".
- D2. The root Cargo.toml comment (`:24-26`) says anything worth a unit test does not belong in this crate. A form for T should say why tests of the binding wiring are the client's own (docs/02).
