# Production Smoke Validation

Date: 2026-08-08

Base URL: `https://www.sikhwarigroup.co.za`

## Route Smoke

| Route                                                  | Result |
| ------------------------------------------------------ | ------ |
| `/`                                                    | 200    |
| `/about`                                               | 200    |
| `/services`                                            | 200    |
| `/contact`                                             | 200    |
| `/divisions/telecommunications-ict-network-services`   | 200    |
| `/divisions/cybersecurity-services`                    | 200    |
| `/divisions/software-development-and-digital-services` | 200    |
| `/divisions/culinary-and-hospitality-services`         | 200    |
| `/legal/privacy`                                       | 200    |
| `/legal/terms`                                         | 200    |
| `/legal/disclaimer`                                    | 200    |
| `/robots.txt`                                          | 200    |
| `/sitemap.xml`                                         | 200    |

## Content Checks

- Hospitality appears on homepage.
- Two portfolio model appears.
- All four service areas are reachable.
- Selected Work includes Mzansi Select, V-Property and SG Digital Trust Check.
- About includes approved leadership wording: `Group CEO / Managing Director` and `Executive Director: Operations, Hospitality and Corporate Services`.
- Footer includes Hospitality.
- Public email remains `info@sikhwarigroup.co.za`.
- Registered address remains present.
- Exact footer branding remains intact: `Built by SG Digital | A division of Sikhwari Group (Pty) Ltd`.

## Responsive Spot Check

Rendered checks were performed at 390px, 768px and 1280px.

Findings:

- no horizontal overflow detected
- navigation and hero rendered
- credibility facts and portfolio/service sections rendered
- Selected Work rendered
- leadership section rendered
- contact form rendered
- Hospitality conditional fields were visible after selecting Hospitality
- footer rendered and branding remained intact

## Protected Admin

Unauthenticated `/admin/leads` returned a redirect to `/admin/login?next=%2Fadmin%2Fleads` with no-store and security headers.
