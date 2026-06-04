export interface LanguageRunner {
  /** Matches the id in LANGUAGES frontend config */
  readonly id: string
  /** Docker image to use */
  readonly dockerImage: string
  /** Source file extension */
  readonly fileExtension: string
  /** Build the shell command array to compile and/or run the code file */
  buildRunCommand(codePath: string): string[]
  /** Optional static validation before submitting to Docker */
  validateCode?(code: string): { valid: boolean; error?: string }
  /**
   * Wrap user code with a driver harness that:
   *   1. reads stdin as JSON-encoded lines (one arg per line)
   *   2. auto-detects and calls the user's function
   *   3. prints the return value to stdout
   *
   * Returns null when auto-driver is not applicable (e.g. code already
   * has explicit print/log calls, or no function is detected, or the
   * language needs a full main() anyway).
   */
  wrapWithDriver?(code: string, args: unknown[]): string | null
}
