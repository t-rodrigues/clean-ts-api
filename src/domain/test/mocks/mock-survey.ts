import { Survey } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases';

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
    {
      image: 'other_image',
      answer: 'other_answer',
    },
  ],
  date: new Date(),
});

export const mockSurvey = (): Survey =>
  Object.assign({}, { id: 'any_id' }, mockAddSurveyParams());

export const mockSurveys = (): Survey[] => [mockSurvey(), mockSurvey()];
