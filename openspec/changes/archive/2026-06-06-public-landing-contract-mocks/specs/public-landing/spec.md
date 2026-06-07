# Public Landing Delta Specification

## ADDED Requirements

### Requirement: Landing Page UI Composition

The landing page MUST render a hero section, a tournament preview list section, and a match preview list section composed together. The page MUST use the feature-owned query hooks to populate these sections.

#### Scenario: Landing page renders all sections

- GIVEN the landing page is loaded
- WHEN the page renders
- THEN the hero section, tournament preview list, and match preview list are all visible

#### Scenario: Landing page handles loading state

- GIVEN the landing page query hooks are in loading state
- WHEN the page renders
- THEN loading skeletons are shown for each section without crashing

#### Scenario: Landing page handles empty data

- GIVEN the landing page query hooks return empty arrays
- WHEN the page renders
- THEN empty state messages are shown for each section without crashing

#### Scenario: Landing page handles error state

- GIVEN the landing page query hooks encounter an error
- WHEN the page renders
- THEN a retryable error message is shown without exposing private details

### Requirement: Primary Call to Action

The landing page MUST expose `Create a league` as the primary visible action. This CTA MUST be keyboard-reachable and have a visible focus state.

#### Scenario: Primary CTA is visible and accessible

- GIVEN the landing page renders
- WHEN a keyboard user tabs to the primary CTA
- THEN the focus state is visible
- AND the accessible name is "Create a league"

### Requirement: No Emoji in Public Landing

The landing page MUST NOT render any emoji characters in text, labels, or accessible names.

#### Scenario: Emoji audit passes

- GIVEN the landing page is fully rendered
- WHEN the page text content is scanned for emoji
- THEN no emoji characters are found

## MODIFIED Requirements

### Requirement: Public Tournament and Match Preview

The landing page MUST show only active or upcoming tournaments and upcoming matches from all available tournaments. It MUST NOT expose private league data, rankings, members, or predictions.

#### Scenario: Active and upcoming tournaments are visible

- GIVEN tournament data contains active, upcoming, completed, and archived tournaments
- WHEN the landing page renders tournament previews
- THEN only active and upcoming tournaments are shown

#### Scenario: Upcoming matches span tournaments

- GIVEN multiple active or upcoming tournaments have future matches
- WHEN the match preview renders
- THEN upcoming matches across those tournaments are listed by kickoff order
- AND completed or private league-scoped matches are excluded
