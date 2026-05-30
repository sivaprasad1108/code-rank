'use client'

import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_CHAT, type ChatMessage } from '../../data/mock'

const REACTIONS = ['🔥', '⚡', '🚀', '👏', '💯']

function ChatEntry({ msg }: { msg: ChatMessage }) {
  if (msg.type === 'system') return (
    <div className="text-center py-1">
      <span className="text-[10px] text-text-subtle bg-bg-elevated border border-border/50 px-2.5 py-0.5 rounded-full">
        {msg.content}
      </span>
    </div>
  )

  if (msg.type === 'achievement') return (
    <div className="flex items-center gap-2 py-1 px-3 mx-1 rounded-lg bg-accent/5 border border-accent/15">
      <span className="text-accent text-[10px] font-medium">{msg.content}</span>
      <span className="ml-auto text-[9px] text-text-subtle">{msg.time}</span>
    </div>
  )

  return (
    <div className="flex items-start gap-2 px-3 py-1.5">
      <Avatar name={msg.author ?? '?'} size="xs" className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold text-accent">{msg.author}</span>
          <span className="text-[9px] text-text-subtle">{msg.time}</span>
        </div>
        <p className="text-xs text-text-muted mt-0.5 break-words">{msg.content}</p>
      </div>
    </div>
  )
}

export function LiveChat() {
  const [message, setMsg] = useState('')

  return (
    <div className="flex flex-col border-t border-border">
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
        <MessageCircle size={13} className="text-text-muted" />
        <span className="text-xs font-semibold text-text-primary">Live Chat</span>
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto py-2 space-y-1">
        {MOCK_CHAT.map((msg) => <ChatEntry key={msg.id} msg={msg} />)}
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-border/50">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            className="w-8 h-8 rounded-lg text-base hover:bg-bg-elevated border border-transparent hover:border-border transition-all hover:scale-110"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 pb-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Say something..."
          className="flex-1 h-8 px-3 bg-bg-surface border border-border rounded-lg text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors"
        />
        <button className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center hover:bg-accent/25 transition-colors text-accent">
          <Send size={12} />
        </button>
      </div>
    </div>
  )
}
