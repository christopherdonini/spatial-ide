# N1 — model: the project file, identity across copy and move, collapse keys, versioning (Round 1)

Researcher: Claude (n1-model track), 2026-10-08. Workspace: `~/spatial-ide-archaeology/candidates/n1-model/`.
All clones are shallow and blob-less; large repositories are sparse. Nothing was built, installed or run.

The question is ADR-036 (Proposed, PR #190), whose acceptance is due before `b2-piece-1c-save-and-reopen` merges.
Questions 1–3 got most of the depth.

---

## 1. Spatial IDE facts relied on

At `4561f3b` (main), or `pr190` where marked.

- **ADR-036's OPEN on the name** (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:24 @ 14acee0b`): "A file ending in `.json` cannot open the application by double-click, so the name and the extension are settled at acceptance." The human's typed words (`state/directives/2026-10-08-round-69-rulings.md:16-17 @ 4561f3b8`): "The project file's name and extension stay an open block until I accept the ADR. A file ending in .json cannot open the app by double-click."
- **Folder layout** (ADR-036 §1, `:13-26`): one project per folder. It holds `<project file>` and `.spatial/lineage.jsonl`, and "Nothing else in the folder belongs to the format."
- **Identity** (ADR-036 §4, `:44-54`): `spatial://project/` + 32 hex, from the OS CSPRNG, minted at first Save, "never derived from the folder's path". On a second folder: ask once (copy, which gets a new identity and keeps lineage; or same project, remembered for that folder). If the first folder is gone, the project moved and nothing is asked. The wording of the question is the human's, at P6. The brief lists "Two folders that carry one identity, after a copy made by hand" as 1a's open item (`state/directives/B2-BRIEF-2026-10-07.md:180 @ 4561f3b8`).
- **Machine-side state found by identity, never by path** (ADR-036 §1 `:26`; brief §3 `:37,39` and ruling 1 `:165`).
- **Versions** (ADR-036 §3, `:39-42`): `format` + `version` (1). "A reader refuses a version it does not implement." A separate `actions` integer, where "a reader that meets an action from a later vocabulary shows the step as recorded by a later version, and never drops it."
- **Closed keys** (ADR-036 §2, `:33`): "a reader refuses an unknown key, a missing key and a duplicate key, naming the key's path."
- **Step record, action registry and collapse key** (ADR-036 §6, `:96-131`). Kinds are `data|scope|style|snapshot|export`. Mark lines are `saved-here` and `restored`. "Each action declares … its collapse key: the property it sets. Compaction uses the collapse key to keep the last of repeated edits and to collapse toggles. **This ADR registers no action.**"
- **Compaction rules in the brief** (`B2-BRIEF:52-54`): "Dead ends, reversals, clause toggles and repeated edits of one property collapse, so five colour tries leave the last one. Distinct steps that each contribute stay." "The lineage always matches the project as saved." The round-69 ruling softens "always matches" (`state/directives/2026-10-08-round-69-rulings.md:13 @ 4561f3b8`).
- **Undo is the kernel's** (`docs/02_Architecture.md:44 @ 4561f3b8`): undo is "never implemented in the UI". Projects are "Plain-text, diffable, gittable files" (`docs/02_Architecture.md:48 @ 4561f3b8`).
- **No new dependency** (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:25 @ 4561f3b8`): "No new dependency. If a form finds one necessary, that is a question for the human before any code."
- **`spatial_renderer::canonical` is a writer only** (`renderer/src/canonical.rs:139-205 @ 4561f3b8`). It owns the number grammar (`:31-38`, `:232-273`) and refuses a duplicate key **on write** (`:183-193`, test `:368`). It has **no parse function** (`grep "fn parse" renderer/src/canonical.rs` is empty).
- **Every reader today goes through a general parser.** `renderer/src/style.rs:304 @ 4561f3b8` and `kernel/src/permission/audit/reader.rs:72 @ 4561f3b8` use `serde_json::from_str` into a `Value`. The bundle viewer uses `JSON.parse` (`renderer/bundle-viewer/src/manifest.ts:646 @ 4561f3b8`). ADR-017 §2 (`docs/adr/ADR-017-…:60-63`) says so already: "A reader built on a general JSON parser will not see one — the usual parsers keep the last occurrence — so this binds the writing side and a reader must not rely on it."
- **PR #190's own reader** (`kernel/src/dataset_ref.rs:19-20 @ 14acee0b`): "`parse` takes a parsed [`Value`], which has collapsed a duplicate key: a file reader (piece 1c's) must refuse one." Its integer bound is `MAX_EXACT_INTEGER = 2^53-1` (`:47`, `:462`). `DatasetUri::mint` uses `getrandom::fill` (`:93-98`).
- **The shell's Tauri setup** (`frontends/shell/src-tauri/tauri.conf.json:5 @ 4561f3b8, :27, :37`): identifier `dev.spatialide.shell`, bundle targets `["nsis"]` only, `installMode: "currentUser"`. No `fileAssociations`. Locked `tauri` is 2.11.5 (`frontends/shell/src-tauri/Cargo.lock:4475-4476 @ 4561f3b8`). The plugins are `tauri-plugin-opener` 2.5.4 and `tauri-plugin-dialog`. `zbus` 5.18.0 is already in the shell lock, pulled in by `tauri-plugin-opener` (`frontends/shell/src-tauri/Cargo.lock:6211-6212 @ 4561f3b8`). `windows-sys` 0.61.2 is also present (`:5842-5843`).
- **Single-instance was excluded on purpose.** `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md:181 @ 4561f3b8, :236, :273` says "No single-instance mechanism is added … Adding one would be a scope addition". That form was predicting two processes coexisting on the data plane, audit log and staging.

---

## 2. The sweep

| # | Project | Area | Kept / dropped, and why |
|---|---|---|---|
| 1 | tauri-apps/tauri (bundler, `tauri-utils` config, runtime `RunEvent::Opened`) | Q1 | **Kept, deep.** The mechanism Spatial IDE already ships on |
| 2 | tauri-apps/plugins-workspace `single-instance`, `deep-link` | Q1 | **Kept, deep.** The runtime half of double-click while the app is already running |
| 3 | GNOME GLib `gio/gdesktopappinfo.c` (fetched raw, LGPL-2.1-or-later) | Q1 | Read once to settle Linux `Exec` without a field code. Not a candidate |
| 4 | Wine `dlls/kernelbase/path.c` `PathFindExtensionW` (fetched raw, LGPL) | Q1 | Read as an **inference aid** for Windows' last-dot extension rule. Wine is not Windows. Not a candidate |
| 5 | KiCad (`common/settings/json_settings.cpp`, `common/project/project_file.cpp`, Linux mime) | Q1, Q4 | **Kept.** JSON project file with its own extension and a migration chain |
| 6 | microsoft/vscode (workspace identifier, storage, `.code-workspace` packaging) | Q1, Q2 | **Kept.** Prior art for an extension and the counter-example for identity |
| 7 | jupyter/nbformat | Q1, Q4 | **Kept, deep for Q4.** The cleanest "keep the unknown cell" rule |
| 8 | QGIS (layout undo, vector undo, history registry, processing history, project version) | Q3, Q4, Q5 | **Kept.** A GIS user of `QUndoCommand::id()`, and the processing history |
| 9 | Excalidraw (`restore.ts`, constants) | Q1, Q4 | Shallow. Counter-example: keeps unknown properties and **drops unknown element types** |
| 10 | tldraw (`@tldraw/store` MIT; `@tldraw/editor` custom licence) | Q1, Q3, Q4 | Shallow. Editor licence is red, store is MIT. Squash semantics noted |
| 11 | godotengine/godot (`core/io/resource_uid.*`, `editor/file_system/editor_file_system.cpp`, history) | Q2 | **Kept, deep.** The closest prior art for §4 |
| 12 | Unity `.meta` GUIDs | Q2 | Dropped. No open source for the importer, only issue-tracker reports |
| 13 | Obsidian | Q2 | Dropped. The app is closed source, and nothing in an open repo mints a vault identity |
| 14 | qt/qtbase `QUndoStack` / `QUndoCommand` | Q3 | **Kept, deep.** The reference collapse-key implementation |
| 15 | ProseMirror `prosemirror-history` | Q3 | **Kept.** `closeHistory` boundary and time/adjacency grouping |
| 16 | CodeMirror `@codemirror/commands` history | Q3 | **Kept.** `isolateHistory` and user-event-class joining |
| 17 | apache/kafka log cleaner | Q3 | Kept as concept. "Never clean the active segment / past the stable offset" |
| 18 | OpenLineage spec | Q4 | Shallow. `_producer`/`_schemaURL`, SchemaVer, `additionalProperties: true` |
| 19 | W3C PROV-JSON (member submission, 2013) | Q4 | Dropped. No version field and no unknown-key rule (WebFetch) |
| 20 | iterative/dvc `dvc.lock` | Q5 | Shallow. Keyed-by-stage overwrite, `schema: "2.0"` equality, deps by hash |
| 21 | serde-rs/json 1.0.151 and serde-rs/serde derive | Q6 | **Kept.** Settles the duplicate-key behaviour Spatial IDE already depends on |
| 22 | evik42/serde-json-canonicalizer (RFC 8785) | Q6 | Shallow. A writer that reads through `serde_json::Value` too. No gain |
| 23 | crates.io `serde_jcs`, `json-canon`, `olpc-cjson`, `canonical_json`, `cjson` | Q6 | Metadata only. All are writers. Nothing replaces an owned component |

---

## 3. Dossiers

### 3.1 Tauri 2 `bundle.fileAssociations` + `RunEvent::Opened` (tauri-apps/tauri)

- **Repository:** github.com/tauri-apps/tauri at `a225a18` (2026-10-08). Crates `tauri` 2.12.1 and `tauri-bundler` 2.10.1 (crates.io, 2026-09-30); a 3.0 alpha line runs in parallel. Spatial IDE locks `tauri` 2.11.5.
- **Licence:** Apache-2.0 OR MIT. Verified from the SPDX headers (`examples/file-associations/src-tauri/src/main.rs:2-3`) and the workspace `LICENSE.spdx`. The NSIS macro file is third-party: `crates/tauri-bundler/src/bundle/windows/nsis/FileAssociation.nsh:1-6` says "from https://gist.github.com/nikku/… Written by Saivert, Improved by Nikku", with **no licence statement in the file** (unclear provenance, red). It only matters if that file is copied into Spatial IDE. Using the bundler does not copy it.
- **Activity:** releases every few days (2.12.0 on 2026-09-26, 2.12.1 on 2026-09-30). CI is Windows, Ubuntu and macOS (`.github/workflows/test-core.yml:45-73`).
- **Why it matters:** this is the only route by which the project file opens the app by double-click. It already ships in the dependency Spatial IDE has, so it is configuration, not a new dependency.
- **How it works (verified):**
  - **Config.** `FileAssociation` (`crates/tauri-utils/src/config.rs:1199-1250`, `deny_unknown_fields`) has `ext: Vec<AssociationExt>`, `content_types`, `name`, `description` (Windows "Type" column), `role` (macOS), `mime_type`, `rank` (macOS `LSHandlerRank`, default `Default`) and `exported_type {identifier, conforms_to}` (macOS `UTExportedTypeDeclarations`, `:1262-1274`). `AssociationExt` strips one leading `.` and otherwise keeps the string as given (`:1187-1196`). Nothing rejects an interior dot.
  - **Windows NSIS** (Spatial IDE's only target). `installer.nsi:664-669` runs `APP_ASSOCIATE "{{ext}}" "{{or association.name ext}}" … "$INSTDIR\${MAINBINARYNAME}.exe $\"%1$\""` once per extension. `FileAssociation.nsh:68-80` writes `SHELL_CONTEXT\Software\Classes\.<ext>` = ProgID (backing up the previous value under `<ProgID>_backup`), plus `<ProgID>\shell\open\command`. Uninstall restores the backup (`:108-114`). The ProgID defaults to the bare extension text unless `name` is given, so a `name` like `SpatialIDE.Project` is advisable (inference from the template). `SetShellVarContext current` (`installer.nsi:882`) matches Spatial IDE's `installMode: "currentUser"`, so the keys land under HKCU.
  - **Windows MSI** (not used today): `windows/msi/main.wxs:150-156` (template lines) emits `<ProgId Id="{{product_name}}.{{ext}}">` with an `<Extension Id="{{ext}}">`.
  - **macOS:** `file_associations_plist` (`config.rs:1319-1428`) writes `CFBundleDocumentTypes` (`CFBundleTypeExtensions`, `CFBundleTypeName` defaulting to `ext[0]`, role, rank) and, when `exportedType` is set, `UTExportedTypeDeclarations` with `UTTypeConformsTo` (the example uses `public.json`, `examples/file-associations/src-tauri/tauri.conf.json:43-48`).
  - **Linux:** `bundle/linux/freedesktop/mod.rs:137-156` writes only `MimeType=<mimeType;…>` into the `.desktop` file (`freedesktop/main.desktop:6,12-13`). The template's `Exec={{exec}}` has **no `%f`/`%U`**. **Tauri ships no shared-mime-info XML**: `rg -i "mime-info|shared-mime" crates/` is empty. So a custom MIME type such as `application/x-spatial-project` has no glob mapping it to the extension unless the package adds one. VS Code does this itself (`resources/linux/code-workspace.xml`, plus `update-mime-database` in `resources/linux/debian/postinst.template`), as does KiCad (`resources/linux/mime/kicad-kicad.xml.in:3-9`) and Godot (`misc/dist/linux/org.godotengine.Godot.xml`). In Tauri the hooks are `bundle.linux.deb.files`, `postInstallScript` and `desktopTemplate` (`config.rs:354,367,375`).
  - **The missing `%f` is not fatal on GNOME.** GLib's `expand_application_parameters` (`gio/gdesktopappinfo.c:2735-2741`, LGPL-2.1-or-later, fetched raw) says: "If there is no macro default to %f. This is also what KDE does". So the path still arrives as an argument. The KDE half is GLib's claim, not verified here.
  - **Runtime: how the path arrives.**
    - Windows and Linux: as `argv` (first instance). The example parses `std::env::args().skip(1)`, skipping `-` flags and accepting `file://` URLs (`examples/file-associations/src-tauri/src/main.rs:53-77`).
    - macOS (and iOS/Android): only through `RunEvent::Opened { urls }` (`crates/tauri/src/app.rs:257-266`, `#[cfg(any(target_os = "macos", "ios", "android"))]`), plumbed from tao's `Event::Opened` (`crates/tauri-runtime-wry/src/lib.rs:4332-4335`). There is no argv on macOS.
    - History: file associations were added in #3736. `RunEvent::Opened` was exposed on macOS in #7440. `exportedType`/`contentTypes` arrived in #14128. Android/iOS came in #14486 (`crates/tauri/CHANGELOG.md:219,2188,2191`; `crates/tauri-utils/CHANGELOG.md:152`).
- **Compound extensions:** **nothing in Tauri stops `ext: ["spatial.json"]`**, and NSIS would happily write `Software\Classes\.spatial.json`. But Windows Explorer resolves a file's type from its **last** extension (inference, from Wine's `PathFindExtensionW` at `dlls/kernelbase/path.c:1221-1240`, which returns the last `.`; Windows itself was not checked). A file named `project.spatial.json` would therefore look up `.json` and never reach that key. macOS `CFBundleTypeExtensions` is likewise documented as matching the final extension (not verified in source). **So the human's premise holds: `.json` as the last extension cannot be the double-click hook on Windows or macOS, and a compound `.spatial.json` registration does not get around it.** On Linux a glob like `*.spatial.json` would work (shared-mime-info supports multi-dot globs; VS Code's `*.code-workspace` shows the mechanism). That is the only platform where it would.
- **What to reuse:** `bundle.fileAssociations` with one entry, a unique single-segment extension, `name` set to a ProgID (`SpatialIDE.Project`), `description`, `mimeType: application/x-spatial-project` (a vendor `x-` type is inference/convention), `rank: Owner` and `role: Editor`. For macOS, an `exportedType` with `identifier: dev.spatialide.project` (or the final bundle id) and `conformsTo: ["public.json"]`, so Quick Look and editors still treat the file as JSON. On Linux, a shared-mime-info XML with `<sub-class-of type="application/json"/>` (inference; KiCad and Godot use `text/plain`) and a glob, shipped via `deb.files`, plus a `postInstallScript` running `update-mime-database`.
- **What not to reuse:** the example's `initialization_script(format!("window.openedFiles = [{files}]"))` (`main.rs:44-46`). It interpolates paths into JS source and contradicts ADR-036 §5's "Locators are built and resolved in the kernel only. No frontend builds or parses one." The path should go straight to a kernel command. Also skip the asset-protocol scope widening (`:22-31`).
- **Licence implications:** none for configuration use. Tauri is already a dependency. Do not copy `FileAssociation.nsh`.
- **Reuse mode:** **ADOPT** (configuration of an existing dependency). **Confidence:** high for the bundler output and medium for the OS resolution rules, which are inferred rather than read in OS source.
- **Avoided work:** moderate (installer registry code, plist generation, desktop entries).
- **Recommendation:** close OPEN §1 by choosing a **single-segment extension** and drop `.json` as the last extension. Two shapes pass the human's test:
  - (a) **a fixed filename**, Godot-style (`misc/dist/linux/org.godotengine.Godot.xml` globs `project.godot`);
  - (b) **`<any name>.<ext>`**, KiCad-style, where the folder can contain one file of that extension.

  Because ADR-036 says "one project per folder" and "Nothing else in the folder belongs to the format", (a) gives the simplest reader rule: the project file is found by name, and a second `.ext` file in the folder cannot be ambiguous. Candidate spellings are the human's (for example `project.spatial`, or `<name>.spatialproj`). Before choosing, check that the extension is not claimed by a common app (not verified here). Separately, the **content** can stay canonical JSON with `format: "spatial-project"`, as KiCad `.kicad_pro`, nbformat `.ipynb`, VS Code `.code-workspace`, Excalidraw `.excalidraw` (MIME `application/vnd.excalidraw+json`, `packages/common/src/constants.ts:316`) and tldraw `.tldr` (`packages/tldraw/src/lib/utils/tldr/file.ts:34`) all do.
- **Timing:** **now**, before ADR-036's acceptance, because it closes the OPEN. Wiring `fileAssociations` and the open path is piece 1c's (or a shell piece's) and needs the human's word because it changes `tauri.conf.json`. Adding a non-`nsis` target is out of scope until macOS/Linux packaging exists.

### 3.2 `tauri-plugin-single-instance` (+ `deep-link`) (tauri-apps/plugins-workspace)

- **Repository:** github.com/tauri-apps/plugins-workspace at `8489575` (2026-10-08). Crate `tauri-plugin-single-instance` 2.5.2 (crates.io 2026-10-01; 2.5.0 on 09-26, 2.5.1 on 09-29), with 3.0 alphas in parallel.
- **Licence:** Apache-2.0 OR MIT (`plugins/single-instance/LICENSE.spdx`, `LICENSE_APACHE-2.0`, `LICENSE_MIT`; SPDX headers on every file).
- **Quality:** declared support is full on Windows, Linux and macOS (`Cargo.toml` `[package.metadata.platforms.support]`). CI `test-rust.yml:217-249` runs on windows-latest, ubuntu-22.04 and macos-latest. There is no test file in the plugin (`git ls-tree … | grep -c test` = 0), only `examples/vanilla`. `windows.rs` has 27 `unsafe` sites (raw Win32). Dependencies are `zbus` (Linux; already in Spatial IDE's shell lock through `tauri-plugin-opener`), `windows-sys` 0.61 (already locked at 0.61.2), `tokio` `net`, and `serde_json`.
- **Why it matters:** with an association installed, double-clicking a project while Spatial IDE is open starts a **second process** on Windows and Linux. Spatial IDE's own preregistration showed two processes coexist (separate data planes, a shared WebView2 profile), so without this plugin the double-click opens a second window and a second kernel. That may be acceptable, but for a project it also means **two processes can hold the same project identity**, which is exactly §4's "same identity from a second folder" question across processes. That is a new case.
- **How it works:**
  - Windows (`platform_impl/windows.rs:55-128`): `CreateMutexW("{identifier}-sim")`. If the mutex already exists, it `FindWindowW` on a hidden message window and sends `WM_COPYDATA` with `"{cwd}|{args joined by '|'}\0"` (`:88-102`), then `std::process::exit(0)`. The first instance splits on `|` (`:161-166`). **A path containing `|` would split wrongly.** `|` is illegal in Windows filenames, so this is safe in practice (inference).
  - Linux (`linux.rs:35-101`): claims the session-bus name `{identifier}.SingleInstance` and serves `ExecuteCallback(argv, cwd)`. On `NameTaken` it calls the first instance and exits.
  - macOS (`macos.rs:20-140`): a Unix socket at `/tmp/{identifier}_si.sock`, payload `cwd\0\0arg\0arg`. On macOS, though, a second Finder double-click goes to the **running** app as `RunEvent::Opened` anyway (the OS behaviour; inferred, not verified in tao source), so the plugin matters there only for CLI launches.
  - `deep-link` (`plugins/deep-link/src/lib.rs:204-231`) treats a lone argument as a URL only if its scheme is configured, so it does not interfere with file paths. It is not needed for file associations.
- **What to reuse:** the plugin as is, if the human wants one process per user. The concept, if not: a second process could still detect, by asking the machine-side store (which already exists per identity), that the identity is open elsewhere and refuse or redirect. That is inference.
- **What not to reuse:** the `|`-joined payload, if it were ever ported; prefer NUL-separated as on macOS.
- **Licence implications:** permissive. As a dependency it adds a crate but no new transitive families (`zbus` and `windows-sys` are already locked).
- **Reuse mode:** **WRAP** (as a dependency the shell calls) **if** the human rules for one instance. It is a new direct dependency, so it is a question for the human under the migration plan's rule 4.
- **Avoided work:** moderate (three IPC mechanisms).
- **Recommendation:** ask the human in piece 1c's form whether a double-click while the app is running opens a second window in the same process (plugin) or a second process. Either way, 1c must state what happens when **one identity is open in two processes**. Godot's and VS Code's answers below both assume a single owner.
- **Timing:** before `b2-piece-1c-save-and-reopen`'s form.

### 3.3 Godot 4.4+ `uid://` and `.uid` files (godotengine/godot) — identity across copy and move

- **Repository:** github.com/godotengine/godot at `e7b12e749` (2026-10-07), sparse.
- **Licence:** MIT (`LICENSE.txt:1-8`; the `core/io/resource_uid.cpp` header is the MIT text). `COPYRIGHT.txt` lists third-party code, and none of it is in the files read. Green.
- **Activity and tests:** very active. `tests/core/io/test_resource_uid.cpp` exists. CI covers Linux, macOS and Windows builds (`.github/workflows/{linux,macos,windows}_builds.yml`).
- **Why it matters:** this is the closest open-source analogue of ADR-036 §4. Godot has a random ID stored beside the thing, a machine/project cache from ID to path, and explicit rules for a file that appears at a second path carrying a known ID.
- **How it works:**
  - **Minting.** `ResourceUID::create_id()` (`core/io/resource_uid.cpp:113-125`) draws 64 bits from `CryptoCore::generate_random`, masks to 63, and loops until unused in the cache. `create_id_for_path()` (`:127-148`) is **deterministic**: it seeds a PCG from `project_name.hash64() * path.to_lower().hash64() * md5(file).hash64()`. It is used for new `.uid` files (`editor_file_system.cpp:944`, `:1386`) and for duplicates (`:924`). The text form is base-34 `uid://…`, with a known off-by-one that "cannot be fixed without breaking compatibility; see GH-83843" (`:42-45`).
  - **Storage.** A sidecar `<file>.uid` holds one line (`editor_file_system.cpp:941-947`). The ID→path cache is `uid_cache.bin` in the project data path (`resource_uid.cpp:47-49`, binary `u32 count, [u64 id, u32 len, bytes]`, `:270-283`).
  - **Duplicate rule A, the same rule as ADR-036's "moved".** When a new file appears whose ID is already known (`editor_file_system.cpp:916-938`): if the cached path differs **and the old path still exists**, the new file gets a **new ID**, is re-saved with it, and a warning is printed: "Duplicate UID detected for Resource at "%s". Old Resource path: "%s". The new file UID was changed automatically." Otherwise (the old path is gone) the ID is kept and the cache is repointed (`set_id`): a move. Commit `8e9c4e04b` (2024-12-30, kobewi): "Assign new UID when duplicating file externally."
  - **Duplicate rule B, first scan: warn only.** During the first scan of a session, a duplicate is warned but not repaired, and the later path wins the cache (`:1395-1407`). Commit `5122a3e3b` (2024-06-10): "This commonly occurs when files are copied outside of the editor and don't get new UIDs. Restricting this warning to first_scan since we want to exclude the case of files being moved after initial load which is harder to handle."
  - **In-editor copy.** `_copy_file` (`:3123-3160`) rolls a new UID for the copy ("Roll a new uid for this copied .import file to avoid conflict"), or re-saves the resource so that it generates one.
- **What Godot does with two copies (the question asked):** it never asks the user. "Old one still exists" means the newcomer is a copy and is re-keyed silently. "Old one gone" means a move and the key is kept. At first scan, when it cannot tell which is the newcomer, it warns and lets the last path win.
- **What to reuse (concept):**
  1. The **existence test** ("is the cached location still there?") as the move/copy discriminator. ADR-036 §4 already has exactly this.
  2. The **rule-B lesson**: when both locations exist and neither is known to be the newer (for example after a restore from backup, or a sync tool), Godot gives up deciding. ADR-036's "ask once" is the better answer there, and Godot's history (two commits, six months apart) shows that the automatic rule alone was not enough.
  3. **Re-key the newcomer, never the original.** The project that keeps its identity is the one the machine already knew, so its session history and per-project preferences stay found.
- **What not to reuse:** path- and content-seeded IDs (`create_id_for_path`). ADR-036 forbids deriving identity from the path, and Godot's own seed makes two byte-identical files at the same lowercase path collide by design. Also skip the base-34 text form.
- **Licence implications:** MIT. A concept port needs no notice, a code port keeps it. Nothing here is worth porting as code.
- **Reuse mode:** **CONCEPTUAL DONOR.** **Avoided work:** small (design time, not code).
- **Recommendation:** in ADR-036 §4, state the discriminator as Godot's: "the identity's last recorded folder still exists and still holds a project file carrying this identity". Godot checks `FileAccess::exists(old_path)`; Spatial IDE should also re-read the identity there, since a folder can be reused for a different project (inference). Also state that the **re-keyed side is always the newly opened folder**.
- **Timing:** **now**, at acceptance.

### 3.4 VS Code workspace identity (microsoft/vscode) — the counter-example

- **Repository:** github.com/microsoft/vscode at `d3d31f6` (2026-10-08), sparse. **Licence:** MIT (file headers, e.g. `src/vs/platform/workspaces/node/workspaces.ts:1-4`).
- **How it works:**
  - `getWorkspaceIdentifier(configPath)` = `md5(path)`, lower-cased on non-Linux (`workspaces.ts:24-39`). Single folder = `md5(fsPath + birthtime)` on macOS/Windows, or `+ inode` on Linux, "so that folders getting recreated result in a different identifier" (`:47-81`). The code carries a banner: "NOTE: DO NOT CHANGE. IDENTIFIERS HAVE TO REMAIN STABLE". An empty window gets a time-plus-random ID (`:98-102`).
  - Storage lives at `workspaceStorage/<id>/state.vscdb`, plus a one-time `workspace.json` recording the folder or workspace URI (`src/vs/platform/storage/electron-main/storageMain.ts:416-490`).
  - "Save Workspace As" moves the state explicitly: `storageService.switch(result.workspace, true /* preserve data */)` (`src/vs/workbench/services/workspaces/electron-browser/workspaceEditingService.ts:186-189`).
- **What it does with copies and moves:** a copy gets **fresh, empty** state (a new path hash), and a move **loses** its state (a new path hash). Neither is detected. Nothing is ever asked. The only carry-over is the explicit in-app Save As.
- **Why it matters:** this is the failure ADR-036 §4 avoids by not deriving identity from the path, and it is evidence for that choice. The `workspace.json` reverse pointer is still worth copying. It is how a human (or a cleanup tool) can tell what an orphaned per-identity directory belonged to.
- **What to reuse:** a small reverse-pointer file inside each machine-side per-identity directory (its last-known folder, written at each open). It costs one file and makes the "first folder still exists?" test of §4 a lookup (inference).
- **Prior art for the extension:** `.code-workspace` is JSON with its own extension, registered per-user on Windows (`build/win32/code.iss:287-293`, `OpenWithProgids` + `shell\open\command "%1"`) and on Linux through a shared-mime-info glob (`resources/linux/code-workspace.xml`) plus `update-mime-database` (`resources/linux/debian/postinst.template`). An already-open workspace is focused rather than reopened (`src/vs/platform/windows/electron-main/windowsMainService.ts:644-653`), which is the single-owner rule.
- **Reuse mode:** **CONCEPTUAL DONOR** (reverse pointer, Linux mime packaging, focus-existing-window rule); **REJECT** for path-hash identity. **Avoided work:** small.

### 3.5 Qt `QUndoStack::push` / `QUndoCommand::id()` / `mergeWith()` / `setObsolete()` (qt/qtbase) — the collapse key

- **Repository:** github.com/qt/qtbase at `bc887a1` (2026-10-08), sparse. **Licence:** `src/gui/util/qundostack.cpp:2` is `SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only OR GPL-2.0-only OR GPL-3.0-only`. The open options combinable with the AGPL core are LGPL-3.0-only (weak copyleft) or GPL-3.0-only (core-combinable copyleft). **Flag:** this is not permissive, and Spatial IDE should not copy code from it. Concepts only.
- **Why it matters:** `id()` + `mergeWith()` is the collapse key under another name, with 15+ years of use, and Qt's own tests define the toggle-cancels rule.
- **How it works:**
  - `push` (`qundostack.cpp:579-638`) runs `cmd->redo()`, then truncates the redo tail ("If commands were undone before cmd was pushed, the current command and all commands above it are deleted", `:568-570`; `:595-598`).
  - It **tries a merge only if `cur->id() != -1 && cur->id() == cmd->id() && (macro || index != clean_index)`** (`:601-604`). **A merge never crosses the clean (saved) mark**: when the top command is exactly at the clean index, the new command is pushed separately.
  - After a merge, **if the merged command `isObsolete()`, it is deleted** and the index steps back (`:606-617`). A command that is obsolete on arrival is dropped (`:625-626`).
  - `mergeWith` contract (`:162-185`): "calling this command's redo() must have the same effect as redoing both this command and command." Only the **adjacent top** command is ever merged.
  - **Toggle cancel, in Qt's own test.** `MoveMouseCommand` (`tests/auto/gui/util/qundostack/tst_qundostack.cpp:228-270`) is `setObsolete(true)` when `old == new` at construction, and `mergeWith` keeps the earliest `old`, takes the latest `new`, and sets `setObsolete(true)` if they are equal. This is exactly "A → B → A collapses to nothing".
  - `setClean` is refused inside a macro (`:654-656`). The clean index is reset to −1 when the commands it pointed at are deleted (`:597-598`, `:468-472`).
- **The rules worth copying (concept, re-expressed):**
  1. **The collapse key is (action, the property it sets, the object it sets it on).** Qt's `id()` is per-class, so the target object must be checked inside `mergeWith`. QGIS does exactly that: `QgsLayoutItemUndoCommand::mergeWith` refuses unless `c->itemUuid() == itemUuid()` (`qgis/src/core/layout/qgslayoutitemundocommand.cpp:38-53`), and `QgsVectorLayerUndoCommandChangeGeometry::mergeWith` refuses unless `merge->mFid == mFid` (`qgis/src/core/vector/qgsvectorlayerundocommand.cpp:122-138`). In ADR-036 terms the collapse key needs a **target** component (the layer or dataset reference), not only "the property it sets".
  2. **Merge keeps the first step's before-state and the last step's after-state.** Five colour tries leave one step whose parent is the first try's parent.
  3. **Toggle cancels to nothing when after == before.** Equality is judged on the canonical bytes of the effective value, as QGIS's `containsChange` does on serialised state (`qgis/src/core/layout/qgslayoutundocommand.cpp:52-55`: `mBeforeState.toString() == mAfterState.toString()`). Spatial IDE's one canonical writer makes byte equality well defined (inference).
  4. **Only adjacent runs merge.** A different key in between ends the run.
  5. **Never merge across a save mark.** This is Qt's `index != clean_index`, and it fits ADR-036 directly: compaction at Save project must not merge a step already in the lineage with one recorded after the `saved-here` mark, or the lineage would rewrite what an earlier save already published (inference from §8's "whole, at each Save project").
  6. **A new step after going back truncates the tail.** This is the brief's "steps left behind … leave [the lineage] at the next Save project".
- **Reuse mode:** **CONCEPTUAL DONOR** (licence forbids nothing at concept level; no code). **Avoided work:** small, but it prevents a design error (a key without a target). **Timing:** now. The ADR text names the collapse key, and its shape should be fixed at acceptance even though 1b registers the actions.

### 3.6 ProseMirror `prosemirror-history`, CodeMirror `@codemirror/commands` history, tldraw squash, Kafka compaction — grouping and boundaries

- **ProseMirror** at `445409b` (2026-04-01), MIT (`LICENSE`, `package.json:14`).
  - `applyTransaction` (`src/history.ts:259-298`) starts a new group when `prevTime < tr.time - newGroupDelay || !isAdjacentTo(...)`. A transaction tagged `closeHistory` ends the current group (`:263`, `:366-368`). `addToHistory: false` keeps a change out of undo but **maps** the history across it (`:277`, `:292-296`).
  - The default `newGroupDelay` is 500 ms (`:393`).
- **CodeMirror** at `5b9bac9` (2026-04-15), MIT.
  - `isolateHistory` is `"before" | "after" | "full"` (`src/history.ts:14`, applied at `:68-69,81`).
  - Joining (`addChanges`, `:319-336`) happens only when the **user-event class** matches `/^(input\.type|delete)($|\.)/` (`:307`), the events are within `newGroupDelay`, and they are adjacent (`joinToEvent`, default `isAdjacent`, `:33,41`). A selection-only change becomes its own selection event (`:339-346`).
- **What to take:**
  1. **An explicit boundary marker**, which ADR-036 already has as `saved-here`. Treat it as `isolateHistory: "full"` for compaction.
  2. **Join by event class, not by time.** Time-window grouping is right for keystrokes but wrong for a lineage that is read later. Spatial IDE's steps are committed changes, so the collapse key alone should decide, with no time window (inference).
  3. **Selection-only changes are not history steps.** This matches ADR-036's "A selection alone is not a step".
- **tldraw:** the editor `HistoryManager` is under a custom tldraw licence (`LICENSE.md`: production use needs a licence key), which is **red**. Read only to locate the squash. `@tldraw/store` is MIT (`packages/store/LICENSE.md`, `package.json:10`).
  - `squashRecordDiffsMutable` (`packages/store/src/lib/RecordsDiff.ts:228-344`) cancels added-then-removed records (`:331-334`). An **update A→B→A stays an update**: `existing[1] = to` never compares with `existing[0]` (`:310-317`).
  - That is the gap Qt's obsolete rule closes. **Do not take tldraw's squash as the toggle rule.**
- **Kafka** at `c553733`, Apache-2.0. `LogCleaner` doc (`storage/src/main/java/org/apache/kafka/storage/internals/log/LogCleaner.java:47-94`):
  - "A message with key K and offset O is obsolete if there exists a message with key K and offset O' such that O < O'". This is keep-last-per-key.
  - "The active log segment is always uncleanable".
  - "We do not clean beyond the last stable offset".
  - Tombstones (null payloads) are kept for a delete horizon.

  The take-away for ADR-036: compaction is keep-last-per-key over a **closed** range. The open session tail after the last `saved-here` is the "active segment" and is never compacted, and a removal (the toggle back to the original) needs to cancel rather than be kept as a tombstone, because the lineage has no consumer that needs a delete marker (inference).
- **Kafka's counter-lesson:** keep-last-per-key **across the whole log** would collapse two colour edits separated by a filter step. That is wrong if order matters, for example a style that depends on a filtered field. Qt's adjacency rule is the safer default, and keep-last-across-gaps is only safe for actions whose effect is independent of intervening steps. The registry could declare that per action (inference).
- **Reuse mode:** ProseMirror and CodeMirror **CONCEPTUAL DONOR** (MIT). tldraw **REJECT** (editor licence red; store squash lacks the toggle rule). Kafka **CONCEPTUAL DONOR** (Apache-2.0).

### 3.7 nbformat (jupyter/nbformat) — forward compatibility that keeps the unknown

- **Repository:** github.com/jupyter/nbformat at `4346f97` (2026-08-24). **Licence:** BSD-3-Clause (`LICENSE:1-4`). It has tests (51 files under `tests/`).
- **How it works:**
  - The major version is `nbformat` and the minor version is `nbformat_minor` (`nbformat/v4/nbbase.py:19-23`; `reader.py:44-46`).
  - When a notebook's minor is newer than the reader's, `get_validator` loads the latest schema, **relaxes every `additionalProperties: false`**, and **adds `unrecognized_cell` and `unrecognized_output` arms** (`nbformat/validator.py:80-84`, `_relax_additional_properties` `:36-47`, `_allow_undefined` `:50-53`). The schema defines `unrecognized_cell` as "Unrecognized cell from a future minor-revision to the notebook format": its `cell_type` is **not** one of the known ones, it has required `cell_type` and `metadata`, and it allows `additionalProperties: true` (`nbformat/v4/nbformat.v4.schema.json`, definitions).
  - For the known minor, the schema stays strict.
  - The writer uses `indent=1, sort_keys=True` (`nbformat/v4/nbjson.py:51-54`), so `.ipynb` is diffable line by line. Spatial IDE's project file is one canonical line (ADR-036 §2), which is valid JSON but not line-diffable. That is a tension with `docs/02_Architecture.md:48 @ 4561f3b8`'s "diffable", noted rather than ruled.
  - Duplicate cell IDs are repaired with a warning when `repair_duplicate_cell_ids` is set (`validator.py:356-380`).
- **The rule that fits "refuse unknown keys but never drop an unknown action":** nbformat's split is exactly the needed one.
  - The **envelope** is closed for the reader's own version, and a **newer `version` is refused** (ADR-036 already has this; nbformat refuses a newer major).
  - The **open slot is a single discriminated member**, the action name (nbformat: `cell_type`). Inside a step whose `intent.action` is not in the reader's registry **and** whose header `actions` is greater than the reader's, the reader validates the **step envelope** strictly (`id`, `parent`, `at`, `kind`, `effect`, `actor`, `dependencies`, `data`, `scope`, `links` all closed and all known) and treats `intent.params` as **opaque**: bounded, parsed for duplicate keys and the number grammar, but not checked against a parameter shape it does not have. The step is kept byte-for-byte and shown "recorded by a later version".
  - An unknown action when the header's `actions` is **not** greater than the reader's is a refusal, not an unknown. This keeps "unknown keys refused" true everywhere except the one slot the vocabulary version opens.
  - nbformat relaxes *all* `additionalProperties` for a newer minor. Spatial IDE should **not** copy that part. ADR-036 increments `version` for any shape change, so only the action vocabulary is open-ended.
- **Two consequences for compaction and rewriting (inference):**
  1. A step with an unknown action has no collapse key the reader knows, so compaction must treat it as **non-mergeable and opaque**, and it also **ends any adjacent run** (it may set the same property).
  2. A writer that rewrites the lineage (§8 rewrites the whole file at each Save) must **carry unknown steps through unchanged**. KiCad does the same for settings: `formatFileContents` starts from `m_original`, the bytes as loaded (`kicad/common/settings/json_settings.cpp:288,562-575`).
- **Reuse mode:** **CONCEPTUAL DONOR.** **Avoided work:** small. **Timing:** **now**. ADR-036 §3's sentence needs this precision before acceptance.

### 3.8 KiCad `.kicad_pro` / `JSON_SETTINGS` (gitlab.com/kicad/code/kicad)

- **Repository:** at `05cc3ed` (2026-10-07), sparse. **Licence:** GPL-3.0-or-later (`LICENSE.README:1-3`; `json_settings.cpp` header "version 3 of the License, or (at your option) any later version"). Core-combinable copyleft (flagged). Concept use only.
- **How it works:**
  - The version lives in the file at `meta.version` (`json_settings.cpp:97`).
  - On load: if older, it runs `Migrate()`, a chain of registered `old→new` migrators that each step `meta.version` (`:303-316`, `:740-783`). If newer: `m_isFutureFormat = true` with a warning (`:317-322`), and `ShouldAutoSave()` returns false for a migrated or future file (`include/project/project_file.h:166`).
  - The project schema is at version 4 with migrators 1→2→3→4 (`common/project/project_file.cpp:40,322-324`).
  - On save, unknown keys survive, because it writes `m_original` overlaid with the known parameters (`:562-575`).
  - On Linux it registers `application/x-kicad-project` for `*.kicad_pro` (`resources/linux/mime/kicad-kicad.xml.in:3-9`) with `Exec=kicad %f` (`resources/linux/launchers/org.kicad.kicad.desktop.in:7,10`).
- **Take:**
  1. A migrator chain keyed by version, each step pure and tested, is the right shape for ADR-036's `version` bumps later.
  2. **Never auto-save over a file you migrated or could not fully understand.** For Spatial IDE: opening a newer `actions` vocabulary must never silently rewrite the lineage on a later Save without carrying the unknown steps (see 3.7).
- **Do not take:** KiCad's leniency toward newer files (it loads them with a warning). ADR-036 refuses a newer `version`, which is stricter and right for a file "from another person as often as from this machine".
- **Reuse mode:** **CONCEPTUAL DONOR.**

### 3.9 QGIS Processing history (qgis/QGIS)

- **Repository:** at `fa8f961` (2026-10-08), sparse. **Licence:** GPL-2.0-or-later (`COPYING`; file headers such as `src/core/layout/qgslayoutundocommand.h`: "either version 2 of the License, or (at your option) any later version"). Core-combinable copyleft as or-later (flagged).
- **How it records:**
  - At run start, `python/plugins/processing/gui/algorithm_widget.py:288-302` builds `{python_command, algorithm_id, parameters: alg.asMap(params, context), process_command?}` and `addEntry("processing", …)`. On completion it updates the entry with `results` (minus `CHILD_INPUTS`) and the HTML `log` (`:330-338`).
  - `asMap` (`src/core/processing/qgsprocessingalgorithm.cpp:435-457`) is `context.exportToMap()`, holding `distance_units`, `area_units`, `ellipsoid` and `project_path` (`src/core/processing/qgsprocessingcontext.cpp:193-205`). Hidden parameters are skipped. `inputs` maps each parameter to `def->valueAsJsonObject(...)`. **No CRS member and no input hash**: inputs are recorded as whatever the parameter serialises to (layer sources are paths or URIs; inference from `valueAsJsonObject`'s name, the parameter classes not read).
- **How it stores:** a per-profile SQLite `user-history.db`, table `history(id INTEGER PRIMARY KEY, provider_id TEXT, xml TEXT, timestamp …)`, with the entry map serialised as **XML** (`src/gui/history/qgshistoryproviderregistry.cpp:44-60,107-131,268-271,319-322`). It is outside the project and never travels with it.
- **Replay:** double-click rewrites `processing.run(` into `processing.execAlgorithmDialog(` and executes the Python, which reopens the dialog **prefilled**, not a silent re-run (`src/gui/processing/qgsprocessinghistoryprovider.cpp:111-134`). It errors if the algorithm provider is missing (`:116-120`).
- **Why it matters:** it confirms ADR-036's split. QGIS's history is machine-local (like Spatial IDE's session history) and records **intent** (algorithm ID and typed parameters) plus **context units**. That is roughly ADR-036's `intent` + `params` with units. The "replay" is "open the action prefilled for the user to confirm", which is a model for the later "apply this workflow to other data" that does not need replay to be pure.
- **What not to take:**
  - Absolute paths in `inputs` and `project_path`. ADR-036 §2 forbids them.
  - XML in SQLite.
  - The Python string as the replay vehicle.
- **Reuse mode:** **CONCEPTUAL DONOR.** **Timing:** park until workflows (Alpha). The units-in-context point is already covered by ADR-036's `{"value","unit"}`.

### 3.10 serde_json 1.0.151 duplicate keys, and `spatial_renderer::canonical` (Q6)

- **Repository:** github.com/serde-rs/json at `afdf6fc` (2026-08-07), version 1.0.151 (`Cargo.toml:3`), the version Spatial IDE locks (`Cargo.lock:1744-1745 @ 4561f3b8`). **Licence:** MIT OR Apache-2.0.
- **Verified behaviour:**
  1. **Into `Value`: last one wins, silently.** `ValueVisitor::visit_map` calls `values.insert(key, value)` for each entry (`src/value/de.rs:136-144`), and `Map::insert` returns the old value without error (`src/map.rs:127-129`). This is what `dataset_ref.rs`'s header already says.
  2. **Into a `#[derive(Deserialize)]` struct: refused.** serde_derive emits `duplicate_field(name)` when a field is seen twice (serde `6693a89`, `serde_derive/src/de/struct_.rs:268-270`, `:570-572`). So a reader written as serde structs with `deny_unknown_fields` (which Spatial IDE already uses in 45 places, e.g. `protocol/skp/src/v0/error.rs:16 @ 4561f3b8`) **does** refuse duplicates and unknown keys. That covers all members except **inside maps whose keys are data** (e.g. `params` if typed as a map), where duplicates still collapse.
  3. **Recursion is bounded** at 128 by default (`src/de.rs:63`), and integers overflowing `u64` fall back to `f64` (`:486-490`, `:542-544`). There is no 2^53 bound, which ADR-036's own reader adds (`kernel/src/dataset_ref.rs:462 @ 14acee0b`).
  4. **Float parsing is not exact by default.** Without the `float_roundtrip` feature, `f64_from_parts` multiplies by powers of ten (`src/de.rs:638-663`). The crate itself says the feature is what makes "f64 -> JSON -> f64 produce output identical to the input" (`Cargo.toml:66-73`). Spatial IDE does not enable it (`rg float_roundtrip` in its tomls is empty). **Concrete deficiency (inference, untested):** a reader that verifies canonical form by re-serialising through `canonical::write_double` could reject a correctly written double that `serde_json` parsed one ULP off.
- **`spatial_renderer::canonical` owns the writer side completely** (grammar, duplicate refusal on write, the hash), and **owns no reader**. Duplicate refusal on read, the number grammar on read (no exponent, at least one fractional digit for doubles, minimal integers), and "one spelling per value" are **not** checked by any reader today.
- **RFC 8785 crates:** `serde-json-canonicalizer` (`cf6a483`, MIT) is a writer whose `pipe()` parses through `serde_json::Value` (`src/util.rs:68-71`). `serde_jcs`, `json-canon`, `olpc-cjson` and `canonical_json` are writers by description (crates.io, 2026-10-08). None offers a strict reader, and the JCS number grammar (ECMAScript, exponents allowed) is not Spatial IDE's (`renderer/src/canonical.rs:17-20 @ 4561f3b8`). **None replaces an owned component.**
- **Recommendation:** keep `canonical` and **add the reader half to the same module** (owned; small). Then a reader refuses a file that does not re-serialise to itself byte for byte, after a strict parse that refuses duplicates. Before relying on byte round-trip, either enable `serde_json`'s `float_roundtrip` (a feature on an existing dependency, still the human's call) or parse number tokens with the module's own grammar. This is the only concrete deficiency found, and it is a gap, not a defect in an owned component.
- **Reuse mode:** serde_json **ADOPT** (already adopted). Serde derive with `deny_unknown_fields` is the reader skeleton. JCS crates **REJECT**. The canonical reader is **worth owning**.
- **Timing:** before `b2-piece-1c-save-and-reopen`, the first reader of a file another person wrote.

### Shallow notes (not dossiers)

- **OpenLineage** (`9f9c4cb`, Apache-2.0). The spec version is in `$id` (`https://openlineage.io/spec/2-0-2/OpenLineage.json`) and follows SchemaVer MODEL-REVISION-ADDITION (`spec/Versioning.md`). Every facet carries `_producer` (a URI of the producing code) and `_schemaURL` (`spec/OpenLineage.json` `$defs/BaseFacet`), with `additionalProperties: true`. Take-away: recording **which producer wrote a step** is cheap and helps "recorded by a later version". ADR-036's header `actions` integer already identifies the vocabulary. Whether a step should also carry a producer version string is a question for the human (it would be a new member, so a version-1 decision now). OpenLineage's open `additionalProperties` is the opposite of ADR-036 §2.
- **PROV-JSON** (W3C Member Submission, 24 April 2013; WebFetch). It has no version field and no rule for unknown keys; extension is via namespaced terms. It does not fit the strict-reader requirement. **REJECT** as a format; it remains a vocabulary reference only.
- **DVC `dvc.lock`** (`56e5982`, Apache-2.0).
  - It has `schema: "2.0"` checked by equality (`dvc/schema.py:48-49`: `vol.Equal("2.0", "invalid schema version")`).
  - It holds one entry per stage, **keyed by stage name and overwritten in place** (`dvc/dvcfile.py:440-450`). That is compaction by key with the stage as the key, keeping only the last run.
  - Each dep or out is `{path, hash: "md5", md5, size…}`, sorted by path (`dvc/stage/serialize.py:155-190`).
  - Take-away: DVC's lock is a snapshot of the last run per key, not a history. That fits Spatial IDE's lineage-after-compaction view, and its sorted, path-plus-hash input list is close to the `data` member's `{"dataset", "identity": {content_hash}}`. **CONCEPTUAL DONOR**, park.
- **Excalidraw** (`4c00f31`, MIT). `restoreElement` keeps unknown properties ("spread the original element properties to not lose unknown ones for forward-compatibility", `packages/excalidraw/data/restore.ts:500-503`) but **returns null for an unknown element type** (`:747-751`, "Don't use default case so as to catch a missing an element type case"). That is the exact behaviour ADR-036 §3 forbids for actions. It is a named counter-example.
- **tldraw store migrations** (MIT). `MigrationFailureReason.TargetVersionTooNew` and `UnknownType` (`packages/store/src/lib/migrate.ts:534-541`) refuse rather than drop. This is consistent with ADR-036's version refusal.

---

## 4. "Do not reinvent" and "worth owning"

**Do not reinvent:**

- Spatial IDE should not implement OS file-type registration from scratch, because **Tauri's bundler** already writes the Windows ProgID and `shell\open\command` (NSIS/MSI), the macOS `CFBundleDocumentTypes` and `UTExportedTypeDeclarations`, and the Linux `.desktop` `MimeType`, under **Apache-2.0 OR MIT**. The exception is the Linux shared-mime-info glob, which Tauri does not ship and Spatial IDE must add via `deb.files` and `postInstallScript`. This holds unless a packaging target outside Tauri's bundler is adopted.
- Spatial IDE should not implement cross-process single-instance IPC (named mutex + `WM_COPYDATA`, D-Bus name, Unix socket), because **`tauri-plugin-single-instance`** provides it under **Apache-2.0 OR MIT**, with `zbus` and `windows-sys` already in the shell's lock. This holds unless the human rules for a second process per double-click, or for a kernel-level ownership lock that subsumes it.
- Spatial IDE should not write its own general JSON tokenizer for the strict reader, because **serde/serde_json**, used through derived structs with `deny_unknown_fields`, already refuse unknown and duplicate struct fields and bound recursion under **MIT OR Apache-2.0**. This holds unless the number-grammar check needs token-level access, in which case `canonical`'s own grammar is the place, not a new dependency.

**Worth owning:**

- **The canonical JSON reader half** (strict parse plus round-trip to the owned writer), in `spatial_renderer::canonical`. It still borrows serde_json for tokenising.
- **The action registry and collapse-key semantics.** It borrows the concept from Qt `QUndoCommand::id()/mergeWith()/setObsolete()` (LGPL-3.0-only/GPL; no code), QGIS's (key, target) check, and nbformat's "unrecognised cell" slot.
- **Project identity resolution (copy/move/ask).** It borrows Godot's existence-test rule and VS Code's reverse-pointer file.

---

## 5. Proposed ADR-036 text points (for the architect and the human; nothing here is a ruling)

1. **§1 OPEN, name and extension:** a single-segment, unique extension; not `.json` last, and not `.spatial.json`, which still resolves as `.json` on Windows and macOS. Prefer a **fixed filename** (Godot `project.godot`) given "one project per folder". The content stays canonical JSON with `format: "spatial-project"`. On macOS, `exportedType.conformsTo: ["public.json"]`. On Linux, ship the MIME XML.
2. **§4, the discriminator:** "first folder still exists" means a project file at the identity's last-known folder still carries this identity (re-read, not only `exists`). Always re-key the newly opened folder. A reverse-pointer file in each machine-side per-identity directory records the last-known folder. State the **two-processes, one-identity** case (or rule for single-instance).
3. **§6, collapse key:** the key is (action, property, target) where the target is the layer or dataset reference, not the property alone (Qt + QGIS). Rules:
   - merge only adjacent steps with equal keys;
   - keep the first parent and the last value;
   - a merge whose value equals the value before the run removes the run (toggle);
   - **never merge across a `saved-here` mark**, and compaction never touches steps after the last mark (Qt clean index, Kafka active segment);
   - a step whose action is unknown is opaque, never merged, and ends a run.
4. **§3, the forward-compatibility rule:** unknown keys are refused everywhere except `intent.params` of a step whose `intent.action` is not in the reader's registry **and** whose header `actions` is greater than the reader's. That step's envelope is validated strictly, its params are kept opaque (bounded, duplicate-checked, number-grammar-checked), it is shown "recorded by a later version", and it is written back unchanged when the lineage is rewritten (nbformat `unrecognized_cell`, KiCad `m_original`; Excalidraw is the counter-example). An unknown action at an `actions` value the reader implements is refused.
5. **§2:** "duplicate keys refused" needs a reader that is not `serde_json::Value`. Derived structs with `deny_unknown_fields` cover struct members. Map-shaped members and the byte round-trip need the canonical reader. Decide `float_roundtrip` before relying on byte round-trip.

---

## 6. What I could not verify

- **The OS extension-resolution rules** were not read in Windows or macOS source. The "last extension" behaviour for Windows comes from Wine's `PathFindExtensionW` (an inference aid), and for macOS it is from memory and documentation, not source. **Not tested on any machine.**
- **KDE's handling of `Exec` without a field code** is GLib's comment, not KDE source.
- **macOS delivery of a second Finder open to the running instance as `Opened`** (tao) was not read in tao's source.
- **Whether any candidate extension is already registered** by a common application was not checked.
- **Godot GH issues** (GH-83843, godot-proposals discussion 8949) and **Tauri PRs** (#3736, #7440, #14128, #14486) are cited from commit messages and changelogs only. github.com issue and PR pages are disallowed to WebFetch here.
- **Unity `.meta` duplicate handling:** no open source exists. Only Unity's issue tracker describes it, which is not evidence of mechanism. **Obsidian:** closed source; nothing read.
- **The `serde_json` float discrepancy** is inferred from source and the crate's own doc comment. No value was tested (rule 1: nothing run).
- **QGIS `valueAsJsonObject`** for layer parameters was not read, so "inputs are paths or URIs" is inference.


## Errata from the independent check (2026-10-08)

- VERIFICATION-A row 6: the substance holds (the NSIS bundler writes the association registry entries; Tauri ships no Linux MIME glob), but the entries are per-user only under `installMode: currentUser` (which Spatial IDE uses); `perMachine` writes HKLM. The install-time setting is at `installer.nsi:498` → `utils.nsh:3-8`; the cited `installer.nsi:882` is in the uninstaller.
