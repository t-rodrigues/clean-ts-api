import { SurveyAnswer } from '@/domain/entities';

export type AddSurveyParams = {
  question: string;
  answers: SurveyAnswer[];
  date: Date;
};

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
