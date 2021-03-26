import faker from 'faker';

import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: faker.random.uuid(),
  accountId: faker.random.uuid(),
  answer: faker.random.word(),
  date: faker.date.recent(),
});

export const mockLoadSurveyResultParams = (): string => 'any_survey_id';

export const mockSurveyResult = (): SurveyResult => ({
  surveyId: faker.random.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.word(),
      count: faker.random.number({ min: 0, max: 1000 }),
      percent: faker.random.number({ min: 0, max: 100 }),
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
      count: faker.random.number({ min: 0, max: 1000 }),
      percent: faker.random.number({ min: 0, max: 100 }),
    },
  ],
  date: faker.date.recent(),
});

export const mockEmptySurveyResultModel = (): SurveyResult => ({
  surveyId: faker.random.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.word(),
      count: 0,
      percent: 0,
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
      count: 0,
      percent: 0,
    },
  ],
  date: faker.date.recent(),
});
