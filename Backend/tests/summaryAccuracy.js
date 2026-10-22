// Run from the Backend folder:  node tests/summaryAccuracy.js
// Measures how well the built-in summarizer finds action items and decisions
// in sample meetings where we already know the right answers.
// Make sure OPENAI_API_KEY is empty so the free built-in engine is tested.

import { AiService } from '../src/services/aiService.js';

const participants = [{ name: 'Sarah Connor' }, { name: 'Alex Rivera' }];

// Each sample has a transcript and the keywords we EXPECT to be found.
const samples = [
  {
    name: 'Sprint planning',
    transcript: [
      { speaker: 'Sarah Connor', text: 'We decided to deploy the preview build on Friday.' },
      { speaker: 'Sarah Connor', text: 'Alex will finish the Kanban integration tomorrow, it is urgent.' },
      { speaker: 'Alex Rivera', text: 'I agree, we should also review the JWT security audit next week.' },
      { speaker: 'Alex Rivera', text: 'Great progress on the WebRTC latency, it looks excellent.' },
    ],
    expectedActions: ['kanban', 'security audit'],
    expectedDecisions: ['deploy'],
  },
  {
    name: 'Design review',
    transcript: [
      { speaker: 'Sarah Connor', text: 'We agreed to use the new dark theme for the meeting room.' },
      { speaker: 'Alex Rivera', text: 'I will update the participant grid layout by Thursday.' },
      { speaker: 'Sarah Connor', text: 'Please test the captions feature on Chrome and Edge.' },
      { speaker: 'Alex Rivera', text: 'The accessibility colors look good so far.' },
    ],
    expectedActions: ['participant grid', 'captions'],
    expectedDecisions: ['dark theme'],
  },
  {
    name: 'Release readiness',
    transcript: [
      { speaker: 'Alex Rivera', text: 'We approved the release candidate for the staging environment.' },
      { speaker: 'Sarah Connor', text: 'Alex needs to configure the Docker build before tomorrow, it is critical.' },
      { speaker: 'Sarah Connor', text: 'We should also set up the monitoring dashboard next week.' },
      { speaker: 'Alex Rivera', text: 'I am happy with the load test results, great job team.' },
    ],
    expectedActions: ['docker', 'monitoring'],
    expectedDecisions: ['release candidate'],
  },
];

const hits = (generated, expectedKeywords) =>
  expectedKeywords.filter((k) => generated.some((g) => g.includes(k))).length;

const relevant = (generated, expectedKeywords) =>
  generated.filter((g) => expectedKeywords.some((k) => g.includes(k))).length;

const pct = (n) => `${Math.round(n * 100)}%`;

const run = async () => {
  const rows = [];

  for (const s of samples) {
    const summary = await AiService.generateMeetingSummary({
      title: s.name,
      transcript: s.transcript,
      participants,
    });

    const actions = summary.actionItems.map((a) => a.task.toLowerCase());
    const decisions = summary.decisionsMade.map((d) => d.toLowerCase());

    const recallA = hits(actions, s.expectedActions) / s.expectedActions.length;
    const precisionA = actions.length ? relevant(actions, s.expectedActions) / actions.length : 0;
    const recallD = hits(decisions, s.expectedDecisions) / s.expectedDecisions.length;
    const precisionD = decisions.length ? relevant(decisions, s.expectedDecisions) / decisions.length : 0;

    const f1 = (p, r) => (p + r === 0 ? 0 : (2 * p * r) / (p + r));
    const score = (f1(precisionA, recallA) + f1(precisionD, recallD)) / 2;

    rows.push({
      Sample: s.name,
      'Actions found': pct(recallA),
      'Actions precision': pct(precisionA),
      'Decisions found': pct(recallD),
      'Decisions precision': pct(precisionD),
      Score: pct(score),
    });
  }

  console.table(rows);

  const avg = rows.reduce((sum, r) => sum + parseInt(r.Score, 10), 0) / rows.length;
  console.log(`\nAverage score: ${Math.round(avg)}%  (target from the project document: above 85%)`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});