// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The condition store (seam 8; SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.2 and its Amendments 2, 4, 6 and 7): the one place a refusal, a failure or a notice
 * of the open on the map is kept until it ends, as a pure reducer over a typed identity, so the strip and the Problems tab read one list.
 *
 * **Identity is typed, never read from text.** A condition is the pair of what raised it and where: `(owner, reason.route, reason.code, reason.ordinal, target, generation)`.
 * The display (`first`, `latest`) is only shown. Nothing here compares, searches or parses a display's words (section 8 item 3; I6): two raises with equal words and
 * different keys are two conditions, and two with one key and different words are one condition counted twice.
 *
 * **A condition ends only in the ways its route declares** (`CONDITION_ROUTES`): dismissed by the user, cleared by its owner, replaced by its owner's next batch, or at the next
 * open. A newer raise never ends an older one (a blocker is never hidden by what comes after it). No route of urgency 1 or 2 is replaced by its owner.
 *
 * **`current` is the generation on the map**, set by `opened`. A raise or batch under any other generation is dropped first, before the identity match and the cap, so a late
 * call from a superseded open takes no place and counts for nothing.
 */

import type { FormattedRefusal } from "../admission/formatRefusal";
import type { ViewId } from "../workspace/workspaceState";
import { CONDITIONS_MAX } from "./conditionsConstants";

export type ConditionRoute = "session-ended" | "canvas-ceiling" | "stream-terminal" | "viewport-refusal" | "record-notice" | "save-notice" | "reopen-notice";
export type ConditionOwner = "session" | "canvas" | "stream" | "viewport" | "recording" | "project";
export type ConditionEnd = "dismissed" | "owner-cleared" | "replaced-by-owner" | "next-open";
/** 1 the session ended, 2 a refusal, 3 a notice: the lower the number, the sooner it is shown. */
export type ConditionUrgency = 1 | 2 | 3;

/** What a condition is about: one view of the resource, or the resource itself. */
export type ConditionTarget = { readonly kind: "view"; readonly view: ViewId } | { readonly kind: "resource" };

/** What is shown for a raise: the owner's text, or its typed refusal (rendered as the owner rendered it). */
export type ConditionDisplay = { readonly kind: "text"; readonly text: string } | { readonly kind: "refusal"; readonly refusal: FormattedRefusal };

/** The static row of one route: who owns it, what it is about, how urgent it is, and the only ways it ends. */
export interface RouteDeclaration {
  readonly route: ConditionRoute;
  readonly owner: ConditionOwner;
  readonly target: "view" | "resource";
  readonly urgency: ConditionUrgency;
  readonly ends: readonly ConditionEnd[];
}

/** Section 2.2's table. Its order is the order the tests read it in. */
export const CONDITION_ROUTES = [
  { route: "session-ended", owner: "session", target: "resource", urgency: 1, ends: ["next-open"] },
  { route: "canvas-ceiling", owner: "canvas", target: "view", urgency: 2, ends: ["dismissed", "next-open"] },
  { route: "stream-terminal", owner: "stream", target: "view", urgency: 2, ends: ["dismissed", "next-open"] },
  { route: "viewport-refusal", owner: "viewport", target: "view", urgency: 2, ends: ["dismissed", "owner-cleared", "next-open"] },
  { route: "record-notice", owner: "recording", target: "view", urgency: 3, ends: ["replaced-by-owner", "next-open"] },
  { route: "save-notice", owner: "project", target: "resource", urgency: 3, ends: ["replaced-by-owner", "next-open"] },
  { route: "reopen-notice", owner: "project", target: "resource", urgency: 3, ends: ["next-open"] },
] as const satisfies readonly RouteDeclaration[];

/** The row of one route in the table above. */
function declarationOf(route: ConditionRoute): RouteDeclaration {
  const found = CONDITION_ROUTES.find((entry) => entry.route === route);
  if (found === undefined) throw new Error(`no route declaration for ${route}`);
  return found;
}

/** True when `route` declares that it can end this way. */
export function routeEnds(route: ConditionRoute, end: ConditionEnd): boolean {
  return declarationOf(route).ends.includes(end);
}

export interface ConditionReason {
  readonly route: ConditionRoute;
  /** The owner's typed code: a refusal's code, or the route's own. Never display text. */
  readonly code: string;
  /** The position within a batch of notices (the save's), or `null`. */
  readonly ordinal: number | null;
}

export interface Condition {
  readonly id: string;
  readonly owner: ConditionOwner;
  readonly reason: ConditionReason;
  readonly target: ConditionTarget;
  /** The resource generation (the dataset handle) it was raised under. */
  readonly generation: string;
  readonly urgency: ConditionUrgency;
  /** The display of the first raise, kept. */
  readonly first: ConditionDisplay;
  /** The display of the latest raise of this identity. */
  readonly latest: ConditionDisplay;
  /** How many times this identity was raised, 1 or more. */
  readonly occurrences: number;
  /** The order of the first raise: oldest first within urgency 1 and 2, and within each route of urgency 3 (see `ordered`). */
  readonly seq: number;
}

export interface ConditionsState {
  readonly byId: Readonly<Record<string, Condition>>;
  readonly nextId: number;
  readonly nextSeq: number;
  /** The raises of urgency 2 and 3 that found their places full, since the last open. */
  readonly notKept: number;
  /** The generation on the map, or `null` before the first open. */
  readonly current: string | null;
}

export const initialConditionsState: ConditionsState = { byId: {}, nextId: 1, nextSeq: 0, notKept: 0, current: null };

export type ConditionsEvent =
  | {
      readonly type: "raise";
      readonly route: ConditionRoute;
      readonly code: string;
      readonly ordinal: number | null;
      readonly target: ConditionTarget;
      readonly generation: string;
      readonly display: ConditionDisplay;
    }
  | { readonly type: "dismiss"; readonly id: string }
  | { readonly type: "ownerClear"; readonly route: ConditionRoute; readonly target: ConditionTarget; readonly generation: string }
  | { readonly type: "opened"; readonly resource: string }
  | {
      readonly type: "replaceBatch";
      readonly route: ConditionRoute;
      readonly code: string;
      readonly target: ConditionTarget;
      readonly generation: string;
      readonly displays: readonly ConditionDisplay[];
    };

const sameTarget = (a: ConditionTarget, b: ConditionTarget): boolean => (a.kind === "resource" ? b.kind === "resource" : b.kind === "view" && a.view === b.view);

/** The urgency 2 and 3 conditions the list holds: the ones the cap counts. */
const keptForCap = (state: ConditionsState): number => Object.values(state.byId).filter((condition) => condition.urgency > 1).length;

function without(state: ConditionsState, drop: (condition: Condition) => boolean): ConditionsState {
  const kept = Object.values(state.byId).filter((condition) => !drop(condition));
  if (kept.length === Object.keys(state.byId).length) return state;
  return { ...state, byId: Object.fromEntries(kept.map((condition) => [condition.id, condition])) };
}

function raise(state: ConditionsState, event: Extract<ConditionsEvent, { type: "raise" }>): ConditionsState {
  // First: a raise under another generation is dropped, before the identity match and the cap.
  if (event.generation !== state.current) return state;
  const declaration = declarationOf(event.route);
  const same = Object.values(state.byId).find(
    (condition) =>
      condition.owner === declaration.owner &&
      condition.reason.route === event.route &&
      condition.reason.code === event.code &&
      condition.reason.ordinal === event.ordinal &&
      condition.generation === event.generation &&
      sameTarget(condition.target, event.target)
  );
  if (same !== undefined) {
    return { ...state, byId: { ...state.byId, [same.id]: { ...same, occurrences: same.occurrences + 1, latest: event.display } } };
  }
  // The cap: urgency 1 always keeps its held place; urgency 2 and 3 keep at most CONDITIONS_MAX - 1.
  if (declaration.urgency > 1 && keptForCap(state) >= CONDITIONS_MAX - 1) return { ...state, notKept: state.notKept + 1 };
  const id = `condition-${state.nextId}`;
  const condition: Condition = {
    id,
    owner: declaration.owner,
    reason: { route: event.route, code: event.code, ordinal: event.ordinal },
    target: event.target,
    generation: event.generation,
    urgency: declaration.urgency,
    first: event.display,
    latest: event.display,
    occurrences: 1,
    seq: state.nextSeq,
  };
  return { ...state, byId: { ...state.byId, [id]: condition }, nextId: state.nextId + 1, nextSeq: state.nextSeq + 1 };
}

export function conditionsReducer(state: ConditionsState, event: ConditionsEvent): ConditionsState {
  switch (event.type) {
    case "raise":
      return raise(state, event);
    case "dismiss": {
      const condition = state.byId[event.id];
      if (condition === undefined || !routeEnds(condition.reason.route, "dismissed")) return state;
      return without(state, (c) => c.id === event.id);
    }
    case "ownerClear":
      if (!routeEnds(event.route, "owner-cleared")) return state;
      return without(state, (c) => c.reason.route === event.route && c.generation === event.generation && sameTarget(c.target, event.target));
    case "opened":
      // Every condition of another generation ends, and the count of what was not kept starts again.
      return { ...without(state, (c) => c.generation !== event.resource), notKept: 0, current: event.resource };
    case "replaceBatch": {
      if (!routeEnds(event.route, "replaced-by-owner") || event.generation !== state.current) return state;
      // The route's conditions for this target and generation end once, then each display is raised in order through the one raise path, the cap included.
      let next = without(state, (c) => c.reason.route === event.route && c.generation === event.generation && sameTarget(c.target, event.target));
      event.displays.forEach((display, position) => {
        next = raise(next, {
          type: "raise",
          route: event.route,
          code: event.code,
          ordinal: event.route === "save-notice" ? position : null,
          target: event.target,
          generation: event.generation,
          display,
        });
      });
      return next;
    }
  }
}

/** The conditions of the open on the map that belong to this view: the resource's, and this view's own. */
export function visibleFor(state: ConditionsState, context: { readonly view: ViewId | null; readonly resource: string | null }): Condition[] {
  if (context.resource === null) return [];
  return Object.values(state.byId).filter(
    (condition) => condition.generation === context.resource && (condition.target.kind === "resource" || (context.view !== null && condition.target.view === context.view))
  );
}

/**
 * Urgency first. Within urgency 1 and 2 the first raise comes first (oldest first). Within urgency 3 the route raised most recently comes first (the newest `seq` among that route's
 * conditions in the list), and inside a route the first raise comes first, so a save's lines keep their order and come before the reopen notices of an earlier open (Amendment 17
 * item 6, OPEN-B1 (b)). This is the one order: the strip's top and the Problems tab both read it.
 */
export function ordered(list: readonly Condition[]): Condition[] {
  const newestOfRoute = new Map<ConditionRoute, number>();
  for (const condition of list) {
    if (condition.urgency === 3) newestOfRoute.set(condition.reason.route, Math.max(newestOfRoute.get(condition.reason.route) ?? -1, condition.seq));
  }
  const routeNewest = (condition: Condition): number => newestOfRoute.get(condition.reason.route) ?? condition.seq;
  return [...list].sort((a, b) => a.urgency - b.urgency || (a.urgency === 3 ? routeNewest(b) - routeNewest(a) : 0) || a.seq - b.seq);
}

/** The top of the list and how many conditions stand below it, or `null` for an empty list. */
export function attentionOf(list: readonly Condition[]): { top: Condition; others: number } | null {
  const sorted = ordered(list);
  return sorted.length === 0 ? null : { top: sorted[0], others: sorted.length - 1 };
}
