# Pass 4B Privacy and Data Minimisation

Date: 2026-08-08

Reviewed files: `components/forms/contact-form.tsx`, `app/api/leads/route.ts`, `app/admin/(protected)/leads/page.tsx`, `lib/email/lead-notification.ts`, `app/legal/privacy/page.tsx`.

## Verdict

PASS WITH NOTES.

The implementation collects proportionate enquiry data for business response and stores hospitality additions only when the selected service area requires them. Substantive privacy/legal wording remains a legal/content follow-up before Production release.

## Data Collected

| Data                      | Required         | Purpose assessment                                                                                   |
| ------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| Name                      | Yes              | Needed to respond to the enquiry                                                                     |
| Email                     | Yes              | Needed for reply-to and follow-up                                                                    |
| Phone                     | No               | Useful alternate contact; optional and length-limited                                                |
| Company                   | No               | Useful business context; optional and length-limited                                                 |
| Intent                    | Yes              | Routing and qualification                                                                            |
| Service area              | Yes              | Routing and qualification                                                                            |
| Message / requirements    | Yes              | Needed to assess requested work                                                                      |
| Hospitality service type  | Hospitality only | Needed to classify catering/chef/function requests                                                   |
| Event date                | No               | Useful scheduling context; optional                                                                  |
| Event location            | No               | Useful delivery planning; optional and capped to avoid forcing full private address at first contact |
| Estimated guest count     | No               | Useful scoping metric; optional, positive integer and capped                                         |
| IP address and user agent | Automatic        | Operational security and abuse handling                                                              |
| Source path               | Automatic        | Enquiry routing/diagnostics                                                                          |

## Minimisation Findings

- Optional fields stay optional.
- Hospitality-specific fields are submitted by the client only when Hospitality is selected.
- The API discards stale hospitality values for non-hospitality leads.
- Evidence files use only synthetic or public-approved values; no customer data was included.
- SMTP notifications include the saved lead details needed for internal handling, but notification diagnostics do not log enquiry content.
- Admin displays lead data only behind server-side admin protection.

## Privacy Wording Still Required

The public privacy page contains baseline contact-process wording and the approved privacy contact `info@sikhwarigroup.co.za`. Before Production release, legal/content owner should confirm or update:

- responsible party wording
- exact data collected, including hospitality additions, IP address and user agent
- PostgreSQL storage wording
- Zoho/SMTP notification service-provider wording
- retention wording, including the current default retention statement
- rights, contact, escalation and complaint wording

No new retention period was invented in this pass.
