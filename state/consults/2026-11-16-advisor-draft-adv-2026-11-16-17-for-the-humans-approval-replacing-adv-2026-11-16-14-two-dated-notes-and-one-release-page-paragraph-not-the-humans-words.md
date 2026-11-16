# The advisor's draft ADV-2026-11-16-17, for the human's approval, replacing its withdrawn draft ADV-2026-11-16-14: two dated notes in KNOWN-LIMITATIONS.md's v0.1.0 list and one paragraph on the v0.1.0 release page. Not the human's words and not a ruling: releases, release notes and release pages stay the human's (the grant's item 4 (a)), so nothing in it is acted on until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-16: the advisor's PASTES file, received 2026-11-16T06:32:55Z, read 2026-11-16T06:33:32Z, 3071 bytes, sha256 9dbf7e727b012260154b9a389d6c2f063136446b16df7bbadfd65efe3db71c1b. Its item 4's clause check is with the reviewer, read only.*

---

Draft for Chris's approval.

Id: ADV-2026-11-16-17. It replaces the draft ADV-2026-11-16-14, which is withdrawn.

To the custodian, 2026-11-16. v0.1.0's records, after the two silent cases found on 2026-11-16.

1. The tag v0.1.0 and its message stay as they are. No released sentence is edited or removed.

2. `KNOWN-LIMITATIONS.md` on main gains two dated notes in its v0.1.0 list, in the form of the corrections of 2026-10-10 and 2026-11-06, each followed by a comment that says the words are mine, approved here. The first goes under the paragraph that begins "Under a row filter at wide zooms":

```
*Corrected 2026-11-16: this paragraph says the status then reports those areas as not loaded. That is not always so in v0.1.0. In some cases, for example when the refused area is the last thing still loading, the status does not change: it stays empty, or keeps the sentence it showed for the view before, and Cancel can stay up in the filter panel. When the view is over its render budget, the status names the render budget instead.*
```

The second goes at the end of the v0.1.0 list:

```
*Found 2026-11-16, true of v0.1.0: when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, nothing from that request is drawn and nothing on screen says it failed. After an open the map stays empty, and panning or zooming loads nothing. After a filter the map is cleared, and the filter panel can still show the filter as applied. To ask again, apply or clear the filter again, or open the file again. Found by reading v0.1.0's code; not reproduced in the v0.1.0 installer.*
```

3. The v0.1.0 release page gains one paragraph, placed after the paragraph that begins "Corrections after release, 2026-10-12." and before the rule that follows it:

```
Corrections after release, 2026-11-16. [KNOWN-LIMITATIONS](https://github.com/christopherdonini/spatial-ide/blob/main/KNOWN-LIMITATIONS.md) on main now states two more things this version's notes did not: the status does not always report a refused area of the map as not loaded; and a first request for data that fails before any data arrives leaves the map empty or cleared, with nothing on screen saying that it failed. Both apply to this version. If the map is empty or has gaps and nothing says why, try a pan or a zoom in, applying the filter again, or opening the file again.
```

4. Before anything is posted, the reviewer checks each clause of the three texts against the code at the tag, reading only. If a clause fails, nothing is posted and it comes back to the advisor and to me.

5. The order. First the file on main, by a docs piece of its own with the short form and the reviewer, which the advisor merges; nothing else in the file changes. Then the page: you put the paragraph in at that place, once, changing no other byte of the page's text, and read the page back. If your Guardian refuses, stop and tell the advisor; I then do it myself.

6. v0.2's notes say of each case whether v0.2 fixes it. Those notes stay mine.

*Replaced, 2026-11-16: the advisor withdrew this draft by its message received 2026-11-16T06:54:02Z, after the reviewer's clause check, and its draft ADV-2026-11-16-19 replaces it (`state/consults/2026-11-16-advisor-draft-adv-2026-11-16-19-for-the-humans-approval-replacing-adv-2026-11-16-17-two-dated-notes-and-one-release-page-paragraph-not-the-humans-words.md`). Nothing above is edited.*
