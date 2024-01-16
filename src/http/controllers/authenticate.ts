import { makeAuthenticateUseCase } from '@/usecases/factories/make.authenticate-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function autheticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)
  const authenticateUseCase = makeAuthenticateUseCase()

  await authenticateUseCase.execute({ email, password })

  return reply.status(200).send()
}
