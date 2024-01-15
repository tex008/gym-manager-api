import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'
import { InvalidCredentialError } from './usecases/errors/invalid-credentials-error'
import { UserAlreadyExistsError } from './usecases/errors/user-already-exists-error'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }
  switch (true) {
    case error instanceof ZodError:
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })

    case error instanceof UserAlreadyExistsError:
      return reply.status(409).send({
        message: error.message,
      })

    case error instanceof InvalidCredentialError:
      return reply.status(403).send({
        message: error.message,
      })
    default:
      return reply.status(500).send({ message: 'Internal server error.' })
  }
})
