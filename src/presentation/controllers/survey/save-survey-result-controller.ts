import { LoadSurveyById } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId,
    );

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return null;
  }
}
