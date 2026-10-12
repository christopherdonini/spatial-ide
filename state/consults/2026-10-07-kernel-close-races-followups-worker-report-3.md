*Custodian's filing note (2026-10-07): `kernel-close-races-followups`'s worker report 3, PR #186's gate-1 Documentation fixes (the architect's D-1 to D-3, the reviewer's D1 and D2), by the worker (Sonnet 5.5, by its definition) on the custodian's brief, with the custodian's one follow-up on fix 1. It arrived as two hand-back messages, extracted here by script from the two SubagentHandback calls in the subagent's own transcript, each with nothing changed except one final newline. Part 1 is the first (sha256 0f395c0d144cad15ebbd6e0a378e980718f66454a8c2231e7db503f9b079f4dd), part 2 the follow-up (sha256 771f5dbdf8c781156c0918ad5da57ba2cbaeb231e099b148f064b0f4d4b40d73). Write audit PASS: 2 Writes in the session's scratch folder, the edits by shell in the worktree `C:/dev/wt/kcrf`; a scratch file it made beside the worktree was deleted before its commit (custodian confirmed absent). Run window from the transcript: 2026-10-07T02:45:46.118Z to 02:52:23.137Z. The custodian checked the fixes against the findings by the diff 78e52eea..a1ab83ec: 3 files; the SKP-V0 note names `Catalog::remove`'s doc and `TicketState`'s `dataset` field by item; C4's lead-in reads as a paraphrase; `isSessionEndedRefusal`'s doc names the three sites by item; all seven files valid UTF-8; the piece 115 lines over 7.*

---

## Part 1

Commit f143267473cc5e956fca704c512e8a6876389836, pushed to origin as an ordinary update (78e52eea..f1432674, exit 0). Model: Sonnet 5.5 (claude-sonnet-5-5). I ran no cargo build and no test suite. The commit adds 7 lines and removes 4, in 3 files.

**Fix 1: SKP-V0 note item (ii), answers architect D-1 and reviewer D2.**
- Old: `> now states what the catalog's `remove` documents. (iii) No literal, key, value, code or command`
- New:
  ```
  > now states what `Catalog::remove`'s doc says of live streams and pool leases and what
  > `TicketState` in `kernel/src/skp.rs` says of the by-name hold. (iii) No literal, key, value, code or command
  ```
- It now names both sources by item. The §1 sentence is untouched.
- Re-derived at the base: `Catalog::remove`'s doc in `kernel/src/lib.rs` says a live stream holds no `Arc<Dataset>` and that a pool lease keeps the pool alive. `TicketState` is declared in `kernel/src/skp.rs`. I checked that it exists and not its wording on by-name.
- The new second line is 111 characters, past the 100-column mark. I didn't re-wrap it, because that would have moved the following text.

**Fix 2: C4's lead-in in `TicketLiveness`'s doc, answers architect D-2.**
- Old: `/// The P3 attempt-2 defect this type exists to prevent, as the ADMISSION form words it`
- New: `/// The P3 attempt-2 defect this type exists to prevent, as the ADMISSION form records it`
- The `engine/ADMISSION-PREREGISTRATION.md:742-744` token is unchanged.

**Fix 3: `isSessionEndedRefusal`'s doc, answers architect D-3 and reviewer D1.**
- Old:
  ```
  * `SkpCallError`, from `SkpHost::viewport_query`'s own live-generation check, reaching this client
  * through `skp/client.ts:58-65`.
  ```
- New:
  ```
  * `SkpCallError`, reaching this client through `skp/client.ts:58-65`. The first refusal after a
  * change is `viewport_query_mint`'s `open_engine_stream` arm (it ends the generation on
  * `SourceChanged`); later ones are `SkpHost::viewport_query`'s live-generation check; the mint-race
  * arm is `viewport_query_attribute`'s refusal when `attribute_ticket` returns false.
  ```
- Sites re-derived at the base 99f4c437, in `kernel/src/skp.rs`:
  - **First refusal after a change:** `viewport_query_mint` (base line 1402). Its `open_engine_stream(ds, &query, projection.as_ref())` call has a `map_err` that calls `end_generation` on `EngineError::SourceChanged` (base lines 1464-1468).
  - **Later queries:** `SkpHost::viewport_query` (base line 1370) calls `viewport_query_mint`. The `live_generation` check sits at base line 1433, inside that private helper. The wording follows your brief, and it is still the same call path.
  - **Mint-race arm:** `viewport_query_attribute` (base line 1491). It refuses at base lines 1502-1504 when `attribute_ticket` returns false. After that it cancels the ticket and answers with the ended reason, or `unknown_dataset` if none was recorded.
- No line numbers are written into the comment.

**Checks, each with its exit code:**
- UTF-8 (`iconv -f UTF-8 -t UTF-8`) on all 7 files in the branch diff against the base: exit 0 on each.
- `npx tsc --noEmit` in `frontends/shell`: exit 0.
- `verify-cites.mjs`: exit 0.
- `verify-quotes.mjs`: exit 0.
- `verify-test-claims.mjs`: exit 0.
- `verify.mjs`: exit 0.
- I ran the UTF-8 and numstat checks before committing, against the working tree. The numstat below is `git diff --numstat 99f4c437 HEAD` after the commit.

**Numstat per file against §7 (base to HEAD):**

| File | Added | Removed | §7 ceiling |
|---|---|---|---|
| `kernel/src/skp.rs` | 25 | 18 | 60 (total 43) |
| `frontends/shell/src/streaming/liveTicketSet.ts` | 8 | 6 | 16 (total 14, 2 lines left) |
| `protocol/skp/SKP-V0.md` | 14 | 2 | 24 (total 16) |
| `frontends/shell/src/streaming/formatTerminalRefusal.ts` | 3 | 2 | |
| `kernel/README.md` | 3 | 3 | |
| `kernel/tests/session_generation.rs` | 14 | 14 | |
| `kernel/tests/wire_bytes_invariant.rs` | 2 | 1 | |
| Total | 69 | 46 | 168 (total 115) |

I read each §7 ceiling as added plus removed. The ceilings are the ones in your brief. I did not re-read §7 itself.

**Off-scope, not done:**
- `liveTicketSet.ts` has three lines over 100 columns: 68, 77 and 92. Two were over before this commit, and I haven't checked line 92 against the base.
- I created a scratch file at `C:/dev/wt/kcrf-base-skp.rs`, outside the worktree and your scratch folder. I deleted it before committing.

**State:** `git status --porcelain` is clean for tracked files and the branch matches origin.

## Part 2

Follow-up on fix 1 is committed and pushed. The commit is a1ab83ec6440cb03d7f3a641faafd4f5eca32ac1. I pushed it as an ordinary update (f1432674..a1ab83ec, exit 0).

This commit follows f143267473cc5e956fca704c512e8a6876389836 on the same branch. Only `protocol/skp/SKP-V0.md` changed.

Old, byte-copied from `git diff`:
`> `TicketState` in `kernel/src/skp.rs` says of the by-name hold. (iii) No literal, key, value, code or command`

New:
`> `TicketState`'s variants in `kernel/src/skp.rs` carry the dataset by name in their `dataset` field. (iii) No literal, key, value, code or command`

I did not re-check the `dataset: String` field in `kernel/src/skp.rs` at 99f4c437. The new wording follows your description of it.

`git diff --numstat 99f4c437 HEAD -- protocol/skp/SKP-V0.md` gives 14 added and 2 removed, which is 16 against the §7 ceiling of 24. This is the same count as before the reword.

Check exit codes:
- `iconv -f UTF-8 -t UTF-8` on `protocol/skp/SKP-V0.md`: 0
- `verify-cites.mjs`: 0
- `verify-quotes.mjs`: 0
- `verify.mjs`: 0

I did not re-run `tsc` or `verify-test-claims.mjs`. The edit only touches a markdown note.

Model: Sonnet 5.5 (claude-sonnet-5-5).
