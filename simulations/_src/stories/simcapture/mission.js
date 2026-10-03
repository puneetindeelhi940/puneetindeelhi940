/* SimCapture · Mission Control story */
const STORY = (() => {
const PHASES = [
  {name:'Discover', mode:'Empathize', shape:'div', methods:'interviews · observe 9 debriefs · survey'},
  {name:'Define', mode:'Define', shape:'conv', methods:'affinity · POV · HMW · HEART'},
  {name:'Develop', mode:'Ideate · Prototype', shape:'div', methods:'ideate · Wizard of Oz · AI eval'},
  {name:'Deliver', mode:'Test · Ship', shape:'conv', methods:'benchmark · centre pilot · ship'}
];

const R = script('research');
R.at(.3).cmd('recruit --screener lighthouse --quota instr:5,tech:3,learner:3,director:1')
 .o('286 responses {dim:→} 47 eligible {dim:→} {ok:12 scheduled}')
 .o('consent 12/12 {ok:✓} {dim:· learner video never leaves the centre}');
INTERVIEWS.forEach(iv => {
  R.at(iv.at - 1.5).o(`{k:${iv.id}} {dim:${iv.role} · ${iv.mins} min}`, .3).o(`{q:“${iv.q}”}`, .3);
  R.at(iv.at).o(iv.codes ? `{dim:  → ${iv.codes} new codes}` : '{ok:  → 0 new codes · saturation}', .1);
});
R.at(27.2).cmd('observe --debriefs 9 --centres 3')
 .o('median {warn:11:30} from scenario end to debrief start')
 .o('survey {k:n=286} educators {dim:·} only {warn:23%} cite objective data')
 .o('{warn:71%} of recordings never reopened after the debrief');
R.at(33).o('{dim:repository: 12 transcripts · 63 codes · 286 survey rows}', .6).o('{dim:handoff → synthesis}');
R.at(62).cmd('recruit --round R1 --n 5 --mix instr:4,tech:1')
 .o('5/5 booked {dim:· incl. 1 instructor who is Deaf (captions)}');
R.at(81.5).cmd('recruit --round R2 --n 5 --fresh-eyes')
 .o('5/5 booked {dim:· no repeat participants}');
R.at(90.5).cmd('pilot --centres 8 --cluster-randomised')
 .o('{ok:8 centres enrolled} {dim:· 4 vs 4 · 320 debriefs}');
R.at(116).o('{ok:research ops ✓ cycle complete}');

const Y = script('synthesis');
Y.at(1).o('{dim:monitoring · notes stream in as interviews finish}');
Y.at(16.5).cmd('affinity --notes 281 --method bottom-up')
 .o('clustering 281 notes {dim:(no pre-set categories)}');
Y.at(21).o('{k:empathy map} SAYS “I lose the thread at analysis”')
 .o('DOES scrubs video while learners wait {dim:(7/9 observed)}')
 .o('THINKS “am I being fair or just loud?”')
 .o('FEELS rushed; learners feel judged');
Y.at(26).cmd('journey --persona instructor --stages 6')
 .o('emotional low {err:−2.5} searching for the shock clip');
Y.at(30.5).cmd('pov --madlib dschool')
 .o('{hl:POV} Instructors running hot debriefs need the three moments that matter, with objective data, before learners leave, because searching video eats half the debrief and makes feedback feel like opinion.', 1.4);
Y.at(36.5).cmd('hmw --count 5')
 .o('HMW hand instructors evidence without a verdict?')
 .o('HMW keep AI phrased as inquiry, not judgment?')
 .o('HMW show what went well before what went wrong?');
Y.at(42.5).cmd('heart --goals --signals --metrics')
 .o('{k:T} debrief start ≤ 3:00 {dim:·} {k:H} DASH ≥ 6, safety ≥ 6')
 .o('{k:A} debriefs using the timeline {dim:·} {k:E} clips cited per debrief');
Y.at(48).o('{k:personas} 2 behavioural + 1 extreme user {dim:(solo in-situ instructor)}', .6)
 .o('{k:principles} evidence over verdicts · questions not grades · learner first');
Y.at(56).o('{ok:define gate ✓} {dim:faculty, sim ops, learner council}');
Y.at(77.5).cmd('synthesize --round R1 --rainbow-sheet')
 .o('13 issues → 5 themes {dim:· top: AI tone reads as judgment}');
Y.at(88.5).o('R2: 3 new issues, {ok:all sev ≤ 2}');
Y.at(106).cmd('share --highlights 21 --audience faculty')
 .o('findings reel {dim:· 21 clips · 8 centres}');
Y.at(116).o('{ok:synthesis ✓ cycle complete}');

const I = script('ideation');
I.at(2).o('{dim:monitoring · waiting for a point of view}');
I.at(38).o('{dim:parking lot:} 8 early ideas {dim:(judgment deferred)}');
I.at(60.3).cmd('brainstorm --hmw 3 --rounds 3x7min')
 .o('rules {dim:·} defer judgment {dim:·} go for volume {dim:·} build on others', .6)
 .o('{k:64 ideas} in 21 min {dim:· wild: “the AI debriefs the instructor”}');
I.at(66.5).cmd('crazy8s --designers 6')
 .o('48 sketches {dim:· 8 per person in 8 min}');
I.at(69.5).cmd('vote --dots --delight --rational --long-shot')
 .o('{ok:A} three-moment timeline from LLEAP events {dim:· RICE} 2,100')
 .o('{ok:B} PEARLS question drafts (advocacy-inquiry) {dim:· RICE} 1,640')
 .o('{ok:C} learner-first “what went well” view {dim:· RICE} 1,180');
I.at(75.5).cmd('prototype --paper --concepts A,B,C')
 .o('{k:Wizard of Oz} AI {dim:(the sim tech tagged moments live)}');
I.at(80).cmd('prototype --mid-fi --target debrief-view')
 .o('27 frames · timeline · clip cards · question drawer');
I.at(85.5).cmd('prototype --hi-fi --states all')
 .o('no-AI · low-confidence · offline · consent-off {ok:✓}');
I.at(94).o('{dim:handoff → engineering · 44 annotated specs}');
I.at(116).o('{ok:ideation ✓ cycle complete}');

const U = script('usability');
U.at(.6).cmd('benchmark --current-flow --n 8 --instructors')
 .o('{dim:T1 find first shock · T2 pick 3 moments · T3 cite CPR data}');
U.at(6).o('T1 find first shock {warn:6/8} {dim:· 3:40}', 1.5)
 .o('T2 pick 3 key moments {err:2/8} {dim:· 9:05}', 1.5)
 .o('T3 cite CPR metrics {err:3/8}', 3)
 .o('median to debrief {warn:11:30} {dim:·} SUS {warn:61.0}');
U.at(13.5).cmd('heuristic-eval --evaluators 3 --nielsen-10')
 .o('H4 consistency: video vs log clocks drift {err:sev 4}')
 .o('H7 efficiency: no keyboard clip marking {err:sev 4}')
 .o('H6 recall: event codes like “EVT_32” {warn:sev 3}')
 .o('H1 status: unclear what is recording {warn:sev 3}')
 .o('19 violations {dim:· merged across 3 evaluators}');
U.at(28).o('{dim:handoff → synthesis}');
U.at(72.3).cmd('test --round R1 --mid-fi --n 5 --think-aloud');
[[74,5],[75,3],[76,3],[77,1],[78,1]].forEach(([at, n], i) =>
  U.at(at).o(`P${i+1} {dim:new issues} ${n}${i === 4 ? ' {dim:→ diminishing returns}' : ''}`));
U.at(79.5).o('R1: 13 issues {err:sev4×1} {warn:sev3×5} {dim:sev2×4 sev1×3}')
 .o('SUS 70.5 · debrief start 4:20');
U.at(84).cmd('test --round R2 --hi-fi --n 5');
U.at(88.5).o('R2: 3 new {ok:all sev ≤ 2} {dim:·} SUS 77.0 {dim:·} 2:50');
U.at(91.5).cmd('eval --ai-timeline --scenarios 60 --annotators 3');
U.at(100).o('precision {ok:0.94} {dim:·} recall {ok:0.89} {dim:· human κ 0.82}', 4)
 .o('debrief start {ok:2:10} median {dim:(−81%)}', 1)
 .o('SUS {ok:82.4} {dim:A ·} edits per draft {ok:1.9}');
U.at(116).o('{ok:usability ✓ cycle complete}');

const A = script('analytics');
A.at(1.5).cmd('usage --quarter Q2 --centres 8')
 .o('1,240 scenarios recorded {dim:→} {warn:29%} reopened', 1.2)
 .o('objective data cited in {err:23%} of debriefs');
A.at(8.5).cmd('sessions --filter debrief-prep')
 .o('median {warn:11:30} from scenario end to debrief')
 .o('{warn:62%} of that time is spent scrubbing video');
A.at(22).o('{dim:directors: no metric links debriefing to learning}');
A.at(40.5).cmd('instrument --framework heart --events 15')
 .o('15 events {dim:· no per-learner scores leave the room}');
A.at(62.5).cmd('pilot design --cluster-randomised --centres 8')
 .o('unit = sim centre · 4 vs 4 · 320 debriefs')
 .o('primary: DASH {dim:· non-inferiority on psych safety}')
 .o('guardrails: safety ≥ 6 · consent · WER gap');
A.at(95).cmd('pilot launch --arm timeline')
 .o('balance check: centre size & case mix {ok:✓}');
A.at(100).o('week 3 · {warn:interim only} {dim:· no early stopping}');
A.at(105.5).o('320 debriefs · 8 centres')
 .o('DASH {warn:5.1} → {ok:6.2} {dim:· Δ +1.1 [0.8, 1.4]}')
 .o('objective data cited {ok:23% → 81%}', .8)
 .o('psych safety 5.4 → {ok:6.1} {dim:· non-inferior ✓}');
A.at(110.5).cmd('rollout --centres all --flag ai-timeline')
 .o('{ok:live in 8 centres} {dim:· monitoring 2 terms}');
A.at(116).o('{ok:analytics ✓ cycle complete}');

const Q = script('quality');
Q.at(1.2).o('{dim:monitoring capture nodes · baseline audit at 0:15}');
Q.at(14.8).cmd('a11y audit --wcag 2.2 --level AA --debrief-view')
 .o('1.2.2 no captions on recordings')
 .o('2.1.1 scrubber not keyboard operable')
 .o('2.5.7 clip trim needs dragging {dim:(no single-pointer option)}')
 .o('1.4.11 timeline markers {err:1.9:1} {dim:+4 more}')
 .o('{err:8 failures}');
Q.at(21.2).cmd('ai-readiness --asr --latency')
 .o('WER gap by accent {err:6.1 pp} · draft {warn:140 s} · seek {warn:900 ms}');
Q.at(44).o('{dim:a11y, fairness + latency budgets added to definition of done}');
Q.at(63.5).cmd('tokens build --themes debrief,learner')
 .o('162 tokens · markers ≥ 3:1 · status = colour + shape {ok:✓}');
Q.at(70).o('every AI moment links to a source event {dim:(no source, no moment)}');
Q.at(81).cmd('components --audit')
 .o('Timeline, ClipCard, QuestionDrawer {ok:✓}')
 .o('a11y failures 8 → {warn:3} {dim:· fixed in the system}');
Q.at(100.5).cmd('a11y audit --wcag 2.2 --sr nvda,voiceover')
 .o('{ok:0 failures} {dim:· captions on all 1,240 recordings}');
Q.at(105.5).cmd('ai-readiness --asr --latency')
 .o('WER gap {ok:2.3 pp} · draft {ok:38 s} · seek {ok:180 ms}');
Q.at(112).o('gates: a11y {ok:✓} fairness {ok:✓} privacy {ok:✓} latency {ok:✓}');
Q.at(116).o('{ok:quality gates ✓ cycle complete}');

const amb = (b, pool, seed) => ambient(b.lines(), pool, seed, {cps: b.cps});
return {
  meta: Object.assign({}, META, {path:'ux-mission-control <b>~/simcapture-lighthouse</b> · sprint 11'}),
  phases: PHASES,
  kpis: [
    {label:'Time to debrief start', target:'target ≤ 3:00', pts:[
      [9.5,{v:'11:30',n:'baseline · median',s:'bad'}],
      [79.5,{v:'4:20',n:'R1 mid-fi · n=5',s:'warn'}],
      [88.5,{v:'2:50',n:'R2 hi-fi · n=5',s:''}],
      [104,{v:'2:10',n:'eval · 60 scenarios · −81%',s:'good'}]]},
    {label:'Objective data cited', target:'target ≥ 75% of debriefs', pts:[
      [3,{v:'23%',n:'baseline · survey + usage',s:'bad'}],
      [107,{v:'81%',n:'centre pilot · 320 debriefs',s:'good'}]]},
    {label:'DASH · 7-point', target:'target ≥ 6.0', pts:[
      [28,{v:'5.1',n:'baseline · 9 observed',s:'warn'}],
      [106.5,{v:'6.2',n:'pilot · Δ +1.1',s:'good'}]]},
    {label:'Psychological safety', target:'guardrail ≥ 6.0 · never lower', pts:[
      [28,{v:'5.4',n:'baseline · learners',s:'warn'}],
      [108.5,{v:'6.1',n:'pilot · non-inferior ✓',s:'good'}]]},
    {label:'SUS · debrief view', target:'target ≥ 75 · avg 68', pts:[
      [12,{v:'61.0',n:'grade D',s:'bad'}],
      [79.5,{v:'70.5',n:'grade C',s:'warn'}],
      [88.5,{v:'77.0',n:'grade B',s:''}],
      [105,{v:'82.4',n:'grade A',s:'good'}]]},
    {label:'WCAG 2.2 AA failures', target:'target 0', pts:[
      [20,{v:'8',n:'debrief view audit',s:'bad'}],
      [84,{v:'3',n:'fixed via design system',s:'warn'}],
      [103,{v:'0',n:'re-audit · NVDA, VoiceOver',s:'good'}]]}
  ],
  panes: [
    {id:'research', file:'research.ops', role:'Discover · recruit & observe', lines:amb(R, AMB.research, 21),
      viz:{type:'codes', label:'NEW CODES PER INTERVIEW', items:INTERVIEWS, satText:'saturation reached ✓ (Guest et al. ≈ 12)'}},
    {id:'synth', file:'synthesis.board', role:'Define · make sense', lines:amb(Y, AMB.synth, 22),
      viz:{type:'hbars', label:'AFFINITY CLUSTERS · NOTES', items:[['Finding evidence fast',26,17],['Facilitator load',19,19],['Objectivity vs verdict',15,21],['Learner emotional safety',12,23],['Proving impact',8,25],['Accents & transcripts',7,27]]}},
    {id:'ideate', file:'ideation.lab', role:'Develop · diverge', lines:amb(I, AMB.ideate, 23),
      viz:{type:'scatter', n:64, start:61, every:.17, park:8, parkAt:38, seed:33, picks:[{l:'A',x:.55,y:.9,at:70.6},{l:'B',x:.3,y:.76,at:71.1},{l:'C',x:.18,y:.62,at:71.6}]}},
    {id:'usab', file:'usability.test', role:'Evaluate · find problems', lines:amb(U, AMB.usab, 24),
      viz:{type:'curve', est:15.5, obs:[[1,5,74],[2,8,75],[3,11,76],[4,12,77],[5,13,78]], before:'theory: 5 users ≈ 84% of problems', after:'R1 observed (of est. 15) vs Nielsen–Landauer'}},
    {id:'ab', file:'pilot.analytics', role:'Measure · prove it', lines:amb(A, AMB.analytics, 25),
      viz:{type:'funnel', label:'DEBRIEF QUALITY · % OF DEBRIEFS', legend:['control','timeline'], baseAt:2.5, varAt:96, varDur:11,
        steps:[['Started ≤ 3 min',14,78],['Used recording',29,88],['Cited CPR data',23,81],['Covered positives',41,86],['Used inquiry',48,74],['DASH ≥ 6',31,67]]}},
    {id:'qual', file:'quality.gates', role:'Deliver · fair, accessible, fast', lines:amb(Q, AMB.quality, 26),
      viz:{type:'gauges', label:'AI & CAPTURE BUDGETS', beforeAt:22, afterAt:106.5, captionBefore:'fairness and latency over budget', captionAfter:'all within budget ✓',
        rows:[['WER gap',' pp',8,3,5,6.1,2.3],['AI draft',' s',150,60,100,140,38],['Seek',' ms',1200,300,600,900,180]]}}
  ],
  overlay: {eyebrow:'Sprint 11 · cycle complete', title:'Debriefs now start with evidence, not a scavenger hunt',
    rows:[['Debrief start','11:30 → <b>2:10</b> median'],['Objective data','23% → <b>81%</b> of debriefs'],['DASH','5.1 → <b>6.2</b> · Δ +1.1'],['Psych safety','5.4 → <b>6.1</b> · non-inferior'],['AI timeline','precision <b>0.94</b> · recall <b>0.89</b>']],
    note:'Simulated data; methods and thresholds are real.'}
};
})();
