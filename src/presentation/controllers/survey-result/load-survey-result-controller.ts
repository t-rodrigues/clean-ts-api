import { LoadSurveyResult } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const surveyResult = await this.loadSurveyResult.load(surveyId);

      if (!surveyResult) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
