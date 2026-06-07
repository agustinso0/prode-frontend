import { describe, expect, it } from 'vitest';

import { matchPublicDtoSchema } from './match';

const validMatch = {
  id: 'world-cup-2026-opener',
  tournamentId: 'world-cup-2026',
  tournamentName: 'World Cup 2026',
  homeTeam: 'Mexico',
  awayTeam: 'Canada',
  kickoff: '2026-06-11T21:00:00.000Z',
  status: 'scheduled',
  stage: 'Group stage',
};

describe('matchPublicDtoSchema', () => {
  it('parses a valid World Cup 2026-style match DTO', () => {
    const parsed = matchPublicDtoSchema.parse(validMatch);

    expect(parsed).toEqual(validMatch);
  });

  it('rejects invalid public match DTO values before UI use', () => {
    const invalidMatch = {
      ...validMatch,
      id: '',
      homeTeam: '',
      kickoff: 'June 11 at night',
      status: 'postponed',
    };

    expect(matchPublicDtoSchema.safeParse(invalidMatch).success).toBe(false);
  });
});
