import { Router } from 'express';
import { expressAdapterRoute } from '@/main/adapter';
import {
  makeAddSurveyController,
  makeLoadSurveysController,
} from '@/main/factories';
import { adminAuth, auth } from '@/main/middlewares';

export default (router: Router): void => {
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
