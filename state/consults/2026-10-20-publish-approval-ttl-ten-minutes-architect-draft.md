*Custodian's filing note (2026-10-20): the architect's draft of the five-line form for `publish-approval-ttl-ten-minutes` (the human's ruling headed 2026-10-21, item 6, graded S3), read only at main 0f0f55cf2bb769961c621281e79353a071b3f079. The run 2026-10-20T17:06:21Z to 17:17:39Z by its transcript (Read 40, Grep 54, Glob 2); its one SubagentHandback call, at 17:17:38Z. The custodian checked its quoted phrases and the facts its route rests on against main by script. Under AUTONOMY.md §25 (e) the form is not committed while its Out-of-scope line names a §21a category as touched; it waits for the human's OPEN-1 and OPEN-2. Extracted by script; nothing changed.*

---

Drafted: publish-approval-ttl-ten-minutes, its five-line form, at main 0f0f55cf

I read every repo `path:line` below at main 0f0f55cf. I have no shell, so no cite carries a sha256. Before committing, the custodian expands each `@ 0f0f55cf` to the full commit id and fills in its hash by script. No line cite goes into `DECISIONS-PENDING.md`. Rulings are cited by directive path and item. Nothing below is quoted from the human except the reuse output, which is byte-copied from the brief.

---

# Publish: PENDING_ATTEMPT_TTL becomes 10 minutes, and the approval dialog states the expiry in one P6-placeholder sentence — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. This form is append-only once committed. An amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node publish-approval-ttl-ten-minutes; it depends on shell-migration-milestone-3, which is done. Drafted by the architect at main 0f0f55cf. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. The drafter had no shell: before commit, the custodian expands each `@ 0f0f55cf` and fills its sha256 by script. Form path: `frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md`. The custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file. The piece is not dispatched until OPEN-1 (the route) and OPEN-2 (ADR-024's note) are ruled. The lines below are written for OPEN-1 (A); §6 says what changes under (B) or (C).*

```
Authority: PLAN node publish-approval-ttl-ten-minutes; the human's ruling headed 2026-10-21, item 6 (state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md:25 @ 0f0f55cf), with its RULED block in DECISIONS-PENDING.md; the same directive's item 2a for the sight list; the unknown-attempt node's record (frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md, Amendments 9 and 10) and the architect's diagnosis (state/consults/2026-10-20-publish-approval-unknown-attempt-f4-diagnosis-architect.md, items 2 and 4); the machine rules (state/directives/2026-10-06-machine-script-adopted.md) for every heavy run. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for approval expiry ttl, `No prior art recorded for "approval expiry ttl". Research it before planning an implementation.` and, for pending attempt timeout dialog, `No prior art recorded for "pending attempt timeout dialog". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: frontends/shell/src-tauri/src/publish.rs (the value at publish.rs:68 @ 0f0f55cf, written Duration::from_secs(600); at most 2 doc lines in publish.rs:62-67 @ 0f0f55cf; one new test after publish.rs:1793-1821 @ 0f0f55cf; <= 35); frontends/shell/src/publish/PublishDialog.tsx (the sentence, its source comment, one paragraph in the confirming block after PublishDialog.tsx:270-272 @ 0f0f55cf; the number dropped from the comment at PublishDialog.tsx:211-214 @ 0f0f55cf; <= 15); frontends/shell/src/publish/PublishDialog.test.ts (D1, D2 and their imports; <= 30); frontends/shell/e2e/exportElapsed.test.mjs (exportElapsed.test.mjs:11 and :18 @ 0f0f55cf; <= 4); frontends/shell/e2e/publish.mjs (the TTL read kept at publish.mjs:610 @ 0f0f55cf; EXPIRED''s comment and note, publish.mjs:620-635 @ 0f0f55cf; <= 12); frontends/shell/e2e/README.md (the publish suite entry only, README.md:213-215 @ 0f0f55cf; <= 4); frontends/shell/MANUAL-WALKTHROUGH.md (Part G only: G3, MANUAL-WALKTHROUGH.md:326 @ 0f0f55cf, and the EXPIRED' coverage row, :394 @ 0f0f55cf; <= 4); docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md (one appended note in the human's words after ADR-024:296-298 @ 0f0f55cf, nothing above it edited; <= 6); this form; 8 files besides this form; declared line budget <= 120 changed lines by §21c's counting (insertions plus deletions, this form excluded; estimate about 100), counted by git diff --numstat origin/main...HEAD -- . ':(exclude)frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md' with columns 1 and 2 summed, and per file by the same command with the file's path; no PLAN or generated file on the branch.
Change: PENDING_ATTEMPT_TTL becomes 600 s, so a prepared publish attempt and the grant minted with it expire 10 minutes after the prepare instead of 2. While the approval dialog asks for the typed phrase, it shows one P6-placeholder sentence (§1): the approval expires after 10 minutes, and the publish then has to be started over. There is no countdown. The comments, the e2e skip note, the README's publish entry and walkthrough Part G stop stating 120 s, and ADR-024 gains the human's dated note.
Tests+mutation: changed T1 in frontends/shell/e2e/exportElapsed.test.mjs (TTL 600_000, named `T1 the TTL read from the real publish.rs is 600000 ms`), mutation M1, publish.rs's 600 set back to 120, fails it by name; new Rust test `a_pending_attempt_121s_old_is_still_taken_within_the_ttl` (publish.rs tests; created_at backdated 121 s; take returns the attempt), mutation M2, the same 600 -> 120, fails it by name; new vitest `D1 renders the approval-expiry sentence verbatim while the dialog asks for the phrase` (PublishDialog.test.ts, renderToStaticMarkup, the placeholder's literal text, after the instruction), mutation M3, the sentence's paragraph deleted from PublishDialog.tsx, fails it by name; new vitest `D2 the expiry sentence's minutes are PENDING_ATTEMPT_TTL's, read from publish.rs` (the pattern of PublishPanel.test.ts:222-229 @ 0f0f55cf), mutation M4, publish.rs's 600 set to 300 alone, fails it by name. Each mutation is observed by applying it alone at the final code commit, running the named test, recording its failure by name with that commit id, and reverting it (round 25, item 2 (c)). Existing tests stay unchanged and green (§3). E1, the custodian's e2e at the head (§3).
Out-of-scope: wire: not touched — no SKP or MCP surface; binding_publish_prepare and binding_publish_execute keep their arguments and outcomes, and PublishPromptData gains no field. Security, by §21a's letter (what ADR-020, ADR-009 or ADR-021 governs): not touched; the grant lifetime this changes belongs to the class-3 boundary (ADR-017, ADR-024), stays under MAX_GRANT_LIFETIME (§0 F2), and widens the window of ADR-024's stated in-page-script limitation (§0 F9) from 2 to 10 minutes, which the architect gate reads. ADR: touched — ADR-024 (Proposed) gains one appended note in the human's words (OPEN-2), and its status line is not edited. Guarantee: touched — PENDING_ATTEMPT_TTL is a declared ceiling (ADR-010 rule 6) whose value T1 asserts; single use, expiry past the TTL, and the one lifetime shared by grant and attempt are unchanged. §21c's "no new user-visible behaviour" is crossed (one new dialog sentence; a longer expiry). The five-line form with reviewer and architect from dispatch stands by the human's ruling on OPEN-1, recorded as setting round 25, item 2 (e) aside for this piece. No dependency, no exposure surface, no countdown, and no other string the app shows.
```

## §0. The code as read (main 0f0f55cf)

- **F1.** The TTL is a declared bound on a prepared attempt, 120 s: publish.rs:62-68 @ 0f0f55cf.
- **F2.** The grant minted beside the attempt takes the same lifetime: publish.rs:587-598 @ 0f0f55cf (the lifetime argument is at :595-597).
  - MAX_GRANT_LIFETIME is 20 minutes: kernel/src/permission/grant.rs:216-221 @ 0f0f55cf. A lifetime above it is refused: kernel/src/permission/grant.rs:266-271 @ 0f0f55cf.
  - 600 s is under that ceiling, so the prepare's mint does not refuse.
- **F3.** How an attempt expires:
  - The sweep on insert: publish.rs:207-214 @ 0f0f55cf.
  - `take` returns nothing past the TTL: publish.rs:216-225 @ 0f0f55cf.
  - A miss answers UnknownAttempt: publish.rs:725-727 @ 0f0f55cf.
  - A grant that has expired when the attempt is taken is refused by the boundary's re-check: kernel/src/permission/boundary.rs:409-419 @ 0f0f55cf.
- **F4.** The attempt's clock starts at the stash, at the end of the host's prepare. The grant is minted a moment earlier, and grant_remaining_s is read in between: publish.rs:606 @ 0f0f55cf and publish.rs:643-661 @ 0f0f55cf.
- **F5.** The dialog:
  - It shows a static grant-remaining figure, the number the host sent: PublishDialog.tsx:244-250 @ 0f0f55cf.
  - The confirming block: PublishDialog.tsx:268-299 @ 0f0f55cf.
  - It closes on any outcome: PublishDialog.tsx:67-68 @ 0f0f55cf.
  - Every click makes a fresh attempt and a fresh dialog: PublishDialog.tsx:163-168 @ 0f0f55cf.
  - The abandon comment names 120s: PublishDialog.tsx:211-214 @ 0f0f55cf.
- **F6.** After an expiry, the panel's refusal for `unknown-attempt` ends by telling the operator to start over: PublishPanel.tsx:305-312 @ 0f0f55cf. An operator's `unknown-attempt` comes only from the host (the diagnosis, item 2).
- **F7.** How the e2e side reads the TTL:
  - The helper reads it with a regex that needs the literal `Duration::from_secs(<digits>)` form: frontends/shell/e2e/exportElapsed.mjs:16-22 @ 0f0f55cf.
  - T1 pins the value: frontends/shell/e2e/exportElapsed.test.mjs:11 @ 0f0f55cf and :18-20 @ 0f0f55cf.
  - Both suites print it: frontends/shell/e2e/publish.mjs:610 @ 0f0f55cf and frontends/shell/e2e/selection.mjs:839 @ 0f0f55cf.
- **F8.** A precedent for a JS copy pinned against publish.rs: frontends/shell/src/publish/PublishPanel.test.ts:222-229 @ 0f0f55cf.
- **F9.** ADR-024, which is Proposed:
  - It states 120 s as the declared ceiling: ADR-024:88-89 @ 0f0f55cf.
  - It states that DOM approval proves nothing against an in-page script: ADR-024:166-172 @ 0f0f55cf.

The reuse index, byte for byte from the brief:

```text
$ node tools/reuse.mjs approval expiry ttl
No prior art recorded for "approval expiry ttl". Research it before planning an implementation.
$ node tools/reuse.mjs pending attempt timeout dialog
No prior art recorded for "pending attempt timeout dialog". Research it before planning an implementation.
```

## §1. The sentence: a P6 placeholder

- **Words (the placeholder; the human's at P6):** This approval expires after 10 minutes, and the publish then has to be started over.
- **Where it renders:** one `<p className="publish-dialog-expiry">` inside the confirming block, directly after the instruction paragraph. It does not render in the executing view: the attempt has been taken by then, and no expiry applies.
- **Where the words live:** the minutes are an exported constant (APPROVAL_EXPIRY_MINUTES = 10), and the sentence is an exported constant built from it. D2 pins the minutes against publish.rs. D1 pins the literal words.
- **Clause check against the code:**
  - "This approval expires after 10 minutes": true. The attempt is taken only while its age is within 600 s (F3), and its grant has the same 600 s (F2).
    - Named for the source comment, and not blocking (AUTONOMY.md §31 item c): the clock starts at the stash, before the dialog mounts (F4). The gap is inside one request round trip.
    - Also named: the grant is minted a moment before the stash, so a Submit in the last instant can be refused on the grant (F3) rather than as `unknown-attempt`. Both are refusals.
  - "and the publish then has to be started over": true. After the expiry, Submit gets `unknown-attempt` or a grant refusal (F3). The dialog closes (F5), the panel tells the operator to start over (F6), and only a new Publish click makes a new attempt (F5). Nothing restarts it automatically.
  - The sentence does not say the dialog closes at the expiry, and it does not: it stays open until Submit or Cancel.
- **No countdown:** the piece adds no timer and no time-driven state. The existing static grant-remaining figure (F5) stays as it is. That figure reads about 599 s, because `as_secs` rounds down.
- **Whose words:** strings the app shows stay under P6 (AUTONOMY.md:544 @ 0f0f55cf, §31 item f). This is not a §31 wording-block sentence.
- **The sight joins the list:** at the merge, the custodian's PLAN commit on main appends one entry to operator-sitting-queue's summary: "the publish dialog's expiry sentence (publish-approval-ttl-ten-minutes, P6 placeholder), read at walkthrough Part G, G3". The node's generation goes up by one, and the closing amendment names that commit (item 2a of the ruling). G3's expected outcome carries the sentence in its place, so the sight has a step. No new walkthrough Part is added.

## §2. Places that state the present value

**Corrected in this piece.** Each would state an untrue limit after the change:

- publish.rs:68 (the value), written as `Duration::from_secs(600)` (F7).
- PublishDialog.tsx:211-214: "120s" is dropped and the constant is named.
- exportElapsed.test.mjs:11 and :18 (T1).
- publish.mjs:620-635:
  - the comment's "hardcoded 120s" and "sleeping 120 real seconds" become words with no number;
  - the printed note's "(120s, publish.rs)" takes the value already read at :610 (kept in a const);
  - "sleeping 120s" becomes "sleeping out the TTL".
- README.md:215: "without a 120s sleep." becomes "without sleeping out the whole TTL." This is not the human's wording.
- MANUAL-WALKTHROUGH.md:394:
  - "a hardcoded 120s constant" becomes "a hardcoded constant";
  - "a 120-second wait" becomes "a wait of the whole TTL".
- MANUAL-WALKTHROUGH.md:326 (G3): its "in this exact order" transcription would miss the new sentence. It gains the placeholder after the instruction.
- ADR-024:88-89: corrected by an appended note (OPEN-2), never edited in place.

**Stay as they are, and why:**

- These state no value; they read the constant:
  - exportElapsed.mjs;
  - publish.mjs:610 and selection.mjs:839;
  - README.md:222 and :763.
- publish.rs:1813 is relative (TTL + 1 s).
- These are fixture or stub data, not a claim about the TTL:
  - publish.rs:2493 (`grant_remaining_s: 120`, a stub that never renders);
  - PublishDialog.test.ts:41 and PublishPanel.test.ts:50;
  - the kernel audit fixtures.
- These are append-only or historical records, pinned:
  - the step-1 form (§0 F1, §2.1 T1);
  - PLAN.yaml:5460 (a done node's summary, the custodian's);
  - consults and gate reports.
- docs/09's "20 minutes" is the example grant, which is MAX_GRANT_LIFETIME, not this value.

## §3. Tests and runs

- **Commands, under the machine rules:**
  - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --lib a_pending_attempt_121s_old_is_still_taken_within_the_ttl -- --exact`
  - `npx vitest run src/publish/PublishDialog.test.ts -t "<name>"`
  - `npm run test:export-elapsed`
- **Unchanged and green:**
  - `a_pending_attempt_past_its_ttl_is_treated_as_unknown`, whose backdate becomes 601 s (named risk: see the unsettled list);
  - T2 to T4, whose figures stay within 600 000 ms, so they still read FAIL and INCONCLUSIVE as before, and M1 of step 1 still fails T2;
  - the dialog's existing render tests.
- **E1, the custodian's run.** `npm run e2e:publish`, once, with the exe built at the head, a fresh app and a shared hold. Expected:
  - the header line reads `PENDING_ATTEMPT_TTL 600000ms`;
  - OPEN, APPROVED', REFUSED' and FILTERED' pass;
  - EXPIRED' skips, and its note names 600s.
  - Lines are byte-copied by script.
- **Not covered by any run:** the sentence in the real app. publish.mjs never mounts the dialog (PublishDialog.tsx:181-185 @ 0f0f55cf). The operator's G3 sight is the only real-app check.
- **Block-on-sight:**
  1. Any timer, interval, animation frame or time-driven state added to PublishDialog.tsx.
  2. PENDING_ATTEMPT_TTL's line not in the literal `Duration::from_secs(<digits>)` form.
  3. A PublishPromptData field added, or any binding command's shape changed.
  4. The sentence rendered outside the confirming block, or more than one sentence.
  5. ADR-024 edited above its appended note, or its status line touched.
  6. A size overrun, which is class 6.

## §4. Overlap (rule 00)

- **S5d (a)** on cut/source-changed-s5d-inconclusive. Its paths are e2e/s5dVerdict.mjs and its test, package.json, e2e/source-changed.mjs, and README.md's post-route line in the source-changed entry. This piece touches none of them.
  - README.md's publish entry is a different suite entry, a disjoint path (state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md, item 3).
  - S5d reads publish.mjs and exportElapsed.test.mjs but edits neither.
- No PR is open. Neither piece touches protocol/.
- The proposed node publish-dev-hook-attempt-from-effect (PublishPanel.tsx, e2e-test-surface.ts) is not in progress and shares no path with this piece.
- This piece's heavy runs take a shared hold and never sit inside S5d's exclusive hold.

## §5. Gates

- Proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- Under OPEN-1 (A), the reviewer and the architect gate from dispatch.
  - The reviewer checks the Out-of-scope line first, runs the four tests, checks M1 to M4 against their commit ids and recomputes every hash.
  - The architect reads the grant-lifetime change against ADR-017's acceptance condition and ADR-024:166-172.
- Each gate blocks only on Correctness or Evidence.

## §6. OPEN items

- **OPEN-1, the route (the human's).** The analysis is in the report's route section.
  - (A) This form, with both gates from dispatch.
  - (B) This form with one reviewer, and ADR-024 removed from Scope (7 files).
  - (C) The full form from dispatch.
  - The architect recommends (A).
- **OPEN-2, ADR-024's note (red-line text; the human's typed words).**
  - Drafted words:
    > ## Appended note, <date> (on the human's ruling headed 2026-10-21, item 6; PLAN node publish-approval-ttl-ten-minutes)
    >
    > `PENDING_ATTEMPT_TTL` is 600 s (10 minutes) from that piece's merge, not the 120 s that the Decision's `binding_publish_prepare` bullet states. The grant minted beside the pending attempt takes the same lifetime, which stays under `MAX_GRANT_LIFETIME` (20 minutes). The approval dialog states the expiry in one sentence and adds no countdown. Nothing else in this ADR changes, and it stays Proposed.
  - Clause check:
    1. "600 s from that piece's merge": true; publish.rs:68 after the piece, pinned by T1 and the new Rust test.
    2. "not the 120 s … bullet states": true; ADR-024:88-89 @ 0f0f55cf.
    3. "takes the same lifetime": true; publish.rs:595-597 @ 0f0f55cf.
    4. "stays under MAX_GRANT_LIFETIME (20 minutes)": true; kernel/src/permission/grant.rs:221 and :266-271 @ 0f0f55cf, 600 < 1200.
    5. "states the expiry in one sentence and adds no countdown": true after the piece; D1 and block-on-sight 1.
    6. "Nothing else changes; stays Proposed": true; this is an append only.
  - Under (B), the note lands in its own docs PR, under §21a, before this piece merges.

### Amendments

*(Opens empty; append-only.)*

---

## The route (item 4)

**Against §21a:**

- **ADR: touched, by need.** ADR-024:88-89 states 120 s as the declared ceiling. After the change it would state a limit the code does not support. Under the proportional-gates section that is a Correctness finding, never documentation-only. So the note must be on main by the merge. A note on an ADR is §21a's first bullet, and it is red-line text.
- **Security posture: not touched, by §21a's letter.** The letter covers ADR-020, ADR-009 and ADR-021. By substance, the change lengthens how long a minted class-3 grant and its attempt can be executed. That is a 5× wider window for ADR-024's stated in-page-script limitation. It stays under the kernel's 20-minute ceiling. An architect reading is warranted.
- **Wire: not touched.** There is no SKP or MCP surface, and PublishPromptData is unchanged.
- **Stated guarantee or declared ceiling: touched, by letter.** The TTL is a declared ceiling (publish.rs:62, ADR-010 rule 6), and its value is "a property currently under test" (T1). The invariants are unchanged: single use, expiry past the TTL, and one lifetime for grant and attempt. The step-1 form's §2.1 calls T1 a reading that "changes with the TTL, by design". That supports a lenient reading, but the letter is touched, as in the connection-reuse precedent.

**Against §21b and §21c:**

- §21b admits docs, tests and polish. A product constant change is none of them.
- §21c's "no new user-visible behaviour" is crossed. There is a new dialog sentence, and an operator who waits 2 to 10 minutes now succeeds where before they were refused.
- The line and file bounds hold: about 100 lines, and 8 files plus the form.
- Round 25, item 2 (e): an honest Out-of-scope line names touched categories. That takes the full form from dispatch unless the human sets it aside.

**So the single-gate route is closed by letter**, on §21c's user-visible bound, §21b's category, and (with the note) §21a's ADR bullet. The grade S3 can stand only by a ruling.

**The options:**

- **(A) Recommended: the five-line form with reviewer and architect from dispatch.** It needs one ruling that does three things for this piece: sets round 25, item 2 (e) aside; adjusts §21c's user-visible bound (§21c: the human's to adjust by a one-line note); and keeps the five-line shape under both gates.
  - Precedent: the 2026-10-17 first message's item 4 (engine-clause-composition-properties, the five-line form with reviewer and architect from dispatch).
  - It also needs the human's words for OPEN-2's note, which lands in this PR.
  - Why: the value and the sentence are already decided. The full form's §3 and §5 would have little content. The architect gate covers the ADR note and the grant-lifetime reading.
- **(B) The grade literally: five-line form, one reviewer.** It needs three rulings: T1 is read as an instrument reading, so the guarantee is not touched; §21c's user-visible bound is adjusted for this piece; and ADR-024's note goes in its own docs PR under full gating, merged before this piece. The grant-lifetime reading then gets no architect gate in this PR.
- **(C) The full form from dispatch, per round 25 (e), with both gates.** It is drafted from this content on request, and the ADR-024 note is in the same PR. This is what the human chose for connection-reuse (S3).

## What I could not settle

1. **P6's own definition.** §21 does not name P6. The rule that strings the app shows stay under P6 is AUTONOMY.md:544 @ 0f0f55cf (§31 item f). I found no single defining sentence. The uses I found are state/NEXT-CUT.md:107 @ 0f0f55cf (the cut's P6 row: the walkthrough, the human, operator-verified), docs/PREREGISTRATION-TEMPLATE.md:48 @ 0f0f55cf (§1: wording of any user-visible string is the human's) and :132 @ 0f0f55cf (class 7).
2. **"S3 means one reviewer gate."** I found S3 paired with a five-line form in two items of 2026-10-17: the first message's item 1 and the second message's item 3. Neither fixes the gate count, and the connection-reuse piece (S3) went to the full form on its OPEN-1 (B). I did not read the RULED blocks in DECISIONS-PENDING.md for a general rule.
3. **Whether "yes, as drafted" suffices for the ADR-024 note.** ADR-024:296 @ 0f0f55cf records a note appended on "yes, as drafted". §31 item f says red-line texts keep the human's typed words. Which one governs here is the custodian's to confirm.
4. **The 601 s backdate in `a_pending_attempt_past_its_ttl_is_treated_as_unknown`.** `Instant::now() - Duration` panics if the monotonic clock reads under 601 s. CI's Windows runner (product-ci-shell.yml:170, :217 @ 0f0f55cf) runs the cargo tests after the builds, so uptime is probably sufficient, but I did not verify it. The reviewer reads CI's run.
5. **T1's rename.** I found the old full name only in run records (state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-m1-custodian-run.md, the worker report). Those are evidence, not claims. The custodian runs verify-test-claims before the PR, and again in the done commit.
6. **No automated check of the sentence in the real app.** Only the operator's G3 sight checks it there. Adding a DOM read to selection.mjs's ask steps would be a scope addition.
