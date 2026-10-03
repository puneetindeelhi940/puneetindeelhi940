/* ============ Use case: RQI quarterly CPR practice (concept study, simulated data) ============ */
const META = {
  usecase: 'rqi',
  project: 'Project Heartline',
  eyebrow: 'RQI · resuscitation quality improvement',
  headline: 'Quarterly CPR practice that fits a nursing shift',
  goal: 'Nurses finish their 10-minute RQI session on time, without restarting, and leave with better compressions.',
  strip: 'cpr',
  disclaimer: 'Unofficial concept study for a design portfolio. Not affiliated with or endorsed by Laerdal Medical, RQI Partners or the American Heart Association. RQI, QCPR and other product names belong to their owners. All project data is simulated; methods, guidelines and thresholds are real.',
  sources: [
    'RQI (Resuscitation Quality Improvement): co-developed by the American Heart Association and Laerdal Medical (2015). Low-dose, high-frequency sessions of about 10 minutes every 90 days with real-time audiovisual CPR feedback, instead of a day of training every two years.',
    'AHA adult CPR quality targets: compression depth 5–6 cm, rate 100–120/min, full chest recoil, minimal interruptions (compression fraction ideally ≥ 80%), 30:2 without an advanced airway.',
    'CPR skills decay within months of training; short, frequent practice sustains them (e.g. Oermann et al., 2011: 6 minutes a month).',
    'Double Diamond (UK Design Council, 2005; NN/g) mapped to Stanford d.school modes: Empathize, Define, Ideate, Prototype, Test.',
    'Saturation around 12 interviews (Guest, Bunce &amp; Johnson, 2006). Problems found = 1 − (1 − 0.31)<sup>n</sup> (Nielsen &amp; Landauer). About 40 users for quantitative benchmarks (NN/g).',
    'Nielsen’s 10 heuristics with 0–4 severity. SUS average 68 with the Sauro–Lewis curved grades. Adjusted-Wald intervals for completion rates.',
    'HEART framework (Google, 2010). RICE (Intercom). Stepped-wedge cluster rollout for unit-level change (Hussey &amp; Hughes, 2007).',
    'WCAG 2.2 AA: 1.4.1 use of colour, 1.4.3 contrast 4.5:1, 1.3.3 sensory characteristics, 2.5.8 target size 24×24 CSS px.'
  ]
};

const INTERVIEWS = [
  ['P01','night RN · ICU',36,15,'The cart is in the break room. My break is the only time I’m not on my feet.'],
  ['P02','day RN · med-surg',28,12,'It said “insufficient depth” thirty times. I knew after the third.'],
  ['P03','nurse educator',44,9,'My dashboard shows red, amber, green. It doesn’t show who is about to go red.'],
  ['P04','night RN · ED',25,8,'I got paged mid-session and had to start over. Twice.'],
  ['P05','night RN · med-surg',31,6,'Logging in took longer than the compressions.'],
  ['P06','unit manager',39,5,'I chase 140 people by email every quarter.'],
  ['P07','day RN · L&D',27,3,'I’m five foot one. Depth is hard without a step stool. Nobody asked.'],
  ['P08','travel RN',22,2,'New hospital, new login, same CPR. Why do I redo everything?'],
  ['P09','RN · PICU',33,2,'Infant sessions feel like an afterthought in the flow.'],
  ['P10','day RN · ICU',29,1,'I like seeing my depth live. I hate seeing my name on a leaderboard.'],
  ['P11','resus committee chair',41,1,'I need session data next to our code outcomes, not just completion.'],
  ['P12','new-grad RN',24,0,'I’m scared of failing it, so I put it off.']
].map((r, i) => ({id:r[0], role:r[1], mins:r[2], codes:r[3], q:r[4], at:5.5 + i*1.9}));

const UNITS = ['ICU-3','5E','4W','ED','PICU','L&D','6N','CVICU'];
const AMB = {
  research: [
    r => `transcript chunk ${ri(r,2,40)}/40 · speaker-tagged · PII stripped`,
    r => `tag · note #${ri(r,10,263)} → “${pick(r,['access & interruption','login friction','feedback overload','fear of judgment','body mechanics'])}”`,
    r => `scheduler · slot moved to 0${ri(r,2,5)}:30 for night shift`,
    r => `consent ledger · ${ri(r,10,12)}/12 ✓`
  ],
  synth: [
    r => `board autosave · ${ri(r,180,263)} notes`,
    r => `quote #${ri(r,3,61)} verified against transcript ✓`,
    r => `duplicate notes merged · ${ri(r,1,4)}`,
    r => `cluster drift check · stable`
  ],
  ideate: [
    (r, s) => s < 60 ? `inspiration · ${ri(r,3,12)} analogous examples saved (aviation checklists, pit stops)` : `sketch sk-${String(ri(r,1,48)).padStart(2,'0')}.png uploaded`,
    (r, s) => s < 60 ? `teardown · ${pick(r,['fitness app streaks','badge-tap kiosks','pause/resume in games'])} noted` : `figma autosave · frame ${ri(r,1,19)}`,
    (r, s) => s < 60 ? `inspiration · ${ri(r,3,12)} analogous examples saved (aviation checklists, pit stops)` : `component lint · 0 detached instances`,
    (r, s) => s < 60 ? `teardown · ${pick(r,['fitness app streaks','badge-tap kiosks','pause/resume in games'])} noted` : `idea #${ri(r,1,64)} tagged “${pick(r,['resume','coaching','login','manager view','ergonomics'])}”`
  ],
  usab: [
    r => `recorder · room ${ri(r,1,3)} · audio level ok`,
    r => `observer note @ ${mmss(ri(r,30,600))} · “${pick(r,['hesitates at login','looks for pause','reads cue aloud','asks for step stool'])}”`,
    r => `clip exported · ${mmss(ri(r,10,90))}`,
    r => `task timer calibrated ✓`
  ],
  analytics: [
    r => `lms.sync → hospital LMS · ${ri(r,1,6)} records · ${ri(r,120,420)} ms`,
    r => `due in 7 days · ${ri(r,180,460)} nurses`,
    r => `events/min ${ri(r,40,95)}`,
    r => `dashboard refresh · ${ri(r,90,260)} ms`
  ],
  quality: [
    r => `manikin RA-${ri(r,10,99)} · sensors ok · battery ${ri(r,61,99)}%`,
    r => `♥ heartbeat · ${ri(r,39,42)}/42 stations online`,
    r => `axe-ci · 0 new violations`,
    r => `station ${pick(r,UNITS)} · boot ${ri(r,11,49)} s`
  ],
  station: [
    r => `${pick(r,UNITS)} · depth ${rf(r,4.6,6.0)} cm · rate ${ri(r,104,118)}/min · recoil ${ri(r,88,100)}%`,
    r => `badge tap · RN ••${ri(r,10,99)} · ${pick(r,UNITS)}`,
    r => `session signed · ${(r()*0xffffff|0).toString(16).padStart(6,'0')}`
  ]
};
