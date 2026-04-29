export function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="Thinking">
      <span className="block size-2 animate-[chat-dot_1.2s_ease-in-out_infinite] rounded-full bg-foreground/50 [animation-delay:-0.32s]" />
      <span className="block size-2 animate-[chat-dot_1.2s_ease-in-out_infinite] rounded-full bg-foreground/50 [animation-delay:-0.16s]" />
      <span className="block size-2 animate-[chat-dot_1.2s_ease-in-out_infinite] rounded-full bg-foreground/50" />
    </span>
  )
}

export function StreamingCaret() {
  return (
    <span
      className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-[chat-caret_1s_steps(1)_infinite] bg-foreground/80 align-baseline"
      aria-hidden="true"
    />
  )
}
