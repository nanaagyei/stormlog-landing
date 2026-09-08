"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, RotateCw } from "lucide-react";
import {
  StatusScreen,
  statusPrimaryAction,
  statusSecondaryAction,
} from "@/components/layout/status-screen";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real failure in the console for anyone debugging from the
    // browser; the digest is the only handle a user can quote back.
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      frameLabel="stormlog.dev"
      frameLines={[
        { text: "render failed", dim: true },
        { text: "500  unhandled exception", accent: true },
        ...(error.digest
          ? [{ text: `digest ${error.digest}`, dim: true }]
          : []),
      ]}
      title="Something broke on our side."
      description="This page failed to render. Trying again often clears it — if it does not, the reference above helps us trace what happened."
      actions={
        <>
          <button type="button" onClick={reset} className={statusPrimaryAction}>
            <RotateCw className="size-3.5" aria-hidden="true" />
            Try again
          </button>
          <Link href="/" className={statusSecondaryAction}>
            Back to overview
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </>
      }
    />
  );
}
