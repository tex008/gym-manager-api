import { app } from '@/app'
import requests from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await requests(app.server).post('/users').send({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password: '12345678',
    })

    const authResponse = await requests(app.server).post('/sessions').send({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password: '12345678',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await requests(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
