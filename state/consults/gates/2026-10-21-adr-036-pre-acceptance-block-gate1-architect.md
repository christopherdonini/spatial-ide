Reviewed: PR #240 at 70edd381ac6a1bf62d57de49b39dfa1ad95bac05 (base 46158863), gate 1, architect — cut/adr-036-pre-acceptance-block @ 70edd381ac6a1bf62d57de49b39dfa1ad95bac05
Verdict: FAIL

One Correctness finding blocks. It is a guarantee claim in ADR text that the ruled design no longer supports, and the form's §2.4 says wrongly that no such passage is left.

## Correctness

**C-1 (blocks). A4's last clause still says that containment keeps a path inside the folder.**
- **Where:** `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:95` at the head. The span, byte-copied from my Read: `Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;`
- **What is wrong:** the human's sentence in B1 (head :104) makes containment a check made when the data is opened, with a later link or rename "not prevented, at the open or at any later read". So "containment, below, does [keep a path inside]" claims more than the check. It is the same claim that C1 removed from line 78 for the same reason (form §2.4, C1's rationale). The form's §2.4 ("No other passage of the block conflicts…") puts A4 among the text-only passages, but A4's last clause speaks of containment, not of text. Acceptance would make this binding, and after acceptance the file is changed only by appended amendment (the acceptance directive, line 8).
- **Fix:** a third change for the gate, "C3", inside A4's new line, with the rest of the line unchanged.
  - Old: the span above.
  - New: `Canonical form is checked on the text alone and does not by itself show that a path leads inside the project folder: containment, below, checks that when the data is opened;`
- **Clause check:**
  - "checked on the text alone" is unchanged, and head :103 says the same.
  - "does not by itself show that a path leads inside": canonical form refuses a leading `/` and `..` (:95), but a link below the folder can still lead outside. Only the resolver's walk refuses links (:104).
  - "containment … checks that when the data is opened" matches :104 ("checks before it opens it") and the human's "The check is made when the data is opened."
  - It claims nothing after the open, so it agrees with the human's sentence. It mirrors C1's "is checked to lead inside" (:102).
  - Code on main: no resolver exists, so an operator can observe nothing here.
- **Whose wording:** the architect's, not the human's. It is red-line ADR text, so the wording rule does not land it by itself, and §8 item 1 blocks any byte outside §2.1 to §2.4. The route is:
  1. An appended form amendment adds C3 to §2.4. Its first line says it was written after this gate's findings were seen. The custodian sets its class.
  2. The worker applies C3 by script and reruns V1.
  3. A narrow re-gate covers C3 and V1 only.
  4. The human sees the words at the click.
- §7 after the fix: 62 + 2 = 64, under the ceiling of 90.
- This interacts with the held order question on the acceptance message, which arrived before S1. Whether that acceptance covers C3 is the custodian's and the human's to settle.

## Evidence

None.

## Documentation (must fix before the merge; no re-gate)

**D-1. The form's A3 "Checked against" overstates the canonical subset.**
- **Where:** form §2.1, A3, first "Checked against" item ("the subset escapes every control character").
- **What is wrong:** `renderer/src/canonical.rs:28-30` (at main 46158863) escapes only code points below U+0020. U+007F to U+009F pass through unescaped.
- **Why it is not Correctness:** the conclusion still holds, because U+000A is among the escaped code points, so every line break in the file is a layout break. And no ADR sentence rests on the untrue part.
- **Fix:** an item in the closing amendment (S3), since the form is append-only. Words: "§2.1 A3's first Checked-against item overstates the subset: it escapes every code point below U+0020 (`renderer/src/canonical.rs:28-30` @ 46158863299b14f49e581de9e6662b3fe3b0afba sha256:<the custodian fills it by script>), not U+007F to U+009F. The conclusion stands, since U+000A is among those it escapes."
- **Clause check:** lines 28 to 30 escape U+0008, U+0009, U+000A, U+000C and U+000D as `\b \t \n \f \r`, write every other code point below U+0020 as `\u00xx`, and state "Nothing else is escaped". This is the form's text, not the human's.

## For the human (red-line text; no replacement words from me)

**H-1. §0.5, "items 19 to 28". It is a finding, but not a blocking one.**
- Items 20, 21 and 22 (partitioned source, publishing data in degrees, the sanity check) are inside the cited range and describe other limits (`KNOWN-LIMITATIONS.md` items 20 to 22).
- It is not Correctness. The sentence's claim, that a change the detector or the watch sees ends the session, is supported by item 19 ("a difference in any component present ends the session") and item 23 (on Windows the watch's report ends the session). Items 24 to 28 are its limits, and nothing in 20 to 22 contradicts it.
- It is not Evidence, and it is not a verbatim mismatch: head :104 matches the directive's line 10 passage byte for byte.
- In substance it is an over-broad reference. But it is the human's typed red-line text, so neither the worker nor the gate changes it. It goes to the human and does not fail the gate.

**H-2. A0 (head :6) has two points beyond the draft the human ruled on.** Neither blocks.
- **Last sentence:** it says "The last sentence of §5's containment rule … are the human's words", but the human's passage at head :104 is two sentences. The human's own ruling calls the two sentences "B1's last sentence", so A0 is true in the ruling's terms. If the human wants it exact, the words are "The last two sentences".
- **Unsighted additions:** A0 adds the cite to the block-rulings directive and an attribution sentence, and A6 rewrites the architect's own clause. These came after the draft the human ruled on (draft lines 28 and 148). The form discloses the A6 change in §2.3, and the architect's form report discloses both (its items 3 and 5), but they are outside §2.0(c)'s exceptions. The human should see them at the click.

## The form's §8, item by item

1. **A byte of ADR-036 outside §2.1 to §2.4:** none found, by Read. I compared every head line with main's file. Each "as it stands" passage and each anchor (lines 5, 27, 68 and 201) matches; each "New" passage matches the form. Diff sizes by my count are 44 insertions and 18 deletions, which agrees with the worker. I could not compare bytes (V1), which is the reviewer's.
2. **The human's two passages:** identical by Read at head :104 and :217, against the directive's lines 10 and 12.
3. **Status line:** head :3 is A1's new text, and it still says Proposed. No acceptance words were typed.
4. **`docs/README.md` by hand:** the head row 73 equals §2.5's inferred row. Whether the generator produced it is `verify:adr-index`, the reviewer's.
5. **Paths:** I could not run `git diff`. The worker's V3 and the custodian's filing note both say ADR-036 and `docs/README.md` only. No code, test, `scripts/` or `protocol/` change was seen.
6. **Quotes and cites:**
   - The only quoted text in the new ADR text is `"Plain text everywhere."`, which is identical to the bold text at `docs/01_Principles.md:24`.
   - The new ADR text has no ledger cite, no bare self-line and no pin.
7. **Round + item cites:** none in the ADR (grep for "round N" or "item N": no match). The form's round 25, item 2 resolves to the RULED 2026-09-26 block, question round 25, item 2, now in the rotated ledger.
8. **Round 25, item 2, by name:**
   - No overrun: 62 against a ceiling of 90. §7 is on main and not in this diff.
   - No scope addition.
   - No `verify-mutation` run is called an observation.
   - No test-text span.
   - Full form.

## What I checked, with its evidence

- **Refs:** the head is `70edd381…` (the branch ref, through the worktree's `.git` → `worktrees/a36/HEAD`). Main is `46158863…`. I read the tree at both. The pins @2879e17f are historical: for what I read, the tree is authoritative, and the "as it stands" text at main equals the pinned text.
- **Each change against its ruling:**
  - A0 and A1 follow route (i) line 10 and OPEN-S (a).
  - A2 follows ruling 2 and the `.spatial` check, which claims "common" only.
  - A3 follows OPEN-L (a). §3's "validated outside its params" keeps the opaque slot outside the new order rule, so that is no finding.
  - A4 follows ruling 9 and OPEN-R (a), apart from C-1.
  - A5 follows ruling 4 and OPEN-D (a).
  - A6 follows OPEN-W (a).
  - A7 follows milestone 4's OPEN-4 (A′).
  - B1 follows ruling 1, OPEN-4 (A) and OPEN-5 (B).
  - B2 follows ruling 8 and its restatement (2026-10-09 file, lines 22 and 38 to 40).
  - B4 follows 1c's OPEN-14 (A); B5 follows OPEN-15 (A).
  - C1 and C2 are consistent with the human's sentence.
- **No claim of code:**
  - §0.4 holds on main. `dataset_ref.rs:545` refuses only `\`, `:` and empty, `.` or `..` segments. `:358-373` writes the integers unchecked, while `:468-474` and `:582-584` refuse values above 2^53 − 1. `:484-498` matches B5.
  - The ADR says nothing about what the code does, apart from C-1.
- **A7's seam:**
  - `record_step` → `prepare` returns no referenced columns for `style.set` (`kernel/src/session_history.rs:348`). `dependencies_json` writes `{"name","type"}` from the file schema (`:416-425`), so "names the match column with its type" fits that function as written.
  - `REGISTRY` allows only COLOUR for `fillColor` (`:545-564`), and the wire is literal only (`protocol/skp/SKP-V0.md:1251`). Both are owed by `record-step-style-match-widening`.
  - Note for that piece: `admit_match_type` is private (`renderer/src/compiled.rs:231`) and is reached only through `compile`, which also refuses a column that is not published. The widening has to reach it on purpose.
  - §5a's shape and member order match `ADR-017-…:264-275`.
  - There is no code, no `pub` item and no callback, so the caller rule is not engaged.
- **Round + item:** as in §8 item 7.
- **Not run (no shell):** the three-dot diff, numstat, V1, the hash recomputations, `gh pr view 240` (the PR body, including B and H), the verify scripts and CI. These are the reviewer's.
