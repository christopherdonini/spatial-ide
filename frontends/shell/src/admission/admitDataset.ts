// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { logSessionEvent } from "../diagnostics/log";
import { traceDescribeBounds } from "../diagnostics/renderTrace";
import { begin, end } from "../diagnostics/watchdog";
import { closeDataset, describe as describeDataset, openDataset, SkpCallError } from "../skp/client";
import type { Reopened } from "../project/openProject";
import type { CrsAssertion, DescribeResponse, IdentityDeclaration, ReopenAnswer } from "../skp/types";
import { formatRefusal, FormattedRefusal } from "./formatRefusal";

export interface Admitted {
  dataset: string;
  describe: DescribeResponse;
  /** `skp/0.5` (ADR-035 D4): this open's kernel-minted session reference, returned once on
   * `OpenDatasetResponse.session`. Authorizes nothing; used only to route a later
   * `dataset_session_ended` event to this open (`skp/events.ts`; `App.tsx`'s listener). */
  session: string;
}

/** B2 piece 1c (Amendment 54 item 5 (b)): a reopen's run (`project/openProject.ts`'s `admitProject`) adds `reopened` to its admission, an owner
 * place to its refusal, and ends at a `question` or a `not_found` (O-14), whose `fileName` is bounded. This function returns neither. */
export type AdmissionOutcome =
  | { kind: "admitted"; admitted: Admitted; reopened?: Reopened }
  | { kind: "refused"; refusal: FormattedRefusal; owner?: string | null }
  | { kind: "question" }
  | { kind: "not_found"; fileName: string | null };

/** `skp/0.2` remediation options (NEXT-CUT.md P3): re-entering this SAME function with one of
 * these set is the ONLY way the shell ever asserts a CRS or declares an identity column -- there
 * is no parallel admission path. Both default to unset, matching a plain re-open.
 *
 * `setAsideFileId` (`skp/0.16`, ADR-016 Amendment 3) is the user's choice to open a file whose own `id` column cannot serve by row position, for this session. It is `true` or absent, never `false`:
 * the only place that sets it is the button's click (`RowPositionChoice`), no default and no inference sets it, and a declaration's options drop it (`declarationOptions`,
 * `refusedDeclarationOptions`). It travels beside no `identity`.
 *
 * `reopen` (B2 piece 1c) marks a reopen's run: its answer to a `question` and its re-link, each `null` for none. It is read by `admitProject`
 * alone, and a run that carries it never reaches this function or a remediation form. */
export interface AdmitOptions {
  crsAssertion?: CrsAssertion | null;
  identity?: IdentityDeclaration | null;
  setAsideFileId?: true;
  reopen?: { answer: ReopenAnswer | null; relink: string | null };
}

/**
 * The admission flow's orchestration, isolated from React so it can be unit-tested directly:
 * `open_dataset` → on success, `describe` → success or typed refusal is the product truth
 * (NEXT-CUT.md). Any non-`SkpError` failure is rethrown rather than swallowed, so it still reaches
 * the global handlers ADR-010 rule 7 installs -- this function only ever turns a *typed* refusal
 * into product UI; an unexpected failure is exactly what those handlers exist for. A `describe` that
 * fails, typed or not, first sends `close_dataset` for the opened handle (`describeOpened`), and the failure
 * goes on when the close settles or once `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first.
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
    const { dataset, session } = await openDataset(path, cancelKey, crsAssertion, identity, options.setAsideFileId === true);
    end("open_dataset");

    begin("describe");
    const describeResult = await describeOpened(dataset);
    end("describe");
    traceDescribeBounds(dataset, describeResult.extent);

    return { kind: "admitted", admitted: { dataset, describe: describeResult, session } };
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

/**
 * How long a `describe` that failed after a handle was returned waits for that handle's close before its error goes on. It is the delay of the
 * timer that ends that wait; a timer runs at its delay or later (taken from documentation, not read in this repo). It is under the watchdog's
 * `WATCHDOG_PHASE_TIMEOUT_MS` (5_000 ms, `diagnostics/watchdog.ts`), so the close alone does not hold the `describe` phase past it, unless that
 * timer runs late. It is declared, not measured.
 */
export const DESCRIBE_FAILED_CLOSE_WAIT_MS = 2_000;

/**
 * `describe` on a handle that `open_dataset` or `open_project` has just returned (`admitDataset`, `project/openProject.ts`'s `admitProject`).
 * On any rejection it sends `close_dataset` for that handle, waits until the close settles or `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed since
 * it was sent, whichever is first, clears its timer, and rejects with the same error it caught. The close's reply and any rejection of it are
 * dropped, whenever they come; after the bound the close is left running.
 */
export async function describeOpened(dataset: string): Promise<DescribeResponse> {
  try {
    return await describeDataset(dataset);
  } catch (e) {
    const closed = closeDataset(dataset).then(() => {}, () => {});
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, DESCRIBE_FAILED_CLOSE_WAIT_MS);
    });
    await Promise.race([closed, deadline]);
    clearTimeout(timer);
    throw e;
  }
}
