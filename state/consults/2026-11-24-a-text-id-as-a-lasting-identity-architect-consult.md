# A text id as a lasting identity: what ADR-016 would have to change, and its cost (architect consult)

*Filed by the custodian: consult:a-text-id-as-a-lasting-identity. A consult, not a gate, with no piece behind it; asked for by the human's message of 2026-11-24 (09:52Z), item 3 (state/directives/2026-11-24-the-humans-message-the-row-position-offer-whenever-the-id-cannot-serve-the-declaration-route-moves-up-a-text-id-consult-view-loading-facts.md), whose facts are leads, not gate evidence. Dispatched at 2026-11-24T10:02:49Z to the architect on opus, its brief byte for byte (brief-textid-identity-consult-1.md in the scratch folder, 5469 bytes, sha256 f03fcf8dd7e772150ee371939a1b4b375b3902ee05dd01222e2b460747b6439d) with the message in it byte for byte; read only in the detached checkout D:/wt/read-1124f at main 20ed759b71064079792541f2a76cf804a6c84bc1; its run: Read 28, Grep 24, Glob 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T10:02:49Z to 2026-11-24T10:10:43Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T10:10:43Z; no message was sent to it. Its recommendations are for a ruling; nothing is placed by this filing. Filed below the rule, 18246 bytes, sha256 26aa40257018908b29b62c96d4bfe665439fc15055c1b920f71dd8177f5a15b5, byte for byte, nothing masked, with one final newline added.*

---

main @ 20ed759b71064079792541f2a76cf804a6c84bc1. Consult, so no verdict. Tag `consult:a-text-id-as-a-lasting-identity`.

All cites below are at 20ed759b in `D:/wt/read-1124f`. I used only Read, Grep and Glob, and ran nothing. Where I describe what SQL or DuckDB does, that comes from reading the code and from SQL semantics. Nothing was executed.

## 0. The lab facts: what I relied on and what I could confirm

**Confirmed in the repository:**
- A text `id` is refused on its type (`engine/src/identity.rs:336-344`).
- A single file with no `id` column opens on the session tier (`engine/src/dataset.rs:2005-2010`).
- The declaration form appears only after a refusal (`KNOWN-LIMITATIONS.md:70`).
- The generated fixture's text ids are unique and non-null: `key-{n}` (`engine/src/fixture.rs:757-758`, `:1242`).

**Not confirmed. I hold no lab files and looked for none:**
- the 28/16/12 counts, the 9 unique text ids, the 3 files with repeated ids, the 7 with no unique column, the 6 with a usable integer column, and the 21.

**One reading of the lab arithmetic (mine, not confirmed).** 28 − 7 = 21, so the 21 appears to count every file that has any unique column. Reaching 21 would then need three things:
- text admitted on the declared-mapping route as well as natively;
- the declaration route the identity-route piece adds for session-tier files;
- free-text declaration for any column the candidate list leaves out.

**Item 2's six files.** The offered candidate list holds only `Int64`/`UInt64` columns (`identity.rs:304`). Admission, however, takes any 8- to 64-bit integer (`identity.rs:333`; Note 2026-11-09 at `ADR-016:246`). So if any of the six hold an `Int32` key, it will not be in the list. It can be reached only by typing its name.

## 1. Today

**What is admitted:**
- A native `id` column of an integer type that widens into u64 (§2 at `ADR-016:62-63`, widened by the Note at `:246`).
- A declared mapping to a column of such a type (§3 at `:64-69`).
- Either one is scanned over the whole file at open for uniqueness, and for negative values (`dataset.rs:2045-2050`, `:2076-2098`; §5 at `ADR-016:81-92`).

**What is refused:** every other type, by `admit_column_type` (`identity.rs:324-346`).

**The session tier.** A single file that has no `id` column and no declaration opens on the session tier: the row position within one open (Amendment 1 item 1, `ADR-016:186-208`). That tier is not publishable (`kernel/src/publish/mod.rs:513-520`).

**Why a text `id` is refused. The reason is structural, not only policy:**
- §4 admits only a deterministic, value-preserving mapping (`ADR-016:70-75`).
- §7 makes width part of the contract: the identity reaches consumers exact or not at all (`:106-110`).
- The ADR lists non-integer keys, and anything that needs a hash, as undecided (`:137-138`). The third OPEN is still open (`:178`).
- The code carries every identity as u64 on every path:
  - the batch envelope's `id` field is `UInt64`, non-null (`engine/src/envelope.rs:254`);
  - the stream reads it into a `Vec<u64>` (`engine/src/stream.rs:2660-2689`);
  - LOD tiers know only U64 and I64 ids (`engine/src/lod.rs:1263-1266`);
  - the shell decodes ids into a `BigUint64Array` (`frontends/shell/src/canvas/decodeBatch.ts:167`, `:236`, `:249`) and keys selection on `bigint` (`frontends/shell/src/workspace/selection.ts:48`);
  - a bundle's `id` is `UInt64` with rows in ascending id order (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:118-119`; ADR-017 is Accepted and architect-blockable, `:3`).
- A text value cannot reach u64 without a hash or a dictionary index, and both are refused (`identity.rs:320-323`; §4 at `ADR-016:73-75`).

**"Lasting" is weaker than the word suggests, for integer ids too:**
- Stability across reopen is still an open question in the ADR (`ADR-016:171-176`).
- No project or step writes a feature id (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:223`).

What separates a native or mapped identity from the session tier in today's build:
- the scan that verifies the column;
- no session statement in the summary;
- publish is allowed;
- the identity is a file value, so it survives the rows being reordered in a rewritten file.

## 2. The change

**Three ways to admit text. I recommend A.**

- **(A) Text carried as text, end to end. Recommended.**
  - The identity value is the column's UTF-8 bytes, with no normalization, trimming or case folding. That is value-preserving in §4's sense.
  - The batch's `id` column is `Utf8` for such a dataset, and `describe` states the type before the first batch.
  - This widens the admitted types inside ADR-016's existing model, so it is **an amendment**. It is appended after whatever amendment number is last at its base: Amendment 2 is the identity route's and Amendment 3 is the text-id draft, so this would likely be Amendment 4.
  - It settles the text part of the third OPEN and leaves the rest of that OPEN open.
  - It is a red-line text, so its words are the human's.
- **(C) A fixed hash into u64, with the hashed values verified distinct at open.** Not recommended.
  - It contradicts §4's "value-preserving" (`ADR-016:70`) and the reason for the hash exclusion at `:137-138`.
  - A later revision of the file can collide and then be refused.
  - The u64 is not the user's key, so display, filters and joins all need the text alongside it.
  - The hash function becomes a frozen format commitment.
  - This would be a **new ADR** that supersedes ADR-016 §4 and §7.
- **(E) A row-position u64 handle on the wire, with the text column as a verified lasting key.** Not recommended.
  - It splits identity into two values.
  - It collides with the reserved name `id`: the projection refuses it (`engine/src/attributes.rs:468`), and so does the alias rule (`engine/src/predicate.rs:1132-1144`).
  - Bundles and future persistence would still need the text carried.
  - This would be a **new ADR**, and it changes how ADR-010 rule 2 is read.

**Clauses the amendment under (A) touches:**
- **ADR-016:**
  - §2 (`:62-63`): the native form becomes "an integer column named `id`, or a text column named `id`" (`Utf8`, `LargeUtf8` or `Utf8View`; not Binary or dictionary).
  - §3 (`:64-69`): a mapping may name a text column.
  - §4 (`:70-80`): text is value-preserving when carried byte for byte. A hash, a rank or a dictionary index is still refused.
  - §5 (`:81-92`): verified over the text values, nulls refused explicitly, and equality is byte equality.
  - §6 and its SETTLED block (`:150-169`):
    - `max_value` and `js_exact` do not apply to text. Today `js_exact` null means "unverified" (`:157-158`), so the record needs a value-type member to tell "not applicable" from "unverified".
    - The fourth bullet (the candidate list, 64-bit integers, `:165-169`) changes only if R4 below is ruled that way.
  - §7 (`:106-110`): for text, "exact" means the bytes. It adds a declared ceiling on key length (ADR-010 rule 6).
  - "Does not decide" (`:137-138`) and the third OPEN (`:178`): narrowed to binary, UUID and composite keys.
  - Amendment 1 item 6 (`:234-236`) is unchanged.
- **ADR-017 §4** (`:118-119`): the `id` type and the row order by identity. Either text identities are refused at publish until an ADR-017 amendment with a format version, or that amendment comes first (R3).
- **No word changes, but a reading is touched:**
  - ADR-010 rule 2 (`docs/adr/ADR-010-render-frames-origins-boundaries.md:33`) does not name a type;
  - ADR-028 (`:9`, cross-tile de-duplication rests on identity);
  - ADR-034 Decision 5 (`:78`);
  - ADR-021's alias rule (`:23-24`);
  - ADR-036 §5's `admission.identity` (`:113-115`), whose shape is unchanged.
- **`docs/02_Architecture.md:79`** says non-integer keys "remain open". It needs a dated note.

## 3. Cost, by module, for (A)

All of these are estimates, not measurements. No performance claim is made (docs/08).

**Engine. About 8–10 product files and 350–500 lines; about 6–10 test files and 600–900 lines.**
- Admission:
  - a text arm in `admit_column_type`;
  - a value type on `IdSource`/`DatasetIdentity`;
  - for text, the scan counts `count(*)`, `count(col)`, `count(DISTINCT col)` and the largest key length, instead of min and max.
- Nulls, including an existing message defect:
  - `count(DISTINCT)` skips NULL, so today a single null in an otherwise unique **integer** `id` is refused with the detail that "at least two features share an identity" (`dataset.rs:2088-2097`). In that case the detail is false.
  - An explicit null refusal, for every type, belongs in this piece or in a small fix before it (R6).
- Keys and joins:
  - `envelope.rs:254` becomes a per-dataset id type;
  - `column_u64` (`stream.rs:2660`) becomes an id-column abstraction;
  - `ORDER BY` the source column (`stream.rs:1486-1489`) becomes a byte-order sort. The engine sets no collation (no match for "collat" under `engine/src`), and a test must pin byte order;
  - LOD gets a text `IdType`;
  - the experimental index's numeric id ranges (`stream.rs:1533-1538`) do not apply to text;
  - filtering `id = '…'` on a native text `id` is consistent, because `id` is the file's own column.
- Memory and time:
  - a distinct count over text at 5 GB is a hash aggregate whose memory grows with the number of keys times their length;
  - the engine sets no `memory_limit` or `temp_directory` (no match under `engine/src`), and I could not confirm whether DuckDB spills here;
  - this lands on the cold-open budget the ADR records as unmeasured (`ADR-016:89-92`). A tester measurement is owed before any claim.
- Tests that pin today's refusal need re-aiming: `identity.rs:385`, and `engine/tests/identity.rs`'s `…_is_refused_not_hashed`.

**Wire (SKP). About 15–20 files and 300–400 lines, about 190 of them the literal bump (calibrated on the text-id form, line 234).**
- `IdentityInfo` (`protocol/skp/src/v0/commands.rs:192-222`) gains a value-type member.
- The data-plane batch schema `[id, geometry, …]` (`protocol/skp/SKP-V0.md:1202`) admits a `Utf8` `id`.
- §3's `DecU64` rule for ids (`SKP-V0.md:209-210`) gains a text form.
- A new refusal code: a text identity at publish (R3).
- `OpenDatasetRequest` does not change (`commands.rs:21-40`). No control-plane command carries feature ids: the only `DecU64` members are at `commands.rs:203-204`, `:243` and `:437`.
- Literal: the next unused one at its base, after the identity route (0.15), text-id (0.16) and the recovery offer.

**Shell.**
- Every id path today is `bigint` (`grep` finds about 50 files under `frontends/shell/src`, about half of them tests).
- **Full option.** A FeatureId type across decode, selection, scope, the resident sets, pick, highlight, table, the feature panel and hover: about 20 product files and 400–600 lines, plus about 25 test files and 600–900 lines.
- **Interning option.** `decodeBatch` maps each text id to a handle that lives only for the open; display shows the text: about 5–7 product files and 150–250 lines, plus 250–400 test lines.
  - Its risk is that handles must never be reused and the intern table only grows.
  - It is a design choice for the form, and the gate reads it against §4.
- Neither option can land after the engine change: `BigInt(rawId)` (`decodeBatch.ts:249`) does not handle a string. The engine change and the shell change land in one piece.
- The declaration form: free text already exists in the identity route (its §1, line 65). The candidate list is R4.
- How the identity is shown: `identitySummaryLine` renders the source and uniqueness as sent (`describeSummaryText.ts:37-39`). It does not need to change; it may add the type.
- The row-position offer: its condition is the engine's refusal on `id` (text-id form, F2 at lines 39-43). It shrinks automatically to text `id`s with repeats or nulls and to other types. No shell code changes for it.

**Saved projects. About 0–2 product files.**
- The identity field keeps its shape: `{column}` or null (`kernel/src/dataset_ref.rs:216-233`, `:282-298`). There is no ADR-036 version step (`ADR-036:64`).
- The reopen check compares only the mapped column (`dataset_ref.rs:333-340`, `:383-388`). The recorded null therefore covers both the native and the session tier, so the tier is not recorded.
- Projects saved before the change:
  - a mapped integer column reopens unchanged;
  - a project saved after a set-aside open of a unique text `id` (once text-id lands) reopens natively and asks nothing;
  - nothing persisted depends on the identity space (`ADR-036:223`). I recommend accepting this and recording it as a limit (R7).
- An older app reading a newer project that is mapped to a text column refuses at admission. It fails closed.

**Documents. About 150–250 lines.**
- The ADR-016 amendment.
- `KNOWN-LIMITATIONS.md` item 3: its heading, "single integer column" (`:62-67`), becomes untrue. Who worded it is to be checked; if it is the human's, the human words it.
- A walkthrough Part and an e2e step.

**Total for one piece covering engine, wire, shell and documents, with publish refused:**
- with the interning option: about 2,200–3,000 lines over 60–90 files;
- with the full shell option: about 3,000–4,200 lines over 100 or more files. Splitting is advised.
- A bundle piece under ADR-017 is separate: `kernel/src/bundle`, `kernel/src/publish`, `renderer/src/canonical.rs` and `bundle-viewer`, about 10–15 files and 600–1,000 lines, plus a format version.

## 4. The two pieces in hand

- **Identity route.** Admitting text changes nothing in it:
  - its candidate decision 4 holds (form line 535);
  - free text covers text columns;
  - it keeps literal 0.15 and goes first.
  The message's item 2 asks to move it up. It is already placed ahead of text-id by ADV-2026-11-23-35, so I add no further change.
- **Text-id.** Its offer condition is the engine's refusal set, so its scope, code and condition are unchanged. Item 1's condition holds in either order: the offer is made whenever the file's own `id` cannot serve, whether by its type or by repeated values. Its fixture is the problem:
  - File A and the e2e text files are unique, non-null text (`fixture.rs:1242`; form §3 line 148);
  - N-1, N-2, K-1, K-4 to K-7 and E-1 (a) and (d) would admit natively after text admission;
  - S-2's "opening the file again asks again" (form line 133) would stop applying to unique text ids.
- **Order. I recommend: identity route, then text-id, then the recovery offer, then text admission.**
  - The text-admission piece carries the re-aims: the text-id fixtures move to repeated text, null text or a non-text `id`; a repeated-text case is added (the Swiss case); S-2 and item 3 get new words.
  - Do not amend text-id now. That would be a class-9 addition with no ruling behind it.

## 5. For a ruling, each with my recommendation

- **R1. Model.** Recommendation: A. C and E each need a new ADR.
- **R2. Vehicle.** Recommendation: an ADR-016 amendment in the human's words, since it is a red line. The architect drafts it.
- **R3. Publish of a text identity.** Recommendation: refused by name in the first piece, with an ADR-017 amendment and format version as a later piece.
- **R4. Candidate list.** Recommendation: unchanged, 64-bit integer columns only, with text declarable by free text; listing every text column would flood the list, and filtering it by cardinality would be inference (§3). Open question for the same ruling: whether `Int8`–`Int32` should be listed, since the app admits them but does not offer them (item 2's six).
- **R5. Text values.** Recommendation:
  - byte-exact, no normalization; lookalike ids are distinct and recorded as a limit;
  - an empty string is a value and is admitted, with visible-escape display;
  - the key-length ceiling is set in the piece's form (ADR-010 rule 6).
- **R6. The null-detail defect at `dataset.rs:2088-2097`.** Recommendation: an explicit null refusal for every type, fixed in the text piece, or earlier as a small engine-message fix if the human prefers. In the null case the message states something the engine did not find.
- **R7. Tier not recorded in projects.** Recommendation: accept, and record it as a limit. No project version step.
- **R8. Interning versus full FeatureId in the shell.** Recommendation: a form decision for the architect, not a ruling, after a measurement of resident id memory.
- **Open, not ruled.** The docs/08 dataset and budget for the text uniqueness scan at 5 GB. A tester measures it before any number is stated.

## Files read (at 20ed759b)
- `D:/wt/read-1124f/docs/adr/ADR-016-stable-feature-identity-admission.md`
- `D:/wt/read-1124f/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`
- `D:/wt/read-1124f/docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md` (`:1-30`, `:105-134`, `:630-649`)
- `D:/wt/read-1124f/docs/adr/ADR-010-render-frames-origins-boundaries.md` (`:30-35`)
- ADR-016 mentions grepped in `docs/` (ADR-015, ADR-017, ADR-018, ADR-019, ADR-021, ADR-023, ADR-026, ADR-028, ADR-032, ADR-034, ADR-036, `docs/02`, `docs/README`)
- `D:/wt/read-1124f/governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md` (whole)
- `D:/wt/read-1124f/governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md` (grep, `:525-544`)
- `D:/wt/read-1124f/governance/PLAN.yaml` (`:5018-5054`)
- `D:/wt/read-1124f/engine/src/identity.rs` (whole), `engine/src/dataset.rs` (`:1940-2239`), `engine/src/envelope.rs` (`:1-80`, `:230-269`), `engine/src/stream.rs` (`:1420-1538`, `:2660-2719`), `engine/src/error.rs` (`:355-366`), `engine/src/predicate.rs` (`:1120-1149`), `engine/src/attributes.rs` (`:455-479`), `engine/src/lod.rs` (grep), `engine/src/fixture.rs` (grep)
- `D:/wt/read-1124f/kernel/src/dataset_ref.rs` (`:20-79`, `:195-404`), `kernel/src/publish/mod.rs` (`:490-539`)
- `D:/wt/read-1124f/protocol/skp/src/v0/commands.rs` (`:15-44`, `:185-224`, grep), `protocol/skp/SKP-V0.md` (`:55-84`, grep)
- `D:/wt/read-1124f/frontends/shell/src/admission/describeSummaryText.ts`; `decodeBatch.ts` and `selection.ts` (grep)
- `D:/wt/read-1124f/KNOWN-LIMITATIONS.md` (`:55-74`)

Model: Opus 5.5 (claude-opus-5-5).
