import { serve, setup } from 'swagger-ui-express';
import { Express } from 'express';

import { swaggerConfig } from '@/main/docs';

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig));
};
