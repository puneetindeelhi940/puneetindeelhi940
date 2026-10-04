# Laerdal Medical · UX Discovery Portal

A multi-page, motion-graphics portal that sets one standard UX process — **Problem Discovery → Solution Framing → Moving into Delivery** — for the Laerdal Medical UX team, with a monthly checklist and a Windows screensaver.

Built by **Puneet Arora**.

## Sources (only these two)

| Source | Used for |
|---|---|
| [Tanzu Labs — A Guide to Product Discovery](https://labspractices.com/guides/guide-to-product-discovery/) | Stages, goals, activities, balanced team, moving into delivery |
| [Product Discovery Methods](https://pdmethods.com/) (incl. its copy of the d.school Design Thinking Bootleg) | 101 methods across 9 phases + 5 Design Thinking modes, with timeboxes |

Visual cues (Lato, warm neutrals, red actions) come from the public pages of laerdal.com and the Life Design System. Terminal "simulations" are illustrative motion graphics; their sample data is not real research.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Live simulation wall, the three stages, monthly ritual |
| `process.html` | Animated double diamond, balanced team, how the two sources line up |
| `discovery.html` / `framing.html` | Every activity: goal, who, "done when", methods, live terminal, animated 2×2 |
| `delivery.html` | Entry criteria, continuous loop, story map |
| `methods.html` | Searchable library of all methods |
| `empathize.html` … `test.html` | The five Design Thinking modes |
| `checklist.html` | Monthly checklist: ticks, evidence links, CSV export, print |
| `sharepoint.html` | Step-by-step Microsoft Lists + Power Automate set-up |
| `screensaver.html` | Full-screen rotating scenes (`?scene=wall` to pin one, `?interval=30` to change speed) |

## Use it

**Team portal:** copy the whole `not-live-yet` folder to a shared drive and open `index.html`. No server or install needed. Lato loads from Google Fonts when online; offline it falls back to Segoe UI.

**Monthly checklist:** follow `sharepoint.html` once to create the shared List and monthly flow (`sharepoint/ux-checklist-template.csv` is the import file), then set `sharepointListUrl` in `assets/js/data.js`.

**Screensaver:** the GitHub Action `.github/workflows/build-screensaver.yml` builds `LaerdalUX.scr` on a Windows runner (Actions → *Build UX screensaver* → Artifacts). See `screensaver-wrapper/INSTALL.txt`. To build locally on Windows: `cd screensaver-wrapper && dotnet publish -c Release -o out`, then rename `out/LaerdalUX.exe` to `LaerdalUX.scr`.

## Editing content

All content lives in `assets/js/data.js`; pages render from it. The motion engine is `assets/js/engine.js`, page layouts are `assets/js/portal.js`, and styles/tokens are `assets/css/portal.css`. Everything respects `prefers-reduced-motion`.
