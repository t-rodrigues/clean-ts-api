import { HttpResponse } from '@/presentation/contracts';
import { ServerError, UnauthorizedError } from '../errors';

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
});

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const serverError = (error: Error) => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});
