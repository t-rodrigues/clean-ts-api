import { SurveyResult } from '@/domain/entities';
import { LoadSurveyResult } from '@/domain/usecases';

import { LoadSurveyResultRepository } from '@/application/contracts';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResult> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
    );

    return surveyResult;
  }
}
