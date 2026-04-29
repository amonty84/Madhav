export interface PredictionDetectionResult {
  detected: boolean
  horizon?: string
  confidence?: number
}

const MONTH_NAMES = 'january|february|march|april|may|june|july|august|september|october|november|december'

const PATTERNS: Array<{ re: RegExp; extractHorizon?: (m: RegExpMatchArray) => string }> = [
  // "by March 2025", "by 2026", "by next year"
  {
    re: new RegExp(`\\bby\\s+(?:(?:${MONTH_NAMES})\\s+)?(?:20\\d{2}|next\\s+\\w+)`, 'i'),
    extractHorizon: m => m[0].replace(/^by\s+/i, '').trim(),
  },
  // "in the next 3 months", "in the next 2 weeks"
  {
    re: /\bin\s+the\s+next\s+\d+\s+(?:days?|weeks?|months?|years?)/i,
    extractHorizon: m => m[0].trim(),
  },
  // "before June 2025", "before the end of this year"
  {
    re: new RegExp(`\\bbefore\\s+(?:(?:${MONTH_NAMES})\\s+)?(?:20\\d{2}|the\\s+end\\s+of\\s+this\\s+year)`, 'i'),
    extractHorizon: m => m[0].replace(/^before\s+/i, '').trim(),
  },
  // "during Saturn dasha", "during Rahu antardasha"
  {
    re: /\bduring\s+\w+\s+(?:maha)?dasha\b/i,
    extractHorizon: m => m[0].replace(/^during\s+/i, '').trim(),
  },
  // "Mars dasha will …"
  {
    re: /\b\w+\s+dasha\s+will\b/i,
    extractHorizon: m => m[0].replace(/\s+will$/i, '').trim(),
  },
  // "in 2025", "in 2026"
  {
    re: /\bin\s+(20\d{2})\b/i,
    extractHorizon: m => m[1],
  },
  // "within the next N months/years"
  {
    re: /\bwithin\s+the\s+next\s+\d+\s+(?:months?|years?)/i,
    extractHorizon: m => m[0].trim(),
  },
]

export function detectPrediction(text: string): PredictionDetectionResult {
  for (const { re, extractHorizon } of PATTERNS) {
    const match = text.match(re)
    if (match) {
      return {
        detected: true,
        horizon: extractHorizon ? extractHorizon(match) : undefined,
        confidence: 0.7,
      }
    }
  }
  return { detected: false }
}
