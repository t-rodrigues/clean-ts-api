import {
  badRequest,
  serverError,
  unauthorized,
  forbidden,
} from './components/';

export const components = {
  securitySchemes: {
    apiKeyAuth: {
      $ref: '#/schemas/apiKeyAuth',
    },
  },
  badRequest,
  forbidden,
  unauthorized,
  serverError,
};
