Reviewed: the form at main b5d2d7139509cd86ab7fc239870837875032a9b1 in the read checkout D:/wt/read-1124d, read only (the custodian's filing note, 2026-11-24: the architect's form gate, attempt 3, node:text-id-opens-for-the-session-by-row-position@form-gate-architect-3, under ADV-2026-11-24-05 item 6, on the unapproved draft ADV-2026-11-23-34 as ADV-2026-11-23-33 item 5 allows; dispatched at 2026-11-24T03:58:55Z; its run: Read 26, Grep 23, SubagentHandback 2, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T03:58:56Z to 2026-11-24T04:07:49Z by its transcript; 0 calls named the main checkout. It handed back twice: at 2026-11-24T04:06:11Z (13721 bytes, sha256 6b56c96b55f9f8ed2a5117d92ae6ed2a3d71e568192d52ed1c9b9196e7a80c66), and, after the custodian's message of 2026-11-24T04:05:32Z carrying ADV-2026-11-24-11 item 4, at 2026-11-24T04:07:48Z with the same report and that item's paragraph, as its third paragraph says. Filed below the rule from the second hand-back, 16640 bytes, sha256 9d2691eeeb380cf7f48c73320a93e167cb005a642fdf83aba254a42fa9b8f625, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES
Reviewed: D:/wt/read-1124d @ b5d2d7139509cd86ab7fc239870837875032a9b1
This gate ran on an unapproved draft. The form rests on the architect's draft of ADR-016 Amendment 3 (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`). The human has not approved ADV-2026-11-23-34, which puts that draft to them. ADV-2026-11-23-33 item 5 lets the gate run on it.

(This hand-back replaces my first one. It is the same report, with the paragraph "ADV-2026-11-24-11 item 4" that the custodian's mid-run addition asked for, placed after the findings, and two more reads in "Files read". Nothing else changed.)

How the findings map onto AUTONOMY §22: there are no Correctness or Evidence findings. There are three Documentation findings (D4, D5, D6), and each must be fixed before the merge. They ask for no further attempt (ADV-2026-11-21-20). None of the words below are the human's. They are the architect's, replacing the custodian's form text, so the custodian applies them with no re-gate, as a new amendment that names each Old. All form cites below are `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md` at b5d2d713.

## Check 1: Amendment 4, item by item

Each New matches attempt 2's report byte for byte, by my side-by-side reading of form :607, :621, :635, :649-651, :665, :679, :693-694 against report :44, :50, :56, :71-73, :85, :91, :122-123.

| item | Old once, outside Amendment 4 | closes its finding where placed | true at b5d2d713 |
|---|---|---|---|
| 1 (C5, 84 count) | yes, :554 | yes | yes. `engine/tests/identity.rs:241-244` asserts `detail.contains("synthesized")` on the refusal built at `engine/src/identity.rs:336-344`. The new sentence (ADV-2026-11-24-05 item 2 (a)) contains `no stable identity`. The stop it names is narrower than the ceiling (D6). |
| 2 (C5, fifth place) | yes, :572 | yes | yes. The whole-sentence search does not match `tests/identity.rs:242`. |
| 3 (C5, search by parts) | yes, :573 | yes | yes (check 2) |
| 4 (E4, rows) | yes, :202 | yes | yes (check 3) |
| 5 (D3, names) | yes, :571 | yes | yes. `admit_column_type` is at `identity.rs:324`. Row I4 is at `MANUAL-WALKTHROUGH.md:598`, under Part I at `:499`. `STRING_ID_MESSAGE` is at `admission-remediation.mjs:82` and `regression.mjs:115`. |
| 6 (D3, R-ENG) | yes, :575 | yes | yes. `reopenNotices.ts:99` names R-ENG. |
| 7 (S-8, item 14) | yes, :129 | yes, for placement | mostly. Two clauses are untrue, and the list of doc comments is short by three (D4). |

## Check 2: C5's search

- At b5d2d713 I searched `engine/`, `kernel/`, `protocol/` and `frontends/` for:
  - `synthesized`, `ADR-016 refuses`, `is not a mapping` and `which ADR-016`;
  - `widens into u64`, `dictionary index` and `type is Utf8`;
  - `contains(`, `toContain(`, `toMatch(` and `includes(` over those words.
- `engine/tests/identity.rs` is the only place outside the four named that pins a part of the detail that the new words do not hold.
- The other matches do not pin it:
  - comments: `engine/src/identity.rs:322` and `engine/tests/identity.rs:226`;
  - `engine/ADMISSION-RESULTS.md:23` and `:43`, which are not edited;
  - unrelated text: `engine/README.md:397`, `attributes.rs:364`/`:911`, `publish/mod.rs:445`/`:1895`, and `MANUAL-WALKTHROUGH.md:672`/`:696`.
- `v0-error-identity_unusable-with-candidates.json:3` holds the no-such-column detail, not this one.
- The count is 84 with no slot left:
  - 76 paths in §7, recounted: 5 engine, 27 kernel, 24 protocol, 17 shell and 3 documents;
  - 2 from Amendment 2, which are not among the identity route's 14 data fixtures (its form :230);
  - 2 from C1, 1 from N-S and 2 from S-8;
  - `engine/tests/identity.rs` as the 84th.
- At b5d2d713 there is no 85th place. At the base, any further place, not only a wire fixture, would be an 85th path. That is a stop that goes to the advisor (D6).

## Check 3: E4's rows

**S-T6b**
- File: `AdmissionPanel.test.ts`, by "same:" after S-T6. That file tests pure exports of `./AdmissionPanel` (`AdmissionPanel.test.ts:8-21`).
- Red reason: at the skeleton the function exists and returns `{ ...options, identity }`, so the test is red because the flag survives. That is not a compile error.
- Mutation: M-23b is the skeleton's own behaviour, so it fails the test.

**S-T8**
- File: `reopenNotices.test.ts`, mocking `../skp/client` and `../diagnostics/log` as `openProject.test.ts:11-30` does. The existing tests there are unaffected: `reopenNotices.ts` imports only types (`:18`), and `shownText.ts` imports only a type (`:18`).
- Red reason: `AdmitOptions.setAsideFileId` and the S-8 constant exist at the skeleton (§4 :157), and `admitProject` takes the owner from `reopenRefusalPlace` alone (`openProject.ts:76`). So the test is red because the owner is R-ENG. That is not a compile error.
- The clauses for `engine.cancelled` and `skp.*` hold: `reopenRefusalPlace` returns null for `engine.cancelled` (`openProject.ts:86`) and its own place for `skp.*` codes (`:88-93`).
- `engine.query` is a real code: `skp.rs:2208` maps `Query` to `query`.
- Mutation: M-26 is the skeleton's own behaviour, so it fails the test.

**§5:** both rows sit in §4, above §5, so §5's two predictions at :217-218 cover them.

## Check 4: item 14 and S-8

- **`admitProject` as "the one place":** this is untrue. `runAdmitPath` also holds both the attempt's options (`AdmissionPanel.tsx:218`) and the refusal (`:275`), and it copies `outcome.owner` (`:282`). `admitProject` is still the right place, because the owner is chosen there today (`openProject.ts:76`) and `runAdmitPath` also runs dataset opens. The wording is D4.
- **`reopenRefusalPlace`:** its signature is unchanged and its test is unchanged (`openProject.test.ts:86-101`). Its only product caller is `openProject.ts:76`, so "its other callers" names callers that do not exist (D4).
- **The three doc comments named are in the Scope:**
  - `reopenNotices.ts:99` and `reopenNotices.test.ts:5-6`, by Amendment 3 item 6;
  - `openProject.ts:13`, by §7 :268.
- **Three more doc comments in Scope files become untrue** (D4):
  - `openProject.ts:80-83`, `reopenRefusalPlace`'s doc ("The owner's place beside a reopen refusal");
  - `AdmissionPanel.tsx:104`, the `owner` member, which names `reopenRefusalPlace` as the source of the owner place;
  - `AdmissionPanel.tsx:211-212`, `runAdmitPath`'s reason that a reopen's claims are "the project file's, not the user's".

## Check 5: N-S

- The form does not say that N-S asserts the open succeeds. It carries N-S by reference only (Amendment 3 item 2, :536).
- Without that assertion, N-S is still red at the skeleton, but only through N-7's input: at the skeleton a declared `parcel_key` open runs its scan, so the delta is 1 where 0 is expected.
- So the named red reason, "N-3's input is refused" (attempt 1's report :39), does not hold unless the success assertion comes first. Words are in D5.

## Check 6: the ceilings

- **Files:** 84, at the ceiling.
- **Lines:** Amendment 3's ~2,060, plus the following:
  - C5: about 2 lines.
  - S-T8: the mock block alone is about 20 lines (as at `openProject.test.ts:11-30`). With the test and the three doc corrections, S-8's real cost is about 55-60 lines against its ~34 row, so about 25 more.
  - D4's three more doc comments: about 9 lines.
- My estimate is **~2,085 to ~2,096**. That is not above 2,100, so nothing goes to the advisor on the estimate, but the margin is essentially gone.
- Amendment 4 does not restate the estimate. An overrun at the head is class 8, and §7's line is never edited to match. That is a note, not a finding.

## Check 7: the human's item 2 (directive :10), with Amendment 4 in place

- **Offered only when the file's own `id` cannot serve:** unchanged (§2 item 12; S-T1). Met.
- **Chosen by the user, never taken silently:** unchanged, and strengthened. S-T6b now tests the refused-block submit that §9 :336 blocks on sight. Met.
- **The summary says so:** S-3 (S-T3). Met.
- **Nothing saved or published:** S-8 is an owner constant shown in the refusal block. The reopen log line records the code and the message, not the owner (`openProject.ts:75`). Nothing new is persisted. Met.
- **§9:** each item agrees with the four requirements. "Any path outside §7" is read as §7 together with the class-9 additions of Amendments 2 to 4.

## Check 8: other disagreements

- D6: the stop that item 1 and Amendment 4's preamble name covers only a wire fixture, while item 3 says every pinning place changes in this piece.
- Amendment 3 item 4's row "a wire fixture if one is found" (:566) is now moot. It is an estimate only, so no words.
- No ADR-016 Amendment 3 draft clause is made untrue in a new way by Amendment 4.

## Findings

### D4 (Documentation): item 14's placement reason and its list of doc comments

- **Place:** Amendment 4 item 7's New, :694.
- **What is wrong:** "the one place" is untrue (`AdmissionPanel.tsx:218`, `:275`). "its other callers" names none (`openProject.ts:76` is the only product call). Three more doc comments become untrue (check 4).

```text
The shell tells the two reopen attempts apart in `admitProject`, the one place that holds both the refusal and the attempt's options:
```
```text
The shell tells the two reopen attempts apart in `admitProject`, where the owner place is chosen today and which holds both the refusal and the attempt's options:
```
```text
`reopenRefusalPlace` keeps its signature, so its other callers and its test do not change.
```
```text
`reopenRefusalPlace` keeps its signature, so its test in `openProject.test.ts` does not change; `admitProject` is its one product caller.
```
```text
Three doc comments this makes untrue are corrected in the piece: `ENGINE_REFUSAL_NOTICE`'s, which places it beside every engine refusal at a reopen; `openProject.ts`'s header, which says the owner place is chosen from the code alone; and `reopenNotices.test.ts`'s header, which says each test there checks a builder's slots.
```
```text
Six doc comments this makes untrue are corrected in the piece: `ENGINE_REFUSAL_NOTICE`'s, which places it beside every engine refusal at a reopen; `openProject.ts`'s header, which says the owner place is chosen from the code alone; `reopenRefusalPlace`'s, which calls its result the owner's place beside a reopen refusal; in `AdmissionPanel.tsx`, the `owner` member's, which names `reopenRefusalPlace` as the owner place's source, and `runAdmitPath`'s, which says a reopen's claims are the project file's and not the user's; and `reopenNotices.test.ts`'s header, which says each test there checks a builder's slots.
```

Each clause checked against the code:
- "the owner place is chosen today" in `admitProject`: `openProject.ts:76`.
- It holds the options and the refusal: `openProject.ts:62` and `:74`.
- Its test is in `openProject.test.ts`: `:86-101`.
- `admitProject` is its one product caller: `openProject.ts:76`; the only other call is the test at `openProject.test.ts:89`.
- `reopenRefusalPlace`'s doc: `openProject.ts:81`.
- The `owner` member's doc: `AdmissionPanel.tsx:104`.
- `runAdmitPath`'s doc: `AdmissionPanel.tsx:211-212`. With the choice, the attempt carries the user's click (§2 item 12).
- The other three comments are as attempt 2 checked them.

### D5 (Documentation): N-S's red reason needs the open to succeed

- **Place:** Amendment 3 item 2, :536.

```text
   - E1: §4's row N-9, and the new row N-S in its own new file;
```
```text
   - E1: §4's row N-9, and the new row N-S in its own new file; N-S also asserts, before its scan counts, that N-3's input opens on the session tier, so that its red at the skeleton is the reason its row names;
```

Clause check:
- At the skeleton the set-aside open is a plain open (§4 :158), so N-3's input is refused for repeated values.
- Without the assertion, the only red comes from N-7's delta.

### D6 (Documentation): the stop names only a wire fixture

- **Place:** Amendment 4 item 1's New (:607), and Amendment 4's preamble (:594).

```text
A wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope, would be an 85th path: that is a stop, and the file ceiling goes to the advisor before code.
```
```text
Any place that item 5's search at the base finds outside the Scope, a wire fixture included, would be an 85th path: that is a stop, and the file ceiling goes to the advisor before code.
```
```text
With item 1 below, the 84th path is `engine/tests/identity.rs`, and a wire fixture found at the base is a stop.
```
```text
With item 1 below, the 84th path is `engine/tests/identity.rs`, and any place outside the Scope that item 5's search finds at the base, a wire fixture included, is a stop.
```

Clause check: item 3's New (:635) has every pinning place change in this piece, and the file ceiling is 84 with no slot left (check 2).

## ADV-2026-11-24-11 item 4

This paragraph changes nothing in the form.

**Attempt 2's premise does not match the code at b5d2d713.**
- The `question` state and the `not_found` state keep the attempt's options (`AdmissionPanel.tsx:242`).
- But neither retry sends them:
  - the question's two answers call `reopenPath(state.folder, { answer, relink })` (`:523`, `:526`);
  - the re-link calls `handleRelink(state.folder, state.options)` (`:539`), which reads only `options.reopen?.answer` and calls `reopenPath` (`:397`);
  - `reopenPath` runs `runAdmitPath(folder, { reopen }, …)` (`:363-366`), which builds options from `reopen` alone.
- So, as the code stands, a retry after one of these replies drops the choice. It does not carry it with no carried line.
- The form does not say which way it goes. §2 item 12 says only that the choice re-runs `runAdmitPath` and keeps a reopen's answer and re-link.
- If the choice is dropped, the retry is refused for the file's `id` again and S-1 is offered again. That is one more click, and nothing is taken silently.

**There are two ways to close it.**

(A) **Drop the choice** (the current shape, with the gate's words for Decision 1).
- One sentence goes in §2 item 12: a retry after a `question` or `not_found` reply carries the answer and the re-link, and not the choice.
- One pure-function test goes in `AdmissionPanel.test.ts`.
- About 10 lines. No file is added.

(B) **Carry the choice and show S-5 beside both replies.** S-5's words hold there, because the retry those buttons start would carry the choice.
- `reopenPath` takes the choice through (`AdmissionPanel.tsx:363-366`). That is best done as an exported pure function that builds a retry's options, which keeps the flag and drops nothing else.
- Its three call sites change: `:523`, `:526`, and `handleRelink` at `:397`.
- S-5 is rendered as a carried line in the question block (`:520-533`) and the not_found block (`:536-543`) when `state.options.setAsideFileId` is set. A shared predicate keeps it testable, because the package has no render harness (attempt 1's C2).
- Two tests, each with a mutation, go in `AdmissionPanel.test.ts`, and §4 gains two rows.
- That is about 45-50 lines, in Scope files only (`AdmissionPanel.tsx` and its test).
- If the advisor wants the line seen in a mounted App, `App.reopen.test.tsx` would be an 85th path, which is a stop.
- On my check 6 estimate of ~2,085-2,096, (B) brings the piece to about **2,130-2,145, above the 2,100 ceiling**. So (B) needs the advisor's line ceiling restated before code. (A) stays at ~2,095-2,106, at or just past 2,100.

## Files read (at b5d2d713, in `D:/wt/read-1124d`)

- **The form, rulings and reports:**
  - the form, whole;
  - attempt 2's and attempt 1's reports;
  - ADV-2026-11-24-05;
  - the human's message of 2026-11-23;
  - the ADR-016 Amendment 3 draft;
  - the identity route's form, `:226-237`.
- **engine:**
  - `src/identity.rs:320-349`;
  - `tests/identity.rs:200-249`;
  - `tests/admission_p4_corpus.rs:385-424`;
  - `README.md:393-400`;
  - searches.
- **kernel:** `src/skp.rs:2130-2149`, and searches.
- **shell:**
  - `src/project/{openProject.ts,reopenNotices.ts,reopenNotices.test.ts,shownText.ts (imports)}`;
  - `src/project/openProject.test.ts:1-110`;
  - `src/admission/AdmissionPanel.tsx:96-107`, `:200-299`, `:363-401` (by search) and `:505-584`;
  - `src/admission/AdmissionPanel.test.ts:1-30`;
  - `src/admission/admitDataset.ts:25-74`;
  - `MANUAL-WALKTHROUGH.md`, by search.
- **Searches** over `engine/`, `kernel/`, `protocol/` and `frontends/` for the detail's parts, `IdentityAliasAmbiguous`, `reopenRefusalPlace`, `ENGINE_REFUSAL_NOTICE`, `reopenPath` and `handleRelink`.

Model: claude-opus-5-5
