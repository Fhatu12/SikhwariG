# Pass 5A Preview Lead E2E

Date: 2026-08-08

## Verdict

PASS WITH NOTES.

Exactly one synthetic Hospitality enquiry was submitted to the READY Preview deployment and persisted in the isolated Preview database.

## API Result

- Target: Preview deployment
- Submission count: exactly one successful synthetic lead
- HTTP result: 200
- Response shape: `{"ok":true}`

The full synthetic payload is not recorded in evidence.

## Persistence Verification

A bounded Preview database query inspected only the matching synthetic email.

Result:

- matching Preview record count: 1
- service area stored as Hospitality: yes
- hospitality service type stored as Catering: yes
- event date stored correctly: yes
- event location stored correctly: yes
- estimated guest count stored correctly: yes

No unrelated records were enumerated.

## Production Contamination

Direct Production row lookup for the Preview synthetic email was not available locally because Production pulled database values are opaque for local Prisma usage.

Production contamination risk is mitigated by:

- separate Preview Prisma resource
- distinct Preview and Production generic database values
- Preview-only environment targeting
- successful Preview-only persistence check
- Production deployment and aliases remained unchanged

## SMTP Posture

Preview SMTP remains intentionally disabled. Production SMTP was already validated in the Production release.

Preview logs showed the expected safe event:

- `lead_notification_disabled`
- missing SMTP variable names only
- no SMTP credentials
- no enquiry content
