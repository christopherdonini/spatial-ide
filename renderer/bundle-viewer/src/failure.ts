/**
 * The viewer's **named failure states**, and the banner that shows one.
 *
 * ADR-010 rule 5's staleness discipline, applied to a static artifact: a map that is not what the
 * manifest describes must say so, in words, rather than quietly showing whatever loaded. A silently
 * partial map is the failure this list exists to prevent, and every state below is a specific thing
 * a reader can act on rather than a generic "error".
 *
 * ## What happens on a failure, and why it is this and not a blank canvas
 *
 * **Loading stops, what is already drawn stays, and a non-dismissable banner names the state and the
 * asset.** Erasing the canvas would destroy information that was verified — every partition already
 * drawn passed its hash — while telling the reader strictly less. Rule 5 asks for a *visible signal*,
 * not for erasure. The banner says the map is incomplete, which is the fact; the pixels are all
 * genuine.
 *
 * Two consequences are stated on the banner itself rather than left to be inferred:
 *
 * - **Hover still works, over the partitions that loaded**, and identification therefore covers only
 *   those. A reader who hovers and gets nothing should know whether that means "no feature here" or
 *   "that part never loaded".
 * - **The legend is unaffected**, because it is a function of the style and not of the data. It
 *   shows what the style declares, which is true whether or not every partition arrived.
 *
 * ## Every state below is reachable
 *
 * There is deliberately no `style-hash-mismatch` and no `style-unreachable`. The style is fetched
 * through the same path as every other asset, so its hash and availability failures surface as
 * `asset-hash-mismatch` and `asset-missing`, naming the style's own path — which is the accurate
 * report. A declared state no code can raise reads as coverage that does not exist.
 */

export type FailureState =
  | 'manifest-unreachable'
  | 'manifest-unparseable'
  | 'manifest-unsupported-version'
  | 'manifest-schema-invalid'
  | 'style-unparseable'
  | 'style-unsupported-version'
  | 'asset-missing'
  | 'asset-hash-mismatch'
  | 'partition-byte-count-mismatch'
  | 'partition-decode-failed'
  | 'partition-row-count-mismatch'
  | 'attribute-schema-mismatch'
  | 'envelope-frame-mismatch'
  | 'envelope-crs-mismatch'
  | 'envelope-axis-order-mismatch'
  | 'envelope-encoding-mismatch'
  | 'envelope-attributes-mismatch'
  | 'ceiling-exceeded'
  | 'unhandled-error';

/** A failure carrying the state, the asset it concerns, and what was expected versus found. */
export class BundleFailure extends Error {
  readonly state: FailureState;
  readonly asset: string;
  readonly detail: string;

  constructor(state: FailureState, asset: string, detail: string) {
    super(`${state} (${asset}): ${detail}`);
    this.name = 'BundleFailure';
    this.state = state;
    this.asset = asset;
    this.detail = detail;
  }
}

/**
 * Show the banner. **`textContent` only, never `innerHTML`.**
 *
 * `docs/09` names dataset contents, filenames, attribute values and metadata as untrusted input.
 * An asset path or a decoder's message can carry anything, and this element is one of the places
 * that text reaches the DOM.
 */
export function showFailure(
  root: HTMLElement,
  failure: BundleFailure,
  partitionsLoaded: number,
  partitionsExpected: number,
): void {
  root.textContent = '';
  root.hidden = false;

  const title = document.createElement('strong');
  title.textContent = `Bundle failure: ${failure.state}`;
  root.appendChild(title);

  const asset = document.createElement('div');
  asset.textContent = `asset: ${failure.asset}`;
  root.appendChild(asset);

  const detail = document.createElement('div');
  detail.textContent = failure.detail;
  root.appendChild(detail);

  const consequence = document.createElement('div');
  consequence.className = 'consequence';
  consequence.textContent =
    partitionsLoaded > 0
      ? `This map is incomplete: ${partitionsLoaded} of ${partitionsExpected} partitions were ` +
        `verified and drawn, and loading stopped here. Everything drawn is verified. Hover ` +
        `identifies features in the loaded partitions only. The legend is a function of the style, ` +
        `not of the data, so it is unaffected.`
      : `Nothing was drawn. No part of this bundle could be verified.`;
  root.appendChild(consequence);
}
