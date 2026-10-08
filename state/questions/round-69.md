Question round 69 — 2026-10-07 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round item 1 — b2-piece-1a, OPEN-1 (form kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md, §2.9): the step record's fields and file format, as the form's ADR-036 §1 to §10 propose them. ADR-036 is filed as Proposed; accepting it stays your typed decision, before 1c merges. (A) As drafted: a project is a folder holding project.spatial.json and .spatial/lineage.jsonl, written as canonical JSON with steps as JSON Lines. Each step carries id, parent, at (UTC, whole seconds), kind, effect class, actor (a user is never named), intent, dependencies, data (through the lasting reference), scope and links. (B) As (A) without the `at` member: a shared lineage shows no working times, and the Exports view loses its time. (C) A project as one file plus a hidden folder beside it: two projects in one folder would then share .spatial/. The architect recommends (A). Not a red line now. Waiting on it: ADR-036's text as filed in 1a's PR, and 1b's code.
  (1) (A) As drafted (Recommended) — ADR-036 is filed (Proposed) with the folder layout, the encoding and the step fields as drafted.
  (2) (B) No step time — As (A), without the at member on each step.
  (3) (C) File plus hidden folder — A project is one file with a hidden folder beside it, instead of a folder.
  (4) Hold — ADR-036 is filed with OPEN-1 as an open block; 1b waits.

---

2. Round item 2 — b2-piece-1a, OPEN-4: a linked file's source revision. The brief's §8 says the change-detection observation (size, modified time, footer length, footer hash) is a linked file's source revision. The architect departs from that sentence. The engine's descriptor text says the observation is neither a content hash nor a source revision. The pin's text says the engine has nothing to put in source_revision. A reader that sees a revision could grade the project Revision-pinned, which principle 3 forbids claiming. (A) As the brief says: the observation is the source_revision value. (B) The six ResourceRef members stay as the bundle writes them, with source_revision as the named state none-pinned, and the observation is recorded beside them. The architect recommends (B). Not a red line: it is ADR text, accepted with the ADR. 1a's code waits on this item.
  (1) (B) Beside the six (Recommended) — source_revision stays none-pinned; the observation is a separate observed member.
  (2) (A) As the brief says — The observation is written as the source_revision value.
  (3) Hold — Keep OPEN-4 open; 1a's code does not start.

---

3. Round item 3 — b2-piece-1a, OPEN-6: round 8's pre-commitment. 1a lands the lasting dataset reference with no product caller yet. Its consumers are named, and each is gated by its own full form: b2-piece-1b-recording and b2-piece-1c-save-and-reopen. Your evening ruling ran stage 1 as 1a, 1b and 1c. (A) Confirm the pre-commitment. (B) Require a product caller in 1a. That needs a wire or shell surface, so the scope grows. (C) Hold 1a's code until 1b. The architect recommends (A). Not a red line. All of 1a's code waits on this item.
  (1) (A) Confirm (Recommended) — 1a's producer lands for its two named consumers, 1b and 1c.
  (2) (B) Require a caller — 1a gains a product caller, which needs a wire or shell surface.
  (3) (C) Hold code until 1b — 1a's code waits and lands with 1b.

---

4. Round item 4 — b2-piece-1a, OPEN-8: persisted feature ids, for a step whose scope is a selection. ADR-016's open item says no identity may be persisted until its stability across a reopen is settled. (A) ADR-036 reserves the selection scope, and no step writes a feature id until an ADR-016 amendment is accepted. The first piece that would record one drafts that amendment. In B2, export uses the filter and never the selection, so no ruled step needs an id yet. (B) 1a drafts that ADR-016 amendment now. That is a red line (an ADR amendment), so type it via Other if you want it. (C) Record the ids now, pinned to the observation. That breaks ADR-016's condition. The architect recommends (A). Not a red line under (A).
  (1) (A) Reserve it (Recommended) — The selection scope is reserved; no feature id is written until ADR-016 is amended.
  (2) Hold — Keep OPEN-8 open; it holds no 1a code.
