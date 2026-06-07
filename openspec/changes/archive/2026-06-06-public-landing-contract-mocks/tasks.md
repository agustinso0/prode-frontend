# Tasks: Public Landing with Tournament and Match Contracts

## Review Workload Forecast

| Field                   | Value                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Estimated changed lines | 600-700                                                                                               |
| 400-line budget risk    | Medium                                                                                                |
| Chained PRs recommended | Yes                                                                                                   |
| Suggested split         | PR 1: Contracts + Button + Builders + Hooks (foundation) -> PR 2: Components + Page + A11y (UI layer) |
| Delivery strategy       | ask-always                                                                                            |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal                                                                                             | Likely PR | Notes                                             |
| ---- | ------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------- |
| 1    | DTO schemas, Button primitive, mock builders, view models, query hooks                           | PR 1      | Base branch; all tests included; no UI components |
| 2    | HeroSection, TournamentPreviewList, MatchPreviewList, LandingPage composition, a11y + emoji gate | PR 2      | Depends on PR 1; UI-only diff; tests included     |

## Phase 1: Contracts and Shared Primitives

- [x] 1.1 Create `src/shared/schemas/tournament.ts` with `tournamentPublicDtoSchema` (Zod) covering id, name, status enum, startDate, endDate, matchCount, teamsCount; write failing test `src/shared/schemas/tournament.test.ts` first asserting valid parse and invalid rejection
- [x] 1.2 Create `src/shared/schemas/match.ts` with `matchPublicDtoSchema` (Zod) covering id, tournamentId, tournamentName, homeTeam, awayTeam, kickoff, status enum, stage; write failing test `src/shared/schemas/match.test.ts` first
- [x] 1.3 Create `src/shared/ui/Button.tsx` with primary/ghost variants, sm/md sizes, focus-visible ring, and accessible role; write test `src/shared/ui/Button.test.tsx` verifying variants render and button is keyboard-reachable
- [x] 1.4 Run `npx pnpm test` — verify schema and Button tests pass

## Phase 2: Mock Builders, View Models, and Query Hooks

- [x] 2.1 Create `src/features/landing/api/tournamentMocks.ts` with `buildTournamentDto()` and `buildMatchDto()` builders producing World Cup 2026-style defaults; write failing test `src/features/landing/api/tournamentMocks.test.ts` asserting defaults parse through schemas and overrides work
- [x] 2.2 Define `TournamentPreview` and `MatchPreview` view model interfaces in `src/features/landing/api/viewModels.ts` with transformation functions `toTournamentPreview()` and `toMatchPreview()`; write test `src/features/landing/api/viewModels.test.ts`
- [x] 2.3 Create `src/features/landing/hooks/usePublicTournaments.ts` TanStack Query hook with key `['landing', 'publicTournaments']`, filtering active/upcoming, returning `TournamentPreview[]`; write failing test `src/features/landing/hooks/usePublicTournaments.test.ts` using `renderHook` + `createTestQueryClient`
- [x] 2.4 Create `src/features/landing/hooks/usePublicMatches.ts` TanStack Query hook with key `['landing', 'publicMatches']`, filtering future kickoffs, returning `MatchPreview[]`; write failing test `src/features/landing/hooks/usePublicMatches.test.ts`
- [x] 2.5 Run `npx pnpm test` — verify builders, view models, and hook tests pass

## Phase 3: UI Components

- [x] 3.1 Create `src/features/landing/components/HeroSection.tsx` with value proposition copy, "Create a league" primary CTA (uses Button), semantic heading structure; write failing test `src/features/landing/components/HeroSection.test.tsx` asserting CTA renders with correct accessible name and no emojis
- [x] 3.2 Create `src/features/landing/components/TournamentPreviewList.tsx` accepting `TournamentPreview[]`, rendering card grid with status labels, loading skeleton, and empty state; write failing test `src/features/landing/components/TournamentPreviewList.test.tsx` covering loading/empty/success states via mocked hook
- [x] 3.3 Create `src/features/landing/components/MatchPreviewList.tsx` accepting `MatchPreview[]`, rendering ordered list with kickoff time, team labels, tournament badge, and empty state; write failing test `src/features/landing/components/MatchPreviewList.test.tsx` covering loading/empty/success states
- [x] 3.4 Run `npx pnpm test` — verify component tests pass

## Phase 4: Landing Page Composition and Integration

- [x] 4.1 Modify `src/features/landing/pages/LandingPage.tsx` to compose HeroSection, TournamentPreviewList (via `usePublicTournaments`), MatchPreviewList (via `usePublicMatches`); wire loading/error/empty orchestration
- [x] 4.2 Write test `src/features/landing/pages/LandingPage.test.tsx` asserting all three sections render, loading state visible before data, empty state when no data, error state with retry button
- [x] 4.3 Update `src/app/App.test.tsx` to assert new landing heading (no longer "Tournament predictions for private leagues") or adjust expectation to match new hero copy
- [x] 4.4 Run `npx pnpm test` — verify full suite passes

## Phase 5: Accessibility Gate and Emoji Audit

- [x] 5.1 Add emoji gate test in `src/features/landing/pages/LandingPage.test.tsx` asserting full rendered text contains no `/\p{Extended_Pictographic}/u` matches
- [x] 5.2 Add keyboard navigation test asserting CTAs and preview links receive visible focus in logical order via `userEvent.tab()`
- [x] 5.3 Run `npx pnpm test` — final quality gate; all tests must pass
