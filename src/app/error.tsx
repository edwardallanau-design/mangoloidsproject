'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="max-w-md space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-lg bg-accent/10 p-6 opacity-50">
            <Image
              src="/mangoloids-logo.png"
              alt="Error"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-lg text-foreground/70">
            We encountered an unexpected error. Our team has been notified.
          </p>
          {error.message && (
            <p className="rounded-lg bg-accent/5 p-3 text-sm text-foreground/60 font-mono">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-primary/30 px-6 py-3 font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
