# Public and Private Information Classification

Sensitive values are not reproduced in this audit output.

| Information type | Current exposure or reference | Classification | Finding | Recommended action |
| --- | --- | --- | --- | --- |
| Legal company name | Public footer, contact, legal and metadata | Approved public company information | Appropriate for public corporate site | Preserve |
| Company registration number | Public legal identity block | Public only with approval | Visible through shared legal identity source | Confirm source record and display approval |
| Registered address | Public footer and contact | Public only with approval | Full address is visible on site | Decide whether to keep public, abbreviate or move to legal-only context |
| Company email address | Public contact page | Approved public company information | Uses shared contact details | Preserve or update to approved privacy/contact address |
| Website domain | Public contact and metadata | Approved public company information | Visible | Preserve |
| Personal phone numbers | Optional lead field only | Confidential when submitted | No public personal phone number found; admin displays submitted lead phones | Keep protected; do not expose in docs |
| Personal email addresses | Lead email field; one public LinkedIn URL | Confidential when submitted; public only with approval for profiles | Admin displays lead emails; Fhatuwani LinkedIn URL is public | Keep lead data protected; confirm profile-link approval |
| Residential information | Registered address may be residential | Public only with approval or internal | Exact nature not determined from repo | Director decision required |
| Identity numbers | Not found | Prohibited from public release | No ID numbers found in repo search | Do not publish |
| Certificates | Admin proof can link to proof URLs | Public only with approval | No certificate files found as public source documents | Publish only approved, non-sensitive proof |
| Reference contacts | Not found | Confidential | No reference contacts found | Do not publish without consent |
| CSD identifiers | Not found as public company identifiers | Internal or public only with approval | No company CSD value found | Do not publish without approval/legal review |
| Tax identifiers | Not found | Confidential | No tax identifiers found | Do not publish |
| Private admin information | Admin routes and env variable names | Internal | Admin pages expose lead PII after login | Preserve protection and no-store |
| Secrets and environment references | `.env.example`, scripts, config files | Internal | Env variable names and placeholders exist; no production secret values copied here | Keep values out of docs and logs |
| Lead records | Database only, displayed in admin | Confidential | Includes name, email, phone, message, IP address, user agent and source path | Keep protected; privacy wording should mention database and notification handling |
| IP addresses and user agents | Captured by lead API, visible in admin | Confidential/personal information | Operational and security data | Keep protected and disclose appropriately in privacy notice |
