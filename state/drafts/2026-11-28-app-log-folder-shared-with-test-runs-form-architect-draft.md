# The shared log folder's form: the architect's draft (node:app-log-folder-shared-with-test-runs@form-draft)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`, items 4 and 6 (e). The architect (Opus) read D:/wt/read-1127c at 45ef4cc3 and B's head 5ce0525a at D:/wt/reload, read only. By the facts script its records run from 2026-11-27T23:28:53Z to 2026-11-27T23:38:08Z; by its completion notice it took 554201 ms and 69 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed: 19308 bytes, sha256 4188314536a857fd88d6025d22809a707037f9b7cee9337bc246bf6b367d4fa9. The date in this path, 2026-11-28, is the one its brief named, typed from the local date; by date -u the draft was made on 2026-11-27. Its OPEN items (OPEN-1 to OPEN-6) go to the advisor. A draft: not a gate, and not yet a form.*

---

REPORT PATH: state/drafts/2026-11-28-app-log-folder-shared-with-test-runs-form-architect-draft.md

# The shared log folder's form: the architect's draft (ADV-2026-11-27-37 item 6, place (e))

Node `app-log-folder-shared-with-test-runs`, at `node:app-log-folder-shared-with-test-runs@form-draft`. This is a draft only: it carries no verdict and no gate.

Checkouts:
- [G] is D:/wt/read-1127c, detached at 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6.
- [R] is D:/wt/reload, B's head 5ce0525a.

The pinned crate sources were read under the cargo registry: tauri-2.11.5, which resolves to D:/caches/cargo-registry.

No hashes are computed here, because this run had no shell. The custodian pins every cite at commit time. Everything below is my paraphrase unless it is marked verbatim.

## 0. Facts read

- **Today's folder.** The folder is set at [R] `frontends/shell/src-tauri/src/lib.rs:389-392`: `app.path().app_log_dir()`, with a fallback to the temp folder joined with `spatial-ide-shell-logs`.
  - tauri 2.11.5 resolves this on non-macOS as `dirs::data_local_dir()` joined with the identifier and `logs` (`tauri-2.11.5/src/path/desktop.rs:284-287`). On macOS it is `~/Library/Logs/<id>` (`:279-282`).
  - The identifier is `dev.spatialide.shell` ([R] `frontends/shell/src-tauri/tauri.conf.json:5`).
  - The rest of the chain to the known-folder call is in B's form §0 item 4 ([G] `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md:102-107`).
  - B's form cites `lib.rs:326-329`. That is the base's line numbering. At B's head the same code is at `:389-392`.
- **The store's rule, already in the shell's dependencies.** `spatial_engine::app_dirs::user_data_dir()` is a `pub fn` ([R] `engine/src/app_dirs.rs:108-110`, in a `pub mod`, [R] `engine/src/lib.rs:101`).
  - On Windows it returns `LOCALAPPDATA` only when the value is non-empty and absolute, and `None` otherwise ([R] `engine/src/app_dirs.rs:69-77`, `:82`).
  - It already has a product caller in the kernel ([R] `kernel/src/permission/audit/log.rs:377-379`). The publish audit log's default follows the same variable ([R] `kernel/src/permission/audit/log.rs:8-12`).
  - `spatial-engine` is already a dependency of the shell ([R] `frontends/shell/src-tauri/Cargo.toml:71`).
- **How a log file is opened.** `SessionLog::open` runs `create_dir_all`, then creates and appends to `session-<unix seconds>.log` ([R] `frontends/shell/src-tauri/src/state.rs:41-51`). It never moves, changes or deletes an existing file.
- **Suites that set the variable.** These suites set `LOCALAPPDATA` to a scratch folder:
  - [R] `frontends/shell/e2e/colour.mjs:30`
  - [R] `frontends/shell/e2e/project.mjs:66`
  - [R] `frontends/shell/e2e/recording.mjs:50`
  - [R] `frontends/shell/e2e/reopen.mjs:36`
  - [R] `frontends/shell/e2e/second-open.mjs:29`
- **Those suites read no session log.** Only these read it, and they do not set the variable. They read `process.env.LOCALAPPDATA`\dev.spatialide.shell\logs:
  - [R] `frontends/shell/e2e/regression.mjs:2043-2044`
  - [R] `frontends/shell/e2e/residency-harness.mjs:107`
  - [R] `frontends/shell/e2e/source-changed.mjs:522-524`
  - [R] `frontends/shell/e2e/source-watch-idle.mjs:133-135`
- **How each scratch folder is removed.** `project.mjs`, `colour.mjs`, `reopen.mjs` and `second-open.mjs` remove their scratch folder on every run, failing runs included:
  - [R] `frontends/shell/e2e/project.mjs:17`, `:94-101`
  - [R] `frontends/shell/e2e/colour.mjs:377-380`
  - [R] `frontends/shell/e2e/reopen.mjs:58-61`
  - [R] `frontends/shell/e2e/second-open.mjs:119-122`

  `recording.mjs` removes its scratch folder only after a passing run ([R] `frontends/shell/e2e/recording.mjs:397-401`).
- **The finding was also observed.** Three runs with the variable set to a scratch folder found no `dev.spatialide.shell` folder in scratch ([R] `state/consults/2026-11-24-finding-the-shells-session-log-does-not-follow-a-changed-localappdata.md:5`).

## 1. The form (on B's head, at `governance/forms/frontends/APP-LOG-FOLDER-SHARED-WITH-TEST-RUNS-PREREGISTRATION.md`)

**It fits five lines, on my reading.**
- None of ADV-2026-11-16-06 item 2(a)'s categories is touched. AUTONOMY §21c's bounds hold at the recommended Scope ([G] `governance/AUTONOMY.md:350-351`).
- Two doubts are disclosed in the form and go to the advisor as OPEN-1:
  - the new call into engine's existing function;
  - §21c's user-visible bound, which is reached only under a changed variable.
- If OPEN-5 adds a ninth file, §21c's eight-file bound rules the five lines out. In that case the full form is written before any code.

````text
# The app's session-log folder follows a suite's LOCALAPPDATA -- five-line short form (`AUTONOMY.md` §21d)

Committed before any code, per the short-form discipline.

```
Authority: PLAN node app-log-folder-shared-with-test-runs; ADV-2026-11-26-17 item 5; ADV-2026-11-26-23 items 4 and 5; ADV-2026-11-27-37 items 4 and 6 (e); the finding as read in governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md §0 item 4; built on B's head 5ce0525a, merges after B; AUTONOMY.md §21d
Scope: frontends/shell/src-tauri/src/state.rs, frontends/shell/src-tauri/src/lib.rs (the log-folder block only), frontends/shell/e2e/recording.mjs, frontends/shell/e2e/project.mjs, frontends/shell/e2e/colour.mjs, frontends/shell/e2e/reopen.mjs, frontends/shell/e2e/second-open.mjs (each of these four: its folder-removal function only), frontends/shell/e2e/README.md (the session-log-path paragraph and the recording.mjs entry); declared line budget <= 150 insertions + deletions, tests included, by git diff --numstat <merge-base>...<head> excluding this form, governance/PLAN.yaml and state/**
Change: on Windows the session log is written in <LOCALAPPDATA>\dev.spatialide.shell\logs when spatial_engine::app_dirs::user_data_dir() resolves (LOCALAPPDATA non-empty and absolute, the rule the store already follows), and otherwise in Tauri's app_log_dir() and then the temp folder, as today; other platforms keep Tauri's folder; each suite that sets LOCALAPPDATA keeps its run's session log in e2e/out/ before it removes its scratch folder
Tests+mutation: U-1 (state.rs) "the session-log folder is the data directory's dev.spatialide.shell\logs when one resolves, and Tauri's folder is not asked" -- mutation: the function tries Tauri's folder first, the base's order; fails with left Tauri's path, right the data directory's; U-2 (state.rs) "with no data directory the folder is Tauri's, and the temp folder's spatial-ide-shell-logs only when Tauri's fails too" -- mutation: the no-data-directory arm returns the temp folder without asking Tauri; fails at its first assertion; E-1 (recording.mjs, step LOG after RECORD) "exactly one session-<digits>.log under <scratch>\dev.spatialide.shell\logs, holding a line with `data-plane expected origin (config mirror): `, copied to e2e/out/" -- mutation: lib.rs's call restored to the base's app.path().app_log_dir(); fails at LOG, naming no dev.spatialide.shell\logs under the scratch folder (predicted from the three runs of the 2026-11-24 finding)
Out-of-scope: no ADR status line or amendment; no security posture (ADR-020/ADR-009/ADR-021): the log's folder follows the variable that already steers the store and the publish audit log's default (kernel/src/permission/audit/log.rs:8-12, :377-379), the log's lines, their rule and the redaction are unchanged (state.rs:21-34, :58-95), and no command, capability, origin, CSP or data-plane line is touched; no wire (protocol/** untouched); no stated guarantee or invariant changed. Disclosed, not denied: one new call from frontends/shell into engine's existing, unchanged pub fn user_data_dir (engine/src/app_dirs.rs:101-110), proven from the real shape by E-1; and a change of folder visible only when LOCALAPPDATA differs from the profile's known folder, which ordinary use does not set
```
````

- **The verbatim span.** The text inside the backticks on the Tests+mutation line, `data-plane expected origin (config mirror): `, is byte-copied from [R] `frontends/shell/src-tauri/src/lib.rs:481`, a sub-line span; it carries line 481's hash. The custodian marks it verbatim and pins it with a hash at a commit on main once B has merged. Until then the pin names B's head commit id, under the Round 25 rule.
- **Bare line numbers inside the form.** The `:line` cites in the five lines point into files this piece edits (`state.rs`), or into files at B's head. The custodian turns them into `@ <rev> sha256:` pins before the commit, so that no bare self-line is left (round 14).
- **Estimated size: about 135 lines across 8 files.**

  | File | Lines (about) |
  |---|---|
  | `state.rs`: the function and its doc | 18 |
  | `state.rs`: U-1 and U-2 | 45 |
  | `lib.rs` | 12 |
  | `recording.mjs` | 36 |
  | the four copies | 20 |
  | `e2e/README.md` | 5 |

  An overrun is class 6 under §21b's mid-piece clause, with the Scope not edited.
- **The order of the commits.**
  1. The E-1 step, alone, as the red commit. It is predicted red at B's head.
  2. Then the code.
- **E-1 is the e2e test from the real shape that the seam rule asks for.** It uses the real app, the real process environment and the real file. The unit tests do not stand in for it.

**The README words. These are not the human's wording: they are a worker's README line, and the worker applies them with no re-gate.**
- The current span at [R] `frontends/shell/e2e/README.md:554`, which I byte-copied and mark verbatim: `(Tauri's own `app_log_dir()`, called in `lib.rs`'s `setup()`; the`
- The replacement: `(on Windows the shell's own resolution in `lib.rs`'s `setup()`: the `LOCALAPPDATA` variable when it is a non-empty absolute path, as for the store, else Tauri's `app_log_dir()`; the`
- The clause check:
  - "non-empty absolute": `engine/src/app_dirs.rs:69-77`, `:82`.
  - "as for the store": `kernel/src/permission/audit/log.rs:377-379`.
  - "else Tauri's": the proposed code.
- [R] `frontends/shell/e2e/README.md:784` gains one sentence: the session log too lands in `<scratch>\dev.spatialide.shell\logs`. `:786` gains `LOG`.

**Shared paths under rule (00) that I can see.** The custodian completes this list by script.

| Path | Shared with |
|---|---|
| `lib.rs` | **B**, the base, which merges first. **The recovery offer**: its form cites `lib.rs:13-18` and `:616-639` at 5ce0525a ([G] `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md:2785-2786`); this piece's region is `:382-392`, but whether those lines are in the recovery offer's Scope, I did not establish. **The reload keys** (`reload-asking-first-or-off-in-the-installed-build`): no form yet, and it is built on B's head. |
| `state.rs` | No open piece's Scope that I saw (cites only). |
| `recording.mjs` | None seen. |
| `project.mjs` | B ([G] `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md:367`). A-second-save, whose node is in progress at [G] `governance/PLAN.yaml:7933` ([G] `governance/forms/frontends/A-SECOND-SAVE-IS-ANNOUNCED-PREREGISTRATION.md:78`). Milestone 5 ([G] `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:87`); its status I did not read. |
| `colour.mjs`, `reopen.mjs`, `second-open.mjs` | A-second-save ([G] `governance/forms/frontends/A-SECOND-SAVE-IS-ANNOUNCED-PREREGISTRATION.md:79`). `reopen.mjs` also milestone 5 ([G] `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:93`). |
| `e2e/README.md` | B (the Project entry). The list at [G] `governance/forms/frontends/A-SECOND-SAVE-IS-ANNOUNCED-PREREGISTRATION.md:362`: PR A, PRs 359, 363, 365 and 366, the identity route, text-id and B. |

No `protocol/` path is touched.

## 2. The human's installed build, before and after (read from the source)

- **Before.** The folder is `SHGetKnownFolderPath(FOLDERID_LocalAppData)`\dev.spatialide.shell\logs, with `%TEMP%\spatial-ide-shell-logs` used only when that lookup fails. The variable is not read on that path. The citations are §0 above, and B's form §0 item 4.
- **After.** On Windows the folder is the `LOCALAPPDATA` variable joined with `dev.spatialide.shell\logs`, when the variable is a non-empty absolute path. Otherwise it is the same chain as before. The folder name and the file-name rule are unchanged ([R] `frontends/shell/src-tauri/src/state.rs:43-47`).
- **Do a sitting's logs move? No.**
  - The code moves, changes and deletes nothing that is already there ([R] `frontends/shell/src-tauri/src/state.rs:41-51`).
  - For an installed build started in an ordinary logon, the variable and the known folder name one folder. That is Windows behaviour, outside these sources. It is not established by this read.
  - If the two ever differ, new logs go where the store already goes, and the earlier logs stay where they are.
- **What still writes in the human's folder.**
  - Every suite that does not set the variable still writes there, through lib.mjs's default environment ([R] `frontends/shell/e2e/lib.mjs:196`, `:278`).
  - The WebView2 data of every launch also still lands there, the five suites' launches included (OPEN-6).
  - So the change separates the five scratch suites' logs only.
- **The walkthrough.** Its rows name `%LOCALAPPDATA%\dev.spatialide.shell\logs` (for example [R] `frontends/shell/MANUAL-WALKTHROUGH.md:892`, `:896`, `:959`, `:1482`, `:1556`). They stay true, and are now true by construction. No row needs words (see OPEN-4).
- **KNOWN-LIMITATIONS.** No item names the log folder. Its `LOCALAPPDATA` text is about the session store and the project store ([R] `KNOWN-LIMITATIONS.md:442-443`, `:511`). Nothing is needed there.
- **A record that this piece makes stale.** B's §6 says that pointing TMP at D: moves SCRATCH but not the log ([G] `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md:350`). For the five suites that sentence becomes stale after this piece. B's form is immutable, so this form's closing names it.

## 3. OPEN items (for the advisor; none is decided here)

**OPEN-1: is the five-line form the right one?**
- Facts:
  - The diff stays in `frontends/shell`.
  - It adds a call to engine's existing, unchanged `pub fn user_data_dir`, which is already in the shell's dependencies. The shell already calls `spatial_engine` in product code ([R] `frontends/shell/src-tauri/src/lib.rs:351-352`).
  - ADV-2026-11-16-06 item 2(a) lists "a piece that crosses a seam between modules", and its 2(b) says that in doubt the piece takes the full form.
  - §21c's no-new-user-visible-behaviour bound is reached only under a changed variable.
- Options:
  - (a) Five lines and the reviewer alone, with the call and the bound disclosed.
  - (b) The full form and both gates.
- Recommendation: (a). The interface is consumed as it is, and E-1 proves it from the real shape.

**OPEN-2: which platforms change?**
- Facts:
  - On macOS, Tauri puts the folder in `~/Library/Logs/<id>`, while `user_data_dir` gives `~/Library/Application Support` ([R] `engine/src/app_dirs.rs:83`).
  - [R] `governance/MACOS-BRINGUP.md:87-92` documents Tauri's macOS path.
- Options:
  - (a) Windows only, with one `cfg!(windows)` at the call site.
  - (b) Every platform. macOS logs would then move, MACOS-BRINGUP becomes untrue, and fixing it is a ninth file.
- Recommendation: (a).

**OPEN-3: the logs of the four always-removed scratch folders.**
- Facts: after the change, the logs of `project.mjs`, `colour.mjs`, `reopen.mjs` and `second-open.mjs` are deleted with their scratch folder (§0). B §6's practice of copying the run's new log to the evidence ([G] `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md:356`) would then no longer work for them.
- Options:
  - (a) Each suite copies `<scratch>\dev.spatialide.shell\logs` into `e2e/out/` before removing the folder. That is four files and about 20 lines, all shared paths (§1).
  - (b) Not now. The README says that those suites' logs go with their scratch folder, and a follow-up node is placed. The Scope drops to 4 files.
  - (c) The suites keep the logs folder and remove the rest.
- Recommendation: (a).

**OPEN-5: `colour-refill.mjs` on PR 365's branch.**
- Facts:
  - It is in neither checkout.
  - By [R] `state/consults/2026-11-24-finding-the-shells-session-log-does-not-follow-a-changed-localappdata.md:8`, its fix reads the profile's folder.
  - If it also sets the variable, this piece leaves its own run's log in scratch, so it finds no log, or a stale one.
- Options:
  - (a) The custodian reads it at PR 365's head before this form is committed. If it needs a change, it is a ninth file and the full form follows (§21c), or OPEN-3 (b) leaves room.
  - (b) PR 365 merges first, and its change is this piece's class 9 before code.
- Recommendation: (a).

**OPEN-4: words for the walkthrough or KNOWN-LIMITATIONS.**
- Facts: by §2 nothing that is stated becomes untrue. Suites that do not set the variable still write in the human's folder.
- Options:
  - (a) No words.
  - (b) One walkthrough line saying that a test run made during a sitting may leave a newer log there. Its words would come to the advisor under ADV-2026-11-16-06 item 2(b).
- Recommendation: (a).

**OPEN-6: the WebView2 data folder, which ADV-2026-11-26-23 item 4 left with this piece.**
- Facts:
  - Tauri forces the data folder from the LocalData base when none is given (`tauri-2.11.5/src/manager/webview.rs:534-545`).
  - The config's `data_directory` is accepted only as a relative path under the local data folder (`tauri-2.11.5/src/webview/mod.rs:392-424`, read only through the lines a search returned).
  - lib.mjs already gives B's second instance its own folder through `WEBVIEW2_USER_DATA_FOLDER` ([R] `frontends/shell/e2e/lib.mjs:333`).
  - The advisor's search found no page storage in use.
- Options:
  - (a) Out of this piece, recorded.
  - (b) The suites set `WEBVIEW2_USER_DATA_FOLDER` into their scratch folder. That is a test-only change, but it adds more files.
  - (c) A product change to the main window's data folder. That touches window creation, close to ADR-020's config and origin, and would take the full form.
- Recommendation: (a).

## 4. New crate, Cargo feature or lockfile

None. `spatial-engine` is already a dependency ([R] `frontends/shell/src-tauri/Cargo.toml:71`). No feature changes, and no lockfile change is expected.

## Findings outside the form

- **Two launches in the same second share one file.** Two launches in one second append to one file, because the stamp is in seconds and the file is opened to append ([R] `frontends/shell/src-tauri/src/state.rs:43-51`). `second-open.mjs` starts two apps. This was true before the change as well, and it bears on the finding's "told apart by their stamps alone". It is not for this piece.
- **The engine's caller list.** [R] `engine/src/app_dirs.rs:104-107` lists that function's product callers. After this piece the list is incomplete, but not untrue, because it does not say "only". I recommend no edit, so that the diff stays in one module.
- **The posture question.** Under ADV-2026-11-26-18 item 3, the reviewer's report says whether the piece changes the security posture. This draft offers "no change", resting on the lines in the Out-of-scope line above. The gate decides that, not this draft.
