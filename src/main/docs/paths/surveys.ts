export const surveyPath = {
  get: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Enquete'],
    summary: 'API para listar todas as enquetes',
    description:
      'Essa rota só pode ser executada por **usuários autenticados**',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'applicaiton/json': {
            schema: {
              $ref: '#/schemas/surveys',
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

  post: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Enquete'],
    summary: 'API para criar uma enquete',
    description:
      'Essa rota só pode ser executada por **usuários autenticados**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Sucesso, mas sem dados para exibir',
      },
      400: {
        $ref: '#/components/badRequest',
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
