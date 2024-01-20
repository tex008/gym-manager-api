import { FastifyInstance } from 'fastify'
import { autheticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { register } from './controllers/register'
import { verifyJWT } from './middleware/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', autheticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
