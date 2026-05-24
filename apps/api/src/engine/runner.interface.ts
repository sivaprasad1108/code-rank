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
}
