/**
 * BHISMA-B1 §3.4 — DeepSeek R1 think-block helpers.
 *
 * R1 (`deepseek-reasoner`) prepends its chain-of-thought inside
 * <think>...</think> blocks. The streaming separation is handled by AI SDK's
 * `extractReasoningMiddleware` (wired in resolver.ts) — that middleware
 * routes <think> content into the `reasoning` stream-part channel and keeps
 * the text-delta channel clean. These helpers are post-process safety nets
 * for cases where (a) middleware is bypassed, or (b) the trace panel needs
 * a snapshot of the reasoning trace from the final text.
 */

/** Strip every `<think>…</think>` block from a final text. */
export function stripThinkBlocks(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trimStart()
}

/** Pull the reasoning content out of the original text so the trace panel
 *  can surface it separately. Returns the cleaned answer text alongside
 *  the joined reasoning blocks. */
export function extractReasoningTrace(text: string): { reasoning: string; answer: string } {
  const blocks: string[] = []
  const re = /<think>([\s\S]*?)<\/think>/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    blocks.push(match[1].trim())
  }
  return {
    reasoning: blocks.join('\n\n'),
    answer: stripThinkBlocks(text),
  }
}
