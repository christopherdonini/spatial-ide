# Consult — the architect's drafts for audit-reader-char-boundary (2026-10-01)

*Custodian's filing note: two hand-backs from the same architect agent on the custodian's brief (a drafting consult, not a gate), read at main ee54158, both recorded verbatim below with the harness's report indentation removed. The first (enqueued 10:54:20Z) routed five misquoted doc passages in `kernel/src/permission/audit/reader.rs` out of scope. The custodian asked it to fold them in, because they sit in the file the form already scopes and one credits the custodian's wording to the human as verbatim. The second (enqueued 10:57:14Z) is that amended draft. Each report's fenced DRAFT is elided, marked in parentheses: the first is superseded by the second, and the second is committed as `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md` with the edits its header lists. The custodian's checks before commit, at ee54158:*
- *`plain_date` slices `&at[11..16]` after checking only the length and byte 10, so a multi-byte character across byte 16 panics; `normalize.rs` already guards the same shape with `is_char_boundary`.*
- *The three callers, the boundary's `clock` field, the writer's control-character check and both product clocks read as cited.*
- *P1: ADR-017's condition 2 at `:1123-1125` is unquoted, and the section's note says "verbatim where quoted", so `reader.rs:6-8`'s claim of the human's own words is false.*
- *P2 and P5: `log.rs` carries emphasis markers the quotes drop.*
- *P3: the words are in `record.rs`'s doc of `AUDIT_SCHEMA`, and `mod.rs` does not contain them.*
- *P4: `boundary.rs:193` capitalises its first word.*

*The routed UTF-8 whole-log refusal is recorded as the proposed PLAN node `audit-show-invalid-utf8-whole-refusal`. Its `@ ee54158` cites are read at ee54158.*

---

## The first report

main @ ee54158 — **Verdict: the draft is ready (drafting consult, not a gate). Nothing needs the human.**

## Short verdict
1. **The panic holds at ee54158.** At `kernel/src/permission/audit/reader.rs:195-196`, the guard checks two things: the length is at least 16, and byte 10 is `T`. Byte 10 is then the ASCII `T`, so indices 0, 10 and 11 are always char boundaries. Index 16 is the only one that can fail. Any `at` value that is 17 bytes or longer, has `T` at byte 10, and has byte 16 inside a multi-byte character panics. Example: `2026-08-17T08:4é`, where é takes bytes 15 and 16.
   - All three callers reach the slice: `render_pair` (:264), `render_orphan_intent` (:309) and `render_orphan_outcome` (:314).
   - Because `audit_show_lines` builds every line before `audit_show` prints any, I read it that the operator gets no stdout at all. I did not observe this from the binary.
   - Product writers cannot produce this value: both product clocks are `rfc3339_utc_now`, at `publish-bundle.rs:617` and the shell's `publish.rs:705`.
   - **Sibling sites:** none of the same class. `log.rs:324` and `:327` slice only between ASCII `"` positions in the writer's own canonical line, so they are safe for any input. `normalize.rs:156-159` is already guarded. `clock.rs:70` is a test.
2. **The fix:** add `at.is_char_boundary(16)` to the guard, the same pattern as `normalize.rs:154-156`. A value that fails it goes to the existing fallback, which prints it as stored (`reader.rs:193`, `:197-198`).
   - The fallback shipped with the reader that ADR-017's Exposure review condition 2 discharged. **No new string, code, CORRUPT category or exit code.**
   - The new guard differs from the base exactly on the inputs where the base panicked. Every other input gets the same output.
   - **What the operator sees:** the `[audit log: …]` header and every sentence. The affected sentence starts with the stored `at` value where the date would be, and the command exits with success (`publish-bundle.rs:202-209`).
3. **Gating: full.** §21b admits only docs, tests and polish, and this changes a product guard. It also edits a stated property under test, the reader's own fallback doc. The `Out-of-scope` line would therefore have to name "guarantee", so round 25, item 2 (e) applies.
4. **Tests:** P0 is T1 to T3, each panicking at the base. M1 restores the base guard (registered for T1 and T3). M2 is an off-by-one, index 15 (registered for T2). No timing and no hook.
5. **R1 to R6:** R3 does not engage. The two named audit-log boundaries are application directories (`log.rs`) and case policy (`normalize.rs`, `log.rs`), and neither is touched.

## For the custodian (not the human)
- **Misquoted doc comments in `reader.rs`.** Five quoted passages there do not match their sources byte for byte, and two name the wrong source. The worst is `:6-8`, which is marked as the human's own words, verbatim, while `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1123-1125` records the custodian's wording. Your brief says to route other defect classes, so §0 routes them and §8 freezes those lines. Your memory "scope is the file, not the rows" points the other way. If you'd rather fold them in, it is about 10 doc lines and needs a §2 item before commit.
- **A log that is not valid UTF-8 is refused whole.** `publish-bundle.rs:196-198` refuses the entire log, so one bad byte hides every record rather than showing one CORRUPT line. That is not a panic; it is routed to you as an S3 candidate.

(The first report's fenced DRAFT followed here. It is superseded by the second report's amended draft and is not repeated.)

## Notes on the draft
- Every hash is `<custodian>`: I have no Bash. All cites are at ee54158, a main commit.
- In the intake row for `log.rs:324` and `:327`, the commit and hash are carried by the pinned range in the next cell, so no bare `:line` stands on its own.
- T2 carries the character as a JSON `\u00e9` escape and T3 as raw UTF-8 bytes, so both ways a hand edit can store it are covered.
- I did not run anything. P0 will be the panic's first reproduction.

## Paths read
- C:/dev/spatial-ide/kernel/src/permission/audit/reader.rs
- C:/dev/spatial-ide/kernel/src/permission/audit/log.rs (36-45, 180-349)
- C:/dev/spatial-ide/kernel/src/permission/audit/clock.rs
- C:/dev/spatial-ide/kernel/src/permission/audit/normalize.rs (140-169)
- C:/dev/spatial-ide/kernel/src/permission/audit/mod.rs
- C:/dev/spatial-ide/kernel/src/permission/audit/record.rs (grep only)
- C:/dev/spatial-ide/kernel/src/permission/boundary.rs (grep only)
- C:/dev/spatial-ide/kernel/src/bin/publish-bundle.rs (1-225, 655-743)
- C:/dev/spatial-ide/kernel/src/skp.rs (1505-1532)
- C:/dev/spatial-ide/PLAN.yaml (the nodes `audit-reader-char-boundary` and `port-2-macos-l1-and-app-dirs`)
- C:/dev/spatial-ide/state/cloud/wave1/A3.md
- C:/dev/spatial-ide/state/questions/round-31.md
- C:/dev/spatial-ide/docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md (1105-1149)
- C:/dev/spatial-ide/state/directives/PORTABILITY-2026-09-30.md (§2)
- C:/dev/spatial-ide/kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md
- C:/dev/spatial-ide/kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-01-catalog-replace-note-gate1-architect.md
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
- C:/dev/spatial-ide/AUTONOMY.md (§21 to §21d, §25)
- C:/dev/spatial-ide/scripts/plan/verify-test-claims.mjs (the prefix set at line 95)

ADR-006 was read through the class-3 audit module docs (`mod.rs`), not opened directly. I did not open ADR-024 beyond a grep.

---

## The second report (the amended draft)

main @ ee54158 — **Amended draft: ready. Nothing needs the human.**

All five misquoted passages are now in scope (§2 item 6). Each is corrected to an unquoted paraphrase that names its true source. I did not byte-copy any of them, for three reasons:
- the sources the passages quote from span line breaks (P1, P2, P3, P5) or differ in case (P4), so a byte-exact copy would need a pinned `path:line @ commit sha256` inside product doc;
- `verify-cites` would then gate that cite;
- under round 12 (b), reproducing text is the exception.

Two passages named the wrong source:
- **P1** credits the human's words, verbatim. The ADR's text is the custodian's record of the ruling, and the ADR's own note says it is verbatim only where quoted. Condition 2 carries no quotation marks.
- **P3** names `super::mod`. The words are in `super::record`, on the doc comment of `AUDIT_SCHEMA`.

All five sources were found, so the new invalidator I8 does not fire at ee54158.

## Current text of the five passages (for your check only, not for the form)
I copied these from my Read output at ee54158 by hand; no script made them. The form refers to them by path:line only.
- P1, `kernel/src/permission/audit/reader.rs:6-8`: `//! **ADR-017's Exposure review, 2026-08-17, condition 2** — the human's own words, verbatim: *"the` / `//! audit record must be human-legible without a decoder in the loop ... the raw JSONL was honest` / `//! but unreadable by its own audience"* (G6). This module is that reader; `publish-bundle`
- P2, `:21-23`: `//! The same doctrine `super::log`'s own module docs state for the write side — *"an interleaved` / `//! line fails to parse and is visible as corrupt, rather than silently changing a valid record's` / `//! meaning"* — governs the read side too. A line that does not parse as JSON, that does not carry`
- P3, `:30-31`: `//! `super::mod`'s own module docs: *"the log is append-only, so generation N and generation N+1` / `//! coexist in one file forever and a reader will meet both."* This is not hypothetical for`
- P4, `:211-212`: `/// `error_kind`'s stable variant name (`boundary.rs::error_kind`'s own doc comment: "a variant` / `/// name, never a rendered message") turned into a plain-language fragment for a reader with no`
- P5, `:342`: `            // (`log.rs`'s own module docs: "an interleaved line fails to parse").`

## The routed UTF-8 refusal (for a proposed PLAN node)
- **Title:** publish-bundle --audit-show refuses the whole audit log over one invalid UTF-8 byte, instead of reporting that line as CORRUPT.
- **Suggested severity: S2 (record).**
  - The behaviour is certain: `read_to_string` errors on any invalid UTF-8 (`kernel/src/bin/publish-bundle.rs:182` @ ee54158 sha256:<custodian>, with the refusal at `:196-198` @ ee54158 sha256:<custodian>).
  - It comes only from trusted, local input. The operator sees a refusal naming the path, so it is visible, but no record in the log can be read. That is the same consequence as this node's panic, without the crash.
  - It was not reproduced. If you hold to the tie-breaker, it is S3.
  - Any fix that adds a CORRUPT form for such a line is new operator wording, which is the human's.

(The second report's fenced DRAFT followed here. It is not repeated: the committed form, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, is that draft with the edits its header lists.)

## Notes on the draft
- Everything not listed in your request is as I first drafted it.
- I also checked two other quotations in `reader.rs`, and both stay:
  - The clock reasoning at :192 matches `clock.rs:31`.
  - :44 quotes the reader's own output at :310 and matches it.
- Every hash is `<custodian>`, and all cites are at ee54158 (on main).
- No paraphrase in this report or the draft sits in quotation marks. The corrected texts in §2 item 6 are new prose.

## Additional paths read
- C:/dev/spatial-ide/kernel/src/permission/audit/record.rs (38-57)
- C:/dev/spatial-ide/kernel/src/permission/boundary.rs (186-201)
- C:/dev/spatial-ide/state/cloud/wave1-prompts.md (the severity rule, lines 107-110)
