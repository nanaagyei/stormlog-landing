"use client";

import { useCallback, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function useOptimisticRequest<TPayload>(
  executor: (payload: TPayload) => Promise<void>,
  opts?: {
    onOptimistic?: (payload: TPayload) => void;
    onRollback?: (payload: TPayload) => void;
  },
) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (payload: TPayload) => {
      setStatus("submitting");
      setError(null);
      opts?.onOptimistic?.(payload);

      try {
        await executor(payload);
        setStatus("success");
      } catch (err) {
        opts?.onRollback?.(payload);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Request failed. Please try again.");
      }
    },
    [executor, opts],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, run, reset };
}
