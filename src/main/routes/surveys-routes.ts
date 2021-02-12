import { Router } from 'express';

import { expressAdapterMiddleware, expressAdapterRoute } from '@main/adapter';
import { makeAddSurveyController } from '@main/factories';
import { makeAuthMiddleware } from '@main/factories/middlewares';

export default (router: Router): void => {
  const adminAuth = expressAdapterMiddleware(makeAuthMiddleware('admin'));

  router.post(
    '/surveys',
    adminAuth,
    expressAdapterRoute(makeAddSurveyController()),
  );
};
