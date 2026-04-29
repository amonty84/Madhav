/**
 * routerClient — TypeScript shim for MARSYS-JIS RAG /rag/route endpoint.
 * Phase B.7. Madhav_M2A_Exec_13 (2026-04-27).
 *
 * Mirrors the pattern of retrieveClient.ts.
 * The router classifies a natural-language query into a QueryPlan without
 * calling retrieve(). Downstream components compose plan + retrieve() themselves.
 */

export type QueryPlanType =
  | "interpretive_multidomain"
  | "interpretive_single"
  | "factual"
  | "timing"
  | "meta"
  | "exploratory";

export interface QueryPlan {
  query_text: string;
  plan_type: QueryPlanType;
  significance_score: number;
  domains: string[];
  actor: string;
  wcr_forced: boolean;
  routing_rationale: string;
}

const SIDECAR_URL = process.env.PYTHON_SIDECAR_URL ?? "http://localhost:8000";
const SIDECAR_API_KEY = process.env.PYTHON_SIDECAR_API_KEY ?? "";

export async function ragRoute(query: string): Promise<QueryPlan> {
  const res = await fetch(`${SIDECAR_URL}/rag/route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SIDECAR_API_KEY ? { "x-api-key": SIDECAR_API_KEY } : {}),
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`RAG route failed (${res.status}): ${detail}`);
  }

  const body = (await res.json()) as { plan: QueryPlan };
  return body.plan;
}
