Reviewed: the branch cut/windows-case-fold-non-ascii at f9496e56033038ab468ba3b92364aa17379535d7, over the base main 4b9fd558, in the piece's worktree D:/wt/casefold, running the tests and the mutations there. This is the custodian's filing note, 2026-11-27: the reviewer's build gate, node:windows-case-fold-non-ascii@build-gate-reviewer; its run, from its completion notices only (ADV-2026-11-26-02), 38 tool uses by its last completion notice, over three runs, the second and third resumed by the custodian's messages. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 11449 bytes, sha256 d11f4efb390b9fc0e4639e7779870f1a941bb4a78ac409b638a9d9d1dd95a07a), byte for byte except the scratch folder's path, written <scratch> (1 place; 11350 bytes after it, sha256 37727d0b4e7b9689bd0b964c8b56a37de3f3730808cdb249e3e68ead97be00a4). The places where the two gates' words differ are ruled in ADV-2026-11-27-13 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-13-the-case-fold-pieces-three-places-g1-for-component-eqs-doc-c1-whole-for-folds-doc-class-6-at-148-m1-at-t3-in-the-closing-amendment.md`).

---

FAIL — on words only. cut/windows-case-fold-non-ascii @ f9496e56033038ab468ba3b92364aa17379535d7

The one blocking finding is in a sentence of `fold`'s doc comment, which is not the human's wording. The code and its evidence are closed: all five mutations fail where the form predicted, and the kernel tests and CI are green. Under §31 the worker applies the words in C1 with no re-gate, and the PR body lists them.

To the custodian: I had no finished report to resend. My earlier hand-back was the interim one. Your "run nothing new" arrived while my mutation run (task bcehqb0yt) had M1 applied to normalize.rs. If I had ended then, that task could have been killed before it reverted. I let the run that was already going finish, and ran nothing new except reads of its logs and `git status`. This report is the whole of it.

**1. Scope**
- Command: `git -C D:/wt/casefold diff --numstat 4b9fd558...f9496e56`.
- It printed `26 2 kernel/src/permission/audit/log.rs` and `100 17 kernel/src/permission/audit/normalize.rs`. That is the two Scope files only.
- By §21c's rule (insertions plus deletions, tests counted), 26 + 2 + 100 + 17 = 145. That equals the declared 145 and is not over it, so Amendment 1 item 12's class 6 does not arise.
- `git log 4b9fd558..HEAD` shows the two commits, f13dbd87 and f9496e56. f9496e56 adds 10 lines, all doc comment (`git diff --numstat f13dbd87 f9496e56`: log.rs 2 0, normalize.rs 8 0).

**2. The Change line, as Amendment 1 reads it, against the diff**
- `fold` is `pub(crate)` and std-only, so "crate-visible" (pair 12) holds. The two cfg arms moved into it from `component_eq`.
- `component_eq` is now `a.chars().map(fold).eq(b.chars().map(fold))`.
- `is_inside`'s `#[cfg(windows)]` line maps both strings through `super::normalize::fold`.
- The BMP condition is `(Some(u), None) if c.len_utf16() == 1 => u`, otherwise `c`.
- The root strip is measured in characters: `s.char_indices().map(|(i, _)| i).chain(std::iter::once(s.len())).nth(root.chars().count())?`. That is item 12's shape, and the guard is gone.
- Off Windows `fold` is the identity, so Linux and macOS still compare exactly.
- The diff changes no Cargo.toml and adds no `unsafe`.
- Reading the index logic: it gives the start of character k, `s.len()` when the character counts are equal, and `None` when `s` is shorter. That is correct.

**3. `fold`'s doc against N3, and against the volume**
- Probe 1, PowerShell, under TEMP on its NTFS volume, which is T2's volume. It creates a file under the lower spelling and tests whether the capital spelling finds it.
  - It printed True for é/É, ᾳ/ᾼ, ᾀ/ᾈ and ⱥ/Ⱥ.
  - It printed False for ı/I, ſ/S, µ/Μ, ς/Σ, ა/Ა, 𐐨/𐐀, k/K-sign and ß/ẞ.
- Probe 2: `fold`'s exact body, compiled with rustc 1.97.1, listed every BMP pair, and `python -I probe3.py` probed each pair on the volume. It printed, verbatim:
  - "O: std's fold changes 1145 chars; this volume does not equate 225"
  - "L: lower/upper pairs fold keeps apart 32 ; this volume equates 27"
  - The L list is exactly U+1F80-1F87, U+1F90-1F97, U+1FA0-1FA7, 1FB3, 1FC3 and 1FF3.
  - "of the compatibility/titlecase set, not equated: 00B5 0131 017F 01C5 01C8 01CB 01F2 0345 03C2 03D0 03D1 03D5 03D6 03F0 03F1 03F5 1E9B 1FBE"
  - The 225 include Cherokee 86 and Georgian 48.
- What the probes confirm:
  - (ii) exactly: 27 letters, leak direction.
  - The BMP condition: Deseret is not equated by the volume.
  - (i)'s drift. It is larger than its one example.
- What they contradict: "It departs from NTFS in three declared ways." At least 16 more letters fold under std but not on this volume: µ, ς, ϐ ϑ ϕ ϖ ϰ ϱ ϵ, U+0345, U+1FBE, ẛ, and ǅ ǈ ǋ ǲ. None of these is Unicode-version drift. All of them over-normalize; none leaks.
- Ordinary use reaches this. A Greek username ending in ς gets `<user>` written for a directory NTFS keeps distinct, and `is_inside` refuses falsely. See C1.
- Every other doc sentence holds against the code: the strip doc (including "`ⱥ` is 3 bytes, `Ⱥ` is 2"), `component_eq`'s doc, and `is_inside`'s added sentence.

**4. Tests T1 to T4** (read in the diff; outcomes from CI's logs with `gh run view --job <id> --log | grep`)
- T1 `non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows`:
  - Its roots and user match the form, and assertions (a) to (e) match the form's left and right values.
  - Its ignore reason is byte-identical to `case_differences_collapse_on_windows`'s (normalize.rs:374 and :390 at the head), as pair 1 requires.
- T2 `the_resolved_parent_keeps_its_on_disk_case_and_a_username_in_another_case_still_collapses_on_windows`:
  - It removes any leftover directory, creates `JOSÉ` and resolves `josé/out`.
  - It removes the directory, then asserts the parent's name is `JOSÉ`, then that the result ends with `/<user>/out`.
- T3 `a_log_under_a_non_ascii_case_variant_of_the_destination_is_refused_on_windows`: two assertions, as declared. Its ignore reason names log.rs and the boundary.
- T4 `a_destination_that_is_exactly_a_root_becomes_the_roots_token`: no `cfg_attr`, one assertion, as declared.
- CI at f9496e56:
  - windows-latest (job 140293422943): T1 to T4 `ok`.
  - ubuntu-24.04 (140293422615) and macos-latest (140293423020): T1 to T3 `ignored, boundary: filesystem case policy ...` and listed by R6, T4 `ok`.

**5. Mutations, observed by me**
- How they ran:
  - All five ran in one shared hold. Each was applied alone at the head with an anchored replacement that refuses anything but exactly one match (`perl sub_once.pl`, called from `run.sh`).
  - Each ran `cargo test -p spatial-kernel --lib permission::audit` and was reverted with `git checkout -- <file>`.
  - The script checks that `git status --porcelain` is empty before each apply and after each revert. It printed "M1 reverted" … "M5 reverted" and "porcelain after last revert: []", and the hold printed MACHINE_RELEASED.
  - Read afterwards: `git -C D:/wt/casefold status --porcelain` is empty, and HEAD is f9496e56.
  - Each run's cargo rc was 101, with one `error: test failed` line per log and no compile error.
- Line numbers are those of the mutated file.
- M1 (`fold` is `c.to_ascii_uppercase()`): `test result: FAILED. 32 passed; 3 failed`.
  - T1 at normalize.rs:397, which is (a): left "C:/Users/JOSÉ/out", right "<user-home>/out".
  - T2 at :428, its second assertion: "a username in another case leaked: <profile>/AppData/Local/Temp/spatial-kernel-case-fold-<pid>/JOSÉ/out". The first assertion passed.
  - **T3** at log.rs:470: `assertion failed: is_inside(Path::new("D:/maps/été/audit.jsonl"), Path::new("D:/maps/ÉTÉ"))`.
- M2 (split at `root.len()` behind `is_char_boundary`): 1 failed. T1 at :402, (c): left "<user-home>/Ⱥtlas/out", right "<user-local-appdata>/out".
- M3 (BMP condition dropped): 1 failed. T1 at :405, (d): left "<temp>/out", right "D:/𐐀-maps/out".
- M4 (`is_inside` back to `to_ascii_lowercase`): 1 failed. T3 at log.rs:467, its first assertion: `assertion failed: is_inside(Path::new("D:/maps/été/audit.jsonl"), Path::new("D:/maps/ÉTÉ"))`.
- M5 (no `s.len()` chained): 2 failed.
  - T4 at :442: left "C:/Users/<user>", right "<user-home>".
  - T1 at :406, (e): the same left and right. (a) to (d) passed.
- Against the source: the RECORDED MUTATION lines for M1 to M5 match what I saw. One is missing: T3's doc records only M4, and M1 also fails T3's first assertion, which the form did not predict. See D1.

**6. The head**
- `cargo test -p spatial-kernel`, in a shared hold:
  - rc=0, 62 `test result: ok` lines, 0 not ok.
  - The lib result: `test result: ok. 197 passed; 0 failed; 1 ignored`.
  - T1 to T4 all `... ok`.
- `cargo fmt --check -p spatial-kernel`: rc=0.
- `node scripts/plan/cfg-boundary.mjs`: printed "cfg-boundary: 19 sites in 7 files, 0 outside every boundary", rc=0. log.rs has 1 site (:397) and normalize.rs 2 (:214, :222), the base counts as Amendment 1 item 5 has them.
- `node --test scripts/plan/cfg-boundary.test.mjs`: 7 pass, 0 fail, rc=0.
- `gh run list --branch cut/windows-case-fold-non-ascii`: every run at f9496e56 succeeded, and none is still in progress.
  - Governance CI, Product CI shell, Rust fmt and Ported notices all succeeded.
  - Product CI Rust workspace run 45934166264 was in progress at my first read. Read again, all three of its jobs were completed success.

**7. Out-of-scope**
- The diff touches the two kernel files only.
- It touches no ADR, security, SKP, data-plane or MCP surface, adds no dependency and no `unsafe`, and adds no product string (the only new strings are test messages).
- The cfg counts are unchanged.
- guarantee: TOUCHED is declared, and the five-line form stands under §36, which sets §25 (e) aside. The Out-of-scope line is true.

**FINDINGS**

Correctness (words only; blocks, and is applied under §31 with no re-gate)
- C1. normalize.rs, `fold`'s doc. The claim of three departures from NTFS is untrue on the evidence in check 3. This is not the human's wording. Replace the text from "**It departs from NTFS in three declared ways.**" through "which Windows' table may not do." with:
  ```
  /// **It departs from NTFS in three declared classes.** (i) `std`'s Unicode version can fold letters
  /// an older volume table does not (Georgian Mkhedruli, Cherokee): over-normalization, a false
  /// refusal in `is_inside`. (ii) 27 Greek lowercase letters with iota subscript (U+1F80-U+1F87,
  /// U+1F90-U+1F97, U+1FA0-U+1FA7, U+1FB3, U+1FC3, U+1FF3) have a two-character full uppercase and
  /// stay unfolded, where NTFS folds them: a narrow residual in the leak direction. (iii) A letter
  /// whose uppercase is another letter's capital folds to it (`ı`, `ſ`, `µ`, `ς`, the Greek symbol
  /// letters such as `ϐ`, the titlecase digraphs such as `ǅ`), which the NTFS volume observed for
  /// this piece (2026-11-27, Windows 10) does not do: over-normalization, as (i).
  ```
  Each clause checked:
  - (i): the volume did not equate Cherokee (86) or Georgian (48).
  - (ii): the L list is exactly these 27 letters, and the volume equates each with its capital.
  - (iii): every letter named is in the not-equated list.
  - No code changes.

Evidence: none open.

Documentation (must be fixed before the merge)
- D1. In log.rs, T3's doc, after its M4 line, add: "RECORDED MUTATION M1 (2026-11-27, observed at f9496e56033038ab468ba3b92364aa17379535d7 on Windows by the build-gate reviewer, applied alone, the `permission::audit` tests run, reverted): `fold` is `c.to_ascii_uppercase()`, through which `is_inside` folds. OBSERVED FAILURE: the first assertion, `assertion failed: is_inside(Path::new("D:/maps/été/audit.jsonl"), Path::new("D:/maps/ÉTÉ"))`; the form did not predict it."
  - This adds lines. Is the count past 145? `git diff --numstat` decides, and over 145 is class 6 at the count (Amendment 1 item 12).
  - If it is, the same words belong in the closing amendment instead.
- D2. The subject of commit f13dbd87 says "one private map", but Amendment 1 pair 12 makes it crate-visible. The PR title or merge title should say "crate-visible".

Files: everything I used is in the scratchpad, <scratch>.
- The mutation logs, diffs, `run.sh` and `sub_once.pl` are in `mut\`.
- The full test log is `head-test.log`.
- The probes are `probe.ps1` and `probe3.py`, and `rs\g.rs` with `rs\pairs.txt`.
