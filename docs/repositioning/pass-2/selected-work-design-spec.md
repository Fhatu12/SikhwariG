# Selected Work Design Spec

## Component Model

Create one reusable `SelectedWorkCard` pattern that supports:

- project name
- status badge
- business need
- scope delivered
- technology/service contribution
- approved public link
- approved screenshot or placeholder state
- classification note when internal

## Approved Items

| Item | Status badge | Capability evidence | Classification guidance |
| --- | --- | --- | --- |
| Mzansi Select | Live | Shopify e-commerce implementation, storefront/theme refinement, product and collection structure, payment and launch-readiness support, live operational improvement | Do not imply testimonial, metric or endorsement |
| V-Property | MVP / Demonstrator | Database-backed property platform, property/ownership workflows, operational controls, custom business-system development | Make demonstrator status clear |
| SG Digital Trust Check | Live / Internal Product | Website trust/security assessment tool, HTTPS, metadata, robots/sitemap and security-header checks | Label as internal product; do not imply external client |

## Status Treatment

Badges must not rely on colour alone:

| Status | Text | Visual treatment |
| --- | --- | --- |
| Live | `Live` | Neutral/green-tinted badge with text |
| Internal Product | `Internal Product` | Slate/teal badge with text |
| MVP | `MVP` | Accent badge with text |
| Demonstrator | `Demonstrator` | Accent or slate badge with text |

## Link and Screenshot Rules

- Show a public link only when approved.
- If no link is approved, omit the link rather than using disabled controls.
- Show screenshots only after redaction/approval.
- Screenshot alt text should describe the product screen, not claim results.

## Placement

- Homepage: compact three-card preview after services.
- About: fuller detail with business need and contribution.
- Division pages: show only relevant items, such as SG Digital Trust Check for software/cybersecurity.
