import { describe, expect, it } from 'vitest';

import { buildMatchDto, buildTournamentDto } from './tournamentMocks';
import { toMatchPreview, toTournamentPreview } from './viewModels';

describe('landing view model transformations', () => {
  it('formats tournament public DTOs for landing preview display', () => {
    const preview = toTournamentPreview(
      buildTournamentDto({
        status: 'active',
        startDate: '2026-06-11T00:00:00.000Z',
        endDate: '2026-07-19T00:00:00.000Z',
      }),
    );

    expect(preview).toEqual({
      id: 'world-cup-2026',
      name: 'World Cup 2026',
      statusLabel: 'Active',
      startDate: 'Jun 11, 2026',
      endDate: 'Jul 19, 2026',
      matchCount: 104,
      teamsCount: 48,
    });
  });

  it('formats match public DTOs for landing preview display', () => {
    const preview = toMatchPreview(
      buildMatchDto({ kickoff: '2026-06-11T21:00:00.000Z' }),
    );

    expect(preview).toEqual({
      id: 'world-cup-2026-opener',
      tournamentId: 'world-cup-2026',
      tournamentName: 'World Cup 2026',
      homeTeam: 'Mexico',
      awayTeam: 'Canada',
      kickoff: 'Jun 11, 2026, 9:00 PM UTC',
      stage: 'Group stage',
    });
  });
});
