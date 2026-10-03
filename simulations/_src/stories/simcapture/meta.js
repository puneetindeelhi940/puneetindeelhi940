/* ============ Use case: AI-assisted debriefing in SimCapture (concept study, simulated data) ============ */
const META = {
  usecase: 'simcapture',
  project: 'Project Lighthouse',
  eyebrow: 'SimCapture · simulation debriefing',
  headline: 'Evidence-ready debriefs before learners leave the room',
  goal: 'Instructors start a debrief within 3 minutes, with the three moments that matter and objective data, and AI suggests questions instead of verdicts.',
  strip: 'ecg',
  disclaimer: 'Unofficial concept study for a design portfolio. Not affiliated with or endorsed by Laerdal Medical. SimCapture, LLEAP, SimMan and other product names belong to their owners. The AI features shown are a design concept, not a description of the shipping product. All project data is simulated; methods, guidelines and thresholds are real.',
  sources: [
    'SimCapture: Laerdal’s simulation management and learning platform that records audio/video, patient-monitor data, simulator events, checklists and annotations for debriefing, OSCEs and quality improvement; integrates with LLEAP-driven simulators.',
    'PEARLS debriefing framework: Reactions, Description, Analysis, Summary (Eppich &amp; Cheng, 2015). Advocacy-inquiry and “debriefing with good judgment” (Rudolph et al., 2006).',
    'DASH, the Debriefing Assessment for Simulation in Healthcare (Center for Medical Simulation): six elements rated on a 7-point scale. INACSL Healthcare Simulation Standards of Best Practice (2021): prebriefing and debriefing.',
    'Team psychological safety (Edmondson, 1999). The simulation “basic assumption”: everyone participating is intelligent, capable, cares about doing their best and wants to improve.',
    'AHA in-hospital resuscitation quality: time to first shock for VF ≤ 2 minutes from recognition (Get With The Guidelines measure), compression fraction ≥ 80%, pauses under 10 s.',
    'Speech recognition error rates differ across accents and speaker groups (e.g. Koenecke et al., PNAS 2020), which is why transcript-based summaries need fairness checks.',
    'Event detection measured as precision and recall against human annotators; inter-rater agreement with Cohen’s κ.',
    'Double Diamond (Design Council 2005; NN/g) with d.school modes; saturation ≈ 12 interviews (Guest et al., 2006); Nielsen–Landauer; SUS curved grades (Sauro &amp; Lewis); HEART (Google); RICE (Intercom).',
    'WCAG 2.2 AA: 1.2.2 captions (prerecorded), 2.1.1 keyboard, 2.5.7 dragging movements, 1.4.11 non-text contrast.'
  ]
};

const INTERVIEWS = [
  ['P01','instructor · nursing',38,16,'By the time I find the shock in the video, the learners have cooled off.'],
  ['P02','sim operations tech',33,12,'I run the manikin, the cameras and the timer. Annotating is the first thing to go.'],
  ['P03','learner · BSN year 3',24,9,'The debrief felt like my opinion against theirs. Show me the numbers.'],
  ['P04','instructor · EM residency',41,8,'If an AI says “compressions were poor”, that’s a grade. I want a question.'],
  ['P05','program director',36,5,'I can’t show the dean that debriefing improves anything.'],
  ['P06','learner · PGY-1',22,4,'Seeing myself on video is mortifying. Don’t make it the first thing.'],
  ['P07','instructor · ICU',35,3,'PEARLS keeps me honest, but I lose the thread at “analysis”.'],
  ['P08','sim operations tech',29,2,'The log says “Defib 200 J at 03:12”. That’s gold, if anyone could find it.'],
  ['P09','resident · IMG',26,2,'The transcript gets my accent wrong, so the summary is wrong.'],
  ['P10','instructor · paediatrics',31,1,'Hot debriefs are 20 minutes. I spend 10 of them looking for clips.'],
  ['P11','learner · paramedic',23,1,'Tell me what went well too, not just the misses.'],
  ['P12','instructor · simulation fellow',34,0,'Don’t automate the conversation. Automate the homework.']
].map((r, i) => ({id:r[0], role:r[1], mins:r[2], codes:r[3], q:r[4], at:5.5 + i*1.9}));

const ROOMS = ['sim room 1','sim room 2','OR sim','in situ · ED','skills lab'];
const AMB = {
  research: [
    r => `transcript chunk ${ri(r,2,40)}/40 · speaker-tagged · names stripped`,
    r => `tag · note #${ri(r,10,281)} → “${pick(r,['finding evidence','cognitive load','objectivity','emotional safety','proving impact'])}”`,
    r => `observing debrief ${ri(r,1,9)}/9 · ${pick(r,ROOMS)}`,
    r => `consent ledger · ${ri(r,10,12)}/12 ✓`
  ],
  synth: [
    r => `board autosave · ${ri(r,190,281)} notes`,
    r => `quote #${ri(r,3,64)} verified against transcript ✓`,
    r => `duplicate notes merged · ${ri(r,1,4)}`,
    r => `cluster drift check · stable`
  ],
  ideate: [
    (r, s) => s < 60 ? `inspiration · ${ri(r,3,12)} analogous examples saved (sports video review, flight debriefs)` : `sketch sk-${String(ri(r,1,48)).padStart(2,'0')}.png uploaded`,
    (r, s) => s < 60 ? `teardown · ${pick(r,['sports replay tagging','podcast chapters','code review comments'])} noted` : `figma autosave · frame ${ri(r,1,27)}`,
    (r, s) => s < 60 ? `inspiration · ${ri(r,3,12)} analogous examples saved (sports video review, flight debriefs)` : `prompt variant #${ri(r,1,30)} logged for eval`,
    (r, s) => s < 60 ? `teardown · ${pick(r,['sports replay tagging','podcast chapters','code review comments'])} noted` : `idea #${ri(r,1,64)} tagged “${pick(r,['timeline','questions','learner view','clips','reporting'])}”`
  ],
  usab: [
    r => `recorder · ${pick(r,ROOMS)} · audio level ok`,
    r => `observer note @ ${mmss(ri(r,30,600))} · “${pick(r,['scrubs video','opens event log','reads AI question aloud','skips learner view'])}”`,
    r => `clip exported · ${mmss(ri(r,10,90))}`,
    r => `eval set · scenario ${ri(r,1,60)}/60 annotated`
  ],
  analytics: [
    r => `ingest · ${pick(r,ROOMS)} · ${ri(r,120,900)} LLEAP events`,
    r => `video chunk ${ri(r,1,48)}/48 · 1080p · uploaded`,
    r => `events/min ${ri(r,40,95)}`,
    r => `dashboard refresh · ${ri(r,90,260)} ms`
  ],
  quality: [
    r => `asr · ${pick(r,ROOMS)} · WER ${rf(r,6,11)}%`,
    r => `♥ heartbeat · ${ri(r,22,24)}/24 capture nodes online`,
    r => `axe-ci · 0 new violations`,
    r => `retention job · ${ri(r,3,40)} recordings past policy → purged`
  ],
  station: [
    r => `${pick(r,ROOMS)} · LLEAP event “${pick(r,['CPR started','Defib 200 J','Epinephrine 1 mg','Airway placed','Pulse check'])}”`,
    r => `capture · ${pick(r,ROOMS)} · 3 cams · 1 monitor feed`,
    r => `annotation sync · ${ri(r,2,14)} markers`
  ]
};
