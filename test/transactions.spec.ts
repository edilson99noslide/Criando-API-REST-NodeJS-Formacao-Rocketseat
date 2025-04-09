import {it, beforeAll, afterAll, beforeEach, describe, expect} from 'vitest'
import {execSync} from "node:child_process"
import supertest from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npx knex migrate:rollback --all')
    execSync('npx knex migrate:latest')
  })

  // Deve ser possível criar uma transação
  it('should be possible to create a transaction', async () => {
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

  // Deve ser possível listar uma transação específica
  it('should be possible to list a specific transaction', async () => {
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

    const transactionId = listTransactionsResponse.body.transactions[0].id

    console.log(transactionId)

    const transactionsResponse = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', String(cookies))
      .expect(200)

    expect(transactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Nova request',
        amount: 1000
      })
    )
  })

  // Deve ser possível listar o resumo de transações
  it('should be possible to list the transaction summary', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Request de crédito',
        amount: 3000,
        type: 'credit'
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await supertest(app.server)
      .post('/transactions')
      .set('Cookie', String(cookies))
      .send({
        title: 'Request de débito',
        amount: 1600,
        type: 'debit'
      })

    const summaryResponse = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
        amount: 1400
      }
    )
  })
})