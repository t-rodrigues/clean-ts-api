import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/contracts';
import { Survey } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases';

import { mockSurvey, mockSurveys } from '@/domain/test/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  survey = mockSurvey();
  id: string;

  async loadById(id: string): Promise<Survey> {
    this.id = id;

    return this.survey;
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveys = mockSurveys();
  accountId: string;

  async loadAll(accountId: string): Promise<Survey[]> {
    this.accountId = accountId;

    return this.surveys;
  }
}
