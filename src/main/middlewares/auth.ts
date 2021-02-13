import { expressAdapterMiddleware } from '@main/adapter';
import { makeAuthMiddleware } from '@main/factories/middlewares';

export const auth = expressAdapterMiddleware(makeAuthMiddleware());
