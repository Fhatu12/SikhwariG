# Hospitality Lead Data Contract

## Public Form Behaviour

Base service choices:

- Telecommunications, ICT, and Network Services
- Cybersecurity Services
- Software Development and Digital Services
- Culinary and Hospitality Services
- General business enquiry
- Not sure

When `Culinary and Hospitality Services` is selected, the form reveals:

| Field                    | Client requirement       | Backend handling                                                                    |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| `hospitalityServiceType` | Required for Hospitality | Must be one of Catering, Chef Services, Corporate Function, Private Function, Other |
| `eventDate`              | Optional                 | Stored as nullable date when valid `YYYY-MM-DD` is supplied                         |
| `eventLocation`          | Optional                 | Stored as nullable text, maximum 160 characters                                     |
| `estimatedGuestCount`    | Optional                 | Stored as nullable positive integer                                                 |

The common message field remains required and is labelled as Requirements / message for hospitality enquiries.

## API Normalisation

For Hospitality submissions:

- validates service type, event date, event location and guest count
- persists approved hospitality fields
- includes approved hospitality fields in internal notification email

For non-Hospitality submissions:

- ignores stale hospitality-only payload values
- persists hospitality fields as `null`
- does not include stale hospitality values in notification content

## Database Fields

The `Lead` model now includes nullable fields:

- `hospitalityServiceType String?`
- `eventDate DateTime?`
- `eventLocation String?`
- `estimatedGuestCount Int?`

Existing leads and non-hospitality leads remain compatible.

## Privacy Note

The privacy page now includes the approved public privacy contact. A fuller privacy wording update remains deferred for legal/content review.
