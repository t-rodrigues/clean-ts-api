import { paths } from './paths';
import { schemas } from './schemas';
import { components } from './components';

export const swaggerConfig = {
  openapi: '3.0.1',
  info: {
    title: 'Clean-TS-API',
    description:
      'Essa é a documentação da API feita pelo instrutor Rodrigo Manguinho no curso da Udemy de NodeJs usando Typescript, TDD, Clean Architecture e seguindo os princípios do SOLID e Design Patterns.',
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
      description: 'Servidor principal',
    },
  ],
  tags: [
    {
      name: 'Login',
      description: 'APIs relacionadas a Login',
    },
    {
      name: 'Enquete',
      description: 'APIs relacionadas a Enquete',
    },
  ],
  paths,
  schemas,
  components,
};
