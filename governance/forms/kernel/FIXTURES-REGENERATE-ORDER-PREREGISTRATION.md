# Fixture regenerate order — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: state/directives/2026-09-22-part-n-n8-and-sequencing.md:159 (the three clean-clone repairs as bounded pieces, not a tooling redesign); DECISIONS-PENDING.md entry 115, item (a); kernel/RESULTS.md, the drill's section "### Step 2 — fixture regeneration (`kernel/FIXTURES.md`)"; PLAN.yaml node drill-fix-fixture-watchdog; AUTONOMY.md §21d.
Scope: kernel/FIXTURES.md only (the parcels-5gb table's Regenerate row and one note beneath the table); declared line budget <= 12 changed lines (insertions plus deletions), this form excluded.
Change: the Regenerate command names the generating test with --exact, so the publish half of kernel/tests/scale_pass.rs, which needs the fixture this test writes, is no longer started beside it; a note records the post-write silence-ceiling firing as known and pending the human's decision (DECISIONS-PENDING.md entry 121).
Tests+mutation: no test covers a documentation command (stated plainly); the check is `cargo test --release -p spatial-kernel --test scale_pass -- --list --ignored` read against the new --exact filter (it selects measure_the_five_gigabyte_scale_pass and not measure_publish_at_five_gigabytes), without running either test; no mutation, since no test is added.
Out-of-scope: kernel/SCALE-PASS-PREREGISTRATION.md is not amended (its header's amendment rule would invalidate the recorded run); no watchdog ceiling, silence scope, harness code or fixture byte changes; the post-write silence-ceiling firing (entry 115 (a)'s second half) is queued for the human as entry 121, not fixed; no ADR, wire, security or guarantee text.
```

Budget: 9 of 12 changed lines across 1 file (kernel/FIXTURES.md; git diff --numstat origin/main...HEAD, this form excluded); the --exact filter checked by `--list` (1 test selected against 2 without it), neither test run; commit 5f52a67.

Closing round after reviewer attempt 1 PASS-with-notes (2026-09-24): the Authority line's cite is pinned as `state/directives/2026-09-22-part-n-n8-and-sequencing.md:159 @ eab8e82 sha256:a815f8782a3b4cd7d909f7a588e27e75fcb611e60d114e2fca0ceaf6721769e4`; the note now says the silence ceiling fires after the final chunk's progress event and tells an operator to check the file against the table's Size and SHA-256 whenever that watchdog fires; budget after the round: 10 of 12 changed lines across 1 file (kernel/FIXTURES.md; git diff --numstat origin/main...HEAD, this form excluded).
