// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 Amendment 3, item A: `tauri.conf.json` is JSON, not TypeScript, so `tsc` proves
// nothing about it -- this is the "unit-test the config" this piece's brief asks for. Read via
// `node:fs`, not a TS import: the file lives under `src-tauri/`, outside this package's own
// `tsconfig.json` `include` (`src`), and a plain read keeps this test correct regardless of how
// TypeScript's module graph is configured.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const configPath = join(here, "..", "..", "src-tauri", "tauri.conf.json");
const config = JSON.parse(readFileSync(configPath, "utf8")) as {
  bundle: {
    targets: unknown;
    windows?: { nsis?: { installMode?: unknown } };
    resources?: unknown;
  };
};

describe("frontends/shell/src-tauri/tauri.conf.json (RELEASE-0.1 item A)", () => {
  it("bundles exactly nsis -- the human's ruling: NSIS only, no MSI", () => {
    expect(config.bundle.targets).toEqual(["nsis"]);
  });

  it("installs per-user, no elevation (tauri-utils 2.9.3 NSISInstallerMode::CurrentUser -- \"doesn't require Administrator access\")", () => {
    expect(config.bundle.windows?.nsis?.installMode).toBe("currentUser");
  });

  it("ships the bundle viewer's dist/ as a named resource directory", () => {
    const resources = config.bundle.resources as Record<string, string>;
    expect(resources).toBeTruthy();
    const viewerEntry = Object.entries(resources).find(([source]) =>
      source.includes("renderer/bundle-viewer/dist")
    );
    expect(viewerEntry, "no resources entry maps the bundle viewer's dist/").toBeTruthy();
    expect(viewerEntry?.[1]).toBe("bundle-viewer/");
  });

  it("ships the generated NOTICE.txt beside the executable", () => {
    const resources = config.bundle.resources as Record<string, string>;
    const noticeEntry = Object.entries(resources).find(([, target]) => target === "NOTICE.txt");
    expect(noticeEntry, "no resources entry ships NOTICE.txt beside the exe").toBeTruthy();
    expect(noticeEntry?.[0]).toContain("generated/NOTICE.txt");
  });
});
