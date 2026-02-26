export default function RosterPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Guild Roster</h1>
        <p className="text-lg text-foreground/70">
          Meet the legendary members of our guild.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-6"
          >
            <div className="h-12 w-12 rounded-full bg-primary/20" />
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-primary/20" />
              <div className="h-3 w-32 rounded bg-primary/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
