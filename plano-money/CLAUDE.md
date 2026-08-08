# Plano.Money — notes for future work

## `/oferta` is the reference template for offer/landing pages

`src/pages/SalesPagePlanoMoney.jsx` (route `/oferta`) is the finished,
approved sales page for the main Plano.Money subscription. When building a
landing page for a future offer (upsell, downsell, a different product),
start from this file's structure and styling instead of designing from
scratch:

- **Section order**: trust bar → hero (short emotional headline + CTA) →
  big device mockup (real screenshots, white bg + violet halo, built via
  a laptop/phone PNG composite) → CTA → demo video with a red play-button
  overlay (`DemoVideo` component) → CTA again → outcome benefit cards
  (short, icon-based, blue outline) → one-line testimonials with real
  photos → "what you get" checklist (software-feature language, not
  course/bonus language) → bonuses in their own highlighted row → trust
  grid (green outline) → guarantee → final price box (navy, strikethrough
  + real price) → seals (graphic medal badges) → footer (just copyright,
  no legal disclaimer paragraph).
- **Palette**: lila/celeste/verde (brand colors from `tailwind.config.js`)
  used throughout, not just navy/white — outlined cards (white bg +
  colored border), not filled, unless explicitly asked for filled.
- **CTA copy**: "Quiero ordenar mis finanzas →" (or the equivalent
  outcome-phrased action for the new offer) repeated identically on every
  button on the page — consistency reduces friction. Never generic
  "Empezar ahora" wording for a fresh page.
- **Copy rules**: no em-dashes (—) anywhere in user-facing text; short
  testimonials (one line); the CTA should state the result the user wants,
  not a generic action.
- **Funnel position**: Quiz → this offer page → real Hotmart checkout
  (order bump / upsell / downsell only exist on Hotmart's actual checkout,
  never faked on our own pages).
- **Quiz-to-offer personalization (standing pattern, keep doing this)**:
  the quiz computes a `profile` (`computeProfile()` in the quiz's data
  file) representing which of a handful of real, distinct problems the
  person has. The quiz's `result` step (its last step) links straight to
  `/oferta?p=<profile.key>` — computed inline in `QuizEngine.jsx`, not
  stored as data. The offer page reads that param (`getProfileHero()` in
  `SalesPagePlanoMoney.jsx`) and swaps just the hero headline + subtitle
  to speak directly to that problem, with copy/psychology matched to it,
  defaulting to a generic variant when there's no param (cold traffic
  that skipped the quiz). Don't fork this into separate page files per
  profile — one page, one small config map keyed by profile, everything
  else (mockup, video, benefits, testimonials, pricing) stays shared so
  edits never need to be repeated per-variant. Apply this same pattern to
  any future quiz+offer pair.
- **The quiz only diagnoses, it never sells**: no price, no discount, no
  bonus, no guarantee copy anywhere in `planoMoneyQuiz.js` or
  `QuizEngine.jsx`. Its last step is the personalized diagnosis
  (`result`), whose only CTA is the handoff link to `/oferta`. All
  commercial content (price, bonuses, guarantee, order bump) lives
  exclusively on the offer page and Hotmart's checkout. If a future quiz
  edit is tempted to add a price or a bonus mention, it belongs on the
  offer page instead.
- **No mid-quiz "here's our product" pitch screens**: an earlier version
  had a `pitch` step type (one variant per diagnosed problem, shown right
  after the person answered `area_afectada`) that broke the diagnostic
  frame and started to feel like a sales interruption — cut entirely.
  The one real screenshot of the app now appears exactly once, on the
  `result` step, alongside the diagnosis (`profile.image` /
  `profile.imageAlt`, set per-branch in `computeProfile()`,
  `public/quiz-result-*.png`). Never a placeholder box or a stock/AI
  photo of a person standing in for something real — same rule as
  everywhere else in this project.
- **The quiz has to land emotionally, not just collect data**: it asks
  what the person would do if money weren't a problem (`deseo` question)
  and carries that answer through in plain language via `{{deseo}}`
  interpolation (`data.deseoLabels` + the generic `fill()` helper in
  `QuizEngine.jsx` — works alongside `{{name}}`, which always uses first
  name only even if someone types a full name). The projection screen and
  the final result screen both reference it, so the whole arc closes on
  the person's own stated desire, not a generic pitch.
- Two-repo sync discipline still applies: this workspace
  (`marianogomezpru-max/Plano.Money`, `main`) mirrors
  `/home/user/copia-madmuscles/plano-money`
  (`marianogomezpru-max/copia-madmuscles`,
  `claude/plano-money-app-review-v7ck4g`) — copy, build both, commit with
  matching messages, push both.

## `/quiz` visual language matches `/oferta`

`QuizEngine.jsx` got the same design pass as `/oferta`: lila/celeste/verde
gradient progress bar and CTAs, blurred color blobs behind the card,
bigger type, colored accent per option card. Keep new quiz screens
consistent with this rather than reverting to flat navy/white/slate.

`QuizEngine.jsx` stays fully generic — no Plano.Money-specific copy or
logic in it. Everything content-specific (questions, profiles,
`deseoLabels`, images) lives in the quiz's own data file
(`planoMoneyQuiz.js`). A future quiz for a different app or niche is a
new data file with the same shape; the engine doesn't change.

## Checkout links (resolved)

`CHECKOUT_URL` (mensual) and `CHECKOUT_URL_ANNUAL` (anual) in
`SalesPagePlanoMoney.jsx` are both real Hotmart links now, each tied to
its own oferta code (`8ghbb70e` mensual, `vfcoe73u` anual) — Hotmart
confirmed monthly and annual are two fully separate offers, each with its
own checkout link and its own independent Página de Pago Personalizada
(order bump / upsell / downsell config); it does not support one checkout
with a plan switcher. If a third plan is ever added, it needs its own
oferta + checkout link the same way, not a shared one.

## Post-purchase funnel: upsell → downsell → gracias

After the Hotmart checkout, the funnel is: Etapa 1 Upsell (Domina Tu
Dinero) → **both** Sí and No lead to Etapa 2 Downsell (Emoción y
Dinero) → Sí/No there lead to the final gracias page. Deliberately
**not** gating the second product behind "only if they declined the
first" — it's a different product, not a cheaper fallback of the same
one, so there's no reason not to offer it to everyone regardless of the
first answer. Apply this same "offer both" logic to any future
upsell+downsell pair unless the second product genuinely is a discounted
version of the first (in which case the classic decline-only gate makes
sense).

Standalone pages involved, all in `src/pages/`, all registered in
`main.jsx`:
- `UpsellDominaTuDineroPage.jsx` / `DownsellEmocionYDineroPage.jsx` — just
  mount Hotmart's `checkoutElements` widget (`<div id="hotmart-sales-funnel">`
  + the script from `checkout.hotmart.com`). **Confirmed by directly
  testing Hotmart's own "Editar etapa" wizard**: the only editable fields
  are the accept/decline button label text — no headline, no body copy,
  nothing else. Any real persuasion has to live on `TransicionPage.jsx`,
  shown right before the widget, not on the widget page itself.
- `TransicionPage.jsx` — one file, three variants via `?t=` (`post-compra`,
  `post-upsell-si`, `post-decline`), each with a real product-grounded
  pitch (not a placeholder line) and each with a **different angle** —
  first offer / already-said-yes cross-sell / already-said-no
  alternative — so they don't feel like the same pitch repeated. All
  three share one narrative thread (currently: the "light" Plano.Money
  turns on your spending, and "the second before you spend" as the real
  battlefield neither the light nor the method fully covers) instead of
  being unrelated pitches — do this for any future transition-screen set
  too, don't just write three independent blurbs. Deliberately austere
  design (white bg, logo, progress bar, one CTA) — the screen's job is to
  set up the next decision, not to sell with testimonials/benefit lists.
  No fabricated "X% of buyers also add this" stat anywhere — no real
  number to back that up yet.
- `GraciasPage.jsx` — universal welcome content (checklist, first steps
  in the app, a founder welcome message) shared by all 3 terminal
  branches, with only a small top confirmation banner that varies by
  `?o=` param. Text stand-in for a founder welcome video for now
  (`WELCOME_MESSAGE`, first person, real founder) — swap for a real
  video later using the same pattern as `DemoVideo` in
  `SalesPagePlanoMoney.jsx`, don't generate one.

**Hotmart funnel-builder UI limitation, confirmed by hands-on testing**:
once a Sí/No branch already has a destination connected, there is no way
found in the UI to reconnect it to something else (hovering shows a
prohibited-cursor icon on "Crear nueva etapa"; the pencil-edit wizard for
an existing etapa only has button-text fields, never a destination
picker, confirmed by walking every screen of that wizard start to
finish). If inserting an intermediate "Página de Agradecimiento" step
between two already-connected etapas is needed, do it **before**
connecting them the first time, not after — reconnecting later may
require deleting and rebuilding that portion of the funnel. Hotmart
support's canned responses on this were generic and inconsistent with
the actual product behavior across multiple attempts; don't trust a
support reply describing a screen that direct testing didn't find —
verify by clicking through yourself first.

**Known Hotmart platform bug, reported to their support, not fixable
from our side**: order bump products on a Página de Pago Personalizada
checkout got added to a real test purchase even though the buyer never
checked/clicked the order bump's "Añade a tu compra" button. That
checkout page is 100% Hotmart-hosted, no code of ours touches it —
nothing to fix here until Hotmart confirms a resolution.

## Tracking: Meta Pixel

Pixel ID `1716892246420620` (not secret, fine hardcoded in front-end
code, same as any Pixel ID). Base install is in `index.html`
(`<head>` for the script, `<body>` for the `<noscript>` fallback —
`<noscript><img>` is invalid inside `<head>` and breaks Vite's HTML
parser, keep that split). Fires `PageView` automatically on every page.

`src/lib/fbPixel.js` has two helpers, reused across pages:
- `trackFbEvent(name, params)` — for Meta's ~17 standard event names
  (`Lead`, `InitiateCheckout`, `Purchase`, etc.), calls `fbq('track', ...)`.
- `trackFbCustomEvent(name, params)` — for anything else, calls
  `fbq('trackCustom', ...)` so it's categorized correctly in Events
  Manager instead of showing as unrecognized.

Current events, useful as the template for any future funnel:
- `Lead` — fired in `QuizEngine.jsx` when the person submits the email
  step (the moment a lead is actually captured).
- `InitiateCheckout` — fired on every "Quiero ordenar mis finanzas"
  CTA click in `SalesPagePlanoMoney.jsx` (all 5 buttons, plus each
  price-box card), right before the external navigation to Hotmart.
- `QuizStep` (custom) — fired in `QuizEngine.jsx` on every step index
  change, with `{ quiz_id, step_number, step_key, total_steps }`. This
  is what makes it possible to see, per ad/creative in Meta Ads
  Manager, exactly which question people drop off at — not just
  whether they finished the quiz or not. `QuizEngine.jsx` stays
  generic (reads `data.quizId` from the content file), so this comes
  for free on any future quiz built on the same engine — no extra work
  needed per quiz.

For visual/session-level insight (heatmaps, scroll depth, session
recordings) beyond what the Pixel's event counts show, the plan is
Microsoft Clarity (free, no session cap unlike Hotjar's free tier) —
not installed yet, needs a Project ID from clarity.microsoft.com when
that's set up.

## Gamification pattern: `Reto21Dias.jsx`

`src/components/resources/Reto21Dias.jsx` (shared between the main
app's Recursos tab and `BonoReto21DiasPage.jsx`) is the reference for
any future daily-challenge-style content: weekly progress bars, a
streak counter (current + best), a GitHub-style calendar heatmap of
real completion dates, and an achievements grid (locked/grayscale
until actually earned, based on real computed stats — never a fake
"unlocked" state). Data model stores `{ [dayNumber]: 'YYYY-MM-DD' }`
(the real calendar date each day was completed), not just a boolean —
that's what makes streaks and the calendar possible; a boolean-only
model can't answer "how many days in a row." Reuse this component
structure (weekly progress + streak + calendar + achievements) for any
future multi-day program instead of building a plain checklist again.
