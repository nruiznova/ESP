import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="text-center">
        <span className="text-display text-[10rem] text-cream/5 leading-none block select-none">
          404
        </span>
        <h1 className="text-display text-5xl text-cream -mt-8 mb-4">Page Not Found</h1>
        <span className="accent-line mx-auto mb-6" style={{ display: "block", margin: "0 auto 1.5rem" }} />
        <p className="text-muted mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-red text-white font-semibold uppercase tracking-widest text-sm hover:bg-red-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
