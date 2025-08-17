import { INestApplication } from '@nestjs/common';
import { collectDefaultMetrics, register } from 'prom-client';

export function RegisterMetrics(app: INestApplication) {
  collectDefaultMetrics();
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance().get('/metrics', async (_req: any, res: any) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}
