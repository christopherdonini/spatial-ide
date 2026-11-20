// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 54 item 5 (b), (g), (j) and (l), and Amendment 55's table: the reopen's `admit`, its
 * refusal routing, and the places of an opened reply, as pure functions over the mocked client. No test here asserts a place's words.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  reply: null as null | (() => Promise<unknown>),
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
    openProject: async () => mocks.reply!(),
    describe: async () => ({ schema: [] }),
  };
});
vi.mock("../diagnostics/log", () => ({ logSessionEvent: (level: string, message: string) => mocks.logs.push({ level, message }) }));

import { SkpCallError } from "../skp/client";
import type { ReopenLineage } from "../skp/types";
import { DEFAULT_STYLE_STATE, toStyleDocument } from "../style/document";
import { admitProject, lineagePlaces, reopenApply, reopenRefusalPlace } from "./openProject";
import {
  colourByNotRestoredNotice,
  ENGINE_REFUSAL_NOTICE,
  KNOWN_FOLDERS_FULL_NOTICE,
  LINEAGE_NOT_KEPT_NOTICE,
  LINEAGE_NOT_RECORDED_NOTICE,
  lineageFileRefusedNotice,
  MACHINE_RECORD_REFUSED_NOTICE,
  OPEN_ELSEWHERE_OTHER_NOTICE,
  OPEN_ELSEWHERE_OWN_NOTICE,
  OPEN_PANICKED_NOTICE,
  REOPEN_LOCATOR_REFUSAL_NOTICE,
  REOPEN_REFUSAL_NOTICE,
  viewNotAppliedNotice,
  workspaceTextNotice,
} from "./reopenNotices";
import { shownText } from "./shownText";

const HIDDEN = /[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029]/;
const PROJECT = "spatial://project/0000000000000000000000000000000a";

beforeEach(() => {
  mocks.reply = null;
  mocks.logs = [];
});

describe("the lineage facts' places (Amendment 55, T-14)", () => {
  // RECORDED MUTATION for T-14: in `lineagePlaces` (project/openProject.ts) every fact other than none maps to S16. Expected failure: `recorded` with
  // `null` shows S16.
  it("each lineage fact maps to its place and no rule text is shown", () => {
    const S16 = LINEAGE_NOT_RECORDED_NOTICE;
    const S17 = LINEAGE_NOT_KEPT_NOTICE;
    const places = (folder_file: ReopenLineage["folder_file"], previous_file: ReopenLineage["previous_file"]) => lineagePlaces({ folder_file, previous_file });
    expect(places("recorded", null)).toEqual([S17]);
    expect(places("recorded-with-lines-after", null)).toEqual([S17]);
    expect(places("absent", "used")).toEqual([S17]);
    expect(places("absent", "absent")).toEqual([S17]);
    expect(places("not-read", "used")).toEqual([S17]);
    expect(places("not-the-recorded-one", "used"), "S16 once, before S17").toEqual([S16, S17]);
    expect(places("not-the-recorded-one", "not-the-recorded-one")).toEqual([S16, S17]);
    const damaged = { reason: "damaged", line: 3 } as const;
    const over = { reason: "over-bound", line: null, limit: 4096 } as const;
    expect(places({ refused: damaged }, { refused: over }), "each refused file's line, before S17").toEqual([lineageFileRefusedNotice(damaged), lineageFileRefusedNotice(over), S17]);
    expect(places("absent", { refused: { reason: "through-link" } })).toEqual([lineageFileRefusedNotice({ reason: "through-link" }), S17]);
    expect(lineageFileRefusedNotice(damaged), "the reason word and its line alone").toContain("damaged, line 3");
    expect(places("absent", null), "no place").toEqual([]);
    expect(places("not-read", null)).toEqual([]);
  });
});

describe("the refusal routing (Amendment 54 item 5 (g); ADV-2026-11-20-05 item 4)", () => {
  it("each reopen code takes its owner's place, one at most", () => {
    const place = (code: string, fields: Record<string, string> = {}, held: string | null = null) =>
      reopenRefusalPlace({ code, message: "m", fields: Object.entries(fields) }, held);
    expect(place("engine.crs_unknown")).toBe(ENGINE_REFUSAL_NOTICE);
    expect(place("engine.cancelled"), "the cancelled note, not a refusal").toBeNull();
    expect(place("skp.open_project_panicked")).toBe(OPEN_PANICKED_NOTICE);
    expect(place("skp.project_open_elsewhere", { project: PROJECT }, PROJECT)).toBe(OPEN_ELSEWHERE_OWN_NOTICE);
    expect(place("skp.project_open_elsewhere", { project: PROJECT }, null)).toBe(OPEN_ELSEWHERE_OTHER_NOTICE);
    expect(place("skp.project_known_folders_full", { project: PROJECT, count: "64" })).toBe(KNOWN_FOLDERS_FULL_NOTICE);
    expect(place("skp.project_machine_record_refused", { file: "folders.json", rule: "r" })).toBe(MACHINE_RECORD_REFUSED_NOTICE);
    expect(place("skp.project_target_unresolvable", { locator: "data/a.parquet", segment: "data" })).toBe(REOPEN_LOCATOR_REFUSAL_NOTICE);
    for (const code of ["skp.project_target_unresolvable", "skp.project_file_unwritable", "skp.cancel_key_in_use", "skp.unknown_dataset", "skp.project_file_refused"]) {
      expect(place(code, code === "skp.project_target_unresolvable" ? { folder: "C:/p" } : {}), code).toBe(REOPEN_REFUSAL_NOTICE);
    }
  });
});

describe("the bound at a reopen's run (Amendment 54 item 5 (j) and (l), T-12)", () => {
  it("a refusal is bounded once and logged in one line; a file name is bounded", async () => {
    const path = `C:/${"q".repeat(1997)}`;
    mocks.reply = async () => {
      throw new SkpCallError({ code: "skp.project_file_unreadable", message: `\u202E${path}`, fields: { detail: `os \u0007 ${path}` } });
    };
    const outcome = await admitProject("C:/p", "k1", { reopen: { answer: null, relink: null } });
    expect(outcome.kind).toBe("refused");
    if (outcome.kind !== "refused") return;
    expect(HIDDEN.test(outcome.refusal.message + outcome.refusal.fields.map(([, v]) => v).join(""))).toBe(false);
    expect(outcome.refusal.message).toBe(shownText(`\u202E${path}`));
    expect(outcome.refusal.fields).toEqual([["detail", shownText(`os \u0007 ${path}`)]]);
    expect(outcome.owner).toBe(REOPEN_REFUSAL_NOTICE);
    expect(mocks.logs).toEqual([{ level: "reopen-refused", message: `skp.project_file_unreadable: ${shownText(`\u202E${path}`)}` }]);

    const name = `\u202E${"n".repeat(1500)}.parquet`;
    mocks.reply = async () => ({ not_found: { file_name: name } });
    expect(await admitProject("C:/p", "k2", { reopen: { answer: "same", relink: null } })).toEqual({ kind: "not_found", fileName: shownText(name) });
    mocks.reply = async () => ({ question: { kind: "copy-or-same" } });
    expect(await admitProject("C:/p", "k3", { reopen: { answer: null, relink: null } })).toEqual({ kind: "question" });
  });

  // RECORDED MUTATION for T-9's bounded column: in `reopenApply` (project/openProject.ts) O-18's column is passed as the file gives it. Expected
  // failure: the notice holds U+202E.
  it("T-9: O-18's place names the column, bounded; S19's basis is bounded", () => {
    const column = `zone\u202E${"z".repeat(1100)}`;
    const match = { column, cases: [{ when: "a", then: "#ff0000" }], on_null: "#000000", on_unmatched: "#111111" };
    const layer = toStyleDocument(DEFAULT_STYLE_STATE).layer as unknown as Record<string, unknown>;
    const basis = `\u0007${"b".repeat(1100)}`;
    const applied = reopenApply(
      {
        project: PROJECT,
        workspace: { filter: null, clauses: [], style: { style_version: 1, layer: { ...layer, fill_color: { match } } }, view: { centre: ["0000000000000000", "0000000000000000"], zoom: "0000000000000000" } },
        view: { state: "saved-in-another-space", basis },
        check: { observed: [], admission: [] },
        lineage: { folder_file: "absent", previous_file: null },
        relinked: false,
      },
      ["id"]
    );
    // The column holds U+202E, so W-TEXT names the style, between S19 and O-18 (reopenApply's order).
    expect(applied.notices).toEqual([viewNotAppliedNotice(shownText(basis)), workspaceTextNotice(["style"]), colourByNotRestoredNotice(shownText(column))]);
    expect(applied.style.fillMatch).toBeNull();
    expect(applied.view, "not applied").toBeNull();
  });
});
