// scripts/plan/hashRefGrammar.mjs -- the `path:line @ <rev> sha256:<hex>` reference grammar, defined once
// and imported by verify-quotes.mjs (path optional: verify-quotes binds a bare `:line` to the nearest
// preceding path:line citation in the same paragraph) and verify-test-claims.mjs (path required). A leaf:
// it imports nothing, so both checkers import it with no cycle (verify-quotes.mjs imports
// verify-test-claims.mjs, so exporting the grammar from verify-quotes.mjs would make one). The shapes the
// grammar accepts are described in verify-quotes.mjs's "HASH-CHECKED REFERENCES" comment and its
// "THE `//` CONTINUATION GRAMMAR" paragraph. Node's standard library only (here: nothing).

// Horizontal whitespace, or exactly one rustfmt `//` comment continuation, where `\s*` would otherwise go.
const GAP = '[ \\t]*(?:\\n[ \\t]*//[ \\t]?)?[ \\t]*';

// A path starts with a letter, digit or underscore, or with a dot that one of those follows (`.github/`); a
// `.` or `..` segment, first or interior, is not a path, and nothing is read as a path (or, for verify-quotes,
// a bare `:line`) directly after a path character, so `./x`, `../x`, `.:3` and `sub/../x` bind nowhere.
const NOT_AFTER_PATH_CHAR = '(?<![A-Za-z0-9_./+-])';
const PATH = '((?:\\.(?=[A-Za-z0-9_]))?[A-Za-z0-9_](?:[A-Za-z0-9_.+-]|/(?!\\.(?![A-Za-z0-9_])))*)';

/**
 * A NEW global RegExp on every call, never a shared object: the readers drive it through `lastIndex`, so
 * each importer needs its own instance. Groups: 1 `byte-copied from`, 2 path, 3 start line, 4 end line,
 * 5 rev, 6 hash. `pathRequired: false` makes group 2 optional.
 */
export function hashRefRegExp({ pathRequired }) {
  const pathPart = pathRequired ? PATH : `(?:${PATH})?`;
  return new RegExp(
    '(byte-copied from\\s+)?`?' +
      NOT_AFTER_PATH_CHAR +
      pathPart +
      ':(\\d+)(?:-(\\d+))?`?' +
      `(?:${GAP}@${GAP}([^\\s\`]+))?${GAP}sha256:([0-9a-f]{64})\`?`,
    'g',
  );
}
