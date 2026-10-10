# The human's four findings on #195's first-gated commit, confirmed and proposed as one node — the human, verbatim (filed late)

*Custodian's filing note (2026-10-10): typed by the human, received at 2026-10-09T20:33:21Z by the transcript as one message (origin human). Filed late, on 2026-10-10, after the filter-identity form's architect draft found no directive file for area C; the instructions were acted on when received, and the custodian's check records answered them. Below the rule is the message, byte-copied by script from that record, from line 6 to the end. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
An independent read I ran on #195's first-gated commit found four things the gates did not, all still on main. Confirm each and append one proposed node for those that hold; nothing waits on it.
1. frontends/shell/src/style/StylePanel.tsx, the header comment (about lines 35-41): it describes the old layout's 200 px canvas floor and 21.8 px headroom as current.
2. frontends/shell/src/publish/PublishPanel.tsx, about line 310: it points to the styles.css .publish-panel comment "for the measured layout budget" as if current.
3. MANUAL-WALKTHROUGH.md row S1: "No describe summary and no canvas appear" is false when a dataset is already on the map, since the summary now renders from that dataset.
4. frontends/shell/src/layout/layoutBoundary.test.ts, its header comment: it says the layout "cannot reach the map's code", but regionParts.tsx and statusItems.ts import ../App. The test proves direct imports only.
