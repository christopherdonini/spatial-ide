# windows-case-fold-non-ascii: Amendment 1 with the exact-root item (class 9) and the fold pair, lead-data's draft (not appended)

*Filed by the custodian: node:windows-case-fold-non-ascii@amendment-1-q3-lead-data. It is a draft and gives no verdict, and it is not appended to the form: its questions Q5 and Q6 go to the advisor first. It redrafts the draft filed at `state/consults/2026-11-24-windows-case-fold-non-ascii-amendment-1-re-read-after-port-2-lead-data-draft.md` under ADV-2026-11-24-17 items 4 and 6. The custodian checked, by git show: the twelve Old texts each occur once in the form above its Amendments heading; its eighteen verbatim quotations on their cited lines at cdfebef1eecdda586cd7c9aca41941447b453a99, and the ruling's words in ADV-2026-11-24-17; every path it read is the same at cdfebef1eecdda586cd7c9aca41941447b453a99 and at main d7a126ac5965a37b4d1586c97b9162c7ea9b9911; and its code cites. Its item 2 corrects a cite the earlier draft carries: K1 is at lines 62 to 108 of `kernel/tests/case_policy_volume.rs` and its `swap_case` at 39 to 51, not 261 to 307 and 238 to 250. It ran during no build, in the sitting. Dispatched at 2026-11-24T07:30:21Z; its run: Read 8, Grep 7, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T07:30:24Z to 2026-11-24T07:35:24Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T07:35:23Z. 26437 bytes, sha256 f7944648332d902c0f293083654acefbc7e8e9bdb86d023aab782e1e95f6574b, byte for byte, nothing masked; the six paths under C:/Users that name a user called José, or the `<user>` token, are the form's own test inputs and stay as written, with one final newline added.*

---

Result: I redrafted Amendment 1 with the ruling's additions: pair 12 for the `fold` word (class 3, Old on form line 8) and item 12, the exact-root case with T1 (e) and M5 (class 9, a scope addition, on ADV-2026-11-24-17). The estimate is about 130 lines against the declared 145, so class 6 is not taken now. One cite from the earlier draft was wrong and is corrected (see the changes below).

---AMENDMENT 1---
## Amendment 1 — 2026-11-24 — the re-read after port-2's merge and the exact-root addition, before any code (class 3; class 9, a scope addition, for item 12)

Written before any code of this piece and before any run of its tests or mutations. It records the re-read that the custodian's settlement orders in its rule (00) bullet, and that the draft's last section asks for. Read at cdfebef1eecdda586cd7c9aca41941447b453a99, which is current main 4b17d9daea35d89040058d23c9594ca81050445f for kernel/, engine/, scripts/plan/ and this form. Item 12 and pair 12 add what ADV-2026-11-24-17 rules in its items 4 and 6. They were read at the same commit, which for kernel/, this form, `docs/PREREGISTRATION-TEMPLATE.md` and `governance/AUTONOMY.md` is main d5232d0f (the custodian's check by git).

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
  - K1 (`kernel/tests/case_policy_volume.rs`, lines 62 to 108 at cdfebef1) is an integration test of `resolve_destination` into `normalize_with`. It swaps ASCII letters only (its `swap_case`, lines 39 to 51). It runs on Windows and macOS, is ignored on Linux, never calls `is_inside`, and adds no volume probe to product code.
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
- **With item 12.** The re-read moves no row. Item 12's addition moves three of N2's rows, which brings the piece to about 130 lines in 2 files (item 12, its size bullet). That is still inside the declared 145 and inside §21c's bound.

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

**8. The form text this amendment changes.** Each Old occurs once in the form above its Amendments heading. Nothing above is edited: each New is how the line reads from this amendment on. Pairs 1 to 11 come from the re-read. Pair 12 comes from ADV-2026-11-24-17 item 6.

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
12. Change, the word for `fold`'s visibility (N3 makes `fold` `pub(crate)`, with product callers in both files). Old: `one private std-only map` New: `one crate-visible std-only map`

**9. The classes.**
- **Class 3, as ruled.** ADV-2026-11-24-17 rules class 3 for pairs 1 to 11 (its item 2) and for pair 12 (its item 6).
- **The rule relied on.** Class 3, "**Cite / line-number / tense fixes** — stale cross-references corrected" (`docs/PREREGISTRATION-TEMPLATE.md`, line 110 at cdfebef1), which "Never changes a claim, only where it points." (same file, line 112 at cdfebef1). A short form takes its amendment from the same list: "A short-form piece that needs an amendment uses the same five classes above" (same file, line 160 at cdfebef1).
- **How each change reads under it.** Each change here moves a pointer, corrects a tense (pair 5), or restates a figure the cited tree now holds (pairs 2, 3, 4, 6 to 11). None changes what the piece does, tests, mutates or claims: still no change to either file's cfg-site count, T1 to T3 still ignored off Windows and listed by R6, and Linux and macOS still compared exactly. Pair 12 brings the Change line's word into line with N3. It changes nothing `fold` does.
- **Class 9 for item 12, on the ruling.** ADV-2026-11-24-17 item 4 rules item 12 "class 9, a scope addition, on this ruling". Class 9 is "Scope addition on a standing rule" (`docs/PREREGISTRATION-TEMPLATE.md`, line 170 at cdfebef1). Its first line "carries the words `scope addition`", and the amendment declares the addition "Before any code of the addition" (same line). Item 12 does both. Its estimate stays inside the declared 145, so class 6 is not taken (item 12, its size bullet).
- **Its first line.** The form's own rule says that "an amendment written after any run of this piece's tests or mutations has been seen says so in its first line" (this form, its lead paragraph). This amendment's first line says that none has been seen.

**10. Rule (00) and the ready node `posix-backslash-is-inside-and-redaction-label`.**
- **Where the two would meet.** Its title says `is_inside` stops treating a backslash as a separator on POSIX. That is the `norm` closure's `.replace('\\', "/")` at log.rs line 391. This piece edits `is_inside`'s doc (lines 381 to 387) and its Windows line (lines 396 to 397). So the two would meet in `is_inside`'s body: different lines of one twelve-line function, both changing how the two strings are compared before they are compared.
- **Whichever lands second.** It rebases and re-reads the other's lines. T3's inputs use `/` only, so they do not depend on the separator rule. A cfg site that node might add to `is_inside` would move log.rs's count, and the Invalidators of whichever piece is second would read it at that piece's base.
- It is paused platform work, not in flight, and it is not planned here.

**11. The reuse index** (the standing step), run for this amendment's brief on 2026-11-24, is a miss: it records no prior art for the query windows case fold non-ascii path. The in-repo prior art stays the Authority line's engine watcher fold. Port-2's K1 is now in-repo prior art for the shape of T2's volume observation: the temporary directory canonicalized first, and a precondition that fails loudly.

**12. Class 9, a scope addition, on ADV-2026-11-24-17 item 4: the exact-root case of the root strip, a fifth assertion of T1, and mutation M5.** Declared before any code of the addition, the same way the form declares the rest.
- **Why.** N1's route (2) is a destination that is exactly a typed case variant of the home. N2's split index, `s.char_indices().nth(root.chars().count())`, is `None` when the destination has exactly as many characters as the root. The strip would then find no match, and route (2) would stay open. Today's byte split does reach that case (`kernel/src/permission/audit/normalize.rs`, lines 177 to 190 at cdfebef1): when `s` and `root` have the same byte length, the split is at `s.len()` and the empty rest returns a match. Without the case, the drafted index would also drop today's exact-root result for an ASCII variant on Windows, and for the exact spelling on Linux and macOS.
- **The shape: the Change line's root strip, in `strip_component_prefix`.** The split index is taken over the starts of the characters of `s`, followed by `s.len()`, the index after its last character: `s.char_indices().map(|(i, _)| i).chain(std::iter::once(s.len())).nth(root.chars().count())`. It sits where today's guard and split are (same file, lines 178 to 181 at cdfebef1), before `component_eq(head, root)`. There are three cases:
  - `s` has more characters than `root`: the index is the start of the character after the match, as N2 drafts.
  - `s` has exactly as many characters: the index is `s.len()`. `head` is all of `s` and `rest` is empty, so the existing `rest.is_empty()` branch returns `Some("")` and the destination becomes the token alone. This is the exact-root case, and it closes route (2).
  - `s` has fewer characters: `None`, so no match. This is the result today's guard gives for an index past the end.
  - The strip's doc states the exact-root case in one sentence. No cfg site is added: the split is the same on every platform.
- **T1 (e).** A fifth assertion, after (d), with T1's roots and user as declared: (e) `C:\Users\JOSÉ` gives `<user-home>`. Worked by hand:
  - `C:/Users/josé/ⱥtlas` has 19 characters, more than the 13 of `C:/Users/JOSÉ`, so it does not match.
  - `C:/Users/josé` has 13, so the index is the end, `fold` makes the two strings equal, and the rest is empty.
  - Step 4 then sees the single component `<user-home>`.
- **Mutation M5.** The exact-root case is dropped: the split index is `s.char_indices().nth(root.chars().count())`, and a `None` is read as no match. Predicted failure: T1 `kernel/src/permission/audit/normalize.rs::tests::non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows`, assertion (e), left "C:/Users/<user>", right "<user-home>". No root matches, and step 4 still folds the component `JOSÉ` to `<user>`.
  - (a) to (d) pass under M5, because none of their destinations has exactly as many characters as a root that would match it.
  - M5 is observed the same way as M1 to M4, on the worker's Windows machine.
- **No other test.** In my reading, no existing test's destination is exactly one of its roots:
  - normalize.rs's tests (same file, lines 210 to 362 at cdfebef1);
  - K1, whose destination is two components under its root (`kernel/tests/case_policy_volume.rs`, lines 99 to 102 at cdfebef1);
  - `a_destination_under_a_user_profile_path_is_normalized_in_the_record`, with `out` under a workspace (`kernel/tests/permission_boundary.rs`, lines 698 to 704 at cdfebef1);
  - `debug_prints_a_normalized_destination_and_never_a_raw_path`, with `out` under a temporary directory (`kernel/src/permission/grant.rs`, lines 820 to 839 at cdfebef1).
  - T2 passes no roots, and T3 does not reach the strip. So M5 fails T1 (e) and no other test. N4's Invalidators, as pair 9 reads them, cover the rest.
- **Declared unchanged.** N4's list, as pairs 6 and 7 read it. The exact-root case gives the result today's byte split gives, so no existing result changes.
- **Platform (N5).** Windows: T1 (e) and M5, as with the rest of T1. Linux and macOS: the exact-root case keeps today's result for an exact spelling. No test pins it there, because T1 is ignored off Windows. No string is added and no KNOWN-LIMITATIONS item is owed. The addition brings no §21a category: the Out-of-scope line's four answers hold.
- **Size (N2's rows).**
  - `strip_component_prefix`'s doc moves from (−10 +4) to about (−10 +5).
  - Its body moves from (−4 +3) to about (−4 +6), the chained index over several lines.
  - T1 moves from about 20 to about 24: one assertion, plus M5's record beside M1 to M3's.
  - That makes about 130 lines in 2 files, inside the declared 145. The Scope line is not edited. If the final count passes 145, that is class 6 at the count.
- **The Tests+mutation line** is read with this item. T1's four assertions and M1 to M3 stand as declared, and (e) and M5 are added here.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**The twelve Old texts, each once in the form above `## Amendments` (line 152) at cdfebef1:**
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
- pair 12: line 8 (`one private std-only map`; Grep count 1, and the form's only `private` is on line 8)

Pairs 1 to 11 are as the custodian checked them. I did not re-grep them.

**Changes to the earlier draft's text, with reasons:**
1. **Heading.** It now names the exact-root addition and class 9, because the brief requires both classes.
2. **Lead paragraph.** One sentence added: item 12 and pair 12 come from the ruling, read at cdfebef1, which is main d5232d0f for these paths (the custodian's check). Reason: they are not part of the re-read.
3. **Item 2, the K1 bullet: a cite correction, not forced by the additions.** The earlier draft gave K1 as lines 261 to 307 and `swap_case` as lines 238 to 250. Those were line numbers in the scratch diff file I read it through, not in the file. Read directly at cdfebef1, K1 is lines 62 to 108 and `swap_case` (with its doc) is lines 39 to 51. The words are unchanged. I corrected it because a gate would fail a wrong cite. If you want the earlier bytes kept, revert this bullet and carry the fix some other way.
4. **Item 6.** A fourth bullet, "With item 12". Reason: without it, item 6's "about 122" and "No row moves" would contradict item 12.
5. **Item 8.** The heading changes from "The form text the re-read changes." to "The form text this amendment changes.", a sentence on where pairs 1 to 11 and pair 12 come from is added, and pair 12 is added. Reason: pair 12 is not from the re-read.
6. **Item 9.** Retitled "The classes". It gains a lead bullet (class 3 as ruled), a sentence on pair 12 at the end of "How each change reads under it", and a class 9 bullet. "The rule relied on" and "Its first line" are byte for byte.
7. **Item 12.** New.
- Items 1, 3, 4, 5, 7, 10 and 11, and the two closing lines, are byte for byte.

**Line estimate and how I reached it:** I started from N2's rows (122) and the code at cdfebef1.
- The planned body replaces today's guard and split (lines 178 to 181, four lines) with the chained index, which rustfmt will lay out over about five lines, plus the split line. That is about 6 lines instead of the drafted 3, so +3.
- The strip's doc gains one sentence, so +1.
- T1 gains assertion (e) (about 1 line) and M5's recorded-mutation lines (about 3), so +4.
- Total: about 130 against 145 declared, 2 files, inside §21c's 150. Class 6 is not taken now.

**Questions for the advisor (none blocks the filing):**
- Q5: The Tests+mutation line says T1 has "four assertions" and that "M1 to M4 are observed", and N5's Windows bullet names "M1 to M4". Item 12 adds (e) and M5 and only says the line is read with it. I added no pair, because the brief lists twelve Old texts. Should item 12 carry pairs for those words?
- Q6: On Linux and macOS the exact-root case keeps today's result, but no test there pins it, since T1 is Windows-only. A one-line cross-platform assertion would pin it. Is that wanted, or does the ruling's single assertion suffice?

**Observation:** under M5, step 4 still turns `JOSÉ` into `<user>`, so route (2) leaks the profile's parent spelling (`C:/Users/`) rather than the name whenever the home's last component equals a known username. Route (2) is still fully open where they differ. This does not change the ruling.

**Report path:** state/consults/2026-11-24-windows-case-fold-non-ascii-amendment-1-with-the-q3-item-lead-data-draft.md. As the brief says, I wrote no file, and I have no shell, so there is no sha256.

**Files read** (in D:/wt/read-1124c at cdfebef1 unless noted):
- `<S>/report-wcf-am1-lead.md` (my earlier draft, in the scratchpad)
- `kernel/README.md` and `engine/README.md` (their owner's index sections)
- `governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md` (whole, plus greps)
- `kernel/src/permission/audit/normalize.rs` (whole)
- `kernel/tests/case_policy_volume.rs` (whole)
- `kernel/tests/permission_boundary.rs` (grep, lines 698 to 728)
- `kernel/src/permission/grant.rs` (lines 815 to 840)
- kernel/ grep for `normalize_with`, `normalize_destination` and the token strings
- `docs/PREREGISTRATION-TEMPLATE.md` (lines 99 to 178)

Model: Opus 5.5 (claude-opus-5-5).
