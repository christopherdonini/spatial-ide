# skp.filter_identity_alias_ambiguous reached through SKP, and the two texts that call it unreachable corrected
# (PLAN node filter-identity-alias-ambiguous-reached-through-skp)

File: kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md
Authority:
- the node: PLAN.yaml:4369-4385 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:a59a33c3fae6ec2c8b5a3693f853380582d206a72716bda97836f70ac794a4e4
- the placement, slot 2 after the flush piece: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:b9d820912b82dca112a33a3ef86fa8a9cad3f81b4a709b07886834be56a62e6b
- forms ahead: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:2eba54a30650266443f7bfd35cb1581b050063d7db93623b0ad2b648a7d92c4d
- the directive has a RULED block in DECISIONS-PENDING.md
- the finding: state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md:16-21 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:cf6aa432293644204017c61f987e7ca7a4868b26f648b4ca30aa890cfc7f98d1
- the custodian's check of it: state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md:32-45 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:a618410229e0dd584b44c125d3aef199a44de085e63a6253097cb422aa31b745
- the check's answer to the human's area C instruction 1: state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md:118-129 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:36f8a1541a0bbddd63939a1144b77256cd5e86d0badba07edfbb34bfb0451c61
- the sibling-search default: AUTONOMY.md:215 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:5fc1d41f0bad9f276ad4b4c845d4d5ddcdf9af27c467ade5ae83e626387cd2c1
Drafted by: the architect agent. Inputs:
- lead-data's impact read, state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-impact-read.md (whole-file sha256 4c5d3919ef66c31a0eb32a90d3390ed72e8051ad637971b283d2fdfcaf658268). It is an input, not Authority.
- the custodian's reuse-index output (0.7).
Code was read at main d9bdc3a0.
Committed before any code. No code starts before stream-flush-cancel-exit-marks-producer-cancelled has merged. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, the wire: an edit under protocol/skp/**; §25(e)). See 0.8.
Pins: every pin is a historical pin at d9bdc3a0.
- The flush piece edits engine/src/stream.rs, engine/src/trace.rs and engine/README.md. No pinned code line here moves before this piece.
- If skp-v0-live-sections-current-area-c lands first and moves §7.5's lines, the worker re-derives the paragraph by section.
- The pin stays authoritative for what it recorded. The tree is authoritative for the text the piece edits.

## §0. Disclosure

0.1 The route from the product to the refusal (the finding, re-derived at d9bdc3a0):
- open_dataset's identity is host-minted: kernel/src/skp.rs:1119 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:e3113cbb49b8f47eb8f5955b3db07c6507eea6590262dbc7bd58ed26eb3eeb96.
- It is minted with uniqueness always verified, because the wire has no skip field: kernel/src/skp.rs:1656-1668 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:88f5ac7c52de30f59845270daae05b284050cadce53a129291e1bdcd9d9a40ce.
- It is passed to the catalog: kernel/src/skp.rs:1174-1176 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:93f5dd4102eecfef3b126d4c9562f19b63b2c2629abbdfe3c53d967df2545541.
- The catalog passes it to the engine: kernel/src/lib.rs:202-219 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:e0768faecf854f9370f48a60b0f11a6d2c30f21ef846b3073a2b32ff6dd279da.
- The engine makes it IdSource::Mapped: engine/src/dataset.rs:1714-1726 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:062b4aa1b8b3e73772e230dfe2dfb2edd0e81752aa1f0f0eb2f3e2783194efc7.
- The rule: engine/src/predicate.rs:1117-1129 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:c2d4e3f1abd06fe4eaa80ec75fbe93521a938a26cb7aecd31d2ab4c65f32812a. It tests only that a field named id is present, not its type: engine/src/predicate.rs:1120-1125 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:6d39253902bb04e7d5e54967ef80d35a74a6f76971d2583f40fb0c20be8d4a76.
- The check runs first for each referenced name: engine/src/predicate.rs:1166-1174 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:4c51c99384dcf2de180b27e3d93465a690b74aa005253dbc4a634d54f4a5b84b.
- It runs before any lease or mint: kernel/src/skp.rs:1839-1842 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:cabddc97912bed4e416307eab338ae75e3c9ba3d2678e7407676163d05fa626f.
- The wire mapping: kernel/src/skp.rs:2248-2258 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:10091b420d532d3c68a40c222f0abf1b8536b4f43f77e6d1e5f234bfe81ee0e7.

0.2 What pins it today.
- The only pin is a kernel unit test that builds the variant and maps it directly: kernel/src/skp.rs:2799-2810 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:c159f4cb9e4af5fdfb0f61e5066c31260d7e3a7f732a5c60efc43e6027b6fcd5.
- A grep of kernel/tests at d9bdc3a0 for skp.filter_ finds three codes: unknown_column, type_not_admitted and column_not_filterable. This code is not among them.
- The X3 case opens the alias shape through the catalog with skip_uniqueness_check set, and sends no filter: kernel/tests/skp_projection.rs:1217-1238 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:e57583e50cc668b2e528a5363496fe61bbc03d5159c2626c99748613554789b0. It is not the wire route, and this piece does not use it.

0.3 The two texts that call the code unreachable:
- protocol/skp/SKP-V0.md:485-488 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:e003ce7973a5124b914c7fe79d2b17865dfdc185e93c1f7f86d1479ab432cf40
- engine/src/predicate.rs:1111-1116 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:55af22bffeee44d51d0cdcc3be98da806f36dc55c5b691bcc84ad2799fc3585a

0.4 The product sequence in the shell, by reading and not by a run.
- engine.identity_unusable opens the identity form: frontends/shell/src/admission/AdmissionPanel.tsx:25-29 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:ce0c8dc4ab97614dbe1a0e4670c6116960e05fb7d251fc8bcbd16852ce0b2e1d.
- The form offers the 64-bit candidates and a free-text route: frontends/shell/src/admission/IdentityDeclarationForm.tsx:75-97 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:53419a5525ddf37c9599d577a85d0778679de04b4a01f51f2f01eb10f0beed14.
- The candidates are the Int64 and UInt64 columns only: engine/src/identity.rs:297-313 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:00334befa0cd36cbaab55c0af1041c8b0ecaf1ad888451639a42d3bc33f00a76.
- The shell's Tauri commands call SkpHost::open_dataset and SkpHost::viewport_query with the wire's typed requests:
  - frontends/shell/src-tauri/src/commands.rs:57-65 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:163669952b348e04d85059579c93cc62953dc5bfd4b5a3b795e10cc31d9b1c3f
  - frontends/shell/src-tauri/src/commands.rs:87-95 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:4b7aa19d390c8deb541c0e3d0c6c91e746425350b4de311fcaada5d4ec8bc1b1
- A refused filter is formatted generically (frontends/shell/src/App.tsx:317 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:815102d8cdfdecb2034b4d8ba1e7219bc63564d49a501940a265a74b67158a3f) and rendered by RefusalBlock (frontends/shell/src/filter/FilterPanel.tsx:132-134 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:25cb94b90f1849d782975f552b034dd605bc61c928403b6613903e5a6049ea78; frontends/shell/src/admission/RefusalBlock.tsx:24-43 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:89f537fa5e013cee2d40fb128fe3431c68ea369dd16306f6f9836bb88e3d943c).
- There is no code-specific guidance for this code: frontends/shell/src/admission/formatRefusal.ts:144-145 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:9e52e5add7d2f0624a5f203c007a991ebf9168b44cd323ef6368e1156430e9f8.

0.5 Governing ADRs (both Accepted), cited and not amended:
- ADR-016 §3, the declared mapping: docs/adr/ADR-016-stable-feature-identity-admission.md:64-69 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:1be77e2b826913b0e757614de6db4ac04cf0309520e93e3718c843d2efbd5325
- ADR-021, the Related line tying the alias refusal to §3's Mapped identity: docs/adr/ADR-021-row-filter-on-viewport-query.md:22-24 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:9753e1428015ed1cbe26d3bee916165ff45d187262f37294dd328ffc877f84e1
- ADR-021 decision 5: docs/adr/ADR-021-row-filter-on-viewport-query.md:71-74 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:711c75275554c21811567a9f95cd638f819ec73758c2a211c1b684706d4e6212
- ADR-021 decision 8: docs/adr/ADR-021-row-filter-on-viewport-query.md:93-99 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:7af90195b84d0aa5d49edcb52a0b16023054871ff72a85964439b2bca931a293
- ADR-004's control plane carries the refusal. Nothing on the data plane changes.

0.6 Hypothesis, labelled. The claim that the code became reachable with the admission-remediation cut rests on two things, not on a run at that commit:
- the cut record: state/cut-archive/CUT-STATE-admission-remediation.md:1 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:c20b10de902594c1679b973dab5a27f651062baa2a2b663b481d456845526b15;
- the check's commit reading (0 Authority, the check's finding 2).
The discriminator would be a run of T-1 at 16091f9. It is not made, and §1 does not claim it.

0.7 Reuse index (the human's standing step). The custodian's node tools/reuse.mjs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c recorded no prior art for identity alias, ambiguous column, typed refusal or filter refusal. Noted, not blocking.

0.8 Gating route. The edit to protocol/skp/SKP-V0.md is in §21a's wire category (AUTONOMY.md:323-324 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:90dd5aaa322e44946970eecb24134b69e410c15e357bfa9cdd5ef5c4459bca59). So the full form and both gates apply from dispatch (AUTONOMY.md:482 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669). The size (§7) is under §21c's bound.

0.9 Budget. The node declares 60 minutes. If the full form and two gates exceed that, the custodian records the deviation in PLAN. It is not a §7 figure.

0.10 Fixture drive: no measurement, and the 5 GB fixture is not used.

## §1. May and may not claim

- May claim, by T-1 and its mutations:
  - Through SkpHost, the same two methods the shell's commands call (0.4), a declared identity on open_dataset over a file that carries its own id column yields a Mapped identity.
  - On that dataset, a viewport_query filter naming id is refused synchronously as skp.filter_identity_alias_ambiguous, with exactly the fields column = id and source_column = the declared column. No ticket is minted.
  - M-1 and M-2 as observed.
- May claim, by reading the code: the rule tests the presence of a field named id, whatever its type (0.1).
- May claim, as a record fact (0.6): the code became reachable when the admission-remediation cut threaded open_dataset's identity into the engine.
- May not claim:
  - that the shell's rendering of this refusal was run. It stays by reading (0.4; OPEN-1).
  - anything about an e2e or walkthrough step;
  - any other code's reachability or coverage (§2.5);
  - any performance figure or docs/08 row;
  - any change to the engine's message, which is unchanged: engine/src/predicate.rs:338-343 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:bd41792b1a4079ec07d5e0f7d74ca4ba098a68ef684ad329bdaa71599c842f8d;
  - a reachability date or commit beyond 0.6.
- No ADR is amended. There is no wire literal or field change, no protocol fixture, no §8 change-log entry and no version bump. There is no user-visible string, no new pub item and no dependency.

## §2. The change

2.1 kernel/tests/skp_admission_remediation.rs: one new test, T-1 (§4). No product code changes.

2.2 protocol/skp/SKP-V0.md, §7.5: the paragraph at 0.3 is replaced in place. This follows the human's in-place pattern for a live section that is false against the code (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:30 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:465e0f89bdfacc7420768081a66998c35112b93370dbb6eac84fef5cc13d5d16). §§1–7 are the live description (protocol/skp/SKP-V0.md:543-546 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:e5b423c4a697d4d3f1b19b4da89f1380c98157515c2eefcfc3899ef2b06e1f64).
- The rejected alternative is an appended correction that leaves the false sentence standing, as in §7.2's precedent (protocol/skp/SKP-V0.md:382-394 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:b30af02ab64c19ab0159a7523335b2e1d8d21e1d3cc53025aef37d65710f8757). The live section would then go on stating something false.
- The declared text is this form's own. <T-1> is T-1's final name, and <date> is the commit's date:

```
`skp.filter_identity_alias_ambiguous` is refused when the dataset's identity is mapped from a
column other than `id` (ADR-016 §3; `open_dataset`'s `identity`, §1) and the file also carries its
own column named `id`, whatever that column's type: a predicate naming `id` cannot say whether it
means the wire identity or the file's column. Any client that declares an identity on
`open_dataset` for such a file reaches it; proven through the host by
`kernel/tests/skp_admission_remediation.rs::<T-1>`. *(Corrected <date>: this paragraph called the
code unreachable from any product entry point. That stopped being true when the
admission-remediation cut (`skp/0.2`) threaded `open_dataset`'s `identity` into the engine.)*
```

- Nothing else in SKP-V0.md changes. In particular, the §7.5 heading's count stays: the skp/0.8 dated note keeps it as it is (protocol/skp/SKP-V0.md:490-493 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:2cc19b67758d18e8ad0cff97a6fe30e4d04f8a6a447ac96b87420202f68eaa39), and it is outside this node.

2.3 engine/src/predicate.rs: the honesty note at 0.3 is replaced inside identity_alias_ambiguity's doc comment. No code line changes. The new note has no intra-doc link to a kernel item and no path:line. Declared text:

```
/// **Reachable from the product** (corrected <date>). `open_dataset`'s `identity` reaches
/// `Dataset::open_cancellable` as a declared identity, which `admit_identity` makes
/// `IdSource::Mapped`; on a file that also carries its own `id` column, a predicate naming `id` is
/// refused here. Proven through SKP by `kernel/tests/skp_admission_remediation.rs::<T-1>`. The note
/// this replaces said no product entry point constructed a `Mapped` identity; that stopped being
/// true when the admission-remediation cut threaded `open_dataset`'s `identity` into the engine.
```

2.4 Sibling search (AUTONOMY.md:215).
- The defect class: a text in the product tree that calls an SKP code or an engine refusal unreachable from the product while a product route reaches it.
- How it was searched: by grep at d9bdc3a0 over engine/, kernel/, protocol/ and frontends/shell/src, for the unreachable, never-fires and no-product-entry-point phrasings, with each hit read.

| Site | Class | Scope | Reason |
|---|---|---|---|
| protocol/skp/SKP-V0.md:485-488 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:e003ce7973a5124b914c7fe79d2b17865dfdc185e93c1f7f86d1479ab432cf40 | in | in (2.2) | the node |
| engine/src/predicate.rs:1111-1116 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:55af22bffeee44d51d0cdcc3be98da806f36dc55c5b691bcc84ad2799fc3585a | in | in (2.3) | the node |
| kernel/src/skp.rs:2185-2193 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:f6c5e25cca7c332e0335d0aef76814ec30a1d89236ebabe8494baec0def559c2 (LodRefused, unreachable from the wire) | in | out: it holds | no build_tiers call in kernel/src, protocol or frontends/shell/src-tauri/src (grep at d9bdc3a0) |
| engine/src/attributes.rs:160-162 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:5873ec571f48c7b962d4706e4e44b33666bf50dad92e518838cd57045e912679 | not in | out | an ordering statement inside a function, not a reachability claim |

2.5 Observed, not in scope (not the same defect class, since no text calls them unreachable):
- eight skp.filter_* codes have no test under kernel/tests (0.2);
- the shell has no guidance string for this code (0.4), and wording is the human's at P6.
The custodian may record either as a proposed node. This piece adds neither.

2.6 The seam and the real shape.
- T-1 calls SkpHost::open_dataset with the wire's own IdentityDeclaration (protocol/skp/src/v0/commands.rs:55-59 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:952cb8afeeef65a2896f97f4d0ba1f6725d6fb50036475e6906e82b5f327ddad). It then calls SkpHost::viewport_query with the wire's Filter. These are the calls the shell's commands make (0.4).
- It never uses Catalog::open_cancellable and never sets skip_uniqueness_check: that is the X3 route, which the wire cannot take.
- The diff adds no seam and no code.

2.7 The fixture, and the e2e re-aim (the node's question). T-1 does not need the re-aim's variant: main's generators already build the shape.
- IdentityMode::StringIds writes id as Utf8 (engine/src/fixture.rs:624 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:86dd0d29c50ac8d58468dc7c2722ae72cb42dbcecda2a55424243729574d288e; values at engine/src/fixture.rs:1092 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:f7b99c290e88dfef081ecadde32b4325f95635245e706bf404a7c79c8b88b6a1).
- AttributeMode::FilterWitness (engine/src/fixture.rs:196 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:83d73134e47ee87d3bd07ea919ebd34b2f58342b11286c0693ecc946ed1226f0) adds a UInt64 column, u64, valued from FILTER_WITNESS_U64 (engine/src/fixture.rs:238 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:1a8cadf1c675fe677aee9b8b3f15f20c7b7c755fb321ba8da027522d8947f91b; written at engine/src/fixture.rs:1144 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:7553578012e391827df2190664377e2a7e437a97320e0011858c5f209ce93b00).
- At two features, u64 holds 0 and 1: unique, non-negative and a 64-bit candidate. So it passes admit_column_type (engine/src/identity.rs:322-344 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:094e022adbecebeda8af5f5c0a9563730be17f58ea5b163d2172e97887ca49b0) and the value checks (engine/src/dataset.rs:1816-1838 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:3741ce210d6ff3be2443148af2fb8e3d6ad8ef1c709853a3bec1cf563d21a9d4).
- This is the product shape: an unusable id beside a usable key. The plain open refuses with the code that opens the shell's identity form (0.4).
- engine/src/fixture.rs is not edited. The re-aim declares every existing variant's bytes unchanged (frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:302 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:cb0e27fce78e2220794b47e54f961d0b2caafe6b8ea9e1f3883bbca7fe013935).
- This piece's code does not wait for the re-aim. Only OPEN-1 (c) would make it wait.

2.8 The shell. No shell file changes. The rendering stays by reading (0.4). Whether it is proven by a run is OPEN-1, and this form proceeds on (a).

2.9 Portability (state/directives/PORTABILITY-2026-09-30.md:33-65 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff).
- R1: identity and filter admission semantics are platform-independent, and T-1 has no platform dependence. Its fixture path is joined from CARGO_MANIFEST_DIR, as its siblings' is.
- R2 to R4: no OS-dependent feature and no OS cfg. R3 is not triggered.
- R5: no level is claimed.
- R6: nothing is ignored.

## §3. Fixtures

| Fixture | Shape (predicted) | Outcome predicted before the run |
|---|---|---|
| F-1 alias-ambiguous.parquet, written per run under target/fixtures/admission-remediation by write_geoparquet with FixtureSpec { identity: StringIds, attributes: FilterWitness, features: 2, avg_vertices: 6, hole_every: 0, ..Default } | id Utf8 (key-0, key-1); bbox; the FilterWitness columns, u64 among them (0, 1); geometry; declared LV95 | plain open: refused engine.identity_unusable, column id, candidate_columns containing u64 · declared open on u64: admitted, describe identity.source mapped:u64 · filter id = 'key-1': refused skp.filter_identity_alias_ambiguous {column: id, source_column: u64}, zero tickets |

- F-1 is regenerated per run and not hashed, as its siblings in the same file are (kernel/tests/skp_admission_remediation.rs:37-41 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:3c96a80ac0a3c76ab7f6fe4043984686f614f4555def4ec1ca99cf8489fc5fa1).

## §4. Tests and mutations

Every mutation is observed by applying it, running the named command, recording the failure by name with the commit it was observed at, and reverting it. A verify-mutation run is never called an observation (round 25, item 2 (c)).

- **T-1, in kernel/tests/skp_admission_remediation.rs.** Proposed name: `a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`. It is `#[tokio::test(flavor = "multi_thread")]`, as the filter-refusal sibling is (kernel/tests/skp_admission.rs:563-605 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:90526bf612e8f3dc5e26514bf29e1dcdf78db2f6f8b66b6fa771cb662efd4d60).
  - It builds an SkpHost over a fresh Catalog, holding a clone of its StreamRegistry.
  - (i) open_dataset on F-1 with identity null: expect_err. It asserts code engine.identity_unusable, field column = id, and that candidate_columns, split on commas, contains u64.
  - (ii) open_dataset on F-1 with identity { column: u64 }: expect. describe gives identity.source mapped:u64.
  - (iii) viewport_query on that handle, with bbox, bbox_crs, limit and columns null and filter `id = 'key-1'` in duckdb-expr/0: expect_err. It asserts code skp.filter_identity_alias_ambiguous, and that the fields map has exactly the keys column (= id) and source_column (= u64), as §7.5's row (protocol/skp/SKP-V0.md:479 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:bdce4071509d36e74f0e3bfa01deff87c992d236ad61fbec822f8607b1dc5e98).
  - (iv) cancel_all_for_dataset(handle) returns 0.
  - The predicate is one that the namespace, bind and type stages would admit without the alias rule (a Utf8 column against a text literal). So step (iii)'s refusal can only come from the rule.
  - Its doc records M-1 and M-2 by symbol, each with its observed commit id. There is no path:line in it.
  - **M-1 (the rule):** identity_alias_ambiguity's body returns None. Run `cargo test -p spatial-kernel --test skp_admission_remediation a_declared_identity_beside`. Predicted: T-1 fails by name at (iii)'s expect_err, because the predicate is admitted.
  - **M-2 (the wire identity):** in SkpHost::open_dataset, the identity is replaced by None in place of host_minted_identity_declaration's result. Same command. Predicted: T-1 fails by name at (ii)'s expect, because the declared open refuses engine.identity_unusable on id.
- **Changed tests: none.** The kernel unit test (0.2) and the engines' exhaustive code maps are unchanged. No sleep, retry or timeout is added.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: T-1 passes at H with no product code changed: the code fires on main today.
- P-2: M-1 and M-2 each fail T-1 by name at the step §4 names.
- P-3: every suite in §9 passes unchanged, in CI on both platforms.

Declared unchanged:
- every product line, including all of engine/src/predicate.rs except identity_alias_ambiguity's doc comment;
- the engine message (§1);
- kernel/src/**, protocol/skp/src/**, protocol/skp/tests/**, the literal skp/0.11;
- SKP-V0.md outside §7.5's paragraph;
- engine/src/fixture.rs, frontends/**, KNOWN-LIMITATIONS.md;
- every ADR;
- no pub item, dependency, OS cfg, ignore or Cargo change.

Invalidators (stop, return to the architect, record class 2):
- the generator refuses F-1's spec;
- step (i) or (ii) does not give its predicted outcome;
- M-1 or M-2 does not fail T-1.

Falsification: step (iii) does not refuse with this code at H. The finding would then be wrong, and the two texts possibly true. Stop, and the human is told before anything is edited.

## §6. Instruments

- T-1's assertions are structural: a typed outcome, a field set and a ticket count.
- No measurement and no docs/08 row.

## §7. Declared values and ceilings

- At most 150 changed lines by §21c's rule across three files: kernel/tests/skp_admission_remediation.rs, engine/src/predicate.rs and protocol/skp/SKP-V0.md.
  - Count with `git diff --numstat B H -- kernel/tests/skp_admission_remediation.rs engine/src/predicate.rs protocol/skp/SKP-V0.md`, where B = `git merge-base origin/main H`, named in the PR body.
  - At most 110 in the test file.
  - At most 20 in engine/src/predicate.rs, all inside identity_alias_ambiguity's doc comment.
  - At most 20 in SKP-V0.md, all inside §7.5's paragraph.
- Non-generated files: at most 7. They are this form, PLAN.yaml, the three files above, engine/README.md and kernel/README.md. The two READMEs carry the owner's-index update only and are outside the line count.
- No constant is added. F-1's two features is a test value.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes, or before stream-flush-cancel-exit-marks-producer-cancelled has merged.
2. Any product code change: engine/src/** beyond 2.3's doc comment, kernel/src/**, protocol/skp/src/**, frontends/**.
3. Any change to the engine's message, the wire literal, a protocol fixture, §8 of SKP-V0.md, or any user-visible string.
4. An edit to engine/src/fixture.rs, or a test that depends on the re-aim's variant.
5. T-1 reaching the engine by any route other than SkpHost::open_dataset with the wire's IdentityDeclaration and SkpHost::viewport_query. This includes Catalog::open_cancellable and skip_uniqueness_check (the imagined-interface rule).
6. SKP-V0.md edited outside §7.5's paragraph, the heading's count included.
7. A corrected text claiming more than §1 allows.
8. A path:line cite in a code comment, or an intra-doc link from engine/ to a kernel item.
9. A new pub item, dependency, OS cfg, ignore, sleep, retry or timeout.
10. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- **Architect and reviewer (§21a; §25(e)).**
  - Verdicts follow state/directives/2026-10-05-product-first-direction.md:15 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751.
  - They block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- **Architect:**
  - the two corrected texts against 0.1 and §1;
  - ADR-016 §3 and ADR-021 decisions 5 and 8;
  - the seam (2.6);
  - §2.4's sibling rows;
  - §8 item by item.
- **Reviewer:**
  - the full diff;
  - M-1 and M-2, each observed with its commit id;
  - the §7 count;
  - the owner's-index update against the diff.
- **Suites:**
  - `cargo test -p spatial-kernel --test skp_admission_remediation`;
  - `cargo test -p spatial-kernel --lib`;
  - `cargo test -p spatial-engine --test predicate_admission --test filter_type_admission`;
  - `cargo doc -p spatial-engine --no-deps` with no new warning;
  - `cargo fmt --all --check`;
  - the workspace, by CI on both platforms;
  - the node --test scripts suite, verify-plan, verify-cites, verify-quotes and verify-test-claims.
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1).
  - Counts are set in advance: the suites once each at H; M-1 once; M-2 once.
  - No e2e run and no timed measurement.
- **Merge:** a merge commit, never a squash.
- **Operator:** none (OPEN-1 (c) would add a row).
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:6baf1cbfb7e93952f2c41c71be144cafc5c06ced596e2b8f4d3db5410b42821c). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff.
  - kernel/README.md, Owner's index:
    - Interfaces this module owns, the wire error codes entry (kernel/README.md:359 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:2a7ce247a84945a72d88bbe52dd16716741847ba919a890df1029809a59b5759): T-1 joins its pins;
    - Governed by, preregistrations in this module (kernel/README.md:376 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:5117b4db6115a44d40b6d0a87d6909e28073ee47a1f682aef7a53d5523c41410): this form;
    - Last verified at.
  - engine/README.md, Owner's index:
    - Interfaces this module owns, the filter admission entry (engine/README.md:504 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:76d2805b4835f19ca61aa4137c58c539f61a3e12b3d3167e9e2c2b33af402b20): T-1 joins its pins;
    - Governed by, engine halves of pieces filed elsewhere (engine/README.md:521 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:79c3738e4f246fcf42566fdbdd44cf3d97a420d0e01c876da5110d4354c5053d): this form;
    - Last verified at.
  - This sits on top of the flush piece's engine entry.
- **KNOWN-LIMITATIONS:** no item is owed. The refusal is ADR-021 decision 8's designed, typed behaviour, and its message names the cause. No item states otherwise. Item 3 (KNOWN-LIMITATIONS.md:60-66 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:f8f21542af1a8944d0975cb6dd19b7cddeffcfb0157f6a9a40434e3acea3603b) is in the re-aim's scope and is not touched.
- **Overlap, rule (00).** The paths are those in §7. This piece touches protocol/ (protocol/skp/SKP-V0.md).
  - At dispatch, the custodian checks that no in-progress piece and no PR awaiting merge touches protocol/, engine/src/predicate.rs, kernel/tests/skp_admission_remediation.rs or either README's owner's index.
  - skp-v0-live-sections-current-area-c also edits SKP-V0.md. It starts only while no other piece or open PR touches protocol/ (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:d82e28ea8f74d57fac226d72ca7b7af95c0ee37f2452a8a03f3f454ce671cd0b), and it excludes finding 2's texts (PLAN.yaml:4420 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:ac050a7d6543d8005428668a6944346c2cbf390976c3802bad04296b62bb35b7). The two run in sequence, never together, and their paragraphs are disjoint.
  - crs-undeclared-message-wording depends on this piece (PLAN.yaml:4484 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:1f03ceef28f42499caa7d0d963016196da29940ad03f883caf1dd330f88a9f46). Its possible protocol/ path, protocol/skp/tests/data/v0-error-example.json, is not touched here.
  - module-docs-stale-statements (docs lane) edits both READMEs' bodies. The same files carry this piece's index update, so the two are sequenced.
  - Slot 1's e2e-stale-expectations-reaim holds engine/src/fixture.rs, kernel/tests/manual_walkthrough_fixtures.rs, the e2e files and KNOWN-LIMITATIONS item 3. This piece edits none of them and reads fixture.rs only.

## §10. Amendments

(opens empty)

### Amendment 1 — the human's ruling on OPEN-1, and the PR body's quotation (class 5)

*Written by the custodian after the human's ruling was received (18:58:06Z by the transcript) and before any code. The form above is the architect's draft (`state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-architect-draft.md`) with the custodian's pins and nothing else changed. References only; nothing below is a quotation.*

1. **The ruling on OPEN-1:** no run of the shell's rendering, the draft's option (a) (state/directives/2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md:16 @ 14475652d737d29612f01a8f2e0bf4c129021506 sha256:a720c105edccc09015e4737431da38a6568802e244ad6df109c38cf1f3dcc0c2), with its RULED block in DECISIONS-PENDING.md. §1's may-not-claim on the shell rendering, §2.8 and §9's Operator line stand as drafted.
2. **The PR body quotes the refusal's message in full** (state/directives/2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md:17 @ 14475652d737d29612f01a8f2e0bf4c129021506 sha256:bd847b1ee7c9191f27e5f055899d2f0cf5c37f8c7cedc4b07a1a7ed4c05b5921).
   - The text is the message T-1's step (iii) receives at H: the engine's Display of the variant (§1's pin of engine/src/predicate.rs), carried on the wire unchanged by the kernel's mapping (0.1), with `id` and `u64` filled in.
   - The worker reads it from one run at H in which T-1 prints it: a scratch line, reverted, never committed, the worktree shown clean. The PR body quotes it byte for byte and names that commit.
   - The reviewer checks the quotation against the Display arm and F-1's values.
3. **Proposed, not placed:** `filter-identity-alias-ambiguous-guidance-line-and-note` (state/directives/2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md:18 @ 14475652d737d29612f01a8f2e0bf4c129021506 sha256:0bd1ef5646f06d959a8c5dcd9f3ba4fb51e3608994116c793c3ae3c9441c4b85). It covers a guidance line for this code in the app, in the human's wording at P6, and a KNOWN-LIMITATIONS note. It is outside this piece: §2.5's second observation is now that node, and §9's KNOWN-LIMITATIONS line stands for this piece.
4. **Authority, added:** the human's area C direction, filed late after this draft found no file for it (state/directives/2026-10-10-drift-sweep-area-c-instructions-filed-late.md:6-12 @ ca909857d2a4a0fffa8df4adfe4a14570dd40135 sha256:d79350d2ac2e0d610b555b0a9b1e71aca74a5fcb6355e4376459dfdc3716274e), with its RULED block. The draft's Authority lines are not edited.
5. **§8 item 1's ordering condition is met:** stream-flush-cancel-exit-marks-producer-cancelled merged as 7b3d8040aafd37c554f43b506663c884669e5dbb (PR #201, 2026-10-10T17:18:14Z).
6. **Generation:** the node goes to 2.
7. Nothing above is edited.

### Amendment 2 — §2.4's LodRefused row, its reason corrected (class 3)

*Written by the custodian after PR #202's gate 1, at the architect's D-1 (`state/consults/gates/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-gate1-architect.md`, gate-log 463). References only.*

1. §2.4's third row says there is no `build_tiers` call in kernel/src. There is one, inside the unit-test module (kernel/src/skp.rs:2374 @ 5a66b1526ff37760a6051674e4f6e8faf24fbb9e sha256:1e0af3fd4a4c3a1d47c7f470ed0d86d90d9de210a5eb1455fbd94482a4765b72; the call, kernel/src/skp.rs:2671 @ 5a66b1526ff37760a6051674e4f6e8faf24fbb9e sha256:35cac06a58f8adefa79639bd9d2dd830b829d004961fd3309e25e3b11139af49). There is no non-test call, so the row's verdict, out because it holds, stands.
2. **Generation:** the node goes to 3.
3. Nothing above is edited.
