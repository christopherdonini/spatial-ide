# KNOWN-LIMITATIONS item 47: the redaction search's 3-byte name floor, one sentence added to the item's end in the human's words of 2026-11-12 — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece the human placed in their message of 2026-11-12 (21:15Z), item 7, third in the docs lane's order after #308 and item 3 (b) (item 8), both merged. Drafted by the custodian.

```
Authority: PLAN node known-limitations-item-47-name-floor-sentence; state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:33 @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:0c7eca9a9f645a7b64d6c0ed01fd617e0945959a4d37b21649b9e63300b59399, the human's approval of (A); the order at state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:35 @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:55eda56a61c43653d89768668393f23cca6096c2d7af0228b902daeecbb6c4a8; (A)'s words at state/consults/2026-11-12-known-limitations-redaction-name-floor-check-and-draft.md:17 @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:9a3c30d3c27678f66e8f7f3dcf601253b85a6bd1eac36e683f25089923469330, the text after the quote marker, the human's by approval; KNOWN-LIMITATIONS items as disjoint paths (rule (00a)).
Scope: KNOWN-LIMITATIONS.md (item 47 only: one sentence added to the end of its last paragraph, and one source comment line after it; no other item edited, no renumbering); 1 file; declared line budget <= 3 changed lines by §21c's counting, this form excluded. The node's PLAN record goes to main by the records commits (ruling (21)), not in the PR.
Change: item 47's last paragraph, the line that ends with its 12-character sentence, gains one space and §A's sentence at its end, byte for byte; directly below it, at the item's indent, §B's source comment on one line, each pin found at the base by the content of the lines §C names and computed there. Nothing else changes.
Tests+mutation: none added or changed (documents only); the single reviewer checks the sentence byte for byte against the consult's line 17, each pin by recomputation, each clause of the sentence at the head against the code §B pins, and that no other line changes; it reports any clause it reads as untrue at the head, changing no word.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; the sentence's words are the human's own; the redaction search's behaviour is unchanged.
```

### §A. The sentence (the human's words by approval, byte-copied from the consult's line 17 after its quote marker)

```text
Your login name and this computer's name are searched for only when each is at least 3 bytes long, so a shorter one, such as a two-letter computer name, is never searched for, and a bundle that contains it is not refused.
```

### §B. The source comment (the custodian's words, not the human's; applied under AUTONOMY §31(d) and listed in the PR body)

Each `<Pk>` is `path:a-b @ <base> sha256:<hash>` (or `path:a` for one line), computed at the build's base.

```text
    <!-- The last sentence is the human's wording, approved in their message of 2026-11-12 (21:15Z), item 7 (state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:33), as (A) of the custodian's draft (state/consults/2026-11-12-known-limitations-redaction-name-floor-check-and-draft.md:17). Where the code does this, at the base: <P1> (login names, each kept only at 3 bytes or more); <P2> (the floor stated for computer names); <P3> (`COMPUTERNAME` and `HOSTNAME` under it); <P4> (the machine's own name, read only when neither gives one, under it). -->
```

### §C. The pins' lines (at 8c693657; each found once at the base by its whole lines' content, each with its LF, or the build stops)

| Pin | Path | Lines at 8c693657 | sha256 there |
|---|---|---|---|
| P1 | `kernel/src/bundle/redaction.rs` | 131 | 3e07633eaf36f735f565535e85fd0d3cf388699cb565d578f051cf40142b4e53 |
| P2 | `kernel/src/bundle/redaction.rs` | 148-150 | 69050030eb8b5593cfb174538acf281981103187375d329469057388bdc8401e |
| P3 | `kernel/src/bundle/redaction.rs` | 158 | 5251aeb64b210131178fa88d582f67b4d8e80eb07c3581658412b9586236298d |
| P4 | `kernel/src/bundle/redaction.rs` | 166 | 993091ebbb7abfde9d9c7b80edd730c59be254bf333def951008d0d0c6dfc7f0 |

### Settlement

- **Route:** the five-line form under §21c (one file, at most 3 changed lines); the single reviewer gate under §21b, from dispatch.
- **Rule (00):** of the in-flight branches at this form's commit, only port-2's (`cut/port-2-macos-l1-and-app-dirs`) touches KNOWN-LIMITATIONS.md, in items 1 and 43; item 47 is its own path (rule (00a)), so the paths are disjoint.

### Amendments

*(Opens empty; append-only.)*
