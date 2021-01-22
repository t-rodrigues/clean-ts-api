import { AddSurveyDTO } from '@domain/usecases/survey';

export interface AddSurveyRepository {
  add(addSurveyDTO: AddSurveyDTO): Promise<void>;
}
