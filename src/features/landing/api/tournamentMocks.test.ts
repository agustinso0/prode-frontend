import { describe, expect, it } from 'vitest';

import { matchPublicDtoSchema } from '../../../shared/schemas/match';
import { tournamentPublicDtoSchema } from '../../../shared/schemas/tournament';
import { buildMatchDto, buildTournamentDto } from './tournamentMocks';

describe('landing tournament mock builders', () => {
  it('builds parseable World Cup 2026-style tournament and match DTO defaults', () => {
    const tournament = buildTournamentDto();
    const match = buildMatchDto();

    expect(tournamentPublicDtoSchema.parse(tournament)).toMatchObject({
      id: 'world-cup-2026',
      name: 'World Cup 2026',
      status: 'upcoming',
    });
    expect(matchPublicDtoSchema.parse(match)).toMatchObject({
      tournamentId: 'world-cup-2026',
      tournamentName: 'World Cup 2026',
      homeTeam: 'Mexico',
      awayTeam: 'Canada',
    });
  });

  it('applies overrides without breaking schema validation', () => {
    const tournament = buildTournamentDto({
      id: 'custom-cup',
      name: 'Custom Tournament',
      status: 'active',
    });
    const match = buildMatchDto({
      tournamentId: 'custom-cup',
      tournamentName: 'Custom Tournament',
      homeTeam: 'Argentina',
      awayTeam: 'Japan',
    });

    expect(tournamentPublicDtoSchema.parse(tournament)).toMatchObject({
      id: 'custom-cup',
      name: 'Custom Tournament',
      status: 'active',
    });
    expect(matchPublicDtoSchema.parse(match)).toMatchObject({
      tournamentId: 'custom-cup',
      tournamentName: 'Custom Tournament',
      homeTeam: 'Argentina',
      awayTeam: 'Japan',
    });
  });
});
