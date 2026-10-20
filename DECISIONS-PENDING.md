# Decisions pending the human

Line references written before the rotation point into state/cut-archive/DECISIONS-PENDING-2026-10-20.md at 71f5ebbbcb58e9b21e60de207b831e5581c81449.

## Pending

**RULED 2026-10-21 (headed; the third message, received 2026-10-20) — publish-approval-ttl-ten-minutes: OPEN-1 (A), the five-line form with the reviewer and the architect from dispatch, AUTONOMY §25 (e) set aside for this piece; OPEN-2, the human's words for ADR-024's appended note, dated the day the piece merges (the human, as pasted content in the human's own message, received at 18:27:47Z by the transcript; recorded verbatim at `state/directives/2026-10-20-ttl-open-1-a-five-line-form-both-gates-open-2-adr-024-note-words.md`, from line 6, sha256 bd5309138eb602d6426fdb85a1968b0c476ab822c8bfa3d45c4554ff4cd27ca0 over lines 6 to the end at the commit that adds it):**

- **The rulings** are the text, referenced and not restated.
- **Applied:** the piece's five-line form committed with its Amendment 1; the node ready, then its code by one worker; ADR-024's note appended by the custodian as the branch's last commit before the click, after the human's answer on one clause (the form's Amendment 1 item 3).

115. **[Recorded, with three items for your word — the drill's findings (PLAN node `drill-clean-clone`; PR #96, docs-only under delegation).]** A tester cloned main (14c8612) into a fresh directory on D:, regenerated `parcels-5gb.parquet` from `kernel/FIXTURES.md` (size and sha256 both matching the declared values, the hash recomputed independently), ran the workspace suite (rc 0, 647 passed / 0 failed / 38 ignored, 0 warnings), the ignored tier (the literal command stops at the first release-only guard; a labelled no-fail-fast pass recorded the named reasons), the shell build and test (70 files / 1024 tests green once the bundle-viewer is built first), the release build (rc 0, 0 warnings) and the Tauri NSIS build as the workflow runs it (rc 0; the installer's size and hash recorded). The section's own claim that no timing number appears in it was false against its text (quoted watchdog and npm lines; the unguarded test's elapsed clock) and is withdrawn by an appended correction, not edited; none of those numbers is a product measurement. Findings: (a) `kernel/FIXTURES.md`'s regenerate command races itself — the publish-half runs concurrently with the generate-half and fails on 'fixture absent' — and the generator's watchdog fires in a post-write phase after the file is complete; the fixture is correct despite both. Proposed: a small kernel-test piece (the two ignored tests serialised or the publish-half made to wait on the fixture; the watchdog's silence window scoped to the write phase), engine/kernel lane, reviewer-gated, five-line form. (b) `frontends/shell`'s bare `npm run build` fails standalone; the build order (the bundle-viewer first) lives only in the `pretest` script. Proposed: a one-line `prebuild` (or the build script itself) naming the order — polish lane, five-line form. (c) `npm ci` reports five known vulnerabilities in the shell's dependency tree (three moderate, one high, one critical) — recorded, not remediated. **For your word:** dependency changes are yours (P-011; the Red lines); PRECEDENTS.md P-033 lets the custodian merge a Dependabot patch-level bump when CI is green, and nothing more. If Dependabot has opened or opens patch-level PRs for these, the custodian merges them under P-033; anything minor or major, or any manual `npm audit fix`, waits for you. (d) `engine/tests/lod_tier_measurements.rs`'s `wall_time_arm_s_and_arm_p_over_polygons_100k` lacks the release-only guard its three siblings carry and ran without a verdict in a debug drill until the tester terminated it (recorded as inconclusive, not a pass or fail). Proposed: the one guard line, LOD lane (the LOD's own record names the measurement tests; a class-3 test-text row there). (e) The 5 GB rows refuse at this machine's C: disk floor (31.5 GB free against the 40 GiB floor); the drill ran on D: with over 360 GB free throughout — the floor finding of entry 111 stands. **For your word (2):** whether (a), (b) and (d) are dispatched as three five-line pieces this week or queued behind Brief A's close; the custodian's reading: (d) first (one line, it stops an unbounded test), then (a), then (b) — all three inside the short-form route. **For your word (3):** the drill's result section carries the installer's hash for v0.1.0's build at 14c8612 — whether that hash joins the evidence archive (`evidence-archive-v0-1-0`) or stays in RESULTS.md only.]** Filed 2026-09-19.

Archived copy: line 1965 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

111. **[FOR YOUR WORD — a P6 sight with no on-screen string; and the first results of the 2026-09-18 wave.** (1) **Three wire fields ship with no consumer.** The session-identity statement (`engine/src/identity.rs` → `kernel/src/skp.rs` → the wire → `frontends/shell/src/skp/types.ts`) and the two CRS provenance fields (`crs.provenance`, `crs.axis_provenance`) are read in the shell by tests only; no component renders them (the Part N worker's finding, confirmed by its reviewer tracing every reader). Brief A's P6 sight "open a keyless single file, read the session-identity statement" cannot be read at the sitting as the build stands; Part N's row N3 says so and discharges nothing. Your call, a red line either way: (a) a small shell piece renders the three fields in the describe summary before Part N runs (a preregistered sight; under ADMISSION's existing record or a five-line form), or (b) the sight is re-scoped. The round-8 pre-commitment exemption let the producer land ahead of a named, gated consumer; P6 is that gate and arrives with the consumer unbuilt — filed for the weekly proposal window as a finding, not a clause. (2) **P3b's six §5 test names.** Marking P3b done bound the §5 names T3–T7 and T9, which the tests carried under other titles; a short-form piece (`cut/briefa-p3b-test-names`, five lines committed before code) aligned the titles to §5 (13eca3c). The rename makes bare italic quotations of the old titles stale in both closed records (shell Amendment 15 rows 2a(ii), 2a(iii), 2a(v), 2b; the instrument-exemption row; engine Amendment 12 item (i) and the G-A2 paragraph) and one kernel doc-comment; its second round appends one class-3 erratum row per record under your round-14 exception (shell Amendment 17, engine Amendment 14 — the custodian had briefed P4 and P5 with colliding engine numbers, corrected to 15 and 16 by message), then the reviewer gate. P3b shows done in PLAN when it lands. (3) **ADR-029 G1** (`spike/adr-029-g1` @ 367d2dd): the vendored crate's C surface `duckdb_query_progress` yields a rows-processed reading, monotone non-decreasing over eighteen runs, reaching the fixture's row count; but `duckdb::Connection` exposes no handle to call it, so the probe drove the raw ffi via `duckdb_pending_execute_task`. Under a scoped reviewer for the verdict line: whether the engine can consume the reading through the crate as vendored, or what a raw ffi connection, a crate patch or an upstream feature would cost — the fact your ADR-029 word rests on. (4) **PR #88** (the handoff recorded once per part) is open for the click; the two Part 4 decisions are ruling nodes under "Waiting on the human" (proposed nodes are never queued). (5) **Part N** failed its first scoped read on three items (three rows promised a row count the session tier never shows; the canvas-clearing read had no row; two "quick"s), all six quoted strings byte-exact; one batched correction round with the same worker, then a second read. (6) **A custodian error, corrected:** a `git add -A` on the shared main checkout swept the G1 worker's stray `Cargo.toml` into 8b88c58; removed at 5632f94; the lesson in memory (stage explicit paths; check porcelain first).]** Filed 2026-09-18; the checker's final round, P4 and P5 still running. **Later the same day:** Part N passed its second read (gate-log 76) and is **PR #89** for the click — nine rows, plan about 30–35 minutes at the machine, one sight owed to your word; the test-names piece's second round appended shell Amendment 17 (sixteen rows) and engine §12e Amendment 14 (three rows), every pin recomputed, and found that the claim scanner has no notion of a superseded name: three historical mentions of T3's old title in append-only text would still turn red once P3b is marked done, so a short-form scanner piece (`governance-test-claims-superseded`: a claim is historical when the same file pins its line as superseded at a rev whose bytes hash true) is dispatched; the test-names branch is under its reviewer gate. **Findings filed from the gates of 2026-09-18 (evening), for the weekly proposal window (earliest 2026-09-25) and the next question round — nothing adopted:** (i) the *unmerged-append revert* — a defective record append on an unmerged branch corrected by a revert commit plus a re-append (never an amend or a rebase; the corrected amendment re-appended whole; append-only proved against the base), named sound by the test-names architect as an extension by analogy of round 15 (f), used twice today (the test-names erratum rows; the checker's Amendment 9); (ii) main's landed P3b erratum rows (shell Amendment 16, engine Amendment 13) declare a pin rule contradicting round 15 (e) and pin at 959bd088156b, a branch commit — a defect on main whose correction rounds are exhausted under the cap; (iii) `verify-cites` resolves `path:line @ rev sha256` pins against the current tree, the same pin-read-as-current class; (iv) the checker's grammar cannot write a reference into a leading-dot path (`.github/**`, `.claude/**`), so such fixes are recorded by path only; (v) ADR-029 G1: the reading exists and is fine-grained, but `duckdb::Connection` exposes no handle and the reading is per-connection, so the engine reaches it only by driving the scan through raw ffi, by a crate patch, or upstream — your ADR-029 word rests on that choice; with defaults there is no reading (the progress-bar pragma is the precondition), DuckDB latches only the percentage, and the count must be latched engine-side; (vi) three dispositions need your ruling, not a worker's: `HOVER-REPICK-PREREGISTRATION.md:53` (the quoted consult is now tracked; the quote drops a trailing citation unmarked), the two misquotes of your own ruling at P3b's shell record `:799`/`:968` (`A9′` re-typed `A9'`; owed-correction with no corrector in a closed record, or the POLISH:113 precedent), and whether a test claim may ever be marked superseded with no replacement (the custodian's and the architect's position: no — an explicit sentence a gate reads, never a mechanical exemption). **PRs opened the same evening:** **#90** (`cut/briefa-p3b-test-names`, its landing confirmed byte-exact against the reduction; the superseded-title sweep now exhaustive at eleven shell sites and three engine) and **#91** (`governance/verify-quotes`, its landing confirmed: Amendment 9 as reduced, the fabricated quotation gone, the checker 103 checked / 73 verified / 29 baselined / 2 hash-baselined on the merged tree). P5's architect (gate-log 85) failed it on G-A4's enumeration (LOD tier sets and the permission audit log are persisted artifacts the scan does not cover) and a composited quotation, reducing its record; one batched round runs; the reviewer follows on a quiet machine. P4's reviewer is running. **ADR-029 G1 STOPPED under Rule 7 (gate-log 80, 86):** the probe is sound and the reading's existence is established (a `u64` rows-processed count on the `read_parquet` path, fine-grained, reaching the fixture's true count in every archived run), but the written conclusion failed two reads — the second on three sentences: a precondition its own cited source refutes (the progress-bar timing pragma gates printing, not the reading; the reviewer's own crate populated the reading without it), the verdict calling the count monotone as an API property when DuckDB latches only the percentage, and an invented cost for route (i) (a statement cache the engine does not have). Round 16 asks whether the custodian applies the reviewer's three sentence remedies and the should-fixes as written for a third read, or the piece holds. The substantive question for your ADR-029 word stands regardless: the engine reaches the reading only by driving the scan through raw ffi, by a crate patch exposing the handle, or upstream; the count must be latched engine-side; the denominator DuckDB reports is an estimate (100,002 for 100,000 rows), which ADR-029 1(c) forbids forwarding. The superseded-name scanner's attempt 2: architect FAIL-reduced (87) to one appended line with the boundary stated honestly (a pin in an append-only record proves age and identity, not disappearance); its reviewer pending.

Archived copy: line 1973 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

110. **[The human's word of 2026-09-18 after the four merges (#84, #85, #86, #87), verbatim:** All four merged (#84, #85, #86, #87). Next: (1) verify-quotes: its final round now under the directive — references-only closing amendment, baseline re-derived against final main, one fresh worker, both gates; land it. (2) Brief A P4–P6: dispatch P4 (the corpus run against the preregistered expectations; every deviation a recorded result) and P5 (the gate tests, G-A1 through G-A6); prep Part N as the next sitting — give me its rows and duration; queue the five acceptances (ADR-015 A1, ADR-016 A1, ADR-013 instance, ADR-028 qualification, ADR-032) for P6. (3) Regenerate PLAN.yaml: P3a/P3b done with their PRs as evidence; B1 shows as blocked on Brief A's close, not on P3. (4) Drill and ADR-029 G1 proceed as ready nodes. Report ≤20 lines; the record-round count on the strip is the number I'm watching this week.

Documentation-only handoff: <the advisory folder>\HANDOFF-2026-09-18-source-consistency.md. Record each part once in the document it names — Part 1 as one AUTONOMY section; Part 2 as a proposed PLAN node (engine lane, unscheduled) with its brief under state/ beside the P3b preregistration; Part 3 into the Brief B draft, with "accepted product direction" and "awaiting preregistration" kept as separate headings exactly as written; Part 4 into the queue as two entries. No amendments narrating the discussion; no implementation, dependency, schema or benchmark; P3b untouched. One docs PR for my click; report ≤10 lines.**]** **Applied the same day, 2026-09-18:** PLAN regenerated — `briefa-p3-p6` retitled P3a and done (PR #83, merged 2026-09-16; the verdict cite is this entry), `briefa-p3b-owner-side-invalidation` done (PR #86); new nodes `briefa-p4-corpus-run` and `briefa-p5-gate-tests` (in progress, dispatched), `briefa-p6-part-n-acceptances` (Brief A's close: the Part N sitting, 60 minutes planned) and five click nodes `accept-adr-015-a1`, `accept-adr-016-a1`, `accept-adr-013-instance`, `accept-adr-028-qualification`, `accept-adr-032` for P6; `b1-engine-kernel-half` now depends on P6. Dispatched as fresh default-model workers, each in its own worktree: the checker's final round on `governance/verify-quotes` (round 15 item 3's fix list, the baseline re-derived against main, Amendment 9 references only, both gates after the handoff); P4 to a tester (`cut/briefa-p4`: the runner under `engine/tests/`, the table to `engine/ADMISSION-RESULTS.md` as generated evidence, Amendment 3 references only); P5 to a worker (`cut/briefa-p5`: G-A1–G-A4 and G-A6 with recorded mutations, G-A2's post-check route end to end, Amendment 4 / P3b Amendment 17); ADR-029 G1 to a worker (`spike/adr-029-g1`: a probe against the vendored duckdb crate, the written conclusion under `spikes/`); Part N's rows to a docs worker (`docs/part-n-walkthrough`: N-rows with every expected outcome quoted from a shipped string, a blank result log, a sitting estimate as scheduling only); the handoff's four parts to a docs worker (`docs/source-consistency-handoff`: AUTONOMY §22, the proposed node `engine-source-change-watcher` with its brief at `state/briefs/source-change-watcher-brief.md` — a new directory, because `state/drafts/` is archived record whose cites are never gated — Part 3 into the Brief B draft under the two headings as written, Part 4 as two proposed ruling nodes so the queue lists two entries). The drill (`drill-clean-clone`) runs after P4 and P5 free the machine and the disk floor (four merged worktrees swept first: 77.9 GiB free on C:, 386.6 GiB on D:). The two consults committed under `state/consults/` (004820b). The record-round count on the strip after #87: P3b 5, LOD 4, checker 3, record-round count 1, total 13, target 0 — its predicate the custodian's stated choice, the human's to adjust by a one-line note.

Archived copy: line 1975 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

109. **[The record-round count (`governance/record-round-count` @ 7d755d8) at attempt 2: reviewer PASS (gate-log 71), architect FAIL (72) on one blocking item — the `record` tag's predicate is written in no tracked text a reader of the gate log or the strip reaches (the plan README's entry shape and metric list; AUTONOMY §15 still names two throughput metrics) — with the record RULED CLOSED under your directive's point (3): no third `Amendment:` line, the figure of record 159/117 at 6a30ea1, the fourth test carried by a pinned reference in record 72's note. The custodian's decision on the predicate, documented in the README this round: the tag marks an attempt that gated a round dispatched after the piece's first gate attempt whose work included the piece's record, whatever else the round carried and whatever the verdict; a first gate attempt is never tagged, even when it fails on the record — the count is rounds spent on the record, the quantity point (3) caps. Under it this node's attempt 1 stays untagged and attempt 2 is tagged (the architect's landing condition asked for both; the predicate decides; if the attempt-3 architect rules the predicate wrong, the question is yours). The round (attempt 3, not a record round): main merged with the gate log resolved by script, the README, one line-count-neutral sentence in §15 (the closed record cites `AUTONOMY.md:345` and `:350` bare), the node summary, the two tags, both gates. Carried, not corrected (the cap): Amendment 1's class label (class 1 fits an ordering defect; class 6 was the attempt-1 report's own prescription); the two bare AUTONOMY cites; Amendment 2's fourth sentence; the NaN-attempt collapse (an undercount unreachable with real records); two uncovered nit-fixes; a stale test title; a bare self-line in a comment. FINDING for the weekly proposal (earliest 2026-09-25), the architect's, filed not adopted: a row added to the published strip is user-visible behaviour under §21c, and a directive ordering the row does not exempt it — such a piece takes full gating from the start, or you adjust the bound by a one-line note. Rule 7 count: reviewer FAIL then PASS; architect one FAIL — a second architect FAIL stops the piece.]** Filed 2026-09-18; nothing merged; the attempt-3 round running. **Corrected the same day, before the attempt-3 gates:** the predicate's wording in this entry ("whose work included the piece's record") was too wide — nearly every fix round appends an amendment, so it would have required tags on the code-led rounds the log rightly leaves untagged (P3a's attempts 2–5, the LOD's attempt 2). The wording committed in `scripts/plan/README.md` on the branch (7d1f70d, the custodian's own two sentences) is what the 23 tags implement: an attempt whose round was dispatched, in whole or in leading part, to correct or re-read the piece's record (the record-fidelity class, or a scoped re-read of appended record text), whatever else the round carried and whatever the verdict; a round dispatched for code, tests or operator text is not tagged even when its findings touch an amendment; a first gate attempt never. The attempt-3 round (cfec693, d4062fe, 7d1f70d) is under both gates. **PR #87 for the click, 2026-09-18:** attempt 3 PASS / PASS (gate-log 73–74) — the predicate ruled sound and consistent with every tag and non-tag, the merge exact, the record byte-untouched, no ADR owed; the architect's four should-fixes at close applied by the custodian in one commit (0e062c1: §15 counts distinct attempts and names the setter; the predicate declared the custodian's stated choice in §21c's form, yours to adjust by a one-line note; the retroactive tagging disclosed — the checker's attempts 2 and 4 rest on the dispatches, not their notes; two paraphrases marked), line-count neutral in AUTONOMY.md; main merged (ee66724) with records 73–74 untagged (mechanism documentation is not a record round, the architect's landing note); evidence pr 87 (87afadb). The strip on the branch: P3b 5, LOD 4, the checker 3, this piece 1, total 13, target 0.

Archived copy: line 1979 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

108. **[The RESIDENCY note STOPPED after two failed reads (Rule 7): the first draft's Proof sentence claimed the checker's baseline named it; the fresh draft cited the test-text exception as round 14 item 3 (it is item 2) and misstated the qualifier (the fixed reference profile's refresh rate became 'the one screen this piece's harness targets'). Under the 2026-09-18 directive's point (3) the architect reduces the note to references — the row handle, the pin at a main commit with its hash, the ruling by round and item, nothing restated — and it lands with the reduced record. The LOD reviewer's attempt-6 verdict (gate-log 69) adds one blocking finding to the LOD's erratum row: eight cross-file cites into `engine/tests/lod_tier_builder.rs` from Amendments 8 and 11, stale since 43a3039 / a3f5f2e / d6073d8, certified as resolving by a claim widened past the three re-reads' survey; the remedy is one append-only row retiring them by item. Under the directive's point (5) the erratum rows for P3b (one clause on engine Amendment 11's line; two rows closing gaps 1 and 3) and the LOD (the per-span counts; the tool row naming fbf3d55; the eight cross-file cites retired by item) are written by the architect as references and hashes only, resolved per row (round 15 (a)–(b)), executed by a fresh worker with the resolution step, and then P3b, #84 and — after its one build-fix round — the checker land through PRs for the click.]** Filed 2026-09-18; nothing merged. **Landed for the click, 2026-09-18:** the errata executed exactly (P3b engine 13 / shell 16 at 46cde2c after merging main at c88e9b0; LOD Amendment 14 at f554dbb after merging main at 31caecf; the reduced RESIDENCY Amendment 28 at 875e839), each with the resolution step run before its commit — PR #86 (P3b), PR #84 (the LOD, body refreshed), PR #85 (the note).

Archived copy: line 1981 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

74. **[Part M split into two sittings (the human, 2026-09-10: M1–M4 first, the rest later) —
    does the v0.1.0 tag wait for sitting 2, or does sitting 1 (install + first open) suffice to
    finalize README/QUICKSTART, write KNOWN-LIMITATIONS and tag?]** Amendment 13's sequence says
    "items 4/5/6 finalized from what M actually showed — item 4 last — then the tag", and the
    freeze holds "until Part M and the tag are done". Sitting 1 establishes the install, the first
    launch, the three notice files and one open; the publish rows (M8–M11), the residency row (M7)
    and the two ADR-020 rows (M12–M13) are sitting 2's. KNOWN-LIMITATIONS' entries 5–7 and 12
    describe sitting-2 behaviour on the packaged build. **(a)** tag after sitting 2 (the release
    text describes only what M showed on the artifact — Amendment 13's own principle); **(b)** tag
    after sitting 1, with entries 5–7/12 written from the dev-build evidence (Parts G/H/K/L) and
    marked as such. Not decided here.

Archived copy: line 2276 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

72. **[Porting-time conflict, noticed before porting (Draft 2, Brief A): the brief's commit line
    `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s` names an author/sign-off
    identity different from every commit in this repository (Christopher Donini
    <donini.christopher@gmail.com>) and from the DCO gate's own author-spoof fix Draft 1 cites.
    Which identity signs the post-tag cuts' commits?]** Raised 2026-09-10 while reading the drafts
    (nothing ported yet; the human's order is Part M → tag → Draft 1 → Draft 2 → Draft 3). If the
    brief's line stands, the DCO check ("every commit is signed off") needs the Signed-off-by to
    match the author it enforces, and the custodian's worker briefs must carry the same identity;
    if the repository's identity stands, the brief's line is corrected at porting with a dated note.
    Not decided here. Not a tag matter.

Archived copy: line 2313 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

71. **[ADR-028's header line reads `Status: **Accepted, 2026-09-02** …` — the only ADR whose
    Status label is not the `**Status:**` shape the other 29 use. Leave it (an Accepted ADR is
    immutable; the new index reader accepts both shapes), or append a dated corrigendum line
    normalising the label?]** Found 2026-09-09 by the ADR-index piece (`frontends/shell/scripts/
    adrIndex.mjs`, `docs/README.md`'s generated table); the reviewer judged accepting both shapes
    right and not a silent widening (the reader refuses zero or multiple Status lines), and noted the
    one thing it permits — a future ADR written with an unbolded label passes silently — as a
    docs-convention question, not a tool defect. Cosmetic consequence: ADR-028's cell renders bold.
    **(a) RECOMMENDED — leave the ADR; state the convention** (`**Status:**` on line 3) in
    `docs/adr/README` or the ADR template if one exists, so the next ADR follows it; (b) a dated
    corrigendum on ADR-028 changing the label only. Not a tag matter.

Archived copy: line 2324 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

70. **[The post-tag ordering, and the drafts' open questions — for the sitting: which of the
    four post-tag candidates goes first, and do "next cut's first piece" (entry 47, ruled
    2026-09-08) and "the first post-tag piece" (entry 66 (b), ruled 2026-09-09) name the same
    queue?]** The four drafts and two architect consults are under `state/drafts/post-tag/`
    (nothing filed, nothing decided). The consults' recommendations, each labelled the architect's:
    decide ADR-032 first on paper (cheap; unblocks limitation/QUICKSTART wording) but build it after
    the geometric-protection piece if the pick is (B) — three unmet preconditions (no degrees
    fixture, no accepted ADR-015 §5 amendment, no pinned GeoArrow metadata reading); implementation
    order 66 (b) → 47 (entry 58 rides with it) → LOD last, gated on its own unwritten overview ×
    filter rule. Findings that change the drafts before any preregistration: 66 (b) — a retained
    queued in-view tile past the bound is later ISSUED by the queue drain with no cover re-check
    (new wire traffic for cells never enumerated), the closing ADR-028 note can close one of the two
    declared deviations only; 47 — a canvas resize between hover and settle re-aims the stored pixel,
    and the replacement K6 assertion is self-certifying; LOD — a one-word misquote of docs/07:22
    ("each requires"), L5/L1/L6 re-sourced, the tier artifact's write class (ADR-006 class 3 if
    outside the workspace) unanswered; ADR-032 — `MIN_ANCHOR_SPAN = 1` is a declared bound that
    stops being true in degrees, "v1 + a widened axis_order value" is excluded by the readers' exact
    equality, ADR-017's version exception is spent. The consults list 12 further open questions
    between them. Not a tag matter; the ruling is the post-release sitting's.

Archived copy: line 2336 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

59. **[Item 8 (CRS catalog: EPSG:4326 + 3857, ruled "yes … under the entry-51 protocol") — the 4326
    half CANNOT be built as ruled; the 3857 half can and proceeds under the ruling. Architect consult
    2026-09-08: BLOCK on 4326, PASS with notes on 3857.]** The custodian's finding before dispatch: a
    4326 definition (declared OR asserted) is refused at `engine/src/dataset.rs:303-307`
    (`AxisOrderUnsupported`) — the engine types its Lat/Lon axes as `AxisOrder::LatitudeLongitude`
    (`engine/src/geoparquet.rs:184`) and the slice test `engine/tests/slice.rs:310-324` pins the
    refusal ("refused rather than reinterpreted"); a catalog entry would pass the catalog's own tests
    and be refused at open. The GeoParquet 1.1.0 specification says WKB coordinates are always (x, y)
    and that this "explicitly overrides the axis order as specified in the CRS" — pinned verbatim, with
    URL, retrieval date and page hash, in `spikes/item8-crs-catalog-extension/README.md` §2 (the
    entry-51 discipline), alongside both `projinfo` renderings (PROJ 9.6.2, EPSG v12.013, the same
    `proj.db` as entry 51 by hash). **The architect's entry text, verbatim:**
    *"A 4326 definition (declared OR asserted) is refused at engine/src/dataset.rs:303-307. ADR-015 §5
    (Accepted, architect-blockable) refuses a non-x-first source "rather than reinterpreted"; ADR-026:61
    restates it. Admitting one is an ADR-015 amendment — your word, not the custodian's. Also found (not
    in the preregistration): renderer/bundle-viewer/src/partition.ts:29,115-121 refuses any order but
    easting,northing, so a 4326 bundle is a dead artifact of the exact shape ADR-025 was accepted to
    prevent; and the GeoParquet override text is nowhere in the tree (pin it verbatim first, entry-51
    discipline). (a) RECOMMENDED — EPSG:3857 only this cut: no ADR change, works end to end, one new
    test; file ADR-032 Proposed (decision open) for 4326; KNOWN-LIMITATIONS names the 4326 refusal.
    (b) 3857 + 4326 under a recorded GeoParquet-1.1.0 override: ADR-015 amendment + ADR-017 §14 reader
    change + possible bundle_version 2 (the v1 lever is spent, ADR-017:855-859) + a degrees fixture. A
    cut of its own, not a release item. (c) 3857 + OGC:CRS84 instead of 4326: admitted today, zero code
    change — but it helps only files that declare NO CRS, not a stranger's 4326 file, and it renames
    your ruled item. Recommend (a) now, (c) optional on your word. Your calls: the amendment; the scope
    change to ruled item 8; whether v0.1 tags with the 4326 refusal declared."* (The spec text is now
    pinned; the architect's ADR-032 skeleton is recorded in `RELEASE-0.1.md` Amendment 7 and is filed
    only on your word, as ADR-030 was.) **Custodian's recommendation: (a).** Also the architect's
    correction to the preregistration's rendering sentence, binding on any future geographic entry:
    "NO reprojection … plate carrée" contradicts itself — the honest form is "no coordinate value is
    transformed; the display convention is equirectangular", said in the UI and the manifest, and a
    dated note on ADR-003's `crs_transform` string would be owed (your word). Touches now: nothing —
    the 3857 piece (already within the ruling) is dispatched; 4326 waits. On (a): ADR-032 filed
    Proposed; KNOWN-LIMITATIONS entry 2 = two entries + the 4326 refusal named; QUICKSTART must not say
    a WGS 84 file "opens" (`RELEASE-0.1.md:422` overstated — Amendment 7 corrects it). **Also your
    word, found by the architect's re-check of the 3857 piece (2026-09-08):** ADR-026's implementation
    note line 76 ("The one entry (`epsg-2056`) reuses …") becomes false when 3857 lands — an Accepted
    ADR, so an APPENDED dated implementation note (the set is two entries; `epsg-3857` added
    2026-09-08 as the pinned PROJ 9.6.2 rendering, `EPSG_3857_HASH`; a per-entry `schema` field) is
    requested, never an edit. The custodian writes it only on your word.

Archived copy: line 2654 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

58. **[A9′ (the regression suite's hover → pick → `.hover-readout` shows an id step) is FLAKY,
    arm-independent — filed on the human's ruling of 2026-09-08, not yet diagnosed.]** Facts from the
    arm-flip piece's runs (2026-09-07/08, quiet and busy machine): across seven logged regression
    runs A9′ PASSED 3 / FAILED 4; in the three-run K6 matrix it failed in both baseline runs and
    passed in the candidate run; the worker and the reviewer both call it arm-independent and note the
    P5c interior-pixel hardening comment in `e2e/regression.mjs:269-301` (the step picks a
    non-background pixel to hover; edge pixels that "look non-background but were never a safe hover
    target" were the diagnosed cause of an earlier flake class). NOT diagnosed here. Candidates: the
    pixel-selection heuristic under load; the pick-radius / offset-frame hit-test near the threshold
    (the same undiagnosed half entry 47 carries verbatim). Recommendation: diagnose alongside entry 47
    as the next cut's first piece (same code, same repro harness); until then the step stays in the
    suite, its flakiness declared in the run record, never hidden by a retry. Touches: nothing now.

Archived copy: line 2695 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

46. **[The E2E harness now relies on `vite-node` — present only as vitest's transitive dependency
    — to import the shell's own TypeScript (`e2e/tsModuleLoader.mjs`, close-out fix piece).
    Declaring it explicitly is a dependency-tree addition, a red line, so it is the human's
    call.]** Context: the pre-committed E2E assertion must recompute the covering set with the
    shell's own `tilesCoveringBbox` (a hand-copied reimplementation would test the test), and that
    module's extensionless `moduleResolution: "bundler"` imports plus type-only named imports
    defeat plain Node ESM and `--experimental-strip-types`, so the worker loaded it via vite-node
    (verified by the reviewer: `package.json`/`package-lock.json` unchanged; `vite-node@2.1.9`
    hoisted under `vitest@2.1.9`). The coupling is real but undeclared: a future vitest major bump
    could remove or move it and break the harness silently. Options: (a) add `vite-node` as an
    explicit devDependency pinned to vitest's own version (one line, no new code, no runtime
    reach — dev/E2E only, docs/09's gate discipline untouched); (b) leave it transitive and note
    the coupling in `e2e/README.md`. Recommendation: **(a)**, on your word. Touches:
    `frontends/shell/package.json` + lockfile only.
    **RULED 2026-09-06, the human, verbatim:** *"Entry 46 = (a), add vite-node as an explicit
    devDependency pinned to vitest's version (dev/E2E only, docs/09 untouched)."* Applied as a
    one-commit follow-up after PR #24 merges (never racing the click): `vite-node` enters
    `frontends/shell/package.json` devDependencies with vitest's own specifier form (`^2.1.8`,
    resolving to the already-installed 2.1.9) plus the lockfile — nothing else.
    **Sibling, same class, 2026-09-07 — for the human's word:** the entry-40 instrument piece
    (`cut/entry40-producer-pass` @ 0a6ddee) enabled the `macros` feature of the already-present
    `tokio` crate in `[dev-dependencies]` of `frontends/shell/src-tauri/Cargo.toml`, for two
    `#[tokio::test]` lifecycle tests the reviewer required. No new crate, dev-only, no runtime reach —
    but a dependency-tree change not named in the brief, so it is recorded here rather than assumed.
    Recommendation: accept (a test-only feature of an existing dependency); the PR body names it.
    **Reviewer's factual characterisation (2026-09-07, verified):** `Cargo.lock` is byte-identical to
    the base commit; `tokio` was already a direct `[dependencies]` entry of this crate; `tokio-macros`
    was ALREADY in the shipped dependency graph through `tauri`/`axum`/`hyper` before this commit.
    So: no new package at any edge class, no lockfile delta, no new runtime reach — the dependency
    TREE is unchanged; what is new is one manifest line. If the red line reads "tree addition", this
    is not one; if it reads "manifest change", it is in scope. Recorded either way; your word.
    **Accepted by the #25 merge (2026-09-07, inferred from the click, not a stated word):** PR #25's
    body put this line to the human under the heading "One manifest line, for the human's word",
    and the human merged it (`356234b`). Recorded as accepted on that basis; say so if the click was
    not meant to carry it.

Archived copy: line 3194 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

42. **["Zoom to layer" under the candidate arm fits what has RENDERED, not the layer — surfaced
    2026-09-06 at the Part L sitting; the human's stated expectation is a design position that
    touches SKP-V0 C1, so it is recorded, not decided here.]** The human, verbatim: *"The zoom to
    layer should take into account the whole extent of the features, max, min coordinates. Not
    what just rendered."* Also verbatim, the observation: *"when you press zoom to layer it doesn't
    zoom all the way up to show all the features."* Mechanism (code-verified): `fitToBounds` fits
    the dataset-lifetime fit anchor (`WorkingCanvas.tsx` `fitAnchorRef`, `chooseFitTarget`), the
    union of every extent this instance has rendered — baseline's unbounded first stream grows it to
    the full dataset, but the candidate arm's first look is truncated at
    `UNTILED_FIRST_LOOK_ROW_LIMIT` (10,000 rows), so on a spatially-ordered file the anchor is a
    fraction of the layer and the button under-delivers its own name. The reason the anchor exists
    at all: `describe` never claims a dataset extent (`SKP-V0.md` C1, cited at
    `WorkingCanvas.tsx:859-860`), so the client has nothing else to fit. Honoring the expectation
    needs the extent from somewhere: (a) the producer supplies min/max in `describe` — an SKP field
    addition (ADR-025/026-class protocol change, its own ADR or amendment; GeoParquet's own
    `bbox` metadata makes this cheap and honest when present); (b) a client-side full-extent scan
    before the first fit (against principle 7 at 5 GB); (c) keep the anchor and rename the button
    to what it does. Recommendation: **(a)**, scoped to the LOD/producer line the next cut opens
    — the same producer-side work already owes overview-scale answers, and a declared extent is the
    smallest honest version of one. Touches: SKP-V0 `describe`, engine describe path, `fitToBounds`.
    Sibling of Part K's 5 GB "dead button" addendum.

Archived copy: line 3324 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

39. **[DCO gap on PR #22, surfaced 2026-09-06 by the ordered sign-off audit — fixing it is a red
    line (history rewrite / force-push), so NOT decided or done by the custodian.]** 18 of 19
    commits on `cut/residency-debt` carry `Signed-off-by`; ONE does not — `3e653f0`, the revert of
    the b21111d "entries 32/33/34" mistake, because `git revert --no-edit` does not add a sign-off
    and `-s` was not passed. It will fail the DCO gate on merge. The fence that should have caught
    it (entry-26's `.githooks/commit-msg`) was INERT — `core.hooksPath` was unset in this
    environment; now ARMED and verified (rejects unsigned, passes signed), so no FUTURE commit
    leaks, but the historical `3e653f0` is already pushed. Every fix rewrites history and needs a
    force-push, which the standing rule forbids the custodian. Recommendation: **squash the
    b21111d/3e653f0 no-op pair out** via interactive rebase (they cancel exactly — a
    mistake-and-revert that never needed to exist), which removes both the unsigned commit AND the
    noise in one move; alternatives are a `rebase --exec 'git commit --amend --no-edit -s'` to
    sign just 3e653f0, or a DCO-app override. **Your hands or your explicit authorization** — the
    custodian will not force-push. Touches: PR #22's history only.
    **RULED 2026-09-06 (the human's takeover message, verbatim: "entries 38/39/40 ruled
    (defer-with-trigger / no-rewrite entry-26-style / routed to producer diagnosis)"):**
    this entry's ruling is "no-rewrite entry-26-style" — the squash recommendation is REJECTED;
    no history rewrite, no force-push. The unsigned revert 3e653f0 stands documented (this entry
    is the record), entry-26-style: the gap is known, fenced going forward (hooksPath armed), and
    the merge disposition of PR #22 under DCO is the human's own click.
    **Remedy EXECUTED 2026-09-06:** the retroactive DCO 1.1 certification posted as a PR #22
    comment under the human's own identity (issuecomment-5558365949, entry-26 wording, on the
    human's explicit direction), and the checklist note added beside the entry-26 one
    (`PRE-PUBLIC-CHECKLIST.md` §6, item 5). DCO is the only red check; build/typecheck/tests green.
    **Remediation-commit route EXECUTED 2026-09-06 (human-directed), check still red — one
    decision open:** the standard-format DCO remediation commit for `3e653f0` landed @ `536ceb9`
    (signed, empty, the human's dictated wording, full sha named). But the check is OUR OWN
    workflow (`.github/workflows/dco.yml`), not the DCO app: it judges each non-merge commit in
    the PR range IN ISOLATION (trailer present on that commit, name/email = its author or
    committer) and has NO remediation-commit logic — re-check on head `536ceb9` read
    "Checked 25 non-merge commit(s); 1 failed", the one being `3e653f0`; the remediation commit
    itself passed. Workflow NOT patched (per the human's own instruction). **The human decides:**
    (a) teach `dco.yml` the remediation convention (a scoped workflow change — accept a commit as
    remediated when a later in-range commit is a standard-format remediation commit for its sha,
    signed by the same identity), or (b) untick the required check in repo settings for this
    merge (the human's hands — repo settings are not the custodian's).

Archived copy: line 3424 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

2. **D1 (style cut, small) — "Save style…" file write, or visible/copyable text only?** The style
   panel shows the current style document as text (the accepted ADR-017 §5a format — the model
   already exists; the shell adopts it rather than inventing one). A Save-to-file button would be
   an ADR-006 **class-3 external side effect** (export): explicit approval + an audit record owed —
   machinery the publish cut is building anyway. Recommendation: **text only this cut**; the
   clipboard covers the hero-slice round-trip (style in shell → copy → `publish-bundle --style` →
   bundle viewer). The cut proceeds on the recommendation unless you override. Touches: the style
   panel's control set only.

Archived copy: line 3966 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.

1. **Rider-1 refinement — clear the ceiling status when a new query is issued?** Your rider 1
   (2026-08-13) made the `.residency-status` ceiling indicator persistent "while the condition
   holds," cleared by a later full delivery or dataset change. The filter-panel cut adds a third
   way the condition stops holding: applying a filter supersedes and clears the canvas, after
   which a stale "78,191 of 100,000 features rendered" would be claiming something no longer true.
   The architect recommends adding a `"query-issued"` clear transition — within your rider's
   stated intent, but the rider was your decision, so it's named here rather than absorbed.
   Recommendation: **approve**. Touches: `nextResidencyStatus` + one unit test (P4 of the
   filter-panel cut proceeds on the recommendation unless you say otherwise; flagged in the PR).
   *(A second, smaller operator call — whether the scan-liveness indicator shows on every
   in-flight stream or only filtered ones — is deliberately left to your Part E judgment, with
   every-stream as the recommended default.)*

Archived copy: line 3975 of `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`.
