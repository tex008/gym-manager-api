import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymsRepository, findManyByNearbyParams } from '../gym-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public databaseGyms: Gym[] = []

  async findById(id: string) {
    const gym = this.databaseGyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async findManyByNearby(params: findManyByNearbyParams) {
    return this.databaseGyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.databaseGyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
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
