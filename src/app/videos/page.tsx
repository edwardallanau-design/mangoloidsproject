export default function VideosPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Guild Videos</h1>
        <p className="text-lg text-foreground/70">
          Watch epic moments and highlights from our guild.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="space-y-3 overflow-hidden rounded-lg border border-primary/20"
          >
            <div className="aspect-video w-full bg-primary/10" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-24 rounded bg-primary/20" />
              <div className="h-3 w-full rounded bg-primary/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
