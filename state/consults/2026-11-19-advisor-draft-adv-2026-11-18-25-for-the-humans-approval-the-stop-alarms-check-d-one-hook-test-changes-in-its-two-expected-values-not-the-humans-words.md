# The advisor's draft ADV-2026-11-18-25, for the human's approval: the stop alarm's check (d) changed, the one hook test that pins the settings file changing in its two expected values only. Not the human's words and not a ruling: a hook in the settings file is the human's (the grant's item 4 (c)), so nothing in it is acted on or built until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-19: PASTES/ADV-2026-11-18-25.md in the advisory folder, 1049 bytes, sha256 2e7b332e0ab2e012ecf4c49d961fccfa011f724f512e3a81ce8320b889301f21, last modified at 2026-11-18T23:31:44Z by the file system; the advisor's message naming it received at 2026-11-18T23:31:52.875Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T02:18:49Z), equal. Filed with the next records commit, as ADV-2026-11-18-06 was. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-18.

My approval of ADV-2026-11-18-06 (the stop alarm) stands, with one change to its check (d).

One existing test pins the settings file: `the_notification_hook_matches_only_the_two_quota_types` in `scripts/hooks/hooks.test.mjs`. It expects the list of hooks to be exactly the four of today, and the Notification matcher to be the two quota types. Items 1 and 3 of my approval change both. So that test cannot pass unchanged, and check (d) as I approved it cannot be met.

1. Check (d) now reads: every other existing test of the hooks passes unchanged. That one test changes in its two expected values only: the list of hook keys gains `StopFailure`, and the matcher gains `quota_auto_resume_fired`. Its name stays, because an earlier form claims it by name, with one comment line above it saying so. Its other assertions do not change.

2. `scripts/hooks/hooks.test.mjs` joins the piece's files, for that change alone.

3. Nothing else in ADV-2026-11-18-06 changes. It still costs nothing.
