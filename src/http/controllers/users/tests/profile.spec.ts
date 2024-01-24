import { app } from '@/app'
import requests from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
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

    const { token } = authResponse.body

    const profileResponse = await requests(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'jonhdoe@test.com',
      }),
    )
  })
})
