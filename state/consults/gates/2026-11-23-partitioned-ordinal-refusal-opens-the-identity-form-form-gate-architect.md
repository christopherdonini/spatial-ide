Reviewed: main at 49a6964701fd55cc64a3cca15311d827a922043b, in the detached read worktree C:/dev/wt/read-1123aa (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 1, attempt 1, node:partitioned-ordinal-refusal-opens-the-identity-form@form-gate-architect-1, dispatched at 2026-11-23T18:47:27Z; its run: Read 47, Grep 25, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T18:47:27Z to 2026-11-23T18:59:13Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 18671 bytes, sha256 4dd90572502adf34c34f55faaea53c491eb564247bd632d7906b7991f41fedfc, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; the changes true against the code and the smallest that do what the form claims; K1, S1 and S2 drive the real functions, red or green at the base for the reasons stated, each with a mutation; fourteen Amendment 1 entries read against their lines; ten Documentation findings, F1 to F10, to be fixed before the merge, with replacement words, F1 and F9 before the string drafts go to the advisor.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123aa @ 49a6964701fd55cc64a3cca15311d827a922043b

Form: governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md (main, the form's own commit). Every cite was read at 49a69647. The form's pins are at a12ab7e2. The code files I read hold the cited text at 49a69647.

Summary by AUTONOMY §22's three verdicts:
- **Correctness: PASS.** §2's changes are true against the code. Each is the smallest change that does what §1 claims, and none brings a new fault.
- **Evidence: PASS.** K1, S1 and S2 drive the real functions. Each is red or green at the base for the reason stated, and each has a mutation with a named outcome.
- **Documentation: 10 findings, all must-fix before the merge.** F1 and F9 should be fixed before the string drafts go to the advisor, because the advisor words from the filed text. The form is append-only, so the custodian applies the old/new pairs below by amendment. Each old text occurs once in the form.

## What holds

**§0 and §2.**
- All five `Dataset` constructors call `open_inner` (engine/src/dataset.rs:223, :237, :258, :279, :303). Its gate at :327-329 comes before `admit_identity`'s call at :565 (defined at :1961).
- The host goes `SkpHost::open_under` → `Catalog::open_cancellable` (kernel/src/skp.rs:1205-1207, kernel/src/lib.rs:227). The watch arm at skp.rs:1203 returns no error.
- `error_of` sets `message` to the `Display` (skp.rs:2139) and passes `detail` only (:2189-2192).
- The declaration form resubmits `state.path` (AdmissionPanel.tsx:575). The candidate field it reads (:573) is never carried by this code.

**Places that read the text or the code.**
- Engine: error.rs and dataset.rs. The tests are session_identity.rs (:266-278, :284-289, :689-703), which match the variant and `detail` only.
- Kernel: typed_terminal_codes.rs:386-404 (code prefix only) and no_generation_in_persisted_artifacts.rs:353-411. D1 contains no `generation`, and neither does the placeholder mark.
- Protocol: the fixture's tests check shape only (protocol/skp/tests/fixtures.rs:221-242; frontends/shell/src/skp/__tests__/fixtures.test.ts:331-339).
- Shell: RefusalBlock.tsx:34 shows `message` verbatim and :46 shows the guidance. admitDataset.ts:70 logs the message.
- No test outside the named ones pins the text. I searched the tree for "declare an identity column" and "partitioned across", outside state/, governance/ and spikes/. Two readers the form does not name are in F7.

**§3 and §4.**
- K1 at the base: (a), (b), (d) and (e) are green and (c) is red. error.rs:388-390 joins across the `\` continuation into "or declare an identity column".
- M-K1 fails K1 at (c).
- M-K1b fails K1 at (a): the declared open falls through to :330-335 and becomes `engine.source`.
- S1 at the base stops at (2), as declared, because vitest stops at the first failing `expect`.
- S2 fails under M-S2.
- Two builds of K1 work as written: `SkpError` derives `PartialEq` (protocol/skp/src/v0/error.rs:15), and the build pattern of single_file_bracket_name_open.rs:64-78 fits. Importing `formFamilyForCode` into a `.test.ts` already works in AdmissionPanel.test.ts.
- K1 is the end-to-end test of the seam from the real shape. The shell's interface (`code` plus `message` verbatim) is unchanged, and the Tauri command calls the same `host.open_dataset` (frontends/shell/src-tauri/src/commands.rs:69).

**§5, §7 and §8.**
- What is declared unchanged holds against the code.
- §7: about 190 lines estimated against a ceiling of 200 over 5 files. The piece is full-gated (§21a, and ADV-2026-11-16-06 item 2 (a): it crosses a seam). The counting command uses three dots. The class 8 and class 9 sentences are present.

**Reach.**
- The shipped open is a single-file native picker (frontends/shell/src-tauri/src/commands.rs:319-331).
- A reopen refuses any data path that is not a regular file (kernel/src/project/resolver.rs:180-182).
- In the shell, only the dev-only `openPath` hook reaches this refusal (AdmissionPanel.tsx:420). So no sentence here blocks under §31: no ordinary use reaches the refusal.

**§9 and §9a.**
- The base, the re-link's head, matches ADV-2026-11-23-20 item 8 and ADV-2026-11-23-15 item 4.
- Rule (00) is met under OPEN-2 (a): no `protocol/` path, no wire fixture, no lockfile.
- The shared-file rows are in F6.

**Amendment 1 sample (14 entries).** Each cited range holds the text the form uses it for, at 49a69647:
1. dataset.rs:223, :237, :258, :279, :303. Each line is `Self::open_inner(`, and the five share one hash, which fits identical lines.
2. dataset.rs:327-329 (the gate).
3. dataset.rs:1884-1917 (`partitioned_source_detail`).
4. dataset.rs:565 (the `admit_identity` call).
5. dataset.rs:1961 (its definition).
6. kernel/src/skp.rs:2139.
7. skp.rs:2189-2192. Its hash 071d32… equals the independent pin in KNOWN-LIMITATIONS.md:294 (at 4fd3259a, other line numbers).
8. error.rs:386-391. Its hash 26ebfe… equals the item-20 comment's pin of the same arm.
9. error.rs:182.
10. formatRefusal.ts:119-124 and :61-62.
11. formatRefusal.test.ts:173-182.
12. KNOWN-LIMITATIONS.md:283-286 (the quote).
13. AdmissionPanel.tsx:31-36 and :575.
14. ADR-016 :231-232; ADV-2026-11-23-20 :30-34 (item 8); ADV-2026-11-16-06 :25-26; AUTONOMY.md:609 (rule (00)); MANUAL-WALKTHROUGH.md:960 (N9).

Not checkable: whether governance/PLAN.yaml:7842-7858 and :7845 held the node at a12ab7e2. At 49a69647 they do (F10).

**§2.4, clause by clause.**
- **D1** is not marked as the human's. Every clause holds except its first: "partitioned across more than one file" (F1).
- **D2** is not the human's wording, though the human's P6 sight is reserved for it (F9). Every clause holds: folder or pattern at :1885-1887 and :1907-1914; the declaration at :575 and at :327-329 before :565; the single-file caveat at :1907-1908 sits in the source comment.
- **D3** holds against :327-329 and :565. Item 20 is the human's by approval at the merge (F8).

**OPEN items.** Each is put truly against the code, except OPEN-2 (a)'s reading of item 7 (F5) and OPEN-5's cite (F8).
- OPEN-1 (b) is refused for true reasons (:575; :327-329 before :565; skp.rs:2189-2192).
- OPEN-4's draft note holds against the code.

## Findings (all Documentation)

**F1 — §2.4, D1's first clause.** The engine never counts parts: its doc says nothing there enumerates parts (dataset.rs:1881-1883). Yet the clause says the source spans more than one file, which is untrue for:
- an empty folder (session_identity.rs:266-268);
- K1's own one-part folder (§3);
- a bracket path with no file at it (session_identity.rs:689-694).

The form's check of the clause is "unchanged from today's text", which is not a check against the code. My words below are the architect's draft, not the human's or the advisor's. Clause check of the new words:
- "read as a folder or a pattern, not as one file ({detail})": the only two refusal arms are :1885-1886 and :1911-1914, and the engine's own detail says "names a pattern rather than one file".
- "opens a single file only": :330-335.
- "before reading it": a stat and the path text only (:1884-1917; the doc at :323-326).
- "whether or not … declared": :327-329 before :565, on every constructor (:223-303).
- No `generation` substring.
```text
  > refused: this source is partitioned across more than one file ({detail}). This engine opens a single file only, and it refuses a partitioned source before reading it, whether or not an identity column is declared
  - "partitioned … ({detail})": unchanged from today's text.
```
```text
  > refused: this path is read as a folder or a pattern, not as one file ({detail}). This engine opens a single file only, and it refuses such a path before reading it, whether or not an identity column is declared
  - "read as a folder or a pattern, not as one file ({detail})": the only two refusal arms are `dataset.rs:1885-1886` and :1911-1914, whose detail says which; the engine never counts parts (:1881-1883), so today's "more than one file" is untrue for an empty or one-part folder and for a bracket path with no file at it.
```

**F2 — §1, a claim with no test.** No test asserts that the engine's message states a declaration does not change the refusal. K1 has no such assertion.
```text
  - the refusal's message and the shell's guidance offer no declaration, and state that a declaration does not change the refusal;
```
```text
  - the refusal's message offers no declaration (K1 (c)); the shell's guidance offers none (S1 (2)) and states that a declaration does not change the refusal (S1 (3)); that the message says the same is read from the arm's text by the reviewer at the words commit, and no test asserts it;
```

**F3 — §4, a known pass case not named.** K1 (c) and S1 (2) each test that one phrase is absent. Words that offer a declaration in other terms would pass both.
```text
- **S1** asserts: (1) the guidance is not null and matches /single file/i; (2) it lacks "or declare an identity column"; (3) it matches /does not change/i. Properties only, since the words are a placeholder.
```
```text
- **S1** asserts: (1) the guidance is not null and matches /single file/i; (2) it lacks "or declare an identity column"; (3) it matches /does not change/i. Properties only, since the words are a placeholder. Known pass case, recorded: K1 (c) and S1 (2) each test the absence of one phrase, so words that offer a declaration in other terms pass both; the reviewer of the words commit reads the final words for any offer of a declaration.
```

**F4 — §4, S2's assertions are not listed, and its claim is too wide.** `nextFormFamily` carries a prior family forward (AdmissionPanel.tsx:53-56). So "no form opens for this code" holds only when no family was active before. The new cite needs its hash from the custodian.
```text
the guidance and the panel agree, and no form opens for this code
```
```text
`formFamilyForCode` returns `null` for this code and `nextFormFamily(null, code)` returns `null`: no form opens for this code when none was open before it (a prior family is carried forward by `nextFormFamily`, `AdmissionPanel.tsx:53-56`, which this claim does not cover)
```

**F5 — OPEN-2 (a) misreads its cite.** ADV-2026-11-23-20 item 7 places the identity route before or after the recovery offer, by whichever form has passed. It does not make the identity route the next piece to hold `protocol/`, and it says nothing of class 9.
```text
the identity route by ADV-2026-11-23-20 item 7, which adds them by class 9
```
```text
the identity route or the recovery offer, whichever takes the `protocol/` place first after the re-link (ADV-2026-11-23-20 item 7), which would add them by class 9 (proposed here, not ruled)
```

**F6 — §9a against ADV-2026-11-23-17 item 11.** Item 11 forbids two builds changing one file at the same time on separate branches. Instead the later piece is built on the earlier one's head and merges after it. The form applies only ADV-2026-11-16-06 item 4's rule. The identity route still shares `KNOWN-LIMITATIONS.md` with this piece.
```text
| `formatRefusal.ts` | the recovery offer (its four new cases). Disjoint regions by symbol (ADV-2026-11-16-06 item 4). Whichever piece goes later takes main in before its gate. |
```
```text
| `formatRefusal.ts` | the recovery offer (its four new cases). Disjoint regions by symbol (ADV-2026-11-16-06 item 4). The two are never built at the same time on separate branches (ADV-2026-11-23-17 item 11): the one built first is the one whose form passes first, or the earlier in the human's order if both have passed; the other is built on its head once its code is committed, and merges after it. |
```
```text
Under OPEN-1 (a) it no longer touches `AdmissionPanel.tsx`, so the identity route does not need to build on it.
```
```text
Under OPEN-1 (a) it no longer touches `AdmissionPanel.tsx`; it still shares `KNOWN-LIMITATIONS.md` with the identity route (items 20 and 3), so whether one is built on the other is the custodian's comparison under ADV-2026-11-23-17 item 11, recorded at dispatch.
```

**F7 — §0, two readers not named.** Both stay unchanged.
- engine/tests/admission_p4_corpus.rs:442-445 writes the `Display` into the generated engine/ADMISSION-RESULTS.md. The run is `#[ignore]`d, and no row there holds the old text.
- protocol/skp/SKP-V0.md:31-37 names the code and the paths it refuses, offers no remedy, and stays true.

The new cites need hashes from the custodian.
```text
**No test pins the message text** (I searched the tree for the message's phrases outside `state/`, `governance/` and `spikes/`).
```
```text
**No test pins the message text** (I searched the tree for the message's phrases outside `state/`, `governance/` and `spikes/`). Two more readers stay unchanged: `engine/tests/admission_p4_corpus.rs:442-445` records the `Display` into the generated `engine/ADMISSION-RESULTS.md` (an `#[ignore]`d run; no row there holds the old text), and `protocol/skp/SKP-V0.md:31-37` names the code and the paths it refuses, with no remedy.
```

**F8 — §2.4 D3 and OPEN-5: the wrong cite for whose words item 20 holds.**
- The cited line only says the human would word item 20 at the click.
- The record that the human merged item 20 as drafted is governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md:493 and :496.
- The pins below are at 49a69647, which is on main; the custodian adds the hashes.
```text
  - Item 20 is the human's wording by the human's message of 2026-11-07 (`state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:12`: the human said they would word item 20 at the click). See OPEN-5.
```
```text
  - Item 20 is the worker's draft, merged as drafted by the human at the click (`governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md:493` and `:496` @ 49a6964701fd55cc64a3cca15311d827a922043b), as the human's message of 2026-11-07 said they would (`state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:12`). See OPEN-5.
```

**F9 — §2.4 D2 and §2.2: the P6 reservation, and a doc sentence that becomes untrue.**
- The quoted phrase also changes the source's bold markers, which Amendment 1 item 4 does not disclose.
- formatRefusal.ts:67-68 reserves these strings for the human's sight at P6.
- After the advisor words D2, :67-70 no longer holds.
```text
Today's text is one of the three placeholders "whose wording is not settled" (`formatRefusal.ts:67-70`). Not the human's wording.
```
```text
Today's text is one of the three placeholders whose wording that doc calls not settled (`formatRefusal.ts:67-70`; paraphrase). Not the human's wording: the doc reserves these strings for the human's sight at P6 (:67-68), and ADV-2026-11-23-17 item 8 reads the grant's item 2 as putting the app's strings with the advisor. At the words commit, :67-70 is updated to say whose words D2 is.
```

**F10 — §2.3 and Amendment 1: two pins.**
- §2.3 has item 20's comment re-pin the `Display` "at the build base". The base holds the old text: D1 exists only on this branch.
- The PLAN pins at a12ab7e2 predate Amendment 1 item 2's change to the node. Nothing says which is authoritative: the pin or the tree.
```text
Its comment re-pins the `Display` at the build base and names whose words are in the item (OPEN-5).
```
```text
Its comment cites the `Display` by path and symbol, unpinned (`engine/src/error.rs`, the `IdentityOrdinalPartitionedUnsupported` arm), since the build base holds the old text, and names whose words are in the item (OPEN-5).
```
```text
- `governance/PLAN.yaml:7842-7858` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:8651e57f493e8f5cd2a8bc2de3a3c57d85f3cf5290876719d574ef5ef4791a39 — the header
```
```text
- `governance/PLAN.yaml:7842-7858` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:8651e57f493e8f5cd2a8bc2de3a3c57d85f3cf5290876719d574ef5ef4791a39 — the header; historical: item 2 changes the node in the form's own commit, and the tree on main is authoritative for the node
```

No ADR skeleton is owed. OPEN-4's note stays with the advisor or the human.

## Files read (all under C:/dev/wt/read-1123aa/)
- governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md
- governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md (grep, :724-745)
- governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md (grep)
- governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md (:140-174, grep)
- governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md (grep, :490-499)
- governance/PLAN.yaml (:7835-7859)
- governance/AUTONOMY.md (:306-361, :377-392, :604-613)
- state/directives/: ADV-2026-11-23-20, ADV-2026-11-16-06, ADV-2026-11-23-15, ADV-2026-11-23-16 and ADV-2026-11-23-17 (all whole), and the human's message of 2026-11-07 (8g … item-20)
- engine/src/error.rs (:160-409)
- engine/src/dataset.rs (:200-349, :540-579, :1870-1969)
- engine/src/fixture.rs (:500-559)
- engine/tests/session_identity.rs (:250-294, :675-709)
- engine/tests/admission_p4_corpus.rs (:370-419, grep)
- kernel/src/skp.rs (:1060-1219, :2125-2204)
- kernel/src/lib.rs (:190-249)
- kernel/src/project/resolver.rs (:165-189)
- kernel/Cargo.toml (grep)
- kernel/tests/typed_terminal_codes.rs (:355-409)
- kernel/tests/no_generation_in_persisted_artifacts.rs (:345-414)
- kernel/tests/single_file_bracket_name_open.rs
- protocol/skp/src/v0/commands.rs (:1-75)
- protocol/skp/src/v0/error.rs (grep)
- protocol/skp/src/v0/mod.rs (:30-39)
- protocol/skp/SKP-V0.md (:28-39, :340-361, :728-739)
- protocol/skp/tests/fixtures.rs (:210-249)
- frontends/shell/src/admission/formatRefusal.ts
- frontends/shell/src/admission/formatRefusal.test.ts
- frontends/shell/src/admission/AdmissionPanel.tsx (:1-80, :400-586)
- frontends/shell/src/admission/RefusalBlock.tsx
- frontends/shell/src/admission/admitDataset.ts (:35-74)
- frontends/shell/src/admission/noCut2Language.test.ts
- frontends/shell/src/admission/AdmissionPanel.test.ts and RefusalBlock.test.tsx (grep)
- frontends/shell/src/skp/__tests__/fixtures.test.ts (:315-344)
- frontends/shell/src-tauri/src/commands.rs (:305-339, grep)
- frontends/shell/MANUAL-WALKTHROUGH.md (:960, grep)
- KNOWN-LIMITATIONS.md (:60-75, :274-297)
- docs/adr/ADR-016-stable-feature-identity-admission.md (:215-244)
- state/consults/ (glob: the architect's draft exists)

Model: Claude Opus 5.5 (claude-opus-5-5)
