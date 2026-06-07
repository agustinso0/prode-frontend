# Tournament Contracts Delta Specification

## ADDED Requirements

### Requirement: Shared Public DTO Schemas

The frontend MUST define Zod DTO schemas for public tournament and public match data in `src/shared/schemas/`. The schemas MUST include stable identifiers, public names, status enums, kickoff timestamps, team labels, tournament references, and display-safe metadata. Schemas MUST parse unknown data before UI use.

#### Scenario: Tournament schema validates World Cup 2026 data

- GIVEN a World Cup 2026-style public tournament DTO
- WHEN `tournamentPublicDtoSchema.parse()` is called
- THEN parsing succeeds with typed output

#### Scenario: Match schema validates World Cup 2026 data

- GIVEN a World Cup 2026-style public match DTO
- WHEN `matchPublicDtoSchema.parse()` is called
- THEN parsing succeeds with typed output

#### Scenario: Invalid tournament data fails validation

- GIVEN a tournament DTO has an invalid status, missing identifier, or invalid date format
- WHEN schema parsing runs
- THEN validation fails before UI rendering

#### Scenario: Invalid match data fails validation

- GIVEN a match DTO has an invalid status, missing identifier, invalid kickoff, or invalid team field
- WHEN schema parsing runs
- THEN validation fails before UI rendering

### Requirement: World Cup 2026 Mock Builders

The feature MUST provide realistic World Cup 2026-style builder functions in `src/features/landing/api/` that produce parseable DTOs.

#### Scenario: Tournament builder produces valid DTOs

- GIVEN `buildTournamentDto()` is called with default options
- WHEN the output is parsed through `tournamentPublicDtoSchema`
- THEN parsing succeeds

#### Scenario: Match builder produces valid DTOs

- GIVEN `buildMatchDto()` is called with default options
- WHEN the output is parsed through `matchPublicDtoSchema`
- THEN parsing succeeds

#### Scenario: Builder overrides work correctly

- GIVEN `buildTournamentDto({ name: 'Custom Tournament' })` is called
- THEN the returned DTO has `name: 'Custom Tournament'`

### Requirement: Feature-Owned Query Hooks

The feature MUST provide TanStack Query hooks backed by mock data. Hooks MUST expose validated public data, stable query keys, loading/success/error states, and UI-ready view models.

#### Scenario: usePublicTournaments returns active/upcoming tournaments

- GIVEN the backend does not exist
- WHEN `usePublicTournaments()` hook runs
- THEN it resolves only active and upcoming tournaments
- AND returns `TournamentPreview[]` view models

#### Scenario: usePublicMatches returns future matches

- GIVEN the backend does not exist
- WHEN `usePublicMatches()` hook runs
- THEN it resolves only future-kickoff matches across tournaments
- AND returns `MatchPreview[]` view models

#### Scenario: Hooks have stable query keys

- GIVEN `usePublicTournaments()` is called
- THEN the query key is `['landing', 'publicTournaments']`

#### Scenario: Hooks have stable query keys for matches

- GIVEN `usePublicMatches()` is called
- THEN the query key is `['landing', 'publicMatches']`

### Requirement: View Models for Landing Display

The feature MUST define `TournamentPreview` and `MatchPreview` interfaces with formatted fields suitable for landing page display.

#### Scenario: TournamentPreview has formatted dates

- GIVEN a `TournamentPublicDto` is transformed via `toTournamentPreview()`
- WHEN the result is used in UI
- THEN dates are formatted as human-readable strings

#### Scenario: MatchPreview has formatted kickoff

- GIVEN a `MatchPublicDto` is transformed via `toMatchPreview()`
- WHEN the result is used in UI
- THEN kickoff is formatted as a localized string

### Requirement: Shared Button Primitive

The feature MUST create a reusable `Button` component in `src/shared/ui/` with primary/ghost variants, sm/md sizes, focus-visible ring, and accessible role.

#### Scenario: Button renders with correct variant

- GIVEN `<Button variant="primary">Create a league</Button>` is rendered
- THEN the button has primary styling

#### Scenario: Button is keyboard reachable

- GIVEN a Button is rendered
- WHEN keyboard focus moves to the button
- THEN a visible focus ring is shown

### Requirement: Strict TDD Verification

Implementation MUST start with failing tests. All tests MUST pass via `npx pnpm test` without a running backend.

#### Scenario: Schema tests pass

- GIVEN schema test files exist for tournament and match
- WHEN `npx pnpm test` runs
- THEN all schema tests pass

#### Scenario: Builder tests pass

- GIVEN builder test files exist
- WHEN `npx pnpm test` runs
- THEN all builder tests pass

#### Scenario: Hook tests pass

- GIVEN hook test files exist for usePublicTournaments and usePublicMatches
- WHEN `npx pnpm test` runs
- THEN all hook tests pass

#### Scenario: Component tests pass

- GIVEN component test files exist for HeroSection, TournamentPreviewList, MatchPreviewList
- WHEN `npx pnpm test` runs
- THEN all component tests pass

#### Scenario: Page tests pass

- GIVEN LandingPage test file exists
- WHEN `npx pnpm test` runs
- THEN all page tests pass

#### Scenario: Emoji gate test passes

- GIVEN the emoji gate test exists in LandingPage tests
- WHEN `npx pnpm test` runs
- THEN the emoji gate test passes (no emojis found)
