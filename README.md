# Double Shot: Website Redesign Concept

A frontend concept for Double Shot Coffee, Lahore. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion and Lenis.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Animated product hero, story, shop shelf, precision, RickShot, branches, Instagram |
| `/menu` | Filterable product menu with a working cart, plus the bar drinks list |
| `/rickshot` | Mobile brew bar packages with a live estimate builder |
| `/journey` | Timeline, concept, vision and workshops |
| `/locations` | All 8 branches with Google Maps links |
| `/contact` | Contact channels and a demo message form |
| `/login`, `/signup`, `/account` | Demo authentication (session only) |
| `/checkout` | Demo checkout, cash on delivery or pickup |

## Content and data

All products, prices, branches and story copy come from doubleshot.com.pk and @doubleshotlhr. Sources for each item are in `scraped-data.md`. Images are official product and Instagram photos. The hero cutouts in `public/img/hero-*.png` are background-keyed versions of the official product shots; no pixels were generated.

## Demo behaviour

- The cart and sign-in live in `sessionStorage`, so they last for the browser session.
- No data is sent anywhere. Forms show a success state only.
- All products are shown as available. The live site currently marks them out of stock.
