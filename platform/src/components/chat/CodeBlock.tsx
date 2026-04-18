'use client'

import { useEffect, useState, memo } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { getHighlighter, normalizeLang } from '@/lib/shiki'
import type { ThemedToken } from 'shiki/bundle/web'

interface Props {
  code: string
  lang?: string
  className?: string
  // Skip syntax highlighting while the parent message is streaming. Shiki
  // tokenization on every incoming character is the dominant TTLR cost; we
  // fall back to a plain <pre> until the stream completes, then highlight once.
  isStreaming?: boolean
}

interface Tokens {
  lines: ThemedToken[][]
  bg: string
  fg: string
}

function CodeBlockImpl({ code, lang, className, isStreaming = false }: Props) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'
  const [tokens, setTokens] = useState<Tokens | null>(null)
  const [copied, setCopied] = useState(false)
  const normalizedLang = normalizeLang(lang)

  useEffect(() => {
    if (isStreaming) return
    let cancelled = false
    getHighlighter().then(hl => {
      if (cancelled) return
      const tryLang = (language: string) =>
        hl.codeToTokens(code, {
          lang: language as Parameters<typeof hl.codeToTokens>[1]['lang'],
          theme,
        })
      try {
        const result = tryLang(normalizedLang)
        setTokens({ lines: result.tokens, bg: result.bg ?? '', fg: result.fg ?? '' })
      } catch {
        const result = tryLang('text')
        setTokens({ lines: result.tokens, bg: result.bg ?? '', fg: result.fg ?? '' })
      }
    })
    return () => {
      cancelled = true
    }
  }, [code, normalizedLang, theme, isStreaming])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <div className={cn('group/code relative my-4 overflow-hidden rounded-lg border bg-muted/40', className)}>
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {normalizedLang === 'text' ? 'code' : normalizedLang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="m-0 overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
        style={tokens ? { background: 'transparent', color: tokens.fg } : undefined}
      >
        <code>
          {tokens
            ? tokens.lines.map((line, i) => (
                <span key={i} className="block">
                  {line.length === 0 ? '\n' : line.map((token, j) => (
                    <span key={j} style={{ color: token.color }}>
                      {token.content}
                    </span>
                  ))}
                </span>
              ))
            : code}
        </code>
      </pre>
    </div>
  )
}

export const CodeBlock = memo(CodeBlockImpl)
