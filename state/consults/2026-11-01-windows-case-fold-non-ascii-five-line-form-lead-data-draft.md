*Custodian's filing note (2026-11-01): lead-data's read-only draft of the five-line form for `windows-case-fold-non-ascii`, the filler queue's entry 1 (S2), read at main b1bdb8ac (dispatched 2026-11-01T03:02:41Z by the main transcript, its prompt equal to its brief by script). Its form is committed in the same commit at its governance path, with the custodian's settlement. The run 03:02:42Z to 03:14:21Z by its transcript (Read 31, Grep 20, Glob 2; no write tool; no call outside the repository). Its fixtures' profile-shaped paths use the listed invented name josé. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 80210f5895692b2aed16d6d1b219d133bcfc9ac256998cb7aaf7d7cb2e40e540.*

---

Draft: windows-case-fold-non-ascii five-line form, lead-data

*Everything below is my own wording (lead-data's) unless it is marked as byte-copied. I read the main checkout and take its HEAD to be b1bdb8ac from the session's git status. I have no shell, so I could not confirm that by git, and I give no sha256 for this report or for any span; the custodian expands each `@ b1bdb8ac` cite by script.*

## The form (for `governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md`)

```
Authority: PLAN node `windows-case-fold-non-ascii` (governance/PLAN.yaml:2768-2784 @ b1bdb8ac), filler queue entry 1 (state/FILLER-QUEUE.md:7 @ b1bdb8ac), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ b1bdb8ac); the finding is wave-3 §1c-2 correction (b) (state/cloud/wave3/W3-A.md:103 @ b1bdb8ac, state/cloud/wave3/W3-A.md:105 @ b1bdb8ac, state/cloud/wave3/W3-A.md:193 @ b1bdb8ac); reuse index: a miss, no prior art recorded for "case fold unicode ntfs" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief); in-repo prior art for the same fold: engine/src/watch.rs:154-173 @ b1bdb8ac, its residual at KNOWN-LIMITATIONS.md:320-326 @ b1bdb8ac.
Scope: kernel/src/permission/audit/normalize.rs; kernel/src/permission/audit/log.rs; 2 files; declared line budget 145 by §21c's counting rule (estimated 122); dispatched only after cut/port-2-macos-l1-and-app-dirs, which edits log.rs, has merged (rule (00); OPEN-1).
Change: on Windows, the path-component comparison in normalize.rs (the profile-root strip and the username step, both through `component_eq`) and `is_inside`'s comparison in log.rs fold each character through one private std-only map, `fold` (`char::to_uppercase` where it gives exactly one character and the character lies in the BMP, otherwise the character unchanged), in place of today's ASCII-only fold, and the root strip measures its match in characters, not in the root's bytes; so a profile root, a username component or a destination that differs only in non-ASCII case is normalized, or refused as inside, just as its ASCII-case variant already is; Linux and macOS still compare exactly, unchanged.
Tests+mutation: T1 `kernel/src/permission/audit/normalize.rs::tests::non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows` (Windows; ignored elsewhere with the existing boundary reason), roots `C:/Users/josé` (HOME), `C:/Users/josé/ⱥtlas` (LOCAL_APPDATA), `D:/𐐨-maps` (TEMP), user `josé`, four assertions: (a) `C:\Users\JOSÉ\out` gives `<user-home>/out`, (b) `D:\archive\JOSÉ\out` gives `D:/archive/<user>/out`, (c) `C:\Users\JOSÉ\Ⱥtlas\out` gives `<user-local-appdata>/out`, (d) `D:\𐐀-maps\out` gives `D:/𐐀-maps/out`; mutation M1: `fold` returns `c.to_ascii_uppercase()` on Windows (today's ASCII-only fold), predicted failure: (a), left "C:/Users/JOSÉ/out", right "<user-home>/out"; mutation M2: the root strip splits `s` at `root.len()` bytes behind today's `is_char_boundary` guard, predicted failure: (c), left "<user-home>/Ⱥtlas/out", right "<user-local-appdata>/out"; mutation M3: the BMP condition dropped from `fold`, predicted failure: (d), left "<temp>/out", right "D:/𐐀-maps/out"; T2 `kernel/src/permission/audit/normalize.rs::tests::the_resolved_parent_keeps_its_on_disk_case_and_a_username_in_another_case_still_collapses_on_windows` (Windows; ignored elsewhere): it creates `<temp>/spatial-kernel-case-fold-<pid>/JOSÉ`, resolves `<that dir's parent>/josé/out` through `permission::grant::resolve_destination`, and asserts first that the resolved parent's file name is `JOSÉ`, then that `normalize_with(&resolved, &[], &["josé"])` ends with `/<user>/out`; mutation M1 (as above), predicted failure: the second assertion, "a username in another case leaked: …/JOSÉ/out"; T3 `kernel/src/permission/audit/log.rs::tests::a_log_under_a_non_ascii_case_variant_of_the_destination_is_refused_on_windows` (Windows; ignored elsewhere, the reason naming log.rs and the boundary): `is_inside("D:/maps/été/audit.jsonl", "D:/maps/ÉTÉ")` is true and `is_inside("D:/maps/étés/audit.jsonl", "D:/maps/ÉTÉ")` is false; mutation M4: is_inside's Windows line back to `to_ascii_lowercase`, predicted failure: the first assertion, `assertion failed: is_inside(...)`; all three run on the Windows job (.github/workflows/product-ci-rust.yml:194-195 @ b1bdb8ac, .github/workflows/product-ci-rust.yml:233-234 @ b1bdb8ac) and on the worker's Windows machine, where M1 to M4 are observed; on ubuntu-24.04 they are ignored and listed by the R6 step (.github/workflows/product-ci-rust.yml:238-240 @ b1bdb8ac).
Out-of-scope: ADR: none (no status line or amendment); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP, data-plane or MCP surface); guarantee: TOUCHED, because the Windows case-insensitivity that `component_eq` states (kernel/src/permission/audit/normalize.rs:178-184 @ b1bdb8ac) and that `is_inside` applies (kernel/src/permission/audit/log.rs:398-399 @ b1bdb8ac) becomes true for non-ASCII letters, and `fold`'s doc declares where it departs from NTFS; Linux and macOS are unchanged, and the declared limits at kernel/PERMISSION-BOUNDARY.md:300-310 @ b1bdb8ac are unchanged; §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch; no new dependency, no `unsafe`, no new string, and no change to the OS-cfg site count of either file (normalize.rs stays at 2, log.rs at 3: scripts/plan/cfg-boundary.test.mjs:86-87 @ b1bdb8ac).
```

## Notes

**N1. The first step: whether the resolved destination carries the on-disk case, and whether a non-ASCII case difference can reach these compares**
- **Producing the destination.** `resolve_destination` canonicalizes the **parent** and rejoins the **final component as typed** (kernel/src/permission/grant.rs:190-213 @ b1bdb8ac). The boundary resolves the destination this way (kernel/src/permission/boundary.rs:325 @ b1bdb8ac), then passes it to `is_inside` (kernel/src/permission/boundary.rs:344 @ b1bdb8ac) and normalizes it into the intent record (kernel/src/permission/boundary.rs:363 @ b1bdb8ac), which is appended before the publish runs (kernel/src/permission/boundary.rs:366 @ b1bdb8ac).
- **The other side of each compare never touches the filesystem:**
  - Roots come from environment variables (kernel/src/permission/audit/normalize.rs:116-142 @ b1bdb8ac).
  - Usernames come from `USERNAME`/`USER`/`LOGNAME` (kernel/src/permission/audit/normalize.rs:144-146 @ b1bdb8ac, kernel/src/bundle/redaction.rs:125-134 @ b1bdb8ac).
  - The log path is `SPATIAL_IDE_AUDIT_LOG` verbatim, or `LOCALAPPDATA` plus a fixed suffix (kernel/src/permission/audit/log.rs:340-363 @ b1bdb8ac, kernel/src/permission/audit/log.rs:370-374 @ b1bdb8ac).
- **What I conclude** (my reasoning). On Windows, `std::fs::canonicalize` returns each existing component in its on-disk spelling. That is my knowledge of std, not a read in this repository, and T2's first assertion settles it on the job. So the parent carries the on-disk case and the final component carries the typed case. Roots, usernames and the log path carry the environment's spelling. Canonicalization therefore makes nothing agree: each compare is between two independent spellings. An escape is reachable in three ways:
  1. **Step 4 (username component), in ordinary use.** A directory the operator created as `D:\Projects\JOSÉ`, or a typed final component `JOSÉ`, against `USERNAME=josé`. `eq_ignore_ascii_case` misses É/é, so the name stays in the record.
  2. **Step 3 (profile root).** `--out C:\Users\JOSÉ`, a typed case variant of the home itself. Publishing then refuses the destination as existing (kernel/src/publish/mod.rs:634-639 @ b1bdb8ac), but the intent record is already written with `C:/Users/JOSÉ`. It is also reachable whenever a profile variable's spelling differs from the disk in a non-ASCII letter, which is not the default.
  3. **`is_inside`.** `SPATIAL_IDE_AUDIT_LOG=D:\maps\été\audit.jsonl` with `--out D:\maps\ÉTÉ` is not refused as inside. In my reading this fails closed by another route: `open_for` has already created the log's directory (kernel/src/permission/audit/log.rs:132-137 @ b1bdb8ac), so the destination exists and publish refuses with `DestinationExists` (kernel/src/publish/mod.rs:635 @ b1bdb8ac). No log ships. The cost is the wrong refusal reason and a stray directory.
- **The leak is silent.** A non-ASCII username never becomes a `username` finding, because a match must lie wholly in a printable-ASCII run (kernel/src/bundle/redaction.rs:189-204 @ b1bdb8ac). So `residual_classes` (kernel/src/permission/audit/log.rs:265-278 @ b1bdb8ac) does not name what (1) and (2) leave in the record.
- **So the piece is real**, not a no-op. If T2's first assertion fails (the parent not resolved to its on-disk spelling), the premise of route (1) via a parent is wrong, and that is recorded as a class-2 deviation. Routes (1) via the typed final component, (2) and (3) do not depend on it, and the fix stands.

**N2. The size, against §21c first** (governance/AUTONOMY.md:347-357 @ b1bdb8ac)

| File | What | Estimated lines (insertions + deletions) |
|---|---|---|
| normalize.rs, product | `fold` (+22: doc 9, body 13 with the two cfg arms moved from `component_eq`); `component_eq` doc (+2 −1) and body (−8 +1); `strip_component_prefix` doc (−10 +4) and body (−4 +3) | 55 |
| normalize.rs, tests | T1 (≈20), T2 (≈24) | 44 |
| log.rs, product | `is_inside` doc (+2); the Windows line (−1 +6) | 9 |
| log.rs, tests | T3 (≈14) | 14 |
| **Total** | 2 files | **about 122** (declared 145) |

- **Fixed: `component_eq`** (kernel/src/permission/audit/normalize.rs:185-194 @ b1bdb8ac), which is both callers: step 4 (kernel/src/permission/audit/normalize.rs:98 @ b1bdb8ac) and the root strip (kernel/src/permission/audit/normalize.rs:168 @ b1bdb8ac).
- **Fixed with it: the strip's byte split** (kernel/src/permission/audit/normalize.rs:163-167 @ b1bdb8ac). With a Unicode fold, a matching prefix of `s` can have a different byte length from `root` (`ⱥ` is 3 bytes, `Ⱥ` is 2). A split at `root.len()` would then make `component_eq` and the strip disagree inside one function. The split index becomes `s.char_indices().nth(root.chars().count())`, which is a character boundary by construction. That also removes the panic risk the old guard existed for (kernel/src/permission/audit/normalize.rs:153-162 @ b1bdb8ac), and the existing `a_non_ascii_root_or_destination_normalizes_instead_of_panicking` still pins it.
- **Fixed: `is_inside`'s fold** (kernel/src/permission/audit/log.rs:398-399 @ b1bdb8ac). Its callers are kernel/src/permission/audit/log.rs:125 @ b1bdb8ac and kernel/src/permission/boundary.rs:344 @ b1bdb8ac. The node's summary names it (governance/PLAN.yaml:2783 @ b1bdb8ac), which is why it is in Scope (OPEN-1).
- **Left: the redaction scan's `find_all_ascii_ci`** (kernel/src/bundle/redaction.rs:328-343 @ b1bdb8ac). **It is not the same defect.**
  - It searches bundle and record bytes on every OS for a username or hostname. That is a content scan, not a filesystem name compare, so NTFS's rule is not the right reference for it.
  - A Unicode fold there would change no outcome: a non-ASCII name never sits in a printable-ASCII run (kernel/src/bundle/redaction.rs:189-204 @ b1bdb8ac), a floor declared at kernel/PERMISSION-BOUNDARY.md:307-310 @ b1bdb8ac.
  - redaction.rs is also 7a's Scope file (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:7 @ b1bdb8ac).
- **Left, not the node's (seen in passing):**
  - `DestinationScope::covers` compares resolved paths with `==` (kernel/src/permission/grant.rs:166-171 @ b1bdb8ac). In my knowledge of std that is case-sensitive on Windows, so a grant and a publish whose typed final components differ in case do not match. That fails closed.
  - The ASCII fold in the test helper at kernel/tests/permission_boundary.rs:737-741 @ b1bdb8ac only makes that test's token assertion conditional; a non-ASCII profile would weaken the test, not make it wrong.
  - kernel/src/publish/mod.rs:1094 @ b1bdb8ac and kernel/src/session_history.rs:405 @ b1bdb8ac are not path compares.
- No dependency, no exposure surface, no new string. User-visible behaviour is OPEN-3.

**N3. The change: the fold, by platform**
- **What NTFS does** (my knowledge, not a repository read). It compares names by upcasing each UTF-16 code unit through the volume's own `$UpCase` table, which the formatting Windows version writes when the volume is formatted. That is a one-to-one simple uppercase map, not full case folding.
- **No std function matches it exactly:**
  - `eq_ignore_ascii_case` and `to_ascii_*` fold ASCII only. That is the defect.
  - `char::to_uppercase` and `str::to_uppercase` give the *full* mapping (`ß` becomes `SS`), which changes length and equates names NTFS keeps distinct.
  - Lowercase-based folding, or Unicode case folding, would equate the Kelvin sign U+212A with `k`, which an upcasing compare does not.
- **The closest std construct**, and the one drafted: `char::to_uppercase` taken only when it yields exactly one character, else the character unchanged, plus the BMP condition (OPEN-2). Where it differs from NTFS, all declared in `fold`'s doc:
  - (i) **Unicode-version drift:** std folds letters that an older volume table may not, for example Georgian Mkhedruli to Mtavruli (Unicode 11) and Latin Extended-C/D additions. That folds too much: over-normalization, never a leak, and for `is_inside` a false refusal.
  - (ii) About 27 Greek letters with iota subscript (U+1F80–U+1FAF, U+1FB3, U+1FC3, U+1FF3). Their full uppercase is two characters, but a simple mapping exists, so this folds less than NTFS probably does. That is a narrow residual in the leak direction.
  - (iii) `ı`→`I` and `ſ`→`S`: std folds them, and I do not know whether Windows' table does. Possibly folds too much.
- **The house precedent** is the same construct without the BMP condition (engine/src/watch.rs:161-171 @ b1bdb8ac), with its residual declared at KNOWN-LIMITATIONS.md:320-326 @ b1bdb8ac.
- **No table and no new dependency are needed**, so item 3 does not stop. Exact parity with the OS would need `CompareStringOrdinal` or `RtlUpcaseUnicodeChar`. That means `windows-sys` in kernel/Cargo.toml (a new dependency for this crate, a red line) or an `unsafe` extern declaration (the security posture, a red line). Even that would use the system's table, not the volume's. Not taken.
- **Placement, held to the pinned cfg counts:**
  - The two cfg arms move from `component_eq` into `fold` (normalize.rs stays at 2 sites). `component_eq` becomes `a.chars().map(fold).eq(b.chars().map(fold))` on every platform; `fold` is the identity off Windows, so Linux and macOS compare exactly, as today.
  - `is_inside` keeps its single `#[cfg(windows)] let`, now mapping both strings through `super::normalize::fold` (log.rs stays at 3 sites).
  - `fold` is `pub(crate)`, and its product callers are in both files, so nothing is dead code on Linux.
  - scripts/plan/cfg-boundary.test.mjs is untouched; port-2 edits it (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:102 @ b1bdb8ac).

**N4. Tests, declared unchanged, invalidators**
- The new tests and mutations are on the Tests+mutation line. T2 removes its temp directory before asserting, and first removes any leftover one. It passes no roots, so it depends on no environment root and names no profile path.
- **Declared unchanged and green on both jobs:**
  - every existing normalize.rs test, including `case_differences_collapse_on_windows` (kernel/src/permission/audit/normalize.rs:295-302 @ b1bdb8ac) and the non-ASCII panic test (kernel/src/permission/audit/normalize.rs:266-291 @ b1bdb8ac);
  - `a_log_resolving_inside_the_destination_is_refused` (kernel/src/permission/audit/log.rs:440-456 @ b1bdb8ac);
  - kernel/tests/permission_boundary.rs::a_destination_under_a_user_profile_path_is_normalized_in_the_record;
  - cfg-boundary's 18 sites (scripts/plan/cfg-boundary.test.mjs:73-75 @ b1bdb8ac).
  - My check, by hand: with the new walk, the ASCII results of the existing tests are the same as today's.
- **Ignored lists (R6):** Windows' list is unchanged. Linux's gains T1, T2 and T3, each single-platform by construction. This form is their record.
- **Invalidators:** any other test changing outcome on either job, or any change in a file's cfg-site count, stops the piece.

**N5. Platform item** (R3, docs/PREREGISTRATION-TEMPLATE.md:177 @ b1bdb8ac)
- **Owning boundary:** filesystem case policy, already allowlisted for both files (scripts/plan/cfg-boundary.mjs:30-31 @ b1bdb8ac; state/cloud/wave3/W3-A.md:58 @ b1bdb8ac, state/cloud/wave3/W3-A.md:61 @ b1bdb8ac).
- **Windows:** supported, changed as the Change line says. T1 to T3 run on windows-latest, and M1 to M4 are observed on the worker's Windows machine.
- **Linux:** supported, unchanged (exact comparison). T1 to T3 are ignored with the boundary reason. Case-insensitive Linux mounts are 1c-2 (a), port-2's intake (state/cloud/wave3/W3-A.md:192 @ b1bdb8ac), not this piece.
- **macOS:** unchanged, the same exact arm. APFS's default case-insensitivity is port-2's case-policy work, not this piece's. There is no macOS job. It stays explicitly reduced, as today.
- **Strings a user sees:** none added or changed. On Windows the record's destination *value* now shows `<user-home>` or `<user>` where a non-ASCII case variant leaked before (OPEN-3). There are no new words, so nothing needs a P6 placeholder. If a string arises mid-piece, it is a P6 placeholder for the sitting.
- **KNOWN-LIMITATIONS:** none owed, in my recommendation (OPEN-6).

**N6. Rule (00), path by path** (in-flight paths as the brief gives them)

| My path | In-flight piece that edits it |
|---|---|
| `kernel/src/permission/audit/normalize.rs` | None in flight: not in b2-1c's kernel list or port-2's, and #273, #272, #271 and b1-shell-half-pr-c have nothing under kernel/. Entry 7b's held draft edits it at step 2 and the root reading (its Scope, state/consults/2026-11-01-posix-backslash-in-shared-path-logic-five-line-form-lead-data-draft.md:13 @ b1bdb8ac), which are other functions than mine. Both add tests at the end of the same `mod tests`, so whichever lands second rebases. One filler is in flight at a time anyway (governance/AUTONOMY.md:692 @ b1bdb8ac). |
| `kernel/src/permission/audit/log.rs` | **`cut/port-2-macos-l1-and-app-dirs`.** The piece needs `is_inside`'s Windows line (kernel/src/permission/audit/log.rs:398-399 @ b1bdb8ac) and one test in its `mod tests`. Dispatch waits for port-2's merge, which is the node's own NEXT (governance/PLAN.yaml:2783 @ b1bdb8ac). |
| this form's path | None |

- **Without log.rs** (OPEN-1 (b)), the piece is normalize.rs alone: T1, T2, M1 to M3, about 99 lines, 1 file. Both escapes into the record are closed, and `is_inside` keeps its wrong-reason refusal (N1, route 3).
- **Not needed:** kernel/PERMISSION-BOUNDARY.md (port-2's), scripts/plan/cfg-boundary*.mjs (port-2's; counts held), kernel/src/bundle/redaction.rs (7a's), grant.rs, kernel/README.md (OPEN-5).

## OPEN items, with options and my recommendation

- **OPEN-1, log.rs and when to dispatch.** Recommendation: (a).
  - (a) As drafted: both files, dispatched after port-2 merges, as the node's NEXT already says. The entry keeps its place; the next filler runs meanwhile.
  - (b) normalize.rs only, dispatchable now, with `is_inside` as a proposed follow-up. **Possibly a red line:** the node's summary names `is_inside` (governance/PLAN.yaml:2783 @ b1bdb8ac), and scope changes to ruled items are one (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ b1bdb8ac). It would hold for the human.
  - (c) (a) plus 7b's OPEN-5 (c), the POSIX separator fix in the same function (state/consults/2026-11-01-posix-backslash-in-shared-path-logic-five-line-form-lead-data-draft.md:139-142 @ b1bdb8ac). That is a second finding (A-1) on another platform, needs a Linux mutation observation, and 7b's OPEN-5 is held for the human. Not recommended unless the human rules 7b's OPEN-5 (c) before this form commits. If so, it is drafted into this form before commit.
- **OPEN-2, the BMP condition in `fold`.** Recommendation: (a).
  - (a) Keep it. NTFS upcases UTF-16 units, so supplementary-plane letters compare exactly there. It avoids rewriting a distinct directory, the corruption kernel/src/permission/audit/normalize.rs:19-24 @ b1bdb8ac refuses to do. Cost: one line, T1 (d), M3.
  - (b) Drop it, matching engine/src/watch.rs:161-171 @ b1bdb8ac exactly. That over-folds supplementary letters, which errs safe for both sites. About 6 lines fewer.
- **OPEN-3, is the Windows record now tokenizing non-ASCII case variants "new user-visible behaviour" under §21c?** Recommendation: (A), the same reasoning as 7a's OPEN-2, ruled (A).
  - (A) Not new: the stated normalization made true for non-ASCII letters, with no new string.
  - (B) New: the full form.
- **OPEN-4, the guarantee label.** Recommendation: (a), following the 7a and 7b precedent.
  - (a) TOUCHED, as drafted. It changes no gating under §36.
  - (b) none, on the reading that the code is only brought to its own doc. A false "none" is a block-on-sight (docs/PREREGISTRATION-TEMPLATE.md:158-160 @ b1bdb8ac).
- **OPEN-5, kernel/README.md.** Recommendation: (a), as 7b's OPEN-6.
  - (a) Out of Scope. No pointer in the permission row (kernel/README.md:373 @ b1bdb8ac) changes, and the merged kernel fillers at governance/forms/kernel/ are not listed in the index either.
  - (b) In Scope, adding this form to the list at kernel/README.md:387 @ b1bdb8ac.
- **OPEN-6, the fold's residuals (N3 (i) to (iii)).** Recommendation: (a).
  - (a) Declared in `fold`'s doc only. The residual is a strict narrowing of today's undeclared gap, which covers every non-ASCII letter.
  - (b) A KNOWN-LIMITATIONS item in KL 27's shape (KNOWN-LIMITATIONS.md:320-326 @ b1bdb8ac). That adds a third file, about 8 lines, and words a human may want to see.
  - (c) (a) plus a Windows probe test that checks `fold` against the runner volume for a fixed list of letters (é, ı, ſ, ᾳ, 𐐨, ა), about 20 lines. It measures the runner's table, not users' tables.
- **Red lines:** none of my recommendations is one. OPEN-1 (b) may be one (above). Any route to exact OS parity (N3) would be one (a dependency, or `unsafe`) and goes to the human.
- **Question for the custodian, not decided:** please confirm that guarantee: TOUCHED (Windows non-ASCII case, Linux and macOS unchanged) is not a red line, as ruled for 7a.

## What I could not settle

- My reads were of the working tree, taken as b1bdb8ac from the session's git status, not verified by git.
- That `std::fs::canonicalize` returns on-disk spelling on Windows is my knowledge; T2's first assertion settles it on the job. The NTFS `$UpCase` facts and the divergences in N3 are also my knowledge, not repository reads. Whether Windows' table maps `ı` and `ſ` to ASCII, or folds the Greek iota-subscript letters, I do not know.
- I cannot read port-2's log.rs edit or `kernel/tests/case_policy_volume.rs`. If port-2 changes `is_inside`'s case policy (for example, to a volume probe), this form's log.rs part must be re-read at dispatch and redrafted before code.
- The line counts are estimates. M1 to M4's predicted messages are worked by hand from the code at b1bdb8ac.
- An observation outside this piece: kernel/src/permission/audit/normalize.rs:22-24 @ b1bdb8ac and kernel/PERMISSION-BOUNDARY.md:300-302 @ b1bdb8ac say the record names `username` for a name inside a longer component. For a non-ASCII username it never does. Only the general floor sentence at kernel/PERMISSION-BOUNDARY.md:307-310 @ b1bdb8ac covers that. It may deserve a proposed node; the custodian judges.
- I have no shell, so this report carries no sha256.

Result: a five-line form drafted for entry 1. The escape is reachable, because each compare is between a filesystem spelling and an environment spelling, so canonicalization does not close it. The fix is a std-only fold in normalize.rs and log.rs: 2 files, about 122 of 150 lines, dispatched after port-2 merges.
Blocking question: please confirm that guarantee: TOUCHED (Windows non-ASCII) is not a red line, as ruled for 7a.
Report path: C:/dev/spatial-ide/state/consults/2026-11-01-windows-case-fold-non-ascii-five-line-form-lead-data-draft.md
sha256: none; I have no shell.
