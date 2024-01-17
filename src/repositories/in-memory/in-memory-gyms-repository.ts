import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymsRepository } from '../gym-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public databaseGyms: Gym[] = []

  async findById(id: string) {
    const gym = this.databaseGyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      phone: data.phone ?? null,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.databaseGyms.push(gym)

    return gym
  }
}
