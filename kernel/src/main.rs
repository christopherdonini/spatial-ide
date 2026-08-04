//! `slice-host` — runs the first engine slice end to end.
//!
//! Opens a GeoParquet dataset, serves the data plane on loopback, and prints the URL a browser
//! consumer opens. The credential is in that URL's fragment, which browsers never transmit, and is
//! **printed, never written**: ADR-012's threat model requires that the production transport not
//! write the credential to disk, and the harness's `launch-url.txt` is not reproduced here.
//!
//! ```text
//! slice-host --data <file.parquet> [--name parcels] [--assets frontends/canvas-probe/dist]
//!            [--assert-crs EPSG:2056 --assert-by <who>]
//! ```

use std::path::PathBuf;

use spatial_data_plane::{serve, DataPlaneConfig};
use spatial_engine::CrsAssertion;
use spatial_kernel::{Catalog, EngineSourceFactory};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut data: Option<PathBuf> = None;
    let mut assets: Option<PathBuf> = None;
    let mut name = "parcels".to_string();
    let mut assert_crs: Option<String> = None;
    let mut assert_by = "operator".to_string();

    let mut args = std::env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--data" => data = args.next().map(PathBuf::from),
            "--assets" => assets = args.next().map(PathBuf::from),
            "--name" => name = args.next().unwrap_or(name),
            "--assert-crs" => assert_crs = args.next(),
            "--assert-by" => assert_by = args.next().unwrap_or(assert_by),
            "--help" | "-h" => {
                println!(
                    "slice-host --data <file.parquet> [--name parcels] \
                     [--assets frontends/canvas-probe/dist] [--assert-crs EPSG:2056 --assert-by <who>]"
                );
                return Ok(());
            }
            other => return Err(format!("unknown argument `{other}`").into()),
        }
    }

    let data = data.ok_or("--data <file.parquet> is required")?;

    let assertion = assert_crs.map(|identifier| CrsAssertion {
        identifier,
        definition_json: None,
        by: assert_by,
        // The assertion records when it was made. There is no clock authority in this slice, so
        // this is the host's own wall clock and is recorded as such.
        at: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| format!("unix:{}", d.as_secs()))
            .unwrap_or_else(|_| "unix:unknown".into()),
    });

    let mut catalog = Catalog::new();
    // A refusal here is the point of the refusal: it happens at open, in front of an operator,
    // before anything is served.
    catalog.open(&name, &data, assertion)?;
    let ds = catalog.get(&name).expect("just opened");

    println!("dataset      : {name} ({})", data.display());
    println!("crs          : {} (source: {})", ds.crs().identifier(), ds.crs().source().as_str());
    println!("axis order   : {} (normalization: none-performed)", ds.crs().axis_order().as_str());
    println!("geoparquet   : {}", ds.geoparquet_version());
    println!(
        "viewport     : {}",
        if ds.covering().is_some() {
            "covering bbox columns present — SQL filter is a linear scan, not an index"
        } else {
            "no covering bbox column — viewport queries will be refused"
        }
    );

    let running = serve(DataPlaneConfig {
        factory: std::sync::Arc::new(EngineSourceFactory::new(catalog)),
        static_dir: assets,
    })
    .await?;

    println!("data plane   : 127.0.0.1:{} (loopback, ephemeral port)", running.addr.port());
    println!("open         : {}", running.launch_url());
    println!("\nADR-012 is Proposed; this adapter is the provisional choice per the bake-off");
    println!("README §19.10 step 3, and is not a transport decision. Ctrl-C to stop.");

    tokio::signal::ctrl_c().await?;
    running.shutdown().await;
    Ok(())
}
