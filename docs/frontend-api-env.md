# Frontend API And Environment Strategy

This document defines the Prode frontend API client, environment, and server-state contract before product feature implementation. It keeps backend integration replaceable while giving every feature the same rules for transport, validation, caching, and testing.

## Summary

| Area                 | Decision                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Transport boundary   | `src/lib/api` owns generic HTTP transport, request creation, response parsing, cancellation, timeout handling, and transport-level errors. |
| Feature ownership    | Features own domain-specific API functions, query hooks, mutation hooks, DTO schemas, and cache invalidation rules.                        |
| Environment boundary | `src/lib/env` owns Vite environment loading and Zod validation.                                                                            |
| Base URL variable    | Use `VITE_PRODE_API_BASE_URL` for the backend API base URL.                                                                                |
| Server state         | TanStack Query owns remote data, loading state, retries, cache lifetime, and invalidation.                                                 |
| DTO boundary         | Backend DTOs are parsed at the feature API edge; UI code receives validated domain data or explicit view models.                           |

## Quick Path

1. Add or update a Vite-prefixed environment variable in `.env.example`.
2. Validate it in `src/lib/env` with Zod.
3. Add generic transport behavior only in `src/lib/api`.
4. Add endpoint-specific functions, schemas, query keys, and hooks inside the owning feature.
5. Document important contract changes here before implementing feature behavior.

## API Boundary Ownership

`src/lib/api` owns only generic transport primitives:

- Base URL resolution from validated environment.
- HTTP method, headers, JSON request body handling, and JSON response parsing.
- Transport errors for failed network requests, timeouts, and non-2xx responses.
- Request cancellation through `AbortSignal`.
- Optional token attachment through a provider-agnostic callback.

Features own domain behavior:

- Endpoint paths and request parameters.
- DTO Zod schemas and parsing.
- Domain-specific query and mutation hooks.
- Query key factories.
- Mutation invalidation and optimistic update decisions.
- Mapping parsed DTOs to UI view models when the UI needs a different shape.

Feature code should not call `fetch` directly. Product screens should not know transport details.

## Backend Base URL And Vite Env Naming

Use Vite-exposed variables only when the browser needs them. Every browser-readable variable must start with `VITE_`.

| Variable                  | Required now | Purpose                                                                                |
| ------------------------- | ------------ | -------------------------------------------------------------------------------------- |
| `VITE_PRODE_API_BASE_URL` | No           | Backend API base URL used by `src/lib/api`. Empty means same-origin relative requests. |

Development examples:

```env
VITE_PRODE_API_BASE_URL=http://localhost:3000
```

Deployment examples:

```env
VITE_PRODE_API_BASE_URL=https://api.prode.example
```

Rules:

- Do not add real secrets to frontend env files; Vite variables are bundled for the browser.
- Do not expose provider secrets, service-role keys, database URLs, or private API keys through `VITE_` variables.
- Keep backend framework details out of the frontend contract until the backend exists.
- The current frontend build must pass without a running backend.

## Environment Validation

`src/lib/env` validates environment through Zod at the frontend boundary.

Rules:

- Parse `import.meta.env` once in `src/lib/env`.
- Export a typed `env` object for application code.
- Keep env names explicit and product-scoped when they describe product infrastructure.
- Validate URL-like values before they reach runtime API calls.
- Prefer optional env values during scaffolding when the backend is not implemented yet.
- Tighten optional values into required values only when a real feature needs them.

`VITE_PRODE_API_BASE_URL` may be empty during frontend-only development. When set, it must be either an absolute `http` or `https` URL or a root-relative path such as `/api`.

## Auth Token And Session Attachment

The API client should support auth without hardcoding Google, OAuth, cookies, or a specific backend session model today.

The transport layer may accept a provider-agnostic token callback later:

```ts
createApiClient({
  getAccessToken: async (signal) => sessionAdapter.getAccessToken({ signal }),
});
```

Rules:

- `src/lib/auth` owns auth provider integration and session adapter behavior.
- `src/lib/api` may attach a token if a callback returns one, but it must not import Google SDKs or auth feature code.
- Feature hooks must not read tokens directly.
- Public API requests may opt out of auth attachment when needed.
- Authorization decisions remain backend-owned; frontend guards improve UX but are not security boundaries.

## Error Model

Use separate error categories so UI states do not collapse unrelated failures.

| Error category   | Owner                                            | Meaning                                                                                                 | UI handling                                                                                               |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Transport error  | `src/lib/api`                                    | Network failure, timeout, malformed response, or non-2xx HTTP response.                                 | Show retryable data-loading states when appropriate.                                                      |
| API/domain error | Backend contract, normalized by feature API code | Backend returned a valid error payload such as `LEAGUE_NOT_FOUND`, `PREDICTION_LOCKED`, or `FORBIDDEN`. | Map to domain-specific empty, forbidden, validation, or conflict UI.                                      |
| Validation error | Feature API edge                                 | DTO parsing failed or a form payload failed schema validation.                                          | Treat response validation failures as developer/contract bugs; treat form validation as user-correctable. |

Guidance:

- Do not display raw backend error payloads directly.
- Normalize known domain errors inside the owning feature.
- Keep unknown errors generic but observable for future logging.
- Use route-level forbidden and not-found states for access/resource failures, not a generic crash page.

## Cancellation, Timeouts, And Retries

Cancellation:

- Query functions should pass TanStack Query's `signal` into the API client.
- Route changes and obsolete queries should cancel work instead of racing stale responses.
- Cancellation is surfaced as the raw `AbortError` or `TimeoutError` DOM exception so TanStack Query can identify canceled work correctly.
- The API client's timeout and cancellation cover token resolution and `fetch`; auth adapters should accept the provided signal when they perform async refresh work.
- Mutations should only be cancelable when cancellation is safe for the backend operation.

Timeouts:

- The transport client supports per-request timeout configuration.
- Keep default timeouts conservative until real backend latency is known.
- Use longer timeouts only for admin imports or slow operational workflows when explicitly needed.

Retries:

- Prefer TanStack Query retry configuration over custom retry loops in `src/lib/api`.
- Retry idempotent reads on transient transport failures.
- Do not retry non-idempotent mutations by default.
- Do not retry validation errors, authorization failures, forbidden responses, not-found responses, or domain conflicts.

## TanStack Query Conventions

Each feature defines a query key factory using the `featureQueryKeys` naming convention.

Shape:

```ts
export const leagueQueryKeys = {
  all: ['leagues'] as const,
  lists: () => [...leagueQueryKeys.all, 'list'] as const,
  list: (filters: LeagueListFilters) =>
    [...leagueQueryKeys.lists(), filters] as const,
  detail: (leagueId: string) =>
    [...leagueQueryKeys.all, 'detail', leagueId] as const,
};
```

Rules:

- Start every key with the owning feature or domain name.
- Include route scope identifiers before filters: `leagueId`, then `tournamentId`, then query params.
- Put filter/sort/page objects at the end of the key.
- Keep key inputs serializable and stable.
- Do not share one key between different response shapes.
- Do not define global query keys in `src/lib/query` for product domains.

Mutation invalidation:

- Invalidate the narrowest affected key set after successful mutations.
- League membership mutations invalidate league detail, member lists, and the current user's league list.
- Prediction mutations invalidate the user's prediction detail/list and affected ranking keys only when scoring can change.
- Admin fixture/result mutations invalidate fixture lists, match detail, prediction visibility when lock state changes, and affected rankings.
- Prefer explicit invalidation over broad `queryClient.invalidateQueries()` calls.

Optimistic updates:

- Use optimistic updates only when the domain can safely roll back.
- Do not optimistically expose hidden predictions or admin-only data.
- Keep prediction locking server-authoritative.

## DTO, Schema, And View Model Boundary

Backend DTOs are not UI models.

Rules:

- Define DTO schemas near the feature API code that consumes them.
- Parse unknown API responses with Zod before exposing data to hooks or components.
- Keep DTO names explicit, such as `LeagueDto`, `RankingRowDto`, or `FixtureDto`.
- Map parsed DTOs to view models when UI needs formatted labels, grouped rows, computed display state, or reduced payloads.
- Keep date/time values explicit. Do not rely on implicit local timezone parsing.
- Do not store unparsed backend responses in Zustand or component state.

Validation placement:

```text
src/features/<domain>/api/      Endpoint functions and DTO parsing.
src/features/<domain>/schemas/  Form schemas and domain schemas when reused inside the feature.
src/features/<domain>/hooks/    Query and mutation hooks composed from feature API functions.
```

## Pagination, Filtering, And Sorting

Use consistent request/query parameter names across rankings, fixtures, and admin tables unless the backend contract later requires a documented difference.

| Concept        | Convention                                                                            |
| -------------- | ------------------------------------------------------------------------------------- |
| Page number    | `page`, 1-based.                                                                      |
| Page size      | `pageSize`.                                                                           |
| Cursor         | `cursor`, only for cursor-based feeds.                                                |
| Search text    | `search`.                                                                             |
| Sort field     | `sortBy`.                                                                             |
| Sort direction | `sortDirection` with `asc` or `desc`.                                                 |
| Filters        | Domain-specific names such as `status`, `group`, `teamId`, `memberId`, or `matchday`. |

Guidance:

- Use page-based pagination for admin tables and rankings unless backend performance requires cursors.
- Use cursor pagination for append-only or live feeds if such features are added later.
- Preserve filters and sorting in the URL for route-level tables users may share or revisit.
- Include pagination/filter/sort input in TanStack Query keys.
- Keep default sorting documented per feature when the feature is implemented.

## Mocking And Testing Before Backend Exists

Before the backend exists, tests should verify frontend behavior without real network calls.

Rules:

- Unit test `src/lib/api` with injected `fetchImpl` instead of a real backend.
- Feature API tests may mock transport responses at the feature API edge.
- Component tests should prefer user-visible behavior and realistic providers.
- Do not hardcode product endpoints into global mocks before the contract exists.
- Do not add a mock server dependency until real feature tests need request-level integration.
- Keep mock DTOs close to the feature that owns the schema.

When feature work begins, choose the smallest useful test layer:

- Schema tests for DTO parsing edge cases.
- Feature API tests for error normalization and view model mapping.
- Hook tests only when query behavior, invalidation, or retries are important.
- Component/page tests for user-visible loading, empty, error, and success states.

## What Not To Do

- Do not implement product endpoints before backend contracts exist.
- Do not call `fetch` directly from components, pages, or feature hooks.
- Do not put domain query hooks in `src/lib/api` or `src/lib/query`.
- Do not put auth provider SDK logic in the API transport client.
- Do not expose secrets through `VITE_` variables.
- Do not copy server data into Zustand.
- Do not parse DTOs inside presentational components.
- Do not use one generic query key for multiple response shapes.
- Do not globally retry every request.
- Do not hide prediction-locking, visibility, membership, or role rules in frontend-only logic.

## Related Docs

- `docs/frontend-architecture.md` defines source ownership and dependency direction.
- `docs/frontend-routing-auth.md` defines route guards and auth flow boundaries.
- `docs/frontend-design-system.md` defines visual and component conventions.
