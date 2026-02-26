import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="max-w-md space-y-8 text-center">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="rounded-lg bg-primary/10 p-6">
            <Image
              src="/mangoloids-logo.png"
              alt="Not Found"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* 404 Message */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="text-xl text-foreground/70">Page Not Found</p>
          <p className="text-base text-foreground/60">
            The path you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Back Home
          </Link>
          <Link
            href="/roster"
            className="rounded-lg border border-primary/30 px-6 py-3 font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            View Roster
          </Link>
        </div>
      </div>
    </div>
  );
}
