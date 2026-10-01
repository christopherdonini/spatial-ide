*Custodian's filing note (2026-10-01): the architect's gate 1 on PR #152, for PLAN node `audit-reader-char-boundary` at g1, full gating. Reviewed: cut/audit-reader-char-boundary @ 1b112b1f9a7f4313d975219249d8487ea85ab4bf (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 11:48:25Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 1b112b1. Verdict BLOCK on B1 only: T2 writes the character as raw UTF-8, where §3 S5 declares the JSON escape `\u00e9`. The custodian confirmed this at 1b112b1. It is taken as correction round 1, a one-literal test change. Profile paths redacted at filing: none.*

---

Reviewed: cut/audit-reader-char-boundary @ 1b112b1f9a7f4313d975219249d8487ea85ab4bf

**Verdict: block (B1 only).** The fix is a one-line test change. Everything else passes.

I read the files at the worktree head (the ref was confirmed as 1b112b1), against main's `reader.rs` (unchanged since 7d7ea70). I have no Bash, so I did not run any git command, hash or tool myself. My own line count from the two files gives 73/21 and 18/0, which agrees with the custodian's numstat.

**1. §2 items 1–2: PASS.**
- The only product change is `kernel/src/permission/audit/reader.rs:201`. `at.len() >= 16` became `at.is_char_boundary(16)`. The `T` test, both slices and the fallback arm are byte-identical (`:201-205`).
- The doc at `:195-199` states exactly the five points:
  - the check, including "at least 16 bytes";
  - 10 and 11 are boundaries because of the ASCII `T`;
  - a hand-edited or corrupted log can put a multi-byte character across byte 16;
  - a value is "sliced whether or not its other bytes are digits";
  - any other value is returned unchanged.
- The base sentence "shown verbatim rather than mangled" is gone. The clock.rs sentence stays (`:190-193`); it describes the clock's own shape, not the guard.
- Scope closes as nodes 4 and 5 did: the doc makes no shape-validity claim and says nothing about control characters (§8 item 6 is clear).

**2. §1 May 2: PASS.** Case by case against the new condition:
- `len < 16`: `is_char_boundary(16)` is false, so the input is returned, as at the base.
- `len == 16`: true at the end, so the value is sliced, as at the base.
- `len ≥ 17` with no `T` at byte 10: the input is returned under both.
- `len ≥ 17`, `T` at byte 10, byte 16 on a boundary: identical slices.
- `len ≥ 17`, `T` at byte 10, byte 16 not on a boundary: the base panics and the new code returns the input. That is exactly §0's panic set.
- `is_char_boundary` never panics, and the `T` makes 10 and 11 valid slice ends.

The output therefore differs only on the base's panic set.

**3. P1–P5: PASS.**
- Each corrected text equals the form's binding words (§2 item 6). Wrapping is the only difference:
  - P1 at `:6-8`
  - P2 at `:21-23`
  - P3 at `:30-31`
  - P4 at `:217-218`
  - P5 at `:349`
- Each is labelled "in paraphrase", carries no quotation marks or italics, and names its true source. P1 credits the custodian's record, not the human's wording.
- Each source carries the content: ADR-017:1123-1125 (its note at :1131-1132 marks only quoted text verbatim), log.rs:41-43, record.rs:47-51 and boundary.rs:193, all read at head.
- The only "verbatim" left in `reader.rs` is T1's declared name (`:441`). The remaining quote-grep hits are the reader's own output at `:43-44`, an example value at `:190`, and `:192`, which matches clock.rs:31 byte for byte.
- The reflowed neighbouring lines change no words: P1 `:8-9`, P2 `:23-26`, P3 `:31-32`, P4 `:218-222`. Each one compares word-identical to the base.

**4. T1–T3 against §3 and §4: FAIL (B1).**
- Names match §4 byte for byte (`reader.rs:441`, `:458`; `publish-bundle.rs:748`).
- S1–S4 are present in order, S1 first (`reader.rs:443-451`).
- S6 is correct: raw UTF-8, destination `out/cut-cli`, two lines, `interrupted?` (`publish-bundle.rs:751-759`).
- The workspace is `audit-show-cut-at-byte-16` (`:749`) and no other test uses that name.
- M1 on T1, M1 on T3 and M2 on T2 are each recorded in the test's doc with commit 256154c (`reader.rs:437-439`, `:454-456`; `publish-bundle.rs:744-746`).
- P0 is recorded by name with commit B 2a96670 in the worker report. §4 does not require it in the test docs.
- No sleep, thread, timing assertion or hook.

**5. ADR-017 condition 2, ADR-006, operator text, caller and seam, R1–R6: PASS.**
- ADR-017 condition 2: for a valid (ASCII-clock) log the output is unchanged, by item 2. The twelve declared-unchanged tests are textually identical to the base (`reader.rs:355-435`) and passed (worker report).
- ADR-006: the reader stays read-only.
- Operator text: no new message, string or exit code; the fallback shows the stored value.
- Caller rule: no new item. `plain_date` stays private with three product callers (`:271`, `:316`, `:321`).
- Seam: `audit_show_lines` calls the real `render_audit_log(&str)` (`publish-bundle.rs:185`), and T3 is the end-to-end test from that real shape, over a real file.
- R1–R6: no `cfg`, no platform ignore, paths from `temp_dir`, destinations without drive letters.
- The header's reading of §21a/§21b is correct.

**6. §8, item by item.**
- 1 PASS
- 2 PASS (18/0, test block `:743-760` only)
- 3 PASS
- 4 PASS on the custodian's numstat. That command excludes `state/`, `PLAN.yaml` and others (see N1).
- 5 PASS
- 6 PASS
- 7 PASS
- 8 PASS
- 9 PASS
- 10 PASS (`fixture()` changes only at P5's comment)
- 11 PASS
- 12 PASS on the commit list B–F
- 13 PASS (the report itself says `verify-mutation` is "not the observation")
- 14 PASS (112 ≤ 175 over 2 files; the form is not edited)
- 15 PASS (see N2)
- 16 pending: it must be a merge commit, which also keeps 256154c and 2a96670 reachable from main.

**Blocking**

**B1: T2 does not implement S5 as preregistered.**
- §3 S5 says each `at` is "written in the JSON as `\u00e9`".
- `reader.rs:459` is `r"2026-08-17T08:4é"`, a raw UTF-8 é inside a raw string. A grep for `u00e9` finds nothing in `kernel/src`.
- So S5's JSON-escape path is never exercised, and T2 duplicates S6's raw-byte encoding. The raw-string prefix suggests the escape was intended.
- Fix: write `\u00e9` inside the raw string at `:459`. Then:
  1. re-observe M2 on the corrected T2;
  2. observe T2 failing under the base condition (that is, under M1) as its P0 for the new text;
  3. update T2's doc with the new commit.
- This changes test code only and stays within §7.

**Non-blocking**

**N1: §8 item 4.** The §7 numstat excludes `state/**`, `PLAN.yaml`, `site/**` and the form, so it cannot show those paths. The reviewer should confirm with an unfiltered `git diff --stat 7d7ea70...1b112b1` that only the two files changed.

**N2: worker report line pointers.** The report on main uses bare line pointers into branch files, such as `reader.rs:196:41`. They are unrooted, the filing note discloses them as unpinned working pointers, and they are evidence, not Authority. They need no correction, but no later record should cite them as pins.

**N3: T3's header line.** T3 checks the header only through `len == 2`. That satisfies S6; an explicit `lines[0].contains(path)` would make it tighter, but this is optional.

Paths:
- C:/dev/wt/audit-reader-char-boundary/kernel/src/permission/audit/reader.rs
- C:/dev/wt/audit-reader-char-boundary/kernel/src/bin/publish-bundle.rs
- C:/dev/wt/audit-reader-char-boundary/kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-01-audit-reader-char-boundary-worker-report-1.md
