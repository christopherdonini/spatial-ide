Reviewed: the branch cut/windows-case-fold-non-ascii at f9496e56033038ab468ba3b92364aa17379535d7, over the base main 4b9fd558, in the read checkout D:/wt/read-1127a, with the diff file the brief named in the scratch folder. This is the custodian's filing note, 2026-11-27: the architect's build gate, node:windows-case-fold-non-ascii@build-gate-architect; its run, from its completion notices only (ADV-2026-11-26-02), 36 tool uses by its completion notice. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 10562 bytes, sha256 d87a8cd62fbe20ca1ce3397695ad274e5ed9fe4394be95ec1fa3e58ebb914f6d), byte for byte except the scratch folder's path, written <scratch> (1 place; 10463 bytes after it, sha256 401d031ac9e0196cf7c3cabdd3219e9b10a02428ccb1f1a4be8e12ef1768f0da). The places where the two gates' words differ are ruled in ADV-2026-11-27-13 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-13-the-case-fold-pieces-three-places-g1-for-component-eqs-doc-c1-whole-for-folds-doc-class-6-at-148-m1-at-t3-in-the-closing-amendment.md`).

---

**Verdict: PASS WITH NOTES.** I reviewed cut/windows-case-fold-non-ascii @ f9496e56033038ab468ba3b92364aa17379535d7, the diff file as briefed: sha256 5bbf593e104b24806bb7059a84161e745fbe43f0aa1259b2203d52357b3a5895. I could not recompute that hash because I have no shell. The file read as 206 lines.

Map onto AUTONOMY.md §22: Correctness PASS. Evidence PASS on my read; the reviewer runs the tests and observes the mutations. Documentation: two findings and one watch item, all to fix in this PR before the merge.

Every cite below is a line in D:/wt/read-1127a at f9496e56 unless it says otherwise.

## 1. Class and gates: hold
- **Diff size.** The diff touches only the two Scope files, kernel/src/permission/audit/normalize.rs and kernel/src/permission/audit/log.rs. The custodian's count is 145 (100+17, 26+2), against the declared 145. That is within §21c's ≤150 lines and ≤8 files, so there is no class 6 overrun. Amendment 1 item 12 estimated about 138, inside the declared figure.
- **No new surface.** The diff adds no dependency, no exposure surface and no user-visible string. OPEN-3 (A) governs the changed values interpolated into existing strings (see 3).
- **Gates.** guarantee: TOUCHED with the reviewer and the architect from dispatch follows from §36 and the settlement's guarantee bullet. That bullet reads the precedent of the 7a form's settlement (REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:101). It is the custodian's reading and goes to the human's review on return.

## 2. Guarantee: the claim holds, with one wording finding
- **fold (normalize.rs:213-226) matches the Change line as amended by pair 12.** It returns `to_uppercase` only when that gives exactly one character and `c.len_utf16() == 1`, otherwise `c`. Off Windows it is the identity.
- **component_eq (normalize.rs:199-201) maps both strings through fold**, so step 4 (normalize.rs:100) and the root strip (normalize.rs:181) share one rule.
- **is_inside (log.rs:397-401) maps both strings through the same fold.** Folding is per character, so the `starts_with("{r}/")` test on the folded strings is a sound component-prefix test.
- **The strip (normalize.rs:175-180) splits at a character boundary by construction**, and the head has as many characters as the root, so component_eq compares like with like. In the three cases (s has more, as many, or fewer characters than the root) the strip gives what the doc at normalize.rs:171-173 says. Off Windows, exact comparison over a character prefix equals the old byte-prefix result, so Linux and macOS outcomes are unchanged. T4 pins the exact-root case on every job.
- **Where fold departs from NTFS (N3).** My own Unicode reading finds no undeclared departure.
  - A single-character `to_uppercase` result equals the simple uppercase mapping, because Rust does not apply the conditional SpecialCasing rows.
  - Characters with a multi-character full uppercase and no simple mapping (ß, ŉ, ǰ, ΐ, the ligatures) stay unchanged, as NTFS leaves them.
  - So the only miss is (ii): the 27 small iota-subscript letters do not meet their title-case forms. The count of 27 in fold's doc is right for that miss. The range it gives (U+1F80-U+1FAF) also contains the 24 title-case letters, which stay unfolded on both sides and so do not depart. That is an imprecision that does not overclaim; I propose no change.
  - (i) and (iii) are declared. The BMP condition matches NTFS's per-UTF-16-unit table, so it is not a departure.
- **The Windows filesystem facts behind the doc are knowledge, not repository reads.** The sentences are fold's doc at normalize.rs:206, the T1 (d) comment at normalize.rs:404 and the test docs at normalize.rs:381 and log.rs:460. Only T2's first assertion observes a Windows filesystem fact: é and É name one directory, on the machine that runs it. See D2.
- **Finding G1 (Guarantee; Documentation class, must-fix).** component_eq's doc, normalize.rs:191-192, reads more broadly than the code. Its words "letters outside ASCII included" cover supplementary-plane letters and the iota-subscript letters, which fold leaves unchanged. The link to fold keeps it from being untrue, so I class it as Documentation, not Correctness. It is a worker's doc comment, not the human's wording, so the worker applies the words below with no re-gate and the PR body lists them. Two inserted lines are replaced by two, so the §21c count stays 145.
  - Old (occurs once in normalize.rs), verbatim:
    `/// Path-component comparison: case-insensitive on Windows (letters outside ASCII included, through`
    `/// [`fold`]), case-sensitive elsewhere.`
  - New:
    `/// Path-component comparison: case-insensitive on Windows as [`fold`] folds, letters outside ASCII`
    `/// included and with the departures from NTFS its doc declares; case-sensitive elsewhere.`
  - Each clause checked against the code:
    - "case-insensitive on Windows as fold folds": component_eq maps both sides through fold (normalize.rs:200).
    - "letters outside ASCII included": fold's Windows arm upcases any BMP character (normalize.rs:216-218).
    - "the departures from NTFS its doc declares": (i)-(iii) at normalize.rs:208-212.
    - "case-sensitive elsewhere": the `not(windows)` arm returns `c` (normalize.rs:222-225).
    - An operator cannot see this sentence in the shipped app; it governs what a maintainer reads.
- **Note G2 (Guarantee, no change owed).** Step 3 still orders roots by byte length (normalize.rs:87), but under fold two roots that fold equal can differ in UTF-8 width (ⱥ/Ⱥ, ı/I). The wrong order needs profile variables that spell one prefix in different non-ASCII case, with a width difference larger than the suffix between them. Windows does not set them that way. The only consequence is a less specific token, never a leak. If wanted, a follow-up can sort by `chars().count()`. Here it would move the count past 145 and need class 6.

## 3. ADR, security, wire: none, as declared
- **ADR and security.** The diff has no ADR status line and no amendment. Nothing in it falls under ADR-020, ADR-009 or ADR-021, which is §21a's own definition of security posture. ADR-024 and ADR-017 §13 say nothing about the case policy.
- **Wire.** No SKP, data-plane or MCP surface is touched (docs/02, docs/10).
- **Operation class (ADR-006).** Normalization stays a pure function. is_inside, a guard on the class-3 path, refuses more case variants and never fewer.
- **Redaction posture.** The record's normalization is tightened only. The same normalize_destination also fills existing strings: BoundaryError::OutcomeNotAudited (boundary.rs:172), DestinationScope::describe (grant.rs:175-178) and the AuditError paths (log.rs:130-152). Their values now show tokens where a non-ASCII case variant used to leak. No string is new; this falls under OPEN-3 (A). N5 names only the record; the closing amendment may say so in one reference.
- **Seams.** log.rs calls fold, a `fn(char) -> char` declared `pub(crate)`. Its product callers are normalize.rs:200 and log.rs:399-400, so no item exists only for tests. T2 drives the real `resolve_destination(&Path) -> Result<PathBuf, PermissionError>` (grant.rs:194) into normalize_with, from the real shape.

## 4. Red lines: none crossed
There is no Cargo.toml change, no `unsafe` and no OS call. Exact parity with the OS is not taken.

## 5. Portability: holds
- **normalize.rs.** Product code has two OS cfg sites, fold's `#[cfg(windows)]` (normalize.rs:214) and `#[cfg(not(windows))]` (normalize.rs:222).
- **log.rs.** Product code has one, is_inside's `#[cfg(windows)]` (log.rs:397). The new `cfg_attr(not(windows), ignore …)` attributes sit inside `#[cfg(test)] mod tests`, which cfg-boundary.mjs drops (its line 12 comment). The counts are 2 and 1, as Amendment 1 items 5 and 8 pair 3 pin.
- **Ignore reasons.** T1, T2 and T3 carry the filesystem-case-policy reason, and T1's equals case_differences_collapse_on_windows' reason (normalize.rs:374), as pair 1 requires. T4 has no cfg_attr and runs everywhere.

## 6. Documents
- **Scope as settled.** kernel/README.md is untouched (OPEN-5 (a)). The residuals are declared in fold's doc only (OPEN-6 (a)).
- **No document now says something false.** kernel/tests/case_policy_volume.rs:7-8 says the kernel folds ASCII case on Windows only. That is now incomplete but not false, and it is outside Scope: no fix is owed here, and a docs-lane note is optional. KNOWN-LIMITATIONS and kernel/PERMISSION-BOUNDARY.md:300-310 still hold.
- **D1 (record, must-fix in the closing amendment).** By the code, M1 must fail T3's first assertion, because is_inside now maps through fold (log.rs:399-400). The form's M1 predictions name only T1 (a) and T2. Record it as a class 2 deviation (docs/PREREGISTRATION-TEMPLATE.md:106-109), on the reviewer's observation; the prediction is not edited. Draft row (custodian's words to adopt or replace): "M1 also fails T3 `kernel/src/permission/audit/log.rs::tests::a_log_under_a_non_ascii_case_variant_of_the_destination_is_refused_on_windows`, first assertion, unpredicted: is_inside maps both strings through `fold` (the Change line). Class 2; the prediction stands." Recording it in T3's source doc instead would add a line and take class 6.
- **D2 (Evidence watch for the closing amendment).** The settlement says the NTFS facts in N3 are proven by the piece's own runs. They are not:
  - only T2's first assertion observes the filesystem, for é/É;
  - T1 (d), (ii), (iii) and (i) assert fold's output, not NTFS's.

  The closing amendment must not discharge the N3 NTFS facts as proven. If it does, that is an Evidence failure under the discharge-claim rule.
- **D3 (record).** In the closing amendment, cite the test text by name and full commit id. Do not hash-pin it at branch commits f13dbd87 or f9496e56 (round 15 (e); round 25 item 2). I cannot see whether the RECORDED MUTATION lines came from a verify-mutation run. If they did, the word "observed" is wrong by name; the reviewer's own observation settles it.

## Scope and roadmap
This is the filler queue's entry 1. It adds nothing beyond Amendment 1 item 12's declared class 9 addition, and it makes no performance claim (docs/08). No missing decision, so no ADR is drafted.

Files: D:/wt/read-1127a/kernel/src/permission/audit/normalize.rs, D:/wt/read-1127a/kernel/src/permission/audit/log.rs, D:/wt/read-1127a/governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md, <scratch>/cf-diff.txt
