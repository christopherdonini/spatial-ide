# Directive — the ADR-021 Note accepted; Fable's sightings of A2-1's preregistration draft and B-1's proposal (the human, verbatim)

*Custodian's filing note (2026-09-29): the human's message received after the 07:40Z ledger entry, sent as typed text. It holds the human's ruling on the ADR-021 Note drafted in `state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md` §2c, followed by Fable's sightings of that draft and of `state/drafts/b1-p0/B1-P0-AND-PROPOSAL.md`. It is recorded verbatim below the rule, as received. Cited as "the 2026-09-29 sightings", with its paragraph names. The commit that files this directive is the `<sight>` that Fable's A2-1 paragraph asks Amendment 12 to carry.*

---

HUMAN RULING 2026-09-29: the ADR-021 Note in state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md §2c
("a column that is not addressable is excluded from the namespace by name") is accepted as drafted. It
lands on main with the ADR-023 amendment text, after Fable's sighting and before any code.

Fable's sightings, 2026-09-29.

A2-1 (state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md): SIGHTED. The OPEN points are ruled as
recommended, with one addition.
- (a) Use the full bound name, with U+0000 JSON-escaped. known_columns lists it; candidate_columns
  omits it.
- (b) skp.projection_column_name_not_addressable, with fields column and detail. The name describes
  the property the positional comparison detects, not today's mechanism. Geometry at open uses
  engine.geo_metadata with a true detail.
- (c) The covering is in scope: it is a use by name, which my "every use by name" covers. Drop it at
  open, as recommended:
  - the open succeeds;
  - a bbox query refuses engine.no_covering_bbox before any lease, with a true detail;
  - describe reports a usable covering.
  k3 stays out. File it as its own proposed node, and grade it by whether it breaks a stated clause.
- (d) A native id\0x takes the session tier. When a real id sits beside it, the dataset is native on
  the real id.
- (e) Class 9 on B1's form, as drafted: one contract for one surface. After this, nothing more is
  added to B1's form before B1's close.
- (f) It is a Note, following the 2026-09-24 precedent. Because it is appended to an accepted ADR, it
  lands on the human's typed acceptance, given above.
- (g) No new wire member. My "projectable and filterable facts" meant the two admission outcomes, not
  two fields. O4 holds, with filterable_column_type as the single site.
- Addition, as §8 item 34 with a test beside N-1: every engine message, detail and log line renders
  U+0000 as a visible escape, never as the raw byte. A raw NUL truncates C-string consumers and log
  pipelines.
- Fill <sight> with this directive's filing commit. A2-1 may proceed to code once the docs commit
  lands.

B-1 (state/drafts/b1-p0/B1-P0-AND-PROPOSAL.md): SIGHTED, with the points below. Write the full-form
preregistration against them.
1. Rule 6: admit (6ii), declared.
   - It is the same conversion as (6i): the literal becomes its nearest value in the column's float
     type, and the stored value is never changed. That is the admitted class's own definition.
   - Refusing only integer literals above 2^24 or 2^53 would put an invisible cliff beside an
     admitted 0.1.
   - The Decision 6.3 Note states that the comparison is made in the column's float type, so values
     at the boundary can compare equal.
   - Pin it the way E-20 pins (6i): a test that f32 = 16777217 matches a stored 16777216.
2. Bounds: 20 digits and MAX_DECIMAL_LITERAL_SCALE = 18, as proposed. They are simple and sound for
   mixed lists, and what they refuse beyond the exact bound is negligible. The binder-agreement pin
   includes these boundary literals:
   - 18446744073709551615, 18446744073709551616 and 99999999999999999999 (all admitted);
   - 100000000000000000000 (refused);
   - their negatives;
   - scales 18 and 19 against UBIGINT.
3. Mechanism: accepted. The engine's type walk runs over the admitted tree after the surrogate
   prepare, pinned by the test-time binder-agreement test. State §11 (a)'s INTERNAL-error observation
   as holding at v1.5.5.
4. Arithmetic: NOT 5a. Refusing integer arithmetic would refuse density filters such as
   population / area on the int64 columns pandas writes by default.
   - `/` is declared floating-point division: admitted for any numeric operands, with a DOUBLE result.
     The Note states that its operands convert to DOUBLE, so 64-bit integers beyond 2^53 round. The
     float semantics belong to the operator; they are not an implicit coercion.
   - Any other conversion inside arithmetic follows §3's rules. Integer-with-DECIMAL arithmetic is
     therefore refused (a conversion that can fail), and integer-with-float follows rules 5–7.
   - Same-type integer overflow (u8 + 1, or unary minus on a signed minimum) involves no conversion,
     and no type rule can predict it. It leaves B-1 (5c) for its own node, merged with W2-B's
     observation 2:
     - an evaluation failure ends the stream with a fixed, engine-authored detail that carries no
       file values and no SQL;
     - that node's strings go to the human;
     - until it lands, the campaign's leak assertion excludes exactly this class, named in the test.
     The overflow values come from rows in view, in a file the client can already query. That makes
     this hygiene, not confidentiality.
   - ADR-021's arithmetic set is therefore unchanged, and needs no typed text.
5. Refusal: 6a, a twelfth code. Drop the arithmetic-overflow reason, since B-1 no longer refuses
   overflow, leaving four reasons.
6. The human's typed texts go together, once the full form is drafted:
   - the Decision 6.3 Note: the refused class, and the admitted class including the nearest-float
     literal and the declared `/`;
   - Decision 8's twelfth code;
   - the four reason strings, for sight.
- §9 stays as routed. TRUE and FALSE stay refused as CAST, and no upstream report is filed for now.
- A2-1 and B-1 both bump the protocol literal. Each takes the literal after main's at its own merge.
