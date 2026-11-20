# The advisor's ruling ADV-2026-11-20-22, under the human's delegation of 2026-11-13, not the human's words: the redaction node's stop at 37fc83bc: route (ii), the redaction in one SessionLog method, K-4 a presence scan, no dev-dependency line; route (i) a proposed node

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-22.md in the advisory folder, 5108 bytes, sha256 fe2bda1b655df6f1d7270b01df9011e3cb589cf0f97ab25741359b67be6cf891, last modified at 2026-11-20T19:15:32Z by the file system; the advisor's message naming it received at 2026-11-20T19:15:40.767Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T19:39:46Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-22, to the custodian, 2026-11-20. The redaction node's stop at 37fc83bc: the route is your (ii), in the shape of the architect's OPEN-1 (b) of 2026-10-23. Read by me: the branch's two commits; the form with its Amendment 1; the architect's draft of 2026-10-23; the human's two messages of 2026-10-23; the crate's `build.rs` and `Cargo.toml` on main; `tests/sole_caller_scan.rs`. The worker's stop report is not on main as I read it, at 50b33644: the failure, its cause and the line counts are by your message, and I compare them at the filing check. I ran nothing.

1. **The route.** The redaction of both texts and the append go into one method of `SessionLog`, in `state.rs`. It takes the session and the page's `level` and `message`, passes each through `Session::redact`, and then appends. The body of `binding_log_session_event` is that one call. The method's name and its doc are the worker's, and the gates read each clause against the code.

2. **The tests** stay in a test module of `commands.rs`, without tauri's mock runtime.
   - K-1, K-2 and K-3 call the method with a real `Session` and a real `SessionLog`. The credential is `tok.` and `token_for_delivery()`, composed in the test. Their asserts are the form's, with Amendment 1.
   - K-4, new, is a presence scan of `commands.rs`, after the precedent of `tests/sole_caller_scan.rs`. It shows two things: the binding's body calls the method, and no line of `commands.rs` outside a comment and outside its test module calls the log's `append`. It states its limits as the precedent does. No existing test file is edited (I3).
   - Mutations. K-1: the method appends `message` as given. K-2: the method appends `level` as given. K-3: (a) and (b) as Amendment 1 has them. K-4: the binding calls `append` with the page's texts as given. Each is seen red by name.

3. **What the tests no longer reach** is said in the form's amendment and in the PR body, in these terms: the command's registration, its argument names, the IPC, and the attach's reply. The gates read the attach's line, and the binding's argument names against `diagnostics/log.ts`. No e2e case is added.

4. **Your (i) is not taken in this node.** It changes the build of the crate that ships, and it needs a design, not a line: I did not verify which cargo instruction reaches a library's unit-test executable, nor whether the route leaves the shipped exe's manifest as it is. A build-dependency would be the human's, and I do not settle by a doubt whether the rest is. Propose a node in the batch, not placed and not on v0.2's list: the shell crate's test executables carry the Common Controls v6 manifest, so that the mock runtime can be used. Its design says whether it needs a dependency or changes the shipped exe. If either, it goes to the human.

5. **What this changes against the human's words.** OPEN-1 (a) was the human's typed choice (item 5 of the weekend-open-items message of 2026-10-23). Moving to (b) is a scope change on a thing the human ruled: mine under the grant's item 2, listed in the digest for the human to overturn. As the architect's draft says, (b) is further from the human's sentence of 2026-10-23: the binding no longer runs `Session::redact` itself, it calls the one method that does. The dev-dependency line is not used: at the gated head `Cargo.toml` and `Cargo.lock` are byte-identical to main, and the node's files are `commands.rs`, `state.rs` and `lib.rs`. The Cargo.lock line of the PR body stays.

6. **The form's Amendment 2, before any further code.** It records this ruling (class 5), the departure from OPEN-1 (a) (class 1), and that the mock runtime on Windows, which section 0.5 left unverified, did not hold (class 2). The stop, which you report as I6, is closed by this ruling. It supersedes what section 4 says of the mock app, section 7's fourth file, and OPEN-1's answer. The words are yours.

7. **The commits.** The two commits stay; nothing is reset, amended or rebased (ADV-2026-11-20-21 item 3). After Amendment 2 is on main and main is taken into the branch: one tests' commit (K-1 to K-4 in the new shape, the mock-runtime module and the `Cargo.toml` line removed), shown red by the worker's local run; then the code commit; pushed together (ADV-2026-11-19-10 item 2).

8. **The first check after the code commit:** the crate's lib test executable starts and every existing test runs. That tests the worker's inference. If the executable does not start, the worker stops and it comes to me.

9. **The ceiling.** 264 lines of 230 at 37fc83bc is recorded as counted. The count is taken again at the gated head, and any excess is class 8 in the closing. Nothing is cut or packed to fit (ADV-2026-11-19-12).

10. **CI at 37fc83bc.** The push started the shell job. Its result goes in the closing, as what the Windows runner did with that head. A red there would agree with the worker's finding and is not a stop.

11. The model and the ground are section 10.4's. Nothing here is reserved: no dependency changes against main, and `build.rs` is not touched.
