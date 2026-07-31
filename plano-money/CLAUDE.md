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

## Known outstanding item

`CHECKOUT_URL` and `CHECKOUT_URL_ANNUAL` in `src/pages/SalesPagePlanoMoney.jsx`
are still both the same placeholder (`https://pay.hotmart.com/P106882`).

Important: Hotmart confirmed monthly and annual are two fully separate
offers, each with its own checkout link AND its own independent Página de
Pago Personalizada (order bump / upsell / downsell config) — Hotmart does
not support one checkout with a plan switcher. So:

1. Get both real checkout links (mensual and anual) from Hotmart's
   Ofertas tab and drop them into `CHECKOUT_URL` /
   `CHECKOUT_URL_ANNUAL`, in both repos.
2. Confirm the order bump / upsell / downsell Página de Pago
   Personalizada has been set up on **both** offers, not just the
   monthly one — otherwise annual buyers coming through `/oferta`'s
   annual link silently skip the order bump/upsell/downsell.
