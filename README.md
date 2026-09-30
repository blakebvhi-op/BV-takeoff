# BVHI Takeoff

Quantities from EagleView reports, with material profiles. Runs entirely in the browser — no server, no account.

## Run it

    npm install
    npm run dev        # opens on http://localhost:5173
    npm run build      # static site in dist/ — host anywhere, or wrap with Capacitor

Stack: React 18, Vite 6, Tailwind 4. No backend. Rule edits and profile choices save in the browser (localStorage).

## Layout

    src/core/fields.js            the measurement schema — every source produces this, every rule reads it
    src/core/ingest/eagleview.js  EagleView JSON → Takeoff. The only file that knows EagleView's schema.
    src/core/engine.js            formula → waste → per-unit coverage → round → pack
    src/core/profiles.js          material profiles (Vinyl D4/D5/Dutch/B&B, LP SmartSide lap 6/8 + panel,
                                  fiber cement, steel; arch/3-tab/standing seam; alum/LP soffit-fascia)
    src/ui/                       the thin shell — App.jsx and a storage hook
    public/sample-eagleview.json  the Germantown sample

`src/core` has zero React or browser dependencies. To graft into another app, import
`parseEagleView`, `runRules` and the profiles, and replace `src/ui/useRules.js` with
whatever storage that app uses (Supabase, etc.). `useRules` is the only place localStorage is touched.

## Adding a material

Add an object to the right array in `profiles.js`:

    { id: "my-product", label: "Shown in the picker", desc: "one line",
      rules: [ S("Item", "formula", waste%, perUnitCoverage, pack, "up", "unit", "basis note") ] }

Formulas are plain math over the field names in `fields.js`. `per` is what one unit covers
(100 for a square, 10 for a 10-ft stick, 32 for a 4x8 sheet). `pack` rounds up to a multiple.

## Adding a source (QuickMeasure, hand-traced PDF, ...)

Write `src/core/ingest/<source>.js` that returns the same shape as `emptyTakeoff()` in `fields.js`.
Nothing else changes.

## PWA on GitHub Pages

Push to `main` and `.github/workflows/deploy.yml` builds and publishes to
`https://<you>.github.io/<repo>/`. One-time setup: repo Settings → Pages → Source: **GitHub Actions**.
Open the URL on your phone → "Add to Home Screen". Works offline after the first load.
The workflow sets `BASE_PATH` to the repo name; on a custom domain leave it unset.
