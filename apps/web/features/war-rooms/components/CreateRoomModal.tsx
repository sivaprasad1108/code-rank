'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/Button'

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust']

const TOGGLE_SETTINGS = [
  'Enable Spectators',
  'Enable Chat',
  'Allow Rematch',
  'Enable Solution Sharing',
  'Lock Language Selection',
]

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-accent' : 'bg-bg-surface border-border'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{children}</label>
}

function SelectRow({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`h-9 rounded-lg text-sm font-medium border transition-all ${
              value === opt
                ? 'bg-accent/15 border-accent/40 text-accent'
                : 'bg-bg-surface border-border text-text-muted hover:border-border-strong hover:text-text-primary'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter()
  const [name, setName]             = useState('')
  const [description, setDesc]      = useState('')
  const [mode, setMode]             = useState('Battle')
  const [difficulty, setDifficulty] = useState('Medium')
  const [timer, setTimer]           = useState('30 min')
  const [visibility, setVis]        = useState('Public')
  const [maxPlayers, setMax]        = useState(4)
  const [languages, setLanguages]   = useState<string[]>(['Python', 'JavaScript'])
  const [toggles, setToggles]       = useState([true, true, true, false, false])

  function toggleLang(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    )
  }

  function handleCreate() {
    router.push('/war-rooms/demo-room')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create War Room"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" onClick={handleCreate}>Create Room</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Room name */}
        <div>
          <FieldLabel>Room Name</FieldLabel>
          <input
            type="text"
            placeholder="e.g. Algorithm Duel #42"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <FieldLabel>Description <span className="text-text-subtle normal-case font-normal">(optional)</span></FieldLabel>
          <textarea
            rows={2}
            placeholder="What's the vibe of this room?"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2.5 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors resize-none"
          />
        </div>

        {/* Mode */}
        <SelectRow label="Mode" value={mode} options={['Practice', 'Battle']} onChange={setMode} />

        {/* Difficulty */}
        <SelectRow label="Difficulty" value={difficulty} options={['Easy', 'Medium', 'Hard', 'Mixed']} onChange={setDifficulty} />

        {/* Timer */}
        <SelectRow label="Timer" value={timer} options={['15 min', '30 min', '45 min', '60 min']} onChange={setTimer} />

        {/* Visibility + Max Players */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SelectRow label="Visibility" value={visibility} options={['Public', 'Private']} onChange={setVis} />

          <div>
            <FieldLabel>Max Players <span className="text-text-subtle normal-case font-normal">({maxPlayers})</span></FieldLabel>
            <div className="flex items-center gap-3 h-9">
              <span className="text-xs text-text-subtle">2</span>
              <input
                type="range" min={2} max={6} value={maxPlayers}
                onChange={(e) => setMax(Number(e.target.value))}
                className="flex-1 accent-[var(--color-accent)]"
              />
              <span className="text-xs text-text-subtle">6</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div>
          <FieldLabel>Languages</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const selected = languages.includes(lang)
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLang(lang)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'bg-bg-surface border-border text-text-muted hover:border-border-strong'
                  }`}
                >
                  {selected && <Check size={11} />}
                  {lang}
                </button>
              )
            })}
          </div>
        </div>

        {/* Advanced settings */}
        <div>
          <FieldLabel>Advanced Settings</FieldLabel>
          <div className="space-y-3 bg-bg-surface rounded-lg border border-border p-4">
            {TOGGLE_SETTINGS.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{label}</span>
                <ToggleSwitch
                  checked={toggles[i]}
                  onChange={() => setToggles((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
