import { Button } from '../../../shared/ui/Button';
import { HeroSection } from '../components/HeroSection';
import { MatchPreviewList } from '../components/MatchPreviewList';
import { TournamentPreviewList } from '../components/TournamentPreviewList';
import { usePublicMatches } from '../hooks/usePublicMatches';
import { usePublicTournaments } from '../hooks/usePublicTournaments';

export function LandingPage() {
  const tournamentsQuery = usePublicTournaments();
  const matchesQuery = usePublicMatches();
  const hasPreviewError = tournamentsQuery.isError || matchesQuery.isError;

  function handleRetry() {
    void tournamentsQuery.refetch();
    void matchesQuery.refetch();
  }

  return (
    <main className="min-h-screen bg-[var(--surface-canvas)] px-6 py-16 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl space-y-10">
        <HeroSection />

        {hasPreviewError ? (
          <div
            role="alert"
            className="rounded-[var(--radius-lg)] border border-[var(--accent-danger)] bg-[color-mix(in_srgb,var(--accent-danger)_14%,var(--surface-panel))] p-5"
          >
            <p className="font-semibold">Public previews are unavailable.</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Try again to reload the public tournament and match previews.
            </p>
            <Button
              className="mt-4"
              onClick={handleRetry}
              size="sm"
              variant="ghost"
            >
              Retry
            </Button>
          </div>
        ) : null}

        <TournamentPreviewList
          isLoading={tournamentsQuery.isLoading}
          tournaments={tournamentsQuery.data ?? []}
        />
        <MatchPreviewList
          isLoading={matchesQuery.isLoading}
          matches={matchesQuery.data ?? []}
        />
      </div>
    </main>
  );
}
