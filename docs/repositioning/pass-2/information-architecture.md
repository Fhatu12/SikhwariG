# Information Architecture

## Recommended Public Route Map

Retain existing routes where practical.

| Route | Role | Content hierarchy |
| --- | --- | --- |
| `/` | Corporate entry point | Hero, credibility facts, two portfolios, four service cards, Selected Work preview, leadership/trust cue, quote CTA |
| `/about` | Company and leadership | One legal entity, internal division model, portfolios, leadership, qualifications, delivery principles, proof |
| `/services` | Service overview | Two portfolio groups, four service areas, boundaries, quote CTA |
| `/divisions/telecommunications-ict-network-services` | SG Telecoms detail | Division statement, client problem, capabilities, deliverables, use cases, process, boundaries, CTA |
| `/divisions/cybersecurity-services` | SG Cyber detail | Authorised-engagement note, capabilities, deliverables, use cases, process, boundaries, CTA |
| `/divisions/software-development-and-digital-services` | SG Digital detail | Digital/software capabilities, Selected Work links, process, boundaries, CTA |
| `/divisions/culinary-and-hospitality-services` | SG Hospitality detail | Hospitality services, event/catering use cases, process, hospitality form cue, CTA |
| `/contact` | Contact / Request a Quote | Common enquiry fields, service-area routing, hospitality conditional fields, success/error states |
| Selected Work | Section, not separate route initially | Homepage preview and About detail section using reusable cards |
| `/legal/privacy` | Privacy notice | Responsible party, privacy contact, data categories, storage/SMTP/operator handling, rights |
| `/legal/terms` | Terms | Existing legal route, reviewed wording |
| `/legal/disclaimer` | General disclaimer and proprietary-trading disclaimer | Preserve proprietary-trading disclaimer |
| `/sitemap.xml`, `/robots.txt` | Search/crawler support | Keep public routes only |

## Portfolio and Service Model

Use portfolios as a grouping layer and service areas as selectable commercial offerings:

| Portfolio | Internal divisions | Public service areas |
| --- | --- | --- |
| Technology, Telecommunications and Cybersecurity | SG Telecoms, SG Digital, SG Cyber | Telecommunications, ICT, and Network Services; Cybersecurity Services; Software Development and Digital Services |
| Operations and Hospitality | SG Hospitality | Culinary and Hospitality Services |

This avoids making users choose between a portfolio and a service. Navigation can expose Services and Contact; service cards can show division names as supporting labels.

## Navigation Principle

Primary nav should remain compact: Home, Services, About, Contact. Division links belong inside service cards, footer service links and contextual CTAs, not as top-level desktop nav items.

## Proprietary-Trading Boundary

Do not create a public Proprietary Trading landing page. Keep proprietary-trading language only in `/legal/disclaimer` and internal/admin guardrail documentation.
