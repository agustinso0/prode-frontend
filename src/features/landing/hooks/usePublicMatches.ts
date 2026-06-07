import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { matchPublicDtoSchema } from '../../../shared/schemas/match';
import { publicMatchDtos } from '../api/tournamentMocks';
import { toMatchPreview, type MatchPreview } from '../api/viewModels';

export const publicMatchesQueryKey = ['landing', 'publicMatches'] as const;

export function usePublicMatches(): UseQueryResult<MatchPreview[]> {
  return useQuery({
    queryKey: publicMatchesQueryKey,
    queryFn: () => {
      const now = Date.now();

      return publicMatchDtos
        .map((match) => matchPublicDtoSchema.parse(match))
        .filter(
          (match) =>
            match.status !== 'completed' &&
            new Date(match.kickoff).getTime() > now,
        )
        .sort(
          (first, second) =>
            new Date(first.kickoff).getTime() -
            new Date(second.kickoff).getTime(),
        )
        .map(toMatchPreview);
    },
  });
}
