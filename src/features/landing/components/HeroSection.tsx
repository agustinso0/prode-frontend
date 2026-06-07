import { Button } from '../../../shared/ui/Button';

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent-live)_18%,transparent),transparent_34%),var(--surface-panel)] p-8 shadow-[var(--shadow-panel)] sm:p-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-live)]">
          Prode public preview
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Run your tournament predictions before kickoff.
          </h1>
          <p className="text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
            Launch a league for friends, follow public tournaments, and keep the
            next matchday visible before predictions open.
          </p>
        </div>
        <Button>Create a league</Button>
      </div>

      <aside
        aria-label="Landing highlights"
        className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel-strong)_82%,transparent)] p-5"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Next up
        </p>
        <p className="mt-3 text-2xl font-bold">World Cup 2026</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Public tournament and match contracts are ready for the landing page.
        </p>
      </aside>
    </section>
  );
}
