# Services and Division Design Spec

## Shared Page System

Use one reusable service/division page model for all four public areas. Keep current division routes.

| Block | Purpose | Recommended content |
| --- | --- | --- |
| Hero | Identify service and division | Service title, division label, `A division of Sikhwari Group (Pty) Ltd.` |
| Client problem | Explain why users need it | 2-3 concise sentences |
| Service overview | Define the offering | Plain-language summary, no regulated claims |
| Core capabilities | Scannable capabilities | 4-6 bullets |
| Typical deliverables | Concrete outputs | 3-6 bullets |
| Suitable clients/use cases | Help self-selection | 3-5 examples |
| Engagement process | Show disciplined execution | Scope, plan, deliver, handover/support |
| Relevant experience/leadership | Add accountability | Portfolio owner or selected work links where relevant |
| Scope/legal boundaries | Reduce claim risk | Authorisation, no guaranteed outcomes, regulated-service exclusions |
| Request a Quote CTA | Convert | Link to `/contact?intent=quote` with preselected or clear service context later |

## Service-Specific Notes

| Service | Division label | Required boundary treatment |
| --- | --- | --- |
| Telecommunications, ICT, and Network Services | SG Telecoms | Avoid licensed network operator, ISP or spectrum wording |
| Cybersecurity Services | SG Cyber | Prominent authorised-engagement note before capabilities |
| Software Development and Digital Services | SG Digital | Connect to Mzansi Select, V-Property and SG Digital Trust Check where approved |
| Culinary and Hospitality Services | SG Hospitality | Connect CTA to hospitality-specific quote fields |

## Cybersecurity Scope Note

Use a visible, calm note near the top of the page:

`Cybersecurity services are provided only for authorised environments and agreed scopes. Work is advisory, assessment and support in nature unless a written agreement states otherwise.`

Do not style the note as an alarming warning. Use the existing amber or muted card style.

## Services Page Layout

The `/services` page should become the overview of the two portfolios and four service cards:

- short page intro explaining one legal entity and internal divisions
- portfolio grouping labels
- four service cards with division labels and links to division pages
- legal/scope note for regulated claims
- quote CTA

## Reuse

Reuse `Section`, `Container`, card classes, current service seed content and watermarks only if they remain subtle and do not reduce readability. Avoid creating four unrelated page layouts.
