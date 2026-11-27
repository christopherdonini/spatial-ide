Reviewed: main at 0a2f0022f6247a8f0c00360a12eedca333b447f4, in the detached read worktree C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's form gate on node (d)'s full form, attempt 1, after node (g)'s (ADV-2026-11-22-35 item 8), node:opened-of-panic-sites-free-the-lock@form-gate-architect-1, dispatched at 2026-11-22T20:38:42.265Z; its run: Read 43, Grep 35, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T20:38:47Z to 2026-11-22T20:49:48Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 16249 bytes, sha256 6502efcde1c7036822874cf1b375d087448054c7a21c622879f839568d37d1eb, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; nine Documentation findings, D-1 to D-9, for the form's Amendment 1; OPEN-1 to OPEN-4 read for the advisor, not ruled. The brief allowed the draft consult's lines before its title; the architect also read its lines after the end mark, where OPEN-1 to OPEN-4 stand, and says so.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1122 @ 0a2f0022f6247a8f0c00360a12eedca333b447f4

Tag: node:opened-of-panic-sites-free-the-lock@form-gate-architect-1. The form is `governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md`. All cites below are at 0a2f0022.

I have no Correctness or Evidence finding. There are nine Documentation findings, and each must be fixed before the merge. The form is append-only once committed (form:26), so each old/new pair below goes in as a §10 amendment that supersedes the span. None of these sentences is worded by the human. lead-data drafted all of them, so the worker applies my words with no re-gate, and the PR body lists them.

## Checks that hold

**The class.**
- ADV-2026-11-16-06 item 2 (a) names "concurrency" (directive :25). The project lock is a cross-process exclusion, and this piece changes when it is released.
- AUTONOMY §21a: the lock's lifetime is a property under test (:327). W-4 "held" is at `kernel/tests/project_reopen_skp.rs:421-426`, and K-O26 is named at the reviewer's gate :88.
- AUTONOMY §21c is also crossed by size. §7 estimates about 200 changed lines, and the bound is 150 (AUTONOMY.md:350).
- So the class is full under both, and the custodian's §21a to §21c reading holds. ADV-2026-11-22-32 item 2's rule to take the fuller class is met.

**The claims (§1), checked against the code.**
- Before `opened_of` runs, `open_project` has already kept the entry with its `_lock` (mod.rs:870-877) and returned. Every local of `open_project` has been dropped, including the `saved` guard and `_end_open_on_drop` (:709). So nothing is held when a site panics (:972, :986, :1009, :1014).
- The guard closes through the host as the close closure does (:834-837). `SkpHost::close_dataset` (skp.rs:1614-1675) removes the handle from the catalog. `release_ended` (mod.rs:259-266) then drops the entry, because the catalog no longer holds its dataset. Dropping the entry drops `ProjectLock`, which unlocks (store.rs:255-259). So all three claimed facts follow.
- The binding runs the command on `spawn_blocking` (commands.rs:214-216). The guard's `Drop` runs during the unwind on that blocking thread, before tokio's catch hands back the `JoinError`. So the lock is free before `skp.open_project_panicked` is replied.
- The panic payload is unchanged, so the binding sees the same `JoinError`.

**The guard.**
- It holds no lock on entry: `reply_of` holds only `&self`.
- Its lock order matches the shell's own close hand-off (commands.rs:142-144). The host's close takes its own locks and releases them, inside the host's existing order. `release_ended` then takes `saved` before the catalog and the generations, as `save` does (mod.rs:302-304).
- No path takes `saved` while it holds the catalog or the generations (mod.rs:260, :304, :870 are the only `saved.lock()` sites).
- Nothing on the guard's path panics by its own code:
  - every lock on it recovers from poison (skp.rs:1631, :1671, :370, :768, :828; lib.rs:165, :168; mod.rs:260);
  - the watch's drop ignores a failed join (engine/src/watch.rs:504).
- lead-data's note says it did not read this path. I have read it.
- It runs on the blocking thread, never the canvas's, so docs/01's derived rule "Never block the canvas" (docs/01:20) holds.

**The lock's lifetime documents.**
- store.rs:221-223, mod.rs:133-136, mod.rs:558-559 and the module doc mod.rs:23-26 all stay true after the fix.
- `release_ended`'s caller list (mod.rs:247-258) becomes incomplete; see D-6.

**(g)'s K1.**
- K1 relies on the entry being kept before the reply is built. That order is unchanged, and §8 item 4 guards it.
- With no panic, `std::thread::panicking()` is false and the guard does nothing.
- (g) Amendment 1's D-1 relies on `open_project` running `release_ended` (:780), which is unchanged.
- The scopes are disjoint (§8 item 2).

**Tests and mutations.**
- P0 is red at (ii) of S1, as §4 says. With no guard, the catalog still holds the handle.
- M1 and M3 fail at (ii), M4 at (iii), and M2 at K-D2's catalog assertion. None of the four has a known pass case.
- The payloads are `String`s. `unreachable!` takes format arguments, and `Result::expect` formats its message.
- S3's NaN reaches site 1: style.rs:434 builds `Json::Double`, and canonical.rs:296-297 refuses it.
- `RefCheck::Differs` holds `Vec<&'static str>` (dataset_ref.rs:152-154), so S1 and S2 can be built.
- §1's seam reading holds. No `pub` item is added, the binding is unchanged, and the binding's real shape is read correctly. So no end-to-end test is owed.

**Scope.**
- §7 counts in line with the round-25 rules, and an overrun is class 8 (§8 item 10).
- §8 items 2 to 12 hold.
- The invalidators I1 to I6 are sound, including I1's regrade under ADV-2026-11-21-15 item 7.

**The constitution.**
- docs/02: the piece is kernel-only.
- docs/10: no wire or MCP surface.
- ADR-006: the class is unchanged, and the guard's close is the same compensation as the close at :864.
- ADR-018: the form uses none of its terms.

**Records.**
- Every quoted passage I resolved is byte-identical to its source:
  - ADV-2026-11-21-15 :11 and :24;
  - ADV-2026-11-16-06 :13, :25 and :26;
  - ADV-2026-11-22-11 :17;
  - AUTONOMY :327 and :351;
  - the reviewer's gate :39, :43, :45 and :181;
  - the architect's gate :21, :27, :29 and :139;
  - the merge check :32;
  - the B2-1C form :4215.
- There is no ledger cite and no bare self-line.
- The pins are stated to be historical, with the base named as authoritative (form:24).
- The four pinned lines are the lines the form means: :24 is item 4 (iii), :110 is item 5, :17 is item 2's last bullet, and B2-1C :3905 is Amendment 53 item 2's second bullet. The reviewer recomputes the hashes.

## Documentation findings (must fix before the merge, by amendment)

**D-1 (§0, Callers, third bullet).** The mod.rs call is `open_project_command`'s own (mod.rs:905), and that call does reach `opened_of` (:913).
```text
- The 18 direct `open_project` callers (`kernel/tests/project_reopen.rs`, `kernel/tests/project_lock_crash.rs`, and the one in mod.rs) never call `opened_of`.
```
```text
- Of the 18 direct `open_project` calls, the 17 in `kernel/tests/project_reopen.rs` and `kernel/tests/project_lock_crash.rs` never reach `opened_of`; the 18th is `open_project_command`'s own (:905), the one path that does.
```

**D-2 (§1, After the week).** In the shipped app no accepted file reaches the change, so the behaviour bound is not the ground. The size bound is.
```text
§21c's bound also requires "no new user-visible behaviour" (:351), and a reopen that is now not refused after such a panic is new behaviour.
```
```text
§21c's size bound is also crossed: §7's estimate, about 200 changed lines, passes its 150 (:350). Its behaviour bound (:351) is not relied on, since no accepted file reaches the change.
```

**D-3 (§1, Unchanged).** The reply's lineage types sit at commands.rs:871-920.
```text
`protocol/skp/src/v0/commands.rs:699-869`
```
```text
`protocol/skp/src/v0/commands.rs:699-920`
```

**D-4 (§1 May not claim; §8 item 6).** A second panic inside the guard aborts the process. The form neither declares this nor guards against it.
```text
- anything about a panic elsewhere in `open_project`;
```
```text
- anything about a panic elsewhere in `open_project`;
- that the process survives a panic inside the guard's own close: a second panic during the unwind aborts it, and the operating system then frees the lock (`kernel/src/project/store.rs:221-223`);
```
```text
6. The guard releasing on a path that is not an unwind; a lock held when the guard runs.
```
```text
6. The guard releasing on a path that is not an unwind; a lock held when the guard runs; an `unwrap`, `expect` or `panic!` added on the guard's path.
```

**D-5 (§2 item 4, the doc words and their clause check).** "It panics if" omits site 2 (:986), and the omission reads as exhaustive. `Unreadable`'s operating-system text is also dropped (:1056; session_history.rs:1676).

Checked against the code, clause by clause:
- "no rule text and no error text": :1055 and :1056;
- "if that JSON does not read back": :986;
- "any of these": §0, Reachability.
```text
   "The `opened` reply: the workspace in its wire form, whole, as the reader accepted it; the view's state; the check's names; and the two lineage facts, with no text of a lineage file's lines and no rule text: a refusal carries a line number where it has one. It panics if the style does not write again as canonical JSON, or if the check names a word the wire has none for. No file the reader accepts reaches either, and [`Projects::reply_of`] closes the dataset and frees the lock if one fires."
```
```text
   "The `opened` reply: the workspace in its wire form, whole, as the reader accepted it; the view's state; the check's names; and the two lineage facts, with no text of a lineage file's lines, no rule text and no error text: a refusal carries a line number where it has one. It panics if the style does not write again as canonical JSON, if that JSON does not read back, or if the check names a word the wire has none for. No file the reader accepts reaches any of these, and [`Projects::reply_of`] closes the dataset and frees the lock if one fires."
```
```text
   - "no rule text": `Damaged { line, .. }` drops it (:1055). This matches SKP-V0 §12.2 (`protocol/skp/SKP-V0.md:1424`).
```
```text
   - "no rule text and no error text": `Damaged { line, .. }` drops the rule (:1055) and `Unreadable { .. }` the operating system's error (:1056). This matches SKP-V0 §12.2 (`protocol/skp/SKP-V0.md:1424`).
```
```text
   - "No file the reader accepts reaches either": §0, Reachability.
```
```text
   - "No file the reader accepts reaches any of these": §0, Reachability.
```

**D-6 (§2 item 3).** `release_ended`'s doc names its callers (mod.rs:249-251), and the guard becomes a third one.
```text
3. **`open_project_command`'s doc** (:889-893) gains one sentence: a panic while the `opened` reply is built closes the reopened dataset and frees its lock before the panic leaves the call.
```
```text
3. **`open_project_command`'s doc** (:889-893) gains one sentence: a panic while the `opened` reply is built closes the reopened dataset and frees its lock before the panic leaves the call. `release_ended`'s doc (:247-258), which names its callers, gains `reply_of`'s guard among them.
```

**D-7 (§4, K-D1).** Under M4, the next reopen succeeds anyway, because `open_project` runs `release_ended` before it takes the lock (:780). So that reopen does not show the lock was freed. Assertion (iv) does.
```text
each case reopens, which itself proves the previous case freed the lock
```
```text
each case reopens; since `open_project` runs `release_ended` before it takes the lock (:780), that reopen shows only that the previous case closed the dataset, and (iv) is what shows the lock free
```

**D-8 (§4, the wiring into `open_project_command`).** §1 claims the property at `open_project_command`, but K-D1 and K-D2 call `reply_of` directly. If the arm went back to `opened_of(*o)`, every listed test would pass. Today only the architect's build-gate read of the caller (§9) covers that line. CI has no clippy workflow and no deny-warnings setting, so a dead-code warning there would not fail it. The new words name an observation that catches the change.
```text
Mutation **M2:** drop the `thread::panicking()` condition. K-D2 fails at the catalog assertion.
```
```text
Mutation **M2:** drop the `thread::panicking()` condition. K-D2 fails at the catalog assertion.

Mutation **M5:** the `Reopen::Opened` arm calls `opened_of(*o)` in place of `self.reply_of(*o)`. No test fails, since K-D1 and K-D2 call `reply_of` directly. It is observed as `cargo build --locked -p spatial-kernel --lib` warning that `reply_of` is never used, which the unmutated build does not warn, and recorded with the warning's text and the commit in a `RECORDED MUTATION:` doc line.
```

**D-9 (§8 item 1).** §7 excludes the generated files from the count, but item 1 would block on them.
```text
1. Any diff outside `kernel/src/project/mod.rs`, this form, PLAN and records.
```
```text
1. Any diff outside `kernel/src/project/mod.rs`, this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`, the set §7 excludes from the count.
```

## OPEN items, for the advisor (not ruled here)

The form does not carry OPEN-1 to OPEN-4: their text is only in the consult, after its end mark. To read them I read the consult's lines 255-284, beyond the lines before the title the brief allowed. When the advisor rules, the rulings need to reach the form by amendment.

- **OPEN-1:** (A) is sound.
  - (B) adds a code on the wire, which is I2.
  - (C) would still leave the dataset in the catalog on an unwind, and it changes the order (g)'s K1 relies on.
- **OPEN-2:** sound. `reply_of` has a product caller; its proof is D-8.
- **OPEN-3:** sending S-PANIC to P6 is sound. The reason given, that the hedge is still true, does not hold as I read the code, and goes to the advisor in my words. After (A), I find no path out of `open_project_command` that leaves the lock held after a panic:
  - before :781 no lock is taken;
  - between :781 and :877 the `lock` local is dropped during the unwind;
  - after :877 the guard frees it;
  - only a second panic, which aborts the process, is left, and the operating system frees the lock then.

  So reopenNotices.ts:106's "may stay held until the application is closed" would describe no case the code has.
- **OPEN-4:** sound. These are doc comments, not strings the app shows. My clause-checked words are in D-5.

No code is written before this PASS WITH NOTES. The D findings are carried by amendment.

## Files read
- C:/dev/wt/read-1122/governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md
- C:/dev/wt/read-1122/governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md (K1, KM1, Amendment 1 D-1)
- C:/dev/wt/read-1122/state/consults/2026-11-22-opened-of-panic-sites-lead-data-draft.md (lines 1-5 and 255-284)
- C:/dev/wt/read-1122/state/directives/ : ADV-2026-11-21-15, ADV-2026-11-16-06, ADV-2026-11-22-11 and ADV-2026-11-22-32 whole; ADV-2026-11-20-01 lines 95-119
- C:/dev/wt/read-1122/governance/AUTONOMY.md (§21a to §21c)
- C:/dev/wt/read-1122/docs/PREREGISTRATION-TEMPLATE.md (classes 1-6); C:/dev/wt/read-1122/docs/01_Principles.md (headings, :20); C:/dev/wt/read-1122/docs/adr/ADR-018-what-cancellation-acknowledged-means.md (headings)
- C:/dev/wt/read-1122/kernel/src/project/mod.rs; C:/dev/wt/read-1122/kernel/src/project/store.rs; C:/dev/wt/read-1122/kernel/src/project/file.rs (:428-449)
- C:/dev/wt/read-1122/kernel/src/skp.rs (close path, registries, NoWatchArm); C:/dev/wt/read-1122/kernel/src/lib.rs (Catalog); C:/dev/wt/read-1122/kernel/src/session_history.rs (:272, :392-401, :1670-1692); C:/dev/wt/read-1122/kernel/src/dataset_ref.rs; C:/dev/wt/read-1122/kernel/Cargo.toml
- C:/dev/wt/read-1122/kernel/tests/project_reopen_skp.rs (:100-179, :400-434)
- C:/dev/wt/read-1122/engine/src/descriptor.rs; C:/dev/wt/read-1122/engine/src/watch.rs (Drop impls); C:/dev/wt/read-1122/engine/src/pool.rs (Drop); C:/dev/wt/read-1122/engine/src/lib.rs (:106-112)
- C:/dev/wt/read-1122/renderer/src/canonical.rs; C:/dev/wt/read-1122/renderer/src/style.rs
- C:/dev/wt/read-1122/protocol/skp/SKP-V0.md (§12); C:/dev/wt/read-1122/protocol/skp/src/v0/commands.rs (:694-920); C:/dev/wt/read-1122/protocol/skp/src/v0/error.rs
- C:/dev/wt/read-1122/frontends/shell/src-tauri/src/commands.rs (:100-224); C:/dev/wt/read-1122/frontends/shell/src/project/reopenNotices.ts; C:/dev/wt/read-1122/frontends/shell/src/project/openProject.test.ts (:92)
- C:/dev/wt/read-1122/state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-reviewer.md and C:/dev/wt/read-1122/state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-architect.md (the lines cited); C:/dev/wt/read-1122/state/consults/merge-checks/PR-340-231b32cc388b.md (:30-33); C:/dev/wt/read-1122/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md (:3895-3907, :3915, :4215)

Model: claude-opus-5-5 (Opus 5.5).
