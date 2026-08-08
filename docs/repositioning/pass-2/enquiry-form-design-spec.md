# Enquiry Form Design Spec

## Base Service Options

Use these public options only:

- Telecommunications, ICT, and Network Services
- Cybersecurity Services
- Software Development and Digital Services
- Culinary and Hospitality Services
- General business enquiry
- Not sure

Proprietary Trading and Treasury must never appear.

## Common Fields

Existing common fields remain:

- name
- email
- phone
- company
- service area
- message / requirements

Recommended required fields: name, email, service area and message/requirements. Phone and company should remain optional unless business policy changes.

## Hospitality Conditional Fields

When `Culinary and Hospitality Services` is selected, reveal:

| Field | Type | Required recommendation | Notes |
| --- | --- | --- | --- |
| Service type | Select | Required | Catering, Chef Services, Corporate Function, Private Function, Other |
| Event date | Date input | Optional initially | Required only if operations confirms |
| Event location | Text | Optional initially | Avoid forcing private address before scoping |
| Estimated guest count | Number input | Optional initially | Validate as positive integer when supplied |
| Requirements/message | Textarea | Required | Reuse existing message field label as requirements |

## Behaviour

- Reveal fields immediately after Hospitality is selected.
- Hide fields when switching away, but preserve entered values in client state during the session.
- If the user switches away after filling hospitality fields, show a small non-blocking note: `Hospitality details are saved in this form but will not be submitted unless Hospitality is selected.`
- Do not submit hidden hospitality fields until backend support is implemented.
- Maintain current loading, success and error states.
- Keep the current success wording general unless service-specific confirmation is implemented.

## Validation and Backend Implications

This pass does not change backend contracts. Engineering must later update:

- client validation
- `/api/leads` allowed service labels
- Prisma model or message serialisation for hospitality fields
- admin lead detail display
- SMTP notification message
- privacy wording
- tests and E2E report expectations

## Accessibility

- Every field needs a visible label.
- Conditional reveal should be announced with an `aria-live` region.
- Error messages must be associated with fields through `aria-describedby`.
- Focus should remain on the service selector after reveal, not jump unexpectedly.
- Keyboard users must be able to tab naturally into newly revealed fields.
- Mobile layout should be one column with full-width controls.
