import { Middleware } from '@/presentation/contracts';
import { AuthMiddleware } from '@/presentation/middlewares';
import { makeDbLoadAccountByToken } from '../usecases';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
