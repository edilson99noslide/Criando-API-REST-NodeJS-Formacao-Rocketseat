import { test, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('O usuário consegue criar uma nova transação', async () => {
  await supertest(app.server)
    .post('/transactions')
    .send({
      title: 'Nova request',
      amount: 1000,
      type: 'credit'
    })
    .expect(201)
})