Reviewed: PR #231 at e1fe3a83158a50eb13e4308ac5844ae67a75bc6f (base bc2a987f; gate 1, architect)
Verdict: PASS WITH NOTES. Branch and commit: cut/source-changed-watcher-visible @ e1fe3a83158a50eb13e4308ac5844ae67a75bc6f. There are no Correctness or Evidence findings. Four Documentation findings (D1 to D4) must be fixed in this PR before the merge, with no re-gate.

**What I could not run.** I have no shell, so I did not run `git fetch`, `gh pr view 231`, `git diff bc2a987f...e1fe3a83`, `--numstat`, the hash recomputations or the worktree status check. I confirmed the head by reading `.git/refs/heads/cut/source-changed-watcher-visible` and `.git/refs/remotes/origin/cut/source-changed-watcher-visible`: both hold e1fe3a83158a50eb13e4308ac5844ae67a75bc6f. I read the files at the head in C:/dev/wt/wv and the base files in C:/dev/spatial-ide (main at bc2a987f). Two things rest on other records and the reviewer: the file count and that no product path changed. The record for "no product path changed" is the round-2 custodian runs' Setup line: git found no exe source that differs between be6aa620 and the head.

**What I read.** All of the form, Amendments 4 to 1. The I2 consult. Both worker reports. Both custodian run records. The 2026-10-19 directive. The whole driver at the head. The base driver's layout, post-check header, dated-mutation comment and S5d block. README :226-245 at the head and at the base. Walkthrough :930-984 and :1511-1514. `engine/src/watch.rs` :140-274, :420-449 and :595-704. `kernel/src/lib.rs` :587-662. The quoted sources `engine/src/error.rs:378-386`, `App.tsx:727-733` and `formatRefusal.ts:106-112`. The PLAN node. ADR-018 :1-60. Template :100-178. AUTONOMY §22 and §31.

## Checks

**1. §1 to §8 at the head, with Amendments 2 to 4 read in.**
- **§1:** test, README and walkthrough only (rests on the runs record above).
- **§2.1:** the layout runs on every route (:752-767). `OPEN_PATH` is the junction (:269). Both copies are hashed at the end (:1449-1451). `requireWindows` is called at S3 :1016, post S4 :1087 and R4 :1365, each before its repoint.
- **§2.2:**
  - The post S3 is INFO, with the form's note (:1023). The S4 id is right (:1086).
  - The trigger, the 5 ms poll, the ladder and the bounds are unchanged (:703-717, :1106-1139).
  - After the ladder, S4 checks the resolved path and both hashes (:1150).
  - S5d's pass note is A.1 byte for byte (:1432-1433). The only change in its refusal-failure message is `touch` to `change` (:1426), checked against base :1274.
- **§2.3:** the R4 order matches the form (:1364-1384). R2 implements the human's 2026-10-19 R2 ruling, item 2 (:1333-1341).
- **§2.5:** the header note is A.4, plus Amendment 3 item 3's runtime-requirement sentence (:33-39). Two comments still describe the repoint as instant (D3).
- **§2.6:** the walkthrough rows match A.2. I checked N6's three quoted strings against `error.rs:382-384`, `App.tsx:731` and `formatRefusal.ts:109-110`; all match.
- **§3:** fixture-integrity passed in all 19 runs. The step counts in the runs table agree with this.
- **§4 and §5:**
  - P1 to P6 held, and no invalidator fired.
  - W-M1 to W-M7 each failed by the named message.
  - The W lines are only 0 because the capture worked: the reopen capture is shown live by W-M4's watcher line, and the post captures by their P lines.
- **§7:** the driver overrun (363 against 220) is recorded as class 8 and the §7 line is unedited, but the class-8 first-line words are missing (D4).
- **§8:**
  - The driver is pure ASCII: a non-ASCII search found 0 matches, and the same pattern found 16 in the README, so the search works.
  - The driver contains no `mklink` and no recursive delete; the only recursive calls are `mkdirSync`.
  - The dated comments are intact: head :648-654 equals base :490-496, and :1238-1276 is unchanged.
  - The S5d block is unchanged (head :1388-1397 against base :1236-1245).

**2. ADR-018 vocabulary.** These all hold:
- the driver: the bounds are labelled as bounds (:303-305), and :696 says "mechanism, not a claim";
- both runs records: "Ordering evidence only: no gap and no duration";
- Amendment 3 item 8: "neither bounded nor measured";
- the walkthrough's estimate is labelled scheduling only.

The worker report's "about 46 s" is a test-suite wall time, given as the reason no hold was taken. It is not a claim about the product. No finding.

**3. Operation class.** Test-only, with no undo surface (ADR-006). The child process writes only `e2e/out/source-changed-link`. It is ended by closing its stdin, or killed only by its own PID (:401-417). It also carries a spawn timeout (:370). 19 of 19 runs show it exited with code 0.

**4. Seam to S5d's step 2 (§2.9, Amendment 3 item 8).** Step 2 inherits the following. These notes are for S5d's amendment, not findings here.
- (a) The trigger is unchanged. The request is written on the trigger (:707 → :396), and the child makes the repoint only after it reads the request (:342). The pan keeps running until `repoint` returns (:1110, `shouldStop`). So tiles can still mint against `a` after the trigger, and when the change lands is neither bounded nor measured.
- (b) S5d passed 5 of 8 in round 1 (unlink and create, H2 in 6 runs) and 2 of 8 in round 2 (in place). These are different mechanisms; step 2 cannot pool them.
- (c) All six round-2 FAILs show the same pattern:
  - the `tile-session-ended-source-changed` line comes before the `tile-stream-mint-refused 8:14` line;
  - there is one P line, with "0 in-flight stream(s) cancelled".
- (d) Because `logMintRefused` writes unconditionally (W5), a mint refused after the end is still logged. So S5d's second condition can fail on a refusal that comes after the end. S5d's block comment says "whichever route reaches it FIRST is the only one whose log lines this run can observe" (:1396); these runs contradict it, and S5d's failure message's "rather than landing on the POST-check route" is not established by them (W4, W6).
- (e) No run of this piece is INCONCLUSIVE: the outcome was IN PLACE, and P4 held.

**5. Amendment 3 item 2's reading of §8 items 4 and 12.** Sound.
- The tag is 0xA0000003, a mount point (:322), the same link type as `symlinkSync(.., "junction")` (:282).
- No privilege is requested: the child opens the existing junction with GENERIC_WRITE (:329). No other link type is used, and there is no `mklink`.
- No package, lockfile or tree change, per the worker reports; I could not run the diff.
- The runtime requirement is named in the header (:38-39), the README (:240) and the start-failure message (:774). That message also covers a machine where Add-Type is refused (for example, Constrained Language Mode).

**6. The consult's 1(c) against the code.** It holds.
- `arm` canonicalizes the path (watch.rs:605), so P is `targets/a` (or `b` after the reopen) (:613) and G is `source-changed-targets` (:675-682).
- No subtree is watched: bWatchSubtree is 0 (:264).
- Only names are compared (:430-437). The filters are FILE_NAME|SIZE|LAST_WRITE for P (:653-654) and DIR_NAME for G (:699).
- The junction is an entry of `out/`, which is above G, and nothing watches `out/`.
- Corroborated: no watcher line in any of the 15 unmutated runs. W-M4's mtime touch on `b` does produce one, which shows the watcher was armed and live.

## Correctness
None.

## Evidence
None blocking.

## Documentation (must fix in this PR before the merge; none of it is the human's wording; per §31(d) the worker applies these words with no re-gate, and the PR body lists them)

**D1. Driver :261, and README :240's parenthesis.** Both say the path exists at every instant ("so the open path exists at every instant"; "so the opened path exists at every instant"). That is the consult's R2, which it marked as a reading. The one case not shown is an open that lands inside the FSCTL itself. That is the timing-inside-one-call case of §31(c), so it does not block, but it must be named in the source comment.
- Driver :261, replace the parenthesis with: `(`FSCTL_SET_REPARSE_POINT`; the name is never deleted, and an open landing inside the FSCTL itself is the one case not shown: the 2026-10-19 probe and runs saw no open fail, and the I2 consult found no Windows document stating the rewrite is atomic)`
- README :240, replace the parenthesis with: `(`FSCTL_SET_REPARSE_POINT`; the junction's name is never deleted, and no open through it failed in the probe or the runs of 2026-10-19; an open landing inside the rewrite itself is not shown)`
- Clause check:
  - "the name is never deleted": `unlinkSync` (:278) is reached only from `layoutJunction` (:292), which runs once at :756, before the helper starts and before anything is opened. `repoint` (:421-433) only sends the FSCTL (:329-332).
  - "no open failed": the round-2 worker report's probe table (no failed stats, opens or reads) and P4 of the round-2 runs.
  - "no document": attributed to the consult's 1(a) R2.

**D2. Driver :262.** "no link-making tool" is inaccurate: the child writes the link's reparse data.
- Replace that phrase with: `no `mklink``
- Clause check: the driver contains no `mklink`.

**D3. Driver :174-176 and :1090-1091.** "mutating the instant it appears" (:174) and "the instant a NEW one appears" (:1091) still describe the repoint as instant. Amendment 3 item 3 changed the same wording in §2.2; these two comments were missed. These are comment-only edits, so §8 item 3 is not affected.
- :174: `// that tile already passed. Polling for one and writing the repoint request the instant it appears is therefore`
- :175: `// mutating no earlier than "this tile's pre-check already passed"; the helper makes the repoint after it reads that request,`
- :176: `// and whether that lands before this tile's drain is not established here (S5d's race; ADR-018) -- the same use this driver already makes of `[render-trace]`
- :1090: `        // this file's header note for why that is the later, mint-confirmed signal) and requesting the repoint`
- :1091: `        // the instant a NEW one appears (the helper makes it after reading the request), instead of before the gesture at all.`
- Clause check: the request is written at :707 → :396. The child reads a line, then calls Set (:342). "Not established" is Amendment 3 item 8's statement, and the race is judged at S5d's step 2.

**D4. Record: append an Amendment 5, references only.**
- Amendment 4 lacks the class-8 first-line words.
- Amendment 2 item 1, Amendment 3's first line and Amendment 4's first line give sha256 references with no `@ <rev>` at a main commit (round 15 (e)).
- Amendment 3 was written after round 1's runs had been seen, and it changes claims (items 4 and 5). That makes it class 1, not class 3, and its first line does not say runs were seen (Header).
- W-M7 is not declared in the form.
- Draft:
  - First line: `*budget overrun, §7 not edited (class 8), and record corrections (class 3); written after round 2's runs and gate 1. References only.*`
  - 1. `frontends/shell/e2e/source-changed.mjs`: <final> against 220, by §7's command at <final head>; the reason is Amendment 3 items 1, 4 and 9.
  - 2. The sha256 references in Amendment 2 item 1, Amendment 3's first line and Amendment 4's first line are `@ <the main commit that adds each file>`.
  - 3. Amendment 3 was written after round 1's runs were seen (Amendment 2 item 1) and changes claims (its items 4 and 5): class 1.
  - 4. W-M7 is declared in the round-2 worker report, before the runs. W-M6 was applied without removing the answer check. The answer check's non-`ok` branch is observed only in that report's error test, on bf527c1e's bytes.
  - 5. Amendment 3 item 1's "exists at every instant" is the consult's R2, a reading. Its evidence is the round-2 worker report's probe and P4 of the round-2 runs.

## Notes (no action in this PR)
- **N1.** Off Windows, `layoutJunction` (:285-293) runs before any guard, and `symlinkSync(.., "junction")` makes a symlink there. This was already true of the pre route at the base (base :596-610) and now applies to every route. Nothing reaches it, because the suites do not run off Windows (§2.8). A later Portability item can name it.
- **N2.** At :1050 the ternary `ROUTE !== "post" ? … : 2` sits inside a branch that only runs when the route is not "post", so it always takes the first arm. The round-1 worker report already discloses it (difference 1).
- **N3.** The step id `R2-successful-reopen-clears-and-identifies` is kept, although after the human's R2 ruling R2 no longer asserts that the hover shows an id. It is left unchanged for the sweeps that read it (§0.3).

Paths: C:\dev\wt\wv\frontends\shell\e2e\source-changed.mjs, C:\dev\wt\wv\frontends\shell\e2e\README.md, C:\dev\wt\wv\frontends\shell\SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md, C:\dev\wt\wv\state\consults\2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md, C:\dev\wt\wv\state\consults\2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-worker-report.md
