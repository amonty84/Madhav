/**
 * retrieveClient — TypeScript shim for MARSYS-JIS RAG /rag/retrieve endpoint.
 * Phase B.6. Madhav_M2A_Exec_12 (2026-04-27).
 */

export type RetrievalMode = "vector" | "bm25" | "graph_walk" | "hybrid_rrf" | "auto";

export interface RetrieveRequest {
  query: string;
  mode?: RetrievalMode;
  k?: number;
  rerank?: boolean;
}

export interface RetrievalResult {
  chunk_id: string;
  doc_type: string;
  score: number;
  rank: number;
  text: string;
  metadata: Record<string, unknown>;
  retrieval_mode: string;
}

export interface RetrieveResponse {
  results: RetrievalResult[];
}

const SIDECAR_URL = process.env.PYTHON_SIDECAR_URL ?? "http://localhost:8000";
const SIDECAR_API_KEY = process.env.PYTHON_SIDECAR_API_KEY ?? "";

export async function ragRetrieve(req: RetrieveRequest): Promise<RetrievalResult[]> {
  const body: RetrieveRequest = {
    mode: "hybrid_rrf",
    k: 10,
    rerank: true,
    ...req,
  };

  const res = await fetch(`${SIDECAR_URL}/rag/retrieve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SIDECAR_API_KEY ? { "x-api-key": SIDECAR_API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`RAG retrieve failed (${res.status}): ${detail}`);
  }

  return res.json() as Promise<RetrievalResult[]>;
}
