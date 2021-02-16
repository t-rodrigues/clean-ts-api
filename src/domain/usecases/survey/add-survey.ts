import { SurveyAnswer } from '@/domain/entities';

export type AddSurveyDTO = {
  question: string;
  answers: SurveyAnswer[];
  date: Date;
};

export interface AddSurvey {
  add(addSurveyData: AddSurveyDTO): Promise<void>;
}
