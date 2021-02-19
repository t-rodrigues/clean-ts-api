import { paths } from './paths';
import { schemas } from './schemas';
import { components } from './components';

export const swaggerConfig = {
  openapi: '3.0.1',
  info: {
    title: 'Clean-TS-API',
    description:
      'API do curso do Manguinho, projeto para realizar enquetes entre programadores',
    version: '1.0.0',
    contact: {
      name: 'Thiago Rodrigues',
      email: 'thiagor_@live.com',
      url: 'https://www.linkedin.com/in/rodrigues-thiago',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/t-rodrigues/clean-ts-api/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'login',
      description: 'APIs relacionadas a Login',
    },
    {
      name: 'signup',
      description: 'description',
    },
    {
      name: 'surveys',
      description: 'APIs relacionadas a Enquete',
    },
  ],
  paths,
  schemas,
  components,
};
