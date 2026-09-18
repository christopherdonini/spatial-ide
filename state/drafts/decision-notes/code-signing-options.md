> **Status: decision-note — code-signing options for the Windows installer, drafted 2026-09-10 for the human's ruling.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Decision note — code-signing options for the Windows installer

*Drafted by the custodian on **2026-09-10**, on the human's instruction ("two decision notes for me,
docs only … applied only on my word, since both are public-facing"). **Nothing in this note is
applied.** No certificate is bought, no Azure resource is created, no `tauri.conf.json` field is
added, no release text changes, until the human says so. This is research and options, not a
change.*

*Every fact below carries the URL it came from and the date it was retrieved. Where a price or a
rule could **not** be confirmed from the vendor's or the standards body's own page, the note says
so in those words rather than estimating. All retrieval dates are **2026-09-10** unless stated.*

*This note makes no claim of the kind docs/08 governs; it concerns distribution and trust, not the
application's runtime.*

---

## 1. The question

v0.1.0 ships an **unsigned**, per-user NSIS installer
(`frontends/shell/src-tauri/target/release/bundle/nsis/Spatial IDE_0.1.0_x64-setup.exe`). A
stranger who downloads it meets a Windows warning before the application ever runs, and the only
integrity signal the project gives them is the SHA-256 recorded on the release page
(`RELEASE-DAY-CHECKLIST.md` §1 and §5).

The question is narrow and it is the human's alone, because it is outward-facing, costs money
recurrently, and binds an identity to the project's binaries:

> **Should Spatial IDE sign its Windows installer, and if so, under which of the two realistic
> options — Azure Artifact Signing (formerly Trusted Signing) or an OV code-signing certificate
> from a commercial CA — given that the publisher is an individual, not a registered company?**

A prior question sits underneath it and is answered up front, because it changes what the decision
is *for*:

> **No option available to this project removes the first-download warning.** Microsoft's own
> documentation says so, for every certificate type (§4). Signing buys a named publisher, a
> reputation that can accumulate across releases instead of resetting each time, and — on Windows
> 11 with Smart App Control — the difference between "warned" and "blocked". It does not buy a
> clean first install.

---

## 2. The options, compared

Read the table with §3 (what each does *not* solve) and §4 (SmartScreen, quoted) beside it.
"Individual" throughout means a natural person, not a registered legal entity.

| | **Azure Artifact Signing** (formerly Trusted Signing) | **OV certificate**, commercial CA | **Certum "Open Source Code Signing"** (an individual-issued variant, listed because it is the one option that names individuals explicitly) | **SignPath Foundation** (listed because Microsoft's own page names it) |
|---|---|---|---|---|
| **Cost per year** | **Basic $9.99 per account per month** (= $119.88/yr) with a 5,000-signature monthly quota; **Premium $99.99 per account per month** (= $1,199.88/yr), 100,000/month; **$0.005 per signature** past quota, both tiers. Requires a **paid** Azure subscription — free, trial and sponsored subscriptions are refused. Billing is **not** pro-rated: the full SKU amount is invoiced regardless of when use begins. [1][4] | Microsoft's own comparison page says **"Typically $150–300/year depending on the CA and certificate tier."** [3] Two CAs' own pages give higher numbers: DigiCert lists **"$44 / month / certificate"** OV and **"$62 / month / certificate"** EV, both **"12 month auto-renewing"** [7]; Sectigo states **"A Sectigo® code signing certificate starts at $536.25 per year when customers choose the five-year option."** [8] Reseller listings around $210–230/yr are widely quoted but are **not** primary sources and are not relied on here. SSL.com's own code-signing page **did not display prices** on 2026-09-10. [9] | Certum's store lists the activation-code product **"Open Source Code Signing - code"** at **$29.00** (shown gross = net), and showed it **out of stock** on 2026-09-10. [10] The **first-purchase "set"** (cryptographic card + reader) has a price the custodian **could not confirm from a Certum page** — the store URL tried returned 404. Secondary write-ups give €69–€85 plus shipping; **treat as unconfirmed.** | **Free.** Microsoft: *"SignPath Foundation offers free code signing for qualifying open-source projects. The program provides OV-level certificate signing through a managed pipeline."* [3] SignPath: *"For OSS projects, our services are free of charge."* [11] |
| **What an INDIVIDUAL can obtain** | A Public Trust certificate **only if located in the United States or Canada.** *"Individual developers must be located in the United States or Canada."* [2] / *"Individual developers are currently limited to the USA and Canada."* [3] Outside those two countries an individual **cannot** onboard; Microsoft's page routes them to OV: *"If you are an individual developer outside those regions, see OV certificates below."* [3] | **Depends on the CA and is not uniformly answerable.** SSL.com's own comparison marks OV as *"For organizations"* with *"Business entity required: Yes."* [9] Sectigo's validation text speaks of *"The legal existence of the organization or individual named in the Organization field,"* which admits an individual. [8] DigiCert's page **does not state** whether individuals are eligible. [7] The custodian **could not confirm a published individual price from any of these three CAs' own pages** — this needs a direct question to the CA (open question 4). | **Yes, explicitly.** The certificate carries *"natural person data prefixed with 'Open Source Developer' phrase."* [10] It is restricted: the product is for a developer who shares software *"as free to use"* or *"an open source project."* [10] | Not an identity purchase at all. SignPath *"verifies that the binary was built from your open source repository and vouch[es] for that with our name."* [11] Eligibility criteria (which licences qualify, whether AGPL does, project maturity) **could not be retrieved** from `signpath.org/apply` on 2026-09-10 — the page returned only navigation and cookie text. **Unconfirmed.** |
| **Identity requirements — what must be proved** | Microsoft runs the validation, and for an individual it is **sourced from the Azure billing account**: *"details are automatically sourced from your Azure billing account … The billing account type must match the identity validation type: a billing account with an Account Type of 'Individual' can only be used for individual identity validation."* [2] The person then completes **Microsoft Entra Verified ID** through a third-party verifier (AU10TIX): a **government-issued photo ID** (*"passports, driving licenses, or ID cards"*; *"Don't submit privately issued IDs"*), a **face check**, and an **address** — either an address-bearing government ID or a utility bill / bank statement (*"should be recent, typically within the last three months"*). [2] Names must match the ID **exactly**. Processing for public identity validation takes **"from 1 to 20 business days."** [2] | The CA validates the legal identity named in the certificate. Sectigo: *"The legal existence of the organization or individual named in the Organization field"* must be verified [8]; Microsoft summarises OV as *"The CA validates your organization's legal identity before issuing the certificate; allow several business days."* [3] Per-CA document lists were **not** confirmed from primary pages. | Certum: *"The verification process and documents required to issue a certificate are described in the instructions at: https://support.certum.eu/en/code-signing-required-documents/"* [10] — the custodian did not fetch that page; **contents unconfirmed.** | Not stated on the pages retrieved. **Unconfirmed.** |
| **What lands on the certificate** | Individual: legal name plus **city, state/province and country** — *"The city, state/province, and country/region from the address entered here's displayed on the certificate"*; *"Your email address and street address aren't included in the certificate."* [2] **No customisation:** *"you can't use a custom Common Name (CN) or a custom Organization (O)."* [4] | The validated legal name of the subject (organisation or individual). | The natural person's data, prefixed *"Open Source Developer"*. [10] | SignPath's own name vouches for the build; not confirmed further. |
| **Hardware / HSM** | **None for the subscriber.** Keys are generated and used *"in FIPS 140-3 Level 3 hardware crypto modules that the service manages"*, and *"Artifact Signing does not support importing or exporting private keys and certificates."* [5] Microsoft: *"No hardware token required."* [3] | **Required by the standard, not by the CA's choice.** CA/Browser Forum Code Signing Baseline Requirements: *"Effective June 1, 2023, for Code Signing Certificates, CAs SHALL ensure that the Subscriber's Private Key is generated, stored, and used in a suitable Hardware Crypto Module."* Current version **3.11.0, effective June 16, 2026.** [6] In practice: a CA-shipped USB token, your own HSM, or the CA's cloud-signing service (DigiCert lists *"KeyLocker Cloud"*, *"DigiCert-Provided Hardware Token"*, *"My Own Qualified Hardware Token"*, *"Hardware Security Module (HSM)"* [7]; SSL.com lists *"eSigner for Code … Cloud HSM signing for CI/CD pipelines … No hardware token required"* [9]). | **A physical card and reader**: *cryptoCertum* card (3.6 or 3.7), a card reader, drivers, and the *proCertum CardManager* application. [10] A physical object that must be present at every signing and can be lost. | HSM held by SignPath: *"our Hardware Security Module (HSM)"*, no USB token. [11] |
| **Certificate validity / rotation** | **72 hours, renewed daily.** *"Artifact Signing certificates are renewed daily and are valid for only 72 hours."* [5] Consequence: an **RFC 3161 timestamp countersignature is not optional** — *"Because Artifact Signing uses short-lived certificates, time stamp countersigning is critical for a signature to be valid beyond the life of the signing certificate."* Microsoft's TSA is `http://timestamp.acs.microsoft.com`. [5] Thumbprint pinning is useless: *"pinning trust or validation to an end-entity certificate that uses certificate attributes … or a certificate's thumbprint … isn't durable"* — a per-subscriber EKU under `1.3.6.1.4.1.311.97.` is the durable handle instead. [5] **The identity validation itself expires** and must be renewed; reminders start 60 days out, and if it lapses *"certificate renewal stops … All signing processes … stops."* [4] | Sectigo's page states that as of **23 February 2026** *"all Certificate Authorities [must] issue certificates no longer than 459 days (approximately 15 months),"* with multi-year purchases reissuing annually rather than one long certificate. [8] Timestamping is likewise the mechanism that keeps old signatures valid past expiry. | Annual, per the product's framing; the exact term was **not confirmed** from Certum's own page. | Not confirmed. |
| **SmartScreen behaviour** | See §4 — quoted, not paraphrased. Short form: **no instant trust.** | Same. | Certum's page claims *"Microsoft SmartScreen Filter"* compatibility [10]; that is a vendor statement about trust-store chaining, **not** a reputation claim, and Microsoft's statements in §4 govern. | *"OV-level certificate signing"* per Microsoft [3] — therefore §4's OV row. |
| **Tauri integration** | `bundle.windows.signCommand`, which Tauri's config reference describes as *"A string notation of the script to execute. \"%1\" will be replaced with the path to the binary to be signed."* [12] Tauri's Windows signing page documents Azure Artifact Signing under exactly this field, in the shape `"signCommand": "<signing-cli> -e <endpoint> -a <account> -c <profile> -d <description> %1"`. [13] Today `tauri.conf.json` sets **none** of these fields (`frontends/shell/src-tauri/tauri.conf.json` — `bundle.windows` holds only `nsis.installMode`). | Either the classic triple `certificateThumbprint` + `digestAlgorithm` + `timestampUrl` (a certificate present in the local store, i.e. a token plugged in) or `signCommand` for a cloud-signing CLI. [12][13] | The classic triple, with the card in the reader at build time. | `signCommand` or SignPath's own pipeline; not confirmed. |
| **Revocation / suspension** | Microsoft may act unilaterally: *"If a certificate is misused or abused per the service Terms of Use, Artifact Signing suspends the account or revokes a signing certificate or both."* [4] Because certificates are daily, *"revocation actions can be isolated to revoking only the certificate that signed the malware or PUA … The revocation doesn't apply to any code that was signed before that day or after that day."* [5] The subscriber can also revoke, in the portal. [5] | Standard CA revocation, at the CA's discretion under the same CA/B Forum rules. Loss of the token is the subscriber's own operational problem. | As Certum's CA policy provides; **not confirmed.** | Not confirmed. |
| **Lock-in / exit** | An Azure subscription, a Microsoft Entra tenant, and a Microsoft-held key you can never hold: *"The Authenticode certificate that's used for signing with the profile is never given to you."* [4] Resources **cannot** be moved: *"Artifact Signing resources can't be migrated across subscriptions or tenants or resource groups … you must create all your Artifact Signing resources again."* [4] Leaving means changing publisher identity, which resets accumulated publisher reputation (§4). **No EV path:** *"Artifact Signing doesn't issue Extended Validation (EV) certificates. There's no plan to issue EV certificates in the future."* [4] | Portable in the ordinary sense — you can change CA — but changing the *subject identity* still resets publisher reputation, and the physical token ties you to the CA that issued it for that certificate's life. | The card is Certum's; the licence to the certificate is restricted to non-commercial/open-source distribution. [10] | A third party vouches for the project's builds; the project does not own the identity. |

---

## 3. What each option does **not** solve

- **None of them makes the first download clean.** §4 quotes Microsoft on this for every row of the
  table. A newly signed `Spatial IDE_0.1.1_x64-setup.exe` still shows a warning to its first
  downloaders.
- **None of them replaces the SHA-256.** The hash on the release page is what lets a stranger
  confirm the bytes they got are the bytes the project built (`RELEASE-DAY-CHECKLIST.md` §1, §5). A
  signature adds a *publisher* signal; it does not add a *these-exact-bytes* signal that the
  project's own record vouches for. Both stay.
- **None of them says anything about what the application does.** Signing is not a security review
  of `csp: null` (docs/09, "Local listening sockets"), of the loopback data plane, or of ADR-020's
  consequence. The KNOWN-LIMITATIONS entries that name those stay exactly as they are.
- **Signing changes the installer's bytes, and therefore its SHA-256.** Any option adopted before a
  tag re-opens `RELEASE-DAY-CHECKLIST.md` §1 in full: the recorded hash is void, and *"do not attach
  a build nobody ran"* means Part M's rows against the installer are re-run on the signed artifact.
  This is the single largest process consequence and it is a scheduling fact, not an opinion.
- **Signing introduces a new credential class.** Artifact Signing needs an Azure identity that can
  sign (a service principal secret or a managed identity, per Microsoft's own troubleshooting
  guidance [4]); an OV token needs custody of a physical device and its PIN. docs/09 says
  *"Credentials live in the OS keychain; secrets are redacted from logs …"* — a signing credential
  in a build environment is a case that sentence has not yet been applied to.
- **Artifact Signing does not solve the individual-outside-US/Canada case at all.** It is not a
  price question there; it is an eligibility refusal (§2, row 2).
- **Certum's option does not survive an open-core boundary.** Its licence is for software shared as
  free/open source [10]. ADR-009's accepted boundary permits proprietary layers later; if one ever
  ships, an "Open Source Developer" certificate is the wrong instrument for it.
- **Microsoft Store (MSIX) is the only route Microsoft describes as warning-free** — *"Store-distributed
  apps are signed by a Microsoft certificate and are never subject to SmartScreen download
  warnings"* [14] — and it is out of scope here: it is a different distribution decision, a
  different package format, and it is not what "download the installer from the release" means.

---

## 4. SmartScreen — what a user actually sees, quoted

The task asked for the exact Microsoft statements rather than an assumption. These are them.

**The mechanism** — from *SmartScreen reputation for Windows app developers*
(`https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation`,
`ms.date` 2026-05-04, page metadata `updated_at` 2026-08-17, retrieved 2026-09-10) [14]:

> "SmartScreen evaluates two signals when a user downloads and runs a file:
> 1. **Publisher reputation** — Is the file signed? Is the signing certificate from a known, trusted publisher?
> 2. **File hash reputation** — Has this specific file been downloaded by users without indications of malicious behavior?"

> "Even when signed, a newly created binary could still show a SmartScreen warning until its hash or
> publisher certificate accumulates sufficient evidence of positive reputation."

> "When a file is not signed, SmartScreen reputation must build for each new version of your files,
> starting with zero reputation. Reputation cannot transfer from previous versions unless both were
> signed using the same publisher identity."

**Per certificate type** — the same page's table, verbatim [14]:

| Certificate type | First-download SmartScreen behavior |
| --- | --- |
| Microsoft Store | "✅ No warning — covered by Microsoft's certificate" |
| Valid Certificate (OV/EV) | "⚠️ Warning — app flagged as unrecognized until reputation accumulates; verified publisher name is displayed" |
| No signature | "⚠️ Warning — 'Windows protected your PC'; User must choose 'Run anyway' before the app can run. Enterprise policy can prevent continuation entirely." |
| Self-signed Certificate | "⚠️ Warning — Same behavior as no signature" |

**EV specifically** — the assumption this note was asked to test, and it is false [14]:

> "**EV certificates no longer bypass SmartScreen.** Years ago, signing files with an Extended
> Validation (EV) code signing certificate would result in positive SmartScreen reputation by
> default, but this behavior no longer exists. EV certificates may matter for enterprise
> procurement, but they no longer impact SmartScreen behavior. Paying a premium for EV solely to
> avoid SmartScreen warnings is no longer justified."

The comparison page dates the change: *"That behavior was removed in 2024."* [3]

**Does an Artifact Signing certificate carry immediate SmartScreen reputation? No — stated in
Microsoft's own words** [3]:

> "**SmartScreen behavior:** New files can show a SmartScreen warning until they accumulate
> sufficient reputation. Azure Artifact Signing does **not** provide instant SmartScreen trust, but
> signing consecutive releases with a consistent publisher/signing identity lets publisher
> reputation build over time, so later releases can inherit trust."

And in the Artifact Signing FAQ [4]:

> "SmartScreen reputation builds up automatically. The prompt stops appearing once the file hash has
> sufficient download history."

**How long, and can it be short-circuited?** [14]:

> "There is no exact threshold, but it can take several weeks and hundreds of clean installs from a
> wide audience."

> "There is no need (or mechanism) to manually submit a file for SmartScreen reputation review for
> consumer endpoints. Reputation builds organically through download volume."

**The one place signed and unsigned genuinely diverge for this project's audience** [14]:

> "On Windows 11 devices, the Smart App Control feature may supersede SmartScreen Application
> Reputation. Smart App Control will block execution of unsigned files unless the file has a
> positive reputation. Smart App Control signature checks apply to all executable files, not just
> those downloaded from the Internet."

**Read together:** unsigned → warning, plus a Windows 11 Smart App Control block risk, plus
reputation restarting at zero on every release. Signed (any type available to this project) →
warning, publisher name shown, reputation that can carry across releases if the identity stays the
same, and no Smart App Control block for signature-absence. Nobody gets a clean first install
outside the Store.

---

## 5. The constitution's touchpoints

- **`docs/09_Security_and_Privacy.md` — silent on this.** Its posture is runtime: local-first,
  capability grants, threats designed for, local listening sockets, predicate admission, telemetry.
  Artifact/supply-chain signing appears nowhere, including in its "To be specified" list (audit-log
  retention, allowed-domain lists, data licensing). **Reading:** signing is *not* covered by an
  existing docs/09 sentence, so adopting it is an addition to be written, not a gap already
  provided for. Its closest existing line is *"Credentials live in the OS keychain; secrets are
  redacted from logs, lineage, notebooks, fix reports, and AI context"* — which a signing credential
  in a build environment would have to be brought under explicitly.
- **`RELEASE-DAY-CHECKLIST.md` §1** — *"Its SHA-256 is recorded in `RELEASE-0.1.md` … and matches"*
  and *"The installer is the one Part M installed — same SHA-256 (if Part M ran on an earlier build,
  rebuild, re-hash, and re-run the rows the diff touches; do not attach a build nobody ran)."* §5
  puts the SHA-256 and the limits link in the release body's first three lines. **Signing after Part
  M is forbidden by the checklist's own "Never on release day" rule**; signing before Part M means
  the signed installer is the one walked.
- **The release-day checklist has no signing step at all**, because v0.1.0 has nothing to sign with.
  Adopting an option adds one — between the build and Part M, never after.
- **`README.md`:35-36** (a draft, bracketed for Part M): *"The installer is unsigned in v0.1.0;
  Windows will say so."*
- **`QUICKSTART.md`:10-14** (a draft, bracketed for Part M): *"Windows will tell you the installer
  is unsigned — that is true in v0.1.0 (`KNOWN-LIMITATIONS.md`, entry 14)."*
- **KNOWN-LIMITATIONS entry 14** — **the file does not exist in the tree yet.** `KNOWN-LIMITATIONS.md`
  is release-cut item 4 and is written **last**, from Part M's record (`RELEASE-0.1.md` Amendment 13;
  `RELEASE-DAY-CHECKLIST.md` §0). Entry 14 is the unsigned-installer entry, referenced by number
  from both drafts above; its final wording is not yet fixed. **Consequence for this note:** entry 14
  is the natural home for whatever the human decides about v0.1.0, and it can be written to say
  either "unsigned, and here is why" or "unsigned in v0.1.0; signing is decided and lands in
  v0.1.x". It should not promise a date.
- **`AI_DEVELOPMENT.md` red lines** — buying a certificate, creating an Azure resource, or changing
  what the release page tells a stranger are all outward-facing and irreversible-ish; they wait for
  the human. This note is the queue entry, not the action.
- **ADR-009 (licence / open-core boundary, accepted 2026-08-07)** — bears on the Certum row only,
  and only if a proprietary layer ever ships.
- **`PUBLIC-AUDIENCE-AUDIT.md` F-17** — the project already reasoned about the human's identity being
  public in commit metadata (DECISIONS-PENDING entry 14, resolved 2026-09-07: *"both identities have
  been public commit authors for over a month; acknowledged"*). Individual identity validation is a
  different act: it puts a **verified legal name plus city, state/province and country** into a
  certificate embedded in every distributed binary. That is a fresh privacy decision, not one the
  earlier acknowledgement covers.

---

## 6. Open questions for the human

1. **Individual, or a registered legal entity?** Everything in §2 forks here. If a Swiss legal
   entity exists or is planned, Artifact Signing's organisation path may be open (but see 2); if the
   publisher stays a natural person, the eligibility list is much shorter.
2. **Which country?** Artifact Signing's individual path is **US/Canada only**, stated identically on
   two Microsoft pages [2][3]. **The two pages disagree about the *organisation* list**: the
   Quickstart names *"the United States, Canada, the European Union, the United Kingdom, Australia,
   New Zealand, Japan, South Korea, Singapore, Switzerland, Norway, and Israel"* [2], while the
   Windows comparison page names only *"USA, Canada, the European Union, and the United Kingdom"*
   [3]. **Switzerland appears in one and not the other.** The custodian is not resolving that from
   secondary sources; if Switzerland matters, it is a question to Azure support before any money
   moves. *(Separately: a 2025 preview-era pause on individual onboarding is reported in secondary
   coverage. **It does not appear on either current Microsoft page**, both of which describe
   individual availability in the present tense. Unconfirmed either way; verify at signup.)*
3. **Is a verified legal name on every binary acceptable?** See §5's last bullet. Yes/no changes
   which options are even on the table.
4. **Do you want the custodian to ask two or three CAs directly** whether they issue OV (or IV) code
   signing to an individual in your country, and at what published price? Three CAs' own pages
   (§2) did not answer this, and the custodian will not fill the gap with reseller pricing.
5. **Recurring cost and a paid Azure subscription** — Artifact Signing needs one and is not
   pro-rated [4]. Is a standing ~$120/yr plus an Azure account acceptable, versus a one-off token
   purchase?
6. **The release-day consequence** (§3, bullet 4): adopting signing before the v0.1.0 tag voids the
   recorded candidate build's SHA-256 (`998be05`, `712b3063…`) and re-runs the Part M rows that touch
   the installer. Is signing a v0.1.0 item at all, or v0.1.1 / v0.2?
7. **SignPath Foundation** — free, OV-level, Microsoft names it [3], AGPL-eligibility **unconfirmed**.
   Should the custodian research its criteria properly, or is a third party vouching for the
   project's builds unattractive on its own terms?
8. **Certum's open-source restriction versus ADR-009.** Acceptable now and revisited later, or
   disqualifying?
9. **Credential custody.** Who holds the Azure signing identity or the physical card, where does the
   secret live, and what is the plan on loss or rotation? This is the sentence docs/09 would gain.
10. **Where does the answer live** — an ADR (a decision with consequences, appended not rewritten),
    or a docs/09 section, or only KNOWN-LIMITATIONS entry 14 for now?
11. **If signing is adopted, does the project commit to a stable publisher identity across
    releases?** Microsoft's reputation model rewards exactly that and penalises changing it [14];
    switching options later throws away whatever has accumulated.

---

## 7. Recommendation

**Recommendation (custodian, one line, for the human's word — not applied):** *Sign nothing for
v0.1.0 — keep the unsigned installer, the recorded SHA-256, and KNOWN-LIMITATIONS entry 14 exactly
as the drafts have them, because no option removes the first-download warning (§4) and adopting one
now would void the candidate build's hash and re-run Part M (§3); then, after the tag, decide
between **Azure Artifact Signing** if the publisher is (or becomes) eligible under §2's residency
rule, and an **OV certificate** otherwise, with open questions 1–4 answered first.*

---

## Sources

Every entry retrieved **2026-09-10**. Microsoft Learn `ms.date` / `updated_at` are the page's own
metadata as served on that date.

1. Microsoft Learn — *Change the account SKU* (Artifact Signing pricing tiers).
   `https://learn.microsoft.com/en-us/azure/artifact-signing/how-to-change-sku`
   — `ms.date` 2026-01-06, `updated_at` 2026-08-03. Canonical URL redirects from the older
   `/azure/trusted-signing/` path.
2. Microsoft Learn — *Quickstart: Set up Artifact Signing* (prerequisites, geography, individual and
   organisation identity validation, supported regions).
   `https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart`
   — `ms.date` 2026-05-21, `updated_at` 2026-08-11.
3. Microsoft Learn — *Code signing options for Windows app developers* (the comparison table, OV/EV
   price ranges, the geographic limitation, the "no instant SmartScreen trust" statement, SignPath).
   `https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options`
   — `ms.date` 2026-08-29, `updated_at` 2026-08-29.
4. Microsoft Learn — *Artifact Signing FAQ* (paid-subscription requirement, no pro-rating, no custom
   CN/O, no EV, SmartScreen answer, suspension/revocation, non-migratable resources, identity
   validation expiry).
   `https://learn.microsoft.com/en-us/azure/artifact-signing/faq`
   — `ms.date` 2026-05-14, `updated_at` 2026-08-14.
5. Microsoft Learn — *Artifact Signing certificate management* (72-hour certificates, daily renewal,
   timestamp countersignature, durable-identity EKU, FIPS 140-3 Level 3, no key import/export,
   revocation).
   `https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management`
   — `ms.date` 2026-01-06, `updated_at` 2026-08-06.
6. CA/Browser Forum — *Latest Code Signing Baseline Requirements*.
   `https://cabforum.org/working-groups/code-signing/requirements/`
   — current version **3.11.0**, effective **2026-06-16**; the hardware-crypto-module clause is dated
   *"Effective June 1, 2023"* in the document text.
7. DigiCert — *Code Signing Certificates*.
   `https://www.digicert.com/signing/code-signing-certificates`
   — "$44 / month / certificate" (OV) and "$62 / month / certificate" (EV), "12 month auto-renewing";
   four key-storage options listed. Individual eligibility **not stated on the page**.
8. Sectigo — *Code Signing Certificates*.
   `https://www.sectigo.com/ssl-certificates-tls/code-signing`
   — "starts at $536.25 per year when customers choose the five-year option"; the 459-day maximum
   validity as of 2026-02-23; *"organization or individual named in the Organization field"*.
9. SSL.com — *Code Signing Certificates*.
   `https://www.ssl.com/certificates/code-signing/`
   — **no prices displayed** on the retrieval date; OV marked *"For organizations"* / *"Business
   entity required: Yes"*; eSigner cloud HSM described.
10. Certum Store — *Open Source Code Signing - code*.
    `https://certum.store/open-source-code-signing-code.html`
    — $29.00 (gross = net), shown **out of stock**; cryptoCertum 3.6/3.7 card + reader + drivers +
    proCertum CardManager required; subject prefixed *"Open Source Developer"*; required-documents
    page linked but **not retrieved**. The card+reader **set** price could **not** be confirmed —
    `https://certum.store/open-source-code-signing-set.html` returned **404** on 2026-09-10.
11. SignPath Foundation. `https://signpath.org/` — *"For OSS projects, our services are free of
    charge"*; HSM-held keys; verification is of the build, not of a person. Eligibility criteria at
    `https://signpath.org/apply` **could not be retrieved** on 2026-09-10 (navigation and cookie
    text only).
12. Tauri — *Configuration reference*, `bundle.windows` (`certificateThumbprint`, `digestAlgorithm`,
    `timestampUrl`, `signCommand`, `tsp`, `webviewInstallMode`).
    `https://v2.tauri.app/reference/config/`
13. Tauri — *Windows Code Signing*.
    `https://v2.tauri.app/distribute/sign/windows/`
    — the `signCommand` shape for Azure Artifact Signing (formerly Azure Trusted Signing).
14. Microsoft Learn — *SmartScreen reputation for Windows app developers* (the two signals, the
    certificate-type table, the EV note, reputation timescale, Smart App Control).
    `https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation`
    — `ms.date` 2026-05-04, `updated_at` 2026-08-17.

**In-repository sources** (read 2026-09-10, at `main` = `279b43f`): `RELEASE-DAY-CHECKLIST.md`;
`docs/09_Security_and_Privacy.md`; `README.md`; `QUICKSTART.md`;
`frontends/shell/src-tauri/tauri.conf.json`; `RELEASE-0.1.md`; `PUBLIC-AUDIENCE-AUDIT.md`.

**Naming note, recorded because it will confuse a later reader:** Microsoft renamed **Trusted
Signing** to **Azure Artifact Signing** during 2026. `learn.microsoft.com/en-us/azure/trusted-signing/`
still resolves and Microsoft's own pages still link it, but every canonical URL and every CLI verb
now reads `artifact-signing` (`az artifact-signing …`). The Azure resource provider is still
`Microsoft.CodeSigning`. Both names appear in this note where a source used them.


---

## Ruled 2026-09-11 (DECISIONS-PENDING entry 77, the human verbatim)

> *"77: sign nothing for v0.1.0; post-tag evaluate SignPath OSS first, Certum second."*

Nothing is applied for v0.1.0: no certificate, no Azure resource, no `tauri.conf.json` change, the recorded candidate hash stands. The post-tag evaluation is a queued task in this order: SignPath OSS first (its eligibility, identity and what it shows), Certum's open-source certificate second. Open questions 1–4 above are answered as part of that evaluation, not before the tag.
