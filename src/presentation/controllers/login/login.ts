import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
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

    const { email } = httpRequest.body;

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return badRequest(new InvalidParamError('email'));
    }

    return null;
  }
}
