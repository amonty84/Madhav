'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/components/shared/ChatMessage'
import { ReportLibrary } from './ReportLibrary'
import { ReportReader } from './ReportReader'
import type { Report } from '@/lib/supabase/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const DOMAIN_SUGGESTIONS = ['Finance', 'Career', 'Health', 'Relationships', 'Timing 2027']

interface Props {
  chartId: string
  reports: Report[]
}

export function ConsumeChat({ chartId, reports }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch('/api/chat/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartId, messages: nextMessages }),
      })

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => res.statusText)
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: `Error: ${errText}` }
          return copy
        })
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            role: 'assistant',
            content: copy[copy.length - 1].content + chunk,
          }
          return copy
        })
      }
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: `Error: ${String(err)}` }
        return copy
      })
    } finally {
      setIsStreaming(false)
    }
  }, [chartId, messages, isStreaming])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await handleSend(input)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-1 overflow-hidden">
      <ReportLibrary
        reports={reports}
        selectedDomain={selectedDomain}
        onSelect={d => setSelectedDomain(prev => prev === d ? null : d)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedDomain && (
          <ReportReader
            chartId={chartId}
            domain={selectedDomain}
            onClose={() => setSelectedDomain(null)}
          />
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-muted-foreground">
                Ask about any aspect of the chart.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {DOMAIN_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(`Tell me about ${s}`)}
                    className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    Ask about {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about career, finance, timing…"
            disabled={isStreaming}
            className="flex-1"
          />
          <Button type="submit" disabled={isStreaming || !input.trim()}>
            {isStreaming ? '…' : 'Ask'}
          </Button>
        </form>
      </div>
    </div>
  )
}
