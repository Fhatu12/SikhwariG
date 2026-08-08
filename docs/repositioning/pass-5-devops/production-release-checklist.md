# Pass 5A Production Release Checklist

Date: 2026-08-08

## Status

NOT READY.

Preview/Staging validation is blocked because Preview database isolation failed.

## Pre-Release

| Item                                             | Status        |
| ------------------------------------------------ | ------------- |
| Engineering PASS                                 | Complete      |
| QA PASS WITH NOTES                               | Complete      |
| Security PASS WITH NOTES                         | Complete      |
| Preview DB isolation                             | Failed        |
| Preview migration PASS                           | Blocked       |
| Preview build/deployment PASS                    | Blocked       |
| Preview route smoke PASS                         | Blocked       |
| Preview DB-backed Hospitality enquiry PASS       | Blocked       |
| Rollback plan confirmed                          | Drafted       |
| Production env presence confirmed without values | Complete      |
| Product Owner approval                           | Not requested |

## Release

Do not execute during Pass 5A.

Required later sequence:

- Product Owner approval
- Production deployment
- migration observation
- deployment READY confirmation
- aliases healthy

## Post-Release

Do not execute during Pass 5A.

Required later checks if Production release is approved:

- core route smoke
- exactly one synthetic Production Hospitality enquiry only if approved
- DB persistence confirmation
- email notification confirmation
- admin protection check
- bounded log review
- rollback decision window
