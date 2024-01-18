import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from '../search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Fetch check-in history Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'João Frango"s Gym',
      description: null,
      phone: null,
      latitude: -23.5477907,
      longitude: -46.7206144,
    })
    await gymsRepository.create({
      title: 'José Frango"s Gym',
      description: null,
      phone: null,
      latitude: -23.5477907,
      longitude: -46.7206144,
    })

    const { gyms } = await sut.execute({
      query: 'José',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'José Frango"s Gym' }),
    ])
  })

  it('should be able to page search for gyms', async () => {
    const CHECK_INS_LENGTH = 25

    for (let index = 1; index <= CHECK_INS_LENGTH; index++) {
      await gymsRepository.create({
        title: `João Frango"s Gym ${index}`,
        description: null,
        phone: null,
        latitude: -23.5477907,
        longitude: -46.7206144,
      })
    }

    const { gyms } = await sut.execute({
      query: 'João',
      page: 2,
    })

    expect(gyms).toHaveLength(5)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'João Frango"s Gym 21' }),
      expect.objectContaining({ title: 'João Frango"s Gym 22' }),
      expect.objectContaining({ title: 'João Frango"s Gym 23' }),
      expect.objectContaining({ title: 'João Frango"s Gym 24' }),
      expect.objectContaining({ title: 'João Frango"s Gym 25' }),
    ])
  })
})
