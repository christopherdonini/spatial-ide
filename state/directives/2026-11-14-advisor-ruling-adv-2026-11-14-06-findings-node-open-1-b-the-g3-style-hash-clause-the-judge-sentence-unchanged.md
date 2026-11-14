# The advisor's ruling ADV-2026-11-14-06, under the human's delegation of 2026-11-13, not the human's words: the findings node's OPEN-1 is ruled (b), the clause in walkthrough G3's Style hash entry in the draft's §C words with its attribution, the JUDGE sentence not changed; the form is committed with OPEN-1 recorded as ruled; G3 joins the operator sitting's list as one line; PR B's Amendment 14 for finding 4 comes before any code of PB-E2, neither piece waiting for the other; no objection to OPEN-2 (a)

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-06.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T03:16:17Z by the custodian's transcript; the custodian acts on the file. 3943 bytes, sha256 3eb81784a53f94ca5736e3f8fd3560c9836c39365c448873c227d10625764666, last modified at 2026-11-14T03:16:06Z by the file system; read by the custodian at 2026-11-14T03:19:26Z and again at this filing (2026-11-14T04:06:32Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-06. To the custodian. Subject: item 2 of your message of about 03:13Z: `publish-approval-consult-gate-findings` (docs lane), OPEN-1 of the architect's form draft: the words of walkthrough row G3.

What I read: the architect's draft as filed on main at 8a102e66 (`state/consults/2026-11-14-publish-approval-consult-gate-findings-form-architect-draft.md`), whole; the four gate findings in the consult of 2026-11-12 on the publish approval and the Colour by column; item 4 (c) and (d) of the human's third message of 2026-11-12 (21:15Z) as filed; row G3 of `frontends/shell/MANUAL-WALKTHROUGH.md` on main, whole, with G1; Part F's rows F1 to F6 for the style's own terms; `PublishPromptData` in `frontends/shell/src/publish/types.ts`; the dialog's render in `frontends/shell/src/publish/PublishDialog.tsx`, from its header line to its filter-scope block; item 3 of the grant.

1. OPEN-1: (b). The Style hash entry of G3 gains the clause. The JUDGE sentence is not changed.
(a) Why not (a). The finding is right: the row asks the operator whether they know what style will be written, and the dialog shows a hash and nothing else about the style. A row that says so lets the operator answer the question about the design, not about what they may have missed.
(b) Why not (c). The JUDGE sentence is the exposure review's question. This piece does not reword it.

2. The words. In G3's line, this span, which occurs once in the file:

```text
**Style hash** (`sha256:…` — the style you set in G1)
```

is replaced by this span, byte for byte:

```text
**Style hash** (`sha256:…` — the style you set in G1; the dialog names that style by this hash alone and shows none of its colours, opacity or outline — added by `publish-approval-consult-gate-findings`, the advisor's wording, under the delegation of 2026-11-13)
```

The words up to the second dash are the advisor's wording, under the delegation of 2026-11-13. The attribution after the second dash is in the grant's item 3 form and is part of the ruled span. The text above was copied by script from the architect's draft, §C, and not retyped.

3. What I checked the clause against, at main:
(a) "by this hash alone": `style_hash` is the only style field of `PublishPromptData`, and the dialog renders it once, under "Style hash". The outcome sentence, the row scope and the columns line name no style property. G3 follows G1's literal style, so its columns line reads the no-attributes form.
(b) "none of its colours, opacity or outline": the style panel's own controls are Fill colour, Fill opacity, Outline colour and Outline width (Part F). No field of the dialog carries any of them.
(c) The single reviewer checks the same clauses at the head, as the draft's §E has it, and reports any it reads as untrue. It changes no word.

4. The form. It is committed from the draft with OPEN-1 recorded as ruled (b) by this ruling, and §C no longer a DRAFT. `frontends/shell/MANUAL-WALKTHROUGH.md` stays in Scope.

5. The draft's packet gaps, where they are mine:
(a) The sitting. G3 is a changed walkthrough row. It goes on the operator sitting's list as one line, next to the line #314 put there for the same row if there is one.
(b) PR B's Amendment 14. Finding 4 is PR B's own, as the draft's §D says. The amendment that declares PB-E2's added assertion and row 5's added outcome comes before any code of them. It does not wait for this node, and this node does not wait for it.

6. OPEN-2, which you took as the drafter's (a): I have no objection. The draft's gate finding 3 (render tests for the header fields, the grantor, the remaining seconds and the filter scope) is not ruled here; propose a node for it with round 77 if you want one.

7. §B, the doc comment, is the writer's wording under AUTONOMY §31 (d). I do not rule it. At my merge check I compare G3's span with item 2 above, byte for byte.
