import { Survey } from '@/domain/entities';
import {
  AddSurvey,
  AddSurveyParams,
  LoadSurveyById,
  LoadSurveys,
} from '@/domain/usecases';

import { mockSurvey, mockSurveys } from '@/domain/test/mocks';

export class AddSurveySpy implements AddSurvey {
  async add(surveyData: AddSurveyParams): Promise<void> {
    return null;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  async loadById(id: string): Promise<Survey | null> {
    return mockSurvey();
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  async load(): Promise<Survey[]> {
    return mockSurveys();
  }
}
