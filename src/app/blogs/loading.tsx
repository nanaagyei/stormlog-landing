/** Blog index skeleton. Static for the same reason as the article skeleton. */
export default function Loading() {
  return (
    <div className="relative" role="status" aria-busy="true">
      <span className="sr-only">Loading articles…</span>
      <section className="px-4 pt-28 pb-12 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-full max-w-3xl rounded-lg bg-surface" />
          <div className="mt-4 h-4 w-2/3 max-w-xl rounded bg-surface" />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-surface"
              >
                <div className="aspect-[16/9] w-full bg-surface-2" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 rounded bg-surface-2" />
                  <div className="h-4 w-11/12 rounded bg-surface-2" />
                  <div className="h-3 w-4/5 rounded bg-surface-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
