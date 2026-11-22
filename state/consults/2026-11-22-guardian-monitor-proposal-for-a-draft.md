# The custodian's proposal for a draft: the Guardian checks a Monitor command as it checks a Bash command (the human's message of 2026-11-22, item 2 (b))

*The custodian's proposal for a draft under the grant's item 4 (c). It is not the human's words and carries no id. The advisor checks each clause against the code and the records below, and issues it under an id (ADV-2026-11-22-01, item 1). It becomes the human's words only when the human types "approved" and that id. Filed by the custodian on 2026-11-22.*

---

## The proposed draft

To the custodian, 2026-11-22. The Guardian checks a Monitor command as it checks a Bash command.

1. The change. In tools/mods/spatial-guardian, on its own branch:
   (a) one registration for the tool Monitor, with the shell decision Bash has today: G1, G7, G8 and G9, in that order. G6 is not added: in the shell decision it applies to PowerShell alone, and Bash has none.
   (b) the refusal log's target map gains Monitor, with the call's command as its target.
   (c) a Monitor call with no command, a ws watch, is allowed, as today.
   (d) the README's limits, shell-route and files lines and the plugin tests are changed to match.
   Nothing else: no other tool, rule, reason text or log field.

2. Where. On the branch cut/guardian-monitor, in its own worktree, the way v1 was changed on cut/guardian-v1. Never in the main checkout's folder, which is the installed copy (item 5). If a standing rule or the Guardian refuses that work, the custodian stops and sends me the change as a patch file, which I apply myself.

3. Tests during development, through the registered handler. The worker runs `claude plugin test tools/mods/spatial-guardian`, the engine's own dispatch. The worker may also run `claude --version` and `claude plugin validate`, as the N1 form allowed, and no other `claude` command.
   (a) First the worker establishes what a Monitor call's event looks like on the installed build: the engine-written types, and validate's hook line. The fixtures are built from that, not from an assumed shape.
   (b) Inert fixtures for G1 (force-push), G7 (merge), G8 (a plugin install) and G9 (a target clean).
   (c) A harmless command and a commandless ws watch, both allowed.
   (d) Each test asserts whether execution continued, and what the refusal log recorded: rule, tool Monitor, agent, and the target's sha256. An allowed call writes no log line.
   (e) Each new test fails under a declared mutation: the registration removed; Monitor dropped from the target map.

4. Approval, class and merge.
   (a) My approval of this draft, by its id, is the typed approval naming the piece's live checks that the grant's item 5 (e) asks for. The live checks are the two of item 6 and no others.
   (b) The class is the advisor's: a full form with both gates, on the piece's own branch (ADV-2026-11-22-01, item 5).
   (c) It may merge before the tag (my message of 2026-11-22, item 0).

5. The update of the installed mod. The Guardian is installed by reference, so no install, update or marketplace command is needed.
   - The custodian's fast-forward of the main checkout to the merge commit is itself the update. The engine runs the mod from the main checkout's folder, so every session that loads the mod from there takes the new version at its next start.
   - By the install record the mod is installed at local scope for the project folder C:\dev\spatial-ide, so it loads in sessions started in that folder. The record does not show whether a session started elsewhere loads it.
   - The evidence that the engine runs the main checkout's folder:
     - the plugin records name the marketplace spatial-ide-mods as a directory source at the main checkout's tools/mods;
     - the plugin cache still holds v0's register.js (20318 bytes), yet the refusal log has refusals under G7, G8 and G9 from 2026-10-14 onward. Only v1, merged 2026-10-12, has those rules;
     - the N1 form records the same: no install or uninstall is needed.
   - The steps after the merge:
     - (i) the custodian fast-forwards the main checkout to the merge commit and reports it at a clean stop. The custodian never reloads.
     - (ii) I restart the custodian's session: a restart, not /reload-plugins, as for PR 183 on 2026-10-06. That restart is the only step I must take.
     - (iii) Optional, in my own terminal: `claude plugin list`, to read the Read-from line for spatial-guardian.
   - Not verified: which bytes the engine runs at 2.1.330. The log evidence comes from earlier builds.

6. The live checks, after the approval, the merge, the update and the restart: exactly two, in the custodian's session.
   - (a) A Monitor call whose command is `git push --force --dry-run origin HEAD:refs/heads/guardian-monitor-probe`.
     - Predicted: refused by Guardian G1, with G1's reason. The refusal log gains one file: rule G1, tool Monitor, agent main, and a target sha256 equal to the command's, recomputed by script from the transcript.
     - If Git, the harness's permission layer or any layer other than the Guardian refuses first, the check is inconclusive, and that layer is not loosened.
   - (b) A Monitor call whose command is `echo guardian-monitor-probe`. Predicted: it runs, and its line arrives as an event. No log file is written.
   - No real force-push, merge or clean.

7. Until this is live, nobody runs a push, a merge or a delete through Monitor. That holds from the filing of my message of 2026-11-22, for every session, the advisor's included.

8. The report: every tool of the installed version, 2.1.330, that can run a command or write a file, as the custodian's session lists its tools on 2026-11-22. This piece changes Monitor only. Anything else here comes to me as a separate proposal.
   - Checked: Bash (G1, G7, G8, G9). PowerShell (G6 for a subagent; G1, G7, G8, G9). Write, Edit and NotebookEdit (G6 for a subagent; placement; G2, G4, G8, G3).
   - Not checked:
     - Monitor: its command runs in the Bash tool's shell. This piece.
     - EnterWorktree: creates a worktree and a branch.
     - ExitWorktree: its remove action deletes a worktree and its branch.
     - Artifact: its read action saves files locally; outside the scratch folder it asks first.
     - The Agent tool's worktree isolation: it creates a worktree.
     - RemoteTrigger: creates or runs a cloud routine, whose commands run where the Guardian is not installed.
     - CronCreate and ScheduleWakeup: they queue a prompt for later. They run no command themselves, and later calls pass the hooks.
     - TaskStop: ends a running task. It runs no command and writes no file, and is listed because it ends processes.
     - The browser extension's javascript_tool: runs code in a browser page, not in a shell on the machine.
   - Not verified:
     - whether a subagent's calls still carry the agent id at 2.1.330. They did at 2.1.289 (the Guardian v0 form's live check E5), and then the same hooks check them.
     - whether the Workflow tool's agents pass the hooks;
     - whether a Skill run in a subagent passes them;
     - whether the web-fetch agent's WebFetch and the Gmail attachment, Claude Docs export and Google Drive download tools write local files. WebFetch states it saves binary responses in the session's tool-results folder.
     - a tool named advisor in the session's request, with no description.
   - The remaining tools read only or write only to remote services: Read, Glob, Grep, LSP, ToolSearch, SendMessage, ListAgents, ReadNotifications, FetchInboxMessage, SendUserFile, PushNotification, SendToProject, ArtifactComments, ArtifactData, DesignSync, the Google and Claude Docs connectors' write tools, and the browser extension's other tools.

---

## What it rests on

### R1. The Monitor call's shape on the installed version

- **The source.** The custodian's session transcript holds a record of type api-request-shape: the tool definitions the session sent to the API. The one read is of 2026-11-22T03:22:24.831Z, version 2.1.330, with 43 tool definitions. A script read it.
- **Monitor's input.** Monitor's input schema has four properties: description, timeout_ms, command and ws. description and timeout_ms are required. Monitor's description has sha256 31a6ae5c25ee26580f708270073adacd5b19f96b1d9dc377ad1fb866aec384da. The script found three phrases, byte for byte:
  - in the description, "The script runs in the same shell environment as Bash.";
  - in the ws property, "Cannot be combined with command.";
  - in the command property, "Shell command or script. Each stdout line is an event; exit ends the watch."
- **Not established.** This is the call's input as the model sees it. It is not the event the mod engine hands to a registered tool.call handler.
  - The Guardian's handlers read e.tool, e.command, e.agentId, e.file_path and e.notebook_path (decideShell, decideWrite and logRefusal in tools/mods/spatial-guardian/hooks/register.js at 297ed3a0, sha256 c67126eb6c83e7b23185e2889f46c34554aa0d3af7dc2782634313b3968207e8).
  - Whether a Monitor event carries its command as e.command was not read:
    - the mod's .gitignore names .claude-plugin/types/, the folder for the engine's types, and no such folder exists in the main checkout's copy or in the plugin cache;
    - the custodian runs no claude command.
  - The draft's item 3 (a) makes the event's shape the worker's first step, before any fixture.

### R2. How each mark of item 8 was reached

- **The list of tools.**
  - The tools of the installed version are the custodian's session's tools on 2026-11-22: the 43 definitions of the request record of R1, plus the names the session lists as available without a loaded definition (ArtifactComments, ArtifactData, CronDelete, CronList, EndConversation, EnterPlanMode, ExitPlanMode, ListMcpResourcesTool, ReadMcpResourceDirTool, SendToProjectContext and the connectors' tools).
  - Those without a definition were placed by their names and the session's listing alone. None of them is marked checked or not checked on its own definition.
- **Checked.**
  - The five tool.call registrations in register's body at 297ed3a0, one each for Bash, PowerShell, Write, Edit and NotebookEdit.
  - The rules for each are from decideShell and decideWrite and their comments in the same file:
    - the shell decision: G6 when the call is a PowerShell call of a subagent, then G1, G7, G8 and G9, G7 and G9 only in this repository;
    - the write decision: G6 for a subagent, placement, then G2, G4, G8 and G3.
- **Not checked.**
  - A script counted the tool's name in register.js at 297ed3a0 for Monitor, EnterWorktree, ExitWorktree, Artifact, Agent, RemoteTrigger, CronCreate, ScheduleWakeup, TaskStop, javascript_tool, Workflow, Skill, SendToProject and the three connector downloads: 0 each.
  - What each can do is from its definition in the request record of R1. The script found each phrase byte for byte:

    | Tool | Phrase found |
    |---|---|
    | EnterWorktree | "creates a new git worktree inside" |
    | ExitWorktree | "delete the worktree directory, and its branch too" |
    | Agent | "gives the agent its own git worktree" |
    | Artifact | "saving it outside that default folder asks the person first" |
    | RemoteTrigger | "create: POST /v1/code/triggers" |
    | CronCreate | "Schedule a prompt to be enqueued at a future time." |
    | ScheduleWakeup | "Schedule when to resume work" |
    | TaskStop | "Stops a running background task by its ID" |
    | javascript_tool | "Execute JavaScript code in the context of the current page." |

- **Not verified.** Each is marked so because no record of this version settles it.
  - The agent id: the only evidence is the Guardian v0 form's live check E5, at 2.1.289 (governance/forms/tools/GUARDIAN-V0-PREREGISTRATION.md).
  - Workflow and Skill: their definitions say they orchestrate or run work. No call of either by a subagent at 2.1.330 was read.
  - The downloads:
    - the Gmail attachment tool's definition says it gets a file "to read or save it";
    - the Claude Docs export returns a tab inline as base64;
    - the Drive download returns the content as a base64 encoded string.
    Whether any of them writes a local file was not observed.
  - advisor: the request record has a tool of that name with an empty description.
- **Read only or remote.** By each tool's definition in the same record or, for those without one, by its name. No call of theirs runs a shell or writes a local file on the evidence read.

### R3. The install by reference

- **The install record.** It names spatial-guardian@spatial-ide-mods with these fields:
  - scope local, for the project path C:\dev\spatial-ide;
  - installPath the plugin cache's spatial-ide-mods\spatial-guardian\unknown, version unknown;
  - installedAt and lastUpdated 2026-10-06T16:15:33.300Z.
- **The marketplace record.** It names spatial-ide-mods with source directory C:\dev\spatial-ide\tools\mods, and that as its install location, last updated 2026-10-04T11:28:23.979Z.
- **The cache and the checkout differ.**
  - The cache's hooks/register.js is 20318 bytes, sha256 prefix df8d9a6dfc9b, and names none of G7, G8 and G9.
  - The main checkout's is 50607 bytes, sha256 prefix c67126eb6c83, the bytes at 297ed3a0.
- **The refusal log** (C:/dev/spatial-ide-local/guardian), tabulated by script on 2026-11-22, by rule and tool:

  | Rule and tool | Files | First dated folder |
  |---|---|---|
  | G7 Bash | 4 | 2026-10-14 |
  | G8 Bash | 2 | 2026-10-14 |
  | G9 Bash | 2 | 2026-10-14 |
  | G3 Edit | 5 | 2026-10-14 |
  | G8 Edit | 3 | 2026-10-14 |
  | unplaceable Write | 12 | 2026-10-19 |
  | G1 Bash | 4 | 2026-10-23 |

  No file has the tool Monitor.
