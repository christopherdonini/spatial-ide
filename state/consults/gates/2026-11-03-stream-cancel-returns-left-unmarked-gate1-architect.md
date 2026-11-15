Reviewed: PR #277 at 48600edc42d3d5caf585153b583cd556e7515651 (base 7b311b11), gate 1, architect. cut/stream-cancel-returns-left-unmarked @ 48600edc42d3d5caf585153b583cd556e7515651
Verdict: PASS WITH NOTES

Method: I have no shell, so I computed no sha256, ran no git and ran no test. I leave no background shell. I read the head in `C:/dev/wt/scrlu` and read B's files as main's (the brief says no engine file changed on main past B). The numstat, the CI and the mutation runs are taken from the worker report and the custodian's git check. I did not reproduce them.

## Findings

**Correctness: none.** **Evidence: none blocking.** One evidence item is still open, and it is the form's own: the Tests+mutation line says "Unchanged and green ... after (the PR's CI)". I cannot read CI. The custodian confirms the PR's CI is green before the PR leaves draft.

**D1 (Documentation, must fix before the merge; the wording is the worker's, not the human's).** At engine/src/stream.rs:3225-3229 (head), the revised doc of `the_pre_prepare_cancel_exit_stamps_producer_cancelled` keeps "The SQL is invalid on purpose, and `classify` now stamps too:". That clause now names a purpose the SQL no longer serves:
- M-2 keeps the check's `return`, so `prepare` is never reached and M-2 is caught whatever the SQL is.
- If the whole check were deleted, the stamp would still be supplied: by `classify` with invalid SQL (1803 → 2635-2636), or by the guard's `Cancelled` arm with valid SQL (1846-1847).

Replacement words, for the doc's first paragraph (the RECORDED MUTATION paragraph stays), wrapped under 100 columns:
"The pre-prepare cancel exit in `produce` stamps `PRODUCER_CANCELLED` and returns before `prepare`. Deleting only this check's mark, its `return` kept so `prepare` and `classify` are never reached, is what this test catches. The SQL is invalid, as it was before `classify` marked; deleting the whole check would leave `classify`'s mark to supply the stamp, so that would not be caught, and it is not a recorded mutation. Mutation: remove the mark from that check."

Each clause checked against the code:
1. "stamps … and returns before `prepare`": the mark is at 1795 and the `return` at 1796; `prepare` is at 1802.
2. "Deleting only this check's mark … is what this test catches": M-2 was observed at c63e5daf and failed at the presence assertion (the worker report; the RECORDED MUTATION at 3231-3233).
3. "The SQL is invalid, as it was before `classify` marked": "this is not sql" is at 3250 (head) and at 3247 (base).
4. "would leave `classify`'s mark to supply the stamp": an invalid prepare errors, `map_err` calls `classify` (1803), and `classify` reads the flag set and marks (2635-2636).
5. "so that would not be caught": by reading, all three assertions (3264, 3265, 3266-3272) would hold. This was not run, which is why the sentence says "would".
6. "not a recorded mutation": the form, item 1, third bullet.
7. "Mutation: remove the mark from that check.": this is M-2.

Because the wording is not the human's, the worker applies these words with no re-gate and the PR body lists them (AUTONOMY §31).

**D2 (Documentation, record; fix before the merge).** In governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md (the custodian's settlement, OPEN-1 bullet), the 4a ruling is cited as `state/directives/2026-10-30-…-rulings.md`, "line 17": a bare line with no commit and no hash. Under round 14, a reference that must carry a line is pinned `path:line @ <commit> sha256:<hex>`. I read the line and its content is right ("4a, engine-cancel-before-execute-siblings: … OPEN-2 (a); …"). The fix is one appended amendment row (the form is append-only) that pins that line at a main commit. The custodian computes the hash, because I have no shell. The form is excluded from the Scope count.

## Check 1: the constitution and the ADRs
- **docs/01 principle 7 and docs/05:83 (cancellable queries).** Every exit's outcome is unchanged, so cancellability is unchanged.
- **ADR-018 item 1** (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46). `classify` loads the flag once (2635). When it reads set, it marks (2636) and returns `Cancelled`, and its caller returns out of `produce`. That is "loads the flag set and stops advancing".
- **The stamp's new position.** The stamp now follows `e.to_string()` and `fetch_panic_duckdb_text`. That is bounded in-memory work, and form item 3 row 2 discloses it. No figure is claimed, so ADR-018 item 2 scoring and docs/08 are not engaged.
- **ADR-018 item 4.** The prepare exit is named as class (b), and no bound is derived.
- **The parent forms.**
  - The flush form §2.3 (STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:112, :119-121) left the prepare row and the two-read-window row out, and gave this node "a classify that marks when it returns Cancelled" as an option (:123). This piece takes that option.
  - The flush form §2.6: stamps with no request on a drop path already exist at the other exits, and `segment_ms` gives None there. This piece adds no new class of such stamps.
  - 4a's form (ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md:10) has the same Out-of-scope shape.
- **The outer reads are removed.** At base, the execute-`Err` arm had them at 1853-1855 and the fetch-panic arm at 1936-1938. At head, 1850-1855 and 1922-1927 call `classify` or `classify_fetch_panic` directly, with nothing marked after.
- **Other `PRODUCER_CANCELLED` stampers.** A grep over engine/src outside stream.rs found only the definition (trace.rs:441) and its doc (trace.rs:383). cancel.rs:135 stamps `CANCELLATION_REQUESTED` only.
- ADR-006, data plane versus control plane, and cross-module seams: none touched. No `pub` item is added; `classify` is still private.

## Check 2: the five lines against the head
- **Scope.** The diff touches two files, +91/-29 and +3/-3, 126 lines against 150 (the custodian's git check). My count of the stream.rs hunks by reading accounts for every line, with nothing else in the file:
  - insertions 91 = classify doc 6 + mark 1 + prepare comment 2 + execute comment 3 + fetch comment 5 + T-2 doc 9 + locks 6 + T-3 59;
  - deletions 29 = 3 + 7 + 15 + 4.
- **Change.** Every clause holds at 1799-1803, 1850-1855, 1922-1927 and 2628-2643.
- **The send arm.** It is unchanged: base 2580-2591 matches head 2568-2579.
- **Tests+mutation.**
  - T-3 (3276-3333) takes the lock first, starts trace 1, cancels, asserts (i), drops the guard, starts trace 2 and asserts (ii). It asserts presence only.
  - The two `classify` unit tests take `TEST_LOCK` first (2737-2739, 2800-2802), and their assertions are unchanged by reading.
  - T-2's assertions are unchanged (3264-3272 against base 3261-3269).
- **Out-of-scope.**
  - ADR: no file under docs/adr.
  - Security: untouched.
  - Wire: no SKP, MCP, data-plane or kernel file.
  - Guarantee: touched. §36 (governance/AUTONOMY.md:692 on main) sets §25 (e) aside for a filler, so the rule that a five-line form naming a §21a category fails is set aside here.
  - No dependency, product seam, `pub` item or string a user sees is added.

## Check 3: the claim
- **Outcomes are unchanged.** At base, `classify`'s own read already decided `Cancelled` and the outer read decided only the mark. At head, the one read decides both.
- **At most one stamp per stream.**
  - Each product call of `classify` is followed by a return out of `produce`: 1803 by `?`, 1854, and 1927 through `classify_fetch_panic`.
  - Every other stamp site is also followed by its return: 1795→1796, 1847→1848, 1899→1900, 1992→1993, and flush 2549→2553 then `?`.
- **The send row.** It is left byte for byte, and nothing is claimed for it (OPEN-2 (a)).
- **No time bound and no docs/08 figure** is claimed in the code, the README or the form.

## Check 4: the records
- **The settlement.** OPEN-1 (A) and OPEN-2 to OPEN-5 (a) are each lead-data's recommendation. They are taken under the 2026-10-31 directive, item 4, which I read, and dated 2026-11-03 for the human's review. None falls in item 4's red-line list:
  - OPEN-2 (a) is an answer to the node's own question ("is a disconnect an observation"). It does not narrow the node.
  - (B), (C) and (D) were not taken.
- **The custodian's readings.**
  - The doc at kernel/tests/skp_filter_cancellation.rs:112-121 is a historical account and stays true.
  - The governance paths: MOVED.tsv has no row for either new form, and the flush form maps at MOVED.tsv:54. Both forms exist at B in the worktree.
  - The send row: nothing rests on it.
  - D2 above applies to the settlement's bare line cite.
- **The RECORDED MUTATION lines.**
  - M-3 (3287-3289) and M-2 (3231-3233) each name commit c63e5dafdc17ba2ab73f641b3947fbe4bf1bca6e in full, each says the mutation was applied alone, and each names its failing assertion by its message.
  - The worker's panic lines (3298:9 and 3261:9) agree with the head lines minus the doc lines commit 3 added and the one line each mutation deletes (3307-8-1, 3266-4-1).
  - Neither line calls a verify-mutation run an observation. Neither carries a hash pin at a branch commit.

## Check 5: the docs, clause by clause
- **`classify`'s doc (2628-2633).**
  - "returned first": the first branch.
  - "stamped on the same single read that decides it": 2635-2636.
  - "every `Cancelled` this returns carries its `cancel_observed`": true whenever a trace is live; `mark` is a no-op otherwise, as at every other site.
  - "every call is followed at once by a return out of `produce`": true of every product call. Only tests call it elsewhere, and no test is in the shipped build.
  - "at most once": see check 3.
  - The out-of-range clause and the phase/message clause: unchanged code.
- **The prepare comment (1799-1800).** True: 1803 calls `classify`, and 2636 stamps.
- **The execute-`Err` comment (1851-1853).** True. The interrupt-as-`Err` sentence is carried from base 1851-1852.
- **The fetch-panic comment (1922-1926).** True. The account of the panic is carried from base 1926-1931, and the stamp comes through `classify`.
- **T-3's doc.** True. (i) covers the prepare and execute route, (ii) the fetch route, and M-3 fails at (i). The lock paragraph is identical to T-1's.
- **T-2's revised doc.** True except the first clause: see D1.
- **engine/README.md.**
  - Producer trace row (551): T-3 is appended, and it exists at c63e5daf and at head.
  - The preregistration list (557) gains both governance paths. Both exist at 7b311b11, and they are in alphabetical order (CRS < ENGINE < EXTENSION; STREAM-CANCEL < STREAM-FLUSH). This is OPEN-5 (a).
  - Last verified (537): "two governance paths, at 7b311b11" and "pointer, at c63e5daf" both resolve. Both commits are reachable from main once the PR merges by merge commit.

No ADR skeleton is owed: no decision is missing.
