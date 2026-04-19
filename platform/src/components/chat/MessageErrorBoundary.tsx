'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  messageId: string
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Isolates render errors to a single message bubble so one broken message
 * cannot unmount the whole conversation. Errors here used to bubble up to
 * app/error.tsx, which would wipe the in-memory chat state.
 */
export class MessageErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
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
            <p className="font-medium">This message couldn’t render.</p>
            <p className="mt-0.5 text-destructive/80">
              {this.state.error.message || 'Unknown render error.'}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="mt-1 rounded-md border border-destructive/40 px-2 py-0.5 text-[11px] hover:bg-destructive/20"
            >
              Retry render
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
