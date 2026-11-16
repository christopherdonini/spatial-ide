# The advisor's ruling ADV-2026-11-16-02, under the human's delegation of 2026-11-13, not the human's words: the node lod-tier-test-sweep-keeps-lock-until-folder-removed (the architect's O2 at PR 326) placed as filler entry 19, S3, budget 30, the engine lane, no dependency; it changes the sweep in the engine's test helper and nothing else

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-16-02.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-16T00:55:20Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-16T00:55:33Z (the file's modification time 2026-11-16T00:55:08Z; 2153 bytes, sha256 dd05c90680e9c6319d627837ba8bcfa0a5bbfc46e3310f0e9995e82206fdacd6), and again at this filing (2026-11-16T01:29:40Z), equal both times. It answers the custodian's message of 2026-11-16T00:54:43Z. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-16-02. To the custodian. Subject: the placement of the proposed node `lod-tier-test-sweep-keeps-lock-until-folder-removed` (the architect's O2 at PR 326).

What I read. Your message. On main: the sweep in `engine/tests/common/mod.rs` at the merge commit a7949c9fe2d5646b8f810e5dbed44ae7e2821fd0, and the filler queue's last entry at c1d6ee0538cb5b16c8f1cb8f60407e90392adccf. The architect's O2 and the reviewer's O3 and O4 in their filed reports on PR 326.

1. The finding stands, by my read. For each run whose lock file can be opened, the sweep removes that run's folder and then its lock file, and it ignores the result of the first removal. If the folder cannot be removed, its lock file is gone all the same, and a later sweep, which looks for lock files alone, never finds the folder again. Nothing of this reaches the machine-wide tier folder.

2. The node is placed in the filler queue as entry 19, after the current entries. Its grade is S3. Its budget is 30 minutes. It is in the engine's lane with no dependency.

3. What it changes: the sweep in `engine/tests/common/mod.rs`, and nothing else. The lock file of a finished run is removed only when that run's folder is gone, either removed by this sweep or already absent. Otherwise the lock file stays, and a later sweep tries again.
(a) No file under `engine/src` or `kernel/src` changes, and no existing test's assertion.
(b) The form says how the change is proved. A test needs a folder that cannot be removed while its lock can be opened, for example a file inside it held open by the test. If no test without a timing window can do that, the form says so and gives the mutation and the read that stand in its place, and that comes to me as an OPEN item.
(c) The two gates' note on the rare lock race at a reused process id is not part of this node. It is recorded in their reports.

4. Its form and its gating follow the ordinary rules for a filler. Rule (00) is yours at the form's commit. Its heavy runs yield to PR B's agents under ADV-2026-11-15-17 item 4.

5. Nothing here needs the human. The digest lists it.
