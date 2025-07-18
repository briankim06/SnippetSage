
import { Request, Response, NextFunction } from 'express';
import Metric from '../models/Metric';

export function latencyMetric(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', async () => {
    // Only log search requests – adjust if you want global metrics
    if (req.path.startsWith('/api/snippets/search')) {
      const ms = Date.now() - start;
      try {
        await Metric.create({
          path: req.path,
          method: req.method,
          ms,
          createdAt: new Date(),
          userId: (req as any).user?.id ?? null, // optional
        });
      } catch (err) {
        // Don’t crash the request if metrics insert fails
        console.error('Metric insert failed', err);
      }
    }
  });

  next();
}
