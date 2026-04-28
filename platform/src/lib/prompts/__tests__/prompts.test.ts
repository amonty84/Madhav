import { describe, it, expect, beforeEach } from 'vitest'
import { renderTemplate, getDefaultRegistry, createRegistry } from '../index'
import type { PromptTemplate, QueryClass } from '../index'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SAMPLE_VARIABLES: Record<string, string> = {
  chart_name: 'Abhisek Mohanty',
  birth_date: '1984-02-05',
  birth_time: '10:43 IST',
  birth_place: 'Bhubaneswar, Odisha, India',
  bundle_summary: 'L1+L2+L2.5 bundle, 499 signals',
  tools_available: 'get_layer_document, run_ephemeris',
}

const MINIMAL_TEMPLATE: PromptTemplate = {
  template_id: 'test_template',
  version: '1.0',
  query_class: 'factual',
  audience_tier: 'super_admin',
  strategy: 'single_model',
  body: 'Hello {{chart_name}}, born {{birth_date}}.',
  style_suffixes: {
    acharya: '',
    brief: '\n\nBe brief.',
    client: '\n\nBe accessible.',
  },
  required_placeholders: ['chart_name', 'birth_date'],
}

// ---------------------------------------------------------------------------
// renderTemplate
// ---------------------------------------------------------------------------

describe('renderTemplate', () => {
  it('substitutes all placeholders and returns the result', () => {
    const result = renderTemplate(
      MINIMAL_TEMPLATE,
      { chart_name: 'Test Native', birth_date: '2000-01-01' },
      'acharya',
    )
    expect(result).toBe('Hello Test Native, born 2000-01-01.')
  })

  it('appends the acharya style suffix (empty string)', () => {
    const result = renderTemplate(
      MINIMAL_TEMPLATE,
      { chart_name: 'Test Native', birth_date: '2000-01-01' },
      'acharya',
    )
    expect(result.endsWith('.')).toBe(true)
    expect(result).not.toContain('brief')
    expect(result).not.toContain('accessible')
  })

  it('appends the brief style suffix', () => {
    const result = renderTemplate(
      MINIMAL_TEMPLATE,
      { chart_name: 'Test Native', birth_date: '2000-01-01' },
      'brief',
    )
    expect(result).toContain('\n\nBe brief.')
  })

  it('appends the client style suffix', () => {
    const result = renderTemplate(
      MINIMAL_TEMPLATE,
      { chart_name: 'Test Native', birth_date: '2000-01-01' },
      'client',
    )
    expect(result).toContain('\n\nBe accessible.')
  })

  it('substitutes all occurrences of a placeholder that appears multiple times', () => {
    const tmpl: PromptTemplate = {
      ...MINIMAL_TEMPLATE,
      body: '{{chart_name}} and {{chart_name}} again.',
      required_placeholders: ['chart_name'],
    }
    const result = renderTemplate(tmpl, { chart_name: 'X' }, 'acharya')
    expect(result).toBe('X and X again.')
  })

  it('throws when a required placeholder is missing from variables', () => {
    expect(() =>
      renderTemplate(MINIMAL_TEMPLATE, { chart_name: 'Test Native' /* birth_date missing */ }, 'acharya'),
    ).toThrow(/birth_date/)
  })

  it('includes the placeholder name in the error message', () => {
    const tmpl = getDefaultRegistry().get('factual', 'super_admin', 'single_model')
    expect(() => renderTemplate(tmpl, {}, 'acharya')).toThrow('chart_name')
  })
})

// ---------------------------------------------------------------------------
// PromptRegistry
// ---------------------------------------------------------------------------

describe('PromptRegistry', () => {
  // Use a fresh registry from the default factory for each test group, but
  // since getDefaultRegistry() returns a singleton we read a new one by
  // leveraging the module cache.  For isolation in individual tests we call
  // getDefaultRegistry() which always returns the same loaded instance —
  // sufficient for read-only tests; mutation tests use a local registry via
  // the constructor exposed through the factory.

  const ALL_QUERY_CLASSES: QueryClass[] = [
    'factual',
    'interpretive',
    'predictive',
    'cross_domain',
    'discovery',
    'holistic',
    'remedial',
    'cross_native',
  ]

  describe('list()', () => {
    it('returns exactly 8 templates', () => {
      const registry = getDefaultRegistry()
      expect(registry.list()).toHaveLength(8)
    })
  })

  describe('get() — direct lookup', () => {
    it.each(ALL_QUERY_CLASSES)('returns a template for query_class "%s"', (qc) => {
      const registry = getDefaultRegistry()
      const tmpl = registry.get(qc, 'super_admin', 'single_model')
      expect(tmpl.query_class).toBe(qc)
      expect(tmpl.audience_tier).toBe('super_admin')
      expect(tmpl.strategy).toBe('single_model')
    })
  })

  describe('get() — acharya_reviewer fallback', () => {
    it.each(ALL_QUERY_CLASSES)(
      'falls back to super_admin template for acharya_reviewer (%s)',
      (qc) => {
        const registry = getDefaultRegistry()
        const fallback = registry.get(qc, 'acharya_reviewer', 'single_model')
        // The returned template should be the super_admin one (no acharya_reviewer
        // templates are registered in Phase 3)
        expect(fallback.query_class).toBe(qc)
        expect(fallback.audience_tier).toBe('super_admin')
      },
    )
  })

  describe('get() — missing combination throws', () => {
    it('throws for a completely unregistered combination', () => {
      const registry = getDefaultRegistry()
      expect(() => registry.get('factual', 'public_redacted', 'single_model')).toThrow(
        /no template found/,
      )
    })

    it('error message includes the query_class and audience_tier', () => {
      const registry = getDefaultRegistry()
      let message = ''
      try {
        registry.get('predictive', 'client', 'panel')
      } catch (e) {
        message = (e as Error).message
      }
      expect(message).toContain('predictive')
      expect(message).toContain('client')
    })
  })

  describe('register()', () => {
    it('replaces an existing template with the same key', () => {
      // Use an isolated registry instance via createRegistry() so the
      // singleton is never mutated and no restore is needed.
      const registry = createRegistry()
      const override: PromptTemplate = {
        template_id: 'factual_super_admin_single_model_override',
        version: '99.0',
        query_class: 'factual',
        audience_tier: 'super_admin',
        strategy: 'single_model',
        body: 'Override body.',
        style_suffixes: { acharya: '', brief: '', client: '' },
        required_placeholders: [],
      }
      registry.register(override)
      const retrieved = registry.get('factual', 'super_admin', 'single_model')
      expect(retrieved.version).toBe('99.0')
    })
  })
})

// ---------------------------------------------------------------------------
// Template integrity — all required_placeholders appear in body
// ---------------------------------------------------------------------------

describe('Template body integrity', () => {
  const ALL_QUERY_CLASSES: QueryClass[] = [
    'factual',
    'interpretive',
    'predictive',
    'cross_domain',
    'discovery',
    'holistic',
    'remedial',
    'cross_native',
  ]

  it.each(ALL_QUERY_CLASSES)(
    'template "%s": all required_placeholders appear in the body',
    (qc) => {
      const registry = getDefaultRegistry()
      const tmpl = registry.get(qc, 'super_admin', 'single_model')

      // cross_native is a Phase 7 stub with a hardcoded message body and
      // empty required_placeholders — skip the body-contains check for it.
      if (qc === 'cross_native') {
        expect(tmpl.required_placeholders).toHaveLength(0)
        return
      }

      for (const placeholder of tmpl.required_placeholders) {
        expect(
          tmpl.body,
          `Template "${tmpl.template_id}" is missing required placeholder "{{${placeholder}}}"`,
        ).toContain(`{{${placeholder}}}`)
      }
    },
  )

  it.each(ALL_QUERY_CLASSES)(
    'template "%s": renderTemplate succeeds with all required variables supplied',
    (qc) => {
      const registry = getDefaultRegistry()
      const tmpl = registry.get(qc, 'super_admin', 'single_model')
      expect(() => renderTemplate(tmpl, SAMPLE_VARIABLES, 'acharya')).not.toThrow()
    },
  )
})
