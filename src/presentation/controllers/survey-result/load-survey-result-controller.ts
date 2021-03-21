import { LoadSurveyResult } from '@/domain/usecases';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyResult.load(httpRequest.params.surveyId);
    return null;
  }
}
