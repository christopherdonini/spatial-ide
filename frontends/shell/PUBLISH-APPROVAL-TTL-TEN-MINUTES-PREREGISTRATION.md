# Publish: PENDING_ATTEMPT_TTL becomes 10 minutes, and the approval dialog states the expiry in one P6-placeholder sentence — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. This form is append-only once committed. An amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node publish-approval-ttl-ten-minutes; it depends on shell-migration-milestone-3, which is done. Drafted by the architect at main 0f0f55cf. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. The drafter had no shell: before commit, the custodian expands each `@ 0f0f55cf` and fills its sha256 by script. Done before commit: 45 pins, each now `path:line @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:<the lines with their LFs>`, the short file names written as their paths. Form path: `frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md`. The custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file. The piece is not dispatched until OPEN-1 (the route) and OPEN-2 (ADR-024's note) are ruled. The lines below are written for OPEN-1 (A); §6 says what changes under (B) or (C).*

```
Authority: PLAN node publish-approval-ttl-ten-minutes; the human's ruling headed 2026-10-21, item 6 (state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md:25 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:4f8087520353726ee4802b69c36fc4e9f4dae36bb6793f81e41e37d08d466e52), with its RULED block in DECISIONS-PENDING.md; the same directive's item 2a for the sight list; the unknown-attempt node's record (frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md, Amendments 9 and 10) and the architect's diagnosis (state/consults/2026-10-20-publish-approval-unknown-attempt-f4-diagnosis-architect.md, items 2 and 4); the machine rules (state/directives/2026-10-06-machine-script-adopted.md) for every heavy run. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for approval expiry ttl, `No prior art recorded for "approval expiry ttl". Research it before planning an implementation.` and, for pending attempt timeout dialog, `No prior art recorded for "pending attempt timeout dialog". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: frontends/shell/src-tauri/src/publish.rs (the value at frontends/shell/src-tauri/src/publish.rs:68 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:b71cf704cb81b1df8821644c389399b4b6c41f5bd1735a312c382eb97a8cae65, written Duration::from_secs(600); at most 2 doc lines in frontends/shell/src-tauri/src/publish.rs:62-67 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:cdd1623962b3f8bd09adbe2e45186c560e7676622d32d3b98d59d48596b9152f; one new test after frontends/shell/src-tauri/src/publish.rs:1793-1821 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:1f644e84de69f5e62d1ecc1e462d492882095b4950bc178f0005181f851c3e93; <= 35); frontends/shell/src/publish/PublishDialog.tsx (the sentence, its source comment, one paragraph in the confirming block after frontends/shell/src/publish/PublishDialog.tsx:270-272 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:05d3ea0aa1f2e518a2fa95bc4caedfb046b76ae0e3ffc7fd0738f73c751244b8; the number dropped from the comment at frontends/shell/src/publish/PublishDialog.tsx:211-214 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:f6ac0ba6bbbc5fb0474a146ec305fb566e8245f5293bfea98f2f25dc0c9908d1; <= 15); frontends/shell/src/publish/PublishDialog.test.ts (D1, D2 and their imports; <= 30); frontends/shell/e2e/exportElapsed.test.mjs (frontends/shell/e2e/exportElapsed.test.mjs:11 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:90a007c4960225e944c580db12e91d2cc40614257288e8a2cfa92613915536ff and frontends/shell/e2e/exportElapsed.test.mjs:18 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:4de7eb4047ee531fe1c00da1e3a24ccc622ab14814452e4368822c4a2a31e4e1; <= 4); frontends/shell/e2e/publish.mjs (the TTL read kept at frontends/shell/e2e/publish.mjs:610 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:bc62126709a5dd79009be24224126e991141e063613786df938d77c09d5632a2; EXPIRED''s comment and note, frontends/shell/e2e/publish.mjs:620-635 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:c5bbf040663bf6203685cdc2edd05abd67002c478c1ddbd2b1adcf4cbae177b8; <= 12); frontends/shell/e2e/README.md (the publish suite entry only, frontends/shell/e2e/README.md:213-215 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:b2848b83c9579b9e9daafdfae9bc0cb935d6647ea012393b94ef3b82e9d5032d; <= 4); frontends/shell/MANUAL-WALKTHROUGH.md (Part G only: G3, frontends/shell/MANUAL-WALKTHROUGH.md:326 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:4c239a2820317aeb5406d7c5b7b080a6f6d0932576c5c26b93d481afbc33afd7, and the EXPIRED' coverage row, frontends/shell/MANUAL-WALKTHROUGH.md:394 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:99e13a16904efa7a70f1dc9a08a5cfa09b2014880ea34a4fe7c899fb7708fff4; <= 4); docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md (one appended note in the human's words after docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:296-298 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:0bfdebb0a927b0f1b80dd7da6dfefc8a098cfdb10f940b5de3410493cc8518b2, nothing above it edited; <= 6); this form; 8 files besides this form; declared line budget <= 120 changed lines by §21c's counting (insertions plus deletions, this form excluded; estimate about 100), counted by git diff --numstat origin/main...HEAD -- . ':(exclude)frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md' with columns 1 and 2 summed, and per file by the same command with the file's path; no PLAN or generated file on the branch.
Change: PENDING_ATTEMPT_TTL becomes 600 s, so a prepared publish attempt and the grant minted with it expire 10 minutes after the prepare instead of 2. While the approval dialog asks for the typed phrase, it shows one P6-placeholder sentence (§1): the approval expires after 10 minutes, and the publish then has to be started over. There is no countdown. The comments, the e2e skip note, the README's publish entry and walkthrough Part G stop stating 120 s, and ADR-024 gains the human's dated note.
Tests+mutation: changed T1 in frontends/shell/e2e/exportElapsed.test.mjs (TTL 600_000, named `T1 the TTL read from the real publish.rs is 600000 ms`), mutation M1, publish.rs's 600 set back to 120, fails it by name; new Rust test `a_pending_attempt_121s_old_is_still_taken_within_the_ttl` (publish.rs tests; created_at backdated 121 s; take returns the attempt), mutation M2, the same 600 -> 120, fails it by name; new vitest `D1 renders the approval-expiry sentence verbatim while the dialog asks for the phrase` (PublishDialog.test.ts, renderToStaticMarkup, the placeholder's literal text, after the instruction), mutation M3, the sentence's paragraph deleted from PublishDialog.tsx, fails it by name; new vitest `D2 the expiry sentence's minutes are PENDING_ATTEMPT_TTL's, read from publish.rs` (the pattern of frontends/shell/src/publish/PublishPanel.test.ts:222-229 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:4235b879316e50d73c9a63d69aad4a8c00fad566b8343cdd151d128b8d384c39), mutation M4, publish.rs's 600 set to 300 alone, fails it by name. Each mutation is observed by applying it alone at the final code commit, running the named test, recording its failure by name with that commit id, and reverting it (round 25, item 2 (c)). Existing tests stay unchanged and green (§3). E1, the custodian's e2e at the head (§3).
Out-of-scope: wire: not touched — no SKP or MCP surface; binding_publish_prepare and binding_publish_execute keep their arguments and outcomes, and PublishPromptData gains no field. Security, by §21a's letter (what ADR-020, ADR-009 or ADR-021 governs): not touched; the grant lifetime this changes belongs to the class-3 boundary (ADR-017, ADR-024), stays under MAX_GRANT_LIFETIME (§0 F2), and widens the window of ADR-024's stated in-page-script limitation (§0 F9) from 2 to 10 minutes, which the architect gate reads. ADR: touched — ADR-024 (Proposed) gains one appended note in the human's words (OPEN-2), and its status line is not edited. Guarantee: touched — PENDING_ATTEMPT_TTL is a declared ceiling (ADR-010 rule 6) whose value T1 asserts; single use, expiry past the TTL, and the one lifetime shared by grant and attempt are unchanged. §21c's "no new user-visible behaviour" is crossed (one new dialog sentence; a longer expiry). The five-line form with reviewer and architect from dispatch stands by the human's ruling on OPEN-1, recorded as setting round 25, item 2 (e) aside for this piece. No dependency, no exposure surface, no countdown, and no other string the app shows.
```

## §0. The code as read (main 0f0f55cf)

- **F1.** The TTL is a declared bound on a prepared attempt, 120 s: frontends/shell/src-tauri/src/publish.rs:62-68 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:c13b47922c72b9fd7eb1f6eab63bdcd0e5d7ea446f6449ca2b3dcfbdaac4e1c9.
- **F2.** The grant minted beside the attempt takes the same lifetime: frontends/shell/src-tauri/src/publish.rs:587-598 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:2d1a82a914ff8b08de4f26cd575a1435780191a76c231e0faa8ec5b05e933abb (the lifetime argument is at :595-597).
  - MAX_GRANT_LIFETIME is 20 minutes: kernel/src/permission/grant.rs:216-221 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:db4d2034736156dec7686e2df3ccd80fe6ef192781918b0ddccfa1bc165db595. A lifetime above it is refused: kernel/src/permission/grant.rs:266-271 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:d7ae8fb23bb399b666397adecfdb93153a5ff3491524f51c1d7a9b0f2e164407.
  - 600 s is under that ceiling, so the prepare's mint does not refuse.
- **F3.** How an attempt expires:
  - The sweep on insert: frontends/shell/src-tauri/src/publish.rs:207-214 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:b55076fdee8e106fca966f4f8a94c0fc08f6e86e5fec25c249447e6a4978f711.
  - `take` returns nothing past the TTL: frontends/shell/src-tauri/src/publish.rs:216-225 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:83920b5d37686caf498197a9768591ec36e75a845028a7fcd539938a9e4ed8c5.
  - A miss answers UnknownAttempt: frontends/shell/src-tauri/src/publish.rs:725-727 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:28adabfa7db23e8d7fbc4f7ba539f175a51a32480f799bc4bda1f102dd0ac449.
  - A grant that has expired when the attempt is taken is refused by the boundary's re-check: kernel/src/permission/boundary.rs:409-419 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:bf32aca6425dc0c8f5de541a0326653feb6f74f25e27ebdaaaeff98958fe0298.
- **F4.** The attempt's clock starts at the stash, at the end of the host's prepare. The grant is minted a moment earlier, and grant_remaining_s is read in between: frontends/shell/src-tauri/src/publish.rs:606 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:90328e956539497bd20745f4582599c66bd907ddf38d91e178f7b9754ac111fa and frontends/shell/src-tauri/src/publish.rs:643-661 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:24204eb646a9eae41aa38aa1e26558a80d37913c7fe042f8a656a2cb2c2af5dd.
- **F5.** The dialog:
  - It shows a static grant-remaining figure, the number the host sent: frontends/shell/src/publish/PublishDialog.tsx:244-250 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:ed153e1bf01ee389ceb49ad3731954a69869f4832b9eb1ff370d1afd4007441b.
  - The confirming block: frontends/shell/src/publish/PublishDialog.tsx:268-299 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:84fe30cbc9611923dfa36403d6f36f4843a340fbef14c0bcf94d7387075e25d8.
  - It closes on any outcome: frontends/shell/src/publish/PublishDialog.tsx:67-68 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:b317045a13f97eebbe87f6d1a6f9e673c27d94c21467b2489dc663f77f3461b8.
  - Every click makes a fresh attempt and a fresh dialog: frontends/shell/src/publish/PublishDialog.tsx:163-168 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:9bf16d53ce82e9aec05bb563800e800428fada10147522142b7943a909b396c3.
  - The abandon comment names 120s: frontends/shell/src/publish/PublishDialog.tsx:211-214 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:f6ac0ba6bbbc5fb0474a146ec305fb566e8245f5293bfea98f2f25dc0c9908d1.
- **F6.** After an expiry, the panel's refusal for `unknown-attempt` ends by telling the operator to start over: frontends/shell/src/publish/PublishPanel.tsx:305-312 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:bb289c7420fb9304d4a42835a0fcc24df678132e55afc712570cac2cea143c0b. An operator's `unknown-attempt` comes only from the host (the diagnosis, item 2).
- **F7.** How the e2e side reads the TTL:
  - The helper reads it with a regex that needs the literal `Duration::from_secs(<digits>)` form: frontends/shell/e2e/exportElapsed.mjs:16-22 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:f191e32ab6d615acc86f853dd818ae4adab5664ee0736e4119fcbb064a41fa11.
  - T1 pins the value: frontends/shell/e2e/exportElapsed.test.mjs:11 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:90a007c4960225e944c580db12e91d2cc40614257288e8a2cfa92613915536ff and frontends/shell/e2e/exportElapsed.test.mjs:18-20 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:8bc070dd45c681d0ad04e58b1622bb267ce52e3259157fc0c9014955ce135de8.
  - Both suites print it: frontends/shell/e2e/publish.mjs:610 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:bc62126709a5dd79009be24224126e991141e063613786df938d77c09d5632a2 and frontends/shell/e2e/selection.mjs:839 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:f48e4c2d57ddbc58480991a8f40e9f9e27b141ef22f37be1e4a550047e5c8320.
- **F8.** A precedent for a JS copy pinned against publish.rs: frontends/shell/src/publish/PublishPanel.test.ts:222-229 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:4235b879316e50d73c9a63d69aad4a8c00fad566b8343cdd151d128b8d384c39.
- **F9.** ADR-024, which is Proposed:
  - It states 120 s as the declared ceiling: docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:88-89 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:aca563707e9baccc1a801f85233fc2630954e5a995729616e796df9103d44f2d.
  - It states that DOM approval proves nothing against an in-page script: docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:166-172 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:3536b69c60f4512be69c4796201aa858f23d0a816a1eeea452eae67a81c94bc0.

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
- **Whose words:** strings the app shows stay under P6 (AUTONOMY.md:544 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:25b91d5336bc7016ac3eb61392406795b78f56fc47799fe31085ddcaf1d84ff1, §31 item f). This is not a §31 wording-block sentence.
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
- **Not covered by any run:** the sentence in the real app. publish.mjs never mounts the dialog (frontends/shell/src/publish/PublishDialog.tsx:181-185 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:5ea5b68f8db0a849068f0724f9487c8e4966c95152295792d4cb6cd751c850e7). The operator's G3 sight is the only real-app check.
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
    2. "not the 120 s … bullet states": true; docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:88-89 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:aca563707e9baccc1a801f85233fc2630954e5a995729616e796df9103d44f2d.
    3. "takes the same lifetime": true; frontends/shell/src-tauri/src/publish.rs:595-597 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:3df733958b60ed1662ef831a703b9b245cd772b244f5bdda8ac81ce974985178.
    4. "stays under MAX_GRANT_LIFETIME (20 minutes)": true; kernel/src/permission/grant.rs:221 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:1b06596967d6d5f1fb54fc9303e332c94d3360465b0d26a88a51353cc6ed6b42 and kernel/src/permission/grant.rs:266-271 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:d7ae8fb23bb399b666397adecfdb93153a5ff3491524f51c1d7a9b0f2e164407, 600 < 1200.
    5. "states the expiry in one sentence and adds no countdown": true after the piece; D1 and block-on-sight 1.
    6. "Nothing else changes; stays Proposed": true; this is an append only.
  - Under (B), the note lands in its own docs PR, under §21a, before this piece merges.

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2 (class 5)

*Written by the custodian on the human's ruling. References only: `state/directives/2026-10-20-ttl-open-1-a-five-line-form-both-gates-open-2-adr-024-note-words.md`, from line 6 (sha256 bd5309138eb602d6426fdb85a1968b0c476ab822c8bfa3d45c4554ff4cd27ca0 over lines 6 to the end at the commit that adds it).*

1. **OPEN-1 (A):** this five-line form, with the reviewer and the architect from dispatch. AUTONOMY §25 (e) is set aside for this piece, as for engine-clause-composition-properties on 2026-10-17.
2. **OPEN-2:** the note's words are the human's, at the directive's line 11, and they replace §6's drafted words. The note is dated the day the piece merges. The custodian appends it to ADR-024 on the branch as the branch's last commit before the click: a heading `## Appended note, <that day>`, then the human's words byte-copied by script without the line's two leading spaces. Nothing above it is edited. ADR-024 stays in Scope and its lines count in the budget; the worker's brief leaves that file to the custodian.
3. **One clause, put to the human:** the words say the approval dialog "stated no limit". At the base, the dialog shows the host's grant-remaining figure beside the grantor, a static number of seconds: frontends/shell/src/publish/PublishDialog.tsx:249 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:cad94f925f6ee3f4a02d27c6b01befff391d929a0efc0ace8621b3f6037f83b1. Under AUTONOMY §31 (f) the words are the human's. The custodian has asked whether they stand as typed, and the note is appended only after the answer. The code does not wait for it.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — the human's answer on Amendment 1 item 3: one clause of the note corrected (class 5)

*Written by the custodian on the human's ruling. References only: `state/directives/2026-10-20-adr-024-note-clause-corrected-s5d-series-booked-after-the-ttl-worker.md`, item 1 at line 8 (the file's sha256 from line 6 to the end, be7c45adb18959f3df4574d4f14d6e1fd873074dd56e1edf995360a72f2ae1ad, at the commit that adds it).*

1. **The note's words** are the third message's (Amendment 1 item 2) with the one clause replaced as item 1 directs; the rest stands as typed. The composed note, one line plus its newline, has sha256 f4018b1a149d07581184d7704447d3abae3c5d4633c1c2f2a357c2323fd7a6d6. The custodian appends exactly that line under the heading Amendment 1 item 2 names, and checks its sha256 before the commit.
2. **The clause, checked at the base:** the dialog's only sign of the limit is the host's grant-remaining figure, a number sent with the prompt and shown without re-derivation: frontends/shell/src/publish/PublishDialog.tsx:247-249 @ 0f0f55cf2bb769961c621281e79353a071b3f079 sha256:f58b79add1579adafb8ba05e68b0525f26d0241814d2f366a18670cd5b2d6e77.
3. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — built: §3's cargo command corrected (class 3); two per-file overruns (class 6); written after the results were seen

*Written by the custodian after the worker's report was seen. References only: `state/consults/2026-10-20-publish-approval-ttl-ten-minutes-worker-report.md`.*

1. **Built** on `cut/publish-approval-ttl-ten-minutes` from f2052681: step 1 ca5069bf1fdbbea76b474f78f470d2d450e51c44, step 2 4379f3c80d87cfe71969a72d47b54a777fdb2a5c, step 3 42e6fc1410447c331a4b213b02fdc220e834fc7a, and the mutation record 5e922915419fff578d862ae1a47aefa39c955ba2 (comments only). M1 to M4 were observed at 42e6fc1410447c331a4b213b02fdc220e834fc7a, each failing its named test (the report).
2. **§3's cargo command (class 3).** The test's name alone with `--exact` matches nothing: it printed 0 passed and 68 filtered out with exit code 0. The command is `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --lib publish::tests::a_pending_attempt_121s_old_is_still_taken_within_the_ttl -- --exact`, the one M2 was observed with.
3. **Budget (class 6; Scope not edited).** `frontends/shell/e2e/exportElapsed.test.mjs` has 5 changed lines against its 4, and `frontends/shell/src-tauri/src/publish.rs` has 36 against its 35. In each, the overrun is the comment recording that file's mutation. The total is 89 of 120, before ADR-024's note.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.
