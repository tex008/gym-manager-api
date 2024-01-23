import { makeRegisterUseCase } from '@/usecases/factories/make-register-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  const registerUseCase = makeRegisterUseCase()

  await registerUseCase.execute({ name, email, password })

  return reply.status(201).send()
}
