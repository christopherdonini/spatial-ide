// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "../streaming/viewportStreamManager";

/**
 * The canvas's own declared constants for the hover readout's re-pick on camera settle
 * (`HOVER-REPICK-PREREGISTRATION.md`, DECISIONS-PENDING entry 47) -- a separate module from
 * `limits.ts` deliberately: that file declares CAPACITY CEILINGS ("a ceiling with no number is not
 * declared"), and neither value below is a ceiling. This is the same topic-scoped shape
 * `tileGridConstants.ts` already uses for the tile grid's own declared values.
 */

/**
 * **D1 -- the settle cadence, declared (ADR-010 rule 6, "declared, not discovered").**
 *
 * The quantity this bounds, exactly: **camera-change events coalesced before one re-pick.** The
 * trailing-edge debounce (`streaming/debounce.ts`) fires the re-pick only once a burst of camera
 * changes has stopped arriving for this long; a gesture that never pauses therefore runs no pick at
 * all and accumulates nothing. That is the whole of what this value governs.
 *
 * **It is a declared cadence, never a latency bound.** It says nothing about how long a pick, a
 * frame, a query or a readout takes, and no such claim may be derived from it (ADR-018's class-(a)
 * discipline, applied -- this piece borrows that discipline, not ADR-018's own vocabulary).
 *
 * **The declared coupling.** Defined AS `VIEWPORT_QUERY_MIN_INTERVAL_MS`, never as a fresh literal:
 * the human's anchor for this piece was "anchored to the existing viewport-query debounce"
 * (preregistration section 2d), so no second number is introduced here at all. Changing the
 * viewport-query constant therefore changes this settle cadence too -- deliberately, by that
 * anchor, not by accident. The two quantities remain different things (that constant declares a
 * client-side `viewport_query` issue-rate ceiling at its own site); this one names what the same
 * value bounds HERE.
 */
export const HOVER_REPICK_SETTLE_MS = VIEWPORT_QUERY_MIN_INTERVAL_MS;

/**
 * **D3 -- PROPOSED PENDING THE HUMAN'S SIGHT (DECISIONS-PENDING entry 75).**
 *
 * `true` (this value): pan and zoom settle alike -- every camera change arms the re-pick, which is
 * the reading the ruling's own words force ("re-pick on camera settle": a pan is a camera change,
 * and all three arming sites are camera-change sites without regard to axis).
 *
 * `false` (the alternative, for the human): **zoom-only** settle -- a camera change whose zoom is
 * unchanged arms nothing, so a pure pan clears the standing readout exactly as it does today, and
 * the sharpened criterion the piece exists for is satisfied for zoom-out only.
 *
 * The block-on-sight condition attached to this piece names pan-settle as sitting outside entry
 * 47's ruled (b), so this is built as a declared, tested switch rather than as a settled choice:
 * the human's answer to entry 75 selects the value before any merge. Both values are unit-tested
 * (`pickResolution.test.ts`'s `shouldArmHoverRepick` cases) -- the switch is a real, exercised
 * branch, not a dormant one.
 */
export const HOVER_REPICK_ON_PAN = true;
