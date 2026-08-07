// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Reading the manifest, and refusing one this build does not implement.
 *
 * The manifest is the bundle's contract (ADR-017). This reader treats it as one.
 *
 * ## Exact key sets, not merely "no unknown keys"
 *
 * ADR-017 §5 says every member it defines is **required**, and §3 says a conforming reader
 * **refuses an unknown key** in any object the document defines. Together those make each object's
 * key set *exactly* the declared set — so this reader checks both directions at once, per object,
 * with [`exactKeys`].
 *
 * **A reader looser than its specification makes the specification a lie**, and in two distinct
 * ways. A missing member that this reader tolerates is a member a writer can stop emitting without
 * anyone noticing, so the "required" in §5 becomes decoration. An extra member it tolerates makes
 * adding a key a non-breaking change — which destroys §9's whole reason for reserving
 * `derived_caches` and `query_surface` in v1, because reserving a slot only buys anything if
 * occupying an *unreserved* one would have been refused.
 *
 * The strictness is therefore not fastidiousness; it is the thing several of the format's stated
 * guarantees actually rest on. `scripts/manifest.test.mjs` mutates every object in both directions
 * — one field removed, one field added — and asserts each is refused, because a check nobody has
 * seen fail is a check nobody has tested.
 *
 * ## What it does not check
 *
 * It validates **shape**, not truth: that `content_hash` is a string, never that it is the right
 * hash. Hashes are verified against fetched bytes in `main.ts`, and the envelope facts against the
 * decoded partition in `partition.ts`. Splitting it that way is deliberate — this file can be run
 * against a string, and is.
 */

import { BundleFailure, type FailureState } from './failure.js';

/** The one manifest version this build implements. */
export const SUPPORTED_BUNDLE_VERSION = 1;

/**
 * **The single table of ADR-017 §5's member sets, used by this reader and read by both sides' tests.**
 *
 * Before this existed, the reader's sets and the writer's assertion lived in two independently
 * hand-maintained tables, and passing both proved less than it looked: editing the reader *and* its
 * own test kept JS green while every real bundle became unreadable, and editing the writer *and* its
 * own table kept Rust green while the reader still refused. What that arrangement guarantees is
 * "neither side can move without **its own** table failing" — which is not the same as the two
 * agreeing.
 *
 * So the sets live in `renderer/tests/data/manifest-key-sets.json`, this constant is checked against
 * that file by `scripts/manifest.test.mjs`, and
 * `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares` checks
 * the **emitted** manifest against the same file. Neither side generates it from its own output —
 * the discipline `renderer/tests/data/style-agreement.json` already uses for style resolution.
 */
export const MANIFEST_KEY_SETS: Readonly<Record<string, readonly string[]>> = {
  $: [
    'bundle_version', 'bundle', 'source', 'source_verification', 'style', 'software', 'operation',
    'crs', 'identity', 'schema', 'bounds', 'data', 'viewer', 'viewer_license', 'license',
    'reproducibility', 'derived_caches', 'query_surface', 'sidecar',
  ],
  resource_ref: [
    'logical_uri', 'content_hash', 'source_revision', 'locators', 'cache_status',
    'portability_policy',
  ],
  locator: ['kind', 'at'],
  unknown_state: ['state', 'basis'],
  '$.style': ['resource', 'style_version', 'match_column'],
  '$.software': [
    'engine_crate_version', 'kernel_crate_version', 'renderer_crate_version',
    'arrow_crate_version_requirement', 'duckdb_library_version', 'bundle_writer_version', 'note',
  ],
  '$.operation': [
    'digest_version', 'operation', 'source_logical_uri', 'source_content_hash', 'id_source',
    'id_uniqueness', 'id_verified_rows', 'crs_identifier', 'crs_source', 'axis_order',
    'axis_normalization', 'crs_definition_hash', 'filter', 'limit', 'projection', 'ordering',
    'format', 'style_hash', 'digest',
  ],
  filter_whole_file: ['kind'],
  filter_covering_bbox: ['kind', 'xmin', 'ymin', 'xmax', 'ymax', 'bbox_crs'],
  format: [
    'framing', 'compression', 'dictionaries', 'geometry_encoding', 'coordinate_layout',
    'partition_target_bytes', 'partition_max_rows', 'partition_boundary_rule', 'max_partitions',
  ],
  '$.crs': [
    'source', 'source_definition', 'display', 'transform', 'crs_source', 'axis_order',
    'axis_normalization',
  ],
  '$.identity': ['id_source', 'id_uniqueness', 'id_verified_rows', 'id_js_exact', 'caveat'],
  column: ['name', 'arrow_type', 'nullable'],
  '$.bounds': ['xmin', 'ymin', 'xmax', 'ymax', 'crs', 'basis'],
  '$.data': ['rows', 'format', 'partitions'],
  partition: ['path', 'bytes', 'content_hash', 'rows'],
  viewer_asset: ['path', 'bytes', 'content_hash'],
  viewer_license: ['program', 'copyright', 'license', 'notice_path', 'corresponding_source'],
  viewer_license_corresponding_source: ['kind', 'at', 'note'],
  license_not_declared: ['state', 'basis'],
  license_declared_by_source: ['state', 'license', 'attribution', 'redistribution'],
  license_declared_by_operator: [
    'state', 'license', 'attribution', 'redistribution', 'by', 'at',
  ],
  '$.reproducibility': ['grade', 'basis', 'why_not_higher'],
  '$.query_surface': ['available', 'reserved_for'],
  '$.sidecar': ['path', 'hashed', 'verified', 'note'],
} as const;

/** Anything this reader may fetch and hash: a partition, a viewer asset, or the style. */
export interface FetchableAsset {
  path: string;
  /**
   * `null` **only** for the style, which ADR-017 lists with a content hash and no byte count. For
   * partitions and viewer assets this is always an integer, because §5 makes `bytes` required
   * there. Never `0` as a stand-in for "unknown".
   */
  bytes: number | null;
  contentHash: string;
}

export interface PartitionAsset extends FetchableAsset {
  bytes: number;
  /** Required on a partition entry (§5). Absent here means the manifest is malformed, not empty. */
  rows: number;
}

export interface ViewerAsset extends FetchableAsset {
  bytes: number;
}

export interface ManifestColumn {
  name: string;
  arrowType: string;
  nullable: boolean;
}

/**
 * The notice a bundle carries for **the code it is running**, as opposed to the data it is drawing.
 *
 * ADR-017 Corrigendum 3, discharging ADR-009 item 7. A viewer that carried this and never showed it
 * would leave a page displaying the *data*'s terms while silent about the terms of the *program the
 * recipient is running*, which is the thing the obligation exists to prevent — so §14 makes
 * displaying it normative and `main.ts` renders every field below.
 */
export interface ViewerLicenseNotice {
  program: string;
  copyright: string;
  license: string;
  /** Bundle-relative, and guaranteed to be one of the `viewer[]` entries. */
  noticePath: string;
  correspondingSource: { kind: 'url' | 'written-offer'; at: string };
}

export interface Manifest {
  bundleVersion: number;
  crsSource: string;
  crsDisplay: string;
  crsTransform: string;
  idSource: string;
  idUniqueness: string;
  identityCaveat: string;
  schema: ManifestColumn[];
  attributeColumns: string[];
  bounds: { xmin: number; ymin: number; xmax: number; ymax: number } | null;
  boundsBasis: string | null;
  rows: number;
  partitions: PartitionAsset[];
  /**
   * The viewer's own assets, as the manifest lists them.
   *
   * Parsed so a malformed entry is caught with the rest of the manifest, and **deliberately never
   * fetched or hashed by this page**: it *is* those assets. The hashes are for an external verifier
   * — the chain of trust does not close inside the browser.
   */
  viewerAssets: ViewerAsset[];
  style: FetchableAsset & { styleVersion: number; matchColumn: string | null };
  /** The **data**'s terms (§10). */
  license: Record<string, unknown>;
  /** The **distributed code**'s terms (Corrigendum 3). A different question from `license`. */
  viewerLicense: ViewerLicenseNotice;
  reproducibilityGrade: string;
}

function fail(state: FailureState, detail: string): never {
  throw new BundleFailure(state, 'manifest.json', detail);
}

function str(v: unknown, at: string): string {
  if (typeof v !== 'string') fail('manifest-schema-invalid', `${at} must be a string`);
  return v;
}

/**
 * A string that is not empty and not only whitespace.
 *
 * Used where ADR-017 types a member as a **non-empty** string rather than merely a string — today
 * that is `license.license` in both declared states (§5, §10, Corrigendum 1). `""` is not an
 * absence and not a claim: §10 spells out that the absence is `null` under `declared-by-source` and
 * does not exist at all under `declared-by-operator`, and that no placeholder, `"unknown"` or empty
 * string may stand in for one. A reader that accepted `""` would accept a bundle asserting somebody
 * declared terms while naming none, which is the `"(unnamed)"` defect wearing a shorter disguise.
 */
function nonEmptyStr(v: unknown, at: string): string {
  const s = str(v, at);
  if (s.trim().length === 0) {
    fail('manifest-schema-invalid', `${at} is empty; an absent value is null, never a blank string`);
  }
  return s;
}

function num(v: unknown, at: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    fail('manifest-schema-invalid', `${at} must be a finite number`);
  }
  return v;
}

/**
 * A **non-negative** integer — ADR-017 types `bytes`, `rows`, the versions and the ceilings as
 * counts.
 *
 * Negative is refused here rather than surfacing later as a byte-count mismatch against a fetched
 * asset, which would name the wrong thing: the manifest is malformed, not the bytes.
 */
function int(v: unknown, at: string): number {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) {
    fail('manifest-schema-invalid', `${at} must be a non-negative integer`);
  }
  return v;
}

function bool(v: unknown, at: string): boolean {
  if (typeof v !== 'boolean') fail('manifest-schema-invalid', `${at} must be a boolean`);
  return v;
}

function obj(v: unknown, at: string): Record<string, unknown> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    fail('manifest-schema-invalid', `${at} must be an object`);
  }
  return v as Record<string, unknown>;
}

function arr(v: unknown, at: string): unknown[] {
  if (!Array.isArray(v)) fail('manifest-schema-invalid', `${at} must be an array`);
  return v;
}

/**
 * The key set of this object must be **exactly** `required` — no extras, none missing.
 *
 * Both halves matter and they fail for different reasons, so both are reported distinctly.
 */
function exactKeys(map: Record<string, unknown>, at: string, required: readonly string[]): void {
  const present = Object.keys(map);
  for (const key of present) {
    if (!required.includes(key)) {
      fail(
        'manifest-schema-invalid',
        `${at} carries key "${key}", which bundle_version ${SUPPORTED_BUNDLE_VERSION} does not define`,
      );
    }
  }
  for (const key of required) {
    if (!present.includes(key)) {
      fail(
        'manifest-schema-invalid',
        `${at} is missing required key "${key}"; bundle_version ${SUPPORTED_BUNDLE_VERSION} defines every member as required`,
      );
    }
  }
}

/**
 * A member that is either a plain string or a named-unknown state (ADR-017 §6).
 *
 * The `{state, basis}` shape is checked exactly, because "an unknown member carries its basis" is
 * only a guarantee if a basis-less state is refused.
 */
function stringOrUnknownState(v: unknown, at: string): void {
  if (typeof v === 'string') return;
  const o = obj(v, at);
  exactKeys(o, at, MANIFEST_KEY_SETS.unknown_state);
  str(o.state, `${at}.state`);
  str(o.basis, `${at}.basis`);
}

/** A `docs/11` ResourceRef: all six members, in the shapes §6 gives them. */
function resourceRef(v: unknown, at: string): Record<string, unknown> {
  const r = obj(v, at);
  exactKeys(r, at, MANIFEST_KEY_SETS.resource_ref);
  str(r.logical_uri, `${at}.logical_uri`);
  stringOrUnknownState(r.content_hash, `${at}.content_hash`);
  stringOrUnknownState(r.source_revision, `${at}.source_revision`);
  const locators = arr(r.locators, `${at}.locators`);
  if (locators.length === 0) {
    fail('manifest-schema-invalid', `${at}.locators is empty; docs/11 requires one or more`);
  }
  locators.forEach((l, i) => {
    const lo = obj(l, `${at}.locators[${i}]`);
    exactKeys(lo, `${at}.locators[${i}]`, MANIFEST_KEY_SETS.locator);
    str(lo.kind, `${at}.locators[${i}].kind`);
    str(lo.at, `${at}.locators[${i}].at`);
  });
  str(r.cache_status, `${at}.cache_status`);
  str(r.portability_policy, `${at}.portability_policy`);
  return r;
}

/**
 * A path that would escape the bundle is refused rather than fetched.
 *
 * The publisher validates on the way out; a reader that trusted the manifest for this would be
 * trusting a file it was handed.
 */
function safeRelativePath(path: string, at: string): string {
  if (
    path.length === 0 ||
    path.startsWith('/') ||
    path.includes('..') ||
    path.includes('\\') ||
    // **Any URI scheme, not just a drive letter.** This rule used to be `/^[A-Za-z]:/` — a *single*
    // letter then a colon — which catches `C:/evil` and lets an absolute `http(s)` URL, a `data:`
    // payload or a `javascript:` value straight through, because their second character is not a
    // colon.
    //
    // That was not cosmetic. Every path this function blesses is handed to `bundleUrl`, which is
    // `new URL(path, BUNDLE_BASE)` — and `new URL` resolves an absolute URL by *ignoring the base*.
    // So a manifest listing a partition at an attacker's origin made this page `fetch()` from it,
    // before any hash check could reject the bytes: the request has already been sent by the time
    // the content hash fails. A manifest is untrusted input in the `docs/09` sense, and ADR-017 §14
    // requires every asset path to be bundle-relative — an absolute URL is not one.
    //
    // *(No example URL is written literally in this comment, because `boundaries.test.mjs` refuses
    // any absolute URL anywhere in the built `dist/app.js` and esbuild keeps comments. That test is
    // right to have no allowlist; the cases live in `manifest.test.mjs` instead.)*
    //
    // The scheme grammar is RFC 3986's: a letter followed by letters, digits, `+`, `-` or `.`, then
    // a colon. Anchored, so an ordinary relative path with a colon later in it is unaffected.
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(path)
  ) {
    fail('manifest-schema-invalid', `${at} "${path}" is not a safe bundle-relative path`);
  }
  return path;
}

/** A partition entry: `path`, `bytes`, `content_hash`, `rows` — all four, all required (§5). */
function partitionAsset(v: unknown, at: string): PartitionAsset {
  const o = obj(v, at);
  exactKeys(o, at, MANIFEST_KEY_SETS.partition);
  return {
    path: safeRelativePath(str(o.path, `${at}.path`), `${at}.path`),
    bytes: int(o.bytes, `${at}.bytes`),
    contentHash: str(o.content_hash, `${at}.content_hash`),
    rows: int(o.rows, `${at}.rows`),
  };
}

/**
 * A viewer entry: `path`, `bytes`, `content_hash` — and **`rows` is forbidden**, not optional.
 *
 * §5 says `rows` is *omitted* on a viewer asset because it does not apply. A reader that tolerated
 * it would accept a manifest asserting a row count for a JavaScript file, which is a claim the
 * format does not have a meaning for.
 */
function viewerAsset(v: unknown, at: string): ViewerAsset {
  const o = obj(v, at);
  exactKeys(o, at, MANIFEST_KEY_SETS.viewer_asset);
  return {
    path: safeRelativePath(str(o.path, `${at}.path`), `${at}.path`),
    bytes: int(o.bytes, `${at}.bytes`),
    contentHash: str(o.content_hash, `${at}.content_hash`),
  };
}

/**
 * The **distributed code's** terms (ADR-017 Corrigendum 3, discharging ADR-009 item 7).
 *
 * Not to be confused with [`licenseBlock`] below, which carries the terms of the **data**. This
 * page is the code; that block is about what the page draws.
 *
 * ## The cross-check is the part the mutation sweep cannot reach
 *
 * `notice_path` must equal the `path` of one entry in `viewer[]` — a relation between two members
 * rather than a key set or a type, which is the one class
 * `renderer/tests/data/manifest-key-sets.json` cannot express and the sweep in
 * `scripts/manifest.test.mjs` does not walk. It has its own negative test for exactly that reason.
 *
 * **What is deliberately not done: the notice file is not fetched and not hashed.** §14 establishes
 * that a viewer shipped inside a bundle cannot verify itself, and the manifest's viewer-asset hashes
 * are for an *external* verifier. A page hashing its own notice would be that same broken chain of
 * trust wearing a licence — it would prove only that the bytes it was served match the manifest it
 * was served alongside.
 */
function viewerLicenseBlock(
  v: unknown,
  viewerPaths: readonly string[],
): ViewerLicenseNotice {
  const at = '$.viewer_license';
  const o = obj(v, at);
  exactKeys(o, at, MANIFEST_KEY_SETS.viewer_license);

  const program = nonEmptyStr(o.program, `${at}.program`);
  const copyright = nonEmptyStr(o.copyright, `${at}.copyright`);
  const license = nonEmptyStr(o.license, `${at}.license`);
  const noticePath = safeRelativePath(
    nonEmptyStr(o.notice_path, `${at}.notice_path`),
    `${at}.notice_path`,
  );

  if (!viewerPaths.includes(noticePath)) {
    fail(
      'manifest-schema-invalid',
      `${at}.notice_path "${noticePath}" names no entry in $.viewer; the notice must be a file ` +
        `this bundle carries and the manifest hashes, or the declaration points at nothing`,
    );
  }

  const cs = obj(o.corresponding_source, `${at}.corresponding_source`);
  exactKeys(
    cs,
    `${at}.corresponding_source`,
    MANIFEST_KEY_SETS.viewer_license_corresponding_source,
  );
  const kind = nonEmptyStr(cs.kind, `${at}.corresponding_source.kind`);
  // Two kinds, closed. A third is an offer this reader cannot describe to the person reading it,
  // and describing it wrongly is worse than refusing — the same argument §8's `filter` makes.
  if (kind !== 'url' && kind !== 'written-offer') {
    fail(
      'manifest-schema-invalid',
      `${at}.corresponding_source.kind "${kind}" is not a route kind this version defines`,
    );
  }
  const routeAt = nonEmptyStr(cs.at, `${at}.corresponding_source.at`);

  // **A `url` route's scheme is checked here too, not only in the publisher.**
  //
  // The publisher refuses anything but `http`/`https` — but a manifest arrives from wherever the
  // bundle was served from and is untrusted input in the `docs/09` sense, exactly as
  // `safeRelativePath` says of asset paths one function up: "a reader that trusted the manifest for
  // this would be trusting a file it was handed". A reader that skipped this would render
  // `javascript:…` as a clickable link in a page holding the viewer's own origin, because
  // `main.ts` puts this value straight into an `href`. Writer-side validation does not reach a
  // bundle the writer did not produce.
  //
  // `file://` is refused for the same reason it is on the writing side: it is not a route any
  // recipient can follow, and it names a location on somebody's disk.
  if (kind === 'url' && !/^https?:\/\/\S/.test(routeAt)) {
    fail(
      'manifest-schema-invalid',
      `${at}.corresponding_source.at "${routeAt}" is declared a url but is not http or https`,
    );
  }

  str(cs.note, `${at}.corresponding_source.note`);

  return { program, copyright, license, noticePath, correspondingSource: { kind, at: routeAt } };
}

/** The license block, whose member set depends on its declared state (§10). */
function licenseBlock(v: unknown, at: string): Record<string, unknown> {
  const l = obj(v, at);
  const state = str(l.state, `${at}.state`);
  switch (state) {
    case 'not-declared':
      exactKeys(l, at, MANIFEST_KEY_SETS.license_not_declared);
      str(l.basis, `${at}.basis`);
      break;
    case 'declared-by-source':
      exactKeys(l, at, MANIFEST_KEY_SETS.license_declared_by_source);
      // **`license` may be `null` here and only here** (ADR-017 Corrigendum 1, amending §5/§6/§10).
      // The three source metadata keys are independent, so a source may declare attribution and/or
      // redistribution and name no license; `null` is that absence. It is unambiguous without a
      // basis because the enclosing `state` already carries the claimant — "does not apply" is not
      // an available reading inside a block that exists because the source declared something.
      if (l.license !== null) nonEmptyStr(l.license, `${at}.license`);
      break;
    case 'declared-by-operator':
      // `at` here is the instant the **operator made the declaration** — part of the claim, and a
      // semantic input to the manifest. It is not build-execution timing, which lives outside the
      // determinism surface in `build-info.json`. See ADR-017 §10 and §12.
      exactKeys(l, at, MANIFEST_KEY_SETS.license_declared_by_operator);
      // **A string, never `null`**, and the asymmetry with `declared-by-source` is the schema, not
      // an oversight: an operator states a license or makes no declaration at all, so there is no
      // state in which this member is absent. A reader that accepted `null` here would accept a
      // manifest claiming an operator declared terms while naming none.
      nonEmptyStr(l.license, `${at}.license`);
      // `by` and `at` carry the same weight: a claim with a blank claimant or a blank instant is
      // not a claim, and §10 makes both part of the declaration rather than decoration.
      nonEmptyStr(l.by, `${at}.by`);
      nonEmptyStr(l.at, `${at}.at`);
      break;
    default:
      fail('manifest-schema-invalid', `${at}.state "${state}" is not a state this version defines`);
  }
  if (state !== 'not-declared') {
    if (l.attribution !== null) str(l.attribution, `${at}.attribution`);
    str(l.redistribution, `${at}.redistribution`);
  }
  return l;
}

/** The operation block: §8's eighteen digest inputs plus the digest taken over them. */
function operationBlock(v: unknown): void {
  const at = '$.operation';
  const o = obj(v, at);
  exactKeys(o, at, MANIFEST_KEY_SETS['$.operation']);
  int(o.digest_version, `${at}.digest_version`);
  for (const k of [
    'operation',
    'source_logical_uri',
    'source_content_hash',
    'id_source',
    'id_uniqueness',
    'crs_identifier',
    'crs_source',
    'axis_order',
    'axis_normalization',
    'ordering',
    'style_hash',
    'digest',
  ]) {
    str(o[k], `${at}.${k}`);
  }
  if (o.id_verified_rows !== null) int(o.id_verified_rows, `${at}.id_verified_rows`);
  if (o.limit !== null) int(o.limit, `${at}.limit`);
  stringOrUnknownState(o.crs_definition_hash, `${at}.crs_definition_hash`);

  // §8 gives `filter` exactly two shapes, and a third would be an operation this reader cannot
  // describe — so it is refused rather than ignored.
  const f = obj(o.filter, `${at}.filter`);
  const kind = str(f.kind, `${at}.filter.kind`);
  if (kind === 'whole-file') {
    exactKeys(f, `${at}.filter`, MANIFEST_KEY_SETS.filter_whole_file);
  } else if (kind === 'covering-bbox-intersects') {
    exactKeys(f, `${at}.filter`, MANIFEST_KEY_SETS.filter_covering_bbox);
    for (const k of ['xmin', 'ymin', 'xmax', 'ymax']) num(f[k], `${at}.filter.${k}`);
    if (f.bbox_crs !== null) str(f.bbox_crs, `${at}.filter.bbox_crs`);
  } else {
    fail('manifest-schema-invalid', `${at}.filter.kind "${kind}" is not a filter this version defines`);
  }

  arr(o.projection, `${at}.projection`).forEach((c, i) => schemaColumn(c, `${at}.projection[${i}]`));
  formatBlock(o.format, `${at}.format`);
}

/** The partition format declaration — the same object in `data.format` and `operation.format`. */
function formatBlock(v: unknown, at: string): void {
  const f = obj(v, at);
  exactKeys(f, at, MANIFEST_KEY_SETS.format);
  for (const k of [
    'framing',
    'compression',
    'dictionaries',
    'geometry_encoding',
    'coordinate_layout',
    'partition_boundary_rule',
  ]) {
    str(f[k], `${at}.${k}`);
  }
  for (const k of ['partition_target_bytes', 'partition_max_rows', 'max_partitions']) {
    int(f[k], `${at}.${k}`);
  }
}

function schemaColumn(v: unknown, at: string): ManifestColumn {
  const o = obj(v, at);
  exactKeys(o, at, MANIFEST_KEY_SETS.column);
  return {
    name: str(o.name, `${at}.name`),
    arrowType: str(o.arrow_type, `${at}.arrow_type`),
    nullable: bool(o.nullable, `${at}.nullable`),
  };
}

/**
 * The one-line license summary a viewer shows, as a **pure function of the manifest's license
 * block** — so it can be tested without a DOM.
 *
 * It lives here rather than in `main.ts` because it is manifest *interpretation*, not rendering,
 * and because the value it used to produce was wrong in a way nothing could catch: `main.ts`
 * printed `(unnamed)` when no license was named, which is the manifest's old `"(unnamed)"`
 * placeholder relocated to the pixel layer. A bundle whose manifest correctly says "the source
 * named none" would still show a parenthesised token in the position a license name occupies, and a
 * reader could take it for one. **An absence is rendered as an absence, in words.**
 */
export function licenseSummary(license: Record<string, unknown>): string {
  const state = String(license.state ?? 'unknown');
  if (state === 'not-declared') return 'license and attribution: unknown / not-declared';
  const name =
    typeof license.license === 'string' && license.license.trim().length > 0
      ? license.license
      : 'not named by the source';
  const attribution =
    typeof license.attribution === 'string' && license.attribution.length > 0
      ? ` · ${license.attribution}`
      : '';
  return `license: ${name}${attribution} (${state})`;
}

/** One line of the viewer's own notice, and where it points if it points anywhere. */
export interface NoticeLine {
  text: string;
  /**
   * A **bundle-relative** path or an absolute `http(s)` URL, or `undefined` for a line that is
   * prose. Never a resolved URL: resolving is the page's job, because only the page knows where the
   * bundle root is.
   */
  href?: string;
}

/**
 * The lines a viewer must show about **the code it is running** (§14, as Corrigendum 3 amends it).
 *
 * A pure function of the parsed block, for the same reason [`licenseSummary`] is one: it can be
 * tested without a DOM, and the thing being tested is what a recipient is actually told.
 *
 * Returned as lines rather than one string because this is a notice and not a status field —
 * collapsing a copyright, a license and a source route onto one line is how a notice becomes
 * decoration.
 *
 * **Each line carries its own `href` rather than the page re-deriving one by matching the text.**
 * The first version returned plain strings and `main.ts` looked each one up in a map keyed by the
 * exact rendered sentence — so rewording a line here would have silently turned its link back into
 * text, with nothing failing. A link that quietly stops being a link is the wrong failure mode for
 * the one route a recipient has to the source.
 */
export function viewerLicenseSummary(v: ViewerLicenseNotice): NoticeLine[] {
  const url = v.correspondingSource.kind === 'url';
  return [
    { text: `${v.program} — ${v.license}` },
    { text: v.copyright },
    { text: `notices: ${v.noticePath}`, href: v.noticePath },
    {
      text: url
        ? `corresponding source: ${v.correspondingSource.at}`
        : `corresponding source, by written offer: ${v.correspondingSource.at}`,
      // A written offer is prose with no destination. Linkifying it would invent one.
      href: url ? v.correspondingSource.at : undefined,
    },
  ];
}

export function parseManifest(text: string): Manifest {
  let root: unknown;
  try {
    root = JSON.parse(text);
  } catch (e) {
    throw new BundleFailure('manifest-unparseable', 'manifest.json', String(e));
  }
  const m = obj(root, '$');

  // **The version gate runs before any other check, and the order is load-bearing.**
  //
  // ADR-017 §3 says additive evolution proceeds by incrementing the version — so a v2 manifest *is*
  // a v1 manifest with members added. Judging the key set first would report `manifest-schema-invalid`
  // for a document whose actual problem is that this build does not implement its version, and §14
  // lists those as two distinct named states precisely so a reader is told which one it hit. An
  // earlier version of this function checked the key set first and did exactly that.
  const version = int(m.bundle_version, '$.bundle_version');
  if (version !== SUPPORTED_BUNDLE_VERSION) {
    throw new BundleFailure(
      'manifest-unsupported-version',
      'manifest.json',
      `bundle_version ${version}; this viewer implements ${SUPPORTED_BUNDLE_VERSION} and refuses ` +
        `versions it does not implement rather than guessing at their meaning`,
    );
  }

  exactKeys(m, '$', MANIFEST_KEY_SETS['$']);

  // The three ResourceRefs ADR-005 and docs/11 make owed: the bundle, the source, and the style.
  resourceRef(m.bundle, '$.bundle');
  resourceRef(m.source, '$.source');
  str(m.source_verification, '$.source_verification');

  const styleBlock = obj(m.style, '$.style');
  exactKeys(styleBlock, '$.style', MANIFEST_KEY_SETS['$.style']);
  const styleResource = resourceRef(styleBlock.resource, '$.style.resource');

  const software = obj(m.software, '$.software');
  exactKeys(software, '$.software', MANIFEST_KEY_SETS['$.software']);
  int(software.bundle_writer_version, '$.software.bundle_writer_version');
  for (const k of MANIFEST_KEY_SETS['$.software']) {
    if (k !== 'bundle_writer_version') str(software[k], `$.software.${k}`);
  }

  operationBlock(m.operation);

  const crs = obj(m.crs, '$.crs');
  exactKeys(crs, '$.crs', MANIFEST_KEY_SETS['$.crs']);
  if (crs.source_definition !== null) str(crs.source_definition, '$.crs.source_definition');
  // Every other `crs` member is a string. Presence was checked above; these are the types,
  // which were missing — `axis_order: 42` parsed before this line existed.
  for (const k of ['source', 'display', 'transform', 'crs_source', 'axis_order', 'axis_normalization']) {
    str(crs[k], `$.crs.${k}`);
  }

  const identity = obj(m.identity, '$.identity');
  exactKeys(identity, '$.identity', MANIFEST_KEY_SETS['$.identity']);
  if (identity.id_verified_rows !== null) int(identity.id_verified_rows, '$.identity.id_verified_rows');
  if (identity.id_js_exact !== null) bool(identity.id_js_exact, '$.identity.id_js_exact');

  const schema = arr(m.schema, '$.schema').map((c, i) => schemaColumn(c, `$.schema[${i}]`));
  if (schema.length < 2) {
    fail(
      'manifest-schema-invalid',
      '$.schema has fewer than two columns; every bundle carries `id` and a geometry column',
    );
  }

  // `bounds` is the one top-level member that may be `null` — a filter can legitimately select no
  // rows. When present its six members are all required.
  let bounds: Manifest['bounds'] = null;
  let boundsBasis: string | null = null;
  if (m.bounds !== null) {
    const b = obj(m.bounds, '$.bounds');
    exactKeys(b, '$.bounds', MANIFEST_KEY_SETS['$.bounds']);
    bounds = {
      xmin: num(b.xmin, '$.bounds.xmin'),
      ymin: num(b.ymin, '$.bounds.ymin'),
      xmax: num(b.xmax, '$.bounds.xmax'),
      ymax: num(b.ymax, '$.bounds.ymax'),
    };
    str(b.crs, '$.bounds.crs');
    boundsBasis = str(b.basis, '$.bounds.basis');
  }

  const data = obj(m.data, '$.data');
  exactKeys(data, '$.data', MANIFEST_KEY_SETS['$.data']);
  formatBlock(data.format, '$.data.format');

  // Hoisted above `viewer_license`, because that member's `notice_path` must name one of these and
  // a reader cannot cross-check against a list it has not parsed yet. This is the mechanical reason
  // `viewer_license` sits immediately after `viewer` in the key order (Corrigendum 3).
  const viewerAssets = arr(m.viewer, '$.viewer').map((v, i) => viewerAsset(v, `$.viewer[${i}]`));
  const viewerLicense = viewerLicenseBlock(
    m.viewer_license,
    viewerAssets.map((a) => a.path),
  );

  const license = licenseBlock(m.license, '$.license');

  const repro = obj(m.reproducibility, '$.reproducibility');
  exactKeys(repro, '$.reproducibility', MANIFEST_KEY_SETS['$.reproducibility']);
  arr(repro.basis, '$.reproducibility.basis').forEach((b, i) =>
    str(b, `$.reproducibility.basis[${i}]`),
  );
  str(repro.why_not_higher, '$.reproducibility.why_not_higher');

  // The two reservations. Empty in v1, and checked so that a bundle claiming to carry a derived
  // cache this build cannot read is refused rather than half-rendered.
  const caches = arr(m.derived_caches, '$.derived_caches');
  if (caches.length > 0) {
    fail(
      'manifest-schema-invalid',
      `$.derived_caches has ${caches.length} entries; bundle_version ${SUPPORTED_BUNDLE_VERSION} reserves the slot and defines no entry shape`,
    );
  }
  const query = obj(m.query_surface, '$.query_surface');
  exactKeys(query, '$.query_surface', MANIFEST_KEY_SETS['$.query_surface']);
  if (bool(query.available, '$.query_surface.available')) {
    fail(
      'manifest-schema-invalid',
      `$.query_surface.available is true; bundle_version ${SUPPORTED_BUNDLE_VERSION} reserves the surface and implements none`,
    );
  }
  str(query.reserved_for, '$.query_surface.reserved_for');

  const sidecar = obj(m.sidecar, '$.sidecar');
  exactKeys(sidecar, '$.sidecar', MANIFEST_KEY_SETS['$.sidecar']);
  str(sidecar.path, '$.sidecar.path');
  bool(sidecar.hashed, '$.sidecar.hashed');
  bool(sidecar.verified, '$.sidecar.verified');
  str(sidecar.note, '$.sidecar.note');

  // **The style's path is its locator, not its logical URI.** The URI is not a fetchable path, and
  // validating it while fetching something else would leave the fetched thing unchecked.
  const firstLocator = obj(
    arr(styleResource.locators, '$.style.resource.locators')[0],
    '$.style.resource.locators[0]',
  );

  return {
    bundleVersion: version,
    crsSource: str(crs.source, '$.crs.source'),
    crsDisplay: str(crs.display, '$.crs.display'),
    crsTransform: str(crs.transform, '$.crs.transform'),
    idSource: str(identity.id_source, '$.identity.id_source'),
    idUniqueness: str(identity.id_uniqueness, '$.identity.id_uniqueness'),
    identityCaveat: str(identity.caveat, '$.identity.caveat'),
    schema,
    // Everything after `id` and `geometry` is the declared projection, in declared order (§5).
    attributeColumns: schema.slice(2).map((c) => c.name),
    bounds,
    boundsBasis,
    rows: int(data.rows, '$.data.rows'),
    partitions: arr(data.partitions, '$.data.partitions').map((p, i) =>
      partitionAsset(p, `$.data.partitions[${i}]`),
    ),
    viewerAssets,
    style: {
      path: safeRelativePath(
        str(firstLocator.at, '$.style.resource.locators[0].at'),
        '$.style.resource.locators[0].at',
      ),
      // ADR-017 lists no byte count for the style, so there is none to check. `null` says that,
      // where a `0` would be a length assertion nobody made. Its content hash covers length anyway.
      bytes: null,
      contentHash:
        typeof styleResource.content_hash === 'string'
          ? styleResource.content_hash
          : fail(
              'manifest-schema-invalid',
              '$.style.resource.content_hash is a named-unknown state; a style with no content hash cannot be verified',
            ),
      styleVersion: int(styleBlock.style_version, '$.style.style_version'),
      matchColumn:
        styleBlock.match_column === null
          ? null
          : str(styleBlock.match_column, '$.style.match_column'),
    },
    license,
    viewerLicense,
    reproducibilityGrade: str(repro.grade, '$.reproducibility.grade'),
  };
}
