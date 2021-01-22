import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@presentation/contracts';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return null;
  }
}
