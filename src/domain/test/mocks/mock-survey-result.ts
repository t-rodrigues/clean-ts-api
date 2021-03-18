import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSaveSurveyResult = (): SurveyResult => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    { answer: 'any_answer', count: 1, percent: 50 },
    { answer: 'other_answer', count: 1, percent: 50 },
  ],
  date: new Date(),
});
