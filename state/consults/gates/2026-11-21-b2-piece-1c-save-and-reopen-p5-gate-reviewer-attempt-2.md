Reviewed: cut/1c-p5-words at 5560e831b6a8711159055df73ee3b8b6b3eda3ee (the custodian's filing note, 2026-11-21: P5's single gate, attempt 2, limited to the correction commits 3ab6217b and 5560e831 (ADV-2026-11-21-07 item 5 (c), ADV-2026-11-21-08 item 2); Read 10, Bash 27, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-21T06:41:45Z to 2026-11-21T06:48:22Z by its transcript; the report below byte for byte from its hand-back of 11676 bytes, sha256 1aa1dd8b0a48d660b3214cb4d521e394b71835725a9d701776dc28d2729391f1, nothing masked by the custodian, with this note in its first line and one final newline), gate, reviewer
Gate: reviewer on P5, attempt 2, at 5560e831
Verdict: PASS WITH NOTES
Reviewed: cut/1c-p5-words @ 5560e831b6a8711159055df73ee3b8b6b3eda3ee

The three new sentences and -08's clause are true against the code at H2. Each changed comment matches its code and its D finding. Nothing else changed. There are no Correctness or Evidence findings. Two Documentation findings (N1, N2) must be fixed before the merge, but neither blocks.

Brief: read whole; its sha256 is 22c021d9767d5ae38d1ef8c95771328a6a57219ba074a13a9fdeb91ca0f4bb2e (5886 bytes).

Start state:
- `rev-parse HEAD` gives 5560e831b6a8711159055df73ee3b8b6b3eda3ee.
- The porcelain is empty.
- `ls-remote` for refs/heads/cut/1c-p5-words gives the same id.
- `log --oneline H0..H2` shows three commits: 5560e831 (-08), 3ab6217b (-07) and 4f09194c (H1).

Read first:
- The copy of -07: sha256 380eed5f…a7f823, 7262 B. Both match the brief.
- The copy of -08: sha256 cd55cf4d…882ca5, 2409 B. Both match the brief.
- My attempt 1 (`p5gr-hb-1.md`), and the worker's reports `p5c-hb-1.md` and `p5c-hb-2.md`.

## The five checks

**1. Scope of the commits** (`git diff --numstat` H1..H2, `git show --numstat` of each commit, and H0...H2 both three-dot and two-dot).
- H1..H2 changes two files: KNOWN-LIMITATIONS.md (9 added, 9 removed) and frontends/shell/MANUAL-WALKTHROUGH.md (1 added, 1 removed).
- 3ab6217b changes KNOWN-LIMITATIONS.md alone (9/9). 5560e831 changes MANUAL-WALKTHROUGH.md alone (1/1).
- H0..H2 changes the four Scope files: KNOWN-LIMITATIONS.md 35/7, MANUAL-WALKTHROUGH.md 12/4, surfaceRegistry.ts 2/2, kernel/README.md 1/1.
  - These totals equal H0..H1's, because the correction rewrites lines that H1 had already changed.
  - Nothing changes under `protocol/` (count 0). The merge base is H0.
- Item 8's sum is 64 + (9+9) + (1+1) = 84, within Amendment 70's 100.

**2. The words, byte for byte.**
- I read `chk-p5c.mjs` (sha256 a2040ec5…ae99b2) and ran it at H2; rc is 0.
  - All 27 fences of -06's items 8 to 20 pass, after -07's three replacements: old texts go 1→0 and new texts 0→1.
  - Each of -07's three pairs, and -08's pair, is used once inside -06's fences. At the head each old text stands 0 times and each new text once. Bad is 0, and nothing falls outside Scope.
- Does the script show what it claims? Yes:
  - Its fences are read at column 0, and the item number is taken only outside a fence.
  - -06 is read from H0's tree, and -07 and -08 from the byte copies.
  - The four files are joined by NUL, so no match can span two files.
  - It has the same limits as attempt 1's script: the OK test is symmetric, matches are not anchored, and it does not check position. I read the directions in its output (they are right) and checked position by reading.
- Nothing else changed: an inline node script compared each changed line of each commit by common prefix and suffix. Both files keep their line counts (560 and 2049).
  - Items 62, 74 and 75 (lines 511, 554, 558): each line differs only in -07's sentence. The paragraphs and titles are otherwise byte-identical.
  - The other changed lines are only the comments of items 4, 10, 62, 69, 74 and 75 (lines 81, 135, 512, 535, 555, 559).
  - Walkthrough: one change only, on line 2025. "third empty folder inside your OneDrive folder and a " was inserted, and the rest of the line is unchanged.

**3. The new sentences against the code at H2.** No code changed between H1 and H2: `git diff --quiet` over engine, kernel, protocol and frontends/shell/src passes.
- **The ruling's 5(c), first premise: true.** In `Dataset::open_inner` (engine/src/dataset.rs), `cancel` is first used at `read_file_names(conn, &path_str, cancel)`, which runs right after `probe_schema` (an awk scan of the function shows no earlier use). `read_kv_metadata` and `probe_schema` take no token. Before them, `pool.acquire` runs the pool's configure SETs, unbound. Those are not reads of the file, and the sentence does not say the two reads are the only unbound statements.
- **The ruling's 5(c), second premise: true.** Followed to what Open project shows:
  - `CancelToken::cancel` sets the flag.
  - `read_file_names` runs inside `cancellable`. There `attach` is called, and then `execute_guarded`'s step 2 sees the flag and returns `Guarded::Cancelled`, which becomes `EngineError::Cancelled`.
  - `Projects::open_project` maps any `open_under` error to `OpenFailure::Cancelled` when the token is cancelled. `open_error_of` then gives `error_of(&EngineError::Cancelled)`, which is `engine.cancelled`.
  - `admitProject` returns it as refused. `runAdmitPath` matches `CANCELLED_REFUSAL_CODE` and sets `{ kind: "idle", note: "Open cancelled" }`, unless a remediation resubmit is in flight.
  - Nuance, not a finding: an engine refusal between the two reads and `read_file_names` (geo, CRS or axis) also ends as cancelled, through the kernel's `map_err`.
- **Item 1 (item 62's sentence): true clause by clause.**
  - "cannot make the folder or take open.lock": `ProjectLock::try_lock` runs `create_dir_all`, opens the lock file and calls `try_lock`.
  - "is refused": in `Projects::save`, `lock_refused` gives `SaveFailure::MachineStore { what: store::OPEN_LOCK, .. }` for both `Held` and `Io`.
  - "the kernel's message that the project could not be written": `skp_error_of` maps that to `SkpError::project_file_unwritable`, whose message is `the project could not be written: {detail}`.
  - "followed by `open.lock:` and the error's text": its Display is `"{what}: {source}"`. The text is the OS error, or "another handle holds it" when the lock is held.
  - "the line that says the project was not saved … shows": `failureOf` takes `skpError.message`, and `notSavedNotice` wraps it.
- **Item 2 (item 75's three sentences): true.**
  - "looked at between the steps": the `live` closure in `Projects::open_project`.
  - "interrupts the queries that are bound to it": `cancellable` does `attach` and runs `execute_guarded`.
  - "Two reads … footer metadata and … its columns, are not bound": `read_kv_metadata` (`parquet_kv_metadata`) and `probe_schema` (`read_parquet … LIMIT 0` and DESCRIBE).
  - "acted on only after they return": see the second premise above.
- **Item 3 (item 74's three sentences): true.**
  - `REPLACED` in shownText.ts holds the Cc ranges. Its direction characters are U+061C, U+200E, U+200F, U+202A–U+202E and U+2066–U+2069, which is 1+2+5+4 = 12. It also holds U+2028 and U+2029.
  - U+200B and U+00AD are absent.
  - The log line is `logSessionEvent("reopen-refused", \`${refusal.code}: ${refusal.message}\`)` on `shownRefusal`'s result in `admitProject`. So it takes the code and the bounded message, not the fields.
- **-08's clause: true.**
  - AD5's row says "save a project into a new empty folder inside OneDrive, as in AD1".
  - The Before list now names three folders: the first for AD1, the second for AD2 and AD3, and the third for AD5.
  - AD4's folders are made by "Copy and Paste", so they rightly stay out of the list.
- No clause was found untrue.

**4. The changed comment lines.**
- **D1, item 4's comment (line 81): fixed.** It now says "The last two sentences … are the advisor's wording … item 16, which rules those two sentences". The paragraph's last two sentences are byte-equal to item 16's fence (checked against -06 at H0).
- **D2, item 10's comment (line 135): fixed.** It now says "The last four sentences of the On-main paragraph". Line 137 ends with item 17's four sentences.
- **D5, item 62's comment (line 512): fixed.**
  - `Projects::save` sets `OPEN_LOCK` for either refusal.
  - In `Projects::open_project`, `LockRefused::Held` gives `OpenFailure::OpenElsewhere` and `LockRefused::Io` gives `OPEN_LOCK`.
  - "outside the test modules" is right. The removals outside tests are in `write_machine_file` (mod.rs), in `stage` and `Staged::commit_with` (reached only through `replace`; grep shows no other caller of `stage` outside the tests) and in `remove_stale_temps`. The two `remove_dir_all` calls (resolver.rs, store.rs) are inside `#[cfg(test)]` modules.
- **D7, item 69's comment (line 535): fixed.** It now matches `judge` in resolver.rs:
  - The `canonicalize` and `strip_prefix` checks lead to `Why::Outside`.
  - The segment rules (non-UTF-8 or not a normal component, empty, over `MAX_LOCATOR_SEGMENTS`, or `with_project_relative` refusing) lead to `Why::NoCanonicalSpelling`.
  - `reached_through_link` leads to `Why::ThroughLink`.
- **D4, item 74's comment (line 555): fixed.** It now matches `REPLACED`, and it says that `admitProject`'s log takes the code and message, not the fields.
- **D3, item 75's comment (line 559): fixed.** It says `cancellable` binds the queries run through it, for example `read_file_names`, and that `read_kv_metadata` and `probe_schema` are called without the token. Both are true.
- **Whose wording:** every changed comment says it is the advisor's wording under the delegation, not the human's. Those of items 62, 74 and 75 name ADV-2026-11-21-07 with its item beside ADV-2026-11-21-06. For two of them, see N1 and N2.
- **No quotes of a ruling, form or report.** Item 62's comment identifies its sentence by its opening words ("A first save that cannot make the folder"). Those are words of this file's own paragraph, not a quote of a ruling.
- **No line-number cites in the changed spans.** The path:line pins on lines 81 and 135 are byte-identical in the old and new lines: they are earlier text, untouched.
- **Every symbol named exists at H2.** Checked by grep or read: `read_kv_metadata`, `probe_schema`, `read_file_names`, `cancellable`, `open_inner`, `LockRefused::Io`, `OpenFailure::OpenElsewhere`, `store::OPEN_LOCK`, `Projects::save`, `Projects::open_project`, `write_machine_file`, `replace`, `Why::NoCanonicalSpelling`, `MAX_LOCATOR_SEGMENTS` (file.rs), `REPLACED`, `shownRefusal`, `formatRefusal`, `admitProject`, `RefusalBlock` in ConsolePanel.tsx.

**5. The run.** The condition holds: H1..H2 changes two Markdown files only, and nothing under frontends/shell/src or any other code folder (checked by numstat and `git diff --quiet`). By -07's item 7 and -08's item 2, no shell run is owed, and the worker's run tied to H1 in attempt 1 stands. I ran nothing heavy.

## Findings

### Words found untrue (Correctness)
None.

### Correctness
None.

### Evidence
None.

### Documentation (each must be fixed before the merge; none blocks)
- **N1. KNOWN-LIMITATIONS.md, item 75's comment**, the clause "the sentence on where a Cancel is looked at is replaced by the advisor's wording in ADV-2026-11-21-07 (item 2)".
  - -07's item 2 replaced one sentence with three: "A Cancel of Open project is looked at between the steps of the open." through "…acted on only after they return."
  - The comment does not say that the second and third sentences are -07's as well. A reader can take them as -06's.
  - This is the same class as D1 and D2 (-06's item 21 asks the comment to say which sentences are whose). It should name the three sentences, or the span from the first to "after they return".
- **N2. KNOWN-LIMITATIONS.md, item 74's comment**, the clause "the clause on which characters are replaced and the clause on what the session log takes are replaced by the advisor's wording in ADV-2026-11-21-07 (item 3)".
  - -07's item 3 replaced two sentences with three. The middle one, "Other characters that do not show, a zero-width space or a soft hyphen for example, are not replaced.", is new and is not attributed.
  - The fix is the same as N1: name the three sentences as -07's.
- By -08's item 4, which stands for attempt 2, I wrote no replacement words.

Model: Opus 5.5 (claude-opus-5-5), as the harness gives it.
