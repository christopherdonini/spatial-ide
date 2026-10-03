# Directive — the exit-drain ruling for publish-attempt-lifecycle-src-tauri (the human, verbatim)

*Custodian's filing note (2026-10-03): the human's typed answer to question round 40, item 1, a red line (user-visible behaviour), given in AskUserQuestion's Other field and answered at 06:07:32Z by the transcript. The lines below are the received text, with its CRLF line breaks normalised to LF and nothing else changed. Cited as "the 2026-10-03 exit-drain ruling".*

---

Approve the draft with a 30 s declared ceiling, on three conditions: (a) the form states the
behaviour on Windows, macOS and Linux (portability R3), including macOS's convention that closing the
last window does not quit; (b) at the ceiling, before exiting, the process records in the audit that
the publish's outcome is unknown, where it can, and the form says so where it cannot; (c) walkthrough
row R1 also relaunches the app immediately after the close, and checks that the two processes don't
conflict (data plane, audit log, staging directory).
