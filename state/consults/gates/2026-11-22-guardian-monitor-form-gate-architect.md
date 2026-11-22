Reviewed: the draft form for the node guardian-checks-monitor-commands, not committed (<S>/form-guardian-monitor.md, 13123 bytes, sha256 67dbd197ef7332706871d0fc9532e402b4729624f7962384065bde3d3113ab90), read against main at 90bdeab78ea3dadd238d5dfe428e50b0df3840c6 (the custodian's filing note, 2026-11-22: the form's architect gate, attempt 1; Read 14, Grep 2, SubagentHandback 1, by unique call ids, no call errored, model claude-opus-5-5, from 2026-11-22T12:06:08Z to 2026-11-22T12:13:05Z by its transcript; no call named the main checkout; the report below from its hand-back of 17915 bytes, sha256 3f23d627aa73d78a8dd7b5ad01e3e692fd678978fc042481cf140ba899de457a, with the scratch folder's path written <S> (1 times) and nothing else changed, with this note in its first line and one final newline), gate, architect
**Verdict: FAIL.** I reviewed main (detached, read-only checkout `C:\dev\wt\gate-read`) @ 90bdeab78ea3dadd238d5dfe428e50b0df3840c6. I took that head from the brief; I have no shell, so I did not verify it myself. The form is the uncommitted draft at `<S>/form-guardian-monitor.md`, which I cite by its own section numbers. Every other cite is a path:line at the head above.

Mapped onto AUTONOMY §22's three verdicts:
- **Correctness: FAIL** (C-1).
- **Evidence: FAIL** (E-1).
- **Documentation: 13 must-fix items** (D-1 to D-13), all to be fixed before the form's first commit.

Every blocking finding is a sentence of the form. The form is the custodian's text, not the human's wording, and it changes no code. My exact words are given for each finding. Applied verbatim, they close it with no re-gate (the wording-blocks rule, AUTONOMY §31, as my definition paraphrases it). Words other than mine get a narrow re-gate of those sentences only. All replacement words below are mine, the architect's. None of them is the human's or the advisor's.

---

## Correctness

**C-1. The form sends two decisions to the advisor that the approved draft, now the human's words, gives to the human.**
- The draft is written in the human's voice. Its item 4 (a) says "My approval of this draft" (draft:28), and its item 7 mentions "the advisor's included" in the third person (draft:49).
- **P0 stops.** The draft, item 3 (a) (draft:21), ends: "the piece stops and comes back to me." The form's §0 heads its stops "**Stops, to the advisor** (the draft, item 3 (a))".
- **The patch.** The draft, item 2 (draft:18), says: "the custodian stops and sends me the change as a patch file, and I apply it myself." The human's message, item 2 (b) (`state/directives/2026-11-22-the-humans-message-…-property-testing-trial.md:37`), says: "send me the change as a patch file and I apply it myself." The form's Isolation bullet 3 says: "The custodian sends the change to the advisor as a patch file, and the advisor applies it (the draft, item 2)."
- This is a change to the security guard that the human reserved under the grant's item 4 (c), so the misrouting is a Correctness finding.
- **Words (architect's), for Isolation bullet 3:** "If a standing rule or the Guardian refuses the work in the worktree, the worker stops, and so does the custodian. The custodian sends the change to the human as a patch file, and the human applies it himself (the draft, item 2)."
- **Words (architect's), for §0's stops heading:** "**Stops, to the human** (the draft, item 3 (a), where the piece stops and comes back to the human):" — the clause after the colon is a paraphrase.

## Evidence

**E-1. P0 does not close the draft's item 3 (a). The fixtures could end up built from an assumed shape, which the human's message, item 2 (b) (:36), forbids.**
1. **validate's hook line cannot show Monitor at P0.** The draft names two sources: the engine-written types and validate's hook line. P0 item 2 runs `validate` before any code exists, so it can only list today's registrations (`register.js:1106-1111`). No later step reads a Monitor hook line, and §7's reviewer list has no `validate` at all.
2. **No outcome is set for types that name no Monitor.** P0 item 3 allows "a whole-folder search showing that none does", but no stop and no route follows from it.
3. **The command's location is not pinned.** "the event does not carry the command" should name the field the code reads. `decideShell` reads only the top-level `e.command` (`register.js:988`). A command under any other key would need code the draft does not allow.

**Words (architect's).**
- **Replace §0's stops sentence with:** "the engine hands no Monitor call to a `tool.call` handler; the event does not carry the command as the top-level string field `command`, the field `decideShell` reads; the types do not accept the filter; or no declaration names Monitor, so that the types do not show a Monitor call's fields."
- **Append to §0:** "5. **P0b, after the registration line and before any test.** The worker writes the one registration line of section 2, item 1, and nothing else. It then runs `claude plugin validate tools/mods/spatial-guardian` and returns its whole output byte for byte in its report. A Monitor hook line in the form of the Bash line is expected, and every other hook line is byte-identical to item 2's. No Monitor line, or a warning or an error that names Monitor or the filter, is a stop, to the human."
- **Add to §7's reviewer list:** "`claude plugin validate tools/mods/spatial-guardian` at the head, with `claude --version`: the Monitor hook line present, every other line byte-identical to P0's item 2;".

**The field rule** ("a field beyond the four is a stop only if a rule would have to read it") is sound in principle. As written, though, the worker makes the call and the test is undefined.
- **Words (architect's):** "A field P0 finds beyond the four the draft names (`description`, `timeout_ms`, `command`, `ws`) is recorded. It is a stop, to the human, when it can change what runs or where: a second command or script, a shell or interpreter selector, a working directory, a file path or an environment map. The custodian, not the worker, makes that reading and records it in Amendment 1."

---

## Gate items 1 to 9

### 1. The form against the draft, item by item
- **1 (a)**, one registration with Bash's decision, G6 not added: kept (§2.1).
- **1 (b)**, the target map: kept (§2.2).
- **1 (c)**, a commandless watch: kept, with no code and shown by F6 (§2.3).
- **1 (d)**, the words:
  - Kept in substance.
  - The form adds the rules-table rows and the comment above `decideShell`. The draft names only the "does not claim", shell-route and files sections, and the plugin tests. Both additions stay inside its "changed to match" (draft:15), but the form does not name them as its own additions (D-11).
  - The form also misses README lines (item 6 below).
- **1, "Nothing else"**: kept (§2.5 and §1's out-of-scope list).
- **2**, branch, worktree, never the installed copy: kept. The patch clause is misrouted (C-1).
- **3**, the three `claude` commands: kept.
  - 3 (a): see E-1. The filter-type stop is the form's addition and is conservative, so it stays inside.
  - 3 (b) and 3 (c): kept. The exact commands are the form's addition and stay inside.
  - 3 (d): kept. The reason, the exact seven fields and the no-command-text check are additions; they are stricter and stay inside.
  - 3 (e): kept for T1 to T4. MU3 is an addition (item 5 below).
- **4 (a) to (c)**: kept (Authority, Form and gating, Merge).
- **5**: kept (§5.1). The draft's (iii), the human's optional `claude plugin list`, is the human's own step, and the form rightly claims nothing about it.
- **6**: kept (§5.2), with gaps D-7 and D-8.
- **7**: kept, and made stricter ("until both are recorded"), with gaps D-6.
- **8**: the form claims nothing of it (§1's may-not-claim list and out-of-scope list). Correct.

### 2. P0
See E-1. The stops the draft names are present, plus one addition, but they are not enough.

### 3. The change, against `register.js` at the head
- **The registration.** The Bash registration is `register.js:1107`, byte-copied: `  on('tool.call', { tool: 'Bash' }, ($, e, next) => guardShell($, e, next, cache, false)).catch(() => ({ deny: CATCH_REASON }));`. A Monitor line of the same shape with `false` skips G6, because the G6 branch sits behind `isPowerShell` (`register.js:984-987`). G1, G7, G8 and G9 then run in that order (`register.js:989-992`). The line must come after N1's line (`register.js:1106`) so that N1 stays first (D-12).
- **The target map** is `register.js:952`. Adding a `Monitor: e.command` entry is the whole change there. Without it, the map falls through to `e.file_path`, so the log reads `unavailable` (`register.js:959`).
- **A call with no command, traced.** It reaches `next(e)` with no `$` call at all, so nothing can throw to the catch:
  - `String(e.command ?? '')` gives `''` (`register.js:988`).
  - In `readRule` (`register.js:267-285`), `splitSegments('')` yields one empty segment (`register.js:126`), and `tokenise('')` returns no tokens and no open quote (`register.js:185`).
  - G1's segment test is false on no tokens (`register.js:344-353`). G7's is false (`register.js:427`), and the `&&` at `register.js:990` short-circuits, so `isThisRepository` is not called. G8's is false (`register.js:464`).
  - `makeG9Rule` only builds closures and a Map, with no `$` call (`register.js:760-777`, `register.js:884-910`). Its segment loop finds no tokens (`register.js:890-898`), and the `&&` at `register.js:992` short-circuits.
  - `decideShell` returns undefined (`register.js:993`), and `guardShell` calls `next(e)` (`register.js:1003`).
- **N1 has no bearing on the decision.** It is registered with no filter (`register.js:1106`), so it already wraps every Monitor call today. It returns straight away on a denial (`register.js:1083`) and refuses nothing. In the tests, `arm` answers `session.usage` with no breakdown (`guardian.test.ts:58-69`), so N1 adds no line and makes no git call.

### 4. The fixtures
- **F1** (`git push --force …`): refused by G1's segment test (`register.js:344-353`, `--force` at `register.js:226`), in any world.
- **F2** (`gh pr merge 1 --merge`): refused by G7 (`register.js:405-412`). Only in a world where `isThisRepository` is true.
- **F3** (`claude plugin install some-plugin`): refused by G8 (`register.js:454-456`), in any world.
- **F4** (`cargo clean`): refused by G9, because no target directory is named, so `cargoCleanRefuses` returns true at `register.js:865`. Only in a world where `isThisRepository` is true.
- **The world for all four** is `v1(on)` (`guardian.test.ts:1068-1073`). In it, `session.repo` answers `C:/r` and every stat resolves, so Guardian's `plugin.json` is found (`register.js:631-643`). Add `answerWrites` (`guardian.test.ts:1058-1065`), because the log line needs the repository's root for its folder even under G1 and G8 (`register.js:949-951`), the way the log test sets it up (`guardian.test.ts:1469-1472`).
- **Helpers the file lacks:** only a `monitor(command)` input maker and a commandless one in P0's shape, beside `bash` and `ps` (`guardian.test.ts:120`, `guardian.test.ts:598`). `call`, `expectRefused`, `expectPassed`, `answerRepo`, `answerWrites` and `sha256` exist (`guardian.test.ts:105-118`, `guardian.test.ts:1050-1078`).
- **F5 and F6 pass.** No rule matches `echo …`, and the commandless trace is above.

### 5. The mutations
- **MU1** (the registration removed): T1 to T4 go red. N1 passes the call to the bottom handler, the call is reached, and `deny` is undefined.
- **MU2** (Monitor dropped from the map): T1 to T4 go red, because `target_sha256` reads `unavailable` instead of the command's sha256.
- **MU3**: a sound kill for T5 and T6. The call is denied and a log line is written, so both tests go red. It is applied and reverted in `register.js` only, a file the draft names. I agree with the custodian that it is a test-design point inside item 3 (e).
- **Recommended, not blocking: an MU4 for T6.** Replace `String(e.command ?? '')` with `e.command`. `splitSegments(undefined)` then throws at `register.js:86`, the catch refuses, and T6 goes red. This ties T6 to the exact line the draft's 1 (c) rests on.

### 6. The README words
§2.4 misses these lines, which become untrue or incomplete:
- `README.md:3` (the governing forms);
- `README.md:5` and `README.md:73` (the build of record);
- `README.md:17` (G6 row: "its Bash calls are not touched");
- `README.md:60` (nothing live before the E-rows);
- `README.md:61`, which needs a third clause: G2 to G4 read no Monitor command;
- `README.md:65` (the G8 bullet: shell writes into the user's Claude folder).

G9's row (`README.md:20`) is covered only by "any other row". `README.md:92` (R11) does not name Monitor; changing that is a rule change outside this piece and goes to the advisor as a proposal, so it is a note only. Words in D-5.

### 7. The update and the live checks
- E1's log check and its recomputed sha256 are underspecified (D-8).
- The inconclusive rule hides a failed prediction (D-7).
- Recording each check as a class 1 amendment is right.
- The hold has no exception for E1, which is itself a Monitor push, and no rule for a failed or inconclusive check (D-6).

### 8. Scope, the line budget and the gates
- Three files is right.
- The 200-line budget is plausible but has no counting command and no class 8 (D-2).
- The invalidator has no exclusions (D-3).
- The gates are missing `validate` (E-1).

### 9. Rules, reason texts, log fields, the installed copy, `claude` commands and tools
None found. The form changes no rule, reason text or log field; the map entry is a value the draft allows. It does no work in the installed copy, runs no `claude` command beyond the three, and adds no tool beyond Monitor. No STOP line.

---

## Documentation (must-fix before the form's first commit; every word below is the architect's)

**D-1. Numbering.** F1 to F6, T1 to T6 and E1 and E2 collide with the v0, v1 and N1 series (`guardian.test.ts:1-2`; the N1 form keeps its own B- series). Add: "This form's fixtures, tests and live checks are numbered M-F1 to M-F6, M-T1 to M-T6, M-E1 and M-E2, since the v0, v1 and N1 forms already use F, T and E numbers." Rename them throughout.

**D-2. §2's budget line.** Replace "Over 200 is a stop to the custodian before the commit." with: "Counted as insertions plus deletions by `git diff --numstat <base>...<head> -- tools/mods/spatial-guardian`, where `<base>` is the merge base on main and `<head>` is a named commit, both by id. Over 200 is a stop to the custodian before the commit. This budget stands where the template's §7 budget stands: an overrun is class 8 (round 25, item 2 (a)), and this line is never edited."

**D-3. §6's scope invalidator.** Replace it with: "a change outside the three Scope files, other than this form and the custodian's generated set (`governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**`, `state/**`);".

**D-4. §4, how a mutation is recorded.** Add: "Each new test carries a `// RECORDED MUTATION:` comment, as the file's tests do, naming the failing tests, the commit it was observed at and `claude --version` (round 25, item 2 (c)). A `verify-mutation` run is not an observation of a mutation."

**D-5. §2.4, the README lines.** Add: "also: the opening paragraph's list of governing forms, to add this form; the build line and the last bullet of "What it does not claim", to name the build of record and that Monitor's event shape was read at it; the G6 row, so that a Monitor call, like a Bash call, is not touched by G6; the first bullet of "What it does not claim", so that Monitor's refusal is not claimed live before M-E1; its second bullet, so that it also says G2, G3 and G4 read no Monitor command; and its G8 bullet, so that writes into the user's Claude folder by a Monitor command also stay allowed."

**D-6. §5.4, the hold.** Replace it with: "4. **The hold.** Until M-E1 is recorded as refused by Guardian G1 and M-E2 as run, nobody runs a push, a merge or a delete through Monitor (the draft, item 7). M-E1 itself is the one exception: it is the human's named check (the draft, item 6 (a)). An inconclusive or failed check keeps the hold and is a finding to the advisor."

**D-7. §5.2, a Git refusal.** Add after the inconclusive bullet: "The Guardian decides before the tool runs (`guardShell` calls `next(e)` only when no rule refuses), so a Git refusal or any Git output on M-E1 also means the call went through. It is recorded as inconclusive, as the draft says, and also as a failed prediction."

**D-8. §5.2, M-E1's log check.** Add: "The refusal log's day folder, named in words, is listed by script before the call and after its result, and exactly one new file appears. Its `target_sha256` is checked against the sha256 of the UTF-8 bytes of the `command` string in the tool call's input in the transcript, with no newline added. Its `reason` is G1's reason, byte for byte."

**D-9. §1's first may-claim bullet.** Replace "G1, G7, G8 and G9 in that order" with "G1, G7, G8 and G9, in that order by the code of `decideShell` (each fixture shows one rule)".

**D-10. Isolation (ADV-2026-11-22-01, item 9, at its line 45).** Add: "Amendment 1 states the worktree's path and that nothing is built. It shows, by a resolved-path read, that the worktree does not resolve into the main checkout's target folder, the folder its junction points to included, or into the sitting's fixtures."

**D-11. §2.4, name the additions.** Add: "The rules-table rows and the comment above `decideShell` are this form's reading of the draft's item 1 (d), "changed to match"; that item does not name them."

**D-12. §2.1, placement.** Add: "after N1's registration, so that N1 stays first."

**D-13. §4, the brief.** Add: "The worker writes test text that names a force-push, a merge, a plugin install or a clean with the Edit or Write tool, never through a shell command (the README's over-refusals), so that the live Guardian does not trip §6's refusal invalidator."

---

**Notes (not must-fix):**
- `register.js:1-2` lists only the v0 and v1 forms; it could name this form too.
- Name a merge commit for the PR, as the N1 node did.

**Constitution:** no docs/01 issue. ADR-006 does not apply (repository tooling). No docs/08 perf claim. The scope matches the human's message, item 2 (b). On the seam rule, the mod-to-engine Monitor event is read by P0 and P0b (E-1) and proven end to end from the real shape by M-E1 and M-E2. The caller rule is met: the new registration's caller is the engine, and no new `pub` or exported item is added.

**ADR skeleton:** none needed; no decision is missing.
