# The Guardian checks a Monitor command as it checks a Bash command: one registration on the shell decision, Monitor in the refusal log's target map, a commandless watch still allowed, and two live checks after the human's restart (full form)

- **Path (proposed):** `governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `guardian-checks-monitor-commands`.
  - The human's message of 2026-11-22, item 2 (b) (`state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md`).
  - The draft ADV-2026-11-22-02 (`state/consults/2026-11-22-advisor-draft-adv-2026-11-22-02-the-guardian-checks-a-monitor-command-as-it-checks-a-bash-command-not-the-humans-words.md`), approved by the human's typed message (`state/directives/2026-11-22-the-humans-approvals-adv-2026-11-22-02-03-06-the-guardian-and-monitor-the-trial-pins-the-hooks-readme-sentences.md`). Under the grant of 2026-11-13, item 4, the draft is now the human's words. By its item 4 (a), that approval is also the human's typed approval naming the piece's live checks (the grant, item 5 (e)): the two of its item 6, and no others.
  - The advisor's ruling ADV-2026-11-22-01, item 5, under the human's delegation of 2026-11-13 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md`): a full form, both gates, on the piece's own branch, never in the installed copy.
  - The advisor's ruling ADV-2026-11-22-11, item 2, under the same delegation (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-11-no-place-under-the-cap-stands-idle-before-the-sitting-a-free-place-starts-the-next-piece-without-asking.md`): this piece is among the human's open pieces of 2026-11-22.
- **Committed before any code.** Append-only once committed.
- **Form and gating:** full form, both gates (the draft, item 4 (b)). The architect gates this form before its first commit. The code gates at the head are the reviewer and the architect.
- **Merge:** it may merge before the v0.2 tag (the draft, item 4 (c)). The advisor merges (the grant, item 5). The merge check names the human's approval above as the typed approval naming the live checks.
- **Reuse index:** no prior art recorded for hook guard monitor command or refuse tool call shell command (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian on 2026-11-22). Nothing is ported.

## Isolation

- The worktree is `C:/dev/wt/guardian-monitor`, on the branch `cut/guardian-monitor`, created by the custodian from main at dispatch.
- No build output: nothing is compiled. `claude plugin test` runs on the worktree's copy of the mod. The engine-written `.claude-plugin/types/` folder lands in that copy and is kept out of git by the mod's `.gitignore`.
- Never in the main checkout's `tools/mods/spatial-guardian`, which is the installed copy (the draft, items 2 and 5). If a standing rule or the Guardian refuses the work in the worktree, the worker stops, and so does the custodian. The custodian sends the change to the human as a patch file, and the human applies it themselves (the draft, item 2).
- The piece's first record is Amendment 1, P0 (section 0). Amendment 1 states the worktree's path and that nothing is built. It shows, by a resolved-path read, that the worktree does not resolve into the main checkout's target folder, the folder its junction points to included, or into the sitting's fixtures.

## §0. P0: the Monitor call's shape on the installed build, read-only before any code, then P0b on the registration line alone before any test (the draft, item 3 (a))

The worker runs P0 in the worktree and returns it in its report. It runs no `claude` command but `claude --version`, `claude plugin validate tools/mods/spatial-guardian` and `claude plugin test tools/mods/spatial-guardian` (the draft, item 3).

1. `claude --version`, byte for byte.
2. `claude plugin validate tools/mods/spatial-guardian`, its whole output byte for byte, with its hook lines.
3. The engine-written types under the worktree's `tools/mods/spatial-guardian/.claude-plugin/types/`: every declaration that names Monitor, byte for byte with its file and line, or a whole-folder search showing that none does. Then the shape of the event a `tool.call` handler receives, and what it shows of a Monitor call: its fields, and whether `command` and `ws` reach the handler.
4. Whether the types accept the filter `{ tool: 'Monitor' }` in `on('tool.call', …)`, by the same declaration the Bash filter uses.
5. **P0b, after Amendment 1 is committed and before any test.** The worker writes the one registration line of section 2, item 1, and nothing else. It then runs `claude plugin validate tools/mods/spatial-guardian` and returns its whole output byte for byte in its report. A Monitor hook line in the form of the Bash line is expected, and every other hook line is byte-identical to item 2's. No Monitor line, or a warning or an error that names Monitor or the filter, is a stop, to the human.

The custodian records items 1 to 4 as **Amendment 1, headed P0** (class 1). No code is written before Amendment 1 is committed. The custodian records item 5 as **Amendment 2, headed P0b** (class 1), and no test is written before Amendment 2 is committed.

**Stops, to the human** (the draft, item 3 (a), where the piece stops and comes back to the human): the engine hands no Monitor call to a `tool.call` handler; the event does not carry the command as the top-level string field `command`, the field `decideShell` reads; the types do not accept the filter; or no declaration names Monitor, so that the types do not show a Monitor call's fields. A field P0 finds beyond the four the draft names (`description`, `timeout_ms`, `command`, `ws`) is recorded. It is a stop, to the human, when it can change what runs or where: a second command or script, a shell or interpreter selector, a working directory, a file path or an environment map. The custodian, not the worker, makes that reading and records it in Amendment 1.

## §1. What the piece may and may not claim

- **May claim,** under `claude plugin test` at the build of record, on Windows:
  - A Monitor call's command goes through the shell decision Bash has, G1, G7, G8 and G9, in that order by the code of `decideShell` (each fixture shows one rule), and is refused with that rule's reason. The refusal log gains one line naming the tool Monitor.
  - A harmless command, and a call with no command, reach the engine unchanged, with no log line.
  - After the live checks, only what they show: the installed copy refused the force-push dry run of item 6 (a) by G1 and logged it with the tool Monitor, and let the echo of item 6 (b) run.
- **May not claim:**
  - That Monitor is now guarded against anything a Bash command is not. The README's list of what the shell rules do not read holds for Monitor as written.
  - G6 on Monitor: it is not added (the draft, item 1 (a)).
  - That a watch with no command is read: it holds no command, so no rule reads it.
  - Anything about the other tools on the draft's item 8 list.
  - Anything live before the live checks.
- **Out of scope:**
  - every other tool on the draft's item 8 list (each comes to the human as a separate proposal);
  - any rule, reason text or log field; G6;
  - `hooks.json`, `plugin.json`, `continuity.mjs`, `.gitignore`, the marketplace, and every file under `scripts/hooks/`.

## §2. The change (the draft, item 1, exactly)

1. **The registration.** `hooks/register.js`, in `register(on)`, gains one line beside the Bash line, after N1's registration so that N1 stays first. It has the same shape, with the tool name Monitor and the same `.catch`: `guardShell` with `isPowerShell` false. So G6 is not applied, and G1, G7, G8 and G9 are, in that order (the draft, item 1 (a)). If P0 shows that the filter takes another shape, the worker stops before any code.
2. **The target map.** `logRefusal`'s map gains Monitor, mapped to the call's command (the draft, item 1 (b)).
3. **A commandless watch.** `decideShell` reads the command as `String(e.command ?? '')`. With no command that is the empty string, which no rule refuses, so the call reaches `next(e)`. No code is added for this; a test shows it (the draft, item 1 (c)).
4. **The words** (the draft, item 1 (d)):
   - the comment above `decideShell`, to name Monitor among the shell hooks;
   - in `README.md`: the rules table's naming of the shells in G1's and G7's rows, and in any other row that names them; the "What it does not claim" bullet on tools that are not registered, with a clause that a watch with no command is not read, that G6 is not applied to Monitor, and that G2, G3 and G4 read no Monitor command; one sentence in "The shell route" saying that a Monitor command is read by the same shell decision, without G6; and "Files" only where one of its lines becomes untrue. Also, where they become untrue or incomplete: the opening paragraph's list of governing forms, to add this form; the build line and the last bullet of "What it does not claim", to name the build of record and that Monitor's event shape was read at it; the G6 row, so that a Monitor call, like a Bash call, is not touched by G6; the first bullet of "What it does not claim", so that Monitor's refusal is not claimed live before M-E1; and its G8 bullet, so that writes into the user's Claude folder by a Monitor command also stay allowed.
   - The worker lists each changed README line, before and after.
   - The rules-table rows and the comment above `decideShell` are this form's reading of the draft's item 1 (d), "changed to match"; that item does not name them.
5. **Nothing else:** no other tool, rule, reason text or log field.

**Scope (3 files):** `tools/mods/spatial-guardian/hooks/register.js`, `tools/mods/spatial-guardian/test/guardian.test.ts`, `tools/mods/spatial-guardian/README.md`. **Line budget:** at most 200 changed lines over the three, this form excluded (expected, as counted below: about 5 to 9 in `register.js`, 80 to 140 in the tests, 18 to 30 in the README). Counted as insertions plus deletions by `git diff --numstat <base>...<head> -- tools/mods/spatial-guardian`, where `<base>` is the merge base on main and `<head>` is a named commit, both by id. Before each commit, the worker counts the staged change the same way, by `git diff --numstat --cached <base> -- tools/mods/spatial-guardian`; over 200 is a stop to the custodian before that commit. This budget stands where the template's §7 budget stands: an overrun is class 8 (round 25, item 2 (a)), and this line is never edited.

## §3. Fixtures and predicted outcomes (the draft, items 3 (b) to (d))

The fixtures take P0's shape. Each is inert: the test's bottom handler stands in for the engine's tool, so nothing runs. The worlds for G7 and G9 answer the repository lookups as the existing Bash tests of those rules do, using their helpers. This form's fixtures, tests and live checks are numbered M-F1 to M-F6, M-T1 to M-T6, M-E1 and M-E2, since the v0, v1 and N1 forms already use F, T and E numbers.

| Fixture | Command (or input) | Predicted |
|---|---|---|
| M-F1, G1 | a force-push, `git push --force origin HEAD:refs/heads/guardian-monitor-fixture` | refused with G1's reason; not reached; one log line |
| M-F2, G7 | a merge, `gh pr merge 1 --merge` | refused with G7's reason; not reached; one log line |
| M-F3, G8 | a plugin install, `claude plugin install some-plugin` | refused with G8's reason; not reached; one log line |
| M-F4, G9 | a clean of the target, `cargo clean` in the main checkout's world | refused with G9's reason; not reached; one log line |
| M-F5 | `echo guardian-monitor-probe` | reached once, unchanged; no log write |
| M-F6 | a watch with no command, in P0's shape | reached once, unchanged; no log write |

For M-F1 to M-F4, the line is checked as the existing log test checks it. Its fields are exactly the seven declared ones, and its values are:
- the rule;
- the tool `Monitor`;
- the agent `main`;
- `target_sha256` equal to the sha256 of the fixture's command;
- the rule's reason.

The line holds no command text (the draft, item 3 (d)).

## §4. Tests, each red under a declared mutation (the draft, item 3 (e))

- **M-T1 to M-T4** (M-F1 to M-F4) are red under both of the draft's mutations:
  - **MU1**, the Monitor registration removed: the call reaches the engine;
  - **MU2**, Monitor dropped from the target map: `target_sha256` reads `unavailable`.
- **M-T5 and M-T6** (M-F5 and M-F6) cannot fail under either. MU1 and MU2 only remove a refusal, or the line a refusal writes. So this form declares **MU3** for them: the Monitor registration's handler made to refuse every call, by `refuse` with the catch verdict in place of `guardShell`. Under MU3 both are red by name.
  - MU3 is this form's addition to the draft's two. It is a test-design point that changes no file the draft does not name, and the architect's form gate reads it.
- **How each mutation is shown:** applied by one anchored command that fails unless its anchor occurs exactly once; the test file run; the failing names byte-copied; reverted; the file shown equal to its committed bytes. Each new test carries a `// RECORDED MUTATION:` comment, as the file's tests do, naming the failing tests, the commit it was observed at and `claude --version` (round 25, item 2 (c)). A `verify-mutation` run is not an observation of a mutation.
- **The existing tests:**
  - all pass unchanged at the head, with the count before and after;
  - `node --test "scripts/hooks/*.test.mjs"` passes unchanged, the parity test among them.
- **Testing while writing:** the paragraph of the human's message that begins "Testing while writing the code" goes as written into the worker's brief. The worker writes test text that names a force-push, a merge, a plugin install or a clean with the Edit or Write tool, never through a shell command (the README's over-refusals), so that the live Guardian does not trip §6's refusal invalidator.

## §5. The update and the two live checks (the draft, items 5 to 7)

1. **The update.** After the advisor's merge, the custodian fast-forwards the main checkout to the merge commit and reports it at a clean stop. The custodian never reloads. The human restarts the custodian's session; that restart is the human's only step (the draft, item 5).
2. **M-E1 and M-E2,** in the custodian's session after the restart, exactly as the draft's item 6 (a) and (b), their commands copied by script from the draft:
   - **M-E1:** predicted refused by Guardian G1, with G1's reason. The refusal log gains one file: rule G1, tool Monitor, agent main, and `target_sha256` equal to the sha256 of the command, recomputed by script from the transcript. The refusal log's day folder, named in words, is listed by script before the call and after its result, and exactly one new file appears. That sha256 is of the UTF-8 bytes of the `command` string in the tool call's input in the transcript, with no newline added, and the new file's `reason` is G1's reason, byte for byte.
   - **M-E2:** predicted to run; its line arrives as an event; no log file is written.
   - If Git, the harness's permission layer or any layer other than the Guardian refuses first, the check is inconclusive, and that layer is not loosened.
   - The Guardian decides before the tool runs (`guardShell` calls `next(e)` only when no rule refuses), so a Git refusal or any Git output on M-E1 also means the call went through. It is recorded as inconclusive, as the draft says, and also as a failed prediction.
   - There is no real force-push, merge or clean.
3. **The record.** Each live check is recorded as a class 1 amendment of this form on main.
   - A failed prediction is a finding to the advisor. Nothing is loosened or retried in another form.
4. **The hold.** Until M-E1 is recorded as refused by Guardian G1 and M-E2 as run, nobody runs a push, a merge or a delete through Monitor (the draft, item 7). M-E1 itself is the one exception: it is the human's named check (the draft, item 6 (a)). An inconclusive or failed check keeps the hold and is a finding to the advisor.

## §6. Invalidators (a stop, to the custodian; a P0 or P0b stop goes on to the human, as section 0 says, and a standing rule's or the Guardian's refusal in the worktree as Isolation says)

- a P0 or P0b stop (section 0);
- the existing tests red at the base;
- `claude plugin test` unavailable;
- a Guardian or harness refusal of the worker's work in the worktree;
- a change outside the three Scope files, other than this form and the custodian's generated set (`governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**`, `state/**`);
- the line budget exceeded;
- a mutation that does not turn its tests red;
- any change to a rule, a reason or a log field.

## §7. Gates

- **The architect, now:** this form, before its first commit.
- **The reviewer, after the build:**
  - the diff against section 2;
  - each fixture against section 3 and P0;
  - each mutation reproduced by Bash on its own export, never by Edit;
  - the README lines against the code;
  - `claude plugin validate tools/mods/spatial-guardian` at the head, with `claude --version`: the Monitor hook line present, every other line byte-identical to P0's item 2;
  - the existing tests and the scripts' hook tests.
- **The architect, after the build:** the change against the draft and section 1's claims; the README's claims against the code.
- **Findings:** Correctness and Evidence findings block. Documentation findings are fixed before the merge.

## Amendments

*(Opens empty; append-only. Amendment 1 is P0's record; Amendment 2 is P0b's.)*
