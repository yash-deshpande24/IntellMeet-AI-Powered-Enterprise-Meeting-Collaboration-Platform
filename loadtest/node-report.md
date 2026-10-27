# Load test result

- Date: 2026-10-27T04:46:27.413Z
- Target: http://localhost:5000
- Virtual users: 50, loops: 20, ramp-up: 30s, think time: 300ms
- Duration: 91.6 s, throughput: 66.0 requests/s

| Label | Samples | Error % | Avg ms | p90 ms | p95 ms | p99 ms | Max ms |
|---|---|---|---|---|---|---|---|
| GET /api/health | 1000 | 0.0 | 63.5 | 154.1 | 213.7 | 419.4 | 770.6 |
| POST /api/auth/login | 50 | 0.0 | 347.1 | 612.2 | 798.5 | 1884.0 | 1884.0 |
| GET /api/meetings | 1000 | 0.0 | 199.5 | 449.7 | 605.1 | 960.7 | 1760.8 |
| GET /api/tasks | 1000 | 0.0 | 227.3 | 510.7 | 618.1 | 857.2 | 2003.3 |
| GET /api/workspaces | 1000 | 0.0 | 190.0 | 393.0 | 502.9 | 807.6 | 1231.0 |
| GET /api/analytics | 1000 | 0.0 | 565.4 | 1197.7 | 1382.8 | 2604.6 | 3040.1 |
| GET /api/notifications | 1000 | 0.0 | 211.6 | 418.9 | 606.0 | 1128.2 | 2006.8 |
| TOTAL | 6050 | 0.0 | 243.8 | 578.1 | 798.9 | 1432.5 | 3040.1 |

Status codes: {"200":6050}