*Custodian's filing note (2026-10-20): the worker's report for `governance-decisions-pending-open-and-archive` (piece C), correction round 1 after gate 1 at G0 (the form's Amendment 5 items 1 and 2), in C:/dev/wt/dpa from 6b8b3688; the head b83681d8b5a97260a52ce9286455be5aa25efa9f, pushed. The run 2026-10-20T13:08:19Z to 13:14:33Z by its transcript (Bash 22, Read 2, Edit 3); its one SubagentHandback call, at 13:14:32Z; MT4 applied and reverted, the runs and the push are each in the transcript. Extracted by script; 0 path:line cite(s) into files or lines only on the branch de-rooted to words; one final newline added if absent; nothing else changed.*

---

Both changes are done and pushed to origin (ordinary update, exit 0). The branch head is b83681d8b5a97260a52ce9286455be5aa25efa9f, up from 6b8b3688. The start check passed (head confirmed, porcelain empty). The final `git status --porcelain --untracked-files=all` prints nothing.

**Commits**
- 904ea7c1a09edf4f4296f714e8d9d715ba69934f: R11 fix.
- 9fc4f2c68247605c669f4652545770065fcf1c58: the MT4 record comment.
- b83681d8b5a97260a52ce9286455be5aa25efa9f: the §34 sentence.

**R11, in `scripts/plan/rotate-decisions-pending.test.mjs`**
- `mkRepo` now commits only `T.md` and `X-PREREGISTRATION.md`. The ledger is committed afterwards, so the refs can name that commit.
- The moved RULED block holds two refs of the form `` `T.md:1-2` @ <40-hex v1> sha256:<hex> ``: one valid, one made with `sha('a wrong figure')`.
- New assertions (the old `hashFindings.length, 0` is replaced):
  - `quotes.hashFindings.length === 1`.
  - `hashFindings[0].relPath` equals `` `state/cut-archive/${fs.readdirSync(path.join(dir, 'state', 'cut-archive'))[0]}` `` with the message 'the archive is scanned'.
  - `hashFindings[0].reason` matches `/sha256 mismatch/`.
- The test file passes: 12 of 12, exit 0.
- MT4 was applied at 904ea7c1a09e. The mutation made `defaultHashScanFiles` keep only the live ruling file (`rulingFiles(...).slice(0, 1)`), which drops the archives from the hash scan.
  - Result: exit 1, pass 11, fail 1.
  - The failing test was R11 only, by name: `rotate-decisions-pending: after a rotation commit the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference`.
  - I reverted with `git checkout` of `verify-quotes.mjs`, and the porcelain was clean.
  - The record is a `RECORDED MUTATION (MR11b) at 904ea7c1a09e` comment placed right after the MR11 line. It sits in its own commit, because amending would have changed the id it cites.
  - I applied the mutation by hand and did not run `verify-mutation` as an observation.

**§34 Part B (ii) in `AUTONOMY.md`, first sentence**
- Before: "Under `## Pending`, a RULED, DIRECTIVE, FELT VERDICTS or CLOSED block is archived, and so is a numbered entry whose head carries a RULED, RESOLVED or APPLIED marker or that the human strikes (`--archive-entries`)."
- After: "Under `## Pending`, a RULED, DIRECTIVE, FELT VERDICTS or CLOSED block is archived, and so is a numbered entry whose head opens with a bracketed RULED, RESOLVED or APPLIED marker (`<n>. **[RULED`, `**[RESOLVED`, `**[APPLIED`) or that the human strikes (`--archive-entries`)."
- The new text was extracted by script from the report line starting `- **Replacement for its first sentence:** "`. The change is one line and nothing else in `AUTONOMY.md` changed.
- `cmp -n <size of M0 564aadae's AUTONOMY.md> <M0 file> AUTONOMY.md` exits 0.

**Commands and exit codes**
- `node --test scripts/plan/rotate-decisions-pending.test.mjs`: exit 0 (12 of 12).
- CI globs, run inside a shared hold: exit 0, 509 tests, 509 pass, 0 fail. The hold was granted, and `MACHINE_RELEASED` printed afterwards.
- `node scripts/plan/verify.mjs --offline`: exit 0.
- `verify-cites.mjs`: exit 0.
- `verify-quotes.mjs`: exit 0.
- `verify-test-claims.mjs`: exit 0.
- `verify-mutation.mjs`: exit 0.
- §7 counting command, using the exact `git diff --numstat` plus `awk` from the form: `858 15` (858 lines over 15 files). That is within 1,260 lines over 16 files.
- `git push origin cut/decisions-pending-open-and-archive`: exit 0.

**Differences from the brief**
- There are three commits instead of two, because the MT4 record needs the fix commit's id.
- The light verify scripts ran outside a hold, each under `timeout 400`. Only the globs ran under a hold.
- I ran each `verify-*` script with its exit code taken directly from the foreground command (no pipe). I did not use the 300 s timeout flag on the tool call itself.

**Model:** the harness reports claude-sonnet-5-5 (Sonnet 5.5), with no override and no context handoff.

**Self-check:** the only cross-module read was `verify-quotes.mjs` and `rulingSet.mjs`, which R11 calls through the real rotation. Every completion claim above points to a test or exit code listed here. I added no user-facing messages.
