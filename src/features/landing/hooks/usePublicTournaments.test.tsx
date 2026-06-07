import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';

import { createTestQueryClient } from '../../../test/renderWithProviders';
import {
  publicTournamentsQueryKey,
  usePublicTournaments,
} from './usePublicTournaments';

describe('usePublicTournaments', () => {
  it('uses the stable public tournaments query key', () => {
    expect(publicTournamentsQueryKey).toEqual(['landing', 'publicTournaments']);
  });

  it('returns only active and upcoming tournament previews', async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePublicTournaments(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.map((tournament) => tournament.name)).toEqual([
      'World Cup 2026',
      'Club World Cup 2026',
    ]);
    expect(
      result.current.data?.every((tournament) =>
        ['Active', 'Upcoming'].includes(tournament.statusLabel),
      ),
    ).toBe(true);
  });
});
