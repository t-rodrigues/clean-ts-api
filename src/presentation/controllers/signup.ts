import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { EmailValidator } from '@/validation/contracts';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    if (!this.emailValidator.isValid(httpRequest.body.email)) {
      return badRequest(new InvalidParamError('email'));
    }
  }
}
