# Verified Astrology

Build a mobile-first web app called AstroLive Verified.

CONCEPT: This is not a generic horoscope app. Its core idea is that astrology

should be verifiable. Every astrologer's predictions are logged, later

confirmed true or false by the user, and rolled up into a public Trust Score

(like a credit score for astrologers). The tagline is "Astrology you can

actually verify."

DESIGN SYSTEM (apply everywhere, consistently):

- Background: deep cosmic indigo/purple gradient (#1A1033 to #2D1B4E), with a

  subtle starfield texture on key screens (landing, onboarding).

- Primary accent: violet/purple (#6B3FA0).

- Secondary accent: warm gold (#B8860B), reserved specifically for anything

  related to trust/verification — scores, badges, the "verified" checkmark

  seal icon.

- Verification badge: a small circular checkmark-seal icon in gold, used

  consistently next to every trust score or verified prediction, on every

  screen. Define it once as a reusable component.

- Cards: rounded corners (16px), soft glassy/translucent purple background,

  subtle glow on hover.

- Typography: clean modern sans-serif, generous spacing, headline weight

  bold, body regular.

- Keep the palette and components consistent site-wide — build a small

  shared design system (colors, card style, button style, badge component)

  rather than restyling each screen individually.

STRUCTURE: Set up client-side routing with a persistent bottom nav bar (on

mobile) / side nav (on desktop) with 5 destinations: Home (Daily Check-In),

Leaderboard, Astra (chat), Profile, Pricing. Build these first:

1. A landing page with the tagline above, a short explanation of how

   verification works, and a "Get Started" button.

2. A sign-up / login screen (email + password).

Use mock/placeholder data for now — no backend wiring yet, we'll connect

Supabase in the next step.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ac479a89-2b80-4b93-97c9-31c3c318bfcc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
