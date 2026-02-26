export default function VideosLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-40 animate-pulse rounded bg-primary/10" />
        <div className="h-6 w-96 animate-pulse rounded bg-primary/5" />
      </div>

      {/* Grid of video skeletons */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="space-y-3 overflow-hidden rounded-lg border border-primary/10 animate-pulse"
          >
            <div className="aspect-video w-full bg-primary/10" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-24 rounded bg-primary/10" />
              <div className="h-3 w-full rounded bg-primary/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
