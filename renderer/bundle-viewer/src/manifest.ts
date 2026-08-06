/**
 * Reading the manifest, and refusing one this build does not implement.
 *
 * The manifest is the bundle's contract (ADR-017). This reader treats it as one: it refuses an
 * unknown `bundle_version` rather than reading it best-effort, and it checks the shape of everything
 * it goes on to rely on, so a malformed manifest fails here with a named state instead of surfacing
 * three layers down as an undefined property.
 */

import { BundleFailure, type FailureState } from './failure.js';

/** The one manifest version this build implements. */
export const SUPPORTED_BUNDLE_VERSION = 1;

export interface ManifestAsset {
  path: string;
  bytes: number;
  contentHash: string;
  rows?: number;
}

export interface ManifestColumn {
  name: string;
  arrowType: string;
  nullable: boolean;
}

export interface Manifest {
  bundleVersion: number;
  crsSource: string;
  crsDisplay: string;
  crsTransform: string;
  axisOrder: string;
  idSource: string;
  idUniqueness: string;
  identityCaveat: string;
  schema: ManifestColumn[];
  attributeColumns: string[];
  bounds: { xmin: number; ymin: number; xmax: number; ymax: number } | null;
  boundsBasis: string;
  rows: number;
  partitions: ManifestAsset[];
  viewerAssets: ManifestAsset[];
  style: ManifestAsset & { styleVersion: number; matchColumn: string | null };
  license: Record<string, unknown>;
  reproducibilityGrade: string;
  geometryEncoding: string;
}

function fail(state: FailureState, detail: string): never {
  throw new BundleFailure(state, 'manifest.json', detail);
}

function str(v: unknown, at: string): string {
  if (typeof v !== 'string') fail('manifest-schema-invalid', `${at} must be a string`);
  return v;
}

function num(v: unknown, at: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    fail('manifest-schema-invalid', `${at} must be a finite number`);
  }
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

function asset(v: unknown, at: string): ManifestAsset {
  const o = obj(v, at);
  const a: ManifestAsset = {
    path: str(o.path, `${at}.path`),
    bytes: num(o.bytes, `${at}.bytes`),
    contentHash: str(o.content_hash, `${at}.content_hash`),
  };
  if (typeof o.rows === 'number') a.rows = o.rows;
  // A path that escapes the bundle is refused rather than fetched. The publisher validates on the
  // way out; a reader that trusted the manifest for this would be trusting a file it was handed.
  if (
    a.path.length === 0 ||
    a.path.startsWith('/') ||
    a.path.includes('..') ||
    a.path.includes('\\') ||
    /^[A-Za-z]:/.test(a.path)
  ) {
    fail('manifest-schema-invalid', `${at}.path "${a.path}" is not a safe bundle-relative path`);
  }
  return a;
}

export function parseManifest(text: string): Manifest {
  let root: unknown;
  try {
    root = JSON.parse(text);
  } catch (e) {
    throw new BundleFailure('manifest-unparseable', 'manifest.json', String(e));
  }
  const m = obj(root, '$');

  const version = m.bundle_version;
  if (typeof version !== 'number') {
    fail('manifest-schema-invalid', '$.bundle_version must be a number');
  }
  if (version !== SUPPORTED_BUNDLE_VERSION) {
    throw new BundleFailure(
      'manifest-unsupported-version',
      'manifest.json',
      `bundle_version ${version}; this viewer implements ${SUPPORTED_BUNDLE_VERSION} and refuses ` +
        `versions it does not implement rather than guessing at their meaning`,
    );
  }

  const crs = obj(m.crs, '$.crs');
  const identity = obj(m.identity, '$.identity');
  const data = obj(m.data, '$.data');
  const format = obj(data.format, '$.data.format');
  const styleBlock = obj(m.style, '$.style');
  const styleResource = obj(styleBlock.resource, '$.style.resource');
  const repro = obj(m.reproducibility, '$.reproducibility');

  const schema: ManifestColumn[] = arr(m.schema, '$.schema').map((c, i) => {
    const o = obj(c, `$.schema[${i}]`);
    return {
      name: str(o.name, `$.schema[${i}].name`),
      arrowType: str(o.arrow_type, `$.schema[${i}].arrow_type`),
      nullable: o.nullable === true,
    };
  });

  const boundsRaw = m.bounds;
  let bounds: Manifest['bounds'] = null;
  if (boundsRaw !== null && boundsRaw !== undefined) {
    const b = obj(boundsRaw, '$.bounds');
    bounds = {
      xmin: num(b.xmin, '$.bounds.xmin'),
      ymin: num(b.ymin, '$.bounds.ymin'),
      xmax: num(b.xmax, '$.bounds.xmax'),
      ymax: num(b.ymax, '$.bounds.ymax'),
    };
  }

  const styleAsset = asset(
    { path: styleResource.logical_uri, bytes: 0, content_hash: styleResource.content_hash },
    '$.style.resource',
  );
  // The style's own path comes from its locator, not from its logical URI.
  const locators = arr(styleResource.locators, '$.style.resource.locators');
  const firstLocator = obj(locators[0], '$.style.resource.locators[0]');
  styleAsset.path = str(firstLocator.at, '$.style.resource.locators[0].at');

  return {
    bundleVersion: version,
    crsSource: str(crs.source, '$.crs.source'),
    crsDisplay: str(crs.display, '$.crs.display'),
    crsTransform: str(crs.transform, '$.crs.transform'),
    axisOrder: str(crs.axis_order, '$.crs.axis_order'),
    idSource: str(identity.id_source, '$.identity.id_source'),
    idUniqueness: str(identity.id_uniqueness, '$.identity.id_uniqueness'),
    identityCaveat: str(identity.caveat, '$.identity.caveat'),
    schema,
    // Everything after `id` and `geometry` is the declared projection, in declared order.
    attributeColumns: schema.slice(2).map((c) => c.name),
    bounds,
    boundsBasis: str(m.bounds_basis ?? (boundsRaw ? obj(boundsRaw, '$.bounds').basis : ''), '$.bounds.basis'),
    rows: num(data.rows, '$.data.rows'),
    partitions: arr(data.partitions, '$.data.partitions').map((p, i) =>
      asset(p, `$.data.partitions[${i}]`),
    ),
    viewerAssets: arr(m.viewer, '$.viewer').map((v, i) => asset(v, `$.viewer[${i}]`)),
    style: {
      ...styleAsset,
      styleVersion: num(styleBlock.style_version, '$.style.style_version'),
      matchColumn:
        styleBlock.match_column === null || styleBlock.match_column === undefined
          ? null
          : str(styleBlock.match_column, '$.style.match_column'),
    },
    license: obj(m.license, '$.license'),
    reproducibilityGrade: str(repro.grade, '$.reproducibility.grade'),
    geometryEncoding: str(format.geometry_encoding, '$.data.format.geometry_encoding'),
  };
}
