# shell-migration-milestone-3 PR B: the custodian's e2e runs at 4b9f7c89 and, after step 9, at 95bd9747

*The custodian's record (2026-10-20), for the form's §9 suites and H3 (Amendment 3 item 12): every existing suite at PR B's build head, source-changed's post route, `e2e/command-bar.mjs` with PR B's seven new steps, and its eight mutations as the PR B worker wrote them down; then, after step 9, the suite and E-SEL's mutation again. Built by script from each run's artifacts (the suite log, the runner output, the app's stderr capture, and any report and session log), each copied whole into the custodian's scratch folder right after its run. Every quoted line is byte-copied whole, with CR removed.*

## Setup

- **Heads:** 4b9f7c890a6f5c0f36849861a9084e53e0ba2e24 (the build head, branch `cut/shell-migration-milestone-3-pr-b`, from the code base 19eacc52), then 95bd9747e9042982b4baab42cc20330f9652fc52 (step 9). Each series ran in the custodian's e2e checkout `C:/dev/wt/mm2b-e2e`, detached at its head, clean at the start and at the end.
- **The exe:** `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, built at be6aa6203a196f553ec08f697d678dfa08a78bd4. PR B changes no Rust; each series checked by git that no exe source differs between that commit and its head. The frontend is served by vite from the checkout, so the head's shell code, and each mutation, is what ran.
- **The holds:** one shared hold for each series. This project's lines of the machine script's output:

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:472 also=bash.exe:28688 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:472 affinity=FF (cores 0-7)
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:40620 also=bash.exe:26552 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:40620 affinity=FF (cores 0-7)
```

## The runs at 4b9f7c89

```text
label mm3b-pr-b head 4b9f7c890a6f5c0f36849861a9084e53e0ba2e24 exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f built at be6aa6203a196f553ec08f697d678dfa08a78bd4; no exe source differs; start 2026-10-20T12:28:59Z
recording: rc=0, 2026-10-20T12:28:59Z to 2026-10-20T12:29:21Z, fixtures unchanged 
export-view: rc=0, 2026-10-20T12:29:21Z to 2026-10-20T12:30:00Z, fixtures unchanged 
selection: rc=0, 2026-10-20T12:30:00Z to 2026-10-20T12:34:25Z, fixtures unchanged 
regression: rc=0, 2026-10-20T12:34:26Z to 2026-10-20T12:39:42Z, fixtures unchanged 
layout: rc=0, 2026-10-20T12:39:43Z to 2026-10-20T12:41:04Z, fixtures unchanged 
style: rc=0, 2026-10-20T12:41:04Z to 2026-10-20T12:41:29Z, fixtures unchanged 
console: rc=0, 2026-10-20T12:41:30Z to 2026-10-20T12:47:30Z, fixtures unchanged 
publish: rc=0, 2026-10-20T12:47:30Z to 2026-10-20T12:48:04Z, fixtures unchanged 
admission-remediation: rc=0, 2026-10-20T12:48:04Z to 2026-10-20T12:48:49Z, fixtures unchanged 
filter: rc=0, 2026-10-20T12:48:49Z to 2026-10-20T12:49:16Z, fixtures unchanged 
filter-panel: rc=0, 2026-10-20T12:49:16Z to 2026-10-20T12:50:02Z, fixtures unchanged 
refusal-contract-baseline: rc=0, 2026-10-20T12:50:02Z to 2026-10-20T12:50:57Z, fixtures unchanged 
residency-harness: rc=0, 2026-10-20T12:50:57Z to 2026-10-20T12:51:26Z, fixtures unchanged 
source-changed: rc=0, 2026-10-20T12:51:26Z to 2026-10-20T12:51:59Z, fixtures unchanged 
source-watch-idle: rc=0, 2026-10-20T12:51:59Z to 2026-10-20T12:52:28Z, fixtures unchanged 
pan-anchor: rc=0, 2026-10-20T12:52:28Z to 2026-10-20T12:55:25Z, fixtures unchanged 
source-changed-post: rc=1, 2026-10-20T12:55:25Z to 2026-10-20T12:56:01Z, fixtures unchanged 
command-bar: rc=1, 2026-10-20T12:56:01Z to 2026-10-20T12:57:38Z, fixtures unchanged 
mut-E-FIELD: rc=1, 2026-10-20T12:57:38Z to 2026-10-20T12:59:15Z, fixtures unchanged mutation=E-FIELD diff-lines=2 reverted-clean-at=4b9f7c89
mut-E-AND: rc=1, 2026-10-20T12:59:16Z to 2026-10-20T13:00:51Z, fixtures unchanged mutation=E-AND diff-lines=2 reverted-clean-at=4b9f7c89
mut-E-AND-b: rc=1, 2026-10-20T13:00:51Z to 2026-10-20T13:02:55Z, fixtures unchanged mutation=E-AND-b diff-lines=2 reverted-clean-at=4b9f7c89
mut-E-REFUSE: rc=1, 2026-10-20T13:02:55Z to 2026-10-20T13:04:29Z, fixtures unchanged mutation=E-REFUSE diff-lines=1 reverted-clean-at=4b9f7c89
mut-E-TOOLONG: rc=1, 2026-10-20T13:04:29Z to 2026-10-20T13:06:09Z, fixtures unchanged mutation=E-TOOLONG diff-lines=1 reverted-clean-at=4b9f7c89
mut-E-ADV: rc=1, 2026-10-20T13:06:09Z to 2026-10-20T13:07:45Z, fixtures unchanged mutation=E-ADV diff-lines=2 reverted-clean-at=4b9f7c89
mut-E-PANEL: rc=1, 2026-10-20T13:07:45Z to 2026-10-20T13:09:17Z, fixtures unchanged mutation=E-PANEL diff-lines=2 reverted-clean-at=4b9f7c89
mut-E-SEL: rc=1, 2026-10-20T13:09:17Z to 2026-10-20T13:10:52Z, fixtures unchanged mutation=E-SEL diff-lines=2 reverted-clean-at=4b9f7c89
checkout clean at end, 4b9f7c890a6f5c0f36849861a9084e53e0ba2e24
end 2026-10-20T13:10:52Z
```

## The runs at 95bd9747

```text
label mm3b-s9 head 95bd9747e9042982b4baab42cc20330f9652fc52 exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f built at be6aa6203a196f553ec08f697d678dfa08a78bd4; no exe source differs; start 2026-10-20T13:15:33Z
command-bar: rc=0, 2026-10-20T13:15:33Z to 2026-10-20T13:17:14Z, fixtures unchanged 
mut-E-SEL: rc=1, 2026-10-20T13:17:14Z to 2026-10-20T13:18:57Z, fixtures unchanged mutation=E-SEL diff-lines=2 reverted-clean-at=95bd9747
checkout clean at end, 95bd9747e9042982b4baab42cc20330f9652fc52
end 2026-10-20T13:18:58Z
```

## Against the form

- **H3 (every existing suite unchanged at the head):** held. Every existing suite passed; source-changed's post route failed on S5d alone, recorded beside the runs, neither I3 nor I12 (Amendment 3 item 12):

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":9,"mintRefused":["1792500949641 tile-stream-mint-refused 8:13: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792500949628 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **The new suite at 4b9f7c89** passed every step but E-SEL, which failed on its own setup: every hover at the camera it starts from answered below the pick resolution, so no point was found to click. The worker's report, item 9, named that risk. The failure is caused by PR B's own e2e change, so it is not I3. Under E-SEL's mutation the step failed the same way, so that mutation was not observed in this series.

```text
[hover-barrier] E-SEL: standing before {"state":"clear","text":null,"id":null,"marker":null}; found clear already; no id, last state {"state":"refusal","text":"Features here are below pick resolution — zoom in to inspect them.","id":null,"marker":null}
[hover-barrier] E-SEL: standing before {"state":"refusal","text":"Features here are below pick resolution — zoom in to inspect them.","id":null,"marker":null}; saw the change to clear; no id, last state {"state":"clear","text":null,"id":null,"marker":null}
OPEN          PASS    admitted; .working-canvas node stored for the identity checks
E-CTRLK       PASS    Ctrl+K focused the bar; /lay, Tab, Enter flipped Layers' hidden; one layout.toggleLayers row; the map node is unchanged
E-SEARCH      PASS    the plain text inspector listed its option on top of the map below the top bar, and ArrowDown then Enter flipped the Inspector; a label-only, upper-case text found Zoom to layer
E-HELP        PASS    ? listed all 12 registry entries, every word and every chord label
E-BARFOCUS    PASS    focus alone opened no list; Tab and Shift+Tab left the bar in one press; Escape closed the list, then returned the focus to the map region
E-REVEAL      PASS    /export opened the Inspector and its Layer tab, expanded Export and focused .publish-open; no approval prompt appeared
E-SLASH       PASS    / pressed from the map focused the bar with / in it; / typed in the Filter section's input stayed there
E-FIELD       PASS    /filter @zo listed the field names (1); Tab put "zone" in double-quoted and removed the @; the list closed
E-AND         PASS    A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, one more record_step row reached ok; B off: 4.4%, Applied A's text
E-REFUSE      PASS    skp.filter_unknown_column shown by name in the bar; the cards and .filter-active unchanged; the map within 2 points (4.4% -> 4.4%)
E-TOOLONG     PASS    card A (2098 bytes) admitted; card B refused skp.filter_too_long by name at 4209 combined bytes; A stays
E-ADV         PASS    an expression beside a card that is on: the shell's line in the bar, nothing sent; the cards and .filter-active unchanged
E-PANEL       PASS    with two cards, the panel's Apply left exactly one card holding its text; its Clear left none
E-SEL         FAIL    E-SEL: no point of the map answers the hover with a confirmed feature id
FIXTURES      PASS    filter-zoned.parquet sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 -> 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
```

- **Step 9** (95bd9747, `fix: shell-migration-milestone-3 PR B step 9`): `findFeaturePoint` zooms in one notch at a time, up to `lib.mjs`'s `MAX_ZOOM_NOTCHES`, until a hover confirms an id. At 95bd9747 the suite passed every step:

```text
OPEN          PASS    admitted; .working-canvas node stored for the identity checks
E-CTRLK       PASS    Ctrl+K focused the bar; /lay, Tab, Enter flipped Layers' hidden; one layout.toggleLayers row; the map node is unchanged
E-SEARCH      PASS    the plain text inspector listed its option on top of the map below the top bar, and ArrowDown then Enter flipped the Inspector; a label-only, upper-case text found Zoom to layer
E-HELP        PASS    ? listed all 12 registry entries, every word and every chord label
E-BARFOCUS    PASS    focus alone opened no list; Tab and Shift+Tab left the bar in one press; Escape closed the list, then returned the focus to the map region
E-REVEAL      PASS    /export opened the Inspector and its Layer tab, expanded Export and focused .publish-open; no approval prompt appeared
E-SLASH       PASS    / pressed from the map focused the bar with / in it; / typed in the Filter section's input stayed there
E-FIELD       PASS    /filter @zo listed the field names (1); Tab put "zone" in double-quoted and removed the @; the list closed
E-AND         PASS    A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, one more record_step row reached ok; B off: 4.4%, Applied A's text
E-REFUSE      PASS    skp.filter_unknown_column shown by name in the bar; the cards and .filter-active unchanged; the map within 2 points (4.4% -> 4.4%)
E-TOOLONG     PASS    card A (2098 bytes) admitted; card B refused skp.filter_too_long by name at 4209 combined bytes; A stays
E-ADV         PASS    an expression beside a card that is on: the shell's line in the bar, nothing sent; the cards and .filter-active unchanged
E-PANEL       PASS    with two cards, the panel's Apply left exactly one card holding its text; its Clear left none
E-SEL         PASS    one feature selected with a Select click; the card switched off; the count is still 1
FIXTURES      PASS    filter-zoned.parquet sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 -> 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
```

- **The eight e2e mutations** each failed by their named step and message, seven at 4b9f7c89 and E-SEL at 95bd9747. At 4b9f7c89 each run also shows the head's own E-SEL setup failure, above, which is left out of the lines below. E-AND-b fails E-AND's record_step check, as its row says. Under E-REFUSE's mutation the refused card stood, so E-TOOLONG, the next step, failed behind it.
- **Unknown attempts:** none in any run. The publish suite's only line naming one is its standing `EXPIRED'` skip.

## The mutation runs' failing lines

### E-FIELD, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-FIELD       FAIL    E-FIELD: /filter @zo then Tab left "/filter zone" in the bar, expected "/filter \"zone\""
```

### E-AND, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-AND         FAIL    E-AND: with A and B on the map is 13.30% non-background, expected it empty (at most 0.2%)
```

### E-AND-b, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-AND         FAIL    E-AND: after card B was added the console holds 1 record_step rows against 1 + 1, the last carrying the combined text: false
```

### E-REFUSE, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-REFUSE      FAIL    E-REFUSE: after the refusal the cards read {"texts":["\"zone\" = 'residential'","\"nope\" = 1"],"on":["true","true"],"applied":"Applied: (\"zone\" = 'residential') AND (\"nope\" = 1)","bar":"/filter \"nope\" = 1"}, expected one card "zone" = 'residential', Applied it, and the bar holding /filter "nope" = 1
E-TOOLONG     FAIL    E-TOOLONG: after the refusal the cards read 2 card(s) and Applied "Applied: (\"zone\" IN ('a0000', 'a0001', 'a0002', 'a0003', 'a0"; card A alone was expected
```

### E-TOOLONG, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-TOOLONG     FAIL    E-TOOLONG: card B (2102 bytes, 4209 combined) showed {"cleared":false,"code":null,"line":"[P6 placeholder] Not applied. Try again."}, expected the refusal code skp.filter_too_long
```

### E-ADV, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-ADV         FAIL    E-ADV: .filter-active changed: the cards read {"texts":["\"zone\" = 'residential'","\"zone\" = 'residential' OR \"zone\" IS NULL"],"on":["true","true"],"applied":"Applied: (\"zone\" = 'residential') AND (\"zone\" = 'residential' OR \"zone\" IS NULL)","bar":""}, expected card A alone and Applied it
```

### E-PANEL, applied alone at 4b9f7c89, reverted, the checkout clean

```text
E-PANEL       FAIL    E-PANEL: after the panel's Apply there are 3 cards ["\"zone\" = 'residential'","\"zone\" <> 'residential'","\"zone\" <> 'residential'"], expected exactly 1 holding "zone" <> 'residential'
```

### E-SEL, applied alone at 95bd9747, reverted, the checkout clean

```text
E-SEL         FAIL    E-SEL: after the card was switched off the selection count is 0, expected 1
```
