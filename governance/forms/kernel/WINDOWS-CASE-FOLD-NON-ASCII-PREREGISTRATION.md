# kernel: the audit case policy on Windows folds non-ASCII letters, so a profile path differing only in non-ASCII case is normalized — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node windows-case-fold-non-ascii, the filler queue's entry 1 (S2, code-path-only). The five lines, the notes, the OPEN items and what is not settled are lead-data's draft (`state/consults/2026-11-01-windows-case-fold-non-ascii-five-line-form-lead-data-draft.md`, read only at main b1bdb8ac; its sha256 from line 5 is 80210f5895692b2aed16d6d1b219d133bcfc9ac256998cb7aaf7d7cb2e40e540), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ b1bdb8ac`, and each cite on a line before that line's last marker, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path, or a root file whose bare name other tracked files share, as `path:line` at <commit>, sha256 <hex>; 3 such) (76 pins; 0 by a file name that resolves to one tracked path at that commit; 0 bare line numbers bound to the path written before them; 0 bare line numbers the draft leaves unmarked kept as written; 2 remaining markers given the full commit id); this title and lead line added; the draft's opening paragraph (its read commit and its wording convention), its form heading and its closing result block dropped. Form path: `governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node `windows-case-fold-non-ascii` (governance/PLAN.yaml:2768-2784 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e81cf3cea9451e9105955d9d850b2002553ff7d5cfbc48e735fadca8f9734427), filler queue entry 1 (state/FILLER-QUEUE.md:7 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:4ae16101836c8082bc95f0a9ad2f619a3c442f62b4c2030368eea2bc39e95aaa), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84); the finding is wave-3 §1c-2 correction (b) (state/cloud/wave3/W3-A.md:103 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8ab73e312fc386f173cc73b104cd4b3ea2fdec9412fcb2966f98c92c8bacb0cc, state/cloud/wave3/W3-A.md:105 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:53ab09a9263bc5e06250cba42c49a29660da523609787a9a5fafac788bdc8ab9, state/cloud/wave3/W3-A.md:193 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:7ab3d81107de5e5cfe41a0c60be661978711fc7e34792da793fbb69c48a83871); reuse index: a miss, no prior art recorded for "case fold unicode ntfs" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief); in-repo prior art for the same fold: engine/src/watch.rs:154-173 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1a2b9d495ca49d1cace5757e811888d6d494bb2c1a134cde498ac2004bf14592, its residual at KNOWN-LIMITATIONS.md:320-326 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1f1a2bc664e1fc80334458bb12c594f82259e9e6dee59ac8db13c090638107a0.
Scope: kernel/src/permission/audit/normalize.rs; kernel/src/permission/audit/log.rs; 2 files; declared line budget 145 by §21c's counting rule (estimated 122); dispatched only after cut/port-2-macos-l1-and-app-dirs, which edits log.rs, has merged (rule (00); OPEN-1).
Change: on Windows, the path-component comparison in normalize.rs (the profile-root strip and the username step, both through `component_eq`) and `is_inside`'s comparison in log.rs fold each character through one private std-only map, `fold` (`char::to_uppercase` where it gives exactly one character and the character lies in the BMP, otherwise the character unchanged), in place of today's ASCII-only fold, and the root strip measures its match in characters, not in the root's bytes; so a profile root, a username component or a destination that differs only in non-ASCII case is normalized, or refused as inside, just as its ASCII-case variant already is; Linux and macOS still compare exactly, unchanged.
Tests+mutation: T1 `kernel/src/permission/audit/normalize.rs::tests::non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows` (Windows; ignored elsewhere with the existing boundary reason), roots `C:/Users/josé` (HOME), `C:/Users/josé/ⱥtlas` (LOCAL_APPDATA), `D:/𐐨-maps` (TEMP), user `josé`, four assertions: (a) `C:\Users\JOSÉ\out` gives `<user-home>/out`, (b) `D:\archive\JOSÉ\out` gives `D:/archive/<user>/out`, (c) `C:\Users\JOSÉ\Ⱥtlas\out` gives `<user-local-appdata>/out`, (d) `D:\𐐀-maps\out` gives `D:/𐐀-maps/out`; mutation M1: `fold` returns `c.to_ascii_uppercase()` on Windows (today's ASCII-only fold), predicted failure: (a), left "C:/Users/JOSÉ/out", right "<user-home>/out"; mutation M2: the root strip splits `s` at `root.len()` bytes behind today's `is_char_boundary` guard, predicted failure: (c), left "<user-home>/Ⱥtlas/out", right "<user-local-appdata>/out"; mutation M3: the BMP condition dropped from `fold`, predicted failure: (d), left "<temp>/out", right "D:/𐐀-maps/out"; T2 `kernel/src/permission/audit/normalize.rs::tests::the_resolved_parent_keeps_its_on_disk_case_and_a_username_in_another_case_still_collapses_on_windows` (Windows; ignored elsewhere): it creates `<temp>/spatial-kernel-case-fold-<pid>/JOSÉ`, resolves `<that dir's parent>/josé/out` through `permission::grant::resolve_destination`, and asserts first that the resolved parent's file name is `JOSÉ`, then that `normalize_with(&resolved, &[], &["josé"])` ends with `/<user>/out`; mutation M1 (as above), predicted failure: the second assertion, "a username in another case leaked: …/JOSÉ/out"; T3 `kernel/src/permission/audit/log.rs::tests::a_log_under_a_non_ascii_case_variant_of_the_destination_is_refused_on_windows` (Windows; ignored elsewhere, the reason naming log.rs and the boundary): `is_inside("D:/maps/été/audit.jsonl", "D:/maps/ÉTÉ")` is true and `is_inside("D:/maps/étés/audit.jsonl", "D:/maps/ÉTÉ")` is false; mutation M4: is_inside's Windows line back to `to_ascii_lowercase`, predicted failure: the first assertion, `assertion failed: is_inside(...)`; all three run on the Windows job (`.github/workflows/product-ci-rust.yml:194-195` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 82f0a2a7b65e9f3e4f00fba162ecadbff5229d99fcc5536b8288309b43bf04f4, `.github/workflows/product-ci-rust.yml:233-234` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 b583ae49475deb6fd0c6a7b2d4ee8a35323f6b6f814b70b68e8b908491ceed3c) and on the worker's Windows machine, where M1 to M4 are observed; on ubuntu-24.04 they are ignored and listed by the R6 step (`.github/workflows/product-ci-rust.yml:238-240` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 4f18097b5d2fb0306ba2b3f59d92fb20b47ebb13a4cc9b659e1d94b5eb3fdf80).
Out-of-scope: ADR: none (no status line or amendment); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP, data-plane or MCP surface); guarantee: TOUCHED, because the Windows case-insensitivity that `component_eq` states (kernel/src/permission/audit/normalize.rs:178-184 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ee441627cae7b18326d9f31bd56fc8d73d3a5f83b03204782a11a089b743b831) and that `is_inside` applies (kernel/src/permission/audit/log.rs:398-399 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8bc1b0299dfcdd07cc8b86c942cac4fbe5d80b4c0b5f20e891e17f8a943c0406) becomes true for non-ASCII letters, and `fold`'s doc declares where it departs from NTFS; Linux and macOS are unchanged, and the declared limits at kernel/PERMISSION-BOUNDARY.md:300-310 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:266b30eb506337e0439590471c91d76218a3095747a298da744d3e8da2c83064 are unchanged; §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch; no new dependency, no `unsafe`, no new string, and no change to the OS-cfg site count of either file (normalize.rs stays at 2, log.rs at 3: scripts/plan/cfg-boundary.test.mjs:86-87 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1618d5bf898e0bc5b78ec29b80fb0eeb5fa27c811852c67dbcab2b6dccdafabd).
```

*The notes, the OPEN items and what is not settled below are lead-data's from its draft, carried byte for byte except for the pins; where they say I or my, they mean lead-data's. They are this form's reading.*

## Notes


**N1. The first step: whether the resolved destination carries the on-disk case, and whether a non-ASCII case difference can reach these compares**
- **Producing the destination.** `resolve_destination` canonicalizes the **parent** and rejoins the **final component as typed** (kernel/src/permission/grant.rs:190-213 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8dd44e9f6c7f4ccd73723848d138cc9ac6a9c500bb3f57a2cebb15141ebebbb9). The boundary resolves the destination this way (kernel/src/permission/boundary.rs:325 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:4b9f8d875497ae2dc90e0bd3a420c4af51e3ab7220f3448458a5f750f1438639), then passes it to `is_inside` (kernel/src/permission/boundary.rs:344 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ef4e8a15c19b3db1d01c370080336815a623e286ca2b49aa3b61435ca62657e7) and normalizes it into the intent record (kernel/src/permission/boundary.rs:363 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:3445473e383e4bf8a8ec4ffb3e316908c3b0f28746c76b3020870c0631be63ae), which is appended before the publish runs (kernel/src/permission/boundary.rs:366 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:28dd709a85cd39898b5e02bd8462aee4c4b5024f4e333f9a88a7baba6b82863f).
- **The other side of each compare never touches the filesystem:**
  - Roots come from environment variables (kernel/src/permission/audit/normalize.rs:116-142 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:c504649e5c4d38f91a320b8537a899cdf018360be6411ab2a1df40e61ff2965b).
  - Usernames come from `USERNAME`/`USER`/`LOGNAME` (kernel/src/permission/audit/normalize.rs:144-146 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:2b7ffc96808601c5ef68152e93fdbff452146ec7d0f7ae373ff652be665b44dd, kernel/src/bundle/redaction.rs:125-134 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:2ba4f061018bd81eb1356ed44b0655b9d25c3ea44e3595214e70e427139f3561).
  - The log path is `SPATIAL_IDE_AUDIT_LOG` verbatim, or `LOCALAPPDATA` plus a fixed suffix (kernel/src/permission/audit/log.rs:340-363 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:142b638454cf16a1c1447c67474b5ecbd0d5abb8f557be49318dc45cc9136abb, kernel/src/permission/audit/log.rs:370-374 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8f06fea3c4a627f6dbcccbfdfbd44d9e2bb783e1353ac333af2e3ce48ca30b0d).
- **What I conclude** (my reasoning). On Windows, `std::fs::canonicalize` returns each existing component in its on-disk spelling. That is my knowledge of std, not a read in this repository, and T2's first assertion settles it on the job. So the parent carries the on-disk case and the final component carries the typed case. Roots, usernames and the log path carry the environment's spelling. Canonicalization therefore makes nothing agree: each compare is between two independent spellings. An escape is reachable in three ways:
  1. **Step 4 (username component), in ordinary use.** A directory the operator created as `D:\Projects\JOSÉ`, or a typed final component `JOSÉ`, against `USERNAME=josé`. `eq_ignore_ascii_case` misses É/é, so the name stays in the record.
  2. **Step 3 (profile root).** `--out C:\Users\JOSÉ`, a typed case variant of the home itself. Publishing then refuses the destination as existing (kernel/src/publish/mod.rs:634-639 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:9280bcc1b82b99035f1f6dc4850a6577b9d32dafa18c92771235ffeaf8a79ef3), but the intent record is already written with `C:/Users/JOSÉ`. It is also reachable whenever a profile variable's spelling differs from the disk in a non-ASCII letter, which is not the default.
  3. **`is_inside`.** `SPATIAL_IDE_AUDIT_LOG=D:\maps\été\audit.jsonl` with `--out D:\maps\ÉTÉ` is not refused as inside. In my reading this fails closed by another route: `open_for` has already created the log's directory (kernel/src/permission/audit/log.rs:132-137 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ab220e5df7b9620f2bd5d8bf7dce8ab22e2e086b14c99b91b1a99a59f16747a1), so the destination exists and publish refuses with `DestinationExists` (kernel/src/publish/mod.rs:635 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:fcd724ef347bd217d924a1da988b4ba0f6a728924d437e4e4f88f6578d96e888). No log ships. The cost is the wrong refusal reason and a stray directory.
- **The leak is silent.** A non-ASCII username never becomes a `username` finding, because a match must lie wholly in a printable-ASCII run (kernel/src/bundle/redaction.rs:189-204 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:49851c31c3fda2475505f30e2ab11a9c3846fcfed7d8e2bff47912fa0346d6d7). So `residual_classes` (kernel/src/permission/audit/log.rs:265-278 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:2d7db2c8f197d396217f356e4eae075afd1aad6c8efe6a73f54993f95fa97ed8) does not name what (1) and (2) leave in the record.
- **So the piece is real**, not a no-op. If T2's first assertion fails (the parent not resolved to its on-disk spelling), the premise of route (1) via a parent is wrong, and that is recorded as a class-2 deviation. Routes (1) via the typed final component, (2) and (3) do not depend on it, and the fix stands.

**N2. The size, against §21c first** (governance/AUTONOMY.md:347-357 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31)

| File | What | Estimated lines (insertions + deletions) |
|---|---|---|
| normalize.rs, product | `fold` (+22: doc 9, body 13 with the two cfg arms moved from `component_eq`); `component_eq` doc (+2 −1) and body (−8 +1); `strip_component_prefix` doc (−10 +4) and body (−4 +3) | 55 |
| normalize.rs, tests | T1 (≈20), T2 (≈24) | 44 |
| log.rs, product | `is_inside` doc (+2); the Windows line (−1 +6) | 9 |
| log.rs, tests | T3 (≈14) | 14 |
| **Total** | 2 files | **about 122** (declared 145) |

- **Fixed: `component_eq`** (kernel/src/permission/audit/normalize.rs:185-194 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:dc68ef7d4cefb1ff7f493f44932f153bb50db9169e2d4ecb38a02e0b2c56a7d1), which is both callers: step 4 (kernel/src/permission/audit/normalize.rs:98 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:6821b309507136a0a20b596dca00640770609095db63677a04beb33682065a94) and the root strip (kernel/src/permission/audit/normalize.rs:168 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ddb740769b8a299b07439c7f03032a9979139b6631cdd3ab05322a21cc9ac6d8).
- **Fixed with it: the strip's byte split** (kernel/src/permission/audit/normalize.rs:163-167 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:43beeb823d91ca67b2a4a5e8fdff90be1ecca7b4e94df835a2c55dc1e9a9f60b). With a Unicode fold, a matching prefix of `s` can have a different byte length from `root` (`ⱥ` is 3 bytes, `Ⱥ` is 2). A split at `root.len()` would then make `component_eq` and the strip disagree inside one function. The split index becomes `s.char_indices().nth(root.chars().count())`, which is a character boundary by construction. That also removes the panic risk the old guard existed for (kernel/src/permission/audit/normalize.rs:153-162 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:cdafc82314085dbfb678bad7f9a7b61e37f15b5fcfc36db8c0e491f6f80fcd44), and the existing `a_non_ascii_root_or_destination_normalizes_instead_of_panicking` still pins it.
- **Fixed: `is_inside`'s fold** (kernel/src/permission/audit/log.rs:398-399 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8bc1b0299dfcdd07cc8b86c942cac4fbe5d80b4c0b5f20e891e17f8a943c0406). Its callers are kernel/src/permission/audit/log.rs:125 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:42396fb698ad4273ec3966d04f58aa0444a397a89c2df416dd0128d32a6884c9 and kernel/src/permission/boundary.rs:344 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ef4e8a15c19b3db1d01c370080336815a623e286ca2b49aa3b61435ca62657e7. The node's summary names it (governance/PLAN.yaml:2783 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e478248d6f1a5eef0616c4166f37c7653210e402627424d7cb1181a528d10ca7), which is why it is in Scope (OPEN-1).
- **Left: the redaction scan's `find_all_ascii_ci`** (kernel/src/bundle/redaction.rs:328-343 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:617df458ddbe1e7d1b7ae3b0cba0b274293f5b1c06a2d9721dcea6332f4ffd38). **It is not the same defect.**
  - It searches bundle and record bytes on every OS for a username or hostname. That is a content scan, not a filesystem name compare, so NTFS's rule is not the right reference for it.
  - A Unicode fold there would change no outcome: a non-ASCII name never sits in a printable-ASCII run (kernel/src/bundle/redaction.rs:189-204 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:49851c31c3fda2475505f30e2ab11a9c3846fcfed7d8e2bff47912fa0346d6d7), a floor declared at kernel/PERMISSION-BOUNDARY.md:307-310 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e4da03e890f37b9c74e8bc38869d3849724da934f73e050304498f87e2fe2a7d.
  - redaction.rs is also 7a's Scope file (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:7 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:b6fd01f9a012c6167a334147efb47fd215ed7f67f6550085edd4993f06662884).
- **Left, not the node's (seen in passing):**
  - `DestinationScope::covers` compares resolved paths with `==` (kernel/src/permission/grant.rs:166-171 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:f2ac0c84064169388255013f1b1f1e6c28e40fb1a0a9eabc039ada6577a6a664). In my knowledge of std that is case-sensitive on Windows, so a grant and a publish whose typed final components differ in case do not match. That fails closed.
  - The ASCII fold in the test helper at kernel/tests/permission_boundary.rs:737-741 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:dccb2eceefe62f82fe033de9ae67fffe505418a09a8bbdf3401abd698424f427 only makes that test's token assertion conditional; a non-ASCII profile would weaken the test, not make it wrong.
  - kernel/src/publish/mod.rs:1094 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:015cdf33c9765e2e4e3e7b9c6d84859aea4664e8fbd3e628d96c2d5e22f83615 and kernel/src/session_history.rs:405 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:7948597c4a3f57a2208b95e10ae1c421eafff9409b6a319fc4017613b77fdabc are not path compares.
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
- **The house precedent** is the same construct without the BMP condition (engine/src/watch.rs:161-171 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:b3ed158f04dc975053671dd2f77d43f18ed7d04e780fcf70b714f305ade016c5), with its residual declared at KNOWN-LIMITATIONS.md:320-326 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1f1a2bc664e1fc80334458bb12c594f82259e9e6dee59ac8db13c090638107a0.
- **No table and no new dependency are needed**, so item 3 does not stop. Exact parity with the OS would need `CompareStringOrdinal` or `RtlUpcaseUnicodeChar`. That means `windows-sys` in kernel/Cargo.toml (a new dependency for this crate, a red line) or an `unsafe` extern declaration (the security posture, a red line). Even that would use the system's table, not the volume's. Not taken.
- **Placement, held to the pinned cfg counts:**
  - The two cfg arms move from `component_eq` into `fold` (normalize.rs stays at 2 sites). `component_eq` becomes `a.chars().map(fold).eq(b.chars().map(fold))` on every platform; `fold` is the identity off Windows, so Linux and macOS compare exactly, as today.
  - `is_inside` keeps its single `#[cfg(windows)] let`, now mapping both strings through `super::normalize::fold` (log.rs stays at 3 sites).
  - `fold` is `pub(crate)`, and its product callers are in both files, so nothing is dead code on Linux.
  - scripts/plan/cfg-boundary.test.mjs is untouched; port-2 edits it (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:102 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:530d5915a747ac0ffe6aa49124244990fc57e5e6efce2361ab2d5f4129f5f176).

**N4. Tests, declared unchanged, invalidators**
- The new tests and mutations are on the Tests+mutation line. T2 removes its temp directory before asserting, and first removes any leftover one. It passes no roots, so it depends on no environment root and names no profile path.
- **Declared unchanged and green on both jobs:**
  - every existing normalize.rs test, including `case_differences_collapse_on_windows` (kernel/src/permission/audit/normalize.rs:295-302 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:cebd599de59b40b79e8837f687b68016799aa25dfbc01c8de5e7a062586649e6) and the non-ASCII panic test (kernel/src/permission/audit/normalize.rs:266-291 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:03e919b3a84fed2b7d01df319da182950457505868c2febcbb9e45d26b12a84d);
  - `a_log_resolving_inside_the_destination_is_refused` (kernel/src/permission/audit/log.rs:440-456 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:aefc3d9a57af31313a59c91f8f9c221e8c94701f5ee370a671518bb51a5b0a6c);
  - kernel/tests/permission_boundary.rs::a_destination_under_a_user_profile_path_is_normalized_in_the_record;
  - cfg-boundary's 18 sites (scripts/plan/cfg-boundary.test.mjs:73-75 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:cf16c82c4db2d25eb43ff7477c1dfe6583732b7daaf125e138a789a4e9f1c871).
  - My check, by hand: with the new walk, the ASCII results of the existing tests are the same as today's.
- **Ignored lists (R6):** Windows' list is unchanged. Linux's gains T1, T2 and T3, each single-platform by construction. This form is their record.
- **Invalidators:** any other test changing outcome on either job, or any change in a file's cfg-site count, stops the piece.

**N5. Platform item** (R3, docs/PREREGISTRATION-TEMPLATE.md:177 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0)
- **Owning boundary:** filesystem case policy, already allowlisted for both files (scripts/plan/cfg-boundary.mjs:30-31 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:74bbd681e68a1745c900be19b008c34291d71a0c258974edb3eb9a7e1bc9d36b; state/cloud/wave3/W3-A.md:58 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:4eaf45cf1ab4f2ceb889774ca22f9ff4f8ff4e0b51fa8eedf9c19501a7771eb8, state/cloud/wave3/W3-A.md:61 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:6d6ca897f39dcf582187d2c37065261712c3866aac82e2077d4636e163a00de4).
- **Windows:** supported, changed as the Change line says. T1 to T3 run on windows-latest, and M1 to M4 are observed on the worker's Windows machine.
- **Linux:** supported, unchanged (exact comparison). T1 to T3 are ignored with the boundary reason. Case-insensitive Linux mounts are 1c-2 (a), port-2's intake (state/cloud/wave3/W3-A.md:192 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:6d2af168e36b48b14d251cfab2f990e1f3d69e0fd6d7a3d707316d6889d1d0b6), not this piece.
- **macOS:** unchanged, the same exact arm. APFS's default case-insensitivity is port-2's case-policy work, not this piece's. There is no macOS job. It stays explicitly reduced, as today.
- **Strings a user sees:** none added or changed. On Windows the record's destination *value* now shows `<user-home>` or `<user>` where a non-ASCII case variant leaked before (OPEN-3). There are no new words, so nothing needs a P6 placeholder. If a string arises mid-piece, it is a P6 placeholder for the sitting.
- **KNOWN-LIMITATIONS:** none owed, in my recommendation (OPEN-6).

**N6. Rule (00), path by path** (in-flight paths as the brief gives them)

| My path | In-flight piece that edits it |
|---|---|
| `kernel/src/permission/audit/normalize.rs` | None in flight: not in b2-1c's kernel list or port-2's, and #273, #272, #271 and b1-shell-half-pr-c have nothing under kernel/. Entry 7b's held draft edits it at step 2 and the root reading (its Scope, state/consults/2026-11-01-posix-backslash-in-shared-path-logic-five-line-form-lead-data-draft.md:13 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ddb64d03151ebc0dbdf96de2370fdf3d8895021389a5dcf25aa9bfd2fa1795dd), which are other functions than mine. Both add tests at the end of the same `mod tests`, so whichever lands second rebases. One filler is in flight at a time anyway (governance/AUTONOMY.md:692 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84). |
| `kernel/src/permission/audit/log.rs` | **`cut/port-2-macos-l1-and-app-dirs`.** The piece needs `is_inside`'s Windows line (kernel/src/permission/audit/log.rs:398-399 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8bc1b0299dfcdd07cc8b86c942cac4fbe5d80b4c0b5f20e891e17f8a943c0406) and one test in its `mod tests`. Dispatch waits for port-2's merge, which is the node's own NEXT (governance/PLAN.yaml:2783 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e478248d6f1a5eef0616c4166f37c7653210e402627424d7cb1181a528d10ca7). |
| this form's path | None |

- **Without log.rs** (OPEN-1 (b)), the piece is normalize.rs alone: T1, T2, M1 to M3, about 99 lines, 1 file. Both escapes into the record are closed, and `is_inside` keeps its wrong-reason refusal (N1, route 3).
- **Not needed:** kernel/PERMISSION-BOUNDARY.md (port-2's), scripts/plan/cfg-boundary*.mjs (port-2's; counts held), kernel/src/bundle/redaction.rs (7a's), grant.rs, kernel/README.md (OPEN-5).

## OPEN items, with options and my recommendation

- **OPEN-1, log.rs and when to dispatch.** Recommendation: (a).
  - (a) As drafted: both files, dispatched after port-2 merges, as the node's NEXT already says. The entry keeps its place; the next filler runs meanwhile.
  - (b) normalize.rs only, dispatchable now, with `is_inside` as a proposed follow-up. **Possibly a red line:** the node's summary names `is_inside` (governance/PLAN.yaml:2783 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e478248d6f1a5eef0616c4166f37c7653210e402627424d7cb1181a528d10ca7), and scope changes to ruled items are one (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38). It would hold for the human.
  - (c) (a) plus 7b's OPEN-5 (c), the POSIX separator fix in the same function (state/consults/2026-11-01-posix-backslash-in-shared-path-logic-five-line-form-lead-data-draft.md:139-142 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:a6cf638c4de6f530e88755b0541193d797a271bf5c5b20fc5e27c7515a405772). That is a second finding (A-1) on another platform, needs a Linux mutation observation, and 7b's OPEN-5 is held for the human. Not recommended unless the human rules 7b's OPEN-5 (c) before this form commits. If so, it is drafted into this form before commit.
- **OPEN-2, the BMP condition in `fold`.** Recommendation: (a).
  - (a) Keep it. NTFS upcases UTF-16 units, so supplementary-plane letters compare exactly there. It avoids rewriting a distinct directory, the corruption kernel/src/permission/audit/normalize.rs:19-24 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:4a6e070b635faa23d372d7b7a611db2a31e63bcf69a06e781e2b1852eaa466e5 refuses to do. Cost: one line, T1 (d), M3.
  - (b) Drop it, matching engine/src/watch.rs:161-171 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:b3ed158f04dc975053671dd2f77d43f18ed7d04e780fcf70b714f305ade016c5 exactly. That over-folds supplementary letters, which errs safe for both sites. About 6 lines fewer.
- **OPEN-3, is the Windows record now tokenizing non-ASCII case variants "new user-visible behaviour" under §21c?** Recommendation: (A), the same reasoning as 7a's OPEN-2, ruled (A).
  - (A) Not new: the stated normalization made true for non-ASCII letters, with no new string.
  - (B) New: the full form.
- **OPEN-4, the guarantee label.** Recommendation: (a), following the 7a and 7b precedent.
  - (a) TOUCHED, as drafted. It changes no gating under §36.
  - (b) none, on the reading that the code is only brought to its own doc. A false "none" is a block-on-sight (docs/PREREGISTRATION-TEMPLATE.md:158-160 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:6b301c10d5d6c034c723184818c54b14906f7ff83668ab05a4e5b8bf961421df).
- **OPEN-5, kernel/README.md.** Recommendation: (a), as 7b's OPEN-6.
  - (a) Out of Scope. No pointer in the permission row (kernel/README.md:373 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:2fd023714ac30231b1c6bba657fe9dae7acc422ce761bef784a77b02715f8c40) changes, and the merged kernel fillers at governance/forms/kernel/ are not listed in the index either.
  - (b) In Scope, adding this form to the list at kernel/README.md:387 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:2a20648e3e90b4b78177f312394340150c61b1407e6295efdd41eccfacb95f7a.
- **OPEN-6, the fold's residuals (N3 (i) to (iii)).** Recommendation: (a).
  - (a) Declared in `fold`'s doc only. The residual is a strict narrowing of today's undeclared gap, which covers every non-ASCII letter.
  - (b) A KNOWN-LIMITATIONS item in KL 27's shape (KNOWN-LIMITATIONS.md:320-326 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1f1a2bc664e1fc80334458bb12c594f82259e9e6dee59ac8db13c090638107a0). That adds a third file, about 8 lines, and words a human may want to see.
  - (c) (a) plus a Windows probe test that checks `fold` against the runner volume for a fixed list of letters (é, ı, ſ, ᾳ, 𐐨, ა), about 20 lines. It measures the runner's table, not users' tables.
- **Red lines:** none of my recommendations is one. OPEN-1 (b) may be one (above). Any route to exact OS parity (N3) would be one (a dependency, or `unsafe`) and goes to the human.
- **Question for the custodian, not decided:** please confirm that guarantee: TOUCHED (Windows non-ASCII case, Linux and macOS unchanged) is not a red line, as ruled for 7a.

## What I could not settle

- My reads were of the working tree, taken as b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 from the session's git status, not verified by git.
- That `std::fs::canonicalize` returns on-disk spelling on Windows is my knowledge; T2's first assertion settles it on the job. The NTFS `$UpCase` facts and the divergences in N3 are also my knowledge, not repository reads. Whether Windows' table maps `ı` and `ſ` to ASCII, or folds the Greek iota-subscript letters, I do not know.
- I cannot read port-2's log.rs edit or `kernel/tests/case_policy_volume.rs`. If port-2 changes `is_inside`'s case policy (for example, to a volume probe), this form's log.rs part must be re-read at dispatch and redrafted before code.
- The line counts are estimates. M1 to M4's predicted messages are worked by hand from the code at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3.
- An observation outside this piece: kernel/src/permission/audit/normalize.rs:22-24 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:2967d76abc0ba1d76b8b3a272c4247e088752af2e64fe5702344386c6da225d5 and kernel/PERMISSION-BOUNDARY.md:300-302 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:4e968b923b47d470effaf1e4553fd508567071c910d0b2a54e12bd446b8887a9 say the record names `username` for a name inside a longer component. For a non-ASCII username it never does. Only the general floor sentence at kernel/PERMISSION-BOUNDARY.md:307-310 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e4da03e890f37b9c74e8bc38869d3849724da934f73e050304498f87e2fe2a7d covers that. It may deserve a proposed node; the custodian judges.
- I have no shell, so this report carries no sha256.

## The custodian's settlement (class 1, before any code)

- **The OPEN items,** taken on 2026-11-01 as the drafting agent recommends, by the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4); none is a red line, and the human reviews each on return:
  - **OPEN-1: (a),** both files, dispatched after port-2 merges. Option (b), which the draft marks as possibly a red line (a scope change to a ruled item), is not taken; nor is (c), which waits on 7b's OPEN-5, held for the human.
  - **OPEN-2: (a),** the BMP condition kept in `fold`.
  - **OPEN-3: (A),** not new user-visible behaviour; the filler stands with both gates from dispatch under §36.
  - **OPEN-4: (a),** guarantee: TOUCHED, as drafted.
  - **OPEN-5: (a),** kernel/README.md out of Scope.
  - **OPEN-6: (a),** the fold's residuals declared in `fold`'s doc only.
  - Any route to exact parity with the OS (a dependency, or `unsafe`) is a red line, as the draft says, and is not taken.
- **The guarantee:** the draft's question is read as the human ruled for 7a (`governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md`, its settlement, the guarantee bullet): a platform scope made true is not a red line; the piece stays `guarantee: touched`, with the reviewer and the architect from dispatch under §36. The custodian's reading, for the human's review on return.
- **Rule (00),** by git at main 0e9edef1 (`git diff --name-only origin/main...<branch>` over the open PRs, #273, #272, #271, and the branches in flight): `cut/port-2-macos-l1-and-app-dirs` edits `kernel/src/permission/audit/log.rs`, a Scope file; nothing else touches the Scope or this form. So entry 1 stays skipped at dispatch, keeping its place in the filler queue, as OPEN-1 (a) says. When port-2 has merged, log.rs (`is_inside` and its tests) and the pinned cfg-site counts in the Out-of-scope line are re-read at that main and recorded by an amendment before any code, as the draft's last section asks.
- **The read commit and main:** `git diff --name-only b1bdb8ac 0e9edef1 -- kernel/src/permission/audit/normalize.rs kernel/src/permission/audit/log.rs` is empty, so the Scope files read at main 0e9edef1 as they did at b1bdb8ac.
- **Not settled by the draft, and proven by the piece's own runs:** that canonicalization returns the on-disk spelling on Windows (T2's first assertion), and the NTFS facts in N3, as its last section says.
- **The draft's observation outside this piece** (its last section: a non-ASCII username is never named `username` in the record) goes to the human's review on return; no node is placed for it.

## Amendments (opens empty; append-only)

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

## Amendment 2 — 2026-11-27 — the custodian's closing amendment, written after both build gates' reports were seen: references and hashes only

*References and hashes only. Nothing above is edited.*

1. **The head** is 74178ea95741985c604c552174d42dcf63e374fc (PR 367), over the base main 4b9fd558d0437b3249e1bba58334a6d55074c199. Its commits:
   - f13dbd87, the code with T1 to T4;
   - f9496e56, the five mutations recorded beside their tests;
   - 74178ea9, the build gates' words.
2. **The gates,** both at f9496e56033038ab468ba3b92364aa17379535d7:
   - the architect, PASS WITH NOTES: `state/consults/gates/2026-11-27-windows-case-fold-non-ascii-build-gate-architect.md`, sha256 ea039cafff1078b53d06556c4233ce8d20d943e3643b4bbc20144b5eb752d81d, gate-log row 931;
   - the reviewer, FAIL on words only: `state/consults/gates/2026-11-27-windows-case-fold-non-ascii-build-gate-reviewer.md`, sha256 a734c1d7d1e80e8628d597df2e8c64fea1415527591aa31edda08c05e911d0ff, row 932.
   - ADV-2026-11-27-13 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-13-the-case-fold-pieces-three-places-g1-for-component-eqs-doc-c1-whole-for-folds-doc-class-6-at-148-m1-at-t3-in-the-closing-amendment.md`) rules the three places where their words differ.
3. **The words commit** (that ruling's items 1, 2 and 6). 74178ea9 holds places 1 and 2 and nothing else:
   - the architect's G1 for `component_eq`'s doc;
   - the reviewer's C1, whole, for `fold`'s doc.
   A script copied both from the reports as filed on main. `git diff --numstat f9496e56...74178ea9` gives normalize.rs 10/7.
4. **Class 6, at the count** (item 3).
   - §21c's counting rule, as the Scope line names it, gives 148 lines in 2 files at the words commit, by `git diff --numstat 4b9fd558...74178ea9`: log.rs 26/2 and normalize.rs 103/17.
   - The declared figure is 145. The estimate was 122, and about 138 after Amendment 1 item 12.
   - The lines past 145 come from C1, a gate's correction of an untrue claim. The Scope line is not edited, and nothing is cut to come back to 145.
   - 148 is inside §21c's 150, so the route does not change.
5. **Class 2, place 3: M1 also fails T3** (item 4).
   - The form's M1 prediction is not edited.
   - The architect's draft row, from its D1, adopted verbatim: "M1 also fails T3 `kernel/src/permission/audit/log.rs::tests::a_log_under_a_non_ascii_case_variant_of_the_destination_is_refused_on_windows`, first assertion, unpredicted: is_inside maps both strings through `fold` (the Change line). Class 2; the prediction stands."
   - The reviewer's observation, from its report's check of the mutations: at f9496e56033038ab468ba3b92364aa17379535d7, on Windows, M1 (`fold` is `c.to_ascii_uppercase()`) was applied alone and the `permission::audit` tests were run. The run printed, verbatim, `test result: FAILED. 32 passed; 3 failed`. T3's failing assertion, as printed: `assertion failed: is_inside(Path::new("D:/maps/été/audit.jsonl"), Path::new("D:/maps/ÉTÉ"))`.
   - T3's doc in the source keeps its M4 line and gains nothing.
6. **The probe's two sets** (item 2's last bullet). This is the custodian's reading of the reviewer's report, check 3.
   - **The 27 that the volume equates and `fold` keeps apart: shown.** The report lists them, verbatim: "The L list is exactly U+1F80-1F87, U+1F90-1F97, U+1FA0-1FA7, 1FB3, 1FC3 and 1FF3." These are the letters of class (ii).
   - **The 225 that `fold` joins and the volume does not: not shown.** The report names Cherokee (86) and Georgian (48) among them. It also lists, separately, 18 code points of the compatibility and titlecase set as not equated. It does not class the rest of the 225. So the doc's "three declared classes" is a declaration, not a proof.
7. **N3's NTFS facts are not proven by the piece's tests** (item 5). T1 to T4 pin `fold`'s results, not a volume's. The reviewer's probes, in its report's check 3, are the gate's observation: one NTFS volume, on 2026-11-27.
8. **The tests,** by name at 74178ea95741985c604c552174d42dcf63e374fc, with no hash pin at a branch commit (item 5):
   - T1 `kernel/src/permission/audit/normalize.rs::tests::non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows`;
   - T2 `kernel/src/permission/audit/normalize.rs::tests::the_resolved_parent_keeps_its_on_disk_case_and_a_username_in_another_case_still_collapses_on_windows`;
   - T3 `kernel/src/permission/audit/log.rs::tests::a_log_under_a_non_ascii_case_variant_of_the_destination_is_refused_on_windows`;
   - T4 `kernel/src/permission/audit/normalize.rs::tests::a_destination_that_is_exactly_a_root_becomes_the_roots_token`.
   The reviewer observed M1 to M5 at f9496e56. Its report says the RECORDED MUTATION lines match what it saw, except M1 at T3 (item 5 above).
9. **CI at the head 74178ea95741985c604c552174d42dcf63e374fc:** Product CI — Rust workspace 45949718578; Product CI — Rust workspace 45950001340; Product CI — shell 45949718642; Product CI — shell 45950001368; Governance CI — plan, queue, site 45949718635; Governance CI — plan, queue, site 45950001330, each completed with success. `gh pr checks 367` gives pass 20 (the custodian's read at 2026-11-27T06:32:11Z).
10. **The reviewer's FAIL** closes with no further attempt (item 6). The advisor verifies it at the merge check. The merge is by a merge commit, after that check.

Read the last amendment first.

Nothing above is edited.
