# Licenses — which text applies where

ADR-009 (Accepted 2026-08-07) sets four licensing layers. This directory holds the verbatim texts;
this file records **which layer each part of the tree is in**.

> **Update, 2026-08-18 (ADR-009 pre-public checklist pass):** both texts named "missing" below were
> fetched the same day this file was written (`PRE-PUBLIC-CHECKLIST.md`'s "Custodian completion
> note — 2026-08-07"), but this file's own prose was never updated to say so — a documentation
> staleness, not a state fact. Verified present now: `LICENSES/AGPL-3.0-or-later.txt` (34,523 B,
> sha256 `0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0`, canonical
> `GNU AFFERO GENERAL PUBLIC LICENSE` header) and `LICENSES/CC-BY-4.0.txt` (18,657 B, sha256
> `9ba9550ad48438d0836ddab3da480b3b69ffa0aac7b7878b5a0039e7ab429411`, canonical `Attribution 4.0
> International` header). `LICENSE` and `docs/LICENSE` no longer carry a trailing missing-text
> notice (confirmed by reading both). The "what was searched" record below is retained as-is — it
> is a historical record of the no-downloads session, not a current-state claim; the table above it
> and the surrounding prose are corrected in place.

## The layers, and where they live today

| Layer (ADR-009) | License | Where it lives in this tree | Text |
|---|---|---|---|
| Core | `AGPL-3.0-or-later` | `kernel/` `engine/` `renderer/` `protocol/` `frontends/` `spikes/` and every other source file | `AGPL-3.0-or-later.txt` ✅ |
| Spec and documentation | `CC-BY-4.0` | `docs/` (including `docs/10`, the SKP protocol specification) | `CC-BY-4.0.txt` ✅ |
| Client SDKs, generated bindings, example integrations | `Apache-2.0` | **no member yet** — see "The Apache-2.0 layer is empty" below | `Apache-2.0.txt` ✅ |
| Commercial products | separate works, separately licensed | not in this repository | n/a |

The root `LICENSE` carries the core grant. `docs/LICENSE` carries the documentation grant.

## Two texts were missing at first, and that was deliberate rather than an oversight

`AGPL-3.0-or-later.txt` and `CC-BY-4.0.txt` were **not in this directory** when this file was first
written. Both are present now (see the 2026-08-18 update note above); the record of why they were
absent and how they were later verified is kept below for provenance.

The session that set up this directory was working under a binding **no-downloads** constraint (the
operator was on a metered connection: no installs, no fetches, no toolchain or browser downloads).
Both texts were searched for on the machine and **neither exists on it**. They were therefore
recorded as *deferred with reason* — the constraint's stated fallback — rather than fetched.

**They were deliberately not written from memory.** A license is a legal instrument; an
approximately-transcribed one is worse than one that is honestly marked absent, because it looks
like the real thing. This applies with particular force to AGPL-3.0: the GPL-3.0 text *is* present
on this machine (Inkscape ships it), and AGPL-3.0 is **not** GPL-3.0 with an edit — it differs in
its title, in a preamble paragraph, and in the whole of section 13, and reconstructing one from the
other would be fabrication with a plausible surface.

### What was searched, so this can be re-checked rather than retaken on trust

Searched on 2026-08-07, on the reference machine:

- `~/.cargo/registry/src` — by filename, and by content for `GNU AFFERO GENERAL PUBLIC LICENSE` and
  `Creative Commons Attribution 4.0 International`. No hit for either.
- `~/.rustup` — no hit.
- `C:\Program Files` and `C:\Program Files (x86)` — by filename for `*GPL*` and `COPYING*`, and by
  content for `AFFERO` across `*.txt`, `COPYING*`, `LICENSE*`, `*.md`. **No hit for `AFFERO`.**
  Found and rejected as the wrong license: `GPL-3.0.txt`, `GPL-2.0.txt`, `LGPL-2.1.txt` (Inkscape),
  `GPL.txt` (Stellarium), `COPYING` (QGIS), `LGPL.TXT` (PotPlayer).
- This repository's `node_modules` trees — permissive licenses only (MIT, Apache-2.0, BSD, 0BSD,
  ISC); no AGPL, no CC-BY.

### Retrieving them — done, 2026-08-07

The commands below are kept for reference/reproducibility, not as an outstanding step:

```sh
curl -o LICENSES/AGPL-3.0-or-later.txt https://www.gnu.org/licenses/agpl-3.0.txt
curl -o LICENSES/CC-BY-4.0.txt          https://creativecommons.org/licenses/by/4.0/legalcode.txt
```

The trailing notices in `LICENSE` and `docs/LICENSE` were deleted the same day.

**Both files exist; ADR-009 pre-public checklist item 1's license-text sub-item is discharged.**
`PRE-PUBLIC-CHECKLIST.md` and `CUT-STATE-ADR-009-checklist.md` track the checklist's remaining
items.

## `Apache-2.0.txt` — provenance, so it is verifiable rather than trusted

Copied from `~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/ahash-0.8.12/LICENSE-APACHE`.

- `sha256` `a60eea817514531668d7e00765731449fe14d059d3249e0bc93b36de45f759f2`
- 201 lines, 10 847 bytes, including the `APPENDIX: How to apply the Apache License to your work`.

**Why this copy is trustworthy without a download:** 95 crates in the local registry — independently
published, by unrelated authors — ship a file with **exactly this hash**. It is the most common of
the variants present by a wide margin; the runners-up (33 and 11 copies) are the appendix-less
excerpt and a `https://`-URL variant. Byte-identity across 95 independent upstreams is a stronger
provenance argument than a single fetch would have been.

## The Apache-2.0 layer is empty, and that is a finding rather than a gap

ADR-009 item 4 puts **client SDKs, generated bindings and example integrations** under Apache-2.0.
No such module exists in this tree yet, so **nothing is declared Apache-2.0 today**. The text is
placed here anyway because ADR-009 item 1 of the checklist asks for it where the layer lives, and
this directory is where it will live the moment the layer has a first member.

**One judgement call is flagged for the human rather than made here.** `frontends/canvas-probe/` is
described in its own `package.json` as a "minimal canvas consumer for the first engine slice", and
`protocol/transport-bakeoff/web/` is a browser consumer built as decision evidence. Either could be
read as an "example integration" and therefore as the Apache-2.0 layer's first member. **Both are
declared `AGPL-3.0-or-later` here**, on the conservative reading, because:

- ADR-009 names the SDK layer by its *purpose* — "plugin authors link the SDK, not the core" — and
  neither of these is something a plugin author links. They are consumers of the slice, built to
  demonstrate and to measure it.
- The direction of the mistake is not symmetric. The copyright holder can still relicense their own
  AGPL code outward to Apache-2.0 at any time (there are no external contributions yet, so ADR-009
  item 9's permanent lock has nothing to bite on). Publishing something as Apache-2.0 and later
  wishing it were AGPL does not un-publish it.

If the intent is that either directory *is* the Apache-2.0 layer, that is a one-line change to its
package manifest and its SPDX headers — and it is the human's call, not this file's.
