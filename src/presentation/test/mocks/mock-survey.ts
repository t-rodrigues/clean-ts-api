import { Survey } from '@/domain/entities';
import {
  AddSurvey,
  AddSurveyParams,
  LoadSurveyById,
  LoadSurveys,
} from '@/domain/usecases';

import { mockSurvey, mockSurveys } from '@/domain/test/mocks';

export class AddSurveySpy implements AddSurvey {
  addSurveyData: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyData = data;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  survey = mockSurvey();
  surveyId: string;

  async loadById(surveyId: string): Promise<Survey | null> {
    this.surveyId = surveyId;

    return this.survey;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveys = mockSurveys();
  accountId: string;

  async load(accountId: string): Promise<Survey[]> {
    this.accountId = accountId;

    return this.surveys;
  }
}
