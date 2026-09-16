Question round 8 — 2026-09-16 (custodian → human). One piece, three rulings: the LOD tier builder after its first full gate round (both gates FAIL, narrow; the fix round is in flight; DECISIONS-PENDING entry 99).

1. A dependency edge you have not seen. Your round-6 preflight needs a free-disk reading and Rust's std has none, so the worker made windows-sys 0.61.2 a direct cfg(windows) dependency of the engine (feature Win32_Storage_FileSystem, one call: GetDiskFreeSpaceExW). No new package and no version moved — the crate is already resolved in both lockfiles on main; the diff is one manifest block and one lockfile line each; no new SPDX id; ADR-030's fail-closed licence step re-run; the architect verified the substance independently, Arrow untouched. It is outside the round-3 approval's four named crates, hence filed. Alternatives were worse: a sysinfo/fs2-class crate is a NEW package; spawning PowerShell on a shipped path is what the in-tree free-space code avoids for a reason.
Options:
  1. Accept the edge as recorded (Recommended — the architect's recommendation too).
  2. Reject — the preflight your ruling requires cannot then be built on std alone; the ruling would need revisiting.
  3. Hold.

---

2. The caller rule on build_tiers — the two gates disagree, so it is yours. The module lands with no product caller (three test binaries only; the kernel arm's comment says it is unreachable from the wire). The ARCHITECT ruled it inside round 4 on the round-3 acceptance, quoting §1 ("Tier selection … is not decided, designed or implemented here. It is renderer/shell work under its own gate"), §2f ("no tier is served to the shell at all — this piece builds and validates tiers in the engine and ships no selection") and §9 ("none in this piece, and the reason is recorded rather than the row omitted"): "Round 4 bites on surface a worker invents for a consumer nobody designed; it does not un-approve a piece the human pre-committed with its consumer named and gated." The REVIEWER: those lines state scope, none licenses landing an acting pub entry point without a caller; on the rule as written, blocking by name; round 4 postdates round 3, so the exemption is yours to grant, not a gate's.
Options:
  1. The architect's reading (Recommended): the round-3 acceptance licenses the builder to land ahead of the selection piece; recorded in the PR body and PLAN.yaml — the selection piece is the named caller, and until it lands no product path calls build_tiers (which also keeps item 3's cache empty).
  2. The reviewer's reading: the branch stays unmerged until the selection piece supplies the caller, and lands with it.
  3. Hold.

---

3. The tier-cache lifecycle — the architect's finding; no ADR governs it. Tier directories are keyed by the source's content hash, so an edited source produces a NEW directory and the old one is orphaned; nothing in this cut removes it; at the 5 GB class each orphan is up to 15 GB (the 3.0× bound); the preflight will then refuse on a volume the cache itself filled, naming the source rather than the garbage; no total ceiling, no eviction rule, no operator view. Nothing accumulates today: build_tiers has no product caller.
Options:
  1. Record it as a named, owed decision for ADR-031 and a hard precondition of the selection piece (Recommended): the architect's drafted skeleton carries it — a total-size ceiling declared at its site; an eviction rule (delete-on-supersede or LRU over directories); its runner, never a background job without a scheduler, a priority policy and a cancellation owner; what the operator sees. No product path calls build_tiers before the lifecycle is declared.
  2. Add delete-on-supersede to this piece now — a scope widening under its own amendment and gate round.
  3. Hold.

Recorded, no decision asked: tier building is Windows-only in this cut (the tier root is %LOCALAPPDATA% per your round-3 addition; elsewhere the root does not resolve and the free-space reading is None, so every build refuses, typed and fail-closed) — Amendment 8 dates it as a declared gap beside docs/07's macOS/Linux item, as round 3 dated the geographic-CRS gap. Your round-6 words "tiers.json + the prepare report": there is no prepare report in the tree and §9 (accepted in round 3) gives this piece no operator surface, so Amendment 8 dates the prepare report as owed to the selection piece — unless you say otherwise. P3a: the fresh worker landed all five items; its last gate round is running.
