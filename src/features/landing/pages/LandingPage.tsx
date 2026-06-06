export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-canvas)] px-6 py-16 text-[var(--text-primary)]">
      <section className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-8 shadow-[var(--shadow-panel)] sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-live)]">
          Prode
        </p>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Tournament predictions for private leagues.
          </h1>
          <p className="text-lg leading-8 text-[var(--text-secondary)]">
            Frontend foundation is ready. Product features will be built on top
            of this Vite, React, TypeScript, and Tailwind setup.
          </p>
        </div>
      </section>
    </main>
  );
}
