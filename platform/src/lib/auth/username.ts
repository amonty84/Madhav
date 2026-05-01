// Shared username validation rules. Used by access-request approval and
// direct-create flows.

export const USERNAME_RE = /^[a-z0-9_-]+$/
export const USERNAME_MIN = 3
export const USERNAME_MAX = 32

export function validateUsername(input: string): string | null {
  const value = (input ?? '').trim().toLowerCase()
  if (!value) return 'Username is required.'
  if (value.length < USERNAME_MIN) return `Username must be at least ${USERNAME_MIN} characters.`
  if (value.length > USERNAME_MAX) return `Username must be at most ${USERNAME_MAX} characters.`
  if (!USERNAME_RE.test(value)) {
    return 'Username may only contain lowercase letters, numbers, hyphens, and underscores.'
  }
  return null
}
