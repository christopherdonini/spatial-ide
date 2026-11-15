Reviewed: PR #316 at 4e9984fc94f1f08cbce7f84bd11ebc8c41add001 (base 5b5fb0a3) (the custodian's filing note, 2026-11-14: the gate, the reviewer, attempt 1, the five-line form's single reviewer gate, PLAN node known-limitations-item-47-name-floor-sentence, the docs lane; its brief by file (7561 bytes, sha256 1f8214c923f1e3d19dd2538d42dfb1c7bdf54bc55877ec619bd17b80ef2b7d0a); the run 00:01:02Z to 00:21:08Z by its transcript, 43 calls (Bash 35, Read 4, Grep 3, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; each run it claims has a call behind it (verify-cites #24, verify-quotes in a hold #27, the path scan #24 to #26, gh pr checks #33, the pins #16, the cmp checks #11 to #13 and #17); below, the hand-back byte for byte (with one final newline, 13430 bytes, sha256 761c3e20f608838092a74fe0d3d7fa0482f5e87c8e918dc3e932a8f861705387), whose scratch-folder paths the reviewer itself wrote as <S>. Nothing is changed. The brief's REPORT PATH line named this file under 2026-11-13, the custodian's error: it is filed under the gate's date, 2026-11-14, by date -u. Its N1 is the custodian's brief error: the path scan takes --range with a base and a head.)

Reviewed: PR #316 at 4e9984fc94f1f08cbce7f84bd11ebc8c41add001 (base 5b5fb0a3), the single reviewer gate
Branch: cut/known-limitations-item-47-name-floor-sentence @ 4e9984fc94f1f08cbce7f84bd11ebc8c41add001
Verdict: PASS WITH NOTES

There are no blocking findings: no Correctness, Evidence or Documentation finding blocks. The notes at the end ask for no change to the PR.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.

**Pre-checks**
- Brief sha256 `1f8214c923f1e3d19dd2538d42dfb1c7bdf54bc55877ec619bd17b80ef2b7d0a`, 7561 bytes. It matches.
- `git -C C:/dev/spatial-ide fetch -q origin` returned rc=0.
- Worktree `C:/dev/wt/kl47`: `git rev-parse HEAD` gave `4e9984fc94f1f08cbce7f84bd11ebc8c41add001`, and `git status --porcelain` printed nothing.
- The branch is 1 commit on base (`git rev-list --count` gave `1`, parent `5b5fb0a39c03d8caa0682efdb44d3d6dec562bca`).
- `origin/cut/known-limitations-item-47-name-floor-sentence` is `4e9984fc94f1f08cbce7f84bd11ebc8c41add001`.

**Form**
- sha256 `8bc8adf909f4d45fd4f0d7b31828ca35f837be4f00293b17de252118fb417faf`. It is the same at origin/main (d385ebc9) and in the worktree.
- Out-of-scope line, read first (§21d): "none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows". The diff bears this out: one .md file, no code. No §21a category is touched.
- §21c budget: 2 insertions + 1 deletion = 3 changed lines, which is within the "<= 3" declared. 1 file.

**Authority line pins**
I recomputed these with `git show 8c693657801fd4168b078a601724bdacd9f479b8:<path> | sed -n '<n>p' | sha256sum`:
- directive :33 gives `0c7eca9a9f645a7b64d6c0ed01fd617e0945959a4d37b21649b9e63300b59399`
- directive :35 gives `55eda56a61c43653d89768668393f23cca6096c2d7af0228b902daeecbb6c4a8`
- consult :17 gives `9a3c30d3c27678f66e8f7f3dcf601253b85a6bd1eac36e683f25089923469330`

All three equal the form's values. The same hashes hold at base and at head for :33 and :17.

**1. The diff** — `git diff --numstat 5b5fb0a3… 4e9984fc…` printed:
```
2	1	KNOWN-LIMITATIONS.md
```
- `git diff -U0` shows one hunk, `@@ -454 +454,2 @@`. It is in `<S>/kl47r-diff.txt`.
- Byte checks on the exported files:
  - Lines 1–453 of base and head: `cmp` rc=0.
  - Base 455..end against head 456..end: `cmp` rc=0.
  - Head line 454 against (base line 454 without LF) + one space + §A's sentence + LF: `cmp` rc=0.
- The file is LF only: `grep -c $'\r'` gave `0`.
- Result: KNOWN-LIMITATIONS.md alone, 2/1, with no other byte changed. **True.**

**2. The sentence**
- §A's fenced line against the text of consult line 17 after its first 4 bytes (`  > `, confirmed by `od -c`): `cmp` rc=0. That sentence also equals the added text on head line 454 (check 1).
- The sentence is: "Your login name and this computer's name are searched for only when each is at least 3 bytes long, so a shorter one, such as a two-letter computer name, is never searched for, and a bundle that contains it is not refused."
- Directive line 33 reads: "7. The redaction name floor: (A), the sentence added to the end of item 47, my words by approval. Docs lane."
- So line 33 approves the consult's option (A) as the human's words by approval, to go at the end of item 47, in the docs lane. It does not reproduce the text; the text is the consult's line 17.
- The sentence is the human's wording.

**3. The comment**
- I substituted the four pins with sed into §B's line (form line 24), as `kernel/src/bundle/redaction.rs:131 @ 5b5fb0a39c03d8caa0682efdb44d3d6dec562bca sha256:3e07…`, `:148-150 @ … sha256:6905…`, `:158 @ … sha256:5251…` and `:166 @ … sha256:9930…`.
- That result against head line 455: `cmp` rc=0. The line starts with four spaces (`od -c`), no `<P` is left, and each pin is contiguous on one line.
- List structure: the comment sits directly after the item's last indented paragraph line, with no blank line between. Item 46 has the same shape: line 444 is its indented paragraph, line 445 is `    <!-- Approved as drafted by the human (state/directives/2026-10-20-232-…`, and line 446 is blank. Item 45 has it at lines 440–441.
- Head line 456 stays blank and line 457 is the existing column-0 comment before item 51. The list item is not broken. **True.**

**4. The four pins** — `git show 5b5fb0a3…:kernel/src/bundle/redaction.rs | sed -n '<a>,<b>p' | sha256sum`. I also recomputed each at 8c693657, with the same result; `git diff --stat 8c693657 5b5fb0a3 -- redaction.rs` is empty.

- **P1** (line 131) gives `3e07633eaf36f735f565535e85fd0d3cf388699cb565d578f051cf40142b4e53`:
  `                if v.len() >= 3 && !usernames.contains(&v) {`
- **P2** (lines 148-150) gives `69050030eb8b5593cfb174538acf281981103187375d329469057388bdc8401e`:
  ```
  /// The hostnames to scan for: `COMPUTERNAME` and `HOSTNAME` from `env` when they give a name of at
  /// least 3 bytes; only when neither does, the machine's own name from `os`, trimmed, under the same
  /// floor. The OS name is a fallback and never an extra name, so there are at most two hostnames.
  ```
- **P3** (line 158) gives `5251aeb64b210131178fa88d582f67b4d8e80eb07c3581658412b9586236298d`:
  `            if v.len() >= 3 && !hostnames.contains(&v) {`
- **P4** (line 166) gives `993091ebbb7abfde9d9c7b80edd730c59be254bf333def951008d0d0c6dfc7f0`:
  `            if v.len() >= 3 {`

All four equal the comment's hashes and §C's. **True.**

**5. Each clause against the code at base**
The file is unchanged at head (`cmp` rc=0).

How the product reaches this code:
- `kernel/src/publish/mod.rs:973` `    let machine = MachineIdentifiers {`
- `kernel/src/publish/mod.rs:978` `        ..MachineIdentifiers::from_environment()`
- `kernel/src/publish/mod.rs:980` `    if let Some((file, found)) = redaction::first_undeclared_findings(`

These lines are inside `pub(crate) fn publish_prepared` (line 645), which the shell's guarded publish goes through. That function refuses with `PublishError::RedactionFinding` on any non-declared finding.

What "bytes" counts: `v` is a Rust `String` (`std::env::var`'s `Ok`, or `String` from `os()`), so `v.len()` is its UTF-8 byte length, not a character count. `>= 3` makes 3 inclusive. The sentence's "at least 3 bytes" matches both points.

- **(a) Login names are searched for only when at least 3 bytes long. TRUE.**
  - `kernel/src/bundle/redaction.rs:129` `        for key in ["USERNAME", "USER", "LOGNAME"] {`
  - `kernel/src/bundle/redaction.rs:131` `                if v.len() >= 3 && !usernames.contains(&v) {`
  - `kernel/src/bundle/redaction.rs:314` `    for u in &machine.usernames {`
  - The search loops only over the names kept at :131.
- **(b) The same floor holds for computer names. TRUE.**
  - `kernel/src/bundle/redaction.rs:136` `        let hostnames = hostnames_from(|key| std::env::var(key).ok(), os_hostname);`
  - `kernel/src/bundle/redaction.rs:156` `    for key in ["COMPUTERNAME", "HOSTNAME"] {`
  - `kernel/src/bundle/redaction.rs:158` `            if v.len() >= 3 && !hostnames.contains(&v) {`
  - `kernel/src/bundle/redaction.rs:165` `            let v = v.trim().to_string();`
  - `kernel/src/bundle/redaction.rs:166` `            if v.len() >= 3 {`
  - `kernel/src/bundle/redaction.rs:327` `    for h in &machine.hostnames {`
  - A test also covers the OS fallback floor: `kernel/src/bundle/redaction.rs:691` `            hostnames_from(no_env, || Some("vm\n".into())).is_empty(),`, in `the_os_hostname_is_taken_only_when_the_environment_names_none`.
- **(c) A shorter name, such as a two-letter computer name, is never searched for. TRUE**, judged at what an operator can observe (§31c).
  - A name under 3 bytes is never pushed (:131, :158, :166), and `scan` searches only `machine.usernames`/`machine.hostnames` (:314, :327).
  - No other product caller adds names. `git grep` at base shows `MachineIdentifiers` built only in `kernel/src/publish/mod.rs:973`, `kernel/src/permission/audit/log.rs:249` (the audit log, not a publish refusal), the viewer's `renderer/bundle-viewer/scripts/scan-dist.rs:20` (`MachineIdentifiers::default()`, no names) and tests.
  - Edge case, which needs no change: an ASCII two-letter name is 2 bytes and is not searched. A two-letter name in non-ASCII letters is 3 or more bytes, so the search loop does run on it. But `in_printable_run` (`kernel/src/bundle/redaction.rs:218` `    let printable = |b: u8| (0x20..=0x7e).contains(&b);`, :219) rejects any match containing a non-ASCII byte, so such a name can never produce a finding. The operator sees no difference, and item 47's existing 12-character sentence already covers it.
- **(d) So a bundle that contains it is not refused. TRUE**, on the sentence's causal reading.
  - The only refusal for a name is a finding from :314–339, and a short name is never in those lists.
  - A bundle holding a short name together with another match (a path, a credential) is still refused, for that other match. Item 47's earlier lines state those refusals. This is a literal-reading note only, not a finding.

**6. Readiness** (tools at HEAD 4e9984fc; the scripts are unchanged by the PR)
- `node scripts/plan/verify-cites.mjs` gave **rc=0**: "verify:cites PASS — every rooted (in-tree) path:line reference across 2983 file(s) resolves. (193 loose reference(s) advised above.)"
- `node scripts/plan/verify-quotes.mjs`, run inside `hold shared -Project SpatialIDE` (granted; released with `MACHINE_RELEASED`), gave **rc=0** (the background task reported exit code 0): "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 927 ruling cites resolved, 0 ruling-cite errors." The two hash-baselined lines are pre-existing, in `governance/forms/engine/LOD-PREREGISTRATION.md`.
- `node scripts/hooks/profile-path-scan.mjs --range 5b5fb0a3….. HEAD` gave **rc=2**: `profile-path-scan: range not computable` / `aborted`.
  - The script does take `--range`, but as two arguments (`--range <base> <head>`, its line 12; `cmdRange` requires `rangeArgs.length !== 2` to be false).
  - The two-argument form, `node scripts/hooks/profile-path-scan.mjs --range 5b5fb0a3… HEAD`, gave **rc=0**: `profile-path-scan: range read 1 commits, 2 added lines, 0 path names` / `profile-path-scan: clean`.
- `gh pr checks 316`, read between 2026-11-14T00:12:36Z and 00:12:38Z, rc=0:
  ```
  every commit is signed off	pass	10s	…/runs/43530665064/job/132247231835
  no profile path in the range	pass	12s	…/runs/43530665062/job/132247230947
  ported-notices	pass	9s	…/runs/43526473475/job/132233367568
  ported-notices	pass	8s	…/runs/43530665391/job/132247233002
  ```
  - 4 checks, all pass, none pending.
  - Governance CI did not run: its `pull_request.paths` (`.github/workflows/governance-ci.yml:101-118`) does not list `KNOWN-LIMITATIONS.md`. The local verify-cites and verify-quotes runs above stand in for it.

**7. The worker's departure**
- File times: `<S>/kl47-build-try1.out` mtime 23:11:15.8Z, then `<S>/kl47-build.mjs` 23:11:30.9Z and `<S>/kl47-build.out` 23:11:31.7Z.
- try1 printed `sentence size 221 sha256 a7f03826…` then `STOP: form §A`.
- The worker's transcript holds the edit:
  ```
  sed -i 's/startsWith(\"### §A\\.\")/startsWith(\"### \") \\&\\& x.includes(\"A. The sentence\")/; s/startsWith(\"### §B\\.\")/startsWith(\"### \") \\&\\& x.includes(\"B. The source comment\")/' $S/kl47-build.mjs
  ```
- It changed only the two heading-match expressions (script lines 29 and 81 as they now read).
  - The cause: the script decodes the UTF-8 form as latin1, so `§` (C2 A7) reads as `Â§` and the old `startsWith("### §A.")` could not match.
  - The die strings `"form §A"` (line 30) and `"form §B fence"` (line 85) still carry `§`. This confirms the sed was not a global substitution.
  - Nothing else in the script was touched: the pin table, the substitutions, the splice at lines 94–101 and the printable-byte check at 103 all match what produced `kl47-build.out`.
- The result does not depend on the change beyond finding the two blocks.
  - Each heading has one match.
  - The script still dies if §A's line differs from consult line 17 (line 35), if the fence is wrong (34, 85), if the indent is wrong (86), or if a placeholder is left (88).
  - Checks 1–4 above verify the output bytes independently of the script.
- Finding (not blocking; process, not code): the departure from "scripts are written with the Write tool" is real but harmless to the result.

**Notes** (none blocking; no change asked of the PR)
- N1 (evidence, about the brief, not the PR): the brief's `--range <base>..HEAD` form aborts with rc=2. The script's interface is `--range <base> <head>`, and that form passes (check 6).
- N2 (wording, observation only): clause (d) reads as causal ("not refused for it"). A bundle that also holds another match is refused for that match, as item 47 already says. This is the human's wording; I give no replacement words, and none are needed.
- N3 (wording, observation only): a two-letter computer name in non-ASCII letters is 3 or more UTF-8 bytes and is searched for, but it cannot produce a finding (:218–219). This cannot be observed in the app, so it does not block.

Scratch outputs are under `<S>`: kl47r-diff.txt, kl47r-cites.out, kl47r-quotes.out, kl47r-checks.out, kl47r-base.md, kl47r-head.md, kl47r-redaction.rs.
