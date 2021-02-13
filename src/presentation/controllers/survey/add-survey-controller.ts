import { AddSurvey } from '@domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@presentation/contracts';
import { badRequest, noContent, serverError } from '@presentation/helpers';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = httpRequest.body;

      await this.addSurvey.add({
        question,
        answers,
        date: new Date(Date.now()),
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
