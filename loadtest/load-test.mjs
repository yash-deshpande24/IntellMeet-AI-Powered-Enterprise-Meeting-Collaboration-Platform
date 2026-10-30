// Load test with no installation (uses Node's built-in fetch).
//
// Run from the project root, with the backend already running:
//   node loadtest/load-test.mjs
//   node loadtest/load-test.mjs --users 50 --loops 20 --ramp 30 --think 300
//
// Gentle test of a live site (max 10 users, needs --allow-remote):
//   node loadtest/load-test.mjs --url https://YOUR-API.onrender.com --allow-remote --users 5 --loops 5

import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : def;
};
const has = (name) => args.includes(`--${name}`);

const BASE = String(opt('url', process.env.BASE_URL || 'http://localhost:5000')).replace(/\/$/, '');
let USERS = Number(opt('users', 50));
const LOOPS = Number(opt('loops', 20));
const RAMP = Number(opt('ramp', 30));    // seconds to start all users
const THINK = Number(opt('think', 300)); // milliseconds between requests
const EMAIL = opt('email', 'admin@intellmeet.io');
const PASSWORD = opt('password', 'password123');

// Protect free hosting: remote targets need --allow-remote and are limited to 10 users
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(BASE);
if (!isLocal) {
  if (!has('allow-remote')) {
    console.error(`"${BASE}" is not local. Add --allow-remote if you really want to test it.`);
    process.exit(1);
  }
  if (USERS > 10) {
    console.warn('Remote target: limiting to 10 virtual users to protect the free tier.');
    USERS = 10;
  }
}

const AUTH_ENDPOINTS = [
  ['GET /api/meetings', '/api/meetings'],
  ['GET /api/tasks', '/api/tasks'],
  ['GET /api/workspaces', '/api/workspaces'],
  ['GET /api/analytics', '/api/analytics'],
  ['GET /api/notifications', '/api/notifications'],
];

const samples = []; // { label, ms, status, ok }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function hit(label, path, { method = 'GET', token, body } = {}) {
  const started = performance.now();
  let status = 0;
  let json = null;
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
      signal: AbortSignal.timeout(20000),
    });
    status = res.status;
    const text = await res.text();
    try { json = JSON.parse(text); } catch { /* not JSON */ }
  } catch {
    status = 0; // network error or timeout
  }
  const ms = performance.now() - started;
  samples.push({ label, ms, status, ok: status === 200 });
  return { status, json };
}

async function virtualUser(index) {
  await sleep((index * RAMP * 1000) / USERS);
  let token = null;
  for (let loop = 0; loop < LOOPS; loop++) {
    await hit('GET /api/health', '/api/health');
    await sleep(THINK);

    if (!token) {
      const { json } = await hit('POST /api/auth/login', '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
      });
      token = json?.token ?? null;
      if (!token) return; // cannot continue without a login (already counted as an error)
    }

    for (const [label, path] of AUTH_ENDPOINTS) {
      await hit(label, path, { token });
      await sleep(THINK);
    }
  }
}

const percentile = (sorted, p) =>
  sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)] : 0;

function summarize(list) {
  const times = list.map((s) => s.ms).sort((a, b) => a - b);
  const errors = list.filter((s) => !s.ok).length;
  const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);
  return {
    samples: list.length,
    errorPct: list.length ? (errors / list.length) * 100 : 0,
    avg, min: times[0] ?? 0, max: times[times.length - 1] ?? 0,
    p50: percentile(times, 50), p90: percentile(times, 90),
    p95: percentile(times, 95), p99: percentile(times, 99),
  };
}

console.log(`Target: ${BASE}`);
console.log(`Users: ${USERS}, loops: ${LOOPS}, ramp-up: ${RAMP}s, think time: ${THINK}ms\n`);

const wallStart = performance.now();
await Promise.all(Array.from({ length: USERS }, (_, i) => virtualUser(i)));
const seconds = (performance.now() - wallStart) / 1000;

const labels = [...new Set(samples.map((s) => s.label))];
const rows = labels.map((label) => ({ label, ...summarize(samples.filter((s) => s.label === label)) }));
const total = { label: 'TOTAL', ...summarize(samples) };
const throughput = samples.length / seconds;

const fmt = (n) => Number(n).toFixed(1);
const table = [...rows, total].map((r) => ({
  Label: r.label,
  Samples: r.samples,
  'Error %': fmt(r.errorPct),
  'Avg ms': fmt(r.avg),
  'p90 ms': fmt(r.p90),
  'p95 ms': fmt(r.p95),
  'p99 ms': fmt(r.p99),
  'Max ms': fmt(r.max),
}));
console.table(table);

const codes = {};
samples.forEach((s) => { codes[s.status] = (codes[s.status] || 0) + 1; });

console.log(`Duration: ${fmt(seconds)} s   Throughput: ${fmt(throughput)} requests/s`);
console.log('Status codes:', JSON.stringify(codes));
console.log(`\nTarget: error rate under 1%   -> ${total.errorPct < 1 ? 'PASS' : 'FAIL'} (${fmt(total.errorPct)}%)`);
console.log(`Target: p95 under 500 ms      -> ${total.p95 < 500 ? 'PASS' : 'FAIL'} (${fmt(total.p95)} ms)`);
if (codes[429]) console.log('\nNote: 429 means the rate limiter blocked requests. Start the backend with RATE_LIMIT_MAX and AUTH_RATE_LIMIT_MAX set high for local tests.');
if (codes[0]) console.log('\nNote: status 0 means connection errors or timeouts (is the backend running?).');

// Save results for the report
const stamp = new Date().toISOString();
writeFileSync('loadtest/node-results.json', JSON.stringify({ stamp, target: BASE, users: USERS, loops: LOOPS, ramp: RAMP, think: THINK, seconds, throughput, statusCodes: codes, total, rows }, null, 2));
const md = [
  `# Load test result`, ``,
  `- Date: ${stamp}`, `- Target: ${BASE}`,
  `- Virtual users: ${USERS}, loops: ${LOOPS}, ramp-up: ${RAMP}s, think time: ${THINK}ms`,
  `- Duration: ${fmt(seconds)} s, throughput: ${fmt(throughput)} requests/s`, ``,
  `| Label | Samples | Error % | Avg ms | p90 ms | p95 ms | p99 ms | Max ms |`,
  `|---|---|---|---|---|---|---|---|`,
  ...table.map((r) => `| ${r.Label} | ${r.Samples} | ${r['Error %']} | ${r['Avg ms']} | ${r['p90 ms']} | ${r['p95 ms']} | ${r['p99 ms']} | ${r['Max ms']} |`),
  ``, `Status codes: ${JSON.stringify(codes)}`,
].join('\n');
writeFileSync('loadtest/node-report.md', md);
console.log('\nSaved: loadtest/node-results.json and loadtest/node-report.md');
process.exit(total.errorPct < 1 ? 0 : 1);