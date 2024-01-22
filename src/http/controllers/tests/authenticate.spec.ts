import { app } from '@/app'
import requests from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await requests(app.server).post('/users').send({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password: '12345678',
    })

    const response = await requests(app.server).post('/sessions').send({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
