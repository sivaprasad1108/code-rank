'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Clock, FolderOpen, Zap, ChevronRight, FileCode, X, Trash2, BookmarkPlus, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/Skeleton'
import { useEditorStore } from '../store/editor.store'
import { useRecents } from '../hooks/useRecents'
import { useCollections } from '../hooks/useCollections'

export function PlaygroundSidebar() {
  const [search, setSearch]               = useState('')
  const [collectionsOpen, setCollectionsOpen] = useState(true)
  const [expandedCol, setExpandedCol]     = useState<string | null>(null)
  const [newColName, setNewColName]       = useState('')
  const [creatingCol, setCreatingCol]     = useState(false)
  const [proCardDismissed, setProCardDismissed] = useState(false)
  const [editingId, setEditingId]               = useState<string | null>(null)
  const [editingTitle, setEditingTitle]         = useState('')
  const [editingColItem, setEditingColItem]     = useState<{ colId: string; itemId: string } | null>(null)
  const [editingColItemTitle, setEditingColItemTitle] = useState('')
  const [colNameError, setColNameError]         = useState('')
  useEffect(() => {
    if (localStorage.getItem('coderank_pro_dismissed') === '1') setProCardDismissed(true)
  }, [])

  // Editor state
  const code     = useEditorStore((s) => s.code)
  const language = useEditorStore((s) => s.language)
  const setCode     = useEditorStore((s) => s.setCode)
  const setLanguage = useEditorStore((s) => s.setLanguage)

  // Recents
  const { recents, isLoading: recentsLoading, removeRecent, updateRecent } = useRecents()

  // Collections
  const { collections, isLoading: collectionsLoading, createCollection, deleteCollection, addToCollection, removeFromCollection, updateCollectionItem } = useCollections()

  const filtered = recents.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.language.toLowerCase().includes(search.toLowerCase()),
  )

  function loadItem(itemCode: string, itemLanguage: string) {
    setLanguage(itemLanguage)
    setCode(itemCode)
  }

  function handleCreateCollection() {
    if (!newColName.trim()) return
    const duplicate = collections.some(
      (c) => c.name.toLowerCase() === newColName.trim().toLowerCase(),
    )
    if (duplicate) {
      setColNameError('Name already exists')
      return
    }
    createCollection(newColName)
    setNewColName('')
    setCreatingCol(false)
    setColNameError('')
  }

  return (
    <aside className="flex flex-col h-full w-full bg-bg-surface border-r border-border overflow-hidden">

      {/* New Snippet */}
      <div className="px-3 py-3 border-b border-border shrink-0">
        <button
          onClick={() => { setCode(''); }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-border text-text-muted text-sm font-medium hover:border-border-strong hover:text-text-primary hover:bg-bg-hover transition-all group"
        >
          <Plus size={14} className="text-accent group-hover:rotate-90 transition-transform duration-[var(--duration-fast)]" />
          New Snippet
        </button>
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

      {/* Scrollable content — two independent scroll areas */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">

        {/* Recent — capped height, own scroll */}
        <div className="flex flex-col px-3 py-2 max-h-[45%]">
          <div className="flex items-center gap-1.5 px-1 mb-1 shrink-0">
            <Clock size={10} className="text-text-subtle" />
            <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wider">Recent</span>
          </div>

          <div className="flex flex-col gap-0.5 overflow-y-auto scrollbar-none">
            {recentsLoading ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2.5 px-2.5 py-2" style={{ animationDelay: `${i * 120}ms` }}>
                  <Skeleton className="w-3 h-3 rounded shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <Skeleton className="h-2.5 rounded" style={{ width: `${55 + i * 12}%` }} />
                    <Skeleton className="h-2 w-1/4 rounded" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {filtered.length === 0 && (
                  <p className="text-[10px] text-text-subtle px-2.5 py-2">
                    {recents.length === 0 ? 'Run some code to see history' : 'No results'}
                  </p>
                )}
                {filtered.map((item) => (
              <div key={item.id} className="group flex items-center gap-1 rounded-lg hover:bg-bg-hover transition-colors">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2.5 flex-1 px-2.5 py-2 min-w-0">
                    <FileCode size={12} className="shrink-0 text-text-subtle" />
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const t = editingTitle.trim()
                          const dup = recents.some((r) => r.id !== item.id && r.title.toLowerCase() === t.toLowerCase())
                          if (t && !dup) updateRecent(item.id, t)
                          setEditingId(null)
                        }
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      onBlur={() => {
                        const t = editingTitle.trim()
                        const dup = recents.some((r) => r.id !== item.id && r.title.toLowerCase() === t.toLowerCase())
                        if (t && !dup) updateRecent(item.id, t)
                        setEditingId(null)
                      }}
                      className="flex-1 min-w-0 bg-bg-input border border-accent/50 rounded px-1.5 py-0.5 text-xs text-text-primary outline-none"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => loadItem(item.code, item.language)}
                    className="flex items-center gap-2.5 flex-1 px-2.5 py-2 text-text-muted hover:text-text-primary min-w-0"
                  >
                    <FileCode size={12} className="shrink-0 text-text-subtle" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                      <p className="text-[10px] text-text-subtle capitalize">{item.language}</p>
                    </div>
                  </button>
                )}
                {editingId !== item.id && (
                  <>
                    <button
                      onClick={() => { setEditingId(item.id); setEditingTitle(item.title) }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-subtle hover:text-accent transition-all"
                      title="Rename"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => removeRecent(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded text-text-subtle hover:text-error transition-all"
                    >
                      <X size={13} />
                    </button>
                  </>
                )}
              </div>
            ))}
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 my-1 h-px bg-border shrink-0" />

        {/* Collections — takes remaining space, own scroll */}
        <div className="flex flex-col flex-1 min-h-0 px-3 py-2">
          <div className="flex items-center gap-1.5 px-1 mb-1 shrink-0">
            <button
              onClick={() => setCollectionsOpen(!collectionsOpen)}
              className="flex items-center gap-1.5 flex-1 group"
            >
              <FolderOpen size={13} className="text-text-subtle" />
              <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-wider flex-1 text-left">
                Collections
              </span>
              <ChevronRight
                size={13}
                className={cn(
                  'text-text-subtle transition-transform duration-[var(--duration-fast)]',
                  collectionsOpen && 'rotate-90',
                )}
              />
            </button>
            <button
              onClick={() => setCreatingCol(true)}
              className="p-1 rounded text-text-subtle hover:text-accent transition-colors"
              title="New collection"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* New collection input */}
          {creatingCol && (
            <div className="flex flex-col gap-1 mb-1.5 shrink-0">
              <div className="flex gap-1">
                <input
                  autoFocus
                  value={newColName}
                  onChange={(e) => { setNewColName(e.target.value); setColNameError('') }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateCollection()
                    if (e.key === 'Escape') { setCreatingCol(false); setNewColName(''); setColNameError('') }
                  }}
                  placeholder="Collection name…"
                  className={cn(
                    'flex-1 bg-bg-input rounded-md px-2 py-1 text-xs text-text-primary placeholder:text-text-subtle outline-none border',
                    colNameError ? 'border-error/60' : 'border-accent/50',
                  )}
                />
                <button
                  onClick={handleCreateCollection}
                  className="px-2 py-1 rounded-md bg-accent text-white text-xs hover:bg-accent-hover transition-colors"
                >
                  Add
                </button>
              </div>
              {colNameError && (
                <p className="text-[10px] text-error px-0.5">{colNameError}</p>
              )}
            </div>
          )}

          {collectionsOpen && (
            <div className="flex flex-col gap-0.5 overflow-y-auto scrollbar-none flex-1 min-h-0">
              {collectionsLoading ? (
                [0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-2" style={{ animationDelay: `${i * 150}ms` }}>
                    <Skeleton className="w-3 h-3 rounded shrink-0" />
                    <Skeleton className="flex-1 h-2.5 rounded" style={{ width: `${60 + i * 15}%` }} />
                    <Skeleton className="w-4 h-2 rounded ml-auto" />
                  </div>
                ))
              ) : (
                <>
                  {collections.length === 0 && !creatingCol && (
                    <p className="text-[10px] text-text-subtle px-2.5 py-2">No collections yet</p>
                  )}
              {collections.map((col) => (
                <div key={col.id}>
                  {/* Collection header */}
                  <div className="group flex items-center gap-1 rounded-lg hover:bg-bg-hover transition-colors">
                    <button
                      onClick={() => setExpandedCol(expandedCol === col.id ? null : col.id)}
                      className="flex items-center gap-2 flex-1 px-2.5 py-2 text-text-muted hover:text-text-primary min-w-0"
                    >
                      <FolderOpen size={12} className="shrink-0 text-text-subtle" />
                      <span className="flex-1 text-xs truncate text-left">{col.name}</span>
                      <span className="text-[10px] text-text-subtle">{col.items.length}</span>
                    </button>
                    {/* Add current code to this collection */}
                    <button
                      onClick={() => {
                        const recentTitle = recents.find(
                          (r) => r.language === language && r.code.trim() === code.trim()
                        )?.title
                        addToCollection(col.id, language, code, recentTitle)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-subtle hover:text-accent transition-all"
                      title="Save current code here"
                    >
                      <BookmarkPlus size={13} />
                    </button>
                    {/* Delete collection */}
                    <button
                      onClick={() => deleteCollection(col.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded text-text-subtle hover:text-error transition-all"
                      title="Delete collection"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Collection items */}
                  {expandedCol === col.id && (
                    <div className="ml-4 flex flex-col gap-0.5 mb-1">
                      {col.items.length === 0 && (
                        <p className="text-[10px] text-text-subtle px-2.5 py-1.5">Empty — hover collection and click bookmark to add</p>
                      )}
                      {col.items.map((item) => (
                        <div key={item.id} className="group flex items-center gap-1 rounded-lg hover:bg-bg-hover transition-colors">
                          {editingColItem?.colId === col.id && editingColItem?.itemId === item.id ? (
                            <div className="flex items-center gap-2 flex-1 px-2.5 py-1.5 min-w-0">
                              <FileCode size={11} className="shrink-0 text-text-subtle" />
                              <input
                                autoFocus
                                value={editingColItemTitle}
                                onChange={(e) => setEditingColItemTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const t = editingColItemTitle.trim()
                                    const dup = col.items.some((i) => i.id !== item.id && i.title.toLowerCase() === t.toLowerCase())
                                    if (t && !dup) updateCollectionItem(col.id, item.id, t)
                                    setEditingColItem(null)
                                  }
                                  if (e.key === 'Escape') setEditingColItem(null)
                                }}
                                onBlur={() => {
                                  const t = editingColItemTitle.trim()
                                  const dup = col.items.some((i) => i.id !== item.id && i.title.toLowerCase() === t.toLowerCase())
                                  if (t && !dup) updateCollectionItem(col.id, item.id, t)
                                  setEditingColItem(null)
                                }}
                                className="flex-1 min-w-0 bg-bg-input border border-accent/50 rounded px-1.5 py-0.5 text-xs text-text-primary outline-none"
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => loadItem(item.code, item.language)}
                              className="flex items-center gap-2 flex-1 px-2.5 py-1.5 text-text-muted hover:text-text-primary min-w-0"
                            >
                              <FileCode size={11} className="shrink-0 text-text-subtle" />
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs truncate">{item.title}</p>
                                <p className="text-[10px] text-text-subtle capitalize">{item.language}</p>
                              </div>
                            </button>
                          )}
                          {!(editingColItem?.colId === col.id && editingColItem?.itemId === item.id) && (
                            <>
                              <button
                                onClick={() => { setEditingColItem({ colId: col.id, itemId: item.id }); setEditingColItemTitle(item.title) }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-subtle hover:text-accent transition-all"
                                title="Rename"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => removeFromCollection(col.id, item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded text-text-subtle hover:text-error transition-all"
                              >
                                <X size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pro upgrade card — temporarily hidden
      {!proCardDismissed && (
        <div className="mx-3 mb-3 shrink-0">
          <div className="relative rounded-xl bg-accent/10 border border-accent/20 p-3.5 flex flex-col gap-2.5">
            <button
              onClick={() => { localStorage.setItem('coderank_pro_dismissed', '1'); setProCardDismissed(true) }}
              className="absolute top-2.5 right-2.5 text-text-subtle hover:text-text-primary transition-colors"
            >
              <X size={12} />
            </button>
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
      )}
      */}
    </aside>
  )
}
