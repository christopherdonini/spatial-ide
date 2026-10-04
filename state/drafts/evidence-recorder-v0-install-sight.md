# Evidence Recorder v0 — install sight pack (for the human, before the typed install approval)

*The custodian's pack (2026-10-04), per the form's §9 Operator step (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md`). You sight the README's install, off and pruning steps and the points below. Then you give a typed install approval naming the E-rows you allow, and you install it yourself. Nothing here is a ruling. Installing is a red line: holds only, ruled in typed words.*

## Where it stands

- **PR #172** is at head 2d95575e. Both gates pass at gate 3, after two record-correction rounds (the record cap's limit):
  - the architect: PASS (gate-log 394, `state/consults/gates/2026-10-04-evidence-recorder-v0-gate3-architect.md`);
  - the reviewer: PASS (gate-log 395, `state/consults/gates/2026-10-04-evidence-recorder-v0-gate3-reviewer.md`). The plugin tests pass 20 of 20, and all 20 mutations were observed at the head.
- No code defect was found in any gate round. Every failure was in the record.
- CI is green at the head. It merges as a **merge commit only**, so that every branch commit the amendments name stays reachable from main.

## The order

1. You click the merge of #172, as a merge commit.
2. You give your typed install approval, naming the E-rows you allow (below).
3. You install it from a checkout on main, at user scope, using the README's Install section (`tools/mods/spatial-evidence-recorder/README.md`):
   - `claude plugin install spatial-evidence-recorder@spatial-ide-mods --scope user`. The marketplace is the directory source you added for Guardian. Whether it needs a refresh first is E0's to record.
   - `/reload-plugins`;
   - confirm the entry in `/plugin`;
   - start the session after the binary of record (2.1.289) is in place. E-rows count only from a 2.1.289-engine session.
4. Turning it off: `claude plugin disable spatial-evidence-recorder --scope user`, or disable it in `/plugin`. Never `disableAllHooks`, which also stops the repository's settings hooks.
5. The custodian records each E-row you allowed as a class 1 row on main.

## Read the last amendment first

- Amendment 3, then Amendment 2, then Amendment 1 (round 12 (e)).
- **Amendment 2's C2-d matters for the overhead.** The recorder's timing (`recorder_ms`, before + after + write) is a lower bound: the line's serialisation, its digest, the file name and the write call fall outside it (the gate-2 architect's G2-N-3, the reviewer's N-A).
  - So a p95 over §7's bound still fires the overhead stop.
  - A p95 at or under it does not establish the form's §1 claim 7, even after E5, until an amendment made before E5 names how the write's latency is measured. That amendment does not exist yet.
  - The README does not carry this reading (the gate-3 architect's G3-N-1). This pack does.
- The same lower-bound reading applies to the brief's acceptance measure for the overhead (G2-N-2).

## Where it writes, and what it never does

- **The log:** one JSON file per record, in a folder beside the main checkout, outside the repository: named after the checkout, plus `-local/evidence`, with one folder per day.
- **Pruning** is by hand at the weekly window: day folders older than 30 days. The mod never deletes.
- **Never:** it refuses, rewrites or answers no call; it adds nothing the model reads; it makes no model or network call. It returns every tool result exactly as produced. No recorder line is citable evidence in v0. That question is window item E.

## The E-rows (live checks after install, each run only if your approval names it; the form's §4)

- **E0:** the `/plugin` line, the Read-from line, whether the marketplace needed a refresh, and Guardian still enabled with its Read-from line unchanged.
- **E1:** nothing is run. At the first natural Guardian refusal of a Bash call, the custodian records whether a record was written. Predicted: none. O-14, whether E1 closes when the refused call is not approved, is still open for the next batched round.
- **E2:** `node --test` on a scratch passing file and on a scratch failing file, both outside the repository. Predicted: the error flag false, then true.
- **E3:** one `Explore` subagent, spawned once and resumed once. Predicted: two usage records, and none for the main loop.
- **E4:** (a) a subagent's `cd <clean worktree> && node --test <scratch>`; (b) in the main loop, `cd <worktree>`, then `node --test <scratch>`, then `pwd`, each its own call.
- **E5:** the first 20 approved runs after install in a 2.1.289-engine session: p50 and p95 of the timing sum. Read under C2-d, above.
- **E6:** a background `node --test <scratch>`. Predicted: no record.
- **E7:** for E2's runs, the record's text hash against the session transcript's stored result. A difference goes to you with both values, and it is read neither as an alteration nor as none without your ruling.
- **No probe writes into the repository**, and nothing G1-shaped is run on purpose (round 50, item 1).

## From install on

- Worker and tester briefs tell agents to run approved test commands through the Bash tool, so that they are recorded (round 50, item 1, O-12 (a)).
- **Acceptance:** after two weeks, or the next six gated pieces, whichever comes first. **Stop and uninstall:** any tool result altered; the overhead's p95 over §7's bound; `unavailable` over 20 percent. These are the brief's conditions, by the references in the form's §9 Operator. The custodian reports a stop to you, and you uninstall.

## One process note

The Co-Authored-By trailers of 609ab945 and 2d95575e name Claude Opus 5.5, but Sonnet 5.5 workers made those commits. The custodian's brief supplied the line (the gate-3 reviewer's N-J). The commits stay as they are, because no history is rewritten. Later briefs have the worker name its own model.
