import updatesJson from "./updates.json";

export interface ProductUpdate {
  id: string;
  /** Short monospace kicker rendered above the title (mirrors `.mono-label`). */
  kicker: string;
  title: string;
  summary: string;
  highlights: string[];
  /** Primary install / invocation line, shown with a copy affordance. */
  command: string;
  /** Language hint for the secondary code sample. */
  codeLabel: string;
  code: string;
  /** Anchor used by the on-page section + dialog "Learn more" link. */
  href: string;
  externalLink?: string;
}

export interface WhatsNewMeta {
  eyebrow: string;
  title: string;
  description: string;
}

export interface WhatsNewContent {
  version: string;
  releasedAt: string;
  whatsNewKey: string;
  meta: WhatsNewMeta;
  updates: ProductUpdate[];
}

const content = updatesJson as WhatsNewContent;

/**
 * Bump this whenever the highlighted updates change. The "What's new" dialog
 * uses it as the localStorage key so returning visitors only see the popup
 * again when there is genuinely something new to show.
 *
 * Source of truth lives in `updates.json` so `scripts/generate-updates.mjs`
 * (the AI-assisted regenerator) can write the next release's content without
 * touching application code.
 */
export const WHATS_NEW_VERSION = content.whatsNewKey;

export const PRODUCT_UPDATES: ProductUpdate[] = content.updates;

export const WHATS_NEW_META: WhatsNewMeta = content.meta;

export const WHATS_NEW_RELEASED_AT: string = content.releasedAt;

export const WHATS_NEW_CONTENT_VERSION: string = content.version;
