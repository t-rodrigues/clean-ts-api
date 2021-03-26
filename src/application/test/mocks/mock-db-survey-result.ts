import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/contracts';
import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';

import { mockSurveyResult } from '@/domain/test/mocks';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data;
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository {
  surveyResult = mockSurveyResult();
  surveyId: string;

  async loadBySurveyId(surveyId: string): Promise<SurveyResult> {
    this.surveyId = surveyId;

    return this.surveyResult;
  }
}
