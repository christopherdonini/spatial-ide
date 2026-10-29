Authority: PLAN.yaml node `known-limitations-owed-rows`; night program 2026-09-24 item 6 (`state/directives/2026-09-24-night-program.md`); DECISIONS-PENDING.md "RULED 2026-09-23 (later)" entry 120 item (1)(a); `frontends/shell/MANUAL-WALKTHROUGH.md` Part N row N9.
Scope: `KNOWN-LIMITATIONS.md` only; declared line budget <= 150 non-generated lines.
Change: adds five new rows (items 19-23, N9's five named limitations) to the "On main since v0.1.0" section, revises item 17's third sentence to the consult's declared bound, and brings items 17-18 to the file's house style; nothing else in the file moves.
Tests+mutation: none (a plain-text, declarative document; no code path or assertion is added) -- this piece's own gates are `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify.mjs --offline` and `docsOnly.mjs`, run and recorded in the closing report.
Out-of-scope: no ADR, wire, security or guarantee text; no code; no renumbering of existing items.

Budget: declared <= 150 non-generated lines (KNOWN-LIMITATIONS.md only); this preregistration file is exempt per AUTONOMY.md §21c's enumerated exempt set.

Correction 1 (fresh worker, reviewer attempt 1 -- Documentation FAIL): the Change line above claims items 17-18 were both brought to house style; item 18 was not touched by that commit and stands unrevised. The Authority line above omits `DECISIONS-PENDING.md:57` (entry 120 item (1)(c), the P0-bound revision authority) and `state/consults/2026-09-24-crs-unit-fact-and-bounds.md:77` (the consult text item 17 revises to); both are now cited on item 17 itself. Item fixes landed by commit fe51373: item 17 (the two references above, pinned), item 19 (ADR-016 A1 item 3 wording, component count, degradation-absence), item 20 (gate cite, glob-refusal case), item 22 (ADR-015 A1 item 6 wording, "cheap" removed, two omitted conditions), item 23 (Amendment 11 (b) cite, "not a missed detection" sourced).

Budget (this correction): `git diff --numstat origin/main...HEAD -- KNOWN-LIMITATIONS.md` = 61 lines changed (insertions+deletions), against the declared <= 150 (this form excluded per line 7).

## Closing commit (AI_DEVELOPMENT.md Amendment 1 §A)

1. Defect: Correction 1 cites the ledger by line, `DECISIONS-PENDING.md:57`, which round 12 (a) forbids. Corrected reference: DECISIONS-PENDING.md, "RULED 2026-09-23 (later)", entry 120, item (1)(c). Proof: `KNOWN-LIMITATIONS.md` item 17 already cites this same ruling by entry and item, never by line.

2. Defect: Correction 1's item-fixes sentence calls "the two references above" (the ledger entry and the consult line) "pinned" as a pair, but only one carries a hash pin. Corrected reference: only `state/consults/2026-09-24-crs-unit-fact-and-bounds.md:77 @ 464a6a1 sha256:c587eab650a7e2e9396861e67c5749ee4f5aba505de4a5b93dc18a5004c0cf6b` is pinned; the ledger reference is unpinned, by entry number, per round 12 (a). Proof: `git show 464a6a1:state/consults/2026-09-24-crs-unit-fact-and-bounds.md | sed -n '77p' | sha256sum` = `c587eab650a7e2e9396861e67c5749ee4f5aba505de4a5b93dc18a5004c0cf6b`.

3. Defect: Correction 1's budget sentence carries a bare self-line reference, "this form excluded per line 7". Corrected reference: the form's own Budget paragraph (the one beginning "Budget:", following the five-line form's Out-of-scope item), named rather than line-numbered. Proof: this closing block carries no bare `:line` self-cite; every reference above is by name, by entry number, or `path:line @ <commit> sha256:<hex>`.

4. Defect: Correction 1's budget sentence states 61 lines changed; that figure is `KNOWN-LIMITATIONS.md`'s insertions alone. Corrected reference: at `5f6688b`, `git diff --numstat` gives 61 insertions plus 4 deletions, 65 total, against the declared <= 150. Proof: `git diff --numstat origin/main...5f6688b -- KNOWN-LIMITATIONS.md` = `61	4	KNOWN-LIMITATIONS.md`.

**Superseded index (as of this closing block).** Both rows are on the branch commit `5f6688b` (not yet on main); the append-only rule keeps their committed bytes and this index records what they no longer state.

| Superseded text (by name) | Pin |
| --- | --- |
| Correction 1's item-fixes sentence, "(the two references above, pinned)" | `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md:9 @ 5f6688b sha256:4520b4ff31454826942b0d9542b44153aaeaf839b9a021656c76258f3d066e43` |
| Correction 1's budget sentence, "= 61 lines changed … this form excluded per line 7" | `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md:11 @ 5f6688b sha256:50af7ef1fa706312f2f85c61ca790569296b9bb9d54d0ecf2b1e83262c0b981a` |

Budget (this closing commit): `git diff --numstat origin/main -- KNOWN-LIMITATIONS.md` = 66 insertions, 4 deletions, 70 total, against the declared <= 150 (`KNOWN-LIMITATIONS.md` only); this preregistration file is exempt per the form's own Budget paragraph.
