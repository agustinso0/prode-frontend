# Proposal: Public Landing with Tournament and Match Contracts

## Intent

Replace the placeholder landing page with a product-ready public landing that displays available tournaments and upcoming matches using frontend-defined contracts and mocks, since the backend does not exist yet.

## Scope

### In Scope

- Landing page UI with value proposition, available tournaments section, upcoming matches section, and CTAs.
- Frontend-only public DTO schemas (Zod) for tournament and match data.
- Realistic mock data builders (World Cup 2026 style).
- Feature-local query hooks using TanStack Query with mock data.
- Unit tests for schemas, builders, hooks, and page rendering.

### Out of Scope

- Tournament catalog page (`/tournaments`).
- Upcoming matches page (`/matches/upcoming`).
- Authentication integration on landing.
- Backend contract negotiation.

## Capabilities

### New Capabilities

- `public-landing`: Public landing page with tournament and match preview.
- `tournament-contracts`: Frontend-only shared DTO schemas and mock builders for public tournament and match data.

### Modified Capabilities

- None

## Approach

1. Define shared public DTO schemas in `src/shared/schemas/` (justified reuse across landing and future tournaments feature).
2. Create mock builder functions in `src/features/landing/api/` per testing-quality conventions.
3. Build feature-local query hooks that return mock data via TanStack Query.
4. Implement landing page sections with design system tokens.
5. Test schemas, builders, hooks, and page states under strict TDD.

## Affected Areas

| Area                                         | Impact   | Description                              |
| -------------------------------------------- | -------- | ---------------------------------------- |
| `src/features/landing/pages/LandingPage.tsx` | Modified | Replace placeholder with product landing |
| `src/features/landing/api/`                  | New      | Query hooks and mock builders            |
| `src/features/landing/components/`           | New      | Landing section components               |
| `src/shared/schemas/`                        | New      | Public tournament and match DTO schemas  |

## Risks

| Risk                                      | Likelihood | Mitigation                                              |
| ----------------------------------------- | ---------- | ------------------------------------------------------- |
| Frontend DTOs diverge from future backend | High       | Zod runtime validation; document schemas clearly        |
| Mock data feels artificial                | Low        | World Cup 2026 realistic fixtures and team names        |
| Scope creep into full tournament pages    | Med        | Explicitly defer `/tournaments` and `/matches/upcoming` |

## Rollback Plan

Revert `LandingPage.tsx` to placeholder and remove new folders. No route or infrastructure changes.

## Dependencies

- None (frontend-only slice).

## Success Criteria

- [ ] Landing page renders value proposition, tournament list, match list, and CTAs.
- [ ] Zod schemas validate mock data at runtime.
- [ ] TanStack Query hooks serve mock data with loading and success states.
- [ ] Tests pass for schemas, builders, hooks, and page rendering.
- [ ] No private data leaks on public page.
- [ ] Total changes stay within 800-line review budget.
