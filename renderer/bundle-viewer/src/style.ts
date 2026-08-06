/**
 * Reading style v0 and resolving a feature's draw parameters.
 *
 * ## This is the second implementation of one rule, and that is the risk it manages
 *
 * The publisher compiles the style in Rust; this reads the same document again in TypeScript. Two
 * implementations of one resolution rule is the shape in which a style silently means two things —
 * the publisher's legend saying one thing and the drawn map another, with nothing raised. So the
 * two are pinned against a **shared vector**, `renderer/tests/data/style-agreement.json`, which
 * `scripts/style-agreement.test.mjs` and `renderer/tests/style_agreement.rs` both read and neither
 * generates.
 *
 * ## The hash is over the stored bytes, never over a re-canonicalization
 *
 * This module never re-serializes the style to check its hash. It hashes the bytes it was given and
 * compares them with the manifest. Re-canonicalizing would make the check a test of *this*
 * serializer rather than of the bytes in the bundle, which is the opposite of what it is for.
 */

import { BundleFailure } from './failure.js';

export const SUPPORTED_STYLE_VERSION = 1;

export interface DrawParameters {
  fillColor: string;
  fillOpacity: number;
  outlineColor: string;
  outlineWidth: number;
}

export type LegendKind = { kind: 'case'; value: string } | { kind: 'null' } | { kind: 'unmatched' };

export interface LegendEntry {
  kind: LegendKind;
  draw: DrawParameters;
}

type Value<T> =
  | { literal: T }
  | { match: { column: string; cases: { when: string; then: T }[]; on_null: T; on_unmatched: T } };

interface StyleDocument {
  style_version: number;
  layer: {
    geometry: string;
    fill_color: Value<string>;
    fill_opacity: Value<number>;
    outline_color: Value<string>;
    outline_width: Value<number>;
  };
}

type Branch = { kind: 'null' } | { kind: 'value'; value: string } | { kind: 'unmatched' };

function pick<T>(v: Value<T>, branch: Branch): T {
  if ('literal' in v) return v.literal;
  const m = v.match;
  if (branch.kind === 'null') return m.on_null;
  if (branch.kind === 'unmatched') return m.on_unmatched;
  const hit = m.cases.find((c) => c.when === branch.value);
  return hit ? hit.then : m.on_unmatched;
}

export class Style {
  private doc: StyleDocument;
  /** The one match column, or null for an all-literal style. */
  readonly matchColumn: string | null;
  readonly legend: LegendEntry[];
  /**
   * Distinct draw-parameter sets, and the branch each corresponds to.
   *
   * Features are drawn in groups by these, so one path is built and filled per distinct appearance
   * rather than one per feature. That is a batching decision, not a visual one: the parameters are
   * exactly what `resolve` returns.
   */
  readonly groups: DrawParameters[];

  private constructor(doc: StyleDocument) {
    this.doc = doc;
    const l = doc.layer;
    const column = (v: Value<unknown>): string | null => ('match' in v ? v.match.column : null);
    this.matchColumn =
      column(l.fill_color) ?? column(l.fill_opacity) ?? column(l.outline_color) ?? column(l.outline_width);

    const caseValues = (): string[] => {
      for (const v of [l.fill_color, l.fill_opacity, l.outline_color, l.outline_width] as Value<unknown>[]) {
        if ('match' in v) return v.match.cases.map((c) => c.when);
      }
      return [];
    };

    this.legend = [];
    if (this.matchColumn !== null) {
      // Declared cases in declaration order, then NULL, then unmatched. **A function of the style,
      // not of the data** — every declared case appears whether or not this bundle contains one.
      for (const value of caseValues()) {
        this.legend.push({ kind: { kind: 'case', value }, draw: this.draw({ kind: 'value', value }) });
      }
      this.legend.push({ kind: { kind: 'null' }, draw: this.draw({ kind: 'null' }) });
      this.legend.push({ kind: { kind: 'unmatched' }, draw: this.draw({ kind: 'unmatched' }) });
      this.groups = this.legend.map((e) => e.draw);
    } else {
      this.groups = [this.draw({ kind: 'unmatched' })];
    }
  }

  static parse(text: string, assetPath: string): Style {
    let root: unknown;
    try {
      root = JSON.parse(text);
    } catch (e) {
      throw new BundleFailure('style-unparseable', assetPath, String(e));
    }
    const doc = root as StyleDocument;
    if (typeof doc?.style_version !== 'number') {
      throw new BundleFailure('style-unparseable', assetPath, '`style_version` is missing');
    }
    if (doc.style_version !== SUPPORTED_STYLE_VERSION) {
      throw new BundleFailure(
        'style-unsupported-version',
        assetPath,
        `style_version ${doc.style_version}; this viewer implements ${SUPPORTED_STYLE_VERSION}`,
      );
    }
    const l = doc.layer;
    if (!l || l.geometry !== 'polygon') {
      throw new BundleFailure('style-unparseable', assetPath, 'layer.geometry must be "polygon"');
    }
    for (const key of ['fill_color', 'fill_opacity', 'outline_color', 'outline_width'] as const) {
      const v = l[key] as unknown;
      if (typeof v !== 'object' || v === null || (!('literal' in v) && !('match' in v))) {
        throw new BundleFailure('style-unparseable', assetPath, `layer.${key} is not a style value`);
      }
    }
    return new Style(doc);
  }

  private draw(branch: Branch): DrawParameters {
    const l = this.doc.layer;
    return {
      fillColor: pick(l.fill_color, branch),
      fillOpacity: pick(l.fill_opacity, branch),
      outlineColor: pick(l.outline_color, branch),
      outlineWidth: pick(l.outline_width, branch),
    };
  }

  /**
   * Resolve one feature's draw parameters from its match-key value.
   *
   * `null` is a NULL key — a value the source carries, not an absence the caller invented — and
   * takes the declared `on_null` branch.
   */
  resolve(key: string | null): DrawParameters {
    return this.draw(key === null ? { kind: 'null' } : { kind: 'value', value: key });
  }

  /** Which drawing group a match-key value belongs to. */
  groupFor(key: string | null): number {
    if (this.matchColumn === null) return 0;
    if (key === null) return this.legend.length - 2;
    const i = this.legend.findIndex((e) => e.kind.kind === 'case' && e.kind.value === key);
    return i >= 0 ? i : this.legend.length - 1;
  }
}
