# The identity scan refuses a null by name: the build at f6614e15, the worker's report

*Filed by the custodian, 2026-11-27. The build of identity-scan-refuses-a-null-by-name in D:/wt/nullname, on the C1 piece's head f7770e1aa225b7902ea56a77c0d0dbd8321fb942 (the form's Amendment 4 item 1), to f6614e15043056e058c18c422aa5282f18b0c8c0 on cut/identity-scan-refuses-a-null-by-name. A sonnet worker (worker-high) made it, with no app, dev server or e2e suite started. Its run, by the facts script, has its first record at 2026-11-27T22:01:21Z and its last at 2026-11-27T23:24:49Z; by its completion notice it took 5008556 ms and 96 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (8049 bytes, sha256 7e6eaf3f5b8a8a06e07211de723e3904c07b2184d17e43dc5ab16940ce0870df), byte for byte. Its account is the worker's; the gates check it.*

---

f6614e15043056e058c18c422aa5282f18b0c8c0 is pushed to origin/cut/identity-scan-refuses-a-null-by-name, and every step completed. I opened no pull request. The tree is clean after the push.

**Re-read at the base f7770e1a (§8), before any code**
- I mapped every cited span by script. It took each span's text at 20ed759b and searched for the same lines in the base file.
- Every `dataset.rs` span in §2.1 and §2.2 moved and still holds. The scan shape is intact (one `format!` statement, one `execute_guarded` call, one `fetch_add`), so there is no invalidator.
- `engine/src/dataset.rs` moves, old to base:

| old | at the base |
|---|---|
| 2045-2050 (SQL) | 2125-2130 |
| 2063-2074 (guarded call) | 2143-2154 |
| 2063-2069 | 2143-2149 |
| 2108-2149 (`run_identity_scan`) | 2221-2262 |
| 2122-2127 (count reads) | 2235-2240 |
| 2136-2144 (min/max) | 2249-2257 |
| 2128-2147 | 2241-2260 |
| 2100-2105 (admitted arm) | 2182-2187 |
| 2041-2044 ("One pass") | 2121-2124 |
| 2056 (counter comment) | 2136 |
| 2030-2039 (skip arm) | 2110-2119 |
| 2091-2095 (repeat detail) | 2172-2176 |
| 87 (instrument) | 96 |

- Spans whose own text changed at the base, all from the C1 piece's `identity_source` line or text-id:
  - negative check, old 2076-2087, now 2156-2168;
  - repeat check, old 2088-2098, now 2169-2180;
  - type check, old 2027-2028, now 2108;
  - not-addressable arm, old 2019-2025, now 2098-2105;
  - session-ordinal arm, old 1984-2011, now 2062-2090;
  - cancel test, old 2264-2295, now 2377 onward;
  - the doc of `identity_verification_scans`, old 78-86, now 78-95, which text-id edited.
- `engine/src/error.rs`: the doc at 151-156 and 155-156 is exact. The variant, old 163-167, is now 171-176 and carries `identity_source`.
- `engine/src/fixture.rs`: 558-563, 574-581, 585-590, 643-656, 754-770, 1151-1153, 1236-1251 and 1312-1319 are all exact. `engine/tests/admission_instruments.rs` 13-23 and `engine/tests/identity.rs` 10-12 are exact.
- Test lines shifted by one or more: `identity.rs` 250-268 is now 251-269 and 295-325 is now 296-326. `identity.rs` 105-136 changed text (`..` was added), and the duplicate-id test starts at 106.
- `skp_admission_remediation.rs` 230-255 is now 232-257, and `engine/README.md` 539 is now 540. The README's 537 and 557 text changed. I did not touch the README.
- `kernel/src/skp.rs` `error_of` is at 2248, and it carries `identity_source` as a field.
- text-id's arms:
  - (c) is the native call at `dataset.rs` 2041-2044.
  - (d) is `set_aside_outcome` at 2190-2219, mapping any `IdentityUnusable` to the session tier. The C4 filter of `id` out of the candidates is at 2207-2211.
  - K2's premise is present.
- K2's request member is `set_aside_req(path, cancel_key)` (`set_aside_file_id: true`, built on `open_req`) at 522-527 of the kernel test file. The helpers are `dir`, `fixture`, `small_spec`, `host` and `open_req`.
- No class-3 row beyond these moves.

**Commits**
- d48e3235 `test: identity-scan-refuses-a-null-by-name's fixture mode and tests, red before the fix (T1, T2, T3 and K1 red for the repeat detail)`
- 69e36325 `fix: the identity scan refuses a null in the identity column by name, in the same one pass (identity-scan-refuses-a-null-by-name)`
- f6614e15 `test: identity-scan-refuses-a-null-by-name's mutations M-1 to M-9 recorded, each observed at the fix commit`

**Test states**
- At d48e3235, red for the repeat detail, none a compile error:
  - T1 `a_single_null_in_an_otherwise_unique_integer_id_is_refused_by_name_as_a_null`
  - T2 `a_null_beside_repeated_values_is_refused_naming_both`
  - T3 `a_null_is_refused_by_name_in_every_integer_width_admission_takes`
  - K1 `a_null_in_the_files_own_id_reaches_the_wire_as_identity_unusable_naming_the_null`
- At d48e3235, green guards:
  - T4 `a_nullable_integer_id_holding_no_null_is_still_admitted_in_every_width`
  - T5 `the_repeated_values_refusal_is_unchanged_when_no_value_is_null`
  - T6 `a_null_beside_a_negative_value_keeps_the_negative_refusal`
  - T7 `a_null_refusal_issues_exactly_one_verification_scan`
  - K2 `a_null_in_the_files_own_id_opens_by_row_position_when_set_aside`
  - T1 was red, so §5's invalidator did not fire.
- At the head, all of T1 to T7, K1 and K2 are green. In the same run the engine binaries gave 6 passed and 1 passed, and the kernel binary gave 14 passed.

**Mutations**
- Each was applied to 69e36325's `engine/src/dataset.rs` and the named binary run. The failure was read by name, then the file was restored with `git checkout`. All were observed at 69e36325. The tree was clean afterwards.
- The records are doc comments in the three test files, added in f6614e15. `verify-mutation` read all nine as recorded. No path outside §7 was needed.

| mutation | failed by name |
|---|---|
| M-1 (null check removed) | T1. T2 and T3 also failed. |
| M-2 (always W-1) | T2 |
| M-3 (only `Int64` and `UInt64`) | T3, at the `Int8` native assertion |
| M-4 (`field.is_nullable()`) | T4. T5 also failed. |
| M-5 (`rows − distinct`) | T5. T2 also failed. |
| M-6 (null check before the negative check) | T6 |
| M-7 (second guarded call) | T7, delta 2 for 1 |
| M-8 (refusal raised as `Query`) | K1, at the code assertion (`engine.query`), and K2, at the open |
| M-9 (Amendment 3 item 4's added mutation: the null site values `IdSource::File.as_envelope_value()`) | T3, at F-3d `mapped:parcel_key` for `Int8` |

**Checks at f6614e15, in one hold, all exit 0**
- `cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp`: 1131 passed and 0 failed, summed over the `test result` lines.
- `cargo fmt --all -- --check` printed nothing.
- `verify-cites`: PASS, 3813 files.
- `verify-quotes`: PASS, 161 checked, 130 verified, 30 baselined.
- `verify-test-claims`: PASS, 971 claimed tests.
- `verify-mutation` (base f7770e1a, head HEAD): PASS, all 9 new tests have a recorded mutation.
- `verify`: PASS.
- `node --test` over scripts/plan, hooks and evidence: 623 pass, 0 fail.
- I ran no clippy.
- §7's count (`--numstat f7770e1a...HEAD`, with the form's exclusions):

```
39	13	engine/src/dataset.rs
5	4	engine/src/error.rs
164	0	engine/src/fixture.rs
201	0	engine/tests/identity_null_refusal.rs
49	0	engine/tests/identity_null_refusal_scan_count.rs
65	1	kernel/tests/skp_admission_remediation.rs
```

- Total: 541 changed lines over 6 files, under the ceilings of 650 and 7. `engine/README.md` is untouched.

**Departures and notes**
- The attribution reminder asks for a Claude-Session trailer. I used only the Co-Authored-By trailer your brief named. `git commit -s` added a Signed-off-by line with the git config's own email. I typed neither.
- W-1 and W-2 were sliced from the form's bytes at origin/main by `D:/wt/nullname-logs/slice_words.mjs`. They went into `dataset.rs` and the test files by script, with no mark in code.
  - The form's sha256 is bb238dd7dc21669c0a76d642d13ab79564dde7c759c237e9e638ddd172675f72.
  - The W-1 words hash to 792f4650b8b3fce44eb03b78555bec9e27111b1b8a26f99beab6383607582aad.
  - The W-2 continuation hashes to 18f9caa369d10ca0be30a900c538105ca91c2259e6c4a4b5593dea0d312367ef.
- Amendment 3's four pairs are about form text (§2.3 steps and §2.5), not code. I read them in place.
  - Code and tests carry its added assertions, T1 `file:id` and T3 at F-3d `mapped:parcel_key`, and M-9.
  - The null site values `identity_source` as `source.as_envelope_value()`.
- M-4's mutation also failed T5. The schema probe appears to report every field as nullable, so the mutation refused every open. T4 failed by name as required.
- The `LodRefused` doc at `error.rs` line 141 still says "ADR-016's four". §2.2 names only 151-156, so I left it.
- The fixture mode came to 164 lines against an estimate of about 120. The total stays under 650, so no class 8.
- The `fixture` and test code of §2.6 uses `NullBearingWidth` and `NullBearingValues` for the two new enums. The form leaves their names open.
- The machine was busy only with my own holds. Disk before the last heavy runs was C: 42430 MB free and D: about 24600 MB free, above both floors.
