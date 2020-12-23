import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'));
  }
}
