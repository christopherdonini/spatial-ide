*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 22526 bytes, sha256 a0b9b79fda709af16dd6adb56e907af7474093fc8102b24d236801919ff25917, below the rule with one final newline added; calls Read 40, Grep 26, Glob 1, SubagentHandback 1, one errored (a Read of the form past the tool's size limit), from 2026-11-19T14:43:33Z to 2026-11-19T14:53:18Z by its transcript. A read for the advisor's one strings ruling at P3b-2's cut (ADV-2026-11-19-23 item 4; the 1c form's Amendment 43 item 20), at main c945a309; it drafts no word, and nothing in it is ruled by its filing. Its read that the shared reader repeats more than P-9's bound at main goes to the advisor before the cut, with the table.*

---

Table: b2-piece-1c-save-and-reopen P3b-2's strings, architect, at main c945a3097aff8db4face541a4d2917ec62583488

I read the main checkout only. Its HEAD at session start was c945a309, and nothing tracked was modified. I wrote no file. Unless a cell says it was byte-copied, every word in it is mine. Each example built from a format string is marked "(mine)". The OS error texts in the examples are Windows std text that I composed without running anything.

Example values used throughout (mine): identity `spatial://project/0123456789abcdef0123456789abcdef`; request folder `D:\work\parcels`; cancel key `reopen-1`; locator path `$.datasets[0].resource.locators[0].at`; segment `data`.

## The table

| # | Code (row of item 5 (c)) | Fields | Whole message, one example | True for a reopen, clause by clause | No-path rule (5 (d)) / P-9 bound |
|---|---|---|---|---|---|
| 1 | `skp.version_unsupported` (passes through, by `Open(e)`) | `got`, `supported` (`SkpError::version_unsupported`) | constructor format, byte-copied: ``"unsupported skp version `{got}`; this host speaks `{}`"``. Example (mine): ``unsupported skp version `skp/0.13`; this host speaks `skp/0.14` `` | True. Note: this code is raised by the command's version check before `open_project` runs (5 (c)'s own order). It does not come through `Open(e)`, because `begin_open` does not check the version. | No path. It repeats only the request's `skp` string, unescaped and unbounded. Those are request bytes, not file bytes. |
| 2 | `skp.malformed_cancel_key` (passes through, `Open(e)` from `SkpHost::begin_open`) | none (`SkpError::protocol`) | `parse_cancel_key` (`protocol/skp/src/v0/handles.rs`), byte-copied: `"not a valid cancel key: {s:?} (only [A-Za-z0-9_-] is admissible)"`. Example (mine): `not a valid cancel key: "reopen 1" (only [A-Za-z0-9_-] is admissible)` | True. | No path. It repeats the request's key, escaped by `{:?}`. No file bytes. |
| 3 | `skp.cancel_key_in_use` (passes through, `Open(e)` from `OpenRegistry::begin`); also the P-10 row | `cancel_key` | constructor, byte-copied: ``format!("cancel key `{key}` already names a live `open_dataset` call")``. Example (mine): ``cancel key `reopen-1` already names a live `open_dataset` call`` | **Untrue clause:** ``a live `open_dataset` call``, whenever the key is held by a live reopen. The registry is now shared through `begin_open`, so the same clause is also untrue on `open_dataset`'s own refusal when the holder is a reopen. True when the holder is an `open_dataset`. | No path. The key is validated at ≤64 bytes of `[A-Za-z0-9_-]`. No file bytes. |
| 4 | `engine.*` (passes through, `Open(e)` from `SkpHost::open_under` → `error_of`) | per `error_of`. Example `engine.crs_assertion_conflict`: `declared`, `asserted` | the engine's `Display`, unedited (P-11). Example (mine, from `EngineError::CrsAssertionConflict`'s format): `refused: the file declares CRS EPSG:2056 and the caller asserted EPSG:4326. A caller assertion is admissible only for a file that declares nothing` | **Clause in question:** "the caller asserted". At a reopen the assertion is the claim that `project.spatial` recorded, which `open_project` replays into `OpenDatasetRequest.crs_assertion`. This request did not carry it. `CrsUndeclared`'s "none was asserted by the caller" reads the same way. P-11 keeps the text unedited, so the advisor decides whether that stands. | **Yes:** the message may name the path the engine was given, which is the canonical target or the machine-recorded path. That is item 5 (d)'s named exception. **File bytes:** yes, from the data file and from the project file's recorded claim (`asserted`). I did not establish a bound by reading. P-11 names an exception for paths, and stop 10 names no exception for engine messages. The advisor reconciles the two. |
| 5 | `skp.unknown_dataset` (passes through, `Open(e)`: `open_under`'s admission check, and `open_project`'s own catalog check after the open) | `handle` | constructor, byte-copied: ``"no open dataset with handle `{handle}` (closed, or never opened this session)"``. Example (mine): ``no open dataset with handle `ds_00112233445566778899aabbccddeeff` (closed, or never opened this session)`` | **Untrue clause:** "or never opened this session". This call opened the handle. The handle is one the request did not carry and the client has not received. The case is reachable only if a close of that handle lands inside the call. That needs timing within one request, which ordinary use cannot reach. | No path. The handle is kernel-minted. No file bytes. |
| 6 | `engine.cancelled` (`Cancelled`, through `error_of(&EngineError::Cancelled)`) | none | `EngineError`'s `Display`, byte-copied: `Self::Cancelled => write!(f, "cancelled"),`. Message: `cancelled` | True. Note: `OpenFailure::Cancelled`'s own arm says `"the reopen was cancelled"`, and 5 (c) chooses `error_of`'s text instead. | No / none. |
| 7 | `skp.project_file_unreadable` (new, `ProjectFileUnreadable`) | `detail` | arm, byte-copied: `"{PROJECT_FILE_NAME} cannot be read: {e}"`. Example (mine): `project.spatial cannot be read: The system cannot find the file specified. (os error 2)` | True. **Missing:** 5 (c) does not say whether `detail` is the io error alone or the whole arm. | No. The io error's `Display` is the OS text, with no path. No file bytes. |
| 8 | `skp.project_file_refused` (`FileRefused`; an existing constructor) | `path`, `rule` | constructor, byte-copied: `format!("the project file would break a rule its reader holds: {path}: {rule}")`. Example (mine): ``the project file would break a rule its reader holds: $.format: `spatial-projekt` is not `spatial-project` `` | **Untrue clause:** "would break". At a reopen the file that is there breaks the rule, and nothing is about to be written. "would" holds only for the copy's `write_project`. "its reader holds" is true. | **Absolute path:** yes, as file bytes. Any string the file holds in an echoed position is repeated whole, a path included. **P-9:** the bound is exceeded at main (see below). |
| 9 | `skp.project_machine_record_refused` (new, M1; `MachineRecordRefused`) | `file`, `rule` | arm `"{e}"` → `MachineRecordRefused`'s `Display`, byte-copied: `write!(f, "{}: {}", self.file, self.rule)`. Example (mine): ``folders.json: $ (line 1): a duplicate key `first` `` | True as a fact about a read file. **Clause in question:** at a reopen the arm also carries refusals from the writers. For a relative `relink` the message reads (mine) `locations.json: data\x.parquet is not an absolute UTF-8 path`. That names `locations.json`, but the refused value is the request's `relink`, and the file is unchanged. | **Absolute path:** the writer arm (`stored_path`) prints only the request's own `relink`, or the request's folder when `std::path::absolute` fails, so no. The reader arms repeat keys, and a key can spell anything. **P-9:** exceeded at main (see below). |
| 10 | `skp.project_known_folders_full` (new, M2) | `project`, `count` | arm, byte-copied: `"{} remembers {count} folders, and no more can be added"`. Example (mine): `spatial://project/0123456789abcdef0123456789abcdef remembers 256 folders, and no more can be added` | True. `count` is always 256: `KnownFolders::from_bytes` admits ≤256 and `with_same` refuses at ≥256. | No path. The identity is read from the file, but it is validated: 50 bytes, lowercase hex, no control character. |
| 11 | `skp.project_open_elsewhere` (`OpenElsewhere`) | `project` | arm, byte-copied: `"{} is open elsewhere"`. Example (mine): `spatial://project/0123456789abcdef0123456789abcdef is open elsewhere` | **Clause in question:** "elsewhere". `LockRefused::Held` is "in this process or in another". When the holder is another open in this same process (a second reopen of an open project, or a save's entry still held), it is open here, not elsewhere. Ordinary use reaches this. | No path. Identity only: 50 validated bytes. |
| 12a | `skp.project_file_unwritable` (`MachineStore`, **the lock**) | `detail` (`what` and the error) | constructor, byte-copied: `format!("the project could not be written: {detail}")`. Arm: `"{what}: {source}"`. Example (mine): `the project could not be written: open.lock: Access is denied. (os error 5)`. **Raised by:** `ProjectLock::try_lock` (its `fs::create_dir_all` of the identity's folder, its `OpenOptions::open` of `open.lock`, or `File::try_lock`'s `TryLockError::Error`), mapped in `Projects::open_project`'s `LockRefused::Io` arm with `what: store::OPEN_LOCK`. | **Untrue clause:** "the project could not be written". Nothing was being written: `open.lock` is never written. `what` also names `open.lock` when the call that failed was the folder's creation. | No path. OS text. |
| 12b | same (`MachineStore`, **a read**) | same | Example (mine): `the project could not be written: folders.json: Access is denied. (os error 5)`. **Raised by:** `machine_document` → `read_bounded` (an error other than not-found): in `Projects::open_project` for `folders.json` (step 2, before the lock), and in `data_at` for `locations.json`. | **Untrue clause:** "could not be written". This was a read. "the project" also does not hold: the file is a machine-store file. | No path. OS text. |
| 12c | same (`MachineStore`, **a write**) | same | Example (mine): `the project could not be written: locations.json: Access is denied. (os error 5)`. **Raised by:** `write_machine_file`, through `machine(store::FOLDERS)` after the lock, and through `machine(store::LOCATIONS)` after the engine's open (a relink or a copy; the dataset is closed first). | **Untrue clause:** "the project". The reopen writes no project file here. The file that failed is the machine store's. | No path. OS text. |
| 13 | `skp.project_target_unresolvable` (`FolderUnresolvable`, P-6 (i)) | `folder`, the request's string | arm, byte-copied: `"{} cannot be resolved"` (the variant's path). Example (mine): `D:\work\parcels cannot be resolved` | True. It is not reachable in ordinary use: Amendment 36 item 9 requires the folder to change between step 1 and the data step. | No. The variant holds the `folder` argument, which equals the request's string if the command passes it unaltered. |
| 14 | same code (`TargetRefused`, `Unresolvable`) | `locator`, `segment` | arm, byte-copied: `write!(f, "{locator}: {segment} {fact}")`, fact `"cannot be resolved"`. Example (mine): `$.datasets[0].resource.locators[0].at: data cannot be resolved` | True: the resolver's arm covers both missing and unreachable. One code now carries three field shapes (rows 13, 14 and 19). | **Absolute path:** no. The segment holds no `\`, `:`, empty or control character (`in_canonical_form`). **P-9:** the segment is file bytes, up to 4,096 (the `at` string's ceiling). A single 255-character non-ASCII file name already exceeds 256 bytes. No control character can pass. Item 5 (d) allows the segment, but stop 10's bound does not exempt it. |
| 15 | `skp.project_target_through_link` (`ThroughLink`) | `locator`, `segment` | fact `"is a link"`. Example (mine): `$.datasets[0].resource.locators[0].at: data is a link` | True. | As row 14. |
| 16 | `skp.project_target_wrong_kind` (`NotADirectory` / `NotARegularFile`) | `locator`, `segment`, `expected` | facts `"is not a folder"` / `"is not a regular file"`. Example (mine): `$.datasets[0].resource.locators[0].at: parcels.parquet is not a regular file` | True. | As row 14. |
| 17 | (`TargetRefused`, `NotCanonical`; `TargetRefused`, `FolderUnresolvable`), unreachable | "the arm names `locator` only" | arms, byte-copied: `"{locator}: not canonical"` and `"{locator}: the folder cannot be resolved"` | **Missing:** 5 (c) gives these arms no code. The map is declared exhaustive with no wildcard arm, so each arm must still produce some code. | `locator` only; none. |
| 18 | `skp.project_file_unwritable` (`ProjectFileUnwritable`, the copy's `replace`) | `detail` | constructor as row 12, with `SaveError`'s `Display`. Example (mine): `the project could not be written: the temporary file: Access is denied. (os error 5)` | True: for a copy, the project file is what failed to be written. | No path. |
| 19 | `skp.project_target_unresolvable` (`PathNotUnicode`, P-12) | `detail`, no path | arm, byte-copied: `"{} is not a Unicode path"` with `p.display()`. Example (mine): `D:\work\parcels\da?a is not a Unicode path` | True. **Conflict:** 5 (c)'s rule says the message is this arm, built from the code's fields. This arm prints the checked path, but the fields hold no path, and 5 (d) says "sends no path". The two rules cannot both hold. Item 13 says no ordinary path reaches this arm. By my read, only `check_inside`'s canonicalized path can fail `to_str`, and only with non-UTF-8 directory names on disk. | **Yes** if the arm is used: the canonical target is an absolute path the request did not carry. **Missing:** what `detail` holds. |
| 20 | `project_file_names_another_project` (working name; O3; item 20 P-5) | item 20: "Its fields hold no folder and no path." No field is named positively. | **None at main.** No `SaveFailure` variant, no `Display` arm and no constructor exist. | Not judgeable: there is no text. Note that this is a refusal of a later `save_project`, not of the reopen. | If it names the other project's identity: 50 validated bytes from a file the kernel did not write, with no control character. If not: none. |

**P-9's bound at main (rows 8 and 9).** P-9 (i) sets a limit: no refusal arm may repeat more than 256 bytes of a file, or any control character. By reading, the shared reader exceeds both at main:
- **Number tokens.** In `strict_json` (`Parser::number`), ``"`{token}` is not a JSON number"`` (and `is not a finite number`) repeats a run of `[-+.eE0-9]` bytes. The run has no length bound below the file ceiling: up to about 1,048,576 bytes for `project.spatial` and about 2,097,152 for `folders.json` / `locations.json`. No control character can pass this arm.
- **Key-carrying paths and the duplicate key.** These are `Parser::object`, `Parser::value`'s path, `closed_in_order`'s `"{path}.{k}"` and `file.rs` `string_ceilings`.
  - Keys are decoded, so `\u0000`–`\u001f` escapes arrive as raw control characters, and raw DEL and C1 characters pass the tokenizer.
  - For the project file, a key is bounded at 65,536 bytes: `LIMITS` uses `MAX_CRS_DEFINITION_BYTES`, and `string_ceilings` checks values, not keys. Up to 32 levels of keys can stack in a path, bounded by the file.
  - For the machine store, a key is bounded at 4,096 bytes, 4 levels deep: about 16,384 bytes.
- **Echoed values.** `file.rs` `word` (``"`{got}` is not `{expected}`"``) and `RefParseError::UnknownState` (`` "`{value}` is not a word this version defines here" ``) repeat up to 4,096 bytes of a value, control characters included.

So stop 10 fires on the reader as merged. `strict_json.rs` and `file.rs` are not in item 8 (a)'s files (stop 1). The advisor needs this before the cut.

## The three A1 places of item 5 (g)

1. **The architect's A1.** Place: `kernel/src/project/store.rs`, `stored_path`, the over-ceiling arm. Text at main, byte-copied:
   ```
           Some(s) if p.is_absolute() => {
               format!("a path of {} bytes, over the ceiling of {max}", s.len())
           }
   ```
   The finding, byte-copied from `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-architect.md`:
   > **A1** (for the advisor; a string the app shows, under P6; not a gate condition). The rule text at `store.rs:311 at F`:
   > - for `locations.json`: `the dataset's path is {n} bytes, over the ceiling of {max}`;
   > - for `folders.json`: `a folder's path is {n} bytes, over the ceiling of {max}`.

   and, from the same report: "This needs `stored_path` to take the noun. The message's head, "the project file would break a rule its reader holds" (`error.rs:205 at F`), already exists and also wraps machine-store refusals. It is not P1b's, and is noted for the advisor's P6 sitting."

   This arm prints no path.

2. **The reviewer's A1 (i).** Place: `protocol/skp/src/v0/error.rs`, `SkpError::project_file_refused`, the message head. Text at main, byte-copied: `format!("the project file would break a rule its reader holds: {path}: {rule}")`.

   The finding it answers, byte-copied from `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-reviewer.md`: "The prefix "the project file would break a rule" is not accurate when the file is `folders.json` or `locations.json` (drafts, A1)." Its draft, from the same report: "(i) `error.rs:205`'s message: "a file of the save would break a rule its reader holds: {path}: {rule}". Clause check: `path` is a project-file member (`mod.rs:458-459`) or a machine-store file name (`mod.rs:463`); "a file of the save" covers both."

   Two notes (mine):
   - Under P-8 (i), machine-record refusals leave this code at both the save and the reopen. The case that motivated (i) is therefore gone.
   - The case that remains is new: the reopen's read. There, both "would" and "of the save" are untrue (row 8).

3. **The reviewer's A1 (ii).** Place: `kernel/src/project/store.rs`, `stored_path`, the refusal arm. Text at main, byte-copied: `_ => format!("{} is not an absolute UTF-8 path", p.display()),`.

   The finding, from the same reviewer report: ""{path} is not an absolute UTF-8 path" can now also name `locations.json`." Its draft: "(ii) `stored_path`'s refusal (`store.rs:313`) split in two: `Some(_)` gives "{path} is not an absolute path", and `None` gives "{path} is not valid Unicode". Clause check: the `_` arm is reached by `to_str()` being `None` or by `!is_absolute()`."

   On item 5 (d), at a reopen (mine): this arm prints only the request's own `relink`, or the request's folder when `std::path::absolute` fails. Both are permitted by 5 (d).

## ADR-036 Amendment 2 item 3 (item 11)

- **Where it lands.** It goes in `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, in P3b-2's PR, as appended text (item 8 (a); records ceiling 10, item 20). ADR-036 is accepted, so the words cannot edit Amendment 2 item 3 in place. They follow Amendment 3, the ADR's last block at main.
- **Missing:** item 11 names neither the heading nor the amendment number.
- **What it must state** (item 11, byte-copied): "What they state is shown by W-1 (b): a reopened open takes the project file's dataset identity, and a step after the reopen carries it. K-O21 (b) shows the same in the kernel."
  - W-1 (b)'s mutation is "`StepRecorder::reopened` not called: red at the step's `data.dataset`".
  - K-O21 (b)'s mutation is "the recorder's minted dataset URI kept".
- **The clauses of item 3 at main that are untrue for a reopened open,** byte-copied:
  - "Each open has one dataset reference identity, minted the first time the recorder is asked about that open, by a step or by a save (`State::open`, `StepRecorder::dataset_uri`)."
  - "the project file's dataset entry carries the same identity from the open's first save (`Projects::save` in `kernel/src/project/mod.rs`), whether the open's first step comes before that save or after it."
- **Code fact for the clause check** (mine): `StepRecorder::reopened` calls `State::open`, which mints an identity on the first mention, and then replaces it with the file's `uri`. The minted one is never written. ADV-2026-11-19-19 item 3, byte-copied: "The sentence is incomplete for a reopened open, which takes the project file's dataset identity where the item says one is minted."

## Each doc item 5 (c) widens

- **`cancel_key_in_use`.**
  - **Missing:** at main, `SkpError::cancel_key_in_use` has no doc comment. The untrue text is its message (row 3).
  - The nearest doc is `OpenRegistry`'s in `kernel/src/skp.rs`, byte-copied: "Names an in-flight `open_dataset` call so `cancel(cancel_key)` can reach it before it returns a handle." and "a different lifetime (dies the instant `open_dataset` returns)". Both clauses are untrue for a reopen, whose key is registered through `begin_open` for the whole `open_project` call.
  - That doc is not in 5 (c)'s list, and `skp.rs` is not in item 8 (a)'s files.
  - SKP-V0.md §5 names the code only in a list, with no untrue clause.
- **`project_file_refused`** (`protocol/skp/src/v0/error.rs`), byte-copied:
  ```
  /// `save_project`: a member of the project file, or of a file the save keeps for it, breaks a
  /// rule its reader holds, so the save is not made. `path` names the member and `rule` the
  /// rule.
  ```
  Untrue for a reopen: "`save_project`:" and "so the save is not made". After P-8 (i), "or of a file the save keeps for it" is also stale for the save. SKP-V0.md §11.4's row for this code is save-only as well.
- **`engine.cancelled`'s raising site in SKP-V0.md.**
  - **Missing:** the string `engine.cancelled` does not occur in `protocol/skp/SKP-V0.md` at main.
  - The nearest raising-site text is §1 `open_dataset`, byte-copied: "`cancel_key` is a client-minted string (see §3) naming this specific open so `cancel` can stop it before it returns a handle. **`open_dataset` is cancellable but not progress-reporting** — a named docs/01 principle-7 shortfall, not a silent gap (§2, C3)."
  - §4 item 5 also bears on it, byte-copied: "**Cancellation and progress** — cancellation: yes, for streams and for `open_dataset` (§2, C3)." Read as a list, this omits the reopen. It is not false.
  - Item 9 (b) puts the reopen's cancel timing in a new §12.

## Codes the reopen can send that no row of item 5 (c) names

1. **The binding's `Projects`-is-`None` refusal.** By the shipped `save_project` binding's pattern (`frontends/shell/src-tauri/src/commands.rs`), this is `skp.project_file_unwritable` with `"no per-user data directory is available"`. Its message is "the project could not be written: …", which is untrue for a reopen. Item 8 (a) does not say what the `open_project` binding sends here.
2. **The binding's `spawn_blocking` join failure.** By the same pattern this is `skp.<command>_panicked`, for example `skp.open_project_panicked` (working name, mine), with the join error's text.
3. **`skp.version_unsupported`.** It is listed under `Open(e)`, but it is raised by the command's version check (row 1).
4. **Row 17's two arms.** They have no code.
5. **A request that fails to deserialize** (F-W2's closed sets). This is not an `SkpError` (SKP-V0.md §3's `HexF64` paragraph describes the binding's behaviour). I list it for completeness. It has no code.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports.
