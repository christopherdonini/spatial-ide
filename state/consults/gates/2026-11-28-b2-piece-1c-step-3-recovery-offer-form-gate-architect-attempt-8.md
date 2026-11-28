# The recovery offer's form gate, attempt 8, the architect (node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-8): PASS WITH NOTES

*Filed by the custodian. The architect (Opus) read D:/wt/read-1127c at 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6 and the branch checkouts its report names, read only, and wrote no file. By the facts script its records run from 2026-11-27T23:28:53Z to 2026-11-27T23:43:31Z; by its completion notice it took 877186 ms and 88 tool uses. Its hand-back is below as received, with the harness indent removed: 18375 bytes, sha256 ba09be4e7969ab6e8356d65bce55c379d4e60cc6ad65f8fdf081be3a7ffcf3cf. The date in this path, 2026-11-28, is the one its brief named, typed from the local date; by date -u the gate ran on 2026-11-27. Its N-48 and N-49 went to the advisor, who answered them in ADV-2026-11-27-46 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-46-a-discard-leaves-one-session-log-line-written-by-the-binding-a-refused-recover-or-discard-leaves-a-line-amendment-1-stands-for-now.md`).*

---

Verdict: PASS WITH NOTES
Reviewed: D:/wt/read-1127c @ 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6

The architect's form gate, attempt 8 (node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-8). This gate reads Amendment 17 once and whole, with Amendments 16 and 18 beside it. Checkouts: [G] D:/wt/read-1127c, [B] D:/wt/recov (the branch ref reads f533fadc46728648c028dfafa318a1aece322c1b; I read its working tree), [R] D:/wt/reload @ 5ce0525a, [C1] D:/wt/c1rd @ f7770e1a. Rulings are cited by id and item. Text not marked verbatim is paraphrase.

Tools and limits. I had Read, Grep and Glob only. I had no shell, no git and no hashing tool. So I ran no build and recomputed none of Amendment 18's 45 span hashes. A reader with a hashing tool owes that check before the merge (N-47).

Verdicts under AUTONOMY §22:
- **Correctness: pass.**
- **Evidence: pass** for the text under gate. N-42 is an Evidence fact about the base, not about Amendment 17. It must be fixed before Part 1's first red run.
- **Documentation:** N-43 to N-47 must be fixed before the merge. N-48 and N-49 go to the advisor.

## 1. Does Amendment 17 do what ADV-2026-11-27-37 item 2 and ADV-2026-11-27-38 items 2 and 3 ask, and nothing more?

Yes. I checked each seam against the interface the other side actually has.

**The null arm's open is counted among the page's opens.**
- **The gate.** `recover_on_page` awaits `Pages::admit(&request.cancel_key)` before any kernel call. The real signature matches the form: [R] page.rs:229 returns `Result<Ticket, SkpError>`.
- **The settle.** It calls `settle(ticket, name, &host, projects)`. The real signature is at [R] page.rs:303-309, with `Option<&str>` and `Option<Arc<Projects>>`. The name comes only from an `Ok` reply that has `opened`.
- **The cancel key.** `run_end` cancels the in-flight keys of the ended page ([R] page.rs:477-496). The kernel registers the key at step 4's `begin_open` ([C1] skp.rs:1118-1135). Item 9 (a) names the window before step 4, and T-2 asserts it.
- **The late close.** When the page has ended and a name came back, the binding closes it ([R] page.rs:320-355).
- **T-2 to T-4** use the rig as it is ([B] page.rs:547-893, `Mode::Block` at :628-632). Each mutation fails the rows it names:
  - T-3's empty key makes `run_end` cancel `""`, which is not counted as `requested`. The recover then completes, and T-3 fails.
  - T-4's bypass makes page 2's `admit` ready at once (T-4 fails). It also leaves no in-flight key for the end to cancel (T-3 fails).
- **E-RECOVER gains no step,** with reasons. A search of [R] frontends/shell/e2e for `page-end` or `opens_closed` finds no file.

**The kernel's close on a later refusal.**
- It is worded in the form's own steps ([G] form :627-634, as :1079-1098 revises them), with one exit and its order.
- The record's state is given for every refusal:
  - step 4's catalog miss: byte for byte;
  - step 5 when `set_len` refused: byte for byte;
  - step 5 when `set_len` succeeded: cut to the kept prefix, and a later listing reads the same steps;
  - step 6 cannot refuse (N-16, [G] :1148).
- The pattern is the real one: [C1] project/mod.rs:839-843, :864-872 and :949-964.
- The calls exist with the visibility the amendment needs, in the same crate: `begin_open` and `open_under` are `pub(crate)` ([C1] skp.rs:1118, :1139), and `close_dataset` is `pub` (:1625).

**One test for each step that can refuse after the open.** K-C42 covers step 5. Its mutation removes the close from the shared exit, and it is red because the body does not exist at the base. Step 4's miss: see question (ii) below.

**`kernel/src/project/mod.rs` is left untouched.** Amendment 17 items 1 and 5 and I11 say so, and the close needs nothing from that file.

**Figures, against ADV-2026-11-27-38 item 2.**
- Part 1 at place (a) is 5,025 lines, under 4,990 + 90 = 5,080.
- The whole is 5,885, under 6,000.
- Part 1 has 47 files, and the union has 50, at the limit.
- §7 is not edited. The overrun is re-declared under class 9, not class 8, as the ruling says.

**Nothing more.** The handle arm, `list_recoverable` and `discard_recoverable` are untouched. No command, member or capability is added. T-5 was not drafted, and the gate does not ask for it: §8 item 16 covers a `Pages` call in the handle arm on sight.

## 2. Item 10's four questions

**(i) Where the binding's tests live: place (a), `page.rs`'s `mod tests`.**
- T-2 asserts that the current page's set is empty. That set is `State.names`, and `State` and its `lock()` are private to `page.rs` ([R] page.rs:64-68, :200-202). Only `page.rs`'s own tests can read them.
- From `commands.rs` that assertion would need a new item in `page.rs`, which I10 makes a stop, or a stand-in reading.
- Place (a) is inside the ruled figure. Nothing goes to the advisor.

**(ii) Step 4's catalog miss, with no test row: yes, this meets ADV-2026-11-27-38 item 3.**
- The handle is minted inside `open_under` ([C1] skp.rs:1144), and no client holds it before the reply.
- The catalog's `remove` is `pub` ([B] kernel/src/lib.rs:272-274). Its only callers outside tests are the two refusals inside `open_under` ([B] skp.rs:1260, :1336). The only other removal is `close_dataset` (:1671). Its one other caller is a test (:5310). `lock_write` is used nowhere else ([B] lib.rs:205, :234, :257, :273; skp.rs:1663).
- So a miss after admission needs a close of a name that no client has. Ordinary use cannot reach that, and nothing is left open by then. A test would need a hook with no product caller, which the caller rule forbids.
- Condition: the miss arm's source comment gives this reason.

**(iii) K-C42's handle without write access: accepted.**
- The handle is a value of the body's real parameter type. No code path exists for the test.
- The K-C27 precedent is a unit test in `recovery.rs` of a private step. The later form of K-C27 has no test parameter ([G] :1738).
- Two conditions are in N-46: the body takes the handle by value, and its one product caller is named.

**(iv) The code for step 5's refusal: `skp.session_history_unwritable`, but not built by its existing constructor.**
- That constructor's message is record_step's. Its line reads, verbatim, byte-copied from [G] protocol/skp/src/v0/error.rs:129:
  `            format!("this step could not be written and flushed to the session history: {detail}"),`
- That would be an untrue engine fact for a cut, so it is a defect under the operator-visible-text rule. N-44 gives the gate's words for the build.

## 3. ADV-2026-11-27-38 item 1: the record a recover and a discard each leave

**What the base leaves, read at [B].**
- **The Console.** Every SKP call goes through `call`, the one capture site ([B] frontends/shell/src/skp/client.ts:50-72; enforced by console/soleCaptureSite.test.ts). It records one class-A entry: the request by reference and the outcome (ok, refused or threw). The Console is in memory and bounded, not a durable log ([B] console/recorder.ts:18-20).
- **`open_project`.**
  - Console: one entry, then one for `describe`.
  - Session log: on a refusal, one line written by the page, `reopen-refused`, with the code and message ([B] project/openProject.ts:82). On success, no line.
  - The host writes no line of its own ([B] src-tauri/src/commands.rs:237-269). A page end's line counts the name among `opens_closed` ([B] page.rs:508-513).
- **`save_project`.**
  - Console: one entry.
  - Session log: no line on success or on refusal ([B] commands.rs:212-225; App.tsx:919-923; project/saveProject.ts imports no logger, :19-22).
  - It does leave its own durable result: the project file.
- **`open_dataset`, for comparison.** Its refusal writes `admission-refused` ([B] admission/admitDataset.ts:77).

**What the piece adds, in the form's words.**
- Three wrappers in `skp/client.ts` and three class-A rows ([G] form :149-150). So each recover and each discard leaves one Console entry.
- The form names no session-log line for either (a search of the form finds none). It does not say that Recover's `admit` through `runAdmitPath` logs a refusal line.
- With Amendment 17, a recovered name joins the page's opens, so it is counted in the page-end line.
- A recover leaves its record cut and adopted, and the record continues.
- A discard removes `history.jsonl`, `locations.json` and the folder ([G] :91, :1098). Nothing durable is left of it.

**Plainly: yes, a discard leaves less than those do.**
- It leaves less than `open_project`: on a refusal, `open_project` writes a session-log line and a discard writes none.
- It leaves the same as `save_project` in the session log (nothing) and in the Console (one in-memory entry). But a save leaves its project file, and a discard leaves no durable trace of itself.
- A recover's refusal also leaves no line, where the refusals of `open_dataset` and `open_project` do.
- The form names no ADR-006 class for a discard. On ADR-006's table ([G] docs/adr/ADR-006-lineage-undo-side-effects.md:17) and docs/01's derived rule "Auditable beyond revertible" ([G] docs/01_Principles.md:25), an irreversible removal of files is closest to the external-side-effect row, and that row's machinery is an audit log.
- By ADV-2026-11-27-38 item 1, this goes to the advisor before Part 1's code (N-48).

## 4. The named posture check, for both gates of each part

In so many words: the piece, with Amendment 17, changes **no network access, no listening socket, nothing in how the data plane admits a consumer, no file under `capabilities/`, and no dependency.** Each rests on:
- **Network and sockets:** Amendment 17 items 1 and 9 (e).
- **The data plane:** §2.11's file list has nothing under protocol/data-plane ([G] :209-218). The null arm opens by the same route as `open_dataset` ([C1] skp.rs:1108-1112, :1139).
- **`capabilities/`:** item 1 leaves it untouched, and [B] capabilities/default.json:1-11 is unchanged.
- **Dependencies:** only existing tokio features are used ([R] Cargo.toml:63, :97). I6, I10 and §8 item 6 ([G] :334) stand.
- **Amendment 17 itself** only narrows something: it closes an open that no page could reach.

Whether the three new commands that the page can call are a change of posture is with the human. The draft ADV-2026-11-27-39 is not in force, and the piece does not merge before the human's word (ADV-2026-11-27-38 item 1).

## 5. Item 8's list of stale places

**The list is not whole.** Missing places:
- Amendment 10 item 6: the third sub-bullet of its Counting bullet, and its "What the split costs" bullet ([G] :2190, :2196). Both still count the whole against 5,530.
- Amendment 10 item 2's list of kernel seams and items ([G] :2040-2049). It does not have the new private body or its caller.

**Whether each place must be fixed before the merge.**
- Every place item 8 lists is overridden by the Amendment 17 item it names, under "Read the last amendment first". The form is append-only, so none of them needs an edit or further words.
- The two missing groups need words, given in N-45:
  - :2190 and :2196 before the merge check, because that check reads the figure;
  - :2040-2049 before Part 1's gates, because the caller rule reads that list.

## 6. Findings (N-42 onward; the form's highest is N-41)

**N-42 (Evidence; the base's, not Amendment 17's).**
- At the base, two struct literals in `page.rs`'s tests lack `set_aside_file_id` ([B] page.rs:790-797, :815-823). The base's protocol requires that member ([B] protocol/skp/src/v0/commands.rs:48, :824). B's protocol is at `skp/0.14` and has no such member ([R] protocol/skp/src/v0/mod.rs:136).
- By reading, with no build run, the src-tauri test build fails at f533fadc with E0063 twice. So the merge needed a resolution in `page.rs`, though its combined diff was empty. The note "nothing was resolved and no narrow read is due" ([G] state/CUT-STATE.md:1743) is true of the text merge only.
- Fix, to the custodian before Part 1's first red run (ADV-2026-11-27-37 item 1): add `set_aside_file_id: false` to both literals, with the reviewer's narrow read. Amendment 17 item 3's `Rig` field then stays the piece's only edit of a test helper.

**N-43 (Documentation, class 3; lead-data's words, not the human's).**
- Amendment 17 item 1's bullet under "Not touched" says "every shell file;", which contradicts items 2 and 3.
- Words, applied with no re-gate: "every shell file but those Part 1 already touches and `frontends/shell/src-tauri/src/page.rs` (items 2 and 3);"
- Clause check:
  - item 2 edits `commands.rs` and `lib.rs`, which are already in Part 1 ([G] :214), and `page.rs`;
  - item 3 edits `page.rs`'s tests;
  - nothing under `frontends/shell/src/` changes (item 3 and item 9 (e)).

**N-44 (the gate's answer to item 10 (iv); lead-data's words, not the human's).**
- These words replace the first bullet under item 5's "Step 5":
  "Any failure refuses with the code `skp.session_history_unwritable`, the code §2.4 reuses, and a `detail` naming the call that failed (`set_len`, `seek` or `sync_all`). It is built in `recovery.rs` by `SkpError::protocol_with_fields`, as `kernel/src/skp.rs:1123 @ 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6` builds a protocol error inline, and not by `SkpError::session_history_unwritable` (`protocol/skp/src/v0/error.rs:126-132 @ 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6`), whose message says a step could not be written. Its message says that the session history could not be cut to its kept steps, under the P6 placeholder mark. It counts in item 6's kernel product figure."
- The custodian adds each span's sha256 by script at filing.
- Clause check, at [G]:
  - `protocol_with_fields` is `pub` (error.rs:35-39);
  - the constructor's message is at :126-132;
  - skp.rs:1123 builds an error inline;
  - the code and field are unchanged on the wire;
  - the placeholder practice exists ([C1] skp.rs:1282).

**N-45 (Documentation, class 3; the gate's words for an appended row).**
Two places added to item 8, cited by section:
- "Amendment 10 item 6, its Counting bullet's third sub-bullet and its 'What the split costs' bullet: the whole's figure 5,530, which ADV-2026-11-27-38 item 2 replaces with 6,000; the merge check counts `B...H2` against at most 6,000 lines and at most 50 files (item 6)."
- "Amendment 10 item 2, Kernel seams and items: it gains item 5's guard and the private body that runs steps 4 to 6 for a null `dataset`, whose one product caller is `recover_session`'s null arm."

**N-46 (Documentation; lead-data's words, not the human's).**
- Add to item 5, after K-C42's row: "The private body's one product caller is `recover_session`'s null arm; K-C42 calls it directly. The body takes the history handle by value and drops it at the refusal exit (order step 2), so K-C42's lock through a new handle can succeed."
- Clause check: item 5's refusal-exit order and K-C42's last assertion.

**N-47 (Documentation, record).**
- Amendment 18 item 3 pins 45 spans by hash at 5ce0525a and f7770e1a, which are commits not on main (round 15 (e)).
- Among them are test-text spans on unmerged branches ([R] page.rs:547-893 and :701-702; [C1] project/mod.rs:1626), which round 25 item 2 (d) names.
- Under the record cap, the gate reduces the record as follows:
  - Amendment 17's bare [M] self-line cites are read as historical pins at 44e6b5be, which is on main, as Amendment 18 item 3 names them. The pin is authoritative.
  - The [R] and [C1] pins are read as words-form references at those commits until B and C1 merge.
- Must-fix before the merge: one appended row recording that 5ce0525a and f7770e1a are reachable from main (merge commits, not squash), or each span re-pinned at a main commit by script.
- This gate did not recompute any of the 45 hashes.

**N-48 (to the advisor, by ADV-2026-11-27-38 item 1).** A discard leaves less than `open_project` (section 3), and no ADR-006 class is named for it. This must be answered before Part 1's code. It is not a defect of the form.

**N-49 (to the advisor; ADR-037 Amendment 1).**
- Amendment 17 item 4 is right as far as it goes. Its `docs/README.md` precedent holds ([R] docs/README.md:73).
- But [R] docs/README.md:74 and ADR-037:3 both say whose words the ADR carries. Once Amendment 1 lands in words the advisor rules, both are incomplete. They are red-line text, so whether to edit them is the advisor's.
- My words for the architect's draft are for the advisor, not the build. None of them is the human's.
  - **(A1)** Add to the new §4 row: "A refusal after its open closes that open before it answers, and a refusal of the cut itself leaves the history byte for byte or cut to its kept lines, which a later listing reads as the same steps." Rests on Amendment 17 item 5.
  - **(A2)** Add to the same row: "A record whose recover is still in flight when the new page lists is not offered to that page either; if that recover is then cancelled or refused, a later listing offers it." Rests on [G] form :68 and :621, Amendment 17 item 5, and T-3.
  - **(A3)** A new item: "§2, 'What a page's end touches', its first sub-bullet, stays a pin at c28c8cf1. From the piece that lands this amendment, `recover_session` with a null `dataset` is a third route into `SkpHost::open_under`, and it too is reached only through a Tauri command, so the page's opens and the catalog's entries are still one set." Rests on [C1] skp.rs:1139 and Amendment 17 item 2.

Files read (all read only):
- D:/wt/read-1127c/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md
- D:/wt/read-1127c/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md
- D:/wt/read-1127c/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-38-the-recovery-offers-posture-answer-to-the-human-the-overrun-accepted-the-whole-at-most-6000-not-class-8-the-open-left-on-a-refusal-closed-by-the-kernel.md
- D:/wt/read-1127c/state/consults/2026-11-27-advisor-draft-adv-2026-11-27-39-for-the-humans-approval-the-recovery-offers-three-commands-the-page-can-call-not-the-humans-words.md
- D:/wt/read-1127c/state/drafts/2026-11-27-adr-037-amendment-1-the-recovery-offers-open-counted-and-the-posture-answer-architect-draft.md
- D:/wt/recov/frontends/shell/src-tauri/src/page.rs
- D:/wt/reload/frontends/shell/src-tauri/src/commands.rs
- D:/wt/c1rd/kernel/src/skp.rs
- D:/wt/c1rd/kernel/src/project/mod.rs
