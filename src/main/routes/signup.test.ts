import request from 'supertest';
import app from '@/main/config/app';

describe('SignUpRoute', () => {
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Thiago',
        email: 'thiagor_@live.com',
        password: '123123',
        passwordConfirmation: '123123',
      })
      .expect(201);
  });
});
