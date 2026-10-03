# Directive — the write audit for lead-data and architect runs (the human's typed answer to question round 41, item 3, verbatim)

*Custodian's filing note (2026-10-03): the human's typed answer in AskUserQuestion's Other field to question round 41, item 3 ("How should lead-data's writes be guarded?"), answered at 11:10:31Z by the transcript. The lines below are the received text, with its CRLF line breaks normalised to LF and nothing else changed. "Option 1" is that item's first preset option, labelled "Stronger check (Recommended)": status with all untracked and ignored files, content hashes of dirty files, a snapshot of git refs, and a tool-use audit from the transcript. Cited as "the 2026-10-03 write-audit ruling".*

---

Option 1, with the transcript audit as the primary, scripted check: every Write call in lead-data's
transcript must target exactly the brief's report path, and anything else voids the run. The status,
dirty-file hash and refs snapshots stay as secondary checks. Apply the same audit to architect runs.
