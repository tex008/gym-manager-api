import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public databaseCheckIns: CheckIn[] = []

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
}
