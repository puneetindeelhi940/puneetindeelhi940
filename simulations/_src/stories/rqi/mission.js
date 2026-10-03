/* RQI · Mission Control story */
const STORY = (() => {
const PHASES = [
  {name:'Discover', mode:'Empathize', shape:'div'},
  {name:'Define', mode:'Define', shape:'conv'},
  {name:'Develop', mode:'Ideate · Prototype', shape:'div'},
  {name:'Deliver', mode:'Test · Ship', shape:'conv'}
];

const R = script('research');
R.at(.3).cmd('recruit --screener heartline --quota night:4,day:3,edu:2,mgr:2,chair:1')
 .o('412 volunteers {dim:→} 58 eligible {dim:→} {ok:12 scheduled}')
 .o('consent 12/12 {ok:✓} {dim:· recordings stay on the hospital network}');
INTERVIEWS.forEach(iv => {
  R.at(iv.at - 1.5).o(`{k:${iv.id}} {dim:${iv.role} · ${iv.mins} min}`, .3).o(`{q:“${iv.q}”}`, .3);
  R.at(iv.at).o(iv.codes ? `{dim:  → ${iv.codes} new codes}` : '{ok:  → 0 new codes · saturation}', .1);
});
R.at(27.2).cmd('shadow --units ICU,5E --nights 3')
 .o('RQI cart sits in a break room on {warn:2 of 3} units')
 .o('survey {k:n=1,128} {dim:·} {warn:61%} finish in the final 7 days')
 .o('top barrier: interruptions {warn:54%}');
R.at(33).o('{dim:repository: 12 transcripts · 64 codes · 1,128 survey rows}', .6).o('{dim:handoff → synthesis}');
R.at(62).cmd('recruit --round R1 --n 5 --mix night:3,day:2')
 .o('5/5 booked {dim:· incl. a 5′1″ nurse who needs a step stool}');
R.at(81.5).cmd('recruit --round R2 --n 5 --fresh-eyes')
 .o('5/5 booked {dim:· no repeat participants}');
R.at(90.5).cmd('pilot --units 12 --stepped-wedge --steps 4')
 .o('{ok:12 units enrolled} {dim:· 1,940 nurses}');
R.at(116).o('{ok:research ops ✓ cycle complete}');

const Y = script('synthesis');
Y.at(1).o('{dim:monitoring · notes stream in as interviews finish}');
Y.at(16.5).cmd('affinity --notes 263 --method bottom-up')
 .o('clustering 263 notes {dim:(no pre-set categories)}');
Y.at(21).o('{k:empathy map} SAYS “I’ll do it next shift”')
 .o('DOES waits for the due-date email {dim:(61%)}')
 .o('THINKS “what if I fail it?”')
 .o('FEELS rushed and watched');
Y.at(26).cmd('journey --persona night-nurse --stages 6')
 .o('emotional low {err:−2.7} when paged mid-session');
Y.at(30.5).cmd('pov --madlib dschool')
 .o('{hl:POV} Night-shift nurses need to finish CPR practice in one uninterrupted 10 minutes near their unit, because breaks are short, pages are constant and restarting feels like failing.', 1.4);
Y.at(36.5).cmd('hmw --count 5')
 .o('HMW let a session survive a page?')
 .o('HMW make feedback coach instead of scold?')
 .o('HMW show who is about to be due, not who is late?');
Y.at(42.5).cmd('heart --goals --signals --metrics')
 .o('{k:A} on-time ≥ 90% {dim:·} {k:H} SUS ≥ 75')
 .o('{k:T} first-try pass ≥ 75%, ≤ 10:00 {dim:·} {k:R} depth in target at 90 d');
Y.at(48).o('{k:personas} 2 behavioural + 1 extreme user {dim:(float nurse, 5 hospitals)}', .6)
 .o('{k:principles} resume, never restart · one cue at a time · no leaderboards');
Y.at(56).o('{ok:define gate ✓} {dim:nursing, education, resus committee}');
Y.at(77.5).cmd('synthesize --round R1 --rainbow-sheet')
 .o('12 issues → 5 themes {dim:· top: resuming after a page}');
Y.at(88.5).o('R2: 3 new issues, {ok:all sev ≤ 2}');
Y.at(106).cmd('share --highlights 18 --audience resus-committee')
 .o('findings reel {dim:· 18 clips · 9 hospitals}');
Y.at(116).o('{ok:synthesis ✓ cycle complete}');

const I = script('ideation');
I.at(2).o('{dim:monitoring · waiting for a point of view}');
I.at(38).o('{dim:parking lot:} 6 early ideas {dim:(judgment deferred)}');
I.at(60.3).cmd('brainstorm --hmw 3 --rounds 3x7min')
 .o('rules {dim:·} defer judgment {dim:·} go for volume {dim:·} build on others', .6)
 .o('{k:64 ideas} in 21 min {dim:· wild: “Stayin’ Alive” mode, ~103 bpm}');
I.at(66.5).cmd('crazy8s --designers 6')
 .o('48 sketches {dim:· 8 per person in 8 min}');
I.at(69.5).cmd('vote --dots --delight --rational --long-shot')
 .o('{ok:A} badge tap + pause/resume {dim:· RICE} 2,340')
 .o('{ok:B} one-cue coaching, depth first {dim:· RICE} 1,860')
 .o('{ok:C} due-soon view for managers {dim:· RICE} 1,410');
I.at(75.5).cmd('prototype --paper --concepts A,B,C')
 .o('{k:Wizard of Oz} coaching {dim:(an educator spoke the cues)}');
I.at(80).cmd('prototype --mid-fi --target station-ui')
 .o('19 screens · 1280×800 touch · tokens linked');
I.at(85.5).cmd('prototype --hi-fi --states all')
 .o('paged · resumed · calibrating · offline {ok:✓}');
I.at(94).o('{dim:handoff → engineering · 36 annotated specs}');
I.at(116).o('{ok:ideation ✓ cycle complete}');

const U = script('usability');
U.at(.6).cmd('benchmark --current-flow --n 8 --in-situ')
 .o('{dim:T1 log in & start · T2 adult session · T3 resume after a page}');
U.at(6).o('T1 log in & start {warn:7/8} {dim:· 2:48}', 1.5)
 .o('T2 adult session {ok:8/8} {dim:· first-try pass 4/8}', 1.5)
 .o('T3 resume after a page {err:1/8}', 3)
 .o('median {warn:14:20} {dim:·} SUS {warn:58.8}');
U.at(13.5).cmd('heuristic-eval --evaluators 3 --nielsen-10')
 .o('H3 user control: no pause or resume {err:sev 4}')
 .o('H1 status: no progress indicator {err:sev 4}')
 .o('H9 errors: “CAL_ERR 0x2F” {warn:sev 3}')
 .o('H6 recall: re-type employee ID {warn:sev 3}')
 .o('21 violations {dim:· merged across 3 evaluators}');
U.at(28).o('{dim:handoff → synthesis}');
U.at(72.3).cmd('test --round R1 --mid-fi --n 5 --think-aloud');
[[74,5],[75,3],[76,2],[77,1],[78,1]].forEach(([at, n], i) =>
  U.at(at).o(`P${i+1} {dim:new issues} ${n}${i === 4 ? ' {dim:→ diminishing returns}' : ''}`));
U.at(79.5).o('R1: 12 issues {err:sev4×1} {warn:sev3×4} {dim:sev2×4 sev1×3}')
 .o('SUS 69.5 · first-try 68% · 11:05');
U.at(84).cmd('test --round R2 --hi-fi --n 5');
U.at(88.5).o('R2: 3 new {ok:all sev ≤ 2} {dim:·} SUS 76.0 {dim:·} 10:12');
U.at(91.5).cmd('benchmark --variant --n 40 --in-situ');
U.at(100).o('no restart needed {ok:36/40 = 90%} {dim:95% CI 76–97 (adj. Wald)}', 4)
 .o('median session {ok:9:40} {dim:(−33%)}', 1)
 .o('SUS {ok:81.3} {dim:A ·} first-try pass {ok:77%}');
U.at(116).o('{ok:usability ✓ cycle complete}');

const A = script('analytics');
A.at(1.5).cmd('funnel --quarter Q2 --cohort all-nurses')
 .o('6,200 due {dim:→} {warn:64.0%} on time', 1.2)
 .o('biggest drop: logged in → completed {err:−14 pts}');
A.at(8.5).cmd('sessions --filter abandoned')
 .o('{warn:17%} of sessions abandoned mid-way')
 .o('median abandon at 4:10 {dim:· pages and alarms}');
A.at(22).o('{dim:managers send ~140 reminder emails each per quarter}');
A.at(40.5).cmd('instrument --framework heart --events 12')
 .o('12 events {dim:· no individual scores shown to peers}');
A.at(62.5).cmd('pilot design --stepped-wedge --units 12')
 .o('cluster = unit · 4 steps · 3 weeks each')
 .o('primary: on-time completion {dim:· ICC 0.05}')
 .o('guardrails: abandons · alarm response · data loss');
A.at(95).cmd('pilot launch --wedge 1')
 .o('balance check: unit size & acuity {ok:✓}');
A.at(100).o('wedges 1–2 live · {warn:interim only} {dim:· no early stopping}');
A.at(105.5).o('all 12 units · 1,940 nurses')
 .o('before {warn:64.0%} · after {ok:91.2%}')
 .o('Δ {ok:+27.2 pp} {dim:95% CI [22.9, 31.5] · p < 0.001}', .8)
 .o('abandons {ok:17% → 6%} · alarm response flat {ok:✓}');
A.at(110.5).cmd('rollout --system-wide')
 .o('{ok:live in 9 hospitals} {dim:· monitoring 2 quarters}');
A.at(116).o('{ok:analytics ✓ cycle complete}');

const Q = script('quality');
Q.at(1.2).o('{dim:monitoring fleet · baseline audit at 0:15}');
Q.at(14.8).cmd('a11y audit --wcag 2.2 --level AA --station')
 .o('1.4.1 depth status by red/green only')
 .o('1.4.3 coaching text {err:3.4:1} {dim:(needs 4.5:1)}')
 .o('2.5.8 resume button {err:18×18} {dim:(min 24×24)}')
 .o('1.3.3 “follow the green bar” {dim:+7 more}')
 .o('{err:11 failures}');
Q.at(21.2).cmd('station perf --fleet 42')
 .o('boot {warn:48 s} · sync p95 {warn:2.4 s} · loss {err:0.8%}');
Q.at(44).o('{dim:a11y + perf budgets added to definition of done}');
Q.at(63.5).cmd('tokens build --themes station,dashboard')
 .o('188 tokens · status = colour + icon + text {ok:✓}');
Q.at(70).o('targets ≥ 44 px for gloved hands {dim:(beyond the 24 px AA minimum)}');
Q.at(81).cmd('components --audit')
 .o('ResumeCard, DepthCue, DueSoonList {ok:✓}')
 .o('a11y failures 11 → {warn:5} {dim:· fixed in the system}');
Q.at(100.5).cmd('a11y audit --wcag 2.2 --sr talkback,nvda')
 .o('{ok:0 failures} {dim:· 2 best-practice notes}');
Q.at(105.5).cmd('station perf --fleet 42')
 .o('boot {ok:12 s} · sync p95 {ok:0.6 s} · loss {ok:0.02%}');
Q.at(112).o('gates: a11y {ok:✓} perf {ok:✓} privacy {ok:✓} clinical {ok:✓}');
Q.at(116).o('{ok:quality gates ✓ cycle complete}');

const amb = (b, pool, seed) => ambient(b.lines(), pool, seed, {cps: b.cps});
return {
  meta: Object.assign({}, META, {path:'ux-mission-control <b>~/rqi-heartline</b> · sprint 07'}),
  phases: PHASES,
  kpis: [
    {label:'On-time completion', target:'target ≥ 90%', pts:[
      [7,{v:'64.0%',n:'baseline · last quarter',s:'warn'}],
      [100,{v:'83%',n:'wedges 1–2 · interim',s:''}],
      [107,{v:'91.2%',n:'stepped-wedge · 12 units',s:'good'}]]},
    {label:'Median session time', target:'target ≤ 10:00', pts:[
      [12,{v:'14:20',n:'baseline · n=8',s:'bad'}],
      [79.5,{v:'11:05',n:'R1 mid-fi · n=5',s:'warn'}],
      [88.5,{v:'10:12',n:'R2 hi-fi · n=5',s:''}],
      [104,{v:'9:40',n:'benchmark · n=40 · −33%',s:'good'}]]},
    {label:'SUS · RQI station', target:'target ≥ 75 · avg 68', pts:[
      [12,{v:'58.8',n:'grade D',s:'bad'}],
      [79.5,{v:'69.5',n:'grade C',s:'warn'}],
      [88.5,{v:'76.0',n:'grade B',s:''}],
      [105,{v:'81.3',n:'grade A',s:'good'}]]},
    {label:'First-try CPR pass', target:'depth · rate · recoil ≥ 75%', pts:[
      [7.5,{v:'58%',n:'baseline',s:'bad'}],
      [79.5,{v:'68%',n:'R1',s:'warn'}],
      [88.5,{v:'74%',n:'R2',s:''}],
      [105,{v:'77%',n:'benchmark',s:'good'}]]},
    {label:'Open issues · sev 3–4', target:'target 0 sev-4', pts:[
      [12,{v:'2',n:'baseline test',s:'warn'}],
      [17,{v:'6',n:'+ heuristic eval',s:'bad'}],
      [20,{v:'10',n:'+ heuristic eval',s:'bad'}],
      [70,{v:'7',n:'addressed in concepts',s:'warn'}],
      [79.5,{v:'12',n:'R1 found 5 new',s:'bad'}],
      [86,{v:'5',n:'fixed in hi-fi',s:'warn'}],
      [100,{v:'2',n:'fixed in build',s:'warn'}],
      [110.5,{v:'1',n:'sev 3 · deferred, owned',s:'good'}]]},
    {label:'WCAG 2.2 AA failures', target:'target 0', pts:[
      [20,{v:'11',n:'station + dashboard audit',s:'bad'}],
      [84,{v:'5',n:'fixed via design system',s:'warn'}],
      [103,{v:'0',n:'re-audit · TalkBack, NVDA',s:'good'}]]}
  ],
  panes: [
    {id:'research', file:'research.ops', role:'Discover · recruit & interview', lines:amb(R, AMB.research, 11),
      viz:{type:'codes', label:'NEW CODES PER INTERVIEW', items:INTERVIEWS, satText:'saturation reached ✓ (Guest et al. ≈ 12)'}},
    {id:'synth', file:'synthesis.board', role:'Define · make sense', lines:amb(Y, AMB.synth, 12),
      viz:{type:'hbars', label:'AFFINITY CLUSTERS · NOTES', items:[['Access & interruption',24,17],['Login & handoff friction',18,19],['Feedback overload',15,21],['Fear of judgment',12,23],['Body mechanics',9,25],['Manager chasing',8,27]]}},
    {id:'ideate', file:'ideation.lab', role:'Develop · diverge', lines:amb(I, AMB.ideate, 13),
      viz:{type:'scatter', n:64, start:61, every:.17, park:6, parkAt:38, seed:21, picks:[{l:'A',x:.3,y:.88,at:70.6},{l:'B',x:.22,y:.7,at:71.1},{l:'C',x:.58,y:.78,at:71.6}]}},
    {id:'usab', file:'usability.test', role:'Evaluate · find problems', lines:amb(U, AMB.usab, 14),
      viz:{type:'curve', est:14.3, obs:[[1,5,74],[2,8,75],[3,10,76],[4,11,77],[5,12,78]], before:'theory: 5 users ≈ 84% of problems', after:'R1 observed (of est. 14) vs Nielsen–Landauer'}},
    {id:'ab', file:'rollout.analytics', role:'Measure · prove it', lines:amb(A, AMB.analytics, 15),
      viz:{type:'funnel', label:'QUARTER FUNNEL · % OF NURSES DUE', legend:['before','after'], baseAt:2.5, varAt:96, varDur:11,
        steps:[['Due notice',100,100],['Visited station',82,95],['Logged in',78,94],['Completed',64,91],['First-try pass',37,70],['Depth in target',61,79]]}},
    {id:'qual', file:'quality.gates', role:'Deliver · accessible & reliable', lines:amb(Q, AMB.quality, 16),
      viz:{type:'gauges', label:'STATION FLEET · 42 CARTS', beforeAt:22, afterAt:106.5, captionBefore:'all three outside budget', captionAfter:'all three within budget ✓',
        rows:[['Boot→ready',' s',60,15,30,48,12],['Sync p95',' s',3,.8,1.6,2.4,.6],['Data loss','%',1,.1,.5,.8,.02]]}}
  ],
  overlay: {eyebrow:'Sprint 07 · cycle complete', title:'Quarterly CPR practice now fits a shift',
    rows:[['On-time completion','64.0% → <b>91.2%</b> · +27.2 pp'],['Session time','14:20 → <b>9:40</b> median'],['First-try CPR pass','58% → <b>77%</b>'],['SUS','58.8 (D) → <b>81.3</b> (A)'],['WCAG 2.2 AA','11 failures → <b>0</b>']],
    note:'Simulated data; methods and thresholds are real.'}
};
})();
