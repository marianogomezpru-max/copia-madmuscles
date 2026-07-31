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
- Two-repo sync discipline still applies: this workspace
  (`marianogomezpru-max/Plano.Money`, `main`) mirrors
  `/home/user/copia-madmuscles/plano-money`
  (`marianogomezpru-max/copia-madmuscles`,
  `claude/plano-money-app-review-v7ck4g`) — copy, build both, commit with
  matching messages, push both.

## Known outstanding item

`CHECKOUT_URL` in `src/pages/SalesPagePlanoMoney.jsx` and
`src/quizzes/planoMoneyQuiz.js` is still a placeholder
(`https://pay.hotmart.com/P106882`). Every CTA button on `/oferta`
currently points nowhere real. Replace with the actual Hotmart checkout
URL for the Plano.Money product as soon as it's provided, in both files,
in both repos.
