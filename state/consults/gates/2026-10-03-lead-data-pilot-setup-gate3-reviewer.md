*Custodian's filing note (2026-10-03): the gate-3 reviewer for PR #166 wrote this report to this path itself, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 698f69e055d1715f3926e421ea5b4479b4879419eb153f251937ead9329213d9, computed by the custodian from the saved bytes. It equals the reviewer's returned sha256.*

---

VERDICT: PASS
Reviewed cut/lead-data-pilot-setup @ 11c3fe623aa6b24e8dee5a5c3a4acb5f093ab1f9. PR #166, gate 3, reviewer.

Scope: correction round 2 only, f59c3566 and 11c3fe62 over 0e630623, read in the worktree C:/dev/wt/lead-data-setup (clean, HEAD 11c3fe62). Sources read on main at 80ad533a. No commit, push or tracked edit; nothing spawned is left running.

## S1 (blocking)

None.

## Checklist results

1. The diff.
   - f59c3566 touches `kernel/README.md` only: numstat 4 added, 5 removed. As a block, the bullet goes from 6 lines to 5; its first line ("No SKP message reaches it.") is unchanged context, which is why numstat reads 4/5. The old block at 0e630623 (kernel/README.md lines 237-242) hashes to 5bd47f85544e333165c82bdc4412c8f904b8e77907a304f77d876f4a7e7bcd5b and the new block at f59c3566 (lines 237-241) to cf5c6d24fa4bef4b588070acde755149fc387564371f0aa67b37c2d16513902b, both recomputed here; they match the prefixes in worker report 3. The next bullet is unchanged.
   - 11c3fe62 touches the form only: 13 added, 0 removed. The first 31 lines are byte-identical to the 31-line file at 0e630623 (cmp), so it is a pure append. LF throughout.
   - Over 0e630623..11c3fe62 the only changed files are those two.
2. The new bullet's wording.
   - Against question round 42, item 1 (RULED block and `state/questions/round-42.md` item 1): it names two callers, both through `permission/boundary.rs`; the shell's `binding_publish_*` commands as the UI surface for which ADR-017's acceptance condition was discharged on 2026-08-17; `publish-bundle` as the binary ADR-017 keeps as developer/test tooling. The open-question sentence ("Whether ADR-017's ...") is gone. Matches.
   - Against ADR-017: "Clarification to the acceptance condition — 2026-08-07, human decision" says the condition does not lapse on the machinery alone. "Exposure review completion — 2026-08-17" reads "the acceptance condition is discharged for the shell's UI surface" and "`publish-bundle` remains developer/test tooling as a CLI". The bullet claims neither more nor less. It does not claim that SKP, MCP, plugin, notebook or AI exposure is discharged; its first sentence keeps the SKP negative.
   - Against the tree at 11c3fe62, the product paths are: `kernel/src/bin/publish-bundle.rs:656` calls `boundary::execute`. The shell's `binding_publish_execute` (`frontends/shell/src-tauri/src/commands.rs:401`, registered at `frontends/shell/src-tauri/src/lib.rs:544`) calls `publish::execute_with_progress` (commands.rs:424), which reaches `boundary::execute` at `frontends/shell/src-tauri/src/publish.rs:829`. No non-test source calls `publish_unguarded(`; its only definition is `kernel/src/publish/mod.rs:590`. So the two product callers both go through the boundary, as stated. See N1 for the dropped word "product".
3. The Amendment (form, second "Amendment:" block).
   - Class 1, and post-result: its first line says it was written after question round 42's results were seen, "(a post-result amendment)".
   - References: question round 42, item 1 and question rounds 41 and 42, item 1 resolve against the RULED blocks. `state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-architect.md` and `state/consults/2026-10-03-lead-data-pilot-setup-worker-report-3.md` both exist at 80ad533a (git cat-file). The branch commits f59c3566 and c18f87f9 exist. The Amendment carries no line cite, no ledger line cite and no hash reference.
   - Its one quotation, "Nothing is exposed", is byte-present in the bullet that c18f87f9 replaced (`kernel/README.md:236 @ 629fb7f1d1a84102d9ebfb13bb7a358dbafdeede`, inside the bold run).
   - Scope figure: by the Scope line's counting (changed lines, the form excluded) against af40bbf, I get 190 over 4 files (+177 -13) at both f59c3566 and 11c3fe62. The Amendment states it "at f59c3566"; 11c3fe62 changes only the excluded form, so the two counts are equal. At daeaa487 the count is 191, which matches round 1's figure. 190 is within 400.
   - Superseded index: "The publish-exposure bullet as c18f87f9 applied it is superseded at f59c3566" is accurate. No other line on the branch changed in this round, so "Nothing else is superseded" holds.
   - C8 as the gate-2 architect's S2-1 asks: the Amendment names lead-data's classification (security posture), records C8 as a mid-piece guarantee-category touch in C5's sense that the Out-of-scope line does not name, says it adds no surface, says the human decided it (rounds 41 and 42, item 1), says full gating already applies, and leaves the Out-of-scope line unrewritten. All the elements S2-1 asks for are present.
   - Round 25, item 2, fail-by-name list: no full-form overrun (this is the five-line form, 190 against 400); no class 9 scope addition; no claim that a verify-mutation run observed a mutation; no test-text span; the Out-of-scope line names no §21a category as touched.
4. Worker report 3: `tail -n +5 | sha256sum` of the file on main gives 0fea72ef5fcab3438a09d9f457cb7487635b5a1787177345727667c75ca76647, which equals the hash of record.

## Exit codes

All of these ran in the worktree at 11c3fe62. The tool commit given is the last commit touching each script at that head.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1148 files, 38 loose advisories (none in the form or in kernel/engine README). Tool commit 522e448d.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 113 checked, 82 verified, 30 baselined, 1 advisory, 0 hash-reference errors. Tool commit f9444a4d.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 483 claims over 113 files. Tool commit e9735d47.
- `node scripts/plan/verify.mjs` (verify:plan): rc 0, PASS. Tool commit 26072022.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 415 pass, 0 fail. Last commit touching scripts/plan or scripts/hooks: 859375c9.
- PR #166 CI on head 11c3fe62, read 2026-10-03T12:04:29Z:
  - Governance CI run 37121232875 (push): success.
  - Governance CI run 37121235504 (pull_request): success.
  - DCO run 37121235505: success.
  - Exposure scan run 37121235480: success.
  - Product CI — shell run 37121235670: success.
  - Product CI — Rust workspace run 37121235484: still queued as a run. Its ubuntu-24.04 job passed and its windows-latest job ("cargo test --workspace (windows-latest)") is **pending**.
  - mergeable: UNKNOWN at read time.

## S2 (required, not blocking)

S2-1. The windows-latest job of run 37121235484 had not finished when I read CI. It needs to be green before merge. This round changes no code, so I expect no regression, but that expectation is not a result.

## N (notes)

- N1. The new text says "Two callers reach the operation". C8 said "Two product callers". Read as product callers, the tree bears it out. Read as all callers, it does not: the kernel integration tests call `publish_unguarded` directly (for example `kernel/tests/publish.rs:229` @ 11c3fe62). The next bullet ("`publish_unguarded` is still `pub`") states that ungated residual, so the section as a whole is not misleading. The wording is the human's typed red-line ruling (round 42, item 1), so the gate does not reopen it. If it is ever reworded, the word "product" could come back.
- N2. The parenthetical `frontends/shell/src-tauri/src/publish.rs` names where the boundary call is, not where the `binding_publish_*` commands are defined, which is `commands.rs`. This was carried over unchanged from C8. Nit.
- N3. Gate-2 architect N1 still stands: `kernel/src/lib.rs:41` and `kernel/PERMISSION-BOUNDARY.md:15` @ 11c3fe62 still say "Nothing is exposed" (lib.rs) and "Nothing here is exposed." (PERMISSION-BOUNDARY.md). Both are outside this piece's Scope; route them to `module-docs-stale-statements`.
- N4. Under the 2026-09-18 record cap this is the piece's second correction round. Any further record finding goes to the architect's reduction, not to a third round.
