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

  const { user } = await authenticateUseCase.execute({ email, password })
  const token = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
