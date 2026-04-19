'use client'

import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

interface Props {
    children: string
    className?: string
    isStreaming?: boolean
}

function closeUnclosedFences(raw: string): string {
    const matches = raw.match(/```/g)
    const count = matches ? matches.length : 0
    return count % 2 === 1 ? raw + '\n```' : raw
}

function extractLang(className: string | undefined): string | undefined {
    if (!className) return undefined
    const match = className.match(/language-(\w+)/)
    return match ? match[1] : undefined
}

function StreamingMarkdownImpl({ children, className, isStreaming = false }: Props) {
    const safeMarkdown = useMemo(() => closeUnclosedFences(children), [children])

    return (
        <div
            className={cn(
                'chat-prose text-[15px] leading-[1.72] text-foreground',
                '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
                isStreaming && 'chat-stream-caret',
                className
            )}
            style={{ contain: 'layout style' }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                            className="text-foreground underline underline-offset-[3px] decoration-foreground/30 transition-colors hover:decoration-foreground"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    em: ({ children }) => <em className="italic">{children}</em>,
                    h1: ({ children }) => (
                        <h1 className="mt-6 mb-3 font-heading text-2xl font-semibold tracking-tight">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="mt-6 mb-3 font-heading text-xl font-semibold tracking-tight">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mt-5 mb-2 font-heading text-lg font-semibold tracking-tight">{children}</h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="mt-4 mb-2 font-heading text-base font-semibold">{children}</h4>
                    ),
                    ul: ({ children }) => (
                        <ul className="mb-4 list-disc space-y-1.5 pl-6 marker:text-muted-foreground">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-4 list-decimal space-y-1.5 pl-6 marker:text-muted-foreground">{children}</ol>
                    ),
                    li: ({ children }) => <li className="leading-[1.65]">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="my-4 border-l-2 border-border bg-muted/30 px-4 py-2 italic text-muted-foreground">
                            {children}
                        </blockquote>
                    ),
                    hr: () => <hr className="my-6 border-border" />,
                    table: ({ children }) => (
                        <div className="my-4 overflow-x-auto">
                            <table className="w-full border-collapse text-sm">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
                    tr: ({ children }) => <tr className="border-b border-border/60 last:border-0">{children}</tr>,
                    th: ({ children }) => (
                        <th className="px-3 py-2 text-left font-semibold text-foreground">{children}</th>
                    ),
                    td: ({ children }) => <td className="px-3 py-2 align-top">{children}</td>,
                    code: ({ className: codeClass, children, ...rest }) => {
                        const lang = extractLang(codeClass)
                        const code = String(children).replace(/\n$/, '')

                        if (!lang) {
                            return (
                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.88em]" {...rest}>
                                    {children}
                                </code>
                            )
                        }

                        return <CodeBlock code={code} lang={lang} isStreaming={isStreaming} />
                    },
                    pre: ({ children }) => <>{children}</>,
                }}
            >
                {safeMarkdown}
            </ReactMarkdown>
        </div>
    )
}

export const StreamingMarkdown = memo(StreamingMarkdownImpl)
