Reviewed: PR #289 at dccbb3e836ea11887369b0a6f8b06c30e099342f (base 0f9edda8), gate 1, architect. Branch and commit: cut/publish-session-tier-identity @ dccbb3e836ea11887369b0a6f8b06c30e099342f
Verdict: PASS WITH NOTES (WORDS-ONLY)

All cites below are to the head, dccbb3e8, in `C:/dev/wt/psti`. "main" means `C:/dev/spatial-ide` at c062f4af, which the packet says equals the base for the nine files. I have no shell, so this report gives no sha256 and runs nothing. I leave no background shell.

## Findings

**Correctness: none.** The code does what the form's §1 and §2 say: the session check, the scope's prediction, the write-time guard, the caveat for each tier, and the routes.

**Evidence: none blocking.** I could not run anything, so I relied on these records:
- item 1: phase 1's report, "## P-0" and "## K-U1 on the unfixed code";
- items 3 and 12: phase 1's "## Mutations" and "## The ignored tests", and phase 2's "**M-2**" and "**Checks at HEAD dccbb3e8**";
- item 11: the test files, read at the head;
- item 16: phase 2's "**CI on dccbb3e8**". It covers runs 42213359719, 42213359747, 42213359533 and 42213359591. Nothing I could read gives the conclusions of the pull_request-event runs 42220817*, and 42220817907 (Rust workspace at the head) is among them. The reviewer reads those.

Under Part 1 item 9, the mutation observations belong to the reviewer.

**Documentation: four sentences, must-fix before the merge.** None is the human's wording or a red-line text, so the worker applies my words with no re-gate and lists them in the PR body.

- **W-1. `kernel/src/publish/error.rs:222-226`, `ReaderCeilingExceeded`'s doc (form §2.6, place 2).**
  - Requirement: place 2 must be rewritten, and Part 1 item 1 needs the sentence true against the code.
  - Evidence: error.rs is 18/0 in the numstat, so no line of it was deleted. The text is byte-identical to main's error.rs:212-216. It still calls `CeilingExceeded` "this operation's own declared limit (`MAX_PUBLISH_PARTITIONS`)". At the head, `CeilingExceeded` is also raised for the reader's `MAX_FEATURES` (ceilings.rs:193-197, called at mod.rs:837).
  - Phase 1's report, at its "Place 2" line, says this doc was edited in commit 4. It was not, so the closing record must not carry that claim.
  - Closure: replace lines 222-226 with:
    ```
    /// alternative. Distinct from [`Self::CeilingExceeded`], which is raised when a limit is reached,
    /// never from a prediction: among others, this operation's own `MAX_PUBLISH_PARTITIONS` at write
    /// time, and the reader's `MAX_FEATURES` at write time when preflight predicted no row count for the
    /// scope (a bbox scope, or a `DeclaredNotVerified` identity) and the rows written would cross it
    /// (`ceilings::check_streamed_features`). This variant is the reader's limit as predicted at
    /// preflight (`renderer/bundle-viewer/ceilings.json`, read via
    /// [`crate::publish::ceilings::reader_ceilings`]), checked in `preflight` wherever it is
    /// predictable there.
    ```
  - Clause check:
    - "raised when a limit is reached, never from a prediction": true at every site (mod.rs:826-831; ceilings.rs:191-197; viewer_assets.rs:61 and :70).
    - "`MAX_PUBLISH_PARTITIONS` at write time": true, mod.rs:826-831 is inside the partition loop.
    - "`MAX_FEATURES` at write time … no row count … bbox or `DeclaredNotVerified`": true, mod.rs:837 and ceilings.rs:171-176.
    - "the rows written would cross it": true, `saw = rows_written + batch_rows > max` (ceilings.rs:191-192).
    - The last sentence is unchanged from the current doc.

- **W-2. `kernel/src/publish/mod.rs:600-602`, `preflight`'s doc.** This is a sibling of place 4.
  - Evidence: it still sends the reader to `preflight_pinless`'s "one named residual", but that doc (mod.rs:410-423) now names two cases.
  - Closure: replace "(see that function's own doc comment for the reordering and its one named residual)" with "(see that function's own doc comment for the reordering and the two cases it cannot help)".
  - Clause check: mod.rs:410-417 lists `DeclaredNotVerified` and a bbox scope. True.

- **W-3. `kernel/src/publish/mod.rs:1489-1493`, `identity_caveat`'s doc.**
  - Requirement: OPEN-7 (a), as the custodian's settlement took it, says the viewer showing the caveat is "recorded in the source comment".
  - Evidence: the doc does not record it.
  - Closure: append to the doc:
    ```
    /// The bundled viewer shows this caveat (`renderer/bundle-viewer/src/main.ts`, its
    /// `identity-caveat` text). Neither first sentence written for the unverified tiers is reached in
    /// ordinary use: the wire carries no skip field and `IdentityDeclaration::new` sets
    /// `skip_uniqueness_check` false, so no product route opens a dataset `DeclaredNotVerified`, and
    /// the session tier is refused at preflight.
    ```
  - Clause check:
    - main.ts:310 is `text('identity-caveat', m.identityCaveat)`. True.
    - skp.rs:1726-1733 shows the wire has no skip field and `new` sets it false. True.
    - A grep of the `.rs` files under kernel/, engine/, frontends/ and protocol/ finds `skip_uniqueness_check = true` only in tests. True.
    - The session tier is refused at mod.rs:518-520, before `build_manifest`. True.

- **W-4. `engine/src/identity.rs:100-103`, `is_session_ordinal`'s doc (place 6).**
  - Evidence: the rewritten sentence keeps an untrue clause, "the identity scan that does not run". No file under engine/src calls `is_session_ordinal`; a grep of engine/ finds only the definition and four test files. The product callers are kernel/src/skp.rs:2025 and kernel/src/publish/mod.rs:518.
  - Closure: replace lines 100-103 with:
    ```
    /// Whether this identity is the session tier. Asked by the sites that must behave differently
    /// for it — the statement `describe` carries (`kernel/src/skp.rs`) and the publish preflight,
    /// which refuses a dataset of this tier — so that neither has to re-derive the class from a
    /// string.
    ```
  - Clause check: both named sites call it (skp.rs:2025; mod.rs:518). True. This is still a doc-only change to identity.rs.

**For the human, red line (OPEN-5 (a) and OPEN-4 (A)).** These are proposed words, not a WORDS-ONLY fix. They are not blocking, because the words cannot merge without the human's approval at the click.

- **H-1. KNOWN-LIMITATIONS item 5, heading (lines 82-83).**
  - Read as "above any one of them", the clause "a whole-file publish above one of them is refused before anything is written" is untrue in ordinary use for `MAX_RESIDENT_BYTES`: a whole-file publish over 512 MiB resident publishes unwarned, as item 6 says (ceilings.rs:112-115).
  - Main's heading had the same clause, and item 6 qualifies it straight away.
  - Proposed: "The published bundle has declared ceilings, and a whole-file publish predicted above `MAX_FEATURES` is refused before anything is written (item 6 names the ceilings no prediction covers)."
  - Clause check: with no bbox and a verified count, `predicted_features` is `Some` (ceilings.rs:171-176). `check_reader_ceilings` then refuses before the pin (mod.rs:574-578), and the shell refuses before `ensure_pinned_with_progress` (shell publish.rs:455-472). Item 6 names `MAX_RESIDENT_BYTES` and `MAX_PARTITIONS`. True.

- **H-2. Item 5's source comment (line 94).** Under §31, two cases that ordinary use does not reach should be named there.
  - A `DeclaredNotVerified` whole-file publish above the ceiling is refused at write time, after the approval, and not at preflight. It is reachable only through the engine API.
  - If the staging folder cannot be removed, the refusal's prefix is `publish.staging_not_removed` and that folder stays beside the destination (mod.rs:663-670). This also touches place 7's "prefixed `publish.ceiling_exceeded: `".
  - Proposed comment text: "Not reached in ordinary use: a `DeclaredNotVerified` identity (engine API only) is not predicted in either scope and is refused while its rows are written; a staging directory that cannot be removed turns the refusal into `publish.staging_not_removed`, with that directory left beside the destination."

- **Note on the existing `CeilingExceeded` Display (OPEN-6 (i), a P6 string, unchanged).** For a Current-view refusal, "saw N" is the running total at the batch that crosses the ceiling, not the view's row count. This is for the human's sitting, not a finding.

**Record notes:**
- The size, 985 against 700, is class 8 on the closing record (§7). §10 is still empty, and the §7 line is not edited.
- Neither report says the heavy runs used the branch's own cargo target (the first half of item 13). Each report lists its shared holds.

## Check 1: §1's readings against the head

- **ADR-016 Amendment 1, item 1.** Met.
  - The session tier is refused at mod.rs:513-520, inside `preflight_pinless_parts`. It reads only `ds.identity().source()`, never the query.
  - Every route passes through it: `preflight` (612), `publish_unguarded` (637), `boundary::execute` (boundary.rs:329), the shell (shell publish.rs:455 and 581), and the CLI, through the boundary (publish-bundle.rs:669).
  - `publish_prepared` is `pub(crate)` and called only from the boundary and `publish_unguarded`. `PublishPreflight` has private fields and is built only at mod.rs:617, so no bundle can carry the generation.
- **ADR-025's Decision.** Met. A prediction exists only where it is the scope's own (ceilings.rs:171-176). The guard, for what preflight cannot predict, is at mod.rs:833-837. The Decision is silent on it (OPEN-2 (A)), and the head claims no ADR note.
- **ADR-017.** Met.
  - The verified caveat's bytes equal main's mod.rs:1444-1447, from my reading of both literals and the `format!` at head :1505-1509. No member or key changed: kernel/src/bundle is not among the changed files.
  - The caveat keeps "Stability across reopen is NOT established".
- **ADR-006.** Met. `OPERATION_CLASS` is unchanged (mod.rs:109). The boundary order (boundary.rs:9-19) is unchanged. A preflight refusal comes before the destination is resolved (boundary.rs:329-330). The guard fails through the recovery-policy-`none` path, which removes staging (mod.rs:663-670).
- **Principles 8 and 3.** Met. The caveat no longer states a verification that never ran. The engine statement that a session identity is never published (identity.rs:150-154) is now true of publish.
- **Wire, Strings, Portability.**
  - Wire: nothing under protocol/. The new code rides `refusal_detail` (error.rs:309-311), and the shell's parser accepts any `publish.<snake>` prefix (formatPublishRefusal.ts:44).
  - Strings: one new shown string, error.rs:433-438, carrying `[P6 placeholder] `.
  - Portability: no OS-dependent code.
- **"May not claim".** Nothing excluded is claimed: no performance figure, no `MAX_RESIDENT_BYTES` or `MAX_PARTITIONS` prediction, no stability of the session tier. The "finished in" times appear only as raw test output in the reports, not as figures in the head.

## Check 2: block-on-sight, items 1 to 16

1. Met, on the record. 8f096353 (K-U1 alone) comes before ad2b5279 (the fix), by the packet's parents. Phase 1's report records K-U1 failing by name at commit 1, and P-0 at 9a4546ba. P-0 ran before the fix by the report only.
2. Met by reading (Check 1).
3. Met by reading (ceilings.rs:171-176). The unit tests are at ceilings.rs:297-347. K-U10a's run is on the record.
4. Met by reading: `>` at ceilings.rs:192, the guard (mod.rs:837) before `write_partition` (mod.rs:839), and staging removed on failure. K-U10b asserts no destination and no staging folder; its run is on the record.
5. Met (Check 1, ADR-017).
6. Met. ceilings.json is not changed. `CEILINGS_JSON_HASH` equals main (ceilings.rs:224-225 against main :181-182). No `MAX_*` value changed. The only new constants are test constants in publish_identity_tier.rs.
7. Met.
   - The two `pub(crate)` helpers are not "a new `pub` item" under the form: §2.3 and §2.4 propose them as `pub(crate)`, and §2.7 says "No `pub` item is added; the helpers are `pub(crate)`". Each has a product caller (mod.rs:575, :837).
   - The new variant sits on an existing `pub` enum. The form declares it in §2.1, and it has a product caller.
   - The nine paths come from the packet's numstat, which I could not re-run.
   - identity.rs is changed in its doc only: lines 100-103 at the head against main's 100-102.
8. Met, on the packet's git facts. Phase 2's commits e5a96db7 and dccbb3e8 follow 16cbe5ef, which merges in 0f9edda8. Phase 1 never touched the shell's publish.rs.
9. Met. §10 is empty. The §2.6 sentences are clause-checked here (Check 4). The KNOWN-LIMITATIONS words are unmerged and go to the human.
10. Met. The Display is marked and does not advise an identity declaration.
11. Met by reading. No sleep, retry or timeout; the `Duration::from_secs(600)` is a grant TTL, not a timeout. Both ignored tests say "Not run in CI." Their runs at the head are on phase 2's record.
12. Met on the record. Each `RECORDED MUTATION:` line names its commit and a failure that matches the reports. No record calls a `verify-mutation` run an observation.
13. Holds: met on the record. Own target: not stated (record note above).
14. Met. Main's five ceilings.rs unit tests (:165-241) are unchanged at the head (:209-284). kernel/tests/publish.rs and kernel/tests/permission_boundary.rs are not among the changed files.
15. Met. The head claims nothing beyond §1. Place 7's execute-time sentence is read from the code, and the existing test at shell publish.rs:3056 proves the typed-code mapping.
16. Not verified by me (see Evidence). The reviewer reads 42220817*.

## Check 3: the seam (S-U1, shell publish.rs:2951-3053)

- It calls the real `prepare_with_progress` (shell publish.rs:419) in both scopes (2978-2991).
- It asserts `Refused` with the prefix `publish.session_identity_not_publishable: ` (3031-3036).
- It asserts R3's three claims: no pin (3039-3042), no pending attempt (3043-3047), no destination (3048-3051).
- It uses the real types: `PublishScope`, `JsBbox`, `GrantSet`, `PendingAttempts`, `Dataset`.
- The input comes from `Dataset::open` (3006). This is the same `open_inner` with no assertion and no declared identity that `Catalog::open_cancellable` reaches (engine dataset.rs:222-230 against :296-308). Only the pool configuration differs, and the session-tier precondition is asserted (3007-3010).
- **M-2 as §4 states it fails S-U1 at the no-pin assertion.** With the check moved into `preflight` after `SourceNotPinned`, this happens:
  1. `preflight_pinless` passes FX-S, which has no count, so there is no prediction.
  2. `ensure_pinned_with_progress` pins it (468).
  3. `prepare_with_query`'s `preflight` refuses it (581-591), with the right prefix.
  4. So the message assertion passes and the whole-file pass fails at 3039-3042. That is the message phase 2 recorded.

## Check 4: sentences written after the code

| Place | Status at the head |
|---|---|
| 1 (error.rs:186-194, 432-438) | true; the Display gives the identity fact and the format fact, with no advice |
| 2 | not written (W-1) |
| 3 (ceilings.rs:117-124, 164-185) | true |
| 4 (mod.rs:46-59, 410-423, 513-517, 553-565, 833-836, 1489-1493) | true; the sibling at 600-602 is W-2, the missing OPEN-7 record is W-3 |
| 5 (boundary.rs:59-61) | true |
| 6 (identity.rs:100-103) | one untrue clause (W-4) |
| 7 (shell publish.rs:401-417) | true, except for the staging-not-removed case, which ordinary use does not reach (H-2) |
| 8 (KNOWN-LIMITATIONS items 5 and 6) | each new clause is true against the code: Current view not predicted; refused only above `MAX_FEATURES`; while rows are written; after the approval (boundary.rs:15-17); nothing at the destination; item 6's write-time sentence. The heading goes to the human (H-1). The comments' line cites error.rs:450-456 and ceilings.rs:108-115 resolve at the head. |
| 9 (kernel/README.md:387) | one entry |
| 10 | each test doc claims only what it asserts. K-U1 cites 435be20a with the R1 message (phase 1 M-1); K-CAV 435be20a with R5 (M-3); U-PRED's bbox test 435be20a with `Some(3300000)` against `None` (M-4); U-GUARD's at-ceiling test 435be20a (M-5); K-U10a 435be20a (M-6); K-U10b 435be20a with 2000001 rows (M-7); S-U1 e5a96db7 (M-2). |

## Check 5: scope and the declared-unchanged list

- Nine files, by the packet's numstat.
- engine/src/identity.rs: doc only.
- The shell's publish.rs: 121/3, which is place 7 (17 lines replacing main's 401-403) plus S-U1. No product code changed.
- KNOWN-LIMITATIONS.md: 12/8 lines, all inside items 5 and 6 and their two comments. I compared main's and the head's text line by line, and the counts add up to exactly those hunks. Item 3 (lines 62-70) is byte-identical to main.
  - Phase 1's report also gives 12/8 for this file, so the hunks match. The context lines differ because main changed item 4 (lines 77-80) between the phases. I compared the files, not the two diffs.
- kernel/README.md: one entry.
- `ReaderCeilingExceeded`'s Display, `check_reader_ceilings`'s body, `VIEWPORT_BBOX_ALTERNATIVE` and the ceilings hash are unchanged.

## The packet's gaps

- The conclusions of the pull_request-event runs 42220817* at the head. They are given as locators only, and I have no shell to read them.
- Whether each phase's heavy runs used the branch's own cargo target. No record states it.
- The commit list shows that 0f9edda8 contains U12's merge (#285) only through a truncated merge subject.
- Phase 1's own KNOWN-LIMITATIONS.md hunks, as text. I compared the files instead.
- That error.rs has 0 deletions against phase 1's report claiming place 2 was edited. The packet's numstat showed it, but nothing flagged it.
