*Filed by the custodian: the lead-data's draft of Amendment 4 to `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, after the architect's form gate, attempt 2 (FAIL; `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-2.md`, gate-log row 869) and the advisor's ruling ADV-2026-11-23-16 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-16-the-recovery-offer-open-1-c-open-4-b-open-3-a-open-2-not-as-drafted-the-unsaved-twin-removed-op6-moves.md`), node:b2-piece-1c-step-3-recovery-offer@amendment-4-lead-data-draft, dispatched at 2026-11-23T16:22:15Z. Its run: Grep 16, Read 15, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-23T16:22:15Z to 2026-11-23T16:39:52Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 44650 bytes, sha256 c6de9bdce4185e4ee65e6bd0a32fb056893789a1a86ab480edae0c9ddd5cefaf, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 5 follows it.*

---

Result: Amendment 4 is drafted. It adds a no-question clear at a project's open for a record with nothing after its last save, and the removal of the `unsaved-` twin in the same act. It redesigns the start's dedupe so the project side is read once, after and under every taken record's lock, and only a byte-equal `locations.json` can withhold a record. It adopts E-3, E-4 and N-14 to N-18, adds tests K-C25 to K-C37, and moves the ceiling to 5,260 lines.

---AMENDMENT 4---
## Amendment 4 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 2 (FAIL), and ADV-2026-11-23-16: C-8, E-3, E-4, the documentation findings and the rulings

*Post-result amendment. It was written after two outcomes were seen: the architect's form gate, attempt 2 (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-2.md`, FAIL), and the advisor's ruling ADV-2026-11-23-16. Lead-data drafted it before any code. Finding ids (C-8, E-3, E-4, N-14 to N-18) are that report's, and ruling items are ADV-2026-11-23-16's. Every `path:line` in this amendment is read at caea224a6cb081edc4577e978e408692c0c1172c. The drafter has no hashing tool, so the custodian adds each span's sha256 at filing. Each Old text below occurs once in the form above this amendment. An Old text inside one of Amendment 2's New fences replaces that New text in place, and where an Old text is part of a line, only that part is replaced. Items are this amendment's unless another amendment is named. No string, KNOWN-LIMITATIONS text or ADR word is ruled here.*

1. **The rulings, recorded.**
   - OPEN-1 is ruled (C) (ADV-2026-11-23-16 item 1), OPEN-4 (B) (item 2) and OPEN-3 (A) (item 3). Amendment 2's text under (C) and (B) stands, as this amendment revises it.
   - OPEN-2 is ruled "not (A) as drafted" (item 4). Discard on an offer at an open is in order. A project's record that another run left, that no live run holds, and that holds no step after its last `saved-here` mark must not leave item 70's sign for good. Item 2 below says how. Until this amendment passes, no code is written for that case.
   - The unsaved twin is removed (item 5). Item 3 below drafts it.
   - ADR-036 §9 gets no amendment for the offer at an open (item 6). If item 2 or 3 needs words in ADR-036, lead-data drafts a note, the architect checks it, and the advisor words it. Item 9 below has the note.
   - Item 43 is the advisor's to word, with items 70 and 76, from the filed text once the form's gate has passed (item 7).
   - OP6 moves to this form's operator Part (item 8). It is recorded here in item 10. The custodian records the move by an amendment to the 1c form.
   - Whether the list's bound holds under docs/01 principle 7 is the architect's to judge (item 9).
   - The strings and the limitation drafts are drafts. The build uses them under the placeholder mark (item 10).
   - The ceiling of 4,330 lines was accepted as declared (item 11). Item 11 below moves it, and the new one goes to the advisor (item 12 (d)).
   - Under OPEN-3 (A) a test pins what is given to the formatter (item 3). S-1's row says so:
````text
| S-1 | `the_offer_names_the_file_and_the_time` | time omitted | S-1 |
````
````text
| S-1 | `the_offer_names_the_file_and_the_time` (it asserts the instant taken from the last step's UTC `at` and the local date-and-time options handed to the formatter, not the text the operating system returns; OPEN-3 (A), ADV-2026-11-23-16 item 3) | time omitted | S-1 |
````

2. **OPEN-2, under ADV-2026-11-23-16 item 4: such a record is cleared at its project's open, with no question.**
   - **The rule.** At an open, `list_recoverable(handle)` reads `<root>/<project hex>` by name (Amendment 2 C-1). In order:
     1. It runs `try_lock` on the history. `WouldBlock` means a live run holds it: nothing is cleared and nothing is listed. Any other failure gives `cannot-be-offered` (`no-step`), as Amendment 2's C-4 text says.
     2. It reads through that handle, bounded to `MAX_SESSION_HISTORY_BYTES` + 1, and runs `recover_bytes`.
     3. The record is **cleared** only when all of these hold:
        - the header's `actions` is ≤ `ACTIONS`;
        - the kept lines hold at least one `saved-here` mark and no `step` line after the last one;
        - they hold no `restored` mark;
        - the reader found no failing line, or the failing line is the file's last segment and ends in no LF. That is a torn last write, which `History::append` never acknowledged: its `Ok` follows one `write_all` and one sync of the whole line (`kernel/src/session_history.rs:109-119`).
     4. **Clearing, in order:**
        - its twins are removed (item 3);
        - `history.jsonl` and `locations.json` are removed while the handle holds the lock (H2);
        - the handle is dropped;
        - the folder is removed.
        The reply lists nothing for it, and no string is shown.
     5. A record with no step after its last `saved-here` mark that fails step 3 only through a failing line with bytes after it is listed with Discard only (`cannot-be-offered`, `no-step`). A record that holds a `restored` mark is `later-version` (item 7, the N-13 bullet).
     6. Every other case is as filed. A step after the last mark, or steps and no mark, is offered (Amendment 2 C-1). The OPEN-4 (B) cases are listed with Discard only.
   - **After the clear,** the open stays unbound, as `reopened()`'s rule says (`kernel/src/session_history.rs:392-401`, unchanged). Its first step makes a record of its own. Its first save moves that record to `<project hex>`, which is now free (`adopt_project`, :366-378), and writes its mark, so item 70's sign does not show.
   - **Why clearing, from the code:**
     - A `saved-here` mark is written only after the save has replaced the project file (`kernel/src/project/mod.rs:406`; the history's moves follow at :418). It is also written only when the steps reach the workspace that save wrote (`kernel/src/session_history.rs:423-425`). So a record with no step after its last mark holds no change that the file its mark followed lacks.
     - What the clear removes is the step lines up to that mark. This version keeps no lineage: the save writes `lineage: Lineage::NotKept` (`kernel/src/project/mod.rs:355`). So no lineage holds those lines. But a normal end removes the same lines from every record its run made (`end_session`, `kernel/src/session_history.rs:437-448`; ADR-036 §9, "When it is cleared"). The clear removes what a normal end would have removed.
   - **The case where clearing loses something the lineage does not hold** (item 4 asks for it):
     - The case: the project file opened is not the one the last mark followed. For example, after that save the folder's `project.spatial` was replaced by an older copy, such as an earlier version of the plain-text file under version control. Then the record's steps reach a workspace the opened file does not hold, and the record is the app's only copy of it.
     - The kernel cannot tell at the list. It would need the workspace the reopen read, and `reopened()` is not given it. Its caller is in `kernel/src/project/mod.rs`, which §5 I8 keeps unedited.
     - The drafter recommends the clear anyway: the user replaced a file they had saved, and a normal end would have removed the record.
     - If the advisor finds the case material, the fallback is to offer such a record with Recover and Discard, as a record with a step after its mark is offered. Recover restores the last kept values. A question is then asked in the ordinary case too (item 12 (a)).
   - **Not "continued by the reopen".** Binding an open to a record another run left changes `reopened()`'s binding rule, which Amendment 2's C-1 text keeps. It also changes `open_project`'s behaviour, which §5 declares unchanged. And this run's normal end would clear the record anyway.
   - **Not "offered with Discard only".** That asks a question where nothing unsaved is at stake, which the advisor prefers to avoid.
   - **Concurrency.** The clear's removals are made under the record's lock, as `discard_recoverable`'s are (Amendment 2 N-1). An instance whose dedupe probes this history for its own read makes this open meet `WouldBlock`. Then nothing is cleared, and this run's save shows item 70's sign until the project is next opened. That window is one listing, and it does not block.
   - Text changes:
````text
and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2).
````
````text
and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2). A record with no step after its last `saved-here` mark is cleared at that open with no question, or listed with Discard only, as Amendment 4 item 2 says.
````
````text
Listing removes nothing: such a record stays until Discard
````
````text
A listing at a start removes nothing, and a listing at an open removes only Amendment 4 item 2's record and its twins: such a record stays until Discard
````
````text
At an open, one folder is read by name and none is walked.
````
````text
At an open, one folder is read by name, and the `unsaved-` folders are walked only for its twins when it is cleared (Amendment 4 items 2 and 3).
````
````text
a project's record is offered only with a step after its last `saved-here` mark; records that cannot be offered are left in place
````
````text
a project's record is offered only with a step after its last `saved-here` mark, or with steps and no mark; one with no step after its last mark is cleared at its open (Amendment 4 item 2); records that cannot be offered are listed with Discard only (OPEN-4 (B))
````
   - **§2.4, added after the bullet that begins "`list_recoverable` is not cancellable":** At an open, `list_recoverable` clears the project's record that Amendment 4 item 2 names, with its twins, before it replies. `recover_session` and `discard_recoverable` on a project's record remove its twins in the same act (Amendment 4 item 3). The new §13 and §15 of SKP-V0 say so.

3. **The unsaved twin, under ADV-2026-11-23-16 item 5.**
   - **What a twin is.** An `unsaved-` record U is the twin of a project's record R when both of these hold:
     - U's `locations.json` bytes equal R's. A move copies that file byte for byte (`kernel/src/session_history.rs:553`), and nothing rewrites a session record's `locations.json`.
     - U's kept step ids, in order, are the first kept step ids of R, or neither holds a step.
     This rule requires more than the start's test (item 4), which compares the first step only, so a twin found at a start is removed only if its whole kept prefix is in R.
   - **When it is removed.** In the same act as R's recover (`recover_session` on R, step 4a, item 5), R's discard (`discard_recoverable` on R, step 3a, item 5) and R's clear (item 2). That act already holds R's lock and has read R. Twins are removed after the act's last check and before its first change to R. A crash in between leaves R whole, and R holds every line its twin held.
   - **The search, in order:**
     1. The folder names under the root are read, after R's lock.
     2. Each `unsaved-` folder is examined, at most `MAX_DEDUPE_RECORDS` of them (§7, as item 4 revises it):
        - `metadata` of its `locations.json`; a length other than R's is not a twin;
        - an equal length is read, bounded to that length + 1, and compared byte for byte;
        - on equal bytes, `try_lock` on its history. `WouldBlock` leaves it, because a live run holds it, this run included (H1, H3), and any other failure leaves it too;
        - once locked, it is read through that handle. First its header and first step line, bounded to `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes. In full, bounded to `MAX_SESSION_HISTORY_BYTES` + 1, only when that first step's id is R's first kept step id;
        - a twin's `history.jsonl` and `locations.json` are removed while its handle holds the lock (H2), the handle is dropped, and its folder is removed.
     3. Every handle that is not a twin's is dropped without a change.
   - **The state lock.** No step of the search holds the recorder's state lock (item 7, N-16).
   - **Past the bound,** twins that were not examined stay. Each is listed at a later start once R is gone, and holds only steps R held. Item 76 says so (item 10).
   - **Why the full read.** It keeps a twin whose lines R cannot read in full, after damage in R, from being removed. Such a twin is listed at a later start, once R is gone.

4. **C-8: the start's dedupe, redesigned.** The gate's points (1) to (4) are taken.
   - **The walk.** One `unsaved-` record is "taken" when the walk has locked and read it. The first of these Old texts sits in Amendment 2's C-4 New text; the other two are bullets of Amendment 2's item 4:
````text
whose first kept step id equals the first kept step id of a `<hex>` record is skipped
````
````text
whose `locations.json` bytes equal a `<hex>` record's and whose first kept step id equals that record's (Amendment 4 item 4) is skipped
````
````text
     - Then the dedupe runs, then the bounded read. The record is then listed, and it counts. Skipped folders do not count.
````
````text
     - Then the bounded read, through that handle, and the read of its `locations.json`, bounded to `LOCATIONS_LIMITS.max_bytes` + 1. The record is then taken, and it counts toward `MAX_RECOVERABLE_RECORDS`, whether it is then listed, found to be a twin, or withheld. Its handle, and so its lock, is kept until the dedupe ends. Of its bytes, only what its entry and the dedupe need is kept. Skipped folders do not count.
````
````text
   - **The dedupe** reads at most `MAX_DEDUPE_RECORDS` `<hex>` histories that exist and are not empty. Past that bound, or when a `<hex>` history is held by a lock (N-13), no `unsaved-` record is listed at that start, and `more` is `true`.
````
````text
   - **The dedupe** runs once per start, after the walk has taken its records and while it still holds each one's lock (Amendment 4 item 4):
     1. The folder names under the root are read again. The names read before the locks are not used for it (C-8 (3)).
     2. For each `<hex>` folder that holds a `locations.json`, at most `MAX_DEDUPE_RECORDS` of them: `metadata` of that file. Its length is compared with each taken record's `locations.json` length. On an equal length it is read, bounded to that length + 1, and compared byte for byte. A `<hex>` folder whose bytes equal a taken record's is a candidate for that record alone.
     3. For each candidate, its history is locked with `try_lock`. Once it is locked, its header and first step line are read through that handle, bounded to `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes, and the lock is released. The taken record is a twin, and is not listed, when that first step's id is its own first kept step id, or when neither holds a step. On `WouldBlock`, any other failure, or a header the reader refuses, the taken record is withheld.
     4. The dedupe is incomplete when a `<hex>` folder's `locations.json` gives a `metadata` failure other than `NotFound`, or when more `<hex>` folders hold one than the bound. Then every taken record that was locked is withheld.
     5. Every taken record's lock is then released. Only after that is `metadata` called on each listed record's data path.
     - `more` is `true` when an `unsaved-` folder is left unexamined at `MAX_RECOVERABLE_RECORDS`, or when a taken record is withheld.
````
````text
This reads only the header line and the first step line of each `<hex>` record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`, and of at most `MAX_DEDUPE_RECORDS` such records (§7, Amendment 2 item 4). A `<hex>` folder with no history, or an empty one, is not read and does not count. Past that bound the dedupe cannot be completed, and no `unsaved-` record is listed at that start. This fails closed, because ADR-036 Amendment 1 item 5 offers the project's record only.
````
````text
The dedupe is Amendment 4 item 4's. It fails closed for one taken record whose candidate it cannot read, and for every taken record only when it cannot be completed, because ADR-036 Amendment 1 item 5 offers the project's record only.
````
````text
`more` is `true` when an `unsaved-` folder is left unexamined at the bound, or is not listed because the dedupe could not be completed.
````
````text
`more` is `true` when an `unsaved-` folder is left unexamined at the bound, or when a taken record is withheld (Amendment 4 item 4).
````
````text
  - a `<hex>` record whose dedupe read is refused by a lock makes the `unsaved-` record be skipped at that start;
````
````text
  - a `<hex>` record whose `locations.json` bytes equal an `unsaved-` record's, and whose history a lock refuses, makes that `unsaved-` record alone be withheld at that start (Amendment 4 item 4);
````
   - **Point (1): a held record for an unrelated project suppresses nothing.**
     - Only a `<hex>` folder whose `locations.json` equals the taken record's byte for byte is a candidate, and it can withhold that record only.
     - A `<hex>` record made for an unrelated project names its own dataset identity (`State::open` mints one, :176-184), so its bytes differ. Its lock is never probed.
     - Two cases can give equal bytes without a twin:
       - an open reopened from a project whose record another run left. It takes the project file's identity (`reopened()`, :397) and, unbound, makes an `unsaved-` record of its own (Amendment 2 C-1);
       - a project made by the reopen's answer `copy`, which keeps the dataset entry (`kernel/src/project/mod.rs:759-766`).
     - The first-step test separates both, and a held candidate withholds only that one record.
   - **Point (2): the reads are bounded.** Per start:
     - two reads of the folder names;
     - at most 64 histories, each at most `MAX_SESSION_HISTORY_BYTES` + 1 bytes, and their `locations.json`, each at most `LOCATIONS_LIMITS.max_bytes` + 1;
     - at most `MAX_DEDUPE_RECORDS` `metadata` calls on `<hex>` `locations.json` files;
     - a byte read only on an equal length, each at most the matching taken record's length + 1;
     - per candidate, one lock probe and at most `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes.
     The worst case is large, but every read is in the machine's own store. A `locations.json` the store's writer writes holds one entry with strings of at most 4,096 bytes (`kernel/src/project/store.rs:462-478`). What the start still cannot offer is stated in item 76 and in §2.9 (both below).
   - **Point (3): the reads come after the lock, and that is binding.**
     - A save's move renames the project's history in (`kernel/src/session_history.rs:562`) before it drops the `unsaved-` handle (:374). The walk holds each taken record's lock from before the dedupe's own read of the names until the dedupe ends.
     - So a move that freed a lock the walk then took has already renamed its history in, and the dedupe finds it, renamed and locked. No move of a taken record can begin while the walk holds its lock.
     - A set of `<hex>` names read before the locks is never used.
   - **Point (4): departures.** The departure from ADR-036 §9 that remains goes to the advisor (item 12 (b)).
   - **§2.9's guarantee line:**
````text
ADR-036 §9: offered at next start;
````
````text
ADR-036 §9: offered at next start, but not the sessions a start withholds or finds to be twins (Amendment 4 item 4; item 76), a departure sent to the advisor; a project's record with nothing after its last save is cleared at that project's open (Amendment 4 item 2);
````
   - **OPEN-4's stated reason** (Amendment 2 item 1, which the gate names as one of C-8's places):
````text
Under (B), each record can leave by the user's Discard, and nothing is removed unasked.
````
````text
Under (B), each record that is listed can leave by the user's Discard. Amendment 4 items 2 to 4 name what is removed unasked (a project's record with nothing after its last save, and the twins), the records a start does not list, and how each of them leaves.
````
   - **`recover_session` on an `unsaved-` record** runs the same dedupe for that record alone, after its own lock is taken and kept (item 5, step 3a).

5. **`recover_session` and `discard_recoverable`, in order** (items 3 and 4; item 7's N-16 words apply to every step here):
````text
     3. lock and read;
````
````text
     3. lock and read;
     3a. for an `unsaved-` record: Amendment 4 item 4's dedupe, for this record alone, with the names read after this lock. A twin refuses `…_unknown`. A candidate a lock refuses gives `…_locked`. Any other withheld case, or an incomplete dedupe, gives `…_unknown`;
````
````text
     5. `set_len` to the kept prefix, seek to its end, sync;
````
````text
     4a. for a project's record: its twins are removed (Amendment 4 item 3). This step refuses nothing;
     5. `set_len` to the kept prefix, seek to its end, sync;
````
````text
   - **`discard_recoverable`** refuses a record this run holds as `…_unknown`, and a `WouldBlock` as `…_locked`.
````
````text
   - **`discard_recoverable`** refuses a record this run holds as `…_unknown`, and a `WouldBlock` as `…_locked`. In order: 1. validate the name; 2. refuse a record this run holds; 3. lock and read, and re-check the listing conditions; 3a. for a project's record, remove its twins (Amendment 4 item 3); 4. remove `history.jsonl` and `locations.json` under the lock (H2), drop the handle, remove the folder. An `unsaved-` record gets no twin search, because removing it is what the move would have done.
````

6. **E-3 and E-4** (the gate's texts):
````text
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` | `reopened_as` not compared | K-C20 |
````
````text
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` (the other project is a copy of the record's project, made by the reopen's answer `copy`, so its dataset URI is the header's and only `reopened_as` differs) | `reopened_as` not compared | K-C20 |
````
````text
and the open must have no step, no record and no binding.
````
````text
and the open must hold no record (a first step makes one, so this one check also refuses an open with a step) and no binding.
````
````text
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | step check skipped | K-C12 |
````
````text
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | the check that the open holds no record removed | K-C12 |
````
   - The gate's grounds were checked against the code. A step creates the open's record (`kernel/src/session_history.rs:316-321`). A copy keeps the dataset entry (`kernel/src/project/mod.rs:759-766`).

7. **N-14 to N-18.** These are the gate's words. Each Old text was checked against the form first. N-18 has one change, named after it.
   - **N-14:**
````text
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` | the entry kept after Recover | S-7 |
````
````text
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` (`RecoveryOffer.test.tsx`) | the entry kept after Recover | S-7 |
````
````text
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` | Recover shown for `cannot-be-offered` | S-8 |
````
````text
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` (`RecoveryOffer.test.tsx`) | Recover shown for `cannot-be-offered` | S-8 |
````
   - **N-15:**
````text
The form below is sound under them.
````
````text
The form below is sound under them. The accounts below of the other options are not complete (under OPEN-4 (A), K-C24's mutation passes on every system, not only on Windows), so a ruling of another option returns the form to its drafter and to this gate before any code.
````
   - **N-16:**
````text
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte.
````
````text
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte. The header's one-dataset check (C-2) is made at step 3, so no refusal follows step 5.
     - The recorder's state lock is taken only to read or change `state`, at steps 2 and 6, and never across a lock probe, a file read, `metadata` or the data's open; the listing takes it the same way. Step 2 reserves the record name until step 6 or the refusal, so a second `recover_session` of it in this run meets the held check and refuses `…_unknown` (N-11).
````
````text
and it calls `metadata` once on each listed record's data path.
````
````text
and it calls `metadata` once on each listed record's data path, holding no history lock and not the recorder's state lock; on a path the operating system cannot reach at once, such as an unreachable network share, that call waits as long as the operating system makes it, and only the list's reply waits with it.
````
   - **The bounds named in the same bullet:**
````text
within §7's and Amendment 2 item 4's bounds
````
````text
within §7's, Amendment 2 item 4's and Amendment 4 item 4's bounds
````
   - **N-17:**
````text
| K-C17 | `the_listing_reads_no_byte_of_the_data_file` (data replaced by a 0-byte file: `found`) |
````
````text
| K-C17 | `the_listing_states_found_from_metadata_alone` (data replaced by a 0-byte file: `found`; §8 item 10 holds the rest by review) |
````
   - **N-18.** These are the gate's words with one change. The gate's "That window is one listing read" becomes "That window is one start's listing", because item 4 keeps each taken record's lock until the dedupe ends. Item 4 also finds a save's moved record, so a session in that gap is withheld rather than listed; the gate's words for that gap still name its effect on Windows.
````text
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one listing read, inside one request round trip, and it does not block.
````
````text
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one start's listing (Amendment 4 item 4 keeps each taken record's lock until its dedupe ends), inside one request round trip, and it does not block. Named too: `end_session` (`kernel/src/session_history.rs:443-446`) and a save's move (:374-378) drop a history's lock before removing its files, so a listing in another instance in that gap can list a session that is then gone, and its Recover or Discard is refused; on Windows its folder can stay empty, unlisted and unremoved. Each gap is one removal, inside one request round trip, and does not block. For a save's move, Amendment 4 item 4 finds the moved record, so that session is withheld, not listed.
````
   - **The `restored` mark** (the gate's attempt-2 recommendation under "The drafter's unsettled points", adopted; item 2 needs a rule for it):
````text
  - a `restored` mark, which no product code writes today, is named as not read by the last-value computation.
````
````text
  - a record whose kept lines hold a `restored` mark, which no product code writes today, is `cannot-be-offered` (`later-version`), at a start and at an open, and is never cleared: a `restored` mark moves the chain's parent (`kernel/src/session_history.rs:1345-1353`), which the last-value computation does not follow, so offering such a record would restore wrong values silently.
````

8. **Tests.**
   - **Rows changed:**
````text
| K-C9 | `a_project_record_with_nothing_after_its_saved_mark_is_not_offered` | mark not considered | K-C9 |
````
````text
| K-C9 | `a_project_record_with_nothing_after_its_saved_mark_is_cleared_at_its_open_with_no_offer` (the record another recorder left, dropped without `end_session`: a header, a step, a `saved-here` mark after it, and a torn last line; after `list_recoverable(handle)` lists nothing, the folder is gone, and the open's first step and save write the mark) | the record left in place (OPEN-2 (A) as filed) | K-C9 |
````
````text
| K-C23 | `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set` (257 `<hex>` histories) | the dedupe bound not applied | K-C23 |
````
````text
| K-C23 | `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set` (257 `<hex>` folders, each holding a `locations.json` that names another dataset and no history) | the dedupe bound not applied | K-C23 |
````
   - **Rows added at the end of §4's table.** The file is `kernel/tests/recovery.rs` unless a row names another. "The test holds" means a `File` the test opens and locks itself.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C25 | `a_project_record_another_run_holds_for_other_data_withholds_no_unsaved_offer` (a `<hex>` history the test holds, whose `locations.json` names another dataset; a crash-left `unsaved-` record: listed) | every held `<hex>` history withholds every taken record (Amendment 2's rule restored) | K-C25 |
| K-C26 | `an_unsaved_record_whose_twin_a_live_run_holds_is_withheld_alone_and_more_is_set` (U1's twin `<hex>` history, the test holds; U2 unrelated: U2 listed, U1 not, `more` true) | a candidate a lock refuses read as not a twin | K-C26 |
| K-C27 | `the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names` (unit test in `kernel/src/recovery.rs`; the start walk's private parameter, called after the locks and before the dedupe's names read, which the product passes as a no-op, makes U's twin folder there, its history held by the test: U not listed) | the dedupe's `<hex>` names taken from the walk's first read | K-C27 |
| K-C28 | `a_project_record_a_live_run_holds_is_neither_cleared_nor_offered_at_its_open` (the record has nothing after its mark, and the test holds it; after the call, the test drops its handle and reads both files by path, byte for byte) | `WouldBlock` taken as clearable | K-C28 |
| K-C29 | `a_project_record_with_a_step_after_its_last_mark_is_offered_not_cleared` (a header, s1, a mark after s1, s2) | any `saved-here` mark makes the record clearable | K-C29 |
| K-C30 | `a_project_record_damaged_before_its_end_is_not_cleared_and_is_listed_with_discard_only` (a header, s1, a mark, a refused line with an LF, s2) | a failing line not considered by the clear | K-C30 |
| K-C31 | `discarding_a_projects_record_removes_its_unsaved_twin` | the twin search not called from `discard_recoverable` | K-C31 |
| K-C32 | `recovering_a_projects_record_removes_its_unsaved_twin` | the twin search not called from `recover_session` | K-C32 |
| K-C33 | `clearing_a_projects_record_at_its_open_removes_its_unsaved_twin` | the twin search not called from the clear | K-C33 |
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | `WouldBlock` taken as removable | K-C34 |
| K-C35 | `an_unsaved_record_with_a_step_the_projects_record_does_not_hold_is_not_removed_with_it` (U: s1, s2; R: s1, then a refused line; R discarded; U stays and is listed at the next start) | the twin judged by its first step alone | K-C35 |
| K-C36 | `a_record_holding_a_restored_mark_is_listed_with_discard_only` (a header, s1, s2, a `restored` mark to s1, s3) | `restored` marks not considered | K-C36 |
| K-C37 | `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked` (asserted on the reply) | step 3a skipped | K-C37 |

   - **Red before the fix.**
     - Each K-C row, the changed ones included, calls `list_recoverable`, `recover_session` or `discard_recoverable`, and none of them exists at the red commit.
     - K-C27 calls the start walk and its parameter, which do not exist then either.
     - S-1's change asserts the formatter's input. `RecoveryOffer` does not exist at the red commit.
   - **Known pass cases.** None is known for any mutation.
     - K-C28 and K-C34 drop the test's own handle before reading by path, so on Windows a removal the mutation made while that handle was open shows whichever delete semantics the system uses (H2). On macOS/Linux the file is unlinked.
     - K-C25, K-C26 and K-C37 rest on the probe meeting `WouldBlock` against the test's handle: on Windows through LockFileEx (H1), and on macOS/Linux through a second open file description (H3).
     - K-C37 asserts the reply, not the bytes, because under its mutation `set_len` to an untorn prefix would leave the bytes as they were.
   - **§5, added after "Predicted":** K-C28 and K-C34 fail under their mutations on Windows (H2) and on macOS/Linux (H3).
   - **§5, added after "Falsified if":** also falsified if any of these happens:
     - a record or a twin is removed while another run holds its lock;
     - a project's record holding a step after its last `saved-here` mark, or a line after a failing line, is cleared;
     - a start lists an `unsaved-` record while a `<hex>` history exists whose `locations.json` equals its own and whose first step is its first kept step.
   - **§8, added after item 12:**
     - 13\. a record or a twin removed after a lock probe gave `WouldBlock`, or with no probe;
     - 14\. the start's dedupe reading `<hex>` names read before the `unsaved-` locks;
     - 15\. a project's record cleared at an open when it holds a step after its last `saved-here` mark, a `restored` mark, or a line after a failing line.

9. **ADR-036 (ADV-2026-11-23-16 item 6): a note for the architect to check. Its words go to the advisor.**
   - **Item 2 needs words, on the drafter's reading.** ADR-036 §9 says a crash "leaves the history for the recovery offer" (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:209`), and item 2 clears such a history with no offer. A draft, to follow that sentence: "A project's record that another run left, that no running session holds, and that holds no step after its last `saved-here` mark is cleared when that project is next opened, with no offer: nothing in it is unsaved."
   - **Item 3 needs none, on the drafter's reading.** Amendment 1 item 5 already says that "the `unsaved-` record is then removed" (ADR-036:272), and item 3 finishes that move. If the architect reads it otherwise, a draft, to end Amendment 1 item 5: "When the project's record is recovered, declined, or cleared at the project's open, that `unsaved-` record is removed with it, unless a running session holds it."
   - If the advisor rules either note's words, §1's line "ADRs: none is amended" is superseded by the amendment that records them. This amendment does not edit it.

10. **Drafts for the advisor, and the operator Part.** None of these is the advisor's or the human's wording.
   - **Item 70:**
````text
**Draft:** "A project's session history that an earlier run left is offered back when the project is opened again only if it holds changes made after its last save; otherwise, or while the offer is unanswered, the later run's save shows the withheld mark until that folder is removed."
````
````text
**Draft:** "A project's session history that an earlier run left is offered back when the project is opened again if it holds changes made after its last save, and is cleared at that open, with no question, if it holds none. While that offer is unanswered, or while another window of the app holds that history, a save in the later run shows the withheld mark."
````
   - **Item 76** (C-4's bullet, then N-10's fourth bullet):
````text
At most 64 unsaved sessions are listed at a start; the others are listed at a later start, as listed ones are recovered or discarded.
````
````text
A start examines at most 64 unsaved sessions and lists those it can offer; the others are examined at a later start, as examined ones are recovered or discarded, or leave as the bullets below say.
````
````text
  - While another window of the app holds a saved project's unsaved changes, or while more than 256 saved projects' unsaved changes are kept on this computer, a start offers no session that never saved, and says that more are kept.
````
````text
  - A session whose changes were moved into a saved project's session history, as after a crash during a save, is not listed at a start. It is offered as that project's when the project is next opened, and it is removed when that project's history is recovered, discarded or cleared. Until then it takes one of the 64 places.
  - A session that never saved is not listed at a start, and the start says that more are kept, while another window of the app holds a saved project's session history made from the same data at the same place, while the app cannot read one of the saved projects' session histories that could hold it, or while more than 256 saved projects' session histories are kept on this computer. Each such session also takes one of the 64 places. A saved project's session history leaves when that project is next opened, as item 70 says.
  - When more than 256 sessions that never saved are kept, a saved project's session history that is recovered, discarded or cleared may leave behind the session it was moved from. That session is then listed at a later start, and holds only changes the project's history held.
````
   - **Strings.** No new string. R-S8 and R-S9 also cover `recover_session`'s new refusals at step 3a (item 5). Whether their words fit those cases is for P6.
   - **The operator Part** (ADV-2026-11-23-16 item 8):
````text
  - OP-R4: data moved, then not found, Discard only.
````
````text
  - OP-R4: data moved, then not found, Discard only.
  - OP-R5: save a project, make no change, crash; reopen it: no offer, and the next change and save show no withheld mark (Amendment 4 item 2).
  - OP6 (moved from the 1c form, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:778`, by ADV-2026-11-23-16 item 8): crash, then the recovery offer. It is run in this Part, and its log starts blank.
````
````text
OP-R1 to OP-R4 here; OP6's move is the custodian's to record
````
````text
OP-R1 to OP-R5 and OP6 here (ADV-2026-11-23-16 item 8); the custodian records the move by an amendment to the 1c form
````
   - **§2.12, rows added after D16:**
     - | D17 | rule | (none) | the start's dedupe: `locations.json` bytes, then the first step; the project side read after and under the taken records' locks; withheld per record | C-8; Amendment 4 item 4 |
     - | D18 | rule | OPEN-2 (A) | a project's record with nothing after its last mark is cleared at its open | ADV-2026-11-23-16 item 4; Amendment 4 item 2 |
     - | D19 | rule | (none) | the `unsaved-` twin removed with its project's record | ADV-2026-11-23-16 item 5; Amendment 4 item 3 |
     - | D20 | rule | (none) | a `restored` mark makes a record `later-version` | the gate's attempt-2 recommendation |
     - | D21 | operator | (none) | OP-R5, and OP6 moved here | ADV-2026-11-23-16 items 4 and 8 |

11. **Scope and budget.** These are class-9 scope additions, recorded before any code. No §7 line is edited, no file is added, and the ≤ 50 files hold (47).
   - **`MAX_DEDUPE_RECORDS` keeps 256.** What it bounds changes:
````text
It bounds the `<hex>` histories a start's dedupe reads, each to its header and first step line.
````
````text
It bounds, in each act, the folders of the other shape whose `locations.json` is examined: the `<hex>` folders that a start's dedupe, or `recover_session`'s step 3a, examines, and the `unsaved-` folders that a twin search examines (Amendment 4 items 3 and 4).
````
   - **Lines by file:**
     - `kernel/src/recovery.rs`: about +270, with K-C27;
     - `kernel/src/session_history.rs`: about +20 (a bounded read of the first two lines);
     - `kernel/tests/recovery.rs`: about +520;
     - `kernel/tests/recovery_crash.rs`: about +80;
     - `protocol/skp/SKP-V0.md`: about +20 (§13 and §15's words, item 2);
     - `KNOWN-LIMITATIONS.md`: about +12;
     - `frontends/shell/MANUAL-WALKTHROUGH.md`: about +8 (OP-R5 and OP6).
   - **The 4,330-line ceiling does not hold.** It is now ≤ 5,260:
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 330 |
````
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 350 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/project/store.rs` (the bound, N-13) | 780 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/project/store.rs` (the bound, N-13) | 1,070 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 1,200 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 1,800 |
````
````text
(one new Part) | 140 |
````
````text
(one new Part) | 160 |
````
````text
**≤ 4,330, ≤ 50 files**
````
````text
**≤ 5,260, ≤ 50 files**
````
````text
§2.11 as Amendment 2 revises it; ≤ 4,330, ≤ 50 files
````
````text
§2.11 as Amendments 2 and 4 revise it; ≤ 5,260, ≤ 50 files
````

12. **Questions for the advisor.** None is ruled here.
   - (a) **Item 2's case.** The opened project file can be an older one than the file the last mark followed. Is that case material? If it is, item 2's fallback applies.
   - (b) **The departure from ADR-036 §9 that remains** (C-8 (4)). §9 says "recovery is offered when the application next starts" (ADR-036:206). A start does not offer the sessions item 4 withholds, and twins are offered at their project's open instead (Amendment 1 item 5). The gate says a qualifier to §9 would be the human's.
   - (c) **Item 9's notes.** Their words, and whether either is needed.
   - (d) **The ceiling.** It moves from the accepted 4,330 to 5,260 (item 11). Is that accepted, or should the piece be split (ADV-2026-11-23-16 item 11)?
   - (e) **A twin left by a failed removal in a save that then ended normally.** The removal errors at `kernel/src/session_history.rs:376-377` are ignored. The run's normal end then clears the project's record and not the twin (:437-448), so a later start lists the twin as a session that never saved. Item 5 of the ruling does not name that act. Whether `end_session` should remove such a twin touches its rule "and nothing else" (:437-438).
   - (f) **The P6 drafts:** item 70 and item 76 (item 10), and R-S8 and R-S9 for step 3a's refusals.

13. **Superseded by this amendment, by section:**
   - §2.3, as Amendment 2 revises it: the start, the dedupe, the open, the listing's removals, `recover_session`, `discard_recoverable`, and the N-13 bullets;
   - §2.4 (an addition);
   - §2.9 (the ADR-036 §9 line);
   - §2.10 (items 70 and 76);
   - §2.11;
   - §2.12 (D7, D13; D17 to D21 added);
   - §4 (K-C9, K-C12, K-C17, K-C20, K-C23, S-1, S-7, S-8; K-C25 to K-C37 added);
   - §5;
   - §7 as Amendment 2 adds to it (what `MAX_DEDUPE_RECORDS` bounds);
   - §8 (items 13 to 15 added);
   - §9 (the operator Part);
   - OPEN-2, OPEN-4's reason, and Amendment 2 items 1 and 4.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**What I could not settle:**
- **Line cites.** Each cite was read at caea224a in the read worktree, but I have no hashing tool, so the custodian adds the span hashes.
- **The ceiling.** I kept `MAX_DEDUPE_RECORDS` at 256 and moved the ceiling to 5,260 (item 11). Both are drafts, and the ceiling goes to the advisor (question (d)).
- **The Windows checks in K-C28 and K-C34.** They drop the test's own handle before reading by path. That rests on H2, std's share-delete opening on Windows, and not on any one delete semantics. It still needs a run on Windows CI.
- **The `restored` mark.** I adopted the gate's attempt-2 recommendation (`later-version`) because item 2 needs a rule for it. The gate placed that point with the code's gates and the advisor, so this adoption is for them to check.
- **The K-C27 seam.** It is a private parameter of the start walk, and the product passes a no-op. The architect checks it under the caller rule.

**Drafts for the advisor:**
- the case in item 2 where clearing loses something, and its fallback (question (a));
- the departure from ADR-036 §9:206 that remains (question (b));
- the two ADR-036 notes in item 9 (question (c));
- the ceiling of 5,260 lines and whether to split (question (d));
- the twin a normal end leaves after a failed removal at :376-377 (question (e));
- item 70's new draft, item 76's two revised bullets and its new third bullet (item 10);
- R-S8 and R-S9 as they apply to step 3a's refusals.

Report path (the custodian files it): state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-4-lead-data-draft.md
sha256: not computed; I have no hashing tool. The custodian hashes this message's bytes at filing.

Opus 5.5 (claude-opus-5-5)
