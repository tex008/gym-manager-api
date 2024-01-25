import { FastifyReply, FastifyRequest } from 'fastify'

type UserRole = 'ADMIN' | 'MEMBER'

export function verifyUserRole(role: UserRole) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    switch (role) {
      case 'ADMIN':
        break
      case 'MEMBER':
        return reply.status(401).send({
          message: 'Unauthorized.',
        })
      default:
        break
    }
  }
}
