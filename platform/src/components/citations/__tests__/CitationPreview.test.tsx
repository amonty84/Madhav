import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { CitationPreview } from '../CitationPreview'

const mockFetch = vi.fn()

beforeEach(() => {
  global.fetch = mockFetch
})

afterEach(() => {
  vi.restoreAllMocks()
})

function makeFetchOk(data: object) {
  return mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  })
}

function makeFetch404() {
  return mockFetch.mockResolvedValue({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'not found' }),
  })
}

describe('CitationPreview', () => {
  it('renders a dialog with aria-label', async () => {
    makeFetchOk({ title: 'S0042', content: 'Career signal', meta: 'Career · 85% · 70%' })
    render(<CitationPreview type="signal" id="S0042" onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: /citation preview: signal s0042/i })).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {})) // never resolves
    render(<CitationPreview type="signal" id="S0042" onClose={vi.fn()} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders content after successful fetch', async () => {
    makeFetchOk({ title: 'S0042', content: 'Career signal claim text', meta: 'Domain: Career' })
    render(<CitationPreview type="signal" id="S0042" onClose={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Career signal claim text')).toBeInTheDocument())
    expect(screen.getByText('Domain: Career')).toBeInTheDocument()
  })

  it('shows error message on 404', async () => {
    makeFetch404()
    render(<CitationPreview type="signal" id="UNKNOWN" onClose={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/citation not found/i)).toBeInTheDocument())
  })

  it('calls onClose when X button is clicked', async () => {
    makeFetchOk({ title: 'CGM', content: 'Asset content', meta: 'Asset corpus' })
    const onClose = vi.fn()
    render(<CitationPreview type="asset" id="CGM" onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close citation preview/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Escape key', async () => {
    makeFetchOk({ title: 'CGM', content: 'Asset content' })
    const onClose = vi.fn()
    render(<CitationPreview type="asset" id="CGM" onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    makeFetchOk({ title: 'S0001', content: 'Signal content' })
    const onClose = vi.fn()
    render(<CitationPreview type="signal" id="S0001" onClose={onClose} />)
    // backdrop is the first div with aria-hidden
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('aborts fetch on unmount', async () => {
    const abortSpy = vi.fn()
    // Vitest requires a class or function constructor for mocking a constructor.
    const OriginalAbortController = globalThis.AbortController
    class MockAbortController {
      signal = {}
      abort = abortSpy
    }
    globalThis.AbortController = MockAbortController as unknown as typeof AbortController
    mockFetch.mockReturnValue(new Promise(() => {}))

    const { unmount } = render(<CitationPreview type="chunk" id="c-1" onClose={vi.fn()} />)
    act(() => unmount())
    expect(abortSpy).toHaveBeenCalledOnce()
    globalThis.AbortController = OriginalAbortController
  })

  it('fetches correct URL for signal type', async () => {
    makeFetchOk({ title: 'S0042', content: 'text' })
    render(<CitationPreview type="signal" id="S0042" onClose={vi.fn()} />)
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('type=signal')
    expect(url).toContain('id=S0042')
  })
})
