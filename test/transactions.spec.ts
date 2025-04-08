import {it, beforeAll, afterAll, describe, expect} from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // Deve ser possível criar uma transação
  it('must be possible to create a transaction', async () => {
    await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Nova request',
        amount: 1000,
        type: 'credit'
      })
      .expect(201)
  })

  // Deve ser possível listar todas as transações
  it('should be possible to list all transactions', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Nova request',
        amount: 1000,
        type: 'credit'
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', String(cookies))
      .expect(200)

    console.log(listTransactionsResponse.body)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Nova request',
        amount: 1000
      })
    ])
  })
})