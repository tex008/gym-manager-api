import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '../usecases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (error) {
    reply.status(409).send({
      message: 'Oops. User with same email already exists',
    })
  }

  return reply.status(201).send()
}
