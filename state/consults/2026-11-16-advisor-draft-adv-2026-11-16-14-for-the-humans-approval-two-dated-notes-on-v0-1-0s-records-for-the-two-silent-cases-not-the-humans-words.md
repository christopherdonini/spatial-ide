# The advisor's draft ADV-2026-11-16-14, for the human's approval: two dated notes on v0.1.0's records, for the two silent cases found on 2026-11-16. Not the human's words and not a ruling: releases, release notes and release pages stay the human's (the grant's item 4 (a)), so nothing in it is acted on until the human types approved and its id in the custodian's session. The advisor's message of 2026-11-16 says a new draft will replace it once the reviewer's clause check is back, and that its item 5 cannot stand as written

*Filed byte for byte by the custodian, 2026-11-16: the advisor's PASTES file, received 2026-11-16T05:46:54Z, read 2026-11-16T05:47:09Z, 2050 bytes, sha256 932a38a19b17cb7f826962466392c0eef7f400a229a449e92e7a096d6a5e6ff3.*

---

Draft for Chris's approval.

Id: ADV-2026-11-16-14.

To the custodian, 2026-11-16. v0.1.0's records, after the two silent cases found on 2026-11-16.

1. The tag v0.1.0 and its message stay as they are. No released sentence is edited or removed.

2. Two dated notes are added, in the way the list was corrected on 2026-10-10 and 2026-11-06. The first goes under the paragraph of the v0.1.0 list that begins "Under a row filter at wide zooms":

```
*Corrected 2026-11-16: this paragraph says the status then reports those areas as not loaded. That is not always so, for v0.1.0 too: when the refused area is the last one still loading, no status is shown and Cancel stays up in the filter panel. Pan or zoom to ask for it again.*
```

The second goes at the end of the v0.1.0 list:

```
*Found 2026-11-16, true of v0.1.0 too: when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, the map stays empty and no message is shown. After an open, panning or zooming loads nothing; open the file again. After a filter, pan or zoom to load the view. No wrong data is drawn. This was found by reading v0.1.0's code and by a test of the current code; it was not reproduced in the v0.1.0 installer.*
```

3. Before either note is posted anywhere, the reviewer checks each clause of both against the code at the tag, reading only. If a clause fails, nothing is posted and it comes back to the advisor and to me.

4. In the repository: `KNOWN-LIMITATIONS.md` on main gains the two notes at those two places, by a docs piece of its own with the short form and the reviewer, which the advisor merges. Nothing else in the file changes.

5. On the v0.1.0 release page: you add, below the page's text and changing nothing above it, the line "Found after release, added 2026-11-16." and the two notes, once, and read the page back. If your Guardian refuses, stop and tell the advisor; I then do it myself.

6. v0.2's notes say of each case whether v0.2 fixes it. Those notes stay mine.
