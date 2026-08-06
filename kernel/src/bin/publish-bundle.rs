//! `publish-bundle` — run the publish operation from a command line.
//!
//! The operator-facing entry point for the hero slice's second half, and what the acceptance run
//! drives. It composes the same modules the library does and adds nothing: no second policy, no
//! defaults that the library does not already have.
//!
//! ```text
//! publish-bundle --data <file.parquet> --style <style.json> --viewer <dir> --out <bundle-dir>
//!                [--name parcels] [--attributes zone,area]
//!                [--bbox xmin,ymin,xmax,ymax] [--limit N]
//!                [--license SPDX --license-by who --redistribution permitted|forbidden|unknown]
//!                [--attribution "..."]
//! ```
//!
//! **Publishing is a class-3 external side effect (ADR-006) and there is no approval gate in this
//! slice.** The binary says so on every run rather than letting the absence be discovered: `docs/09`
//! requires the gate, this cut does not implement one, and a tool that performed an irreversible
//! action while silent about that would be the quiet version of the same gap.

use std::path::PathBuf;

use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use spatial_kernel::bundle::Redistribution;
use spatial_kernel::publish::{
    publish, OperatorLicense, PublishPhase, PublishProgress, PublishRequest, ViewerAssets,
    REVERSIBILITY_CLASS,
};

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
    let mut license_by = "operator".to_string();
    let mut attribution: Option<String> = None;
    let mut redistribution = Redistribution::Unknown;

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
            "--bbox" => {
                let v: Vec<f64> = args
                    .next()
                    .unwrap_or_default()
                    .split(',')
                    .filter_map(|s| s.trim().parse().ok())
                    .collect();
                if v.len() != 4 {
                    return Err("--bbox needs xmin,ymin,xmax,ymax".into());
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
            "--license-by" => license_by = args.next().unwrap_or(license_by),
            "--attribution" => attribution = args.next(),
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

    let request = PublishRequest {
        dataset: &dataset,
        dataset_name: &name,
        query,
        attributes,
        style_source: &style_source,
        viewer: &viewer,
        license: license.map(|l| OperatorLicense {
            license: l,
            attribution,
            redistribution,
            by: license_by,
            at: started_at.clone(),
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
