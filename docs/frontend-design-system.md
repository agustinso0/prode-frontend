# Frontend Design System

This document defines the visual and interaction foundation for Prode before product feature implementation. The design direction is premium sports editorial meets tournament command center: sharp, data-confident, atmospheric, and built for reusable football tournament prediction workflows.

## Summary

| Area         | Decision                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------- |
| Aesthetic    | Premium sports editorial / tournament command center.                                       |
| Primary mode | Dark-first with high-contrast surfaces and warm match-day accents.                          |
| UI density   | Comfortable by default; compact only for rankings, fixtures, and admin tables.              |
| Typography   | System-first now, with room for a later display/body font pair when brand work is explicit. |
| Styling      | Tailwind CSS v4 utilities backed by CSS variable tokens in `src/index.css`.                 |
| Components   | Build primitives first, shared compositions second, feature-specific components last.       |

## Design Principles

- Tournament clarity beats decoration: every screen should make status, deadlines, and next actions obvious.
- Premium does not mean noisy: use contrast, spacing, borders, and type hierarchy before adding effects.
- Data must feel trustworthy: tables, rankings, and fixture states need stable alignment, predictable sorting, and clear labels.
- Sports energy should be controlled: use accent color and motion for focus, not as constant background noise.
- Mobile is not a reduced desktop: prediction entry, fixture scanning, and league switching must work first on small screens.
- Accessibility is product quality: contrast, focus, semantics, and keyboard paths are not optional polish.

## Brand And Product Tone

Prode should feel like a private competition product that could support real tournament operations, not a casual party app.

| Trait           | UI Implication                                                                             |
| --------------- | ------------------------------------------------------------------------------------------ |
| Competitive     | Rankings, scores, and lock states are visually prominent.                                  |
| Trustworthy     | Admin and result views use restrained colors and explicit state labels.                    |
| Social          | League and member surfaces can be warmer and more human than admin surfaces.               |
| Reusable        | Avoid World Cup-only visuals, flags-as-decoration overload, or hardcoded event branding.   |
| Portfolio-grade | Use precise spacing, strong typography, and distinctive surfaces instead of generic cards. |

## Aesthetic Direction

The product should look like a premium tournament control room with editorial sports cues.

Use:

- Deep pitch/navy canvas, ink panels, and subtle field-line or grid-inspired structure.
- Warm gold for achievement, ranking, and primary competitive emphasis.
- Electric cyan for live, active, or interactive states.
- Red only for destructive, failed, or locked-critical states.
- Large, confident headings paired with compact tabular data when the task requires density.
- Thin borders, inset highlights, and measured shadows instead of glassmorphism-heavy cards.

Avoid making every page a dashboard. Public and league surfaces can be editorial and inviting; admin and ranking surfaces should be more operational.

## Color Semantics

Color tokens live in `src/index.css`. Use semantic intent first, raw color values only when a new token is justified.

| Token                    | Intended Usage                                         |
| ------------------------ | ------------------------------------------------------ |
| `--surface-canvas`       | App background and full-screen shells.                 |
| `--surface-panel`        | Primary panels, cards, and page sections.              |
| `--surface-panel-strong` | Elevated or selected panels.                           |
| `--surface-muted`        | Secondary rows, subtle containers, and skeleton bases. |
| `--border-subtle`        | Default panel borders and separators.                  |
| `--border-strong`        | Focused, selected, or high-importance boundaries.      |
| `--text-primary`         | Main readable text.                                    |
| `--text-secondary`       | Supporting labels, metadata, descriptions.             |
| `--text-muted`           | Low-emphasis helper text.                              |
| `--accent-primary`       | Primary actions, achievement, ranking emphasis.        |
| `--accent-live`          | Active, live, or currently editable states.            |
| `--accent-success`       | Successful completion or confirmed results.            |
| `--accent-warning`       | Pending, deadline-near, or needs-attention states.     |
| `--accent-danger`        | Destructive, invalid, or failed states.                |

State usage rules:

- Use both color and text/icon/shape for status; never communicate status with color alone.
- Reserve `--accent-danger` for real risk, not normal negative sports outcomes.
- Use `--accent-primary` sparingly so rankings and primary actions keep their weight.
- Prefer neutral surfaces for admin forms; let validation and action states carry color.

## Typography

Use the current system-first stack until the brand explicitly chooses hosted fonts. This keeps performance stable and avoids adding a font dependency before product screens exist.

Recommended future strategy:

- Display: a condensed or editorial sports headline face for hero headings, tournament titles, and ranking highlights.
- Body: a highly readable sans for dense forms, tables, and mobile views.
- Numeric data: tabular numerals for points, ranks, dates, match times, and scores.

Scale:

| Role          | Mobile      | Desktop     | Usage                                   |
| ------------- | ----------- | ----------- | --------------------------------------- |
| Display       | `text-4xl`  | `text-6xl`  | Public hero or major tournament moment. |
| Page title    | `text-3xl`  | `text-5xl`  | Main screen title.                      |
| Section title | `text-xl`   | `text-2xl`  | Cards, panels, grouped content.         |
| Body          | `text-base` | `text-base` | Reading and form content.               |
| Small         | `text-sm`   | `text-sm`   | Metadata and helper text.               |
| Micro         | `text-xs`   | `text-xs`   | Labels, badges, table metadata.         |

Rules:

- Use `tracking-tight` for large headings and avoid letter spacing on long body copy.
- Use uppercase tracking only for short labels, never paragraphs.
- Use `font-variant-numeric: tabular-nums` or Tailwind's `tabular-nums` for data-heavy numbers.

## Spacing, Radius, Elevation, Borders, Motion

Spacing:

- Use `4px` as the base rhythm through Tailwind spacing utilities.
- Default page padding starts at `px-4` or `px-6` on mobile and expands at larger breakpoints.
- Panel internal spacing should usually be `p-4`, `p-6`, or `p-8` depending on density.

Radius:

- Use `--radius-sm` for inputs, table chips, and badges.
- Use `--radius-md` for compact cards and controls.
- Use `--radius-lg` for primary panels.
- Use `--radius-xl` only for editorial hero or major summary surfaces.

Elevation and borders:

- Prefer border and background contrast before shadows.
- Use shadows for active overlays, modals, or primary hero panels only.
- Use one-pixel borders for panel structure; avoid thick decorative outlines.

Motion:

- Keep transitions short: `150ms` for controls, `200ms` for panels, `300ms` for larger reveals.
- Animate opacity and transform; avoid layout-affecting motion.
- Respect `prefers-reduced-motion` and keep the UI fully understandable without animation.
- Do not add animation libraries before a concrete interaction needs them.

## Responsive Rules

- Design mobile-first at `320px` minimum width.
- Important actions must be reachable without horizontal scrolling.
- Fixtures and rankings should collapse into readable stacked rows on mobile before becoming tables on larger screens.
- Admin tables may use horizontal overflow only when the column count is essential and headers remain understandable.
- Keep touch targets at least `44px` tall or wide.
- Avoid hover-only affordances; every hover interaction needs a focus/tap equivalent.

## Accessibility Rules

- Maintain WCAG AA contrast for text and meaningful controls.
- Use semantic HTML before ARIA. Buttons are buttons; links are links.
- Every interactive element must have a visible focus state.
- Form errors must be programmatically associated with fields.
- Loading states should announce meaningful progress when they block interaction.
- Skeletons must not be the only loading communication for critical actions.
- Do not use flag color, team color, or icon shape as the only identifier.
- Preserve keyboard navigation through menus, dialogs, filters, and table controls.

## Tailwind Conventions

- Use Tailwind utilities directly for layout and component styling.
- Use CSS variables for durable design tokens and Tailwind arbitrary values for semantic tokens, for example `bg-[var(--surface-panel)]`.
- Do not create a Tailwind config file until the project needs plugin or theme extension behavior that cannot live cleanly in CSS.
- Keep class lists ordered by layout, box model, color, typography, state.
- Extract shared components when repetition is proven across screens, not after the first use.
- Avoid one-off CSS files for components unless browser features or complex selectors justify them.

## Component Tiers

| Tier               | Location                                   | Examples                                                     | Rule                                          |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| Primitive          | `src/shared/ui`                            | Button, Input, Badge, Dialog, Table primitives               | Domain-neutral, reusable, accessible.         |
| Shared composition | `src/shared/ui` or `src/shared/components` | EmptyState, ErrorState, PageHeader, DataPanel                | Still domain-neutral, can combine primitives. |
| Feature-specific   | `src/features/<domain>/components`         | RankingTable, PredictionCard, FixtureList, LeagueInvitePanel | Owns product language and domain behavior.    |

Do not move a component to shared because it is visually nice. Move it only when ownership and reuse are clear.

## Empty, Loading, And Error States

Empty states:

- State what is missing and what the user can do next.
- Use calm neutral surfaces; avoid celebratory art for operational emptiness.
- For first-use flows, include one primary action when the next step is obvious.

Loading states:

- Use skeletons for page content that is expected to resolve quickly.
- Use inline pending states for actions so users know what submitted.
- Preserve layout dimensions to avoid content jumps.

Error states:

- Explain what failed in user terms and offer recovery when possible.
- Use destructive color only for the key state marker or action.
- Log/debug details should not leak into user-facing UI.

## Data-Dense UI Guidance

Rankings:

- Keep rank, display name, points, and movement visible at all breakpoints.
- Use tabular numerals and right alignment for points and numeric stats.
- Highlight the current user without hiding comparative context.
- Explain ties and scoring rules close to the ranking table.

Fixtures:

- Group by date, tournament phase, or league-relevant status.
- Make lock time and prediction status more prominent than decorative team assets.
- Use compact cards on mobile and table/list hybrids on desktop.

Admin tables:

- Prioritize auditability: status, source, last update, and correction actions should be clear.
- Use dense rows only when scanning is the main task.
- Keep destructive actions visually separated from routine editing.
- Provide filters and sorting before adding visual complexity.

## What Not To Do

- Do not use generic purple-blue AI gradients or soft SaaS cards as the default identity.
- Do not hardcode World Cup 2026 visuals into reusable components.
- Do not add a UI library before the project has concrete component needs that justify it.
- Do not implement final marketing copy before the product positioning is written.
- Do not create feature UI inside `app` or `routes`.
- Do not make every reusable component overly configurable before real use cases exist.
- Do not use color alone for live, locked, won, lost, or error states.
- Do not let dense tables become unreadable on mobile just to preserve desktop columns.

## MVP Component Inventory

Build these later as feature work requires them.

Primitives:

- Button
- Input
- Select
- Checkbox
- Radio group
- Textarea
- Badge
- Avatar
- Dialog
- Tabs
- Table primitives
- Toast or inline notification primitive

Shared compositions:

- PageShell
- PageHeader
- DataPanel
- EmptyState
- ErrorState
- LoadingSkeleton
- StatCard
- StatusBadge
- FormField

Feature-specific components:

- Landing tournament preview
- SignInPanel
- LeagueCard
- InviteCodePanel
- TournamentActivationCard
- FixtureList
- PredictionCard
- PredictionLockBadge
- RankingTable
- MemberList
- AdminDataTable
- ResultCorrectionForm

## Current Scaffold

`src/index.css` contains minimal foundation tokens and global app defaults. The existing landing placeholder may use those tokens, but it must remain a scaffold until product copy and real feature requirements are implemented.
