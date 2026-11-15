*Custodian's filing note (2026-11-06): the first report of the worker for `skp-filter-dialect-unsupported-ruling` (8e, the filler slot; the five-line form `governance/forms/protocol/SKP-FILTER-DIALECT-UNSUPPORTED-RULING-PREREGISTRATION.md`), a stop at the base on I-2, extracted by script from its SubagentHandback call, unchanged. Dispatched at 2026-11-06T12:10:00Z by its transcript (brief 15552 bytes, sha256 e463a231dbc014f929f3c054a0a2423517775b52376ad9b6119230c03a56df40); unique calls 7, equal to the notification's. The custodian's reading is the form's Amendment 2. A report, not Authority.*

Stopped: skp-filter-dialect-unsupported-ruling, invalidator I-2 literally tripped at the base. Nothing written, no commit, no cargo run, no push.

Start state:
- Worktree: C:/dev/wt/sfdu on branch cut/skp-filter-dialect-unsupported-ruling.
- HEAD: 8963de604017282124a7caa30f54550583882836, equal to the base you named.
- Porcelain: empty.
- `.cargo/config.toml` sha256: 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, equal to yours.
- D: free space: 193.5 GiB, so the 40 GiB floor holds. D:/wt-targets/sfdu does not exist yet.
- Brief sha256: e463a231dbc014f929f3c054a0a2423517775b52376ad9b6119230c03a56df40, equal to yours.
- `sfdu-notes.mjs` sha256: 21a8bdc949ef90465e6b69abc55f85a08d7fd65eb9e1ae450a34b8c3cee4233a, equal to yours. I did not run it.
- I read the form with Amendment 1, and line 23 and lines 8 to 12 of the two directives.

Base checks (all exit 0):
- `git grep -n DialectUnsupported -- '*.rs'` found 6 hits:
  - engine/src/predicate.rs:263 (the variant) and :338 (its Display arm).
  - engine/tests/admission_property_campaign.rs:626 and engine/tests/filter_type_admission.rs:875 (the two test arms).
  - kernel/src/skp.rs:2290 (`filter_error_of`'s arm) and :2806 (the removed test's constructor).
  - There is no product constructor, so I-1 does not trip. `git grep -n Display -- engine/src/predicate.rs` found predicate.rs:335, which self-tests the pattern positive.
- The case-insensitive `filter_dialect_unsupported` grep over `*.rs`, `*.ts`, `*.tsx` and `*.json` found 8 hits, in 6 files:
  - Inside engine/ and kernel/ (allowed): engine/tests/admission_property_campaign.rs:626, engine/tests/filter_type_admission.rs:875, and kernel/src/skp.rs:2291, :2805 and :2809.
  - protocol/skp/src/v0/commands.rs:376, the allowed doc.
  - **governance/CUSTODIAN-QUEUE.json:65 (a `title` string)** and **site/data/plan.json:10917 (the same title, a generated file)**. Both sit outside engine/ and kernel/ and are not commands.rs's doc, so I-2 reads them as invalidating.
  - The self-test grep for `FILTER_DIALECT_DUCKDB_EXPR_0` found commands.rs:379.
- `skp/0.12` is at protocol/skp/src/v0/mod.rs:115 (`SKP_VERSION`) and frontends/shell/src/skp/types.ts:15, so I-4 holds.

Why I stopped: I-2 says any `*.json` file outside engine/ and kernel/ holding the string, other than commands.rs's doc, invalidates the piece. These two hits are not client code lists. They are the open item's own title in the custodian queue and its generated mirror. I-2's purpose, that a client code list needs editing, does not appear to apply. The brief says an invalidator hit is a STOP and not to route around it, so I did not decide that reading myself. Please either rule that these two governance and generated JSON hits are excepted from I-2, or give me a different instruction. I can then continue from step 2 with the base already verified.

Not run, so no figures for them: T1, the removal, M-1, M-2, comments, the script, the CI runs, the final checks and the size.
Hold lines: none. No background shells or processes started.
Model: Sonnet 5.5, claude-sonnet-5-5, as the harness reports it. No override and no context handoff.
State left: a clean worktree on a new local branch at 8963de60. The branch is not pushed. D:/wt-targets/sfdu is not created.
