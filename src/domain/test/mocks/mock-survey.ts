import faker from 'faker';

import { Survey } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases';

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
    },
    {
      answer: faker.random.word(),
    },
  ],
  date: faker.date.recent(),
});

export const mockSurvey = (): Survey => ({
  id: faker.random.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.word(),
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
    },
  ],
  date: faker.date.recent(),
});

export const mockSurveys = (): Survey[] => [mockSurvey(), mockSurvey()];
