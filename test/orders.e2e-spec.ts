import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a market BUY order and return FILLED or REJECTED', async () => {
    const res = await request(app.getHttpServer()).post('/orders').send({
      userId: 1,
      instrumentId: 35,
      side: 'BUY',
      type: 'MARKET',
      size: 1,
    });

    expect(res.status).toBe(201);
  });
});
