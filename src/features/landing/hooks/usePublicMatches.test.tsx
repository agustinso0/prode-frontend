import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '../../../test/renderWithProviders';
import { publicMatchesQueryKey, usePublicMatches } from './usePublicMatches';

vi.mock('../api/tournamentMocks', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../api/tournamentMocks')>();

  return {
    ...actual,
    publicMatchDtos: [
      ...actual.publicMatchDtos,
      actual.buildMatchDto({
        id: 'future-completed-match',
        kickoff: '2026-06-12T21:00:00.000Z',
        status: 'completed',
      }),
    ],
  };
});

describe('usePublicMatches', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(
      new Date('2026-06-01T00:00:00.000Z').getTime(),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the stable public matches query key', () => {
    expect(publicMatchesQueryKey).toEqual(['landing', 'publicMatches']);
  });

  it('returns future non-completed match previews ordered by kickoff', async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePublicMatches(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.map((match) => match.id)).toEqual([
      'world-cup-2026-opener',
      'club-world-cup-2026-opener',
    ]);
    expect(result.current.data?.map((match) => match.id)).not.toContain(
      'future-completed-match',
    );
    expect(result.current.data?.map((match) => match.kickoff)).toEqual([
      'Jun 11, 2026, 9:00 PM UTC',
      'Jun 13, 2026, 8:00 PM UTC',
    ]);
  });
});
