import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/contracts';
import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';

import { mockSurveyResult } from '@/domain/test/mocks';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository {
  async save(saveSurveyResult: SaveSurveyResultParams): Promise<void> {}
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository {
  async loadBySurveyId(surveyId: string): Promise<SurveyResult> {
    return mockSurveyResult();
  }
}
