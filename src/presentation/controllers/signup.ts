import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
  }
}
