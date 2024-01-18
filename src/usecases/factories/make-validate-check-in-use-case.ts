import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkin-repository'
import { ValidateCheckInUseCase } from '../validate-checkin'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
