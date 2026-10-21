import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { client, httpRequestDurationMicroseconds } from './utils/metrics.js';

const app = express();
app.use(express.json());

// Prometheus metrics middleware
app.use((req, res, next) => {
    const startHrTime = process.hrtime();

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        httpRequestDurationMicroseconds
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(elapsedMs);
    });

    next();
});

// Metrics endpoint
app.get('/api/auth/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Auth API routes
app.use('/api/auth', authRoutes);

export default app;
