import { z } from 'zod';

export const tournamentPublicDtoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['active', 'upcoming', 'completed', 'archived']),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  matchCount: z.number().int().nonnegative(),
  teamsCount: z.number().int().nonnegative(),
});

export type TournamentPublicDto = z.infer<typeof tournamentPublicDtoSchema>;
