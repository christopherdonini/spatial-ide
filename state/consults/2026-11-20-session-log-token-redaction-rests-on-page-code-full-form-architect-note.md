*Filed by the custodian: the note that followed the form in the architect's hand-back (claude-opus-5-5). The hand-back is 34907 bytes, sha256 d53f09f397f0006d966edea245cd81987f36519857689ac19ba5ca27afac13a0, from 2026-11-20T17:10:51Z to 2026-11-20T17:20:29Z by its transcript, calls Read 39, Grep 31, Glob 10, SubagentHandback 1, none errored, by unique call ids. Its bytes before the line ---END OF FORM--- are the form, filed at governance/forms/frontends/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md with one final newline (its blank last line dropped), 29679 bytes, sha256 bf95de5004432eca9781c8690239c12b83f005623bca56cd3981d119d1be3f58; the custodian's script found its twelve quotations byte-identical to their named sources. Its bytes after that line are below the rule as they came. Nothing in the note is ruled by its filing: its item 4 goes to the advisor before any code.*

---

**Note, not part of the form.** Reviewed: main @ db6eb550bc88fe492f41b5973d16dc8a675a5ee9 (read only; Read, Grep and Glob only; no hash computed). Model: Opus 5.5 (claude-opus-5-5).

**1. Quotations in the form, and their sources.** All are byte-copied by my Read, not by script, so the custodian's script should check each one.
- §0.1, the human's two spans: `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md`, item 2.
- §0.3, the reuse block: the custodian's brief (untracked; marked as evidence).
- §2.3 item 1 and item 2: the re-read (`state/consults/2026-11-20-session-log-token-redaction-rests-on-page-code-form-re-read-architect.md`), section 1, its §2 After items 1 and 2.
- §2.4 (a), the fence: `state/directives/2026-11-20-advisor-ruling-adv-2026-11-20-17-the-redaction-nodes-form-its-ten-points-ruled-the-control-character-rule-the-advisors-addition.md`, item 2's fenced block.
- §2.4 (b): the re-read, section 5, its module-doc bullet.
- §2.4 (c), (d) and (e), the three blockquotes: the draft (`state/consults/2026-10-23-session-log-token-redaction-rests-on-page-code-architect-draft.md`), §2, its Comments.
- §8 item 3: ADV-2026-11-20-17 item 5, its last bullet but one.
- §11 I5: ADV-2026-11-20-17 item 7.

**2. ADV-2026-11-20-17, item by item, and where each lands.**
- Item 1: (a) in §0.1; (b) in §2.3 item 5; (c) in §0.1, §1 and §5 (P4, declared unchanged); (d) in §4 (K-3); (e) in §2.4 (f).
- Item 2: §2.4 (a), (b) and P6.
- Item 3: §7.
- Item 4: §5 P2, §7 (`Cargo.toml`), §9 PR body and §11 I2.
- Item 5: §2.3 items 1 and 2; §8 item 3; §2.4 (b).
- Item 6, as ADV-2026-11-20-19 item 2 reads it: §9.3 E2E and §11 I7.
- Item 7: §10.3 and §11 I5.
- Item 8: §0.4, with the re-pinned cites by symbol in §2 and §2.4, and the live-Tauri-app paraphrase in §0.5.
- Item 9: §2.4, Not this node's.
- Item 10: §10.4.
- Item 11: §10.3 and §12.
- Item 12 (nothing reserved): no landing needed.

**3. Cites of the form path:line in the form.** Only the two inside the re-read's quoted words in §2.3 item 2: `lib.rs:445-448` (the `DataPlaneHandle` construction) and `lib.rs:546` (`Box::leak`). Both resolve as meant at db6eb550 in `frontends/shell/src-tauri/src/lib.rs`. Every other reference is by file and symbol.

**4. Points the sources leave open, for the advisor.**
- **(a) K-3's two failure points cannot both hold.** The re-read gives mutation (a) as removing the replacement with the message's LF escape kept, red at the no-Cc check, and (b) as the rule on `message` alone, red at the line count. Under (a) as worded, `level`'s LF is raw, so the line count fails too. No single order of assertions makes (a) fail at no-Cc and (b) fail at the line count. The form therefore declares only what the ruling asks: each mutation is seen to fail by name, with its failing assertion recorded. One precise reading would define (a) as the U+FFFD replacement removed with the LF escape of both texts kept. That is not settled here.
- **(b) Clippy, and the standing build rules.** ADV-2026-11-18-24 item 5 (b) names P3a and P3b. ADV-2026-11-19-33 items 2 (v) and 3 say they are for later parts. The form applies them to this node on the brief's instruction (§9.2, §10.2, §8 item 10). Whether they reach this node is the advisor's to confirm.
- **(c) The P5 check.** ADV-2026-11-20-17 item 7 says P5's files are checked at its dispatch. ADV-2026-11-19-35 item 1 (c) says the node waits for P5's merge if they hold a src-tauri path. Neither says which piece waits if this node is already in flight when P5's files are read.
- **(d) `pool_poll.rs` beyond item 9.**
  - The stale `state.rs:43-55` cite appears twice: in the module doc and in `poll_loop`'s comment.
  - The module doc also counts two `String` allocations inside `SessionLog::append`. Under §2.3 item 5 that count becomes untrue, in a file this node does not touch (its code is dev and measure-build only).
  - These should go to the docs lane with item 9.
- **(e) The comment in `binding_publish_prepare`.** It says that command needs a live Tauri app to reach. `commands.rs` is in this node's Scope, and the mock runtime arrives with it. The comment is probably still true for that command, which opens a native dialog. Both gates should read it.
- **(f) The words "a folder already chosen" in §2.4 (a).** `SaveProjectRequest.folder` is an `Option` with the key present. The gates should read that clause against what `None` means for `save_project`.
- **(g) The class's basis lapses after one week.** ADV-2026-11-16-06 runs for a week from 2026-11-16. If dispatch falls after that, the full form rests on ADV-2026-11-19-35 item 1 (d), with the draft's §21a guarantee-head argument as the fallback.
- **(h) Not re-verified at db6eb550:** the re-read's count of 40 `logSessionEvent` calls, and its reading of tauri 2.11.5's source and manifest.
- **(i) A line not this node's.** The `description` line in `src-tauri/Cargo.toml` already says every command calls one `SkpHost` method. That is untrue of the bindings. `Cargo.toml` is limited to the human's one entry, so this is a docs-lane candidate, not this node's.
