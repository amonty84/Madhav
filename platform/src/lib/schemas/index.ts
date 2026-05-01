import Ajv2020, { type ErrorObject } from 'ajv/dist/2020'
import addFormats from 'ajv-formats'

import assetEntrySchema from './asset_entry.schema.json'
import queryPlanSchema from './query_plan.schema.json'
import bundleSchema from './bundle.schema.json'
import toolBundleSchema from './tool_bundle.schema.json'
import auditEventSchema from './audit_event.schema.json'
import panelMetadataSchema from './panel_metadata.schema.json'

export type SchemaName =
  | 'asset_entry'
  | 'query_plan'
  | 'bundle'
  | 'tool_bundle'
  | 'audit_event'
  | 'panel_metadata'

const SCHEMA_MAP: Record<SchemaName, object> = {
  asset_entry: assetEntrySchema,
  query_plan: queryPlanSchema,
  bundle: bundleSchema,
  tool_bundle: toolBundleSchema,
  audit_event: auditEventSchema,
  panel_metadata: panelMetadataSchema,
}

export interface ValidationError {
  path: string
  message: string
}

export interface ValidationResult<T = unknown> {
  valid: boolean
  errors?: ValidationError[]
  data?: T
}

const ajv = new Ajv2020({ allErrors: true, strict: false })
addFormats(ajv)

for (const [name, schema] of Object.entries(SCHEMA_MAP)) {
  ajv.addSchema(schema, name)
}

function toValidationErrors(errors: ErrorObject[]): ValidationError[] {
  return errors.map(e => ({
    path: e.instancePath || '/',
    message: e.message ?? 'Validation error',
  }))
}

export function validate<T = unknown>(schemaName: SchemaName, data: unknown): ValidationResult<T> {
  const valid = ajv.validate(schemaName, data)
  if (valid) {
    return { valid: true, data: data as T }
  }
  return {
    valid: false,
    errors: toValidationErrors(ajv.errors ?? []),
  }
}

export function getSchema(name: SchemaName): object {
  return SCHEMA_MAP[name]
}
