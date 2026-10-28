# Load test result

- Date: 2026-10-28T03:12:53.442Z
- Target: http://localhost:5000
- Virtual users: 50, loops: 20, ramp-up: 30s, think time: 300ms
- Duration: 29.7 s, throughput: 3.4 requests/s

| Label | Samples | Error % | Avg ms | p90 ms | p95 ms | p99 ms | Max ms |
|---|---|---|---|---|---|---|---|
| GET /api/health | 50 | 100.0 | 11.9 | 19.7 | 26.4 | 86.1 | 86.1 |
| POST /api/auth/login | 50 | 100.0 | 10.3 | 14.7 | 18.4 | 31.0 | 31.0 |
| TOTAL | 100 | 100.0 | 11.1 | 18.0 | 24.8 | 31.0 | 86.1 |

Status codes: {"0":100}