import { Router } from 'express';
import { expressAdapterRoute } from '../adapter';
import { makeSaveSurveyResultController } from '../factories';
import { auth } from '../middlewares';

export default (router: Router): void => {
  router.put(
    '/surveys/:accountId/results',
    auth,
    expressAdapterRoute(makeSaveSurveyResultController()),
  );
};
