# Accessibility Spec

## Page Structure

- Use semantic landmarks: `header`, `main`, `footer`, `nav` and `section`.
- Provide one `h1` per public page.
- Use logical heading order without skipping for visual size.
- Add a skip-to-content link before the header.
- Keep route titles meaningful and unique.

## Keyboard and Focus

- Preserve visible focus using the existing `focus-ring` pattern.
- All buttons, links, form controls, mobile menu controls and cards with links must be keyboard reachable.
- Do not trap focus in the mobile menu unless a true modal pattern is added.
- Escape should continue to close the mobile menu.

## Forms

- Every input/select/textarea must have a visible label.
- Required fields should be indicated in text, not colour only.
- Associate errors with inputs using `aria-describedby`.
- Add an error summary when multiple errors appear after submit.
- Success and error status messages should use `aria-live`.
- Conditional hospitality fields should be announced when revealed.

## Visual Accessibility

- Maintain contrast for teal links/buttons, slate text and amber notes.
- Status badges must include text labels and not rely on colour alone.
- Touch targets should be at least 44px high on mobile.
- Content must reflow at 200% zoom without horizontal scrolling.
- Do not place text over images unless contrast is guaranteed.

## Motion and Media

- Respect reduced-motion preferences for any future transitions.
- Project screenshots need descriptive alt text or empty alt text when purely decorative.
- Leader images need meaningful alt text when identifying the person; initials fallback is acceptable.

## Link Purpose

Links should make sense out of context. Avoid repeated ambiguous `Learn more` links unless each has accessible text naming the service or project.
