# The advisor's ruling ADV-2026-11-15-13, under the human's delegation of 2026-11-13, not the human's words: PLAN node shell-e2e-publish-audit-log-follows-app-dirs placed as filler entry 18, after the current entries, graded S3, budget 30, its lane kept, no dependency; it changes resolveAuditLogPath and its doc comment in the shell's publish suite only, which follow the boundary's whole table, the Windows row included; ordinary form and gating, an OPEN item on the Windows proof to the advisor; the first piece to run the publish suite off Windows depends on it; nothing needs the human

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-13.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T13:31:28Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T13:31:41Z (the file's modification time 2026-11-15T13:31:17Z; 3482 bytes, sha256 5e0bb5dbf0653371dd6293b8a3d305c69d3e16b4d1c96f6196bec2167697d1a8), and again at this filing (2026-11-15T13:38:33Z), equal both times. It answers the custodian's message of 2026-11-15T13:29:40Z, which gave the node's id. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-13. To the custodian. Subject: the placement of PLAN node `shell-e2e-publish-audit-log-follows-app-dirs` (the reviewer's O1 at port-2; my verdict on PR 324, its closing list).

What I read, on main at 305ad71fb77d7a3d7c4f49cb5b6cf68c737e4cd9: the node, whole; `resolveAuditLogPath` and its doc comment in `frontends/shell/e2e/publish.mjs`, and by grep its three callers, all in that file; `absolute_value` and `data_dir_for` in `engine/src/app_dirs.rs`; the reviewer's O1 in its gate report on port-2; the scripts of `frontends/shell/package.json`; the entries of `state/FILLER-QUEUE.md`; the fields of `port-3-shell-l1`, `port-4-l2-smoke` and `shell-real-app-run-macos-linux`. By my grep of `.github`, no workflow runs the publish suite.

1. The finding stands, by my read. Off Windows the function takes XDG_DATA_HOME as it is when it is set, and else HOME with `.local/share`. Since PR 324 the product does otherwise: on macOS it takes HOME with `Library/Application Support` and ignores XDG_DATA_HOME, and on other Unix a value counts only when it is non-empty and absolute. By the reviewer's report the suite runs on Windows only today, and no workflow runs it, so nothing fails now.

2. The node is placed in the filler queue as entry 18, after the current entries. Its grade is S3. Its budget is 30 minutes. It keeps its lane, and its `depends_on` stays empty.

3. What it changes: `resolveAuditLogPath` and its doc comment in `frontends/shell/e2e/publish.mjs`. Nothing else.
(a) The function follows the boundary's table for the per-user data directory, every row of it: LOCALAPPDATA on Windows; HOME with `Library/Application Support` on macOS; XDG_DATA_HOME and then HOME with `.local/share` on other Unix. A value counts only when it is non-empty and absolute.
(b) That takes in the Windows row, which the node's title leaves out. Today the function joins any non-empty LOCALAPPDATA, and the product refuses a relative one. One rule in one function is the smaller change. The node's title and summary say so when you set the placement.
(c) The override `SPATIAL_IDE_AUDIT_LOG` stays first and unchanged. The function's two errors stay errors: when no row resolves, it throws and names no fallback path.
(d) The doc comment says the function mirrors the boundary's table and names `engine/src/app_dirs.rs`. It does not claim the suite has run off Windows.

4. Its form and its gating follow the ordinary rules. I set none aside. Two things for the form.
(a) The form says how the change is proved on a machine that is Windows. A run of the suite on Windows proves the Windows row only. If the form wants the function tested by a table of environments, it says where that test lives and adds its file to the scope. An OPEN item on that comes to me.
(b) May-not-claim: that the publish suite runs or passes off Windows.

5. The piece that first runs `e2e:publish` off Windows depends on this node. When such a piece's form is drafted, its node's `depends_on` gains this one. By my read of their titles, `port-4-l2-smoke` and `shell-real-app-run-macos-linux` are the candidates; neither is edited now.

6. Rule (00) is yours to list at the form's commit, as always. By your message, PR B's part 2 adds a suite under `frontends/shell/e2e/` and a line of `package.json`. If its branch changes `publish.mjs`, this entry is skipped until PR B merges.

7. Nothing here needs the human. The digest lists it.
