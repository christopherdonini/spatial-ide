# windows-case-fold-non-ascii: Amendment 1, lead-data's draft of the re-read after port-2's merge (class 3, not appended)

*Filed by the custodian: node:windows-case-fold-non-ascii@amendment-1-lead-data. It is a draft and gives no verdict. It is not appended to the form: its questions Q1 to Q4 (the class, the macOS wording, the strip at the root, and the form's amendment style) go to the advisor first. The custodian checked its eleven Old texts against the form at cdfebef1eecdda586cd7c9aca41941447b453a99 by git show: each is found once above the Amendments heading, on the line it cites; its quotations of port-2's form, cfg-boundary.mjs, AUTONOMY.md, the template and log.rs were found on their cited lines. The custodian's brief said that five files changed from b1bdb8ac to cdfebef1; that list was limited by the brief's pathspec, and `git diff --name-only` names two more in the range, `kernel/src/permission/boundary.rs` and `.github/workflows/product-ci-rust.yml`, as the draft's own note found. For Q2: main's last product Rust CI run, 44937294148 at 1cefb63f (created 2026-11-21T18:45:56Z by gh), passed its macos-latest entry, read at 2026-11-24T07:12:39Z. It ran during no build, in the sitting. Dispatched at 2026-11-24T07:01:01Z; its run: Grep 19, Read 19, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T07:01:01Z to 2026-11-24T07:08:38Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T07:08:38Z. 20405 bytes, sha256 f47c2c73aac6bc6810eb8170f160397635cf3f149668689b1aab040c1ff2180e, byte for byte but for 1 of the profile's path or the account's name, written as <m>, <u> and <t> by the custodian, with one final newline added.*

---

Result: The form's log.rs part holds as written. Port-2 left `is_inside` and its case policy untouched, so the Change clause, T3, M4 and N2's two log.rs rows stand. What moved is the pins, the log.rs cfg-site figure (3 is now 1), and the CI wording, because port-2 added a macos-latest entry. The piece does not stop.

---AMENDMENT 1---
## Amendment 1 — 2026-11-24 — the re-read after port-2's merge, before any code (class 3)

Written before any code of this piece and before any run of its tests or mutations. It records the re-read that the custodian's settlement orders in its rule (00) bullet, and that the draft's last section asks for. Read at cdfebef1eecdda586cd7c9aca41941447b453a99, which is current main 4b17d9daea35d89040058d23c9594ca81050445f for kernel/, engine/, scripts/plan/ and this form.

**1. The custodian's facts (checked by git, not lead-data's reads).**
- Port-2 merged as PR 324 by merge commit 70586ced (2026-11-15).
- Entry 7b merged as PR 279 by merge commit f848b8c1.
- From b1bdb8ac to cdfebef1, log.rs, normalize.rs, `kernel/tests/case_policy_volume.rs` (new), `scripts/plan/cfg-boundary.mjs` and its test changed.
- From cdfebef1 to 4b17d9da, nothing under these paths changed.
- At 4b17d9da no open PR has a file under `kernel/src/permission/audit/`, and the three clippy branches have no diff against main.
- So the Scope line's dispatch condition, that port-2 has merged, is met. Its proof is PR 324's merge commit 70586ced.

**2. `is_inside` at cdfebef1.**
- **Where it is.** `kernel/src/permission/audit/log.rs`: the doc at lines 381 to 387, the body at lines 388 to 399. The Windows comparison is the `#[cfg(windows)]` at line 396 and the line after it, line 397, which reads `let (p, r) = (p.to_ascii_lowercase(), r.to_ascii_lowercase());`. That is the form's read, unchanged.
- **Callers.** `AuditLog::open_for` at log.rs line 128. `execute` at `kernel/src/permission/boundary.rs` line 349, through the alias imported at boundary.rs line 116.
- **Tests that reach it.** `a_log_resolving_inside_the_destination_is_refused` at log.rs lines 438 to 454 (ASCII, `/` only). `kernel/tests/permission_boundary.rs::an_audit_log_inside_the_destination_is_refused` at lines 660 to 687, through the boundary, with one spelling on both sides. Neither has a case variant, and the Invalidators cover both.
- **Port-2 did not change the case policy.**
  - Its form says "`is_inside` is untouched." (`governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, line 141 at cdfebef1).
  - It names `is_inside` among its invalidators (same file, line 306 at cdfebef1).
  - Its 1c-2 row reads "**In**: K1 verifies it. No product change." (same file, line 49 at cdfebef1).
  - K1 (`kernel/tests/case_policy_volume.rs`, lines 261 to 307 at cdfebef1) is an integration test of `resolve_destination` into `normalize_with`. It swaps ASCII letters only (its `swap_case`, lines 238 to 250). It runs on Windows and macOS, is ignored on Linux, never calls `is_inside`, and adds no volume probe to product code.
  - Port-2's log.rs edit is "`data_dir`'s body becomes `spatial_engine::app_dirs::user_data_dir()`. Its two cfg arms go." (port-2's form, line 139 at cdfebef1), plus the module doc.
- **What follows.** The Change line's `is_inside` clause, T3 with its two assertions, M4 with its predicted failure and N2's two log.rs rows (9 and 14 lines) hold as written. Only their pins move (item 7).
- **T3's boundary.** The boundary T3's ignore reason names is log.rs's allowlist label, now `filesystem case policy` alone (`scripts/plan/cfg-boundary.mjs`, line 31 at cdfebef1).
- **K1 and T2.** K1 now observes on Windows (H2 of port-2's form) that canonicalization returns the on-disk case of the parent, for ASCII letters only. T2's first assertion is still the piece's own observation of that for a non-ASCII letter, as the settlement says.

**3. normalize.rs at cdfebef1.** Each place the form cites, by the form's line at b1bdb8ac and the line at cdfebef1:

| Place | Form's line | At cdfebef1 |
|---|---|---|
| module doc, the component-exact limit (OPEN-2; last section) | 19-24; 22-24 | 19-24; 22-24 (unchanged) |
| step 4, the username compare | 98 | 100 |
| roots from the environment | 116-142 | 118-149 (`roots_from_environment` at 118-120 now calls `roots_from` at 123-149 with the environment passed in) |
| usernames from the environment | 144-146 | 158-160 |
| the strip's `is_char_boundary` doc | 153-162 | 167-176 |
| the strip's byte split | 163-167 | 177-181 |
| the strip's `component_eq` call | 168 | 182 |
| `component_eq`'s doc | 178-184 | 192-198 |
| `component_eq` (its cfg arms at 200 and 204) | 185-194 | 199-208 |
| the non-ASCII panic test | 266-291 | 294-319 |
| `case_differences_collapse_on_windows` | 295-302 | 354-361 |
| `fold`'s intended place | (no line given) | beside `component_eq`, between line 208 and the `#[cfg(test)]` at line 210 |

- **What 7b changed.**
  - Step 2 is now `to_slashes` (lines 151 to 156), which maps each `std::path::is_separator` character to `/`.
  - `roots_from` was split out of `roots_from_environment`.
  - The test helper `norm` now feeds the platform's own separator (lines 227 to 231).
  - Two tests gained a `not(windows)` ignore with a path-syntax reason.
  - The panic test's inputs are now spelled with `/` and run on every platform.
  - It added `a_posix_backslash_stays_a_name_byte_in_a_profile_root_and_a_destination` (lines 338 to 350), ignored on Windows.
  - None of this touches `component_eq`, the strip or step 4's compare.
- **Do T1, T2 and M1 to M3 still hold?** On Windows `to_slashes` maps `\` and `/` to `/`, so T1's backslash inputs reach the strip as `/` paths, as before. The Change line, T1's roots, user and four assertions, T2, M1, M2 (the `is_char_boundary` guard it names is still at line 178) and M3, with their predicted failures, read true against the code. The panic test still pins the no-panic property after the guard goes.
- **Redrafted:** T1's ignore reason. normalize.rs's tests now carry three boundary reasons (two for path syntax, one for filesystem case policy), so "the existing boundary reason" names none of them. Item 8, pair 1.

**4. The CI entries.** At cdfebef1, `.github/workflows/product-ci-rust.yml` has three entries (lines 202 to 208): the Windows entry, which runs on `windows-2022` and keeps its job name (lines 201 to 204), ubuntu-24.04, and macos-latest, which port-2 added.
- T1 to T3 are ignored off Windows, so on macos-latest they are ignored too and listed by its R6 step (lines 255 to 257).
- Port-2's closing record says "CI's macOS entry fails on the sort-window test alone at both pushes (Amendment 4 item 3), and that binary stops the run." (port-2's form, line 461 at cdfebef1). Whether that still holds at main is not read here.
- Item 8, pairs 2 and 6 to 11, carry this.

**5. The cfg-site counts.**
- **At cdfebef1.** The check's test expects 19 sites in 7 files (`scripts/plan/cfg-boundary.test.mjs`, lines 75 and 77 at cdfebef1). The per-file map (lines 84 to 92) gives log.rs 1 (line 89) and normalize.rs 2 (line 90).
- **Where the sites are.** The check "drops the body of each `#[cfg(test)] mod name { ... }`" (`scripts/plan/cfg-boundary.mjs`, line 12 at cdfebef1), so T1 to T3's `cfg_attr`s count nowhere. log.rs's one site is `is_inside`'s `#[cfg(windows)]` at line 396. normalize.rs's two are `component_eq`'s arms at lines 200 and 204.
- **The planned code adds and removes none.** It moves normalize.rs's two arms into `fold` (2 stays 2) and keeps `is_inside`'s single `#[cfg(windows)] let` (1 stays 1). The total stays 19 in 7 files, and the check's test needs no edit.
- **The stale figure.** The Out-of-scope line's "log.rs at 3" and N3's "log.rs stays at 3 sites" are stale: port-2 removed `data_dir`'s two arms, and its expected map gives `log.rs` 1 (port-2's form, line 147 at cdfebef1).
- **What the Invalidators read.** The count each file is checked against is its count at the piece's base: normalize.rs 2, log.rs 1. Item 8, pairs 3 and 4, restate the figure so that the form and the tree agree.

**6. Scope and size.**
- **Scope holds.** The Scope line holds: 2 files, about 122 lines by N2's rows (normalize.rs 55 + 44, log.rs 9 + 14), declared 145. No row moves, because neither 7b nor port-2 touched `component_eq`, the strip, step 4 or `is_inside`'s body.
- **Inside §21c.** The piece stays inside "≤ 150 changed lines of non-generated code across ≤ 8 files" (`governance/AUTONOMY.md`, line 350 at cdfebef1).
- **This amendment's words are exempt.** §21c's exempt set is "the piece's own five-line preregistration file" (`governance/AUTONOMY.md`, line 357 at cdfebef1). No full form follows from this re-read.

**7. Moved cites.** The form's text, the line at cdfebef1, and whether the words still hold.

| The form's cite | Where it appears | At cdfebef1 |
|---|---|---|
| `kernel/src/permission/audit/log.rs:398-399` | Out-of-scope; N2; N6 | lines 396-397; words hold |
| `kernel/src/permission/audit/log.rs:125` | N2 | line 128; holds |
| `kernel/src/permission/audit/log.rs:440-456` | N4 | lines 438-454; holds |
| `kernel/src/permission/audit/log.rs:132-137` | N1 (3) | lines 135-140; holds |
| `kernel/src/permission/audit/log.rs:340-363` | N1 | lines 343-366; holds |
| `kernel/src/permission/audit/log.rs:370-374` | N1 | `data_dir` at lines 368-379, its body now `spatial_engine::app_dirs::user_data_dir()` (line 378). On Windows the directory is still `LOCALAPPDATA`, used only when absolute (its doc, lines 370-373), so N1's sentence holds for Windows |
| `kernel/src/permission/boundary.rs:325` | N1 | line 330; holds |
| `kernel/src/permission/boundary.rs:344` | N1; N2 | line 349; holds |
| `kernel/src/permission/boundary.rs:363` | N1 | line 368; holds |
| `kernel/src/permission/boundary.rs:366` | N1 | line 371; holds |
| normalize.rs, each place | Out-of-scope; N1; N2; N4; OPEN-2; last section | as in item 3's table; words hold |
| `scripts/plan/cfg-boundary.test.mjs:86-87` | Out-of-scope | lines 89-90; the figure restated by pair 3 |
| `scripts/plan/cfg-boundary.test.mjs:73-75` | N4 | lines 75-77; the figure restated by pair 7 |
| `scripts/plan/cfg-boundary.mjs:30-31` | N5 | lines 31-32; log.rs's label is now `filesystem case policy` alone; holds |
| `.github/workflows/product-ci-rust.yml:194-195` | Tests+mutation | lines 202-204; holds |
| `.github/workflows/product-ci-rust.yml:233-234` | Tests+mutation | lines 250-251; holds |
| `.github/workflows/product-ci-rust.yml:238-240` | Tests+mutation | lines 255-257; restated by pair 2 |

The form's other pins (`grant.rs`, `publish/mod.rs`, `bundle/redaction.rs`, `session_history.rs`, `kernel/tests/permission_boundary.rs`, `kernel/PERMISSION-BOUNDARY.md`, KNOWN-LIMITATIONS, `engine/src/watch.rs`, PLAN.yaml, the governing documents and the forms) were not re-read for this amendment. Three were spot-read: `resolve_destination` (`kernel/src/permission/grant.rs`, lines 190 to 213), the declared limits (`kernel/PERMISSION-BOUNDARY.md`, lines 300 to 310) and §21c (`governance/AUTONOMY.md`, lines 347 to 357) read at the form's lines at cdfebef1. The rest stay historical pins at b1bdb8ac.

**8. The form text the re-read changes.** Each Old occurs once in the form above its Amendments heading. Nothing above is edited: each New is how the line reads from this amendment on.

1. Tests+mutation, T1. Old: `(Windows; ignored elsewhere with the existing boundary reason)` New: `(Windows; ignored elsewhere with the reason `case_differences_collapse_on_windows` carries, the filesystem case policy one)`
2. Tests+mutation. Old: `on ubuntu-24.04 they are ignored and listed by the R6 step` New: `on ubuntu-24.04 and on macos-latest they are ignored and listed by the R6 step`
3. Out-of-scope. Old: `normalize.rs stays at 2, log.rs at 3` New: `normalize.rs stays at 2, log.rs at 1, the count port-2 left it at`
4. N3, placement. Old: `(log.rs stays at 3 sites)` New: `(log.rs stays at 1 site)`
5. N3, placement. Old: `port-2 edits it` New: `port-2 edited it`
6. N4. Old: `Declared unchanged and green on both jobs:` New: `Declared unchanged, green on the Windows and ubuntu-24.04 jobs, and unchanged in outcome on macos-latest:`
7. N4. Old: `cfg-boundary's 18 sites` New: `cfg-boundary's 19 sites`
8. N4, R6. Old: `Linux's gains T1, T2 and T3, each single-platform by construction.` New: `Linux's and macOS's each gain T1, T2 and T3, each single-platform by construction.`
9. N4, Invalidators. Old: `any other test changing outcome on either job` New: `any other test changing outcome on any of the three jobs`
10. N5, Windows. Old: `T1 to T3 run on windows-latest` New: `T1 to T3 run on the Windows job (named for windows-latest, running on windows-2022)`
11. N5, macOS. Old: `There is no macOS job. It stays explicitly reduced, as today.` New: `Port-2 added a macos-latest entry, where T1 to T3 are ignored with their reasons and listed by its R6 step; port-2 made no product change to the case policy there, which its K1 verifies. It stays explicitly reduced, as today.`

**9. The class.**
- **The rule relied on.** Class 3, "**Cite / line-number / tense fixes** — stale cross-references corrected" (`docs/PREREGISTRATION-TEMPLATE.md`, line 110 at cdfebef1), which "Never changes a claim, only where it points." (same file, line 112 at cdfebef1). A short form takes its amendment from the same list: "A short-form piece that needs an amendment uses the same five classes above" (same file, line 160 at cdfebef1).
- **How each change reads under it.** Each change here moves a pointer, corrects a tense (pair 5), or restates a figure the cited tree now holds (pairs 2, 3, 4, 6 to 11). None changes what the piece does, tests, mutates or claims: still no change to either file's cfg-site count, T1 to T3 still ignored off Windows and listed by R6, and Linux and macOS still compared exactly.
- **Its first line.** The form's own rule says that "an amendment written after any run of this piece's tests or mutations has been seen says so in its first line" (this form, its lead paragraph). This amendment's first line says that none has been seen.

**10. Rule (00) and the ready node `posix-backslash-is-inside-and-redaction-label`.**
- **Where the two would meet.** Its title says `is_inside` stops treating a backslash as a separator on POSIX. That is the `norm` closure's `.replace('\\', "/")` at log.rs line 391. This piece edits `is_inside`'s doc (lines 381 to 387) and its Windows line (lines 396 to 397). So the two would meet in `is_inside`'s body: different lines of one twelve-line function, both changing how the two strings are compared before they are compared.
- **Whichever lands second.** It rebases and re-reads the other's lines. T3's inputs use `/` only, so they do not depend on the separator rule. A cfg site that node might add to `is_inside` would move log.rs's count, and the Invalidators of whichever piece is second would read it at that piece's base.
- It is paused platform work, not in flight, and it is not planned here.

**11. The reuse index** (the standing step), run for this amendment's brief on 2026-11-24, is a miss: it records no prior art for the query windows case fold non-ascii path. The in-repo prior art stays the Authority line's engine watcher fold. Port-2's K1 is now in-repo prior art for the shape of T2's volume observation: the temporary directory canonicalized first, and a precondition that fails loudly.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**Each Old text, checked by Grep against the form at cdfebef1 (one hit each, all above `## Amendments`):**
- pair 1: line 9
- pair 2: line 9
- pair 3: line 10
- pair 4: line 68
- pair 5: line 70
- pair 6: line 74
- pair 7: line 78
- pair 8: line 80
- pair 9: line 81
- pair 10: line 85
- pair 11: line 87

**Moved cites, old to new:** the table in item 7 and the normalize.rs table in item 3.
- boundary.rs moved by 5 lines (325, 344, 363 and 366 became 330, 349, 368 and 371), and `.github/workflows/product-ci-rust.yml` changed (the macOS entry, and the Windows entry now on windows-2022). Neither file is in your five-file list for b1bdb8ac to cdfebef1.
- Either that list was limited by a pathspec, or these files moved in commits you did not list. Please confirm by git.
- I mapped the workflow pins by content, not by reading the file at b1bdb8ac. Lines 194-195 are the Windows matrix entry, 233-234 the ordinary suite step, 238-240 the R6 step.

**Line estimates:** unchanged at about 122 against the 145 declared, 2 files. I re-checked N2's rows against the code at cdfebef1:
- `component_eq`'s body is 8 lines (lines 200 to 207), replaced by 1.
- The strip's guard paragraph is 10 lines (lines 167 to 176), replaced by about 4.
- The guard and split are 4 lines (lines 178 to 181), replaced by about 3.
- `is_inside`'s Windows line is 1 line (line 397), replaced by about 6.
- `fold`, T1, T2 and T3 are unaffected by 7b and port-2.
- The amendment's own words are exempt under §21c.

**Questions for the advisor (none blocks the filing):**
- Q1, the class. I drafted class 3. If a gate reads the macOS-entry sentences (pairs 2, 6, 8, 9, 11) or the log.rs figure (pairs 3, 4) as changed claims, no pre-declared class fits a pre-code re-read ordered by the form's own settlement. Should the custodian name the class?
- Q2, the macOS wording. Pair 6's "unchanged in outcome on macos-latest" avoids claiming macOS green, because port-2's closing record (its form, line 461) has the macOS entry failing on the sort-window test. Is that entry green at main now? If so, pair 6 can say green.
- Q3, the strip at the root (not caused by port-2 or 7b, found on this re-read). N2's split index `s.char_indices().nth(root.chars().count())` returns `None` when the destination is exactly the root. N1's route (2), `--out C:\Users\JOSÉ`, is that case, and T1 has no assertion for it. If the worker propagates `None`, route (2) stays open. Should the custodian add the `s.len()` case and an assertion through an amendment before code (about 3 lines), or put it in the worker's brief?
- Q4, the form's style. The template's short-form rule ends "in a one-line `Amendment:` note appended beneath the five lines." (`docs/PREREGISTRATION-TEMPLATE.md`, lines 160 to 161 at cdfebef1). This form has an Amendments section, and the brief asks for a headed amendment. Is that a style question for the custodian?

**Observations outside the amendment:**
- The Change line calls `fold` "private", but N3 makes it `pub(crate)`. This is in the form at b1bdb8ac, not moved by the re-read.
- On macOS the case policy stays exact. K1 covers the parent's on-disk case, but a final component or a username component typed in another case on APFS is still compared exactly. That is outside this piece.

Report path: state/consults/2026-11-24-windows-case-fold-non-ascii-amendment-1-re-read-after-port-2-lead-data-draft.md (no file written, as the brief says, so no sha256; I have no shell).

**Files read** (all in D:/wt/read-1124c at cdfebef1, except the scratch diff):
- `kernel/README.md` (owner's index)
- `engine/README.md` (owner's index)
- `governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md`
- `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/wcf-diff-b1bdb8ac-cdfebef1.txt`
- `kernel/src/permission/audit/normalize.rs`
- `kernel/src/permission/audit/log.rs` (lines 115-144 and 335-464, plus greps)
- `kernel/src/permission/boundary.rs` (lines 320-374)
- `kernel/src/permission/grant.rs` (lines 186-215)
- `kernel/tests/permission_boundary.rs` (lines 655-686)
- `kernel/PERMISSION-BOUNDARY.md` (lines 296-311)
- `scripts/plan/cfg-boundary.mjs` (lines 1-80)
- `scripts/plan/cfg-boundary.test.mjs` (lines 60-93)
- `.github/workflows/product-ci-rust.yml` (lines 196-258)
- `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md` (lines 78-149 and 298-309, plus greps)
- `governance/forms/kernel/POSIX-BACKSLASH-IN-SHARED-PATH-LOGIC-PREREGISTRATION.md` (grep)
- `governance/AUTONOMY.md` (lines 347-386)
- `docs/PREREGISTRATION-TEMPLATE.md` (lines 99-178)
- `governance/PLAN.yaml` (grep, the ready node)
- `engine/src/watch.rs` (grep)
- `.claude/agents/architect.md` (grep)
- `kernel/tests/case_policy_volume.rs` (read through the diff, which carries it whole as a new file)

Model: Opus 5.5 (claude-opus-5-5).
