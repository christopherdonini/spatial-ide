# PR #171 gate 1 — reviewer (single gate)
Reviewed: cut/claude-md-stale-facts @ 5607bf609b2b4f518743588f3717f07ac67c1f00

Tag: `node:claude-md-stale-facts@g1`. Base main 884fc7271f9ef78187578164b7032a5f4ba97084. Governing form: `CLAUDE-MD-STALE-FACTS-PREREGISTRATION.md` (the five-line form, on main at 884fc727). Gate: `AUTONOMY.md` §21b, single combined gate.

## Verdict: PASS

No S1. Two S2 (should-fix, not blocking), four N.

## Out-of-scope line (read first, §21d)

The form's `Out-of-scope` line asserts ADR none, security none, wire none, guarantee none. Checked against `AUTONOMY.md` §21a's four categories:

- ADR: the diff touches no file under `docs/adr/`; ADR-001, ADR-009, ADR-010 and ADR-011 are cited only. True.
- Security: no change to licence, visibility, origin config or bundling. ADR-009's status is restated as its status line records it (`docs/adr/ADR-009-license-and-open-core-boundary.md:3 @ 884fc727 sha256:8687d8432af1b270ec83e1bcdf0dfccc5227a1809ec2b0c8c8e0ee1d9213b410`). True.
- Wire: nothing under `protocol/skp/**`, no MCP surface. True.
- Guarantee: `CLAUDE.md:12-17` (the non-negotiables) are byte-identical and unmoved. The only test reading CLAUDE.md's content is `scripts/plan/verify.test.mjs`, which relies on the ADR-010 citation; that span is byte-identical (see check 3). True.

The line is not false. No §21a category is touched, so the single-gate route stands.

## Check 1 — the diff

- `git diff --stat origin/main...origin/cut/claude-md-stale-facts`: `CLAUDE.md` only, 5 insertions, 5 deletions (rc 0). `gh pr view 171` also lists only `CLAUDE.md +5 -5`.
- Per-line sha256 comparison of all 38 lines, main 884fc727 against head 5607bf60: they differ at 8, 23, 24, 28 and 38 only. Both files are 38 lines, LF only (0 CR), with a trailing newline.
- `PRECEDENTS.md:309`, `:323`, `:338`, `:350`, `:366` and `:378` cite `CLAUDE.md:12` to `:17` as verbatim. `verify-quotes.mjs --show-cites PRECEDENTS.md` resolves all six against the head (rc 0).
- `git grep` for cites into `CLAUDE.md:8|23|24|28|38` finds hits only in `state/cut-archive/` (history) and `state/drafts/weekly-window-2026-10-09.md` (the triage table, exempt). The archive cite at `state/cut-archive/CUT-STATE-residency-debt.md:347` names line 8's phrase about public code, and that phrase still sits in the byte-identical bold note.

The new lines, pinned at the head (branch commit; this report is under `state/consults/gates/`):
- `CLAUDE.md:8 @ 5607bf60 sha256:95167d4b97eac03577bb6543f3b360e7c99326a22ae443883f6e5d5d23712130`
- `CLAUDE.md:23 @ 5607bf60 sha256:56dc9eaeaab98b73145fee4cf781aeda4550c63a520217ae32edb4728cf6d5b6`
- `CLAUDE.md:24 @ 5607bf60 sha256:f9eba8461fe8dfa152cd57683d2854f09d9d9495fb46abee83b2d880b311ff34`
- `CLAUDE.md:28 @ 5607bf60 sha256:998b4e5e13cfbbe48b33e0daf2e69c7feea90b321fff3663ce84b18e4459ecb9`
- `CLAUDE.md:38 @ 5607bf60 sha256:1a0bc9967e06f72d4e41df52407b9358c85fbfe274f390dddb1127d6254ac0ba`

## Check 2 — each fact against its source

| Fact (new line) | Source | Result |
|---|---|---|
| v0.1.0 tagged at b391e43, 2026-09-13 (8) | `git rev-list -n1 v0.1.0` = b391e43622056324c56d35cc33065305140a8415 (annotated tag object fbba9ae8, the same on origin); commit date 2026-09-13T20:28:44+02:00, tagger date 2026-09-13T20:36:26+02:00; the short id resolves uniquely | holds |
| shipped the hero slice as the first packaged Windows build (8) | `RELEASE-0.1.md:26-27 @ 884fc727 sha256:3ad1502a7628933255c438fc13f6b2b03137b547d0b26572b5042ffe420bb85b`; also PLAN.yaml node `v0-1-0-shipped` (`PLAN.yaml:50-51 @ 884fc727 sha256:b1336507afe51637227a8c3ddc9401ec3beba47b347dc6e4dceaba904b5c2a5a`) | holds; see S2-1 on "5 GB" |
| work in hand is what PLAN.yaml places and CUSTODIAN-QUEUE.md lists (8) | both tracked; CUSTODIAN-QUEUE.md is generated from PLAN.yaml (its header) | holds |
| kernel, engine and renderer modules built against ADR-010's architecture (8); five directories built against docs/02's map (24) | `kernel/`, `engine/`, `protocol/`, `renderer/` and `frontends/` all exist | holds |
| two follow-up items open, macOS/Linux and transport/indexing (8) | `docs/07_Roadmap.md:17-19 @ 884fc727 sha256:bab6d0766c7219007776bb15de79269665bb4a951976b974218427a83785a7a1`: the two "Gate — open, follow-up to the above" entries | holds |
| ADR-009 accepted 2026-08-07; docs/07 keeps its gate line as history (8) | `docs/adr/ADR-009-license-and-open-core-boundary.md:3 @ 884fc727 sha256:8687d8432af1b270ec83e1bcdf0dfccc5227a1809ec2b0c8c8e0ee1d9213b410`; `docs/07_Roadmap.md:26 @ 884fc727 sha256:b380ea30f906ba2145602834678e81b01d48c3702a6b6c7a14d63188f6b856c8` (the dated correction ends by saying the line is kept as history) | holds; docs/07 untouched (F3's docs/07 fix stays out of scope, as the form declares) |
| ADR-011 Proposed, not architect-blockable (8, unchanged sentence) | `docs/adr/ADR-011-tiled-render-batches-gpu-cache-lifecycle.md:3 @ 884fc727 sha256:95f7170af6dc8e197b831f40b4331d75e8bac6077ed7f853b76663da4fa04b57` | holds |
| eight agent definitions with these roles (23) | `git ls-files .claude/agents` = architect, evidence-reader, lead-data, reviewer, tester, tester-high, worker, worker-high; each role phrase matches its frontmatter `description` | holds |
| shell is React + TypeScript under ADR-001's 2026-08-09 amendment, scoped to the shell; bundle-viewer and the archived spike frontend stay vanilla TypeScript (28) | `docs/adr/ADR-001-frontend-stack.md:33-55 @ 884fc727 sha256:291784a7999438b98476affcdb48fe9a422b42c5adda96468344794d56e1d640`; `frontends/shell/package.json:48` depends on react | holds |
| tester records measured numbers (docs/08) in the results file the piece names (38) | practice: `kernel/RESULTS.md` (cited by `docs/08_Testing.md:20`; AUTONOMY.md §1's measurement field names a tracked RESULTS.md anchor); the instruction's item 3 names "the spike-results wording" as a stale fact to update | holds; see N-1 |

## Check 3 — no rule added, removed or changed

Byte-identity of each rule span, old line against new, by sha256 of the extracted span (none is the empty-input hash):
- line 8, ADR-011 sentence: d9b44f93… on both;
- line 8, ADR-010 clause ("governed by **ADR-010** … architect-blockable in review)."): 4b88aebd… on both;
- line 8, the 2026-09-07 note's bold text: de7e55ae… on both;
- line 24, scaffolding sentence: b1d80d1d… on both;
- line 38, architect and reviewer sentences: b033732e… on both;
- line 38, commit-style sentence: 37445a54… on both. M2 is untouched, as the form declares.

Does any new wording read as a new rule? No:
- The line 8 and line 24 permissions ("may now begin", "may now be built") become present-tense facts. The permission's object exists, and nothing is withdrawn.
- The line 38 tester sentence keeps the same direction (who records perf and milestone numbers) with its stale location replaced. The instruction's item 3 orders that replacement by name. "(docs/08)" points at the existing non-negotiable at `CLAUDE.md:15`, unchanged.
- The line 28 removal: see N-2.

## Check 4 — the form against the diff

- Scope: 1 file, CLAUDE.md; 10 changed lines against a ceiling of 12; whole-line in-place replacement at 8, 23, 24, 28 and 38. Matches.
- Change: each named line's described change matches its hunk.
- No §21c bound is crossed: 10 lines, 1 file, no dependency, no exposure surface, no user-visible behaviour.

## Check 5 — scripts on the branch (`C:/dev/wt/claude-md`, HEAD 5607bf60)

| Command | Exit |
|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 (PASS; 39 loose references advised, none in CLAUDE.md) |
| `node scripts/plan/verify-quotes.mjs` | 0 (PASS; 117 checked, 86 verified, 30 baselined, 1 advisory) |
| `node scripts/plan/verify-test-claims.mjs` | 0 (PASS) |
| `node scripts/plan/verify.mjs` | 0 (verify:plan PASS) |
| `node scripts/plan/verify-quotes.mjs --show-cites PRECEDENTS.md` | 0 (six CLAUDE.md:12-17 cites resolve) |
| `node --test scripts/plan/verify.test.mjs` | 0 |
| governance CI's own test step: node --test over scripts/plan/*.test.mjs and scripts/hooks/*.test.mjs | 0 (440 pass, 0 fail) |

Supporting commands, all rc 0:
- `git status --porcelain` (empty, at start and end);
- `git fetch origin`;
- `git diff --stat` and `git diff -U0` over the three-dot range;
- `git rev-list -n1 v0.1.0`, `git for-each-ref refs/tags/v0.1.0`, `git ls-remote --tags origin v0.1.0`;
- `git ls-files .claude/agents`;
- `git grep` for cites into the changed lines;
- `gh pr view 171`.

One returned 1: `git merge-base --is-ancestor origin/main HEAD` (see N-3).

## Check 6 — `gh pr checks 171` (rc 0)

Two checks, both pass: "every commit is signed off" and "no profile path in the range". None is pending. Governance CI did not run (see S2-2).

## Findings

**S2-1 — line 8 frames docs/07's "5 GB" wording as a shipped capability, while the cited source deliberately omits it.**
- New line 8 says v0.1.0 shipped the hero slice, then gives docs/07's definition (open a 5 GB GeoParquet …), citing `RELEASE-0.1.md` §1.
- §1 states the slice without the size (`RELEASE-0.1.md:26-27 @ 884fc727 sha256:3ad1502a7628933255c438fc13f6b2b03137b547d0b26572b5042ffe420bb85b`).
- The release record's architect consult allows "5 GB" only as the slice's target dataset class, never as a capability and never without the ceiling beside it (`RELEASE-0.1.md:338-340 @ 884fc727 sha256:d75ec88b7121eb12025610fce71d33b956c8efecfe064ac88892f3e7bb2bda21`).
- v0.1.0's declared contract at overview zoom is a partial view (`KNOWN-LIMITATIONS.md:92 @ 884fc727 sha256:bfed560524eba2bca60e9f68eacca66bba3a44f405c810ee0160ea891abba0c5`).
- Why not blocking: the definition span is byte-identical to the old line and to docs/07's own slice definition, and the Q7 prohibitions bind release text, which CLAUDE.md is not.
- Remedy, one span on line 8: use §1's wording ("open a GeoParquet"), or drop the definition clause and leave the §1 reference.

**S2-2 — the form's "governance CI green" check cannot be met by this PR's CI.**
- `.github/workflows/governance-ci.yml:94-109 @ 884fc727 sha256:dc8246f8129ab657facc7ecc7701710e05f9de4acadc6e3fd2dfcbcb58e3d4b3` (the `pull_request` paths filter) does not list `CLAUDE.md`, so the workflow did not trigger on PR #171.
- Local runs of the same steps stand in, all exit 0: the four verify scripts and the node test suite (check 5). The queue/site drift steps were not run locally; the diff touches none of `PLAN.yaml`, `CUSTODIAN-QUEUE.*` or `site/**`.
- Remedy: the custodian either dispatches the workflow on the branch (`workflow_dispatch` exists) or records in the PR body that it does not trigger and that the local runs stand in. Recording this is not a §21a matter.

**N-1 — CLAUDE.md:38 and the tester's own definition now disagree.**
- `.claude/agents/tester.md:12 @ 884fc727 sha256:90f4c5b91b9710d8235f8ddbef8b402614714b5c87ca697ee1b24094bb0de370` and its `description` (`tester.md:3 @ 884fc727 sha256:189bc4afd52bcf7eecd97ffc7a52497cff6bd91e5bafba701fb4189ff3049679`) still carry the spike-table wording (audit H1).
- The form declares the agent definitions out of scope, and the triage lists H1 for separate placement. This is no defect in this piece; it is a reason to place H1 soon.

**N-2 — line 28 drops the clause that a spike must not decide the framework choice.**
- The clause's condition (the React-vs-Svelte choice left open) no longer holds for the shell: ADR-001's 2026-08-09 amendment closed it there.
- The amendment itself records the spike-must-not-decide rationale and keeps other clients admissible (`docs/adr/ADR-001-frontend-stack.md:33-55 @ 884fc727 sha256:291784a7999438b98476affcdb48fe9a422b42c5adda96468344794d56e1d640`).
- So nothing binding is lost. Audit H4 proposed the same removal, and the triage classes it (d).

**N-3 — main has moved since the branch was cut.**
- origin/main is now f038dedc02edf9f3bcf4e3de927ef9aabae69eb6, one commit past the base (state/CUT-STATE.md only).
- `git diff --quiet 884fc727 origin/main -- CLAUDE.md PRECEDENTS.md` returned 0, so there is no overlap.

**N-4 — "Current focus: the follow-ups after v0.1.0" against PLAN.yaml's phases.**
- PLAN.yaml still files 201 nodes under phase `prototype` (the same phase that v0.1.0 shipped).
- The new wording does not contradict that, and it defers the specifics to PLAN.yaml and the queue. The audit's F2 left the wording to the human; the instruction's item 3 delegated this line by name.

## Red-line and vocabulary scan (light constitution check)

- `AI_DEVELOPMENT.md:451-454` ("Always the human"): no ADR status or amendment, no exposure, no dependency, no history rewrite, no security-posture change, no docs/08 row, no user-visible behaviour.
- No durations, perf words or wire-level claims on the new lines.
- `docs/01_Principles.md` untouched.
- The worktree ended with an empty `git status --porcelain`.
