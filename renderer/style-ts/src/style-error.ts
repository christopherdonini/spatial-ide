// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The two ways a style **document** itself can be refused at read time: the bytes are not valid
 * JSON in the schema's shape, or the document declares a `style_version` this build does not
 * implement.
 *
 * Deliberately narrow. This module resolves a style; it does not know what a *consumer* is (a
 * published bundle fetched over HTTP, a document a shell panel just produced in memory), so it
 * carries no vocabulary for a consumer's own failures -- an unreachable asset, a hash mismatch, a
 * schema mismatch against a dataset. Each consumer already owns that vocabulary:
 * `renderer/bundle-viewer/src/failure.ts`'s `BundleFailure` for the bundle viewer (its own
 * `main.ts` translates an instance of this class into a `BundleFailure` at its own load boundary,
 * naming the same `state`/`asset`/`detail`), and the shell's producer (`frontends/shell/src/style/
 * document.ts`) is structurally incapable of writing a document either of these two states names,
 * so it has no boundary of this kind to translate at.
 */
export type StyleParseErrorState = 'style-unparseable' | 'style-unsupported-version';

export class StyleParseError extends Error {
  readonly state: StyleParseErrorState;
  readonly asset: string;
  readonly detail: string;

  constructor(state: StyleParseErrorState, asset: string, detail: string) {
    super(`${state} (${asset}): ${detail}`);
    this.name = 'StyleParseError';
    this.state = state;
    this.asset = asset;
    this.detail = detail;
  }
}
