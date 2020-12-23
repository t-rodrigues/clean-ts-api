import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { EmailValidator } from '@/validation/contracts';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    this.emailValidator.isValid(httpRequest.body.email);

    return null;
  }
}
