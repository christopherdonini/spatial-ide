*Custodian's filing note (2026-10-03): worker report 2 for PLAN node `kernel-ticket-drop-followups` (node 9, round 2: lead-data's owner's-index update applied), written by the worker to this path itself under the 2026-10-03 trial directive (part 1) and committed as written below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 50cb6753fd5a63cd801eb548b7ec0710e0cfe91e9492c407e1a455e212d34d1c, computed by the custodian. It equals the worker's returned sha256. Its commit is 86774b06 on `cut/kernel-ticket-drop-followups`.*

---

# kernel-ticket-drop-followups (node 9): worker report 2 (the owner's-index update, C1)

- Worker model observed: Sonnet 5.5 (`claude-sonnet-5-5`), no override, no context handoff.
- Before the edit, `git fetch` showed origin's branch head and local HEAD both at `4d487d51f20cf0e637ad4068320760f91cfc858e`, and the worktree `C:/dev/wt/ticket-drop-fu` clean.
- Source text: section 1 of `state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-index.md`, read and not edited. Sections 3 and 4 were not acted on.

## What was done

- One commit, `86774b0647b93f7ecf35de4b23a895f546f522d8`: `docs: kernel owner's index for the ticket-drop follow-ups (C1; lead-data's update applied as written)`. It is signed off and ends with the two trailer lines. `profile-path-scan --staged` ran before it, rc 0, clean.
- Pushed with a plain `git push`: `4d487d51..86774b06`. Origin's branch head now equals the local head. Worktree clean.
- The edit replaces `kernel/README.md` lines 350 (Last verified at), 353 (the Stream tickets bullet) and 373 (the preregistrations list).
  - The three replacement lines were extracted mechanically from the first three fenced blocks of section 1 (an awk pass), not retyped. Each is byte-identical to its block line (`grep -Fx` against the source file returned 1 for each).
  - Each line's leading indentation is preserved (0, 2 and 2 spaces, as in the existing lines).
  - The file has no CR bytes, and no line outside those three changed.
- `git diff --numstat` before the commit: `3 3 kernel/README.md`.

## Test paths in the new Stream tickets line

All four exist at the head, checked with `CARGO_TARGET_DIR=D:/wt-targets/ticket-drop-fu cargo test -p spatial-kernel --lib -- --list` (rc 0), which lists each of the three lib tests exactly once:
- `skp::tests::a_ticket_redeems_exactly_once`
- `skp::ticket_drop_under_lock_regression::an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`
- `skp::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`

The fourth, `kernel/tests/skp_admission.rs::a_raw_stream_params_start_is_refused_in_ticket_only_mode`, is an integration test: `fn` at `kernel/tests/skp_admission.rs` line 214, and it ran `ok` in round 1's full `cargo test -p spatial-kernel`. It is not in the lib `--list`, which is expected.

## Checks after the commit, each rc as it came out

| Command | rc | Result |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS: 113 checked, 82 verified, 30 baselined |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS: 486 claimed tests |
| `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS: all 3 new tests have a recorded mutation naming them |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 415 tests, 415 pass, 0 fail |
| `node scripts/hooks/profile-path-scan.mjs --staged` (before the commit) | 0 | clean |

## §7's count

The merge-base of `origin/main` and HEAD is `4c50677cd4a9e78c2e647b737976814899277e91`.
- `git diff --numstat <merge-base>..HEAD -- kernel/src/skp.rs`: `290 26`, unchanged from round 1 (316 of 320).
- The same command for `kernel/README.md`: `3 3`.

## Deviations and off-scope

- No deviation from the brief.
- No `cargo` suite was re-run in this round, because only a markdown file changed since round 1's green runs at `4d487d51`.
- Not done, as instructed: the Close ordering pointer (lead-data's section 3) and section 4. The custodian routes those.
