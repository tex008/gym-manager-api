import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { RegisterUseCase } from '../register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@test.com',
      password: '25031908',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user pasword upon registration', async () => {
    const { user } = await sut.execute({
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
    const email = 'jonhdoe@test.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '25031908',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe 2',
        email,
        password: '25031908',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
