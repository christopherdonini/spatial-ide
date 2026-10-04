*Custodian's filing note (2026-10-04): guardian-v0's worker-high report 2, correction round 1 under node:guardian-v0@g3. It STOPPED before any work, on the form's §5 I2: `claude --version` reads 2.1.289, and the form's build facts are about 2.1.288. Written by the worker to this path and committed as written below the rule. Its sha256, from this file's line 5 to the end, is c0a246fac832088146dd8b6739a46278333e798d8a6d19bcee16ba5e2dd4b15c, equal to the hand-back. **The custodian's reading:** I2 names its own remedy, every test and `validate` re-run and the change recorded. So the round resumes at 2.1.289 once the architect's amendment records the change, and it carries the shell-route ruling's code with Amendment 2's. The installed binary was replaced at 2026-10-04 10:53 local, after the human's restart for the rollout switch. The custodian's running session remains 2.1.288, and 2.1.289's bundled types are not readable without loading a skill in a 2.1.289 process. Worker cost: 98,525 subagent tokens, 19 tool uses, 84,282 ms.*

---

# guardian-v0 worker report 2 — correction round 1

Tag: `node:guardian-v0@g3`. Branch `cut/guardian-v0`, `<worktree>` = `C:/dev/wt/guardian-v0`, HEAD de6a2c0212cb5026f7d71d08557eb36078793257 (unchanged by me).

## Verdict: STOPPED, no work done. Invalidator I2 fired.

The form's §5 invalidator I2 reads: `claude --version` is not 2.1.288 at any run of record; every plugin test and `validate` is re-run, and the change is recorded. It is listed under "Invalidators (stop, to the custodian)", and the brief makes §5's I1 to I10 binding with "if one fires, stop and report". I stopped at my first run of record, before any edit.

## Blocking finding (one)

- B1, I2: `timeout 60 claude --version` printed `2.1.289 (Claude Code)`, exit 0, on two separate runs. Every claim in the form (§0.1, §0.2, §1, Amendment 1) is a claim about build 2.1.288, and the form's build facts are "not current for any other build" (§0.1, last sentence). The custodian's brief names no build; whether 2.1.289 is accepted, and whether the d.ts read (Amendment 1, sha256 36af9e47...cdb1 for `<skill-root>/types/claude-code.d.ts`) must be redone against it, is the custodian's to rule. I did not locate or hash the 2.1.289 `<skill-root>` files (not in scope; they live under the user profile).

## What I did (read-only)

No file was edited, no commit made, nothing pushed. Commit list: none. Edits to `register.js`, `guardian.test.ts`, README: none.

Runs, each from `<worktree>`:

| Command | Exit |
|---|---|
| `git status --porcelain` (start) | 0, empty |
| `timeout 60 claude --version` (twice) | 0, 0; both `2.1.289 (Claude Code)` |
| `timeout 300 claude plugin test tools/mods/spatial-guardian` | 0; ` 34 pass`, ` 0 fail`, `Ran 34 tests across 1 file. [1.30s]`; no rollout-switch refusal |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian` | 0, passed with one `version` warning |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian --json` | 0, `"success": true` |
| `timeout 120 claude plugin validate tools/mods` | 0, passed with one `version` warning |
| `timeout 120 claude plugin validate tools/mods --json` | 0, `"success": true` |
| `git status --porcelain` (end) | 0, empty |

I did not run the node suites, the verify scripts, or the §7 count: they depend on the code this round was to change, so their output now would be the unchanged head's and not the correction head's.

### `claude plugin test` output at 2.1.289, HEAD de6a2c02 (34 tests, all `(pass)`)

Test names in order, each `(pass)`: the nine G1 tests (T1 to T9), `G2 refuses a Write and an Edit to docs/01_Principles.md in every spelling`, `G2 allows a Write beside docs/01_Principles.md`, `G3 refuses an Edit to an accepted ADR`, `G3 refuses a Write that does not start with a filed preregistration's current bytes`, `G3 allows a pure-append Write to a filed preregistration`, `G3 allows an Edit to a Proposed ADR and to an untracked preregistration`, `G3 refuses when the current bytes cannot be read`, `G3 allows an Edit that only appends at the end of a filed preregistration`, `G4 refuses a Write to an existing directive and any Edit under state/directives/`, `G4 allows a Write that creates a new directive`, `Write and Edit refuse a path that cannot be placed`, the four G6 tests, `a refusing hook that throws is refused by its catch`, `a refusing hook whose process call times out is refused`, `every process call is git and carries the declared timeout`, the six N1 tests, `G2 to G4 cover NotebookEdit`. Summary lines: ` 34 pass`, ` 0 fail`, `Ran 34 tests across 1 file. [1.30s]`. This is evidence of the unchanged head at 2.1.289 only. It is not an observation of any mutation.

### `claude plugin validate` at 2.1.289 (the I3 check)

Text, `tools/mods/spatial-guardian`, exit 0:

```text
Validating plugin manifest: <worktree>\tools\mods\spatial-guardian\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

Validating hooks: <worktree>\tools\mods\spatial-guardian\hooks\hooks.json

  ❯ ./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}
  ❯ ./register.js calls: $.agent.list (via g6Refusal), $.fs.read (via g3Refuses), $.fs.stat (via place), $.process.run, $.session.messages (via g6Refusal), $.session.usage (via contextFill)

✔ Validation passed with warnings
```

(The worktree path is shown as `<worktree>` here; the tool printed the absolute path.) The hooks line and the calls line equal §2.0's set plus Amendment 1's PowerShell and NotebookEdit, so I3 did not fire at 2.1.289 on the unchanged head.

`--json`, same target, exit 0: `success: true`, `strict: false`, manifest `errors: []`, one warning `{ "path": "version", "message": "No version specified. Consider adding a version following semver (e.g., \"1.0.0\")", "code": null }`, one `contents` entry of type `hooks` with `errors: []`, `warnings: []`, and the same two `notes` strings as the text lines above.

`tools/mods`, text, exit 0: `Validating marketplace manifest: <worktree>\tools\mods\.claude-plugin\marketplace.json`, one warning `plugins[0] plugin.json → version: No version specified. Consider adding a version following semver (e.g., "1.0.0")`, `✔ Validation passed with warnings`. `--json`, exit 0: `success: true`, `strict: false`, type `marketplace`, `errors: []`, the same one warning (path `plugins[0] plugin.json → version`), `contents: []`.

These four outputs are at the unchanged head and do not discharge scope item 4, which is for the correction head.

## Not done (all of the round's scope)

1. The second reading in `register.js`, T37 to T39, the mutation observations, and the T1 to T9 re-observation.
2. README items R1 to R6.
3. The §7 count at the correction head. At adfcb857 the reviewer's figure was 1555 lines over 10 files (`state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:67`); the estimate for this addition is 85, which would land under 1650.
4. The validate outputs at the correction head, the node suites and the four verify scripts at the correction head.

## What I need from the custodian

A ruling on I2 (build 2.1.289 against the form's 2.1.288), one of: the round proceeds at 2.1.289 with the change recorded and the d.ts re-read, or the machine is returned to 2.1.288. Then re-dispatch. Whichever is chosen, every plugin test and validate of record is at the one build, and the observation comments name `claude --version` as the form's §4 requires. I plan, on re-dispatch, to commit the code and tests first (the observation commit), observe every mutation against that commit, then commit comment-only updates naming it, as 54eba872 and adfcb857 were handled in round 1.

## Pre-gate self-check (the four classes), as far as this stop allows

No code landed, so: no cross-module interface was written; no completion claim is made; no user-facing message was changed; no test was added. The only claims here are the command results above.

Model I observe myself running as: Sonnet 5.5 (claude-sonnet-5-5), the worker-high variant, no override beyond the dispatch's stated escalation reason. Context handoff received: none beyond the brief. No local token figure at hand.

## Exact state left

`git status --porcelain` in `<worktree>`: empty. HEAD de6a2c0212cb5026f7d71d08557eb36078793257, `cut/guardian-v0`, no commit and no push by me. No `claude` command run other than `--version`, `plugin test` and `plugin validate`. Nothing written under the user Claude directory. This file is the one write outside the worktree.
