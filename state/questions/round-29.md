Question round 29 — 2026-09-27 (custodian → human). Six items, in ask order. Items 1 to 5 are the stop items of the exposure-profile-paths piece (your round 28 items 1 and 2); its preregistration draft is state/drafts/exposure-profile-paths-prereg.draft.md. Item 6 is PR #128's KNOWN-LIMITATIONS item. For your information, not asked: #129 hit its own registered invalidator (main took AUTONOMY section 24 and Amendment 4 first), and the architect settled it by merge order. #129's sections become 25 and Amendment 5, restated in its PR body for the click.

---

1. How the pre-commit and commit-msg scan tells a real profile from an invented one (S1). The draft's matcher refuses any path of a drive, then Users, then a segment, and any 8.3 short form. It permits the public folder, placeholders (<…>, $name, %VAR%, …) and an explicit list of invented names (someone, someone2, x, josé, someuser). It always refuses the local profile's own name, read at run time. The architect found a second real account named in RELEASE-0.1.md's quoted verdict, which a local-name-only rule would let through.
  (1) The draft's rule: generic refusal, explicit allow-list of invented names, local profile always refused (Recommended).
  (2) Refuse only the local profile's own name.

---

2. Your verbatim words that carry a profile path (S3). Once the check lands, it would refuse to file them, as it would have for the 2026-09-25 cloud-hooks directive.
  (1) Filed with the profile segment redacted and a marked note; the rest byte-exact (Recommended).
  (2) Kept out of the tracked tree; the tracked record says they are held locally.
  (3) A named exception: the check permits them in state/directives/ and RULED blocks.

---

3. Two borderline files (S2, S4): entry 49's status prose in DECISIONS-PENDING.md (AUTONOMY section 22 classes the ledger's status prose as current-state, but your round 28 grouped the ledger with the immutable records), and the dated results sections of spikes/lod-feasibility/README.md (3 occurrences).
  (1) Leave both untouched, as immutable; the spike README gains only a pointer line (Recommended).
  (2) Reword both.
  (3) Reword entry 49's status prose only.

---

4. macOS and Linux home forms (S6). Your rider names the Windows Users root. The draft does not refuse /Users/<name> or /home/<name>.
  (1) Windows only, as the rider names (Recommended: this machine is Windows; the macOS and Linux hardware work comes later).
  (2) Also refuse /Users/<name> and /home/<name>.

---

5. A CI backstop (S5): a diff scan in CI would also catch --no-verify commits, unarmed clones and cloud sessions. It is a workflow change, outside round 28's ruling.
  (1) Proposed at the 2026-10-02 weekly window (Recommended).
  (2) Added to this piece now.

---

6. KNOWN-LIMITATIONS item 29 (from PR #128, which you merged): its wording still carries the DRAFT marker "until the human's sight at the PR". The release notes are to carry the same line.
  (1) Merging was my sight: remove the marker (Recommended if you read the line).
  (2) Not yet; I'll sight the wording separately.
