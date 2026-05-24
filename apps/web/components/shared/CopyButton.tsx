'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'icon-sm' : 'icon'}
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      className={cn('transition-colors', copied && 'text-success', className)}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  )
}
