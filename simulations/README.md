# UX Simulations

Three self-contained, 2-minute looping simulations of a UX sprint. Each is a single `index.html` you can open directly in a browser, with no build step.

| Package | What it shows |
|---|---|
| [`ux-mission-control/`](ux-mission-control/index.html) | Six instrument panes run in parallel (research ops, synthesis, ideation, usability testing, analytics and A/B, quality gates) under a live KPI strip. |
| [`double-diamond-compiler/`](double-diamond-compiler/index.html) | The sprint written as a compiler build log. The number of options in play is plotted live, and its shape draws the double diamond. |
| [`agentic-ux-swarm/`](agentic-ux-swarm/index.html) | Nine AI agents and one human design lead. It includes guardrails (PII, hallucinated quotes, synthetic-user bias) and four human approval gates. |

All three follow the same fictional project, **Project Tidewater**, a clinic appointment-booking flow, so the numbers agree across the three views.

## Real vs simulated

The project data is simulated. The methods, formulas and thresholds are real:

- Double Diamond (UK Design Council, 2005; NN/g), mapped to the Stanford d.school modes: Empathize, Define, Ideate, Prototype, Test.
- d.school methods: What? How? Why?, extreme users, empathy map, POV madlib, “How might we”, the seven brainstorm rules, post-it voting, Wizard of Oz.
- Interview saturation around 12 (Guest et al., 2006). Problems found = 1 − (1 − 0.31)ⁿ (Nielsen & Landauer). About 40 users for quantitative benchmarks (NN/g).
- Nielsen’s 10 heuristics with 0–4 severity. SUS average 68 with curved grades (Sauro & Lewis). SEQ average ≈ 5.5. Adjusted-Wald confidence intervals.
- HEART and Goals–Signals–Metrics (Google), RICE (Intercom), Crazy 8s (GV).
- A/B sizing with a two-proportion z-test (58.4% baseline, +5% relative MDE, α 0.05, power 0.80 → 4,420 per arm), an SRM χ² check and an O’Brien–Fleming boundary.
- WCAG 2.2 AA (1.4.3, 2.5.8, 2.4.11, 3.3.8) and Core Web Vitals at p75 (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1).

## Controls

Space plays or pauses, ← and → seek 5 s, and 1, 2 and 4 set the speed. Drag the scrubber to jump to any moment.

Built by Puneet Arora.
