import { type MatchPublicDto } from '../../../shared/schemas/match';
import { type TournamentPublicDto } from '../../../shared/schemas/tournament';

export function buildTournamentDto(
  overrides: Partial<TournamentPublicDto> = {},
): TournamentPublicDto {
  return {
    id: 'world-cup-2026',
    name: 'World Cup 2026',
    status: 'upcoming',
    startDate: '2026-06-11T00:00:00.000Z',
    endDate: '2026-07-19T00:00:00.000Z',
    matchCount: 104,
    teamsCount: 48,
    ...overrides,
  };
}

export function buildMatchDto(
  overrides: Partial<MatchPublicDto> = {},
): MatchPublicDto {
  return {
    id: 'world-cup-2026-opener',
    tournamentId: 'world-cup-2026',
    tournamentName: 'World Cup 2026',
    homeTeam: 'Mexico',
    awayTeam: 'Canada',
    kickoff: '2026-06-11T21:00:00.000Z',
    status: 'scheduled',
    stage: 'Group stage',
    ...overrides,
  };
}

export const publicTournamentDtos = [
  buildTournamentDto(),
  buildTournamentDto({
    id: 'club-world-cup-2026',
    name: 'Club World Cup 2026',
    status: 'active',
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: '2026-06-29T00:00:00.000Z',
    matchCount: 63,
    teamsCount: 32,
  }),
  buildTournamentDto({
    id: 'copa-america-2024',
    name: 'Copa America 2024',
    status: 'completed',
    startDate: '2024-06-20T00:00:00.000Z',
    endDate: '2024-07-14T00:00:00.000Z',
    matchCount: 32,
    teamsCount: 16,
  }),
  buildTournamentDto({
    id: 'legacy-private-league',
    name: 'Legacy Private League',
    status: 'archived',
    startDate: '2023-06-01T00:00:00.000Z',
    endDate: '2023-07-01T00:00:00.000Z',
    matchCount: 16,
    teamsCount: 8,
  }),
];

export const publicMatchDtos = [
  buildMatchDto(),
  buildMatchDto({
    id: 'club-world-cup-2026-opener',
    tournamentId: 'club-world-cup-2026',
    tournamentName: 'Club World Cup 2026',
    homeTeam: 'Real Madrid',
    awayTeam: 'Seattle Sounders',
    kickoff: '2026-06-13T20:00:00.000Z',
    stage: 'Group stage',
  }),
  buildMatchDto({
    id: 'copa-america-2024-final',
    tournamentId: 'copa-america-2024',
    tournamentName: 'Copa America 2024',
    homeTeam: 'Argentina',
    awayTeam: 'Colombia',
    kickoff: '2024-07-15T00:00:00.000Z',
    status: 'completed',
    stage: 'Final',
  }),
];
