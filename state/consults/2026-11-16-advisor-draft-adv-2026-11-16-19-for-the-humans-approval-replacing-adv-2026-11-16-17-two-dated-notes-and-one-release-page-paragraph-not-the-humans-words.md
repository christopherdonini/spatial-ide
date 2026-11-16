# The advisor's draft ADV-2026-11-16-19, for the human's approval, replacing its withdrawn draft ADV-2026-11-16-17 after the reviewer's clause check: two dated notes in KNOWN-LIMITATIONS.md's v0.1.0 list and one paragraph on the v0.1.0 release page. Not the human's words and not a ruling: releases, release notes and release pages stay the human's (the grant's item 4 (a)), so nothing in it is acted on until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-16: the advisor's PASTES file, received 2026-11-16T06:54:02Z, read 2026-11-16T06:54:38Z, 3312 bytes, sha256 e5a60815a04bc44784dd296be313e26d58d66905102dced3d6838ab1a9742cac. Its changed sentences' clause check is with the reviewer, read only.*

---

Draft for Chris's approval.

Id: ADV-2026-11-16-19. It replaces the draft ADV-2026-11-16-17, which is withdrawn, as ADV-2026-11-16-14 was.

To the custodian, 2026-11-16. v0.1.0's records, after the two silent cases found on 2026-11-16.

1. The tag v0.1.0 and its message stay as they are. No released sentence is edited or removed.

2. `KNOWN-LIMITATIONS.md` on main gains two dated notes in its v0.1.0 list, in the form of the corrections of 2026-10-10 and 2026-11-06, each followed by a comment that says the words are mine, approved here. The first goes directly after the text of the paragraph that begins "Under a row filter at wide zooms" and before that paragraph's source comment, where the earlier corrections sit:

```
*Corrected 2026-11-16: this paragraph says the status then reports those areas as not loaded. That is not always so in v0.1.0. In some cases, for example when the refused area is the last thing still loading, the status does not change: it stays empty, or keeps the sentence it showed for the view before, and Cancel can stay up in the filter panel. When the view is over its render budget, the status names the render budget instead.*
```

The second goes at the end of the v0.1.0 list:

```
*Found 2026-11-16, true of v0.1.0: when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, nothing from that request is drawn and nothing on screen says it failed. After an open the map stays empty, and panning or zooming loads nothing. After a filter the map is cleared, and the filter panel can still show the filter as applied. To ask again, repeat the step: open the file again, or apply or clear the filter again. Found by reading v0.1.0's code; not reproduced in the v0.1.0 installer.*
```

3. The v0.1.0 release page gains one paragraph, placed after the paragraph that begins "Corrections after release, 2026-10-12." and before the rule that follows it:

```
Corrections after release, 2026-11-16. [KNOWN-LIMITATIONS](https://github.com/christopherdonini/spatial-ide/blob/main/KNOWN-LIMITATIONS.md) on main now states two more things this version's notes did not: the status does not always report a refused area of the map as not loaded; and when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, the map is left empty or cleared, with nothing on screen saying that it failed. Both apply to this version. If the map is empty or has gaps and nothing says why, try a pan or a zoom in, applying the filter again, or opening the file again.
```

4. Before anything is posted, the reviewer checks each clause of the three texts against the code at the tag, reading only. If a clause fails, nothing is posted and it comes back to the advisor and to me.

5. The order. First the file on main, by a docs piece of its own with the short form and the reviewer, which the advisor merges; nothing else in the file changes. Only after that merge the page: you put the paragraph in at that place, once, changing no other byte of the page's text, and read the page back. If your Guardian refuses, stop and tell the advisor; I then do it myself.

6. v0.2's notes say of each case whether v0.2 fixes it. Those notes stay mine.

*Approved, 2026-11-16: the human's typed message of 07:53Z approves this draft by its id (`state/directives/2026-11-16-the-humans-message-five-drafts-approved-v0-1-0-records-what-v0-2-waits-for-the-machine-queue-the-alarm-timer-the-limits-of-the-advisors-merges.md`); from then its text is the human's words. Nothing above is edited.*
