import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RasiChartSVG } from '@/components/charts/RasiChartSVG'
import type { ForensicChart } from '@/lib/forensic/snapshot'

const ABHISEK_CHART: ForensicChart = {
  chartId: 'test-chart-id',
  lagnaSign: 'Aries',
  lagnaDegreeDms: '12°23′55″',
  houses: [
    { house: 1, sign: 'Aries', planets: [] },
    { house: 2, sign: 'Taurus', planets: ['Rahu'] },
    { house: 3, sign: 'Gemini', planets: [] },
    { house: 4, sign: 'Cancer', planets: [] },
    { house: 5, sign: 'Leo', planets: [] },
    { house: 6, sign: 'Virgo', planets: [] },
    { house: 7, sign: 'Libra', planets: ['Saturn', 'Mars'] },
    { house: 8, sign: 'Scorpio', planets: ['Ketu'] },
    { house: 9, sign: 'Sagittarius', planets: ['Jupiter', 'Venus'] },
    { house: 10, sign: 'Capricorn', planets: ['Sun', 'Mercury'] },
    { house: 11, sign: 'Aquarius', planets: ['Moon'] },
    { house: 12, sign: 'Pisces', planets: [] },
  ],
  topYogas: ['Kalpadruma'],
  currentDasha: { md: 'Mercury', ad: 'Saturn', adEnd: '2027-08-21' },
  isEmpty: false,
}

const EMPTY_CHART: ForensicChart = {
  chartId: 'empty-chart',
  lagnaSign: '',
  lagnaDegreeDms: '',
  houses: [],
  topYogas: [],
  currentDasha: null,
  isEmpty: true,
}

describe('RasiChartSVG', () => {
  it('renders an SVG with role=img', () => {
    const { container } = render(<RasiChartSVG chart={ABHISEK_CHART} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('role')).toBe('img')
  })

  it('aria-label includes Lagna sign and degree', () => {
    const { container } = render(<RasiChartSVG chart={ABHISEK_CHART} />)
    const label = container.querySelector('svg')?.getAttribute('aria-label') ?? ''
    expect(label).toContain('Aries')
    expect(label).toContain('12°23′55″')
  })

  it('aria-label lists planet placements', () => {
    const { container } = render(<RasiChartSVG chart={ABHISEK_CHART} />)
    const label = container.querySelector('svg')?.getAttribute('aria-label') ?? ''
    expect(label).toContain('Moon')
    expect(label).toContain('Aquarius')
    expect(label).toContain('Jupiter')
    expect(label).toContain('Saturn')
  })

  it('renders planet abbreviations in SVG text nodes', () => {
    const { container } = render(<RasiChartSVG chart={ABHISEK_CHART} />)
    const textContent = container.querySelector('svg')?.textContent ?? ''
    expect(textContent).toContain('Mo') // Moon → H11
    expect(textContent).toContain('Ra') // Rahu → H2
    expect(textContent).toContain('Ju') // Jupiter → H9
    expect(textContent).toContain('Sa') // Saturn → H7
  })

  it('renders lagna notch polygon for H1', () => {
    const { container } = render(<RasiChartSVG chart={ABHISEK_CHART} />)
    const polygons = container.querySelectorAll('polygon')
    expect(polygons.length).toBeGreaterThan(0)
  })

  it('renders empty state aria-label when isEmpty', () => {
    const { container } = render(<RasiChartSVG chart={EMPTY_CHART} />)
    const label = container.querySelector('svg')?.getAttribute('aria-label') ?? ''
    expect(label).toContain('L1 facts not yet ingested')
  })

  it('respects custom size prop', () => {
    const { container } = render(<RasiChartSVG chart={ABHISEK_CHART} size={240} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('240')
    expect(svg?.getAttribute('height')).toBe('240')
  })
})
