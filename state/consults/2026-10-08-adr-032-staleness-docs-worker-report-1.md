*Custodian's filing note (2026-10-08): `adr-032-staleness-docs`'s worker report, at the branch head 7b7438e7199ba42fa75716565d1bf8ff9df5972e (worker run from 17:25:36Z, report at 17:30:30Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 11135f4c24351b968ab878feac092969f070f18cd311a5c9d3bfd6aa731f78ed. The custodian read the diff from main (the two source files, 6 lines added and 6 removed, and the regenerated files). Paths and lines below are at the branch head, not main. PR #193.*

---

The ADR-032 staleness change is committed as one signed-off commit and pushed to origin as a fast-forward (be845ea3..7b7438e7). There was no PR, force, rebase or merge. All checks exit 0.

**Head:** 7b7438e7199ba42fa75716565d1bf8ff9df5972e. `git status --porcelain` is clean.

**New parenthetical** (`docs/README.md:27`, byte-copied from the tracked file; everything before the "**ADR-032**" subject phrase and after the closing ")" is untouched):
`**ADR-032** (axis order for a GeoParquet source whose CRS definition declares a non-x-first order — **accepted 2026-09-23** on the human's word, as it stands (PR #103), having been filed Proposed 2026-09-08 on DECISIONS-PENDING entry 59 = (a)).`
I did not name the decision itself. The open-decision and sequencing-note clauses are gone.

**Node `adr-032-decision`:**
- `status: done`
- `evidence: {pr: 103}`
- `needs_human: {kind: none, minutes: 0}`
- `dates: {opened: 2026-09-09, done: 2026-09-24}`
- The summary now begins "ACCEPTED 2026-09-23 on the human's word, as it stands: PR #103, the node accept-adr-032. Before: the problem statement and candidates A/B/C are drafted for the human's sight; the admission decision is theirs". No other node was touched.

**Numstat** (`git diff --numstat origin/main...HEAD -- docs/README.md PLAN.yaml`): PLAN.yaml 5/5, docs/README.md 1/1, so 12 changed lines, which is at the bound. `CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/data/plan.json` and `site/index.html` were regenerated and are excluded from the count.

**Checks** (all exit 0): `queue.mjs` and `site.mjs` regenerate, `verify.mjs`, `queue.mjs --check`, `site.mjs --check`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`.
- **Test suite:** `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` passed 457 of 457, fail 0, exit 0.
- **README search:** no ADR-032 text on line 27 reads Proposed or open now. The remaining hits are historical and untouched:
  - the "filed Proposed" wording in the new parenthetical;
  - the verbatim ruling quote in the ADR-032 table row at `docs/README.md:69`, which already shows Accepted.

**Pre-gate self-check:**
- **Cross-module seams:** none. This is docs and plan data only.
- **Completion claims:** each one is backed by a check above.
- **User-facing messages:** none.
- **Required tests:** none required by the form. The scripts suite ran to completion.

**Deviation:** none. I ran as Sonnet 5.5 with no model override and no context handoff. The scratch file `msg.txt` already existed from earlier work, so I overwrote it with the commit message.
