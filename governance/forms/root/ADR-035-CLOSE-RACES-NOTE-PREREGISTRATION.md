# ADR-035's appended note in the human's words: what kernel-generation-close-races makes historical (PLAN node adr-035-close-races-note). Preregistration (full form)

File: governance/forms/root/ADR-035-CLOSE-RACES-NOTE-PREREGISTRATION.md, committed on main by the custodian before any code.

**Authority.**
- The node: `governance/PLAN.yaml:3245-3261 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:74bef97fed96fa10348931ce33b68f334d189ce558c91d38d050396975b7c45a` (depends_on kernel-generation-close-races, done, PR 136, `governance/PLAN.yaml:2334-2350 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:a477c2584f65b7cb4f7bd36a33edaed370d4ae977104c79301c2e23c8acfa03e`; and adr-020-appended-note).
- The ruling and the words, from two of the human's messages. Below, D1 and D2 are these files:
  - D1, the human's message of 2026-11-11 (17:25Z), item 1: `state/directives/2026-11-11-adr-035-and-adr-029-notes-in-the-humans-words-table-as-consult-s3-waiting-on-you-open-questions.md:9 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:074c3252e1037a1be095aad8c09199afdac7bafa6f2827371ad8a0ab203c335c` (the item). The words kept are the heading, the italic line and items 1 and 3: `:11-15 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:3609a8d420356953e8ed2ded8164bbb02583d959c8598829a4e9b32823b69a62` and `:17 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:2e82326626f0a4da23e6f18a601e934320033803723d8afb3f9ab65c7556f0b5`. Its item 2, `:16`, is replaced whole and does not land.
  - D2, the human's message of 2026-11-11 (21:49Z), item 1: `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:9 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1d2e8c55c3dcbfbbb4e654a921194969a51b219e2c73435a229e9eb1c9e6c5f0` (the item, which answers the draft's OPEN-1). The new item 2 is the span inside the outer quotation marks of `:10 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:682c00d6503dde1ff1288d47959988b7844302c95c70c9d1f6f2ef647570c46f`. That is a sub-line span, and it carries its line's hash.
- What owes it: Advisory N4 of the close-races gate-1 architect report, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md:41-46 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:ec34271d52a562e72e8dec8983d5cb3df8a71930b62c1689e0f6722c75a8e122`.
- Red line: `governance/AI_DEVELOPMENT.md:451-454 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821` (ADR statuses and amendments). §31's replacement route does not apply to red-line text (`governance/AUTONOMY.md:544 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:25b91d5336bc7016ac3eb61392406795b78f56fc47799fe31085ddcaf1d84ff1`).
- Verdicts: proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Whether a clause is true is a Correctness question.
- The reuse index (the standing step). The custodian ran it in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-11, and it is reproduced byte for byte below as the custodian's brief carried it. The query misses. The miss is noted and does not block. The draft's earlier query also missed. The prior art in the tree is the ADR-017 note form (`governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md`), the ADR-020 note form (`governance/forms/root/ADR-020-APPENDED-NOTE-PREREGISTRATION.md`) and ADR-035's own Note of 2026-09-25.
    $ node tools/reuse.mjs adr note mint race arm refused unknown dataset   (exit 1)
    No prior art recorded for "adr note mint race arm refused unknown dataset". Research it before planning an implementation.

**Drafted by** the architect, read only, at main 8e09470c4ad7b0d10561005dbc2746bf2deefdfb (C). The draft is revised after the human's answer to its OPEN-1 (D2, item 1). The note's words are the human's. Every other word of this form is the architect's.
**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
**Gating: full form, both gates from dispatch** (§21a, `governance/AUTONOMY.md:315-332 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`; §25 (e), `governance/AUTONOMY.md:482 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669`).
- The piece appends a dated note to an Accepted ADR, which makes it an ADR amendment (`governance/AUTONOMY.md:319-320 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5238514ca590001e21cfa3c41b057ba1c429c7334f4ba2c53c68aeb0b3a5a039`).
- Its item 3 restates an at-most-once emission property that is under test, and its item 2 states how a refusal arm in the current code behaves (`governance/AUTONOMY.md:325-327 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7`). Both are text only, with no code.
- So no Out-of-scope line could assert that the piece touches none of the four categories. No five-line form is committed. Dispatching on one would fail by name (round 25, item 2).
- By size the piece is under §21c (`governance/AUTONOMY.md:347-357 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31`).
- Out-of-scope, the four categories:
  - ADR: touched (ADR-035, appended only, its Status line unchanged).
  - Security posture: not touched.
  - Data plane and wire: not touched.
  - Stated guarantee: touched, as documentation only.

## §0. Disclosure
- Inputs read at C:
  - the node;
  - D1 and D2;
  - ADR-035, whole;
  - N4;
  - §21a to §21d and §25 (e);
  - the ADR-017 and ADR-020 note forms;
  - `kernel/src/skp.rs` at the spans in §2.2, with searches for `viewport_query_attribute(`, `live.insert(`, `SessionRef::mint()` and the attribute arm's two detail strings;
  - `frontends/shell/src/streaming/liveTicketSet.ts:66-79`;
  - the close-races follow-ups form's Amendment 2, item 7.
- The draft's OPEN-1 was answered by D2, item 1, and this form is the revision. The draft is filed at `state/consults/2026-11-11-adr-035-close-races-note-form-architect-draft.md`.
- No fixture, no run, no measurement.

## §1. May and may not claim
- May claim:
  - ADR-035 at B is a byte prefix of ADR-035 at H;
  - the bytes appended are exactly the output of the §2.1 script run on D1 and D2 at C;
  - each clause holds as the gate finds it at B, or as the human's recorded answer states.
- May not claim:
  - any change to ADR-035's Decisions, its Status line, its Acceptance section or its Note of 2026-09-25;
  - that D1's item 2 (`:16`) is any part of the note;
  - any change to code, tests, the wire or a measurement;
  - that a clause the gate sends to the human is true before the human's answer is recorded.

## §2. The change
2.0 Rules.
- (a) A single append at ADR-035's end. Nothing above it is edited.
- (b) The appended text is the human's words as §2.1 assembles them, unwrapped, as ADR-035's own long lines are. It carries no pin, no path:line cite, no comment and no added word.
- (c) No line of it begins with `Status:` or `**Status:**`.
- (d) The worker stops (§5) if ADR-035 at B does not end in a line feed, holds a CR byte, or ends with a blank line.

2.1 The bytes, assembled by script from D1 and D2 at C. Each file is read as bytes with `git show 8e09470c4ad7b0d10561005dbc2746bf2deefdfb:<path>` and split on LF. Line numbers below are 1-based at C.
- Piece A, from D1: lines 11 to 15, each with its LF.
- Piece B, from D2: line 10 without its first byte and without its last byte before the LF (the outer quotation marks), followed by one LF.
- Piece C, from D1: line 17, with its LF.
- The output is one LF, then A, then B, then C.

The script checks these, and stops on any failure with a non-zero exit and nothing written:
- 1. Neither D1 nor D2 contains a CR byte.
- 2. Found once:
  - D1's lines 11 to 15, joined, occur exactly once in D1;
  - D1's line 16 begins with the anchor `2. Three passages`;
  - D1's line 17 begins with `3. `;
  - D2's line 10 begins with the two bytes `"2` and ends with `."` before its LF;
  - D2's line 10 holds exactly four `"` bytes (the outer pair and the inner pair around the quoted bullet);
  - piece B, without its LF, occurs exactly once in D2.

  The anchors are for locating the lines only. They are not quotations.
- 3. The join: the output holds exactly 8 LFs, and its first byte is LF. Its line 7 (counting the leading blank line as line 1) equals piece B without its LF. No line of D1's line 16, whole or in part from its third byte on, occurs in the output.
- 4. The final newline: the output's last byte is LF and the byte before it is not.
- 5. The total byte count: the output's length equals `1450` (§7). N is derived independently of the script as `(git show C:D1 | sed -n '11,15p;17p' | wc -c) + (git show C:D2 | sed -n '10p' | wc -c) - 1`. That is one leading LF, plus D2 line 10's length less its two outer quotation bytes, with its LF kept.
- 6. ADR-035's working copy equals ADR-035 at B byte for byte, and §2.0 (d) holds.

When every check passes, the same script appends the output to `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` and exits 0. If a guard refuses the script's write, the fallback is one Edit. Its `old_string` is ADR-035's last line at B with its final LF (at C that is :158), and its `new_string` is the same text followed by the script's output, read from the scratch file the script wrote. E4 proves the bytes either way.

2.2 The clause list. Each line is one clause of the note as §2.1 assembles it. The labels are mine: they paraphrase and do not quote. The spans show where each clause rests, and none is graded here. The gate grades each one at B (§9).

| # | Clause (paraphrase, label mine) | Rests on |
|---|---|---|
| H.1 | heading: what the named piece makes historical | `governance/PLAN.yaml:2334-2350 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:a477c2584f65b7cb4f7bd36a33edaed370d4ae977104c79301c2e23c8acfa03e`; items 1 to 3 below |
| I.1 | italic line: appended on the human's ruling | D1 :9 and D2 :9 (above) |
| I.2 | italic line: the text above is unchanged, Status line, Acceptance section and the 2026-09-25 Note included | E2 at H; `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:9bc5402780ed589ba90bb861f56135c6835c5b8f0b7d4e499911f1ebb947bb92`, `:141-147 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f2ded95a7ac151fcb6c8fa1bb1bf1cb29f5d0a2fd872b89f5900afcfedf39485`, `:149-158 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f81b5c50537ea14d3d9e8c71909ec19d162209c5849299db1d82bb07af6ee7a3` |
| 1.1 | the close race the 2026-09-25 Note's item 3 left unsettled | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:157 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:0a505b46416d1d8f314ef1c0d04128cc758b6985a3c941aa8248981c37124d30` |
| 1.2 | is closed by kernel-generation-close-races, PR 136 | `governance/PLAN.yaml:2343-2344 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:d089d6fdddd07bd0dc79fe00780f3ec82ebffea59e6ab95e63404d0d93716c9e`; tests CR1 to CR4, `kernel/src/skp.rs:4502-4758 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:cbbdd330aeeca66f4f33a4b6243cac3a935f881eca10be7e8a4474ba06962a92` |
| 1.3 | merged 2026-09-28 | `governance/PLAN.yaml:2350 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:b8d775270b0f31323a57b24d33dfb8d4583e7e22f3055e195dd69067ffa6c5e9`; E12 |
| 1.4 | since that merge only `open_dataset` creates a live generation, through `mint_for_open` | `kernel/src/skp.rs:574-593 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:a4e25ba3f1ad910f686f46441f23b420708e9cce496e51dc60b29e6030050648` (the only `live.insert` outside `#[cfg(test)]`, :583); its callers `kernel/src/skp.rs:1269-1272 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:2ce26d556a07027cdbdebaa36c00753528462170f08960f60134dac9434d7264` and `kernel/src/skp.rs:1312-1314 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:88bd2a2e05aa60d756eea64c241957c04c74ab4b34b288c8807cae7eeb0a6378`; `live_generation` `kernel/src/skp.rs:595-615 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:706c89173ff290a3f32cfead77a4f54ebd014f86cd753def146ddfb836380744`; the test modules begin at `kernel/src/skp.rs:2441-2442 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:03c5b4b27fb001def5489d5e0264e20f2538b8214c3df8ceda3354aaee53c2c8` and `kernel/src/skp.rs:3454-3455 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:ac5b774e4bfb494889b81d195d6c445a863c232fcb37e859a3b5bee5a48afbbd`; E13 |
| 1.5 | a `viewport_query` racing `close_dataset` no longer mints one | `kernel/src/skp.rs:1405-1416 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:b0b8eff1a1c4973f4771105f5724ff46acabc85b601e3a4a3c23fd07b71d6470`; `kernel/src/skp.rs:1472 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:8a3283c12d21190899182ea9cb8d0a1318ef878ed1df250f3a6a72eb269eb7d5`; `kernel/src/skp.rs:1666-1688 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:92eec74734f3887be68d6ab2a44734e7acd36a185c3d830e60f5fdfa6cd42712`; CR1 `kernel/src/skp.rs:4641-4702 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f55335a27afdf6bd786fc7807ee7b63fcbc35fab8249095f7a00edcfe765e427`; CR2 `kernel/src/skp.rs:4502-4591 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:b12171d3d8a962f150c492da47f10adc9fd384a36234d2059dd1c1fef5f58195` |
| 1.6 | it is refused as `skp.unknown_dataset` | `kernel/src/skp.rs:1673 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:7e846d5df05a23700f675673a3e22176262ced374562480541966f5cc1d740b2`; `kernel/src/skp.rs:1531-1533 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:721b972c094f353bd3c55158f78630811015197f3a5a45088c8a791913589360`; `kernel/src/skp.rs:1432-1435 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:fb03fc52c3219de0e4b3b461db9cfa05f66e7decef519974cfd1ec4bba8b0630`; the close's linearization and cancel, `kernel/src/skp.rs:1613-1623 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f6597ff907bfed657a6e8b969d3537af619daf403ed16f5d36c06b325f2c075b`; CR1 :4676, CR2 :4553, CR3 :4739 (inside the spans above) |
| 1.7 | or by the end's reason, if the generation had already ended | `kernel/src/skp.rs:605-607 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:ae0f1aa7f05394016ad582abbf12c225e1c9776635ec55f5a4fd437c5ef22717` (the end mark is read before the closing mark); `kernel/src/skp.rs:1671-1686 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:630513e1836b72222c73ca3d8aa04ef19deebdb63d25ac9dd14be9b97fecbc05`; `kernel/src/skp.rs:1537-1547 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:39def6e05ace9d95a2350d4ac0aeb7731648b36aa3acd774cc376d9878a85d7a` |
| 2.1 | two passages above describe the kernel before the merge and are historical | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:50 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:23eac442dcf118a3829eb29c90299be52b61d7f47cb64196641eb3cdfd58a0b0`, `:60 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:22febae0f039abdbea4bd8542e1d929273e94585f6094caeca65a4ed0fe130a0` |
| 2.2 | the first passage: Decision 3's bullet that the note names by its words | ADR-035 :60 (above; a sub-line span, which carries its line's hash) |
| 2.3 | no such generation can now exist | as 1.4; `EndReport`, `kernel/src/skp.rs:840-849 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:95dc0c871085c9f34ba8bb927b0d1f6bdd7bdf84a6aef8fc324e841c910d6e36`; non-test `SessionRef::mint()` at :1270 and :1312 only (E13) |
| 2.4 | the case the 2026-09-25 Note gave an unheld reference for no longer arises | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:153-155 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:7a130d0ae9d40e8cd3128f4f8f8d45fa1629de92c7f68a63c2d767818a3ea6b7`; CR1 (above) |
| 2.5 | the second passage: Decision 3's sentence that `invalidate` marks before its live lookup | ADR-035 :50 (above) |
| 2.6 | `invalidate` now writes a mark only when it removes a live generation | `kernel/src/skp.rs:780-793 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1a20c96fdc20f4f274aa6eb3b03f3275f2ec78d64680ee9e64c592436db1cbdc`; CR4 `kernel/src/skp.rs:4593-4639 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5443d4426fc8a4a21c7f36ed6d0975a783bb5bd90d70ecd2d3b35ce2e34cf226` |
| 2.7 | Decision 2's mint-race arm is not historical: it stands | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:29 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:cf16cb45cf93693ef2345c24b937fe9f3f2fa22876874e4dd95f0bedbca2b1df` (Decision 2 places the arm in `SkpHost::viewport_query`); `governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:365 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:44ed9d63a8a2a6bd9ca86dde8b045e918c4a178ac0277319f9f310efa835db7a`; `frontends/shell/src/streaming/liveTicketSet.ts:72-74 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:7bfe6bbd496d47112ce4142cd5d6ea405cbba199ccfe4b0b5037eaef2538fec8` |
| 2.8 | in `SkpHost::viewport_query_attribute` | `kernel/src/skp.rs:1511-1553 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:faf1255f4895be053e5e9c7596b45fa68044c5f96cc5a4657742b60770e3e704`; its only product caller, `viewport_query`'s third step, :1415 (inside 1.5's first span) |
| 2.9 | where a ticket that cannot be attributed to the live generation | `attribute_ticket`, `kernel/src/skp.rs:617-635 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5b32992d71827ae31722fe00c45f2887e4b4e83343b92d1e61c0be34f03dbb4d` (false with no live generation, or while closing, :625-630); its call, `kernel/src/skp.rs:1522-1525 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:09522ab58d820b99983569a5a62f515f7fdcc4978dac525a127b29d01ee95e98` |
| 2.10 | is cancelled | `kernel/src/skp.rs:1526 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f3d25531df2e1a96d364e6bf01d5dba5bace62866ea7ca955900dc0dcc6c92f6`. A fact for the gate: CR3's cancelled-state assertion, `kernel/src/skp.rs:4740-4753 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:bb91b44c489510c3481676cd2292a014700fd01879b920fb16b0240fe3b196b8`, also holds through the close's own cancel at :1623. My search found no test that isolates :1526 |
| 2.11 | and the call refused | `kernel/src/skp.rs:1531-1547 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:fd195ca5f26715f5ed6eedb273a3dde0081c6d111fb10c4cc66bea84612c7e2b`; CR3 `kernel/src/skp.rs:4704-4758 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:be17602139f0697a72257665040a85ff2988c327cc272d2ff3c6d438c158d069` |
| 2.12 | by the end's reason | :1531 and :1537-1547 (above); `ended_reason`, `kernel/src/skp.rs:750-759 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:3de441791bda749f665970ce8f41f3e1391333f9cca143cfa13ce12bf2921e22` (the first mark). A fact for the gate: my searches under `kernel/` found `viewport_query_attribute(` called only by CR1 (:4674) and CR3 (:4737), both asserting `skp.unknown_dataset`, and found the arm's two detail strings (:1539, :1543) nowhere else. No test I found drives this branch |
| 2.13 | or as `skp.unknown_dataset` when no end is recorded | :1531-1533 (above); CR3 :4739; `forget_dataset` clears the mark, `kernel/src/skp.rs:827-837 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:27947a50e3dfb78975b6e7ae714d3668e2fa7fa26ca1ffc128bff3ba7fbaa049`. A fact for the gate: CR1 :4676 refuses at the mint step's `require_live` (:1472), not at this arm |
| 3.1 | nothing else changes | ADR-035 Decisions 1 to 7, `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:23-117 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:a8f65d09bb36cf1395dd5e3d0eab45589b9917ba24c3bddd08f0a99af0a8c347`, read against the code at B; the close-races gate-1 §9 rows, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md:55-59 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:deb3d8a988665ce9b9aed6cc6a123037d9fb163abd198e10a75202e1e494c299` |
| 3.2 | every end still emits at most once | `kernel/src/skp.rs:787-793 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:b1403ad21891b1bd4e9126fd2a0fe72d63d5a1469ebb1dd25735ed19b6849027`; `kernel/src/skp.rs:914-918 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5ebaf8d8e2aff3f7153359b080570b28ec19c349bf0dea0b8e1ace6ce24d1fdf` |
| 3.3 | an end recorded during a close still emits | `kernel/src/skp.rs:761-770 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:c77d5a9ed35e7d36dfc86c67b4787916a56ec30355bcaf9beca8fbe882febfa1`; `kernel/src/skp.rs:1617-1621 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:989efbe9d89308114b3b64bd71120d15ddfad72f999537e12a921077db9658a8`; `kernel/src/skp.rs:1633 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:a9920f17a434f08b13b22f3cd7ccd4a568b01884b9621b7ad12f24c0410ea3bf`; R2 `kernel/src/skp.rs:4760-4789 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5d21d1a86ac79f7dea989eb066d304e0357a5c0744aa7e13a41a688103b407b4` |
| 3.4 | no wire change | E14 (PR 136's diff under `protocol/`); this piece's diff under `protocol/` is empty (E1) |

These pins are historical and were taken at C. The gate reads each clause at B. Where the tree at B differs from a pin, the gate names which one is authoritative; for a clause's truth, that is the tree at B.

2.3 Overlap, rule (00). This piece's paths:
- P1 `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, append only;
- P2 this form, the custodian's, on main;
- P3 `governance/PLAN.yaml` with the generated `CUSTODIAN-QUEUE.*` and `site/`, the custodian's, on main.

How they meet the pieces in flight at C:
- 1c step 1 (#307) edits `kernel/src/skp.rs` (`open_dataset`). It is disjoint by file. Its contact is that clauses 1.4, 1.5, 2.3 and 2.8 to 2.13 read `kernel/src/skp.rs`, so the gate re-derives them at B.
- `adr-029-stale-line-cites` (ADR-029): disjoint.
- Nothing under `protocol/`, and no lockfile or wire fixture changes.
- At dispatch, the custodian re-checks rule (00) with `git diff --name-only origin/main...<branch>` over every branch in flight and every PR awaiting merge.

2.4 Portability: no OS-dependent feature, so R3 does not apply.

## §3. Fixtures
None.

## §4. Tests and evidence
- No test is added, renamed or changed, and no mutation is owed, because the piece changes a document only. No record of this piece calls any run an observation of a mutation, a `verify-mutation` run included.
- Evidence at H. Each item is run by script with its exit code checked, and each tool claim names the tool's commit (round 15 (c)):
  - E1: `git diff --numstat B...H` lists ADR-035 alone among non-generated files, with 8 insertions and 0 deletions.
  - E2: ADR-035 at B is a byte prefix of ADR-035 at H (node Buffer compare).
  - E3: ADR-035 at B and at H has no CR byte and ends in exactly one line feed (node).
  - E4: H's bytes after B's length equal the §2.1 script's output, re-run on D1 and D2 at C with every check of §2.1 passing (node).
  - E5: `node scripts/plan/verify-quotes.mjs` exits 0. Every passage it extracts from the note resolves to ADR-035 :60. Any other movement in its counts against B is a stop (class 2).
  - E6: `node scripts/plan/verify-cites.mjs` exits 0.
  - E7: `node scripts/plan/verify-test-claims.mjs` and `node scripts/plan/verify.mjs` exit 0.
  - E8: `npm run verify:adr-index` in `frontends/shell` exits 0. ADR-035's row, `docs/README.md:72 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:8d1ca8e7447037b81b1e7ff8523c91ac019b37ad31111968902e1db14eaf8a72`, is unchanged.
  - E9: `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.
  - E10: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exits 0.
  - E11: PR CI is green.
  - E12: `gh pr view 136 --json mergedAt,mergeCommit` reports a UTC merge date of 2026-09-28. Its merge commit is M.
  - E13: a script lists every `live.insert(` and `SessionRef::mint()` line under `kernel/src`, with file:line, at M and at B. The architect classifies each line against the `#[cfg(test)]` boundaries.
  - E14: `git diff --name-only M^1 M -- protocol/` is empty.
  - E15: the byte count of H's appended bytes (H's ADR-035 length less B's) equals N from §2.1 check 5, computed again at H by the same `git show | sed | wc -c` derivation.

## §5. Predictions, declared unchanged, invalidators, falsification
- Predicted: E1 to E15 hold.
- Declared unchanged:
  - every byte of ADR-035 at B;
  - `docs/README.md`;
  - `protocol/skp/SKP-V0.md`;
  - every code and test file;
  - every other ADR;
  - D1 and D2.
- Invalidators (stop and report):
  - E3 fails at B;
  - D1 or D2 at B differs in any byte from the same file at C;
  - any in-flight piece edits ADR-035;
  - any check of §2.1 fails.
- Falsified if ADR-035 at B is not a prefix of H, or if the appended bytes differ from the §2.1 output.

## §6. Instruments
Assertions by script only. There is no measurement and no operator step.

## §7. Declared values and ceilings
- P1: at most 8 insertions and 0 deletions, by `git diff --numstat B...H`.
- P1's appended bytes: exactly N = `1450`. The custodian computes N by §2.1 check 5's derivation at C and writes it here before this form is committed.
- One non-generated file in the PR. The form and PLAN.yaml are the custodian's, on main.
- Budget: 45 minutes (the node's). Past twice the budget, the node stops.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight
1. Any byte of ADR-035 at B changed, the Status line, the Acceptance section and the Note of 2026-09-25 included.
2. Appended text other than the §2.1 output, byte for byte: a rewrap, an added word, a pin, a path:line cite or a comment.
3. Any part of D1's item 2 (`:16`) in the appended text.
4. A merge before every clause the gate sends to the human has the human's typed answer, recorded as a class 5 amendment.
5. A path outside §2.3: anything under `protocol/`, or any other ADR or doc edited.
6. A line beginning `Status:` or `**Status:**`.
7. A line cite into `DECISIONS-PENDING.md`, a bare self-line, or a hash pinned at a branch commit.
8. A tool claim without the tool's commit.
9. The round-25 items, by name:
   - a §7 overrun not recorded as class 8, or §7 edited to match;
   - a scope addition not recorded as class 9, or its code landed before its amendment;
   - a `verify-mutation` run called an observation of a mutation;
   - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates
- Architect and reviewer, both from dispatch (§21a).
  - The architect reads each clause of §2.2 at B against the code it names, by reading. It re-derives each span by symbol and cites it `path:line @ <B> sha256:<H>`. It classifies E13's listing, reads each recorded answer of the human against its clause, and checks §8 item by item. The test facts recorded on clauses 2.10, 2.12 and 2.13 are the architect's to weigh under Evidence.
  - The reviewer checks the diff, re-runs the §2.1 script, recomputes every pin in this form and in the architect's report, and runs E1 to E15 by script.
- Verdicts are proportional:
  - A clause found untrue is a Correctness finding. It goes to the human with its code span and its test, and with no replacement words, because this is red-line text, outside §31. The new item 2 (D2) is graded the same way as every other clause.
  - The human answers in one of three ways. Accepted as it stands: recorded as a class 5 amendment, after which the finding no longer blocks. Their own words: the architect checks those words only, once, and a failure goes back to the human. Or the item is struck.
- Operator: none. No walkthrough row and no KNOWN-LIMITATIONS item.
- The merge is the human's click, by merge commit.

## §10. Amendments
Opens empty and is append-only, with classes 1 to 9. The human's answers on clauses the gate sends to them are class 5 and come before the merge.

## §11. OPEN items
| Item | Subject | State | Red line |
|---|---|---|---|
| OPEN-1 | the draft's note item 2, Decision 2's mint-race arm | answered by D2, item 1: D1's item 2 is replaced whole by the human's new words | yes: answered in the human's words |
| OPEN-2 | the form's location | `governance/forms/root/`, the draft's recommendation, taken under `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4 (the draft's filing note, 2026-11-11) | no |

## The custodian's settlement (class 1, before any code)

- **The carried text.** Everything above this section is the architect's revision (`state/consults/2026-11-11-adr-035-close-races-note-form-architect-revision.md`, read only at main 8e09470c; extracted sha256 a4a0895c377eaa106fc1d84d578e837400abb8c1ef9f18b30e7b54c52f91b72d), carried byte for byte from its fenced block, with two kinds of change, the custodian's: each `sha256:<H>` pin it wrote is filled by script with the sha256 of the cited whole lines, each with its LF, at 8e09470c (68 pins, 67 distinct ranges; a pin written from its colon takes the path of the pin before it); and `<N>` is written `1450` at its two places, by §2.1 check 5's derivation at 8e09470c. The template in §9 is not a pin and stays as written.
- **§2.1, run by the custodian's script at 8e09470c, writing nothing:** checks 1 to 5 pass, and the output is 1450 bytes with 8 line feeds. Check 6 is the worker's, at B.
- **OPEN-1** is answered in the human's typed words (`state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md`, item 1). **OPEN-2** (governance/forms/root/) was taken at the draft's recommendation on 2026-11-11, as the draft's filing note records.
- **The PLAN node.** Its gate is this form from this commit. Its title's last clause is reworded by the custodian to agree with the ruling: Decision 2's mint-race arm standing, where it said gone. Its budget stays the node's, an estimate and not a measurement.
- **Rule (00)** at main 8e09470c, `git diff --name-only origin/main...<branch>`: none of `cut/b1-shell-half-pr-c` (in progress), `cut/port-2-macos-l1-and-app-dirs` (in progress), `cut/b2-piece-1c-save-and-reopen` (PR #307), `cut/clippy-deny-warnings-workspace-12c` (in progress), `cut/pan-anchor-there-and-back-residual-diagnostic` (local worktree), `cut/pan-anchor-setcam-waits-for-its-own-reset` (local worktree) touches ADR-035. It is checked again at dispatch.
