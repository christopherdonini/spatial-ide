# Rulings — the milestone 1 mutations allowed, the #192 branch deleted, the docs/08 sentence typed, ADR-036 later (the human, verbatim)

*Custodian's filing note (2026-10-08): typed by the human as a new message, received at 18:02:48Z by the transcript (a user turn, origin human). Below the rule, byte-copied by script from the transcript with one final newline added, with nothing else, is the message (from line 6 to the end). Item 1 answers the custodian's question on milestone 1's still-able-to-fail mutations; item 2 the question on #192's published branch; item 3 is the typed docs/08 sentence the reuse direction's item 3 asked for; item 4 is ADR-036's acceptance timing. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
1. Milestone 1, the mutations: (a). I allow the worker to make the temporary
   product-file edits listed in its report 4, section 4, in the milestone 1
   worktree only.
   - One mutation at a time. After each run the file is restored and the
     worktree is shown clean before the next.
   - No mutation is ever committed, pushed or left in place.
   - Nothing outside that list is edited.
   - The report gives, for each one, the edit, the step that failed and the
     clean check.
   - pan-anchor there-and-back-net has no honest product mutation. An input-side
     control is enough: a return drag shorter than the outward one must fail the
     check. The PR body says so.
   - If the permission system still refuses, stop and tell me. Do not route
     around it.

2. #192: delete the published branch cut/reuse-round-1-bundle, local and remote.
   Touch no other branch.

3. docs/08, line 40. The sentence that lands:
   - **Public data**: Overture Maps, OSM extracts, Sentinel/NAIP samples — real
     scale. Each file is fetched from its source and kept local, never
     redistributed; its hash, licence and attribution are recorded.

4. ADR-036: I take up the architect's report on the ten findings later. It
   holds nothing now.
