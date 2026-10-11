*Custodian's filing note (2026-10-11): piece e worker report 3, correction round 2 (gate 2's C1), the worker run 17:36:57Z to 17:43:21Z by its transcript, on cut/skp-v0-live-sections-current-area-c, head 7918de41a16d6517a1cc69753eff41d9e977ded5, published; the sentence's words are the worker's. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added. The sha256 of the report as handed back is 4f6f317e77cda4e4c1201e40020a7a25c16a945d6adf26267df4c82781c0d5e1.*

---

C1 is fixed in two edits to `protocol/skp/SKP-V0.md`; the new head is pushed and the tree is clean. All runs exit 0.

**New head:** 7918de41a16d6517a1cc69753eff41d9e977ded5, a plain push (20d8546e..7918de41). Before the edit, after `git fetch origin`, HEAD and `origin/cut/skp-v0-live-sections-current-area-c` were both 20d8546e, and `git status --porcelain` was empty. Only `protocol/skp/SKP-V0.md` changed (4 lines in, 4 out).

**Sentence in the `describe` lead (§1)**
- Old: "Every field maps to an existing `engine::Dataset` accessor, except `coverage` and `session_end`, which come from the host's watch and generation state; none of them runs a new query:"
- New: "Fields read an existing `engine::Dataset` accessor where one exists; `extent` has none (§2, C1), and `coverage` and `session_end` come from the host's watch and generation state; none of them runs a new query:"

**Clause in the S12 note's §1 bullet (end of §8)**
- Old: "and its accessor sentence excepts `coverage` and `session_end`;"
- New: "and its accessor sentence reads accessors where one exists and names `extent` (no accessor, §2 C1), `coverage` and `session_end` (host state) as the ones that do not;"

**Code checked, per clause (all in `kernel/src/skp.rs`)**
- **"Fields read an existing accessor where one exists":** `describe_dataset` reads `ds.crs()`, `ds.identity()`, `ds.source_license()`, `ds.path()`, `ds.geometry_column()`, `ds.file_schema()`, `ds.covering()` and `ds.admission()`.
- **"`extent` has none (§2, C1)":** `describe_dataset` fills `extent` with a constant (`not-established-at-open`, value `None`). Its comment says no `Dataset::bounds()` accessor exists.
- **"`coverage` and `session_end` come from the host's watch and generation state":** `SkpHost::describe` fills `coverage` from `self.watches` and `session_end` from `self.generations.ended_reason`.
- **"None of them runs a new query":** this holds. `describe_dataset` and `SkpHost::describe` only read accessors, a lock on the watch table, and `ds.descriptor().unestablished_components()`. The rest is constants. There is no IO and no scan.

**Runs**

| Run | Exit code |
|---|---|
| E8 by script (`git show` of B's §8, byte prefix of the head's §8, lengths 39506 vs 42021) | 0 |
| `node scripts/plan/verify-cites.mjs` | 0 |
| `node scripts/plan/verify-quotes.mjs` | 0 |
| `node scripts/plan/verify.mjs` | 0 |
| `git diff --numstat 1457fbd0...HEAD -- protocol/skp/SKP-V0.md` | 0 |
| `git push origin cut/skp-v0-live-sections-current-area-c` | 0 |

- **E8 detail:** the E8 check ran on the working tree after the edit and before the commit. It was cut from the `## 8` heading to `## 9`.
- **Numstat:** the result is 52 added and 20 deleted, 72 changed lines in total. That is under the 130 limit.
- **First attempt:** my first edit script asserted on the wrong line wrap and changed nothing. The E8, cites and quotes results from that attempt were run on unedited files and are not counted above.

**Final `git status --porcelain`:** empty.

**Self-check on the four failure classes:**
- Cross-module interfaces: no seam was touched. The sentence was checked against `kernel/src/skp.rs`.
- Completion claims: each clause above is tied to code.
- User-facing messages: none were added.
- Required tests: none apply, since this is documents only.

**Model and context:** I ran as Sonnet 5.5, with no override and no context handoff.

**Not done, as instructed:** the PR body's old "excepting `coverage` and `session_end`" wording is still unchanged, and the gate 2 report's D1 and D2 are untouched.
