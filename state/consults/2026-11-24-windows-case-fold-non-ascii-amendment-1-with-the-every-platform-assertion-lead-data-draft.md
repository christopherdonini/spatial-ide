# windows-case-fold-non-ascii: Amendment 1 with the every-platform assertion T4 (class 9, ADV-2026-11-24-20), lead-data's draft, appended

*Filed by the custodian: node:windows-case-fold-non-ascii@amendment-1-every-platform-lead-data. It is a draft and gives no verdict. Its amendment, between its marks, is appended to the form by the commit that files it, as ADV-2026-11-24-20 item 4 orders: the addition is written and raises no question. It redrafts the draft filed at `state/consults/2026-11-24-windows-case-fold-non-ascii-amendment-1-with-the-q3-item-lead-data-draft.md` under ADV-2026-11-24-20 item 3. The custodian checked again, by git show: the twelve Old texts each occur once in the form above its Amendments heading; its items 1 to 5, 7, 8, 10 and 11 byte for byte against the last draft; its 18 verbatim quotations on their cited lines at cdfebef1eecdda586cd7c9aca41941447b453a99, and the ruling's words in ADV-2026-11-24-17; every path it read is the same at cdfebef1eecdda586cd7c9aca41941447b453a99 and at main 8ed33953252b9027adc6094d2a2cd0eb0b700266; T4's input, the module's own HOME root, and the code cites of its hand check; and that no test of that name exists. Its lead paragraph's current main 4b17d9da is the main of the first draft's read, carried. It ran during no build, in the sitting. Dispatched at 2026-11-24T08:15:24Z; its run: Read 7, Grep 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T08:15:27Z to 2026-11-24T08:19:12Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T08:19:12Z. 31230 bytes, sha256 90abeb7c4b5414fe1e187dee083f9aef34f5261cd574788be9dd0d34d079e5ae, byte for byte but for 1 of the profile's path or the account's name, written as <m>, <u> and <t> by the custodian; the ten paths under C:/Users that name a user called José, the module's root `C:/Users/someone`, or the `<user>` token, are the form's own test inputs and stay as written, with one final newline added.*

---

Result: I redrafted Amendment 1 with ADV-2026-11-24-20 item 3's addition. Item 12 now has T4, a new test with one assertion that runs on every platform: a destination that is exactly a root, spelled as the root, gives the root's token. Because T4 is a new test, N4's declared-unchanged list has no exception. M5 now fails T1 (e) on Windows and T4 on every job. The estimate is about 138 lines against the declared 145, so class 6 is not taken now. Items 1 to 12 and pairs 1 to 12 otherwise stand as in my last draft, with Q5 (a).

---AMENDMENT 1---
## Amendment 1 — 2026-11-24 — the re-read after port-2's merge and the exact-root addition, before any code (class 3; class 9, a scope addition, for item 12)

Written before any code of this piece and before any run of its tests or mutations. It records the re-read that the custodian's settlement orders in its rule (00) bullet, and that the draft's last section asks for. Read at cdfebef1eecdda586cd7c9aca41941447b453a99, which is current main 4b17d9daea35d89040058d23c9594ca81050445f for kernel/, engine/, scripts/plan/ and this form. Item 12 and pair 12 add what ADV-2026-11-24-17 rules in its items 4 and 6. They were read at the same commit, which for kernel/, this form, `docs/PREREGISTRATION-TEMPLATE.md` and `governance/AUTONOMY.md` is main d5232d0f (the custodian's check by git). Item 12's T4 adds what ADV-2026-11-24-20 rules in its item 3. It was read at the same commit, which for kernel/ and this form is main 44c0cb02 (the custodian's brief).

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
- **With item 12.** The re-read moves no row. Item 12's addition moves three of N2's rows and adds T4 to its normalize.rs tests row, which brings the piece to about 138 lines in 2 files (item 12, its size bullet). That is still inside the declared 145 and inside §21c's bound.

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
- **Class 9 for item 12, on the ruling.** ADV-2026-11-24-17 item 4 rules item 12 "class 9, a scope addition, on this ruling". Class 9 is "Scope addition on a standing rule" (`docs/PREREGISTRATION-TEMPLATE.md`, line 170 at cdfebef1). Its first line "carries the words `scope addition`", and the amendment declares the addition "Before any code of the addition" (same line). Item 12 does both. ADV-2026-11-24-20 item 3 adds T4 to item 12 in the same class. Its estimate stays inside the declared 145, so class 6 is not taken (item 12, its size bullet).
- **Its first line.** The form's own rule says that "an amendment written after any run of this piece's tests or mutations has been seen says so in its first line" (this form, its lead paragraph). This amendment's first line says that none has been seen.

**10. Rule (00) and the ready node `posix-backslash-is-inside-and-redaction-label`.**
- **Where the two would meet.** Its title says `is_inside` stops treating a backslash as a separator on POSIX. That is the `norm` closure's `.replace('\\', "/")` at log.rs line 391. This piece edits `is_inside`'s doc (lines 381 to 387) and its Windows line (lines 396 to 397). So the two would meet in `is_inside`'s body: different lines of one twelve-line function, both changing how the two strings are compared before they are compared.
- **Whichever lands second.** It rebases and re-reads the other's lines. T3's inputs use `/` only, so they do not depend on the separator rule. A cfg site that node might add to `is_inside` would move log.rs's count, and the Invalidators of whichever piece is second would read it at that piece's base.
- It is paused platform work, not in flight, and it is not planned here.

**11. The reuse index** (the standing step), run for this amendment's brief on 2026-11-24, is a miss: it records no prior art for the query windows case fold non-ascii path. The in-repo prior art stays the Authority line's engine watcher fold. Port-2's K1 is now in-repo prior art for the shape of T2's volume observation: the temporary directory canonicalized first, and a precondition that fails loudly.

**12. Class 9, a scope addition, on ADV-2026-11-24-17 item 4: the exact-root case of the root strip, a fifth assertion of T1, and mutation M5; and, on ADV-2026-11-24-20 item 3, T4, one assertion on every platform.** Declared before any code of the addition, the same way the form declares the rest.
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
- **T4, on every platform (ADV-2026-11-24-20 item 3).** A new test, `kernel/src/permission/audit/normalize.rs::tests::a_destination_that_is_exactly_a_root_becomes_the_roots_token`, in normalize.rs's `mod tests` (same file, lines 210 to 362 at cdfebef1), placed with T1 and T2.
  - It has no `cfg_attr`, so it runs on the Windows, ubuntu-24.04 and macos-latest jobs, and no R6 step lists it.
  - It makes one assertion, with the module's own roots and user (`roots()` and `users()`, same file, lines 215 to 225 at cdfebef1): `normalize_with(&PathBuf::from("C:/Users/someone"), &roots(), &users())` gives `<user-home>`.
  - The destination is the HOME root `C:/Users/someone` in the root's own spelling. It is written with `/`, which is a separator on every platform, as the panic test's inputs are (same file, lines 309 to 318 at cdfebef1).
  - It is a new test, not an addition to an existing one, so N4's declared-unchanged list has no exception.
- **What today's code gives for T4's input, on every platform** (same file, at cdfebef1):
  - Step 1 (lines 73 to 79): there is no verbatim prefix, so the string is unchanged. Step 2 (line 82, `to_slashes` at lines 151 to 156): `/` is a separator on every platform, so `s` is `C:/Users/someone`, 16 bytes.
  - Step 3 (lines 86 to 93) tries the roots longest first. The Temp root (35 bytes) and the LocalAppData root (30 bytes) give an index past the end of `s`, where `is_char_boundary` is false (line 178; its doc, line 176), so neither matches. The HOME root (16 bytes) passes line 178 at `s.len()`. `split_at` (line 181) gives a `head` that is all of `s` and an empty `rest`. `component_eq` (lines 199 to 208) is true on both cfg arms, because the two strings are equal. The `rest.is_empty()` branch (lines 185 to 186) returns `Some("")`, so `s` becomes `<user-home>` (line 90).
  - Step 4 (lines 96 to 108): the single component `<user-home>` is not the username `someone`, so it stays.
  - The result is `<user-home>` on Windows, Linux and macOS. T4 pins today's result.
  - Under the planned split, the HOME root and `s` both have 16 characters, so the index is `s.len()` (the second case), and the result is the same. The two longer roots have more characters than `s` (the third case) and do not match, as today.
- **Mutation M5.** The exact-root case is dropped: the split index is `s.char_indices().nth(root.chars().count())`, and a `None` is read as no match. Predicted failure: T1 `kernel/src/permission/audit/normalize.rs::tests::non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows`, assertion (e), left "C:/Users/<user>", right "<user-home>". No root matches, and step 4 still folds the component `JOSÉ` to `<user>`. Predicted failure on every platform: T4, left "C:/Users/<user>", right "<user-home>". No root matches, and step 4 turns the component `someone` into `<user>`.
  - (a) to (d) pass under M5, because none of their destinations has exactly as many characters as a root that would match it.
  - M5 is observed the same way as M1 to M4, on the worker's Windows machine, for T1 (e) and T4 both.
- **No existing test.** In my reading, no existing test's destination is exactly one of its roots:
  - normalize.rs's tests (same file, lines 210 to 362 at cdfebef1);
  - K1, whose destination is two components under its root (`kernel/tests/case_policy_volume.rs`, lines 99 to 102 at cdfebef1);
  - `a_destination_under_a_user_profile_path_is_normalized_in_the_record`, with `out` under a workspace (`kernel/tests/permission_boundary.rs`, lines 698 to 704 at cdfebef1);
  - `debug_prints_a_normalized_destination_and_never_a_raw_path`, with `out` under a temporary directory (`kernel/src/permission/grant.rs`, lines 820 to 839 at cdfebef1).
  - T2 passes no roots, and T3 does not reach the strip. So M5 fails two things: T1 (e) on Windows, and T4 on every job. M5 is observed on the worker's Windows machine for both, and CI shows T4 green on the three jobs. N4's Invalidators, as pair 9 reads them, cover the rest. This is the one point in which ADV-2026-11-24-20 item 3 changes ADV-2026-11-24-17 item 4: M5 no longer fails one assertion alone.
- **Declared unchanged.** N4's list, as pairs 6 and 7 read it. The exact-root case gives the result today's byte split gives, so no existing result changes. T4 is a new test, so the list has no exception.
- **Platform (N5).** Windows: T1 (e), T4 and M5. Linux and macOS: the exact-root case keeps today's result for an exact spelling, and T4 pins it on both jobs. T1 stays ignored off Windows, and the R6 lists gain nothing for T4. No string is added and no KNOWN-LIMITATIONS item is owed. The addition brings no §21a category: the Out-of-scope line's four answers hold.
- **Size (N2's rows).**
  - `strip_component_prefix`'s doc moves from (−10 +4) to about (−10 +5).
  - Its body moves from (−4 +3) to about (−4 +6), the chained index over several lines.
  - T1 moves from about 20 to about 24: one assertion, plus M5's record beside M1 to M3's.
  - T4 is about 8 lines: its doc (2, one naming M5), `#[test]`, the signature, the call, the assertion, the closing brace and a blank line.
  - That makes about 138 lines in 2 files, inside the declared 145. The Scope line is not edited. If the final count passes 145, that is class 6 at the count.
- **The Tests+mutation line** is read with this item. T1's four assertions and M1 to M3 stand as declared, and (e), T4 and M5 are added here.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**The twelve Old texts, each once in the form above `## Amendments` (line 152) at cdfebef1.** I checked all twelve again in this run with one Grep, and each matched once:
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
- pair 12: line 8
- The form ends at line 153, after the empty Amendments heading.

**Cites I checked again in this run, at cdfebef1:**
- normalize.rs whole: steps 1 to 4 at 73-79, 82, 86-93 and 96-108; `to_slashes` at 151-156; the strip at 177-190, with line 176's past-the-end sentence; `component_eq` at 199-208; `mod tests` at 210-362; `roots()` and `users()` at 215-225; the panic test's `/` inputs at 309, 313 and 317.
- K1 and `swap_case`: `kernel/tests/case_policy_volume.rs`, lines 39-51, 62-108 and 99-102.
- `kernel/tests/permission_boundary.rs`, lines 698-704.
- `kernel/src/permission/grant.rs`, lines 820-839.
- Items 1 to 11's cites I did not read again beyond these. ADV-2026-11-24-17's quoted words in item 9 are carried from my last draft. I did not re-read them, because that ruling is not in the read checkout.

**Changes from my last draft, item by item:**
1. **Result line (outside the amendment).** It now reports T4, M5's two failures and about 138 lines.
2. **Heading.** Unchanged, because the addition makes nothing in it untrue.
3. **Lead paragraph.** One sentence added: T4 comes from ADV-2026-11-24-20 item 3, read at cdfebef1, which for kernel/ and this form is main 44c0cb02 (from your brief).
4. **Items 1 to 5, 7, 8 (all twelve pairs), 10 and 11.** Byte for byte. No pair added (Q5 (a)).
5. **Item 6, the "With item 12" bullet.** "moves three of N2's rows, which brings the piece to about 130 lines" now reads "moves three of N2's rows and adds T4 to its normalize.rs tests row, which brings the piece to about 138 lines". The rest of item 6 is unchanged.
6. **Item 9, the class 9 bullet.** One sentence added: ADV-2026-11-24-20 item 3 adds T4 to item 12 in the same class. The rest is byte for byte, and the class 6 sentence still holds at 138.
7. **Item 12, title.** It adds "; and, on ADV-2026-11-24-20 item 3, T4, one assertion on every platform".
8. **Item 12, two new bullets.** "T4, on every platform" says where the test goes and what it asserts, and that N4 has no exception. "What today's code gives for T4's input" is the hand check from the code, with line cites.
9. **Item 12, the M5 bullet.** It adds T4's predicted failure on every platform, left "C:/Users/<user>", right "<user-home>". Its last sub-bullet now says M5 is observed on the worker's Windows machine for T1 (e) and T4 both.
10. **Item 12, "No other test" is now "No existing test".** The list of tests read is unchanged. "So M5 fails T1 (e) and no other test" is replaced by the ruling's wording: M5 fails T1 (e) on Windows and T4 on every job, it is observed on the worker's Windows machine for both, and CI shows T4 green on the three jobs. A sentence notes this is the one point that changes ADV-2026-11-24-17 item 4.
11. **Item 12, "Declared unchanged".** One sentence added: T4 is new, so N4's list has no exception.
12. **Item 12, "Platform (N5)".** "Windows: T1 (e) and M5, as with the rest of T1" now reads "Windows: T1 (e), T4 and M5". "No test pins it there, because T1 is ignored off Windows" is replaced: T4 pins the case on Linux and macOS, T1 stays ignored off Windows, and the R6 lists gain nothing for T4.
13. **Item 12, "Size".** A T4 sub-bullet (about 8 lines) is added, and the total goes from about 130 to about 138. The class 6 sentence is unchanged.
14. **Item 12, "The Tests+mutation line".** "(e) and M5 are added here" now reads "(e), T4 and M5 are added here".
15. **Dropped from the report (outside the amendment).** The Q5 and Q6 questions, which the advisor has now ruled, and the route (2) observation, which the ruling left as it was.

**Why a new test, not an existing one.** Every existing test that runs on all three jobs asserts something else:
- `a_root_that_is_a_string_prefix_but_not_a_path_prefix_does_not_match` asserts a non-match by its name.
- The panic test and `the_longest_matching_root_wins` assert other properties.

Adding the assertion to any of them would make that test the one exception to N4 for one line. A new test keeps N4's list whole for about 6 more lines. The choice is my draft, and the gates check it.

**Line estimate.** 122 (N2) + 3 (the strip's body) + 1 (the strip's doc) + 4 (T1 (e) and M5's record) + 8 (T4) = about 138, against the declared 145, in 2 files, inside §21c's 150. Class 6 is not taken now. Past 145 at the count is class 6.

Blocking questions: none. The addition raises no question for the advisor.

Report path: state/consults/2026-11-24-windows-case-fold-non-ascii-amendment-1-with-the-every-platform-assertion-lead-data-draft.md. As the brief says, I wrote no file, and I have no shell, so there is no sha256. Please hash the bytes of this message when you file it.

Files read (in D:/wt/read-1124c at cdfebef1 unless noted):
- the last draft, <u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/report-wcf-am1b-lead.md
- D:/wt/read-1124c/kernel/README.md (its owner's index section)
- D:/wt/read-1124c/engine/README.md (where its owner's index section starts)
- D:/wt/read-1124c/governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md (whole, plus the Old-text grep)
- D:/wt/read-1124c/kernel/src/permission/audit/normalize.rs (whole)
- D:/wt/read-1124c/kernel/tests/case_policy_volume.rs (lines 36-109)
- D:/wt/read-1124c/kernel/tests/permission_boundary.rs (lines 694-707)
- D:/wt/read-1124c/kernel/src/permission/grant.rs (lines 818-841)

Model: Opus 5.5 (claude-opus-5-5).
