// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Guards `scripts/adrIndex.mjs`, which generates `docs/README.md`'s ADR index from each ADR's own
// Status line. What this file exists to hold: the status cell is the ADR's words, copied -- a
// paraphrase, a truncation or a classification introduced here would be a claim about an ADR that
// the ADR does not make, and nothing else in the repository would fail. The fixtures below are
// written to a temp dir so the cases (a missing Status line, two Status lines) can exist at all:
// accepted ADRs are immutable and are never edited to suit a tool.
//
// The last case reads the REAL `docs/adr/` -- if a new ADR lands whose header this reader cannot
// parse, that lands here rather than in a silently short table.

import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

import {
  ADR_DIR,
  AdrIndexError,
  BEGIN_MARKER,
  END_MARKER,
  HEADER_LINE,
  TABLE_HEADER,
  checkIndex,
  extractIndexBlock,
  readAdrStatuses,
  renderAdrIndex,
  renderIndexBlock,
  withIndexBlock,
} from "../../scripts/adrIndex.mjs";

const tempDirs: string[] = [];

function fixtureDir(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "spatial-adr-index-"));
  tempDirs.push(dir);
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content, "utf8");
  }
  return dir;
}

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

// Three ADRs written out of numeric order, one with a status paragraph that wraps over three
// lines, one whose status contains a pipe, plus two files the reader must ignore.
const THREE_ADRS = {
  "ADR-042-second.md":
    "# ADR-042 — The second one\n\n" +
    "**Status:** Proposed, 2026-09-09 — binds nothing.\n\n" +
    "## Context\n\nBody.\n",
  "ADR-007-first.md":
    "# ADR-007: The first one\n\n" +
    "**Status:** Accepted, 2026-09-01 — carrying the acceptance condition below.\n" +
    "It was implemented ahead of acceptance under an already-accepted license,\n" +
    "the ADR-019 precedent.\n\n" +
    "## Context\n\nBody.\n",
  "ADR-101-third.md":
    "# ADR-101 — The third one\n\n" +
    "**Status:** Accepted — option (a) | option (b) was refused.\n\n" +
    "## Context\n\nBody.\n",
  "PROPOSED-amendment-to-ADR-007-something.md":
    "# A proposed amendment\n\n**Status:** Proposed.\n",
  "README.md": "# Not an ADR\n\n**Status:** Whatever.\n",
};

describe("readAdrStatuses (the ADR's own Status line, copied)", () => {
  it("reads every ADR-0NN file in number order, ignoring the proposed-amendment files", () => {
    const entries = readAdrStatuses(fixtureDir(THREE_ADRS));

    expect(entries.map((entry) => entry.number)).toEqual(["007", "042", "101"]);
    expect(entries.map((entry) => entry.file)).toEqual([
      "ADR-007-first.md",
      "ADR-042-second.md",
      "ADR-101-third.md",
    ]);
    // The H1's own `ADR-0NN — ` / `ADR-0NN: ` prefix is removed, the title otherwise untouched.
    expect(entries.map((entry) => entry.title)).toEqual([
      "The first one",
      "The second one",
      "The third one",
    ]);
  });

  it("joins a wrapped status paragraph verbatim, with no truncation", () => {
    const [first] = readAdrStatuses(fixtureDir(THREE_ADRS));

    expect(first.status).toBe(
      "Accepted, 2026-09-01 — carrying the acceptance condition below. It was implemented ahead " +
        "of acceptance under an already-accepted license, the ADR-019 precedent.",
    );
  });

  it("ends the status at the next front-matter field, not at the next blank line", () => {
    // The shape most ADR headers actually have: Status, then Related/Implemented by with no blank
    // line between them. Those are other fields' words; a cell headed "the ADR's own line" that
    // carried them would misattribute them.
    const dir = fixtureDir({
      "ADR-055-fields.md":
        "# ADR-055 — Header with fields\n\n" +
        "**Status:** Accepted, 2026-09-09 — on the evidence below,\n" +
        "and not architect-blockable.\n" +
        "**Related:** ADR-010 (the invariants this must satisfy)\n" +
        "**Implemented by:** `engine/src/crs.rs`.\n\n" +
        "## Context\n",
    });

    expect(readAdrStatuses(dir)[0].status).toBe(
      "Accepted, 2026-09-09 — on the evidence below, and not architect-blockable.",
    );
  });

  it("reads an unbolded `Status:` header line the same way (ADR-028's own shape)", () => {
    const dir = fixtureDir({
      "ADR-056-unbolded.md":
        "# ADR-056 — Unbolded status\n\n" +
        "Status: **Accepted, 2026-09-02** — the two conditions are both in.\n" +
        "Related: ADR-010 (rules 1, 3, 5, 6)\n\n" +
        "## Context\n",
    });

    expect(readAdrStatuses(dir)[0].status).toBe(
      "**Accepted, 2026-09-02** — the two conditions are both in.",
    );
  });

  it("fails naming the file when an ADR declares no Status line", () => {
    const dir = fixtureDir({ "ADR-077-silent.md": "# ADR-077 — Silent\n\n## Context\n\nBody.\n" });

    expect(() => readAdrStatuses(dir)).toThrow(AdrIndexError);
    expect(() => readAdrStatuses(dir)).toThrow(/ADR-077-silent\.md declares 0 Status lines/);
  });

  it("fails naming the file when an ADR declares two Status lines", () => {
    const dir = fixtureDir({
      "ADR-078-ambiguous.md":
        "# ADR-078 — Ambiguous\n\n" +
        "**Status:** Proposed, 2026-09-01.\n\n" +
        "## Amendment 1\n\n" +
        "**Status:** Accepted, 2026-09-08.\n",
    });

    expect(() => readAdrStatuses(dir)).toThrow(AdrIndexError);
    expect(() => readAdrStatuses(dir)).toThrow(/ADR-078-ambiguous\.md declares 2 Status lines/);
  });

  it("fails naming the file when an ADR has no H1 title", () => {
    const dir = fixtureDir({ "ADR-079-untitled.md": "**Status:** Proposed, 2026-09-09.\n" });

    expect(() => readAdrStatuses(dir)).toThrow(/ADR-079-untitled\.md has no H1 title line/);
  });
});

describe("renderAdrIndex (the table)", () => {
  it("renders one row per ADR in number order, the status verbatim, pipes escaped", () => {
    const table = renderAdrIndex(readAdrStatuses(fixtureDir(THREE_ADRS))).split("\n");

    expect(table[0]).toBe(TABLE_HEADER);
    expect(table[1]).toBe("|---|---|---|");
    expect(table).toHaveLength(5);
    expect(table[2]).toBe(
      "| [ADR-007](adr/ADR-007-first.md) | The first one | Accepted, 2026-09-01 — carrying the " +
        "acceptance condition below. It was implemented ahead of acceptance under an " +
        "already-accepted license, the ADR-019 precedent. |",
    );
    expect(table[3]).toBe(
      "| [ADR-042](adr/ADR-042-second.md) | The second one | Proposed, 2026-09-09 — binds nothing. |",
    );
    // The pipe inside ADR-101's own status text is escaped, not dropped or rewritten.
    expect(table[4]).toBe(
      "| [ADR-101](adr/ADR-101-third.md) | The third one | Accepted — option (a) \\| option (b) " +
        "was refused. |",
    );
  });

  it("puts the header line above the table inside the block", () => {
    const block = renderIndexBlock(readAdrStatuses(fixtureDir(THREE_ADRS)));

    expect(block.startsWith(`${HEADER_LINE}\n\n${TABLE_HEADER}\n`)).toBe(true);
  });
});

describe("checkIndex (`--check`'s core)", () => {
  const entries = () => readAdrStatuses(fixtureDir(THREE_ADRS));
  const readmeWith = (block: string) =>
    `# Docs\n\nNarrative paragraph.\n\n## ADR index (generated)\n\n${BEGIN_MARKER}\n${block}\n${END_MARKER}\n`;

  it("passes when the committed block equals the rendered one", () => {
    const adrs = entries();
    const result = checkIndex(readmeWith(renderIndexBlock(adrs)), adrs);

    expect(result.ok).toBe(true);
    expect(result.message).toBe(
      "adrIndex: PASS -- 3 ADRs, index in docs/README.md matches every Status line",
    );
  });

  it("fails naming the ADR when one character of a status has drifted", () => {
    const adrs = entries();
    const drifted = renderIndexBlock(adrs).replace("Proposed, 2026-09-09", "Proposed, 2026-09-08");
    const result = checkIndex(readmeWith(drifted), adrs);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("adrIndex: FAIL --");
    expect(result.message).toContain("ADR-042");
    expect(result.message).not.toContain("ADR-007");
  });

  it("fails when a row is missing altogether", () => {
    const adrs = entries();
    const short = renderIndexBlock(adrs)
      .split("\n")
      .filter((line) => !line.startsWith("| [ADR-101]"))
      .join("\n");
    const result = checkIndex(readmeWith(short), adrs);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("no row for ADR-101");
  });

  it("fails when the markers are missing", () => {
    const adrs = entries();

    expect(() => checkIndex("# Docs\n\nNo markers here.\n", adrs)).toThrow(AdrIndexError);
    expect(() => checkIndex("# Docs\n\nNo markers here.\n", adrs)).toThrow(
      /must contain exactly one <!-- adr-index:begin --> and one <!-- adr-index:end -->; found 0 and 0/,
    );
  });

  it("fails when the markers are duplicated", () => {
    const adrs = entries();
    const doubled = `${readmeWith(renderIndexBlock(adrs))}\n${readmeWith(renderIndexBlock(adrs))}`;

    expect(() => checkIndex(doubled, adrs)).toThrow(/found 2 and 2/);
  });
});

describe("withIndexBlock (writing the block)", () => {
  it("replaces the block in place, leaving everything around it untouched", () => {
    const readme = `# Docs\n\nNarrative paragraph.\n\n${BEGIN_MARKER}\nold block\n${END_MARKER}\n\nAfter.\n`;
    const written = withIndexBlock(readme, "new block");

    expect(written).toBe(
      `# Docs\n\nNarrative paragraph.\n\n${BEGIN_MARKER}\nnew block\n${END_MARKER}\n\nAfter.\n`,
    );
    expect(extractIndexBlock(written)).toBe("new block");
  });

  it("appends the section when the markers do not exist yet, adding nothing else", () => {
    const written = withIndexBlock("# Docs\n\nNarrative paragraph.\n", "new block");

    expect(written).toBe(
      "# Docs\n\nNarrative paragraph.\n\n## ADR index (generated)\n\n" +
        `${BEGIN_MARKER}\nnew block\n${END_MARKER}\n`,
    );
  });

  it("writes LF only", () => {
    expect(withIndexBlock("# Docs\n", "a\nb")).not.toContain("\r");
  });
});

describe("the real docs/adr", () => {
  it("reads every ADR file in the tree, with a title and a status for each", () => {
    const files = readdirSync(ADR_DIR).filter((name) => /^ADR-\d{3}-.*\.md$/.test(name));
    const entries = readAdrStatuses(ADR_DIR);

    expect(entries).toHaveLength(files.length);
    expect(files.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.title).not.toBe("");
      expect(entry.status).not.toBe("");
    }
  });
});
