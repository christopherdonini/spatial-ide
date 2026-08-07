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
//! **Publishing is a class-3 external side effect (ADR-006) and there is no approval gate in this
//! slice.** The binary says so on every run rather than letting the absence be discovered: `docs/09`
//! requires the gate, this cut does not implement one, and a tool that performed an irreversible
//! action while silent about that would be the quiet version of the same gap.

use std::path::PathBuf;

use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use spatial_kernel::bundle::Redistribution;
use spatial_kernel::publish::{
    publish, CorrespondingSource, CorrespondingSourceKind, OperatorLicense, PublishPhase,
    PublishProgress, PublishRequest, ViewerAssets, ViewerLicenseInput, REVERSIBILITY_CLASS,
};

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

fn main() -> Result<(), Box<dyn std::error::Error>> {
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
        "[publish] reversibility class: {REVERSIBILITY_CLASS}. Publishing is a class-3 external \
         side effect (ADR-006); docs/09 requires an approval gate and this slice implements none. \
         Recorded, not implied."
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
    let (_, hash_millis) = dataset.pin_content(&cancel)?;
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
        destination: out,
        started_at,
        // A **clock**, not an instant. `publish` calls it once, after every byte of the bundle is
        // on disk, so `finished_at − started_at` is the build rather than whatever happened before
        // this call.
        finished_at: &rfc3339_utc_now,
    };

    let outcome = publish(&request, &cancel, Some(&Console))?;

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

/// RFC-3339 UTC, computed here rather than inside the operation.
///
/// Keeping the clock out of `publish` is what lets a determinism test publish twice and compare
/// bytes: the instants are inputs, and they reach only the non-hashed sidecar.
fn rfc3339_utc_now() -> String {
    let d = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default();
    let secs = d.as_secs() as i64;
    let days = secs.div_euclid(86_400);
    let tod = secs.rem_euclid(86_400);
    // Civil-from-days (Howard Hinnant's algorithm), so no date crate is pulled in for one string.
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z.rem_euclid(146_097);
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = if mp < 10 { mp + 3 } else { mp - 9 };
    let year = if month <= 2 { y + 1 } else { y };
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        tod / 3_600,
        (tod % 3_600) / 60,
        tod % 60
    )
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
