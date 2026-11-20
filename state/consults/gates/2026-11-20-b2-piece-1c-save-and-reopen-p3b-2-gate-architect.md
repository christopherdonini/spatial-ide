Reviewed: PR #340 at ddd74c349091832ada443e78ae867fa4ad79371b (the custodian's filing note, 2026-11-20: the architect's gate of P3b-2; Read 78, Grep 76, Glob 6, SubagentHandback 1, two errored, model claude-opus-5-5, from 2026-11-20T00:34:20Z to 00:47:40Z by its transcript; the report below byte for byte from its hand-back of 14725 bytes, sha256 d9d236aec1fb2f60e83024a95c87e2a141364edb36573cb2e2931d1c90aaf203, nothing masked by the custodian, with this note in its first line and one final newline), gate, architect, attempt 1
Gate: PR #340, b2-piece-1c-save-and-reopen P3b-2, architect, at ddd74c349091832ada443e78ae867fa4ad79371b
Reviewed: cut/b2-piece-1c-p3b-2 @ ddd74c349091832ada443e78ae867fa4ad79371b (I read the checkout C:/dev/wt/1c-p3b2-ga, and base B 45ce89da in the main checkout)

Verdict: FAIL, on Evidence only (AUTONOMY §22). The code's Correctness is closed. One Evidence gap remains: two predicted mutation reds that nobody has seen (E-1). Closing it needs one run and no change to code or records. Every Documentation finding below must be fixed before the merge.

**1. The binding off the main thread (Amendment 49 item 3)**
- **The binding.** `open_project` (frontends/shell/src-tauri/src/commands.rs:202-222) is an async Tauri command. It runs `projects.open_project_command(request)` inside `tokio::task::spawn_blocking` and awaits the join. The handler entry is lib.rs:558.
- **What the call can wait on, all on a blocking-pool thread:**
  - the `saved` mutex at `release_ended` (mod.rs:774). A save in flight holds that mutex for its whole IO, which ends because the rename retries are bounded. Another `release_ended` or another reopen's push can also hold it.
  - the `saved` mutex again at the push (mod.rs:864);
  - the recorder's state lock in `reopened`;
  - the brief locks of the catalog, the generations and the OpenRegistry;
  - file IO and the engine's open.
- **No main-thread command waits on any of these.** `close_dataset` hands `release_ended` to its own thread. `cancel` and `describe` take only brief locks.
- **Lock order holds.** `saved` is taken before the catalog and the generations, as in `save` and `release_ended`. `reopened` runs without holding `saved`.
- **Join failure.** A join failure becomes `SkpError::protocol("open_project_panicked", …)`, which is the code `skp.open_project_panicked`, as Amendment 45 item 3 requires.
- **docs/01 principle 7 and the derived rule "Never block the canvas": sound.** The call is cancellable through `cancel_key` but not progress-reporting, as `open_dataset` is. A wait on `saved` cannot be interrupted, so a cancel there is seen at the next `live()` check (mod.rs:799). That is a note, not a finding.

**2. ADV-2026-11-19-33 item 7**
- **(i) None of the four can be reached with a file the reader accepts.**
  - **The style `expect` (mod.rs:966).** `file.rs` `style_document` accepts a style only if `to_canonical_string(v)` succeeds and `doc.to_canonical_json() == *v`. That is the same `Json` value, so the second canonicalisation cannot fail. So every style `read_project` passes is canonical.
  - **The `from_str` `expect` (mod.rs:980).** The canonical grammar writes valid JSON: no exponent, doubles inside the domain, i64/u64 integers, escaped strings, and the depth the closed style schema fixes. serde_json parses all of it.
  - **The `unreachable!` on `observed` (mod.rs:1003).** `differing_components` (engine/src/descriptor.rs:432) pushes only `size`, `mtime`, `footer-length` and `footer-hash`.
  - **The `unreachable!` on `admission` (mod.rs:1008).** `DatasetRef::check` (kernel/src/dataset_ref.rs:335-339) pushes only `crs` and `identity`.
- **(ii) If one fired anyway:**
  - The saved entry and its lock would stay in `Projects`, with the dataset live in the catalog and no handle at the client.
  - Nothing frees them until that open's session ends (the watcher's `end_generation`) and a later close or reopen in this process runs `release_ended`, or the app quits.
  - The panics are unreachable, so this is not a finding. One optional hardening: build the reply before pushing the entry. I do not propose it as a change.

**3. P-9's bound at the wire**
- **The helper is applied at every named place:**
  - `bounded` (mod.rs:1262) replaces control characters, then cuts to 256 bytes and adds the 6-byte mark, so a result is at most 262 bytes.
  - Reopen (`open_error_of`): `path` and `rule` of `project_file_refused`, `rule` of `project_machine_record_refused`, and `segment` in all four segment arms.
  - Save (`skp_error_of`): `path` and `rule` of `FileRefused`, `rule` of `MachineRecordRefused`, and `Bind`'s `rule`, which is a `project_file_refused` rule, so it is inside item 2 (b).
  - `view_state`: each space's identifier, never the whole text.
  - `file_name`: at mod.rs:905.
- **Nowhere else.** `locator` is built by the kernel, `folder` is the request's own string, identities are validated, and the `detail` fields are OS error text or fixed names.
- **The exceptions are exactly the named ones:** `Open(e)`, identities (`project`, `found`) and `workspace`.
- **Stop 10 is not reached,** subject to N-1: the fields of an engine refusal through `Open(e)`.

**4. The wire at `skp/0.14`**
- `SKP_VERSION` is `skp/0.14` (protocol/skp/src/v0/mod.rs:133).
- The types agree with §12.2's grammar:
  - the external tag uses snake_case (`opened`, `question`, `not_found`);
  - `state` and `reason` are internally tagged kebab-case;
  - `key_present` is on `answer`, `relink`, `previous_file`, `line` and `file_name`;
  - `deny_unknown_fields` is on every struct.
- All sixteen messages equal ADV-2026-11-19-26's first fence (I compared each line by eye), and `OpenFailure`'s arms equal them.
- docs/10 is respected: it is one control-plane call, opens no stream and mints no ticket, and `protocol/data-plane/` is untouched.
- **Nothing persisted changes.** The formats of `project.spatial`, `folders.json`, `locations.json` and the lineage files are unchanged. The `stored_path` texts are refusal text only.
- The worded defects are D-2 and D-3.

**5. ADR-036 Amendment 4**
- It is appended after Amendment 3, at the end of the file. I compared it by eye with the third fence and it matches. I cannot run Bash, so the reviewer recomputes the bytes by script.
- **Each clause is true at H:**
  - `reopened` replaces `open.uri` (session_history.rs:392-401) and is called before the reply (mod.rs:862).
  - The saved entry carries `uri`, so a later save writes it back (mod.rs:865-871 and 312-313).
  - After the answer `copy`, `uri` is taken from `file.dataset`, which is unchanged, while the identity is the new one (mod.rs:755-760).
- The date slot is N-2.

**6. The doc words**
- **ADV-2026-11-19-30's two pairs** are applied as New:
  - `release_ended`'s doc, mod.rs:252-256;
  - `close_dataset`'s doc, commands.rs:122-124.
- Each clause of both is true at H. `windows_subsystem` is set for release builds (main.rs:3), which makes "a release build on Windows has no console to show it" true.
- **Amendment 45 item 7's docs** (`project_file_refused`, §4 item 5's cancellation list, §12) and **Amendment 50 item 4 (e)'s bound lines** (`ReopenView`, `ReopenNotFound`, §12.2's `basis` and `file_name`) are true. Their order, control characters replaced first and then the cut, matches `bounded`.
- The untrue worker clauses are D-1 to D-4, to the advisor.
- **Stop 12 was not reached.**
  - `release_ended`'s body is the same as at B.
  - It has one product caller in the kernel, `open_project`, which still runs it before `try_lock` (mod.rs:774-775).
  - `close_dataset`'s hand-off is the same as at B (commands.rs:141-144).

**7. The words for `kernel/src/skp.rs`'s two clauses**
- These replace `OpenRegistry`'s doc (skp.rs:929-932), comment lines only. The wrap is free.

```
/// Names an in-flight `open_dataset` or `open_project` call so `cancel(cancel_key)` can reach it
/// before the call returns. Separate from [`StreamRegistry`]: a different handle kind
/// (client-minted, SKP-V0.md §3), a different underlying cancel primitive (`engine::CancelToken`
/// directly, not the data plane's type-erased `SourceCancel`), and a different lifetime (an entry
/// is removed when the call that registered it returns, by [`OpenGuard`]'s drop, an unwind
/// included).
```

- **Clause check:**
  - Both calls register the key through `begin_open`: skp.rs:1108 and mod.rs:703.
  - Each binds the guard for its whole body, as `_end_open_on_drop`.
  - A reopen can return with no handle, so the words say "before the call returns".
  - `OpenGuard::drop` calls `end` (skp.rs:980-984), and an unwind drops the guard too.
  - These are not the human's wording.

**8. Scope and the not-covered rows**
- **New `pub` items:**
  - `Projects::open_project_command`: its caller is the binding.
  - The `open_project` binding: its consumer is P4's `openProject`, gated by E-REOPEN (Amendment 43 item 12). The PR body and PLAN.yaml must name it, which the custodian checks.
  - `SaveFailure::FileNamesAnotherProject`: its consumer is `skp_error_of`, and K-O27 tests the seam.
  - The fifteen protocol types and fourteen constructors: every one has a product caller in `open_error_of`, `skp_error_of` or the binding.
  - Nothing else: the `pub` counts of `store.rs` are equal, and `mod.rs` has exactly one more.
- **The not-covered rows are each true:**
  - Amendment 43 item 13's three rows, and item 8 (b)'s `Cancelled` row (one arm, mod.rs:920).
  - N4: it needs the new handle before the reply, so it is timing inside one request.
  - ADV-2026-11-19-34 item 5 (b): the `cfg(not(target_os = "linux"))` on W-7's (b1).
  - ADV-2026-11-19-34 item 5 (c): `data_at`'s `_ => Data::At` arm.
- **Not declared by any amendment:** W-7 repeats case (a) whole, at project_reopen_skp.rs:632-641 and again at 643-652 (D-5).

**Findings**

*Blocking (Evidence)*
- **E-1.** Amendment 45 item 2 (c) predicted all three of W-4's bounded cases red under the helper mutation. Only `number` was seen red. The test stops at its first failure, so `key` and `word` were never seen red (kernel worker report §5; W-7 worker report).
  - By ADV-2026-11-19-35 item 2's standard, a case not seen to fail is not enough for the gate.
  - By reading, both should fail: the key case puts U+0001 in `path` through `closed_in_order`, and the word case's `rule` repeats 4,096 bytes through `word`. But a layout refusal could come first, which is why this has to be seen.
  - **To close it:** with W-4's mutation (c) applied and the earlier cases skipped, both by Bash and neither committed, show `key` and `word` each red, in one line. It is closed if the reviewer's run at H already shows this. A case that passes under the mutation is a finding, and it goes to the advisor.

*Must-fix before merge (Documentation). Untrue clauses go to the advisor unreworded, as the brief asks. None is the human's wording.*
- **D-1 (to the advisor).** The docs of `ReopenAnswer` (protocol commands.rs:796) and `ReopenQuestion` (:922) say that the project "is open elsewhere on this machine under another folder". That is untrue. `question` is returned at step 2, before any lock is checked, when the remembered first folder still holds this identity's file, cannot be read, or holds a file the reader refuses (`asks`, mod.rs:1070-1086). The project being open is `skp.project_open_elsewhere`.
- **D-2 (to the advisor).**
  - The `skp/0.14` paragraph in mod.rs (line 130) says "The other seven commands are unchanged".
  - The §8 entry (SKP-V0.md:1160) says "no change to the other seven commands".
  - Both are untrue. `save_project` gains `skp.project_file_names_another_project` and changes a machine-record refusal's code, and `open_dataset`'s `cancel_key_in_use` message changes.
  - The §8 entry itself lists the code change in a later line; the mod.rs paragraph does not.
- **D-3 (to the advisor).** §12.3's `question` clause, "the folder it remembers first still holds the project or cannot be read", leaves out a file the reader refuses, which also asks.
- **D-4 (to the advisor).** W-7's doc (project_reopen_skp.rs:622), "APFS likewise", reads as APFS forbidding characters below U+0020. APFS does not forbid them. The conclusion stands, since U+0085 is accepted on all three and CI is green.
- **D-5.** Remove the duplicate block of W-7's case (a) at project_reopen_skp.rs:643-652. Until it is gone, the reviewer's ADV-2026-11-19-35 item 2 run must skip both copies, or (b1) and (b2) stay masked.
- **D-6.** SKP-V0.md §4 item 5's progress sentence (line 249) names only `open_dataset`. It is the named-deferral list for principle 7, so it should name `open_project` too. Suggested: "`open_dataset` and `open_project` are cancellable but not progress-reporting."
- **D-7.** Wrap commands.rs's module-doc line 8 at the file's width. It was already over the width at B, and P3b-2 made it longer.

*Notes*
- **N-1 (to the advisor).** `Open(e)` passes the host's whole error, fields included, as Amendment 43 item 5 (c)'s table has it: "as the host built them". That lets text from a file reach the wire without the helper:
  - `engine.crs_assertion_conflict`'s `asserted` is the claim the project file recorded;
  - `declared` and the `detail` fields come from the data file.
  ADV-2026-11-19-26 item 1 (e) and Amendment 43 item 5 (d) name only the engine's "message". Proposed shape: the advisor confirms that the exception covers the whole host-built error, the closing records it, and P4's form bounds what the shell shows and logs (ADV-2026-11-19-26 item 8).
- **N-2 (to the advisor; red-line, not reworded).** ADR-036 Amendment 4's slot holds 2026-11-19, the worker's commit date by `date -u`. If "date of landing" means the merge to main, the custodian sets the slot to the merge date by script at the merge.
- **N-3.** §12.3 says "A cancel before the engine's open returned refuses the call as `engine.cancelled`". A cancel that lands during step 2's reads or the data lookup gets `question` or `not_found` instead (mod.rs:737, 768 and 805 have no `live()` before them). That is timing inside one round trip; name it in the source comment.
- **N-4.** §12.3's data clause gives `not_found` when the lookup says not found. A lookup that fails another way goes to the engine: an over-length name on Linux, or `ERROR_INVALID_NAME` on Windows. ADV-2026-11-19-34 item 5 (c) carries this to the closing; ordinary use on Windows cannot reach it.
- **N-5.** `bounded` uses `char::is_control` (Unicode Cc). Format characters such as U+202E pass through it. This is for P4's strings.
- **N-6.** A `JoinError` for cancellation at runtime shutdown also maps to `open_project_panicked`, by the binding's pattern. §12.2 requires `folder` to be absolute, but nothing checks it, as with `save_project`.
- **N-7.** W-7's (b2) path holds a raw U+0085 in its source line (project_reopen_skp.rs:674). Writing it as `\u{85}` would make it visible.
- **N-8.** ADR-006: P3b-2 does not change the reopen's operation class. Its writes are the machine store's, plus the `copy` rewrite of `project.spatial` that the user's answer gates; both are as P3a built them. No performance claim is made (docs/08), and nothing in this part goes beyond docs/07's current gate.

Model: claude-opus-5-5 (Opus 5.5).
