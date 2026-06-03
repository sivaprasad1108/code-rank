'use client'

import { useState } from 'react'
import { Copy, Check, MessageCircle, Linkedin, Twitter, Send, Mail, Lock } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import type { Snippet } from '@coderank/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  snippet: Snippet
}

const PLATFORMS = [
  {
    label: 'WhatsApp',
    Icon: MessageCircle,
    cls: 'text-[#25D366] border-[#25D366]/20 bg-[#25D366]/8 hover:bg-[#25D366]/15',
    href: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
  },
  {
    label: 'LinkedIn',
    Icon: Linkedin,
    cls: 'text-[#0A66C2] border-[#0A66C2]/20 bg-[#0A66C2]/8 hover:bg-[#0A66C2]/15',
    href: (url: string) =>
      `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: 'X',
    Icon: Twitter,
    cls: 'text-text-primary border-border bg-bg-overlay hover:bg-bg-hover',
    href: (url: string, title: string, language: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} — ${language} snippet on @CodeRank`)}`,
  },
  {
    label: 'Telegram',
    Icon: Send,
    cls: 'text-[#229ED9] border-[#229ED9]/20 bg-[#229ED9]/8 hover:bg-[#229ED9]/15',
    href: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: 'Email',
    Icon: Mail,
    cls: 'text-text-muted border-border bg-bg-overlay hover:bg-bg-hover',
    href: (url: string, title: string, language: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this ${language} snippet on CodeRank:\n${url}`)}`,
  },
]

export function ShareModal({ isOpen, onClose, snippet }: Props) {
  const [copied, setCopied] = useState(false)

  const snippetUrl = typeof window !== 'undefined' ? window.location.href : ''

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippetUrl)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = snippetUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Snippet" size="md">
      <div className="flex flex-col gap-5">
        {/* URL copy */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
            Snippet URL
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg bg-bg-input border border-border text-xs text-text-muted font-code truncate min-w-0">
              {snippetUrl}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all shadow-glow-sm whitespace-nowrap shrink-0"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Social share */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
            Share via
          </span>
          <div className="grid grid-cols-5 gap-2">
            {PLATFORMS.map(({ label, Icon, cls, href }) => (
              <a
                key={label}
                href={href(snippetUrl, snippet.title, snippet.language)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${cls}`}
              >
                <Icon size={18} />
                <span className="text-[9px] font-medium text-center leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Pro promo */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-accent/8 border border-accent/15">
          <Lock size={13} className="text-accent shrink-0" />
          <p className="text-[11px] text-text-muted leading-relaxed">
            <span className="font-semibold text-accent">CodeRank Pro:</span>{' '}
            Share private snippets with password protection and custom expiry links.
          </p>
        </div>
      </div>
    </Modal>
  )
}
