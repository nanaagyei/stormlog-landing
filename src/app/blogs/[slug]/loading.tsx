/**
 * Article loading skeleton.
 *
 * Deliberately static. DESIGN.md's Reveal-Don't-Perform rule states the system
 * contains no infinite animation, which rules out the usual shimmer or pulse.
 * The tonal ladder carries the placeholder instead: `surface` blocks on the
 * `deep` ground, laid out on the article's real grid so nothing shifts when the
 * content arrives.
 */
export default function Loading() {
  return (
    <div className="relative" role="status" aria-busy="true">
      <span className="sr-only">Loading article…</span>

      <section className="px-4 pt-28 pb-12 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-3 w-28 rounded bg-surface" />
          <div className="mt-6 h-10 w-full max-w-3xl rounded-lg bg-surface" />
          <div className="mt-3 h-10 w-3/5 max-w-2xl rounded-lg bg-surface" />
          <div className="mt-6 flex gap-3">
            <div className="h-3 w-24 rounded bg-surface" />
            <div className="h-3 w-20 rounded bg-surface" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
          <div className="min-w-0 space-y-4">
            <div className="aspect-[16/9] w-full rounded-xl bg-surface" />
            {[
              "w-full", "w-11/12", "w-full", "w-4/5",
              "w-full", "w-10/12", "w-full", "w-3/5",
            ].map((w, i) => (
              <div key={i} className={`h-3.5 rounded bg-surface ${w}`} />
            ))}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-xl border border-white/[0.06] bg-surface p-4">
              <div className="h-3 w-20 rounded bg-surface-2" />
              <div className="mt-4 space-y-3">
                {["w-full", "w-4/5", "w-11/12", "w-3/5", "w-5/6"].map((w, i) => (
                  <div key={i} className={`h-2.5 rounded bg-surface-2 ${w}`} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
