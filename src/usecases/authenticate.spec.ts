import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare, hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialError } from './errors/invalid-credentials-error'

describe('Register Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()

    await usersRepositoryInMemory.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password_hash: await hash('25031908', 6),
    })

    // ust = System Under Test
    const sut = new AuthenticateUseCase(usersRepositoryInMemory)

    const { user } = await sut.execute({
      email: 'jonhdoe@test.com',
      password: '25031908',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()

    // ust = System Under Test
    const sut = new AuthenticateUseCase(usersRepositoryInMemory)

    await expect(() =>
      sut.execute({
        email: 'jonhdoe@test.com',
        password: '25031908',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()

    await usersRepositoryInMemory.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@test.com',
      password_hash: await hash('25031908', 6),
    })

    // ust = System Under Test
    const sut = new AuthenticateUseCase(usersRepositoryInMemory)

    await expect(() =>
      sut.execute({
        email: 'jonhdoe@test.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
