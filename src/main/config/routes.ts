import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export const setupRoutes = (app: Express): void => {
  const router = Router();

  app.use('/api', router);
  readdirSync(path.join(`${__dirname}`, '..', 'routes')).map(async fileName => {
    if (!fileName.includes('test')) {
      (await import(`../routes/${fileName}`)).default(router);
    }
  });
};
