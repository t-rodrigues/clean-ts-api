import { Router } from 'express';

import { expressAdapterRoute } from '../adapter';
import {
  makeLoadSurveyResultController,
  makeSaveSurveyResultController,
} from '../factories';
import { auth } from '../middlewares';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    expressAdapterRoute(makeSaveSurveyResultController()),
  );

  router.get(
    '/surveys/:surveyId/results',
    auth,
    expressAdapterRoute(makeLoadSurveyResultController()),
  );
};
