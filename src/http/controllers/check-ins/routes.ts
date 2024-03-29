import { verifyUserRole } from '@/http/middleware/verify-user-role'
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/verify-jwt'
import { create } from './create'
import { history } from './history'
import { metrics } from './metrics'
import { validate } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-in', create)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
