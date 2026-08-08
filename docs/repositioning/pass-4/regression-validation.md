# Regression Validation

## Production-Sensitive Behaviour

| Area                       | Result                                                       |
| -------------------------- | ------------------------------------------------------------ |
| Lead API validation        | Passed unit/API checks                                       |
| Lead persistence mapping   | Passed mocked persistence tests                              |
| SMTP notification mapping  | Passed unit tests                                            |
| SMTP failure semantics     | Passed: non-fatal after database persistence                 |
| Anti-spam/timing behaviour | Existing tests and source path preserved                     |
| Rate limiting              | Existing source path preserved                               |
| Admin protection           | `/admin/leads` redirects to login when unauthenticated       |
| Legal links                | Footer legal links present                                   |
| Registered address         | Public legal identity remains visible                        |
| Public email               | `info@sikhwarigroup.co.za` visible in footer/privacy contact |
| Exact footer mark          | Present                                                      |
| Mobile navigation          | Rendered without overflow                                    |
| Security headers           | Direct API responses included configured security headers    |
| Sitemap                    | Includes hospitality division route                          |
| Robots                     | Allows `/` and references sitemap                            |

## Known Non-Blocking Warnings

- Lint passes with two `<img>` optimisation warnings in existing image use.
- `npm run format` fails repo-wide on pre-existing docs and untracked npm audit JSON files.
- Local rendered server logs showed missing `PRISMA_POSTGRES_DATABASE_URL` errors for database-backed fallback content while still rendering fallback content. This is expected in the local shell and must be validated in Preview/Staging with configured database.

## npm Audit JSON Files

`npm-audit.json` and `npm-audit.after.json` remained untracked and untouched.
