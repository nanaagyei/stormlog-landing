"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { useOptimisticRequest } from "@/hooks/use-optimistic-request";

const likesKey = (slug: string) => `stormlog-like-${slug}`;
const bookmarkKey = (slug: string) => `stormlog-bookmark-${slug}`;

async function fakeMutation() {
  await new Promise((resolve) => setTimeout(resolve, 320));
}

export function ReadingActions({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(likesKey(slug)) === "1");
      setBookmarked(localStorage.getItem(bookmarkKey(slug)) === "1");
    } catch {
      setLiked(false);
      setBookmarked(false);
    }
  }, [slug]);

  const likeRequest = useOptimisticRequest<boolean>(async () => fakeMutation(), {
    onOptimistic: (value) => {
      setLiked(value);
      localStorage.setItem(likesKey(slug), value ? "1" : "0");
    },
  });

  const bookmarkRequest = useOptimisticRequest<boolean>(async () => fakeMutation(), {
    onOptimistic: (value) => {
      setBookmarked(value);
      localStorage.setItem(bookmarkKey(slug), value ? "1" : "0");
    },
  });

  const busy = useMemo(
    () => likeRequest.status === "submitting" || bookmarkRequest.status === "submitting",
    [bookmarkRequest.status, likeRequest.status],
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => likeRequest.run(!liked)}
        disabled={busy}
        className="inline-flex h-7 items-center gap-1 rounded-md border border-white/[0.06] bg-surface px-2.5 text-xs text-foreground transition-colors hover:border-white/[0.12]"
      >
        <Heart className={`size-3 ${liked ? "fill-current text-emerald" : "text-muted-foreground"}`} />
        {liked ? "Liked" : "Like"}
      </button>
      <button
        type="button"
        onClick={() => bookmarkRequest.run(!bookmarked)}
        disabled={busy}
        className="inline-flex h-7 items-center gap-1 rounded-md border border-white/[0.06] bg-surface px-2.5 text-xs text-foreground transition-colors hover:border-white/[0.12]"
      >
        <Bookmark className={`size-3 ${bookmarked ? "fill-current text-emerald" : "text-muted-foreground"}`} />
        {bookmarked ? "Saved" : "Save"}
      </button>
    </div>
  );
}
