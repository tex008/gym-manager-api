import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../user-repository'

export class InMemoryUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = this.databaseUsers.find((user) => user.id === id)

    if (!user) return null

    return user
  }

  public databaseUsers: User[] = []

  async findByEmail(email: string) {
    const user = this.databaseUsers.find((user) => user.email === email)

    if (!user) return null

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.databaseUsers.push(user)
    return user
  }
}
