import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findById(checkIn: string): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  countByUserId(userId: string): Promise<number>
  update(checkIn: CheckIn): Promise<CheckIn>
}
