# Accessibility Validation

## Passed Checks

Rendered and source-level checks confirmed:

- semantic `header`, `main`, `footer` and `nav` landmarks
- skip-to-main-content link targets `#main-content`
- one H1 on home, about, services, contact and all four division pages
- visible focus utility remains in use
- Contact form fields have visible labels
- validation errors are associated with fields through `aria-describedby`
- error summary appears after touched invalid fields
- success and error states use live status messaging
- hospitality conditional reveal has an `aria-live` announcement
- Selected Work status badges include text labels
- mobile menu button has accessible name and expanded state
- no horizontal overflow at 360px, 390px, 768px or 1280px in automated rendered checks

## Follow-Up Finding

| Finding                | Severity      | Evidence                                                                                                                                          |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal pages have no H1 | Low to medium | `/legal/privacy`, `/legal/terms` and `/legal/disclaimer` rendered `h1Count: 0` because the existing shared `Section` component emits H2 headings. |

This is not a release-blocking repositioning defect, but it should be handled in the next legal/accessibility slice.

## Manual/Tooling Limits

No paid or cloud accessibility service was used. Validation relied on rendered DOM checks, form interaction checks and source inspection.
