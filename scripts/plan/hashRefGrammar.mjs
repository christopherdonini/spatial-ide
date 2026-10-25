// scripts/plan/hashRefGrammar.mjs -- the `path:line @ <rev> sha256:<hex>` reference grammar, defined once
// and imported by verify-quotes.mjs (path optional: a bare `:line` binds to the nearest preceding path)
// and verify-test-claims.mjs (path required). A leaf: it imports nothing, so neither checker's import
// of the other can make a cycle. The shapes the grammar accepts are described at verify-quotes.mjs's
// "THE `//` CONTINUATION GRAMMAR" comment. Node's standard library only (here: nothing).

// Horizontal whitespace, or exactly one rustfmt `//` comment continuation, where `\s*` would otherwise go.
export const GAP = '[ \\t]*(?:\\n[ \\t]*//[ \\t]?)?[ \\t]*';

const PATH = '([A-Za-z0-9_][A-Za-z0-9_./+-]*)';

/**
 * A NEW global RegExp on every call, never a shared object: the readers drive it through `lastIndex`, so
 * each importer needs its own instance. Groups: 1 `byte-copied from`, 2 path, 3 start line, 4 end line,
 * 5 rev, 6 hash. `pathRequired: false` makes group 2 optional.
 */
export function hashRefRegExp({ pathRequired }) {
  const pathPart = pathRequired ? PATH : `(?:${PATH})?`;
  return new RegExp(
    '(byte-copied from\\s+)?`?' +
      pathPart +
      ':(\\d+)(?:-(\\d+))?`?' +
      `(?:${GAP}@${GAP}([^\\s\`]+))?${GAP}sha256:([0-9a-f]{64})\`?`,
    'g',
  );
}
