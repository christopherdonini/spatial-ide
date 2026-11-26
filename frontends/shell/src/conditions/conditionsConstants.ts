// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The condition store's constants and the words of the Problems tab (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.2 and 2.3, Amendments 4 and 8).
 * The words are the advisor's (ADV-2026-11-23-30 item 1: S-1, S-3, S-4, S-5, S-6, S-10), copied by script from the ruling and not retyped here.
 */

/**
 * The most conditions one open keeps: 63 of urgency 2 and 3, and one place held for urgency 1 (ADV-2026-11-23-17 item 10; Amendment 4). The reducer reads this one value:
 * an urgency 2 or 3 raise that finds `CONDITIONS_MAX - 1` of them kept is not kept, and adds 1 to `notKept`.
 */
export const CONDITIONS_MAX = 64;

/** S-1: the Activity tab's label. */
export const PROBLEMS_LABEL = "Problems";
/** S-3: the strip's button, with `n` the number of conditions below the top. */
export const moreInProblemsText = (n: number): string => `${n} more in Problems`;
/** S-4: Problems with nothing to list. */
export const NO_PROBLEMS_TEXT = "No problems for the dataset on the map.";
/** S-5: the line `ConditionView` adds when a condition was raised more than once; `n` is `occurrences`, so 2 or more. */
export const raisedTimesText = (n: number): string => `Raised ${n} times in all. The latest:`;
/** S-6: Problems' line for the raises the list did not keep. */
export const notKeptText = (n: number): string => `Problems raised and not kept: ${n}. The list keeps at most 64.`;
/** S-10: the top row of Problems, whose condition is the strip's. */
export const SHOWN_IN_STRIP_TEXT = "Shown above in the attention strip.";
