// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `publish-bundle` — run the publish operation from a command line.
//!
//! The operator-facing entry point for the hero slice's second half, and what the acceptance run
//! drives. It composes the same modules the library does and adds nothing: no second policy, no
//! defaults that the library does not already have.
//!
//! ```text
//! publish-bundle --data <file.parquet> --style <style.json> --viewer <dir> --out <bundle-dir>
//!                --viewer-program <name> --viewer-copyright <notice> --viewer-license <SPDX>
//!                --viewer-notice <path-within-viewer-dir>
//!                (--corresponding-source-url <http(s) URL> | --corresponding-source-offer <text>)
//!                [--approve <destination name>] [--grant-destination <dir>] [--grant-ttl <seconds>]
//!                [--name parcels] [--attributes zone,area]
//!                [--bbox xmin,ymin,xmax,ymax] [--limit N]
//!                [--license SPDX --license-at <RFC-3339> [--license-by who]
//!                 [--redistribution permitted|forbidden|unknown] [--attribution "..."]]
//! ```
//!
//! `--bbox` carries **no CRS**, which declares its coordinates to be in the dataset's own
//! (ADR-015 §7.3). `--license-at` is **required with `--license`** and is *when the operator made
//! the declaration* — a semantic input, never this run's build clock (ADR-017 §10, §12).
//!
//! **The five `--viewer-*` / `--corresponding-source-*` arguments are required, not optional.** A
//! published bundle distributes the viewer's code, so ADR-009 item 7 makes carrying that code's
//! notice and a corresponding-source route a condition of publishing at all (ADR-017 Corrigendum
//! 3). They are arguments rather than defaults for the same reason `--viewer` is one: this binary
//! does not know what viewer it was handed, and a default would assert a copyright over bytes it
//! did not author. **The two `--license*` families are different things** — `--license` is the
//! *data*'s terms, `--viewer-license` is the *program*'s.
//!
//! ## Publishing is a class-3 external side effect (ADR-006), and it now goes through a gate
//!
//! Every run passes `spatial_kernel::permission::boundary::execute`: a scoped grant, an explicit
//! approval that names the destination, and an append-only audit record written before the
//! operation is authorized and again when it ends. An unauditable publish does not run.
//!
//! **The grant this binary uses is one it mints itself, and that is said plainly rather than dressed
//! up.** Its *source* half is a tautology — the tool grants itself the dataset it just opened and
//! pinned, so the check can only fail if the file changes underneath. Its *destination* half is not:
//! `--grant-destination` is a separate argument from `--out`, so a grant can be scoped to a
//! directory while the publish names one bundle inside it. So what actually gates a command-line
//! publish is the **approval** and the **audit record**; the grant's contribution here is that it
//! exists, carries a grantor, expires, bounds the destination class, and forces the single path.
//! The grant mechanism's teeth are at the library boundary, where a caller supplies a `GrantSet` it
//! did not derive from the request.
//!
//! **`--approve <name>` is approval, not a `--yes`.** Its argument must equal the destination's
//! final path component, so a script approves a *named* destination rather than whatever the command
//! happens to do. Without it the binary prompts and requires the same name to be typed. This is the
//! path the test harness uses, which is what keeps every existing publish test runnable.
//!
//! **Nothing here is an exposure surface.** ADR-017's acceptance condition keeps `publish-bundle`
//! developer/test tooling until an exposure surface passes review; building the gate does not flip
//! that, and this binary defines no SKP message and serves nothing.

use std::path::PathBuf;
use std::time::Duration;

use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use spatial_kernel::bundle::Redistribution;
use spatial_kernel::permission::audit::rfc3339_utc_now;
use spatial_kernel::permission::{
    boundary, ApprovalSource, AuditLog, DestinationScope, GrantSet, OperationKind, PreNamedApproval,
    Principal, PublishAttempt, PublishGrant, SourceScope, StdinApproval, MAX_GRANT_LIFETIME,
};
use spatial_kernel::publish::{
    CorrespondingSource, CorrespondingSourceKind, OperatorLicense, PublishPhase, PublishProgress,
    PublishRequest, ViewerAssets, ViewerLicenseInput, OPERATION_CLASS, REVERSIBILITY_CLASS,
};

/// How long a self-minted grant lives when `--grant-ttl` is not given.
///
/// **Five minutes, not the twenty-minute ceiling.** The ceiling is what `docs/09` illustrates as a
/// reasonable *maximum*; a default should be the shortest span that comfortably covers one
/// interactive publish of a large source, because a default is what almost every run uses. An
/// operator publishing a 5 GB source with a slow hash can raise it, and raising it is a visible act.
const DEFAULT_GRANT_TTL: Duration = Duration::from_secs(300);

/// Refusing both route flags rather than letting the second silently win.
const CORRESPONDING_SOURCE_TWICE: &str =
    "--corresponding-source-url and --corresponding-source-offer are mutually exclusive: a bundle \
     carries one route, and choosing which of two operator statements governs is not this tool's \
     judgement to make";

/// Read the next argument, refusing a blank one.
///
/// Flags whose whole purpose is to carry a claim (`--viewer-program`, `--viewer-copyright`, the two
/// route flags) cannot accept `""`: a blank is not a claim, and it would reach the library only to
/// be refused there with a message that names the field rather than the flag the operator typed.
fn nonempty(
    args: &mut impl Iterator<Item = String>,
    flag: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    let raw = args.next().ok_or_else(|| format!("{flag} needs a value"))?;
    if raw.trim().is_empty() {
        return Err(format!("{flag} needs a non-empty value").into());
    }
    Ok(raw)
}

/// Progress to stderr, so a long publish is not silent (ADR-010 rule 7) and stdout stays parseable.
struct Console;

impl PublishProgress for Console {
    fn phase(&self, phase: PublishPhase) {
        eprintln!("[publish] {}", phase.as_str());
        if phase == PublishPhase::Querying {
            eprintln!(
                "[publish] the query orders by identity, so DuckDB sorts before the first row \
                 arrives; this phase can be quiet for a while on a large source"
            );
        }
    }
    fn partition_written(&self, index: usize, rows: usize, bytes: u64) {
        if index % 20 == 0 {
            eprintln!("[publish] partition {index}: {rows} rows, {bytes} B");
        }
    }
}

/// **`Display`, not `Debug`, and that is not cosmetic.**
///
/// A `main` returning `Result` prints the error's `Debug`, which for every typed refusal in this
/// tree is the struct dump — `Permission(GrantScopeMismatch { detail: "…" })`. Each of those
/// refusals was written to explain itself in a sentence (`docs/05`: a refusal is an error, not a
/// warning; `docs/01` principle 8 forbids the black box), and returning from `main` threw all of
/// that away at the last step. Every refusal message in `publish/error.rs` and
/// `permission/error.rs` reaches an operator only because of this function.
fn main() -> std::process::ExitCode {
    match run() {
        Ok(()) => std::process::ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("[publish] {e}");
            std::process::ExitCode::FAILURE
        }
    }
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut data: Option<PathBuf> = None;
    let mut style_path: Option<PathBuf> = None;
    let mut viewer_dir: Option<PathBuf> = None;
    let mut out: Option<PathBuf> = None;
    let mut name = "parcels".to_string();
    let mut attributes: Vec<String> = Vec::new();
    let mut bbox: Option<Bbox> = None;
    let mut limit: Option<u64> = None;
    let mut license: Option<String> = None;
    // The instant the operator made the declaration. **Supplied, never read from a clock here** —
    // see the `--license-at` arm.
    let mut license_at: Option<String> = None;
    let mut license_by = "operator".to_string();
    let mut attribution: Option<String> = None;
    let mut redistribution = Redistribution::Unknown;
    // The **distributed code's** terms — a different thing from `--license` above, which is the
    // data's. All five are required; see the module docs.
    let mut viewer_program: Option<String> = None;
    let mut viewer_copyright: Option<String> = None;
    let mut viewer_license_id: Option<String> = None;
    let mut viewer_notice: Option<String> = None;
    let mut corresponding_source: Option<CorrespondingSource> = None;
    // The class-3 gate's three operator-facing inputs.
    let mut approve: Option<String> = None;
    let mut grant_destination: Option<PathBuf> = None;
    let mut grant_ttl = DEFAULT_GRANT_TTL;

    let mut args = std::env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--data" => data = args.next().map(PathBuf::from),
            "--style" => style_path = args.next().map(PathBuf::from),
            "--viewer" => viewer_dir = args.next().map(PathBuf::from),
            "--out" => out = args.next().map(PathBuf::from),
            "--name" => name = args.next().unwrap_or(name),
            "--attributes" => {
                attributes = args
                    .next()
                    .ok_or("--attributes needs a comma-separated column list")?
                    .split(',')
                    .map(|s| s.trim().to_string())
                    .filter(|s| !s.is_empty())
                    .collect();
            }
            // **Four fields, each of which must parse.** This was `filter_map(…parse().ok())`
            // followed by a length check, which **silently dropped** anything unparseable: a
            // five-field `--bbox junk,a,b,c,d` collapsed to four numbers and published a window the
            // operator never typed. A dropped component is a different query, and a publish is
            // irreversible.
            "--bbox" => {
                let raw = args.next().ok_or("--bbox needs xmin,ymin,xmax,ymax")?;
                let fields: Vec<&str> = raw.split(',').map(str::trim).collect();
                if fields.len() != 4 {
                    return Err(format!(
                        "--bbox needs exactly four comma-separated values \
                         (xmin,ymin,xmax,ymax); `{raw}` has {}",
                        fields.len()
                    )
                    .into());
                }
                let mut v = [0.0_f64; 4];
                for (slot, field) in v.iter_mut().zip(&fields) {
                    *slot = field
                        .parse()
                        .map_err(|_| format!("--bbox component `{field}` is not a number"))?;
                }
                bbox = Some(Bbox { xmin: v[0], ymin: v[1], xmax: v[2], ymax: v[3] });
            }
            "--limit" => {
                let raw = args.next().ok_or("--limit needs a value")?;
                limit = Some(raw.parse().map_err(|_| format!("--limit `{raw}` is not a number"))?);
            }
            // **Non-empty, checked here.** `declared-by-operator` types `license` as a string and
            // never `null` (ADR-017 §5, Corrigendum 1), and that is only true if an operator cannot
            // declare an empty one: `--license ""` would otherwise put a blank where a claim
            // belongs, in the state whose whole point is that somebody claimed something.
            "--license" => {
                let raw = args.next().ok_or("--license needs a value")?;
                if raw.trim().is_empty() {
                    return Err("--license needs a non-empty value; omit the flag to declare \
                                nothing rather than declaring a blank"
                        .into());
                }
                license = Some(raw);
            }
            // **When the operator declared it** — a semantic input, not build timing.
            //
            // ADR-017 §10 and §12 draw the line this flag exists to respect: `license.at` describes
            // **the request** (an operator made a declaration at an instant, exactly as `by` says
            // who), so it belongs inside §12's determinism surface; when a build began describes
            // **the execution** and lives in `build-info.json`, outside every hash.
            //
            // This binary used to pass its own `started_at` — the build clock — as `license.at`,
            // collapsing precisely those two. It put a value the manifest cannot support into the
            // manifest, and it broke §12's byte-identity guarantee for every operator-declared
            // publish, because a fresh clock reading on each run made two publishes of one request
            // differ. Supplying it is the only way it can be true.
            //
            // **The value is carried verbatim and its format is not interpreted**, on the same
            // ground §10 gives for the license string itself: this operation parses no license
            // metadata. Non-empty is checked; RFC-3339 conformance is the caller's to state.
            "--license-at" => {
                let raw = args.next().ok_or("--license-at needs an RFC-3339 UTC instant")?;
                if raw.trim().is_empty() {
                    return Err("--license-at needs a non-empty value".into());
                }
                license_at = Some(raw);
            }
            "--license-by" => {
                let raw = args.next().ok_or("--license-by needs a value")?;
                if raw.trim().is_empty() {
                    return Err("--license-by needs a non-empty value; omit the flag to accept \
                                the default"
                        .into());
                }
                license_by = raw;
            }
            "--attribution" => attribution = args.next(),

            // ---- the distributed code's terms (ADR-009 item 7; ADR-017 Corrigendum 3) ----------
            //
            // Non-emptiness is enforced by the library for every caller, not only for this one
            // (`admit_viewer_license`). It is checked again here so the operator is told which flag
            // was blank at the point they typed it, rather than being handed a library refusal.
            "--viewer-program" => viewer_program = Some(nonempty(&mut args, "--viewer-program")?),
            "--viewer-copyright" => {
                viewer_copyright = Some(nonempty(&mut args, "--viewer-copyright")?)
            }
            "--viewer-license" => {
                viewer_license_id = Some(nonempty(&mut args, "--viewer-license")?)
            }
            // Relative to `--viewer`'s directory, because that is the namespace the operator is
            // already in. The publisher prefixes `viewer/` when it writes the manifest.
            "--viewer-notice" => viewer_notice = Some(nonempty(&mut args, "--viewer-notice")?),
            // **The two route kinds are mutually exclusive**, and giving both is refused rather
            // than resolved by position — the same discipline `--license` and the source's own
            // declaration get. A bundle carries one route, and picking for the operator would be
            // choosing which of their two statements governs.
            "--corresponding-source-url" => {
                let at = nonempty(&mut args, "--corresponding-source-url")?;
                if corresponding_source.is_some() {
                    return Err(CORRESPONDING_SOURCE_TWICE.into());
                }
                corresponding_source =
                    Some(CorrespondingSource { kind: CorrespondingSourceKind::Url, at });
            }
            "--corresponding-source-offer" => {
                let at = nonempty(&mut args, "--corresponding-source-offer")?;
                if corresponding_source.is_some() {
                    return Err(CORRESPONDING_SOURCE_TWICE.into());
                }
                corresponding_source =
                    Some(CorrespondingSource { kind: CorrespondingSourceKind::WrittenOffer, at });
            }
            // ---- the class-3 gate (ADR-006; docs/09) --------------------------------------------
            //
            // **Approval of *this* operation, never a blanket yes.** The argument must equal the
            // destination's final path component, so a script that outlives an `--out` change is
            // refused rather than silently approving a different destination. Omitting the flag is
            // not "no approval" — it means the interactive prompt, which asks for the same name.
            "--approve" => approve = Some(nonempty(&mut args, "--approve")?),
            // Scopes the grant to a **directory** rather than to the one bundle. Separate from
            // `--out` on purpose: it is the only part of a self-minted grant that is not a
            // tautology, and it is what lets one grant cover a sequence of publishes into a
            // directory without covering anything else.
            "--grant-destination" => {
                grant_destination = Some(PathBuf::from(nonempty(&mut args, "--grant-destination")?))
            }
            "--grant-ttl" => {
                let raw = args.next().ok_or("--grant-ttl needs a value in seconds")?;
                let secs: u64 = raw
                    .parse()
                    .map_err(|_| format!("--grant-ttl `{raw}` is not a number of seconds"))?;
                if secs == 0 {
                    return Err("--grant-ttl must be at least 1 second; a grant that has already \
                                expired when it is issued is not an authorization"
                        .into());
                }
                grant_ttl = Duration::from_secs(secs);
            }
            "--redistribution" => {
                redistribution = match args.next().as_deref() {
                    Some("permitted") => Redistribution::Permitted,
                    Some("forbidden") => Redistribution::Forbidden,
                    Some("unknown") | None => Redistribution::Unknown,
                    Some(other) => return Err(format!("unknown --redistribution `{other}`").into()),
                };
            }
            other => return Err(format!("unknown argument `{other}`").into()),
        }
    }

    let data = data.ok_or("--data is required")?;
    let style_path = style_path.ok_or("--style is required")?;
    let viewer_dir = viewer_dir.ok_or("--viewer is required")?;
    let out = out.ok_or("--out is required")?;

    // **Required, because ADR-009 item 7 makes carrying these a condition of publishing.** The
    // refusal names what the flag is *for*, not merely that it is absent: an operator who has just
    // met these five arguments for the first time needs to know they are discharging a license
    // obligation, not filling in metadata.
    let viewer_license = ViewerLicenseInput {
        program: viewer_program.ok_or(
            "--viewer-program is required: a published bundle distributes the viewer's code, and \
             ADR-009 item 7 requires every bundle to name that code and carry its notice",
        )?,
        copyright: viewer_copyright.ok_or(
            "--viewer-copyright is required: the distributed code's copyright notice, carried \
             verbatim into the bundle (ADR-009 item 7)",
        )?,
        license: viewer_license_id.ok_or(
            "--viewer-license is required (ADR-009 item 7): the distributed code's license \
             identifier, e.g. AGPL-3.0-or-later. This is the *program's* license — `--license` is \
             the *data's*",
        )?,
        notice_path: viewer_notice.ok_or(
            "--viewer-notice is required: the path, relative to --viewer, of the notice file the \
             bundle will carry. It must be one of the files in that directory, and it carries the \
             program's own notice plus the retained notices of every third-party work compiled \
             into it (ADR-017 Corrigendum 3)",
        )?,
        corresponding_source: corresponding_source.ok_or(
            "one of --corresponding-source-url or --corresponding-source-offer is required: \
             ADR-009 item 7 requires every bundle to carry a durable route to the corresponding \
             source of the code it distributes",
        )?,
    };

    // **An operator declaration is a claim, and a claim carries who made it and when.** `by` has a
    // default because "operator" is a truthful stand-in for a tool with no identity model; `at` has
    // none, because the only value this binary could invent is its own build clock — which is the
    // one thing ADR-017 §12 says must never reach the manifest.
    let license_at = match (&license, license_at) {
        (Some(_), Some(at)) => Some(at),
        (Some(_), None) => {
            return Err("--license requires --license-at <RFC-3339 instant>: `license.at` is when \
                        the operator made the declaration (ADR-017 §10), a semantic input inside \
                        the manifest's determinism surface. This tool will not substitute its own \
                        build clock for it — that is execution timing, it belongs in \
                        build-info.json, and it would make two publishes of one request differ"
                .into())
        }
        (None, Some(_)) => {
            return Err("--license-at was given without --license. An operator declaration is \
                        all-or-nothing; there is no manifest state that records when somebody \
                        declared nothing"
                .into())
        }
        (None, None) => None,
    };

    eprintln!(
        "[publish] class {OPERATION_CLASS} external side effect (ADR-006), reversibility \
         {REVERSIBILITY_CLASS}. Gated: scoped grant, explicit approval, audit record. Nothing here \
         is exposed through SKP, MCP or any served surface."
    );

    let cancel = CancelToken::new();
    // Cancellation reaches the operation from a Ctrl-C, which is what makes principle 7's
    // "cancellable" true of the tool and not only of the library.
    {
        let cancel = cancel.clone();
        ctrlc_handler(move || {
            eprintln!("[publish] cancelling — the staging directory will be removed");
            cancel.cancel();
        });
    }

    let started_at = rfc3339_utc_now();

    let dataset = Dataset::open(&data)?;
    eprintln!("[publish] pinning the source (a whole-file hash; cancellable)");
    let (pin, hash_millis) = dataset.pin_content(&cancel)?;
    eprintln!("[publish] pinned in {hash_millis:.1} ms");

    let style_source = std::fs::read_to_string(&style_path)?;
    let viewer = ViewerAssets::from_dir(&viewer_dir)?;

    let query = match bbox {
        // **`bbox_crs` is `None`, and that is the meaning `--bbox` has.** ADR-015 §7.3, in its own
        // words: *"A caller may still send a viewport with **no** CRS, which declares it to be in
        // the dataset's own."* That is exactly this CLI's case — an operator typing coordinates for
        // a file they just named is stating them in that file's CRS, not asserting anything about
        // it.
        //
        // Echoing `dataset.crs().identifier()` back was wrong twice. It manufactured a **caller
        // assertion the caller never made**, out of the very value it would then be compared
        // against — a comparison that cannot fail and therefore establishes nothing, while writing
        // a claim into `operation.filter.bbox_crs` that no operator had made. And on a
        // **definition-only** source every dataset shares the `(definition-only)` placeholder,
        // which §7.3 refuses outright (`ViewportCrsUnidentifiable`), so the echo made `--bbox`
        // unusable on that whole source kind for a reason no operator could read off the command
        // line.
        //
        // **There is deliberately no `--bbox-crs` flag.** With no reprojection in this cut the only
        // admissible value is the one string that matches, so the flag's whole reachable effect
        // would be letting an operator opt into a refusal. When a caller genuinely needs to assert
        // a viewport CRS, the assertion arrives through SKP.
        Some(b) => ViewportQuery { bbox: Some(b), bbox_crs: None, limit },
        None => ViewportQuery { bbox: None, bbox_crs: None, limit },
    };

    // **A dropped flag is said out loud rather than dropped quietly.** An operator declaration is
    // all-or-nothing: `OperatorLicense` is built only when `--license` was given, so `--attribution`
    // on its own reaches nothing. That is correct — ADR-017 §10 defines no operator state that
    // declares attribution without a license, and inventing one here would be deciding a schema
    // question at a command line. What was wrong is that it happened in silence, which is the same
    // failure class as the `"(unnamed)"` this cut removes: the operator believed they had recorded
    // something the bundle does not contain.
    if license.is_none() && attribution.is_some() {
        eprintln!(
            "[publish] --attribution was given without --license and is NOT carried into the \
             bundle: an operator declaration is all-or-nothing, and the manifest defines no \
             attribution-without-license state. Supply --license as well, or expect `license: \
             {{\"state\":\"not-declared\"}}`."
        );
    }

    let request = PublishRequest {
        dataset: &dataset,
        dataset_name: &name,
        query,
        attributes,
        style_source: &style_source,
        viewer: &viewer,
        viewer_license,
        // `at` is `license_at`, **never `started_at`**. The two are different kinds of instant and
        // the whole of ADR-017 §10's box exists to keep them apart; the `--license-at` arm above
        // carries the argument. `license_at` is `Some` exactly when `license` is, by the check
        // above, so the `expect` is discharged there rather than being a hope.
        license: license.map(|l| OperatorLicense {
            license: l,
            attribution,
            redistribution,
            by: license_by,
            at: license_at.expect("--license without --license-at is refused above"),
        }),
        destination: out.clone(),
        started_at,
        // A **clock**, not an instant. `publish` calls it once, after every byte of the bundle is
        // on disk, so `finished_at − started_at` is the build rather than whatever happened before
        // this call.
        finished_at: &rfc3339_utc_now,
    };

    // ---- the class-3 gate ------------------------------------------------------------------
    //
    // Everything below is assembled *before* `boundary::execute`, so a malformed grant or an
    // unopenable log refuses without the operator having been prompted for anything.
    let principal = Principal::from_environment();
    let destination_scope = match &grant_destination {
        Some(dir) => DestinationScope::direct_child_of(dir)?,
        None => DestinationScope::exact(&out)?,
    };
    if grant_ttl > MAX_GRANT_LIFETIME {
        return Err(format!(
            "--grant-ttl {}s exceeds the declared ceiling of {}s (ADR-010 rule 6; docs/09's own \
             \"expires in 20 minutes\")",
            grant_ttl.as_secs(),
            MAX_GRANT_LIFETIME.as_secs()
        )
        .into());
    }

    // **A self-minted grant, and the source half of it is a tautology.** See the module docs: the
    // tool grants itself the dataset it just pinned. It is issued rather than skipped because the
    // grant is what carries a grantor, an expiry and a destination class into the audit record, and
    // because the boundary must have one to check — not because it establishes an authority that
    // came from anywhere else.
    let mut grants = GrantSet::new();
    grants.add(PublishGrant::new(
        OperationKind::Publish,
        SourceScope {
            dataset_name: name.clone(),
            content_hash: format!("sha256:{}", pin.hash()),
        },
        destination_scope,
        principal.clone(),
        grant_ttl,
    )?)?;

    let approval: Box<dyn ApprovalSource> = match approve {
        Some(a) => Box::new(PreNamedApproval(a)),
        None => Box::new(StdinApproval),
    };

    // Opened before the prompt: an operator is never asked to approve an operation that could not
    // have been recorded. This is also the point at which an unwritable log refuses, with no
    // staging directory and no destination created.
    let resolved_destination = spatial_kernel::permission::grant::resolve_destination(&out)?;
    let audit = AuditLog::open_for(&resolved_destination)?;
    eprintln!("[publish] audit log: {}", audit.display_path());

    let attempt = PublishAttempt {
        request: &request,
        grants: &grants,
        approval: approval.as_ref(),
        principal: &principal,
        audit: &audit,
        clock: &rfc3339_utc_now,
    };

    let outcome = boundary::execute(&attempt, &cancel, Some(&Console))?;

    // Facts. No budget, no percentile, no comparison with anything.
    println!("bundle            {}", outcome.bundle_path.display());
    println!("rows              {}", outcome.rows);
    println!("partitions        {}", outcome.partitions);
    println!("total bytes       {}", outcome.total_bytes);
    println!("manifest bytes    {}", outcome.manifest_bytes);
    println!("style hash        {}", outcome.style_hash);
    println!("operation digest  {}", outcome.operation_digest);
    println!("grade             {}", outcome.reproducibility_grade);
    println!("build ms          {:.1}", outcome.build_millis);
    println!("content hash ms   {:.1}", outcome.content_hash_millis);
    Ok(())
}

/// Install a Ctrl-C handler.
///
/// `tokio::signal` is already in this crate's tree and is the portable way to wait on a console
/// control event, so it is what this uses — on **its own thread with its own current-thread
/// runtime**, so the publish itself stays an ordinary synchronous call rather than being dragged
/// into an async context to get one signal.
fn ctrlc_handler(on_signal: impl FnOnce() + Send + 'static) {
    std::thread::spawn(move || {
        let rt = match tokio::runtime::Builder::new_current_thread().enable_all().build() {
            Ok(rt) => rt,
            // A publish that cannot install a signal handler still publishes; it is simply not
            // interruptible from the console, and saying so is better than failing the run.
            Err(e) => {
                eprintln!("[publish] no Ctrl-C handler ({e}); the operation is not interruptible");
                return;
            }
        };
        rt.block_on(async {
            if tokio::signal::ctrl_c().await.is_ok() {
                on_signal();
            }
        });
    });
}
