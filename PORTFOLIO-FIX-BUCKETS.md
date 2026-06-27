# Portfolio Fix Buckets -- Prioritized by Severity & UX Impact

Use this file in a new Claude Code session scoped to `puneetindeelhi940/portfolio`.

Paste each bucket as a prompt, review the explanation, approve, then move to the next.

---

## BUCKET 1: WCAG Level A Failures (CRITICAL -- Breaks Accessibility Compliance)

### Why this bucket first
These are **legal compliance failures** under WCAG 2.2 Level A -- the minimum standard. Any accessibility audit or VPAT assessment would flag these as blockers. They affect screen reader users, keyboard-only users, and voice control users.

### Issues in this bucket

**1a. Add `<main>` landmark to all pages**
- Every page wraps content in `<div class="page">` with no `<main>` element
- Screen readers use `<main>` to jump directly to primary content
- Pages affected: home.html, bio.html, work.html, contact.html, Altermayur.html, case-dell-chatbot.html, case-boeing-taam.html, ai-lab.html, and all other HTML pages
- Fix: Wrap all content between `</header>` and `<footer>` in `<main id="main-content">`
- Effort: ~30 minutes across all pages

**1b. Add skip navigation link to all pages**
- No skip link exists anywhere in the codebase
- Keyboard users must tab through entire topbar nav (7+ links + theme toggle) on every page to reach content
- Fix: Add `<a href="#main-content" class="skip-link">Skip to main content</a>` as first child of `<body>` on every page. Add CSS to visually hide but show on focus:
```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
  height: auto;
  padding: 12px 24px;
  background: var(--bg);
  color: var(--fg);
  z-index: 100;
  font-size: 14px;
  border: 2px solid var(--signal);
}
```
- Effort: ~1 hour

**1c. Add visible focus indicators to all interactive elements**
- Only `.theme-toggle__opt:focus-visible` has a focus style in site.css
- All buttons, nav links, card links, dossier rows, TOC links, footer links, gate submit have NO visible focus indicator
- Fix: Add to site.css:
```css
a:focus-visible,
button:focus-visible,
.btn:focus-visible,
.card--link:focus-visible,
.dossier:focus-visible,
.toc a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--signal);
  outline-offset: 2px;
}
```
- Effort: ~30 minutes

**1d. Fix `outline: none` on form inputs**
- site.css and 8+ pages use `outline: none` with only a subtle border-color change on focus
- Fix: Replace `outline: none` with proper `:focus-visible` outline (covered by 1c above), remove all `outline: none` declarations
- Effort: ~30 minutes

**1e. Fix ARIA radiogroup containing non-radio `<a>` element**
- home.html theme toggle: `<span role="radiogroup">` contains `<a href="playful.html">PLAYFUL</a>` which has no `role="radio"` or `aria-checked`
- Fix: Move the PLAYFUL link outside the radiogroup span, or convert it to a button with `role="radio"`
- Effort: ~15 minutes

---

## BUCKET 2: Color Contrast & Typography (CRITICAL -- Affects Readability)

### Why this bucket second
These affect every single page and every user. Small text + low contrast = unreadable content for anyone with even mild vision impairment, in bright sunlight, or on a low-quality display.

### Issues in this bucket

**2a. Fix `--faint` contrast ratio in dark theme**
- Current: `--faint: oklch(56% 0.018 175)` on `--bg: oklch(17% 0.022 175)` = ~4.2:1 (need 4.5:1)
- Affects 17+ elements: eyebrows, dates, labels, metadata, form labels, patent IDs, timeline durations
- Fix: Change to `--faint: oklch(62% 0.018 175)` in `:root`
- Effort: 1 line change

**2b. Fix `--faint` contrast ratio in forest (light) theme**
- Current: `--faint: oklch(48% 0.060 150)` on `--surface: oklch(96% 0.013 150)` = ~4.1:1
- Fix: Change to `--faint: oklch(42% 0.060 150)` in `[data-theme="forest"]`
- Effort: 1 line change

**2c. Increase minimum font sizes from 9-10px to 11-12px**
- 9px: `.topbar__meta .theme-toggle__opt`
- 10px: 17 elements including tags, gate submit, labels, dates, metadata, form labels, patent IDs
- These carry meaningful information (not decorative)
- Fix: Bump all 9px to 10px, all 10px to 11px minimum. Consider 12px for form labels
- Effort: ~1 hour (find and update all instances)

---

## BUCKET 3: GitHub Pages & SEO Foundation (HIGH -- Affects Discoverability)

### Why this bucket third
These are quick wins that affect whether your site works properly on GitHub Pages and whether search engines can find and index your content.

### Issues in this bucket

**3a. Add `.nojekyll` file**
- Without it, Jekyll ignores underscore-prefixed files (like `project/_pptx_export.html`)
- Fix: Create empty `.nojekyll` at repo root
- Effort: 1 minute

**3b. Create custom 404.html**
- Visitors who mistype URLs see GitHub's generic 404 with no nav back to your portfolio
- Fix: Create branded 404.html matching site design with links to Home, Work, Bio, Contact
- Effort: ~1 hour

**3c. Complete sitemap.xml**
- Currently lists only 5 pages; missing 15+ public pages
- Fix: Add all public HTML pages with `<lastmod>` dates
- Effort: ~30 minutes

**3d. Add canonical tags to 4 missing pages**
- feediq.html, tct.html, puneets-news-terminal.html, Altermayur.html
- Effort: ~15 minutes

**3e. Add OG/Twitter tags to 3 missing pages**
- feediq.html, tct.html, Altermayur.html lack social sharing metadata
- Effort: ~30 minutes

**3f. Add JSON-LD Person schema to home.html and bio.html**
- Critical for AI search engines (ChatGPT, Perplexity, Google AI Overviews)
- Fix: Add `<script type="application/ld+json">` with Person schema including name, jobTitle, worksFor, sameAs (LinkedIn), knowsAbout, patent references
- Effort: ~1 hour

**3g. Add Article/CreativeWork schema to case study pages**
- Effort: ~1 hour

**3h. Fix heading hierarchy (H1 → H4 skip)**
- home.html jumps from H1 to H4; section titles use `<span>` instead of heading elements
- Fix: Use proper H2/H3 hierarchy; convert `<span class="shead__title">` to heading elements
- Effort: ~2 hours

---

## BUCKET 4: Security Fixes (HIGH -- Protects Users & Credentials)

### Why this bucket fourth
These prevent credential exposure and protect users from XSS.

### Issues in this bucket

**4a. Remove committed chat logs exposing passcode**
- `chats/chat1.md` contains `Default code: growthecore` in plaintext
- Fix: Delete chats/ directory, add to .gitignore
- Effort: ~15 minutes

**4b. Add Content-Security-Policy meta tag**
- No CSP combined with extensive innerHTML usage across 10+ pages
- Fix: Add `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:;">` to all pages
- Effort: ~1 hour

**4c. Add SRI to JSZip CDN script**
- skills-for-india.html, skills-for-global-builders.html, skills-lab.html load JSZip without integrity hashes
- Fix: Add `integrity` and `crossorigin="anonymous"` attributes
- Effort: ~15 minutes

**4d. Fix empty Formspree form ID**
- skills-for-india.html, skills-for-global-builders.html: `action="https://formspree.io/f/"` (empty ID)
- Users who submit get an error from Formspree
- Fix: Add real Formspree ID or remove form action and use mailto fallback
- Effort: ~15 minutes

---

## BUCKET 5: Responsive & Mobile UX (HIGH -- Affects Mobile Users)

### Issues in this bucket

**5a. Add mobile navigation pattern**
- Nav scrolls horizontally at <700px with no affordance
- Fix: Either implement hamburger toggle or add scroll fade indicators
- Effort: ~4 hours for hamburger, ~1 hour for scroll indicators

**5b. Add responsive breakpoints for utility grid classes**
- `.grid-4`, `.grid-6` stay at 4/6 columns on 320px phones
- Fix: Add `@media (max-width: 700px) { .grid-2,.grid-3,.grid-4,.grid-6 { grid-template-columns: 1fr; } }`
- Effort: ~30 minutes

**5c. Add intermediate breakpoint for dossier grid**
- 5-column grid jumps straight to 1 column at 1100px; no tablet layout
- Fix: Add breakpoint at ~900px
- Effort: ~30 minutes

**5d. Fix gate form width on medium screens**
- `width: 50%` is tight between 720-1000px
- Fix: Use `width: max(220px, 65%)`
- Effort: ~5 minutes

---

## BUCKET 6: Design System Consistency (MEDIUM -- Affects Maintainability)

### Issues in this bucket

**6a. Fix CSS comment describing wrong color**
- Comment says `--signal` is "warm gold" (hue 85) but actual value is teal/green (hue 168)
- Effort: 1 line

**6b. Convert hardcoded colors to CSS custom properties**
- `.gate { background: #1a1612 }`, `.gate__tagline { color: #b88a5e }`, multiple inline oklch values
- Some don't update on theme switch
- Effort: ~2 hours

**6c. Fix `--f-mono` to use actual monospace font**
- Currently `--f-mono: 'Segoe UI', sans-serif` -- not monospace
- Fix: `--f-mono: 'SF Mono', 'Cascadia Code', 'Consolas', monospace`
- Effort: 1 line

**6d. Fix `prefers-reduced-motion` to preserve state transitions**
- Currently kills ALL transitions including helpful hover/focus feedback
- Fix: Use `transition-duration: 0.01s !important` instead of `transition: none !important`
- Effort: 1 line

**6e. Add `prefers-color-scheme` auto-detection**
- Users with OS light mode see dark theme; no auto-adaptation
- Fix: Add `@media (prefers-color-scheme: light) { :root:not([data-theme]) { /* forest vars */ } }`
- Effort: ~30 minutes

**6f. Remove wasted backdrop-filter on opaque topbar**
- `backdrop-filter: blur(8px)` on fully opaque background has no effect
- Fix: Make background semi-transparent or remove backdrop-filter
- Effort: 1 line

---

## BUCKET 7: JavaScript & Interaction Fixes (MEDIUM -- Affects Functionality)

### Issues in this bucket

**7a. Add keyboard handlers for click-only interactive elements**
- vigyan-setu.html, skills-lab.html, skills-for-india.html, situation-simulator.html, tct.html use click-only handlers
- Fix: Add keydown handlers for Space/Enter on all interactive elements
- Effort: ~2 hours

**7b. Add visibility pause to animation loops**
- situation-simulator.html: 60ms setInterval and requestAnimationFrame loops run in hidden tabs
- Fix: Add `document.hidden` checks following globe-fx.js pattern
- Effort: ~30 minutes

**7c. Add error fallback UI for external API calls**
- puneets-news-terminal.html: ipapi.co and RSS calls with no user-visible error state
- Fix: Add "Unable to load" fallback message
- Effort: ~1 hour

**7d. Add form submission debounce**
- skills-for-india.html, skills-for-global-builders.html: no double-submit protection
- Fix: Disable submit button during fetch
- Effort: ~30 minutes

**7e. Add global error handler**
- No window.onerror or unhandledrejection handlers
- Fix: Add minimal handler
- Effort: ~15 minutes

---

## BUCKET 8: Content & Link Cleanup (LOW -- Polish)

### Issues in this bucket

**8a. Fix `href="#"` dead link in Altermayur.html header**
- `<a href="#" class="am-header__name">` -- link to home.html instead
- Effort: 1 line

**8b. Rename Altermayur.html to lowercase**
- Case-sensitive filename can cause 404s
- Effort: ~15 minutes (rename + update all references)

**8c. Add descriptive alt text to content-bearing images**
- case-dell-chatbot.html: team photos and milestone artifacts have `alt=""`
- Effort: ~30 minutes

**8d. Standardize case study links (remove redirect shim)**
- Some pages link to case-dell-genai.html (redirect) vs case-dell-chatbot.html (direct)
- Fix: Point all to case-dell-chatbot.html directly
- Effort: ~15 minutes

**8e. Remove deprecated `<meta name="keywords">` from news terminal**
- Effort: 1 line

**8f. Remove backup file from repo**
- bio-html-backups-19th-June-2026.html is publicly accessible
- Effort: ~5 minutes

**8g. Move inline styles to CSS classes**
- 19+ files with heavy inline styles bypassing token system and media queries
- Effort: ~4 hours

**8h. Consolidate duplicate site structure (root vs project/site/)**
- Two parallel copies with different gate logic
- Effort: ~2 hours

**8i. Add `aspect-ratio` / `height: auto` to images for CLS prevention**
- Effort: ~30 minutes

---

## How to Use in New Session

Paste each bucket one at a time as a prompt:

```
Fix BUCKET 1 from PORTFOLIO-FIX-BUCKETS.md -- WCAG Level A failures.
Add <main> landmarks, skip nav links, focus indicators, fix outline:none, fix ARIA radiogroup.
Apply to ALL HTML pages in the repo.
```

Then review the changes, approve, and move to the next bucket.
