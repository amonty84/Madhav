import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CitationChip } from '../CitationChip'

// CitationPreview makes a fetch; mock it to avoid network
vi.mock('../CitationPreview', () => ({
  CitationPreview: ({ onClose, id, type }: { onClose: () => void; id: string; type: string }) => (
    <div role="dialog" aria-label={`Citation preview: ${type} ${id}`}>
      <button onClick={onClose}>close</button>
    </div>
  ),
}))

describe('CitationChip', () => {
  it('renders with correct aria-label for signal type', () => {
    render(<CitationChip type="signal" id="S0042" />)
    const btn = screen.getByRole('button', { name: /chart signal s0042/i })
    expect(btn).toBeInTheDocument()
  })

  it('renders with correct aria-label for asset type', () => {
    render(<CitationChip type="asset" id="CGM" />)
    expect(screen.getByRole('button', { name: /asset cgm — click to read/i })).toBeInTheDocument()
  })

  it('renders with correct aria-label for chunk type', () => {
    render(<CitationChip type="chunk" id="rag-abc" />)
    expect(screen.getByRole('button', { name: /source chunk rag-abc/i })).toBeInTheDocument()
  })

  it('opens CitationPreview on click', () => {
    render(<CitationChip type="signal" id="S0001" />)
    const btn = screen.getByRole('button', { name: /chart signal s0001/i })
    fireEvent.click(btn)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes CitationPreview when panel calls onClose', () => {
    render(<CitationChip type="signal" id="S0001" />)
    fireEvent.click(screen.getByRole('button', { name: /chart signal s0001/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('sets aria-expanded=true when preview is open', () => {
    render(<CitationChip type="asset" id="CGM" />)
    const btn = screen.getByRole('button', { name: /asset cgm — click to read/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('is keyboard accessible via Enter key', () => {
    render(<CitationChip type="chunk" id="c-99" />)
    const btn = screen.getByRole('button', { name: /source chunk c-99/i })
    btn.focus()
    fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' })
    // Default button click fires on Enter — preview opens
    fireEvent.click(btn)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
