import client from 'prom-client';

// One registry for the whole app
const register = new client.Registry();
register.setDefaultLabels({ app: 'intellmeet-backend' });

// CPU, memory, event-loop lag, garbage collection ...
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const socketConnections = new client.Gauge({
  name: 'socket_connections_active',
  help: 'Number of Socket.io clients connected right now',
  registers: [register],
});

// Times every request. Unknown URLs are grouped as "unmatched",
// so random 404 paths cannot create thousands of label values.
export const metricsMiddleware = (req, res, next) => {
  if (req.path === '/metrics') return next();

  const stopTimer = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path ? `${req.baseUrl || ''}${req.route.path}` : 'unmatched';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    stopTimer(labels);
    httpRequestsTotal.inc(labels);
  });
  next();
};

// Counts connected Socket.io clients
export const trackSockets = (io) => {
  io.on('connection', (socket) => {
    socketConnections.inc();
    socket.on('disconnect', () => socketConnections.dec());
  });
};

// GET /metrics  (set METRICS_TOKEN to require "Authorization: Bearer <token>")
export const metricsHandler = async (req, res) => {
  const token = process.env.METRICS_TOKEN;
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    return res.status(401).send('Unauthorized');
  }
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};