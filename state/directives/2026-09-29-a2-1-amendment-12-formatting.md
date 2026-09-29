# Directive — Amendment 12's four old-test references lose their code formatting; the tool change goes to the weekly window (Fable, relayed by the human, verbatim)

*Custodian's filing note (2026-09-29): the human's message received after the custodian asked how to proceed with `verify-test-claims` on A2-1's branch. It was sent while the custodian was working, and it replaces the "Tool change first" option the human had chosen in the question moments before. It relays Fable's ruling and is recorded verbatim below the rule, as received. It is filed beside the 2026-09-29 sightings (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md`), as it asks. Cited as "the 2026-09-29 formatting ruling".*

*On the ruling's "Close the old PR": no PR had been opened for the old branch `cut/b1-close-nul-names`, so there is no PR to close. The old branch is kept until the new PR merges.*

---

Fable: option 1, with conditions.
- The only change to the sighted Amendment 12 is removing code formatting from the four references to
  the old W2-A2 tests. Keep their names, the branch, c37b427 and the file's sha256 exactly as they are.
  Fable accepts this as formatting only; record it beside the sighting.
- Gates carry over only with a recorded `git diff <old head> <new head>` showing exactly those four
  changes and nothing else. Any other difference means gating again.
- Commit order stays: the amendment first, then the worker's two commits cherry-picked unchanged. No
  force-push. Close the old PR with a pointer to the new one, and keep the old branch until the new PR
  merges.
- Add a proposal to the 2026-10-02 weekly window: verify-test-claims should accept a superseded pin to a
  commit that the same PR introduces. It doesn't block A2-1.
