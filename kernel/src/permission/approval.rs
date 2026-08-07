// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Explicit approval** — ADR-006's third missing obligation, and the one `docs/09` states without
//! exemption: "Class-3 side effects always require approval."
//!
//! ## Approval is not the grant, and the division of labour is the design
//!
//! The **grant** authorizes a class and a scope: this operator may publish *this* dataset to *this*
//! destination class, until *then*. The **approval** confirms *this execution*. Both are checked,
//! each has its own typed refusal, and neither substitutes for the other. `docs/09`'s "export and
//! publish are distinct capabilities, never implied" is the same idea carried one step further:
//! having the capability is not the same as having exercised it deliberately.
//!
//! ## One check, two producers
//!
//! [`ApprovalSource`] has one method. [`StdinApproval`] asks a human; [`PreNamedApproval`] carries
//! `--approve <value>`. Both funnel into [`check`], so there is exactly one comparison and no
//! second policy at the command line. A future SKP surface adds a third implementation and touches
//! nothing else — that is the seam, and it is why this is a trait rather than an inlined
//! `read_line`.
//!
//! ## What must be typed, and why it is the basename
//!
//! The confirmation phrase is the **final path component of the resolved destination**.
//!
//! - It is checkable against a *fact*: `resolved.file_name()`, not the string in argv. Typing the
//!   argv string back would confirm only that the operator can read their own command line — the
//!   self-description problem ADR-015 refuses in the CRS case.
//! - It is typeable. A full resolved absolute path is 40–80 characters of backslashes and possibly a
//!   `\\?\` prefix; a confirmation nobody can type reliably trains people to paste from scrollback,
//!   and a pasted confirmation confirms nothing.
//! - **What it does not establish, stated:** a basename does not distinguish `A/parcels` from
//!   `B/parcels`. That distinction is the **grant's** job — `DestinationScope` is checked against
//!   the resolved destination — which is exactly why the weaker-but-typeable phrase is sufficient
//!   here and would not be if approval were doing scope's work. A stale hardcoded `--approve` in a
//!   script that outlived an `--out` change is caught by the grant, not by this.
//!
//! Comparison is byte-exact after trimming ASCII whitespace. **No case folding, no separator
//! smoothing, no path normalization** — every normalization inside a confirmation comparison is a
//! place "close enough" creeps in.
//!
//! ## There is no timeout, and none is claimed
//!
//! `std` cannot read a line from stdin with a deadline, and neither construction that would fake one
//! is acceptable here:
//!
//! - **A reader thread plus `recv_timeout`** works, but `std::io::Stdin::read_line` is
//!   uncancellable: on timeout the thread stays blocked on the console until someone presses Enter,
//!   and the process cannot exit cleanly. Shipping a timeout whose failure mode is a hung CLI is
//!   worse than the gap it fills.
//! - **`tokio`** is in the tree and would work, but the publish path is deliberately synchronous and
//!   the CLI already isolates tokio to one thread for the sole purpose of Ctrl-C. Dragging a runtime
//!   onto the approval path for one deadline is the coupling that isolation exists to avoid.
//!
//! So a timeout is **deferred with reason** rather than claimed, and [`RefusalReason`] has no
//! `Timeout` variant to imply otherwise. Terminal detection is likewise not attempted: `std` has no
//! `isatty`, so "not a terminal" is not a case this can name.
//!
//! **What supplies the property a timeout would have:** the grant is checked **twice** — once before
//! the prompt, so an unauthorized operation is never even described to an operator, and once
//! immediately after approval against a fresh clock reading. A stale approval therefore cannot ride
//! an expired grant. No thread and no runtime, and the bound is the grant's own declared lifetime
//! rather than an arbitrary prompt deadline.

use std::io::{BufRead, Write};

use super::error::{PermissionError, RefusalReason};

/// Everything an operator needs to decide, as plain data.
///
/// **Deliberately owned `String`s with no `Path` and no borrowed engine types.** A future SKP
/// approval request is then a *transcription* of this struct rather than a new type — which is what
/// makes the seam survive exposure. It is **not** serialized today, and no SKP message is defined;
/// defining one is exposure, and exposure needs its own review.
#[derive(Clone, Debug)]
pub struct ApprovalPrompt {
    pub operation: &'static str,
    /// ADR-006's class. 3.
    pub class: u8,
    /// ADR-006's declared reversibility. `irreversible`.
    pub reversibility: &'static str,
    pub source_name: String,
    pub source_content_hash: String,
    pub style_hash: String,
    /// The **resolved** destination, shown in full and deliberately **not** normalized: the operator
    /// is being asked to confirm where a bundle is going, and a token like `<user-home>` would hide
    /// exactly the thing they are meant to check. Nothing here is written to disk — the audit
    /// record carries the normalized form instead.
    pub destination_display: String,
    /// What must be typed.
    pub confirmation_phrase: String,
    pub grantor: String,
    pub grant_remaining_s: u64,
}

impl ApprovalPrompt {
    /// The prompt as an operator sees it. One place, so the interactive path and any future surface
    /// present the same facts.
    pub fn render(&self) -> String {
        format!(
            "\n\
             ── approval required ──────────────────────────────────────────────\n\
             operation      {}\n\
             class          {} (external side effect, ADR-006)\n\
             reversibility  {}\n\
             source         {}  {}\n\
             style          {}\n\
             destination    {}\n\
             grantor        {}   grant expires in {}s\n\
             \n\
             This cannot be undone. Nothing here can remove a published bundle.\n\
             Type the destination's name to approve, or anything else to refuse: {}\n\
             > ",
            self.operation,
            self.class,
            self.reversibility,
            self.source_name,
            self.source_content_hash,
            self.style_hash,
            self.destination_display,
            self.grantor,
            self.grant_remaining_s,
            self.confirmation_phrase,
        )
    }
}

/// A given approval. Constructing one is the only way to approve anything.
#[derive(Clone, Debug)]
pub struct Approval(String);

impl Approval {
    pub fn new(answer: impl Into<String>) -> Self {
        Self(answer.into())
    }

    pub fn answer(&self) -> &str {
        &self.0
    }
}

/// Where an approval comes from.
pub trait ApprovalSource {
    fn respond(&self, prompt: &ApprovalPrompt) -> Result<Approval, PermissionError>;

    /// How this approval reached the boundary, for the audit record.
    fn route(&self) -> super::audit::ApprovalRoute;
}

/// Ask a human on stdin.
///
/// **Blocking, and that is a constraint on where it may ever be used.** Reached through a UI or SKP
/// on a kernel thread this would block the kernel for human-scale time, which *is*
/// `docs/01`'s "never block the canvas". At a command line there is no canvas and no operation
/// running yet — the prompt is asked *before* the operation starts, so principle 7's
/// cancellable/streaming/progress-reporting requirements have nothing to attach to. Any future
/// `ApprovalSource` reached from a served surface must be non-blocking; this one must not be
/// inherited.
pub struct StdinApproval;

impl ApprovalSource for StdinApproval {
    fn respond(&self, prompt: &ApprovalPrompt) -> Result<Approval, PermissionError> {
        // stderr, so stdout stays parseable — the same split the CLI already uses for progress.
        let mut err = std::io::stderr();
        let _ = err.write_all(prompt.render().as_bytes());
        let _ = err.flush();

        let mut line = String::new();
        // **One read, no retry loop.** A prompt that asks again is a prompt that can be worn down.
        match std::io::stdin().lock().read_line(&mut line) {
            Ok(0) => Err(PermissionError::ApprovalRefused {
                reason: RefusalReason::Eof,
                expected: prompt.confirmation_phrase.clone(),
            }),
            Ok(_) => Ok(Approval::new(line)),
            Err(e) => Err(PermissionError::ApprovalUnavailable { detail: e.to_string() }),
        }
    }

    fn route(&self) -> super::audit::ApprovalRoute {
        super::audit::ApprovalRoute::Interactive
    }
}

/// An approval supplied ahead of time — `--approve <destination>`, and every test.
///
/// **Approval-by-flag is still approval of *this* operation**, never a blanket `--yes`: the argument
/// must match the confirmation phrase, so a script approves a named destination rather than
/// whatever the command happens to do.
pub struct PreNamedApproval(pub String);

impl ApprovalSource for PreNamedApproval {
    fn respond(&self, _prompt: &ApprovalPrompt) -> Result<Approval, PermissionError> {
        Ok(Approval::new(self.0.clone()))
    }

    fn route(&self) -> super::audit::ApprovalRoute {
        super::audit::ApprovalRoute::Flag
    }
}

/// The one comparison.
pub(crate) fn check(prompt: &ApprovalPrompt, given: &Approval) -> Result<(), PermissionError> {
    if given.answer().trim() == prompt.confirmation_phrase {
        Ok(())
    } else {
        Err(PermissionError::ApprovalRefused {
            reason: RefusalReason::NotMatched,
            expected: prompt.confirmation_phrase.clone(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn prompt() -> ApprovalPrompt {
        ApprovalPrompt {
            operation: "publish-static-bundle",
            class: 3,
            reversibility: "irreversible",
            source_name: "parcels".into(),
            source_content_hash: "sha256:aa".into(),
            style_hash: "sha256:bb".into(),
            destination_display: "D:/maps/parcels-2026".into(),
            confirmation_phrase: "parcels-2026".into(),
            grantor: "os-user someone".into(),
            grant_remaining_s: 240,
        }
    }

    #[test]
    fn the_exact_phrase_approves_and_surrounding_whitespace_is_tolerated() {
        for ok in ["parcels-2026", "parcels-2026\n", "  parcels-2026\r\n", "\tparcels-2026 "] {
            assert!(check(&prompt(), &Approval::new(ok)).is_ok(), "{ok:?} should approve");
        }
    }

    /// **Every one of these is a refusal**, and the list is the point: a confirmation that accepted
    /// any of them would not be naming the destination.
    #[test]
    fn anything_that_is_not_the_phrase_refuses() {
        for bad in [
            "y", "Y", "yes", "YES", "",
            // Case folding would accept this. It must not.
            "PARCELS-2026",
            // A prefix, a suffix, and the full path — none of them is the phrase.
            "parcels", "parcels-2026-old", "D:/maps/parcels-2026",
            // Interior whitespace is not trimmed; only the edges are.
            "parcels 2026",
        ] {
            assert!(
                matches!(
                    check(&prompt(), &Approval::new(bad)),
                    Err(PermissionError::ApprovalRefused { reason: RefusalReason::NotMatched, .. })
                ),
                "{bad:?} was accepted as an approval"
            );
        }
    }

    /// A refusal names what would have worked, or operators learn to paste from scrollback.
    #[test]
    fn a_refusal_carries_the_expected_phrase() {
        let e = check(&prompt(), &Approval::new("y")).unwrap_err();
        assert!(format!("{e}").contains("parcels-2026"), "{e}");
    }

    /// The flag path and the interactive path reach the same comparison, so there is no second
    /// policy at the command line.
    #[test]
    fn the_flag_source_is_checked_by_the_same_function_as_the_interactive_one() {
        let p = prompt();
        let ok = PreNamedApproval("parcels-2026".into());
        assert!(check(&p, &ok.respond(&p).unwrap()).is_ok());

        let no = PreNamedApproval("yes".into());
        assert!(check(&p, &no.respond(&p).unwrap()).is_err());
    }

    /// The prompt shows every fact the brief requires an operator to see before an irreversible act.
    #[test]
    fn the_prompt_shows_class_reversibility_source_hash_destination_and_style() {
        let r = prompt().render();
        for needed in [
            "publish-static-bundle",
            "3",
            "irreversible",
            "parcels",
            "sha256:aa",
            "sha256:bb",
            "D:/maps/parcels-2026",
            "parcels-2026",
        ] {
            assert!(r.contains(needed), "the prompt omits {needed:?}:\n{r}");
        }
    }
}
