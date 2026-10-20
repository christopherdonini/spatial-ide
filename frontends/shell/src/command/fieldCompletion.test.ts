// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { FIELD_COMPLETION_MAX_OPTIONS } from "./commandConstants";
import { completeField, fieldOptions, fieldTrigger, quoteName } from "./fieldCompletion";
import type { FieldSource } from "./fieldCompletion";

/** SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC6 (PR B, OPEN-4 (a)): field completion, pure. */
const source: FieldSource = {
  geometryColumn: "geometry",
  schema: [
    { name: "id", arrow_type: "UInt64" },
    { name: "zone", arrow_type: "Utf8" },
    { name: "geometry", arrow_type: "Binary" },
    { name: 'a"b', arrow_type: "Float64" },
    { name: "Zone2", arrow_type: "Int32" },
  ],
};
const namesFor = (partial: string) => fieldOptions(source, partial).options.map((option) => option.name);
/** The trigger in a draft whose condition starts after `/filter ` (8 characters), the caret at the end unless given. */
const at = (text: string, caret = text.length) => fieldTrigger(text, 8, caret);

// RECORDED MUTATION for "UC6": in `quoteName` (fieldCompletion.ts) do not double an embedded quote (`"${name}"`). Expected failure: the a"b case.
describe("UC6: field completion", () => {
  it("UC6: candidates are the schema without the geometry column in order, matched case-insensitively, options carry name and arrow_type only, at most FIELD_COMPLETION_MAX_OPTIONS, and insertion is double-quoted with the quote doubled", () => {
    expect(namesFor(""), "the schema in order, without the geometry column").toEqual(["id", "zone", 'a"b', "Zone2"]);
    expect(namesFor("ZO"), "case-insensitive").toEqual(["zone", "Zone2"]);
    expect(namesFor("geo"), "the geometry column is never offered").toEqual([]);
    expect(fieldOptions(source, "id").options, "name and arrow_type verbatim, nothing else").toEqual([{ name: "id", arrowType: "UInt64" }]);

    expect(quoteName("zone")).toBe('"zone"');
    expect(quoteName('a"b'), 'an embedded quote is doubled: a"b').toBe('"a""b"');
    expect(at('/filter @a"'), "a quote is not a name character: no trigger at the end").toBeNull();
    expect(completeField('/filter ("x" = 1) AND @a', at('/filter ("x" = 1) AND @a')!, 'a"b')).toBe('/filter ("x" = 1) AND "a""b"');
    expect(completeField("/filter @zo = 'r'", at("/filter @zo = 'r'", 11)!, "zone"), "the text after the caret is kept").toBe(`/filter "zone" = 'r'`);

    const many: FieldSource = { geometryColumn: "g", schema: Array.from({ length: FIELD_COMPLETION_MAX_OPTIONS + 1 }, (_, i) => ({ name: `c${i}`, arrow_type: "Int32" })) };
    expect(fieldOptions(many, "")).toMatchObject({ more: true });
    expect(fieldOptions(many, "").options).toHaveLength(FIELD_COMPLETION_MAX_OPTIONS);
    expect(fieldOptions({ ...many, schema: many.schema.slice(1) }, "")).toMatchObject({ more: false });
  });

  // RECORDED MUTATION for "UC6 (the trigger)": in `fieldTrigger` (fieldCompletion.ts) let the `@` follow any character (`(^|[\s(])` becomes `(^|.)`). Expected failure: the row where the `@` follows a letter.
  it("UC6: the @ trigger is at the condition's start or after whitespace or (, with name characters up to the caret", () => {
    expect(at("/filter @zo")).toEqual({ start: 8, end: 11, partial: "zo" });
    expect(at("/filter  @")).toEqual({ start: 9, end: 10, partial: "" });
    expect(at("/filter a = 1 AND @z")?.partial).toBe("z");
    expect(at("/filter (@z")?.partial).toBe("z");
    expect(at("/filter a@z"), "after a letter").toBeNull();
    expect(at("/filter 'x@z"), "after a quote").toBeNull();
    expect(at("/filter @zo x"), "the caret is past the name").toBeNull();
    expect(at("/filter @zone x", 11), "the caret in the middle: the partial stops at it").toEqual({ start: 8, end: 11, partial: "zo" });
    expect(at("/filter zone"), "no @").toBeNull();
  });
});
