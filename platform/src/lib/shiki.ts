import type { Highlighter } from 'shiki/bundle/web'

let highlighterPromise: Promise<Highlighter> | null = null

const LANGS = [
  'ts', 'tsx', 'js', 'jsx', 'json', 'bash', 'shell',
  'python', 'sql', 'css', 'html', 'md', 'yaml',
] as const

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki/bundle/web')
      .then(({ createHighlighter }) =>
        createHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: LANGS as unknown as string[],
        })
      )
      .catch(err => {
        // Clear the cache so a later call can retry instead of inheriting
        // a permanently-rejected promise.
        highlighterPromise = null
        throw err
      })
  }
  return highlighterPromise
}

export function normalizeLang(lang: string | undefined): string {
  if (!lang) return 'text'
  const normalized = lang.toLowerCase()
  if (normalized === 'javascript') return 'js'
  if (normalized === 'typescript') return 'ts'
  if (normalized === 'sh' || normalized === 'zsh') return 'bash'
  if (normalized === 'yml') return 'yaml'
  if ((LANGS as readonly string[]).includes(normalized)) return normalized
  return 'text'
}
