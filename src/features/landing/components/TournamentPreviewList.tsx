import { type TournamentPreview } from '../api/viewModels';

interface TournamentPreviewListProps {
  isLoading: boolean;
  tournaments: TournamentPreview[];
}

export function TournamentPreviewList({
  isLoading,
  tournaments,
}: TournamentPreviewListProps) {
  return (
    <section aria-labelledby="available-tournaments" className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-live)]">
            Public tournaments
          </p>
          <h2 id="available-tournaments" className="mt-2 text-3xl font-bold">
            Available tournaments
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          Browse active and upcoming tournaments without exposing private league
          predictions or member data.
        </p>
      </div>

      {isLoading ? <TournamentSkeletons /> : null}
      {!isLoading && tournaments.length === 0 ? <TournamentEmptyState /> : null}
      {!isLoading && tournaments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tournaments.map((tournament) => (
            <article
              key={tournament.id}
              className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-panel)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold">{tournament.name}</h3>
                <span className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-success)]">
                  {tournament.statusLabel}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
                <div>
                  <dt className="font-semibold text-[var(--text-primary)]">
                    Dates
                  </dt>
                  <dd>
                    {tournament.startDate} to {tournament.endDate}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--text-primary)]">
                    Field
                  </dt>
                  <dd>
                    {tournament.teamsCount} teams, {tournament.matchCount}{' '}
                    matches
                  </dd>
                </div>
              </dl>
              <a
                href={`#${tournament.id}`}
                className="mt-5 inline-flex rounded-[var(--radius-md)] text-sm font-semibold text-[var(--accent-live)] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-live)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] hover:underline"
              >
                View {tournament.name}
              </a>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TournamentSkeletons() {
  return (
    <div aria-label="Loading tournaments" className="grid gap-4 md:grid-cols-3">
      <p className="sr-only">Loading tournaments</p>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          aria-label="Loading tournament preview"
          className="min-h-40 animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-panel-strong)]"
        />
      ))}
    </div>
  );
}

function TournamentEmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-panel)] p-6 text-[var(--text-secondary)]">
      No public tournaments are available yet.
    </div>
  );
}
