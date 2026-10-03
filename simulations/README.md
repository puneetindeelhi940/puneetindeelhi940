# UX Sprint Simulations

Two Laerdal concept studies, each shown in three formats. Every page runs a full Double Diamond sprint in a **2-minute loop** that repeats, in a matrix-terminal style. Every pane keeps a stream of background activity going, so no window sits idle.

| Use case | Mission Control | Diamond Compiler | Agent Swarm |
|---|---|---|---|
| **RQI**: quarterly CPR practice redesigned to fit a nursing shift | [rqi/mission-control](rqi/mission-control/index.html) | [rqi/double-diamond-compiler](rqi/double-diamond-compiler/index.html) | [rqi/agent-swarm](rqi/agent-swarm/index.html) |
| **SimCapture**: AI-assisted simulation debriefing | [simcapture/mission-control](simcapture/mission-control/index.html) | [simcapture/double-diamond-compiler](simcapture/double-diamond-compiler/index.html) | [simcapture/agent-swarm](simcapture/agent-swarm/index.html) |

- **Mission Control**: six UX workstreams run in parallel (research, synthesis, ideation, usability, analytics, quality gates), with live KPIs and a live telemetry strip.
- **Diamond Compiler**: the sprint as a build log. The number of options in play is plotted live, and its shape draws the double diamond.
- **Agent Swarm**: nine AI agents and one human design lead. Guardrails catch a hallucinated quote and the synthetic-user positivity trap, and a human approves every phase.

## What is real and what is simulated

The projects (**Heartline** for RQI, **Lighthouse** for SimCapture) and all their numbers are simulated. The methods, guidelines and thresholds are real, and each page lists its sources under “Methods & sources”. Highlights:

- **RQI**: the AHA × Laerdal low-dose, high-frequency model (about 10 minutes every 90 days) and AHA CPR targets (depth 5–6 cm, rate 100–120/min, full recoil). The rollout is measured with a stepped-wedge cluster design.
- **SimCapture**: PEARLS and advocacy-inquiry debriefing, DASH scores and psychological safety. AI timeline moments are measured by precision and recall against human annotators, and speech-recognition fairness by accent.
- **UX methods**: Double Diamond (Design Council, NN/g) with d.school modes, interview saturation (~12), Nielsen–Landauer, SUS curved grades, HEART, RICE and WCAG 2.2 AA.

These are unofficial portfolio concept studies, not affiliated with or endorsed by Laerdal Medical, RQI Partners or the American Heart Association. Product names belong to their owners.

## Controls

Space plays or pauses, ← and → seek 5 s, and 1, 2 and 4 set the speed. Drag the scrubber to jump to any moment.

## Editing

The pages are generated. Edit the sources in `_src/`, then run:

```sh
node simulations/_src/build.mjs
```

| Source | Holds |
|---|---|
| `_src/core.css`, `_src/core.js` | Matrix theme, clock, transport, logs, background-activity generator, live strips (CPR trace, ECG), digital rain |
| `_src/formats/*.html, *.js` | The three page formats |
| `_src/stories/<use case>/meta.js` | Shared facts, sources, interview quotes and background-activity pools |
| `_src/stories/<use case>/<format>.js` | The 2-minute script for each page |

`.github/workflows/pages.yml` publishes this folder to GitHub Pages on every push to `main`. One-time setup: Settings → Pages → Source: **GitHub Actions**.

Built by Puneet Arora.
