import { Router } from 'express';

import { expressAdapterRoute } from '@main/adapter';
import { makeLoginController, makeSignUpController } from '@main/factories';

export default (router: Router): void => {
  router.post('/signup', expressAdapterRoute(makeSignUpController()));
  router.post('/login', expressAdapterRoute(makeLoginController()));
};
