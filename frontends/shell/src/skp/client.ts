// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";

import { consoleRecorder } from "../console/recorder";
import type { DecU64 } from "./codec";
import {
  Bbox,
  CancelResponse,
  CloseDatasetResponse,
  CrsAssertion,
  DescribeResponse,
  DiscardRecoverableResponse,
  Filter,
  IdentityDeclaration,
  ListRecoverableResponse,
  OpenDatasetResponse,
  OpenProjectResponse,
  ProjectWorkspace,
  ReopenAnswer,
  RecordStepResponse,
  RecoverSessionResponse,
  SaveProjectResponse,
  SkpError,
  SKP_VERSION,
  StepIntent,
  ViewportQueryResponse,
} from "./types";

/** Thrown when the host returns a typed `SkpError` -- never a bare string, so a caller can branch
 * on `.skpError.code` the way `protocol/skp/SKP-V0.md` §5 intends. */
export class SkpCallError extends Error {
  readonly skpError: SkpError;
  constructor(skpError: SkpError) {
    super(`${skpError.message} (${skpError.code})`);
    this.name = "SkpCallError";
    this.skpError = skpError;
  }
}

function isSkpError(value: unknown): value is SkpError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    "fields" in value &&
    typeof (value as SkpError).code === "string"
  );
}

async function call<Res>(command: string, request: Record<string, unknown>): Promise<Res> {
  // The console's ONE capture site (NEXT-CUT.md I1; `console/soleCaptureSite.test.ts` enforces
  // it). `request` is recorded by reference -- the exact object handed to `invoke` below, never
  // cloned (I2) -- pre-await, then resolved post-await on every path including a throw, so the
  // recorder is observationally invisible to this function's own contract with its callers: it
  // never changes what is returned or thrown, only observes it.
  // `command` is captured on the entry too (NEXT-CUT.md P3): `DescribeRequest` and
  // `CloseDatasetRequest` are both exactly `{skp, dataset}` on the wire, so the request object
  // alone cannot tell the console's panel which of the seven commands this was.
  const entry = consoleRecorder.record(request, command);
  try {
    const result = await invoke<Res>(command, { request });
    entry.resolveOk();
    return result;
  } catch (e) {
    if (isSkpError(e)) {
      entry.resolveRefused(e);
      throw new SkpCallError(e);
    }
    entry.resolveThrew(e instanceof Error ? e.message : String(e));
    throw e;
  }
}

/**
 * `crs_assertion`/`identity` are `null`, defaulting to `null` -- the cut-1 open path is
 * unaffected. Sent explicitly (never omitted), matching `filter`'s own discipline above: both are
 * `Option<T>` on the Rust side with no `#[serde(default)]`. This function does not admit either
 * value; only the kernel does, and it may refuse it (NEXT-CUT.md P0: protocol only, no logic
 * here). The wire carries no attribution -- no `by`, no `at` -- the host mints both (ADR-004
 * Amendment 4; ADR-024 F-5).
 *
 * `setAsideFileId` (`skp/0.16`, ADR-016 Amendment 3) is the user's choice to open a file whose own `id` column cannot serve by row position, for this session only. It is `false`
 * unless the caller says otherwise, and is sent as the member `set_aside_file_id`, always present, never beside `identity`.
 */
export function openDataset(
  path: string,
  cancelKey: string,
  crsAssertion: CrsAssertion | null = null,
  identity: IdentityDeclaration | null = null,
  setAsideFileId = false
): Promise<OpenDatasetResponse> {
  return call("open_dataset", {
    skp: SKP_VERSION,
    path,
    cancel_key: cancelKey,
    crs_assertion: crsAssertion,
    identity,
    set_aside_file_id: setAsideFileId,
  });
}

export function describe(dataset: string): Promise<DescribeResponse> {
  return call("describe", { skp: SKP_VERSION, dataset });
}

/**
 * `filter` is `Filter | null`, required -- it is the ONE function both `FilterPanel`'s Apply
 * and the dev-only E2E hook (`e2e-test-surface.ts`'s `queryWithFilter`, wired through
 * `ViewportStreamManager.requestViewport`) call to actually send one (NEXT-CUT.md P5: "client only,
 * no logic" -- this function does not parse, admit, or otherwise inspect `filter.predicate`; only
 * the kernel does, and it may refuse it). `filter: null` is sent explicitly, never omitted, matching
 * the `bbox_crs` discipline (SKP-V0.md "v0.1" section): `ViewportQueryRequest.filter` is
 * `Option<Filter>` with no `#[serde(default)]` on the Rust side, so an absent key is a deserialize
 * failure, not a tolerated omission. `columns` is required for the same reason and sent the same way.
 */
export function viewportQuery(
  dataset: string,
  bbox: Bbox | null,
  bboxCrs: string | null,
  limit: DecU64 | null,
  filter: Filter | null,
  columns: string[] | null
): Promise<ViewportQueryResponse> {
  return call("viewport_query", {
    skp: SKP_VERSION,
    dataset,
    bbox,
    bbox_crs: bboxCrs,
    limit,
    filter,
    // `skp/0.6`: the caller's projection set, sent as given (`projectionFor`'s list, or `null`
    // when no column is projectable); `null` is sent as `null`, never omitted.
    columns,
  });
}

export function cancel(handle: string): Promise<CancelResponse> {
  return call("cancel", { skp: SKP_VERSION, handle });
}

export function closeDataset(dataset: string): Promise<CloseDatasetResponse> {
  return call("close_dataset", { skp: SKP_VERSION, dataset });
}

/**
 * `skp/0.12`: records, in the kernel's session history, one change the shell has already committed
 * and applied. Client only: this function does not check `intent`; the kernel does, and may refuse it.
 * `intent` is sent as given (a filter's `filter` is `null` for no filter, never omitted).
 */
export function recordStep(dataset: string, intent: StepIntent): Promise<RecordStepResponse> {
  return call("record_step", { skp: SKP_VERSION, dataset, intent });
}

/**
 * `skp/0.13`: saves the workspace as the project of an open dataset. Client only: this function checks
 * nothing; the kernel does, and may refuse the save. `folder` is the folder the native picker gave, at
 * the first save of an open, and `null` at every later one -- sent as `null`, never omitted, as the
 * request's other optional members are (`key_present` on the Rust side).
 */
export function saveProject(dataset: string, folder: string | null, workspace: ProjectWorkspace): Promise<SaveProjectResponse> {
  return call("save_project", { skp: SKP_VERSION, dataset, folder, workspace });
}

/**
 * `skp/0.14`: reopens a saved project (SKP-V0.md section 12). Client only: this function checks nothing; the kernel does, and may refuse
 * the reopen. `answer` is `null` at the first call and the client's answer to a `question` reply at the second; `relink` is `null`, or the
 * absolute path of the data file the client chose after a `not_found` reply. Both are sent as `null`, never omitted (`key_present` on the
 * Rust side). The call keeps no state between its two calls: the reply names the next one. `setAsideFileId` (`skp/0.16`) is the user's choice at this call alone,
 * `false` unless the caller says otherwise: the project file records nothing of it.
 */
export function openProject(
  folder: string,
  cancelKey: string,
  answer: ReopenAnswer | null,
  relink: string | null,
  setAsideFileId = false
): Promise<OpenProjectResponse> {
  return call("open_project", {
    skp: SKP_VERSION,
    folder,
    cancel_key: cancelKey,
    answer,
    relink,
    set_aside_file_id: setAsideFileId,
  });
}

/**
 * `skp/0.18`: lists the sessions an earlier run left (`dataset` `null`), or a reopen's project's record (that open's handle). Client only: this function checks nothing; the kernel
 * does. `dataset` is sent as `null`, never omitted.
 */
export function listRecoverable(dataset: string | null): Promise<ListRecoverableResponse> {
  return call("list_recoverable", { skp: SKP_VERSION, dataset });
}

/**
 * `skp/0.18`: takes a listed record into this run. With `dataset` `null` the kernel opens the record's data under `cancelKey`; with a handle it opens nothing. Client only. `dataset` is
 * sent as `null`, never omitted.
 */
export function recoverSession(record: string, cancelKey: string, dataset: string | null): Promise<RecoverSessionResponse> {
  return call("recover_session", { skp: SKP_VERSION, record, cancel_key: cancelKey, dataset });
}

/** `skp/0.18`: removes a record that is not held. Client only. */
export function discardRecoverable(record: string): Promise<DiscardRecoverableResponse> {
  return call("discard_recoverable", { skp: SKP_VERSION, record });
}
