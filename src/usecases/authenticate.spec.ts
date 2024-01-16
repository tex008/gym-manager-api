import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
// sut = System Under Test
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password_hash: await hash('25031908', 6),
    })

    const { user } = await sut.execute({
      email: 'jonhdoe@test.com',
      password: '25031908',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jonhdoe@test.com',
        password: '25031908',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password_hash: await hash('25031908', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'jonhdoe@test.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
