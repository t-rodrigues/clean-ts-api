import { loginParamsSchema, accountSchema, errorSchema } from './schemas/';

export const schemas = {
  account: accountSchema,
  error: errorSchema,
  loginParams: loginParamsSchema,
};
