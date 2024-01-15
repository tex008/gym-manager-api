import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepositoryInMemory)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'jonhdoe@test.com',
      password: '25031908',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user pasword upon registration', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepositoryInMemory)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'jonhdoe@test.com',
      password: '25031908',
    })

    const isPasswordCorrectlyHashed = await compare(
      '25031908',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepositoryInMemory)

    const email = 'jonhdoe@test.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '25031908',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe 2',
        email,
        password: '25031908',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
