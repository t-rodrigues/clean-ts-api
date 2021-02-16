import { LoadAccountByToken } from '@/domain/usecases';
import {
  HttpRequest,
  HttpResponse,
  Middleware,
} from '@/presentation/contracts';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountBy: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];

      if (accessToken) {
        const findAccount = await this.loadAccountBy.load(
          accessToken,
          this.role,
        );

        if (findAccount) {
          return ok({ accountId: findAccount.id });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
