import { PageLayout } from '@/components/layout/PageLayout'
import { FeedList } from '@/features/feed'

export const metadata = {
  title: 'Snippets — CodeRank',
  description: 'Browse runnable code snippets shared by the developer community.',
}

export default function FeedPage() {
  return (
    <PageLayout>
      {/* Page header */}
      <div className="border-b border-border bg-bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-1">
            Snippets
          </h1>
          <p className="text-sm text-text-muted">
            Runnable code snippets shared by the community
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <FeedList />
      </div>
    </PageLayout>
  )
}
