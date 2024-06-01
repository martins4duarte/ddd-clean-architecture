import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import moment from 'moment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('it should be able to fetch recent questions', async () => {

    const firstQuestion = makeQuestion({
      createdAt: moment.utc().toDate()
    })
    const secondQuestion = makeQuestion({
      createdAt: moment.utc().add(1).toDate()
    })

    await inMemoryQuestionsRepository.create(firstQuestion)
    await inMemoryQuestionsRepository.create(secondQuestion)

    const { questions } = await sut.execute({
      page: 1
    })

    console.log(questions)

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject(secondQuestion)
    expect(inMemoryQuestionsRepository.items[1]).toMatchObject(firstQuestion)
  })

  it('it should be able to fetch paginated recent questions', async () => {

    const firstQuestion = makeQuestion({
      createdAt: moment.utc().toDate()
    })
    const secondQuestion = makeQuestion({
      createdAt: moment.utc().add(1).toDate()
    })

    const thirtyQuestion = makeQuestion({
      createdAt: moment.utc().add(2).toDate()
    })

    await inMemoryQuestionsRepository.create(firstQuestion)
    await inMemoryQuestionsRepository.create(secondQuestion)
    await inMemoryQuestionsRepository.create(thirtyQuestion)

    const { questions: firstPageQuestions } = await sut.execute({
      page: 1,
      limit: 2
    })

    const { questions: secondPageQuestions } = await sut.execute({
      page: 2,
      limit: 2
    })

    expect(firstPageQuestions).toEqual([
      expect.objectContaining(thirtyQuestion),
      expect.objectContaining(secondQuestion)
    ])

    expect(secondPageQuestions).toEqual([
      expect.objectContaining(firstQuestion)
    ])

  })

  
})

