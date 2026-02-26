export default function RecruitmentLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-40 animate-pulse rounded bg-primary/10" />
        <div className="h-6 w-96 animate-pulse rounded bg-primary/5" />
      </div>

      {/* Form skeleton */}
      <div className="mx-auto max-w-2xl space-y-6 rounded-lg border border-primary/10 bg-primary/5 p-8 animate-pulse">
        {/* Name field */}
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-primary/10" />
          <div className="h-10 w-full rounded-lg bg-primary/10" />
        </div>

        {/* Role field */}
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-primary/10" />
          <div className="h-10 w-full rounded-lg bg-primary/10" />
        </div>

        {/* Message field */}
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-primary/10" />
          <div className="h-32 w-full rounded-lg bg-primary/10" />
        </div>

        {/* Submit button */}
        <div className="h-12 w-full rounded-lg bg-primary/20" />
      </div>
    </div>
  );
}
