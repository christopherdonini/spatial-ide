Question round 32 — 2026-09-30 (custodian → human). Node 3's premise correction: A4-1 to A4-3. Three items. Answered by the human's message at 18:11:07Z (the round-32 answers, state/directives/2026-09-30-round-32-answers.md) before anything was asked, so no AskUserQuestion was made and nothing was mirrored to Telegram. The 2026-10-02 weekly window becomes round 33. Source: the architect's drafting consult, state/consults/2026-09-30-publish-refusal-codes-architect-draft.md, sections 1 and 2. Drafted at 8cee33b as state/drafts/round-32-node3-premise-correction.md and moved here.

The premise. Round 31, item 2 (RULED 2026-09-30) placed "the kernel half (A4-1 to A4-4)" at position 3. Reading the code, only A4-4 is kernel work, and it proceeds under kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md. The other three are not kernel work:
 - A4-1 (a publish refusal's code is lost at execute): the code is dropped by one src-tauri line, frontends/shell/src-tauri/src/publish.rs's execute arm (ExecuteOutcome::Refused { message: e.to_string() }). A kernel-only fix would put a machine code into the publish-bundle CLI's stderr as well. The src-tauri fix calls the existing PublishError::refusal_detail(). It adds no code and no string. What the operator sees changes in one way: the refusal's label goes from publish-refused to its existing publish.* code, which the refusal block dispatches guidance on (today only publish.geographic_crs_not_publishable has guidance). The message text is unchanged.
 - A4-2 (every engine cause arrives as publish.engine): this is declared behaviour (protocol/skp/SKP-V0.md, the publish.engine sentence; B1's projection form). Any change mints codes or strings.
 - A4-3 (the pin phase answers with no code): the site is src-tauri's pin-phase arm (EnsurePinnedOutcome::Failed(e.to_string())), and no clause declares a code for it.
This is a correction of the premise, not a re-ask of item 2: the split stands, and the question is only where these three lines go and which codes they carry.

---

G1. A4-1's site.
  (a) In node 3, as its src-tauri line (Recommended). One line, an existing code, and round 31 item 2 says the shell hold does not cover bug fixes in src-tauri; R1-R6 apply.
  (b) In node 8, publish-attempt-lifecycle-src-tauri.
  (c) A new node.
  (d) Not fixed: the label stays publish-refused, and the gap is written into KNOWN-LIMITATIONS.

---

G2. A4-2's code.
  (a) Keep publish.engine and close A4-2 as declared behaviour (Recommended). No new code or string.
  (b) Nest: publish.engine: engine.<code>: ..., a new string in front of the operator.
  (c) Send the engine.* code directly, widening the shell's parser.
  (d) Mint per-cause publish.* codes.

---

G3. A4-3's code and site.
  (a) publish.engine, through PublishError::from(e).refusal_detail(), as one src-tauri line placed with G1's answer (Recommended). An existing code and string, consistent with G2 (a).
  (b) The engine.* code directly, with the parser change of G2 (c).
  (c) Leave it untyped, and add it to SKP-V0's list of untyped refusals on this seam (a spec edit).

---

Answered (the human's words verbatim; each has its RULED block in DECISIONS-PENDING.md):
 - G1: "G1 (a), fix A4-1 in node 3"
 - G2: "G2 (a), keep publish.engine and
close A4-2 as working as specified"
 - G3: "G3 (a), publish.engine through PublishError::from(e).refusal_detail(),
as one src-tauri line in node 3."
 - With them: "Node 3 closes when A4-4's PR and the A4-1 and A4-3 lines are done.
Portability R1–R6 apply to the src-tauri lines."
