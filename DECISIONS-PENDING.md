# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

**RULED 2026-09-08 — entries 53 (reduced form), 55, 56, 57, item 8, #30, the sweep — the human
verbatim:** *"55 = (b): config mirror via tauri::is_dev(); Part M equivalence assertion under dev /
build --debug / build; post-load logged self-check of pinned vs actual origin with a typed mismatch
state (assertion, never selection, no pump); windows edge + unsafe removed; conditions (4)/(5)
retained, (1)–(3) superseded; recorded as ADR-020 Amendment 1's content; new mechanic: never block or
pump inside setup(). 56 = (b) now — stepK6 encodes both cases explicitly (continuous→refusal,
discrete→clear, no stale id); 47 = next cut's first piece; A9′ flakiness gets its own entry. 57 = (b)
to unblock + item 9 (both generators) BEFORE the tag + ADR-030 filed Proposed with (a) as decision on
item 9's landing; LOD → ADR-031; the ensure_pinned finding is entry 7's ruled pre-fix, never built —
add it to this cut as a small piece, KNOWN-LIMITATIONS only if it slips. 53 reduced = (a). Item 8 =
yes, 4326 + 3857 under the entry-51 protocol. #30: clicking. Sweep authorized in full."* Applied:
`RELEASE-0.1.md` Amendment 6 (the ruled item list v3 + preregistrations for item 1 (b), the K6
re-aim, item 8, item 9, item 10 = entry 7's pre-fix); the sweep dispatched on #31; item 1 (b) and the
K6 re-aim dispatched; ADR-030 filed Proposed; the LOD home renumbered ADR-031; the mechanic added;
entry 58 (A9′ flakiness) filed below. #30 merged @ fdb7c87.

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

57. **[Packaged build (items 2/3/3e) — RULE 7 REACHED on the architect's side: one sentence in the
    installed `NOTICE.txt` still overclaims, and a decision this project has never made is now
    live: what notice set a conveyed artifact must carry.]** After the fix batch (`34a1896`), the
    three `NOTICE.txt` copies are byte-identical (163,771 B, the viewer's real apache-arrow 18.1.0
    with Arrow's retained NOTICE), the hash is truly pinned, the boundary/class-C/§6/ADR-025/Part M
    items all pass. **The block:** the header's scope sentence says the file "covers the VIEWER and
    the packaged frontend only — it does NOT enumerate the Rust crates". The second half is the gap
    already named as owed (Amendment 5). The first half is **false**: the packaged frontend is a
    separate Vite build of a separate `node_modules` — React, react-dom, `@deck.gl/core`+`layers`
    9.3.7 (MIT), `apache-arrow` 21.2.0 (Apache-2.0) — compiled into the installed app and absent
    from the notice, whose third-party section derives from the *viewer's* esbuild metafile only.
    Two owed sets, not one. **Unblocking is one sentence** (name both gaps as owed; mirror in
    `DEPENDENCY-LICENSES.md`; re-quote Part M's M3) — but "whether v0.1 may ship with two named
    notice gaps rather than one is the human's call" (the architect, verbatim in substance).
    **Options:** (a) close both gaps before the tag — a notice generator for the shell's Vite build
    (metafile-equivalent) and one for the Rust crates from the lockfile, into the same one-source
    `NOTICE.txt`; (b) ship v0.1 with both gaps NAMED — in the notice, in `DEPENDENCY-LICENSES.md`,
    in KNOWN-LIMITATIONS — with a due milestone; (c) status quo (per-artifact rulings — the architect
    shows this failing). The architect drafted an **ADR-030 skeleton** ("the notice set a conveyed
    artifact must carry") with exactly these candidates; filing it is yours. **Recommendation:** (b)
    to unblock this PR now (the sentence, authorized as a custodian sweep since the piece is under
    rule 7), AND item 9 on the cut — both generators — scheduled BEFORE the tag so KNOWN-LIMITATIONS
    need not carry a notice gap at v0.1.0; file ADR-030 Proposed with (a) as the decision once item 9
    lands. Also from this re-check, for item 4: `ensure_pinned`'s whole-file SHA-256 before publish
    (uncancellable, progress-less; sighted at Part M M10 at 5 GB) is operator-visible in a packaged
    first publish and must be a KNOWN-LIMITATIONS entry (principle 7) — not among the eight adopted.
    Fix-forward nits to ride the sweep: `docs/02:91`'s stale "(ADR-025 stays reserved …)" clause;
    M3's tense; M10's trailing period; the shipped refusal's developer-only remedy text; the
    `#[ignore]`d boundary test stated as not-in-CI. **Added 2026-09-08, after PR #31's CI:** the
    Rust workspace job is RED on `34a1896` — `ceilings_json_bytes_are_pinned_by_content_hash`
    panics on `windows-latest` (`6406…` vs the pinned `fd74…`) because CI's git checks
    `ceilings.json` out with CRLF while the blob is LF; locally both are LF. The repo already pins
    `*.projjson text eol=lf` in `.gitattributes` for exactly this reason ("byte-sensitive test
    fixtures: checked out verbatim on every platform"); the fix is one line — `renderer/bundle-
    viewer/ceilings.json text eol=lf` — and the CI record for the `tauri-build` job (first green run
    34190120055 / 34a1896 / pull_request / 27m19s) goes into the workflow's record slot in the same
    sweep. Both held under rule 7 for your word; the PR is red until then. The reviewer's local run
    could not see it (`core.autocrlf false` here) — a class to add to the reviewer checklist.

56. **[The regression suite's K6 step is RED on unmodified main — a pre-existing failure the arm-flip
    piece surfaced by running the suite on both arms; it is entry 47's mechanism seen by a machine.]**
    Facts (item 7's fix batch, quiet machine, all apps closed after): K6 fails identically —
    `last seen: {"text":null,"belowResolution":false}` — on (i) the unmodified main checkout
    (baseline, the only arm it has), (ii) the flip branch on candidate, (iii) the flip branch pinned
    to baseline. A9′ is flaky across all three (arm-independent). The reviewer's code-level cause,
    from `src/canvas/pickResolution.ts` `reevaluateStandingHoverOnCameraChange`: when a camera change
    leaves the feature above the pick threshold, the standing readout is CLEARED (returns `null`);
    every later change sees `standing === null` and emits nothing — so `stepK6`'s ≥8 DISCRETE wheel
    events clear the id on notch 1 and the below-resolution refusal is never reached. A human's single
    continuous wheel gesture (your L7 "fine", 2026-09-06/07) is coalesced by deck.gl into one change
    that crosses the threshold, which is why the walkthrough passes and the E2E does not. This is the
    behaviour you described at L8 and again on 2026-09-07 ("as long as I can tell on which feature I'm
    hovering, there's no reason to remove the id") — entry 47, ruled (b) re-pick on camera settle for
    the NEXT cut. **Options:** (a) pull entry 47 forward into this cut (re-pick on settle would make
    K6 pass by design and honours your criterion; it is Item C's escape hatch, small but product code,
    reviewer-gated); (b) re-aim `stepK6` to the CURRENT contract (one continuous zoom crossing the
    threshold → refusal text; discrete notches → clear) and keep 47 next cut, with KNOWN-LIMITATIONS
    entry 13 already naming it; (c) leave K6 red and declared — not recommended (a red step in the
    suite the release cites). The flip piece does not depend on this: it merges with K6 pre-existing
    and named. Recommendation: **(b) now, (a) as the next cut's first piece** — the E2E must test the
    shipped contract, and the contract you want is 47's. Touches: `e2e/regression.mjs` `stepK6`
    (b), or `pickResolution.ts` + a K6 re-aim (a).

55. **[Release cut item 1 (ADR-020) — RULE 7 REACHED after two failed gates; the origin-selector DESIGN
    is your decision, and a dependency edge needs your word regardless.]** Full account:
    `RELEASE-0.1.md` Amendment 4. The short form: the piece as shipped (`5d22d7a`) derives the origin
    from the webview's actual URL at startup, but the URL is `about:blank` at that instant, so it
    **pumps Win32 messages in `setup()` for up to 5 s** until a host appears — adding `windows` 0.61.3
    as a direct dependency (changes `Cargo.lock`) and the crate's only `unsafe`. The architect verified
    on the sources that tao buffers its own events under that re-entry, but **WebView2's IPC callbacks
    are not behind the guard: page script can dispatch a command before `setup()` returns** — every
    state-taking command fails cleanly, but `binding_pick_file` (a native file picker) is reachable
    with no managed state. Not new capability; but the amendment's "only the host-configured navigation
    precedes the read" is now a timing claim, not a structural one. The pump also swallows `WM_QUIT`,
    the non-Windows fallback is a sleep-only path already proven not to work, and the refusal dialog
    relies on an undocumented main-thread inline dispatch — no packaged refusal has been observed.
    **The alternative (B), verified:** Tauri's own origin choice is `#[cfg(dev)]` from ONE `cargo:dev=`
    emission that the shell crate also receives (`tauri::is_dev()` is public), so `if tauri::is_dev()
    { origin_of(config.build.dev_url) } else { tauri_protocol_origin }` mirrors Tauri exactly and
    cannot disagree however `tauri build --debug` falls — no runtime read, no pump, no dependency, no
    `unsafe`, platform-uniform, zero startup cost; its cost is re-implementing `pub(crate)` upstream
    logic (silent drift on a tauri minor, failing loudly by 403) and reintroducing the compile-time-
    selector class Amendment 1 §(e) names. **Architect's ranking:** (B) **if and only if** paired with a
    Part M assertion on the packaged artifact that the pinned origin equals the webview's actual
    `url()` origin under `tauri dev`, `tauri build --debug` and `tauri build` — then it strictly
    dominates; a third option (config-derived value as the pump's termination predicate) ranks
    between. **Options:** (a) keep the pump: accept the `windows` edge + `unsafe`, fix the six text
    items and the `WM_QUIT` swallow, record the IPC window with `binding_pick_file` named, owe a
    non-Windows equivalent before the macOS/Linux gates; (b) switch to the config mirror + the Part M
    equivalence assertion, amend §(e) by appended note, drop the dependency — a design change, a fresh
    preregistration amendment, one more worker pass and gate on your authorization; (c) the hybrid.
    **Recommendation: (b).** Also yours: whether the decision is recorded as ADR-020 Amendment 1's
    content or as a new deliberately-open ADR (the architect drafted a skeleton, in Amendment 4).
    Touches: `lib.rs`, `origin.rs`, `Cargo.toml`/`Cargo.lock` (removal), ADR-020 Amendment 1 text,
    Part M step list.

**RULED 2026-09-07 — entries 52, 53, 54 together, the human verbatim:** *"52 = (a): flip the default to
candidate; arm switch stays dev-gated for the harness; the piece audits and re-aims/arm-pins every
test encoding the refusal contract (Part D banner, OVERCEIL′); Part M on the flipped build. 53 = run
the ADR-017 exposure review inside this cut, bundled with Part M on the packaged artifact;
pre-declared fallback: if F-10 fails, publish descopes by name and the hero slice ends at style. B3:
include ADR-025 and the review by name; ADR-025 reading = refuse-at-preflight, typed, naming the
viewport-bbox alternative, reopen when a second reader exists. Installer = NSIS only, per-user, no
elevation. 54 = authorized with five conditions [as above]; ADR-020 Amendment 1 pre-approved in that
shape. Recommended addition, rule at brief sight: extend the CRS catalog with EPSG:4326 and 3857 under
the entry-51 verification protocol. The consult's eight KNOWN-LIMITATIONS additions and twelve
prohibitions adopted as written."* **Custodian's reading of "[as above]"** (the five conditions the
consult attached to design (a), `RELEASE-0.1.md` Amendment 1 Q1 — correct me if you meant others):
(1) read the webview URL once inside `setup()` before any page script can run; (2) normalise to
scheme+host+port; (3) pin the value for the process; (4) refuse to start on an empty/unparseable
origin (fail closed); (5) name the Tauri 2 API and crate version verified, in the piece, not from
memory. Applied: RELEASE-0.1.md Amendment 2 (the ruled item list + preregistration); item 1 and the
arm flip dispatched in parallel; ADR-025's decision appended on this word (status Accepted
2026-09-07, the human's words verbatim); the CRS-catalog extension recorded as a proposed item for
ruling at the brief's sight, not started.
**PREMISE CORRECTION to entry 53 / B2 (custodian, 2026-09-07, on reading ADR-017 in full):** the
architect's B2 said the ADR-017 exposure review "has not happened". **It has, for the shell's UI
surface:** ADR-017 "Exposure review — 2026-08-17, human decision — the UI surface passes, with two
binding conditions" (Part G run end to end by the human, ruling verbatim there) and "Exposure review
completion — 2026-08-17 — both binding conditions landed; discharge effective for the UI surface"
(*"the acceptance condition is discharged for the shell's UI surface"*; `publish-bundle` stays
dev/test tooling as a CLI; SKP/MCP/plugin/notebook/AI each still need their own review). The
consult read the Status block and the F-10 clarification (:1031-1043) but not :1110-1143 — a
partial-read miss, named. **What is genuinely open for v0.1:** (i) that same UI surface has never
run from a packaged artifact — Part M re-confirms it there (a re-verification of a discharged
surface, not a new review); (ii) the ADR-025 preflight refusal is NEW behaviour on that surface and
is shown at Part M. **Your ruling "run the ADR-017 exposure review inside this cut" was made on the
consult's premise — your word on the reduced form:** (a) Part M on the artifact re-confirms the
discharged UI surface and sights the new ADR-025 refusal; the pre-declared fallback (publish
descopes, hero ends at style) stays as the safety net if Part M finds the packaged surface deviates
— recommended; or (b) a full second exposure review regardless. Nothing about publish in v0.1 text
is written until you answer; items 2/3/3e proceed either way.

54. **[Release cut, item 1 — the ADR-020 owed defect: authorize the piece under your
    security-posture red line, and pre-approve the shape of the ADR-020 record it will append.]**
    The architect consult ranked the fix (`RELEASE-0.1.md` Amendment 1, Q1): **(a) derive the
    expected origin from the webview window's actual URL** — read once in `setup()` before any page
    script can run, normalised to scheme+host+port, pinned for the process, refused at startup if
    absent/unparseable — with **(b)** folded in (one declared source for the dev origin, closing the
    three-place `5180` drift ADR-020 records); **(c)** (refuse to start under `tauri build --debug`)
    only as fallback. (a) keeps ADR-020's accepted mechanism intact: host-supplied, exact-match,
    never page script, never a wildcard; `Origin: null` still rejected; the `sec-fetch-site` fallback
    unchanged; docs/09 and ADR-012 H4 untouched. The API exists in the pinned crate (tauri 2.11.5,
    `Webview::url()`, `src/webview/mod.rs:1679-1680`). Tests that carry the claim stay
    (`kernel/tests/skp_admission.rs`: port-derived default not admitted; admitted origin + wrong
    token refused) plus a packaged-`--debug` admission check on item 3's artifact. **Why your word
    and not just a gate:** ADR-020:21-24 records origin admission as *"human-directed
    (security-posture red line)"*, and the ADR is not architect-blockable. **The record: an appended,
    dated ADR-020 Amendment 1, not a corrigendum** (the text is not wrong; acceptance excluded the
    selector) — the Status sentence discharged quoted verbatim; the new selector with API + version;
    *"the accepted mechanism is unchanged; this replaces a selector the acceptance never covered"*;
    the E2E `import.meta.env.DEV` gate's status under `--debug`; a reopen condition; and same-commit
    updates to `docs/02:83` and `docs/README.md:27`. Recommendation: authorize (a)+(b) as one
    reviewer-gated piece (architect re-check on the origin code before the gate), and pre-approve
    the amendment shape so it appends when the piece lands, with your final word at the PR. Touches:
    `frontends/shell/src-tauri/src/lib.rs`, kernel admission tests, the E2E check, ADR-020 (append),
    docs/02, docs/README.

53. **[Release cut, items 3–6 — publish in v0.1 (ADR-017's undischarged acceptance condition), the
    two dropped flip-track items, and the installer target.]** (1) **ADR-017:4-7:** publish stays
    *"developer/test tooling only"* until the kernel enforces a scoped grant, explicit approval and a
    redacted audit record AND — your F-10 ruling — *"the exposure surface itself pass[es] review"*;
    ADR-024's filing does not discharge it. A distributed installer whose Part M, quickstart and
    release notes say "publish" is a shipped UI. **Your call:** run the exposure review inside this
    cut (you review the shell's publish surface against §15/§18 — the custodian prepares the
    evidence pack: the approval dialog, the grant scope, the audit record, the redaction), or v0.1
    ships WITHOUT publish in Part M / QUICKSTART / README / release notes (the hero slice then ends
    at "style", declared). (2) **B3:** my brief silently dropped the ADR-025 reading and the exposure
    review — both on your 2026-09-07 "flip track" list. Include (the exposure review is (1); the
    ADR-025 reading = your decision on refuse/warn/silent above the viewer's ceilings, needed for
    KNOWN-LIMITATIONS entry 2 to say what the shell does) or descope by name. (3) **Installer
    target:** `tauri.conf.json` has `"targets": "all"` (NSIS and MSI both produced). Pin one:
    recommendation **NSIS** — per-user install, no elevation, so the clean-profile test needs no
    admin. Recommendation overall: exposure review inside the cut (it is a review you already framed
    as the flip track's own item), ADR-025 read and decided before entry 2 is written, NSIS. Touches:
    `tauri.conf.json` targets; Part M / QUICKSTART / README text; ADR-025 status (your word).

52. **[Release cut — BLOCKING: which residency arm ships in v0.1.0? The packaged build today runs
    BASELINE, and my draft KNOWN-LIMITATIONS described the candidate arm.]** Architect finding B1,
    verified on the lines: `residencyArm.ts:26` `DEFAULT_RESIDENCY_ARM = "baseline"`; its doc: *"The
    candidate default flips only if the human accepts ADR-028 -- never in this module, never in this
    piece"*; the only switch site is DEV-gated (`App.tsx:945-949`: the module *"never runs, or is even
    referenced, in a production build"*). ADR-028 IS Accepted (2026-09-02) — the flip is licensed and
    was never built. A plain `tauri build` therefore ships the ceiling-refusal interim
    (`MAX_RESIDENT_VERTICES = 2,000,000`, `limits.ts:25-28`), under which *"docs/07's 5 GB hero
    dataset never fits client-side at all"* (ADR-011:63) — not the "declared partial view at overview
    zoom" your dispatch names, and not the candidate-arm behaviour your L9 judged. **Options:**
    **(a)** flip `DEFAULT_RESIDENCY_ARM` to `"candidate"` for v0.1 — a scoped piece (the DEV gating
    and `check:dist-clean` reworked so candidate code ships; the dev-only arm switch stays dev-only),
    reviewer-gated, Part M run on the flipped packaged build; Part K/L verdicts and the G1/G2 cells
    were taken on the candidate arm and transfer, but no packaged-build evidence exists on any arm
    yet; **(b)** ship baseline and rewrite KNOWN-LIMITATIONS entries 3 and 42 to the ceiling-refusal
    contract — honest, but it contradicts your own "honest, declared v0.1 limitation" framing and
    makes the 5 GB sentence unavailable without the refusal beside it; needs an ADR-028 amendment
    recording that the shipped artifact does not carry the accepted contract; **(c)** defer v0.1
    until the flip has its own cut. Not an ADR change for (a): it applies ADR-028 as accepted.
    Recommendation: **(a)**. Blocks items 3, 4 and 6 until ruled. Touches: `residencyArm.ts`,
    `App.tsx`'s gating, `check:dist-clean`, the E2E arm hook (stays dev-only), Part M.

51. **[RULED 2026-09-07, the human verbatim: "adopt as recommended, with the order binding and the
    branch named. (3) runs FIRST because its outcome decides what (1)/(2) may honestly say: if the
    shipped PROJJSON is numerically equivalent to the registry's 2056 entry, the attribution calls it
    EPSG data with the IOGP acknowledgement and terms URL; if it is NOT equivalent — hand-authored,
    PROJ-derived, or rounded — the terms' own modified-data clause forbids the plain attribution,
    and (1)/(2) instead state derivation/compatibility without EPSG's name on the values. This is
    "declared, never inferred" applied to licensing. For the comparison itself: I'll do the
    epsg.org lookup for 2056 myself and paste the parameter values [or: authorized — use projinfo
    EPSG:2056 -o PROJJSON with the PROJ version pinned and recorded in the check's own note; PROJ as
    a dev-machine verification tool is not a runtime dependency and doesn't touch ADR-026's no-PROJ
    posture]. Then (1)+(2) as one reviewer-gated piece, conscious hash update riding with it.
    Counsel per ADR-009's Caveat stays the bar for anything stronger than attribution. Not a blocker
    for anything else — the 1b close, the release work, and entry 40's window all proceed
    independently." Applied: (3) run by the custodian under the bracketed authorization (PROJ
    tooling, version pinned in the note, `DEPENDENCY-LICENSES.md`); then (1)+(2) as one gated piece
    whose wording follows (3)'s outcome. **Premise correction (2026-09-07, custodian):** the
    original entry's "(2) … changes `crs_catalog::tests`' pinned hash" was WRONG — the pinned
    `EPSG_2056_HASH` is `sha256_hex(&definition)` alone (`engine/src/crs_catalog.rs`), so a sibling
    `attribution` field cannot move it; the (1)+(2) piece adds the field beside the definition,
    leaves the definition bytes and the fixture untouched, and the pinned test proves the hash is
    unchanged. The "conscious hash update" the ruling rode on (2) is therefore not needed — reported
    here rather than left implied. **Rule 7 reached on the (1)+(2) piece (2026-09-07):** gate 1
    FAIL (an unnecessary `serde` edge — removed, lockfile back to parent; four should-fixes) → fix
    batch `d23f968` → gate 2 FAIL on ONE mechanical item: three line cites in the licensing record
    went stale when the serde removal shortened `crs_catalog.rs` (:44→:42, :79→:77, :253→:248);
    everything else affirmative (verbatim extraction, byte-identical NOTICE, tests bite, claims
    record-exact, suites green). The custodian swept the three numbers and the one nit (docs only,
    mechanically re-verified) and opened the PR; **a third reviewer pass is not dispatched without
    your word** — authorize it, or accept the sweep at the click. **RULED 2026-09-07, the human
    verbatim: "#29: sweep accepted, no third pass — I verified the three re-anchored cites against
    the branch and the empty lockfile diff myself. Clicking. Record the packaged-app notice channel
    as a named release-engineering item beside the ADR-020 fix."** Applied: the packaged shell
    app's EPSG/IOGP notice channel is now a named release-engineering item beside the ADR-020
    packaged-debug fail-closed fix (`NEXT-CUT.md`, "Ordering restated" — the release-engineering
    list; `DEPENDENCY-LICENSES.md`'s block already names it OWED). Original entry follows.]**
    **[EPSG terms check done (entry 49 F-16, `DEPENDENCY-LICENSES.md` "Third-party data terms"
    section, 2026-09-07): two obligations are open and one verification is owed before the shipped
    EPSG:2056 definition is attributed to EPSG — all three need code or a registry comparison, so
    none is done unqueued.]** The terms ("EPSG Dataset Terms of Use", revised 8 April 2016, read
    verbatim from epsg.org) require that *"Ownership of the EPSG Dataset by IOGP must be
    acknowledged in any publication or transmission (by whatever means) thereof"* and that *"You are
    obliged to inform anyone to whom you provide the EPSG Facilities of these Terms of Use"*; and
    they forbid attributing modified data beyond their Table 1. The definition ships compiled into
    the engine (`engine/src/crs-catalog.json`, hash-pinned) and is transmitted in every bundle
    manifest that carries a source definition (`kernel/src/bundle/mod.rs` `crs_source_definition`).
    Nothing in the tree acknowledges IOGP/EPSG today. **Rulings needed:** (1) add an EPSG/IOGP
    acknowledgement + the terms' URL to the shipped notice text (`publish.rs`'s `ViewerLicenseInput`
    / `NOTICE.txt` route, and the engine's own notice if one exists) — product code, reviewer-gated;
    (2) add an `attribution` field beside the catalog entry — changes `crs_catalog::tests`' pinned
    hash, so a conscious test update rides with it; (3) verify the PROJJSON's parameter values are
    numerically equivalent to the EPSG registry entry for 2056 (the production command is
    unrecorded; registry export needs a login — you hold one, or PROJ's `projinfo EPSG:2056 -o
    PROJJSON` on a known PROJ version is the reproducible check) BEFORE the attribution in (1)/(2)
    calls it EPSG data. Recommendation: (3) first (a five-minute comparison you can do), then (1)+(2)
    as one gated piece; counsel per ADR-009's Caveat before any stronger statement. Touches:
    `publish.rs` + tests, `crs-catalog.json` + `crs_catalog.rs` test literal, this record.

50. **[RULED 2026-09-07, the human verbatim: "(1) Ruled no — a guard precondition refusal with no
    harness process launched is the guard working, not a trial invalidation; §8's protection is
    about results seen, and none was. The one authorized launch stands. (2) Confirmed: the 07:34
    lock was me connecting via RustDesk from work — lock-on-disconnect, not a display-timeout
    policy. Launch rule: one declared window, coordinated — I will either disable
    lock-on-disconnect on the machine's RustDesk settings for the window, or unlock at home and
    stay off RustDesk; either way I message you "window open," you launch immediately, and the
    runner's new pre-arm lock check remains the final gate. I'll tell you which and when. (3)
    Pre-declared cap, binding: this is the pass's final attempt. Whatever happens — completion,
    refusal, any environmental failure — the pass ends with it; a failure records the null result
    and we move on. The structural answer already stands, this is demonstration-class evidence,
    and it has consumed enough gate cycles for one lifetime." Applied: PASS-PREREGISTRATION.md
    Amendment 4 (the cap + launch rule, binding); the custodian launches only on the human's
    "window open" message. Original entry follows.]**
    **[Entry-40 empirical pass: the authorized re-run was REFUSED by the guard's pre-trial check —
    session locked — before the harness launched; two failed launch attempts → rule-7 stop. Your
    classification and your word are needed before anything launches again.]** Attempt 1
    (05:09Z) was invalidated at the harness's own pre-flight by a harness path defect, not the
    instrument (`PASS-PREREGISTRATION.md` Amendment 2; the instrument had emitted 71 lines); the
    fix is reviewer-gated and open as **PR #26**. The authorized re-run (05:52Z, from that branch)
    armed the guard, stopped RustDesk, and was then refused by `check-display-session.ps1`:
    `sessionUnlocked:false, displayAwake:true` — `LogonUI.exe` had started at **05:34:23Z
    (07:34 local)**, ~10 min after the machine's last input, with the monitor timeout at 600 s and
    no screen-saver / inactivity-lock policy set; the runner disarmed cleanly (RustDesk restored,
    backstop gone), the harness never ran (Amendment 3 records it). **(1) Classification under
    Amendment 2 change 3** ("a second invalidation of any kind ends the pass with a null result"):
    does a guard precondition refusal with no harness process count? Recommendation: **no** — it is
    the protocol working, not a cell attempt; ONE launch stays authorized. **(2) The lock:** did you
    connect via RustDesk at ~07:34 local and lock on disconnect, or is this a display-off-driven lock
    (the timing matches the 600 s monitor timeout within seconds)? The answer sets the launch rule:
    (a) leave the session unlocked and tell me — I launch within the auto-lock window (the arm step
    then holds the display on for the run); or (b) if RustDesk locks on disconnect, disable that for
    the window. **(3) Or** end the pass with a null result (Amendment 2 §4 (D)-class) and take the
    structural answer only. Nothing launches without your word. Touches: one launch of the existing
    runner; results to the spike README; no code.

49. **[RULED 2026-09-07, the human verbatim: "F-3 = Url — the durable public location ADR-017 C3
    always wanted now exists; every future bundle names the real repo, and the false "not yet
    public" clause dies. F-11 = accept as public-by-design, no parameterisation — the names buy an
    attacker nothing without machine access (no credentials, no addresses are present), and
    obscuring tool names is indirection cosplaying as security; the real mitigations are RustDesk's
    own auth and the network posture. F-12(d) = generalise — the technical facts (fixture SPOF,
    regenerability) survive generalisation; my personal circumstances (no backup, on a phone,
    metered) were never load-bearing and don't need a public audience. Fix-forward set: approved as
    one commit, no rewrite — and F-16's EPSG look must leave a written record of the terms check
    (attribution/no-alteration conditions) beside DEPENDENCY-LICENSES or docs/14, not just a fixed
    comment, since crs-catalog.json is now a shipped, public, EPSG-derived artifact." Applied: F-3
    as a reviewer-gated piece (writer + tests) → **PR #27** (gate FAIL → fix → PASS; CI green);
    F-11 no change; F-12(d) generalised in place, dated; fix-forward set one commit (78f480b) with
    the EPSG terms record → entry 51. Original entry follows.]**
    **[Public-audience audit of the 2026-08-03→2026-09-07 window (`PUBLIC-AUDIENCE-AUDIT.md`,
    405 commits, HEAD 914ef9f): 0 leaks, 8 sensitivity-class matches, 7 hygiene — three need your
    ruling; one fix-forward set waits on your word; nothing remediated unqueued.]** No credential,
    no third-party personal data, no RustDesk ID/password/relay anywhere in tree or history
    (confirmed independently). **Rulings needed:** **(1) F-3** —
    `frontends/shell/src-tauri/src/publish.rs:810-817` writes *"…this repository is not yet
    public."* and a written-offer corresponding-source route into EVERY shell-published bundle's
    license notice (introduced `3bd479b`, 2026-08-16, thirteen days after the flip): switch to the
    `Url` kind naming the public repository, or keep `WrittenOffer` and drop the clause?
    (ADR-009-adjacent; writer + tests change together; ADR-017 now carries a dated corrigendum
    pointing here.) **(2) F-11** — the `rustdesk-guard` scripts and twelve notes files name the
    remote-access product, its service, the SYSTEM task `RustDeskRestoreBackstop`, and the
    unattended-operation pattern: accept as public-by-design process, or parameterise the names?
    **(3) F-12(d)** — keep or generalise the single-disk/no-backup sentence (`kernel/FIXTURES.md:74`,
    `DECISIONS-PENDING.md` entry-24(g)/-38 region) and the "metered connection"/"from a phone"
    operator notes? **Fix-forward on your word, no rewrite (red line):** **F-1/F-2** — the
    custodian's own `spikes/residency-debt-fix-live-probe/probe-thrash.mjs:5,9` carries
    `C:\Users\Christopher\.claude\jobs\…` and a `.claude/worktrees` import path — the first-ever hit
    in the username-path class both prior sweeps defined, committed 2026-09-06 by the custodian (a
    slip, named); relative paths + a PRE-PUBLIC-CHECKLIST §6 note for the history copy. **F-7/F-8** —
    neutral fixture/comment names in `kernel/src/permission/audit/reader.rs:331,334` and
    `frontends/shell/e2e/admission-remediation.mjs:245`. **F-16** — the EPSG/IOGP "one look" item
    now covers a shipped artifact (`engine/src/crs-catalog.json`). **Already done under the
    2026-09-07 sweep directive:** F-4/F-5/F-6 (ADR-017 corrigendum; `MACOS-BRINGUP.md:53`;
    `docs/README.md:27`'s tail) — `9527e42`. Recommendation: (1) the `Url` route to the public
    repository — the durable location ADR-017 C3 wanted now exists; (2) accept, optionally
    parameterise; (3) generalise the three sentences; fix-forward set: yes, one commit. Touches, once
    ruled: the files named; no ADR text edited; no history rewrite.

48. **[THIRD ATTEMPT AUTHORIZED 2026-09-07, the human verbatim: "third attempt AUTHORIZED, with
    three conditions. (1) The dated prereg amendment first, as you say it needs. (2) The gate must
    include the two tests the prior gates lacked: a tile batch landing between rounds with the
    pan-away release asserted (M1's blind spot), and the operator-Cancel self-cancel repro plus the
    generation-2/reissue window (M2's). The design is right because it derives protection from the
    batches actually admitted under INITIAL_TILE_KEY rather than from any terminal-time snapshot —
    so the tests must attack exactly the paths where snapshots died. (3) Rule 7, pre-declared: this
    is the final attempt. If it fails its gate, 48 converts to named binding debt on the ADR-011
    line, 1b closes without it, and my original close-ruling reason is recorded as overtaken by
    rule 7 — three failed attempts is the evidence that "small fix" was a misdiagnosis, and holding
    the cut hostage to it would repeat the sunk-cost shape I capped on entry 40." Applied:
    RESIDENCY-DEBT-1B.md dated sub-amendment (running-extent design, the two required test classes,
    the cap and its conversion consequence) BEFORE the worker; gate instructed on the two tests.
    **Outcome, 2026-09-07: the third attempt PASSED its gate** (7bb89d7 → one fix batch f2ae174 →
    affirmative re-review; T-A/T-B/T-C each proven to fail against the design it attacks, the
    reviewer reproducing every observation) — **PR #28** for your click. The rule-7 conversion is
    NOT triggered; your close ruling ("hold 1b — do the entry-48 (a) piece first") stands as ruled.
    **1b CLOSED 2026-09-07 on the zoom-out-only re-run** (L6 verbatim: *"L6 works properly now,
    nothing disappearing"*; session log: arm proven, zero first-look evictions) **and the human's
    L9, verbatim:** *"L9 overall it's better and feels better and less clunky now, reactive, non
    stuck, it feels actually way better"*. Rule-10 archive: `.cut-archive/CUT-STATE-residency-debt.md`.
    Original entry follows.]**
    **[The untiled first look is evicted wholesale on the first admission that needs room — the
    "already rendered content disappears ~10 s after zooming out" the human named in the post-fix
    L9; surfaced 2026-09-06; a design question, so recorded with options, not fixed.]** The
    human, verbatim (L6, post-fix): *"zoom out what was already rendered after 10 s disappear and
    some more tiles gets rendered"*; and in L9: *"we need to fix … the rendering when zooming out
    completely with tiles rendered that disappear etc"*. Mechanism, evidence-grounded: the live
    probe (`spikes/residency-debt-fix-live-probe/probe-thrash.json`) recorded exactly ONE eviction
    in its whole run — at t=43.5 s, right after the zoom-outs, admitting **8 rows** into tile
    `18:12` evicted `["initial-untiled-look"]`, resident features 19,090 → 9,090. `INITIAL_TILE_KEY`
    is not a grid key, so the geometric protected set (`viewportTileKeys`, grid keys only) never
    contains it and `planTileEviction` may evict it first; its content — the 10k-row first look,
    the very thing the operator was looking at — vanishes to admit a batch two orders of magnitude
    smaller, and at over-budget the tiles that would re-serve that area are then truncated. NOT the
    entry-44 cycling (that is gone — the probe shows 0 admitted-then-evicted, and the human reports
    the text arriving and no flicker), and NOT Amendment 1's withdrawn exception (grid tiles):
    Amendment 3's subject is unaffected. Options: (a) protect `INITIAL_TILE_KEY` while its union
    extent intersects the viewport — then at over-budget nothing can be evicted and the honest
    stable-partial state is "the first look plus whatever tiles fit", never a vanishing; (b)
    hand-off: evict the first look only once complete tiles cover its extent (its rows are then
    re-served, not lost) — correct but a new mechanism; (c) evict the first look progressively by
    tile region — it is one batch set, so this is (b) in disguise; (d) accept and document (the
    human has said fix). Recommendation: **(a)** as a small named piece — it reuses the protected-
    set seam F1 just made geometric (add the first look's extent as a protected pseudo-region),
    with one unit test (an over-budget admission at zoom-out never evicts `INITIAL_TILE_KEY`
    while its extent intersects the bbox) and the re-run's own L6 as the felt check. Whether it
    lands in 1b before the close or as named binding debt on the next cut is the human's call
    (below). Also recorded here because it bears on the LOD call: the same re-run's session log
    shows covering sets truncated by 15,810, 32,559 and **668,545** tiles beyond the 512 cap as
    the human zoomed out completely — the fine grid is unbounded, and each such plan distance-sorts
    hundreds of thousands of candidate cells on the client; no perf claim, a structural fact LOD
    (coarser levels at overview) is the cure for. Touches: `tileResidentSet.ts` `planTileEviction`
    / the protected-set input, `WorkingCanvas.tsx` `applyTileViewportContext`, one test.

    **The close question, for the human:** 1b's own ruling ("fix it and I re-do L5 to L9") is
    discharged — L2-L9 re-run, L9 "definitely better". Two items remain named in that L9: entry
    47 (already ruled: next cut) and this entry. Recommendation: **close 1b now** with 48 as named
    binding debt on the next cut beside 47 (the ADR-021-condition pattern — neither may be dropped
    from that cut's scope without comment), so the LOD call proceeds on the table as assembled;
    alternative: hold 1b open for a 48-(a) piece first (small, but another gate cycle and a third
    re-run). Also open: the L5 re-check (string 6 not seen — a 30 s wait after the fill stops, on
    the same build, settles whether it was timing).
    **RULED 2026-09-07, the human, verbatim:** *"close ruling: hold 1b — do the entry-48 (a) piece
    first (protect the untiled first look while its extent intersects the viewport; reuses F1's
    geometric protection, one unit test), reviewer-gated, then I re-run only the zoom-out steps to
    confirm the wholesale eviction is gone before L9 closes the cut. Reason on the record: entry 48
    is the evidence-grounded mechanism behind my own post-fix L9 residual ("tiles rendered that
    disappear"), and 1b's deliverable is a felt verdict that content is declared-partial, not
    vanishing — closing with it outstanding contradicts the cut's own purpose. Entry 47 stays
    next-cut."* Applied: 1b HELD; the piece is preregistered (`RESIDENCY-DEBT-1B.md`, sub-amendment
    of 2026-09-07, branch `cut/residency-debt-fix-48` @ d8f5fea) with a two-channel design —
    eviction-protected while its extent intersects the bbox, but NEVER in completeness or `fits`
    (a truncated first look would otherwise latch over-budget at the fit view and stall L5's fill);
    worker + reviewer gate; then the human's zoom-out-only re-run; then L9 closes, rule 10 archives.
    **Ordering restated by the human 2026-09-07 (verbatim):** *"48-(a) first, then release
    engineering (which owes the ADR-020 packaged-debug fix), LOD after."*
    **RULE-7 STOP, 2026-09-07 — two failed reviewer gates on the 48-(a) piece; a THIRD attempt needs
    the human's word.** Attempt 1 (543a5f2) FAILED: the predicate read `latestUnionedExtent`, which
    grid batches also feed, so release-on-pan-away was never implemented. Attempt 2 (48c19ea) fixed
    that (verified) but its own new code FAILED: the snapshot is taken at the untiled terminal under
    a "current" check that `cancelUntiledStream()` makes structurally false (it clears the handle
    before issuing the cancel), so a first look the operator's Cancel self-cancels is NEVER
    snapshotted and NEVER protected for that generation — proven by the reviewer's probe; violates
    the sub-amendment's clause 3 verbatim. The reviewer also classified the generation-2+ window
    (gridFrame survives `clearAll()`, so a plan can land a grid batch before the new first look
    terminates): real; and a THIRD consequence of the same design — such a batch taints the snapshot
    (M1 one generation later). **One design change closes all three, the reviewer's
    recommendation and the custodian's:** stop snapshotting at the terminal; keep a first-look-ONLY
    running extent unioned from each first-look batch's own extent (`ingestTileBatch` already
    computes `extentOfBatch(batch)`, `tileIngest.ts:158` — expose it on the ingest outcome and union
    it session-side inside the existing `if (tileKey === INITIAL_TILE_KEY)` branch). Protection is
    then live from the first first-look batch (no window), never sees a grid extent (no taint), and
    is independent of how the stream ended (no M2). Cost: one outcome field, two doc comments, one
    `tileIngest` test, plus the reviewer's probe as the M2 regression test. This is a DEPARTURE from
    the preregistered design (the sub-amendment named `latestUnionedExtent` as the extent) and so
    gets a dated preregistration amendment before code — on the human's authorization of the third
    attempt. Alternative (weaker): snapshot inside `cancelUntiledStream()` + protect unconditionally
    while the untiled stream is running; leaves the taint, declarable. **Recommendation: authorize
    the third attempt with the running-extent design.** Nothing dispatched until then.

47. **[K6's escape hatch, re-asked by the human's own L8 verdict — and a pick-accuracy
    observation beside it; surfaced 2026-09-06 at the Part L sitting, candidate arm verified.]**
    The human, verbatim: *"L8 seems a bit cluncky, like i zoom out and shows the ids of nearby
    features but not the one I'm hovering even though is not subpixel and to get back to the id i
    have to go to another feature and come back."* Two things. (1) The clear-then-fresh-hover
    behavior on a camera change is Item C's own shipped design (`pickResolution.ts`
    `reevaluateStandingHoverOnCameraChange`: a standing id can no longer be confirmed under the
    pointer without a GPU re-pick, so it clears — the "honest minimum"; a re-pick was the escape
    hatch the piece's preregistration named and held). The human's felt answer is "clunky".
    Options: (a) keep clear-then-hover (as shipped); (b) re-pick on camera settle when a readout
    was standing (one GPU pick per camera-change settle, not per frame — ADR-010 rule 6's
    "declared, not discovered" still holds if the re-pick is declared as such); (c) re-pick only
    when the pointer is over the canvas and the zoom crossed the threshold in the sub-pixel→
    resolvable direction. Recommendation: **(b)**, as a small named piece on the next cut, not
    this close-out (it is not a 1b deviation; it is the human's verdict on a design the cut shipped
    as intended). (2) "shows the ids of nearby features but not the one I'm hovering even though
    is not subpixel" — a pick-accuracy observation at zoom-out, possibly the pick radius or the
    offset-frame hit-test near the threshold; NOT investigated, recorded verbatim for a future
    piece's own repro. Touches: `WorkingCanvas.tsx` hover/pick, `pickResolution.ts`.
    **RULED 2026-09-06, the human, verbatim:** *"Entry 47 = (b), re-pick on camera settle, as its
    own named piece on the NEXT cut — not this close-out; the pick-accuracy half stays recorded
    verbatim for that piece's repro, undiagnosed."* Applied: queued in NEXT-CUT.md as a named
    piece for the next cut; nothing touched now.
    **Criterion sharpened by the human at the 2026-09-07 zoom-out re-run (48-(a) build), verbatim:**
    *"One thing have not been fixed though. Once i zoom in to a feature and hover over one, even if
    the feature is as big as the screen whole itself, if i zoom out by just one step, so the feature
    is still big AF, the id status text disappear. Now this is wrong, as long as I can tell on which
    feature I'm hovering, there's no reasono to remove the id."* Not a regression and not a 1b
    deviation: it is the same shipped design this entry records (`pickResolution.ts`
    `reevaluateStandingHoverOnCameraChange` clears a standing id on ANY camera change because it
    cannot be confirmed without a GPU re-pick), ruled (b) to the next cut. Binding design input for
    (b), from these words: the acceptance criterion is "the id stays for as long as the operator can
    tell which feature is under the pointer" — a feature still resolvable under the stationary pointer
    after a zoom step keeps its id (re-picked on settle, or kept when the same feature is confirmed
    under the pointer); only a genuine below-pick-resolution state may replace it with the refusal
    text; a screen-sized feature losing its id on a one-step zoom-out is the failing case the piece
    must pin with a test.

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

45. **[The close-out fix piece's SIGHT BUNDLE — three items the human rules at PR sight, none the
    custodian's; opened 2026-09-06 with the piece (branch `cut/residency-debt-fix`, preregistered
    in `RESIDENCY-DEBT-1B.md`'s final section per the architect consult, pass with notes).]**
    (1) **String 6, the settled-partial-within-budget voice** (entry 43's remedy), shipped as a
    DRAFT: *"Filling has finished for this view — some areas were not loaded; pan or zoom to load
    them."* — deliberately direction-free, because the state has two causes and only one of them
    (truncation, farthest-first) could honestly say "farthest from centre"; the never-completed-tile
    cause was requested in row-major order and cannot. Option B if you want the distinction said
    when true: two strings gated on `lastCoveringTruncated`. Recommendation: A, as shipped.
    (2) **ADR-028 Amendment 3** — the reopen record: drafted as a PROPOSED file beside the ADR
    (rides the PR), withdrawing Amendment 1's exception 2 (partial covering tiles during
    over-budget) only, keeping exception 1 (the dedupe-owner cascade), replacing it with geometric
    protection, and carrying a clause 5 you must rule because Amendment 1 said its own
    consequences did not attach "because the resolution is declaration, not fix" — this IS a fix:
    proposed stance, the gate-8 ruling stands on its own commits, no re-measure is owed now, any
    future cross-commit arm comparison must declare the eviction-policy change. Appended only on
    your word. (3) **The declared absorbing state**, acknowledged as intended: with in-view partials
    unevictable, an over-budget view has no pressure valve — the declared partial view plus its
    persistent status (stalled or settled-partial, alternatives) IS the answer, and the exit is
    the pan/zoom string 4 already names; the L2-L9 re-run watches it (Amendment 2 reopen
    conditions (1)/(3)). Also for the record: the piece attaches NO perf claim in either direction
    (F1 keeps the resident set nearer the ceiling at over-budget zoom-out, G4's own axis) — the
    re-run is felt, never a G4 re-measure.
    **RULED 2026-09-06, the human, verbatim:** *"Entry 45: (1) String 6 = A, direction-free as
    shipped; (2) Amendment 3 = APPEND, clause 5 ruled — this is a fix, recorded as such: proposed
    stance, gate-8 ruling stands on its existing commits, no re-measure owed now, but any future
    cross-commit arm comparison must declare the eviction-policy change; (3) absorbing state
    accepted as intended designed behavior."* Sequencing, verbatim: *"Amendment 3 appends only
    after my L9."* Applied: string 6 stands as shipped; on the L9 re-verdict the custodian appends
    the PROPOSED Amendment 3 to ADR-028 with clause 5 in its ruled form and deletes the PROPOSED
    file in the same commit; the absorbing state is declared behavior (never a reopen by itself).

44. **[ADR-028 Amendment 1's REOPEN CONDITION MET — observed felt by the human at the Part L
    sitting, 2026-09-06. The reopen was the human's own 2026-09-03 ruling (entry 27 (i)); the
    trigger has fired, so this entry records it and puts the reopening to the human — a red line
    (an Accepted ADR's declared behavior), not the custodian's call.]** The human, verbatim: *"If
    i zoom out at a certain point it stop, so you get what it did render till that point, and then
    you see that he's rendering tiles for half a second, then they disappear, and a new one appear
    and then disappear, constantly and then the last one rendered in the north, left corner and
    stayed there."* Candidate arm, `fine`, polygons-100k, zoomed out past budget. Entry 27's
    reopen condition (NEXT-CUT.md's own restatement): *"visible in-viewport holes attributable to
    partial-covering eviction reopen it as a defect."* Mechanism, code-grounded by 1a Q2 and this
    sitting's trace: over budget, each admission evicts to make room; a just-admitted, budget-trimmed
    tile is durably `partial`, and a partial in-viewport tile is absent from the protected set
    (`tileResidentSet.ts:461` filters only `viewportTileKeys`; partial/skipped candidates fall out
    of that set — 1a Q2), so the NEXT admission evicts it: admit → evict → admit → evict, exactly
    the "appear for half a second, disappear, a new one appears" cycle the human saw, ending with
    the last-admitted tile standing. 1a's own "thrash half — bounded, not measured" is now
    measured by a human eye: it reads as constant flicker, not incremental fill. The session log
    of that window (15:07-15:13) shows the other half of the mechanism: every zoom-out re-plan
    truncated the covering set by 865 to 5,758 tiles beyond the 512 cap while 1,999 tile terminals
    landed — the fill was re-requesting, admitting, and evicting in a loop that could never
    converge at that zoom. Recommendation:
    **REOPEN finding 3 as a defect** (per the ruling's own condition) and scope the fix on the
    ADR-011 tiling/LOD line the next cut opens — the protected-set gap is the code seam (1a's Q2
    signposts: `tileViewportStreamManager.ts` `onCameraChange`'s protected-set construction,
    `candidateArmSession.ts` `applyTileViewportContext`, `tileResidentSet.ts` `planTileEviction`),
    and the structural cure for overview zoom is LOD (P1/P2), which the same call decides. Touches:
    ADR-028 (Amendment 3, the reopen record, on the human's word), the next cut's scope.
    **RULED 2026-09-06, the human, verbatim:** *"I'd love to give you a L9 when the candidate arm
    actually works properly, but since it started deviating in L5, we either fix it and I re-do L5
    to L9, otherwise is pointless."* Applied: finding 3 is REOPENED as a defect and the fix is
    scoped as a 1b close-out piece (not deferred to the LOD cut): the thrash (this entry) and the
    silent truncated settle (entry 43) are fixed and reviewer-gated, an E2E step pins "no
    in-viewport tile is evicted while it is in view", and Part L's L5-L9 are re-run by the human on
    the fixed build under a verified arm before any L9 verdict. Entry 42 (the extent-fitting Zoom
    to layer) is a protocol change and stays on the LOD/producer line unless the human pulls it in.
    The ADR-028 Amendment 3 text (the reopen + the withdrawn exception) is drafted for the human's
    sight with the piece — never appended by the custodian.

43. **[Within-budget fills that settle TRUNCATED or with a never-completed covering tile are
    SILENT by design — surfaced 2026-09-06 at the Part L sitting; contradicts entry 36's own rule,
    so recorded for the human, not patched.]** The human's observation, verbatim: *"when i just
    press zoom to layer it blocks rendering after few seconds (eventhough there's still space in
    the canvas), no status appear."* The code's own words (`candidateArmSession.ts:693-696`,
    verbatim): *"`settled === "settled-partial"` here (not over budget, but a truncated covering
    set or a covering tile that never completed, and no failure recorded) is deliberately left
    silent, same as `isFillComplete() === false` always has been -- see this function's own
    "absence is honest" doc comment above; this piece adds no new status kind for that specific
    combination."* Entry 36's ruling, verbatim from the human: *"silence and staleness never
    represent state."* The combination is reachable on an ordinary zoom-to-layer at `fine`
    (covering sets beyond `MAX_QUEUED_TILES` = 512 truncate farthest-first, `tileGridConstants.ts:54`;
    the truncation is logged via `logSessionEvent("candidate-covering-truncated", …)` — the
    sitting's own session log records it: *"covering set truncated by 129 tile(s) beyond
    MAX_QUEUED_TILES"* at 13:52:05 on the very first candidate zoom-to-layer, and 865-5,758 per
    re-plan at zoom-out — but a session-log line is not operator-facing during a sitting, so the
    operator sees silence). Recommendation: a sixth status string for
    the 24(b) sight — within budget, settled, incomplete-by-truncation — in the settled-partial
    register ("Filling has finished for this view — areas farthest from centre were not requested
    this round; pan or zoom to load them."), drafted for the human's wording, plus the truncation
    count surfaced to the console/session log sink that actually works. Touches:
    `residencyStatus.ts` (a `settled: "partial"` variant on `candidate-within-budget`),
    `candidateArmSession.ts:693` (emit instead of return), one unit test per BS6.

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

41. **[The remediation identity gap, surfaced 2026-09-06 implementing the entry-39 (a) ruling —
    gates PR #22 going green; needs one word from the human.]** Executing "teach dco.yml the
    remediation convention": the workflow is implemented and proven in both directions exactly as
    ruled (fence-still-fences negative, same-author-remediation positive, third-party/unsigned/
    short-sha all rejected — test matrix in the harness at the job tmp, results in the entry-39
    record). But the ruled positive case "3e653f0 turns green via 536ceb9" is FALSE on the facts:
    `3e653f0` was authored **`Christopher Donini <donini.christopher@gmail.com>`** (the revert ran
    without the identity flags — the same slip that dropped its `-s`), while `536ceb9` is authored
    `chris <chrys92d@gmail.com>`. Under the human's own condition (iii) — same author identity,
    no third-party remediation — `536ceb9` cannot remediate it, and the real-range run proves it
    (26 checked, exactly `3e653f0` failed). The custodian will not author a DCO affirmation in the
    human's name under an identity the human has not dictated it for, and will not weaken (iii) to
    an alias list (the workflow's own header argues against allowlists). **Recommendation (a): the
    human authorizes ONE remediation commit authored `Christopher Donini
    <donini.christopher@gmail.com>` (3e653f0's own author identity), standard format —**
    subject `DCO Remediation Commit for Christopher Donini <donini.christopher@gmail.com>`, body
    `I, Christopher Donini <donini.christopher@gmail.com>, hereby add my Signed-off-by to commit:
    3e653f08eafbeca08c2483b68da5eafaeda9eeb4` **— on the human's word, the custodian commits it
    (a one-off exception to the standing chris-identity rule, this commit only); the standing rule
    stays for everything else.** Alternatives: (b) widen (iii) with an identity-alias mapping —
    rejected-shaped (a list to maintain, the exact hole the workflow refuses); (c) fall back to
    unticking the required check. The workflow change itself is reviewer-gated and held locally,
    UNPUSHED, until this resolves — pushed alone it re-runs red and changes nothing.
    **Two disclosures from the reviewer gate (FAILED 3-must-fix → fixes → re-review), for the
    same sight:** (1) the reviewer proved an `--author`-spoof hole (a remediation authored-as the
    victim but signed only by somebody else went green); the fix tightens (iii) so the
    remediation's OWN `Signed-off-by` must also name the remediated author's identity. This is
    one string-check beyond the ruling's literal (i)+(iii), taken as the mechanization of the
    ruling's own "individual remediation only — no third-party remediation" words; say so if you
    want it looser. (2) The dcoapp convention's sentence reads "…to THIS commit:"; ours (your
    dictated wording, already in-history at 536ceb9) reads "…to commit:". The check accepts ONLY
    the ruled wording; a wrong-wording attempt now gets a named near-miss diagnostic instead of
    silence. Recommendation: keep exact-as-ruled; widen to accept both only on your word.
    **RULED 2026-09-06, the human, verbatim:** *"Entry 41 authorized. Author the remediation
    commit as Christopher Donini donini.christopher@gmail.com — both identities are mine per
    entry 14, and I dictate this affirmation under that one."* — exact form dictated (subject,
    body line with the full sha, Signed-off-by trailer, committed with
    `-c user.name="Christopher Donini" -c user.email=donini.christopher@gmail.com` and `-s`).
    With it, two ratifications, verbatim: (1) *"the reviewer's spoof-fix strengthening — the
    remediation's own Signed-off-by must name the remediated author — is RATIFIED as the correct
    mechanization of my 'no third-party remediation'"*; (2) *"on wording: WIDEN to accept both
    'to commit:' and the dcoapp-standard 'to this commit:' — future external contributors will
    follow the published convention verbatim, and a gate that rejects the ecosystem's own
    standard wording over a missing 'this' would be pedantry, not protection; 536ceb9's
    in-history form stays valid."* Applied same day: wording widened in dco.yml + CONTRIBUTING
    (matrix case T11 proves it), the remediation commit authored as dictated, everything pushed.
    cut's code; recorded so it is not lost, not decided here.]** On the disk-freed re-run, data
    flowed (fit 22 batches, pan-east 222) but the trial invalidated at `pan-east`: after 222
    batches, **one tile stream (43 issued, 42 ended) never terminated** and the console went
    silent 5 s+, running 204 s before the settle watchdog refused it. The watchdog reads the
    manager's own in-flight count (E2E hook, `queueDepthSampleErrors: 0`), so it is a **genuine
    non-terminating tile stream, not an instrument leak**. Cancel was never pressed, so 1b's
    Items A/B/C are dormant — this is **producer/transport-side**, the 5 GB time-to-data wall in
    its sharpest form (a tile stream that HANGS rather than merely running slow). Full write-up:
    `frontends/shell/RESULTS.md`'s trial-refinement section. Recommendation: **route to the
    producer-side / LOD line** (the cut's own #28 attribution already sited the 5 GB wall
    producer-side) as its own investigation — is the hang a producer bug (a query that never
    returns for one tile) or a transport drop (a WS stream that stalls)? Needs an instrumented
    producer-side pass, not a client re-run. **Consequence for the 5 GB trial:** the empirical
    per-stream-join / nulls demonstration cannot complete on the current 5 GB producer regardless
    of disk; the structural answer (ATTRIBUTION-PASS.md §7) stands. Not a blocker for 1b (the
    trial was always a demonstration). Touches, if pursued: producer/engine + transport
    instrumentation — a scoped diagnosis, its own piece.
    **RULED 2026-09-06 (the human's takeover message, verbatim: "entries 38/39/40 ruled
    (defer-with-trigger / no-rewrite entry-26-style / routed to producer diagnosis)"):**
    this entry's ruling is "routed to producer diagnosis" — the recommendation adopted: the hang
    goes to a producer-side instrumented diagnosis as its own piece on the producer/LOD line,
    not a client re-run. Not scheduled by this ruling; scoping rides the LOD/next-cut call.
    **Diagnosis RETURNED 2026-09-06** (`spikes/entry40-producer-hang-diagnosis/README.md`: rank-1
    producer-query-hang; the instrumented pass designed, not run). **RULED 2026-09-07, the human,
    verbatim:** *"dispatch entry 40's empirical producer pass now, independently under the 24(g)
    guard — it gates nothing and informs P1's later risk."* Applied: its own track — the pass is
    preregistered (`spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md`), its one
    load-bearing instrument (a periodic lease-count poll into the session log) and the
    let-it-run-past-the-watchdog harness flag are a small reviewer-gated piece, then ONE unattended
    reported-only 5 GB run under the rustdesk-guard protocol when the machine is free of the human's
    sitting; results to a new dated section of the spike README, never a docs/08 row.

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

38. **[Fixture relocation scope, surfaced 2026-09-06 executing the disk directive — the mechanical
    move the instruction implied is a 40+-file refactor; the goal is already met more cheaply, so
    put to the human.]** The directive was "relocate fixtures out of `target/` to a stable
    gitignored path... so no future clean can eat them." Executing it, the ref surface proved to
    be **hardcoded paths across 40+ files** — every kernel/engine test that generates or reads a
    fixture, the e2e harness, AND append-only preregistration records that document where a fixture
    WAS at campaign time (rewriting those would falsify provenance). There is no shared
    base-path helper (`scale_pass.rs` joins `target/slice-evidence/scale-pass`,
    `manual_walkthrough_fixtures.rs` joins `../target/fixtures/manual-walkthrough`, e2e hardcodes
    absolute paths), and the 5 GB fixture shares its directory with ~13 k campaign-evidence files
    written by the SAME generator, so the fixture and evidence outputs are entangled. **The stated
    GOAL — "no future clean can eat them" — is now achieved WITHOUT the refactor**: the
    clean-discipline mechanic added to AI_DEVELOPMENT.md (never wholesale-clean `target/`; reclaim
    surgically) protects ALL the data, and the disk was freed that way today (data untouched).
    Recommendation: **treat the full relocation as optional** given the mechanic; if you still want
    fixtures physically out of `target/`, the clean way is a scoped refactor introducing a single
    `FIXTURES_ROOT` env/const (default outside `target/`) that live code reads and generators write
    to — a bounded change, done deliberately, leaving append-only records as historical. Your call:
    accept the mechanic as sufficient, or authorize the `FIXTURES_ROOT` refactor as its own piece.
    (Also recorded: the 5 GB fixture's SECOND-PHYSICAL-LOCATION copy remains blocked — no second
    physical location is available on this machine *(wording generalised 2026-09-07 per entry 49
    F-12(d))*; the SPOF's DR story stays its deterministic regenerability until one is.)
    **RULED 2026-09-06 (the human's takeover message, verbatim: "entries 38/39/40 ruled
    (defer-with-trigger / no-rewrite entry-26-style / routed to producer diagnosis)"):**
    this entry's ruling is "defer-with-trigger" — the clean-discipline mechanic is accepted as
    sufficient; the FIXTURES_ROOT refactor is deferred, its trigger standing: it opens as its own
    scoped piece only if the human later wants fixtures physically out of `target/`.

37. **[APPLIED 2026-09-05 — the conditional approval's cure executed. The flag was delivered
    (draft lacked reopen conditions; #36 was about to change the described behavior); the
    #35/#36 piece then landed (@ 1824c8f) and ADR-028 Amendment 2 was appended in its cured
    form: every clause verified against the shipped code, the three drafted reopeners carried
    (their exact wording, like all strings, remains the human's at PR sight), the entry-35/36
    resolutions reflected. The append executes the human's own "append; approved provided..."
    ruling with both provisos now satisfied — flagged first, appended after the cure, exactly as
    the proviso required. Original entry below, kept for the record.]**
    **[ADR-028 Amendment 2 — the scoped-relief + quiescence contract, DRAFTED for your approval
    (ADR amendments are a red line; nothing is appended until you rule). Also your choice:
    append as ADR-028 Amendment 2, or file as a small child ADR cross-referencing ADR-028.]**
    The draft, from the architect's consult skeleton updated to the as-built, ruled shape:
    ---
    **Amendment 2 — Scoped residency relief and the quiescence signal (2026-09-0X, appended —
    Accepted; discharges the 1b principle-7/8 debt).**
    *Context.* ADR-028 delivered viewport-bounded residency and the over-budget partial-view
    contract but left the held-queue disposition (docs/01 principle 7) and an affirmative
    settled-partial declaration (principle 8) as named 1b debt. The only cancel lever was a
    permanent kill switch; no client signal distinguished actively-filling from
    queued-and-stalled or settled-partial.
    *Decision.* (a) Per decisions 32a/33b: the operator Cancel repoints to a scoped-relief lever
    (`TileViewportStreamManager.relinquishOutstanding`) that cancels every in-flight tile stream
    (the existing `cancel` SKP command, ADR-018 — no new wire) AND drops the queued backlog,
    reporting each affected tile distinctly (relinquish-cancelled vs relinquish-dropped, distinct
    from supersede and budget self-cancel); it never sets `stopped`, never clears residency,
    never resets the grid frame — future planning is unaffected; the permanent kill is
    teardown-only. Cancellation is asserted as a property (ADR-018 instants), never timed.
    (b) A residency-quiescence signal, pure functions of client-observable session state
    (`fillActivity`: stalled iff queuedCount>0 && overBudget && !hasHeadroom; `settledState`:
    settled iff hasPlanned && no pending re-plan && trackedTileCount===0 && the untiled
    first-look/reissue stream is not running — classified settled-complete/settled-partial
    against the fill-completeness predicate), surfaced through the existing status union — no
    new SKP field (ADR-004 Amendment 4), no producer scan-progress dependency.
    (c) A user-stopped fill can never read complete until a new plan runs (the relinquish latch),
    and no completeness claim is emitted while any covering-tile stream or the untiled stream is
    outstanding, or a re-plan is pending, or a covering tile's stream failed without a fresh plan
    (the 1b reviewer-gate strengthenings).
    *Consequences.* Discharges ADR-028's 1b principle-7/8 debt; ADR-006 class-1/derived-state
    only; no wire change (ADR-010 rule 1 untouched); status wording is the human's per 24(b);
    the untiled-stream Cancel scope (entry 35) and the within-budget-truncated staleness (entry
    36) remain open, named, not silently absorbed.
    ---
    Recommendation: **append as ADR-028 Amendment 2** (the contract is ADR-028's own debt coming
    home; a child ADR would split one contract across two files). Touches, once approved:
    ADR-028 (append the text above, with your date and any edits), nothing else.

36. **[RESOLVED 2026-09-05 — human, verbatim: "one rule for all three — silence and staleness
    never represent state: the stale all-N clears on the invalidating gesture (entry-1's
    query-issued transition), failed terminals feed the typed partiality accounting; draft to
    that, wording at PR sight." Consequences, implemented in the #35/#36 piece: (i) a plan whose
    covering set invalidates a standing within-budget claim clears/updates it through the
    entry-1 transition class, never leaving "Showing all N" by inertia; (ii) a non-Completed
    tile terminal records typed failure-partiality the settled classification consults — the
    fill reads settled-partial-with-failure honestly instead of B1's silence; (iii) the untiled
    sink's failed terminal is logged and feeds the same accounting. All wording drafts to the
    human at PR sight. Original entry below.]**
    **[Wording/status-kind gap, surfaced 2026-09-05 by Item B's reviewer gate (off-scope note b)
    — 24(b) territory, NOT decided inline.]** The settled-partial signal extends only the two
    existing status kinds (over-budget, within-budget), so a **within-budget-but-truncated/
    partial** settled state stays silent — and the real risk the reviewer named is not the
    silence but the STALE PRIOR STATUS: a previous "Showing all N features in view" stays
    rendered when a pan makes the new covering set truncated/incomplete, because the status only
    clears on query-issued/dataset-changed/delivery-complete. The twice-convicted "Showing all N"
    class surviving by inertia. Fixing needs a new status kind + wording — the human's per 24(b).
    *(Widened 2026-09-05, Item B's third review pass — two more named silent states, same
    operator-gets-no-reading family, one ruling can cover all three: (ii) after a genuine tile
    failure with no further camera change, the fill is quiescent but never says so — the B1 latch
    correctly blocks the false "Showing all N", leaving honest silence over an updated reading;
    (iii) a failed UNTILED first-look/reissue terminal is fully silent — its sink discards the
    terminal kind, unlogged, indistinguishable from success at that site.)* Recommendation: rule
    it with the 24(b) string sight for this cut (a fourth status wording),
    or defer it explicitly to the next status-touching cut with the inertia risk named. Touches,
    once ruled: `residencyStatus.ts`'s union/clear rules + a draft string on sight; (iii) also
    the untiled sink's `onTerminal` (a log line at minimum).

35. **[RESOLVED 2026-09-05 — human: "accept as recommended — yes with grid frame, no at
    bootstrap; then re-check whether string 3's state is still reachable." Consequence:
    `relinquishFill` also cancels the untiled first-look/reissue stream WHEN `manager.frame`
    exists (the anchor hazard only lives in the frameless bootstrap window, which stays
    uncancellable and documented); the string-3 reachability re-check rides the implementing
    piece — expected residual: only the frameless window (bootstrap, or an Apply/Clear reissue
    racing the first look's own terminal), with the string reworded accordingly and STICKY per
    entry-1 (persists until a query-issued-class transition clears it, never replaced by a later
    batch emission). Original entry below.]**
    **[Rule-7 item, surfaced 2026-09-05 by Item A's reviewer gate (M1) — NOT decided inline.]**
    Entry 32 ruled Cancel repoints to the scoped relief of THE TILE FILL; it never named the
    **untiled first-look/reissue stream** (`candidateArmSession.ts`'s `untiledStreamHandle` — the
    dataset-open bootstrap and every Apply/Clear reissue), which the old Cancel path also never
    cancelled (a deliberate, documented boundary the old comment named and the new code initially
    dropped). The reviewer's reachable repro: during an Apply/Clear reissue, Cancel relinquished
    nothing visible and the status claimed "filling stopped" while batches kept landing — fixed
    now to be honest within the ruled scope (see the M1 fix), but the SCOPE question remains
    genuinely open: **should Cancel also cancel the untiled stream?** The hazard: the untiled
    terminal is where the tile grid frame is anchored (`establishFrameFromExtent` on the unioned
    extent), so cancelling the bootstrap-time first look would freeze the grid on a truncated
    union. Recommendation: **(b-shaped)** — cancel the untiled stream too WHEN a grid frame
    already exists (the Apply/Clear reissue case, where your "Cancel meaning cancel" rationale
    applies with full force and no anchor hazard), keep the bootstrap-time first look
    uncancellable with the boundary documented and the status honest about it. Touches, if
    ruled: `candidateArmSession.ts`'s `relinquishFill` + the untiled-stream lifecycle + the
    relinquished status wording (24(b) sight).

34. **[RULED 2026-09-06 at sitting scheduling — the human, verbatim: "34c: correctness-only,
    confirmed at the sitting's start per the recorded lean." The sitting (Part L) is
    correctness/felt only: no scored cell, no heap fold-in (entry 25 rides the next
    intrinsically-scored campaign, unchanged), the 5 GB trial not adopted (deferred behind
    entry 40 regardless). Prior deferral record kept below.]**
    **[DEFERRED BY RULING 2026-09-05 — human: "34c — decide at the sitting's scheduling, leaning
    (a): 1b makes no perf claim, and entry 25's heap debt rides the next intrinsically-scored
    campaign instead." Stays open until the sitting is scheduled; the lean toward
    correctness-only is recorded, not yet binding. Original entry below.]**
    **[1b headed-sitting scope, surfaced 2026-09-04 by the architect consult (Q6.4) — not
    decided here, lower urgency than 32/33.]** Whether the headed sitting that closes 1b also runs
    a **scored campaign** (which would adopt the queued 5 GB clean-instrument attribution trial,
    the heap-footprint fold-in per entry 25, and the DECISIONS-PENDING #31 instrument defects) or
    stays a correctness-verification sitting only (felt re-verdict + K6's E2E + the 5 GB trial as
    a demonstration, not a scored gate). The architect: a scored campaign is **not compelled** by
    1b's correctness fixes — none touches the hot admission/paint path. Measurement on this
    machine is 24(g) headed-only either way. Recommendation: **decide at the sitting's own
    scheduling, not now** — it does not gate any 1b code. Touches: the sitting's own agenda only.

33. **[RESOLVED 2026-09-05 — human, verbatim: "33b — cancel in-flight too, via the existing SKP
    cancel: at 5 GB single streams run tens of seconds, so (a)'s 'settles within seconds' premise
    fails exactly where the button matters most, and my own Part K verdict was about buttons that
    don't visibly obey; ≤3 tiles of class-1 replayable work is the acceptable price for Cancel
    meaning cancel. Rider: asserted as a property with ADR-018 instants, never timed." The
    custodian's drop-queue-only recommendation was thereby overruled on the attribution pass's
    own 6-17s per-tile service evidence. Consequence: `relinquishOutstanding()` cancels in-flight
    streams (existing `cancel` SKP command, ADR-018 — no new wire) AND drops the queued backlog;
    its tests assert cancellation as a PROPERTY (cancel issued, terminal observed, no post-cancel
    batches; ADR-018 interval labels where an interval is even mentioned) — never a timed claim.
    Original entry below, kept for the record.]**
    **[1b Item A red line, surfaced 2026-09-04 by the architect consult (Q6.2) — GATES Item A/B
    code, not decided here.]** The scoped-relief lever's depth: does it cancel in-flight tile
    streams too (via the existing `cancel` SKP command, ADR-018 — no new wire), or only drop the
    queued backlog and let in-flight streams finish productively? Both are honest and both
    client-side. The choice changes the settled/relinquished status wording and what "stop
    filling" means to the operator. Recommendation: **your call, no default assumed** — lean
    toward drop-queue-only (in-flight work already paid its query cost; letting it finish wastes
    less), but the felt meaning of the Cancel affordance (entry 32) is coupled to this, so rule
    them together. Touches, once ruled: `tileViewportStreamManager.ts`'s new `relinquishOutstanding`
    method + `candidateArmSession.ts`'s session seam + the status wording.

32. **[RESOLVED 2026-09-05 — human, verbatim: "32a — Cancel becomes the scoped relief, permanent
    kill leaves the UI (close/reopen stays the hard reset); rider: post-relief status states the
    partiality per the 24(b) discipline, a user-stopped fill never reads as complete."
    Consequence: `App.tsx`'s candidate Cancel repoints from `manager.stop()` to the new scoped
    seam; the relinquished status carries the partial-view statement (never "complete", never
    silence); exact strings on sight at the implementing PR (24(b)). `stop()` itself remains for
    teardown paths only, no longer operator-reachable. Original entry below, kept for the
    record.]**
    **[1b Item A red line, surfaced 2026-09-04 by the architect consult (Q6.1) — GATES Item A/B
    code, not decided here.]** Cancel semantics, an operator-facing behavior change: today the
    Cancel button kills tiling for the dataset permanently (`TileViewportStreamManager.stop()`
    sets `stopped=true` with no reset; App.tsx:1233-1236). Item A needs a scoped lever that stops
    filling but keeps the current view and allows future tiling. Does the existing Cancel button
    get **repointed** to that scoped meaning, or does a **second affordance** get added (Cancel
    stays a hard stop; a new control does the scoped relief)? The architect: "a felt/UX judgment,
    not an architecture call." Recommendation: **your call, no default assumed** — repointing is
    simpler and the hard-stop-per-dataset meaning has no evidenced operator need, but this is
    exactly the felt call 24(b)-class decisions reserve to you. Rule with entry 33 (coupled).
    Touches, once ruled: `App.tsx`'s candidate Cancel wiring + any new control's own affordance.

31. **[RESOLVED 2026-09-03 — human's placement ruling: "the #28 attribution pass IS the next
    instrument-touching work, and its conclusion is exactly what cross-step paint mislabels
    corrupt; fix the three instrument defects first, then run the attribution on the clean
    instrument, and note whether the null queryToFirstByteMs values were themselves a symptom."
    Applied in this same branch: fixes 1-2 in `residencyInstrument.ts` (clamp `<= 0` for
    `queryToFirstByteMs` only, new distinct reason `issue-arrival-same-quantum` — renamed from
    the first draft's `cross-step-stream-zero` at the re-review's suggestion, mechanism-true;
    `decodedToPaintedMs` nulled iff the issue record postdates the decode record, per the
    re-review's corrected predicate; `firstByteToDecodedMs` deliberately kept — a real decode
    cost, and 0 is legitimate there), fix 3 as the pass's harness-only design (`wireTraceLines`
    always persisted at write time; `--per-stream-trace` opt-in queue-depth sampler, declared in
    `cell.perStreamTraceEnabled` as a measurement-conditions change). Unit tests added; four
    reviewer passes (first FAILED 2 must-fix, second FAILED 1 must-fix, third FAILED the
    append-only must-fix, fourth affirmative PASS). RESIDENCY-PREREGISTRATION.md Amendments 24-25
    record it. **The nulls-symptom question is ANSWERED structurally** (ATTRIBUTION-PASS.md §7):
    the nulls are a symptom of the per-step one-shot instrument DESIGN, not of the clamp bug the
    fix removed — a clean re-run would show MORE nulls (~10 of 12), because the fix converts the
    two former `0`-impostors into honest nulls. **The empirical clean-instrument run is QUEUED,
    not run** (ATTRIBUTION-PASS.md §8): it collects client-clock quantities, so 24(g)'s
    "no RustDesk measurement, ever / headed foreground physical time" reserves it for the next
    headed sitting (RustDesk was up at the human's request; custodian unattended). Original entry
    below, kept for the record.]**
    **[Instrument defects, surfaced 2026-09-03 by the entry-28 attribution pass — promoted per
    the standing "open defects don't live only in walkthrough logs" instruction.]** Three
    related defects in the residency instrument's per-step segment capture, all traced in
    `spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md` §2: (1) the negative-span clamp
    (`residencyInstrument.ts:459-462`) is one-sided (`< 0` only), so a cross-step
    arrival-before-issue delta of exactly `0` survives as an apparent measurement — two such
    `queryToFirstByteMs: 0` impostors sit in the P12 evidence file; (2) cross-step rows can
    carry seconds-scale `decodedToPaintedMs` values that are not paint times (13.6s/16.4s in
    P12's zoom-in-3/zoom-out-1); (3) the per-step one-shot design cannot attribute streams
    whose lifetimes span step boundaries — at 5 GB, nearly all of them — so a re-run populates
    nothing. Recommendation: fix (1) and (2) (cheap validity-check tightening: clamp `<= 0`
    with a distinct reason; suppress or flag cross-step paint spans) in whichever cut next
    touches the instrument — 1b's campaign if it runs one; adopt the pass's harness-only
    per-stream design (§6) only if the kernel-vs-transport split ever becomes load-bearing.
    Touches: `frontends/shell/src/instrument/residencyInstrument.ts` + its tests; instrument
    surface only, no product behaviour.

30. **[RESOLVED 2026-09-03 — human: "choose (or draft) the string that asserts only what the
    system did/verified, never implying an unrun action — the filter-null / declared-not-verified
    discipline; show me the final string at the PR if you drafted fresh." Drafted fresh and
    applied: **`none-supplied`** (the recommendation below, confirmed against the ruled
    discipline — it asserts only the observed non-supply; no hash, no catalog comparison ever
    ran). Shown at the carrying PR per the instruction. **The versioning sub-question RULED
    2026-09-04 — human's rule: new value in an existing key's domain → stay `skp/0.2` as a
    value-domain widening on the dated no-external-readers fact with the entry-6 expiry clause;
    new key → `skp/0.3`.** Custodian classified: `none-supplied` is a new value in the existing
    `definition_provenance` key's domain (no new field), so it STAYS `skp/0.2` — the entry-6
    shape (`ApprovalRoute::ShellDialog`'s `spatial-audit/1` widening) applied, carrying entry 6's
    own expiry clause (the widening rides only while no external reader of `skp/0.2` exists).
    Recorded in `SKP-V0.md`'s entry-30 addendum, ADR-026's append, and `commands.rs`. Original
    entry below, kept for the record.]**
    **[Corollary of entry 25's own ruling, surfaced 2026-09-03 while applying it — NOT decided
    by that ruling.]** `definition_provenance(None)` returns `pasted` for `--assert-crs`'s
    no-definition case (`engine/src/crs_catalog.rs:128-137`, verified in code 2026-09-03) —
    under the ruled principle ("prefer the wording that records the action"), that records an
    action that did not happen, a stricter violation than the one the ruling resolved. The None
    case needs its own honest value. Recommendation: **`none-supplied`** (echoing ADR-015 §5's
    `none-performed` shape — record what the caller did: asserted a CRS without supplying a
    definition), exact string on sight at the PR per the 24(b) precedent. Same wire-cost note as
    entry 25: wire-visible in `skp/0.2`, free before merge-freeze, a version bump after.
    Touches: `engine/src/crs_catalog.rs` + its pinned-literal test, ADR-026 (append), both-side
    fixtures.

29. **[RESOLVED 2026-09-03 — human: "yes, into 1b as a named piece with its own E2E step; if it
    grows beyond small once opened, it exits back to the queue." K6's hover-staleness fix is now
    a named 1b piece with its own E2E step and an explicit growth escape-hatch; recorded in
    `NEXT-CUT.md`'s 1b scope. Original entry below, kept for the record.]**
    **[Open defect, promoted from the Part K walkthrough log per the human's own instruction,
    2026-09-03: "open defects don't live only in walkthrough logs".]** K6's sub-pixel hover
    staleness, live-reproduced during the 2026-09-02 sitting: hover a feature at full zoom-in,
    keep the pointer stationary, zoom out — the id readout persists past the zoom level where a
    fresh hover would refuse by name ("features here are below pick resolution"), because the
    refusal is not re-evaluated on zoom while the pointer does not move. A picking-freshness
    defect: it undermines ADR-028 item 4's refusal-by-name discipline exactly where that
    discipline matters (the stale readout claims a pick the current view cannot honor). The
    decision is scheduling: fix in the debt slice (1b) as a bounded item, or defer to whichever
    cut next touches picking. Recommendation: **1b** — it is small, adjacent to 1b's
    honesty-signal work (Item B's settled-partial signal is the same "never claim what the
    current state can't back" class), and leaving a known-stale honesty surface unfixed while
    building a new one invites the same conviction twice. Touches: the hover/pick freshness path
    (`frontends/shell/src/canvas/pickResolution.ts` + wherever hover re-evaluation hooks camera
    changes), a unit test constructing the zoom-out-while-stationary case.

28. **[RESOLVED 2026-09-03 — human: "(a) — dispatch the read-only attribution pass (the null
    queryToFirstByteMs angle first); LOD's brief finalizes only after its answer." Pass
    dispatched the same day, read-only, no product code; the LOD problem statement in
    `NEXT-CUT.md` stays draft until it returns. Original entry below, kept for the record.
    COMPLETED same day: `spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md`. Verdict:
    "upstream of paint" is now a grounded finding on direct records (time-to-data dominates by
    1-2 orders of magnitude; the 150s window decomposes into a 150.058s backlog-drain phase,
    continuously streaming at ~4.4 MB/s, plus ~2.1s gesture-to-settle) — renderer-side LOD would
    target the minor cost pool; the kernel-vs-transport-vs-backpressure split within
    time-to-data remains open (harness-only instrumented design named in the pass). One
    correction to this entry's own original text below: "3-of-12" was the consult's error,
    propagated unverified — the file carries 8 nulls of 12 with 2 usable; two further rows are
    `0`-value clock artifacts that must never be quoted as measurements (instrument defects
    queued as entry 31).]**
    **[LOD problem-statement gap, surfaced 2026-09-03 drafting the LOD brief from 1a's findings —
    NOT decided here.]** The architect consult that scoped this cut (`a8f4c2c0cb1ff80ed`,
    2026-09-02) named a "wrong-module check" as a precondition for the LOD brief: P12's own
    per-tile arithmetic (arithmetic, not measurement — pan-east ~1s/tile, pan-northeast ~3.3s/tile,
    zoom-to-layer 152s/70 tiles, against a ~92ms Polygons-scale first-batch-paint mean) suggests
    the 5 GB wall is query/producer-side, not client-paint-side — meaning a renderer-side LOD
    slice (client decimation) may be aimed at the wrong module entirely; server-side aggregation
    or import-time overview tiers might be the real lever. The consult's own recommendation was
    "1a is what tells you whether this is true; do not write the LOD brief before it." **1a's own
    three-question scope, as the human explicitly dispatched it (queue disposition; finding-3
    pressure-valve-vs-thrash; pan-west's recoverable fraction), did not include this check** — it
    answers different questions and none of its findings bear on query-vs-paint attribution. The
    LOD problem-statement draft below (`NEXT-CUT.md`) is therefore drafted with this gap named
    explicitly, not silently assumed answered. Recommendation: **your call** — either (a)
    authorize a small, additional read-only diagnosis pass specifically on this attribution
    question before the LOD brief is treated as final (cheapest: re-check whether a fresh
    instrumented run could populate `queryToFirstByteMs` for the 3-of-12 P12 steps that came back
    `null`, or find another way to attribute the 150s window's own time), or (b) accept the LOD
    problem statement with this named as an explicit, re-deferred open question the LOD cut's own
    preregistration must answer before its architecture is chosen. Touches, if (a): a further
    spike, no product code. Touches, if (b): nothing now: the LOD brief's own Q2 ("where does the
    reduction happen") carries the flag forward.

27. **[RESOLVED 2026-09-03 — human: "(i) amendment — append to ADR-028's clarification 3 as the
    second declared exception, with one added sentence: the visible-regression half is
    unmeasured, and evidence of visible in-viewport holes attributable to partial-covering
    eviction reopens this as a defect. Docs only." Applied as ADR-028 Amendment 1 (append-only;
    option (ii)'s re-measure obligation does not attach). Original entry below, kept for the
    record.]**
    **[Finding 3 — the second undeclared eviction exception — amendment vs. fix, due at 1b per
    ADR-028's own text, informed by the 1a diagnosis spike (`spikes/viewport-residency-1a-diagnosis/README.md`,
    2026-09-03) — NOT decided here.]** 1a's Q2 traced the mechanism precisely: during over-budget,
    `onCameraChange`'s per-round protected-set computation (`tileViewportStreamManager.ts:290-299,328-340`
    + `candidateArmSession.ts:454,726`) omits durably-partial, currently-untracked covering tiles,
    so they are evictable despite intersecting the viewport — a second, undeclared exception to
    ADR-028's "never evict a tile intersecting the current viewport" (its own architect-gate
    clarification 3 names exactly one, the dedupe-owner cascade). 1a could establish, from code
    structure alone, that the freed budget is used productively and immediately (`tileIngest.ts:117-151`,
    same synchronous call) — the "pressure valve" half. It could **not** establish, without a
    runtime trace, how often an evicted partial tile's content visibly disappears from view before
    a later pan happens to re-cover and re-admit it — the "thrash" half stays unmeasured, not
    guessed. The architect's own drafted skeleton (consult `a8f4c2c0cb1ff80ed`, §"Drafted
    skeletons: A") frames the two options plainly: **(i)** declare both as intended behaviour,
    amending clarification 3 to name the second exception and the partiality/budget-flag coupling
    it rides on (`WorkingCanvas.tsx:1112-1119`); or **(ii)** class them as defects owed a fix in
    1b, which would also make ADR-028's already-accepted gate-8 evidence non-comparable for any
    future arm and carry a re-measure obligation under the same preregistered protocol (Amendment
    19's same-session-baseline precedent). Recommendation: **your call, no default assumed** — 1a's
    evidence supports either reading (it neither proves the exception harmless nor proves it
    costly); the consult itself calls this "an ADR-028 amendment question, human's call, not a
    worker's." Touches, if (i): an ADR-028 amendment, append-only. Touches, if (ii): 1b's own
    scope gains a fix item at `tileResidentSet.ts:426-482`/`tileViewportStreamManager.ts:290-340`,
    plus the re-measure obligation.

25. **[RESOLVED 2026-09-03 — human: "prefer the wording that records the action over one that
    claims a search result." Applied as: `pasted` RETAINED, `not-in-catalog` rejected — ADR-026's
    own framing maps the principle directly (`pasted` "names a route the operator took" = the
    action; `not-in-catalog` names the check's outcome = a search result). No wire change, no
    code change. One corollary the same principle surfaces — `definition_provenance(None)`
    returning `pasted` records an action that did not happen — queued as entry 30, not decided
    by this ruling. Original entry below, kept for the record.]**
    **[Rule-7 item, surfaced 2026-09-02 while applying entry 10's ADR-026 acceptance — NOT
    decided by that ruling.]** ADR-026's own "Architect note for acceptance" section (filed
    2026-08-18, unresolved) flags one wording question left explicitly "the human's": the
    `pasted` provenance-string value names only that a definition was **not byte-identical to
    any pinned catalog entry** — not that it was necessarily hand-typed — while
    `definition_provenance(None)` also returns it for `--assert-crs`'s own no-definition case.
    ADR-015 §5's `none-performed` / ADR-016 §6's "the record says what was checked" both argue
    for a value naming the check instead (`not-in-catalog`). The string is wire-visible in
    `skp/0.2` — free to change before merge-freeze, a version bump after. Recommendation: **your
    call, no default assumed** — this is exactly the kind of wire-wording precision this project
    treats as never a detail. Touches, if changed: `kernel/src/skp.rs::host_minted_crs_assertion`
    (or wherever `definition_provenance` is minted), `ADR-026`'s own text, both-side fixtures.
    *(Numbering note, resolved by the merge, 2026-09-03: the viewport-residency branch
    independently used 25 and 26 for unrelated entries — the P9 heap-footprint measurement and
    PR #16's red DCO check — both already resolved (see this file's own Resolved section) by the
    time of the merge, so no renumbering was actually needed: this Pending entry is the only
    LIVE use of "25" post-merge, the other two being historical record only. No action taken.)*

24. **[(a)–(c) RESOLVED 2026-08-30 — human: "a is yes, b approved, c go with your
    recommendation"; (g) CLOSED 2026-09-03 — human: "close as superseded by rule-11 batching."
    With (d)–(f) riding their recommendations, this entry is now fully resolved.]**:
    over-budget renders as a declared partial view with the persistent
    status retained; the rider-1 status meaning change approved, exact wording on sight at the
    PR; hover below pick resolution refuses by name. (d)–(f) ride their recommendations;
    (g) scheduling of headed measurement sessions remains to be agreed when P2/P6 are ready.
    **Tiling/LOD cut: seven decisions before code — (a)–(c) GATE the cut's P0.** The architect's
    design note (2026-08-30, binding for the cut) restates the target honestly: at fit-to-extent
    the viewport IS the dataset, so this cut retires the *error-shaped* refusal, not the ceiling
    itself — over-budget becomes a declared partial view. Yours to decide:
    **(a) May an over-budget viewport render at all without an error?** Today it refuses and
    cancels the stream. Converting refusal → declared, labelled partial view with
    distance-ordered eviction is the cut's core honesty call (principle 8). Rec: **yes** — it
    is the cut's entire point, with the persistent rendered/total status RETAINED.
    **(b) The ceiling-status semantics are your rider 1** (Parts D and H judged its wording):
    under (a) the status stops meaning "refused above ceiling" and starts meaning "showing N of
    M — farthest tiles evicted". Approve the meaning change (exact wording on sight at the PR).
    **(c) Hover at whole-dataset zoom** (PR #15's question, routed here): (i) declared refusal
    — "features here are below pick resolution, zoom in" (architect rec: the declared-not-
    discovered discipline applied to picking); (ii) topmost-with-caveat; (iii) leave as is.
    **(d)** Is eviction visible? Rec: the status line's N-of-M is the visibility; no tile
    readout. **(e)** Console fan-out: N tile requests per pan will amplify Part J's noise
    finding — grouping/de-emphasis decided with entry 23(a). **(f)** Client-clock results live
    in a NEW `frontends/shell/RESULTS.md` (never mixed into kernel/RESULTS.md's producer-clock
    records). Rec: approve. **(g) Scheduling:** the measured arms need headed, foreground,
    non-remoted sessions on this machine — your physical time, to be agreed when P2/P6 are
    ready (no RustDesk measurement, ever). (d)–(f) proceed on recommendation unless overridden.

22. **[RESOLVED 2026-08-30 — human: "Let's go with the next cut" → the hold lifts; the
    ADR-011 tiling/LOD slice opens with its preregistration piece. The remaining queue
    entries stay pending at the human's pace and no longer gate the pipeline.]**
    **Batch sequencing + a deliberately idle cut pipeline (architect-recommended hold).** The
    operator batch is full (Parts H, I, J — a complete session, all against the single pinned
    build `807648f`, pre-filled in the three result logs) and every worthwhile next cut is
    either gated on entries below or — the ADR-011 tiling/LOD slice, the honest next cut — is
    genuinely AIMED by what Part H will teach (gate 8 asks what replaces whole-dataset
    residency for the 5 GB case; H's evidence plus PR #15's hover-at-scale question are
    three-quarters of its problem statement, and its first artifact is a preregistration,
    cheaper to write after the batch). So the pipeline holds until the batch runs and entries
    7/8/9/16 clear. Named idle work meanwhile (bounded, non-red-line): the ADR-020 owed
    fail-closed defect (`tauri build --debug` origin — mechanism-internal fix, reviewer-gated);
    unit tests for the console's two named-unexercised branches; drafting (NOT filing) entry
    9's carrier ADR. **Override available:** say the word if you'd rather have a fourth part
    queued than an idle stretch.
    **Progress note 2026-08-30: the batch RAN in full (Parts H, I, J — all three result logs
    written), entry 8 resolved by your live H8b, decision 7's observation is in, ADR-025
    filed.** The hold's remaining condition is entries 7/9/16 (+ acceptances 3/16/23 and the
    ADR-022/024 pair at your pace); the next cut — the ADR-011 tiling/LOD slice, opening with
    its preregistration piece, now aimed by Part H's evidence and PR #15's hover-at-scale
    question — starts on your word or when those clear.

12. **[RESOLVED 2026-09-07 — OVERTAKEN BY EVENTS: the repository has been public since
    2026-08-03T18:06Z (GitHub `PublicEvent`, verified), before ADR-009's acceptance and before this
    checklist existed — the human's own act, never recorded until now. The go/no-go was moot; the
    checklist's items stand as recorded. Original entry follows.]**
    **ADR-009 pre-public checklist: mechanically COMPLETE — ready for your go/no-go, three
    residual judgments (13–15).** The 2026-08-18 verification pass confirmed the 2026-08-07 work
    and closed its drift: SPDX headers extended to `frontends/shell` (84 files — the module
    postdated the original sweep), dependency audit re-run byte-identical (721 audited / 9
    decided / 0 needing review), DCO re-verified against the live source, all three product CI
    workflows green on push AND pull_request, history delta (147 new commits) re-swept clean for
    credentials/personal-data/third-party material, three stale docs corrected with dated notes
    (`main` @ 8a69260, pushed). What remains is entirely judgment — entries 13–15 plus **making
    the repository public itself, which stays yours regardless**. Full record:
    `PRE-PUBLIC-CHECKLIST.md` (durable) + `.cut-archive/CUT-STATE-adr009-checklist.md`.

13. **[RESOLVED 2026-09-07 — OVERTAKEN BY EVENTS (public since 2026-08-03): the "pre-public bar"
    no longer exists; the trademark-register search stays a pre-1.0/counsel item exactly as docs/14
    records it. Original entry follows.]**
    **ADR-009 item 5's pre-public bar — does the 2026-08-07 informal collision check + docs/14
    trademark stub suffice, with the full register search deferred to pre-1.0?** That deferral is
    already written into docs/14 as a prior custodian's judgment call, made before the red-line
    rule reserved ADR-009-adjacent calls for you; this pass did not re-decide it.
    Recommendation: **accept the deferral as written** ("no collision found, descriptive name,
    weak mark" for a pre-launch repo; register search stays a pre-1.0/counsel item per ADR-009's
    own Caveat). Touches nothing if accepted; a docs/14 edit if you read the bar differently.

14. **[RESOLVED 2026-09-07 — OVERTAKEN BY EVENTS (public since 2026-08-03): both identities have
    been public commit authors for over a month; acknowledged, no action — the human confirmed
    2026-09-06 that both are theirs (entry 41's ruling). Original entry follows.]**
    **Two personal git identities are permanently in history**
    (`donini.christopher@gmail.com` 172+, `chrys92d@gmail.com` 12+) — named non-blocking by the
    2026-08-07 history review, never explicitly resolved. Normal for an open project; a history
    rewrite is a named red line and not on the table. Recommendation: **acknowledge, no action**;
    optionally standardize one identity for future commits, your call.

15. **[RESOLVED 2026-09-07 — OVERTAKEN BY EVENTS (public since 2026-08-03): historical fact,
    no rewrite (a red line); the `PRE-PUBLIC-CHECKLIST.md` §6 note exists (entry 26 added it) and
    the DCO check has gated every PR since. Original entry follows.]**
    **102 of 239 commits (all on/before 2026-08-10) carry no `Signed-off-by`** — the pattern
    cleanly tracks DCO adoption settling in after ADR-009's acceptance; every unsigned commit is
    from your own one-or-two identities, so no external-contribution provenance question exists,
    and backfilling would be a history rewrite (red line). Recommendation: **accept as historical
    fact, no rewrite** — the CI check already gates every future external commit, which is what
    DCO 1.1 is for. Optional: a one-line note in `PRE-PUBLIC-CHECKLIST.md` §6.

8. **[RESOLVED 2026-08-30 — you took H8b live and completed it]**: 3.3M rows / 6,636
   partitions published unwarned, viewer refusal read on screen, artifact deleted after;
   **ADR-025 filed Proposed with its decision deliberately open** (refuse / warn / stay
   silent — yours at acceptance, no recommendation recorded). Original entry follows.
   **Part H8b — complete a whole-file 5 GB publish to demonstrate the dead-artifact gap?** There
   is NO publish-side refusal above the reader's ceilings: a whole-file publish succeeds (~100s,
   5.7 GB written, irreversible) and only the viewer then refuses with ceiling-exceeded — meaning
   the product's hero path can produce an unviewable artifact with no warning (RESULTS finding 2,
   now reachable from your UI; ADR-025 is drafted as the decision's home). H8a (default) shows
   cancellability instead: publish whole-file, cancel mid-flight, nothing written. H8b would give
   ADR-025 its UI-level evidence at the cost of the write. **Decide live during the run** — the
   step text offers both; H8b happens only on your explicit go-ahead in the moment.

5. **Publish cut: filtered-subset bundles are OUT at bundle_version 1 (architect ruling) — do
   you want them scheduled?** A bundle recording the shell's SQL-filtered subset needs
   `bundle_version 2` + a new ADR (candidate ADR-025): your Corrigendum 3 declared the v1
   schema-change exception **spent**, and a v1 manifest cannot record a predicate — publishing
   one today would produce a FALSE manifest (claims whole-file over a subset) and a digest
   collision, so the cut's P0 makes `preflight` refuse it, typed. The shell publishes whole-file
   or current-viewport-bbox (the two honest §8 shapes), and an active filter is named in words on
   the approval surface, never silently dropped. The hero sentence still reads: the filter is how
   you *find* what to publish; the artifact records the viewport. Recommendation: leave
   bundle_version 2 unscheduled until real need. No action = the recommendation.

4. **ADR-023 — attribute projection on `viewport_query` (decision deliberately open).** Filed as
   the named home for the categorical/live-attributes deferral (the ADR-011-gate-8 pattern) — no
   acceptance is being asked for; it exists so the gap has an address. **No action needed unless
   you want its question prioritized** (it gates data-driven styling and attribute hover in the
   shell). Recommendation: leave open until after the publish cut.

2. **D1 (style cut, small) — "Save style…" file write, or visible/copyable text only?** The style
   panel shows the current style document as text (the accepted ADR-017 §5a format — the model
   already exists; the shell adopts it rather than inventing one). A Save-to-file button would be
   an ADR-006 **class-3 external side effect** (export): explicit approval + an audit record owed —
   machinery the publish cut is building anyway. Recommendation: **text only this cut**; the
   clipboard covers the hero-slice round-trip (style in shell → copy → `publish-bundle --style` →
   bundle viewer). The cut proceeds on the recommendation unless you override. Touches: the style
   panel's control set only.

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

## Resolved

- **2026-09-07 — Entry 40 (the producer-side hang) — the empirical pass CLOSED, reading (D): a
  null result.** The one preregistered cell (PASS-PREREGISTRATION.md §3 + Amendments 1–4) ran to
  completion on the human's "window open" under the 24(g) guard (every gate held; RustDesk restored
  at 19:18:04Z): 11/11 steps measured and settled, 167/167 tile streams `Completed`, `pan-east`
  65/65 in 16.3 s (unscored), the producer pool never leaking a lease across 171 gapless ticks
  (first `active=0 live=1 idle=1`, last `active=0 live=3 idle=3`). **The 2026-09-06 hang did not
  recur** — per the preregistration's own §4, "one non-recurrence does not refute the 2026-09-06
  observation; the instrument stays in place for the next 5 GB run." The two runs' declared
  differences (the eviction fixes removed the re-request storm the hung run ran under; per-stream
  trace on; 60-min per-step bound) are recorded as conjecture, not cause. Ranks 1–5 stand
  unconvicted and unrefuted; the structural answer (ATTRIBUTION-PASS.md §7) is unchanged; the LOD
  cut's P1 risk keeps its status. No further attempt is authorized (Amendment 4's cap). Full record:
  `spikes/entry40-producer-hang-diagnosis/README.md` §5 + `evidence/`; RESULTS.md follow-up.

- **2026-09-07 — LOD scheduling RULED: flip-first; P2 first when LOD runs.** The human, verbatim:
  *"LOD scheduling: flip-first — the post-fix stable-partial state is an honest, declared v0.1
  limitation, so LOD is the first post-flip quality cut, not a flip-blocker (my felt-bar override
  reserved); when LOD runs, P2 (import-time overview tiers) first on the code-grounded grounds in
  §2; dispatch entry 40's empirical producer pass now, independently under the 24(g) guard — it
  gates nothing and informs P1's later risk. After the 48 re-run and L9: rule-10 archive, then the
  flip track (ADR-025 reading, the exposure review, the 12–15 go/no-go) becomes the live queue."*
  Applied: NEXT-CUT.md's LOD section carries the ruling (its §5 questions answered: (1) the
  stable-partial overview is a declared v0.1 limitation, (2) P2, (3) entry 40's pass runs now,
  independently); after 1b closes, the flip track is the live queue. Resolves the 34c-deferred
  LOD-vs-flip ordering.

- **2026-09-06 — the 24(b) string sight COMPLETE (the held string 3 + the entry-36 string 5).**
  The human's ruling, verbatim: *"String sight complete: 1/2/4 confirmed as shipped; string 3
  trimmed — drop the frame clause, final: 'Tile filling stopped — showing {N} features already
  loaded; this view's first data load is still running and Cancel does not stop it.'; string 5
  approved with 'part of this view failed to load'."* Applied same day in `residencyStatus.ts` +
  its unit tests, verbatim (string 3 `relinquishedUntiledStillRunningText`, string 5
  `SETTLED_PARTIAL_FAILURE_TEXT`); strings 1/2/4 untouched (confirmed as shipped). Nothing of the
  sight remains open.

- **2026-09-05 — the 24(b) string sight, ruled.** The human's rulings on the four 1b draft
  strings, verbatim: *"Strings: 1 approved; 2 with 'not fetched'→'not loaded'; 3 held pending
  #35's reachability check, reworded per my note if it survives, sticky per entry-1; 4
  reworded — 'Filling has finished for this view — the render budget is full; pan or zoom to
  see other areas.'"* Applied: string 1 (`STALLED_SUFFIX`) ships as drafted; string 2
  (`relinquishedText`) ships with "not loaded"; string 4 (`SETTLED_PARTIAL_SUFFIX`) replaced
  with the human's wording verbatim — and NOTE: that wording claims the render budget is full,
  which is true for budget-partiality only, so the #36-ruled failure-partiality state gets its
  own distinct draft wording (at PR sight), never this string; string 3 held for the #35
  reachability re-check (sticky per entry-1 regardless of wording). All landing in the #35/#36
  implementing piece.

- **2026-09-04 — decision 24(g) AMENDED: reported-only measured cells may run unattended with
  RustDesk stopped, under a proven-safe restore protocol. Scored cells and felt verdicts remain
  human-present (the original 24(g) rule, unchanged, for those).** The human's amendment, recorded
  verbatim in substance. This refines — does not erase — the 2026-09-03 "24(g) closed as superseded
  by rule-11 batching" note: rule-11 batching stays the rhythm for scored/felt work; this carves
  out reported-only *measured* cells (e.g. the queued 5 GB clean-instrument attribution trial,
  which is a demonstration, not a scored gate) to run unattended IF AND ONLY IF the protocol below
  holds. **The protocol (all conditions binding, per the human):**
  1. **Restore armed BEFORE the kill, via TWO independent mechanisms that survive harness death:**
     (a) an independent watchdog process (restores when the harness stops heart-beating), and
     (b) a scheduled task at a hard wall-clock time bound (restores unconditionally, surviving even
     the watchdog dying). Both armed before RustDesk is stopped; the restore is idempotent
     ("ensure the RustDesk service is Running").
  2. **Screen lock and display sleep disabled for the measurement window**, and the harness
     **verifies display-awake AND session-unlocked before each trial** — a cell whose trial cannot
     verify both is **invalidated** (`unmeasured — display/session unverified`), never kept.
  3. **New honest attest string**, recorded here as the amendment's own artifact:
     **"unattended, RustDesk stopped and verified absent, display-awake verified"** — used only in
     a cell that actually met conditions 1–2; it replaces the human-present attestations (e.g.
     P12's "headed, foreground, human present, RustDesk stopped") for these unattended cells, and
     never appears on a scored cell or a felt verdict (those stay human-present, so keep their own
     human-present attestations).
  4. **Mandatory precondition before ANY real cell uses this:** a **no-measurement dry-run** of the
     kill-and-restore cycle, run once, proving RustDesk comes back on BOTH the happy path (harness
     completes and restores) AND a simulated harness hang (harness dies; the watchdog and/or the
     hard-time-bound scheduled task restore). Until the dry-run passes, no unattended cell runs.
  **Custodian execution:** the restore mechanism + dry-run are the custodian's to build and run
  (operational tooling, not a red-line decision); the amendment itself (what is permitted, the
  attest string, the conditions) is the human's ruling, applied here. The dry-run kills RustDesk —
  a hard-to-reverse outward action — so the custodian proves the hard-time-bound scheduled-task
  backstop actually FIRES (test-fired against a marker) BEFORE the first kill, bounding the worst
  case to short auto-restored downtime. Touches: a committed restore/watchdog/arm tooling set
  (near the residency harness) + forward-pointer appends to `RESIDENCY-PREREGISTRATION.md`'s own
  "No RustDesk in any measured cell" rule and `RESIDENCY-DEBT-1B.md`'s headed-sitting section.
  **DRY-RUN PASSED 2026-09-04** (`frontends/shell/e2e/rustdesk-guard/`, README + runtime log): all
  three restore triggers proven with NO measurement. The SYSTEM scheduled-task backstop was proven
  to fire and run the restore BEFORE any kill (bounding worst-case downtime); happy path (kill →
  disarm restored → Running); simulated harness hang (kill → heartbeat abandoned → the watchdog
  restored unaided in ~28s, `service=Running`, clean exit). Final state clean (RustDesk Running, no
  stray task/process). The unattended reported-only cell path is now UNBLOCKED — the 5 GB
  attribution trial may run under it. (Side effect flagged: `arm` sets monitor/standby timeouts to
  0 for the window; monitor was already 0 on this machine, standby restored to 30 min after the
  dry-run; the harness's happy-path `disarm` restores both automatically in normal operation.)

- **2026-09-03 — the post-1a rulings batch: entries 27, 28, 25, 24(g) resolved; the LOD brief's
  Q4 ruled; K6 promoted.** The human's rulings, applied same day: **(27)** finding 3 → option
  (i), amendment — ADR-028 Amendment 1 declares partial-covering eviction during over-budget as
  the second declared exception to "never evict a tile intersecting the current viewport," with
  the ruled reopen condition (evidence of visible in-viewport holes attributable to it reopens
  the item as a defect); docs only, no re-measure obligation. **(28)** option (a) — the
  read-only attribution pass dispatched (null-`queryToFirstByteMs` angle first); the LOD brief
  finalizes only after its answer. **(Q4, the LOD brief's scorability question, ruled without a
  numbered entry):** a NEW docs/08 scale-class row, landed WITH its measurement per ADR-011
  gate 2, defined as a dataset class (feature/vertex brackets), not "the 5 GB file"; the 5 GB
  assertion-only items retained besides — recorded into `NEXT-CUT.md`'s draft. **(25)** `pasted`
  retained over `not-in-catalog` (the ruled principle: prefer the wording that records the
  action over one that claims a search result); no change anywhere; the None-case corollary the
  same principle exposes queued as new entry 30, not decided. **(24(g))** closed as superseded
  by rule-11 batching — entry 24 now fully resolved. **(K6)** promoted from the Part K
  walkthrough log to its own pending entry 29 ("open defects don't live only in walkthrough
  logs"). Explicitly retained by the human, unruled: entries 12–15 (the ADR-009 public-flip
  cluster), ADR-025, and the 5 GB fixture's second-location target (pending their own disk
  topology check).

- **2026-09-02 — three rulings closing the sitting: ADR-028 accepted, the architect consult
  adopted in full, and the 5 GB fixture's single-point-of-failure ordered fixed this week.**
  **(1) ADR-028 ACCEPTED per the human's own (d) ruling** — the gate-8 rider is discharged (G2
  clean at 5 GB, escape/cancel felt immediate at scale, the partial view held and read honest in
  Part K). The acceptance text carries: the architect-verified correction to the futility-pruning
  seed; the scale calibration (zoom-to-layer's 5 GB non-settle, now understood as a held-queue
  principle-7 item); the two Polygons-scale mechanisms as named binding debt (unchanged); and
  **finding 3 (the second undeclared eviction exception) recorded as a named open item** —
  neither declared nor fixed, its resolution decided from the debt slice's own 1a diagnosis, due
  at 1b (applied to `ADR-028` and `RESULTS.md` both). **Merge-ready**: the human will click PR
  #16 (`cut/viewport-residency`) and PR #17 (the Track 2 batch, `worktree-decision-queue-batch`)
  themselves — the custodian does not merge (standing session restriction).
  **(2) The architect consult adopted in full**: the debt slice's own **1a** is a diagnosis
  spike — no gate — answering three questions: the queue-disposition question (how the held
  queue should actually be resolved, not whether it needs to be — that's already settled as a
  `docs/01` principle 7 obligation); finding 3's own pressure-valve-vs-thrash question (does
  evicting partial covering tiles under over-budget pressure help or harm); and pan-west's own
  recoverable fraction (the request-identity-keying seed's unmet precondition). **1b** is scoped
  from 1a's own findings and owns the held-queue fix outright (a principle-7 obligation,
  independent of what 1a's other two questions turn up) plus whatever else 1a's evidence
  justifies scheduling. **The LOD slice's own problem statement is drafted only after 1a**,
  explicitly including the architect's own wrong-module check (P12's own per-tile arithmetic
  points at the query/producer side, not client paint — worth confirming before assuming a
  renderer-side LOD slice is even the right lever).
  **(3) The 5 GB fixture's single-point-of-failure gets fixed this week**: its provenance and
  hash recorded durably (not just living as a file on disk), a copy made to a second physical
  location, and whatever regeneration spec is honestly possible written down — before any
  further campaign depends on it existing. Custodian dispatched research on known
  provenance/generation parameters; the physical second-location copy needs the human's own
  target location (not something the custodian can pick unprompted).

- **2026-09-02 — entry 25, the P9 heap-footprint measurement: FOLDED INTO THE NEXT CAMPAIGN'S
  INSTRUMENT, no standalone session.** The human's ruling, applied verbatim: the
  candidate-arm geometry cache's unmeasured third coordinate copy per resident vertex
  (`limits.ts`/`buildLayers.ts`, disclosed not measured — commit `7e86928`) gets its heap-delta
  measurement added to whatever scored campaign's client instrument next runs — a heap sample
  (`performance.memory` or a host-process probe, matching `kernel/RESULTS.md`'s own convention)
  alongside quantities that campaign already collects — rather than a dedicated session of its
  own. Not scheduled by this resolution; owed whenever a future cut next touches tile admission
  and runs its own measured campaign. Touches nothing now — `limits.ts`/`buildLayers.ts`'s own
  comments already disclose the gap honestly, unchanged by this resolution.

- **2026-09-02 — entry 26, PR #16's red DCO check: no rewrite, resolved the entry-15 way.** The
  human's ruling, verbatim: *"no rewrite — red line stands, and these three hashes are
  load-bearing (evidence files and RESULTS.md §1 cite them as buildCommit provenance; rewriting
  them would falsify the measurement chain, which is worse than a red check)."* Applied: (1) a PR
  #16 comment carries the human's own retroactive DCO 1.1 certification for `de67713`/`8211723`/
  `0e4449c` verbatim, plus a one-line note beside entry 15's own finding in
  `PRE-PUBLIC-CHECKLIST.md` §6 — the check stays red on that PR by design, the honest state, not
  a fixed one; (2) the class fix, so this is the last one: `AI_DEVELOPMENT.md`'s Custodian
  mechanics gains item 12, naming headed-measurement-session commits (tester dispatches, result-
  committing scripts) as the specific place `-s` gets missed, and `CONTRIBUTING.md` documents a
  new committed local hook (`.githooks/commit-msg`, enabled via
  `git config core.hooksPath .githooks`) that refuses an unsigned commit before it ever reaches a
  PR — tested against both a signed and unsigned sample message, both correct. Does not gate the
  merge or the gate-8 work, per the human's own "then proceed" instruction.

- **2026-09-02 — the ADR-011 gate-8 ruling: option (d), accept with the two tail mechanisms as
  named binding debt (the ADR-021-condition pattern), rider attached.** Presented 2026-09-01 as
  four options against the completed dual-arm campaign (`frontends/shell/RESULTS.md`, P8 pre-fix
  + Amendment-23/P10 post-fix): (a) accept as-is; (b) reject; (c) iterate the two tails; **(d)
  accept, with zoom-to-layer's sustained new-tile admission window and pan-west's large-batch
  re-admission spike recorded as named binding debt in ADR-028, never silently dropped from a
  future cut's scope (custodian recommendation, taken).** The human's own rider, verbatim:
  *"ADR-028's acceptance itself is NOT discharged by this ruling — it waits until walkthrough
  Part K and the deferred 5 GB G1/G2 cells are in; if K's felt verdict or the 5 GB trace
  contradicts the accept-class reading (error-shaped refusals still reachable, or the partial
  view illegible in practice), the ruling reopens rather than stands."* Applied: ADR-028 gains a
  dated, appended gate-8 section (both campaigns' evidence gate-by-gate, the two mechanisms named
  by direct per-step attribution, the ruling and rider recorded verbatim) — its Status line stays
  **Proposed**, not moved to Accepted, per the rider. Touches on the eventual acceptance (not yet
  triggered): ADR-028's Status line, ADR-011 gate 8 marked met, `docs/02`/`docs/README` index
  entries — a later, separate custodian action once Part K + the 5 GB G1/G2 cells land clean.

- **2026-09-02 — entry 3, ADR-022 acceptance: ACCEPTED as recommended, no condition.** Applied:
  ADR-022's Status line to Accepted; `docs/02`/`docs/README` index entries updated.

- **2026-09-02 — entry 23, ADR-027 acceptance: ACCEPTED.** The human's ruling: finding (a)
  (console noise) recorded as a follow-up question, not an acceptance condition; finding (b)
  (zoom not visibly producing a `viewport_query` entry) gets one bounded diagnosis noted at
  acceptance, not re-opening the ADR; finding (c) (J5's operator confirmation) stands as
  recorded, open. Applied: ADR-027's Status line to Accepted, a new dated "Acceptance" section
  recording all three findings verbatim; `docs/02`/`docs/README` index entries updated.

- **2026-09-02 — entry 16, ADR-016 acceptance: ACCEPTED with the envelope record exactly as
  drafted, made architect-blockable per the architect's own recommendation.** OPEN item 1
  settled (the drafted envelope record appended, the original OPEN block kept verbatim per this
  project's own append-never-rewrite discipline); OPEN items 2 (stability across reopen) and 3
  (composite/non-integer keys) stay open, untouched. Applied: ADR-016's Status line to Accepted
  + architect-blockable; item 1's settlement appended; `docs/02`/`docs/README` index entries
  updated.

- **2026-09-02 — entry 11, scope confirmation (declare, never detect): CONFIRMED.** No separate
  edit — the ADR-016 Decision (item 3) already states this discipline; the confirmation is
  recorded inline in ADR-016's own new settlement text (entry 16, above) as a retroactive
  affirmation of the shipped cut's scope.

- **2026-09-02 — entry 7, the principle-7 publish-prepare gap: PRE-FIX.** The human's ruling,
  reversing the prior declare-and-observe default now that Part H's observation is in: thread
  the `CancelToken` + a phase label into `publish-prepare`. **Not implemented by this batch** —
  a small, host-side cut from `main`, reviewer-gated, scheduled to run only after tonight's
  sitting closes (its own brief is not drafted here, to avoid clobbering `NEXT-CUT.md`'s current
  occupant, the still-open viewport-residency cut). Touches, when dispatched: the shell's
  publish-prepare path (`frontends/shell/src-tauri`, wherever the whole-file SHA-256 runs
  uncancellably today).

- **2026-09-02 — entry 9, the `skp/0.2` scan-progress carrier clause: second explicit
  re-deferral CONFIRMED, stronger carrier filed.** The human confirmed the re-deferral (the
  clause descends from ADR-021's own acceptance condition, so only the human could discharge
  it) and its own drafted §8 text in `SKP-V0.md` **ships merged as discharged**, no longer
  flagged DRAFT/PENDING. **ADR-029 — the scan-progress carrier quantity** filed (Proposed,
  decision deliberately undrafted, the ADR-023 pattern), due before `docs/07`'s Prototype exit;
  no third silent rollover to "the next SKP version" is available without amending ADR-029
  first. Applied: `SKP-V0.md`'s two "PENDING HUMAN CONFIRMATION" markers updated to CONFIRMED;
  `docs/adr/ADR-029-scan-progress-carrier-quantity.md` filed; `docs/02`/`docs/README` index
  entries added.

- **2026-09-02 — entry 10, ADR-026 (CRS definition supply route): ACCEPTED, both routes.**
  Applied: ADR-026's Status line to Accepted, both routes confirmed as recommended and as
  already built; `docs/02`/`docs/README` index entries updated. **Rule-7 note — a genuinely new
  item surfaced while applying this and is NOT resolved by this ruling:** ADR-026's own
  "Architect note for acceptance" section flags a separate, still-open wording question (the
  `pasted` provenance string vs. `not-in-catalog`) that the human's ruling did not address. Not
  decided inline — see the new Pending entry below.

- **2026-09-02 — entry 6, audit format widening (`ApprovalRoute::ShellDialog`): APPROVED.** The
  code was already fully shipped on `main` (`kernel/src/permission/audit/record.rs`, tests
  green, `reader.rs` mapping present) — only two doc markers needed updating from "QUEUED for
  the human" to "APPROVED 2026-09-02", with the expiry clause (holds only until an external
  reader of `spatial-audit/1` exists) restated, not weakened. Applied: `record.rs`'s doc
  comment (also fixed a stale `NEXT-CUT.md` cross-reference to the since-overwritten publish
  cut's own brief) and `ADR-024`'s matching paragraph (lines 180-193) — comment-only, zero
  behavior change. ADR-024's own overall Status is untouched, still Proposed, still queued
  (below) — this entry approves only the one value-domain widening, not the ADR.

- **2026-08-19 — entries 20 + 21 (the A9' hover-pick red), resolved through to green.**
  Entry 20 (human: "let's go with entry 20"): the bounded zoom attempt ran and hit its own
  escalation trigger. Entry 21 (human: "start it"): the instrumented render-diagnosis session
  proved the fill layer healthy (22k–32k px at the exact configured alpha 180 in baselines;
  content unclipped) and the follow-up evidence closed the full mechanism: the test surface's
  sample-pixel selector is BY ITS OWN TESTS "the first non-background pixel in row-major scan"
  — structurally a content top-edge pixel — which the P5c interior verification could never
  pass; earlier greens predated the verifier and passed via deck's pick tolerance. Fix
  (harness-only, `dc3c7aa`): densest-patch bisection candidate selection; interior candidate
  verified at zoom notch 0 with patch fraction 100%, double-green, first all-green
  `e2e:console` run. **No product render/pick code was touched at any point.** The
  hover-at-whole-dataset-zoom UX question is owned by ADR-011's tiling/LOD slice (gate 8),
  flagged for the next architect consult. Full trail: `.cut-archive/CUT-STATE-action-console.md`,
  `e2e/README.md`'s resolution note, PR #15 disclosure 1.

- **2026-08-18 — action-console cut gates cleared by the human ("let's roll with the next
  cut").** Entry 17: the docs/07 Alpha split append applied as drafted (the Prototype ships the
  console's principle-4 visibility obligation only; notebook recording + AI flywheel stay
  Alpha). Entry 18: principle 4's status for style and publish = **accepted-with-a-deadline,
  recorded in ADR-027 at filing** — publish's deadline inherited from ADR-017's acceptance
  condition, style's from ADR-022/ADR-023's own resolution; the console renders both gaps as
  explicit debt-register entries. Entry 19 rides its recommendations (class-B name-only/no
  copy; data-plane out; architect-picked ceilings shown in the PR). The applied docs/07 text
  was restated verbatim to the human at go-time; a veto reverts it before the cut's PR.

- **2026-08-14 — operator walkthrough Parts A–D RUN by the human (over RustDesk), nine days ahead
  of its 2026-08-23 due date.** Parts B, C, D and A1–A6/A8–A10 **pass** — including both
  operator-only items: the native dialog (A2) and rider 1's visual acceptance point (D2/D3, banner
  and persistent status simultaneously readable, Dismiss leaves the status standing). Motion
  judgments carry the RustDesk degraded-channel caveat, corroborated by the app's session log.
  **One functional deviation: A7** — "Zoom to layer" is inert when the layer has been panned fully
  out of view (residency-clearing emptied its fit target; diagnosed same day; fix through gates,
  with the E2E A7′ step strengthened to pan fully off-data so this class stays caught). Two minor
  records: the post-pan refill pause reads slightly slow over RustDesk (designed debounce; panel-era
  tuning question), and the ceiling banner's Dismiss button abuts the message text (cosmetic CSS,
  fixed with the A7 work). Full log: `frontends/shell/MANUAL-WALKTHROUGH.md` Result log.

- **2026-08-13 — ADR-021 accepted, with a binding acceptance condition.** The row filter on
  `viewport_query` (SKP v0.1) accepted as designed. **Condition (applied to the ADR's acceptance
  text):** the named batches-may-be-empty shortfall carries forward as a **binding obligation on
  the filter-panel cut** — before any user-facing filter UI ships, the panel must present liveness
  and a working cancel affordance during zero-batch filtered scans (indeterminate progress + real
  cancel is the acceptable interim); true scan-progress reporting stays the named SKP-V0 §4.5 debt,
  resolved there or explicitly re-deferred with reason, never silently dropped. Applied same day:
  ADR-021 status line (Accepted + condition + Open-item), status-propagated to SKP-V0.md §7,
  `docs/02`, `docs/README`. Surface shipped this cut; PR #10 carries it, merge order #9 → #10.
- **2026-08-13 — ADR-020 accepted.** Host-declared exact-match origin *mechanism* accepted, not
  `cfg!(debug_assertions)` as the final origin selector; the `tauri build --debug` mismatch stays
  a recorded fail-closed defect owed before packaged-debug support. Applied: ADR-020 status line,
  ADR-012 Amendment 1 (the **Origin** threat-model bullet's referent; H4 PASS inherited by
  argument), `docs/09` "Local listening sockets", `docs/02`/`docs/README` entries; C3 negative
  test committed (`3188f1d`). Full record: the ADR file.
- **2026-08-13 — Entry A (import-layout gate) resolved: gate fail accepted as final, with reopen
  conditions.** No index prunes IO; physical layout is the only lever (Hilbert read 61.7% at the
  5 GB near-quarter, won total 49/49) but the preregistered gate FAILED its no-whole-file-regression
  condition (100.544% vs ≤ 100.5%; Hilbert compresses ~0.5% worse) — a fail is a complete result,
  layout stays out, ADR-021-layout unfiled. Standing bracket: an unordered source gets no pruning
  at all (shuffled ≥ 99.99%). The docs/07 line-22 replacement + three reopen conditions
  (workload-shift / ADR-011 tiling / instrument-writer confound, each needing a fresh preregistered
  gate) were sight-approved and applied to docs/07. Full record: `kernel/RESULTS.md` ninth section,
  `docs/07` line 22. *(NB: an earlier "2,012,436 / 0.6% over" figure was a custodian synthesis error
  — the file's true total is 2,508,699 / 25.4% over; the 2,012,436 was a refusal-moment partial sum.
  Corrected in the record.)*
- **2026-08-13 — Entry 0 (resident-vertex ceiling) resolved: option (a) + three riders, executed.**
  The 100k walkthrough fixture exceeded `MAX_RESIDENT_VERTICES` by construction (not a residency
  bug — an authorized instrumented session proved it). Fix: happy-path fixture regenerated under the
  ceiling (1,885,130 vertices, hard-asserted ≤ 1,950,000); a deliberate over-ceiling fixture +
  E2E OVERCEIL′ step + walkthrough Part D; a persistent non-dismissible `.residency-status`
  indicator (rider 1 — dismiss hides the banner, never the status); the remount-race footgun fixed
  with a regression test (rider 3); ADR-011 gained acceptance gate 8 — the ceiling refusal is the
  honest interim, not the forever behavior, and the tiling/LOD slice owes what replaces
  whole-dataset residency (rider 2). All twelve regression steps green on a verified-fresh run.
  Full record: `kernel/RESULTS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, ADR-011 gate 8.

*(Older intermediate authorizations — the instrumented-session grant, the walkthrough-hold — folded
into the resolutions above. Full narrative history in git and in `E2E-STATE.md` / `CUT-STATE.md`.)*
