// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The one renderer of a condition (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.3's DOM rule): each route's owner element, with its outer owner class, moved whole
 * from `App.tsx`'s attention slots. It adds no remedy and no button but the owner's Dismiss (section 9: no remedy is invented), and one line, S-5, when a condition was
 * raised more than once, with the latest display after the first.
 *
 * `place` says where the element stands. In the strip it carries `role="alert"`, as the owner's element did. In a row of Problems it carries none (the DOM rule: no row of
 * Problems, the top row included, carries the alert role). Session ended renders through `RefusalBlock`, whose own `role="alert"` this file cannot change; session ended is
 * urgency 1, so it is always the strip's top and never a row of Problems in the product.
 */

import RefusalBlock from "../admission/RefusalBlock";
import type { Condition, ConditionDisplay } from "./conditions";
import { routeEnds } from "./conditions";
import { raisedTimesText } from "./conditionsConstants";

export type ConditionPlace = "strip" | "problems";

/** The viewport refusal's own body: its code, then its message, as the owner showed it. */
function ShownDisplay({ display }: { display: ConditionDisplay }) {
  if (display.kind === "text") return <>{display.text}</>;
  return (
    <>
      <div className="admission-refusal-code">{display.refusal.code}</div>
      {display.refusal.message}
    </>
  );
}

/** The first display, and when the condition was raised more than once, the S-5 line and the latest display after it. */
function Body({ condition }: { condition: Condition }) {
  return (
    <>
      <ShownDisplay display={condition.first} />
      {condition.occurrences > 1 && (
        <>
          <div className="condition-occurrences">{raisedTimesText(condition.occurrences)}</div>
          <ShownDisplay display={condition.latest} />
        </>
      )}
    </>
  );
}

/** The owner's classes after `canvas-refusal`, for the routes whose element is a `.canvas-refusal`. */
const NOTICE_CLASS: Partial<Record<Condition["reason"]["route"], string>> = {
  "record-notice": " record-notice",
  "save-notice": " save-notice",
  "reopen-notice": " reopen-notice",
};

export default function ConditionView({ condition, place, onDismiss }: { condition: Condition; place: ConditionPlace; onDismiss: (condition: Condition) => void }) {
  const route = condition.reason.route;
  if (route === "session-ended") {
    const shown = condition.occurrences > 1 ? condition.latest : condition.first;
    return <div className="canvas-session-ended">{shown.kind === "refusal" ? <RefusalBlock refusal={shown.refusal} /> : shown.text}</div>;
  }
  return (
    <div className={`canvas-refusal${NOTICE_CLASS[route] ?? ""}`} role={place === "strip" ? "alert" : undefined}>
      <Body condition={condition} />
      {routeEnds(route, "dismissed") && (
        <button type="button" onClick={() => onDismiss(condition)}>
          Dismiss
        </button>
      )}
    </div>
  );
}
