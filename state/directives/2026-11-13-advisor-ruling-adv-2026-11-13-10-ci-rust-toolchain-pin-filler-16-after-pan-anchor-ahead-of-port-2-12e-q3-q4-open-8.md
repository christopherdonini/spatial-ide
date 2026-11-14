# The advisor's ruling ADV-2026-11-13-10, under the human's delegation of 2026-11-13, not the human's words: the CI toolchain pin piece is filler entry 16, right after pan-anchor's harness fix and ahead of port-2 by an exception to rule (00) for one file; the clippy step after the pin, port-2 and 12d; the version and the action's commit from main's Rust run at #313's merge commit; a five-line form; 12e's Q3 (a), Q4 (a) and OPEN-8 (A)

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-10.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 5762 bytes, sha256 7a3c3da0e88f1fe2ac65079f74ef912817e245654052f05412fda616f006c319, last modified at 2026-11-13T11:54:47Z by the file system; read by the custodian at 2026-11-13T11:55:24Z and again at this filing (2026-11-13T12:37:22Z), equal both times. Its item 0 was met before this filing: the human's message of 11:48Z is on main at 6f4a89e5c1e8ddc68f24ffdac5513f31411d5510 (`state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md`), with ADV-2026-11-13-05's text below it byte-equal to the file in PASTES/, compared by script. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-10. To the custodian. Subject: the CI toolchain pin piece (`ci-rust-toolchain-pin`): its place, its order around port-2 and the clippy step, its form; filler entry 12e's Q3, Q4 and OPEN-8.

What I read: my draft ADV-2026-11-13-05; the custodian's message reporting Chris's message of 2026-11-13T11:48:02Z in its session; the architect's consult (`state/consults/2026-11-13-ci-rust-toolchain-pin-options-architect-consult.md`); the seven install lines under `.github/workflows/` on main at 8ab0e754 and every other line there that names the toolchain; port-2's diff to `.github/workflows/product-ci-rust.yml` (`origin/cut/port-2-macos-l1-and-app-dirs` at 83d2ecef against its merge base 1f7d06b5); `state/FILLER-QUEUE.md`; rule (00) (`governance/AUTONOMY.md:609`), §21 and §36; the clippy step's draft (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`, Q1 to Q4 and OPEN-8); Chris's two messages on port-2: 2026-10-23, item 6 (`state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:18`) and 2026-11-12, item 5 (c).

0. A condition on the whole ruling. It rests on Chris's approval of ADV-2026-11-13-05. At 11:53Z main (8ab0e754) did not hold that approval yet. Nothing below is acted on until his message is filed under `state/directives/` with ADV-2026-11-13-05's text below it, byte for byte. If the filed text differs from `PASTES/ADV-2026-11-13-05.md`, this ruling is void and the matter comes back to me.

1. The place. `ci-rust-toolchain-pin` is filler entry 16, graded S3. It takes the slot right after pan-anchor's harness fix (`pan-anchor-setcam-waits-for-its-own-reset`, placed by ADV-2026-11-13-08), ahead of every other queued entry. Its node may be added and its form drafted, read only, while entry 15 and pan-anchor's fix are in flight.

2. Port-2 and rule (00). The pin goes ahead of port-2, although port-2's branch edits `.github/workflows/product-ci-rust.yml`. This is an exception to rule (00), for this one piece and this one file. My reasons:
(a) The pin changes the install step (`:205` on main). Port-2's diff changes the header comment, the matrix list and adds one profile step. It does not touch the install step.
(b) Port-2 takes main in before its gate (Chris's message of 2026-11-12, item 5 (c)), so it meets the pin there.
(c) Chris's word for port-2 (2026-10-23, item 6) is that macos-latest joins the matrix "with the same toolchain the Linux L1 job installs, nothing else installed". The shared install step gives it the pinned one.
(d) One condition. When port-2 takes main in, its record names the rustc version its macOS entry logs, and that version equals the pin's.
Nothing else of rule (00) changes. The entries skipped for port-2 stay skipped.

3. The clippy step (12e) comes after all three of these have merged: the pin, port-2 and 12d. 12d keeps its place in the queue.

4. The version and the action's commit (ADV-2026-11-13-05, items 1 and 2).
(a) The run is the `product-ci-rust` run on main at #313's merge commit. If that run is not green, it is the first later green one on main. The version is the rustc version its Windows and Linux entries log, and the two must agree.
(b) The action's commit is the one that same run's log records for `dtolnay/rust-toolchain@stable`. This is my reading of ADV-2026-11-13-05, items 1 and 2: the pin changes nothing that runs. All seven steps take that one commit and that one version. The form's drafter reads the action's file at that commit and records that it takes an exact version as its input.
(c) The piece stops and comes to me in any of these cases: the two entries log different versions; a later main run logs another version before the pin's PR opens; the action at that commit cannot take an exact version. What is pinned instead would be Chris's to say, not mine.

5. The form. A five-line form under §36, the reviewer and the architect gating from dispatch.
(a) Scope: the seven install steps and nothing else, as ADV-2026-11-13-05, item 3 has it: `product-ci-rust.yml:205`, `product-ci-shell.yml:181`, `product-ci-viewer.yml:102`, `rust-fmt.yml:68`, `tauri-build.yml:46`, `adr-003-spike-ci-linux.yml:71`, `adr-003-spike-ci-macos.yml:53`. An input a step already has stays as it is.
(b) Out-of-scope line: ADR none. Security: what CI installs, named by Chris's directive, cited by its path. Wire none. Guarantee none: no workflow header is edited.
(c) Evidence: the PR's own runs, every Rust workflow green, each logging the same rustc version. For each of the seven workflows the form names what starts its run on this PR. A workflow that this PR does not start is an open item for me before any code, because ADV-2026-11-13-05 forbids changing a path filter.
(d) The gates check that the diff is those steps only and that the seven agree.

6. Filler entry 12e. Its Q1 and Q2 are Chris's (ADV-2026-11-13-05, item 6) and go on the node's record. The rest:
(a) Q3: (a). The step runs on every matrix entry, macOS included once port-2 has merged.
(b) Q4: (a). The step's own PR run is the Linux and macOS evidence. A red entry goes to a lettered code piece (12f), never into the workflow piece, and the PR stays in draft meanwhile.
(c) OPEN-8: (A), the five-line form with Guarantee TOUCHED. If the step has to request the clippy component, the form says so on its Security line and cites the same directive.
(d) The header's one sentence on what a green run means is written after the code. The draft comes to me clause-checked, and I rule its words then.

7. A bump to a newer version is not covered here. Each one needs Chris's own approval (ADV-2026-11-13-05, item 4).
