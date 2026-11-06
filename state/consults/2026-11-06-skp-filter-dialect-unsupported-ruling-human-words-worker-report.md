*Custodian's filing note (2026-11-06): the words worker's report for 8e's three notes in the human's reworded words (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`, lines 8 to 12; the form's Amendment 4), applied as three byte-given replacements in three Markdown files, with no re-gate. Dispatched at 2026-11-06T16:55:44.615Z by its transcript from a brief of 13206 bytes (sha256 c36cc845f3ea63740f3ca4c4470a4026872a9b1af786d2030affb05c9730c297), whose span files were byte-copied by script and whose expected file hashes and numstat the custodian computed by applying the spans to copies. The run to its hand-back at 2026-11-06T17:09:41.095Z by its transcript (claude-sonnet-5-5; unique calls Bash 13, Read 1, Write 2 and the hand-back, 17, equal to the notification's). Saved from the hand-back message, one final newline. Its sha256, from line 5 to the end, is 7a2ae16d43f1d7c9b4f40e15d5a22c07eb7b083e413152f54288a9f61562862f. The custodian re-read, after a fetch: `cut/skp-filter-dialect-unsupported-ruling` at 918bb7722560084a6bbd2e0050872089836447fd, the changed files' sha256 as given, and the numstat 2/2, 2/2 and 1/1 against 2aca6898. Model output, not Authority.*

---

Built: 8e's reworded notes at 918bb7722560084a6bbd2e0050872089836447fd

- Start state: HEAD and origin/cut/skp-filter-dialect-unsupported-ruling both 2aca68983bd53f1d65cc993810c130ca9c09f5f9; porcelain empty.
- Brief sha256 c36cc845...730c297 matched. All 6 span files matched their given sha256 and byte counts (old E1/E2/E3 d180bf0d.../ad4b1cc8.../0c30b721...; new 57289e1e.../c6e200f3.../6f115785...).
- Script (sfdu-w-apply.mjs, rc=0): each old text found exactly once (offsets 10912, 25461, 14072), replaced as bytes, LF kept.
- Hashes after the edits matched all three given: ADR-033 1549ca71..., ADR-021 804b9ba1..., docs/02 e5be9b85....
- `git diff --numstat` showed exactly 1/1 docs/02, 2/2 ADR-021, 2/2 ADR-033. CR count 0 in each file.
- Commit subject: "docs: 8e, the human's reworded notes (ADR-033's note replaced, ADR-021's one clause, docs/02's parenthesis)". The message file had `@` only in the first trailer line. It was added with `git add` by path and committed with `-s`.
- Checks at the new head:
  - verify-cites: rc 0, "PASS — every rooted (in-tree) path:line reference across 2698 file(s) resolves."
  - verify-quotes (in a shared hold): rc 0, "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors ... 0 ruling-cite errors."
  - verify-test-claims: rc 0, PASS, 740 claimed tests across 238 files.
  - verify --offline: rc 0, "verify:plan PASS".
  - node --test: rc 0, 598 tests, 598 pass, 0 fail.
  - `git diff --numstat origin/main...HEAD`, rc 0, 9 files, total +113 -67:

    ```
    1  1  docs/02_Architecture.md
    6  0  docs/adr/ADR-021-row-filter-on-viewport-query.md
    6  0  docs/adr/ADR-033-connection-lease-classes-for-admission-work.md
    23 30 engine/src/predicate.rs
    0  1  engine/tests/admission_property_campaign.rs
    0  1  engine/tests/filter_type_admission.rs
    14 30 kernel/src/skp.rs
    2  1  protocol/skp/SKP-V0.md
    61 3  protocol/skp/src/v0/commands.rs
    ```
- Hold line: MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:65224 (also= elided). It was granted and released ("MACHINE_RELEASED project=SpatialIDE ... affinity=FF").
- Push: rc 0, 2aca6898..918bb772. origin/cut/skp-filter-dialect-unsupported-ruling equals HEAD (918bb772...); porcelain empty. I did not wait for CI.
- Background shells: three tool-backgrounded calls ran (the hold call and two wait loops). All three completed with exit 0 before this report, so none is left running and I killed none.
- Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override.
- Context handoff: none received, none produced.
- Pre-gate self-check: no cross-module code was touched (Markdown only). The completion claims above are backed by the cited command outputs. No user-facing message was added. The checks reached their final result lines.
