// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for scripts/hooks/profile-path-scan.mjs, per
// scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md §4 and Amendment 4 §4.3. Every
// profile-shaped string here is built at run time from invented parts, or uses a name from the
// scanner's own listed sets (INVENTED_NAMES / MACHINE_ACCOUNTS) -- never a literal full path --
// per §1 and the piece's output discipline. Each test's `// RECORDED MUTATION:` comment names the
// mutation applied to prove the test actually exercises the behaviour it claims, per §4.3's table.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { scanText, checkCanary, redactRoots, redactSegments } from './profile-path-scan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const scannerPath = path.join(here, 'profile-path-scan.mjs');
const repoRoot = path.resolve(here, '..', '..');
const hooksDir = path.join(repoRoot, '.githooks');

// A profile-shaped segment built from invented letters at run time, never written as one literal.
function mk(...parts) {
  return parts.join('');
}

function windowsPath(sep, segment) {
  return `C:${sep}${mk('U', 's', 'e', 'r', 's')}${sep}${segment}${sep}${mk('f', 'i', 'l', 'e', '.', 't', 'x', 't')}`;
}

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function git(dir, args, opts = {}) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', ...opts });
}

function initRepo(dir) {
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'test@example.com']);
  git(dir, ['config', 'user.name', 'Test']);
  git(dir, ['config', 'core.hooksPath', hooksDir]);
}

function commit(dir, args, env = {}) {
  return spawnSync('git', ['commit', ...args], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

// Builds a hooks directory where `hookName` ('pre-commit' or 'commit-msg') is a byte copy of the
// shipped hook, the *other* hook is a trivial pass-through, and the scanner at the shipped hook's
// own relative location (`$(dirname "$0")/../scripts/hooks/profile-path-scan.mjs`) is the given
// stub source. Used to test each hook's own fail-closed behaviour in isolation from the other
// hook and from the real scanner.
function makeIsolatedHookDir(hookName, stubScannerSource) {
  const root = makeTempDir('profile-scan-isolatedhook-');
  const hooksSub = path.join(root, '.githooks');
  const scannerSub = path.join(root, 'scripts', 'hooks');
  fs.mkdirSync(hooksSub, { recursive: true });
  fs.mkdirSync(scannerSub, { recursive: true });
  const other = hookName === 'pre-commit' ? 'commit-msg' : 'pre-commit';
  fs.copyFileSync(path.join(hooksDir, hookName), path.join(hooksSub, hookName));
  fs.writeFileSync(path.join(hooksSub, other), '#!/bin/sh\nexit 0\n');
  try {
    fs.chmodSync(path.join(hooksSub, hookName), 0o755);
  } catch {
    // best-effort on filesystems without POSIX mode bits
  }
  try {
    fs.chmodSync(path.join(hooksSub, other), 0o755);
  } catch {
    // best-effort
  }
  fs.writeFileSync(path.join(scannerSub, 'profile-path-scan.mjs'), stubScannerSource);
  return { root, hooksSub };
}

// ---------------------------------------------------------------------------
// Core matcher (i), (ii), (iv)
// ---------------------------------------------------------------------------

test('refuses_a_full_form_profile_path_in_every_separator_form', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const backslash = `C:\\${mk('U', 's', 'e', 'r', 's')}\\${seg}\\f`;
  const doubled = `C:\\\\${mk('U', 's', 'e', 'r', 's')}\\\\${seg}\\\\f`;
  // /c/ rather than C:/, so this specifically isolates WINDOWS_ROOT's own separator handling
  // (a "C:/Users/..." form would also be caught by POSIX_ROOT's "/Users/", masking a narrowed
  // WINDOWS_ROOT separator class).
  const forward = `/c/${mk('U', 's', 'e', 'r', 's')}/${seg}/f`;
  assert.equal(scanText(backslash, { localName: 'zz' }).length, 1);
  assert.equal(scanText(doubled, { localName: 'zz' }).length, 1);
  assert.equal(scanText(forward, { localName: 'zz' }).length, 1);
  // RECORDED MUTATION: narrowed WINDOWS_ROOT's separator class from `(?:\\{1,2}|\/)` to `\\`
  // only (forward slash no longer matched). Observed: this test's `forward` assertion failed
  // (0 findings instead of 1). Reverted.
});

test('refuses_an_8_3_short_form_profile_path', () => {
  const short = mk('A', 'L', 'I', 'C', 'E') + '~1';
  const p = windowsPath('\\', short);
  const r = scanText(p, { localName: 'zz' });
  assert.equal(r.length, 1);
  assert.equal(r[0].class, '8.3');
  // RECORDED MUTATION: removed the EIGHT_DOT_THREE check from classifySegment (rule (ii)).
  // Observed: this test failed -- the class assertion failed ('unlisted-segment' !== '8.3'), since
  // WINDOWS_ROOT's own match (now misclassified) is the one dedup keeps (it is pushed before the
  // drive-less 8.3 pattern's independent match at the same span). Reverted.
});

test('refuses_a_posix_home_path_under_users_and_home', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const underUsers = `/${mk('U', 's', 'e', 'r', 's')}/${seg}/f`;
  const underHome = `/${mk('h', 'o', 'm', 'e')}/${seg}/f`;
  assert.equal(scanText(underUsers, { localName: 'zz' }).length, 1);
  assert.equal(scanText(underHome, { localName: 'zz' }).length, 1);
  // RECORDED MUTATION: removed the POSIX_ROOT pattern from findMatches' scan loop (rule (iv)).
  // Observed: this test's first assertion failed (0 findings instead of 1, the underUsers case);
  // the underHome case was not reached because assert stopped at the first failure. Reverted.
});

test('a_posix_root_inside_a_word_is_not_a_path_start', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const embedded = `example.com/${mk('h', 'o', 'm', 'e')}/${seg}`;
  assert.equal(scanText(embedded, { localName: 'zz' }).length, 0);
  // RECORDED MUTATION: dropped the `(?<![A-Za-z0-9._~-])` boundary lookbehind from POSIX_ROOT.
  // Observed: this test failed (1 finding instead of 0, the embedded "/home/" now matching).
  // Reverted.
});

test('refuses_an_8_3_segment_under_users_without_a_drive', () => {
  const short = mk('A', 'L', 'I', 'C', 'E') + '~1';
  const backslash = `${mk('U', 's', 'e', 'r', 's')}\\${short}\\file.txt`;
  const forward = `${mk('U', 's', 'e', 'r', 's')}/${short}/file.txt`;
  const r1 = scanText(backslash, { localName: 'zz' });
  const r2 = scanText(forward, { localName: 'zz' });
  assert.equal(r1.length, 1);
  assert.equal(r1[0].class, '8.3');
  assert.equal(r2.length, 1);
  assert.equal(r2[0].class, '8.3');
  // RECORDED MUTATION: confined (ii) to the drive root and the POSIX roots -- required
  // USERS_EIGHT_DOT_THREE_ROOT's lookbehind to also demand an immediately preceding drive
  // (`[A-Za-z]:` or `/c`) or POSIX slash, instead of (iv)'s bare boundary. Observed: this test's
  // first assertion (r1, the backslash form) failed (0 findings instead of 1); the forward-slash
  // case (r2) was not reached because assert stopped at the first failure. Reverted.
});

// ---------------------------------------------------------------------------
// Permitted forms
// ---------------------------------------------------------------------------

test('permits_the_public_folder_and_paths_outside_the_users_root', () => {
  const publicPath = windowsPath('\\', 'Public');
  const outside = `C:\\${mk('P', 'r', 'o', 'j', 'e', 'c', 't', 's')}\\thing`;
  assert.equal(scanText(publicPath, { localName: 'zz' }).length, 0);
  assert.equal(scanText(outside, { localName: 'zz' }).length, 0);
  // RECORDED MUTATION: removed the `/^public$/i.test(segment)` branch from classifySegment.
  // Observed: the publicPath assertion failed (1 finding instead of 0, class 'unlisted-segment').
  // Reverted.
});

test('permits_placeholder_segments', () => {
  const cases = [
    windowsPath('\\', '<redacted:profile>'),
    windowsPath('\\', '$SOMEVAR'),
    windowsPath('\\', '%USERPROFILE%'),
    windowsPath('\\', '...'),
    windowsPath('\\', '\u2026'),
  ];
  for (const c of cases) {
    assert.equal(scanText(c, { localName: 'zz' }).length, 0, c.length.toString());
  }
  // An empty segment: the root at the very end of the text, nothing after it.
  assert.equal(scanText(`C:\\${mk('U', 's', 'e', 'r', 's')}\\`, { localName: 'zz' }).length, 0);
  // RECORDED MUTATION: removed the placeholder branch (empty / `...` / ellipsis / `$`- or
  // `%`-prefixed / wholly `<...>`) from classifySegment. Observed: the loop's first case
  // ('<redacted:profile>', 36 chars) produced 1 finding instead of 0; the remaining four cases and
  // the trailing empty-segment assertion were not reached because assert stopped at the first
  // failure. Reverted.
});

test('admits_only_listed_invented_names', () => {
  for (const name of ['someone', 'someone2', 'x', 'josé', 'someuser']) {
    assert.equal(scanText(windowsPath('\\', name), { localName: 'zz' }).length, 0, name);
  }
  const unlisted = mk('q', 'u', 'e', 'n', 't', 'i', 'n', 'Z');
  assert.equal(scanText(windowsPath('\\', unlisted), { localName: 'zz' }).length, 1);
  // RECORDED MUTATION: made `isListed(INVENTED_NAMES, segment)` always return true. Observed:
  // this test's last assertion failed (0 findings instead of 1 for the unlisted name). Reverted.
});

test('permits_the_generic_machine_accounts', () => {
  for (const name of ['runner', 'user', 'root']) {
    assert.equal(scanText(windowsPath('\\', name), { localName: 'zz' }).length, 0, name);
    assert.equal(scanText(`/${mk('h', 'o', 'm', 'e')}/${name}/f`, { localName: 'zz' }).length, 0, name);
  }
  // RECORDED MUTATION: removed 'runner', 'user', 'root' from MACHINE_ACCOUNTS (emptied the
  // list). Observed: the loop's first case ('runner', windowsPath form) failed (1 finding instead
  // of 0); the remaining five checks were not reached because assert stopped at the first failure.
  // Reverted.
});

// ---------------------------------------------------------------------------
// Rule (iii): the local profile
// ---------------------------------------------------------------------------

test('the_local_profile_is_refused_even_when_listed', () => {
  // 4.3: now observed against the shipped CLI (--message), not a hand-rolled runner script.
  // 7.3 (G2): HOME takes the POSIX form of the listed name, and USERPROFILE keeps the Windows
  // form, as in its three sibling tests -- a Windows-form HOME fails on a POSIX runner, since
  // path.basename(posix) cannot split on backslash.
  const dir = makeTempDir('profile-scan-local-');
  try {
    const listedName = 'someone'; // on INVENTED_NAMES, but here it is *also* the spawned HOME/USERPROFILE basename
    const msgFile = path.join(dir, 'msg.txt');
    fs.writeFileSync(msgFile, `bad ${windowsPath('\\', listedName)}\n`);
    const result = spawnSync('node', [scannerPath, '--message', msgFile], {
      encoding: 'utf8',
      env: { ...process.env, HOME: `/home/${listedName}`, USERPROFILE: `C:\\Users\\${listedName}` },
    });
    assert.equal(result.status, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the localName-equality branch (rule (iii)) from classifySegment
  // and from the dedicated (iii) regex in findMatches, leaving only the invented/machine-account
  // permit checks. Observed: this test failed (exit 0 instead of 1, since 'someone' is on the
  // invented-name list). Reverted.
});

test('the_local_profile_override_spares_machine_accounts', () => {
  // 4.3: now observed against the shipped CLI (--message), not a hand-rolled runner script.
  const dir = makeTempDir('profile-scan-spare-');
  try {
    const msgFile = path.join(dir, 'msg.txt');
    fs.writeFileSync(msgFile, `fine /${mk('h', 'o', 'm', 'e')}/runner/f\n`);
    const result = spawnSync('node', [scannerPath, '--message', msgFile], {
      encoding: 'utf8',
      env: { ...process.env, HOME: '/home/runner', USERPROFILE: '/home/runner' },
    });
    assert.equal(result.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the `isListed(MACHINE_ACCOUNTS, segment)` guard from every place
  // rule (iii) is implemented (classifySegment's localName branch and the dedicated (iii) regex
  // block in findMatches), so (iii) applied to machine accounts too, per S7's forbidden reading.
  // Observed: this test failed (exit 1 instead of 0). Reverted.
});

test('the_local_profile_flattened_form_is_refused', () => {
  // 4.1(f): "Users" or "home", a run of zero or more of \, / and -, then localName, then the end
  // of the text or a non-alphanumeric character. 7.3 (G5): localName is the listed invented name
  // `someuser`, so this proves (iii) overrides the invented-name list for the flattened form too
  // (4.3's row names a listed name, not an unlisted one).
  const localName = 'someuser';
  const env = { ...process.env, HOME: `/home/${localName}`, USERPROFILE: `C:\\Users\\${localName}` };
  const cases = [
    `${mk('U', 's', 'e', 'r', 's')}-${localName}`,
    `${mk('U', 's', 'e', 'r', 's')}${localName}`,
    `${mk('h', 'o', 'm', 'e')}-${localName}-x`,
  ];
  for (const text of cases) {
    const msgFile = path.join(makeTempDir('profile-scan-flat-'), 'msg.txt');
    fs.mkdirSync(path.dirname(msgFile), { recursive: true });
    fs.writeFileSync(msgFile, `bad ${text}\n`);
    try {
      const result = spawnSync('node', [scannerPath, '--message', msgFile], { encoding: 'utf8', env });
      assert.equal(result.status, 1, text);
    } finally {
      fs.rmSync(path.dirname(msgFile), { recursive: true, force: true });
    }
  }
  // A segment merely extending the local name by a letter or digit is not refused by (iii).
  const extended = scanText(`${mk('U', 's', 'e', 'r', 's')}-${localName}2`, { localName });
  assert.equal(extended.length, 0);
  // RECORDED MUTATION: dropped `-` from (iii)'s separator run (the dedicated regex's
  // `(?:[\\/-])*` narrowed to `(?:\\{1,2}|\/)*`). Observed: the loop's first case
  // ('Users-someuser') failed (exit 0 instead of 1); the second hyphen-separated case
  // ('home-someuser-x') and the no-separator case were not reached because assert stopped at the
  // first failure. Reverted.
});

// ---------------------------------------------------------------------------
// A diff header's C-quoted name (7.1(a))
// ---------------------------------------------------------------------------

test('a_content_finding_under_a_non_ascii_local_name_prints_no_segment', () => {
  // 7.1(a): the local name is `josé` -- listed on INVENTED_NAMES, but still refused when it equals
  // the local profile name (rule (iii), as `the_local_profile_is_refused_even_when_listed` proves
  // for another listed name). The staged file sits under a "Users/josé" directory, so git
  // C-quotes the added file's diff header name (it carries a non-ASCII byte); the file's content
  // carries an unrelated, unlisted, invented full form, which is the commit's actual refusal
  // reason. Neither the name nor its octal-escaped form may appear in the printed output.
  const localName = 'josé';
  const usersWord = mk('U', 's', 'e', 'r', 's');
  const unlistedSeg = mk('q', 'u', 'e', 'n', 't', 'i', 'n', 'Z');
  const env = { ...process.env, HOME: `/home/${localName}`, USERPROFILE: `C:\\Users\\${localName}` };
  const dir = makeTempDir('profile-scan-nonascii-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'init.txt'), 'x\n');
    git(dir, ['add', 'init.txt']);
    let r = commit(dir, ['-q', '-s', '-m', 'init']);
    assert.equal(r.status, 0, r.stderr);

    const targetDir = path.join(dir, usersWord, localName);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'bad.txt'), windowsPath('\\', unlistedSeg) + '\n');
    git(dir, ['add', '.']);
    r = commit(dir, ['-q', '-s', '-m', 'bad'], env);
    assert.equal(r.status, 1);
    const combined = `${r.stdout}\n${r.stderr}`;
    assert.equal(combined.includes(localName), false, combined);
    // The octal-escaped form git's own C-quoting would use for the name's non-ASCII byte, built
    // at run time from the name's own UTF-8 bytes -- never hardcoded.
    const octalEscaped = Array.from(Buffer.from(localName, 'utf8'))
      .map((b) => (b >= 0x80 ? `\\${b.toString(8).padStart(3, '0')}` : String.fromCharCode(b)))
      .join('');
    assert.equal(combined.includes(octalEscaped), false, combined);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: restored the bare `b/` strip with no unquoting (in parseAddedLines, dropped
  // the `p.startsWith('"')` branch and cUnquoteGitName, back to `currentFile = p === '/dev/null'
  // ? null : p.replace(/^b\//, '')`). Observed: this test's `octalEscaped` assertion failed (the
  // combined output contained "jos\303\251", the raw C-quoted, un-decoded header name, since the
  // unstripped leading `"` defeated the `b/` replace). Reverted.
});

// ---------------------------------------------------------------------------
// Canary
// ---------------------------------------------------------------------------

test('the_canary_must_be_found_before_a_result_counts', () => {
  assert.equal(checkCanary(() => []), false);
  assert.equal(checkCanary(() => [{ line: 1, class: 'x' }]), true);
  // RECORDED MUTATION: made checkCanary's body `return true;` unconditionally. Observed: this
  // test's first assertion failed (true !== false). Reverted.
});

// ---------------------------------------------------------------------------
// git read failure
// ---------------------------------------------------------------------------

test('a_scan_whose_git_read_fails_aborts_loudly', () => {
  const dir = makeTempDir('profile-scan-abort-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);
    const corruptIndex = path.join(dir, 'corrupt-index');
    fs.writeFileSync(corruptIndex, 'not a git index file');
    const result = spawnSync('sh', [path.join(hooksDir, 'pre-commit')], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, GIT_INDEX_FILE: corruptIndex },
    });
    // 4.1(c): the hook now exits with the scanner's own status when it is non-zero -- here 2
    // (aborted), not the hook's own former fixed 1.
    assert.equal(result.status, 2);
    assert.match(result.stderr, /aborted/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in runGit, changed the catch block to `return '';` (treating a git
  // failure as an empty diff) instead of `return null`. Observed: this test failed (the hook
  // exited 0 with no "aborted" on stderr, since the corrupt index was silently read as no
  // changes). Reverted.
});

// ---------------------------------------------------------------------------
// redact / redact-segment
// ---------------------------------------------------------------------------

test('redact_replaces_only_the_profile_root', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const text = `before ${windowsPath('\\', seg)} after\n`;
  const { output, count } = redactRoots(text, 'zz');
  assert.equal(count, 1);
  assert.equal(output, `before %USERPROFILE%\\${mk('f', 'i', 'l', 'e', '.', 't', 'x', 't')} after\n`);
  // RECORDED MUTATION: in redactRoots, changed `cursor = m.segmentEnd` to also swallow the
  // trailing "\file.txt" by using a fixed larger offset (simulating "replace the whole path").
  // Observed: this test's output-equality assertion failed (the byte-for-byte suffix no longer
  // matched). Reverted.
});

test('redact_segment_keeps_every_byte_but_the_segment', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const text = `before ${windowsPath('\\', seg)} after\n`;
  const { output, count, ok } = redactSegments(text, 'zz');
  assert.equal(ok, true);
  assert.equal(count, 1);
  const expected = `before C:\\${mk('U', 's', 'e', 'r', 's')}\\<redacted:profile>\\${mk('f', 'i', 'l', 'e', '.', 't', 'x', 't')} after\n`;
  assert.equal(output, expected);
  assert.equal(scanText(output, { localName: 'zz' }).length, 0);
  // RECORDED MUTATION: in redactSegments, changed the slice bounds to replace from `m.rootStart`
  // instead of `m.segmentStart` (replacing the root, not just the segment). Observed: this
  // test's output-equality assertion failed (the "C:\Users\" prefix was gone too). Reverted.
});

test('a_redaction_counts_the_local_name_inside_a_longer_segment_once', () => {
  // 7.1(b): the local name is invented and unlisted, and a segment carries it followed by "." and
  // more characters, under a Users root and under a POSIX root. This fires two overlapping refused
  // matches on the same text: the dedicated rule (iii) local-name pattern matches the name alone,
  // and the root's own segment extraction matches the name plus ".ext" as one longer segment. The
  // shorter, contained match must be dropped so each occurrence is counted, printed and redacted
  // once.
  const localName = mk('o', 'v', 'e', 'r', 'l', 'a', 'p', 'Q');
  const seg = `${localName}.ext`;
  const winPath = windowsPath('\\', seg);
  const posixPath = `/${mk('h', 'o', 'm', 'e')}/${seg}/f`;

  {
    const { output, count } = redactSegments(winPath, localName);
    assert.equal(count, 1);
    assert.equal(output, `C:\\${mk('U', 's', 'e', 'r', 's')}\\<redacted:profile>\\${mk('f', 'i', 'l', 'e', '.', 't', 'x', 't')}`);
  }
  {
    const { output, count } = redactRoots(winPath, localName);
    assert.equal(count, 1);
    assert.equal(output, `%USERPROFILE%\\${mk('f', 'i', 'l', 'e', '.', 't', 'x', 't')}`);
  }
  {
    const { output, count } = redactSegments(posixPath, localName);
    assert.equal(count, 1);
    assert.equal(output, `/${mk('h', 'o', 'm', 'e')}/<redacted:profile>/f`);
  }
  {
    const { output, count } = redactRoots(posixPath, localName);
    assert.equal(count, 1);
    assert.equal(output, '$HOME/f');
  }
  // RECORDED MUTATION: exact-span dedup only (dropped the containment filter added in 7.1(b),
  // leaving findMatches' original exact-span-only dedup). Observed: this test's first count
  // assertion failed (redactSegments(winPath, ...): actual 2, expected 1); the remaining three
  // sub-blocks (redactRoots(winPath), redactSegments(posixPath), redactRoots(posixPath)) were not
  // reached. Reverted.
});

test('no_printed_path_carries_a_refused_segment', () => {
  // 4.1(e): every path the CLI prints goes through redactSegments. Exercises a refused staged
  // path name, a --message argument path, and a --redact-segment argument path, each with the
  // (invented) local name embedded in the path on disk, and asserts the segment never appears in
  // stdout or stderr.
  const localName = mk('n', 'o', 'l', 'e', 'a', 'k', 'Q');
  const usersWord = mk('U', 's', 'e', 'r', 's');
  const env = { ...process.env, HOME: `/home/${localName}`, USERPROFILE: `C:\\Users\\${localName}` };

  // (1) a refused staged path name.
  const dir1 = makeTempDir('profile-scan-noleak-staged-');
  try {
    initRepo(dir1);
    fs.writeFileSync(path.join(dir1, 'init.txt'), 'x\n');
    git(dir1, ['add', 'init.txt']);
    let r = commit(dir1, ['-q', '-s', '-m', 'init']);
    assert.equal(r.status, 0, r.stderr);
    fs.mkdirSync(path.join(dir1, usersWord, localName), { recursive: true });
    fs.writeFileSync(path.join(dir1, usersWord, localName, 'note.txt'), 'harmless\n');
    git(dir1, ['add', '.']);
    r = commit(dir1, ['-q', '-s', '-m', 'bad name'], env);
    assert.equal(r.status, 1);
    assert.doesNotMatch(`${r.stdout}\n${r.stderr}`, new RegExp(localName));
  } finally {
    fs.rmSync(dir1, { recursive: true, force: true });
  }

  // (2) the --message argument's own on-disk path.
  const dir2 = makeTempDir('profile-scan-noleak-msg-');
  try {
    const msgDir = path.join(dir2, usersWord, localName);
    fs.mkdirSync(msgDir, { recursive: true });
    const msgFile = path.join(msgDir, 'msg.txt');
    const otherSeg = mk('q', 'u', 'e', 'n', 't', 'i', 'n', 'Z');
    fs.writeFileSync(msgFile, `bad ${windowsPath('\\', otherSeg)}\n`);
    const result = spawnSync('node', [scannerPath, '--message', msgFile], { encoding: 'utf8', env });
    assert.equal(result.status, 1);
    assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, new RegExp(localName));
  } finally {
    fs.rmSync(dir2, { recursive: true, force: true });
  }

  // (3) a --redact-segment argument's own on-disk path.
  const dir3 = makeTempDir('profile-scan-noleak-redact-');
  try {
    const targetDir = path.join(dir3, usersWord, localName);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'note.txt');
    fs.writeFileSync(targetFile, 'harmless\n');
    const result = spawnSync('node', [scannerPath, '--redact-segment', targetFile], { encoding: 'utf8', env });
    assert.equal(result.status, 0);
    assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, new RegExp(localName));
  } finally {
    fs.rmSync(dir3, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in printFindings, cmdRedact and cmdRedactSegment, printed the raw path
  // argument/finding file instead of routing it through safePrintablePath/redactSegments.
  // Observed: sub-case (1)'s doesNotMatch assertion failed (the invented local name appeared in
  // the staged-path-name finding's printed line); sub-cases (2) --message argument and (3)
  // --redact-segment argument were not reached because assert stopped at the first failure.
  // Reverted.
});

// ---------------------------------------------------------------------------
// The CLI entry guard (4.1(b))
// ---------------------------------------------------------------------------

test('the_cli_scans_from_a_path_with_a_space_or_through_a_link', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');

  // A directory whose name has a space.
  const spaceDir = makeTempDir('profile scan space ');
  try {
    const scannerCopy = path.join(spaceDir, 'profile-path-scan.mjs');
    fs.copyFileSync(scannerPath, scannerCopy);
    const msgFile = path.join(spaceDir, 'msg.txt');
    fs.writeFileSync(msgFile, `bad ${windowsPath('\\', seg)}\n`);
    const result = spawnSync('node', [scannerCopy, '--message', msgFile], { encoding: 'utf8' });
    assert.equal(result.status, 1, result.stderr);
  } finally {
    fs.rmSync(spaceDir, { recursive: true, force: true });
  }

  // Reached through a directory link (a junction on win32).
  const realDir = makeTempDir('profile-scan-linktarget-');
  const linkParent = makeTempDir('profile-scan-linkparent-');
  try {
    const scannerCopy = path.join(realDir, 'profile-path-scan.mjs');
    fs.copyFileSync(scannerPath, scannerCopy);
    const linkPath = path.join(linkParent, 'via-link');
    fs.symlinkSync(realDir, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
    const linkedScanner = path.join(linkPath, 'profile-path-scan.mjs');
    const msgFile = path.join(realDir, 'msg.txt');
    fs.writeFileSync(msgFile, `bad ${windowsPath('\\', seg)}\n`);
    const result = spawnSync('node', [linkedScanner, '--message', msgFile], { encoding: 'utf8' });
    assert.equal(result.status, 1, result.stderr);
  } finally {
    fs.rmSync(linkParent, { recursive: true, force: true });
    fs.rmSync(realDir, { recursive: true, force: true });
  }

  // Regression only (win32): a lower-cased drive letter. R saw this correct at 980b10c already.
  if (process.platform === 'win32' && /^[A-Za-z]:/.test(scannerPath)) {
    const dir = makeTempDir('profile-scan-lowerdrive-');
    try {
      const msgFile = path.join(dir, 'msg.txt');
      fs.writeFileSync(msgFile, `bad ${windowsPath('\\', seg)}\n`);
      const lowered = scannerPath[0].toLowerCase() + scannerPath.slice(1);
      const result = spawnSync('node', [lowered, '--message', msgFile], { encoding: 'utf8' });
      assert.equal(result.status, 1, result.stderr);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  // RECORDED MUTATION: restored the old `isMain` check (`path.resolve(process.argv[1]) ===
  // path.resolve(fileURLToPathSafe(import.meta.url))`, with the previous regex-based
  // fileURLToPathSafe helper that read `new URL(url).pathname` without decoding percent-escapes
  // and without dereferencing links). Observed: the space-path case failed (status 0 instead of
  // 1 -- the space was left percent-encoded in the old helper's output, so isMain was false and
  // main() never ran); the link case and the win32-only lower-cased-drive regression case were not
  // reached because assert stopped at the first failure. Reverted.
});

// ---------------------------------------------------------------------------
// Fail-closed on the declared clean line (4.1(c))
// ---------------------------------------------------------------------------

test('pre_commit_fails_closed_without_a_clean_line', () => {
  const { root, hooksSub } = makeIsolatedHookDir('pre-commit', '#!/usr/bin/env node\nprocess.exit(0);\n');
  const dir = makeTempDir('profile-scan-noclean-pre-');
  try {
    git(dir, ['init', '-q']);
    git(dir, ['config', 'user.email', 'test@example.com']);
    git(dir, ['config', 'user.name', 'Test']);
    git(dir, ['config', 'core.hooksPath', hooksSub]);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);
    const r = commit(dir, ['-q', '-s', '-m', 'x']);
    assert.notEqual(r.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(root, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in .githooks/pre-commit, reverted to accepting on exit status 0 alone
  // (dropped the scan_output/CLEAN_LINE comparison, keeping only `if [ "$scan_status" -eq 0 ];
  // then exit 0; fi`). Observed: this test's commit succeeded (status 0) against a stub scanner
  // that exits 0 and prints nothing. Reverted.
});

test('commit_msg_fails_closed_without_a_clean_line', () => {
  const { root, hooksSub } = makeIsolatedHookDir('commit-msg', '#!/usr/bin/env node\nprocess.exit(0);\n');
  const dir = makeTempDir('profile-scan-noclean-msg-');
  try {
    git(dir, ['init', '-q']);
    git(dir, ['config', 'user.email', 'test@example.com']);
    git(dir, ['config', 'user.name', 'Test']);
    git(dir, ['config', 'core.hooksPath', hooksSub]);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);
    const r = commit(dir, ['-q', '-s', '-m', 'x']);
    assert.notEqual(r.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(root, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in .githooks/commit-msg, reverted to accepting on exit status 0 alone
  // after the DCO block (dropped the scan_output/CLEAN_LINE comparison). Observed: this test's
  // commit succeeded (status 0) against a stub scanner that exits 0 and prints nothing. Reverted.
});

test('the_hooks_name_the_scanners_status', () => {
  const cases = [
    { exitCode: 2, expected: /aborted/i },
    { exitCode: 3, expected: /canary/i },
  ];
  for (const { exitCode, expected } of cases) {
    const { root, hooksSub } = makeIsolatedHookDir('pre-commit', `#!/usr/bin/env node\nprocess.exit(${exitCode});\n`);
    const dir = makeTempDir('profile-scan-status-');
    try {
      git(dir, ['init', '-q']);
      git(dir, ['config', 'user.email', 'test@example.com']);
      git(dir, ['config', 'user.name', 'Test']);
      git(dir, ['config', 'core.hooksPath', hooksSub]);
      fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
      git(dir, ['add', 'a.txt']);
      const r = commit(dir, ['-q', '-s', '-m', 'x']);
      assert.notEqual(r.status, 0);
      assert.match(r.stderr, expected);
      assert.doesNotMatch(r.stderr, /profile path/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  // RECORDED MUTATION: in .githooks/pre-commit, collapsed the per-status case statement to a
  // single generic message ("commit refused -- the profile-path scan did not pass") for every
  // non-zero status. Observed: the loop's first case failed (exitCode 2, stderr no longer matched
  // /aborted/i); the exitCode-3 case was not reached because assert stopped at the first failure.
  // Reverted.
});

test('the_commit_msg_hook_names_the_scanners_status', () => {
  // 4.3's status test (`the_hooks_name_the_scanners_status`), against the shipped `commit-msg`,
  // with stub scanners exiting 2 and 3.
  const cases = [
    { exitCode: 2, expected: /aborted/i },
    { exitCode: 3, expected: /canary/i },
  ];
  for (const { exitCode, expected } of cases) {
    const { root, hooksSub } = makeIsolatedHookDir('commit-msg', `#!/usr/bin/env node\nprocess.exit(${exitCode});\n`);
    const dir = makeTempDir('profile-scan-msgstatus-');
    try {
      git(dir, ['init', '-q']);
      git(dir, ['config', 'user.email', 'test@example.com']);
      git(dir, ['config', 'user.name', 'Test']);
      git(dir, ['config', 'core.hooksPath', hooksSub]);
      fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
      git(dir, ['add', 'a.txt']);
      const r = commit(dir, ['-q', '-s', '-m', 'x']);
      assert.notEqual(r.status, 0);
      assert.match(r.stderr, expected);
      assert.doesNotMatch(r.stderr, /profile path/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  // RECORDED MUTATION: in .githooks/commit-msg, collapsed the per-status case statement to a
  // single generic message for every non-zero status. Observed: the loop's first case failed
  // (exitCode 2, stderr no longer matched /aborted/i); the exitCode-3 case was not reached.
  // Reverted.
});

test('a_scanner_load_failure_is_not_named_a_finding', () => {
  // 7.1(c): a finding is named only when the scanner's status is 1 and its stdout is exactly the
  // declared refused line. A stub scanner that throws at load exits 1 (node's own uncaught
  // exception) and prints nothing to stdout, so neither shipped hook may read it as a finding.
  // Hooks are invoked directly (as `a_scan_whose_git_read_fails_aborts_loudly` does), since `git
  // commit` does not pass a hook's own exit code through unchanged.
  {
    const { root, hooksSub } = makeIsolatedHookDir('pre-commit', '#!/usr/bin/env node\nthrow new Error("stub load failure");\n');
    const dir = makeTempDir('profile-scan-loadfail-pre-');
    try {
      git(dir, ['init', '-q']);
      fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
      git(dir, ['add', 'a.txt']);
      const r = spawnSync('sh', [path.join(hooksSub, 'pre-commit')], { cwd: dir, encoding: 'utf8' });
      assert.equal(r.status, 2, r.stderr);
      assert.match(r.stderr, /reported no result/i);
      assert.doesNotMatch(`${r.stdout}${r.stderr}`, /profile path/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
  {
    const { root, hooksSub } = makeIsolatedHookDir('commit-msg', '#!/usr/bin/env node\nthrow new Error("stub load failure");\n');
    const dir = makeTempDir('profile-scan-loadfail-msg-');
    try {
      const msgFile = path.join(dir, 'msg.txt');
      fs.writeFileSync(msgFile, 'x\n\nSigned-off-by: Test <test@example.com>\n');
      const r = spawnSync('sh', [path.join(hooksSub, 'commit-msg'), msgFile], { cwd: dir, encoding: 'utf8' });
      assert.equal(r.status, 2, r.stderr);
      assert.match(r.stderr, /reported no result/i);
      assert.doesNotMatch(`${r.stdout}${r.stderr}`, /profile path/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  // With the shipped scanner on an invented finding, both hooks name a profile-path finding and
  // exit 1.
  {
    const dir = makeTempDir('profile-scan-loadfail-real-staged-');
    try {
      initRepo(dir);
      fs.writeFileSync(path.join(dir, 'init.txt'), 'x\n');
      git(dir, ['add', 'init.txt']);
      let r = commit(dir, ['-q', '-s', '-m', 'init']);
      assert.equal(r.status, 0, r.stderr);
      const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
      fs.writeFileSync(path.join(dir, 'bad.txt'), windowsPath('\\', seg) + '\n');
      git(dir, ['add', 'bad.txt']);
      r = commit(dir, ['-q', '-s', '-m', 'bad']);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /profile path/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  {
    const dir = makeTempDir('profile-scan-loadfail-real-msg-');
    try {
      initRepo(dir);
      fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
      git(dir, ['add', 'a.txt']);
      let r = commit(dir, ['-q', '-s', '-m', 'init']);
      assert.equal(r.status, 0, r.stderr);
      const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
      r = commit(dir, ['-q', '-s', '-m', `bad ${windowsPath('\\', seg)}`, '--allow-empty']);
      assert.equal(r.status, 1);
      assert.match(r.stderr, /profile path/i);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  // RECORDED MUTATION: status 1 alone selects the finding message, in both hooks (reverted the
  // `[ "$scan_status" -eq 1 ] && [ "$scan_output" = "profile-path-scan: refused" ]` guard to just
  // `[ "$scan_status" -eq 1 ]`, in both .githooks/pre-commit and .githooks/commit-msg).
  // Observed: this test's first sub-block failed (the pre-commit stub-load-failure case: actual
  // status 1, expected 2); the commit-msg stub-load-failure case and the two shipped-scanner cases
  // were not reached. Reverted.
});

// ---------------------------------------------------------------------------
// parseAddedLines statefulness (4.1(d))
// ---------------------------------------------------------------------------

test('an_added_line_beginning_with_plus_plus_is_scanned', () => {
  const dir = makeTempDir('profile-scan-plusplus-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'f.txt'), 'base\n');
    git(dir, ['add', 'f.txt']);
    let r = commit(dir, ['-q', '-s', '-m', 'base']);
    assert.equal(r.status, 0, r.stderr);

    const seg = mk('q', 'u', 'e', 'n', 't', 'i', 'n', 'Z');
    // The content itself begins "++ ", so once diffed as an addition the raw diff line begins
    // "+++ " -- indistinguishable, under the old unconditional check, from a file header line.
    const badLine = `++ ${windowsPath('\\', seg)}`;
    fs.appendFileSync(path.join(dir, 'f.txt'), `${badLine}\n`);
    git(dir, ['add', 'f.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'adds a line beginning ++']);
    assert.notEqual(r.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in parseAddedLines, removed the `inFileHeader` state (and its `diff --git`
  // / first-`@@` bounding), restoring the old unconditional `if (raw.startsWith('+++') ||
  // raw.startsWith('---')) continue;`. Observed: this test's commit succeeded (status 0 instead
  // of non-zero) -- the "+++ ..." added line was skipped as if it were a file header. Reverted.
});

// ---------------------------------------------------------------------------
// pre-commit (end to end)
// ---------------------------------------------------------------------------

test('pre_commit_refuses_a_staged_profile_path_and_accepts_public_and_placeholders', () => {
  const dir = makeTempDir('profile-scan-precommit-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'init.txt'), 'x\n');
    git(dir, ['add', 'init.txt']);
    let r = commit(dir, ['-q', '-s', '-m', 'init']);
    assert.equal(r.status, 0, r.stderr);

    const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
    fs.writeFileSync(path.join(dir, 'bad.txt'), windowsPath('\\', seg) + '\n');
    git(dir, ['add', 'bad.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'bad']);
    assert.notEqual(r.status, 0);
    git(dir, ['reset', 'bad.txt']);
    fs.rmSync(path.join(dir, 'bad.txt'));

    fs.writeFileSync(path.join(dir, 'good.txt'), windowsPath('\\', 'Public') + ' ' + windowsPath('\\', '<redacted:profile>') + '\n');
    git(dir, ['add', 'good.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'good']);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: replaced `.githooks/pre-commit`'s scanner invocation line with `true`
  // (skipping the scan entirely). Observed: this test's "bad" commit assertion failed (status 0
  // instead of non-zero -- the refused path was accepted). Reverted.
});

test('pre_commit_scans_added_lines_only', () => {
  const dir = makeTempDir('profile-scan-addedonly-');
  try {
    initRepo(dir);
    const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
    fs.writeFileSync(path.join(dir, 'f.txt'), windowsPath('\\', seg) + '\nkeep\n');
    git(dir, ['add', 'f.txt']);
    // The first commit is made unarmed (hooksPath unset), so the profile-shaped seed line lands
    // in history without being scanned; the point of the test is that the second, armed commit
    // must not rescan it.
    git(dir, ['config', '--unset', 'core.hooksPath']);
    let r = commit(dir, ['-q', '-s', '-m', 'seed']);
    assert.equal(r.status, 0, r.stderr);
    git(dir, ['config', 'core.hooksPath', hooksDir]);

    fs.appendFileSync(path.join(dir, 'f.txt'), 'harmless addition\n');
    git(dir, ['add', 'f.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'append harmless']);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: changed `-U0` to `-U999999` in stagedAddedLinesAgainst's diff args, and
  // made parseAddedLines also collect context lines (leading space, not just `+`) so the whole
  // staged blob is effectively scanned, not just the added lines. Observed: this test's second
  // commit failed (the already-committed profile-shaped line was rescanned and refused).
  // Reverted.
});

test('pre_commit_scans_staged_path_names', () => {
  const dir = makeTempDir('profile-scan-pathname-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'init.txt'), 'x\n');
    git(dir, ['add', 'init.txt']);
    let r = commit(dir, ['-q', '-s', '-m', 'init']);
    assert.equal(r.status, 0, r.stderr);

    // A staged git path name is always relative (no drive letter, no leading slash), so only rule
    // (iii) -- the local-name check, which carries no path-start boundary -- can fire on a bare
    // path name. Spawn with HOME/USERPROFILE set to an invented value and name the file to match,
    // so this exercises the CLI's real os.homedir()-derived localName without depending on (or
    // printing) this machine's actual profile name.
    const seg = mk('q', 'u', 'e', 'n', 't', 'i', 'n', 'Z');
    fs.mkdirSync(path.join(dir, mk('U', 's', 'e', 'r', 's'), seg), { recursive: true });
    fs.writeFileSync(path.join(dir, mk('U', 's', 'e', 'r', 's'), seg, 'note.txt'), 'harmless content\n');
    git(dir, ['add', '.']);
    r = commit(dir, ['-q', '-s', '-m', 'bad name'], { HOME: `/home/${seg}`, USERPROFILE: `C:\\Users\\${seg}` });
    assert.notEqual(r.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in cmdStaged, removed the block that scans `names` (the staged path-name
  // loop). Observed: this test's "bad name" commit assertion failed (status 0 instead of
  // non-zero). Reverted.
});

test('pre_commit_in_a_merge_refuses_only_lines_new_to_every_parent', () => {
  const dir = makeTempDir('profile-scan-merge-');
  try {
    initRepo(dir);
    const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
    fs.writeFileSync(path.join(dir, 'f.txt'), 'base\n');
    git(dir, ['add', 'f.txt']);
    let r = commit(dir, ['-q', '-s', '-m', 'base']);
    assert.equal(r.status, 0, r.stderr);

    git(dir, ['checkout', '-q', '-b', 'other']);
    fs.writeFileSync(path.join(dir, 'f.txt'), `base\n${windowsPath('\\', seg)}\n`);
    git(dir, ['add', 'f.txt']);
    git(dir, ['config', '--unset', 'core.hooksPath']);
    r = commit(dir, ['-q', '-s', '-m', 'other adds the line unarmed']);
    assert.equal(r.status, 0, r.stderr);
    git(dir, ['config', 'core.hooksPath', hooksDir]);

    git(dir, ['checkout', '-q', 'master']);
    fs.writeFileSync(path.join(dir, 'g.txt'), 'unrelated\n');
    git(dir, ['add', 'g.txt']);
    git(dir, ['config', '--unset', 'core.hooksPath']);
    r = commit(dir, ['-q', '-s', '-m', 'master adds g.txt unarmed']);
    assert.equal(r.status, 0, r.stderr);
    git(dir, ['config', 'core.hooksPath', hooksDir]);

    // Merge 'other' into 'master': the profile-shaped line already exists on 'other' (one
    // parent), so it is not new relative to every parent and must not be refused. `--no-commit`
    // then an explicit signed `git commit` keeps this independent of the DCO hook's own merge
    // handling (see commit_msg_dco_refusal_is_unchanged's note on that).
    r = spawnSync('git', ['merge', '--no-ff', '--no-commit', 'other'], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 'Test', GIT_AUTHOR_EMAIL: 't@e.com', GIT_COMMITTER_NAME: 'Test', GIT_COMMITTER_EMAIL: 't@e.com' },
    });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    r = commit(dir, ['-q', '-s', '-m', 'merge other']);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: in cmdStaged, changed getMergeParents to always return only ['HEAD']
  // (diffing against HEAD only, ignoring MERGE_HEAD). Observed: this test's merge commit failed
  // (the line, new relative to 'master' alone, was refused even though 'other' already carried
  // it). Reverted.
});

// ---------------------------------------------------------------------------
// commit-msg
// ---------------------------------------------------------------------------

test('a_message_line_below_a_scissors_line_is_scanned', () => {
  // 4.1(a): `--message` now scans the whole message file. The scissors case moves here, inverted
  // (980b10c's version expected the line below the cut to be ignored; that was the bug).
  const dir = makeTempDir('profile-scan-scissors-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);

    const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
    const msgFile = path.join(dir, 'msg.txt');
    fs.writeFileSync(
      msgFile,
      `fine message\n\nSigned-off-by: Test <test@example.com>\n` +
        `# ------------------------ >8 ------------------------\n` +
        `${windowsPath('\\', seg)}\n`,
    );
    let r = commit(dir, ['-q', '-F', msgFile]);
    assert.notEqual(r.status, 0);

    // `-m` never triggers git's own scissors cleanup, so a literal scissors-looking line inside a
    // `-m` message is ordinary text, and any profile path in the message is scanned regardless.
    r = commit(dir, ['-q', '-s', '-m', `fine\n# ------------------------ >8 ------------------------\n${windowsPath('\\', seg)}`]);
    assert.notEqual(r.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: restored the scissors cut in cmdMessage (findScissorsIndex and
  // lines.slice(0, cut) before scanning). Observed: the first assertion (the `-F` case) failed
  // (status 0 instead of non-zero -- the path below the scissors line was no longer scanned); the
  // `-m` case was not reached because assert stopped at the first failure. Reverted.
});

test('commit_msg_refuses_a_profile_path_in_full_and_8_3_form', () => {
  const dir = makeTempDir('profile-scan-msg-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);
    let r = commit(dir, ['-q', '-s', '-m', 'init']);
    assert.equal(r.status, 0, r.stderr);

    const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
    r = commit(dir, ['-q', '-s', '-m', `bad ${windowsPath('\\', seg)}`, '--allow-empty']);
    assert.notEqual(r.status, 0);

    const short = mk('A', 'L', 'I', 'C', 'E') + '~1';
    r = commit(dir, ['-q', '-s', '-m', `bad ${windowsPath('\\', short)}`, '--allow-empty']);
    assert.notEqual(r.status, 0);

    // Two merge cases (4.2): the message of a merge git concludes itself is scanned the same way
    // a regular commit's message is.
    git(dir, ['checkout', '-q', '-b', 'other']);
    fs.writeFileSync(path.join(dir, 'b.txt'), 'x\n');
    git(dir, ['add', 'b.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'other adds b']);
    assert.equal(r.status, 0, r.stderr);
    git(dir, ['checkout', '-q', 'master']);

    const mergeEnv = {
      ...process.env,
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 't@e.com',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 't@e.com',
    };

    // (a) `git merge --no-ff -m` carrying the path directly.
    r = spawnSync(
      'git',
      ['merge', '--no-ff', '--signoff', '-m', `merge bad ${windowsPath('\\', seg)}`, 'other'],
      { cwd: dir, encoding: 'utf8', env: mergeEnv },
    );
    assert.notEqual(r.status, 0);
    spawnSync('git', ['merge', '--abort'], { cwd: dir, encoding: 'utf8' });

    // (b) a `--no-commit` merge concluded by `git commit -m` carrying the path.
    r = spawnSync('git', ['merge', '--no-ff', '--no-commit', 'other'], { cwd: dir, encoding: 'utf8', env: mergeEnv });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    r = commit(dir, ['-q', '-s', '-m', `merge bad ${windowsPath('\\', seg)}`]);
    assert.notEqual(r.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the scanner invocation block from `.githooks/commit-msg`
  // (leaving only the DCO check). Observed: the first assertion (the full-form message) failed
  // (status 0 instead of non-zero); the 8.3-form case and both merge cases were not reached
  // because assert stopped at the first failure. Reverted.
});

test('commit_msg_dco_refusal_is_unchanged', () => {
  // 2d: "The DCO block and its merge skip are unchanged." Verified directly against a debug hook
  // (a `commit-msg` script that only echoes its argv): this git version (2.49.0) invokes
  // `commit-msg` with exactly one argument, the message-file path -- never a second "source"
  // argument, for `-m`, for a conflict-free `--no-ff` merge, or for a conflict-resolution
  // completion commit. `commit_source` (`${2:-}`) is therefore always empty, so the existing
  // `[ "$commit_source" = "merge" ]` branch never held before this piece and does not hold now;
  // the DCO check runs, unchanged, for every commit including merges. This test proves the
  // actually-shipped behaviour: unsigned is refused (regular or merge), signed-clean is accepted.
  const dir = makeTempDir('profile-scan-dco-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);
    let r = commit(dir, ['-q', '-m', 'unsigned']);
    assert.notEqual(r.status, 0);
    r = commit(dir, ['-q', '-s', '-m', 'signed and clean']);
    assert.equal(r.status, 0, r.stderr);

    git(dir, ['checkout', '-q', '-b', 'side']);
    fs.writeFileSync(path.join(dir, 'b.txt'), 'x\n');
    git(dir, ['add', 'b.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'side commit']);
    assert.equal(r.status, 0, r.stderr);
    git(dir, ['checkout', '-q', 'master']);
    fs.writeFileSync(path.join(dir, 'c.txt'), 'x\n');
    git(dir, ['add', 'c.txt']);
    r = commit(dir, ['-q', '-s', '-m', 'master commit']);
    assert.equal(r.status, 0, r.stderr);
    // An unsigned merge commit is refused too (the DCO check runs unconditionally, per the note
    // above), and a signed one is accepted.
    let m = spawnSync('git', ['merge', '--no-ff', '--no-commit', 'side'], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 'Test', GIT_AUTHOR_EMAIL: 't@e.com', GIT_COMMITTER_NAME: 'Test', GIT_COMMITTER_EMAIL: 't@e.com' },
    });
    assert.equal(m.status, 0, m.stderr + m.stdout);
    r = commit(dir, ['-q', '-m', 'unsigned merge']);
    assert.notEqual(r.status, 0);
    r = commit(dir, ['-q', '-s', '-m', 'signed merge']);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the DCO `if` block from `.githooks/commit-msg` entirely.
  // Observed: this test's first assertion failed (the unsigned commit's status was 0 instead of
  // non-zero). Reverted.
});

// ---------------------------------------------------------------------------
// Self-scan
// ---------------------------------------------------------------------------

test('the_pieces_own_files_pass_the_scan', () => {
  const localName = path.basename(os.homedir());
  const files = [
    scannerPath,
    path.join(here, 'profile-path-scan.test.mjs'),
    path.join(hooksDir, 'pre-commit'),
    path.join(hooksDir, 'commit-msg'),
  ];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const findings = scanText(content, { localName });
    assert.equal(findings.length, 0, `${path.basename(f)}: ${JSON.stringify(findings)}`);
  }
  // RECORDED MUTATION: temporarily added a line to profile-path-scan.mjs containing a literal
  // Windows-drive-form path built from an unlisted invented segment (a drive letter, the "Users"
  // word, an unlisted name, and a trailing filename, joined with backslashes). Observed: this
  // test failed (1 finding on that file instead of 0). Reverted; the line was never committed.
});
