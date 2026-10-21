# Governance D: the after-D measurement at the merge commit

*The custodian's record of M-1 to M-3 at PR #237's merge commit 16b3d36045cb3b122bb19baeadbaa22de29e9132, and of E-M (a) and (b) with M-2's change from M0 (81c34c8b28ac030f15ac4ecacdb72ff48aa66483) path by path (`scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md`, §2 items 9 and 11 and §5's E-M; A's procedure in `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md` §2 item 5, unchanged). The run's script and the table's script are in the custodian's scratch folder and are not tracked. The run's output is below byte for byte. The table comes from the two `rg --files` lists the run saved, separate from its two M-2 runs, with each path's committed size from `git ls-tree -r -l` at its rev.*

## The run

```text
start 2026-10-21T12:54:55Z
M-1 worktree add rc=0
M-1 worktree HEAD 16b3d36045cb3b122bb19baeadbaa22de29e9132
M-1 worktree porcelain lines 0
M-1 run 1 rc=0
M-1 run 2 rc=0
M-1 cmp stdout rc=0
M-1 cmp stderr rc=0
M-1 wc -c stdout run1=97108 run2=97108
M-1 stdout sha256 run1=dc9237bfabdd8df356d1eda283631be26034aba300c731c2cd28ab27a0fb9f4b run2=dc9237bfabdd8df356d1eda283631be26034aba300c731c2cd28ab27a0fb9f4b
M-1 stderr sha256 run1=f3c0e70ac4a0f5434f35f598887393ce0c1e8295cc77e87c52f406957001178d run2=f3c0e70ac4a0f5434f35f598887393ce0c1e8295cc77e87c52f406957001178d
M-1 stderr run1: measure-reads: routine 16b3d36045cb3b122bb19baeadbaa22de29e9132 block=5843 ledger=39940 entries=91 window_from=2026-10-14T09:27:28.000Z outside_window=0 pending=51320 total=97108
M-1 stderr run2: measure-reads: routine 16b3d36045cb3b122bb19baeadbaa22de29e9132 block=5843 ledger=39940 entries=91 window_from=2026-10-14T09:27:28.000Z outside_window=0 pending=51320 total=97108
M-2 worktree add rc=0
M-2 worktree HEAD 16b3d36045cb3b122bb19baeadbaa22de29e9132
M-2 worktree porcelain lines 0
ENV rg --version first line: ripgrep 14.1.1 (rev 575938147b)
ENV RIPGREP_CONFIG_PATH unset
ENV core.excludesFile local rc=1
ENV core.excludesFile global rc=1
ENV core.excludesFile system rc=1
ENV info/exclude present, 541 bytes, sha256 321dffcb77a68a6c079d35da12944866b895b4cc9fb3b1fae72fe9468c7eafeb
ENV none /c/dev/wt/.ignore
ENV none /c/dev/wt/.rgignore
ENV none /c/dev/wt/.gitignore
ENV none /c/dev/.ignore
ENV none /c/dev/.rgignore
ENV none /c/dev/.gitignore
ENV claude --version: 2.1.306 (Claude Code)
ENV node: v24.18.1
ENV git: git version 2.49.0.windows.1
M-2 run 1 PIPESTATUS=0 0
M-2 run 2 PIPESTATUS=0 0
M-2 cmp stdout rc=0
M-2 cmp stderr rc=0
M-2 rg stderr bytes run1=0 run2=0
M-2 stdout run1: measure-reads: corpus 16b3d36045cb3b122bb19baeadbaa22de29e9132 files=2011 bytes=36607014
M-2 stdout run2: measure-reads: corpus 16b3d36045cb3b122bb19baeadbaa22de29e9132 files=2011 bytes=36607014
M-2 stderr run1: tracked_not_listed=586
M-2 stdout sha256 run1=1d8d6e2dd2cfa4346405090d002f4676b3c4163fea85f31faa402220e7c2d0f8 run2=1d8d6e2dd2cfa4346405090d002f4676b3c4163fea85f31faa402220e7c2d0f8
M-2 stderr sha256 run1=2ec3fa59ee33f80ee30fb8dd9838d6b413be1145e0ace82020031c2c6e178462 run2=2ec3fa59ee33f80ee30fb8dd9838d6b413be1145e0ace82020031c2c6e178462
LIST merge rg rc=0 lines 2011 rgerr bytes 0
LIST merge corpus rc=0
LIST merge corpus cmp M-2 stdout rc=0
LIST merge corpus cmp M-2 stderr rc=0
M-2 worktree porcelain lines after 0
M0 worktree add rc=0
M0 worktree HEAD 81c34c8b28ac030f15ac4ecacdb72ff48aa66483
M0 worktree porcelain lines 0
LIST M0 rg rc=0 lines 1986 rgerr bytes 0
LIST M0 corpus rc=0
LIST M0 corpus stdout: measure-reads: corpus 81c34c8b28ac030f15ac4ecacdb72ff48aa66483 files=1986 bytes=36290933
LIST M0 corpus stderr: tracked_not_listed=573
M0 worktree porcelain lines after 0
M-3 run 1 rc=0
M-3 run 2 rc=0
M-3 cmp rc=0
M-3 stdout: 412316 sha256 b94487c1a11fcf02ed7525994c04ff2bd9af0ec2e4dc548d4f5af4f8bcad2ce9
SCRIPT git show merge:scripts/plan/measure-reads.mjs sha256 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1
SCRIPT M-1 worktree file sha256 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1
M0 worktree remove rc=0
M-2 worktree remove rc=0
M-1 worktree remove rc=0
worktree list has afd: 0
end 2026-10-21T12:55:08Z
```

## E-M

- **(a)** `state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml` is in the merge commit's tree (blob 56ba73a11869c682f177be816f7c4bc30511b1d1) and is not in its `rg --files` list.
- **(b)** `PLAN.yaml` is in the list at M0 and in the list at the merge commit.
- **(c)** is the form's Amendment 10 item 3: 703,836 − 412,316 = 291,520, the script's moved bytes.

## M-2's change from M0 to the merge commit

- **In all:** 1,986 files and 36,290,933 bytes at M0; 2,011 files and 36,607,014 bytes at the merge commit; +25 files and +316,081 bytes. 25 paths were added, 13 changed and none is gone.
- **PLAN.yaml's term:** −283,601 bytes (695,917 to 412,316). It splits into (c), −291,520, and main's own PLAN.yaml commits from M0 to S9, +7,919 (695,917 to 703,836). S9's PLAN.yaml blob, 83abe8bbc6f9b8007b8694f90b83ac713d444fa1, is its main parent 54d072687e79f8cb9a77ca942aa6809dad4e326b's. From S9 to the merge commit, main made no PLAN.yaml commit.
- **Every other listed path that differs:** 37 paths, +599,682 bytes.

| Path | At M0 | At the merge commit | Delta |
|---|---:|---:|---:|
| `AUTONOMY.md` | 104,852 | 108,311 | +3,459 |
| `CUSTODIAN-QUEUE.md` | 26,634 | 26,221 | −413 |
| `DECISIONS-PENDING.md` | 47,781 | 51,503 | +3,722 |
| `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md` | 32,295 | 37,543 | +5,248 |
| `engine/README.md` | 50,030 | 49,977 | −53 |
| `engine/src/dataset.rs` | 96,613 | 97,138 | +525 |
| `engine/src/stream.rs` | 187,622 | 188,755 | +1,133 |
| `engine/tests/connection_reuse.rs` | 23,846 | 25,090 | +1,244 |
| `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md` | not listed | 37,308 | +37,308 |
| `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md` | 59,216 | 76,190 | +16,974 |
| `scripts/plan/README.md` | 28,112 | 29,934 | +1,822 |
| `scripts/plan/rotate-plan-summaries.mjs` | not listed | 17,024 | +17,024 |
| `scripts/plan/rotate-plan-summaries.test.mjs` | not listed | 31,707 | +31,707 |
| `state/CUT-STATE.md` | 33,808 | 45,796 | +11,988 |
| `state/consults/2026-10-20-governance-plan-summaries-archive-g0-worker-report.md` | not listed | 17,100 | +17,100 |
| `state/consults/2026-10-21-adr-036-acceptance-architect-consult.md` | not listed | 10,764 | +10,764 |
| `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md` | not listed | 35,593 | +35,593 |
| `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md` | not listed | 52,367 | +52,367 |
| `state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md` | not listed | 57,056 | +57,056 |
| `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-draft.md` | not listed | 38,018 | +38,018 |
| `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form-cites.md` | not listed | 63,139 | +63,139 |
| `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form.md` | not listed | 59,036 | +59,036 |
| `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-impact-read.md` | not listed | 31,202 | +31,202 |
| `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-gate1-words-worker-report.md` | not listed | 2,413 | +2,413 |
| `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-owners-index-apply-worker-report.md` | not listed | 3,401 | +3,401 |
| `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-owners-index-update.md` | not listed | 12,609 | +12,609 |
| `state/consults/2026-10-21-connection-reuse-recycled-interrupt-flake-worker-report.md` | not listed | 6,843 | +6,843 |
| `state/consults/2026-10-21-governance-plan-summaries-archive-gate2-words-worker-report.md` | not listed | 2,639 | +2,639 |
| `state/consults/2026-10-21-governance-plan-summaries-archive-round-1-worker-report.md` | not listed | 8,085 | +8,085 |
| `state/consults/2026-10-21-governance-plan-summaries-archive-s10-worker-report.md` | not listed | 11,563 | +11,563 |
| `state/consults/2026-10-21-governance-plan-summaries-archive-s9-worker-report.md` | not listed | 8,328 | +8,328 |
| `state/consults/2026-10-21-spatial-extension-check-custodian.md` | not listed | 2,124 | +2,124 |
| `state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-architect-draft.md` | not listed | 24,783 | +24,783 |
| `state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-worker-report.md` | not listed | 6,915 | +6,915 |
| `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md` | not listed | 3,453 | +3,453 |
| `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md` | not listed | 2,597 | +2,597 |
| `state/gate-log.json` | 531,095 | 539,061 | +7,966 |
