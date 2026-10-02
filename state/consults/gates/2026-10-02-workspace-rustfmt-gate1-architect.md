*Custodian's filing note (2026-10-02): the architect's gate 1 on PR #157, for PLAN node `workspace-rustfmt`, full gating. Reviewed: cut/workspace-rustfmt @ c6d1414dc063364ffb8e46428d739922d7bafbc7 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at c6d1414. Verdict PASS, with one S2 (S2-1: the workflow header's H1 sentence is wider than the form's H1 and names the wrong run) and notes N1 to N5. S2-1 and N1 go to a correction round, comment-only in C2's workflow file. N3's evidence was committed on main at 513cb05. N5's key waits for #156. Profile paths redacted at filing: none.*

---

VERDICT: PASS (cut/workspace-rustfmt @ c6d1414dc063364ffb8e46428d739922d7bafbc7)

**Scope of this review.** I read the worktree. Its HEAD is `refs/heads/cut/workspace-rustfmt`, and the ref file holds c6d1414. The worktree reflog shows a0f0da7, then C1 6371d92, then C2 c6d1414. Probe commit 2d49ee4 sits only on `probe/rust-fmt-red`.

I had no Bash, so I computed no hash, ran no git diff and read no CI run. Every `path:line` cite below is at c6d1414. The main-checkout files are named as such, and the ledger is cited by round and item.

There are no S1 findings. There is one S2, a fix to one comment. If only that hunk changes, my verdict holds after I re-read it.

**Findings**

- **S2-1: the header's H1 sentence is wider than the form's H1.** `.github/workflows/rust-fmt.yml:19-20`.
  - The header says one formatter gives the same output "on every platform". The form's H1 is narrower: ubuntu-latest against the Windows reference profile only (`WORKSPACE-RUSTFMT-PREREGISTRATION.md:32`).
  - R3 says macOS has no run and no claim (`WORKSPACE-RUSTFMT-PREREGISTRATION.md:97`).
  - The header also says H1 is tested by "the first run of this workflow". The declared test is E1, this PR's own `pull_request` run at the head marked ready (`:115`). The first run was E2's red probe push (run 37005634673), or a branch push.
  - The fix: reword the sentence to H1's own scope and to E1. §8 item 3 allows that file after C1, and §7 still has 39 lines of room.
- **N1: the header states the merge setting as a fact.** `rust-fmt.yml:15` says "it is not required for merge". That turns the form's may-not-claim (`:43`) into a statement about a setting the human owns. Round 34, item 7 shows that the human does make checks required, so the sentence would become false without anyone noticing. Rewording it to "claims nothing about merge requirement" fits inside the S2-1 fix.
- **N2: the quoted label is a section heading.** `rust-fmt.yml:13` quotes "May not claim", which is byte-identical to the label at form `:41`. I read it as a section reference, not a quotation, so §2 item 5's rule that the header quotes nothing holds.
- **N3: the evidence I read may not be committed yet.**
  - At session start, the main checkout's git status listed the worker report (`state/consults/2026-10-02-workspace-rustfmt-worker-report-1.md`) as untracked, and the CUT-STATE entry for 12:27Z is not in the recent commit list.
  - Both are evidence, not Authority, under round 14's dated distinction. Commit them before this report is filed.
- **N4: an earlier H1 data point may exist.** If pushing `cut/workspace-rustfmt` started a `Rust fmt` push run at c6d1414, that run already formatted C1's tree on ubuntu. The reviewer should read it by run id as extra evidence. E1 stays the declared discriminator.
- **N5: the merge key is not set yet.** The `merge: merge-commit` key is not on the `workspace-rustfmt` node in main's PLAN.yaml; only the node's summary mentions it. The drafting consult routed it to be set once #156 lands (consult (c) item 4). Until the squash and rebase settings are read back (round 34, item 6), §2 item 6's merge-commit-only line governs.

**Asked items**

1. **The wire head: no literal, field name, string or message changed.**
   - Method: for all 20 `.rs` files under `protocol/skp/**` and `protocol/data-plane/**`, I extracted every single-line double-quoted literal from main and from the worktree. The per-file sequences are identical in content and order. That covers skp `v0/{mod,events,error,handles,codec,commands}.rs`, data-plane `src/{wire,transport,pump,adapter_ws,lib,session,server}.rs`, and the tests `fixtures.rs`, `conformance/main.rs`, `no_transport_leakage.rs`, `candidate_a.rs`, `origin_header_encoding.rs` and `stream_registry_bound.rs`.
   - Every `pub <field>:` and `#[serde(...)]` in `protocol/skp/src` is identical in sequence.
   - In scope there is no `#[macro_use]` and no `rustfmt::skip`.
   - The counts of lines containing a quote changed, for example `no_transport_leakage.rs` went from 34 to 65. That is reflow only.
   - My method does not see multi-line or raw strings. The byte-level proof is the reviewer's F4.
2. **Round 34, item 1 against §2.**
   - The check lands in the same PR: C2 sits on the same branch directly over C1.
   - P1 at dispatch is recorded in the CUT-STATE entry at 12:14Z, with (a) to (c), and the kept record branches named, including `cut/b1-close-nul-names` and `cloud/*`.
   - P1 before the merge is still owed (the 12:27Z entry), so §8 item 9 stays open until then.
   - data-plane-crate-fmt stays superseded: on main its node is `unscheduled`, and its summary says it is superseded by workspace-rustfmt. The PR touches neither node, which matches the ruling's Applied text.
3. **The workflow against §2 item 5 and §8 item 4.**
   - Name and job: `rust-fmt.yml:1`, `:59`.
   - Triggers and paths: `:28-47`, exactly the seven declared paths plus `workflow_dispatch`, with no `branches` filter.
   - Concurrency: `:53-55`, the same shape as `product-ci-rust.yml:176-178`.
   - Permissions: `:49-50`, `contents: read` only, and no `secrets.` reference.
   - Runner and timeout: ubuntu-latest and 10 minutes (`:60-61`).
   - Actions: only `actions/checkout@v4` with `persist-credentials: false` (`:63-65`) and `dtolnay/rust-toolchain@stable` with `components: rustfmt` (`:67-69`). That is the same action as `product-ci-rust.yml:197`, plus one input. Its one new install is the rustfmt component on the runner, which round 34, item 1 approves.
   - There is no cache step, no `continue-on-error` and no `|| true`.
   - `${{ }}` appears only in concurrency and in the declared `if` (`:78`), never inside `run:`.
   - The commands are exactly §7's (`:72`, `:75`, `:79`).
   - The round 7 ruling holds: each step name states the command and scope it runs, and states no consequence. The header has its four declared parts (`:5-26`), with S2-1 and N1 above.
4. **§6 item 4's numbers.**
   - The worker reports A=1241, B=32, C=994, D=0 at both a0f0da7 and C1. The worker's script matches `selectFiles` (`scripts/plan/verify-cites.mjs:263-272`), and its D matches `checkCitation`'s bound (`:233-248`).
   - D=0, together with the worker's verify-cites exit 0 at c6d1414 (tool commit 522e448), means verify-cites stays green. The reviewer's recompute is still owed.
   - C=994 is the disclosed cost. It changes nothing the human ruled on:
     - The ruling adopted the class, unpinned cites pointing at moved text, with no figure as a condition.
     - The shape's two conditions hold: no cite is rewritten, and no check reddens (D=0; verify-quotes exit 0).
     - The 752 was a rough grep of `*.rs:N` tokens in markdown only. A counts every rooted token into the 133 files, in markdown and in code comments, so the two figures do not measure the same set.
   - It needs one disclosure sentence to the human, not a change and not a re-ask. For example, in the PR body: "measured: 994 of 1,241 rooted cites into the reformatted files now point at moved text; 32 hash-pinned are unaffected; verify-cites green."
5. **R1 to R6, and the seam.**
   - R1: one formatter and one check. R3 is met for Linux (E2) and Windows (the worker's local F1 and F3); S2-1 is the header's breach of R3.
   - R2 and R6: `#[cfg(`, `cfg!(` and `#[ignore` lines total 237 over 94 files on both sides. F4 is the proof.
   - R4: there is no OS condition in the workflow.
   - R5: `:15` disclaims any portability level.
   - Seam: the workflow calls the cargo fmt CLI as it actually is, a process boundary, and E2 shows it from the real shape: run 37005634673 went red, with each step naming only its own probe file. E1 is still owed at the head marked ready. The caller rule does not apply: no `pub` item, callback or option lands, and C1 is formatter output by F4.
   - The Gating line is right: §21c is the binding head, the wire path is touched and has been read (item 1), and no five-line form is used.
   - Round 25, item 2 fires nothing:
     - there is no §7 overrun (81 of 120 lines, 2 files, from the worker and the custodian's recount);
     - there is no scope addition;
     - the worker's report calls the verify-mutation listing a checklist, never an observation;
     - there is no test-text span;
     - the piece has used the full form from dispatch.
   - I could not read the §9 CI suites (product-ci-rust, product-ci-shell, Rust fmt E1, exposure-scan, DCO). The reviewer reads them by run id before either gate.

**§8 item by item**

1. Pass in part:
   - one parent: the reflog shows a0f0da7 to 6371d92;
   - only `.rs` paths: the worker and the custodian report it;
   - tree equals the reproduction: this rests entirely on the reviewer's F4, which I did not observe.
2. Pass, resting on F4 and the custodian's C2 count. C2 is the only commit after C1 on the branch, and it adds the two non-`.rs` files. The probe commit is off the branch.
3. Pass: C2 has two files, `.github/workflows/rust-fmt.yml` and `.git-blame-ignore-revs`, as the custodian checked.
4. Pass on every sub-item (asked item 3).
5. Pass: no other workflow differs. `product-ci-rust.yml`'s paths and concurrency read as before. Full proof is the reviewer's C2 diff.
6. Pass: there is no rustfmt or toolchain config and no manifest or lockfile in the diff. C1 is `.rs` only, and C2 has the two files.
7. Pass: no record or cite is edited. C2's files are new, and C1 is formatter output.
8. Pass: `.git-blame-ignore-revs:2` holds 6371d925a7f66b56dd66bb57d6e27a44dcdc0b11, the full id of C1 from the reflog.
9. Pass for dispatch (CUT-STATE entry at 12:14Z). For the merge it is open: the second P1 must be recorded before the click.
10. Pass so far: no force-push appears in the reflog, and the probe is not at the head. The merge-commit requirement is still to come (N5).
11. Pass for the two C2 files and the worker report as filed. The commit messages rest on the reviewer and the exposure-scan run.
12. Pass: the worker report, verify-mutation line, says it is the checklist and not an observation.
13. Pass: 81 of 120 lines over 2 of 2 files, §7 unedited, and no class 9 amendment.
14. Pass: §10 is empty and the PR adds no record. The only commit pin is `.git-blame-ignore-revs`, which is not a hash reference in a record.

No ADR skeleton is needed: no decision is missing.
