# KNOWN-LIMITATIONS: the open's first look, partial and unsaid, as a new item in the human's words of 2026-11-12 — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece the human placed in their message of 2026-11-12 (21:15Z), item 3 (b), second in the docs lane's order after #308 (item 8). Drafted by the custodian, ahead of #308's merge; the change is made after #308 merges.

```
Authority: PLAN node known-limitations-first-look-partial-view; state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:15 @ a747986103f82faa8f85b6b6ae2ea90881f1739e sha256:9ba7e478438eb7a5af67e716a49f5e232bbd4629165bfb111b87c512c298a9b8, the item's words between its quotation marks, the human's by approval; the order at state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:35 @ a747986103f82faa8f85b6b6ae2ea90881f1739e sha256:55eda56a61c43653d89768668393f23cca6096c2d7af0228b902daeecbb6c4a8; the OPEN-C consult's draft and its clause check at state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md:81-87 @ a747986103f82faa8f85b6b6ae2ea90881f1739e sha256:040745ec45901ffb20d2485d4a99bb557379671931860ecf63a248663d34265f; KNOWN-LIMITATIONS items as disjoint paths (rule (00a)).
Scope: KNOWN-LIMITATIONS.md (one new item, after the last item at the build's base, in the section On main since v0.1.0; no other item edited, no renumbering); PLAN.yaml (this node's record); 2 files; declared line budget <= 3 changed lines by §21c's counting, this form excluded.
Change: the file gains a blank line and §A's two lines, built by script at the base: the item's number, the highest item number there plus one; the human's words between the quotation marks, byte for byte, in bold as each item's first sentence is, with no body line; and §B's source comment, each of its pins found at the base by the content of the lines §C names and computed there.
Tests+mutation: none added or changed (documents only); the reviewer checks the words byte for byte against the directive's line 15, the number against the base, each pin by recomputation, each clause of the item at the head against the code §B pins, and that no other line changes; it reports for the human any clause it reads as untrue at the head, changing no word.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; the item's words are the human's own; the item's withdrawal is open-first-look-fills-fit-view's, at its merge (the same line 15).
```

### §A. The item (`<N>` is the next free number at the base)

```text
<N>. **After a file opens, until the first pan or zoom, the map shows at most the first 10,000 rows the file returns, and the status line says nothing about it.**
    <!-- §B, on one line -->
```

### §B. The source comment (the custodian's words, not the human's; applied under AUTONOMY §31(d) and listed in the PR body)

`<N-1>` is the item before; each `<Pk>` is `path:a-b @ <base> sha256:<hash>`, the form the file's other comments use.

```text
<!-- The human's wording, approved in their message of 2026-11-12 (21:15Z), item 3 (b) (state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:15); the number is the next after item <N-1>. open-first-look-fills-fit-view withdraws this item when it merges (the same item 3 (b)). Where the code does this, at the base: <P1> (the open's fit moves the camera and reports no viewport); <P2> (tile planning starts at the first viewport report, a real pan or zoom); <P3> (Zoom to layer reports one, so it counts as a zoom); <P4> (the untiled first look's row limit, 10,000); <P5> (that query has no filter and no order, so its rows are the first the scan returns); <P6> and <P7> (the residency status is not set until a plan has run); <P8> (the status line shows the residency status only when it is set). Not covered: an Apply or a Clear, which the reading behind this item did not reach. -->
```

### §C. The pins' lines (the OPEN-C consult's clause check, at 6cfea93b; each found once at the base by its whole lines' content, each with its LF, or the build stops)

| Pin | Path | Lines at 6cfea93b | sha256 there |
|---|---|---|---|
| P1 | `frontends/shell/src/canvas/WorkingCanvas.tsx` | 1424-1434 | 4e950f29d68ce12589f5617a916ac2e9337fff10604903513f53a4b24d4ea171 |
| P2 | `frontends/shell/src/residency/candidateArmSession.ts` | 68-79 | e7e4aa820d641c06a5f284b14633bb1da287ea409735caa677ecf13a85a2a320 |
| P3 | `frontends/shell/src/canvas/WorkingCanvas.tsx` | 1593-1608 | db124d8ee357eca7b6e7f5a1cf1b9379183a438dee3e598a968be1a266b30274 |
| P4 | `frontends/shell/src/canvas/tileGridConstants.ts` | 185 | 61c4f5a8d589f14a8f542eb00fe28e216fb08f39d63081b68417f3e95da2996b |
| P5 | `engine/src/stream.rs` | 1718-1725 | 15d970a4039ffe0e07a53040cf8825598908bd8305f965ae76f7f51c6f620515 |
| P6 | `frontends/shell/src/residency/residencyStatus.ts` | 330-336 | 3d84bc8cf37f351430d098d1e8748565cb62683776c6a13afb70d34299d28400 |
| P7 | `frontends/shell/src/residency/candidateArmSession.ts` | 839-845 | 57c9a2f7bc7220a4d4595b915d54d2d0c1d9ebb6505c0f53010e0c5c42f2e646 |
| P8 | `frontends/shell/src/App.tsx` | 2418-2423 | 1cb373bcf44931cb824ae02f0dd5f2be90a9656d2659e5630c562da0a9a1ae07 |

At this form's commit (a747986103f82faa8f85b6b6ae2ea90881f1739e) each is found once, at the same lines; at #311's head (e0ed07e2) P1 and P3 sit two lines lower.

### Amendments

*(Opens empty; append-only.)*
