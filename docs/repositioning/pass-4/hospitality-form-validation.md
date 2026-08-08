# Hospitality Form Validation

## Base Options

Rendered Contact form validation confirmed these options:

- Telecommunications, ICT, and Network Services
- Cybersecurity Services
- Software Development and Digital Services
- Culinary and Hospitality Services
- General business enquiry
- Not sure

Proprietary Trading and Treasury did not appear.

## Conditional Fields

When `Culinary and Hospitality Services` was selected, the form revealed:

- Service type
- Event date
- Event location
- Estimated guest count

Service type options were:

- Catering
- Chef Services
- Corporate Function
- Private Function
- Other

## Behaviour Checked

| Behaviour                                              | Result                          |
| ------------------------------------------------------ | ------------------------------- |
| Hospitality reveal                                     | Passed                          |
| Visible labels                                         | Passed                          |
| Assistive announcement element                         | Present via `aria-live`         |
| Requirements/message remains available                 | Passed                          |
| Switching away hides hospitality fieldset              | Passed                          |
| Switching away shows stale-value non-submission notice | Passed                          |
| Switching back restores same-session values            | Passed                          |
| Mobile width 360/390px                                 | No horizontal overflow detected |
| Mocked success state                                   | Passed                          |
| Mocked API error state                                 | Passed                          |

## Synthetic Values Used

Synthetic local form values included `QA Synthetic User`, `qa.synthetic@example.test`, `Synthetic Venue` and a guest count of `25`. No production enquiry was sent.

## Pending

Full browser E2E against real database persistence remains pending until DevOps provides a safe Preview/Staging database.
