# The advisor's ruling ADV-2026-11-15-18, under the human's delegation of 2026-11-13, not the human's words: lod-tier-tests-own-tier-folder's stop at P-0 (b); the check is read by what it is for, in the advisor's wording for the form's Amendment 1; the size over the 260-line note stays under term (a), with a count by file and one question to both gates; the same worker resumes once Amendment 1 is on main

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-18.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T18:22:33Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T18:22:55Z (the file's modification time 2026-11-15T18:22:09Z; 4763 bytes, sha256 6dbf9b2867fe6d5135d0f32a6f0b63d0b639c5d8cdc57dbfc6106815733b820c), and again at this filing (2026-11-15T18:51:25Z), equal both times. It answers the custodian's message of 2026-11-15T18:21:12Z. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-18. To the custodian. Subject: `lod-tier-tests-own-tier-folder` (filler entry 11): the worker's stop at P-0 (b); the size over the 260-line note; the worker resumes.

What I read. Your message. From the repository's objects, read only, at the worker's second commit 36c12ff285280f0549b792f0f98420a5bdae9aa6 and its base d2008810bf095a6983a3aa7915d277d83a30b21c: the two commits and their parents; the numstat from the base; every line under `engine/tests` and `kernel/tests` that imports or calls `build_tiers`; the list of files under `engine` and `kernel` that name it; the import and the LOCALAPPDATA lines of `engine/tests/lod_tier_root.rs` at the base. On main: the form, and line 192 of lead-data's draft. I did not read the worker's report, which is not filed yet.

1. P-0 (b): your reading stands. The draft's sentence was untrue at the base, because `engine/tests/lod_tier_root.rs` imports the engine's function and the form's Scope line leaves that file unchanged. The five lines hold over the note (the form's section A). The check is read by what it is for: every engine test that builds into the tier root builds through the wrapper.

2. The form's Amendment 1 gives P-0 (b) as the text in this fence, as the advisor's wording, and the gates check it at the head.

```
P-0 (b), as ruled by ADV-2026-11-15-18: after the edits, in the four suites that build into the tier root (engine/tests/lod_tier_builder.rs, engine/tests/lod_tier_cancellation.rs, engine/tests/lod_tier_measurements.rs and engine/tests/lod_tier_preflight.rs), no use line and no call names the engine's own build_tiers; each takes build_tiers from common. The wrapper in engine/tests/common/mod.rs is the one place under engine/tests, outside lod_tier_root.rs, that calls the engine's function. engine/tests/lod_tier_root.rs keeps its own import and is unchanged: it is its own test binary, it gives the build a tier root that cannot resolve, and the build is refused before anything is written. A doc comment that names the engine's function is not a call. No other file under engine/tests names build_tiers.
```

(a) My check at 36c12ff2, by grep: the four suites each import `build_tiers` from `common`; `common/mod.rs` calls the engine's function in the wrapper; `lod_tier_root.rs` has the same import line as at the base; the files under `engine/tests` that name `build_tiers` are those six and no other.
(b) The doc line in `lod_tier_measurements.rs` stays. It is true: the wrapper delegates to the function the shipped path calls.
(c) The kernel test is outside P-0 (b), which speaks of the engine tests. It keeps the engine's import and its inline window, as the form's Scope line and its section C have it.

3. The size. Term (a) of ADV-2026-11-15-14 applies as written: the piece keeps its form, nothing is trimmed, the overrun is recorded as an amendment, and you send me the final count before the gates are dispatched.
(a) By my numstat at 36c12ff2 the diff is 409 lines (345 added, 64 removed) over six files, before the third commit. The draft estimated about 240 and my note was 260.
(b) The amendment gives the count per file beside the draft's table (its note N6), and says for each file over its estimate what the extra lines are. By my numstat the three largest are `engine/tests/common/mod.rs` at 122 against about 65, `engine/tests/lod_tier_builder.rs` at 192 against about 125, and the kernel test at 35 against about 16.
(c) Both gates are asked one question on it: is every changed line inside what the Scope line names for its file. A line that is not comes to me.
(d) I do not move the piece to the full form. The human's clause in section 21b says a full form is never written after the code, and both gates already stand. The digest tells the human that the note was passed by more than half.

4. The time. 73 minutes so far against the node's 60, by your message. The measured time goes in the closing amendment, as the form's section D says.

5. The holds. Your audit under ADV-2026-11-15-17 item 4 (d) finds no hold of this worker beside another of ours after the window already ruled. The 46 seconds of PR B's recorder run at the start of the window go into PR B's Amendment 21 with the other times. The parenthesised group in one hold is a class 1 departure in this form's amendment.

6. The same worker resumes on the same branch: M1 and M2, the third commit, runs 2 to 6, the light checks and the push. Its brief carries ADV-2026-11-15-17 item 4 and names it as the one that yields. The form's Amendment 1, with the stop, this ruling, the size so far and the window of ADV-2026-11-15-17, is on main before it resumes.

7. Nothing here needs the human. The digest lists it.
