import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkin-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const checkInPrismaRepository = new PrismaCheckInsRepository()
  const getUserMetricsUseCase = new GetUserMetricsUseCase(
    checkInPrismaRepository,
  )

  return getUserMetricsUseCase
}
