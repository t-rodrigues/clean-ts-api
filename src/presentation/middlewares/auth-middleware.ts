import { LoadAccountByToken } from '@domain/usecases';
import { HttpRequest, HttpResponse, Middleware } from '@presentation/contracts';
import { AccessDeniedError } from '@presentation/errors';
import { forbidden } from '@presentation/helpers';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountBy: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];

    if (!accessToken) {
      return forbidden(new AccessDeniedError());
    }

    await this.loadAccountBy.load(accessToken);
    return null;
  }
}
