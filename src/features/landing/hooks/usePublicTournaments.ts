import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { tournamentPublicDtoSchema } from '../../../shared/schemas/tournament';
import { publicTournamentDtos } from '../api/tournamentMocks';
import { toTournamentPreview, type TournamentPreview } from '../api/viewModels';

export const publicTournamentsQueryKey = [
  'landing',
  'publicTournaments',
] as const;

export function usePublicTournaments(): UseQueryResult<TournamentPreview[]> {
  return useQuery({
    queryKey: publicTournamentsQueryKey,
    queryFn: () => {
      return publicTournamentDtos
        .map((tournament) => tournamentPublicDtoSchema.parse(tournament))
        .filter((tournament) =>
          ['active', 'upcoming'].includes(tournament.status),
        )
        .map(toTournamentPreview);
    },
  });
}
