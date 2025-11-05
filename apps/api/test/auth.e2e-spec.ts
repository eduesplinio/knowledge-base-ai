/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sync user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/sync')
      .send({
        email: 'test@test.com',
        name: 'Test',
        githubId: '123',
      })
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    userId = res.body._id as string;
  });

  it('should reject space creation without auth', () => {
    return request(app.getHttpServer())
      .post('/spaces')
      .send({ name: 'Test' })
      .expect(401);
  });

  it('should create space with auth', () => {
    return request(app.getHttpServer())
      .post('/spaces')
      .set('x-user-id', userId)
      .send({ name: 'Test Space' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('authorId', userId);
      });
  });

  it('should reject article creation without auth', () => {
    return request(app.getHttpServer())
      .post('/articles')
      .send({
        title: 'Test',
        content: 'Test',
        spaceId: '507f1f77bcf86cd799439011',
      })
      .expect(401);
  });

  it('should create article with auth', async () => {
    const space = await request(app.getHttpServer())
      .post('/spaces')
      .set('x-user-id', userId)
      .send({ name: 'Space' });

    const spaceId = space.body._id as string;

    return request(app.getHttpServer())
      .post('/articles')
      .set('x-user-id', userId)
      .send({
        title: 'Article',
        content: 'Content',
        spaceId: spaceId,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('authorId', userId);
      });
  });
});
