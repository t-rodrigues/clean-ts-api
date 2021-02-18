import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/contracts';
import { Survey } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases';

import { mockSurvey, mockSurveys } from '@/domain/test/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  async add(addSurveyDTO: AddSurveyParams): Promise<void> {
    return null;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  async loadById(id: string): Promise<Survey> {
    return Promise.resolve(mockSurvey());
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  async loadAll(): Promise<Survey[]> {
    return Promise.resolve(mockSurveys());
  }
}
