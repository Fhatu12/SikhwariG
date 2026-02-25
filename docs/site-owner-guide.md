# Site Owner Guide (Draft)

## Overview

This guide is the working owner reference for Sikhwari Group (Pty) Ltd website operations.
It summarizes where key content lives, what guardrails apply, and how to generate a repeatable screenshot pack.

## Updating legal identity placeholders

- Keep the legal company name as `Sikhwari Group (Pty) Ltd` where legal identity is shown.
- Update registration/contact placeholders only in shared legal identity components so footer, contact, and legal pages stay in sync.
- Avoid adding marketing claims into legal identity blocks.

## Services content guardrails

- The services page must maintain these exact MOI division names:
  - Telecommunications, ICT, and Network Services
  - Cybersecurity Services
  - Proprietary Trading and Market Activities (Internal Capital Allocation)
  - Culinary and Hospitality Services
  - Software Development and Digital Services
- Trading is internal only: keep `Treasury / Internal` context in the heading, keep the trading disclaimer inline in the trading section, and include `Not offered as a public service.`
- Do not add public trading CTA language anywhere (including home, services, contact, or legal pages).
- Cybersecurity language should remain advisory/assessment/support and note legal/client authorization conditions where required.

## Contact form behavior

- Current contact form is UI-only client validation and confirmation state.
- No server-side storage or ticketing is wired yet.
- Planned follow-on: persist submissions with Prisma-backed storage and submission handling.

## SEO basics

- Route metadata is defined per page through existing metadata utilities.
- `app/sitemap.ts` defines sitemap entries.
- `app/robots.ts` controls crawler directives.
- Keep page titles/descriptions aligned with legal and services scope.

## How to run screenshots

1. Install browser runtime:
   - `npm run screenshots:install`
2. Generate screenshot pack:
   - `npm run screenshots`
3. Output is written to:
   - `docs/screenshots/desktop/*.png`
   - `docs/screenshots/mobile/*.png`

## Deployment notes

- Placeholder: document production deployment targets, environment variables, and release checklist here.
