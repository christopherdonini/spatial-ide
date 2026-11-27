// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The Problems tab (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.3): every condition of the open on the map, once, in `ordered` order. The first is the strip's
 * top: its row carries no owner class and no alert role and says so (S-10), because its element is the strip's and is in the DOM once. Every other row is the condition's
 * own element, rendered by `ConditionView` for this place. S-4 shows when nothing is listed, and S-6 when raises were not kept.
 */

import type { Condition } from "./conditions";
import { ordered } from "./conditions";
import ConditionView from "./ConditionView";
import { NO_PROBLEMS_TEXT, notKeptText, SHOWN_IN_STRIP_TEXT } from "./conditionsConstants";

export default function ProblemsTab({ conditions, notKept, onDismiss }: { conditions: readonly Condition[]; notKept: number; onDismiss: (condition: Condition) => void }) {
  const list = ordered(conditions);
  return (
    <div className="problems-tab">
      {list.length === 0 && <p className="problems-empty">{NO_PROBLEMS_TEXT}</p>}
      {notKept > 0 && <p className="problems-not-kept">{notKeptText(notKept)}</p>}
      {list.map((condition, index) =>
        index === 0 ? (
          <div key={condition.id} className="problem-row problem-row-top">
            {SHOWN_IN_STRIP_TEXT}
          </div>
        ) : (
          <div key={condition.id} className="problem-row">
            <ConditionView condition={condition} place="problems" onDismiss={onDismiss} />
          </div>
        )
      )}
    </div>
  );
}
