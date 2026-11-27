# The advisor's draft ADV-2026-11-27-39, for the human's approval, not the human's words and not in force: the recovery offer's three commands that the page can call (list_recoverable, recover_session, discard_recoverable), on the condition that nothing else of the security posture changes

*Filed by the custodian AS A DRAFT, as ADV-2026-11-26-22 item 1 orders (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-22-what-goes-to-the-human-is-one-draft-draft-d-taken-as-standing-rules-the-sittings-checkout-a-worktree-on-d.md`), and as ADV-2026-11-27-38 item 1 places it. It is written in the human's voice for their approval. It is not their words, it is not approved, and nothing in it is acted on until the human approves it in the custodian's session. Until then the recovery offer does not merge (ADV-2026-11-27-38 item 1). Source: PASTES/ADV-2026-11-27-39.md in the advisory folder, 1905 bytes, sha256 32e3d0311b7ae69e91e03b91a4a770024b845e8530d7f2b69d6a3147bd5817b4, last modified at 2026-11-27T22:38:37Z by the file system. It was named by a session message received before 2026-11-27T22:40:42Z (date -u, taken after it was copied):

Draft for Chris's approval.

To the custodian, 2026-11-27.

The recovery offer (`b2-piece-1c-step-3-recovery-offer`) adds three commands that the app's page can call: `list_recoverable`, `recover_session` and `discard_recoverable`. The architect could not say that this leaves the security posture unchanged, so it comes to me (ADV-2026-11-26-18).

1. **I accept the three commands as the piece's form has them.** What I accept with them:
   - The page can list the sessions that earlier runs left on this machine. For each it gets the record's name, the data file's name without its path, the time of the last step, the number of steps, and the state of its data: unchanged, changed or not found.
   - The page can recover one. For a session that was never saved, that opens the data file the record names. It returns the last recorded filter and style values.
   - The page can discard one. That removes the record's files from this machine's session store. It is the first command that removes a record another run left. It removes no data file and no project file.

2. **What I know when I accept it.** In the app, the list is read when the app starts and after a project opens, and only a click on Recover or Discard does the other two. Nothing but the app's own list of commands stands between a script that reaches the page and the three. The same is already true of the commands the page has: it can open any file it names, and a save replaces a project file.

3. **Condition.** Nothing else of the security posture changes with the piece: no network access, no listening socket, no change to how the data plane admits a consumer, no file under `capabilities/`, no dependency. Both gates of each part say so in so many words. If one cannot, the piece comes back to me.

4. This is my word on these three commands only. The wider question in ADV-2026-11-26-21, item 4, stays as that draft puts it.
