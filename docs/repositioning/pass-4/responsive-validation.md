# Responsive Validation

## Viewports Checked

Rendered route checks used:

- 360px mobile
- 390px mobile
- 768px tablet
- 1280px desktop

Routes checked at all widths:

- `/`
- `/about`
- `/services`
- `/contact`
- all four division routes
- legal privacy, terms and disclaimer

## Results

| Area               | Result                                                |
| ------------------ | ----------------------------------------------------- |
| Navigation         | Mobile menu and desktop nav rendered without overflow |
| Hero               | Homepage headline and CTAs reflowed without overflow  |
| Credibility facts  | Rendered without horizontal overflow                  |
| Portfolio sections | Rendered without overflow                             |
| Service cards      | Rendered without overflow                             |
| Selected Work      | Rendered without overflow                             |
| About/leadership   | Rendered without overflow                             |
| Division layouts   | Rendered without overflow                             |
| Contact form       | Rendered without overflow                             |
| Hospitality fields | Rendered and reflowed at mobile width                 |
| Footer             | Rendered without overflow                             |

No clipped text, CTA collision or horizontal scrolling was detected by the automated width checks.

## Notes

This pass did not produce screenshot artefacts. Visual validation was DOM and layout-metric based.
