Question round 34 — 2026-10-02 (custodian → human). Seven items, asked in two calls of 4 and 3, in this order. Items 1, 2 and 3 are RED LINE: under AUTONOMY.md §4 they take your typed words only (type them in Other); their only preset options are holds. Items 1 and 2 re-ask round 33's items 1 and 8, which I asked with preset options, against §4. Item 3 discloses a force-push. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. RED LINE (public exposure, ADR-009-adjacent) — round 33 item 1, re-asked for your typed words. In round 33 I offered preset options for this red-line item, which §4 does not allow. Your selection, "Both, two pieces (Recommended)", is recorded but is not a red-line ruling. The item: (A) workspace-rustfmt, one mechanical cargo fmt pass over the workspace and src-tauri with a CI fmt check in the same PR, superseding data-plane-crate-fmt; (B) exposure-scan-ci-backstop, a range mode for the profile-path scan and a workflow on every PR and every push to main, which detects after publication and never prints a matched segment. My recommendation: both, as two pieces, the backstop first, and the rustfmt pass only while no Rust branch is open. Meanwhile PR #153 (the backstop) has passed gate 1 and does not merge, and workspace-rustfmt does not start. Type your ruling in Other.
  (1) Hold. The item stays unruled; PR #153 stays open and unmerged.
  (2) Hold until the next window (2026-10-09).

---

2. RED LINE (what CI installs) — round 33 item 8, re-asked for your typed words, for the same reason. Your selection, "Approve, runner only", is recorded but is not a red-line ruling. The item: the CI system packages for the Linux shell build (PORT-3), WebKitGTK and its build dependencies, installed by the PORT-3 workflow in the runner only, never added to the repository's product dependencies. PORTABILITY gives no recommendation, and neither do I. PORT-3 stays proposed either way. Type your ruling in Other.
  (1) Hold. PORT-3's packages stay unapproved.
  (2) Hold until the next window (2026-10-09).

---

3. RED LINE (force-pushes), a disclosure. exposure-scan-ci-backstop's form (§4, E4), which I committed, had the worker force-push a throwaway probe branch, probe/exposure-scan-push, to prove the workflow's force-push case (run 36975368380; the branch is now deleted). Force-pushes are a red line, and I did not raise it before the form was committed. Nothing else was force-pushed, and no shared branch was touched. From now on I put any planned force-push, probe branches included, to you before the form is committed. Type in Other whether you accept E4 after the fact, or what you want done.
  (1) Hold. E4 stays recorded as an unruled red-line event.
  (2) Hold until the next window (2026-10-09).

---

4. Round 15 (e) and item C (test-claims-same-pr-superseded-pin, adopted in round 33 item 2). Round 15 (e) forbids a hash reference at a branch commit in an append-only record. Item C's tool change would accept exactly such a reference: a superseded row whose claiming line and pinned commit both come from the PR being scanned. Without an exception, any record that uses the new path fails its gate by name, and the code has no use. The architect's draft is filed whole as state/consults/2026-10-02-test-claims-same-pr-pin-architect-draft.md.
  (1) A narrow exception (Recommended). Round 33 item 2 is read as allowing that one row shape, only on a node that records a merge-commit merge. On main after the merge, the pin is an ancestor and the existing rule holds.
  (2) No exception. Item C closes; same-PR pins stay plain text, as accepted for A2-1.
  (3) Hold.

---

5. Item C's merge record: how the tool knows a PR will merge as a merge commit. Nothing records that today.
  (1) A node key (Recommended). A not-done node whose gate is the file carries merge: merge-commit, set by the custodian. One dated section appended at the end of AUTONOMY.md names it. A typo can only refuse.
  (2) The repository setting as a global record. The node condition is dropped. This needs item 6's setting first.
  (3) Hold.

---

6. Squash and rebase merges are still allowed. Round 26 item 3 says no PR whose commits a record cites is squash-merged, and that squash and rebase merging would be disabled in the repository settings. Read today with gh api, the repository still allows squash and rebase merges as well as merge commits. Records cite branch commits, and a squash or rebase would orphan them.
  (1) You disable squash and rebase merging (Settings → General → Pull Requests) (Recommended). Merge commits stay.
  (2) Leave it. Each PR keeps its "merge commit only" line, and the gates keep their block-on-sight item.
  (3) Hold.

---

7. The exposure-scan check as a required status check on main, once the backstop has merged and its first push to main (E5) is green. It depends on item 1. The backstop detects only after a push is public; making it required would also stop a PR with a profile path from merging to main.
  (1) Yes, after a green E5 (Recommended). You add the check "no profile path in the range" as required on main (branch protection). I tell you when E5 is green.
  (2) Not now.
  (3) Hold.
