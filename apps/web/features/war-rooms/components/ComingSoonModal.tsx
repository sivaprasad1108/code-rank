'use client'

import { useState } from 'react'
import { Swords, FlaskConical, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'

interface ComingSoonModalProps {
  isOpen: boolean
  onContinue: () => void
  onClose: () => void
}

export function ComingSoonModal({ isOpen, onContinue, onClose }: ComingSoonModalProps) {
  const [dontShow, setDontShow] = useState(false)

  if (!isOpen) return null

  function handleContinue() {
    if (dontShow) {
      localStorage.setItem('war-rooms-preview-acknowledged', '1')
    }
    onContinue()
  }

  function handleClose() {
    if (dontShow) {
      localStorage.setItem('war-rooms-preview-acknowledged', '1')
    }
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full max-w-lg glass rounded-2xl shadow-2xl border border-border',
          'animate-slide-up overflow-hidden',
        )}
      >
        {/* Purple glow top bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 h-7 w-7 rounded-md flex items-center justify-center text-text-subtle hover:text-text-primary hover:bg-bg-hover transition-colors z-10"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Content */}
        <div className="px-8 pt-8 pb-6">
          {/* Icon + badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shadow-glow-sm">
              <Swords size={20} className="text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text-primary">War Rooms</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest bg-warning/10 text-warning border border-warning/25">
                  <FlaskConical size={9} />
                  COMING SOON
                </span>
              </div>
              <p className="text-xs text-text-subtle mt-0.5">Design Preview</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-5" />

          {/* Body text */}
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              War Rooms is currently in active development.
            </p>
            <p>
              The current experience is a <span className="text-text-primary font-medium">design preview</span> intended
              to showcase the planned user interface and overall product direction. Interactive
              functionality, real-time collaboration, battle mechanics, matchmaking, and backend
              integrations are not yet implemented.
            </p>
            <p>
              The final version will deliver a fully functional collaborative coding and competitive
              programming experience built on a production-grade architecture.
            </p>
            <p className="text-text-subtle text-xs pt-1">
              Thank you for exploring this early preview while development continues.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mt-6 mb-5" />

          {/* Don't show again */}
          <label className="flex items-center gap-2.5 cursor-pointer group mb-6 w-fit">
            <div
              onClick={() => setDontShow((v) => !v)}
              className={cn(
                'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all',
                dontShow
                  ? 'bg-accent border-accent'
                  : 'bg-transparent border-border-strong group-hover:border-accent/60',
              )}
            >
              {dontShow && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors select-none">
              Don't show this again
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleContinue}
            >
              Continue to Preview
              <ArrowRight size={14} />
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
