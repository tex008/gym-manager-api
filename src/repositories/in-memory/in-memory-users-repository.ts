import { UsersRepository } from '../user-repository'

import { Prisma, User } from '@prisma/client'
// import { Prisma, User } from '@prisma/client'
// import { UsersRepository } from './../user-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public databaseUsers: User[] = []

  async findByEmail(email: string) {
    const user = this.databaseUsers.find((user) => user.email === email)

    if (!user) return null

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: '1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.databaseUsers.push(user)
    return user
  }
}
