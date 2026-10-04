/* =====================================================================
   Laerdal UX Discovery Portal — content layer
   ---------------------------------------------------------------------
   Every method, activity, goal and timebox in this file is taken from
   exactly two sources (summarised, never invented):
     1. Tanzu Labs — "A Guide to Product Discovery" (labspractices.com)
     2. Product Discovery Methods (pdmethods.com), incl. its copy of the
        d.school Design Thinking Bootleg
   Terminal "simulations" are illustrative motion graphics, not data.
   ===================================================================== */
window.UX = (function () {
  'use strict';

  /* ---------- Portal configuration (edit these) ---------- */
  var CONFIG = {
    org: 'Laerdal Medical',
    team: 'UX Team',
    // Paste the URL of your SharePoint "UX Monthly Checklist" list here
    // (or set it from the Checklist page → "Team List" button).
    sharepointListUrl: '',
    screensaverSceneSeconds: 45
  };

  /* ---------- Sources ---------- */
  var SOURCES = {
    labs: {
      short: 'Tanzu Labs',
      name: 'A Guide to Product Discovery — Tanzu Labs Practices',
      author: 'Luke Malcher',
      url: 'https://labspractices.com/guides/guide-to-product-discovery/'
    },
    pdm: {
      short: 'PD Methods',
      name: 'Product Discovery Methods',
      url: 'https://pdmethods.com/'
    },
    bootleg: {
      short: 'd.school Bootleg',
      name: 'Design Thinking Bootleg by d.school at Stanford (via pdmethods.com)',
      url: 'https://pdmethods.com/d-school-design-thinking-bootleg/'
    }
  };

  var LABS = 'https://labspractices.com';
  var PDM = 'https://pdmethods.com/';

  /* ---------- PD Methods library (slug → method) ----------
     desc = short summary of the method page; time = timebox the source lists */
  var M = {};
  function add(slug, name, desc, time) { M[slug] = { slug: slug, name: name, desc: desc, time: time || '', url: PDM + slug + '/' }; }

  // Understand the Opportunity
  add('opportunity-assessment-review', 'Opportunity Assessment Review', 'Review the product opportunity assessment with team and stakeholders so everyone shares the problem, the context and how success will be measured.', '1 hour+');
  add('business-model-canvas', 'Business Model Canvas', 'Visualise a new business model idea — or rethink the current one — to highlight key drivers and build shared understanding.', '15 min – several days');
  add('lightning-demos', 'Lightning Demos', 'Look at how competitors’ products solve similar problems.', '10 min');
  add('review-industry-macro-research', 'Review Industry & Macro Research', 'Know your markets, competitors, customer wants and needs, and what it takes to compete.', '10 min');
  // Understand the User
  add('proto-personas', 'Proto-Personas', 'Quick, ad-hoc personas that depict the customers encountering this situation or problem.', '1 hour');
  add('empathy-map', 'Empathy Map', 'Profile customers in context by what they think & feel, see & hear, say & do.', '15–20 min');
  add('pain-gain-map', 'Pain-Gain Map', 'Capture users’ pains and gains to understand what motivates and influences their decisions.', '10–15 min');
  add('value-proposition-canvas', 'Value Proposition Canvas', 'Map and discuss your value propositions and how they match customer needs.', '45–90 min');
  add('customer-journey-map', 'Customer Journey Map', 'Illustrate the steps customers take with your product or company, and how they feel along the way.', '10–15 min');
  add('job-stories', 'Job Stories', 'Find growth opportunities by deconstructing a job customers are trying to get done.', '1 hour');
  add('ethnographic-field-studies', 'Ethnographic Field Studies', 'Silently observe customers using your product in their natural environment.', 'weeks');
  add('contextual-inquiry-interviews', 'Contextual Inquiry Interviews', 'Observe users with your product or prototype and probe the how and why of their actions.', 'weeks');
  add('diary-studies', 'Diary Studies', 'Customers keep a daily diary of product use and of their wider digital habits.', 'weeks');
  add('focus-groups', 'Focus Groups', 'A conversation with a group of customers to understand their attitudes toward your product.', 'days');
  add('site-intercept-surveys', 'Site Intercept Surveys', 'A short, engaging survey shown to customers while they use your product.', 'hours');
  add('on-the-street-surveys', 'On-the-Street Surveys', 'Hit the streets as a team and ask passers-by to fill in a short survey.', 'hours');
  add('moderated-usability-study', 'Moderated Usability Study', 'Pose tasks and questions to see how successfully users interact with a product or prototype.', 'days');
  add('unmoderated-usability-study', 'Unmoderated Usability Study', 'Record users via webcam or screen capture to see how well they perform tasks.', 'days');
  // Understand the Problem
  add('problem-hypotheses', 'Problem Hypotheses', 'Determine and state your most important assumptions about the user problem.', '45–60 min');
  add('5-ws', '5 W’s', 'Answer who, what, where, when and why to understand the problem’s context.', '30–90 min');
  add('draw-the-problem', 'Draw the Problem', 'Quick drawings that define the problem simply, clearly and compellingly.', '20–30 min');
  add('fishbowl', 'Fishbowl', 'One group discusses the problem while another listens and observes — for a more meaningful conversation.', '40–45 min');
  add('the-five-whys', 'The Five Whys', 'Drill below the surface to find a problem’s root cause in its context.', '1 hour+');
  add('challenge-cards', 'Challenge Cards', 'Think through challenges and pitfalls in a product, service or strategy, then match them with solutions.', '30–60 min');
  add('poster-session', 'Poster Session', 'Communicate ideas and core concepts as image-led posters to summarise a challenge for discussion.', '20 min');
  add('swot-analysis', 'SWOT Analysis', 'Evaluate the team’s likelihood of success against an objective via strengths, weaknesses, opportunities and threats.', '1–2 hours');
  add('post-the-path', 'Post the Path', 'Define your group’s existing process at a high level to understand it better.', '30–60 min');
  // Confirm the Problem
  add('tree-testing', 'Tree Testing', 'Find gaps between your product’s navigation and what users actually expect.', 'days');
  add('stakeholder-interviews', 'Stakeholder Interviews', 'Uncover the varied business needs and motivations around your product.', 'days');
  add('go-no-go-decision', 'Go/No-Go Decision', 'Decide whether to move a solution forward, pivot, or scrap the idea.', '1 hour');
  // Identify Possible Solutions
  add('mind-mapping', 'Mind Mapping', 'Mix your ideas with your notes and loosely organise them on paper.', '10–15 min');
  add('post-up', 'Post-Up', 'Generate ideas individually on sticky notes, then quickly present them to the group.', '10–60 min');
  add('6-8-5-sketching', '6-8-5 Sketching', 'Make 6–8 sketches in 5 minutes to get many ideas down, then iterate on the best.', '30–60 min');
  add('brainwriting', 'Brainwriting', 'Generate ideas individually, share them, then build on them together.', '30–45 min');
  add('start-stop-continue', 'Start, Stop, Continue', 'Brainstorm what to start, what to stop, and what already works and should continue.', '10–60 min');
  add('the-anti-problem', 'The Anti-Problem', 'When ideas run dry, solve the opposite problem to get unstuck.', '30–45 min');
  add('storyboarding', 'Storyboarding', 'Sketch how a user would move through part of a user story.', '10–20 min');
  add('elevator-pitch', 'Elevator Pitch', 'Use mad-libs to write a compelling pitch for a product, service or idea.', '90 min');
  add('the-vc-pitch', 'The VC Pitch', 'Pitch the idea as if to venture capitalists: selling points, how it makes money, why people buy.', '30–90 min');
  add('participatory-design', 'Participatory Design', 'Bring customers in to collaboratively build their ideal product with the team.', 'weeks');
  // Narrow the Field
  add('silent-3-min-critique', 'Silent/3-Min Critique', 'Converge on the most promising storyboards with individual critique followed by voting.', '5–10 min');
  add('design-the-box', 'Design the Box', 'Design the “package” for an idea to force focused decisions on its most important features.', '1 hour+');
  add('identify-conflicts', 'Identify Conflicts', 'Find where storyboards take two or more different approaches to the same problem.', '30–60 min');
  add('affinity-map', 'Affinity Mapping', 'Sort and cluster information to reveal embedded patterns of thinking.', '45–90 min');
  add('impact-effort-matrix', 'Impact & Effort Matrix', 'Evaluate possible actions by effort/cost to implement against potential impact.', '30–60 min');
  add('planning-poker', 'Planning Poker', 'An estimating technique to quickly agree which solutions to prototype and which to toss.', '15–30 min');
  add('forced-ranking', 'Forced Ranking', 'Build a prioritised list as a group by ranking items relative to each other.', '30–60 min');
  add('20-20-vision', '20/20 Vision', 'Get clarity on which initiatives deserve priority based on perceived benefits.', '30–90 min');
  add('dot-voting', 'Dot Voting', 'Agree on the ideas that resonate most to narrow a large set of possibilities.', '15–30 min');
  add('fists-to-five-voting', 'Fists-to-Five Voting', 'Quickly see each person’s opinion of a possible solution.', '15–30 min');
  add('new-useful-feasible-test', 'New-Useful-Feasible Test', 'Everyone rates ideas on how new, useful and feasible they are.', '15–30 min');
  // Create Tests
  add('define-assumptions', 'Define Assumptions', 'Surface the implicit assumptions about users inside a solution before testing starts.', '45–60 min');
  add('operational-definition', 'Operational Definition', 'Quantify how the team will prove or disprove each assumption.', '45–60 min');
  add('live-data-prototypes', 'Live-Data Prototypes', 'Prototype for live users at a statistically significant scale.', '30 min – days');
  // Validate with Users
  add('concierge-testing', 'Concierge Testing', 'Guide potential customers through a proposed product to gauge willingness to adopt.', 'days');
  add('concept-testing', 'Concept Testing', 'Use concept sketches and interface designs to judge how well a direction attracts users.', 'days');
  add('desirability-study', 'Desirability Study', 'Test a prototype’s visual design and layout against users’ preferences.', 'days');
  add('card-sorting', 'Card Sorting', 'Users group your product’s building blocks to validate navigation and taxonomy.', 'days');
  add('a-b-testing', 'A/B Testing', 'Test solutions against each other in production to see which performs best.', 'weeks');
  add('demand-validation-tests', 'Demand Validation Tests', 'Find out whether users actually want the feature or product.', 'weeks');
  add('wizard-of-oz-tests', 'Wizard-of-Oz Tests', 'Test a complicated product without building it by pulling strings behind the curtain.', '1–2 hours');
  // Pivot on Learnings
  add('synthesise-results', 'Synthesise Results', 'Synthesise user-testing results to draw conclusions about the prototype.', '1 hour+');
  add('brown-bag-sharing-session', 'Brown Bag Sharing Session', 'A short, informal session to spread learnings and shared understanding across teams.', '30–60 min');

  // Design Thinking Bootleg methods (pdmethods.com/<slug>/)
  add('assume-a-beginners-mindset', 'Assume a Beginner’s Mindset', 'Set aside your own expertise and assumptions so you can see users’ experience freshly.');
  add('what-how-why', 'What? How? Why?', 'Scaffolding that moves you from concrete observations to more abstract emotions and motives.');
  add('interview-preparation', 'Interview Preparation', 'Time with users is precious — prepare questions while leaving room for user-led conversation.');
  add('interview-for-empathy', 'Interview for Empathy', 'Interview — ideally in person and in pairs — to understand behaviours, choices and needs.');
  add('extreme-users', 'Extreme Users', 'Engage users at the extremes; their work-arounds and needs amplify what mainstream users feel.');
  add('story-share-and-capture', 'Story Share-and-Capture', 'After interviews, the team shares the stories it heard to get everyone up to speed and capture details.');
  add('journey-map', 'Journey Map', 'Dissect a process into its moving parts to illuminate areas of potential insight.');
  add('prototype-for-empathy', 'Prototype for Empathy', 'Build a prototype or experience specifically to learn about the people interacting with it.');
  add('user-driven-prototyping', 'User-Driven Prototyping', 'Users create parts of the design themselves, revealing their assumptions and desires.');
  add('storytelling', 'Storytelling', 'A well-told story — rich detail, surprising meaning, universal emotion — moves both head and heart.');
  add('i-like-i-wish-what-if', 'I Like, I Wish, What If', 'A simple feedback framing that keeps communication open, honest and constructive.');
  add('review-your-portfolio', 'Review Your Portfolio', 'Review your mix of incremental and disruptive innovations to balance the portfolio.');
  add('empathy-probe', 'Empathy Probe', 'Probes elicit emotion-rich conversations and help direct early empathy interviews.');
  add('analogous-empathy', 'Analogous Empathy', 'Look outside your organisation to analogous situations for fresh inspiration.');
  add('shooting-video', 'Shooting Video', 'Video is a powerful medium for communicating ideas, insights and stories.');
  add('editing-video', 'Editing Video', 'At its core, editing is storytelling — be meticulous in shaping the narrative.');
  add('powers-of-ten', 'Powers of Ten', 'Reframe the challenge at different magnitudes, for synthesis or ideation.');
  add('2x2-matrix', '2×2 Matrix', 'Scaffold information about users and the design space to reveal relationships.');
  add('why-how-laddering', 'Why-How Laddering', 'Ask “why” for abstract needs and “how” for concrete ones; find a meaningful, actionable middle.');
  add('point-of-view-pov', 'Point of View (POV)', 'Turn your design challenge into an actionable problem statement anchored in a specific user.');
  add('design-guidelines', 'Design Guidelines', 'Written statements of how you will solve the challenge, independent of any specific solution.');
  add('how-might-we-questions', '“How Might We” Questions', 'Short questions that launch ideation — broad enough for many solutions, narrow enough to focus.');
  add('describe-your-concept', 'Describe Your Concept', 'Distil what resonated about a selected idea so the team truly understands it.');
  add('surprise-to-insights-leap', 'Surprise-to-Insights Leap', 'Articulate the “nuggets” from empathy work by exploring different interpretations.');
  add('stoke', 'Stoke', 'Brief activities that loosen up and energise a team before a meeting or brainstorm.');
  add('brainstorming', 'Brainstorming', 'A distinct burst of time to generate many ideas — generative brain up, evaluative brain down.');
  add('facilitate-a-brainstorm', 'Facilitate a Brainstorm', 'Good facilitation sets the stage for open, active and generative ideation.');
  add('brainstorm-selection', 'Brainstorm Selection', 'The hard part: choosing which of many wide-ranging ideas to act on.');
  add('impose-constraints', 'Impose Constraints', 'Intentional constraints can — counter-intuitively — increase creative potential.');
  add('empathetic-data', 'Empathetic Data', 'Give decision makers a basis for comparison when new ideas are hard to prove empirically.');
  add('yes-and-brainstorm', 'Yes, And! Brainstorm', 'Structured building on each other’s ideas so quieter voices aren’t left out.');
  add('improvise-to-life', 'Improvise to Life', 'Break analysis paralysis by improvising the idea into being.');
  add('scenes-props-roles', 'Scenes/Props/Roles', 'Improv-inspired preparation for testing a prototype in the field with real users.');
  add('testing-with-users', 'Testing with Users', 'Test with users to refine the solution and better understand the people you design for.');
  add('prototype-to-decide', 'Prototype to Decide', 'Resolve team disagreements by prototyping the options and letting results decide.');
  add('identify-a-variable', 'Identify a Variable', 'Single out one variable to prototype and test instead of a complete mock-up.');
  add('wizard-of-oz-prototyping', 'Wizard of Oz Prototyping', 'Fake the functionality you want to test, saving the time and cost of building it.');
  add('feedback-capture-matrix', 'Feedback Capture Matrix', 'Four quadrants for real-time feedback: likes (+), wishes (Δ), questions (?), ideas (💡).');

  function m(slug) { return M[slug]; }

  /* ---------- PD Methods: 9 phases (pdmethods.com menu order) ---------- */
  var PDM_PHASES = [
    { id: 'understand-the-opportunity', name: 'Understand the Opportunity', methods: ['opportunity-assessment-review', 'business-model-canvas', 'lightning-demos', 'review-industry-macro-research'] },
    { id: 'understand-the-user', name: 'Understand the User', methods: ['proto-personas', 'empathy-map', 'pain-gain-map', 'value-proposition-canvas', 'customer-journey-map', 'job-stories', 'ethnographic-field-studies', 'contextual-inquiry-interviews', 'diary-studies', 'focus-groups', 'site-intercept-surveys', 'on-the-street-surveys', 'moderated-usability-study', 'unmoderated-usability-study'] },
    { id: 'understand-the-problem', name: 'Understand the Problem', methods: ['problem-hypotheses', '5-ws', 'draw-the-problem', 'fishbowl', 'the-five-whys', 'challenge-cards', 'poster-session', 'swot-analysis', 'post-the-path'] },
    { id: 'confirm-the-problem', name: 'Confirm the Problem', methods: ['tree-testing', 'stakeholder-interviews', 'go-no-go-decision'] },
    { id: 'identify-possible-solutions', name: 'Identify Possible Solutions', methods: ['mind-mapping', 'post-up', '6-8-5-sketching', 'brainwriting', 'start-stop-continue', 'the-anti-problem', 'storyboarding', 'elevator-pitch', 'the-vc-pitch', 'participatory-design'] },
    { id: 'narrow-the-field', name: 'Narrow the Field', methods: ['silent-3-min-critique', 'design-the-box', 'identify-conflicts', 'affinity-map', 'impact-effort-matrix', 'planning-poker', 'forced-ranking', '20-20-vision', 'dot-voting', 'fists-to-five-voting', 'new-useful-feasible-test', 'stakeholder-interviews', 'contextual-inquiry-interviews'] },
    { id: 'create-tests', name: 'Create Tests', methods: ['define-assumptions', 'operational-definition', 'live-data-prototypes'] },
    { id: 'validate-with-users', name: 'Validate with Users', methods: ['contextual-inquiry-interviews', 'concierge-testing', 'concept-testing', 'desirability-study', 'card-sorting', 'a-b-testing', 'demand-validation-tests', 'wizard-of-oz-tests', 'moderated-usability-study', 'unmoderated-usability-study'] },
    { id: 'pivot-on-learnings', name: 'Pivot on Learnings', methods: ['synthesise-results', 'the-five-whys', 'pain-gain-map', 'dot-voting', 'brown-bag-sharing-session', 'go-no-go-decision'] }
  ];
  // Portal's alignment of PD Methods phases to the Tanzu Labs stages (our mapping, for orientation)
  var PDM_TO_LABS = {
    'understand-the-opportunity': 'discovery', 'understand-the-user': 'discovery', 'understand-the-problem': 'discovery', 'confirm-the-problem': 'discovery',
    'identify-possible-solutions': 'framing', 'narrow-the-field': 'framing', 'create-tests': 'framing', 'validate-with-users': 'framing', 'pivot-on-learnings': 'framing'
  };

  /* ---------- Tanzu Labs: Problem Discovery & Solution Framing ----------
     Terminal sim line codes:  "$ "=typed command  "> "=output  "+ "=success
     "! "=warning  "x "=risk  "= "=highlight  "# label|ms"=progress bar  "~ ms"=pause
     Sample segments come from laerdal.com's public description of who Laerdal
     serves (hospitals, universities, first responders, laypeople). Illustrative only. */
  var DISCOVERY = {
    id: 'discovery',
    name: 'Problem Discovery',
    kicker: 'Stage 1 · Diverge → Converge',
    duration: 'Typically a fast-paced 2–3 weeks',
    goal: 'Clearly define an important problem that, if solved, will deliver the highest business and user value.',
    pitfall: 'Jumping to solutions too quickly. Stay focused on needs, challenges and behaviours during this stage.',
    areas: [
      {
        name: 'Understand the business',
        activities: [
          {
            id: 'assumptions', name: 'Assumptions', url: LABS + '/practices/assumptions/',
            goal: 'Capture the underlying assumptions about the desired business outcome and the user problems to solve.',
            who: 'A wide range of stakeholders and subject-matter experts',
            output: 'Assumptions ranked by risk — the riskiest guide your research',
            pdm: ['problem-hypotheses', 'opportunity-assessment-review', 'stakeholder-interviews', 'define-assumptions'],
            sim: ['$ assumptions capture --with stakeholders,SMEs', '> workshop open · 9 participants', '+ 23 assumptions logged', '$ assumptions rank --by risk', '# ranking|1400', '! A-07 “instructors want remote debriefs” → HIGH risk', '! A-12 “hospitals buy per seat” → HIGH risk', '= 5 riskiest assumptions → research plan', '~ 1600']
          }
        ]
      },
      {
        name: 'Understand users',
        activities: [
          {
            id: 'proto-personas', name: 'Proto-Personas', url: LABS + '/practices/personas/',
            goal: 'Draw up proto-personas to decide which users to target.',
            who: 'Product team with SMEs',
            output: 'Target user segments to steer research',
            pdm: ['proto-personas', 'empathy-map', 'pain-gain-map', 'extreme-users'],
            sim: ['$ personas draft --quick', '> segment: hospitals', '> segment: universities', '> segment: first responders', '> segment: laypeople', '# sketching profiles|1300', '+ 4 proto-personas on the wall', '= focus: 2 segments for round-1 research', '~ 1600']
          },
          {
            id: 'user-research', name: 'User Research', url: LABS + '/practices/user-research-introduction-session/',
            goal: 'Validate or invalidate assumptions with end users and SMEs — 1:1 interviews, observing users in context.',
            who: 'Designers, PMs, engineers — with end users',
            output: 'Evidence against your riskiest assumptions',
            pdm: ['contextual-inquiry-interviews', 'ethnographic-field-studies', 'diary-studies', 'interview-for-empathy'],
            sim: ['$ research run --method interview --n 8', '> P-01 … P-08 scheduled', '# interviewing|1800', '> “We rehearse the hand-off more than the skill.”', '+ A-07 evidence: 6/8 confirm', 'x A-12 evidence: 1/8 — invalidated', '$ research observe --in-context', '+ 42 field notes captured', '~ 1500']
          },
          {
            id: 'journey-maps', name: 'Journey Maps', url: LABS + '/practices/journey-map/',
            goal: 'Capture existing workflows and visualise pain points and opportunities.',
            who: 'Whole team',
            output: 'Current-state journey with pain points',
            pdm: ['customer-journey-map', 'journey-map', 'post-the-path', 'job-stories'],
            sim: ['$ journey map --current-state', '> step 1 prepare  → step 2 run  → step 3 debrief', '# plotting emotions|1300', 'x pain: setup time before each session', 'x pain: debrief notes scattered', '+ 3 opportunities marked', '~ 1500']
          },
          {
            id: 'service-blueprints', name: 'Service Blueprints', url: LABS + '/practices/service-blueprint/',
            goal: 'Capture interactions across people, systems and back-stage processes.',
            who: 'Whole team incl. technical architects',
            output: 'Front-stage / back-stage interaction map',
            pdm: ['post-the-path', 'customer-journey-map', '5-ws'],
            sim: ['$ blueprint build --lanes user,frontstage,backstage,support', '# connecting touchpoints|1500', '> 17 touchpoints · 6 hand-offs', '! hand-off #4 has no owner', '+ blueprint v1 saved', '~ 1500']
          },
          {
            id: 'research-synthesis', name: 'Research Synthesis', url: LABS + '/practices/research-synthesis/',
            goal: 'Step back from personal feelings and look objectively at all notes and data.',
            who: 'Everyone who did the research',
            output: 'Key insights, patterns and problems',
            pdm: ['affinity-map', 'synthesise-results', 'the-five-whys', 'story-share-and-capture'],
            sim: ['$ synthesize --notes 214 --method affinity', '# clustering|1800', '> cluster “preparation burden”   ×31', '> cluster “debrief quality”      ×27', '> cluster “proving competence”   ×19', '= 3 insights · 7 problem statements', '~ 1600']
          }
        ]
      },
      {
        name: 'Prioritise the key problem to solve',
        activities: [
          {
            id: 'problem-prioritization', name: 'Problem Prioritisation', url: LABS + '/practices/problem-prioritization',
            goal: 'Agree on a single problem that is both highly valuable and feasible to solve — using a 2×2.',
            who: 'Whole team — involve engineers for feasibility',
            output: 'One prioritised problem + target user segment',
            pdm: ['2x2-matrix', 'impact-effort-matrix', 'dot-voting', 'go-no-go-decision'],
            sim: ['$ prioritize problems --2x2 value:feasibility', '> P1 high value · high feasibility', '> P2 high value · low feasibility', '> P3 low value · high feasibility', '# engineers scoring feasibility|1500', '= SELECTED: P1 — debrief quality for hospitals', '+ problem statement locked → Solution Framing', '~ 1800']
          }
        ]
      }
    ]
  };

  var FRAMING = {
    id: 'framing',
    name: 'Solution Framing',
    kicker: 'Stage 2 · Diverge → Converge',
    duration: 'Length not fixed by the guide — set it with your team',
    goal: 'Determine a suitable starting point for building the product, based on the problem chosen in Problem Discovery.',
    pitfall: 'Limiting yourself to software. Business processes, services and technical architectures may be better solutions.',
    areas: [
      {
        name: 'Explore many solutions',
        activities: [
          {
            id: 'solution-brainstorming', name: 'Solution Brainstorming', url: LABS + '/practices/solution-brainstorming/',
            goal: 'Generate many possible solutions to the prioritised problem — not only software.',
            who: 'Balanced team',
            output: 'A wide range of solution options',
            pdm: ['brainwriting', 'mind-mapping', 'the-anti-problem', 'how-might-we-questions'],
            sim: ['$ brainstorm --hmw "How might we make every debrief count?"', '# generating|1500', '> idea 01 guided debrief checklist', '> idea 07 auto-captured session timeline', '> idea 12 peer-review service (non-software)', '+ 31 ideas · 4 categories', '~ 1500']
          },
          {
            id: 'design-studio', name: 'Design Studios', url: LABS + '/practices/design-studio/',
            goal: 'Use the collective creativity of the team to quickly generate many options.',
            who: 'Balanced team',
            output: 'Sketched concepts, iterated in rounds',
            pdm: ['6-8-5-sketching', 'storyboarding', 'silent-3-min-critique'],
            sim: ['$ studio start --rounds 3 --sketch 6-8-5', '# round 1 sketching|1300', '> 48 sketches on the wall', '# round 2 converge|1200', '> 9 concepts survive', '+ round 3: 2 storyboards', '~ 1500']
          },
          {
            id: 'design-critique', name: 'Design Critique', url: LABS + '/practices/design-critique/',
            goal: 'Gather early feedback from the whole team on emerging designs.',
            who: 'Balanced team',
            output: 'Feedback that shapes the next iteration',
            pdm: ['silent-3-min-critique', 'i-like-i-wish-what-if', 'feedback-capture-matrix'],
            sim: ['$ critique run --format "I like / I wish / What if"', '> + clear entry point', '> Δ too many steps before value', '> ? who owns the summary', '> 💡 one-tap share to instructor', '+ 14 notes → design backlog', '~ 1500']
          }
        ]
      },
      {
        name: 'Focus on a high-value starting point',
        activities: [
          {
            id: 'solution-prioritization', name: 'Solution Prioritisation', url: LABS + '/practices/solution-prioritization/',
            goal: 'Weigh user & business value against technical complexity to find a high-value, low-complexity start — or a proof of concept for a risky, necessary element.',
            who: 'Whole team incl. engineers',
            output: 'A starting point (or proof of concept)',
            pdm: ['impact-effort-matrix', 'forced-ranking', 'new-useful-feasible-test', 'planning-poker'],
            sim: ['$ prioritize solutions --2x2 value:complexity', '# plotting|1300', '> S2 high value · low complexity', '> S5 high value · high complexity → proof of concept?', '= START: S2 — guided debrief summary', '+ PoC scheduled for S5 core risk', '~ 1600']
          }
        ]
      },
      {
        name: 'Run experiments to test concepts',
        activities: [
          {
            id: 'lean-experiments', name: 'Lean Experiments', url: LABS + '/practices/lean-experiments/',
            goal: 'Validate the riskiest “leap of faith” assumptions in the quickest, cheapest way possible.',
            who: 'Product team',
            output: 'Evidence to persevere, pivot or stop',
            pdm: ['define-assumptions', 'operational-definition', 'wizard-of-oz-tests', 'concierge-testing'],
            sim: ['$ experiment define --assumption "instructors will share summaries"', '> success = ≥60% share within 24h', '$ experiment run --type wizard-of-oz --n 12', '# observing|1800', '+ 9/12 shared (75%) → PERSEVERE', '~ 1600']
          }
        ]
      },
      {
        name: 'Define your value proposition & success metrics',
        activities: [
          {
            id: 'lean-business-canvas', name: 'Lean Business Canvas', url: LABS + '/practices/lean-business-canvas/',
            goal: 'Summarise early adopters, value proposition, business assumptions and key success metrics.',
            who: 'Team and stakeholders',
            output: 'One-page canvas with success metrics',
            pdm: ['business-model-canvas', 'value-proposition-canvas', 'elevator-pitch'],
            sim: ['$ canvas fill --lean', '> early adopters: hospital sim centres', '> value prop: every debrief → shareable learning', '> metric: summaries shared / session', '+ canvas reviewed with stakeholders', '~ 1600']
          },
          {
            id: 'user-story-mapping', name: 'User Stories', url: LABS + '/practices/user-stories/',
            goal: 'Prepare an initial backlog of user stories for delivery.',
            who: 'PM, design, engineering',
            output: 'Initial backlog ready for delivery',
            pdm: ['storyboarding', 'job-stories'],
            sim: ['$ stories map --feature "guided debrief"', '# slicing|1300', '> 14 stories · 3 releases', '+ backlog ready → Delivery', '~ 1600']
          }
        ]
      }
    ]
  };

  var DELIVERY = {
    goal: 'Discovery is not about understanding the whole ecosystem or designing the whole product up front.',
    entry: ['Agreement on a single, validated feature', 'An initial backlog of user stories'],
    loop: ['Ship working software', 'Gather user feedback', 'Prioritise the backlog', 'Iterate the outcome-based roadmap'],
    links: [
      { name: 'User Stories', url: LABS + '/practices/user-stories/' },
      { name: 'Outcome-based roadmap', url: LABS + '/practices/outcome-oriented-roadmap/' }
    ],
    note: 'User research does not stop when delivery starts — feedback becomes more vital as you ship.'
  };

  var TEAM = {
    roles: ['Product designers', 'Product managers', 'Engineers', 'Subject-matter experts', 'Technical architects', 'End users'],
    why: ['Ensures a range of perspectives', 'Results in solutions that are both usable and feasible to build', 'Aligns the whole team on why the product is worth building'],
    parallel: { name: 'Technical discovery (in parallel)', detail: 'Value stream mapping, pipeline & codebase set-up, pushing a skeleton app to production.', url: LABS + '/practices/value-stream-map/' }
  };

  /* ---------- Design Thinking Bootleg: 5 modes ---------- */
  var BOOTLEG = [
    {
      id: 'empathize', name: 'Empathize', glyph: '●', color: 'var(--mode-empathize)', page: 'empathize.html', src: PDM + 'how-to-empathize/',
      lead: 'Empathy is the foundation of human-centred design. The problems you solve are rarely your own — they belong to particular users.',
      verbs: [['Observe', 'View users and their behaviour in the context of their lives.'], ['Engage', 'Interact with and interview users — scheduled and short “intercept” encounters.'], ['Immerse', 'Wear your users’ shoes; experience what they experience.']],
      methods: ['assume-a-beginners-mindset', 'what-how-why', 'interview-preparation', 'interview-for-empathy', 'extreme-users', 'story-share-and-capture', 'journey-map', 'prototype-for-empathy', 'user-driven-prototyping', 'storytelling', 'i-like-i-wish-what-if', 'review-your-portfolio', 'empathy-probe', 'analogous-empathy', 'shooting-video', 'editing-video'],
      sim: ['$ empathize observe --context sim-centre', '> quote: “I never know if they really got it.”', '> behaviour: re-reads notes twice before debrief', '$ empathize engage --intercept 5', '# listening|1600', '$ empathize immerse --role instructor --hours 4', '+ 3 surprises · 2 contradictions captured', '~ 1600']
    },
    {
      id: 'define', name: 'Define', glyph: '✓', color: 'var(--mode-define)', page: 'define.html', src: PDM + 'how-to-define/',
      lead: 'Unpack empathy findings into needs and insights, and scope a meaningful challenge: your Point of View.',
      verbs: [['Preserve emotion', 'Keep the individual you are designing for.'], ['Strong insight', 'Choose the surprise that most shifted your perspective.'], ['Generative', 'A good POV generates lots of possibilities.']],
      methods: ['story-share-and-capture', 'journey-map', 'powers-of-ten', '2x2-matrix', 'why-how-laddering', 'point-of-view-pov', 'design-guidelines', 'how-might-we-questions', 'storytelling', 'i-like-i-wish-what-if', 'review-your-portfolio', 'describe-your-concept', 'surprise-to-insights-leap', 'shooting-video', 'editing-video'],
      sim: ['$ define pov --user --need --insight', '> USER  a new sim instructor at a busy hospital', '> NEEDS to know learners truly understood', '> BECAUSE confidence shows, competence hides', '# laddering why/how|1400', '= HMW make understanding visible in every debrief?', '~ 1700']
    },
    {
      id: 'ideate', name: 'Ideate', glyph: '★', color: 'var(--mode-ideate)', page: 'ideate.html', src: PDM + 'how-to-ideate/',
      lead: 'Generate radical design alternatives. Ideation is “going wide” — a mode of flaring instead of focus.',
      verbs: [['Fluency', 'Create volume in your innovation options.'], ['Flexibility', 'Create variety — step beyond obvious solutions.'], ['Flare, then focus', 'Never evaluate during idea generation.']],
      methods: ['powers-of-ten', 'how-might-we-questions', 'stoke', 'brainstorming', 'facilitate-a-brainstorm', 'brainstorm-selection', 'impose-constraints', 'storytelling', 'i-like-i-wish-what-if', 'empathetic-data', 'review-your-portfolio', 'yes-and-brainstorm', 'shooting-video', 'editing-video'],
      sim: ['$ ideate stoke --minutes 5', '$ ideate brainstorm --yes-and --defer-judgement', '# flaring|1700', '> 64 ideas · 9 wild cards', '$ ideate select --categories rational,delight,long-shot', '+ 3 ideas → prototype', '~ 1600']
    },
    {
      id: 'prototype', name: 'Prototype', glyph: '■', color: 'var(--mode-prototype)', page: 'prototype.html', src: PDM + 'how-to-prototype/',
      lead: 'Get ideas out of your head and into the world. Keep early prototypes inexpensive and low-resolution to learn quickly.',
      verbs: [['Empathy gaining', 'Deepen understanding of users and the design space.'], ['Exploration', 'Develop multiple concepts to test in parallel.'], ['Testing & inspiration', 'Refine solutions; inspire others with the vision.']],
      methods: ['impose-constraints', 'prototype-for-empathy', 'improvise-to-life', 'scenes-props-roles', 'testing-with-users', 'prototype-to-decide', 'identify-a-variable', 'user-driven-prototyping', 'wizard-of-oz-prototyping', 'storytelling', 'i-like-i-wish-what-if', 'empathetic-data', 'review-your-portfolio', 'shooting-video', 'editing-video'],
      sim: ['$ prototype build --fidelity low --material paper', '# cutting & taping|1500', '> variable under test: summary length', '$ prototype scenes-props-roles --rehearse', '+ 3 variants ready in 2 hours', '~ 1600']
    },
    {
      id: 'test', name: 'Test', glyph: '◆', color: 'var(--mode-test)', page: 'test.html', src: PDM + 'how-to-test/',
      lead: 'Prototype as if you know you’re right, but test as if you know you’re wrong.',
      verbs: [['Learn about users', 'Testing is another chance to build empathy.'], ['Refine', 'Testing informs the next prototype — sometimes back to the drawing board.'], ['Re-check your POV', 'You may have framed the problem incorrectly.']],
      methods: ['testing-with-users', 'prototype-to-decide', 'identify-a-variable', 'wizard-of-oz-prototyping', 'feedback-capture-matrix', 'storytelling', 'i-like-i-wish-what-if', 'empathetic-data', 'review-your-portfolio', 'shooting-video', 'editing-video'],
      sim: ['$ test run --users 6 --in-context', '# observing|1700', '> +  “finally, a summary I can send”', '> Δ  “wish it showed what I missed”', '> ?  “who else sees this?”', '> 💡 “add a confidence slider”', '+ POV holds · iterate prototype v2', '~ 1600']
    }
  ];

  /* ---------- Monthly checklist (derived from the Labs activities) ---------- */
  var CHECKLIST = [];
  function pushArea(stage, phase) {
    phase.areas.forEach(function (area) {
      area.activities.forEach(function (a) {
        CHECKLIST.push({
          id: stage + '-' + a.id, stage: phase.name, area: area.name, title: a.name,
          done: a.output, guide: a.url, methods: a.pdm
        });
      });
    });
  }
  pushArea('discovery', DISCOVERY);
  pushArea('framing', FRAMING);
  CHECKLIST.push(
    { id: 'delivery-entry', stage: 'Moving into Delivery', area: 'Entry criteria', title: 'Single validated feature agreed', done: 'One validated feature + initial user-story backlog', guide: LABS + '/practices/user-stories/', methods: ['go-no-go-decision'] },
    { id: 'delivery-roadmap', stage: 'Moving into Delivery', area: 'Continuous', title: 'Outcome-based roadmap iterated', done: 'Roadmap updated from shipped-feature feedback', guide: LABS + '/practices/outcome-oriented-roadmap/', methods: ['synthesise-results'] },
    { id: 'ritual-brownbag', stage: 'Team rituals', area: 'Share learnings', title: 'Brown Bag Sharing Session held', done: 'Learnings shared with other teams this month', guide: PDM + 'brown-bag-sharing-session/', methods: ['brown-bag-sharing-session'] },
    { id: 'ritual-pivot', stage: 'Team rituals', area: 'Pivot on learnings', title: 'Go/No-Go decision recorded', done: 'Persevere / pivot / stop decision documented', guide: PDM + 'go-no-go-decision/', methods: ['go-no-go-decision', 'synthesise-results'] }
  );

  /* ---------- Ambient terminal chatter for the home wall & screensaver ---------- */
  function allSims() {
    var out = [];
    [DISCOVERY, FRAMING].forEach(function (ph) {
      ph.areas.forEach(function (ar) { ar.activities.forEach(function (a) { out.push({ title: a.id + '.sim', stage: ph.name, lines: a.sim }); }); });
    });
    BOOTLEG.forEach(function (b) { out.push({ title: b.id + '.mode', stage: 'Design Thinking', lines: b.sim }); });
    return out;
  }

  return {
    CONFIG: CONFIG, SOURCES: SOURCES, METHODS: M, m: m,
    PDM_PHASES: PDM_PHASES, PDM_TO_LABS: PDM_TO_LABS,
    DISCOVERY: DISCOVERY, FRAMING: FRAMING, DELIVERY: DELIVERY, TEAM: TEAM,
    BOOTLEG: BOOTLEG, CHECKLIST: CHECKLIST, allSims: allSims
  };
})();
