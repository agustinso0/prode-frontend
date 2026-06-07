import { type MatchPreview } from '../api/viewModels';

interface MatchPreviewListProps {
  isLoading: boolean;
  matches: MatchPreview[];
}

export function MatchPreviewList({
  isLoading,
  matches,
}: MatchPreviewListProps) {
  return (
    <section aria-labelledby="upcoming-matches" className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-live)]">
          Matchday watchlist
        </p>
        <h2 id="upcoming-matches" className="mt-2 text-3xl font-bold">
          Upcoming matches
        </h2>
      </div>

      {isLoading ? <MatchSkeletons /> : null}
      {!isLoading && matches.length === 0 ? <MatchEmptyState /> : null}
      {!isLoading && matches.length > 0 ? (
        <ol className="space-y-3">
          {matches.map((match) => (
            <li
              key={match.id}
              className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--accent-primary)]">
                    {match.kickoff}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {match.stage}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  {match.tournamentName}
                </span>
              </div>
              <a
                href={`#${match.tournamentId}-${match.id}`}
                className="mt-4 inline-flex rounded-[var(--radius-md)] text-sm font-semibold text-[var(--accent-live)] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-live)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] hover:underline"
              >
                View {match.homeTeam} vs {match.awayTeam}
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function MatchSkeletons() {
  return (
    <div aria-label="Loading matches" className="space-y-3">
      <p className="sr-only">Loading matches</p>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          aria-label="Loading match preview"
          className="min-h-24 animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-panel-strong)]"
        />
      ))}
    </div>
  );
}

function MatchEmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-panel)] p-6 text-[var(--text-secondary)]">
      No upcoming matches are scheduled yet.
    </div>
  );
}
