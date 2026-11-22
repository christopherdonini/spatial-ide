# The advisor's draft ADV-2026-11-22-02, for the human's approval: the Guardian checks a Monitor command as it checks a Bash command (the human's message of 2026-11-22, item 2 (b)); its approval is the human's typed approval naming the piece's two live checks. Not the human's words and not a ruling: it is reserved to the human under the grant's item 4 (c), so nothing in it is acted on until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-22: PASTES/ADV-2026-11-22-02.md in the advisory folder, 7822 bytes, sha256 054b789bc4d6aab10d59b8c139cb8e26621a4432fc62cca62f1c9fb9bbd3151d, last modified at 2026-11-22T03:49:02Z by the file system; the advisor's message naming it received at 2026-11-22T03:49:45.353Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T03:51:22Z), equal. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-22. The Guardian checks a Monitor command as it checks a Bash command. This is the draft that item 2 (b) of my message of 2026-11-22 asks for.

1. The change. In tools/mods/spatial-guardian, on the piece's own branch:
   (a) One registration for the tool Monitor, with the shell decision Bash has today: G1, G7, G8 and G9, in that order. G6 is not added: in the shell decision it applies to a subagent's PowerShell call alone.
   (b) The refusal log's target map gains Monitor, with the call's command as its target.
   (c) A Monitor call with no command, a ws watch, stays allowed.
   (d) The README's lines on what the Guardian does not claim, on the shell route and on its files, and the plugin tests, are changed to match.
   Nothing else: no other tool, rule, reason text or log field.

2. Where. On the branch cut/guardian-monitor, in its own worktree, the way v1 was changed on cut/guardian-v1. Never in the main checkout's folder, which is the installed copy (item 5). If a standing rule or the Guardian refuses that work, the custodian stops and sends me the change as a patch file, and I apply it myself.

3. Tests during development, through the registered handler. The worker runs `claude plugin test tools/mods/spatial-guardian`. It may also run `claude --version` and `claude plugin validate`, as the N1 form allowed, and no other `claude` command.
   (a) First the worker establishes what a Monitor call's event looks like on the installed build, from the engine-written types and validate's hook line. The fixtures are built from that, not from an assumed shape. Today only the call's input is known (description, timeout_ms, command, ws), not the event a handler receives. If the engine hands no Monitor call to a tool.call handler, or the event does not carry the command, the piece stops and comes back to me.
   (b) Inert fixtures for G1 (a force-push), G7 (a merge), G8 (a plugin install) and G9 (a clean of the target).
   (c) A harmless command and a commandless ws watch, both allowed.
   (d) Each test asserts whether execution continued and what the refusal log recorded: the rule, the tool Monitor, the agent, and the sha256 of the target. An allowed call writes no log line.
   (e) Each new test fails under a declared mutation: the registration removed; Monitor dropped from the target map.

4. Approval, class and merge.
   (a) My approval of this draft, by its id, is my typed approval naming the piece's live checks, which item 5 (e) of my message of 2026-11-13 asks for. The live checks are the two of item 6 and no others.
   (b) The class is the advisor's: a full form with both gates (ADV-2026-11-22-01, item 5).
   (c) It may merge before the tag.

5. The update of the installed mod. I have no command to run.
   - The Guardian is installed by reference: the engine runs it from the main checkout's folder. So the custodian's fast-forward of the main checkout to the merge commit is itself the update. Every session that loads the mod from there takes the new version at its next start. No install, update or marketplace command is needed. The N1 form records the same.
   - The evidence: the plugin records name the marketplace spatial-ide-mods as a directory source at the main checkout's tools/mods. The plugin cache still holds v0's register.js, yet the refusal log has refusals under G7, G8 and G9 from 2026-10-14 onward, and those rules came with v1.
   - By the install record the mod is installed at local scope for the project folder C:\dev\spatial-ide, so it loads in sessions started in that folder. The record does not show whether a session started elsewhere loads it.
   - Not verified: which bytes the engine runs at 2.1.330. The log evidence comes from earlier builds.
   - The steps after the merge:
     - (i) The custodian fast-forwards the main checkout to the merge commit and reports it at a clean stop. The custodian never reloads.
     - (ii) I restart the custodian's session: a restart, not /reload-plugins, as for PR 183. That restart is my only step.
     - (iii) If I wish, in my own terminal: `claude plugin list`, to read the `Read from` line for spatial-guardian.

6. The live checks, after the approval, the merge, the update and the restart: exactly two, in the custodian's session.
   - (a) A Monitor call whose command is `git push --force --dry-run origin HEAD:refs/heads/guardian-monitor-probe`.
     - Predicted: refused by Guardian G1, with G1's reason. The refusal log gains one file: rule G1, tool Monitor, agent main, and a target sha256 equal to the command's, recomputed by script from the transcript.
     - If Git, the harness's permission layer or any layer other than the Guardian refuses first, the check is inconclusive, and that layer is not loosened.
   - (b) A Monitor call whose command is `echo guardian-monitor-probe`. Predicted: it runs, and its line arrives as an event. No log file is written.
   - No real force-push, merge or clean.

7. Until this is live, nobody runs a push, a merge or a delete through Monitor. That holds from the filing of my message of 2026-11-22, for every session, the advisor's included.

8. The report: every tool of the installed version, 2.1.330, that can run a command or write a file, as the custodian's session lists its tools on 2026-11-22. The marks come from each tool's definition and from the Guardian's registrations; no tool was tried. This piece changes Monitor only. Anything else here comes to me as a separate proposal.
   - Checked: Bash (G1, G7, G8, G9). PowerShell (G6 for a subagent; G1, G7, G8, G9). Write, Edit and NotebookEdit (G6 for a subagent; placement; G2, G4, G8, G3).
   - Not checked:
     - Monitor: its command runs in the Bash tool's shell. This piece.
     - Artifact: its publish action, when given edits, changes the local file it publishes (by the tool's definition in the advisor's session). Its read action saves files locally; outside the scratch folder it asks first.
     - EnterWorktree: creates a worktree and a branch.
     - ExitWorktree: its remove action deletes a worktree and its branch.
     - The Agent tool's worktree isolation: it creates a worktree. Its remote isolation, where it is offered, runs the agent in a cloud environment, where the Guardian is not installed (by the tool's definition in the advisor's session).
     - RemoteTrigger: creates or runs a cloud routine, whose commands run where the Guardian is not installed.
     - CronCreate and ScheduleWakeup: they queue a prompt for later. They run no command themselves, and the later calls pass the hooks.
     - TaskStop: ends a running task. It runs no command and writes no file, and is listed because it ends processes.
     - The browser extension's javascript_tool: runs code in a browser page, not in a shell on the machine.
   - Not verified:
     - whether a subagent's calls still carry the agent id at 2.1.330. They did at 2.1.289 (the Guardian v0 form's live check E5), and then the same hooks check them;
     - whether the Workflow tool's agents pass the hooks;
     - whether a Skill run in a subagent passes them;
     - whether the web-fetch agent's WebFetch, the Gmail attachment, Claude Docs export and Google Drive download tools, and the browser extension's gif_creator write local files. WebFetch states that it saves binary responses in the session's tool-results folder;
     - a tool named advisor in the session's request, with no description.
   - The remaining tools read only, or write only to remote services: Read, Glob, Grep, LSP, ToolSearch, SendMessage, ListAgents, ReadNotifications, FetchInboxMessage, SendUserFile, PushNotification, SendToProject, ArtifactComments, ArtifactData, DesignSync, the Google and Claude Docs connectors' write tools, and the browser extension's other tools.
