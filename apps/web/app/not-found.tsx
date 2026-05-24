import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center space-y-6 px-4">
        <p className="text-8xl font-bold text-gradient select-none">404</p>
        <h1 className="text-2xl font-semibold text-text-primary">Page not found</h1>
        <p className="text-text-muted max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium glow hover:bg-accent-hover transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
