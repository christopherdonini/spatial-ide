# PR #197 gate 1 — architect, attempt 2
Reviewed: cut/covering-names-missing-column @ 4e77715c7531e35d8fb3ee82c836ead307e794bd

**Verdict: PASS with one Documentation finding (D3), which must be fixed before the merge.** E1 is resolved. Correctness carries forward from gate 1 under `AUTONOMY.md` §22's carry-forward rule. Nothing but a doc comment changed.

I have no shell. I did not recompute the comment-only hash (177b83e4…), the diffstat, or any sha256. The reviewer owns those. One check I could make agrees with the custodian's 3 insertions and 2 deletions: the function's line moved down by exactly one line (`fn field_path_exists` is now at `engine/src/dataset.rs:1446`).

## Evidence: pass (E1 resolved)

**E1: resolved.** The doc comment at `engine/src/dataset.rs:1439-1445`, byte-copied from `engine/src/dataset.rs:1443-1445`:
"covering-names-missing-column form, Amendment 1, item 4). The P0 showed a top-level name
differing by a non-ASCII letter's case not binding; a non-ASCII child name is outside what
this piece claims."

- **The claim now matches row g.** The non-ASCII clause covers a top-level name only, which is what row g showed (`state/drafts/covering-names-missing-column-p0/p0-output.txt:50-63`: `böx` written, `BÖX` declared, so the oracle and the bbox stream both get a binder error).
- **The required exclusion is there.** The comment says a non-ASCII child name is outside the claim, as §1 and Amendment 2, item 4 require.

**The rest of the comment: no claim beyond the evidence.**
- **Lines 1441-1443.** These describe what the code does, and the code does it: `eq_ignore_ascii_case` at both levels. They name the source of the rule as Amendment 1, item 4, which records it as the selected rule from rows d, e and g. Row d (`p0-output.txt:32-37`) and row e (`:38-43`) bind, so ASCII case-insensitivity is shown at both levels. The non-ASCII part at child level is not shown, and the next sentence puts it outside the claim. Read together, the sentences claim no more than the P0 showed.
- **Line 1445.** "It is DuckDB's rule, never a filesystem's or an OS's" repeats §2a's design statement and §2g's R4 point. It is not a new claim about the binder.

## Correctness: pass (carried forward)

The one commit changes only comment lines. §8 items 1-13, the seams, the caller rule and the round-25 checks are as gate 1 reported them.

## Documentation (must fix before the merge; no re-gate)

**D3. Amendment 4 has no superseded index.** Amendment 4 is a correction. It replaces two references in Amendment 3: the hash reference in item 1 and the line cite in item 4. Round 12, item (e) says a correction round ends with a superseded index, and Amendment 4 does not carry one. Amendment 2, item 6 shows the form this takes.
- **Fix:** do not add another correction amendment. The custodian's closing amendment, which is already owed, carries the index: Amendment 3, item 1's hash reference → Amendment 4; Amendment 3, item 4's line cite → Amendment 4.

## Notes on D1 and D2 (not findings)

- **D1 (Amendment 4): the fix is right, apart from D3.**
  - It is three sentences, within the round 12, item (d) ceiling, and it does not restate Amendment 3's claims.
  - Item 4's reference is now by amendment and item, not a bare line cite. "The fifth line of the span that Amendment 2, item 1 pins" (`:15-20`) is line 19 of `state/directives/2026-10-09-rulings-on-the-eight-forms.md`, which is the KNOWN-LIMITATIONS sentence after its lead-in. That is correct.
  - Item 1's hash is now tied to the main commit d007a50bbc01e599229a48c70ca726eddec3a4d8. I cannot check without a shell that this commit added the report. The reviewer should confirm it with `git log --diff-filter=A` on the report path, and confirm the commit is on main.
- **D2 (the PR body): I could not read it.** The body is not in the tree and I cannot run `gh`. The custodian or the reviewer should confirm that line 1 now limits the refusal to a bbox `viewport_query`, which agrees with K-1's assertion that a no-bbox query still mints.
- **§7's count of 637** is one line over Amendment 3's 636, because of this comment. As the brief says, the closing amendment records it as class 8 (round 25, item 2). §7's line is not edited.

No ADR skeleton is needed.
