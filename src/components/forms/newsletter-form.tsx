"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useOptimisticRequest } from "@/hooks/use-optimistic-request";

async function submitNewsletter(email: string) {
  if (!email.includes("@") || email.endsWith("@")) {
    throw new Error("Please enter a valid email address.");
  }

  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Could not subscribe right now. Please try again.");
  }
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const optimistic = useOptimisticRequest<string>(submitNewsletter);

  const disabled = useMemo(() => optimistic.status === "submitting", [optimistic.status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await optimistic.run(email.trim());
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground/40" />
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="h-10 w-full rounded-lg border border-white/[0.06] bg-surface pl-10 pr-4 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-emerald/30"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald px-4 text-sm font-medium text-deep transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {optimistic.status === "submitting" ? <Loader2 className="size-3.5 animate-spin" /> : null}
        Subscribe
      </button>

      <p className="w-full text-left font-mono text-xs text-muted-foreground/50 sm:basis-full sm:pl-1">
        {optimistic.status === "success" ? (
          <span className="inline-flex items-center gap-1.5 text-emerald">
            <CheckCircle2 className="size-3" /> You are on the list.
          </span>
        ) : optimistic.error ? (
          <span className="text-red-400">{optimistic.error}</span>
        ) : (
          "Product updates only."
        )}
      </p>
    </form>
  );
}
