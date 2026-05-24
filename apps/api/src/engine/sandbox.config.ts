/**
 * Centralized Docker sandbox constraints.
 * Every container spawned by the execution engine uses these limits.
 * Never hardcode these values in runner files or worker logic.
 */
export const SANDBOX = {
  memoryLimit:     '128m',
  memorySwap:      '128m',       // disable swap
  cpuQuota:        50_000,        // 50% of one CPU
  cpuPeriod:       100_000,
  timeoutMs:       10_000,
  maxOutputBytes:  1_048_576,    // 1 MB
  maxCodeBytes:    65_536,       // 64 KB
  pidsLimit:       50,
  networkDisabled: true,
  readonlyRootfs:  true,
  tmpfsMount:      '/tmp:size=10m,noexec',
  user:            'nobody',
  capDrop:         ['ALL'],
  securityOpt:     ['no-new-privileges'],
  /** Docker API auto-remove container after exit */
  autoRemove:      true,
} as const
