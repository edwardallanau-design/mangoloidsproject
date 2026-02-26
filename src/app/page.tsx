export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="rounded-lg bg-primary/10 p-6">
            <div className="text-6xl">⚔️</div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Something Epic is Coming
          </h1>
          <p className="text-xl text-foreground/70">
            We&apos;re building something extraordinary. Get ready to join the guild.
          </p>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <div className="inline-flex rounded-lg bg-accent/10 px-4 py-2">
            <span className="text-sm font-semibold text-accent">
              🚀 Coming Soon
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">
            The guild awaits your arrival. Stay tuned for updates.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50">
              Notify Me
            </button>
            <button className="rounded-lg border border-primary/30 px-6 py-3 font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
