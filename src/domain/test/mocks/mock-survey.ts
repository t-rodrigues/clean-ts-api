import { Survey } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases';

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image_1',
      answer: 'any_answer_1',
    },
    {
      image: 'any_image_2',
      answer: 'any_answer_2',
    },
    {
      image: 'any_image_3',
      answer: 'any_answer_3',
    },
  ],
  date: new Date(),
});

export const mockSurvey = (): Survey =>
  Object.assign({}, { id: 'any_id' }, mockAddSurveyParams());

export const mockSurveys = (): Survey[] => [mockSurvey(), mockSurvey()];
