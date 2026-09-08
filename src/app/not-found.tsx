"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  StatusScreen,
  statusPrimaryAction,
  statusSecondaryAction,
} from "@/components/layout/status-screen";

export default function NotFound() {
  // The not-found boundary is prerendered at build time, where the real URL is
  // unknown. useSyncExternalStore gives the server a `null` snapshot and the
  // browser the actual path, so hydration matches and no state is set in an
  // effect. The subscribe callback is a no-op: this value cannot change while
  // the boundary is mounted.
  const path = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => null,
  );

  return (
    <StatusScreen
      frameLabel="stormlog.dev"
      frameLines={[
        { text: `GET ${path ?? "…"}`, dim: true },
        { text: "404  no route matched", accent: true },
      ]}
      title="That path returned nothing."
      description="The page you asked for does not exist. It may have been renamed, or the link that brought you here may be out of date."
      actions={
        <>
          <Link href="/" className={statusPrimaryAction}>
            Back to overview
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link href="/blogs" className={statusSecondaryAction}>
            <BookOpen className="size-3.5" aria-hidden="true" />
            Browse the blog
          </Link>
        </>
      }
    />
  );
}
