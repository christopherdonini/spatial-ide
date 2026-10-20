Reviewed: PR #236 at 5e922915419fff578d862ae1a47aefa39c955ba2 (base 677ecd12), gate 1, architect
Verdict: FAIL
Branch and commit reviewed: cut/publish-approval-ttl-ten-minutes @ 5e922915419fff578d862ae1a47aefa39c955ba2. All cites are read at that commit, in C:/dev/wt/ttl.

The FAIL is a wording block and nothing else (AUTONOMY §31 (a) and (d)). One kernel doc comment states a lifetime the code no longer has. The words that fix it are below. They are not the human's wording, so the worker applies them with no re-gate and the PR body lists them. Correctness of the code and Evidence for the piece's claims are otherwise closed.

## Correctness

**C1. An untrue statement of a limit that the piece creates, outside Scope.**
- Where: kernel/src/permission/grant.rs:412 reads `    /// it would also have expired naturally on its own 120 s-class lifetime. Matches on the SAME`.
- Why it is wrong: after the change, the grant this comment describes (the shell's grant, which goes through remove_matching, grant.rs:416-417) lives 600 s (frontends/shell/src-tauri/src/publish.rs:598, :69).
- The form's §2 lists every place that would state an untrue limit, and it misses this one. Under the proportional-gates section an untrue limit is never documentation-only.
- Replacement (one line, same position): `    /// it would also have expired naturally at the end of its own lifetime. Matches on the SAME`
- Clause check: "expired naturally at the end of its own lifetime" holds for every caller. `expired` is `self.elapsed(now) >= self.lifetime` (grant.rs:310-312), with no fixed figure. The shell passes 600 s (publish.rs:598). The CLI's default is 300 s (kernel/src/bin/publish-bundle.rs:98).
- Whose words: a doc comment, not the human's. The worker applies them with no re-gate, and the PR body lists them.
- Record: this adds a 9th file against Scope's 8, for 2 changed lines. That is class 6 (file count, Scope not edited), one `Amendment:` row.

## Evidence

No blocking finding. Two non-blocking notes:
- **E-n1.** `a_pending_attempt_past_its_ttl_is_treated_as_unknown` now backdates `Instant::now()` by 601 s (publish.rs:1814). On Windows, `Instant - Duration` panics if the monotonic clock reads under 601 s. The draft named this risk as well. The reviewer should confirm that the PR's shell CI ran the lib tests green. I cannot read CI.
- **E-n2.** I ran no test, diff, numstat or hash: I have no shell. The mutation results M1 to M4 rest on the worker report and the custodian's transcript match recorded in its filing note. The reviewer re-runs them.

## Documentation (must-fix before the merge, no re-gate)

**D1. The sentence's source comment does not record the gaps §1 says go there.** The form's §1 marks them "Named for the source comment". frontends/shell/src/publish/PublishDialog.tsx:9 carries neither of them.
- I also found a third case that ordinary use reaches. Closing and reopening the Export disclosure unmounts and remounts the dialog for the same attempt: the panel's state stays `dialog` (PublishPanel.tsx:596, :602-614, :739-748), and the reducer restarts in `confirming` (PublishDialog.tsx:182). After that, the static sentence and figure are shown with time already gone.
- The sentence is still true, because it states a lifetime, not the time left. It is a P6 string, outside §31 by (f), so this does not block. §1's clause check ("the gap is inside one request round trip") is incomplete, and the comment should say so.
- Replacement for line 9 (one line becomes seven; the file goes to about 12 added and 1 deleted, within its 15):
```
/**
 * P6 placeholder (AUTONOMY.md section 31 f): the minutes are `PENDING_ATTEMPT_TTL`'s, pinned by `PublishDialog.test.ts` D2.
 * The sentence states the approval's lifetime, counted from the host's prepare, not the time left. The clock starts when
 * `publish.rs` stashes the attempt, before this dialog mounts; and closing and reopening the Export disclosure remounts
 * this dialog for the same attempt. The grant is minted just before the stash, so a Submit at the very end can be
 * refused on the grant rather than as `unknown-attempt`; both are refusals.
 */
```
- Clause check:
  - "minutes are PENDING_ATTEMPT_TTL's, pinned by D2": PublishDialog.test.ts:220-225.
  - "lifetime, counted from the host's prepare, not the time left": the sentence is a constant (PublishDialog.tsx:11). The clock is `created_at`, set at the stash that ends the prepare (publish.rs:644-662, :658), and `take` compares against it (:222).
  - "before this dialog mounts": the dialog mounts only after the prepare's outcome sets `dialog` (PublishPanel.tsx:265, :739-748).
  - "closing and reopening … remounts this dialog for the same attempt": PublishPanel.tsx:596 toggles `expanded` only, :602 gates the controls on it, and :740-742 passes the same `state.attemptId` and `prompt`.
  - "grant is minted just before the stash": publish.rs:588-606, then :617, then :644.
  - "refused on the grant rather than as unknown-attempt": the grant counts as expired at `>=` (grant.rs:311), from an earlier `granted_at`, while the attempt is taken at `<=` (publish.rs:222). The boundary then re-checks the grant (kernel/src/permission/boundary.rs:409-419).
- Whose words: a doc comment, not the human's. The worker applies them, and the PR body lists them.

**D2. Hash references without an explicit rev (round 15 (e)).** Amendment 1's lead, Amendment 2's lead and Amendment 4 item 1 pin a sha256 "at the commit that adds it", which is not an explicit `@ <rev>`. Fix: the closing amendment names each of the three commits by its full id on main, as references only.

**D3. The E1 record leaves a condition out of its paraphrase of the machine rule.** state/consults/2026-10-20-publish-approval-ttl-ten-minutes-e1-custodian-runs.md:52 paraphrases the rule's timing-sensitive bullet (state/directives/2026-10-06-machine-script-adopted.md:20). That bullet also has the custodian re-run the failure alone on the machine. Run 2 ran in a shared hold, and the record shows no hold lines for it. Fix: one appended reference line saying run 2 was a shared hold, not the alone re-run, and pointing to this report's item 5 for the reading of run 1.

## Block-on-sight (form §3)

1. Timer or time-driven state: none. A grep of src/publish for setInterval, setTimeout, requestAnimationFrame, Date.now and performance.now finds nothing, and the imports at PublishDialog.tsx:4 are unchanged from main.
2. Literal form: publish.rs:69 is `pub const PENDING_ATTEMPT_TTL: Duration = Duration::from_secs(600);`. Held.
3. PublishPromptData and the binding commands: the struct literal at publish.rs:624-637 is unchanged, and types.ts and commands.rs are not in the worker's file table. Held.
4. One sentence, in the confirming block only: PublishDialog.tsx:277, inside the block at :272-304. Held.
5. ADR-024 is not on the branch yet. At the head it matches main (lines 88-89 and 296-298 read identical). The reviewer confirms that the custodian's final commit touches only the appended note.
6. Overruns: two, recorded as class 6 (Amendment 3 item 3). C1 adds a third row, for the file count.

## What I checked

**1. The Out-of-scope line and the route.**
- No SKP or MCP surface is touched, and the binding commands keep their shapes (see block-on-sight 3).
- §21a's security letter is not touched: no ADR-020, ADR-009 or ADR-021 file.
- ADR touched: ADR-024's note only, still to come. Guarantee touched: the TTL ceiling, with T1 at exportElapsed.test.mjs:11 and :18-21.
- No dependency is added, and no app string other than the sentence.
- Route: the human's message headed 2026-10-21 (third), OPEN-1 (A), sets AUTONOMY §25 (e) aside for this piece. Amendment 1 item 1 records it, and both gates run from dispatch.
- The diff matches all of this, apart from C1's missed file.

**2. The grant lifetime against ADR-017 and ADR-024.**
- ADR-017's acceptance condition (ADR-017:4-7) asks for a scoped grant, explicit approval and a redacted audit record. All three mechanisms are unchanged. The grant is still scoped and expires on a monotonic clock (grant.rs:233-235, :310-312; ADR-017:978; docs/09_Security_and_Privacy.md:9).
- 600 s is under MAX_GRANT_LIFETIME's 1200 s (grant.rs:221), so the mint's refusal at grant.rs:266-271 does not fire.
- ADR-024's stated limitation (ADR-024:166-172) is that DOM approval proves nothing against an in-page script. That window now runs 10 minutes instead of 2.
- The concrete widening: Cancel makes no host call (PublishDialog.tsx:212-219). An attempt the operator abandoned therefore stays executable by an in-page script for up to 10 minutes, to the destination the operator picked. This sits within the stated limitation and opens no new exposure. The ADR-024 status line and the exposure review are untouched. Not blocking, and no fix belongs in this PR; a host abandon call would be new design.
- MAX_GRANTS 64 (grant.rs:224) would need 64 abandoned prepares, each through a native picker, inside 10 minutes. Ordinary use does not reach that.

**3. The §1 sentence at the head.**
- The words at PublishDialog.tsx:11 equal §1's Words once the constant is put in, and D1 pins the literal (PublishDialog.test.ts:211-217).
- "expires after 10 minutes": publish.rs:69, :222 and :598, with grant.rs:311.
- "has to be started over": after the expiry, take misses and the answer is UnknownAttempt, or the grant is refused. The dialog closes on any outcome (PublishDialog.tsx:71-72). The panel's refusal ends "start over" (PublishPanel.tsx:305-312). Export is enabled again once the panel leaves `dialog` (:701).
- No countdown is added; the static figure at :253 is unchanged.
- The sentence is a P6 placeholder, the human's at the G3 sight (MANUAL-WALKTHROUGH.md:326), and not a §31 sentence.

**4. ADR-024's note, the human's words.** I composed it as Amendment 2 item 1 directs: the third message's line 11, with the clause from the fourth message's item 1. I found no factual error.
- 600 s: publish.rs:69.
- "the Decision's binding_publish_prepare bullet" states 120 s: ADR-024:83-89, under the Decision heading.
- "only sign of the limit was a remaining-seconds figure read once when it opened": at the base, nothing else in the dialog states a limit (main PublishDialog.tsx:224-272; compose_outcome_summary names none). The figure is read once, host-side (publish.rs:607), and is never re-derived.
- "same lifetime": publish.rs:598.
- Under MAX_GRANT_LIFETIME (20 minutes): grant.rs:221.
- "one sentence, no countdown": the code reviewed under item 3.
- "stays Proposed": it is an append only.
- I could not compute sha256 f4018b1a…; the custodian checks it before the commit.

**5. E1.**
- In both runs the header reads 600000ms and EXPIRED''s note names 600s (record lines 24, 28, 39, 43). OPEN, APPROVED' and REFUSED' pass in both.
- Run 1's FILTERED' got a null `filter_scope`. The piece changes neither the filter path nor `filter_scope`: the line is identical at head publish.rs:635 and main :634, the hook lines in PublishPanel.tsx are identical to main, and App.tsx is not in the diff.
- A candidate mechanism sits in unchanged code: the prepare hook captures `filterActive` and is registered again only by an effect (PublishPanel.tsx:570-585, :474). publish.mjs calls prepare as soon as queryWithFilter resolves, with no wait (:466-478). I read this; I did not run it. It is the scope of the proposed node publish-dev-hook-attempt-from-effect.
- Run 2 passes. The Evidence for the piece's claims is sufficient.

**6. Amendments 3 and 4 against the template's classes (docs/PREREGISTRATION-TEMPLATE.md:103-132).**
- Amendment 3: the cargo command correction is class 3 (it changes what the command points at, not a claim). The per-file overruns are class 6 (short form; it records the declared and final figures and the reason, and Scope is not edited). Its first line says it was written after the results.
- Amendment 4: class 2 fits, since run 1 differs from §3's FILTERED' prediction and run 2 is a run §3 did not name. The prediction is not edited.
- No record calls a verify-mutation run an observation; the worker report says none was used.
- This is a short form, so no class 8 is due. No class-9 addition.
