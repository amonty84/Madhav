'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  messageId: string
  children: ReactNode
}

interface State {
  error: Error | null
  retryKey: number
}

export class MessageErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retryKey: 0 }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[MessageErrorBoundary]', {
      messageId: this.props.messageId,
      error,
      componentStack: info.componentStack,
    })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <p className="font-medium">This message couldn&apos;t render.</p>
            <p className="mt-0.5 text-destructive/80">
              {this.state.error.message || 'Unknown render error.'}
            </p>
            <button
              type="button"
              onClick={() => this.setState(s => ({ error: null, retryKey: s.retryKey + 1 }))}
              className="mt-1 rounded-md border border-destructive/40 px-2 py-0.5 text-[11px] hover:bg-destructive/20"
            >
              Retry render
            </button>
          </div>
        </div>
      )
    }
    return <div key={this.state.retryKey}>{this.props.children}</div>
  }
}
