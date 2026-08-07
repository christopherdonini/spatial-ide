// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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
//!            [--duckdb-connections reuse|fresh]
//! ```
//!
//! ## `--duckdb-connections`, and why it is a host flag
//!
//! **The product default is `reuse` and nothing selects otherwise on a shipped path.** `fresh` is
//! the *measurement control* for the reused-connection pass recorded in `kernel/RESULTS.md`: it
//! keeps no configured connection between queries, so every query creates and configures one, as
//! this slice did before connection reuse existed.
//!
//! It is a **host** flag rather than a stream parameter on purpose. `StreamParams` is the
//! operation's SKP-facing surface; putting a storage-engine setting there would enlarge that
//! surface and change the wire format to run an experiment. An operator-facing flag on the binary
//! that composes the modules changes neither, and it cannot be reached by a consumer at all.

use std::path::PathBuf;

use spatial_data_plane::{serve, DataPlaneConfig};
use spatial_engine::{CrsAssertion, PoolConfig};
use spatial_kernel::{Catalog, EngineSourceFactory};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut data: Option<PathBuf> = None;
    let mut assets: Option<PathBuf> = None;
    let mut name = "parcels".to_string();
    let mut assert_crs: Option<String> = None;
    let mut assert_by = "operator".to_string();
    let mut connections = PoolConfig::reuse();
    let mut connections_named = "reuse";

    let mut args = std::env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--data" => data = args.next().map(PathBuf::from),
            "--assets" => assets = args.next().map(PathBuf::from),
            "--name" => name = args.next().unwrap_or(name),
            "--assert-crs" => assert_crs = args.next(),
            "--assert-by" => assert_by = args.next().unwrap_or(assert_by),
            "--duckdb-connections" => {
                match args.next().as_deref() {
                    Some("reuse") => {
                        connections = PoolConfig::reuse();
                        connections_named = "reuse";
                    }
                    Some("fresh") => {
                        connections = PoolConfig::fresh_per_query();
                        connections_named = "fresh";
                    }
                    other => {
                        return Err(format!(
                            "--duckdb-connections takes `reuse` (the product default) or `fresh` \
                             (the measurement control); got {other:?}"
                        )
                        .into())
                    }
                };
            }
            "--help" | "-h" => {
                println!(
                    "slice-host --data <file.parquet> [--name parcels] \
                     [--assets frontends/canvas-probe/dist] [--assert-crs EPSG:2056 --assert-by <who>] \
                     [--duckdb-connections reuse|fresh]"
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

    let mut catalog = Catalog::with_connections(connections);
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
            "covering bbox columns present — SQL filter is a linear scan, and the fixed-grid \
             index is deliberately not in the product planner (kernel/RESULTS.md)"
        } else {
            "no covering bbox column — viewport queries will be refused"
        }
    );
    println!(
        "duckdb conns : {connections_named} (max_idle {}, prepared at open: {})",
        connections.max_idle,
        ds.connections().idle_connections()
    );

    // **Per-stream connection facts, printed as each stream ends.**
    //
    // This is what lets an artifact say which connection mode actually ran rather than which one
    // was asked for — a flag records intent, and only the observed physical-connection and
    // lease-generation values record what happened. The reporter is its own thread and the channel
    // is unbounded, so nothing here can block a producer; the record is emitted when the stream is
    // dropped, which is after it is over and outside any segment a probe measures.
    let (reports, incoming) = std::sync::mpsc::channel::<spatial_kernel::StreamConnectionRecord>();
    std::thread::Builder::new().name("connection-reporter".into()).spawn(move || {
        for r in incoming {
            println!(
                "connection   : dataset={} mode={} physical={} lease={} already_configured={}",
                r.dataset,
                if r.dataset_reuses_connections { "reuse" } else { "fresh" },
                r.physical_id,
                r.lease_generation,
                r.reused_an_existing_connection
            );
            use std::io::Write;
            let _ = std::io::stdout().flush();
        }
    })?;

    let running = serve(DataPlaneConfig {
        factory: std::sync::Arc::new(EngineSourceFactory::with_connection_reports(
            catalog, reports,
        )),
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
