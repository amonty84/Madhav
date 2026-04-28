/**
 * synthesizeClient — TypeScript shim for MARSYS-JIS RAG /rag/synthesize endpoint.
 * Phase B.8. Madhav_M2A_Exec_14 (2026-04-28).
 *
 * Mirrors the pattern of retrieveClient.ts and routerClient.ts.
 * The composite endpoint handles route → retrieve → synthesize server-side.
 */

import type { QueryPlan } from "./routerClient";

export interface DerivationEntry {
  chunk_id: string;
  doc_type: string;
  layer: string;
  signal_or_fact_id: string;
  claim_supported: string;
}

export interface SynthesisAnswer {
  query_text: string;
  plan: QueryPlan;
  answer_text: string;
  derivation_ledger: DerivationEntry[];
  confidence: "LOW" | "MED" | "HIGH";
  confidence_rationale: string;
  interpretations: string[];
  bundle_chunk_ids: string[];
  actor: string;
  p7_triggered: boolean;
  p6_enforcement: string;
}

const SIDECAR_URL = process.env.NEXT_PUBLIC_SIDECAR_URL ?? "http://localhost:8000";
const SIDECAR_API_KEY = process.env.PYTHON_SIDECAR_API_KEY ?? "";

export async function ragSynthesize(query: string): Promise<SynthesisAnswer> {
  const res = await fetch(`${SIDECAR_URL}/rag/synthesize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SIDECAR_API_KEY ? { "x-api-key": SIDECAR_API_KEY } : {}),
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`RAG synthesize failed (${res.status}): ${detail}`);
  }

  const body = (await res.json()) as { answer: SynthesisAnswer };
  return body.answer;
}
