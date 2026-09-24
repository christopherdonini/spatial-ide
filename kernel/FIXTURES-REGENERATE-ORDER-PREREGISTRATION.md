# Fixture regenerate order — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: state/directives/2026-09-22-part-n-n8-and-sequencing.md:159 (the three clean-clone repairs as bounded pieces, not a tooling redesign); DECISIONS-PENDING.md entry 115, item (a); kernel/RESULTS.md, the drill's section "### Step 2 — fixture regeneration (`kernel/FIXTURES.md`)"; PLAN.yaml node drill-fix-fixture-watchdog; AUTONOMY.md §21d.
Scope: kernel/FIXTURES.md only (the parcels-5gb table's Regenerate row and one note beneath the table); declared line budget <= 12 changed lines (insertions plus deletions), this form excluded.
Change: the Regenerate command names the generating test with --exact, so the publish half of kernel/tests/scale_pass.rs, which needs the fixture this test writes, is no longer started beside it; a note records the post-write silence-ceiling firing as known and pending the human's decision (DECISIONS-PENDING.md entry 121).
Tests+mutation: no test covers a documentation command (stated plainly); the check is `cargo test --release -p spatial-kernel --test scale_pass -- --list --ignored` read against the new --exact filter (it selects measure_the_five_gigabyte_scale_pass and not measure_publish_at_five_gigabytes), without running either test; no mutation, since no test is added.
Out-of-scope: kernel/SCALE-PASS-PREREGISTRATION.md is not amended (its header's amendment rule would invalidate the recorded run); no watchdog ceiling, silence scope, harness code or fixture byte changes; the post-write silence-ceiling firing (entry 115 (a)'s second half) is queued for the human as entry 121, not fixed; no ADR, wire, security or guarantee text.
```
