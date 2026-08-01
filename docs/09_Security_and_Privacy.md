# 09 — Security and Privacy

## Posture

Local-first. No network access without an explicit grant. Every action by a user, plugin, or AI agent is attributable and logged.

## Capability grants

The original four coarse permissions (read/write/network/filesystem) are replaced by **scoped, expiring grants**:

```text
read dataset A
write temporary datasets
query PostGIS schema X
network only to domain Y
cannot export
cannot publish
expires in 20 minutes
```

Grants attach to any client — plugin, AI agent, notebook — through the one extension surface (01). **Export and publish are distinct capabilities**, never implied by "write." Class-3 side effects (ADR-006) always require approval.

## Threats we design for

- **Prompt injection from data.** Dataset contents, filenames, attribute values, and metadata are untrusted input to the AI. Instructions found inside data are never executed; tool calls derived from data-borne text require approval.
- **Plugin escape.** Plugins run out-of-process, sandboxed, under capability grants (12).
- **Credential leakage.** Credentials live in the OS keychain; secrets are redacted from logs, lineage, notebooks, fix reports, and AI context.
- **Irreversible actions.** Publishing, exports, and remote writes declare their reversibility class (ADR-006) before approval.

## Telemetry and training

> Local action traces improve in-session assistance. Any external collection — for evaluation or training — is explicit, redacted, and opt-in.

User workflows and project data never become training material by default. This supersedes the original "flywheel" framing in 04.

## To be specified

Audit-log retention, per-workspace allowed-domain lists, data licensing and attribution tracking on import and publish.
