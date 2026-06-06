# Frontend Routing And Auth Flow

This document defines the proposed route map and authentication flow before product feature implementation. It is a planning contract for routes, guards, layouts, and ownership; it does not require real auth SDK integration yet.

## Summary

| Area                | Decision                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| Route ownership     | `src/routes` owns paths, guards, layouts, and route-to-page mapping.                                           |
| Page ownership      | Routed screens live in `src/features/<domain>/pages`.                                                          |
| Public access       | Public users can view the landing page, tournament catalog preview, upcoming matches, and invite entry points. |
| App access          | Google sign-in is mandatory before participation.                                                              |
| League access       | League routes are scoped by `:leagueId`; membership is required.                                               |
| League admin access | League admin routes are scoped by `:leagueId`; league admin ownership is required.                             |
| System admin access | System admin routes live under `/admin`; system admin role is required.                                        |

## Route Groups

| Group               | Purpose                                                           | Guard                                                           |
| ------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Public              | Marketing, public discovery, and sign-in entry points.            | No session required.                                            |
| Auth callback/error | OAuth callback and auth failure handling.                         | Auth flow state only.                                           |
| Authenticated app   | User dashboard, profile, and league creation/joining.             | Authenticated session required.                                 |
| League scoped       | League home, tournament participation, predictions, and rankings. | Authenticated league member required.                           |
| League admin        | Member, invitation, rules, and tournament activation management.  | Authenticated league admin required.                            |
| System admin        | Global tournament, fixture, result, and correction management.    | Authenticated system admin required.                            |
| Not found           | Unknown route fallback.                                           | No session required, but rendered in the best available layout. |

## Proposed Routes

| Path                                                           | Group               | Owning feature | MVP | Notes                                                                                |
| -------------------------------------------------------------- | ------------------- | -------------- | --- | ------------------------------------------------------------------------------------ |
| `/`                                                            | Public              | `landing`      | Yes | Public landing with value proposition, available tournaments, and upcoming matches.  |
| `/tournaments`                                                 | Public              | `tournaments`  | Yes | Public tournament catalog preview. Private activation actions require auth.          |
| `/matches/upcoming`                                            | Public              | `tournaments`  | Yes | Public upcoming match list without private predictions.                              |
| `/login`                                                       | Public              | `auth`         | Yes | Starts Google sign-in. Redirect authenticated users to `/app`.                       |
| `/auth/callback`                                               | Auth callback/error | `auth`         | Yes | Handles Google OAuth callback through `src/lib/auth`.                                |
| `/auth/error`                                                  | Auth callback/error | `auth`         | Yes | Shows recoverable auth errors and a return-to-login action.                          |
| `/invite/:inviteCode`                                          | Public              | `leagues`      | Yes | Invite link entry point; unauthenticated users preserve the code through login.      |
| `/app`                                                         | Authenticated app   | `leagues`      | Yes | Authenticated dashboard listing the user's leagues and next actions.                 |
| `/app/onboarding`                                              | Authenticated app   | `profile`      | Yes | Profile completion when required after first Google sign-in.                         |
| `/app/profile`                                                 | Authenticated app   | `profile`      | Yes | Profile display and editing.                                                         |
| `/app/leagues/new`                                             | Authenticated app   | `leagues`      | Yes | League creation.                                                                     |
| `/app/leagues/join`                                            | Authenticated app   | `leagues`      | Yes | Manual invite code entry.                                                            |
| `/app/leagues/:leagueId`                                       | League scoped       | `leagues`      | Yes | League home and active tournament summary.                                           |
| `/app/leagues/:leagueId/tournaments`                           | League scoped       | `tournaments`  | Yes | League tournament history and active tournaments.                                    |
| `/app/leagues/:leagueId/tournaments/:tournamentId`             | League scoped       | `tournaments`  | Yes | League tournament overview.                                                          |
| `/app/leagues/:leagueId/tournaments/:tournamentId/predictions` | League scoped       | `predictions`  | Yes | Match and extra predictions for the league tournament.                               |
| `/app/leagues/:leagueId/tournaments/:tournamentId/rankings`    | League scoped       | `rankings`     | Yes | Current league tournament ranking.                                                   |
| `/app/leagues/:leagueId/rankings/history`                      | League scoped       | `rankings`     | Yes | Historical accumulated league ranking.                                               |
| `/app/leagues/:leagueId/admin`                                 | League admin        | `leagues`      | Yes | League admin overview.                                                               |
| `/app/leagues/:leagueId/admin/members`                         | League admin        | `leagues`      | Yes | Member removal and ownership transfer.                                               |
| `/app/leagues/:leagueId/admin/invitations`                     | League admin        | `leagues`      | Yes | Invitation links/codes and open/close controls.                                      |
| `/app/leagues/:leagueId/admin/tournaments`                     | League admin        | `tournaments`  | Yes | Available tournament activation for the league.                                      |
| `/app/leagues/:leagueId/admin/tournaments/:tournamentId/rules` | League admin        | `tournaments`  | Yes | League-tournament scoring and prediction rules.                                      |
| `/admin`                                                       | System admin        | `admin`        | Yes | System admin overview.                                                               |
| `/admin/tournaments`                                           | System admin        | `admin`        | Yes | Global tournament management.                                                        |
| `/admin/tournaments/:tournamentId/fixtures`                    | System admin        | `admin`        | Yes | Fixture management and corrections.                                                  |
| `/admin/tournaments/:tournamentId/results`                     | System admin        | `admin`        | Yes | Result entry and override.                                                           |
| `/notifications`                                               | Authenticated app   | Future feature | No  | Future notification center.                                                          |
| `/app/leagues/:leagueId/chat`                                  | League scoped       | Future feature | No  | Future league chat/comments.                                                         |
| `*`                                                            | Not found           | `routes`       | Yes | Route-level fallback; page can be shared or route-owned until a domain owner exists. |

## Layout Model

| Layout              | Applies to                                                                | Responsibility                                                                                             |
| ------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Public layout       | `/`, `/tournaments`, `/matches/upcoming`, `/login`, `/invite/:inviteCode` | Public header, public navigation, unauthenticated CTAs, and no private data assumptions.                   |
| Auth flow layout    | `/auth/callback`, `/auth/error`                                           | Minimal full-page loading/error frame for OAuth transitions.                                               |
| App layout          | `/app/*`                                                                  | Authenticated shell, account navigation, league switcher, and app-level loading boundaries.                |
| League layout       | `/app/leagues/:leagueId/*`                                                | League context header, active tournament switcher, member-only navigation, and league-scoped empty states. |
| League admin layout | `/app/leagues/:leagueId/admin/*`                                          | League admin navigation and admin-only affordances within a league.                                        |
| System admin layout | `/admin/*`                                                                | Operational shell separated from player and league-admin navigation.                                       |

Layouts belong in `src/routes` when they are route-level shells. Domain-specific panels, cards, and forms stay in the owning feature.

## Auth States

| State                | Meaning                                                    | Route behavior                                                                                       |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `unauthenticated`    | No known session.                                          | Public routes render; protected routes redirect to `/login` with an intended destination.            |
| `authenticating`     | Session or callback is being resolved.                     | Guards render route-level loading states and avoid redirects until the state settles.                |
| `authenticated`      | Valid user session exists.                                 | App routes render if any additional membership/role checks pass.                                     |
| `onboardingRequired` | Session exists but required profile fields are incomplete. | App participation redirects to `/app/onboarding`; sign-out and auth error routes remain available.   |
| `forbidden`          | Session exists but membership or role is missing.          | Render a route-level forbidden state or redirect to the nearest safe parent when context is invalid. |

Profile completion is useful for MVP because Google sign-in may not provide every editable profile field required by the product.

## Route Guard Behavior

Guards live in `src/routes` because they make navigation decisions. They may read auth/session state from `src/lib/auth`, but they must not own provider integration.

| Guard               | Applies to                          | Behavior                                                                       |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| Public-only guard   | `/login`                            | Redirect authenticated users to `/app` or the preserved intended destination.  |
| Auth guard          | `/app/*` and `/admin/*`             | Redirect unauthenticated users to `/login`; preserve the original target.      |
| Onboarding guard    | Participation routes under `/app/*` | Redirect incomplete profiles to `/app/onboarding`.                             |
| League member guard | `/app/leagues/:leagueId/*`          | Verify membership before rendering league-scoped pages.                        |
| League admin guard  | `/app/leagues/:leagueId/admin/*`    | Verify league admin access separately from membership.                         |
| System admin guard  | `/admin/*`                          | Verify global system admin access; league admins do not get access by default. |

Guards should prefer loading states over early redirects while session, membership, or role checks are unresolved.

## Google Auth Boundary

`src/lib/auth` owns integration-level concerns:

- Google provider setup and SDK/client wiring when implemented.
- Session loading, refresh, sign-in, sign-out, and callback adapter functions.
- Auth error normalization for route guards and auth screens.
- Session/user role shape exposed to the frontend.

`src/features/auth` owns user-facing auth flow UI:

- Login page content and sign-in actions.
- Callback loading page copy and error presentation.
- Auth error recovery screens.

`src/routes` owns navigation decisions:

- Redirects, intended destinations, guard composition, and layout selection.
- Mapping `/login`, `/auth/callback`, and `/auth/error` to auth feature pages.

The frontend should not assume backend implementation details beyond needing Google authentication and role-based access signals.

## Invite Link And Code Flow

Invite links use `/invite/:inviteCode` as the public entry point.

1. If the user is unauthenticated, show public invite context when safely available, then send the user to Google login while preserving `inviteCode` and the intended destination.
2. After `/auth/callback`, authenticated users with a pending invite return to the invite acceptance flow.
3. If profile completion is required, route through `/app/onboarding` before accepting or joining.
4. If the invite is valid and open, route to `/app/leagues/:leagueId` after joining.
5. If the invite is invalid, closed, expired, or already used, render a league-owned error state with a manual code fallback when appropriate.

Manual codes use `/app/leagues/join`, which requires authentication before submission.

## System Admin Access Flow

System admin access is a global role, not a league role.

- `/admin/*` always requires authentication and a system admin signal from the session or an authorization check.
- League admins who are not system admins receive a forbidden state, not a league-admin fallback.
- System admin navigation should not appear in the player shell unless the authenticated user has the role.
- System admin pages are owned by `src/features/admin`; operational route shells and guards remain in `src/routes`.

## Route State Conventions

| State     | Convention                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading   | Use route-level loading for auth, membership, role, and initial page data checks. Avoid flashing protected content before guards settle.          |
| Error     | Separate auth errors, forbidden access, not found resources, and server/data errors. Do not collapse every failure into a generic not found page. |
| Empty     | Empty states should be domain-owned: no leagues, no active tournaments, no fixtures, no predictions, or no ranking data.                          |
| Not found | Unknown URLs use `*`; missing domain resources should render the closest domain-specific not found state.                                         |

## MVP And Future Scope

MVP routes include the public landing, Google login, profile onboarding/editing, league creation/joining, league-scoped tournaments, predictions, rankings, league administration, and the system admin panel.

Future routes include notifications and league chat/comments. They should not be added to the route tree until their product behavior is specified.
