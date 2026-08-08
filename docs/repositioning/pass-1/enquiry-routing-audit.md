# Enquiry and Service-Routing Audit

## Current Public Form Options

`components/forms/contact-form.tsx` defines the current selectors.

| Selector | Current options |
| --- | --- |
| Reason | Request a quote; Book consultation; General enquiry |
| Service area | Not sure; Telecommunications, ICT, and Network Services; Cybersecurity Services; Culinary and Hospitality Services; Software Development and Digital Services |

`/contact?intent=quote` preselects `Request a quote`. Other contact visits default to `General enquiry`.

## Required Future Options

| Required option | Current status |
| --- | --- |
| Telecommunications, ICT, and Network Services | Present |
| Cybersecurity Services | Present |
| Software Development and Digital Services | Present |
| Culinary and Hospitality Services | Present |
| General business enquiry | Missing as exact wording |
| Not sure | Present in service-area selector, not reason selector |

## Proprietary Trading and Treasury Check

Proprietary Trading and Treasury is absent from the public contact form service-area options and from server-side allowed service areas. This matches the hard boundary.

## Backend Validation Dependencies

`app/api/leads/route.ts` validates:

- allowed intents: Request a quote, Book consultation, General enquiry
- allowed service areas: the four approved public service areas
- maximum service-area length
- required name, email, intent and message
- optional phone format
- honeypot and minimum submit time
- spam phrase and URL-density checks
- per-IP rate limit

Any Pass 2 wording change to form options must update both client-side options and API validation constants.

## Database-Field Implications

`prisma/schema.prisma` stores `intent` as a string and `serviceArea` as an optional string. No enum migration is required for label changes, but existing lead records may contain old labels. Reporting, admin filtering or future analytics should handle historical values.

## Notification-Content Implications

`lib/email/lead-notification.ts` includes intent and service area in internal notification text and HTML. Wording changes will flow into notification content automatically once form/API labels are updated.

## Regression Risks

- Updating only the client selector will cause API rejections.
- Updating only the API will leave the public form misaligned.
- Renaming `General enquiry` to `General business enquiry` may affect existing tests and admin expectations.
- Adding hospitality-specific fields would require database, notification, privacy and admin-display review.
- Introducing any proprietary-trading option would breach the approved handoff.
