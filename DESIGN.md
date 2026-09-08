---
name: Stormlog
description: Real-time GPU memory profiling for PyTorch, TensorFlow, and JAX teams.
colors:
  deep: "#060a10"
  surface: "#141920"
  surface-2: "#22282f"
  emerald: "#40c786"
  emerald-muted: "rgba(64, 199, 134, 0.15)"
  foreground: "#f5f7fa"
  muted-foreground: "#a1a7ae"
  muted-dim: "#909499"
  prose-em: "#ced1d6"
  emerald-hover: "#6adfa1"
  border: "rgba(255, 255, 255, 0.06)"
  destructive: "#e56963"
typography:
  display:
    fontFamily: "Clash Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3.5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Clash Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.15rem + 1.4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Clash Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.05rem + 0.7vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, monospace"
    fontSize: "0.78125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-lg: "32px"
  card: "24px"
  card-lg: "32px"
  section: "64px"
  section-lg: "96px"
components:
  button-primary:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.deep}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "#1affa6"
    textColor: "{colors.deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.foreground}"
  install-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
  mono-label:
    textColor: "{colors.emerald}"
    typography: "{typography.label}"
  code-frame:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.foreground}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: Stormlog

## Overview

**Creative North Star: "The Darkroom"**

Stormlog's interface is a controlled dark space where evidence develops and becomes legible. The product exists because a training run died at 3am and left nothing behind; the site's job is to be the room where you go afterward and look carefully at what happened. That makes it forensic rather than promotional. Surfaces are quiet and near-black so the artifact under examination — a TUI capture, a code block, a memory reading — is the brightest thing on screen. Nothing competes with the evidence.

The system is dark-only by construction. `:root` and `.dark` resolve to identical values, so there is no light mode to design for and no theme-toggle branch to reason about; the darkness is a material fact, not a user preference. Depth comes from a three-step tonal ladder rather than shadow — `deep` (#09090b) for the page ground, `surface` (#18181b) for cards and controls, `surface-2` (#27272a) for raised and hovered states — reinforced by hairline borders at 6% white. A single mint accent carries brand and signal. Monospace is a first-class voice, not a code-block afterthought: eyebrow labels, version chips, frame captions, and install commands all speak in JetBrains Mono, because the product's native habitat is a terminal and the site does not translate that away.

Restraint is doing real work here, so the rejections are as load-bearing as the rules. This is not a dark SaaS page: no gradient meshes, no glowing orbs, no aurora blurs, no gradient text. Not glassmorphism: the nav's backdrop blur is functional legibility, not a decorative material to spread. Not a consumer app: no mascots, illustrations, pastels, or playful microcopy. Not enterprise stock: no laptop photography, no abstract 3D, no logo wall of customers that do not exist.

**Key Characteristics:**
- Dark-only, near-black ground (#09090b) with no light-mode counterpart
- Tonal ladder for depth; effectively no shadow vocabulary
- Hairline borders at `rgba(255,255,255,0.06)` as the primary edge
- One mint accent (#00e599) carrying both brand and live-state signal
- Three-typeface system: Clash Grotesk display, Satoshi body, JetBrains Mono label and code
- Real product screenshots as the only imagery
- Motion that reveals, never performs

## Colors

A near-monochrome stack lit by exactly one chromatic voice — the palette of a dark room with a single instrument glowing in it. The neutrals are **not** a stock scale: every step is derived in OKLCH at hue 257, sampled from the logo's own dark layers, so the ground shares a family resemblance with the mark instead of borrowing a framework default.

### Primary
- **Signal Green** (`#40c786`, token `emerald`): The brand color and the signal color at once. It carries CTAs, mono eyebrow labels, active navigation underlines, live indicators, copy-success confirmations, inline code, blockquote rules, and link text in prose. Derived from the logo's own mint, deepened and pulled off the cyan axis (OKLCH hue 158) so it reads as an instrument readout rather than the neon cyan-on-black that marks generated dark UIs. It is the brand color and is meant to be used, not rationed.
- **Signal Green Wash** (`rgba(64, 199, 134, 0.15)`, token `emerald-muted`): The accent at low opacity for chip and badge backgrounds where full mint would shout. Related washes appear at 0.2 for text selection, 0.08 for the accent glow, 0.07 for highlighted code lines, and 0.04 for blockquote fill.

### Neutral
- **Darkroom Black** (`#060a10`, token `deep`): The page ground and the inside of every code and video frame. It is the darkest surface in the system; nothing sits behind it.
- **Developing Tray** (`#141920`, token `surface`): Cards, buttons at rest, chips, and the nav's solid fallback. One step up from the ground — visible as a distinct plane without a border, though it usually gets one anyway.
- **Raised Tray** (`#22282f`, token `surface-2`): Hover and active surfaces, and secondary fills. The top of the ladder. Reaching it is how the system says "you are touching this."
- **Print White** (`#f5f7fa`, token `foreground`): Headings, body emphasis, and primary text. Never pure #ffffff — the slight warmth keeps large type from vibrating against near-black.
- **Contact Sheet Grey** (`#a1a7ae`, token `muted-foreground`): Body copy, descriptions, and captions. Carries most of the reading load. Sub-opacities (`/60`, `/50`, `/40`, `/30`) step down to frame captions and idle icons.
- **Dimmed Grey** (`#909499`, token `muted-dim`): Tertiary text — frame captions, placeholders, timestamps, idle icons. One visible step below Contact Sheet Grey and the floor of the readable range: it clears AA (4.5:1) on all three ladder steps, which the former `muted-foreground/30..70` opacity variants did not.
- **Hairline** (`rgba(255, 255, 255, 0.06)`, token `border`): Every default edge in the system — cards, frames, nav, dividers, table rules. Brightens to 0.12 on hover and 0.20 on interactive focus.

### Tertiary
- **Alert Red** (`#e56963`, token `destructive`): Destructive and invalid states only. Present in the component layer, effectively unused on the marketing surface.

### Named Rules

**The Readable Floor Rule.** Never dim text with an opacity modifier. `text-muted-foreground/50` and its siblings bottomed out at 1.68:1 against `deep`. Tertiary text uses the `muted-dim` token, which is the dimmest step that still clears AA on every surface in the ladder.

**The No Stock Ramp Rule.** Every neutral is generated in OKLCH at hue 257 with deliberate chroma, not copied from a framework scale. The previous palette was Tailwind `zinc` end to end — the same values shadcn ships as its dark default — which is the single most recognizable tell of a generated interface. A new neutral is derived from the ramp or it does not enter the system.

**The Single Voice Rule.** Mint is the only chromatic color in the system. Adding a second hue — a blue for "info", an amber for "warning", a purple for anything — breaks the darkroom. If a state needs distinguishing, use the tonal ladder, opacity, or type weight, not a new hue.

**The Brand Color Rule.** Mint is the brand color, not a rationed signal, and it may carry real presence across a surface: CTAs, eyebrows, active states, and live indicators, but also borders, hover treatments, tinted panels, icon accents, rules, and washes used for visual interest. Use it wherever it strengthens recognition. The one constraint that still binds is contrast — mint text or iconography must clear WCAG AA against whatever surface it lands on, which in practice means full-strength `#00e599` on `deep` or `surface`, not mint-on-mint-wash at small sizes.

**The No Light Mode Rule.** `:root` and `.dark` are deliberately identical. Do not introduce a light palette, and do not write components that branch on theme. `next-themes` is present for infrastructure reasons, not as a design affordance.

## Typography

**Display Font:** Clash Grotesk Variable (200–700), with `ui-sans-serif, system-ui, sans-serif`
**Body Font:** Satoshi Variable (300–900), with `ui-sans-serif, system-ui, sans-serif`
**Label/Mono Font:** JetBrains Mono Variable (100–800), with `ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", monospace`

**Character:** Clash Grotesk brings a slightly condensed, geometric authority to headlines — tightened hard (−0.03em) at display sizes so large type reads as one dense mass rather than loose words. Satoshi is a neutral, highly legible workhorse underneath it, set generously (1.85 line-height in prose) because the audience actually reads. JetBrains Mono is not decorative: it is the product's own voice, appearing wherever the site quotes the terminal or names a machine fact.

### Hierarchy
- **Display** (Clash Grotesk 600, `clamp(2.25rem → 4.5rem)`, 1.05, −0.03em): Hero and page headlines. One per page. Always tightened; never centered below 1024px without a max-width constraint.
- **Headline** (Clash Grotesk 600, `clamp(1.75rem → 2.5rem)`, 1.15, −0.025em): Section headings and blog `h2`.
- **Title** (Clash Grotesk 600, `clamp(1.35rem → 1.75rem)`, 1.2): Card headings, subsection headings, blog `h3`.
- **Body** (Satoshi 400, 1.0625rem/1.85 in prose, 1rem–1.125rem in sections, `leading-relaxed`): Descriptions and article text, in Contact Sheet Grey. Drops to 1rem/1.8 below 768px.
- **Label** (JetBrains Mono 500, 0.75rem, 0.1em tracking, uppercase): Frame chrome, code-frame captions, version chips, and status text. Never an eyebrow above a heading — see The No Kicker Rule.
- **Code** (JetBrains Mono 400, 0.75rem → 0.78125rem in snippets, 0.92rem in article code blocks, 1.75): Terminal output, install commands, and code samples.

### Named Rules

**The Mono Means Machine Rule.** JetBrains Mono is reserved for things the machine said or things you type at it: commands, code, version numbers, file paths, frame captions, and status chips. Never use mono for marketing prose, headings, or button labels just for texture.

**The Tighten As You Grow Rule.** Letter-spacing decreases as type size increases (−0.02em at title, −0.025em at headline, −0.03em at display). Default tracking on a 4.5rem headline is the single fastest way to make this system look generic.

**The No Kicker Rule.** A heading opens its own section. No mono label, category tag, or eyebrow sits above a display or headline — the *kicker → headline → subhead* stack is the most recognizable shape of a generated landing page, and every one of this site's headings is specific enough to stand without a label announcing it. Metadata that genuinely belongs to a section (a version, a release date) goes **below** the heading as a caption, where metadata belongs.

## Layout

Content sits on a centered single column with two container widths: `1200px` standard and `1400px` for wide sections that need to breathe (galleries, comparison views); the nav and hero video use `max-w-6xl` (1152px). Horizontal gutters step `16px → 24px → 32px` across `sm` and `lg`. Vertical section rhythm steps `64px → 80px → 96px` (`py-16 sm:py-20 lg:py-24`), with the hero taking a larger top inset (`112px → 144px → 176px`) to clear the fixed 56px nav.

Breakpoints are Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. The responsive pattern is consistent and worth preserving: single column below `md`, two or three columns at `lg`, with nav links collapsing to a sheet below `lg` and secondary nav actions hiding below `md`. Card grids use `gap-4`/`gap-6`; internal card padding is `24px`, opening to `32px` at `sm`.

Density is moderate-to-tight. Sections are generous vertically but content inside them is packed — this is a tool for people who read dense terminal output, and the layout should respect that rather than airing everything out.

### Named Rules

**The Fixed Chrome Rule.** The nav is 56px, fixed, at `z-50`, with `bg-[#09090b]/80` and `backdrop-blur-xl`. Any anchored heading needs `scroll-margin-top` of at least `6rem` (7rem on desktop) so section links do not land under it.

## Elevation & Depth

This system has essentially no shadow vocabulary. Depth is built from a three-step tonal ladder plus hairline borders, and that is the whole mechanism.

Use the ladder consistently: **`deep` (#09090b)** for the page ground and the inside of code and media frames; **`surface` (#18181b)** for cards, controls, and chips at rest; **`surface-2` (#27272a)** for hover, active, and raised states. Borders reinforce the step, they do not carry it — a card is legible as a card because it is one tone lighter than the page, and the hairline sharpens that edge rather than creating it. Semi-transparent variants exist for layered contexts (`.surface-card` uses `rgba(39,39,42,0.5)`).

### Shadow Vocabulary
- **Accent Glow** (`box-shadow: 0 0 40px rgba(0, 229, 153, 0.08)`, class `.accent-glow`): The only shadow token in the system. A wide, very low-opacity mint bloom used sparingly behind accent elements. It suggests emitted light, which is why it is mint and never black.

### Named Rules

**The Ladder, Not The Drop Rule.** When something needs to feel raised, move it up the tonal ladder and brighten its border. Do not reach for a black drop shadow — there is no `box-shadow` scale in this system and introducing one would flatten the darkroom into a generic dark card UI.

**The Border Brightens Rule.** Interactive elevation reads through the edge: hairline `0.06` at rest → `0.12` on hover → `0.20` on active or focused controls, usually paired with a `surface` → `surface-2` background step.

## Shapes

Corners are consistently soft but never pillowy. The radius scale derives from a single `--radius: 0.5rem` root: `sm` 4px, `md` 6px, `lg` 8px, `xl` 12px, plus `full` for pills.

`lg` (8px) is the workhorse — buttons, install chips, code snippets, nav sheet items. `xl` (12px) belongs to large containers: cards, media frames, the hero video frame. `md` (6px) handles small inline chrome like the version chip and icon buttons. `full` is reserved for badges, avatars, and pills. Nothing in the system is square-cornered, and nothing exceeds 12px except pills.

Borders are always 1px and always hairline white; the system has no thick, colored, or double borders. The one directional exception is the blockquote, which uses a 2px left rule in mint at 40% with corners rounded only on the trailing side (`0 0.5rem 0.5rem 0`) — the shape of a margin annotation.

### Named Rules

**The 12px Ceiling Rule.** No radius above 12px except intentional pills (`full`). Larger radii read as consumer-app friendliness, which is a confirmed anti-reference.

## Components

Components are **quiet until touched**. At rest they recede toward the ground — flat fill, hairline edge, muted text. Interaction is where they come alive: the border brightens, the surface steps up the ladder, and mint confirms. Nothing bounces, scales, or celebrates.

### Buttons
- **Shape:** Softly rounded (8px, `rounded-lg`); primitives from shadcn use `rounded-md` (6px) at smaller sizes.
- **Primary:** Mint fill (#00e599) with Darkroom Black text (#09090b), 40px tall, 20px horizontal padding, 14px medium weight. Hover brightens the fill (`brightness-110`) rather than shifting hue.
- **Secondary:** `surface` fill with hairline border and Print White text, same geometry. Hover steps to `surface-2` and brightens the border to 0.12.
- **Hover / Focus:** `transition-all` at ~200ms. Focus-visible draws a 3px `ring-ring/50` in mint. Never remove the focus ring — it is the only visible focus affordance on a dark ground.
- **Ghost / Link:** Muted grey text lifting to Print White on hover; link variant uses mint with a 4px underline offset.

### Chips & Badges
- **Style:** Pill (`rounded-full`), 12px medium, `emerald-muted` fill with mint text for accent chips, or `surface` with hairline border and muted text for neutral chips.
- **Mono chips:** The nav version chip and frame captions use `rounded-md` (6px), 11px JetBrains Mono, muted text, hairline border, brightening to mint on hover.

### Cards / Containers
- **Corner Style:** 12px (`rounded-xl`).
- **Background:** `surface` (#18181b), or `rgba(39,39,42,0.5)` for layered contexts.
- **Shadow Strategy:** None. Depth is the tonal step plus hairline border — see Elevation & Depth.
- **Border:** 1px `rgba(255,255,255,0.06)`.
- **Internal Padding:** 24px, opening to 32px at `sm`.

### Code & Media Frames
The system's signature container. A `deep`-filled box at 8–12px radius with a hairline border, opened by a chrome bar: a bottom hairline, an 11px uppercase mono caption on the left in `muted-foreground/50`, and an optional right-aligned secondary caption or copy action at `/30`. The frame is used identically for code snippets, the hero video, and TUI captures — it is what makes quoted machine output feel like an artifact rather than an image.

### Navigation
- **Style:** Fixed 56px bar, `bg-[#09090b]/80` with `backdrop-blur-xl`, bottom hairline.
- **Type:** 13–14px Satoshi, muted grey lifting to Print White on hover.
- **Active:** A 1px mint underline (`bg-emerald`) animated between items — the only place the accent marks position.
- **Mobile:** Collapses below `lg` into a full-width sheet at `bg-[#09090b]/95`, items at `rounded-lg` with `hover:bg-white/[0.04]`.

### Inputs / Fields
- **Style:** `surface` fill, hairline border, 8px radius, matching button height.
- **Focus:** 3px mint ring at 50% (`ring-ring/50`) with the border shifting to mint.
- **Error:** `destructive` border with a matching 20% ring.

### Motion
All motion runs on Framer Motion — there is no second animation library. Reveals use a custom expo-out ease `cubic-bezier(0.16, 1, 0.3, 1)` over 500ms: opacity 0→1 with a 16px rise (20px lateral for directional variants), staggered 60ms with a 40ms lead-in, fired once via `whileInView` at 25% visibility. Parallax is deliberately subtle — the hero frame drifts 4% across its exit via `useScroll`/`useTransform`, and is never looped.

### Named Rules

**The Reveal, Don't Perform Rule.** Motion exists to bring content into place, once. No looping animation, no scale-on-hover, no bounce or spring overshoot. The system contains no infinite animation at all; the hero video is the one continuous moving element, and it ships with a pause control.

**The Reduced Motion Is Real Rule.** `MotionProvider` wraps the app in `<MotionConfig reducedMotion="user">`, which is the single gate for every Framer animation — CSS alone cannot stop them, since Framer animates through JS. The global `prefers-reduced-motion` block additionally clamps CSS animation and transition durations, and transform-based hover effects need `motion-reduce:transform-none`. This is a stated WCAG 2.2 AA commitment, not a nicety.

## Do's and Don'ts

### Do:
- **Do** build depth with the tonal ladder — `deep` → `surface` → `surface-2` — and let the hairline border sharpen the step rather than create it.
- **Do** open every quoted piece of machine output with the frame chrome bar: hairline, 11px uppercase mono caption, `deep` fill.
- **Do** let each section open on its heading, with any release or version metadata as a caption beneath it.
- **Do** tighten letter-spacing as type scales up (−0.02em → −0.025em → −0.03em).
- **Do** keep imagery to real product captures — the TUI screenshots and overview video are the only imagery this system uses, and they are genuine.
- **Do** let `MotionConfig reducedMotion="user"` carry the motion preference, and keep focus rings visible.
- **Do** use mint freely as the brand color — CTAs, eyebrows, active states, borders, hovers, washes, and accents — subject only to AA contrast where it carries text or iconography.

### Don't:
- **Don't** introduce a second chromatic hue. One accent, no exceptions — use tone, opacity, or weight to differentiate instead.
- **Don't** add a `box-shadow` scale. The Accent Glow is the only shadow token; raised means one step up the ladder.
- **Don't** build a light mode or branch components on theme. `:root` and `.dark` are identical by design.
- **Don't** exceed a 12px radius outside deliberate pills.
- **Don't** set marketing prose, headings, or button labels in JetBrains Mono for texture. Mono means machine.
- **Don't** reintroduce a kicker, eyebrow, or category label above a heading in any form.
- **Don't** drift toward the confirmed anti-references: gradient meshes, glowing orbs, aurora blurs, or gradient text (generic dark SaaS); frosted decorative panels (glassmorphism); mascots, illustrations, or pastels (consumer app); stock photography, abstract 3D, or logo walls (enterprise stock).
- **Don't** add looping, bouncing, or scale-on-hover motion, and never dim text with an opacity modifier. Reveal once and stop; dim with `muted-dim`.
