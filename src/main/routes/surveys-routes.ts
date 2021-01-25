import { Router } from 'express';

import { expressAdapterRoute } from '@main/adapter';
import { makeAddSurveyController } from '@main/factories';

export default (router: Router): void => {
  router.post('/surveys', expressAdapterRoute(makeAddSurveyController()));
};
