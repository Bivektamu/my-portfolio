# Verify: Performance optimization v2 · Feature 39 · updated 2026-08-06
_Steps derived from the feature's done-when conditions. `/verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Run Lighthouse (mobile + desktop) in Chrome DevTools → Performance score is 90+ on both
- [ ] Open the home page with DevTools Network tab set to "Slow 3G" → the snake game placeholder (dark square) appears before the game loads; the game canvas replaces it without layout shift
- [ ] Check the Network tab font requests → only 3 Fira Code weights (400, 500, 700) and 4 Inter weights (400, 500, 600, 700) are downloaded, not 9 total
- [ ] Type into the contact form name, email, and message fields quickly → the code snippet panel updates but the form inputs stay responsive (no typing lag)
- [ ] Navigate to /about → gist cards show real avatar images (not empty colored circles) loaded via next/image
- [ ] Navigate to a non-existent route → 404 page loads with the correct Cache-Control headers on static assets

## Commands

- [ ] `npm run build` → completes with "✓ Compiled successfully" and no errors
- [ ] `npm test` → all 110 tests pass
- [ ] `curl -I http://localhost:3000/images/fav.png` → response includes `Cache-Control: public, max-age=31536000, immutable`

## Acceptance-criteria coverage

- Lighthouse 90+ → covered by Lighthouse step
- Snake game does not block first paint → covered by Slow 3G + placeholder step
- Font loading uses optimal strategy → covered by font weight count step
- Interaction to Next Paint under 200ms → covered by contact form typing step
