# Inquiry + Admin E2E Report

- Timestamp: 2026-03-04T08:10:50.587Z
- Base URL: http://localhost:3105
- Admin user: \*\*\*
- Rate limit test enabled: no
- Summary: 11/11 passed, 0 failed

| caseName                                                   | method(UI/API) | expectedStatus | actualStatus | expectedStored | actualStored | leadId | adminVerified | notes/error |
| ---------------------------------------------------------- | -------------- | -------------- | ------------ | -------------- | ------------ | ------ | ------------- | ----------- |
| UI valid enquiry (General enquiry, wait >3s)               | UI             | 200            | 200          | yes            | yes          | 11     | yes           | pass        |
| UI valid quote flow (/contact?intent=quote default intent) | UI             | 200            | 200          | yes            | yes          | 12     | yes           | pass        |
| UI missing name (client-side validation)                   | UI             | no-request     | no-request   | no             | no           | -      | n/a           | pass        |
| UI invalid email (client-side validation)                  | UI             | no-request     | no-request   | no             | no           | -      | n/a           | pass        |
| UI message too long >2000 (client-side validation)         | UI             | no-request     | no-request   | no             | no           | -      | n/a           | pass        |
| UI honeypot filled (200 but not stored)                    | UI             | 200            | 200          | no             | no           | -      | n/a           | pass        |
| UI too-fast submission (formStartedAt now, 200 not stored) | UI             | 200            | 200          | no             | no           | -      | n/a           | pass        |
| UI spam phrase 'forex signal' (400 not stored)             | UI             | 400            | 400          | no             | no           | -      | n/a           | pass        |
| UI URL density >2 URLs (400 not stored)                    | UI             | 400            | 400          | no             | no           | -      | n/a           | pass        |
| API invalid intent (unknown, 400 not stored)               | API            | 400            | 400          | no             | no           | -      | n/a           | pass        |
| API invalid serviceArea (unknown, 400 not stored)          | API            | 400            | 400          | no             | no           | -      | n/a           | pass        |

> Rate limit exceed test skipped. Set `E2E_RUN_RATE_LIMIT=1` to enable.
