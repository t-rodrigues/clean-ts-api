import { SurveyResult } from '@/domain/entities';

export const mockSaveSurveyResultParams = (): Omit<SurveyResult, 'id'> => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSaveSurveyResult = (): SurveyResult =>
  Object.assign({}, mockSaveSurveyResultParams(), {
    id: 'any_id',
  });
