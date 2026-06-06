# Prode — Product Requirements Document

Prode is a reusable tournament prediction platform for private leagues. The first real use case is a World Cup prediction game for a friends group, but the product must be designed as a polished, professional platform that can support future tournaments and multiple independent leagues.

## 1. Product Summary

Prode lets users sign in, create private leagues, invite friends, activate available tournaments, submit match and extra predictions, and compete through league-scoped rankings.

The product should feel professional from the first visit: public landing page, clear onboarding, authenticated experience, league administration, tournament history, configurable rules, and operational tools for system administrators.

## 2. Goals

- Provide a polished prediction experience for private football tournament leagues.
- Allow any authenticated user to create a league and invite friends.
- Support reusable tournaments beyond the FIFA World Cup.
- Keep competition fair by hiding predictions until they can no longer be edited.
- Support league-specific rules without making global comparisons unfair.
- Include enough administration tooling to operate the product without database edits.

## 3. Non-Goals

- Public global ranking across all leagues.
- League chat or comments in the MVP.
- Notifications or prediction reminders in the MVP.
- Anonymous or nickname-only participation.
- Portfolio/storytelling content inside this PRD.

## 4. Target Users

| User         | Description                                              | Primary Need                                                           |
| ------------ | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Player       | Authenticated user participating in one or more leagues. | Predict matches, track performance, compare with friends.              |
| League Admin | League creator or transferred owner.                     | Configure league-tournament rules, manage members, manage invitations. |
| System Admin | Product operator.                                        | Manage tournaments, fixtures, results, and manual corrections.         |

## 5. Core Product Model

### 5.1 Account

- Users must authenticate before participating.
- MVP authentication method: Google sign-in.
- Users can edit their profile.

### 5.2 Profile

MVP editable profile fields:

- Display name.
- Avatar.
- Favorite country/team.

### 5.3 League

- Any authenticated user can create a private league.
- A user can belong to multiple leagues at the same time.
- A league can participate in multiple tournaments over time.
- A league preserves historical tournament results and accumulated standings.

### 5.4 Tournament

- Tournaments are global product entities managed by system admins.
- The product must be reusable for future tournaments, not hardcoded for World Cup 2026.
- World Cup 2026 is the first target tournament.

### 5.5 League Tournament

When a league activates a tournament, the product creates a league-specific tournament configuration.

This configuration should:

- Start from sensible defaults.
- Allow the league admin to customize scoring and prediction rules for that tournament.
- Preserve rules historically so past rankings remain explainable.

## 6. Public Experience

### 6.1 Landing Page

The MVP must include a public landing page before login.

The landing page should include:

- Product value proposition.
- Available tournaments.
- Upcoming matches.
- Calls to action for sign-in, creating a league, or joining a league.

The landing page must not expose private league data, private rankings, member lists, or user predictions.

## 7. Authentication and Access

- Login is mandatory for app participation.
- MVP login method: Google sign-in.
- Unauthenticated users can only access public content.
- Authenticated users can create leagues, join leagues, edit profiles, and participate in active tournaments.

## 8. League Invitations

Users must be able to join leagues through:

- Shareable invitation links.
- Manual invitation codes.

League admins must be able to:

- Open or close invitations.
- Remove members from the league.
- Transfer league admin ownership.

## 9. Tournament Activation

System admins manage the catalog of available tournaments.

League admins can:

- Browse available tournaments.
- Activate a tournament for their league.
- Configure rules for that league-tournament instance.

## 10. Prediction Rules

### 10.1 Match Predictions

MVP default scoring:

- Users predict the match outcome: home win, draw, or away win.
- Points are awarded for correctly predicting the outcome.

The scoring system must be configurable per league-tournament instance so future rules can evolve without changing the product model.

### 10.2 Extra Predictions

The product should support extra predictions in addition to match predictions.

Examples:

- Tournament champion.
- Finalists.
- Top scorer.
- Group winners.

League admins can:

- Enable or disable each extra prediction for a league-tournament.
- Configure points per extra prediction.

### 10.3 Prediction Locking

Default MVP rule:

- Match predictions can be edited until the corresponding match starts.

The product should support configurable deadline modes per league-tournament, but the default must remain per-match locking.

### 10.4 Prediction Visibility

Predictions from other users must remain hidden until editing is closed for that prediction.

For match predictions, this means predictions become visible after the match starts.

This prevents users from copying predictions before the deadline.

## 11. Rankings

The product must support league-scoped rankings only.

Required ranking views:

- Current tournament ranking within a league.
- Historical accumulated ranking within a league across tournaments.

The product must not include a global ranking across all leagues because leagues can use different scoring rules, making global comparison unfair.

## 12. Football Data Management

The product should use an external football data source for fixtures and results, while keeping manual administrative controls as a fallback.

Recommended approach:

- Use an external football API for fixtures/results when available.
- Keep an internal system admin panel for manual creation, correction, and override of tournament data.
- Treat external data as an input, not as the single source of truth.

Potential data sources to evaluate:

- football-data.org for API-based competition data.
- TheSportsDB for general sports data.
- OpenFootball datasets for initial fixtures or fallback static data.

## 13. System Administration

The MVP must include a system admin panel.

System admins can:

- Manage tournaments.
- Manage teams/countries if needed by tournaments.
- Manage fixtures.
- Manage match results.
- Correct imported data.
- Override incorrect or delayed external API data.

System admin capabilities are separate from league admin capabilities.

## 14. MVP Scope

The MVP should include:

- Public landing page.
- Google authentication.
- Editable user profile with display name, avatar, and favorite country/team.
- League creation.
- League joining by invite link and invite code.
- Membership in multiple leagues.
- League admin controls: remove members, transfer admin, open/close invitations.
- System admin panel for tournaments, fixtures, and results.
- Available tournament catalog.
- League admin tournament activation.
- League-tournament rule defaults and customization.
- Match outcome predictions.
- Configurable scoring for correct outcome predictions.
- Configurable extra predictions.
- Prediction editing until match start.
- Hidden predictions until lock time.
- League tournament ranking.
- League historical accumulated ranking.

## 15. Future Versions

Future versions may include:

- Notifications and match prediction reminders.
- League chat or comments.
- More advanced scoring modes, such as exact score predictions.
- More advanced extra prediction types.
- Richer public tournament pages.
- Audit history for admin changes.
- Advanced analytics for users and leagues.
- Multiple authentication providers if needed.

## 16. Success Criteria

The MVP is successful if:

- A user can sign in with Google and create a profile.
- A user can create a private league and invite friends.
- A user can join a league using either a link or code.
- A league admin can activate an available tournament.
- A league admin can configure tournament rules from defaults.
- Users can submit predictions before match lock time.
- Predictions remain hidden until editing closes.
- Rankings update correctly within the league.
- Historical league ranking is preserved across tournaments.
- A system admin can manage fixtures and results without direct database access.

## 17. Open Questions

- Which external football data provider should be used first?
- What exact extra prediction types should ship in the MVP?
- Should league admins be able to remove members after a tournament has started?
- How should historical rankings handle rule changes across tournaments?
- What timezone should be the default display timezone for match locks?
