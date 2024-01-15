import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '../usecases/errors/user-already-exists-error'
import { RegisterUseCase } from '../usecases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      reply.status(409).send({
        message: error.message,
      })
    }
    reply.status(500).send({
      message: 'Internal server error.',
    })
  }

  return reply.status(201).send()
}
