import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch check-in history Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch check-ins history', async () => {
    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })
    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })
    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-03',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(3)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
      expect.objectContaining({ gym_id: 'gym-03' }),
    ])
  })

  it('should be able to fetch paginated check-ins history', async () => {
    const CHECK_INS_LENGTH = 25

    for (let index = 1; index <= CHECK_INS_LENGTH; index++) {
      await checkInRepository.create({
        gym_id: `gym-${index.toString().padStart(2, '0')}`,
        user_id: `user-01`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(5)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
      expect.objectContaining({ gym_id: 'gym-23' }),
      expect.objectContaining({ gym_id: 'gym-24' }),
      expect.objectContaining({ gym_id: 'gym-25' }),
    ])
  })
})
