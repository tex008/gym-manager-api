import { verifyUserRole } from '@/http/middleware/verify-user-role'
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/verify-jwt'
import { create } from './create'
import { nearby } from './nearby'
import { search } from './search'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/nearby', nearby)
  app.get('/gyms/search', search)
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
