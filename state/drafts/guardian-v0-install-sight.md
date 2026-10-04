# Guardian v0 — install sight pack (for the human, before the typed install approval)

*The custodian's pack (2026-10-04), per the form's §9 Operator step (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md`): the human sights §7's reasons and the README's install and off steps; then gives a typed install approval naming the E-rows allowed; then installs it himself. Nothing here is a ruling. Installing is a red line: holds only, ruled in typed words.*

## Where it stands

- **PR #169** is at head 1d057c79, and both gates pass:
  - architect gate 2: PASS (gate-log 381, `state/consults/gates/2026-10-04-guardian-v0-gate2-architect.md`);
  - reviewer gate 2b: PASS (gate-log 383, `state/consults/gates/2026-10-04-guardian-v0-gate2b-reviewer.md`), with the plugin tests at 39 of 39 and all 39 mutations observed at the head.
- CI is green at the head.
- It merges as a **merge commit only**.

## The order

1. You click the merge of #169, as a merge commit.
2. You give your typed install approval, naming the E-rows you allow (below).
3. You install it from a checkout on main, at user scope, using the README's Install section (`tools/mods/spatial-guardian/README.md`, its lines 46-55 at 1d057c79):
   - `claude plugin marketplace add <repository>/tools/mods --scope user`;
   - `claude plugin install spatial-guardian@spatial-ide-mods --scope user`;
   - `/reload-plugins`;
   - confirm that the `/plugin` line shows the mod active.
4. Turning it off (README lines 57-63):
   - Guardian alone: disable it in `/plugin`, or `claude plugin disable spatial-guardian --scope user`;
   - one session: start with `--safe-mode`;
   - never `disableAllHooks`, which also stops the repository's Stop hook and round mirror.
5. The custodian records each E-row you allowed as a row on main.

## §7's reasons, for your sight

Byte-copied from `tools/mods/spatial-guardian/hooks/register.js` at 1d057c79, lines 27-33 and 36:

```text
spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.
spatial-guardian G2: refused, because docs/01 is never edited.
spatial-guardian G3: refused, because an accepted ADR or a filed preregistration changes only by appending.
spatial-guardian G4: refused, because an existing directive is never rewritten.
spatial-guardian G6: refused, because this run writes only its brief's REPORT PATH.
spatial-guardian: refused, because the path cannot be placed.
spatial-guardian: refused, because a check could not complete.
Context at N%: flush the continuity block now (rewrite, commit, push), then continue.
```

The last two reasons carry no rule id (the gate-2 reviewer's N-3). They are for your sight only. In the N1 line, N is the integer fill.

## The E-rows (live checks after install, each run only if your approval names it)

- **E0:** the `/plugin` line, `claude --version`, and whether the installed plugin is a copy or a reference to `tools/mods/`.
- **E1 to E3:** an Edit whose old text matches nothing, made on `docs/01_Principles.md`, on an existing directive and on an accepted ADR. Predicted: Guardian's reason, never the Edit tool's not-found error. If a rule failed open, the tool writes nothing.
- **E4:** a main-loop Write that creates a new file in the session scratchpad. Predicted: it passes. It shows the live missing-file shape (round 46, item 2).
- **E5:** a labelled probe lead-data run that declares a REPORT PATH and writes once elsewhere. Predicted: refused. Its write-audit VOID is recorded as the probe's.
- **E6:** N1's first natural firing, recorded with the percent and the flush that followed.
- **No live G1 probe** (round 34, item 3).

## Things to know before approving

1. **The rollout switch.** The engine has twice refused `claude plugin test` with the message that hooks modules are turned off by a saved rollout switch, and twice passed again within the hour:
   - refused at 2026-10-03 22:03Z;
   - refused again from about 2026-10-04 09:57Z to 10:07Z;
   - passing at 08:56Z, 10:12Z, 10:14Z and 10:20Z.
   The engine's own line says that if the refusal returns, installed mods are turned off remotely. An installed Guardian may therefore sometimes not run. E1 to E3 would show it, because each predicts Guardian's reason. A guess, unverified: the custodian's long-running session is still on build 2.1.288 while new processes run 2.1.289.
2. **A wording slip in the README** (the gate-2 architect's S2-1, the custodian's error). README line 44 calls the write audit the primary check of report-only runs, without the condition that line 73 and the form's §2.7 carry: primary until E5 passes, the backstop after. Line 73 and §2.7 govern, and line 44 is narrowed after E5 through the usual process. Line 44 also opens with a stray label, `R11.` (N-1).
3. **The known limits** are in the README's limits section and the form's §1. G1 reads the command string only, and does not cover PowerShell's backtick escape or bash brace expansion (round 47). G2 to G4 do not guard writes made through a shell (round 48). G6 reads only the newest 4096 rows of a run. The README also lists G3's case-alias miss and the over-refusals: text that merely mentions a force-push is refused.
4. **G6's shell refusal is a backstop** (your 2026-10-04 G6-backstop ruling): no report-only definition holds a shell tool today, and G6 does not cover Bash.
