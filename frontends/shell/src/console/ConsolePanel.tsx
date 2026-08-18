// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useState } from "react";

import { formatRefusal } from "../admission/formatRefusal";
import RefusalBlock from "../admission/RefusalBlock";
import { coalesceOncePerFrame } from "../canvas/coalesceOncePerFrame";
import { attachCollapsedCountSync, type ConsoleCountSnapshot } from "./collapsedCountSync";
import {
  buildRowViewModel,
  CLASS_B_THREW_SENTENCE,
  groupConsecutiveEntries,
  standingHeaderModel,
  type ConsoleEntryGroup,
  type ConsoleRowViewModel,
} from "./consoleViewModel";
import { consoleRecorder, recordNamed, type ConsoleEntry } from "./recorder";

/**
 * NEXT-CUT.md P3: the collapsed-by-default bottom drawer (`docs/07`'s "Current focus" text: a
 * bottom drawer, not a rail panel -- `styles.css`'s own `.console-panel` comment has the measured
 * reason). Mounted unconditionally in `App.tsx`, below every other panel, whether or not a dataset
 * is admitted: class-A's own `open_dataset` and several class-B commands (`binding_pick_file`,
 * `binding_crs_catalog`) can fire before any admission ever succeeds, and the console must account
 * for those too, not only post-admission activity.
 *
 * Two entirely separate subscription strategies, switched on `expanded` (I9): collapsed reads only
 * a count via `attachCollapsedCountSync` (zero per-entry DOM work, the closed-console invariant);
 * expanded reads the full entry list on every notification, which is the operator's own explicit
 * choice to pay that cost -- but that cost is still coalesced to at most once per animation frame
 * via `coalesceOncePerFrame` (reviewer gate S1, action-console P7 fixes), the same pattern the
 * collapsed branch already uses, so a burst of recorder notifications (e.g. J6's own hard-panning
 * scenario) re-renders the expanded drawer at most once per frame rather than once per notification.
 * Neither branch composes display text itself (I3) -- `render.ts`, `surfaceRegistry.ts`, and
 * `formatRefusal.ts` (I10, reused verbatim, not reimplemented) own that.
 */
export default function ConsolePanel() {
  const [expanded, setExpanded] = useState(false);
  const [snapshot, setSnapshot] = useState<ConsoleCountSnapshot>({ count: 0, dropped: 0 });
  const [entries, setEntries] = useState<readonly ConsoleEntry[]>([]);

  useEffect(() => {
    if (!expanded) {
      return attachCollapsedCountSync(consoleRecorder, setSnapshot);
    }
    const sync = () => {
      const live = consoleRecorder.entries();
      setEntries(live);
      setSnapshot({ count: live.length, dropped: consoleRecorder.droppedCount() });
    };
    const coalesced = coalesceOncePerFrame(sync);
    sync();
    const unsubscribe = consoleRecorder.subscribe(() => coalesced.schedule());
    return () => {
      unsubscribe();
      coalesced.cancel();
    };
  }, [expanded]);

  const groups = expanded ? groupConsecutiveEntries(entries) : [];
  const header = standingHeaderModel(expanded);
  const actionsWord = snapshot.count === 1 ? "action" : "actions";
  const label =
    snapshot.dropped > 0
      ? `Console — ${snapshot.count} ${actionsWord} (${snapshot.dropped} dropped)`
      : `Console — ${snapshot.count} ${actionsWord}`;

  return (
    <div className="console-panel">
      <button
        type="button"
        className="console-disclosure"
        onClick={() => {
          // S5 (reviewer gate, action-console P7 fixes): pure view state, same class-C treatment
          // as every other panel's own togglePanelExpanded row -- reflexivity is the point: the
          // console records its own toggle too.
          recordNamed("gui-action", "console.togglePanelExpanded");
          setExpanded((v) => !v);
        }}
        aria-expanded={expanded}
      >
        {expanded ? "▾" : "▸"} {label}
      </button>
      {expanded && (
        <div className="console-entries">
          {header.map((text) => (
            <p key="standing-header" className="console-standing-header">
              {text}
            </p>
          ))}
          {groups.length === 0 ? (
            <p className="console-empty">No actions recorded yet.</p>
          ) : (
            groups.map((group) => <ConsoleGroupRow key={group.entries[0]!.seq} group={group} />)
          )}
        </div>
      )}
    </div>
  );
}

/** One group (I8): a single entry renders directly; a run of 2+ renders as a "×N" header the
 * operator can expand to see the N REAL entries individually -- never a merged/synthesized one. */
function ConsoleGroupRow({ group }: { group: ConsoleEntryGroup }) {
  const [groupExpanded, setGroupExpanded] = useState(false);

  if (group.entries.length === 1) {
    return <ConsoleRow vm={buildRowViewModel(group.entries[0]!)} />;
  }

  return (
    <div className="console-group">
      <button
        type="button"
        className="console-group-header"
        onClick={() => {
          // S5 (reviewer gate, action-console P7 fixes): reflexive by design -- expanding a
          // coalesced group is itself pure view state, local to this group's row, recorded the
          // same as every other class-C toggle. Flows through the ConsolePanel's own (now
          // coalesced, S1) subscribe, so this cannot storm re-renders.
          recordNamed("gui-action", "console.toggleGroupExpanded");
          setGroupExpanded((v) => !v);
        }}
        aria-expanded={groupExpanded}
      >
        {`×${group.entries.length}`}
      </button>
      {groupExpanded && group.entries.map((entry) => <ConsoleRow key={entry.seq} vm={buildRowViewModel(entry)} />)}
    </div>
  );
}

/**
 * A class-A entry's copy block, factored out so its own `copyText` prop is a plain `string` --
 * never `RenderedEntry["copyText"]`'s `string | null` union (reviewer gate S6, action-console P7
 * fixes). The caller only renders this component from the `!vm.rendered.truncated` branch, where
 * `copyText` is already narrowed to `string`; hoisting it to a prop here means the `onClick`
 * closure below captures that already-narrowed value directly, with no `as string` cast standing
 * in for narrowing TypeScript cannot carry through a property-access chain into a closure.
 */
function ClassACopyBlock({ copyText }: { copyText: string }) {
  return (
    <>
      <pre className="console-request-text">{copyText}</pre>
      <button
        type="button"
        className="console-copy-button"
        onClick={() => {
          void navigator.clipboard.writeText(copyText);
        }}
      >
        Copy
      </button>
    </>
  );
}

function ConsoleRow({ vm }: { vm: ConsoleRowViewModel }) {
  switch (vm.kind) {
    case "class-a":
      return (
        <div className="console-entry console-entry-class-a">
          <div className="console-entry-header">{vm.commandLabel}</div>
          <div className="console-entry-label">{`SKP ${vm.skpVersion ?? "unknown"} · control plane`}</div>
          {vm.rendered.truncated ? (
            <>
              <pre className="console-request-text console-request-truncated">{vm.rendered.preview}</pre>
              <p className="console-truncated-reason">{vm.rendered.reason}</p>
            </>
          ) : (
            <ClassACopyBlock copyText={vm.rendered.copyText} />
          )}
          <div className="console-outcome">{vm.outcome}</div>
          {vm.outcome === "refused" && vm.refusal && (
            <div className="console-refusal">
              <RefusalBlock refusal={formatRefusal(vm.refusal)} />
            </div>
          )}
          {vm.outcome === "threw" && vm.error && <p className="console-error">{vm.error}</p>}
        </div>
      );
    case "class-b":
      return (
        <div className="console-entry console-entry-class-b">
          <p className="console-entry-prose">{`${vm.effect} (${vm.entry.command})`}</p>
          <p className="console-entry-citation">{vm.citation}</p>
          <div className="console-outcome">{vm.outcome}</div>
          {vm.outcome === "threw" && <p className="console-error">{CLASS_B_THREW_SENTENCE}</p>}
        </div>
      );
    case "class-c":
      return (
        <div className="console-entry console-entry-class-c">
          <p className="console-entry-prose">{vm.statement}</p>
          <p className="console-entry-owner">{vm.owner}</p>
        </div>
      );
    case "unclassified":
      return (
        <div className="console-entry console-entry-unclassified" role="alert">
          {`UNCLASSIFIED — this is a defect, report it: ${vm.name}`}
        </div>
      );
  }
}
