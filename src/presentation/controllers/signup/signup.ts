import { AddAccount } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { badRequest, created, serverError } from '@/presentation/helpers';
import { EmailValidator } from '@/validation/contracts';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return created(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
