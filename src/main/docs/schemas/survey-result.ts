export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string',
    },
    accountId: {
      type: 'string',
    },
    answer: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
  },
  required: ['surveyId', 'accountId', 'answer', 'date'],
};
