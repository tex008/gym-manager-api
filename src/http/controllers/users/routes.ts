import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/verify-jwt'
import { autheticate } from './authenticate'
import { profile } from './profile'
import { refresh } from './refresh'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', autheticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.patch('/token/refresh', refresh)
}
