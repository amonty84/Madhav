'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/components/shared/ChatMessage'
import { PyramidStatusPanel } from './PyramidStatusPanel'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface LayerEntry {
  layer: string
  sublayer: string
  status: 'not_started' | 'in_progress' | 'complete'
}

interface Props {
  chartId: string
  initialLayers: LayerEntry[]
}

export function BuildChat({ chartId, initialLayers }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [layers, setLayers] = useState<LayerEntry[]>(initialLayers)
  const bottomRef = useRef<HTMLDivElement>(null)

  const refreshLayers = useCallback(async () => {
    try {
      const res = await fetch(`/api/pyramid?chartId=${chartId}`)
      if (res.ok) {
        const data = await res.json()
        setLayers(data)
      }
    } catch {
      // silently ignore — stale panel is acceptable
    }
  }, [chartId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch('/api/chat/build', {
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
      refreshLayers()
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              Start building the data pyramid. Ask Claude to generate L1 facts or any layer.
            </p>
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
            placeholder="Ask Claude to build a layer..."
            disabled={isStreaming}
            className="flex-1"
          />
          <Button type="submit" disabled={isStreaming || !input.trim()}>
            {isStreaming ? '…' : 'Send'}
          </Button>
        </form>
      </div>

      <PyramidStatusPanel layers={layers} />
    </div>
  )
}
