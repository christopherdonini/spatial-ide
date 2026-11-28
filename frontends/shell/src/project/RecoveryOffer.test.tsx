// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md section 4 and Amendments 4, 20 and 21: S-1 to S-3 and S-7 to S-10, the recovery offer's list and its two `admit`s over the mocked
 * client. The strings are asserted through `RecoveryOffer.tsx`'s own constants (each is the ruling's text under the P6 mark; the script that copied them compared the bytes).
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  list: null as null | (() => Promise<unknown>),
  recover: null as null | (() => Promise<unknown>),
  discard: null as null | (() => Promise<unknown>),
  describe: null as null | (() => Promise<unknown>),
  listed: [] as (string | null)[],
  recovers: [] as { record: string; dataset: string | null }[],
  discards: [] as string[],
  closes: [] as string[],
  logs: [] as { level: string; message: string }[],
}));

vi.mock("../skp/client", () => {
  class SkpCallError extends Error {
    readonly skpError: import("../skp/types").SkpError;
    constructor(skpError: import("../skp/types").SkpError) {
      super(skpError.message);
      this.skpError = skpError;
    }
  }
  return {
    SkpCallError,
    listRecoverable: async (dataset: string | null) => {
      mocks.listed.push(dataset);
      return mocks.list!();
    },
    recoverSession: async (record: string, _cancelKey: string, dataset: string | null) => {
      mocks.recovers.push({ record, dataset });
      return mocks.recover!();
    },
    discardRecoverable: async (record: string) => {
      mocks.discards.push(record);
      return mocks.discard!();
    },
    describe: async () => (mocks.describe === null ? { schema: [] } : mocks.describe()),
    closeDataset: async (dataset: string) => {
      mocks.closes.push(dataset);
      return { cancelled_streams: 0 };
    },
    cancel: async () => ({ state: "requested" }),
  };
});
vi.mock("../diagnostics/log", () => ({ logSessionEvent: (level: string, message: string) => mocks.logs.push({ level, message }) }));

import { SkpCallError } from "../skp/client";
import type { ListRecoverableResponse, RecoverableRecord, RecoverSessionResponse } from "../skp/types";
import RecoveryOffer, {
  admitRecovered,
  discardEntry,
  DISCARD_LABEL,
  ENTRY_TEXT,
  LATER_VERSION_TEXT,
  MORE_TEXT,
  NOT_FOUND_TEXT,
  OFFER_HEADING,
  RECOVER_LABEL,
  UNREADABLE_TEXT,
} from "./RecoveryOffer";
import { shownText } from "./shownText";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const UNSAVED = `unsaved-${"0".repeat(32)}`;
const OTHER = `unsaved-${"1".repeat(32)}`;
const AT = "2026-11-27T10:15:30.000Z";
const recordOf = (over: Partial<RecoverableRecord> = {}): RecoverableRecord => ({ record: UNSAVED, file_name: "parcels.parquet", last_step_at: AT, steps: 2, data: { state: "found" }, ...over });
const listing = (records: RecoverableRecord[], more = false): (() => Promise<ListRecoverableResponse>) => async () => ({ records, more });
const opened: RecoverSessionResponse = { dataset: "ds_1", opened: { session: "sr_1", check: { observed: [], admission: [] } }, steps: [{ action: "style.set", params: { property: "fillOpacity", value: 0.5 } }] };
const refusal = (code: string, message: string) => new SkpCallError({ code, message, fields: {} });

describe("RecoveryOffer and its two admits (the recovery offer's Part 1)", () => {
  let container: HTMLDivElement;
  let root: Root;
  const recovered: unknown[][] = [];

  beforeEach(() => {
    Object.assign(mocks, { list: listing([]), recover: async () => opened, discard: async () => ({}), describe: null, listed: [], recovers: [], discards: [], closes: [], logs: [] });
    recovered.length = 0;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const settle = () => act(async () => { for (let i = 0; i < 4; i += 1) await new Promise((resolve) => setTimeout(resolve, 0)); });
  const texts = (selector: string): string[] => [...container.querySelectorAll(selector)].map((el) => el.textContent ?? "");
  async function mount(formatTime?: (date: Date, options: Intl.DateTimeFormatOptions) => string): Promise<void> {
    await act(async () => {
      root.render(<RecoveryOffer projectDataset={null} confirmOpen={async () => true} onRecovered={(...args) => void recovered.push(args)} formatTime={formatTime} />);
    });
    await settle();
  }
  async function click(selector: string, index = 0): Promise<void> {
    const button = container.querySelectorAll<HTMLButtonElement>(selector)[index];
    if (button === undefined) throw new Error(`no element matches ${selector}`);
    await act(async () => button.click());
    await settle();
  }

  // RECORDED MUTATION for S-1: the entry's text is built without the time. Expected failure: the formatter is not called, and the text lacks it.
  it("the_offer_names_the_file_and_the_time", async () => {
    mocks.list = listing([recordOf()], true);
    const given: [Date, Intl.DateTimeFormatOptions][] = [];
    await mount((date, options) => (given.push([date, options]), "THE-TIME"));
    expect(mocks.listed, "the list at mount asks for no project's record").toEqual([null]);
    expect(given, "the instant is the last step's UTC at, and the options are the local date and time").toEqual([[new Date(AT), { dateStyle: "medium", timeStyle: "short" }]]);
    expect(texts(".recovery-heading")).toEqual([OFFER_HEADING]);
    expect(texts(".recovery-entry-text")).toEqual([ENTRY_TEXT.replace("{file}", "parcels.parquet").replace("{time}", "THE-TIME")]);
    expect(texts(".recovery-recover")).toEqual([RECOVER_LABEL]);
    expect(texts(".recovery-discard")).toEqual([DISCARD_LABEL]);
    expect(texts(".recovery-more")).toEqual([MORE_TEXT]);
  });

  // RECORDED MUTATION for S-2: Discard drops the entry without calling the client. Expected failure: no discard call.
  it("discard_calls_the_kernel_and_drops_the_entry", async () => {
    mocks.list = listing([recordOf(), recordOf({ record: OTHER })]);
    await mount();
    await click(".recovery-discard");
    expect(mocks.discards).toEqual([UNSAVED]);
    expect(container.querySelectorAll(".recovery-entry")).toHaveLength(1);
  });

  // RECORDED MUTATION for S-3: Recover is shown for a `not-found` entry. Expected failure: a Recover control stands.
  it("a_not_found_entry_offers_discard_only", async () => {
    mocks.list = listing([recordOf({ data: { state: "not-found" } })]);
    await mount();
    expect(texts(".recovery-entry-text")).toEqual([NOT_FOUND_TEXT.replace("{file}", "parcels.parquet")]);
    expect(container.querySelectorAll(".recovery-recover")).toHaveLength(0);
    expect(container.querySelectorAll(".recovery-discard")).toHaveLength(1);
  });

  // RECORDED MUTATION for S-7: the entry stays after a Recover that succeeded. Expected failure: both entries stand.
  it("an_entry_leaves_the_list_once_recover_succeeds", async () => {
    mocks.list = listing([recordOf(), recordOf({ record: OTHER })]);
    await mount();
    await click(".recovery-recover");
    expect(mocks.recovers).toEqual([{ record: UNSAVED, dataset: null }]);
    expect(recovered).toHaveLength(1);
    expect(container.querySelectorAll(".recovery-entry")).toHaveLength(1);
  });

  // RECORDED MUTATION for S-8: Recover is shown for a `cannot-be-offered` entry. Expected failure: a Recover control stands.
  it("a_cannot_be_offered_entry_offers_discard_only", async () => {
    mocks.list = listing([
      recordOf({ record: UNSAVED, file_name: null, last_step_at: null, steps: 0, data: { state: "cannot-be-offered", reason: "no-step" } }),
      recordOf({ record: OTHER, file_name: null, last_step_at: null, steps: 0, data: { state: "cannot-be-offered", reason: "later-version" } }),
    ]);
    await mount();
    expect(texts(".recovery-entry-text")).toEqual([UNREADABLE_TEXT, LATER_VERSION_TEXT]);
    expect(container.querySelectorAll(".recovery-recover")).toHaveLength(0);
    expect(container.querySelectorAll(".recovery-discard")).toHaveLength(2);
  });

  // RECORDED MUTATION for M-S9: Old the `recover-refused` line, New the same with `e.skpError` for `refusal`. Expected failure: S-9, at its first case's logs equality.
  // RECORDED MUTATION for M-S9-D: Old the `recover-describe-refused` line, New the same line with the level `recover-refused`. Expected failure: S-9, at its third case's logs equality.
  it("a_refused_recover_or_a_describe_refused_after_it_logs_one_line_with_its_code_and_bounded_message_and_a_success_logs_none", async () => {
    const message = `held \u202E ${"x".repeat(1100)}`;
    mocks.recover = async () => { throw refusal("skp.recoverable_record_locked", message); };
    expect((await admitRecovered(UNSAVED, "k", null)).kind).toBe("refused");
    expect(mocks.logs).toEqual([{ level: "recover-refused", message: `skp.recoverable_record_locked: ${shownText(message)}` }]);

    mocks.logs = [];
    mocks.recover = async () => opened;
    expect((await admitRecovered(UNSAVED, "k", null)).kind).not.toBe("refused");
    expect(mocks.logs).toEqual([]);

    mocks.describe = async () => { throw refusal("skp.unknown_dataset", message); };
    expect((await admitRecovered(UNSAVED, "k", null)).kind).toBe("refused");
    expect(mocks.closes, "describeOpened closed the open").toEqual(["ds_1"]);
    expect(mocks.logs).toEqual([{ level: "recover-describe-refused", message: `skp.unknown_dataset: ${shownText(message)}` }]);
  });

  // RECORDED MUTATION for S-10: Old the `discard-refused` line, New: the line removed. Expected failure: S-10, at its logs equality.
  it("a_refused_discard_logs_one_line_with_its_code_and_message_and_one_that_succeeds_logs_none", async () => {
    mocks.discard = async () => { throw refusal("skp.recoverable_record_unknown", "m"); };
    expect((await discardEntry(UNSAVED))?.code).toBe("skp.recoverable_record_unknown");
    expect(mocks.logs).toEqual([{ level: "discard-refused", message: "skp.recoverable_record_unknown: m" }]);

    mocks.logs = [];
    mocks.discard = async () => ({});
    expect(await discardEntry(UNSAVED)).toBeNull();
    expect(mocks.logs).toEqual([]);
  });
});
