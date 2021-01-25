import { HttpRequest, HttpResponse, Middleware } from '@presentation/contracts';
import { AccessDeniedError } from '@presentation/errors';
import { forbidden } from '@presentation/helpers';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError());
  }
}
