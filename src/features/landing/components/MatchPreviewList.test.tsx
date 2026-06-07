import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../test/renderWithProviders';
import { MatchPreviewList } from './MatchPreviewList';

const matches = [
  {
    id: 'world-cup-2026-opener',
    tournamentId: 'world-cup-2026',
    tournamentName: 'World Cup 2026',
    homeTeam: 'Mexico',
    awayTeam: 'Canada',
    kickoff: 'Jun 11, 2026, 9:00 PM UTC',
    stage: 'Group stage',
  },
  {
    id: 'club-world-cup-2026-opener',
    tournamentId: 'club-world-cup-2026',
    tournamentName: 'Club World Cup 2026',
    homeTeam: 'Real Madrid',
    awayTeam: 'Seattle Sounders',
    kickoff: 'Jun 13, 2026, 8:00 PM UTC',
    stage: 'Group stage',
  },
];

describe('MatchPreviewList', () => {
  it('renders loading skeletons while matches load', () => {
    renderWithProviders(<MatchPreviewList isLoading matches={[]} />);

    expect(screen.getByText(/loading matches/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/loading match preview/i)).toHaveLength(3);
  });

  it('renders an empty state when there are no upcoming matches', () => {
    renderWithProviders(<MatchPreviewList isLoading={false} matches={[]} />);

    expect(
      screen.getByText(/no upcoming matches are scheduled yet/i),
    ).toBeInTheDocument();
  });

  it('renders ordered match previews with kickoff, teams, and tournament badges', () => {
    renderWithProviders(
      <MatchPreviewList isLoading={false} matches={matches} />,
    );

    expect(
      screen.getByRole('heading', { name: /upcoming matches/i }),
    ).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Mexico');
    expect(listItems[0]).toHaveTextContent('Canada');
    expect(listItems[0]).toHaveTextContent('World Cup 2026');
    expect(listItems[0]).toHaveTextContent('Jun 11, 2026, 9:00 PM UTC');
    expect(listItems[1]).toHaveTextContent('Real Madrid');
    expect(
      screen.getByRole('link', { name: /view mexico vs canada/i }),
    ).toBeInTheDocument();
  });
});
