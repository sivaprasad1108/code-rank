'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Clock, FolderOpen, Zap, ChevronRight, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/config/navigation.config'

const RECENT_SNIPPETS = [
  { title: 'Two Sum',        lang: 'Python',     slug: 'two-sum-abc' },
  { title: 'Binary Search',  lang: 'Python',     slug: 'binary-search-def' },
  { title: 'Fibonacci',      lang: 'JavaScript', slug: 'fibonacci-ghi' },
  { title: 'Reverse String', lang: 'Java',       slug: 'reverse-str-jkl' },
  { title: 'Factorial',      lang: 'C++',        slug: 'factorial-mno' },
]

const COLLECTIONS = [
  { name: 'Algorithms',     count: 12 },
  { name: 'Data Structures', count: 8 },
  { name: 'LeetCode Practice', count: 31 },
]

export function PlaygroundSidebar() {
  const [search, setSearch] = useState('')
  const [collectionsOpen, setCollectionsOpen] = useState(true)

  const filtered = RECENT_SNIPPETS.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <aside className="flex flex-col h-full w-full bg-bg-surface border-r border-border overflow-hidden">

      {/* New Snippet */}
      <div className="px-3 py-3 border-b border-border shrink-0">
        <Link
          href={ROUTES.PLAYGROUND}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-border text-text-muted text-sm font-medium hover:border-border-strong hover:text-text-primary hover:bg-bg-hover transition-all group"
        >
          <Plus size={14} className="text-accent group-hover:rotate-90 transition-transform duration-[var(--duration-fast)]" />
          New Snippet
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-bg-input border border-border text-text-subtle hover:border-border-strong transition-colors">
          <Search size={12} className="shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snippets…"
            className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-subtle outline-none min-w-0"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-1">

        {/* Recent */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-1.5 px-1 mb-1">
            <Clock size={10} className="text-text-subtle" />
            <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wider">Recent</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {filtered.map((snippet) => (
              <Link
                key={snippet.slug}
                href={ROUTES.SNIPPET(snippet.slug)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors group"
              >
                <FileCode size={12} className="shrink-0 text-text-subtle" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{snippet.title}</p>
                  <p className="text-[10px] text-text-subtle">{snippet.lang}</p>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="text-[10px] text-text-subtle px-2.5 py-2">No results</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 my-1 h-px bg-border" />

        {/* Collections */}
        <div className="px-3 py-2">
          <button
            onClick={() => setCollectionsOpen(!collectionsOpen)}
            className="w-full flex items-center gap-1.5 px-1 mb-1 group"
          >
            <FolderOpen size={10} className="text-text-subtle" />
            <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wider flex-1 text-left">
              Collections
            </span>
            <ChevronRight
              size={10}
              className={cn(
                'text-text-subtle transition-transform duration-[var(--duration-fast)]',
                collectionsOpen && 'rotate-90',
              )}
            />
          </button>

          {collectionsOpen && (
            <div className="flex flex-col gap-0.5">
              {COLLECTIONS.map((col) => (
                <button
                  key={col.name}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors w-full text-left group"
                >
                  <FolderOpen size={12} className="shrink-0 text-text-subtle" />
                  <span className="flex-1 text-xs truncate">{col.name}</span>
                  <span className="text-[10px] text-text-subtle">{col.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pro upgrade card */}
      <div className="mx-3 mb-3 shrink-0">
        <div className="rounded-xl bg-accent/10 border border-accent/20 p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
              <Zap size={11} className="text-white fill-white" />
            </div>
            <span className="text-xs font-semibold text-text-primary">CodeRank Pro</span>
          </div>
          <p className="text-[10px] text-text-muted leading-relaxed">
            Private snippets, collections, unlimited history, and more.
          </p>
          <button className="w-full text-center py-1.5 rounded-lg bg-accent hover:bg-accent-hover transition-colors text-white text-xs font-semibold shadow-glow-sm">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  )
}
