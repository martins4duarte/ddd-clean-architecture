import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('it should be able to fetch recent questions', async () => {

    const firstQuestion = makeQuestion({
      createdAt: new Date(2024, 0, 1)
    })
    const secondQuestion = makeQuestion({
      createdAt: new Date(2024, 0, 4)
    })

    await inMemoryQuestionsRepository.create(firstQuestion)
    await inMemoryQuestionsRepository.create(secondQuestion)

    await sut.execute({
      page: 1
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject(secondQuestion)
    expect(inMemoryQuestionsRepository.items[1]).toMatchObject(firstQuestion)
  })

  it('it should be able to fetch paginated recent questions', async () => {

    const firstQuestion = makeQuestion({
      createdAt: new Date(2024, 0, 1)
    })
    const secondQuestion = makeQuestion({
      createdAt: new Date(2024, 0, 4)
    })
    const thirtyQuestion = makeQuestion({
      createdAt: new Date(2024, 0, 8)
    })

    await inMemoryQuestionsRepository.create(firstQuestion)
    await inMemoryQuestionsRepository.create(secondQuestion)
    await inMemoryQuestionsRepository.create(thirtyQuestion)

    const firstResult = await sut.execute({
      page: 1,
      limit: 2
    })

    const secondResult = await sut.execute({
      page: 2,
      limit: 2
    })

    if (firstResult.isSuccess()) {
      expect(firstResult.value?.questions).toEqual([
        expect.objectContaining(thirtyQuestion),
        expect.objectContaining(secondQuestion)
      ])
    }

    if (secondResult.isSuccess()) {
      expect(secondResult.value?.questions).toEqual([
        expect.objectContaining(firstQuestion)
      ])
    }



    

  })


})

