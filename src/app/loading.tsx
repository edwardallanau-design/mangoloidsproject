export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo skeleton */}
        <div className="flex justify-center">
          <div className="h-20 w-20 animate-pulse rounded-lg bg-primary/10" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4 text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-primary/10" />
          <div className="mx-auto h-6 w-64 animate-pulse rounded bg-primary/5" />
        </div>

        {/* Button skeleton */}
        <div className="flex gap-3 justify-center">
          <div className="h-12 w-32 animate-pulse rounded-lg bg-primary/10" />
          <div className="h-12 w-32 animate-pulse rounded-lg bg-primary/5" />
        </div>
      </div>
    </div>
  );
}
