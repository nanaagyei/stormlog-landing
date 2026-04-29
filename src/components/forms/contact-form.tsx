"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useOptimisticRequest } from "@/hooks/use-optimistic-request";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

async function submitContact(payload: ContactPayload) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (payload.message.trim().length < 10) {
    throw new Error("Message is too short. Please add more context.");
  }
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const optimistic = useOptimisticRequest<ContactPayload>(submitContact);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await optimistic.run({ name, email, message });
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-2.5">
      <input
        type="text"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        className="h-9 w-full rounded-lg border border-white/[0.06] bg-surface px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-emerald/30"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        className="h-9 w-full rounded-lg border border-white/[0.06] bg-surface px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-emerald/30"
      />
      <textarea
        required
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="How can we help your team debug GPU memory issues?"
        className="h-20 w-full resize-none rounded-lg border border-white/[0.06] bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-emerald/30"
      />
      <button
        type="submit"
        disabled={optimistic.status === "submitting"}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald px-3.5 text-sm font-medium text-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {optimistic.status === "submitting" ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
        Send
      </button>
      <p className="font-mono text-xs text-muted-foreground/50">
        {optimistic.status === "success"
          ? "Request sent."
          : optimistic.error ?? "Typical response: one business day."}
      </p>
    </form>
  );
}
