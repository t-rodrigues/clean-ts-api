import { Router } from 'express';

import { expressAdapterMiddleware, expressAdapterRoute } from '@main/adapter';
import { makeAddSurveyController } from '@main/factories';
import { makeAuthMiddleware } from '@main/factories/middlewares';
import { makeLoadSurveysController } from '@main/factories/controllers';

export default (router: Router): void => {
  const adminAuth = expressAdapterMiddleware(makeAuthMiddleware('admin'));
  const auth = expressAdapterMiddleware(makeAuthMiddleware('user'));

  router.post(
    '/surveys',
    adminAuth,
    expressAdapterRoute(makeAddSurveyController()),
  );

  router.get(
    '/surveys',
    auth,
    expressAdapterRoute(makeLoadSurveysController()),
  );
};
