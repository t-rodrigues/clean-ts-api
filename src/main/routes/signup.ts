import { Router } from 'express';
import { expressAdapterRoute } from '@/main/adapter';
import { makeSignUpController } from '@/main/factories';

export default (router: Router): void => {
  router.post('/signup', expressAdapterRoute(makeSignUpController()));
};
