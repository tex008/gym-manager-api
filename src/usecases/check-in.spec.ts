import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.databaseGyms.push({
      id: 'gym-01',
      title: 'Academia do João Frango',
      description: 'Academia do Bairro',
      phone: '31999999999',
      latitude: new Decimal(-23.5477907),
      longitude: new Decimal(-46.7206144),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5477907,
      userLongitude: -46.7206144,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5477907,
      userLongitude: -46.7206144,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.5477907,
        userLongitude: -46.7206144,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, but not in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5477907,
      userLongitude: -46.7206144,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5477907,
      userLongitude: -46.7206144,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on a gym further than the distance limit', async () => {
    gymsRepository.databaseGyms.push({
      id: 'gym-02',
      title: 'Academia bem longe',
      description: 'Academia do Bairro',
      phone: '31999999999',
      latitude: new Decimal(19.9514008),
      longitude: new Decimal(-44.0506493),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.5477907,
        userLongitude: -46.7206144,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
