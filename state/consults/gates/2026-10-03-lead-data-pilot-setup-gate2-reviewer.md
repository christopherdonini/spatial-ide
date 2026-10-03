*Custodian's filing note (2026-10-03): the gate-2 reviewer for PR #166 wrote this report to this path itself, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 2e10328f2828defa17f27e762a70ca8963c6c5fd52038d5c09c6da70b5601493, computed by the custodian from the saved bytes. It equals the reviewer's returned sha256.*

---

VERDICT: PASS
Reviewed cut/lead-data-pilot-setup @ 0e630623ce7cea1e306b2f962cc9485b54987e29. PR #166, gate 2, reviewer.

Scope: correction round 1 only, the four commits cc8dfcce, c18f87f9, daeaa487 and 0e630623 over 629fb7f1d1a8. Worktree `C:/dev/wt/lead-data-setup`: HEAD is 0e630623, `git status --porcelain` empty before and after. Sources read in the custodian checkout at origin/main 19db1983a454. Hashes of record recomputed over file line 5 to EOF, each matching its filing note: lead-data report 1 160c89e1dc5a8db624c303f27e465757a404768332c50e29df8498a5d4f27e46; lead-data report 2 667851a1808a0c398fb6a507ae39e48ed4aafb00aab1d0e1cf5988dbc5e4fe6c; worker report 2 8ecba23425f19666e01b3c923271969b5037c66afb7d2395f0b5838e7800da30. Every byte check below is my own script against `git show <rev>:<path>`; nothing is taken from the worker's report.

## S1 — blocking

None.

Out-of-scope line read first (AUTONOMY.md §21d; round 25, item 2): the form's Out-of-scope line is unchanged at 0e630623 and names no §21a category as touched. C5 is recorded by the Amendment as a category first found mid-piece (§21b; round 25, item 2 (e)), with full gating already in place. C8 states two existing callers. It adds no exposure surface and no permission or audit code. Against the round-25 fail-by-name list: there is no full form, so no class 8. No scope addition rests on a standing rule (the pointer rests on a one-off ruling; see S2-3). No record calls a `verify-mutation` run an observation. No test-text span is pinned or named.

## Checklist results

**1. The round's diff.**
- `git diff --name-status 629fb7f 0e630623`: M `AI_DEVELOPMENT.md`, M `LEAD-DATA-PILOT-SETUP-PREREGISTRATION.md`, M `engine/README.md`, M `kernel/README.md`. numstat 2/0, 20/0, 2/1 and 11/7.
- Per commit: cc8dfcce touches both READMEs; c18f87f9 touches `kernel/README.md`; daeaa487 touches `AI_DEVELOPMENT.md`; 0e630623 touches the form only.
- The form is append-only. Its whole-file sha256 at af40bbf and at 629fb7f is d0b8bc7623ce47834680b8971741281cc903c357206c9cc704cdf69b19f407fe. The same number of leading bytes of the form at 0e630623 hashes to the same value. 0e630623 is the only commit after af40bbf that touches the form.
- All four commits carry a Signed-off-by. The diff has no CR byte and no user-profile path. All four files end in exactly one LF.

**2. The index sections.** The fenced blocks are taken from report 2: item 1's block, item 2's block, and item 3's anchor and new text (opening fences at file lines 21, 68, 114 and 120 of the filed copy).
- Engine: `engine/README.md` from `## Owner's index` to EOF equals item 1's block (true). The text before the heading equals its 629fb7f bytes (true). The whole file equals the 629fb7f body plus the block (true). The section is 33 lines.
- Kernel: the section equals item 2's block (true). The whole file equals the 629fb7f body, with C7 and C8 applied, plus the block (true). The section is 37 lines.
- Each file has one Owner's-index heading, LF only.
- Status lines, re-read at 629fb7f. `docs/adr/` and `protocol/` do not change from af40bbf to 0e630623 (`git diff --quiet` rc 0).
  - Accepted (line 3; ADR-032 line 5): ADR-004, 005, 006, 007, 008, 009, 010, 013, 015, 016, 017, 018, 021, 025, 026, 032, 033 and 035.
  - Proposed (line 3): ADR-012, 019, 023 and 024.
  - No ADR either section names carries a "superseded" or "withdrawn" marker.
  - Engine "accepted ADRs" (15) and kernel "accepted ADRs" (15) are all Accepted.
  - The "Proposed ADRs, binding nothing" lines name ADR-023 (engine) and ADR-012, 019, 023 and 024 (kernel). That is every Proposed ADR the 629fb7f sections named.
- "→" slots: in the engine section, none names an ADR. In the kernel section, the ADR sources are ADR-035 (two slots) and ADR-017, all Accepted. "Stream tickets" now points to SKP-V0 §1 and §3: `viewport_query` at `protocol/skp/SKP-V0.md:97` and `cancel` at `:111`, both @ af40bbf; the `StreamHandle` row at `:168` @ af40bbf. SKP-V0's line 7 declares the document normative for v0.
- Pointer resolution. My script runs over every backticked token and every ADR and KNOWN-LIMITATIONS reference in both sections. I ran it at af40bbf and again at 0e630623, 320 tokens per run. It checks:
  - test functions, each with a test attribute, and their nested modules;
  - paths in the tree;
  - `pub` items in the named crate;
  - constants declared in the file the line names;
  - ADR files and KNOWN-LIMITATIONS items.

  The script's classifier did not handle two tokens, so I checked them by hand. `skp/0.5` is SKP-V0's §8 heading (`protocol/skp/SKP-V0.md:829` @ af40bbf). `SKP_VERSION` is `pub const` in `protocol/skp/src/v0/mod.rs`. Every pointer resolves. From af40bbf to 0e630623 only the five piece files change, so the "Last verified at" commit, af40bbf, stands.
- Length: 33 and 37 lines, both at most 60.
- Facts for report 2's section 6 question (the architect's call):
  - `kernel/PERMISSION-BOUNDARY.md` is unchanged from af40bbf through 0e630623. The last commit touching it is 4091022d (2026-08-16), the commit that filed ADR-024.
  - It has no Status line of its own. Its header blockquote (`kernel/PERMISSION-BOUNDARY.md:3-7` @ af40bbf sha256:134a7e142ed7abe52b9f975f56b37389bf6f7b6ee0008917b986b5aae9c7090b) says, in paraphrase:
    - ADR-024, marked Proposed and filed 2026-08-16, supersedes the file as home of record;
    - the file is not rewritten, and its findings and earlier rulings stand as record;
    - readers should cite ADR-024 going forward.
  - Its body still says, in paraphrase, that nothing is exposed and that no served surface reaches the operation (`kernel/PERMISSION-BOUNDARY.md:15-17` @ af40bbf sha256:766948f6aec655b933048decf671f3866820513a6124637ed15a4b4f1b212099). This is the claim C8 replaces in the README.
  - The slot's two pub items and two tests resolve.

**3. Edits C7 and C8.** The code at 629fb7f equals af40bbf (`git diff --quiet af40bbf 629fb7f -- kernel/src frontends protocol` rc 0), so the pins below are at af40bbf, a commit on main.
- **C7.** The anchor occurs once at 629fb7f and zero times at 0e630623. The new text is present, and it is exact by the whole-file equality above. The tree agrees with it:
  - `StreamRegistry::cancel`'s `Redeemed` arm calls `cancel()` on the entry's `Arc<dyn SourceCancel>` (`kernel/src/skp.rs:318-332` @ af40bbf sha256:92238c67887c3ed9f63f51e82be90d11f1c9ec582ac5b8da7b6b5ef384abb7d2).
  - That `Arc` is `EngineCancel` over the stream's `CancelToken` (`kernel/src/lib.rs:268-288` @ af40bbf sha256:d1b8c8d174ccc6700bb2b8c00d98653a80f0ee74d78ee1457e04d5c7c44a00ca; `kernel/src/lib.rs:699-704` @ af40bbf sha256:bb24d547774d8ac127f5703f628e6c5dea9b6bf45b57f0087fdb0b67335d0f42).
  - The data plane's `Control::Cancel` arm calls `source_cancel.cancel()` (`protocol/data-plane/src/adapter_ws.rs:130-134` @ af40bbf sha256:ae6232fba1952eaf01533562e0f9275c625ec777d59dfcbe9494edb80004fb44). It does not call `StreamRegistry::cancel`.
  - A `Pending` entry becomes `CancelledBeforeRedeem`, which matches the sentence's "redeemed ticket" scope.
- **C8.** Report 1's anchor (fence at file line 307) occurs once at 629fb7f and zero times at 0e630623. Its new text (fence at line 316) is applied exactly. The two product callers check out:
  - `git grep` for `boundary::execute` over non-markdown files at 629fb7f finds two product call sites: `kernel/src/bin/publish-bundle.rs:656` @ af40bbf sha256:a24e566543e83549698c0a0d18d53f3db76966854ad7b517373486fbde9f8bcc and `frontends/shell/src-tauri/src/publish.rs:829` @ af40bbf sha256:1e4c8c8d1a3ffa4f72885fb1eb757a82215ecbfc122730be0c31b864ad0dffde. Every other call site is under a `tests/` directory.
  - `publish_prepared` is called only from `kernel/src/permission/boundary.rs:416`. `publish_unguarded` has no product caller.
  - `binding_publish_prepare`, `_execute` and `_cancel` are registered in `frontends/shell/src-tauri/src/lib.rs:543-551` @ af40bbf sha256:76471113bbaad7505f581448f06a1d81fddb8966d69d9e9d2444b232f2cd5b27. The e2e destination command there is `cfg(debug_assertions)`. `commands.rs` labels these commands binding-local, never SKP.
  - `protocol/skp/src` defines no publish command.

  Exactly two product callers exist, and both go through the boundary, so C8 holds.

**4. The `AI_DEVELOPMENT.md` pointer.** At 0e630623 the file is its 629fb7f bytes followed by one LF and then the pointer line, which ends in LF. It is the file's last line, and nothing above it moves. The worker's brief is not filed on main, so I compared the line with the round-41 item-4 ruling and its question text, not with the brief. The line restates nothing: it names the clarification by path with C1 to C4, and question round 41, item 3, by round and item, and carries no rule text. See S2-3.

**5. The form's Amendment (0e630623).**
- First line: class 1, correction round 1 after gate 1, post-result, "References only."
- References, resolved on main 19db1983:
  - Present: both gate-1 reports, worker report 2, lead-data reports 1 and 2, and `state/directives/2026-10-03-write-audit-ruling.md`.
  - `kernel-composed-ceiling-projected-stream` is a PLAN.yaml node.
  - Question round 41, items 1 and 4, resolve in the RULED block.
  - Round 25, item 2 (e), resolves to `docs/PREREGISTRATION-TEMPLATE.md`'s "Out-of-scope at dispatch" paragraph and `AUTONOMY.md` §25 (e).
  - The gate-1 architect's S1-1, S2-1 and S2-2, and the gate-1 reviewer's S2-1 and its section-N C7 note, say what the Amendment attributes to them.
  - There is no line cite, no hash reference, no ledger line cite and no self-line.
- Scope figure: numstat af40bbf..0e630623 with the form excluded gives `.claude/agents/lead-data.md` 22/0, `AI_DEVELOPMENT.md` 6/0, `engine/README.md` 34/0 and `kernel/README.md` 116/13. That is 178 + 13 = **191 over the 4 Scope files**, within 400. The figure is identical at daeaa487, the commit the Amendment names, because the only later change is the excluded form.
- Superseded index: its two entries are accurate. The 629fb7f index sections are replaced at cc8dfcce, and C7's 629fb7f line is replaced at c18f87f9. Its closing sentence, "Nothing else is superseded." (byte-copied from the Amendment), leaves out one replacement made in the round; see S2-1.

**6. Suites.** Run in the worktree at 0e630623. See Exit codes.

## Exit codes

Tool commit: the scripts as at 0e630623. They are byte-identical to af40bbf and to origin/main 19db1983 (`git diff --quiet` rc 0 for both). The last commit touching each:
- `verify-cites.mjs` 522e448d
- `verify-quotes.mjs` f9444a4d
- `verify-test-claims.mjs` e9735d47
- `verify.mjs` 26072022
- `scripts/plan` and `scripts/hooks` 859375c9

| Check | rc | Result line |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1148 files; 38 loose references advised, none in the four diff files |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 113 checked, 82 verified, 30 baselined, 1 advisory, 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 483 claimed tests across 113 files |
| `node scripts/plan/verify.mjs` (verify:plan) | 0 | PASS, PLAN.yaml agrees with the repository |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | tests 415, pass 415, fail 0 |

PR #166 CI, read by run id at 2026-10-03T11:37:46Z. The head is 0e630623, the PR is OPEN and MERGEABLE.

| Run | Event | Workflow | Head | State |
|---|---|---|---|---|
| 37119658308 | pull_request | DCO sign-off | 0e630623 | completed, success |
| 37119658240 | pull_request | Exposure scan | 0e630623 | completed, success |
| 37119658282 | pull_request | Governance CI | 0e630623 | completed, success |
| 37119658561 | pull_request | Product CI — shell | 0e630623 | completed, success |
| 37119658390 | pull_request | Product CI — Rust workspace | 0e630623 | **in_progress** (ubuntu passed; windows running) |
| 37119655167 | push | Governance CI | 0e630623 | completed, success |
| 37119482536 | push | Product CI — Rust workspace | daeaa487 | **in_progress** (ubuntu passed; windows running) |

Pending: 37119658390, the windows job on the head. Superseded daeaa487 PR runs 37119485830 and 37119486007 were cancelled by the newer push.

## S2 — suggestions

1. **Superseded index, "Nothing else is superseded."** c18f87f9 also replaces the 629fb7f bullet that begins "Nothing is exposed." (byte-copied). That bullet is pre-piece text, unchanged since af40bbf, so it may be left out by design if the index covers only this piece's own text. If so, the sentence is broader than that design. Either name the bullet or narrow the sentence; this is the architect's call.
2. **"References only" against what the Amendment carries.** The tools bullet's audit result is referenced only to the ruling, which states the rule, not the result. On main, the result resolves to question round 41, item 3 ("First runs"), and for dispatch 2 to report 2's filing note. For dispatch 1, "no shell call" resolves only to `state/drafts/weekly-window-2026-10-09.md:89`, a draft. The C5 bullets restate gate-1 findings that their reference already carries. The tools sentence is itself the record S2-1 asked for. Consider citing round 41, item 3, for the audit result in the closing amendment.
3. **The pointer's second source.** The ruled option (`state/questions/round-41.md:25`) reads, byte-copied: "One dated line after Part 3 saying the 2026-10-03 clarification governs." The pointer also names question round 41, item 3. That is true, because that ruling makes the porcelain check secondary, but it goes past the option's description. The pointer also lies outside the form's Change items (1) to (3). By the template's definition it is not class 9, because it rests on a one-off ruling, not a standing rule, and the Amendment records it by that ruling. This is the architect's call.

## N — nits

- Worker report 2's Size line says "191 added + 13 deleted". The counts are 178 added and 13 deleted, 191 in all. The Amendment's figure is right.
- C8's parenthetical names `publish.rs`. The `binding_publish_*` commands are defined in `frontends/shell/src-tauri/src/commands.rs` (lines 264, 401 and 450 @ af40bbf) and reach `boundary::execute` through `publish.rs:829`.
- SKP-V0 §3's `StreamHandle` row (`protocol/skp/SKP-V0.md:168` @ af40bbf sha256:9389d6dfe9da6165c6cc96f00396b239f3e832991d20c32ac8cdd5a0bade0bdb) itself cites ADR-019. The slot's normative source points onward to a Proposed ADR. This is not a defect.
- After C8, the kernel README's absent-section bullet still says the permission subset has no client. Read with `docs/09_Security_and_Privacy.md:21`'s list of clients (plugin, AI agent, notebook), the bullet holds beside C8's shell caller.
