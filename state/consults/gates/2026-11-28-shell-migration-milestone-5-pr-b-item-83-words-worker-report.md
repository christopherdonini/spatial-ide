# Milestone 5's second part, PR B: KNOWN-LIMITATIONS item 83 in the words of ADV-2026-11-28-07, the worker's report at 2aa41daf (node:shell-migration-milestone-5@pr-b-item-83-words)

*Filed by the custodian. The worker (Sonnet) worked in D:/wt/m5b from 4195e92cd51f54be45d294f7c9b02f8df4701cdc and pushed 2aa41daf6a637d0045c6f7c3a0e276c881f13432. By the facts script its records run from 2026-11-28T03:46:46Z to 2026-11-28T03:48:20Z, and 11 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 94176 ms and 16 tool uses. The custodian counted the ruling's fence, with NN as 83, once in KNOWN-LIMITATIONS.md at 2aa41daf: 1019 bytes, sha256 beginning 7002d50e2593f2a4, as the worker printed. Its hand-back is below as received, with the harness indent removed: 3174 bytes, sha256 14ec73ccb85cd41c9b9f0dbb26b9acef35896e244c4a78679613f4a54e5228af.*

---

Item 83 is now in the advisor's ADV-2026-11-28-07 words, with its source comment, in one commit pushed to cut/shell-migration-milestone-5-pr-b. HEAD and origin's branch are both 2aa41daf6a637d0045c6f7c3a0e276c881f13432, and `git status --porcelain` prints nothing. Per the brief, I ran no build, suite, test, mutation or e2e.

**Preconditions:** HEAD and origin were both 4195e92c before the change and the tree was clean. The ruling was 4131 bytes with sha256 3a947806aea2f818dd3a59aa15912bb9400fb28fcb18aceba8c2d3cd173b0269, as stated.

**Script:** D:/wt/m5b-logs/apply-item83.mjs. It printed:
- old item: 854 bytes, c962879c157982ee5bbc8520f304adfe914337cc40b19ff10ad1aeed6c33283a
- new item: 1019 bytes, 7002d50e2593f2a4b59b986f755405b98bcd3e1578a22f7b0d24bc9abab90521
- old comment: 1973 bytes, 28f900db36f096ed13bbf8a80e0b5af844287a7a01f999f5d16f203285559068
- new comment: 3020 bytes, 9c7a2ab22d149b12e29615b23ef9822139ba303c57fe13504bfc9baace49fd0c
- counts after writing: new item 1, old item 0, new comment 1, old comment 0

**Diff stat:** `KNOWN-LIMITATIONS.md | 4 ++--`, one file with 2 insertions and 2 deletions. I read the whole diff, and only item 83's body line and its comment line changed.

**New comment:** it keeps the old text and appends the following. Verbatim, copied from the diff output:

"Item 83's text is now that of ADV-2026-11-28-07 item 2 (state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-07-milestone-5-pr-b-known-limitations-item-83-the-buttons-count-and-a-refusal-past-the-cap.md; its item 2's text with its number NN as 83, copied byte for byte), which replaces the fenced text of ADV-2026-11-28-06 item 2 (state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-06-milestone-5-pr-b-known-limitations-item-83-one-sentence-added-for-a-notice-that-is-not-kept.md), which replaced the fenced text of ADV-2026-11-28-03 item 2. The two clauses that ADV-2026-11-28-07 changes, by the symbols of its item 3: the refusal or notice raised while the places for refusals and notices are full is `raise` in frontends/shell/src/conditions/conditions.ts (a route of urgency 2 or 3 that finds `CONDITIONS_MAX - 1` such conditions kept adds 1 to `notKept` and keeps none); the strip's button is `attentionOthers` in frontends/shell/src/App.tsx (`attention.others`, over the same `visibleConditions` that the Problems tab is given). -->"

It stays one HTML comment and carries no line number.

**Departures from the brief:**
- The 854-byte span ends with its trailing newline, and the comment follows it directly after four spaces. My first script assumed a newline between them and stopped before writing anything. I fixed the script, so the new item also ends with a newline.
- A sed fix of the script broke it for one run. It failed at parse and wrote nothing. I repaired it with the Edit tool, in D:/wt/m5b-logs only.
- The commit carries a Signed-off-by line, which `git commit -s` added from the git user's config. I typed none.
- I also wrote a small probe script, D:/wt/m5b-logs/probe.mjs, to check the span's hash. It read the repo file only.

**Not done, per the brief:** no build, suite, test, mutation or e2e, and no pull request.
