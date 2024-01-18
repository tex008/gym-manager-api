import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public databaseCheckIns: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.databaseCheckIns.find((checkIn) => checkIn.id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    return this.databaseCheckIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const dayStart = dayjs(date).startOf('date')
    const dayEnd = dayjs(date).endOf('date')

    const checkInOnSameDate = this.databaseCheckIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(dayStart) && checkInDate.isBefore(dayEnd)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate
  }

  async countByUserId(userId: string): Promise<number> {
    return this.databaseCheckIns.filter((checkIn) => checkIn.user_id === userId)
      .length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.databaseCheckIns.push(checkIn)
    return checkIn
  }

  async update(checkIn: CheckIn) {
    const checkInIndex = this.databaseCheckIns.findIndex(
      (gym) => gym.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.databaseCheckIns[checkInIndex] = checkIn
    }

    return checkIn
  }
}
