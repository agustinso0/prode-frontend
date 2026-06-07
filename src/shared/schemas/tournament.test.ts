import { describe, expect, it } from 'vitest';

import { tournamentPublicDtoSchema } from './tournament';

const validTournament = {
  id: 'world-cup-2026',
  name: 'World Cup 2026',
  status: 'upcoming',
  startDate: '2026-06-11T00:00:00.000Z',
  endDate: '2026-07-19T00:00:00.000Z',
  matchCount: 104,
  teamsCount: 48,
};

describe('tournamentPublicDtoSchema', () => {
  it('parses a valid World Cup 2026-style tournament DTO', () => {
    const parsed = tournamentPublicDtoSchema.parse(validTournament);

    expect(parsed).toEqual(validTournament);
  });

  it('rejects invalid public tournament DTO values before UI use', () => {
    const invalidTournament = {
      ...validTournament,
      id: '',
      status: 'private',
      startDate: 'June 11, 2026',
    };

    expect(tournamentPublicDtoSchema.safeParse(invalidTournament).success).toBe(
      false,
    );
  });
});
