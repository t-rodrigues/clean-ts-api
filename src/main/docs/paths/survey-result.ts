export const surveyResultPath = {
  put: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Enquete'],
    summary: 'API para criar a resposta de uma enquete',
    description:
      'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        name: 'surveyId',
        in: 'path',
        description: 'ID da enquete a ser respondida',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'applicaiton/json': {
            schema: {
              $ref: '#/schemas/surveyResult',
            },
          },
        },
      },
      403: {
        $ref: '#/components/forbidden',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
