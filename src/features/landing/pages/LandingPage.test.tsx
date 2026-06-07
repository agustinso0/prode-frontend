import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../test/renderWithProviders';
import { LandingPage } from './LandingPage';

import type { QueryObserverResult } from '@tanstack/react-query';
import type { MatchPreview, TournamentPreview } from '../api/viewModels';

interface QueryMock<T> {
  data: T;
  isError: boolean;
  isLoading: boolean;
  refetch: () => Promise<unknown>;
}

const mockUsePublicTournaments = vi.fn<() => QueryMock<TournamentPreview[]>>();
const mockUsePublicMatches = vi.fn<() => QueryMock<MatchPreview[]>>();

vi.mock('../hooks/usePublicTournaments', () => ({
  usePublicTournaments: () => mockUsePublicTournaments(),
}));

vi.mock('../hooks/usePublicMatches', () => ({
  usePublicMatches: () => mockUsePublicMatches(),
}));

const tournament: TournamentPreview = {
  id: 'world-cup-2026',
  name: 'World Cup 2026',
  statusLabel: 'Upcoming',
  startDate: 'Jun 11, 2026',
  endDate: 'Jul 19, 2026',
  matchCount: 104,
  teamsCount: 48,
};

const match: MatchPreview = {
  id: 'world-cup-2026-opener',
  tournamentId: 'world-cup-2026',
  tournamentName: 'World Cup 2026',
  homeTeam: 'Mexico',
  awayTeam: 'Canada',
  kickoff: 'Jun 11, 2026, 9:00 PM UTC',
  stage: 'Group stage',
};

function setHookState({
  isError = false,
  isLoading = false,
  matches = [match],
  refetchTournaments = vi.fn(() =>
    Promise.resolve({} as QueryObserverResult<TournamentPreview[]>),
  ),
  refetchMatches = vi.fn(() =>
    Promise.resolve({} as QueryObserverResult<MatchPreview[]>),
  ),
  tournaments = [tournament],
}: {
  isError?: boolean;
  isLoading?: boolean;
  matches?: MatchPreview[];
  refetchMatches?: QueryMock<MatchPreview[]>['refetch'];
  refetchTournaments?: QueryMock<TournamentPreview[]>['refetch'];
  tournaments?: TournamentPreview[];
} = {}) {
  mockUsePublicTournaments.mockReturnValue({
    data: tournaments,
    isError,
    isLoading,
    refetch: refetchTournaments,
  });
  mockUsePublicMatches.mockReturnValue({
    data: matches,
    isError,
    isLoading,
    refetch: refetchMatches,
  });
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setHookState();
  });

  it('renders the hero, tournament preview, and match preview sections', () => {
    renderWithProviders(<LandingPage />);

    expect(
      screen.getByRole('heading', {
        name: /run your tournament predictions before kickoff/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /available tournaments/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /upcoming matches/i }),
    ).toBeInTheDocument();
  });

  it('shows section loading states before data is available', () => {
    setHookState({ isLoading: true, matches: [], tournaments: [] });

    renderWithProviders(<LandingPage />);

    expect(screen.getByText(/loading tournaments/i)).toBeInTheDocument();
    expect(screen.getByText(/loading matches/i)).toBeInTheDocument();
  });

  it('shows empty states when public data is empty', () => {
    setHookState({ matches: [], tournaments: [] });

    renderWithProviders(<LandingPage />);

    expect(
      screen.getByText(/no public tournaments are available yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no upcoming matches are scheduled yet/i),
    ).toBeInTheDocument();
  });

  it('shows a retryable public error state without private details', async () => {
    const user = userEvent.setup();
    const retryTournaments = vi.fn(() =>
      Promise.resolve({} as QueryObserverResult<TournamentPreview[]>),
    );
    const retryMatches = vi.fn(() =>
      Promise.resolve({} as QueryObserverResult<MatchPreview[]>),
    );
    mockUsePublicTournaments.mockReturnValue({
      data: [],
      isError: true,
      isLoading: false,
      refetch: retryTournaments,
    });
    mockUsePublicMatches.mockReturnValue({
      data: [],
      isError: true,
      isLoading: false,
      refetch: retryMatches,
    });

    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /public previews are unavailable/i,
    );
    expect(screen.getByRole('alert')).not.toHaveTextContent(
      /token|private|league members/i,
    );

    await user.click(screen.getByRole('button', { name: /retry/i }));

    expect(retryTournaments).toHaveBeenCalledTimes(1);
    expect(retryMatches).toHaveBeenCalledTimes(1);
  });

  it('renders public landing text without emoji characters', () => {
    const emojiPattern = /\p{Extended_Pictographic}/u;
    const { container } = renderWithProviders(<LandingPage />);

    expect(container.textContent).not.toMatch(emojiPattern);
  });

  it('moves keyboard focus through CTA and preview links in logical order', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LandingPage />);

    await user.tab();
    expect(
      screen.getByRole('button', { name: /create a league/i }),
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('link', { name: /view world cup 2026/i }),
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('link', { name: /view mexico vs canada/i }),
    ).toHaveFocus();
  });
});
