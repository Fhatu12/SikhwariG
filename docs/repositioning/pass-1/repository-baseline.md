# Repository Baseline

## Scope

This is the first repository-based audit pass for the approved Sikhwari Group corporate website repositioning. It is a read-mostly evidence and documentation pass. No website repositioning has been implemented.

Local guidance note: no repository-local `AGENTS.md` or `docs/ai/*.md` files were present during this pass.

## Git State

| Item | Finding |
| --- | --- |
| Repository | `Fhatu12/SikhwariG` |
| Working directory | `/home/fhatu/dev/SikhwariG` |
| Branch | `master` |
| Starting HEAD | `3be0a5b` |
| Expected HEAD | `3be0a5b` |
| Origin alignment | `master...origin/master`, no ahead/behind shown |
| Pre-existing untracked files | `npm-audit.json`, `npm-audit.after.json` |

The npm audit JSON files were left untouched.

## Stack

Repository evidence confirms a Next.js application with React, TypeScript, Prisma, PostgreSQL and Vercel deployment wiring:

| Capability | Evidence |
| --- | --- |
| Next.js app router | `app/*`, `next.config.ts` |
| React and TypeScript | `package.json`, `.tsx` route and component files |
| Prisma and PostgreSQL | `prisma/schema.prisma`, `PRISMA_POSTGRES_DATABASE_URL` datasource |
| Vercel | `vercel.json`, `scripts/devops/vercel-build.mjs` |
| Lead storage | `app/api/leads/route.ts`, `prisma/schema.prisma` |
| Internal lead notification email | `lib/email/lead-notification.ts` |

## Public Routes

| Route | Source |
| --- | --- |
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/services` | `app/services/page.tsx` |
| `/contact` | `app/contact/page.tsx`, `components/forms/contact-form.tsx` |
| `/divisions/telecommunications-ict-network-services` | `app/divisions/[slug]/page.tsx` |
| `/divisions/cybersecurity-services` | `app/divisions/[slug]/page.tsx` |
| `/divisions/culinary-and-hospitality-services` | `app/divisions/[slug]/page.tsx` |
| `/divisions/software-development-and-digital-services` | `app/divisions/[slug]/page.tsx` |
| `/legal/privacy` | `app/legal/privacy/page.tsx` |
| `/legal/terms` | `app/legal/terms/page.tsx` |
| `/legal/disclaimer` | `app/legal/disclaimer/page.tsx` |
| `/sitemap.xml` | `app/sitemap.ts` |
| `/robots.txt` | `app/robots.ts` |

## Admin and API Routes

| Route | Purpose | Protection |
| --- | --- | --- |
| `/admin` | Redirects to admin leads or login | `isAdminAuthenticated` |
| `/admin/login` | Admin login | Redirects authenticated users |
| `/admin/leads` | Lead inbox and details | `requireAdmin` |
| `/admin/services` | Service content editing | `requireAdmin` |
| `/admin/posts` | Post editing | `requireAdmin` |
| `/admin/proof` | Proof item editing | `requireAdmin` |
| `/api/leads` | Public lead capture | Validation, anti-spam, rate limit, database availability |
| `/api/admin/login` | Admin session creation | Credential validation, rate limit |
| `/api/admin/logout` | Admin session clearing | Cookie clearing |
| `/api/admin/services/[id]` | Service content update | `isAdminAuthenticated` |
| `/api/admin/posts/*` | Post create/update/delete | `isAdminAuthenticated` |
| `/api/admin/proof/*` | Proof create/update/delete/list | `isAdminAuthenticated` |

## Navigation, Layout, Footer, Metadata and Crawlers

| Area | Evidence | Current baseline |
| --- | --- | --- |
| Primary navigation | `components/layout/site-header.tsx` | Home, Services, About, Contact; mobile adds Request a quote |
| Footer | `components/layout/site-footer.tsx` | Legal identity block, privacy/terms/disclaimer links, SG Digital credit |
| Legal identity | `components/legal/legal-identity-block.tsx`, `lib/legal-identity.ts` | Legal name, registration number, registered address, single-entity division statement |
| Metadata | `app/layout.tsx`, `lib/seo.ts`, route metadata | Per-route title, description, canonical and Open Graph via `buildMetadata` |
| Sitemap | `app/sitemap.ts` | Public routes listed; admin/API routes excluded |
| Robots | `app/robots.ts` | Allows all crawlers and links sitemap |

## Production-Sensitive Capabilities Not To Regress

- Lead submissions persist to Prisma only when `PRISMA_POSTGRES_DATABASE_URL` is configured.
- Lead submissions capture name, email, optional phone, intent, optional service area, message, IP address, user agent and source path.
- Lead submissions use honeypot, minimum submit time, spam phrase/URL-density checks and per-IP rate limiting.
- Internal notification email is sent after database insert when SMTP configuration is valid.
- Notification logs avoid customer content and secret values.
- Admin login uses configured credentials, HMAC session cookies, `httpOnly`, `sameSite=lax`, production `secure`, redirects and rate limiting.
- Protected admin routes call `requireAdmin`.
- Admin and API admin routes receive no-store cache headers.
- Security headers include CSP, frame, content type, referrer and permissions policies, with HSTS in production.
- Legal identity block and proprietary-trading disclaimer are present.
- Proprietary trading is not exposed as a public service or contact option in current code.
