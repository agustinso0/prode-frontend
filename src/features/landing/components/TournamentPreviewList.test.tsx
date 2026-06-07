import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../test/renderWithProviders';
import { TournamentPreviewList } from './TournamentPreviewList';

const tournaments = [
  {
    id: 'world-cup-2026',
    name: 'World Cup 2026',
    statusLabel: 'Upcoming',
    startDate: 'Jun 11, 2026',
    endDate: 'Jul 19, 2026',
    matchCount: 104,
    teamsCount: 48,
  },
  {
    id: 'club-world-cup-2026',
    name: 'Club World Cup 2026',
    statusLabel: 'Active',
    startDate: 'Jun 1, 2026',
    endDate: 'Jun 29, 2026',
    matchCount: 63,
    teamsCount: 32,
  },
];

describe('TournamentPreviewList', () => {
  it('renders loading skeletons while tournaments load', () => {
    renderWithProviders(<TournamentPreviewList isLoading tournaments={[]} />);

    expect(screen.getByText(/loading tournaments/i)).toBeInTheDocument();
    expect(
      screen.getAllByLabelText(/loading tournament preview/i),
    ).toHaveLength(3);
  });

  it('renders an empty state when there are no public tournaments', () => {
    renderWithProviders(
      <TournamentPreviewList isLoading={false} tournaments={[]} />,
    );

    expect(
      screen.getByText(/no public tournaments are available yet/i),
    ).toBeInTheDocument();
  });

  it('renders public tournament cards with status labels and preview links', () => {
    renderWithProviders(
      <TournamentPreviewList isLoading={false} tournaments={tournaments} />,
    );

    expect(
      screen.getByRole('heading', { name: /available tournaments/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^world cup 2026$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /club world cup 2026/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /view world cup 2026/i }),
    ).toBeInTheDocument();
  });
});
