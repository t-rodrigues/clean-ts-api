import { HttpResponse } from '@/presentation/contracts';
import { ServerError } from '../errors';
import { UnauthorizedError } from '../errors/unauthorized';

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
});

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: null,
});

export const notFound = (): HttpResponse => ({
  statusCode: 404,
  body: null,
});

export const serverError = (error: Error) => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});
