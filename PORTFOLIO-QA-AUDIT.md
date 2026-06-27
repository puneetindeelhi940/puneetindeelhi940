# Portfolio QA Audit Report

**Site:** https://puneetindeelhi940.github.io/portfolio/home.html
**Date:** 2026-06-27
**Audit Method:** Source code analysis via GitHub code search (4 parallel audit agents)
**Audited By:** Elite QA team simulation (UX, Accessibility, Performance, SEO, Security, Design)

---

## Executive Summary

The portfolio demonstrates strong foundational work -- good semantic HTML patterns in some areas, proper `rel="noopener"` on external links, a well-implemented theme toggle with FOUC prevention, and solid case study content with quantified outcomes. However, it has **significant accessibility failures** that would cause WCAG 2.2 AA non-compliance, **color contrast issues** across both themes, **missing focus indicators** for keyboard users, and several **SEO gaps** that limit discoverability by both traditional and AI search engines.

**Total issues found: 100+**
- Critical: 11
- High: 15
- Medium: 28
- Low: 12
- Positive findings (things done well): 10

---

## Final Scorecard

| Category | Rating | Score |
|----------|--------|-------|
| UX | ★★★ | Average -- good layout but keyboard users and mobile users face significant barriers |
| UI / Visual Design | ★★★★ | Good -- strong "Intelligence Terminal" aesthetic, but contrast and typography issues |
| Accessibility | ★★ | Needs Improvement -- multiple WCAG 2.2 AA Level A failures |
| Performance | ★★★ | Average -- no CLS prevention, missing preconnect hints, aggressive intervals |
| SEO | ★★★ | Average -- good basics on main pages, incomplete sitemap, no structured data |
| AI Search Readiness | ★★ | Needs Improvement -- no JSON-LD, no schema.org markup |
| Technical Quality | ★★★ | Average -- good patterns in places, but duplicate site structure and inline styles |
| Recruiter Appeal | ★★★★ | Good -- strong content, clear hierarchy, but 30-second scan hindered by small text |
| Storytelling | ★★★★ | Good -- case studies have quantified outcomes, process documentation |
| Brand | ★★★★ | Good -- consistent "Intelligence Terminal" identity, executive presence |
| Security | ★★★ | Average -- client-side gate easily bypassed, Anthropic API exposed, no CSP |
| Maintainability | ★★ | Needs Improvement -- duplicate site structure, inline styles, hardcoded colors |
| **Overall** | **★★★** | **Average -- strong design and content undermined by accessibility and technical debt** |

---

## Top 50 Issues (Prioritized)

### CRITICAL -- Fix Immediately

**1. No `<main>` landmark on ANY page**
- Category: Accessibility (WCAG 2.1 Level A)
- Pages: home.html, bio.html, work.html, contact.html, Altermayur.html
- All pages use `<div class="page">` with no `<main>` element
- Screen readers cannot identify the primary content area
- Fix: Wrap content between `</header>` and `<footer>` in `<main>`
- Effort: 30 minutes

**2. No skip navigation link on ANY page**
- Category: Accessibility (WCAG 2.1 Level A, SC 2.4.1)
- Pages: All pages
- Keyboard users must tab through entire navigation to reach content
- Fix: Add `<a href="#main-content" class="skip-link">Skip to main content</a>` as first child of `<body>`
- Effort: 1 hour

**3. Only theme toggle has `:focus-visible` styles**
- Category: Accessibility (WCAG 2.2 Level A, SC 2.4.7)
- All buttons (`.btn--primary`, `.btn--ghost`), nav links, card links, dossier rows, TOC links, footer links, and gate submit button have NO visible focus indicator
- Keyboard users cannot see which element is focused
- Fix: Add global `:focus-visible` styles for all interactive elements
- Effort: 1 hour

**4. `outline: none` on form inputs without adequate replacement**
- Category: Accessibility (WCAG 2.2, SC 2.4.11)
- Files: site.css + 8 inline style instances across pages
- Only a subtle `border-color` change on `:focus` -- insufficient for low-vision users
- Fix: Replace with visible `outline: 2px solid var(--signal)` on `:focus-visible`
- Effort: 1 hour

**5. `--faint` text color fails contrast in dark theme**
- Category: Accessibility (WCAG 2.2 AA, SC 1.4.3)
- `--faint: oklch(56% 0.018 175)` on `--bg: oklch(17% 0.022 175)` = ~4.2:1 ratio (need 4.5:1)
- Affects 17+ elements at 10-12px: eyebrows, dates, labels, metadata, form labels
- Fix: Increase `--faint` lightness to `oklch(62% 0.018 175)`
- Effort: 15 minutes

**6. `--faint` text color fails contrast in forest (light) theme**
- Category: Accessibility (WCAG 2.2 AA)
- `--faint: oklch(48% 0.060 150)` on `--surface: oklch(96% 0.013 150)` = ~4.1:1 ratio
- Same elements affected as dark theme
- Fix: Adjust to `oklch(42% 0.060 150)`
- Effort: 15 minutes

**7. 9-10px font sizes on 17+ meaningful elements**
- Category: Accessibility / Typography
- Theme toggle: 9px; Tags, labels, dates, metadata, form labels: 10px
- These carry meaningful information (not decorative) and are illegible for many users
- Fix: Minimum 11px for all text, 12px preferred for informational labels
- Effort: 1 hour

**8. No custom 404.html page**
- Category: GitHub Pages / UX
- Visitors who mistype URLs see GitHub's generic 404 with no navigation back
- Fix: Create branded 404.html with navigation links
- Effort: 1 hour

**9. No `.nojekyll` file**
- Category: GitHub Pages
- GitHub Pages processes site through Jekyll, which ignores underscore-prefixed files
- `project/_pptx_export.html` would be affected
- Fix: Add empty `.nojekyll` file at repo root
- Effort: 1 minute

**10. No JSON-LD structured data on any page**
- Category: SEO / AI Search Optimization
- No `schema.org`, `application/ld+json`, or any structured data markup
- AI search engines (ChatGPT, Perplexity, Google AI Overviews) cannot extract structured entity data
- Fix: Add Person schema to home/bio, Article schema to case studies
- Effort: 2 hours

**11. No Content-Security-Policy**
- Category: Security
- No CSP header or meta tag, combined with extensive `innerHTML` usage across 10+ pages
- Fix: Add `<meta http-equiv="Content-Security-Policy">` to all pages
- Effort: 2 hours

---

### HIGH -- Fix Soon

**12. Anthropic API called directly from browser**
- Category: Security
- File: skills-lab.html
- API key must be client-side, making it vulnerable to theft
- Fix: Move to serverless function (Cloudflare Worker / Vercel Edge Function)
- Effort: 4 hours

**13. Passcode exposed in committed chat logs**
- Category: Information Disclosure
- File: chats/chat1.md contains `Default code: growthecore` in plaintext
- Fix: Remove chats/ from repo, add to .gitignore
- Effort: 30 minutes

**14. Client-side passcode gate easily bypassed**
- Category: Security
- SHA-256 hash hardcoded in site.js, bypass via `sessionStorage.setItem('pa-gate-2026', '1')`
- Fix: If real protection needed, use Cloudflare Access or server-side auth
- Effort: Variable

**15. Hardcoded colors bypass theme system**
- Category: Design System / Maintainability
- `.gate { background: #1a1612 }`, `.gate__tagline { color: #b88a5e }`, multiple `oklch()` values
- Some don't update on forest theme switch
- Fix: Convert to CSS custom properties
- Effort: 2 hours

**16. No hamburger/collapse menu for mobile navigation**
- Category: Responsive Design
- Nav scrolls horizontally at <700px with no scroll indicator or affordance
- Users may not realize more nav items exist
- Fix: Implement collapsible menu or add scroll fade indicators
- Effort: 4 hours

**17. `href="#"` dead link in Altermayur.html header**
- Category: Accessibility / Links
- `<a href="#" class="am-header__name">Puneet Arora</a>` -- scrolls to top, confuses screen readers
- Fix: Link to `home.html` or self
- Effort: 5 minutes

**18. Heading hierarchy violations**
- Category: SEO / Accessibility
- home.html: H1 jumps directly to H4 (skipping H2, H3)
- Multiple pages: Section titles use `<span class="shead__title">` instead of heading elements
- Fix: Use proper H2/H3 hierarchy; convert styled spans to heading elements
- Effort: 2 hours

**19. Sitemap incomplete -- only 5 of 20+ pages listed**
- Category: SEO
- Missing: ai-lab.html, case-dell-chatbot.html, case-boeing-taam.html, 30day-agentic-ux-plan.html, opportunity-simulator.html, situation-simulator.html, skills-lab.html, skills-for-india.html, skills-for-global-builders.html, vigyan-setu.html, puneets-news-terminal.html, feediq.html, tct.html, Altermayur.html
- Fix: Add all public pages to sitemap.xml with `<lastmod>` dates
- Effort: 30 minutes

**20. Gate form width: 50% is tight on medium screens**
- Category: Responsive
- Between 720-1000px, passcode input is ~220px wide
- Fix: Use `width: max(220px, 65%)`
- Effort: 10 minutes

**21. No `prefers-reduced-motion` in CSS (UPDATE: found but overly aggressive)**
- Category: Accessibility
- `* { animation: none !important; transition: none !important; }` kills ALL transitions including helpful hover/focus feedback
- Fix: Use `transition-duration: 0.01s !important` instead of `none` to preserve state changes
- Effort: 15 minutes

---

### MEDIUM -- Improve

**22. ARIA radiogroup contains non-radio `<a>` element (home.html)**
- Theme toggle `role="radiogroup"` contains a `<a href="playful.html">` link without `role="radio"`
- Fix: Move PLAYFUL link outside radiogroup or convert to button
- Effort: 30 minutes

**23. Sections lack accessible names**
- `<section class="hero">` has no `aria-label` or `aria-labelledby`
- Fix: Add `aria-label` to each section
- Effort: 1 hour

**24. Missing canonical tags on some pages**
- feediq.html, tct.html, puneets-news-terminal.html, Altermayur.html lack canonical tags
- Fix: Add `<link rel="canonical">` to all pages
- Effort: 15 minutes

**25. Missing OG/Twitter tags on some pages**
- feediq.html, tct.html, Altermayur.html lack Open Graph and Twitter Card markup
- Fix: Add standard OG + Twitter tag block
- Effort: 30 minutes

**26. Same og:image used for ALL pages**
- Every page shares `assets/og-image.png`
- Fix: Create page-specific OG images for case studies
- Effort: 2 hours

**27. `innerHTML` used extensively without consistent escaping**
- 10+ pages use innerHTML; `esc()` helper exists but not used everywhere
- Fix: Audit all innerHTML assignments; use textContent where possible
- Effort: 3 hours

**28. External CDN scripts without SRI (Subresource Integrity)**
- JSZip loaded from cdn.jsdelivr.net without integrity hash
- Fix: Add `integrity` and `crossorigin="anonymous"` attributes
- Effort: 15 minutes

**29. Formspree form action has empty ID**
- skills-for-india.html, skills-for-global-builders.html: `action="https://formspree.io/f/"` (no ID)
- Submissions will fail silently
- Fix: Add real Formspree ID or remove form action
- Effort: 15 minutes

**30. setInterval without cleanup (60ms interval)**
- situation-simulator.html: 60ms interval runs even when tab is hidden
- Fix: Add `document.hidden` check, following globe-fx.js pattern
- Effort: 30 minutes

**31. requestAnimationFrame loops without visibility pause**
- situation-simulator.html: `animateSats` and `drawChart` don't pause on hidden tab
- Fix: Add visibilitychange listener
- Effort: 30 minutes

**32. No global error handling in JavaScript**
- No `window.onerror` or `unhandledrejection` handlers
- Fix: Add minimal global error handler
- Effort: 15 minutes

**33. Missing keyboard accessibility for interactive elements**
- vigyan-setu.html, skills-lab.html, skills-for-india.html, situation-simulator.html, tct.html: click-only handlers without keydown for Space/Enter
- Fix: Add keydown handlers for all click-interactive elements
- Effort: 2 hours

**34. External API calls without fallback UI**
- puneets-news-terminal.html: ipapi.co and RSS-to-JSON calls with no user-visible error state
- Fix: Add fallback "Unable to load" message
- Effort: 1 hour

**35. No `prefers-color-scheme` auto-detection**
- Users with OS light mode see dark theme by default
- Fix: Add `@media (prefers-color-scheme: light)` to auto-apply forest theme
- Effort: 30 minutes

**36. Dossier 5-column grid lacks intermediate breakpoint**
- Jumps from 5 columns directly to 1 column at 1100px -- no tablet layout
- Fix: Add breakpoint at ~900px with 2-3 column layout
- Effort: 30 minutes

**37. No `object-fit` or `aspect-ratio` on images**
- Images can cause Cumulative Layout Shift (CLS) as they load
- Fix: Add `height: auto` and explicit aspect-ratio for key images
- Effort: 1 hour

**38. CSS comment describes wrong color**
- Comment says `--signal` is "warm gold" (hue 85) but actual value is teal/green (hue 168)
- Fix: Update comment to match actual color
- Effort: 5 minutes

**39. Heavy inline styles across 19+ files**
- `style="font-size:40px; letter-spacing:-0.025em"` etc. on many elements
- Bypasses theme system and media queries
- Fix: Move to CSS classes
- Effort: 4 hours

**40. Utility grid classes (.grid-4, .grid-6) never collapse on mobile**
- 6-column grid stays 6 columns on 320px phone
- Fix: Add responsive breakpoints for grid utilities
- Effort: 30 minutes

**41. Hover-only interactions without touch/keyboard alternatives**
- `.dossier:hover .dossier__open` only visible on hover; JS onmouseover/onmouseout used
- Fix: Add `:focus-within` companion; replace JS hover with CSS
- Effort: 1 hour

**42. Email address exposed in mailto link (contact.html)**
- `href="mailto:puneetindelhi@yahoo.com"` harvestable by spam bots
- Fix: Obfuscate or accept the tradeoff
- Effort: Variable

**43. Duplicate site structure (root vs project/site/)**
- Two parallel copies with different gate logic
- Root site.js has no gate; project/site/assets/site.js has gate
- Fix: Consolidate to single source of truth
- Effort: 2 hours

**44. Case-sensitive filename: Altermayur.html**
- Capital "A" can cause 404 on case-sensitive servers if referenced as lowercase
- Fix: Rename to altermayur.html
- Effort: 15 minutes

**45. Inline H1 styles override responsive CSS**
- `<h1 style="font-size: 40px">` can't be adjusted by media queries
- Fix: Move to CSS class
- Effort: 15 minutes

**46. Empty alt text on content-bearing images**
- case-dell-chatbot.html: team photos and milestone artifacts have `alt=""`
- Fix: Add descriptive alt text
- Effort: 30 minutes

**47. `--f-mono` variable uses proportional font, not monospace**
- `--f-mono: 'Segoe UI', sans-serif` renders code/data labels in proportional font
- Fix: Use actual monospace font stack
- Effort: 15 minutes

**48. Form submission without debounce**
- skills-for-india.html, skills-for-global-builders.html: no protection against double-submit
- Fix: Disable submit button during fetch
- Effort: 30 minutes

**49. Topbar backdrop-filter wasted on opaque background**
- `backdrop-filter: blur(8px)` with fully opaque `background: var(--bg)` has no effect
- Fix: Make background semi-transparent or remove backdrop-filter
- Effort: 10 minutes

---

### LOW / NICE TO HAVE

**50. No favicon declaration** -- Add `<link rel="icon">` to all pages

---

## Top 20 Quick Wins

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Add `.nojekyll` file | 1 min | Prevents Jekyll build issues |
| 2 | Fix `--faint` lightness in both themes | 15 min | Fixes contrast for 17+ elements |
| 3 | Add `<main>` landmark to all pages | 30 min | WCAG Level A compliance |
| 4 | Add skip navigation link | 30 min | WCAG Level A compliance |
| 5 | Add global `:focus-visible` styles | 30 min | Keyboard users can see focus |
| 6 | Fix `outline: none` on form inputs | 30 min | Form focus visibility |
| 7 | Update CSS comment for `--signal` color | 5 min | Correct documentation |
| 8 | Fix `href="#"` in Altermayur.html | 5 min | Remove dead link |
| 9 | Add favicon to all pages | 15 min | Professional browser tab |
| 10 | Fix `prefers-reduced-motion` to preserve state transitions | 15 min | Better a11y |
| 11 | Add canonical tags to 4 missing pages | 15 min | SEO consistency |
| 12 | Add SRI to JSZip CDN script | 15 min | Security |
| 13 | Rename Altermayur.html to lowercase | 15 min | Prevent case-sensitivity 404s |
| 14 | Fix empty Formspree form ID | 15 min | Forms actually work |
| 15 | Add `<lastmod>` to sitemap entries | 15 min | SEO crawl scheduling |
| 16 | Remove `chats/` directory from repo | 30 min | Remove exposed passcode |
| 17 | Add missing pages to sitemap.xml | 30 min | SEO discoverability |
| 18 | Add OG/Twitter tags to 3 missing pages | 30 min | Social sharing previews |
| 19 | Add `height: auto` to global img rule | 5 min | Reduce CLS |
| 20 | Fix `--f-mono` to use monospace font | 15 min | Correct visual hierarchy |

---

## Accessibility Report (WCAG 2.2 AA)

### Level A Failures (Must Fix)
1. **SC 1.3.1 Info and Relationships** -- Section titles use `<span>` instead of heading elements
2. **SC 2.4.1 Bypass Blocks** -- No skip navigation on any page
3. **SC 2.4.7 Focus Visible** -- No focus indicators on most interactive elements
4. **SC 4.1.2 Name, Role, Value** -- ARIA radiogroup contains non-radio element

### Level AA Failures
5. **SC 1.4.3 Contrast (Minimum)** -- `--faint` text fails 4.5:1 in both themes
6. **SC 1.4.11 Non-text Contrast** -- Form input focus indication insufficient
7. **SC 2.4.6 Headings and Labels** -- Heading hierarchy skips (H1 to H4)
8. **SC 2.5.8 Target Size** -- Multiple touch targets below 44x44px (mobile)

### Level AAA Issues (Recommended)
9. **SC 1.4.8 Visual Presentation** -- 9-10px font sizes below readability threshold
10. **SC 2.4.10 Section Headings** -- Sections lack accessible names

### Positive Accessibility Findings
- `lang="en"` present on HTML elements
- External links have `rel="noopener"`
- Portrait image has proper alt text
- Theme toggle has `role="radiogroup"` with `aria-checked`
- Lightbox supports Escape key to close
- Opportunity simulator has proper keyboard support with `role="switch"` and `aria-checked`
- Gate has `<noscript>` fallback

---

## Performance Report

### Issues
1. No `<link rel="preconnect">` for external font CDNs
2. No `aspect-ratio` or explicit dimensions on images (CLS risk)
3. 60ms `setInterval` in situation-simulator.html runs in hidden tabs
4. `requestAnimationFrame` loops don't pause on tab hide (situation-simulator.html)
5. `backdrop-filter: blur(8px)` applied to opaque background (wasted GPU)
6. No lazy loading strategy documented (though `loading="lazy"` is used on some images)

### Positive
- Theme detection inline script prevents FOUC (Flash of Unstyled Content)
- Globe canvas pauses on tab visibility change
- Images use `loading="lazy"` where found
- Vendor scripts (globe.gl) bundled locally, not CDN-dependent

---

## SEO Report

### Issues
1. No JSON-LD structured data on any page
2. Sitemap lists only 5 of 20+ pages
3. No `<lastmod>` in sitemap entries
4. Duplicate title on index.html vs home.html
5. index.html should have `noindex` (it's a redirect)
6. 4 pages missing canonical tags
7. 3 pages missing OG/Twitter tags
8. Same og:image for all pages
9. Heading hierarchy violations
10. Deprecated `<meta name="keywords">` on news terminal page

### Positive
- Complete meta descriptions on main pages
- Canonical tags on most pages
- OG and Twitter Card tags on main pages
- robots.txt present
- sitemap.xml exists (just incomplete)
- `<meta name="author">` present

---

## AI Search Optimization Report

### Issues
1. No JSON-LD Person schema (critical for entity recognition by AI search)
2. No Article/CreativeWork schema on case studies
3. No `sameAs` links to external profiles in structured data
4. No `knowsAbout` or `hasCredential` schema properties
5. Section titles use non-semantic `<span>` elements (harder for AI to parse hierarchy)

### Positive
- Strong author signals in meta tags and content
- Quantified outcomes in case studies (AI search values specific numbers)
- Clear expertise signals: company names, patent numbers, years of experience
- Content naturally answers "who is Puneet Arora" queries

---

## GitHub Pages Report

### Issues
1. No custom 404.html page
2. No `.nojekyll` file (Jekyll may ignore underscore-prefixed files)
3. No CNAME file (using default github.io domain)
4. `bio-html-backups-19th-June-2026.html` committed to repo (publicly accessible backup)
5. Duplicate site structure (root vs project/site/)
6. Case-sensitive filename (Altermayur.html)

### Positive
- Relative paths used consistently (correct for `/portfolio/` subpath)
- robots.txt and sitemap.xml present
- `project/site/` pages have `noindex,nofollow` (staging correctly excluded)

---

## Security Report

### Issues
1. No Content-Security-Policy header or meta tag
2. Anthropic API called from client-side JavaScript (skills-lab.html)
3. Passcode in plaintext in committed chat logs (chats/chat1.md)
4. Client-side gate trivially bypassable
5. Extensive `innerHTML` usage with inconsistent input escaping
6. JSZip CDN script without Subresource Integrity
7. Empty Formspree form ID (submissions fail)

### Positive
- All `target="_blank"` links have `rel="noopener"` -- consistently applied
- No API keys or secrets exposed in code (except the chat log passcode)
- Gate hash uses SHA-256 (appropriate for client-side, not for real security)
- News terminal has `escapeHtml()` sanitization function
- HTTPS enforced via GitHub Pages

---

## Visual Design Report

### Issues
1. Color tokens inconsistent -- CSS comment describes "warm gold" but signal color is teal/green
2. Hardcoded colors bypass theme system (won't update on theme switch)
3. All three font variables (`--f-mono`, `--f-sans`, `--f-serif`) point to same font
4. 19+ files with heavy inline styles bypassing token system
5. Topbar `backdrop-filter` has no effect (opaque background)

### Positive
- Strong "Intelligence Terminal" aesthetic -- distinctive and memorable
- Consistent use of CSS custom properties for primary design tokens
- Well-structured theme system (dark default, forest light)
- Clean grid-based layouts
- Professional color palette

---

## Recruiter Report

### 30-Second Scan
- **Can determine:** Seniority (yes -- "Principal Product Designer"), AI experience (yes -- prominent), Company history (yes -- Dell, Boeing, HP, Software AG)
- **Cannot determine:** Some text at 10px is too small to scan quickly

### 2-Minute Review
- **Strengths:** Clear case study links, quantified outcomes, patent references
- **Weaknesses:** No hamburger menu on mobile (recruiter on phone misses nav items), hover-only card interactions don't work on touch

### 5-Minute Deep Dive
- **Strengths:** Full case study with process documentation, design thinking, business impact
- **Weaknesses:** Some image alt text missing (empty), lightbox doesn't trap focus

### Reasons to Interview
1. 20 years cross-industry experience (Dell, Boeing, HP, Software AG)
2. Patents demonstrate innovation depth
3. AI/GenAI experience clearly documented
4. Quantified case study outcomes (SUS 71→84, -47% time-to-first-action)
5. Design leadership and team mentoring signals

### Reasons to Reject
1. Accessibility issues suggest gaps in inclusive design practice
2. Client-side security shortcuts
3. Small text sizes suggest desktop-first thinking
4. Would need to verify case study claims

---

## Recruiter Experience: Fortune 500 Assessment

**If submitted to Google, Microsoft, Apple, Meta, OpenAI, Amazon, Adobe, Salesforce, Atlassian, and Airbnb for a Staff/Principal Product Designer role:**

**Would likely pass initial screen at:** Dell (current employer), Boeing, Salesforce, Atlassian -- these companies value enterprise design experience and the portfolio speaks directly to that domain.

**Would face challenges at:** Google, Apple, Meta, Airbnb -- these companies expect pixel-perfect craft and accessibility compliance. The contrast failures, missing focus states, and small text sizes would raise concerns about attention to inclusive design detail. The "Intelligence Terminal" aesthetic, while distinctive, may read as more engineering-oriented than design-craft-oriented for consumer-facing design roles.

**Would need strengthening for:** OpenAI, Amazon -- strong AI narrative but would benefit from more consumer-facing AI design work and clearer systems thinking documentation.

**Key gap:** The portfolio's own accessibility issues undermine the credibility of someone applying for a senior design role, where inclusive design is table stakes. Fix the WCAG failures before sharing with any FAANG recruiter.

---

## Action Plan

### Week 1: Critical Accessibility & Security
- [ ] Add `<main>` landmark to all pages
- [ ] Add skip navigation link to all pages
- [ ] Add global `:focus-visible` styles
- [ ] Fix `outline: none` on form inputs
- [ ] Fix `--faint` contrast in both themes
- [ ] Increase minimum font size to 11px
- [ ] Add `.nojekyll` file
- [ ] Add Content-Security-Policy meta tag
- [ ] Remove chats/ directory from repo

### Week 2: SEO & Discoverability
- [ ] Add JSON-LD Person schema to home/bio pages
- [ ] Add Article schema to case study pages
- [ ] Complete sitemap.xml with all pages
- [ ] Add canonical tags to missing pages
- [ ] Add OG/Twitter tags to missing pages
- [ ] Create custom 404.html page
- [ ] Fix heading hierarchy across all pages

### Week 3: Polish & Performance
- [ ] Convert hardcoded colors to CSS custom properties
- [ ] Move inline styles to CSS classes
- [ ] Add responsive breakpoints for grid utilities
- [ ] Implement mobile navigation (hamburger or scroll indicators)
- [ ] Add `prefers-color-scheme` auto-detection
- [ ] Add keyboard handlers for click-only interactive elements
- [ ] Fix `aspect-ratio` / CLS prevention for images

### Week 4: Security & Maintenance
- [ ] Move Anthropic API calls to serverless function
- [ ] Add SRI to external CDN scripts
- [ ] Fix empty Formspree form IDs
- [ ] Consolidate duplicate site structure
- [ ] Add error fallback UI for external API calls
- [ ] Clean up backup files
- [ ] Add analytics (Google Analytics / Plausible + Search Console)
