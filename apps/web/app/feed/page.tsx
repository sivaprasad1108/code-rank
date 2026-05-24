import { PageLayout } from '@/components/layout/PageLayout'
import { FeedList } from '@/features/feed'

export const metadata = {
  title: 'Explore Snippets — CodeRank',
  description: 'Browse runnable code snippets shared by the developer community.',
}

export default function FeedPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <FeedList />
      </div>
    </PageLayout>
  )
}
