// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The main webview's browser chrome (ADR-037, the first bullet of "What this ADR does not decide";
//! the reload keys' form, Part A): in a build without `debug_assertions`, `setup()` switches WebView2's
//! default context menus off; in a build with them, both browser settings are set to WebView2's own
//! default, on. One session-log line then states what was read back, or that the settings were not
//! reached (`log_entry`).
//!
//! **Part A alone.** The key setting (`AreBrowserAcceleratorKeysEnabled`) is Part B's, behind the
//! human's approval of two direct dependencies, so this build neither sets nor reads it and its field
//! reads `unread`. **No type of `webview2-com` or `windows-core` is named here**: the shell's
//! `Cargo.toml` lists neither, so the WebView2 values are held only through inferred types (in
//! `reach`) and the trait's error type is this module's own.
//!
//! **No claim of an effect.** What a key or a menu does in the installed build is the WebView2
//! runtime's, and is owed to the human's press (the form's section 1); nothing here says that a key
//! or a menu no longer reloads.

#[cfg(windows)]
use tauri::webview::PlatformWebview;

/// The decision for one build: the value each setting is set to.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) struct Chrome {
    context_menus: bool,
    accelerator_keys: bool,
}

/// A development build (`debug_assertions`, and nothing else) keeps WebView2's default, on for both;
/// any other build turns both off.
pub(crate) fn chrome_for(debug_build: bool) -> Chrome {
    Chrome {
        context_menus: debug_build,
        accelerator_keys: debug_build,
    }
}

/// What one run read for one setting. `Unread` says this run read no value for it: a read failed, or
/// the build makes no WebView2 call that reads it (the key setting without Part B).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Value {
    On,
    Off,
    Unread,
}

impl Value {
    fn word(self) -> &'static str {
        match self {
            Value::On => "on",
            Value::Off => "off",
            Value::Unread => "unread",
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub(crate) struct Readback {
    context_menus: Value,
    accelerator_keys: Value,
}

/// How the closure ended: the settings were not reached (nothing was set), or they were, with what
/// each read back as.
pub(crate) enum Outcome {
    NotReached,
    Reached(Readback),
}

/// This module's own error, so the trait names no `windows-core` type. It carries no text: a
/// session-log line states what was read or not done, and no cause.
#[derive(Debug)]
struct ChromeError;

/// The two settings, each with a setter and a getter. One product impl (`Live`) and one test fake.
trait ChromeSettings {
    fn set_context_menus(&mut self, on: bool) -> Result<(), ChromeError>;
    fn context_menus(&mut self) -> Result<bool, ChromeError>;
    fn set_accelerator_keys(&mut self, on: bool) -> Result<(), ChromeError>;
    fn accelerator_keys(&mut self) -> Result<bool, ChromeError>;
}

/// Sets each setting, then reads each back. A failed setter does not skip the other setting, and the
/// read-back is what the getters answer, not the decision. No `unwrap`, `expect`, indexing or
/// `eprintln!` is on this path.
fn apply(settings: &mut impl ChromeSettings, chrome: Chrome) -> Readback {
    let _ = settings.set_context_menus(chrome.context_menus);
    let _ = settings.set_accelerator_keys(chrome.accelerator_keys);
    Readback {
        context_menus: seen(settings.context_menus()),
        accelerator_keys: seen(settings.accelerator_keys()),
    }
}

fn seen(read: Result<bool, ChromeError>) -> Value {
    match read {
        Ok(true) => Value::On,
        Ok(false) => Value::Off,
        Err(_) => Value::Unread,
    }
}

/// `webview-chrome context_menus=<on|off|unread> accelerator_keys=<on|off|unread>`: values read, no
/// consequence.
fn readback_line(readback: &Readback) -> String {
    format!(
        "webview-chrome context_menus={} accelerator_keys={}",
        readback.context_menus.word(),
        readback.accelerator_keys.word()
    )
}

/// The level and the line `setup()` writes for an outcome: the read-back line at `info` when the
/// settings were reached, and `webview-chrome not-applied` at `error` when they were not.
pub(crate) fn log_entry(outcome: &Outcome) -> (&'static str, String) {
    match outcome {
        Outcome::NotReached => ("error", "webview-chrome not-applied".to_string()),
        Outcome::Reached(readback) => ("info", readback_line(readback)),
    }
}

/// The product impl over the main webview's WebView2 settings: its fields are closures built in
/// `reach`, where the settings' type is inferred, so no WebView2 type is named here.
#[cfg(windows)]
struct Live<'a> {
    set_menus: &'a dyn Fn(bool) -> Result<(), ChromeError>,
    get_menus: &'a dyn Fn() -> Result<bool, ChromeError>,
}

#[cfg(windows)]
impl ChromeSettings for Live<'_> {
    fn set_context_menus(&mut self, on: bool) -> Result<(), ChromeError> {
        (self.set_menus)(on)
    }
    fn context_menus(&mut self) -> Result<bool, ChromeError> {
        (self.get_menus)()
    }
    // Without Part B (the human's approval of two direct dependencies, not filed), this build makes
    // no WebView2 call for the key setting, neither a set nor a read: it leaves the setting as the
    // runtime has it, and the field reads `unread` (the advisor's ruling ADV-2026-11-28-05, item 1).
    // Part B replaces these two bodies with the calls; this build does not pretend to make them.
    fn set_accelerator_keys(&mut self, _on: bool) -> Result<(), ChromeError> {
        Err(ChromeError)
    }
    fn accelerator_keys(&mut self) -> Result<bool, ChromeError> {
        Err(ChromeError)
    }
}

/// Reaches the main webview's settings and applies the decision. Runs inside `with_webview`'s closure
/// (`setup()` is its caller). A failed `CoreWebView2` or `Settings` call means the settings were not
/// reached: nothing was set. The WebView2 calls are exactly `controller()`, `CoreWebView2`,
/// `Settings`, and the context-menu setter and getter, each `unsafe` as the bindings declare it.
#[cfg(windows)]
pub(crate) fn reach(webview: &PlatformWebview, chrome: Chrome) -> Outcome {
    let controller = webview.controller();
    let settings = unsafe { controller.CoreWebView2() }.and_then(|core| unsafe { core.Settings() });
    let Ok(settings) = settings else {
        return Outcome::NotReached;
    };
    let set_menus =
        |on: bool| unsafe { settings.SetAreDefaultContextMenusEnabled(on) }.map_err(|_| ChromeError);
    let get_menus = || {
        let mut value = Default::default();
        unsafe { settings.AreDefaultContextMenusEnabled(&mut value) }
            .map(|()| value.as_bool())
            .map_err(|_| ChromeError)
    };
    let mut live = Live {
        set_menus: &set_menus,
        get_menus: &get_menus,
    };
    Outcome::Reached(apply(&mut live, chrome))
}

/// Only Windows has a WebView2 controller to reach.
#[cfg(not(windows))]
pub(crate) fn reach(_webview: &tauri::webview::PlatformWebview, _chrome: Chrome) -> Outcome {
    Outcome::NotReached
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Clone, Copy)]
    enum Read {
        Stored,
        Is(bool),
        Fails,
    }

    /// The test fake: WebView2's settings start on, a setter stores its value, and a getter returns
    /// the stored value, a fixed one, or an error, as the test says.
    struct Fake {
        menus: bool,
        keys: bool,
        calls: Vec<(&'static str, bool)>,
        menu_set_fails: bool,
        menu_read: Read,
        key_read: Read,
    }

    impl Fake {
        fn new() -> Self {
            Self {
                menus: true,
                keys: true,
                calls: Vec::new(),
                menu_set_fails: false,
                menu_read: Read::Stored,
                key_read: Read::Stored,
            }
        }
    }

    fn read(how: Read, stored: bool) -> Result<bool, ChromeError> {
        match how {
            Read::Stored => Ok(stored),
            Read::Is(value) => Ok(value),
            Read::Fails => Err(ChromeError),
        }
    }

    impl ChromeSettings for Fake {
        fn set_context_menus(&mut self, on: bool) -> Result<(), ChromeError> {
            self.calls.push(("context_menus", on));
            if self.menu_set_fails {
                return Err(ChromeError);
            }
            self.menus = on;
            Ok(())
        }
        fn context_menus(&mut self) -> Result<bool, ChromeError> {
            read(self.menu_read, self.menus)
        }
        fn set_accelerator_keys(&mut self, on: bool) -> Result<(), ChromeError> {
            self.calls.push(("accelerator_keys", on));
            self.keys = on;
            Ok(())
        }
        fn accelerator_keys(&mut self) -> Result<bool, ChromeError> {
            read(self.key_read, self.keys)
        }
    }

    #[test]
    fn chrome_for_decides_both_off_without_debug_assertions_and_both_on_with_them() {
        assert_eq!(
            chrome_for(false),
            Chrome {
                context_menus: false,
                accelerator_keys: false
            }
        );
        assert_eq!(
            chrome_for(true),
            Chrome {
                context_menus: true,
                accelerator_keys: true
            }
        );
    }

    #[test]
    fn apply_sets_each_setting_to_the_decided_value() {
        let mut fake = Fake::new();
        apply(&mut fake, chrome_for(false));
        assert_eq!(fake.calls.len(), 2);
        assert!(fake.calls.contains(&("context_menus", false)));
        assert!(fake.calls.contains(&("accelerator_keys", false)));
    }

    #[test]
    fn a_failed_setting_does_not_skip_the_other_or_panic() {
        let mut fake = Fake::new();
        fake.menu_set_fails = true;
        let readback = apply(&mut fake, chrome_for(false));
        assert!(
            fake.calls.contains(&("accelerator_keys", false)),
            "the key setter was not called after the menu setter failed: {:?}",
            fake.calls
        );
        // The menu's read succeeded (it still reads the stored on), so it is read, not unread.
        assert_eq!(readback.context_menus, Value::On);
        assert_eq!(readback.accelerator_keys, Value::Off);
    }

    #[test]
    fn the_line_states_the_values_read_back_not_the_decision() {
        let mut fake = Fake::new();
        fake.menu_read = Read::Is(true);
        fake.key_read = Read::Is(false);
        // The decision is off for both; the getters answer on and off.
        let line = readback_line(&apply(&mut fake, chrome_for(false)));
        assert_eq!(line, "webview-chrome context_menus=on accelerator_keys=off");
    }

    #[test]
    fn a_line_for_settings_not_reached_is_not_applied_at_error() {
        assert_eq!(
            log_entry(&Outcome::NotReached),
            ("error", "webview-chrome not-applied".to_string())
        );
        let readback = apply(&mut Fake::new(), chrome_for(false));
        let (level, line) = log_entry(&Outcome::Reached(readback));
        assert_eq!(level, "info");
        assert_eq!(line, "webview-chrome context_menus=off accelerator_keys=off");
    }

    #[test]
    fn a_failed_read_reads_unread() {
        let mut fake = Fake::new();
        fake.menu_read = Read::Fails;
        fake.key_read = Read::Is(true);
        let line = readback_line(&apply(&mut fake, chrome_for(false)));
        assert_eq!(line, "webview-chrome context_menus=unread accelerator_keys=on");
    }
}
