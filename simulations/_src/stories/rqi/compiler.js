/* RQI · Double Diamond Compiler story */
const STORY = (() => {
const b = script('compiler', 42);
b.at(.2).o('{big:uxc 4.2.0} {dim:· double-diamond compiler}')
 .o('{dim:spec  Design Council (2005) · NN/g · Stanford d.school modes}')
 .o('{dim:brief} rqi-heartline.brief.md {dim:· quarterly CPR practice for nurses}')
 .o('{dim:target} on-time ≥ 90% {dim:·} session ≤ 10:00 {dim:·} first-try pass ≥ 75%')
 .o('{dim:constraints} 9 hospitals {dim:·} 42 stations {dim:·} no patient-care disruption', .6);

b.at(3).o('[1/4] DISCOVER  ◁ diverge   d.school: Empathize', .5, 'stage')
 .cmd('uxc discover --mindset beginner --stakeholders 7')
 .o('  ├─ assumptions logged {k:17} {dim:· each becomes a research question}')
 .o('  ├─ {warn:HiPPO detected:} “just send more reminder emails” {dim:→ backlog}', .55)
 .cmd('uxc research plan --questions 5 --methods 4')
 .o('  ├─ RQ1 why do sessions bunch up in the last week of the quarter?')
 .o('  ├─ RQ2 what interrupts a session, and what happens next?')
 .o('  └─ methods: interviews · night-shift shadowing · survey · station logs')
 .bar('  recruiting  ', 2.2, '{ok:12/12 scheduled} {dim:· shift-friendly slots}')
 .cmd('uxc empathize --interviews 12 --what-how-why')
 .bar('  interviews  ', 4.2, '{ok:263 notes · 64 codes}')
 .o('  ├─ {q:“I got paged mid-session and had to start over. Twice.”} {dim:P04}')
 .o('  ├─ {q:“I’m five foot one. Depth is hard without a step stool.”} {dim:P07}')
 .o('  ├─ saturation at P10 {dim:· last 3 interviews added 2 codes}')
 .o('  └─ {k:extreme user} float nurse across 5 hospitals {dim:· 5 logins}');
b.at(19.6).cmd('uxc observe --context night-shift --nights 3')
 .o('  └─ cart sits in a break room on {warn:2 of 3} units')
 .cmd('uxc survey --n 1128')
 .o('  └─ ±2.9% margin at 95% {dim:·} 61% finish in the final 7 days')
 .cmd('uxc analytics --station-logs 90d')
 .o('  └─ 6,200 due {dim:·} {warn:64.0%} on time {dim:·} {err:17%} sessions abandoned')
 .o('{warn:warning} W001 assumption “nurses don’t care” contradicted {dim:· 91% want feedback}', .7);
b.at(29.2).o('{ok:✓ discover}  212 observations {dim:·} 0 errors {dim:·} 1 warning', .8);

b.at(30.2).o('[2/4] DEFINE    ▷ converge  d.school: Define', .5, 'stage')
 .cmd('uxc synthesize --affinity --bottom-up')
 .bar('  clustering  ', 2.4, '{ok:6 clusters} {dim:· largest: access & interruption (24)}')
 .cmd('uxc empathy-map --say --do --think --feel')
 .o('  ├─ SAYS “I’ll do it next shift”  DOES waits for the due-date email')
 .o('  └─ THINKS “what if I fail it?”  FEELS rushed and watched')
 .cmd('uxc journey --persona night-nurse --stages 6')
 .o('  └─ low point {err:−2.7} when paged mid-session {dim:· 3 moments that matter}')
 .cmd('uxc pov --madlib "[user] needs [need] because [insight]"')
 .o('  └─ {hl:POV} Night-shift nurses need to finish CPR practice in one uninterrupted 10 minutes near their unit, because breaks are short, pages are constant and restarting feels like failing.', 1.6)
 .cmd('uxc hmw --from pov --count 5')
 .o('  ├─ HMW let a session survive a page?')
 .o('  ├─ HMW make feedback coach instead of scold?')
 .o('  └─ HMW show managers who is about to be due, not who is late?');
b.at(50.5).cmd('uxc metrics --heart --goals-signals-metrics')
 .o('  ├─ {k:adoption} → on-time completion → ≥ 90%')
 .o('  ├─ {k:task success} → first-try pass (depth 5–6 cm, 100–120/min, recoil)')
 .o('  └─ guardrails: alarm response time · data loss · abandon rate');
b.at(58.8).o('{ok:✓ define}  1 POV {dim:·} 5 HMW {dim:·} 7 metrics {dim:·} gate signed', .8);

b.at(60.2).o('[3/4] DEVELOP   ◁ diverge   d.school: Ideate → Prototype', .5, 'stage')
 .cmd('uxc ideate --brainstorm --rules dschool')
 .o('  ├─ defer judgment · encourage wild ideas · build on the ideas of others')
 .o('  ├─ stay focused · one conversation at a time · be visual · go for quantity')
 .bar('  ideas       ', 2.6, '{ok:64 ideas} {dim:in 21 min}')
 .cmd('uxc crazy8s --designers 6 --minutes 8')
 .o('  └─ 48 sketches {dim:· one is just a metronome labelled “Stayin’ Alive”}')
 .cmd('uxc select --post-it-vote --rice')
 .o('  ├─ A  badge tap + pause/resume   RICE {ok:2,340} {dim:◆ most likely to delight}')
 .o('  ├─ B  one-cue coaching           RICE {ok:1,860} {dim:◆ rational choice}')
 .o('  ├─ C  due-soon manager view      RICE {ok:1,410}')
 .o('  └─ {dim:long shot parked: “CPR leaderboard” (nurses said no, loudly)}');
b.at(74.4).cmd('uxc prototype --paper --wizard-of-oz')
 .o('  └─ an educator spoke the coaching cues {dim:· nobody noticed}')
 .cmd('uxc test --round R1 --n 5 --think-aloud')
 .bar('  sessions    ', 2.2, '{warn:12 issues} {dim:· sev4×1 sev3×4 · SUS 69.5}')
 .o('{warn:warning} W002 3/5 missed the resume card after a page {dim:→ iterate}', .6)
 .cmd('uxc iterate --fix "sev>=3" && uxc prototype --hi-fi')
 .cmd('uxc test --round R2 --n 5')
 .o('  └─ 3 new issues {ok:all sev ≤ 2} {dim:·} SUS 76.0 {dim:·} 10:12 median');
b.at(88.8).o('{ok:✓ develop}  64 ideas → 3 concepts → 1 direction {dim:·} 2 rounds', .8);

b.at(90.2).o('[4/4] DELIVER   ▷ converge  d.school: Test → Ship', .5, 'stage')
 .cmd('uxc a11y --wcag 2.2 --level AA --station')
 .bar('  audit       ', 1.8, '{ok:0 failures} {dim:(was 11) · status = colour + icon + text}')
 .cmd('uxc benchmark --n 40 --in-situ')
 .bar('  benchmark   ', 2.2, '{ok:90% no restart} {dim:CI 76–97 ·} 9:40 {dim:·} SUS {ok:81.3}')
 .cmd('uxc pilot --stepped-wedge --units 12 --steps 4')
 .bar('  wedges      ', 3, '{dim:before} 64.0% {dim:· after} {ok:91.2%}')
 .o('  ├─ Δ {ok:+27.2 pp} {dim:· 95% CI [22.9, 31.5] · p < 0.001}')
 .o('  └─ first-try pass {ok:58% → 77%} {dim:·} abandons {ok:17% → 6%}')
 .o('{warn:warning} W003 infant flow sev-3 deferred {dim:→ backlog #219, owner assigned}', .6)
 .cmd('uxc ship --rollout 9-hospitals --monitor 2q');
b.at(111.4).o('{ok:✓ deliver}  1 solution shipped', .5)
 .o('{dim:────────────────────────────────────────────────}', .2, 'sum')
 .o('{big:BUILD SUCCESSFUL} in 2m 00s', .3, 'sum')
 .o('212 observations → 1 POV → 64 ideas → {ok:1 shipped}', .3, 'sum')
 .o('0 errors {dim:·} 3 warnings {dim:·} 0 accessibility failures', .3, 'sum')
 .o('outcome  on-time {ok:+27.2 pp} {dim:·} session {ok:−33%} {dim:·} SUS {ok:+22.5}', .3, 'sum')
 .o('{dim:next     uxc measure --depth-in-target --quarterly}', .3, 'sum')
 .o('{dim:watching for the next brief… restarting at 02:00}', .3, 'sum');

return {
  meta: Object.assign({}, META, {path:'uxc build <b>rqi-heartline</b> --framework double-diamond'}),
  lines: ambient(b.lines(), AMB.station.map(f => r => '  ' + f(r)), 31, {cps: 42, gap: 2.4, step: [1.6, 2.8]}),
  peaks: [212, 64],
  units: ['observations', 'insights → POV', 'ideas & variants', 'candidates → ship'],
  files: [
    [1,'brief.md','3 KB'],[6,'assumptions.csv','17 rows'],[8,'research-plan.md','5 RQs'],[10.5,'screener.form','412 resp'],
    [16.5,'transcripts/','12 files'],[17,'codebook.csv','64 codes'],[22.5,'survey-results.csv','1,128 rows'],[26.5,'station-logs-90d.json','42 carts'],
    [34.5,'affinity-map.fig','263 notes'],[37.5,'empathy-map.fig','4 quads'],[40,'journey-night-nurse.fig','6 stages'],[45.5,'pov.txt','1 line'],
    [49,'hmw.md','5 Qs'],[54,'heart-metrics.md','7 metrics'],[66.5,'ideas.csv','64 rows'],[69,'sketches/','48 files'],
    [73,'concepts.fig','A · B · C'],[76,'paper-proto.jpg','11 screens'],[80.5,'r1-findings.md','12 issues'],[86.5,'station-hifi.fig','19 screens'],
    [88.5,'r2-findings.md','3 issues'],[93.5,'a11y-audit.html','0 fails'],[97.5,'benchmark-n40.csv','40 rows'],[104.5,'stepped-wedge-readout.md','p<0.001'],
    [111.5,'release-notes.md','v4.0']
  ]
};
})();
