// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { logSessionEvent } from "../diagnostics/log";
import { traceDescribeBounds } from "../diagnostics/renderTrace";
import { begin, end } from "../diagnostics/watchdog";
import { describe as describeDataset, openDataset, SkpCallError } from "../skp/client";
import type { CrsAssertion, DescribeResponse, IdentityDeclaration } from "../skp/types";
import { formatRefusal, FormattedRefusal } from "./formatRefusal";

export interface Admitted {
  dataset: string;
  describe: DescribeResponse;
}

export type AdmissionOutcome =
  | { kind: "admitted"; admitted: Admitted }
  | { kind: "refused"; refusal: FormattedRefusal };

/** `skp/0.2` remediation options (NEXT-CUT.md P3): re-entering this SAME function with one of
 * these set is the ONLY way the shell ever asserts a CRS or declares an identity column -- there
 * is no parallel admission path. Both default to unset, matching a plain re-open. */
export interface AdmitOptions {
  crsAssertion?: CrsAssertion | null;
  identity?: IdentityDeclaration | null;
}

/**
 * The admission flow's orchestration, isolated from React so it can be unit-tested directly:
 * `open_dataset` → on success, `describe` → success or typed refusal is the product truth
 * (NEXT-CUT.md). Any non-`SkpError` failure is rethrown rather than swallowed, so it still reaches
 * the global handlers ADR-010 rule 7 installs -- this function only ever turns a *typed* refusal
 * into product UI; an unexpected failure is exactly what those handlers exist for.
 */
export async function admitDataset(
  path: string,
  cancelKey: string,
  options: AdmitOptions = {}
): Promise<AdmissionOutcome> {
  const crsAssertion = options.crsAssertion ?? null;
  const identity = options.identity ?? null;
  begin("open_dataset");
  try {
    const { dataset } = await openDataset(path, cancelKey, crsAssertion, identity);
    end("open_dataset");

    begin("describe");
    const describeResult = await describeDataset(dataset);
    end("describe");
    traceDescribeBounds(dataset, describeResult.extent);

    return { kind: "admitted", admitted: { dataset, describe: describeResult } };
  } catch (e) {
    end("open_dataset");
    end("describe");
    if (e instanceof SkpCallError) {
      logSessionEvent("admission-refused", `${e.skpError.code}: ${e.skpError.message}`);
      return { kind: "refused", refusal: formatRefusal(e.skpError) };
    }
    throw e;
  }
}
