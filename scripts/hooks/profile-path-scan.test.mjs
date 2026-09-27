// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for scripts/hooks/profile-path-scan.mjs, per
// scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md §4. Every profile-shaped string here is
// built at run time from invented parts, or uses a name from the scanner's own listed sets
// (INVENTED_NAMES / MACHINE_ACCOUNTS) -- never a literal full path -- per §1 and the piece's
// output discipline. Each test's `// RECORDED MUTATION:` comment names the mutation applied to
// prove the test actually exercises the behaviour it claims, per §4's table.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  // Observed: this test failed (0 findings, since a bare 6-letter+digit segment is not on any
  // permit list either -- wait, it still refuses as unlisted-segment, so the class assertion
  // failed: 'unlisted-segment' !== '8.3'). Reverted.
});

test('refuses_a_posix_home_path_under_users_and_home', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const underUsers = `/${mk('U', 's', 'e', 'r', 's')}/${seg}/f`;
  const underHome = `/${mk('h', 'o', 'm', 'e')}/${seg}/f`;
  assert.equal(scanText(underUsers, { localName: 'zz' }).length, 1);
  assert.equal(scanText(underHome, { localName: 'zz' }).length, 1);
  // RECORDED MUTATION: removed the POSIX_ROOT pattern from findMatches' scan loop (rule (iv)).
  // Observed: this test failed (both assertions: 0 findings instead of 1). Reverted.
});

test('a_posix_root_inside_a_word_is_not_a_path_start', () => {
  const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
  const embedded = `example.com/${mk('h', 'o', 'm', 'e')}/${seg}`;
  assert.equal(scanText(embedded, { localName: 'zz' }).length, 0);
  // RECORDED MUTATION: dropped the `(?<![A-Za-z0-9._~-])` boundary lookbehind from POSIX_ROOT.
  // Observed: this test failed (1 finding instead of 0, the embedded "/home/" now matching).
  // Reverted.
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
  // `%`-prefixed / wholly `<...>`) from classifySegment. Observed: every case above produced 1
  // finding instead of 0. Reverted.
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
  // list). Observed: all six assertions failed (1 finding instead of 0). Reverted.
});

// ---------------------------------------------------------------------------
// Rule (iii): the local profile
// ---------------------------------------------------------------------------

test('the_local_profile_is_refused_even_when_listed', () => {
  const dir = makeTempDir('profile-scan-local-');
  try {
    const script = `import { scanText } from ${JSON.stringify(pathToFileURL(scannerPath).href)};\n` +
      `const os = await import('node:os'); const path = await import('node:path');\n` +
      `const localName = path.basename(os.homedir());\n` +
      `console.log(JSON.stringify(scanText(process.argv[2], { localName })));\n`;
    const runnerFile = path.join(dir, 'runner.mjs');
    fs.writeFileSync(runnerFile, script);
    const listedName = 'someone'; // on INVENTED_NAMES, but here it is *also* the spawned HOME/USERPROFILE basename
    const p = windowsPath('\\', listedName);
    const result = spawnSync('node', [runnerFile, p], {
      encoding: 'utf8',
      env: { ...process.env, HOME: `C:\\Users\\${listedName}`, USERPROFILE: `C:\\Users\\${listedName}` },
    });
    const findings = JSON.parse(result.stdout);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].class, 'local-profile');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the localName-equality branch (rule (iii)) from classifySegment,
  // leaving only the invented/machine-account permit checks. Observed: this test failed (0
  // findings instead of 1, since 'someone' is on the invented-name list). Reverted.
});

test('the_local_profile_override_spares_machine_accounts', () => {
  const dir = makeTempDir('profile-scan-spare-');
  try {
    const script = `import { scanText } from ${JSON.stringify(pathToFileURL(scannerPath).href)};\n` +
      `const os = await import('node:os'); const path = await import('node:path');\n` +
      `const localName = path.basename(os.homedir());\n` +
      `console.log(JSON.stringify(scanText(process.argv[2], { localName })));\n`;
    const runnerFile = path.join(dir, 'runner.mjs');
    fs.writeFileSync(runnerFile, script);
    const p = `/${mk('h', 'o', 'm', 'e')}/runner/f`;
    const result = spawnSync('node', [runnerFile, p], {
      encoding: 'utf8',
      env: { ...process.env, HOME: '/home/runner', USERPROFILE: '/home/runner' },
    });
    const findings = JSON.parse(result.stdout);
    assert.equal(findings.length, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the `isListed(MACHINE_ACCOUNTS, segment)` guard from both places
  // rule (iii) is implemented -- the LOCAL_NAME_ROOT branch of findMatches, and classifySegment's
  // localName branch (this test's `/home/runner/...` is a POSIX_ROOT match, so classifySegment's
  // own guard has to be removed too, or it alone rescues the result) -- so (iii) applied to
  // machine accounts too, per S7's forbidden reading. Observed: this test failed (1 finding
  // instead of 0, class 'local-profile'). Reverted.
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
    assert.equal(result.status, 1); // the hook itself exits 1 on any non-zero scanner exit
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
    // First commit is unarmed on purpose (nothing staged carries a real risk here yet -- wait,
    // it does; use a throwaway scanner-free path by committing straight via git without the
    // hook, to seed history with an already-refused-shaped line that must NOT be rescanned).
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

test('commit_msg_refuses_a_profile_path_in_full_and_8_3_form', () => {
  const dir = makeTempDir('profile-scan-msg-');
  try {
    initRepo(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x\n');
    git(dir, ['add', 'a.txt']);

    const seg = mk('a', 'l', 'i', 'c', 'e', 'Z');
    let r = commit(dir, ['-q', '-s', '-m', `bad ${windowsPath('\\', seg)}`]);
    assert.notEqual(r.status, 0);

    const short = mk('A', 'L', 'I', 'C', 'E') + '~1';
    r = commit(dir, ['-q', '-s', '-m', `bad ${windowsPath('\\', short)}`]);
    assert.notEqual(r.status, 0);

    // -F form, and text below the scissors line is ignored.
    const msgFile = path.join(dir, 'msg.txt');
    fs.writeFileSync(
      msgFile,
      `fine message\n\nSigned-off-by: Test <test@example.com>\n` +
        `# ------------------------ >8 ------------------------\n` +
        `${windowsPath('\\', seg)}\n`,
    );
    r = commit(dir, ['-q', '-F', msgFile]);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // RECORDED MUTATION: removed the scanner invocation block from `.githooks/commit-msg`
  // (leaving only the DCO check). Observed: this test's first two assertions failed (status 0
  // instead of non-zero for both profile-shaped messages). Reverted.
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
