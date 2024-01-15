import { FastifyInstance } from 'fastify'
import { autheticate } from './controllers/authenticate'
import { register } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', autheticate)
}
