*Custodian's filing note (2026-11-12): the docs lane's worker's report on adr-035-close-races-note, given in its hand-back. Dispatched at 23:45:48Z on 2026-11-11 by its transcript; the hand-back came at 00:16:56Z on 2026-11-12 (claude-sonnet-5-5, a fresh worker; no compaction; unique calls from that dispatch: Read 2, Bash 32, Write 3, the hand-back, 38 in all). One call errored: a Bash call that began with a wait of its own, which the harness blocked. No call went inside a hold, as its brief called all its work light; its cite-and-quote checker runs were one node process each. The report below was extracted by script from the hand-back in that transcript (5143 bytes, sha256 458b7e47ecde3ac63ddc99c15436e2e8ebeb63aac47c2b58e2d32bd7fc815c4c). It is unchanged except in one line, the sign-off line that git commit -s added to its commit message, which carries the account email: that line is replaced by a bracketed line saying so. One final newline is added. E11, the PR's CI, is the custodian's: on PR #308 at 1700ac8c, all 8 checks pass, read 00:27:52Z.*

---

Built: adr-035-close-races-note at 1700ac8c13cbe4ade821a66165ce5f62bd833fab (pushed, ls-remote equals H, worktree clean on its branch). E1–E10 and E12–E15 all passed; E11 (PR CI) is yours.

**Where checks.**
- HEAD at start was 7693001e126b526d1c98f2ce79c529c5e058f0d7, which is B.
- Branch is cut/adr-035-close-races-note.
- `git status --porcelain` was empty and the remote ref was absent.
- D1 and D2 at B equal D1 and D2 at C byte for byte (`cmp` rc=0 for both).
- P1 at B has no CR, ends in one LF, and has no blank last line (CR false, last byte 10, previous byte 46).
- `verify-quotes` at B (output in `a35-quotes-B.txt`): `155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined)`.

**Quotes baseline rerun.** My first background `verify-quotes` run overlapped the append, so I killed it. I then restored P1 to B (a copy of the appended file is in `a35-p1-H.bin`) and re-ran the baseline on the clean tree. I put the appended bytes back afterwards. `cmp` of (B + `a35-note.bin`) against the saved appended file gave rc=0, and `git diff --name-only` named P1 only.

**§2.1 script.**
- File: `a35-assemble.mjs`, sha256 e8e6a43483c37be54fa397e2cc016f8078743a6de8037db277da5d353e1f427f. I wrote it and ran it once; it was not re-run.
- Output: checks 1–6 all PASS, then `bytes=1450 lf=8 sha256=d26bcec60460367931426f6df1d574e3bc07b937456c68ba1153070f7e1c9197` and `appended to P1`.
- Route: the script's own append wrote the bytes. No guard refused it, so the Edit fallback was not used.
- N by the independent `git show | sed -n '11,15p;17p' | wc -c` derivation: 1450.

**Commit.**
- Hash: 1700ac8c13cbe4ade821a66165ce5f62bd833fab.
- `git diff --numstat B...H`: `8	0	docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`.
- `git log -1 --format=%B`:
  ```
  docs: ADR-035's appended note in the human's words: what kernel-generation-close-races makes historical

  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01JeU7h98xrTorztiep3Zgmg
  [One line is elided here by the custodian: the sign-off line that git commit -s added, which carries the account email.]
  ```
  `-s` added the Signed-off-by line, and git put the account email in it. I typed no sign-off and the message file holds no email.

**Evidence at H.** All scripts ran from the tree at B; `verify-quotes` also ran at H.
- **E1, E2, E3, E4, E15** (`a35-e1234.mjs H`, rc=0):
  - E1: `8	0	docs/adr/ADR-035-...md`.
  - E2: B is a prefix of H; B=28260 bytes, H=29710 bytes.
  - E3: no CR and one final LF, at B and at H.
  - E4: the appended 1450 bytes equal an independent re-assembly from D1 and D2 at C, and equal `a35-note.bin`.
  - E15: H minus B is 1450, and `sed | wc -c` recomputed at H gives N=1450.
- **E5:** `verify-quotes` at H exits 0 with the identical summary line as at B (155 / 124 / 30 / 1 advisory). `diff` of the full B and H outputs has rc=0, so there is no movement in the counts. The Where-check output carries no flagged passage from the note, because the diff is empty.
- **E6:** `verify-cites` rc=0, "every rooted (in-tree) path:line reference across 2860 file(s) resolves".
- **E7:** `verify-test-claims` rc=0 ("all 793 claimed test(s)... exist or are planned, superseded or withdrawn"). `verify.mjs` rc=0 ("verify:plan PASS").
- **E8:** `npm run verify:adr-index` in `frontends/shell` rc=0, "PASS -- 34 ADRs, index in docs/README.md matches every Status line".
- **E9:** `queue.mjs --check` rc=0 ("current"). `site.mjs --check` rc=0 ("site/ is current").
- **E10:** `node --test` over the three globs, rc=0: 598 tests, 598 pass, 0 fail.
- **E12:** `gh pr view 136 --json mergedAt,mergeCommit` gave `{"mergeCommit":{"oid":"74a9b24bf802a5bc4792051282a1b4c9bd9acec8"},"mergedAt":"2026-09-28T18:15:11Z"}`. M = 74a9b24bf802a5bc4792051282a1b4c9bd9acec8.
- **E13** (`a35-e13.mjs`, rc=0, nothing classified). Lines matching `live.insert(` or `SessionRef::mint()` under `kernel/src`:
  - At M, all in `kernel/src/skp.rs`: 533, 1164, 1176, 2725, 2907, 2981, 3441, 3567.
  - At B, all in `kernel/src/skp.rs`: 583 (`st.live.insert(dataset.to_string(), (g, session));`), 1270, 1312, 3616, 3828, 3919, 4137, 4646, 4772.
  - The lines at M and B are shown with their text in `a35-e13-out.txt`.
- **E14:** `git diff --name-only M^1 M -- protocol/` is empty (0 bytes).

**Push.** `git push -u origin cut/adr-035-close-races-note` ran alone and created the new branch. `git ls-remote` gave `1700ac8c13cbe4ade821a66165ce5f62bd833fab refs/heads/cut/adr-035-close-races-note`, equal to H.

**Pre-gate self-check.**
- Seams: no code seam; text-only append, assembled from D1 and D2 as they are at C.
- Completion claims: each points to an output file in the scratch folder.
- User-facing messages: none.
- Tests reach their assertion: not applicable, no tests added; the E scripts assert directly.

**Off-scope noticed, not done.** Nothing found that I left undone.

**Process.**
- Model: Sonnet 5.5 (claude-sonnet-5-5).
- No model override and no context handoff.
- No background process of mine is still running.
- All scratch files are in the folder that holds the brief, named `a35-*`.
