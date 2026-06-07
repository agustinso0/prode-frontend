import { z } from 'zod';

export const matchPublicDtoSchema = z.object({
  id: z.string().min(1),
  tournamentId: z.string().min(1),
  tournamentName: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  kickoff: z.iso.datetime(),
  status: z.enum(['scheduled', 'live', 'completed']),
  stage: z.string().min(1),
});

export type MatchPublicDto = z.infer<typeof matchPublicDtoSchema>;
