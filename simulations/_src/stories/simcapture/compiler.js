/* SimCapture · Double Diamond Compiler story */
const STORY = (() => {
const b = script('compiler', 42);
b.at(.2).o('{big:uxc 4.2.0} {dim:· double-diamond compiler}')
 .o('{dim:spec  Design Council (2005) · NN/g · Stanford d.school modes}')
 .o('{dim:brief} simcapture-lighthouse.brief.md {dim:· AI-assisted debriefing}')
 .o('{dim:target} debrief start ≤ 3:00 {dim:·} DASH ≥ 6 {dim:·} psych safety never lower')
 .o('{dim:constraints} 8 centres {dim:·} learner video stays local {dim:·} human decides', .6);

b.at(3).o('[1/4] DISCOVER  ◁ diverge   d.school: Empathize', .5, 'stage')
 .cmd('uxc discover --mindset beginner --stakeholders 6')
 .o('  ├─ assumptions logged {k:21} {dim:· each becomes a research question}')
 .o('  ├─ {warn:HiPPO detected:} “let the AI grade them” {dim:→ firmly parked}', .55)
 .cmd('uxc research plan --questions 5 --methods 4')
 .o('  ├─ RQ1 where does debrief time go between scenario end and talk?')
 .o('  ├─ RQ2 what makes feedback feel fair to learners?')
 .o('  └─ methods: interviews · debrief observation · survey · usage logs')
 .bar('  recruiting  ', 2.2, '{ok:12/12 scheduled} {dim:· 286 screened}')
 .cmd('uxc empathize --interviews 12 --what-how-why')
 .bar('  interviews  ', 4.2, '{ok:281 notes · 63 codes}')
 .o('  ├─ {q:“By the time I find the shock in the video, they’ve cooled off.”} {dim:P01}')
 .o('  ├─ {q:“Don’t automate the conversation. Automate the homework.”} {dim:P12}')
 .o('  ├─ saturation at P10 {dim:· last 3 interviews added 2 codes}')
 .o('  └─ {k:extreme user} solo in-situ instructor {dim:· runs, records, debriefs alone}');
b.at(19.6).cmd('uxc observe --debriefs 9 --centres 3')
 .o('  └─ {warn:62%} of prep time spent scrubbing video')
 .cmd('uxc survey --n 286')
 .o('  └─ ±5.8% margin at 95% {dim:·} only 23% cite objective data')
 .cmd('uxc analytics --recordings 90d')
 .o('  └─ 1,240 scenarios {dim:·} {warn:71%} never reopened {dim:·} median prep {err:11:30}')
 .o('{warn:warning} W001 assumption “instructors want full AI summaries” contradicted {dim:· 10/12 want questions}', .7);
b.at(29.2).o('{ok:✓ discover}  198 observations {dim:·} 0 errors {dim:·} 1 warning', .8);

b.at(30.2).o('[2/4] DEFINE    ▷ converge  d.school: Define', .5, 'stage')
 .cmd('uxc synthesize --affinity --bottom-up')
 .bar('  clustering  ', 2.4, '{ok:6 clusters} {dim:· largest: finding evidence fast (26)}')
 .cmd('uxc empathy-map --say --do --think --feel')
 .o('  ├─ SAYS “I lose the thread at analysis”  DOES scrubs video')
 .o('  └─ THINKS “am I fair or just loud?”  FEELS rushed')
 .cmd('uxc journey --persona instructor --stages 6')
 .o('  └─ low point {err:−2.5} searching for the shock clip {dim:· 3 moments}')
 .cmd('uxc pov --madlib "[user] needs [need] because [insight]"')
 .o('  └─ {hl:POV} Instructors running hot debriefs need the three moments that matter, with objective data, before learners leave, because searching video eats half the debrief and makes feedback feel like opinion.', 1.6)
 .cmd('uxc hmw --from pov --count 5')
 .o('  ├─ HMW hand instructors evidence without a verdict?')
 .o('  ├─ HMW keep AI phrased as inquiry, not judgment?')
 .o('  └─ HMW show what went well before what went wrong?');
b.at(50.5).cmd('uxc metrics --heart --goals-signals-metrics')
 .o('  ├─ {k:task success} → debrief start → ≤ 3:00 median')
 .o('  ├─ {k:happiness} → DASH ≥ 6 · learner psych safety ≥ 6')
 .o('  └─ guardrails: WER gap by accent · consent · no per-learner scores');
b.at(58.8).o('{ok:✓ define}  1 POV {dim:·} 5 HMW {dim:·} 7 metrics {dim:·} gate signed', .8);

b.at(60.2).o('[3/4] DEVELOP   ◁ diverge   d.school: Ideate → Prototype', .5, 'stage')
 .cmd('uxc ideate --brainstorm --rules dschool')
 .o('  ├─ defer judgment · encourage wild ideas · build on the ideas of others')
 .o('  ├─ stay focused · one conversation at a time · be visual · go for quantity')
 .bar('  ideas       ', 2.6, '{ok:64 ideas} {dim:in 21 min}')
 .cmd('uxc crazy8s --designers 6 --minutes 8')
 .o('  └─ 48 sketches {dim:· one is the AI debriefing the instructor}')
 .cmd('uxc select --post-it-vote --rice')
 .o('  ├─ A  three-moment timeline       RICE {ok:2,100} {dim:◆ most likely to delight}')
 .o('  ├─ B  PEARLS question drafts      RICE {ok:1,640} {dim:◆ rational choice}')
 .o('  ├─ C  learner-first “went well”   RICE {ok:1,180}')
 .o('  └─ {dim:long shot parked: “debrief in haiku”}');
b.at(74.4).cmd('uxc prototype --paper --wizard-of-oz')
 .o('  └─ the sim tech tagged moments live as “the AI” {dim:· nobody noticed}')
 .cmd('uxc test --round R1 --n 5 --think-aloud')
 .bar('  sessions    ', 2.2, '{warn:13 issues} {dim:· sev4×1 sev3×5 · SUS 70.5}')
 .o('{warn:warning} W002 “compressions were poor” read as a grade {dim:→ rewrite as inquiry}', .6)
 .cmd('uxc iterate --fix "sev>=3" && uxc prototype --hi-fi')
 .cmd('uxc eval --ai-timeline --scenarios 60')
 .o('  └─ precision {ok:0.94} {dim:·} recall {ok:0.89} {dim:· human κ 0.82}');
b.at(88.8).o('{ok:✓ develop}  64 ideas → 3 concepts → 1 direction {dim:·} 2 rounds', .8);

b.at(90.2).o('[4/4] DELIVER   ▷ converge  d.school: Test → Ship', .5, 'stage')
 .cmd('uxc a11y --wcag 2.2 --level AA --captions')
 .bar('  audit       ', 1.8, '{ok:0 failures} {dim:(was 8) · captions on 1,240 recordings}')
 .cmd('uxc fairness --asr --by accent')
 .bar('  WER gap     ', 2.2, '{ok:2.3 pp} {dim:(was 6.1) · custom clinical vocabulary}')
 .cmd('uxc pilot --cluster-randomised --centres 8')
 .bar('  debriefs    ', 3, '{dim:DASH} 5.1 {dim:→} {ok:6.2}')
 .o('  ├─ objective data cited {ok:23% → 81%} {dim:·} start {ok:11:30 → 2:10}')
 .o('  └─ psych safety 5.4 → {ok:6.1} {dim:· non-inferior ✓}')
 .o('{warn:warning} W003 paediatric event codes sev-3 deferred {dim:→ backlog #77, owner}', .6)
 .cmd('uxc ship --flag ai-timeline --monitor 2-terms');
b.at(111.4).o('{ok:✓ deliver}  1 solution shipped', .5)
 .o('{dim:────────────────────────────────────────────────}', .2, 'sum')
 .o('{big:BUILD SUCCESSFUL} in 2m 00s', .3, 'sum')
 .o('198 observations → 1 POV → 64 ideas → {ok:1 shipped}', .3, 'sum')
 .o('0 errors {dim:·} 3 warnings {dim:·} 0 unverified AI moments', .3, 'sum')
 .o('outcome  DASH {ok:+1.1} {dim:·} prep {ok:−81%} {dim:·} safety {ok:held}', .3, 'sum')
 .o('{dim:next     uxc measure --dash --each-term}', .3, 'sum')
 .o('{dim:watching for the next brief… restarting at 02:00}', .3, 'sum');

return {
  meta: Object.assign({}, META, {path:'uxc build <b>simcapture-lighthouse</b> --framework double-diamond'}),
  lines: ambient(b.lines(), AMB.station.map(f => r => '  ' + f(r)), 41, {cps: 42, gap: 2.4, step: [1.6, 2.8]}),
  peaks: [198, 64],
  units: ['observations', 'insights → POV', 'ideas & variants', 'candidates → ship'],
  files: [
    [1,'brief.md','3 KB'],[6,'assumptions.csv','21 rows'],[8,'research-plan.md','5 RQs'],[10.5,'screener.form','286 resp'],
    [16.5,'transcripts/','12 files'],[17,'codebook.csv','63 codes'],[22.5,'debrief-observations.md','9 debriefs'],[26.5,'usage-90d.json','1,240 runs'],
    [34.5,'affinity-map.fig','281 notes'],[37.5,'empathy-map.fig','4 quads'],[40,'journey-instructor.fig','6 stages'],[45.5,'pov.txt','1 line'],
    [49,'hmw.md','5 Qs'],[54,'heart-metrics.md','7 metrics'],[66.5,'ideas.csv','64 rows'],[69,'sketches/','48 files'],
    [73,'concepts.fig','A · B · C'],[76,'woz-protocol.md','1 tech'],[80.5,'r1-findings.md','13 issues'],[86.5,'debrief-hifi.fig','27 frames'],
    [88.5,'ai-eval-60.csv','P .94 R .89'],[93.5,'a11y-audit.html','0 fails'],[97.5,'asr-fairness.md','2.3 pp gap'],[104.5,'pilot-readout.md','DASH +1.1'],
    [111.5,'release-notes.md','v7.2']
  ]
};
})();
