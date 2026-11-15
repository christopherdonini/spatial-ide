//! O0's probe (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md, section 3). std only. Prints what
//! it records and no path. Exit 0 = ran to the end, 1 = an open or read failed, 2 = TIMEOUT.
use std::io::{Error, Read};
use std::{env, fs, path::Path, process::exit, process::Command, thread, time::Duration};
use std::{sync::mpsc, time::Instant};

const LIMIT: Duration = Duration::from_secs(120);

#[cfg(windows)]
fn attrs(m: &fs::Metadata) -> String {
    let a = std::os::windows::fs::MetadataExt::file_attributes(m);
    let mut s = format!("attrs=0x{a:08x}");
    for (bit, name) in [
        (0x400, "reparse_point"),
        (0x1000, "offline"),
        (0x4_0000, "recall_on_open"),
        (0x40_0000, "recall_on_data_access"),
        (0x8_0000, "pinned"),
        (0x10_0000, "unpinned"),
    ] {
        s += &format!(" {name}={}", a & bit != 0);
    }
    s
}
#[cfg(not(windows))]
fn attrs(_: &fs::Metadata) -> String {
    "attrs=not-windows".into()
}

fn failed(step: &str, e: Error) -> ! {
    println!(
        "{step} error kind={:?} os_error={:?}",
        e.kind(),
        e.raw_os_error()
    );
    exit(1)
}

fn stat(label: &str, p: &Path) -> String {
    let line = match fs::symlink_metadata(p) {
        Ok(m) => {
            let (t, l, a) = (m.file_type(), m.len(), attrs(&m));
            let (s, f, d) = (t.is_symlink(), t.is_file(), t.is_dir());
            format!("is_symlink={s} is_file={f} is_dir={d} len={l} {a}")
        }
        Err(e) => format!("error kind={:?} os_error={:?}", e.kind(), e.raw_os_error()),
    };
    println!("{label}: {line}");
    line
}

/// Runs `f` on a thread; once `LIMIT` has passed it prints TIMEOUT and exits 2.
fn bounded<T: Send + 'static>(step: &str, f: impl FnOnce() -> T + Send + 'static) -> T {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || drop(tx.send(f())));
    rx.recv_timeout(LIMIT).unwrap_or_else(|_| {
        println!("TIMEOUT {step} after {}s", LIMIT.as_secs());
        exit(2)
    })
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("usage: b2-1c-onedrive-probe <file> <absolute scratch folder>");
        exit(64);
    }
    let (file, scratch) = (Path::new(&args[1]), Path::new(&args[2]));
    println!("os={} limit_s={}", env::consts::OS, LIMIT.as_secs());
    let before = stat("file before anything opens it", file);
    let parent = file.parent().filter(|p| !p.as_os_str().is_empty());
    let (mut entries, mut links) = (0, 0);
    for e in fs::read_dir(parent.unwrap_or(Path::new(".")))
        .unwrap_or_else(|e| failed("read_dir", e))
        .flatten()
    {
        let Ok(m) = fs::symlink_metadata(e.path()) else {
            continue;
        };
        (entries, links) = (entries + 1, links + m.file_type().is_symlink() as u32);
        if Some(e.file_name().as_os_str()) == file.file_name() {
            stat("file as the walk sees it", &e.path());
        }
    }
    println!("walk: entries={entries} symlinks={links}");
    let after = stat("file after the walk", file);
    println!("walk_changed_metadata={}", before != after);
    let (p, t) = (file.to_path_buf(), Instant::now());
    let mut f = bounded("open", move || fs::File::open(p)).unwrap_or_else(|e| failed("open", e));
    println!("open: ok after {} ms", t.elapsed().as_millis());
    stat("file after open", file);
    let t = Instant::now();
    let read = bounded("read", move || {
        let mut v = Vec::new();
        f.read_to_end(&mut v).map(|_| v.len())
    });
    let n = read.unwrap_or_else(|e| failed("read", e));
    println!("read: bytes={n} after {} ms", t.elapsed().as_millis());
    stat("file after read", file);
    let dir = scratch.join(format!("b2c-p-junction-{}", std::process::id()));
    // mklink rejects a forward slash, so the separators are made native.
    let dir = dir
        .to_string_lossy()
        .replace('/', std::path::MAIN_SEPARATOR_STR);
    let (target, link) = (Path::new(&dir).join("target"), Path::new(&dir).join("link"));
    let made = fs::create_dir_all(&target).is_ok();
    let mut c = Command::new("cmd");
    c.args(["/C", "mklink", "/J"]).arg(&link).arg(&target);
    let mk = c.output().map(|o| o.status.success()).map_err(|e| e.kind());
    println!("junction: scratch_dir_made={made} mklink_exit_ok={mk:?}");
    stat("junction", &link);
    let (rl, kept) = (fs::remove_dir(&link).is_ok(), target.is_dir());
    let rd = fs::remove_dir_all(&dir).is_ok();
    println!("junction: link_removed={rl} target_kept={kept} dir_removed={rd}");
    stat("junction after removal", &link);
    println!("done");
}
