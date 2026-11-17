---
name: frontend-design
description: Project design system rules (type scale, 8px spacing, color tokens, component patterns, anti-generic-AI aesthetic). Use whenever building or styling UI in this project.
---

# Frontend Design Rules

Stack: React + Vite, plain CSS with CSS variables, framer-motion for animation.
Define all tokens once in `src/index.css` under `:root` and reference them everywhere.

## Typography
- Use a modular scale (1.25 ratio), no ad-hoc sizes:
  `--text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.5rem; --text-2xl: 2rem; --text-3xl: 2.5rem; --text-4xl: 3.5rem`
- Max two font families: one display, one body. Avoid Inter/Roboto/Arial as the default choice.
- Body line-height 1.5-1.7, headings 1.1-1.25. Max line length ~65ch.
- Weights: 400 body, 500 UI labels, 600-700 headings.

## Spacing (8px base grid)
- Only use multiples of 4/8: `--space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px; --space-5: 32px; --space-6: 48px; --space-7: 64px; --space-8: 96px`
- Section vertical padding: 64-96px desktop, 48px mobile. Consistent gutters.

## Color tokens
- Never hard-code hex values in components. Tokens only:
  `--color-primary`, `--color-primary-hover`, `--color-accent`, `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, plus semantic `--color-success/warning/danger`.
- One primary + one accent + neutrals. Text contrast >= 4.5:1.
- Support dark mode via `prefers-color-scheme` by redefining tokens only.

## Components
- Buttons: primary / secondary / ghost; states: default, hover, focus-visible (visible ring), active, disabled, loading. Min height 44px.
- Cards: consistent radius token (`--radius-md`), 1px border or soft shadow (not both heavy), 24px padding, clear title > body > action hierarchy.
- Forms: label above input, 44px inputs, visible focus, inline error text under field, never placeholder-as-label.
- Radius, shadow, and border tokens shared across all components.

## Motion (framer-motion)
- Subtle and purposeful: 150-300ms, ease-out; animate opacity/transform only.
- Use `whileHover`/`whileTap` on interactive elements, staggered fade-up on section entry (`whileInView`, `viewport={{ once: true }}`).
- Respect `prefers-reduced-motion` (`useReducedMotion`).

## Avoid the generic AI aesthetic
- No purple-to-blue gradient hero on white, no centered-everything layouts, no emoji as icons, no identical 3-card feature rows by default.
- Pick a clear visual direction (editorial, brutalist, soft/organic, etc.) and commit to it.
- Use real hierarchy: one dominant focal point per section, asymmetry, generous whitespace, intentional contrast.
- Use real SVG icons (e.g. lucide), not text glyphs. Realistic copy, not "Lorem ipsum" or "Feature One".
- Responsive from 360px up; no horizontal scroll.

For deeper guidance (palettes, font pairings, UX rules), also consult the `ui-ux-pro-max` skill.
