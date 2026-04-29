import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFile = {
  download: vi.fn().mockResolvedValue([Buffer.from('hello')]),
  save: vi.fn().mockResolvedValue(undefined),
  exists: vi.fn().mockResolvedValue([true]),
}

const mockBucket = {
  file: vi.fn().mockReturnValue(mockFile),
}

const mockStorageInstance = {
  bucket: vi.fn().mockReturnValue(mockBucket),
}

vi.mock('@google-cloud/storage', () => ({
  Storage: class {
    bucket(name: string) {
      return mockStorageInstance.bucket(name)
    }
  },
}))

vi.mock('../../telemetry/index', () => ({
  telemetry: {
    recordLatency: vi.fn(),
  },
}))

// Reset the lazy singleton between test runs by re-importing fresh each time.
// Because the singleton is module-level, we import gcs after mocks are wired.
import { gcsAdapter } from '../gcs'

describe('gcsAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBucket.file.mockReturnValue(mockFile)
    mockStorageInstance.bucket.mockReturnValue(mockBucket)
    mockFile.download.mockResolvedValue([Buffer.from('hello')])
    mockFile.save.mockResolvedValue(undefined)
    mockFile.exists.mockResolvedValue([true])
  })

  it('readObject downloads from the correct bucket/path', async () => {
    const result = await gcsAdapter.readObject('my-bucket', 'some/path.txt')
    expect(mockStorageInstance.bucket).toHaveBeenCalledWith('my-bucket')
    expect(mockBucket.file).toHaveBeenCalledWith('some/path.txt')
    expect(mockFile.download).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Buffer)
    expect(result.toString()).toBe('hello')
  })

  it('writeObject saves to the correct bucket/path', async () => {
    const buf = Buffer.from('world')
    await gcsAdapter.writeObject('my-bucket', 'dest/file.txt', buf, 'text/plain')
    expect(mockStorageInstance.bucket).toHaveBeenCalledWith('my-bucket')
    expect(mockBucket.file).toHaveBeenCalledWith('dest/file.txt')
    expect(mockFile.save).toHaveBeenCalledWith(buf, { contentType: 'text/plain' })
  })

  it('writeObject accepts string content', async () => {
    await gcsAdapter.writeObject('my-bucket', 'dest/file.txt', 'text content')
    expect(mockFile.save).toHaveBeenCalledWith(Buffer.from('text content', 'utf-8'), undefined)
  })

  it('objectExists returns true when file exists', async () => {
    mockFile.exists.mockResolvedValue([true])
    const result = await gcsAdapter.objectExists('my-bucket', 'some/path.txt')
    expect(result).toBe(true)
  })

  it('objectExists returns false when file does not exist', async () => {
    mockFile.exists.mockResolvedValue([false])
    const result = await gcsAdapter.objectExists('my-bucket', 'missing.txt')
    expect(result).toBe(false)
  })
})
