import { Github } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ENDPOINTS } from '@/lib/api/endpoints'

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-subtle">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button variant="secondary" size="md" asChild>
        <a href={ENDPOINTS.AUTH.GITHUB} className="flex items-center gap-2">
          <Github size={18} />
          Continue with GitHub
        </a>
      </Button>
    </div>
  )
}
