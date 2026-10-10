# Drift sweep, run 1, area C (the wire contract against the code) — 2026-10-10

Provenance. An independent, read-only agent on the Claude Platform (Claude Fable 5.1, high effort) cloned the public repository and swept the head of main on 2026-10-10. It changed nothing. Run figures as the platform showed them: 10 m 44 s, 9.1M input and 31.1k output tokens, US$ 6.19. The text below the rule is the agent's report as the human received it; list formatting was flattened in the copy, and the report's first line naming the commit swept is not in the copy, so every cite is to be re-derived at the commit the custodian checks it at. The advisor checked findings 1 to 6 and 9 against main at 116deb53 and they hold; 7 and 8 were checked in part.

---

Findings

1. §1's "live" command shapes omit five always-present wire members.

Text: protocol/skp/SKP-V0.md:26 (open_dataset → { dataset: DatasetHandle }) and the describe block at :60-85, which says it carries "every skp/0.3 and skp/0.4 member"; §8's preamble (:543-546) says §§1–7 are "the live, current-shape description", and the skp/0.9–0.11 entries updated this block in place.
Code: OpenDatasetResponse.session: SessionRef (protocol/skp/src/v0/commands.rs:68, set at kernel/src/skp.rs:1294-1297); DescribeResponse.coverage/checks/session_end (commands.rs:283-289, filled at kernel/src/skp.rs:1308-1366); FieldInfo.projectable (commands.rs:234, kernel/src/skp.rs:1967). The shared fixtures v0-open_dataset-response.json / v0-describe-response.json carry all five; the shell mirror types.ts:58,166,201-207 carries them too.
Why it matters: a client author reading §1 as the current shape builds a reader missing four describe members and one open_dataset member that the host always emits.
Confirmed.

2. §7.5 says skp.filter_identity_alias_ambiguous is unreachable from any product entry point — it has been reachable since skp/0.2.

Text: SKP-V0.md:485-488: "no constructor kernel/ uses today produces a declared identity mapping whose source column differs from the wire's own id name…".
Code: kernel/src/skp.rs:1119,1174-1176 passes the wire's identity into Catalog::open_cancellable → Dataset::open_cancellable (kernel/src/lib.rs:202-216), and engine/src/dataset.rs:1714-1726 turns it into IdSource::Mapped; engine/src/predicate.rs:1117-1129,1166-1173 then fires the code when the file also has its own id column. kernel/tests/skp_admission_remediation.rs:206 shows describe.identity.source == "mapped:parcel_key" through SKP. Written at ee3b73ba (v0.1), made false by b751ff4a (skp/0.2).
Why it matters: a shell or test author will treat the code as dead and not handle it, though the admission panel's identity form can trigger it.
Confirmed. (Adjacent, area D: engine/src/predicate.rs:1111-1116's "honesty note" repeats the stale claim.)

3. §4 item 1 says ADR-017's acceptance condition "keeps publish unreachable regardless".

Text: SKP-V0.md:201-202.
Code/record: publish is reachable from the shell via binding_publish_prepare/execute/cancel (frontends/shell/src-tauri/src/commands.rs:265,402,451); ADR-017's exposure-review completion (docs/adr/ADR-017…md:1130-1137) discharged the condition for the shell UI surface on 2026-08-17. Still true: no SKP publish command exists.
Why it matters: a reader concludes publish cannot be exercised from the product at all, which is false; only SKP/MCP exposure remains gated.
Confirmed.

4. §1 says a non-file path is refused "with EngineError::Source's own text" — a directory now gets a different typed code.

Text: SKP-V0.md:29-30.
Code: engine/src/dataset.rs:325-327 refuses a directory first as IdentityOrdinalPartitionedUnsupported (partitioned_source_detail, :1646-1648), mapped to engine.identity_ordinal_partitioned_unsupported (kernel/src/skp.rs:2092-2095); only a non-directory non-file reaches the Source arm at :328-332. Changed in 01045ee3 (skp/0.3).
Why it matters: a client matching engine.source for "not a file" misses the directory case.
Confirmed for the code change. The same sentence's "The host canonicalizes it" has no counterpart on the open path (canonicalize appears only in engine/src/watch.rs:605 for arming and in permission code) and I found no commit that ever did it — suspect original inaccuracy, not drift.

5. §3 names skp.malformed_hex_f64 / skp.bbox_not_finite as the refusal for a bad HexF64; nothing on the host mints them.

Text: SKP-V0.md:186-187; §5 :329-331 also lists skp.unknown_handle.
Code: the constructors exist only in protocol/skp/src/v0/error.rs:74-96; no call site in kernel/ or frontends/shell/src-tauri/ (grep). A malformed value fails HexF64::deserialize (codec.rs:71-78) inside Tauri's argument decoding, so the shell receives a Tauri invoke error string, which client.ts:60-62 rethrows un-typed. cancel on an unknown handle returns state: "unknown" (kernel/src/skp.rs:1561-1567), never skp.unknown_handle.
Why it matters: a client branching on these codes (§5's stated intent) will never see them.
Suspect as drift (may never have been true); tests/conformance/AMBIGUITIES.md A3 records the layer question but not that the codes are never minted.

6. Shell mirror says the event decoder is "a later piece".

Text: frontends/shell/src/skp/types.ts:290-292: "The decoder/listener that consumes this (skp/events.ts) is a later piece; this file mirrors only the wire shape."
Code: frontends/shell/src/skp/events.ts:24-75 has decodeDatasetSessionEnded and listenDatasetSessionEnded, with tests in events.test.ts.
Why it matters: a reader would believe dataset_session_ended is not yet consumed and look for missing work.
Confirmed.

7. handles.rs module doc still states two minting rules and three handle kinds.

Text: protocol/skp/src/v0/handles.rs:4-13 ("Two minting rules, one type per kind… All three are session-scoped").
Code: the same file defines a fourth kind, SessionRef (:102-111); SKP-V0.md:172-175 states a third minting rule for it.
Why it matters: the spec and the type crate's own doc disagree on how many handle kinds and rules exist.
Confirmed (protocol crate doc, adjacent to the area's two named code files).

8. projection_error_of doc counts six codes; the match has seven arms.

Text: kernel/src/skp.rs:1720-1721 ("applied to the six declared skp.projection_* codes").
Code: seven arms at :1725-1782, the seventh (ColumnNameNotAddressable) added at skp/0.7 (19f37da); §9.5 lists eight codes including the boundary-minted projection_empty_list.
Why it matters: a reviewer checking the no-wildcard discipline against "six" undercounts the taxonomy.
Confirmed, minor.

9. No live section states the current literal; §9.1 stops at skp/0.7.

Text: SKP-V0.md:1092 ("now compared against skp/0.6") with a dated note at :1097-1099 moving it to skp/0.7; §4 item 3 (:219-221) stops at skp/0.6.
Code: SKP_VERSION = "skp/0.11" (protocol/skp/src/v0/mod.rs:108; types.ts:15), compared with == at kernel/src/skp.rs:1614-1619. The 0.8–0.11 bumps are recorded only as §8 entries.
Why it matters: a client author reading the "now" sections sends skp/0.7 and fails on the first call.
Confirmed; structural rather than a single stale sentence.

Already tracked (left out above)

kernel-close-races-followups (done; fixed §1's close_dataset paragraph and terminal_detail_of call-site note — both now accurate).
skp-cancel-state-closed-set (done; CancelState closed on both sides — verified accurate).
skp-closed-domain-response-strings (reader-side String typing of crs.source, identity.class, sanity.level — not reported here).
skp-line-cites-outside-close-races (stale line cites into skp.rs from shell files).
module-docs-stale-statements (kernel README/lib.rs publish-exposure wording — the kernel-side sibling of finding 3; SKP-V0 §4 item 1 is not named there).

Not reached

The full §7.4 construct allowlist against engine/src/predicate.rs's walker beyond the arithmetic/pattern constants; §9.3's nullability/dictionary emission in engine/src/stream.rs; §4 item 11's data-plane token/origin/loopback claims; the tests/conformance/fixtures/*.json contents; protocol/skp/tests/fixtures.rs and kernel/tests/skp_*.rs assertions against the spec; kernel/src/skp.rs test-module comments (lines 2310–5018).
