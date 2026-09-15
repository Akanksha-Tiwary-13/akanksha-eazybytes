# Responsive & Cross-Browser Test Report

Tested via automated Playwright (Chromium 141.0.7390.37) in a headless sandbox. This is the
**only** browser engine actually available in this environment. Firefox, Edge, and Safari were
**not installed and not tested** — see the honesty note at the bottom before trusting any
"NOT TESTED" row as a pass.

## Method

1. **Overflow sweep**: for every page below, at every breakpoint below, loaded the page and
   compared `document.documentElement.scrollWidth` against `clientWidth`. Any difference > 1px
   means horizontal overflow. This ran as a single automated script — 13 pages × 11 breakpoints
   = 143 checks, zero manual judgment involved for this part.
2. **Visual spot-check**: full-page screenshots at one representative mobile (375px), tablet
   (768px), and desktop (1440×900) size per page, reviewed by eye for clipping, broken grids, or
   illegible text that a scrollWidth check wouldn't catch.
3. **Keyboard/interaction check**: tabbed to the mobile menu button and opened it via Enter,
   confirmed `aria-expanded`/`aria-controls` wiring.
4. **Auth-gated pages** (Admin *, Messages) were tested by logging in as the seeded ADMIN account
   first, in the same automated pass.

Breakpoints tested: **Desktop** 1920×1080, 1440×900, 1366×768, 1280×720. **Tablet** 768w×1024h,
1024w×768h. **Mobile** 320w, 375w, 390w, 414w, 430w (each ~700–850px tall).

## Results

| Page | Mobile | Tablet | Desktop | Chrome | Firefox | Edge | Safari |
|---|---|---|---|---|---|---|---|
| Home | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Projects | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Project Details | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Blog | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Blog Post | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Contact | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Login (admin) | PASS | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Admin Dashboard | PASS (fixed) | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Admin Projects (list + form) | PASS (fixed) | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Admin Blog | PASS (fixed) | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Admin Skills (list + form) | PASS (fixed) | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Admin Settings | PASS (fixed) | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |
| Admin Messages | PASS (fixed) | PASS | PASS | PASS | NOT TESTED | NOT TESTED | NOT TESTED |

"PASS (fixed)" = failed on first pass, root-caused, fixed, then re-verified passing. See below.

There is no "About" page as a separate route in this project — the about section lives on the
Home page (hero + bio), so it's covered under "Home" above, not a separate row.

## Problems found

**1. Horizontal overflow on every Admin page + Login, at all mobile widths ≤414px (real bug).**

`AdminLayout`'s mobile top navigation (`Overview / Projects / Skills / Blog / Messages / Settings`)
has `overflow-x-auto` so it's meant to scroll horizontally on narrow screens. But its parent
(`<div className="flex-1">`) is a flex item with no `min-width` set. Flex items default to
`min-width: auto`, meaning they refuse to shrink below their content's natural width — so instead
of the nav scrolling internally, the *entire column* (and the whole page) grew to 423px wide to
fit the nav's content, even on a 320px viewport. This affected every page under `/admin` and the
login page's post-authentication redirect target.

Confirmed via `getBoundingClientRect()` on every element — the nav, its header sibling, and the
`<main>` all reported the same fixed 423px width regardless of viewport.

*Fix*: added `min-w-0` to that flex item (`client/src/components/layout/AdminLayout.tsx`). One
class, no visual change on tablet/desktop, no change to the sidebar layout. Re-ran the full sweep
afterward — 0/143 checks now show overflow.

**2. No `prefers-reduced-motion` support (explicitly requested, not a bug that was "found" so much as a gap).**

Framer Motion animations (page fade-ins, skill bar fills, hover states) ran unconditionally
regardless of the OS-level reduced-motion setting.

*Fix*: wrapped the app root in Framer Motion's `<MotionConfig reducedMotion="user">`
(`client/src/main.tsx`). This makes every `motion.*` element in the app respect
`prefers-reduced-motion: reduce` automatically — no animation was removed, they're just skipped
for users who've asked the OS not to show them. Verified with a Playwright browser context
launched with `reducedMotion: 'reduce'` (Chromium's emulation of the OS setting): content that
normally fades in via `motion.div` rendered at full opacity immediately, with no animation delay
and no stuck-invisible content. Not verified against a physical OS-level toggle outside of
Chromium's emulation.

**3. Minor accessibility gaps, fixed alongside the above:**
- Settings page's dynamic social-link inputs had `<Label htmlFor>` pointing at IDs that no
  `<Input>` actually had — labels weren't programmatically associated with their fields. Added
  matching `id` attributes.
- The two `<nav>` landmarks in the public Navbar (desktop row, mobile dropdown) had no
  distinguishing `aria-label`, which is ambiguous for screen reader users navigating by landmark.
  Added `aria-label="Primary"` / `aria-label="Mobile"`.
- The mobile menu toggle button had no `aria-expanded`/`aria-controls`, so a screen reader user
  couldn't tell whether the menu was open. Added both, wired to the mobile nav's new `id`.

## What was NOT changed

- Touch target sizing: admin icon buttons (edit/delete) are ~32px (8px padding + 16px icon).
  That's below the 44px AAA guideline but comfortably above the 24px minimum WCAG 2.5.8 (AA)
  actually requires. Left as-is rather than inflating button padding and changing the visual
  density of dense list rows, per the "don't unnecessarily change the UI" instruction — flagging
  it here rather than silently deciding it doesn't matter.
- No literal `<table>` elements exist anywhere in the CMS (projects/skills/blog/messages are all
  card lists, not tables), so the "wrap large tables in horizontal scroll" requirement doesn't
  apply to this codebase as built.

## Browser compatibility

**Chrome/Chromium: actually tested**, as above (141.0.7390.37, headless, this sandbox).

**Firefox, Edge, Safari: NOT TESTED.** Neither is installed in this environment and none were
reachable — marking these anything but "NOT TESTED" would be fabricated. What I can say
honestly, from reading the code rather than running it: the app uses only broadly-supported,
non-experimental CSS (custom properties, Flexbox, CSS Grid, `sticky` positioning,
`backdrop-filter` for the navbar blur) and standard DOM APIs (`IntersectionObserver` via Framer
Motion, WebSocket via Socket.IO's fallback). None of these need a vendor prefix in any current
Chrome, Firefox, Edge, or Safari release. That's a reasonable expectation of compatibility, not a
substitute for actually opening the site in those browsers — please verify Safari/iOS in
particular before shipping, since it's historically the most likely to disagree with Chromium on
edge cases (`backdrop-filter`, `100vh` on mobile Safari, date/color input styling).

## Accessibility improvements made

- `prefers-reduced-motion` now respected app-wide (see above).
- Fixed unassociated form labels on the Settings page's social-link fields.
- Added distinguishing `aria-label`s to the two navbar landmarks.
- Added `aria-expanded` / `aria-controls` to the mobile menu toggle.
- Confirmed (pre-existing, not new): every form field already pairs `<Label htmlFor>` with a
  matching input `id`; all images (avatar, project images, blog covers) have meaningful `alt`
  text; heading hierarchy is a single `<h1>` per page with nested `<h2>`/`<h3>`; icon-only buttons
  (theme toggle, edit/delete, menu toggle) all carry `aria-label`; focus rings are visible via the
  `accent-ring` utility (`outline: 2px solid` the accent color) rather than removed.
- **Not done**: no automated contrast-ratio audit (e.g. axe-core) was run — legibility was
  reviewed by eye in the screenshots only, in both the dark and light themes. Text/background
  pairs looked clearly legible in both, but that's a visual judgment, not a measured contrast
  ratio.

## Remaining limitations (stated plainly, not glossed over)

- **Firefox, Edge, Safari were not tested at all** — no access to those engines in this sandbox.
  Everything under those columns is a code-reading judgment, not a test result.
- **Physical mobile devices were not tested.** All "mobile" results are Chromium's viewport
  emulation at the given widths, not a real iPhone/Android device, so touch-specific quirks
  (momentum scrolling, on-screen keyboard covering inputs, notch/safe-area insets) are unverified.
- **`prefers-reduced-motion` was verified via Chromium's emulation** (Playwright
  `reducedMotion: 'reduce'` context), not a physical OS-level setting toggle — the two should be
  equivalent, but the latter wasn't independently confirmed.
- **No automated accessibility scan** (axe, Lighthouse) was run; the a11y pass above was a manual
  code + screenshot review against a checklist, not a tool-verified audit.
- **Color contrast ratios were not numerically measured.**
