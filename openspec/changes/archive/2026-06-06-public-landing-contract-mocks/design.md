# Design: Public Landing with Tournament and Match Contracts

## Technical Approach

Replace the single-hero placeholder with a product landing composed of three sections (Hero, TournamentPreviewList, MatchPreviewList) backed by feature-owned TanStack Query hooks. Define shared Zod DTO schemas for tournament/match contracts, then build World Cup 2026-style mock builders inside the landing feature. Hooks filter to active/upcoming tournaments and future matches, transform DTOs into view models, and serve loading/success/error states. Components consume view models only. Strict TDD drives schema testing, builder testing, hook testing, and page-state testing.

## Architecture Decisions

| Decision               | Choice                                                                                       | Rejected                                                | Rationale                                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DTO schemas location   | `src/shared/schemas/`                                                                        | Feature-local or lib-level                              | Architecture doc permits shared schemas for API DTOs reused across unrelated features (landing + future `/tournaments`). Two schemas, domain-neutral.                                                 |
| Mock builders location | `src/features/landing/api/`                                                                  | Shared or test-only                                     | Testing-quality doc: keep builders near feature tests until cross-feature reuse is proven. Only landing needs them now.                                                                               |
| Query hooks            | Feature-local TanStack Query `usePublicTournaments`/`usePublicMatches` with mock data        | Adapter-service layer or global mocks                   | Matches architecture doc (feature query/mutation helpers in `api/`). No backend calls; hooks compose builders + schema validation.                                                                    |
| Shared UI primitives   | Create `Button` only                                                                         | Create Button+EmptyState+ErrorState+LoadingSkeleton now | Button is the #1 reused primitive, needed for the primary CTA. Empty/error/loading states stay inline or feature-local until a second feature proves the extraction pattern; saves ~150 review lines. |
| View models            | `TournamentPreview`/`MatchPreview` interfaces in `src/features/landing/api/` alongside hooks | Inline transforms in components                         | Spec requires "UI-ready view models without raw unparsed DTOs." Keeps presentational components pure.                                                                                                 |
| Data filtering         | Inside hooks, not components                                                                 | Components or shared utils                              | Active/upcoming tournament filtering and future-match filtering are landing-page business rules per spec. Hooks own them; components receive ready-to-render lists.                                   |

## Data Flow

```
Shared Schemas (tournamentDto, matchDto) ──parse──> Builder Functions (buildTournamentDto, buildMatchDto)
                                                                │
                                        ┌───────────────────────┘
                                        ▼
          usePublicTournaments() ──filter active/upcoming──> TournamentPreview[]
          usePublicMatches()     ──filter future kickoffs──> MatchPreview[]
                                        │
                                        ▼
                   LandingPage ──composes──> HeroSection
                                        ├──> TournamentPreviewList
                                        └──> MatchPreviewList
```

## File Structure

| File                                                        | Action | Description                                                                           |
| ----------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| `src/shared/schemas/tournament.ts`                          | Create | `TournamentPublicDto` Zod schema with id, name, status enum, dates, counts            |
| `src/shared/schemas/match.ts`                               | Create | `MatchPublicDto` Zod schema with id, tournament ref, teams, kickoff, status, stage    |
| `src/shared/ui/Button.tsx`                                  | Create | Reusable Button primitive using design tokens, variant/size props, focus-visible ring |
| `src/features/landing/api/tournamentMocks.ts`               | Create | `buildTournamentDto` and `buildMatchDto` builders with World Cup 2026 defaults        |
| `src/features/landing/hooks/usePublicTournaments.ts`        | Create | TanStack Query hook filtering active/upcoming, returning `TournamentPreview[]`        |
| `src/features/landing/hooks/usePublicMatches.ts`            | Create | TanStack Query hook filtering future kickoffs, returning `MatchPreview[]`             |
| `src/features/landing/components/HeroSection.tsx`           | Create | Value proposition + "Create a league" primary CTA                                     |
| `src/features/landing/components/TournamentPreviewList.tsx` | Create | Card grid of active/upcoming tournaments with loading/empty skeletons                 |
| `src/features/landing/components/MatchPreviewList.tsx`      | Create | Ordered list of upcoming matches with kickoff, teams, tournament badge                |
| `src/features/landing/pages/LandingPage.tsx`                | Modify | Replace placeholder with composed sections, state orchestration                       |

Plus corresponding `*.test.ts`/`*.test.tsx` files colocated with each module.

## Interfaces / Contracts

```ts
// src/shared/schemas/tournament.ts
export const tournamentPublicDtoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['active', 'upcoming', 'completed', 'archived']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  matchCount: z.number().int().nonnegative(),
  teamsCount: z.number().int().nonnegative(),
});
export type TournamentPublicDto = z.infer<typeof tournamentPublicDtoSchema>;

// src/shared/schemas/match.ts
export const matchPublicDtoSchema = z.object({
  id: z.string().min(1),
  tournamentId: z.string().min(1),
  tournamentName: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  kickoff: z.string().datetime(),
  status: z.enum(['scheduled', 'live', 'completed']),
  stage: z.string().min(1),
});
export type MatchPublicDto = z.infer<typeof matchPublicDtoSchema>;
```

View models (feature-local in `src/features/landing/api/`):

```ts
export interface TournamentPreview {
  id: string;
  name: string;
  statusLabel: string;
  startDate: string; // formatted
  endDate: string; // formatted
  matchCount: number;
  teamsCount: number;
}

export interface MatchPreview {
  id: string;
  tournamentId: string;
  tournamentName: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string; // formatted UTC
  stage: string;
}
```

Hook signatures:

```ts
export function usePublicTournaments(): UseQueryResult<TournamentPreview[]>;
export function usePublicMatches(): UseQueryResult<MatchPreview[]>;
```

Query keys: `['landing', 'publicTournaments']` and `['landing', 'publicMatches']`.

## Testing Strategy

| Layer         | What to Test                                                                                                                              | Approach                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Schema        | Valid DTOs parse, invalid status/ids/dates fail                                                                                           | `vitest` unit; `z.safeParse` assertions                           |
| Builder       | Defaults produce valid DTOs, overrides produce expected values                                                                            | Parse output through schemas; assert field values                 |
| Hook          | Loading/success states, active/upcoming filter, future-match filter                                                                       | `renderHook` with fresh `QueryClient` via `createTestQueryClient` |
| Component     | HeroSection renders CTA accessible; TournamentPreviewList renders cards/skeleton/empty; MatchPreviewList renders ordered matches          | `renderWithProviders`; RTL queries by role/label/text             |
| Page          | Full landing renders all sections; loading state visible before data; empty state when no data; error state with retry; no emojis in copy | `renderWithProviders` with mock hooks                             |
| Accessibility | CTAs focus-reachable, headings semantic, status not color-only                                                                            | RTL `userEvent.tab()` + role assertions                           |

All tests use `npx pnpm test` as runner. TDD sequence: schemas -> builders -> hooks -> components -> page -> accessibility -> emoji gate.

## Risks

| Risk                                           | Mitigation                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------- |
| DTO divergence from future backend             | Schemas are minimal (6-7 fields); Zod parsing gate catches mismatches early             |
| Shared Button churn from premature abstraction | Button starts with 2 variants (primary/ghost) and 2 sizes; no icon/composition overload |
| Review budget: ~650 estimated changed lines    | Component and hook scopes kept tight; shared primitives limited to Button only          |
| Mock data feels stale after real backend       | Builders use realistic WC2026 data but are feature-local; easy to replace or delete     |

## Implementation Notes for Strict TDD

- Write schema tests FIRST — they fail until `src/shared/schemas/*.ts` exist with parse-ready exports.
- Builder tests fail until builders produce parseable output.
- Hook tests use `renderHook` from `@testing-library/react` with `wrapper: ({children}) => <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>`.
- Component tests mock hooks at the module level with `vi.mock`; test loading/empty/error/success states independently.
- Page tests render through `renderWithProviders` from `src/test/`.
- Emoji gate: a dedicated test that asserts the full rendered landing text contains no emoji characters (`/\p{Extended_Pictographic}/u`).
- No backend, no `fetch`, no `env` usage — mock data is synchronous, returned directly in `queryFn`.
