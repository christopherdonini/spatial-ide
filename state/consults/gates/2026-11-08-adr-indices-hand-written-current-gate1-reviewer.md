Reviewed: PR #296 at 01dc01752d84aa28e963bd8bb23679b3a1a52153 (base 914bd156), gate 1, reviewer
Verdict: PASS

cut/adr-indices-hand-written-current @ 01dc01752d84aa28e963bd8bb23679b3a1a52153

Before starting I checked two hashes. The brief's sha256 was 4679b0e8…c7fe51 (9874 bytes) and the packet's was 37d8aa6a…1229 (7078 bytes). Both match. The form (fe3f0b42…) and the worker's report (f482eb01…) also match the packet.

## Findings by class

- **Correctness:** none.
- **Evidence:** none.
- **Documentation:** none.
- **Notes (preferences, not acceptance conditions; Part 1 item 6):**
  - docs/02:80 reads awkwardly: "Five corrigenda are appended, and a Note of 2026-10-28, and must be read with it". Every clause is true, so I give no replacement.

## Check 1. The Out-of-scope line, first

- `git diff --name-only 914bd156...01dc0175` exited 0. It lists exactly `docs/02_Architecture.md` and `docs/README.md`.
- `git diff --name-only 914bd156 01dc0175 -- docs/adr` exited 0 and gave 0 lines. Nothing under `docs/adr/` is edited.
- **Security clauses:** my script `adri-g1r-held.mjs` exited 0. These are byte-identical, base against head:
  - README:27's ADR-009 span (654 bytes), ADR-020 span (1374 bytes), ADR-021 span (878 bytes) and ADR-030 span (1649 bytes). Each occurs once at base and once at head.
  - docs/02's ADR-009 bullet (:81), ADR-020 bullet (:83) and ADR-021 bullet (:84), each at the same line number.
- **New entries:**
  - ADR-018, ADR-030 and ADR-035 each carry only the number, the title, the status and the date.
  - Each docs/02 title equals the ADR's H1 plus a full stop, by script (`adri-g1r-quotes.mjs`, exit 0).
  - Only ADR-018 carries "architect-blockable", and its Status line says so (:5). ADR-030 and ADR-035 do not.
- **docs/02 lines held by the form:**
  - :80 equals its base text once the F4 span is reverted.
  - :83, :84 and :88 are byte-equal.
  - The generated `adr-index` marker block (16127 bytes) is byte-equal.
  - `verify:adr-index` passes (check 5).
- **Section 21a's four categories (ADR, security, wire, guarantee):** all untouched.
  - No ADR file, Status line, note or amendment is touched.
  - The security text is byte-identical.
  - The ADR-035 (wire) and ADR-018 (guarantee) entries are bare facts.
  - The single gate applies.

## Check 2. The clause table at the head

The ADR lines were found at the base by content. Every hash is sha256 over the whole line plus its LF. Each hash at 914bd156 equals the form's pin at 1bc349ae where the form pins that line.

| Finding | Clause, new text | ADR line it rests on | Holds / covers |
|---|---|---|---|
| F1, README | the `pasted`-vs-`not-in-catalog` wording "was settled on 2026-09-03 (DECISIONS-PENDING entry 25: `pasted` retained)" | `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:110 @ 914bd156 sha256:6fc74275ea44b870a16fb8f3afba39ee05b8238f089da4687b3cbc21e2dc274d`; :114 sha256:7a5bdfeed55918d3264cd7176edf6325ab0781417702f2924c81a93fc9f1e25a | Holds; covers the 2026-09-03 settlement |
| F1, docs/02:91 | head "Not settled by this acceptance, settled later:"; the architect-note clause kept; "that wording was settled on 2026-09-03 (the ADR's appended section, DECISIONS-PENDING entry 25: `pasted` retained)" | ADR-026:91 sha256:e4163b6279c759f6c99e7cf113680266d24642ec212633b1040b05ec04cd7692; :110; :114; :154 sha256:e28fdd5bb1e7044521f485b70e6058a0934ed0d45d92fe4217a914e3140bd1de | Holds. No clause says the Status line (:3 sha256:fd7b98ae18ac369ab5a14809fff23ad93b26642871465fefa49f7a80621bfc91, :6 sha256:35b1056e3d636017a306059a23bdc52fbc47f8b7ab9480a484e24da8b665921f) was corrected. The dated correction (319 bytes) is byte-equal |
| F2, README | "Proposed and binds nothing" | `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ 914bd156 sha256:fef6a76bfcfe66caee1dedc8c67b7ee5d2f3df134d3f3623b2082cc64398dfd5` | Holds |
| F2, README | Record line: Decision text accepted as drafted, with two §2 amendments, by the human on 2026-09-14 | ADR-023:14 sha256:58ac06d76a62cf0ed11b243a9e3dd4e69dc20e3dd83727051894eeda8d055fcc | Holds; also covers "drafted" |
| F2, README | Status unchanged until B1's close | ADR-023:14 | Holds |
| F2, README | Amendment of 2026-09-29 is Proposed | ADR-023:163 sha256:46074b6018320fb9093c4cee9ad37a128f4171f122d730f024c48606cd6dfe02 | Holds. Never calls the ADR accepted or binding |
| F2, docs/02:86 | head "(proposed — binds nothing; the Decision text accepted as drafted, with two §2 amendments, by the human on 2026-09-14, Status unchanged until B1's close)"; tail "An Amendment of 2026-09-29 is Proposed." | ADR-023:3, :14, :163 | Holds; covers all four must-cover items |
| F3, README | "five corrigenda appended"; "4 (2026-08-07) and a corrigendum of 2026-09-07 complete the five; a Note of 2026-10-28 is also appended" | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:672 @ 914bd156 sha256:167b60e64175697326a8310c71fd9cbb95c6ee600521bf9a13bc2633215524e9`; :723 sha256:dca95deb66ed6a8d25267c58dcb4876d7c25528f1f724b65674070dd62c1f9f5; :750 sha256:a7c8a86c13275dc06224c5ef179fba6d5539b04f48e0ad8e3623fd278fa71c92; :1044 sha256:f3922c83bf55bdcc32fab29390294b3e360d75c6ebe7be78cf7e5b910edf6ab4; :1144 sha256:22b4bf4de72b1f03341a420a890d09b2ece14753903d25a34eed2ccdbf9aa783; :1161 sha256:ab9ea1cbc0ca59b2cf9aa79108bca021d51e99199b7a5f42214028f38414ead8; pointer duty :667 sha256:2700d4c4533fb8c4941848acbf5afda5e73915a33c13775747713b110708e470 | Holds. The ADR's other headings are a Progress note, a Clarification and Exposure reviews, not corrigenda |
| F4, docs/02:80 | "Five corrigenda are appended, and a Note of 2026-10-28, and must be read with it; the first three are:" | The same ADR-017 lines | Holds (see check 3 for the added clause) |
| F5, README | `twice), **ADR-016**` became `twice). **ADR-016**`. The ADR-016 sentence carries "accepted 2026-09-02, architect-blockable" | `docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 914bd156 sha256:586a0671f5196957abbc53b0f26bfdd5a18d50a5f382801e30154b61c1cf143f` | Holds. ADR-016 leaves the Proposed run, whose sentence now ends at ADR-012. The rest of the ADR-016 piece (611 bytes) is byte-equal |
| F6, README and docs/02:94 | "Proposed (—) binds nothing until its gate and the human's word"; decision "drafted 2026-09-14 for the human's sight" | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:3 @ 914bd156 sha256:4a51a7c617347ac24efe94365970797330270aa5cad1a1ed2fef688798cdde92`; :64 sha256:f01bd182e6425a90db4ed6b5a584cc2763af1f033617bfa79f5c16e69ffddc97 | Holds |
| F6, README and docs/02:94 | "the questions it was filed to hold … are what that drafted decision addresses" / "the decision drafted 2026-09-14 addresses them" | ADR-029:39 sha256:8c06b2a94d1175cf58ab4549fd21625ba03302ed91073b898e1e2c565dfab627; :43 sha256:4bc2ede3be18ff1c096b27612ba1bcfd2794abeafa6cfc0466c8768c682a94f2 | Holds. Sections 1 to 3 of the drafted decision are the quantity, the carrier and the refusal shape. "Due before `docs/07`'s Prototype exit" still rests on :60 sha256:cb5ce2d732d13e494b9a79cfee99074699e0ad3a6ec8037d6b61249004c0b21d |
| F7, docs/02:77 | "(accepted, 2026-08-09, architect-blockable from acceptance)" | `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3 @ 914bd156 sha256:dd824c231171f40e720dcbc7e5a3d550d1bbf8255921977a84c33136ba0af2a6` | Holds |
| F7, docs/02:77 | "Its deadline, inherited from that block, is on resolving the question — by this ADR or a successor — before the editing plugin's digitizing path is built." | ADR-013:5 sha256:3d58755e3fd015a875148041fe0cffa2f61d60c41758d3a32aa7043a43ea8ac7 | Holds; it no longer describes a pending acceptance |
| F7, docs/02:77 | "Amendment 1 (2026-09-23, Accepted) and a Note of 2026-11-05 are appended." | ADR-013:265 sha256:ee28435bc76cdf9eac83095883e0f74e433377f541c50ef043e9e5afb28ef55b; :330 sha256:c8f29452ccb83dda1656a7ae893b9d895f1870730641d8098ab692e1f1ce1b7d | Holds |
| F8, docs/02:95 | ADR-018: accepted, 2026-08-08, architect-blockable; title equals the H1 | `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 @ 914bd156 sha256:6d99101abbecf6521406ec3e88895a99a6436df05d0058fa3a8d025dc9bd4d1d`; :5 sha256:d6831a49fc5a16a6eccfc7996983a43c9e4bdbdad87970130336d7abb416db33; H1 :1 sha256:1192d3408e2e024eb7bd7e2f5fe7bfbb91230a800123ab9c2006c156acd6a945 | Holds. Its only quotation marks come from the H1, byte-copied |
| F8, docs/02:96 | ADR-030: accepted, 2026-09-09 | `docs/adr/ADR-030-conveyed-artifact-notice-set.md:3 @ 914bd156 sha256:c0ccd2d116703f0e6499bed7cb0ab07342b8257eea1a5a65e58ccaaea4a0a8e9`; :1 sha256:4b384b8f4d39f02f4655aeee2d08ae9b9dc4dd734e8b9b7166c788d662eb7398 | Holds |
| F8, docs/02:97 | ADR-032: accepted, 2026-09-23 | `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5 @ 914bd156 sha256:f2b3d671f96caccbd98ebcf49b8167a6eedfc20125e3f22eaea605e650ba3ef1`; :1 sha256:8f928b40ae94e0ea1e223d902526e9e2e62c936c8569659243aff89f4866774f | Holds |
| F8, docs/02:98 and README | ADR-033: accepted 2026-09-14 | `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:3 @ 914bd156 sha256:334694165d50e8b0f29581bfe1f6fd7c1467ce68057ace41e00d25425c105fb6`; :1 sha256:3bbf03c01c741cd0f6391142b1c92a20a9b32b7ad6bd75aaa2826c6b507e2216 | Holds |
| F8, docs/02:99 and README | ADR-034: accepted 2026-10-05, architect-blockable | `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3 @ 914bd156 sha256:c590f50370ed606ecbe75dec729650542014249ad56b94fa7592d92471609989`; :1 sha256:481ab9a17790bb74221d699a279f04039c26f0ba01dc766b5b0fcb47c7f8b9c8 | Holds ("architect-blockable as of acceptance") |
| F8, docs/02:100 and README | ADR-035: accepted 2026-09-24, no blockability | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ 914bd156 sha256:9bc5402780ed589ba90bb861f56135c6835c5b8f0b7d4e499911f1ebb947bb92`; :1 sha256:9ac33a234ec8a8c219f875d14302227ec0efa06b1801dacccf799c188dbe4de8 | Holds (see check 3) |
| F8, docs/02:101 and README | ADR-036: accepted 2026-10-22 | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3 @ 914bd156 sha256:a08a3c1bd902ef7b09bc14a96a9d21f9570c348d20d5f2dd11ae080617f12dda`; :1 sha256:1ad44a7108810663522c35bcf4742cf9252c615468ed4966eefdad8c8359d94e | Holds (OPEN-5 (A): status and date only) |

- **Quotation marks** (Held unchanged, item 5):
  - Base and head have the same quoted spans: README:27 holds 14 at each, as the same list, and docs/02's :80, :86, :91 and :94 are unchanged.
  - The only new quoted span is ADR-018's H1 phrase, which is byte-copied.
  - None of the changed sentences needs replacement words.
- **Coverage of the indices:** every ADR from 001 to 036 on the base tree now appears in both indices. In README, ADR-005 to ADR-007 are covered by the range "ADR-004–007".

## Check 3. The packet's known findings

1. **F4's added clause is within F4.** The count clause introduces the list. Changing "Three" to "Five" without "; the first three are:" would leave three items reading as the whole list, which is untrue. The added words are part of making the count true, and the rest of :80 is byte-equal.
2. **ADR-035's Status line does not say "architect-blockable" of the accepted ADR.** It says only "binding nothing and not architect-blockable until this acceptance", in its History of the Proposed filing. No other line of ADR-035 names blockability (grep). F8's "only where that line says so" therefore excludes the word. Leaving it out asserts nothing untrue. Whether "until this acceptance" implies blockable from acceptance is for the human, below.
3. **docs/02:86's "Until decided" clause is outside Scope.** F2's Must-cover names only the status clauses, and the Change line rewrites "each clause the Findings section names". It is for the human. Evidence that it may be stale: SKP-V0.md at 914bd156, line 920, heads "skp/0.6 — attribute projection on `viewport_query` (Brief B stage B1)", with a `columns` projection at :927.
4. **ADR-023's Status line against its Record line is outside Scope.** It would be an ADR edit, which the Out-of-scope line forbids. It is for the human. The index follows the Record line's facts and keeps "Proposed, binds nothing", which both lines support.

## Check 4. Held unchanged, items 1 to 5, by my own script

My script is `adri-g1r-held.mjs`, written fresh, not copied. On base against head it exited 0 with "RESULT ALL EQUAL" (51 equalities).

- **README:**
  - 75 lines at base and 75 at head; the only line that differs is 27.
  - Head :27 is one line with no CR.
  - The adr-index block (16127 bytes) is byte-equal.
  - Pieces of README:27 split at `**ADR-`: every piece not named by a finding is byte-equal. The changed pieces are exactly ADR-017 and its continuation "ADR-009 item 7" (F3), ADR-012 (F5), ADR-023 (F2), ADR-026 (F1), ADR-029 (F6) and ADR-032 (only the space before F8's appended entries). The new pieces are ADR-033 to ADR-036.
  - The ADR-025 dated correction and the `docs/02:81` cite are byte-equal.
- **docs/02:**
  - Base lines 1 to 94, except :77, :80, :86, :91 and :94, are byte-equal at the same line numbers (differing: none).
  - Head is 7 lines longer, all appended after :94.
  - Nothing is inserted, deleted, split or joined above :84, or between :90 and :91.
  - :90 is byte-equal, so :91's "(line above)" still points at ADR-025.
- **The clauses F9 to F13 name (OPEN-1, held):** byte-equal.
  - README: the F9 acceptance-condition span (251 bytes), the F10 ADR-022 clause (445 bytes) and the F11 ADR-028 clause (1136 bytes), each once at base and once at head.
  - docs/02: lines 78, 79, 85 and 93, whole.
- **Negative self-test, run first on scratch copies, one byte changed each** (cmp confirmed every copy differs):
  - README line 40 (the table): exit 1, 2 UNEQUAL.
  - README:27's ADR-020 clause: exit 1, 2 UNEQUAL.
  - docs/02:83: exit 1, 3 UNEQUAL.

## Check 5. The Tests line's checks at the head, run in the worktree

| Check | Exit | Result |
|---|---|---|
| `npm run verify:adr-index` (frontends/shell; `node_modules` absent, none needed) | 0 | `adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line` |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 2748 files (176 loose references advised) |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 756 claimed tests across 243 files |
| `node scripts/plan/verify.mjs --offline` | 0 | `verify:plan PASS` |
| `node scripts/plan/queue.mjs --check` | 0 | current |
| `node scripts/plan/site.mjs --check` | 0 | current |
| `node scripts/plan/forms-layout.mjs` | 0 | PASS, 207 files |
| `node scripts/plan/verify-quotes.mjs` (shared hold, its own call) | 0 | PASS: 151 checked, 120 verified, 30 baselined, 0 hash-reference errors, 920 ruling cites resolved |
| `node --test` over the three script suites (shared hold, its own call) | 0 | tests 598, pass 598, fail 0 |
| `git diff -U0 914bd156...01dc0175 -- docs/README.md` | 0 | one hunk, `@@ -27 +27 @@` |

## Check 6. Bytes

- The 13 added lines hold 0 CR bytes (node byte count).
- The head blobs hold 0 CR: `docs/README.md` is 34298 bytes and `docs/02_Architecture.md` is 24262 bytes.
- Both blobs end with byte 0x0a.

## Check 7. CI

- `gh pr checks 296` exited 0. There are four checks, all pass.
- `gh run view` on each run, every one exit 0, headSha 01dc01752d84aa28e963bd8bb23679b3a1a52153, conclusion success:
  - 42424348680 DCO sign-off
  - 42424348681 Exposure scan
  - 42424145058 Ported notices (push)
  - 42424348835 Ported notices (pull_request)
- The PR's headRefOid equals the reviewed commit. It is a draft, and open.
- Governance CI does not trigger on these two paths: its `pull_request.paths` list neither `docs/README.md` nor `docs/02_Architecture.md`. So the runs in check 5 are the only run of those checks at this head.

## Check 8. The porcelain afterwards

- After every check, `git status --porcelain --untracked-files=no` exited 0 with empty output (0 bytes).
- HEAD and `origin/cut/adr-indices-hand-written-current` are both 01dc01752d84aa28e963bd8bb23679b3a1a52153.

## For the human

- **ADR-035's Status line** says it was "not architect-blockable until this acceptance". Does that make the accepted ADR architect-blockable? If it does, both new ADR-035 entries could carry the word, under a reading you would rule. As things stand, F8's letter keeps it out.
- **docs/02:86's "Until decided" clause** may be stale against SKP skp/0.6's `columns` projection (known finding 3). It is a candidate for a later node.
- **ADR-023's own Status line** says "decision deliberately undrafted", while its Record line says the decision text was accepted as drafted (known finding 4). That is ADR text, and yours to word.
- **OPEN-1 (F9 to F13)** stays held for you, as the settlement says.

## The packet's gaps

- It gave no base line numbers or hashes for the ADR lines; the form pins them at 1bc349ae. I found them by content at 914bd156, and the hashes match.
- It did not say that governance CI does not run on these paths.
- It did not say that `node_modules` is absent in frontends/shell. This did not matter, because `verify:adr-index` needs only Node built-ins.
- Otherwise none.

## Hold lines (this project's only)

- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:64212 also=…`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:64212 affinity=FF (cores 0-7)` (verify-quotes).
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:80768 also=…`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:80768 affinity=FF (cores 0-7)` (the scripts suite).
- No exit code from 96 to 99.

## Background shells left

None. bi0bqosrl (the verify-quotes hold), b464x64ow (a bounded wait loop) and byd4u9b8k (the suite hold) all completed with exit 0. Nothing was killed.

I wrote scratch files only, every one named `adri-g1r-*` in my scratch folder, and touched nothing tracked.
